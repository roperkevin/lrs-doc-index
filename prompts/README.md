# prompts/ — the currently deployed AI Builder prompts

One file per prompt, always the version pasted into the live tenant:

| File | Deployed version | Pasted into |
|---|---|---|
| DocIndex_Prompt.md | v1.3 (Config.PromptVersion v1.8) | AI Builder custom prompt (DocIndexSweep) |
| KeywordCuration_Prompt.md | v1.0 | AI Builder custom prompt (KeywordCuration) |
| TestPlanFigures_Prompt.md | v0.1 — **authored only**: the optional second pass that selects the test cases in a finished draft worth a schematic (rule-based: measure geometry, state change, topology, temporality, interaction; six exclusions; cap 6) and emits closed-vocabulary figure SPECS (routes/measures/events/marks, nodes/edges, actors/steps) for a deterministic SlideFigures-palette renderer; not wired into testplangen.mjs yet, no tenant prompt (anthropic lane by design) | — (no AI Builder prompt; queued: `testplangen.mjs --figures`) |
| TestPlanGen_Prompt.md | v1.10 (**paste pending** — supersedes every pending paste before it; a tenant still on the pre-v1.3 four-parameter contract creates `ReferenceText` first; deploy path: `testplangen/Coverage_Runbook.md`) | AI Builder custom prompt (TestPlanGen) |

Convention (r2): a prompt change is authored as a review patch
(`review/patches/<name>_vX_Y.md`), gated/reviewed, pasted into AI
Builder, then copied here — this folder never holds an unpasted
version. Superseded versions live in `review/patches/` and git
history. See `STATUS.md` for the full deployed-version table.
