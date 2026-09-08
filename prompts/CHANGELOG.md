# prompts — change log

One line per version bump, newest first. Versions before the
front-matter format (2026-09-06) are the ones the old file headers
carried; their per-round notes are in `docs/history/patches-README.md`,
`docs/changelog/testplangen.md` and `docs/changelog/pipeline.md`.

- 2026-09-08 — keyword_curation **2.2.1**: `max_tokens` 16384 → 32000.
  A 700-line vocabulary chunk asking for up to 100 proposals with a
  reason each can run past 16k output tokens, and a truncated
  schema-pinned reply is a failed call, not a shorter list. Ported
  from the sweep machine's own hotfix (branch `machine-fixes`, made
  on 2.1.0), which is why the machine stopped fast-forwarding from
  `deploy`. Text unchanged.
- 2026-09-08 — docindex_classify **4.0.0**: the classification
  reads the pipeline's own evidence and says more. Two new inputs —
  `Folder` (the source-library folder the file sits in) and `Signals`
  (the block `pipeline/lib/docsignals.mjs` assembles: the folder's
  kind, the products and known tools the text names literally, the
  scored surface evidence) — and two new outputs, `surfaces` (every
  surface the document covers, primary first) and `products` (from
  the closed four-name list, Address Data Management new). `surface`
  gains **REST** (the Linear Referencing Service API) beside Pro /
  Experience Builder / Server / Enterprise, with rules that say what
  each means and which is dominant; `docKind`'s Doc Review rule names
  the signs (help-topic titles with comments, Topic / Comment / Status
  columns, "doc review" in the name) and makes the team's Doc Reviews
  folder the default; `tools` rises to 0–10, must include every known
  tool the signals list, and reads the KnownTools block grouped by
  kind with the surface each implies. Schema: eleven required fields.
  The stamp becomes `v4.0.0`; the sweep reconciles the reply with the
  signals after the call (docs/setup.md §18).
- 2026-09-08 — keyword_curation **2.2.0**: at most 100 proposals per
  call (was 50) — the second reader checks every one and `--drain`
  passes see whatever was left out, so a smaller cap only added
  passes.
- 2026-09-08 — keyword_review **1.0.0** (new): the second reader of
  keyword merge proposals. Input: the pending queue as
  `<id> | <alias> [kind] -> <canonical> [kind] | <reason>` lines plus
  the official vocabulary; output one verdict per id —
  approve / withdraw / hold — under the same WORD TEST as
  keyword_curation, with the official title always the canonical.
  `curate.mjs --review`, or every weekly run when
  `curation.review.enabled`; the deterministic guard runs first and
  the approvals apply like `--approve`.
- 2026-09-06 — testplan_draft **1.14.0**: one case block, shared with
  the document catalog (`docs/design/Markdown_Layout_Plan.md` phase
  3). Case ids are two digits per lane (`TC-P01`, not `TC-P1`); the
  heading ends with its own anchor (`{ #tc-p01 }`) so a link to a case
  survives a retitle; and the four field lines are bold-labelled
  BULLETS in a fixed order — `- **Steps:**` with the checkbox list
  nested one level under it, then `- **Expected Result:**`,
  `- **Trace:**`, `- **Figure:**`. Same content, same rules, same
  sections: this is the shape casegrammar writes for every indexed
  plan, so a drafted case and an indexed one read and index
  identically. Gated by `tests/check_draft_coverage.py` assert 9 and
  its `pipeline/lib/draftlint.mjs` port (contract v1.8); `--baseline`
  skips it for a draft written before the bump.
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
