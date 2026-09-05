/**
 * util.mjs v1.0 — small shared helpers for the local jobs, moved
 * verbatim out of sweep.mjs v1.30 (module split, no behavior change;
 * covered end-to-end by check_local_sweep.py).
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

export const lower = (s) => String(s ?? "").toLowerCase();
export const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n) : String(s));
export const folderOf = (k) => {
  const i = String(k).lastIndexOf("/");
  return i >= 0 ? String(k).slice(0, i) : "";
};

export function yamlEscape(s) {
  return String(s ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\r", " ")
    .replaceAll("\n", " ");
}
export const stripQuotes = (s) => String(s ?? "").replaceAll('"', "");
export const pipeToSlash = (s) => String(s ?? "").replaceAll("|", "/");

export function fmtDate(iso, withTime) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  const day = `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
  return withTime ? `${day} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}` : day;
}

export function quoteYamlItem(s) {
  // Select_kw_yaml: strip backslashes and double quotes, then wrap.
  return '"' + String(s ?? "").replaceAll("\\", "").replaceAll('"', "") + '"';
}

/** Zero-dependency HTML → text: scripts/styles/comments dropped,
 *  tags stripped, common entities decoded, whitespace collapsed. */
export function htmlToText(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style[\s\S]*?<\/style\s*>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (m, d) => {
      const n = Number(d);
      return n > 31 && n < 65536 ? String.fromCharCode(n) : " ";
    })
    .replace(/&amp;/gi, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

export const num = (v) => {
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return isNaN(n) ? undefined : n;
};
export const hyperlink = (v) => (v && typeof v === "object" ? v.Url || "" : v || "");

// TextFileUrl / sidecar folder → local synced path
export function urlToLocal(url, sw, cfg) {
  let rel = url.replace(sw.siteUrl, "");
  try {
    rel = decodeURIComponent(rel);
  } catch { /* keep raw */ }
  if (!rel.startsWith(sw.textsFolder + "/")) return null;
  const inside = rel.slice(sw.textsFolder.length + 1);
  return path.join(cfg.paths.sidecarLibrary, ...inside.split("/"));
}

export function folderToLocal(folder, sw, cfg) {
  if (folder === sw.textsFolder) return cfg.paths.sidecarLibrary;
  if (!folder.startsWith(sw.textsFolder + "/")) return null;
  return path.join(cfg.paths.sidecarLibrary, ...folder.slice(sw.textsFolder.length + 1).split("/"));
}

/** Keep the newest N per-run JSON logs of one prefix; the stamp
 *  format sorts lexically so a name sort is a time sort. Best-effort. */
export function pruneRunLogs(logDir, keep = 30, prefix = "sweep-") {
  let names;
  try {
    names = fs.readdirSync(logDir)
      .filter((f) => f.startsWith(prefix) && (f.endsWith(".json") || f.endsWith(".json.gz")))
      .sort();
  } catch {
    return;
  }
  for (const f of names.slice(0, Math.max(0, names.length - keep))) {
    try { fs.unlinkSync(path.join(logDir, f)); } catch { /* best effort */ }
  }
}

/**
 * Nightly list backup (v1.32): the six SharePoint lists are the only
 * copy of the graph, and the tenant has re-created them wholesale
 * once already (SP_Adaptation_Notes "Current tenant GUIDs"). The
 * sweep holds every row in memory at run start anyway, so each run
 * gzips that snapshot to workDir — a restore source that costs one
 * file write. Keeps the newest 14; sweep.exportLists: false disables.
 * Returns the file path, or null (disabled / no workDir / failed).
 */
export function exportListSnapshots(cfg, snapshots, keep = 14) {
  const dir = cfg?.paths?.workDir;
  if (!dir || cfg?.sweep?.exportLists === false) return null;
  try {
    fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
    const file = path.join(dir, `list-backup-${stamp}.json.gz`);
    fs.writeFileSync(file, zlib.gzipSync(JSON.stringify({
      exported: new Date().toISOString(),
      lists: snapshots,
    })));
    pruneRunLogs(dir, keep, "list-backup-");
    return file;
  } catch (e) {
    process.stderr.write("list backup failed: " + e.message + "\n");
    return null;
  }
}

/** v2.5 (PDF-1, Sidecar_Format_Plan §4.5): re-flow pdftotext output.
 *  A line joins the next one when it does not end a sentence and the
 *  next line continues it in lowercase (or the current line breaks on
 *  a hyphen). List starts, headings and blank lines never join, so a
 *  numbered case list survives while its wrapped sentences re-flow. */
export function unwrapPdfText(text) {
  const lines = String(text ?? "").replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  const listStart = /^\s*(?:\d{1,3}[a-z]?[.)]|[a-z][.)]|[-•●▪◦*])\s+/;
  for (let i = 0; i < lines.length; i++) {
    let cur = lines[i].replace(/\s+$/, "");
    while (i + 1 < lines.length) {
      const nxt = lines[i + 1];
      const nt = nxt.trim();
      const ct = cur.trim();
      if (ct === "" || nt === "" || listStart.test(nxt)) break;
      if (/[.:;!?)]$/.test(ct)) break;
      if (/\w-$/.test(ct) && /^[a-z]/.test(nt)) { cur = ct.slice(0, -1) + nt; i++; continue; }
      if (/^[a-z(]/.test(nt)) { cur = ct + " " + nt; i++; continue; }
      break;
    }
    out.push(cur);
  }
  return out.join("\n");
}
