# prompts/ — the model prompts, one versioned file each

Every model call in the pipeline runs one of these files. A file is
the whole prompt: a front-matter block (its name, semantic version,
default model, effort, max tokens, output contract and input names),
a `## System` section (the instruction block — the stable, cacheable
prefix) and a `## User` section (the input frame whose `{Placeholder}`
slots are filled per call). Both the Node loader
(`pipeline/llm.mjs` `loadPrompt`) and the Python layer (`lrsdoc.prompts`)
read exactly this format.

| File | Version | Called by | Output |
|---|---|---|---|
| `docindex_classify.md` | 3.1.0 | the nightly sweep, once per changed document | JSON, `schemas/docindex_classify.json` (nine fields) |
| `keyword_curation.md` | 2.2.0 | `curate.mjs`, once per vocabulary chunk, weekly | JSON, `schemas/keyword_curation.json` |
| `keyword_review.md` | 1.0.0 | `curate.mjs --review` / `curation.review.enabled`, once per chunk of pending proposals | JSON, `schemas/keyword_review.json` |
| `testplan_draft.md` | 1.13.0 | `testplangen.mjs` — the one draft call | markdown between `[[[DRAFT BEGIN]]]` / `[[[DRAFT END]]]` |
| `testplan_figures.md` | 0.4.0 | `testplangen.mjs --figures` | JSON between `[[[FIGURES BEGIN]]]` / `[[[FIGURES END]]]`, verified by `pipeline/lib/figurespec.mjs` |
| `testplan_deck.md` | 0.1.0 | `testplangen.mjs --deck`, `deck2pptx.mjs --generate` | JSON between `[[[DECK BEGIN]]]` / `[[[DECK END]]]`, verified by `pipeline/lib/deckspec.mjs` |
| `case_normalize.md` | 1.0.0 | `sweep.mjs --normalize-cases` (opt-in) | markdown, verified by `pipeline/lib/casenormalize.mjs` |

## Changing a prompt

1. Edit the file. Bump `version` in the same commit: patch for a
   wording fix that cannot change outputs, minor for a rule change,
   major when the output contract (fields, sentinels, sections) or
   the input names change and a consumer must follow.
2. Add a line to `CHANGELOG.md`.
3. Say what it implies operationally in the commit message:
   - `docindex_classify` — a change that alters classifications is a
     corpus backfill: the Doc Index row stamp is `v<version>` of this
     file (sweep.mjs reads the front matter), so the bump itself
     starts the reindex, ~150 documents a night. `sweep.promptVersion`
     in the machine config only PINS an older stamp.
   - `testplan_draft` — bump `testplangen.promptVersion` (the draft
     banner stamp) when the draft contract changes; the verifier in
     `pipeline/lib/draftlint.mjs` and `tests/check_draft_coverage.py`
     must agree with the new contract.
   - the others carry their version in the Node constants that stamp
     outputs (`FIG_PROMPT_VERSION`, `DECK_PROMPT_VERSION`,
     `NORMALIZE_PROMPT_VERSION`) — keep those in step.
4. Run the gates (`tests/`). Superseded text lives in git history;
   there is no copy to keep.

The tenant paste lifecycle that used to surround these files
(review patches, AI Builder pastes, "promotion") is gone with the
AI Builder lane; see `docs/history.md`.
