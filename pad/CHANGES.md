# PAD offload — release notes

## v2.5 (2026-09-05)

`runner/ops.mjs` / `run_job.mjs`: the `figures` op is removed with
`scripts/SlideFigures.ts` (SVG figure generation dropped from the
project, local sweep v1.58). SCRIPT_FILES, the `file=` alias table
and the op dispatch no longer know it; every other op is unchanged.

## v2.4 (2026-09-03)

`runner/ops.mjs`: the `figures` op takes an optional `ocrJson` param
(SlideFigures v2.1 / DF-12 — per-picture OCR transcriptions,
`[{ entry, words: [{x,y,w,h,t,c?}] }]`), passed through like every
other optional param ($file indirection included). Omitted, the call
and its result are what they were — the sweep's wireframe-OCR loop
(local v1.40) is the only caller that sets it. Gate re-PASSED 27/27.

## v2.3 (2026-08-14)

`runner/ops.mjs`: the script loading + op dispatch (SCRIPT_FILES,
loadScripts, runOp, param plumbing) extracted from `run_job.mjs` into
a shared module so the new local sweep (`local/sweep.mjs`) drives the
unmodified `scripts/` through the same gated path. `run_job.mjs` now
imports it; CLI behavior and result shapes are byte-identical. Gate
re-PASSED 27/27.

## v1.0 (2026-08-14)

New component: Power Automate Desktop compute offload for the Doc
Index scripts — the workaround for the Excel Online **Run script**
daily quota (1,600 calls/user/day; flow v2.8 spends up to ~10 per
pptx doc, so a 150-doc backfill run ≈ the whole quota).

- `runner/run_job.mjs` — Node batch runner. Executes the UNMODIFIED
  `scripts/*.ts` under Node type-stripping (the
  `review/harness/wrap.py` trick — nothing forked, every existing
  gate still covers the offloaded path). One job file, N ops; the
  nine flow v2.8 Run-script actions map 1:1 onto six ops; each
  result wrapped `{"result": ...}` to mirror the connector envelope,
  so cloud expressions only change their prefix. String params
  accept `{"$file": path}` indirection; `*Json` params accept real
  JSON values.
- `runner/xlsx_grid.mjs` — xlsx → per-sheet text grids feeding
  WorkbookDump's workbook mock (shape of
  `review/harness/wrap_workbook.py`): stdlib zip reader, shared
  strings, cached formula values, date-format detection
  (`m/d/yyyy` rendering — the one documented parity approximation;
  the other five scripts are byte-identical by construction).
- `flow/DocIndexCompute.robin.txt` — the desktop flow, paste-ready
  Robin (PAD has no package import): optional by-value `JobText` or
  by-path `JobFilePath`, Node invocation, result read-back into
  `ResultText`. Manual-rebuild table in the guide for PAD versions
  that reject the paste.
- `harness/check_pad_runner.py` — gate (stdlib + Node 22+, generated
  fixtures, CI `fixture-free` job): all op shapes through one batch
  job, behavior spot-checks (extraction, media caps, regex ids,
  WorkbookDump GFM incl. date serials, shortlist/final ranking,
  sidecar patch frame + folder pass-through), plus a parity leg
  proving the runner's ZipTextExtract output is JSON-identical to a
  direct `wrap.py` run. **Gate PASSED 2026-08-14 (21/21).**
- `PAD_Setup.md` — machine prereqs, flow creation, batch-shape
  budget (per-call ≈ smoke only; two-phase per-sweep ≈ production),
  cloud wiring tables, attended-run gate test, parity/versioning
  caveats, security notes.
- `samples/job.sample.json` — fixture-free smoke job.

Deployment state: **authored, nothing on tenant**. The offload is
opt-in per wiring (§5 of the guide); the Automate-tab workbook path
keeps working unchanged.

## v2.2 (2026-08-14)

