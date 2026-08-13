# Flow v2.7-fix — the §v2_7-fixes as an import package (no format change)

This is the **repair-only** artifact: the 2026-08-13 live export with
FX-1 … FX-5 applied and nothing else — the flow stays at v2.7 /
PromptVersion **v1.9**. Import it (or apply the same five edits by
hand — `review/patches/designer-edits.md` §v2_7-fixes; identical
result) to fix the deployed flow WITHOUT taking the v2.8 format
change:

- **FX-1** `Extract_media_pptx.zipBase64` ← the pptx file content
  (was the media-prefix concat — every image-bearing pptx errored).
- **FX-2** `Zip_extract_docx.mediaPrefix` restored (docx image links
  were silently dropped).
- **FX-3** `Run_related_rank.sharersJson` ← `Get_kw_sharers` (was
  `Get_my_kws` — keyword-based related docs dead for new indexing).
- **FX-4** `Run_regex.content` joins DocText/RelsText with a real
  newline (was a literal `" \n "`).
- **FX-5** `Config.SmokeFile` shipped EMPTY — the stuck smoke knob
  that has kept the v1.9 backfill (and every full sweep) from
  running since the v2.7 window.

Authoring: same pipeline as `flow/v2_8/definition.json` (live export,
designer `metadata` blocks stripped, PV-1 connection-name scrub on the
zip's `manifest.json`). Verified: this definition differs from the
v2.8 one by EXACTLY the v2.8 format edits (Sidecar_header template +
runAfter, `Select_product_yaml`/`Product_row`, `item/Products` on the
two upserts, PromptVersion v1.9 → v2.0) — so deploying v2.8 later is
a pure superset and never re-breaks these fixes.

`flow/DocIndexSweep_v2_7_fix.zip` is cut from the live export's own
package skeleton with this definition as payload — payload
byte-identical to `flow/v2_7_fix/definition.json` (RL-4 by
construction). After import: bind the three connections, confirm the
Run-script actions still resolve (same tenant — they should), run the
smoke once, and expect the next nightly runs to start the stalled
v1.9 backfill (~150 docs/run reindexing into the v2.7 details-frame
layout, until the v2.8 window moves the target again).

Skip this package entirely if you deploy the v2.8 window right away —
`flow/v2_8/definition.json` already contains all five fixes.
