# Test Plan Generation Setup — build and deploy

Current component version: **v2.4** (see `CHANGES.md`).

A new, separate, on-demand Power Automate flow, **TestPlanGen**: a PE
selects an indexed **User Story** row in the Doc Index list and runs
it from the Automate menu; the flow gathers the story's sidecar, its
related documents (from the sidecar's machine-readable `related:`
line), and one or two existing Test Plan sidecars as exemplars; makes
ONE AI Builder call; and writes a timestamped markdown draft into
**Shared Documents/Test Plan Drafts/** — deliberately outside the LRS
Doc Index library, so the Q&A agent never ingests an unreviewed draft.
The PE reviews, finalizes into the team's normal test-plan format, and
uploads to the LocationReferencing Documents library, where the
nightly sweep indexes the finished plan like any other document. The
loop closes through the existing pipeline: no sweep, script, schema,
or `Config.PromptVersion` change anywhere in this component.

This component originally shipped as a build guide only (the
curation precedent: a brand-new flow has no package skeleton to
import, and the flow is ~35 actions, buildable from §3 in about an
hour). Since v1.2 the flow definitions ARE checked in —
`testplangen/flow/v1_0/definition.json` and
`testplangen/flow/core_v1_0/definition.json` — with authored re-cut
import packages alongside; see "Queued follow-ons" for the closure
record.

Everything below is manual portal/designer work in the
`designer-edits.md` mold: apply in order, check after each step. All
expressions are pure WDL. List GUIDs are from
`docs/SP_Adaptation_Notes.md` (Doc Index =
`245a4082-53c5-49f0-90e1-1abe62698c4a`).

---

## 0 — Prerequisites

- Maker access to the environment holding DocIndexSweep, the same
  SharePoint connection, and AI Builder capacity for one custom-prompt
  call per invocation (strictly on-demand — a handful per week in
  practice).
- The sweep is at v2.4+ (kind-routed sidecars and the v2.3+ `related:`
  metadata line are assumed — the flow parses that line, format
  contract in `scripts/SidecarPatch.ts` `renderFmLine`: the literal
  `related: ` followed by a JSON array of `{doc, file, s}` objects).
- No new lists, columns, or scripts — `docs/SP_Adaptation_Notes.md`
  and `schemas/` are unchanged by this component, and the local
  harness (`review/harness/`) is unaffected.

Check: open any recently indexed sidecar in the LRS Doc Index library;
its fenced metadata block contains a `related:` line that is a JSON
array (possibly `[]`).

## 1 — The drafts folder

In **Shared Documents** (the same library that holds the curation
digest — NOT the LRS Doc Index library), create the folder
**Test Plan Drafts**.

> Placement is the curation-digest rule: the Q&A agent grounds on the
> entire LRS Doc Index library (`agent/QA_Agent_Setup.md` §2) and must
> never ingest machine-generated, unreviewed test plans as document
> knowledge. Shared Documents is outside its one knowledge source, and
> outside the sweep's source library too. The rule holds whether or
> not the (optional) Q&A agent is deployed yet — the placement costs
> nothing now and protects the corpus the day it is.

Check: `/Shared Documents/Test Plan Drafts` exists and is empty.

## 2 — The AI Builder prompt

Create a custom prompt named `LRS Test Plan Generation`. FIVE input
parameters, exact names: **StoryMeta**, **StoryText**,
**RelatedDigest**, **ExemplarText**, **ReferenceText** (the fifth is
new in v2.0 — an upgrade from a pre-v1.3 paste must CREATE the
parameter, not just re-paste the text). Paste the delimited block from
`prompts/TestPlanGen_Prompt.md` verbatim. Record
`TestPlanGenPromptVersion: v1.3` in `testplangen/CHANGES.md`.

This prompt versions independently: bumping it never touches
`Config.PromptVersion` (nothing here changes the sidecar format or
reindexes the corpus).

Unlike the other two prompts, the reply is MARKDOWN between
`[[[DRAFT BEGIN]]]` / `[[[DRAFT END]]]` markers, not JSON — the
rationale is in the prompt file's header; the flow's G9 slice below is
the F3 pattern with different sentinels, and it fails closed. The
output sentinels are square-bracketed (v1.8): AI Builder strips
HTML-tag-like sequences from the REPLY, so the original
`<<<DRAFT BEGIN>>>` came back as a bare `<<>>` (the tag-shaped
`<DRAFT BEGIN>` inside it was sanitized away) and every run failed
closed. Angle-bracket fences remain fine on the INPUT side.

Check: test in the AI Builder pane with a three-line StoryMeta
(`title: Smoke Story`, `surface: Pro`, `target_release: 3.8`), a
two-sentence StoryText ("As an editor, I need to merge two routes.
The merge must preserve measures."), empty RelatedDigest, ExemplarText
and ReferenceText → the reply is wrapped in the two markers, contains the
five core draft sections (the smoke story has no automation or
documentation plans, so the two conditional sections — Automation
Notes, Documentation Impacts — are correctly absent), every test case
carries a **Trace:** line, and Open Questions is non-empty.

## 3 — The flow: import the package, or build by hand

Since v1.2 there are two ways to get the flow. Either way, finish
with the designer-verify cautions in the build steps (choice-column
`.Value` and hyperlink surfacing) and the §5 smoke suite.

**Path A — import `testplangen/TestPlanGen_v1_0.zip`** (My flows →
Import → Import package (Legacy)), then the post-import checks:

- **I1 — prompt binding.** The AI Builder action ships with a
  placeholder `recordId` (all zeros) because the `LRS Test Plan
  Generation` prompt is minted per-tenant in §2 — open
  `Run_testplangen_prompt` and re-pick your prompt (the sweep
  package's script-rebinding rule, applied to a prompt). The flow
  will not run until this is done.
- **I2 — trigger binding.** Open the trigger and confirm site
  `lrsworkspace` / list **Doc Index** resolved on your tenant; on a
  fresh tenant re-pick both. The package's trigger is authored (see
  the CHANGES v1.2 note) — if import rejects the package outright,
  fall back to Path B and report the import error in
  `testplangen/CHANGES.md`.
- **I3 — connections.** During import, map the SharePoint and
  Dataverse connections to yours (Select during import), same as the
  sweep package.
- **I4 — menu label.** Confirm the flow appears under Automate on the
  Doc Index list; rename the menu label to
  `Generate test plan draft` if the default shows the flow name.

Check: the flow saves with no expression errors and §5's row 1 passes.

**Path B — build by hand.** New flow **TestPlanGen**, same
environment and SharePoint connection as the sweep. Actions in order
(names exactly as written — later expressions reference them):

**Trigger — For a selected item** (SharePoint): site
`https://esriis.sharepoint.com/sites/lrsworkspace`, list **Doc Index**
(`245a4082-53c5-49f0-90e1-1abe62698c4a`). No input fields. The
selected row's id is `@{triggerBody()?['entity']?['ID']}` throughout.

> Designer-verify (first test run): peek at the trigger's raw outputs
> and confirm the id surfaces at `entity/ID` on your tenant; adjust
> the two references below if not.

**G0 — `Config_gen`** (Compose):

```json
{
  "SiteUrl": "https://esriis.sharepoint.com/sites/lrsworkspace",
  "DocIndexList": "245a4082-53c5-49f0-90e1-1abe62698c4a",
  "DraftFolder": "/Shared Documents/Test Plan Drafts",
  "StoryCap": 30000,
  "ExemplarCap": 20000,
  "ReferenceCap": 12000,
  "NeighborCap": 5,
  "DigestSummaryCap": 400,
  "TestPlanGenPromptVersion": "v1.3"
}
```

The caps are the token-budget knobs (Known limits below). Trim
priority when a generation feels starved: the story always wins, then
the first exemplar, then the digest, then the second exemplar.

**G0b — Initialize variables** (seven, top level — variables cannot
initialize inside a scope): `NeighborDigest` (String, value
`@{string('')}` — the empty-value designer-trap guard), `ExemplarText`
(String, same), `ExemplarUrls` (Array, value `@{json('[]')}`),
`ExemplarCount` (Integer, 0), `ReferenceText` (String, `@{string('')}`),
`ReferenceUrls` (Array, `@{json('[]')}`), `ReferenceCount`
(Integer, 0).

**G0c — `Try_gen`** (Scope) containing G1–G11:

**G1 — `Get_story_row`** (Get item, Doc Index list, Id
`@{triggerBody()?['entity']?['ID']}`).

**G2 — `Guard_story`** (Condition, advanced mode):

```
@and(equals(coalesce(body('Get_story_row')?['DocKind']?['Value'], ''), 'User Story'), equals(coalesce(body('Get_story_row')?['IndexStatus']?['Value'], ''), 'Indexed'), not(empty(coalesce(body('Get_story_row')?['TextFileUrl'], ''))))
```

> Designer-verify (F2/Old_sidecar_url-class caution): confirm on a raw
> `Get_story_row` output that the choice columns surface as
> `DocKind.Value`/`IndexStatus.Value`/`Surface.Value` and the
> hyperlink column as a bare `TextFileUrl` string on your tenant. If
> choices surface as bare strings, drop every `?['Value']` in this
> guide; if the hyperlink surfaces as an object, append `?['Url']` to
> every `TextFileUrl` read.

**No branch** — **`Terminate_not_story`** (Terminate, status Failed,
message: `TestPlanGen runs on Indexed User Story rows only. Select a
row with DocKind = User Story and IndexStatus = Indexed (it needs an
extracted sidecar to draft from).`). **Yes branch** — everything from
G3 on.

**G3 — story sidecar** (the sweep's `Get_neighbor_md` shape):
- **`Story_url`** (Compose):
  `@{coalesce(body('Get_story_row')?['TextFileUrl'], '')}`
- **`Story_path`** (Compose):
  `@{replace(outputs('Story_url'), outputs('Config_gen')?['SiteUrl'], '')}`
- **`Get_story_sidecar`** (Get file content using path): site
  `Config_gen.SiteUrl`, File Path `@{outputs('Story_path')}`, Infer
  Content Type **No**.
- **`Story_md`** (Compose):
  `@{base64ToString(body('Get_story_sidecar')?['$content'])}`

**G4 — related-line parse** (line-sliced, not YAML-parsed — the
`related:` line is machine-written JSON, contract in §0; its first
occurrence is always the metadata line because the fenced block heads
every sidecar):
- **`Rel_start`** (Compose):
  `@indexOf(outputs('Story_md'), 'related: [')`
- **`Rel_tail`** (Compose) — from the `[` (the label `related: ` is
  9 characters):
  `@if(greater(outputs('Rel_start'), -1), substring(outputs('Story_md'), add(outputs('Rel_start'), 9)), '[]')`
- **`Rel_line`** (Compose):
  `@if(greater(indexOf(outputs('Rel_tail'), decodeUriComponent('%0A')), -1), substring(outputs('Rel_tail'), 0, indexOf(outputs('Rel_tail'), decodeUriComponent('%0A'))), outputs('Rel_tail'))`
- **`Rel_json_safe`** (Compose) — a missing or bracket-less line
  degrades to no neighbors. (A line that passes the bracket test but
  is internally invalid JSON — a hand-edited sidecar — still throws
  in `Rel_entries`' `json()` and fails the run via the Catch; that
  residual is accepted, since only out-of-band edits produce it.)
  `@if(and(startsWith(trim(outputs('Rel_line')), '['), endsWith(trim(outputs('Rel_line')), ']')), trim(outputs('Rel_line')), '[]')`
- **`Rel_entries`** (Compose):
  `@take(json(outputs('Rel_json_safe')), int(outputs('Config_gen')?['NeighborCap']))`

Entries arrive score-ordered (RelatedRank sorts before rendering), so
"first Test Plan in the loop" below means "highest-scored related
Test Plan".

**G5 — `For_each_rel`** (Apply to each over `@outputs('Rel_entries')`,
concurrency 1). Each iteration is a Try scope plus a neutralizer so
one recycled/broken neighbor degrades silently instead of failing the
run:
- **`Try_neighbor`** (Scope):
  - **`Get_neighbor_row`** (Get item, Doc Index, Id
    `@{items('For_each_rel')?['doc']}`)
  - **`Neighbor_summary_capped`** (Compose) — list-field text is
    semi-trusted; strip quotes/newlines, cap length (the `Why_capped`
    treatment):
    `@take(replace(replace(coalesce(body('Get_neighbor_row')?['Summary'], ''), '"', ''), decodeUriComponent('%0A'), ' '), int(outputs('Config_gen')?['DigestSummaryCap']))`
  - **`Append_digest_line`** — Append to string variable
    `NeighborDigest`:
    `- [@{coalesce(body('Get_neighbor_row')?['DocKind']?['Value'], 'Other')}] "@{body('Get_neighbor_row')?['Title']}" — surface @{coalesce(body('Get_neighbor_row')?['Surface']?['Value'], '')}, release @{coalesce(body('Get_neighbor_row')?['TargetRelease'], '')}, PE @{coalesce(body('Get_neighbor_row')?['PE'], '')}: @{outputs('Neighbor_summary_capped')}@{decodeUriComponent('%0A')}`
  - **`If_testplan_neighbor`** (Condition):
    `@and(equals(coalesce(body('Get_neighbor_row')?['DocKind']?['Value'], ''), 'Test Plan'), not(empty(coalesce(body('Get_neighbor_row')?['TextFileUrl'], ''))))`
    — Yes branch (**G5b, the v2.0 surface split**): related Test Plans
    route by surface — same-surface plans are the best style/coverage
    exemplars (topically closest, taken before the fallback query is
    even considered); cross-surface plans describe the same feature
    area on another surface, which makes them REFERENCE FUNCTIONALITY,
    not style exemplars:
    - **`If_exemplar_slot`** (Condition):
      `@and(equals(coalesce(body('Get_neighbor_row')?['Surface']?['Value'], ''), coalesce(body('Get_story_row')?['Surface']?['Value'], '')), less(length(variables('ExemplarUrls')), 2))`
      — Yes: **`Collect_exemplar_url`** (Append to array variable
      `ExemplarUrls`, value
      `@{coalesce(body('Get_neighbor_row')?['TextFileUrl'], '')}`).
      — No: **`If_reference_slot`** (Condition):
      `@and(not(equals(coalesce(body('Get_neighbor_row')?['Surface']?['Value'], ''), coalesce(body('Get_story_row')?['Surface']?['Value'], ''))), less(length(variables('ReferenceUrls')), 2))`
      — Yes: **`Collect_reference_url`** (Append to array variable
      `ReferenceUrls`) — the value is an OBJECT, because the reference
      header needs title and surface at fetch time:

      ```json
      {
        "url": "@{coalesce(body('Get_neighbor_row')?['TextFileUrl'], '')}",
        "surface": "@{coalesce(body('Get_neighbor_row')?['Surface']?['Value'], '')}",
        "title": "@{replace(coalesce(body('Get_neighbor_row')?['Title'], ''), '\"', '')}"
      }
      ```

      (A same-surface plan arriving after both exemplar slots are
      full falls through both conditions and stays digest-only — it
      is never mis-slotted as a reference.)
- **`Neighbor_done`** (Compose, inputs `ok`) — configure run after:
  `Try_neighbor` has **Succeeded, Failed, Skipped, Timed out**. This
  is the neutralizer; without it a single failed iteration fails the
  loop and trips the Catch.

**G6 — exemplar fallback** — **`If_no_exemplar`** (Condition:
`@equals(length(variables('ExemplarUrls')), 0)`), Yes branch (this is
the first delivered instance of the "exact list query" follow-on
queued in `agent/QA_Agent_Setup.md` — deterministic where semantic
retrieval samples):
- **`Surface_escaped`** (Compose) — the what'snew escaping rule on
  anything interpolated into `$filter`:
  `@replace(coalesce(body('Get_story_row')?['Surface']?['Value'], 'Other'), '''', '''''')`
- **`Get_exemplars_q`** (Get items, Doc Index list): Filter Query
  `DocKind eq 'Test Plan' and IndexStatus eq 'Indexed' and Surface eq '@{outputs('Surface_escaped')}'`,
  Order By `Modified desc`, Top Count `12`.
- **`Filter_release_match`** (Filter array) — release preference is
  applied in memory from the one fetch (the curation §1 rule: no
  OData filter on a non-indexed column that a small sample can sort
  out), and only when the STORY actually has a release — a blank
  story release must fall through to the newest-two default, not
  "match" every release-less plan (typically the oldest, least
  curated ones; REVIEW_v2_5 DX-7): from
  `@body('Get_exemplars_q')?['value']`, where
  `@and(not(empty(coalesce(body('Get_story_row')?['TargetRelease'], ''))), equals(coalesce(item()?['TargetRelease'], ''), coalesce(body('Get_story_row')?['TargetRelease'], '')))`
- **`Exemplar_rows`** (Compose) — release-matched rows win outright,
  else the two newest for the surface:
  `@if(greater(length(body('Filter_release_match')), 0), take(body('Filter_release_match'), 2), take(coalesce(body('Get_exemplars_q')?['value'], json('[]')), 2))`
- **`For_each_exemplar_row`** (Apply to each over
  `@outputs('Exemplar_rows')`, concurrency 1): **`Queue_exemplar_url`**
  (Append to array variable `ExemplarUrls`, value
  `@{coalesce(items('For_each_exemplar_row')?['TextFileUrl'], '')}`).

A story with no related Test Plan AND no same-surface Test Plan in
the catalog generates with `ExemplarText` empty — the prompt tolerates
it (structure comes from the DRAFT SHAPE rules), the draft just leans
harder on the story alone; `Gen_summary` shows `exemplars=0`.

The reference lane has NO fallback query, deliberately: cross-surface
functional grounding is only ever taken from documents RelatedRank
actually linked to this story (shared keywords/issue ids) — a blind
"any test plan from another surface" query would ground drafts on
unrelated features. A story with no cross-surface related Test Plan
generates with `ReferenceText` empty (`Gen_summary` shows
`references=0`), exactly as every story did before v2.0.

**G7 — `For_each_exemplar`** (Apply to each over
`@variables('ExemplarUrls')`, concurrency 1), same per-item Try +
neutralizer pattern as G5:
- **`Try_exemplar`** (Scope):
  - **`Ex_path`** (Compose):
    `@{replace(item(), outputs('Config_gen')?['SiteUrl'], '')}`
  - **`If_ex_path_ok`** (Condition:
    `@startsWith(outputs('Ex_path'), '/')`), Yes branch:
    - **`Get_exemplar_md`** (Get file content using path, Infer
      Content Type **No**, File Path `@{outputs('Ex_path')}`)
    - **`If_ex_budget`** (Condition:
      `@less(length(variables('ExemplarText')), int(outputs('Config_gen')?['ExemplarCap']))`),
      Yes branch:
      - **`Append_exemplar`** — Append to string `ExemplarText`:
        `--- EXEMPLAR: @{last(split(outputs('Ex_path'), '/'))} ---@{decodeUriComponent('%0A')}@{take(base64ToString(body('Get_exemplar_md')?['$content']), int(outputs('Config_gen')?['ExemplarCap']))}@{decodeUriComponent('%0A%0A')}`
      - **`Inc_exemplar`** — Increment variable `ExemplarCount` by 1.
- **`Exemplar_done`** (Compose, inputs `ok`, run after `Try_exemplar`
  has **Succeeded, Failed, Skipped, Timed out**).

**G7b — `For_each_reference`** (v2.0; Apply to each over
`@variables('ReferenceUrls')`, concurrency 1, run after
`For_each_exemplar`), the G7 pattern over the reference objects —
note the `items(...)?['url']` reads, since the array holds objects:
- **`Try_reference`** (Scope):
  - **`Ref_path`** (Compose):
    `@{replace(coalesce(items('For_each_reference')?['url'], ''), outputs('Config_gen')?['SiteUrl'], '')}`
  - **`If_ref_path_ok`** (Condition:
    `@startsWith(outputs('Ref_path'), '/')`), Yes branch:
    - **`Get_reference_md`** (Get file content using path, Infer
      Content Type **No**, File Path `@{outputs('Ref_path')}`)
    - **`If_ref_budget`** (Condition:
      `@less(length(variables('ReferenceText')), int(outputs('Config_gen')?['ReferenceCap']))`),
      Yes branch:
      - **`Append_reference`** — Append to string `ReferenceText` —
        the header carries title AND surface, which the prompt's
        surface-parity rule keys on:
        `--- REFERENCE: @{coalesce(items('For_each_reference')?['title'], last(split(outputs('Ref_path'), '/')))} — surface @{coalesce(items('For_each_reference')?['surface'], '')} ---@{decodeUriComponent('%0A')}@{take(base64ToString(body('Get_reference_md')?['$content']), int(outputs('Config_gen')?['ReferenceCap']))}@{decodeUriComponent('%0A%0A')}`
      - **`Inc_reference`** — Increment variable `ReferenceCount` by 1.
- **`Reference_done`** (Compose, inputs `ok`, run after
  `Try_reference` has **Succeeded, Failed, Skipped, Timed out**).

**G8 — the prompt call** (the sweep's `Run_prompt` shape):
- **`Story_meta`** (Compose) — flow-composed from row fields, the
  semi-trusted lane (quotes stripped where a value lands mid-line):

  ```
  title: @{replace(coalesce(body('Get_story_row')?['Title'], ''), '"', '')}
  surface: @{coalesce(body('Get_story_row')?['Surface']?['Value'], 'Other')}
  target_release: @{coalesce(body('Get_story_row')?['TargetRelease'], '')}
  pe: @{replace(coalesce(body('Get_story_row')?['PE'], ''), '"', '')}
  dev: @{replace(coalesce(body('Get_story_row')?['Dev'], ''), '"', '')}
  doc_id: @{body('Get_story_row')?['ID']}
  ```

  (Tools and keywords ride along inside the sidecar's own metadata
  block, which is part of StoryText — no separate input needed.)
- **`Story_text_capped`** (Compose):
  `@take(outputs('Story_md'), int(outputs('Config_gen')?['StoryCap']))`
- **`Run_testplangen_prompt`** (AI Builder — Create text with GPT
  using a prompt / `aibuilderpredict_customprompt`): pick
  `LRS Test Plan Generation`;
  `StoryMeta` = `@{outputs('Story_meta')}`,
  `StoryText` = `@{outputs('Story_text_capped')}`,
  `RelatedDigest` = `@{if(empty(variables('NeighborDigest')), '(none)', variables('NeighborDigest'))}`,
  `ExemplarText` = `@{if(empty(variables('ExemplarText')), '(none)', variables('ExemplarText'))}`,
  `ReferenceText` = `@{if(empty(variables('ReferenceText')), '(none)', variables('ReferenceText'))}`.
  One call per run. Note `Story_meta` now runs after `For_each_reference`
  (was `For_each_exemplar` pre-v2.0).

**G9 — marker slice** (the F3 pattern with draft sentinels; the BEGIN
marker `[[[DRAFT BEGIN]]]` is 17 characters):
- **`Gen_text_raw`** (Compose):
  `@coalesce(outputs('Run_testplangen_prompt')?['body/responsev2/predictionOutput/text'], '')`
- **`Draft_begin`** (Compose):
  `@indexOf(outputs('Gen_text_raw'), '[[[DRAFT BEGIN]]]')`
- **`Draft_end`** (Compose) — `lastIndexOf`, so a marker echoed inside
  the draft body cannot truncate it (the brace-slice's greedy-close
  rule):
  `@lastIndexOf(outputs('Gen_text_raw'), '[[[DRAFT END]]]')`
- **`Draft_body`** (Compose):
  `@if(and(greater(outputs('Draft_begin'), -1), greater(outputs('Draft_end'), add(outputs('Draft_begin'), 17))), trim(substring(outputs('Gen_text_raw'), add(outputs('Draft_begin'), 17), sub(outputs('Draft_end'), add(outputs('Draft_begin'), 17)))), '')`
- **`If_draft_ok`** (Condition:
  `@not(empty(outputs('Draft_body')))`) — **No branch**:
  **`Terminate_no_draft`** (Terminate, status Failed, message:
  `Model reply was missing the DRAFT BEGIN/END markers (or they were
  misordered); nothing was written. Re-run once; if it repeats, test
  the prompt in the AI Builder pane — a TestPlanGenPromptVersion
  concern, see testplangen/CHANGES.md.`). Fail-closed is deliberate:
  an unmarked reply is an unvetted reply, and a half-parsed draft in
  the folder is worse than no draft. **Yes branch**: G10–G11.

**G10 — `Draft_banner`** (Compose) — provenance + the do-not-move
warning, prepended to the draft (note the truncation flag):

```
@{concat('<!-- machine-generated test-plan draft — TestPlanGen prompt ', outputs('Config_gen')?['TestPlanGenPromptVersion'], ' -->', decodeUriComponent('%0A'), '> **DRAFT — machine-generated, unreviewed.** Generated ', utcNow(), ' from user story doc ', body('Get_story_row')?['ID'], ' — "', replace(coalesce(body('Get_story_row')?['Title'], ''), '"', ''), '". Source sidecar: <', outputs('Story_url'), '>', if(greater(length(outputs('Story_md')), int(outputs('Config_gen')?['StoryCap'])), ' [story text truncated at StoryCap]', ''), decodeUriComponent('%0A'), '> Review every case and resolve all [VERIFY] items before use. Do NOT upload this file to the LocationReferencing Documents library or the LRS Doc Index library — finalize into the team test-plan format first (§4).', decodeUriComponent('%0A%0A'), outputs('Draft_body'), decodeUriComponent('%0A'))}
```

**G11 — `Save_draft`** (Create file — the `Save_sidecar` shape): site
`Config_gen.SiteUrl`, folder
`@{outputs('Config_gen')?['DraftFolder']}`, name
`TestPlanDraft__doc@{body('Get_story_row')?['ID']}__@{formatDateTime(utcNow(), 'yyyyMMdd-HHmmss')}.md`,
content `@{outputs('Draft_banner')}`.

Timestamped names, NOT the digest's fixed-name overwrite: the digest
is a queue snapshot, a draft is a work product a PE may be mid-edit
on — a re-run must never clobber one. Stale drafts are deleted by
hand (§4).

**G12 — `Catch_gen`** (Scope, run after `Try_gen` has **Failed, Timed
out** — the curation Catch verbatim, names swapped):
- **`Filter_failed_gen`** (Filter array): from `@result('Try_gen')`,
  where
  `@or(equals(item()?['status'], 'Failed'), equals(item()?['status'], 'TimedOut'))`
- **`Err_detail_gen`** (Compose):
  `@take(concat(coalesce(first(body('Filter_failed_gen'))?['name'], 'unknown-action'), ': ', string(coalesce(first(body('Filter_failed_gen'))?['error'], first(body('Filter_failed_gen'))?['outputs'], ''))), 4000)`
- **`Terminate_failed_gen`** (Terminate, status Failed, message
  `@{outputs('Err_detail_gen')}`). Nothing to clean up: the flow is
  read-only over every list, and the only write (G11) is the last
  act — a failed run leaves no partial state anywhere. Re-running is
  always safe.

**G13 — `Gen_summary`** (Compose, run after `Try_gen` [Succeeded] —
the F11 pattern):

```
@{concat('neighbors=', length(outputs('Rel_entries')), ' exemplars=', variables('ExemplarCount'), ' references=', variables('ReferenceCount'), ' digestChars=', length(variables('NeighborDigest')), ' storyChars=', length(outputs('Story_text_capped')), ' draftChars=', length(outputs('Draft_body')))}
```

`exemplars=0` on a story that should have peers = check §3-G6's
Surface value against the catalog; `references=0` is normal unless the
story's `related:` list actually carries a cross-surface Test Plan;
`draftChars` near zero never happens (G9 fails closed first).

**Cost**: 1 trigger + ~28 fixed actions + ~3 per related neighbor +
~5 per exemplar + ~5 per reference + ONE AI Builder call ≈ **35–65
actions + one AI call, per invocation, on demand** — noise next to
the sweep's ~2,500/day.

**Concurrency with the sweep**: this flow writes nothing the sweep
(or anything else) reads — it is read-only over Doc Index and the
sidecar library, and its single Create file lands in Shared
Documents. A run overlapping the nightly sweep at worst reads a
neighbor's sidecar mid-rewrite: the draft's related context is a few
hours stale, which the human review absorbs. No coordination needed.

Check (after building): flow saves with no expression errors; the AI
Builder action shows the `LRS Test Plan Generation` prompt bound
(designer-verify the binding, same as the sweep's `Run_prompt`); the
**Generate test plan draft**-capable flow appears under Automate on
the Doc Index list (rename the flow's menu label to
`Generate test plan draft` if the default shows the flow name).

## 4 — Review-loop runbook

- **Generate**: Doc Index list → select a User Story row (filter the
  view by DocKind) → Automate → **TestPlanGen**. The draft lands in
  `Shared Documents/Test Plan Drafts/` within a couple of minutes;
  the run history's `Gen_summary` shows what grounded it.
- **Review**: open the draft (SharePoint renders the markdown). Work
  top to bottom: verify every case's **Trace:** line actually points
  at something the story says; resolve every `[VERIFY: ...]` item;
  delete cases that don't survive scrutiny; add the cases only a
  human would know to add. Check enumeration coverage (the prompt
  v1.2 rule): every workflow, edit pathway, input method, and
  event/geometry type the story enumerates has at least one case —
  the doc 1 review (`review/REVIEW_TestPlanGen_doc1_coverage.md`)
  shows how grouped pathways ("Dynamic Segmentation & Attribute
  Table") silently collapse without this check. When the story has
  automation or documentation plans, the draft carries `Automation
  Notes` / `Documentation Impacts` sections — review their bullets'
  Trace lines the same way. Reference-grounded cases (prompt v1.3:
  cases whose Trace cites a cross-surface reference document) get one
  extra check: confirm the borrowed behavior actually applies on this
  story's surface — the draft must carry a surface-parity `[VERIFY]`
  item for them, and resolving it is part of this pass. The banner's
  warning line is the contract: nothing ships until this pass happens.
- **Finalize**: transfer the reviewed content into the team's normal
  test-plan format (pptx/docx). The draft file itself is an
  intermediate — it never becomes the document of record.
- **Close the loop**: upload the finished plan to the
  LocationReferencing Documents library. The nightly sweep indexes
  it, the prompt classifies it `Test Plan`, its sidecar files into
  `Test Plans/`, and RelatedRank links it back to the originating
  story through their shared keywords and issue ids — future
  TestPlanGen runs on neighboring stories will find it as an
  exemplar. No manual cataloging step exists or is needed.
- **Housekeeping**: delete drafts once finalized (or abandoned) —
  re-runs stack timestamped files and never clean up after
  themselves, by design. Even a misfiled draft cannot poison the
  catalog: the sweep never enumerates Shared Documents, and `.md` has
  no extraction lane, so a draft accidentally dropped into the source
  library lands as a Skipped row with no sidecar.

## 5 — Smoke suite

Run every row of `testplangen/TestPlanGen_Smoke.md` before trusting
the flow; record the run in `testplangen/CHANGES.md` (date, tenant,
pass/fail per row).

## Known limits (v1.0)

- **Input caps are blunt**: `StoryCap` truncates the story text tail
  (the banner flags it when it happens), `ExemplarCap` truncates or
  drops the second exemplar, and the digest carries summaries only —
  never neighbor bodies (they'd cost 50× the tokens for marginal
  signal). The caps in `Config_gen` are the knobs; trim priority is
  story > exemplar 1 > digest > exemplar 2.
- **The hallucination guard is prompt-side only** — mandatory Trace
  lines, no-invented-tools, `[VERIFY]`-not-fabricate — plus the human
  review gate. Unlike curation there is no row-validation equivalent:
  a test plan's claims aren't checkable against list rows. The review
  pass in §4 is a REQUIRED control, not a courtesy.
- **Exemplar quality tracks the catalog**: a story whose surface has
  no indexed Test Plans generates exemplar-free; a thin or stale
  `related:` list (story indexed yesterday, alias-split keywords
  pending the curation backfill) weakens the digest. Both surface in
  `Gen_summary`.
- **Release preference is winner-takes-all** (G6): when any
  release-matched exemplar exists it is used even if that means one
  exemplar instead of two mixed ones.
- **`$filter` on DocKind/Surface is fine at current corpus size** but
  those columns are not indexed; past ~5,000 Doc Index rows the G6
  query will need indexed columns (add them then — a schemas/ note,
  not a flow change).
- **Drafts are point-in-time snapshots**: a story edit or reindex
  after generation is not reflected; re-run to refresh. Old drafts
  accumulate until deleted (§4).
- No push/email notification when a draft lands — the PE who
  triggered it knows to look, and the flow is strictly on-demand
  (zero new connectors, the curation rule).

## Queued follow-ons (documented, not built)

- **Copilot Studio front-end** — SHIPPED in v1.1 as an importable
  agent file set: see `testplangen/agent/Agent_Setup.md`. Note its §1
  restructures this guide's §3 flow into a child flow
  (`TestPlanGenCore`) with two thin parents once the agent is
  deployed — the G-step bodies above stay the single source for the
  core's actions. Title→id resolution shipped there too (agent v1.4,
  `Agent_Setup.md` §1d `StoryLookupFlow` — doc id, devtopia issue #,
  or title text, all resolved deterministically).
- **Provenance export** — CLOSED in v1.2, inverted:
  `testplangen/flow/v1_0/definition.json` is now checked in as the
  authored source (the §3 Path A package carries it byte-identical);
  when the built flow next diverges, export and re-cut per the
  CHANGES v1.2 mechanics instead of re-authoring.
- **docx handoff**: convert the reviewed draft to a Word file on the
  team template (premium Word connector, or OneDrive convert-file)
  to shave the finalize step — deliberately deferred until the
  markdown loop beds in; it adds a connector and a template
  dependency for a formatting convenience.
- **Coverage matrix once flow #2 exists**: when Issue Refs has a
  feeder, a story's issue ids can drive a deterministic
  "requirements × cases" trace table appended to the draft, and a
  gap report (story ids with no covering Test Plan) becomes a cheap
  weekly digest in the curation mold.
