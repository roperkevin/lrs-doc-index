# Local sweep — build + deploy guide (component v1.0)

Runs the entire Doc Index sweep as a local Node process
(`local/sweep.mjs`), replacing the DocIndexSweep Power Automate cloud
flow. Power Automate leaves the pipeline completely: no Run-script
quota, no AI Builder, no premium connectors, no import packages, no
designer mis-picks. SharePoint stays exactly where it is — the corpus,
the six lists, and every consumer (Q&A agent, TestPlanGen, colleagues)
are untouched. Deployment becomes `git pull`; the whole pipeline sits
under the repo's gate discipline (`local/harness/check_local_sweep.py`,
CI `fixture-free` job).

What replaces what:

| Cloud flow piece | Local replacement |
|---|---|
| Recurrence trigger (daily 17:00 MST) | Windows Task Scheduler (§4) — runs headless, machine can stay locked |
| Nine Run-script actions | `scripts/*.ts` in-process via `pad/runner/ops.mjs` (the gated PAD loader) |
| AI Builder prompt | The **same AI Builder prompt**, invoked directly via the Dataverse Web API (`local/llm.mjs`) — same model, same tenant prompt text, same credits |
| SharePoint file reads/writes (docs, sidecars, media) | OneDrive-synced library folders, plain file I/O |
| SharePoint list actions (six lists) | Microsoft Graph (`local/graph.mjs`), Entra app registration |
| Catch_index / LastError / retry-next-run | Same semantics, reimplemented (Error rows retrigger via Needs_index) |

The orchestrator mirrors flow v2.8 action-for-action (Needs_index
gating, PromptVersion backfill, sidecar header bytes, IdKey/LinkKey/
KWKey dedup, shortlist→final→sidecarpatch relatedness with reciprocal
neighbor patching, Skip/Error lanes). Documented deviations: §6.

## 1. Machine prerequisites

- The PAD machine setup (Node 22.6+, repo clone at e.g.
  `C:\DocIndex\lrs-doc-index`, scratch dir) — see `pad/PAD_Setup.md`
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
and Dataverse permissions — the same identity model as the cloud
flow's connections, which also ran as you (list rows will show your
name as Created/Modified By, as they do today).

How it works:

1. **First run** (do it from a console): the sweep prints
   `Open https://microsoft.com/devicelogin and enter the code XXXX`
   — twice: Graph (list reads/writes) and Dataverse (the AI Builder
   call). Sign in with your normal account each time. The third
   token — SharePoint REST, for the hyperlink-column writes Graph
   cannot do (`SourceLink`/`TextFileUrl` go through
   `ValidateUpdateListItem`) — is minted **silently** from the Graph
   sign-in: it uses the same public client, so its refresh token
   converts to a SharePoint-audience token with no extra prompt.
2. The refresh tokens are cached under `paths.workDir\auth\`
   (`graph.json`, `dataverse.json`, `spo.json`, mode 0600). Every later run —
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
everywhere. Same knob on `llm.dataverse.clientId`. Note the SPO token
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
instead (on `graph`, and it flows to Dataverse/SPO):

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
LocationReferencing) or `Sites.ReadWrite.All`, and add the app as a
Power Platform application user for the AI Builder call (§3). The
gate covers both modes.

## 3. The AI step — same model as the cloud flow

`llm.provider: "aibuilder"` (the default) calls the **same AI Builder
custom prompt the cloud flow calls today** — the flow's `Run_prompt`
action is just the Dataverse connector wrapping the Web API `Predict`
action, and the sweep invokes that action directly:

```
POST {environmentUrl}/api/data/v9.2/msdyn_aimodels({modelId})/Microsoft.Dynamics.CRM.Predict
```

Same model, same tenant-hosted prompt text, same nine-field output,
same lax response parsing (coalesce → brace-slice → parse, so fences
and prose around the JSON are tolerated exactly as the flow tolerates
them), same AI Builder credit metering. **Zero behavior drift in the
AI step** — prompt promotion remains the AI Builder paste + STATUS
entry, exactly as today.

Setup (one-time):

1. `llm.environmentUrl` — the environment's Dataverse URL (Power
   Platform → Settings/Environments, or the maker portal's session
   details, e.g. `https://org1234.crm.dynamics.com`).
