#!/usr/bin/env node
/**
 * sweep.mjs — the Doc Index sweep as a local Node orchestrator
 * (version history: local/CHANGES.md; the pure helpers live in
 * local/lib/ since the v1.31 module split — util, doclinks,
 * presentation, bodyindex, statuspage, config).
 * Replaces the DocIndexSweep Power Automate cloud flow (v2.8): same
 * pipeline, same list writes, same sidecar bytes — no Power Automate,
 * no Run-script quota, no AI Builder.
 *
 * Faithful to flow/v2_8/definition.json (see the orchestration spec
 * extracted 2026-08-14). The scripts/ files run UNMODIFIED via
 * pad/runner/ops.mjs (the gated PAD loader); the AI Builder call
 * becomes a direct LLM API call using the same prompt file
 * (local/llm.mjs); list writes go through Microsoft Graph
 * (local/graph.mjs); document reads and all file writes (sidecars,
 * media, patched neighbors) go through the OneDrive-synced libraries
 * as plain file I/O.
 *
 * Usage:
 *   node --experimental-strip-types local/sweep.mjs --config local/config.json
 *        [--live | --dry-run]   override config.sweep.dryRun
 *        [--max N]              override MaxDocsPerRun
 *        [--only <filename>]    SmokeFile equivalent (single-doc run)
 *
 * Deliberate deviations from the cloud flow (each equivalent, all
 * documented in Local_Setup.md §6):
 *  - Per-doc Check_* GetItems queries are replaced by run-start list
 *    snapshots kept in memory. Loops were concurrency-1 in the cloud
 *    and this process is the only writer during a run, so
 *    cache-then-create ≡ query-then-create.
 *  - `mode: "final"` is passed without the flow's trailing space
 *    (RelatedRank: "unknown mode reads as final" — identical path).
 *  - Recycle_old_sidecar becomes a local file delete (OneDrive syncs
 *    the delete; SharePoint's recycle bin still catches it).
 *  - The AI response is schema-guaranteed JSON (no brace-slice
 *    parsing needed); malformed output still lands in the Error lane.
 *  - XmlBuf (vestigial in the flow) does not exist here.
 *
 * Dry-run mode executes all reads and all compute but records every
 * write (Graph create/patch, file write/delete) into a plan instead
 * of performing it, and reports the DocKey calibration check —
 * run it first on a fresh machine (Local_Setup.md §5).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { loadScripts, runOp, DEFAULT_SCRIPTS_DIR } from "../pad/runner/ops.mjs";
import { GraphClient, SpoClient } from "./graph.mjs";
import { classifyDoc } from "./llm.mjs";
import { assertNodeVersion, validateConfig, SWEEP_REQUIRED } from "./lib/config.mjs";
import {
  lower, cut, folderOf, yamlEscape, stripQuotes, pipeToSlash, fmtDate,
  quoteYamlItem, htmlToText, num, hyperlink, urlToLocal, folderToLocal,
  pruneRunLogs, exportListSnapshots,
} from "./lib/util.mjs";
import { sendAlert, recordHeartbeat, checkHeartbeat } from "./lib/alerts.mjs";
import { writeIndexPages } from "./lib/indexpages.mjs";
import {
  loadDocLinks, DocPageIndex, ToolLinkResolver, docsBlock,
  upsertDocsBlock, bodySeamEnd, yamlList,
} from "./lib/doclinks.mjs";
import { placeFigure, tidyBody, caseHeadings, compactWhy } from "./lib/presentation.mjs";
import { BodyIndex } from "./lib/bodyindex.mjs";
import { writeStatusPage } from "./lib/statuspage.mjs";

// ---- flow v2.8 Config defaults (override via config.sweep) ----------

const FLOW_DEFAULTS = {
  siteUrl: "https://esriis.sharepoint.com/sites/lrsworkspace",
  textsFolder: "/LRS Doc Index",
  smokeFile: "",
  defaultRepo: "ArcGISPro/ps-location-referencing",
  promptVersion: "v2.0",
  textCap: 100000,
  previewCap: 5000,
  maxDocsPerRun: 150,
  relatedTopN: 5,
  relatedShortlist: 12,
  relatedBodySimMin: 0.15,
  myKwsTop: 100,
  sharersTop: 2000,
  linksTop: 200,
  relatedWeights:
    '{"edge":{"id":1000,"review":100,"gantt":60,"titlematch":40},' +
    '"kwKind":{"topic":1.0,"tool":0.6,"product":0.4},' +
    '"meta":{"kind":0.5,"surface":0.5,"release":1.0,"pe":0.75,"dev":0.75},' +
    '"title":{"weight":0.4,"cap":6},' +
    '"recency":{"weight":1.0,"halfLifeDays":180},' +
    '"softCap":999,"tops":{"myKws":100,"sharers":2000,"links":200}}',
  kindFolders: {
    "Test Plan": "Test Plans",
    "User Story": "User Stories",
    "Design Spike": "Design Spikes",
    "Data Template": "Data Templates",
    Schedule: "Schedules",
    "Doc Review": "Doc Reviews",
    Other: "Other",
  },
  maxCellsWorkbookDump: 60000,
  // v1.10: 50 MB. The flow's 3.5 MB cap was a Power Automate/Office
  // Scripts payload limit; locally it's only a memory/time guard, so
  // big decks — often the richest docs — index instead of skipping.
  // (LLM input is still bounded by textCap regardless of file size.)
  oversizeBytes: 52428800,
};

const DOC_KINDS = [
  "Test Plan", "User Story", "Design Spike", "Data Template",
  "Schedule", "Doc Review", "Other",
];
const SURFACES = ["Pro", "Experience Builder", "Server", "Enterprise", "Other"];
const KNOWN_EXT = ["pptx", "docx", "xlsx", "pdf", "msg", "txt", "html"];
const IMAGE_EXT = ["png", "jpg", "jpeg", "tif", "tiff", "gif", "bmp"];

/**
 * extractDocText — the flow's Switch_ext lane dispatch, shared by
 * indexDoc and the `--reformat` pass (which re-extracts without
 * spending an AI call). withMedia=false skips media extraction:
 * the images are already on disk from the original index.
 */
