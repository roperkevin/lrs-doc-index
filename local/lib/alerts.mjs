/**
 * alerts.mjs v1.0 — push-style failure alerting + dead-man heartbeat
 * for the local pipeline (codebase review r7, risk R1). The status
 * page tells whoever OPENS it; these tell someone who doesn't.
 *
 * Config (config.alerts — all optional; absent = alerts off):
 *   webhookUrl      an incoming-webhook URL (Teams/Slack-compatible:
 *                   the alert posts {"text": "..."} JSON). Accepts
 *                   {"$env": "NAME"} like every other secret.
 *   maxSilentHours  dead-man threshold for --check-heartbeat
 *                   (default 48): how long since the last successful
 *                   live sweep before the silence itself is an alert.
 *
 * Heartbeat: every successful live full sweep stamps
 * workDir/last-success.json. `sweep.mjs --check-heartbeat` (run it
 * from a SECOND scheduled task, offset from the nightly — see
 * Local_Setup §10) reads the stamp and alerts when it is stale or
 * missing — which catches the failures the sweep itself cannot
 * report: the task never firing, the machine being off, the process
 * dying before its fatal handler. Alerting is best-effort by design
 * (one retry, 30s timeout); a down webhook must never fail a run.
 */

import fs from "node:fs";
import path from "node:path";

function resolveMaybeEnv(v) {
  if (v && typeof v === "object" && v.$env) return process.env[String(v.$env)] || "";
  return typeof v === "string" ? v : "";
}

const HEARTBEAT_NAME = "last-success.json";

export function heartbeatPath(cfg) {
  const dir = cfg?.paths?.workDir;
  return dir ? path.join(dir, HEARTBEAT_NAME) : null;
}

/**
 * POST {"text": subject + body} to the configured webhook.
 * Returns true when delivered; never throws.
 */
export async function sendAlert(cfg, subject, body) {
  const url = resolveMaybeEnv(cfg?.alerts?.webhookUrl);
  if (!url) return false;
  const text = `**${subject}**\n${String(body || "").slice(0, 3000)}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(30000),
      });
      if (res.ok) return true;
    } catch { /* retry once, then give up quietly */ }
  }
  process.stderr.write(`alert delivery failed (${subject})\n`);
  return false;
}

/** Stamp a successful live full sweep. Best-effort. */
export function recordHeartbeat(cfg, summary) {
  const file = heartbeatPath(cfg);
  if (!file) return;
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({
      at: new Date().toISOString(),
      processed: summary?.processed ?? 0,
      errors: summary?.errors ?? 0,
    }, null, 1));
  } catch (e) {
    process.stderr.write("heartbeat write failed: " + e.message + "\n");
  }
}

/**
 * The dead-man check (sweep.mjs --check-heartbeat): ok while the last
 * successful live sweep is younger than maxSilentHours; stale or
 * missing fires ONE alert describing what to look at. Reads only the
 * local stamp — no Graph, no sign-in — so it works even when the
 * pipeline is down because auth is.
 */
export async function checkHeartbeat(cfg) {
  const maxH = Number(cfg?.alerts?.maxSilentHours) || 48;
  const file = heartbeatPath(cfg);
  let stamp = null;
  try {
    stamp = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch { /* missing/unreadable = never succeeded */ }
  const at = stamp ? Date.parse(stamp.at) : NaN;
  const ageHours = isNaN(at) ? Infinity : (Date.now() - at) / 3600000;
  if (ageHours <= maxH) {
    return { ok: true, ageHours: Math.round(ageHours * 10) / 10, maxSilentHours: maxH };
  }
  const since = isNaN(at) ? "never (no heartbeat recorded)" : stamp.at;
  await sendAlert(
    cfg,
    "Doc Index sweep: NO successful run recorded",
    `Last successful live sweep: ${since} (threshold ${maxH}h).\n` +
    "Check the sweep machine: work\\sweep-task.log, the scheduled task, " +
    "and the _Sweep Status.md page. If the log says AUTH EXPIRED, run the " +
    "sweep once from a console and complete the sign-in."
  );
  return { ok: false, ageHours: isFinite(ageHours) ? Math.round(ageHours * 10) / 10 : null, maxSilentHours: maxH };
}
