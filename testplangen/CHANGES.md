# TestPlanGen v2.5 — live-validated URL condition + canonical binding keys (agent v1.6)

Second and third findings from the same live v2.3 deployment
(2026-08-13, continuing the v2.4 record):

**F1 — the v2.4 anchored IsMatch also failed canvas validation**
("Expected operator"), while the file's simpler `IsMatch` conditions
and the named-group `Match(...).num` extractions validated. A variant
ladder was offered against the live canvas; the form adopted on the
tenant — now the checked-in `refIsIssueUrl` condition (amended in
place before the pending smoke, the supersede-before-paste
precedent) — is the regex-free `in` substring form
(case-insensitive):

    =And("devtopia.esri.com/" in Topic.RefLower, "/issues/" in Topic.RefLower)

The full ladder (Find function style, operator style, simplified
IsMatch pattern) is recorded in Agent_Setup's schema-drift caution
for the next tenant, along with the trap that mimics total failure:
curly quotes from a clipboard hop fail EVERY variant with "Expected
operator" — retype the quotes before concluding anything.

**F2 — canonical flow-node binding keys confirmed.** The first
tenant bind surfaced `InvalidBindingInvokeAction` from the topic
checker until the bindings used the flows' SCHEMA keys, not display
names: inputs `number` (generation StoryId) and `text` / `text_1`
(lookup LookupKind / LookupQuery, creation-order-dependent — swapped
order crosses the lanes and every issue lookup returns `error`);
outputs are the lowercased respond names. An unbound required input
(`input: {}`) throws the same checker error. Agent_Setup §3 now
records the keys and the diagnosis path (bind in the canvas UI, read
the code editor back).

No flow, package, prompt, or schema changes — both flow contracts
are untouched; this is all topic-side Power Fx and binding-key
reality. Tenants mid-v2.3/v2.4 paste: replace the one condition,
confirm the binding keys, continue at §3's checks.

| Piece | Version | Where |
|---|---|---|
| GenerateTestPlan topic (refIsIssueUrl live-validated form; + file-set headers) | **TestPlanGenAgentVersion v1.6** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup (variant ladder, quote trap, §3 canonical binding keys + InvalidBindingInvokeAction triage) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 9) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.6 (paste in progress) |

# TestPlanGen v2.4 — two-argument IsMatch in the classify group (agent v1.5)

Live-deployment fix, found on the first v1.4 canvas paste
(2026-08-12): the topic's `refIsIssueUrl` condition — the file's ONLY
three-argument `IsMatch` — failed canvas validation on
`MatchOptions.Contains`. Every two-argument `IsMatch` and the
named-group `Match(...).num` extractions validated, so the fault line
is the `MatchOptions` enum on Copilot Studio's Power Fx surface, not
regex support. Fix: drop the third argument and express contains
semantics with anchors on the default complete-match —

    =IsMatch(Topic.RefLower, ".*devtopia\.esri\.com/[^/\s]+/[^/\s]+/issues/\d+.*")

Behavior identical. The rule going forward (topic header + the
Agent_Setup schema-drift caution): every `IsMatch` in the file stays
two-argument. The caution also records the regex-free fallback for
the URL test (`Find`-based) should a tenant reject even the anchored
form — swap it in the canvas and carry it back to the file. All five
file-set headers move to v1.5 together (settings had lagged at v1.3;
its content is unchanged).

No flow, package, prompt, or schema changes — both flow contracts and
every generation artifact are untouched. Deploy delta for a tenant
mid-v2.3-paste: re-paste the one condition (or the topic body) and
continue at Agent_Setup §3.

| Piece | Version | Where |
|---|---|---|
| GenerateTestPlan topic (refIsIssueUrl condition + comments; + file-set headers) | **TestPlanGenAgentVersion v1.5** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup (schema-drift caution: two-argument IsMatch rule + Find fallback) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 9) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.5 (paste in progress) |

# TestPlanGen v2.3 — story lookup: doc id, devtopia issue #, or title (agent v1.4)

Closes the "Title → id resolution" follow-on queued in
`agent/Agent_Setup.md` since v1.1 — and folds devtopia issue numbers
into the same lookup, since the plumbing for those already exists:
the nightly sweep's RegexExtract mints a **Doc IDs** row
(`Document` lookup + `IssueNumber`, both indexed) for every devtopia
reference it finds, so "which story is issue 4855" has been a cheap
indexed query all along. The agent can now be told any of:

- a **Doc Index item id** (`42`, `doc 42`, `id 42`) — used directly,
  exactly as before;
- a **devtopia issue** (`#4855`, `issue 4855`, `devtopia 4855`, or
  the full devtopia URL) — resolved via the Doc IDs list;
