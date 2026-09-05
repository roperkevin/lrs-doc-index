# Plan — indexing individual test cases (`local/lib/caseindex.mjs`)

Status: **ALL PHASES BUILT** (2026-09-05 — `local/CHANGES.md`
caseindex v1.0, sweep v1.42, sweep v1.43 +
`testplangen/CHANGES.md` v2.29): the schema
(`schemas/SPList_TestCases.csv`), the parser
`local/lib/caseindex.mjs` (own gate
`local/harness/check_caseindex.py`, 45/45, CI — parser legs in the
per-component-gate mold rather than seats in the sweep suite), the
sweep wiring (`syncCases` at index time and on `--reformat`,
ghost-pass pruning, the `--recase` backfill, counters, the
missing-GUID fail-soft), and the consumers: `_Case Catalog.md`
(indexpages v1.1, rebuilt by live full sweeps and live `--recase`),
case-level tracing in `--gap-report` (testplangen.mjs v1.8 —
`caseRows=/traced=/coveredUntraced=`, the covered-by-adjacency-only
section, the flagged gap-with-cases line), and smoke row 9
(`agent/QA_Smoke_Questions.md` v1.1). Gates:
`check_local_sweep.py` **235/235**, `check_testplangen.py`
**141/141**, `check_caseindex.py` 45/45 — all CI. The Test Cases
list was CREATED on the tenant 2026-09-05 (GUID
`ae9374ab-295a-4321-8afa-a83a08e17711`, in `config.sample.json`);
what remains, queued behind auth restore (STATUS action 12), is the
sweep machine's config line plus one `--recase --live`
(Local_Setup §12). This document stays the design
record, the `Local_TestPlanGen_Plan.md` precedent; what remains
below it is the record of the decisions, not backlog — except the
"Queued, NOT in this plan's phases" list, which stays deliberately
deferred.

## Why

The catalog's unit of truth is the DOCUMENT. A test plan's Doc Index
row knows its title, kind, surface, products, keywords, and edges —
but the plan's actual content, its individual test cases, exists
only as prose inside the sidecar body. Three consumers already want
case-level truth and fake it today:

1. **Coverage.** `testplangen.mjs --gap-report` calls a story
   "covered" when ANY related Test Plan exists (related-list entry
   or Doc Links edge). That is document-adjacency, not coverage: a
   plan with three thin cases and a plan with forty granular ones
   count the same, and nothing can answer "which cases exercise
   issue ArcGISPro/ps-location-referencing#4855?" even though the
   sweep already mints that issue id at the DOCUMENT level (Doc IDs)
   and the case that states it is one slide of one deck.
2. **Exemplar selection.** TestPlanGen's exemplar lane feeds whole
   plans into the prompt under `exemplarCap` (20 000 chars) — a
   large plan truncates blind, cutting mid-case, because nothing
   knows where cases begin and end.
3. **Humans and the Q&A agent.** "Do we already have a case for
   splitting a spanning line event?" is answered today by opening
   decks one at a time. The `_Index.md` browse pages (v1.35) list
   documents; no surface lists cases.

The raw material is already there — this plan is an *indexing* move,
not an extraction one. Since sweep v1.25/v1.29 (TC-1..TC-3) the
presentation layer (`local/lib/presentation.mjs` `caseHeadings`)
deterministically segments test-plan deck sidecars into per-case
sections:

```
## Case 2: Positive - Non Spanning Line Event <!-- slide 5 -->
### Loop
**Loop – Split measure: 20**
| ... case tables ... |
![figure](../media/doc12_slide5_fig1.svg)
```

What is missing is making those sections QUERYABLE: rows in a list,
keyed to the plan's Doc Index row, carrying classification, scenario,
and per-case issue references — so coverage, generation, and browse
can all join on them.

## Design decisions

**D1 — parse the sidecar body, not the source file.** The case
segmenter reads the rendered sidecar body (the text below the
metadata seam), not raw pptx/docx. One seam instead of N extraction
lanes; `caseHeadings` already did the hard part and is gate-pinned;
the backfill needs no re-extraction, no source download, and no AI
spend; and a `--reformat`-improved corpus re-cases for free.
Consequence: the parser is COUPLED to the presentation layer's
emission — held together the same way the DF-7 style invariants are,
by shared fixtures asserted from both sides (see Gates).

