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
| RelatedRank_v2_1.ts | **r4 — gated + promoted; TENANT PASTE PENDING, fenced to the v2.6 flow window** (same signature as v2.0 — the window now pastes this; designer-edits §v2_6, r4 amendment) |
| RelatedRank_v2_0.ts | **r3 — gated; superseded in-repo by v2_1 before its paste.** The v2.6 window pastes v2.1 instead (same signature). Frozen. |
| RegexExtract_v1_3.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-1) |
| SidecarPatch_v1_4.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-2/3) |
| WorkbookDump_v1_2.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-4) |
| ZipTextExtract_v2_0.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-5..8) |
| MediaExtract_v1_3.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-5/8) |
| RelatedRank_v1_3.ts | **r2 — gated; superseded in-repo by v2_0 before its paste.** Still the artifact the r2 six-script paste uses for RelatedRank (same signature as the live v1.2, safe under the v2.5 flow; or skip it — output-identical to v1.2). Frozen. |
| TestPlanGen_Prompt_v1_3.md | **Promoted to `prompts/TestPlanGen_Prompt.md`; TENANT PASTE PENDING — contract change** (reference-functionality input lane: fifth AI Builder input parameter `ReferenceText` + §3 flow additions — replaces the pending v1.2 paste; `testplangen/CHANGES.md` v2.0) |
| TestPlanGen_Prompt_v1_2.md | **Superseded in-repo by v1_3 before its paste.** Its enumeration-coverage rule and conditional sections are carried forward unchanged in v1.3. Frozen. |
| TestPlanGen_Prompt_v1_1.md | **Superseded in-repo by v1_2 (then v1_3) before its paste.** Its marker fix (square-bracket output sentinels + G9 designer edits) is carried forward unchanged. Frozen. |
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
