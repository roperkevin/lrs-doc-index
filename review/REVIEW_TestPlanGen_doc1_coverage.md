# TestPlanGen — Draft Coverage Review, doc 1 (2026-08-12)

Reviewed: the generated draft `TestPlanDraft__doc1__20260812174542.md` (TestPlanGen
prompt v1.0) line-by-line against its source user story, doc 1 — "Auto-Populate
Referents for Event Edits" (sidecar `User Stories/auto-populate-referents-for-event-edits__doc1.md`,
source `ExB - AutopopulateReferents.pptx`, slides 1–9). Every statement in the
story's Workflow line (slide 2), Acceptance Criteria (slides 3–5), Testing
(slide 6), Automation (slide 7), and Documentation (slide 8) sections was mapped
to the draft's test cases; the generation prompt (`prompts/TestPlanGen_Prompt.md`,
v1.1 — draft-shape/coverage rules byte-identical to the v1.0 that produced this
draft) was then read to determine which misses are prompt-design faults versus
one-off model faults.

**Overall verdict:** the draft is a solid baseline — 9 of 15 traced requirements
fully covered, every case carries a Trace line, and the genuinely unknowable
items (input methods, EXB version) were correctly [VERIFY]-flagged rather than
invented. But it silently drops one whole edit pathway the story names
(attribute-table edits), thins enumerated coverage (point/line matrix,
routeID-only), and structurally cannot represent the story's Automation and
Documentation slides because the prompt's DRAFT SHAPE hard-codes five sections.
All three hard gaps are prompt-design faults, fixed in prompt v1.2.

IDs: `CG` = coverage gap (this draft), `RC` = root cause (generator).

## Trace matrix

| # | Story requirement (slide) | Draft coverage | Status |
|---|---|---|---|
| 1 | Applies only when referents are configured (S3) | TC-N2 | ✅ |
| 2 | Executes for ALL point AND line add/edit workflows (S3) | TC-P1 add-point, TC-P2 add-line; TC-P3/P4/P5 edits don't distinguish point vs line | ⚠️ CG-4 |
| 3 | Add Point/Line: honor all input methods (S3) | TC-P1/P2 generic; [VERIFY]-flagged — story doesn't enumerate methods | ⚠️ source-limited, correct behavior |
| 4 | Add: populate referents per configuration and inputs (S3) | TC-P1, TC-P2 | ✅ |
| 5 | Split: route+measure for new referents; upstream→To, downstream→From (S4) | TC-P6 | ⚠️ CG-6 — outer referents (upstream From, downstream To) not asserted unchanged |
| 6 | Merge: preserve; From from upstream, To from downstream (S4) | TC-P7, TC-N5 | ✅ |
| 7 | DynSeg & **Attribute Table**: routeID/measures updated → update referents (S5) | TC-P8 covers DynSeg only; no case edits via the attribute table | ❌ **CG-1** |
| 8 | routeID update → update referents (S5) | TC-P3 "route ID and/or measures" | ⚠️ CG-5 — no routeID-only (measures unchanged) case |
| 9 | Only impacted referent(s) update on partial edits (S5) | TC-P4, TC-N6 | ✅ |
| 10 | No measure change → no update (S5) | TC-P5, TC-N1 | ✅ |
| 11 | Attribute-only/date edits preserve referents (S5) | TC-P5, TC-N1 (near-duplicates, minor) | ✅ |
| 12 | Testing items (S6) | inherit the AC statuses above | ⚠️ |
| 13 | Automation: all pathways incl. **Table**; impacted logic; non-measure regression (S7) | nothing | ❌ **CG-2** |
| 14 | Documentation: 4 items (S8) | nothing | ❌ **CG-3** |
| 15 | Update workflow (S2) | TC-P3/TC-P4 | ✅ |

## Findings

| # | Finding | Severity | Surface |
|---|---------|----------|---------|
| CG-1 | Attribute-table edit pathway untested — story pairs "Dynamic Segmentation & Attribute Table" in one AC heading and lists "Table" in the automation pathways; the draft tests only DynSeg | **High** | This draft + prompt |
| CG-2 | Story's Automation slide (all six pathways, impacted-referent logic, non-measure regression) has no home in the draft | Medium | Prompt (draft shape) |
| CG-3 | Story's Documentation slide (4 items) has no home in the draft | Medium | Prompt (draft shape) |
| CG-4 | Edit cases (TC-P3/P4/P5, TC-N1) don't exercise both point and line events despite "all point and line event add/edit workflows" | Medium | This draft + prompt |
| CG-5 | No routeID-only change case (re-route with measures unchanged must still update referents) | Low | This draft |
| CG-6 | Split case doesn't assert the outer referents are preserved | Low | This draft |

Root causes in the generator (prompt v1.0/v1.1):

- **RC-1 — no enumeration-coverage rule.** GROUNDING RULES require every case to
  trace to the story, but nothing requires the converse: that every workflow,
  pathway, or entity type the story *enumerates* gets a case. CG-1, CG-4, CG-5
  are all instances of an enumerated item ("Table"; "point and line"; "routeID
  or measures") collapsing into a neighboring case.
- **RC-2 — fixed five-section DRAFT SHAPE.** Overview / Setup / Positive /
  Negative / Open Questions leaves Automation and Documentation story content
  with nowhere to go, so the model drops it. CG-2, CG-3.
- **RC-3 — case-count bias.** "4–10 positive … prefer fewer, well-grounded cases
  over padded coverage" pushes toward consolidation exactly when an
  enumeration-heavy story needs expansion. Aggravates RC-1.

## Resolution

- **This draft:** revised copy produced 2026-08-12 (adds TC-P9/P10 attribute-table
  cases, TC-P11 routeID-only, point/line parameterization of TC-P3/P5/N1, split
  outer-referent assertion, Automation Notes and Documentation Impacts sections).
  Delivered for the §4 review loop; not stored in this repo — drafts live in the
  drafts folder only.
- **Generator:** prompt v1.2 (`review/patches/TestPlanGen_Prompt_v1_2.md`,
  deployed text at `prompts/TestPlanGen_Prompt.md`) — adds the
  enumeration-coverage grounding rule (RC-1, RC-3) and two conditional draft
  sections, `## Automation Notes` and `## Documentation Impacts`, emitted only
  when the story carries such content (RC-2). Component bumped to v1.9;
  smoke row 1 updated and a doc-1 coverage row added
  (`testplangen/TestPlanGen_Smoke.md`). Tenant rollout (AI Builder re-paste +
  `Config_gen` designer edit) tracked OPEN in `STATUS.md` / `testplangen/CHANGES.md`.
