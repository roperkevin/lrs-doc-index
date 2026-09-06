# Project history — the paper trail

This file is the narrative index of everything the repository used to
be. The current architecture is described in the root `README.md`; the
design records still in force are under `docs/design/`; component
release notes are under `docs/changelog/`. Everything below is history:
the files under `docs/history/` are verbatim moves of the documents
that describe each retired era, kept so that a sidecar, a list column
or a config knob can be traced back to the decision that produced it.
Deleted artifacts (flow definitions, import packages, paste copies)
remain in git history; the commit that removed each group is named in
§4 so `git show <hash>^:<path>` recovers any of them.

## 1. The eras

| Era | Dates | What ran | Where its record lives |
|---|---|---|---|
| **Power Automate flow** (DocIndexSweep v1.9 → v2.8) | 2026-08 → 2026-08-14 | A daily cloud flow swept the LocationReferencing library, ran seven Office Scripts through Excel Online "Run script" actions, classified documents with an AI Builder prompt, and wrote markdown sidecars + eight SharePoint lists. | `docs/history/flow/*_CHANGES.md` (per-version release notes), `docs/history/designer-edits.md` (every manual designer patch, F1–F12 onward), `docs/history/reviews/REVIEW.md`, `REVIEW_v2_5.md`, `REVIEW_v2_5_r2.md` (the three production reviews) |
| **Office Script paste lifecycle** | same | Script and prompt changes were authored as `review/patches/<name>_vX_Y.*`, gated by `review/harness/check_batch*.py` against the previous version, then pasted into the tenant workbook / AI Builder and "promoted" to `scripts/` and `prompts/`. | `docs/history/patches-README.md` (the paste ledger with every version's status), `docs/history/STATUS_history.md` (the per-day narratives) |
| **PAD compute offload** (v2.0–v2.5) | 2026-08 | A Power Automate Desktop flow ran the scripts on a desktop Node to escape the Run-script quota. Its Node runner (`ops.mjs`, `run_job.mjs`, `xlsx_grid.mjs`) outlived it: it is how the local pipeline still executes the extractors. | `docs/history/PAD_Setup.md`, `docs/history/PAD_CHANGES.md` |
| **Secondary cloud flows**: KeywordCuration v1.1, TestPlanGen / TestPlanGenCore v2.x, StoryLookupFlow, the agent flow | 2026-08 | Weekly keyword curation and on-demand test-plan drafting as cloud flows. KeywordCuration never became functional on the tenant; TestPlanGen shipped and was superseded by the local job. | `docs/history/Curation_Setup.md`, `docs/history/TestPlanGen_Setup.md`, `docs/history/TestPlanGen_Coverage_Runbook.md`, `docs/history/TestPlanGen_Smoke.md`, `docs/changelog/curation.md`, `docs/changelog/testplangen.md` (entries before v2.16) |
| **Copilot Studio agents**: LRS Doc Index Q&A (v1.0–v1.4 instructions), LRS Test Plan Generator (agent v1.9) | 2026-08 | A Teams Q&A agent grounded on the sidecar library, and a chat front door that resolved a story reference and invoked the TestPlanGen flow. | `docs/history/QA_Agent_Setup.md`, `docs/history/QA_Smoke_Questions.md`, `docs/history/QA_Agent_CHANGES.md`, `docs/history/TestPlanGen_Agent_Setup.md`; the current Q&A instructions (v1.4, the best description of the sidecar format) are kept live as `docs/qa-agent-instructions.md` |
| **Local pipeline** (sweep v1.0 → v1.63, testplangen v1.0 → v1.22, curate, gantt) | 2026-08-14 → | The cloud flow turned OFF; `sweep.mjs` reimplemented flow v2.8 action-for-action over Graph, running the same `scripts/*.ts` in-process and the same AI Builder prompt through the Dataverse Web API, with an Anthropic Messages lane as the alternative. This is the ancestor of the current architecture. | `docs/changelog/pipeline.md`, `docs/changelog/testplangen.md`, `docs/history/reviews/REVIEW_codebase_2026-09.md` (the review whose hardening phases were built 2026-09-03), `docs/design/*` |
| **Anthropic API + Python LLM layer** | 2026-09-06 → | The cleanup recorded in the root `PLAN.md`: legacy artifacts removed, directories renamed by role, the AI Builder lane retired, every model call routed through the `lrsdoc` Python package and versioned prompt files. | root `README.md`, `PLAN.md` |

## 2. Why things are the way they are

- **Eight SharePoint lists, lookups created via classic settings, hyperlink columns written through SharePoint REST**: tenant behaviour discovered in the flow era (`docs/history/designer-edits.md`, `docs/sharepoint-notes.md`). Still true; the pipeline still obeys them.
- **Sidecar format 3.0** (metadata table, `<issue>-<slug>.md` names, one test-case grammar): `docs/design/Sidecar_Format_Plan.md`, decided on the 2026-09-04 corpus snapshot.
- **Test Cases and Figures lists**: `docs/design/Case_Index_Plan.md`, `docs/design/Figure_Index_Plan.md`.
- **Test-plan drafting semantics** (six retrieval lanes, the verifier, the fail-closed sentinel slice): `docs/design/Local_TestPlanGen_Plan.md`; the prompt's coverage rules trace to `docs/history/reviews/REVIEW_TestPlanGen_doc1_coverage.md`.
- **`PromptVersion` as the backfill gate**: a flow-era mechanism (`docs/history/flow/v2_2_CHANGES.md`) that the pipeline keeps — a prompt or format change bumps the stamp and the nightly run re-indexes the corpus ~150 documents at a time.
- **Square-bracket sentinels in prompts** (`[[[DRAFT BEGIN]]]`): AI Builder stripped tag-shaped text from replies (`docs/history/TestPlanGen_Setup.md`). Kept for the markdown-output prompts as a cheap fail-closed check; the JSON-output prompts now use schema-pinned output instead.
- **Related-document scoring weights** (`RelatedWeights`, id-edge dominance, the 999 soft cap): flow v2.6 / RelatedRank v2.1, `docs/history/flow/v2_6_CHANGES.md`.
- **The Office-Script shape of the extractors** (`function main(workbook, …)`, no imports, three copies of the zip reader): they were pasted into an Excel workbook; the local runner executes them unmodified. Converting them to plain modules is queued (PLAN.md D8).

## 3. Reading the old version numbers

Every component carried its own version ledger; the numbers still
appear in file headers, `PromptVersion` stamps and the changelogs:

- `sweep vX.Y` — `docs/changelog/pipeline.md`
- `TestPlanGen vX.Y` (component) vs `testplangen.mjs vX.Y` (job) vs `TestPlanGen prompt vX.Y` — `docs/changelog/testplangen.md`
- `PromptVersion v2.0.x` on Doc Index rows — the DocIndex prompt (v1.3 text) + sidecar format; bumped by the pipeline's prompt loader from now on
- Flow `v2.8`, script `ZipTextExtract v2.6`, `RelatedRank v2.2`, etc. — `docs/history/patches-README.md` and the file headers

## 4. Removal record

Filled in as each deletion commit lands (Phase 3a of `PLAN.md`):

| Group | What was removed | Commit |
|---|---|---|
| G1 | `flow/` — eleven DocIndexSweep definitions and import zips | _pending_ |
| G2 | `curation/flow`, `testplangen/flow`, the four TestPlanGen zips | _pending_ |
| G3 | `pad/flow/DocIndexCompute.robin.txt`, `.gitattributes` | _pending_ |
| G4 | `review/patches/*` script and prompt copies, `review/harness/check_batch*.py`, `run_diff.py` | _pending_ |
| G6 | `testplangen/agent/` (Copilot Studio agent), superseded Q&A instruction versions v1.0–v1.3 | _pending_ |
| G7 | `schemas/Copilot_Schema_Prompt.md` | _pending_ |
| G8 | the AI Builder / Dataverse lane in `llm.mjs`, `auth.mjs`, `curate.mjs`, `testplangen.mjs`, `deck2pptx.mjs` and their harness mocks | _pending_ |
| G9 | `LRSDocIndex/` — the 2026-09-05 sidecar-library snapshot | _pending_ |
| G10 | `lib/embedindex.mjs` and the `embedRelated` lane | _pending_ |