Second live-paste fix for `flow/DocIndexCompute.robin.txt`: the v2.1
paste failed with "Module 'System' or action 'RunDOSCommand' wasn't
found" — the action moved modules between PAD releases. The flow now
addresses it as `Scripting.RunDOSCommand.RunDOSCommand` (the module
current PAD builds file it under); `System.RunDOSCommand` is the
legacy selector, noted in the flow header for old builds. Same
parameters, behavior unchanged; §3 troubleshooting records the
error string for the next drift.

## v2.1 (2026-08-14)

Paste fix for `flow/DocIndexCompute.robin.txt`: the two v2.0 Run DOS
command actions were rejected by a live PAD paste — the only lines
carrying `\"` escape sequences and a `Timeout` parameter. v2.1
removes both failure surfaces instead of guessing at their dialect:

- each branch now builds the full command line in a plain SET
  (double quotes raw inside the `$''' '''` literal, where they are
  inert — SET actions paste clean);
- the Run DOS command action deduplicates to a single post-IF/ELSE
  action holding only bare variable references
  (`DOSCommandOrApplication: CommandLine`, `WorkingDirectory:
  RepoRoot`) with default advanced settings — no timeout parameter;
  use the cloud-side desktop-flow action timeout instead (§6).

Behavior is unchanged; the manual-rebuild table is updated to match
(command built in SETs, one Run DOS command), and §3 gains a
dialect-capture procedure: build the offending action by hand,
Ctrl+C it into Notepad to read your PAD version's exact
serialization, and fix the .robin.txt to match.

## v2.0 (2026-08-14)

Full rebuild of the desktop flow around ease of running scripts —
the v1.x flow required authoring a batch job JSON even for a single
script run.

- `runner/run_job.mjs` v2.0 — new **single-op CLI mode**:
  `--op <name> key=value ...` builds the one-op job internally, so
  no job JSON (and no JSON escaping of Windows paths) is ever
  authored by hand. `<name>` accepts op or script file names,
  case-insensitive; `file=` maps to the op's source-file param
  (zipFile / xlsxFile); `key@=<path>` reads a value from a file
  (the `$file` indirection, CLI-shaped); `--argsfile` takes a file
  of such lines (blank/`#` lines skipped, values raw to end of
  line); `--out` sets the result path. Everything downstream of the
  parsed job is the v1.0 batch path — batch mode itself is
  byte-for-byte unchanged, and the result envelope is identical by
  construction.
- `flow/DocIndexCompute.robin.txt` v2.0 — rebuilt with two modes on
  one IF/ELSE: **quick-run** (new inputs `ScriptName`, `SourceFile`,
  `ScriptArgs` — the flow writes the args file and invokes `--op`)
  and **batch** (`JobText`/`JobFilePath`, logic identical to v1.1).
  Same five outputs. With `RepoRoot`/`LocalWorkDir` given default
  values in the Variables pane, a console run of any script is
  ScriptName + SourceFile and Run. v1.1 Robin dialect kept.
- `harness/check_pad_runner.py` — new single-op leg: key=value
  parsing, script-name aliasing, `@=` indirection, `file=` alias,
  args-file parsing (CRLF, comments, blanks), and single-op results
  proven JSON-identical to the same ops through a batch job.
  **Gate PASSED 2026-08-14 (27/27).**
- `PAD_Setup.md` v2.0 — §2 single-op examples, §3 rebuilt (new
  variables table, 15-action manual-rebuild table, quick-run
  recipes).

Redeploy: `git pull` on the PAD machine, then rebuild the flow —
create the three new input variables and re-paste the Robin (or
follow the §3 table). Existing cloud wiring is untouched: batch
invocations of the flow behave exactly as v1.1.

## v1.1 (2026-08-14)

Robin re-serialization of `flow/DocIndexCompute.robin.txt`, matching
the dialect of a live PAD export after v1.0's paste was rejected:

- variable references in action parameters and IF conditions are
  bare names (`IF JobText <> ...`, `File: JobFilePath`); the
  `%Var%` form remains only for interpolation inside `$''' '''`
  literals;
- double quotes inside literals are escaped `\"` (v1.0's Run DOS
  command carried six bare quotes — enough to void the whole paste);
- actions and logic unchanged; the §3 manual-rebuild table still
  produces the identical flow.
