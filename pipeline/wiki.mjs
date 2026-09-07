#!/usr/bin/env node
/**
 * wiki.mjs v1.4 — the catalog as a wiki: every sidecar rendered into
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
 * Bodies keep their sidecar shape (the same relative
 * `../media/<stem>/` links resolve, because pages sit one folder deep
 * and media is copied under docs/media); the metadata table's values
 * become links into the catalogs; the related list links the pages;
 * every HTML comment (rel markers, src provenance) is dropped.
 *
 * v1.3 (Markdown_Layout_Plan.md phase 5) — with `wiki.draftsDir` set,
 * the Test Plan Drafts folder is published too: one page per draft
 * plus a Drafts catalog, off by default. A draft is a document in the
 * same skeleton every sidecar carries, so `readMeta` reads one; but a
 * draft is unreviewed machine output, so it joins NO catalog — not
 * kinds, not keywords, not test cases — and its page says so.
 *
 * v1.4 (figure presentation) — the corpus's pictures get the three
 * reader affordances the raw site never had. `mkdocs.yml` gains
 * `markdown_captions` (a body image renders as `<figure>` with its alt
 * text as a visible `<figcaption>` — the figure index's own
 * `Figure N — <title>` alt texts become the captions for free),
 * `glightbox` (click a picture, get it full size over the page) and
 * `panzoom` (alt-drag to pan, alt-scroll to zoom, with a full-screen
 * button — for the wide route-measure and matrix figures that do not
 * fit a column). The Pages workflow installs all three.
 *
 * The figure catalog's THUMBNAILS are emitted as raw HTML instead of
 * `[![alt](img){ width=160 }](href)` markdown: markdown_captions turns
 * a markdown image into a `<figure>`, which cannot live inside a link
 * — the anchor came out empty and the figure escaped it, losing the
 * link into the case section — and `{ width=160 }` landed on the
 * `<figure>` instead of sizing the image. Raw HTML is invisible to
 * both markdown extensions, so a thumbnail keeps its link, its width
 * and its alt, and stays free of caption and pan/zoom chrome; body
 * images, which are what the affordances are for, are unaffected.
 * (`mkdocs-img2fig-plugin` is the other captioner in the MkDocs
 * catalog and is NOT usable here: it regex-rewrites raw markdown in
 * `on_page_markdown`, so it mangles `![...](...)` inside fenced code
 * blocks — `docs/design/Figure_Index_Plan.md` documents the SC-4 link
 * shape in one — and it captures the angle-bracket link form
 * `![alt](<path with spaces>)` brackets and all, producing a broken
 * `src`.)
 *
 * v1.2 (phase 4) — the page's metadata table follows format 3.1: the
 * identity and the provenance always print, a row the document has
 * nothing to say in does not.
 *
 * v1.1 (Markdown_Layout_Plan.md phase 2) — the page is a RENDER of the
 * sidecar, not a copy of it. Sidecars are GitHub-flavored markdown;
 * MkDocs Material is the one consumer that cannot read that dialect,
 * so `lib/mdlayout.mjs` translates on the way in: GFM alerts become
 * admonition blocks, a `<placeholder>` or a trailing `{brace}` run out
 * of a source document is escaped instead of being swallowed by
 * python-markdown and attr_list, and `<br>`, autolinks and code spans
 * are left alone. `mkdocs.yml` gains `pymdownx.tasklist` (the drafts'
 * task lists) and `sane_lists`. Two things that never reached a page
 * now do: the whole `## Summary` (the v1.0 reader ended its match on
 * the `m`-flag `$`, i.e. at the first line break) and the sweep's
 * `docs:begin/end` region, which sits above the body seam and so was
 * in neither the header nor the body.
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
import { toMkDocs, normalize, splitAnchor } from "./lib/mdlayout.mjs";
import { assertNodeVersion } from "./lib/config.mjs";
import { fmtDate } from "./lib/util.mjs";

export const WIKI_VERSION = "v1.3";

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

/** A heading's id the way MkDocs assigns it: the explicit `{ #id }`
 *  when the heading carries one (attr_list is enabled), else the toc
 *  slug with the duplicate suffix. `text` is what the page shows. */
