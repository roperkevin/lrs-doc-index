#!/usr/bin/env node
/**
 * wiki.mjs v2.1 — the catalog as a wiki: every sidecar rendered into
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
 *   docs/index.md                 the front page (kinds, recent, browse)
 *   docs/documents/index.md       every document in one filterable table
 *   docs/<kind>/index.md          one catalog table per kind
 *   docs/<kind>/<stem>.md         one page per document
 *   docs/media/<stem>/…           the media the bodies link (copied)
 *   docs/browse/index.md          the catalogs, as cards
 *   docs/keywords/…, products/…, releases/…, people/…, issues/…
 *   docs/cases/index.md           every test case, by plan, anchored
 *   docs/figures/index.md         every figure, by document
 *   docs/recent.md, docs/about.md
 *   docs/stylesheets/extra.css  the site's own styling (v1.4, v2.1)
 *   docs/javascripts/tables.js  sort, filter and link behaviour (v1.7, v2.0)
 *
 * Bodies keep their sidecar shape (the same relative
 * `../media/<stem>/` links resolve, because pages sit one folder deep
 * and media is copied under docs/media); the metadata table's values
 * become links into the catalogs; the related list links the pages;
 * every HTML comment (rel markers, src provenance) is dropped.
 *
 * v2.1 — the pages dressed by content type
 * (https://squidfunk.github.io/mkdocs-material/reference/). Every
 * block a reader meets now says what KIND of thing it is, in
 * Material's own vocabulary, instead of one more H2 that looks like
 * the body:
 *
 *   - A document page: the summary is an `abstract` admonition
 *     (Material's own "Summary" type; the sweep's no-summary alert
 *     stays the `warning` it is); the related documents are a
 *     foldable `related` block — a custom type with the link icon —
 *     open by default; the Esri documentation links are a `docs`
 *     block (custom, the book icon); the Open button is the page's
 *     primary button. `lib/mdlayout.mjs` v1.3 renders every case's
 *     Expected Result as a `success` admonition — the green check IS
 *     the pass criterion — with Group, Case, Steps and Trace still a
 *     definition list — and every case is ONE card: `wrapCases` puts
 *     the content under a `### TC-…` heading in a `.lrs-case` div, so
 *     the stylesheet draws the heading as the card's head and the
 *     fields as a label/value grid, the expected result a green row.
 *     The card is written in pymdown's Blocks syntax
 *     (https://facelessuser.github.io/pymdown-extensions/extensions/blocks/#nesting):
 *     `//// html | div.lrs-case` around the case, `/// admonition |
 *     Expected result` inside it — an outer block takes more slashes
 *     than what it nests, so the nesting is visible in the margin
 *     rather than in indentation. `pymdownx.blocks.html` and
 *     `pymdownx.blocks.admonition` join mkdocs.yml for it.
 *   - Page status (Material's `status:` front matter): a document
 *     edited in the last NEW_DAYS days carries `new`, a badge beside
 *     it in the sidebar; every draft carries `draft`, the pencil.
 *     `extra.status` gives each badge its tooltip.
 *   - The front page's kinds are cards — an icon per kind
 *     (KIND_ICONS), the count, the newest edit — like the Browse
 *     cards; every index page's title wears the same icon, so a kind
 *     or a catalog looks the same on a card and at the top of its
 *     page. The figure catalog is a card grid per document instead of
 *     a bullet list of thumbnails; a catalog value's facts line is a
 *     strip under the title; the document tables lose their Summary
 *     column (a 160-character cell per row made them a wall of text —
 *     the summary is on the document's own page).
 *   - The theme: the site's own palette (`primary: custom` — a deep
 *     blue and a teal, defined in extra.css for both schemes, with
 *     readable link colours on slate), instant navigation with its
 *     progress bar (off under `wiki.offline`: file:// pages cannot be
 *     fetched), `content.tooltips`; `footnotes` closes the last GFM
 *     dialect gap (`[^1]`). extra.css: a rule under every H2, figures
 *     centred with a muted caption, striped catalog tables, softer
 *     borders on the metadata card and the cards.
 *
 * v2.0 — the site reorganised for readers. The v1.x nav was a flat
 * sidebar of index pages with every document and catalog page left
 * out of it (`not_in_nav`), so a reader arriving on a document from
 * search had no sense of where they were, and the only way through a
 * 150-row table was to sort it. Now:
 *
 *   - Every page is in the nav. `navigation.tabs` puts Home, Documents,
 *     Browse, "Test cases & figures" and Drafts in a tab bar; each kind
 *     and each catalog is a collapsible section whose header opens its
 *     own table (`navigation.indexes`), with the pages listed under it
 *     alphabetically; `navigation.prune` keeps the sidebar to the
 *     active branch so a 600-entry nav costs a page nothing. The
 *     Documents tab lands on a NEW `documents/index.md` — every
 *     document in one table — and the Browse tab on `browse/index.md`,
 *     the catalogs as cards. Kinds follow KIND_FOLDERS order (Test
 *     Plans first), not the alphabet.
 *   - Every large table filters as you type (`.filterable`, the
 *     render's own `tables.js`; a box appears only when the table has
 *     enough rows to need one) and the test-case catalog has one box
 *     for the whole page (`.filter-all`) that also hides the plans with
 *     no matching case. Cross-kind tables (All documents, Recent, a
 *     catalog value's page) carry a Kind column and a catalog value's
 *     page is one table rather than one per kind; group keys sort
 *     naturally (release 3.10 after 3.8).
 *   - A document page opens with a breadcrumb line and, under the
 *     metadata card, an "Open <file>" button for the original — the
 *     thing a Product Engineer most often came for. A keyword page
 *     lists the terms it is most often tagged with; a person's page
 *     says in which roles they appear.
 *   - Search: document pages are boosted, drafts damped, and the
 *     aggregate pages (the front page, All documents, Recent, the
 *     kind and catalog indexes, the case and figure catalogs) are
 *     excluded from the index — they repeat titles that the document
 *     pages already carry, so they used to match almost any query.
 *   - The front page: the search tip, the kinds with an All-documents
 *     link, the eight most recent edits inline, then the Browse cards.
 *   - From the MkDocs catalog (https://github.com/mkdocs/catalog),
 *     reviewed for this site: `pymdownx.magiclink` (bare URLs become
 *     links, as GitHub renders them, and `Org/repo#123` shorthand
 *     links the issue tracker — the host is read off the corpus's own
 *     issue URLs, so devtopia needs no config) and `pymdownx.tilde`
 *     (GFM `~~strikethrough~~`, subscript off) close two dialect gaps;
 *     Material's built-in `offline` plugin is an opt-in (`wiki.offline`)
 *     for the day the built `site/` folder is opened from a file share
 *     rather than served; glightbox gets `auto_caption`. Behaviours
 *     that were only a few lines of JavaScript are written into
 *     `tables.js` instead of adding a package to the runner: external
 *     links open in a new tab (mkdocs-open-in-new-tab's job) and the
 *     breadcrumbs are composed by the render. Passed over, with the
 *     reason in docs/changelog/pipeline.md: the nav plugins (the nav
 *     is generated here), the git date/author plugins (dates come from
 *     the sidecars), Material's tags (would duplicate Keywords),
 *     redirects (nothing records a document's previous slug yet), the
 *     inactive `issues` and `localsearch` plugins, and `privacy`
 *     (a fetch warning would fail the strict nightly build).
 *
 * v1.9 — publishing on Enterprise Server. The generated pages.yml is
 * shaped by three config keys (devtopia has no hosted runners, no
 * tool cache and no v4 artifact API): `runsOn`, `setupPython` and
 * `deploy` ("artifact" = upload-pages-artifact + deploy-pages, the
 * github.com way; "branch" = `mkdocs gh-deploy` to gh-pages, which
 * Pages serves as a branch source). Media a body links but the
 * library lacks renders as a "(missing figure)" marker, never as a
 * link, so `mkdocs build --strict` keeps passing.
 *
 * v1.8 — lists
 * (https://squidfunk.github.io/mkdocs-material/reference/lists/). Task
 * lists shipped in phase 2 and ordered / unordered lists need nothing,
 * so the delta is `def_list`: a test case's fields (Group, Case,
 * Steps, Expected Result) are definitions, and the case grammar writes
 * them as bold-label bullets only because GFM has no other way to say
 * it. `mdlayout` v1.2 translates them in this lane, and About's
 * provenance list is composed as one. Material's `clickable_checkbox`
 * is deliberately NOT enabled — see the About page: this site is a
 * render, a tick would not survive a reload, and the drafts' whole
 * point is that a Product Engineer still has to review them.
 *
 * v1.7 — data tables
 * (https://squidfunk.github.io/mkdocs-material/reference/data-tables/).
 * Every table the render COMPOSES sorts on a header click, and the
 * count and ordinal columns are right-aligned. Material reaches
 * sorting by loading `tablesort` from a public CDN; this site is
 * served from a devtopia Pages build on the internal network, where an
 * external script is the one thing that fails silently, so the render
 * writes `docs/javascripts/tables.js` itself — the same behaviour with
 * no runtime dependency. Only composed tables sort (`.doc-table` and
 * the new `.sortable` wrapper): never the metadata card, whose header
 * row the stylesheet hides, and never a table extracted out of a
 * source document, whose first row may not be a header at all.
 *
 * v1.6 — admonitions, the whole Material set
 * (https://squidfunk.github.io/mkdocs-material/reference/admonitions/).
 * `mkdocs.yml` gains `pymdownx.details` (the collapsible `???` and
 * `???+` forms; `pymdownx.superfences`, which Material pairs with it
 * so a fenced block can nest inside an admonition, arrives with the
 * mermaid fence in v1.5), `extra.css` gives every type the site's own radius and
 * defines the custom `draft` type, and `lib/mdlayout.mjs` v1.1 reads
 * the whole alert vocabulary out of a body — a title after the marker,
 * a `-`/`+` fold suffix, and Material's types beyond GFM's five. The
 * pages this job COMPOSES use them too: the drafts catalog's and the
 * draft page's "unreviewed" notice are `!!! draft` blocks rather than
 * a bold run in a paragraph, the front page opens with a search tip,
 * and About's provenance list is a `???+ note` a reader can fold away.
 *
 * v1.5 (figure presentation) — the corpus's pictures get the three
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
 * v1.4 — the site's formatting. The page MARKDOWN is unchanged (the
 * metadata table, the catalog tables and the browse lines are the
 * contract `tests/check_wiki.py` pins); what changed is how MkDocs
 * dresses it. The render now writes `docs/stylesheets/extra.css` and
 * `mkdocs.yml` points at it: the metadata table becomes a key/value
 * card (header row hidden, labels muted, a fixed label column), each
 * `### TC-…` case heading a card of its own, the catalog tables fill
 * the column with the short columns kept on one line. The front
 * page's Browse section is a grid of cards (`md_in_html` +
 * `pymdownx.emoji` for the icons). The nav groups the kinds under
 * Documents, the catalogs under Catalogs and cases / figures under
 * Extracted, which `navigation.sections` shows as sidebar headings.
 * The search plugin (always on) gets Material's recommended
 * tokenizer separator, so `TC-P01`, `ps-location-referencing#4855`
 * and `merge-events` are found by their parts, and `search.share`.
 * The palette follows the OS preference and still toggles.
 *
 * v1.3 (Markdown_Layout_Plan.md phase 5) — with `wiki.draftsDir` set,
 * the Test Plan Drafts folder is published too: one page per draft
 * plus a Drafts catalog, off by default. A draft is a document in the
 * same skeleton every sidecar carries, so `readMeta` reads one; but a
 * draft is unreviewed machine output, so it joins NO catalog — not
 * kinds, not keywords, not test cases — and its page says so.
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
 *   node --experimental-strip-types pipeline/wiki.mjs --config config.json --build    + `python -m mkdocs build --strict`
 *
 * A body's image link whose file is not under <library>/media/ is
 * rendered as an italic "(missing figure: alt)" marker, never as a
 * link — `mkdocs build --strict` fails on every unresolved link — and
 * every such link is listed by page in <workDir>/wiki-missing-media.txt
 * (removed again by a run that finds none).
 *   node --experimental-strip-types pipeline/wiki.mjs --config config.json --push     + commit and push to wiki.repoUrl
 *
 * Config (`wiki`, all optional except repoUrl for --push):
 *   outDir     where the site tree is written (default <workDir>/wiki)
 *   repoUrl    the git remote to push to (a devtopia repository URL;
 *              credentials come from the machine's git credential
 *              helper — nothing is stored in config)
 *   branch     the branch Pages builds from (default "main")
 *   runsOn     the `runs-on` label in the generated pages.yml
 *              (default "ubuntu-latest"). On Enterprise Server there
 *              are no GitHub-hosted runners, so that label never
 *              resolves and the job queues forever — set it to the
 *              label a self-hosted runner advertises, e.g.
 *              "self-hosted"
 *   setupPython whether the generated pages.yml installs Python with
 *              actions/setup-python (default true). A self-hosted
 *              runner with no tool cache fails that step; set false to
 *              use the Python already on the runner's PATH
 *   deploy     how the generated pages.yml publishes the built site
 *              (default "artifact"): "artifact" = actions/
 *              upload-pages-artifact + deploy-pages (Pages source:
 *              GitHub Actions) — rides on upload-artifact@v4, which
 *              Enterprise Server rejects; "branch" = `mkdocs
 *              gh-deploy` force-pushes the site to the gh-pages
 *              branch (Pages source: Deploy from a branch, gh-pages,
 *              / (root)) — works on GHES and github.com alike
 *   python     the interpreter `--build` runs mkdocs through (default
 *              llm.python, else LRSDOC_PYTHON, else `python` on
 *              Windows / `python3` elsewhere) — `python -m mkdocs`,
 *              so mkdocs need not be on PATH
 *   siteName   the site title (default "LRS Doc Index")
 *   siteUrl    the published URL, for mkdocs.yml (default "")
 *   recent     rows on the Recent page (default 50)
 *   offline    enable Material's built-in `offline` plugin (default
 *              false): search and navigation then work when the built
 *              `site/` folder is opened from disk or a file share
 *              (file://) instead of being served. The plugin switches
 *              the site to `.html` URLs (`use_directory_urls: false`),
 *              so leave it off for a Pages or IIS deployment
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
import { toMkDocs, normalize, splitAnchor, admonition, defList, block } from "./lib/mdlayout.mjs";
import { assertNodeVersion } from "./lib/config.mjs";
import { fmtDate } from "./lib/util.mjs";

export const WIKI_VERSION = "v2.1";

/** Days after its last edit a document counts as new (v2.1): the
 *  `new` badge in the sidebar. */
