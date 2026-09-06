# LRS Doc Index

A document catalog for the Esri Linear Referencing (LRS) team. Every
document in the team's SharePoint library gets a markdown **sidecar**
(the extracted text, a classification, keywords, related documents,
its test cases and figures) and a row in a set of SharePoint lists,
so people and agents can browse, search and reuse the corpus. The
same catalog feeds two more jobs: weekly **keyword curation** and
on-demand **test-plan drafting** from a user story.

Everything runs as plain Node.js and Python jobs on one machine (or a
hosted runner), against Microsoft Graph and SharePoint REST, with
every model call going to the Anthropic API. The Power Automate flows,
Office Scripts, AI Builder prompts and Copilot Studio agents this
project started as are retired; `docs/history.md` is the paper trail.

## Architecture

```
 SharePoint (esriis.sharepoint.com/sites/lrsworkspace)
 ├─ source library  LocationReferencing/Shared Documents   (read: Graph, or OneDrive sync)
 ├─ sidecar library LRS Doc Index  + media/                (write: local sync or Graph)
 └─ lists  Doc Index · Keywords · Doc Keywords · Doc IDs · Doc Links
           · Issue Refs · Test Cases · Figures               (write: Graph + SPO REST)
                 ▲
                 │  pipeline/graph.mjs (GraphClient, SpoClient), pipeline/auth.mjs
                 │
 ┌───────────────┴───────────────────────────────────────────────────────┐
 │ pipeline/  (Node 22.6+, zero npm dependencies)                        │
 │   sweep.mjs  nightly index      curate.mjs  weekly keyword merges     │
 │   testplangen.mjs  drafts       gantt.mjs   schedules → Issue Refs   │
 │   wiki.mjs  sidecars → MkDocs site → a private devtopia repo (Pages) │
 │      │ extract/*.ts through extract/runner/ops.mjs (text, media,     │
 │      │ ids, relatedness, sidecar patching)                            │
 │      │ pipeline/lib/*.mjs (cases, figures, links, index pages, ...)   │
 │      └ pipeline/llm.mjs ──spawn──▶ python -m lrsdoc <task>            │
 └───────────────────────────────────────────────────────────────────────┘
                                          │
 ┌────────────────────────────────────────┴──────────────────────────────┐
 │ lrsdoc/  (Python 3.10+, the official anthropic SDK)                   │
 │   prompts/*.md  versioned prompt files (System + User, front matter)  │
 │   prompts/schemas/*.json  schema-pinned JSON output                   │
 │   tasks: classify · curate · generate  ──▶  Anthropic Messages API    │
 └───────────────────────────────────────────────────────────────────────┘
```

Node owns orchestration, SharePoint and the deterministic text work;
Python owns every model call. The boundary is one subprocess per call
with a JSON-lines protocol (`pipeline/llm.mjs`, `lrsdoc/cli.py`).

## Repository layout

| Path | What it is |
|---|---|
| `pipeline/` | The jobs (`sweep`, `curate`, `testplangen`, `gantt`, `wiki`), the Graph/SPO client, delegated auth, the model bridge, and helper tools (`probe.mjs` list write probes, `doc_crawl.mjs` Esri help-page inventory) |
| `pipeline/lib/` | Pure modules the jobs share: case grammar and indexing, figure indexing and specs, doc links, BM25 body index, browse pages, status page, alerts, remote-files mirror, deck layout, design systems, draft lint, the markdown layout kernel (`mdlayout.mjs`), run narration (`progress.mjs`) |
| `pipeline/render/` | Draft and figure renderers: `draft2docx`, `draft2pptx`, `deck2pptx`, `svg2pptx` |
| `pipeline/data/` | Data files the jobs read (`esri_doc_links.json`, `slug_abbreviations.json`) |
| `extract/` | The seven extractors (`ZipTextExtract`, `WorkbookDump`, `MediaExtract`, `ShapeExtract`, `RegexExtract`, `RelatedRank`, `SidecarPatch`), still in their Office-Script shape, run in-process by `extract/runner/` |
| `lrsdoc/` | The Python model layer: prompt loader, SDK client, the three tasks, the CLI |
| `prompts/` | The six prompt files, their JSON schemas, `README.md` (how to change one) and `CHANGELOG.md` |
| `schemas/` | The SharePoint list definitions (`SPList_*.csv`) |
| `ops/` | Task Scheduler entry points (`run_sweep.cmd`, `run_curate.cmd`, `run_testplangen.cmd`, `run_wiki.cmd`, `run_heartbeat.cmd`) and the task XML |
| `tests/` | The gates (see below) |
| `docs/` | `setup.md` (install and operate), `hosted-runner.md`, `sharepoint-notes.md` (tenant quirks and GUIDs), `qa-agent-instructions.md` (the sidecar format as an agent reads it), `design/` (design records in force), `changelog/` (per-component release notes), `history.md` + `history/` (everything retired) |
| `config.sample.json` | Every config key, documented in `$comment` fields; copy to `config.json` at the repo root |

