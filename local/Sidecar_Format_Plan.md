# Sidecar Format Enhancement Plan

Review of the `LRSDocIndex/` sidecar corpus (lrs-doc-index, main @ 4163645,
2026-09-05) and of the code that writes and consumes it, with a plan to make
every sidecar follow one predictable layout, to store the metadata without a
code block, and to make test cases extractable from the whole test-plan
corpus instead of a quarter of it.

Repo paths below are in `roperkevin/lrs-doc-index` unless stated otherwise.

---

## 1. Summary

**The header is already uniform. The body is not, and that is where test-case
extraction fails.** All 755 sidecars carry the same H1, the same 6-row info
table, the same 21-key yaml block in the same order, `## Summary`,
`## Related documents`, and the `---` seam. Nothing about the top of the file
needs re-standardising; it needs simplifying (see §4).

**Only 43 of 178 test plans yield any test cases (463 cases total).** The
parser recognises exactly two shapes: `## Case N <!-- slide N -->` headings,
which the sweep only mints for slides whose author left the slide title
placeholder empty, and the `### TC-Pn / TC-Nn` TestPlanGen draft contract,
which no legacy plan uses. Everything else yields zero cases silently. Of the
135 case-less plans, 124 contain recognisable case content in one of five
other shapes (case tables with `# / Test / Expected result` columns, titled
case slides, single-column `Positive Tests: <group>` tables, labelled
`Verify…` bullet lists, xlsx case sheets).

**The single largest defect is upstream of the parser.** `ZipTextExtract`
joins every paragraph inside a table cell with a space, so a slide whose
"Positive Tests: Gapped Routes" cell held nine bullet-point test cases
becomes one 900-character run-on cell. 62 test plans have this. No parser can
recover case boundaries from that text; the fix has to be in extraction.

**Recommendation in one paragraph.** Keep the current header skeleton but
make the visible info table the *only* metadata representation (no yaml, no
code block, no duplication), moving the machine `related:` list into the
existing `<!-- rel:NNN -->` markers. Fix the four extraction defects that
destroy structure (cell paragraphs, inherited bullets, docx label paragraphs,
docx numbering). Define one canonical **test-case grammar** shared by legacy
plans and TestPlanGen drafts, and grow the deterministic case detector from
one shape to six, each stamping provenance and a confidence value. Add an
opt-in LLM normalisation lane only for the residue. Rename the files to one
convention (`<issue>-<slug>.md`, kind word dropped, glossary abbreviations,
no id token, human-unique qualifiers, media folders named by the same stem,
stem frozen after first mint, id resolved through a manifest). Roll out
with the existing version-gated backfill (`--reformat` / `--recase`).

---

## 2. What was reviewed

Corpus (`LRSDocIndex/`):

| Kind | Sidecars | Source formats |
|---|---|---|
| Test Plans | 178 | 151 pptx · 17 docx · 8 pdf · 2 xlsx |
| User Stories | 298 | 288 pptx · 8 pdf · 2 docx |
| Other | 218 | 171 docx · 26 pdf · 9 pptx · 7 xlsx · 5 txt |
| Design Spikes | 54 | pptx |
| Schedules / Data Templates | 7 | xlsx · pdf · docx |
| media | 4,459 files | 2,496 svg · 1,913 png · 50 jpg/jpeg |

Every sidecar is at `prompt_version: v2.0.2`, extracted 2026-09-04 by the
local sweep; there is no legacy-frame residue left in the corpus.

Code: `local/sweep.mjs` (header template :491-557, assembly :1510-1544,
`--reformat` :1060-1088, `--recase` :803-866), `local/lib/presentation.mjs`
(`tidyBody` :123, `caseHeadings` :235), `local/lib/caseindex.mjs` (parser),
`scripts/ZipTextExtract.ts` (pptx/docx extraction), `scripts/SidecarPatch.ts`
(metadata frames), `local/lib/doclinks.mjs` (`bodySeamEnd` :258, `yamlList`
:292), `local/testplangen.mjs`, `local/lib/draftlint.mjs`,
`prompts/TestPlanGen_Prompt.md`, `local/Case_Index_Plan.md`,
`agent/QA_Agent_Instructions_v1_3.md`, `flow/v2_3` and `flow/v2_8` CHANGES,
`local/harness/check_caseindex.py`, `_Case Catalog.md`.

---

## 3. Findings

### 3.1 Header and metadata

What is uniform (755/755): H1; info table with rows Kind, Release, [Product],
[Issue], Source, Edited, Extracted; `<!-- metadata` + ```` ```yaml ```` fence
with 21 keys in fixed order; `## Summary`; `## Related documents` with
`related:begin/end` markers; `---` seam.

Problems:

1. **Two representations of the same facts.** Title, kind, surface, release,
   product, issue, source, edited, extracted appear in both the table and the
   yaml. They are written from the same variables today, but every future
   change has to be made twice and two parsers must agree.
2. **The yaml is a code block inside a comment.** It is hidden by every
   renderer, yet the Copilot Q&A agent depends on the yaml lines being part
   of the retrieved text (`agent/QA_Agent_Instructions_v1_3.md:65-68`). Any
   redesign must keep the metadata *in the file text*, not just in a list
   column or a companion file.
3. **Quoting is inconsistent** (`sweep.mjs:520-540`): `title`/`source_file`
   are escaped, `source_url`/`last_edited`/`prompt_version`/`issues` are
   interpolated raw, `products` items are wrapped in quotes with no
   escaping, `keywords`/`tools` have `"` and `\` deleted rather than escaped.
   A `"` in a URL would break the block. Nothing YAML-parses it; every
   consumer is a line regex (`yamlList`, `yamlVal`, `parseRelated`'s
   `"related: ["` string slice at `testplangen.mjs:524`).
