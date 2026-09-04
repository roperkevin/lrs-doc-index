# STATUS — currently deployed versions (single source of truth)

Updated with every promotion/paste. If a number here disagrees with a
file header or CHANGES entry, this table wins the argument about what
is *deployed*; the file's own header wins about what is *authored*.
Last updated: **2026-09-04u** — see "Current state" below.
Per-day narratives now live in `STATUS_history.md` (moved 2026-09-03,
review r7): this file keeps the deployed-truth TABLES; the story of
each change belongs to the component CHANGES files.

## Current state (2026-09-03q)

- **Pipeline: DOWN — auth expired** (open action 12): Conditional
  Access rejects device-code sign-in; fix is `"auth": "interactive"`
  + one console sign-in on the sweep machine. Nothing indexes until
  then — including the reformat rollouts (action 11).
- Nightly sweep + weekly curation run LOCALLY (cloud flows OFF/never
  functional); SharePoint holds storage + the two AI Builder prompts.
- **2026-09-03q (review r7 batch, authored on main):** sweep
  v1.30–v1.36 (hardening: timeouts/config-validation/Node guard;
  lib/ module split; per-run gzip list backups; webhook alerts +
  `--check-heartbeat` dead-man task; opt-in Graph download fallback;
  status-page trend table; `_Index.md` browse pages; opt-in OCR lane
  for scanned PDFs), curate `--repoint` (the librarian junction
  backfill), **gantt v1.0** (Flow #2 as a local job: Issue Refs +
  gantt/titlematch edges), a standing CI typecheck gate, and a
  green-gated `deploy` branch that the sweep machine now self-updates
  from. Gates: `check_local_sweep.py` 185/185, `check_typecheck.py`
  7/7, PAD 27/27, standing suites green. NOTE: list backups, browse
  pages and the trend table activate on the first nightly run after
  this lands on `deploy`; alerts/heartbeat/fallback/OCR/gantt are
  config- or invocation-gated (see "New ops pieces" in open action 13).
- **2026-09-03r (review r7 PHASE 4, owner-approved):** sweep
  v1.37–v1.39 — the **msg lane** (Outlook .msg indexes via a
  zero-dependency CFB parser; previously Skipped rows rescue
  automatically on the next run — no enable step),
  **embedding-assisted relatedness** (opt-in `sweep.embedRelated` +
  `llm.embeddings`; Voyage/OpenAI-compatible endpoint, content-hash
  cached, RelatedRank untouched, fail-open to BM25 — note document
  text leaves the tenant when on), and **remote-files mode**
  (`sweep.remoteFiles`: the sweep with NO OneDrive — sidecars mirror
  down and write through Graph) with a DISABLED-by-default hosted
  GitHub Actions sweep (`hosted-sweep.yml`, gated on the
  `HOSTED_SWEEP_ENABLED` repo variable; prerequisites + the
  credentials policy decision in `local/Hosted_Runner.md`). Gates:
  `check_local_sweep.py` **201/201**; standing suites + typecheck
  green.
- **2026-09-03s (wireframe fidelity — DF-12, authored on main):**
  SlideFigures **v2.1** (wireframe text is REAL where OCR provides it
  — covered rows render as `<text>` in the bar weights, missed rows
  keep bars, `ocrWanted` names the pictures worth transcribing; and
  anti-aliasing artifact suppression — parallel 1px scan bars collapse
  to one stroke, separators crossing content are dropped, killing the
  full-height line clusters and doubled borders real screenshots
  produced), sweep **v1.40** (the wireframe-OCR loop over the existing
  `sweep.tesseractPath` opt-in — no new config), ops **v2.4** (the
  optional `ocrJson` param). Gates: `check_figures.py` 18 figures (8
  of 13 new assertions discriminate against v2.0),
  `check_local_sweep.py` **206/206** incl. the wireframe-OCR leg, PAD
  27/27, svg2pptx PASS (all 18 figures, transcribed text editable in
  python-pptx), typecheck green. Corpus refresh: `--reformat` (no AI
  spend); OCR'd text appears wherever Tesseract is configured.
