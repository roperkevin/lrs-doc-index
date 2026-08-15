# Local sweep — release notes

## v1.8 (2026-08-15)

**Ghost reconciliation** (improvement plan #9). After each full run
the sweep compares every Doc Index row's DocKey against the actual
library listing; rows whose source doc was deleted are set
`IndexStatus: Archived` with a dated LastError note, their sidecar
is pruned (dry-run-aware), they leave the relatedness candidate pool
(no more "related" links to dead docs), and their error-lane entry
clears. A doc restored from the recycle bin re-enters `Needs_index`
via the new Archived trigger and re-indexes automatically.

Safety rails, in order: reconciliation is skipped on `--only` smoke
runs and whenever the library listing comes back empty (a throttled
listing must never archive the world); archives are capped at
`sweep.maxArchivesPerRun` (default 20) per run with a log note when
more remain. **One-time tenant step**: add `Archived` to the Doc
Index `IndexStatus` choice values — until then the sweep halts
archiving with a log note naming the fix and runs normally
otherwise (`schemas/SPList_DocIndex.csv` updated).

Gate: seeded ghost row (Indexed, no matching file, stale sidecar on
disk) — dry leg proves the archive is planned but not executed;
live leg proves Archived + dated note + sidecar pruned + status-page
callout; idempotency leg proves archived rows are not re-archived.
**Gate PASSED 2026-08-15 (67/67).**

## v1.7 (2026-08-14)

**PDFs are indexed** (improvement plan #8; owner opted for the
pdftotext route to keep the repo zero-npm-dependency). New `pdf`
extraction branch shells out to Poppler's `pdftotext -layout -enc
UTF-8` (`sweep.pdftotextPath` or PATH); text-bearing PDFs run the
full pipeline (`ExtractionLane: plaintext` — an existing whitelist
value, no schema risk), scanned/no-text PDFs land in the Skip lane
with that lane recorded as the "attempted" stamp so they never
rechurn. **PDF rescue**: rows stamped `Skipped` at the current
PromptVersion by the flow or the pre-v1.7 sweep re-enter
`Needs_index` exactly once when the tool is present — the corpus's
PDF backlog indexes without a promptVersion bump (no full-corpus AI
respend). No tool installed = flow-era behavior (Skip lane) with a
log note. Also fixes `normalizeRows` dropping `LastError`/
`ExtractionLane` from snapshots (the v1.5 status page's error lane
was seeded empty because of it).

Gate: stub `pdftotext` (text for spec.pdf, empty for scan.pdf);
spec.pdf pre-seeded as `Skipped v2.0/lane none` — exactly the
post-backfill tenant state — and proven rescued→Indexed with a
sidecar; scan.pdf proven Skipped-with-stamp and NOT reprocessed on
the idempotency leg; no-tool leg proves graceful flow-era skip +
log note. **Gate PASSED 2026-08-14 (63/63).**

## v1.6 (2026-08-14)

**Out-of-scope lane** (improvement plan #7, the cheap floor). The
dry-run calibration showed ~102 tenant rows whose source files sit
outside the synced `libraryRootSegment`; when the v2.0 backfill
reached them they would each have become a *nightly* Error-lane
churn ("source file not found locally"). Now:

- A doc **structurally outside** the synced root gets a single
  STAMPED `Skipped` row (`LastError: "out of sync scope: ..."`), so
  it never rechurns; it re-enters `Needs_index` when modified or on
  a promptVersion bump after the sync scope grows. New
  `out_of_scope` summary counter + status-page callout with the
  remedy.
- A doc **in scope but missing on disk** stays a retryable Error,
  reworded to say what it almost always is (OneDrive sync lag) —
  clears itself when the file lands.

The full fix (actually indexing those docs) is syncing more of the
source library — a machine/disk decision, not a code change; the
lane makes the gap visible and quantified instead of noisy. Gate:
two new fixtures (`outside.docx` structurally out of scope,
`missing.txt` in scope but absent) + lane assertions on the live,
idempotency (the stamped Skip is NOT reprocessed) and status-page
checks. **Gate PASSED 2026-08-14 (59/59).**

## v1.5 (2026-08-14)

Unattended-operation hardening, the first post-handover batch:

- **Self-updating runs** — `run_sweep.cmd` does `git pull --ff-only`
  before each sweep (merged fixes deploy themselves; a conflicted
  state can't wedge the machine, it just runs what's checked out).
- **Missed-schedule catch-up** — new repo-tracked
  `local/sweep_task.xml` (register with `schtasks /create /xml`):
  StartWhenAvailable (machine off at 17:00 → run fires on wake
  instead of skipping the night) + laptop battery settings, which
  plain `schtasks /create` cannot express.
- **Fail-fast on dead auth** — a non-interactive run that would need
  a device-code sign-in now throws `AUTH EXPIRED` immediately (with
  the exact recovery command) instead of waiting 15 minutes for a
  prompt nobody will answer. `DOCINDEX_ALLOW_DEVICE_PROMPT=1`
  overrides (harness; redirected consoles).
- **Status page in SharePoint** — after every live run (and on fatal
  aborts) the sweep writes `_Sweep Status.md` to the sidecar library
  root: last run, result, prompt version, the Error-lane table with
  per-doc LastError, and an "action needed" line. Pipeline health is
  now visible where the team already reads the index.
- **Log hygiene** — per-run `sweep-*.json` logs pruned to the newest
  30; `sweep-task.log` rotates at ~5 MB (one previous generation).

Gate: +8 checks — status page contents on the live leg, prune-to-30
with fodder logs, and a dead-auth leg (fails fast, AUTH EXPIRED on
stderr, no device prompt started, fatal surfaced on the status
page). **Gate PASSED 2026-08-14 (55/55).**

## v1.4.3 (2026-08-14)

**SPO 401 resolved** — the v1.4.2 token matrix (run in-tenant) showed
why every SharePoint write failed: the Azure CLI client's SharePoint
grant carries only `scp=user_impersonation`, which SP REST rejects
(401 invalid_request) even for a plain GET, and the v2 named scopes
(`AllSites.Write`) are blocked outright for first-party clients
(AADSTS65002 preauthorization). The **Graph CLI public client + v1
resource form** was the sole winner: its token's scp carries real
SharePoint permissions (Sites.ReadWrite.All / AllSites family) and
both `GET /_api/web` and the `ValidateUpdateListItem` hyperlink write
succeeded. `SpoClient` device mode now defaults to the Graph CLI
client — and since that's the same client as the Graph sign-in, the
SPO token is **seeded from `auth/graph.json`'s refresh token** (Entra
refresh tokens are client-bound, not resource-bound): the third
sign-in prompt is gone entirely. `DelegatedAuth` gains
`seedCachePath` + a `client_id` cache marker (a cache written by a
different client is never refreshed against, it's re-seeded instead —
this self-heals the stale Azure CLI `spo.json` on the deployed
machine). Gate: device leg now asserts exactly two prompts
(graph+dataverse), SPO seeded via refresh grant, and the seeded token
on the SPO write. **Gate PASSED 2026-08-14 (47/47).**

## v1.4.2 (2026-08-14)

Diagnostic release for the live-walkthrough SPO 401: even a fresh v1
`resource=` device grant comes back with the generic SPO app-GUID
audience and only `user_impersonation` in `scp`, and SharePoint still
rejects it. `probe.mjs --spo` is now a **token matrix**: it redeems
the already-cached refresh tokens (Entra refresh tokens are
client-bound, not resource-bound — zero new sign-in prompts) for
every candidate token shape (v1 resource with/without trailing slash,
v2 named scopes `AllSites.Write` / `AllSites.FullControl` /
`.default`, Azure CLI and Graph CLI public clients) and for each one
prints the decoded claims, a plain `GET /_api/web` check (separates
"token rejected" from "this endpoint rejected"), and the hyperlink
write — including the `WWW-Authenticate` header on 401, where
SharePoint states the actual reason. Ends with a WINNERS line; the
winning shape gets wired into `SpoClient` next. New
`redeemRefreshToken()` export in auth.mjs (cache-untouched, additive).

## v1.4 (2026-08-14)

Live-run fix: **Graph cannot write hyperlink columns** — the probe
(`local/probe.mjs`, added during the live walkthrough) showed every
write shape for `SourceLink`/`TextFileUrl` rejected with 400
invalidRequest while all other fields pass. New `SpoClient`
(graph.mjs) routes exactly those two fields through SharePoint REST
`ValidateUpdateListItem` (hyperlinks as "url, description"; per-field
ErrorMessage checked — the endpoint 200s even on failure), which is
the same API the cloud flow's connector uses. The write layer splits
fields automatically; SPO auth follows the same device/app modes
(device default: the Azure CLI public client, pre-consented against
SharePoint — a third first-run sign-in, cached as `auth/spo.json`).
Also v1.3.1 (Predict `source` telemetry — AI Builder rejects without
it) folded in. Gate: the mock Graph now rejects hyperlink fields
like the real service and the SPO endpoint is mocked, so the live
leg proves the split path; device leg asserts all three resources
sign in and refresh. **Gate PASSED 2026-08-14 (46/46).**

## v1.3 (2026-08-14)

**No Azure app registration required.** New `local/auth.mjs`
implements the OAuth device-code grant against Entra using
Microsoft's own pre-registered public clients (the Graph CLI app for
Graph, Microsoft's public Dataverse sample client for AI Builder) —
`graph.auth: "device"` is now the default. First run prints two
device-code sign-ins (Graph, Dataverse); refresh tokens are cached
per resource under `paths.workDir/auth/` (0600) and later runs —
scheduled ones included — refresh silently. Everything runs as the
signed-in user with their existing SharePoint/Dataverse permissions,
which is the cloud flow's own connection identity model (rows show
your name as Created/Modified By, as today). Consent-restricted
tenants can point `clientId` at any allowed public client (e.g. the
Azure CLI). The client-credentials app-registration path from v1.0
remains as `"auth": "app"` for a future service-account setup.

Gate: new device-auth leg — mock devicecode/token endpoints, both
resources sign in, writes carry the delegated token, refresh-token
caches written, second run refreshes silently with no new prompt.
**Gate PASSED 2026-08-14 (45/45).**

## v1.2 (2026-08-14)

The AI step goes back to **the cloud flow's own model**: provider
`aibuilder` (now the default) invokes the same AI Builder custom
prompt the flow's Run_prompt action calls — directly via the
Dataverse Web API Predict action
(`msdyn_aimodels({modelId})/Microsoft.Dynamics.CRM.Predict`), with
the flow's three `requestv2` inputs, its response read
(`responsev2.predictionOutput.text`), and its lax parsing
(coalesce → brace-slice → parse). Same model, same tenant-hosted
prompt text, same AI Builder credit metering — zero behavior drift
in the AI step, and prompt promotion stays the AI Builder paste.
Auth reuses the Graph Entra app (client credentials against
`{environmentUrl}/.default`; register it as an application user in
the Power Platform environment — guide §3). No Power Automate
license involved.

The v1.1 `anthropic` provider (Claude-account OAuth / apiKey,
executing `prompts/DocIndex_Prompt.md` with schema-pinned output)
remains as an explicit opt-in for a future move off Power Platform;
switching providers changes the classifying model — treat it as a
PromptVersion-bumped backfill event.

Gate: main legs run against a mock Dataverse Predict endpoint whose
output is wrapped in prose + code fences (proving the brace-slice),
with wire-shape assertions (bearer token, `version: "2.0"`,
`requestv2` keys); the anthropic apiKey/oauth legs stay as targeted
single-doc runs. **Gate PASSED 2026-08-14 (39/39).**

## v1.1 (2026-08-14)

LLM auth without an API key. `llm.mjs` gains `llm.auth: "oauth"`
(now the default): a one-time `ant auth login` on the machine stores
a Claude-account OAuth profile, and the sweep mints short-lived
bearer tokens via `ant auth print-credentials --access-token`
(re-minted every 5 minutes and on 401), sent as
`Authorization: Bearer` + the required `anthropic-beta:
oauth-2025-04-20` header. `ANTHROPIC_AUTH_TOKEN` short-circuits the
CLI when set; `"auth": "apiKey"` (or a configured `apiKey`) keeps
the metered-key path as an explicit opt-in. Guide §3 documents the
two CLI traps (an exported ANTHROPIC_API_KEY silently outranks the
profile; refresh tokens hard-expire — re-login). Gate: new
apiKey-header assertion + an OAuth leg with a stub `ant` proving the
bearer/beta headers on the wire. **Gate PASSED 2026-08-14 (36/36).**

## v1.0 (2026-08-14)

New component: the Doc Index sweep as a **local Node orchestrator** —
Power Automate leaves the pipeline entirely (orchestration, compute,
AI Builder, premium licensing, import packages, designer mis-picks).
SharePoint stays as the storage/consumption layer; the Q&A agent,
TestPlanGen, curation flow, and human readers are untouched.

- `sweep.mjs` — the orchestrator, mirroring flow v2.8 action-for-
  action from the extracted orchestration spec: Needs_index gating
  (incl. the PromptVersion backfill lever), the four extraction lanes
  (+ oversize/pdf/msg/html → Skip lane), LLM classify with the flow's
  whitelist clamps, RegexExtract ids/products, the ~22-field Doc
  Index upsert with PromptVersion stamped only by the URL patch
  (self-healing partial failures), byte-faithful v2.8 sidecar headers
  (info table, `<!-- metadata -->` comment frame, related region,
  `---` seam), media with `doc{srcId}_` prefixes, IdKey/LinkKey/KWKey
  dedup with sorted-pair id edges and canonical alias folding,
  shortlist→final→sidecarpatch relatedness with reciprocal neighbor
  patching, Skip/Error lanes with `{step}: {detail}` LastError and
  retry-next-run recovery, and the flow's Run_summary line. Dry-run
  (shadow) mode executes all compute, records every write as a plan,
  and reports DocKey calibration against rows the cloud flow wrote.
- `graph.mjs` — minimal Graph client (client-credentials, paged list
  reads, item create/patch, throttle-aware). List GUIDs come from
  config — the FX-6 hand-typed-URI failure class is gone.
- `llm.mjs` — direct Anthropic Messages API call (raw fetch, zero
  npm dependencies) executing `prompts/DocIndex_Prompt.md` verbatim
  between its markers; nine-field output pinned by a JSON schema.
  Prompt promotion becomes a git pull, not a tenant paste.
- `pad/runner/ops.mjs` — the PAD runner's script loading + op
  dispatch extracted into a shared module so the sweep drives the
  UNMODIFIED `scripts/` through the same gated path (`run_job.mjs`
  refactored to import it; PAD gate re-PASSED 27/27, behavior
  identical).
- `harness/check_local_sweep.py` — gate (stdlib + Node 22+, mock
  Graph + mock LLM via http.server, generated fixtures, CI
  `fixture-free` job): dry-run leg (zero writes, plan recorded),
  live leg (rows/fields/sidecars/media/edges/keywords/junctions/
  reciprocal patch/Skip/Error lanes, 33 checks), idempotency leg
  (second run reprocesses only the Error doc, no LLM spend on
  stamped docs). **Gate PASSED 2026-08-14 (33/33).**
- `Local_Setup.md` — Entra app registration, LLM key, config,
  Task Scheduler (headless — no attended-session constraint),
  shadow-mode checklist incl. DocKey calibration, cloud-flow
  handover/rollback, deviations list, security notes.
- `config.sample.json` — machine config template (git-ignores as
  `local/config.json`; secrets via `{"$env": ...}`).

Deployment state: **authored, nothing switched over**. The cloud flow
keeps running until the §5 shadow checklist passes and DocIndexSweep
is turned off in the portal — never both live at once.
