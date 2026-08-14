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
| AI Builder prompt | Direct LLM API call (`local/llm.mjs`), same `prompts/DocIndex_Prompt.md` text verbatim |
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
- Environment variables (machine or user scope):
  - `DOCINDEX_GRAPH_SECRET` — the Entra app client secret (§2)
  - **No LLM key** — the LLM step signs in with your Claude account
    (§3). Keep `ANTHROPIC_API_KEY` UNSET on this machine.

## 2. Entra app registration (Graph)

1. Entra admin center → App registrations → New. Single tenant.
2. API permissions → Microsoft Graph → **Application** permissions →
   `Sites.Selected` (preferred; grant the app `write` on the
   lrsworkspace site and `read` on LocationReferencing via the
   [site permissions endpoint](https://learn.microsoft.com/en-us/graph/api/site-post-permissions)),
   or `Sites.ReadWrite.All` if Sites.Selected is more ceremony than
   your tenant wants. Admin consent required either way.
3. Certificates & secrets → new client secret → store it as
   `DOCINDEX_GRAPH_SECRET` on the machine (never in config.json).
4. Put the tenant id + client id in `local/config.json` (§4).

## 3. LLM auth — no API key

The classify/keyword step calls the Anthropic Messages API directly
(raw HTTPS, no npm dependencies — the repo stays `git pull`-deployable)
with the deployed prompt read from `prompts/DocIndex_Prompt.md`
between its BEGIN/END markers. Prompt promotion is now *just the
repo file*: edit, bump `sweep.promptVersion` in config, `git pull`
on the machine — no tenant paste. Model defaults to `claude-opus-5`
(`llm.model` to override); the request pins the nine-field output
contract with a JSON schema, so the flow's brace-slice fallback
parsing is no longer needed. Refusal/truncation surface as Error rows.

**Auth is your Claude account, not a key** (`llm.auth: "oauth"`, the
default):

1. Install the [Anthropic CLI](https://platform.claude.com/docs/en/api/sdks/cli)
   (`ant`) on the machine.
2. `ant auth login` — one-time browser sign-in; a profile with a
   refresh token lands under your user config dir.
3. Done. Each sweep mints short-lived bearer tokens via
   `ant auth print-credentials --access-token` (auto-refreshing; the
   sweep re-mints every 5 minutes and on any 401).

Two traps, both documented CLI behavior:
- **An exported `ANTHROPIC_API_KEY` silently outranks the profile** —
  keep it unset on this machine.
- **Refresh tokens eventually hard-expire** (they don't slide with
  use). When a long-working setup starts failing auth, re-run
  `ant auth login` before debugging anything else. Error rows with
  `llm: ...` LastError retry automatically next run once you have.

Fallback for a metered key (e.g. a service account for unattended
governance): `"llm": {"auth": "apiKey", "apiKey": {"$env": "..."}}`.
Another provider (e.g. Azure) means reimplementing `requestJson()` in
`local/llm.mjs` — `classifyDoc()`'s contract is provider-agnostic.

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
writes, a plan file in `paths.workDir`. Flags: `--live` (perform
writes), `--dry-run`, `--max N` (cap docs), `--only <filename>` (the
SmokeFile equivalent — one doc).

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
- **Schema-guaranteed LLM JSON** replaces brace-slice parsing;
  malformed output still lands in the Error lane.
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
- **Quota math**: zero Excel Online Run-script calls, zero AI Builder
  credits, zero Power Platform requests. The LLM spend is per-doc
  (one call each) and only for docs that need indexing.

## 8. Security

Same footprint as the PAD machine (`pad/PAD_Setup.md` §8) plus two
credentials: the Graph client secret (scope it with Sites.Selected;
rotate on schedule; machine environment variable, never in the repo
or config.json) and the Claude account OAuth profile (short-lived
access tokens; the refresh token sits in your user config dir under
the machine's disk encryption — sign out with `ant auth logout` when
decommissioning). Document text is sent to the LLM API for
classification — the same class of egress the AI Builder call made,
now governed by the LLM provider's data terms instead of the Power
Platform's; clear it with whoever owns that decision before --live.
