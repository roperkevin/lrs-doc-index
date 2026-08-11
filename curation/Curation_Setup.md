# Keyword Curation Setup — build and deploy (v1.0)

A new, separate Power Automate flow, **KeywordCuration**: weekly, one
AI Builder call over the full canonical vocabulary, proposing
alias→canonical merges for a human to approve. The flow NEVER writes
`CanonicalRef` — it writes only its two columns (`CurationStatus`,
`ProposedCanonical`); a human approves by setting the lookup, and the
flow cleans up after them on the next run.

This component ships as a build guide, not a `definition.json`: a
brand-new flow has no package skeleton to import (the `flow/` zips are
re-cuts of a prior package), and the flow is ~30 actions — buildable
from §3 in under an hour. Once built, exporting it and checking in
`curation/flow/v1_0/definition.json` for provenance is a queued
follow-on.

Everything below is manual portal/designer work in the
`designer-edits.md` mold: apply in order, check after each step. All
expressions are pure WDL. List GUIDs and build mechanics are from
`docs/SP_Adaptation_Notes.md` (Keywords =
`e096ab26-27d2-4ef4-ae40-c24e35fa2fb7`).

---

## 0 — Prerequisites

- Maker access to the environment holding DocIndexSweep, the same
  SharePoint connection, and AI Builder capacity for one custom-prompt
  call per week.
- The sweep is at v2.4+ (the `Check_kw` single-escape and
  `Get_keywords` `$top 5000` are assumed — both shipped by v2.4).

Check: open the Keywords list; confirm Title/Kind/CanonicalRef/Notes
match `schemas/SPList_Keywords.csv`.

## 1 — Two new Keywords columns

Per the updated `schemas/SPList_Keywords.csv`, create with internal
names first (first-created name = internal name, forever — rename
display names after, if wanted):

- **CurationStatus** — Choice; values exactly `Proposed` and
  `Rejected`, no fill-in choices, no default.
- **ProposedCanonical** — Single line of text, plain.

Neither is a lookup → modern list settings are fine (no classic-UI
requirement). **No index needed**: the flow filters these in memory
from one `$top 5000` fetch, never via OData `$filter`.

Column ownership, the invariant everything below relies on: the sweep
writes `Title`/`Kind` and reads `CanonicalRef`; humans write
`CanonicalRef`, `CurationStatus = Rejected`, and `Notes`; this flow
writes ONLY `CurationStatus`/`ProposedCanonical`, via field-scoped
MERGE. Disjoint writers — no coordination needed.

Check: the usual signed-in REST fields query
(`.../_api/web/lists(guid'e096ab26-27d2-4ef4-ae40-c24e35fa2fb7')/fields?$filter=InternalName eq 'CurationStatus' or InternalName eq 'ProposedCanonical'`)
returns both with the exact internal names.

## 2 — The AI Builder prompt

Create a custom prompt named `LRS Keyword Curation`. Two input
parameters, exact names: **Vocabulary**, **DoNotPropose**. Paste the
delimited block from `curation/KeywordCuration_Prompt_v1_0.md`
verbatim. Record `CurationPromptVersion: v1.0` in
`curation/CHANGES.md`.

This prompt versions independently: bumping it never touches
`Config.PromptVersion` (nothing here reindexes the corpus).

Check: test the prompt in the AI Builder pane with a six-line
Vocabulary containing a plural pair and the `route editing` /
`event editing` decoys, empty DoNotPropose → reply is a bare JSON
object proposing only the plural pair.

## 3 — Build the flow

New flow **KeywordCuration**, same environment and SharePoint
connection as the sweep. Actions in order (names exactly as written —
later expressions reference them):

**Trigger — Recurrence**: Week, `Saturday`, 08:00,
`US Mountain Standard Time`. Rationale: maximally distant from the
sweep's daily 17:00 Mountain run (belt-and-suspenders — see the
concurrency note at the end of this section), and the proposal queue
is fresh for Monday.

**T1 — `Config_cur`** (Compose):

```json
{
  "SiteUrl": "https://esriis.sharepoint.com/sites/lrsworkspace",
  "KeywordsList": "e096ab26-27d2-4ef4-ae40-c24e35fa2fb7",
  "DigestFolder": "/Shared Documents",
  "DigestName": "Keyword_Curation_Digest.md",
  "MaxProposals": 20,
  "CurationPromptVersion": "v1.0"
}
```

