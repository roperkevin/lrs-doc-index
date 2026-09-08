#!/usr/bin/env node
/**
 * sweep.mjs — the Doc Index sweep as a local Node orchestrator
 * (version history: docs/changelog/pipeline.md; the pure helpers live in
 * pipeline/lib/ since the v1.31 module split — util, doclinks,
 * presentation, bodyindex, statuspage, config).
 * Replaces the DocIndexSweep Power Automate cloud flow (v2.8): same
 * pipeline, same list writes, same sidecar bytes — no Power Automate,
 * no Run-script quota, no AI Builder.
 *
 * Faithful to flow/v2_8/definition.json (see the orchestration spec
 * extracted 2026-08-14). The extract/*.ts files run UNMODIFIED via
 * extract/runner/ops.mjs (the gated PAD loader); the AI Builder call
 * becomes a direct LLM API call using the same prompt file
 * (pipeline/llm.mjs); list writes go through Microsoft Graph
 * (pipeline/graph.mjs); document reads and all file writes (sidecars,
 * media, patched neighbors) go through the OneDrive-synced libraries
 * as plain file I/O.
 *
 * Usage:
 *   node --experimental-strip-types pipeline/sweep.mjs --config config.json
 *        [--live | --dry-run]   override config.sweep.dryRun
 *        [--max N]              override MaxDocsPerRun
 *        [--only <filename>]    SmokeFile equivalent (single-doc run)
 *        [--progress]           narrate the run on stderr (see below)
 *        [--no-progress]        stay quiet even at a console
 *
 * Progress output (pipeline/lib/progress.mjs): every phase of the run
 * — the snapshots, each standalone mode's loop, every document's
 * steps, ghost reconciliation, the index pages — writes one
 * `progress: ...` line to STDERR when progress is on (a console by
 * default, `--progress` / `config.progress` for a scheduled task).
 * stdout keeps its contract byte-for-byte: the summary JSON, the
 * Sweep_summary line, the dry-run plan note.
 *
 * Deliberate deviations from the cloud flow (each equivalent, all
 * documented in docs/setup.md §6):
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
 * run it first on a fresh machine (docs/setup.md §5).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { loadScripts, runOp, DEFAULT_SCRIPTS_DIR } from "../extract/runner/ops.mjs";
import { GraphClient, SpoClient } from "./graph.mjs";
import { classifyDoc, generate } from "./llm.mjs";
import { assertNodeVersion, validateConfig, SWEEP_REQUIRED } from "./lib/config.mjs";
import {
  lower, cut, folderOf, yamlEscape, stripQuotes, pipeToSlash, fmtDate,
  quoteYamlItem, htmlToText, num, hyperlink, urlToLocal, folderToLocal, unwrapPdfText,
  pruneRunLogs, exportListSnapshots,
} from "./lib/util.mjs";
import { sendAlert, recordHeartbeat, checkHeartbeat } from "./lib/alerts.mjs";
import { extractCases, toRowFields, diffCaseRows, prepareVocab } from "./lib/caseindex.mjs";
import { prettifyMedia, placeDrawings, extractFigures, toFigureRowFields, diffFigureRows, imageSize } from "./lib/figureindex.mjs";
import { auditBody, summarizeAudit, renderAuditPage, hasSignal } from "./lib/caseaudit.mjs";
import { auditLayout, summarizeLayout, renderLayoutPage } from "./lib/layoutaudit.mjs";
import { unwrapReply, verifyNormalized, NORMALIZE_PROMPT_VERSION } from "./lib/casenormalize.mjs";
import { renderMetaTable, readMeta, metaList, relEntries, relatedRegion, migrateRelMarkers, isFormat3 } from "./lib/sidecarmeta.mjs";
import { mintStem, mintStems, stemOf, relinkMedia, mediaLinksOf, primaryIssue, defaultAbbreviations, MEDIA_PLACEHOLDER } from "./lib/slug.mjs";
import { writeIndexPages, writeCaseCatalog, writeFigureCatalog, writeManifest } from "./lib/indexpages.mjs";
import { parseMsg, msgToMarkdown } from "./lib/msg.mjs";
import { RemoteLibrary } from "./lib/remotefs.mjs";
import {
  loadDocLinks, DocPageIndex, ToolLinkResolver, docsBlock,
  upsertDocsBlock, bodySeamEnd,
} from "./lib/doclinks.mjs";
import { tidyBody, compactWhy } from "./lib/presentation.mjs";
import { renderTestPlanBody, lintTestPlanBody, canonicalizeCaseBlocks } from "./lib/casegrammar.mjs";
import { renderStoryBody } from "./lib/storyprofile.mjs";
import { BodyIndex } from "./lib/bodyindex.mjs";
import { writeStatusPage } from "./lib/statuspage.mjs";
import { createProgress, resolveProgress, secs, noProgress } from "./lib/progress.mjs";
import { loadVocabulary, normalizeTools, toolsNamedIn, VOCABULARY_FILE } from "./lib/vocabulary.mjs";
import {
  folderKind, folderOf as libraryFolderOf, detectSurfaces, signalsBlock, reconcile,
  DEFAULT_FOLDER_KINDS,
} from "./lib/docsignals.mjs";

// ---- flow v2.8 Config defaults (override via config.sweep) ----------

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The Doc Index row stamp that drives reindexing (`PromptVersion`):
 * `v<version>` of prompts/docindex_classify.md's front matter, so a
 * classifier change is a version bump in the prompt file and the
 * nightly run backfills the corpus maxDocsPerRun at a time. Set
 * `sweep.promptVersion` in config only to PIN an older stamp (a
 * staged backfill); the pin is loud in the run's first stderr line.
 */
export function classifyPromptStamp() {
  const file = path.join(REPO_ROOT, "prompts", "docindex_classify.md");
  const m = /^version:\s*["']?([0-9][^"'\s]*)["']?\s*$/m.exec(fs.readFileSync(file, "utf8"));
  if (!m) throw new Error(`${file}: no "version:" line in the front matter`);
  return "v" + m[1];
}

const FLOW_DEFAULTS = {
  siteUrl: "https://esriis.sharepoint.com/sites/lrsworkspace",
  textsFolder: "/LRS Doc Index",
  smokeFile: "",
  defaultRepo: "ArcGISPro/ps-location-referencing",
  promptVersion: classifyPromptStamp(),
  // --normalize-cases (Sidecar_Format_Plan phase 4): the OPT-IN LLM lane
  // for plans the detectors leave caseless. enabled = the owner switch
  // (a live run refuses without it); maxPerRun caps model calls
  // (prompts/case_normalize.md); maxTokens bounds the reply.
  // maxInputChars skips (and counts) a plan whose body is larger — a
  // 350 KB pdf body is a very expensive call and a reply that size
  // would overrun any maxTokens; such plans stay on the audit list.
  normalizeCases: { enabled: false, maxPerRun: 10, maxTokens: 32000, maxInputChars: 150000 },
  // figure indexing (Figure_Index_Plan; sweep v1.59): enabled by
  // sharePoint.lists.figures alone. kinds [] = every DocKind gets
  // figure rows; contextCap bounds the per-figure skim text.
  figureIndex: { kinds: [], contextCap: 2000 },
  // drawn shapes + text (sweep v1.61 / ShapeExtract v1.0): every pptx
  // slide that carries a drawing yields a faithful SVG in media/<stem>/
  // plus a `[connections: A → B]` line; false turns the lane off.
  drawings: true,
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
  // v1.66 (lib/docsignals.mjs): the SOURCE library's folders as a
  // kind signal — a segment of the document's folder path that matches
  // a key (case, spacing and depth insensitive) implies the kind. The
  // config value REPLACES this map. folderKindWins: the folder's kind
  // replaces whatever the classifier said (the team's own filing
  // outranks a reading of the text); false = it replaces only Other.
  folderKinds: { ...DEFAULT_FOLDER_KINDS },
  folderKindWins: true,
  maxCellsWorkbookDump: 60000,
  // v1.10: 50 MB. The flow's 3.5 MB cap was a Power Automate/Office
  // Scripts payload limit; locally it's only a memory/time guard, so
  // big decks — often the richest docs — index instead of skipping.
  // (LLM input is still bounded by textCap regardless of file size.)
  oversizeBytes: 52428800,
};

// the kinds (Test Plan … Doc Review, Other) and the surfaces (Pro,
// Experience Builder, REST, Server, Enterprise, Other) are
// docsignals.mjs's DOC_KINDS / SURFACES — one source for the prompt,
// the reconciliation and the schema notes in schemas/SPList_DocIndex.csv
const KNOWN_EXT = ["pptx", "docx", "xlsx", "pdf", "msg", "txt", "html"];
const IMAGE_EXT = ["png", "jpg", "jpeg", "tif", "tiff", "gif", "bmp"];

/**
 * probeSourceRead — a source that EXISTS on disk can still be
 * unreadable (sweep v1.64). On a OneDrive-synced library a Files
 * On-Demand placeholder that fails to hydrate (OneDrive paused, signed
 * out or not running, the folder set to "Free up space") passes
 * existsSync/statSync — the placeholder carries the real size — and
 * then every read fails with Node's `UNKNOWN: unknown error, read`
 * (the Windows cloud-files error libuv cannot map), a message with no
 * path in it. One live night did that to 127 of 150 documents, each
 * stamped an anonymous `ziptext-pptx: UNKNOWN: unknown error, read`.
 * Reading the first bytes here, before extraction, catches it while
 * the path is still known: one retry covers a transient sync lock,
 * then the caller either downloads through Graph
 * (sweep.graphDownloadFallback, the v1.33 sync-lag route) or lands a
 * LastError that names the file and the cause. Returns null when the
 * file reads, else the Error.
 */
