# STATUS — what is deployed, and what is open

If a number here disagrees with a file header or a changelog entry,
this file wins the argument about what is *deployed*; the file's own
header wins about what is *authored*. The per-day narrative that used
to live here is `docs/history/STATUS_history.md` (the pre-trim file
is appended there verbatim); release notes belong in
`docs/changelog/*` and `prompts/CHANGELOG.md`.

Last updated: **2026-09-06** (the cleanup branch — see
`docs/history.md` §1, last row).

## Deployed

| Piece | On the sweep machine (`C:\Repos\lrs-doc-index`, self-updates from the `deploy` branch) | Authored (this tree) |
|---|---|---|
| Nightly sweep | `sweep.mjs` DEPLOYED 2026-08-14 (scheduled task "LRS Doc Index Sweep", daily 17:00, `ops\run_sweep.cmd`). **Not running since the device-code refresh token expired** (Conditional Access `AADSTS53003`, open action 1). Corpus stamped `PromptVersion` **v2.0.2** by the AI Builder classifier | sweep v1.63 + this branch; classifier `docindex_classify` 3.0.0 through the Anthropic API — stamp `v3.0.0` once the machine's pin is removed (open action 3) |
| Weekly curation | `curate.mjs` DEPLOYED 2026-08-15 ("LRS Keyword Curation", Saturday 08:00, `curation.autoApprove: true` — merges apply, the digest is an audit log); first run canon=1880, two merges | curate v1.11.1 + this branch (`keyword_curation` 1.1.0 through the Anthropic API) |
| The wiki | `devtopia.esri.com/kev14953/lrs-doc-index` (private), first push pending (open action 9) | `wiki.mjs` v1.0, `tests/check_wiki.py` 34 checks |
| Test-plan drafting | `testplangen.mjs` on the machine (manual runs; `--auto` INERT until `testplangen.autoDraft: true`) | testplangen.mjs v1.22, `testplan_draft` 1.13.0, `testplan_figures` 0.4.0, `testplan_deck` 0.1.0 |
| Schedules → Issue Refs | `gantt.mjs` never run live; the Issue Refs list GUID is verified (`docs/sharepoint-notes.md`) | gantt v1.0 |
| Extractors | the seven `extract/*.ts` run in-process by every deploy (ZipTextExtract v2.7, RegexExtract v1.5, ShapeExtract v1.1, SidecarPatch v1.8, RelatedRank v2.2, WorkbookDump, MediaExtract) | same |
| SharePoint | eight lists on lrsworkspace (`schemas/SPList_*.csv`; GUIDs in `docs/sharepoint-notes.md`), the LRS Doc Index library with `media/` and the kind folders; sidecar format 3.0 authored, the corpus still carries the 2.x layout until the reformat pass (open action 4) | — |
| Q&A agent (Copilot Studio) | instructions v1.1 pasted (re-paste date unconfirmed) | v1.4 (`docs/qa-agent-instructions.md`) — paste + smoke (open action 7) |
| Cloud flows, Office Scripts, AI Builder prompts, the TestPlanGen agent | OFF / retired; nothing orchestrated or model-hosted remains on Power Platform. Definitions live in git history only (`docs/history.md` §4) | — |
| Gates | CI green on every push; `main` promotes `deploy` when all three jobs pass | `tests/` — sweep 328, testplangen 238, deck2pptx 56, deckspec 99, lrsdoc 35, and the rest |

## Deploying this branch on the machine

The cleanup changed what the machine needs. In order, from a console:

1. **Auth** (open action 1) — set `"auth": "interactive"` on `graph`
   in the config and run the sweep once from a console to complete
   the browser sign-in; or move to `"auth": "app"` with an Entra app
   registration (`docs/setup.md` §2) so the runner stops depending on
   idle refresh tokens.
2. **Config** — `local\config.json` becomes `config.json` at the repo
   root (`ops\*.cmd` pass `--config config.json`). Drop the `llm`
   section's AI Builder keys and set
   `"llm": {"apiKey": {"$env": "ANTHROPIC_API_KEY"}}`; remove
   `sweep.embedRelated` / `llm.embeddings` if present; keep
   `sweep.promptVersion: "v2.0.2"` for now (it pins the stamp; step 5).
