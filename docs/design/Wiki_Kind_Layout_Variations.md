# Wiki Kind-Page Layout Variations

Two layouts for the long per-kind tables (`/test-plans/` and its
siblings) and one for the document page's metadata card, built on
pymdown's Blocks `details` plugin
(https://facelessuser.github.io/pymdown-extensions/extensions/blocks/plugins/details/).
Nothing here is wired into `pipeline/wiki.mjs` yet: this note records
the shapes, the CSS and JS they need, and what changes when one is
chosen. Companion to `Markdown_Layout_Plan.md` (the dialect and the
MkDocs lane) and to wiki v2.1 in `docs/changelog/pipeline.md` (the
pages dressed by content type).

The mockups were rendered from a 14-plan fixture library through the
real `wiki.mjs` render and a local `mkdocs build`; the scripts are in
`wiki-layout-mock/` (see §6).

---

## 1. The ask

The kind tables are a wall of rows once a kind passes a few dozen
documents: Document · Product · Release · Edited, sortable and
filterable, but every row looks like every other and the one thing a
reader most often wants to know first — *what is this plan about, and
which tools does it exercise* — is a click away. The proposal:

- a **tags index** per test plan, the associated tools as **pills**;
- the plan's **name, tags and last-edited date in the header** of a
  details block (the `<summary>` element);
- **nested below it, the plan's summary** as its own details block,
  `open: false`;
- and, on the document page, the **entire metadata table folded away**
  rather than sitting at the top of every page.

## 2. What the details plugin gives us

`pymdownx.blocks.details` (already a sibling of the `blocks.html` and
`blocks.admonition` plugins mkdocs.yml enables since v2.1):

```
/// details | Summary text
    open: true            # rendered open; default closed
    type: abstract        # one class, styled by Material like the admonition of that name
    attrs: {class: x}     # any attributes

Body — ordinary markdown blocks.
///
```

Three facts the mockups rely on, all confirmed in the build:

1. **The summary text takes inline markdown.** Links, `attr_list`
   classes on links (`[Merge Events](../tools/merge-events.md){ .lrs-pill }`),
   emphasis with a class (`*2026-08-01*{ .lrs-when }`) and an inline
   `<span>` all render inside the `<summary>`. That is what puts the
   title link, the pills and the date in the header row.
2. **Nesting is by slash count**, outer block more slashes than what
   it holds — the rule `mdlayout.mjs` v1.4 already follows for the
   case card. A plan card is `//// details` around a `/// details`.
3. **`type: abstract`** on the nested Summary block gives it Material's
   abstract icon and colour — the same "Summary" type the document
   page's `!!! abstract` block wears, so the summary looks the same in
   the list and on the page.

## 3. Variant A — open cards, the summary folded

One details block per plan, **open**, the header row = title · tool
pills · edit date (pushed right); the body = a facts line (product,
release, surface, case count, PE — every value linking its catalog
page) and the Summary fold, closed. Newest edit first, as today.

```
//// details | [Merge Events Test Plan](./4855-merge-plan.md) <span class="lrs-tags">[Merge Events](../tools/merge-events.md){ .lrs-pill } [Apply Event Behaviors](../tools/apply-event-behaviors.md){ .lrs-pill }</span> *2026-08-01*{ .lrs-when }
    open: true
    attrs: {class: "lrs-plan"}

<div class="lrs-plan__facts" markdown>[Roads & Highways](../products/roads-and-highways.md) · release [3.8](../releases/3-8.md) · [Pro](../surfaces/pro.md) · 14 cases · PE [Claire Wang](../people/claire-wang.md)</div>

/// details | Summary
    type: abstract

Covers merging line events across routes, with the lock conflict case. …
///
////
```

Reads as: a stack of cards, each about three lines tall, the tools
visible without opening anything, the summary one click away. The
type-to-filter box filters the cards (§5) on everything in them —
title, tools, product, PE, and the summary text too, so "lock" finds
the two plans that mention locks in their summaries. Costs: the page
is roughly three times as tall as the table for the same rows, and
there is no column sort (the edit-date order is fixed; product and
release are in the facts line, not sortable columns).

## 4. Variant B — a ledger, closed rows grouped by release

The same header row, but the block is **closed** and there is no
nested fold: opening a row shows the facts line and the summary text
directly. Rows are grouped under a heading per target release
(newest release first, newest edit first within it), each heading
carrying its count and linking the release's catalog page.

```
## [Release 3.8](../releases/3-8.md) <small>4 plans</small>

//// details | [Merge Events Test Plan](./4855-merge-plan.md) <span class="lrs-tags">…pills…</span> *2026-08-01*{ .lrs-when }
    attrs: {class: "lrs-plan lrs-plan--row"}

<div class="lrs-plan__facts" markdown>…</div>

Covers merging line events across routes, with the lock conflict case. …

////
```

Reads as: one line per plan, about as dense as the table, with the
tools where the Product column used to be and the grouping doing the
work the Release column did. A quiet grey rail until a row is open;
open rows take the site's blue rail. The page-wide filter hides the
release headings whose rows all fell out (the `filter-all` behaviour
the case catalog already has, extended to details rows). The group key
is a choice: release is the natural one for test plans; product or the
edit year would suit other kinds, or a kind could keep the table.

## 5. The document page — the metadata table folded

Under the title, a **facts strip** (the same `.lrs-facts` shape a
catalog value's page has) carries what a reader scans for: the tool
pills, then kind · surface · product · release · edited by whom — each
linked. The full metadata card goes into a closed `Details` block
under it, the Open button and the Summary follow as today.

```
<div class="lrs-doc-facts" markdown>

[Merge Events](../tools/merge-events.md){ .lrs-pill } [Apply Event Behaviors](../tools/apply-event-behaviors.md){ .lrs-pill }

Test plan · [Pro](../surfaces/pro.md) · [Roads & Highways](../products/roads-and-highways.md) · release [3.8](../releases/3-8.md) · edited *2026-08-01*{ .lrs-when } by [Mac Christmas](../people/mac-christmas.md)

</div>

///// details | Details
    attrs: {class: lrs-doc-meta}

//// html | div.doc-meta

| Field | Value |
| --- | --- |
| **Doc** | 17 · [Test Plan](./index.md) · [Pro](../surfaces/pro.md) |
| … the format 3.1 rows, unchanged … |
////
/////
```

The table itself does not change: the format 3.1 rows are the contract
`tests/check_wiki.py` pins, and the `.doc-meta` card styling still
applies inside the fold. What moves is the reader's first screen — the
summary and the first test case are visible without scrolling past
Status, Source, Extracted and Generated. Keywords are the one row the
strip does not repeat; they could join the pills in a second, lighter
style if the strip is not to lose them.

## 5a. The case card — labels gone, and two layouts for the body

Wired (wiki v2.3, mdlayout v1.5): the Group and Steps fields lose
their labels. Each is a class-named html block with the content alone
(`FIELD_BARE` in `mdlayout.mjs`), drawn as an eyebrow over the card
and as the procedure; Case and Trace stay a definition list, the
Expected result stays the green row.

Two further layouts, mocked in `wiki-layout-mock/` (the doc page's
body wrapped in a `///// html | div.lrs-s1` / `div.lrs-s2` block, the
CSS scoped to it):

- **S1, the procedure.** The group rides in the head bar, at the
  right of the case id and title (absolutely positioned into the
  `h3`; a title long enough to wrap would collide with it). The Case
  line, when there is one, is the card's lead sentence in a lighter
  ink, no label — it is the full case text the heading shortened. The
  checkboxes go: they never tick (About says so), and the step
  number already leads each line. The verdict row sits flush at the
  card's foot.
- **S2, the ledger.** A group is a divider over the run of cases that
  share it — cases in the same group are consecutive, so the eyebrow
  on every card repeats itself — and the steps sit beside the
  expected result, the way a test-case table reads: the tester's
  eye goes left to right, do this, see that. The card is a two-column
  grid (3 : 2); on a narrow screen it stacks. The divider needs one
  structural change in `wrapCases()` — emit it where the group
  changes — where S1 is CSS alone.

Both drop the checkboxes; either could keep them.

## 6. What the render would gain

- **mkdocs.yml**: `- pymdownx.blocks.details` after
  `pymdownx.blocks.admonition`.
- **extra.css**: `wiki-layout-mock/variants.css` — the `.lrs-pill`
  (link ink on a 9 % wash of itself, so it needs no second colour and
  works on slate), the `.lrs-plan` card (the summary element as a flex
  row: title, the pills in a wrapping `.lrs-tags` span, the date
  `margin-left: auto`), the `--row` variant for B, and the
  `.lrs-doc-facts` strip and `.lrs-doc-meta` fold for the page.
- **tables.js**: `wiki-layout-mock/variants.js` — the filter box on a
  `.lrs-plans` wrapper filters `details.lrs-plan` children instead of
  table rows, and folds a heading whose rows all hid. Same
  `document$` hook, same box, same `FILTER_MIN_ROWS` rule.
- **wiki.mjs**: `kindIndex()` composes the chosen shape (the pill and
  facts helpers in `variants.mjs` are the prototype); `docPage()`
  wraps the meta table and writes the strip; `mdlayout.block()`
  already composes a Blocks-syntax block, and `details` needs only its
  `open` / `type` options. A `wiki.kindLayout` key (`table` |
  `cards` | `ledger`) would keep the table available per site.
- **check_wiki.py**: the pinned `<div class="doc-table filterable">`
  on `test-plans/index.md` moves to the new wrapper; new gates for the
  pills linking the tools catalog, the date in the summary line, the
  nested abstract block, and the strict build passing with the details
  plugin on.

To regenerate the mockups:

```
cd docs/design/wiki-layout-mock
node fixture.mjs "$PWD/site"                                   # 14 plans in a sidecar library
node --experimental-strip-types ../../../pipeline/wiki.mjs --config "$PWD/site/config.json"
node variants.mjs "$PWD/site"                                  # variant pages + css/js + mkdocs.yml patch
(cd site/work/wiki && python -m mkdocs build)                  # mkdocs-material, no captions/panzoom needed
python shoot.py                                                # screenshots, served from site/work/wiki/site
```

## 7. Open decisions

1. **A or B for Test Plans** — A when the summaries are the thing
   people scan; B when the list is long and the release is how people
   think about it. Both keep the table reachable through All documents.
2. **Which kinds** — the other kinds have fewer tools and shorter
   lists; they can keep the table, take B with a different group key,
   or take A.
3. **The metadata fold on every page**, or only on kinds whose strip
   carries enough (a Doc Review has no tools to show).
4. **The case card**: S1, S2, or the wired default; and whether the
   checkboxes stay.
