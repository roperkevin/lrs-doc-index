@echo off
rem The catalog wiki — render the sidecar library into the MkDocs tree
rem and push it to the wiki repository (wiki.repoUrl). Schedule it
rem after the nightly sweep (register ops\wiki_task.xml). Same shape
rem as run_sweep.cmd: self-updating, log-rotating, one unquoted path.
cd /d "%~dp0.."
if not exist work mkdir work

for %%A in (work\wiki-task.log) do if exist %%A if %%~zA gtr 5000000 move /y work\wiki-task.log work\wiki-task.prev.log >nul

echo === wiki start %date% %time% >> work\wiki-task.log

rem self-update from the CI-promoted `deploy` branch (see run_sweep.cmd)
git fetch origin deploy >> work\wiki-task.log 2>&1
git merge --ff-only origin/deploy >> work\wiki-task.log 2>&1

node --experimental-strip-types pipeline\wiki.mjs --config config.json --push >> work\wiki-task.log 2>&1
