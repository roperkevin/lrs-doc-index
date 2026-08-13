# Flow v2.8 — hidden metadata, code fencing, product lines (+ live-export fixes)

v2.8 is v2.7 plus three features and five corrections, authored from
the **2026-08-13 live export** (the first authored definition built
on real tenant bindings since v2.5 — current list GUIDs, script file
ids and prompt binding as deployed, so `flow/v2_8/definition.json`
has zero placeholders on the home tenant).

`flow/DocIndexSweep_v2_8.zip` is cut from the live export's own
package skeleton (manifests and maps byte-identical apart from the
PV-1 connection-name scrub: the work-email `displayName` in
`manifest.json` → `(scrubbed connection)`) with the v2.8 definition
as payload — payload byte-identical to `flow/v2_8/definition.json`,
satisfying the RL-4 zip-matches-folder rule by construction. The
recommended deployment remains designer edits on the live flow
(`review/patches/designer-edits.md` §v2_7-fixes + §v2_8), not a
re-import.

## What the export showed first (the §v2_7-fixes round)

The export proves the v2.6 and v2.7 windows are APPLIED on the
tenant (RelatedRank two-phase wiring, GFM header, PromptVersion
v1.9) — STATUS.md previously carried them as pending — but with four
designer mis-picks and one stuck knob, all corrected in this
definition and listed as `designer-edits.md` §v2_7-fixes:

- **FX-1** `Extract_media_pptx.zipBase64` was bound to the
  media-prefix concat (MediaExtract takes only `zipBase64`) — every
  image-bearing pptx errors.
- **FX-2** `Zip_extract_docx` lost its `mediaPrefix` — docx image
  links silently gone.
- **FX-3** `Run_related_rank.sharersJson` was mis-picked to
  `Get_my_kws` — keyword-based related entries dead for newly
  indexed docs (id edges still worked, masking it).
- **FX-4** `Run_regex.content` joined DocText/RelsText with a
  literal `" \n "`.
- **FX-5** `Config.SmokeFile` was still set to the v2.7 smoke file —
  **the v1.9 backfill never ran**, which is why the corpus still
  showed the old yaml-on-top layout. The authored definition ships
  it empty.
- **FX-6** (found after the first cut; both packages re-cut
  2026-08-13) the three raw-REST creates — `Create_idrow`,
  `Create_link`, `Create_dockw` — carried the PRE-REBUILD list GUIDs
  as hand-typed URI literals (list re-picks never touch them), so
  they read the new lists but wrote to the old ones. The authored
  definitions now post to the current Doc IDs / Doc Links /
  Doc Keywords GUIDs; on the live flow this is three hand edits
  (designer-edits §v2_7-fixes FX-6).

## What changed and why

### 1. The yaml metadata block is now invisible (`<!-- metadata`)

The v2.7 `<details><summary>Metadata</summary>` collapse still
*displayed* — a disclosure line in GFM viewers, and raw yaml on
renderers without `<details>` support. v2.8 wraps the same fenced
yaml block in an HTML comment instead:

~~~~
<!-- metadata
```yaml
title: ...
related: []
```
-->
~~~~

No mainstream markdown renderer displays comment content (the same
mechanism as the `<!-- related:begin -->` markers, invisible in
every surface this corpus is read on), while every machine consumer
keeps working: the yaml lines are byte-identical apart from the new
`products:` line, so SidecarPatch v1.6 (frame parse on the exact
open/close byte sequences), TestPlanGen's `related: [` slice, the
Q&A agent's field reads and plain grep all survive. The human-facing
metadata already lives in the v2.7 info table, so nothing readable
is lost. Known residual: a metadata VALUE containing a literal `-->`
would end the hidden region early — display-only damage, no parser
impact, and no such value exists in the corpus.

### 2. Code-aware body formatting (ZipTextExtract v2.1, CF-1)

