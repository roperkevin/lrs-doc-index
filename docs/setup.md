# Setup and operations guide

Runs the entire Doc Index sweep as a local Node process
(`pipeline/sweep.mjs`), the descendant of the DocIndexSweep Power
Automate cloud flow. Nothing Power Platform remains: no Run-script
quota, no AI Builder, no premium connectors, no import packages.
SharePoint stays exactly where it is — the corpus, the lists, and every
consumer are untouched. Every model call goes to the Anthropic API
through the Python layer (`lrsdoc/`, §3). Deployment is a `git pull`
(the `ops/*.cmd` wrappers do it from the CI-promoted `deploy` branch);
the whole pipeline sits under the repo's gate discipline
(`tests/check_local_sweep.py`, CI `fixture-free` job). The section
numbers below are referenced from code messages and the config sample.

What replaced what (the flow-era vocabulary still appears in comments
and changelogs):

| Cloud flow piece | Local replacement |
|---|---|
| Recurrence trigger (daily 17:00 MST) | Windows Task Scheduler (§4) — runs headless, machine can stay locked |
| Nine Run-script actions | `extract/*.ts` in-process via `extract/runner/ops.mjs` (the gated PAD loader) |
| AI Builder prompt | `prompts/docindex_classify.md` on Claude through the Anthropic API (`pipeline/llm.mjs` → `python -m lrsdoc classify`, §3) |
| SharePoint file reads/writes (docs, sidecars, media) | OneDrive-synced library folders, plain file I/O |
| SharePoint list actions (the lists) | Microsoft Graph + SharePoint REST (`pipeline/graph.mjs`), delegated sign-in or an Entra app registration (§2) |
| Catch_index / LastError / retry-next-run | Same semantics, reimplemented (Error rows retrigger via Needs_index) |

The orchestrator mirrors flow v2.8 action-for-action (Needs_index
gating, PromptVersion backfill, sidecar header bytes, IdKey/LinkKey/
KWKey dedup, shortlist→final→sidecarpatch relatedness with reciprocal
neighbor patching, Skip/Error lanes). Documented deviations: §6.

## 1. Machine prerequisites

- The PAD machine setup (Node 22.6+, repo clone at e.g.
  `C:\DocIndex\lrs-doc-index`, scratch dir) — see `docs/history/PAD_Setup.md`
  §1. Power Automate Desktop itself is NOT needed for the local sweep.
- **Optional but recommended — Poppler's `pdftotext`**, which lets
  the sweep index PDFs (the cloud flow always skipped them). Install
  with `winget install poppler` (or grab a poppler-windows release
  zip) and either put its `Library\bin` on PATH or set
  `sweep.pdftotextPath` in config to the full `pdftotext.exe` path.
  Without it the sweep behaves exactly as the flow did (PDFs →
  Skip lane) and says so in the log. PDFs already stamped `Skipped`
  are automatically rescued and indexed on the first run where the
  tool is present.
