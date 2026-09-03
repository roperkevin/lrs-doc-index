/**
 * ops.mjs v1.0 — shared op machinery for the Doc Index script runners.
 *
 * Extracted verbatim from run_job.mjs v2.0 so that both the PAD batch
 * runner (run_job.mjs) and the local sweep orchestrator
 * (local/sweep.mjs) drive the UNMODIFIED scripts/ files through one
 * gated code path. Behavior is covered by pad/harness/
 * check_pad_runner.py (including the wrap.py parity leg).
 *
 * Script loading is the review/harness/wrap.py trick: the .ts source
 * runs as-is under Node type stripping (ExcelScript appears in type
 * position only), with an export appended so the wrap imports as an
 * ES module.
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { xlsxToGrids } from "./xlsx_grid.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_SCRIPTS_DIR = path.resolve(HERE, "..", "..", "scripts");

export const SCRIPT_FILES = {
  ziptext: "ZipTextExtract.ts",
  media: "MediaExtract.ts",
  regex: "RegexExtract.ts",
  workbookdump: "WorkbookDump.ts",
  related: "RelatedRank.ts",
  sidecarpatch: "SidecarPatch.ts",
  figures: "SlideFigures.ts",
};

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

export async function loadScripts(scriptsDir, needed, tmpDir) {
  const mains = {};
  for (const opName of needed) {
    const srcPath = path.join(scriptsDir, SCRIPT_FILES[opName]);
    if (!fs.existsSync(srcPath)) throw new Error(`script not found: ${srcPath}`);
    const src = fs.readFileSync(srcPath, "utf8");
    const wrapPath = path.join(tmpDir, opName + ".mts");
    fs.writeFileSync(wrapPath, src + "\n\nexport const padMain = main;\n");
    const mod = await import(pathToFileURL(wrapPath).href);
    mains[opName] = mod.padMain;
  }
  return mains;
}

// ---- op dispatch ----------------------------------------------------

export function runOp(mains, op) {
  const m = mains[op.op];
  switch (op.op) {
    case "ziptext":
      return m(null, zipParam(op), strParam(op, "mediaPrefix", op.mediaPrefix, false));
    case "media":
      return m(null, zipParam(op));
    case "figures":
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