4. **Empty rows are noise.** In test plans `target_release` is empty in
   171/178, `pe` 124/178, `dev` 116/178, `doc_revision` 123/178. The table
   already prints `—` for Release; the yaml prints `""`.
5. **`related:` is machine data that says so** in the agent instructions
   ("ignore it"). It does not need to be in the metadata at all; each entry
   already has a `<!-- rel:NNN -->` marker in the Related section.

### 3.2 Body layout: why sidecars look "disorganised"

The body is whatever `ZipTextExtract` (pptx/docx), `WorkbookDump` (xlsx),
`pdftotext` (pdf) or the msg/txt/html lanes produced, post-processed by
`tidyBody` and `caseHeadings`. The layout therefore depends on the *source
format and the author's slide habits*, not on the document kind. Observed
shapes across the 178 test plans:

| Body shape | Plans | What it looks like | Cases indexed today |
|---|---|---|---|
| A. Bare `## Slide N` + one numbered case line per slide | 29 | rewritten to `## Case N: Positive - … <!-- slide N -->` + `### Scenario` | yes |
| B. Bare `## Slide N` + `Positive/Negative` label line, no numbering | 14 | `## Positive Cases <!-- slide 7 -->` (one heading swallows the slide) | over-captured as one case |
| C. Single-column tables titled `Positive Tests: <group>` whose cell holds N collapsed bullets | 62 | `\| Correct line order of 100, 200 … Correct line order of 300 … \|` | no |
| D. Case tables `# \| Test \| Expected result` (pptx) or `Test Case \| Description \| … \| Response` (xlsx sheets) | 19 | well-formed GFM tables, one case per row | no |
| E. Titled slides `## Slide 4 — Test case 1: Transfer to …` / `## Slide 3 — 1. Coordinate location …` | 71 have titled slides | title carries the case; `caseHeadings` skips titled slides entirely (`presentation.mjs:292`) | no |
| F. docx label paragraphs + bullet lists: `UI Tests – First Pane:` / `Negative Tests:` then `- Verify …` | 17 docx (+ pptx bullet decks) | labels are plain paragraphs, not headings; bullets are checks, not cases | no |
| G. pdf line-wrapped text, numbered lists | 8 | every line broken at the PDF column width; `1.` lists preserved by luck | no |
| H. Empty or placeholder plans ("unit tests in ExB", 400 bytes) | ~6 | nothing to extract | correctly none |

Signals present in the 135 case-less plans: 101 have `- Verify/Ensure/Test…`
bullets, 62 have collapsed multi-bullet cells, 46 have `Positive/Negative
Tests: …` table headers, 36 have `Positive:`/`Negative:` label paragraphs,
29 have inline `1.`/`1a.` case numbering, 19 have case tables. Only 11 have
no signal at all.

Root causes, in the code:

1. **Cell paragraph flattening** — `scripts/ZipTextExtract.ts:612-617`
   replaces every tag (including `</a:p>` and `</w:p>`) with a space and
   collapses whitespace. Bullet structure inside cells is unrecoverable
   downstream. `renderTables` runs before the paragraph-prefix passes
   (`:801-807`), so cells can never receive `- ` markers.
2. **Inherited bullets are invisible** — `:828-836` emits `- ` only when the
   paragraph has `lvl>=1` or an explicit `<a:buChar>/<a:buAutoNum>`. Level-0
   bullets inherited from the layout/master (the most common kind in real
   decks) emit as plain lines, so "Acceptance Criteria Tests: Verify that"
   followed by 14 checks renders as 14 loose sentences in some decks and as
   bullets in others.
3. **Heading promotion only on untitled slides** — `caseHeadings` rewrites
   `^## Slide \d+$` only. 403 sidecars have `## Slide N — Title` headings
   (the author filled the title placeholder); 103 sidecars mix both forms
   in one file. Titled case slides ("Test case 1: …") therefore never get a
   `<!-- slide N -->` comment and never become cases.
4. **docx structure loss** — headings map only from `Heading1..6` styles;
   the corpus' docx plans use bold "Label:" paragraphs instead, so the
   section structure is flat. Ordered lists emit as `- ` (`:817-822`), and
   list-numbering artefacts leak (`00Configuration`).
5. **Slide titles vs body placeholders** — body-placeholder text and floating
   text boxes are indistinguishable in output, so a slide's real heading
   ("Coordinate Configuration Tests") often lands as a paragraph *after* its
   table.
6. **pdf lane** — `pdftotext` output is not unwrapped; every case sentence is
   split across 3–5 lines.
7. **Presentation-layer drift** — `## Slide N`, `## Slide N — title`,
   `## <promoted bullet> <!-- slide N -->` (e.g. `## - Existing test cases
   <!-- slide 2 -->` in doc521), `## Case N <!-- slide N -->`, `## Sheet: X`
   all coexist. There is no per-kind body schema; there is only "whatever the
   extractor produced, lightly tidied".

User Stories and Design Spikes look far better than Test Plans, because the
deck templates they come from (`User Story / Persona / Acceptance criteria /
Testing / Automation / Documentation / Assignment`) title every slide. That
is a hint: the good sidecars are the ones whose source had a template.

### 3.3 Test-case extraction (`local/lib/caseindex.mjs`)

- `extractCases` (:394) runs `deckCases` (:286) and `draftCases` (:349),
  keeps whichever finds more, else `shape: "none"`. Deck shape requires
  `^## (.+?) <!-- slide (\d+) -->$` and a title matching `^Case (\d+)` or
  `^Positive\b` / `^Negative\b` (:295-313). Draft shape requires
  `^### (TC-([PN])\d+)`.
