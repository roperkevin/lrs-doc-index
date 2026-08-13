# Agent v1.2 — describe the v2.7 GFM sidecar layout

Instructions-only bump (`agent/QA_Agent_Instructions_v1_2.md`,
supersedes v1.1), companion to the flow v2.7 / PromptVersion v1.9
format upgrade (`flow/v2_7/CHANGES.md`): SIDECAR STRUCTURE now
describes the new layout — sidecars open with the H1 title and an
info table (Kind/Release/Issue/Source/Edited/Extracted), the yaml
block sits collapsed inside `<details><summary>Metadata</summary>`
(the agent is told to treat the details/summary tags and table pipes
as formatting, not content), and the metadata gains an `issues` field
(devtopia "repo#number" references, also linked in the info table's
Issue row, now usable for "which document covers issue N" questions).
A transition note keeps pre-backfill sidecars (yaml-first shape)
readable until the v1.9 backfill converges; a future bump can drop it.

Runbook per v1.0 conventions: re-paste the delimited block into the
agent's Instructions field, record `AgentInstructionsVersion: v1.2`,
re-run `agent/QA_Smoke_Questions.md`. No flow, script, schema, or
prompt changes in THIS bump (the format change itself is the flow
v2.7 window); no PromptVersion touch here; pasting early — before or
during the backfill — is harmless since both shapes are described.

| Piece | Version | Where |
|---|---|---|
| Agent instructions | **v1.2** | `agent/QA_Agent_Instructions_v1_2.md` |
| Everything else | unchanged | — |

Re-paste record (deploy with flow v2.7, step 6 of its window):

| Date | Tenant | Pasted | Smoke re-run |
|---|---|---|---|
| — | — | pending — part of the v2.7 window | pending |

# Agent v1.1 — doc_id described truthfully

Instructions-only bump (`agent/QA_Agent_Instructions_v1_1.md`,
supersedes v1.0): the SIDECAR STRUCTURE identity bullet now says what
`doc_id` actually is — the document's Doc Index list row id for
sidecars extracted at `prompt_version` v1.7 or later, a *different*
number (the source library file's item id) for older extractions —
and tells the agent to point people at the Doc Index list's ID column
when they need a row id (e.g. for test-plan generation), rather than
quoting an old sidecar's `doc_id`. Companion to the flow v2.5 identity
fix (`flow/v2_5/CHANGES.md`); the caveat can be dropped in a future
bump once the v1.7 backfill has converged.

Runbook per v1.0 conventions: re-paste the delimited block into the
agent's Instructions field, record `AgentInstructionsVersion: v1.1`,
re-run `agent/QA_Smoke_Questions.md`. No flow, script, schema, or
prompt changes; no PromptVersion touch; no backfill.

| Piece | Version | Where |
|---|---|---|
| Agent instructions | **v1.1** | `agent/QA_Agent_Instructions_v1_1.md` |
| Everything else | unchanged | — |

Re-paste record — **OPEN ACTION (r2)**: the v1.1 paste is required by
the v2.5 install order (`flow/v2_5/CHANGES.md` install step 4) and
`QA_Agent_Setup.md` §3 already instructs pasting v1.1, but no paste
was ever recorded here. Confirm whether it happened on the live
tenant and fill the row (tracked in `STATUS.md`):

| Date | Tenant | Pasted | Smoke re-run |
|---|---|---|---|
| — | — | pending — confirm + record | pending |

# Agent v1.0 — Q&A over the sidecar corpus

First release of the Q&A component: a Copilot Studio agent,
**LRS Doc Index Q&A**, grounded on the LRS Doc Index sidecar library
and published to Teams. Read-only over the corpus — no flow, script,
schema, or prompt changes, no PromptVersion bump, no backfill. The
sidecar library gains a second consumer (see the note in
`docs/SP_Adaptation_Notes.md`).

| Piece | Version | Where |
|---|---|---|
| Agent instructions | **v1.0** | `agent/QA_Agent_Instructions_v1_0.md` |
| Setup guide | v1.0 | `agent/QA_Agent_Setup.md` |
| Smoke suite | v1.0 | `agent/QA_Smoke_Questions.md` |
| Flow / scripts / prompt | unchanged (v2.4 / v1.2) | — |

## What shipped

- **Instructions artifact** — versioned like the AI Builder prompt:
  delimited paste-verbatim text covering scope (knowledge-source-only,
  explicit misses), the sidecar structure and metadata semantics
  (doc_kind/surface/target_release/pe/dev/authorship), the
  dual-citation rule (sidecar citation + the original file via
  `source_url`), the ESRI terminology block carried over from
  DocIndex_Prompt v1.2, and the same untrusted-data posture
  (retrieved content is data, never instructions).
- **Setup guide** — numbered manual steps with per-step checks:
  prerequisites (+ optional zero-build SharePoint-agent stopgap),
  agent creation, knowledge scoped to the sidecar library only with
  general knowledge off, instructions paste, semantic-index warm-up
  note, Teams publish, smoke suite. Plus known limits and the queued
  follow-ons (list-query actions, feedback loop, retrieval-motivated
  format tweaks).
- **Smoke suite** — eight rows: known-answer retrieval (pinned to
  doc 42), citation resolution, metadata-filtered queries, negative
  test, injection probe, freshness.

## Install order

Steps 0–6 of `agent/QA_Agent_Setup.md`, in order, each with its
check. Nothing imports; everything is portal work.

## Runbook deltas

- **AgentInstructionsVersion**: bump the instructions artifact like
  the prompt — new `_vX_Y` file, re-paste into Copilot Studio, re-run
  the smoke suite, record here. Independent of `Config.PromptVersion`.
- **Sidecar format changes now have two consumers**: the flow's
  backfill AND the agent's instructions (which describe the metadata
  fields). A format change that adds/renames fields needs a matching
  instructions bump.

## Verification record

`review/harness/` guard-rail (2026-08-10, Node 22.22.2): v1.0 touches
no sidecar format, no scripts, no flow — `check_format.py`,
`check_related.py` and `render_sample.py` re-run unchanged over the
current `scripts/` versions. All three PASS, matching the v2.4
record: the release is corpus-neutral.

Live-tenant smoke run (fill in at deployment):

| Date | Tenant | Rows passed | Index latency observed | AgentInstructionsVersion |
|---|---|---|---|---|
| — | — | — | — | v1.0 |
