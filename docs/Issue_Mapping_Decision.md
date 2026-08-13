# Decision — where the issue→story mapping lives

**Decided 2026-08-13, from live TestPlanGen agent triage.** The
devtopia-issue → user-story mapping's system of record is **the Gantt
workbook**, fed into the lists by **flow #2 (Gantt → Issue Refs)** —
not per-deck authoring practice, not hand-maintained rows. This note
records the finding that forced the decision, the rationale, and the
design constraints flow #2 inherits from it. Nothing here changes any
deployed artifact; flow #2 stays queued work until built.

## The finding (why a decision was needed)

A live lookup for devtopia issue 6758 (`#6758` in the TestPlanGen
agent) returned no story, while the same story generated fine by doc
id. Run-history triage showed the issue lane working exactly as
designed: the only Doc IDs row for 6758 pointed at the **Gantt
schedule doc** (the sweep minted it from the URL in the Gantt's
extracted text), and the lookup's User-Story kind-filter correctly
rejected it. A freshly swept user-story sidecar (doc 91, v2.0 format)
then confirmed the gap is systemic, not one-off: `issues: []` —
the story decks are authored WITHOUT devtopia links (the Assignment
slide template carries story points and assignments, no issue URL),
so RegexExtract can never mint a story-pointing Doc IDs row, and the
`#N` lookup lane is structurally empty for every story authored in
the current template.

Meanwhile the mapping demonstrably exists and is maintained: every
issue row in the Gantt carries the issue URL AND a **Link to User
Story** column, kept current as part of normal iteration planning.

## The decision, and why

Three candidate homes for the mapping were on the table:

1. **Authoring practice** — paste the devtopia URL into each story
   deck; the sweep's existing RegexExtract lane mints the row.
2. **Manual Doc IDs rows** — hand-add rows (`Source: manual`).
3. **The Gantt via flow #2** — harvest issue → story-link pairs from
   the schedule workbook the team already maintains.

**Chosen: 3.** The principle: the mapping should live where the team
already maintains it, and the system should read it from there —
never depend on a second, parallel discipline staying in sync.

- The Gantt is already the enforced source of truth. Iteration
  planning fills the Link-to-User-Story column as a matter of
  process; no new habit is required and no silent decay follows when
  a habit lapses. Option 1 fails exactly the way the finding shows:
  invisibly, story by story, with nothing flagging the gap.
- It is retroactive. One feeder pass covers every story the Gantt
  names — past iterations included. Option 1 covers only future
  decks plus whatever gets hand-edited.
- It is deterministic and self-healing. The Gantt reindexes on every
  edit (SourceModified moves constantly), so the feeder re-runs on
  fresh data; `IdKey`/`IssueKey` dedup makes re-feeding idempotent.
- The architecture anticipated it. `schemas/SPList_IssueRefs.csv`
  only makes sense Gantt-fed (`IterationLabel`, `StatusSummary`,
  `DoneFlag`, `SourceDocument` → the schedule doc), and flow #2 is
  the queued feeder in README / SP_Adaptation_Notes. This decision
  promotes that queued design from "an option" to "the plan".

Options 1 and 2 are demoted to supplements, not competitors:

- A devtopia link IN a story deck remains welcome — the RegexExtract
  lane keeps working, and `IdKey` dedup means the two lanes never
  double-mint. It is no longer the thing the lookup depends on.
- Manual rows (`Source: manual`) are the sanctioned STOPGAP until
  flow #2 exists: for a story needed in chat today, add a Doc IDs
  row by hand — Document = the story's Doc Index item, Repo,
  IssueNumber, IdKey `{DocItemId}|{repo}#{number}`.

## Constraints flow #2 inherits from this decision

Recorded now so the build honors the finding that motivated it:

- **It must mint story-pointing Doc IDs rows, not just Issue Refs
  rows.** The lookup lane (`StoryLookupFlow` issue lane) queries Doc
  IDs by `IssueNumber` and kind-filters to User Story — Issue Refs
  alone would not make `#N` resolve. Per Gantt row: upsert the Issue
  Refs row by `IssueKey` (iteration facts), resolve the
  Link-to-User-Story URL to a Doc Index row, and query-then-write a
  Doc IDs row against `IdKey` (Document = the story, not the Gantt).
- **Resolution is by DocKey**: server-relative path, lowercased,
  query string stripped — the existing identity key. A link whose
  target has no Doc Index row yet degrades to the Issue Refs row
  only (the story simply is not indexed yet); no fabricated rows.
- **Provenance needs a value**: the Doc IDs `Source` choice column
  (`url; filename; hashtag; titlematch; manual`) gains a `gantt`
  choice — a one-line `schemas/SPList_DocIds.csv` addition in flow
  #2's window, so feeder-minted rows are distinguishable from
  document-embedded references and from stopgap manual rows.
- **Read-only over its source**: the feeder reads the Gantt's
  already-extracted text (workbookdump sidecar) — no new connectors,
  no Office Script, the standing zero-new-connectors rule.

## What this does NOT change

No flow, schema file, prompt, script, or agent artifact changes with
this note. The Issue Refs list stays empty until flow #2 is built.
The TestPlanGen agent's coaching for a `none` lookup (add the
reference, wait for the sweep) stays accurate in the interim — the
manual-row stopgap above is the faster path when it matters.
