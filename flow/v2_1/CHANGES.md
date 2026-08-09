# Flow v2.1 — createArray() hardening (post-incident)

`DocIndexSweep_v2_1.zip` is v2.0 with exactly five expression changes: every
zero-argument `createArray()` fallback becomes `json('[]')`. Nothing else
differs (verified: 5-line diff against the v2.0 definition; same validators).

Supersedes v2.0 as the import target. v2.0 and v1.9 files remain in the repo
for provenance.

## The incident this fixes

Importing v2.0 and running produced, on `For_each_img_pptx`:

> InvalidTemplate. ... The template language function 'createArray' expects a
> comma separated list of parameters. The function was invoked with no
> parameters.

Root cause chain:

1. The package ships `Extract_media_pptx/docx` pointed at the **ZipTextExtract**
   script as a parseable stand-in (its scriptId equals `Zip_extract_*`'s —
   the bundle README's install step 6 exists precisely because a package
   cannot carry the MediaExtract pick). **Importing as Update resets the
   tenant's corrected binding.**
2. ZipTextExtract's result has no `images` field, so
   `outputs('Extract_media_pptx')?['body/result/images']` is null and
   `coalesce` evaluates its fallback — and zero-argument `createArray()` is
   invalid WFL. With MediaExtract correctly bound, `images` is always
   non-null (even when empty), coalesce short-circuits, and the invalid
   fallback is never evaluated — which is why v1.9 ran fine in production
   for months while carrying the same five landmines
   (`flow/definition.json:545, 690, 1093, 1334, 1349`).

`json('[]')` is a valid empty array with no argument requirement: a missing
field now degrades to an empty loop (zero iterations, run continues) instead
of an InvalidTemplate run failure. Semantics are identical whenever the field
is present.

## REQUIRED after every import — not optional

**Re-pick the script on `Extract_media_pptx` AND `Extract_media_docx` to
`MediaExtract`** in the designer, every time this flow is imported. Skipping
it no longer errors under v2.1 — it silently saves no images (LaneUsed and
text extraction are unaffected). The tell in a run: `Extract_media_*` returns
`text/rels/parts/kind/media` instead of `images/skipped/count`.

Also re-verify after import (carried from v2.0):
- the prompt action's model/prompt binding matches the tenant's prompt id;
- `Get_files` pagination threshold is 20000 (Settings → Pagination);
- `LastError` column exists on Doc Index (required before first run — F6
  writes it).

Then one smoke-mode run on an image-bearing pptx: images saved to
`/Document Index Texts/media`, `Run_summary` sensible, no errors.

## Cumulative content (v1.9 → v2.1)

All nine review designer edits from v2.0 (F1 Check_kw single escape, F2
oversize gate, F3 JSON slice, F4 Get_files 20000, F6 LastError, F8
media-present gate, F9/F10 ceilings, F11 run summary — see
`flow/v2_0/CHANGES.md`), plus this F12 hardening. PromptVersion remains
`v1.1` — bump only together with pasting the v1.2 prompt.
