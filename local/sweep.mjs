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
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";
import { loadScripts, runOp, DEFAULT_SCRIPTS_DIR } from "../pad/runner/ops.mjs";
import { GraphClient, SpoClient } from "./graph.mjs";
import { classifyDoc, generateText, aiBuilderPredict, loadPromptTemplate } from "./llm.mjs";
import { assertNodeVersion, validateConfig, SWEEP_REQUIRED } from "./lib/config.mjs";
import {
  lower, cut, folderOf, yamlEscape, stripQuotes, pipeToSlash, fmtDate,
  quoteYamlItem, htmlToText, num, hyperlink, urlToLocal, folderToLocal, unwrapPdfText,
  pruneRunLogs, exportListSnapshots,
} from "./lib/util.mjs";
import { sendAlert, recordHeartbeat, checkHeartbeat } from "./lib/alerts.mjs";
import { extractCases, toRowFields, diffCaseRows, prepareVocab } from "./lib/caseindex.mjs";
import { auditBody, summarizeAudit, renderAuditPage, hasSignal } from "./lib/caseaudit.mjs";
import { buildNormalizePrompt, unwrapReply, verifyNormalized, NORMALIZE_PROMPT_VERSION } from "./lib/casenormalize.mjs";
import { renderMetaTable, readMeta, metaList, relEntries, relatedRegion, migrateRelMarkers, isFormat3 } from "./lib/sidecarmeta.mjs";
import { mintStem, mintStems, stemOf, relinkMedia, mediaLinksOf, primaryIssue, defaultAbbreviations, MEDIA_PLACEHOLDER } from "./lib/slug.mjs";
import { writeIndexPages, writeCaseCatalog, writeManifest } from "./lib/indexpages.mjs";
import { parseMsg, msgToMarkdown } from "./lib/msg.mjs";
import { EmbedIndex, mergeSims } from "./lib/embedindex.mjs";
import { RemoteLibrary } from "./lib/remotefs.mjs";
import {
  loadDocLinks, DocPageIndex, ToolLinkResolver, docsBlock,
  upsertDocsBlock, bodySeamEnd,
} from "./lib/doclinks.mjs";
import { placeFigure, tidyBody, compactWhy } from "./lib/presentation.mjs";
import { renderTestPlanBody, lintTestPlanBody } from "./lib/casegrammar.mjs";
import { BodyIndex } from "./lib/bodyindex.mjs";
import { writeStatusPage } from "./lib/statuspage.mjs";

// ---- flow v2.8 Config defaults (override via config.sweep) ----------

