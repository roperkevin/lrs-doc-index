# Flow v2.5 — sidecar identity is the Doc Index row id

v2.5 is v2.4 plus one fix: the id a sidecar carries is now the same id
everything else in the system uses.

## The bug

Since v2.2, `Sidecar_name` (`{title-slug}__doc{ID}.md`) and the
sidecar's `doc_id:` metadata line were minted from
`items('For_each_file')?['ID']` — the item id of the **source file in
the LocationReferencing Documents library**. But every other consumer
of "the doc's id" uses the **Doc Index list row id** (`Doc_item_id`):
`Id_key` / `Link_key` edges, RelatedRank's `selfId`, the `related:`
entries' `doc` numbers, TestPlanGen's `Get_story_row` (a Get-item
against the Doc Index list), and both agents' instructions ("the
doc_id in the sidecar = the number in the list's ID column").

Those are two unrelated SharePoint id spaces. The claim happened to
look plausible — both are small integers — but any corpus sidecar
proves the drift: its `related:` entries pair a `doc` number with a
filename whose `__docNN` suffix disagrees
(`{"doc":535,"file":"...__doc411.md"}`). Observed failure: a user
feeds a sidecar's `doc_id` to the TestPlanGen agent and the flow
grounds against whatever unrelated row sits at that number — or the
guard rejects it as not-a-user-story.

## The fix

The row upsert moves ahead of the sidecar write, so the row id exists
before anything is named or stamped with it:

- **`If_doc_exists`** (with `Create_doc` / `Update_doc` inside) now
  runs directly after `Run_regex` — everything its payloads reference
  (prompt fields, regex output, lane variables, preview) is already
  available there. Both payloads drop `item/TextFileUrl`, which does
  not exist yet at that point.
- **`Doc_item_id`** (unchanged expression) follows, then a new
  **`Set_DocRowId`** stores it in a new string variable `DocRowId`
  (`Init_DocRowId` at top level, `Reset_DocRowId` per doc in
  `Try_index`) — the error catch needs it, see below.
- **`Sidecar_name`** and the `doc_id:` line in **`Sidecar_header`**
  now use `outputs('Doc_item_id')`. Filename `__docNN`, sidecar
  `doc_id`, `related:` `doc` numbers, and the list's ID column are
  finally the same number.
- After `Save_sidecar` → `Text_file_url` → `If_sidecar_moved`, a new
  **`Set_text_url`** (Update item, id `int(outputs('Doc_item_id'))`)
  patches `TextFileUrl` onto the row (plus the required columns
  Title / DocKey / FileName / IndexStatus, the `Update_doc_error`
  minimal-payload pattern). `For_each_id` runs after it; everything
  downstream is untouched.
- **`Catch_index`** must not duplicate the row the early upsert just
  minted: `If_err_exists`'s create-vs-update test becomes
  `and(empty(variables('DocRowId')), empty(body('Check_indexed')?['value']))`,
  and `Update_doc_error`'s id becomes
  `if(empty(variables('DocRowId')), first(body('Check_indexed')?['value'])?['ID'], int(variables('DocRowId')))`
  — a failure after the upsert updates the new row to Error instead
  of creating a DocKey twin.

Deliberately unchanged: the media prefixes
(`../media/doc{ID}_...` on `Zip_extract_pptx`/`Zip_extract_docx` and
the `Save_img_*` names) keep the source file's id. Extraction runs
before the prompt (whose output the upsert needs), so the row id
cannot exist yet there; media names are an opaque namespace nothing
equates with `doc_id`, and keeping them file-id-keyed leaves the
already-saved media valid across the backfill.

