# Q&A Agent Setup — Copilot Studio over the sidecar corpus

Current component version: **v2.0** (instructions v1.2, smoke suite
v1.1 — see `CHANGES.md`).

A Copilot Studio agent, **LRS Doc Index Q&A**, grounded on the LRS Doc
Index sidecar library, armed with two agent-flow tools (exact Doc
Index queries + feedback logging, §7–§9), and published to Teams.
Everything here is manual designer/portal work — like the flow's
designer edits, none of it can ship in a package (§8–§9's flows are
built inside Copilot Studio, the Agent_Setup §1c precedent). Apply in
order; smoke-check after each step before moving on. Section numbers
§0–§6 predate v2.0 and are referenced from CHANGES entries and the
smoke suite, so v2.0 arrives as appended sections: fresh installs run
§0–§3, §7–§9, §4–§6; a tenant already at v1.x runs §10's upgrade
order.

Why Copilot Studio and not a plain SharePoint agent: full custom
instructions (the delimited block in
`agent/QA_Agent_Instructions_v1_2.md` — SharePoint agents take only a
short tuning blurb and cannot enforce the dual-citation rule), knowledge
scoped to exactly one library, and list-query actions (shipped in
v2.0, §8). Why sidecars and not the raw source library:
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
`agent/QA_Agent_Instructions_v1_2.md` verbatim — everything between
`INSTRUCTIONS TEXT BEGINS` and `INSTRUCTIONS TEXT ENDS`, exclusive.

> **v2.0 ordering note:** v1.2 names the §8–§9 tools, so wire those
> before this paste — on a fresh install run §7–§9 now, then come
> back; the artifact's own header says the same. (The §3 check below
> needs only knowledge, so it passes either way.)

Record `AgentInstructionsVersion: v1.2` — the version of the file you
just pasted — in `agent/CHANGES.md` (the runbook convention:
instructions re-verify like prompt bumps).

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

## 7 — v2.0: generative orchestration

The v2.0 tools are agent flows the MODEL chooses to invoke, which
requires generative orchestration.

