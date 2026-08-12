# STATUS — currently deployed versions (single source of truth)

Updated with every promotion/paste. If a number here disagrees with a
file header or CHANGES entry, this table wins the argument about what
is *deployed*; the file's own header wins about what is *authored*.
Last updated: **2026-08-11 (review round r2)**.

## Core sweep

| Piece | Deployed | Authoritative file |
|---|---|---|
| Flow (DocIndexSweep) | v2.5 + R8–R13 addenda | `flow/v2_5/definition.json` |
| Config.PromptVersion | **v1.8** | `flow/v2_5/definition.json` (Config) |
| AI Builder prompt (DocIndex) | v1.3 (pasted 2026-08-11) | `prompts/DocIndex_Prompt.md` |

## Office Scripts (pasted into the Automate-tab workbook)

| Script | Repo version | Pasted on tenant |
|---|---|---|
| ZipTextExtract | **v2.0** (r2) | **PENDING** — tenant runs v1.9 (pasted 2026-08-11) |
| MediaExtract | **v1.3** (r2) | **PENDING** — tenant runs v1.2 (pasted 2026-08-11) |
| RelatedRank | **v1.3** (r2) | **PENDING** — tenant runs v1.2 (pasted 2026-08-11) |
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

## Components

| Component | Version | Prompt | Notes |
|---|---|---|---|
| Q&A agent | v1.1 (instructions) | — | **OPEN**: v1.1 re-paste date unconfirmed — `agent/CHANGES.md` |
| Keyword curation | v1.1 | v1.0 (`prompts/KeywordCuration_Prompt.md`) | **OPEN**: v1.1 live verification pending — `curation/CHANGES.md` |
| TestPlanGen | v1.7 | v1.0 (`prompts/TestPlanGen_Prompt.md`) | agent file set v1.1 |

## Harness

| Suite | Last green |
|---|---|
| check_format.py / check_related.py / check_regex.py / check_batch.py | 2026-08-11 (see `review/harness/README.md` run records) |

## Open actions

1. Confirm + record the Q&A agent v1.1 instruction paste (`agent/CHANGES.md`).
2. Confirm the curation v1.1 fix on the next all-resolved Saturday run (`curation/CHANGES.md`).
3. r2 script batch: gate PASSED, promoted — **paste the six scripts** (`review/REVIEW_v2_5_r2.md` checklist step 5).
4. Designer edits per `review/patches/designer-edits.md` §r2 (SourceSiteUrl; optional trigger concurrency).
5. PV-1 residual: the repo is **public** and pre-scrub zips (containing the work email) remain in git history — decide accept / history rewrite / make private (`review/REVIEW_v2_5_r2.md` §PV-1).
