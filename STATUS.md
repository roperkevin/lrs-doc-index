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
| ZipTextExtract | v1.9 | 2026-08-11 |
| MediaExtract | v1.2 | 2026-08-11 |
| RelatedRank | v1.2 | 2026-08-11 |
| SidecarPatch | v1.3 | 2026-08-11 |
| RegexExtract | v1.2 | pre-v2.2 (unchanged since) |
| WorkbookDump | v1.1 | pre-v2.2 (unchanged since) |

The r2 script batch (RegexExtract v1.3, SidecarPatch v1.4,
WorkbookDump v1.2, ZipTextExtract v2.0, MediaExtract v1.3,
RelatedRank v1.3 — see `review/REVIEW_v2_5_r2.md`) supersedes this
table **only after** it passes `check_batch_r2.py` AND is pasted;
until both, the live flow runs the versions above.

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
3. r2 script batch: gate → paste → promote (`review/REVIEW_v2_5_r2.md` checklist).
4. Designer edits per `review/patches/designer-edits.md` §r2 (SourceSiteUrl; optional trigger concurrency).
