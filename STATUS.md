# STATUS — currently deployed versions (single source of truth)

Updated with every promotion/paste. If a number here disagrees with a
file header or CHANGES entry, this table wins the argument about what
is *deployed*; the file's own header wins about what is *authored*.
Last updated: **2026-08-13 (live-export reconciliation: v2.6+v2.7 windows APPLIED on tenant with defects — §v2_7-fixes; flow v2.8 authored — hidden metadata + code fencing + products; r6 gate PASSED)**.

## Core sweep

| Piece | Deployed | Authoritative file |
|---|---|---|
| Flow (DocIndexSweep) | **v2.7** — the 2026-08-13 live export proves the v2.6 AND v2.7 windows applied, but with 4 designer mis-picks + a stuck smoke knob (**§v2_7-fixes, apply ASAP** — image-bearing pptx docs error, keyword relateds dead, backfill stalled). **v2.8 authored** (hidden metadata comment frame, code fencing, product lines; built FROM the live export, fixes included) | live export (see `flow/v2_8/CHANGES.md`) / `flow/v2_8/definition.json` (authored) |
| Config.PromptVersion | **v1.9** — but the v1.9 backfill has NOT run (SmokeFile stuck, FX-5); v2.0 authored, lands with the v2.8 window | live export / `flow/v2_8/definition.json` (authored) |
| Config.SmokeFile | **"ExB - AutopopulateReferents.pptx" — MUST be cleared** (FX-5): pins every nightly run to one file | designer edit |
| AI Builder prompt (DocIndex) | v1.3 (pasted 2026-08-11) | `prompts/DocIndex_Prompt.md` |

## Office Scripts (pasted into the Automate-tab workbook)

