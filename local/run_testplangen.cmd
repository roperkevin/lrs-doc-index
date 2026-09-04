@echo off
rem Nightly auto test-plan drafting — the Task Scheduler entry point
rem (schedule AFTER the nightly sweep, e.g. daily 18:30, so fresh
rem stories carry tonight's related: lines). Same shape as
rem run_curate.cmd: self-updating, log-rotating, one unquoted path.
rem INERT until testplangen.autoDraft: true is set in local\config.json
rem (the owner switch — Local_Setup.md §11): without it the run exits
rem with a one-line refusal and drafts nothing.
cd /d "%~dp0.."
if not exist work mkdir work

for %%A in (work\testplangen-task.log) do if exist %%A if %%~zA gtr 5000000 move /y work\testplangen-task.log work\testplangen-task.prev.log >nul

echo === testplangen auto start %date% %time% >> work\testplangen-task.log

rem self-update from the CI-promoted `deploy` branch (see run_sweep.cmd)
git fetch origin deploy >> work\testplangen-task.log 2>&1
git merge --ff-only origin/deploy >> work\testplangen-task.log 2>&1

node --experimental-strip-types local\testplangen.mjs --config local\config.json --auto --live >> work\testplangen-task.log 2>&1
