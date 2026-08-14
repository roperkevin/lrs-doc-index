# PAD offload — build + deploy guide (component v2.0)

Moves the Doc Index script compute off the Excel Online (Business)
connector's **Run script** action and onto a Power Automate Desktop
machine running Node. Motivation: Run script is capped at **1,600
calls per user per day** (resets 00:00 UTC — the "Out of call volume
quota" error). Flow v2.8 spends up to ~10 calls per pptx doc
(zip + media + regex + shortlist + rank + up to 5 sidecar patches);
at `Config.MaxDocsPerRun = 150` a backfill run is ~1,500 calls — the
quota, gone, in one nightly run. Offloaded ops consume **zero** Run
script calls; desktop-flow invocations count only against the (far
higher) Power Platform request limits.

The design keeps `scripts/` as the single source of truth: the Node
runner (`pad/runner/run_job.mjs`) executes the **unmodified** script
files under Node type-stripping — the same trick as
`review/harness/wrap.py` — so nothing is forked and every existing
gate keeps protecting the offloaded path. The runner's own gate is
`pad/harness/check_pad_runner.py` (CI: the `fixture-free` job).

Licensing: triggering desktop flows from cloud flows in **attended**
mode is included in Power Automate Premium (the same license the HTTP
action needs). Unattended mode is a paid add-on and is NOT assumed
anywhere below — read §6 before relying on a night schedule.

## 1. Machine prerequisites

- Windows PC with [Power Automate Desktop](https://learn.microsoft.com/en-us/power-automate/desktop-flows/install)
  installed, signed in to the same environment as DocIndexSweep, and
  the machine **registered** (PAD → Settings → machine runtime; it
  must show Connected in the Power Automate portal under Machines).
- **Node 22.6 or later** (`winget install OpenJS.NodeJS.LTS`). The
  runner is invoked with `--experimental-strip-types`; from Node 23.6
  stripping is built in and the flag is tolerated. If your Node
  rejects the flag, edit it out of the Run DOS command action.
- A local copy of this repo, e.g. `C:\DocIndex\lrs-doc-index`
  (`git clone` preferred — then **updating the machine is
  `git pull`**, which for offloaded ops replaces the "paste into the
  Automate workbook" promotion step; note the deployed-version
  implications in §7).
- A local scratch folder, e.g. `C:\DocIndex\work`.
- For binary ops (`ziptext`/`media`/`workbookdump`) the cheap path is
  the **OneDrive-synced Documents library**: sync the
  LocationReferencing Documents library once with the OneDrive client
  and pass local file paths in jobs — no payload plumbing at all.
  (Alternative: pass `zipBase64` by value; see §5.)

## 2. The runner, standalone

Smoke it before PAD is involved:

```
cd C:\DocIndex\lrs-doc-index
node --experimental-strip-types pad\runner\run_job.mjs pad\samples\job.sample.json
```

Prints `{"ok":true,...,"resultFile":"...job.sample.json.result.json"}`;
the result file holds one entry per op, each wrapped as
`{"result": ...}` to mirror the Excel connector's envelope. Op
reference and job format: header comment of `pad/runner/run_job.mjs`.
The nine flow v2.8 Run-script actions map 1:1 onto the six ops.

Since v2.0 the runner also has a **single-op mode** — run one script
with no job JSON at all:

```
node --experimental-strip-types pad\runner\run_job.mjs --op workbookdump "file=C:\Docs\Book.xlsx"
node --experimental-strip-types pad\runner\run_job.mjs --op ziptext "file=C:\Docs\Deck.pptx" mediaPrefix=../media/doc42_
```

`--op` takes an op or script name (case-insensitive), params are
plain `key=value` arguments (`file=` is the op's source-file param;
`key@=<path>` reads a value from a file; `--argsfile` takes a file of
such lines; `--out` sets the result path). The result envelope is
identical to a one-op batch job's — the gate proves it. Full
reference: the runner's header comment.

## 3. Create the desktop flow

PAD flows are not imported as packages — they are pasted as Robin
text.

1. Power Automate Desktop → **New flow** → name `DocIndexCompute` →
   open the designer.
2. In the **Variables** pane create input/output variables FIRST
   (the paste references them):

   | Direction | Name | Notes |
   |---|---|---|
   | Input | `ScriptName` | op/script name (e.g. `workbookdump`) → quick-run mode; empty → batch mode |
   | Input | `SourceFile` | local path of the op's source file (quick-run; ziptext/media/workbookdump) |
   | Input | `ScriptArgs` | extra params, `key=value` lines, one per line (quick-run) |
   | Input | `JobText` | job JSON by value (batch); leave empty when using `JobFilePath` |
   | Input | `JobFilePath` | local path of a job .json (batch); empty when using `JobText` |
   | Input | `RepoRoot` | e.g. `C:\DocIndex\lrs-doc-index` — **give it that as its default value** |
   | Input | `LocalWorkDir` | e.g. `C:\DocIndex\work` — default it too (required in quick-run mode and with `JobText`) |
   | Input | `NodeExePath` | optional `node.exe` override; empty = PATH |
   | Output | `ExitCode` | 0 = job ran (per-op errors live in the result) |
   | Output | `ResultText` | the result JSON, by value |
   | Output | `ResultFilePath` | result path (for file-based pickup) |
   | Output | `RunnerStdout` | one-line runner summary |
   | Output | `RunnerStderr` | diagnostics when `ExitCode` ≠ 0 |

   Defaulting `RepoRoot` and `LocalWorkDir` in the Variables pane is
   what makes quick runs one-field affairs — every console run then
   needs only `ScriptName` (+ `SourceFile`).

3. Select the Main canvas and paste the whole contents of
   `pad/flow/DocIndexCompute.robin.txt` (Ctrl+V pastes Robin text as
   actions). Save.
4. If your PAD version rejects the paste (action serialization
   drifts between releases), rebuild the actions by hand — one
   IF/ELSE picks the mode, everything else is shared:

   | # | Action | Parameters |
   |---|---|---|
   | 1 | Set variable | `NodeCmd` = `node` |
   | 2 | If `%NodeExePath% <> ''` | then Set variable `NodeCmd` = `%NodeExePath%`; End |
   | 3 | Set variable | `RunJobPath` = `%RepoRoot%\pad\runner\run_job.mjs` |
   | 4 | Set variable | `ResultText` = empty text |
   | 5 | If `%ScriptName% <> ''` | **quick-run branch** — actions 6–10 go inside the If |
   | 6 | Set variable | `ArgsText` = `%ScriptArgs%` |
   | 7 | If `%SourceFile% <> ''` | then Set variable `ArgsText` = two lines in the value editor: `file=%SourceFile%` then `%ScriptArgs%`; End |
   | 8 | Set variable + Write text to file | `ArgsFilePath` = `%LocalWorkDir%\op.args`; **Write text to file**: file `%ArgsFilePath%`, text `%ArgsText%`, overwrite, UTF-8, no appended newline |
   | 9 | Set variable | `ResultFilePath` = `%LocalWorkDir%\op.result.json` |
   | 10 | Run DOS command | `"%NodeCmd%" --experimental-strip-types "%RunJobPath%" --op %ScriptName% --argsfile "%ArgsFilePath%" --out "%ResultFilePath%"`, working dir `%RepoRoot%`, timeout 1800 s, outputs → `RunnerStdout` / `RunnerStderr` / `ExitCode` |
   | 11 | Else | **batch branch** — actions 12–14 go inside the Else |
   | 12 | If `%JobText% <> ''` | then Set variable `JobFilePath` = `%LocalWorkDir%\job.json`; **Write text to file**: file `%JobFilePath%`, text `%JobText%`, overwrite, UTF-8, no appended newline; End |
   | 13 | Set variable | `ResultFilePath` = `%JobFilePath%.result.json` |
   | 14 | Run DOS command | `"%NodeCmd%" --experimental-strip-types "%RunJobPath%" "%JobFilePath%"`, same settings as action 10; then End (closing the Else) |
   | 15 | If `%ExitCode% = 0` | then **Read text from file**: `%ResultFilePath%`, UTF-8 → `ResultText`; End |

5. Run it once from the PAD console with
   `JobFilePath = <RepoRoot>\pad\samples\job.sample.json` and check
   `ResultText`.

### Quick-run recipes (running one script from the console)

Set `ScriptName` (+ fields below), hit Run, read `ResultText` — the
op's output is at `results[0].result`. No job JSON, no escaping:
`ScriptArgs` values are raw text to end of line, so Windows paths and
spaces need no quoting.

| To run | `ScriptName` | `SourceFile` | `ScriptArgs` |
|---|---|---|---|
| WorkbookDump on an xlsx | `workbookdump` | `C:\Docs\Book.xlsx` | — (optional `maxCells=60000`) |
| ZipTextExtract on a pptx/docx | `ziptext` | `C:\Docs\Deck.pptx` | `mediaPrefix=../media/doc42_` |
| MediaExtract | `media` | `C:\Docs\Deck.pptx` | — |
| RegexExtract | `regex` | — | `fileName=ExB - Doc V3.pptx`, `defaultRepo=A/b`, `content@=C:\DocIndex\work\content.txt` (one per line) |

Script file names work too (`ScriptName = WorkbookDump`), and
`key@=<path>` reads any param's value from a file — the way to feed
`regex` multi-line content or `related`/`sidecarpatch` JSON blobs.
Batch mode is unchanged: leave `ScriptName` empty and pass
`JobText`/`JobFilePath` as before.

## 4. Batch shape — pick before wiring the cloud side

Every desktop-flow invocation carries queueing + session overhead
(tens of seconds), and one machine runs them serially. Budget for a
150-doc backfill night:

| Shape | Desktop calls/night | Feels like |
|---|---|---|
| Per Run-script call (drop-in) | ~1,200–1,500 | days — **smoke tests only** |
| Per doc (3 bundles: extract / rank / patch) | ~450 | ~4 h — borderline |
| Per sweep phase (two batches, §5B) | 2 | minutes of overhead — **production** |

The runner is batch-native either way — a job's `ops` array can hold
one op or a thousand.

## 5. Cloud wiring

### A. Drop-in (per call — smoke and low-volume only)

Replace a `Run script` action with:

1. **Compose** — the job JSON: `{"ops":[{ ...one op... }]}` with the
   op's params carrying exactly the expressions the Run-script action
   binds today (table below).
2. **Run a flow built with Power Automate for desktop** — attended,
   `JobText` = `string(outputs('Compose_job'))`, plus `RepoRoot` /
   `LocalWorkDir`.
3. **Parse JSON** on `ResultText`, then consume
   `body('Parse_pad_result')?['results']?[0]?['result']` where the
   old expression read `outputs('<action>')?['body/result']`. The
   inner shapes are identical (that is what the gate's parity leg
   proves), so only the prefix of each expression changes.

Op mapping (from the flow v2.8 bindings):

| Flow action | op | Params |
|---|---|---|
| `Zip_extract_pptx` / `_docx` | `ziptext` | `zipFile`: local synced path of the source file (or `zipBase64`: `body('Get_content_*')?['$content']`); `mediaPrefix`: `concat('../media/doc', ID, '_')` |
| `Extract_media_pptx` / `_docx` | `media` | `zipFile` / `zipBase64` as above |
| `Run_regex` | `regex` | `fileName`, `content` (`DocText` + newline + `RelsText`), `defaultRepo` (Config), `title` |
| `Dump_workbook` | `workbookdump` | `xlsxFile`: local synced path; `maxCells`: 60000 |
| `Run_related_shortlist` | `related` | `selfId`, `mode:"shortlist"`, the six `*Json` strings exactly as bound today, `configJson` (Config.RelatedWeights), `topN` |
| `Run_related_rank` | `related` | same with `mode:"final"` |
| `Run_sidecar_patch` | `sidecarpatch` | `filesJson` (`Files_for_patch`), `selfId`, `rankedJson` (the rank result's `related`), `docsMetaJson`, `selfMetaJson`, `topN` |

Payload notes: any string param may be `{"$file":"<local path>"}`;
`*Json` params accept real JSON values (no `string()` wrapping
needed inside `JobText`). Local paths beat base64 — synced-library
reads have no size ceiling and no sync lag for pre-existing files.
If a result may be large (MediaExtract can return ~3 MB of image
base64), set `"resultFile"` in the job to a synced-folder path and
pick the file up in the cloud instead of relying on `ResultText`.

### B. Two-phase batch (production)

One desktop call per phase per sweep; requires restructuring the
per-doc loop, so treat it as its own flow version with a maintenance
window (the designer-edits pattern):

- **Phase 1 — extraction.** Build one job with
  `ziptext`+`media`+`regex` (+`workbookdump`) ops for every doc in
  the run (files read from the synced library), run DocIndexCompute
  once, Parse JSON once; then the existing per-doc loop consumes
  per-doc results by `id` (give each op `"id": <doc ID>-<op>`), does
  AI Builder + list upserts + sidecar writes exactly as today.
- **Phase 2 — relatedness.** After the loop has upserted rows/edges,
  build the second job with `related` (shortlist+final) and
  `sidecarpatch` ops for every doc, run DocIndexCompute once, and
  apply the patched files/rank results in a second, script-free loop.

AI Builder, SharePoint reads/writes, and the prompt contract are
untouched — this only relocates the nine compute calls.

## 6. Attended runs — the operational gate

Attended desktop flows run in your active Windows session: the
machine must be **on, awake, connected, and signed in** when the
trigger fires; a locked or logged-out machine fails/queues the run.
Unattended mode removes that constraint but is a paid add-on. Before
trusting the nightly schedule:

1. Create a throwaway cloud flow: recurrence at the sweep's hour →
   run DocIndexCompute with the sample job.
2. Leave the machine in its true overnight state.
3. Check the run next morning.

If it failed, either move the DocIndexSweep trigger to a time the
machine is reliably awake, adjust power/lock policy (keeping an
unlocked overnight session is a security trade-off — see §8), or
budget for the unattended add-on. Also set the cloud-side desktop
action timeout generously (a queued attended run waits for the
session).

## 7. Parity + versioning caveats

- **WorkbookDump** is the one script that really reads a workbook.
  The runner rebuilds its grid from the xlsx parts
  (`pad/runner/xlsx_grid.mjs`): formula cells yield their cached
  values (same as the connector on a closed file); date-formatted
  numbers render `m/d/yyyy` (+ `h:mm`); other numbers render as
  Excel "General" via JS stringification. Content-equivalent; exotic
  number formats may render differently than Excel would. The other
  five scripts take no workbook input — their outputs are
  byte-identical by construction (gate parity leg).
- **Deployed-version bookkeeping**: for offloaded ops, "pasted on
  tenant" becomes "commit checked out on the PAD machine". Promote
  with `git pull` on the machine and record the commit in STATUS the
  way pastes are recorded today. If the Automate-tab workbook is
  kept as a fallback path, its pasted versions must keep tracking
  STATUS separately — do not let the two drift silently.
- Runner exit code 0 means the **job** ran; individual op failures
  are inside the result (`failures` count + per-op `ok`/`error`).
  Cloud side: branch on `ExitCode`, then on the parsed `failures`.

## 8. Security

The PAD machine holds a repo copy, synced document content, and job/
result files with extracted text. Keep it on the tenant's managed/
encrypted footprint, scope the synced folders to what the flow needs,
and clear `LocalWorkDir` on a schedule if retention matters. An
unlocked overnight session (§6) widens local exposure — prefer
moving the sweep window or the unattended add-on where that matters.