export const NEW_DAYS = 14;

// Declaration order is READER order (v2.0): the nav, the front page
// and the All-documents table list kinds this way, test plans first,
// not alphabetically. A kind the config adds follows, alphabetically.
const KIND_FOLDERS = {
  "Test Plan": "Test Plans",
  "User Story": "User Stories",
  "Design Spike": "Design Spikes",
  "Data Template": "Data Templates",
  Schedule: "Schedules",
  "Doc Review": "Doc Reviews",
  Other: "Other",
};

// v2.1: the icon each kind wears — on its front-page card and its
// index page's title. A kind the config adds gets the plain document.
const KIND_ICONS = {
  "Test Plan": "test-tube",
  "User Story": "book-open-variant",
  "Design Spike": "lightbulb-on-outline",
  "Data Template": "table-large",
  Schedule: "calendar-clock",
  "Doc Review": "file-check-outline",
  Other: "file-document-outline",
};
const kindIcon = (kind) => KIND_ICONS[kind] || "file-document-outline";

/** The six catalogs, in the order the nav and the Browse page show
 *  them: section (the folder), title, the model key, the index page's
 *  intro, the column label, the card icon and the card blurb. */
const CATALOGS = [
  { section: "keywords", title: "Keywords", key: "keywords", label: "Keyword", icon: "tag-multiple",
    intro: "The catalog's vocabulary, canonical terms only, with the documents each one tags.",
    blurb: "The catalog's vocabulary after curation — an alias lands on its canonical term's page." },
  { section: "tools", title: "Tools", key: "tools", label: "Tool", icon: "hammer-wrench",
    intro: "Official tool names the documents mention.",
    blurb: "Official tool names the documents mention." },
  { section: "products", title: "Products", key: "products", label: "Product", icon: "package-variant",
    intro: "Product lines, as detected from names and text.",
    blurb: "Product lines, as detected from names and text." },
  { section: "releases", title: "Releases", key: "releases", label: "Release", icon: "rocket-launch",
    intro: "Target releases the documents state.",
    blurb: "Target releases the documents state." },
  { section: "people", title: "People", key: "people", label: "Person", icon: "account-group",
    intro: "Authors, product engineers and developers named on the documents.",
    blurb: "Authors, product engineers and developers named on the documents." },
  { section: "issues", title: "Issues", key: "issues", label: "Issue", icon: "bug",
    intro: "devtopia issues the documents reference.",
    blurb: "devtopia issues the documents reference, each with the documents that cite it." },
];

/** Folders the render owns besides the kind folders — a kind folder
 *  from `sweep.kindFolders` may not collide with one. */
const RESERVED_DIRS = new Set(["documents", "browse", "cases", "figures", "drafts", "media",
  "stylesheets", "javascripts", ...CATALOGS.map((c) => c.section)]);

/** Kinds in reader order: KIND_FOLDERS' declaration order first, then
 *  any other kind the corpus has, alphabetically. */
function kindOrder(kinds, kindFolders) {
  const declared = Object.keys(kindFolders);
  const rank = (k) => { const i = declared.indexOf(k); return i < 0 ? declared.length : i; };
  return [...kinds.keys()].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, "en"));
}

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
/** One value inside a double-quoted HTML attribute (v1.5, the figure
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
  // v2.0: damped in search — an unreviewed draft must never outrank
  // the plan or the story it was generated from
  const out = [...pageMeta({ boost: 0.5, status: "draft" }), ...crumbs(d.page, [["drafts/index.md", "Test-plan drafts"]]),
    `# ${mdEscape(m.title || d.stem)}`, "", META_OPEN, "", "| Field | Value |", "| --- | --- |"];
  for (const [k, v] of rows) out.push(`| **${k}** | ${v} |`);
  out.push("", META_CLOSE, "");
  // everything under the draft's own metadata table — the callouts
  // included; "unreviewed" is the most important thing on the page —
  // translated for MkDocs like any other body
  let bodyAt = 0;
  for (const m of d.content.matchAll(/^\| \*\*[A-Za-z]+\*\* \|.*\|$/gm)) bodyAt = m.index + m[0].length;
  let body = normalize(wrapCases(toMkDocs(stripComments(d.content.slice(bodyAt)))));
  // v1.6: the one thing a reader must not miss, in the site's own
  // admonition type rather than a paragraph they can skim past.
  // v2.1: ONE box, not two — the generator's own banner (the warning
  // the body opens with) is retyped as the draft block and keeps its
  // words; only a draft without one gets the composed notice
  if (/^!!! warning\n/.test(body)) {
    body = body.replace(/^!!! warning\n/, '!!! draft "Unreviewed draft"\n');
  } else {
    out.push(admonition("draft",
      "Machine-generated and **unreviewed**: every case and every [VERIFY] item still needs a " +
      "Product Engineer. This page is a render of the drafts folder — it is not a catalog " +
      "document and joins no catalog.", { title: "Unreviewed draft" }), "");
  }
  if (body) out.push("---", "", body, "");
  return out.join("\n");
}

function draftsIndex(drafts) {
  const p = "drafts/index.md";
  const out = [...pageMeta({ exclude: true, title: "Test-plan drafts" }), h1("file-document-edit", "Test-plan drafts"), "",
    `Machine-generated test-plan drafts, newest first. ${TABLE_HELP}`, "",
    admonition("draft",
      "Every draft here is **unreviewed**: every case and every [VERIFY] item still " +
      "needs a Product Engineer. Drafts are not catalog documents and do not appear " +
      "in the kind, keyword or test-case catalogs.", { title: "Unreviewed" }), "",
    ...sortable([
      "| Draft | Generated | Status | From |", "|---|---|---|---|",
      ...drafts.map((d) =>
        `| ${link(p, d.page, d.meta.title || d.stem)} | ${cell(d.when) || "—"} | ` +
        `${cell(d.meta.status) || "—"} | ${cell(d.meta.source_file) || "—"} |`),
    ], { filter: true })];
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
    // the links whose file is not in the library. A page must not
    // carry one: `mkdocs build --strict` fails on every unresolved
    // link, and one night's run had 293 of them (560 warnings), all
    // figures whose renamed file never reached the synced folder.
    d.mediaMissing = new Set(
      opts.libDir
        ? d.media
            .filter((m) => !fs.existsSync(path.join(opts.libDir, "media", m.dir, (m.legacyPrefix || "") + m.name)))
            .map((m) => m.link)
        : [] // no library to check against (a model built from bodies alone)
    );
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
    // v2.0: natural order, so release 3.10 follows 3.8 and TC-P2
    // precedes TC-P10 — and case-insensitive, so "Merge" and "merge
    // events" sit together
    return new Map([...m.entries()].sort((a, b) => a[0].localeCompare(b[0], "en", { numeric: true, sensitivity: "base" }) || a[0].localeCompare(b[0], "en")));
  };
  const issueUrls = new Map(docs.flatMap((d) => d.issues.map((i) => [i.ref, i.url])));
  return {
    docs, byId, byFile, kindFolders,
    kinds: group((d) => [d.kind]),
    keywords: group((d) => [...new Set(d.keywords)]),
    tools: group((d) => d.meta.tools),
    products: group((d) => d.meta.products),
    releases: group((d) => [d.meta.target_release]),
    people: group((d) => [...new Set([d.meta.author, d.meta.pe, d.meta.dev].filter(Boolean))]),
    issues: group((d) => d.issues.map((i) => i.ref)),
    issueUrls,
    // v2.0: the issue tracker's origin, read off the corpus's own issue
    // links, so `Org/repo#123` shorthand in a body links the right host
    // (devtopia, not github.com) with nothing to configure
    issueHost: issueHostOf(issueUrls),
    keywordKinds: kw.kinds,
  };
}

/** `https://devtopia.esri.com` from the first `https://devtopia.esri.com/Org/repo/issues/N`
 *  link, "" when the corpus cites no issue or the URL does not parse. */