**D2 — deterministic by decision, like caseHeadings itself.** No AI
call anywhere in this plan. A plan whose body shows no recognizable
case structure yields ZERO rows plus a run-summary counter
(`plans_caseless`) — never guessed rows. Rationale recorded here as
it was for v1.25: the structure IS stated by the document, an LLM
pass would put spend and nondeterminism into the no-AI reformat
path, and wrong case rows are worse than none because coverage joins
would trust them.

**D3 — two case shapes, one parser.** The corpus holds (and will
increasingly hold) two plan formats:

| Shape | Where it comes from | Case marker |
|---|---|---|
| Deck-derived | pptx plans through the sweep | `## Case N: …` / bare `## Case N` with `<!-- slide K -->` provenance comment; `### <scenario>` beneath; `<name> test cases` divider sections |
| Draft-style | finalized TestPlanGen drafts uploaded to the library (docx → sidecar), and any hand-authored plan in the team format | `### TC-P<n>` / `### TC-N<n>` headings — the exact `draftlint.mjs` contract regex (`^### (TC-[PN]\d+)`) |

`caseindex.mjs` recognizes both; a document mixing shapes takes
whichever yields more cases (counter `cases_shape_mixed` when both
match, so drift is visible). Author-titled H2 sections between case
sections attach to no case.

**D4 — replace-set identity, not stable case identity.** Case
numbers renumber between plan revisions and slides move; inventing a
durable per-case identity would be false precision. Instead every
(re)index of a plan REPLACES its full case-row set: compute fresh
cases, fetch the doc's existing rows (indexed lookup), diff by
`CaseKey = {docRowId}|{ordinal}`, create/update/delete. Idempotent,
self-healing on reindex, and ghost-safe: a Doc Index row going
`Archived` deletes its case rows in the same reconciliation pass the
sweep already runs for sidecars. Nothing else in the pipeline may
hold a Test Cases row id.

**D5 — per-case issue references.** Each case's text slice runs
through the same issue-id patterns RegexExtract mints Doc IDs from
(url / `repo#number` / hashtag forms; `sweep.defaultRepo` for bare
`#n`). Stored denormalized on the case row (`IssueRefs`, semicolon
`repo#number` list) — this is the column that turns the gap report
from adjacency into a real matrix: `story's issue ids ∩ case
IssueRefs` is case-level coverage, computed with zero new AI and
zero new edges. Doc Links stays untouched: case↔story relations are
computed on read from this column, the same never-store-keyword-edges
posture as RelatedRank.

**D6 — local stack only.** The cloud flows are OFF and stay
untouched (no flow, script paste, or `Config.PromptVersion` change
anywhere in this plan). SharePoint's role is storage: one new list.

## The seventh list — `Test Cases` (`schemas/SPList_TestCases.csv`)

| Display Name | Internal | Type | Details |
|---|---|---|---|
| Title | Title | Single line (native) | The case heading text, cleaned, truncated 255 |
| Document | Document | Lookup | Target: Doc Index, show Title; **INDEXED** — create via CLASSIC list settings (the standing modern-lookup quirk) |
| CaseKey | CaseKey | Single line of text | `{docRowId}\|{ordinal}` — **INDEXED**; replace-set diff key |
| CaseNo | CaseNo | Single line of text | The plan's own number: `2` (deck) or `TC-P4` (draft-style); display, never identity |
| SlideNo | SlideNo | Number | 0 decimals; from the `<!-- slide K -->` comment; empty for draft-style |
| Classification | Classification | Choice | `Positive; Negative; Unspecified` — from the heading (deck) or the TC lane letter (draft) |
| Scenario | Scenario | Single line of text | The `### <scenario>` line (deck) / heading remainder after the TC id (draft) |
| CaseText | CaseText | Multiple lines of text | PLAIN text; the section body, tables/figure links stripped, capped 4000 chars — skim/search aid, like TextPreview |
| IssueRefs | IssueRefs | Single line of text | Semicolon-joined `repo#number` found in this case's own text; empty = none |
| Anchor | Anchor | Single line of text | The sidecar heading's GitHub-style anchor slug — deep link target `{TextFileUrl}#{Anchor}` |
| SweptOn | SweptOn | Date and Time | Include time; when this row was last written |