async function probeSourceRead(localPath, { retries = 1, delayMs = 1500 } = {}) {
  const buf = Buffer.alloc(65536);
  for (let attempt = 0; ; attempt++) {
    let fd = -1;
    try {
      fd = fs.openSync(localPath, "r");
      fs.readSync(fd, buf, 0, buf.length, 0);
      return null;
    } catch (e) {
      if (attempt >= retries) return e;
    } finally {
      if (fd >= 0) { try { fs.closeSync(fd); } catch { /* already closed */ } }
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
}

/** The LastError for an on-disk source that cannot be read: the OS
 *  message, the likely cause on a synced library, the two fixes, and
 *  the path (Node's own message omits it). */
function unreadableSourceMessage(localPath, e) {
  return `source file exists but cannot be read (${e.message}) — on a OneDrive-synced ` +
    `library this is a Files On-Demand placeholder that did not hydrate (OneDrive paused, ` +
    `signed out or not running, or the folder set to "Free up space"): in OneDrive mark the ` +
    `library "Always keep on this device", or set sweep.graphDownloadFallback: true to fetch ` +
    `such files through Graph. Retries nightly until it reads: ${localPath}`;
}

/**
 * extractDocText — the flow's Switch_ext lane dispatch, shared by
 * indexDoc and the `--reformat` pass (which re-extracts without
 * spending an AI call). withMedia=false skips media extraction:
 * the images are already on disk from the original index.
 */
function extractDocText({ sw, cfg, op, writer, pdfTool, ocrTools, setStep, localPath, ext, srcItemId, modified, withMedia }) {
  let docText = "", relsText = "", lane = "none";
  let srcAuthor = "", srcEditor = "", srcEdited = "";
  // media is minted against a PLACEHOLDER folder and handed back to
  // the caller as bytes: the document's stem (its media folder name)
  // is only known once the title is — phase 1b, media/<stem>/<asset>
  const mediaFiles = [];
  // drawn shapes + text (v1.61): ShapeExtract's per-slide drawings —
  // regenerated on every extraction (a reformat too: they are derived
  // from the source, cheap, and the renderer may have moved on)
  let drawings = [];
  let drawingsSkipped = "";
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
    if (ext === "pptx" && sw.drawings !== false && docText) {
      setStep("shapes");
      const sd = op({ op: "shapes", zipFile: localPath });
      const placed = placeDrawings(docText, sd.drawings || []);
      docText = placed.text;
      drawings = (sd.drawings || []).filter((d) => placed.placed.includes(d.name));
      drawingsSkipped = sd.skipped || "";
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
  return { docText, relsText, lane, srcAuthor, srcEditor, srcEdited, mediaFiles, drawings, drawingsSkipped };
}

/** The drawing SVGs as media files, their picture placeholders pointing
 *  at the pictures' STANDARDIZED names (the sweep renamed them after the
 *  script ran). */
function drawingFiles(drawings, renames) {
  const to = new Map((renames || []).map((r) => [r.from, r.to]));
  return (drawings || []).map((d) => {
    let svg = String(d.svg || "");
    for (const [from, dest] of to) svg = svg.split(`href="${from}"`).join(`href="${dest}"`);
    return { name: d.name, data: Buffer.from(svg, "utf8") };
  });
}

/** The sidecar BODY for a document (phase 3): tidyBody for every
 *  kind, plus the `testplan/v1` case grammar for the case-indexed
 *  kinds (casegrammar.mjs — a plan with no detectable case keeps its
 *  tidied slide sections). The LLM input, TextPreview and the
 *  similarity index keep the raw text. */
/** Explicit `{ #tc-p01 }` case anchors — on unless
 *  `sweep.caseIndex.anchors` says otherwise. */
function caseAnchors(cfg) {
  return cfg?.sweep?.caseIndex?.anchors !== false;
}

/** A body the LLM lane normalized — the pre-1.3 trailing src comment
 *  or the `lrs:case` mark (Markdown_Layout_Plan phase 3). */
function isNormalized(body) {
  return /<!-- src: LLM\b/.test(body) || /<!-- lrs:case [^>]*\bdet=LLM\b/.test(body);
}

function renderBody(docText, docKind, cfg, sum) {
  const tidied = tidyBody(docText);
  // phase 5: User Story decks that follow the team template map onto
  // the story/v1 sections (storyprofile.mjs); others stay tidied
  if (docKind === "User Story" && cfg.sweep.storyProfile !== false) {
    const r = renderStoryBody(tidied);
    if (sum && r.shape === "story") sum.stories_profiled = (sum.stories_profiled || 0) + 1;
    return r.body;
  }
  const kinds = (cfg.sweep.caseIndex && cfg.sweep.caseIndex.kinds) || ["Test Plan"];
  if (!kinds.includes(docKind)) return tidied;
  const r = renderTestPlanBody(tidied, { anchors: caseAnchors(cfg) });
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

/** Write a document's media into media/<stem>/ (phase 1b), under the
 *  standardized names prettifyMedia minted (v1.59: `renames` maps the
 *  archive's basename to `fig-NN-slide-KK-<slug>.<ext>`; a file the
 *  text never linked keeps its own name). */
function writeMedia(cfg, writer, stem, mediaFiles, renames) {
  const to = new Map((renames || []).map((r) => [r.from, r.to]));
  let written = 0;
  for (const m of mediaFiles || []) {
    const fp = path.join(cfg.paths.sidecarLibrary, "media", stem, to.get(m.name) || m.name);
    // byte-identical content is not a write (a reformat regenerates the
    // drawings; in remote-files mode a write is an upload)
    try {
      if (fs.existsSync(fp) && fs.readFileSync(fp).equals(m.data)) continue;
    } catch { /* unreadable: write it */ }
    writer.writeFile(fp, m.data);
    written++;
  }
  return written;
}

/** Move a document's media already on disk into place — idempotent;
 *  nothing to do when the files are where the links point. Two
 *  legacies converge here: the pre-1b flat files
 *  (`media/doc<srcItemId>_<name>`) move into media/<stem>/, and
 *  (v1.59) files still under their archive names (`image1.png`) take
 *  the standardized names `renames` maps them to — both under
 *  --reformat (images are not re-extracted there) and --rename. Moves
 *  are per-document; a target that already exists is left alone. */
function placeLegacyMedia(cfg, writer, srcItemId, stem, renames) {
  const mdir = path.join(cfg.paths.sidecarLibrary, "media");
  const to = new Map((renames || []).map((r) => [r.from, r.to]));
  const out = { legacy: 0, renamed: 0 };
  const move = (from, dest) => {
    if (from === dest) return false;
    try {
      if (!fs.statSync(from).isFile()) return false;
      if (fs.existsSync(dest)) { writer.deleteFile(from); return false; }
      writer.writeFile(dest, fs.readFileSync(from));
      writer.deleteFile(from);
      return true;
    } catch { return false; /* unreadable: leave it */ }
  };
  let names = [];
  try { names = fs.readdirSync(mdir); } catch { return out; }
  const prefix = `doc${srcItemId}_`;
  for (const n of names) {
    if (!n.startsWith(prefix)) continue;
    const base = n.slice(prefix.length);
    if (move(path.join(mdir, n), path.join(mdir, stem, to.get(base) || base))) out.legacy++;
  }
  // an earlier standardized name for the same figure (the slug rule
  // changed — v1.60 names untitled slides by their first line) shares
  // the `fig-NN[-slide-KK]` prefix and the extension: converge it too
  let inStem = [];
  try { inStem = fs.readdirSync(path.join(mdir, stem)); } catch { /* no folder yet */ }
  for (const [from, dest] of to) {
    if (move(path.join(mdir, stem, from), path.join(mdir, stem, dest))) { out.renamed++; continue; }
    if (fs.existsSync(path.join(mdir, stem, dest))) continue;
    const m = /^(fig-\d+(?:-slide-\d+)?)(?:-.*)?(\.[a-z0-9]+)$/.exec(dest);
    if (!m) continue;
    const prior = inStem.find((n) => n !== dest && n.endsWith(m[2]) &&
      (n === `${m[1]}${m[2]}` || n.startsWith(`${m[1]}-`)));
    if (prior && move(path.join(mdir, stem, prior), path.join(mdir, stem, dest))) out.renamed++;
  }
  return out;
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
// RelatedRank's recency bonus is measured against `today`; left unset
// the script used the wall clock at call time. Pin it to the run's date
// (day precision; or sweep.relatedToday) so every related-write in a
// run and a re-run on the same day score identically, and a --rerank can
// be pinned to a date on purpose.
function relatedConfigJson(sw) {
  let cfg;
  try {
    cfg = typeof sw.relatedWeights === "string" ? JSON.parse(sw.relatedWeights) : { ...(sw.relatedWeights || {}) };
  } catch {
    return sw.relatedWeights;
  }
  if (!cfg.today) cfg.today = sw.relatedToday || new Date().toISOString().slice(0, 10);
  return JSON.stringify(cfg);
}

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
    else if (a === "--refigure") args.flags.refigure = true;
    else if (a === "--case-audit") args.flags.caseAudit = true;
    else if (a === "--layout-audit") args.flags.layoutAudit = true;
    else if (a === "--rename") args.flags.rename = true;
    else if (a === "--normalize-cases") args.flags.normalize = true;
    else if (a === "--rename-plan") { args.flags.rename = true; args.flags.dry = true; }
    else if (a === "--check-heartbeat") args.flags.checkHeartbeat = true;
    else if (a === "--progress") args.flags.progress = true;
    else if (a === "--no-progress") args.flags.noProgress = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.config) throw new Error("usage: sweep.mjs --config <config.json> [--live|--dry-run] [--max N] [--only <file>] [--rerank] [--reformat] [--recase] [--refigure] [--case-audit] [--layout-audit] [--rename|--rename-plan] [--normalize-cases] [--check-heartbeat] [--progress|--no-progress]");
  assertNodeVersion();
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  validateConfig(cfg, SWEEP_REQUIRED, args.config);
  cfg.sweep = { ...FLOW_DEFAULTS, ...(cfg.sweep || {}) };
  if (cfg.sweep.promptVersion !== FLOW_DEFAULTS.promptVersion) {
    process.stderr.write(
      `sweep: PromptVersion pinned to ${cfg.sweep.promptVersion} by config ` +
      `(prompts/docindex_classify.md is ${FLOW_DEFAULTS.promptVersion}; remove sweep.promptVersion to backfill)\n`
    );
  }
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
  if (args.flags.refigure) cfg.sweep.refigure = true;
  if (cfg.sweep.refigure && (cfg.sweep.rerank || cfg.sweep.reformat || cfg.sweep.recase)) {
    throw new Error("--refigure is a standalone mode — do not combine it with --rerank, --reformat or --recase");
  }
  if (args.flags.caseAudit) cfg.sweep.caseAudit = true;
  if (args.flags.layoutAudit) cfg.sweep.layoutAudit = true;
  if (args.flags.rename) cfg.sweep.rename = true;
  if (args.flags.normalize) cfg.sweep.normalize = true;
  if (cfg.sweep.normalize && (cfg.sweep.rerank || cfg.sweep.reformat || cfg.sweep.recase || cfg.sweep.refigure || cfg.sweep.caseAudit || cfg.sweep.rename)) {
    throw new Error("--normalize-cases is a standalone mode — do not combine it with other modes");
  }
  if (cfg.sweep.rename && (cfg.sweep.rerank || cfg.sweep.reformat || cfg.sweep.recase || cfg.sweep.refigure || cfg.sweep.caseAudit)) {
    throw new Error("--rename is a standalone mode — do not combine it with --rerank, --reformat, --recase, --refigure or --case-audit");
  }
  if (cfg.sweep.layoutAudit && (cfg.sweep.rerank || cfg.sweep.reformat || cfg.sweep.recase || cfg.sweep.refigure || cfg.sweep.caseAudit || cfg.sweep.rename || cfg.sweep.normalize)) {
    throw new Error("--layout-audit is a standalone mode — do not combine it with another mode");
  }
  if (cfg.sweep.caseAudit && (cfg.sweep.rerank || cfg.sweep.reformat || cfg.sweep.recase || cfg.sweep.refigure)) {
    throw new Error("--case-audit is a standalone mode — do not combine it with --rerank, --reformat, --recase or --refigure");
  }
  if (args.flags.checkHeartbeat) cfg.sweep.checkHeartbeat = true;
  cfg.llm = cfg.llm || {};
  cfg.graph = cfg.graph || {};
  // device-mode refresh-token caches (one per resource) live in workDir
  const authDir = path.join(cfg.paths.workDir || ".", "auth");
  cfg.graph.tokenCache = cfg.graph.tokenCache || path.join(authDir, "graph.json");
  // SPO REST (hyperlink-column writes) inherits the Graph auth settings
  // (device mode: same tenant/sign-in, the Graph CLI public client, its
  // first token seeded from the Graph sign-in's cache — no extra prompt;
  // app mode: same registration/secret) (SpoClient)
  const inherit = { ...cfg.graph };
  const inheritMode = inherit.auth || (inherit.clientSecret !== undefined ? "app" : "device");
  if (inheritMode === "device" || inheritMode === "interactive") delete inherit.clientId;
  delete inherit.baseUrl; // Graph-only
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
  cfg.sharePoint.syncedSubfolder = cfg.sharePoint.syncedSubfolder || "";
  // progress narration (lib/progress.mjs): a console gets it by
  // default, a scheduled task opts in with --progress / config.progress
  cfg._progress = resolveProgress(cfg.progress, {
    on: args.flags.progress, off: args.flags.noProgress,
  });
  // a narrated run narrates its model calls too (llm.mjs → LRSDOC_PROGRESS)
  cfg.llm.progress = cfg._progress;
  return cfg;
}

// ---- write layer (real vs dry-run plan) -----------------------------

// Graph cannot write hyperlink columns (400 invalidRequest in every
// shape) — these fields route through SPO ValidateUpdateListItem
// (FigureLink: the Test Cases primary-figure link, caseindex v1.4;
// ImageLink: the Figures list's clickable picture, figureindex v1.0).
const HYPERLINK_FIELDS = new Set(["SourceLink", "TextFileUrl", "FigureLink", "ImageLink"]);

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
      try {
        await this.spo.validateUpdate(this.lists[listKey], Number(res.id), links);
      } catch (e) {
        // The row EXISTS at this point (the Graph create succeeded); only
        // its hyperlink columns are missing. Carry the id on the error so
        // the caller can register the row and retry the links next run
        // instead of creating a second row with the same key.
        e.rowId = Number(res.id);
        e.listKey = listKey;
        e.message = `hyperlink write after create (row ${res.id}): ${e.message}`;
        throw e;
      }
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

// ---- sidecar header (format 3.1 — Sidecar_Format_Plan phase 1,
// Markdown_Layout_Plan phase 4) ---------------------------------------
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

  // the run's narrator (lib/progress.mjs) — stderr only, off unless a
  // person is watching or --progress / config.progress asks for it
  const prog = createProgress({ enabled: cfg._progress });
  const modeName =
    sw.rerank ? "--rerank" : sw.reformat ? "--reformat" : sw.recase ? "--recase" :
    sw.refigure ? "--refigure" : sw.caseAudit ? "--case-audit" :
    sw.layoutAudit ? "--layout-audit" : sw.rename ? "--rename" :
    sw.normalize ? "--normalize-cases" : "nightly index";
  prog(
    `sweep ${modeName} — ${dry ? "DRY RUN (no writes)" : "LIVE"}, ` +
    `cap ${sw.maxDocsPerRun} doc(s)/run, PromptVersion ${sw.promptVersion}` +
    (sw.smokeFile ? `, only "${sw.smokeFile}"` : "")
  );

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "docindex-sweep-"));
  const loadPhase = prog.phase("extractors");
  const mains = await loadScripts(
    cfg.scriptsDir || DEFAULT_SCRIPTS_DIR,
    ["ziptext", "media", "shapes", "regex", "workbookdump", "related", "sidecarpatch"],
    tmpDir
  );
  loadPhase.done(`${Object.keys(mains).length} loaded from ${cfg.scriptsDir || DEFAULT_SCRIPTS_DIR}`);
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
  prog(
    `tools — pdftotext ${pdfTool ? "found" : "MISSING (PDFs skip)"}, ` +
    `OCR ${ocrTools && ocrTools.ppm ? "found" : "not configured"}`
  );

  const graph = new GraphClient(cfg.graph);
  const spo = new SpoClient(cfg.spo);
  const bodyIndex = new BodyIndex();
  const docLinks = loadDocLinks(sw);
  // the official vocabulary (pipeline/data/lrs_vocabulary.json, written
  // by doc_vocab.mjs from the Esri documentation): the classifier's
  // KnownTools block, the casing every returned tool is normalized to,
  // and a direct documentation link per tool — ahead of probing
  const vocab = loadVocabulary(sw.vocabularyFile || VOCABULARY_FILE);
  for (const t of [...vocab.tools, ...vocab.widgets]) {
    if (t.url && !Object.keys(docLinks.tools).some((k) => k.toLowerCase() === String(t.name).toLowerCase())) {
      docLinks.tools[t.name] = t.url;
    }
  }
  if (vocab.tools.length) {
    prog(`vocabulary — ${vocab.tools.length} official tool(s), ${vocab.widgets.length} widget(s), ${vocab.terms.length} term(s) from ${path.basename(vocab.file)}`);
  } else {
    process.stderr.write(`sweep: no official vocabulary at ${vocab.file} — tool names pass through unnormalized (run pipeline/doc_vocab.mjs)\n`);
  }
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
  const signIn = prog.phase("sign-in + site lookup");
  const stopSignIn = prog.heartbeat("waiting on Microsoft Graph sign-in");
  let siteId, srcSiteId;
  try {
    siteId = await graph.siteId(sp.hostname, sp.sitePath);
    srcSiteId = await graph.siteId(sp.hostname, sp.sourceSitePath);
  } finally {
    stopSignIn();
  }
  signIn.done(`${sp.sitePath} + ${sp.sourceSitePath}`);

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
    const mirror = prog.phase("remote mirror");
    await remote.init();
    const stopMirror = prog.heartbeat("mirroring the sidecar library");
    let m;
    try {
      m = await remote.mirrorMarkdown();
    } finally {
      stopMirror();
    }
    mirror.done(`${m.files} sidecar file(s), ${m.downloaded} downloaded`);
    process.stderr.write(`remote mirror: ${m.files} sidecar file(s), ${m.downloaded} downloaded\n`);
  }
  const writer = new Writer(graph, siteId, sp.lists, dry, spo, remote);

  // ---- run-start snapshots (replaces per-doc Check_* queries) ----
  // Raw items are kept alongside the normalized rows so every run can
  // export a restorable list backup (v1.32) at zero extra fetch cost.
  const rawSnapshots = {};
  const snapshots = prog.phase("list snapshots");
  const fetch = async (listKey, kind, select) => {
    const stop = prog.heartbeat(`fetching the ${listKey} list`);
    let items;
    try {
      items = await graph.listItems(siteId, sp.lists[listKey], { select });
    } finally {
      stop();
    }
    snapshots.step(`${listKey} — ${items.length} row(s)`);
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
  snapshots.done(
    `${docIndexRows.length} documents, ${keywordRows.length} keywords, ` +
    `${docIdRows.length} ids, ${docLinkRows.length} links, ${docKwRows.length} junctions`
  );

  // ---- test-case index (Case_Index_Plan phase 2) -----------------
  // Individual test cases as Test Cases list rows, one replace-set
  // per document. Enabled by the list GUID alone; without it the
  // sweep says so once and indexes documents normally — case rows
  // are derived state and never gate a document.
  const ciKinds = (cfg.sweep.caseIndex && cfg.sweep.caseIndex.kinds) || ["Test Plan"];
  const ciEnabled = !!sp.lists.testCases;
  const caseRowsByDoc = new Map(); // docRowId -> [{id, fields}]
  const missingCaseColumns = new Set(); // v1.56: columns the tenant list lacks (noted once per run)
  if (ciEnabled) {
    const stopCases = prog.heartbeat("fetching the Test Cases list");
    const items = await graph.listItems(siteId, sp.lists.testCases, {
      select: ["Title", "DocumentLookupId", "CaseKey", "CaseNo", "SlideNo",
               "Classification", "Scenario", "CaseText", "IssueRefs", "Anchor",
               "Shape", "Confidence", "Group", "SourceRef",
               "FigureCount", "TableCount", "StepCount", "RouteRefs",
               "ExpectedResult", "TraceText", "Tools", "Keywords", "FigureLinks",
               "FigureLink", "SweptOn"],
    });
    stopCases();
    rawSnapshots.testCases = items; // rides the per-run list backup
    prog(`Test Cases snapshot — ${items.length} case row(s)`);
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
      "list per docs/setup.md §12 / schemas/SPList_TestCases.csv and add its GUID"
    );
  } else {
    process.stderr.write(
      "note: sharePoint.lists.testCases is not configured — individual test " +
      "cases are not indexed (docs/setup.md §12: create the Test Cases list, " +
      "paste its GUID, then backfill with --recase)\n"
    );
  }
  // ---- figure index (Figure_Index_Plan; sweep v1.59) -------------
  // Every document's figures (pasted pictures + collapsed diagram
  // labels) as Figures list rows, one replace-set per document — the
  // Test Cases pattern: enabled by the list GUID alone, derived state,
  // never gates a document.
  const fiKinds = (cfg.sweep.figureIndex && cfg.sweep.figureIndex.kinds) || [];
  const fiEnabled = !!sp.lists.figures;
  const figureRowsByDoc = new Map(); // docRowId -> [{id, fields}]
  const missingFigureColumns = new Set();
  if (fiEnabled) {
    const stopFigs = prog.heartbeat("fetching the Figures list");
    const items = await graph.listItems(siteId, sp.lists.figures, {
      select: ["Title", "DocumentLookupId", "FigureKey", "FigureNo", "Kind",
               "FileName", "Format", "SlideNo", "Section", "CaseNo", "Anchor",
               "Caption", "Context", "Width", "Height", "Bytes", "Tools",
               "Keywords", "ImageUrl", "ImageLink", "SweptOn"],
    });
    stopFigs();
    rawSnapshots.figures = items; // rides the per-run list backup
    prog(`Figures snapshot — ${items.length} figure row(s)`);
    for (const it of items) {
      const f = it.fields || {};
      const docId = num(f.DocumentLookupId) ?? num(f.DocumentId);
      if (docId === undefined) continue;
      if (!figureRowsByDoc.has(docId)) figureRowsByDoc.set(docId, []);
      figureRowsByDoc.get(docId).push({ id: String(it.id), fields: f });
    }
  } else if (sw.refigure) {
    throw new Error(
      "--refigure needs sharePoint.lists.figures — create the Figures " +
      "list per docs/setup.md §14 / schemas/SPList_Figures.csv and add its GUID"
    );
  } else {
    process.stderr.write(
      "note: sharePoint.lists.figures is not configured — figures are not " +
      "indexed (docs/setup.md §14: create the Figures list, paste its GUID, " +
      "then backfill with --refigure)\n"
    );
  }
  // Case-tag vocabulary (caseindex v1.2): the run-start Keywords
  // snapshot compiled once — alias rows match under their own title
  // but report their CANONICAL's name and kind. Deliberately not
  // updated mid-run (the Get_kw_meta / kwSnapshot precedent, flow
  // §5.7 accepted degradation): keywords minted THIS run reach case
  // tags on the doc's next reindex or the next --recase. The figure
  // index tags its rows from the same vocabulary.
  let ciVocab = null;
  if (ciEnabled || fiEnabled) {
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
  // fail-soft on a column a tenant list does not have yet (v1.56):
  // Graph answers 400 "Field 'X' is not recognized" — drop X, retry,
  // count it, and say once per run which columns to add. The row is
  // written with the columns that exist; the next backfill after the
  // columns are added fills them in (the replace-set sees the
  // difference). Shared by the case and figure syncs (v1.59).
  // Two error shapes: Graph's `Field 'X' is not recognized` (a plain
  // column) and the SharePoint REST route's per-field `SPO field write
  // failed: X: ...` (a hyperlink column). When the hyperlink write fails
  // AFTER the Graph create succeeded, the row already exists (the error
  // carries its id, Writer.createRow) — the retry must PATCH that row,
  // never create it again.
  const columnDropper = ({ listLabel, rowsLabel, schemaHint, backfillFlag, counter, missing }) =>
    async (fields, write, sum, patchWrite) => {
      let f = { ...fields };
      let created = null;
      for (let attempt = 0; attempt < 8; attempt++) {
        try {
          const result = await write(f);
          return { result: created ? { ...(result || {}), id: created } : result, fields: f };
        } catch (e) {
          if (e.rowId && patchWrite && !created) {
            created = e.rowId;
            write = (x) => patchWrite(created, x);
          }
          const m = /Field '([^']+)' is not recognized/.exec(String(e.message))
            || /SPO field write failed: ([A-Za-z0-9_]+):/.exec(String(e.message));
          if (!m || !(m[1] in f)) throw e;
          delete f[m[1]];
          sum[counter] = (sum[counter] || 0) + 1;
          if (!missing.has(m[1])) {
            missing.add(m[1]);
            process.stderr.write(
              `note: ${listLabel} list has no '${m[1]}' column — ${rowsLabel} are written without it. ` +
              `Add it per ${schemaHint}, then run ${backfillFlag} --live once.\n`
            );
          }
        }
      }
      throw new Error(`${rowsLabel.replace(/s$/, "")} write kept failing on unrecognized fields`);
    };
  // an update patches ONLY the fields that differ (plus SweptOn) — an
  // unchanged hyperlink column never costs an SPO call (v1.62)
  const changedOnly = (u) => {
    if (!u.changed) return u.fields;
    const out = {};
    for (const k of u.changed) out[k] = u.fields[k];
    if ("SweptOn" in u.fields) out.SweptOn = u.fields.SweptOn;
    return out;
  };
  const caseColumns = columnDropper({
    listLabel: "Test Cases", rowsLabel: "case rows",
    schemaHint: "schemas/SPList_TestCases.csv (Confidence, Group, SourceRef; Shape choices S1–S6/LLM/draft/deck)",
    backfillFlag: "--recase", counter: "case_fields_dropped", missing: missingCaseColumns,
  });
  const figureColumns = columnDropper({
    listLabel: "Figures", rowsLabel: "figure rows",
    schemaHint: "schemas/SPList_Figures.csv",
    backfillFlag: "--refigure", counter: "figure_fields_dropped", missing: missingFigureColumns,
  });
  // v1.66: the Doc Index row gains `Surfaces` (every surface the
  // document covers, "; "-joined like Products); a tenant that has not
  // added the column yet keeps indexing without it
  const missingDocIndexColumns = new Set();
  const docIndexColumns = columnDropper({
    listLabel: "Doc Index", rowsLabel: "document rows",
    schemaHint: "schemas/SPList_DocIndex.csv (Surfaces; the REST choice on Surface)",
    backfillFlag: "the nightly sweep (a PromptVersion bump re-stamps every row)", counter: "doc_fields_dropped", missing: missingDocIndexColumns,
  });

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
        const { result: created, fields: wrote } = await caseColumns(
          f, (x) => writer.createRow("testCases", x), sum, (id, x) => writer.patchRow("testCases", id, x));
        next.push({ id: String(created.id), fields: wrote });
      }
      for (const u of plan.update) {
        const { fields: wrote } = await caseColumns(changedOnly(u), (x) => writer.patchRow("testCases", u.id, x), sum);
        const row = next.find((r) => r.id === u.id);
        if (row) row.fields = { ...row.fields, ...wrote };
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

  // Replace one document's figure-row set with what its body carries
  // now (figureindex.mjs — image links + collapsed diagram labels).
  // Same contract as syncCases: an empty/off-kind fresh side deletes
  // the document's rows; never throws; `stem` locates the media folder
  // for pixel sizes (a file not on disk sizes to nothing).
  const syncFigures = async (rowId, docKind, bodyText, sum, docTitle) => {
    if (!fiEnabled || !rowId) return;
    try {
      let fresh = [];
      if (bodyText && (!fiKinds.length || fiKinds.includes(docKind))) {
        const mdir = path.join(cfg.paths.sidecarLibrary, "media");
        const sizeOf = (rel) => {
          try {
            const fp = path.join(mdir, ...String(rel).split("/"));
            const st = fs.statSync(fp);
            if (!st.isFile()) return null;
            const fd = fs.openSync(fp, "r");
            const head = Buffer.alloc(Math.min(st.size, 65536));
            try { fs.readSync(fd, head, 0, head.length, 0); } finally { fs.closeSync(fd); }
            return { ...(imageSize(head) || {}), bytes: st.size };
          } catch { return null; }
        };
        const parsed = extractFigures(bodyText, {
          mediaUrlBase: `${sw.siteUrl}${sw.textsFolder}/media`,
          contextCap: cfg.sweep.figureIndex && cfg.sweep.figureIndex.contextCap,
          vocab: ciVocab, docTitle: docTitle || "", sizeOf,
        });
        const now = new Date().toISOString();
        fresh = parsed.figures.map((f) => toFigureRowFields(rowId, f, now));
      }
      const existing = figureRowsByDoc.get(rowId) || [];
      if (!fresh.length && !existing.length) return;
      const plan = diffFigureRows(existing, fresh);
      const next = existing.filter((r) => !plan.delete.includes(r.id));
      for (const f of plan.create) {
        const { result: created, fields: wrote } = await figureColumns(
          f, (x) => writer.createRow("figures", x), sum, (id, x) => writer.patchRow("figures", id, x));
        next.push({ id: String(created.id), fields: wrote });
      }
      for (const u of plan.update) {
        const { fields: wrote } = await figureColumns(changedOnly(u), (x) => writer.patchRow("figures", u.id, x), sum);
        const row = next.find((r) => r.id === u.id);
        if (row) row.fields = { ...row.fields, ...wrote };
      }
      for (const id of plan.delete) await writer.deleteRow("figures", id);
      figureRowsByDoc.set(rowId, next);
      sum.figures_upserted = (sum.figures_upserted || 0) + plan.create.length + plan.update.length;
      sum.figures_removed = (sum.figures_removed || 0) + plan.delete.length;
    } catch (e) {
      sum.figure_errors = (sum.figure_errors || 0) + 1;
      process.stderr.write(`FIGURE-INDEX ERROR doc ${rowId}: ${e.message}\n`);
    }
  };
  // the figure catalog page + its remote put, for every live mode that
  // converges figure rows (full sweep, --refigure, --rename, normalize)
  const flushFigureCatalog = async () => {
    if (!fiEnabled) return;
    writeFigureCatalog(cfg, docIndexRows, figureRowsByDoc);
    if (remote) {
      const pg = path.join(cfg.paths.sidecarLibrary, "_Figure Catalog.md");
      if (fs.existsSync(pg)) remote.queuePut(pg);
      await remote.flush().catch((e) => process.stderr.write(`remote flush of figure catalog: ${e.message}\n`));
    }
  };

  const listBackup = exportListSnapshots(cfg, rawSnapshots);
  if (listBackup) prog(`list backup — ${path.basename(listBackup)}`);

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
    const zsum = { mode: "normalize-cases", dry_run: dry, prompt_version: NORMALIZE_PROMPT_VERSION,
                   eligible: 0, candidates: 0, normalized: 0, refused: 0, errors: 0, skipped_cap: 0, skipped_large: 0,
                   cases_upserted: 0, cases_removed: 0, case_errors: 0, plans_caseless: 0, cases_shape_mixed: 0 };
    if (!dry && !nc.enabled) {
      throw new Error(
        "--normalize-cases --live requires sweep.normalizeCases.enabled: true in config — " +
        "the owner switch for AI spend on sidecar bodies (dry runs list the candidates without it)"
      );
    }
    const zPhase = prog.phase("normalize-cases");
    zPhase.step(`scanning ${docIndexRows.length} Doc Index row(s) for caseless plans`);
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
      if (isNormalized(body)) continue;                       // already normalized
      if (extractCases(body).shape !== "none") continue;         // the detectors cover it
      if (!hasSignal(auditBody(body))) continue;                 // genuinely caseless
      if (body.length > Number(nc.maxInputChars)) {
        zsum.skipped_large++;
        process.stderr.write(`NORMALIZE SKIP doc ${r.ID} (${r.Title || r.FileName}): body ${body.length} chars > normalizeCases.maxInputChars ${nc.maxInputChars}\n`);
        continue;
      }
      zsum.candidates++;
      plans.push({ r, local, content, seam, body });
    }
    zPhase.step(
      `${zsum.candidates} candidate(s) of ${zsum.eligible} eligible plan(s), ` +
      `cap ${nc.maxPerRun}/run${dry ? " — dry run, no model call" : ""}`
    );
    const results = [];
    const zTick = prog.counter(plans.length, "candidate plans");
    for (const p of plans) {
      if (zsum.normalized + zsum.refused + zsum.errors >= Number(nc.maxPerRun)) { zsum.skipped_cap++; continue; }
      const entry = { id: p.r.ID, title: p.r.Title || p.r.FileName, ok: false, failures: [], cases: 0 };
      results.push(entry);
      zTick(entry.title, `doc ${p.r.ID}, ${p.body.length} chars`);
      if (dry) { entry.failures = ["dry run: not called"]; continue; }
      try {
        const inputs = { PlanTitle: p.r.Title || p.r.FileName || "", Body: p.body };
        const genT0 = Date.now();
        const stopGen = prog.heartbeat(`waiting on the model for doc ${p.r.ID}`);
        let raw;
        try {
          raw = await generate(cfg.llm, "case_normalize", inputs, { maxTokens: Number(nc.maxTokens) });
        } finally {
          stopGen();
        }
        prog(`doc ${p.r.ID} — model replied, ${raw.length} chars in ${secs(Date.now() - genT0)}`);
        // the model writes the pre-1.3 heading form (its prompt asks
        // for `<!-- src: LLM · … -->`), so the reply is VERIFIED in
        // that shape and canonicalized only once it is accepted — an
        // LLM-normalized plan then carries the same case block as
        // every deterministic one (Markdown_Layout_Plan phase 3)
        const reply = unwrapReply(raw);
        const v = verifyNormalized(p.body, reply);
        const out = canonicalizeCaseBlocks(reply, { anchors: caseAnchors(cfg) });
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
        await syncFigures(p.r.ID, p.r.DocKind, out, zsum, p.r.Title || "");
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
    if (!dry && zsum.normalized) await flushFigureCatalog();
    zPhase.done(
      `${zsum.normalized} normalized, ${zsum.refused} refused, ${zsum.errors} error(s), ` +
      `${zsum.skipped_cap} left for the next run`
    );
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
    const nPhase = prog.phase("rename");
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
    nPhase.step(`${entries.length} indexed sidecar(s) in ${byFolder.size} kind folder(s) — minting stems`);
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
    nPhase.step(`${fileMap.size} stem(s) change — rewriting bodies, media folders and links`);
    const nTick = prog.counter(entries.length, "sidecars");
    for (const e of entries) {
      if (!e.content) continue;
      nTick(`${e.folder}/${e.oldStem}.md`, e.newStem === e.oldStem ? "stem unchanged" : `-> ${e.newStem}.md`);
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
        // every renamed neighbour referenced from this file — matched as a
        // WHOLE file name (preceded by a path/link delimiter, not followed
        // by a name character): a stem that is the suffix of another stem
        // must never rewrite the longer name's links
        for (const [from, to] of fileMap) {
          const re = new RegExp(`(^|[/<("'\\s])${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9._-])`, "g");
          if (next.search(re) >= 0) { next = next.replace(re, (m, pre) => pre + to); nsum.links_rewritten++; }
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
        prog.fail(e.oldStem, err.message);
        process.stderr.write(`RENAME ERROR ${e.oldStem}: ${err.message}\n`);
      }
    }
    nPhase.done(
      `${nsum.renamed} renamed, ${nsum.unchanged} unchanged, ` +
      `${nsum.media_moved} media file(s) moved, ${nsum.links_rewritten} link rewrite(s), ` +
      `${nsum.errors} error(s)`
    );
    if (!dry) {
      prog("browse pages — _Index.md, _Manifest.json, catalogs");
      writeIndexPages(cfg, docIndexRows, sw.kindFolders);
      writeManifest(cfg, docIndexRows, issueByDoc(docIndexRows, docIdRows));
      if (ciEnabled) writeCaseCatalog(cfg, docIndexRows, caseRowsByDoc);
      if (fiEnabled) writeFigureCatalog(cfg, docIndexRows, figureRowsByDoc);
      if (remote) {
        for (const pg of ["_Index.md", "_Manifest.json", "_Case Catalog.md", "_Figure Catalog.md"]) {
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
    else if (nsum.renamed) process.stdout.write(`renamed ${nsum.renamed} sidecar(s); run --recase --live and --refigure --live next so Test Cases anchors, figure links and Figures image URLs follow\n`);
    return;
  }

  // ---- --layout-audit: which sidecars still carry a shape an earlier
  // phase replaced (Markdown_Layout_Plan phase 6). Every phase left
  // the readers able to understand the shape they replaced, so no
  // consumer had to wait for a backfill; this is how anyone tells when
  // that tolerance can come out. Reads the sidecars on disk, writes
  // `_Layout Audit.md` on a live run. No list writes, no extraction,
  // no AI calls.
  if (sw.layoutAudit) {
    const lPhase = prog.phase("layout audit");
    const entries = [];
    let noSidecar = 0;
    const indexed = docIndexRows.filter((r) => r.ID && r.IndexStatus === "Indexed" && r.TextFileUrl);
    const lTick = prog.counter(indexed.length, "sidecars");
    for (const r of indexed) {
      if (sw.smokeFile && lower(String(r.FileName || "").trim()) !== lower(sw.smokeFile.trim())) continue;
      const local = urlToLocal(String(r.TextFileUrl), sw, cfg);
      if (!local || !fs.existsSync(local)) { noSidecar++; continue; }
      const content = fs.readFileSync(local, "utf8");
      const parts = String(r.TextFileUrl).split("/");
      const file = decodeURIComponent(parts[parts.length - 1] || "");
      const folder = decodeURIComponent(parts[parts.length - 2] || "");
      const a = auditLayout(content, { kind: r.DocKind || "" });
      entries.push({
        id: r.ID, title: r.Title || r.FileName || `doc ${r.ID}`,
        target: folder ? `${folder}/${file}` : file, ...a,
      });
      lTick(r.Title || r.FileName || `doc ${r.ID}`, a.legacy ? `format ${a.format}, legacy` : `format ${a.format}`);
    }
    const lsum = { mode: "layout-audit", dry_run: dry, no_sidecar: noSidecar, ...summarizeLayout(entries) };
    lPhase.done(
      `${entries.length} sidecar(s) audited, ${lsum.converged} carrying no legacy shape, ` +
      `${noSidecar} without a sidecar on disk`
    );
    if (!dry && cfg.sweep.indexPages !== false) {
      const pg = path.join(cfg.paths.sidecarLibrary, "_Layout Audit.md");
      fs.writeFileSync(pg, renderLayoutPage(entries, new Date().toISOString()));
      if (remote) {
        remote.queuePut(pg);
        await remote.flush().catch((e) =>
          process.stderr.write(`remote flush of layout audit: ${e.message}\n`));
      }
    }
    const lDir = cfg.paths.workDir || tmpDir;
    fs.mkdirSync(lDir, { recursive: true });
    const lStamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
    const lLog = path.join(lDir, `sweep-${lStamp}.json`);
    fs.writeFileSync(lLog, JSON.stringify({ summary: lsum, sidecars: entries }, null, 1));
    pruneRunLogs(lDir);
    process.stdout.write(JSON.stringify({ ...lsum, logFile: lLog }) + "\n");
    process.stdout.write(
      lsum.retirable.length
        ? `retirable now: ${lsum.retirable.join(", ")} — no sidecar carries these, their readers can be deleted\n`
        : "retirable now: none — every legacy shape is still in the corpus; run --reformat --live to converge it\n"
    );
    return;
  }

  // ---- --case-audit: which plans the case index covers, and what the
  // uncovered ones contain (Sidecar_Format_Plan phase 0). Reads the
  // sidecars on disk, runs the SAME parser --recase runs plus the
  // latent-shape signals in caseaudit.mjs, and writes `_Case Audit.md`
  // next to the catalog on a live run. No list writes, no extraction,
  // no AI calls; the Test Cases GUID is not required.
  if (sw.caseAudit) {
    const aPhase = prog.phase("case audit");
    const entries = [];
    let noSidecar = 0, noSeam = 0;
    const aTick = prog.counter(docIndexRows.filter((r) => r.ID && ciKinds.includes(r.DocKind)).length, "case-indexed kinds");
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
      aTick(r.Title || r.FileName || `doc ${r.ID}`, `shape ${parsed.shape}, ${parsed.cases.length} case(s)`);
    }
    const asum = { mode: "case-audit", dry_run: dry, no_sidecar: noSidecar, no_seam: noSeam,
                   ...summarizeAudit(entries) };
    aPhase.done(
      `${entries.length} plan(s) audited, ${asum.covered ?? 0} covered, ` +
      `${noSidecar} without a sidecar, ${noSeam} without a metadata seam`
    );
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

  // ---- --refigure: rebuild the Figures list from the sidecars on
  // disk (Figure_Index_Plan — the backfill; the --recase mold). No
  // extraction, no AI calls, no sidecar writes: every Indexed document
  // with a sidecar re-parses its body below the seam and replace-sets
  // its figure rows. Run once after creating the list, after --rename
  // (media URLs move with the stem), and after any figureindex.mjs
  // parser bump; the nightly sweep keeps it converged.
  if (sw.refigure) {
    const fsum = {
      mode: "refigure", dry_run: dry, eligible: 0, synced: 0,
      no_sidecar: 0, no_seam: 0, figures_upserted: 0, figures_removed: 0,
      figure_errors: 0,
    };
    const fPhase = prog.phase("refigure");
    const cap = sw._maxSet ? Number(sw.maxDocsPerRun) : Infinity;
    const fTick = prog.counter(
      docIndexRows.filter((r) => r.ID && (!fiKinds.length || fiKinds.includes(r.DocKind)) &&
        r.IndexStatus === "Indexed" && r.TextFileUrl).length,
      "documents with a sidecar"
    );
    const done = new Set();
    for (const r of docIndexRows) {
      if (!r.ID || (fiKinds.length && !fiKinds.includes(r.DocKind))) continue;
      if (r.IndexStatus !== "Indexed" || !r.TextFileUrl) continue;
      if (sw.smokeFile && lower(String(r.FileName || "").trim()) !== lower(sw.smokeFile.trim())) continue;
      fsum.eligible++;
      if (fsum.synced >= cap) continue;
      const local = urlToLocal(String(r.TextFileUrl), sw, cfg);
      if (!local || !fs.existsSync(local)) {
        fsum.no_sidecar++;
        continue;
      }
      const content = fs.readFileSync(local, "utf8");
      const seam = bodySeamEnd(content);
      if (seam < 0) {
        fsum.no_seam++;
        continue;
      }
      const before = fsum.figures_upserted + fsum.figures_removed;
      await syncFigures(r.ID, r.DocKind, content.slice(seam), fsum, r.Title || "");
      done.add(r.ID);
      fsum.synced++;
      fTick(r.Title || r.FileName || `doc ${r.ID}`,
        `${fsum.figures_upserted + fsum.figures_removed - before} figure row write(s)`);
    }
    if (!sw.smokeFile) {
      fPhase.step("sweeping figure rows whose document no longer qualifies");
      const byId = new Map(docIndexRows.map((r) => [r.ID, r]));
      for (const docId of [...figureRowsByDoc.keys()]) {
        if (done.has(docId)) continue;
        const row = byId.get(docId);
        if (row && row.IndexStatus === "Indexed" && row.TextFileUrl &&
            (!fiKinds.length || fiKinds.includes(row.DocKind))) continue;
        await syncFigures(docId, "", "", fsum);
      }
    }
    if (!dry) await flushFigureCatalog();
    fPhase.done(
      `${fsum.synced} of ${fsum.eligible} document(s) synced — ${fsum.figures_upserted} row(s) upserted, ` +
      `${fsum.figures_removed} removed, ${fsum.figure_errors} error(s)`
    );
    fsum.spo_throttled = (writer.spo && writer.spo.throttled) || 0;
    const fDir = cfg.paths.workDir || tmpDir;
    fs.mkdirSync(fDir, { recursive: true });
    const fStamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
    const fLog = path.join(fDir, `sweep-${fStamp}.json`);
    fs.writeFileSync(fLog, JSON.stringify({ summary: fsum, plan: dry ? writer.plan : undefined }, null, 1));
    pruneRunLogs(fDir);
    process.stdout.write(JSON.stringify({ ...fsum, logFile: fLog }) + "\n");
    if (dry) {
      process.stdout.write(`dry run: ${writer.plan.length} planned writes recorded in ${fLog}\n`);
    }
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
    const cPhase = prog.phase("recase");
    const cap = sw._maxSet ? Number(sw.maxDocsPerRun) : Infinity;
    const cTick = prog.counter(
      docIndexRows.filter((r) => r.ID && ciKinds.includes(r.DocKind) &&
        r.IndexStatus === "Indexed" && r.TextFileUrl).length,
      `documents of kind ${ciKinds.join(" / ")}`
    );
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
      const before = csum.cases_upserted + csum.cases_removed;
      await syncCases(r.ID, r.DocKind, content.slice(seam), csum, r.Title || "");
      done.add(r.ID);
      csum.synced++;
      cTick(r.Title || r.FileName || `doc ${r.ID}`,
        `${csum.cases_upserted + csum.cases_removed - before} case row write(s)`);
    }
    // rows whose document is gone, Archived, reclassified, or no
    // longer Indexed delete here (the replace-set with an empty fresh
    // side); rows for eligible docs the cap or a missing sidecar
    // deferred are left alone. Smoke runs stay surgical: no cleanup.
    if (!sw.smokeFile) {
      cPhase.step("sweeping case rows whose document no longer qualifies");
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
    cPhase.done(
      `${csum.synced} of ${csum.eligible} document(s) synced — ${csum.cases_upserted} row(s) upserted, ` +
      `${csum.cases_removed} removed, ${csum.plans_caseless} caseless plan(s), ${csum.case_errors} error(s)`
    );
    csum.spo_throttled = (writer.spo && writer.spo.throttled) || 0;
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
    const rPhase = prog.phase("rerank");
    const rTick = prog.counter(
      docIndexRows.filter((r) => r.IndexStatus === "Indexed" && r.TextFileUrl).length,
      "indexed documents"
    );
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
      rTick(r.FileName || r.Title || `doc ${r.ID}`, "docs block + related ranking");
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
          cfg, sw, op, writer, summary: rsum, bodyIndex, caches, kwSnapshot,
          setStep: () => {},
          progress: prog,
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
        prog.fail(r.FileName || `doc ${r.ID}`, e.message);
        process.stderr.write(`RERANK ERROR ${r.FileName}: ${e.message}\n`);
      }
    }
    rsum.related_flags = rsum.related_flags.trim();
    rPhase.done(
      `${rsum.reranked} of ${rsum.eligible} document(s) reranked — ` +
      `${rsum.no_sidecar} without a sidecar, ${rsum.errors} error(s)`
    );
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
  const selPhase = prog.phase("source library");
  const stopSel = prog.heartbeat("listing the source library");
  let files;
  try {
    files = await graph.listItems(srcSiteId, sp.lists.sourceLibrary, {
      select: ["FileLeafRef", "FileRef", "Modified", "File_x0020_Size", "FSObjType"],
    });
  } finally {
    stopSel();
  }
  selPhase.done(`${files.length} item(s) listed, newest first`);
  files.sort((a, b) =>
    String(b.fields?.Modified || b.lastModifiedDateTime || "").localeCompare(
      String(a.fields?.Modified || a.lastModifiedDateTime || "")
    )
  );

  const rfsum = {
    mode: "reformat", dry_run: dry, eligible: 0, rewritten: 0,
    unchanged: 0, no_sidecar: 0, no_seam: 0, no_text: 0, errors: 0,
    cases_upserted: 0, cases_removed: 0, case_errors: 0,
    plans_caseless: 0, cases_shape_mixed: 0,
    figures_upserted: 0, figures_removed: 0, figure_errors: 0, media_renamed: 0,
    drawings: 0, drawings_written: 0,
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
    graph_downloads: 0,
    unreadable_local: 0,
    tools_unknown: 0,
    // v1.66: what the deterministic signals changed after the model
    kind_from_folder: 0,
    surface_from_signals: 0,
    tools_from_text: 0,
    products_from_model: 0,
    doc_fields_dropped: 0,
    cases_upserted: 0,
    cases_removed: 0,
    case_errors: 0,
    plans_caseless: 0,
    cases_shape_mixed: 0,
    figures_upserted: 0,
    figures_removed: 0,
    figure_errors: 0,
    drawings: 0,
    list_backup: listBackup ? path.basename(listBackup) : "",
  };

  const indexPhase = prog.phase(sw.reformat ? "reformat" : "index");
  indexPhase.step(
    sw.reformat
      ? "re-rendering sidecar bodies from the source (no model call)"
      : `selecting stale documents (cap ${sw.maxDocsPerRun}) — new, edited, ` +
        `re-stamped, or in the Error / rescue lanes`
  );
  const docTick = prog.counter(Number(sw.maxDocsPerRun) || 0, "", { every: 1 });
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
    let existing = byDocKey.get(docKey);
    if (existing) summary.dockey_hits++;
    else summary.dockey_misses++;

    const ext = lower(name.split(".").pop());
    const fileTypeSafe = KNOWN_EXT.includes(ext) ? ext : IMAGE_EXT.includes(ext) ? "image" : "other";

    // local path in the synced library; a doc outside the synced
    // root segment is structurally unreachable (out-of-scope lane)
    const inScope = siteRel.startsWith(sp.libraryRootSegment + "/");
    const libRel = inScope ? siteRel.slice(sp.libraryRootSegment.length + 1) : siteRel;
    // sharePoint.syncedSubfolder (v1.55): the OneDrive sync often roots
    // at a library CHILD (a Teams channel folder such as "General"),
    // so paths.sourceLibrary IS that child — strip it from the local
    // path; documents outside it still resolve to a path that is not
    // on disk and take the Graph download fallback as before
    const synced = String(sp.syncedSubfolder || "").replace(/^\/+|\/+$/g, "");
    const localRel = synced && (libRel === synced || libRel.startsWith(synced + "/"))
      ? libRel.slice(synced.length + 1) : libRel;
    const localPath = path.join(cfg.paths.sourceLibrary, ...localRel.split("/"));
    const sourceLink = item.webUrl || "";
    // v1.66: the library folder the file sits in (under the root
    // segment) — the classifier reads it, and lib/docsignals.mjs maps a
    // "Doc Reviews" folder to its kind
    const folder = libraryFolderOf(libRel);

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
      prog(`[${rfsum.rewritten + rfsum.unchanged + 1}] reformat ${name} — doc ${existing.ID}`);
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
        if (isNormalized(cur.slice(seam))) {
          rfsum.llm_kept = (rfsum.llm_kept || 0) + 1;
          continue;
        }
        // the same Graph download fallback the nightly index uses (v1.33):
        // a source not on disk (unsynced subfolder, a synced folder that
        // IS the library's "General" child so the path doubles a segment)
        // downloads on demand instead of erroring every reformat
        let rfPath = localPath;
        const rfOnDisk = fs.existsSync(rfPath);
        // ...and a source on disk that cannot be read (v1.64: the
        // OneDrive placeholder shape) takes the same route
        const rfReadErr = rfOnDisk ? await probeSourceRead(rfPath) : null;
        if (rfReadErr) rfsum.unreadable_local = (rfsum.unreadable_local || 0) + 1;
        if (sw.graphDownloadFallback && (!rfOnDisk || rfReadErr)) {
          const buf = await graph.getItemContentBuffer(srcSiteId, sp.lists.sourceLibrary, item.id);
          rfPath = path.join(tmpDir, "dl", `${srcItemId}-${name}`);
          fs.mkdirSync(path.dirname(rfPath), { recursive: true });
          fs.writeFileSync(rfPath, buf);
          rfsum.graph_downloads = (rfsum.graph_downloads || 0) + 1;
        } else if (rfReadErr) {
          throw new Error(unreadableSourceMessage(rfPath, rfReadErr));
        }
        const { docText: rfRaw, lane: rfLane, srcAuthor, srcEditor, srcEdited, mediaFiles, drawings: rfDrawings } = extractDocText({
          sw, cfg, op, writer, pdfTool, ocrTools, setStep: () => {},
          localPath: rfPath, ext, srcItemId, modified, withMedia: false,
        });
        if (!rfRaw) {
          rfsum.no_text++;
          continue;
        }
        // phase 1b: media links point at media/<stem>/ — images (not
        // re-extracted on a reformat) move out of the flat
        // doc<srcItemId>_ naming once
        const stem = stemOf(existing.TextFileUrl);
        // v1.59: the standardized figure names — minted from the text,
        // so the files already on disk move to match without re-extraction
        const pm = prettifyMedia(rfRaw);
        const docText = relinkMedia(pm.text, stem);
        rfsum.drawings = (rfsum.drawings || 0) + rfDrawings.length;
        rfsum.drawings_written = (rfsum.drawings_written || 0) +
          writeMedia(cfg, writer, stem, [...mediaFiles, ...drawingFiles(rfDrawings, pm.renames)], pm.renames);
        const placed = placeLegacyMedia(cfg, writer, srcItemId, stem, pm.renames);
        rfsum.media_moved = (rfsum.media_moved || 0) + placed.legacy;
        rfsum.media_renamed += placed.renamed;
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
          status: existing.IndexStatus || "Indexed",
          docKind: existing.DocKind || "", surface: existing.Surface || "",
          surfaces: oldMeta.surfaces || [],
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
        await syncFigures(existing.ID, existing.DocKind || "", body, rfsum, existing.Title || "");
      } catch (e) {
        rfsum.errors++;
        prog.fail(name, e.message);
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
    // the reason this document was picked, so a nightly log explains
    // its own selection instead of only its result
    const why =
      !existing ? "new" :
      existing.IndexStatus === "Error" ? "retry after Error" :
      existing.IndexStatus === "Archived" ? "restored" :
      pdfRescue ? "PDF rescue" : ocrRescue ? "OCR rescue" : msgRescue ? "msg rescue" :
      scopeRescue ? "scope rescue" :
      (existing.PromptVersion || "") !== sw.promptVersion ? `PromptVersion ${existing.PromptVersion || "(none)"} -> ${sw.promptVersion}` :
      "source edited";
    const docT0 = Date.now();
    docTick(name, `${why}, ${fileTypeSafe}`);

    let step = "start";
    const stepAt = (s2) => {
      step = s2;
      prog(`   ${name} — ${s2}`);
    };
    try {
      // OneDrive-sync-lag fallback (v1.33, opt-in): the source is in
      // scope but not on disk yet — fetch its bytes through Graph into
      // a temp file and index from there, instead of an Error night.
      let effPath = localPath;
      const onDisk = fs.existsSync(localPath);
      // a source that IS on disk can still be unreadable (v1.64): a
      // OneDrive Files On-Demand placeholder that will not hydrate
      // passes existsSync/statSync and fails every read with a
      // path-less `UNKNOWN: unknown error, read`. Probe it here, while
      // the path is known: the Graph fallback covers it exactly like a
      // missing file; without the fallback the Error names the file
      // and the cause instead of the extractor's anonymous message.
      const readErr = inScope !== false && onDisk ? await probeSourceRead(localPath) : null;
      if (readErr) {
        summary.unreadable_local++;
        process.stderr.write(`note: ${name}: local copy unreadable (${readErr.message}) — ${localPath}\n`);
      }
      if (sw.graphDownloadFallback && inScope && (!onDisk || readErr)) {
        stepAt("graph-download");
        const buf = await graph.getItemContentBuffer(srcSiteId, sp.lists.sourceLibrary, item.id);
        effPath = path.join(tmpDir, "dl", `${srcItemId}-${name}`);
        fs.mkdirSync(path.dirname(effPath), { recursive: true });
        fs.writeFileSync(effPath, buf);
        summary.graph_downloads++;
      } else if (readErr) {
        stepAt("source-read");
        throw new Error(unreadableSourceMessage(localPath, readErr));
      }
      stepAt("extract");
      await indexDoc({
        cfg, sw, sp, op, writer, summary, pdfTool, ocrTools, bodyIndex, docLinks, linkResolver, syncCases, syncFigures,
        item: { name, fileRef, modified, srcItemId, sourceLink, localPath: effPath, ext, fileTypeSafe, docKey, inScope, folder },
        existing, existingKeywords, kwSnapshot, vocab, docIndexColumns,
        caches: { byDocKey, kwByTitle, idKeys, linkKeys, kwKeys, docIndexRows, keywordRows, docIdRows, docLinkRows, docKwRows },
        setStep: stepAt,
        progress: prog,
      });
      if (remote) {
        // an upload failure here IS a failed index (the sidecar never
        // reached SharePoint) — it lands in the Error lane like any step
        stepAt("remote-upload");
        await remote.flush();
      }
      errorLane.delete(docKey);
      prog(`   ${name} — indexed in ${secs(Date.now() - docT0)}`);
    } catch (e) {
      // Catch_index: Error row, LastError "{step}: {detail}", continue.
      // One failure class is NOT retryable (v1.28): the model REFUSING
      // the document (stop_reason: refusal) is deterministic on the
      // doc's own text — a deck that quotes model-instruction-like content
      // trips it every time — so an Error stamp would re-burn one AI call
      // per night failing identically. It stamps Skipped instead (the
      // out-of-scope pattern: once, visible on the status page, no nightly
      // rechurn), at the CURRENT PromptVersion/SourceModified so needsIndex
      // stays quiet; like any Skipped row it re-enters on the next
      // promptVersion bump or a source edit.
      const errDetail = cut(`${step}: ${e.message}`, 4000);
      const filtered = step === "llm" && (e.type === "Refused" || /stop_reason: refusal/.test(errDetail));
      if (filtered) {
        errorLane.delete(docKey);
        prog(`   ${name} — SKIPPED (content filter) after ${secs(Date.now() - docT0)}`);
        process.stderr.write(`SKIP (content-filtered) ${name}: ${errDetail}\n`);
      } else {
        summary.errors++;
        errorLane.set(docKey, { name, err: errDetail });
        prog(`   ${name} — ERROR at step "${step}" after ${secs(Date.now() - docT0)}`);
        process.stderr.write(`ERROR ${name}: ${errDetail}\n`);
      }
      try {
        const status = filtered ? "Skipped" : "Error";
        if (!existing && e.rowId && e.listKey === "docIndex") {
          // the Doc Index row was created before the failure (a hyperlink
          // write after a successful Graph create): adopt it, so the Error
          // stamp patches THAT row and the next run repairs its links,
          // rather than minting a duplicate DocKey
          existing = { ID: e.rowId, DocKey: docKey, IndexStatus: "Error", SourceModified: modified,
                       PromptVersion: "", Title: name, FileName: name, TextFileUrl: "", LastError: "" };
          byDocKey.set(docKey, existing);
          docIndexRows.push(existing);
        }
        const fields = {
          Title: name, FileName: name, DocKey: docKey,
          IndexStatus: status, IndexedOn: new Date().toISOString(),
          LastError: filtered
            ? cut("content filter: the model refused the document text — " +
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
    indexPhase.done(
      `${rfsum.rewritten} sidecar(s) rewritten, ${rfsum.unchanged} unchanged of ` +
      `${rfsum.eligible} eligible — ${rfsum.no_sidecar} without a sidecar, ` +
      `${rfsum.no_text} without text, ${rfsum.errors} error(s)`
    );
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
    indexPhase.done(
      `${summary.processed} document(s) processed, ${summary.errors} error(s), ` +
      `${summary.graph_downloads} downloaded through Graph` +
      (summary.unreadable_local
        ? `, ${summary.unreadable_local} on disk but unreadable (OneDrive placeholders?)`
        : "")
    );
    const ghostPhase = prog.phase("ghost reconciliation");
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
    const candidates = docIndexRows.filter((r) => r.DocKey && r.IndexStatus !== "Archived");
    const ghosts = candidates.filter((r) => !liveKeys.has(lower(r.DocKey)));
    const cap = sw.maxArchivesPerRun === undefined ? 20 : Number(sw.maxArchivesPerRun);
    // Sanity floor: when MORE than the per-run cap AND at least half of
    // the live rows read as ghosts, the listing and the rows disagree on
    // how keys are formed (a docKeyStrip / FileRef mismatch, a partial
    // listing) — archiving 20 a night would delete the corpus's sidecars
    // one batch at a time. Halt loudly; a real mass deletion is rare
    // enough to be handled by raising sweep.maxArchivesPerRun on purpose.
    const halt = ghosts.length > cap && ghosts.length * 2 >= candidates.length;
    ghostPhase.step(
      `${ghosts.length} of ${candidates.length} live row(s) match no library file ` +
      `(cap ${cap}/run)${halt ? " — HALTED, see the note below" : ""}`
    );
    const gTick = prog.counter(halt ? 0 : Math.min(ghosts.length, cap), "");
    if (halt) {
      summary.ghost_halted = ghosts.length;
      process.stderr.write(
        `ghost reconciliation halted: ${ghosts.length} of ${candidates.length} live rows match no ` +
        "library file — that is a DocKey/listing mismatch, not deletions (check sharePoint.docKeyStrip " +
        "and the library listing; raise sweep.maxArchivesPerRun to archive on purpose)\n"
      );
    }
    for (const g of halt ? [] : ghosts.slice(0, cap)) {
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
      gTick(g.FileName || g.Title || `doc ${g.ID}`, "archived, sidecar and media deleted");
      const local = urlToLocal(g.TextFileUrl || "", sw, cfg);
      if (local && fs.existsSync(local)) writer.deleteFile(local);
      // the document's media folder is derived state like its sidecar
      if (local) {
        const mediaDir = path.join(cfg.paths.sidecarLibrary, "media", stemOf(g.TextFileUrl || ""));
        if (stemOf(g.TextFileUrl || "") && fs.existsSync(mediaDir) && fs.statSync(mediaDir).isDirectory()) {
          for (const f of fs.readdirSync(mediaDir)) writer.deleteFile(path.join(mediaDir, f));
          if (!dry) { try { fs.rmdirSync(mediaDir); } catch { /* not empty or gone */ } }
        }
      }
      // an archived doc's case rows are derived state — prune them
      // with the sidecar (empty fresh side = full deletion)
      await syncCases(g.ID, "", "", summary);
      await syncFigures(g.ID, "", "", summary);
    }
    if (ghosts.length > cap) {
      process.stderr.write(`note: ${ghosts.length - cap} more ghost row(s) will archive on later runs (cap ${cap}/run)\n`);
    }
    if (remote) {
      await remote.flush().catch((e) =>
        process.stderr.write(`remote flush after ghosts: ${e.message}\n`));
    }
    ghostPhase.done(`${summary.archived} row(s) archived`);
  } else {
    indexPhase.done(
      `${summary.processed} document(s) processed, ${summary.errors} error(s), ` +
      `${summary.graph_downloads} downloaded through Graph` +
      (summary.unreadable_local
        ? `, ${summary.unreadable_local} on disk but unreadable (OneDrive placeholders?)`
        : "")
    );
  }

  summary.related_flags = summary.related_flags.trim();
  summary.spo_throttled = (writer.spo && writer.spo.throttled) || 0;
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
    const pagesPhase = prog.phase("status + browse pages");
    writeStatusPage(cfg, { summary, logFile, errorLane, streaks, runLogDir: logDir });
    // browse pages (v1.35): the catalog as humans see it — root +
    // per-kind _Index.md, rebuilt from the rows this run already holds
    writeIndexPages(cfg, docIndexRows, sw.kindFolders);
    writeManifest(cfg, docIndexRows, issueByDoc(docIndexRows, docIdRows));
    // the case catalog (Case_Index_Plan phase 3): every indexed test
    // case grouped by plan, from the case rows this run maintains
    if (ciEnabled) writeCaseCatalog(cfg, docIndexRows, caseRowsByDoc);
    // the figure catalog (Figure_Index_Plan): every indexed figure
    // grouped by document, from the figure rows this run maintains
    if (fiEnabled) writeFigureCatalog(cfg, docIndexRows, figureRowsByDoc);
    if (remote) {
      // the fs-written pages (status + indexes) ride the same
      // write-through; best-effort — a failed page upload is not a
      // failed run
      const lib = cfg.paths.sidecarLibrary;
      for (const p of [
        path.join(lib, "_Sweep Status.md"),
        path.join(lib, "_Index.md"),
        path.join(lib, "_Case Catalog.md"),
        path.join(lib, "_Figure Catalog.md"),
        ...Object.values(sw.kindFolders || {}).map((f) => path.join(lib, f, "_Index.md")),
      ]) {
        if (fs.existsSync(p)) remote.queuePut(p);
      }
      await remote.flush().catch((e) =>
        process.stderr.write(`remote flush of status/index pages: ${e.message}\n`));
    }
    pagesPhase.done("_Sweep Status.md, _Index.md, _Manifest.json, catalogs");
    if (!sw.smokeFile) {
      // dead-man stamp + chronic-error alert (v1.32): the run
      // completed, so stamp the heartbeat; docs stuck 3+ nights get a
      // push alert on top of their status-page row
      recordHeartbeat(cfg, summary);
      const chronic = [...errorLane.entries()]
        .filter(([k]) => (Number(streaks[k]) || 0) >= 3)
        .map(([, v]) => `${v.name}: ${String(v.err).slice(0, 120)}`);
      if (chronic.length) {
        prog(`alert — ${chronic.length} document(s) stuck 3+ nights`);
        await sendAlert(
          cfg,
          `Doc Index sweep: ${chronic.length} doc(s) stuck 3+ nights`,
          chronic.slice(0, 10).join("\n") +
          "\nSee _Sweep Status.md in the sidecar library."
        );
      }
    }
  }

  prog(`sweep finished in ${secs(prog.elapsed())} — ${line}`);
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
  const { cfg, sw, sp, op, writer, summary, pdfTool, ocrTools, bodyIndex, docLinks, linkResolver, syncCases, syncFigures, item, existing, existingKeywords, kwSnapshot, vocab, caches, setStep } = ctx;
  const { name, modified, srcItemId, sourceLink, localPath, ext, fileTypeSafe, docKey, inScope, folder = "" } = item;
  // the Doc Index row writer that drops a column the tenant lacks
  // (v1.66: Surfaces); a caller without one writes the fields as given
  const docIndexColumns = ctx.docIndexColumns
    || (async (fields, write) => ({ result: await write(fields), fields }));
  // the run's narrator, or a no-op for a caller that passes none
  const prog = ctx.progress || noProgress;
  const detail = (d) => prog(`   ${name} — ${d}`);

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
  const { docText: rawDocText, relsText, lane, srcAuthor, srcEditor, srcEdited, mediaFiles, drawings } = extractDocText({
    sw, cfg, op, writer, pdfTool, ocrTools, setStep,
    localPath, ext, srcItemId, modified, withMedia: true,
  });
  // v1.59: standardized figure names (figureindex.mjs) — minted from the
  // extracted text before anything reads it, so the LLM input, the
  // preview and the sidecar all see `fig-NN-slide-KK-<slug>.<ext>`
  const pretty = prettifyMedia(rawDocText);
  let docText = pretty.text;
  detail(
    `extracted ${docText.length} chars (lane ${lane || "none"})` +
    (mediaFiles.length ? `, ${mediaFiles.length} media file(s)` : "") +
    (drawings.length ? `, ${drawings.length} drawing(s)` : "")
  );

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

  // (a0) the deterministic signals (v1.66, lib/docsignals.mjs): the
  // regex products, the official tool names the text carries, the
  // scored surface evidence and the folder's kind — read before the
  // model so the prompt sees them, applied after so the row is right
  // even when the model ignores them. The regex op runs here (it was
  // step b): ids, revision and products depend on the text and the
  // file name, not on the title the model returns.
  setStep("regex");
  const rx = op({
    op: "regex", fileName: name,
    content: docText + "\n" + relsText,
    defaultRepo: sw.defaultRepo, title: "",
  });
  const ids = rx.ids || [];
  const namedTools = vocab?.official?.size ? toolsNamedIn(docText, vocab) : [];
  const signals = {
    folder,
    folderKind: folderKind(folder, sw.folderKinds),
    products: rx.products || [],
    namedTools,
    surfaces: detectSurfaces(docText, name, vocab, namedTools),
  };
  const signalsText = signalsBlock(signals);
  if (signalsText !== "(none)") detail(`signals — ${signalsText.replace(/\n/g, " | ")}`);

  // (a) LLM classify (AI Builder replacement)
  setStep("llm");
  const capped = cut(docText, sw.textCap);
  detail(`classifying — ~${capped.length} chars in (a long wait here is the model, not a hang)`);
  const llmT0 = Date.now();
  const stopLlm = prog.heartbeat(`waiting on the classifier for ${name}`);
  let ai;
  try {
    ai = await classifyDoc(cfg.llm, {
      fileName: name, docText: capped, existingKeywords, knownTools: vocab?.knownTools || "",
      folder, signals: signalsText,
    });
  } finally {
    stopLlm();
  }
  // every tool name to its official casing; the ones the vocabulary
  // does not know are kept as written, counted, and listed for review
  // in <workDir>/unknown-tools.txt (a widget or ribbon tool the hand-
  // kept `widgets` list should gain, or a name the model made up)
  if (vocab?.official?.size) {
    const norm = normalizeTools(ai.tools, vocab);
    ai.tools = norm.tools;
    if (norm.unknown.length) {
      summary.tools_unknown += norm.unknown.length;
      detail(`tool name(s) not in the official vocabulary: ${norm.unknown.map((t) => `'${t}'`).join(", ")}`);
      try {
        fs.appendFileSync(
          path.join(cfg.paths?.workDir || ".", "unknown-tools.txt"),
          norm.unknown.map((t) => `${t}\t${name}\t${new Date().toISOString().slice(0, 10)}\n`).join("")
        );
      } catch { /* best effort */ }
    }
  }
  // (a1) reconcile the reply with the signals (docsignals.reconcile):
  // the folder's kind, the model's surfaces plus the strong evidence,
  // the model's tools plus the text's, the regex products plus the
  // model's — each change counted in the summary
  const rec = reconcile(ai, signals, { folderKindWins: sw.folderKindWins !== false });
  const { docKind, surface, surfaces, products } = rec;
  ai.tools = rec.tools;
  summary.kind_from_folder += rec.notes.kindFromFolder;
  summary.surface_from_signals += rec.notes.surfaceFromSignals;
  summary.tools_from_text += rec.notes.toolsFromText;
  summary.products_from_model += rec.notes.productsFromModel;
  const title = cut(ai.title && ai.title !== "" ? ai.title : name, 255);
  const changes = [
    rec.notes.kindFromFolder ? "kind from the folder" : "",
    rec.notes.surfaceFromSignals ? `${rec.notes.surfaceFromSignals} surface(s) from the text` : "",
    rec.notes.toolsFromText ? `${rec.notes.toolsFromText} tool(s) from the text` : "",
    rec.notes.productsFromModel ? `${rec.notes.productsFromModel} product(s) from the model` : "",
  ].filter(Boolean);
  detail(
    `classified in ${secs(Date.now() - llmT0)} — ${docKind} / ${surfaces.join(" + ") || surface}` +
    (products.length ? ` / ${products.join("; ")}` : "") +
    `, ${(ai.keywords || []).length} keyword(s), ${(ai.tools || []).length} tool(s)` +
    (changes.length ? ` (${changes.join(", ")})` : "")
  );

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
    Surfaces: surfaces.join("; "),
  };
  let rowId;
  if (!existing) {
    const { result } = await docIndexColumns(
      rowFields, (f) => writer.createRow("docIndex", f), summary,
      (id, f) => writer.patchRow("docIndex", id, f)
    );
    rowId = result.id;
  } else {
    rowId = existing.ID;
    await docIndexColumns(rowFields, (f) => writer.patchRow("docIndex", rowId, f), summary);
  }

  // (d) sidecar naming (phase 1b): <issue>-<slug>[-qualifier].md — a
  // stem is minted once and then FROZEN (the row's TextFileUrl is the
  // record; --rename re-mints the corpus), so an AI re-title never
  // renames a linked file
  const kindFolder = sw.kindFolders[docKind] || "Other";
  const sidecarFolder = `${sw.textsFolder}/${kindFolder}`;
  let frozen = existing?.TextFileUrl ? stemOf(existing.TextFileUrl) : "";
  if (frozen) {
    const parts = String(existing.TextFileUrl).split("/");
    const oldFolder = decodeURIComponent(parts[parts.length - 2] || "");
    if (oldFolder !== kindFolder && takenStems(cfg, sw, caches.docIndexRows, kindFolder, rowId).has(frozen)) {
      // reclassified into a folder where ANOTHER document already owns
      // this stem: mint fresh rather than overwrite a neighbour's sidecar
      frozen = "";
    }
  }
  const stem = frozen || mintStem(
    { rowId, title, fileName: name, kind: docKind, ids, products,
      docRevision: rx.docRevision || "", lastEdited: srcEdited || "" },
    takenStems(cfg, sw, caches.docIndexRows, kindFolder, rowId),
    { ...defaultAbbreviations(), ...(sw.slugAbbreviations || {}) }
  );
  const sidecarName = `${stem}.md`;
  // media lands in media/<stem>/; the body's placeholder links follow
  docText = relinkMedia(docText, stem);
  writeMedia(cfg, writer, stem, [...mediaFiles, ...drawingFiles(drawings, pretty.renames)], pretty.renames);
  summary.drawings = (summary.drawings || 0) + drawings.length;
  const preview = cut(docText, sw.previewCap);

  // (e)+(f) header
  const header = sidecarHeader({
    h1Title: title === name ? name.replace(/\.[^.]*$/, "") : title,
    title, fileName: name, sourceLink, rowId, status: "Indexed",
    docKind, surface, surfaces, targetRelease: ai.targetRelease || "",
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
  // search fallback (pipeline/data/esri_doc_links.json)
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
    DocKind: docKind, Surface: surface, Surfaces: surfaces.join("; "),
    TargetRelease: ai.targetRelease || "", PE: ai.pe || "", Dev: ai.dev || "",
    Summary: ai.summary || "", Products: products.join("; "),
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
  // figure rows (Figure_Index_Plan): the same body, replace-set onto
  // the Figures list — same never-throws contract
  setStep("figure-index");
  await syncFigures(rowId, docKind, bodyText, summary, title);

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
      caches.docIdRows.push({ Repo: id.repo, IssueNumber: id.number, IdKey: idKey, DocumentId: rowId, Source: id.source || "" });
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
        Title: cut(`${name} | ${kw.val}`, 255), DocumentLookupId: rowId,
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
    progress: prog,
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
    configJson: relatedConfigJson(sw),
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
  (ctx.progress || noProgress)(
    `   ${name} — related: ${shortlist.count || 0} shortlisted, ${candRows.length} candidate(s), ` +
    `${finalDocs.length} kept`
  );

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
 *  pdftoppm defaults to Poppler's, next to pdftotext on PATH. An
 *  unrunnable tesseract disables OCR loudly; an unrunnable pdftoppm
 *  disables the scanned-PDF lane, and says so. */
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
      `(install Poppler to OCR image-only PDFs)\n`
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