export function headingId(headingText, taken) {
  const { text, id } = splitAnchor(stripComments(headingText).trim());
  if (id) { taken.add(id); return { text: text.trim(), id }; }
  return { text: text.trim(), id: uniqueSlug(mkdocsSlug(text), taken) };
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
/** One value inside a double-quoted HTML attribute (v1.4, the figure
 *  catalog's raw-HTML thumbnails). */
const attr = (s) => cell(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const mdEscape = (s) => String(s ?? "").replace(/([\\`*_[\]<>])/g, "\\$1");
const linkText = (s) => mdEscape(cell(s)).replace(/\\\|/g, "|");
const pageName = (s) => kebab(s) || "untitled";

/** `## Summary` paragraph(s) of a sidecar, "" when absent. v1.1: cut
 *  at the next section marker or the end of the file — the previous
 *  regex ended its lazy match on the `m`-flag `$`, i.e. at the first
 *  line break, so a multi-line summary (and the missing-summary
 *  alert's second line) never reached the page. */
function summaryOf(content) {
  const s = String(content || "");
  const m = /^## Summary[ \t]*\r?\n/m.exec(s);
  if (!m) return "";
  const from = m.index + m[0].length;
  const ends = ["\n## ", "\n<!-- related:begin -->", "\n---\n", "\n<!-- docs:begin -->"]
    .map((d) => s.indexOf(d, from))
    .filter((i) => i >= 0);
  const to = ends.length ? Math.min(...ends) : s.length;
  return stripComments(s.slice(from, to)).trim();
}

/** The `docs:begin/end` region's markdown ("" when absent): the
 *  sweep's per-document Esri documentation links. v1.1 — it sits
 *  between the related region and the `---` seam, so `bodySeamEnd`
 *  leaves it out of the body and it reached no page at all. */
function docsRegionOf(content) {
  const s = String(content || "");
  const b = s.indexOf("<!-- docs:begin -->");
  const e = s.indexOf("<!-- docs:end -->", b + 1);
  if (b < 0 || e < 0) return "";
  return s.slice(b + "<!-- docs:begin -->".length, e).trim();
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

/**
 * The Test Plan Drafts folder as pages (Markdown_Layout_Plan phase 5,
 * `wiki.draftsDir`). A draft is a document in the same skeleton every
 * sidecar carries, so `readMeta` reads one — which is what makes this
 * possible at all. Newest first, by the file name's own timestamp;
 * drafts are NOT catalog documents (they are unreviewed machine
 * output), so they never join the kind/keyword/case catalogs.
 */
export function readDrafts(draftsDir) {
  if (!draftsDir || !fs.existsSync(draftsDir)) return [];
  const out = [];
  for (const name of fs.readdirSync(draftsDir).sort()) {
    if (!name.toLowerCase().endsWith(".md") || name.startsWith("_")) continue;
    const file = path.join(draftsDir, name);
    if (!fs.statSync(file).isFile()) continue;
    const content = fs.readFileSync(file, "utf8");
    const meta = readMeta(content);
    // only a phase-5 draft: a Generated row, and no Doc Index row id
    if (!meta.generated || meta.doc_id) continue;
    const stem = name.replace(/\.md$/i, "");
    const st = /--draft-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})/.exec(stem);
    out.push({
      file, stem, content, meta,
      page: `drafts/${pageName(stem)}.md`,
      when: st ? `${st[1]}-${st[2]}-${st[3]} ${st[4]}:${st[5]}` : "",
    });
  }
  return out.sort((a, b) => String(b.when).localeCompare(String(a.when)));
}

function draftPage(d, model) {
  const m = d.meta;
  // the Source row is the story SIDECAR's url — resolve it to the
  // story's own page when the corpus has it, else leave the link
  const storyFile = m.source_url
    ? decodeURIComponent(String(m.source_url).split("/").pop() || "") : "";
  const target = storyFile ? model.byFile.get(storyFile) : null;
  const story = target
    ? link(d.page, target.page, target.meta.title || m.source_file || "the story")
    : m.source_url ? `[${linkText(m.source_file || "the story")}](<${m.source_url}>)` : "—";
  const rows = [
    ["Doc", `draft · ${cell(m.doc_kind) || "Test Plan"} · ${cell(m.surface) || "—"}`],
    ["Status", cell(m.status) || "—"],
    ["Source", story],
    ["Generated", cell(m.generated) || "—"],
  ];
  const out = [`# ${mdEscape(m.title || d.stem)}`, "", "| Field | Value |", "| --- | --- |"];
  for (const [k, v] of rows) out.push(`| **${k}** | ${v} |`);
  out.push("");
  // everything under the draft's own metadata table — the callouts
  // included; "unreviewed" is the most important thing on the page —
  // translated for MkDocs like any other body
  let bodyAt = 0;
  for (const m of d.content.matchAll(/^\| \*\*[A-Za-z]+\*\* \|.*\|$/gm)) bodyAt = m.index + m[0].length;
  const body = normalize(toMkDocs(stripComments(d.content.slice(bodyAt))));
  if (body) out.push("---", "", body, "");
  return out.join("\n");
}

function draftsIndex(drafts) {
  const p = "drafts/index.md";
  const out = ["# Test-plan drafts", "",
    "Machine-generated test-plan drafts, newest first — **unreviewed**: " +
    "every case and every [VERIFY] item still needs a Product Engineer. " +
    "They are not catalog documents and do not appear in the kind, " +
    "keyword or test-case catalogs.", "",
    "| Draft | Generated | Status | From |", "|---|---|---|---|"];
  for (const d of drafts) {
    out.push(
      `| ${link(p, d.page, d.meta.title || d.stem)} | ${cell(d.when) || "—"} | ` +
      `${cell(d.meta.status) || "—"} | ${cell(d.meta.source_file) || "—"} |`
    );
  }
  return out.join("\n") + "\n";
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
    d.docsRegion = docsRegionOf(d.content);
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
    docs, byId, byFile,
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
  const headAt = new Map();
  for (let i = 0; i < lines.length; i++) {
    const hm = /^(#{1,6}) (.+)$/.exec(lines[i]);
    if (!hm) continue;
    const h = headingId(hm[2], taken);
    anchorAt.set(i, h.id);
    headAt.set(i, h.text);
  }
  return caseSpans(body).spans.map((s) => ({
    ordinal: s.ordinal,
    heading: headAt.get(s.start) || "",
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
      const h = headingId(hm[2], taken);
      heading = h.text;
      anchor = h.id;
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
  // format 3.1 (Markdown_Layout_Plan phase 4): the identity and the
  // provenance always print; a row the document has nothing to say in
  // is not printed as `—`
  const people = [
    m.author && `author ${person(m.author)}`,
    m.pe && `PE ${person(m.pe)}`,
    m.dev && `dev ${person(m.dev)}`,
  ].filter(Boolean).join(" · ");
  const rows = [
    ["Doc", `${m.doc_id ?? "—"} · ${kindLink} · ${cell(m.surface) || "—"}`, true],
    ["Status", cell(m.status), true],
    ["Product", m.products.length ? cat("products", m.products) : ""],
    ["Release", m.target_release ? link(p, catalogPage("releases", m.target_release), m.target_release) : ""],
    ["Issues", d.issues.length ? issues : ""],
    ["Source", source, true],
    ["People", people],
    ["Edited", cell(m.last_edited) ? `${cell(m.last_edited)}${m.last_edited_by ? ` by ${cell(m.last_edited_by)}` : ""}` : ""],
    ["Extracted", [m.extracted, m.extraction_lane && `lane ${m.extraction_lane}`, m.format && `format ${m.format}`, m.prompt_version && `prompt ${m.prompt_version}`].filter(Boolean).map(cell).join(" · "), true],
    ["Generated", cell(m.generated)],
    ["Keywords", d.keywords.length ? cat("keywords", [...new Set(d.keywords)]) : ""],
    ["Tools", m.tools.length ? cat("tools", m.tools) : ""],
  ];
  const out = [`# ${mdEscape(m.title || d.stem)}`, "", "| Field | Value |", "| --- | --- |"];
  for (const [k, v, always] of rows) {
    if (!always && (v === "" || v === "—")) continue;
    out.push(`| **${k}** | ${v === "" ? "—" : v} |`);
  }
  out.push("");
  if (d.summary) out.push("## Summary", "", normalize(toMkDocs(d.summary)), "");
  if (d.related.length) {
    out.push("## Related documents", "");
    for (const r of d.related) {
      const target = r.target ? link(p, r.target.page, r.target.meta.title || r.title) : mdEscape(r.title);
      out.push(`- ${target}${r.text ? ` — ${r.text}` : ""}`);
    }
    out.push("");
  }
  if (d.docsRegion) out.push(normalize(toMkDocs(stripComments(d.docsRegion))), "");
  const body = normalize(toMkDocs(stripComments(d.body)));
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
      // raw HTML, not `[![alt](img){ width=160 }](href)`: markdown_captions
      // (v1.4) would turn the image into a <figure>, which cannot sit
      // inside a link — the anchor empties and the figure escapes it —
      // and would move `width=160` onto the <figure>. Raw HTML keeps the
      // link, the width and the alt, and takes no caption or panzoom box.
      out.push(`- <a href="${attr(href)}"><img src="${attr(img)}" width="160" alt="${attr(f.alt)}"></a> ${f.heading ? `[${linkText(f.heading)}](${href})` : ""}`);
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

function frontPage(model, kindFolders, opts, draftCount = 0) {
  const p = "index.md";
  const out = [`# ${mdEscape(opts.siteName)}`, "",
    `${model.docs.length} documents from the team library, one page each, rendered ${fmtDate(new Date().toISOString())} from the catalog's sidecars. Every page carries the document's metadata, its summary, its related documents and the extracted text; the Source row links the original file.`, "",
    "| Kind | Documents |", "|---|---|"];
  for (const [kind, docs] of model.kinds) out.push(`| ${link(p, `${pageName(kindFolders[kind] || kind)}/index.md`, kindFolders[kind] || kind)} | ${docs.length} |`);
  out.push("", "## Browse", "",
    `- ${link(p, "keywords/index.md", "Keywords")} (${model.keywords.size}) · ${link(p, "tools/index.md", "Tools")} (${model.tools.size}) · ${link(p, "products/index.md", "Products")} (${model.products.size}) · ${link(p, "releases/index.md", "Releases")} (${model.releases.size})`,
    `- ${link(p, "people/index.md", "People")} (${model.people.size}) · ${link(p, "issues/index.md", "Issues")} (${model.issues.size})`,
    `- ${link(p, "cases/index.md", "Test cases")} · ${link(p, "figures/index.md", "Figures")} · ${link(p, "recent.md", "Recent")} · ${link(p, "about.md", "About")}` +
      (draftCount ? `\n- ${link(p, "drafts/index.md", "Test-plan drafts")} (${draftCount}) — machine-generated, unreviewed` : ""), "");
  return out.join("\n");
}

function aboutPage(model, opts) {
  return ["# About this wiki", "",
    `Generated by \`pipeline/wiki.mjs ${WIKI_VERSION}\` of the LRS Doc Index pipeline from the catalog's sidecar files${opts.sourceSite ? ` (the LRS Doc Index library on ${opts.sourceSite})` : ""}. It is a rendering, not a source: edit nothing here — the next run overwrites every page. To change a document's classification, keywords or related documents, change it in the catalog (the Doc Index lists) and let the nightly sweep rewrite the sidecar.`, "",
    "- **Doc** ids are Doc Index list row ids (the id test-plan generation takes).",
    "- **Keywords** are the catalog's vocabulary after curation: an alias merged by the librarian lands on its canonical page.",
    "- **Related documents** are the sweep's ranking (shared issues, shared keywords, body similarity), newest ranking first.",
    "- **Test cases** and **Figures** are read from the sidecar bodies with the same parsers that fill the Test Cases and Figures lists.",
    "- **Test-plan drafts**, when the site publishes them, are machine-generated and unreviewed: they are not catalog documents and join no catalog.",
    "", `Rendered ${fmtDate(new Date().toISOString())} · ${model.docs.length} documents.`, ""].join("\n");
}

// ---------------------------------------------------------------- site

function mkdocsYml(model, kindFolders, opts, draftCount = 0) {
  const y = (s) => JSON.stringify(String(s));
  const nav = [`  - Home: index.md`];
  for (const [kind] of model.kinds) nav.push(`  - ${y(kindFolders[kind] || kind)}: ${pageName(kindFolders[kind] || kind)}/index.md`);
  for (const [t, s] of [["Keywords", "keywords"], ["Tools", "tools"], ["Products", "products"], ["Releases", "releases"], ["People", "people"], ["Issues", "issues"], ["Test cases", "cases"], ["Figures", "figures"]]) nav.push(`  - ${t}: ${s}/index.md`);
  if (draftCount) nav.push("  - Drafts: drafts/index.md");
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
    "  - glightbox",
    "  - panzoom:",
    // the plugin's own `images: true` is read off the GLOBAL config by
    // mkdocs-panzoom-plugin 0.5.2 (plugin.py: `config.get("images")`,
    // not `self.config`), so it never fires; include_selectors is read
    // correctly. Its matcher takes element/class selectors only — an
    // attribute selector such as img[src$=".svg"] silently matches
    // nothing — so pan/zoom goes on every body image.
    '      include_selectors: ["img"]',
    "      full_screen: true",
    "markdown_extensions:",
    "  - tables",
    "  - markdown_captions",
    "  - attr_list",
    "  - admonition",
    "  - fenced_code",
    "  - sane_lists",
    "  - pymdownx.tasklist:",
    "      custom_checkbox: true",
    "  - toc:",
    "      permalink: true",
    '      toc_depth: "2-3"',
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
      - run: pip install mkdocs-material mkdocs-glightbox mkdocs-panzoom-plugin markdown-captions
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

Local preview: \`pip install mkdocs-material mkdocs-glightbox mkdocs-panzoom-plugin markdown-captions && mkdocs serve\`.
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
    draftsDir: w.draftsDir || "",
  };
  const kindFolders = { ...KIND_FOLDERS, ...(cfg.sweep?.kindFolders || {}) };
  const readPhase = prog.phase("read");
  const docs = readLibrary(libDir, kindFolders);
  const kw = readKeywordMap(workDir);
  const model = buildModel(docs, kw, { kindFolders });
  const drafts = readDrafts(opts.draftsDir);
  readPhase.done(
    `${docs.length} sidecar(s) from ${libDir}, ${model.kinds.size} kind(s), ` +
    `${model.keywords.size} keyword(s)` +
    (kw.file ? `, list backup ${path.basename(kw.file)} (${kw.canonical.size} alias(es) merged)` : ", no list backup") +
    (opts.draftsDir ? `, ${drafts.length} draft(s) from ${opts.draftsDir}` : "")
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
  if (drafts.length) {
    for (const d of drafts) put(d.page, draftPage(d, model));
    put("drafts/index.md", draftsIndex(drafts));
    renderPhase.step(`drafts — ${drafts.length} page(s)`);
  }
  put("cases/index.md", casesPage(model));
  put("figures/index.md", figuresPage(model));
  put("recent.md", recentPage(model, opts.recent));
  put("about.md", aboutPage(model, opts));
  put("index.md", frontPage(model, kindFolders, opts, drafts.length));
  write(outDir, "mkdocs.yml", mkdocsYml(model, kindFolders, opts, drafts.length));
  write(outDir, ".github/workflows/pages.yml", PAGES_WORKFLOW.replace("BRANCH", opts.branch));
  write(outDir, "README.md", WIKI_README(opts));
  write(outDir, ".gitignore", "site/\n");
  renderPhase.done(`${pages} page(s) and ${mediaFiles} media file(s) written to ${outDir}`);
  return {
    docs: docs.length, drafts: drafts.length,
    kinds: model.kinds.size, keywords: model.keywords.size,
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
