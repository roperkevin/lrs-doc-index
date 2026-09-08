@echo off
rem Weekly keyword curation — the Task Scheduler entry point
rem (Saturday 08:00; register ops\curation_task.xml). Same shape as
rem run_sweep.cmd: self-updating, log-rotating, one unquoted path.
cd /d "%~dp0.."
if not exist work mkdir work

for %%A in (work\curate-task.log) do if exist %%A if %%~zA gtr 5000000 move /y work\curate-task.log work\curate-task.prev.log >nul

echo === curate start %date% %time% >> work\curate-task.log

rem self-update from the CI-promoted `deploy` branch (see run_sweep.cmd)
git fetch origin deploy >> work\curate-task.log 2>&1
git merge --ff-only origin/deploy >> work\curate-task.log 2>&1

node --experimental-strip-types pipeline\curate.mjs --config config.json --live >> work\curate-task.log 2>&1
rem the second reader (curation.review.enabled) may have approved merges
rem in the run above: re-point the historical junction rows and refresh
rem the related sections (both no-ops when nothing was merged)
node --experimental-strip-types pipeline\curate.mjs --config config.json --repoint --live >> work\curate-task.log 2>&1
node --experimental-strip-types pipeline\sweep.mjs --config config.json --rerank --live >> work\curate-task.log 2>&1
