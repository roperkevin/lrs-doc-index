# Local sweep — release notes

## sweep v1.61 (2026-09-05 — drawn shapes and text; ShapeExtract v1.0, figureindex v1.2, indexpages v1.4, ops v1.1)

Owner request: "we need to extract drawn shapes and text". Until now a
slide's drawing layer reached the index only as ZipTextExtract's
`[figure: …]` label line; the geometry, fills, arrows and the words in
the boxes were lost (the v1.58 removal took the stylised SVG redraw
with it). This round extracts the drawing FAITHFULLY:

- **`scripts/ShapeExtract.ts`** (new, ES2017, zero dependencies; the
  shared zip reader under the KEEP-IN-SYNC banner): per pptx slide
  that carries a drawing — at least three drawn primitives (a shape
  with a visible fill or outline, a connector, a freeform) — one SVG
  of the drawing layer at the shapes' TRUE positions and sizes:
  preset geometries as their primitives (rect, rounded rect with its
  adj radius, ellipse, diamond, triangles, block arrows, chevrons,
  hexagons, parallelograms, terminators… anything else as its box
  with `data-prst`), freeform custGeom paths, groups through their
  child-space transform, rotations, fills / outlines / dash patterns
  / arrowheads with colours resolved through the deck's own theme
  (lumMod / lumOff / tint / shade; p:style lnRef / fillRef / fontRef
  fallbacks), and every shape's text wrapped inside its box the way
  PowerPoint lays it out. Placeholders never draw (they are prose); a
  plain text box is a label and renders on a qualifying slide;
  tables / charts / SmartArt are not drawn; a pasted picture renders
  as a placeholder box that also references the sibling picture file
  by basename (an annotated screenshot keeps its annotations in
  place). Slides are numbered in presentation order like
  ZipTextExtract's headings. Alongside the SVG: **`connections`** —
  the connectors PowerPoint glued to shapes (`a:stCxn` / `a:endCxn`)
  as `A → B` text (`—label→` for a labelled connector, `←`/`↔` by
  arrowhead) — and **`labels`**, every shape's text in reading order.
  Bounded: 96 drawings per deck, 400 shapes per slide, 250 KB per
  SVG; the rest is listed in `skipped`.
- **Sweep**: the `shapes` op runs after ZipTextExtract on every pptx
  extraction — index AND `--reformat` (drawings are derived, cheap,
  and follow the renderer) — unless `sweep.drawings: false`.
  `placeDrawings` (figureindex v1.2) links each drawing at the end of
  its slide's section, before its Notes, followed by a
  `[connections: A → B · …]` line; prettifyMedia then names it with
  the pictures (`fig-NN-slide-KK-<slug>.svg`) and the SVG's picture
  hrefs are rewritten to the standardized names. `writeMedia` no
  longer rewrites byte-identical files (a reformat's regenerated
  drawings are not uploads). Counters `drawings` (placed) and
  `drawings_written` (reformat).
- **Figures list**: Kind **`drawing`** — an `.svg` link is a rendered
  drawing; when its section also carries the `[figure: …]` label line
  the two FOLD into one row (file from the drawing, Caption from the
  labels), so a diagram is one figure whether or not it could be
  drawn; a label-less drawing takes its connections as Caption; the
  connections line stays in Context; Width/Height from the SVG's own
  attributes. Title `Drawing N — …`. Tenant: add `drawing` to Kind.
  `_Figure Catalog.md` links drawings and counts them per document.
- `pad/runner/ops.mjs`: the `shapes` op (`ShapeExtract.ts`, zip in).
- Gates: new `review/harness/check_shapes.py` **28/28** (CI
  fixture-free: qualification + presentation order, geometry + style
  incl. theme tints / style refs / group transform + rotation /
  freeform / picture href, text wrapping + colours, connectors +
  connections string, labels, viewBox crop), `check_figureindex.py`
  **61/61** (placeDrawings placement / idempotency / naming, the
  drawing fold, connections caption + context, SVG sizing),
  `check_local_sweep.py` (a drawing slide on the alpha fixture: SVG
  on disk with its data attributes, body link + labels + connections,
  the folded drawing row with size and hyperlink, catalog, reformat
  regenerates without rewriting, refigure / icon / missing-column
  legs on two rows), `check_pad_runner.py` (the op on a drawing-less
  slide), `check_typecheck.py` (ShapeExtract at ES2017).
- Not in this round: svg2pptx.mjs / draft2pptx `--media` read the
  removed renderer's SVG vocabulary and will not convert these
  drawings back into editable shapes (the drawings carry `data-prst`
  and plain SVG primitives — a converter for them is a separate
  decision); SmartArt and chart frames stay undrawn.

ROLLOUT: add `drawing` to the Figures list's Kind choices;
`--reformat --live` (every pptx gains its drawings and connections
lines; no AI) then `--refigure --live`.

## sweep v1.60 (2026-09-05 — figureindex v1.1, tuned on the first live Figures export)

The first `Figures` export after the rollout (1,302 rows / 139
documents: 687 pictures, 615 diagrams) — every picture on a
standardized name, every one sized, case attribution working (39
pictures and 154 diagrams inside TC sections). Read from it, fixed
in `figureindex.mjs` (FigureIndexVersion 1.1 — reflow with
`--refigure --live`):

- **Icons are not figures.** 90 of the 687 pictures were 16–32 px
  button glyphs from docx documentation pages (`fig-10-example-4.png`
  at 16×16, the same 493-byte glyph in six documents). A picture no
  larger than `ICON_MAX` (48 px) on its longest side is now Kind
  **`icon`** — still a named, linked, sized file, but set aside:
  `_Figure Catalog.md` counts icons per document and does not list
  them; list views filter on Kind. Decided from the header on disk, so
  a picture the sweep cannot read stays `image`. Tenant: add `icon`
  to the Kind choices (`schemas/SPList_Figures.csv`).
- **Untitled slides name by their first text line.** 155 pictures sat
  under bare `## Slide N` headings and came out as
  `fig-01-slide-02.png`; the slide's first prose line (table rows,
  labels and links skipped; list markers, numbering and bold
  stripped) now supplies the slug —
  `fig-01-slide-02-functionality-verification-new.png`. Deterministic
  from the text as before.
- **Reformat converges an earlier standardized name.** A file already
  under a v1.59 name whose slug rule changed moves to the new name by
  its `fig-NN[-slide-KK]` prefix + extension (`placeLegacyMedia`), so
  the body never links a file that stayed behind; `media_renamed`
  counts it.
- Left as found, for the record: the 615 diagram rows are the DL-1
  label collapse verbatim (a prompt-matrix slide of floating text
  boxes yields a 26-document caption like `AI Assistant should: ·
  Route · Road · …`) — the extractor's rule, not the index's; the
  same 344×57 banner sits in 8 documents and would want a
  cross-document asset flag (deferred); Tools/Keywords noise (`table`,
  `time`, `create`, `test plan` on every plan figure) is the standing
  vocabulary-curation item, and 223 rows sit at the Keywords 255 cap
  with rarest-first holding.
- Gates: `check_figureindex.py` **50/50** (icon kind + title, sizeless
  stays image, first-line slug incl. the table-skip / marker-strip
  case), `check_local_sweep.py` (64×64 media fixture so the figure is
  an image; the alpha picture now carries its first-line slug; icon
  row + catalog set-aside + restore; earlier-standardized-name
  convergence on reformat).

ROLLOUT: add `icon` to Kind; `--reformat --live` (names on untitled
slides change once; the move is prefix-matched) then
`--refigure --live`.

## sweep v1.59 (2026-09-05 — figure indexing + standardized figure names; figureindex v1.0, indexpages v1.3)

Owner requests: "index the figures" and "prettify and standardize the
file names". Design record: `local/Figure_Index_Plan.md`.

