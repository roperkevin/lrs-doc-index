@echo off
rem Nightly Doc Index sweep — the Task Scheduler entry point.
rem Living in the repo keeps the scheduled action a single unquoted
rem path (schtasks chokes on the escaping "C:\Program Files\...\
rem node.exe" needs) and survives repo moves via %~dp0.
rem Output (auth notices, errors, the summary line) appends to
rem work\sweep-task.log; per-run JSON logs land in work\ as usual
rem (the sweep prunes those to the newest 30 itself).
cd /d "%~dp0.."
if not exist work mkdir work

rem rotate the log once it passes ~5 MB (keeps one previous generation)
for %%A in (work\sweep-task.log) do if exist %%A if %%~zA gtr 5000000 move /y work\sweep-task.log work\sweep-task.prev.log >nul

echo === sweep start %date% %time% >> work\sweep-task.log

rem self-update from the CI-promoted `deploy` branch: main advances
rem `deploy` only after every harness suite is green (the workflow's
rem promote job), so a red main can never reach the nightly run.
rem --ff-only can never wedge this machine — if the merge can't
rem fast-forward (or `deploy` doesn't exist yet) it just runs the
rem version already checked out.
git fetch origin deploy >> work\sweep-task.log 2>&1
git merge --ff-only origin/deploy >> work\sweep-task.log 2>&1

node --experimental-strip-types local\sweep.mjs --config local\config.json --live >> work\sweep-task.log 2>&1
