# Agent v2.0 — the catalog answers exactly (tools + feedback loop)

Component release: both follow-ons queued since v1.0 ship — **LRS Doc
Query** (an agent flow querying the Doc Index list with real OData;
the "lists are not knowledge" limit closes: "list ALL test plans for
3.8" is now deterministic, complete, and carries row ids) and **LRS
Log QA Feedback** (misses and wrong answers land, with the asker's
consent, in a new **QA Feedback** list for librarian triage — feeding
keyword-alias curation and doc-upload nudges). Both are model-invoked
tools, so the agent moves to generative orchestration.
Corpus-neutral: no flow, script, schema-of-the-six, or prompt
changes; no `Config.PromptVersion` touch; no backfill.

| Piece | Version | Where |
|---|---|---|
| Agent instructions | **v1.2** | `agent/QA_Agent_Instructions_v1_2.md` |
| Setup guide | **component v2.0** (§7–§10 appended) | `agent/QA_Agent_Setup.md` |
| Smoke suite | **v1.1** (rows 9–13; row 6 amended) | `agent/QA_Smoke_Questions.md` |
| QA Feedback list schema | new | `schemas/SPList_QAFeedback.csv` |
| Flow / scripts / prompt | unchanged | — |

## What shipped

- **Generative orchestration** (§7) — required for model-chosen
  tools; the general-knowledge-OFF check re-runs after the switch
  (the toggle lives on the page the switch redraws).
- **LRS Doc Query** (§8) — agent flow built inside Copilot Studio
  (the Agent_Setup §1c precedent). Five optional Text inputs
  (`DocKind`/`Surface`/`TargetRelease`/`Person`/`TitleContains`), an
  apostrophe-escaped composed OData filter over Doc Index (`ID gt 0`
  base + conditional clauses; Person matches PE OR Dev by substring),
  newest-first, QueryTop 60 with announced truncation; outputs
  `Count`/`Rows` (markdown roster with source links + row ids) /
  `Truncated`, plus a failure respond. Doubles as the title→id
  resolution queued in `testplangen/agent/Agent_Setup.md` — one
  implementation, two agents.
- **Feedback loop** (§9) — QA Feedback list (plain columns, no
  lookups — modern creation fine; a list, so it can never enter the
  library-scoped knowledge), the **LRS Log QA Feedback** agent flow
  (Question verbatim, Kind mapped defensively to
  miss/wrong-answer/suggestion, Status `New`), and the human triage
  loop: vocabulary gaps → Keywords aliases (curation queue), missing
  docs → owners, format-fixable misses → the PromptVersion-bumped
  path only.
- **Instructions v1.2** — new TOOLS section (when to query vs
  retrieve: the tool answers WHICH, sidecars answer WHAT; exact input
  values; present count + links + row ids; announce truncation;
  consent-gated logging), the SCOPE miss rule now ends with the
  feedback offer, row ids from Doc Query marked safe for test-plan
  generation (the doc_id caveat stays until the v1.7 backfill
  converges), and the untrusted-data posture extended verbatim to
  tool results.
- **Smoke v1.1** — rows 9–11 (exhaustive roster vs a manual list
  filter; exact count with cap honesty; title→row-id lookup), rows
  12–13 (consent honored both ways), row 6 gains the offer, triage
  gains the tools clause.

## Install order

Fresh tenant: setup §0–§3, §7–§9, §4–§6. Existing v1.x tenant: §10
(orchestration → tools → feedback → paste v1.2 → full smoke), one
session. The v1.2 paste **supersedes the v1.1 re-paste open action**
(below): one paste closes both — record it here when done.

## Runbook deltas

- **Tool contracts join the version discipline**: flow names, input
  order/names/descriptions, and output names
  (`Count`/`Rows`/`Truncated`; `Status`) bind the flows to the
  instructions' TOOLS section — change one, change both, and a
  contract change is an instructions bump (re-paste + smoke).
- **QueryTop (60)** lives in two places (§8c Get items Top + §8e
  Truncated compare) — keep in sync when tuning.
- **QA Feedback triage**: humans move Status
  (`New` → `Reviewed`/`Done`); the flow only ever writes `New`.
  Nothing automated reads the list.

## Verification record

`review/harness/` guard-rail (2026-08-12, Node 22.22.2, Python
3.11.15): v2.0 touches no sidecar format, no scripts, no flow —
`check_format.py` (after `make_fixtures.py`), `check_related.py`,
`check_regex.py` and `render_sample.py` re-run unchanged over the
current `scripts/` versions. All four PASS: the release is
corpus-neutral.

Live-tenant deploy (fill in at deployment — the STATUS.md open
action):

| Date | Tenant | §10 steps done | Rows passed (1–13) | Index latency observed | AgentInstructionsVersion |
|---|---|---|---|---|---|
| — | — | — | — | — | v1.2 |

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

Re-paste record — **OPEN ACTION (r2), superseded by v2.0**: the v1.1
paste is required by the v2.5 install order (`flow/v2_5/CHANGES.md`
install step 4) and no paste was ever recorded here. Since the v2.0
release the resolution is the §10 upgrade's v1.2 paste — one paste
closes both actions; v1.1 no longer needs separate confirmation
(tracked in `STATUS.md`):

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
