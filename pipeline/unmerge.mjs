/**
 * unmerge.mjs — clear CanonicalRef on Keywords rows (the curation undo).
 *
 * `curate.mjs --live` with `curation.autoApprove` applies merges without
 * a review step, so a bad batch lands across hundreds of rows at once.
 * The documented undo is per row (clear CanonicalRef, set CurationStatus
 * = Rejected, per the digest header); this is that undo in bulk.
 *
 * It touches the Keywords list ONLY. It cannot restore Doc Keywords
 * junction rows: the sweep folds an alias at index time
 * (`kwId = kwRow.CanonicalRefId || kwRow.ID`) and `curate --repoint`
 * rewrites historical rows in place, so junction rows written while a
 * merge stood already name the canonical. Clearing CanonicalRef fixes
 * the vocabulary and every FUTURE junction row; the folded ones stay
 * until their documents reindex.
 *
 * Selection (at least one is required — there is no implicit "all";
 * with --unreject the same selectors pick among the Rejected rows):
 *   --all              every row whose CanonicalRef is set
 *   --modified <date>  rows whose Modified falls on this UTC date
 *                      (YYYY-MM-DD) — one bad batch, by the day it ran
 *   --chains           rows whose canonical is ITSELF an alias (the
 *                      a -> b -> c shapes `--repoint` can only follow
 *                      five hops of)
 *   --ids-file <path>  one row ID per line (`#` comments allowed) — the
 *                      reviewed list, when the batch is partly good
 *
 * Options:
 *   --reject           also set CurationStatus = Rejected, so the next
 *                      curation run cannot re-propose the same merge
 *                      (curate.mjs's guard drops an alias that carries
 *                      any CurationStatus). Without it a cleared row is
 *                      an ordinary candidate again.
 *   --unreject         the other undo: the selection is over rows that
 *                      carry CurationStatus = Rejected (and no
 *                      CanonicalRef) instead of over aliases, and the
 *                      write clears that status, so the curation prompt
 *                      may judge the row again. For a bulk --reject that
 *                      was too broad — 2026-09-07's blocked 400 rows,
 *                      most of them ordinary plurals the v2 prompt would
 *                      merge correctly, and the model answered by
 *                      proposing the reverse pairs. Not with --reject or
 *                      --chains.
 *   --live             perform the writes (default: dry run, plan only)
 *   --progress         narrate phases to stderr
 *
 * Usage:
 *   node --experimental-strip-types pipeline/unmerge.mjs --config config.json --modified 2026-08-14
 *   node --experimental-strip-types pipeline/unmerge.mjs --config config.json --modified 2026-08-14 --reject --live
 *   node --experimental-strip-types pipeline/unmerge.mjs --config config.json --unreject --modified 2026-09-07 --live
 *
 * Writes a run log (`unmerge-<stamp>.json`) beside the curate logs in
 * paths.workDir; a dry run records the full plan there.
 */

import fs from "node:fs";
import path from "node:path";
import { GraphClient } from "./graph.mjs";
import { assertNodeVersion, validateConfig, CURATE_REQUIRED } from "./lib/config.mjs";
import { createProgress, resolveProgress, secs } from "./lib/progress.mjs";
import { readIds } from "./lib/curationguard.mjs";

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