**T2 — Initialize variables** (four): `ProposalLines` (String, value
`@{string('')}` — the empty-value designer-trap guard),
`WrittenCount` / `DroppedCount` / `ClearedCount` (Integer, 0).

**T3 — `Try_curation`** (Scope) containing C1–C12:

**C1 — `Get_keywords_all`** (Get items, Keywords list, Top Count
`5000`, no filter — aliases are needed too, for validation).

**C2 — `Filter_stale_state`** (Filter array) — approved-cleanup pass.
From `@body('Get_keywords_all')?['value']`, where (advanced mode):

```
@and(not(empty(item()?['CanonicalRef'])), or(not(empty(item()?['CurationStatus']?['Value'])), not(empty(item()?['ProposedCanonical']))))
```

> Designer-verify (F2/Old_sidecar_url-class caution): confirm on a raw
> `Get_keywords_all` output that the choice column surfaces as
> `CurationStatus.Value` on your tenant. If it surfaces as a bare
> string, drop every `?['Value']` in this guide.

**C3 — `For_each_approved`** (Apply to each over
`@body('Filter_stale_state')`, concurrency 1):
- **`Clear_state`** — Send an HTTP request to SharePoint
  (`HttpRequest`, the `Create_dockw` shape plus the two MERGE
  headers). Site `Config_cur.SiteUrl`, method `POST`, uri:

  ```
  _api/web/lists(guid'e096ab26-27d2-4ef4-ae40-c24e35fa2fb7')/items(@{items('For_each_approved')?['ID']})
  ```

  Headers: `Accept` and `Content-Type` both
  `application/json;odata=nometadata`, `IF-MATCH` `*`,
  `X-HTTP-Method` `MERGE`. Body:

  ```json
  {"CurationStatus": null, "ProposedCanonical": null}
  ```

  (Field-scoped MERGE, not Update item — Title/Kind/required fields
  are never touched.)
- **`Inc_cleared`** — Increment variable `ClearedCount` by 1.

