# PLAN — review, clean and reorganize lrs-doc-index

Status: **awaiting approval** (Phase 2 deliverable, 2026-09-06). Nothing
in this document has been applied. Phase 3 starts only after the
decisions in §1 are made.

Inventory basis: every tracked file (7,537), all 41k lines of code
read, every CI gate executed in this container (all green: fixture-free
job 320+241+102+61+99+28 assertions, full-format job, typecheck), plus
three independent code reviews of the active modules whose findings
were verified against source before being listed here.

---

## 0. The one-paragraph picture

The Power Automate era ended on 2026-08-14. What runs today is a
**Node.js pipeline** under `local/` (sweep, test-plan generation,
curation, gantt, deck/docx renderers; 21k lines of `.mjs`) that executes
the seven former Office Scripts under `scripts/` **in-process** (4.9k
lines of `.ts`, loaded via `pad/runner/ops.mjs`), talks to SharePoint
through Microsoft Graph, and runs its LLM steps through either the
tenant's AI Builder prompt (default) or a hand-rolled Anthropic
Messages client. A Python harness of ~12k lines gates all of it in CI.
Everything else in the tree — flow definitions, import zips, paste
artifacts, PAD desktop flow, Copilot Studio agents, tenant runbooks —
is provenance for a system that no longer runs.

Two facts shape the plan more than anything else:

1. **The active code is Node, not Python.** The request assumes Python
   + the `anthropic` SDK. §5 proposes a Python LLM layer that every
   model call goes through, with the Node pipeline calling it, and
   states the alternative (JS SDK in-process) and its cost.
2. **The Anthropic lane already exists but is the wrong shape.**
   `local/llm.mjs` re-implements SSE parsing, retries and OAuth by
   shelling out to `ant auth print-credentials`. Replacing it with the
   official SDK deletes ~500 lines and three bug classes.

---

## 1. Decisions needed before Phase 3 (UNCLEAR items)

