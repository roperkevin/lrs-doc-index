# Hosted sweep runner — remote-files mode (v1.39)

Review r7 phase 4, owner-approved. The sweep can run anywhere
headless — a GitHub-hosted runner, a fresh VM, a container — with
**no OneDrive sync**: `sweep.remoteFiles: true` makes
`paths.sidecarLibrary` a plain local workspace that mirrors down from
the sidecar library's drive (eTag-deduped, own writes remembered) and
writes through Graph, while source docs download on demand through
the v1.33 fallback. This removes the last single-machine dependency
(review risk R2): the owner's desktop stops being infrastructure.

**Decide two things before enabling anything:**

1. **App-registration auth is a prerequisite.** Delegated sign-ins
   (device/interactive) need a human at first run and on token
   expiry — useless on an ephemeral runner. Provision the Entra app
   per Local_Setup §2's app alternative (`Sites.Selected` write on
   lrsworkspace + read on LocationReferencing, or
   `Sites.ReadWrite.All`; add it as a Power Platform application
   user for the AI Builder call, §3).
2. **Tenant credentials would live in GitHub secrets.** That is an
   organizational policy decision, not a technical one — clear it
   with whoever owns that call before setting the secrets. If the
   answer is no, remote-files mode still works from any machine you
   control (a lab VM, a server): schedule `sweep.mjs --live` there
   with the same config and skip the workflow entirely.

## GitHub Actions setup (`.github/workflows/hosted-sweep.yml`)

The workflow is committed but DISABLED: it runs only when the
repository variable `HOSTED_SWEEP_ENABLED` is `"true"`.

1. **Secrets** (repo Settings → Secrets and variables → Actions):
   - `DOCINDEX_HOSTED_CONFIG` — the full config.json content. Shape
     it like config.sample.json with these overrides:
     ```json
     {
       "sharePoint": { "...": "as usual (lists incl. GUIDs)" },
       "paths": {
         "sourceLibrary": "work/source",
         "sidecarLibrary": "work/sidecars",
         "workDir": "work"
       },
       "graph": { "auth": "app", "tenantId": "<guid>",
                  "clientId": "<app id>",
                  "clientSecret": {"$env": "DOCINDEX_GRAPH_SECRET"} },
       "llm": { "provider": "aibuilder", "environmentUrl": "...",
                "modelId": "...",
                "dataverse": { "auth": "app", "tenantId": "<guid>",
                               "clientId": "<app id>",
                               "clientSecret": {"$env": "DOCINDEX_GRAPH_SECRET"} } },
       "spo": { "auth": "app", "tenantId": "<guid>",
                "clientId": "<app id>",
                "clientSecret": {"$env": "DOCINDEX_GRAPH_SECRET"} },
       "alerts": { "webhookUrl": {"$env": "DOCINDEX_ALERT_WEBHOOK"} },
       "sweep": { "remoteFiles": true, "promptVersion": "v2.0",
                  "dryRun": false }
     }
     ```
   - `DOCINDEX_GRAPH_SECRET` — the app registration's client secret.
   - `DOCINDEX_ALERT_WEBHOOK` — optional; alerts are MORE important
     here (nobody tails a runner log nightly).
2. **Variable**: set `HOSTED_SWEEP_ENABLED` = `true`.
3. **First run**: trigger `hosted-sweep` manually (workflow_dispatch)
   with `"dryRun": true` in the config secret; check the log's DocKey
   calibration + mirror lines; then flip to `"dryRun": false`.
4. **Turn the desktop task OFF** once the hosted run is green two
   nights straight — never both (same rule as the cloud-flow
   handover). Keep the Task Scheduler entry as rollback.

## How remote-files mode behaves (differences that matter)

- **Mirror**: each run lists the sidecar drive once (delta) and
  downloads only .md files that are new/changed vs the eTag manifest
  (`workDir/mirror-manifest.json`). On an ephemeral runner the
  Actions cache keeps the manifest + workspace warm; a cold cache
  just re-downloads the corpus (small — sidecars are text).
  Locally-mirrored .md files deleted remotely are pruned.
- **Writes**: sidecars, media, status/index pages upload
  through the drive API after each document (≤4 MB each — all
  corpus writes fit). An upload failure lands that doc in the Error
  lane (retried next run); status/index page upload failures only
  warn.
- **Known edge**: if a run dies between a local write and its
  upload, the local copy is newer than SharePoint until that doc
  next reindexes. On an ephemeral runner the local copy vanishes
  with the runner, so the doc simply reindexes from its stamps.
- **Media are write-only** in the sweep; the mirror doesn't download
  them (svg2pptx and friends are desktop tooling).
- **Recycle bin**: remote deletes go through the drive API, so
  SharePoint's recycle bin still catches replaced sidecars.

## Ops

- The status page, browse pages, alerts, heartbeat stamp and list
  backups all work unchanged (the heartbeat's dead-man task makes
  less sense on GitHub's scheduler — rely on the fatal/chronic
  webhook alerts, or keep `run_heartbeat.cmd` on any machine with
  the same webhook config and a synced `workDir`… simplest is the
  webhook alerts alone).
- AI spend is identical to the desktop sweep (same Predict calls).
- Rollback: set `HOSTED_SWEEP_ENABLED` to `false`, re-enable the
  desktop task.