- **Both libraries synced** with the OneDrive client:
  - the LocationReferencing **Documents** library (source docs, read),
  - the lrsworkspace **LRS Doc Index** library (sidecars + `media/`,
    read-write).
  Writes to the second folder are how sidecars reach SharePoint — give
  the sync client time after each run (it's fast; the run itself
  doesn't wait).
- **No credentials to provision.** The default auth mode (§2) is a
  sign-in as you — no Azure app registration, no client secret, no
  API key, no environment variables.

## 2. Signing in — no Azure app registration

The default (`graph.auth: "device"`) authenticates **as you**, using
Microsoft's own pre-registered public client applications — the same
identities the Azure CLI and Microsoft Graph PowerShell sign in with,
present in every tenant. Nothing to register, nothing to ask an
admin for. All reads and writes run under your existing SharePoint
permissions — the same identity model as the cloud flow's
connections, which also ran as you (list rows will show your name as
Created/Modified By, as they do today).

How it works:

1. **First run** (do it from a console): the sweep prints
   `Open https://microsoft.com/devicelogin and enter the code XXXX`
   — once, for Graph (list reads/writes). Sign in with your normal
   account. The second token — SharePoint REST, for the hyperlink-column writes Graph
   cannot do (`SourceLink`/`TextFileUrl` go through
   `ValidateUpdateListItem`) — is minted **silently** from the Graph
   sign-in: it uses the same public client, so its refresh token
   converts to a SharePoint-audience token with no extra prompt.
2. The refresh tokens are cached under `paths.workDir\auth\`
   (`graph.json`, `spo.json`, mode 0600). Every later run —
   including scheduled ones — refreshes silently; nightly runs keep
   the tokens alive indefinitely.
3. If the machine sits idle long enough for a refresh token to
   expire, the next run prints the sign-in prompt again — run the
   sweep once from a console and you're back. (Failed scheduled runs
   in between simply do nothing; no writes happen unauthenticated.)

**If your tenant's consent policy balks** at the Graph scope on first
sign-in ("Need admin approval"), point `graph.clientId` at a public
client your tenant already allows — the Azure CLI's
`04b07795-8ddb-461a-bbee-02f9e1bf7b46` is usually pre-consented
everywhere. Note the SPO token
(`spo.clientId`) is the one place the Azure CLI client does NOT work:
its SharePoint grant carries only `user_impersonation`, which SP REST
rejects with 401 — the Graph CLI client is the one whose tokens carry
real SharePoint permissions (probe matrix, 2026-08-14; rerun
`probe.mjs --spo` to re-measure in a different tenant).

**If Conditional Access rejects the sign-in** (`AADSTS53003`, "your
sign-in was successful but does not meet the criteria to access this
resource"), the block is the *flow*, not the client: a device-code
sign-in completes in a browser with no relationship to this machine, so
it can present no device identity, and a policy requiring a compliant or
joined device refuses it. Changing `clientId` does not help — the
symptom reproduces on every public client. Set `"auth": "interactive"`
instead (on `graph`, and it flows to SPO):

```json
"graph": { "auth": "interactive", "tenantId": "<tenant guid>" }
```

That runs the authorization-code grant with PKCE against a loopback
redirect (`http://localhost:<random port>`). Entra ignores the **port**
of a loopback redirect but not the **host**: these public clients
register `http://localhost`, and sending the `http://127.0.0.1` form is
rejected as a mismatch (`AADSTS50011`) — so nothing needs registering,
but the host has to be spelled that way. Both loopback stacks are bound
on that port, since `localhost` may resolve to either. If a tenant's
registration uses the 127.0.0.1 form instead, set
`graph.redirectHost: "127.0.0.1"`. Your own browser on this
machine handles the sign-in, so it carries the machine's PRT and device
state and the policy is satisfied. Only the FIRST sign-in differs —
caching, silent refresh and the SPO seed are unchanged, so scheduled
runs behave exactly as before. Confirm the machine is actually joined
first with `dsregcmd /status` (`AzureAdJoined` or `DomainJoined` = YES);
if it is genuinely unregistered, interactive will fail the same way and
the app registration below is the only route.

**Alternative — app registration** (for a future service-account
setup, if someone with Entra rights ever provisions one): set
`"auth": "app"` with `tenantId`/`clientId` and a `clientSecret` as
`{"$env": "DOCINDEX_GRAPH_SECRET"}`; application permission
`Sites.Selected` (grant write on lrsworkspace, read on
LocationReferencing) or `Sites.ReadWrite.All`. The gate covers both
modes. The model call needs no Entra identity at all (§3).

## 3. The AI step — the tenant model / the Anthropic API through `lrsdoc`

Every model call — the sweep's classify step, `--normalize-cases`,
keyword curation, test-plan drafting and its figures/deck passes —
is `python -m lrsdoc <task>`: `pipeline/llm.mjs` spawns the Python
layer, which loads the prompt file, renders the inputs, sends the
request through the official Anthropic SDK and prints the result as
JSON lines (streamed deltas first when the job asks). The prompt
files live in `prompts/` with their versions, models, effort levels
and output schemas in front matter (`prompts/README.md`); the
classify and curation prompts return schema-pinned JSON, so nothing
is brace-sliced any more.

Setup (one-time, on the machine that runs the jobs):

1. Python 3.10+ with the SDK: `pip install anthropic` (the CI job
   pins nothing else). `python3` must be on PATH (`python` on
   Windows); `llm.python` in config or `LRSDOC_PYTHON` in the
   environment names another interpreter.
2. Credentials: an Anthropic API key. Put it in the environment as
   `ANTHROPIC_API_KEY` and reference it from config as
   `"llm": {"apiKey": {"$env": "ANTHROPIC_API_KEY"}}` (the sample
   does), or leave `llm.apiKey` out and let the SDK pick up
   `ANTHROPIC_API_KEY` / `ANTHROPIC_AUTH_TOKEN` from the environment.
   The scheduled tasks inherit the machine's user environment, so a
   user-level variable is enough. With a tenant model configured
   (below) this key is what stands behind it.
3. Smoke: `python -m lrsdoc prompts` lists the six prompt files;
   `tests/test_lrsdoc.py` exercises the layer against a mock server.
   A live check is one document: `sweep.mjs --live --only "<doc>"`.

### The tenant's own model, with the Claude API behind it

The company runs its own Claude deployment on Microsoft Foundry — the
same tenant the SharePoint side signs into (§2), but a separate
credential; the model call itself still needs no Entra identity.
Point the pipeline at it with an `llm.tenant` block:

```json
"llm": {
  "apiKey": {"$env": "ANTHROPIC_API_KEY"},
  "tenant": {
    "provider": "foundry",
    "resource": "my-company-ai",
    "apiKey": {"$env": "ANTHROPIC_FOUNDRY_API_KEY"}
  }
}
```

`resource` is the Foundry resource name — `my-company-ai` for
`https://my-company-ai.services.ai.azure.com/anthropic/`; `baseUrl`
names the endpoint instead when the deployment does not sit at the
default address. Two optional keys: `model` is the deployment's model
id for tenants whose deployment is not named after the public model
(it replaces the prompt file's model on this backend only, so the same
prompt still runs on the Claude API behind it), and `fallback: false`
makes the tenant model the only backend.

**What falls back.** Every call goes to the tenant model first. When
that backend cannot serve it — the key is rejected (401/403), the
deployment is not there (404), the endpoint is unreachable or times
out, it is out of capacity (429) or it 5xxs — the call is sent again
to the Claude API on `llm.apiKey`, and one `progress:` line names the
switch:

```
progress: lrsdoc docindex_classify — the tenant model (foundry) could not
          serve this call (API 401: ...) — falling back to the Claude API
```

What does *not* fall back is an answer about the request itself: a 400,
a refusal, a truncation, a reply that misses its schema. The Claude API
would only reproduce it, and re-asking would double the spend and the
egress. Neither does a reply whose stream has already
started arriving: the caller may have seen text, a second attempt would
repeat it, and the SDK reports a broken stream as a transport error
rather than one of its own. Every result records which backend answered (`backend`:
`foundry` or `anthropic`), and `python -m lrsdoc ... --output` writes it
with the rest.

Without config, the layer reads the same setting from the environment —
`LRSDOC_TENANT=foundry` plus the SDK's own `ANTHROPIC_FOUNDRY_API_KEY`
and `ANTHROPIC_FOUNDRY_RESOURCE` (or `ANTHROPIC_FOUNDRY_BASE_URL`),
with `LRSDOC_TENANT_MODEL` and `LRSDOC_TENANT_FALLBACK=0` as the other
two knobs — so a machine that always uses the tenant model needs no
config change at all. A `llm.tenant` block wins over all of them.

Knobs (`llm.*`, all optional): `model` and `effort` override every
prompt's front matter; `maxRetries` (4) and `timeoutMs` (600000) are
the SDK's retry count and per-request timeout — a generation streams,
so the timeout is only the longest silent gap; `baseUrl` redirects
the endpoint (the gates' mock). `LRSDOC_DUMP_DIR=<dir>` in the
environment writes every rendered request beside its inputs, the
first thing to look at when a reply is not what you expected.

Spend: the classify step runs once per changed document (≤
`maxDocsPerRun` a night) on Claude Opus 5 at effort `medium`, ~6k
input tokens per document. A classifier change is a corpus-wide
backfill (~760 documents): bump the version in
`prompts/docindex_classify.md` and the stamp follows (§7).
`prompts/CHANGELOG.md` records every bump with its backfill
implication.

Data egress: document text goes to the Anthropic API under its data
terms — the decision the owner recorded when the AI Builder lane was
retired (`docs/history.md`, D2). With an `llm.tenant` block it goes to
the company's own Foundry deployment instead, and reaches the Anthropic
API only on the calls that fall back.

## 4. Configure + first run

```
cd C:\DocIndex\lrs-doc-index
copy config.sample.json config.json    (git-ignored)
:: fill in paths.*, graph.tenantId/clientId; verify list GUIDs vs
:: docs/sharepoint-notes.md
node --experimental-strip-types pipeline\sweep.mjs --config config.json
```

`config.sample.json` ships with `sweep.dryRun: true` — the first run
is automatically a **shadow run**: full enumeration and compute, zero
writes, a plan file in `paths.workDir`. It's also where the two §2
device-code sign-ins happen, so run it from a console. Flags:
`--live` (perform writes), `--dry-run`, `--max N` (cap docs),
`--only <filename>` (the SmokeFile equivalent — one doc),
`--rerank` (rebuild every Related Documents section from persisted
state — no AI calls, no extraction; run after keyword-curation
merges to propagate them corpus-wide in one pass),
`--reformat` (re-extract each source and rewrite ONLY the sidecar
body below the `---` seam — no AI calls; run after a change to the
body formatting so the whole corpus picks it up).

**Schedule it** (replaces the Recurrence trigger; unlike attended PAD
runs, Task Scheduler works with the machine locked). Register from
the repo-tracked task definition — it carries settings a plain
`schtasks /create` cannot express (catch-up runs when the machine
was off/asleep at 17:00; don't-block-on-battery for laptops):

```
schtasks /create /tn "LRS Doc Index Sweep" /xml C:\Repos\lrs-doc-index\ops\sweep_task.xml /f
```

The action is `ops\run_sweep.cmd`, which self-updates (`git pull
--ff-only` — merged fixes deploy on the next run; a non-fast-forward
state just runs the checked-out version), rotates
`work\sweep-task.log` at ~5 MB, and runs the live sweep. The sweep
itself prunes per-run JSON logs to the newest 30 and refreshes the
**status page** — `_Sweep Status.md` in the sidecar library root —
after every live run (last run, result, error lane, action needed),
so pipeline health is visible in SharePoint without touching this
machine. A scheduled run whose sign-in has expired fails fast with
`AUTH EXPIRED` in the log AND on the status page (it will not sit
waiting for a device-code prompt; run once from a console to
re-authenticate — set `DOCINDEX_ALLOW_DEVICE_PROMPT=1` to force the
prompt in a redirected/non-console context).

Run-summary JSON lands in `paths.workDir\sweep-<stamp>.json` (same
fields as the flow's Run_summary compose, plus the plan when dry).

## 5. Shadow-mode checklist (before the first --live)

1. **DocKey calibration.** The dry run reports
   `dockey calibration: X matched existing rows, Y new/unmatched`.
   On an already-indexed corpus, X should be nearly everything. A low
   hit rate means the computed key differs from what the cloud flow
   wrote — adjust `sharePoint.docKeyStrip` (the prefix stripped from
   each file's server-relative path) until it matches. Getting this
   wrong and going live would re-index the corpus under new keys.
2. **Selection sanity.** `library_items_seen` ≈ the library size;
   `processed` ≤ MaxDocsPerRun; with the corpus at the current stamp and no
   modifications, processed should be ~0.
3. **Plan review.** Skim the plan file: row creates/patches against
   the expected lists, sidecar paths under the synced folder.
4. **One-doc live smoke.** `--live --only "<some doc.pptx>"`, then
   verify on the tenant: row fields, sidecar rendering, media links,
   related section. This is the §6-of-PAD-guide equivalent gate.
5. **Disable the cloud flow** (turn DocIndexSweep off in the portal —
   don't delete it; it's the rollback). Two writers on the same lists
   is the one configuration that must not happen. Record the handover
   in STATUS.

## 6. Deliberate deviations from flow v2.8

Each is behavior-equivalent; all are exercised by the gate:

- **Run-start list snapshots** replace per-doc `Check_*` GetItems
  queries (the cloud pattern existed because Logic Apps can't hold
  state). Loops were concurrency-1 and this process is the only
  writer during a run, so cache-then-create ≡ query-then-create.
  Corollary: the Graph read volume per run is six paged list fetches,
  not thousands of queries.
- **`mode: "final"`** without the flow's trailing space (RelatedRank
  treats any non-`shortlist` mode as final).
- **Recycle_old_sidecar → local delete** (OneDrive syncs the delete;
  the file still lands in the site recycle bin).
- The AI step is a different model on the same prompt text: Claude
  through the Anthropic API with schema-pinned JSON instead of the
  tenant's AI Builder model with brace-slice parsing (§3). A refusal
  stamps Skipped (the content-filter lane); any other bad output lands
  in the Error lane.
- **No XmlBuf** (vestigial in the flow).
- **List GUIDs live in config**, not hand-typed URIs — the FX-6
  failure class is gone; a list re-creation is a config edit.
- WorkbookDump reads the xlsx via `extract/runner/xlsx_grid.mjs` — the
  same content-equivalence caveat as the PAD offload
  (`docs/history/PAD_Setup.md` §7).
- **Oversize cap 50 MB** (deviation — the flow skipped anything over
  3.5 MB, a Power Automate payload limit that doesn't apply locally):
  tune with `sweep.oversizeBytes`. LLM input is still `textCap`-bound.
- **HTML indexes** (deviation — the flow always skipped it): the
  schema's reserved `htmltotext` lane is implemented locally
  (zero-dependency tag stripper).
- **Product/tool/topic documentation links** (additive deviation):
  sidecars carry a `## Product documentation` section — product-level
  links (from the detected `Products`), per-tool links, and per-topic
  links. Resolution per tool: the `tools` map in
  `pipeline/data/esri_doc_links.json` → **match against the crawled page
  inventory** (`pipeline/doc_crawl.mjs` writes
  `workDir/esri_doc_pages.json`; token match, product-tree aware) →
  a probed URL (`probeTemplates`, first HTTP 200, cached in
  `workDir/doc-links-cache.json`; `sweep.probeDocLinks: false`
  disables) → a `searchTemplate` search link. Topic keywords link
  only on a total inventory match (no search fallback). **Re-run
  `doc_crawl.mjs` when the docs site changes**; edit the JSON + git
  pull to deploy; `--rerank` refreshes every existing sidecar (tools
  and topics reconstructed from the doc's keyword junctions).
- **Richer relatedness** (a real deviation — additive): on top of the
  flow's keyword/edge relatedness, the sweep computes **body-text
  similarity** (BM25 cosine over the sidecar corpus, in-memory, no AI
  spend) plus filename-family and folder affinities, via RelatedRank
  v2.2's dormant optional fields. Docs above
  `sweep.relatedBodySimMin` (default 0.15) can relate with no shared
  keyword at all. Weights tune in `RelatedWeights`
  (`body`/`fname`/`folder` keys); related lists refresh gradually as
  docs reindex. Flow-shaped calls are byte-identical (no tenant paste;
  rollback unaffected).
- **Ghost reconciliation** (a real deviation — the flow let rows for
  deleted docs linger forever): after each full run, rows whose
  DocKey no longer matches any library file are set
  `IndexStatus: Archived` with a dated LastError note and their
  sidecar is pruned; archived docs leave the relatedness candidate
  pool, and a doc restored from the recycle bin re-indexes
  automatically. Safety rails: skipped on `--only` smoke runs and on
  an empty library listing; capped at `sweep.maxArchivesPerRun`
  (default 20) per run. **One-time tenant step**: add `Archived` to
  the Doc Index `IndexStatus` choice values (list settings → the
  IndexStatus column) — until it exists the sweep halts archiving
  with a log note and everything else runs normally. Doc Keywords /
  Doc Links junction rows for archived docs are left in place
  (harmless; their doc side is Archived).
- **PDFs are indexed** (a real deviation — the flow always skipped
  them): with Poppler's `pdftotext` present (§1), text-bearing PDFs
  go through the full pipeline with `ExtractionLane: plaintext`;
  scanned/no-text PDFs land in the Skip lane with that lane recorded
  as the "attempted" stamp so they don't rechurn. Rows stamped
  `Skipped` before the tool existed re-enter `Needs_index` once
  (the PDF rescue) and either index or re-stamp. No tool installed =
  flow-era behavior, with a log note.
- **Out-of-scope lane** (a real deviation — the flow could reach any
  file over the connector; local reads need the OneDrive sync): a doc
  outside `sharePoint.libraryRootSegment` gets a STAMPED `Skipped`
  row with `LastError` `"out of sync scope: ..."` — once, not a
  nightly Error. The status page counts them. To index those docs,
  widen the OneDrive sync; the stamp doubles as a rescue marker, so
  they re-index automatically on the first run where their file is
  reachable (no promptVersion bump, no corpus-wide AI respend). A
  doc IN scope whose file is missing on disk is treated as OneDrive
  sync lag: a retryable Error that clears itself when the file lands.
  A doc IN scope whose file is on disk but cannot be read (v1.64:
  `LastError` starts `source-read: source file exists but cannot be
  read (UNKNOWN: unknown error, read)`) is a Files On-Demand
  placeholder that did not hydrate — OneDrive paused, signed out or
  not running, or the folder set to "Free up space". In OneDrive mark
  the library "Always keep on this device"; the rows retry nightly
  and clear once the files read. The summary counts them
  (`unreadable_local`).
- **Content-filter lane** (v1.28): the model can refuse a document's
  own text (`stop_reason: refusal` — decks that quote
  model-instruction-like content trip it), and the refusal is
  deterministic, so an Error stamp would re-burn one AI call per
  night failing identically. Such a doc gets a STAMPED `Skipped` row
  with `LastError` `"content filter: ..."` at the current
  PromptVersion — once, no rechurn. It re-enters `Needs_index` on the
  next PromptVersion bump or when the source doc is edited
  (trimming the offending text and re-saving is the way to get the
  doc indexed).

## 7. Operations

- **Deploy** = the nightly self-update: the scheduled `.cmd` scripts
  fetch and fast-forward to the CI-promoted **`deploy` branch** (the
  harness workflow advances it from main only when every suite is
  green — a red main can never reach the nightly run). A manual
  `git merge --ff-only origin/deploy` deploys immediately. Record the
  commit in STATUS the way pastes were recorded. Prompt changes
  deploy the same way: the Doc Index stamp is `v<version>` of
  `prompts/docindex_classify.md`, so a classifier change is a
  version bump in that file and the nightly run backfills the corpus
  `maxDocsPerRun` at a time. `sweep.promptVersion` in config PINS an
  older stamp (the run says so on stderr) — remove it to let the
  backfill start.
- **Progress narration** (`pipeline/lib/progress.mjs`): every job —
  `sweep`, `curate`, `gantt`, `wiki`, `testplangen` — can narrate its
  run on **stderr**, one `progress: ...` line per phase, per document
  and per model call: the sign-in, each list snapshot and its row
  count, why each document was selected, every step inside it
  (`extract`, `llm`, `regex`, `upsert-row`, `sidecar`, `case-index`,
  `figure-index`, `doc-ids`, `keywords`, `related`, `neighbors`,
  `sidecar-patch`), how long the model took, the ghost pass, the
  browse pages, and a closing summary with the elapsed time. A wait
  with nothing to report beats every 30 s (`still waiting on the
  model — 60s elapsed`), so a hang is never mistaken for progress.
  **stdout is untouched** — the summary JSON, the `*_summary` line
  and the dry-run plan notes are byte-for-byte what they were, so
  anything parsing them keeps working.
  Default: **on at a console, off when output is redirected** (a
  scheduled task's log does not grow). Force it either way with
  `--progress` / `--no-progress` on any job, or set `"progress":
  true` (or `false`) at the top level of `config.json`. Add
  `--progress` to the `ops\*.cmd` line for a night that needs
  watching — the run log then explains where a stall happened. The
  narration reaches the model calls too: a narrating job sets
  `LRSDOC_PROGRESS` for `python -m lrsdoc`, which reports the request
  shape, the latency to the model's first streamed chunk, and the
  stop reason with token usage. `testplangen` keeps its own default
  (manual single-story runs narrate; `--auto` and `--gap-report` stay
  quiet unless a flag says otherwise).
- **Errors**: per-doc failures write `IndexStatus=Error` +
  `LastError="{step}: {detail}"` and retry next run — same recovery
  model as the flow. The summary JSON carries `errors`.
- **Alerts** (v1.32, optional): set `alerts.webhookUrl` (a Teams/
  Slack incoming-webhook URL, `{"$env": ...}` supported) and the
  sweep posts on a fatal abort and for docs stuck 3+ nights.
  Best-effort delivery — a down webhook never fails a run.
- **Dead-man check** (v1.32): register `ops\run_heartbeat.cmd` as a
  SECOND scheduled task (e.g. daily 09:00). It runs
  `sweep.mjs --check-heartbeat` — local stamp only, no sign-in — and
  alerts when no successful live sweep is recorded within
  `alerts.maxSilentHours` (48). This catches what the sweep cannot
  report itself: the task never firing, the machine off, auth dead.
- **List backups** (v1.32): every run gzips its run-start list
  snapshots to `workDir\list-backup-*.json.gz` (newest 14) — the
  restore source if the lists are ever re-created again
  (`sweep.exportLists: false` disables).
- **Browse pages + trends** (v1.34/v1.35): live runs rebuild
  `_Index.md` (root + per kind folder) and append a Recent-runs
  table to `_Sweep Status.md` (`sweep.indexPages: false` disables
  the former).
- **Sync-lag fallback** (v1.33, optional):
  `sweep.graphDownloadFallback: true` fetches an in-scope-but-
  unsynced source through Graph instead of erroring for the night.
  Since v1.64 it also covers a source that is on disk but unreadable
  (a OneDrive placeholder that did not hydrate).
- **OCR lane** (v1.36, optional): install Tesseract and Poppler's
  pdftoppm and set `sweep.tesseractPath`; image-only PDFs then index
  via OCR (lane `"ocr"`), and previously Skipped `plaintext`-lane
  PDFs rescue automatically. No PATH auto-detection — explicitly opt
  in.
- **msg lane** (v1.37): Outlook .msg files index automatically —
  nothing to enable; previously Skipped rows rescue on the next run.
- **Remote-files mode / hosted runner** (v1.39, optional):
  `sweep.remoteFiles: true` runs the whole sweep with NO OneDrive —
  see `docs/hosted-runner.md` for the mode's behavior, the
  disabled-by-default GitHub Actions nightly, and the two decisions
  (app auth; where tenant credentials live) that come first.
- **Rollback**: to a previous commit of this repository (`git
  checkout <tag>` on the machine, or move the `deploy` branch) — the
  cloud flow and its import packages are gone from the tree (they
  remain in git history, `docs/history.md` names the commit).
- **Spend**: zero Power Platform requests. Anthropic API tokens are
  consumed per document that needs indexing (§3).

## 8. Security

In the default device-auth mode the machine holds one provisioned
secret — the Anthropic API key in the user environment (§3) — plus
the cached refresh tokens under `paths.workDir\auth\` (0600; they act
as your signed-in session, so keep the folder inside the machine's
disk encryption and delete it when decommissioning; you can also
revoke sessions from your Microsoft account's security page). App
mode adds the Entra client secret, referenced from config as
`{"$env": ...}` and never written into it. Document text leaves the
tenant for the Anthropic API (§3); nothing else leaves it.

## 9. Weekly keyword curation (curate.mjs)

The KeywordCuration cloud flow (v1.1) as a local weekly job. Same
identities, the `keyword_curation` prompt through `lrsdoc` (§3),
same propose-then-approve contract: the
job NEVER writes CanonicalRef — a human approves by setting the
lookup, and the job clears the flow-owned columns
(CurationStatus/ProposedCanonical) on its next run. The digest
overwrites `Keyword_Curation_Digest.md` in the site's **Shared
Documents root** (outside the LRS Doc Index library so the Q&A agent
never ingests it) via a Graph drive upload — no extra sync needed.

Setup (after the sweep's §1–§4 — it reuses the same config, sign-in
and API key):

1. Smoke: `node --experimental-strip-types pipeline\curate.mjs --config config.json --dry-run`
   (plan only), then `--live` once and check the digest file + the
   Cur_summary line (`canon= blocked= proposed_by_model= written=
   dropped= cleared=`).
2. Schedule (Saturday 08:00):
   `schtasks /create /tn "LRS Keyword Curation" /xml C:\Repos\lrs-doc-index\ops\curation_task.xml /f`

**Optional — `curation.autoApprove: true`** trades the human gate
for convenience: guard-passing merges apply immediately (the job
sets CanonicalRef itself; pending proposals left from manual mode
apply on the next run), and the digest becomes an audit log. Undo a
wrong merge by clearing the row's CanonicalRef AND setting
CurationStatus = Rejected (blocks re-proposal). The guard still
drops anything not matching real, uncurated rows verbatim — but
nothing reviews semantic judgment before it lands; default is false.

A prompt change is an edit to `prompts/keyword_curation.md` with a
version bump (`prompts/README.md`); the digest header reports that
version (`curation.promptVersion` in config only pins another). The
reply is schema-pinned (`prompts/schemas/keyword_curation.json`);
everything else is action-for-action from the retired flow's
definition (`docs/history.md`, G2).

**What the model sees, and what the guard refuses** (curate v1.3,
2026-09-07). The vocabulary sent to the model is the canonical rows
that are NOT pending review: a row with `CurationStatus = Proposed`
is an alias in waiting and leaves the list entirely, so it can be
neither re-proposed nor — as happened when it was merely blocked as
an alias — made the canonical of the reverse pair. Rejected rows stay
in the vocabulary as canonicals and go on the DoNotPropose list. The
guard (`pipeline/lib/curationguard.mjs`) then drops, besides the
flow's verbatim checks, a canonical that is itself pending, a pair
whose `[kind]`s differ, and a merge in the wrong direction: the
plural, joined, hyphenated or abbreviated side is always the alias.
Every drop is named on stderr (`--progress`).

**Review by list.** The digest's contract is one row at a time in
SharePoint. For a long queue, export the Keywords list (Curation
queue view) to a spreadsheet, decide, and apply the verdicts from
files of row IDs (one per line, `#` comments allowed; dry-run by
default, `--live` writes):

- `curate.mjs --config config.json --withdraw <ids-file> --live`
  clears CurationStatus + ProposedCanonical on each listed pending
  row. The proposal never happened; the row is an ordinary candidate
  again. (Rejecting — `CurationStatus = Rejected` — is still by hand,
  and blocks the row for good.)
- `curate.mjs --config config.json --approve <ids-file> --live` sets
  CanonicalRef on each listed pending row to the canonical named in
  its ProposedCanonical, after re-running the guard against the live
  list: a real canonical, not itself an alias or pending, same kind,
  right direction. A row whose canonical is itself pending is skipped
  with a note — approve the far end first, and let the next run
  re-propose the near one against the final canonical. Skips are
  listed on stdout after the summary line; nothing else is touched.
  Withdraw before approving when the queue holds both directions of
  a pair.

Then `--repoint --live` and `sweep.mjs --rerank --live` as below.

**Undo, in bulk** (`pipeline/unmerge.mjs`): `--all | --modified
<YYYY-MM-DD> | --chains | --ids-file <path>` selects alias rows and
clears CanonicalRef (`--reject` also marks them Rejected so they are
never re-proposed). `--unreject` turns the same selectors on the
Rejected rows and clears that status instead — for a bulk `--reject`
that was too broad. Dry-run by default; run log
`work\unmerge-<stamp>.json`.

**`--repoint` — the librarian junction backfill** (2026-09-03, from
Curation_Setup's queued follow-ons): after approving merges (or an
autoApprove Saturday), run
`node --experimental-strip-types pipeline\curate.mjs --config config.json --repoint --live`
to re-point historical DocKeywords rows from merged aliases onto
their canonical (duplicates deleted, KWKey/Title recomposed), then
`sweep.mjs --rerank` to propagate the corrected keyword overlaps into
the related sections in one pass. Dry-run by default; a no-op pass
prints `repointed=0 deleted=0`. Requires
`sharePoint.lists.docKeywords` in config (already there for the
sweep).

## 10. Gantt schedules → Issue Refs (gantt.mjs — Flow #2)

The long-queued feeder for the (deliberately empty) Issue Refs list,
as an on-demand local job (`pipeline/gantt.mjs` v1.0 — details in
`docs/changelog/pipeline.md` "gantt v1.0"). Prerequisites: the sweep set up
(§1–§4; same config and sign-ins), and `sharePoint.lists.issueRefs`
added to config. The list GUID is owner-verified on the tenant
(2026-09-04): `4d0e6561-80e3-49f4-aa20-e5889cc88414` — it is in
`config.sample.json` and the `docs/sharepoint-notes.md` GUID
table (no flow ever referenced Issue Refs, so the live exports never
confirmed it; the owner's verification closed that gap).

1. Make sure the schedule workbooks are indexed (DocKind
   **Schedule**) and present in the synced source library.
2. Dry run:
   `node --experimental-strip-types pipeline\gantt.mjs --config config.json --dry-run`
   — review the plan (`issues_created= gantt_edges= titlematch_edges=`
   and the per-write detail in the `gantt-*.json` log).
3. `--live` (add `--only <schedule.xlsx>` for one workbook). Re-runs
   are idempotent (IssueKey + LinkKey dedup); a changed schedule
   updates its Issue Refs rows in place.
4. Record the first live run in STATUS. Run it after schedule
   uploads, or schedule it weekly beside curation if the cadence
   earns it — every run is pure list reads + local xlsx parsing, no
   AI spend.

RelatedRank already weights the minted `gantt` (60) and `titlematch`
(40) edges; related lists pick them up as docs reindex or on one
`sweep.mjs --rerank` pass.

## 11. Test-plan generation (testplangen.mjs)

The TestPlanGenCore cloud flow (v2.3) as an on-demand local job
(`pipeline/testplangen.mjs` v1.0 — design record
`docs/design/Local_TestPlanGen_Plan.md`, component record
`docs/changelog/testplangen.md` v2.16): draft a test plan from one indexed
**User Story** row, grounded strictly in that story with the
catalog's related documentation as reference. It delivers the entire
AUTHORED TestPlanGen state — prompt v1.7's coverage/granularity/
source-sweep rules, the v2.2 lane routing, the v2.3 budget
semantics — with zero tenant designer work, plus a verifier the
cloud flow could not have: every draft is checked against the v1.7
coverage contract (`pipeline/lib/draftlint.mjs`, the in-process port of
`tests/check_draft_coverage.py`) BEFORE it is written.
Read-only over every list; the only write is the timestamped draft
in **Shared Documents/Test Plan Drafts/** (outside the LRS Doc Index
library so the Q&A agent never ingests unreviewed drafts — the
curation-digest rule), via a Graph drive upload, never overwritten.
The §4 human review loop in `docs/history/TestPlanGen_Setup.md` is
unchanged and remains a REQUIRED control.

Setup (after the sweep's §1–§4 — same config, sign-ins, and synced
sidecar library; the sidecars ARE the retrieval source):

1. The model call is `prompts/testplan_draft.md` through `lrsdoc`
   (§3) — the same `llm.*` settings as the sweep; nothing to pick.
   `testplangen.maxTokens` (default 32000) bounds the reply; a
   token-truncated draft loses its END marker and fails CLOSED,
   loudly, naming the knob.
2. **Preview first (v1.10 — zero AI spend):**
   `node --experimental-strip-types pipeline\testplangen.mjs --config config.json --story <docId> --preview`
   runs everything a generation does up to the model call — the
   guard, the lookup, the pins, the remote mirror, every lane — then
   writes the five prompt inputs to workDir
   (`testplangen-preview-<stamp>.md`, one delimited block per input
   with its size) and stops. The summary line keeps the lane
   counters (`neighbors= exemplars= references= exChars= …`) and adds
   `inputChars= preview=1`. This is the first-run check on
   any machine: auth, config, the sidecar mapping, and the related
   routing are all proven before a credit is spent, and the inputs
   file shows exactly which exemplar/reference bodies the model
   would see — tune caps or pins on it, then generate. Manual runs
   only (not with `--auto`/`--gap-report`); `--help`
   prints the usage.
3. Dry run against a real story:
   `node --experimental-strip-types pipeline\testplangen.mjs --config config.json --story <docId> --dry-run`
   — instead of a Doc Index row id, `--issue <n>` (a devtopia issue
   number, `#`-prefix tolerated) or `--title "<words>"` resolve the
   story for you (v1.1 — StoryLookupFlow's deterministic queries
   in-process: issue via the Doc IDs list with
   `sharePoint.lists.docIds` in config, title by contains-match over
   indexed User Story titles). A bare number is ALWAYS a doc id —
   issue numbers need `--issue`, nothing is guessed (the v2.3 rule).
   Several matches print a capped candidate list and refuse; zero
   matches coach (an issue resolves only after the sweep has indexed
   the story and minted its Doc IDs row); generation is not invoked
   either way. Nothing uploads on a dry run; the would-be draft lands
   in workDir
   (`testplangen-draft-*.md`, lintable with
   `tests/check_draft_coverage.py`) and the summary line
   (`story= neighbors= exemplars= references= … verify=`) reads
   exactly like the flow's `Gen_summary`
   (`TestPlanGen_Setup.md` §3 G13; `neighbors=0` on a story with
   plain peers means its sidecar's `related:` line is stale — let
   the nightly backfill converge, or reindex the story).
4. `--live` writes the draft to
   `Shared Documents/Test Plan Drafts/<story stem>--draft-<yyyymmdd-hhmmss>.md`
   (the story sidecar's stem, v2.30; seconds since v1.10 so two runs
   on one story inside a minute never overwrite each other — drafts
   stack by design, §4 housekeeping deletes them).
   Review per `TestPlanGen_Setup.md` §4 (start from the Coverage
   Map — and from the draft's own `[!IMPORTANT]` verifier block when
   one is present), finalize, upload to the source library; the
   nightly sweep closes the loop.

**`testplangen.verify`** — the verifier policy: `"annotate"`
(default) writes a draft that fails verification WITH a
`> [!IMPORTANT]` findings block under the banner, so the reviewer
starts where the machine already found smells; `"strict"` refuses to
write such a draft at all (exit nonzero, findings on stderr — meant
for unattended runs, phase 3); `"off"` gives byte-parity with the
cloud flow's behavior. The verifier never edits draft content —
annotate or refuse, whole-draft. Two layers feed it: the CONTRACT
lint (phase 1 — the v1.7 draft-shape/coverage asserts, no
ambiguity) and, since v1.1, the GROUNDING spot-checks (phase 2,
`"grounding: "`-prefixed heuristics that hold the draft against the
story it was sent): every Coverage Map requirement must trace to a
story statement (quoted span or stem overlap), tool-shaped names in
Steps / Expected Result lines must appear in the story (the prompt's
tools rule made checkable — deliberately with NO reference-document
exception, since the prompt admits no tool names from references;
since draftlint v1.5 the one exception is a method NAME the draft
declares on its Setup `**Methods:**` line AND a source lane carries —
prompt v1.13's METHOD NAMES rule — while a declared name no source
carries is its own finding),
and every item of a 3+-item enumeration in a workflow-shaped story
sentence must be mentioned somewhere in the draft; since draftlint
v1.2, every case's **Trace:** line must cite the story (prompt
v1.9's story-first rule), and since v1.3, every markdown image link
in the draft must appear in the story sidecar VERBATIM (prompt
v1.10's FIGURES rule — a case may close with a `**Figure:**` line
carrying a story diagram's link; the job then rewrites cited
`../media/` links to absolute site URLs after verification so the
figures render from the drafts folder, and `figures=` in
Gen_summary counts the rewrites). The heuristics
WILL flag some legitimate paraphrases — that is exactly why annotate
is the default and strict is reserved for unattended runs;
`testplangen.grounding: false` disables just this layer.

**`--exemplar <docId>` / `--reference <docId>|<https-url>` — pinned
lanes** (v1.4): pin documents into the prompt's lanes IN ADDITION to
the sidecar's `related:` selection, for the run where the best
exemplar or reference is not RelatedRank-linked to the story (e.g. a
data-rich plan from another surface as the style exemplar). Both
flags are repeatable (comma-separated ids accepted) and take Doc
Index row ids — no issue/title resolution on pins, the v2.3
bare-number rule. Pinned docs fill their lane first, in the order
given; the automatic routing fills any remaining slots and skips
docs already pinned; pins may exceed the slot counts (a human
choice beats the slot default) while the character caps stay the
hard budget, pins served first. Guards are HARD and refuse BEFORE
the model call — a human asked for these exact documents, so the
lanes' silent-degrade posture for automatic picks does not apply:
the row must exist, be Indexed with its sidecar present in the
synced library, and not be the story itself or in both lanes;
`--exemplar` takes Test Plans (any surface — a deliberate human
override of the same-surface routing, style/coverage only under
the prompt's exemplar rules), `--reference` takes Test Plans and
Design Spikes. Provenance: the draft banner's HTML comment carries
the pinned ids, and `Gen_summary` gains `pinnedEx=`/`pinnedRef=`.
Manual runs only — refused with `--auto` and `--gap-report` (those
modes work from catalog state alone).

Since v1.7 `--reference` ALSO takes an **http(s) URL** — a
hyperlink to official product documentation (e.g. an ArcGIS Pro
tool-reference page) pinned into the REFERENCE FUNCTIONALITY lane
beside the catalog's own documents:

```
node --experimental-strip-types pipeline\testplangen.mjs --config config.json ^
  --story 12 --reference "https://pro.arcgis.com/en/pro-app/latest/tool-reference/location-referencing/enable-referent-fields.htm" --live
```

One URL per flag occurrence (URLs may contain commas, so they are
never comma-split); ids and URLs mix freely across repeats. The page
is fetched up front (`testplangen.webRefTimeoutMs`, default 30000)
under the same hard-guard posture — a fetch failure, a non-text
reply, or a page with no readable text (a script-rendered SPA)
refuses the run BEFORE any model spend; the fix for an unfetchable
page is to save it as a document, upload it to the source library,
and pin its row. The HTML is reduced to plain text by a
zero-dependency tag strip (scripts/styles/nav dropped, headings and
list markers kept, entities decoded) and injected with a
`--- REFERENCE: <page title> — surface web documentation <url> ---`
header, so the prompt's existing reference rules apply unchanged —
behavior may ground on the page with the Trace citing it by title,
the surface-parity [VERIFY] fires naturally, and tool names still
never carry over (the prompt text is untouched: still v1.10, no
TestPlanGenPromptVersion bump). Because a public page is the lane's
only internet input, marker-shaped text in it is defanged before
injection. `--exemplar` never takes a URL — a web page is not a
style/coverage exemplar. Provenance: the banner comment carries the
pinned URLs, `Gen_summary` gains `webRefs=`, and the written draft
ends with a deterministic `## Reference Documentation` addendum
(machine-minted after verification, the Issue Trace precedent)
hyperlinking each pinned page for the §4 reviewer.

**Progress output** (v1.5): a manual single-story run prints stderr
`progress:` lines — snapshot size, story/lane sizes with pinned ids,
"calling the model" with the input size, a 30-second heartbeat while
the one model call is in flight, the reply size/elapsed, and the
verifier verdict — so an auth wait, a long generation, and a retry
storm are distinguishable at a glance (`llm.mjs` v1.5 additionally
prints one line per backoff retry, e.g. `llm: retry 2/4 in 4s — AI
Builder 408`). stdout keeps the JSON + `Gen_summary` contract; the
auto and gap-report modes stay quiet for their task logs. A run with
NO progress line moving and no retry lines is waiting on
authentication — scroll up for a device-code prompt. Since `llm.mjs`
v1.6 the anthropic generation call STREAMS, so a long generation is
safe at any length: `llm.timeoutMs` is the max silent gap between
chunks (default 300000), not a total-call ceiling, and Node's own
5-minute silent-connection default can no longer kill a slow draft.

**`testplangen.notify`** (or `--notify` per run) — posts ONE line to
`alerts.webhookUrl` (the sweep's §7 alerts webhook) when a draft is
actually WRITTEN: story id/title, the draft's URL, and the
`Gen_summary` line. Default off — whoever runs a manual generation
is already watching; dry runs never notify (nothing was written),
and delivery is best-effort (a down webhook never fails a run).
The automatic mode below forces it on.

**`--auto` — unattended gap-drafting** (v1.2, phase 3): after the
nightly sweep, draft for freshly indexed User Stories that nothing
in the catalog covers. Candidates are Indexed User Story rows first
indexed (row creation time) within `autoLookbackDays` (7); a story
is a GAP when its sidecar's `related:` line carries no Test Plan
AND no Doc Links edge ties it to one (needs
`sharePoint.lists.docLinks` in config — already there for the
sweep). Guard rails, all forced or built in:

- **Owner switch**: `testplangen.autoDraft: true` — without it the
  run (and the scheduled task) refuses in one line and drafts
  nothing.
- **Budget**: `autoMaxPerRun` (3) caps model calls per run; further
  gap stories defer to the next night (`deferred=` in the summary).
- **Idempotency**: a story with ANY existing `<stem>--draft-*.md`
  file (or a legacy `TestPlanDraft__doc{ID}__*` one) in the drafts
  folder is skipped —
  deleting the draft after finalize (§4 housekeeping) is what
  re-arms auto-drafting for that story; `--force` disables the skip
  for one run.
- **Unattended posture**: verify is forced to `strict` (a draft
  with verifier findings is NOT written — the findings go to the
  run log and the webhook, and the story retries next night under
  the budget) and notify is forced ON, so every landed draft and
  every refusal reaches the webhook.
- **Dry runs are selection-only**: `--auto --dry-run` reports what
  would draft and makes ZERO model calls — deliberately unlike a
  single-story dry run, which generates a local draft to read; an
  unattended plan must be free. A failed story never kills the
  run: it is counted (`errors=`), alerted, and the exit code goes
  nonzero after every candidate got its chance.

**`## Issue Trace`** (v1.3): every generated draft ends with a
deterministic table of the story's devtopia issues — its Doc IDs
rows, enriched with the matching Issue Refs rows once `gantt.mjs`
feeds them (issue title, iteration, schedule status). Minted by the
job from list rows, never by the model, appended AFTER verification
(the verifier only ever judges the model's draft), and omitted when
the story carries no issue rows. Needs nothing beyond the sweep's
config; `sharePoint.lists.issueRefs` enriches it and
`testplangen.issueTrace: false` turns it off. `issues=` in
`Gen_summary` reports the row count.

**`--gap-report`** (v1.3): the whole-catalog counterpart of the auto
mode's lookback scan, with no AI spend and no drafting — every
Indexed User Story with NO covering Test Plan, each with its issue
keys and sidecar link, written as a FIXED-NAME digest
(`TestPlan_Gap_Report.md`, overwritten per run, explicit empty
state) into the Shared Documents root — outside the LRS Doc Index
library, so the Q&A agent never ingests it (the curation-digest
rule). Run it on demand or weekly beside curation; dry runs leave
the report in workDir. It answers "what would auto mode eventually
reach" and doubles as the PE's backlog view.

**docx handoff** (v1.3): after the §4 review, convert the reviewed
draft to Word without retyping —
`node local\draft2docx.mjs "<draft>.md"` (zero dependencies) writes
a sibling .docx with real heading styles, Word tables, checkbox
task lists, and the machine banner/verify comments dropped. The
output is an unstyled fresh document: apply the team template on
top; what it saves is the transcription, not the branding. Gate:
`tests/check_draft2docx.py` (CI).

**pptx review deck** (v2.23): for walking the §4 review as slides —
`node local\draft2pptx.mjs "<draft>.md"` (zero dependencies) writes
a sibling .pptx: title + at-a-glance slides, one slide per TC case
(steps checklist, Expected Result and Trace cards, `[VERIFY:` flags
in amber), Coverage Map and Issue Trace as native editable tables,
all on the Diagram Style Framework palette so svg2pptx figure
slides drop in beside it. Since v1.1, add
`--media "<synced library>\media"` (the LRS Doc Index library's
media folder) and each case's cited `**Figure:**` diagram (prompt
v1.10) renders as a figure slide directly after the case — the same
native, editable shape group svg2pptx emits; without the flag the
deck still converts and the case slide carries a muted
"Figure: … (not embedded)" note. The docx stays the document of
record; the deck is the review surface. Gate:
`tests/check_draft2pptx.py` (CI).

Schedule it: register a daily task for `ops\run_testplangen.cmd`
offset AFTER the nightly sweep (e.g. 18:30 — the sweep fires 17:00
Mountain), e.g.
`schtasks /create /tn "LRS Test Plan Auto Draft" /tr C:\Repos\lrs-doc-index\ops\run_testplangen.cmd /sc daily /st 18:30`.
The wrapper self-updates from `deploy` and logs to
`work\testplangen-task.log`, like the sweep and curation tasks. It
stays inert until `autoDraft` is set, so registering it early costs
nothing. Auto summary reading: `covered=` should dominate over time
(most stories get plans through the normal loop); a growing
`deferred=` means the budget is too tight; `refused=` entries are
the verifier holding the strict line — read the webhook findings
and either fix the story's sidecar/coverage or draft that story
manually with `--verify annotate`.

Knobs (`testplangen` in config, defaults in parentheses) mirror the
flow's `Config_gen` name-for-name — storyCap (45000), exemplarCap
(20000), referenceCap (12000), neighborCap (5), digestSummaryCap
(400), exemplarSlots (2), referenceSlots (3), promptVersion (v1.9,
the banner stamp; NEVER `Config.PromptVersion`) — plus draftFolder
(`/Test Plan Drafts`, drive-root-relative), verify (annotate),
grounding (true), notify (false), maxTokens (32000), caseIndex (true — the Test Cases
lane below), autoDraft (false), autoMaxPerRun
(3), autoLookbackDays (7), dryRun (true). Deliberate deviations from the
flow, all bounded: one run-start Doc Index snapshot replaces the
per-item Get calls; the G6 fallback orders by SourceModified where
the flow orders by list Modified (same newest-first intent); a story
sidecar missing from the synced library is a hard error naming the
sync, not a silent degrade.

**`--figures` — generated figures** (v1.11, `docs/changelog/testplangen.md`
v2.32; or `testplangen.figures: true`): one more model call after
the draft is verified. `prompts/testplan_figures.md` reads the
draft, selects the cases a schematic would help (measure geometry,
state change, topology, temporality, interaction; UI/validation-only
cases, variants, story-figure duplicates and anything ungrounded are
excluded; at most `testplangen.figuresCap` — 6 by default, the prompt's
FiguresCap input since v1.18, raise it for a long plan together with
`figuresMaxTokens` at roughly 1.5k tokens per spec; the pass also
enforces it after the grounding check) and emits a figure SPEC per case — the model
never draws. `pipeline/lib/figurespec.mjs` checks every spec against
the case's own section and the Setup tables (every id a whole word
there, every measure a value there and inside its route's range, a
closed vocabulary of kinds/tones/marks) and DROPS any that fails,
then renders the survivors to SVG in the SlideFigures palette as the
draft's siblings (`<draft stem>--fig-<case>.svg`; dry runs write
them beside the local copy; since figurespec v1.1 / prompt v0.3 a
route may ask for intermediate `ticks`, every event's ends carry
their measures, and labels are placed collision-free; since v1.2 all
panels share one measure scale and each panel shows the previous
panel's extents that changed as dotted ghosts with a legend key) linked from a `## Generated Figures`
addendum with caption, rule, the dropped specs' findings and the
model's not-illustrated list. The draft body is untouched; the pass
fails soft (a bad reply skips it, the draft still lands —
`genFigures=<rendered>/<proposed>` in the summary, every spec in the
run log). `prompts/testplan_figures.md` through `lrsdoc`
(`figuresMaxTokens`, 24000 since v1.15 — the pass reads THIS knob,
never `maxTokens`; a cut reply says so, and with `--stream` the
thinking summary shares the cap). Manual runs only. To put the SVGs on
slides today, run `svg2pptx.mjs` on them; draft2pptx's `--media`
still renders story `**Figure:**` lines only — or add `--deck`
(next), which embeds them from memory.

**`--deck` — the review deck laid out by the model** (v1.16,
`docs/changelog/testplangen.md` v2.36; or `testplangen.deck: true`): one
more model call over the FINISHED draft (addenda and figures
included). `prompts/testplan_deck.md` makes the deck's LAYOUT
DECISIONS — which of thirteen design-system patterns each slide
takes (title, section, stats, bullets, checklist, two-column, cards,
comparison, table, flow, figure, statement, closing), what goes in
which region, how cases group, what earns a divider, a quoted
requirement or a step flow, and the presenter notes — as a deck
SPEC. It never chooses a size, a gap or a colour: those are
`pipeline/lib/designsystem.mjs`'s (Microsoft's Fluent 2 tokens, MIT —
type ramp, spacing, radii, colour roles — on a 12-column grid), and
it never writes body content: every item, card, cell and statement
is copied verbatim from the draft or pulled through a `from`
reference, and `pipeline/lib/deckspec.mjs` DROPS any slide that says
something the draft does not (the dropped slides and their findings
are listed in the draft's `## Review Deck` addendum).
`pipeline/render/deck2pptx.mjs` then renders native, editable PowerPoint objects —
text, cards, chips, checkboxes, tables, chevron flows, and every
story or generated figure as the same shape group svg2pptx emits —
to `<draft stem>--deck.pptx` beside the draft, with the spec as
`<draft stem>--deck.json` (dry runs: beside the local copy). The
spec is a text file: edit it (reorder, regroup, change a pattern,
fix a note) and re-render without a model call —
`node local\deck2pptx.mjs "<draft>.md" --spec "<draft>--deck.json" --media "<synced library>\media" --figures <folder holding the --fig SVGs>`;
`node local\deck2pptx.mjs "<draft>.md" --generate --config config.json`
makes the call standalone for a draft that already exists. Fail soft
(a bad reply skips the pass, the draft still lands —
`deck=<slides>/<proposed>` in the summary); `deckMaxTokens` (24000)
bounds the reply. Manual runs only. Gates: `tests/check_deckspec.py` (fixture-free) and
`check_deck2pptx.py` (python-pptx), both in CI. The rule-built
`draft2pptx.mjs` deck stays as the zero-model-call fallback.

**Design systems and themes** (v1.17, `docs/changelog/testplangen.md` v2.37):
`testplangen.deckDesign` picks the system the deck is laid out on —
`fluent` (default; Microsoft Fluent 2, MIT; Segoe UI), `carbon` (IBM
Carbon, Apache 2.0; IBM Plex Sans — denser, square surfaces, the
table-friendly one) or `uswds` (U.S. Web Design System, public
domain; Source Sans Pro — the most readable) — and `deckTheme` its
`light` (default) or `dark` theme. The spec is design-independent,
so one `--deck.json` renders on any of them:
`node local\deck2pptx.mjs "<draft>.md" --spec "<draft>--deck.json" --design carbon --theme dark --media "<synced library>\media"`.
Every embedded figure — story, generated, inline — is re-coloured
into the chosen design + theme before it becomes a shape group, so
the diagrams never show a seam (the SVG files, the sidecars and the
sweep are untouched; on fluent / light nothing changes). Two things
to know: Plex and Source Sans Pro are not on a typical Windows machine —
install them on the reviewers' PCs or embed them in the file, or
PowerPoint substitutes — and USWDS publishes no dark theme, so its
dark deck uses the system's own darkest base steps (named in
`lib/designsystem.mjs`). An unknown design or theme name refuses the
run before any model spend. Every token value is verified against the
published packages by `tests/check_design_tokens.py --all`
(manual, needs the npm registry; v2.42) — run it after editing a
token block.

**Related cases — the retrieval lane** (v1.14, prompt v1.11,
`docs/changelog/testplangen.md` v2.34): with §12's Test Cases list in
config, the catalog's test PLANS are ranked against the story (a
rarity-weighted query from its tools, keywords and title; a plan's
terms are its title plus its cases' tags; same-surface and deep plans
edge ahead) and the top `relatedCasesPlans` (5) from OUTSIDE the
exemplar/reference lanes each send their `relatedCasesPerPlan` (3)
best-matching cases with section text plus an index of their other
case titles, as the prompt's sixth input, RELATED CASES. The prompt sweeps them like exemplar
cases, and its VARIATION clause lets a related case that varies an
input of a story-stated behavior (a spanning event, another referent
method) become a parameterized case rather than a [VERIFY] item — a
behavior the story never states still lands in Open Questions. This
is how the team's existing coverage of a feature area reaches a
draft without anyone curating a list: the nightly sweep's index is
the source. `relatedCases=`/`relatedPlans=`/`relCaseChars=` in the summary; the
progress line names the plans drawn from with their relevance;
`--preview` shows the block. `testplangen.relatedCases: false` (or no list) = "(none)".
The prompt file carries the `RelatedCases` input since 1.11.0.

**`--stream` — watch the model work** (v1.12, `docs/changelog/testplangen.md`
v2.33; or `testplangen.stream: true`): on the anthropic lane a manual
run echoes the model's output to stderr as it streams — first its
THINKING SUMMARY (the request asks the API for
`display: "summarized"`; the raw chain of thought is never returned,
the summary is what exists, and thinking is billed the same whether
shown or not), then the reply — for the draft call and the figures
call, each under a `--- draft: model thinking ---` /
`--- draft: model reply ---` rule and closed with the char count. The
heartbeat stays silent while a stream echoes; a transport retry
prints a `[stream restarted]` rule because the partial output is
discarded exactly as the marker slice would discard it. stdout's
JSON + `Gen_summary` and the written draft are unchanged — the
fail-closed slice still runs on the complete reply. Manual runs only.

**No OneDrive on this machine?** (v1.10) Set `sweep.remoteFiles:
true` — the sweep's v1.39 remote-files mode (§7, `docs/hosted-runner.md`)
— and the run mirrors the sidecar library down into
`paths.sidecarLibrary` at start through the same `RemoteLibrary` the
sweep uses, sharing its eTag manifest (`workDir/mirror-manifest.json`),
so a run after the nightly sweep downloads nothing and the lanes are
byte-identical to a synced-folder run (`remote mirror: N sidecar
file(s), M downloaded` on stderr). Lists stay read-only; the drafts
folder write is unchanged. Without the flag, an empty workspace
refuses with the sidecar-not-found message, which now names this
switch.

**The Test Cases lane** (v1.9, `docs/changelog/testplangen.md` v2.30) —
once §12's list GUID is in config, the sweep's per-case index feeds
generation three ways, all deterministic and read-only, no prompt
change: plans whose indexed cases cite one of the story's devtopia
issue ids fill the lane slots the related routing left open
(same-surface as exemplars, others as reference functionality)
ahead of the G6 fallback — `caseRouted=` in the summary, the ids in
the banner comment; an exemplar plan that overflows `exemplarCap`
is trimmed WHOLE cases at a time, the cases most relevant to the
story kept in document order (issue-citing first, then shared
Tools / Keywords tags from the case rows) with an omission line —
`caseTrim=` and `exCases=<shown>/<parsed>`; and every draft ends
with the deterministic `## Existing Test Cases` addendum listing
the indexed cases that already cite the story's issues, each
deep-linking its sidecar section — `existingCases=`. Reading the
summary: `caseRouted>0` on a story with `neighbors=0` means the
case index found what RelatedRank had not yet linked; a large
`existingCases=` is the dedupe list to read FIRST in the §4 review.
`testplangen.caseIndex: false` turns the lane off; absent list =
off; either way the draft is the pre-v1.9 one. Prompt promotion stays the
`TestPlanGenPromptVersion` paste path (`docs/changelog/testplangen.md`) —
every job picks a changed prompt file up on its next run.

## 12. Test-case indexing (caseindex — the Test Cases list)

Individual test cases out of each indexed test plan, as rows in a
seventh list — design record and phased build order in
`docs/design/Case_Index_Plan.md`. Shipped: the deterministic parser
(`pipeline/lib/caseindex.mjs` — deck-derived `## Case N` sections and
draft-style `### TC-P/TC-N` headings, per-case issue references,
replace-set planner) under its own CI gate
(`tests/check_caseindex.py`), the sweep wiring (sweep
v1.42): documents of the configured kinds sync their case rows at
index time and on `--reformat`, ghost reconciliation prunes an
archived doc's rows, and `--recase` backfills the whole corpus from
the sidecars on disk — and the consumers (sweep v1.43 / TestPlanGen
v2.29): live runs rebuild **"_Case Catalog.md"** at the library root
(every case grouped by plan, anchor deep links; the Q&A agent
grounds on it automatically), `testplangen.mjs --gap-report`
traces story issue ids against the case rows, surfacing stories
covered by adjacency only, and — since testplangen.mjs v1.9 — the
generator itself routes case-traced plans into its lanes, trims
overflowing exemplars case-wise, and appends the `## Existing Test
Cases` addendum (§11, "The Test Cases lane").

Setup, once:

1. Create the **Test Cases** list on lrsworkspace per
   `schemas/SPList_TestCases.csv`. The `Document` lookup targets Doc
   Index and MUST be created via CLASSIC list settings (the standing
   modern-lookup quirk: silent write drops, spinning pickers).
   DONE 2026-09-05 — the live list's GUID is
   `ae9374ab-295a-4321-8afa-a83a08e17711` (recorded in
   `config.sample.json` with the other six).
2. Carry the GUID into the sweep machine's `config.json` as
   `sharePoint.lists.testCases` (copy the line from the sample).
   Absent or empty GUID = feature off: the sweep prints one loud
   note and indexes documents normally — a case-write failure never
   fails the document row.
3. Knobs under `sweep.caseIndex`: `kinds` (default
   `["Test Plan"]` — which DocKinds get case rows) and `caseTextCap`
   (4000 — the per-case skim-text bound).
4. Backfill: `node sweep.mjs --config config.json --recase --live`
   (dry-run default prints the planned create/update/delete counts;
   no AI spend, no re-extraction, no sidecar writes). The nightly
   sweep keeps the list converged after that.
5. **caseindex v1.1–v1.4 columns** (2026-09-05, after the first
   live backfill): add the ELEVEN metadata columns to the live list
   per the updated `schemas/SPList_TestCases.csv` — `Shape` (Choice:
   `deck; draft`), `FigureCount`/`TableCount`/`StepCount` (Number,
   0 decimals), `RouteRefs`/`ExpectedResult`/`TraceText`/`Tools`/
   `Keywords` (Single line of text), `FigureLinks` (Multiple lines
   of text, PLAIN), `FigureLink` (Hyperlink — the clickable primary
   figure). Modern list settings are fine here — none are
   lookups. Then run `--recase --live` once to reflow (the
   CaseIndexVersion convention). Order matters: add the columns
   BEFORE the sweep machine picks up the v1.1+ code, or case writes
   fail loudly into `case_errors` until they exist (documents still
   index normally). `Tools`/`Keywords` fill from the curated
   Keywords vocabulary (tool → Tools, topic/product → Keywords;
   plan title included in the scan; rarest-first ordering from the
   DocKeywords junction counts), so each weekly curation merge
   sharpens them on the next reflow; `FigureLinks` opens a case's
   own diagrams straight from its row.

Case rows are a REPLACE-SET per document (`CaseKey =
{docRowId}|{ordinal}`): every (re)index of a plan rewrites its full
set, archived docs delete theirs, and nothing else in the pipeline
may hold a Test Cases row id — the rows are derived state, safe to
delete wholesale and rebuild with `--recase`.

## 13. Sidecar format 3.0 rollout (Sidecar_Format_Plan phases 0–5)

The review in `Sidecar_Format_Plan.md` shipped as sweep v1.47–v1.53.
Before the first nightly run on the new code:

1. **Tenant** — Test Cases list: add `Confidence` (Choice: high;
   medium; low; llm), `Group` (text), `SourceRef` (text); extend
   `Shape`'s choices to S1; S2; S3; S4; S5; S6; LLM; draft; deck
   (`schemas/SPList_TestCases.csv`).
2. `node pipeline/sweep.mjs --config config.json --reformat --live`
   — every sidecar rewrites once: the metadata table (no yaml block),
   the v2.5 re-extraction, the case grammar on test plans, the story
   profile on stories. No AI spend. Byte-idempotent on a second run.
3. `--rename-plan` (read the old → new table, nothing touched) then
   `--rename --live` (files, media/<stem>/, every inbound link,
   TextFileUrl, browse pages, `_Manifest.json`), then
   `--recase --live` so Test Cases anchors and figure links follow
   (and `--refigure --live` once the Figures list exists — §14).
4. `--case-audit --live` and read `_Case Audit.md`. Optionally set
   `sweep.normalizeCases.enabled: true` and run
   `--normalize-cases --live` in batches (`maxPerRun`); LLM-shaped rows
   show as `LLM · llm` in `_Case Catalog.md`.
5. Paste `docs/qa-agent-instructions.md` and re-run the smoke
   questions.

Config knobs added: `sweep.slugAbbreviations` (extend the shipped
`pipeline/data/slug_abbreviations.json`), `sweep.storyProfile` (default on),
`sweep.normalizeCases` (see `config.sample.json`).

## 14. Figure indexing + standardized figure names (figureindex — the Figures list)

Every indexed document's figures — pasted pictures in `media/<stem>/`
and drawn diagrams ZipTextExtract collapsed into `[figure: …]` label
lines — as rows in an eighth list, plus the standardized media file
names `fig-NN[-slide-KK][-<slug>].<ext>` (design record:
`docs/design/Figure_Index_Plan.md`). Shipped (sweep v1.59): the pure
module `pipeline/lib/figureindex.mjs` (naming rule, body parser,
replace-set planner) under its own CI gate
(`tests/check_figureindex.py`), the sweep wiring (documents
sync their figure rows at index time, on `--reformat` and on
`--normalize-cases`; ghost reconciliation prunes an archived doc's
rows; `--refigure` backfills the whole corpus from the sidecars on
disk), the naming on both the index and reformat paths (a reformat
MOVES a document's archive-named files to their standardized names
and relinks the body — no re-extraction), and the consumer: live runs
rebuild **"_Figure Catalog.md"** at the library root (every figure
grouped by document, picture + section deep links; the Q&A agent
grounds on it automatically).

Setup, once:

1. Create the **Figures** list on lrsworkspace per
   `schemas/SPList_Figures.csv`. The `Document` lookup targets Doc
   Index and MUST be created via CLASSIC list settings (the standing
   modern-lookup quirk). `ImageLink` is a Hyperlink column (written
   through the SPO route like `FigureLink`); everything else is
   modern-settings-safe.
2. Carry the GUID into the sweep machine's `config.json` as
   `sharePoint.lists.figures`. Absent or empty GUID = feature off:
   the sweep prints one loud note and indexes documents normally — a
   figure-write failure never fails the document row. (The
   standardized NAMES do not depend on the list: they apply from
   v1.59 on regardless.)
3. Knobs under `sweep.figureIndex`: `kinds` (default `[]` = every
   DocKind gets figure rows; list kinds to narrow) and `contextCap`
   (2000 — the per-figure skim-text bound).
4. Rename the corpus's media once:
   `node sweep.mjs --config config.json --reformat --live` (the same
   pass §13 step 2 needs; counter `media_renamed` reports the files
   moved; byte-idempotent on a second run). A corpus already on the
   standardized names is untouched.
5. Backfill: `node sweep.mjs --config config.json --refigure --live`
   (dry-run default prints the planned create/update/delete counts;
   no AI spend, no re-extraction, no sidecar writes). Run it AFTER
   step 4 so rows carry the standardized names, again after any
   `--rename --live` (ImageUrl carries the stem), and after any
   figureindex.mjs parser bump (FigureIndexVersion). The nightly
   sweep keeps the list converged after that.
6. **figureindex v1.1 (sweep v1.60, after the first live export):**
   add `icon` to the `Kind` choices, then `--reformat --live` (untitled
   slides' pictures take a first-line slug; files under the v1.59
   names move by prefix) and `--refigure --live` once.
7. **Drawn shapes and text (sweep v1.61, ShapeExtract v1.0):** add
   `drawing` to the `Kind` choices, then `--reformat --live` (every
   pptx gains one SVG per drawing slide in `media/<stem>/` plus a
   `[connections: …]` line under the slide; no AI) and
   `--refigure --live` once. `sweep.drawings: false` turns the lane
   off. Drawings are regenerated on every reformat and only written
   when their bytes change.
8. **If a backfill reports `SPO ValidateUpdateListItem 429`** (sweep
   v1.62): SharePoint throttled the hyperlink route. The client now
   waits out `Retry-After` and paces itself; simply re-run the same
   `--refigure --live` / `--recase --live` — rows already written cost
   nothing, only the documents that errored are written. If it keeps
   happening, raise `spo.paceMs` (e.g. 500) in `config.json`.
9. **casegrammar v1.2 / ZipTextExtract v2.6 (sweep v1.63):** run
   `--reformat --live` (diagram-topped decks re-extract with the real
   case line, not a route label, as the slide heading) and then
   `--recase --live` (pdf plans re-render on page units; sub-case
   numbers, group labels and colon case lines apply corpus-wide).
   No tenant step, no AI spend. A `NORMALIZE SKIP … > maxInputChars`
   on a numbered-case plan is now expected to be unnecessary — check
   the plan's `## Test Cases` after the recase before raising the cap.
10. **If a run ends with most documents at
    `ziptext-pptx: UNKNOWN: unknown error, read`** (pre-v1.64) or
    `source-read: source file exists but cannot be read` (sweep
    v1.64): the OneDrive Files On-Demand placeholders did not hydrate.
    Open OneDrive on the sweep machine, right-click the synced library
    folder → **Always keep on this device**, wait for the hydration to
    finish, and let the nightly run retry the Error rows — or set
    `sweep.graphDownloadFallback: true` and let the fallback fetch
    them through Graph. Nothing to reset in the lists.

A column the tenant list lacks is dropped from the write and noted
once per run (`figure_fields_dropped`; the v1.56 fail-soft, shared
with the Test Cases list) — add it per the CSV and run `--refigure
--live` once. Figure rows are a REPLACE-SET per document (`FigureKey
= {docRowId}|{ordinal}`): derived state, safe to delete wholesale and
rebuild with `--refigure`.

## 15. The catalog as a wiki (wiki.mjs)

`pipeline/wiki.mjs` renders every sidecar into an MkDocs site — one
page per document (the metadata table with its values linked into
catalogs, the summary, the related documents as page links, the
extracted body with its media), catalogs by kind, keyword (after
curation's merges), tool, product, release, person and issue, the
test cases and figures with anchors into the pages, a Recent page —
and pushes the tree to a git repository whose Pages workflow builds
and serves it. It reads only files: `paths.sidecarLibrary` (the
synced folder or the remote-files mirror) and the newest
`list-backup-*.json.gz` the sweep leaves in `paths.workDir` (for the
keyword canonical map and kinds). No SharePoint call, no model call.

**Where it lives.** This repository is public (the PV-1 decision), so
the wiki cannot be its GitHub wiki or Pages site. It lives in a
PRIVATE repository on devtopia —
`https://devtopia.esri.com/kev14953/lrs-docs` — with Pages turned on
there once. The generated tree carries its own `pages.yml` workflow
(`pip install mkdocs-material`, `mkdocs build --strict`, deploy), so
every push publishes. Three config keys shape that workflow, because
devtopia is GitHub Enterprise Server, not github.com:

- `runsOn` (default `ubuntu-latest`): GHES has no hosted runners, so
  the job waits forever for one — register a self-hosted runner on
  the sweep machine (Settings → Actions → Runners → New, as the user
  that owns the machine, `--runasservice`) and set `"self-hosted"`.
- `setupPython` (default `true`): `actions/setup-python` needs a tool
  cache the self-hosted Windows runner lacks; `false` uses the
  Python already on PATH (the sweep's).
- `deploy` (default `artifact`): the github.com way publishes through
  `actions/upload-pages-artifact`, whose v4 artifact API GHES rejects
  (`upload-artifact@v4+ ... not currently supported on GHES`).
  `"branch"` has the workflow run `mkdocs gh-deploy`, which force-pushes
  the built site to the `gh-pages` branch of the wiki repository;
  set Pages to serve that branch (Settings → Pages → Source: **Deploy
  from a branch**, `gh-pages`, `/ (root)`). With `artifact` the Pages
  source is **GitHub Actions** instead.

The sample config carries the devtopia values (`self-hosted`,
`false`, `branch`). `pages.yml` is regenerated on every run, so
none of this is fixed by editing the file in the wiki repository.

Setup (after the sweep's §1–§4):

1. Config: `"wiki": {"repoUrl": "https://devtopia.esri.com/kev14953/lrs-docs.git"}`
   (the sample shows the optional keys: branch, outDir, siteName,
   siteUrl, recent, and the three workflow keys above). Credentials come from the machine's git
   credential helper — clone the repository once from a console so
   the helper caches them; nothing is stored in config.
2. Render and preview: `node --experimental-strip-types pipeline\wiki.mjs --config config.json`
   writes `<workDir>\wiki`; `pip install mkdocs-material` then
   `mkdocs serve` inside it previews the site locally (`--build`
   runs `python -m mkdocs build --strict` for you, through
   `wiki.python` / `llm.python` / the default interpreter, so mkdocs
   need not be on PATH — only installed for that interpreter).
3. Push: `... wiki.mjs --config config.json --push` commits the tree
   and pushes it (an unchanged corpus makes no commit). The first
   push creates the branch; Pages builds within a minute.
4. Schedule `ops\run_wiki.cmd` after the nightly sweep:
   `schtasks /create /tn "LRS Doc Index Wiki" /xml C:\Repos\lrs-doc-index\ops\wiki_task.xml /f`
   (daily 18:30 by default — the sweep starts at 17:00 and finishes
   well inside the hour). The job runs `--build --push`, so besides
   the push it leaves the built static site in `<outDir>\site`.
5. If Pages is disabled on the Enterprise Server instance ("GitHub
   Pages is disabled. Please contact your system administrator"),
   serve that folder from the sweep machine instead — IIS ships with
   Windows: enable the `IIS-WebServerRole` feature, point the Default
   Web Site's physical path at `<outDir>\site`, open TCP 80 in the
   firewall, and set `wiki.siteUrl` to `http://<machine>/`. The
   nightly `--build` refreshes it; the push keeps the `gh-pages`
   branch ready for the day Pages is switched on.

The tree is a rendering: nothing in it is edited by hand, the next
run overwrites every page. Change a document's classification,
keywords or related documents in the catalog and the sweep's rewrite
of the sidecar carries it to the wiki. Gate: `tests/check_wiki.py`
(fixture-free; the strict MkDocs build runs in CI).

## 16. Markdown layout: the wiki dialect, the case block, format 3.1, drafts

`docs/design/Markdown_Layout_Plan.md` phases 2–6, shipped as
`lib/mdlayout.mjs` v1.1, `lib/layoutaudit.mjs` v1.0, `wiki.mjs` v1.3,
`casegrammar` v1.3, `caseindex` v2.2, `sidecarmeta` format 3.1,
`sweep` v1.54 and `testplangen` v1.24. Phase 2 (the wiki lane) needs
nothing here — the site is regenerated on every run. Phases 3 and 4
rewrite the corpus, in ONE pass; phases 5 and 6 are steps 7 and 8:

1. **Tenant** — nothing to add. The Test Cases columns phase 3 fills
   (`Shape`, `Confidence`, `Group`, `SourceRef`) were created for the
   Sidecar_Format_Plan rollout (§13.1).
2. **Decide the anchors question first.** `sweep.caseIndex.anchors`
   (default `true`) writes each case heading its own link target —
   `### TC-P01 — … { #tc-p01 }` — so a link to a case survives a
   retitle. GitHub ignores the attribute and MkDocs honours it, but
   the **SharePoint preview shows it as text** on every case heading.
   If the preview is how the team reads plans, set it to `false`
   before the backfill; changing it later costs another `--reformat`.
3. `node pipeline\sweep.mjs --config config.json --reformat --live`
   — one pass covers both phases: every body re-renders through the
   case grammar (anchors, the `lrs:case` provenance mark, H4 unit
   headings, bullet field lines) and every head rewrites as the 3.1
   table (empty rows omitted, `Status` added). It syncs the Test Cases
   and Figures rows as it goes, so no `--recase` / `--refigure` is
   needed afterwards. No AI spend; byte-idempotent on a second run.
4. **Read one plan and one sparse document** before letting the
   nightly run continue — a test plan for the case block, and
   something like a stray `.txt` for the short header.
5. Paste `docs/qa-agent-instructions.md` (**v1.5**) into the Q&A
   agent and re-run `docs/history/QA_Smoke_Questions.md`. The
   instructions describe 3.1, 3.0 and the pre-3.0 yaml shape, so
   pasting before the backfill finishes is harmless.
6. The next generated draft uses `testplan_draft` **v1.14** — the same
   case block, two-digit ids. Drafts already in the Test Plan Drafts
   folder are not rewritten; `tests/check_draft_coverage.py
   --baseline` scores one of them without the new asserts.

7. **Drafts** (phase 5) need nothing: they are timestamped and never
   rewritten, so the next generated draft simply opens in the new
   shape. To publish them to the wiki, set `wiki.draftsDir` to the
   LOCAL path of the synced `Shared Documents/Test Plan Drafts`
   folder; each draft becomes a page plus a Drafts catalog, marked
   unreviewed and joining no catalog. Empty (the default) = no Drafts
   section.
8. **After the backfill, check what converged** (phase 6):
   `node pipeline\sweep.mjs --config config.json --layout-audit --live`
   — read-only apart from `_Layout Audit.md`, no model, no list
   writes. It reports the format mix and, for each shape an earlier
   phase replaced, how many sidecars still carry it and which reader
   that keeps alive. The run prints `retirable now: …` — the shapes no
   file carries any more. Those readers can be deleted (they are named
   in `pipeline/lib/layoutaudit.mjs`); until then they stay, which is
   why nothing broke while the backfill was pending.

Rollback is the standing pattern: the `format` value in the Extracted
row says which shape a file carries, and `--reformat` re-emits from
raw text, so nothing depends on re-running the model.

## 17. The official vocabulary: tools and terms from the Esri documentation (doc_vocab.mjs)

The classifier used to be asked for "official tool names" with six
examples to go on, so it invented casing and variants ("Merge
Centerline", "merge centerlines tool", "Append Route"), and every
variant became its own Keywords row for curation to undo. Since
sweep v1.65 the names come from the documentation itself:
`pipeline/data/lrs_vocabulary.json` holds every tool of the Location
Referencing toolbox (name, toolset, page, description — the toolbox
overview page and each toolset overview it links) and every term of
the "Essential Roads and Highways vocabulary" page (term, definition,
page), plus a hand-kept `widgets` list for the Experience Builder
widgets and Pro ribbon tools no toolbox lists.

**Generating the file.** `doc.esri.com` must be reachable:

    node --experimental-strip-types pipeline\doc_vocab.mjs

fetches the default pages (the LR toolbox overview and its toolsets;
the Roads and Highways and Pipeline Referencing vocabularies — a page
that 404s is skipped with a note) and rewrites the JSON, carrying the
`widgets` list over. Commit it. `--from-dir <dir>` reads pages saved
there as `<slug>.html` instead of fetching (the note names the exact
`curl.exe` for a missing one); `--dry-run` prints the counts. Re-run
after a release adds tools. Widgets: edit the `widgets` array by hand
(`{"name": "Straight Line Diagram", "url": "..."}`).

**What it does, everywhere.**

- **Classifier** (prompt 3.1.0, input `KnownTools`): the official list
  goes into every classify call, and the rule is copy character for
  character. The sweep then normalizes every returned tool name to
  the official casing anyway (`"append route"`, `"the Update Measures
  from LRS tool"` → `Append Routes`, `Update Measures From LRS`), and
  the names it cannot match are kept as written, counted in the
  summary (`tools_unknown`) and appended to `work\unknown-tools.txt`
  (`name<TAB>document<TAB>date`). Read that file now and then: a real
  widget goes into `widgets`, a made-up name is a prompt problem.
- **Documentation links**: every official tool has its page, ahead of
  the crawl inventory and the probe.
- **Curation** (`curate.mjs`): an official term or tool name is the
  canonical side of any pair — the guard drops a proposal that folds
  one into an unofficial title. `--seed-vocabulary` (dry by default,
  `--live` writes) creates a Keywords row for every term (`topic`) and
  tool or widget (`tool`) that has none yet, Title lowercase, Notes
  naming the page, so the classifier's ExistingKeywords spelling
  reference carries the official spelling from then on. Expect the
  next sweep to re-tag cases and figures that mention a newly seeded
  term (one night of `cases_upserted`).

Config: `sweep.vocabularyFile` points elsewhere (default the committed
file). No file = the pre-v1.65 behaviour, with one stderr note.

**Prompt 3.1.0 and the PromptVersion stamp.** The classify prompt's
version is the reindex trigger (§7): every document re-classifies on
its next sweep, at `maxDocsPerRun` per night, so the official names
replace the invented ones across the corpus. Pin
`sweep.promptVersion: "v3.0.0"` to defer that respend.