export function issueHostOf(issueUrls) {
  for (const url of issueUrls.values()) {
    try {
      const u = new URL(url);
      if (/^https?:$/.test(u.protocol) && /\/issues\/\d+/.test(u.pathname)) return u.origin;
    } catch { /* not a URL — try the next */ }
  }
  return "";
}

/** The keywords a keyword is most often tagged with: [{value, n}],
 *  most shared first, at most `max` (v2.0, the keyword page's
 *  "Often tagged with" line). */
export function coKeywords(value, docs, max = 8) {
  const n = new Map();
  for (const d of docs) for (const k of new Set(d.keywords)) {
    if (k === value) continue;
    n.set(k, (n.get(k) || 0) + 1);
  }
  return [...n.entries()].map(([v, c]) => ({ value: v, n: c }))
    .sort((a, b) => b.n - a.n || a.value.localeCompare(b.value, "en")).slice(0, max);
}

/** How a person appears across their documents: "author of 2 · PE of 1". */
export function personRoles(name, docs) {
  const roles = [["author", "author"], ["pe", "PE"], ["dev", "developer"]]
    .map(([field, label]) => [label, docs.filter((d) => d.meta[field] === name).length])
    .filter(([, c]) => c > 0);
  return roles.map(([label, c]) => `${label} of ${c}`).join(" · ");
}

/** Material's page status for a document (v2.1): "new" when its last
 *  edit is within NEW_DAYS of `now`, else "". `lastEdited` is the
 *  metadata row's `2026-08-01 10:00` (or an ISO stamp); a date that
 *  does not parse is never new. */
export function pageStatus(lastEdited, now = Date.now()) {
  const s = String(lastEdited || "").trim();
  if (!s) return "";
  const iso = s.replace(" ", "T");
  const t = Date.parse(iso + (iso.includes("T") && !/(Z|[+-]\d\d:?\d\d)$/.test(iso) ? "Z" : ""));
  if (isNaN(t)) return "";
  return (now - t) / 86400000 <= NEW_DAYS ? "new" : "";
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

/** Replace each image link in `missing` (a Set of `../media/...`
 *  links) with its alt text, marked, so the page says what is absent
 *  without linking to it. */
export function dropMissingMedia(body, missing) {
  if (!missing || !missing.size) return body;
  return String(body ?? "").replace(/!\[([^\]]*)\]\(<?(\.\.\/media\/[^)\s>]+)>?\)/g, (whole, alt, link) =>
    missing.has(link) ? `*(missing figure${alt ? `: ${alt}` : ""})*` : whole);
}

/** Wrap each test case's content — everything under a `### TC-…`
 *  heading up to the next heading — in a `//// html | div.lrs-case`
 *  block (v2.1, pymdown Blocks), so the stylesheet can draw the
 *  heading and its fields as ONE card. Four slashes, because the
 *  Expected result admonition inside it is a three-slash block: the
 *  nesting is in the margin. The spans come from the case grammar's
 *  own reader (`caseSpans`, the one that fills the Test Cases list);
 *  the heading line, with its anchor, stays where it is. Runs on the
 *  TRANSLATED body (after `toMkDocs`, so a body's own text cannot be
 *  read as the wrapper); deck-shaped `## Slide N` cases are left
 *  alone — they are sections, not cards. */
