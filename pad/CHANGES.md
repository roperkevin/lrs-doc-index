# PAD offload — release notes

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
