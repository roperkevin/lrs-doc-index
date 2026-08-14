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
| HtmlToText_v1_0.ts | **r7 — gated + promoted; TENANT PASTE PENDING** (NEW script, no old side — the r7 gate's equivalence seat is SidecarPatch v1.6 unchanged, byte-preserving the v2.9 sidecar additions; standalone-safe to paste any time, consumed only by the OnlineDocFetch flow — `onlinedocs/OnlineDocs_Setup.md` §3) |
| TestPlanGen_Prompt_v1_6.md | **Promoted to `prompts/TestPlanGen_Prompt.md`; TENANT PASTE PENDING — contract change** (Esri online-doc grounding lane: SIXTH AI Builder input parameter `OnlineDocText` + §testplangen-v2_14 flow additions + conditional `## References` output section — replaces the pending v1.5 paste; `testplangen/CHANGES.md` v2.14) |
| TestPlanGen_Prompt_v1_5.md | **Superseded in-repo by v1_6 before its paste.** Its requirement-coverage rules and Coverage Map contract are carried forward unchanged in v1.6. Frozen. |
| TestPlanGen_Prompt_v1_4.md | **Superseded in-repo by v1_5 (then v1_6) before its paste.** Frozen. |
| ZipTextExtract_v2_1.ts | **r6 — gated + promoted; TENANT PASTE PENDING, paste with the v2.8 flow window** (CF-1 code fencing — a sidecar-body format change the PromptVersion v2.0 backfill converges; designer-edits §v2_8) |
| RegexExtract_v1_4.ts | **r6 — gated + promoted; TENANT PASTE PENDING** (PD-1 products — additive return fields, safe under any flow; the Products column/yaml only appear with the v2.8 window) |
| SidecarPatch_v1_6.ts | **r6 — gated + promoted; TENANT PASTE PENDING — safe any time BEFORE the v2.8 window** (strict superset of v1.5; flow v2.8 against v1.5-or-older silently no-ops comment-frame sidecars) |
| SidecarPatch_v1_5.ts | **r5 — gated + promoted 2026-08-13; superseded in-repo by v1_6 before its confirmed paste** (the v2.7 window's checklist called for it — paste v1.6 instead now). Also the r6 gate's old-side equivalence artifact. Frozen. |
| RelatedRank_v2_1.ts | **r4 — gated + promoted; PASTED with the v2.6 window** (evidenced by the 2026-08-13 live export's v2.x parameter bindings) |
| RelatedRank_v2_0.ts | **r3 — gated; superseded in-repo by v2_1 before its paste.** The v2.6 window pasted v2.1 instead (same signature). Frozen. |
| RegexExtract_v1_3.ts | **r2 — gated + promoted; superseded in-repo by v1_4 before its paste** (SB-1 carried forward). Also the r6 gate's old-side artifact. Frozen. |
| SidecarPatch_v1_4.ts | **r2 — gated + promoted; superseded in-repo by v1_5 then v1_6 before its paste** (SB-2/3 carried forward). Also the r5 gate's old-side artifact. Frozen. |
| WorkbookDump_v1_2.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-4) |
| ZipTextExtract_v2_0.ts | **r2 — gated + promoted; superseded in-repo by v2_1 before its paste** (SB-5..8 carried forward). Also the r6 gate's old-side artifact. Frozen. |
| MediaExtract_v1_3.ts | **r2 — gated + promoted; TENANT PASTE PENDING** (SB-5/8) |
| RelatedRank_v1_3.ts | **r2 — gated; superseded in-repo by v2_0 before its paste.** Still the artifact the r2 six-script paste uses for RelatedRank (same signature as the live v1.2, safe under the v2.5 flow; or skip it — output-identical to v1.2). Frozen. |
| TestPlanGen_Prompt_v1_3.md | **Superseded in-repo by v1_4..v1_6 before its paste.** Its ReferenceText contract change (fifth AI Builder input parameter) is carried forward — the v1.6 paste now brings BOTH new parameters (`testplangen/CHANGES.md` v2.0 and v2.14). Frozen. |
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
