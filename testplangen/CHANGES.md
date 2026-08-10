# TestPlanGen v1.1 — importable Copilot Studio front-end

The queued "Copilot Studio front-end" follow-on, delivered as an
**importable agent file set**: `testplangen/agent/TestPlanGenAgent/`
defines the **LRS Test Plan Generator** agent (identity +
instructions, settings, connection references, and two adaptive-dialog
topics) for import via the Copilot Studio VS Code extension —
clone-overlay-push — with a documented portal-paste fallback for
schema drift. The agent is a thin front door: it collects a story's
Doc Index item id in chat, confirms, invokes the generation flow, and
relays the draft location with the unreviewed/[VERIFY] reminder. NO
knowledge sources, general knowledge OFF — corpus questions redirect
to LRS Doc Index Q&A; the agent never drafts content in chat.

Because an agent invokes flows only through an agent-flow trigger and
a flow has exactly one trigger, v1.1 also specifies the **child-flow
restructure** (`testplangen/agent/Agent_Setup.md` §1): the v1.0 flow
body becomes `TestPlanGenCore` (manual trigger, input `StoryId`; the
two in-Try Terminates become Respond-with-Status so callers can relay
guard/parse messages), with two thin parents — the existing list-menu
`TestPlanGen` (Automate-menu entry unchanged) and the new
`TestPlanGenAgentFlow` (agent trigger → child → Respond
`Status`/`DraftUrl`/`GenSummary`, error path included). One body, two
front doors, no duplication.

| Piece | Version | Where |
|---|---|---|
| Agent definition file set | **v1.0** | `testplangen/agent/TestPlanGenAgent/` |
| Agent import + wiring guide (incl. child-flow restructure, 6-row smoke suite) | v1.0 | `testplangen/agent/Agent_Setup.md` |
| Generation prompt / flow guide / smoke suite | unchanged (v1.0) | `testplangen/` |
| Sweep flow / scripts / prompt / schemas / sidecars / Q&A agent / curation | unchanged | — |

## Runbook deltas (v1.1)

- **TestPlanGenAgentVersion: v1.0** — the agent file set bumps like
  AgentInstructionsVersion: edit the files under
  `testplangen/agent/TestPlanGenAgent/`, re-import (or re-paste),
  re-run the §5 smoke suite, record here. NEVER bump
  `Config.PromptVersion`; a TestPlanGenPromptVersion bump is
  independent too (prompt and agent version separately).
- **The flow contract**: input `StoryId`, outputs
  `Status`/`DraftUrl`/`GenSummary` bind the topic to the flows —
  change one side, change both, re-smoke rows 1 and 3.

Live-tenant smoke run (fill in at deployment; suite =
`testplangen/agent/Agent_Setup.md` §5):

| Date | Tenant | Rows passed (of 6) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.0 |

---

# TestPlanGen v1.0 — user story → reviewed test-plan draft