- **2026-09-03t (raster coverage — DF-13, authored on main):**
  SlideFigures **v2.2** — every pasted raster reaches the raster
  tiers: pngDecode covers ALL of PNG (bit depths 1-16, palettes,
  tRNS transparency composited onto the white ground, Adam7
  interlace — sub-8-bit palette mockups and transparent grounds were
  silently kept at captions), plus new zero-dep baseline-JPEG
  (huffman/restart/any-sampling, verified against Pillow), GIF (LZW,
  interlace, transparency) and BMP decoders behind magic-byte
  dispatch; progressive JPEG refused by design; TRACE_MAX_PX
  5.6MP→9.5MP so 4K captures decode. No sweep/ops changes. Gates:
  `check_figures.py` 22 figures (8 of 9 new assertions discriminate
  against v2.1), 21 decoder cases bit-exact vs Pillow,
  `check_local_sweep.py` 207/207, PAD 27/27, svg2pptx PASS (22
  figures), typecheck green. Corpus refresh: `--reformat`.
- **2026-09-04u (OCR serviceability + control fidelity — DF-14,
  authored on main):** the answer to "why is there no text": sweep
  **v1.41** — wireframe OCR needs Tesseract ALONE (pdftoppm is only
  the scanned-PDF lane's renderer; a machine without Poppler now
  still transcribes screenshots), and placeholder wireframes are
  never silent (summary counters `figures_ocr` / `figures_ocr_off`
  plus one loud stderr note naming the fix when wireframes render
  with greek bars for lack of OCR). SlideFigures **v2.3** — glyph
  run acceptance 14→40px (large-font dialog titles used to VANISH
  from wireframes), and isolated ink-dense square boxes render as
  icon chips (`wf-ico` — calendar buttons, dropdown glyphs; a
  density floor keeps rounded-corner arcs from minting phantoms; a
  solid glyph inside a text row no longer double-renders as a
  button block). Gates: `check_figures.py` 23 figures (5 of 6 new
  assertions discriminate against v2.2), `check_local_sweep.py`
  **211/211** incl. the tess-only and placeholder-note legs, PAD
  27/27, svg2pptx PASS (23 figures), typecheck green. Corpus
  refresh: `--reformat`; the run now REPORTS whether OCR ran.

## Core sweep

| Piece | Deployed | Authoritative file |
|---|---|---|
| **Local sweep — THE deployed sweep** | **v1.4.3, DEPLOYED 2026-08-14** on the owner's machine (`C:\Repos\lrs-doc-index`, tracks main): delegated device-code auth (no app registration), the flow's own AI Builder prompt via Dataverse Predict, hyperlink columns via SPO REST, PromptVersion **v2.0** (v2.8 sidecar format + all §v2_7-fixes semantics built in). Scheduled task "LRS Doc Index Sweep" daily 17:00 via `local\run_sweep.cmd`; one-doc live smoke + scheduled test-fire passed | `local/Local_Setup.md` / `local/CHANGES.md` |
| Flow (DocIndexSweep) | **RETIRED — turned OFF 2026-08-14** (was v2.7 with the §v2_7-fixes defects; kept in the portal solely as rollback: turn it on + disable the scheduled task, never both). Its pending windows (§v2_7-fixes, v2.8) apply ONLY on rollback | live export (see `flow/v2_8/CHANGES.md`) / `flow/v2_8/definition.json` (authored, never imported) |
| AI Builder prompt (DocIndex) | v1.3 (pasted 2026-08-11) — still live: the local sweep calls this same model via Dataverse Predict | `prompts/DocIndex_Prompt.md` |

## Office Scripts (pasted into the Automate-tab workbook)

**2026-08-14 — pastes moot while the local sweep is the deployed
sweep**: it runs the repo `scripts/*.ts` directly (via
`pad/runner/ops.mjs`), so the tenant workbook copies below are only
exercised on a cloud-flow rollback. The table records their state
as of the handover; resume the paste plan only if rolling back.

