# STATUS — currently deployed versions (single source of truth)

Updated with every promotion/paste. If a number here disagrees with a
file header or CHANGES entry, this table wins the argument about what
is *deployed*; the file's own header wins about what is *authored*.
Last updated: **2026-09-03i (SlideFigures v1.6 — DF-7, spanning events redraw as route chains: a line-network slide states an event running ACROSS routes (From RID R1L3 measure 10 → To RouteID R3L3 measure 25 via R2L3, split at 52.5 in R2L3's own domain); the redraw used to collapse that onto one route's ruler — a 10→25 tick grid that exists on no route, with the split clamped away as degenerate and R2L3/R3L3 missing entirely. Such slides now draw the route chain (order from the route-list table): one segment per route, each ending in its own arrowhead, route ids under their segments, only the stated measure anchors above their points, the split on the route the result table names for it, and a legend qualifying each output range with its routes. Gates: `check_figures.py` PASSED (15 fixture figures; 7 of the 10 new assertions fire against v1.5), `check_local_sweep.py` 153/153, ES2017 clean. Same reformat rollout.)**. Earlier: **2026-09-03h (sweep v1.28 — content-filter lane, found live during the v2.0.1 backfill rehearsal: AI Builder's input moderation deterministically refuses `Descriptions-ModelInstructions-Dependencies.pptx` (`InputContentFiltered` — the deck quotes model-instruction-like text), and the Error lane would have retried it, re-burning one AI call nightly. Such docs now stamp `Skipped` with `LastError` `"content filter: ..."` at the current PromptVersion — once, no rechurn; they re-enter on the next promptVersion bump or a source edit (`local/CHANGES.md` v1.28, Local_Setup §6 lane list). Gate: `check_local_sweep.py` 153/153, all new assertions fire against v1.27. NOTE for the running backfill: the dry run spends real AI calls (`classifyDoc` runs regardless of dryRun; only writes are planned), so the v2.0.1 backfill should go straight to `--live` after the calibration rehearsal.)**. Earlier: **2026-09-03g (SlideFigures v1.5 — DF-6, arrowheads snap to line tips: the v1.4 head still let the line show underneath — its stealth notch was a see-through cutout, and its ~19px back reached under the extent bar because the overshoot was only 15px. The head is now a solid triangle, the overshoot is sized to the head (18px) so it rides wholly on its own stub, refX keeps the line's round cap inside the head, and the ruler lane emits arrowheads after the extents on a carrier retracing the route's final pixels — nothing draws over a head and no line shows through one. Gates: `check_figures.py` PASSED (both new assertions fire against v1.4), `check_local_sweep.py` 150/150, ES2017 clean. Same reformat rollout as 2026-09-03f.)**. Earlier: **2026-09-03f (SlideFigures v1.4 + sweep v1.27 — DF-5 figure legibility + TC-2 heading truncation. Figures: measures and event ids can no longer print over each other (collinear-route tie now breaks measures-above / ids-below, matching the vector lane; event ids anchor on their extent's longest straight run, never a corner), a split stated ON a route end no longer draws a zero-length extent with an orphaned label and a bogus `E1 20–20` legend entry, the route id sits level with its line instead of floating at mid-height, arrowheads sharpen to a stealth profile and ride a 15px overshoot past the final tick so extents and ticks never bury or cross them (mid-band arrows suppressed where a band continues; split-marker arms stop clear of the measure text), and the decks' outlined case-text boxes are dropped from figures instead of rendering as giant nodes that duplicate the heading. Headings: `caseHeadings` no longer truncates a long case line mid-sentence — the heading takes a short title cut at a phrase break and the full text survives as a bold subheader line (`local/CHANGES.md` v1.27). Gates: `check_figures.py` PASSED — 13 fixture figures, 9 of the 12 new DF-5 assertions fire against v1.3 (the rest hold invariants); `check_local_sweep.py` 150/150; PAD 27/27; standing suites + render_sample green; ES2017 type-check clean. Reaches the corpus via the open reformat action.)**. Earlier: **2026-09-03e (SlideFigures v1.3 + sweep v1.26 — DF-4 figure↔table layout: each diagram is one SVG everywhere — the redraw lane's stacked input/output figure is now the sibling pair `slideN_fig1.svg` / `slideN_fig2.svg` (legend on the output figure) — and every figure carries a table `anchor` (geometry for drawn/traced figures, meaning for redrawn ones) that `placeFigure` uses to insert the image directly before its own table in the sidecar body, mirroring the slide's layout; unanchored figures keep the after-heading placement. Gates: `check_figures.py` PASSED (10 fixture figures incl. anchors), `check_local_sweep.py` 147/147, PAD 27/27, standing suites + render_sample green. Reaches the corpus via the open reformat action; the renamed redraw figures orphan their old `slideN.svg` files in the media folder — cleanup noted in `local/CHANGES.md` v1.26.)**. Earlier: **2026-09-03d (sweep v1.25 — TC-1 test-case slide headings: bare "## Slide N" sections in the sidecar bodies of test-plan decks now head with the slide's own case text — `## Case 2 — Loop – Split measure: 20 <!-- slide 5 -->` — with checklist slides, author-titled slides and notes untouched and the slide number kept as a hidden comment. Deterministic by decision (no AI in the `--reformat` path; rationale recorded in `local/CHANGES.md` v1.25). Presentation-layer only: ZipTextExtract, LLM input, preview and similarity index unchanged. Gate `check_local_sweep.py` 146/146, PAD 27/27, standing suites + figures green. Reaches the corpus via the same open-action-11 reformat pass, once action 12 restores auth.)**. Earlier: **2026-09-03c (AUTH: the tenant's Conditional Access now rejects device-code sign-in (AADSTS53003), which took the nightly pipeline down — `auth: "interactive"` (authorization-code + PKCE over a loopback redirect) added as the fix for a joined machine; `auth: "app"` remains the route for an unregistered one. Local sweep gate 135/135.)**. Earlier: **(SlideFigures v1.0 — slide diagrams are now rendered as SVG figures placed directly after each slide heading: vector slides from their true coordinates, raster-backed slides redrawn from the topology and measures the slide itself states. One style framework across the corpus — `docs/Diagram_Style_Framework.md`. Gates: `check_figures.py` PASSED, standing suites green, PAD 27/27, local sweep 128/128. Verified against two real decks: 20 figures from SplittingEventsinPro, 39 from MergeEventsToolPro.)**. Earlier that day: **(ZipTextExtract v2.2 — DL-1 diagram-label collapse: the drawn route diagrams in test-plan decks no longer flatten into hundreds of one-token label lines; they render as one `[figure: 10–22 · R1 · E1 · Output]` line per slide. Gate `check_batch_v2_2.py` PASSED, v2.1-vs-v2.2 byte-identical on every pre-existing fixture, PAD 27/27 and local sweep 128/128 green. Corpus rollout is `sweep.mjs --reformat` — open action 10.)**. Previously: **2026-08-15 (PIPELINE 100% OFF POWER AUTOMATE: keyword curation deployed locally — `local/curate.mjs` v1.11.1, weekly Saturday 08:00 task, `autoApprove` ON by owner decision, first live run merged 2 aliases; the "LRS Keyword Curation" AI Builder prompt was created on-tenant 2026-08-15 (`173b40ef-c376-4f81-b75b-65c72323d533`) — its absence from the model list proves the cloud KeywordCuration flow was never functional, so there was nothing to turn off. Nothing orchestrated remains in the cloud: nightly sweep + weekly curation both run locally under gates; the two AI Builder prompts and SharePoint storage are all that's tenant-side. 2026-08-14: sweep migrated, DocIndexSweep flow OFF; local sweep since hardened v1.5–v1.11.1 — status page, PDFs, out-of-scope + ghost lanes, body-sim relatedness, HTML lane)**.

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
| SlideFigures | **v1.6** (2026-09-03 — DF-1 slide diagrams as SVG; DF-2 multi-figure/graph lane; DF-3 routing, grid snap, legends, rotation, raster tracing; DF-4 one SVG per redraw diagram + table anchors; DF-5 label-collision fixes, degenerate splits, title boxes dropped; DF-6 arrowheads snapped to line tips; DF-7 spanning events as route chains; `check_figures.py` PASSED) | **N/A on the cloud flow** — a local-sweep-only step; a rollback simply keeps ZipTextExtract's `[figure: ...]` caption |
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
| check_local_sweep.py incl. the v1.28 content-filter lane (153/153) + check_pad_runner.py (27/27) + standing suites (check_format, check_related, check_regex, check_figures) + render_sample.py | 2026-09-03 (sweep v1.28) |
| check_figures.py (SlideFigures v1.6 / DF-7 — spanning-event route chains; plus the DF-5/DF-6 label-collision, degenerate-split, title-box and arrowhead contract) | 2026-09-03 |
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
    Since sweep v1.25 the same pass also applies the TC-1 test-case slide
    headings (`local/CHANGES.md` v1.25) — still one pass for all three.
12. **Restore sweep auth** — device-code sign-in is refused by
    Conditional Access (`AADSTS53003`), so the nightly pipeline has been
    failing closed with `AUTH EXPIRED` since the refresh token expired.
    Fix on a joined machine: set `"auth": "interactive"` in
    `local/config.json` (local/CHANGES.md v1.24) and run once from a
    console to complete the browser sign-in. If `dsregcmd /status` shows
    the machine unregistered, use `"auth": "app"` with an Entra app
    registration instead (Local_Setup.md §2). Until this clears, nothing
    indexes — including the SlideFigures rollout in action 11.
