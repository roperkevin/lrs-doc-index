# Wiki Home Page — the landing page, and the Material reference reviewed

The front page of the wiki rebuilt as a landing page (wiki v2.5), and
the record of the review that shaped it: every page of the Material
for MkDocs reference (https://squidfunk.github.io/mkdocs-material/reference/),
its setup pages and its built-in plugins, read for what this site can
use. Companion to `Wiki_Kind_Layout_Variations.md` (the kind pages and
the document page) and `Markdown_Layout_Plan.md` (the dialect).

The mockups were rendered from the 14-plan fixture in
`wiki-layout-mock/` through the real `wiki.mjs` render and a strict
`mkdocs build` (Material 9.7.7, pymdown-extensions 11); the gate
`tests/check_wiki.py` builds the same way in CI.

---

## 1. The ask

The front page was a document: an H1, a paragraph, a tip box, one
card per kind, an eight-row table, then eleven cards in one grid. It
read like every other page — nothing said *this is the front door*,
nothing said how big the corpus is, and the one thing a reader
arrives to do (search) was a paragraph of advice inside a green box.

## 2. What was built

**The hero.** Between the tab bar and the article: the site's name,
one sentence on what the site is, a Search button that opens
Material's own search (`/` does the same), an Every-document button,
the search hint, and the corpus in numbers — documents, test cases,
figures, tools, keywords, people — as tiles that link the pages they
count. A count of nothing gets no tile.

It is a *template override*, the pattern Material's own landing page
uses (customization → `custom_dir`, a template that `extends
"main.html"` and appends to the `tabs` block after `{{ super() }}`).
The render writes `overrides/home.html`; the front page's front matter
selects it with `template: home.html` and feeds it a `hero:` map (the
eyebrow, the lead, the hint, the stats with final URLs, passed through
MkDocs' `url` filter so they hold under `offline`'s `.html` URLs). The
`content` block prints the page body alone — Material would otherwise
put an H1 of the nav title ("Home") over it — and `hide: [navigation,
toc]` gives the sections the whole column.

**The corpus in content tabs.** By kind, the cards (icon, count, the
newest edit); by surface, by product, by release, *facet bars*: a
value, a bar scaled to the largest count, the count — the shape of the
corpus at a glance, the top eight values and the way to the whole
catalog. pymdown's Blocks `tab` (`/// tab | By kind`), Material's
alternate style — the only style it supports — no indentation, the
same Blocks family the case card and the ledger already use.

**The recent edits as a feed.** A row per document: the kind's icon,
the title, the kind and product in a lighter ink, the date at the
right. Eight rows need no header to sort; the Recent page keeps the
table.

**Browse and More.** The seven catalogs as cards with their counts,
then test cases (its count), figures, recent, drafts when published,
about.

**Site-wide, from the same review.** Every index page carries
Material's `icon:` front matter, so the tab bar and the sidebar wear
the kinds' and the catalogs' icons (the same icon the H1 wears).
`theme.font: false` with the system faces in `extra.css` (Segoe UI,
Cascadia; Material's own stack behind them) — the fonts stylesheet is a
render-blocking request to Google, and this site is served on the
internal network. `navigation.instant.prefetch` and
`content.footnote.tooltips`.

## 3. The reference, page by page

Material 9.7.0 (November 2025) made every Insiders feature free; 9.7
is also the last feature release (maintenance for a year, the team
moved to Zensical). So nothing below is gated; two plugins are
deprecated. The version the runner installs is whatever pip resolves
(`mkdocs-material`, unpinned, today 9.7.7).

| Page | Offers | Here |
|---|---|---|
| Admonitions | `!!!`, `???`, `???+`, inline, custom types | In since v1.6/v2.1: abstract, related, docs, draft, success. |
| Annotations | `(1)` markers with a footnote-style list | Passed: nothing in a rendered sidecar carries them; a hand-written page may. |
| Buttons | `{ .md-button }`, `--primary` | The hero's two buttons; the document page's Open link (v2.0). |
| Code blocks | highlight, copy, select, annotate, titles | `content.code.copy` on; no code in the corpus, the rest passed. |
| Content tabs | `===` or `/// tab`, `content.tabs.link` | **Adopted** for the front page (Blocks form). |
| Data tables | `tables`, sorting via tablesort from a CDN | The render writes its own sort script (v1.7) — no CDN on the internal network. |
| Diagrams | mermaid fence | In since v1.5 (the runtime loads from a CDN; nothing generated emits one). |
| Footnotes | `footnotes`, `content.footnote.tooltips` | Footnotes since v2.1; **tooltips adopted** (free since 9.7). |
| Formatting | critic, caret, keys, mark, tilde | Tilde since v2.0; the rest are authoring syntaxes the corpus does not carry. |
| Grids | card grids, generic grids | The cards since v1.4/v2.1; the front page's two grids and the figures. |
| Icons, emojis | `:material-…:`, `icon:` front matter, `theme.icon.*` | Since v2.1; **`icon:` front matter adopted** for every index page. |
| Images | align, lazy, light/dark, `/// caption`, glightbox | glightbox + markdown_captions + panzoom since v1.5. |
| Lists | def_list, tasklist | Since v1.8/v1.1. |
| Math | arithmatex + MathJax/KaTeX from a CDN | Passed: no mathematics in the corpus, and a CDN. |
| Tooltips | `abbr`, `content.tooltips`, a glossary snippet | `content.tooltips` since v2.1; a glossary is a Vocabulary question (the official terms), noted for later. |

## 4. Setup and plugins

| Page / plugin | Decision |
|---|---|
| Colors | `primary: custom` with the site's blue and teal in extra.css, light and slate (v2.1). The hero draws on the same variables. |
| Fonts | **`font: false`** — the system faces; no Google Fonts request. |
| Logo and icons | The book icon stays; `icon:` per index page adopted. |
| Navigation | tabs, sticky tabs, indexes, prune, top, tracking, footer, instant + progress (v2.0/v2.1); **instant.prefetch adopted**. `navigation.path` (Material's breadcrumbs) would double the render's own crumb line — a candidate for the document-page pass, where the composed line could then go. `navigation.expand` is incompatible with prune. |
| Search | suggest, highlight, share, the recommended separator; boost/exclude front matter (v2.0). |
| Header, footer | `navigation.footer` on; no announcement bar (nothing to announce nightly), no social links (internal). |
| Git repository | Passed: `repo_url` would show the wiki repository, not the sources, and its stars badge calls the GitHub API at view time. |
| Analytics, comments, versioning, consent | Passed: internal, single version, a render (comments would be edits nobody keeps). |
| Offline | `wiki.offline` since v2.0. |
| `tags` | Passed again: Keywords already is a tag catalog with curation behind it. |
| `meta` (`.meta.yml` per folder) | Passed: the render writes every page's front matter itself. |
| `group` | Passed: the one conditional plugin (`offline`) is a config knob. |
| `social` | Passed: needs Pillow + CairoSVG and the Cairo libraries on the runner — a self-hosted Windows runner — and cards exist to be unfurled in chats the site is not posted to. |
| `optimize` | Passed: Pillow + pngquant on the runner; the figures are already small PNGs. |
| `privacy` | Passed: it fetches external assets at build time, and a fetch warning fails `--strict`. With `font: false` there is nothing left for it to fetch. |
| `typeset`, `projects` | Deprecated in 9.7 ("known issues will not be fixed"). |
| `blog` | Not a blog. |
| `info` | A bug-report tool, not a site feature. |
| Third-party: glightbox | In since v1.5. |
| Third-party: git-revision-date, git-committers, git-authors | Passed: the dates and people are the sidecars' own. |
| Third-party: minify | Passed: one more package on the runner for bytes an internal site does not count. |
| Third-party: redirects | Noted: nothing records a document's previous slug yet. |

## 5. The next pages

"Start with the home page and build from there." The kind pages
(the ledger) and the document page (the facts strip, the checklist)
are v2.4; what the review suggests for them, in order:

1. **Breadcrumbs from the theme** (`navigation.path`) and the render's
   own crumb line retired — one line, Material's own styling.
2. **Content tabs on a document page** — Summary · Related · Esri
   documentation as tabs over the body instead of three stacked
   blocks, when a page has all three.
3. **A glossary** from the official vocabulary (`abbr` + a snippets
   `auto_append` file): every official term in a body gets a tooltip.
4. **The catalog index pages** as facet bars rather than
   two-column tables where the values are few (surfaces, products,
   releases); the tables stay for keywords, tools, people, issues.

## 6. How to see it

```
node docs/design/wiki-layout-mock/fixture.mjs <dir>
node --experimental-strip-types pipeline/wiki.mjs --config <dir>/config.json
cd <dir>/work/wiki && python -m mkdocs serve
```

(`pip install mkdocs-material mkdocs-glightbox mkdocs-panzoom-plugin
markdown-captions` first; drop the `markdown_captions` line from
mkdocs.yml where that package will not build.)
