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