| Script | Repo version | Pasted on tenant |
|---|---|---|
| ZipTextExtract | **v2.2** (2026-09-03 — DL-1 diagram-label collapse; `check_batch_v2_2.py` PASSED, v2.1-vs-v2.2 IDENTICAL on every pre-v2.2 fixture) | tenant runs v1.9 (pasted 2026-08-11); v2.0 and v2.1 superseded in-repo before their paste — on rollback **paste v2.2 with the v2.8 window** (it carries CF-1 forward) |
| MediaExtract | **v1.3** (r2) | **PENDING** — tenant runs v1.2 (pasted 2026-08-11) |
| RelatedRank | **v2.2** (2026-08-15 — body-sim/filename/folder as dormant optional fields for the local sweep; flow-shaped output byte-identical to v2.1, `check_related` PASSED) | **PASTED v2.1** with the v2.6 window — sufficient on rollback (v2.2's fields stay dormant on the flow); paste v2.2 only if desired |
| SidecarPatch | **v1.6** (r6) | tenant presumed at v1.5 (the v2.7 window's prereq; not directly verifiable from the export) — **v1.6 is a strict superset, safe to paste any time BEFORE the v2.8 window** |
| RegexExtract | **v1.4** (r6) | tenant runs v1.2 (pre-v2.2); v1.3 superseded in-repo before its paste — v1.4 is additive-safe under any flow, products surface with the v2.8 window |
| SlideFigures | **v2.3** (2026-09-04 — DF-1 slide diagrams as SVG; DF-2 multi-figure/graph lane; DF-3 routing, grid snap, legends, rotation, raster tracing; DF-4 one SVG per redraw diagram + table anchors; DF-5 label-collision fixes, degenerate splits, title boxes dropped; DF-6 arrowheads snapped to line tips; DF-7 spanning events as route chains; DF-8 route to the front as a dash, smaller heads on solid carriers, hash marks for labelled anchors; DF-9 two-tone palette; DF-10 calm soft-band style + figure cap 40→96; DF-11 UI screenshots redrawn as standardized wireframes; DF-12 wireframe fidelity — real OCR'd text via the sweep's Tesseract lane, anti-aliasing artifact suppression; DF-13 every pasted raster decodes — full PNG (all depths/palettes/transparency/interlace), baseline JPEG, GIF, BMP, budget lifted to 4K; DF-14 large-font text survives the glyph sweep and dense control glyphs render as icon chips; `check_figures.py` PASSED) | **N/A on the cloud flow** — a local-sweep-only step; a rollback simply keeps ZipTextExtract's `[figure: ...]` caption |
| WorkbookDump | **v1.2** (r2) | **PENDING** — tenant runs v1.1 (pre-v2.2) |

The r2 batch passed `check_batch_r2.py` (all equivalence IDENTICAL,
every new behavior green, ES2017 clean) and was promoted to
`scripts/`. **The tenant paste is the open action**: paste all six in
the gate's printed order (RegexExtract, WorkbookDump, RelatedRank,
SidecarPatch, MediaExtract, ZipTextExtract), then update this table.
No prompt re-paste and no PromptVersion bump needed — the r2 changes
alter sidecar bodies only on inputs the corpus should not contain
(corrupt archives, pasted `##` markdown, 200+ table docs, phantom
revisions), so no backfill is required; changed docs converge as
their sources change.

**r3 amendment (2026-08-12)**: RelatedRank has since been promoted to
**v2.0** (`check_batch_r3.py` gate PASSED; `check_batch_r2.py` now
skips as superseded, like `check_batch.py` before it). For the r2
paste above, RelatedRank still pastes its r2 artifact
`review/patches/RelatedRank_v1_3.ts` — same signature as the live
v1.2, safe under the v2.5 flow (or skip it: v1.3 is output-identical
to the running v1.2). RelatedRank **v2.0 must NOT be pasted alone**:
its signature changed, so the paste and the flow v2.6 designer edits
are one maintenance window (`review/patches/designer-edits.md`
§v2_6). No PromptVersion bump and no backfill for r3 either — scores
and `why` prose change but the sidecar format does not; lists
converge doc-by-doc via normal reindex + reciprocal merges (verified
against both downstream consumers: TestPlanGen line-slices
`related: [` and needs only score-descending order; the Q&A agent
reads the rendered section generically).

**r4 amendment (2026-08-12)**: RelatedRank has since moved again, to
**v2.1** (`check_batch_r4.py` gate PASSED; `check_batch_r3.py` now
skips as superseded — v2.0 was never tenant-pasted). v2.1 keeps
v2.0's signature, so the v2.6 window is unchanged in shape and now
**pastes v2.1 instead of v2.0** (designer-edits §v2_6, r4
amendment); it stays fenced against the v2.5 flow exactly as v2.0
was. The upgrade: total id dominance (non-id edge scores join the
999 soft cap — no Strength pile outranks an id link), PE/Dev
name-set overlap matching, and final-mode title-token affinity (new
`title` line in `Self_rank_meta` + `title` weights in
`Config.RelatedWeights`; the authored v2.6 definition and zip were
amended in place — dormant and output-identical to v2.0 until that
line lands). The gate proves v2.0-vs-v2.1 identical on every
tenant-producible payload shape, so everything in the r3 amendment
about PromptVersion, backfill and downstream consumers carries over
unchanged.

**r6 amendment (2026-08-13, after the live-export reconciliation)**:
the r6 batch (`check_batch_r6.py` gate PASSED 2026-08-13) promotes
**ZipTextExtract v2.1** (CF-1 code fencing), **RegexExtract v1.4**
(PD-1 product detection) and **SidecarPatch v1.6** (comment metadata
frame), paired with the flow v2.8 format
(`flow/v2_8/CHANGES.md` — yaml hidden in `<!-- metadata` ... `-->`,
Product row/column, PromptVersion v1.9 → v2.0). Equivalence legs run
against the genuinely-old artifacts (v2.0 / v1.3 / v1.5) and prove
byte-identity on every prose fixture and every pre-r6 frame — so the
r2 paste guidance below carries over with two substitutions: paste
**v2.1 for ZipTextExtract** and **v1.4 for RegexExtract** (their r2
artifacts were superseded in-repo before their paste, the RelatedRank
v1.3 precedent). SidecarPatch v1.6 pastes safely any time BEFORE the
v2.8 window; the new Doc Index `Products` column must exist before
the window's designer edits (`schemas/SPList_DocIndex.csv`).

**r5 amendment (2026-08-13)**: SidecarPatch has since been promoted
to **v1.5** (`check_batch_r5.py` gate PASSED 2026-08-13), paired with
the flow v2.7 GFM sidecar format (`flow/v2_7/CHANGES.md`): sidecars
gain a third metadata frame — H1 title + info table head, yaml block
collapsed inside `<details><summary>Metadata</summary>` — and v1.5
patches all three frames, preserving whichever a file carries. Same
7-param signature; the gate proves v1.4-vs-v1.5 byte-identical on
every fenced/dashed payload (the genuinely-old
`review/patches/SidecarPatch_v1_4.ts` is the comparison side, so the
equivalence leg stays meaningful post-promotion). Paste order is the
REVERSE of the RelatedRank fencing: v1.5 pastes safely ANY time
before the v2.7 designer edits (even under the v2.5 flow), while
flow v2.7 live against v1.4-or-older silently no-ops every
new-format sidecar in the patcher. The v2.7 window bumps
`Config.PromptVersion` v1.8 → v1.9, triggering the corpus backfill
into the new layout; TestPlanGen's `related: [` slice and the Q&A
agent read both shapes during the transition (agent instructions
v1.2 describes them — paste with the window, step 6).

## Components

| Component | Version | Prompt | Notes |
|---|---|---|---|
| Q&A agent | v1.1 (instructions) — **v1.3 authored** (describes the v2.8 hidden-metadata layout, products field, code fences; supersedes the never-confirmed v1.2 paste — paste v1.3 with the v2.8 window) | — | **OPEN**: v1.1 re-paste date unconfirmed — `agent/CHANGES.md` |
| Keyword curation | **local job DEPLOYED 2026-08-15** (`local/curate.mjs` v1.11.1, Saturday 08:00 task, `curation.autoApprove: true` — merges apply automatically, digest = audit log): first live run canon=1880, merged the first 2 aliases. The cloud KeywordCuration flow was **never functional** (its AI Builder prompt did not exist until created for this deployment) — no rollback flow; the v1.1 definition remains reference-only | v1.0 pasted 2026-08-15 as tenant prompt "LRS Keyword Curation" (`173b40ef-c376-4f81-b75b-65c72323d533`) | `curation/CHANGES.md` |
| TestPlanGen | v2.0 deployed — **v2.7 authored, deploy in progress; v2.8 authored (GFM drafts); v2.9 authored (flow nodes embedded in the topic); v2.10 authored (rebuilt-list GUIDs + config-driven site/list bindings, all three flow zips re-cut — fresh imports land on the current lists); v2.11 authored (requirement-driven coverage, prompt v1.5); v2.12 authored (flows v2.2 — design-doc references, same-surface overflow, slot config, budget fix); v2.13 authored (flows v2.3 — the v2.2 budget take self-referenced its own variable and FAILED FLOW SAVE on the tenant; fixed via `Ex_remaining`/`Ref_remaining` composes, both generation zips re-cut — anyone who imported a v2.2 package must re-import); v2.14 authored (prompt v1.6 — granular cases: one behavior / one Expected Result per case, single-action steps, variant-explicit parameterization); v2.15 authored (prompt v1.7 — source case sweep: every case in every exemplar/reference plan judged applies / doesn't-apply, tailored cases minted for the Yes rows, rendered as the `## Source Case Sweep` table; deploy path for the whole coverage push: `testplangen/Coverage_Runbook.md`, open action 9)** | v1.3 pending paste — **v1.7 authored** (`prompts/TestPlanGen_Prompt.md`; the v1.7 paste replaces every pending one before it, see `testplangen/CHANGES.md` v2.15) | agent file set v1.1 live (**v1.9 authored** — GenerateTestPlan now embeds both flow nodes with the live tenant GUIDs, `testplangen/CHANGES.md` v2.9; the v1.6 topic body + both flow nodes are pasted and checker-clean on the live tenant as of 2026-08-13 — test-pane/smoke verification is the open step). **OPEN**: v2.0 deploy window (replaces the pending v1.1/v1.2 pastes) — CONTRACT change: add the fifth AI Builder input parameter `ReferenceText` + paste v1.3, apply the §3 reference-lane flow additions in BOTH live flows (or re-import the re-cut packages), plus the v1.8 marker edits if still on v1.0 markers — `testplangen/CHANGES.md` v2.0. Then finish the v2.3–v2.5 delta: StoryLookupFlow is built and wired (current GUID `a9e637bb-5197-f111-8075-6045bd0706c5`, generation agent flow `e31f2b0e-5397-f111-8075-6045bd0706c5` — per the 2026-08-13 canvas skeleton, superseding the earlier `180ed782-…`/`0e279e86-…` ids, so those flows were evidently rebuilt); run agent smoke rows 1–2c and 7, re-pasting the v1.9 topic (brings the v1.7 classify group AND both flow nodes; add the v1.8 starters + About topic — the v1.6 classification crashes on issue references), and record in `testplangen/CHANGES.md` v2.6-v2.9 |

## Harness

| Suite | Last green |
|---|---|
| check_local_sweep.py incl. the r7 legs — config validation, list backup, heartbeat/alerts, Graph fallback, OCR lane, browse pages, trend table, `--repoint`, gantt — plus the msg/embeddings/remote-files legs and the v1.40 wireframe-OCR leg (206/206) + check_pad_runner.py (27/27) + standing suites (check_format, check_related, check_regex, check_figures) + render_sample.py | 2026-09-03 (DF-12 round) |
| check_typecheck.py — standing ES2017 tsc gate over scripts/ (7/7; also a CI job, alongside the new `deploy`-promotion job) | 2026-09-03 |
| check_svg2pptx.py (svg2pptx v1.3 — SVG figures → editable pptx shapes: package/shape/style/label contract, no-plate + title-band dress, case-heading titles + native case tables + metadata line from the sidecar, sidecar lookup + override + --no-tables legs, python-pptx open leg incl. table read-back) | 2026-09-03 |
| check_figures.py (SlideFigures v2.3 / DF-14 — large-type rows + icon chips, 23 figures; plus the DF-5..DF-13 contract: label collisions, degenerate splits, title boxes, arrowheads, spanning-event chains, wireframes, OCR text, artifact suppression, all-raster decode) | 2026-09-04 (DF-14) |
| check_batch_v2_2.py (ZipTextExtract v2.2 / DL-1) + the standing suites (check_format incl. the new §12 diagram-label contract, check_related, check_regex) + render_sample.py + check_pad_runner.py (27/27) + check_local_sweep.py (128/128) | 2026-09-03 (see `review/harness/README.md` run records) |
| check_batch_r6.py / render_sample.py (v2.8 format) + full re-run of the standing suites (check_format incl. §11 code fences, check_related incl. v1.6 frames, check_regex incl. products) | 2026-08-13 (historical — r6 skips as superseded since the v2.2 promotion) |
| check_batch.py / check_batch_r2.py / check_batch_r3.py / check_batch_r4.py / check_batch_r5.py / check_batch_r6.py | skip as superseded by design (v1.9 / r2 / r3 / r4 / r5 / r6 generations). **r4 has skipped since the RelatedRank v2.2 promotion (2026-08-15)** — the 2026-08-13 row above claimed it still passed, which stopped being true then; verified skipping 2026-09-03 |

## Open actions

1. ~~URGENT — §v2_7-fixes on the live flow~~ — **SUPERSEDED by the 2026-08-14 migration**: the cloud flow is OFF; the local sweep implements all seven fixes' semantics natively (config-driven list GUIDs, correct list bindings, no SmokeFile knob). Resurrect this action (designer edits or `flow/DocIndexSweep_v2_7_fix.zip`) only on rollback.
2. Confirm + record the Q&A agent v1.1 instruction paste (`agent/CHANGES.md`).
3. ~~Confirm the curation v1.1 fix~~ — **SUPERSEDED 2026-08-15**: the cloud flow proved never-functional (no prompt existed); the local job carries DX-11 natively and its empty-queue path is gate-proven. Watch the first all-resolved Saturday digest as a courtesy check.
4. ~~r6 / flow v2.8 window~~ — **MOSTLY SUPERSEDED by the 2026-08-14 migration** (the local sweep ships the v2.8 format + PromptVersion v2.0, and script pastes are moot — see the Office Scripts note). **Still live from this action**: (a) let the v2.0 backfill converge under the nightly local runs (the Doc Index **Products** column exists — the 2026-08-14 probe wrote it); (b) paste Q&A agent instructions v1.3 + re-run the agent smoke; then update this table.
5. ~~Designer edits §r2~~ — **SUPERSEDED by the migration** (cloud-flow-only; resurrect on rollback).
6. ~~PV-1 residual~~ — **CLOSED (owner decision, 2026-08-12): accepted.** The repo stays public; the pre-scrub zips (containing the work email) remain reachable in git history, knowingly. Current-tree manifests stay scrubbed; the v2.8 zip (cut from the 2026-08-13 export) is scrubbed the same way. Revisit only if circumstances change (`review/REVIEW_v2_5_r2.md` §PV-1).
7. ~~v2.6 window~~ / ~~v2.7 window~~ — **DONE on tenant** (evidenced by the 2026-08-13 live export: RelatedRank v2.x bindings + two-phase wiring, GFM header template, PromptVersion v1.9) — but see action 1 for the mis-picks the windows introduced; the sidecar-format benefit is NOT live until FX-5 unsticks the backfill.
8. TestPlanGen v2.8 (independent window): paste prompt v1.4 + designer edits §testplangen-v2_8 (both live flows), smoke one draft in a GFM viewer, then update the TestPlanGen row (`testplangen/CHANGES.md` v2.8).
9. **TestPlanGen coverage rollout** (`testplangen/Coverage_Runbook.md`): the ordered, import/paste-only path through the pieces of actions 1, 4 and 8 plus the v2.0 ReferenceText contract — live drafts stay case-thin and doc-blind until FX-3/FX-5 revive `related:` retrieval, the fifth prompt parameter exists, and the current prompt is pasted. Every fix is baked into the current zips and prompt files (no designer edits required — that doc is now the patch-in-place alternative only); the runbook sequences imports, pastes and clicks with per-step checks and `Gen_summary` telemetry verification. Work it top to bottom instead of cherry-picking the pieces.
10. **Roll DL-1 over the corpus** (`sweep.mjs --reformat`, no AI
    spend): ZipTextExtract v2.2 changes sidecar *bodies* for
    diagram-bearing decks. New and re-indexed docs pick it up
    automatically on the nightly run; existing sidecars keep their old
    label debris until a reformat pass re-extracts them. Run
    `local\run_sweep.cmd --reformat` (or `node local/sweep.mjs --config
    <cfg> --live --reformat`) once — it rewrites only the text below
    the `---` seam, preserving header, metadata yaml, related region
    and docs block byte-for-byte. No PromptVersion bump: the metadata
    format is unchanged, so this must NOT trigger a full reindex.
11. **Re-run `sweep.mjs --reformat` for figures** — SlideFigures v1.0 adds an
    SVG per diagram slide, written into the media folder and linked directly
    after the slide heading. New and re-indexed docs get them on the nightly
    run; existing sidecars need the one reformat pass (no AI spend, no
    PromptVersion bump). This supersedes open action 10 — one pass covers both.
    Since sweep v1.25 the same pass also applies the test-case slide
    headings (`local/CHANGES.md` v1.25; reshaped v1.29 / TC-3 —
    classification H2 + scenario H3, specifics kept in the body, so
    sidecars carrying TC-1-shaped `## Case N — …` headings need this
    pass too) — still one pass for everything.
12. **Restore sweep auth** — device-code sign-in is refused by
    Conditional Access (`AADSTS53003`), so the nightly pipeline has been
    failing closed with `AUTH EXPIRED` since the refresh token expired.
    Fix on a joined machine: set `"auth": "interactive"` in
    `local/config.json` (local/CHANGES.md v1.24) and run once from a
    console to complete the browser sign-in. If `dsregcmd /status` shows
    the machine unregistered, use `"auth": "app"` with an Entra app
    registration instead (Local_Setup.md §2). Until this clears, nothing
    indexes — including the SlideFigures rollout in action 11.
    **Consider moving to `"auth": "app"` regardless** (review r7, risk
    R2): client credentials survive CA policy changes and idle refresh
    tokens, and make the runner machine fungible.
13. **Activate the r7 ops pieces** (review r7; all authored + gated,
    each needs one enable step on the sweep machine / tenant):
    (a) alerts — set `alerts.webhookUrl` (Teams incoming webhook) in
    `local/config.json`; (b) dead-man — register a second scheduled
    task for `local\run_heartbeat.cmd` (e.g. daily 09:00);
    (c) gantt — verify the Issue Refs list GUID on tenant, add
    `sharePoint.lists.issueRefs` to config, run
    `gantt.mjs --config ... [--dry-run]` then `--live` and record the
    first run here; (d) repoint — after the next approved keyword
    merges, run `curate.mjs --repoint --live` then `sweep.mjs
    --rerank`; (e) optional — `sweep.graphDownloadFallback: true`
    (sync-lag nights become Graph downloads) and
    `sweep.tesseractPath` (OCR lane; install Tesseract).
    Auto-on with the next deploy: list backups, `_Index.md` browse
    pages, the status-page trend table, **and the msg lane** (phase 4
    — previously Skipped .msg rows rescue by themselves). NOTE: the
    machine's self-update now tracks the `deploy` branch (CI promotes
    it from main when all suites are green) — no action needed, the
    first `git fetch origin deploy` just works.
    **Phase-4 opt-ins** (each needs an owner decision recorded here):
    (f) embeddings — provision a Voyage (or compatible) key, set
    `sweep.embedRelated: true` + `llm.embeddings` in config, run
    `sweep --rerank` once; DATA EGRESS: document text goes to the
    embeddings endpoint (Local_Setup §8's decision class);
    (g) hosted runner — work `local/Hosted_Runner.md` top to bottom:
    app-registration auth first, then the org-policy call on tenant
    credentials in GitHub secrets, then the `HOSTED_SWEEP_ENABLED`
    variable; never both the hosted run and the desktop task live.
