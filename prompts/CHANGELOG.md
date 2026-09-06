# prompts — change log

One line per version bump, newest first. Versions before the
front-matter format (2026-09-06) are the ones the old file headers
carried; their per-round notes are in `docs/history/patches-README.md`,
`docs/changelog/testplangen.md` and `docs/changelog/pipeline.md`.

- 2026-09-06 — docindex_classify **3.0.0**: the classifier runs on
  Claude Opus 5 through the Anthropic API with schema-pinned JSON
  output (`schemas/docindex_classify.json`); the AI Builder model that
  produced the v2.0.x corpus is retired. Text unchanged from 1.3.0.
  The Doc Index stamp follows the file (`v3.0.0`), so the nightly run
  re-indexes the corpus maxDocsPerRun at a time once the deployed
  config stops pinning `sweep.promptVersion` (docs/setup.md §7).
- 2026-09-06 — every prompt moved to the front-matter format: the
  instruction block is `## System`, the inputs are `## User`; the only
  wording changes say where the inputs arrive ("the user message"
  instead of "the end of this prompt"). Versions carried over:
  docindex_classify 1.3.0, keyword_curation 1.1.0, testplan_draft
  1.13.0, testplan_figures 0.4.0, testplan_deck 0.1.0, case_normalize
  1.0.0. JSON schemas for the two structured-output prompts added
  under `schemas/`.
