@echo off
rem Dead-man check — a SECOND Task Scheduler entry, offset from the
rem nightly sweep (e.g. daily 09:00): alerts through config.alerts
rem when no successful live sweep has been recorded within
rem alerts.maxSilentHours (default 48). Catches what the sweep itself
rem cannot report: the task never firing, the machine being off, the
rem process dying before its fatal handler. Local-only — no sign-in,
rem so it still reports when the pipeline is down BECAUSE auth is.
cd /d "%~dp0.."
if not exist work mkdir work
echo === heartbeat check %date% %time% >> work\heartbeat-task.log
node --experimental-strip-types local\sweep.mjs --config local\config.json --check-heartbeat >> work\heartbeat-task.log 2>&1