3. **Python** — install Python 3.10+ and `pip install anthropic`; set
   `ANTHROPIC_API_KEY` as a user environment variable (the scheduled
   tasks inherit it). `python -m lrsdoc prompts` from the repo root
   proves the layer loads.
4. **Scheduled tasks** — the entry points moved from `local\` to
   `ops\`: re-register both tasks from `ops\sweep_task.xml` and
   `ops\curation_task.xml` (the `schtasks` lines are in the files).
   Register `ops\run_heartbeat.cmd` as the dead-man task if alerts
   are on.
5. **Smoke, then backfill** — `sweep.mjs --dry-run` (the DocKey
   calibration line, `processed` ≈ 0), then `--live --only "<one
   deck>"` (the row re-stamps, keywords plausible — `tests/MANUAL_SMOKE.md`
   rows 9–10). Then remove `sweep.promptVersion` from the config: the
   stamp becomes `v3.0.0` and the nightly run re-classifies ~150
   documents a night (~760 total; roughly $28 of Opus 5 tokens over
   the backfill at ~6k input tokens per document).

## Open actions

1. **Restore sweep auth** — Conditional Access refuses device-code
   sign-in (`AADSTS53003`); the nightly pipeline has failed closed
   with `AUTH EXPIRED` since the refresh token expired. Fix per
   "Deploying this branch" step 1. Nothing indexes until this clears.
2. **Deploy this branch** — steps 2–4 above (config at the root,
   Python + API key, the re-registered tasks).
3. **Classifier backfill** — step 5 above: remove the
   `sweep.promptVersion` pin once the one-doc smoke looks right;
   watch the first nights' `processed`/`errors` counts and the
   Skipped rows (`content filter:`).
4. **Reformat pass** — `ops\run_sweep.cmd --reformat` once (no model
   spend): sidecar format 3.0 (the metadata table), the current
   extractors' bodies (diagram captions, case headings, standardized
   media names), then `--rename-plan` / `--rename --live` for the
   `<issue>-<slug>.md` file names and `--refigure --live` for the
   Figures list (`docs/setup.md` §13–§14 give the order and the list
   columns to add first).
5. **Activate the ops pieces** (each one enable step): alerts —
   `alerts.webhookUrl` (Teams incoming webhook) in the config; dead-man
   — the heartbeat task; gantt — add `sharePoint.lists.issueRefs`,
   run `gantt.mjs --dry-run` then `--live` and record the first run
   here; repoint — after the next approved keyword merges,
   `curate.mjs --repoint --live` then `sweep.mjs --rerank`; optional
   `sweep.graphDownloadFallback` and `sweep.tesseractPath` (install
   Tesseract).
6. **Hosted runner** (optional) — `docs/hosted-runner.md` top to
   bottom: app-registration auth, the policy call on tenant
   credentials and the API key in GitHub secrets, then the
   `HOSTED_SWEEP_ENABLED` variable; never both the hosted run and the
   desktop task live.
7. **Q&A agent** — paste instructions v1.4
   (`docs/qa-agent-instructions.md`) once the reformat pass has
   landed format 3.0, re-run the agent smoke
   (`docs/history/QA_Smoke_Questions.md`), record the paste date here.
8. **Curation courtesy check** — read the first all-resolved Saturday
   digest after the deploy; the model changed under the same prompt
   text.
9. **The wiki** — the private repository is
   `https://devtopia.esri.com/kev14953/lrs-doc-index` (Pages source:
   GitHub Actions, set once). `wiki.repoUrl` in the sample already
   names it; clone it once from a console so the credential helper
   holds the token, run `wiki.mjs --config config.json --push`, then
   register `ops\wiki_task.xml` (`docs/setup.md` §15). The first
   push after the reformat pass (action 4) is the one worth showing
   people: format 3.0 pages, standardized figure names.
10. **Later phases** (not started): the extractors as plain modules
   (`docs/history/PLAN_2026-09.md` D8); a Batch API backfill mode.
