#!/usr/bin/env node
/**
 * wiki.mjs v2.6 — the catalog as a wiki: every sidecar rendered into
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
 * v2.6 — the next pages (docs/design/Wiki_Home_Page.md §5):
 *
 *   - BREADCRUMBS are the theme's (`navigation.path`, free since
 *     Material 9.7): "Documents › Test Plans" over a plan, "Browse ›
 *     Keywords" over a keyword, each crumb linking its index page —
 *     the render's own crumb line (v2.0) is gone. The front page
 *     hides them with its sidebars.
 *   - A DOCUMENT PAGE'S HEAD IS TABS: Summary · Related · Esri
 *     documentation, one tab set under the facts strip instead of
 *     three stacked boxes, when the page has two or more of them; a
 *     page with one keeps its block. The sweep's no-summary warning
 *     stays a warning inside the Summary tab.
 *   - A GLOSSARY from the official vocabulary (pipeline/data/
 *     lrs_vocabulary.json, the tools, widgets, ribbon tools, apps,
 *     REST operations, terms and aliases doc_vocab.mjs keeps): every
 *     entry with a definition is a Markdown abbreviation the render
 *     writes to `includes/glossary.md` and `pymdownx.snippets`
 *     appends to every page, so a term in a test step, a pill or a
 *     heading carries its definition as a tooltip (`abbr`, drawn by
 *     `content.tooltips`). Single ordinary-word terms (Route, Event,
 *     Line, Measure …) are on the Glossary page but are not
 *     tooltips — they would underline half the corpus. The Glossary
 *     page (`glossary.md`, in the Browse tab) lists every entry by
 *     kind with its Esri link and, for a tool the corpus names, the
 *     way to its documents; the filter box now filters a definition
 *     list as it filters a table.
 *   - The SMALL CATALOGS — Surfaces, Products, Releases — are facet
 *     bars on their index pages, every value; Keywords, Tools,
 *     People and Issues keep their filterable tables.
 *
 * v2.5 — the front page as a landing page (docs/design/
 * Wiki_Home_Page.md: the Material reference and setup pages reviewed
 * page by page, what was adopted and what was passed over). The page
 * was a document — a paragraph, a tip box, one card, a table, eleven
 * cards — and read like one. Now:
 *
 *   - A HERO between the tab bar and the article: the site's name,
 *     what it is, a Search button that opens Material's own search
 *     (`/` works too), an Every-document button, the search hint, and
 *     the corpus in numbers — documents, test cases, figures, tools,
 *     keywords, people — as tiles that link the pages they count. It
 *     is a template override, `overrides/home.html`, the pattern
 *     Material's own landing page uses (`custom_dir`, `extends
 *     "main.html"`, the `tabs` block), chosen by `template: home.html`
 *     in the page's front matter and fed by its `hero:` front matter;
 *     the `content` block prints the body alone, so no "Home" H1. The
 *     nav and the table of contents are hidden (`hide:`), so the
 *     sections take the column.
 *   - The corpus in CONTENT TABS (pymdown's Blocks `tab`, Material's
 *     alternate style): by kind, the cards; by surface, product and
 *     release, FACET BARS — a value, a bar scaled to the largest count,
 *     the count — the corpus's shape at a glance, the top eight and
 *     the way to the whole catalog.
 *   - The recent edits as a FEED, not a table: the kind's icon, the
 *     title, the kind and product in a lighter ink, the date at the
 *     right. Eight rows need no header to sort.
 *   - Browse (the seven catalogs) and More (test cases, figures,
 *     recent, drafts, about) as two card grids, the counts on the
 *     cards.
 *   - Site-wide, from the same review: every index page carries
 *     Material's `icon:` front matter, so the tab bar and the sidebar
 *     wear the kind's and the catalog's icons; `theme.font: false`
 *     with the system faces named in extra.css — an internal site
 *     must not block on a Google Fonts request; instant prefetch and
 *     footnote tooltips, free since Material 9.7 made every Insiders
 *     feature public. Passed over, with the reasons in the design
 *     note: social cards and optimize (Cairo and pngquant on a
 *     self-hosted Windows runner), typeset and projects (deprecated),
 *     privacy (build-time fetches under --strict), tags (Keywords
 *     already is one), the blog.
 *
 * v2.4 — the ledger and the checklist (docs/design/
 * Wiki_Kind_Layout_Variations.md, the variations chosen). pymdown's
 * Blocks `details` plugin joins mkdocs.yml for both.
 *
 *   - A kind's index page is a LEDGER (`wiki.kindLayout`, default
 *     "ledger"; "table" keeps the v2.0 table): the documents grouped
 *     by surface — Pro, Experience Builder, REST, Server, Enterprise,
 *     each a details section open by default, so a reader folds away
 *     the surfaces that are not theirs — then by the tools they name,
 *     a document listed under EVERY tool it names. A document is a
 *     closed details row: the title, its other tools as pills, the
 *     edit date; opened, the facts line (product, release, surfaces,
 *     cases, PE) and the summary. `tables.js` filters the rows and
 *     folds a tool head or a surface section whose rows all hid.
 *   - A document page opens with a FACTS STRIP — the tools as pills,
 *     the Open link at the right of that row, then kind · surface ·
 *     product · release · edited by whom — and the full metadata table
 *     folded under a closed `Details` block; the format 3.1 rows are
 *     unchanged, only their place on the page is. Drafts keep their
 *     four-row table in the open.
 *   - The test cases are a CHECKLIST: a count line (`5 cases · 3
 *     positive · 2 negative`) before the first case, a group as a
 *     divider over its run of cases (the source's casing, its count
 *     beside it), the case id a badge in a gutter beside the title —
 *     green for a positive case, amber for a negative one; the id
 *     already said so — and the body hanging under the title with no
 *     box: the Case line as a lead sentence (mdlayout v1.6 bares it
 *     too), the steps with their checkboxes, the Expected result one
 *     green line, a hairline to close. `wrapCases` writes the count
 *     line, the dividers and the badge span; anchors, the table of
 *     contents and search see the same heading text as before.
 *
 * v2.3 — the case card without its two loudest labels. "Group" and
 * "Steps" said nothing a reader of the card did not already see:
 * the group is a category, the steps are the case. `lib/mdlayout.mjs`
 * v1.5 writes each as a class-named html block with the content alone
 * (`FIELD_BARE`), and the stylesheet draws the group as a quiet line
 * over the card's content and the steps as the procedure, flush with
 * the card; Case and Trace keep the label/value grid, the Expected
 * result stays the green row.
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
 *     Browse, "Test cases" and Drafts in a tab bar (v2.3: Figures left
 *     the nav); each kind
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
import { loadVocabulary, TOOL_KINDS } from "./lib/vocabulary.mjs";

export const WIKI_VERSION = "v2.6";

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

/** The seven catalogs, in the order the nav and the Browse page show
 *  them: section (the folder), title, the model key, the index page's
 *  intro, the column label, the card icon and the card blurb.
 *  Surfaces (sweep v1.66) is the seventh: every surface a document
 *  covers — its Doc row's primary plus the sidecar's Surfaces row — so
 *  a reader filters the corpus by Pro, Experience Builder or REST. */
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
  { section: "surfaces", title: "Surfaces", key: "surfaces", label: "Surface", icon: "monitor-cellphone",
    intro: "Where the work runs — Pro, Experience Builder, REST, Server, Enterprise. A document is listed under every surface it covers.",
    blurb: "Pro, Experience Builder, REST, Server, Enterprise — every surface a document covers." },
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

/** The ledger's sections in reader order (v2.4). A surface the corpus
 *  has and this list lacks follows alphabetically; a document with no
 *  surface sits under "No surface", last. */
const SURFACE_ORDER = ["Pro", "Experience Builder", "REST", "Server", "Enterprise"];
const NO_SURFACE = "\u0000none";
const NO_TOOL = "\u0000none";
/** `wiki.kindLayout`: the ledger (v2.4) or the v2.0 table. */
const KIND_LAYOUTS = ["ledger", "table"];

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
  const out = [...pageMeta({ boost: 0.5, status: "draft" }),
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
  const out = [...pageMeta({ exclude: true, title: "Test-plan drafts", icon: "file-document-edit" }), h1("file-document-edit", "Test-plan drafts"), "",
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
    // v2.2: the Surfaces row when the sidecar has one, else the Doc
    // row's primary (never Other — a document with no surface is not
    // filed under one)
    surfaces: group((d) => surfacesOf(d.meta)),
    releases: group((d) => [d.meta.target_release]),
    people: group((d) => [...new Set([d.meta.author, d.meta.pe, d.meta.dev].filter(Boolean))]),
    issues: group((d) => d.issues.map((i) => i.ref)),
    issueUrls,
    // v2.0: the issue tracker's origin, read off the corpus's own issue
    // links, so `Org/repo#123` shorthand in a body links the right host
    // (devtopia, not github.com) with nothing to configure
    issueHost: issueHostOf(issueUrls),
    keywordKinds: kw.kinds,
    // v2.6: the official vocabulary's glossary entries (none without
    // the file — the About and Browse cards then say so by their count)
    glossary: opts.glossary || [],
  };
}

/** Every surface a document covers, primary first: the sidecar's
 *  Surfaces row, or its Doc row's surface alone; Other is no surface. */
