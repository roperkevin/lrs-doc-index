# Local sweep — release notes

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