- **story-title text** (anything else) — resolved by contains-match
  over indexed User Story titles.

Two deliberate calls. **A bare number is always a doc id, never an
issue number** — the pre-v1.4 dialog took bare ids, and guessing
between the two readings would silently draft from the wrong story;
issue numbers need one of the markers above (the ask-prompt says so).
And **nothing generative touches the reference**: the topic
classifies with deterministic Power Fx (`IsMatch`/`Match` on the
trimmed, lowercased input — orchestration stays Classic), and the
resolution is SharePoint list queries in a flow. Ambiguity goes back
to the human: several matches → a capped candidate list
(`- doc NN — "Title" (surface …, release …)`, first 8, flagged past
the cap) and a which-id question; zero matches → coaching (title:
narrow the words / use the id; issue: the story's sidecar must
already carry the devtopia reference — Doc IDs rows are minted at
sweep time), and generation is NOT invoked.

**New agent flow `StoryLookupFlow`** (Agent_Setup §1d; built in
Copilot Studio per the 1c lesson; authored shape reference checked in
at `testplangen/flow/lookup_v1_0/definition.json`, with an authored
re-cut import package `testplangen/StoryLookupFlow_v1_0.zip` — the
TestPlanGenAgentFlow packaging mechanics, byte-identical payload,
SharePoint-only resource map, carried with the v1.4 caveat that
agent-flow package imports may not surface as recognized cards, so
the §1d hand-build stays the primary path): inputs
`LookupKind` (`issue`|`title` — the flow never parses free text) and
`LookupQuery`; outputs `LookupStatus` (`one`/`many`/`none`, `error`
from the failure respond) + `StoryId` + `StoryTitle` + `Candidates`.
Issue lane: `IssueNumber eq N` on Doc IDs (int-cast input — nothing
user-typed is interpolated into `$filter` as a string), dedup by
document, per-row Try + neutralizer (a row pointing at a recycled doc
degrades silently, the G5 pattern), kind-filtered to
User Story + Indexed. Title lane: `DocKind eq 'User Story' and
IndexStatus eq 'Indexed'` top 100 by Modified, then an in-memory
contains-filter (the curation §1 rule — no `substringof` on a
non-indexed column, no user text in OData). Read-only over both
lists; SharePoint connector only (zero-new-connectors rule holds);
responds on every path.

**Topic v1.4** (`topics/GenerateTestPlan.mcs.yml`): the ask-id
question becomes an ask-reference question (String entity), followed
by the Power Fx classify group, a lookup section (its own
init-declared output variables, canvas-added flow node, and a
status-branched condition with a wiring-fault else — the v1.3
checkStatus pattern applied to the lookup contract), and the
unchanged confirm → generate → report body now gated behind
`Topic.StoryId > 0`. The generation contract
(`StoryId` → `Status`/`DraftUrl`/`GenSummary`) and both generation
flows are untouched — TestPlanGenCore, TestPlanGen (list-menu
parent), TestPlanGenAgentFlow, the AI Builder prompt, and every
sweep artifact are all unchanged.

Deploy delta for a v1.3 tenant: build `StoryLookupFlow` (§1d),
re-paste/push the four changed agent files, re-add BOTH canvas flow
nodes (§3 — re-pasting the topic drops the old generation node), run
smoke rows 1–2c and 7. No prompt, package, or schema changes.

| Piece | Version | Where |
|---|---|---|
| Agent file set (topic restructure + instructions + fallback + connection refs) | **TestPlanGenAgentVersion v1.4** | `testplangen/agent/TestPlanGenAgent/` |
| StoryLookupFlow (new; shape/contract reference) | v1.0 | `testplangen/flow/lookup_v1_0/definition.json` |
| StoryLookupFlow import package (authored re-cut; §1d caveat applies) | v1.0 | `testplangen/StoryLookupFlow_v1_0.zip` |
| Agent_Setup (§1d, §3 two-node bind, smoke rows 2–2c/7, limits, follow-on closure) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else (flows, packages, prompt, schemas) | unchanged | — |

| Date | Tenant | Rows passed (of 9) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.4 (build + paste pending) |

# TestPlanGen v2.2 — status-branched agent replies + live-transcript triage (agent v1.3)

Root-caused from the first live Teams transcript (2026-08-12, the
deployment that followed the v2.1 paste fix). Three symptoms, three
causes:

**S1 — a successful run reported "The flow didn't produce a draft",
with the child's entire JSON response
(`{"status":"ok","drafturl":...,"gensummary":...}`) dumped into the
reply — while the draft sat in the folder.** That JSON-in-GenSummary
payload is exactly the §1c ERROR respond's expression
(`take(string(coalesce(outputs('Run_a_Child_Flow')?['body'], ...)))`)
— `TestPlanGenAgentFlow`'s error respond executed on a run whose
child SUCCEEDED, so the topic received `Status: error` and correctly
took its non-ok branch. Tenant-side fix (the agent flow is built in
Copilot Studio, no repo artifact to patch): the success respond keeps
the default run-after and maps the three outputs from the child's
individual fields; the error respond runs ONLY after the child-flow
action has Failed / Timed out. `Agent_Setup.md` §1c now states this
run-after discipline and its §1 check exercises the agent flow
directly (success run must return `Status: ok` as three separate
fields, never `error` + JSON blob).

**S2 — messages the file set never authored**: "Shall I proceed?"
appended to the confirm, an elaborated guard message, a re-ask for
the story id immediately after a confirmation, and a second, styled
"✅ draft generated" summary contradicting the topic's own (wrong,
per S1) reply. All one cause: generative orchestration / message
rephrasing enabled on the live agent, contradicting
`settings.mcs.yml` (`generativeAIOrchestration: Classic`). Tenant-side
fix: restore classic orchestration + general knowledge OFF. Triage
(f) and smoke row 1's check now catch it (exactly ONE reply reports
the result).

**S3 — the topic lumped every non-ok status into one generic branch**
and interpolated the raw payload into prose, which Teams' auto-linking
mangled (the transcript's `?web=1[`-spliced URL). Topic v1.3
(`topics/GenerateTestPlan.mcs.yml`) branches on the full contract:
`ok` (draft link now a MARKDOWN link — one clickable link without
relying on bare-URL auto-linking), `guard` (relays the child's
message + qualifying-row coaching), `nodraft` (re-run + AI Builder
pane pointer), `error` (relays detail + run-history pointer), and an
else that names the wiring fault when Status is empty/unrecognized —
the S1 failure mode made self-diagnosing in chat. Paste-path
deployments re-paste the topic body and re-add the §3 flow node;
extension-path deployments re-push.

No flow, package, prompt, or schema changes — the
`StoryId` → `Status`/`DraftUrl`/`GenSummary` contract is unchanged.

| Piece | Version | Where |
|---|---|---|
| GenerateTestPlan topic (+ file-set headers) | **TestPlanGenAgentVersion v1.3** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup §§1c/1-check/3/5 (run-after discipline, triage e–f, smoke row 1) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 6) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.3 (re-paste pending) |

# TestPlanGen v2.1 — declare the flow outputs at paste time (agent v1.2)

Live-deployment fix, found on the first paste-path (no VS Code
extension) deployment, 2026-08-12: pasting
`topics/GenerateTestPlan.mcs.yml` into the topic code editor failed
with "unrecognized identifier" on every `Topic.Status` /
`Topic.DraftUrl` / `Topic.GenSummary` reference. Cause: the v1.4-era
GuidParseError fix shipped the topic with the `InvokeFlowAction` node
commented out (flowId must be a real, environment-specific GUID) —
but that node's output bindings were the ONLY thing declaring those
three variables, so the checked-in YAML read variables that nothing
defines and the paste validator rightly rejected it. `Topic.StoryId`
and `Topic.Confirmed` never hit this because their Question nodes
declare them.

Fix: three `SetVariable` nodes (`initGenStatus` / `initGenDraftUrl` /
`initGenSummary`) in the confirmed-Yes branch, right after the
`ackRunning` message, each setting its variable to `=""`. The paste
now validates standalone; the §3 canvas-added flow node binds its
outputs to the same (now pre-existing) variables and overwrites the
empty strings at runtime, so behavior is unchanged. The initializers
stay in the topic permanently — they are the declaration, not
scaffolding. `Agent_Setup.md` §3 now says to place the flow node
between the initializers and the status condition and to pick the
existing variables in the output mapping instead of minting new ones.

No flow, package, prompt, or schema changes. Tenants that imported
the v1.1 topic via the VS Code extension path are unaffected
(behavior identical); paste-path deployments need the v1.2 topic
text.

| Piece | Version | Where |
|---|---|---|
| GenerateTestPlan topic (+ file-set headers) | **TestPlanGenAgentVersion v1.2** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup §3 wording | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

# TestPlanGen v2.0 — reference-functionality input lane (prompt v1.3)