export function wrapCases(body) {
  const { lines, spans } = caseSpans(body);
  const cases = spans.filter((s) => /^### /.test(lines[s.start]));
  if (!cases.length) return String(body ?? "");
  const out = [];
  let at = 0;
  for (const s of cases) {
    out.push(...lines.slice(at, s.start + 1), "",
      block("html", lines.slice(s.start + 1, s.end).join("\n"), { title: "div.lrs-case", depth: 4 }), "");
    at = s.end;
  }
  out.push(...lines.slice(at));
  return out.join("\n");
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

// v1.4: the metadata table's wrapper (md_in_html), see EXTRA_CSS
const META_OPEN = '<div class="doc-meta" markdown>';
const META_CLOSE = "</div>";

/** v1.7: wrap a composed table so `javascripts/tables.js` picks it up.
 *  Only the tables the RENDER writes are sortable — a table extracted
 *  out of a source document has no header row to trust. v2.0: `filter`
 *  adds the class the script puts a type-to-filter box on (the box
 *  appears only when the table has enough rows to need one). */
const sortable = (lines, { filter = false } = {}) =>
  [`<div class="sortable${filter ? " filterable" : ""}" markdown>`, "", ...lines, "", "</div>"];

/** Page front matter (v2.0 search, v2.1 status and title). `boost`
 *  scales a page's search score, `exclude` keeps it out of the index
 *  altogether: the aggregate pages — All documents, Recent, the kind
 *  and catalog indexes, the case and figure catalogs — repeat every
 *  title the document pages already carry, so they matched almost any
 *  query and pushed the documents down. `status` is Material's page
 *  status (`new`, `draft`), a badge beside the page in the nav;
 *  `title` pins the page title when the H1 wears an icon. */
const pageMeta = ({ boost, exclude, status, title } = {}) => {
  const lines = [];
  if (title) lines.push(`title: ${JSON.stringify(String(title))}`);
  if (exclude) lines.push("search:", "  exclude: true");
  else if (boost !== undefined) lines.push("search:", `  boost: ${boost}`);
  if (status) lines.push(`status: ${status}`);
  return lines.length ? ["---", ...lines, "---", ""] : [];
};

/** A page title with its icon (v2.1): `# :material-test-tube: Test
 *  Plans`. pymdownx.emoji draws the icon; the front matter's `title`
 *  keeps the browser title and the search entry to the words. */
const h1 = (icon, text) => `# :material-${icon}: ${mdEscape(text)}`;

/** The breadcrumb line above a page's title (v2.0): `Home › Test
 *  Plans`. Markdown links inside an md_in_html div, so MkDocs rewrites
 *  them like any other link; on a phone, where the sidebar is hidden,
 *  it is the one thing that says where the page sits. */
const crumbs = (fromPage, trail) =>
  ['<div class="lrs-crumbs" markdown>', "",
    [link(fromPage, "index.md", "Home"), ...trail.map(([page, text]) => link(fromPage, page, text))].join(" › "),
    "", "</div>", ""];

function docRow(fromPage, d, { kind = false } = {}) {
  const title = d.meta.title || d.stem;
  const kindCol = kind ? ` ${link(fromPage, `${d.kindDir}/index.md`, d.kind)} |` : "";
  return `| ${link(fromPage, d.page, title)} |${kindCol} ${cell(d.meta.products.join(" · ")) || "—"} | ${cell(d.meta.target_release) || "—"} | ${cell(d.meta.last_edited).slice(0, 10) || "—"} |`;
}
// v2.1: no Summary column — a 160-character cell per row made every
// table a wall of text; the summary is on the document's own page
const DOC_TABLE_HEAD = "| Document | Product | Release | Edited |\n|---|---|---|---|";
const DOC_TABLE_HEAD_KIND = "| Document | Kind | Product | Release | Edited |\n|---|---|---|---|---|";
const byEdited = (a, b) => String(b.meta.last_edited).localeCompare(String(a.meta.last_edited));

/** The document table. `kind` adds a Kind column (for a table that
 *  mixes kinds: All documents, Recent, a catalog value's page);
 *  `filter` marks it for the type-to-filter box. */
function docTable(fromPage, docs, { kind = false, filter = false } = {}) {
  // v1.4: wrapped so the stylesheet can keep the short columns on one
  // line (md_in_html renders the table inside the div)
  return [`<div class="doc-table${filter ? " filterable" : ""}" markdown>`, "",
    kind ? DOC_TABLE_HEAD_KIND : DOC_TABLE_HEAD,
    ...docs.slice().sort(byEdited).map((d) => docRow(fromPage, d, { kind })),
    "", "</div>"].join("\n");
}

const TABLE_HELP = "Type in the box to filter the table; click a column header to sort it.";

/** The summary as an `abstract` admonition (v2.1) — unless the sweep
 *  left its no-summary alert there, which is a `warning` and renders
 *  as one rather than as a warning inside a summary box. */
function summaryBlock(summary) {
  const md = normalize(toMkDocs(summary));
  return (/^(!!!|\?\?\?)/.test(md) ? md : admonition("abstract", md, { title: "Summary" })).trimEnd();
}

/** The related list as a foldable `related` block (v2.1, a custom
 *  type with the link icon; open by default): each bullet links the
 *  sibling page, with the sweep's reason after the dash. */
function relatedBlock(d) {
  const items = d.related.map((r) => {
    const target = r.target ? link(d.page, r.target.page, r.target.meta.title || r.title) : mdEscape(r.title);
    return `- ${target}${r.text ? ` — ${r.text}` : ""}`;
  });
  return admonition("related", items.join("\n"), {
    title: `Related documents (${d.related.length})`, collapse: "open",
  }).trimEnd();
}

/** The sweep's Esri-documentation region as a `docs` block (v2.1, a
 *  custom type with the book icon): the region's own `## Esri
 *  documentation` heading becomes the block's title. */
function docsBlock(region) {
  const md = normalize(toMkDocs(stripComments(region)));
  const m = /^#{1,6}[ \t]+(.+?)[ \t]*\n/.exec(md);
  return admonition("docs", m ? md.slice(m[0].length).trim() : md, { title: m ? m[1].trim() : "Esri documentation" }).trimEnd();
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
  // v1.4: the table sits in a div the stylesheet turns into a card;
  // the rows themselves are the format 3.1 contract and do not change.
  // v2.0: search boost (a document page is what a query is for), the
  // breadcrumb line, and the "Open <file>" button under the card;
  // v2.1: the `new` badge for a recent edit
  const out = [...pageMeta({ boost: 2, status: pageStatus(m.last_edited) }),
    ...crumbs(p, [[`${d.kindDir}/index.md`, model.kindFolders[d.kind] || d.kind]]),
    `# ${mdEscape(m.title || d.stem)}`, "", META_OPEN, "", "| Field | Value |", "| --- | --- |"];
  for (const [k, v, always] of rows) {
    if (!always && (v === "" || v === "—")) continue;
    out.push(`| **${k}** | ${v === "" ? "—" : v} |`);
  }
  out.push("", META_CLOSE, "");
  if (m.source_url) {
    out.push(`[:material-open-in-new: Open ${linkText(m.source_file || "the original")}](<${m.source_url}>){ .md-button .md-button--primary .lrs-open }`, "");
  }
  // v2.1: the head of the page by content type — summary, related,
  // documentation — each in the block that says what it is
  if (d.summary) out.push(summaryBlock(d.summary), "");
  if (d.related.length) out.push(relatedBlock(d), "");
  if (d.docsRegion) out.push(docsBlock(d.docsRegion), "");
  const body = normalize(wrapCases(toMkDocs(stripComments(dropMissingMedia(d.body, d.mediaMissing)))));
  if (body) out.push("---", "", body, "");
  return out.join("\n");
}

function catalogIndex({ section, title, intro, label, icon }, groups, model) {
  const p = `${section}/index.md`;
  const out = [...pageMeta({ exclude: true, title }), h1(icon, title), "", intro, "",
    `${groups.size} ${groups.size === 1 ? label.toLowerCase() : title.toLowerCase()}. ${TABLE_HELP}`, "",
    ...sortable([
      "| " + label + " | Documents |", "|---|---:|",
      ...[...groups].map(([value, docs]) => {
        const extra = section === "keywords" && model.keywordKinds.get(value.toLowerCase())
          ? ` (${model.keywordKinds.get(value.toLowerCase())})` : "";
        return `| ${link(p, catalogPage(section, value), value)}${extra} | ${docs.length} |`;
      }),
    ], { filter: true })];
  return out.join("\n") + "\n";
}

/** A catalog value's page (v2.0: one table with a Kind column rather
 *  than one table per kind — sortable and filterable across the whole
 *  set — under a facts line: the count, what the value is, the way back
 *  to its catalog; a keyword's kind and the terms it travels with; a
 *  person's roles; an issue's tracker link). */
function catalogValuePage({ section, title }, value, docs, model) {
  const p = catalogPage(section, value);
  const facts = [`${docs.length} document${docs.length === 1 ? "" : "s"}`];
  if (section === "keywords" && model.keywordKinds.get(value.toLowerCase())) {
    facts.push(`a ${cell(model.keywordKinds.get(value.toLowerCase()))} keyword`);
  }
  if (section === "people") {
    const roles = personRoles(value, docs);
    if (roles) facts.push(roles);
  }
  facts.push(link(p, `${section}/index.md`, "all " + title.toLowerCase()));
  // v2.1: the facts in a strip under the title (md_in_html, see
  // extra.css), the tracker link and the co-tags with them
  const out = [...pageMeta({ boost: 1 }), ...crumbs(p, [[`${section}/index.md`, title]]),
    `# ${mdEscape(value)}`, "", '<div class="lrs-facts" markdown>', "", facts.join(" · "), ""];
  if (section === "issues" && model.issueUrls.get(value)) out.push(`Issue: <${model.issueUrls.get(value)}>`, "");
  if (section === "keywords") {
    const co = coKeywords(value, docs);
    if (co.length) {
      out.push("Often tagged with: " + co.map((c) => `${link(p, catalogPage("keywords", c.value), c.value)} (${c.n})`).join(" · "), "");
    }
  }
  out.push("</div>", "", docTable(p, docs, { kind: true, filter: true }), "");
  return out.join("\n");
}

function kindIndex(kind, docs, model, kindFolders) {
  const dir = pageName(kindFolders[kind] || kind);
  const p = `${dir}/index.md`;
  return [...pageMeta({ exclude: true, title: kindFolders[kind] || kind }), h1(kindIcon(kind), kindFolders[kind] || kind), "",
    `${docs.length} document${docs.length === 1 ? "" : "s"}, newest edit first. ${TABLE_HELP} ` +
    `Or ${link(p, "documents/index.md", "see every kind in one table")}.`, "",
    docTable(p, docs, { filter: true }), ""].join("\n");
}

/** Every document in one table (v2.0): the Documents tab's own page. */
function allDocumentsPage(model) {
  const p = "documents/index.md";
  const kinds = kindOrder(model.kinds, model.kindFolders)
    .map((k) => `${link(p, `${pageName(model.kindFolders[k] || k)}/index.md`, model.kindFolders[k] || k)} (${model.kinds.get(k).length})`);
  return [...pageMeta({ exclude: true, title: "All documents" }), h1("file-document-multiple-outline", "All documents"), "",
    `${model.docs.length} documents of every kind, newest edit first. ${TABLE_HELP}`, "",
    `By kind: ${kinds.join(" · ")}.`, "",
    docTable(p, model.docs, { kind: true, filter: true }), ""].join("\n");
}

/** v1.4: one Material card per catalog (md_in_html grid, emoji icons);
 *  the link text and the count are what the gate looks for. */
const card = (fromPage, icon, target, title, count, blurb) => [
  `-   :material-${icon}:{ .lg .middle } ${link(fromPage, target, title)}${count == null ? "" : ` (${count})`}`, "",
  "    ---", "", `    ${blurb}`, ""];

const catalogCards = (fromPage, model) =>
  CATALOGS.flatMap((c) => card(fromPage, c.icon, `${c.section}/index.md`, c.title, model[c.key].size, c.blurb));

/** The Browse tab's own page (v2.0): the six catalogs as cards. */
function browsePage(model) {
  const p = "browse/index.md";
  return [...pageMeta({ exclude: true, title: "Browse" }), h1("compass-outline", "Browse"), "",
    "Six ways into the same documents: every value below is a page that lists the documents carrying it, and a document's metadata card links back here.", "",
    '<div class="grid cards" markdown>', "", ...catalogCards(p, model), "</div>", ""].join("\n");
}

function casesPage(model) {
  const p = "cases/index.md";
  const out = [...pageMeta({ exclude: true, title: "Test cases" }), h1("clipboard-check", "Test cases"), "",
    "Every test case the catalog's test plans carry, by plan (newest edit first); each row links the case's section on the plan's page.", ""];
  const at = out.length;
  // v2.0: one filter box for the whole page — a plan whose cases all
  // fall out of the filter folds away with them
  out.push('<div class="filter-all" markdown>', "");
  let total = 0;
  for (const d of (model.kinds.get("Test Plan") || []).slice().sort(byEdited)) {
    const cases = planCases(d.body);
    if (!cases.length) continue;
    total += cases.length;
    out.push(`## ${link(p, d.page, d.meta.title || d.stem)}`, "",
      ...sortable([
        "| # | Case |", "|---:|---|",
        ...cases.map((c) => `| ${c.ordinal} | [${linkText(c.heading)}](${rel(p, d.page).replace(/ /g, "%20")}#${c.anchor}) |`),
      ]));
    out.push("");
  }
  out.push("</div>", "");
  out.splice(at, 0, `${total} cases. Type in the box to filter every plan's table at once.`, "");
  return out.join("\n");
}

function figuresPage(model) {
  const p = "figures/index.md";
  const out = [...pageMeta({ exclude: true, title: "Figures" }), h1("image-multiple", "Figures"), "", "Every image a sidecar body links, by document (newest edit first); each links the section it sits in.", ""];
  const at = out.length; // the count line goes here, once known
  let total = 0;
  for (const d of model.docs.slice().sort(byEdited)) {
    const figs = bodyFigures(d.body).filter((f) => !d.mediaMissing?.has(f.link));
    if (!figs.length) continue;
    total += figs.length;
    // v2.1: a card grid per document (Material's grid cards) rather
    // than a bullet list of thumbnails
    out.push(`## ${link(p, d.page, d.meta.title || d.stem)}`, "", '<div class="grid cards lrs-figures" markdown>', "");
    for (const f of figs) {
      const img = f.link.replace(/^\.\.\//, "../").replace(/ /g, "%20");
      const href = `${rel(p, d.page).replace(/ /g, "%20")}#${f.anchor}`;
      // raw HTML, not `[![alt](img){ width=160 }](href)`: markdown_captions
      // (v1.5) would turn the image into a <figure>, which cannot sit
      // inside a link — the anchor empties and the figure escapes it —
      // and would move `width=160` onto the <figure>. Raw HTML keeps the
      // link, the width and the alt, and takes no caption or panzoom box.
      out.push(`- <a href="${attr(href)}"><img src="${attr(img)}" width="160" alt="${attr(f.alt)}"></a> ${f.heading ? `[${linkText(f.heading)}](${href})` : ""}`);
    }
    out.push("", "</div>", "");
  }
  out.splice(at, 0, `${total} figures.`, "");
  return out.join("\n");
}

function recentPage(model, n) {
  const p = "recent.md";
  const docs = model.docs.slice().sort(byEdited).slice(0, n);
  return [...pageMeta({ exclude: true, title: "Recent" }), h1("history", "Recent"), "",
    `The ${docs.length} most recently edited source documents. ${TABLE_HELP}`, "",
    docTable(p, docs, { kind: true, filter: true }), ""].join("\n");
}

const FRONT_RECENT = 8;

/** The front page (v2.0 order): what the site is, how to find things,
 *  the kinds with the All-documents link, the latest edits inline, and
 *  the Browse cards. */
function frontPage(model, kindFolders, opts, draftCount = 0) {
  const p = "index.md";
  const out = [...pageMeta({ exclude: true }), `# ${mdEscape(opts.siteName)}`, "",
    `${model.docs.length} documents from the team library, one page each, rendered ${fmtDate(new Date().toISOString())} from the catalog's sidecars. Every page carries the document's metadata, its summary, its related documents and the extracted text; the Source row links the original file.`, "",
    admonition("tip",
      "Search (press `/`) splits an id into its parts, so `TC-P01`, " +
      "`ps-location-referencing#4855` and `merge-events` each find the pages that carry them. " +
      "Every large table on the site filters as you type and sorts on a header click; " +
      "the tabs across the top are the site's map, and the sidebar lists the pages of the tab you are in.",
      { title: "Finding a document" }), "",
    "## Documents", "",
    `By kind — or ${link(p, "documents/index.md", "every document in one table")}.`, "",
    // v2.1: a card per kind (icon, count, newest edit), like Browse
    '<div class="grid cards lrs-kinds" markdown>', ""];
  for (const kind of kindOrder(model.kinds, kindFolders)) {
    const ds = model.kinds.get(kind);
    const newest = cell(ds.slice().sort(byEdited)[0]?.meta.last_edited).slice(0, 10);
    out.push(...card(p, kindIcon(kind), `${pageName(kindFolders[kind] || kind)}/index.md`, kindFolders[kind] || kind, ds.length,
      `${ds.length} document${ds.length === 1 ? "" : "s"}${newest ? `, newest edit ${newest}` : ""}.`));
  }
  out.push("</div>");
  const recent = model.docs.slice().sort(byEdited).slice(0, FRONT_RECENT);
  if (recent.length) {
    out.push("", "## Recently edited", "",
      `The ${recent.length} most recently edited source documents; ${link(p, "recent.md", "the Recent page")} goes further back.`, "",
      docTable(p, recent, { kind: true }));
  }
  out.push("", "## Browse", "", '<div class="grid cards" markdown>', "",
    ...catalogCards(p, model),
    ...card(p, "clipboard-check", "cases/index.md", "Test cases", null, "Every test case the test plans carry, by plan, linking its section."),
    ...card(p, "image-multiple", "figures/index.md", "Figures", null, "Every figure the bodies carry, by document."),
    ...card(p, "history", "recent.md", "Recent", null, "The most recently edited source documents."),
    ...(draftCount ? card(p, "file-document-edit", "drafts/index.md", "Test-plan drafts", draftCount, "Machine-generated, **unreviewed** — not catalog documents.") : []),
    ...card(p, "information", "about.md", "About", null, "What this site is, what it is not, and where each page's content comes from."),
    "</div>", "");
  return out.join("\n");
}

function aboutPage(model, opts) {
  return [...pageMeta({ title: "About this wiki" }), h1("information", "About this wiki"), "",
    // v2.0: the site's map, for the reader who wants it spelled out
    admonition("note", defList([
      ["Documents", "One tab, one table of everything, and a section per kind — the section's header opens the kind's table, the pages under it are the documents. A document page links its original file, its catalog values and its related documents."],
      // v2.1: what the blocks on a document page are, and the badges
      ["A document page", "The metadata card and the Open button; the summary; the related documents (fold them away with the chevron); the Esri documentation links; then, under the rule, the extracted text — every test case one card: its fields as label and value, the Expected result the green row."],
      ["Badges", `A page edited in the last ${NEW_DAYS} days carries a New badge in the sidebar; a draft carries the pencil.`],
      ["Browse", "The six catalogs: keywords, tools, products, releases, people and issues. Every value is a page listing the documents that carry it."],
      ["Test cases & figures", "What the sweep extracted from the bodies, each entry linking the section it came from."],
      ["Search, filter, sort", "Search (`/`) indexes the document pages and catalog values, not the tables that repeat them. Every large table filters as you type and sorts on a header click."],
    ]), { title: "How the site is organised", collapse: "open" }), "",
    `Generated by \`pipeline/wiki.mjs ${WIKI_VERSION}\` of the LRS Doc Index pipeline from the catalog's sidecar files${opts.sourceSite ? ` (the LRS Doc Index library on ${opts.sourceSite})` : ""}.`, "",
    admonition("info",
      "This site is a rendering, not a source: edit nothing here — the next run overwrites " +
      "every page. To change a document's classification, keywords or related documents, " +
      "change it in the catalog (the Doc Index lists) and let the nightly sweep rewrite the " +
      "sidecar.", { title: "A render, not a source" }), "",
    // a details block (pymdownx.details): open, so it reads as a list,
    // but a reader who knows this can fold it away
    admonition("note", defList([
      ["Doc ids", "Doc Index list row ids — the id test-plan generation takes."],
      ["Keywords", "The catalog's vocabulary after curation: an alias merged by the librarian lands on its canonical page."],
      ["Related documents", "The sweep's ranking (shared issues, shared keywords, body similarity), newest ranking first."],
      ["Test cases and Figures", "Read from the sidecar bodies with the same parsers that fill the Test Cases and Figures lists."],
      ["Test-plan drafts", "When the site publishes them: machine-generated and unreviewed. They are not catalog documents and join no catalog."],
      ["The checkboxes", "Rendered, never clickable. This site is a render of the catalog — a tick would not survive a reload, and a draft's cases still need a Product Engineer."],
    ]), { title: "Where each page's content comes from", collapse: "open" }), "",
    `Rendered ${fmtDate(new Date().toISOString())} · ${model.docs.length} documents.`, ""].join("\n");
}

// ---------------------------------------------------------------- site

/** The nav (v2.0). Every page is in it: the tab bar is Home ·
 *  Documents · Browse · Test cases & figures · Drafts (Recent and About
 *  are top-level pages, which Material files under the first tab).
 *  Each kind and each catalog is a section whose first entry is its
 *  index page — `navigation.indexes` makes the section header open it
 *  — followed by its pages by title. Sorted by title, not by edit
 *  date: a sidebar is scanned like an index, and the table on the
 *  section's page is the place to sort by anything else. */
export function navFor(model, kindFolders, drafts = []) {
  const y = (s) => JSON.stringify(String(s));
  const byTitle = (a, b) => (a.meta.title || a.stem).localeCompare(b.meta.title || b.stem, "en", { numeric: true, sensitivity: "base" });
  const nav = ["  - Home: index.md", "  - Documents:", "      - documents/index.md"];
  for (const kind of kindOrder(model.kinds, kindFolders)) {
    const label = kindFolders[kind] || kind;
    nav.push(`      - ${y(label)}:`, `          - ${pageName(label)}/index.md`);
    for (const d of model.kinds.get(kind).slice().sort(byTitle)) nav.push(`          - ${y(d.meta.title || d.stem)}: ${d.page}`);
  }
  nav.push("  - Browse:", "      - browse/index.md");
  for (const c of CATALOGS) {
    nav.push(`      - ${c.title}:`, `          - ${c.section}/index.md`);
    for (const [value] of model[c.key]) nav.push(`          - ${y(value)}: ${catalogPage(c.section, value)}`);
  }
  nav.push("  - Test cases & figures:", "      - Test cases: cases/index.md", "      - Figures: figures/index.md");
  if (drafts.length) {
    nav.push("  - Drafts:", "      - drafts/index.md");
    for (const d of drafts) nav.push(`      - ${y(`${d.meta.title || d.stem}${d.when ? ` (${d.when})` : ""}`)}: ${d.page}`);
  }
  nav.push("  - Recent: recent.md", "  - About: about.md");
  return nav;
}

function mkdocsYml(model, kindFolders, opts, drafts = []) {
  const y = (s) => JSON.stringify(String(s));
  const nav = navFor(model, kindFolders, drafts);
  // v2.0, from the MkDocs catalog review: `Org/repo#123` in a body (the
  // related list's "shared issue …", a test plan's own references)
  // links the tracker the corpus's issue links point at; a full
  // tracker URL is shortened to that same form; bare http(s) URLs
  // become links, as GitHub renders them. Without an issue host only
  // the bare-URL part is on — shorthand would otherwise point at
  // github.com.
  const host = model.issueHost;
  const hostLabel = host ? new URL(host).hostname.split(".")[0] : "";
  const magiclink = host
    ? ["  - pymdownx.magiclink:",
      "      repo_url_shorthand: true",
      "      repo_url_shortener: true",
      "      normalize_issue_symbols: true",
      `      provider: ${y(hostLabel)}`,
      "      custom:",
      `        ${y(hostLabel)}:`,
      `          host: ${y(host)}`,
      `          label: ${y(hostLabel)}`,
      "          type: github"]
    : ["  - pymdownx.magiclink"];
  return [
    `site_name: ${y(opts.siteName)}`,
    opts.siteUrl ? `site_url: ${y(opts.siteUrl)}` : "",
    "docs_dir: docs",
    "theme:",
    "  name: material",
    "  icon:",
    "    logo: material/book-open-page-variant",
    // v2.1: the page-status badges (Material's `status:` front
    // matter) — `new` is the theme's own, `draft` the site's
    "    status:",
    "      draft: material/pencil",
    // v2.0: tabs + section indexes + prune replace navigation.sections
    // (which would have listed every document under an always-open
    // heading); the rest as v1.4. v2.1: instant navigation (the site
    // behaves like one page; `tables.js` already re-runs on Material's
    // document$) with its progress bar — not under `offline`, where a
    // file:// page cannot be fetched — and Material's tooltips
    `  features: [navigation.tabs, navigation.tabs.sticky, navigation.indexes, navigation.prune, navigation.top, navigation.tracking, navigation.footer, ${opts.offline ? "" : "navigation.instant, navigation.instant.progress, "}search.suggest, search.highlight, search.share, content.tabs.link, content.code.copy, content.tooltips, toc.follow]`,
    // v2.1: the site's own colours (extra.css defines the variables
    // `primary: custom` leaves to the site, for both schemes)
    "  palette:",
    '    - media: "(prefers-color-scheme: light)"',
    "      scheme: default",
    "      primary: custom",
    "      accent: custom",
    "      toggle: { icon: material/brightness-7, name: Dark }",
    '    - media: "(prefers-color-scheme: dark)"',
    "      scheme: slate",
    "      primary: custom",
    "      accent: custom",
    "      toggle: { icon: material/brightness-4, name: Light }",
    // v2.1: the badges' tooltips
    "extra:",
    "  status:",
    `    new: ${y(`Edited in the last ${NEW_DAYS} days`)}`,
    '    draft: "Machine-generated, unreviewed"',
    "extra_css:",
    "  - stylesheets/extra.css",
    "extra_javascript:",
    "  - javascripts/tables.js",
    `copyright: ${y(`Rendered by pipeline/wiki.mjs ${WIKI_VERSION} from the LRS Doc Index catalog — a render, not a source.`)}`,
    "plugins:",
    "  - search:",
    // Material's recommended tokenizer: split on punctuation and
    // camelCase too, so TC-P01, ps-location-referencing#4855 and
    // merge-events are found by their parts
    `      separator: '[\\s\\-,:!=\\[\\]()"\`/]+|\\.(?!\\d)|&[lg]t;|(?!\\b)(?=[A-Z][a-z])'`,
    // v2.0: the figure's alt text is its caption in the lightbox too
    "  - glightbox:",
    "      auto_caption: true",
    "      caption_position: bottom",
    // v2.0, opt-in: Material's own offline plugin, for a `site/` folder
    // opened from disk rather than served (search needs it there). It
    // forces `use_directory_urls: false`, hence off by default.
    opts.offline ? "  - offline" : "",
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
    "  - md_in_html",
    "  - admonition",
    // the collapsible admonition forms (??? / ???+). Material's
    // admonitions reference pairs these with pymdownx.superfences for a
    // fenced block nested inside one — that extension is configured
    // below, with the mermaid custom fence, and serves both purposes.
    "  - pymdownx.details",
    "  - fenced_code",
    "  - sane_lists",
    // a case's fields, and About's provenance list (v1.8)
    "  - def_list",
    // v2.1: GFM footnotes (`[^1]`), the dialect's last gap
    "  - footnotes",
    // v2.1: pymdown's Blocks — the case card (`//// html |
    // div.lrs-case`) and the Expected result admonition nested in it;
    // the `!!!` form stays for the flat blocks
    "  - pymdownx.blocks.html",
    "  - pymdownx.blocks.admonition",
    "  - pymdownx.tasklist:",
    "      custom_checkbox: true",
    "  - pymdownx.emoji:",
    "      emoji_index: !!python/name:material.extensions.emoji.twemoji",
    "      emoji_generator: !!python/name:material.extensions.emoji.to_svg",
    "  - toc:",
    "      permalink: true",
    '      toc_depth: "2-3"',
    // Material's own diagram support (its `mermaid` custom fence), so a
    // hand-written page can carry a ```mermaid block. It supersedes
    // fenced_code for fenced blocks without changing how they render,
    // and it is what makes the panzoom plugin above do the job it was
    // built for — its default selectors are `.mermaid` and `.d2`.
    // NOTE the diagram is drawn in the READER's browser from
    // https://unpkg.com/mermaid@11 (Material lazy-loads it; nothing is
    // bundled), so a viewer with no route to unpkg.com sees the block
    // as text. Nothing in the generated corpus emits mermaid — the
    // sidecars are rendered from Office documents, and generated
    // figures stay SVG files, since those must also reach SharePoint,
    // draft2docx/draft2pptx and svg2pptx.
    "  - pymdownx.superfences:",
    "      custom_fences:",
    "        - name: mermaid",
    "          class: mermaid",
    "          format: !!python/name:pymdownx.superfences.fence_code_format",
    // v2.0: GFM's ~~strikethrough~~ (the dialect's, python-markdown has
    // none); subscript off, so "~5 minutes" in a body stays text
    "  - pymdownx.tilde:",
    "      subscript: false",
    ...magiclink,
    "nav:",
    ...nav,
    "",
  ].filter((l) => l !== "").join("\n");
}

/** docs/javascripts/tables.js (v1.7). Material's data-tables reference
 *  reaches sortable tables by loading `tablesort` from a public CDN;
 *  this site is served from a devtopia Pages build on the internal
 *  network, where an external script is the one thing that can fail
 *  silently, so the render writes the behaviour itself. Same result,
 *  no runtime dependency, and it sorts only the tables the render
 *  composes (`.doc-table` and `.sortable`) — never the metadata card,
 *  never a table extracted out of a source document. */
const TABLES_JS = `/* generated by pipeline/wiki.mjs — overwritten on every render */
(function () {
  var SELECTOR = ".doc-table table, .sortable table";

  /* A cell's sort key. A whole-cell number sorts numerically; the
     site's dates are already ISO-ish ("2026-09-06 23:00"), so they
     sort correctly as text; everything else is case-folded text.
     An em dash is the render's "nothing to say" and counts as empty. */
  function key(cell) {
    var t = (cell.textContent || "").trim();
    if (t === "—") return "";
    if (/^-?[0-9][0-9,]*(\\.[0-9]+)?$/.test(t)) return parseFloat(t.replace(/,/g, ""));
    return t.toLowerCase();
  }

  function sortBy(table, col, dir) {
    var body = table.tBodies[0];
    if (!body) return;
    var rows = Array.prototype.slice.call(body.rows);
    var keyed = rows.map(function (row, i) {
      return { row: row, key: row.cells[col] ? key(row.cells[col]) : "", i: i };
    });
    /* empty cells last whichever way the column is sorted */
    var filled = keyed.filter(function (r) { return r.key !== ""; });
    var blank = keyed.filter(function (r) { return r.key === ""; });
    filled.sort(function (a, b) {
      var c = typeof a.key === "number" && typeof b.key === "number"
        ? a.key - b.key
        : String(a.key).localeCompare(String(b.key), undefined, { numeric: true });
      return (c || a.i - b.i) * dir;   /* a stable tie-break on the original order */
    });
    filled.concat(blank).forEach(function (r) { body.appendChild(r.row); });
  }

  function makeSortable(table) {
    var head = table.tHead && table.tHead.rows[0];
    if (!head || table.dataset.lrsSortable) return;
    table.dataset.lrsSortable = "1";
    Array.prototype.forEach.call(head.cells, function (th, col) {
      th.setAttribute("role", "button");
      th.setAttribute("tabindex", "0");
      th.setAttribute("aria-sort", "none");
      function toggle() {
        var dir = th.getAttribute("aria-sort") === "ascending" ? -1 : 1;
        Array.prototype.forEach.call(head.cells, function (o) { o.setAttribute("aria-sort", "none"); });
        th.setAttribute("aria-sort", dir === 1 ? "ascending" : "descending");
        sortBy(table, col, dir);
      }
      th.addEventListener("click", toggle);
      th.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });
  }

  /* ---- v2.0: type-to-filter ---------------------------------------
     A ".filterable" wrapper gets one box for its table; a ".filter-all"
     wrapper (the test-case catalog) gets one box for every table under
     it, and a heading whose tables all emptied folds away with them.
     Terms are ANDed, case-folded, matched against the row's text. */
  var FILTER_MIN_ROWS = 6;

  function rowsOf(table) { return table.tBodies[0] ? Array.prototype.slice.call(table.tBodies[0].rows) : []; }

  function filterRows(table, terms) {
    var shown = 0;
    rowsOf(table).forEach(function (row) {
      var text = (row.textContent || "").toLowerCase();
      var hit = terms.every(function (t) { return text.indexOf(t) >= 0; });
      row.hidden = !hit;
      if (hit) shown++;
    });
    return shown;
  }

  function filterBox(total, apply) {
    var box = document.createElement("div");
    box.className = "lrs-filter";
    var input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Filter " + total + " rows\\u2026";
    input.setAttribute("aria-label", "Filter the table rows");
    input.autocomplete = "off";
    input.spellcheck = false;
    var count = document.createElement("span");
    count.className = "lrs-filter__count";
    count.setAttribute("aria-live", "polite");
    input.addEventListener("input", function () {
      var terms = input.value.toLowerCase().split(/\\s+/).filter(Boolean);
      var shown = apply(terms);
      count.textContent = terms.length ? shown + " of " + total : "";
    });
    box.appendChild(input);
    box.appendChild(count);
    return box;
  }

  function makeFilterable(wrap) {
    var table = wrap.querySelector("table");
    if (!table || wrap.dataset.lrsFilter) return;
    var total = rowsOf(table).length;
    if (total < FILTER_MIN_ROWS) return;
    wrap.dataset.lrsFilter = "1";
    wrap.insertBefore(filterBox(total, function (terms) { return filterRows(table, terms); }), wrap.firstChild);
  }

  function makeFilterAll(wrap) {
    var tables = Array.prototype.slice.call(wrap.querySelectorAll("table"));
    if (!tables.length || wrap.dataset.lrsFilter) return;
    var total = tables.reduce(function (n, t) { return n + rowsOf(t).length; }, 0);
    if (total < FILTER_MIN_ROWS) return;
    wrap.dataset.lrsFilter = "1";
    wrap.insertBefore(filterBox(total, function (terms) {
      var shown = tables.reduce(function (n, t) { return n + filterRows(t, terms); }, 0);
      /* a heading owns everything up to the next heading; fold the
         group when none of its rows survived */
      var head = null, group = [];
      function flush() {
        if (!head) return;
        var any = group.some(function (el) {
          return Array.prototype.some.call(el.querySelectorAll("tbody tr"), function (r) { return !r.hidden; });
        });
        var hide = terms.length > 0 && !any;
        head.hidden = hide;
        group.forEach(function (el) { el.hidden = hide; });
      }
      Array.prototype.forEach.call(wrap.children, function (el) {
        if (/^H[1-6]$/.test(el.tagName)) { flush(); head = el; group = []; }
        else if (head) group.push(el);
      });
      flush();
      return shown;
    }), wrap.firstChild);
  }

  /* ---- v2.0: external links open in a new tab ----------------------
     The Source button, the issue tracker, the Esri documentation — a
     reader following one should not lose their place in the wiki.
     (mkdocs-open-in-new-tab does exactly this; it is a dozen lines,
     so the render carries them rather than another package.) */
  function externalLinks() {
    Array.prototype.forEach.call(document.querySelectorAll(".md-content a[href]"), function (a) {
      if (a.dataset.lrsExt) return;
      a.dataset.lrsExt = "1";
      if (/^https?:/i.test(a.getAttribute("href") || "") && a.hostname && a.hostname !== location.hostname) {
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
  }

  function scan() {
    document.querySelectorAll(SELECTOR).forEach(makeSortable);
    document.querySelectorAll(".filterable").forEach(makeFilterable);
    document.querySelectorAll(".filter-all").forEach(makeFilterAll);
    externalLinks();
  }

  /* Material re-renders the article on instant navigation; document$
     fires on every page. Without the theme's observable, run once. */
  if (typeof document$ !== "undefined") document$.subscribe(scan);
  else document.addEventListener("DOMContentLoaded", scan);
})();
`;

/** docs/stylesheets/extra.css (v1.4; v2.1 the palette, the custom
 *  block types and the typography). Material's own variables
 *  throughout, so the light and the slate palette both work. */
const EXTRA_CSS = `/* generated by pipeline/wiki.mjs — overwritten on every render */

/* the site's palette (v2.1): mkdocs.yml says \`primary: custom\` /
   \`accent: custom\` and leaves these to the site — a deep blue for the
   header, the tabs and the links, a teal for hover and focus. Slate
   gets lighter link and accent inks, which Material would otherwise
   only provide for its own named colours. */
:root {
  --md-primary-fg-color: #1f4e79;
  --md-primary-fg-color--light: #3b6ea5;
  --md-primary-fg-color--dark: #163a5c;
  --md-primary-bg-color: #ffffff;
  --md-primary-bg-color--light: #ffffffb3;
  --md-accent-fg-color: #0e7c7b;
  --md-accent-fg-color--transparent: #0e7c7b1a;
  --md-accent-bg-color: #ffffff;
  --md-accent-bg-color--light: #ffffffb3;
  --lrs-radius: 0.4rem;
  --lrs-draft: #d97706;
  --lrs-related: #5b6b7f;
  --lrs-docs: #6d4fc2;
}
[data-md-color-scheme="slate"] {
  --md-typeset-a-color: #8ab4f8;
  --md-accent-fg-color: #2dd4bf;
  --md-accent-fg-color--transparent: #2dd4bf1a;
  --lrs-related: #94a3b8;
  --lrs-docs: #a78bfa;
}

/* type and rhythm (v2.1): a firmer title, an icon in the site's blue
   beside it, a rule under every section heading */
.md-typeset h1 { font-weight: 700; letter-spacing: -0.01em; color: var(--md-default-fg-color); }
.md-typeset h1 .twemoji { color: var(--md-primary-fg-color); vertical-align: -0.12em; margin-right: 0.1em; }
.md-typeset h2 { padding-bottom: 0.25em; border-bottom: 1px solid var(--md-default-fg-color--lightest); }

/* tables fill the column (Material inlines them); the long column wraps */
.md-typeset .md-typeset__table { display: block; }
.md-typeset .md-typeset__table table:not([class]) { display: table; width: 100%; }

/* the document header: a key/value card, not a two-column table */
.doc-meta .md-typeset__scrollwrap { margin: 0 0 1.2em; }
.doc-meta table:not([class]) {
  font-size: 0.72rem;
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: var(--lrs-radius);
  background: var(--md-code-bg-color);
  box-shadow: none;
  overflow: hidden;
}
.doc-meta table:not([class]) thead { display: none; }
.doc-meta table:not([class]) td {
  border-top: 1px solid var(--md-default-fg-color--lightest);
  padding: 0.5em 0.9em;
  vertical-align: top;
}
.doc-meta table:not([class]) tr:first-child td { border-top: 0; }
.doc-meta table:not([class]) td:first-child {
  width: 6.5em;
  white-space: nowrap;
  padding-top: 0.7em;
  color: var(--md-default-fg-color--light);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.doc-meta table:not([class]) td:first-child strong { font-weight: 600; }

/* a test case is ONE card (v2.1): the heading is its head, the
   .lrs-case wrapper its body — the fields a label/value grid, the
   expected result (a success admonition) a green row of that grid,
   the label column shared so everything lines up */
.md-typeset h3[id^="tc-"] {
  margin: 1.6em 0 0;
  padding: 0.5em 0.9em;
  border: 1px solid var(--md-default-fg-color--lightest);
  border-left: 0.2rem solid var(--md-primary-fg-color);
  border-radius: var(--lrs-radius) var(--lrs-radius) 0 0;
  background: var(--md-code-bg-color);
  font-size: 0.8rem;
  font-weight: 600;
}
.md-typeset h3[id^="tc-"] .headerlink { font-weight: 400; }
.md-typeset .lrs-case {
  margin: 0 0 1.2em;
  padding: 0.7em 0.9em 0.5em;
  border: 1px solid var(--md-default-fg-color--lightest);
  border-top: 0;
  border-left: 0.2rem solid var(--md-primary-fg-color);
  border-radius: 0 0 var(--lrs-radius) var(--lrs-radius);
  font-size: 0.72rem;
}
.md-typeset .lrs-case > :first-child { margin-top: 0; }
.md-typeset .lrs-case > :last-child { margin-bottom: 0; }
.md-typeset .lrs-case dl {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  column-gap: 1em;
  row-gap: 0.45em;
  margin: 0 0 0.6em;
}
.md-typeset .lrs-case dl dt {
  margin: 0;
  padding: 0.1em 0 0 1.5em;
  color: var(--md-default-fg-color--light);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}
.md-typeset .lrs-case dl dd { margin: 0; }
.md-typeset .lrs-case dl dd > ul, .md-typeset .lrs-case dl dd > ol { margin-top: 0; margin-bottom: 0; }
.md-typeset .lrs-case dl dd > ul.task-list { margin-left: 1.5em; }
.md-typeset .lrs-case .admonition.success {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  column-gap: 1em;
  align-items: start;
  margin: 0 -0.9em 0.6em;
  padding: 0.45em 0.9em;
  border: 0;
  border-radius: 0;
  background: rgba(0, 200, 83, 0.09);
  box-shadow: none;
  font-size: 0.72rem;
}
.md-typeset .lrs-case .admonition.success > .admonition-title {
  position: relative;
  margin: 0;
  padding: 0.1em 0 0 1.5em;
  background: none;
  border: 0;
  font-size: 0.68rem;
  font-weight: 600;
}
.md-typeset .lrs-case .admonition.success > .admonition-title::before { top: 0.05em; left: 0; width: 1em; height: 1em; }
.md-typeset .lrs-case .admonition.success > :not(.admonition-title) { margin: 0; }
.md-typeset .lrs-case figure { margin: 0.6em auto; }
.md-typeset .lrs-case .md-typeset__table { margin: 0.4em 0; }

/* admonitions (v1.6): the site's radius, a quieter body, and the
   site's own types — draft (v1.6) for machine-generated, unreviewed
   pages; related (v2.1) for a document's related list; docs (v2.1)
   for its Esri documentation links */
.md-typeset .admonition, .md-typeset details {
  border-radius: var(--lrs-radius);
  border-width: 1px 1px 1px 0.2rem;
  font-size: 0.7rem;
}
.md-typeset .admonition-title, .md-typeset summary {
  border-radius: 0;
  font-size: 0.72rem;
  letter-spacing: 0.01em;
}
.md-typeset .admonition > :last-child, .md-typeset details > :last-child { margin-bottom: 0.6rem; }
:root {
  --md-admonition-icon--draft: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25Z"/></svg>');
  --md-admonition-icon--related: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.98 2.98 0 0 0 0-4.24 2.98 2.98 0 0 0-4.24 0l-3.53 3.53a2.98 2.98 0 0 0 0 4.24m2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.98 2.98 0 0 0 0 4.24 2.98 2.98 0 0 0 4.24 0l3.53-3.53a2.98 2.98 0 0 0 0-4.24.973.973 0 0 1 0-1.42"/></svg>');
  --md-admonition-icon--docs: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.5c-1.35-.85-3.8-1.5-5.5-1.5-1.65 0-3.35.3-4.75 1.05-.1.05-.15.05-.25.05-.25 0-.5-.25-.5-.5V6c.6-.45 1.25-.75 2-1 1.11-.35 2.33-.5 3.5-.5 1.95 0 4.05.4 5.5 1.5 1.45-1.1 3.55-1.5 5.5-1.5 1.17 0 2.39.15 3.5.5.75.25 1.4.55 2 1v14.6c0 .25-.25.5-.5.5-.1 0-.15 0-.25-.05-1.4-.75-3.1-1.05-4.75-1.05-1.7 0-4.15.65-5.5 1.5M12 8v11.5c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5V7c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5m1 3.5c1.11-.68 2.6-1 4.5-1 .91 0 1.76.09 2.5.28V9.23c-.87-.15-1.71-.23-2.5-.23q-2.655 0-4.5.84zm4.5.17c-1.71 0-3.21.26-4.5.79v1.69c1.11-.65 2.6-.99 4.5-.99 1.04 0 1.88.08 2.5.24v-1.5c-.87-.16-1.71-.23-2.5-.23m2.5 2.9c-.87-.16-1.71-.24-2.5-.24-1.83 0-3.33.27-4.5.8v1.69c1.11-.66 2.6-.99 4.5-.99 1.04 0 1.88.08 2.5.24z"/></svg>');
}
.md-typeset .admonition.draft, .md-typeset details.draft { border-color: var(--lrs-draft); }
.md-typeset .draft > .admonition-title, .md-typeset .draft > summary { background-color: rgba(217, 119, 6, 0.1); }
.md-typeset .draft > .admonition-title::before, .md-typeset .draft > summary::before {
  background-color: var(--lrs-draft);
  -webkit-mask-image: var(--md-admonition-icon--draft);
          mask-image: var(--md-admonition-icon--draft);
}
.md-typeset .admonition.related, .md-typeset details.related { border-color: var(--lrs-related); }
.md-typeset .related > .admonition-title, .md-typeset .related > summary { background-color: rgba(91, 107, 127, 0.1); }
.md-typeset .related > .admonition-title::before, .md-typeset .related > summary::before {
  background-color: var(--lrs-related);
  -webkit-mask-image: var(--md-admonition-icon--related);
          mask-image: var(--md-admonition-icon--related);
}
.md-typeset .admonition.docs, .md-typeset details.docs { border-color: var(--lrs-docs); }
.md-typeset .docs > .admonition-title, .md-typeset .docs > summary { background-color: rgba(109, 79, 194, 0.1); }
.md-typeset .docs > .admonition-title::before, .md-typeset .docs > summary::before {
  background-color: var(--lrs-docs);
  -webkit-mask-image: var(--md-admonition-icon--docs);
          mask-image: var(--md-admonition-icon--docs);
}

/* the related list inside its block: a list of links, the sweep's
   reason in a lighter ink */
.md-typeset .related > ul { list-style: none; margin-left: 0; }
.md-typeset .related > ul > li {
  margin: 0 0 0.4em;
  padding: 0.3em 0.7em;
  border-left: 0.15rem solid var(--md-default-fg-color--lightest);
  color: var(--md-default-fg-color--light);
}

/* definition lists (v1.8): a case's fields and About's provenance, in
   the metadata card's vocabulary — a quiet uppercase label over its value */
.md-typeset dl { margin: 0.6em 0 1.2em; }
.md-typeset dl dt {
  margin-top: 0.9em;
  color: var(--md-default-fg-color--light);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.md-typeset dl dt:first-child { margin-top: 0; }
.md-typeset dl dd { margin: 0.15em 0 0; }
.md-typeset dl dd > ul, .md-typeset dl dd > ol { margin-top: 0.3em; }

/* figures (v2.1): centred, framed, the caption in a lighter ink */
.md-typeset figure { margin: 1.2em auto; text-align: center; }
.md-typeset figure > img, .md-typeset figure .panzoom-box img {
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: var(--lrs-radius);
}
.md-typeset figcaption {
  margin: 0.5em auto 0;
  max-width: 40em;
  color: var(--md-default-fg-color--light);
  font-size: 0.68rem;
  font-style: normal;
}

/* sortable catalog tables (v1.7): the header is the control */
.doc-table th[role="button"], .sortable th[role="button"] {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
.doc-table th[role="button"]:hover, .sortable th[role="button"]:hover { color: var(--md-accent-fg-color); }
.doc-table th[aria-sort]::after, .sortable th[aria-sort]::after {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 0.4em;
  vertical-align: middle;
  border: 0.25em solid transparent;
}
.doc-table th[aria-sort="none"]::after, .sortable th[aria-sort="none"]::after {
  border-top-color: currentColor;
  opacity: 0.25;
}
.doc-table th[aria-sort="ascending"]::after, .sortable th[aria-sort="ascending"]::after { border-bottom-color: currentColor; }
.doc-table th[aria-sort="descending"]::after, .sortable th[aria-sort="descending"]::after { border-top-color: currentColor; }

/* catalog tables: the short columns stay on one line (v2.0: every
   column after the title, since a Kind column may be present);
   v2.1: striped rows, the title column keeps a readable width */
.doc-table td:not(:first-child) { white-space: nowrap; }
.doc-table td:first-child { min-width: 11rem; }
.doc-table tbody tr:nth-child(even), .sortable tbody tr:nth-child(even) { background: var(--md-code-bg-color); }

/* the type-to-filter box (v2.0), in Material's own vocabulary */
.lrs-filter { display: flex; align-items: center; gap: 0.6em; margin: 0 0 0.8em; }
.lrs-filter input {
  flex: 1 1 auto;
  max-width: 24rem;
  padding: 0.45em 0.8em;
  font: inherit;
  font-size: 0.7rem;
  color: var(--md-default-fg-color);
  background: var(--md-default-bg-color);
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: var(--lrs-radius);
}
.lrs-filter input:focus {
  outline: none;
  border-color: var(--md-accent-fg-color);
  box-shadow: 0 0 0 0.1rem var(--md-accent-fg-color--transparent);
}
.lrs-filter__count { color: var(--md-default-fg-color--light); font-size: 0.64rem; white-space: nowrap; }
.md-typeset tr[hidden], .filter-all > [hidden] { display: none !important; }

/* the breadcrumb line above a page's title (v2.0) */
.md-typeset .lrs-crumbs { margin: 0 0 -0.6em; color: var(--md-default-fg-color--light); font-size: 0.64rem; }
.md-typeset .lrs-crumbs a { color: inherit; }
.md-typeset .lrs-crumbs a:hover { color: var(--md-accent-fg-color); }

/* the "Open <file>" button under the metadata card (v2.0; v2.1 the
   page's primary button) */
.md-typeset .lrs-open { margin: -0.4em 0 1.4em; font-size: 0.7rem; }
.md-typeset .lrs-open .twemoji { vertical-align: -0.15em; }

/* a catalog value's facts (v2.1): a strip under the title */
.md-typeset .lrs-facts {
  margin: -0.4em 0 1.2em;
  padding: 0.5em 0.9em;
  border-left: 0.2rem solid var(--md-primary-fg-color);
  border-radius: 0 var(--lrs-radius) var(--lrs-radius) 0;
  background: var(--md-code-bg-color);
  color: var(--md-default-fg-color--light);
  font-size: 0.7rem;
}
.md-typeset .lrs-facts p { margin: 0.2em 0; }

/* the cards (the front page, Browse, the figure catalog) */
.md-typeset .grid.cards > ul > li {
  border-radius: var(--lrs-radius);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.md-typeset .grid.cards > ul > li:hover { box-shadow: var(--md-shadow-z2); }
.md-typeset .grid.cards > ul > li > p:first-child { font-weight: 600; }
.md-typeset .grid.cards > ul > li > p:first-child .twemoji { color: var(--md-primary-fg-color); }
.md-typeset .grid.cards > ul > li > hr { margin: 0.6em 0; }
.md-typeset .lrs-figures > ul > li { text-align: center; font-size: 0.68rem; }
.md-typeset .lrs-figures > ul > li img {
  display: block;
  margin: 0 auto 0.5em;
  width: 100%;
  max-width: 160px;
  height: auto;
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: var(--lrs-radius);
}
`;

/* The workflow the wiki repository carries. BRANCH and RUNS_ON are
 * substituted at render time — RUNS_ON from `wiki.runsOn`, because
 * "ubuntu-latest" is a github.com label: an Enterprise Server host
 * (devtopia) has no GitHub-hosted runners, so a job asking for it
 * queues forever instead of failing. There the label is whatever a
 * self-hosted runner advertises, usually "self-hosted". This file is
 * REWRITTEN on every run, so the label has to come from config — a
 * hand edit in the wiki repository survives exactly until the next
 * push. */
/* The actions/setup-python step, omitted when `wiki.setupPython` is
 * false. It downloads and installs a Python build into the runner's
 * tool cache — routine on a GitHub-hosted runner, but a self-hosted
 * Windows runner with no tool cache fails it outright ("Error happened
 * during Python installation"). A machine that already has Python on
 * PATH does not need the step at all.
 *
 * The pip and mkdocs steps go through `python -m` rather than the
 * bare commands: on Windows, pip drops mkdocs.exe into a Scripts
 * folder the job shell may not have on PATH ("The term 'mkdocs' is
 * not recognized"), and `python -m` binds both steps to the same
 * interpreter whatever the PATH looks like. */
const SETUP_PYTHON_STEP =
  "      - uses: actions/setup-python@v5\n" +
  "        with:\n" +
  "          python-version: '3.12'\n";

/* Two ways of publishing the built site, `wiki.deploy`:
 *
 *   "artifact" (default) — actions/upload-pages-artifact + deploy-pages,
 *     the github.com way (Settings > Pages > Source: GitHub Actions).
 *     upload-pages-artifact@v3 rides on upload-artifact@v4, and the v4
 *     artifact API does not exist on GitHub Enterprise Server: the job
 *     fails with "@actions/artifact v2.0.0+, upload-artifact@v4+ and
 *     download-artifact@v4+ are not currently supported on GHES".
 *   "branch" — `mkdocs gh-deploy` force-pushes the built site to the
 *     gh-pages branch of the same repository, with the checkout step's
 *     token (hence `contents: write`); Pages serves that branch
 *     (Settings > Pages > Source: Deploy from a branch, gh-pages, /).
 *     No artifact API, no deploy job, no environment — works on GHES
 *     and on github.com alike. The commit identity comes from the
 *     GIT_* variables so the runner needs no git config of its own. */
const DEPLOY_MODES = ["artifact", "branch"];

const PAGES_HEAD = `name: pages
on:
  push:
    branches: [BRANCH]
  workflow_dispatch:
`;

const PAGES_BUILD_STEPS = `      - uses: actions/checkout@v4
SETUP_PYTHON      - run: python -m pip install mkdocs-material mkdocs-glightbox mkdocs-panzoom-plugin markdown-captions
      - run: python -m mkdocs build --strict
`;

const PAGES_ARTIFACT = PAGES_HEAD + `permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: RUNS_ON
    steps:
` + PAGES_BUILD_STEPS + `      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site
  deploy:
    needs: build
    runs-on: RUNS_ON
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
`;

const PAGES_BRANCH = PAGES_HEAD + `permissions:
  contents: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: RUNS_ON
    steps:
` + PAGES_BUILD_STEPS + `      - run: python -m mkdocs gh-deploy --force --no-history --remote-branch gh-pages
        env:
          GIT_AUTHOR_NAME: pages workflow
          GIT_AUTHOR_EMAIL: pages@users.noreply.localhost
          GIT_COMMITTER_NAME: pages workflow
          GIT_COMMITTER_EMAIL: pages@users.noreply.localhost
`;

/** The generated .github/workflows/pages.yml for these wiki options. */
export function pagesWorkflow(opts) {
  return (opts.deploy === "branch" ? PAGES_BRANCH : PAGES_ARTIFACT)
    .replace("BRANCH", opts.branch)
    .replaceAll("RUNS_ON", opts.runsOn)
    .replace("SETUP_PYTHON", opts.setupPython ? SETUP_PYTHON_STEP : "");
}

const WIKI_README = (opts) => `# ${opts.siteName}

A generated MkDocs site: every page is rendered from the LRS Doc Index catalog by \`pipeline/wiki.mjs\` and overwritten on the next run. Do not edit here.

Local preview: \`pip install mkdocs-material mkdocs-glightbox mkdocs-panzoom-plugin markdown-captions && mkdocs serve\`.
Publishing: the \`pages\` workflow builds the site on every push to \`${opts.branch}\` and ${opts.deploy === "branch"
  ? "force-pushes it to the \`gh-pages\` branch, which this repository's GitHub Pages serves (Settings → Pages → Source: Deploy from a branch, gh-pages, / (root), once)"
  : "deploys it to this repository's GitHub Pages (Settings → Pages → Source: GitHub Actions, once)"}.
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
    runsOn: w.runsOn || "ubuntu-latest",
    setupPython: w.setupPython === undefined ? true : !!w.setupPython,
    deploy: w.deploy || "artifact",
    recent: Number(w.recent) || 50,
    offline: !!w.offline,
    sourceSite: w.sourceSite || cfg.sweep?.siteUrl || "",
    draftsDir: w.draftsDir || "",
  };
  if (!DEPLOY_MODES.includes(opts.deploy)) {
    throw new Error(`wiki.deploy must be one of ${DEPLOY_MODES.join(", ")}, got "${opts.deploy}"`);
  }
  const kindFolders = { ...KIND_FOLDERS, ...(cfg.sweep?.kindFolders || {}) };
  for (const [kind, folder] of Object.entries(kindFolders)) {
    if (RESERVED_DIRS.has(pageName(folder))) {
      throw new Error(`sweep.kindFolders: "${kind}" -> "${folder}" would render into docs/${pageName(folder)}/, a folder the wiki reserves (${[...RESERVED_DIRS].sort().join(", ")})`);
    }
  }
  const readPhase = prog.phase("read");
  const docs = readLibrary(libDir, kindFolders);
  const kw = readKeywordMap(workDir);
  const model = buildModel(docs, kw, { kindFolders, libDir });
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
  const missingReport = [];
  const put = (relPath, text) => { write(docsDir, relPath, text); pages++; };

  const docTick = prog.counter(docs.length, "document pages");
  for (const d of docs) {
    put(d.page, docPage(d, model));
    docTick(d.page, `${d.media.length} media file(s)`);
    for (const m of d.media) {
      const src = path.join(libDir, "media", m.dir, m.legacyPrefix ? m.legacyPrefix + m.name : m.name);
      const dst = path.join(docsDir, "media", m.dir, m.legacyPrefix ? m.legacyPrefix + m.name : m.name);
      if (d.mediaMissing?.has(m.link) || !fs.existsSync(src)) {
        mediaMissing++;
        missingReport.push(`${d.page}\t${m.link}`);
        continue;
      }
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
      mediaFiles++;
    }
  }
  renderPhase.step(`${mediaFiles} media file(s) copied, ${mediaMissing} missing — now the catalogs`);
  // the missing list, by page, so the library can be chased: the
  // pages themselves show only an italic marker where each one was
  const missingFile = path.join(workDir || outDir, "wiki-missing-media.txt");
  if (missingReport.length) {
    fs.mkdirSync(path.dirname(missingFile), { recursive: true });
    fs.writeFileSync(missingFile, "page\tlink\n" + missingReport.join("\n") + "\n");
    process.stderr.write(
      `wiki: ${mediaMissing} media link(s) have no file in the library — rendered as "(missing figure)" ` +
      `markers, listed in ${missingFile}\n`
    );
  } else if (fs.existsSync(missingFile)) {
    fs.unlinkSync(missingFile); // a clean run retires the stale list
  }
  for (const [kind, ds] of model.kinds) put(`${pageName(kindFolders[kind] || kind)}/index.md`, kindIndex(kind, ds, model, kindFolders));
  put("documents/index.md", allDocumentsPage(model));
  for (const c of CATALOGS) {
    const groups = model[c.key];
    put(`${c.section}/index.md`, catalogIndex(c, groups, model));
    for (const [value, ds] of groups) put(catalogPage(c.section, value), catalogValuePage(c, value, ds, model));
    renderPhase.step(`${c.section} — ${groups.size} page(s)`);
  }
  put("browse/index.md", browsePage(model));
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
  write(docsDir, "stylesheets/extra.css", EXTRA_CSS);
  write(docsDir, "javascripts/tables.js", TABLES_JS);
  write(outDir, "mkdocs.yml", mkdocsYml(model, kindFolders, opts, drafts));
  write(outDir, ".github/workflows/pages.yml", pagesWorkflow(opts));
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

/** The interpreter `--build` runs mkdocs through: `wiki.python`, else
 *  `llm.python`, else LRSDOC_PYTHON, else `python` on Windows and
 *  `python3` elsewhere — the same rule as llm.mjs. */
export function pythonFor(cfg) {
  return cfg?.wiki?.python || cfg?.llm?.python || process.env.LRSDOC_PYTHON ||
    (process.platform === "win32" ? "python" : "python3");
}

/** `python -m mkdocs build --strict` in outDir. Through the interpreter
 *  rather than a bare `mkdocs`: on Windows pip drops mkdocs.exe into a
 *  Scripts folder that is usually not on PATH ("spawnSync mkdocs
 *  ENOENT"), while `python -m` finds the package wherever that
 *  interpreter installed it — the same reason the generated pages.yml
 *  runs it this way. */
export function buildSite(outDir, python = pythonFor()) {
  try {
    return run(python, ["-m", "mkdocs", "build", "--strict"], outDir);
  } catch (e) {
    if (/No module named mkdocs/.test(e.message) || /ENOENT/.test(e.message)) {
      throw new Error(
        `${e.message}\nmkdocs is not installed for "${python}" — ` +
        `${python} -m pip install mkdocs-material mkdocs-glightbox mkdocs-panzoom-plugin markdown-captions ` +
        "(or point wiki.python / LRSDOC_PYTHON at the interpreter that has it)"
      );
    }
    throw e;
  }
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
      buildSite(cfg._out, pythonFor(cfg));
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
