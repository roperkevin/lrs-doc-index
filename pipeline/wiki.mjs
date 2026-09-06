#!/usr/bin/env node
/**
 * wiki.mjs v1.0 — the catalog as a wiki: every sidecar rendered into
 * an MkDocs site (one page per document, catalogs by kind / product /
 * release / person / keyword / issue, the test cases and figures,
 * what changed recently) and pushed to a git repository whose Pages
 * build serves it — a private devtopia repository, since this one is
 * public and the sidecars are internal.
 *
 * Reads the sidecar library the sweep maintains (`paths.sidecarLibrary`
 * — the OneDrive-synced folder, or the remote-files mirror) and,
 * when present, the newest `list-backup-*.json.gz` in `paths.workDir`
 * (the sweep's per-run list export) for the keyword canonical map and
 * the keyword kinds. Nothing here touches SharePoint or a model: it
 * is a pure render over files, so it runs after the nightly sweep on
 * the same machine, or anywhere the mirror exists.
 *
 * Output (`wiki.outDir`, default `<workDir>/wiki`):
 *   mkdocs.yml, .github/workflows/pages.yml, README.md
 *   docs/index.md                 the front page (counts, kinds, recent)
 *   docs/<kind>/index.md          one catalog table per kind
 *   docs/<kind>/<stem>.md         one page per document
 *   docs/media/<stem>/…           the media the bodies link (copied)
 *   docs/keywords/…, products/…, releases/…, people/…, issues/…
 *   docs/cases/index.md           every test case, by plan, anchored
 *   docs/figures/index.md         every figure, by document
 *   docs/recent.md, docs/about.md
 *
 * Bodies are rendered as they are in the sidecar (the same relative
 * `../media/<stem>/` links resolve, because pages sit one folder deep
 * and media is copied under docs/media); the metadata table's values
 * become links into the catalogs; the related list links the pages;
 * every HTML comment (rel markers, src provenance) is dropped.
 *
 * Usage:
 *   node --experimental-strip-types pipeline/wiki.mjs --config config.json            render only
 *   node --experimental-strip-types pipeline/wiki.mjs --config config.json --build    + `mkdocs build --strict`
 *   node --experimental-strip-types pipeline/wiki.mjs --config config.json --push     + commit and push to wiki.repoUrl
 *
 * Config (`wiki`, all optional except repoUrl for --push):
 *   outDir     where the site tree is written (default <workDir>/wiki)
 *   repoUrl    the git remote to push to (a devtopia repository URL;
 *              credentials come from the machine's git credential
 *              helper — nothing is stored in config)
 *   branch     the branch Pages builds from (default "main")
 *   siteName   the site title (default "LRS Doc Index")
 *   siteUrl    the published URL, for mkdocs.yml (default "")
 *   recent     rows on the Recent page (default 50)
 *   sourceSite the SharePoint site the Source links point at; only
 *              used for the About page text
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readMeta, metaTable, relEntries, relatedRegion } from "./lib/sidecarmeta.mjs";
import { createProgress, resolveProgress, secs, noProgress } from "./lib/progress.mjs";
import { bodySeamEnd } from "./lib/doclinks.mjs";
import { caseSpans } from "./lib/caseindex.mjs";
import { kebab, stemOf, mediaLinksOf } from "./lib/slug.mjs";
import { assertNodeVersion } from "./lib/config.mjs";
import { fmtDate } from "./lib/util.mjs";

export const WIKI_VERSION = "v1.0";

const KIND_FOLDERS = {
  "Test Plan": "Test Plans",
  "User Story": "User Stories",
  "Design Spike": "Design Spikes",
  "Data Template": "Data Templates",
  Schedule: "Schedules",
  "Doc Review": "Doc Reviews",
  Other: "Other",
};

// ---------------------------------------------------------------- text

/** python-markdown's toc slugify, so the case catalog's anchors are
 *  the ids MkDocs gives the headings. */
export function mkdocsSlug(text) {
  const ascii = String(text ?? "").normalize("NFKD").replace(/[^\x00-\x7f]/g, "");
  return ascii.replace(/[^\w\s-]/g, "").trim().toLowerCase().replace(/[-\s]+/g, "-");
}

/** python-markdown's toc `unique`: id, id_1, id_2 … */
export function uniqueSlug(id, taken) {
  let out = id;
  while (!out || taken.has(out)) {
    const m = /^(.*)_(\d+)$/.exec(out);
    out = m ? `${m[1]}_${Number(m[2]) + 1}` : `${out}_1`;
  }
  taken.add(out);
  return out;
}