| # | Question | Recommendation |
|---|---|---|
| D1 | **Runtime for LLM calls**: (a) Python package + `anthropic` SDK, Node calls it as a subprocess; (b) `@anthropic-ai/sdk` inside the Node pipeline; (c) port the LLM-bearing jobs to Python wholesale | **(a)** — matches the request, future workflows are Python-first, ~10 calls/night so the process hop costs nothing; (b) is ~40% less work if Python is not a hard requirement; (c) is a 9k-line rewrite (testplangen + verifier + figure/deck spec code) and is not recommended now. Details §5. |
| D2 | **Retire the AI Builder / Dataverse lane entirely?** (`llm.provider: "aibuilder"`, `--models`, `*ModelId` keys, Dataverse token code, mock-Predict harness legs) | **Yes.** It is the last Power Platform dependency and the reason prompts had a "paste" lifecycle. Note: switching the classifier model is a `PromptVersion` bump, so the corpus (~760 docs) re-indexes once; §5.6 estimates the spend. |
| D3 | **SharePoint stays as the store** (lists + sidecar library via Graph)? The request says nothing must stay compatible with "SharePoint tenant constraints"; I read that as the Office-Script/AI-Builder/quota constraints, not the storage. | Assume **SharePoint stays**; the plan removes tenant *workarounds* only where they are dead (AI Builder sanitizer, Run-script quotas, ES2017 typecheck), and keeps the live ones (hyperlink columns via SPO REST, classic lookups, 255-char caps). |
| D4 | **`LRSDocIndex/` snapshot** (6.1 MB, 7,309 files: 766 sidecars, 4,582 SVG, 1,952 raster) committed 09-04/09-05 — a copy of the SharePoint library, read by no code, used once for the sidecar-format review. | **Remove from the branch** (kept in git history), add `corpus/` to `.gitignore` and a one-line doc on how to drop a fresh export there for analysis. It doubles clone size and will drift from the tenant on day one. Alternative: keep it under `corpus/` if you want Claude sessions to see the live corpus without SharePoint access. |
| D5 | **Copilot Studio artifacts**: `agent/` (Q&A agent instructions v1.0–v1.4, setup, smoke) and `testplangen/agent/` (TestPlanGen chat agent). Not Power Automate, but tenant-portal deployables. | Keep **only** `agent/QA_Agent_Instructions_v1_4.md` (moved to `docs/`) if the Teams Q&A agent is still in use — it documents the sidecar layout the corpus consumers rely on. Retire the TestPlanGen agent (its only job was to call the retired flow). Everything else → `docs/history/`. |
| D6 | **Embeddings lane** (`sweep.embedRelated`, opt-in, off): the Anthropic API has no embeddings endpoint; this uses Voyage/OpenAI-compatible. | Keep as-is (dormant) or delete (221 lines + config). Recommend **delete** unless you plan to turn it on. |
| D7 | **Directory renames** (`local/` → `pipeline/`, `scripts/` → `extract/`, harnesses → `tests/`). Renaming `local/` changes the path the deployed machine's scheduled tasks point at (`C:\Repos\lrs-doc-index\local\run_sweep.cmd`, `sweep_task.xml`). | Do the renames (the names are era-specific and misleading now) and re-register the two scheduled tasks once; or keep `local/` and rename everything else. Your call. |
| D8 | **Office Scripts as modules**: convert `scripts/*.ts` from the Office-Script shape (`function main(workbook, …)`, no imports, three copies of the zip/inflate code) to plain ES modules sharing one `zip.ts`, dropping the tmp-file loader and the ES2017 typecheck job. | Recommend **yes, as a later phase** (3c) — it is a real simplification but touches 4.9k gate-covered lines; not needed for the cleanup. Porting the extractors to Python is possible (Python's `zipfile`/`zlib` replace ~700 hand-written lines) but is ~2,000 lines of OOXML→markdown logic to re-verify; not recommended now. |

---

## 2. Inventory and classification

Legend: **ACTIVE** = executed by the deployed pipeline, a CI gate, or a
documented operator command · **LEGACY** = Power Automate / Office
Script paste / Copilot era, executed by nothing · **UNCLEAR** = see §1.

### 2.1 Directory map

| Path | Files | Size | Class | What it is / depends on |
|---|---|---|---|---|
| `local/*.mjs` (14) | 14 | 480 KB | ACTIVE | The pipeline. `sweep.mjs` (2,539 lines, nightly index), `testplangen.mjs` (2,944, draft generation), `curate.mjs` (467, weekly keyword curation), `gantt.mjs` (453, schedule → Issue Refs; never run live), `graph.mjs`/`auth.mjs` (Graph + SPO REST + delegated auth), `llm.mjs` (594, LLM client), `deck2pptx`/`draft2pptx`/`draft2docx`/`svg2pptx` (renderers, 3,100 lines), `doc_crawl.mjs` (Esri docs inventory), `probe.mjs` (diagnostic). Depend on `local/lib/*`, `pad/runner/ops.mjs`, `scripts/*.ts`, `prompts/*`. |
| `local/lib/*.mjs` (23) | 23 | 290 KB | ACTIVE | Shared modules split out of sweep.mjs (v1.31): util, config, doclinks, presentation (`caseHeadings` is dead code), bodyindex, statuspage, indexpages, alerts, msg (CFB parser), embedindex (UNCLEAR D6), remotefs, caseindex, casegrammar, caseaudit, casenormalize, figureindex, sidecarmeta, slug, storyprofile, draftlint, figurespec, deckspec, designsystem. |
| `local/*.md` (7) | 7 | 180 KB | ACTIVE docs | `Local_Setup.md` (1,176 lines — the real operator manual), `Hosted_Runner.md`, `CHANGES.md` (139 KB), three design records (`Case_Index_Plan`, `Figure_Index_Plan`, `Sidecar_Format_Plan`). |
| `local/run_*.cmd`, `*_task.xml`, `config.sample.json`, `esri_doc_links.json`, `slug_abbreviations.json` | 9 | 25 KB | ACTIVE | Windows Task Scheduler wrappers (self-update from `deploy`), machine config template, data files read at run time. |
| `local/harness/*.py` (12) | 12 | 400 KB | ACTIVE | CI gates for every module above (`check_local_sweep` 3,056 lines / 320 assertions, `check_testplangen` 241, …). `check_design_tokens.py` is manual (network). |
| `scripts/*.ts` (7) | 7 | 216 KB | ACTIVE | The extractors, still in Office-Script shape but executed in-process by the sweep: ZipTextExtract (pptx/docx → markdown), MediaExtract, ShapeExtract (slide drawings → SVG), RegexExtract (issue ids, revision, slug, products), WorkbookDump (xlsx → GFM), RelatedRank (scoring), SidecarPatch (related-section patching). |
| `pad/runner/ops.mjs`, `xlsx_grid.mjs` | 2 | 12 KB | ACTIVE | The loader that runs `scripts/*.ts` under Node (appends `export const padMain = main`, imports the tmp `.mts`); xlsx reader for WorkbookDump's mock workbook. Imported by `sweep.mjs`, `gantt.mjs`, `check_shapes.py`. |
| `pad/runner/run_job.mjs`, `pad/samples/job.sample.json`, `pad/harness/check_pad_runner.py` | 3 | 22 KB | ACTIVE (dev tool) | Single-op / batch CLI over the extractors + its gate. Built for the PAD desktop flow but useful standalone ("run ZipTextExtract on this file"). Keep. |
| `pad/flow/DocIndexCompute.robin.txt`, `pad/PAD_Setup.md`, `pad/CHANGES.md`, `.gitattributes` | 4 | 28 KB | LEGACY | Power Automate Desktop flow (Robin) + its build guide. |
| `prompts/*.md` (6) + `README.md` | 7 | 116 KB | ACTIVE | The prompt files: DocIndex v1.3, KeywordCuration v1.1, TestPlanGen v1.13, TestPlanFigures v0.4, TestPlanDeck v0.1, CaseNormalize v1.0. Each carries 50–250 lines of AI-Builder paste instructions above the prompt text; README's version table is stale for two of them. |
| `schemas/SPList_*.csv` (8) | 8 | 17 KB | ACTIVE | The eight SharePoint list definitions the sweep writes. |
| `schemas/Copilot_Schema_Prompt.md` | 1 | 16 KB | LEGACY | Copilot prompt to provision the lists via PnP.PowerShell; superseded by the CSVs. |
| `.github/workflows/harness.yml` | 1 | 3 KB | ACTIVE | CI: fixture-free, full-format, typecheck jobs; promotes `deploy` on green main. |
| `.github/workflows/hosted-sweep.yml` | 1 | 4 KB | ACTIVE (dormant) | Opt-in hosted nightly sweep, gated on a repo variable. |
| `review/harness/` live set: `check_format`, `check_related`, `check_regex`, `check_shapes`, `check_typecheck`, `make_fixtures`, `render_sample`, `wrap`, `wrap_workbook`, `check_draft_coverage`, `requirements.txt`, `.gitignore` | 12 | 150 KB | ACTIVE | Extractor gates (CI) + the Python reference lint that `draftlint.mjs` mirrors. |
| `review/harness/check_batch*.py` (7), `run_diff.py`, `README.md` | 9 | 210 KB | LEGACY | Paste-batch gates; every one self-skips because `scripts/` moved past the version it pins (incl. `check_batch_v2_2`, which README still calls live). Not in CI. Only consumers of `review/patches/`. |
| `review/patches/` (24 files) | 24 | 696 KB | LEGACY | Copies of scripts/prompts at each paste round. One is byte-identical to `scripts/`, two differ only in a header banner, the other 21 are strictly older. `designer-edits.md` (57 KB) is the flow-designer patch log. |
| `review/REVIEW*.md` (5) | 5 | 108 KB | LEGACY record | Three flow-era reviews, the doc-1 coverage review, and the 2026-09-03 codebase review (whose Phase 0–3 items are now mostly built). |
| `flow/` (11 versions) | 33 | 1.9 MB | LEGACY | DocIndexSweep flow definitions v1.9–v2.8, 11 import zips, per-version CHANGES. Semantics fully reimplemented by `sweep.mjs` ("faithful to flow/v2_8/definition.json"). |
| `curation/flow/v1_1/definition.json`, `Curation_Setup.md` | 2 | 48 KB | LEGACY | KeywordCuration flow (never functional on tenant) + build guide. |
| `curation/CHANGES.md` | 1 | 11 KB | ACTIVE record | Mixed flow + `curate.mjs` release notes. |
| `testplangen/flow/*` (4 definitions), 4 zips | 8 | 148 KB | LEGACY | TestPlanGen cloud flows + packages. |
| `testplangen/agent/` (7 files) | 7 | 68 KB | UNCLEAR (D5) | Copilot Studio agent that called the retired flow. |
| `testplangen/TestPlanGen_Setup.md`, `Coverage_Runbook.md`, `TestPlanGen_Smoke.md` | 3 | 58 KB | LEGACY | Flow build guide, paste runbook, tenant smoke suite (a few rows adapt to the local job). |
| `testplangen/Local_TestPlanGen_Plan.md`, `CHANGES.md` (202 KB) | 2 | 218 KB | ACTIVE record | Design record + the component's release notes (v2.16+ are the local job). |
| `agent/` (8 files) | 8 | 72 KB | UNCLEAR (D5) | Q&A Copilot agent: instructions v1.0–v1.4, setup, smoke, CHANGES. |
| `docs/SP_Adaptation_Notes.md` | 1 | 12 KB | ACTIVE docs (partly stale) | Live list GUID table + SharePoint quirks the sweep still obeys; flow-era build mechanics. |
| `README.md` (49 KB), `STATUS.md` (66 KB), `STATUS_history.md` (18 KB) | 3 | 133 KB | rewrite | README describes the flow first and the local sweep as an afterthought; STATUS is a deployed-truth table plus a 480-line narrative head. |
| `LRSDocIndex/` | 7,309 | 6.1 MB | UNCLEAR (D4) | Snapshot of the sidecar library. |

### 2.2 What the active workflows do today

| Job | Entry | What it does | LLM calls |
|---|---|---|---|
| Nightly sweep | `sweep.mjs --live` (Task Scheduler 17:00) | Snapshot 7 lists via Graph; walk the source library; per changed doc: extract (ziptext/media/shapes/workbookdump/pdftotext/OCR/msg/html) → classify → upsert Doc Index / Doc IDs / Keywords / DocKeywords / DocLinks → write sidecar + media → rank related (RelatedRank + BM25) and reciprocally patch neighbours → sync Test Cases + Figures rows → ghost-archive deleted docs → rebuild `_Index.md`, `_Case Catalog.md`, `_Figure Catalog.md`, `_Manifest.json`, `_Sweep Status.md`. Standalone modes: `--rerank --reformat --recase --refigure --rename --case-audit --normalize-cases --check-heartbeat`. | `classifyDoc` per doc (AI Builder default / Anthropic JSON-schema); `--normalize-cases` opt-in |
| Test-plan draft | `testplangen.mjs --story N` (manual; `--auto` nightly gap-drafting, off) | Story guard, six retrieval lanes (neighbours digest, exemplar plans, reference plans/spikes/web pages, related cases, pins), ONE draft call, sentinel slice, two-layer verifier (contract lint + grounding), deterministic addenda (Issue Trace, Existing Cases, Reference Docs), upload to Shared Documents/Test Plan Drafts. Optional passes: `--figures` (spec → SVG), `--deck` (layout spec → pptx). | draft (`generateText`, streamed), figures, deck |
| Keyword curation | `curate.mjs` (Saturdays) | One call per 700-line vocab chunk proposing alias→canonical merges; human approves; `--repoint` fixes junction rows. | AI Builder only — no Anthropic path exists |
| Gantt → Issue Refs | `gantt.mjs` (on demand) | Schedule xlsx → Issue Refs rows + edges. Never run live. | none |
| Converters | `draft2docx`, `draft2pptx`, `svg2pptx`, `deck2pptx --spec` | Reviewed draft → Word / review deck / figure slides; zero-dep OOXML writers. | none (deck `--generate` = one call) |

**Operational state**: the pipeline is DOWN — device-code sign-in blocked by Conditional Access since ~08-30 (STATUS action 12). Nothing in this plan changes auth; the durable fix (Entra app registration, `auth: "app"`) is already designed in `Local_Setup.md` §2 and remains a tenant task.

### 2.3 Where the active code is buggy, fragile, duplicated or undocumented

Bugs are listed and ranked in §4. The structural findings:

**Fragile (load-bearing today)**
- Every LLM call goes through the AI Builder Predict idiom (`responsev2.predictionOutput.text`, brace-slice JSON, a hard-coded Power Automate flow GUID as telemetry in `llm.mjs:483`); prompts are single `user` messages with no system/data boundary; sentinel markers (`[[[DRAFT BEGIN]]]`) exist because AI Builder stripped `<tags>`.
- The Anthropic lane mints OAuth tokens by spawning `ant` through a shell (`llm.mjs:190`), hand-parses SSE (`:376–401`), ignores `retry-after`, retries a bad API key four times, and interprets `timeoutMs` differently per lane.
- Hyperlink columns need a second write through SharePoint REST after every Graph create (`sweep.mjs:532–540`) — the source of the duplicate-row bug (§4 #1).
- Error handling by substring: `Field 'X' is not recognized`, `InputContentFiltered`, `: 404`.
- OneDrive sync is the file transport unless `remoteFiles`; Windows-only wrappers; `draft2docx`'s CLI guard is broken *on* Windows.
- `RelatedRank` uses `Date.now()` when no `today` is passed (the sweep passes none), so related scores drift daily and neighbour sidecars can rewrite every night with no content change.

**Duplicated**
- Zip/inflate/base64/UTF-8 decoding: three code-identical copies (`ZipTextExtract.ts:1250–1484`, `MediaExtract.ts:118–345`, `ShapeExtract.ts:946–1180`); zip *writer* + CRC: three copies (`svg2pptx`, `draft2pptx`, `draft2docx`); pptx package scaffolding twice; markdown block parser twice (`draft2docx`/`draft2pptx`).
- Config loading + Dataverse auth inheritance: four near-identical blocks (`sweep`, `curate`, `gantt`, `testplangen`; `deck2pptx` has a broken fifth).
- Sentinel/fence slicing: five implementations (`testplangen`, `figurespec`, `deckspec`, `casenormalize.unwrapReply`, `llm.braceSlice`).
- `htmlToText` ×2, seam detection ×3 (`bodySeamEnd` vs `lastIndexOf("\n---\n")`), stopword sets ×2, issue-ref regexes ×3, `$env` secret resolvers ×4, token matchers (`gantt` copies `DocPageIndex`), `syncCases` ≈ `syncFigures`, the run-summary/log block ×8 in `sweep.mjs`.
- `draftlint.mjs` is an intentional port of `check_draft_coverage.py` (no divergence found; two sources of truth nonetheless).

**Undocumented**
- ~30 config keys read by the code but absent from `config.sample.json` (e.g. `sweep.rerank/reformat/recase/refigure/rename/normalize` — a config value silently switches the *nightly* task into that mode — `docLinksFile`, `probeDocLinks`, `maxArchivesPerRun`, `relatedBodySimMin`, `oversizeBytes`, `kindFolders`, `siteUrl`, the whole `gantt` section, `graph.timeoutMs/maxRetries`, `spo.clientId`).
- Version drift: `ops.mjs` header v1.0 vs CHANGES v1.1; `indexpages.mjs` v1.3 vs v1.4; `deck2pptx` header v1.1 vs constant v1.2; `prompts/README.md` wrong for KeywordCuration (v1.1) and Figures (v0.4); `review/harness/README.md` lists a self-skipping gate as live and omits six CI gates; `testplangen.mjs` still says "five inputs" in three places (there are six).
- `presentation.caseHeadings` is dead code (only the harness references it); `caseindex.deckCases` still parses the shape it emitted.

### 2.4 Salvage from the legacy set

Nothing in the deletion list contains logic that is not already in the
active tree — the extractors, ranking, patching and prompts the request
names as "proven" live in `scripts/` and `prompts/` and are **kept**,
not deleted. What is worth carrying forward from the retired material:

| Legacy item | Salvage |
|---|---|
| `agent/QA_Agent_Instructions_v1_4.md` | The best description of the sidecar format and citation rules that exists. Becomes the seed of a **Python Q&A/RAG prompt over the sidecar corpus** (Anthropic API, no Copilot) if that workflow is ever wanted — `prompts/qa_agent.md`. |
| `testplangen/TestPlanGen_Smoke.md` rows 1, 9, 10, 11 | Real regression stories for the local generator; fold into `tests/` as documented manual smoke cases for `testplangen.mjs`. |
| `review/patches/designer-edits.md` §F1–F12 rationale | Explains several sweep behaviours (apostrophe escaping, oversize gate, brace-slice). Keep in `docs/history/` for archaeology; no code to port. |
| `flow/v2_8/definition.json` `Config` block | Already mirrored as `FLOW_DEFAULTS` in `sweep.mjs`; no port needed. |
| `schemas/Copilot_Schema_Prompt.md` | Superseded by the CSVs; a PnP provisioning script could be generated from the CSVs directly if a fresh tenant is ever needed. Not ported. |
| `curation/flow` | `curate.mjs` is already the port. |
| The TestPlanGen prompt's square-bracket sentinels | Keep the sentinels in the markdown-output prompts (cheap fail-closed check) but **drop them for the JSON-output prompts** (figures, deck, classify, curation) in favour of `output_config.format` JSON schema — see §5. |

---

## 3. Proposed structure and naming

```
lrs-doc-index/
├── README.md                 current architecture only (rewritten)
├── STATUS.md                 ≤40 lines: what is deployed, open actions
├── pyproject.toml            package `lrsdoc` (anthropic, pyyaml) + test extras (python-pptx, python-docx)
├── config.sample.json        (from local/)
├── .github/workflows/ci.yml  (harness.yml, paths updated) + hosted-sweep.yml
│
├── pipeline/                 (git mv local/)  the Node jobs — unchanged code, import paths only
│   ├── sweep.mjs  testplangen.mjs  curate.mjs  gantt.mjs
│   ├── graph.mjs  auth.mjs  llm.mjs (→ thin bridge to lrsdoc, §5)  probe.mjs  doc_crawl.mjs
│   ├── lib/                  (unchanged)
│   ├── render/               deck2pptx.mjs  draft2pptx.mjs  draft2docx.mjs  svg2pptx.mjs
│   └── data/                 esri_doc_links.json  slug_abbreviations.json
│
├── extract/                  (git mv scripts/ + pad/runner/)  the extractors
│   ├── ZipTextExtract.ts  MediaExtract.ts  ShapeExtract.ts  RegexExtract.ts
│   ├── WorkbookDump.ts  RelatedRank.ts  SidecarPatch.ts
│   └── runner/ ops.mjs  xlsx_grid.mjs  run_job.mjs  job.sample.json
│
├── lrsdoc/                   NEW — Python: every model call (§5)
│   ├── llm.py  prompts.py  cli.py
│   └── tasks/ classify.py  curate.py  draft.py  figures.py  deck.py  normalize.py
│
├── prompts/                  versioned prompt files with front matter (§5.3)
│   ├── docindex_classify.md  keyword_curation.md  testplan_draft.md
│   ├── testplan_figures.md   testplan_deck.md      case_normalize.md
│   ├── schemas/ *.json       JSON schemas for the structured-output prompts
│   └── CHANGELOG.md
│
├── schemas/                  SPList_*.csv (unchanged)
├── ops/                      run_sweep.cmd  run_curate.cmd  run_testplangen.cmd  run_heartbeat.cmd  *_task.xml
├── tests/                    every live gate: local/harness/* + pad/harness/* + review/harness live set
│   ├── fixtures/ (make_fixtures.py, wrap*.py, requirements.txt)
│   └── test_lrsdoc.py        NEW — the Python layer's own tests (mock transport)
└── docs/
    ├── setup.md              (Local_Setup.md)      hosted-runner.md   sharepoint-notes.md (SP_Adaptation_Notes, trimmed)
    ├── design/               Case_Index_Plan  Figure_Index_Plan  Sidecar_Format_Plan  Local_TestPlanGen_Plan
    ├── changelog/            local  testplangen  curation  (verbatim moves)
    ├── history.md            NEW — the narrative: eras, what each retired piece was, where its record lives
    └── history/              verbatim moves: STATUS_history, the five REVIEW*.md, designer-edits.md, flow/*/CHANGES.md,
                              PAD_Setup, Curation_Setup, TestPlanGen_Setup, Coverage_Runbook, Agent_Setup, QA_* (per D5)
```

Naming rules: directories by role (`pipeline`, `extract`, `render`,
`prompts`, `tests`, `ops`, `docs`), no era words (`local`, `pad`,
`review`, `flow`), prompt files in `snake_case` named for the task not
the product ("AI Builder prompt" → "prompt"). Module file names stay
as they are — the versions and CHANGES entries reference them and the
moves are `git mv` so blame survives.

If D7 = keep `local/`: same layout with `local/` in place of
`pipeline/`; everything else unchanged.

---

## 4. Bug fixes for active code, ordered by risk

Each fix is one commit with a discriminating gate assertion (the repo's
own rule). Line numbers are current `main`.

**A — can corrupt the lists or the corpus**

| # | Where | Bug | Fix |
|---|---|---|---|
| 1 | `sweep.mjs:532–540`, `:1876–1882` | `createRow` does the Graph create, then the SPO hyperlink write; if SPO throws (throttle, 255-char URL, comma in description) the new id is lost and the catch path creates a **second Doc Index row** with the same DocKey. Same at `:2076/2113/2152`. | Return/register the row id before the SPO step; on SPO failure, keep the row and mark the hyperlink write for retry (`LastError`). Gate: mock SPO failure → exactly one row. |
| 2 | `sweep.mjs:1926–1948` | Ghost reconciliation has no sanity floor: a `docKeyStrip`/path mismatch makes every row a "ghost" — 20 archived + sidecars deleted per night until noticed. | Refuse to archive when ghosts exceed `max(5%, 20)` of rows or when `liveKeys` matched fewer than 50% of rows; loud note. |
| 3 | `lib/remotefs.mjs:97–106` | Remote-mode prune deletes every local `.md` not in the drive listing — an empty/partial listing wipes the mirror (and, if `sidecarLibrary` points at a synced folder, the corpus). | Refuse when the listing is empty or < 50% of the local count. |
| 4 | `sweep.mjs:1203–1233` (`--rename`) | Link rewrite is `split(oldName).join(newName)` on bare `<stem>.md`; a stem that is a suffix of another (`123-foo.md` inside `4123-foo.md`) corrupts links corpus-wide. | Anchor on the preceding `/`, `<` or `(` boundary. |
| 5 | `sweep.mjs:2176` | A reclassified doc keeps its stem but `takenStems` is only checked for fresh mints — the write can overwrite another doc's sidecar in the new kind folder. | Check the stem in the target folder; re-mint on collision. |
| 6 | `lib/remotefs.mjs:131–133` | `flush()` clears the queue before uploading; the first failure drops every remaining write while rows already point at the files. | Re-queue the unsent tail; fail the run loudly. |
| 7 | `sweep.mjs:2212, 2302` (+`llm.classifyDoc` aibuilder path) | Model output is not shape-validated; a string in `keywords` iterates per character → one Keywords row per character. | Moot after §5 (schema-pinned output); until then validate arrays/strings. |
| 8 | `scripts/SidecarPatch.ts:455` | `decodeURIComponent` on a neighbour bullet's URL is unguarded; a malformed `%` in one neighbour throws out of `main` and fails the whole related-write for that doc (reproduced). | try/catch → keep the raw target. |
| 9 | `sweep.mjs:884` (`columnDropper`) | The "field not recognized" retry calls `createRow` again — if the error came from the SPO step after a successful create, it duplicates Test Cases/Figures rows. | Retry only the failed layer. |
| 10 | `curate.mjs:360–410` | `autoApprove` does not update `byLower` after a merge; a later proposal in the same run can chain A→B→C or target an alias. | Update the in-memory map per merge. |

**B — wrong output or nightly churn**

| # | Where | Bug | Fix |
|---|---|---|---|
| 11 | `scripts/RelatedRank.ts:598,752` | `today` defaults to `Date.now()`; the sweep passes none → scores drift daily → SidecarPatch sees byte changes → neighbour sidecars rewrite nightly. | Sweep passes the run date (day precision); gate asserts identical output across two runs on one day. |
| 12 | `scripts/ZipTextExtract.ts:629` | `findTitleShape` returns `null` on the first *empty* title placeholder instead of continuing; the real title lands in the body under `## Slide N` (reproduced). | `continue`. |
| 13 | `testplangen.mjs:2153–2160` | Story figure links `../media/<stem>/<file>` are absolutized with `encodeURIComponent(rest)` → `/` becomes `%2F`; already-encoded names double-encode. | Encode per segment; skip already-encoded. |
| 14 | `draft2docx.mjs:397` | CLI guard compares `path.resolve(url.pathname)`; on Windows that is `\C:\…` → the converter never runs from the command line on the deployed platform. | Use `pathToFileURL(argv[1]).href === import.meta.url` like the other four entry points. |
| 15 | `draft2pptx.mjs:595, 704–712, 855` | Setup fixture tables and Expected-Result after-state tables are dropped from case/checklist slides (header claims nothing is dropped); long lists overflow the footer. | Render tables via the existing `tableFrame`; paginate. |
| 16 | `lib/deckspec.mjs:404–407` | Title-slide `eyebrow`/`subtitle` and table `note` are grounded against the draft although the prompt says they are the model's; one free eyebrow drops the whole title slide. | Add them to the free-text set. |
| 17 | `testplangen.mjs:1580–1596` | `caseAwareTake` indexes `spans[i]` by `parsed.cases[i]` and reads the last span unguarded; a length mismatch throws inside generation. | Guard + fall back to whole-plan trim. |
| 18 | `lib/bodyindex.mjs:68`, `lib/embedindex.mjs:78` | Seam is `lastIndexOf("\n---\n")` while the rest uses `bodySeamEnd`; a body with a `---` rule indexes only its tail. | Use `bodySeamEnd`. |
| 19 | `gantt.mjs:241` | `localOf` ignores `sharePoint.syncedSubfolder` and has no Graph fallback → schedules under `General/` skip. | Reuse the sweep's `urlToLocal` + fallback. |
| 20 | `sweep.mjs:2325`, `lib/figureindex.mjs:514`, SPO `Url` | `DocKeywords.Title`, `ImageLink.Url`, `SourceLink.Url` uncapped at 255; a long path → 400 nightly. Hyperlink description with `", "` mis-splits. | Cap; strip commas from descriptions. |
| 21 | `scripts/RegexExtract.ts:247` | Bare `UN` token → Utility Network on "the UN …" (reproduced). | Require context (`UN LRS`, `UNAPR`, …) like `APR`'s guard. |
| 22 | `scripts/ShapeExtract.ts:741–751, 992–1027` | Flips ignored on shapes, rotation dropped on freeforms; zip-layer errors prefixed `ZipTextExtract:`. | Apply transforms; fix prefix. |
| 23 | `llm.mjs:132–135` | `replaceAll` with string replacement: `$'`/`` $` `` in a filename or doc text duplicates the template and re-substitutes placeholders. | Moot after §5; function replacer meanwhile. |

**C — hygiene**

24 `deck2pptx.mjs:322` lacks the Dataverse inheritance block (moot after D2) · 25 `ops.mjs:120` `Number(maxCells)` NaN disables the truncation guard · 26 `run_job.mjs:190` temp dir leaks on load failure · 27 `sweep.mjs:2238` sidecar written before `TextFileUrl` patch (orphan on failure; ghost archive leaves `media/<stem>/`) · 28 `curate.mjs` `--models` fetch and `auth.redeemRefreshToken` have no timeout · 29 the ~30 undocumented config keys → `config.sample.json` · 30 version-drift lines and the two stale READMEs · 31 remove dead `presentation.caseHeadings` · 32 `caches.docIdRows.push` omits `Source` (`sweep.mjs:2266`).

Deferred, not planned: the duplication list in §2.3 (each item is a safe
mechanical merge but none is a bug; do them opportunistically when the
file is open for a fix).

---

## 5. LLM calls via the Anthropic API (Python + `anthropic` SDK)

### 5.1 Call sites today and their target

| Site | Today | Target task (Python) | Model | Output |
|---|---|---|---|---|
| `sweep.mjs → llm.classifyDoc` (per changed doc, ≤150/night; ~760 on a backfill) | AI Builder Predict, brace-slice; or hand-rolled Anthropic call with a JSON schema | `lrsdoc.tasks.classify` | `claude-opus-5`, `effort: medium`, `max_tokens: 4096`; nightly runs synchronous, backfills via the **Batch API** (50% price) | JSON schema (`prompts/schemas/docindex_classify.json`, 9 fields) via `output_config.format` |
| `curate.mjs` (weekly, one call per vocab chunk) | AI Builder only | `lrsdoc.tasks.curate` | `claude-opus-5`, `effort: high` | JSON schema (`{proposals:[{alias,canonical,why}]}`) |
| `testplangen.mjs` draft | `generateText` streamed, sentinel slice | `lrsdoc.tasks.draft` | `claude-opus-5`, adaptive thinking (`display: summarized` only under `--stream`), `effort: high` (config knob; `xhigh` for long stories), **streaming**, `max_tokens` 64000 | markdown between sentinels (keep — the fail-closed check is cheap and the verifier needs the whole draft) |
| `testplangen.mjs --figures` | `generateText`, sentinel + JSON | `lrsdoc.tasks.figures` | `claude-opus-5`, `effort: medium` | JSON schema (`testplan_figures.json`, the closed vocabulary becomes `enum`s — half of `figurespec.verify` becomes schema validation) |
| `testplangen.mjs --deck` / `deck2pptx --generate` | same | `lrsdoc.tasks.deck` | `claude-opus-5`, `effort: medium` | JSON schema (`testplan_deck.json`: 13 pattern enums, region shapes) |
| `sweep.mjs --normalize-cases` | `generateText` | `lrsdoc.tasks.normalize` | `claude-opus-5`, `effort: high`, streaming | markdown (body); existing grounding verifier unchanged |
| `lib/embedindex.mjs` | Voyage/OpenAI-compatible embeddings | — (D6) | n/a — no Anthropic embeddings endpoint | — |

Model tiering: every task defaults to `claude-opus-5`. The classify lane
is the one candidate for `claude-sonnet-5` (high volume, small output,
narrow schema); the plan includes a 40-document A/B (Opus vs Sonnet on
the same sidecars, diffed field by field) before any step-down, because
a classifier change is a corpus-wide backfill. No task uses Haiku: the
inputs are long documents and the failure mode is silent
misclassification. `claude-fable-5-1` is not proposed for any lane.

### 5.2 Shape of the Python layer

```
lrsdoc/llm.py       client = anthropic.Anthropic()   # API key or `ant auth login` profile; ANTHROPIC_BASE_URL honoured (the harness mocks point there)
                    call(prompt, inputs, *, stream=False, on_delta=None) -> Result{text|json, usage, stop_reason, model, prompt_version}
                    - system = prompt.system (cache_control ephemeral on it: the instruction block is the stable prefix,
                      the document is the volatile tail — the DocIndex/TestPlanGen instructions are 2–8k tokens)
                    - messages = [{"role":"user","content": rendered user template}]
                    - stop_reason handling: max_tokens → raise Truncated(partial); refusal → raise Refused(stop_details)
                    - retries/timeouts: the SDK's (max_retries=4, timeout per task from front matter); no hand-rolled backoff
                    - streaming: client.messages.stream(...).get_final_message(); deltas forwarded to on_delta (stderr echo for --stream)
lrsdoc/prompts.py   load("testplan_draft") -> Prompt{name, version, model, effort, max_tokens, output, inputs, system, user}
                    render() does whole-token {Name} substitution with a function replacer (no `$` expansion), refuses unknown/missing inputs
lrsdoc/tasks/*.py   one module per task: build inputs → call → post-process (sentinel slice / json.loads) → return dict
lrsdoc/cli.py       python -m lrsdoc <task> --input in.json [--output out.json] [--stream]
                    stdin/stdout JSON, stderr = progress + stream echo, exit 2 = truncated, 3 = refused, 4 = contract miss
```

Node side: `pipeline/llm.mjs` shrinks to `runTask(name, inputs, {stream})` = spawn `python -m lrsdoc`, pipe JSON, pass `ANTHROPIC_BASE_URL`/`ANTHROPIC_API_KEY` through; the four callers keep their signatures (`classifyDoc`, `generateText`, …) so `sweep.mjs`/`testplangen.mjs`/`curate.mjs` change only in the provider-resolution lines. The existing harness mocks (a local HTTP server standing in for the Messages API) keep working because the SDK honours `ANTHROPIC_BASE_URL`; the mock-Predict legs are deleted with the lane (D2). `lrsdoc` gets its own tests with the SDK's mock transport (no network) — prompt rendering, schema validity, sentinel handling, truncation/refusal paths.

Python is already a hard requirement of the repo (every gate), so this adds one package dependency (`anthropic`, plus `pyyaml` already required) and no new runtime.

**Alternative (D1b)**: `import Anthropic from "@anthropic-ai/sdk"` in `llm.mjs`; same request shapes, no subprocess, but a `package.json` and `node_modules` on the sweep machine, and future Python workflows would re-implement the prompt loader. Roughly 60% of the Python option's effort.

### 5.3 Prompts as versioned files

Keep one file per prompt in `prompts/`, git as the version store, and
make the file self-describing:

```markdown
---
name: testplan_draft
version: 1.13.0            # semver; bumped in the same commit as the text
model: claude-opus-5
effort: high
max_tokens: 64000
timeout_s: 1800
output: markdown           # or json_schema → schemas/testplan_draft.json
sentinels: ["[[[DRAFT BEGIN]]]", "[[[DRAFT END]]]"]
inputs: [StoryMeta, StoryText, RelatedDigest, ExemplarText, ReferenceText, RelatedCases]
---
## System
(the instruction block — verbatim from today's PROMPT TEXT, minus the AI Builder wording)

## User
(the input frame: <<<STORY>>> {StoryText} … — the document text sits here, after the cached prefix)
```

- The 50–250-line AI Builder paste headers are dropped (their history is in git and `docs/history.md`); `prompts/CHANGELOG.md` gets one line per bump.
- The version stamps outputs exactly as today (`PromptVersion` on Doc Index rows drives the backfill gate; the draft banner carries `TestPlanGenPromptVersion`) — the loader reads it from the front matter, so `config.sweep.promptVersion` disappears as a hand-maintained knob (config may still *pin* an older stamp during a staged backfill).
- `review/patches/*_Prompt_v*.md` and the "paste then promote" convention go away; a prompt change is a PR that edits the file, bumps `version`, and states the backfill implication.
- Prompt text edits proposed with the migration (small, each its own commit): remove "no reasoning" lines (moot with adaptive thinking), move the instructions to `## System`, keep the fenced data frames so document text cannot masquerade as instructions.

### 5.4 Things the SDK move removes

`llm.mjs` SSE parser, backoff, OAuth shell-out, `anthropic-beta: oauth` header, per-lane timeout semantics, `braceSlice`, `AI_BUILDER_SOURCE`, `dataverseToken`, the Dataverse half of `auth.mjs`, `--models` subcommands in three jobs, six `llm.*ModelId` config keys, the Predict mocks in two harnesses, `deck2pptx`'s broken config inheritance (bug 24), bug 23.

### 5.5 Cost / behaviour notes for the switch

- Classifier change = `PromptVersion` bump = one-time re-index of ~760 documents. At ~6k input tokens per document (text cap) and ~300 output: ≈ $28 on Opus 5 synchronous, ≈ $14 via the Batch API; nightly steady state (≤150 docs, typically <20) is cents.
- A test-plan draft (≈40k input, ≈15k output with thinking) ≈ $0.60 on Opus 5; figures/deck passes ≈ $0.30 each.
- Data egress: document text leaves the tenant (today it goes to the tenant's AI Builder). `Local_Setup.md` §8 already frames this as an owner decision; it is implied by the request and recorded in `docs/setup.md`.

---

## 6. Deletion list

All deletions are their own commits (one per group) so any can be
reverted alone. Records move first (§7 step 1) so nothing is lost.

| Group | Delete | Keep/move instead |
|---|---|---|
| G1 flow | `flow/**` — 11 `definition.json`, 11 `DocIndexSweep_*.zip` (1.9 MB) | `flow/*/CHANGES.md` → `docs/history/flow/` (verbatim, 95 KB) |
| G2 secondary flows | `curation/flow/`, `testplangen/flow/`, `testplangen/*.zip` (4), `testplangen/TestPlanGen_Setup.md`, `Coverage_Runbook.md`, `TestPlanGen_Smoke.md`, `curation/Curation_Setup.md` | guides → `docs/history/`; smoke rows worth keeping → `tests/MANUAL_SMOKE.md` |
| G3 PAD | `pad/flow/`, `pad/PAD_Setup.md`, `pad/CHANGES.md`, `.gitattributes` | runner files → `extract/runner/`; PAD_Setup → `docs/history/` |
| G4 paste artifacts | `review/patches/*.ts`, `*.md` prompts (23 files), `review/harness/check_batch*.py` (7), `run_diff.py`, `review/harness/README.md` (rewritten as `tests/README.md`) | `designer-edits.md`, `patches/README.md` → `docs/history/` |
| G5 reviews | — | `review/REVIEW*.md` (5) → `docs/history/reviews/` |
| G6 Copilot (D5) | `testplangen/agent/**`, `agent/QA_Agent_Instructions_v1_0…v1_3.md`, `agent/QA_Agent_Setup.md`, `QA_Smoke_Questions.md`, `agent/CHANGES.md`, `testplangen/agent/Agent_Setup.md` | `QA_Agent_Instructions_v1_4.md` → `docs/qa-agent-instructions.md` if the Teams agent stays |
| G7 schema prompt | `schemas/Copilot_Schema_Prompt.md` | — |
| G8 AI Builder lane (D2) | code paths listed in §5.4 | — |
| G9 snapshot (D4) | `LRSDocIndex/**` (7,309 files) | `.gitignore` `corpus/` + a note in `docs/setup.md` |
| G10 embeddings (D6) | `lib/embedindex.mjs`, `sweep.embedRelated`, `llm.embeddings`, gate legs | — |
| G11 docs | `README.md` flow-era body, `STATUS.md` narrative head, `STATUS_history.md`, `docs/SP_Adaptation_Notes.md` flow-build sections | `docs/history.md` (new narrative) + `docs/history/` (verbatim files); `sharepoint-notes.md` keeps the GUID table and live quirks |

Not deleted: anything under `local/`, `scripts/`, `prompts/`,
`schemas/*.csv`, `pad/runner/`, the live harness set, both workflows.

---

## 7. Phase 3 sequence (one logical change per commit)

Each step ends with the full gate set green (`fixture-free`,
`full-format`, `typecheck`); a step that changes behaviour adds the
assertion that fails on the previous commit.

**3a — Records and deletions (no behaviour change)**
1. `docs/history.md` + `git mv` of every record listed in §6 into `docs/history/`, `docs/changelog/`, `docs/design/`.
2. G1 delete `flow/` definitions + zips.
3. G2 delete secondary flows/zips/guides.
4. G3 delete PAD flow + `.gitattributes`.
5. G4 delete `review/patches` + batch gates; `tests/README.md`.
6. G6/G7 per D5.
7. G9 per D4 (`git rm -r LRSDocIndex`, `.gitignore`).

**3b — Moves (import-path edits only; `git mv` so diffs are renames)**
8. `local/` → `pipeline/` (+ `render/`, `data/`), `pad/runner` + `scripts/` → `extract/`; update the ~20 relative imports and `DEFAULT_SCRIPTS_DIR`.
9. Harnesses → `tests/`; CI workflow paths; `ops/` wrappers and task XML paths (D7).
10. `local/*.md` → `docs/`; `config.sample.json` → root.

**3c — Bug fixes (§4, one commit each, A before B before C)**
11–33. Bugs 1–23 in order; hygiene items 24–32 batched by file.

**3d — Anthropic API layer**
34. `pyproject.toml` + `lrsdoc/` package + `tests/test_lrsdoc.py` (no callers yet).
35. `prompts/` rewrite to front-matter files + `prompts/schemas/*.json` + `CHANGELOG.md` (text unchanged except the header removal and the system/user split; version stamps unchanged so no backfill fires here).
36. `pipeline/llm.mjs` → bridge; callers switched; harness Anthropic mocks retargeted via `ANTHROPIC_BASE_URL`.
37. G8 delete the AI Builder/Dataverse lane + its mocks + config keys (D2).
38. Classifier `PromptVersion` bump commit (the one that triggers the backfill) — separate so it can be timed with the auth fix.
39. Optional: `--backfill --batch` mode for `sweep.mjs` using the Batch API for the one-time re-index.

**3e — Docs**
40. `README.md` rewritten: current architecture, the three jobs, config, running the gates, prompt versioning, links into `docs/`.
41. `STATUS.md` trimmed to the deployed table + open actions.
42. `docs/history.md` finalised with the commit hashes of every deletion (so the paper trail says where each artifact went).

**Later (not in this plan's scope, listed for completeness)**: D8 extractors as ES modules (dedupe the zip code, drop the loader and the ES2017 gate); the §2.3 duplication merges; Entra app-registration auth (the outage fix); a Python Q&A prompt over the sidecars (§2.4).

Estimated effort: 3a–3b half a day; 3c two days (gate assertions dominate); 3d two to three days; 3e half a day.