- Scenario = first `### ` line directly under the H2 (:318-324).
- Per-case fields (`Classification`, `CaseText`, `IssueRefs`, `RouteRefs`,
  `FigureLinks`, `StepCount`, `ExpectedResult`, `TraceText`, `Tools`,
  `Keywords`, `Anchor`) are all regex-derived from the section text; steps
  and expected result only ever populate for draft-shaped cases (only 5
  legacy plans have an `Expected Result:` line in the required form).
- `CaseKey = {docRowId}|{ordinal}` is document order, so inserting a slide
  renumbers every case after it (documented as a non-durable key, plan D4).
- **Over-capture bug**: rule-b treats any `## Positive … <!-- slide N -->`
  heading as one case, so a divider slide "Positive Cases" followed by a
  table of 12 cases becomes a single Positive case with a 4,000-char body
  (23 such headings in the corpus; e.g. doc34 shows "Negative Tests —
  Overview", scenario "2").
- **Deliberate coupling** (plan D1): the parser is pinned to
  `caseHeadings`' emission by using `caseHeadings(tidyBody(raw))` as the
  gate fixture. Any new shape has to be added on both sides.
- `--recase` cuts the body at `bodySeamEnd` (`doclinks.mjs:258`) — header,
  metadata, summary, related and docs blocks are never parsed by caseindex.
  That is good: the metadata frame can change without touching the parser.

Net effect: the catalog covers 24% of plans, and the covered plans skew
towards one author's deck style (the 29 shape-A plans account for 408 of the
463 cases).

### 3.4 Filenames

Today: `{title-slug}__doc{rowId}.md` inside a per-kind folder
(`sweep.mjs:1505`; slug from `RegexExtract.ts` `slugify` :136 — lowercase
`[a-z0-9-]`, 80-char cap cut at the last hyphen past 40). Media files are
`media/doc{srcItemId}_{name}` (`sweep.mjs:146-203`). Drafts are
`TestPlanDraft__doc{ID}__{yyyyMMdd-HHmmss}.md`.

| Observation | Count | Example |
|---|---|---|
| Slug repeats the folder's kind word | 135/178 test plans (`-test-plan`), 54/298 stories (`user-story`), 45/54 spikes (`spike-`) | `Test Plans/append-routes-line-order-check-test-plan__doc564.md` |
| Same slug on several documents, only the id differs | 52 slug groups | `Other/event-behavior-for-route-retirement__doc{8 ids}.md` — really `EB retire RH 5633.docx`, `EB retire APR 5633.docx`, `TrackChange.EB.retire.RH.docx` … |
| Cut mid-phrase by the 80-char cap | 19 slugs ≥ 78 chars, 9 end on a stopword | `…-for-append-routes-append-events-and__doc498.md` |
| Length | median 45 chars, max 80 | — |
| Title fell back to the source basename | 29 | `spike-benchmark-overlay-events-in-gp-vs-api` |
| Product/surface spelled two ways | `exb-` (2) vs `experience-builder-` (22) | `exb-search-by-referent-test-plan` vs `experience-builder-versioning-test-plan` |
| Media named by a *different* id than the sidecar | all | `Test Plans/…__doc454.md` links `../media/doc494_slide3.svg` (library item id vs Doc Index row id — the v2.5 identity fix never reached media) |
| Three separator conventions | — | `__doc564` in sidecars, `doc494_` in media, `__doc42__20260904-…` in drafts |
| Version noise inherited from source names | 2 in slug, 55 only in `doc_revision` | `export-network-reassign-transfer-test-plan-v1` |

The slug is minted from the AI title on every reindex, so a re-titled
document is renamed and its old copy recycled; nothing pins a name once it
has been linked from neighbours' Related sections and from the catalog.

---

## 4. Target design

### 4.1 Sidecar v3 skeleton (all kinds)

```
# <Title>

| Field | Value |
| --- | --- |
| **Doc** | 564 · Test Plan · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4975](…) |
| **Source** | [4975-AppendRoutesLineOrderCheck_TestPlan_V2.pptx](<…>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2023-05-22 22:17 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format v3.0 |
| **Keywords** | append routes · line order · route · gapped routes · point on measure |
| **Tools** | — |

## Summary
…

## Related documents
<!-- related:begin -->
- [Append Routes: Line Order Check User Story](<…>) — shared issue … <!-- rel:578 s=1006.257 -->
<!-- related:end -->

---

<body, per-kind profile — see 4.3>
```

Rules:

- The table is the **only** metadata representation. Fixed row order, every
  row always present (value `—` when empty) so the shape is identical across
  the corpus and a reader learns it once.
- One fact per row wherever a machine needs it individually (`Product`,
  `Release`, `Issues`, `Keywords`, `Tools`); composite rows only for facts no
  consumer splits (`People`, `Edited`). The `Doc` row carries the row id, kind
  and surface in a fixed `id · kind · surface` order.
- Lists use ` · ` as separator (already the corpus convention for
  `Test Plan · Pro`), and `\|` escaping inside cells.
- `related:` machine data moves into the Related section's per-entry
  comment (`<!-- rel:578 s=1006.257 -->`). SidecarPatch already owns that
  region; the second patch region (the yaml line) disappears.
- `format v3.0` in the Extracted row replaces `prompt_version` as the
  layout gate for the backfill (see §6). The AI prompt version can stay in
  the Doc Index list where it already lives.
- The `---` seam, `related:begin/end`, `docs:begin/end` and `<!-- slide N -->`
  provenance comments stay exactly as they are; every existing seam-based
  consumer (`bodySeamEnd`, `bodyindex`, `embedindex`, `--reformat`) keeps
  working unchanged.

### 4.2 Where to keep the metadata — options considered

