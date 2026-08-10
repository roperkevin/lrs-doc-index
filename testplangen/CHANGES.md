# TestPlanGen v1.2 — import package for the flow

The flow now ships as an importable package,
`testplangen/TestPlanGen_v1_0.zip` (My flows → Import → Import
package (Legacy)), alongside the build guide. The package payload,
`testplangen/flow/v1_0/definition.json`, is checked in beside it —
byte-identical to the zip's copy, the `flow/` provenance convention —
implementing `TestPlanGen_Setup.md` §3's G0–G13 exactly (58 actions:
trigger + Config/variables + Try scope with guard, sidecar fetch,
related-line slice, neighbor digest loop, exemplar fallback query,
exemplar fetch loop, prompt call, fail-closed marker slice, banner,
draft write + Catch scope + Gen_summary).

**Authored, not exported.** Like the `flow/` zips, this package is a
re-cut of the sweep's package skeleton (manifest/maps minus the Excel
connector — this flow runs no Office Scripts), but its
`definition.json` was written from the setup guide rather than
exported from a built flow, and two bindings intentionally need
post-import work (guide §3 Path A, checks I1–I4): the AI Builder
`recordId` ships as a placeholder (the prompt is minted per-tenant),
and the "For a selected item" trigger shape should be
designer-verified on first import — if the portal rejects the package,
Path B (build by hand) is the unchanged fallback and the rejection
gets recorded here. Once a tenant has imported and smoked it, an
export from the live flow supersedes the authored file (re-cut
mechanics: swap `definition.json` into the zip's
`Microsoft.Flow/flows/<guid>/` entry; manifest and maps are stable).

Import validation and the §5 smoke suite are the real gate — record
the first import here:

| Date | Tenant | Imported cleanly | I1–I4 done | Smoke rows passed (of 8) |
|---|---|---|---|---|
| — | — | — | — | — |

| Piece | Version | Where |
|---|---|---|
| Flow import package | **v1.0** | `testplangen/TestPlanGen_v1_0.zip` |
| Flow definition (provenance) | v1.0 | `testplangen/flow/v1_0/definition.json` |
| Prompt / setup guide / smoke / agent file set | unchanged (v1.0 / v1.1) | `testplangen/` |
| Everything else in the bundle | unchanged | — |

Scope note: the package carries the **standalone v1.0 flow** (list-
menu trigger, full body). The v1.1 child-flow trio cannot ship in a
legacy flow package — child flows exist only inside Dataverse
solutions — so agent deployments still apply
`testplangen/agent/Agent_Setup.md` §1 after importing, exactly as
after a hand build.

Docs note (post-v1.2, pre-first-deployment): the Q&A agent
(`agent/QA_Agent_Setup.md`) is OPTIONAL and independent of this
component — nothing in TestPlanGen depends on it. All Q&A-agent
references across `testplangen/` were made conditional to match: the
generator agent's redirect messages tolerate its absence, flow-smoke
row 7 is marked skip-until-deployed (the non-ingestion guarantee is
structural — drafts sit outside the sidecar library regardless), and
agent-smoke row 5 is clarified to test this agent's refusal, not the
Q&A agent. The agent file set was amended before any tenant imported
it, so TestPlanGenAgentVersion stays v1.0.

---

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