Since **caseindex v1.1–v1.2** (2026-09-05, after the first live
backfill) the list carries nine more per-case columns — `Shape`
(deck/draft), `FigureCount`/`TableCount`/`StepCount`, `RouteRefs`
(distinct fixture route ids, prose + table cells), the draft
contract's `ExpectedResult`/`TraceText` lines, and the v1.2 tag
columns `Tools`/`Keywords` (canonical names from the curated
Keywords vocabulary, matched word-boundary against the case's own
text plus the plan title — alias rows fold to canonicals, so weekly
curation merges sharpen case tags; flat '; '-joined columns by
decision, never junction rows) — and the explicit `repo#n` issue
form requires 3–5 digits with fenced code excluded from every scan
(a live Arcade expression had minted a phantom `#0`). The CSV is
authoritative for column details.

Denormalized plan metadata (surface, products, release) is
deliberately ABSENT — it lives one lookup away on the Doc Index row
and would go stale here; list views that need it use the lookup's
projected fields.

Volume check: decks run to ~50 cases; a few hundred plans keeps the
list well under every SharePoint threshold, and the per-doc
replace-set touches ≤ ~50 rows a night in the worst case — noise
next to the sweep's existing write load. `exportLists` (v1.32)
backs the new list up with the others once its GUID is in config.

## Module and integration points

**`local/lib/caseindex.mjs`** (new, pure — the bodyindex/draftlint
mold):

- `extractCases(bodyText, { defaultRepo, caseTextCap }) →
  { cases, shape: "deck"|"draft"|"none", mixed }` — deterministic,
  no I/O; each case `{ ordinal, caseNo, slideNo, classification,
  scenario, title, text, anchor, issueRefs }` (shape and the mixed
  flag feed the run-summary counters directly).
- `diffCaseRows(existingRows, fresh) → { create, update, delete }` —
  the replace-set planner, pure so the gate can table-test it.

**`local/sweep.mjs`** grows a `syncCases(row, bodyText)` step called
from the two places that finish a sidecar body — `indexDoc` and the
`--reformat` pass — for rows whose DocKind is in
`sweep.caseIndex.kinds` (default `["Test Plan"]`), plus:

- ghost pass: case-row deletion when a doc row archives;
- `--recase`: the backfill flag — walk Indexed rows of those kinds,
  read each synced sidecar (Graph mirror under `remoteFiles`), run
  the replace-set. No AI, no re-extraction, no sidecar writes;
  dry-run default prints the planned create/update/delete counts.
- run-summary + status-page counters: `cases_upserted`,
  `cases_removed`, `plans_caseless`, `cases_shape_mixed`.

**Fail-soft wiring** (the Issue Refs / gantt precedent): missing
`sharePoint.lists.testCases` GUID ⇒ one loud stderr note per run and
counters stay zero — the sweep never fails a document over its case
rows; a case-write failure lands in the run summary, not in the doc
row's LastError.

**Config** (`config.sample.json`):

```
"sweep": {
  "caseIndex": { "kinds": ["Test Plan"], "caseTextCap": 4000 }
},
"sharePoint": { "lists": { "testCases": "<GUID — Local_Setup §N>" } }
```

Absent section = feature off (dry parity with today).

## Consumer surfaces

1. **`_Case Catalog.md`** (indexpages v-next): one library-root
   browse page, cases grouped by plan, each row
   `[Case 2: Positive — Loop](<Test Plans/…__doc12.md#anchor>) |
   issues | scenario`, per-plan Positive/Negative counts, rebuilt
   after every live full sweep from rows the run already holds. The
   Q&A agent gains the cross-plan view for free — the page lives in
   the sidecar library it already grounds on, and unreviewed drafts
   stay outside it as ever.
2. **Gap report v2** (`testplangen.mjs --gap-report`): per-story,
   alongside today's adjacency verdict, the case-level truth —
   `cases_tracing` (story's issue ids ∩ case IssueRefs, with the
   matching case links) and per-plan case counts. A story "covered"
   by a plan with zero tracing cases is the exact gap the current
   report cannot see. Read-only over the new list, like every list
   this job touches.
3. **Status page**: the three counters, so a caseless-plans spike
   (format drift breaking the parser) is visible the night it
   happens — the loud-failure posture of `figures_ocr_off`.

Queued, NOT in this plan's phases (each changes model input or
mints edges, so each is its own decision later): case-aware
exemplar trimming (cut whole cases, most-relevant-first, when a
plan overflows `exemplarCap`); stored story↔case coverage edges;
case-level embedding relatedness.

## Versioning and rollout