function extractDocText({ sw, cfg, op, writer, pdfTool, ocrTools, setStep, localPath, ext, srcItemId, modified, withMedia }) {
  let docText = "", relsText = "", lane = "none";
  let figureCount = 0, figureError = "";
  let srcAuthor = "", srcEditor = "", srcEdited = "";
  const size = fs.existsSync(localPath) ? fs.statSync(localPath).size : 0;
  const oversize = size > sw.oversizeBytes && ext !== "xlsx";
  if (!fs.existsSync(localPath)) {
    // in scope but absent on disk: usually OneDrive lag — a real
    // Error so it retries nightly until the file lands
    throw new Error(`source file not found locally (OneDrive sync lag or unsynced subfolder?): ${localPath}`);
  }

  if (!oversize && (ext === "pptx" || ext === "docx")) {
    setStep(`ziptext-${ext}`);
    const zt = op({
      op: "ziptext", zipFile: localPath,
      mediaPrefix: `../media/doc${srcItemId}_`,
    });
    docText = zt.text || "";
    relsText = zt.rels || "";
    lane = "xmlstrip";
    srcAuthor = zt.author || "";
    srcEditor = zt.lastEditedBy || "";
    srcEdited = zt.lastEdited || modified || "";
    if (withMedia && zt.media && zt.media.length) {
      setStep("media");
      const md = op({ op: "media", zipFile: localPath });
      for (const img of md.images || []) {
        const imgPath = path.join(cfg.paths.sidecarLibrary, "media", `doc${srcItemId}_${img.name}`);
        writer.writeFile(imgPath, Buffer.from(img.b64 || img.base64 || "", "base64"));
      }
    }
    // v1.23: slide diagrams as SVG figures. ZipTextExtract still collapses a
    // slide's loose diagram labels to its "[figure: ...]" caption (so a
    // cloud-flow rollback keeps that behaviour); here the caption is replaced
    // by the rendered figure. Always re-rendered, never AI: --reformat picks
    // up figure changes for free.
    if (ext === "pptx") {
      try {
        setStep("figures");
        const fg = op({ op: "figures", zipFile: localPath });
        const figs = (fg && fg.figures) || [];
        const bySlide = new Map();
        for (const f of figs) {
          const name = `doc${srcItemId}_${f.name}`;
          writer.writeFile(path.join(cfg.paths.sidecarLibrary, "media", name), f.svg);
          if (!bySlide.has(f.slide)) bySlide.set(f.slide, []);
          bySlide.get(f.slide).push({ href: `../media/${name}`, alt: f.alt, anchor: f.anchor });
        }
        for (const [slide, items] of bySlide) {
          docText = placeFigure(docText, slide, items);
        }
        figureCount = figs.length;
        if (figs.length) setStep(`figures-${figs.length}`);
      } catch (e) {
        // a figure is an enhancement, never a reason to fail an index — but
        // it must not fail SILENTLY either: swallowing this hid a missing
        // script registration for a whole corpus pass (123 bodies rewritten,
        // zero figures, no error anywhere).
        figureError = e.message;
        process.stderr.write(`FIGURES ${path.basename(localPath)}: ${e.message}\n`);
        setStep("figures-skipped");
      }
    }
  } else if (!oversize && ext === "xlsx") {
    setStep("workbookdump");
    docText = op({ op: "workbookdump", xlsxFile: localPath, maxCells: sw.maxCellsWorkbookDump });
    lane = "workbookdump";
  } else if (!oversize && ext === "txt") {
    setStep("read-txt");
    docText = fs.readFileSync(localPath, "utf8");
    lane = "plaintext";
  } else if (!oversize && (ext === "html" || ext === "htm")) {
    // v1.10: the htmltotext lane the ExtractionLane schema always
    // reserved but no flow version implemented — HTML finally indexes
    setStep("htmltotext");
    docText = htmlToText(fs.readFileSync(localPath, "utf8"));
    lane = "htmltotext";
  } else if (!oversize && ext === "pdf" && pdfTool) {
    // pdftotext (Poppler). A text-bearing PDF indexes like any other
    // doc; a scanned/image-only one yields no text and falls through
    // to the Skip lane WITH lane="plaintext" recorded, which marks
    // "extraction was attempted" and keeps it out of the PDF rescue.
    setStep("pdftotext");
    const r = spawnSync(pdfTool, ["-layout", "-enc", "UTF-8", localPath, "-"], {
      encoding: "utf8", maxBuffer: 64 * 1024 * 1024,
    });
    if (r.error) throw new Error(`pdftotext: ${r.error.message}`);
    if (r.status !== 0) {
      throw new Error(`pdftotext exit ${r.status}: ${cut(String(r.stderr || ""), 300)}`);
    }
    docText = String(r.stdout || "").trim() === "" ? "" : r.stdout;
    lane = "plaintext";
    // OCR lane (v1.36, opt-in via sweep.tesseractPath): a text-less
    // PDF is usually a scan — render pages with pdftoppm and OCR them
    // with Tesseract. lane "ocr" marks the ATTEMPT either way, so a
    // scan OCR can't read is stamped once, never rechurned; rows
    // Skipped at lane "plaintext" re-enter once OCR exists (the PDF
    // rescue pattern). An OCR crash degrades to the Skip lane — an
    // enhancement must not put a doc in the Error lane.
    if (docText === "" && ocrTools) {
      setStep("ocr");
      try {
        docText = ocrPdf(ocrTools, localPath, sw);
      } catch (e) {
        process.stderr.write(`OCR ${path.basename(localPath)}: ${e.message}\n`);
        docText = "";
      }
      lane = "ocr";
    }
  }
  // pdf(no tool)/msg/image/other/oversize (and empty html): DocText
  // stays empty → Skip lane.
  return { docText, relsText, lane, srcAuthor, srcEditor, srcEdited,
           figureCount, figureError };
}

// ---- config ---------------------------------------------------------

function loadConfig(argv) {
  const args = { flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") args.config = argv[++i];
    else if (a === "--live") args.flags.live = true;
    else if (a === "--dry-run") args.flags.dry = true;
    else if (a === "--max") args.flags.max = Number(argv[++i]);
    else if (a === "--only") args.flags.only = argv[++i];
    else if (a === "--rerank") args.flags.rerank = true;
    else if (a === "--reformat") args.flags.reformat = true;
    else if (a === "--check-heartbeat") args.flags.checkHeartbeat = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.config) throw new Error("usage: sweep.mjs --config <config.json> [--live|--dry-run] [--max N] [--only <file>] [--rerank] [--reformat] [--check-heartbeat]");
  assertNodeVersion();
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  validateConfig(cfg, SWEEP_REQUIRED, args.config);
  cfg.sweep = { ...FLOW_DEFAULTS, ...(cfg.sweep || {}) };
  if (args.flags.live) cfg.sweep.dryRun = false;
  if (args.flags.dry) cfg.sweep.dryRun = true;
  if (args.flags.max !== undefined) {
    cfg.sweep.maxDocsPerRun = args.flags.max;
    cfg.sweep._maxSet = true; // rerank is uncapped unless --max is explicit
  }
  if (args.flags.only !== undefined) cfg.sweep.smokeFile = args.flags.only;
  if (args.flags.rerank) cfg.sweep.rerank = true;
  if (args.flags.reformat) cfg.sweep.reformat = true;
  if (args.flags.checkHeartbeat) cfg.sweep.checkHeartbeat = true;
  cfg.llm = cfg.llm || {};
  cfg.graph = cfg.graph || {};
  // device-mode refresh-token caches (one per resource) live in workDir
  const authDir = path.join(cfg.paths.workDir || ".", "auth");
  cfg.graph.tokenCache = cfg.graph.tokenCache || path.join(authDir, "graph.json");
  // the aibuilder provider inherits the Graph auth settings by default
  // (device mode: same tenant/sign-in, its own public client + cache;
  // app mode: same registration/secret)
  const inherit = { ...cfg.graph };
  const inheritMode = inherit.auth || (inherit.clientSecret !== undefined ? "app" : "device");
  // delegated modes (device / interactive): each resource keeps its own
  // public client — Dataverse has its own, and SPO must stay on the Graph
  // CLI client whose tokens carry real SharePoint permissions
  if (inheritMode === "device" || inheritMode === "interactive") delete inherit.clientId;
  delete inherit.baseUrl; // Graph-only
  cfg.llm.dataverse = {
    ...inherit,
    tokenCache: path.join(authDir, "dataverse.json"),
    ...(cfg.llm.dataverse || {}),
  };
  // SPO REST (hyperlink-column writes) inherits the same way; device
  // mode uses the Graph CLI public client and seeds its first token
  // from the Graph sign-in's cache — no extra prompt (SpoClient)
  cfg.spo = {
    ...inherit,
    siteUrl: (cfg.sweep.siteUrl || FLOW_DEFAULTS.siteUrl),
    baseUrl: cfg.sharePoint?.spoBaseUrl,
    tokenCache: path.join(authDir, "spo.json"),
    seedCachePath: cfg.graph.tokenCache,
    ...(cfg.spo || {}),
  };
  cfg.sharePoint.sourceSitePath = cfg.sharePoint.sourceSitePath || "/sites/LocationReferencing";
  cfg.sharePoint.docKeyStrip = cfg.sharePoint.docKeyStrip || "/sites/LocationReferencing/";
  cfg.sharePoint.libraryRootSegment = cfg.sharePoint.libraryRootSegment || "Shared Documents";
  return cfg;
}

// ---- write layer (real vs dry-run plan) -----------------------------

// Graph cannot write hyperlink columns (400 invalidRequest in every
// shape) — those two fields route through SPO ValidateUpdateListItem.
const HYPERLINK_FIELDS = new Set(["SourceLink", "TextFileUrl"]);

function splitHyperlinks(fields) {
  const rest = {};
  const links = {};
  for (const [k, v] of Object.entries(fields)) {
    (HYPERLINK_FIELDS.has(k) ? links : rest)[k] = v;
  }
  return { rest, links };
}

class Writer {
  constructor(graph, siteId, lists, dryRun, spo) {
    this.graph = graph;
    this.siteId = siteId;
    this.lists = lists;
    this.dryRun = dryRun;
    this.spo = spo;
    this.plan = [];
    this._pseudoId = -1;
  }
  log(action, target, detail) {
    this.plan.push({ action, target, detail });
  }
  async createRow(listKey, fields) {
    this.log("createRow", listKey, fields);
    if (this.dryRun) return { id: this._pseudoId-- };
    const { rest, links } = splitHyperlinks(fields);
    const res = await this.graph.createItem(this.siteId, this.lists[listKey], rest);
    if (Object.keys(links).length) {
      await this.spo.validateUpdate(this.lists[listKey], Number(res.id), links);
    }
    return { id: Number(res.id) };
  }
  async patchRow(listKey, id, fields) {
    this.log("patchRow", `${listKey}/${id}`, fields);
    if (this.dryRun) return;
    const { rest, links } = splitHyperlinks(fields);
    if (Object.keys(rest).length) {
      await this.graph.updateItemFields(this.siteId, this.lists[listKey], id, rest);
    }
    if (Object.keys(links).length) {
      await this.spo.validateUpdate(this.lists[listKey], id, links);
    }
  }
  writeFile(absPath, data) {
    this.log("writeFile", absPath, { bytes: data.length });
    if (this.dryRun) return;
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, data);
  }
  deleteFile(absPath) {
    this.log("deleteFile", absPath, {});
    if (this.dryRun) return;
    try {
      fs.rmSync(absPath);
    } catch {
      /* recycle failures are swallowed, as in the flow */
    }
  }
}