const stripComments = (s) => String(s ?? "").replace(/<!--[\s\S]*?-->/g, "");
const cell = (s) => String(s ?? "").replace(/\r?\n/g, " ").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const mdEscape = (s) => String(s ?? "").replace(/([\\`*_[\]<>])/g, "\\$1");
const linkText = (s) => mdEscape(cell(s)).replace(/\\\|/g, "|");
const pageName = (s) => kebab(s) || "untitled";

/** `## Summary` paragraph(s) of a sidecar, "" when absent. */
function summaryOf(content) {
  const m = /^## Summary\s*\n([\s\S]*?)(?=\n## |\n<!-- related:begin -->|\n---\n|$)/m.exec(content);
  return m ? stripComments(m[1]).trim() : "";
}

/** The related bullets: [{doc, file, text}] — text is the bullet
 *  minus its link and marker (the "shared keywords" explanation). */
function relatedBullets(content) {
  const out = [];
  for (const ln of relatedRegion(content).split("\n")) {
    if (!ln.startsWith("- ")) continue;
    const mk = /<!-- rel:(\d+)(?:\s+s=[-\d.]+)?\s*-->/.exec(ln);
    const url = (/\]\(<?([^)>]*)>?\)/.exec(ln) || [])[1] || "";
    const title = (/^- \[([^\]]*)\]/.exec(ln) || [])[1] || "";
    const rest = stripComments(ln).replace(/^- \[[^\]]*\]\([^)]*\)\s*/, "").replace(/^—\s*/, "").trim();
    out.push({ doc: mk ? Number(mk[1]) : 0, file: url ? stemOf(url) + ".md" : "", title, text: rest });
  }
  return out;
}

/** The Issues cell's links: [{ref, url}]. */
function issueLinks(content) {
  const v = metaTable(content).get("Issues") || "";
  const out = [];
  const re = /\[([^\]]+)\]\(<?([^)>]+)>?\)/g;
  let m;
  while ((m = re.exec(v)) !== null) out.push({ ref: m[1], url: m[2] });
  return out;
}

// ---------------------------------------------------------------- inputs

/** Every sidecar under the library: kind folders and the root, `_`
 *  files (browse pages, status, manifest) excluded. */
export function readLibrary(libDir, kindFolders = KIND_FOLDERS) {
  const folderKind = new Map(Object.entries(kindFolders).map(([k, f]) => [f, k]));
  const docs = [];
  const dirs = [""].concat(Object.values(kindFolders));
  for (const rel of dirs) {
    const dir = rel ? path.join(libDir, rel) : libDir;
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      if (!name.toLowerCase().endsWith(".md") || name.startsWith("_")) continue;
      const file = path.join(dir, name);
      if (!fs.statSync(file).isFile()) continue;
      const content = fs.readFileSync(file, "utf8");
      const meta = readMeta(content);
      if (!meta.title && !meta.doc_id) continue;
      const kind = meta.doc_kind || folderKind.get(rel) || "Other";
      docs.push({ file, folder: rel, stem: name.replace(/\.md$/i, ""), content, meta, kind });
    }
  }
  return docs;
}

/** The newest list backup's keyword rows → { canonical: Map(alias→canonical), kinds: Map(title→kind) }. */
export function readKeywordMap(workDir) {
  const out = { canonical: new Map(), kinds: new Map(), file: "" };
  if (!workDir || !fs.existsSync(workDir)) return out;
  const files = fs.readdirSync(workDir).filter((f) => /^list-backup-.*\.json\.gz$/.test(f)).sort();
  if (!files.length) return out;
  const file = path.join(workDir, files[files.length - 1]);
  let data;
  try {
    data = JSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString("utf8"));
  } catch {
    return out;
  }
  const rows = (data?.lists?.keywords || []).map((it) => ({ id: Number(it.id), ...(it.fields || {}) }));
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const r of rows) {
    if (r.Kind) out.kinds.set(String(r.Title).toLowerCase(), String(r.Kind));
    const canon = r.CanonicalRefLookupId !== undefined && r.CanonicalRefLookupId !== null
      ? byId.get(Number(r.CanonicalRefLookupId)) : null;
    if (canon && canon.Title) out.canonical.set(String(r.Title).toLowerCase(), String(canon.Title));
  }
  out.file = file;
  return out;
}