function loadConfig(argv) {
  const args = { flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") args.config = argv[++i];
    else if (a === "--all") args.flags.all = true;
    else if (a === "--chains") args.flags.chains = true;
    else if (a === "--modified") args.modified = argv[++i];
    else if (a === "--ids-file") args.idsFile = argv[++i];
    else if (a === "--reject") args.flags.reject = true;
    else if (a === "--unreject") args.flags.unreject = true;
    else if (a === "--live") args.flags.live = true;
    else if (a === "--dry-run") args.flags.dry = true;
    else if (a === "--progress") args.flags.progress = true;
    else if (a === "--no-progress") args.flags.noProgress = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.config) {
    throw new Error(
      "usage: unmerge.mjs --config <config.json> (--all | --modified <YYYY-MM-DD> | --chains | --ids-file <path>) " +
      "[--reject | --unreject] [--live|--dry-run] [--progress|--no-progress]"
    );
  }
  if (!args.flags.all && !args.flags.chains && !args.modified && !args.idsFile) {
    throw new Error(
      "no selection given — pass --all, --modified <YYYY-MM-DD>, --chains or --ids-file <path>. " +
      "Clearing every merge is a deliberate act, so it needs --all by name."
    );
  }
  if (args.modified && !/^\d{4}-\d{2}-\d{2}$/.test(args.modified)) {
    throw new Error(`--modified wants a YYYY-MM-DD date, got "${args.modified}"`);
  }
  if (args.flags.unreject && args.flags.reject) throw new Error("--unreject and --reject contradict each other");
  if (args.flags.unreject && args.flags.chains) {
    throw new Error("--chains selects among aliases; with --unreject use --all, --modified or --ids-file");
  }
  assertNodeVersion();
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  validateConfig(cfg, CURATE_REQUIRED, args.config);
  cfg.graph = cfg.graph || {};
  // the same cache curate.mjs and sweep.mjs sign in against, so this
  // reuses their token instead of prompting for its own
  const authDir = path.join(cfg.paths?.workDir || ".", "auth");
  cfg.graph.tokenCache = cfg.graph.tokenCache || path.join(authDir, "graph.json");
  cfg._dry = !args.flags.live || !!args.flags.dry;
  cfg._reject = !!args.flags.reject;
  cfg._unreject = !!args.flags.unreject;
  cfg._select = {
    all: !!args.flags.all,
    chains: !!args.flags.chains,
    modified: args.modified || "",
    ids: args.idsFile ? new Set(readIds(args.idsFile)) : null,
  };
  cfg._progress = resolveProgress(cfg.progress, {
    on: args.flags.progress, off: args.flags.noProgress,
  });
  return cfg;
}

