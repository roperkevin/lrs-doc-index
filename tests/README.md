# tests/ — the gates

Every suite here runs in CI (`.github/workflows/harness.yml`) on every
push and pull request; `main` is promoted to the `deploy` branch (the
one the sweep machine self-updates from) only when all three jobs are
green. The repo's rule since the first review: **no behaviour change
without an assertion that fails on the previous version.**

Run from this directory (the extractor suites resolve `../extract`
relative to the working directory; the others locate the repo from
their own path):

```
cd tests
pip install -r requirements.txt anthropic   # PyYAML, python-pptx, python-docx + the SDK
python3 check_local_sweep.py                # any single gate
```

| Suite | CI job | What it gates | Needs |
|---|---|---|---|
| `test_lrsdoc.py` | fixture-free | `lrsdoc/`: the prompt loader (every file in `prompts/` loads, renders, and its schema resolves), the request shape, calls against an SDK-faithful mock (streaming, truncation, refusal, contract errors, retries, dumps), the CLI | anthropic |
| `check_local_sweep.py` | fixture-free | `pipeline/sweep.mjs` end to end against a mock Graph / SharePoint REST / Anthropic Messages / sign-in stack: every extraction lane, the list writes, sidecars, relatedness, case and figure sync, ghost reconciliation, every standalone mode, `curate.mjs`, `gantt.mjs`, alerts, remote-files mode | Node 22+ |
| `check_testplangen.py` | fixture-free | `pipeline/testplangen.mjs`: story guard, lanes, caps, fail-closed slice, verifier (and its agreement with `check_draft_coverage.py`), lookup, auto mode, addenda, figures and deck passes, streaming | Node 22+ |
| `check_caseindex.py` | fixture-free | `pipeline/lib/caseindex.mjs` + `casegrammar.mjs`: the six case detectors, per-case metadata, the replace-set planner | Node |
| `check_figureindex.py` | fixture-free | `pipeline/lib/figureindex.mjs`: figure naming rule, parser, rows and planner | Node |
| `check_slug.py` | fixture-free | `pipeline/lib/slug.mjs`: sidecar stem rules | Node |
| `check_storyprofile.py` | fixture-free | `pipeline/lib/storyprofile.mjs`: the User Story body profile | Node |
| `check_deckspec.py` | fixture-free | `pipeline/lib/designsystem.mjs` + `deckspec.mjs`: tokens, grid, grounding, layout | Node |
| `check_pad_runner.py` | fixture-free | `extract/runner/run_job.mjs` + `ops.mjs`: every extractor op through the loader, parity with `wrap.py` | Node |
| `check_related.py` | fixture-free | `extract/RelatedRank.ts` + `SidecarPatch.ts` | Node, PyYAML |
| `check_regex.py` | fixture-free | `extract/RegexExtract.ts`: ids, precedence, revision, slug, products | Node |
| `check_shapes.py` | fixture-free | `extract/ShapeExtract.ts` on a hand-written OOXML deck | Node |
| `make_fixtures.py` → `check_format.py` → `render_sample.py` | full-format | `extract/ZipTextExtract.ts`, `WorkbookDump.ts`, `MediaExtract.ts` format contract on generated pptx/docx fixtures; a rendered sample sidecar | python-pptx, python-docx |
| `check_svg2pptx.py`, `check_draft2docx.py`, `check_draft2pptx.py`, `check_deck2pptx.py` | full-format | the four renderers under `pipeline/render/`, read back with python-pptx / python-docx | python-pptx, python-docx |
| `check_typecheck.py` | typecheck | every `extract/*.ts` type-checks at ES2017 (`npx typescript`) | npm registry |
| `check_draft_coverage.py` | manual | the TestPlanGen draft contract lint over a downloaded draft `.md` — the authority `pipeline/lib/draftlint.mjs` mirrors | — |
| `check_design_tokens.py` | manual | every design-token value in `designsystem.mjs` against the published npm packages (`--all` includes USWDS) | npm registry |

Helpers: `mock_anthropic.py` builds SDK-faithful Messages API replies
(a complete non-streaming message, a complete SSE stream) and reads a
request's prompt text, so every gate that mocks `/v1/messages` shares
one shape; `wrap.py` / `wrap_workbook.py` wrap an extractor into a
runnable Node module (the loader in `extract/runner/ops.mjs` does the
same in-process); `HARNESS_SCRIPTS=<dir>` points the extractor suites
at another copy of the extractors. `MANUAL_SMOKE.md` is the checklist
for a real tenant after a prompt change.

Generated artifacts (fixtures, wrapped runners, payloads) are listed
in `.gitignore` here and never committed. The retired paste-round
gates and their run records are described in
`docs/history/harness-README.md`.
