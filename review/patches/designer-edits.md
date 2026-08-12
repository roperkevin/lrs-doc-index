# Designer edits — exact patches (apply in this order)

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

`docs/SP_Adaptation_Notes.md` now documents that overlapping runs are
fenced only by the daily cadence. To make the original claim true:
trigger `Recurrence` → Settings → Concurrency Control ON → Degree of
Parallelism 1. Optional hardening; skipping it is fine at one run/day.

Test: trigger settings show concurrency 1; next scheduled run is
unaffected.
