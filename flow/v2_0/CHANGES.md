# Flow v2.0 — designer edits pre-applied to the package

`DocIndexSweep_v2_0.zip` is v1.9 with every designer edit from the review
(`review/patches/designer-edits.md`) applied directly to `definition.json`:
F1 (Check_kw single escape), F2 (oversize gate), F3 (JSON slice), F4
(Get_files 20000), F6 (LastError capture), F8 (media-present gate), F9/F10
(query ceilings), F11 (ErrorCount + Run_summary). The extracted v2.0
definition is alongside as `v2_0/definition.json`; `flow/definition.json`
remains the v1.9 original so the review's line citations stay valid.

Two ways to apply:
- **Import `DocIndexSweep_v2_0.zip` as Update** over the existing flow, or
- click through `review/patches/designer-edits.md` in the live designer
  (same end state; one edit at a time with its smoke test).

## Prerequisites and caveats — read before importing

1. **Create the `LastError` column FIRST** (Doc Index list, multiple lines
   of text, plain text). F6 writes it in four actions; importing before
   the column exists makes those writes fail.
2. **F2's size property fails open.** The gate reads
   `File_x0020_Size` via `coalesce(..., 0)` — if that internal name is
   absent in your tenant the gate is simply inactive (no gate, exactly
   v1.9 behavior), never broken. After the first run, check one
   `Get_files` item's raw outputs; if the property is named differently
   (e.g. `{Size}`), fix the one Switch expression per
   designer-edits.md §F2.
3. **PromptVersion is left at `v1.1` intentionally.** Bump it to `v1.2`
   only together with pasting the hardened prompt
   (`review/patches/DocIndex_Prompt_v1_2.md`) — the package must not
   claim a prompt rev the tenant isn't running.
4. **After any import, re-verify the designer touch-ups the package
   cannot carry** (per the bundle README): the script picked on
   `Extract_media_pptx/docx` must be MediaExtract, the prompt action's
   model/prompt binding must match your tenant's prompt id, and the
   `Get_files` pagination setting (20000) survived the import.
5. **First run after import:** use smoke mode (Config → SmokeFile) on one
   known-good pptx, confirm `Run_summary` reads sensibly
   (`library_items_seen=… processed=1 errors=0`), then clear SmokeFile.

## Exact change list (v1.9 → v2.0 definition)

| Finding | Change |
|---|---|
| F1 | `Check_kw` `$filter` → `Title eq '@{outputs('Kw_clean')}'` (single escape) |
| F2 | `Switch_ext` On-expression gates non-xlsx files > 3,500,000 bytes to `'oversize'` → default → existing Skipped branch |
| F3 | New Composes `Prompt_text_raw` + `Prompt_json_slice` (first-`{`-to-last-`}` slice); `Parse_prompt_output` = `@json(outputs('Prompt_json_slice'))` |
| F4 | `Get_files` `$top` 5000 → 20000; pagination `minimumItemCount` 5000 → 20000 |
| F6 | Catch: `Filter_failed` (over `result('Try_index')`) + `Err_detail` Compose; `LastError` written on Create/Update_doc_error, cleared (`string('')`) on Create_doc/Update_doc |
| F8 | `Extract_media_pptx/docx` + image loops wrapped in `If_has_media_*` (`@not(empty(outputs('Zip_extract_*')?['body/result/media']))`) |
| F9 | `Find_sharers` `$top` 200 → 5000 |
| F10 | `Get_keywords` `$top` 500 → 5000 |
| F11 | `Init_ErrorCount` variable; `Increment_ErrorCount` in Catch; top-level `Run_summary` Compose (runs on loop Succeeded/Failed/TimedOut) |

Untouched, by design: all keys (DocKey/IdKey/KWKey/LinkKey), Error/Skipped
retry semantics, read-site/write-site split, Config literals, connection
references, script bindings, trigger schedule.

Validation performed on this package: all nine edits asserted present;
runAfter dependency graph resolves in every scope; every
`outputs()`/`body()`/`result()` reference resolves to an existing action;
all expressions paren-balanced; zip structure matches v1.9 (only
`definition.json` replaced) and parses.

---

**Addendum (2026-08-11, r2 PV-1):** the sibling import zip was re-cut
with the connection `displayName` (a personal work email) scrubbed
from its `manifest.json`. The `definition.json` payload is
byte-identical to the pre-scrub zip; only the manifest changed, so
the zip is no longer the byte-exact export artifact (git history
holds the original). Import behavior is unaffected — connections are
re-mapped at import time.
