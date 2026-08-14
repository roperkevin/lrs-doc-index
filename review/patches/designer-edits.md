# Designer edits — exact patches (apply in this order)

> **You probably don't need this document (2026-08-13).** Every edit
> below is BAKED into the current authored definitions and their
> import packages — deploying is imports and pastes, per
> `testplangen/Coverage_Runbook.md`. This doc remains only for
> patching a live flow IN PLACE (to keep its run history) instead of
> re-importing, and as the per-edit rationale record. Where each
> section is baked:
>
> | Section(s) | Baked into | Import package |
> |---|---|---|
> | F1–F12, r2-1, v2_6 V1–V10, v2_7 W1–W5 | superseded generations, folded into `flow/v2_8/definition.json` (authored from the post-v2.6/v2.7 live export) | `flow/DocIndexSweep_v2_8.zip` |
> | r2-2 (option a), r2-3 | `flow/v2_8/definition.json` (2026-08-13: SourceSiteUrl deleted, trigger concurrency 1) | `flow/DocIndexSweep_v2_8.zip` |
> | §v2_7-fixes FX-1..FX-6 | `flow/v2_7_fix/definition.json` AND `flow/v2_8/definition.json` | `DocIndexSweep_v2_7_fix.zip` / `DocIndexSweep_v2_8.zip` |
> | v2_8 X1–X5 | `flow/v2_8/definition.json` | `flow/DocIndexSweep_v2_8.zip` |
> | §testplangen-v2_8 T1–T2, §testplangen-v2_12 U1–U7 | `testplangen/flow/v1_0/definition.json` + `core_v1_0/definition.json` | `TestPlanGen_v1_0.zip` / `TestPlanGenCore_v1_0.zip` |
>
> Every listed package's payload is byte-identical to its folder
> definition (verified 2026-08-13).

All edits are made in the live flow in the designer; no re-import, no package re-cut.
Every expression below is pure WFL (no statements). After each edit, run once in smoke
mode (Config → SmokeFile) before moving to the next — one variable at a time.

General cautions:
- When editing a raw `$filter` / `$top` field, the connector schema is not in play —
  these are the same raw fields the package already uses; no lookup-column visibility
  concerns.
- Config values stay literals throughout (only F5 touches Config: `PromptVersion` to
  `v1.2`, still a literal).
- Nothing below alters DocKey/IdKey/KWKey/LinkKey composition or the
  Error-reprocess / Skipped-wait semantics. F2 *routes into* the existing Skipped
  branch; it does not change what Skipped means.

---

## F1 — Check_kw single-escape (correctness — do this one first)

Action: **Check_kw** (Get items, Keywords list) → **Filter Query**.

Replace:

```
Title eq '@{replace(outputs('Kw_clean'), '''', '''''')}'
```

with:

```
Title eq '@{outputs('Kw_clean')}'
```

`Kw_clean` already holds the once-escaped value; leave `Kw_clean` itself untouched.

Cleanup pass (data, once): check the Keywords list for duplicate Titles containing an
apostrophe; if any exist, keep the oldest as canonical, set `CanonicalRef` on the
duplicates (or delete them and re-point any DocKeywords rows).

Test: seed Keywords with an apostrophe term (e.g. `driver's log`), smoke-run a doc that
yields it, verify no new duplicate row and the DocKeywords row points at the seeded ID.

---

## F2 — Oversize gate via the Switch expression

Action: **Switch_ext** → the **On** expression.

Replace `@outputs('Doc_ext')` with:

```
@if(and(greater(int(coalesce(items('For_each_file')?['File_x0020_Size'], 0)), 3500000), not(equals(outputs('Doc_ext'), 'xlsx'))), 'oversize', outputs('Doc_ext'))
```

- `'oversize'` matches no case → default → `LaneUsed` stays `none` → `If_has_text`
  false → existing Skipped write. Skipped = waits for file change: correct, since an
  oversized file only becomes processable if modified.
- `xlsx` exempt: `Dump_workbook` runs against the target workbook; no bytes shipped.
- **Before wiring:** open a recent `Get_files` run → raw outputs → confirm the size
  property's internal name on your items (expected `File_x0020_Size`; if your tenant
  surfaces `{Size}` instead, substitute it — same expression shape).

Test: smoke an ~8 MB pptx → Skipped row, zero Excel Online actions in the run. Smoke a
normal deck → routes to Case_pptx as before.

---

## F3 — Robust JSON slice for the prompt output

Add two Compose actions between **Run_prompt** and **Parse_prompt_output** (inside
`If_has_text`, same scope):

**Compose `Prompt_text_raw`:**

```
@coalesce(outputs('Run_prompt')?['body/responsev2/predictionOutput/text'], '{}')
```

**Compose `Prompt_json_slice`:**

```
@if(and(greater(indexOf(outputs('Prompt_text_raw'), '{'), -1), greater(lastIndexOf(outputs('Prompt_text_raw'), '}'), indexOf(outputs('Prompt_text_raw'), '{'))), substring(outputs('Prompt_text_raw'), indexOf(outputs('Prompt_text_raw'), '{'), add(sub(lastIndexOf(outputs('Prompt_text_raw'), '}'), indexOf(outputs('Prompt_text_raw'), '{')), 1)), '{}')
```

Then change **Parse_prompt_output** to:

```
@json(outputs('Prompt_json_slice'))
```

