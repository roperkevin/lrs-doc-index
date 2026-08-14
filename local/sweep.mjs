#!/usr/bin/env node
/**
 * sweep.mjs v1.0 — the Doc Index sweep as a local Node orchestrator.
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
import { loadScripts, runOp, DEFAULT_SCRIPTS_DIR } from "../pad/runner/ops.mjs";
import { GraphClient } from "./graph.mjs";
import { classifyDoc } from "./llm.mjs";

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
  oversizeBytes: 3500000,
};

const DOC_KINDS = [
  "Test Plan", "User Story", "Design Spike", "Data Template",
  "Schedule", "Doc Review", "Other",
];
const SURFACES = ["Pro", "Experience Builder", "Server", "Enterprise", "Other"];
const KNOWN_EXT = ["pptx", "docx", "xlsx", "pdf", "msg", "txt", "html"];
const IMAGE_EXT = ["png", "jpg", "jpeg", "tif", "tiff", "gif", "bmp"];

// ---- small helpers --------------------------------------------------

const lower = (s) => String(s ?? "").toLowerCase();
const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n) : String(s));

function yamlEscape(s) {
  return String(s ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\r", " ")
    .replaceAll("\n", " ");
}
const stripQuotes = (s) => String(s ?? "").replaceAll('"', "");
const pipeToSlash = (s) => String(s ?? "").replaceAll("|", "/");

function fmtDate(iso, withTime) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  const day = `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
  return withTime ? `${day} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}` : day;
}

function quoteYamlItem(s) {
  // Select_kw_yaml: strip backslashes and double quotes, then wrap.
  return '"' + String(s ?? "").replaceAll("\\", "").replaceAll('"', "") + '"';
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
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.config) throw new Error("usage: sweep.mjs --config <config.json> [--live|--dry-run] [--max N] [--only <file>]");
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  cfg.sweep = { ...FLOW_DEFAULTS, ...(cfg.sweep || {}) };
  if (args.flags.live) cfg.sweep.dryRun = false;
  if (args.flags.dry) cfg.sweep.dryRun = true;
  if (args.flags.max !== undefined) cfg.sweep.maxDocsPerRun = args.flags.max;
  if (args.flags.only !== undefined) cfg.sweep.smokeFile = args.flags.only;
  cfg.llm = cfg.llm || {};
  // the aibuilder provider reuses the Graph app registration by default
  cfg.llm.dataverse = cfg.llm.dataverse || cfg.graph;
  cfg.sharePoint.sourceSitePath = cfg.sharePoint.sourceSitePath || "/sites/LocationReferencing";
  cfg.sharePoint.docKeyStrip = cfg.sharePoint.docKeyStrip || "/sites/LocationReferencing/";
  cfg.sharePoint.libraryRootSegment = cfg.sharePoint.libraryRootSegment || "Shared Documents";
  return cfg;
}

// ---- write layer (real vs dry-run plan) -----------------------------

class Writer {
  constructor(graph, siteId, lists, dryRun) {
    this.graph = graph;
    this.siteId = siteId;
    this.lists = lists;
    this.dryRun = dryRun;
    this.plan = [];
    this._pseudoId = -1;
  }
  log(action, target, detail) {
    this.plan.push({ action, target, detail });
  }
  async createRow(listKey, fields) {
    this.log("createRow", listKey, fields);
    if (this.dryRun) return { id: this._pseudoId-- };
    const res = await this.graph.createItem(this.siteId, this.lists[listKey], fields);
    return { id: Number(res.id) };
  }
  async patchRow(listKey, id, fields) {
    this.log("patchRow", `${listKey}/${id}`, fields);
    if (this.dryRun) return;
    await this.graph.updateItemFields(this.siteId, this.lists[listKey], id, fields);
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

const num = (v) => {
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return isNaN(n) ? undefined : n;
};
const hyperlink = (v) => (v && typeof v === "object" ? v.Url || "" : v || "");

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
          Summary: f.Summary || "",
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
  const sw = cfg.sweep;
  const sp = cfg.sharePoint;
  const dry = !!sw.dryRun;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "docindex-sweep-"));
  const mains = await loadScripts(
    cfg.scriptsDir || DEFAULT_SCRIPTS_DIR,
    ["ziptext", "media", "regex", "workbookdump", "related", "sidecarpatch"],
    tmpDir
  );
  const op = (o) => runOp(mains, o);

  const graph = new GraphClient(cfg.graph);
  const siteId = await graph.siteId(sp.hostname, sp.sitePath);
  const srcSiteId = await graph.siteId(sp.hostname, sp.sourceSitePath);
  const writer = new Writer(graph, siteId, sp.lists, dry);

  // ---- run-start snapshots (replaces per-doc Check_* queries) ----
  const fetch = async (listKey, kind, select) =>
    normalizeRows(
      await graph.listItems(siteId, sp.lists[listKey], { select }),
      kind
    );
  const docIndexRows = await fetch("docIndex", "docIndex", [
    "Title", "FileName", "DocKey", "IndexStatus", "SourceModified",
    "PromptVersion", "TextFileUrl", "DocKind", "Surface", "TargetRelease",
    "PE", "Dev", "Summary",
  ]);
  const keywordRows = await fetch("keywords", "keywords", ["Title", "Kind", "CanonicalRefLookupId"]);
  const docIdRows = await fetch("docIds", "docIds", ["Title", "Repo", "IssueNumber", "Source", "IdKey", "DocumentLookupId"]);
  const docLinkRows = await fetch("docLinks", "docLinks", ["LinkType", "SharedValues", "Strength", "LinkKey", "DocALookupId", "DocBLookupId"]);
  const docKwRows = await fetch("docKeywords", "docKeywords", ["Title", "KWKey", "DocumentLookupId", "KeywordLookupId"]);

  const byDocKey = new Map(docIndexRows.map((r) => [lower(r.DocKey), r]));
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

  // ---- selection ----
  const files = await graph.listItems(srcSiteId, sp.lists.sourceLibrary, {
    select: ["FileLeafRef", "FileRef", "Modified", "File_x0020_Size", "FSObjType"],
  });
  files.sort((a, b) =>
    String(b.fields?.Modified || b.lastModifiedDateTime || "").localeCompare(
      String(a.fields?.Modified || a.lastModifiedDateTime || "")
    )
  );

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

    // Needs_index
    const needsIndex =
      !existing ||
      existing.IndexStatus === "Error" ||
      (existing.SourceModified || "1900-01-01T00:00:00Z") < modified ||
      (existing.PromptVersion || "") !== sw.promptVersion;
    if (isFolder || !needsIndex || summary.processed >= sw.maxDocsPerRun) continue;
    summary.processed++; // incremented before Try_index, as in the flow

    // local path in the synced library
    const libRel = siteRel.startsWith(sp.libraryRootSegment + "/")
      ? siteRel.slice(sp.libraryRootSegment.length + 1)
      : siteRel;
    const localPath = path.join(cfg.paths.sourceLibrary, ...libRel.split("/"));
    const sourceLink = item.webUrl || "";

    let step = "start";
    try {
      step = "extract";
      await indexDoc({
        cfg, sw, sp, op, writer, summary,
        item: { name, fileRef, modified, srcItemId, sourceLink, localPath, ext, fileTypeSafe, docKey },
        existing, existingKeywords, kwSnapshot,
        caches: { byDocKey, kwByTitle, idKeys, linkKeys, kwKeys, docIndexRows, keywordRows, docIdRows, docLinkRows, docKwRows },
        setStep: (s) => (step = s),
      });
    } catch (e) {
      // Catch_index: Error row, LastError "{step}: {detail}", continue.
      summary.errors++;
      const errDetail = cut(`${step}: ${e.message}`, 4000);
      process.stderr.write(`ERROR ${name}: ${errDetail}\n`);
      try {
        const fields = {
          Title: name, FileName: name, DocKey: docKey,
          IndexStatus: "Error", IndexedOn: new Date().toISOString(),
          LastError: errDetail,
        };
        if (existing) {
          await writer.patchRow("docIndex", existing.ID, fields);
          Object.assign(existing, { IndexStatus: "Error" });
        } else {
          const created = await writer.createRow("docIndex", {
            ...fields,
            SourceLink: { Url: sourceLink, Description: name },
            FileType: fileTypeSafe, SourceModified: modified,
            PromptVersion: sw.promptVersion,
          });
          const row = { ID: created.id, DocKey: docKey, IndexStatus: "Error", SourceModified: modified, PromptVersion: sw.promptVersion, Title: name, FileName: name, TextFileUrl: "" };
          byDocKey.set(docKey, row);
          docIndexRows.push(row);
        }
      } catch (e2) {
        process.stderr.write(`ERROR-row write failed for ${name}: ${e2.message}\n`);
      }
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
  const { cfg, sw, sp, op, writer, summary, item, existing, existingKeywords, kwSnapshot, caches, setStep } = ctx;
  const { name, modified, srcItemId, sourceLink, localPath, ext, fileTypeSafe, docKey } = item;

  // Switch_ext (incl. the oversize synthetic value)
  let docText = "", relsText = "", lane = "none";
  let srcAuthor = "", srcEditor = "", srcEdited = "";
  const size = fs.existsSync(localPath) ? fs.statSync(localPath).size : 0;
  const oversize = size > sw.oversizeBytes && ext !== "xlsx";
  if (!fs.existsSync(localPath)) {
    throw new Error(`source file not found locally: ${localPath} (is the library synced?)`);
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
    if (zt.media && zt.media.length) {
      setStep("media");
      const md = op({ op: "media", zipFile: localPath });
      for (const img of md.images || []) {
        const imgPath = path.join(cfg.paths.sidecarLibrary, "media", `doc${srcItemId}_${img.name}`);
        writer.writeFile(imgPath, Buffer.from(img.b64 || img.base64 || "", "base64"));
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
  }
  // pdf/msg/html/image/other/oversize: DocText stays empty → Skip lane.

  if (!docText || docText === "") {
    // Skip lane
    setStep("skip-row");
    const base = {
      Title: name, FileName: name, DocKey: docKey,
      IndexStatus: "Skipped", SourceModified: modified,
      IndexedOn: new Date().toISOString(), PromptVersion: sw.promptVersion,
    };
    if (!existing) {
      const created = await writer.createRow("docIndex", {
        ...base,
        SourceLink: { Url: sourceLink, Description: name },
        FileType: fileTypeSafe, ExtractionLane: lane,
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
  writer.writeFile(localSidecar, header + docText);
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

  // (j) relatedness — see flow §5
  setStep("related");
  const myKws = caches.docKwRows.filter((r) => r.DocumentId === rowId).slice(0, sw.myKwsTop);
  const idLinks = caches.docLinkRows
    .filter((r) => r.DocAId === rowId || r.DocBId === rowId)
    .slice(0, sw.linksTop);
  if (!myKws.length && !idLinks.length) return;

  const myKwIds = new Set(myKws.map((r) => r.KeywordId ?? -1));
  const kwMeta = kwSnapshot.filter(
    (r) => myKwIds.has(r.ID) || myKwIds.has(r.CanonicalRefId ?? 0)
  );
  const sharerIds = new Set([...myKwIds, ...kwMeta.map((r) => r.ID)]);
  const sharers = caches.docKwRows
    .filter((r) => sharerIds.has(r.KeywordId))
    .slice(0, sw.sharersTop);
  const selfMetaRank = {
    kind: docKind, surface, release: ai.targetRelease || "",
    pe: ai.pe || "", dev: ai.dev || "", modified, title,
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
  if (!(shortlist.count > 0)) return;

  const candRows = caches.docIndexRows.filter((r) => shortlist.docIds.includes(r.ID));
  // "final" without the flow's trailing space — RelatedRank reads any
  // non-"shortlist" mode as final.
  const rank = op({ ...relatedCommon, mode: "final", candsMetaJson: candRows, topN: sw.relatedTopN });
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
  const selfFile = { doc: rowId, name: sidecarName, folder: sidecarFolder, content: header + docText };
  const patch = op({
    op: "sidecarpatch",
    filesJson: [selfFile, ...neighborFiles],
    selfId: String(rowId),
    rankedJson: rank.related || [],
    docsMetaJson: finalDocs,
    selfMetaJson: { doc: rowId, title, url: textFileUrl, file: sidecarName },
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

// TextFileUrl / sidecar folder → local synced path
function urlToLocal(url, sw, cfg) {
  let rel = url.replace(sw.siteUrl, "");
  try {
    rel = decodeURIComponent(rel);
  } catch { /* keep raw */ }
  if (!rel.startsWith(sw.textsFolder + "/")) return null;
  const inside = rel.slice(sw.textsFolder.length + 1);
  return path.join(cfg.paths.sidecarLibrary, ...inside.split("/"));
}

function folderToLocal(folder, sw, cfg) {
  if (folder === sw.textsFolder) return cfg.paths.sidecarLibrary;
  if (!folder.startsWith(sw.textsFolder + "/")) return null;
  return path.join(cfg.paths.sidecarLibrary, ...folder.slice(sw.textsFolder.length + 1).split("/"));
}

main().catch((e) => {
  process.stderr.write("sweep: " + (e.stack || e.message) + "\n");
  process.exit(1);
});