| Option | Rendered view | Retrievable by Copilot | Machine parse | Risk |
|---|---|---|---|---|
| **A. Info table is the metadata (recommended)** | one tidy table, already familiar | yes (plain text) | `^\| \*\*Key\*\* \| (.*) \|$` per row, split lists on ` · ` | cells need `\|` escaping; a 10-row table is the whole header |
| B. Bare `key: value` lines inside `<!-- metadata … -->` (drop the fence only) | hidden | yes | unchanged line regexes | keeps the duplication and quoting mess; 2-line change |
| C. `---` YAML front matter | GitHub renders it as a table; SharePoint preview renders a giant setext H2 (`flow/v2_3/CHANGES.md:23-31`) | yes | standard YAML | SharePoint preview still exists as a surface; rejected once already |
| D. Companion `name__doc564.meta.json` | not shown | **no** — breaks the Q&A agent's field reads | trivially | two files per doc to keep in sync; SharePoint search does not join them |

A is the decision (2026-09-05) because it removes the duplication instead of hiding it,
needs no code block, and the only true machine consumers of the yaml
(`yamlList` for tools/keywords at rerank time, `yamlVal` in svg2pptx,
`parseRelated` in testplangen, `patchFrontmatter` in SidecarPatch) are four
small regex readers that are easy to point at table rows and rel-markers.
B remains available as a one-day interim step if phase 1 slips.

### 4.3 Per-kind body profiles

Define a **body profile** per DocKind, written as a spec in
`docs/Sidecar_Profiles.md` and enforced by a lint (extend `draftlint.mjs`).
The profile fixes the H2 set and order; anything the extractor produced that
does not map to a section goes to the last section, so nothing is lost.

**Test Plan profile (`testplan/v1`)** — the one that matters for extraction:

```
## Overview
<scope, objective, environments, data, general notes — from Notes cells,
 "Scope", "Test Environments & Data", "Out of scope" slides>

## Test Cases

### TC-P01 — Correct line order 100, 200, 300, 400 on a normal line <!-- src: slide 1 · table "Positive Tests: Normal Routes" · row 1 -->
- **Group:** Normal Routes
- **Data:** <tables / figure links that belonged to this case>
- **Steps:** <numbered, when the source had them>
- **Expected Result:** <when the source had it>

### TC-N01 — Incorrect line order 300, 200, 100 <!-- src: slide 2 · table "Negative Tests: Normal Routes" · row 1 -->
…

## Other content
<anything not assigned to Overview or a case: unmatched slides, appendix
 tables, "Devtopia Issue" stubs>
```

Design points:

- **One case grammar for legacy plans and drafts.** `### TC-P01 — title` is
  already the TestPlanGen draft contract (`prompts/TestPlanGen_Prompt.md:233-372`,
  `draftlint.mjs:127`). Using it for legacy plans means `caseindex` needs
  one parser instead of two, `_Case Catalog.md` links look the same for every
  plan, and TestPlanGen can pin legacy cases as exemplars with no special
  casing. Unclassified cases use `TC-U01`.
- **Provenance is mandatory.** Every case heading carries a `<!-- src: … -->`
  comment naming the slide/sheet/paragraph and, where relevant, the table
  header and row. This replaces `<!-- slide N -->` (kept as a synonym during
  migration) and makes every catalog row auditable.
- **Bold-label body lines, not sub-headings**, for Group/Data/Steps/Expected
  Result — the parser's existing `^\**Expected Result\**` regex already reads
  this form, and it keeps the heading hierarchy two levels deep.
- **Tables and figures move into their case** when the shape detector can
  attribute them (shape A/E: everything on the slide; shape D: the row);
  otherwise they stay in `Other content`. Never duplicated.
- **Verification checklists stay checklists.** A `- Verify …` bullet under a
  label such as `UI Tests – First Pane:` is a check, not a case. Profile
  rule: a labelled bullet list becomes *one* case per label with the bullets
  as its Steps, unless the label is `Positive`/`Negative` (then one case per
  bullet). Decided 2026-09-05; still exposed as a config knob with a stoplist (`Notes`, `Environments`, `Data`,
  `Configuration`, `Out of scope` → Overview).

**User Story profile (`story/v1`)**: `## Story` (the "As a … so that …"
statement + persona), `## Acceptance Criteria`, `## Testing`,
`## Automation`, `## Documentation`, `## Assignment`, `## Other content`.
The deck template already uses these titles, so this is mostly mapping
slide titles to canonical names. It gives TestPlanGen a fixed place to find
acceptance criteria (its STORY-FIRST TRACE rule currently searches the whole
body).

**Design Spike / Other / Data Template / Schedule**: `## Content` with the
extractor output as today, plus the standard header. No structural claims.

### 4.4 Case extraction pipeline (deterministic first)

Replace `caseHeadings` (one detector) with a **shape-detector chain** in a
new `local/lib/casegrammar.mjs`, run at the same point in the pipeline
(sidecar body only; LLM input, TextPreview and BM25 keep raw text):