export function surfacesOf(meta) {
  const out = [];
  for (const x of [meta?.surface, ...(meta?.surfaces || [])]) {
    const v = String(x || "").trim();
    if (v && v !== "Other" && v !== "—" && !out.includes(v)) out.push(v);
  }
  return out;
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

/** A case heading, split: `### TC-P01 — Title { #tc-p01 }` ->
 *  [id, title, anchor]. The dash may be an em dash, an en dash or a
 *  hyphen; the anchor is optional. */
const CASE_HEAD = /^### (TC-[A-Za-z]?\d[\w.-]*)[ \t]+(?:—|–|-)[ \t]+(.*?)([ \t]*\{[ \t]*#[^}]+\})?[ \t]*$/;
/** P for a positive case, N for a negative one, "" otherwise. */
const caseClass = (id) => { const m = /^TC-([A-Za-z])/.exec(id); return m ? m[1].toUpperCase() : ""; };

/** The heading with its id as a badge (v2.4): `### <span class="lrs-tc
 *  lrs-tc--p">TC-P01</span> <span class="lrs-tc-title">Title</span>
 *  { #tc-p01 }`. The heading's text is the same words, so the toc,
 *  search and a derived id are unchanged; a heading not in the id —
 *  title shape is left alone. v2.6 wraps the title: the heading is a
 *  flex row, and a glossary abbreviation inside a bare title would be
 *  a flex item of its own, with the row's gap either side of it. */
export function badgeHeading(line) {
  const m = CASE_HEAD.exec(line);
  if (!m) return line;
  const c = caseClass(m[1]);
  const mod = c === "P" ? " lrs-tc--p" : c === "N" ? " lrs-tc--n" : "";
  return `### <span class="lrs-tc${mod}">${m[1]}</span> <span class="lrs-tc-title">${m[2]}</span>${m[3] || ""}`;
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
 *  alone — they are sections, not cards.
 *
 *  v2.4, the checklist: a count line before the first case, a divider
 *  where the group changes (read off the case's own `lrs-group` block,
 *  which the stylesheet then hides), and the id as a badge in the
 *  heading. */
export function wrapCases(body) {
  const { lines, spans } = caseSpans(body);
  const cases = spans.filter((s) => /^### /.test(lines[s.start]));
  if (!cases.length) return String(body ?? "");
  const groupOf = (s) => {
    const m = /^\/\/\/ html \| div\.lrs-group\n\n([^\n]+)\n\/\/\/$/m.exec(lines.slice(s.start + 1, s.end).join("\n"));
    return m ? m[1].trim() : "";
  };
  const idOf = (s) => (CASE_HEAD.exec(lines[s.start]) || /^### (TC-\S+)/.exec(lines[s.start]) || [])[1] || "";
  const counts = new Map();
  let nPos = 0, nNeg = 0;
  for (const s of cases) {
    const g = groupOf(s);
    counts.set(g, (counts.get(g) || 0) + 1);
    const c = caseClass(idOf(s));
    if (c === "P") nPos++; else if (c === "N") nNeg++;
  }
  const n = cases.length, nOther = n - nPos - nNeg;
  const countLine = `<p class="lrs-cases-count">${n} case${n === 1 ? "" : "s"}` +
    (nPos || nNeg ? ` · ${nPos} positive · ${nNeg} negative${nOther ? ` · ${nOther} unclassified` : ""}` : "") + "</p>";
  const out = [];
  let at = 0, last = null;
  cases.forEach((s, i) => {
    out.push(...lines.slice(at, s.start));
    if (out.length && out[out.length - 1].trim() !== "") out.push("");
    if (i === 0) out.push(countLine, "");
    const g = groupOf(s);
    if (g && g !== last) {
      const k = counts.get(g);
      out.push(`<div class="lrs-group-head">${g} <small>${k} case${k === 1 ? "" : "s"}</small></div>`, "");
      last = g;
    }
    out.push(badgeHeading(lines[s.start]), "",
      block("html", lines.slice(s.start + 1, s.end).join("\n"), { title: "div.lrs-case", depth: 4 }), "");
    at = s.end;
  });
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
const pageMeta = ({ boost, exclude, status, title, icon } = {}) => {
  const lines = [];
  if (title) lines.push(`title: ${JSON.stringify(String(title))}`);
  // v2.5: Material's `icon:` front matter — the same icon the H1
  // wears, beside the page in the sidebar and on its tab
  if (icon) lines.push(`icon: material/${icon}`);
  if (exclude) lines.push("search:", "  exclude: true");
  else if (boost !== undefined) lines.push("search:", `  boost: ${boost}`);
  if (status) lines.push(`status: ${status}`);
  return lines.length ? ["---", ...lines, "---", ""] : [];
};

/** A page title with its icon (v2.1): `# :material-test-tube: Test
 *  Plans`. pymdownx.emoji draws the icon; the front matter's `title`
 *  keeps the browser title and the search entry to the words. */
const h1 = (icon, text) => `# :material-${icon}: ${mdEscape(text)}`;

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

/** The related list (v2.1): each bullet links the sibling page, with
 *  the sweep's reason after the dash. */
function relatedList(d) {
  return d.related.map((r) => {
    const target = r.target ? link(d.page, r.target.page, r.target.meta.title || r.title) : mdEscape(r.title);
    return `- ${target}${r.text ? ` — ${r.text}` : ""}`;
  }).join("\n");
}

/** The related list as a foldable `related` block (v2.1, a custom
 *  type with the link icon; open by default) — a page whose head has
 *  nothing else keeps it. */
function relatedBlock(d) {
  return admonition("related", relatedList(d), {
    title: `Related documents (${d.related.length})`, collapse: "open",
  }).trimEnd();
}

/** The sweep's Esri-documentation region minus its own heading. */
function docsList(region) {
  const md = normalize(toMkDocs(stripComments(region)));
  const m = /^#{1,6}[ \t]+(.+?)[ \t]*\n/.exec(md);
  return (m ? md.slice(m[0].length) : md).trim();
}

/** The head as one tab set (v2.6): Summary · Related · Esri
 *  documentation, each label with its icon. `//// html | div.lrs-head`
 *  around the `/// tab` blocks, so the stylesheet knows these tabs
 *  from the front page's. */
function headTabs(head) {
  const tabs = head.map((h) => block("tab", h.md, { title: `:material-${h.icon}: ${h.tab}` })).join("\n");
  return block("html", tabs, { title: "div.lrs-head", depth: 4 });
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
  // v2.2: the surface links its catalog page; a document on more than
  // one surface says so in its own row, each linked
  const surfaces = surfacesOf(m);
  const surfaceLink = m.surface && m.surface !== "Other" ? link(p, catalogPage("surfaces", m.surface), m.surface) : (cell(m.surface) || "—");
  const rows = [
    ["Doc", `${m.doc_id ?? "—"} · ${kindLink} · ${surfaceLink}`, true],
    ["Surfaces", surfaces.length > 1 ? cat("surfaces", surfaces) : ""],
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
  // breadcrumb line; v2.1: the `new` badge for a recent edit.
  // v2.4: the facts strip — the tools as pills with the Open link at
  // the right of that row, then kind · surface · product · release ·
  // edited by whom — and the table folded under a closed Details
  // block (Blocks html inside Blocks details, so the card's div keeps
  // its class; the nesting shows in the slash count)
  const ext = /\.([A-Za-z0-9]{1,5})$/.exec(cell(m.source_file) || "");
  const openLink = m.source_url
    ? `[:material-open-in-new: ${ext ? `Open the .${ext[1].toLowerCase()}` : "Open the original"}](<${m.source_url}>){ .md-button .lrs-open }`
    : "";
  const strip1 = [m.tools.length ? m.tools.map((t) => pill(p, t)).join(" ") : "", openLink].filter(Boolean).join(" ");
  const edited = cell(m.last_edited).slice(0, 10);
  const strip2 = [
    kindLink,
    surfaces.length ? cat("surfaces", surfaces) : "",
    m.products.length ? cat("products", m.products) : "",
    m.target_release ? `release ${link(p, catalogPage("releases", m.target_release), m.target_release)}` : "",
    // the editor links their People page only when they have one — the
    // catalog holds authors, PEs and devs, and an editor may be none
    edited ? `edited *${edited}*{ .lrs-when }${m.last_edited_by ? ` by ${model.people.has(m.last_edited_by) ? person(m.last_edited_by) : mdEscape(m.last_edited_by)}` : ""}` : "",
  ].filter(Boolean).join(" · ");
  const table = ["| Field | Value |", "| --- | --- |"];
  for (const [k, v, always] of rows) {
    if (!always && (v === "" || v === "—")) continue;
    table.push(`| **${k}** | ${v === "" ? "—" : v} |`);
  }
  // v2.6: the theme's breadcrumbs (navigation.path) say where the
  // page sits — the v2.0 crumb line is gone
  const out = [...pageMeta({ boost: 2, status: pageStatus(m.last_edited) }),
    `# ${mdEscape(m.title || d.stem)}`, "",
    '<div class="lrs-doc-facts" markdown>', "",
    ...(strip1 ? [strip1, ""] : []),
    strip2, "",
    "</div>", "",
    block("details", block("html", table.join("\n"), { title: "div.doc-meta", depth: 4 }),
      { title: "Details", depth: 5, options: { attrs: "{class: lrs-doc-meta}" } }), ""];
  // v2.1: the head of the page by content type — summary, related,
  // documentation — each in the block that says what it is. v2.6:
  // two or more of them are one tab set (Blocks tab inside a Blocks
  // html wrapper, the nesting in the slash count); one stays a block
  const head = [];
  if (d.summary) head.push({ tab: "Summary", icon: "text-box-outline", md: normalize(toMkDocs(d.summary)), block: summaryBlock(d.summary) });
  if (d.related.length) head.push({ tab: `Related (${d.related.length})`, icon: "link-variant", md: relatedList(d), block: relatedBlock(d) });
  if (d.docsRegion) head.push({ tab: "Esri documentation", icon: "book-open-variant", md: docsList(d.docsRegion), block: docsBlock(d.docsRegion) });
  if (head.length >= 2) out.push(headTabs(head), "");
  else for (const h of head) out.push(h.block, "");
  const body = normalize(wrapCases(toMkDocs(stripComments(dropMissingMedia(d.body, d.mediaMissing)))));
  if (body) out.push("---", "", body, "");
  return out.join("\n");
}

function catalogIndex({ section, title, intro, label, icon }, groups, model) {
  const p = `${section}/index.md`;
  const n = `${groups.size} ${groups.size === 1 ? label.toLowerCase() : title.toLowerCase()}`;
  if (FACET_CATALOGS.has(section)) {
    return [...pageMeta({ exclude: true, title, icon }), h1(icon, title), "", intro, "",
      `${n}, most documents first; the bar is the share of the largest.`, "",
      facetRows(p, section, groups, model, Infinity), ""].join("\n");
  }
  const out = [...pageMeta({ exclude: true, title, icon }), h1(icon, title), "", intro, "",
    `${n}. ${TABLE_HELP}`, "",
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
  const out = [...pageMeta({ boost: 1 }),
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

/** A tool as a pill (v2.4): the link, classed for the stylesheet. */
const pill = (fromPage, tool) => `${link(fromPage, catalogPage("tools", tool), tool)}{ .lrs-pill }`;

/** One document as a closed details row (v2.4, the ledger): the
 *  summary line is the title link, the tool pills — `skip`, the tool
 *  the row sits under, left off — and the edit date; the body the
 *  facts line and the summary. Four slashes: it sits inside the
 *  surface section, a five-slash block. */
function entryRow(fromPage, d, { skip = "" } = {}) {
  const m = d.meta;
  const tools = m.tools.filter((t) => t !== skip);
  const tags = tools.length ? ` <span class="lrs-tags">${tools.map((t) => pill(fromPage, t)).join(" ")}</span>` : "";
  const when = cell(m.last_edited).slice(0, 10);
  const surfaces = surfacesOf(m);
  const nCases = planCases(d.body).length;
  const who = m.pe ? `PE ${link(fromPage, catalogPage("people", m.pe), m.pe)}`
    : m.author ? `author ${link(fromPage, catalogPage("people", m.author), m.author)}` : "";
  const facts = [
    m.products.length ? m.products.map((v) => link(fromPage, catalogPage("products", v), v)).join(" · ") : "",
    m.target_release ? `release ${link(fromPage, catalogPage("releases", m.target_release), m.target_release)}` : "",
    surfaces.length ? surfaces.map((v) => link(fromPage, catalogPage("surfaces", v), v)).join(" · ") : "",
    nCases ? `${nCases} case${nCases === 1 ? "" : "s"}` : "",
    who,
  ].filter(Boolean).join(" · ");
  const summary = d.summary ? normalize(toMkDocs(d.summary)) : "";
  return [
    `//// details | ${link(fromPage, d.page, m.title || d.stem)}${tags}${when ? ` *${when}*{ .lrs-when }` : ""}`,
    '    attrs: {class: "lrs-entry"}', "",
    ...(facts ? [`<div class="lrs-entry__facts" markdown>${facts}</div>`, ""] : []),
    ...(summary ? [summary, ""] : []),
    "////",
  ].join("\n");
}

/** The ledger (v2.4): a details section per surface, open, and inside
 *  it a head per tool with the documents that name it, newest edit
 *  first — a document under every tool it names, in every surface it
 *  covers. The tool head is a div, not a heading, so the page's table
 *  of contents stays empty rather than listing every tool. */
function ledger(fromPage, docs) {
  const bySurface = new Map();
  for (const d of docs) {
    const surfaces = surfacesOf(d.meta);
    for (const sf of surfaces.length ? surfaces : [NO_SURFACE]) {
      if (!bySurface.has(sf)) bySurface.set(sf, []);
      bySurface.get(sf).push(d);
    }
  }
  const rank = (sf) => (sf === NO_SURFACE ? 1e9 : SURFACE_ORDER.indexOf(sf) + 1 || SURFACE_ORDER.length + 1);
  const surfaces = [...bySurface.keys()].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, "en"));
  const out = ['<div class="lrs-entries" markdown>', ""];
  for (const sf of surfaces) {
    const ds = bySurface.get(sf);
    const title = sf === NO_SURFACE ? "No surface" : link(fromPage, catalogPage("surfaces", sf), sf);
    out.push(`///// details | ${title} <small>${ds.length} document${ds.length === 1 ? "" : "s"}</small>`,
      "    open: true", '    attrs: {class: "lrs-section"}', "");
    const byTool = new Map();
    for (const d of ds) {
      for (const t of d.meta.tools.length ? d.meta.tools : [NO_TOOL]) {
        if (!byTool.has(t)) byTool.set(t, []);
        byTool.get(t).push(d);
      }
    }
    const tools = [...byTool.keys()].sort((a, b) =>
      (a === NO_TOOL) - (b === NO_TOOL) || a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
    for (const t of tools) {
      const td = byTool.get(t).slice().sort(byEdited);
      const head = t === NO_TOOL ? "No tool named" : link(fromPage, catalogPage("tools", t), t);
      out.push(`<div class="lrs-tool-head" markdown="span">${head} <small>${td.length}</small></div>`, "");
      for (const d of td) out.push(entryRow(fromPage, d, { skip: t }), "");
    }
    out.push("/////", "");
  }
  out.push("</div>");
  return out.join("\n");
}

function kindIndex(kind, docs, model, kindFolders, opts = {}) {
  const dir = pageName(kindFolders[kind] || kind);
  const p = `${dir}/index.md`;
  const n = `${docs.length} document${docs.length === 1 ? "" : "s"}`;
  const head = [...pageMeta({ exclude: true, title: kindFolders[kind] || kind, icon: kindIcon(kind) }), h1(kindIcon(kind), kindFolders[kind] || kind), ""];
  if (opts.kindLayout === "table") {
    return [...head,
      `${n}, newest edit first. ${TABLE_HELP} ` +
      `Or ${link(p, "documents/index.md", "see every kind in one table")}.`, "",
      docTable(p, docs, { filter: true }), ""].join("\n");
  }
  // v2.4: the ledger
  return [...head,
    `${n} by surface, then by the tools they name — a document is listed under every tool it names. ` +
    "Type in the box to filter every group at once; open a row for the document's facts and summary. " +
    `Or ${link(p, "documents/index.md", "see every kind in one table")}.`, "",
    ledger(p, docs), ""].join("\n");
}

// ---------------------------------------------------------------- glossary (v2.6)

/** The kind labels a glossary entry wears: TOOL_KINDS' short names. */
const GLOSSARY_KIND = {
  tool: "geoprocessing tool", ribbon: "ribbon tool", widget: "Experience Builder widget",
  app: "web app", rest: "REST operation", term: "term", alias: "alias",
};
/** The sentence an entry gets when the vocabulary describes it by
 *  kind alone (the hand-kept widgets, ribbon tools, apps and REST
 *  operations carry no description). */
const GLOSSARY_SENTENCE = {
  ribbon: "A tool on the Location Referencing tab of the ArcGIS Pro ribbon.",
  widget: "One of the Location Referencing widgets in Experience Builder.",
  app: "A Location Referencing web app.",
  rest: "An operation of the Linear Referencing Service (REST).",
};
/** How much of a definition a tooltip carries: cut at a sentence end
 *  past this many characters. */
const TOOLTIP_CHARS = 220;

/** The glossary's entries from the official vocabulary: [{name, kind,
 *  text, url, tooltip}], tools, then the hand-kept kinds in TOOL_KINDS
 *  order, then the terms, then the aliases; a name seen twice keeps
 *  its first entry. `tooltip` is false for a single ordinary-word
 *  term (Route, Event, Line, Measure …): an abbreviation matches every
 *  capitalised use of the word, and half the corpus would be
 *  underlined. Multi-word terms and acronyms (LRS, LRM) are tooltips. */
export function glossaryEntries(vocab) {
  const out = [];
  const seen = new Set();
  const add = (name, kind, text, url, tooltip = true) => {
    const key = String(name || "").trim();
    if (!key || seen.has(key.toLowerCase())) return;
    seen.add(key.toLowerCase());
    out.push({ name: key, kind, text: cell(text), url: String(url || "").trim(), tooltip: tooltip && !!cell(text) });
  };
  for (const t of vocab.tools) add(t.name, "tool", t.description, t.url);
  for (const k of TOOL_KINDS) {
    if (k.kind === "tool") continue;
    for (const w of vocab.widgets) {
      if ((vocab.kindOf.get(String(w.name)) || "widget") !== k.kind) continue;
      // no description in the vocabulary: the kind's own sentence
      add(w.name, k.kind, w.description || GLOSSARY_SENTENCE[k.kind] || `${k.label}.`, w.url);
    }
  }
  for (const t of vocab.terms) {
    const single = !/[\s-]/.test(String(t.term).trim());
    const acronym = /^[A-Z0-9]{2,}$/.test(String(t.term).trim());
    add(t.term, "term", t.definition, t.url, !single || acronym);
  }
  for (const [alias, name] of Object.entries(vocab.aliases || {})) {
    const target = out.find((e) => e.name.toLowerCase() === String(name).toLowerCase());
    add(alias, "alias", `${name}${target?.text ? ` — ${target.text}` : ""}`, target?.url || "");
  }
  return out;
}

/** A definition cut to the tooltip's length at a sentence end. */
export function tooltipText(text, max = TOOLTIP_CHARS) {
  const t = cell(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max + 1);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return end > max / 2 ? cut.slice(0, end + 1) : cut.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/** includes/glossary.md: one Markdown abbreviation per tooltip entry
 *  (`*[Merge Events]: Merges …`), appended to every page by
 *  pymdownx.snippets, matched by python-markdown's `abbr` — whole
 *  words, the term's own casing, the longest term first. */
export function glossaryAbbreviations(entries) {
  const lines = ["<!-- generated by pipeline/wiki.mjs — the official vocabulary as abbreviations; overwritten on every render -->", ""];
  for (const e of entries) {
    if (!e.tooltip) continue;
    lines.push(`*[${e.name.replace(/[\[\]]/g, "")}]: ${tooltipText(e.text)}`);
  }
  return lines.join("\n") + "\n";
}

/** The Glossary page (v2.6): every entry by kind as a definition list
 *  — the term linking its Esri page, its kind, the way to its documents
 *  when the corpus names it — under one filter box. */
function glossaryPage(entries, model, vocab) {
  const p = "glossary.md";
  const n = entries.length;
  const out = [...pageMeta({ exclude: true, title: "Glossary", icon: "book-alphabet" }), h1("book-alphabet", "Glossary"), "",
    `The official vocabulary — ${n} entr${n === 1 ? "y" : "ies"}: the tools, widgets, ribbon tools, web apps and REST operations, the terms and the team's aliases, from the Esri documentation` +
    (vocab.generated ? ` (read ${String(vocab.generated).slice(0, 10)})` : "") + ". " +
    "Wherever a page uses one of these names, hovering it shows the definition. Type in the box to filter the list.", ""];
  if (!n) {
    out.push(admonition("info", "No vocabulary file was found (`pipeline/data/lrs_vocabulary.json`) — run `doc_vocab.mjs` to build one.", { title: "Empty" }), "");
    return out.join("\n");
  }
  const groups = [["tool", "Geoprocessing tools"], ["ribbon", "Ribbon tools"], ["widget", "Experience Builder widgets"],
    ["app", "Web apps"], ["rest", "REST operations"], ["term", "Terms"], ["alias", "Aliases"]];
  out.push('<div class="filterable lrs-glossary" markdown>', "");
  for (const [kind, heading] of groups) {
    const es = entries.filter((e) => e.kind === kind);
    if (!es.length) continue;
    out.push(`## ${heading} <small>${es.length}</small>`, "");
    const pairs = es.map((e) => {
      const name = e.url ? `[${linkText(e.name)}](<${e.url}>)` : mdEscape(e.name);
      const docs = model.tools.get(e.name);
      const tail = [
        `*${GLOSSARY_KIND[e.kind] || e.kind}*{ .lrs-glossary__kind }`,
        docs ? link(p, catalogPage("tools", e.name), `${docs.length} document${docs.length === 1 ? "" : "s"}`) : "",
      ].filter(Boolean).join(" · ");
      return [`${name} <small>${tail}</small>`, e.text ? mdEscape(e.text).replace(/\\([`*_])/g, "$1") : "—"];
    });
    out.push(defList(pairs), "");
  }
  out.push("</div>", "");
  return out.join("\n");
}

/** Every document in one table (v2.0): the Documents tab's own page. */
function allDocumentsPage(model) {
  const p = "documents/index.md";
  const kinds = kindOrder(model.kinds, model.kindFolders)
    .map((k) => `${link(p, `${pageName(model.kindFolders[k] || k)}/index.md`, model.kindFolders[k] || k)} (${model.kinds.get(k).length})`);
  return [...pageMeta({ exclude: true, title: "All documents", icon: "file-document-multiple-outline" }), h1("file-document-multiple-outline", "All documents"), "",
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

/** The Browse tab's own page (v2.0): the seven catalogs as cards. */
function browsePage(model) {
  const p = "browse/index.md";
  return [...pageMeta({ exclude: true, title: "Browse", icon: "compass-outline" }), h1("compass-outline", "Browse"), "",
    "Seven ways into the same documents: every value below is a page that lists the documents carrying it, and a document's metadata card links back here. The Glossary is the official vocabulary behind the tools.", "",
    '<div class="grid cards" markdown>', "", ...catalogCards(p, model),
    ...card(p, "book-alphabet", "glossary.md", "Glossary", model.glossary.length || null, "The official vocabulary — tools, widgets, terms — with the definitions the tooltips show."),
    "</div>", ""].join("\n");
}

function casesPage(model) {
  const p = "cases/index.md";
  const out = [...pageMeta({ exclude: true, title: "Test cases", icon: "clipboard-check" }), h1("clipboard-check", "Test cases"), "",
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
  const out = [...pageMeta({ exclude: true, title: "Figures", icon: "image-multiple" }), h1("image-multiple", "Figures"), "", "Every image a sidecar body links, by document (newest edit first); each links the section it sits in.", ""];
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
  return [...pageMeta({ exclude: true, title: "Recent", icon: "history" }), h1("history", "Recent"), "",
    `The ${docs.length} most recently edited source documents. ${TABLE_HELP}`, "",
    docTable(p, docs, { kind: true, filter: true }), ""].join("\n");
}

const FRONT_RECENT = 8;
/** Facet rows on the front page's By surface / product / release tabs. */
const FRONT_FACETS = 8;

/** A catalog as facet bars (v2.5): each value a row — the link, a bar
 *  proportional to the largest count, the count — most documents
 *  first, at most `max` rows, then the way to the whole catalog. The
 *  bar's width rides on a CSS variable attr_list writes onto the
 *  element, so the stylesheet draws it with no script. */
function facetRows(fromPage, section, groups, model, max = FRONT_FACETS) {
  const rows = [...groups].map(([value, ds]) => ({ value, n: ds.length }))
    .sort((a, b) => b.n - a.n || a.value.localeCompare(b.value, "en", { numeric: true, sensitivity: "base" }));
  const top = max === Infinity ? rows : rows.slice(0, max);
  const most = top[0]?.n || 1;
  const out = ['<div class="lrs-facets" markdown>', ""];
  for (const r of top) {
    const w = Math.max(4, Math.round((r.n / most) * 100));
    out.push(`- ${link(fromPage, catalogPage(section, r.value), r.value)} <i class="lrs-facets__bar" style="--lrs-w: ${w}%"></i> <b>${r.n}</b>`);
  }
  out.push("");
  if (max !== Infinity) {
    const c = CATALOGS.find((x) => x.section === section);
    const more = rows.length > top.length ? `${rows.length - top.length} more — ` : "";
    out.push(`${more}${link(fromPage, `${section}/index.md`, `all ${rows.length} ${rows.length === 1 ? c.label.toLowerCase() : c.title.toLowerCase()}`)}`, "");
  }
  out.push("</div>");
  return out.join("\n");
}

/** The catalogs whose index page is facet bars rather than a table
 *  (v2.6): few values, and the counts are the point. */
const FACET_CATALOGS = new Set(["surfaces", "products", "releases"]);

/** The recent-edits feed (v2.5): a row per document — the kind's icon,
 *  the title, the kind and product in a lighter ink, the date at the
 *  right. A list, not a table: eight rows need no header to sort. */
function recentFeed(fromPage, docs, model) {
  const out = ['<div class="lrs-feed" markdown>', ""];
  for (const d of docs) {
    const m = d.meta;
    const facts = [
      link(fromPage, `${d.kindDir}/index.md`, d.kind),
      m.products.length ? cell(m.products.join(" · ")) : "",
      m.target_release ? `release ${cell(m.target_release)}` : "",
    ].filter(Boolean).join(" · ");
    const when = cell(m.last_edited).slice(0, 10);
    out.push(`- :material-${kindIcon(d.kind)}:{ .lrs-feed__icon } ${link(fromPage, d.page, m.title || d.stem)} <small>${facts}</small>${when ? ` *${when}*{ .lrs-when }` : ""}`);
  }
  out.push("", "</div>");
  return out.join("\n");
}

/** The front page (v2.5): a landing page, not a document. The hero —
 *  the title, what the site is, the search button, the corpus in
 *  numbers — is `overrides/home.html` (Material's template override,
 *  `template: home.html` in the front matter), fed by the `hero:`
 *  front matter this function writes; the nav and the table of
 *  contents are hidden so the page spans the column. Under it, in
 *  markdown: the corpus by kind (cards), by surface, product and
 *  release (facet bars) in content tabs; the latest edits as a feed;
 *  the catalogs and the site's other pages as cards. */
function frontPage(model, kindFolders, opts, drafts = []) {
  const p = "index.md";
  const y = (s) => JSON.stringify(String(s));
  const plans = model.kinds.get("Test Plan") || [];
  const nCases = plans.reduce((n, d) => n + planCases(d.body).length, 0);
  const nFigures = model.docs.reduce((n, d) => n + bodyFigures(d.body).filter((f) => !d.mediaMissing?.has(f.link)).length, 0);
  // the hero's links are final URLs, not markdown links: the template
  // passes them through MkDocs' `url` filter, which makes them
  // relative to the page — `.html` under `offline` (use_directory_urls off)
  const href = (dir) => (opts.offline ? `${dir}/index.html` : `${dir}/`);
  // a count of nothing is not a fact worth a tile
  const stats = [
    ["documents", model.docs.length, href("documents")],
    ["test cases", nCases, href("cases")],
    ["figures", nFigures, href("figures")],
    ["tools", model.tools.size, href("tools")],
    ["keywords", model.keywords.size, href("keywords")],
    ["people", model.people.size, href("people")],
  ].filter(([, n]) => n > 0);
  const kindsNamed = kindOrder(model.kinds, kindFolders).slice(0, 3).map((k) => (kindFolders[k] || k).toLowerCase());
  const front = ["---",
    "template: home.html",
    "hide: [navigation, toc, path]",
    "search:", "  exclude: true",
    "hero:",
    `  eyebrow: ${y(`Rendered ${fmtDate(new Date().toISOString())} from the LRS Doc Index catalog`)}`,
    `  lead: ${y(`${model.docs.length} documents from the team library — ${kindsNamed.join(", ")}${model.kinds.size > 3 ? " and more" : ""} — one page each. Every page carries the document's facts, its summary, its related documents and the extracted text, and links the original file.`)}`,
    `  hint: ${y("An id is found by its parts: TC-P01, ps-location-referencing#4855 and merge-events each find the pages that carry them.")}`,
    `  documents: ${y(href("documents"))}`,
    "  stats:",
    ...stats.map(([label, n, h]) => `    - { label: ${y(label)}, n: ${n}, href: ${y(h)} }`),
    "---", ""];
  const out = [...front,
    "## Documents", "",
    `By kind — or ${link(p, "documents/index.md", "every document in one table")}.`, "",
    // v2.1: a card per kind (icon, count, newest edit), like Browse;
    // v2.5: in the first of four content tabs (pymdown's Blocks tab)
    "/// tab | By kind", "",
    '<div class="grid cards lrs-kinds" markdown>', ""];
  for (const kind of kindOrder(model.kinds, kindFolders)) {
    const ds = model.kinds.get(kind);
    const newest = cell(ds.slice().sort(byEdited)[0]?.meta.last_edited).slice(0, 10);
    out.push(...card(p, kindIcon(kind), `${pageName(kindFolders[kind] || kind)}/index.md`, kindFolders[kind] || kind, ds.length,
      `${ds.length} document${ds.length === 1 ? "" : "s"}${newest ? `, newest edit ${newest}` : ""}.`));
  }
  out.push("</div>", "", "///", "");
  for (const [section, key, title] of [["surfaces", "surfaces", "By surface"], ["products", "products", "By product"], ["releases", "releases", "By release"]]) {
    if (!model[key].size) continue;
    out.push(`/// tab | ${title}`, "", facetRows(p, section, model[key], model), "", "///", "");
  }
  const recent = model.docs.slice().sort(byEdited).slice(0, FRONT_RECENT);
  if (recent.length) {
    out.push("## Recently edited", "",
      `The ${recent.length} most recently edited source documents; ${link(p, "recent.md", "the Recent page")} goes further back.`, "",
      recentFeed(p, recent, model), "");
  }
  out.push("## Browse", "",
    "Seven catalogs over the same documents — every value is a page listing the documents that carry it.", "",
    '<div class="grid cards" markdown>', "",
    ...catalogCards(p, model),
    "</div>", "",
    "## More", "", '<div class="grid cards" markdown>', "",
    ...card(p, "clipboard-check", "cases/index.md", "Test cases", nCases || null, "Every test case the test plans carry, by plan, linking its section."),
    ...card(p, "image-multiple", "figures/index.md", "Figures", nFigures || null, "Every figure the bodies carry, by document."),
    ...card(p, "book-alphabet", "glossary.md", "Glossary", model.glossary.length || null, "The official vocabulary — tools, widgets, terms — with the definitions the tooltips show."),
    ...card(p, "history", "recent.md", "Recent", null, "The most recently edited source documents."),
    ...(drafts.length ? card(p, "file-document-edit", "drafts/index.md", "Test-plan drafts", drafts.length, "Machine-generated, **unreviewed** — not catalog documents.") : []),
    ...card(p, "information", "about.md", "About", null, "What this site is, what it is not, and where each page's content comes from."),
    "</div>", "");
  return out.join("\n");
}

function aboutPage(model, opts) {
  return [...pageMeta({ title: "About this wiki", icon: "information" }), h1("information", "About this wiki"), "",
    // v2.0: the site's map, for the reader who wants it spelled out
    admonition("note", defList([
      ["The front page", "The corpus in numbers — every tile links the page it counts — a Search button (or `/`), the documents by kind, surface, product and release in tabs, the latest edits, and the catalogs as cards."],
      ["Documents", "One tab, one table of everything, and a section per kind — the section's header opens the kind's ledger: its documents by surface, then by the tools they name, each row opening to the facts and the summary. A document page links its original file, its catalog values and its related documents."],
      // v2.1: what the blocks on a document page are, and the badges
      ["A document page", "The breadcrumbs, then the facts strip — the tools as pills, the Open link, kind · surface · product · release · edited — with the full metadata table folded under Details; the summary, the related documents and the Esri documentation links as tabs; then, under the rule, the extracted text — the test cases as a checklist: the id a badge (green positive, amber negative) beside the title, the steps, the Expected result the green line, a group a divider over its cases."],
      ["Badges", `A page edited in the last ${NEW_DAYS} days carries a New badge in the sidebar; a draft carries the pencil.`],
      ["Browse", "The seven catalogs: keywords, tools, products, surfaces, releases, people and issues. Every value is a page listing the documents that carry it. Surfaces, products and releases are facet bars; the others are tables."],
      ["Glossary", "The official vocabulary from the Esri documentation. Wherever a page names a tool, a widget or a multi-word term, hovering it shows the definition; the Glossary page lists them all."],
      ["Test cases", "Every case the sweep read out of the test plans, each entry linking the section it came from. The Figures catalog is its sibling, reached from the Browse card below."],
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
 *  Documents · Browse · Test cases · Drafts (Recent and About
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
  // v2.6: the glossary, the eighth way in, under Browse
  nav.push("      - Glossary: glossary.md");
  // v2.3: the Figures catalog leaves the nav (it stays a page, reached
  // from the front page's Browse card and from About); the tab is the
  // Test cases page, its section header opening it
  nav.push("  - Test cases:", "      - cases/index.md");
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
    // v2.5: the front page's hero is a template override
    // (overrides/home.html, `template: home.html` in its front matter)
    "  custom_dir: overrides",
    // v2.5: no Google Fonts. The site is served on the internal
    // network, where the fonts stylesheet is a render-blocking request
    // to a host the reader may have no route to; extra.css names the
    // system faces instead (Segoe UI on the Windows machines that read
    // this site)
    "  font: false",
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
    // file:// page cannot be fetched — and Material's tooltips.
    // v2.5: prefetch on hover and footnote tooltips — Insiders features
    // until Material 9.7 made every one of them free
    `  features: [navigation.tabs, navigation.tabs.sticky, navigation.indexes, navigation.path, navigation.prune, navigation.top, navigation.tracking, navigation.footer, ${opts.offline ? "" : "navigation.instant, navigation.instant.progress, navigation.instant.prefetch, "}search.suggest, search.highlight, search.share, content.tabs.link, content.code.copy, content.tooltips, content.footnote.tooltips, toc.follow]`,
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
    // v2.6: the glossary as tooltips — python-markdown's abbreviations,
    // one per official term, in a file snippets appends to every page
    // (checked: a missing file fails the build rather than silently
    // dropping the glossary). The snippet syntax (`--8<--`) is thereby
    // live in bodies too; nothing extracted from an Office document
    // writes a scissors line.
    "  - abbr",
    "  - pymdownx.snippets:",
    "      auto_append: [includes/glossary.md]",
    "      check_paths: true",
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
    // v2.4: the ledger's sections and rows, the document page's folded
    // metadata table
    "  - pymdownx.blocks.details",
    // v2.5: the front page's content tabs (Material's alternate style,
    // the one its content-tabs reference documents)
    "  - pymdownx.blocks.tab:",
    "      alternate_style: true",
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

  /* v2.6: a definition list filters like a table — a term and its
     definition are one row; a heading whose list emptied folds away */
  function dlRows(wrap) {
    var rows = [];
    Array.prototype.forEach.call(wrap.querySelectorAll("dl > dt"), function (dt) {
      var els = [dt];
      for (var el = dt.nextElementSibling; el && el.tagName === "DD"; el = el.nextElementSibling) els.push(el);
      rows.push(els);
    });
    return rows;
  }

  function filterDl(wrap, rows, terms) {
    var shown = 0;
    rows.forEach(function (els) {
      var text = els.map(function (el) { return el.textContent || ""; }).join(" ").toLowerCase();
      var hit = terms.every(function (t) { return text.indexOf(t) >= 0; });
      els.forEach(function (el) { el.hidden = !hit; });
      if (hit) shown++;
    });
    Array.prototype.forEach.call(wrap.querySelectorAll("h2, h3"), function (h) {
      var any = false;
      for (var el = h.nextElementSibling; el && !/^H[1-6]$/.test(el.tagName); el = el.nextElementSibling) {
        if (Array.prototype.some.call(el.querySelectorAll("dt"), function (dt) { return !dt.hidden; })) { any = true; break; }
      }
      h.hidden = terms.length > 0 && !any;
    });
    return shown;
  }

  function makeFilterable(wrap) {
    if (wrap.dataset.lrsFilter) return;
    var table = wrap.querySelector("table");
    if (!table) {
      var rows = dlRows(wrap);
      if (rows.length < FILTER_MIN_ROWS) return;
      wrap.dataset.lrsFilter = "1";
      wrap.insertBefore(filterBox(rows.length, function (terms) { return filterDl(wrap, rows, terms); }), wrap.firstChild);
      return;
    }
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

  /* ---- v2.4: the ledger ---------------------------------------------
     An ".lrs-entries" wrapper holds details rows (.lrs-entry) under
     tool heads (.lrs-tool-head) inside surface sections
     (details.lrs-section). One box filters the rows; a tool head folds
     when the rows up to the next head all hid, a section when every
     row in it hid. */
  function makeEntries(wrap) {
    var rows = Array.prototype.slice.call(wrap.querySelectorAll("details.lrs-entry"));
    if (!rows.length || wrap.dataset.lrsFilter) return;
    if (rows.length < FILTER_MIN_ROWS) return;
    wrap.dataset.lrsFilter = "1";
    wrap.insertBefore(filterBox(rows.length, function (terms) {
      var shown = 0;
      rows.forEach(function (d) {
        var text = (d.textContent || "").toLowerCase();
        var hit = terms.every(function (t) { return text.indexOf(t) >= 0; });
        d.hidden = !hit;
        if (hit) shown++;
      });
      Array.prototype.forEach.call(wrap.querySelectorAll(".lrs-tool-head"), function (h) {
        var any = false;
        for (var el = h.nextElementSibling; el && !el.classList.contains("lrs-tool-head"); el = el.nextElementSibling) {
          if (!el.hidden) { any = true; break; }
        }
        h.hidden = terms.length > 0 && !any;
      });
      Array.prototype.forEach.call(wrap.querySelectorAll("details.lrs-section"), function (sec) {
        var any = Array.prototype.some.call(sec.querySelectorAll("details.lrs-entry"), function (d) { return !d.hidden; });
        sec.hidden = terms.length > 0 && !any;
      });
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

  /* ---- v2.5: the front page's hero -----------------------------------
     The Search button opens the theme's own search: check its toggle
     (the drawer on a phone) and focus the input (the overlay on a
     desktop), the same two things the header's icon does. */
  function heroSearch() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-lrs-search]"), function (btn) {
      if (btn.dataset.lrsBound) return;
      btn.dataset.lrsBound = "1";
      btn.addEventListener("click", function () {
        var toggle = document.querySelector('[data-md-toggle="search"]');
        var input = document.querySelector(".md-search__input");
        if (toggle) toggle.checked = true;
        if (input) { input.focus(); input.select(); }
      });
    });
  }

  function scan() {
    heroSearch();
    document.querySelectorAll(SELECTOR).forEach(makeSortable);
    document.querySelectorAll(".filterable").forEach(makeFilterable);
    document.querySelectorAll(".filter-all").forEach(makeFilterAll);
    document.querySelectorAll(".lrs-entries").forEach(makeEntries);
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
  /* v2.5: the system faces (theme.font is off — no Google Fonts request
     on an internal network); Material's own fallback stack follows */
  --md-text-font: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  --md-code-font: "Cascadia Code", "Cascadia Mono", Consolas, "SF Mono", Menlo, "Roboto Mono", monospace;
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
  padding-top: 0.55em;
  color: var(--md-default-fg-color--light);
  font-size: 0.66rem;
}
.doc-meta table:not([class]) td:first-child strong { font-weight: 600; }

/* a test case (v2.4, the checklist): the id a badge in a gutter beside
   the title, the body hanging under the title with no box, a hairline
   to close it; a group is a divider over its run of cases and a count
   line opens the section. The card's own group line (mdlayout) is
   hidden — the divider carries it. */
.md-typeset .lrs-cases-count { margin: -0.6em 0 1em; color: var(--md-default-fg-color--light); font-size: 0.7rem; }
.md-typeset .lrs-group-head {
  margin: 1.8em 0 0.4em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--md-default-fg-color--lightest);
  font-size: 0.82rem;
  font-weight: 600;
}
.md-typeset .lrs-group-head small { margin-left: 0.5em; color: var(--md-default-fg-color--light); font-size: 0.66rem; font-weight: 400; }
.md-typeset h3[id^="tc-"] {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  margin: 1em 0 0;
  padding: 0;
  font-size: 0.78rem;
  font-weight: 600;
}
.md-typeset h3[id^="tc-"] .lrs-tc-title { flex: 0 1 auto; min-width: 0; }
.md-typeset h3[id^="tc-"] .headerlink { margin-left: 0.2rem; font-weight: 400; }
.md-typeset .lrs-tc {
  flex: 0 0 4.2rem;
  padding: 0.15em 0;
  border-radius: 0.25rem;
  background: var(--md-code-bg-color);
  color: var(--md-default-fg-color--light);
  font-family: var(--md-code-font-family);
  font-size: 0.62rem;
  font-weight: 600;
  text-align: center;
}
.md-typeset .lrs-tc--p { background: rgba(0, 200, 83, 0.14); color: #1b6b3a; }
.md-typeset .lrs-tc--n { background: rgba(255, 145, 0, 0.16); color: #9a4a00; }
[data-md-color-scheme="slate"] .md-typeset .lrs-tc--p { color: #7ee2a8; }
[data-md-color-scheme="slate"] .md-typeset .lrs-tc--n { color: #ffc27a; }
.md-typeset .lrs-case {
  margin: 0.3em 0 0 4.9rem;
  padding: 0 0 0.9em;
  border-bottom: 1px solid var(--md-default-fg-color--lightest);
  font-size: 0.72rem;
}
.md-typeset .lrs-case > :first-child { margin-top: 0; }
.md-typeset .lrs-case .lrs-group { display: none; }
.md-typeset .lrs-case .lrs-case-text { margin: 0 0 0.5em; color: var(--md-default-fg-color--light); }
.md-typeset .lrs-case .lrs-case-text p { margin: 0; }
/* the fields that keep a label (Trace) — a label/value grid */
.md-typeset .lrs-case dl {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  column-gap: 1em;
  row-gap: 0.45em;
  margin: 0 0 0.6em;
}
.md-typeset .lrs-case dl dt {
  margin: 0;
  padding: 0.1em 0 0;
  color: var(--md-default-fg-color--light);
  font-size: 0.68rem;
  font-weight: 600;
}
.md-typeset .lrs-case dl dd { margin: 0; }
.md-typeset .lrs-case dl dd > ul, .md-typeset .lrs-case dl dd > ol { margin-top: 0; margin-bottom: 0; }
/* the steps ARE the case: the procedure, its checkboxes kept */
.md-typeset .lrs-case .lrs-steps { margin: 0 0 0.5em; }
.md-typeset .lrs-case .lrs-steps > ul, .md-typeset .lrs-case .lrs-steps > ol { margin: 0; }
.md-typeset .lrs-case .lrs-steps > ul.task-list { margin-left: 1.5em; }
.md-typeset .lrs-case .lrs-steps .task-list-item { margin: 0 0 0.2em; }
/* the verdict: one green line */
.md-typeset .lrs-case .admonition.success {
  margin: 0.4em 0 0;
  padding: 0.45em 0.8em;
  border: 0;
  border-radius: var(--lrs-radius);
  background: rgba(0, 200, 83, 0.09);
  box-shadow: none;
  font-size: 0.72rem;
}
.md-typeset .lrs-case .admonition.success > .admonition-title {
  position: relative;
  display: inline;
  margin: 0 0.4em 0 0;
  padding: 0 0 0 1.4em;
  background: none;
  border: 0;
  font-size: 0.68rem;
  font-weight: 600;
}
.md-typeset .lrs-case .admonition.success > .admonition-title::before { top: 0.05em; left: 0; width: 1em; height: 1em; }
.md-typeset .lrs-case .admonition.success > .admonition-title::after { content: ":"; }
.md-typeset .lrs-case .admonition.success > :not(.admonition-title) { display: inline; margin: 0; }
.md-typeset .lrs-case figure { margin: 0.6em auto; }
.md-typeset .lrs-case .md-typeset__table { margin: 0.4em 0; }
@media screen and (max-width: 44.9em) {
  .md-typeset .lrs-case { margin-left: 0; }
}

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
   the metadata card's vocabulary — a quiet label over its value, in
   the source's own casing (v2.3) */
.md-typeset dl { margin: 0.6em 0 1.2em; }
.md-typeset dl dt {
  margin-top: 0.9em;
  color: var(--md-default-fg-color--light);
  font-size: 0.66rem;
  font-weight: 600;
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
.md-typeset tr[hidden], .filter-all > [hidden], .md-typeset .filterable [hidden] { display: none !important; }

/* the theme's breadcrumbs (v2.6, navigation.path): quieter, and the
   home crumb is the icon Material draws */
.md-path { margin-bottom: -0.2rem; font-size: 0.64rem; }

/* a document page's head as tabs (v2.6): Summary · Related · Esri
   documentation — the labels wear their icons; the related and docs
   lists are lists of links, the sweep's reason in a lighter ink */
.md-typeset .lrs-head { margin: 0 0 1em; }
.md-typeset .lrs-head .tabbed-set { margin: 0; }
.md-typeset .lrs-head .tabbed-labels > label { font-size: 0.7rem; font-weight: 600; }
.md-typeset .lrs-head .tabbed-labels > label .twemoji { margin-right: 0.15em; vertical-align: -0.15em; }
.md-typeset .lrs-head .tabbed-content { padding: 0.6em 0.2em 0.2em; font-size: 0.74rem; }
.md-typeset .lrs-head .tabbed-block > :first-child { margin-top: 0; }
.md-typeset .lrs-head .tabbed-block > :last-child { margin-bottom: 0; }
.md-typeset .lrs-head .tabbed-block > ul { list-style: none; margin-left: 0; }
.md-typeset .lrs-head .tabbed-block > ul > li {
  margin: 0 0 0.4em;
  padding: 0.3em 0.7em;
  border-left: 0.15rem solid var(--md-default-fg-color--lightest);
  color: var(--md-default-fg-color--light);
}
.md-typeset .lrs-head .admonition { margin: 0; }

/* the glossary (v2.6): abbreviations everywhere carry the definition
   as a tooltip; the dotted line is for running text — a link, a pill
   or a heading already looks like something */
.md-typeset abbr { border-bottom: 1px dotted var(--md-default-fg-color--lighter); }
.md-typeset a abbr, .md-typeset h1 abbr, .md-typeset h2 abbr, .md-typeset h3 abbr, .md-typeset h4 abbr,
.md-typeset summary abbr, .md-typeset .md-button abbr { border-bottom: 0; }
.md-typeset .lrs-glossary h2 small { margin-left: 0.4em; color: var(--md-default-fg-color--light); font-size: 0.66rem; font-weight: 400; }
.md-typeset .lrs-glossary dl dt { font-size: 0.78rem; font-weight: 600; color: var(--md-default-fg-color); }
.md-typeset .lrs-glossary dl dt small { margin-left: 0.4em; color: var(--md-default-fg-color--light); font-size: 0.64rem; font-weight: 400; }
.md-typeset .lrs-glossary dl dt .lrs-glossary__kind { font-style: normal; }
.md-typeset .lrs-glossary dl dt abbr { border-bottom: 0; }
.md-typeset .lrs-glossary dl dd { margin: 0.2em 0 0; font-size: 0.74rem; }

/* a document page's head (v2.4): the facts strip — the pills and the
   Open link on its first row, the facts on its second — and the
   metadata card folded under Details */
.md-typeset .lrs-doc-facts {
  margin: -0.4em 0 0.8em;
  padding: 0.6em 0.9em;
  border-left: 0.2rem solid var(--md-primary-fg-color);
  border-radius: 0 var(--lrs-radius) var(--lrs-radius) 0;
  background: var(--md-code-bg-color);
  color: var(--md-default-fg-color--light);
  font-size: 0.7rem;
}
.md-typeset .lrs-doc-facts p { margin: 0.25em 0; }
.md-typeset .lrs-doc-facts p:first-child { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25em; }
/* the Open link (v2.0 a button under the card; v2.4 a quiet outlined
   link at the right of the strip's first row) */
.md-typeset .lrs-open {
  margin: 0 0 0 auto;
  padding: 0.15em 0.7em;
  border-width: 1px;
  border-color: var(--md-default-fg-color--lighter);
  color: var(--md-default-fg-color--light);
  font-size: 0.64rem;
  font-weight: 500;
}
.md-typeset .lrs-open:hover { border-color: var(--md-accent-fg-color); color: var(--md-accent-fg-color); background: none; }
.md-typeset .lrs-open .twemoji { vertical-align: -0.15em; margin-right: 0.15em; }
.md-typeset details.lrs-doc-meta { margin: 0 0 1em; border-color: var(--md-default-fg-color--lightest); box-shadow: none; }
.md-typeset details.lrs-doc-meta > summary { padding-left: 2rem; background: none; font-weight: 500; color: var(--md-default-fg-color--light); }
.md-typeset details.lrs-doc-meta > summary::before {
  background-color: var(--md-default-fg-color--light);
  -webkit-mask-image: var(--md-admonition-icon--info);
          mask-image: var(--md-admonition-icon--info);
}
.md-typeset details.lrs-doc-meta .doc-meta { margin: 0.4em 0.6em 0.2em; }
.md-typeset details.lrs-doc-meta .doc-meta .md-typeset__scrollwrap { margin-bottom: 0.4em; }

/* a tool as a pill (v2.4): the link ink on a wash of itself, so it
   reads as a tag in both schemes without a second colour */
.md-typeset .lrs-pill {
  display: inline-block;
  margin: 0.1em 0.1em 0.1em 0;
  padding: 0.1em 0.6em;
  border: 1px solid color-mix(in srgb, var(--md-typeset-a-color) 30%, transparent);
  border-radius: 1em;
  background: color-mix(in srgb, var(--md-typeset-a-color) 9%, transparent);
  color: var(--md-typeset-a-color);
  font-size: 0.62rem;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  text-decoration: none;
}
.md-typeset .lrs-pill:hover { background: color-mix(in srgb, var(--md-accent-fg-color) 14%, transparent); border-color: var(--md-accent-fg-color); color: var(--md-accent-fg-color); }
.md-typeset .lrs-when { font-style: normal; color: var(--md-default-fg-color--light); font-variant-numeric: tabular-nums; }

/* the ledger (v2.4): a surface is a collapsible section, open — its
   summary line reads as the section heading, the chevron the only
   chrome; a tool head over its rows; a document a closed details row
   whose summary line is the title, the pills and the date */
.md-typeset .lrs-entries [hidden] { display: none !important; }
.md-typeset details.lrs-section { margin: 1.4em 0 0; border: 0; border-radius: 0; box-shadow: none; background: none; font-size: inherit; }
.md-typeset details.lrs-section > summary {
  margin: 0 0 0.6em;
  padding: 0.2em 2rem 0.3em 0;
  border-bottom: 1px solid var(--md-default-fg-color--lightest);
  background: none;
  color: var(--md-default-fg-color);
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1.4;
}
.md-typeset details.lrs-section > summary::before { display: none; }
.md-typeset details.lrs-section > summary::after { top: 0.55em; }
.md-typeset details.lrs-section > summary small { margin-left: 0.4em; color: var(--md-default-fg-color--light); font-size: 0.64rem; }
.md-typeset details.lrs-section > :not(summary) { margin-left: 0; margin-right: 0; padding: 0; }
.md-typeset .lrs-tool-head { margin: 1.1em 0 0.5em; font-size: 0.8rem; font-weight: 600; }
.md-typeset .lrs-tool-head small { margin-left: 0.4em; color: var(--md-default-fg-color--light); font-size: 0.64rem; font-weight: 400; }
.md-typeset details.lrs-entry { margin: 0 0 0.3em; border-color: var(--md-default-fg-color--lightest); font-size: 0.72rem; }
.md-typeset details.lrs-entry[open] { border-color: var(--md-primary-fg-color); }
.md-typeset details.lrs-entry > summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.2em 0.5em;
  padding: 0.35em 2.2rem 0.35em 0.9em;
  background: var(--md-code-bg-color);
  font-size: 0.78rem;
  font-weight: 500;
}
.md-typeset details.lrs-entry > summary::before { display: none; }
.md-typeset details.lrs-entry > summary > a:first-child { margin-right: 0.3em; }
.md-typeset details.lrs-entry > summary .lrs-tags { display: flex; flex: 1 1 auto; flex-wrap: wrap; gap: 0.2em 0.3em; min-width: 0; }
.md-typeset details.lrs-entry > summary .lrs-when { flex-shrink: 0; margin-left: auto; font-size: 0.66rem; font-weight: 400; }
.md-typeset details.lrs-entry > :not(summary) { margin-left: 0.9em; margin-right: 0.9em; }
.md-typeset details.lrs-entry .lrs-entry__facts { margin: 0.5em 0.9em 0.2em; color: var(--md-default-fg-color--light); font-size: 0.68rem; }
.md-typeset details.lrs-entry .lrs-entry__facts p { margin: 0; }
.md-typeset details.lrs-entry > p { margin: 0.4em 0.9em 0.7em; }

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

/* the front page (v2.5): a landing page. The hero spans the viewport
   under the tab bar — the site's blue, deepening to the right — with
   the corpus in numbers as tiles beside the words; the nav and the
   table of contents are hidden (front matter), so the sections under
   it take the whole column. */
.lrs-hero {
  position: relative;
  overflow: hidden;
  padding: 2.6rem 0 2.2rem;
  color: #fff;
  background:
    radial-gradient(60rem 22rem at 100% 0%, color-mix(in srgb, var(--md-accent-fg-color) 55%, transparent), transparent 60%),
    linear-gradient(120deg, var(--md-primary-fg-color--dark), var(--md-primary-fg-color) 70%);
}
.lrs-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px);
  background-size: 1.4rem 1.4rem;
  mask-image: linear-gradient(90deg, transparent 35%, #000);
  -webkit-mask-image: linear-gradient(90deg, transparent 35%, #000);
}
.lrs-hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 2rem 3rem;
  align-items: center;
  padding: 0 1.2rem;
}
.lrs-hero__eyebrow { margin: 0 0 0.6em; color: rgba(255, 255, 255, 0.72); font-size: 0.64rem; letter-spacing: 0.02em; }
.lrs-hero__title { margin: 0 0 0.4em; color: #fff; font-size: 2.2rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
.lrs-hero__lead { margin: 0 0 1.2em; max-width: 34rem; color: rgba(255, 255, 255, 0.88); font-size: 0.82rem; line-height: 1.55; }
.lrs-hero__actions { display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center; }
.lrs-hero .md-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  margin: 0;
  padding: 0.55em 1.1em;
  border-color: rgba(255, 255, 255, 0.55);
  border-radius: var(--lrs-radius);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
}
.lrs-hero .md-button svg { width: 1.1em; height: 1.1em; fill: currentColor; }
.lrs-hero .md-button--primary { background: #fff; border-color: #fff; color: var(--md-primary-fg-color--dark); }
.lrs-hero .md-button--primary:hover { background: var(--md-accent-fg-color); border-color: var(--md-accent-fg-color); color: #fff; }
.lrs-hero .md-button:not(.md-button--primary):hover { background: rgba(255, 255, 255, 0.14); border-color: #fff; color: #fff; }
.lrs-hero kbd {
  margin-left: 0.2em;
  padding: 0.05em 0.4em;
  border: 1px solid currentColor;
  border-radius: 0.25em;
  font: inherit;
  font-size: 0.85em;
  opacity: 0.7;
}
.lrs-hero__hint { margin: 1.2em 0 0; max-width: 34rem; color: rgba(255, 255, 255, 0.7); font-size: 0.64rem; line-height: 1.5; }
.lrs-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.lrs-hero__stats li { margin: 0; }
.lrs-hero__stats a {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  padding: 0.7rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--lrs-radius);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}
.lrs-hero__stats a:hover { background: rgba(255, 255, 255, 0.2); border-color: rgba(255, 255, 255, 0.5); color: #fff; }
.lrs-hero__stats strong { font-size: 1.3rem; font-weight: 700; line-height: 1.1; font-variant-numeric: tabular-nums; }
.lrs-hero__stats span { color: rgba(255, 255, 255, 0.75); font-size: 0.62rem; }
[data-md-color-scheme="slate"] .lrs-hero {
  background:
    radial-gradient(60rem 22rem at 100% 0%, color-mix(in srgb, var(--md-accent-fg-color) 30%, transparent), transparent 60%),
    linear-gradient(120deg, #0f1f33, #1a3a5c 70%);
}
@media screen and (max-width: 59.9em) {
  .lrs-hero { padding: 1.8rem 0 1.6rem; }
  .lrs-hero__grid { grid-template-columns: minmax(0, 1fr); gap: 1.4rem; }
  .lrs-hero__title { font-size: 1.7rem; }
}
@media screen and (max-width: 44.9em) {
  .lrs-hero__stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* the sections under the hero: wider gaps, the H2 a section title
   without the rule the document pages use */
.lrs-home > h2 { margin-top: 2em; border-bottom: 0; font-weight: 600; }
.lrs-home > h2:first-child { margin-top: 0.6em; }
.md-typeset .lrs-home .grid.cards > ul > li > p:first-child .twemoji { font-size: 1.4em; }

/* content tabs (v2.5, Material's alternate style): the labels in the
   site's ink, the panel flush with the page */
.md-typeset .lrs-home .tabbed-set { margin: 0.6em 0 1.4em; }
.md-typeset .lrs-home .tabbed-labels > label { font-size: 0.7rem; font-weight: 600; }
.md-typeset .lrs-home .tabbed-content { padding-top: 0.6em; }

/* facet bars (v2.5): a value, a bar scaled to the largest count, the
   count — the corpus's shape at a glance */
.md-typeset .lrs-facets > ul { margin: 0; padding: 0; list-style: none; }
.md-typeset .lrs-facets > ul > li {
  display: grid;
  grid-template-columns: minmax(8rem, 16rem) minmax(0, 1fr) 3rem;
  align-items: center;
  gap: 0.8rem;
  margin: 0 0 0.35em;
  padding: 0;
  font-size: 0.74rem;
}
.md-typeset .lrs-facets__bar {
  display: block;
  height: 0.55rem;
  border-radius: 0.3rem;
  background: linear-gradient(90deg, var(--md-primary-fg-color), var(--md-accent-fg-color));
  width: var(--lrs-w, 0%);
  opacity: 0.85;
}
.md-typeset .lrs-facets > ul > li > b { text-align: right; font-variant-numeric: tabular-nums; }
.md-typeset .lrs-facets > p { margin: 0.6em 0 0; color: var(--md-default-fg-color--light); font-size: 0.68rem; }

/* the recent-edits feed (v2.5): a row per document — the kind's icon,
   the title, the facts in a lighter ink, the date at the right */
.md-typeset .lrs-feed > ul { margin: 0; padding: 0; list-style: none; }
.md-typeset .lrs-feed > ul > li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.2em 0.6em;
  margin: 0;
  padding: 0.5em 0.2em;
  border-bottom: 1px solid var(--md-default-fg-color--lightest);
  font-size: 0.76rem;
}
.md-typeset .lrs-feed > ul > li:first-child { border-top: 1px solid var(--md-default-fg-color--lightest); }
.md-typeset .lrs-feed__icon { color: var(--md-primary-fg-color); font-size: 1.25em; vertical-align: -0.2em; }
.md-typeset .lrs-feed > ul > li > a { font-weight: 500; }
.md-typeset .lrs-feed > ul > li > small { flex: 1 1 auto; color: var(--md-default-fg-color--light); font-size: 0.66rem; }
.md-typeset .lrs-feed > ul > li > .lrs-when { margin-left: auto; font-size: 0.66rem; }

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

/** overrides/home.html (v2.5): the front page's hero, as a Material
 *  template override — https://squidfunk.github.io/mkdocs-material/customization/
 *  (`custom_dir`, `extends "main.html"`, the `tabs` and `content`
 *  blocks — the pattern Material's own landing page uses). The hero
 *  sits between the tab bar and the article: the site's name, what it
 *  is, a button that opens the theme's own search, the corpus in
 *  numbers; everything it says comes from the page's `hero:` front
 *  matter, which `frontPage` writes. The `content` block prints the
 *  page body alone — Material would otherwise add an H1 of the nav
 *  title ("Home") above it. */
const HOME_HTML = `{#- generated by pipeline/wiki.mjs — overwritten on every render -#}
{% extends "main.html" %}

{% block tabs %}
  {{ super() }}
  {% set hero = page.meta.hero or {} %}
  <section class="lrs-hero">
    <div class="md-grid lrs-hero__grid">
      <div class="lrs-hero__body">
        {% if hero.eyebrow %}<p class="lrs-hero__eyebrow">{{ hero.eyebrow }}</p>{% endif %}
        <h1 class="lrs-hero__title">{{ config.site_name }}</h1>
        {% if hero.lead %}<p class="lrs-hero__lead">{{ hero.lead }}</p>{% endif %}
        <div class="lrs-hero__actions">
          <button type="button" class="md-button md-button--primary lrs-hero__search" data-lrs-search>
            {% include ".icons/material/magnify.svg" %} Search the catalog <kbd>/</kbd>
          </button>
          {% if hero.documents %}
          <a class="md-button lrs-hero__all" href="{{ hero.documents | url }}">
            {% include ".icons/material/file-document-multiple-outline.svg" %} Every document
          </a>
          {% endif %}
        </div>
        {% if hero.hint %}<p class="lrs-hero__hint">{{ hero.hint }}</p>{% endif %}
      </div>
      {% if hero.stats %}
      <ul class="lrs-hero__stats">
        {% for s in hero.stats %}
        <li><a href="{{ s.href | url }}"><strong>{{ s.n }}</strong><span>{{ s.label }}</span></a></li>
        {% endfor %}
      </ul>
      {% endif %}
    </div>
  </section>
{% endblock %}

{% block content %}
  <div class="lrs-home">
    {{ page.content }}
  </div>
{% endblock %}
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
    kindLayout: w.kindLayout || "ledger",
  };
  if (!DEPLOY_MODES.includes(opts.deploy)) {
    throw new Error(`wiki.deploy must be one of ${DEPLOY_MODES.join(", ")}, got "${opts.deploy}"`);
  }
  if (!KIND_LAYOUTS.includes(opts.kindLayout)) {
    throw new Error(`wiki.kindLayout must be one of ${KIND_LAYOUTS.join(", ")}, got "${opts.kindLayout}"`);
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
  const vocab = loadVocabulary();
  const glossary = glossaryEntries(vocab);
  const model = buildModel(docs, kw, { kindFolders, libDir, glossary });
  const drafts = readDrafts(opts.draftsDir);
  readPhase.done(
    `${docs.length} sidecar(s) from ${libDir}, ${model.kinds.size} kind(s), ` +
    `${model.keywords.size} keyword(s)` +
    (kw.file ? `, list backup ${path.basename(kw.file)} (${kw.canonical.size} alias(es) merged)` : ", no list backup") +
    `, ${glossary.length} glossary entr${glossary.length === 1 ? "y" : "ies"}` +
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
  for (const [kind, ds] of model.kinds) put(`${pageName(kindFolders[kind] || kind)}/index.md`, kindIndex(kind, ds, model, kindFolders, opts));
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
  put("glossary.md", glossaryPage(glossary, model, vocab));
  write(outDir, "includes/glossary.md", glossaryAbbreviations(glossary));
  put("about.md", aboutPage(model, opts));
  put("index.md", frontPage(model, kindFolders, opts, drafts));
  write(docsDir, "stylesheets/extra.css", EXTRA_CSS);
  write(outDir, "overrides/home.html", HOME_HTML);
  write(docsDir, "javascripts/tables.js", TABLES_JS);
  write(outDir, "mkdocs.yml", mkdocsYml(model, kindFolders, opts, drafts));
  write(outDir, ".github/workflows/pages.yml", pagesWorkflow(opts));
  write(outDir, "README.md", WIKI_README(opts));
  write(outDir, ".gitignore", "site/\n");
  renderPhase.done(`${pages} page(s) and ${mediaFiles} media file(s) written to ${outDir}`);
  return {
    docs: docs.length, drafts: drafts.length,
    kinds: model.kinds.size, keywords: model.keywords.size,
    keyword_aliases_merged: kw.canonical.size, glossary: glossary.length,
    pages, media_files: mediaFiles, media_missing: mediaMissing,
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
