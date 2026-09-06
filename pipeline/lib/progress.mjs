/**
 * progress.mjs v1.0 — the one progress convention for the local jobs.
 *
 * Every job in `pipeline/` is a long-running batch: the nightly sweep
 * walks up to 150 documents through extraction, a model call and a
 * dozen list writes; curation sends the vocabulary in chunks; the
 * wiki renders the whole corpus; test-plan drafting waits on one long
 * generation. Until now only `testplangen.mjs` (v1.5) told the person
 * running it what it was doing — motivated by the 2026-09-04 run that
 * sat silent for 10+ minutes, where an auth wait, a slow generation
 * and a silent retry loop were indistinguishable. That posture is now
 * shared, and the rule it established is the rule here:
 *
 *   - progress goes to **stderr**, one `progress: <message>` line per
 *     event. stdout carries each job's machine contract (the summary
 *     JSON, the `*_summary` line, the plan notes) and is never touched.
 *   - it is **off by default for unattended runs** so the scheduled
 *     tasks' logs do not grow, and **on for a person at a console**:
 *     `resolveProgress` defaults to `process.stderr.isTTY`. Every job
 *     takes `--progress` / `--no-progress`, and a config `progress`
 *     key (`true` | `false` | `"auto"`) sets the default — a nightly
 *     task can opt in when a run needs watching.
 *   - a disabled reporter is a cheap no-op: callers may build the
 *     message eagerly, but anything EXPENSIVE to describe belongs
 *     behind `prog.enabled`.
 *
 * Usage:
 *
 *   const prog = createProgress({ enabled: resolveProgress(cfg.progress, flags) });
 *   prog("Doc Index snapshot — 812 rows");        // a plain line
 *   const phase = prog.phase("figure index");     // "figure index — start"
 *   const tick = prog.counter(docs.length, "documents");
 *   for (const d of docs) tick(d.name, "3 figures");   // "[7/150] name — 3 figures"
 *   phase.done("482 rows upserted");              // "figure index — ... (12s)"
 *   const stop = prog.heartbeat("waiting on Graph");   // every 30 s while awaited
 *   stop();
 *
 * Covered by tests/check_local_sweep.py (the sweep, curate and gantt
 * legs) and tests/check_testplangen.py (the v1.5 lines, unchanged).
 */

const DEFAULT_HEARTBEAT_MS = 30000;

/** Seconds, rounded, as the jobs have always printed them. */
export const secs = (ms) => `${Math.round(ms / 1000)}s`;

/**
 * Is progress on for this run? Precedence, strongest first:
 * `--no-progress`, `--progress`, the config value, the default
 * (`defaultOn`, else "a person is watching" = stderr is a TTY).
 *
 * `value` accepts a boolean or "always" | "never" | "auto" so the
 * config key reads the same as the flags it stands in for.
 */
export function resolveProgress(value, { on, off, defaultOn } = {}) {
  if (off) return false;
  if (on) return true;
  if (value === true || value === "always" || value === "on") return true;
  if (value === false || value === "never" || value === "off") return false;
  if (defaultOn !== undefined) return !!defaultOn;
  return !!process.stderr.isTTY;
}

/**
 * A progress reporter. `prog(message)` writes one line; the helpers
 * below cover the shapes the jobs actually need. Returns a callable
 * with `.enabled`, `.phase`, `.counter`, `.heartbeat`, `.note`,
 * `.fail` and `.elapsed`.
 *
 * Options: `enabled` (default: stderr is a TTY), `stream` (default
 * stderr), `prefix` (default "progress"), `heartbeatMs` (default 30 s).
 */
export function createProgress({ enabled, stream, prefix = "progress", heartbeatMs = DEFAULT_HEARTBEAT_MS } = {}) {
  const on = enabled === undefined ? !!process.stderr.isTTY : !!enabled;
  const out = stream || process.stderr;
  const t0 = Date.now();

  const prog = (message) => {
    if (!on) return;
    try {
      out.write(`${prefix}: ${message}\n`);
    } catch { /* a closed pipe never fails a run */ }
  };

  prog.enabled = on;
  /** Milliseconds since the reporter was created. */
  prog.elapsed = () => Date.now() - t0;

  /**
   * A named phase: prints "<name> — start", times itself, and prints
   * "<name> — <detail> (12s)" on `.done()`. `.step()` writes a line
   * inside the phase; `.fail()` marks it and keeps the run going.
   */
  prog.phase = (name) => {
    const started = Date.now();
    prog(`${name} — start`);
    const phase = {
      name,
      started,
      elapsed: () => Date.now() - started,
      step: (detail) => prog(`${name} — ${detail}`),
      done: (detail) => prog(`${name} — ${detail ?? "done"} (${secs(Date.now() - started)})`),
      fail: (detail) => prog(`${name} — FAILED after ${secs(Date.now() - started)}: ${detail}`),
    };
    return phase;
  };

  /**
   * An "[i/total] label — detail" ticker for a loop. Long loops thin
   * out automatically (`every` defaults to one line per item up to
   * 200 items, then ~50 lines total) so a corpus-wide pass stays
   * readable; the LAST item always prints. `tick.count` is the number
   * of items ticked so far.
   */
  prog.counter = (total, what = "", { every } = {}) => {
    const n = Number(total) || 0;
    const stride = every || (n <= 200 ? 1 : Math.ceil(n / 50));
    if (what) prog(`${what} — ${n}`);
    let i = 0;
    const tick = (label, detail) => {
      i++;
      tick.count = i;
      if (!on) return i;
      if (i % stride !== 0 && i !== n) return i;
      prog(`[${i}/${n || "?"}] ${label}${detail ? ` — ${detail}` : ""}`);
      return i;
    };
    tick.count = 0;
    tick.total = n;
    return tick;
  };

  /**
   * "still <label> — 30s elapsed" every `ms` until the returned stop
   * function is called. For the waits with nothing to report inside
   * them: one model call, a Graph download, a git push. The timer is
   * unref'd, so it never holds the process open.
   */
  prog.heartbeat = (label, ms = heartbeatMs) => {
    if (!on) return () => {};
    const started = Date.now();
    const timer = setInterval(() => prog(`still ${label} — ${secs(Date.now() - started)} elapsed`), ms);
    timer.unref?.();
    return () => clearInterval(timer);
  };

  /** A one-off aside ("note: ..."), for the conditions a run survives. */
  prog.note = (message) => prog(`note: ${message}`);

  /** A failure that does NOT stop the run (the per-item error lanes). */
  prog.fail = (what, detail) => prog(`FAILED ${what}: ${detail}`);

  return prog;
}

/** A reporter that writes nothing — the default for a library caller
 *  that was given none. */
export const noProgress = createProgress({ enabled: false });