- **Standardized media names** (`local/lib/figureindex.mjs`
  `prettifyMedia`): every picture ZipTextExtract links is saved as
  `fig-<NN>[-slide-<KK>][-<slug>].<ext>` — NN = ordinal among the
  document's distinct source files, KK = the slide it first appears
  on, slug = the slide title (or nearest docx heading) in kebab-case
  capped at a word boundary and never ending on a stopword, `jpeg →
  jpg`, extensions lower-cased. Minted from the extracted TEXT alone,
  so the index path (bytes) and `--reformat` (files on disk, no
  re-extraction) agree: a reformat MOVES `media/<stem>/image1.png` to
  its standardized name and relinks the body (counter
  `media_renamed`; `placeLegacyMedia` also sends pre-1b
  `doc<id>_image1.png` straight to the new name); a second reformat is
  a no-op. Alt texts become `Figure N — <title>` and a slide's links
  go one per line (only the first of a shared line ever reached the
  case parser's figure counter). Names are stem-independent, so
  `--rename` is unchanged.
- **The Figures list** (`schemas/SPList_Figures.csv`, the eighth
  list; enabled by `sharePoint.lists.figures`): one row per figure of
  every indexed document, from the sidecar body below the seam
  (`extractFigures`) — Kind `image` (a pasted picture: standardized
  FileName, Format, ImageUrl + clickable ImageLink via the SPO route,
  Width/Height/Bytes from the file header on disk) or `diagram` (a
  collapsed `[figure: …]` label line: the labels are the Caption, no
  file); placement (SlideNo, Section + Anchor deep link, CaseNo when
  inside a `### TC-…` section); Context (the section's prose, capped
  by `sweep.figureIndex.contextCap`); Tools/Keywords from the curated
  vocabulary (caseindex's matchers, rarest-first). `FigureKey =
  {docRowId}|{ordinal}` replace-set identity; `diffCaseRows` grew a
  `keyField` so both lists share one planner. `sweep.figureIndex.kinds`
  `[]` = every kind (stories carry the mockups).
- **Sweep wiring**: `syncFigures` after `syncCases` at index time, on
  `--reformat` and on `--normalize-cases`; ghost pass prunes figure
  rows; **`--refigure`** backfills the corpus from disk (standalone,
  dry by default, no AI; orphans delete; live runs rebuild the
  catalog); counters `figures_upserted` / `figures_removed` /
  `figure_errors` / `figure_fields_dropped` and a **Figures** line on
  the status page; the v1.56 missing-column dropper is now a shared
  helper naming each list's schema and backfill flag; missing GUID =
  one loud note, documents index normally, `--refigure` refuses
  naming the fix. `--rename` now says to run `--refigure --live` too.
  The Figures list rides the per-run list backup. Hosted sweep gains
  the `refigure` mode.
- **`_Figure Catalog.md`** (indexpages v1.3): figures grouped by
  document, picture + section links, slide / case / size / caption.
- Gates: new `check_figureindex.py` **46/46** (CI fixture-free job —
  naming, index against the case grammar's own body, header sizing,
  rows + planner); `check_local_sweep.py` gains the figure-index,
  media-rename, refigure, figures-missing-column and figures-missing-
  GUID legs (the media assertions now expect the standardized name).

ROLLOUT (Local_Setup §14): create the Figures list (classic lookup),
paste the GUID, `--reformat --live` (renames the corpus's media — the
same pass the format-3.0 rollout needs), then `--refigure --live`
once. Queued behind auth restore (STATUS action 12) like everything
else. The standardized names take effect on every newly indexed
document from this version on, list or no list.

## sweep v1.58 (2026-09-05 — SVG figure generation removed)

The slide-diagram → SVG pipeline is gone from the project:
`scripts/SlideFigures.ts`, the sweep's `figures` step (and the
wireframe-OCR re-render loop it drove, v1.40/v1.41), `placeFigure`
in `presentation.mjs`, the `figures` / `figure_errors` /
`figures_ocr` / `figures_ocr_off` run-summary counters, the
status page's Figures column, the PAD `figures` op, the
`check_figures.py` gate with its `figure_deck.pptx` fixture, and
`docs/Diagram_Style_Framework.md`.

- **Sidecar bodies** keep ZipTextExtract's `[figure: ...]` caption
  for a diagram slide instead of replacing it with a rendered SVG;
  pictures still extract into `media/<stem>/` as before. A
  `--reformat` pass drops the `slideN.svg` links from existing
  sidecars; the SVG files already in the media folders are not
  deleted by the sweep.
- **OCR lane** (`sweep.tesseractPath`) is now the scanned-PDF lane
  only; a machine without pdftoppm gets the same "lane disabled"
  note as before, minus the wireframe clause.
- Downstream consumers of figure links are untouched: caseindex's
  `FigureCount` / `FigureLinks` / `FigureLink` still count and link
  whatever image links a case section carries, `svg2pptx.mjs` and
  `draft2pptx.mjs --media` still convert any figure SVG they are
  pointed at, and prompt v1.10's FIGURES rule still copies a story's
  image links verbatim.
- Gates: `check_local_sweep.py` loses the figure, wireframe-OCR and
  placeholder-note legs; the rename leg moves the extracted picture
  instead of a figure. `check_figures.py` is removed from CI.

## sweep v1.57 (2026-09-05 — case grammar tuned on the first full-library export)

The first `TestCases` export after the rollout (2,163 cases / 90
plans) showed where S3 over-captured and where titles collided. Read
from the export, fixed in `casegrammar.mjs`:

- **Data tables are not case tables.** A table whose description
  column is data in most rows (numbers, tuples, dates, times, route
  ids, lone tokens: `16:9`, `R21`, `(0.90,1000)`) is a fixture table
  and stays prose. 68 titles in the export were data cells.
- **A name column prefixes a data-shaped test.** `| Field | Test |
  Output |` rows whose test is a value read as `Confidence threshold:
  (0.90,1000)`; a wordy test in the same table keeps its own title
  with the field riding as a body line. `Output` / `Behaviour` now
  count as expected-result columns (the Detect-Objects plans yielded
  nothing before).
- **A Type / Classification / Category column classifies the row**
  and is not repeated in the body. 65% of the export was
  Unspecified; tables with a lane column now land in P / N.
- **Duplicate titles within a plan take a suffix** — `… (case 7)`,
  `… (A-3)`, `… (2)` — so the catalog reads distinct lines (376
  duplicates in the export).
- **Stoplist:** `Environments`, `Data to Test with`, `Setup`,
  `Prerequisites`, `Assumptions`, `In/Out of scope`, `References`
  labels (anywhere in the label) are prose, not S5 cases.
- Gate: `check_caseindex.py` 87/87 (new tuning fixture: data tables
  stay prose, Field prefix + Output column, Type column lanes,
  duplicate-title suffix, stoplist).

Rollout: `--recase --live` re-renders every plan through the tuned
grammar (S3 bodies are regenerated from the source on each recase);
the 21 plans still on `deck` need `--reformat --live` first.

## sweep v1.56 (2026-09-05 — missing Test Cases columns fail soft; heading-safe src comments)

- The first live run on the new code hit `CASE-INDEX ERROR … Field
  'SourceRef' is not recognized`: the tenant list predates the v2.0
  columns. Case-row writes now drop a column Graph does not recognise
  and retry (`case_fields_dropped`), with one note per run per column
  naming the tenant step; the next `--recase --live` after the columns
  exist fills them in through the replace-set.
- `PROFILE LINT: TC-U31: no src comment` on a plan whose table held a
  `<Null>` id: angle brackets rendered as HTML and broke the src
  comment's parse. casegrammar now writes headings with `‹›` and src
  comments without `<>` / `--`; the parser and lint read `<!-- src: … -->`
  tolerantly, and a pure draft-contract body (no src comments at all)
  is no longer a lint failure.
- Gates: `check_local_sweep.py` missing-column leg (rows written
  without the unknown columns, counted, one note each; the next recase
  fills them), `check_caseindex.py` 79/79 (a `<Null>` table id parses
  with its src).

## sweep v1.55 (2026-09-05 — `sharePoint.syncedSubfolder`)

The sweep machine's OneDrive sync roots at the library's `General`
child ("Location Referencing - General"), so every computed local
path doubled the segment and 714 of 755 sources came through the
Graph fallback instead of the disk. New optional
`sharePoint.syncedSubfolder` ("General"): stripped from local source
paths only — scope (`libraryRootSegment`) is unchanged, and the 41
documents outside `General` keep taking the download fallback.
Gate: `check_local_sweep.py` synced-subfolder leg (a reformat with
the sync rooted at General resolves locally with zero downloads).

## sweep v1.54 (2026-09-05 — `--reformat` takes the Graph download fallback)

The first `--reformat --live` on the sweep machine failed every
document with `source file not found locally`: the machine's synced
folder is the library's `General` child, so the computed local path
doubles that segment, and the nightly index has been covering it with
the v1.33 Graph download fallback (`graph_downloads`) all along —
which the reformat branch never took. It does now: a source missing
on disk downloads on demand into the run's temp dir (counter
`graph_downloads` on the reformat summary), same as the nightly path.
Gate: `check_local_sweep.py` fallback leg — a reformat with the
source moved aside re-extracts through Graph with zero errors.

## story 5 (2026-09-05 — the story/v1 profile; sweep v1.53, storyprofile v1.0, TestPlanGen local job v1.10, Sidecar_Format_Plan phase 5)

- **`local/lib/storyprofile.mjs`** (new, pure): `renderStoryBody`
  maps a User Story deck's slide titles onto canonical sections —
  `## Story` (title slide, "User Story", personas/workflow),
  `## Acceptance Criteria` ("Acceptance Criteria", "Requirements",
  "Configuration" and every untitled requirement slide before
  Testing), `## Testing`, `## Automation`, `## Documentation`,
  `## Assignment` ("Assignment", "Story Points", "Estimation"),
  `## Other content` — each source slide as `### <title> <!-- slide N -->`
  inside its section. Applied only when a deck carries ≥ 2 canonical
  titles; the corpus trial profiles **266 of 298** stories. A
  non-template deck keeps its tidied slide sections.
- sweep **v1.53**: `renderBody` routes User Story documents through
  the profile (`sweep.storyProfile: false` opts out); counter
  `stories_profiled`.
- TestPlanGen local job **v1.10**: `storyTextFirst` orders a story/v1
  sidecar's sections Story → Acceptance Criteria → Testing → … before
  the StoryCap cut, so the requirements survive truncation; non-profile
  stories are unchanged (no prompt change).

Gates: new `check_storyprofile.py` (mapping, order, provenance,
non-template pass-through, text ordering — CI), `check_local_sweep.py`
story-profile leg (a template deck indexed via `--only`: sections in
order, Story/Acceptance Criteria placement, no case rows),
`check_testplangen.py`.

ROLLOUT: the same `--reformat --live` as phases 1–3 (stories
re-render with the profile; no AI).

---

The five phases of `local/Sidecar_Format_Plan.md` are all authored on
this branch. One rollout sequence, on the sweep machine, after the
tenant columns for the Test Cases list are added (Confidence, Group,
SourceRef; Shape choices S1–S6/LLM/draft/deck):

1. `--reformat --live` — format 3.0 heads, v2.5 re-extraction, the
   case grammar on test plans, the story profile on stories.
2. `--rename-plan` → review → `--rename --live` → `--recase --live`.
3. `--case-audit --live` — read `_Case Audit.md`; then, optionally,
   `sweep.normalizeCases.enabled: true` + `--normalize-cases --live`
   in batches.
4. Paste Q&A agent instructions v1.4.

## normalize 4 (2026-09-05 — `--normalize-cases`, the opt-in LLM lane; sweep v1.52, casenormalize v1.0, CaseNormalizePromptVersion v1.0, Sidecar_Format_Plan phase 4)

**For the residue only, verified before written, never on the nightly
path.** Decided 2026-09-05 (build in phase 4):

- **`prompts/CaseNormalize_Prompt.md`** (v1.0): inputs PlanTitle +
  Body; the model returns the whole body in the `testplan/v1` grammar
  with every case heading's src comment starting `LLM`, splitting
  run-together cells into one TC per case, never inventing.
- **`local/lib/casenormalize.mjs`** (new, pure): `buildNormalizePrompt`,
  `unwrapReply` (an outer code fence and any preamble dropped),
  `verifyNormalized` — the contract lint (`lintTestPlanBody`) plus
  grounding: every TC title must be a substring of the input (or ≥ 60 %
  of its content words must occur in it), every table row and image
  link must exist verbatim in the input, the reply may not exceed twice
  the input. Any failure refuses the whole reply.
- sweep **v1.52**: standalone **`--normalize-cases`** — candidates are
  case-indexed plans whose body the detectors leave caseless
  (`extractCases` shape `none`) while `auditBody` sees a signal, minus
  bodies already carrying `<!-- src: LLM`. Dry by default (the list,
  no call). `--live` needs `sweep.normalizeCases.enabled: true` (the
  owner switch) and spends at most `maxPerRun` calls; bodies over
  `maxInputChars` (150 000) are skipped and counted (`skipped_large`);
  provider
  `anthropic` (`generateText`, `maxTokens`) or `aibuilder`
  (`llm.normalizeModelId`). A verified reply replaces the body below the
  seam (head preserved), syncs the plan's case rows (Shape `LLM`,
  Confidence `llm`), and rebuilds the catalog; a refusal is a counter +
  stderr line and the file stays. **`--reformat` keeps an LLM body**
  (`llm_kept`) — a source edit reindexes it fresh anyway.
- caseindex: `LLM` detector token; schema `Shape` gains `LLM`,
  `Confidence` gains `llm`.

Gates: `check_local_sweep.py` normalize leg (dry lists + spends
nothing; live refuses without the switch; one streamed call rewrites
the body with LLM provenance and mints LLM/llm rows; not called again;
an inventing reply is refused with the file untouched; `--reformat`
keeps an LLM body — the mock serves SSE for `generateText`).

ROLLOUT: after `--reformat --live` + `--recase --live`, run
`--normalize-cases` (dry) to read the candidate list; set
`sweep.normalizeCases.enabled: true` and run `--normalize-cases --live`
in batches of `maxPerRun`; review the LLM-shaped rows in
`_Case Catalog.md` (they are marked `LLM · llm`).

## casegrammar v1.0 / caseindex v2.0 (2026-09-05 — one case grammar, six detectors; sweep v1.51, Sidecar_Format_Plan phase 3)

**From 43 covered plans to the whole shape inventory.** The case
index read exactly two shapes — `## Case N <!-- slide N -->` (minted
only for slides with an EMPTY title placeholder) and the draft
contract — so 135 of 178 plans yielded nothing while 123 of them
carried a readable case shape (`_Case Audit.md`). Now:

- **`local/lib/casegrammar.mjs`** (new, pure): `renderTestPlanBody`
  turns a tidied plan body into the `testplan/v1` profile —
  `## Overview` (units before the first case), `## Test Cases`, and
  `## Other content` — with every case as
  `### TC-P01 — <title> <!-- src: S4 · slide 1 · Positive Tests: Normal Routes · 3 -->`
  plus `- **Group:**` / `- **Case:**` (full text when the title was
  shortened) / `- **Expected Result:**` lines and the case's own
  tables and figures. Detectors, in precedence order per unit: S2
  titled case slide (`Slide 4 — Test case 1: …`, `Slide 3 — 1. …`),
  S3 case table (`# / Test / Expected result`, xlsx case sheets — lane
  from the sheet name), S4 Positive/Negative label + list (one case
  per bullet, Group from the label), S5 other label + list (one case
  per label, bullets as numbered steps; stoplist labels stay prose),
  S1 single-numbered case slide (caseHeadings' rules a/b, now with the
  full case line as `- **Case:**`), S6 numbered case lines under a
  Positive/Negative context. Ids are per-lane sequences (P/N/U). A
  plan with no detectable case keeps its tidied sections (shape
  `none`) — nothing is guessed. `lintTestPlanBody` checks src
  comments and id sequences.
- **caseindex v2.0**: ONE parser (`tcCases`) for the grammar AND the
  draft contract; `Shape` = the detector (`S1`..`S6` / `draft`; `deck`
  for pre-3 sections until the reformat), new `Confidence`, `Group`,
  `SourceRef` columns; `Expected Result` read from the grammar's
  bullet form too; anchors slug every space to a hyphen (GitHub's
  rule — `tc-p01--loop`). Sections end at the next heading of any
  level.
- sweep **v1.51**: `renderBody` — tidyBody for every kind, the
  profile for the case-indexed kinds (`sweep.caseIndex.kinds`,
  default Test Plan); counters `plans_profiled` and
  `profile_lint_failures`; `caseHeadings` retired from the pipeline.
  `_Case Catalog.md` rows gain Group and Shape (· confidence when not
  high) columns. `svg2pptx` reads the `### TC-` heading above a figure.

Corpus trial (bodies on main, pre-v2.5 extraction): LRS Identify
coordinates plan 0 → 78 cases (S3), Relocate Events 0 → 51 (S2),
ExB Add Multiple Line Events (docx) 0 → 9 (S4/S5), Search by Route
and Station (docx) 0 → 14, Coordinates Method 0 → 16 (S2), REST
Geometry to Referent (xlsx) 0 → 55 (S3, P/N from the sheets). The S4
yield on the 62 collapsed-cell decks arrives with the v2.5
re-extraction.

TENANT STEP: add `Confidence` (Choice: high; medium; low), `Group`,
`SourceRef` (text) to the Test Cases list and extend `Shape`'s choices
(S1..S6, draft, deck); then `--reformat --live` (bodies) and
`--recase --live` (rows).

Gates: `check_caseindex.py` **78/78** (the D1 coupling now pins
`renderTestPlanBody(tidyBody(raw))`; S2–S6 legs on one deck; lane
inheritance from a Positive divider; stoplist + checklist non-cases;
row columns), `check_local_sweep.py` (grammar on the Test Plan
fixture incl. a checklist slide and a long Negative case; the story
fixture stays on tidied sections; catalog counts/columns; reformat
re-derives the grammar), `check_svg2pptx.py`, `check_testplangen.py`.

## extract 2 (2026-09-05 — ZipTextExtract v2.5 + pdf re-flow; sweep v1.50, Sidecar_Format_Plan phase 2)

**Structure the extractor used to throw away.** The review found the
biggest test-case defect UPSTREAM of any parser: `ZipTextExtract`
joined every paragraph inside a table cell with a space, so a
"Positive Tests: Gapped Routes" cell holding nine cases became one
900-character run-on (62 of 178 plans). Four extractor fixes and one
pdf fix, each with a purpose-built fixture:

- **CP-1** cell paragraphs — single-column label boxes render as
  `**label**` + one `- ` bullet per paragraph (the shape the phase-3
  case detector reads); multi-column cells join on `<br>` (decided
  2026-09-05).
- **IB-1** inherited body-placeholder bullets resolved slide → layout
  → master; `buNone` honoured.
- **TP-1** title-less slides take their topmost short text shape as
  the heading (z-order no longer puts a section label under its table).
- **DL-2** docx bold-label / ":"-label paragraphs become `### `
  headings; list items via paragraph styles too; ordered lists render
  `1. `.
- sweep **v1.50**: `unwrapPdfText` (`local/lib/util.mjs`) re-flows
  pdftotext's column-wrapped lines (sentence continues in lowercase,
  hyphen breaks; list starts, headings and blanks never join).

Gates: `check_format.py` §13 (cells_deck.pptx + labels.docx from
`make_fixtures.py`: 16 assertions), every pre-existing fixture
byte-identical, `check_typecheck.py`, `check_local_sweep.py`,
`check_figures.py`, `check_regex.py`, `render_sample.py`.

ROLLOUT: `--reformat --live` (re-extracts every body; no AI). Run it
once after phase 1's format-3.0 reformat — or let one reformat carry
both.

## naming 1b (2026-09-05 — `<issue>-<slug>.md`, media/<stem>/, `--rename`; sweep v1.49, slug v1.0, Sidecar_Format_Plan phase 1b)

**One filename convention, decided 2026-09-05: issue-number prefix on,
no doc-id token, glossary abbreviations on.**

- **`local/lib/slug.mjs`** (new, pure): `slugFor` — the H1 title with
  the kind's own words dropped (`Test Plan: X`, `X Test Plan V2`,
  `Spike: X`, `X User Story`), kebab-cased, abbreviated token-wise from
  **`local/slug_abbreviations.json`** (exb, lr, eb, dynseg, pro, gp,
  rh, apr, sld, cp, un — override/extend with `sweep.slugAbbreviations`),
  soft-capped at 60 chars on a word boundary and never on a stopword;
  falls back to the cleaned source basename (issue prefix, `_TestPlan_V2`,
  `(2) 1`, copy/final/fixed tokens stripped). `primaryIssue`: the source
  filename's own prefix, else the lowest url-sourced id, else any.
  `mintStem` (nightly: base → product → +rev → +month → numeric) and
  `mintStems` (`--rename`: a colliding group all take the first
  qualifier level that separates them — RH/APR twins become `-rh` /
  `-apr`; re-uploads get `-2`, `-3` in row-id order; deterministic).
- sweep **v1.49**: sidecars are named `<issue>-<slug>[-qualifier].md`;
  a stem is minted once and **frozen** (the row's TextFileUrl is the
  record — an AI re-title changes the H1, never the file). Media
  lands in **`media/<stem>/<asset>`** (extraction mints links against
  a placeholder folder and the bytes are written once the stem is
  known); `--reformat` relinks and moves a document's flat
  `doc<srcItemId>_*` files into its folder. **`_Manifest.json`** at the
  library root (row id → path, stem, kind, issue, title) replaces the
  `__doc<id>` suffix as the id→file lookup, rebuilt with the browse
  pages. New standalone **`--rename-plan`** (the old→new table, nothing
  touched) / **`--rename --live`** (re-mints every stem, renames the
  files, moves media, rewrites every inbound link corpus-wide, patches
  TextFileUrl, rebuilds pages + manifest, and says to run
  `--recase --live` so Test Cases anchors/figure links follow).
- consumers: `caseindex` figure links keep the media subfolder;
  `svg2pptx` resolves `media/<stem>/` → `<kind folder>/<stem>.md` (flat
  `doc{N}_` still resolves); TestPlanGen drafts are named
  `<stem>--draft-<yyyymmdd-hhmm>.md` and the auto-mode idempotency
  scan reads both that and the legacy `TestPlanDraft__doc{ID}__` form.

Gates: new `check_slug.py` (kind words, abbreviations, cap, primary
issue, incremental + batch minting incl. determinism, media links —
CI), `check_local_sweep.py` (new naming + media/<stem>/ throughout,
manifest on live runs, the rename leg: plan lists + touches nothing,
live renames + moves media + rewrites the neighbour's inbound link +
patches TextFileUrl + writes the manifest + is a no-op the second
time), `check_svg2pptx.py` stem-folder leg, `check_testplangen.py`
draft names, `check_caseindex.py`.

ROLLOUT (after the format-3.0 `--reformat --live`):
`--rename-plan` → read the table → `--rename --live` → `--recase --live`.

## format 3.0 (2026-09-05 — the metadata table replaces the yaml block; sweep v1.48, SidecarPatch v1.7, Sidecar_Format_Plan phase 1)

**One metadata representation, no code block.** The yaml block —
fenced, comment-hidden, duplicating nine of its keys in the info
table above it, regex-read by four consumers, YAML-parsed by none —
is gone. The visible info table under the H1 is the sidecar's
metadata (`local/lib/sidecarmeta.mjs`): ten rows, always present,
fixed order (Doc / Product / Release / Issues / Source / People /
Edited / Extracted / Keywords / Tools), lists joined by " · ",
`|` escaped. The machine related list moved onto the Related
region's own markers: `<!-- rel:578 s=1006.257 -->` (file = the
bullet's link target).

- sweep **v1.48**: `sidecarHead` (H1 + table) + `sidecarTail`
  (Summary, Related, seam) replace the old template. **`--reformat`
  now regenerates the head** from the Doc Index row plus the file's
  own metadata (keywords/tools original casing, revision, and the
  FIRST extraction date carried across, so a second reformat is
  byte-idempotent), preserves the Summary/Related/docs stretch from
  disk, stamps the yaml scores onto the rel markers, and drops the
  yaml block — the whole corpus converges with one
  `--reformat --live`, no AI spend, no PromptVersion bump. The
  Extracted row records `format 3.0`.
