@echo off
rem Nightly Doc Index sweep — the Task Scheduler entry point.
rem Living in the repo keeps the scheduled action a single unquoted
rem path (schtasks chokes on the escaping "C:\Program Files\...\
rem node.exe" needs) and survives repo moves via %~dp0.
rem Output (sign-in prompts, errors, the summary line) appends to
rem work\sweep-task.log; per-run JSON logs land in work\ as usual.
cd /d "%~dp0.."
node --experimental-strip-types local\sweep.mjs --config local\config.json --live >> work\sweep-task.log 2>&1