// ---- Graph row normalization (connector-ish flat shape) -------------

function normalizeRows(items, kind) {
  return items.map((it) => {
    const f = it.fields || {};
    const row = { ID: num(it.id) ?? num(f.id) };
    switch (kind) {
      case "docIndex":
        Object.assign(row, {
          Title: f.Title || "", FileName: f.FileName || "", DocKey: f.DocKey || "",
          IndexStatus: f.IndexStatus || "", SourceModified: f.SourceModified || "",
          PromptVersion: f.PromptVersion || "", TextFileUrl: hyperlink(f.TextFileUrl),
          DocKind: f.DocKind || "", Surface: f.Surface || "",
          TargetRelease: f.TargetRelease || "", PE: f.PE || "", Dev: f.Dev || "",
          Summary: f.Summary || "", LastError: f.LastError || "",
          ExtractionLane: f.ExtractionLane || "", Products: f.Products || "",
        });
        break;
      case "keywords":
        Object.assign(row, {
          Title: f.Title || "", Kind: f.Kind || "",
          CanonicalRefId: num(f.CanonicalRefLookupId) ?? num(f.CanonicalRefId),
        });
        break;
      case "docIds":
        Object.assign(row, {
          Title: f.Title || "", Repo: f.Repo || "", IssueNumber: num(f.IssueNumber),
          Source: f.Source || "", IdKey: f.IdKey || "",
          DocumentId: num(f.DocumentLookupId) ?? num(f.DocumentId),
        });
        break;
      case "docLinks":
        Object.assign(row, {
          LinkType: f.LinkType || "", SharedValues: f.SharedValues || "",
          Strength: num(f.Strength), LinkKey: f.LinkKey || "",
          DocAId: num(f.DocALookupId) ?? num(f.DocAId),
          DocBId: num(f.DocBLookupId) ?? num(f.DocBId),
        });
        break;
      case "docKeywords":
        Object.assign(row, {
          Title: f.Title || "", KWKey: f.KWKey || "",
          DocumentId: num(f.DocumentLookupId) ?? num(f.DocumentId),
          KeywordId: num(f.KeywordLookupId) ?? num(f.KeywordId),
        });
        break;
    }
    return row;
  });
}

// ---- sidecar header (flow §4.3(e)/(f), byte-faithful) ---------------

function sidecarHeader(p) {
  const productRow = p.products.length
    ? `| **Product** | ${p.products.join(" · ")} |\n`
    : "";
  const issueLinks = p.ids.map(
    (id) => `[${id.repo}#${id.number}](https://devtopia.esri.com/${id.repo}/issues/${id.number})`
  );
  const issueRow = p.ids.length ? `| **Issue** | ${issueLinks.join(" · ")} |\n` : "";
  const release = stripQuotes(pipeToSlash(p.targetRelease)) || "—";
  const edited = fmtDate(p.srcEdited, true) || "unknown";
  const editor = pipeToSlash(p.srcEditor) || "unknown";
  const today = fmtDate(new Date().toISOString(), false);
  const summary =
    p.summary && p.summary.trim() !== ""
      ? p.summary
      : "> [!WARNING]\n> No AI summary was generated for this document.";

  return `# ${p.h1Title}

|   |   |
| --- | --- |
| **Kind** | ${p.docKind} · ${p.surface} |
| **Release** | ${release} |
${productRow}${issueRow}| **Source** | [${p.fileName}](<${p.sourceLink}>) |
| **Edited** | ${edited} by ${editor} |
| **Extracted** | ${today} · lane \`${p.lane}\` |

<!-- metadata
\`\`\`yaml
title: "${yamlEscape(p.title)}"
source_file: "${yamlEscape(p.fileName)}"
source_url: "${p.sourceLink}"
doc_id: ${p.rowId}
doc_kind: "${p.docKind}"
surface: "${p.surface}"
doc_revision: "${p.docRevision}"
target_release: "${stripQuotes(p.targetRelease)}"
pe: "${stripQuotes(p.pe)}"
dev: "${stripQuotes(p.dev)}"
author: "${stripQuotes(p.srcAuthor)}"
last_edited_by: "${stripQuotes(p.srcEditor)}"
last_edited: "${p.srcEdited}"
extracted: ${today}
extraction_lane: ${p.lane}
prompt_version: "${p.promptVersion}"
keywords: [${p.keywords.map(quoteYamlItem).join(", ")}]
tools: [${p.tools.map(quoteYamlItem).join(", ")}]
products: [${p.products.map((x) => '"' + x + '"').join(", ")}]
issues: [${p.ids.map((id) => `"${id.repo}#${id.number}"`).join(", ")}]
related: []
\`\`\`
-->

## Summary

${summary}

## Related documents

<!-- related:begin -->
_None yet._
<!-- related:end -->

---

`;
}

// ---- the sweep ------------------------------------------------------