Motivated by a live PE workflow (2026-08-12, the doc 1 revision that
followed `review/REVIEW_TestPlanGen_doc1_coverage.md`): three Pro
test plans (devtopia 3906/3910/3911, the Add-Event offset methods)
define the expected tool functionality — input methods, per-method
referent-population semantics — for an Experience Builder story, and
the pipeline had no sanctioned way to use them. Exemplars are
style/coverage ONLY ("never their feature-specific content" — the
hallucination guard), and the G6 fallback is same-surface by design,
so cross-surface functional grounding could only happen by hand in
the §4 review pass. v2.0 makes it a first-class, cited, guarded
generation input. This is a CONTRACT change (a fifth AI Builder
prompt input parameter), hence the major version.

**Prompt v1.3** (authored as
`review/patches/TestPlanGen_Prompt_v1_3.md`, promoted to
`prompts/TestPlanGen_Prompt.md` — supersedes v1.2 in-repo BEFORE its
pending paste; v1.2's enumeration-coverage rule + conditional
sections and v1.1's marker fix carry forward unchanged):

- Fifth input key **`ReferenceText`** — REFERENCE FUNCTIONALITY
  documents: test plans/design docs describing the expected behavior
  of this story's feature area, possibly on another surface. Unlike
  exemplars, the model MAY ground expected functional behavior on
  them (input methods, field-population semantics, validations),
  applied within the story's scope.
- Three guards: every reference-grounded statement's **Trace cites
  the reference document by title**; a cross-surface reference forces
  a **surface-parity [VERIFY]** item; **the story wins every
  conflict** (conflicts become [VERIFY] items). The lane supplies
  BEHAVIOR, never tool names — the tools rule is explicitly extended
  to it, so a Pro tool named in a reference never becomes a named
  widget in an EXB draft.
- New `<<<REFERENCE FUNCTIONALITY BEGIN/END>>>` input fence;
  untrusted-data and Trace rules extended to the fourth block. An
  empty lane (`(none)`) drafts exactly as v1.2 did.

**Both flows** (structural additions, mirrored in `flow/v1_0/` and
`flow/core_v1_0/`, both packages re-cut):

- `Config_gen`: `ReferenceCap` 12000, version stamp → v1.3.
- Three new top-level variables: `ReferenceText`, `ReferenceUrls`,
  `ReferenceCount`.
- **G5b — the surface split**: `If_testplan_neighbor` no longer
  slots every related Test Plan as an exemplar. Same-surface plans →
  `ExemplarUrls` (max 2, unchanged semantics); cross-surface plans →
  `ReferenceUrls` (max 2), stored as `{url, surface, title}` objects
  so the fetch can label each reference block with title + surface
  (what the prompt's surface-parity rule keys on). A same-surface
  plan arriving after both exemplar slots are full stays digest-only.
- **G7b — `For_each_reference`**: the G7 fetch pattern over the
  reference objects, capped at `ReferenceCap`.
- Prompt call binds the fifth key; `Story_meta` now runs after
  `For_each_reference`; `Gen_summary` adds `references=`.
- **No reference fallback query, deliberately**: cross-surface
  grounding is taken ONLY from documents RelatedRank actually linked
  to the story — a blind other-surface query would ground drafts on
  unrelated features. Stories without cross-surface related plans
  generate byte-for-byte as v1.9 would (`references=0`).

**Docs** — Setup §2 (five parameters + pane check), §3 G0/G0b/G5b/G7b/
G8/G13, §4 review runbook (reference-grounded cases get the
surface-parity check); Smoke suite v1.2: row 3 narrowed to
same-surface, new row 10 (reference lane end-to-end: `references≥1`,
cited Traces, surface-parity [VERIFY], no tool-name leakage).

Deploy (one window, replaces the still-pending v1.9 window; heavier
than a paste): (1) add the fifth input parameter **ReferenceText** to
the `LRS Test Plan Generation` AI Builder prompt and paste the v1.3
text; (2) apply the §3 flow additions in BOTH live flows — either
re-import the re-cut packages (post-import checks I1–I4) or designer-
build G0/G0b/G5b/G7b/G8/G13 per the guide — plus the earlier v1.8
marker edits if the tenant still runs v1.0 markers; (3) run the smoke
suite (now 10 rows) and record below. NEVER bump
`Config.PromptVersion` — nothing here changes the sidecar format or
reindexes the corpus.

To exercise row 10 with real data: upload the three Pro offset test
plans (3906/3910/3911) to the LocationReferencing Documents library,
let the nightly sweep index them, confirm doc 1's sidecar `related:`
list picks them up (shared keywords/issue ids), then run on doc 1.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.3** | `review/patches/TestPlanGen_Prompt_v1_3.md` → `prompts/TestPlanGen_Prompt.md` |
| Core child flow + package | **v2.0** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v2.0** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Setup + smoke docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` (suite v1.2, 10 rows) |
| Agent file set | unchanged (v1.1) | flow contract (`StoryId` → `Status`/`DraftUrl`/`GenSummary`) untouched |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 10) | TestPlanGenPromptVersion |
|---|---|---|---|
| — | — | — | v1.3 (paste pending) |

# TestPlanGen v1.9 — enumeration coverage + conditional sections (prompt v1.2)

Motivated by a coverage review of a live draft (2026-08-12,
`review/REVIEW_TestPlanGen_doc1_coverage.md`): the doc 1 draft
("Auto-Populate Referents for Event Edits") silently dropped the
attribute-table edit pathway its story names in the same acceptance
criterion as dynamic segmentation (CG-1), didn't exercise both event
types the story enumerates ("point and line" — CG-4), and had no home
for the story's Automation and Documentation slides (CG-2/CG-3). All
three are prompt-design faults, not one-off model faults:

- **RC-1** — the grounding rules require every case to trace to the
  story but never the converse; enumerated items ("Table"; "point and
  line") could silently collapse into a neighboring case.
- **RC-2** — the fixed five-section draft shape gave automation and
  documentation content nowhere to go.
- **RC-3** — "prefer fewer, well-grounded cases" pushed toward
  consolidation exactly when an enumeration-heavy story needs
  expansion.

The fix, **prompt v1.2** (authored as
`review/patches/TestPlanGen_Prompt_v1_2.md`, promoted to
`prompts/TestPlanGen_Prompt.md` — supersedes v1.1 in-repo BEFORE its
pending tenant paste; v1.1's marker fix is carried forward unchanged):

- **ENUMERATION COVERAGE grounding rule** — every workflow, edit
  pathway, input method, or event/geometry type the story enumerates
  must be exercised by at least one case (own case or explicit
  parameterization); grouped items in one statement are separate
  pathways; untestable items become Open Questions entries. The
  case-count guidance now explicitly yields to it.
- **Two CONDITIONAL draft sections** — `## Automation Notes` and
  `## Documentation Impacts`, between Negative Tests and Open
  Questions, emitted only when the story carries such content and
  omitted entirely (no empty heading) otherwise, so drafts for
  stories without those slides are unchanged. Bullets carry the same
  mandatory **Trace:** line as test cases.
- Output markers, input keys, and fences unchanged from v1.1 — the
  G9 slice and its literals are untouched.

**Both flows** — `Config_gen.TestPlanGenPromptVersion` → v1.2 in
`flow/v1_0/` and `flow/core_v1_0/`; both packages re-cut (the §
"authored, not exported" re-cut mechanics: `definition.json` swapped
into the `Microsoft.Flow/flows/<guid>/` entry, manifests and maps
untouched).

**Docs** — Setup §2's pane check and §4's review runbook cover the
conditional sections and the enumeration-coverage review step; Smoke
suite bumped to v1.1: row 1's section check rephrased (five CORE
sections + conditionals iff story content), new row 9 pinned to doc 1
as the enumeration-coverage regression fixture.

Deploy (one window, replaces the still-pending v1.8 window): paste the
v1.2 prompt into `LRS Test Plan Generation` (instead of v1.1), edit
the `Config_gen` version stamp to v1.2 in BOTH live flows — plus the
v1.8 `Draft_begin` / `Draft_end` literal edits if the tenant still
runs v1.0 markers — then run the smoke suite (now 9 rows) and record
below. NEVER bump `Config.PromptVersion` — nothing here changes the
sidecar format or reindexes the corpus.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.2** | `review/patches/TestPlanGen_Prompt_v1_2.md` → `prompts/TestPlanGen_Prompt.md` |
| Core child flow + package | **v1.9** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v1.9** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Setup + smoke docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` (suite v1.1, 9 rows) |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 9) | TestPlanGenPromptVersion |
|---|---|---|---|
| — | — | — | v1.2 (paste pending) |

# TestPlanGen v1.8 — sanitizer-safe output markers (prompt v1.1)

Root-caused from a live failure (2026-08-12): every generation run
terminated `NoDraftMarkers` — all actions green, complete draft in the
reply — because AI Builder sanitizes HTML-tag-like sequences out of
the prompt REPLY. The output sentinels `<<<DRAFT BEGIN>>>` /
`<<<DRAFT END>>>` each contain a tag-shaped inner run
(`<DRAFT BEGIN>` / `<DRAFT END>`) that the sanitizer removed, so
`Gen_text_raw` arrived bracketed by bare `<<>>` stubs, the G9 slice
found no markers, and the flow failed closed — exactly as designed,
on every run. TestPlanGen was the first prompt to use angle-bracket
sentinels in the OUTPUT direction; the JSON prompts use `<<<...>>>`
only as input fences, which travel flow→model and are never
sanitized — which is why five days of DocIndex/curation history never
surfaced this.

The fix — square-bracket output sentinels, same lengths, so the slice
arithmetic (`Draft_body`'s hardcoded 17) is untouched:

| | old | new |
|---|---|---|
| begin (17 chars) | `<<<DRAFT BEGIN>>>` | `[[[DRAFT BEGIN]]]` |
| end (15 chars) | `<<<DRAFT END>>>` | `[[[DRAFT END]]]` |

- **Prompt v1.1** — output markers swapped in the instruction and the
  worked example; header documents the sanitizer rationale. Input
  fences (`<<<STORY TEXT BEGIN>>>` etc.) unchanged. Authored as
  `review/patches/TestPlanGen_Prompt_v1_1.md`, promoted to
  `prompts/TestPlanGen_Prompt.md`.
- **Both flows** — `Draft_begin` / `Draft_end` literals and
  `Config_gen.TestPlanGenPromptVersion` (→ v1.1) updated in
  `flow/v1_0/` and `flow/core_v1_0/`; both packages re-cut.
  `Terminate_no_draft`'s message is unchanged (it names the markers
  generically).
- **Docs** — Setup §2/§G0/§G9 and Smoke rows 5–6 carry the new
  literals; Smoke row 6's parse probe now doubles as the regression
  check for this bug (a probe reply pasted with the OLD markers must
  fail closed).

Deploy (designer edits + paste, one window): re-paste the v1.1 prompt
into `LRS Test Plan Generation`, edit `Draft_begin` / `Draft_end` and
the `Config_gen` version stamp in BOTH live flows (core + standalone),
then run the smoke suite and record below. NEVER bump
`Config.PromptVersion` — nothing here changes the sidecar format or
reindexes the corpus.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.1** | `review/patches/TestPlanGen_Prompt_v1_1.md` → `prompts/TestPlanGen_Prompt.md` |
| Core child flow + package | **v1.8** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v1.8** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Setup + smoke docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` |
| Everything else | unchanged | — |

# TestPlanGen v1.7 — empty-release exemplar fix + visible menu-path guard

Two review fixes (`review/REVIEW_v2_5.md` DX-7, DX-12), both applied to
the live flows 2026-08-11.

**DX-7 — a blank story release no longer "matches" release-less plans.**
`Filter_release_match` treated empty-equals-empty as a release match, so
a story with no `TargetRelease` release-matched every same-surface plan
that also lacked one — typically the oldest, least-curated plans — and
those won outright over newer exemplars. The filter now requires the
STORY release to be non-empty; a blank release falls through to
`Exemplar_rows`' newest-two default. Both definitions carry it
(`flow/core_v1_0/`, `flow/v1_0/`), both packages re-cut, Setup §3
updated.

**DX-12 — a guard rejection from the list menu fails visibly again.**
Post-split, the child Responds `Status: guard` and Terminates Succeeded,
so a PE running the Automate entry on a non-story row saw a successful
run and no draft — no failure signal, no alert. The thinned parent (a
hand edit, no package — Agent_Setup §1b) gains `If_child_ok`: child
`Status` ≠ `ok` → Terminate Failed with the child's `GenSummary` as the
message, restoring pre-split behavior for the menu path only. The agent
path is untouched (its topic relays non-ok statuses conversationally).
Agent_Setup §1a/§1b and smoke row 2 updated to match.

| Piece | Version | Where |
|---|---|---|
| Core child flow + package | **v1.7** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v1.7** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Agent_Setup §1a/§1b + smoke row 2 | updated | `testplangen/agent/Agent_Setup.md`, `TestPlanGen_Smoke.md` |
| Everything else | unchanged | — |

# TestPlanGen v1.6 — encode the DraftUrl so the chat link survives Teams

One-expression fix from the full-codebase review (`review/REVIEW_v2_5.md`
DX-1). `TestPlanGenCore`'s `Draft_url` compose concatenated
`SiteUrl + DraftFolder + '/' + Draft_name` with `DraftFolder`'s literal
spaces (`/Shared Documents/Test Plan Drafts`) left unencoded. The agent
relays `DraftUrl` verbatim (`Draft ready: {Topic.DraftUrl}`), and Teams
auto-linking terminates a URL at the first space — so the agent's primary
deliverable rendered as a clickable `.../lrsworkspace/Shared` (404) plus
trailing text.

`Draft_url` is now wrapped in a space-encode:

    replace(concat(outputs('Config_gen')?['SiteUrl'],
      outputs('Config_gen')?['DraftFolder'], '/',
      outputs('Draft_name')), ' ', '%20')

Whole-string encoding is safe: `SiteUrl` and `Draft_name`
(`TestPlanDraft__doc{N}__{timestamp}.md`) cannot contain spaces — the
folder's are the only ones.

Scope: the CORE child flow only. The monolithic list-menu flow
(`flow/v1_0`) never builds a URL — its PE finds the draft in the folder —
and the thin parent and Copilot topic relay the child's output untouched,
so nothing else changes. The `Status`/`DraftUrl`/`GenSummary` contract is
unchanged (same field, encoded value).

Applied to the live `TestPlanGenCore` flow 2026-08-11 (designer edit, one
expression). `flow/core_v1_0/definition.json` and
`TestPlanGenCore_v1_0.zip` carry the fix; `TestPlanGen_v1_0.zip` is
untouched. `Agent_Setup.md`'s §1b check and smoke row 1 now require
clicking the link from the Teams chat — the check that would have caught
this at deploy time.

Also in v1.6 — second-granular draft names (REVIEW_v2_5.md DX-8):
draft filenames were minute-granular (`yyyyMMdd-HHmm`), so two runs on
the same story inside one minute silently overwrote — a PE
double-clicking the menu entry, or the menu and agent paths racing,
violated the "a re-run must never clobber a draft" rule. The timestamp
is now `yyyyMMdd-HHmmss` in all three sites: `Draft_name` (core),
`Save_draft`'s inline filename (`flow/v1_0`), and Setup §3 G11.
Applied to the live `TestPlanGenCore` flow 2026-08-11 alongside the
URL fix; both packages re-cut.

| Piece | Version | Where |
|---|---|---|
| Core child flow + package | **v1.6** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v1.6** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` (HHmmss only — it builds no URL) |
| Agent_Setup smoke wording + Setup G11 | updated | `testplangen/agent/Agent_Setup.md`, `testplangen/TestPlanGen_Setup.md` |
| Everything else | unchanged | — |

# TestPlanGen v1.5 — stop equating sidecar doc_id with the item id

Text-only release, companion to flow v2.5 (`flow/v2_5/CHANGES.md`).
The agent front-end's instructions (`agent/TestPlanGenAgent/agent.mcs.yml`)
and the `askStoryId` question (`topics/GenerateTestPlan.mcs.yml`) both
claimed the Doc Index item id "is also the doc_id in the sidecar and
the docNN in the filename". That was never true: the sweep stamped
sidecars with the source library file's item id — a different id
space — so a user who obeyed the prompt and typed a sidecar's `doc_id`
sent `Get_story_row` to an unrelated row (observed: doc_id 1008 →
wrong document; the guard rejects it, or worse, a different Indexed
User Story row grounds the draft).

Both texts now direct users to the Doc Index list's ID column as the
only always-safe source, with the accurate caveat: sidecars extracted
at `prompt_version` v1.7+ (flow v2.5) do carry the matching number;
older sidecars don't until the backfill renames them.

No flow, package, prompt, or schema changes — the generation flows
already used the row id correctly end to end (`Get_story_row`, the
`StoryMeta` `doc_id:` line, the `TestPlanDraft__doc{ID}` name).
Deploy: re-import or hand-edit the agent's Instructions and the
topic's question text in Copilot Studio; re-run smoke row 1
(`TestPlanGen_Smoke.md`) plus one deliberate wrong-id probe (feed a
pre-migration sidecar's `doc_id`; expect EITHER the guard message OR
a draft whose banner names the wrong story — both prove the id was
misdirected, since the stale id can also collide with a different
Indexed User Story row — then success with the list's ID).

| Piece | Version | Where |
|---|---|---|
| Agent instructions + topic text | **TestPlanGenAgentVersion v1.1** | `testplangen/agent/TestPlanGenAgent/` |
| Everything else | unchanged | — |

(Recorded post-release: this edit shipped without bumping the
`TestPlanGenAgentVersion` headers in the file set — they still read
v1.0 while the text had changed. The headers, this table, and the
README row now all say v1.1; tenants deployed from the v1.0 file set
should re-paste per the deploy note above.)

# TestPlanGen v1.4 — import package for the agent flow (TestPlanGenAgentFlow)

`testplangen/TestPlanGenAgentFlow_v1_0.zip` packages the §1c agent
parent, completing the import-driven set: v1.2 the standalone flow,
v1.3 the child, v1.4 the agent front door. Payload:
`testplangen/flow/agent_v1_0/definition.json` — a 3-action flow with
zero connectors (built-ins only; the package carries no connector
resources and its maps are empty): "When an agent calls the flow"
trigger (Number input `StoryId`), Run a Child Flow → TestPlanGenCore,
and two Respond-to-the-agent actions (success path relaying the
child's `Status`/`DraftUrl`/`GenSummary`; failure path responding
`Status: error` with the child's error detail). Only §1b — thinning
the user's already-bound list flow in place — remains a hand edit, by
design.

Two caveats beyond the standing authored-not-exported convention:

- **The child reference always needs a re-pick.** Run a Child Flow
  binds by environment-specific workflow id; the package ships the
  Core package's id, which never matches the id minted when Core was
  imported. Post-import: open the node, re-pick TestPlanGenCore,
  confirm `StoryId` maps.
- **The trigger shape is the least-verified in the set.** "When an
  agent calls the flow" is authored as a `Request`/`kind: Skills`
  trigger (its documented peek-code sources were unreachable at
  authoring time). If import rejects the package, §1c's four-action
  hand build is the fallback; record the rejection here.

| Piece | Version | Where |
|---|---|---|
| Agent-flow import package | **v1.0** | `testplangen/TestPlanGenAgentFlow_v1_0.zip` |
| Agent-flow definition (payload) | v1.0 | `testplangen/flow/agent_v1_0/definition.json` |
| Everything else | unchanged | — |

Import record:

| Date | Tenant | Imported cleanly | Child re-picked | Trigger verified |
|---|---|---|---|---|
| 2026-08-10 | esriis (lrsworkspace) | yes | yes — child node rebuilt, responds re-linked | **no** — flow never surfaced as an addable agent flow/tool in Copilot Studio |

Docs note (post-v1.4, live-deployment result): the authored
trigger/respond shapes did not render as recognized "When an agent
calls the flow" / "Respond to the agent" cards on the live tenant, so
Copilot Studio never listed the imported flow — the documented risk
realized. **The package is superseded as a deployment path**: §1c is
now built from inside Copilot Studio (Tools → New agent flow →
pre-loaded recognized cards → four-action body), which also
auto-registers the flow as a tool. The zip and its payload stay in
the bundle as a shape/contract reference, per the provenance
convention.

Docs note (post-v1.4, live-deployment feedback): the GenerateTestPlan
topic originally shipped an active `InvokeFlowAction` node with a
`flowId: REBIND-AT-IMPORT` placeholder — the topic code editor
validates `flowId` as a GUID and rejects the paste (GuidParseError).
The topic file now ships the flow node commented out with add-via-
canvas instructions, and `Agent_Setup.md` §3 is retitled "Add and
bind the flow node" to match. Found during the first live agent
deployment; agent file set still pre-first-import on any other
tenant, so TestPlanGenAgentVersion stays v1.0. *(True when written;
the v1.5 correction above later bumped the file set to v1.1 — that
note, not this one, states the current version.)*

---

# TestPlanGen v1.3 — import package for the child flow (TestPlanGenCore)

`testplangen/TestPlanGenCore_v1_0.zip` packages the agent-ready child
flow, closing the by-hand gap in `testplangen/agent/Agent_Setup.md`
§1a. Its payload, `testplangen/flow/core_v1_0/definition.json`, is a
**programmatic transform of the v1.0 flow definition** (not a second
authoring): trigger swapped to "Manually trigger a flow" with a
Number input `StoryId` (`triggerBody()?['number']`), the guard and
no-draft Terminates converted to Respond-with-Status (`guard` /
`nodraft`) followed by Terminate Succeeded, the draft filename minted
once in a `Draft_name` Compose with `Draft_url` derived from it, and
a success `Respond_ok` returning `Status`/`DraftUrl`/`GenSummary` —
the contract the agent topic and 1c parent bind to. Catch still
Terminates Failed (a real failure should fail the caller). 63
actions; same two connectors; same authored-not-exported caveats and
I-checks as v1.2 (prompt `recordId` placeholder, list re-pick on
foreign GUIDs), minus the trigger caveat — a button trigger has no
list binding. Post-import: add the flow to a solution and set
embedded run-only connections before wiring 1b/1c (child flows are
solution-only).

| Piece | Version | Where |
|---|---|---|
| Child-flow import package | **v1.0** | `testplangen/TestPlanGenCore_v1_0.zip` |
| Child-flow definition (payload) | v1.0 | `testplangen/flow/core_v1_0/definition.json` |
| Everything else | unchanged | — |

---

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

---

**Addendum (2026-08-11, r2 PV-1):** `TestPlanGen_v1_0.zip` and
`TestPlanGenCore_v1_0.zip` were re-cut with the connection
`displayName` (a personal work email) scrubbed from their
`manifest.json`; `definition.json` payloads byte-identical, import
behavior unaffected (`TestPlanGenAgentFlow_v1_0.zip` never carried
the email). Originals in git history.