- **`local/lib/sidecarmeta.mjs`** (new): `renderMetaTable`,
  `readMeta` (every field, from the table OR the legacy yaml
  frames), `metaList`, `relEntries` (markers first, yaml line on
  unmigrated files), `migrateRelMarkers`. The rerank pass, TestPlanGen
  (`parseRelated`) and svg2pptx (case metadata line) read through it,
  so both shapes answer identically during the backfill window.
- **SidecarPatch v1.7** (`scripts/SidecarPatch.ts`, the local sweep
  runs it directly — no tenant paste): fifth frame, the TABLE frame
  (H1 + a `| **Doc** |` row, no yaml opener) — only the marker region
  is rewritten; every bullet now carries `s=` on its marker in every
  frame; merge mode reads a table-frame neighbour's entries from its
  markers. Legacy frames still parse and keep their yaml line in
  step.
- Q&A agent instructions **v1.4** authored (`agent/`), paste with the
  rollout. `flow/v2_8/definition.json`'s `Sidecar_header` is frozen at
  the v2.8 shape — the cloud flow is retired in favour of the local
  sweep and is not being updated for 3.0.

Gates: `check_local_sweep.py` (header shape + row order, reformat
byte-idempotency, the new format-3.0 migration leg: yaml frame in →
table out, keywords/tools/rev/first-date carried, scores on markers,
idempotent again), `check_related.py` (table-frame set/merge/idempotent
legs, `has_rel` tolerant of scored markers), `check_testplangen.py`
141/141 and `check_svg2pptx.py` on format-3.0 fixtures,
`check_format.py`, `check_typecheck.py`.

ROLLOUT: `node local/sweep.mjs --config local/config.json --reformat --live`
once (every sidecar rewrites — ~755 files), then paste agent v1.4.

## caseaudit v1.0 (2026-09-05 — `--case-audit`, Sidecar_Format_Plan phase 0; sweep v1.47)

**Instrument before changing the format.** The review in
`local/Sidecar_Format_Plan.md` found the case index covers 43 of the
178 test plans (463 cases) and that 123 of the 135 uncovered plans
carry a case shape the parser does not read yet. This round makes
that visible on every run instead of once in a review:

- **`local/lib/caseaudit.mjs`** (new, pure): `auditBody` counts eight
  latent-shape signals in a sidecar body — `caseTable`,
  `posNegTable`, `posNegLabel`, `titledCaseSlide`, `numberedCases`,
  `verifyBullets`, `collapsedCells`, `expectedLines` — and
  `renderAuditPage` writes them per plan.
- sweep **v1.47**: new standalone mode **`--case-audit`** — walks the
  eligible plans like `--recase`, runs the same `extractCases` plus
  `auditBody`, prints the summary JSON (`plans`, `covered`,
  `uncovered_with_signal`, `uncovered_no_signal`, per-signal plan
  counts) and on `--live` writes **`_Case Audit.md`** beside
  `_Case Catalog.md` (Uncovered plans first, signals named). No
  list writes, no AI, no Test Cases GUID needed.
- `LRSDocIndex/_Case Audit.md` committed from the corpus on main so
  the phase-3 yield has a baseline to be measured against.

Gates: `check_local_sweep.py` case-audit leg (dry writes nothing,
live writes the page, no AI, no list touch, per-plan signals in the
run log, runs without the GUID, refuses `--recase`).

## caseindex v1.4 (2026-09-05 — the primary figure becomes clickable; sweep v1.46)

**CaseIndexVersion bump — add the FigureLink column (Hyperlink),
then reflow with `--recase --live`.** The third live export showed
v1.3's links landing right (360 cases, avg 1.7 URLs, max 3), and the
owner wants them clickable. A SharePoint hyperlink column holds ONE
url, so:

- **`FigureLink`** (new column, Hyperlink): the case's PRIMARY
  figure — the first FigureLinks URL, description = its file name
  plus "(+N more)" when siblings exist; an empty write clears it
  when a case loses its figures. The full inventory stays in
  `FigureLinks`. An Image/Thumbnail column was considered and
  REJECTED: also single-image, brittle undocumented API write
  format, and SharePoint's thumbnail service renders SVG unreliably
  — every figure in this corpus is SVG.
- sweep **v1.46**: `FigureLink` joins `HYPERLINK_FIELDS`, so the
  Writer routes it through the standing SPO ValidateUpdateListItem
  path (Graph rejects hyperlink columns) on create and patch alike;
  the run-start fetch selects it. `diffCaseRows` compares hyperlink
  values by Url — a Description drift alone never dirties a row
  (it is derived from the same links).

TENANT STEP (folds into the standing one): add `FigureLink`
(Hyperlink — eleven metadata columns total), then one
`--recase --live`.

Gates: `check_caseindex.py` **68/68** (primary-link shaping incl.
"(+N more)", the figure-less clear, Url-only hyperlink diff),
`check_local_sweep.py` **237/237** (the mock Graph now also rejects
FigureLink like a real tenant; the live-leg row carries the cleared
hyperlink), `check_testplangen.py` 141/141.

## caseindex v1.3 (2026-09-05 — figure links + rarest-first tags; sweep v1.45)

**CaseIndexVersion bump — add the FigureLinks column, then reflow
with `--recase --live`.** Two changes driven by the second live
export (463 rows reflowed cleanly; 19 rows at the Keywords cap):

- **`FigureLinks`** (new column, Multiple lines of text, PLAIN): the
  absolute URLs of the figures/images rendered inside each case's
  section — sidecar-relative `../media/…` targets resolved onto the
  library's media folder (`{siteUrl}{textsFolder}/media`),
  newline-joined, deduped, capped 4000. A case's diagrams open
  straight from its list row. Collapsed `[figure: …]` label lines
  (cloud-format sidecars) count in `FigureCount` but carry no file,
  so they mint no link; without a `mediaUrlBase` the raw target
  stands (module consumers).
- **Rarest-first tag ordering**: `caseTags` now orders Tools and
  Keywords by ascending document frequency (each canonical's
  DocKeywords junction count, which the sweep already holds — the
  RelatedRank local-IDF spirit at write time), then name. The
  alphabetical join had 19 rows truncating at the 255 cap with the
  DISTINCTIVE late-alphabet tags dropped while ubiquitous terms
  ("route", 439/463 cases) survived; now the cap cuts the generic
  tail. A term's rank shifts as the corpus grows — the replace-set
  absorbs that as an occasional one-row update. Junctions still
  pointing at a pre-merge alias id undercount df until
  `curate.mjs --repoint` runs — the standing librarian posture.

TENANT STEP (folds into the v1.1/v1.2 one): add `FigureLinks`
(Multiple lines of text, PLAIN — ten columns total now), then one
`--recase --live`.

Gates: `check_caseindex.py` **64/64** (media-URL resolution, the
collapsed-label no-link rule, raw-target passthrough, newline row
shaping, df ordering), `check_local_sweep.py` **237/237**,
`check_testplangen.py` 141/141.

## caseindex v1.2 (2026-09-05 — per-case tags from the curated vocabulary; sweep v1.44, indexpages v1.2)

**Cases become searchable by tool.** CaseIndexVersion bump — add the
two columns, then reflow with `--recase --live` (folds into the v1.1
reflow if done together). Two new `SPList_TestCases.csv` columns,
filled deterministically from the corpus's own curated **Keywords
vocabulary** (no AI, no new config):

- `Tools` — canonical Kind=tool names found in the case's title,
  scenario, and unfenced body, PLUS the plan title — the plan title
  is what names "the tool being tested" when the slide itself
  doesn't, and it refreshes with every replace-set, so it never goes
  stale. `Keywords` — topic + product keywords from the same scan.
- Matching is `prepareVocab`/`caseTags` (caseindex.mjs): compiled
  once per run from the run-start Keywords snapshot (the kwSnapshot
  precedent — keywords minted THIS run reach tags on the next
  reindex/recase), word-boundary, case-insensitive, multi-word
  across any whitespace, alias rows matching under their own title
  but reporting their CANONICAL's name and kind — so every weekly
  curation merge sharpens case tags corpus-wide for free. Matches
  sort alphabetically (stable diffs); no vocabulary = empty columns,
  never a guess. Deliberately flat '; '-joined columns (the Products
  precedent), NOT DocKeywords-style junction rows — list views
  filter fine without tripling row volume.
- sweep **v1.44** builds the vocabulary and passes each plan's title
  into `syncCases`; indexpages **v1.2** adds a Tools column to the
  `_Case Catalog.md` rows.

TENANT STEP (with the v1.1 columns): add `Tools` and `Keywords`
(Single line of text, modern UI fine) to the live list — nine v1.1+
v1.2 columns total — then one `--recase --live`.

Gates: `check_caseindex.py` **59/59** (plan-title tool tagging,
word-boundary + alias folding + flexible whitespace, the
fenced-vocab trap, no-vocab empty columns), `check_local_sweep.py`
**237/237** (the live-leg row tagged from run-start vocabulary),
`check_testplangen.py` 141/141.

## caseindex v1.1 (2026-09-05 — precision + per-case metadata)

**CaseIndexVersion bump — reflow with `--recase --live` after adding
the columns.** Two changes driven by the first live backfill's export
(463 cases / 43 plans, structurally clean):

- **Issue-ref precision**: the explicit `owner/repo#n` form now
  requires a 3–5 digit issue number — the same corpus assumption
  RegexExtract's hashtag rule already encodes — and BOTH the
  issue-ref and metadata scans run on UNFENCED text only. The live
  list's single (and only) issue ref was a phantom
  `ps-location-referencing#0` minted from an Arcade stationing
  expression; neither form can produce it now. `IssueRefs` is the
  gap report's tracing join key, so precision beats recall here.
- **Per-case metadata** (seven new columns, `SPList_TestCases.csv`):
  `Shape` (deck/draft — which case grammar the plan uses),
  `FigureCount` / `TableCount` / `StepCount` (what the case carries),
  `RouteRefs` ('; '-joined distinct fixture route ids, harvested
  from prose AND table cells — the decks' route tables are where
  fixture routes live), and the draft contract's `ExpectedResult` +
  `TraceText` lines (per-case story-grounding provenance, capped
  255; empty on deck-derived cases). Parent-plan metadata (surface,
  products, release) stays one lookup away on the Doc Index row by
  design — denormalizing it would go stale. The sweep's run-start
  fetch selects the new fields so the replace-set diff stays
  churn-free.

TENANT STEP before the next nightly on this code: add the seven
columns to the live Test Cases list (modern UI is fine — none are
lookups; `Shape` choice values `deck; draft`), then
`--recase --live` once to reflow. Until the columns exist, case
writes fail LOUDLY into `case_errors` (documents still index
normally).

Gates: `check_caseindex.py` **53/53** (digit floor incl. the live
`#0` phantom, the fenced-code trap, deck/draft metadata legs, row
shaping), `check_local_sweep.py` **236/236** (the live-leg row
contract asserts the v1.1 columns).

## v1.43 (2026-09-05 — Case_Index_Plan phase 3: the case catalog)

**The case index gets its browse surface.** indexpages **v1.1** adds
`writeCaseCatalog`: one **"_Case Catalog.md"** at the sidecar-library
root — every indexed test case grouped by plan (newest plan first,
cases in plan order), per-plan Positive/Negative counts, each case
row deep-linking its sidecar section through the anchor its Test
Cases row carries, scenario and per-case issue refs alongside. The
`_Index.md` conventions apply: rebuilt by every live full sweep from
the rows the run already holds (no extra fetches, no AI),
`sweep.indexPages: false` disables it, remote-files mode uploads it
with the other pages, and the Q&A agent gains the cross-plan view
for free (the page lives in the library it grounds on). A live
`--recase` also rebuilds it, so the backfill leaves the browse
surface current; dry runs never write it. Plans with no case rows
stay off the page (they're on `_Index.md`); zero cases writes the
explicit "_None yet._" state.

Companion consumer, recorded in `testplangen/CHANGES.md` v2.29:
`--gap-report` now traces each story's issue ids against the case
rows (testplangen.mjs v1.8) — covered-by-adjacency-only stories
surface, and the smoke suite gains the case-catalog question
(`agent/QA_Smoke_Questions.md` v1.1).

Gates: `check_local_sweep.py` **235/235** (catalog contract —
grouping, counts, anchors, exclusions, recase rebuild, dry never
writes), `check_testplangen.py` **141/141**, `check_caseindex.py`
45/45.

## v1.42 (2026-09-05 — Case_Index_Plan phase 2: the sweep writes case rows)

**Individual test cases become list rows.** The caseindex parser
(below) wires into the sweep: every document whose DocKind is in
`sweep.caseIndex.kinds` (default `["Test Plan"]`) now replace-sets
its rows in the **Test Cases** list from the same rendered body its
sidecar carries — at index time, on `--reformat`, and via the new
backfill mode:

- `syncCases` — one replace-set per document (`CaseKey =
  {docRowId}|{ordinal}`, diffed via `diffCaseRows` so an unchanged
  plan writes NOTHING). A doc reclassified off the kinds list, or
  archived by ghost reconciliation, deletes its rows through the same
  path. Never throws: a case-write failure is the `case_errors`
  counter plus a stderr line, not a failed index and never the doc
  row's LastError.
- `--recase` — the backfill: walks Indexed rows of the configured
  kinds, re-parses each synced sidecar's body below the metadata
  seam, and replace-sets its rows; orphan rows (doc gone, Archived,
  reclassified, no longer Indexed) delete; eligible docs the cap or a
  missing sidecar deferred are left alone. No extraction, no AI
  spend, no sidecar writes; dry-run default plans the counts.
  Standalone mode (refuses to combine with `--rerank`/`--reformat`);
  smoke runs (`--only`) stay surgical — no cleanup.
- Enablement is the `sharePoint.lists.testCases` GUID alone
  (Local_Setup §12; the list per `schemas/SPList_TestCases.csv`,
  classic-created lookup). Without it the sweep prints one loud note
  per run and indexes documents normally; `--recase` without it
  refuses, naming the fix. The fetched rows ride the per-run gzip
  list backup like every other list.
- Counters on the full, reformat, and recase summaries —
  `cases_upserted`, `cases_removed`, `case_errors`, `plans_caseless`,
  `cases_shape_mixed` — and a status-page **Test cases** bullet when
  the run touched rows (loud on write errors). `Writer` gains
  `deleteRow` (first list-row deletion in the pipeline; dry-run
  plans it like every other write).

Gate: `check_local_sweep.py` **230/230** (was 211) — the case-index
leg (a case slide planted in the existing Alpha fixture: row
contract incl. scenario/slide/anchor, the kinds filter on beta's
case-bearing User Story, ghost-row pruning), idempotency (unchanged
corpus writes none), reformat no-churn, the recase legs (dry plans /
live rebuilds from disk / orphan deletion / zero AI), and the
missing-GUID fail-soft + `--recase` refusal legs; the sweep-level
D1 coupling now holds through the fixture the sweep itself writes.
`check_caseindex.py` 45/45 and `check_testplangen.py` 136/136
unchanged.

## caseindex v1.0 (2026-09-05 — Case_Index_Plan phases 0–1)

**Individual test cases become parseable.** The design record
`local/Case_Index_Plan.md` (committed 2026-09-04) plus its first two
phases: the schema for the seventh list
(`schemas/SPList_TestCases.csv` — Doc Index lookup, `CaseKey`
replace-set diff key, classification/scenario/skim-text/per-case
issue refs/anchor columns) and the pure parser
`local/lib/caseindex.mjs`:

- `extractCases(body, {defaultRepo, caseTextCap})` →
  `{cases, shape, mixed}` — both corpus case shapes: deck-derived
  sections exactly as `caseHeadings` emits them (numbered
  `## Case N: …`, rule-b classification-only H2s; checklist slides,
  `… test cases` dividers, bare `## Slide N` and author-titled
  sections are never cases) and the draft-style `### TC-[PN]<n>`
  contract draftlint checks. A body with neither yields zero cases
  (`shape: "none"`), never guesses; a body with both keeps the
  larger set and flags `mixed` for the future `cases_shape_mixed`
  counter.
- `caseIssueRefs` — the Doc IDs patterns scoped to one case's text
  (devtopia url / explicit `repo#n` / hashtag via `defaultRepo`,
  claimed-number suppression; the doc-level filename source
  deliberately excluded).
- `toRowFields` / `diffCaseRows` — the shared row shaping and the
  replace-set planner (create/update/delete by `CaseKey`; `SweptOn`
  alone never dirties a row, so an unchanged plan writes nothing).

Config grows `sweep.caseIndex` (`kinds`, `caseTextCap`) — inert
until phase 2 wires `syncCases`/`--recase` into the sweep and
`sharePoint.lists.testCases` names a real list (Local_Setup §12).
No sidecar format change, no `Config.PromptVersion` implication,
cloud flows untouched.

Gate: new `local/harness/check_caseindex.py` (45 checks, CI
fixture-free job) — the deck fixture's body is produced by
`caseHeadings(tidyBody(...))` ITSELF in the same run, pinning the
parser to the presentation layer's emission (the plan's D1 coupling
leg at module level; the sweep-level leg and the missing-GUID leg
land with phase 2).