Pasted code — the Arcade scripts that fill test-plan decks —
previously flattened into loose prose lines. ZipTextExtract v2.1
adds a final content-aware pass: runs of code-shaped lines wrap in
fenced blocks (```` ```arcade ```` when Arcade globals like
`$feature` appear, bare fences otherwise), code-shaped list items
render as inline code, and the SB-6/SC-10 `\#` escapes revert inside
a fence. Detection is deliberately asymmetric: sentence-shaped lines
never start a fence (a missed fence is just the old rendering; a
false fence would mangle prose), and the r6 gate proves v2.0 ↔ v2.1
byte-identical on every prose fixture.

### 3. Product-line detection (RegexExtract v1.4, PD-1)

Documents now carry the LRS product lines they belong to, detected
deterministically from filename + AI title + extracted text:
**Roads & Highways** (full name, `RH`, `ADMRH`), **Pipeline
Referencing** (full name, `APR`, `UNAPR`), **Utility Network**
(full name, `UN`, `UNAPR`). Acronyms match as standalone
case-sensitive tokens (underscores normalized so `RH_Plan.pptx`
hits; `RHLabels` and dates like `12-APR-2026` do not). Three new
surfaces, wired by `Select_product_yaml` → `Product_row` →
`Sidecar_header` and the row upserts:

- a conditional `| **Product** | Roads & Highways · … |` info-table
  row (vanishes like the Issue row when nothing is detected);
- a `products: ["..."]` yaml line between `tools:` and `issues:`;
- a new Doc Index **Products** column (single line, `'; '`-joined —
  `schemas/SPList_DocIndex.csv`), created manually before the window.

Queued follow-on: fold `products` into RelatedRank's metadata
affinity once the column has backfilled across the corpus.

### 4. `Config.PromptVersion` v1.9 → v2.0

The format change is version-gated as always: every existing row
reindexes at MaxDocsPerRun (150) per run, rewriting the corpus into
the comment frame with fenced code and product lines. During the
transition the corpus is mixed-frame; SidecarPatch v1.6 patches
whichever frame a file carries (comment / details / fenced / dashed)
and preserves it — frame conversion happens only via this backfill.
NOTE: the backfill only runs once FX-5 clears SmokeFile.

## What did NOT change

- **Related section shape** — `EMPTY_STATE`, bullet shape, markers,
  seam: byte-identical; the r6 gate's equivalence leg enforces it.
- **TestPlanGen's `related: [` slice** — still position-independent;
  `products: [` does not match it.
- **WorkbookDump / xlsx lane** — untouched (xlsx bodies are tables;
  no code fencing there).
- **RelatedRank** — v2.1 as deployed; FX-3 only re-points an input.
- **AI Builder prompt** — text unchanged; the v2.0 bump is
  format-only, no re-paste.

## Scripts.xlsx rebind addendum (2026-08-13, second)

The Scripts.xlsx workbook (and the SidecarPatch script) were
re-created on the tenant, so the packaged identities were partially
stale. All seven Scripts.xlsx-hosted script actions
(Zip_extract_pptx/docx, Extract_media_pptx/docx,
Run_related_shortlist/rank, Run_sidecar_patch) were rebound to the
identities captured from the live designer: workbook item
`01UO6O4P3WMBDE6EAQCRDYNOJAPMGOA5EL` (drive `b!KE5hUhQX…`), plus
per-action scriptIds — notably Zip_extract_docx and
Run_sidecar_patch had pointed at an old workbook item
(`01UO6O4P7JEK…`), and Run_sidecar_patch at an old script id. Each
action also gains the designer's `metadata` block (file-id →
`/Scripts.xlsx`, operationMetadataId). `Run_regex` (already on the
new workbook) and `Dump_workbook` (source-library site, dynamic
file) verified correct and untouched; every `ScriptParameters/*`
expression preserved verbatim (FX-1/FX-2/FX-3 bindings included).
Zip re-cut, payload byte-identical.

## r2 hygiene addendum (2026-08-13)

The two never-baked r2 designer edits are now folded into this
definition (+ the zip re-cut, payload byte-identical): **r2-2
option (a)** — the dead `Config.SourceSiteUrl` key deleted
(referenced by nothing; the README documents the source site) — and
**r2-3** — Recurrence trigger concurrency pinned to 1
(`runtimeConfiguration.concurrency.runs`, the DD-8 hardening).
Behavior-identical at one run/day; a designer-built flow applies
them per `designer-edits.md` §r2.

## Deployment

In order — see `review/patches/designer-edits.md` §v2_7-fixes (FX-1
… FX-5) and §v2_8 (prereqs + X1–X5 + smoke) — or skip every
designer edit by importing `flow/DocIndexSweep_v2_8.zip` (this
definition IS the payload: fixes, X-round, r2 hygiene, current
GUIDs; map connections at import, then turn the old flow OFF —
import-first path: `testplangen/Coverage_Runbook.md` step 1). Gate:
`check_batch_r6.py` PASSED 2026-08-13. Afterwards: paste
`agent/QA_Agent_Instructions_v1_3.md`, re-run the agent smoke, and
update STATUS.md.

Rollback: revert X5 (PromptVersion → v1.9) and X4→X1 per §v2_8; the
backfill re-converges the corpus to the v2.7 shape. SidecarPatch
v1.6, ZipTextExtract v2.1 and RegexExtract v1.4 may all STAY pasted
through any rollback. Do NOT roll back the §v2_7-fixes — they are
corrections to the deployed v2.7, not part of the format change.
