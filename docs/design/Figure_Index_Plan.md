# Plan — indexing figures + standardized figure names (`local/lib/figureindex.mjs`)

Status: **BUILT** (2026-09-05 — `local/CHANGES.md` sweep v1.59,
figureindex v1.0, indexpages v1.3): the schema
(`schemas/SPList_Figures.csv`), the pure module
`local/lib/figureindex.mjs` (naming rule + parser + row shaping; own
gate `local/harness/check_figureindex.py`, 46/46, CI), the sweep
wiring (`syncFigures` at index time, on `--reformat` and on
`--normalize-cases`, ghost-pass pruning, the `--refigure` backfill,
counters + status-page line, the missing-GUID fail-soft, the shared
missing-column fail-soft), the standardized media file names on the
index and reformat paths, and the consumer `_Figure Catalog.md`
(rebuilt by live full sweeps, live `--refigure`, `--rename` and
`--normalize-cases`). Gates: `check_local_sweep.py` (figure-index,
media-rename, refigure, missing-column and missing-GUID legs),
`check_figureindex.py` 46/46 — CI. What remains is TENANT work:
create the Figures list (Local_Setup §14), paste its GUID, run
`--reformat --live` (renames the corpus's media) and `--refigure
--live` once — all queued behind auth restore (STATUS action 12).
This document is the design record, the `Case_Index_Plan.md` mold.

## Why

Two owner requests, one module:

1. **"Index the figures."** The corpus carries hundreds of pasted
   screenshots and drawn diagrams — the mockups, dialog captures and
   route sketches that explain a story or a case better than its
   prose — and nothing can find them. The Doc Index row knows a
   document has media only by the sidecar's links; the Test Cases row
   (caseindex v1.3/v1.4) counts and links the figures inside a case,
   but a figure outside any case (a story mockup, a spike diagram)
   is invisible, and no surface answers "show me every screenshot of
   the Split Route dialog" or "which stories have UI mockups".
2. **"Prettify and standardize the file names."** Pictures land in
   `media/<stem>/` under their OOXML part names — `image1.png`,
   `image7.jpeg` — which say nothing, collide across every document,
   and mix extensions (`jpeg`/`JPG`/`png`). The sidecar stem got its
   rule in Sidecar_Format_Plan §4.6 (phase 1b); the files beside it
   never did.

The raw material is already there — like the case index this is an
*indexing* move: ZipTextExtract links every picture MediaExtract
saves (`![image1.png](../media/__MEDIA__/image1.png)`, SC-4) and
folds a drawn diagram's labels into one `[figure: …]` line (DL-1);
the sweep writes the files. What is missing is a NAME rule and rows.

## Design decisions

**D1 — the name comes from the text, not the archive.** A picture's
standardized name is minted from ZipTextExtract's output alone
(ordinal in document order, the slide it first appears on, the slide
title), so the index path (bytes in hand) and the `--reformat` path
(files already on disk, no re-extraction) compute the same name
without touching the source. Consequence: a reformat converges a
legacy-named corpus by MOVING files, never by re-extracting; a second
reformat is a no-op.

```
fig-<NN>[-slide-<KK>][-<slug>].<ext>

fig-01-slide-02-loop-route.png       pptx: slide 2 titled "Loop Route"
fig-04-slide-03.gif                  pptx: untitled slide 3
fig-02-detail-the-widgets-panel.png  docx: nearest heading, no slide token
```

NN = the picture's ordinal among the document's DISTINCT source
files (a logo linked from every slide is one figure with one name);
KK = the slide of first appearance; slug = kebab-case of the slide
title (or the nearest docx heading), capped at 40 characters at a
word boundary, never ending on a stopword; ext lower-cased with
`jpeg → jpg`. Alt texts become `Figure N — <title>`, and a slide's
links go one per line (they shared a line before, and only the first
was ever read by the case parser's figure counter).

**D2 — parse the sidecar body, not the source file** (the
Case_Index_Plan D1 posture). Figure rows come from the rendered body
below the metadata seam: one seam, no extraction lanes, a backfill
that needs no source download and no AI, and a `--reformat`-improved
corpus re-indexes its figures for free. Coupled to the case grammar's
emission the same way — `check_figureindex.py` extracts from a body
`renderTestPlanBody(tidyBody(…))` itself rendered, so a figure inside
a `### TC-P01` section is attributed to that case, and drift breaks
the gate, not the corpus.

**D3 — two kinds, one sequence.** `image` rows are pasted pictures
(a file, a link, a pixel size); `diagram` rows are collapsed
`[figure: …]` label lines (a drawn diagram whose labels are the
caption; no file). Both share the document's ordinal sequence so a
row reads "figure 3 of this document" whichever kind it is. The
rendered-SVG lane that used to turn diagrams into files was removed
in sweep v1.58; diagram rows are what remains of it — the labels,
which is what a searcher types.

**D4 — replace-set identity** (`FigureKey = {docRowId}|{ordinal}`),
exactly the Test Cases rule: every (re)index of a document replaces
its full figure-row set (diff by key, update only on a real field
change, hyperlinks compared by Url), an archived document deletes its
rows in the ghost pass, and nothing else in the pipeline may hold a
Figures row id. `diffCaseRows` grew a `keyField` parameter so both
lists use ONE planner.

**D5 — every kind, by default.** Unlike cases (Test Plans only),
figures live everywhere — stories carry the mockups. `sweep.figureIndex.kinds`
defaults to `[]` = all indexed kinds; a list narrows it.

**D6 — deterministic, zero AI, local stack only.** No prompt, no
flow, no `Config.PromptVersion` change. SharePoint's role is storage:
one new list.

## The eighth list — `Figures` (`schemas/SPList_Figures.csv`)

| Column | What |
|---|---|
| Title | `Figure N — <section>` (images) / `Figure N — <labels>` (diagrams) |
| Document | Lookup → Doc Index, INDEXED, created via CLASSIC settings |
| FigureKey | `{DocRowId}\|{ordinal}` — INDEXED replace-set key |
| FigureNo, Kind, FileName, Format | ordinal; image/diagram; the standardized name; png/jpg/gif/bmp/svg/other/none |
| SlideNo, Section, CaseNo, Anchor | where it sits: slide, section heading, TC id when inside a case, deep-link anchor |
| Caption, Context | diagram labels / a meaningful alt; the section's prose, capped (`contextCap`) |
| Width, Height, Bytes | from the file header on disk (PNG/GIF/BMP/JPEG); empty when not on disk |
| Tools, Keywords | curated-vocabulary tags of title + section + caption + context, rarest-first (caseindex's matchers) |
| ImageUrl, ImageLink | the picture's absolute URL as text and as a clickable Hyperlink (SPO route) |
| SweptOn | last CHANGE |

The CSV is authoritative for column details. Parent metadata
(kind, products, release) stays one lookup away on the Doc Index
row, as with cases.

Volume: the first live export ran to 24 pictures and 42 diagrams on
the largest documents (1,302 rows over 139 documents); a few hundred
documents keep the list well under every threshold, and the per-doc
replace-set touches a few dozen rows a night at most.

## Module and integration points

**`local/lib/figureindex.mjs`** (pure): `prettifyMedia(docText)` →
`{ text, renames, figures }` (the naming half); `extractFigures(body,
{ mediaUrlBase, contextCap, vocab, docTitle, sizeOf })` → `{ figures }`;
`toFigureRowFields`; `diffFigureRows`; `imageSize(buf)`;
`figureName`, `isPrettyName`, `formatOf`.

**`local/sweep.mjs`** (v1.59):

- `indexDoc`: `prettifyMedia` runs on the extracted text before
  anything reads it (LLM input, preview, sidecar); `writeMedia`
  saves the bytes under the standardized names; `syncFigures` after
  `syncCases`.
- `--reformat`: the same naming from the re-extracted text; files on
  disk move to match (`placeLegacyMedia` now also converges
  `image1.png → fig-…` inside `media/<stem>/`, and the pre-1b flat
  `doc<id>_image1.png` straight to the new name); counter
  `media_renamed`; `syncFigures` on the reformatted body.
- ghost pass: figure rows pruned with the sidecar.
- `--normalize-cases`: an LLM-normalized body re-syncs its figures
  (case attribution can move).
- `--refigure`: the backfill — every Indexed document with a sidecar
  re-parses its body and replace-sets its rows; orphans (documents
  gone, Archived, off the kinds list) delete; live runs rebuild the
  catalog. Standalone mode, dry by default, no AI.
- counters `figures_upserted` / `figures_removed` / `figure_errors`
  (+ `figure_fields_dropped`), a **Figures** line on the status page.
- fail-soft: missing `sharePoint.lists.figures` = one loud note per
  run, documents index normally, `--refigure` refuses naming the fix;
  a column the tenant list lacks is dropped and noted once per run
  (the v1.56 dropper, now shared by both lists).
- `--rename` moves media as before (names are stem-independent) and
  now tells the operator to run `--refigure --live` too (ImageUrl
  carries the stem).

**Config** (`config.sample.json`): `sharePoint.lists.figures` (the
switch) and `sweep.figureIndex { kinds: [], contextCap: 2000 }`.

## Consumer surfaces

1. **`_Figure Catalog.md`** (indexpages v1.3): one library-root
   browse page, figures grouped by document (newest first), each row
   linking the picture in the media folder and the sidecar section
   through its anchor, with slide / case / pixel size / caption;
   diagram rows show their labels. The Q&A agent grounds on it
   automatically (same library).
2. **Figures list views** — filter by Kind, Format, Tools/Keywords,
   CaseNo; `ImageLink` opens the picture.
3. **Test Cases join** — a case's figures were already on its row
   (FigureLinks); the Figures row adds the reverse direction with
   `CaseNo` + `Document`.

Queued, NOT built (each is its own decision): OCR text of
screenshots as a column (Tesseract is configured on the sweep
machine for scanned PDFs only; a per-picture OCR lane is spend and
time); perceptual-hash dedup across documents; a thumbnail column
(rejected for cases in caseindex v1.4 for the same reasons).

## Versioning and rollout

- **FigureIndexVersion** (`FIGURE_INDEX_VERSION` in the module)
  joins the component table and bumps like a parser: a change
  re-flows the corpus via `--refigure`. Never touches prompts.
- Rollout (Local_Setup §14): create the list (classic lookup), add
  the GUID, `--reformat --live` (renames the corpus's media and
  relinks the sidecars — the same pass the format-3.0 rollout already
  needs), `--refigure --live` once; the nightly sweep keeps it
  converged. Order: reformat BEFORE refigure so the rows carry the
  standardized names.
- Rollback = remove the GUID; nothing else reads the list. The
  standardized names stay (they are just names; every link follows).

## Gates

- **`check_figureindex.py`** (46, CI): naming legs (ordinal / slide /
  slug cap + stopword trim / jpeg→jpg / one name per source file /
  one link per line / docx headings / fenced code / fixed point),
  index legs against the case grammar's own body (kinds, attribution
  to TC sections, captions, context, legacy paths, url resolution,
  sizeOf plumbing, tags), header sizing (PNG/GIF/BMP/JPEG/junk), row
  shaping + replace-set planner.
- **`check_local_sweep.py`** legs: the write contract (row from a
  mock-Graph run — name, placement, size from disk, URL + hyperlink
  via SPO), ghost pruning, idempotency, catalog + status line,
  reformat no-churn + the media-rename convergence (archive-named
  file moves, body relinks, row updates, second reformat no-op),
  `--refigure` dry/live/orphan/no-AI/catalog, the shared
  missing-column dropper on the Figures list, missing-GUID fail-soft
  and refusal, standalone-mode guard.

## Addendum (2026-09-05) — the first live export (figureindex v1.1, sweep v1.60)

1,302 rows / 139 documents an hour after the rollout: every picture
on a standardized name, every one sized, TC attribution working. Two
findings changed the module (`local/CHANGES.md` v1.60): pictures no
larger than 48 px are Kind `icon` (90 of 687 were docx button
glyphs), and untitled slides take their first text line as the slug
(155 pictures were slug-less). One finding changed the sweep: a
reformat converges an earlier standardized name by its
`fig-NN[-slide-KK]` prefix. Left as found: the diagram captions are
the DL-1 collapse verbatim, template assets repeat across documents
(a cross-document flag stays deferred), and tag noise is curation
work.

## Addendum (2026-09-05) — drawn shapes and text (ShapeExtract v1.0, sweep v1.61)

Owner request after the first export: "we need to extract drawn shapes
and text". D3's `diagram` rows carried only the collapsed labels; the
drawing itself was lost since the v1.58 removal of the stylised
renderer. `scripts/ShapeExtract.ts` now extracts the drawing layer
FAITHFULLY — the shapes at their true positions with their fills,
outlines, arrows, rotations and text — as one SVG per qualifying
slide, plus the glued connections as `A → B` words. The sweep links
each drawing under its slide with a `[connections: …]` line, names it
with the pictures, and the Figures row folds the label line and the
drawing into ONE Kind `drawing` row (file + labels + connections).
Decisions: faithful, never restyled (the removed renderer redrew;
this one draws what the slide draws); qualification by drawn
primitives (≥ 3), never by text; pictures as placeholders that also
reference their sibling file; SmartArt/charts undrawn; svg2pptx not
retargeted. Details in `local/CHANGES.md` v1.61.
