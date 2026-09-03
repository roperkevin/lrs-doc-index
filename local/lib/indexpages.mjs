/**
 * indexpages.mjs v1.0 (sweep v1.35) — corpus browse pages: a root
 * "_Index.md" in the sidecar library plus one per kind folder, so a
 * human can BROWSE the catalog (the Q&A agent answers questions; these
 * answer "what's in here?"). Rewritten after every live full sweep
 * from the same rows the run already holds — no extra fetches, no AI.
 * Underscore names, matching "_Sweep Status.md" (the corpus's one
 * established non-sidecar file). `sweep.indexPages: false` disables.
 *
 * Each row links the sidecar (angle-bracket target — folder names
 * carry spaces), shows products/release, and clips the AI summary to
 * one line. Rows sort newest-first by SourceModified, matching the
 * sweep's own walk order.
 */

import fs from "node:fs";
import path from "node:path";

const clip = (s, n) =>
  String(s || "").replaceAll("|", "/").replace(/\s+/g, " ").trim().slice(0, n);

function rowLine(r, linkPrefix) {
  const url = String(r.TextFileUrl || "");
  const file = decodeURIComponent(url.split("/").pop() || "");
  if (!file) return null;
  const title = clip(r.Title || r.FileName, 80) || file;
  const target = linkPrefix ? `${linkPrefix}/${file}` : file;
  const products = clip(r.Products, 40) || "—";
  const release = clip(r.TargetRelease, 20) || "—";
  const summary = clip(r.Summary, 140);
  return `| [${title}](<${target}>) | ${products} | ${release} | ${summary} |`;
}

const TABLE_HEAD = [
  "| Document | Product | Release | Summary |",
  "|---|---|---|---|",
];

/**
 * Write the root + per-kind index pages. `rows` are the normalized
 * Doc Index rows AFTER the run (the caches the sweep maintains);
 * `kindFolders` is Config.KindFolders. Live runs only — the caller
 * gates on dryRun, like the status page.
 */
export function writeIndexPages(cfg, rows, kindFolders) {
  const dir = cfg?.paths?.sidecarLibrary;
  if (!dir || cfg?.sweep?.indexPages === false) return;
  const indexed = rows
    .filter((r) => r.IndexStatus === "Indexed" && r.TextFileUrl)
    .sort((a, b) => String(b.SourceModified || "").localeCompare(String(a.SourceModified || "")));
  const byFolder = new Map();
  for (const r of indexed) {
    // group by the sidecar's ACTUAL folder (second-to-last URL path
    // segment) so a row mid-migration still lists where its file is
    const parts = String(r.TextFileUrl).split("/");
    const folder = decodeURIComponent(parts[parts.length - 2] || "");
    if (!byFolder.has(folder)) byFolder.set(folder, []);
    byFolder.get(folder).push(r);
  }
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const foot = `\n_Rebuilt automatically by the local sweep · ${stamp}Z · ${indexed.length} indexed document(s)._\n`;

  // per-kind pages, in Config.KindFolders order + any stragglers
  const orderedFolders = [
    ...Object.values(kindFolders || {}),
    ...[...byFolder.keys()].filter((f) => !Object.values(kindFolders || {}).includes(f)),
  ].filter((f, i, a) => f && a.indexOf(f) === i);
  const rootSections = [];
  for (const folder of orderedFolders) {
    const rs = byFolder.get(folder) || [];
    rootSections.push(`## ${folder} (${rs.length})`, "");
    if (!rs.length) {
      rootSections.push("_None yet._", "");
      continue;
    }
    rootSections.push(...TABLE_HEAD,
      ...rs.map((r) => rowLine(r, folder)).filter(Boolean), "");
    const kindMd = [
      `# ${folder} — index`,
      "",
      ...TABLE_HEAD,
      ...rs.map((r) => rowLine(r, "")).filter(Boolean),
      foot,
    ].join("\n");
    try {
      fs.mkdirSync(path.join(dir, folder), { recursive: true });
      fs.writeFileSync(path.join(dir, folder, "_Index.md"), kindMd);
    } catch (e) {
      process.stderr.write(`index page write failed (${folder}): ${e.message}\n`);
    }
  }
  const rootMd = [
    "# LRS Doc Index — catalog",
    "",
    "_Every indexed document, newest first, grouped by kind. See",
    "\"_Sweep Status.md\" for pipeline health._",
    "",
    ...rootSections,
    foot,
  ].join("\n");
  try {
    fs.writeFileSync(path.join(dir, "_Index.md"), rootMd);
  } catch (e) {
    process.stderr.write("index page write failed (root): " + e.message + "\n");
  }
}
