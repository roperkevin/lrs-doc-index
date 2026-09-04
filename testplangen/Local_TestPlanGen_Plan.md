# Plan — TestPlanGen as a local job (`local/testplangen.mjs`)

Status: **phases 1–2 BUILT** (2026-09-04, TestPlanGen **v2.16** /
**v2.17** — see `testplangen/CHANGES.md`): `local/testplangen.mjs`
v1.1 with both prompt transports, the two-layer verifier
(`local/lib/draftlint.mjs` — contract lint + grounding
spot-checks), the `--issue`/`--title` lookup front door, opt-in
webhook notification, and the `check_testplangen.py` gate (82/82,
CI). Phases 3–4 remain design only. This document stays the design
record and the build order.

## Why now

Automatic test-plan generation — a draft grounded strictly in one
input user story, with the catalog's related documentation as
reference — is fully AUTHORED in this repo (prompt v1.7, flows
v2.3, agent v1.9) but its deployed state is stuck at v2.0-era
behavior: STATUS open action 9's compound (dead `related:`
retrieval, the never-created fifth prompt parameter, every prompt
paste since v1.0 pending) means live drafts stay case-thin and
doc-blind until someone works `Coverage_Runbook.md` on the tenant,
click by click.

Meanwhile the pipeline itself left Power Automate on 2026-08-14:
the nightly sweep, weekly curation, and Flow #2 all run as local
Node jobs (`local/sweep.mjs`, `local/curate.mjs`,
`local/gantt.mjs`) over Graph + the same AI Builder prompts via
Dataverse Predict. TestPlanGen is the LAST component still
cloud-only — and unlike the sweep it is strictly on-demand, so it
is the cheapest one to migrate.

One local job delivers the entire authored v2.15 state in a single
promotion — prompt v1.7's coverage/granularity/sweep rules, the
v2.2 lane routing, the v2.3 budget semantics — with **zero tenant
designer work**, and unlocks two things the cloud flow
architecturally could not have:

1. **A deterministic adherence verifier.** The Setup guide's Known
   limits concede that "the hallucination guard is prompt-side
   only". Locally we hold the story text, the draft, and the lint
   in one process, so every draft can be machine-checked against
   its own story BEFORE it lands (see "The verifier" below).
2. **An automatic mode.** The cloud flow needs a human click per
   story. A local job can (opt-in) detect freshly indexed User
   Story rows with no covering Test Plan after the nightly sweep
   and queue drafts for them — generation becomes *automatic*, the
   review gate stays human.

The cloud flows, packages, and the Copilot Studio agent remain the
tenant path and are untouched by this plan; `Coverage_Runbook.md`
stays valid for anyone deploying that route. The two paths share
the same prompt file, the same caps, and the same drafts folder,
so a PE cannot tell which one produced a given draft — by design.

## What is being reimplemented (and what is not)

`local/testplangen.mjs` reimplements **TestPlanGenCore's G1–G13
semantics** (the single source: `TestPlanGen_Setup.md` §3) over the
local stack:

