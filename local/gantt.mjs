#!/usr/bin/env node
/**
 * gantt.mjs v1.0 — Flow #2, finally: Gantt schedules → Issue Refs +
 * gantt/titlematch edges. The queued follow-on the README has carried
 * since v1.9 ("Issue Refs list is present but empty by design — its
 * feeder is flow #2, not yet built"), shipped as a local job instead
 * of a cloud flow: reuses graph.mjs, the PAD xlsx reader, and the
 * sweep's edge-minting pattern. RelatedRank has weighted `gantt` (60)
 * and `titlematch` (40) edges since v2.6 — they light up the day the
 * rows exist, with zero sweep or script changes.
 *
 * What it does, per indexed Schedule workbook (DocKind "Schedule",
 * read from the OneDrive-synced source library):
 *   1. Parses every sheet as an iteration table (sheet name →
 *      IterationLabel). The header row is found by its column names;
 *      recognized columns: issue/# / id, title/name/task, PE, Dev,
 *      Done, plus any "...status"/TP/Test columns which fold into
 *      StatusSummary ("TP=Completed; Test=In Progress").
 *   2. Upserts ONE Issue Refs row per issue (IssueKey {repo}#{n} is
 *      the dedup key, the schema's design): IssueTitle as written in
 *      the Gantt row, PE/Dev/IterationLabel/StatusSummary/DoneFlag,
 *      SourceDocument → the schedule's Doc Index row. A later sheet
 *      or schedule updates the same row (last write wins); unchanged
 *      rows are not patched.
 *   3. Mints `gantt` edges: schedule doc ↔ every doc that carries one
 *      of its issues (Doc IDs), Strength = shared-issue count,
 *      LinkKey {a}|{b}|gantt — the sweep's sorted-pair dedup pattern.
 *   4. Mints `titlematch` edges: an issue TITLE that matches exactly
 *      one indexed doc's title (all issue-title tokens present,
 *      plural/prefix-tolerant, ≥2 tokens, ambiguity-guarded — two
 *      matching docs means the title is too generic and nothing is
 *      minted) connects that doc to the issue's carriers and to the
 *      schedule itself — the docs that never cite the number join
 *      the issue's cluster. Skipped when the matched doc already
 *      carries the issue id (the id edge outranks it anyway).
 *
 * Keyword-rule note (SP_Adaptation_Notes): gantt/titlematch are
 * SPARSE edge types — one row per schedule-doc or title-hit pair,
 * never a pair explosion.
 *
 * Usage:
 *   node --experimental-strip-types local/gantt.mjs --config local/config.json
 *        [--live | --dry-run]     override config.gantt.dryRun (default dry)
 *        [--only <filename>]      one schedule only
 *
 * Config: sharePoint.lists.issueRefs joins the list map (see
 * schemas/SPList_IssueRefs.csv; verify the GUID on tenant before
 * first use — the list was never referenced by any flow). Path
 * caveat: source files resolve through the lowercased DocKey, which
 * is case-insensitive on the Windows sweep machine; on a
 * case-sensitive filesystem keep library folder names' case matching
 * their DocKeys.
 */

import fs from "node:fs";
import path from "node:path";
import { xlsxToGrids } from "../pad/runner/xlsx_grid.mjs";
import { GraphClient } from "./graph.mjs";
import { assertNodeVersion, validateConfig, CURATE_REQUIRED } from "./lib/config.mjs";
import { lower, num, pruneRunLogs } from "./lib/util.mjs";

const GANTT_REQUIRED = [
  ...CURATE_REQUIRED,
  "sharePoint.lists.docIndex",
  "sharePoint.lists.docIds",
  "sharePoint.lists.docLinks",
  "sharePoint.lists.issueRefs",
  "paths.sourceLibrary",
];