Known window, accepted: a brand-new doc's row exists as Indexed with
an empty `TextFileUrl` between the upsert and `Set_text_url`
(seconds). Every consumer already guards on `TextFileUrl` being
non-empty (TestPlanGen's `Guard_story` explicitly), and a failure
inside the window flips the row to Error via the catch, which regates
it for the next run.

## Version-gated backfill

`Config.PromptVersion` bumps `v1.6` → `v1.7`. **Format-only — the
prompt text is unchanged and must NOT be re-pasted.** The bump drives
the standard converging backfill (~150 docs/day): each reindex renames
the sidecar to its row-id name, `If_sidecar_moved` recycles the old
file-id-named copy, `Set_text_url` repoints the row, and reciprocal
patches heal neighbors' `related:` bullets. During the convergence
window (~4 days at ~600 docs) an unmigrated sidecar still carries its
old file-id `doc_id` — when in doubt the list's ID column is
authoritative, which is what the agent instructions now say
(`testplangen/agent/`, `agent/QA_Agent_Instructions_v1_1.md`).

## Install order (existing tenant)

1. Import `DocIndexSweep_v2_5.zip` (as Update), or apply designer
   edits R1–R7 below to the live flow.
2. Prompt: no change — do NOT re-paste; the `v1.7` bump is format-only.
3. Scripts: no changes — nothing to re-paste, no re-picks beyond the
   standing every-import checks below.
4. Copilot Studio: update the TestPlanGen agent's instructions and the
   `askStoryId` question text from `testplangen/agent/`, and the Q&A
   agent's instructions from `agent/QA_Agent_Instructions_v1_1.md`
   (portal paste, no flow work).

## REQUIRED after every import — not optional

Unchanged from v2.4: re-pick the six Run-script actions on a fresh
tenant (real bindings ship for the home tenant), re-verify the prompt
action's binding, `Get_files` pagination threshold 20000, and the
`Old_sidecar_url` designer-verify (hyperlink-as-string vs object).

Then one smoke run (`Config.SmokeFile`) over an already-indexed pptx,
checking: the new sidecar's filename `__docNN` equals the row's ID
column value; the metadata `doc_id:` equals it too; the old
file-id-named copy is in the recycle bin; the row's `TextFileUrl`
points at the new name; a `related:` entry written by the run pairs
`doc` and `file` numbers that agree for migrated neighbors.

## Designer edits (applying v2.5 to the live flow without re-import)

Expressions in designer form; copy exact action inputs from
`flow/v2_5/definition.json` where marked (→ defn).

- **R1 — `Config`**: `PromptVersion` literal `v1.6` → `v1.7`.
- **R2 — top level**: new Initialize variable `Init_DocRowId`
  (String, empty) after `Init_SrcEdited`; repoint `Get_keywords`'s
  run-after to `Init_DocRowId`.
- **R3 — `Try_index`**: new Set variable `Reset_DocRowId` (empty
  string) after `Reset_SrcEdited`; repoint `Switch_ext`'s run-after
  to `Reset_DocRowId`.
- **R4 — move the upsert**: change `If_doc_exists`'s run-after to
  `Run_regex`; delete the `TextFileUrl` field from both `Create_doc`
  and `Update_doc`. `Doc_item_id` keeps its run-after
  (`If_doc_exists`); add Set variable `Set_DocRowId` =
  `outputs('Doc_item_id')` after it.
- **R5 — re-key the sidecar**: `Sidecar_name`'s run-after →
  `Set_DocRowId`; in its expression and in `Sidecar_header`'s
  `doc_id:` line, replace `items('For_each_file')?['ID']` with
  `outputs('Doc_item_id')`.
- **R6 — write back the url**: new Update item `Set_text_url` after
  `If_sidecar_moved` — id `int(outputs('Doc_item_id'))`, fields
  Title / DocKey / FileName / IndexStatus = Indexed / TextFileUrl =
  `outputs('Text_file_url')` (→ defn); repoint `For_each_id`'s
  run-after to `Set_text_url`.
- **R7 — `Catch_index`**: `If_err_exists`'s condition gains the
  `empty(variables('DocRowId'))` conjunct; `Update_doc_error`'s id →
  the `if(empty(variables('DocRowId')), ..., int(variables('DocRowId')))`
  form (→ defn).

Smoke test after R1–R7: same as the post-import smoke run above.

## Cost

+3 actions per indexed doc (two variable sets + one Update item) and
one extra list write per doc; at `MaxDocsPerRun` 150 that is +450
actions/run, still inside the ~2,500-actions/run envelope. No new
Run-script calls, no new queries, no schema changes.

## Verification record

- `flow/v2_5/definition.json` machine-validated (2026-08-11): JSON
  parses; every `runAfter` reference resolves within its scope; the
  only remaining `items('For_each_file')?['ID']` uses are the four
  media-prefix/name sites (deliberate, above); `Sidecar_name`,
  `Sidecar_header`, `Id_key`, `Link_key`, `Self_meta` all key on
  `Doc_item_id`.
- `review/harness/` not re-run: no script changes, and the sidecar
  header format is unchanged (`doc_id:` remains a bare integer —
  only which integer changed), so the v2.4 record stands.

## Addendum (2026-08-11) — newest-first sweep order

`Get_files` gains `Order By` = `Modified desc`, so each run walks the
library newest-edited-first. `If_process` spends the `MaxDocsPerRun`
budget (150) in iteration order, so this changes who gets indexed
today: fresh uploads and just-edited documents index on the next run
instead of waiting behind the alphabetical/default walk, and the
`v1.7` backfill migrates the most recently touched part of the corpus
first. Converged behavior is unchanged — the same rows eventually
reprocess; only the order moves.

Two notes:

- The sort column is the **library's Modified** — the same column the
  reindex gate compares (`SourceModified`). The document-property
  last-edited time (`dcterms:modified` → `SourceEdited`) cannot drive
  the query: it lives inside the file and is only known after
  extraction. For "run on recent items first" the library column is
  the right signal anyway — it moves on upload and edit.
- Large-list caveat: SharePoint rejects `$orderby` on a non-indexed
  column once a list passes the 5,000-item view threshold
  (auto-indexing usually covers lists under 20k, but not guaranteed).
  The library is ~600 docs today; if it ever grows past ~5,000
  items, add a column index on Modified in library settings — or
  drop the Order By and accept default order.

The definition and `DocIndexSweep_v2_5.zip` in this folder carry the
addendum. No PromptVersion change (processing order is not a format),
no script, schema, or prompt changes.

- **R8 — `Get_files`**: set the action's **Order By** field to
  `Modified desc`.

Smoke check: run history → `Get_files` raw outputs — the first items
in `value` are the library's most recently modified files; a
just-uploaded smoke file indexes on the immediately following full
sweep even with a large Pending backlog.

## Addendum (2026-08-11) — review fixes FL-1/FL-2 (R9–R11)

Two fixes from the full-codebase review (`review/REVIEW_v2_5.md`),
both in the PromptVersion plumbing. No format change — the sidecars
are byte-identical — so **no PromptVersion bump**; no script, schema,
or prompt changes.

**FL-1 — Skipped rows never received a bumped PromptVersion.** The
`Needs_index` gate reprocesses ANY row whose PromptVersion trails
Config's, Skipped included — but only `Create_doc_skipped` wrote the
version; `Update_doc_skipped` didn't. So every version bump turned
every existing Skipped row (pdf/html/msg + F2-oversize files) into a
permanent daily `MaxDocsPerRun` slot burn: reconsidered every run,
never converging, jumping the queue under the R8 newest-first order.
R9 makes each bump reconsider each Skipped doc exactly once.

**FL-2 — the R4 upsert reorder opened a crash window.** With the row
upsert moved before the sidecar write, `Create_doc`/`Update_doc`
stamped `Indexed` + the current PromptVersion before the sidecar
existed. A run abort in that window (cancellation, outage — nothing
`Catch_index` sees) left the row satisfying all four `Needs_index`
legs: permanently done, sidecar stale or missing — and if the abort
landed after the recycle, `TextFileUrl` pointed into the recycle bin.
R10 moves the stamp to `Set_text_url`, the last write of the pipeline:
an aborted run now leaves the version empty (create path) or stale
(update path), so the row regates next run and self-heals. R11 closes
the residual sliver by patching the row's URL before recycling the old
copy. The documented "seconds of empty TextFileUrl" window is
unchanged; what's gone is the *unrecoverable* state.

- **R9 — `Update_doc_skipped`** (If_has_text → else → If_skip_exists):
  add field `PromptVersion` = `outputs('Config')?['PromptVersion']`
  (the same value `Create_doc_skipped` already writes).
- **R10 — move the stamp**: delete the `PromptVersion` field from both
  `Create_doc` and `Update_doc`; add field `PromptVersion` =
  `outputs('Config')?['PromptVersion']` to `Set_text_url`.
- **R11 — recycle after the URL patch** (optional hardening): drag
  `Set_text_url` to run directly after `Text_file_url` (before
  `Old_sidecar_url`), giving `... → Text_file_url → Set_text_url →
  Old_sidecar_url → If_sidecar_moved → For_each_id`. Safe because
  `Old_sidecar_url` reads the OLD url from the run-start
  `Check_indexed` snapshot, not the live row.

Smoke checks:
- R9: SmokeFile a pdf, run twice. Run 1 stamps the Skipped row with
  the current PromptVersion; run 2 must not enter `If_process` for it.
  Expect a one-time budget dip on the first full run after a bump
  while existing Skipped rows reconcile (one slot each, once).
- R10/R11: smoke a normal deck — row ends Indexed + current version +
  valid TextFileUrl (stamp now visible in `Set_text_url`'s payload,
  absent from the upsert's). Optionally cancel a run mid-`Try_index`
  after the upsert: the next run must reprocess and heal the doc.

The definition and `DocIndexSweep_v2_5.zip` in this folder carry
R9–R11.
