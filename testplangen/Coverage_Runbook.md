# TestPlanGen Coverage Runbook — get the deployed pipeline to full coverage

Why this runbook exists: drafts on the live tenant generate too few
test cases and visibly ignore supporting documentation. Neither is a
single defect — it is the compound of THREE already-authored-but-
never-applied fixes plus one live-flow mis-pick, each documented in
its own patch/CHANGES entry but never sequenced into one deploy path.
This runbook is that sequence: apply in order, check after each step
(the `designer-edits.md` mold). It duplicates no patch text — every
step links to the artifact that carries it.

The compound, in causal order:

1. **Retrieval is dead or degraded** — FX-3 mis-binds `sharersJson`
   on the live sweep, so keyword-based `related:` edges stopped
   appearing; FX-5 pins the nightly run to one file, stalling the
   corpus backfill (`review/patches/designer-edits.md` §v2_7-fixes).
   TestPlanGen's digest, exemplar, and reference lanes ALL feed off
   the sidecar `related:` line, so on freshly indexed stories
   `Gen_summary` shows `neighbors=0 exemplars=0 references=0` and no
   prompt text can compensate.
2. **The reference lane was never created** — the v2.0 CONTRACT
   change (fifth AI Builder input parameter `ReferenceText`,
   `testplangen/CHANGES.md` v2.0) is still pending, so even
   well-linked cross-surface plans and design docs never reach the
   model as text.
3. **The live prompt predates every coverage rule** — the v1.2
   ENUMERATION COVERAGE rule, the v1.2 conditional sections, the
   v1.3 reference-grounding rules, and everything after are all
   "paste pending" (`STATUS.md`, `prompts/README.md`); the live
   paste still carries the v1.0 "prefer fewer, well-grounded cases"
   bias with no counterweight.

## 0 — Determine the deployed state first

The deploy-record tables have no dated tenant rows after prompt v1.0,
so verify rather than assume:

- Open the `LRS Test Plan Generation` AI Builder prompt and COUNT its
  input parameters. Four (`StoryMeta`, `StoryText`, `RelatedDigest`,
  `ExemplarText`) = pre-v1.3 contract → step 3 is required. Five =
  the v2.0 window already happened; step 3 reduces to its paste.
- Open both live generation flows (standalone TestPlanGen + the agent
  child TestPlanGenCore) and read
  `Config_gen.TestPlanGenPromptVersion` — that stamp is what the
  drafts' banners have been recording.
- Read the last few runs' `Gen_summary` in run history
  (`neighbors= exemplars= references= digestChars= storyChars=
  draftChars=`). This one line distinguishes the failure modes:
  `neighbors=0` on stories that plainly have peers → retrieval is
  starved (step 1); healthy neighbors but thin drafts → prompt bias
  (steps 3–4).

Check: you can state, with evidence, the live prompt's parameter
count, both flows' version stamps, and whether recent runs retrieved
neighbors. Record all three in `testplangen/CHANGES.md` when done.

## 1 — Revive retrieval: the sweep fixes

Apply `review/patches/designer-edits.md` §v2_7-fixes on the live
DocIndexSweep flow — all six, but the two this runbook is blocked on
are **FX-3** (sharersJson re-bind: keyword `related:` edges) and
**FX-5** (clear `Config.SmokeFile`: unstall the nightly backfill).
Equivalent route: import `flow/DocIndexSweep_v2_7_fix.zip` (the live
export with exactly those corrections — `flow/v2_7_fix/CHANGES.md`).

`related:` lists repopulate GRADUALLY: each doc's list converges as
the nightly sweep re-indexes it and reciprocal merges land. Give the
corpus a few nights before judging step 5's numbers.

Check: after 1–2 nightly runs, open the sidecars for doc 42 and
doc 1 — their fenced metadata carries a non-empty `related: [...]`
line that includes keyword-scored entries (the `why` prose mentions
shared keywords, not only issue-id links).

## 2 — (with step 1, if applicable) sweep-side hygiene

Nothing else in §v2_7-fixes blocks TestPlanGen, but FX-6 (raw-REST
creates posting to pre-rebuild list GUIDs) errors every keyworded
doc's index attempt on some tenants — if step 0's evidence shows
Error rows piling up, it is part of the same window. See STATUS.md
open action 1 for the full list; this runbook only insists on FX-3
and FX-5.

Check: a nightly run completes with new/updated sidecars and no
Error rows attributable to `Create_dockw`/`Create_idrow`.

## 3 — The v2.0 contract window: create the reference lane

Per `testplangen/CHANGES.md` v2.0 deploy delta, in one window:

1. Add the fifth input parameter **`ReferenceText`** to the
   `LRS Test Plan Generation` AI Builder prompt.
2. Apply the §3 reference-lane additions (`TestPlanGen_Setup.md`
   G0/G0b/G5b/G7b/G8/G13) in BOTH live flows — or re-import the
   re-cut packages `TestPlanGen_v1_0.zip` / `TestPlanGenCore_v1_0.zip`
   (post-import checks I1–I4; imports also bring the v2.10
   current-list bindings) — plus the v1.8 marker edits if step 0
   found the tenant still on v1.0 `<<<...>>>` output sentinels.

Skip what step 0 proved already present. NEVER bump
`Config.PromptVersion` — nothing here touches the sidecar format.

Check: the AI Builder prompt shows five parameters; both flows save
without expression errors; a test run's `Run_testplangen_prompt`
shows all five keys bound.

## 4 — Paste the current prompt + stamp

Paste whatever `prompts/TestPlanGen_Prompt.md` currently holds (the
repo's authored head — v1.5 at this writing; the paste supersedes
every pending one before it) into the AI Builder prompt, then apply
`review/patches/designer-edits.md` §testplangen-v2_8 (T1 banner
WARNING line, T2 version stamp — set the stamp to the version you
just pasted) to BOTH live flows. If the Tier-2 flow upgrades have
been authored (§testplangen-v2_12, `testplangen/CHANGES.md` v2.12),
they ride this same window cheaply.

Check: the §2 pane check in `TestPlanGen_Setup.md` passes — and with
prompt v1.5+, the reply also carries a `## Coverage Map` section
whose every requirement row cites a case or an Open Questions entry.

## 5 — Verify with telemetry and a before/after draft

- Run on **doc 42** (smoke row 1) and **doc 1** (smoke row 9):
  `Gen_summary` shows `neighbors≥1` on both once step 1's backfill
  has converged their sidecars; with the three Pro Add-Event offset
  plans (devtopia 3906/3910/3911) indexed and linked, doc 1 shows
  `references≥1` (smoke row 10).
- Keep the last pre-runbook draft of doc 1 (or generate one BEFORE
  step 4) and diff it against the post-runbook draft, scored against
  the trace matrix in `review/REVIEW_TestPlanGen_doc1_coverage.md`:
  the baseline mapped 9 of 15 requirements; the target is 15 of 15
  (covered or explicitly [VERIFY]-flagged). With prompt v1.5+ the
  draft's own Coverage Map does the bookkeeping.
- Record the runs (date, tenant, rows passed) in
  `testplangen/CHANGES.md` and update `STATUS.md`'s TestPlanGen row
  and `prompts/README.md`'s deployed-version cell.

Failure triage is unchanged: `TestPlanGen_Smoke.md` bottom section.
The one addition — `neighbors=0` AFTER step 1 converged means the
story's sidecar predates the fix; wait for its reindex or touch the
source doc to force one.
