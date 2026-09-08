// Writes the layout-variation pages into the rendered wiki tree,
// appends the CSS/JS they need, and patches mkdocs.yml for the local build.
import fs from "node:fs"; import path from "node:path";
import { PLANS } from "./fixture.mjs";
const site = process.argv[2];
const docs = path.join(site, "work", "wiki", "docs");
const kebab = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const plans = PLANS.map(([stem, title, id, surface, products, release, tools, edited, author, pe, summary]) =>
  ({ stem, title, id, surface, products, release, tools, edited, author, pe, summary, cases: 6 + (id % 9) }))
  .sort((a, b) => b.edited.localeCompare(a.edited));
const pill = (t) => `[${t}](../tools/${kebab(t)}.md){ .lrs-pill }`;
const facts = (p) => `${p.products.map((x) => `[${x}](../products/${kebab(x)}.md)`).join(" · ")} · release [${p.release}](../releases/${kebab(p.release)}.md) · [${p.surface}](../surfaces/${kebab(p.surface)}.md) · ${p.cases} cases · PE [${p.pe}](../people/${kebab(p.pe)}.md)`;
const head = (p, cls) => [
  `//// details | [${p.title}](./${p.stem}.md) <span class="lrs-tags">${p.tools.map(pill).join(" ")}</span> *${p.edited.slice(0, 10)}*{ .lrs-when }`,
  ...(cls.open ? ["    open: true"] : []),
  `    attrs: {class: "${cls.cls}"}`, ""];

// ---- A: stacked cards, open; the summary a nested closed fold
const A = [`---\ntitle: "Test Plans (A)"\nsearch:\n  exclude: true\n---\n`,
  "# :material-test-tube: Test Plans", "",
  `${plans.length} documents, newest edit first. Type in the box to filter the list; a plan's summary unfolds from its chevron. Or [see every kind in one table](../documents/index.md).`, "",
  '<div class="filterable lrs-plans" markdown>', ""];
for (const p of plans) {
  A.push(...head(p, { open: true, cls: "lrs-plan" }),
    `<div class="lrs-plan__facts" markdown>${facts(p)}</div>`, "",
    "/// details | Summary", "    type: abstract", "", p.summary, "///", "////", "");
}
A.push("</div>", "");
fs.writeFileSync(path.join(docs, "test-plans", "variant-a.md"), A.join("\n"));

// ---- B: a ledger — one closed row per plan, grouped by release
const B = [`---\ntitle: "Test Plans (B)"\nsearch:\n  exclude: true\n---\n`,
  "# :material-test-tube: Test Plans", "",
  `${plans.length} documents by target release, newest edit first within a release. Type in the box to filter every group at once; open a row for the plan's facts and summary. Or [see every kind in one table](../documents/index.md).`, "",
  '<div class="filter-all lrs-plans lrs-plans--ledger" markdown>', ""];
const byRel = new Map();
for (const p of plans) { if (!byRel.has(p.release)) byRel.set(p.release, []); byRel.get(p.release).push(p); }
const rels = [...byRel.keys()].sort((a, b) => b.localeCompare(a, "en", { numeric: true }));
for (const r of rels) {
  const ps = byRel.get(r);
  B.push(`## [Release ${r}](../releases/${kebab(r)}.md) <small>${ps.length} plan${ps.length === 1 ? "" : "s"}</small>`, "");
  for (const p of ps) {
    B.push(...head(p, { open: false, cls: "lrs-plan lrs-plan--row" }),
      `<div class="lrs-plan__facts" markdown>${facts(p)}</div>`, "", p.summary, "", "////", "");
  }
}
B.push("</div>", "");
fs.writeFileSync(path.join(docs, "test-plans", "variant-b.md"), B.join("\n"));

// ---- the document page with the metadata table folded away
const p = plans.find((x) => x.stem === "4855-merge-plan");
const orig = fs.readFileSync(path.join(docs, "test-plans", p.stem + ".md"), "utf8");
const metaTable = /<div class="doc-meta" markdown>\n\n([\s\S]*?)\n\n<\/div>\n/.exec(orig)[1];
const rest = orig.slice(orig.indexOf("[:material-open-in-new:"));
const D = orig.slice(0, orig.indexOf('<div class="doc-meta"')) +
  [`<div class="lrs-doc-facts" markdown>`, "",
    `${p.tools.map(pill).join(" ")}`, "",
    `Test plan · [Pro](../surfaces/pro.md) · [Roads & Highways](../products/roads-and-highways.md) · release [3.8](../releases/3-8.md) · edited *2026-08-01*{ .lrs-when } by [Mac Christmas](../people/mac-christmas.md)`, "",
    "</div>", "",
    "///// details | Details", "    attrs: {class: lrs-doc-meta}", "",
    "//// html | div.doc-meta", "", metaTable, "////", "/////", "",
  ].join("\n") + rest;