async function main() {
  const cfg = loadConfig(process.argv.slice(2));
  _setStatusCfg(cfg);
  const sw = cfg.sweep;
  const sp = cfg.sharePoint;
  const dry = !!sw.dryRun;

  // --check-heartbeat: the dead-man check (v1.32). Local stamp only —
  // no Graph, no sign-in — so it reports even when the pipeline is
  // down BECAUSE auth is. Run it from a second scheduled task.
  if (sw.checkHeartbeat) {
    const r = await checkHeartbeat(cfg);
    process.stdout.write(JSON.stringify({ mode: "check-heartbeat", ...r }) + "\n");
    process.exitCode = r.ok ? 0 : 1;
    return;
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "docindex-sweep-"));
  const mains = await loadScripts(
    cfg.scriptsDir || DEFAULT_SCRIPTS_DIR,
    ["ziptext", "media", "figures", "regex", "workbookdump", "related", "sidecarpatch"],
    tmpDir
  );
  const op = (o) => runOp(mains, o);

  // PDF text extraction (improvement over the flow, which always
  // skipped PDFs): shell out to Poppler's pdftotext when present.
  // Absent tool = the flow's historical behavior (Skip lane), loudly.
  const pdfTool = detectPdfTool(sw);
  if (!pdfTool) {
    process.stderr.write(
      "note: pdftotext not found — PDFs stay in the Skip lane " +
      "(install Poppler or set sweep.pdftotextPath to index them)\n"
    );
  }
  const ocrTools = detectOcrTools(sw);

  const graph = new GraphClient(cfg.graph);
  const spo = new SpoClient(cfg.spo);
  const bodyIndex = new BodyIndex();
  const docLinks = loadDocLinks(sw);
  // crawled page inventory (doc_crawl.mjs) with section→product from
  // the probe templates, so matches prefer the right product's tree
  const sectionProducts = new Map();
  for (const t of docLinks.probeTemplates || []) {
    const url = typeof t === "string" ? t : t?.url;
    const product = t && typeof t === "object" ? t.product : undefined;
    if (typeof url === "string" && url.includes("{slug}")) {
      sectionProducts.set(url.slice(0, url.indexOf("{slug}")), product ?? null);
    }
  }
  const pagesFile = sw.docPagesFile || path.join(cfg.paths?.workDir || ".", "esri_doc_pages.json");
  const pageIndex = new DocPageIndex(pagesFile, sectionProducts);
  const linkResolver = new ToolLinkResolver(
    docLinks,
    cfg.paths?.workDir,
    sw.probeDocLinks !== false,
    pageIndex
  );
  const siteId = await graph.siteId(sp.hostname, sp.sitePath);
  const srcSiteId = await graph.siteId(sp.hostname, sp.sourceSitePath);
  const writer = new Writer(graph, siteId, sp.lists, dry, spo);

  // ---- run-start snapshots (replaces per-doc Check_* queries) ----
  // Raw items are kept alongside the normalized rows so every run can
  // export a restorable list backup (v1.32) at zero extra fetch cost.
  const rawSnapshots = {};
  const fetch = async (listKey, kind, select) => {
    const items = await graph.listItems(siteId, sp.lists[listKey], { select });
    rawSnapshots[listKey] = items;
    return normalizeRows(items, kind);
  };
  const docIndexRows = await fetch("docIndex", "docIndex", [
    "Title", "FileName", "DocKey", "IndexStatus", "SourceModified",
    "PromptVersion", "TextFileUrl", "DocKind", "Surface", "TargetRelease",
    "PE", "Dev", "Summary", "LastError", "ExtractionLane", "Products",
  ]);
  const keywordRows = await fetch("keywords", "keywords", ["Title", "Kind", "CanonicalRefLookupId"]);
  const docIdRows = await fetch("docIds", "docIds", ["Title", "Repo", "IssueNumber", "Source", "IdKey", "DocumentLookupId"]);
  const docLinkRows = await fetch("docLinks", "docLinks", ["LinkType", "SharedValues", "Strength", "LinkKey", "DocALookupId", "DocBLookupId"]);
  const docKwRows = await fetch("docKeywords", "docKeywords", ["Title", "KWKey", "DocumentLookupId", "KeywordLookupId"]);
  const listBackup = exportListSnapshots(cfg, rawSnapshots);

  const byDocKey = new Map(docIndexRows.map((r) => [lower(r.DocKey), r]));
  // error lane for the status page: seeded from the snapshot, docs
  // are removed on a successful (re)index and re-added on failure
  const errorLane = new Map(
    docIndexRows
      .filter((r) => r.IndexStatus === "Error")
      .map((r) => [lower(r.DocKey), { name: r.FileName || r.Title || r.DocKey, err: String(r.LastError || "") }])
  );
  const kwByTitle = new Map(keywordRows.map((r) => [lower(r.Title), r]));
  const idKeys = new Set(docIdRows.map((r) => r.IdKey));
  const linkKeys = new Set(docLinkRows.map((r) => r.LinkKey));
  const kwKeys = new Set(docKwRows.map((r) => r.KWKey));
  // Run-start keyword snapshot for Get_kw_meta (deliberately NOT
  // updated with mid-run creations — flow §5.7 accepted degradation).
  const kwSnapshot = keywordRows.slice();

  const existingKeywords = keywordRows
    .filter((r) => !r.CanonicalRefId)
    .map((r) => r.Title)
    .join(", ");

  // ---- --rerank: rebuild every related section from persisted state
  // (no extraction, no AI calls — pure local compute + sidecar
  // writes). Use after keyword-curation merges to propagate them
  // corpus-wide in one pass instead of waiting on lazy reindexes.
  if (sw.rerank) {
    const caches = { byDocKey, kwByTitle, idKeys, linkKeys, kwKeys, docIndexRows, keywordRows, docIdRows, docLinkRows, docKwRows };
    // tool names per doc, reconstructed from the junctions: keywords
    // of Kind "tool" (alias rows fold to their canonical)
    const kwById = new Map(keywordRows.map((k) => [k.ID, k]));
    const kwOfKind = (docId, kind) => {
      const out = [];
      for (const j of docKwRows) {
        if (j.DocumentId !== docId) continue;
        let k = kwById.get(j.KeywordId);
        if (k && k.CanonicalRefId) k = kwById.get(k.CanonicalRefId) || k;
        if (k && lower(k.Kind) === kind && k.Title && !out.includes(k.Title)) out.push(k.Title);
      }
      return out;
    };
    const toolsOf = (docId) => kwOfKind(docId, "tool");
    const topicsOf = (docId) => kwOfKind(docId, "topic");
    const cap = sw._maxSet ? Number(sw.maxDocsPerRun) : Infinity;
    const rsum = { mode: "rerank", dry_run: dry, eligible: 0, reranked: 0, no_sidecar: 0, errors: 0, related_flags: "" };
    for (const r of docIndexRows) {
      if (r.IndexStatus !== "Indexed" || !r.TextFileUrl) continue;
      if (sw.smokeFile && lower(String(r.FileName || "").trim()) !== lower(sw.smokeFile.trim())) continue;
      rsum.eligible++;
      if (rsum.reranked >= cap) continue;
      const url = String(r.TextFileUrl);
      const rel = url.replace(sw.siteUrl, "");
      const local = urlToLocal(url, sw, cfg);
      if (!rel.startsWith("/") || !local || !fs.existsSync(local)) {
        rsum.no_sidecar++;
        continue;
      }
      try {
        // upsert the product-documentation block first, so existing
        // sidecars gain/refresh links in the same pass
        const before = fs.readFileSync(local, "utf8");
        const rowProducts = String(r.Products || "").split("; ").filter(Boolean);
        // prefer the sidecar's own yaml (original casing) over the
        // lowercased junction titles for display
        const yTools = yamlList(before, "tools");
        const yKeywords = yamlList(before, "keywords");
        const rowTools = yTools.length ? yTools : toolsOf(r.ID);
        const rowTopics = yKeywords.length ? yKeywords : topicsOf(r.ID);
        const toolLinks = new Map();
        for (const t of rowTools) {
          toolLinks.set(t, await linkResolver.resolve(t, rowProducts));
        }
        const topicLinks = new Map();
        for (const k of rowTopics) {
          topicLinks.set(k, linkResolver.topicLink(k, rowProducts));
        }
        const content = upsertDocsBlock(
          before,
          docsBlock(rowTools, docLinks, toolLinks, topicLinks)
        );
        if (content !== before) writer.writeFile(local, content);
        await rankRelated({
          cfg, sw, op, writer, summary: rsum, bodyIndex, caches, kwSnapshot,
          setStep: () => {},
          rowId: r.ID,
          name: r.FileName || "",
          docKey: lower(r.DocKey),
          title: r.Title || r.FileName || "",
          meta: {
            kind: r.DocKind || "", surface: r.Surface || "",
            release: r.TargetRelease || "", pe: r.PE || "",
            dev: r.Dev || "", modified: r.SourceModified || "",
          },
          selfFile: {
            name: rel.split("/").pop(),
            folder: rel.slice(0, rel.lastIndexOf("/")),
            content,
          },
          textFileUrl: url,
        });
        rsum.reranked++;
      } catch (e) {
        rsum.errors++;
        process.stderr.write(`RERANK ERROR ${r.FileName}: ${e.message}\n`);
      }
    }
    rsum.related_flags = rsum.related_flags.trim();
    const rDir = cfg.paths.workDir || tmpDir;
    fs.mkdirSync(rDir, { recursive: true });
    const rStamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
    const rLog = path.join(rDir, `sweep-${rStamp}.json`);
    fs.writeFileSync(rLog, JSON.stringify({ summary: rsum, plan: dry ? writer.plan : undefined }, null, 1));
    pruneRunLogs(rDir);
    process.stdout.write(JSON.stringify({ ...rsum, logFile: rLog }) + "\n");
    if (dry) {
      process.stdout.write(`dry run: ${writer.plan.length} planned writes recorded in ${rLog}\n`);
    }
    return;
  }

  // ---- selection ----
  const files = await graph.listItems(srcSiteId, sp.lists.sourceLibrary, {
    select: ["FileLeafRef", "FileRef", "Modified", "File_x0020_Size", "FSObjType"],
  });
  files.sort((a, b) =>
    String(b.fields?.Modified || b.lastModifiedDateTime || "").localeCompare(
      String(a.fields?.Modified || a.lastModifiedDateTime || "")
    )
  );

  const rfsum = {
    mode: "reformat", dry_run: dry, eligible: 0, rewritten: 0,
    unchanged: 0, no_sidecar: 0, no_seam: 0, no_text: 0, errors: 0,
    figures: 0, figure_errors: 0,
  };
  const summary = {
    library_items_seen: files.length,
    after_smoke_filter: 0,
    processed: 0,
    errors: 0,
    smoke: sw.smokeFile || "",
    related_flags: "",
    dry_run: dry,
    dockey_hits: 0,
    dockey_misses: 0,
    out_of_scope: 0,
    archived: 0,
    figures: 0,
    figure_errors: 0,
    graph_downloads: 0,
    list_backup: listBackup ? path.basename(listBackup) : "",
  };

  for (const item of files) {
    const f = item.fields || {};
    const name = String(f.FileLeafRef || "");
    const fileRef = String(f.FileRef || "");
    const modified = String(f.Modified || item.lastModifiedDateTime || "");
    const isFolder = String(f.FSObjType) === "1" || item.contentType?.name === "Folder";
    const srcItemId = num(item.id);

    // Smoke_filter
    if (sw.smokeFile && lower(name.trim()) !== lower(sw.smokeFile.trim())) continue;
    summary.after_smoke_filter++;

    // Doc_key: lowercased site-relative path incl. filename. The strip
    // prefix is configurable; the dry-run calibration check below
    // verifies it against rows the cloud flow wrote.
    const siteRel = fileRef.startsWith(sp.docKeyStrip)
      ? fileRef.slice(sp.docKeyStrip.length)
      : fileRef.replace(/^\//, "");
    const docKey = lower(siteRel);
    const existing = byDocKey.get(docKey);
    if (existing) summary.dockey_hits++;
    else summary.dockey_misses++;

    const ext = lower(name.split(".").pop());
    const fileTypeSafe = KNOWN_EXT.includes(ext) ? ext : IMAGE_EXT.includes(ext) ? "image" : "other";

    // local path in the synced library; a doc outside the synced
    // root segment is structurally unreachable (out-of-scope lane)
    const inScope = siteRel.startsWith(sp.libraryRootSegment + "/");
    const libRel = inScope ? siteRel.slice(sp.libraryRootSegment.length + 1) : siteRel;
    const localPath = path.join(cfg.paths.sourceLibrary, ...libRel.split("/"));
    const sourceLink = item.webUrl || "";

    // --reformat: re-extract and rewrite ONLY the sidecar body, so
    // presentation improvements (tidyBody, caseHeadings) reach the corpus
    // without an AI call or a promptVersion bump. Header, metadata,
    // related region and docs block are preserved byte-for-byte.
    if (sw.reformat) {
      if (isFolder || !inScope || !existing || existing.IndexStatus !== "Indexed" || !existing.TextFileUrl) continue;
      rfsum.eligible++;
      if (rfsum.rewritten + rfsum.unchanged >= (sw._maxSet ? Number(sw.maxDocsPerRun) : Infinity)) continue;
      const scLocal = urlToLocal(String(existing.TextFileUrl), sw, cfg);
      if (!scLocal || !fs.existsSync(scLocal)) {
        rfsum.no_sidecar++;
        continue;
      }
      try {
        const cur = fs.readFileSync(scLocal, "utf8");
        const seam = bodySeamEnd(cur);
        if (seam < 0) {
          rfsum.no_seam++;
          continue;
        }
        const { docText, figureCount, figureError } = extractDocText({
          sw, cfg, op, writer, pdfTool, ocrTools, setStep: () => {},
          localPath, ext, srcItemId, modified, withMedia: false,
        });
        rfsum.figures += figureCount || 0;
        if (figureError) rfsum.figure_errors++;
        if (!docText) {
          rfsum.no_text++;
          continue;
        }
        const next = cur.slice(0, seam) + caseHeadings(tidyBody(docText));
        if (next === cur) rfsum.unchanged++;
        else {
          writer.writeFile(scLocal, next);
          rfsum.rewritten++;
        }
      } catch (e) {
        rfsum.errors++;
        process.stderr.write(`REFORMAT ERROR ${name}: ${e.message}\n`);
      }
      continue;
    }

    // Needs_index — plus two self-healing rescues, both gated on
    // inScope so an unreachable doc is stamped once, never nightly:
    //  - PDF rescue: rows the (pre-pdftotext) sweep or the cloud
    //    flow stamped Skipped re-index now that PDF extraction
    //    exists; the "plaintext" lane marks the attempt.
    //  - scope rescue: rows stamped "out of sync scope" re-index
    //    automatically once the OneDrive sync is widened — no
    //    promptVersion bump (and no corpus-wide AI respend) needed.
    const pdfRescue =
      ext === "pdf" && !!pdfTool && inScope &&
      existing?.IndexStatus === "Skipped" &&
      existing?.ExtractionLane !== "plaintext" &&
      existing?.ExtractionLane !== "ocr"; // "ocr" = extraction attempted too
    // OCR rescue (v1.36): rows stamped Skipped after a text-less
    // pdftotext attempt (lane "plaintext") re-enter once OCR tools
    // exist; the attempt restamps lane "ocr", so this fires once.
    const ocrRescue =
      ext === "pdf" && !!ocrTools && !!pdfTool && inScope &&
      existing?.IndexStatus === "Skipped" &&
      existing?.ExtractionLane === "plaintext";
    const scopeRescue =
      inScope &&
      existing?.IndexStatus === "Skipped" &&
      String(existing?.LastError || "").startsWith("out of sync scope");
    const needsIndex =
      !existing ||
      pdfRescue ||
      ocrRescue ||
      scopeRescue ||
      existing.IndexStatus === "Error" ||
      existing.IndexStatus === "Archived" || // deleted doc restored → re-index
      (existing.SourceModified || "1900-01-01T00:00:00Z") < modified ||
      (existing.PromptVersion || "") !== sw.promptVersion;
    if (isFolder || !needsIndex || summary.processed >= sw.maxDocsPerRun) continue;
    summary.processed++; // incremented before Try_index, as in the flow

    let step = "start";
    try {
      // OneDrive-sync-lag fallback (v1.33, opt-in): the source is in
      // scope but not on disk yet — fetch its bytes through Graph into
      // a temp file and index from there, instead of an Error night.
      let effPath = localPath;
      if (sw.graphDownloadFallback && inScope && !fs.existsSync(localPath)) {
        step = "graph-download";
        const buf = await graph.getItemContentBuffer(srcSiteId, sp.lists.sourceLibrary, item.id);
        effPath = path.join(tmpDir, "dl", `${srcItemId}-${name}`);
        fs.mkdirSync(path.dirname(effPath), { recursive: true });
        fs.writeFileSync(effPath, buf);
        summary.graph_downloads++;
      }
      step = "extract";
      await indexDoc({
        cfg, sw, sp, op, writer, summary, pdfTool, ocrTools, bodyIndex, docLinks, linkResolver,
        item: { name, fileRef, modified, srcItemId, sourceLink, localPath: effPath, ext, fileTypeSafe, docKey, inScope },
        existing, existingKeywords, kwSnapshot,
        caches: { byDocKey, kwByTitle, idKeys, linkKeys, kwKeys, docIndexRows, keywordRows, docIdRows, docLinkRows, docKwRows },
        setStep: (s) => (step = s),
      });
      errorLane.delete(docKey);
    } catch (e) {
      // Catch_index: Error row, LastError "{step}: {detail}", continue.
      // One failure class is NOT retryable (v1.28): AI Builder's input
      // content moderation (InputContentFiltered) is deterministic on the
      // doc's own text — a deck that quotes model-instruction-like content
      // trips it every time — so an Error stamp would re-burn one AI call
      // per night failing identically. It stamps Skipped instead (the
      // out-of-scope pattern: once, visible on the status page, no nightly
      // rechurn), at the CURRENT PromptVersion/SourceModified so needsIndex
      // stays quiet; like any Skipped row it re-enters on the next
      // promptVersion bump or a source edit.
      const errDetail = cut(`${step}: ${e.message}`, 4000);
      const filtered = step === "llm" && errDetail.indexOf("InputContentFiltered") >= 0;
      if (filtered) {
        errorLane.delete(docKey);
        process.stderr.write(`SKIP (content-filtered) ${name}: ${errDetail}\n`);
      } else {
        summary.errors++;
        errorLane.set(docKey, { name, err: errDetail });
        process.stderr.write(`ERROR ${name}: ${errDetail}\n`);
      }
      try {
        const status = filtered ? "Skipped" : "Error";
        const fields = {
          Title: name, FileName: name, DocKey: docKey,
          IndexStatus: status, IndexedOn: new Date().toISOString(),
          LastError: filtered
            ? cut("content filter: AI Builder refused the document text — " +
                  "re-enters on the next PromptVersion bump or source edit. " + errDetail, 4000)
            : errDetail,
        };
        if (filtered) {
          fields.SourceModified = modified;
          fields.PromptVersion = sw.promptVersion;
          // a filtered PDF was extracted fine (the LLM refused the text) —
          // record the lane so the PDF rescue never rechurns it either
          if (ext === "pdf") fields.ExtractionLane = "plaintext";
        }
        if (existing) {
          await writer.patchRow("docIndex", existing.ID, fields);
          Object.assign(existing, filtered
            ? { IndexStatus: status, SourceModified: modified,
                PromptVersion: sw.promptVersion, LastError: fields.LastError }
            : { IndexStatus: status });
        } else {
          const created = await writer.createRow("docIndex", {
            ...fields,
            SourceLink: { Url: sourceLink, Description: name },
            FileType: fileTypeSafe, SourceModified: modified,
            PromptVersion: sw.promptVersion,
          });
          const row = { ID: created.id, DocKey: docKey, IndexStatus: status, SourceModified: modified, PromptVersion: sw.promptVersion, Title: name, FileName: name, TextFileUrl: "", LastError: fields.LastError };
          byDocKey.set(docKey, row);
          docIndexRows.push(row);
        }
      } catch (e2) {
        process.stderr.write(`ERROR-row write failed for ${name}: ${e2.message}\n`);
      }
    }
  }

  if (sw.reformat) {
    const rDir = cfg.paths.workDir || tmpDir;
    fs.mkdirSync(rDir, { recursive: true });
    const rStamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
    const rLog = path.join(rDir, `sweep-${rStamp}.json`);
    fs.writeFileSync(rLog, JSON.stringify({ summary: rfsum, plan: dry ? writer.plan : undefined }, null, 1));
    pruneRunLogs(rDir);
    process.stdout.write(JSON.stringify({ ...rfsum, logFile: rLog }) + "\n");
    if (dry) process.stdout.write(`dry run: ${writer.plan.length} planned writes recorded in ${rLog}\n`);
    return;
  }

  // ---- ghost reconciliation: rows whose source vanished ----------
  // Skipped on smoke runs (--only must stay surgical) and when the
  // library listing came back empty (a throttled/failed listing must
  // never archive the world). Capped per run as a second safety rail.
  if (!sw.smokeFile && files.length > 0) {
    const liveKeys = new Set();
    for (const it of files) {
      const f = it.fields || {};
      if (String(f.FSObjType) === "1" || it.contentType?.name === "Folder") continue;
      const fileRef = String(f.FileRef || "");
      const siteRel = fileRef.startsWith(sp.docKeyStrip)
        ? fileRef.slice(sp.docKeyStrip.length)
        : fileRef.replace(/^\//, "");
      liveKeys.add(lower(siteRel));
    }
    const ghosts = docIndexRows.filter(
      (r) => r.DocKey && r.IndexStatus !== "Archived" && !liveKeys.has(lower(r.DocKey))
    );
    const cap = sw.maxArchivesPerRun === undefined ? 20 : Number(sw.maxArchivesPerRun);
    for (const g of ghosts.slice(0, cap)) {
      try {
        await writer.patchRow("docIndex", g.ID, {
          IndexStatus: "Archived", IndexedOn: new Date().toISOString(),
          LastError: `archived ${new Date().toISOString().slice(0, 10)}: source no longer in the library`,
        });
      } catch (e) {
        // most likely: "Archived" missing from the IndexStatus choices
        process.stderr.write(
          "ghost reconciliation halted: could not write IndexStatus " +
          `"Archived" (add it to the Doc Index IndexStatus choice values): ${e.message.slice(0, 200)}\n`
        );
        break;
      }
      g.IndexStatus = "Archived";
      errorLane.delete(lower(g.DocKey));
      summary.archived++;
      const local = urlToLocal(g.TextFileUrl || "", sw, cfg);
      if (local && fs.existsSync(local)) writer.deleteFile(local);
    }
    if (ghosts.length > cap) {
      process.stderr.write(`note: ${ghosts.length - cap} more ghost row(s) will archive on later runs (cap ${cap}/run)\n`);
    }
  }

  summary.related_flags = summary.related_flags.trim();
  const line =
    `library_items_seen=${summary.library_items_seen} ` +
    `after_smoke_filter=${summary.after_smoke_filter} ` +
    `processed=${summary.processed} errors=${summary.errors} ` +
    `smoke=${summary.smoke} related_flags=${summary.related_flags}`;

  const logDir = cfg.paths.workDir || tmpDir;
  fs.mkdirSync(logDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
  const logFile = path.join(logDir, `sweep-${stamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ summary, line, plan: dry ? writer.plan : undefined }, null, 1));
  pruneRunLogs(logDir);
  if (!dry) {
    // consecutive-run error streaks: docs that fail night after night
    // stand out from last night's newcomers on the status page
    const streakFile = path.join(logDir, "error-streaks.json");
    let prev = {};
    try {
      prev = JSON.parse(fs.readFileSync(streakFile, "utf8"));
    } catch { /* first run */ }
    const streaks = {};
    for (const k of errorLane.keys()) {
      // a smoke run (--only) doesn't retry the whole lane, so it
      // displays the standing streaks without advancing them
      streaks[k] = sw.smokeFile ? Number(prev[k]) || 1 : (Number(prev[k]) || 0) + 1;
    }
    if (!sw.smokeFile) {
      try {
        fs.writeFileSync(streakFile, JSON.stringify(streaks, null, 1));
      } catch { /* best effort */ }
    }
    writeStatusPage(cfg, { summary, logFile, errorLane, streaks, runLogDir: logDir });
    // browse pages (v1.35): the catalog as humans see it — root +
    // per-kind _Index.md, rebuilt from the rows this run already holds
    writeIndexPages(cfg, docIndexRows, sw.kindFolders);
    if (!sw.smokeFile) {
      // dead-man stamp + chronic-error alert (v1.32): the run
      // completed, so stamp the heartbeat; docs stuck 3+ nights get a
      // push alert on top of their status-page row
      recordHeartbeat(cfg, summary);
      const chronic = [...errorLane.entries()]
        .filter(([k]) => (Number(streaks[k]) || 0) >= 3)
        .map(([, v]) => `${v.name}: ${String(v.err).slice(0, 120)}`);
      if (chronic.length) {
        await sendAlert(
          cfg,
          `Doc Index sweep: ${chronic.length} doc(s) stuck 3+ nights`,
          chronic.slice(0, 10).join("\n") +
          "\nSee _Sweep Status.md in the sidecar library."
        );
      }
    }
  }

  process.stdout.write(JSON.stringify({ ...summary, logFile }) + "\n");
  process.stdout.write(line + "\n");
  if (dry) {
    process.stdout.write(
      `dry run: ${writer.plan.length} planned writes recorded in ${logFile}\n` +
      `dockey calibration: ${summary.dockey_hits} matched existing rows, ` +
      `${summary.dockey_misses} new/unmatched (verify before --live if hits look low)\n`
    );
  }
}

// ---- per-doc pipeline (Try_index) -----------------------------------

async function indexDoc(ctx) {
  const { cfg, sw, sp, op, writer, summary, pdfTool, ocrTools, bodyIndex, docLinks, linkResolver, item, existing, existingKeywords, kwSnapshot, caches, setStep } = ctx;
  const { name, modified, srcItemId, sourceLink, localPath, ext, fileTypeSafe, docKey, inScope } = item;

  // Out-of-scope lane: the source lives outside the synced library
  // root (paths.sourceLibrary maps libraryRootSegment only), so no
  // amount of retrying can read it. A stamped Skip with the reason
  // in LastError — visible on the status page, no nightly rechurn.
  // It re-enters Needs_index when the doc is modified or the
  // PromptVersion bumps after the sync scope grows.
  if (inScope === false) {
    setStep("skip-out-of-scope");
    summary.out_of_scope++;
    const base = {
      Title: name, FileName: name, DocKey: docKey,
      IndexStatus: "Skipped", SourceModified: modified,
      IndexedOn: new Date().toISOString(), PromptVersion: sw.promptVersion,
      LastError: `out of sync scope: not under "${sp.libraryRootSegment}" — widen the OneDrive sync to index this doc`,
    };
    if (!existing) {
      const created = await writer.createRow("docIndex", {
        ...base,
        SourceLink: { Url: sourceLink, Description: name },
        FileType: fileTypeSafe, ExtractionLane: "none",
      });
      const row = { ID: created.id, ...base, TextFileUrl: "" };
      caches.byDocKey.set(docKey, row);
      caches.docIndexRows.push(row);
    } else {
      await writer.patchRow("docIndex", existing.ID, base);
      Object.assign(existing, base);
    }
    return;
  }

  // Switch_ext lane dispatch (shared with the --reformat pass)
  const { docText, relsText, lane, srcAuthor, srcEditor, srcEdited,
          figureCount, figureError } = extractDocText({
    sw, cfg, op, writer, pdfTool, ocrTools, setStep,
    localPath, ext, srcItemId, modified, withMedia: true,
  });
  summary.figures = (summary.figures || 0) + (figureCount || 0);
  if (figureError) summary.figure_errors = (summary.figure_errors || 0) + 1;

  if (!docText || docText === "") {
    // Skip lane (ExtractionLane recorded on patches too, so a
    // no-text PDF's "plaintext" attempt-stamp sticks)
    setStep("skip-row");
    const base = {
      Title: name, FileName: name, DocKey: docKey,
      IndexStatus: "Skipped", SourceModified: modified,
      IndexedOn: new Date().toISOString(), PromptVersion: sw.promptVersion,
      ExtractionLane: lane,
    };
    if (!existing) {
      const created = await writer.createRow("docIndex", {
        ...base,
        SourceLink: { Url: sourceLink, Description: name },
        FileType: fileTypeSafe,
      });
      const row = { ID: created.id, ...base, TextFileUrl: "" };
      caches.byDocKey.set(docKey, row);
      caches.docIndexRows.push(row);
    } else {
      await writer.patchRow("docIndex", existing.ID, { ...base, LastError: "" });
      Object.assign(existing, base);
    }
    return;
  }

  // (a) LLM classify (AI Builder replacement)
  setStep("llm");
  const capped = cut(docText, sw.textCap);
  const ai = await classifyDoc(cfg.llm, {
    fileName: name, docText: capped, existingKeywords,
  });
  const docKind = DOC_KINDS.includes(ai.docKind) ? ai.docKind : "Other";
  const surface = SURFACES.includes(ai.surface) ? ai.surface : "Other";
  const title = cut(ai.title && ai.title !== "" ? ai.title : name, 255);
  const preview = cut(docText, sw.previewCap);

  // (b) regex/ids
  setStep("regex");
  const rx = op({
    op: "regex", fileName: name,
    content: docText + "\n" + relsText,
    defaultRepo: sw.defaultRepo, title,
  });
  const ids = rx.ids || [];
  const products = rx.products || [];

  // (c) Doc Index upsert (PromptVersion/TextFileUrl deliberately NOT here)
  setStep("upsert-row");
  const rowFields = {
    Title: title, FileName: name, DocKey: docKey,
    SourceLink: { Url: sourceLink, Description: name },
    FileType: fileTypeSafe, DocKind: docKind, IndexStatus: "Indexed",
    SourceModified: modified, Summary: ai.summary || "",
    SourceAuthor: srcAuthor, SourceEditor: srcEditor,
    SourceEdited: srcEdited || null, Surface: surface,
    ExtractionLane: lane, IndexedOn: new Date().toISOString(),
    TextPreview: preview, DocRevision: rx.docRevision || "",
    TargetRelease: ai.targetRelease || "", PE: ai.pe || "", Dev: ai.dev || "",
    Products: products.join("; "),
  };
  let rowId;
  if (!existing) {
    rowId = (await writer.createRow("docIndex", rowFields)).id;
  } else {
    rowId = existing.ID;
    await writer.patchRow("docIndex", rowId, rowFields);
  }

  // (d) sidecar naming
  const fallbackSlug = lower(name.replace(/\.[^.]*$/, ""))
    .replaceAll(" ", "-").replaceAll("#", "").replaceAll("%", "");
  const slug = rx.slug && rx.slug !== "" ? rx.slug : fallbackSlug;
  const sidecarName = `${slug}__doc${rowId}.md`;
  const kindFolder = sw.kindFolders[docKind] || "Other";
  const sidecarFolder = `${sw.textsFolder}/${kindFolder}`;

  // (e)+(f) header
  const header = sidecarHeader({
    h1Title: title === name ? name.replace(/\.[^.]*$/, "") : title,
    title, fileName: name, sourceLink, rowId,
    docKind, surface, targetRelease: ai.targetRelease || "",
    pe: ai.pe || "", dev: ai.dev || "",
    srcAuthor, srcEditor, srcEdited, lane,
    docRevision: rx.docRevision || "", promptVersion: sw.promptVersion,
    summary: ai.summary || "",
    keywords: ai.keywords || [], tools: ai.tools || [],
    products, ids,
  });

  // (g) sidecar write + row URL patch + recycle-on-move
  setStep("sidecar");
  const localSidecar = path.join(cfg.paths.sidecarLibrary, kindFolder, sidecarName);
  // product/tool documentation links block (v1.14–v1.16), inserted
  // after the related region — products from RegexExtract, tools from
  // the LLM's tools list; per-tool links resolved curated → probed →
  // search fallback (local/esri_doc_links.json)
  const toolLinks = new Map();
  for (const t of ai.tools || []) {
    toolLinks.set(t, await linkResolver.resolve(t, products));
  }
  const topicLinks = new Map();
  for (const k of ai.keywords || []) {
    topicLinks.set(k, linkResolver.topicLink(k, products));
  }
  // body gets the v1.20 presentation tidy + v1.25 case headings; the
  // LLM input, preview and similarity index all keep the raw text
  const sidecarContent = upsertDocsBlock(
    header + caseHeadings(tidyBody(docText)),
    docsBlock(ai.tools || [], docLinks, toolLinks, topicLinks)
  );
  writer.writeFile(localSidecar, sidecarContent);
  const textFileUrl = `${sw.siteUrl}${sidecarFolder}/${sidecarName}`;
  await writer.patchRow("docIndex", rowId, {
    Title: title, FileName: name, DocKey: docKey, IndexStatus: "Indexed",
    TextFileUrl: { Url: textFileUrl, Description: sidecarName },
    LastError: "", PromptVersion: sw.promptVersion,
  });
  const oldUrl = existing?.TextFileUrl || "";
  if (oldUrl.startsWith(sw.siteUrl + "/") && oldUrl !== textFileUrl) {
    const oldLocal = urlToLocal(oldUrl, sw, cfg);
    if (oldLocal) writer.deleteFile(oldLocal);
  }

  // update cache row
  const cachedRow = existing || caches.byDocKey.get(docKey) || { ID: rowId };
  Object.assign(cachedRow, {
    ID: rowId, Title: title, FileName: name, DocKey: docKey,
    IndexStatus: "Indexed", SourceModified: modified,
    PromptVersion: sw.promptVersion, TextFileUrl: textFileUrl,
    DocKind: docKind, Surface: surface,
    TargetRelease: ai.targetRelease || "", PE: ai.pe || "", Dev: ai.dev || "",
    Summary: ai.summary || "",
  });
  if (!existing) {
    caches.byDocKey.set(docKey, cachedRow);
    caches.docIndexRows.push(cachedRow);
  }

  // (h) Doc IDs + id edges
  setStep("doc-ids");
  for (const id of ids) {
    const idKey = `${rowId}|${id.repo}#${id.number}`;
    if (!caches.idKeys.has(idKey)) {
      await writer.createRow("docIds", {
        Title: `${id.repo}#${id.number}`, DocumentLookupId: rowId,
        Repo: id.repo, IssueNumber: id.number, Source: id.source || "", IdKey: idKey,
      });
      caches.idKeys.add(idKey);
      caches.docIdRows.push({ Repo: id.repo, IssueNumber: id.number, IdKey: idKey, DocumentId: rowId });
    }
    const sharers = caches.docIdRows.filter(
      (r) => r.Repo === id.repo && r.IssueNumber === id.number &&
             parseInt(String(r.IdKey).split("|")[0], 10) !== rowId
    );
    for (const s of sharers) {
      const sharerId = parseInt(String(s.IdKey).split("|")[0], 10);
      const [a, b] = [Math.min(rowId, sharerId), Math.max(rowId, sharerId)];
      const linkKey = `${a}|${b}|id`;
      if (caches.linkKeys.has(linkKey)) continue;
      await writer.createRow("docLinks", {
        Title: `shared ${id.repo}#${id.number}`,
        DocALookupId: a, DocBLookupId: b, LinkType: "id",
        SharedValues: `${id.repo}#${id.number}`, Strength: 1, LinkKey: linkKey,
      });
      caches.linkKeys.add(linkKey);
      caches.docLinkRows.push({ DocAId: a, DocBId: b, LinkType: "id", SharedValues: `${id.repo}#${id.number}`, Strength: 1, LinkKey: linkKey });
    }
  }

  // (i) keywords + junction rows
  setStep("keywords");
  const kwAll = [];
  const seenKw = new Set();
  for (const [list, kind] of [[ai.keywords || [], "topic"], [ai.tools || [], "tool"]]) {
    for (const v of list) {
      const key = lower(v) + "|" + kind;
      if (!seenKw.has(key)) {
        seenKw.add(key);
        kwAll.push({ val: lower(v), kind });
      }
    }
  }
  for (const kw of kwAll) {
    let kwRow = caches.kwByTitle.get(kw.val);
    let kwId;
    if (kwRow) {
      kwId = kwRow.CanonicalRefId || kwRow.ID; // alias folding
    } else {
      const created = await writer.createRow("keywords", { Title: kw.val, Kind: kw.kind });
      kwRow = { ID: created.id, Title: kw.val, Kind: kw.kind };
      caches.kwByTitle.set(kw.val, kwRow);
      caches.keywordRows.push(kwRow);
      kwId = created.id;
    }
    const kwKey = `${rowId}|${kwId}`;
    if (!caches.kwKeys.has(kwKey)) {
      await writer.createRow("docKeywords", {
        Title: `${name} | ${kw.val}`, DocumentLookupId: rowId,
        KeywordLookupId: kwId, KWKey: kwKey,
      });
      caches.kwKeys.add(kwKey);
      caches.docKwRows.push({ DocumentId: rowId, KeywordId: kwId, KWKey: kwKey, Title: `${name} | ${kw.val}` });
    }
  }

  // (j) relatedness — extracted to rankRelated so `--rerank` can run
  // the identical path from persisted state (rows + on-disk sidecars)
  await rankRelated({
    cfg, sw, op, writer, summary, bodyIndex, caches, kwSnapshot, setStep,
    rowId, name, docKey, title,
    meta: {
      kind: docKind, surface, release: ai.targetRelease || "",
      pe: ai.pe || "", dev: ai.dev || "", modified,
    },
    selfFile: { name: sidecarName, folder: sidecarFolder, content: sidecarContent },
    textFileUrl,
    upsertText: docText,
  });
}

/**
 * Relatedness + sidecar patching for one doc — flow §5's
 * shortlist→final→sidecarpatch, plus the v1.9 body-sim candidate
 * source. Called by indexDoc with fresh state, and by `--rerank`
 * with persisted state (row metadata, junction/edge lists, the
 * on-disk sidecar as selfFile.content, no upsertText — the body
 * index already carries the doc from disk).
 */
async function rankRelated(ctx) {
  const {
    cfg, sw, op, writer, summary, bodyIndex, caches, kwSnapshot, setStep,
    rowId, name, docKey, title, meta, selfFile, textFileUrl, upsertText,
  } = ctx;
  setStep("related");
  bodyIndex.ensureBuilt(caches.docIndexRows, sw, cfg);
  if (upsertText !== undefined) bodyIndex.upsert(rowId, upsertText);
  const sims = bodyIndex.query(rowId);
  const simMin = sw.relatedBodySimMin === undefined ? 0.15 : Number(sw.relatedBodySimMin);
  const simTop = sims.filter((s) => s.sim >= simMin).slice(0, sw.relatedShortlist);
  const myKws = caches.docKwRows.filter((r) => r.DocumentId === rowId).slice(0, sw.myKwsTop);
  const idLinks = caches.docLinkRows
    .filter((r) => r.DocAId === rowId || r.DocBId === rowId)
    .slice(0, sw.linksTop);
  if (!myKws.length && !idLinks.length && !simTop.length) return;

  const myKwIds = new Set(myKws.map((r) => r.KeywordId ?? -1));
  const kwMeta = kwSnapshot.filter(
    (r) => myKwIds.has(r.ID) || myKwIds.has(r.CanonicalRefId ?? 0)
  );
  const sharerIds = new Set([...myKwIds, ...kwMeta.map((r) => r.ID)]);
  const sharers = caches.docKwRows
    .filter((r) => sharerIds.has(r.KeywordId))
    .slice(0, sw.sharersTop);
  const selfMetaRank = {
    kind: meta.kind, surface: meta.surface, release: meta.release,
    pe: meta.pe, dev: meta.dev, modified: meta.modified, title,
    // v1.9 (RelatedRank v2.2 self gates): filename + folder affinity
    filename: name, folder: folderOf(docKey),
  };
  const relatedCommon = {
    op: "related", selfId: String(rowId),
    myKwsJson: myKws, sharersJson: sharers, linksJson: idLinks,
    kwMetaJson: kwMeta, selfMetaJson: selfMetaRank,
    configJson: sw.relatedWeights,
  };
  const shortlist = op({ ...relatedCommon, mode: "shortlist", candsMetaJson: "[]", topN: sw.relatedShortlist });
  if (shortlist.flags && shortlist.flags !== "") {
    summary.related_flags += `${rowId}:${shortlist.flags} `;
  }
  if (!(shortlist.count > 0) && !simTop.length) return;

  // candidate universe = keyword/edge shortlist ∪ top body-sim docs;
  // each candidate row carries its BodySim + Folder for the ranker
  const simById = new Map(sims.map((s) => [s.id, s.sim]));
  const candIds = new Set([...(shortlist.docIds || []), ...simTop.map((s) => s.id)]);
  const candRows = caches.docIndexRows.filter(
    (r) => candIds.has(r.ID) && r.IndexStatus !== "Archived"
  );
  const candsMeta = candRows.map((r) => ({
    ...r,
    BodySim: simById.get(r.ID) || 0,
    Folder: folderOf(lower(r.DocKey)),
  }));
  // "final" without the flow's trailing space — RelatedRank reads any
  // non-"shortlist" mode as final.
  const rank = op({ ...relatedCommon, mode: "final", candsMetaJson: candsMeta, topN: sw.relatedTopN });
  const finalDocs = candRows.filter((r) => (rank.docIds || []).includes(r.ID));

  setStep("neighbors");
  const neighborFiles = [];
  for (const nb of finalDocs) {
    const url = nb.TextFileUrl || "";
    const rel = url.replace(sw.siteUrl, "");
    if (!rel.startsWith("/")) continue;
    const local = urlToLocal(url, sw, cfg);
    if (!local || !fs.existsSync(local)) continue; // unreadable → skipped
    neighborFiles.push({
      doc: nb.ID,
      name: rel.split("/").pop(),
      folder: rel.slice(0, rel.lastIndexOf("/")),
      content: fs.readFileSync(local, "utf8"),
    });
  }

  setStep("sidecar-patch");
  const selfFileObj = { doc: rowId, name: selfFile.name, folder: selfFile.folder, content: selfFile.content };
  const patch = op({
    op: "sidecarpatch",
    filesJson: [selfFileObj, ...neighborFiles],
    selfId: String(rowId),
    // v1.21: evidence prose compacted for display (the ranker's own
    // output, and the score in the yaml, stay full-fidelity)
    rankedJson: (rank.related || []).map((r) => ({ ...r, why: compactWhy(r.why) })),
    docsMetaJson: finalDocs,
    selfMetaJson: { doc: rowId, title, url: textFileUrl, file: selfFile.name },
    topN: sw.relatedTopN,
  });
  for (const file of patch.files || []) {
    if (file.changed !== true) continue;
    const folder = file.folder && file.folder !== "" ? file.folder : sw.textsFolder;
    const local = folderToLocal(folder, sw, cfg);
    if (!local) continue;
    writer.writeFile(path.join(local, file.name), file.content);
  }
}

/** Poppler's pdftotext, if present: sweep.pdftotextPath (a full
 *  path) or plain "pdftotext" on PATH. Absent → null (PDFs skip,
 *  as the cloud flow always did). */
function detectPdfTool(sw) {
  const p = sw.pdftotextPath || "pdftotext";
  const r = spawnSync(p, ["-v"], { encoding: "utf8" });
  return r.error ? null : p;
}

/** OCR tools (v1.36) — OPT-IN by explicit config: OCR runs only when
 *  sweep.tesseractPath is set (no PATH auto-detection, so machines
 *  that happen to have Tesseract don't silently change lanes).
 *  pdftoppm defaults to Poppler's, next to pdftotext on PATH. A
 *  configured-but-unrunnable tool warns loudly and disables OCR. */
function detectOcrTools(sw) {
  if (!sw.tesseractPath) return null;
  const tess = sw.tesseractPath;
  const ppm = sw.pdftoppmPath || "pdftoppm";
  for (const [name, cmd, arg] of [["tesseract", tess, "--version"], ["pdftoppm", ppm, "-v"]]) {
    if (spawnSync(cmd, [arg], { encoding: "utf8" }).error) {
      process.stderr.write(
        `note: sweep.tesseractPath is set but ${name} ("${cmd}") is not runnable — OCR lane disabled\n`
      );
      return null;
    }
  }
  return { tess, ppm };
}

/** Render the PDF's pages (200dpi PNG, first sweep.ocrMaxPages = 20)
 *  and OCR each; pages Tesseract can't read contribute nothing. */
function ocrPdf(tools, pdfPath, sw) {
  const maxPages = sw.ocrMaxPages === undefined ? 20 : Number(sw.ocrMaxPages);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "docindex-ocr-"));
  try {
    const root = path.join(dir, "page");
    const r = spawnSync(tools.ppm, ["-png", "-r", "200", "-l", String(maxPages), pdfPath, root], {
      encoding: "utf8",
    });
    if (r.error) throw new Error(`pdftoppm: ${r.error.message}`);
    if (r.status !== 0) {
      throw new Error(`pdftoppm exit ${r.status}: ${cut(String(r.stderr || ""), 200)}`);
    }
    const pages = fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
    const out = [];
    for (const p of pages) {
      const t = spawnSync(tools.tess, [path.join(dir, p), "stdout"], {
        encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
      });
      if (t.status === 0 && String(t.stdout).trim() !== "") out.push(t.stdout.trim());
    }
    return out.join("\n\n").trim();
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* temp */ }
  }
}

// fatal-path visibility: a scheduled run that dies (auth expiry,
// network, config) still surfaces in SharePoint via the status page
let gStatusCfg = null;
const _setStatusCfg = (c) => (gStatusCfg = c);

main().catch(async (e) => {
  process.stderr.write("sweep: " + (e.stack || e.message) + "\n");
  if (gStatusCfg && !gStatusCfg.sweep?.dryRun) {
    writeStatusPage(gStatusCfg, { summary: {}, errorLane: null, fatal: e.message });
    // push-style fatal alert (v1.32) — best-effort, independent of
    // Graph/auth so a dead sign-in still reaches someone's phone
    await sendAlert(gStatusCfg, "Doc Index sweep FAILED", e.message);
  }
  process.exit(1);
});