## svg2pptx v1.4 (2026-09-04, with TestPlanGen v2.27)

**The figure parser/emitter become importable.** `parseFigure`,
`emitFigure`, and `EMU_PX` are exported, and the CLI body moved into
a `main()` that runs only when the file is executed directly
(`import.meta.url` vs `process.argv[1]`), so `draft2pptx.mjs` v1.1
embeds a draft's cited story figures (prompt v1.10's `**Figure:**`
lines) as the same native shape groups this converter puts on figure
slides — one figure vocabulary, one emitter, no copy. CLI behavior
and output are byte-for-byte unchanged; the review-deck side of the
change is recorded in `testplangen/CHANGES.md` v2.27.

Gate: `check_svg2pptx.py` PASS unchanged (the CLI contract is the
same code path); the import surface is exercised by
`check_draft2pptx.py`'s figure leg.

## v1.41 (2026-09-04)

**Wireframe OCR needs Tesseract alone — and going without is never
silent.** Two serviceability fixes for "where is my wireframe text":

- `detectOcrTools` no longer disables ALL OCR when `pdftoppm` is not
  runnable: pdftoppm is only the scanned-PDF lane's page renderer, so
  a machine with Tesseract but no Poppler now still transcribes
  screenshots (the PDF lane alone is disabled, with a note saying
  exactly that). An unrunnable tesseract still disables everything
  loudly. The PDF OCR rescue re-entry gates on pdftoppm too, so a
  Skipped scan can't rechurn against a missing renderer.
- Placeholder wireframes are counted and announced: the run summary
  gains `figures_ocr` (pictures transcribed this run) and
  `figures_ocr_off` (wireframes rendered with greek bars because OCR
  is not configured), and any nonzero `figures_ocr_off` prints one
  stderr note naming the fix (`sweep.tesseractPath` + `--reformat`).
  Both counters ride the reformat summary as well.

Gate: the wireframe-OCR leg now runs with pdftoppm pointing NOWHERE
(tesseract alone must transcribe, with the PDF-lane note), plus a
placeholder-note leg (no OCR configured → `figures_ocr_off` counted,
loud note). 211/211.

## v1.40 (2026-09-03)

**Wireframe OCR — screenshots keep their words** (SlideFigures v2.1 /
DF-12). A pptx's figures op now comes back naming the media entries
whose pictures rendered as wireframes with placeholder text bars
(`ocrWanted`); with the OCR lane configured (`sweep.tesseractPath`,
the v1.36 opt-in — no new config), the sweep transcribes exactly
those pictures (Tesseract TSV word boxes, `--psm 11` sparse-text
mode) and re-renders once, so the wireframes carry the screenshot's
real text instead of greek bars. Media bytes come from a minimal
central-directory read of the pptx itself (`pptxMediaEntries`) —
MediaExtract is deliberately not used here, since its 350 KB
per-image cap refuses exactly the hi-dpi screenshots OCR is for.
Best-effort at every step: no OCR tools, OCR finding nothing, or a
corrupt media entry keeps the placeholder render; an OCR crash logs
`FIGOCR` to stderr and never fails the index. `--reformat` picks the
text up for free, like every figure change. Gate: the wireframe-OCR
leg (a screenshot-only deck, a tesseract stub that answers ONLY the
TSV call, real text asserted in the written SVG, an
under-confidence word staying a bar). 206/206.

## v1.39 (2026-09-03)

**Remote-files mode — the sweep without OneDrive** (review r7 phase
4, owner-approved; `sweep.remoteFiles: true`). The last
single-machine dependency falls: `paths.sidecarLibrary` becomes a
plain local workspace — every .md in the sidecar drive MIRRORS DOWN
before ranking needs it (one Graph delta listing per run; the eTag
manifest in workDir skips unchanged files and remembers this run's
own uploads; remotely-deleted .md files prune locally), every Writer
file write/delete WRITES THROUGH the drive API (flushed per document
— an upload failure lands that doc in the Error lane; status/browse
pages ride along best-effort), and source docs download on demand
(remote mode forces the v1.33 fallback). `lib/remotefs.mjs` +
drive APIs in graph.mjs (list drives, delta, get/put/delete by
path; simple upload ≤4 MB — all corpus writes fit).
`sweep.remoteDriveName` overrides the drive lookup (default: the
textsFolder's last segment). With the flag off, nothing changes.

Ships with `.github/workflows/hosted-sweep.yml` — a nightly
GitHub-hosted run, DISABLED until the `HOSTED_SWEEP_ENABLED`
repository variable is set — and `local/Hosted_Runner.md`, which
walks the two prerequisites (app-registration auth; the org-policy
decision of tenant credentials living in GitHub secrets) and the
config secret's shape. Gate legs: empty local dirs stand in for a
hosted runner — the pre-existing remote sidecar mirrors down, the
source doc rides the Graph fallback, the new sidecar + status +
index pages upload, and a second run re-downloads nothing and
reprocesses nothing. 201/201.

## v1.38 (2026-09-03)

**Embedding-assisted relatedness** (review r7 phase 4,
owner-approved; OFF by default — `sweep.embedRelated: true` enables,
and with it off the ranking pipeline is byte-identical to v1.37).
BM25 catches shared vocabulary; embeddings catch PARAPHRASE-level
relatedness. `local/lib/embedindex.mjs` embeds each indexed sidecar's
body via any OpenAI/Voyage-compatible `/v1/embeddings` endpoint
(config `llm.embeddings: {baseUrl, apiKey, model, ...}` — Voyage AI
is Anthropic's embeddings partner; the Anthropic API itself has no
embeddings endpoint), caches vectors by content hash in
`workDir/embeddings-cache.json` (a doc embeds once per body change —
reruns and `--rerank` passes spend nothing on an unchanged corpus),
and merges cosine sims into the ranking through the SAME BodySim
channel BM25 uses: per doc `max(bm25, embed rescaled from
[embedSimMin..1] to [0..1])`, floor default 0.6. **RelatedRank.ts is
untouched** — the tenant-paste equivalence gates stay meaningful —
and any endpoint failure logs once and falls back to BM25 for the
run (an enhancement never fails an index). Data egress note: with
this on, document text leaves the tenant for the embeddings endpoint
(Local_Setup §8's decision class). Gate legs: a mock embeddings
endpoint joins a paraphrase pair no other signal can (the msg and
the onboarding guide — zero shared keywords/ids/BM25), bearer auth
asserted, zero classify calls, and a second rerank spends zero
embedding calls off the hash cache. 194/194.

## v1.37 (2026-09-03)

**The msg lane** (review r7 phase 4, owner-approved) — the last
KNOWN_EXT still parked in the Skip lane. `local/lib/msg.mjs` is a
zero-dependency CFB/OLE2 reader (v3/v4 sector sizes, FAT + DIFAT +
miniFAT chains, the directory tree walked from the root so recipient/
attachment sub-storages' identically-named streams never leak into
the body) plus the MAPI string properties a sidecar needs: subject
(0037), sender (0C1A), to/cc (0E04/0E03), body (1000), transport
headers (007D), each as PT_UNICODE or PT_STRING8; the sent time comes
from the fixed-property stream (client-submit/delivery FILETIME) with
the headers' `Date:` line as fallback. The sidecar body renders as
subject-H1 + From/To/Cc/Sent strip + message text; the message's own
sender and sent-time become the authorship trail (the OOXML
core-properties pattern). Lane `"msg"` marks the attempt — an
unreadable/empty message skips once, never rechurns — and rows
stamped Skipped before the lane existed rescue automatically (the PDF
rescue pattern). Gate legs: a generated CFB fixture (mini + regular
sector chains, attachment isolation) rescues, indexes with authorship
and the full strip, and doesn't rechurn. 189/189.

## gantt v1.1 (2026-09-03) — companion job

First real-corpus run found all 4 schedules but parsed **0 rows** —
the header detector was too narrow for the team's actual workbooks.
Two widenings, both gated by the reshaped fixture (sheet 2 now hides
its header under a 12-row banner and uses the new vocabulary, so the
standing last-write-wins assertion discriminates against v1.0):
header scan 10 → **30 rows** (real schedules stack banners/legends
above the table), and vocabulary — issue columns also match
`devtopia` / any label ending `#` ("User Story #"), title columns
also match any label containing `story`. Plus **`--inspect`**: dumps
each schedule's sheets (dimensions, first 12 non-empty rows, the
roles the detector assigned, where/whether a header was found) with
zero writes — run it whenever a schedule parses to 0 rows and read
the real header off the output instead of guessing. 202/202.

## gantt v1.0 (2026-09-03) — companion job

**Flow #2, finally** (`local/gantt.mjs` — the follow-on the README
carried since v1.9). A local on-demand job, not a cloud flow: for
every indexed **Schedule** workbook it parses each sheet as an
iteration table (header found by column names — issue/#, title, PE,
Dev, Done, "…status"/TP/Test folding into StatusSummary), then:

- **Issue Refs rows** upsert by IssueKey `{repo}#{n}` (the schema's
  dedup key): IssueTitle as the Gantt row wrote it, PE / Dev /
  IterationLabel (sheet name) / StatusSummary / DoneFlag,
  SourceDocument → the schedule's Doc Index row; last sheet/schedule
  wins, unchanged rows untouched.
- **`gantt` edges**: schedule ↔ every doc carrying one of its issues
  (Doc IDs), sorted-pair LinkKey dedup, Strength = carrier count.
- **`titlematch` edges**: an issue title naming exactly ONE indexed
  doc (all title tokens present, plural/prefix-tolerant,
  ambiguity-guarded) joins that doc to the issue's carriers and the
  schedule — docs that never cite the number enter the cluster.
  Skipped when the doc already carries the id.

RelatedRank has weighted both edge types since v2.6 — they simply
light up. Dry-run default; `--live`, `--only <schedule>`;
`gantt-*.json` run logs (newest 10). Config: add
`sharePoint.lists.issueRefs` (verify the tenant GUID first — no flow
ever referenced that list). Gate: five legs — dry plan, Issue Refs
fields incl. the last-sheet-wins update, both gantt edges, the Beta
titlematch edge, and a no-op second run. `check_local_sweep.py`
185/185.

## v1.36 (2026-09-03)

**OCR lane for image-only PDFs** (the fallback the README always
described as "designed if ever needed"; opt-in: set
`sweep.tesseractPath`, optionally `sweep.pdftoppmPath` — no PATH
auto-detection, so machines that happen to have Tesseract don't
silently change lanes). A PDF whose pdftotext pass yields no text is
usually a scan; with OCR configured the sweep renders its pages
(pdftoppm, 200dpi, first `ocrMaxPages` = 20) and reads them with
Tesseract. Lane `"ocr"` marks the ATTEMPT either way — a scan OCR
can't read stamps Skipped once and never rechurns (the pdfRescue
predicate now excludes it too) — and rows previously Skipped at lane
`"plaintext"` re-enter automatically once OCR exists, the PDF-rescue
pattern. An OCR crash degrades to the Skip lane, never Error. Gate
legs: stubbed pdftoppm+tesseract rescue and index scan.pdf at lane
"ocr" with the OCR text in TextPreview; a second run does not rechurn.

## v1.35 (2026-09-03)

**Corpus browse pages** (`local/lib/indexpages.mjs`). Every live run
rebuilds `_Index.md` at the sidecar-library root (the catalog grouped
by kind, newest first: sidecar link · products · release · one-line
summary) plus one `_Index.md` per kind folder — the Q&A agent answers
questions, these answer "what's in here?". Built from the rows the
run already holds; underscore names like `_Sweep Status.md`;
`sweep.indexPages: false` disables. Gate legs: root catalog groups by
kind and links sidecars; per-kind index uses folder-local links.

## v1.34 (2026-09-03)

**Status-page trend table.** `_Sweep Status.md` now ends with
"Recent runs" — the last 14 full-sweep summaries (run stamp,
processed, errors, figures; smoke runs tagged) read from the per-run
JSON logs — so creeping errors, dying figure counts, or shrinking
throughput are visible where the team already looks. Gate leg asserts
the table renders from the run logs.

## v1.33 (2026-09-03)

**Graph download fallback for unsynced sources** (review r7, risk R4;
opt-in `sweep.graphDownloadFallback: true`). A source file in scope
but absent from the OneDrive-synced folder used to Error for the
night ("source file not found locally") and wait on sync. With the
fallback on, the sweep fetches the file's bytes through Graph (the
list item's driveItem content) into a temp file and indexes from
there — sync lag stops costing nights. `graph_downloads` in the run
summary counts uses. Default OFF so the sync-lag Error lane (and its
gate legs) keep today's behavior on machines that prefer it. New
gate leg: unsynced doc indexes via the fallback, right item fetched.

## v1.32 (2026-09-03)

**Ops safety net** (review r7, risks R1 + R5): the pipeline can now
tell someone it is down, and the lists are no longer the only copy of
the graph.

- **List backup every run.** The run-start snapshots the sweep already
  fetches are gzipped to `workDir/list-backup-<stamp>.json.gz` (raw
  Graph items, all five lists; newest 14 kept; `sweep.exportLists:
  false` disables). The tenant has re-created the lists wholesale once
  already — a restore source now costs one file write per run. The
  run summary names the file.
- **Webhook alerts** (`config.alerts.webhookUrl`, Teams/Slack
  incoming-webhook shape, `{"$env": ...}` supported). A fatal abort
  posts "Doc Index sweep FAILED" (independent of Graph/auth — a dead
  sign-in still reaches a phone); a live full run posts the docs
  stuck 3+ nights. Delivery is best-effort (one retry, 30s timeout):
  a down webhook never fails a run.
- **Dead-man heartbeat.** Every successful live full sweep stamps
  `workDir/last-success.json`; `sweep.mjs --check-heartbeat` (schedule
  `local\run_heartbeat.cmd` as a second task, offset from the
  nightly) alerts when the stamp is older than `alerts.maxSilentHours`
  (48 default) — catching what the sweep cannot report itself: the
  task never firing, the machine off, auth dead before the fatal
  handler. Local stamp only, no sign-in needed.

Gate legs: backup exported with all five lists as raw rows + summary
names it; heartbeat stamped by live runs; fatal run posts the webhook
alert; fresh heartbeat passes `--check-heartbeat` with no alert; stale
heartbeat exits 1 and alerts. 170/170.

## v1.31 (2026-09-03)

**Module split — no behavior change.** sweep.mjs had grown to ~2,400
lines carrying five separable concerns; the pure helpers now live in
`local/lib/` and sweep.mjs (~1,360 lines) keeps only orchestration
(loadConfig/Writer/normalizeRows/sidecarHeader/extractDocText/main/
indexDoc/rankRelated):

