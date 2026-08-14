#!/usr/bin/env node
/**
 * run_job.mjs v2.0 — Power Automate Desktop batch runner for the
 * Doc Index Office Scripts.
 * --------------------------------------------------------------------
 * Executes the UNMODIFIED scripts in `scripts/` (single source of
 * truth — nothing is forked) under Node, dispatching a batch job file
 * of one or more operations that mirror the flow v2.8 Run-script
 * action contracts 1:1. Replaces the Excel Online "Run script" action
 * (1,600 calls/day quota) with local compute.
 *
 * Usage (batch mode — unchanged since v1.0):
 *   node --experimental-strip-types run_job.mjs <job.json>
 *
 * Usage (single-op mode — no job JSON to author):
 *   node --experimental-strip-types run_job.mjs --op <op> \
 *     [key=value ...] [key@=<file> ...] [--argsfile <file>] \
 *     [--out <result.json>]
 *
 *   <op> is an op name (below) or a script file name, case-
 *   insensitive ("workbookdump" == "WorkbookDump").
 *   key=value    sets a string param verbatim (spaces fine — each
 *                pair is one shell argument).
 *   key@=<file>  reads the value from a UTF-8 file (same as the
 *                {"$file": ...} indirection in batch jobs).
 *   file=<path>  op-aware alias: the source-file param of the op
 *                (zipFile for ziptext/media, xlsxFile for
 *                workbookdump).
 *   --argsfile   a UTF-8 file of key=value / key@= lines, one per
 *                line; blank lines and #-comment lines are skipped.
 *                Values run to end of line, raw — no quoting or
 *                escaping ever needed (this is what the desktop
 *                flow's quick-run mode writes).
 *   --out        result-file path (default: <op>.result.json in the
 *                working directory).
 *   Args apply in order; later assignments win. The result envelope
 *   is byte-identical to a one-op batch job's.
 *
 * (The strip-types flag is required on Node 22; on Node >= 23.6
 * stripping is on by default and the flag is accepted/ignored.
 * Node 22+ required — same floor as review/harness.)
 *
 * Job file shape (see pad/samples/):
 *   {
 *     "scriptsDir": "optional abs path; default = <repo>/scripts",
 *     "resultFile": "optional abs path; default = <job>.result.json",
 *     "ops": [ { "id": "...", "op": "<op>", ...params }, ... ]
 *   }
 *
 * Ops and their param mapping (flow action -> op):
 *   Zip_extract_pptx/docx -> "ziptext"      { zipFile|zipBase64, mediaPrefix? }
 *   Extract_media_*       -> "media"        { zipFile|zipBase64 }
 *   Run_regex             -> "regex"        { fileName, content, defaultRepo, title? }
 *   Dump_workbook         -> "workbookdump" { xlsxFile, maxCells? }
 *   Run_related_shortlist -> "related"      { selfId, mode:"shortlist", myKwsJson,
 *   Run_related_rank      -> "related"        sharersJson, linksJson, kwMetaJson,
 *                                             candsMetaJson, selfMetaJson,
 *                                             configJson, topN? }
 *   Run_sidecar_patch     -> "sidecarpatch" { filesJson, selfId, rankedJson,
 *                                             docsMetaJson, selfMetaJson, topN? }
 *
 * Any string param may instead be {"$file": "path"} to read the value
 * from a UTF-8 file (large payloads bypass parameter plumbing), and
 * any *Json param may be given as a real JSON object/array (it is
 * stringified before the call, matching the flow's string() wrapping).
 *
 * Each result is wrapped as { "result": ... } to mirror the Excel
 * connector's response envelope, so cloud expressions keep their
 * `...?['result']?['...']` shape.
 *
 * WorkbookDump parity caveat: Excel's getTexts() returns rendered
 * display strings. This runner rebuilds the grid from the xlsx parts
 * (shared strings, cached formula values, date number formats) — see
 * xlsx_grid.mjs. Content is equivalent; exotic number formats may
 * render slightly differently than Excel would.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { xlsxToGrids } from "./xlsx_grid.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SCRIPTS_DIR = path.resolve(HERE, "..", "..", "scripts");

const SCRIPT_FILES = {
  ziptext: "ZipTextExtract.ts",
  media: "MediaExtract.ts",
  regex: "RegexExtract.ts",
  workbookdump: "WorkbookDump.ts",
  related: "RelatedRank.ts",
  sidecarpatch: "SidecarPatch.ts",
};

function fail(msg) {
  process.stderr.write("run_job: " + msg + "\n");
  process.exit(1);
}

// ---- param plumbing -------------------------------------------------

function strParam(op, key, v, required) {
  if (v === undefined || v === null) {
    if (required) throw new Error(`op "${op.op}": missing required param "${key}"`);
    return undefined;
  }
  if (typeof v === "object" && v.$file) {
    return fs.readFileSync(String(v.$file), "utf8");
  }
  return String(v);
}

// *Json params: the flow passes strings (string(...) wrapping); accept
// real JSON values too and stringify them to keep job files readable.
function jsonParam(op, key, v, required) {
  if (v === undefined || v === null) {
    if (required) throw new Error(`op "${op.op}": missing required param "${key}"`);
    return "[]";
  }
  if (typeof v === "object" && v.$file) {
    return fs.readFileSync(String(v.$file), "utf8");
  }
  if (typeof v === "string") return v;
  return JSON.stringify(v);
}

function zipParam(op) {
  if (op.zipBase64 !== undefined) return strParam(op, "zipBase64", op.zipBase64, true);
  if (op.zipFile !== undefined) {
    return fs.readFileSync(String(op.zipFile)).toString("base64");
  }
  throw new Error(`op "${op.op}": needs zipFile or zipBase64`);
}

// ---- script loading -------------------------------------------------
// Same trick as review/harness/wrap.py: the .ts source runs as-is
// under Node type stripping (ExcelScript appears in type position
// only, so it needs no runtime definition). We append an export and
// import the wrap as an ES module.

async function loadScripts(scriptsDir, needed, tmpDir) {
  const mains = {};
  for (const opName of needed) {
    const srcPath = path.join(scriptsDir, SCRIPT_FILES[opName]);
    if (!fs.existsSync(srcPath)) fail(`script not found: ${srcPath}`);
    const src = fs.readFileSync(srcPath, "utf8");
    const wrapPath = path.join(tmpDir, opName + ".mts");
    fs.writeFileSync(wrapPath, src + "\n\nexport const padMain = main;\n");
    const mod = await import(pathToFileURL(wrapPath).href);
    mains[opName] = mod.padMain;
  }
  return mains;
}

// ---- op dispatch ----------------------------------------------------

function runOp(mains, op) {
  const m = mains[op.op];
  switch (op.op) {
    case "ziptext":
      return m(null, zipParam(op), strParam(op, "mediaPrefix", op.mediaPrefix, false));
    case "media":
      return m(null, zipParam(op));
    case "regex":
      return m(
        null,
        strParam(op, "fileName", op.fileName, true),
        strParam(op, "content", op.content, true),
        strParam(op, "defaultRepo", op.defaultRepo, true),
        strParam(op, "title", op.title, false)
      );
    case "workbookdump": {
      const grids = xlsxToGrids(fs.readFileSync(String(op.xlsxFile)));
      const mock = {
        getWorksheets: () =>
          grids.map((s) => ({
            getName: () => s.name,
            getUsedRange: () =>
              s.grid.length === 0
                ? null
                : {
                    getRowCount: () => s.grid.length,
                    getColumnCount: () => s.grid[0].length,
                    getTexts: () => s.grid,
                  },
          })),
      };
      return m(mock, op.maxCells === undefined ? 60000 : Number(op.maxCells));
    }
    case "related":
      return m(
        null,
        strParam(op, "selfId", op.selfId, true),
        strParam(op, "mode", op.mode, true),
        jsonParam(op, "myKwsJson", op.myKwsJson, true),
        jsonParam(op, "sharersJson", op.sharersJson, true),
        jsonParam(op, "linksJson", op.linksJson, true),
        jsonParam(op, "kwMetaJson", op.kwMetaJson, true),
        jsonParam(op, "candsMetaJson", op.candsMetaJson, true),
        jsonParam(op, "selfMetaJson", op.selfMetaJson, true),
        jsonParam(op, "configJson", op.configJson, false),
        op.topN === undefined ? 5 : Number(op.topN)
      );
    case "sidecarpatch":
      return m(
        null,
        jsonParam(op, "filesJson", op.filesJson, true),
        strParam(op, "selfId", op.selfId, true),
        jsonParam(op, "rankedJson", op.rankedJson, true),
        jsonParam(op, "docsMetaJson", op.docsMetaJson, true),
        jsonParam(op, "selfMetaJson", op.selfMetaJson, true),
        op.topN === undefined ? 5 : Number(op.topN)
      );
    default:
      throw new Error(`unknown op "${op.op}"`);
  }
}

// ---- single-op CLI mode ---------------------------------------------
// Builds a one-op job from key=value arguments so nobody has to author
// (or JSON-escape) a job file to run one script. Everything downstream
// of the job object is the batch path — the result envelope is
// identical by construction.

const OP_ALIASES = {};
for (const [opName, file] of Object.entries(SCRIPT_FILES)) {
  OP_ALIASES[opName] = opName;
  OP_ALIASES[file.replace(/\.ts$/, "").toLowerCase()] = opName;
}

// `file=` resolves to the op's source-file param.
const FILE_PARAM = { ziptext: "zipFile", media: "zipFile", workbookdump: "xlsxFile" };

function assignArg(op, pair, from) {
  const eq = pair.indexOf("=");
  if (eq <= 0) fail(`bad argument "${pair}"${from} — expected key=value or key@=file`);
  let key = pair.slice(0, eq);
  let value = pair.slice(eq + 1);
  const indirect = key.endsWith("@");
  if (indirect) key = key.slice(0, -1);
  if (key === "file") {
    const mapped = FILE_PARAM[op.op];
    if (!mapped)
      fail(`op "${op.op}" takes no source file — pass its named params instead ` +
           `(see the op table in this file's header)`);
    key = mapped;
  }
  op[key] = indirect ? { $file: value } : value;
}

function buildSingleOpJob(argv) {
  const rawOp = argv[0];
  if (!rawOp) fail("--op needs an op name");
  const opName = OP_ALIASES[String(rawOp).toLowerCase()];
  if (!opName)
    fail(`unknown op "${rawOp}" — one of: ${Object.keys(SCRIPT_FILES).join(", ")}`);
  const op = { id: "cli", op: opName };
  let out = null;
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") {
      out = argv[++i];
      if (!out) fail("--out needs a path");
    } else if (a === "--argsfile") {
      const p = argv[++i];
      if (!p) fail("--argsfile needs a path");
      if (!fs.existsSync(p)) fail(`args file not found: ${p}`);
      for (const rawLine of fs.readFileSync(p, "utf8").split("\n")) {
        const line = rawLine.replace(/\r$/, "");
        if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
        assignArg(op, line, ` in args file ${p}`);
      }
    } else {
      assignArg(op, a, "");
    }
  }
  return {
    job: { ops: [op] },
    resultFile: path.resolve(out === null ? opName + ".result.json" : out),
  };
}

// ---- main -----------------------------------------------------------

let job;
let jobPath = null;
let resultFile;

if (process.argv[2] === "--op") {
  ({ job, resultFile } = buildSingleOpJob(process.argv.slice(3)));
} else {
  jobPath = process.argv[2];
  if (!jobPath)
    fail(
      "usage: node --experimental-strip-types run_job.mjs <job.json>\n" +
      "       node --experimental-strip-types run_job.mjs --op <op> [key=value ...] " +
      "[--argsfile <file>] [--out <result.json>]"
    );
  if (!fs.existsSync(jobPath)) fail(`job file not found: ${jobPath}`);
  try {
    job = JSON.parse(fs.readFileSync(jobPath, "utf8"));
  } catch (e) {
    fail(`job file is not valid JSON: ${e.message}`);
  }
  if (!Array.isArray(job.ops) || job.ops.length === 0) fail("job has no ops");
  resultFile = job.resultFile ? path.resolve(String(job.resultFile)) : jobPath + ".result.json";
}

const scriptsDir = job.scriptsDir ? path.resolve(String(job.scriptsDir)) : DEFAULT_SCRIPTS_DIR;

const badOps = job.ops.filter((o) => !SCRIPT_FILES[o.op]);
if (badOps.length) fail("unknown op(s): " + badOps.map((o) => String(o.op)).join(", "));

const needed = [...new Set(job.ops.map((o) => o.op))];
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "docindex-pad-"));

const t0 = Date.now();
let mains;
try {
  mains = await loadScripts(scriptsDir, needed, tmpDir);
} catch (e) {
  fail(`failed to load scripts from ${scriptsDir}: ${e.message}`);
}

const results = [];
let failures = 0;
for (let i = 0; i < job.ops.length; i++) {
  const op = job.ops[i];
  const entry = { index: i, id: op.id === undefined ? null : op.id, op: op.op };
  const s0 = Date.now();
  try {
    entry.result = runOp(mains, op);
    entry.ok = true;
  } catch (e) {
    entry.ok = false;
    entry.error = e.message;
    failures++;
  }
  entry.ms = Date.now() - s0;
  results.push(entry);
}

fs.rmSync(tmpDir, { recursive: true, force: true });

const summary = {
  jobFile: jobPath === null ? null : path.resolve(jobPath),
  scriptsDir,
  opCount: job.ops.length,
  failures,
  ms: Date.now() - t0,
  results,
};
fs.writeFileSync(resultFile, JSON.stringify(summary, null, 1));
process.stdout.write(
  JSON.stringify({ ok: failures === 0, opCount: job.ops.length, failures, resultFile }) + "\n"
);
// Per-op failures are recorded in the result file; only a fatal
// (unusable job / scripts) exits non-zero, so PAD can branch on both.
process.exit(0);