| # | Detector | Trigger | Emits | Confidence |
|---|---|---|---|---|
| S1 | Case slide | bare `## Slide N` with one numbered case line (today's rule a) | one TC per slide, slide tables/figures attached | high |
| S2 | Titled case slide | `## Slide N — (Test )?case \d+[:.]` / `## Slide N — \d+[a-z]?[.)] …` | one TC per slide; sub-cases `1a.`/`1b.` become Steps or separate TCs (knob) | high |
| S3 | Case table | header row containing an id column (`#`, `ID`, `Test Case`, `TC`) and a description column; optional `Expected`/`Result`/`Response` column | one TC per row; id kept in the src comment (`A-7`), Expected Result populated | high |
| S4 | Classification table | single-column table whose header matches `(Positive\|Negative) (Tests\|Cases)(: <group>)?` | one TC per cell paragraph, Group = header suffix — **requires the cell fix in 4.5** | medium-high |
| S5 | Labelled bullet list | a short paragraph ending in `:` or matching `(Positive\|Negative)…` followed by ≥2 bullets | per profile rule in 4.3 | medium |
| S6 | Inline numbered cases | ≥2 `^\d+[.)] ` lines outside tables under a Positive/Negative context | one TC per line | medium |
| S0 | Draft contract | `### TC-[PN]\d+` already present (TestPlanGen output re-indexed) | pass-through | high |

Rules for the chain: detectors run per section; the first detector that
fires on a section owns it; a plan may mix shapes (today's `mixed` counter
becomes a per-case `shape` value); sections nobody claims go to
`## Other content`. Each TC records `shape` and `confidence`; the Test Cases
list gains `Shape` values for the new detectors and a `Confidence` column so
the catalog can be filtered to high-confidence rows for test-plan generation.

Fix the rule-b over-capture in the same change: a heading matching
`^(Positive|Negative) (Cases|Tests)` with a table or ≥3 bullets beneath it is
a **divider**, not a case (the current guard only catches titles ending in
"test cases", `caseindex.mjs:299`).

**LLM lane (opt-in, phase 4 — decided to build).** For plans where the chain produces zero cases
but the survey signals say cases exist, add `--normalize-cases` that sends
the raw body to the same AI step the sweep already uses (Dataverse Predict
or Anthropic, per `llm.mjs`) with a prompt that must output the
`testplan/v1` profile *with src comments for every case*, then runs the
profile lint and a grounding check (every TC title must appear as a
substring of the raw body, same idea as `groundDraft`). Fail closed to
`shape: none`. Budget-capped and owner-switched like `--auto`. This respects
the "deterministic by decision" stance in `local/CHANGES.md` v1.25: the
no-AI `--reformat` path never calls it, and its output is marked
`confidence: llm` so it never silently mixes with deterministic rows.

Expected yield (from the survey, so an estimate): S1 keeps 43 plans; S3 and
S4 alone should bring roughly 60 more; S2/S5/S6 another 20–30. Target for
phase 3 is **≥120 of 178 plans** with cases, and a `plans_caseless` list on
`_Case Catalog.md` naming the rest with their detected signals.

### 4.5 Extractor fixes (`scripts/ZipTextExtract.ts`, → v2.5)

1. **Preserve cell paragraphs.** In `renderTables` (:581-646) split the cell
   on `</a:p>`/`</w:p>` before tag-stripping. Render policy: a *single-column*
   table whose cells hold ≥2 paragraphs is emitted as `**Header**` followed
   by a bullet list (renderer-safe everywhere, and exactly what S4 needs);
   multi-column cells join paragraphs with `<br>` (decided; GFM-correct, and
   the parser splits cells on it).
2. **Inherit level-0 bullets.** Resolve the placeholder's list style from the
   layout/master (`p:ph` type → `a:lstStyle` → `a:lvl1pPr` `buChar/buAutoNum`)
   so decks that rely on the template bullet emit `- `. Keep `buNone` early
   return.
3. **Title vs body placeholders.** Emit `p:ph type="body"` paragraphs after
   the title but before floating text boxes, and promote a short
   (≤80 chars, no terminal punctuation) first body-placeholder line to
   `### ` when the slide has no title — this fixes "Coordinate Configuration
   Tests" landing after its table.
4. **docx labels and numbering.** A paragraph that is bold (or all-bold runs)
   and ≤60 chars, or ends with `:` and is followed by a list, becomes `### `.
   Ordered lists (`w:numFmt` ≠ bullet) emit `1.`. Strip the leading
   numbering artefact (`00Configuration`) that comes from `w:t` inside
   `w:numPr` runs.
5. **pdf unwrap.** Join lines within a paragraph when the next line starts
   lowercase or the current line does not end in punctuation; keep `1.` list
   starts as breaks.

These are byte-equivalence-gated scripts (`review/harness/check_batch_*.py`);
each fix ships as a gated patch in `review/patches/` with fixtures cut from
real corpus files (doc564 for cell paragraphs, doc28 for inherited bullets,
doc457/doc423 for docx labels, doc498 for pdf).

### 4.6 Filename convention

Decided 2026-09-05: issue-number prefix **on**, no doc-id token in the
name, glossary abbreviations **on**. Goal: a name a person can read in a
folder listing, that groups a feature's plan and story together, never
repeats what the folder already says, and is stable once minted.

**Template** (configurable, `sidecar.nameTemplate` in `local/config.json`):

```
<Kind folder>/<issue>-<slug>[-<qualifier>].md     Test Plans/4975-append-routes-line-order-check.md
<Kind folder>/<slug>[-<qualifier>].md              Other/event-behavior-for-route-retirement-rh.md   (no issue known)
media/<stem>/<asset>                               media/4975-append-routes-line-order-check/slide3.svg
Test Plan Drafts/<stem>--draft-<yyyymmdd-hhmm>.md  4975-append-routes-line-order-check--draft-20260904-2300.md
```

`<stem>` is the sidecar filename without `.md`. Everything that belongs to
a document shares its stem, so a folder listing of `media/` reads like the
listing of the kind folders, and a rename moves one sidecar and one media
folder together.

**Issue prefix.** The number of the document's *primary* issue, chosen in
this order: the issue-number prefix of the source filename (130 of 755
source files start with one, e.g. `4975-AppendRoutesLineOrderCheck…pptx`);
otherwise the first entry of the sorted `issues` list (204 sidecars carry at
least one); otherwise no prefix. Number only, no repo, **no zero padding** (decided
2026-09-05) — this matches how the team already names its own source files.
Consequences to accept: `26618-` sorts before `4975-` in a plain listing
(zero padding would fix that at the cost of `04975-` names), and roughly
550 of 755 documents will have no prefix until their issue is recorded, so
the two forms coexist inside every folder. A plan and its story that share
an issue now sit together across the two folders (`Test Plans/4975-…`,
`User Stories/4975-…`), which is the point.

**Slug rules** (`slugify` v2, in `RegexExtract.ts` and mirrored in the sweep):

1. Source text is the H1 title; fall back to the cleaned source basename
   (strip the leading issue number, `_TestPlan_V2`, `(2) 1`, `copy`,
   `final`, `fixed`, `feedback` tokens) — never the raw basename.
2. **Drop the kind word** when it matches the folder: `test plan(s)`,
   `test cases`, `acceptance tests`, `user story`, `(design) spike`,
   `doc review`, wherever it sits (`Test Plan: X`, `X Test Plan`, `X – Test
   Plan V2`). Folder + slug together still say it.
3. **Glossary abbreviations**, applied token-wise from a config map (not
   code), initial contents:

   | Long form (slug tokens) | Short | In corpus today |
   |---|---|---|
   | experience-builder | exb | 56 |
   | location-referencing, linear-referencing | lr | 46 + 8 |
   | event-behavior, event-behaviors | eb | 38 + 20 |
   | dynamic-segmentation | dynseg | 24 |
   | arcgis-pro | pro | 24 |
   | gp-tool, geoprocessing | gp | 22 + 6 |
   | roads-and-highways | rh | 20 |
   | pipeline-referencing | apr | 19 |
   | straight-line-diagram | sld | 12 |
   | calibration-point, calibration-points | cp | 10 |
   | utility-network | un | 6 |

   Decided 2026-09-05 as the initial map. `ai-assistant` stays spelled out
   (a bare `ai` token loses the meaning); `attribute-set` stays spelled out
   (no team short form). The short tokens are already the corpus' own
   vocabulary — `pro` appears in 73 slugs, `gp` in 35, `sld` in 15 — so the
   map only makes the remaining long forms consistent with them. Applied
   to today's titles it shortens the slug corpus by about 13 percent.
   Only whole-token matches on hyphen boundaries; `pro` never replaces `project`. The map is the
   same glossary `data/shared/glossary.json` in this repo already documents,
   so the sidecar names and the prompt-builder UI abbreviate the same way.
4. **Length**: soft cap 60 chars for the slug (the issue prefix is extra),
   cut at the last phrase break (`:`, `–`, `(`, `,`) inside the cap, else the
   last word boundary; never end on a stopword (`and`, `of`, `with`, `on`,
   `for`, `in`, `to`, `the`, `a`); hard cap 72. Same `shortTitle` logic
   `presentation.mjs:235` already uses for case headings.
5. **Uniqueness without an id token.** The stem must be unique within its
   folder by construction. When two documents would share a stem, append
   qualifier tokens in this fixed order until they differ: product acronym
   (`rh` / `apr` / `un`) when products differ; `v<doc_revision>` when
   revisions differ; `<yyyy-mm>` of `last_edited` when months differ;
   finally a numeric `-2`, `-3` … in Doc Index row-id order. Computed at
   sweep time over all rows of the folder, so it is deterministic and the
   dry run (`--rename-plan`) shows every choice. The eight
   `event-behavior-for-route-retirement` documents become
   `event-behavior-for-route-retirement-rh`, `…-apr`, `…-rh-2024-01`,
   `…-apr-2024-01`, `…-rh-2024-01-2` … — still readable, still unique.
6. **Stability.** The stem is minted once and recorded on the Doc Index
   row (`TextFileUrl` already holds the path; add a `SidecarStem` column so
   the rename map has a durable key). A later title change updates the H1
   only. `--rename` re-mints stems for the whole corpus from the rules,
   renames sidecars and media folders, and rewrites every inbound link
   (Related sections, `_Index.md`, `_Case Catalog.md`, Test Cases `Anchor`
   and `FigureLink` URLs, draft idempotency) from the old→new map in the
   same run. Old stems are unique tokens, so the rewrite is a string
   replacement across the corpus.
7. **Where the id lives now.** The Doc Index row id stays in the sidecar's
   metadata table (`Doc` row) and on the list; it is no longer in any
   filename. Code that today finds a file by its `__doc<id>` suffix
   (`svg2pptx.mjs:144-158`, TestPlanGen's draft scan
   `testplangen.mjs:1394`, the `--recase` mirror walk) resolves id → path
   through a `_Manifest.json` the sweep writes at the library root
   (`{ "564": { "path": "Test Plans/4975-append-routes-line-order-check.md",
   "stem": "…", "issue": 4975, "kind": "Test Plan" } }`), rebuilt on every
   live run and by `--rename`. The manifest also gives the Q&A agent and any
   script a one-file answer to "which sidecar is doc 564".

Folder names stay as they are (`Test Plans/` …). Renaming them to kebab-case
would buy URL prettiness at the cost of changing `Config.KindFolders`, every
SharePoint link and the agent's instructions; not worth a corpus-wide churn
on its own. The `_Index.md` / `_Case Catalog.md` / `_Sweep Status.md` /
`_Manifest.json` pages keep the underscore prefix so they sort first.

Before/after, from the corpus:

| Today | Proposed |
|---|---|
| `Test Plans/append-routes-line-order-check-test-plan__doc564.md` | `Test Plans/4975-append-routes-line-order-check.md` |
| `User Stories/append-routes-line-order-check-user-story__doc578.md` | `User Stories/4975-append-routes-line-order-check.md` |
| `Test Plans/experience-builder-add-multiple-line-events-widget-test-plan__doc457.md` | `Test Plans/16343-exb-add-multiple-line-events-widget.md` |
| `Test Plans/lrs-identify-show-coordinates-in-results-experience-builder-widget-test-plan__doc859.md` | `Test Plans/26618-lrs-identify-show-coordinates-in-results-exb-widget.md` |
| `Test Plans/bug-verification-and-regression-testing-for-append-routes-append-events-and__doc498.md` (×3 re-uploads) | `Test Plans/bug-verification-and-regression-testing-for-append-routes-append-events.md`, `…-events-2.md`, `…-events-3.md` |
| `Design Spikes/spike-benchmark-overlay-events-in-gp-vs-api__doc185.md` | `Design Spikes/benchmark-overlay-events-in-gp-vs-api.md` |
| `Other/event-behavior-for-route-retirement__doc{8 ids}.md` | `Other/event-behavior-for-route-retirement-rh.md`, `…-apr.md`, `…-rh-2024-01.md`, … |
| `media/doc494_slide3.svg` (linked from `…__doc454.md`) | `media/<stem of doc454>/slide3.svg` |
| `TestPlanDraft__doc42__20260904-230038.md` | `<stem of doc42>--draft-20260904-2300.md` |

---

## 5. Consumer impact checklist

Files that must change for §4.1/4.2 (metadata) — one PR:

- `local/sweep.mjs:491-557` `sidecarHeader` — new table, drop the yaml frame;
  `:1510-1544` assembly unchanged
- `local/lib/util.mjs:18,25,37` — replace `yamlEscape`/`stripQuotes`/
  `quoteYamlItem` with one `cell()` escaper
- `scripts/SidecarPatch.ts:167-262, 344-401` — drop `patchFrontmatter`;
  `renderFmLine` writes `s=` into the rel marker instead
- `local/lib/doclinks.mjs:292` `yamlList` → `tableRow(content, "Keywords")`;
  `:258` `bodySeamEnd` unchanged
- `local/testplangen.mjs:524` `parseRelated` → read rel markers; `:1113-1119`
  `storyMeta` → build from table rows
- `local/svg2pptx.mjs:129-132,172` `yamlVal` → table reader
- `agent/QA_Agent_Instructions_v1_3.md:61-107` → v1.4 field dictionary
  (table rows instead of yaml keys); `agent/QA_Smoke_Questions.md`
- `local/lib/indexpages.mjs` — reads nothing from the yaml today; verify
- Harness fixtures: `local/harness/check_local_sweep.py:1193`,
  `check_testplangen.py:357,409,663`, `check_svg2pptx.py:281-286`,
  `review/harness/render_sample.py`, `check_format.py`, `check_related.py`
- `flow/v2_8/definition.json` `Sidecar_header` — if the cloud flow is ever
  re-enabled; otherwise record in `flow/CHANGES` that the local sweep is the
  only emitter and the flow template is frozen at v2.8

Files for §4.6 (filenames) — can ride with the metadata PR or follow it:

- `scripts/RegexExtract.ts:136-221` `slugify` v2 + kind-word strip +
  glossary map + primary-issue pick; gated patch in `review/patches/`
- `local/sweep.mjs:146-203` media → `media/<stem>/`; `:1505` name template
  (issue prefix, no id); stem minting with qualifier resolution over the
  folder's rows; new `_Manifest.json` writer; new `--rename` (rename map +
  corpus-wide link rewrite, sidecars and media folders together) and
  `--rename-plan` (dry run: old → new table, qualifier choices, collisions)