**C4 — `Filter_canonical_cur`** (Filter array): from
`@body('Get_keywords_all')?['value']`, where
`@empty(item()?['CanonicalRef'])` — the merge-target universe
(mirrors the sweep's `Filter_canonical`).

**C5 — vocabulary lines** —
- **`Select_vocab`** (Select): from `@body('Filter_canonical_cur')`,
  map (text mode):
  `@concat(item()?['Title'], ' [', coalesce(item()?['Kind']?['Value'], ''), ']')`
- **`Vocab_lines`** (Compose):
  `@join(body('Select_vocab'), decodeUriComponent('%0A'))`

**C6 — blocked lines** (Rejected + still-pending Proposed, excluded
from the model's proposal surface) —
- **`Filter_blocked`** (Filter array): from
  `@body('Filter_canonical_cur')`, where
  `@not(empty(coalesce(item()?['CurationStatus']?['Value'], '')))`
- **`Select_blocked`** (Select, text mode): `@item()?['Title']`
- **`Blocked_lines`** (Compose):
  `@join(body('Select_blocked'), decodeUriComponent('%0A'))`

**C7 — `Run_curation_prompt`** (AI Builder — Create text with GPT
using a prompt / `aibuilderpredict_customprompt`): pick
`LRS Keyword Curation`; `Vocabulary` = `@{outputs('Vocab_lines')}`,
`DoNotPropose` = `@{outputs('Blocked_lines')}`. One call per run.

**C8 — parse (the sweep's F3 pattern verbatim)** —
- **`Cur_text_raw`** (Compose):
  `@coalesce(outputs('Run_curation_prompt')?['body/responsev2/predictionOutput/text'], '{}')`
- **`Cur_json_slice`** (Compose):

  ```
  @if(and(greater(indexOf(outputs('Cur_text_raw'), '{'), -1), greater(lastIndexOf(outputs('Cur_text_raw'), '}'), indexOf(outputs('Cur_text_raw'), '{'))), substring(outputs('Cur_text_raw'), indexOf(outputs('Cur_text_raw'), '{'), add(sub(lastIndexOf(outputs('Cur_text_raw'), '}'), indexOf(outputs('Cur_text_raw'), '{')), 1)), '{}')
  ```

- **`Parse_proposals`** (Compose): `@json(outputs('Cur_json_slice'))`
- **`Proposals`** (Compose):
  `@take(coalesce(outputs('Parse_proposals')?['proposals'], json('[]')), outputs('Config_cur')?['MaxProposals'])`
  — a fence-wrapped or prose-wrapped reply degrades to a
  zero-proposal run. (A reply whose outermost-brace slice is still
  invalid JSON — e.g. truncated output — throws in `Parse_proposals`
  and fails the run visibly; the Saturday schedule retries it. Only
  the *wrapping* failure modes degrade silently.)

**C9 — pending carryover** (still-unreviewed proposals stay visible in
every digest) —
- **`Filter_pending`** (Filter array): from
  `@body('Get_keywords_all')?['value']`, where
  `@and(empty(item()?['CanonicalRef']), equals(coalesce(item()?['CurationStatus']?['Value'], ''), 'Proposed'))`
- **`For_each_pending`** (Apply to each, concurrency 1):
  **`Append_pending_line`** — Append to string variable
  `ProposalLines`:
  `- (pending) '@{items('For_each_pending')?['Title']}' → @{items('For_each_pending')?['ProposedCanonical']}@{decodeUriComponent('%0A')}`

**C10 — `For_each_proposal`** (Apply to each over
`@outputs('Proposals')`, concurrency 1):
- **`Alias_lower`** (Compose):
  `@toLower(trim(coalesce(items('For_each_proposal')?['alias'], '')))`
- **`Canon_lower`** (Compose):
  `@toLower(trim(coalesce(items('For_each_proposal')?['canonical'], '')))`
- **`Find_alias`** (Filter array): from
  `@body('Get_keywords_all')?['value']`, where
  `@equals(toLower(item()?['Title']), outputs('Alias_lower'))`
- **`Find_canon`** (Filter array): same, over `outputs('Canon_lower')`
- **`If_valid_proposal`** (Condition, advanced mode) — the
  hallucination guard; in-memory, zero extra list queries, and the
  model cannot invent rows:

  ```
  @and(not(empty(body('Find_alias'))), not(empty(body('Find_canon'))), not(equals(outputs('Alias_lower'), outputs('Canon_lower'))), empty(first(body('Find_alias'))?['CanonicalRef']), empty(coalesce(first(body('Find_alias'))?['CurationStatus']?['Value'], '')), empty(first(body('Find_canon'))?['CanonicalRef']))
  ```

  **Yes branch**:
  - **`Why_capped`** (Compose) — model output is semi-trusted; strip
    quotes/newlines, cap length before it lands in a list column:
    `@take(replace(replace(coalesce(items('For_each_proposal')?['why'], ''), '"', ''), decodeUriComponent('%0A'), ' '), 160)`
  - **`Body_proposal`** (Compose):

    ```json
    {
      "CurationStatus": "Proposed",
      "ProposedCanonical": "@{concat(first(body('Find_canon'))?['Title'], ' — ', outputs('Why_capped'))}"
    }
    ```

  - **`Write_proposal`** — HttpRequest MERGE, identical shape to
    `Clear_state`, uri
    `_api/web/lists(guid'e096ab26-27d2-4ef4-ae40-c24e35fa2fb7')/items(@{first(body('Find_alias'))?['ID']})`,
    body `@{string(outputs('Body_proposal'))}`.
  - **`Append_proposal_line`** — Append to string `ProposalLines`:
    `- '@{first(body('Find_alias'))?['Title']}' → '@{first(body('Find_canon'))?['Title']}' — @{outputs('Why_capped')}@{decodeUriComponent('%0A')}`
  - **`Inc_written`** — Increment `WrittenCount` by 1.

  **No branch**: **`Inc_dropped`** — Increment `DroppedCount` by 1.

**C11 — `If_any_lines`** (Condition:
`@not(empty(variables('ProposalLines')))`) — Yes branch:
- **`Digest_body`** (Compose):

  ```
  @concat('# Keyword curation digest', decodeUriComponent('%0A%0A'), 'Run: ', utcNow(), '  ·  CurationPromptVersion: ', outputs('Config_cur')?['CurationPromptVersion'], decodeUriComponent('%0A%0A'), 'Approve: open the Keywords row, set CanonicalRef to the named row.', decodeUriComponent('%0A'), 'Reject: set CurationStatus = Rejected.', decodeUriComponent('%0A'), 'Review view: Keywords → Curation queue.', decodeUriComponent('%0A%0A'), variables('ProposalLines'))
  ```

- **`Save_digest`** (Create file — the `Save_sidecar` shape): site
  `Config_cur.SiteUrl`, folder `@{outputs('Config_cur')?['DigestFolder']}`,
  name `@{outputs('Config_cur')?['DigestName']}`, content
  `@{outputs('Digest_body')}`. Fixed name = idempotent overwrite; the
  digest always shows the full current queue (pending + new).

  > The digest deliberately lives in **Shared Documents**, NOT the LRS
  > Doc Index library — the Q&A agent grounds on that entire library
  > (`agent/QA_Agent_Setup.md` §2) and must not ingest curation
  > chatter as document knowledge.

**T4 — `Catch_curation`** (Scope, run after `Try_curation` has
**Failed, Timed out** — the sweep's Catch pattern, trimmed):
- **`Filter_failed_cur`** (Filter array): from
  `@result('Try_curation')`, where
  `@or(equals(item()?['status'], 'Failed'), equals(item()?['status'], 'TimedOut'))`
- **`Err_detail_cur`** (Compose):
  `@take(concat(coalesce(first(body('Filter_failed_cur'))?['name'], 'unknown-action'), ': ', string(coalesce(first(body('Filter_failed_cur'))?['error'], first(body('Filter_failed_cur'))?['outputs'], ''))), 4000)`
- **`Terminate_failed`** (Terminate, status Failed, message
  `@{outputs('Err_detail_cur')}`). No status rows to write — the
  failure is visible in run history and the owner's standard failure
  email, and next Saturday retries from scratch: the run is idempotent
  (already-Proposed rows are excluded by the C10 guards, `Clear_state`
  re-clears harmlessly, the digest overwrites).

**T5 — `Cur_summary`** (Compose, run after `Try_curation`
[Succeeded] — the sweep's F11 pattern):

```
@{concat('canon=', length(body('Filter_canonical_cur')), ' blocked=', length(body('Filter_blocked')), ' proposed_by_model=', length(outputs('Proposals')), ' written=', variables('WrittenCount'), ' dropped=', variables('DroppedCount'), ' cleared=', variables('ClearedCount'))}
```

`dropped` trending high = the model inventing rows or re-proposing
blocked ones — tighten the prompt (a `CurationPromptVersion` bump).

**Cost**: 1 trigger + ~14 fixed actions + ONE AI Builder call +
2/approved row + ~7/valid proposal + 3 digest ≈ **30–100 actions +
one AI call, weekly** — noise next to the sweep's ~2,500/day.

**Concurrency with the sweep**: this flow reads the same Keywords list
but the writers are disjoint by column (§1 invariant), so even an
overlapping run is safe. Worst race: a human sets CanonicalRef between
this flow's fetch and a proposal write → a stale `Proposed` lands on a
just-aliased row; the sweep never reads the curation columns, and next
week's C2/C3 cleanup clears it. Self-healing.

Check (after building): flow saves with no expression errors; the
AI Builder action shows the `LRS Keyword Curation` prompt bound
(designer-verify the binding, same as the sweep's `Run_prompt`).

## 4 — The Curation queue view

Keywords list → create view **Curation queue**: filter
`CurationStatus` is equal to `Proposed`; columns Title, Kind,
ProposedCanonical, CanonicalRef, Notes, Modified; sort Modified
descending. Optional second view **Rejected log**
(`CurationStatus eq Rejected`).

Check: hand-set `CurationStatus = Proposed` on any row → it appears in
the view; clear it → gone.

## 5 — Smoke suite (run before trusting the schedule)

1. **Seed** four synthetic canonical rows (Kind `topic`), prefixed so
   they're unmistakably fake: `zz-test centerline`,
   `zz-test centerlines`, `zz-route editing`, `zz-event editing`.
   (The `zz-` prefix keeps them visibly synthetic in
   `ExistingKeywords` if a sweep runs before cleanup — delete them
   the same day, step 7.)
2. **Manual run** (Test → Manually). Check: exactly the plural ALIAS
   row (`zz-test centerlines`) gets `CurationStatus = Proposed` and
   `ProposedCanonical` starting `zz-test centerline — ` — the
   canonical `zz-test centerline` row itself stays untouched by
   design (§1 ownership invariant); the route/event pair untouched;
   `Cur_summary` counts add up; the digest file exists in Shared
   Documents and lists the pair; the pair shows in the Curation queue
   view.
3. **Approve**: set CanonicalRef on `zz-test centerlines` →
   `zz-test centerline`. Re-run. Check: both curation columns cleared
   (`cleared=1`), not re-proposed.
4. **Reject path**: clear that CanonicalRef; hand-set
   `CurationStatus = Proposed` + a `ProposedCanonical` value; then set
   `CurationStatus = Rejected`. Re-run. Check: not re-proposed
   (`blocked=1`), state intact.
5. **Parse probe** (the sweep's F3 test, adapted): temporarily hard-set
   `Cur_text_raw` to the literal
   `Here you go: {"proposals":[{"alias":"zz-test centerlines","canonical":"zz-test centerline","why":"plural"}]}`
   → verify parse + write, then revert. Then a literal with a
   nonexistent alias → `dropped=1`, nothing written (the hallucination
   guard).
6. **Sweep interaction**: with the step-3 approval re-applied,
   sweep-smoke (`Config.SmokeFile`) a doc whose text yields the alias
   term → the DocKeywords row's Keyword lookup is the canonical row
   (the sweep's existing `Canonical_id_found` path, now exercised by a
   real alias).
7. **Cleanup**: delete the four seed rows and any seed junction rows
   from step 6; the next real run overwrites the digest.

Record the run in `curation/CHANGES.md` (date, tenant, steps passed).

## 6 — Review-loop runbook

- **Approve**: open the row (Curation queue view), set **CanonicalRef**
  via the lookup picker to the row named at the start of
  `ProposedCanonical`. Don't bother clearing the curation columns —
  the next run does (clearing by hand is harmless). Optionally note
  the reasoning in `Notes` (human-owned).
- **Reject**: set **CurationStatus = Rejected**; leave
  `ProposedCanonical` as the record of what was declined. The row is
  excluded from all future candidate and proposal sets.
- **Invert direction** (rare — you decide the *proposed alias* should
  be the canonical): set CanonicalRef on the OTHER row (the one named
  in the proposal) pointing back at the proposed row, and clear the
  proposed row's two curation columns by hand. The automatic cleanup
  keys on "CanonicalRef set on a row carrying curation state" and
  won't see the inverted case.
- **What approval buys immediately**: on the sweep's next run the
  alias resolves at index time (`Canonical_id_found` =
  `coalesce(CanonicalRef.Id, ID)`) — all *future* DocKeywords rows
  point at the canonical row — and `Filter_canonical` drops the alias
  from the `ExistingKeywords` spelling reference, so the indexing
  prompt stops seeing the variant.

## Known limits (v1.0)

- **Rejection memory is row-level**: a Rejected row never gets a
  *different* merge proposed either. Manual aliasing always remains
  available; the Rejected log view is the audit trail.
- **History stays split until the librarian backfill**: an approved
  merge fixes the vocabulary and all future junction rows, but
  existing DocKeywords rows keep pointing at the alias row, so
  RelatedRank undercounts keyword overlap between old docs (alias id)
  and new docs (canonical id) for that term. A *reindex* of an old doc
  does not clean its stale row either — the sweep only creates missing
  KWKey rows, never deletes — so a reindexed doc carries both
  `{doc}|{aliasId}` and `{doc}|{canonicalId}` rows: harmless noise,
  but real, and the backfill pass must handle it.
- **Stale `Proposed` after manual inversion** (runbook above) needs
  the by-hand clear.
- The digest is a snapshot file, not a notification — check the
  Curation queue view or the digest Monday morning; there is no
  push/email channel by design (zero new connectors).

## Queued follow-ons (documented, not built)

- **Junction re-point (the librarian backfill piece)** — in the C2/C3
  cleanup pass, for each approved alias row A with canonical C:
  `Get items` DocKeywords (`68752782-6d2d-4c65-b4e8-361c0df706ec`)
  `$filter: KeywordId eq {A.ID}`, `$top 5000`; for each row R — if a
  row with `KWKey eq '{R.DocumentId}|{C.ID}'` already exists, DELETE R
  (HttpRequest DELETE, `IF-MATCH: *`) since the doc already carries
  the canonical; else MERGE R: `KeywordId = {C.ID}`, `KWKey =
  '{R.DocumentId}|{C.ID}'`, `Title` recomposed from the existing
  Title's `' | '` prefix + the canonical title. Concurrency 1, in the
  Saturday slot so no sweep is mid-flight; ~2 actions per historical
  junction row. Ship it as its own smoke-tested increment once the
  propose/approve loop has bedded in — DocKeywords is RelatedRank's
  input, and a re-point bug silently reshapes related-doc ranking
  corpus-wide.
- **Provenance export**: export the built flow and check in
  `curation/flow/v1_0/definition.json`, the way `flow/` versions
  accrete.
- **Usage counts as a prompt input** (junction rows per keyword) to
  inform merge direction — cheap once the re-point pass exists.