// ---------------------------------------------------------------- model

/** Everything the pages need, from the sidecars alone. */
export function buildModel(docs, kw, opts = {}) {
  const kindFolders = opts.kindFolders || KIND_FOLDERS;
  const byId = new Map();
  const byFile = new Map();
  for (const d of docs) {
    d.kindDir = pageName(kindFolders[d.kind] || d.kind || "Other");
    d.page = `${d.kindDir}/${pageName(d.stem)}.md`;
    d.summary = summaryOf(d.content);
    const seam = bodySeamEnd(d.content);
    d.body = seam >= 0 ? d.content.slice(seam) : "";
    d.issues = issueLinks(d.content);
    d.keywords = d.meta.keywords.map((k) => kw.canonical.get(k.toLowerCase()) || k);
    d.media = mediaLinksOf(d.body);
    if (d.meta.doc_id) byId.set(d.meta.doc_id, d);
    byFile.set(d.stem + ".md", d);
  }
  for (const d of docs) {
    d.related = relatedBullets(d.content).map((b) => {
      const target = (b.doc && byId.get(b.doc)) || (b.file && byFile.get(b.file)) || null;
      return { ...b, target };
    });
    const entries = relEntries(d.content);
    for (const r of d.related) {
      const e = entries.find((x) => x.doc === r.doc);
      r.score = e ? e.s : 0;
    }
  }
  const group = (key) => {
    const m = new Map();
    for (const d of docs) for (const v of key(d)) {
      if (!v) continue;
      if (!m.has(v)) m.set(v, []);
      m.get(v).push(d);
    }
    return new Map([...m.entries()].sort((a, b) => a[0].localeCompare(b[0], "en")));
  };
  return {
    docs, byId,
    kinds: group((d) => [d.kind]),
    keywords: group((d) => [...new Set(d.keywords)]),
    tools: group((d) => d.meta.tools),
    products: group((d) => d.meta.products),
    releases: group((d) => [d.meta.target_release]),
    people: group((d) => [...new Set([d.meta.author, d.meta.pe, d.meta.dev].filter(Boolean))]),
    issues: group((d) => d.issues.map((i) => i.ref)),
    issueUrls: new Map(docs.flatMap((d) => d.issues.map((i) => [i.ref, i.url]))),
    keywordKinds: kw.kinds,
  };
}

/** Test cases of a plan body: [{ordinal, heading, anchor}] with the
 *  anchors MkDocs will give the headings. */