- `schemas/SPList_DocIndex.csv` — `SidecarStem` column
- `local/svg2pptx.mjs:144-158`, `local/testplangen.mjs:1306,1394`,
  `--recase` mirror walk (`sweep.mjs:803-866`) — id → path via the manifest
  instead of the `__doc<id>` suffix
- `scripts/SidecarPatch.ts` — `related` entries already store the filename;
  verify nothing parses `__doc` out of it
- `local/lib/indexpages.mjs`, `local/lib/caseindex.mjs` `Anchor` /
  `FigureLink` URLs
- `agent/QA_Agent_Instructions` (filename pattern text + manifest),
  `local/Local_Setup.md`, `data/shared/glossary.json` in this repo (shared
  abbreviation map)

Files for §4.3/4.4 (body profiles and case grammar) — second PR:

- new `local/lib/casegrammar.mjs` (detector chain) replacing
  `presentation.mjs:235` `caseHeadings`; `tidyBody` and `placeFigure` stay
- `local/lib/caseindex.mjs:286-393` → single `TC-` parser + `src` comment
  reader; keep `<!-- slide N -->` as a read-side synonym for one backfill
- `local/lib/draftlint.mjs` → profile lint (parameterised by profile)
- `schemas/SPList_TestCases.csv` → `Shape` choices, new `Confidence`,
  `Group`, `SourceRef` columns
