# TestPlanGen Coverage Runbook — imports and pastes only

Why this runbook exists: drafts on the live tenant generate too few
test cases and visibly ignore supporting documentation. Neither is a
single defect — it is the compound of already-authored-but-never-
deployed fixes. **Every fix is baked into the current import
packages and prompt files**, so this runbook is deliberately
import/paste/click-only: you never author an expression on the
tenant. (The designer-edit route still exists for every step —
`review/patches/designer-edits.md` — but it is the alternative for
patching a live flow IN PLACE to keep its run history, never a
requirement.)

The compound, in causal order:

1. **Retrieval is dead or degraded** — FX-3 mis-binds `sharersJson`
   on the live sweep, so keyword-based `related:` edges stopped
   appearing; FX-5 pins the nightly run to one file, stalling the
   corpus backfill. TestPlanGen's digest, exemplar, and reference
   lanes ALL feed off the sidecar `related:` line, so on freshly
   indexed stories `Gen_summary` shows
   `neighbors=0 exemplars=0 references=0` and no prompt text can
   compensate. Fixed by the sweep import in step 1.
2. **The reference lane was never created** — the fifth AI Builder
   input parameter `ReferenceText` (the v2.0 CONTRACT change) is
   still pending, so even well-linked plans and design docs never
   reach the model as text. Fixed by one UI click + the core import
   in step 2.
3. **The live prompt predates every coverage rule** — enumeration
   coverage (v1.2), reference grounding (v1.3), requirement-driven
   case counts + the Coverage Map (v1.5), and granular one-behavior
   cases (v1.6) are all paste-pending.
   Fixed by one paste in step 2.

## Which flows this touches

Generation logic lives in ONE flow: **TestPlanGenCore** (the child).
`TestPlanGenAgentFlow` and `StoryLookupFlow` are thin wrappers — no
`Config_gen`, no retrieval logic, nothing here ever changes them.
The standalone list-menu **TestPlanGen** flow is an OPTIONAL second
front door (run from the Doc Index list's Automate menu); if you
never built it, nothing is missing — its package
(`TestPlanGen_v1_0.zip`) exists for agent-less tenants. Wherever
older CHANGES entries say "both live flows", on an agent-only tenant
that means the core alone.

## 0 — Determine the deployed state first (read-only, ~5 minutes)

The deploy-record tables have no dated tenant rows after prompt
v1.0, so verify rather than assume:

- Open the `LRS Test Plan Generation` AI Builder prompt and COUNT
  its input parameters. Four = pre-v1.3 contract (step 2 creates the
  fifth). Five = the contract exists; step 2 reduces to paste +
  import.
- Open TestPlanGenCore and read
  `Config_gen.TestPlanGenPromptVersion` — that stamp is what draft
  banners have been recording.
- Read the last few runs' `Gen_summary` in run history.
  `neighbors=0` on stories that plainly have peers → retrieval is
  starved (step 1 matters most); healthy neighbors but thin drafts →
  prompt bias (step 2 matters most). Record what you find in
  `testplangen/CHANGES.md`.

## 1 — Sweep: import `flow/DocIndexSweep_v2_8.zip`

One import replaces every outstanding sweep designer edit: the
package payload carries FX-1..FX-6 (incl. the FX-3 sharersJson fix
and `SmokeFile: ""`), the v2.8 format upgrade (X1–X5, PromptVersion
v2.0), the current list GUIDs, and the r2-2/r2-3 hygiene edits. It
was cut from the 2026-08-13 live export, so on this tenant it lands
with real script/prompt bindings — no placeholder re-picks.

Paste-first prerequisites for the v2.8 format (all paste/click —
the order and details are STATUS.md open action 4):

1. Create the Doc Index **Products** column
   (`schemas/SPList_DocIndex.csv`).
2. Paste the six Office Scripts into the Automate-tab workbook in
   the gate's order (RegexExtract v1.4, WorkbookDump v1.2,
   RelatedRank — r2 artifact or skip, SidecarPatch v1.6,
   MediaExtract v1.3, ZipTextExtract v2.1 — per the r6 STATUS
   substitutions).

Then: My flows → Import → **Import package (Legacy)** →
`DocIndexSweep_v2_8.zip` → map the SharePoint and Dataverse
connections when prompted → after import, **turn the OLD
DocIndexSweep flow off** (two live sweeps would double-index).
Afterwards paste `agent/QA_Agent_Instructions_v1_3.md` into the Q&A
agent.