fs.writeFileSync(path.join(docs, "test-plans", p.stem + "-v.md"), D);




// ---- C: the checklist — the folded head, group dividers with counts in
// the source's casing, the case id a colour-coded badge in a gutter, the
// body hanging under the title with no box
{
  const src = fs.readFileSync(path.join(docs, "test-plans", p.stem + ".md"), "utf8");
  const foldedHead = D.slice(0, D.indexOf("[:material-open-in-new:"));
  const at = src.indexOf("\n## Test Cases");
  const between = src.slice(src.indexOf("[:material-open-in-new:"), at); // the Open button and the Summary
  const lines = src.slice(at).split("\n"); const out = []; let last = "";
  const groupOf = (i) => /\/\/\/ html \| div\.lrs-group\n\n(.+)\n/.exec(lines.slice(i, i + 8).join("\n"))?.[1] || "";
  const counts = new Map();
  for (let i = 0; i < lines.length; i++) if (/^### TC-/.test(lines[i])) { const g = groupOf(i); counts.set(g, (counts.get(g) || 0) + 1); }
  let total = 0, pos = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = /^### (TC-([A-Z])\d+) — (.+?) (\{ #[a-z0-9-]+ \})$/.exec(lines[i]);
    if (m) {
      total++; if (m[2] === "P") pos++;
      const g = groupOf(i);
      if (g && g !== last) { out.push(`<div class="lrs-group-head">${g} <small>${counts.get(g)} case${counts.get(g) === 1 ? "" : "s"}</small></div>`, ""); last = g; }
      out.push(`### <span class="lrs-tc lrs-tc--${m[2].toLowerCase()}">${m[1]}</span> ${m[3]} ${m[4]}`);
      continue;
    }
    out.push(lines[i]);
  }
  const body = out.join("\n").replace("## Test Cases\n", `## Test cases\n\n<p class="lrs-cases-count">${total} cases · ${pos} positive · ${total - pos} negative</p>\n`);
  fs.writeFileSync(path.join(docs, "test-plans", p.stem + "-c.md"), foldedHead + between + "\n///// html | div.lrs-c\n" + body + "\n/////\n");
}

// ---- the case-card suggestions: the rendered page, its body wrapped in a
// class the mock CSS scopes to (S1), and with group dividers inserted
// before the first case of each run (S2)
{
  const src = fs.readFileSync(path.join(docs, "test-plans", "4855-merge-plan.md"), "utf8");
  const at = src.indexOf("\n## Test Cases");
  const wrap = (cls, body) => src.slice(0, at) + `\n///// html | div.${cls}\n${body}\n/////\n`;
  fs.writeFileSync(path.join(docs, "test-plans", "4855-merge-plan-s1.md"), wrap("lrs-s1", src.slice(at)));
  // S2: a divider where the group changes; the groups are read off the cards
  const lines = src.slice(at).split("\n");
  const out = []; let last = "";
  for (let i = 0; i < lines.length; i++) {
    if (/^### TC-/.test(lines[i])) {
      const g = /\/\/\/ html \| div\.lrs-group\n\n(.+)\n/.exec(lines.slice(i, i + 8).join("\n"))?.[1] || "";
      if (g && g !== last) { out.push(`<div class="lrs-group-head">${g}</div>`, ""); last = g; }
    }
    out.push(lines[i]);
  }
  fs.writeFileSync(path.join(docs, "test-plans", "4855-merge-plan-s2.md"), wrap("lrs-s2", out.join("\n")));
}

// ---- CSS and JS the variations need (what wiki.mjs would gain)
fs.appendFileSync(path.join(docs, "stylesheets", "extra.css"), fs.readFileSync("variants.css", "utf8"));
fs.appendFileSync(path.join(docs, "javascripts", "tables.js"), fs.readFileSync("variants.js", "utf8"));

// ---- mkdocs.yml for the local build: the details plugin; no captions/panzoom (not installed here)
const yml = path.join(site, "work", "wiki", "mkdocs.yml");
let y = fs.readFileSync(yml, "utf8");
y = y.replace("  - markdown_captions\n", "").replace(/  - panzoom:\n(?:      .*\n)*/, "");
y = y.replace("  - pymdownx.blocks.admonition\n", "  - pymdownx.blocks.admonition\n  - pymdownx.blocks.details\n");
y = y.replace("          - test-plans/index.md\n", "          - test-plans/index.md\n          - \"Variant A\": test-plans/variant-a.md\n          - \"Variant B\": test-plans/variant-b.md\n          - \"Merge Events (folded meta)\": test-plans/4855-merge-plan-v.md\n          - \"Cases S1\": test-plans/4855-merge-plan-s1.md\n          - \"Cases S2\": test-plans/4855-merge-plan-s2.md\n          - \"Checklist\": test-plans/4855-merge-plan-c.md\n");
fs.writeFileSync(yml, y);
