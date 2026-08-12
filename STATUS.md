# STATUS — currently deployed versions (single source of truth)

Updated with every promotion/paste. If a number here disagrees with a
file header or CHANGES entry, this table wins the argument about what
is *deployed*; the file's own header wins about what is *authored*.
Last updated: **2026-08-12 (round r4 — related-ranking upgrade, RelatedRank v2.1)**.

## Core sweep

| Piece | Deployed | Authoritative file |
|---|---|---|
| Flow (DocIndexSweep) | v2.5 + R8–R13 addenda — **v2.6 authored, designer application pending** | `flow/v2_5/definition.json` (deployed) / `flow/v2_6/definition.json` (authored) |
| Config.PromptVersion | **v1.8** | `flow/v2_5/definition.json` (Config) |
| AI Builder prompt (DocIndex) | v1.3 (pasted 2026-08-11) | `prompts/DocIndex_Prompt.md` |

## Office Scripts (pasted into the Automate-tab workbook)

| Script | Repo version | Pasted on tenant |
|---|---|---|
| ZipTextExtract | **v2.0** (r2) | **PENDING** — tenant runs v1.9 (pasted 2026-08-11) |
| MediaExtract | **v1.3** (r2) | **PENDING** — tenant runs v1.2 (pasted 2026-08-11) |
| RelatedRank | **v2.1** (r4) | **PENDING** — tenant runs v1.2 (pasted 2026-08-11); paste is fenced to the v2.6 flow window, see below |
| SidecarPatch | **v1.4** (r2) | **PENDING** — tenant runs v1.3 (pasted 2026-08-11) |
| RegexExtract | **v1.3** (r2) | **PENDING** — tenant runs v1.2 (pre-v2.2) |
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

## Components

| Component | Version | Prompt | Notes |
|---|---|---|---|
| Q&A agent | v1.1 (instructions) | — | **OPEN**: v1.1 re-paste date unconfirmed — `agent/CHANGES.md` |
| Keyword curation | v1.1 | v1.0 (`prompts/KeywordCuration_Prompt.md`) | **OPEN**: v1.1 live verification pending — `curation/CHANGES.md`. Definition authored (not exported): `curation/flow/v1_1/definition.json` |
| TestPlanGen | v1.7 | v1.0 (`prompts/TestPlanGen_Prompt.md`) | agent file set v1.1 |

## Harness

| Suite | Last green |
|---|---|
| check_format.py / check_related.py / check_regex.py / check_batch_r4.py | 2026-08-12 (see `review/harness/README.md` run records) |
| check_batch.py / check_batch_r2.py / check_batch_r3.py | skip as superseded by design (v1.9 / r2 / r3 generations) |

## Open actions

1. Confirm + record the Q&A agent v1.1 instruction paste (`agent/CHANGES.md`).
2. Confirm the curation v1.1 fix on the next all-resolved Saturday run (`curation/CHANGES.md`).
3. r2 script batch: gate PASSED, promoted — **paste the six scripts** (`review/REVIEW_v2_5_r2.md` checklist step 5; for RelatedRank paste the r2 artifact `review/patches/RelatedRank_v1_3.ts`, or skip it — see the r3 amendment above).
4. Designer edits per `review/patches/designer-edits.md` §r2 (SourceSiteUrl; optional trigger concurrency).
5. ~~PV-1 residual~~ — **CLOSED (owner decision, 2026-08-12): accepted.** The repo stays public; the pre-scrub zips (containing the work email) remain reachable in git history, knowingly. Current-tree manifests stay scrubbed. Revisit only if circumstances change (`review/REVIEW_v2_5_r2.md` §PV-1).
6. r3/r4 (after action 3): **paste RelatedRank v2.1 + apply the flow v2.6 designer edits in ONE maintenance window** (`review/patches/designer-edits.md` §v2_6 — V1 pastes v2.1 per the r4 amendment), smoke, full run, then update this table (flow row, RelatedRank paste column). `flow/DocIndexSweep_v2_6.zip` is already authored (v2.5 skeleton + v2.6 payload, amended for r4).