Settings → Generative AI → Orchestration: **Generative** (portal
wording varies: "Generative orchestration" toggle, or "How should
your agent decide how to respond?" → generative). Then re-check the
general-knowledge toggle from §2 — it is a separate setting, but the
orchestration switch redraws that settings page, so designer-verify
it is still OFF rather than assuming.

Check: re-run smoke rows 1, 2, and 6 in the Test pane — knowledge
answers still cite into `/LRS Doc Index/...`, and the negative row
still declines. Orchestration changes answer plumbing; this catches a
knowledge source dropped in the switch.

## 8 — v2.0: the Doc Query tool (exact, exhaustive metadata queries)

Closes the v1.0 "lists are not knowledge" limit: an agent flow, **LRS
Doc Query**, that runs a real OData query against the Doc Index list
and hands the model the complete row set — deterministic where
semantic retrieval only samples ("list ALL test plans for 3.8", "how
many user stories target 4.0", "what's the row id for X").

Build it inside Copilot Studio so it auto-registers as a tool (the
`testplangen/agent/Agent_Setup.md` §1c precedent — guaranteed-
recognized trigger/respond cards): **Tools** (older UI: Actions) →
**+ Add a tool** → **New agent flow**.

**8a — Trigger inputs.** On "When an agent calls the flow", add five
**Text** inputs, ALL optional, in this exact order (order determines
the `text_N` names the expressions below read):

| # | Name | Description (model-facing — the model fills inputs from these) |
|---|---|---|
| 1 | `DocKind` | Exact catalog kind: Test Plan, User Story, Design Spike, Data Template, Schedule, Doc Review, or Other. Empty = all kinds. |
| 2 | `Surface` | Exact surface: Pro, Experience Builder, Server, Enterprise, or Other. Empty = all surfaces. |
| 3 | `TargetRelease` | Release exactly as written, e.g. 3.8. Empty = all releases. |
| 4 | `Person` | A name; matches the PE or Dev fields by substring. Empty = everyone. |
| 5 | `TitleContains` | A document-title fragment, substring match. Empty = all titles. |

> Designer-verify: peek at the trigger's raw outputs on a test run —
> multi-input agent-flow triggers surface Text inputs as `text`,
> `text_1` … in add order (the Agent_Setup 1a convention). If your
> tenant shows different keys, substitute them in 8b.

**8b — `Filter` (Compose).** One expression builds the OData filter
from whichever inputs arrived; apostrophes are doubled (the
what'snew rule, applied to user-supplied values):

```
concat('ID gt 0',
 if(empty(trim(coalesce(triggerBody()?['text'], ''))), '',
    concat(' and DocKind eq ''', replace(trim(triggerBody()?['text']), '''', ''''''), '''')),
 if(empty(trim(coalesce(triggerBody()?['text_1'], ''))), '',
    concat(' and Surface eq ''', replace(trim(triggerBody()?['text_1']), '''', ''''''), '''')),
 if(empty(trim(coalesce(triggerBody()?['text_2'], ''))), '',
    concat(' and TargetRelease eq ''', replace(trim(triggerBody()?['text_2']), '''', ''''''), '''')),
 if(empty(trim(coalesce(triggerBody()?['text_3'], ''))), '',
    concat(' and (substringof(''', replace(trim(triggerBody()?['text_3']), '''', ''''''), ''', PE) or substringof(''', replace(trim(triggerBody()?['text_3']), '''', ''''''), ''', Dev))')),
 if(empty(trim(coalesce(triggerBody()?['text_4'], ''))), '',
    concat(' and substringof(''', replace(trim(triggerBody()?['text_4']), '''', ''''''), ''', Title)')))
```

(`ID gt 0` is the always-true base so the conditional clauses can all
lead with ` and `; all-empty inputs = a plain newest-first listing.)

**8c — `Get_docs` (SharePoint Get items).** Site
`https://esriis.sharepoint.com/sites/lrsworkspace`, list **Doc
Index**; Filter Query = `@{outputs('Filter')}`; Order By
`SourceModified desc`; Top Count **60** — the QueryTop cap. The same
60 appears in 8e's `Truncated` compare; keep the two in sync when
tuning (the RelatedWeights two-copies rule, one flow smaller).

**8d — `Select_rows` (Select) + `Rows` (Compose).** Select From
`@{outputs('Get_docs')?['body/value']}`, Map switched to text mode,
one markdown bullet per row:

```
- @{item()?['Title']} — @{coalesce(item()?['DocKind']?['Value'], 'kind ?')} / @{coalesce(item()?['Surface']?['Value'], 'surface ?')} / release @{coalesce(item()?['TargetRelease'], '—')}; PE @{coalesce(item()?['PE'], '—')}; Dev @{coalesce(item()?['Dev'], '—')} — [file](@{coalesce(item()?['SourceLink']?['Url'], '')}) — row id @{item()?['ID']}
```

then `Rows` = `@{join(body('Select_rows'), decodeUriComponent('%0A'))}`.

> Designer-verify: Get items returns Choice columns as objects
> (`?['Value']`) and Hyperlink columns as objects (`?['Url']`) —
> confirm both against one raw row on your tenant; some connector
> versions flatten them.

**8e — Respond to the agent.** Three **Text** outputs, names exactly:

| Output | Value |
|---|---|
| `Count` | `@{string(length(outputs('Get_docs')?['body/value']))}` |
| `Rows` | `@{if(equals(length(outputs('Get_docs')?['body/value']), 0), 'no rows matched', outputs('Rows'))}` |
| `Truncated` | `@{if(equals(length(outputs('Get_docs')?['body/value']), 60), 'true', 'false')}` |

Add a second **Respond to the agent** configured to run after
`Get_docs` has **Failed / Timed out**: `Count` = `-1`, `Rows` = the
error detail
(`@{take(string(coalesce(outputs('Get_docs')?['body'], 'query failed')), 1000)}`),
`Truncated` = `false`.

**8f — Name and describe.** Rename the flow **LRS Doc Query**; set
its tool description to:

> Exact, exhaustive queries over the LRS Doc Index catalog list by
> document kind, surface, target release, PE/Dev name, or title
> fragment. Returns the complete matching rows with source links and
> Doc Index row ids. Use for list-all, count, and row-id questions —
> not for questions about document content.

The flow name, input names/descriptions, and output names `Count` /
`Rows` / `Truncated` are the CONTRACT with the instructions' TOOLS
section (`QA_Agent_Instructions_v1_2.md`) — change one, change both.

Check: Test pane → "list every test plan for 3.8" (or a release your
corpus has) → the activity map shows LRS Doc Query invoked, and the
reply's roster exactly matches a manual Doc Index list view filtered
to `DocKind = Test Plan, TargetRelease = 3.8` — same rows, links
resolve, row ids match the ID column.

Shared machinery note: this tool is also the "title → id resolution"
follow-on queued in `testplangen/agent/Agent_Setup.md` — register the
same flow as a tool on the generator agent when wanted (one
implementation, two agents; TitleContains + DocKind `User Story`
returns the story's row id).

## 9 — v2.0: the feedback loop

Misses become work items instead of vapor: a **QA Feedback** list the
agent writes to — with the asker's consent — and librarians triage.

**9a — Create the list**: **QA Feedback** on lrsworkspace, per
`schemas/SPList_QAFeedback.csv`. All plain columns — no lookups, so
the classic-list-settings rule doesn't apply; modern creation is
fine. It is a list, not a library, so it can never leak into the
agent's knowledge (which is the sidecar LIBRARY only) — same
quarantine reasoning as the curation digest, one step stronger.

**9b — The flow**: Tools → + Add a tool → New agent flow, name it
**LRS Log QA Feedback**:

- Trigger inputs (Text, in order): `Question` (required — "the
  user's question, verbatim"), `Kind` (optional — "miss,
  wrong-answer, or suggestion"), `Notes` (optional — "what the agent
  searched or answered before logging").
- **Create_feedback** (SharePoint Create item) on QA Feedback:
  - Title = `@{take(trim(triggerBody()?['text']), 250)}`
  - FullQuestion = `@{triggerBody()?['text']}`
  - Kind = `@{if(contains(createArray('wrong-answer','suggestion'), toLower(trim(coalesce(triggerBody()?['text_1'],'')))), toLower(trim(triggerBody()?['text_1'])), 'miss')}`
    (unknown values collapse to `miss` rather than erroring on the
    choice column)
  - AgentNotes = `@{coalesce(triggerBody()?['text_2'], '')}`
  - Status = `New`
- **Respond to the agent**: one Text output `Status` = `ok`; a second
  respond on Create_feedback **Failed / Timed out** with `Status` =
  `error`.
- Tool description:

> Log a question the catalog could not answer, answered wrongly, or
> a document-catalog suggestion, to the QA Feedback list for
> librarian review. Call ONLY after the user has agreed to log.

**9c — Triage loop** (human, weekly-ish): filter Status `New`.
Vocabulary gaps ("we call it X, the docs say Y") become Keywords
alias rows — feeding the existing curation queue
(`curation/Curation_Setup.md`). Genuinely missing documents go to
their owners to upload (the sweep indexes them the next night).
Wrong answers that a sidecar format change would fix follow the
retrieval-motivated-tweaks rule below — never an ad-hoc edit. Move
handled rows to `Reviewed`/`Done` with a `ReviewNotes` line.

Check: Test pane → ask something unanswerable (smoke row 6's
question) → the agent misses, suggests terms, and OFFERS to log;
accept → a QA Feedback row appears (Kind `miss`, Status `New`, the
question verbatim); ask again and decline → no new row.

## 10 — v2.0 upgrade order (tenant already at v1.x)

One session, in order — this is the deploy the STATUS.md open action
tracks:

1. §7 — switch orchestration to generative; re-check general
   knowledge OFF; spot-check rows 1/2/6.
2. §8 — build + register **LRS Doc Query**; run the §8 check.
3. §9 — create the QA Feedback list, build + register **LRS Log QA
   Feedback**; run the §9 check.
4. §3 — paste instructions v1.2 (this paste supersedes the
   unconfirmed v1.1 re-paste open action: one paste closes both).
   Record `AgentInstructionsVersion: v1.2` in `agent/CHANGES.md`.
5. §6 — full smoke suite v1.1 (rows 1–13) from Teams; record the run
   in `agent/CHANGES.md`; update `STATUS.md`'s component row.

Rollback: delete the two tools from the agent, re-paste v1.1, switch
orchestration back — the knowledge wiring (§2) is untouched by all
of v2.0. The QA Feedback list can stay; nothing reads it but humans.

---

## Known limits (v2.0)

- **Freshness** = nightly sweep + semantic-index latency (§4). Doc
  Query is exempt — it reads the list live, so a row upserted today
  queries today even while its sidecar is still indexing.
- **Coverage** = what the flow indexes: pptx/docx/xlsx/txt.
  html/pdf/msg land as Skipped rows upstream and have no sidecars;
  oversized (>~3.5 MB) files Error out. The agent is told to say so
  on a plausible miss. (Skipped rows DO appear in Doc Query results —
  with empty kind/surface — since the row exists even when no sidecar
  does.)
- **Images** are extracted as files and linked (`../media/...`) but
  their content is not readable by the agent — a question answerable
  only from a screenshot will miss.
- **QueryTop caps Doc Query at 60 rows** (8c). The reply says so
  (`Truncated`), and counts at the cap read "60+", not an exact
  number. Raise the knob if real queries hit it — both copies (8c +
  8e).
- **Feedback rows carry no asker identity**: the flow runs under
  embedded connections, so Created By is the flow owner. Deliberate —
  a feedback list, not a surveillance list; askers who want follow-up
  put a name in the question.
- **Tool choice is model judgment**: a phrasing far from the tool
  descriptions may be answered from retrieval instead of the query.
  Smoke rows 9–11 catch drift; tune the §8/§9 descriptions, not the
  instructions, first.

## Queued follow-ons (documented, not built)

- **Keyword-lane queries**: Doc Query filters on Doc Index columns
  only; "every doc keyworded X" still rides retrieval. A second query
  lane through Doc Keywords (junction rows → document set, canonical
  keywords only) would make the vocabulary exactly queryable too —
  build it as another input on the same flow, not a second tool.
- **Feedback digest**: a weekly summary of `New` QA Feedback rows to
  the librarians, riding the curation flow's digest pattern (lands in
  Shared Documents, outside the agent's knowledge — the quarantine
  rule).
- **Provenance export**: once the two agent flows are stable, export
  their solution and check it in beside the agent artifacts, the way
  `flow/` versions accrete (the Agent_Setup follow-on, shared).
- **Retrieval-motivated sidecar tweaks**, only if smoke testing shows
  a miss a format change would fix — shipped as a normal
  PromptVersion-bumped flow release with harness validation, never as
  a side effect of agent work.