- `lib/util.mjs` — string/date helpers, htmlToText, row normalizers,
  urlToLocal/folderToLocal, pruneRunLogs
- `lib/doclinks.mjs` — loadDocLinks, DocPageIndex, ToolLinkResolver,
  docsBlock/upsertDocsBlock, bodySeamEnd, yamlList
- `lib/presentation.mjs` — placeFigure, tidyBody, caseHeadings,
  compactWhy
- `lib/bodyindex.mjs` — the BM25 BodyIndex
- `lib/statuspage.mjs` — writeStatusPage
- `lib/config.mjs` — Node guard + config validation (v1.30)

Code moved verbatim (script-assisted extraction); the one intentional
delta is `lib/doclinks.mjs` resolving the default esri_doc_links.json
path from its parent directory. Gate: `check_local_sweep.py` 162/162
unchanged before/after.

## v1.30 (2026-09-03)

**Hardening pass** (codebase review r7, findings C1–C4): four small
failure-mode fixes, no behavior change on healthy runs.

- **Fetch timeouts everywhere.** Every Graph/SPO/Dataverse/Anthropic/
  token `fetch` now carries an `AbortSignal.timeout` (Graph/SPO 120s,
  token mints 60s, generation calls 300s — AI Builder's own gateway
  408s slower ones). A hung socket previously stalled the whole
  scheduled run past its next fire with nothing in the log; now it
  surfaces as a network error and rides the existing retry/backoff.
  Override per section with `timeoutMs` (`graph`, `spo`,
  `llm`, `llm.dataverse`).
- **Config validation** (`local/lib/config.mjs`). A config missing
  whole sections used to die with a bare TypeError deep in loadConfig;
  sweep and curate now check the required keys up front and name every
  missing one in a single message pointing at config.sample.json.
- **Node version guard.** Type stripping needs Node ≥ 22.6; an older
  Node now fails with plain instructions instead of the
  `--experimental-strip-types` flag error.
- **curate.mjs inherit fix.** The Dataverse auth inheritance dropped
  the Graph `clientId` only in `device` mode; `interactive` (the mode
  Conditional Access forced, local/CHANGES.md v1.24) now drops it too,
  matching sweep.mjs — with a `graph.clientId` override configured,
  curate would otherwise have signed into Dataverse with the Graph
  public client.

Gate: `check_local_sweep.py` grew a config-validation leg (bad config
fails fast, names `sharePoint.hostname` + `paths.sourceLibrary` in one
message, no TypeError; curate rejects the same way) — 162/162.

## svg2pptx v1.3 (2026-09-03)

**The slide carries the test case, not just its drawing.** Review
request: a figure alone doesn't state its case — the tables with the
measures and the document context live in the sidecar. The converter
already finds the sidecar (that's where document titles come from);
v1.3 reads the figure's own CASE SECTION out of it — the section whose
body holds this figure's image link — and brings along:

- **Case heading as the slide title.** `## Case 2 — Loop - Split
  measure: 20 <!-- slide 5 -->` becomes the slide title (comment
  stripped, a sibling figure keeps its "(1 of 2)" tag); the generic
  "Slide N ..." SVG title stays the fallback and still names the group.
- **The section's tables as native PowerPoint tables** below the
  figure — real `a:tbl` graphicFrames (header row bold on a muted
  tint, light grid, columns sized by content), editable like any other
  table in the deck. This figure's ANCHOR table (the one its image
  link precedes in the sidecar) comes first; a table anchored to a
  SIBLING figure stays on that sibling's slide. At most 2 tables and
  10 body rows each (an ellipsis row marks a cut, cells trimmed to 48
  chars, markdown links/bold/code stripped to text). Figure and tables
  centre together as one block; the figure scales into what the
  tables leave free. Side-by-side when two tables fit, stacked
  otherwise.
- **A metadata line in the eyebrow band**, right-aligned opposite the
  document title: doc kind · surface · products · "edited {date} by
  {editor}", read from the sidecar's yaml block.

`--no-tables` suppresses the case tables (metadata and titles stay);
no sidecar means the v1.2 slide, unchanged.

Gate: `check_svg2pptx.py` — the media-layout leg's sidecar now mirrors
the sweep's real emission (metadata comment + yaml, case heading with
the slide comment, image links before their anchor tables, a sibling
figure's table, a 14-row table, a second case section) and asserts the
case-heading title with the sibling tag, the metadata line, two
graphicFrames with the anchor first, sibling/other-section exclusion,
the row cap's ellipsis, `--no-tables`, and python-pptx reading the
tables back cell-for-cell. PASSED (91 assertions); verified visually
via LibreOffice Impress renders of the fixture library.

## svg2pptx gate sync (2026-09-03, with SlideFigures v1.9 / DF-10)

Converter unchanged — the DF-10 calm-band restyle (soft field hues,
8px bands, 10/6 dash, no casing underlay or marker outlines) resolves
from each figure's own stylesheet, through the v1.1 compound-selector
support. `check_svg2pptx.py`'s fixture is synced to the v1.9 emission
(routecase rule and its fixture line removed, soft hexes, plain
markers) and its width/hex assertions updated (8px band EMU, soft
variants bright→soft, casing assertion retired). PASSED; all 16
`check_figures.py` fixture figures convert and open in python-pptx.

## svg2pptx v1.2 (2026-09-03)

**Clean slides with titles.** Review feedback on v1.0/v1.1 output:
the figure arrived wrapped in the sidecar's white plate card (border
and all), and a slide full of shapes gave no clue which document or
slide it came from. Two changes:

- **The plate is dropped.** The plate exists to frame a figure inside
  a markdown sidecar; on a slide, the slide IS the background, so the
  card and its border are not converted — figures land directly on
  the slide surface.