2. `llm.modelId` — the AI Builder prompt's model GUID. It's the
   `recordId` bound in the flow's Run_prompt action
   (`ef04e39d-3775-4655-a8be-60192095c1d6` per the v2.8 definition);
   verify against your tenant if the prompt is ever re-created.
3. Auth: nothing — the §2 device sign-in covers Dataverse too (its
   own prompt on first run, its own cached token). You built the
   prompt and the flow ran it under your connection, so your user
   already has every permission it needs. (App-mode alternative:
   register the §2 app as a Power Platform **application user** with
   an AI-Builder-capable role.)

Licensing note: calling Dataverse/AI Builder through the Web API uses
AI Builder credits exactly as the connector call did; no Power
Automate license is involved.

**Alternative — `"provider": "anthropic"`** (kept for a future move
off Power Platform entirely): a direct Anthropic Messages API call
that executes `prompts/DocIndex_Prompt.md` verbatim with schema-
pinned output, authenticating with your Claude account via
`ant auth login` (or `auth: "apiKey"`). Details: `local/CHANGES.md`
v1.1. Switching providers is a config edit, but it changes the model
that classifies the corpus — treat it as a PromptVersion-bumped
backfill event, not a tweak.

## 4. Configure + first run

```
cd C:\DocIndex\lrs-doc-index
copy local\config.sample.json local\config.json    (git-ignored)
:: fill in paths.*, graph.tenantId/clientId; verify list GUIDs vs
:: docs/SP_Adaptation_Notes.md
node --experimental-strip-types local\sweep.mjs --config local\config.json
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
schtasks /create /tn "LRS Doc Index Sweep" /xml C:\Repos\lrs-doc-index\local\sweep_task.xml /f
```