- **No `Config.PromptVersion` bump, no backfill through the AI
  path**: sidecar format is unchanged — this plan writes list rows
  and `_`-pages only. Rollout = create the list (classic-lookup
  rule), add the GUID, run `--recase --live` once (minutes, zero AI
  spend), and the nightly sweep keeps it converged.
- **CaseIndexVersion** joins STATUS's component table and bumps like
  a script version: a parser change re-flows the corpus via
  `--recase`, recorded in `local/CHANGES.md`. Never touches prompts.
- Rollback = ignore the list (remove the GUID); nothing else in the
  pipeline reads it in phases 0–2, and phase-3 consumers degrade to
  today's behavior when it is absent or empty.

## Gates

Two homes: `local/harness/check_caseindex.py` (standalone, the
per-component-gate mold — BUILT, 45 checks) owns the parser;
`check_local_sweep.py` (the 211-check suite) gains the
sweep-integration legs with phase 2. All CI:

- **Parser legs** (built): fixtures for both shapes; a checklist
  slide (two+ numbered lines — never a case, the caseHeadings
  rule); a prose plan with no structure ⇒ zero cases, shape
  `"none"`; per-case issue refs incl. the bare-`#n` defaultRepo
  form and claimed-number suppression; anchor slugs against the
  fixture body's actual headings; replace-set planner table tests;
  caps. The deck fixture's body is produced by
  `caseHeadings(tidyBody(...))` itself in the same run — the D1
  coupling pinned at module level.
- **Coupling leg, sweep level** (built, phase 2): the case rows a
  mock-Graph sweep run writes come from the body that same run
  rendered (a case slide planted in the existing Alpha fixture) —
  `caseHeadings` drifting its emission breaks the leg, not the
  corpus.
- **Replace-set legs**: mock-Graph diff — unchanged plan ⇒ zero
  writes; renumbered cases ⇒ update-in-place by ordinal; shrunk plan
  ⇒ stale rows deleted; archived doc ⇒ full deletion; missing GUID ⇒
  loud skip, doc row still indexes.
- **Consumer legs**: `_Case Catalog.md` grouping/links; gap-report
  `cases_tracing` on a story fixture whose issue id one case states.

## Phases

**Phase 0 — schema + plumbing** (BUILT).
`schemas/SPList_TestCases.csv`, config keys + sample, Local_Setup
§12 list-creation section (classic lookups). No behavior change
with the section absent; the fail-soft missing-GUID wiring and its
leg move to phase 2 with the code they guard.

**Phase 1 — the parser** (BUILT). `local/lib/caseindex.mjs`
(`extractCases`, `caseIssueRefs`, `toRowFields`, `diffCaseRows`),
both shapes, issue refs, anchors. Gate: `check_caseindex.py` parser
+ module-level coupling + planner legs, 45/45, CI. Still no writes.

**Phase 2 — sweep integration** (BUILT — sweep v1.42). `syncCases`
in indexDoc + `--reformat`, ghost pass, `--recase` backfill,
counters + status-page bullet, missing-GUID fail-soft (`--recase`
without the GUID refuses, naming the fix). Gate:
`check_local_sweep.py` 230/230 — case-index / idempotency /
reformat-no-churn / recase / missing-GUID legs. The first live
`--recase` run is this phase's tenant exit check (list created per
Local_Setup §12, counts recorded in CHANGES, the gantt-first-run
mold) — queued behind auth restore, STATUS action 12.

**Phase 3 — consumers** (BUILT — sweep v1.43 / TestPlanGen v2.29).
`_Case Catalog.md` (indexpages v1.1: grouped by plan, classification
counts, anchor deep links; rebuilt by live full sweeps and live
`--recase`, dry runs never write it, `sweep.indexPages: false`
disables); gap-report case tracing (testplangen.mjs v1.8: the
covered-by-adjacency-only section, per-plan case counts, the
flagged gap-with-cases line, byte-identical degrade without the
list); status-page counters (shipped with phase 2); smoke row 9 in
`QA_Smoke_Questions.md` v1.1. Gates: catalog + recase-rebuild legs
in `check_local_sweep.py` (235/235), tracing + degrade legs in
`check_testplangen.py` (141/141).

Each phase: `local/CHANGES.md` entry + STATUS table row; phases 0–1
are pure-repo work, safe while the pipeline is down (open action
12); phase 2's live backfill waits on auth restore like everything
else.