Notes: strict superset of the old fence-strip (` ```json ` wrappers have their braces
inside the slice); a no-brace or brace-inverted reply degrades to `{}` → the existing
coalesce/Other guards produce a filename-titled row rather than an Error loop; sliced
text that still isn't valid JSON (truncation) still throws → Error row, by design.

Test: normal smoke doc → identical row. Then temporarily set `Prompt_text_raw` to a
literal `Here you go: {"title":"t","docKind":"Other","surface":"Other","summary":"s","pe":"","dev":"","targetRelease":"","tools":[],"keywords":["x"]}` → verify parse → revert.

---

## F4 — Get_files ceiling

Action: **Get_files** (Get files, properties only):
- **Top Count** (`$top`): `5000` → `20000`
- Settings → **Pagination** → Threshold (`minimumItemCount`): `5000` → `20000`

Unfiltered, unsorted enumeration pages safely past the 5000 list-view threshold.
Re-check both values after any future flow re-import (pagination settings are easy to
lose in a re-cut). The F11 summary logs the seen-count as a tripwire.

---

## F6 — LastError capture in Catch

Schema first (additive): Doc Index list → new column **LastError**, multiple lines of
text, **plain text** (not enhanced). Not a lookup — no classic-UI requirement.

In **Catch_index**, before `If_err_exists`:

**Filter array `Filter_failed`** — From:

```
@result('Try_index')
```

Where (edit in advanced mode):

```
@or(equals(item()?['status'], 'Failed'), equals(item()?['status'], 'TimedOut'))
```

**Compose `Err_detail`:**

```
@take(concat(coalesce(first(body('Filter_failed'))?['name'], 'unknown-action'), ': ', string(coalesce(first(body('Filter_failed'))?['error'], first(body('Filter_failed'))?['outputs'], ''))), 4000)
```

Then set `If_err_exists` to run after `Err_detail` [Succeeded], and add to **both**
`Create_doc_error` and `Update_doc_error`:

```
LastError = @{outputs('Err_detail')}
```

Recovery hygiene — in the success-path **Update_doc** (and **Create_doc**, harmless),
add:

```
LastError = @{string('')}
```

(the `string('')` guard is the same empty-value designer trap workaround used on the
variable inits).

Test: smoke mode, temporarily break the `Run_regex` script binding → Error row with
`LastError` starting `Run_regex: ...` → restore, rerun → row heals to Indexed, LastError
empty.

---

## F8 — Skip Extract_media when no raster media

For pptx: add a **Condition** after `Set_Lane_pptx`:

```
@not(empty(outputs('Zip_extract_pptx')?['body/result/media']))
```

Move `Extract_media_pptx` and `For_each_img_pptx` into the **If yes** branch (drag in
the designer — references survive; do NOT delete/recreate the actions, which would break
`outputs()` references). If-no: empty.

Same for docx with `Zip_extract_docx` / `Extract_media_docx` / `For_each_img_docx`.

Test: text-only deck → no second Excel call; image deck → images saved exactly as before.

---

## F9 — Find_sharers ceiling

Action: **Find_sharers** → **Top Count**: `200` → `5000`. Nothing else.

---

## F10 — Get_keywords ceiling

Action: **Get_keywords** → **Top Count**: `500` → `5000`. Nothing else.

---

## F11 — Per-run summary

1. **Init_ErrorCount** (Initialize variable, integer, value `0`) after
   `Init_ProcessedCount`.
2. In **Catch_index**, after the `If_err_exists` block: **Increment variable**
   `ErrorCount` by 1.
3. After **For_each_file** (top level): **Compose `Run_summary`:**

```
@{concat('library_items_seen=', length(body('Get_files')?['value']), ' after_smoke_filter=', length(body('Smoke_filter')), ' processed=', variables('ProcessedCount'), ' errors=', variables('ErrorCount'), ' smoke=', coalesce(outputs('Config')?['SmokeFile'], ''))}
```

`library_items_seen` is the F4 tripwire — when it trends toward the fetch ceiling,
raise the ceiling before it bites.

Test: any run — numbers match the loop's visible outcomes.

---

## F12 — Replace zero-arg createArray() fallbacks (post-incident hardening)

Five expressions; in each, change only the fallback `createArray()` → `json('[]')`:

| Action | Field |
|---|---|
| `For_each_img_pptx` | foreach: `@coalesce(outputs('Extract_media_pptx')?['body/result/images'], json('[]'))` |
| `For_each_img_docx` | foreach: `@coalesce(outputs('Extract_media_docx')?['body/result/images'], json('[]'))` |
| `For_each_id` | foreach: `@coalesce(outputs('Run_regex')?['body/result/ids'], json('[]'))` |
| `Select_kw_topic` | From: `@coalesce(outputs('Parse_prompt_output')?['keywords'], json('[]'))` |
| `Select_kw_tool` | From: `@coalesce(outputs('Parse_prompt_output')?['tools'], json('[]'))` |

Why: zero-argument `createArray()` is invalid WFL; it survives only while coalesce's
first argument is non-null. When an import resets the `Extract_media_*` script pick to
the packaged stand-in, `images` is null and the run dies with
`InvalidTemplate ... 'createArray' ... invoked with no parameters`. `json('[]')`
degrades to an empty loop instead. Already applied in the v2.1 package
(`flow/DocIndexSweep_v2_1.zip`).

Reminder that pairs with this: after ANY import, re-picking MediaExtract on both
`Extract_media_*` actions is REQUIRED — under v2.1 forgetting it no longer errors, it
silently skips image extraction (see `flow/v2_1/CHANGES.md`).

Test: smoke-run with the stand-in binding left on → run completes with zero images;
re-pick MediaExtract → images saved as before.

---

## F5 (companion Config edit)

After pasting the v1.2 prompt (see `DocIndex_Prompt_v1_2.md`):
**Config** → `"PromptVersion": "v1.1"` → `"v1.2"` (literal stays literal). Rows written
before the bump are then discoverable via the runbook's promptversion filter for
selective re-runs.

---

# r2 round (2026-08-11) — REVIEW_v2_5_r2.md

## r2-1 — Script paste (REQUIRED for the SB batch to go live)

Open the Automate-tab workbook's Code Editor and paste each promoted
script over its existing counterpart, in this order:

1. `scripts/RegexExtract.ts` (v1.3)
2. `scripts/WorkbookDump.ts` (v1.2)
3. `scripts/RelatedRank.ts` (v1.3)
4. `scripts/SidecarPatch.ts` (v1.4)
5. `scripts/MediaExtract.ts` (v1.3)
6. `scripts/ZipTextExtract.ts` (v2.0)

No flow edits, no prompt re-paste, no PromptVersion bump — same names
and signatures, and output is identical on well-formed inputs (the
gate's equivalence table). Note ZipTextExtract v2.0 contains
backslash-u0001 escape sequences (the SB-6 generated-heading
sentinel) — they are plain ASCII in the source, so pasting is safe;
do not "clean them up".

Test after pasting: run the flow in smoke mode (Config→SmokeFile) on
any pptx; then update STATUS.md's paste column and append the
deployment record per the round checklist.

## r2-2 — PV-3: the dead `Config.SourceSiteUrl` (pick ONE)

> Baked 2026-08-13: option (a) taken in `flow/v2_8/definition.json`
> (+ re-cut zip). Live-flow edit only needed if patching in place.

`Config.SourceSiteUrl` is referenced by nothing; `Get_files` hardcodes
the same URL (the connector's dataset field must be a literal picker
value, so the key cannot actually be wired in). Either:

- **(a) Delete it (recommended):** **Config** → remove the
  `"SourceSiteUrl"` line. The flow keeps working; the README already
  documents the source site.
- **(b) Keep it as documentation:** leave the key and accept that it
  is informational only — `Get_files`' site picker is the binding.

Test: save; the flow's next run behaves identically.

## r2-3 — DD-8 (optional): pin trigger concurrency

> Baked 2026-08-13 into `flow/v2_8/definition.json` (+ re-cut zip):
> Recurrence trigger `runtimeConfiguration.concurrency.runs: 1`.
> Live-flow edit only needed if patching in place.

`docs/SP_Adaptation_Notes.md` now documents that overlapping runs are
fenced only by the daily cadence. To make the original claim true:
trigger `Recurrence` → Settings → Concurrency Control ON → Degree of
Parallelism 1. Optional hardening; skipping it is fine at one run/day.

Test: trigger settings show concurrency 1; next scheduled run is
unaffected.

---

# v2_6 round — related-ranking overhaul (RelatedRank v2.0 → v2.1)

`flow/v2_6/definition.json` is the authoritative result; these are
the same edits as designer actions, in dependency order. **Edit V1
(the script paste) and V2–V10 are ONE maintenance window** — the
v2.0+ signature breaks the existing `Run_related_rank` binding until
V7/V8 rewire it. Do the whole list with the flow OFF or well clear
of the 17:00 trigger, then smoke. Prereq: the r2 six-script paste
already done (STATUS open action 3); gate `check_batch_r4.py` green.

**r4 amendment (2026-08-12)**: RelatedRank has been promoted to
**v2.1** (`check_batch_r4.py` gate PASSED; `check_batch_r3.py` now
skips as superseded) with the SAME signature as v2.0, so this window
is unchanged in shape — V1 now pastes v2.1, and V2/V7 below already
carry the two r4 additions (the `"title"` fragment in
`RelatedWeights`; the `"title"` line in `Self_rank_meta`, feeding
title-token affinity). `flow/v2_6/definition.json` and
`flow/DocIndexSweep_v2_6.zip` were amended to match (payload still
byte-identical to the folder). **If this window was already applied
with v2.0 before r4 landed**: paste v2.1 alone — same signature, no
window needed — then apply just the two r4 deltas (V2's literal,
V7's title line). Until the title line lands, title affinity is
dormant and v2.1's output is identical to v2.0's on tenant-shaped
input, so the two-step path is safe in either order.

Unlike the F-series, don't smoke between single edits here — the
branch is broken mid-sequence by design. Smoke once after V10.

## V1 — Paste RelatedRank v2.1

Automate-tab workbook → Code Editor → paste `scripts/RelatedRank.ts`
(v2.1 — the r4 amendment; this window originally pasted v2.0) over
the existing RelatedRank. (Script list order for any future batch
paste: unchanged from r2.)

## V2 — Config keys

**Config** compose: after `"RelatedTopN": 5,` add (literals):

```
"RelatedShortlist": 12,
"MyKwsTop": 100,
"SharersTop": 2000,
"LinksTop": 200,
"RelatedWeights": "{\"edge\":{\"id\":1000,\"review\":100,\"gantt\":60,\"titlematch\":40},\"kwKind\":{\"topic\":1.0,\"tool\":0.6,\"product\":0.4},\"meta\":{\"kind\":0.5,\"surface\":0.5,\"release\":1.0,\"pe\":0.75,\"dev\":0.75},\"title\":{\"weight\":0.4,\"cap\":6},\"recency\":{\"weight\":1.0,\"halfLifeDays\":180},\"softCap\":999,\"tops\":{\"myKws\":100,\"sharers\":2000,\"links\":200}}",
```

`RelatedWeights` is a JSON *string* (the flow never parses it — the
script does, shrugging off garbage back to identical in-script
defaults). Keep `tops` in sync with the three *Top keys when tuning.
The `title` fragment is the r4 amendment (title-token affinity —
weight per shared distinctive token, counted up to cap; an optional
`\"stop\":[...]` array appends tenant stopwords); omitting it is
harmless — the in-script defaults are identical.

## V3 — Init_RelatedFlags

New **Initialize variable** `Init_RelatedFlags` directly after
`Config` (re-point `Init_XmlBuf` to run after it): name
`RelatedFlags`, type String, value `@{string('')}` (the usual
empty-value designer-trap guard).

## V4 — Query ceilings from Config; all edge types

- **Get_my_kws** → Top Count: `50` → `@int(outputs('Config')?['MyKwsTop'])`
- **Get_id_links** → Top Count: `200` → `@int(outputs('Config')?['LinksTop'])`
- **Get_id_links** → Filter Query — replace:

```
(DocAId eq @{outputs('Doc_item_id')} or DocBId eq @{outputs('Doc_item_id')}) and LinkType eq 'id'
```

with:

```
DocAId eq @{outputs('Doc_item_id')} or DocBId eq @{outputs('Doc_item_id')}
```

(Keep the action's name — everything downstream references it.)

## V5 — Keyword metadata query (Kind + DX-2 aliases)

Inside `If_related_signals`, after `Select_kw_filter`, three new
actions in a chain:

**Select `Select_kwmeta_canon`** — From:
`@coalesce(body('Get_my_kws')?['value'], json('[]'))`, Map (text
mode): `@concat('ID eq ', coalesce(item()?['Keyword']?['Id'], 0))`

**Select `Select_kwmeta_alias`** — same From, Map:
`@concat('CanonicalRefId eq ', coalesce(item()?['Keyword']?['Id'], 0))`

**Get items `Get_kw_meta`** — Site the usual, List **Keywords**
(GUID `e096ab26-27d2-4ef4-ae40-c24e35fa2fb7`), Top Count `200`,
Filter Query:

```
@{if(empty(body('Select_kwmeta_canon')), 'ID eq 0', join(union(body('Select_kwmeta_canon'), body('Select_kwmeta_alias')), ' or '))}
```

**Select `Select_kw_filter_meta`** — From:
`@coalesce(body('Get_kw_meta')?['value'], json('[]'))`, Map:
`@concat('KeywordId eq ', coalesce(item()?['ID'], 0))`

## V6 — Get_kw_sharers reads the widened filter + Config ceiling

**Get_kw_sharers** → run after `Select_kw_filter_meta`; Top Count:
`500` → `@int(outputs('Config')?['SharersTop'])`; Filter Query:

```
@{if(empty(body('Select_kw_filter')), 'KeywordId eq 0', join(union(body('Select_kw_filter'), body('Select_kw_filter_meta')), ' or '))}
```

(`union` dedupes the canonical ids the two Selects both emit.)

## V7 — Self metadata + the shortlist call

After `Get_kw_sharers`:

**Compose `Self_rank_meta`:**

```
{
  "kind": "@{outputs('Doc_kind_safe')}",
  "surface": "@{outputs('Surface_safe')}",
  "release": "@{coalesce(outputs('Parse_prompt_output')?['targetRelease'], '')}",
  "pe": "@{coalesce(outputs('Parse_prompt_output')?['pe'], '')}",
  "dev": "@{coalesce(outputs('Parse_prompt_output')?['dev'], '')}",
  "modified": "@{coalesce(items('For_each_file')?['Modified'], '')}",
  "title": "@{outputs('Doc_title')}"
}
```

(The `title` line is the r4 amendment — the same value `Create_doc`
/ `Update_doc` write to the row's Title, so self and candidates read
the same field and title-token affinity stays symmetric. Leaving it
off is safe: the term reads as 0 and v2.1 scores exactly like v2.0.)

**Run script `Run_related_shortlist`** (Excel Online Business, same
workbook + RelatedRank script pick as `Run_related_rank`):

| Param | Value |
|---|---|
| selfId | `@{outputs('Doc_item_id')}` |
| mode | `shortlist` (literal) |
| myKwsJson | `@{string(coalesce(body('Get_my_kws')?['value'], json('[]')))}` |
| sharersJson | `@{string(coalesce(body('Get_kw_sharers')?['value'], json('[]')))}` |
| linksJson | `@{string(coalesce(body('Get_id_links')?['value'], json('[]')))}` |
| kwMetaJson | `@{string(coalesce(body('Get_kw_meta')?['value'], json('[]')))}` |
| candsMetaJson | `[]` (literal) |
| selfMetaJson | `@{string(outputs('Self_rank_meta'))}` |
| configJson | `@{outputs('Config')?['RelatedWeights']}` |
| topN | `@int(outputs('Config')?['RelatedShortlist'])` |

**Append to string variable `Append_related_flags`** — name
`RelatedFlags`, value:

```
@{if(empty(coalesce(outputs('Run_related_shortlist')?['body/result/flags'], '')), '', concat(outputs('Doc_item_id'), ':', outputs('Run_related_shortlist')?['body/result/flags'], ' '))}
```

Then **If_has_related** → run after `Append_related_flags`;
condition expression:

```
@greater(coalesce(outputs('Run_related_shortlist')?['body/result/count'], 0), 0)
```

## V8 — Two-phase rerank inside If_has_related

- **Select_id_filter** → From:
  `@coalesce(outputs('Run_related_shortlist')?['body/result/docIds'], json('[]'))`
- **Get_related_docs** → rename is NOT possible; instead delete it
  and create **Get_cand_docs** (Get items, Doc Index list, Filter
  Query `@{join(body('Select_id_filter'), ' or ')}`, Top Count
  `@int(outputs('Config')?['RelatedShortlist'])`), run after
  `Select_id_filter`. (Deleting is safe here — the only referents
  are edited in this same round: V8/V10.)
- **Drag `Run_related_rank`** inside `If_has_related`, run after
  `Get_cand_docs` (drag in the designer — do not delete/recreate;
  `Run_sidecar_patch` references its outputs). Set its params to
  the V7 table with three differences: mode `final`, candsMetaJson
  `@{string(coalesce(body('Get_cand_docs')?['value'], json('[]')))}`,
  topN `@int(outputs('Config')?['RelatedTopN'])`.
- **Filter array `Filter_final_docs`** after `Run_related_rank` —
  From: `@coalesce(body('Get_cand_docs')?['value'], json('[]'))`,
  Where (advanced mode):

```
@contains(coalesce(outputs('Run_related_rank')?['body/result/docIds'], json('[]')), item()?['ID'])
```

- **Reset_NeighborFiles** → run after `Filter_final_docs`.

## V9 — Neighbor loop reads the final cut

- **For_each_neighbor** → foreach:
  `@coalesce(body('Filter_final_docs'), json('[]'))`
- **Run_sidecar_patch** → docsMetaJson:
  `@{string(coalesce(body('Filter_final_docs'), json('[]')))}`
  (rankedJson / selfMetaJson / topN stay as they are).

## V10 — Run_summary tripwire

**Run_summary** compose — replace the trailing
`' smoke=', coalesce(outputs('Config')?['SmokeFile'], ''))}` with:

```
' smoke=', coalesce(outputs('Config')?['SmokeFile'], ''), ' related_flags=', variables('RelatedFlags'))}
```

## Smoke (after V10, one pass)

Config → SmokeFile on a doc known to have keywords and an id edge:

1. Run succeeds; `Run_related_shortlist` and `Run_related_rank`
   both ran; `Get_cand_docs` returned ≤ 12 rows.
2. The doc's sidecar Related section: same shape as before, scores
   may differ by small soft-signal deltas; an id-linked neighbor is
   still first.
3. `Run_summary` shows `related_flags=` (expected empty at today's
   corpus size).
4. A neighbor sidecar re-merged cleanly (no duplicate `related:`
   keys, list still score-descending).

Then update STATUS.md (RelatedRank paste column, flow version) and
append the deployment record. `flow/DocIndexSweep_v2_6.zip` is
already authored (v2.5 skeleton + v2.6 payload — see
`flow/v2_6/CHANGES.md`); optionally refresh it from the live export
if the applied flow drifts from the authored definition.

# v2_7 round — GFM sidecar format (info-card header, collapsed metadata, issue links)

`flow/v2_7/definition.json` is the authoritative result; these are
the same edits as designer actions, in dependency order. Prereqs:
the v2_6 window above fully applied; `scripts/SidecarPatch.ts` v1.5
pasted (gate `check_batch_r5.py` PASSED 2026-08-13 — v1.5 is a
strict superset of v1.4, safe to paste any time BEFORE this round;
never apply this round while the tenant still runs v1.4 or earlier,
or every new-format sidecar silently no-ops in the patcher).

W1–W4 are one window (the template references the three new actions,
so the flow errors mid-sequence); do them with the flow OFF or well
clear of the 17:00 trigger, then smoke.

## W1 — Select_issue_links

New **Select** action `Select_issue_links` after `H1_title`
(re-point `Sidecar_header`'s runAfter in W4):

- From: `@coalesce(outputs('Run_regex')?['body/result/ids'], json('[]'))`
- Map (switch to text mode — the single-value map): `@concat('[', item()?['repo'], '#', item()?['number'], '](https://devtopia.esri.com/', item()?['repo'], '/issues/', item()?['number'], ')')`

## W2 — Select_issue_yaml

New **Select** action `Select_issue_yaml` after `Select_issue_links`:

- From: `@coalesce(outputs('Run_regex')?['body/result/ids'], json('[]'))`
- Map (text mode): `@concat('"', item()?['repo'], '#', item()?['number'], '"')`

## W3 — Issue_row

New **Compose** action `Issue_row` after `Select_issue_yaml`:

```
@if(empty(coalesce(outputs('Run_regex')?['body/result/ids'], json('[]'))), '', concat('| **Issue** | ', join(body('Select_issue_links'), ' · '), ' |', decodeUriComponent('%0A')))
```

(The non-empty branch ends with a newline so the template can embed
the row flush against the Source row — an id-less doc loses the row
without leaving a blank table line.)

## W4 — Sidecar_header template

**Sidecar_header** compose — set runAfter to `Issue_row`, then
replace the ENTIRE inputs with the block below, EXACTLY — paste into
the expression-free text view, not per-line:

~~~~
# @{outputs('H1_title')}

|   |   |
| --- | --- |
| **Kind** | @{outputs('Doc_kind_safe')} · @{outputs('Surface_safe')} |
| **Release** | @{if(empty(replace(coalesce(outputs('Parse_prompt_output')?['targetRelease'], ''), '"', '')), '—', replace(replace(coalesce(outputs('Parse_prompt_output')?['targetRelease'], ''), '"', ''), '|', '/'))} |
@{outputs('Issue_row')}| **Source** | [@{items('For_each_file')?['{FilenameWithExtension}']}](<@{items('For_each_file')?['{Link}']}>) |
| **Edited** | @{if(empty(variables('SrcEdited')), 'unknown', formatDateTime(variables('SrcEdited'), 'yyyy-MM-dd HH:mm'))} by @{if(empty(variables('SrcEditor')), 'unknown', replace(variables('SrcEditor'), '|', '/'))} |
| **Extracted** | @{formatDateTime(utcNow(), 'yyyy-MM-dd')} · lane `@{variables('LaneUsed')}` |

<details><summary>Metadata</summary>

```yaml
title: @{outputs('Yaml_title')}
source_file: @{outputs('Yaml_file')}
source_url: "@{items('For_each_file')?['{Link}']}"
doc_id: @{outputs('Doc_item_id')}
doc_kind: "@{outputs('Doc_kind_safe')}"
surface: "@{outputs('Surface_safe')}"
doc_revision: "@{coalesce(outputs('Run_regex')?['body/result/docRevision'], '')}"
target_release: "@{replace(coalesce(outputs('Parse_prompt_output')?['targetRelease'], ''), '"', '')}"
pe: "@{replace(coalesce(outputs('Parse_prompt_output')?['pe'], ''), '"', '')}"
dev: "@{replace(coalesce(outputs('Parse_prompt_output')?['dev'], ''), '"', '')}"
author: "@{replace(variables('SrcAuthor'), '"', '')}"
last_edited_by: "@{replace(variables('SrcEditor'), '"', '')}"
last_edited: "@{variables('SrcEdited')}"
extracted: @{formatDateTime(utcNow(), 'yyyy-MM-dd')}
extraction_lane: @{variables('LaneUsed')}
prompt_version: "@{outputs('Config')?['PromptVersion']}"
keywords: [@{join(body('Select_kw_yaml'), ', ')}]
tools: [@{join(body('Select_tools_yaml'), ', ')}]
issues: [@{join(body('Select_issue_yaml'), ', ')}]
related: []
```

</details>

## Summary

@{if(empty(coalesce(outputs('Parse_prompt_output')?['summary'], '')), concat('> [!WARNING]', decodeUriComponent('%0A'), '> No AI summary was generated for this document.'), coalesce(outputs('Parse_prompt_output')?['summary'], ''))}

## Related documents

<!-- related:begin -->
_None yet._
<!-- related:end -->

---

~~~~

(The template ends with the `---` seam line, a blank line, and a
final trailing newline — keep them.)

**Blank-line checklist — every one is load-bearing:**

- [ ] blank line between the H1 and the table
- [ ] blank line between the table and `<details>...`
- [ ] blank line between `<details><summary>Metadata</summary>` and
      ```` ```yaml ```` (without it GitHub renders the yaml as loose
      text AND SidecarPatch v1.5 returns `not-frontmatter` forever —
      silently dead related sections)
- [ ] blank line between the closing ```` ``` ```` and `</details>`
- [ ] blank line between `</details>` and `## Summary`
- [ ] `@{outputs('Issue_row')}` sits at the START of its line, flush
      against `| **Source** |` on the SAME template line

## W5 — Config.PromptVersion

**Config** compose: `"PromptVersion": "v1.8"` → `"v1.9"`. This is
the backfill trigger — every existing row reindexes into the new
format at MaxDocsPerRun (150) per run.

## Smoke (after W5, one pass)

Config → SmokeFile on a doc known to carry an issue reference:

1. Run succeeds; download the smoke sidecar.
2. Byte-check the header shape: regenerate
   `review/harness/sample_sidecar.md` (`python3 render_sample.py`)
   and diff the two headers — H1 line, table rows, the exact
   `<details><summary>Metadata</summary>` + blank-line frame, seam.
3. Eyeball in a GFM viewer (VS Code preview): collapsed Metadata
   disclosure, info table, working devtopia Issue link, Source link.
4. Confirm the yaml still parses (any yaml linter) and shows
   `issues: ["..."]` + `related: []`.
5. Next nightly run: reindex volume ≈ MaxDocsPerRun in Run_summary
   (the backfill working through the corpus).

Then update STATUS.md (flow row, PromptVersion row) and paste
`agent/QA_Agent_Instructions_v1_2.md` per its own header.

Rollback: revert W5 (PromptVersion → v1.8), then W4→W1 in reverse.
SidecarPatch v1.5 may stay pasted — byte-equivalent to v1.4 on every
pre-v2.7 frame.

# testplangen-v2_8 round — GFM draft banner (both live TestPlanGen flows)

Paired with the TestPlanGen prompt v1.4 paste
(`review/patches/TestPlanGen_Prompt_v1_4.md`); apply to BOTH live
flows (standalone + agent core). See `testplangen/CHANGES.md` v2.8.

## T1 — Draft_banner WARNING line

**Draft_banner** compose — in the `concat(...)`, immediately after
the first `decodeUriComponent('%0A'), ` (the newline that closes the
HTML comment), insert:

```
'> [!WARNING]', decodeUriComponent('%0A'),
```

The two existing `> `-prefixed banner lines then render as the
alert's body. No other change to the expression.

## T2 — Config_gen version stamp

**Config_gen** compose: `"TestPlanGenPromptVersion": "v1.3"` →
`"v1.4"` (stamps the banner's HTML comment).

Smoke: generate one draft; the banner renders as a WARNING alert in
a GFM viewer, Overview opens with the StoryMeta table, steps are
checkboxes, Negative Tests carries the CAUTION alert, Open Questions
items are checkboxes.

# v2_7-fixes round — live mis-picks found in the 2026-08-13 export

The DocIndexSweep export of 2026-08-13 (the flow after the v2.6 and
v2.7 windows were applied on the tenant) shows four designer
mis-picks plus a stuck smoke knob. Apply these ON THE LIVE FLOW
before (or with) the §v2_8 window — or import
`flow/DocIndexSweep_v2_7_fix.zip`, the live export with exactly
these five corrections applied and nothing else (still PromptVersion
v1.9; see `flow/v2_7_fix/CHANGES.md`). The authored
`flow/v2_8/definition.json` also carries all five corrections, so a
tenant that re-imports v2.8 instead gets them for free.

## FX-1 — Extract_media_pptx: zipBase64 carries the prefix, not the file

The action's ONLY script parameter, `zipBase64`, is bound to
`concat('../media/doc', items('For_each_file')?['ID'], '_')` — the
media-prefix expression. MediaExtract's signature is
`main(workbook, zipBase64)`; fed a prefix string it throws (`EOCD
not found`), so EVERY image-bearing pptx errors in Catch_index.
Set:

```
ScriptParameters/zipBase64 = @{body('Get_content_pptx')?['$content']}
```

(There is no prefix parameter on MediaExtract — the prefix belongs
to Zip_extract_pptx, where it is already correct.)

## FX-2 — Zip_extract_docx: mediaPrefix binding missing

The docx extract call has no `mediaPrefix` parameter bound, so docx
sidecars silently lose their inline image links (and the media save
never triggers — `media` comes back empty). Add:

```
ScriptParameters/mediaPrefix = @{concat('../media/doc', items('For_each_file')?['ID'], '_')}
```

## FX-3 — Run_related_rank: sharersJson mis-picked to Get_my_kws

`sharersJson` is bound to `body('Get_my_kws')` — the doc's OWN
junction rows — instead of `body('Get_kw_sharers')`. RelatedRank
then never sees another doc sharing a keyword, so keyword-based
related entries stop appearing for newly indexed docs (id-edge
entries still work, which is why the damage is easy to miss). Set:

```
ScriptParameters/sharersJson = @string(coalesce(body('Get_kw_sharers')?['value'], json('[]')))
```

(The `mode` parameter's trailing space — `"final "` — is harmless:
anything other than `shortlist` reads as final mode. Fix it or not.)

## FX-4 — Run_regex: content joins with a literal " \n "

`content` is `@{variables('DocText')} \n @{variables('RelsText')}` —
the `\n` is two literal characters, not a newline. Harmless to the
id scan, but set it back to a real newline join (expression editor:
DocText, Shift+Enter, RelsText) so boundary-sensitive scans (the
v1.4 product acronyms are word-boundary matched) never see the two
texts glued through ` \n `.

## FX-5 — Config.SmokeFile is still set

`Config → SmokeFile = "ExB - AutopopulateReferents.pptx"` pins every
nightly run to that single file — **the PromptVersion v1.9 backfill
has been stalled since the v2.7 window**, which is why the corpus
still shows the pre-v2.7 layout (visible yaml on top). After the
final smoke of whichever window you are in, set SmokeFile back to
empty and let the nightly runs converge the corpus.

## FX-6 — the three raw-REST creates still post to the OLD (pre-rebuild) lists

Found 2026-08-13, after the §v2_8 round was cut (the FX-6 GUID swaps
are now baked into `flow/v2_7_fix/definition.json` and
`flow/v2_8/definition.json`; on the live flow they are three hand
edits). When the tenant lists were re-created, every **GetItems**
action was re-picked to the new list GUIDs — but the three **"Send
an HTTP request to SharePoint"** creates carry their list GUID as a
hand-typed literal inside the URI, which a re-pick never touches.
They still post to the old lists, so the check/create pairs read one
list and write another:

| Action | URI has (OLD) | Must be (current) |
|---|---|---|
| `Create_idrow` | `87b75cd7-5e84-4a65-adb5-dcd0de08321d` | `6263eeac-471a-489e-96c7-1448f45378d4` (Doc IDs) |
| `Create_link` | `3c50c3fe-a4e8-4ae2-9668-43987c9bff60` | `c49367dc-c267-4f5b-8935-4fad47fb0d34` (Doc Links) |
| `Create_dockw` | `68752782-6d2d-4c65-b4e8-361c0df706ec` | `4eabc799-c856-49ea-bf25-65942b363ec6` (Doc Keywords) |

Symptom: if the old lists are deleted, the create 404s ("List does
not exist") inside Try_index → the doc lands as an Error row —
`Create_dockw` fires for every keyworded doc and `Create_idrow` for
every doc with an issue id, so this errors essentially every index
attempt. If the old lists still exist, the failure is quieter and
worse: rows land in orphaned lists, dedup never sees them, and
Find_sharers / the keyword queries read empty.

Edit each of the three actions and replace the GUID inside
`_api/web/lists(guid'...')/items` with the current one from the
table above (current GUIDs per `docs/SP_Adaptation_Notes.md`).
**Rebuild rule for the future**: after ANY list re-creation, grep
the flow definition for `lists(guid'` — raw HTTP actions never
follow a re-pick.

# v2_8 round — hidden metadata + code fencing + product lines

`flow/v2_8/definition.json` is the authoritative result (authored
from the 2026-08-13 live export — real tenant bindings — plus the
§v2_7-fixes and the edits below). Prereqs, in order:

1. §v2_7-fixes applied (or accepted as part of this window).
2. **Doc Index column**: create `Products` (single line of text,
   internal name exactly `Products`) on the Doc Index list — see
   `schemas/SPList_DocIndex.csv`. Column first, flow edits second.
3. **Script pastes** (gate `check_batch_r6.py` PASSED 2026-08-13):
   `scripts/SidecarPatch.ts` (v1.6) any time BEFORE this window;
   `scripts/ZipTextExtract.ts` (v2.1) and `scripts/RegexExtract.ts`
   (v1.4) with the window (same signatures — no re-pick needed, but
   pasting them early changes sidecar bodies ahead of the
   PromptVersion bump, so keep them in the window unless a day of
   mixed bodies is acceptable).

X1–X4 are one window (the template references the new actions); do
them with the flow OFF or well clear of the 17:00 trigger, then
smoke.

## X1 — Select_product_yaml

New **Select** action `Select_product_yaml` after `Issue_row`:

- From: `@coalesce(outputs('Run_regex')?['body/result/products'], json('[]'))`
- Map (text mode): `@concat('"', item(), '"')`

## X2 — Product_row

New **Compose** action `Product_row` after `Select_product_yaml`:

```
@if(empty(coalesce(outputs('Run_regex')?['body/result/products'], json('[]'))), '', concat('| **Product** | ', join(coalesce(outputs('Run_regex')?['body/result/products'], json('[]')), ' · '), ' |', decodeUriComponent('%0A')))
```

(Same shape as Issue_row: the non-empty branch ends with a newline
so the row embeds flush; a product-less doc loses the row without a
blank table line.)

## X3 — Sidecar_header template

**Sidecar_header** compose — set runAfter to `Product_row`, then
apply exactly these three template edits (or paste the whole
`Sidecar_header` inputs from `flow/v2_8/definition.json`):

1. The metadata wrapper becomes an HTML comment. The v2.7 opener —
   the `<details><summary>Metadata</summary>` line, a blank line,
   then the ```` ```yaml ```` fence — collapses to two lines with NO
   blank between:

   ~~~~
   <!-- metadata
   ```yaml
   ~~~~

   and the v2.7 closer — the closing ```` ``` ```` fence, a blank
   line, then `</details>` — collapses to:

   ~~~~
   ```
   -->
   ~~~~

   The yaml lines themselves are unchanged except edit 3.

2. The Source row line gains the product row, flush at line start:

   ~~~~
   @{outputs('Product_row')}@{outputs('Issue_row')}| **Source** | ...
   ~~~~

3. Between `tools:` and `issues:` insert:

   ~~~~
   products: [@{join(body('Select_product_yaml'), ', ')}]
   ~~~~

**Checklist — every item is load-bearing:**

- [ ] `<!-- metadata` sits alone on its line, ```` ```yaml ```` on
      the next — SidecarPatch v1.6 anchors its frame parse on the
      exact `<!-- metadata\n```yaml\n` / `\n```\n-->\n` byte
      sequences
- [ ] NO blank line between `<!-- metadata` and the fence, none
      between the closing fence and `-->` (unlike the v2.7 details
      frame, which needed them)
- [ ] blank line between the info table and `<!-- metadata`, and
      between `-->` and `## Summary`
- [ ] `@{outputs('Product_row')}` and `@{outputs('Issue_row')}`
      both sit at the START of the Source template line

## X4 — Create_doc / Update_doc: Products column

Both row upserts gain:

```
Products = @{join(coalesce(outputs('Run_regex')?['body/result/products'], json('[]')), '; ')}
```

## X5 — Config.PromptVersion

**Config** compose: `"PromptVersion": "v1.9"` → `"v2.0"`. This is
the backfill trigger — every existing row reindexes into the new
format at MaxDocsPerRun (150) per run.

## Smoke (after X5, one pass)

Config → SmokeFile on a doc known to carry an issue reference AND
pasted code (an Arcade-bearing test plan is ideal, e.g. the
expression-display SLD plan):

1. Run succeeds; download the smoke sidecar.
2. Byte-check the header: regenerate
   `review/harness/sample_sidecar.md` (`python3 render_sample.py`)
   and diff the two headers — H1 line, table rows (Product row when
   products were detected), the exact `<!-- metadata` frame, seam.
3. Eyeball in a GFM viewer: NO metadata visible at all (the yaml is
   gone from the rendered page — that is the point of this round),
   info table with Product/Issue rows, pasted code rendered as
   fenced blocks, code-shaped bullets as inline code.
4. Confirm the raw yaml still parses (open the file raw) and shows
   `products: ["..."]`, `issues: ["..."]`, `related: []`.
5. Check the Doc Index row: Products column filled.
6. **Set SmokeFile back to EMPTY (FX-5)** — this is the step the
   v2.7 window missed; the backfill cannot run while it is set.
7. Next nightly run: reindex volume ≈ MaxDocsPerRun in Run_summary.

Then update STATUS.md (flow row, PromptVersion row, script paste
columns) and paste `agent/QA_Agent_Instructions_v1_3.md` per its own
header.

Rollback: revert X5 (PromptVersion → v1.9), then X4→X1 in reverse
and the wrapper edit back to `<details>`. SidecarPatch v1.6 may stay
pasted — byte-equivalent to v1.5 on every pre-v2.8 frame.
ZipTextExtract v2.1 / RegexExtract v1.4 may also stay — their output
changes only materialize in sidecar bodies, which the reverted
PromptVersion re-converges.

# testplangen-v2_12 round — design-doc references, slot config, budget fix (both live TestPlanGen flows)

Paired with `testplangen/CHANGES.md` v2.12; apply to BOTH live
generation flows (standalone TestPlanGen + the agent core
TestPlanGenCore — their retrieval logic is identical). Requires the
v2.0 ReferenceText contract on the tenant
(`testplangen/Coverage_Runbook.md` step 3); rides the prompt v1.5
paste window (`Coverage_Runbook.md` step 4) cheaply, or lands in its
own window later — the v2.2 flows are safe under prompt v1.4 (extra
references are just more of an existing lane) and prompt v1.5 is
safe under the v2.0/v2.1 flows, so the two windows commute. Six of
the seven edits are expression-level (no new actions, no renames, no
runAfter changes); U6 adds one Compose per lane — required by the
platform's no-self-reference rule on variable updates (see U6).

## U1 — Config_gen: slot keys + StoryCap raise

**Config_gen** compose — add two keys and raise one:

```
"StoryCap": 45000,          (was 30000)
"ExemplarSlots": 2,         (new)
"ReferenceSlots": 3,        (new)
```

StoryCap 45000: a truncated story tail loses acceptance criteria =
silently lost cases; post-U6 the worst-case total prompt context is
bounded (~45k + 20k + 12k + digest ≈ 80k chars ≈ ~20k tokens),
comfortably inside the model window, so the story gets the room.

## U2 — If_testplan_neighbor: admit Design Spikes

Condition expression, was:

```
@and(equals(coalesce(body('Get_neighbor_row')?['DocKind']?['Value'], ''), 'Test Plan'), not(empty(coalesce(body('Get_neighbor_row')?['TextFileUrl'], ''))))
```

now:

```
@and(or(equals(coalesce(body('Get_neighbor_row')?['DocKind']?['Value'], ''), 'Test Plan'), equals(coalesce(body('Get_neighbor_row')?['DocKind']?['Value'], ''), 'Design Spike')), not(empty(coalesce(body('Get_neighbor_row')?['TextFileUrl'], ''))))
```

Only Design Spike joins Test Plan — of the seven DocKinds it is the
one that describes expected behavior (the prompt has promised
"test plans **or design docs**" in the reference lane since v1.3;
this makes the flow deliver on it). Data Template / Schedule /
Doc Review / Other / adjacent User Story stay digest-only.

## U3 — If_exemplar_slot: Test-Plan-only + config slots

Condition expression, was:

```
@and(equals(coalesce(body('Get_neighbor_row')?['Surface']?['Value'], ''), coalesce(body('Get_story_row')?['Surface']?['Value'], '')), less(length(variables('ExemplarUrls')), 2))
```

now:

```
@and(equals(coalesce(body('Get_neighbor_row')?['DocKind']?['Value'], ''), 'Test Plan'), equals(coalesce(body('Get_neighbor_row')?['Surface']?['Value'], ''), coalesce(body('Get_story_row')?['Surface']?['Value'], '')), less(length(variables('ExemplarUrls')), int(outputs('Config_gen')?['ExemplarSlots'])))
```

The new DocKind conjunct matters because U2 widened the outer
condition: a Design Spike must NEVER become a style exemplar
(exemplars teach draft shape; spikes describe behavior), so
same-surface spikes fall through to the reference lane.

## U4 — If_reference_slot: overflow lane, config slots

Condition expression, was:

```
@and(not(equals(coalesce(body('Get_neighbor_row')?['Surface']?['Value'], ''), coalesce(body('Get_story_row')?['Surface']?['Value'], ''))), less(length(variables('ReferenceUrls')), 2))
```

now:

```
@less(length(variables('ReferenceUrls')), int(outputs('Config_gen')?['ReferenceSlots']))
```

Dropping the cross-surface requirement fixes the documented
fall-through (a same-surface Test Plan arriving after the exemplar
slots fill used to fail both conditions and vanish into the digest —
Setup §3 G5b): it now overflows into the reference lane, which
prompt v1.3+ already supports ("possibly on ANOTHER surface" — the
surface-parity [VERIFY] keys on each reference block's own surface
header, so a same-surface reference forces no spurious VERIFY).
Design Spikes (any surface) land here too, via U2+U3.

## U5 — Exemplar_rows: fallback takes from config

Compose expression — both literal `2`s become the config read, was:

```
@if(greater(length(body('Filter_release_match')), 0), take(body('Filter_release_match'), 2), take(coalesce(body('Get_exemplars_q')?['value'], json('[]')), 2))
```

now:

```
@if(greater(length(body('Filter_release_match')), 0), take(body('Filter_release_match'), int(outputs('Config_gen')?['ExemplarSlots'])), take(coalesce(body('Get_exemplars_q')?['value'], json('[]')), int(outputs('Config_gen')?['ExemplarSlots'])))
```

## U6 — Append_exemplar / Append_reference: take the REMAINING budget (via a Compose)

Two edits, same shape. The `If_ex_budget` / `If_ref_budget` gate
expressions are correct as-is (they gate on "remaining > 0") — the
bug is inside the appends, which `take()` the FULL cap again on
every iteration: exemplar #1 can land 20,000 chars and exemplar #2
another 20,000 (ExemplarText ≈ 2× ExemplarCap; references ≈ 2×
ReferenceCap) — and with U4 admitting a third reference the
overshoot would grow. Oversized context is itself a consolidation
pressure on the model.

> **Why a Compose (2026-08-13, found on live save):** a variable-
> update action may not reference its own variable — putting
> `length(variables('ExemplarText'))` inside `Append_exemplar`'s
> value fails flow save with
> `WorkflowRunActionInputsInvalidProperty: Self reference is not
> supported when updating the value of variable 'ExemplarText'`.
> The arithmetic therefore lives in a Compose BEFORE the gate (a
> Compose may read any variable), and the append reads the Compose.

Exemplar lane — inside the `If_ex_path_ok` Yes branch, add a
Compose **`Ex_remaining`** between `Get_exemplar_md` and
`If_ex_budget` (re-point `If_ex_budget`'s run-after to it; its gate
expression is unchanged):

```
@sub(int(outputs('Config_gen')?['ExemplarCap']), length(variables('ExemplarText')))
```

then in **Append_exemplar**, change the take's second argument:

```
int(outputs('Config_gen')?['ExemplarCap'])   →   outputs('Ex_remaining')
```

Reference lane — likewise a Compose **`Ref_remaining`** between
`Get_reference_md` and `If_ref_budget`:

```
@sub(int(outputs('Config_gen')?['ReferenceCap']), length(variables('ReferenceText')))
```

and in **Append_reference**:

```
int(outputs('Config_gen')?['ReferenceCap'])   →   outputs('Ref_remaining')
```

(The gate guarantees the subtraction is positive. The `---
EXEMPLAR/REFERENCE:` header lines stay outside the budget
arithmetic — the caps remain approximate by a line, as before.)

## U7 — Gen_summary: budget telemetry

Append two fields to the concat, after `draftChars`:

```
, ' exChars=', length(variables('ExemplarText')), ' refChars=', length(variables('ReferenceText'))
```

`exChars ≤ ExemplarCap` / `refChars ≤ ReferenceCap` is the U6
post-check; a reference-lane story showing `references>0` with
`refChars` near the cap says the third slot is earning its keep.

Smoke (one pass, after U7): run on a story whose `related:` list
carries a Design Spike or 3+ same-surface Test Plans
(`testplangen/TestPlanGen_Smoke.md` row 11) — `Gen_summary` shows
`references≥1`, `exChars` ≤ ExemplarCap, and the run history's
`Append_reference` header carries the spike's (or overflow plan's)
title. Rollback: revert U4→U2 (the conditions), then U1's new keys
are inert and U5–U7 are behavior-identical at the default slot
counts once U4 is reverted — or restore all seven from this section
in reverse.

# v2_8-errdrill round — the Catch names the LEAF failure, not the container

Motivated by a live v2.8 run (2026-08-13): a doc errored with
`If_has_text: {"code":"ActionFailed","message":"An action failed. No
dependent actions succeeded."}` — useless, because
`result('Try_index')` returns only FIRST-degree children, so any
deep failure reports as its container; and the run-history UI would
not load the (huge) nested run to find the leaf by hand. This round
makes the Catch drill down: Error rows and `Run_summary` now carry a
path like `If_has_text > For_each_kw > Check_kw: {…the real error…}`.
Baked into `flow/v2_8/definition.json` + the re-cut
`DocIndexSweep_v2_8.zip`; the nodes below are the patch-in-place
route. Every `result()` call is guarded by a Condition keyed on the
parent level's failed-action name, so a `result()` on a
never-executed scope is never evaluated.

## E1 — Init_ErrLeaf (top level)

Initialize variable **`ErrLeaf`** (String, value `@{string('')}`),
inserted after `Init_DocRowId` (re-point `Get_keywords`'s run-after
to it).

## E2 — the drill chain inside Catch_index

After `Filter_failed`, insert (then re-point `Err_detail`):

1. **`Set_ErrLeaf_L1`** (Set variable `ErrLeaf`):
   `@{concat(coalesce(first(body('Filter_failed'))?['name'], 'unknown-action'), ': ', take(string(coalesce(first(body('Filter_failed'))?['error'], first(body('Filter_failed'))?['outputs'], '')), 3500))}`
2. **`If_drill_has_text`** (Condition:
   `@equals(coalesce(first(body('Filter_failed'))?['name'], ''), 'If_has_text')`),
   Yes branch:
   - **`Filter_failed_L2`** (Filter array): from
     `@result('If_has_text')`, same Failed/TimedOut where-clause as
     `Filter_failed`.
   - **`If_L2_found`** (Condition:
     `@greater(length(body('Filter_failed_L2')), 0)`), Yes branch:
     - **`Set_ErrLeaf_L2`** — same concat shape over
       `Filter_failed_L2`, prefixed `'If_has_text > '`.
     - **`If_drill_signals`** (first L2 name == `If_related_signals`)
       → `Filter_failed_L3` from `@result('If_related_signals')` →
       `If_L3_found` → `Set_ErrLeaf_L3` (prefix
       `'If_has_text > If_related_signals > '`) →
       **`If_drill_hasrel`** (first L3 name == `If_has_related`) →
       `Filter_failed_L4` from `@result('If_has_related')` →
       `If_L4_found` → `Set_ErrLeaf_L4` (prefix
       `'… > If_has_related > '`).
     - **`If_drill_ids`** (first L2 name == `For_each_id`) →
       `Filter_failed_ids` from `@result('For_each_id')` →
       `If_ids_found` → `Set_ErrLeaf_ids` (prefix
       `'If_has_text > For_each_id > '`).
     - **`If_drill_kws`** (first L2 name == `For_each_kw`) →
       `Filter_failed_kws` from `@result('For_each_kw')` →
       `If_kws_found` → `Set_ErrLeaf_kws` (prefix
       `'If_has_text > For_each_kw > '`).
3. **`Err_detail`** — run-after re-pointed to `If_drill_has_text`
   (Succeeded, Failed, Skipped, Timed out); expression becomes the
   variable with the original first-degree fallback:
   `@take(if(empty(variables('ErrLeaf')), concat(coalesce(first(body('Filter_failed'))?['name'], 'unknown-action'), ': ', string(coalesce(first(body('Filter_failed'))?['error'], first(body('Filter_failed'))?['outputs'], ''))), variables('ErrLeaf')), 4000)`

`If_err_exists` / `Increment_ErrorCount` are untouched (they consume
`Err_detail` as before). Depth note: a failure still deeper (e.g.
inside `For_each_patched`) reports its container at the deepest
drilled level — add another guarded level then, same pattern.

Smoke: force one failure (e.g. temporarily break a list GUID in a
`Check_*` action on a SmokeFile run), confirm the Error row carries
the `A > B > leaf: {...}` path, revert.
