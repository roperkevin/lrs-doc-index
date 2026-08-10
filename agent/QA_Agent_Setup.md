# Q&A Agent Setup — Copilot Studio over the sidecar corpus (v1.0)

A Copilot Studio agent, **LRS Doc Index Q&A**, grounded on the LRS Doc
Index sidecar library and published to Teams. Everything here is
manual designer/portal work — like the flow's designer edits, none of
it can ship in a package. Apply in order; smoke-check after each step
before moving on.

Why Copilot Studio and not a plain SharePoint agent: full custom
instructions (the delimited block in
`agent/QA_Agent_Instructions_v1_0.md` — SharePoint agents take only a
short tuning blurb and cannot enforce the dual-citation rule), knowledge
scoped to exactly one library, and the growth path to list-query
actions (queued below). Why sidecars and not the raw source library:
the sidecars are clean markdown with AI summaries, discriminating
keywords, and normalized metadata the semantic index matches as
ordinary text — and each carries `source_url`, so answers still cite
the original file. Grounding on both libraries would double-hit every
document. The raw library stays OUT of the knowledge sources.

---

## 0 — Prerequisites (tenant facts, check once)

- Copilot Studio authoring access in the target environment, and
  message capacity (or M365 Copilot seats) per current tenant
  licensing — a tenant decision, not this repo's.
- The signed-in maker can read the **LRS Doc Index** library on
  `esriis.sharepoint.com/sites/lrsworkspace`. Agent users need read
  access too — SharePoint knowledge answers respect the asking user's
  permissions.
- Optional day-0 stopgap while the agent is being set up: create a
  zero-build SharePoint agent directly on the LRS Doc Index library
  (library view → Create an agent). It doubles as a capability probe —
  if it answers a known-answer question from a sidecar, the tenant's
  semantic index covers the library's .md files. Retire it once the
  Copilot Studio agent is published; two agents on one corpus is
  confusion, not redundancy.

Check: open one sidecar (any kind subfolder) in the browser and
confirm the yaml block and `[Source: ...]` link render — that is the
corpus the agent will quote.

## 1 — Create the agent

Copilot Studio → Create → New agent (skip the conversational
scaffolding; configure directly):

- Name: `LRS Doc Index Q&A`
- Description: `Answers questions about LRS team documents — test
  plans, user stories, design spikes, schedules, doc reviews — from
  the Doc Index catalog, with links to the source documents.`

Check: agent exists in the intended environment (the environment
picker, top right — moving it later is a rebuild).

## 2 — Knowledge: the sidecar library, nothing else

Knowledge → Add knowledge → SharePoint → paste the library URL:

    https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index

- Scope to the **LRS Doc Index** library, NOT the whole lrsworkspace
  site and NOT the LocationReferencing source library (see the
  wiring notes in the instructions artifact).
- **Disable general knowledge** (Overview → Settings → toggle off
  "Allow the AI to use its own general knowledge" / set generative
  answers to knowledge-sources-only, per current portal wording).
  The negative smoke test (§6) fails while this is on.

Check: in the Test pane, ask a throwaway question ("what test plans
exist?") — the answer must show SharePoint citations into
`/LRS Doc Index/...`. No citations = the knowledge source isn't
connected or indexed yet (see §4).

## 3 — Paste the instructions

Overview → Instructions: paste the delimited block from
`agent/QA_Agent_Instructions_v1_0.md` verbatim — everything between
`INSTRUCTIONS TEXT BEGINS` and `INSTRUCTIONS TEXT ENDS`, exclusive.

Record `AgentInstructionsVersion: v1.0` in `agent/CHANGES.md` (the
runbook convention: instructions re-verify like prompt bumps).

Check: in the Test pane, ask a known-answer question (first row of
`agent/QA_Smoke_Questions.md`) — the answer must cite the sidecar AND
surface the original file's link, and must NOT answer a general
question ("what is Paris?") beyond declining.

## 4 — Semantic-index warm-up (latency, not a bug)

SharePoint knowledge rides the Microsoft 365 semantic index. Newly
created or newly modified sidecars take time to appear — minutes to
hours tenant-dependent. The corpus is rewritten incrementally by the
daily 17:00 Mountain sweep, so the agent's freshness is the sweep
schedule PLUS index latency. A miss on a doc indexed today is expected
behavior; re-ask later before suspecting the agent. Record observed
latency in the smoke run (§6, freshness row).

## 5 — Publish to Teams

Channels → Microsoft Teams → publish, then share the install link with
the team (or the team's channel, per current tenant policy).
Authentication stays the default Microsoft Entra ID — answers must
respect per-user SharePoint permissions.

Check: ask the §3 known-answer question from Teams as a normal team
member (not the maker) — same answer, citations resolve.

## 6 — Run the smoke suite

Run every row of `agent/QA_Smoke_Questions.md` from Teams; record the
run (date, tenant, pass/fail per row, observed index latency) in
`agent/CHANGES.md`. The suite re-runs after every instructions bump.

---

## Known limits (v1.0)

- **Freshness** = nightly sweep + semantic-index latency (§4).
- **Coverage** = what the flow indexes: pptx/docx/xlsx/txt.
  html/pdf/msg land as Skipped rows upstream and have no sidecars;
  oversized (>~3.5 MB) files Error out. The agent is told to say so
  on a plausible miss.
- **Images** are extracted as files and linked (`../media/...`) but
  their content is not readable by the agent — a question answerable
  only from a screenshot will miss.
- **The lists are not knowledge** in v1: exhaustive metadata queries
  ("list ALL test plans for 3.8") are only as complete as retrieval;
  the agent answers from what it retrieves, not from a query. That is
  the first queued follow-on.

## Queued follow-ons (documented, not built)

- **List-query actions**: Copilot Studio agent flows against Doc
  Index / Doc Keywords for exact, exhaustive metadata queries
  (`$filter=DocKind eq 'Test Plan' and TargetRelease eq '3.8'`),
  giving deterministic answers where semantic retrieval only samples.
- **Feedback loop**: log unanswered / thumbs-down questions to a
  SharePoint list; feeds the already-queued keyword-alias curation.
- **Retrieval-motivated sidecar tweaks**, only if smoke testing shows
  a miss a format change would fix — shipped as a normal
  PromptVersion-bumped flow release with harness validation, never as
  a side effect of agent work.