- `local/lib/indexpages.mjs` `_Case Catalog.md` → Group column, confidence
  filter, `plans_caseless` section with signals
- `local/testplangen.mjs` → `## Source Case Sweep` and exemplar lanes read
  `TC-` cases from legacy plans too
- `local/harness/check_caseindex.py` → one fixture per detector S0–S6 cut
  from real sidecars; golden-file legs for ~10 representative plans

---

## 6. Roll-out

| Phase | Scope | Gate | Backfill |
|---|---|---|---|
| 0. Instrument (½ day) — **shipped** | `sweep.mjs --case-audit` (`local/lib/caseaudit.mjs`): per-plan parser shape + latent-shape signals, written to `_Case Audit.md` beside the catalog on a live run (a separate page rather than a catalog section: the catalog is rebuilt from list rows and never sees bodies) | `check_local_sweep` case-audit leg | none — read-only |
| 1. Metadata v3 — **shipped** (sweep v1.48, sidecarmeta v1.0, SidecarPatch v1.7, agent v1.4) | §4.1/4.2 option A; agent instructions v1.4; harness fixtures | all CI gates green; `check_local_sweep` idempotency leg proves a second `--reformat` is a no-op | `--reformat --live`, gated on `format` < 3.0 — no AI spend, whole corpus in one run |
| 1b. Filenames — **shipped** (sweep v1.49, slug v1.0, `_Manifest.json`, `--rename`) | §4.6 slug v2, issue prefix, stem-named media folders, `_Manifest.json`, `--rename-plan` / `--rename` | dry-run table reviewed by hand once; uniqueness leg (no two rows in a folder resolve to one stem); link-rewrite leg in `check_local_sweep` (no dangling links after rename) | `--rename --live` once, same window as phase 1 |
| 2. Extractor v2.5 (2–3 days) | §4.5 fixes 1–4 (pdf unwrap optional) | byte-equivalence gates updated with new fixtures; diff report over the 62 collapsed-cell plans | same `--reformat` run (raw text is re-extracted from the synced source files) |
| 3. Case grammar (3–4 days) | §4.3 profile + §4.4 S0–S6 + over-capture fix + catalog changes | `check_caseindex` fixtures S0–S6; case count must be ≥ today's 463 on the 43 covered plans (no regression) and ≥ 120 plans covered | `--recase --live` |
| 4. LLM lane (2 days) | `--normalize-cases` for the residue | grounding check + budget cap; manual review of the first 10 | opt-in, owner-run |
| 5. Story profile (1–2 days) | `story/v1` mapping; TestPlanGen trace rule reads `## Acceptance Criteria` first | `check_testplangen` grounding legs | `--reformat` |

