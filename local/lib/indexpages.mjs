/**
 * indexpages.mjs v1.2 (sweep v1.35; v1.43 adds the case catalog;
 * v1.44 adds its Tools column) —
 * corpus browse pages: a root "_Index.md" in the sidecar library plus
 * one per kind folder, so a human can BROWSE the catalog (the Q&A
 * agent answers questions; these answer "what's in here?"), and —
 * when test-case indexing is on — "_Case Catalog.md", every indexed
 * test case grouped by plan (Case_Index_Plan phase 3). Rewritten
 * after every live full sweep from the same rows the run already
 * holds — no extra fetches, no AI. Underscore names, matching
 * "_Sweep Status.md" (the corpus's one established non-sidecar
 * file). `sweep.indexPages: false` disables all of them.
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

/**
 * "_Case Catalog.md" — every indexed test case, grouped by plan
 * (newest plan first, cases in plan order), each case deep-linking
 * its sidecar section through the heading anchor the case row
 * carries. Written by live runs when test-case indexing is enabled
 * (the caller gates on the list GUID); `rows` are the Doc Index rows
 * the run holds, `caseRowsByDoc` the docRowId -> [{id, fields}] map
 * the sweep maintains.
 */
export function writeCaseCatalog(cfg, rows, caseRowsByDoc) {
  const dir = cfg?.paths?.sidecarLibrary;
  if (!dir || cfg?.sweep?.indexPages === false || !caseRowsByDoc) return;
  const ordinalOf = (f) => {
    const n = parseInt(String(f?.CaseKey || "").split("|")[1], 10);
    return Number.isFinite(n) ? n : 0;
  };
  const plans = rows
    .filter((r) => r.ID && r.IndexStatus === "Indexed" && r.TextFileUrl &&
                   (caseRowsByDoc.get(r.ID) || []).length > 0)
    .sort((a, b) => String(b.SourceModified || "").localeCompare(String(a.SourceModified || "")));
  const sections = [];
  let total = 0;
  for (const plan of plans) {
    const cases = (caseRowsByDoc.get(plan.ID) || [])
      .map((c) => c.fields || {})
      .sort((a, b) => ordinalOf(a) - ordinalOf(b));
    total += cases.length;
    const parts = String(plan.TextFileUrl).split("/");
    const file = decodeURIComponent(parts[parts.length - 1] || "");
    const folder = decodeURIComponent(parts[parts.length - 2] || "");
    const target = folder ? `${folder}/${file}` : file;
    const nPos = cases.filter((c) => c.Classification === "Positive").length;
    const nNeg = cases.filter((c) => c.Classification === "Negative").length;
    const counts = [`${nPos} positive`, `${nNeg} negative`];
    const nOther = cases.length - nPos - nNeg;
    if (nOther) counts.push(`${nOther} unspecified`);
    sections.push(
      `## ${clip(plan.Title || plan.FileName, 80)} (${cases.length}: ${counts.join(" / ")})`,
      "",
      `[Sidecar](<${target}>) · ${clip(plan.Surface, 30) || "—"} · release ${clip(plan.TargetRelease, 20) || "—"}`,
      "",
      "| Case | Classification | Group | Shape | Tools | Issues |",
      "|---|---|---|---|---|---|",
      ...cases.map((c) => {
        const label = clip(c.Title, 90) || `Case ${ordinalOf(c)}`;
        const link = c.Anchor ? `[${label}](<${target}#${c.Anchor}>)` : label;
        const shape = c.Shape ? `${c.Shape}${c.Confidence && c.Confidence !== "high" ? " · " + c.Confidence : ""}` : "—";
        return `| ${link} | ${c.Classification || "—"} | ${clip(c.Group, 40) || "—"} | ${shape} | ${clip(c.Tools, 60) || "—"} | ${clip(c.IssueRefs, 80) || "—"} |`;
      }),
      ""
    );
  }
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const md = [
    "# Test cases — catalog",
    "",
    "_Every indexed test case, grouped by plan (newest first). Case",
    "links open the plan's sidecar at that case's section; see",
    "\"_Index.md\" for the document catalog._",
    "",
    ...(sections.length ? sections : ["_None yet._", ""]),
    `_Rebuilt automatically by the local sweep · ${stamp}Z · ${total} case(s) across ${plans.length} plan(s)._`,
    "",
  ].join("\n");
  try {
    fs.writeFileSync(path.join(dir, "_Case Catalog.md"), md);
  } catch (e) {
    process.stderr.write("case catalog write failed: " + e.message + "\n");
  }
}

/**
 * "_Manifest.json" — row id -> sidecar path, for every consumer that
 * used to find a file by its `__doc<id>` suffix (phase 1b removed the
 * id from filenames). Rebuilt with the browse pages on live runs and
 * by --rename. `issueByDoc` is the Map rowId -> primary issue number.
 */
export function writeManifest(cfg, rows, issueByDoc) {
  const dir = cfg?.paths?.sidecarLibrary;
  if (!dir || cfg?.sweep?.indexPages === false) return;
  const docs = {};
  for (const r of rows || []) {
    if (!r.ID || r.IndexStatus !== "Indexed" || !r.TextFileUrl) continue;
    const parts = String(r.TextFileUrl).split("/");
    const file = decodeURIComponent(parts[parts.length - 1] || "");
    const folder = decodeURIComponent(parts[parts.length - 2] || "");
    docs[String(r.ID)] = {
      path: folder ? `${folder}/${file}` : file,
      stem: file.replace(/\.md$/i, ""),
      kind: r.DocKind || "",
      issue: (issueByDoc && issueByDoc.get(r.ID)) || 0,
      title: r.Title || "",
    };
  }
  const out = { generated: new Date().toISOString(), format: "3.0", docs };
  try {
    fs.writeFileSync(path.join(dir, "_Manifest.json"), JSON.stringify(out, null, 1));
  } catch (e) {
    process.stderr.write("manifest write failed: " + e.message + "\n");
  }
}
