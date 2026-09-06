# prompts/ — the currently deployed AI Builder prompts

One file per prompt, always the version pasted into the live tenant:

| File | Deployed version | Pasted into |
|---|---|---|
| DocIndex_Prompt.md | v1.3 (Config.PromptVersion v1.8) | AI Builder custom prompt (DocIndexSweep) |
| KeywordCuration_Prompt.md | v1.0 | AI Builder custom prompt (KeywordCuration) |
| TestPlanDeck_Prompt.md | v0.1 — wired as `testplangen.mjs --deck` (v2.36) and `deck2pptx.mjs --generate`, anthropic lane verbatim; **no tenant paste** (an AI Builder prompt with inputs PlanTitle + Draft + Figures would need creating for the aibuilder lane, GUID in `llm.deckModelId`): the optional pass that makes a finished draft's review-deck LAYOUT decisions — which of the thirteen design-system patterns each slide takes, what goes in which region, how cases group, the presenter notes — as a closed-vocabulary deck SPEC whose body content is copied verbatim from the draft or pulled through `from` references; grounded, laid out on `local/lib/designsystem.mjs` (Fluent 2 tokens, MIT, by default; IBM Carbon or USWDS by configuration, each light or dark — the spec is design-independent) and rendered to native editable PowerPoint objects by `local/lib/deckspec.mjs` + `local/deck2pptx.mjs` | — (no AI Builder prompt yet) |
| TestPlanFigures_Prompt.md | v0.1 — wired as `testplangen.mjs --figures` (v2.32), anthropic lane verbatim; **no tenant paste** (an AI Builder prompt with inputs PlanTitle + Draft would need creating for the aibuilder lane, GUID in `llm.figuresModelId`): the optional second pass that selects the test cases in a finished draft worth a schematic (rule-based: measure geometry, state change, topology, temporality, interaction; six exclusions; cap 6) and emits closed-vocabulary figure SPECS (routes/measures/events/marks, nodes/edges, actors/steps) for a deterministic SlideFigures-palette renderer; grounded + rendered by `local/lib/figurespec.mjs` | — (no AI Builder prompt yet) |
| TestPlanGen_Prompt.md | v1.12 (**paste pending** — v1.12 sends preserved-value behaviors to the Positive lane, one sentence, contract unchanged; a SIX-parameter contract now: create `RelatedCases` (v1.11) and `ReferenceText` (v1.3) on the tenant prompt before pasting; the local anthropic lane runs this file verbatim with nothing to create; — supersedes every pending paste before it; a tenant still on the pre-v1.3 four-parameter contract creates `ReferenceText` first; deploy path: `testplangen/Coverage_Runbook.md`) | AI Builder custom prompt (TestPlanGen) |

Convention (r2): a prompt change is authored as a review patch
(`review/patches/<name>_vX_Y.md`), gated/reviewed, pasted into AI
Builder, then copied here — this folder never holds an unpasted
version. Superseded versions live in `review/patches/` and git
history. See `STATUS.md` for the full deployed-version table.