export function planCases(body) {
  const lines = String(body || "").replace(/\r\n?/g, "\n").split("\n");
  const taken = new Set();
  const anchorAt = new Map();
  for (let i = 0; i < lines.length; i++) {
    const hm = /^(#{1,6}) (.+)$/.exec(lines[i]);
    if (hm) anchorAt.set(i, uniqueSlug(mkdocsSlug(stripComments(hm[2])), taken));
  }
  return caseSpans(body).spans.map((s) => ({
    ordinal: s.ordinal,
    heading: stripComments(lines[s.start] || "").replace(/^#+\s*/, "").trim(),
    anchor: anchorAt.get(s.start) || "",
  }));
}

/** Figures of a body: [{alt, link, anchor, heading}], one per image link. */
export function bodyFigures(body) {
  const lines = String(body || "").replace(/\r\n?/g, "\n").split("\n");
  const taken = new Set();
  let heading = "", anchor = "";
  const out = [];
  let fence = false;
  for (const ln of lines) {
    if (/^```/.test(ln)) { fence = !fence; continue; }
    if (fence) continue;
    const hm = /^(#{1,6}) (.+)$/.exec(ln);
    if (hm) {
      heading = stripComments(hm[2]).trim();
      anchor = uniqueSlug(mkdocsSlug(heading), taken);
      continue;
    }
    const re = /!\[([^\]]*)\]\(<?(\.\.\/media\/[^)\s>]+)>?\)/g;
    let m;
    while ((m = re.exec(ln)) !== null) out.push({ alt: m[1], link: m[2], heading, anchor });
  }
  return out;
}

// ---------------------------------------------------------------- pages

const rel = (fromPage, toPage) => {
  const r = path.posix.relative(path.posix.dirname(fromPage), toPage);
  return r.startsWith(".") ? r : "./" + r;
};
const link = (fromPage, toPage, text) => `[${linkText(text)}](${rel(fromPage, toPage).replace(/ /g, "%20")})`;
const catalogPage = (section, value) => `${section}/${pageName(value)}.md`;

function docRow(fromPage, d) {
  const title = d.meta.title || d.stem;
  return `| ${link(fromPage, d.page, title)} | ${cell(d.meta.products.join(" · ")) || "—"} | ${cell(d.meta.target_release) || "—"} | ${cell(d.meta.last_edited).slice(0, 10) || "—"} | ${cell(d.summary).slice(0, 160) || "—"} |`;
}
const DOC_TABLE_HEAD = "| Document | Product | Release | Edited | Summary |\n|---|---|---|---|---|";
const byEdited = (a, b) => String(b.meta.last_edited).localeCompare(String(a.meta.last_edited));

function docTable(fromPage, docs) {
  return [DOC_TABLE_HEAD, ...docs.slice().sort(byEdited).map((d) => docRow(fromPage, d))].join("\n");
}

function docPage(d, model) {
  const p = d.page;
  const m = d.meta;
  const cat = (section, values) =>
    values.length ? values.map((v) => link(p, catalogPage(section, v), v)).join(" · ") : "—";
  const person = (name) => (name ? link(p, catalogPage("people", name), name) : "—");
  const source = m.source_url
    ? `[${linkText(m.source_file || "source")}](<${m.source_url}>)${m.doc_revision ? ` · rev ${cell(m.doc_revision)}` : ""}`
    : cell(m.source_file) || "—";
  const issues = d.issues.length
    ? d.issues.map((i) => `${link(p, catalogPage("issues", i.ref), i.ref)} ([open](${i.url}))`).join(" · ")
    : "—";
  const kindLink = link(p, `${d.kindDir}/index.md`, d.kind);
  const rows = [
    ["Doc", `${m.doc_id ?? "—"} · ${kindLink} · ${cell(m.surface) || "—"}`],
    ["Product", cat("products", m.products)],
    ["Release", m.target_release ? link(p, catalogPage("releases", m.target_release), m.target_release) : "—"],
    ["Issues", issues],
    ["Source", source],
    ["People", `author ${person(m.author)} · PE ${person(m.pe)} · dev ${person(m.dev)}`],
    ["Edited", cell(m.last_edited) ? `${cell(m.last_edited)}${m.last_edited_by ? ` by ${cell(m.last_edited_by)}` : ""}` : "—"],
    ["Extracted", [m.extracted, m.extraction_lane && `lane ${m.extraction_lane}`, m.format && `format ${m.format}`, m.prompt_version && `prompt ${m.prompt_version}`].filter(Boolean).map(cell).join(" · ") || "—"],
    ["Keywords", cat("keywords", [...new Set(d.keywords)])],
    ["Tools", cat("tools", m.tools)],
  ];
  const out = [`# ${mdEscape(m.title || d.stem)}`, "", "| Field | Value |", "| --- | --- |"];
  for (const [k, v] of rows) out.push(`| **${k}** | ${v} |`);
  out.push("");
  if (d.summary) out.push("## Summary", "", d.summary, "");
  if (d.related.length) {
    out.push("## Related documents", "");
    for (const r of d.related) {
      const target = r.target ? link(p, r.target.page, r.target.meta.title || r.title) : mdEscape(r.title);
      out.push(`- ${target}${r.text ? ` — ${r.text}` : ""}`);
    }
    out.push("");
  }
  const body = stripComments(d.body).replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
  if (body) out.push("---", "", body, "");
  return out.join("\n");
}

function catalogIndex(section, title, groups, intro, model, kindLabel) {
  const p = `${section}/index.md`;
  const out = [`# ${title}`, "", intro, "", "| " + kindLabel + " | Documents |", "|---|---|"];
  for (const [value, docs] of groups) {
    const extra = section === "keywords" && model.keywordKinds.get(value.toLowerCase())
      ? ` (${model.keywordKinds.get(value.toLowerCase())})` : "";
    out.push(`| ${link(p, catalogPage(section, value), value)}${extra} | ${docs.length} |`);
  }
  return out.join("\n") + "\n";
}

function catalogValuePage(section, value, docs, model) {
  const p = catalogPage(section, value);
  const byKind = new Map();
  for (const d of docs) {
    if (!byKind.has(d.kind)) byKind.set(d.kind, []);
    byKind.get(d.kind).push(d);
  }
  const out = [`# ${mdEscape(value)}`, "", `${docs.length} document${docs.length === 1 ? "" : "s"} · ${link(p, `${section}/index.md`, "all " + section)}`, ""];
  if (section === "issues" && model.issueUrls.get(value)) out.push(`Issue: <${model.issueUrls.get(value)}>`, "");
  for (const [kind, ds] of [...byKind.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    out.push(`## ${mdEscape(kind)}`, "", docTable(p, ds), "");
  }
  return out.join("\n");
}

function kindIndex(kind, docs, model, kindFolders) {
  const dir = pageName(kindFolders[kind] || kind);
  const p = `${dir}/index.md`;
  return [`# ${mdEscape(kindFolders[kind] || kind)}`, "", `${docs.length} document${docs.length === 1 ? "" : "s"}, newest edit first.`, "", docTable(p, docs), ""].join("\n");
}

function casesPage(model) {
  const p = "cases/index.md";
  const out = ["# Test cases", "", "Every test case the catalog's test plans carry, by plan (newest edit first); each row links the case's section on the plan's page.", ""];
  let total = 0;
  for (const d of (model.kinds.get("Test Plan") || []).slice().sort(byEdited)) {
    const cases = planCases(d.body);
    if (!cases.length) continue;
    total += cases.length;
    out.push(`## ${link(p, d.page, d.meta.title || d.stem)}`, "", "| # | Case |", "|---|---|");
    for (const c of cases) {
      const href = `${rel(p, d.page).replace(/ /g, "%20")}#${c.anchor}`;
      out.push(`| ${c.ordinal} | [${linkText(c.heading)}](${href}) |`);
    }
    out.push("");
  }
  out.splice(3, 0, `${total} cases.`);
  return out.join("\n");
}

function figuresPage(model) {
  const p = "figures/index.md";
  const out = ["# Figures", "", "Every image a sidecar body links, by document (newest edit first); each links the section it sits in.", ""];
  let total = 0;
  for (const d of model.docs.slice().sort(byEdited)) {
    const figs = bodyFigures(d.body);
    if (!figs.length) continue;
    total += figs.length;
    out.push(`## ${link(p, d.page, d.meta.title || d.stem)}`, "");
    for (const f of figs) {
      const img = f.link.replace(/^\.\.\//, "../").replace(/ /g, "%20");
      const href = `${rel(p, d.page).replace(/ /g, "%20")}#${f.anchor}`;
      out.push(`- [![${cell(f.alt)}](${img}){ width=160 }](${href}) ${f.heading ? `[${linkText(f.heading)}](${href})` : ""}`);
    }
    out.push("");
  }
  out.splice(3, 0, `${total} figures.`);
  return out.join("\n");
}

function recentPage(model, n) {
  const p = "recent.md";
  const docs = model.docs.slice().sort(byEdited).slice(0, n);
  return ["# Recent", "", `The ${docs.length} most recently edited source documents.`, "", docTable(p, docs), ""].join("\n");
}

function frontPage(model, kindFolders, opts) {
  const p = "index.md";
  const out = [`# ${mdEscape(opts.siteName)}`, "",
    `${model.docs.length} documents from the team library, one page each, rendered ${fmtDate(new Date().toISOString())} from the catalog's sidecars. Every page carries the document's metadata, its summary, its related documents and the extracted text; the Source row links the original file.`, "",
    "| Kind | Documents |", "|---|---|"];
  for (const [kind, docs] of model.kinds) out.push(`| ${link(p, `${pageName(kindFolders[kind] || kind)}/index.md`, kindFolders[kind] || kind)} | ${docs.length} |`);
  out.push("", "## Browse", "",
    `- ${link(p, "keywords/index.md", "Keywords")} (${model.keywords.size}) · ${link(p, "tools/index.md", "Tools")} (${model.tools.size}) · ${link(p, "products/index.md", "Products")} (${model.products.size}) · ${link(p, "releases/index.md", "Releases")} (${model.releases.size})`,
    `- ${link(p, "people/index.md", "People")} (${model.people.size}) · ${link(p, "issues/index.md", "Issues")} (${model.issues.size})`,
    `- ${link(p, "cases/index.md", "Test cases")} · ${link(p, "figures/index.md", "Figures")} · ${link(p, "recent.md", "Recent")} · ${link(p, "about.md", "About")}`, "");
  return out.join("\n");
}

function aboutPage(model, opts) {
  return ["# About this wiki", "",
    `Generated by \`pipeline/wiki.mjs ${WIKI_VERSION}\` of the LRS Doc Index pipeline from the catalog's sidecar files${opts.sourceSite ? ` (the LRS Doc Index library on ${opts.sourceSite})` : ""}. It is a rendering, not a source: edit nothing here — the next run overwrites every page. To change a document's classification, keywords or related documents, change it in the catalog (the Doc Index lists) and let the nightly sweep rewrite the sidecar.`, "",
    "- **Doc** ids are Doc Index list row ids (the id test-plan generation takes).",
    "- **Keywords** are the catalog's vocabulary after curation: an alias merged by the librarian lands on its canonical page.",
    "- **Related documents** are the sweep's ranking (shared issues, shared keywords, body similarity), newest ranking first.",
    "- **Test cases** and **Figures** are read from the sidecar bodies with the same parsers that fill the Test Cases and Figures lists.",
    "", `Rendered ${fmtDate(new Date().toISOString())} · ${model.docs.length} documents.`, ""].join("\n");
}

// ---------------------------------------------------------------- site

function mkdocsYml(model, kindFolders, opts) {
  const y = (s) => JSON.stringify(String(s));
  const nav = [`  - Home: index.md`];
  for (const [kind] of model.kinds) nav.push(`  - ${y(kindFolders[kind] || kind)}: ${pageName(kindFolders[kind] || kind)}/index.md`);
  for (const [t, s] of [["Keywords", "keywords"], ["Tools", "tools"], ["Products", "products"], ["Releases", "releases"], ["People", "people"], ["Issues", "issues"], ["Test cases", "cases"], ["Figures", "figures"]]) nav.push(`  - ${t}: ${s}/index.md`);
  nav.push("  - Recent: recent.md", "  - About: about.md");
  return [
    `site_name: ${y(opts.siteName)}`,
    opts.siteUrl ? `site_url: ${y(opts.siteUrl)}` : "",
    "docs_dir: docs",
    "theme:",
    "  name: material",
    "  features: [navigation.sections, navigation.top, search.suggest, search.highlight, content.tabs.link, toc.follow]",
    "  palette:",
    "    - scheme: default",
    "      toggle: { icon: material/brightness-7, name: Dark }",
    "    - scheme: slate",
    "      toggle: { icon: material/brightness-4, name: Light }",
    "plugins:",
    "  - search",
    "markdown_extensions:",
    "  - tables",
    "  - attr_list",
    "  - admonition",
    "  - fenced_code",
    "  - toc:",
    "      permalink: true",
    "nav:",
    ...nav,
    "not_in_nav: |",
    "  /*/*.md",
    "",
  ].filter((l) => l !== "").join("\n");
}

const PAGES_WORKFLOW = `name: pages
on:
  push:
    branches: [BRANCH]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install mkdocs-material
      - run: mkdocs build --strict
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
`;

const WIKI_README = (opts) => `# ${opts.siteName}

A generated MkDocs site: every page is rendered from the LRS Doc Index catalog by \`pipeline/wiki.mjs\` and overwritten on the next run. Do not edit here.

Local preview: \`pip install mkdocs-material && mkdocs serve\`.
Publishing: the \`pages\` workflow builds the site on every push to \`${opts.branch}\` and deploys it to this repository's GitHub Pages (Settings → Pages → Source: GitHub Actions, once).
`;

function rmDocs(outDir) {
  const docs = path.join(outDir, "docs");
  if (fs.existsSync(docs)) fs.rmSync(docs, { recursive: true, force: true });
}

function write(outDir, relPath, text) {
  const file = path.join(outDir, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

/** Render the whole site tree. Returns the summary counters. */
export function renderSite(cfg, libDir, workDir, outDir, prog = noProgress) {
  const w = cfg.wiki || {};
  const opts = {
    siteName: w.siteName || "LRS Doc Index",
    siteUrl: w.siteUrl || "",
    branch: w.branch || "main",
    recent: Number(w.recent) || 50,
    sourceSite: w.sourceSite || cfg.sweep?.siteUrl || "",
  };
  const kindFolders = { ...KIND_FOLDERS, ...(cfg.sweep?.kindFolders || {}) };
  const readPhase = prog.phase("read");
  const docs = readLibrary(libDir, kindFolders);
  const kw = readKeywordMap(workDir);
  const model = buildModel(docs, kw, { kindFolders });
  readPhase.done(
    `${docs.length} sidecar(s) from ${libDir}, ${model.kinds.size} kind(s), ` +
    `${model.keywords.size} keyword(s)` +
    (kw.file ? `, list backup ${path.basename(kw.file)} (${kw.canonical.size} alias(es) merged)` : ", no list backup")
  );

  const renderPhase = prog.phase("render");
  rmDocs(outDir);
  const docsDir = path.join(outDir, "docs");
  fs.mkdirSync(docsDir, { recursive: true });
  let pages = 0, mediaFiles = 0, mediaMissing = 0;
  const put = (relPath, text) => { write(docsDir, relPath, text); pages++; };

  const docTick = prog.counter(docs.length, "document pages");
  for (const d of docs) {
    put(d.page, docPage(d, model));
    docTick(d.page, `${d.media.length} media file(s)`);
    for (const m of d.media) {
      const src = path.join(libDir, "media", m.dir, m.legacyPrefix ? m.legacyPrefix + m.name : m.name);
      const dst = path.join(docsDir, "media", m.dir, m.legacyPrefix ? m.legacyPrefix + m.name : m.name);
      if (!fs.existsSync(src)) { mediaMissing++; continue; }
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
      mediaFiles++;
    }
  }
  renderPhase.step(`${mediaFiles} media file(s) copied, ${mediaMissing} missing — now the catalogs`);
  for (const [kind, ds] of model.kinds) put(`${pageName(kindFolders[kind] || kind)}/index.md`, kindIndex(kind, ds, model, kindFolders));
  const catalogs = [
    ["keywords", "Keywords", model.keywords, "The catalog's vocabulary, canonical terms only, with the documents each one tags.", "Keyword"],
    ["tools", "Tools", model.tools, "Official tool names the documents mention.", "Tool"],
    ["products", "Products", model.products, "Product lines, as detected from names and text.", "Product"],
    ["releases", "Releases", model.releases, "Target releases the documents state.", "Release"],
    ["people", "People", model.people, "Authors, product engineers and developers named on the documents.", "Person"],
    ["issues", "Issues", model.issues, "devtopia issues the documents reference.", "Issue"],
  ];
  for (const [section, title, groups, intro, label] of catalogs) {
    put(`${section}/index.md`, catalogIndex(section, title, groups, intro, model, label));
    for (const [value, ds] of groups) put(catalogPage(section, value), catalogValuePage(section, value, ds, model));
    renderPhase.step(`${section} — ${groups.size} page(s)`);
  }
  put("cases/index.md", casesPage(model));
  put("figures/index.md", figuresPage(model));
  put("recent.md", recentPage(model, opts.recent));
  put("about.md", aboutPage(model, opts));
  put("index.md", frontPage(model, kindFolders, opts));
  write(outDir, "mkdocs.yml", mkdocsYml(model, kindFolders, opts));
  write(outDir, ".github/workflows/pages.yml", PAGES_WORKFLOW.replace("BRANCH", opts.branch));
  write(outDir, "README.md", WIKI_README(opts));
  write(outDir, ".gitignore", "site/\n");
  renderPhase.done(`${pages} page(s) and ${mediaFiles} media file(s) written to ${outDir}`);
  return {
    docs: docs.length, kinds: model.kinds.size, keywords: model.keywords.size,
    keyword_aliases_merged: kw.canonical.size, pages, media_files: mediaFiles, media_missing: mediaMissing,
    list_backup: kw.file ? path.basename(kw.file) : "",
  };
}

// ---------------------------------------------------------------- build / push

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8" });
  if (r.error) throw new Error(`${cmd}: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed (${r.status}): ${(r.stderr || r.stdout || "").trim().slice(-800)}`);
  return (r.stdout || "").trim();
}

/** `mkdocs build --strict` in outDir (mkdocs on PATH). */
export function buildSite(outDir) {
  return run("mkdocs", ["build", "--strict"], outDir);
}

/** Commit the tree and push it to `repoUrl` (`branch`). The .git
 *  directory persists between runs, so pushes are incremental. */
export function pushSite(outDir, repoUrl, branch, message) {
  if (!repoUrl) throw new Error("wiki.repoUrl is not set — the git remote the site is pushed to (a private devtopia repository)");
  const git = (...a) => run("git", a, outDir);
  if (!fs.existsSync(path.join(outDir, ".git"))) {
    git("init", "-q", "-b", branch);
  }
  git("checkout", "-q", "-B", branch);
  try { git("remote", "set-url", "origin", repoUrl); } catch { git("remote", "add", "origin", repoUrl); }
  git("add", "-A");
  const status = git("status", "--porcelain");
  let committed = false;
  if (status) {
    git("-c", "user.name=LRS Doc Index", "-c", "user.email=lrs-doc-index@localhost", "commit", "-q", "-m", message);
    committed = true;
  }
  git("push", "-u", "origin", branch);
  return { committed, head: git("rev-parse", "--short", "HEAD") };
}

// ---------------------------------------------------------------- CLI

function loadConfig(argv) {
  const args = { flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") args.config = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--build") args.flags.build = true;
    else if (a === "--push") args.flags.push = true;
    else if (a === "--progress") args.flags.progress = true;
    else if (a === "--no-progress") args.flags.noProgress = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.config) throw new Error("usage: wiki.mjs --config <config.json> [--out <dir>] [--build] [--push] [--progress|--no-progress]");
  assertNodeVersion();
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  if (!cfg.paths?.sidecarLibrary) throw new Error(`${args.config}: paths.sidecarLibrary is required`);
  cfg.wiki = cfg.wiki || {};
  cfg._out = args.out || cfg.wiki.outDir || path.join(cfg.paths.workDir || ".", "wiki");
  cfg._build = !!args.flags.build;
  cfg._push = !!args.flags.push;
  cfg._progress = resolveProgress(cfg.progress, {
    on: args.flags.progress, off: args.flags.noProgress,
  });
  return cfg;
}

async function main() {
  const cfg = loadConfig(process.argv.slice(2));
  const libDir = cfg.paths.sidecarLibrary;
  if (!fs.existsSync(libDir)) throw new Error(`sidecar library not found: ${libDir}`);
  const t0 = Date.now();
  const prog = createProgress({ enabled: cfg._progress });
  prog(
    `wiki ${WIKI_VERSION} — ${libDir} -> ${cfg._out}` +
    `${cfg._build ? ", mkdocs build" : ""}${cfg._push ? ", push" : ""}`
  );
  const summary = { version: WIKI_VERSION, out: cfg._out, ...renderSite(cfg, libDir, cfg.paths.workDir, cfg._out, prog) };
  process.stderr.write(`wiki: ${summary.docs} documents → ${summary.pages} pages, ${summary.media_files} media files (${cfg._out})\n`);
  if (cfg._build) {
    const buildPhase = prog.phase("mkdocs build --strict");
    const stopBuild = prog.heartbeat("waiting on mkdocs");
    try {
      buildSite(cfg._out);
    } finally {
      stopBuild();
    }
    summary.built = true;
    buildPhase.done("ok");
    process.stderr.write("wiki: mkdocs build --strict ok\n");
  }
  if (cfg._push) {
    const pushPhase = prog.phase("push");
    pushPhase.step(`${cfg.wiki.repoUrl || "(wiki.repoUrl unset)"} branch ${cfg.wiki.branch || "main"}`);
    const stopPush = prog.heartbeat("waiting on git");
    let r;
    try {
      r = pushSite(cfg._out, cfg.wiki.repoUrl, cfg.wiki.branch || "main",
        `wiki ${new Date().toISOString().slice(0, 10)} — ${summary.docs} documents, ${summary.pages} pages`);
    } finally {
      stopPush();
    }
    pushPhase.done(`${r.head}${r.committed ? "" : " (no changes to commit)"}`);
    summary.pushed = true;
    summary.committed = r.committed;
    summary.head = r.head;
    process.stderr.write(`wiki: pushed ${r.head} to ${cfg.wiki.repoUrl}${r.committed ? "" : " (no changes)"}\n`);
  }
  summary.seconds = Math.round((Date.now() - t0) / 1000);
  prog(`wiki finished in ${secs(Date.now() - t0)}`);
  process.stdout.write(JSON.stringify(summary) + "\n");
  process.stdout.write(`Wiki_summary: docs=${summary.docs} pages=${summary.pages} media=${summary.media_files} built=${summary.built ? 1 : 0} pushed=${summary.pushed ? 1 : 0}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    process.stderr.write(`wiki: ${e.message}\n`);
    process.exit(1);
  });
}