| Script | Repo version | Pasted on tenant |
|---|---|---|
| ZipTextExtract | **v2.1** (r6) | tenant runs v1.9 (pasted 2026-08-11); v2.0 superseded in-repo before its paste — **paste v2.1 with the v2.8 window** |
| MediaExtract | **v1.3** (r2) | **PENDING** — tenant runs v1.2 (pasted 2026-08-11) |
| RelatedRank | **v2.1** (r4) | **PASTED** with the v2.6 window — evidenced by the live export's v2.x parameter bindings and the title-affinity `why` prose in fresh sidecars |
| SidecarPatch | **v1.6** (r6) | tenant presumed at v1.5 (the v2.7 window's prereq; not directly verifiable from the export) — **v1.6 is a strict superset, safe to paste any time BEFORE the v2.8 window** |
| RegexExtract | **v1.4** (r6) | tenant runs v1.2 (pre-v2.2); v1.3 superseded in-repo before its paste — v1.4 is additive-safe under any flow, products surface with the v2.8 window |
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
| Keyword curation | v1.1 | v1.0 (`prompts/KeywordCuration_Prompt.md`) | **OPEN**: v1.1 live verification pending — `curation/CHANGES.md`. Definition authored (not exported): `curation/flow/v1_1/definition.json` |
| TestPlanGen | v2.0 deployed — **v2.7 authored, deploy in progress; v2.8 authored (GFM drafts)** | v1.3 pending paste — **v1.4 authored** (`prompts/TestPlanGen_Prompt.md`; v1.4 paste replaces the pending v1.3 one, see `testplangen/CHANGES.md` v2.8) | agent file set v1.1 live (**v1.8 authored**; the v1.6 topic body + both flow nodes are pasted and checker-clean on the live tenant as of 2026-08-13 — test-pane/smoke verification is the open step). **OPEN**: v2.0 deploy window (replaces the pending v1.1/v1.2 pastes) — CONTRACT change: add the fifth AI Builder input parameter `ReferenceText` + paste v1.3, apply the §3 reference-lane flow additions in BOTH live flows (or re-import the re-cut packages), plus the v1.8 marker edits if still on v1.0 markers — `testplangen/CHANGES.md` v2.0. Then finish the v2.3–v2.5 delta: StoryLookupFlow is built and wired (`180ed782-9c96-f111-8075-6045bd0706c5`; generation agent flow `0e279e86-9096-f111-8075-6045bd0706c5`); run agent smoke rows 1–2c and 7 and record in `testplangen/CHANGES.md` v2.6-v2.7 (re-paste the v1.7 classify group first, add the v1.8 starters + About topic — the v1.6 classification crashes on issue references) |

## Harness

| Suite | Last green |
|---|---|
| check_batch_r6.py / render_sample.py (v2.8 format) + full re-run of the standing suites (check_format incl. §11 code fences, check_related incl. v1.6 frames, check_regex incl. products) + check_batch_r4.py | 2026-08-13 (see `review/harness/README.md` run records) |
| check_batch.py / check_batch_r2.py / check_batch_r3.py / check_batch_r5.py | skip as superseded by design (v1.9 / r2 / r3 / r5 generations) |

## Open actions

1. **URGENT — §v2_7-fixes on the live flow** (`review/patches/designer-edits.md` §v2_7-fixes): FX-1 Extract_media_pptx zipBase64 (every image-bearing pptx errors), FX-2 Zip_extract_docx mediaPrefix, FX-3 Run_related_rank sharersJson (keyword relateds dead), FX-4 Run_regex content join, **FX-5 clear Config.SmokeFile — the v1.9 backfill has been stalled since the v2.7 window and the corpus still shows the old yaml-on-top layout.** Two equivalent routes: the five designer edits, or import `flow/DocIndexSweep_v2_7_fix.zip` (the live export + fixes, still PromptVersion v1.9 — `flow/v2_7_fix/CHANGES.md`). Standalone-safe; also folded into the v2.8 definition if action 4 happens in the same window.
2. Confirm + record the Q&A agent v1.1 instruction paste (`agent/CHANGES.md`).
3. Confirm the curation v1.1 fix on the next all-resolved Saturday run (`curation/CHANGES.md`).
4. r6 / flow v2.8 window (`review/patches/designer-edits.md` §v2_8): create the Doc Index **Products** column; paste SidecarPatch v1.6 (safe early), ZipTextExtract v2.1 + RegexExtract v1.4 (with the window; the pending r2 pastes of WorkbookDump v1.2 and MediaExtract v1.3 can ride along — `review/REVIEW_v2_5_r2.md` checklist step 5 with the r6 substitutions); designer edits X1–X5 (incl. PromptVersion → v2.0); smoke with the header byte-check (`render_sample.py`); **clear SmokeFile (FX-5)**; let the backfill converge; paste Q&A agent instructions v1.3 + re-run the agent smoke; then update this table.
5. Designer edits per `review/patches/designer-edits.md` §r2 (SourceSiteUrl; optional trigger concurrency).
6. ~~PV-1 residual~~ — **CLOSED (owner decision, 2026-08-12): accepted.** The repo stays public; the pre-scrub zips (containing the work email) remain reachable in git history, knowingly. Current-tree manifests stay scrubbed; the v2.8 zip (cut from the 2026-08-13 export) is scrubbed the same way. Revisit only if circumstances change (`review/REVIEW_v2_5_r2.md` §PV-1).
7. ~~v2.6 window~~ / ~~v2.7 window~~ — **DONE on tenant** (evidenced by the 2026-08-13 live export: RelatedRank v2.x bindings + two-phase wiring, GFM header template, PromptVersion v1.9) — but see action 1 for the mis-picks the windows introduced; the sidecar-format benefit is NOT live until FX-5 unsticks the backfill.
8. TestPlanGen v2.8 (independent window): paste prompt v1.4 + designer edits §testplangen-v2_8 (both live flows), smoke one draft in a GFM viewer, then update the TestPlanGen row (`testplangen/CHANGES.md` v2.8).