The action is `local\run_sweep.cmd`, which self-updates (`git pull
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
   `processed` ≤ MaxDocsPerRun; with the corpus stamped v2.0 and no
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
- With the default `aibuilder` provider the AI step is NOT a
  deviation at all — same model, same prompt, same brace-slice
  parsing. (The `anthropic` alternative replaces brace-slice with
  schema-guaranteed JSON; malformed output lands in the Error lane
  either way.)
- **No XmlBuf** (vestigial in the flow).
- **List GUIDs live in config**, not hand-typed URIs — the FX-6
  failure class is gone; a list re-creation is a config edit.
- WorkbookDump reads the xlsx via `pad/runner/xlsx_grid.mjs` — the
  same content-equivalence caveat as the PAD offload
  (`pad/PAD_Setup.md` §7).
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
  `local/esri_doc_links.json` → **match against the crawled page
  inventory** (`local/doc_crawl.mjs` writes
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
- **Content-filter lane** (v1.28): AI Builder's input moderation can
  refuse a document's own text (`InputContentFiltered` — decks that
  quote model-instruction-like content trip it), and the refusal is
  deterministic, so an Error stamp would re-burn one AI call per
  night failing identically. Such a doc gets a STAMPED `Skipped` row
  with `LastError` `"content filter: ..."` at the current
  PromptVersion — once, no rechurn. It re-enters `Needs_index` on the
  next `sweep.promptVersion` bump or when the source doc is edited
  (trimming the offending text and re-saving is the way to get the
  doc indexed).

## 7. Operations

- **Deploy** = the nightly self-update: the scheduled `.cmd` scripts
  fetch and fast-forward to the CI-promoted **`deploy` branch** (the
  harness workflow advances it from main only when every suite is
  green — a red main can never reach the nightly run). A manual
  `git merge --ff-only origin/deploy` deploys immediately. Record the
  commit in STATUS the way pastes were recorded. Prompt changes
  deploy the same way (bump `sweep.promptVersion` in config to
  trigger the backfill).
- **Errors**: per-doc failures write `IndexStatus=Error` +
  `LastError="{step}: {detail}"` and retry next run — same recovery
  model as the flow. The summary JSON carries `errors`.
- **Alerts** (v1.32, optional): set `alerts.webhookUrl` (a Teams/
  Slack incoming-webhook URL, `{"$env": ...}` supported) and the
  sweep posts on a fatal abort and for docs stuck 3+ nights.
  Best-effort delivery — a down webhook never fails a run.
- **Dead-man check** (v1.32): register `local\run_heartbeat.cmd` as a
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
- **OCR lane** (v1.36, optional): install Tesseract and set
  `sweep.tesseractPath` (Poppler's pdftoppm is additionally needed
  only for the scanned-PDF lane — since v1.41 wireframe OCR runs on
  Tesseract alone);
  image-only PDFs then index via OCR (lane `"ocr"`), and previously
  Skipped `plaintext`-lane PDFs rescue automatically. No PATH
  auto-detection — explicitly opt in. Since v1.40 the same opt-in
  also feeds the wireframe figures: pptx screenshots redrawn as
  wireframes get their text rows transcribed (real text in the
  figure instead of placeholder bars) — `--reformat` rolls it over
  the existing corpus with no AI spend.
- **msg lane** (v1.37): Outlook .msg files index automatically —
  nothing to enable; previously Skipped rows rescue on the next run.
- **Embedding relatedness** (v1.38, optional): `sweep.embedRelated:
  true` + `llm.embeddings {baseUrl, apiKey, model}` adds
  paraphrase-level related-doc matching via a Voyage/OpenAI-
  compatible embeddings endpoint (hash-cached; fail-open to BM25).
  DATA EGRESS: document text leaves the tenant when this is on —
  §8's decision class.
- **Remote-files mode / hosted runner** (v1.39, optional):
  `sweep.remoteFiles: true` runs the whole sweep with NO OneDrive —
  see `local/Hosted_Runner.md` for the mode's behavior, the
  disabled-by-default GitHub Actions nightly, and the two decisions
  (app auth; where tenant credentials live) that come first.
- **Rollback**: re-enable the cloud flow in the portal; both read the
  same PromptVersion stamps, so the handover back is seamless. Keep
  the flow import packages (`flow/*.zip`) as the durable fallback.
- **Quota math**: zero Excel Online Run-script calls, zero Power
  Platform/Power Automate requests. AI Builder credits are consumed
  exactly as the cloud flow consumed them (same prompt, per-doc, only
  for docs that need indexing).

## 8. Security

Same footprint as the PAD machine (`pad/PAD_Setup.md` §8). In the
default device-auth mode the machine holds no provisioned secret —
just the cached refresh tokens under `paths.workDir\auth\` (0600;
they act as your signed-in session, so keep the folder inside the
machine's disk encryption and delete it when decommissioning; you
can also revoke sessions from your Microsoft account's security
page). With the default `aibuilder`
provider there is **no new data egress**: document text goes to the
same tenant AI Builder endpoint the cloud flow sends it to today.
(Switching to the `anthropic` provider changes that — document text
would flow to the Anthropic API under its data terms; clear that with
whoever owns the decision before flipping the config.)

## 9. Weekly keyword curation (curate.mjs)

The KeywordCuration cloud flow (v1.1) as a local weekly job — the
LAST Power Automate piece; with this deployed the pipeline is 100%
local. Same identities, same tenant AI Builder prompt
("LRS Keyword Curation"), same propose-then-approve contract: the
job NEVER writes CanonicalRef — a human approves by setting the
lookup, and the job clears the flow-owned columns
(CurationStatus/ProposedCanonical) on its next run. The digest
overwrites `Keyword_Curation_Digest.md` in the site's **Shared
Documents root** (outside the LRS Doc Index library so the Q&A agent
never ingests it) via a Graph drive upload — no extra sync needed.

Setup (after the sweep's §1–§4 — it reuses the same config and
sign-ins, no new prompts):

1. Find the curation model GUID:
   `node --experimental-strip-types local\curate.mjs --config local\config.json --models`
   and copy the "LRS Keyword Curation" line's GUID into config as
   `llm.curationModelId`.
2. Smoke: `... curate.mjs --config local\config.json --dry-run`
   (plan only), then `--live` once and check the digest file + the
   Cur_summary line (`canon= blocked= proposed_by_model= written=
   dropped= cleared=`) against a portal run of the flow.
3. Schedule (Saturday 08:00, the flow's slot):
   `schtasks /create /tn "LRS Keyword Curation" /xml C:\Repos\lrs-doc-index\local\curation_task.xml /f`
4. **Turn the KeywordCuration cloud flow OFF** in the portal (keep as
   rollback) — never both live — and record the handover in STATUS.

**Optional — `curation.autoApprove: true`** trades the human gate
for convenience: guard-passing merges apply immediately (the job
sets CanonicalRef itself; pending proposals left from manual mode
apply on the next run), and the digest becomes an audit log. Undo a
wrong merge by clearing the row's CanonicalRef AND setting
CurationStatus = Rejected (blocks re-proposal). The guard still
drops anything not matching real, uncurated rows verbatim — but
nothing reviews semantic judgment before it lands; default is false.

Prompt promotion stays the AI Builder paste (CurationPromptVersion in
`curation/CHANGES.md`; update `curation.promptVersion` in config so
the digest header reports it). Parse-failure behavior deviates
gently: malformed model JSON degrades to zero proposals with a log
note (the flow failed the run); everything else is action-for-action
from `curation/flow/v1_1/definition.json`.

**`--repoint` — the librarian junction backfill** (2026-09-03, from
Curation_Setup's queued follow-ons): after approving merges (or an
autoApprove Saturday), run
`node --experimental-strip-types local\curate.mjs --config local\config.json --repoint --live`
to re-point historical DocKeywords rows from merged aliases onto
their canonical (duplicates deleted, KWKey/Title recomposed), then
`sweep.mjs --rerank` to propagate the corrected keyword overlaps into
the related sections in one pass. Dry-run by default; a no-op pass
prints `repointed=0 deleted=0`. Requires
`sharePoint.lists.docKeywords` in config (already there for the
sweep).

## 10. Gantt schedules → Issue Refs (gantt.mjs — Flow #2)

The long-queued feeder for the (deliberately empty) Issue Refs list,
as an on-demand local job (`local/gantt.mjs` v1.0 — details in
`local/CHANGES.md` "gantt v1.0"). Prerequisites: the sweep set up
(§1–§4; same config and sign-ins), and `sharePoint.lists.issueRefs`
added to config. The list GUID is owner-verified on the tenant
(2026-09-04): `4d0e6561-80e3-49f4-aa20-e5889cc88414` — it is in
`config.sample.json` and the `docs/SP_Adaptation_Notes.md` GUID
table (no flow ever referenced Issue Refs, so the live exports never
confirmed it; the owner's verification closed that gap).

1. Make sure the schedule workbooks are indexed (DocKind
   **Schedule**) and present in the synced source library.
2. Dry run:
   `node --experimental-strip-types local\gantt.mjs --config local\config.json --dry-run`
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
(`local/testplangen.mjs` v1.0 — design record
`testplangen/Local_TestPlanGen_Plan.md`, component record
`testplangen/CHANGES.md` v2.16): draft a test plan from one indexed
**User Story** row, grounded strictly in that story with the
catalog's related documentation as reference. It delivers the entire
AUTHORED TestPlanGen state — prompt v1.7's coverage/granularity/
source-sweep rules, the v2.2 lane routing, the v2.3 budget
semantics — with zero tenant designer work, plus a verifier the
cloud flow could not have: every draft is checked against the v1.7
coverage contract (`local/lib/draftlint.mjs`, the in-process port of
`review/harness/check_draft_coverage.py`) BEFORE it is written.
Read-only over every list; the only write is the timestamped draft
in **Shared Documents/Test Plan Drafts/** (outside the LRS Doc Index
library so the Q&A agent never ingests unreviewed drafts — the
curation-digest rule), via a Graph drive upload, never overwritten.
The §4 human review loop in `testplangen/TestPlanGen_Setup.md` is
unchanged and remains a REQUIRED control.

Setup (after the sweep's §1–§4 — same config, sign-ins, and synced
sidecar library; the sidecars ARE the retrieval source):

1. Pick the prompt transport — `llm.provider`, shared with the
   sweep, or `testplangen.provider` to override it for GENERATION
   ONLY (v1.2: e.g. drafts on the anthropic lane while the nightly
   classify step keeps burning AI Builder credits, or the reverse):
   - **aibuilder** (default): the tenant's `LRS Test Plan
     Generation` AI Builder prompt via Dataverse Predict. Find its
     GUID with
     `node --experimental-strip-types local\testplangen.mjs --config local\config.json --models`
     and set `llm.testPlanModelId`. CAVEAT: the TENANT paste state
     applies — the prompt must carry all FIVE input parameters
     (ReferenceText) and the current v1.9 text
     (`testplangen/Coverage_Runbook.md` step 2, one-time).
   - **anthropic**: executes `prompts/TestPlanGen_Prompt.md`
     VERBATIM — zero tenant prompt work, the v1.9 rules apply as
     authored. `testplangen.maxTokens` (default 32000) bounds the
     reply; a token-truncated draft loses its END marker and fails
     CLOSED, loudly.
2. Dry run against a real story:
   `node --experimental-strip-types local\testplangen.mjs --config local\config.json --story <docId> --dry-run`
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
   `review/harness/check_draft_coverage.py`) and the summary line
   (`story= neighbors= exemplars= references= … verify=`) reads
   exactly like the flow's `Gen_summary`
   (`TestPlanGen_Setup.md` §3 G13; `neighbors=0` on a story with
   plain peers means its sidecar's `related:` line is stale — let
   the nightly backfill converge, or reindex the story).
3. `--live` writes the draft to
   `Shared Documents/Test Plan Drafts/TestPlanDraft__doc<ID>__<stamp>.md`.
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
exception, since the prompt admits no tool names from references),
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
Manual runs only — refused with `--auto`, `--gap-report`, and
`--models` (those modes work from catalog state alone).

Since v1.7 `--reference` ALSO takes an **http(s) URL** — a
hyperlink to official product documentation (e.g. an ArcGIS Pro
tool-reference page) pinned into the REFERENCE FUNCTIONALITY lane
beside the catalog's own documents:

```
node --experimental-strip-types local\testplangen.mjs --config local\config.json ^
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
- **Idempotency**: a story with ANY existing
  `TestPlanDraft__doc{ID}__*` file in the drafts folder is skipped —
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
`local/harness/check_draft2docx.py` (CI).

**pptx review deck** (v2.23): for walking the §4 review as slides —
`node local\draft2pptx.mjs "<draft>.md"` (zero dependencies) writes
a sibling .pptx: title + at-a-glance slides, one slide per TC case
(steps checklist, Expected Result and Trace cards, `[VERIFY:` flags
in amber), Coverage Map and Issue Trace as native editable tables,
all on the Diagram Style Framework palette so svg2pptx figure
slides drop in beside it. The docx stays the document of record;
the deck is the review surface. Gate:
`local/harness/check_draft2pptx.py` (CI).

Schedule it: register a daily task for `local\run_testplangen.cmd`
offset AFTER the nightly sweep (e.g. 18:30 — the sweep fires 17:00
Mountain), e.g.
`schtasks /create /tn "LRS Test Plan Auto Draft" /tr C:\Repos\lrs-doc-index\local\run_testplangen.cmd /sc daily /st 18:30`.
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
grounding (true), notify (false), provider ("" = follow
llm.provider), maxTokens (32000), autoDraft (false), autoMaxPerRun
(3), autoLookbackDays (7), dryRun (true). Deliberate deviations from the
flow, all bounded: one run-start Doc Index snapshot replaces the
per-item Get calls; the G6 fallback orders by SourceModified where
the flow orders by list Modified (same newest-first intent); a story
sidecar missing from the synced library is a hard error naming the
sync, not a silent degrade. Prompt promotion stays the
`TestPlanGenPromptVersion` paste path (`testplangen/CHANGES.md`) —
the anthropic lane picks a promoted prompt up on its next run
automatically; the aibuilder lane still needs the tenant paste.