function loadConfig(argv) {
  const args = { flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") args.config = argv[++i];
    else if (a === "--live") args.flags.live = true;
    else if (a === "--dry-run") args.flags.dry = true;
    else if (a === "--only") args.flags.only = argv[++i];
    else if (a === "--inspect") args.flags.inspect = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.config) {
    throw new Error("usage: gantt.mjs --config <config.json> [--live|--dry-run] [--only <file>] [--inspect]");
  }
  assertNodeVersion();
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  validateConfig(cfg, GANTT_REQUIRED, args.config);
  cfg.gantt = { dryRun: true, ...(cfg.gantt || {}) };
  if (args.flags.live) cfg.gantt.dryRun = false;
  if (args.flags.dry) cfg.gantt.dryRun = true;
  cfg.gantt.only = args.flags.only || "";
  cfg.gantt.inspect = !!args.flags.inspect;
  cfg.sharePoint.libraryRootSegment = cfg.sharePoint.libraryRootSegment || "Shared Documents";
  cfg.sweep = cfg.sweep || {};
  return cfg;
}

// ---- sheet → issue rows ---------------------------------------------

const ISSUE_URL_RE = /devtopia\.esri\.com\/([^\/\s"'<>\)\]]+)\/([^\/\s"'<>\)\]]+)\/issues\/(\d+)/i;

function headerRole(text) {
  const t = lower(text).trim();
  if (!t) return null;
  // issue outranks title so "story #" / "user story #" read as issue
  if (t === "#" || t === "id" || t.includes("issue") || t.includes("devtopia") ||
      t.endsWith("#")) return "issue";
  if (t.includes("title") || t === "name" || t === "task" || t === "task name" ||
      t.includes("story")) return "title";
  if (t === "pe") return "pe";
  if (t === "dev" || t.includes("developer")) return "dev";
  if (t.includes("done")) return "done";
  if (t.includes("status") || t === "tp" || t === "test plan" || t === "test") return "status";
  return null;
}

/** Header row = the first of the top 30 rows carrying BOTH an issue
 *  column and a title column (30, not 10 — real schedules stack
 *  legends and title banners above the table). Returns {cols, at}
 *  or null. */
function findHeader(grid) {
  for (let i = 0; i < Math.min(grid.length, 30); i++) {
    const cols = { status: [] };
    for (let c = 0; c < grid[i].length; c++) {
      const role = headerRole(grid[i][c]);
      if (!role) continue;
      if (role === "status") cols.status.push({ col: c, label: String(grid[i][c]).trim() });
      else if (cols[role] === undefined) cols[role] = c;
    }
    if (cols.issue !== undefined && cols.title !== undefined) return { cols, at: i };
  }
  return null;
}

function parseIssueCell(text, defaultRepo) {
  const s = String(text || "").trim();
  if (!s) return null;
  const url = ISSUE_URL_RE.exec(s);
  if (url) return { repo: `${url[1]}/${url[2]}`, number: parseInt(url[3], 10) };
  const m = /^#?(\d{2,6})$/.exec(s);
  if (m) return { repo: defaultRepo, number: parseInt(m[1], 10) };
  return null;
}

const truthy = (s) => /^(yes|y|true|done|x|1)$/i.test(String(s || "").trim());

/** All issue rows of one workbook: [{repo, number, key, title, pe,
 *  dev, iteration, status, done}] — later sheets/rows win per key. */
export function ganttRows(grids, defaultRepo) {
  const byKey = new Map();
  let seen = 0;
  for (const sheet of grids) {
    const head = findHeader(sheet.grid || []);
    if (!head) continue;
    const { cols, at } = head;
    for (let i = at + 1; i < sheet.grid.length; i++) {
      const row = sheet.grid[i];
      const issue = parseIssueCell(row[cols.issue], defaultRepo);
      const title = String(row[cols.title] || "").trim();
      if (!issue || !title) continue;
      seen++;
      const status = cols.status
        .map((s) => ({ label: s.label, v: String(row[s.col] || "").trim() }))
        .filter((s) => s.v !== "")
        .map((s) => `${s.label}=${s.v}`)
        .join("; ");
      byKey.set(`${issue.repo}#${issue.number}`, {
        repo: issue.repo,
        number: issue.number,
        key: `${issue.repo}#${issue.number}`,
        title,
        pe: cols.pe !== undefined ? String(row[cols.pe] || "").trim() : "",
        dev: cols.dev !== undefined ? String(row[cols.dev] || "").trim() : "",
        iteration: sheet.name,
        status,
        done: cols.done !== undefined ? truthy(row[cols.done]) : false,
      });
    }
  }
  return { rows: [...byKey.values()], seen };
}

// ---- title matching (the DocPageIndex token rules) ------------------

const normTok = (t) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t);
const tokMatch = (a, b) => {
  if (a === b) return true;
  const s = a.length <= b.length ? a : b;
  const l = a.length <= b.length ? b : a;
  return s.length >= 4 && l.startsWith(s);
};

function tokensOf(name) {
  const out = [];
  for (const p of lower(name).split(/[^a-z0-9]+/)) {
    if (p.length < 3 && !/\d/.test(p)) continue;
    const n = normTok(p);
    if (n && !out.includes(n)) out.push(n);
  }
  return out;
}

/** The ONE doc whose title covers every issue-title token, or null
 *  (no match / too generic a title / several matches). */
export function titleMatch(issueTitle, docs) {
  const it = tokensOf(issueTitle);
  if (it.length < 2) return null;
  const hits = [];
  for (const d of docs) {
    const dt = tokensOf(d.Title || "");
    if (!dt.length) continue;
    if (it.every((t) => dt.some((s) => tokMatch(t, s)))) hits.push(d);
  }
  return hits.length === 1 ? hits[0] : null;
}

// ---- main -----------------------------------------------------------

async function main() {
  const cfg = loadConfig(process.argv.slice(2));
  const sp = cfg.sharePoint;
  const g = cfg.gantt;
  const dry = !!g.dryRun;
  const defaultRepo = cfg.sweep.defaultRepo || "ArcGISPro/ps-location-referencing";
  const graph = new GraphClient(cfg.graph);
  const siteId = await graph.siteId(sp.hostname, sp.sitePath);

  const rows = async (listKey, select) =>
    graph.listItems(siteId, sp.lists[listKey], { select });

  const docIndexRows = (await rows("docIndex",
    ["Title", "FileName", "DocKey", "DocKind", "IndexStatus"])).map((it) => ({
    ID: num(it.id), Title: String(it.fields?.Title || ""),
    FileName: String(it.fields?.FileName || ""),
    DocKey: String(it.fields?.DocKey || ""),
    DocKind: String(it.fields?.DocKind || ""),
    IndexStatus: String(it.fields?.IndexStatus || ""),
  }));
  // the sweep's own root-segment mapping, over the lowercased DocKey
  const rootLower = lower(sp.libraryRootSegment) + "/";
  const localOf = (docKey) => {
    const k = String(docKey);
    const rel = lower(k).startsWith(rootLower) ? k.slice(rootLower.length) : k;
    return path.join(cfg.paths.sourceLibrary, ...rel.split("/"));
  };
  const schedules = docIndexRows.filter((r) =>
    r.IndexStatus === "Indexed" && r.DocKind === "Schedule" &&
    lower(r.DocKey).endsWith(".xlsx") &&
    (!g.only || lower(r.FileName.trim()) === lower(g.only.trim())));

  // --inspect: no writes, no further fetches — dump each schedule's
  // sheet structure and what the header detector saw, so a zero-row
  // run can be diagnosed from real workbooks instead of guessed at
  if (g.inspect) {
    for (const sched of schedules) {
      const local = localOf(sched.DocKey);
      process.stdout.write(`\n=== ${sched.FileName} ===\n`);
      if (!fs.existsSync(local)) {
        process.stdout.write(`  (not in the synced library: ${local})\n`);
        continue;
      }
      let grids;
      try {
        grids = xlsxToGrids(fs.readFileSync(local));
      } catch (e) {
        process.stdout.write(`  (unreadable: ${e.message})\n`);
        continue;
      }
      for (const sheet of grids) {
        const grid = sheet.grid || [];
        const width = grid.reduce((m, r) => Math.max(m, r.length), 0);
        process.stdout.write(`-- sheet "${sheet.name}": ${grid.length} rows x ${width} cols\n`);
        let shown = 0;
        for (let i = 0; i < grid.length && shown < 12; i++) {
          const cells = (grid[i] || []).map((c) => String(c ?? "").trim());
          if (cells.every((c) => c === "")) continue;
          shown++;
          const roles = cells
            .map((c, k) => {
              const r = headerRole(c);
              return r ? `${k}:${r}` : null;
            })
            .filter(Boolean)
            .join(" ");
          const shownCells = cells.slice(0, 8)
            .map((c) => (c === "" ? "·" : `[${c.length > 18 ? c.slice(0, 17) + "…" : c}]`))
            .join(" ");
          process.stdout.write(
            `   row ${i}: ${shownCells}` +
            (cells.length > 8 ? ` (+${cells.length - 8} cols)` : "") +
            (roles ? `   roles{${roles}}` : "") + "\n");
        }
        const head = findHeader(grid);
        process.stdout.write(head
          ? `   header detected at row ${head.at}\n`
          : "   NO header detected (needs an issue column AND a title column in the first 30 rows)\n");
      }
    }
    return;
  }

  const docIdRows = (await rows("docIds",
    ["Repo", "IssueNumber", "IdKey", "DocumentLookupId"])).map((it) => ({
    Repo: String(it.fields?.Repo || ""),
    IssueNumber: num(it.fields?.IssueNumber),
    DocumentId: num(it.fields?.DocumentLookupId)
      ?? num(String(it.fields?.IdKey || "").split("|")[0]),
  }));
  const linkKeys = new Set((await rows("docLinks", ["LinkKey"]))
    .map((it) => String(it.fields?.LinkKey || "")));
  const issueRefRows = (await rows("issueRefs",
    ["Title", "Repo", "IssueNumber", "IssueKey", "IssueTitle", "PE", "Dev",
     "IterationLabel", "StatusSummary", "DoneFlag"])).map((it) => ({
    ID: num(it.id), IssueKey: String(it.fields?.IssueKey || ""),
    IssueTitle: String(it.fields?.IssueTitle || ""),
    PE: String(it.fields?.PE || ""), Dev: String(it.fields?.Dev || ""),
    IterationLabel: String(it.fields?.IterationLabel || ""),
    StatusSummary: String(it.fields?.StatusSummary || ""),
    DoneFlag: it.fields?.DoneFlag === true || it.fields?.DoneFlag === "1",
  }));
  const refByKey = new Map(issueRefRows.map((r) => [r.IssueKey, r]));

  // carriers per issue key, from Doc IDs
  const carriers = new Map();
  for (const r of docIdRows) {
    if (!r.DocumentId || !r.IssueNumber) continue;
    const key = `${r.Repo}#${r.IssueNumber}`;
    if (!carriers.has(key)) carriers.set(key, new Set());
    carriers.get(key).add(r.DocumentId);
  }
  const idKeyPairs = new Set(docIdRows.map((r) => `${r.DocumentId}|${r.Repo}#${r.IssueNumber}`));

  const matchableDocs = docIndexRows.filter((r) =>
    r.IndexStatus === "Indexed" && r.DocKind !== "Schedule");

  const plan = [];
  const sum = {
    mode: "gantt", dry_run: dry, schedules: 0, sheets_rows: 0,
    issues_created: 0, issues_updated: 0, gantt_edges: 0,
    titlematch_edges: 0, unmatched_titles: 0, errors: 0,
  };
  const createRow = async (listKey, fields) => {
    plan.push({ action: "createRow", target: listKey, fields });
    if (!dry) return graph.createItem(siteId, sp.lists[listKey], fields);
    return { id: -1 };
  };
  const patchRow = async (listKey, id, fields) => {
    plan.push({ action: "patchRow", target: `${listKey}/${id}`, fields });
    if (!dry) await graph.updateItemFields(siteId, sp.lists[listKey], id, fields);
  };
  const mintEdge = async (a, b, type, sharedValues, strength) => {
    const [lo, hi] = [Math.min(a, b), Math.max(a, b)];
    const linkKey = `${lo}|${hi}|${type}`;
    if (a === b || linkKeys.has(linkKey)) return false;
    await createRow("docLinks", {
      Title: `${type}: ${sharedValues}`.slice(0, 255),
      DocALookupId: lo, DocBLookupId: hi, LinkType: type,
      SharedValues: String(sharedValues).slice(0, 255),
      Strength: strength, LinkKey: linkKey,
    });
    linkKeys.add(linkKey);
    return true;
  };

  for (const sched of schedules) {
    const local = localOf(sched.DocKey);
    if (!fs.existsSync(local)) {
      process.stderr.write(`GANTT skip ${sched.FileName}: not in the synced library (${local})\n`);
      continue;
    }
    sum.schedules++;
    let parsed;
    try {
      parsed = ganttRows(xlsxToGrids(fs.readFileSync(local)), defaultRepo);
    } catch (e) {
      sum.errors++;
      process.stderr.write(`GANTT ERROR ${sched.FileName}: ${e.message}\n`);
      continue;
    }
    sum.sheets_rows += parsed.seen;
    for (const r of parsed.rows) {
      // 1) Issue Refs upsert by IssueKey
      const fields = {
        Title: r.key, Repo: r.repo, IssueNumber: r.number, IssueKey: r.key,
        IssueTitle: r.title, PE: r.pe, Dev: r.dev, IterationLabel: r.iteration,
        StatusSummary: r.status, DoneFlag: r.done,
        SourceDocumentLookupId: sched.ID,
      };
      const existing = refByKey.get(r.key);
      if (!existing) {
        await createRow("issueRefs", fields);
        refByKey.set(r.key, { IssueKey: r.key, IssueTitle: r.title, PE: r.pe,
          Dev: r.dev, IterationLabel: r.iteration, StatusSummary: r.status,
          DoneFlag: r.done });
        sum.issues_created++;
      } else {
        const changed =
          existing.IssueTitle !== r.title || existing.PE !== r.pe ||
          existing.Dev !== r.dev || existing.IterationLabel !== r.iteration ||
          existing.StatusSummary !== r.status || existing.DoneFlag !== r.done;
        if (changed && existing.ID) {
          await patchRow("issueRefs", existing.ID, fields);
          Object.assign(existing, { IssueTitle: r.title, PE: r.pe, Dev: r.dev,
            IterationLabel: r.iteration, StatusSummary: r.status, DoneFlag: r.done });
          sum.issues_updated++;
        }
      }

      // 2) gantt edges: schedule ↔ every carrier of this issue
      const carrierSet = carriers.get(r.key) || new Set();
      for (const docId of carrierSet) {
        if (await mintEdge(sched.ID, docId, "gantt", r.key, carrierSet.size)) {
          sum.gantt_edges++;
        }
      }

      // 3) titlematch: the one doc this issue's TITLE names joins the
      // issue's cluster (carriers + the schedule), unless it already
      // carries the id
      const hit = titleMatch(r.title, matchableDocs);
      if (!hit) {
        sum.unmatched_titles++;
        continue;
      }
      if (idKeyPairs.has(`${hit.ID}|${r.key}`)) continue;
      for (const other of [...carrierSet, sched.ID]) {
        if (await mintEdge(hit.ID, other, "titlematch", `${r.key}: ${r.title}`.slice(0, 200), 1)) {
          sum.titlematch_edges++;
        }
      }
    }
  }

  const line =
    `mode=gantt schedules=${sum.schedules} rows=${sum.sheets_rows} ` +
    `issues_created=${sum.issues_created} issues_updated=${sum.issues_updated} ` +
    `gantt_edges=${sum.gantt_edges} titlematch_edges=${sum.titlematch_edges} ` +
    `unmatched_titles=${sum.unmatched_titles} errors=${sum.errors}`;
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
  const logFile = path.join(logDir, `gantt-${stamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ summary: sum, line, plan: dry ? plan : undefined }, null, 1));
  pruneRunLogs(logDir, 10, "gantt-");
  process.stdout.write(JSON.stringify({ ...sum, logFile }) + "\n");
  process.stdout.write(line + "\n");
  if (dry) process.stdout.write(`dry run: ${plan.length} planned writes recorded in ${logFile}\n`);
}

main().catch((e) => {
  process.stderr.write("gantt: " + (e.stack || e.message) + "\n");
  process.exit(1);
});
