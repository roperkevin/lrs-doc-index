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
   — once for Graph, once for Dataverse. Sign in with your normal
   account.
2. The refresh tokens are cached under `paths.workDir\auth\`
   (`graph.json`, `dataverse.json`, mode 0600). Every later run —
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
everywhere. Same knob on `llm.dataverse.clientId`.

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
`--only <filename>` (the SmokeFile equivalent — one doc).

**Schedule it** (replaces the Recurrence trigger; unlike attended PAD
runs, Task Scheduler works with the machine locked):

```
schtasks /Create /TN "DocIndexSweep" /SC DAILY /ST 17:00 ^
  /TR "\"C:\Program Files\nodejs\node.exe\" --experimental-strip-types C:\DocIndex\lrs-doc-index\local\sweep.mjs --config C:\DocIndex\lrs-doc-index\local\config.json --live"
```

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