## The jobs

**`sweep.mjs` — the nightly index.** Lists the source library, picks
the documents whose `SourceModified` or `PromptVersion` stamp is
stale (at most `maxDocsPerRun`, default 150), and for each one:
extracts text (pptx/docx/xlsx through the extractors, PDF through
`pdftotext` and optionally OCR, `.msg` natively, html/txt/md), pulls
issue and story ids, classifies it with the `docindex_classify`
prompt, writes the sidecar and its media, upserts the Doc Index /
Keywords / Doc Keywords / Doc IDs rows, ranks related documents
(keywords, id edges, body similarity) and patches both sides'
sidecars, indexes test cases and figures into their lists, and
reconciles ghosts (rows whose source is gone). It also writes the
`_Index.md` browse pages, a status page, a per-run JSON log and a
gzip list backup. Standalone modes re-run one layer over the corpus
without model spend: `--rerank`, `--reformat`, `--recase`,
`--refigure`, `--rename`, `--case-audit`; `--normalize-cases` is the
opt-in model lane for caseless test plans. `--dry-run` records every
write into a plan instead of performing it.

**`curate.mjs` — weekly keyword curation.** Sends the keyword
vocabulary to the `keyword_curation` prompt in alphabetical chunks,
guards every proposal against the real rows, then either proposes
merges for a human (CurationStatus / ProposedCanonical + a digest) or,
with `curation.autoApprove`, applies them and writes the digest as an
audit log. `--repoint` backfills junction rows after approved merges.

**`testplangen.mjs` — test-plan drafting.** For one user story
(`--story <docId>`, `--issue <n>`, `--title "<words>"`) or, with
`--auto`, for every freshly indexed story without a draft: assembles
six retrieval lanes (story text, related digest, exemplar plans,
reference material, related cases, pins), runs the `testplan_draft`
prompt, verifies the draft (contract lint + grounding; `--verify
strict|annotate|off`) and uploads it to the Test Plan Drafts folder.
Optional passes add generated SVG figures (`--figures`,
`testplan_figures`) and a designed review deck (`--deck`,
`testplan_deck` + `render/deck2pptx.mjs`). `--preview` runs everything
up to the model call and writes the inputs for inspection;
`--stream` echoes the model's reasoning summary and reply as they
arrive; `--gap-report` lists stories with no plan.

**`gantt.mjs` — schedules.** Reads every indexed Gantt workbook and
fills the Issue Refs list plus `gantt` / `titlematch` edges in Doc
Links, which RelatedRank already weights.

**`wiki.mjs` — the catalog as a wiki.** Renders every sidecar into an
MkDocs site (one page per document, catalogs by kind, keyword,
product, release, person and issue, the test cases and figures with
anchors, a Recent page) and pushes the tree to a private devtopia
repository whose Pages workflow serves it. Files in, files out: it
reads the sidecar library and the sweep's list backup, never
SharePoint or a model. The page is a *render* of the sidecar, not a
copy: `pipeline/lib/mdlayout.mjs` translates the corpus' GitHub-flavored
markdown into what MkDocs reads (GFM alerts become admonitions,
`<placeholder>` and trailing `{brace}` runs out of a source document are
escaped rather than swallowed, code spans and `<br>` are left alone).
`--build` runs `mkdocs build --strict` locally; `--push` commits and
pushes.

All five take `--config <config.json>` and `--live | --dry-run`; the
`ops/*.cmd` wrappers run them from the repo root, self-updating from
the CI-promoted `deploy` branch first.

**Watching a run.** Every job narrates itself on **stderr** through
`pipeline/lib/progress.mjs` — one `progress: ...` line per phase, per
document and per model call: the sign-in, each list snapshot and its
size, why a document was selected, every step inside it, how long the
model took (and, from the Python layer, the latency to its first
streamed chunk), the ghost pass, the pages written, and a closing
summary with elapsed time. A wait with nothing to report beats every
30 seconds, so a hang never looks like work. It is on at a console and
off when output is redirected — `--progress` / `--no-progress` on any
job, or `"progress": true` in the config, override that, so a
scheduled night can be made to explain itself. **stdout is untouched:**
the summary JSON and `*_summary` lines are unchanged.

## The model layer