(In-place alternative, only if you want to keep the old flow's run
history: designer edits per `designer-edits.md` §v2_7-fixes +
§v2_8. Minimal-fix alternative if you want NO format change yet:
import `flow/DocIndexSweep_v2_7_fix.zip` — fixes only, no script
pastes or Products column needed.)

`related:` lists repopulate GRADUALLY: each doc's list converges as
the nightly sweep re-indexes it. Give the corpus a few nights before
judging step 3's numbers.

Check: the nightly run completes with no Error rows; after 1–2
nights, doc 42's and doc 1's sidecars carry a non-empty
`related: [...]` whose `why` prose mentions shared keywords, not
only issue-id links.

Triage when a doc errors: read the error from the Doc Index list
(filter `IndexStatus = Error`) rather than the run page — big sweep
runs often will not expand in the run-history UI. Since the errdrill
build, the row's error names the failing leaf as a path
(`If_has_text > For_each_kw > Check_kw: {...}`). To reproduce one
doc in a run small enough for the UI: set `Config.SmokeFile` to that
doc's exact filename, run manually, read the run, then **set
SmokeFile back to ""** (a set SmokeFile pins every nightly run —
the FX-5 stall).

## 2 — TestPlanGen: one click, one paste, one import

1. **Click**: in the `LRS Test Plan Generation` AI Builder prompt,
   add the fifth input parameter — exact name **`ReferenceText`**
   (skip if step 0 counted five).
2. **Paste**: the delimited block from
   `prompts/TestPlanGen_Prompt.md` (v1.6) into the same prompt —
   replaces every pending paste before it.
3. **Import**: `testplangen/TestPlanGenCore_v1_0.zip` (Import
   package (Legacy)) — the payload carries the complete current
   core: reference lane (v2.0), GFM banner (v2.8), current list
   bindings (v2.10), the v1.6 stamp (v2.14), and the v2.2 coverage
   routing — design-doc references, same-surface overflow, slot
   config, budget fix (v2.12). Post-import clicks (each is a picker,
   not an expression):
   - Re-pick the AI Builder prompt on `Run_testplangen_prompt` (the
     packaged binding is a per-tenant placeholder — the I1 rule).
   - Add the imported flow to the solution; set run-only connections
     to embedded (Agent_Setup §1a).
   - In **TestPlanGenAgentFlow**, re-pick the **Run a Child Flow**
     action to the newly imported core (an import mints a new flow —
     the wrapper still points at the old one until re-picked), then
     turn the old core off.
   - Only if you use the list-menu front door: import
     `TestPlanGen_v1_0.zip` the same way (trigger list + prompt
     re-picks per Setup §3 Path A I1–I4). Agent-only tenants skip
     this.

(In-place alternative for a tenant already on the v2.0 contract:
paste + stamp per `designer-edits.md` §testplangen-v2_8 T2 and apply
§testplangen-v2_12 U1–U7 to the live core. More typing, same
result.)

Check: the Setup §2 pane check passes — reply wrapped in the
markers, six core sections, and a `## Coverage Map` whose rows all
cite a case or an Open Questions entry. A live run's `Gen_summary`
shows the new `exChars=`/`refChars=` fields (proof the v2.2 core is
the one running).

## 3 — Verify with telemetry and a before/after draft

- Run on **doc 42** (smoke row 1) and **doc 1** (smoke row 9):
  `Gen_summary` shows `neighbors≥1` on both once step 1's backfill
  has converged their sidecars; with the three Pro Add-Event offset
  plans (devtopia 3906/3910/3911) indexed and linked, doc 1 shows
  `references≥1` (smoke rows 10–11).
- Keep the last pre-runbook draft of doc 1 (or generate one BEFORE
  step 2) and diff it against the post-runbook draft —
  `python3 review/harness/check_draft_coverage.py <draft.md>`
  (`--baseline` for the old one) prints the counters; score against
  the trace matrix in `review/REVIEW_TestPlanGen_doc1_coverage.md`:
  baseline mapped 9 of 15 requirements, target is 15 of 15 (covered
  or [VERIFY]-flagged) — with v1.5 the draft's own Coverage Map does
  the bookkeeping.
- Record the runs (date, tenant, rows passed) in
  `testplangen/CHANGES.md`; update `STATUS.md`'s TestPlanGen row and
  `prompts/README.md`'s deployed-version cell.

Failure triage is unchanged: `TestPlanGen_Smoke.md` bottom section.
The one addition — `neighbors=0` AFTER step 1 converged means the
story's sidecar predates the fix; wait for its reindex or touch the
source doc to force one.
