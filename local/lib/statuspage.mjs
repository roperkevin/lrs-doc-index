/**
 * statuspage.mjs — the "_Sweep Status.md" pipeline-health page, moved
 * verbatim out of sweep.mjs v1.30 (module split; covered by
 * check_local_sweep.py's status-page assertions). v1.34 adds the
 * recent-runs trend table read from the per-run JSON logs.
 */

import fs from "node:fs";
import path from "node:path";

/**
 * Recent-run trend rows (v1.34): the newest `keep` full-sweep run
 * logs in workDir, oldest first. Only full-mode summaries qualify
 * (rerank/reformat logs lack library_items_seen). Best-effort — an
 * unreadable log is skipped.
 */
function recentRuns(runLogDir, keep = 14) {
  let names;
  try {
    names = fs.readdirSync(runLogDir)
      .filter((f) => /^sweep-.*\.json$/.test(f)).sort().slice(-3 * keep);
  } catch {
    return [];
  }
  const rows = [];
  for (const f of names) {
    try {
      const s = JSON.parse(fs.readFileSync(path.join(runLogDir, f), "utf8")).summary;
      if (!s || s.library_items_seen === undefined) continue;
      // stamp "sweep-YYYY-MM-DDTHHMM.json" -> "YYYY-MM-DD HHMM"
      const m = /^sweep-(\d{4}-\d{2}-\d{2})T(\d{2})(\d{2})/.exec(f);
      rows.push({
        when: m ? `${m[1]} ${m[2]}:${m[3]}` : f,
        processed: s.processed ?? 0,
        errors: s.errors ?? 0,
        smoke: s.smoke ? "smoke" : "",
      });
    } catch { /* skip unreadable */ }
  }
  return rows.slice(-keep);
}

/**
 * "_Sweep Status.md" in the sidecar library root: pipeline health
 * where the team already looks, without touching the sweep machine.
 * Live runs only (a dry run is a rehearsal); also written on a fatal
 * abort so a dead scheduled run is visible in SharePoint.
 */
export function writeStatusPage(cfg, { summary, logFile, errorLane, streaks, fatal, runLogDir }) {
  const dir = cfg?.paths?.sidecarLibrary;
  if (!dir) return;
  const esc = (s) => String(s).replaceAll("|", "\\|").replaceAll("\n", " ").slice(0, 140);
  const lane = [...(errorLane?.entries() ?? [])].map(([k, v]) => ({
    ...v,
    streak: Number(streaks?.[k]) || 1,
  }));
  const chronic = lane.filter((d) => d.streak >= 3).length;
  const action = fatal
    ? `**RUN FAILED — needs attention.** ${esc(fatal)}\n\n` +
      "If the error above says AUTH EXPIRED, run the sweep once from a " +
      "console on the sweep machine and complete the sign-in."
    : lane.length
      ? `${lane.length} document(s) are stuck in the Error lane (table below). ` +
        "They retry automatically every run" +
        (chronic
          ? `; **${chronic} of them have been stuck 3+ nights** — those need a look.`
          : "; a doc that stays here across several nights needs a look.")
      : "None — pipeline healthy.";
  const md = [
    "# Doc Index Sweep — status",
    "",
    "_Written automatically by the local sweep after every live run._",
    "",
    `- **Last run:** ${new Date().toISOString()}`,
    `- **Result:** ${fatal ? "FAILED" : `${summary.processed} processed, ${summary.errors} errors, ${summary.library_items_seen} library items scanned`}`,
    `- **Prompt version:** ${cfg.sweep?.promptVersion ?? ""}`,
    `- **Run log:** \`${logFile || "(none — run aborted before logging)"}\` on the sweep machine`,
    ...(summary.out_of_scope
      ? [`- **Out of sync scope:** ${summary.out_of_scope} doc(s) stamped Skipped this run — widen the OneDrive sync to cover them and they re-index automatically on the next run`]
      : []),
    ...(summary.archived
      ? [`- **Archived this run:** ${summary.archived} row(s) whose source was deleted from the library (sidecars pruned; a restored doc re-indexes automatically)`]
      : []),
    ...(summary.cases_upserted || summary.cases_removed || summary.case_errors
      ? [`- **Test cases:** ${summary.cases_upserted ?? 0} row(s) upserted, ${summary.cases_removed ?? 0} removed` +
         (summary.case_errors ? ` — **${summary.case_errors} case-write error(s)**, see the run log` : "")]
      : []),
    "",
    "## Action needed",
    "",
    action,
    "",
    `## Error lane (${lane.length})`,
    "",
    ...(lane.length
      ? ["| Document | Nights stuck | Last error |", "|---|---|---|",
         ...lane.map((d) => `| ${esc(d.name)} | ${d.streak} | ${esc(d.err)} |`)]
      : ["(empty)"]),
    "",
    ...(() => {
      // trend table (v1.34): drift — creeping errors, shrinking
      // throughput — visible where the team looks
      const runs = runLogDir ? recentRuns(runLogDir) : [];
      if (!runs.length) return [];
      return [
        `## Recent runs (${runs.length})`,
        "",
        "| Run | Processed | Errors | |",
        "|---|---|---|---|",
        ...runs.map((r) =>
          `| ${r.when} | ${r.processed} | ${r.errors} | ${r.smoke} |`),
        "",
      ];
    })(),
  ].join("\n");
  try {
    fs.writeFileSync(path.join(dir, "_Sweep Status.md"), md);
  } catch (e) {
    process.stderr.write("status page write failed: " + e.message + "\n");
  }
}