Rollback per phase is the existing pattern: a `format` version gate on the
Extracted row, and `--reformat` re-emits from raw text, so no phase depends
on re-running the AI step.

---

## 7. Decisions

All decided 2026-09-05.

| # | Decision | Choice |
|---|---|---|
| 1 | Metadata home | **Option A** — the info table is the only metadata representation; no yaml, no code block; related scores move into the `<!-- rel:NNN -->` markers (§4.1/4.2) |
| 2 | Multi-column cell paragraphs | **`<br>` inside the cell**; single-column classification tables become header + bullet list (§4.5 fix 1). SharePoint preview showing a raw `<br>` is accepted |
| 3 | Bullet-list case granularity | **Per bullet under Positive/Negative labels, one case per label elsewhere**, stoplist labels to Overview (§4.3) |
| 4 | Case ids | **Per-plan sequence** `TC-P01` / `TC-N01` / `TC-U01`, matching the draft contract and today's `CaseKey`; no durable id |
| 5 | LLM normalisation lane | **Build in phase 4** as planned: opt-in `--normalize-cases`, grounding check, budget cap, never reachable from `--reformat` (§4.4) |
| 6 | Filename template | `<issue>-<slug>[-<qualifier>].md`, no doc-id token, no zero padding, glossary abbreviations per §4.6 |

Nothing remains open; the next step is phase 0 of §6.

---

## Appendix A — before / after, doc564 (Append Routes: Line Order Check)

Before (today, body excerpt):

```
## Slide 1

Append Routes: Line Order Check

| Positive Tests: Normal Routes |
| --- |
| Correct line order of 100, 200, 300, 400 on a normal line Correct line order of 300, 400, 500, 600 on a normal line Time sliced routes, first time slice is 100, 200, 300, 400 and second time slice is 300, 400, 500, 600 |

| Notes |
| --- |
| Test a few PoM Cases, focus mostly on APR data Test in FGDB, DC, and FS Ensure LineOrder is correct … |
```

Cases indexed: 0.

After (profile `testplan/v1`, detector S4 after extractor fix 1):

```
## Overview

**Notes**
- Test a few PoM Cases, focus mostly on APR data
- Test in FGDB, DC, and FS
- Ensure LineOrder is correct and a derived network can be generated
- Ensure that LineOrder numerical values are in increments of 100. Only test with Add Load Type
- Test a couple test cases in ModelBuilder and Python

## Test Cases

### TC-P01 — Correct line order of 100, 200, 300, 400 on a normal line <!-- src: slide 1 · Positive Tests: Normal Routes · 1 -->
- **Group:** Normal Routes

### TC-P02 — Correct line order of 300, 400, 500, 600 on a normal line <!-- src: slide 1 · Positive Tests: Normal Routes · 2 -->
- **Group:** Normal Routes

### TC-P03 — Time sliced routes, first time slice is 100, 200, 300, 400 and second time slice is 300, 400, 500, 600 <!-- src: slide 1 · Positive Tests: Normal Routes · 3 -->
- **Group:** Normal Routes

…

### TC-N01 — Incorrect line order of 400, 200, 100 with a gap between routes 200 and 100 <!-- src: slide 2 · Negative Tests: Gapped Routes · 1 -->
- **Group:** Gapped Routes
```

Cases indexed: 31 (12 positive, 19 negative), each with Group, shape S4,
confidence medium-high, anchor-linked from `_Case Catalog.md`.

## Appendix B — survey method

`survey.py` (session scratchpad) walked every `LRSDocIndex/**/*.md`, parsed
the metadata frame, the info table and the body after the first `---` seam,
and counted heading forms, tables, cells over 250 chars, bullets, numbered
lines, images and keyword signals; `_Case Catalog.md` supplied per-plan case
counts. Counts in §2–§3 come from that run on main @ 4163645. The script is
small and worth porting into the sweep as the phase-0 `--case-audit`.