First release of the test-plan-generation component: an on-demand
Power Automate flow, **TestPlanGen**, run from the Doc Index list's
Automate menu on a selected User Story row. It gathers the story's
sidecar, the neighbors named by the sidecar's machine-readable
`related:` line (adjacent stories become a context digest; related
Test Plans become style/coverage exemplars, with an exact
`DocKind eq 'Test Plan'` query as fallback), makes ONE AI Builder
call, and writes a timestamped markdown draft to
**Shared Documents/Test Plan Drafts/** — outside the LRS Doc Index
library, so the Q&A agent never ingests unreviewed drafts. A PE
reviews (every case carries a mandatory Trace line; gaps surface as
`[VERIFY]` items), finalizes into the team's normal format, and
uploads to the source library — where the nightly sweep indexes the
finished plan and links it back to its story. This is the system's
first generative surface; it closes its loop entirely through the
existing pipeline.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.0** | `testplangen/TestPlanGen_Prompt_v1_0.md` |
| Build + deploy guide | v1.0 | `testplangen/TestPlanGen_Setup.md` |
| Smoke suite | v1.0 | `testplangen/TestPlanGen_Smoke.md` |
| TestPlanGen flow | built from the guide (no definition.json — new flows have no package skeleton; provenance export queued) | — |
| Sweep flow / scripts / prompt / schemas / sidecars / agent / curation | unchanged (v2.4 / v1.2 / v1.0 / v1.0) | — |

## What shipped

- **The prompt** — StoryMeta + StoryText + RelatedDigest +
  ExemplarText in; a complete markdown draft out, between
  `<<<DRAFT BEGIN>>>` / `<<<DRAFT END>>>` markers. Marker-sliced
  markdown is a deliberate, documented deviation from the F3 JSON
  brace-slice: JSON-escaping a multi-page document makes escaping
  errors the dominant failure mode, and the marker slice is the same
  `indexOf`/`lastIndexOf` logic with different sentinels — failing
  CLOSED (no markers → Terminate, nothing written) where the JSON
  prompts degrade to empty. Grounding rules: every case traces to a
  story statement or exemplar pattern (mandatory **Trace:** lines),
  tools never invented, surface/release copied verbatim, missing
  info becomes `[VERIFY]` items. DocIndex v1.2 untrusted-data
  posture over all three document-derived inputs, marker-fenced at
  the prompt's end.
- **The flow** — "For a selected item" on Doc Index: guard (Indexed
  User Story with a sidecar), sidecar fetch, line-slice parse of the
  `related:` JSON (degrades to no neighbors, never errors),
  per-neighbor digest lines (capped, quote-stripped — the
  `Why_capped` treatment), exemplar selection preferring related
  Test Plans with an exact-query fallback (the first delivered
  instance of the "exact list query" follow-on queued in
  `agent/QA_Agent_Setup.md`), capped context assembly, one prompt
  call, fail-closed marker slice, provenance banner (with
  story-truncation flag), timestamped draft write, trimmed Catch
  scope, F11-style `Gen_summary`. Read-only over every list; the
  single file write lands outside both the sweep's source library
  and the agent's knowledge source.
- **Review loop** — draft → PE review (Trace verification, `[VERIFY]`
  resolution) → finalize to pptx/docx → upload to the source library
  → nightly sweep indexes it as a Test Plan and RelatedRank links it
  back to the story. No new cataloging surface; misfiled drafts are
  inert (`.md` has no extraction lane).
- **Deferred by decision** — a Copilot Studio conversational front
  end (rides the queued list-query actions; the flow stays the
  single implementation), provenance export, docx conversion of the
  draft, and the IssueRefs-driven coverage matrix once flow #2
  exists. All specified in the guide's Queued follow-ons.

## Install order

`testplangen/TestPlanGen_Setup.md` §§1–3 in order: drafts folder →
prompt → flow, then the §5 smoke suite before first real use. No
schema work, no script pastes, no sweep edits — nothing to
re-import.

## Runbook deltas

- **TestPlanGenPromptVersion**: bumps like CurationPromptVersion —
  new `testplangen/TestPlanGen_Prompt_vX_Y.md`, re-paste into
  AI Builder, re-run the smoke suite, record here. NEVER bump
  `Config.PromptVersion` for this — nothing in test-plan generation
  changes the sidecar format or reindexes the corpus.
- **Drafts folder**: `Shared Documents/Test Plan Drafts/`,
  timestamped files, deleted by hand after finalize/abandon; a
  re-run never overwrites an existing draft.

## Verification record

Corpus-neutral by construction: no scripts, no sweep flow change, no
sidecar format change, no schema change, no agent-instructions
change — the local harness (`check_format.py` / `check_related.py` /
`render_sample.py`) is unaffected; see agent v1.0's record in
`agent/CHANGES.md` for the current PASS baseline (2026-08-10).

Live-tenant smoke run (fill in at deployment; suite =
`testplangen/TestPlanGen_Smoke.md`):

| Date | Tenant | Rows passed (of 8) | TestPlanGenPromptVersion |
|---|---|---|---|
| — | — | — | v1.0 |