- **Every slide carries a title band.** The figure's own `<title>`
  ("Slide 5 — route diagram (1 of 2)") becomes the slide title, with
  the SOURCE DOCUMENT's title as a muted eyebrow line above it, and
  the figure centres in the area below. The document title comes from
  the corpus' own naming: a media figure `doc{N}_slideK.svg` belongs
  to the sidecar `{title-slug}__doc{N}.md` in a sibling kind folder,
  so the converter looks the sidecar up (next to the SVG, one level
  up, and in the parent's kind subfolders) and takes its H1 — falling
  back to a `title:` metadata line, the sidecar's slug humanised,
  then `doc {N}`; a figure with no `doc{N}_` prefix simply gets no
  eyebrow. `--doc-title "..."` overrides the lookup for every input
  (for SVGs that never went through the sweep's naming).

Gate: `check_svg2pptx.py` — plate absent (no shape, no border colour,
only the node roundRects remain), the title band asserts as real text
boxes, the group sits below the band, and a media-layout leg proves
the sidecar-H1 lookup plus the `--doc-title` override. PASSED; all 15
current `check_figures.py` fixture figures convert, and the deck
renders with the band in LibreOffice Impress.

## svg2pptx v1.1 (2026-09-03, with SlideFigures v1.8 / DF-9)

**Compound selectors in the style resolver.** The v1.8 two-tone
stylesheet gives event bars and legend swatches a brighter hue variant
via compound rules (`.event.s-cool,.swatch.s-cool{...}`); the v1.0
parser keyed rules by a single class token and would have mis-keyed a
compound rule onto the bare class, painting graph edges bright.
`parseStyle` now splits comma groups and keeps multi-class selectors as
class SETS; `resolveStyle` applies them after the single-class rules —
the browser's more-specific-wins order. Everything else unchanged.

Gate: `check_svg2pptx.py` fixture synced to the v1.8 emission
(routecase underlay, compound bright rules, white-outlined markers)
with new assertions — the event bar resolves to the bright variant,
the freeform keeps the deep one, the white casing carries through.
PASSED; all 16 `check_figures.py` fixture figures convert and open in
python-pptx.

## v1.29 (2026-09-03)

**Case headings drop the specifics (TC-3).** The TC-1 headings put the
slide's case line — route ids, split measures and all — straight into
the H2 (`## Case 20 — Route – Changing from/ To date Split measure:
105(R2L1)`), so a reader scanning the table of contents got data, not
names. Requested shape: a heading names the case and its
classification; the specifics stay in the body. `caseHeadings` now
builds, per case slide:

```
## Case 20: Positive - Line Network – Spanning Line Event <!-- slide 23 -->

### Changing From / To Date

**Route – Changing from/ To date Split measure: 105(R2L1)**
```

- **H2** = `Case N: <classification>` — the slide's own
  Positive/Negative line, title-cased with the decks' glued dashes
  spaced out (`Positive -line network` → `Positive - Line Network`).
  An unnumbered case slide (the rule-b lane) gets the classification
  alone; a numbered case with no classification line gets a bare
  `Case N`. The promoted classification line leaves the body.
- **H3** = the scenario: the case text minus its split-measure tail,
  route ids, and a generic leading `Route –`, title-cased and cut at
  the TC-2 title budget (`Loop`, `Routes in Loop`, `Changing From /
  To Date`). Skipped when the classification already states it.
- The **full case text survives as a bold body line** whenever any
  heading dropped detail — no measure or route id is ever lost, it
  just never sits in a heading. The `current date:` tail handling and
  the `<!-- slide N -->` provenance comment are unchanged, as are the
  checklist rule (2+ numbered lines → heading stays `## Slide N`) and
  the `<name> test cases` rule.

Still deterministic, still sidecar-body-only, still idempotent under
`--reformat` (a rewritten heading no longer matches `## Slide N`).
Existing sidecars keep the TC-1 shape until the open-action-11
reformat pass — one pass now covers figures, TC-1→TC-3 headings and
DL-1 together.

Gate: `check_local_sweep.py` 158/158 — the case-slide fixtures now
assert the classification H2, the scenario H3, the bold specifics
line, both promoted lines' removal, the redundant-H3 suppression on
the long-case slide, and that no H2/H3 carries a split measure or
route id; the reformat leg asserts the same shape re-derives.

## svg2pptx gate sync (2026-09-03, with SlideFigures v1.7 / DF-8)

The converter itself is unchanged — colours, widths, dashes and caps
resolve from each figure's own `<style>` block, so the DF-8 restyle
(route as a 3px 8/5 dash drawn over 6.5px extents, 4.4-unit
arrowheads) flows through it by design. `check_svg2pptx.py`'s fixture
copy of figStyle is synced to the v1.7 emission, its body reordered to
the new z-order (extents → ticks → route), the event-width assertion
moved to 6.5px, and a new assertion pins the route's dash rhythm and
butt cap carrying onto the shape (`prstDash val="dash"`, `cap="flat"`).
All 16 `check_figures.py` fixture figures (incl. the new
labels-without-ticks slide) still convert; gate PASSED.

## svg2pptx v1.0 (2026-09-03) — companion tool

**Figures back into PowerPoint, as editable shapes.** Test plan
reviews want to pull a sweep figure into a deck and rework it there —
splitting a case, moving a measure, recolouring an extent — which an
`<img>` of the SVG cannot do. `local/svg2pptx.mjs` (standalone, Node
only, zero dependencies — the sweep machine already qualifies) takes
figure SVGs (files or a media folder) and builds one .pptx with one
figure per 16:9 slide, each a single native group of PowerPoint
shapes: move/resize it as one thing, double-click in to edit any part.

    node local/svg2pptx.mjs "<synced library>/media" -o figures.pptx
    node local/svg2pptx.mjs doc12_slide5.svg doc12_slide6.svg

It converts the CLOSED vocabulary SlideFigures emits — lines (with
triangle arrowheads for the markers), ruler ticks, butt-capped
extents, the split hairline (opacity → stroke alpha) and dot, nodes
as roundRect/ellipse/diamond with their labels INSIDE the shape (edit
in place; pre-wrapped rows stay unwrapped, overflowing centred like
the SVG), freeform paths as custGeom (quadratics lifted to cubics),
dash rhythms as prstDash, and loose texts as snug anchor-centred text
boxes. Colours, widths, dashes and fonts resolve from the figure's own
embedded `<style>` block, so a Diagram Style Framework palette change
flows through without touching the converter; the `<title>`/`<desc>`
ride along as the group's name and alt text. Anything outside the
vocabulary is reported and skipped, never guessed at.

Gate: `local/harness/check_svg2pptx.py` (CI, full-format job) — a
fixture SVG exercising the whole vocabulary, package well-formedness,
per-primitive shape/style/label assertions, and a python-pptx open
leg. Verified end to end: all 15 `check_figures.py` fixture figures
convert and the deck opens and renders in LibreOffice Impress.

## v1.28 (2026-09-03)

**Content-filter lane.** Found live during the v2.0.1 backfill
rehearsal: AI Builder's input moderation refused
`Descriptions-ModelInstructions-Dependencies.pptx` with a 400
`InputContentFiltered` — the deck quotes model-instruction-like text,
which the filter reads as prompt-injection material, and the refusal
is deterministic on the doc's own content. Under the Error lane that
doc would retry — and re-burn one AI Builder call — every night,
failing identically.

`Catch_index` now recognises an `InputContentFiltered` failure at the
`llm` step and stamps the row **`Skipped`** instead of `Error`
(the out-of-scope pattern: once, visible on the status page via
`LastError` `"content filter: ..."`, no nightly rechurn), pinning the
current `PromptVersion`/`SourceModified` so `Needs_index` stays
quiet; a filtered PDF also records `ExtractionLane: plaintext` so the
PDF rescue never rechurns it either. Like any Skipped row it
re-enters on the next promptVersion bump or a source edit — editing
the offending text out of the doc is the way to get it indexed. The
run summary's `errors` count and the status page's error lane exclude
it.

Gate: `check_local_sweep.py` 153/153 — a planted doc whose Predict
call 400s `InputContentFiltered` (the real error body) asserts the
Skipped stamp, the pinned PromptVersion, an unchanged `errors` count,
and — via the idempotency leg — that the doc never re-enters and
never re-burns an AI call; all three new assertions (plus three
count checks) fail against v1.27.

## v1.27 (2026-09-03)

**Case headings stop truncating (TC-2).** A long case line used to be
cut mid-sentence into the heading — `## Case 9 — Merge Option
disabled, coincident events that have exact attributes from measures
0-4 and <!-- slide 10 -->` — because `caseHeadings` capped the
promoted text at 90 chars wherever the cut happened to fall. The
heading now takes a **short title**: the case text up to the last
phrase break (comma, colon, semicolon or spaced dash) inside a
60-char budget, with a word-boundary fallback. When the title is
shortened, the **full case text survives as a bold subheader line**
where the case line stood, so nothing is lost:

```
## Case 9 — Merge Option disabled <!-- slide 10 -->
**Merge Option disabled, coincident events that have exact attributes
from measures 0-4 and exist in both versions**
```

A case line that fits the budget keeps the v1.25 behaviour unchanged
(whole text in the heading, promoted line removed). Applies to both
the numbered-case rule and the classification-line rule; the
"current date:" tail handling is unchanged. Idempotent under
`--reformat` like all of TC-1 (a rewritten heading no longer matches
`## Slide N`, so the section is never rescanned).

Gate: `check_local_sweep.py` 150/150 — a planted long-case slide
asserts the short heading, the bold subheader, and that no heading
ends in a truncation fragment.

## v1.26 (2026-09-03)

**Figures placed with their tables (DF-4).** `placeFigure` used to
insert every rendered figure directly after the slide heading, which on
a test-case slide stacked the input and output diagrams above the very
tables that state their numbers — a reader could no longer tell which
figure went with which table. SlideFigures v1.3 now reports, per
figure, the first row of the slide table the figure sits with
(`anchor`, as cell texts), and `placeFigure` inserts an anchored figure
directly BEFORE that table in the slide's section: the first unclaimed
table row that matches the anchor cells (unescaped, trimmed, trailing
gridSpan-padding empties dropped) and that opens its table (the line
directly above it is not a table row — a mid-table echo of the same
row never matches, and a blank line above is fine because tables
render with one). A figure with no anchor, or whose table did not
survive extraction, keeps the v1.23 after-heading placement, and the
"[figure: ...]" caption is still dropped. Renderer top-to-bottom order
is preserved throughout.

SlideFigures v1.3 also splits the redraw lane's combined figure: the
input state and the "Output" state were the one place two diagrams
still shared an SVG. They are now `slideN_fig1.svg` (before the split,
anchored to the table its measures were read from) and
`slideN_fig2.svg` (after the split, with the legend, anchored to the
result table). Because the redraw figure's name changes from
`slideN.svg` to the sibling pair, a `--reformat` pass rewrites the
links and leaves the old single-figure `.svg` files orphaned in the
media folder — harmless, but worth a cleanup pass when convenient.

Gates: `check_figures.py` (redraw pair, anchors on every lane)
PASSED; `check_local_sweep.py` 147/147 — the diagram fixture now
carries the case table and the gate proves the figure link lands
directly before it, not under the heading.

## v1.25 (2026-09-03)

**Test-case slide headings (TC-1).** The test-plan decks put one test
case per slide but almost never title the slide, so their sidecar
sections rendered as bare `## Slide 12` and a reader (or the Q&A
agent's citation) had to open each section to learn which case it
holds. A new presentation pass, `caseHeadings()`, rewrites a bare
slide heading from the case text the slide itself states:

    ## Slide 5   →   ## Case 2 — Loop – Split measure: 20 <!-- slide 5 -->

Rules, applied only to headings that are EXACTLY `## Slide N` (a slide
the author titled keeps that title; `### Notes` is never scanned):

- **One numbered line** (`2. Loop – Split measure : 20`, bullet or
  plain) is the case → `## Case 2 — …`. Two or more numbered lines
  mean the slide is a *checklist* of verifications, not a case — the
  heading stays untouched.
- **No numbered line but a Positive/Negative classification line**
  (the corpus marker of a case slide): the first short digit-bearing
  content line is the case text (`Normal route - Split measure :16`).
  Lines opening `current date` or `modify` (the decks'
  modify-this-case notes) never qualify.
- Otherwise a line shaped `<name> test cases` titles the section
  (`Conflict Prevention test cases`, `Negative test cases`).

Table rows, image/figure links and fenced code are never candidates.
The promoted line leaves the body (its text now IS the heading); a
`current date: …` tail stripped from the heading is re-emitted as its
own body line, so nothing is lost. The original slide number rides
along as an HTML comment — hidden by every renderer, like the
metadata frame — so provenance survives. Heading text is cleaned the
way slide titles already are (`|`/`#` stripped, colons normalized,
90-char cap at a word boundary).

**Deterministic by decision, not AI.** An LLM-generated header was
considered (and would help the headless checklist slides), but was
rejected on the same grounds figures are "always re-rendered, never
AI": headings must ride the no-AI-spend `--reformat` path, re-index
runs must not churn sidecar diffs nondeterministically, and per-slide
Predict calls would multiply AI spend ~25× per deck while coupling the
sidecar body to the prompt-version/backfill machinery. The slide's own
case line is the header the user asked for; a slide with no case text
keeps its honest `## Slide N`.

Like tidyBody (v1.20), this is sidecar-body-only presentation: the
LLM input, TextPreview and the similarity index keep the raw text,
ZipTextExtract stays untouched (tenant-pasted, byte-equivalence
gated), and a cloud-flow rollback simply keeps `## Slide N`.

Rollout: `sweep.mjs --reformat` (no AI spend, no PromptVersion bump) —
the same one pass open action 11 already owes the corpus for figures
covers this too.

Gate: `check_local_sweep.py` **146/146** (was 142) — the messy-deck
fixture gains a case slide and a numbered checklist slide; the live
leg asserts the exact rewritten heading (provenance comment included),
the promoted line's removal, and the checklist heading staying bare;
the reformat leg proves the headings re-derive. PAD 27/27; standing
suites green.

## v1.24 (2026-09-03)

**Interactive sign-in (`auth: "interactive"`)** — a Conditional Access
policy started rejecting the device-code sign-in with `AADSTS53003`
("your sign-in was successful but does not meet the criteria to access
this resource", `Device state: Unregistered`), which took the whole
nightly pipeline down: the refresh token expired, re-auth was refused,
and every run since failed closed with `AUTH EXPIRED`.

The block is the **flow**, not the client. A device-code sign-in
completes in a browser with no relationship to the machine running the
sweep, so it can present no device identity — a policy requiring a
compliant or joined device refuses it however the client is configured.
Proven on the affected machine: two different pre-registered public
clients (`14d82eec…` Graph CLI, `04b07795…` Azure CLI) failed
identically, while `dsregcmd /status` showed the box hybrid-joined,
`DeviceAuthStatus: SUCCESS`, with a healthy PRT.

`auth: "interactive"` runs the **authorization-code grant with PKCE over
a loopback redirect** instead. The sign-in happens in the user's own
browser on this machine, so it carries the PRT and device state and the
policy is satisfied. Entra ignores the **port** of a loopback redirect
but not the **host**: these clients register `http://localhost`, and the
`http://127.0.0.1` form is refused with `AADSTS50011` — so nothing needs
registering, but the host must be spelled `localhost`, and both loopback
stacks are bound on the chosen port because `localhost` may resolve to
either (`graph.redirectHost` overrides if a registration differs). Only the
FIRST sign-in differs: caching, silent refresh and the SPO seed-from-
Graph path are untouched, so scheduled runs behave exactly as before.
Applies to `graph` and flows to Dataverse/SPO (each keeps its own public
client, as in device mode — SPO must stay on the Graph CLI client whose
tokens carry real SharePoint permissions).

Three bugs the gate caught while building it, all of which would have
bitten a real sign-in:

- **A callback race.** The waiter promise was armed *after* opening the
  browser, so a fast redirect landed while no resolver existed and the
  flow waited for a callback that had already happened.
- **An uncleared 5-minute timer.** The `Promise.race` timeout was never
  cancelled, so after a *successful* sign-in the process sat for the
  full five minutes before exiting — once per resource.
- **A lingering keep-alive socket.** `server.close()` waits for the
  browser's open connection; the listener is now unref'd and its
  connections dropped.

`dsregcmd /status` is the prerequisite check: if the machine is genuinely
unregistered, interactive fails the same way and the app registration
(`auth: "app"`, already supported) is the only route.

Gate: `check_local_sweep.py` **135/135** (was 128) — a new interactive
leg drives the full grant against a mock authorize endpoint and asserts
the S256 PKCE challenge, a loopback redirect URI, that graph+dataverse
each sign in once while SPO still seeds silently, that the same caches
are written, and that a second run refreshes with no new sign-in. PAD
27/27.

## v1.23 (2026-09-03)

**Slide diagrams are drawn, not described.** v1.22 stopped the label
debris by collapsing it to a `[figure: 10–22 · R1 · E1]` caption; that
kept the body clean but threw the geometry away. These plans *are*
route/measure diagrams, so the sweep now renders one **SVG figure per
diagram slide**, written to the media folder and linked directly after
the slide heading.

New script **`scripts/SlideFigures.ts` v1.0** (DF-1), a new `figures`
op in the PAD runner, and `placeFigure()` in the sweep. Two sources,
one visual language:

- **Vector slides** — the drawing is real DrawingML, so it is rendered
  from its true coordinates. Nothing redrawn or inferred.
- **Raster slides** — the drawing is a pasted picture, which cannot be
  restyled and would keep whatever ticks and colours its author chose.
  Instead the route is **redrawn** from what the slide itself states:
  topology from its title (`2. Loop – Split measure : 20`), measures
  and split from its own tables. A schematic faithful to the slide's
  data, not a tracing — the alt text says so.

The style framework (`docs/Diagram_Style_Framework.md`) is one palette,
type scale and set of component rules for the whole corpus: source
colours map to slots by hue family (deterministic, so one source colour
lands on one slot in every document); structural roles come from
geometry, never colour; ticks are uniform and centred on the line;
measures sit centred above their own tick on a shared baseline; extents
get butt caps and are snapped to share one exact boundary, with a split
marker there; route ids become left row labels and event ids centre
under their bars; leaders that point at a relocated label are dropped;
one decimal convention per ruler; direction arrows on open routes; dead
vertical bands compressed; `<title>`/`<desc>` on every figure.

Two decisions worth recording. **Colour cannot decide structure**: one
deck draws a full-width navy route with black and amber events over it,
another lays four default-coloured route segments end to end under one
cyan event — so within a band the colour covering the greatest span is
the route and every other colour is an extent. And **butt caps are a
correctness fix, not polish**: round caps overshoot by half the stroke
width, so a 10→16 extent reads as 9.9→16.1.

ZipTextExtract is **untouched** — it still emits the v2.2 caption, and
the sweep replaces it with the figure. A cloud-flow rollback therefore
degrades to exactly v2.2 behaviour with no code change.

Rollout: `sweep.mjs --reformat` (no AI spend, no PromptVersion bump).

Gates: new `review/harness/check_figures.py` **PASSED** — both
production paths fire, a prose-only slide yields no figure, ticks are
uniform and centred, measures share one baseline and sit on their
ticks, adjoining extents share an exact boundary, no source colour
reaches an element, nothing is rasterised, every figure parses and
carries `<title>`/`<desc>`. Standing suites green; **PAD 27/27**;
**local sweep 128/128**; ES2017 clean. Verified end-to-end on two real
decks: **20 figures** from SplittingEventsinPro_Testplan (25 slides)
and **39** from 3921MergeEventsToolProTestPlan_V5 (44 slides), 3–12 KB
each with no embedded rasters.

## v1.22 (2026-09-03)

**Drawn diagrams stop shredding the body** — the corpus's test-plan
decks draw route diagrams as *shapes*: dashed/hatched connector lines
annotated by dozens of tiny floating text boxes holding tick numbers
and route/event ids. Every one of those flattened into its own
one-token line, so a slide's real content (its tables, its case
description) sat buried under forty lines reading `10`, `11`, `12`,
`R1`, `E1`, `Output`. On the deck that prompted the change
(`SplittingEventsinPro_Testplan.pptx`): 20 of its 25 slides carried a
drawn diagram, and collapsing them took the body from 1098 lines to
857 — 241 lines of label debris gone, short standalone lines down from
301 to 40 — with all 515 table / heading / image-link lines
byte-identical.

Now a **cluster** of label-shaped floating shapes on one slide
collapses into a single line:

```
[figure: 10–22 · R1 · E1 · Output]
```

reusing the `[figure: ...]` convention the docx drawing path has had
since v1.2. Ascending integer runs compress to `a–b`, repeats dedupe
in first-appearance order, and the list caps at 24 items. A slide with
fewer than four label shapes keeps them inline — one or two short
floating callouts are content, not a diagram.

`sweep.mjs` itself is **unchanged**; this is **ZipTextExtract v2.2**
(DL-1). Unlike v1.20's `tidyBody`, it could not live here: by the time
text reaches `tidyBody` a line reading `R1` from a diagram label is
indistinguishable from a real content line — only the slide XML still
knows which shapes are placeholders, which float, and how many cluster
together. So this one is a genuine extractor change, and it therefore
also reaches the LLM input, `TextPreview` and the body-similarity
index, not just the sidecar body. That is the intended direction: the
label debris was noise in all three, and route/event ids survive the
collapse (deduped) so relatedness keeps its signal.

Rollout: `sweep.mjs --reformat` re-extracts and rewrites bodies below
the seam with **no AI spend** (STATUS open action 10). **No
PromptVersion bump** — the metadata format is untouched, so this must
not trigger a full reindex.

Gates: new `review/harness/check_batch_v2_2.py` **PASSED** — v2.1 vs
v2.2 byte-identical on all thirteen pre-existing fixtures (no prose,
table, heading, note, code fence, link or docx path moves) with
throw-parity on the malformed archives, and a `diagram_deck` fixture
that discriminates both ways. Standing suites green (`check_format`
carries the contract as §12); **PAD 27/27**; **local sweep gate
PASSED 128/128**.

## v1.21 (2026-08-15)

**Both link sections cut down** — five related entries plus a
product-documentation table were dominating sidecars.

- **Compact relatedness evidence** (`compactWhy`): token
  enumerations collapse to counts, keyword names cap at two, and the
  `also:` tail loses its repetition —
  `similar text (0.46) · 5 title words: bit, editing, oid, +2 more ·
  3 filename words: bit, editing, tools · also: same kind, same
  surface` becomes `similar text 0.46 · 5 title words · 3 filename
  words · same kind/surface`. Applied to the ranked entries in the
  sweep before SidecarPatch renders them, so RelatedRank's contract
  and `check_related` are untouched; the yaml keeps full scores.
- **Documentation block is just the pages**: the "Mentioned" column
  is gone (page titles already say what they are) and the
  product-level overview/vocabulary links are gone (identical on
  every doc of that product — pure repetition). What remains is one
  inline `·`-separated row of the specific pages this doc's tools
  and topics resolve to, plus the single `_No page matched:_` line.
  The `products` map stays in `esri_doc_links.json` as crawl seeds.

`--reformat` doesn't rebuild these (they live above the seam) —
`--rerank` refreshes both. **Gate PASSED 2026-08-15 (128/128).**

## v1.20 (2026-08-15)

**Sidecar bodies are legible** — the extracted document text was
sprawling: a stray slide-number line under every slide heading,
blank lines between every bullet (markdown renders those as loose,
double-spaced lists), bullet text padded from the source
(`-           use existing 64bit FC`), and `### Notes` sections
holding nothing but the slide number. New `tidyBody()` fixes all
four plus collapses blank-line runs.

Deliberately **not** in `ZipTextExtract`: that script is
tenant-pasted and under byte-equivalence gates, so this lives in the
local sweep as presentation. It applies to the **sidecar body
only** — the LLM input, the `TextPreview` field and the similarity
index all keep the raw text, so classification, previews and
relatedness are provably unchanged.

**`sweep.mjs --reformat`** applies it corpus-wide with **no AI
spend**: for each Indexed doc it re-extracts the source (free,
local) and replaces only the text below the `---` seam, preserving
the header, metadata yaml, related region and docs block
byte-for-byte. The Switch_ext lane dispatch is factored into a
shared `extractDocText()` used by both indexing and reformatting,
so the lanes cannot drift.

Gate: a messy three-slide fixture reproducing every defect from the
live corpus (slide-number lines, padded/nested bullets, loose list,
notes-with-just-a-number) proves the tidy; the reformat leg
overwrites a sidecar with a stale body and proves it is rebuilt,
tidied, header preserved, and zero AI calls spent.
**Gate PASSED 2026-08-15 (125/125).**

## v1.19 (2026-08-15)

**Documentation block, readable** — the live output was 20 flat
bullets, every link labelled "documentation", several of them
arbitrary. Five changes:

- **Real page titles as link text.** `doc_crawl` v1.2 captures each
  page's `<title>` (minus the site suffix) into the inventory as
  `{url, title}` entries; the sidecar renders
  `[Storing referent and offset information for event location](…)`
  instead of `[documentation](…)`. Bare-URL inventories still work,
  falling back to a slug-derived title with acronym casing
  (`create-and-modify-an-lrs-network` → "Create and modify an LRS
  network").
- **A table, not a bullet wall.** Product links stay as short lines;
  matched tools/topics render as a two-column
  `| Mentioned | Documentation |` table.
- **One collapsed search line.** Unmatched tools no longer get a
  line each — they join a single `_No doc page matched — search:_`
  line (capped at 12 + `+N`), sorted last so real links lead.
- **Ambiguity guard.** When several DIFFERENT pages tie for best
  match, nothing is linked: "route" matched extend-a-route /
  rename-a-route / retire-routes equally, and picking one was noise.
  A tie between the same slug in two product trees is resolved by
  the doc's product order, not dropped.
- **Full-coverage matching for tools too** (was 0.6): "Add Point
  Events" was matching "Add calibration points" on 2 of 3 tokens.
  Tools still fall through to probe → search.
- Rerank now reads the sidecar's own `tools:`/`keywords:` yaml for
  labels, so names keep their original casing ("Create LRS Network
  from existing dataset", not the lowercased junction title).

Section heading renamed `## Product documentation` →
`## Esri documentation` (it covers tools and topics now).
**Gate PASSED 2026-08-15 (115/115).**

## v1.18.1 (2026-08-15)

Dedupe fix, found live: several keywords legitimately resolve to the
same page ("offset" / "location offset" / "referent" all describe
`storing-referent-and-offset-information-for-event-location`), and
the block rendered a line per keyword — the same link three times.
Now **one line per page**: labels merge (most specific first, capped
at 3 with a `+N` tail), a tool/topic whose page is already covered
by a product link is dropped entirely, and search-fallback lines
sort last so known links lead. Gate: the live case reproduced as a
fixture — two keywords, one page, merged labels — plus a
no-duplicate-URLs-anywhere assertion over the whole block.
**Gate PASSED 2026-08-15 (112/112).**

## v1.18 (2026-08-15)

**Inventory matching** — tool/topic links now resolve against the
141 REAL pages `doc_crawl` found, not a guessed slug. New
`DocPageIndex` (reads `workDir/esri_doc_pages.json`, override
`sweep.docPagesFile`) tokenizes every page slug and scores a
tool/topic name against it: plural-insensitive, prefix-tolerant
(`realign` ~ `realignment`), ranked by token coverage + Jaccard,
with a decisive boost for the section matching the doc's product —
the same slug exists in BOTH the R&H and Pipeline trees, and a
Pipeline doc must link the Pipeline copy.

Resolution order per tool: curated map → **inventory match** (≥60%
of the name's tokens covered) → cached probe → probe → search
fallback. **Topic keywords now get links too** — inventory-only,
and only on a total match (every name token covered), with no
search fallback, since a weak topic link is noise.

Gate: fixture inventory — a tool resolved by inventory match with
no probe fired; a topic keyword linked; the probe path still
exercised for a tool absent from the inventory.
**Gate PASSED 2026-08-15 (110/110).**

## v1.17.1 (2026-08-15)

doc_crawl v1.1 — the first live run found 0 pages with no clue why.
Now diagnosable and resilient: sitemap discovery via robots.txt
`Sitemap:` directives + candidate sitemap.xml at every ancestor path
of the section (not just the origin root), each attempt printing its
HTTP status; the BFS seeds from every known page under the section
in esri_doc_links.json (the section root often 404s — no directory
index — which silently emptied the v1.0 crawl); a browser-like
default User-Agent (CDNs 403 obvious bots; `--ua` overrides); and a
JS-rendered-site warning when a 200 page yields zero same-section
links. Gate re-PASSED unchanged (108/108).

## v1.17 (2026-08-15)

**`local/doc_crawl.mjs`** — enumerate the REAL page inventory of the
Esri help sections (probing guessed one slug per tool; matching
should work from what actually exists). Per section — defaults to
the folders behind `probeTemplates`, override with repeated
`--section`: the site's sitemap(s) first (`sitemap.xml` /
`sitemap_index.xml`, child sitemaps followed), and a polite BFS
crawl (same-section `.html` links, ~6 req/s, page cap, honest UA)
only when the sitemap yields nothing for the section. URLs print to
stdout and the inventory saves to `work/esri_doc_pages.json` for the
upcoming topic→page matching step. Gate: mock sitemap section and
mock crawl-only section both enumerated, out-of-section links
excluded. **Gate PASSED 2026-08-15 (108/108).**

## v1.16 (2026-08-15)

**Probed tool links** — the owner's first real search-link
("realign" → a Google page) showed the fallback should try harder.
New `ToolLinkResolver`: for a detected tool with no curated entry,
candidate URLs are built from the JSON's new `probeTemplates`
(`{slug}` = kebab-cased tool name; product-matched folders tried
first — the doc.esri.com scheme the owner's URLs demonstrated) and
FETCHED from the sweep machine; the first HTTP 200 becomes a direct
link. Hits and definitive all-404 misses cache in
`workDir/doc-links-cache.json` — each tool costs at most one probe
round ever (misses re-probe after 30 days; network errors are never
cached). Resolution order per tool: curated map → cache → probe →
searchTemplate fallback. No API keys, no scraping — just testing
the documented URL scheme. `sweep.probeDocLinks: false` disables.

Gate: mock probe endpoint — existing page → direct link in the
sidecar; missing page → search fallback; cache file written; across
dry + live + rerank runs each slug probed exactly once. The gate's
doc-links file points probing at the mock, never the real site.
**Gate PASSED 2026-08-15 (104/104).**

## v1.15 (2026-08-15)

**Tool-level documentation links** (owner request: a user story
about the Add Point Events tool should link that tool's docs).
Layered design in the same sidecar block and the same editable
`local/esri_doc_links.json`:

- **Curated direct links**: new `tools` map (tool name →
  URL, case-insensitive) renders `- **Reassign Routes** —
  [documentation](…)`. Seeded with the owner-verified doc.esri.com
  URL scheme; upgrade any tool by adding one JSON line.
- **Templated search fallback**: tools NOT in the map render
  `[search Esri docs]` via `searchTemplate` (`{q}` = the encoded
  tool name; default a doc.esri.com-scoped web search) — complete
  coverage with zero authoring, never a 404.
- Detection: the LLM's `tools` output at index time; the doc's
  `Kind: tool` keywords (alias-folded) at `--rerank` time — the two
  converge because tools are minted as tool-kind keywords.
- `products` map re-seeded with the owner-supplied doc.esri.com
  pages (essential vocabulary, LRS data model/products, event
  behavior; pipeline vocabulary + web-layer sharing). Legacy flat
  JSON shape still parses.

Gate: curated tool → direct link; unmapped tool → encoded search
link; rerank rebuilds both from junctions alone; still exactly one
block after re-passes. **Gate PASSED 2026-08-15 (101/101).**

## v1.14 (2026-08-15)

**Product-documentation links in sidecars.** Docs whose `Products`
field names Roads & Highways / Pipeline Referencing / Utility
Network (RegexExtract's canonical detection) get a
`## Product documentation` section — official Esri doc links per
product — inserted after the related region inside
`<!-- docs:begin/end -->` markers. The links live in the **editable**
`local/esri_doc_links.json` (override: `sweep.docLinksFile`), keyed
by the exact canonical product names: editing the file + the
self-updating git pull is the whole deploy; removing an entry (or
the file) removes the block from sidecars on their next write.
Written on fresh indexes AND upserted corpus-wide by `--rerank`
(idempotent — replace-in-place). ⚠ The seed URLs were authored
offline (Esri domains unreachable from the build sandbox) — verify
them in a browser and correct the JSON as needed.

Gate: product detected end-to-end from fixture text ("Roads and
Highways" → row `Products` → sidecar block with the overview URL);
rerank leg proves exactly one block after re-passes.
**Gate PASSED 2026-08-15 (98/98).**

## v1.13 (2026-08-15)

**`sweep.mjs --rerank`** — rebuild every Indexed doc's Related
Documents section in one pass from persisted state: row metadata,
junction/edge lists, and the on-disk sidecar bodies. **No extraction,
no AI calls, no row writes** — pure local compute + sidecar file
patches (reciprocal neighbor merges included), so a full-corpus pass
costs nothing but minutes. The related pipeline (flow §5 +
body-sim) is extracted into `rankRelated()`, shared verbatim by
indexDoc and the rerank driver. Uncapped by default (`--max` caps it
explicitly; `--only` narrows it; `--dry-run` plans it). Intended
use: right after a keyword-curation drain, to propagate merges
corpus-wide immediately instead of over months of lazy reindexes —
and it back-fills body-sim/filename/folder relateds (v1.9) into
every sidecar written before those signals existed.

Gate: rerank leg — full pass over the corpus fixture proves per-doc
coverage, zero AI calls, keyword/id and body-sim relateds intact,
and non-Indexed docs' sidecars untouched.
**Gate PASSED 2026-08-15 (95/95).**

## v1.12.1 (2026-08-15)

Timeout fix, found on the first live drain: AI Builder's gateway
408s once the vocabulary+reply combination gets big enough (the
1880-line vocabulary with the v1.1 50-proposal cap crossed it). Two
changes: 408 joins 429/5xx as a retryable status in
`aiBuilderPredict` (transient under load), and the vocabulary is now
sent in **alphabetical chunks** (`curation.vocabChunk`, default 700
lines) — one Predict call per chunk, per-chunk proposal cap,
proposals concatenated, hallucination guard still validating against
the FULL row set. Alphabetical ordering keeps the main variant
classes (plural/typo/hyphen/concatenation) adjacent within one
chunk; abbreviation-vs-expansion pairs far apart alphabetically are
the accepted miss (documented). Deviation from the flow's
one-giant-call shape — which is exactly what was timing out. Gate:
chunk leg proves one call per chunk. **PASSED 2026-08-15 (90/90).**

## v1.12 (2026-08-15)

**Backlog draining** for curation. The owner asked for a 500-proposal
cap; a single reply that size would blow the model's output budget
and truncate to zero parsed proposals, so the same end is reached in
batches: curation prompt **v1.1** raises the per-reply cap 20 → 50
(re-paste required — the instruction lives in the tenant prompt
text, not config), and new `curate.mjs --drain` repeats full passes
(each re-fetching the shrunken vocabulary) until a pass writes
nothing, hard-capped at 20 passes. Termination is structural: every
written proposal removes its alias from future eligibility (merged
in autoApprove mode, CurationStatus-blocked in manual). Gate: static
mock proposals — pass 1 merges, pass 2 finds the alias merged and
stops. **Gate PASSED 2026-08-15 (89/89).**

## v1.11.1 (2026-08-15)

`curation.autoApprove` (default **false** — the flow's
propose-then-approve contract stays the default). When true:
guard-passing merges apply immediately (the job sets CanonicalRef —
the one thing the cloud flow deliberately never did, now an explicit
owner opt-in), pending proposals left over from manual-mode weeks
are applied too (canonical resolved from the ProposedCanonical
prefix; unresolvable ones stay pending), the digest becomes an
audit log with undo instructions (clear CanonicalRef + set
CurationStatus Rejected, which blocks re-proposal via the existing
DoNotPropose mechanism), and the summary line gains `merged=`.
Gate: week-3 auto-approve leg — fresh proposal and manual-era
pending row both merged, digest audit format.
**Gate PASSED 2026-08-15 (88/88).**

## v1.11 (2026-08-15)

**Keyword curation goes local** (`local/curate.mjs`) — the LAST Power
Automate piece of the pipeline. Mirrors the KeywordCuration cloud
flow v1.1 action-for-action from `curation/flow/v1_1/definition.json`:
approved-row cleanup, vocabulary/blocked composition, one call to the
tenant's own "LRS Keyword Curation" AI Builder prompt
(`llm.curationModelId` — discover it with `curate.mjs --models`),
brace-slice parse, the verbatim hallucination guard, proposal writes,
the pending-carryover digest overwritten at a fixed name in Shared
Documents (via new `GraphClient.putFile` drive upload — that library
isn't synced, and the digest deliberately lives outside the Q&A
agent's reach), DX-11 empty-queue overwrite, and the Cur_summary
line. Never writes CanonicalRef — the propose-then-approve contract
is unchanged. Reuses the sweep's config, sign-ins and auth
(`aiBuilderPredict` generalized in llm.mjs); `--dry-run` plans
without writing; scheduling via `local/run_curate.cmd` +
`local/curation_task.xml` (Saturday 08:00, catch-up + battery
settings). One documented deviation: malformed model JSON degrades
to zero proposals with a log note instead of failing the run.
Deploy + handover: guide §9 (turn the KeywordCuration cloud flow OFF
after the smoke — never both live).

Gate: full two-week cycle against the mock — propose (incl. a
blocked and a hallucinated alias, both dropped), digest contents,
librarian approval, cleanup, DX-11 empty digest; dry-run leg writes
nothing. **Gate PASSED 2026-08-15 (86/86).**

## v1.10 (2026-08-15)

Quick-wins batch:

- **Oversize cap 3.5 MB → 50 MB** (`sweep.oversizeBytes`). The old
  cap was a Power Automate/Office Scripts payload limit; locally it's
  only a memory/time guard. Big decks — often the richest docs — now
  index instead of skipping; previously-stamped oversize Skips
  reprocess as the backfill/modification triggers reach them. LLM
  input stays bounded by `textCap` regardless of file size.
- **HTML lane** — the `htmltotext` ExtractionLane the schema always
  reserved but no flow version implemented: `.html`/`.htm` files are
  read locally, tags/scripts/styles stripped and entities decoded
  (zero-dependency), and run the full pipeline.
- **Error-streak counter** — the status page's Error-lane table gains
  a "Nights stuck" column (consecutive full runs in the lane,
  persisted in `work/error-streaks.json`); the action line calls out
  docs stuck 3+ nights. Smoke (`--only`) runs display but don't
  advance streaks, since they don't retry the lane.

Gate: guide.html fixture (script/style/entity content) proven
Indexed with lane `htmltotext`, tags stripped and `&amp;` decoded in
TextPreview; streak proven advancing to 2 on the idempotency leg's
full rerun. **Gate PASSED 2026-08-15 (74/74).**

## v1.9 (2026-08-15)

**Relatedness upgrade** (improvement plan follow-on): three new
signals, all local and free — no AI spend, no dependencies, no
tenant changes. Rollout is gradual and cheap: each doc's related
list refreshes on its next reindex (+ reciprocal neighbor patches).

- **Body-text similarity** — new `BodyIndex` in sweep.mjs: a
  BM25-weighted cosine over the sidecar corpus (bodies below the
  header seam), built once per run from disk and upserted with each
  doc's fresh text as the run proceeds. Docs above
  `sweep.relatedBodySimMin` (default 0.15) join the candidate
  universe even with NO shared keyword/edge — the fix for docs about
  the same subject whose LLM keywords never matched — and every
  candidate carries `BodySim` into the final ranking.
- **Filename-family affinity** — camelCase-split filename tokens
  (`ComplexRouteShapesEventBehaviorRealign` → complex route shapes
  event behavior realign) score shared distinctive tokens, clustering
  the corpus's doc series.
- **Folder affinity** — same-folder candidates get a small bonus.

Implemented as **RelatedRank v2.2** with the r4 dormant-field
pattern: `BodySim`/`Folder` on candidate rows and `filename`/`folder`
in selfMeta activate the terms; flow-shaped input (the tenant-pasted
v2.1's wiring) produces byte-identical output — `check_related`
standing suite PASSED unchanged, no tenant paste needed, rollback
unaffected. Weights live in `RelatedWeights` config (`body.weight` 3,
`fname` 0.5×cap 6, `folder` 0.5), all inside the softCap bucket, so
id-link dominance still holds. Similarity is cosine (symmetric) —
the reciprocal-merge score contract survives.

Gate: spec.pdf's body shares calibration vocabulary with notes.txt
while sharing zero keywords — the live leg proves they relate through
the body-sim source alone, with "similar text (…)" in the why prose.
**Gate PASSED 2026-08-15 (71/71)**; PAD 27/27; `check_related` PASS.

## v1.8.1 (2026-08-15)

Rescue-gating fixes, found when the tenant's PDF rescue hit docs
living outside the synced `General` folder:

- **Out-of-scope PDFs looped through the PDF rescue nightly** (their
  Skip stamp keeps `ExtractionLane` ≠ "plaintext"), re-stamping the
  same rows every run and eating slots in the 150-doc cap. Both
  rescues now gate on `inScope` — an unreachable doc is stamped
  once, period.
- **Scope rescue**: the `"out of sync scope"` stamp now doubles as a
  rescue marker. After the OneDrive sync is widened (guide §6), every
  stamped doc re-indexes automatically on the first run where its
  file is reachable — no promptVersion bump, no corpus-wide AI
  respend, no touching files.

Gate: the widening is now simulated faithfully (server paths and
DocKeys unchanged; only the local root and `libraryRootSegment`
grow, exactly as the guide prescribes — fixtures restructured under
`Shared Documents/General` to match the real tenant): out-of-scope
txt AND pdf are stamped once, NOT reprocessed on the idempotency
leg, then both re-index by themselves after the widening.
**Gate PASSED 2026-08-15 (70/70).**

## v1.8 (2026-08-15)

**Ghost reconciliation** (improvement plan #9). After each full run
the sweep compares every Doc Index row's DocKey against the actual
library listing; rows whose source doc was deleted are set
`IndexStatus: Archived` with a dated LastError note, their sidecar
is pruned (dry-run-aware), they leave the relatedness candidate pool
(no more "related" links to dead docs), and their error-lane entry
clears. A doc restored from the recycle bin re-enters `Needs_index`
via the new Archived trigger and re-indexes automatically.

Safety rails, in order: reconciliation is skipped on `--only` smoke
runs and whenever the library listing comes back empty (a throttled
listing must never archive the world); archives are capped at
`sweep.maxArchivesPerRun` (default 20) per run with a log note when
more remain. **One-time tenant step**: add `Archived` to the Doc
Index `IndexStatus` choice values — until then the sweep halts
archiving with a log note naming the fix and runs normally
otherwise (`schemas/SPList_DocIndex.csv` updated).

Gate: seeded ghost row (Indexed, no matching file, stale sidecar on
disk) — dry leg proves the archive is planned but not executed;
live leg proves Archived + dated note + sidecar pruned + status-page
callout; idempotency leg proves archived rows are not re-archived.
**Gate PASSED 2026-08-15 (67/67).**

## v1.7 (2026-08-14)

**PDFs are indexed** (improvement plan #8; owner opted for the
pdftotext route to keep the repo zero-npm-dependency). New `pdf`
extraction branch shells out to Poppler's `pdftotext -layout -enc
UTF-8` (`sweep.pdftotextPath` or PATH); text-bearing PDFs run the
full pipeline (`ExtractionLane: plaintext` — an existing whitelist
value, no schema risk), scanned/no-text PDFs land in the Skip lane
with that lane recorded as the "attempted" stamp so they never
rechurn. **PDF rescue**: rows stamped `Skipped` at the current
PromptVersion by the flow or the pre-v1.7 sweep re-enter
`Needs_index` exactly once when the tool is present — the corpus's
PDF backlog indexes without a promptVersion bump (no full-corpus AI
respend). No tool installed = flow-era behavior (Skip lane) with a
log note. Also fixes `normalizeRows` dropping `LastError`/
`ExtractionLane` from snapshots (the v1.5 status page's error lane
was seeded empty because of it).

Gate: stub `pdftotext` (text for spec.pdf, empty for scan.pdf);
spec.pdf pre-seeded as `Skipped v2.0/lane none` — exactly the
post-backfill tenant state — and proven rescued→Indexed with a
sidecar; scan.pdf proven Skipped-with-stamp and NOT reprocessed on
the idempotency leg; no-tool leg proves graceful flow-era skip +
log note. **Gate PASSED 2026-08-14 (63/63).**

## v1.6 (2026-08-14)

**Out-of-scope lane** (improvement plan #7, the cheap floor). The
dry-run calibration showed ~102 tenant rows whose source files sit
outside the synced `libraryRootSegment`; when the v2.0 backfill
reached them they would each have become a *nightly* Error-lane
churn ("source file not found locally"). Now:

- A doc **structurally outside** the synced root gets a single
  STAMPED `Skipped` row (`LastError: "out of sync scope: ..."`), so
  it never rechurns; it re-enters `Needs_index` when modified or on
  a promptVersion bump after the sync scope grows. New
  `out_of_scope` summary counter + status-page callout with the
  remedy.
- A doc **in scope but missing on disk** stays a retryable Error,
  reworded to say what it almost always is (OneDrive sync lag) —
  clears itself when the file lands.

The full fix (actually indexing those docs) is syncing more of the
source library — a machine/disk decision, not a code change; the
lane makes the gap visible and quantified instead of noisy. Gate:
two new fixtures (`outside.docx` structurally out of scope,
`missing.txt` in scope but absent) + lane assertions on the live,
idempotency (the stamped Skip is NOT reprocessed) and status-page
checks. **Gate PASSED 2026-08-14 (59/59).**

## v1.5 (2026-08-14)

Unattended-operation hardening, the first post-handover batch:

- **Self-updating runs** — `run_sweep.cmd` does `git pull --ff-only`
  before each sweep (merged fixes deploy themselves; a conflicted
  state can't wedge the machine, it just runs what's checked out).
- **Missed-schedule catch-up** — new repo-tracked
  `local/sweep_task.xml` (register with `schtasks /create /xml`):
  StartWhenAvailable (machine off at 17:00 → run fires on wake
  instead of skipping the night) + laptop battery settings, which
  plain `schtasks /create` cannot express.
- **Fail-fast on dead auth** — a non-interactive run that would need
  a device-code sign-in now throws `AUTH EXPIRED` immediately (with
  the exact recovery command) instead of waiting 15 minutes for a
  prompt nobody will answer. `DOCINDEX_ALLOW_DEVICE_PROMPT=1`
  overrides (harness; redirected consoles).
- **Status page in SharePoint** — after every live run (and on fatal
  aborts) the sweep writes `_Sweep Status.md` to the sidecar library
  root: last run, result, prompt version, the Error-lane table with
  per-doc LastError, and an "action needed" line. Pipeline health is
  now visible where the team already reads the index.
- **Log hygiene** — per-run `sweep-*.json` logs pruned to the newest
  30; `sweep-task.log` rotates at ~5 MB (one previous generation).

Gate: +8 checks — status page contents on the live leg, prune-to-30
with fodder logs, and a dead-auth leg (fails fast, AUTH EXPIRED on
stderr, no device prompt started, fatal surfaced on the status
page). **Gate PASSED 2026-08-14 (55/55).**

## v1.4.3 (2026-08-14)

**SPO 401 resolved** — the v1.4.2 token matrix (run in-tenant) showed
why every SharePoint write failed: the Azure CLI client's SharePoint
grant carries only `scp=user_impersonation`, which SP REST rejects
(401 invalid_request) even for a plain GET, and the v2 named scopes
(`AllSites.Write`) are blocked outright for first-party clients
(AADSTS65002 preauthorization). The **Graph CLI public client + v1
resource form** was the sole winner: its token's scp carries real
SharePoint permissions (Sites.ReadWrite.All / AllSites family) and
both `GET /_api/web` and the `ValidateUpdateListItem` hyperlink write
succeeded. `SpoClient` device mode now defaults to the Graph CLI
client — and since that's the same client as the Graph sign-in, the
SPO token is **seeded from `auth/graph.json`'s refresh token** (Entra
refresh tokens are client-bound, not resource-bound): the third
sign-in prompt is gone entirely. `DelegatedAuth` gains
`seedCachePath` + a `client_id` cache marker (a cache written by a
different client is never refreshed against, it's re-seeded instead —
this self-heals the stale Azure CLI `spo.json` on the deployed
machine). Gate: device leg now asserts exactly two prompts
(graph+dataverse), SPO seeded via refresh grant, and the seeded token
on the SPO write. **Gate PASSED 2026-08-14 (47/47).**

## v1.4.2 (2026-08-14)

Diagnostic release for the live-walkthrough SPO 401: even a fresh v1
`resource=` device grant comes back with the generic SPO app-GUID
audience and only `user_impersonation` in `scp`, and SharePoint still
rejects it. `probe.mjs --spo` is now a **token matrix**: it redeems
the already-cached refresh tokens (Entra refresh tokens are
client-bound, not resource-bound — zero new sign-in prompts) for
every candidate token shape (v1 resource with/without trailing slash,
v2 named scopes `AllSites.Write` / `AllSites.FullControl` /
`.default`, Azure CLI and Graph CLI public clients) and for each one
prints the decoded claims, a plain `GET /_api/web` check (separates
"token rejected" from "this endpoint rejected"), and the hyperlink
write — including the `WWW-Authenticate` header on 401, where
SharePoint states the actual reason. Ends with a WINNERS line; the
winning shape gets wired into `SpoClient` next. New
`redeemRefreshToken()` export in auth.mjs (cache-untouched, additive).

## v1.4 (2026-08-14)

Live-run fix: **Graph cannot write hyperlink columns** — the probe
(`local/probe.mjs`, added during the live walkthrough) showed every
write shape for `SourceLink`/`TextFileUrl` rejected with 400
invalidRequest while all other fields pass. New `SpoClient`
(graph.mjs) routes exactly those two fields through SharePoint REST
`ValidateUpdateListItem` (hyperlinks as "url, description"; per-field
ErrorMessage checked — the endpoint 200s even on failure), which is
the same API the cloud flow's connector uses. The write layer splits
fields automatically; SPO auth follows the same device/app modes
(device default: the Azure CLI public client, pre-consented against
SharePoint — a third first-run sign-in, cached as `auth/spo.json`).
Also v1.3.1 (Predict `source` telemetry — AI Builder rejects without
it) folded in. Gate: the mock Graph now rejects hyperlink fields
like the real service and the SPO endpoint is mocked, so the live
leg proves the split path; device leg asserts all three resources
sign in and refresh. **Gate PASSED 2026-08-14 (46/46).**

## v1.3 (2026-08-14)

**No Azure app registration required.** New `local/auth.mjs`
implements the OAuth device-code grant against Entra using
Microsoft's own pre-registered public clients (the Graph CLI app for
Graph, Microsoft's public Dataverse sample client for AI Builder) —
`graph.auth: "device"` is now the default. First run prints two
device-code sign-ins (Graph, Dataverse); refresh tokens are cached
per resource under `paths.workDir/auth/` (0600) and later runs —
scheduled ones included — refresh silently. Everything runs as the
signed-in user with their existing SharePoint/Dataverse permissions,
which is the cloud flow's own connection identity model (rows show
your name as Created/Modified By, as today). Consent-restricted
tenants can point `clientId` at any allowed public client (e.g. the
Azure CLI). The client-credentials app-registration path from v1.0
remains as `"auth": "app"` for a future service-account setup.

Gate: new device-auth leg — mock devicecode/token endpoints, both
resources sign in, writes carry the delegated token, refresh-token
caches written, second run refreshes silently with no new prompt.
**Gate PASSED 2026-08-14 (45/45).**

## v1.2 (2026-08-14)

The AI step goes back to **the cloud flow's own model**: provider
`aibuilder` (now the default) invokes the same AI Builder custom
prompt the flow's Run_prompt action calls — directly via the
Dataverse Web API Predict action
(`msdyn_aimodels({modelId})/Microsoft.Dynamics.CRM.Predict`), with
the flow's three `requestv2` inputs, its response read
(`responsev2.predictionOutput.text`), and its lax parsing
(coalesce → brace-slice → parse). Same model, same tenant-hosted
prompt text, same AI Builder credit metering — zero behavior drift
in the AI step, and prompt promotion stays the AI Builder paste.
Auth reuses the Graph Entra app (client credentials against
`{environmentUrl}/.default`; register it as an application user in
the Power Platform environment — guide §3). No Power Automate
license involved.

The v1.1 `anthropic` provider (Claude-account OAuth / apiKey,
executing `prompts/DocIndex_Prompt.md` with schema-pinned output)
remains as an explicit opt-in for a future move off Power Platform;
switching providers changes the classifying model — treat it as a
PromptVersion-bumped backfill event.

Gate: main legs run against a mock Dataverse Predict endpoint whose
output is wrapped in prose + code fences (proving the brace-slice),
with wire-shape assertions (bearer token, `version: "2.0"`,
`requestv2` keys); the anthropic apiKey/oauth legs stay as targeted
single-doc runs. **Gate PASSED 2026-08-14 (39/39).**

## v1.1 (2026-08-14)

LLM auth without an API key. `llm.mjs` gains `llm.auth: "oauth"`
(now the default): a one-time `ant auth login` on the machine stores
a Claude-account OAuth profile, and the sweep mints short-lived
bearer tokens via `ant auth print-credentials --access-token`
(re-minted every 5 minutes and on 401), sent as
`Authorization: Bearer` + the required `anthropic-beta:
oauth-2025-04-20` header. `ANTHROPIC_AUTH_TOKEN` short-circuits the
CLI when set; `"auth": "apiKey"` (or a configured `apiKey`) keeps
the metered-key path as an explicit opt-in. Guide §3 documents the
two CLI traps (an exported ANTHROPIC_API_KEY silently outranks the
profile; refresh tokens hard-expire — re-login). Gate: new
apiKey-header assertion + an OAuth leg with a stub `ant` proving the
bearer/beta headers on the wire. **Gate PASSED 2026-08-14 (36/36).**

## v1.0 (2026-08-14)

New component: the Doc Index sweep as a **local Node orchestrator** —
Power Automate leaves the pipeline entirely (orchestration, compute,
AI Builder, premium licensing, import packages, designer mis-picks).
SharePoint stays as the storage/consumption layer; the Q&A agent,
TestPlanGen, curation flow, and human readers are untouched.

- `sweep.mjs` — the orchestrator, mirroring flow v2.8 action-for-
  action from the extracted orchestration spec: Needs_index gating
  (incl. the PromptVersion backfill lever), the four extraction lanes
  (+ oversize/pdf/msg/html → Skip lane), LLM classify with the flow's
  whitelist clamps, RegexExtract ids/products, the ~22-field Doc
  Index upsert with PromptVersion stamped only by the URL patch
  (self-healing partial failures), byte-faithful v2.8 sidecar headers
  (info table, `<!-- metadata -->` comment frame, related region,
  `---` seam), media with `doc{srcId}_` prefixes, IdKey/LinkKey/KWKey
  dedup with sorted-pair id edges and canonical alias folding,
  shortlist→final→sidecarpatch relatedness with reciprocal neighbor
  patching, Skip/Error lanes with `{step}: {detail}` LastError and
  retry-next-run recovery, and the flow's Run_summary line. Dry-run
  (shadow) mode executes all compute, records every write as a plan,
  and reports DocKey calibration against rows the cloud flow wrote.
- `graph.mjs` — minimal Graph client (client-credentials, paged list
  reads, item create/patch, throttle-aware). List GUIDs come from
  config — the FX-6 hand-typed-URI failure class is gone.
- `llm.mjs` — direct Anthropic Messages API call (raw fetch, zero
  npm dependencies) executing `prompts/DocIndex_Prompt.md` verbatim
  between its markers; nine-field output pinned by a JSON schema.
  Prompt promotion becomes a git pull, not a tenant paste.
- `pad/runner/ops.mjs` — the PAD runner's script loading + op
  dispatch extracted into a shared module so the sweep drives the
  UNMODIFIED `scripts/` through the same gated path (`run_job.mjs`
  refactored to import it; PAD gate re-PASSED 27/27, behavior
  identical).
- `harness/check_local_sweep.py` — gate (stdlib + Node 22+, mock
  Graph + mock LLM via http.server, generated fixtures, CI
  `fixture-free` job): dry-run leg (zero writes, plan recorded),
  live leg (rows/fields/sidecars/media/edges/keywords/junctions/
  reciprocal patch/Skip/Error lanes, 33 checks), idempotency leg
  (second run reprocesses only the Error doc, no LLM spend on
  stamped docs). **Gate PASSED 2026-08-14 (33/33).**
- `Local_Setup.md` — Entra app registration, LLM key, config,
  Task Scheduler (headless — no attended-session constraint),
  shadow-mode checklist incl. DocKey calibration, cloud-flow
  handover/rollback, deviations list, security notes.
- `config.sample.json` — machine config template (git-ignores as
  `local/config.json`; secrets via `{"$env": ...}`).

Deployment state: **authored, nothing switched over**. The cloud flow
keeps running until the §5 shadow checklist passes and DocIndexSweep
is turned off in the portal — never both live at once.