| Cloud piece | Local equivalent |
|---|---|
| For-a-selected-item trigger / agent front door | CLI: `--story <docId>`, `--issue <n>`, `--title "<words>"` (StoryLookupFlow's deterministic queries, in-process) |
| G1–G2 story fetch + guard | Doc Index row via `graph.mjs`; hard guard `DocKind = User Story AND IndexStatus = Indexed AND TextFileUrl non-empty` — same refusal text |
| G3–G4 sidecar fetch + `related:` line slice | read the sidecar from the synced library (or Graph under `sweep.remoteFiles`); the same first-`related: [` line-slice contract (`SidecarPatch.ts` `renderFmLine`) |
| G5–G7b digest / exemplar / reference lanes | same routing: same-surface Test Plans → exemplar slots; overflow, cross-surface plans, Design Spikes → reference lane; everything else digest-only. Same caps and slots, from config. Same G6 exemplar fallback query (release-match preferred), same deliberate NO-fallback rule for the reference lane |
| G8 one AI Builder call | `llm.mjs` — see "Prompt transport" |
| G9 marker slice, fail closed | identical `[[[DRAFT BEGIN]]]` / `[[[DRAFT END]]]` indexOf/lastIndexOf slice; missing or misordered markers write NOTHING |
| G10–G11 banner + timestamped draft | same banner (HTML comment + `> [!WARNING]` + truncation flag) written via `graph.putFile` to `Shared Documents/Test Plan Drafts/` (the curate.mjs digest write, different folder) — timestamped names, never overwritten |
| G13 `Gen_summary` | the same counters printed to stdout and appended to the run log (`neighbors= exemplars= references= digestChars= storyChars= draftChars= exChars= refChars=`), plus `verify=` from the new verifier |

NOT reimplemented: the Copilot Studio agent (chat stays a tenant
feature), reciprocal sidecar patching (this job writes nothing
inside the corpus), and any list write — the job is **read-only
over every list**, exactly like the flow; its only write is the
draft file. Re-running is always safe.

## Strict story adherence — the verifier

The prompt already carries the adherence machinery (mandatory
Trace lines, ENUMERATION/REQUIREMENT COVERAGE, the Coverage Map,
CASE SWEEP, `[VERIFY]`-not-fabricate). What no cloud flow could do
is *check* the reply. The local job adds a post-generation,
pre-write verification pass with two layers:

1. **Contract lint** — the existing
   `review/harness/check_draft_coverage.py` asserts (v1.7
   contract: section order, Trace on every case, Coverage Map
   integrity, granularity structure, sweep-table structure),
   ported to a small JS module (`local/lib/draftlint.mjs`) so the
   job has no Python dependency at run time. The Python lint stays
   the harness's authority; the port is gate-tested against it on
   shared fixtures (agreement leg — same verdict on every fixture).
2. **Grounding spot-checks** — new, and only possible here because
   the job holds the story text it just sent:
   - every Coverage Map "Requirement (source)" cell must
     fuzzy-match a span of STORY TEXT / StoryMeta (normalized
     substring or high token overlap) — a requirement the story
     never states is flagged as probable invention;
   - every tool/widget name in the draft that is absent from
     StoryMeta + STORY TEXT (checked against a normalized token
     set, official-casing list from the prompt's terminology
     section) is flagged unless its case's Trace cites a reference
     document — the tools rule, made checkable;
   - enumeration echo: enumerations the flow can detect cheaply in
     the story (comma/ampersand lists on workflow-shaped lines)
     must each appear somewhere in the draft — a missing item is
     flagged as a likely ENUMERATION COVERAGE miss.

Verifier policy (config `testplangen.verify`): `"annotate"`
(default) appends a machine-readable
`<!-- verify: N findings -->` block plus a visible
`> [!IMPORTANT]` list of findings under the banner — the reviewer
starts where the machine already found smells; `"strict"` refuses
to write a draft with findings (exit nonzero, findings on stderr) —
for the automatic mode, where nobody is watching; `"off"` for
parity-with-cloud comparisons. The grounding checks are heuristics
and must NEVER delete or edit draft content — they annotate or
refuse, whole-draft, keeping the fail-closed philosophy.

The verifier's counters ride `Gen_summary`
(`verify=ok|N-findings`), so draft quality becomes trendable run
over run — the before/after instrument the Coverage Runbook wants
but has to run by hand.

## Related documentation as reference — unchanged contract, one assist

The three lanes and their guards are the proven design; the plan
changes none of it. Grounding stays anchored to documents
RelatedRank actually linked to the story (the v2.0 rationale:
blind cross-surface retrieval grounds drafts on unrelated
features), the reference lane keeps its no-fallback rule, and lane
material is UNTRUSTED DATA under the prompt's injection guard.

One opt-in assist: when `sweep.embedRelated` is already on (phase
4), the job MAY use `lib/embedindex.mjs` scores to ORDER the
story's related entries before the slot cut — better exemplars
into the two exemplar slots — without ever admitting a document
the `related:` line doesn't carry. Off by default; inert without
the sweep opt-in; no new egress beyond what the sweep already
does.

## Prompt transport

`prompts/TestPlanGen_Prompt.md` stays the single prompt source.
Two providers, mirroring `llm.mjs` exactly:

- **`aibuilder`** (default, consistency with the sweep): the
  tenant's `LRS Test Plan Generation` prompt via Dataverse
  Predict, `modelId` from a new `llm.testPlanModelId` (discovered
  via the existing `--models` listing). CAVEAT: this inherits the
  tenant prompt's deployed state — the fifth parameter
  (`ReferenceText`) must exist and the v1.7 text must be pasted
  (Coverage_Runbook step 2's paste, one-time). Until then the
  tenant model is the pre-coverage one and the local job cannot
  fix that.
- **`anthropic`**: execute the repo prompt file VERBATIM between
  its delimiters, `{...}` inputs substituted locally — the
  DocIndex precedent in `llm.mjs`. This needs ZERO tenant work:
  the v1.7 rules apply on day one, ReferenceText included, because
  the prompt never leaves the repo. `maxTokens` must be raised for
  this call (config `testplangen.maxTokens`, default 16384): v1.6+
  split cases make long drafts, and a token-truncated reply loses
  `[[[DRAFT END]]]` — which the G9 slice correctly fails closed
  on, so under-provisioning is loud, not silent.

Recommendation: build both (they share `llm.mjs` plumbing), default
`aibuilder`, and document that a tenant that has not done the
runbook's step-2 paste gets current-coverage drafts only via
`anthropic`. The provider used is stamped into the draft banner —
provenance per draft, not per config.

## Automatic mode (phase 3, opt-in)

`testplangen.autoDraft: true` + `node local/testplangen.mjs --auto
[--live]`, schedulable after the nightly sweep (the heartbeat-task
precedent):

- Candidates: Doc Index rows with `DocKind = User Story`,
  `IndexStatus = Indexed`, first indexed within `autoLookbackDays`
  (default 7).
- Gap test: no related Test Plan in the story's `related:` line
  AND no Doc Links edge to a Test Plan row — i.e. nothing in the
  catalog covers it yet. (This is the cheap, local realization of
  the Setup guide's queued "gap report" follow-on.)
- One-draft-per-story idempotency: skip a story that already has
  ANY draft file matching `TestPlanDraft__doc{ID}__*` in the
  drafts folder — re-runs never stack automatic drafts; a PE
  deleting the draft (the §4 housekeeping step) is what re-arms
  auto-drafting for that story. `--force` overrides per story.
- Budget: `autoMaxPerRun` (default 3) caps AI spend per night.
- Verifier policy forced to `"strict"` in auto mode — an
  unattended draft with findings is not written; the finding list
  goes to the run log and (when `alerts.webhookUrl` is set) the
  Teams webhook.
- Notification: each written draft posts one webhook line (title,
  story id, draft URL, `Gen_summary`) — closing the Setup guide's
  "no notification" known limit for the automatic case; manual
  runs stay quiet (the person who ran it is watching).

The human gate is untouched: automatic drafts land in the same
outside-the-corpus folder, carry the same WARNING banner, and
nothing enters the catalog except by a PE finalizing and uploading
through the normal sweep path.

## Config (new `testplangen` section, `config.sample.json`)

Mirrors `Config_gen` name-for-name so the Setup guide's knob prose
transfers: `storyCap` 45000, `exemplarCap` 20000, `referenceCap`
12000, `neighborCap` 5, `digestSummaryCap` 400, `exemplarSlots` 2,
`referenceSlots` 3, `promptVersion` "v1.7" (stamp only — and
NEVER `Config.PromptVersion`: nothing here changes the sidecar
format or reindexes the corpus). Plus the new knobs:
`draftFolder` ("Test Plan Drafts", under the Shared Documents
root, the curate digest convention), `verify`
("annotate"|"strict"|"off"), `maxTokens` 16384 (anthropic lane),
`autoDraft` false, `autoMaxPerRun` 3, `autoLookbackDays` 7,
`dryRun` true (the gantt/curate default: first runs print the
plan — lanes, caps, the would-be filename — and write nothing).

## Harness

`local/harness/check_testplangen.py`, the `check_local_sweep.py`
mold (mock Graph + mock Predict/Anthropic endpoints), CI job
alongside the others. Legs:

1. guard — non-story / non-indexed / no-sidecar rows refuse with
   the flow's message; nothing written;
2. lanes — a fixture sidecar whose `related:` line exercises every
   routing branch (same-surface plans past the slots, a Design
   Spike, a recycled neighbor degrading silently) lands the right
   bodies in the right prompt inputs, `(none)` placeholders
   included;
3. caps — remaining-budget takes (the v2.13 lesson pinned:
   `exChars ≤ exemplarCap` after multiple appends);
4. fail-closed — a markerless and a misordered-marker reply write
   nothing and exit nonzero;
5. verifier — draftlint agreement with `check_draft_coverage.py`
   on shared fixtures; a planted invented-requirement /
   foreign-tool / dropped-enumeration draft each produce their
   finding; `strict` refuses, `annotate` stamps;
6. auto mode — gap detection, idempotency skip, `autoMaxPerRun`,
   dry-run inertness;
7. providers — both transports against their mocks; anthropic
   substitution leaves the prompt's guard text intact.

## Build order

1. **Phase 1 — the job** — ✅ SHIPPED (v2.16, 2026-09-04):
   `testplangen.mjs` (guard, lanes, call, slice, banner, write,
   summary) + `lib/draftlint.mjs` + harness legs 1–5 (plus an early
   slice of leg 7: both providers against mocks) + config +
   `Local_Setup.md` §11. Manual CLI only, `--story <docId>`.
2. **Phase 2 — front door + telemetry** — ✅ SHIPPED (v2.17,
   2026-09-04): `--issue` / `--title` lookup (StoryLookupFlow
   queries in-process, same bare-number-is-a-doc-id rule), opt-in
   webhook notification, grounding spot-checks. One deliberate
   change from the sketch above: the tools check carries NO
   cites-a-reference exception — the prompt's tools rule admits no
   tool names from reference documents at all, so the check is
   strictly story-only (see `testplangen/CHANGES.md` v2.17).
3. **Phase 3 — automatic mode**: `--auto`, gap detection,
   idempotency, harness leg 6, scheduled-task doc.
4. **Deferred, unchanged**: docx handoff and the IssueRefs-driven
   coverage matrix stay queued exactly as the Setup guide records
   them (the matrix becomes cheap once `gantt.mjs` has its first
   live run — STATUS action 13c).

## Dependencies and risks

- **Blocked by STATUS action 12** (sweep auth expired) for LIVE
  runs — same fix, no new blocker; authoring + harness proceed
  regardless (mocks).
- **Draft quality tracks retrieval**: until the local sweep's
  backfill regenerates `related:` lines corpus-wide,
  `neighbors=0` stories draft thin — visible in `Gen_summary`,
  same as ever.
- **AI spend**: on-demand + `autoMaxPerRun`-capped; aibuilder
  meters AI Builder credits identically to the cloud flow.
- **Two live paths, one behavior**: if the tenant flows are ALSO
  deployed, both write to the same folder with the same naming —
  no conflict (timestamped names), but the banner's provider
  stamp is what tells drafts apart; record in CHANGES which path
  a smoke row exercised.
- **Verifier false positives**: grounding heuristics WILL flag
  legitimate paraphrases; that is why `annotate` is the default
  and `strict` is reserved for unattended runs. The lint contract
  (layer 1) has no such ambiguity and could later graduate to a
  hard gate.
