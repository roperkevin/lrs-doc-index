# review/patches/ — proposed and promoted change artifacts

This folder is the staging/audit area for changes that require a
manual tenant action (script paste into the Automate workbook, prompt
paste into AI Builder, designer edits). `scripts/` and `prompts/`
hold the authoritative current versions; files here are either
**active** (authored, not yet pasted) or **frozen** (promotion
history / gate inputs — do not edit).

| File | Status |
|---|---|
| designer-edits.md | Living log of manual flow-designer edits, newest section last |
| RegexExtract_v1_3.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-1) |
| SidecarPatch_v1_4.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-2/3) |
| WorkbookDump_v1_2.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-4) |
| ZipTextExtract_v2_0.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-5..8) |
| MediaExtract_v1_3.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-5/8) |
| RelatedRank_v1_3.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-9) |
| DocIndex_Prompt_v1_3.md | Frozen — promoted to `prompts/DocIndex_Prompt.md`, pasted 2026-08-11 |
| DocIndex_Prompt_v1_2.md | Frozen — superseded promotion history |
| ZipTextExtract_v1_9.ts | Frozen — promoted to `scripts/` 2026-08-11 (v1.9 batch) |
| MediaExtract_v1_2.ts | Frozen — promoted to `scripts/` 2026-08-11 (v1.9 batch) |
| RelatedRank_v1_2.ts | Frozen — promoted to `scripts/` 2026-08-11 (v1.9 batch) |
| SidecarPatch_v1_3.ts | Frozen — promoted to `scripts/` 2026-08-11 (v1.9 batch) |
| MediaExtract_v1_1.ts | Frozen — historical gate input (`check_batch.py` byte-diffs it; `run_diff.py`'s recipe wraps it) |

Removed in r2: `ZipTextExtract_v1_6.ts` (superseded twice over,
referenced only by a commented-out command — recoverable from git
history). Promoted patches are kept verbatim as the audit record of
what was gated and pasted; the CURRENT batch's patches differ from
`scripts/` only in their header banner, while superseded batches
(the v1.9 set, now behind the r2 set) drift further with each round —
that drift is the history, not a bug.