async function main() {
  const cfg = loadConfig(process.argv.slice(2));
  const prog = createProgress({ enabled: cfg._progress });
  const dry = cfg._dry;
  const sel = cfg._select;
  const graph = new GraphClient(cfg.graph);
  const listId = cfg.sharePoint.lists.keywords;

  const signIn = prog.phase("sign-in + site lookup");
  const stopSignIn = prog.heartbeat("waiting on Microsoft Graph sign-in");
  let siteId;
  try {
    siteId = await graph.siteId(cfg.sharePoint.hostname, cfg.sharePoint.sitePath);
  } finally {
    stopSignIn();
  }
  signIn.done(cfg.sharePoint.sitePath);

  prog(`unmerge${cfg._unreject ? " --unreject" : ""} — ${dry ? "DRY RUN (no writes)" : "LIVE"}${cfg._reject ? ", marking Rejected" : ""}`);

  const stopFetch = prog.heartbeat("fetching the Keywords list");
  const rows = (
    await graph.listItems(siteId, listId, {
      select: ["Title", "CanonicalRefLookupId", "CurationStatus", "ProposedCanonical", "Modified"],
    }).finally(stopFetch)
  ).map((it) => {
    const f = it.fields || {};
    return {
      ID: num(it.id) ?? num(f.id),
      Title: String(f.Title || ""),
      CanonicalRefId: num(f.CanonicalRefLookupId),
      CurationStatus: String(f.CurationStatus || ""),
      Modified: String(f.Modified || it.lastModifiedDateTime || ""),
    };
  });
  const byId = new Map(rows.map((r) => [r.ID, r]));
  // the pool the selectors pick from: alias rows, or with --unreject
  // the canonical rows a rejection blocks
  const aliases = cfg._unreject
    ? rows.filter((r) => !r.CanonicalRefId && r.CurationStatus === "Rejected")
    : rows.filter((r) => r.CanonicalRefId);
  prog(
    `Keywords snapshot — ${rows.length} row(s), ` +
    (cfg._unreject ? `${aliases.length} Rejected` : `${aliases.length} carrying a CanonicalRef`)
  );

  // ---- selection
  const why = new Map();
  const pick = (r, reason) => { if (!why.has(r.ID)) why.set(r.ID, reason); };
  for (const r of aliases) {
    if (sel.all) pick(r, "all");
    if (sel.ids?.has(r.ID)) pick(r, "ids-file");
    if (sel.modified && r.Modified.slice(0, 10) === sel.modified) pick(r, `modified ${sel.modified}`);
    if (sel.chains && byId.get(r.CanonicalRefId)?.CanonicalRefId) pick(r, "chained");
  }
  const targets = aliases.filter((r) => why.has(r.ID));
  const selPhase = prog.phase("selection");
  selPhase.done(
    `${targets.length} of ${aliases.length} ${cfg._unreject ? "rejected" : "alias"} row(s) selected` +
    (sel.ids ? ` (ids-file: ${sel.ids.size} id(s) given)` : "")
  );
  if (!targets.length) {
    process.stdout.write("nothing selected — no rows match the given filter\n");
    return;
  }

  // ---- writes
  const plan = [];
  const clearPhase = prog.phase(cfg._unreject ? "clearing Rejected" : "clearing CanonicalRef");
  const tick = prog.counter(targets.length, cfg._unreject ? "rejected rows" : "alias rows");
  let cleared = 0;
  let errors = 0;
  for (const r of targets) {
    const canon = byId.get(r.CanonicalRefId);
    const fields = cfg._unreject
      ? { CurationStatus: null, ProposedCanonical: null }
      : { CanonicalRefLookupId: null };
    if (cfg._reject) {
      fields.CurationStatus = "Rejected";
      fields.ProposedCanonical = null;
    }
    const was = cfg._unreject ? "Rejected" : `→ '${canon?.Title ?? `#${r.CanonicalRefId}`}'`;
    tick(r.Title, `was ${was} (${why.get(r.ID)})`);
    plan.push({
      action: "patchRow", id: r.ID, title: r.Title,
      was: cfg._unreject ? "Rejected" : (canon?.Title ?? String(r.CanonicalRefId)), reason: why.get(r.ID), fields,
    });
    if (dry) { cleared++; continue; }
    try {
      await graph.updateItemFields(siteId, listId, r.ID, fields);
      cleared++;
    } catch (e) {
      errors++;
      prog.fail(r.Title, e.message);
      process.stderr.write(`unmerge failed for row ${r.ID} (${r.Title}): ${e.message}\n`);
    }
  }
  clearPhase.done(`${cleared} row(s) ${dry ? "would be" : ""} cleared, ${errors} error(s)`);

  // ---- summary + run log
  const line = cfg._unreject
    ? `mode=unreject rejected=${aliases.length} selected=${targets.length} cleared=${cleared} errors=${errors}`
    : `mode=unmerge aliases=${aliases.length} selected=${targets.length} ` +
      `cleared=${cleared} errors=${errors} rejected=${cfg._reject ? cleared : 0}`;
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
  const logFile = path.join(logDir, `unmerge-${stamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ line, dry_run: dry, plan }, null, 1));
  const keep = fs.readdirSync(logDir).filter((f) => /^unmerge-.*\.json$/.test(f)).sort();
  for (const f of keep.slice(0, Math.max(0, keep.length - 10))) {
    try { fs.unlinkSync(path.join(logDir, f)); } catch { /* best effort */ }
  }
  prog(`unmerge finished in ${secs(prog.elapsed())} — ${line}`);
  process.stdout.write(JSON.stringify({ line, dry_run: dry, logFile }) + "\n");
  process.stdout.write(line + "\n");
  if (dry) {
    process.stdout.write(
      `dry run: ${plan.length} planned write(s) recorded in ${logFile} — re-run with --live to apply\n`
    );
  } else if (cleared && cfg._unreject) {
    process.stdout.write("rows unblocked — the next curation run may propose them again\n");
  } else if (cleared) {
    process.stdout.write(
      "vocabulary restored — Doc Keywords rows written while the merges stood still name the " +
      "canonical; they correct as their documents reindex\n"
    );
  }
}

main().catch((e) => {
  process.stderr.write(`unmerge: ${e.stack || e.message}\n`);
  process.exitCode = 1;
});