const FLOW_DEFAULTS = {
  siteUrl: "https://esriis.sharepoint.com/sites/lrsworkspace",
  textsFolder: "/LRS Doc Index",
  smokeFile: "",
  defaultRepo: "ArcGISPro/ps-location-referencing",
  promptVersion: "v2.0",
  // --normalize-cases (Sidecar_Format_Plan phase 4): the OPT-IN LLM lane
  // for plans the detectors leave caseless. enabled = the owner switch
  // (a live run refuses without it); maxPerRun caps model calls;
  // provider "" follows llm.provider ("anthropic" runs
  // prompts/CaseNormalize_Prompt.md verbatim; "aibuilder" needs
  // llm.normalizeModelId); maxTokens bounds the anthropic reply.
  normalizeCases: { enabled: false, maxPerRun: 10, provider: "", maxTokens: 16000 },
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
  let figureOcr = 0, figureOcrOff = 0;
  let srcAuthor = "", srcEditor = "", srcEdited = "";
  // media is minted against a PLACEHOLDER folder and handed back to
  // the caller as bytes: the document's stem (its media folder name)
  // is only known once the title is — phase 1b, media/<stem>/<asset>
  const mediaFiles = [];
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
      mediaPrefix: MEDIA_PLACEHOLDER,
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
        mediaFiles.push({ name: img.name, data: Buffer.from(img.b64 || img.base64 || "", "base64") });
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
        let fg = op({ op: "figures", zipFile: localPath });
        // v1.40 (DF-12): a wireframe figure comes back naming the media
        // entries that still lack transcriptions (ocrWanted). With the
        // OCR lane configured (sweep.tesseractPath — the v1.36 opt-in),
        // transcribe exactly those pictures and re-render once, so the
        // wireframes carry the screenshot's real text instead of greek
        // bars. No OCR tools, or OCR finding nothing, keeps the
        // placeholder render — an enhancement, never a failure.
        if (fg && fg.ocrWanted) {
          const wantedN = fg.ocrWanted.split(",").filter(Boolean).length;
          if (ocrTools && ocrTools.tess) {
            setStep("figures-ocr");
            try {
              const ocrJson = ocrFigureMedia(ocrTools, localPath, fg.ocrWanted);
              if (ocrJson) {
                fg = op({ op: "figures", zipFile: localPath, ocrJson });
                const left = fg && fg.ocrWanted
                  ? fg.ocrWanted.split(",").filter(Boolean).length : 0;
                figureOcr = Math.max(0, wantedN - left);
              }
            } catch (e) {
              process.stderr.write(`FIGOCR ${path.basename(localPath)}: ${e.message}\n`);
            }
          } else {
            // v1.41: never silent — a wireframe rendered with greek bars
            // because OCR is not configured is a per-run note + counter,
            // not an invisible degradation
            figureOcrOff = wantedN;
          }
        }
        const figs = (fg && fg.figures) || [];
        const bySlide = new Map();
        for (const f of figs) {
          mediaFiles.push({ name: f.name, data: f.svg });
          if (!bySlide.has(f.slide)) bySlide.set(f.slide, []);
          bySlide.get(f.slide).push({ href: `${MEDIA_PLACEHOLDER}${f.name}`, alt: f.alt, anchor: f.anchor });
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
  } else if (!oversize && ext === "msg") {
    // v1.37: the msg lane — Outlook messages parse via the zero-dep
    // CFB reader (lib/msg.mjs). The message's own sender/sent-time
    // become the authorship trail (the OOXML core-properties pattern);
    // a message with no extractable body still skips, at lane "msg"
    // so the attempt is recorded and never rechurns.
    setStep("msg");
    const m = parseMsg(fs.readFileSync(localPath));
    lane = "msg";
    srcAuthor = m.from || "";
    srcEdited = m.date || modified || "";
    if (String(m.body || "").trim() !== "" || m.subject) {
      docText = msgToMarkdown(m, path.basename(localPath));
    }
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
    // v2.5 (PDF-1): re-flow the column-wrapped lines so a case reads
    // as one sentence instead of four fragments
    docText = String(r.stdout || "").trim() === "" ? "" : unwrapPdfText(r.stdout);
    lane = "plaintext";
    // OCR lane (v1.36, opt-in via sweep.tesseractPath): a text-less
    // PDF is usually a scan — render pages with pdftoppm and OCR them
    // with Tesseract. lane "ocr" marks the ATTEMPT either way, so a
    // scan OCR can't read is stamped once, never rechurned; rows
    // Skipped at lane "plaintext" re-enter once OCR exists (the PDF
    // rescue pattern). An OCR crash degrades to the Skip lane — an
    // enhancement must not put a doc in the Error lane.
    if (docText === "" && ocrTools && ocrTools.ppm) {
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
  // pdf(no tool)/image/other/oversize (and empty html/msg): DocText
  // stays empty → Skip lane.
  return { docText, relsText, lane, srcAuthor, srcEditor, srcEdited,
           figureCount, figureError, figureOcr, figureOcrOff, mediaFiles };
}

/** The sidecar BODY for a document (phase 3): tidyBody for every
 *  kind, plus the `testplan/v1` case grammar for the case-indexed
 *  kinds (casegrammar.mjs — a plan with no detectable case keeps its
 *  tidied slide sections). The LLM input, TextPreview and the
 *  similarity index keep the raw text. */
function renderBody(docText, docKind, cfg, sum) {
  const tidied = tidyBody(docText);
  const kinds = (cfg.sweep.caseIndex && cfg.sweep.caseIndex.kinds) || ["Test Plan"];
  if (!kinds.includes(docKind)) return tidied;
  const r = renderTestPlanBody(tidied);
  if (sum) {
    if (r.shape !== "none") sum.plans_profiled = (sum.plans_profiled || 0) + 1;
    const lint = lintTestPlanBody(r.body);
    if (lint.length) {
      sum.profile_lint_failures = (sum.profile_lint_failures || 0) + 1;
      process.stderr.write(`PROFILE LINT: ${lint.slice(0, 3).join("; ")}\n`);
    }
  }
  return r.body;
}

/** Write a document's media into media/<stem>/ (phase 1b). */
function writeMedia(cfg, writer, stem, mediaFiles) {
  for (const m of mediaFiles || []) {
    writer.writeFile(path.join(cfg.paths.sidecarLibrary, "media", stem, m.name), m.data);
  }
}

/** Move a document's pre-1b flat media (`media/doc<srcItemId>_<name>`)
 *  into its media/<stem>/ folder — idempotent; nothing to do when the
 *  flat files are gone. Used by --reformat (images are not re-extracted
 *  there) and by --rename. */
function placeLegacyMedia(cfg, writer, srcItemId, stem) {
  const mdir = path.join(cfg.paths.sidecarLibrary, "media");
  let names = [];
  try { names = fs.readdirSync(mdir); } catch { return 0; }
  const prefix = `doc${srcItemId}_`;
  let moved = 0;
  for (const n of names) {
    if (!n.startsWith(prefix)) continue;
    const from = path.join(mdir, n);
    try {
      if (!fs.statSync(from).isFile()) continue;
      writer.writeFile(path.join(mdir, stem, n.slice(prefix.length)), fs.readFileSync(from));
      writer.deleteFile(from);
      moved++;
    } catch { /* unreadable: leave it */ }
  }
  return moved;
}

/** Map rowId -> primary issue number (0 = none), for the manifest. */
function issueByDoc(rows, docIdRows) {
  const idsOf = new Map();
  for (const d of docIdRows || []) {
    if (!idsOf.has(d.DocumentId)) idsOf.set(d.DocumentId, []);
    idsOf.get(d.DocumentId).push({ repo: d.Repo, number: d.IssueNumber, source: d.Source });
  }
  const out = new Map();
  for (const r of rows || []) out.set(r.ID, primaryIssue(idsOf.get(r.ID) || [], r.FileName || ""));
  return out;
}

/** Stems already used in a kind folder — the rows' files plus whatever
 *  is on disk (rows can lag a write). */
function takenStems(cfg, sw, rows, kindFolder, exceptRowId) {
  const taken = new Set();
  for (const r of rows || []) {
    if (!r.TextFileUrl || r.ID === exceptRowId) continue;
    const parts = String(r.TextFileUrl).split("/");
    if (decodeURIComponent(parts[parts.length - 2] || "") !== kindFolder) continue;
    taken.add(stemOf(r.TextFileUrl));
  }
  try {
    for (const f of fs.readdirSync(path.join(cfg.paths.sidecarLibrary, kindFolder))) {
      if (f.endsWith(".md") && !f.startsWith("_")) taken.add(f.replace(/\.md$/, ""));
    }
  } catch { /* folder not there yet */ }
  return taken;
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
    else if (a === "--recase") args.flags.recase = true;
    else if (a === "--case-audit") args.flags.caseAudit = true;
    else if (a === "--rename") args.flags.rename = true;
    else if (a === "--normalize-cases") args.flags.normalize = true;
    else if (a === "--rename-plan") { args.flags.rename = true; args.flags.dry = true; }
    else if (a === "--check-heartbeat") args.flags.checkHeartbeat = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.config) throw new Error("usage: sweep.mjs --config <config.json> [--live|--dry-run] [--max N] [--only <file>] [--rerank] [--reformat] [--recase] [--case-audit] [--rename|--rename-plan] [--normalize-cases] [--check-heartbeat]");
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
  if (args.flags.recase) cfg.sweep.recase = true;
  if (cfg.sweep.recase && (cfg.sweep.rerank || cfg.sweep.reformat)) {
    throw new Error("--recase is a standalone mode — do not combine it with --rerank or --reformat");
  }
  if (args.flags.caseAudit) cfg.sweep.caseAudit = true;
  if (args.flags.rename) cfg.sweep.rename = true;
  if (args.flags.normalize) cfg.sweep.normalize = true;
  if (cfg.sweep.normalize && (cfg.sweep.rerank || cfg.sweep.reformat || cfg.sweep.recase || cfg.sweep.caseAudit || cfg.sweep.rename)) {
    throw new Error("--normalize-cases is a standalone mode — do not combine it with other modes");
  }
  if (cfg.sweep.rename && (cfg.sweep.rerank || cfg.sweep.reformat || cfg.sweep.recase || cfg.sweep.caseAudit)) {
    throw new Error("--rename is a standalone mode — do not combine it with --rerank, --reformat, --recase or --case-audit");
  }
  if (cfg.sweep.caseAudit && (cfg.sweep.rerank || cfg.sweep.reformat || cfg.sweep.recase)) {
    throw new Error("--case-audit is a standalone mode — do not combine it with --rerank, --reformat or --recase");
  }
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
// shape) — these fields route through SPO ValidateUpdateListItem
// (FigureLink: the Test Cases primary-figure link, caseindex v1.4).
const HYPERLINK_FIELDS = new Set(["SourceLink", "TextFileUrl", "FigureLink"]);

function splitHyperlinks(fields) {
  const rest = {};
  const links = {};
  for (const [k, v] of Object.entries(fields)) {
    (HYPERLINK_FIELDS.has(k) ? links : rest)[k] = v;
  }
  return { rest, links };
}

class Writer {
  constructor(graph, siteId, lists, dryRun, spo, remote) {
    this.graph = graph;
    this.siteId = siteId;
    this.lists = lists;
    this.dryRun = dryRun;
    this.spo = spo;
    this.remote = remote || null; // remote-files write-through (v1.39)
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
  async deleteRow(listKey, id) {
    this.log("deleteRow", `${listKey}/${id}`, {});
    if (this.dryRun) return;
    await this.graph.deleteItem(this.siteId, this.lists[listKey], id);
  }
  writeFile(absPath, data) {
    this.log("writeFile", absPath, { bytes: data.length });
    if (this.dryRun) return;
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, data);
    if (this.remote) this.remote.queuePut(absPath);
  }
  deleteFile(absPath) {
    this.log("deleteFile", absPath, {});
    if (this.dryRun) return;
    if (this.remote) this.remote.queueDelete(absPath);
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

// ---- sidecar header (format 3.0 — Sidecar_Format_Plan phase 1) ------
// H1 + the metadata TABLE (the only metadata representation; see
// lib/sidecarmeta.mjs), then Summary, the Related region and the
// header/body seam. `sidecarHead` is the part --reformat regenerates;
// `sidecarTail` is the part it preserves from the file on disk.

function sidecarHead(p) {
  return `# ${p.h1Title}\n\n${renderMetaTable(p)}\n`;
}

function sidecarTail(p) {
  const summary =
    p.summary && p.summary.trim() !== ""
      ? p.summary
      : "> [!WARNING]\n> No AI summary was generated for this document.";
  return `## Summary

${summary}

## Related documents

<!-- related:begin -->
_None yet._
<!-- related:end -->

---

`;
}

function sidecarHeader(p) {
  return sidecarHead(p) + sidecarTail(p);
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
  // v1.38 (opt-in): embedding-assisted relatedness — a second body
  // signal beside BM25, merged through the same BodySim channel
  const embedIndex = sw.embedRelated ? new EmbedIndex(cfg) : null;
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

  // remote-files mode (v1.39): no OneDrive anywhere — the sidecar
  // library mirrors down (eTag-deduped) and every file write/delete
  // uploads through Graph; source reads ride the v1.33 fallback.
  let remote = null;
  if (sw.remoteFiles) {
    sw.graphDownloadFallback = true;
    remote = new RemoteLibrary(
      graph, siteId,
      sw.remoteDriveName || String(sw.textsFolder).replace(/^\//, "").split("/").pop(),
      cfg.paths.sidecarLibrary,
      path.join(cfg.paths.workDir || tmpDir, "mirror-manifest.json")
    );
    await remote.init();
    const m = await remote.mirrorMarkdown();
    process.stderr.write(`remote mirror: ${m.files} sidecar file(s), ${m.downloaded} downloaded\n`);
  }
  const writer = new Writer(graph, siteId, sp.lists, dry, spo, remote);

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

  // ---- test-case index (Case_Index_Plan phase 2) -----------------
  // Individual test cases as Test Cases list rows, one replace-set
  // per document. Enabled by the list GUID alone; without it the
  // sweep says so once and indexes documents normally — case rows
  // are derived state and never gate a document.
  const ciKinds = (cfg.sweep.caseIndex && cfg.sweep.caseIndex.kinds) || ["Test Plan"];
  const ciEnabled = !!sp.lists.testCases;
  const caseRowsByDoc = new Map(); // docRowId -> [{id, fields}]
  if (ciEnabled) {
    const items = await graph.listItems(siteId, sp.lists.testCases, {
      select: ["Title", "DocumentLookupId", "CaseKey", "CaseNo", "SlideNo",
               "Classification", "Scenario", "CaseText", "IssueRefs", "Anchor",
               "Shape", "Confidence", "Group", "SourceRef",
               "FigureCount", "TableCount", "StepCount", "RouteRefs",
               "ExpectedResult", "TraceText", "Tools", "Keywords", "FigureLinks",
               "FigureLink", "SweptOn"],
    });
    rawSnapshots.testCases = items; // rides the per-run list backup
    for (const it of items) {
      const f = it.fields || {};
      const docId = num(f.DocumentLookupId) ?? num(f.DocumentId);
      if (docId === undefined) continue;
      if (!caseRowsByDoc.has(docId)) caseRowsByDoc.set(docId, []);
      caseRowsByDoc.get(docId).push({ id: String(it.id), fields: f });
    }
  } else if (sw.recase) {
    throw new Error(
      "--recase needs sharePoint.lists.testCases — create the Test Cases " +
      "list per Local_Setup §12 / schemas/SPList_TestCases.csv and add its GUID"
    );
  } else {
    process.stderr.write(
      "note: sharePoint.lists.testCases is not configured — individual test " +
      "cases are not indexed (Local_Setup §12: create the Test Cases list, " +
      "paste its GUID, then backfill with --recase)\n"
    );
  }
  // Case-tag vocabulary (caseindex v1.2): the run-start Keywords
  // snapshot compiled once — alias rows match under their own title
  // but report their CANONICAL's name and kind. Deliberately not
  // updated mid-run (the Get_kw_meta / kwSnapshot precedent, flow
  // §5.7 accepted degradation): keywords minted THIS run reach case
  // tags on the doc's next reindex or the next --recase.
  let ciVocab = null;
  if (ciEnabled) {
    const kwById2 = new Map(keywordRows.map((k) => [k.ID, k]));
    // document frequency per canonical keyword (v1.3): its DocKeywords
    // junction count — junctions are already minted against the
    // canonical id, so no folding needed here. caseTags orders tags
    // rarest-first with it, so the Keywords cap truncates the
    // ubiquitous tail ("route") instead of the distinctive terms.
    const dfById = new Map();
    for (const j of docKwRows) {
      if (j.KeywordId !== undefined) {
        dfById.set(j.KeywordId, (dfById.get(j.KeywordId) || 0) + 1);
      }
    }
    ciVocab = prepareVocab(
      keywordRows.map((r) => {
        const canon = (r.CanonicalRefId && kwById2.get(r.CanonicalRefId)) || r;
        return {
          title: r.Title, kind: canon.Kind || r.Kind, canonical: canon.Title,
          df: dfById.get(canon.ID) || 0,
        };
      })
    );
  }
  // Replace one document's case-row set with what its body states now.
  // An empty/off-kind fresh side deletes the document's rows (archived,
  // reclassified, or de-scoped docs clean up through the same path).
  // Never throws: a case-write failure lands in the run summary, not in
  // the document's own lane.
  const syncCases = async (rowId, docKind, bodyText, sum, planTitle) => {
    if (!ciEnabled || !rowId) return;
    try {
      let fresh = [];
      if (ciKinds.includes(docKind)) {
        const parsed = extractCases(bodyText, {
          defaultRepo: sw.defaultRepo,
          caseTextCap: cfg.sweep.caseIndex && cfg.sweep.caseIndex.caseTextCap,
          vocab: ciVocab,
          planTitle: planTitle || "",
          mediaUrlBase: `${sw.siteUrl}${sw.textsFolder}/media`,
        });
        if (parsed.mixed) sum.cases_shape_mixed++;
        if (parsed.shape === "none") sum.plans_caseless++;
        const now = new Date().toISOString();
        fresh = parsed.cases.map((c) => toRowFields(rowId, c, now));
      }
      const existing = caseRowsByDoc.get(rowId) || [];
      if (!fresh.length && !existing.length) return;
      const plan = diffCaseRows(existing, fresh);
      const next = existing.filter((r) => !plan.delete.includes(r.id));
      for (const f of plan.create) {
        const created = await writer.createRow("testCases", f);
        next.push({ id: String(created.id), fields: f });
      }
      for (const u of plan.update) {
        await writer.patchRow("testCases", u.id, u.fields);
        const row = next.find((r) => r.id === u.id);
        if (row) row.fields = u.fields;
      }
      for (const id of plan.delete) await writer.deleteRow("testCases", id);
      caseRowsByDoc.set(rowId, next);
      sum.cases_upserted += plan.create.length + plan.update.length;
      sum.cases_removed += plan.delete.length;
    } catch (e) {
      sum.case_errors++;
      process.stderr.write(`CASE-INDEX ERROR doc ${rowId}: ${e.message}\n`);
    }
  };

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

  // ---- --normalize-cases: the opt-in LLM lane (Sidecar_Format_Plan
  // phase 4). Candidates = case-indexed plans whose body the detectors
  // left caseless although the audit sees a case shape in it. Dry by
  // default (the candidate list, no model call); `--live` needs
  // sweep.normalizeCases.enabled (the owner switch), spends at most
  // maxPerRun calls, and writes a plan's body only when the reply
  // passes the contract lint + grounding (casenormalize.mjs). Never
  // reachable from the nightly index, --reformat or --recase.
  if (sw.normalize) {
    const nc = { ...FLOW_DEFAULTS.normalizeCases, ...(sw.normalizeCases || {}) };
    const provider = nc.provider || cfg.llm.provider || (cfg.llm.environmentUrl ? "aibuilder" : "anthropic");
    const zsum = { mode: "normalize-cases", dry_run: dry, provider, prompt_version: NORMALIZE_PROMPT_VERSION,
                   eligible: 0, candidates: 0, normalized: 0, refused: 0, errors: 0, skipped_cap: 0,
                   cases_upserted: 0, cases_removed: 0, case_errors: 0, plans_caseless: 0, cases_shape_mixed: 0 };
    if (!dry && !nc.enabled) {
      throw new Error(
        "--normalize-cases --live requires sweep.normalizeCases.enabled: true in config — " +
        "the owner switch for AI spend on sidecar bodies (dry runs list the candidates without it)"
      );
    }
    const template = provider === "anthropic"
      ? loadPromptTemplate(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "prompts", "CaseNormalize_Prompt.md"))
      : "";
    if (!dry && provider === "aibuilder" && !cfg.llm.normalizeModelId) {
      throw new Error("llm.normalizeModelId is not set — paste prompts/CaseNormalize_Prompt.md as a tenant prompt (inputs PlanTitle, Body) or use provider \"anthropic\"");
    }
    const plans = [];
    for (const r of docIndexRows) {
      if (!r.ID || !ciKinds.includes(r.DocKind)) continue;
      if (r.IndexStatus !== "Indexed" || !r.TextFileUrl) continue;
      if (sw.smokeFile && lower(String(r.FileName || "").trim()) !== lower(sw.smokeFile.trim())) continue;
      zsum.eligible++;
      const local = urlToLocal(String(r.TextFileUrl), sw, cfg);
      if (!local || !fs.existsSync(local)) continue;
      const content = fs.readFileSync(local, "utf8");
      const seam = bodySeamEnd(content);
      if (seam < 0) continue;
      const body = content.slice(seam);
      if (body.includes("<!-- src: LLM")) continue;            // already normalized
      if (extractCases(body).shape !== "none") continue;         // the detectors cover it
      if (!hasSignal(auditBody(body))) continue;                 // genuinely caseless
      zsum.candidates++;
      plans.push({ r, local, content, seam, body });
    }
    const results = [];
    for (const p of plans) {
      if (zsum.normalized + zsum.refused + zsum.errors >= Number(nc.maxPerRun)) { zsum.skipped_cap++; continue; }
      const entry = { id: p.r.ID, title: p.r.Title || p.r.FileName, ok: false, failures: [], cases: 0 };
      results.push(entry);
      if (dry) { entry.failures = ["dry run: not called"]; continue; }
      try {
        const inputs = { PlanTitle: p.r.Title || p.r.FileName || "", Body: p.body };
        let raw;
        if (provider === "aibuilder") {
          const res = await aiBuilderPredict(cfg.llm, inputs, cfg.llm.normalizeModelId);
          raw = res?.responsev2?.predictionOutput?.text ?? "";
        } else {
          raw = await generateText({ ...cfg.llm, maxTokens: Number(nc.maxTokens) },
                                   buildNormalizePrompt(template, { planTitle: inputs.PlanTitle, body: p.body }));
        }
        const out = unwrapReply(raw);
        const v = verifyNormalized(p.body, out);
        entry.cases = v.cases;
        if (!v.ok) {
          entry.failures = v.failures;
          zsum.refused++;
          process.stderr.write(`NORMALIZE REFUSED doc ${p.r.ID} (${entry.title}): ${v.failures.slice(0, 3).join("; ")}\n`);
          continue;
        }
        const next = p.content.slice(0, p.seam) + out;
        writer.writeFile(p.local, next);
        if (remote) await remote.flush();
        await syncCases(p.r.ID, p.r.DocKind, out, zsum, p.r.Title || "");
        entry.ok = true;
        zsum.normalized++;
      } catch (e) {
        zsum.errors++;
        entry.failures = [String(e.message)];
        process.stderr.write(`NORMALIZE ERROR doc ${p.r.ID}: ${e.message}\n`);
      }
    }
    if (!dry && zsum.normalized && ciEnabled) {
      writeCaseCatalog(cfg, docIndexRows, caseRowsByDoc);
      if (remote) {
        const pg = path.join(cfg.paths.sidecarLibrary, "_Case Catalog.md");
        if (fs.existsSync(pg)) remote.queuePut(pg);
        await remote.flush().catch((e) => process.stderr.write(`remote flush of case catalog: ${e.message}\n`));
      }
    }
    const zDir = cfg.paths.workDir || tmpDir;
    fs.mkdirSync(zDir, { recursive: true });
    const zStamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
    const zLog = path.join(zDir, `sweep-${zStamp}.json`);
    fs.writeFileSync(zLog, JSON.stringify({ summary: zsum, plans: results, plan: dry ? writer.plan : undefined }, null, 1));
    pruneRunLogs(zDir);
    process.stdout.write(JSON.stringify({ ...zsum, logFile: zLog }) + "\n");
    for (const e of results) process.stdout.write(`${e.ok ? "normalized" : "not written"}: doc ${e.id} ${e.title}${e.ok ? ` (${e.cases} cases)` : ` — ${e.failures.slice(0, 2).join("; ")}`}\n`);
    if (dry) process.stdout.write(`normalize plan: ${zsum.candidates} candidate plan(s); re-run with --normalize-cases --live (sweep.normalizeCases.enabled: true) to call the model\n`);
    return;
  }

  // ---- --rename / --rename-plan: re-mint every sidecar stem from the
  // §4.6 rules (<issue>-<slug>[-qualifier].md, media/<stem>/), move
  // the files and their media, rewrite every inbound link corpus-wide,
  // patch TextFileUrl, rebuild the browse pages + manifest. Dry by
  // default (`--rename-plan` = the old→new table); `--live` applies.
  // Test Cases rows keep their old anchor/figure URLs until the next
  // `--recase --live` — the run says so.
  if (sw.rename) {
    const abbr = { ...defaultAbbreviations(), ...(sw.slugAbbreviations || {}) };
    const idsOf = new Map();
    for (const d of docIdRows) {
      if (!idsOf.has(d.DocumentId)) idsOf.set(d.DocumentId, []);
      idsOf.get(d.DocumentId).push({ repo: d.Repo, number: d.IssueNumber, source: d.Source });
    }
    const eligible = docIndexRows.filter((r) => r.ID && r.IndexStatus === "Indexed" && r.TextFileUrl);
    const folderOfRow = (r) => {
      const parts = String(r.TextFileUrl).split("/");
      return decodeURIComponent(parts[parts.length - 2] || "") || (sw.kindFolders[r.DocKind] || "Other");
    };
    const byFolder = new Map();
    const entries = [];
    for (const r of eligible) {
      const local = urlToLocal(String(r.TextFileUrl), sw, cfg);
      const content = local && fs.existsSync(local) ? fs.readFileSync(local, "utf8") : null;
      const meta = content ? readMeta(content) : {};
      const e = {
        row: r, local, content, folder: folderOfRow(r),
        oldStem: stemOf(r.TextFileUrl), newStem: "",
        doc: {
          rowId: r.ID, title: r.Title || "", fileName: r.FileName || "", kind: r.DocKind || "Other",
          ids: idsOf.get(r.ID) || [], products: String(r.Products || "").split("; ").filter(Boolean),
          docRevision: meta.doc_revision || "", lastEdited: meta.last_edited || r.SourceModified || "",
        },
      };
      entries.push(e);
      if (!byFolder.has(e.folder)) byFolder.set(e.folder, []);
      byFolder.get(e.folder).push(e);
    }
    for (const [, es] of byFolder) {
      const minted = mintStems(es.map((e) => e.doc), abbr);
      for (const e of es) e.newStem = minted.get(e.row.ID) || e.oldStem;
    }
    const nsum = { mode: "rename", dry_run: dry, eligible: entries.length, renamed: 0, unchanged: 0,
                   no_sidecar: 0, media_moved: 0, links_rewritten: 0, errors: 0 };
    const fileMap = new Map(); // old file name -> new file name (unique tokens)
    for (const e of entries) {
      if (!e.content) { nsum.no_sidecar++; continue; }
      if (e.newStem !== e.oldStem) fileMap.set(`${e.oldStem}.md`, `${e.newStem}.md`);
    }
    const table = entries.map((e) => ({
      id: e.row.ID, folder: e.folder, from: `${e.oldStem}.md`, to: `${e.newStem}.md`,
      changed: e.newStem !== e.oldStem,
    }));
    const mdir = path.join(cfg.paths.sidecarLibrary, "media");
    for (const e of entries) {
      if (!e.content) continue;
      try {
        let next = e.content;
        // this document's media: legacy flat files and the old stem
        // folder both move to media/<newStem>/
        for (const ml of mediaLinksOf(next)) {
          const from = ml.dir ? path.join(mdir, ml.dir, ml.name) : path.join(mdir, `${ml.legacyPrefix || ""}${ml.name}`);
          const toRel = `../media/${e.newStem}/${ml.name}`;
          if (ml.dir === e.newStem) continue;
          if (fs.existsSync(from)) {
            writer.writeFile(path.join(mdir, e.newStem, ml.name), fs.readFileSync(from));
            writer.deleteFile(from);
            nsum.media_moved++;
          }
          next = next.split(ml.link).join(toRel);
        }
        // every renamed neighbour referenced from this file
        for (const [from, to] of fileMap) {
          if (next.includes(from)) { next = next.split(from).join(to); nsum.links_rewritten++; }
        }
        const newLocal = path.join(path.dirname(e.local), `${e.newStem}.md`);
        if (e.newStem !== e.oldStem) {
          writer.writeFile(newLocal, next);
          writer.deleteFile(e.local);
          const url = `${sw.siteUrl}${sw.textsFolder}/${e.folder}/${e.newStem}.md`;
          await writer.patchRow("docIndex", e.row.ID, { TextFileUrl: { Url: url, Description: `${e.newStem}.md` } });
          e.row.TextFileUrl = url;
          nsum.renamed++;
        } else if (next !== e.content) {
          writer.writeFile(e.local, next);
          nsum.unchanged++;
        } else {
          nsum.unchanged++;
        }
      } catch (err) {
        nsum.errors++;
        process.stderr.write(`RENAME ERROR ${e.oldStem}: ${err.message}\n`);
      }
    }
    if (!dry) {
      writeIndexPages(cfg, docIndexRows, sw.kindFolders);
      writeManifest(cfg, docIndexRows, issueByDoc(docIndexRows, docIdRows));
      if (ciEnabled) writeCaseCatalog(cfg, docIndexRows, caseRowsByDoc);
      if (remote) {
        for (const pg of ["_Index.md", "_Manifest.json", "_Case Catalog.md"]) {
          const fp = path.join(cfg.paths.sidecarLibrary, pg);
          if (fs.existsSync(fp)) remote.queuePut(fp);
        }
        await remote.flush().catch((err) =>
          process.stderr.write(`remote flush after rename: ${err.message}\n`));
      }
    }
    const nDir = cfg.paths.workDir || tmpDir;
    fs.mkdirSync(nDir, { recursive: true });
    const nStamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
    const nLog = path.join(nDir, `sweep-${nStamp}.json`);
    fs.writeFileSync(nLog, JSON.stringify({ summary: nsum, renames: table, plan: dry ? writer.plan : undefined }, null, 1));
    pruneRunLogs(nDir);
    process.stdout.write(JSON.stringify({ ...nsum, logFile: nLog }) + "\n");
    for (const t of table) if (t.changed) process.stdout.write(`${t.folder}/${t.from} -> ${t.to}\n`);
    if (dry) process.stdout.write(`rename plan: ${table.filter((t) => t.changed).length} of ${table.length} sidecars would be renamed (log: ${nLog}); re-run with --rename --live to apply\n`);
    else if (nsum.renamed) process.stdout.write(`renamed ${nsum.renamed} sidecar(s); run --recase --live next so Test Cases anchors and figure links follow\n`);
    return;
  }

  // ---- --case-audit: which plans the case index covers, and what the
  // uncovered ones contain (Sidecar_Format_Plan phase 0). Reads the
  // sidecars on disk, runs the SAME parser --recase runs plus the
  // latent-shape signals in caseaudit.mjs, and writes `_Case Audit.md`
  // next to the catalog on a live run. No list writes, no extraction,
  // no AI calls; the Test Cases GUID is not required.
  if (sw.caseAudit) {
    const entries = [];
    let noSidecar = 0, noSeam = 0;
    for (const r of docIndexRows) {
      if (!r.ID || !ciKinds.includes(r.DocKind)) continue;
      if (r.IndexStatus !== "Indexed" || !r.TextFileUrl) continue;
      if (sw.smokeFile && lower(String(r.FileName || "").trim()) !== lower(sw.smokeFile.trim())) continue;
      const local = urlToLocal(String(r.TextFileUrl), sw, cfg);
      if (!local || !fs.existsSync(local)) { noSidecar++; continue; }
      const content = fs.readFileSync(local, "utf8");
      const seam = bodySeamEnd(content);
      if (seam < 0) { noSeam++; continue; }
      const body = content.slice(seam);
      const parsed = extractCases(body, { planTitle: r.Title || "" });
      const parts = String(r.TextFileUrl).split("/");
      const file = decodeURIComponent(parts[parts.length - 1] || "");
      const folder = decodeURIComponent(parts[parts.length - 2] || "");
      entries.push({
        id: r.ID, title: r.Title || r.FileName || `doc ${r.ID}`,
        target: folder ? `${folder}/${file}` : file,
        shape: parsed.shape, cases: parsed.cases.length, signals: auditBody(body),
      });
    }
    const asum = { mode: "case-audit", dry_run: dry, no_sidecar: noSidecar, no_seam: noSeam,
                   ...summarizeAudit(entries) };
    if (!dry && cfg.sweep.indexPages !== false) {
      const pg = path.join(cfg.paths.sidecarLibrary, "_Case Audit.md");
      fs.writeFileSync(pg, renderAuditPage(entries, new Date().toISOString()));
      if (remote) {
        remote.queuePut(pg);
        await remote.flush().catch((e) =>
          process.stderr.write(`remote flush of case audit: ${e.message}\n`));
      }
    }
    const aDir = cfg.paths.workDir || tmpDir;
    fs.mkdirSync(aDir, { recursive: true });
    const aStamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
    const aLog = path.join(aDir, `sweep-${aStamp}.json`);
    fs.writeFileSync(aLog, JSON.stringify({ summary: asum, plans: entries }, null, 1));
    pruneRunLogs(aDir);
    process.stdout.write(JSON.stringify({ ...asum, logFile: aLog }) + "\n");
    return;
  }

  // ---- --recase: rebuild the Test Cases list from the sidecars on
  // disk (Case_Index_Plan phase 2 — the backfill). No extraction, no
  // AI calls, no sidecar writes: each eligible document's body below
  // the metadata seam re-parses and replace-sets its case rows. Run
  // once after creating the list, and after any caseindex.mjs parser
  // bump (CaseIndexVersion); the nightly sweep keeps it converged.
  if (sw.recase) {
    const csum = {
      mode: "recase", dry_run: dry, eligible: 0, synced: 0,
      no_sidecar: 0, no_seam: 0, cases_upserted: 0, cases_removed: 0,
      case_errors: 0, plans_caseless: 0, cases_shape_mixed: 0,
    };
    const cap = sw._maxSet ? Number(sw.maxDocsPerRun) : Infinity;
    const done = new Set();
    for (const r of docIndexRows) {
      if (!r.ID || !ciKinds.includes(r.DocKind)) continue;
      if (r.IndexStatus !== "Indexed" || !r.TextFileUrl) continue;
      if (sw.smokeFile && lower(String(r.FileName || "").trim()) !== lower(sw.smokeFile.trim())) continue;
      csum.eligible++;
      if (csum.synced >= cap) continue;
      const local = urlToLocal(String(r.TextFileUrl), sw, cfg);
      if (!local || !fs.existsSync(local)) {
        csum.no_sidecar++;
        continue;
      }
      const content = fs.readFileSync(local, "utf8");
      const seam = bodySeamEnd(content);
      if (seam < 0) {
        csum.no_seam++;
        continue;
      }
      await syncCases(r.ID, r.DocKind, content.slice(seam), csum, r.Title || "");
      done.add(r.ID);
      csum.synced++;
    }
    // rows whose document is gone, Archived, reclassified, or no
    // longer Indexed delete here (the replace-set with an empty fresh
    // side); rows for eligible docs the cap or a missing sidecar
    // deferred are left alone. Smoke runs stay surgical: no cleanup.
    if (!sw.smokeFile) {
      const byId = new Map(docIndexRows.map((r) => [r.ID, r]));
      for (const docId of [...caseRowsByDoc.keys()]) {
        if (done.has(docId)) continue;
        const row = byId.get(docId);
        if (row && row.IndexStatus === "Indexed" && row.TextFileUrl &&
            ciKinds.includes(row.DocKind)) continue;
        await syncCases(docId, "", "", csum);
      }
    }
    // a live backfill leaves the browse surface current too: rebuild
    // the case catalog from the rows this run just converged
    if (!dry) {
      writeCaseCatalog(cfg, docIndexRows, caseRowsByDoc);
      if (remote) {
        const pg = path.join(cfg.paths.sidecarLibrary, "_Case Catalog.md");
        if (fs.existsSync(pg)) remote.queuePut(pg);
        await remote.flush().catch((e) =>
          process.stderr.write(`remote flush of case catalog: ${e.message}\n`));
      }
    }
    const cDir = cfg.paths.workDir || tmpDir;
    fs.mkdirSync(cDir, { recursive: true });
    const cStamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
    const cLog = path.join(cDir, `sweep-${cStamp}.json`);
    fs.writeFileSync(cLog, JSON.stringify({ summary: csum, plan: dry ? writer.plan : undefined }, null, 1));
    pruneRunLogs(cDir);
    process.stdout.write(JSON.stringify({ ...csum, logFile: cLog }) + "\n");
    if (dry) {
      process.stdout.write(`dry run: ${writer.plan.length} planned writes recorded in ${cLog}\n`);
    }
    return;
  }

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
        // prefer the sidecar's own metadata (original casing) over the
        // lowercased junction titles for display
        const yTools = metaList(before, "Tools");
        const yKeywords = metaList(before, "Keywords");
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
          cfg, sw, op, writer, summary: rsum, bodyIndex, embedIndex, caches, kwSnapshot,
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
        if (remote) await remote.flush();
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
    figures: 0, figure_errors: 0, figures_ocr: 0, figures_ocr_off: 0,
    cases_upserted: 0, cases_removed: 0, case_errors: 0,
    plans_caseless: 0, cases_shape_mixed: 0,
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
    figures_ocr: 0,
    figures_ocr_off: 0,
    graph_downloads: 0,
    cases_upserted: 0,
    cases_removed: 0,
    case_errors: 0,
    plans_caseless: 0,
    cases_shape_mixed: 0,
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
        // phase 4: a body the LLM lane normalized (and a human accepted)
        // is kept — the deterministic re-render would throw it away;
        // a source edit reindexes it fresh anyway
        if (cur.slice(seam).includes("<!-- src: LLM")) {
          rfsum.llm_kept = (rfsum.llm_kept || 0) + 1;
          continue;
        }
        const { docText: rfRaw, lane: rfLane, srcAuthor, srcEditor, srcEdited,
                figureCount, figureError, figureOcr, figureOcrOff, mediaFiles } = extractDocText({
          sw, cfg, op, writer, pdfTool, ocrTools, setStep: () => {},
          localPath, ext, srcItemId, modified, withMedia: false,
        });
        rfsum.figures += figureCount || 0;
        if (figureError) rfsum.figure_errors++;
        rfsum.figures_ocr += figureOcr || 0;
        rfsum.figures_ocr_off += figureOcrOff || 0;
        if (!rfRaw) {
          rfsum.no_text++;
          continue;
        }
        // phase 1b: media links point at media/<stem>/ — figures are
        // re-rendered into it here; images (not re-extracted on a
        // reformat) move out of the flat doc<srcItemId>_ naming once
        const stem = stemOf(existing.TextFileUrl);
        const docText = relinkMedia(rfRaw, stem);
        writeMedia(cfg, writer, stem, mediaFiles);
        rfsum.media_moved = (rfsum.media_moved || 0) + placeLegacyMedia(cfg, writer, srcItemId, stem);
        const body = renderBody(docText, existing.DocKind || "", cfg, rfsum);
        // format 3.0: the head (H1 + metadata table) is regenerated from
        // the row + the file's own metadata (whichever frame it carries),
        // the Summary/Related/docs stretch is preserved from disk with
        // the rel markers carrying their scores, and the yaml block —
        // if any — is dropped. The first extraction date is carried, so
        // a second --reformat is byte-idempotent.
        const oldMeta = readMeta(cur);
        const rowIds = docIdRows
          .filter((d) => d.DocumentId === existing.ID)
          .map((d) => ({ repo: d.Repo, number: d.IssueNumber }));
        const head = sidecarHead({
          h1Title: (existing.Title || name) === name ? name.replace(/\.[^.]*$/, "") : existing.Title,
          rowId: existing.ID, fileName: name, sourceLink,
          docKind: existing.DocKind || "", surface: existing.Surface || "",
          targetRelease: existing.TargetRelease || "", pe: existing.PE || "", dev: existing.Dev || "",
          srcAuthor, srcEditor, srcEditedText: fmtDate(srcEdited, true),
          lane: rfLane || oldMeta.extraction_lane,
          extractedOn: oldMeta.extracted || fmtDate(new Date().toISOString(), false),
          docRevision: oldMeta.doc_revision, promptVersion: existing.PromptVersion || sw.promptVersion,
          keywords: oldMeta.keywords, tools: oldMeta.tools,
          products: String(existing.Products || "").split("; ").filter(Boolean),
          ids: rowIds,
        });
        const sumAt = cur.indexOf("\n## Summary");
        let tail = sumAt >= 0 && sumAt < seam
          ? cur.slice(sumAt + 1, seam)
          : sidecarTail({ summary: existing.Summary || "" });
        if (!isFormat3(cur)) {
          const region = relatedRegion(tail);
          if (region) tail = tail.replace(region, migrateRelMarkers(region, relEntries(cur)));
        }
        const next = head + tail + body;
        if (next === cur) rfsum.unchanged++;
        else {
          writer.writeFile(scLocal, next);
          if (remote) await remote.flush();
          rfsum.rewritten++;
        }
        // the reformatted body is the case parser's input — sync the
        // doc's case rows even when the body itself is unchanged (the
        // rows may predate the feature, or a parser bump)
        await syncCases(existing.ID, existing.DocKind || "", body, rfsum, existing.Title || "");
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
      ext === "pdf" && !!(ocrTools && ocrTools.ppm) && !!pdfTool && inScope &&
      existing?.IndexStatus === "Skipped" &&
      existing?.ExtractionLane === "plaintext";
    // msg rescue (v1.37): rows stamped Skipped before the msg lane
    // existed (lane "none") re-enter once; the attempt restamps lane
    // "msg", so an unreadable message never rechurns.
    const msgRescue =
      ext === "msg" && inScope &&
      existing?.IndexStatus === "Skipped" &&
      existing?.ExtractionLane !== "msg";
    const scopeRescue =
      inScope &&
      existing?.IndexStatus === "Skipped" &&
      String(existing?.LastError || "").startsWith("out of sync scope");
    const needsIndex =
      !existing ||
      pdfRescue ||
      ocrRescue ||
      msgRescue ||
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
        cfg, sw, sp, op, writer, summary, pdfTool, ocrTools, bodyIndex, embedIndex, docLinks, linkResolver, syncCases,
        item: { name, fileRef, modified, srcItemId, sourceLink, localPath: effPath, ext, fileTypeSafe, docKey, inScope },
        existing, existingKeywords, kwSnapshot,
        caches: { byDocKey, kwByTitle, idKeys, linkKeys, kwKeys, docIndexRows, keywordRows, docIdRows, docLinkRows, docKwRows },
        setStep: (s) => (step = s),
      });
      if (remote) {
        // an upload failure here IS a failed index (the sidecar never
        // reached SharePoint) — it lands in the Error lane like any step
        step = "remote-upload";
        await remote.flush();
      }
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
      // media written before the failure still uploads (best-effort)
      if (remote) {
        await remote.flush().catch((e3) =>
          process.stderr.write(`remote flush after error: ${e3.message}\n`));
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
    ocrOffNote(rfsum.figures_ocr_off);
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
      // an archived doc's case rows are derived state — prune them
      // with the sidecar (empty fresh side = full deletion)
      await syncCases(g.ID, "", "", summary);
    }
    if (ghosts.length > cap) {
      process.stderr.write(`note: ${ghosts.length - cap} more ghost row(s) will archive on later runs (cap ${cap}/run)\n`);
    }
    if (remote) {
      await remote.flush().catch((e) =>
        process.stderr.write(`remote flush after ghosts: ${e.message}\n`));
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
    writeManifest(cfg, docIndexRows, issueByDoc(docIndexRows, docIdRows));
    // the case catalog (Case_Index_Plan phase 3): every indexed test
    // case grouped by plan, from the case rows this run maintains
    if (ciEnabled) writeCaseCatalog(cfg, docIndexRows, caseRowsByDoc);
    if (remote) {
      // the fs-written pages (status + indexes) ride the same
      // write-through; best-effort — a failed page upload is not a
      // failed run
      const lib = cfg.paths.sidecarLibrary;
      for (const p of [
        path.join(lib, "_Sweep Status.md"),
        path.join(lib, "_Index.md"),
        path.join(lib, "_Case Catalog.md"),
        ...Object.values(sw.kindFolders || {}).map((f) => path.join(lib, f, "_Index.md")),
      ]) {
        if (fs.existsSync(p)) remote.queuePut(p);
      }
      await remote.flush().catch((e) =>
        process.stderr.write(`remote flush of status/index pages: ${e.message}\n`));
    }
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

  ocrOffNote(summary.figures_ocr_off);
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
  const { cfg, sw, sp, op, writer, summary, pdfTool, ocrTools, bodyIndex, embedIndex, docLinks, linkResolver, syncCases, item, existing, existingKeywords, kwSnapshot, caches, setStep } = ctx;
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
  const { docText: rawDocText, relsText, lane, srcAuthor, srcEditor, srcEdited,
          figureCount, figureError, figureOcr, figureOcrOff, mediaFiles } = extractDocText({
    sw, cfg, op, writer, pdfTool, ocrTools, setStep,
    localPath, ext, srcItemId, modified, withMedia: true,
  });
  let docText = rawDocText;
  summary.figures = (summary.figures || 0) + (figureCount || 0);
  if (figureError) summary.figure_errors = (summary.figure_errors || 0) + 1;
  summary.figures_ocr = (summary.figures_ocr || 0) + (figureOcr || 0);
  summary.figures_ocr_off = (summary.figures_ocr_off || 0) + (figureOcrOff || 0);

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
    DocRevision: rx.docRevision || "",
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

  // (d) sidecar naming (phase 1b): <issue>-<slug>[-qualifier].md — a
  // stem is minted once and then FROZEN (the row's TextFileUrl is the
  // record; --rename re-mints the corpus), so an AI re-title never
  // renames a linked file
  const kindFolder = sw.kindFolders[docKind] || "Other";
  const sidecarFolder = `${sw.textsFolder}/${kindFolder}`;
  const frozen = existing?.TextFileUrl ? stemOf(existing.TextFileUrl) : "";
  const stem = frozen || mintStem(
    { rowId, title, fileName: name, kind: docKind, ids, products,
      docRevision: rx.docRevision || "", lastEdited: srcEdited || "" },
    takenStems(cfg, sw, caches.docIndexRows, kindFolder, rowId),
    { ...defaultAbbreviations(), ...(sw.slugAbbreviations || {}) }
  );
  const sidecarName = `${stem}.md`;
  // media lands in media/<stem>/; the body's placeholder links follow
  docText = relinkMedia(docText, stem);
  writeMedia(cfg, writer, stem, mediaFiles);
  const preview = cut(docText, sw.previewCap);

  // (e)+(f) header
  const header = sidecarHeader({
    h1Title: title === name ? name.replace(/\.[^.]*$/, "") : title,
    title, fileName: name, sourceLink, rowId,
    docKind, surface, targetRelease: ai.targetRelease || "",
    pe: ai.pe || "", dev: ai.dev || "",
    srcAuthor, srcEditor, srcEdited, srcEditedText: fmtDate(srcEdited, true), lane,
    extractedOn: fmtDate(new Date().toISOString(), false),
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
  // body gets the v1.20 presentation tidy + the phase-3 case grammar
  // for test plans; the LLM input, preview and similarity index all
  // keep the raw text
  const bodyText = renderBody(docText, docKind, cfg, summary);
  const sidecarContent = upsertDocsBlock(
    header + bodyText,
    docsBlock(ai.tools || [], docLinks, toolLinks, topicLinks)
  );
  writer.writeFile(localSidecar, sidecarContent);
  const textFileUrl = `${sw.siteUrl}${sidecarFolder}/${sidecarName}`;
  await writer.patchRow("docIndex", rowId, {
    Title: title, FileName: name, DocKey: docKey, IndexStatus: "Indexed",
    TextFileUrl: { Url: textFileUrl, Description: sidecarName },
    LastError: "", PromptVersion: sw.promptVersion, TextPreview: preview,
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

  // test-case rows (Case_Index_Plan phase 2): the same rendered body
  // the sidecar carries, replace-set onto the Test Cases list. Never
  // throws — a case-write failure is a summary counter, not a failed
  // index; a doc reclassified off the kinds list deletes its rows.
  setStep("case-index");
  await syncCases(rowId, docKind, bodyText, summary, title);

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
    cfg, sw, op, writer, summary, bodyIndex, embedIndex, caches, kwSnapshot, setStep,
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
    cfg, sw, op, writer, summary, bodyIndex, embedIndex, caches, kwSnapshot, setStep,
    rowId, name, docKey, title, meta, selfFile, textFileUrl, upsertText,
  } = ctx;
  setStep("related");
  bodyIndex.ensureBuilt(caches.docIndexRows, sw, cfg);
  if (upsertText !== undefined) bodyIndex.upsert(rowId, upsertText);
  let sims = bodyIndex.query(rowId);
  if (embedIndex) {
    // v1.38: embedding sims join through the same BodySim channel —
    // per doc, max(bm25, embed rescaled from [embedSimMin..1] to
    // [0..1]); the ranker (RelatedRank, untouched) sees one signal
    embedIndex.ensureBuilt(caches.docIndexRows, sw, cfg);
    if (upsertText !== undefined) embedIndex.upsert(rowId, upsertText);
    sims = mergeSims(sims, await embedIndex.query(rowId), sw.embedSimMin);
  }
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

const ocrOffNote = (n) => {
  if (n > 0) {
    process.stderr.write(
      `note: ${n} screenshot(s) wireframed with PLACEHOLDER text this run — ` +
      `set sweep.tesseractPath (install Tesseract) to transcribe them, ` +
      `then re-run with --reformat\n`
    );
  }
};

/** OCR tools (v1.36) — OPT-IN by explicit config: OCR runs only when
 *  sweep.tesseractPath is set (no PATH auto-detection, so machines
 *  that happen to have Tesseract don't silently change lanes).
 *  pdftoppm defaults to Poppler's, next to pdftotext on PATH.
 *  v1.41: pdftoppm is only the PDF lane's page renderer — the
 *  wireframe-OCR loop (v1.40) needs tesseract alone, so a machine
 *  without Poppler still transcribes screenshots. An unrunnable
 *  tesseract still disables all OCR loudly; an unrunnable pdftoppm
 *  now disables only the scanned-PDF lane, and says so. */
function detectOcrTools(sw) {
  if (!sw.tesseractPath) return null;
  const tess = sw.tesseractPath;
  if (spawnSync(tess, ["--version"], { encoding: "utf8" }).error) {
    process.stderr.write(
      `note: sweep.tesseractPath is set but tesseract ("${tess}") is not runnable — OCR lane disabled\n`
    );
    return null;
  }
  const ppm = sw.pdftoppmPath || "pdftoppm";
  if (spawnSync(ppm, ["-v"], { encoding: "utf8" }).error) {
    process.stderr.write(
      `note: pdftoppm ("${ppm}") is not runnable — the scanned-PDF OCR lane is disabled ` +
      `(wireframe OCR still runs; install Poppler to OCR image-only PDFs)\n`
    );
    return { tess, ppm: null };
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

/** DF-12 (v1.40): pull NAMED ppt/media entries out of the pptx — a
 *  minimal central-directory read (the xlsx_grid.mjs stance, node:zlib
 *  only). MediaExtract is not used here on purpose: its 350 KB
 *  per-image cap refuses exactly the hi-dpi screenshots OCR is for. */
function pptxMediaEntries(pptxPath, names) {
  const buf = fs.readFileSync(pptxPath);
  let eocd = -1;
  const scanFrom = Math.max(0, buf.length - 65557);
  for (let i = buf.length - 22; i >= scanFrom; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) return [];
  let off = buf.readUInt32LE(eocd + 16);
  const count = buf.readUInt16LE(eocd + 10);
  const out = [];
  for (let k = 0; k < count && off + 46 <= buf.length; k++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) break;
    const method = buf.readUInt16LE(off + 10);
    const csize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const cmtLen = buf.readUInt16LE(off + 32);
    const lho = buf.readUInt32LE(off + 42);
    const name = buf.toString("latin1", off + 46, off + 46 + nameLen);
    off += 46 + nameLen + extraLen + cmtLen;
    const base = name.replace(/^.*\//, "");
    if (!/^ppt\/media\//.test(name) || !names.includes(base)) continue;
    if (lho + 30 > buf.length) continue;
    const nl = buf.readUInt16LE(lho + 26), el = buf.readUInt16LE(lho + 28);
    const ds = lho + 30 + nl + el;
    const raw = buf.subarray(ds, ds + csize);
    try {
      out.push({ name: base, data: method === 8 ? zlib.inflateRawSync(raw) : raw });
    } catch { /* a corrupt entry contributes nothing — OCR is best-effort */ }
  }
  return out;
}

/** DF-12 (v1.40): transcribe the wireframed screenshots the figures op
 *  named (ocrWanted, comma-separated media basenames) with Tesseract's
 *  TSV output — word boxes in the picture's own pixel space, --psm 11
 *  (sparse text: UI labels are scattered, not a prose block). Returns
 *  the ocrJson payload SlideFigures takes, or null when there is
 *  nothing usable; confidence rides along and the script applies its
 *  own floor. */
function ocrFigureMedia(tools, pptxPath, wantedCsv) {
  const names = String(wantedCsv || "").split(",").filter(Boolean).slice(0, 16);
  if (!names.length) return null;
  const entries = pptxMediaEntries(pptxPath, names);
  if (!entries.length) return null;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "docindex-figocr-"));
  try {
    const out = [];
    for (const e of entries) {
      const p = path.join(dir, e.name);
      fs.writeFileSync(p, e.data);
      const r = spawnSync(tools.tess, [p, "stdout", "--psm", "11", "tsv"], {
        encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
      });
      if (r.error || r.status !== 0) continue;
      const words = [];
      for (const line of String(r.stdout || "").split("\n")) {
        const c = line.split("\t");
        if (c.length < 12 || c[0] !== "5") continue;
        const t = c[11].trim();
        const conf = Number(c[10]);
        if (!t || !(conf > 0)) continue;
        words.push({ x: Number(c[6]), y: Number(c[7]), w: Number(c[8]),
                     h: Number(c[9]), t: t, c: conf });
      }
      if (words.length) out.push({ entry: e.name, words });
    }
    return out.length ? JSON.stringify(out) : null;
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
