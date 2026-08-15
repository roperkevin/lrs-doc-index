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
merges to propagate them corpus-wide in one pass).

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
- **Product-documentation links** (additive deviation): sidecars for
  docs with a detected `Products` value carry a
  `## Product documentation` section linking the official Esri docs,
  driven by the editable `local/esri_doc_links.json` (keys = the
  canonical product names; edit + git pull = deploy; `--rerank`
  refreshes every existing sidecar). Verify the seed URLs — they
  were authored offline.
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

## 7. Operations

- **Deploy** = `git pull` on the machine. Record the commit in STATUS
  the way pastes were recorded. Prompt changes deploy the same way
  (bump `sweep.promptVersion` in config to trigger the backfill).
- **Errors**: per-doc failures write `IndexStatus=Error` +
  `LastError="{step}: {detail}"` and retry next run — same recovery
  model as the flow. The summary JSON carries `errors`; alert on it
  however you like (the cloud flow only had the platform failure
  email).
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