Every model call is `python -m lrsdoc <classify|curate|generate>`,
which loads a prompt file, renders its inputs, sends the request
through the official Anthropic SDK and prints a JSON-lines result
(streamed deltas first when asked). What that buys:

- **Prompts are files with a version.** `prompts/<name>.md` carries
  front matter (`version`, `model`, `effort`, `max_tokens`, `output`,
  `inputs`), a `## System` block (cached as the stable prefix) and a
  `## User` template. `prompts/README.md` says how to change one.
- **Structured output is schema-pinned.** The classify and curation
  prompts declare a JSON schema (`prompts/schemas/`); the reply is
  parsed, not brace-sliced. The markdown prompts keep their sentinels
  as a fail-closed check on the Node side.
- **Versions drive the backfill.** The Doc Index row stamp
  `PromptVersion` is `v<version>` of `docindex_classify.md`; bumping
  the file re-indexes the corpus `maxDocsPerRun` a night.
  `sweep.promptVersion` in config only pins an older stamp.
- **One model, per-task effort.** Everything runs on `claude-opus-5`
  (effort `medium` for classify, `high` for drafting) with the SDK's
  retries and timeouts; `llm.model` / `llm.effort` override per
  machine. `LRSDOC_DUMP_DIR` dumps every rendered request for
  debugging.

Credentials: `llm.apiKey` in config (ideally `{"$env":
"ANTHROPIC_API_KEY"}`), or whatever the SDK finds in the environment
(`ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`).

## Running it

Prerequisites: Node 22.6+ (`--experimental-strip-types` runs the
extractors as written), Python 3.10+ with `pip install anthropic`,
optionally Poppler's `pdftotext` (PDF lane) and Tesseract (OCR lane).
No npm install.

```
cp config.sample.json config.json          # fill in the tenant, lists, paths, key
node --experimental-strip-types pipeline/sweep.mjs --config config.json --dry-run
node --experimental-strip-types pipeline/sweep.mjs --config config.json --live --only "Some deck.pptx"
node --experimental-strip-types pipeline/curate.mjs --config config.json --dry-run
node --experimental-strip-types pipeline/testplangen.mjs --config config.json --story 42 --preview
node --experimental-strip-types pipeline/gantt.mjs --config config.json --dry-run
node --experimental-strip-types pipeline/wiki.mjs --config config.json --build     # the wiki tree, built locally
python -m lrsdoc prompts                   # the prompt files and their versions
```

Sign-in is delegated by default (device code, or `"auth":
"interactive"` where Conditional Access blocks device code) with
refresh tokens cached under `work/auth/`; an Entra app registration
(`"auth": "app"`) is the alternative for unattended machines.
`docs/setup.md` walks through the first run, the shadow-mode
checklist, operations and every job in depth; `docs/hosted-runner.md`
covers running with no OneDrive on a hosted runner.

Scheduling: register `ops/sweep_task.xml` (daily),
`ops/wiki_task.xml` (daily, after the sweep) and
`ops/curation_task.xml` (Saturday) in Task Scheduler, plus
`ops/run_testplangen.cmd` and `ops/run_heartbeat.cmd` as needed; the
`.cmd` files append to `work/*.log`.

## The gates

`tests/` holds one Python harness per component; CI
(`.github/workflows/harness.yml`) runs all of them on every push and
promotes `main` to `deploy` only when everything is green. The rule
since the first review: **no behaviour change without an assertion
that fails on the previous version.**

```
cd tests
pip install -r requirements.txt              # PyYAML, python-pptx, python-docx, anthropic
python3 check_local_sweep.py                 # the sweep, curate, gantt end to end against mocks
python3 check_testplangen.py                 # testplangen end to end
python3 test_lrsdoc.py                       # the Python model layer against an SDK-faithful mock
```

`tests/README.md` lists every suite and what it gates;
`tests/MANUAL_SMOKE.md` is the checklist for a real tenant after a
prompt change.

## Documentation map

- `docs/setup.md` — install, sign-in, first run, operations, each job (§15: the wiki)
- `docs/sharepoint-notes.md` — the lists, their GUIDs, and the tenant behaviours the pipeline works around
- `docs/qa-agent-instructions.md` — the sidecar format as a Q&A agent reads it (the best description of a sidecar)
- `docs/design/` — Sidecar format 3.0, case indexing, figure indexing, test-plan generation, the markdown layout strategy
- `docs/changelog/` — `pipeline.md`, `testplangen.md`, `curation.md`; `prompts/CHANGELOG.md` for the prompts
- `STATUS.md` — what is deployed on the machine, and the open actions
- `docs/history.md` — the eras this project went through, why things are the way they are, and where every retired artifact went
