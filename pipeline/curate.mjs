#!/usr/bin/env node
/**
 * curate.mjs v1.5 — the KeywordCuration cloud flow (v1.1) as a local
 * weekly job. The LAST Power Automate piece of the pipeline: with
 * this deployed and the cloud flow off, orchestration is 100% local.
 *
 * Faithful to curation/flow/v1_1/definition.json action-for-action:
 *   1. Cleanup (Filter_stale_state / For_each_approved): rows whose
 *      CanonicalRef a human has set, but that still carry the
 *      flow-owned CurationStatus/ProposedCanonical, get both cleared.
 *   2. Vocabulary (Filter_canonical_cur / Select_vocab): canonical
 *      rows (no CanonicalRef) as "title [kind]" lines; blocked lines
 *      (Filter_blocked) = canonical rows with any CurationStatus
 *      (Proposed = pending review, Rejected = never re-propose).
 *   3. The model call — prompts/keyword_curation.md through lrsdoc
 *      (schema-pinned), inputs Vocabulary / DoNotPropose, one call
 *      per vocabulary chunk, capped at curation.maxProposals.
 *   4. Hallucination guard (If_valid_proposal, verbatim): alias and
 *      canonical must both be real rows (case-insensitive title),
 *      differ, alias uncurated (no CanonicalRef, no CurationStatus),
 *      canonical not itself an alias. Valid -> the alias row gets
 *      CurationStatus=Proposed + ProposedCanonical="<canon> — <why>"
 *      (why de-quoted, single-line, 160 cap); else dropped.
 *   5. Digest — pending carryover lines first (rows still Proposed),
 *      then this run's proposals — overwritten at a FIXED name in
 *      the site's Shared Documents root (outside the LRS Doc Index
 *      library, so the Q&A agent never ingests it; written via Graph
 *      drive upload since that library is not locally synced).
 *      DX-11: an emptied queue overwrites the digest with an
 *      explicit empty state instead of leaving last week's file.
 *   6. Cur_summary line: canon/blocked/proposed_by_model/written/
 *      dropped/cleared.
 *
 * The flow never writes CanonicalRef and neither does this job — a
 * human approves by setting the lookup; this job clears the curation
 * columns on its next run.
 *
 * Config: reuses config.json — sharePoint.lists.keywords, graph.*,
 * llm.* (see llm.mjs), optional curation.{digestName,digestDrivePath,
 * maxProposals,vocabChunk,promptVersion,autoApprove,dryRun}.
 *
 * Usage:
 *   node --experimental-strip-types pipeline/curate.mjs --config config.json [--live|--dry-run|--drain|--repoint] [--progress|--no-progress]
 *   ... --approve <ids-file> | --withdraw <ids-file>   the review, by list (v1.3)
 *   ... --seed-vocabulary                              official terms + tools as Keywords rows (v1.4)
 *   ... --review                                       the second reader over the pending queue (v1.5;
 *                                                      curation.review.enabled runs it inside every weekly run)
 *
 * Progress (pipeline/lib/progress.mjs): each phase — the snapshot, the
 * cleanup, every vocabulary chunk's model call with a heartbeat, the
 * guard, the digest — writes one `progress: ...` line to STDERR when
 * progress is on (a console by default; `--progress` / `config.progress`
 * for the Saturday task). stdout keeps the Cur_summary contract.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GraphClient } from "./graph.mjs";
import { curateChunk, reviewProposals } from "./llm.mjs";
import { assertNodeVersion, validateConfig, CURATE_REQUIRED } from "./lib/config.mjs";
import { createProgress, resolveProgress, secs } from "./lib/progress.mjs";
import { proposalProblem, readIds, normalizeTitle } from "./lib/curationguard.mjs";
import { loadVocabulary, VOCABULARY_FILE } from "./lib/vocabulary.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** "v<version>" of prompts/keyword_curation.md — the digest's
 *  CurationPromptVersion stamp, unless curation.promptVersion pins it. */
export function curationPromptStamp() {
  const file = path.join(REPO_ROOT, "prompts", "keyword_curation.md");
  const m = /^version:\s*["']?([0-9][^"'\s]*)["']?\s*$/m.exec(fs.readFileSync(file, "utf8"));
  if (!m) throw new Error(`${file}: no "version:" line in the front matter`);
  return "v" + m[1];
}

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};
const lower = (s) => String(s ?? "").toLowerCase();

function loadConfig(argv) {
  const args = { flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") args.config = argv[++i];
    else if (a === "--live") args.flags.live = true;
    else if (a === "--dry-run") args.flags.dry = true;
    else if (a === "--drain") args.flags.drain = true;
    else if (a === "--repoint") args.flags.repoint = true;
    else if (a === "--approve") args.approve = argv[++i];
    else if (a === "--withdraw") args.withdraw = argv[++i];
    else if (a === "--seed-vocabulary") args.flags.seed = true;
    else if (a === "--review") args.flags.review = true;
    else if (a === "--progress") args.flags.progress = true;
    else if (a === "--no-progress") args.flags.noProgress = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.config) {
    throw new Error(
      "usage: curate.mjs --config <config.json> [--live|--dry-run|--drain|--repoint|" +
      "--approve <ids-file>|--withdraw <ids-file>|--seed-vocabulary|--review] [--progress|--no-progress]"
    );
  }
  if ((args.approve !== undefined && !args.approve) || (args.withdraw !== undefined && !args.withdraw)) {
    throw new Error("--approve / --withdraw take a file of Keywords row IDs, one per line (# comments allowed)");
  }
  if ([args.approve, args.withdraw, args.flags.repoint, args.flags.seed, args.flags.review].filter(Boolean).length > 1) {
    throw new Error("--approve, --withdraw, --repoint, --seed-vocabulary and --review are separate commands — run one at a time");
  }
  assertNodeVersion();
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  validateConfig(
    cfg,
    args.flags.repoint
      ? [...CURATE_REQUIRED, "sharePoint.lists.docKeywords"]
      : CURATE_REQUIRED,
    args.config
  );
  cfg.llm = cfg.llm || {};
  cfg.graph = cfg.graph || {};
  const authDir = path.join(cfg.paths?.workDir || ".", "auth");
  cfg.graph.tokenCache = cfg.graph.tokenCache || path.join(authDir, "graph.json");
  cfg.curation = {
    digestName: "Keyword_Curation_Digest.md",
    digestDrivePath: "", // site default drive root = Shared Documents
    maxProposals: 20,
    // vocabulary lines per model call. One giant call over the full
    // vocabulary produces a reply too long to trust (and, historically,
    // timed out); alphabetical chunks keep each call small AND keep the
    // main variant classes (plural/typo/hyphen/concatenation)
    // adjacent in the same chunk. Cross-chunk pairs (abbreviation vs
    // expansion far apart alphabetically) are the accepted miss.
    vocabChunk: 700,
    // the digest header's stamp: the prompt file's own version unless
    // config pins another
    promptVersion: curationPromptStamp(),
    // false = the flow's propose-then-approve contract (a human sets
    // CanonicalRef). true = guard-passing merges apply immediately,
    // pending proposals from manual mode included; the digest becomes
    // an audit log with undo instructions.
    autoApprove: false,
    dryRun: true,
    ...(cfg.curation || {}),
  };
  // the second reader (prompts/keyword_review.md): enabled = the weekly
  // run ends with a review pass over the whole pending queue and
  // applies its verdicts (the librarian's click, by model); chunk =
  // proposals per review call; model / effort / maxTokens override
  // llm.* for the review call only. `--review` runs the pass alone.
  cfg.curation.review = { enabled: false, chunk: 100, ...(cfg.curation.review || {}) };
  if (args.flags.live) cfg.curation.dryRun = false;
  if (args.flags.dry) cfg.curation.dryRun = true;
  cfg._drain = !!args.flags.drain;
  cfg._repoint = !!args.flags.repoint;
  cfg._seed = !!args.flags.seed;
  cfg._review = !!args.flags.review;
  cfg._approve = args.approve ? readIds(args.approve) : null;
  cfg._withdraw = args.withdraw ? readIds(args.withdraw) : null;
  cfg._progress = resolveProgress(cfg.progress, {
    on: args.flags.progress, off: args.flags.noProgress,
  });
  cfg.llm.progress = cfg._progress;
  return cfg;
}

async function main() {
  const cfg = loadConfig(process.argv.slice(2));
  const prog = createProgress({ enabled: cfg._progress });
  cfg._prog = prog;
  // the official vocabulary (lib/vocabulary.mjs): its terms and tool
  // names are the canonical side of any pair the guard judges, and
  // --seed-vocabulary plants them as Keywords rows
  cfg._vocab = loadVocabulary(cfg.sweep?.vocabularyFile || VOCABULARY_FILE);
  cfg._official = new Set(
    [...cfg._vocab.terms.map((t) => t.term), ...cfg._vocab.tools.map((t) => t.name), ...cfg._vocab.widgets.map((t) => t.name)]
      .map(normalizeTitle).filter(Boolean)
  );
  const graph = new GraphClient(cfg.graph);
  const signIn = prog.phase("sign-in + site lookup");
  const stopSignIn = prog.heartbeat("waiting on Microsoft Graph sign-in");
  let siteId;
  try {
    siteId = await graph.siteId(cfg.sharePoint.hostname, cfg.sharePoint.sitePath);
  } finally {
    stopSignIn();
  }
  signIn.done(cfg.sharePoint.sitePath);
  if (cfg._repoint) {
    prog(`curate --repoint — ${cfg.curation.dryRun ? "DRY RUN (no writes)" : "LIVE"}`);
    return runRepoint(cfg, graph, siteId);
  }
  if (cfg._seed) {
    prog(`curate --seed-vocabulary — ${cfg.curation.dryRun ? "DRY RUN (no writes)" : "LIVE"}`);
    return runSeed(cfg, graph, siteId);
  }
  if (cfg._review) {
    prog(`curate --review — ${cfg.curation.dryRun ? "DRY RUN (no writes)" : "LIVE"}`);
    return runReviewCommand(cfg, graph, siteId);
  }
  if (cfg._approve || cfg._withdraw) {
    const mode = cfg._approve ? "approve" : "withdraw";
    prog(`curate --${mode} — ${cfg.curation.dryRun ? "DRY RUN (no writes)" : "LIVE"}, ${(cfg._approve || cfg._withdraw).length} row id(s)`);
    return runReview(cfg, graph, siteId, mode, cfg._approve || cfg._withdraw);
  }
  prog(
    `curate — ${cfg.curation.dryRun ? "DRY RUN (no writes)" : "LIVE"}, ` +
    `${cfg.curation.autoApprove ? "autoApprove (merges apply)" : cfg.curation.review.enabled ? "propose, then the second reader approves" : "propose-then-approve"}, ` +
    `chunk ${cfg.curation.vocabChunk}, cap ${cfg.curation.maxProposals}/chunk`
  );
  // --drain: repeat full passes (each re-fetches the shrunken
  // vocabulary) until a pass writes nothing. Terminates structurally:
  // every written proposal removes its alias from future eligibility
  // (merged in autoApprove mode; CurationStatus-blocked in manual;
  // with the second reader, merged or held — and a pair the reader
  // WITHDREW stays blocked for the rest of the drain, cfg._withdrawn,
  // or the next pass would propose it again and the reader withdraw
  // it again until the pass limit).
  const maxPasses = cfg._drain && !cfg.curation.dryRun ? 20 : 1;
  cfg._withdrawn = new Set();
  cfg._held = new Set(); // row ids the reader held earlier in this drain: not re-asked each pass
  for (let pass = 1; pass <= maxPasses; pass++) {
    if (cfg._drain) {
      prog(`drain pass ${pass} of at most ${maxPasses}`);
      process.stdout.write(`--- drain pass ${pass}\n`);
    }
    const r = await runCuration(cfg, graph, siteId);
    if (r.written === 0) break;
  }
}

/**
 * --repoint — the librarian backfill piece (Curation_Setup.md "Queued
 * follow-ons", mechanics verbatim): an approved merge fixes the
 * vocabulary and all FUTURE junction rows, but historical DocKeywords
 * rows keep pointing at the alias, so RelatedRank undercounts keyword
 * overlap between old docs and new. For each junction row whose
 * keyword is an alias (CanonicalRef set, resolved transitively):
 *   - the doc already carries the canonical (KWKey {doc}|{canon}
 *     exists) → DELETE the alias row (the reindex-added duplicate);
 *   - else MERGE it: KeywordId → canonical, KWKey recomposed, Title's
 *     " | keyword" tail rewritten to the canonical title.
 * Honors dryRun exactly like the weekly job. Run `sweep.mjs --rerank`
 * afterwards to propagate the corrected overlaps into the sidecars'
 * related sections in one pass.
 */
async function runRepoint(cfg, graph, siteId) {
  const sp = cfg.sharePoint;
  const prog = cfg._prog || createProgress({ enabled: false });
  const dry = !!cfg.curation.dryRun;
  const kwListId = sp.lists.keywords;
  const dkListId = sp.lists.docKeywords;
  const plan = [];

  const kwRows = (await graph.listItems(siteId, kwListId, {
    select: ["Title", "CanonicalRefLookupId"],
  })).map((it) => ({
    ID: num(it.id), Title: String(it.fields?.Title || ""),
    CanonicalRefId: num(it.fields?.CanonicalRefLookupId),
  }));
  const kwById = new Map(kwRows.map((r) => [r.ID, r]));
  // resolve an alias to its FINAL canonical (chains are guarded
  // against at proposal time, but historical data gets 5 hops of grace)
  const canonOf = (id) => {
    let cur = kwById.get(id);
    for (let hop = 0; cur && cur.CanonicalRefId && hop < 5; hop++) {
      const next = kwById.get(cur.CanonicalRefId);
      if (!next) break;
      cur = next;
    }
    return cur;
  };

  const dkRows = (await graph.listItems(siteId, dkListId, {
    select: ["Title", "KWKey", "DocumentLookupId", "KeywordLookupId"],
  })).map((it) => ({
    ID: num(it.id), Title: String(it.fields?.Title || ""),
    KWKey: String(it.fields?.KWKey || ""),
    DocumentId: num(it.fields?.DocumentLookupId),
    KeywordId: num(it.fields?.KeywordLookupId),
  }));
  const kwKeys = new Set(dkRows.map((r) => r.KWKey));

  prog(`snapshots — ${kwRows.length} keyword row(s), ${dkRows.length} junction row(s)`);
  const rpPhase = prog.phase("repoint");
  const rpTick = prog.counter(
    dkRows.filter((r) => {
      const kw = kwById.get(r.KeywordId);
      return kw && kw.CanonicalRefId && r.DocumentId;
    }).length,
    "junction rows pointing at an alias"
  );
  let repointed = 0, deleted = 0, aliasRows = 0, errors = 0;
  for (const r of dkRows) {
    const kw = kwById.get(r.KeywordId);
    if (!kw || !kw.CanonicalRefId || !r.DocumentId) continue;
    const canon = canonOf(r.KeywordId);
    if (!canon || canon.ID === r.KeywordId) continue;
    aliasRows++;
    const targetKey = `${r.DocumentId}|${canon.ID}`;
    rpTick(`junction ${r.ID}`, `'${kw.Title}' → '${canon.Title}'`);
    try {
      if (kwKeys.has(targetKey)) {
        // the doc already carries the canonical — the alias row is
        // the harmless-but-real duplicate the setup doc describes
        plan.push({ action: "deleteRow", id: r.ID, what: `dup of ${targetKey}` });
        if (!dry) await graph.deleteItem(siteId, dkListId, r.ID);
        kwKeys.delete(r.KWKey);
        deleted++;
      } else {
        const prefix = r.Title.includes(" | ")
          ? r.Title.slice(0, r.Title.lastIndexOf(" | "))
          : r.Title;
        const fields = {
          KeywordLookupId: canon.ID,
          KWKey: targetKey,
          Title: `${prefix} | ${canon.Title}`,
        };
        plan.push({ action: "patchRow", id: r.ID, fields });
        if (!dry) await graph.updateItemFields(siteId, dkListId, r.ID, fields);
        kwKeys.delete(r.KWKey);
        kwKeys.add(targetKey);
        repointed++;
      }
    } catch (e) {
      errors++;
      prog.fail(`junction ${r.ID}`, e.message);
      process.stderr.write(`repoint failed for junction ${r.ID}: ${e.message}\n`);
    }
  }
  rpPhase.done(
    `${aliasRows} alias junction(s) — ${repointed} repointed, ${deleted} duplicate(s) deleted, ` +
    `${errors} error(s)`
  );

  const line =
    `mode=repoint junctions=${dkRows.length} alias_rows=${aliasRows} ` +
    `repointed=${repointed} deleted=${deleted} errors=${errors}`;
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
  const logFile = path.join(logDir, `curate-${stamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ line, dry_run: dry, plan: dry ? plan : undefined }, null, 1));
  prog(`curation finished in ${secs(prog.elapsed())} — ${line}`);
  process.stdout.write(JSON.stringify({ line, dry_run: dry, logFile }) + "\n");
  process.stdout.write(line + "\n");
  if (dry) process.stdout.write(`dry run: ${plan.length} planned writes recorded in ${logFile}\n`);
  if (!dry && (repointed || deleted)) {
    process.stdout.write(
      "junction rows changed — run `sweep.mjs --rerank` to propagate the " +
      "corrected keyword overlaps into the related sections in one pass\n"
    );
  }
}

async function runCuration(cfg, graph, siteId) {
  const sp = cfg.sharePoint;
  const cur = cfg.curation;
  const prog = cfg._prog || createProgress({ enabled: false });
  const dry = !!cur.dryRun;
  const listId = sp.lists.keywords;
  const plan = [];
  const patch = async (id, fields, what) => {
    plan.push({ action: "patchRow", id, fields, what });
    if (!dry) await graph.updateItemFields(siteId, listId, id, fields);
  };

  const stopFetch = prog.heartbeat("fetching the Keywords list");
  const rows = (
    await graph.listItems(siteId, listId, {
      select: ["Title", "Kind", "CanonicalRefLookupId", "CurationStatus", "ProposedCanonical"],
    }).finally(stopFetch)
  ).map((it) => {
    const f = it.fields || {};
    return {
      ID: num(it.id) ?? num(f.id),
      Title: String(f.Title || ""),
      Kind: String(f.Kind || ""),
      CanonicalRefId: num(f.CanonicalRefLookupId),
      CurationStatus: String(f.CurationStatus || ""),
      ProposedCanonical: String(f.ProposedCanonical || ""),
    };
  });

  prog(`Keywords snapshot — ${rows.length} row(s)`);

  // 1) approved-row cleanup
  const cleanup = prog.phase("cleanup");
  let cleared = 0;
  for (const r of rows) {
    if (r.CanonicalRefId && (r.CurationStatus || r.ProposedCanonical)) {
      await patch(r.ID, { CurationStatus: null, ProposedCanonical: null }, "clear-state");
      cleared++;
      cleanup.step(`'${r.Title}' — approved, curation columns cleared`);
    }
  }
  cleanup.done(`${cleared} approved row(s) cleared`);

  // 2) vocabulary + blocked lines (from the run-start snapshot, as
  // the flow reads Get_keywords_all's body throughout). A row pending
  // review (Proposed) is an alias in waiting: it leaves the vocabulary
  // ENTIRELY, so the model can neither re-propose it nor — as it did on
  // 2026-09-07 when told only "never as an alias" — make it the
  // canonical of the reverse pair. A Rejected row stays a legitimate
  // canonical and is blocked from the alias side only.
  const canon = rows.filter((r) => !r.CanonicalRefId);
  const pendingRows = canon.filter((r) => r.CurationStatus === "Proposed");
  const vocabRows = canon.filter((r) => r.CurationStatus !== "Proposed");
  const blockedRows = vocabRows.filter((r) => r.CurationStatus);
  const withdrawn = cfg._withdrawn || new Set(); // withdrawn earlier in this drain
  const blockedLines = [
    ...blockedRows.map((r) => r.Title),
    ...vocabRows.filter((r) => !r.CurationStatus && withdrawn.has(lower(r.Title))).map((r) => r.Title),
  ].join("\n");

  // 3) the curation prompt (prompts/keyword_curation.md through the
  // Python layer, schema-pinned) — one call per alphabetical vocabulary
  // chunk (see vocabChunk above); per-chunk cap applies, proposals
  // concatenate across chunks
  const canonSorted = [...vocabRows].sort((a, b) =>
    lower(a.Title) < lower(b.Title) ? -1 : lower(a.Title) > lower(b.Title) ? 1 : 0
  );
  const chunkSize = Math.max(1, Number(cur.vocabChunk) || 700);
  const cap = Number(cur.maxProposals) || 20;
  const proposals = [];
  const chunks = Math.ceil(canonSorted.length / chunkSize) || 0;
  const callPhase = prog.phase("model calls");
  callPhase.step(
    `${canonSorted.length} canonical keyword(s) in ${chunks} chunk(s) of ${chunkSize}, ` +
    `${blockedRows.length} blocked from proposal, ${pendingRows.length} pending review (left out)`
  );
  const chunkTick = prog.counter(chunks, "");
  for (let i = 0; i < canonSorted.length; i += chunkSize) {
    const chunk = canonSorted.slice(i, i + chunkSize);
    const vocabulary = chunk.map((r) => `${r.Title} [${r.Kind}]`).join("\n");
    chunkTick(`"${chunk[0].Title}" … "${chunk[chunk.length - 1].Title}"`,
      `${chunk.length} term(s), ~${vocabulary.length} chars in`);
    const t0 = Date.now();
    const stopCall = prog.heartbeat("waiting on the curation model");
    let parsed;
    try {
      parsed = await curateChunk(cfg.llm, { vocabulary, doNotPropose: blockedLines });
    } finally {
      stopCall();
    }
    const got = Array.isArray(parsed?.proposals) ? parsed.proposals : [];
    prog(`   chunk ${chunkTick.count} — ${got.length} proposal(s) in ${secs(Date.now() - t0)}` +
      (got.length > cap ? `, capped at ${cap}` : ""));
    proposals.push(...got.slice(0, cap));
  }
  callPhase.done(`${proposals.length} proposal(s) from ${chunks} chunk(s)`);

  // 4) digest lines — pending rows first. In autoApprove mode a
  // pending proposal from manual-mode weeks is APPLIED now (canonical
  // resolved from the ProposedCanonical "<title> — <why>" prefix);
  // unresolvable ones stay listed as pending.
  const byLower = new Map(rows.map((r) => [lower(r.Title), r]));
  const pendingPhase = prog.phase("pending queue");
  let lines = "";
  let merged = 0;
  for (const r of rows) {
    if (r.CanonicalRefId || r.CurationStatus !== "Proposed") continue;
    let canonRow = null;
    if (cur.autoApprove) {
      const canonTitle = String(r.ProposedCanonical || "").split(" — ")[0].trim();
      const found = byLower.get(lower(canonTitle));
      if (found && found.ID !== r.ID && !found.CanonicalRefId) canonRow = found;
    }
    if (canonRow) {
      await patch(
        r.ID,
        { CanonicalRefLookupId: canonRow.ID, CurationStatus: null, ProposedCanonical: null },
        "auto-approve-pending"
      );
      merged++;
      r.CanonicalRefId = canonRow.ID; // in-memory: never a canonical for a later merge this run
      lines += `- MERGED (pending) '${r.Title}' → '${canonRow.Title}'\n`;
    } else {
      lines += `- (pending) '${r.Title}' → ${r.ProposedCanonical}\n`;
    }
  }
  pendingPhase.done(`${merged} pending proposal(s) applied`);

  // 5) hallucination guard + proposal writes (snapshot semantics, as
  // in the flow — Find_alias/Find_canon read the run-start body)
  const guard = prog.phase("guard + writes");
  let written = 0;
  let dropped = 0;
  for (const p of proposals) {
    const aliasLower = lower(String(p?.alias ?? "").trim());
    const canonLower = lower(String(p?.canonical ?? "").trim());
    const aliasRow = byLower.get(aliasLower);
    const canonRow = byLower.get(canonLower);
    // the flow's verbatim checks, plus (lib/curationguard.mjs) a pending
    // canonical, a kind mismatch and a merge in the wrong direction
    const problem = proposalProblem(aliasRow, canonRow, cfg._official) ||
      (aliasRow && withdrawn.has(lower(aliasRow.Title)) ? "withdrawn by the second reader earlier in this drain" : "");
    if (problem) {
      dropped++;
      guard.step(`dropped '${String(p?.alias ?? "")}' → '${String(p?.canonical ?? "")}' — ${problem}`);
      continue;
    }
    const why = String(p.why ?? "").replaceAll('"', "").replaceAll("\n", " ").slice(0, 160);
    if (cur.autoApprove) {
      await patch(aliasRow.ID, { CanonicalRefLookupId: canonRow.ID }, "auto-approve");
      merged++;
      aliasRow.CanonicalRefId = canonRow.ID; // in-memory: a later proposal cannot chain onto it
      lines += `- MERGED '${aliasRow.Title}' → '${canonRow.Title}' — ${why}\n`;
    } else {
      await patch(
        aliasRow.ID,
        { CurationStatus: "Proposed", ProposedCanonical: `${canonRow.Title} — ${why}` },
        "write-proposal"
      );
      aliasRow.CurationStatus = "Proposed"; // in-memory: the review pass below sees it
      aliasRow.ProposedCanonical = `${canonRow.Title} — ${why}`;
      lines += `- '${aliasRow.Title}' → '${canonRow.Title}' — ${why}\n`;
    }
    guard.step(
      `${cur.autoApprove ? "merged" : "proposed"} '${aliasRow.Title}' → '${canonRow.Title}'`
    );
    written++;
  }
  guard.done(`${written} written, ${dropped} dropped by the guard`);

  // 5b) the second reader (curation.review.enabled): every pending
  // proposal — this run's and the carryover — judged by the review
  // prompt after the deterministic guard, its verdicts applied. The
  // digest then lists what was approved, withdrawn and held.
  let review = null;
  if (cur.review.enabled && !cur.autoApprove) {
    review = await runReviewPass(cfg, graph, siteId, rows, patch, prog);
    lines = review.lines;
  }

  // 6) digest — overwritten at a fixed name every run (DX-11: an
  // emptied queue writes an explicit empty state)
  await writeDigest(cfg, graph, siteId, plan, lines, dry, prog, review ? "review" : cur.autoApprove ? "auto" : "manual");

  // 7) summary + run log
  const line =
    `canon=${canon.length} blocked=${blockedRows.length} pending=${pendingRows.length} ` +
    `proposed_by_model=${proposals.length} written=${written} ` +
    `dropped=${dropped} cleared=${cleared}` +
    (cur.autoApprove ? ` merged=${merged}` : "") +
    (review ? ` review_pending=${review.pending} review_approved=${review.approved} review_withdrawn=${review.withdrawn} review_held=${review.held} review_calls=${review.calls}` : "");
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
  const logFile = path.join(logDir, `curate-${stamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ line, dry_run: dry, plan: dry ? plan : undefined }, null, 1));
  const keep = fs.readdirSync(logDir).filter((f) => /^curate-.*\.json$/.test(f)).sort();
  for (const f of keep.slice(0, Math.max(0, keep.length - 10))) {
    try { fs.unlinkSync(path.join(logDir, f)); } catch { /* best effort */ }
  }

  process.stdout.write(JSON.stringify({ line, dry_run: dry, logFile }) + "\n");
  process.stdout.write(line + "\n");
  if (dry) process.stdout.write(`dry run: ${plan.length} planned writes recorded in ${logFile}\n`);
  else if (review?.approved) {
    process.stdout.write(
      "merges approved by the second reader — run `curate.mjs --repoint --live` to re-point the historical " +
      "Doc Keywords rows, then `sweep.mjs --rerank --live`\n"
    );
  }
  return { written, merged, dropped, cleared, review };
}

/** The digest file, overwritten at a fixed name (DX-11: an emptied
 *  queue writes an explicit empty state). `mode` picks the how-to. */
async function writeDigest(cfg, graph, siteId, plan, lines, dry, prog, mode) {
  const cur = cfg.curation;
  const head =
    `# Keyword curation digest\n\n` +
    `Run: ${new Date().toISOString()}  ·  CurationPromptVersion: ${cur.promptVersion}\n\n`;
  const howTo = mode === "auto"
    ? "Merges are applied AUTOMATICALLY (curation.autoApprove).\n" +
      "Undo a wrong merge: clear the row's CanonicalRef AND set " +
      "CurationStatus = Rejected (blocks re-proposal).\n\n"
    : mode === "review"
    ? "A second reader (prompts/keyword_review.md, curation.review) judged every pending proposal:\n" +
      "APPROVED ones are merged, WITHDRAWN ones cleared, HELD ones await you.\n" +
      "Approve a held row: set CanonicalRef to the named row. Reject: set CurationStatus = Rejected.\n" +
      "Undo a wrong merge: pipeline/unmerge.mjs --ids-file (clears CanonicalRef; --reject blocks re-proposal).\n\n"
    : "Approve: open the Keywords row, set CanonicalRef to the named row.\n" +
      "Reject: set CurationStatus = Rejected.\n" +
      "Review view: Keywords → Curation queue.\n\n";
  const digest =
    lines !== ""
      ? head + howTo + lines
      : head +
        "The queue is EMPTY — no pending proposals. All previously proposed " +
        "merges have been approved or rejected; the next Saturday run may " +
        "propose new ones.";
  const digestPath = `${cur.digestDrivePath}/${cur.digestName}`;
  plan.push({ action: "putFile", path: digestPath, bytes: digest.length });
  prog(`digest — ${digest.length} chars ${dry ? "planned for" : "uploaded to"} ${digestPath}`);
  if (!dry) await graph.putFile(siteId, digestPath, digest);
}

/**
 * The second reader's pass over the pending queue. For every row with
 * CurationStatus = Proposed:
 *   1. the deterministic guard (lib/curationguard.mjs, the official
 *      vocabulary included) — a failing pair is WITHDRAWN without a
 *      model call, and a pair whose canonical is itself pending is
 *      HELD (a chain; it resolves once the far end is decided);
 *   2. the rest go to prompts/keyword_review.md in chunks of
 *      curation.review.chunk, one verdict per id: approve / withdraw /
 *      hold. A missing verdict is a hold.
 * Approvals apply exactly like --approve (CanonicalRef set, flow-owned
 * columns cleared; the canonical re-checked at apply time), withdrawals
 * like --withdraw, holds stay pending for a librarian. Honors dryRun
 * (the model is still called, as the weekly proposal call is).
 */
async function runReviewPass(cfg, graph, siteId, rows, patch, prog) {
  const rv = cfg.curation.review;
  const byLower = new Map(rows.map((r) => [lower(r.Title), r]));
  const pending = rows.filter((r) => !r.CanonicalRefId && r.CurationStatus === "Proposed" && r.ProposedCanonical);
  const phase = prog.phase("second reader");
  const results = [];
  const toModel = [];
  for (const r of pending) {
    const canonTitle = String(r.ProposedCanonical).split(" — ")[0].trim();
    const why = String(r.ProposedCanonical).split(" — ").slice(1).join(" — ");
    const canonRow = byLower.get(lower(canonTitle));
    const rec = { row: r, canonRow, canonTitle, why, outcome: "", note: "" };
    const problem = proposalProblem({ ...r, CurationStatus: "" }, canonRow && { ...canonRow, CurationStatus: "" }, cfg._official);
    if (problem) { rec.outcome = "withdraw"; rec.note = `guard: ${problem}`; }
    else if (canonRow.CurationStatus === "Proposed") { rec.outcome = "hold"; rec.note = "its canonical is itself pending (a chain)"; }
    else if (cfg._held?.has(r.ID)) { rec.outcome = "hold"; rec.note = "held earlier in this drain — a librarian decides"; }
    else toModel.push(rec);
    results.push(rec);
  }
  phase.step(`${pending.length} pending — ${results.length - toModel.length} decided by the guard, ${toModel.length} to the model`);
  const official = [
    ...cfg._vocab.tools.map((t) => t.name), ...cfg._vocab.widgets.map((t) => t.name), ...cfg._vocab.terms.map((t) => t.term),
  ].join("\n");
  const chunk = Math.max(1, Number(rv.chunk) || 100);
  let calls = 0;
  const clean = (t) => String(t ?? "").replaceAll('"', "").replaceAll("\n", " ").trim().slice(0, 160);
  for (let i = 0; i < toModel.length; i += chunk) {
    const slice = toModel.slice(i, i + chunk);
    const text = slice
      .map((x) => `${x.row.ID} | ${x.row.Title} [${x.row.Kind}] -> ${x.canonRow.Title} [${x.canonRow.Kind}] | ${x.why}`)
      .join("\n");
    calls++;
    const t0 = Date.now();
    const stop = prog.heartbeat("waiting on the second reader");
    let parsed;
    try {
      parsed = await reviewProposals(cfg.llm, { proposals: text, officialVocabulary: official }, rv);
    } finally {
      stop();
    }
    const byId = new Map((parsed?.verdicts || []).map((v) => [Number(v.id), v]));
    for (const x of slice) {
      const v = byId.get(x.row.ID);
      if (!v) { x.outcome = "hold"; x.note = "no verdict returned"; continue; }
      x.outcome = ["approve", "withdraw", "hold"].includes(v.verdict) ? v.verdict : "hold";
      x.note = clean(v.why);
    }
    prog(`   review call ${calls} — ${slice.length} proposal(s) in ${secs(Date.now() - t0)}`);
  }
  // apply — approvals first, so a chain's far end is settled before its
  // near end is looked at
  let approved = 0;
  let withdrawn = 0;
  let held = 0;
  let lines = "";
  const ordered = [...results.filter((x) => x.outcome === "approve"), ...results.filter((x) => x.outcome !== "approve")];
  for (const x of ordered) {
    if (x.outcome === "approve" && (x.canonRow.CanonicalRefId || x.canonRow.CurationStatus === "Proposed")) {
      x.outcome = "hold";
      x.note = "its canonical changed during the pass";
    }
    if (x.outcome === "approve") {
      await patch(x.row.ID, { CanonicalRefLookupId: x.canonRow.ID, CurationStatus: null, ProposedCanonical: null }, "review-approve");
      x.row.CanonicalRefId = x.canonRow.ID;
      x.row.CurationStatus = "";
      x.row.ProposedCanonical = "";
      approved++;
      phase.step(`approved '${x.row.Title}' → '${x.canonRow.Title}' — ${x.note}`);
      lines += `- APPROVED (review) '${x.row.Title}' → '${x.canonRow.Title}' — ${x.why} · reviewer: ${x.note}\n`;
    } else if (x.outcome === "withdraw") {
      await patch(x.row.ID, { CurationStatus: null, ProposedCanonical: null }, "review-withdraw");
      cfg._withdrawn?.add(lower(x.row.Title));
      x.row.CurationStatus = "";
      x.row.ProposedCanonical = "";
      withdrawn++;
      phase.step(`withdrew '${x.row.Title}' → '${x.canonTitle}' — ${x.note}`);
      lines += `- WITHDRAWN (review) '${x.row.Title}' → '${x.canonTitle}' — ${x.note}\n`;
    } else {
      held++;
      cfg._held?.add(x.row.ID);
      phase.step(`held '${x.row.Title}' → '${x.canonTitle}' — ${x.note}`);
      lines += `- (pending, held for a librarian) '${x.row.Title}' → ${x.row.ProposedCanonical} · reviewer: ${x.note}\n`;
    }
  }
  phase.done(`${approved} approved, ${withdrawn} withdrawn, ${held} held, ${calls} model call(s)`);
  return {
    pending: pending.length, approved, withdrawn, held, calls, lines,
    verdicts: results.map((x) => ({ id: x.row.ID, alias: x.row.Title, canonical: x.canonTitle, outcome: x.outcome, note: x.note })),
  };
}

/** --review — the second reader's pass alone, over the current queue. */
async function runReviewCommand(cfg, graph, siteId) {
  const sp = cfg.sharePoint;
  const cur = cfg.curation;
  const prog = cfg._prog || createProgress({ enabled: false });
  const dry = !!cur.dryRun;
  const listId = sp.lists.keywords;
  const plan = [];
  const patch = async (id, fields, what) => {
    plan.push({ action: "patchRow", id, fields, what });
    if (!dry) await graph.updateItemFields(siteId, listId, id, fields);
  };
  const stopFetch = prog.heartbeat("fetching the Keywords list");
  const rows = (
    await graph.listItems(siteId, listId, {
      select: ["Title", "Kind", "CanonicalRefLookupId", "CurationStatus", "ProposedCanonical"],
    }).finally(stopFetch)
  ).map((it) => {
    const f = it.fields || {};
    return {
      ID: num(it.id) ?? num(f.id),
      Title: String(f.Title || ""),
      Kind: String(f.Kind || ""),
      CanonicalRefId: num(f.CanonicalRefLookupId),
      CurationStatus: String(f.CurationStatus || ""),
      ProposedCanonical: String(f.ProposedCanonical || ""),
    };
  });
  prog(`Keywords snapshot — ${rows.length} row(s)`);
  const review = await runReviewPass(cfg, graph, siteId, rows, patch, prog);
  await writeDigest(cfg, graph, siteId, plan, review.lines, dry, prog, "review");
  const line =
    `mode=review pending=${review.pending} approved=${review.approved} withdrawn=${review.withdrawn} ` +
    `held=${review.held} calls=${review.calls}`;
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
  const logFile = path.join(logDir, `curate-${stamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ line, dry_run: dry, verdicts: review.verdicts, plan }, null, 1));
  process.stdout.write(JSON.stringify({ line, dry_run: dry, logFile }) + "\n");
  process.stdout.write(line + "\n");
  if (dry) process.stdout.write(`dry run: ${plan.filter((p) => p.action === "patchRow").length} planned write(s) recorded in ${logFile} — re-run with --live to apply\n`);
  else if (review.approved) {
    process.stdout.write(
      "merges approved — run `curate.mjs --repoint --live` to re-point the historical Doc Keywords rows, " +
      "then `sweep.mjs --rerank --live`\n"
    );
  }
  return review;
}

/**
 * --approve <ids-file> / --withdraw <ids-file> — the review, by list.
 * The digest's contract is one row at a time in SharePoint (set
 * CanonicalRef to approve, CurationStatus = Rejected to reject); a
 * hundred-row queue reviewed in a spreadsheet wants the same two
 * verdicts applied from a file of row IDs.
 *
 *   approve  — for each pending row (CurationStatus = Proposed): resolve
 *              the canonical from ProposedCanonical's "<title> — <why>",
 *              re-run the guard against the LIVE list (a real canonical
 *              row, not itself an alias or pending, same kind, right
 *              direction), then set CanonicalRef and clear the
 *              flow-owned columns — exactly the librarian's click.
 *              A row whose canonical is also in the list as an alias is
 *              skipped (it would chain): approve the far end, then
 *              re-propose the near one against the final canonical.
 *   withdraw — clear CurationStatus + ProposedCanonical on each pending
 *              row: the proposal never happened, the row is an ordinary
 *              candidate again (unlike Rejected, which blocks it).
 *
 * Both honor dryRun exactly like the weekly job (plan only unless
 * --live), record the plan in the curate-<stamp>.json run log, and
 * touch NO other row. The digest is not rewritten here — the next
 * weekly run does that from the list. After approving, run --repoint.
 */
async function runReview(cfg, graph, siteId, mode, ids) {
  const sp = cfg.sharePoint;
  const cur = cfg.curation;
  const prog = cfg._prog || createProgress({ enabled: false });
  const dry = !!cur.dryRun;
  const listId = sp.lists.keywords;
  const plan = [];
  const patch = async (id, fields, what) => {
    plan.push({ action: "patchRow", id, fields, what });
    if (!dry) await graph.updateItemFields(siteId, listId, id, fields);
  };

  const stopFetch = prog.heartbeat("fetching the Keywords list");
  const rows = (
    await graph.listItems(siteId, listId, {
      select: ["Title", "Kind", "CanonicalRefLookupId", "CurationStatus", "ProposedCanonical"],
    }).finally(stopFetch)
  ).map((it) => {
    const f = it.fields || {};
    return {
      ID: num(it.id) ?? num(f.id),
      Title: String(f.Title || ""),
      Kind: String(f.Kind || ""),
      CanonicalRefId: num(f.CanonicalRefLookupId),
      CurationStatus: String(f.CurationStatus || ""),
      ProposedCanonical: String(f.ProposedCanonical || ""),
    };
  });
  const byId = new Map(rows.map((r) => [r.ID, r]));
  const byLower = new Map(rows.map((r) => [lower(r.Title), r]));
  const listed = new Set(ids);
  prog(`Keywords snapshot — ${rows.length} row(s), ${rows.filter((r) => !r.CanonicalRefId && r.CurationStatus === "Proposed").length} pending review`);

  const phase = prog.phase(mode);
  const tick = prog.counter(ids.length, "row ids");
  let applied = 0;
  let skipped = 0;
  const notes = []; // printed after the summary JSON line (stdout's first line is the contract)
  const skip = (id, row, why) => {
    skipped++;
    plan.push({ action: "skip", id, title: row?.Title ?? "", why });
    tick(row ? `'${row.Title}'` : `#${id}`, `skipped — ${why}`);
    notes.push(`skip ${id}${row ? ` '${row.Title}'` : ""}: ${why}`);
  };
  for (const id of ids) {
    const row = byId.get(id);
    if (!row) { skip(id, null, "no such row"); continue; }
    if (row.CanonicalRefId) { skip(id, row, "already merged"); continue; }
    if (row.CurationStatus !== "Proposed") {
      skip(id, row, row.CurationStatus ? `not pending (${row.CurationStatus})` : "not pending (no proposal on the row)");
      continue;
    }
    if (mode === "withdraw") {
      await patch(id, { CurationStatus: null, ProposedCanonical: null }, "withdraw");
      applied++;
      tick(`'${row.Title}'`, `withdrawn — was → ${row.ProposedCanonical}`);
      continue;
    }
    const canonTitle = row.ProposedCanonical.split(" — ")[0].trim();
    const canonRow = byLower.get(lower(canonTitle));
    if (canonRow && !canonRow.CanonicalRefId && canonRow.CurationStatus === "Proposed") {
      // a chain: its canonical is pending as an alias itself (in this
      // list or not) — approving it here would point at a row that is
      // about to become an alias
      skip(id, row, `its canonical '${canonRow.Title}' is itself ${listed.has(canonRow.ID) ? "in the review list" : "pending review"} as an alias — approve that first, then re-propose this one against the final canonical`);
      continue;
    }
    // the guard sees the alias as it will be judged: uncurated
    const problem = proposalProblem({ ...row, CurationStatus: "" }, canonRow, cfg._official);
    if (problem) { skip(id, row, `${problem} (→ '${canonTitle}')`); continue; }
    await patch(id, { CanonicalRefLookupId: canonRow.ID, CurationStatus: null, ProposedCanonical: null }, "approve");
    row.CanonicalRefId = canonRow.ID; // in-memory: never a canonical for a later row this run
    applied++;
    tick(`'${row.Title}'`, `→ '${canonRow.Title}'`);
  }
  phase.done(`${applied} ${mode === "approve" ? "approved" : "withdrawn"}, ${skipped} skipped`);

  const line = `mode=${mode} given=${ids.length} applied=${applied} skipped=${skipped}`;
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
  const logFile = path.join(logDir, `curate-${stamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ line, dry_run: dry, plan }, null, 1));
  process.stdout.write(JSON.stringify({ line, dry_run: dry, logFile }) + "\n");
  process.stdout.write(line + "\n");
  for (const n of notes) process.stdout.write(n + "\n");
  if (dry) {
    process.stdout.write(`dry run: ${plan.filter((p) => p.action === "patchRow").length} planned write(s) recorded in ${logFile} — re-run with --live to apply\n`);
  } else if (mode === "approve" && applied) {
    process.stdout.write(
      "merges applied — run `curate.mjs --repoint --live` to re-point the historical Doc Keywords rows, " +
      "then `sweep.mjs --rerank --live`; the next weekly run rewrites the digest\n"
    );
  }
  return { applied, skipped };
}

/**
 * --seed-vocabulary — plant the official vocabulary in the Keywords
 * list: one row per essential term (Kind topic) and per official tool
 * or widget (Kind tool) that has no row yet, Title in the catalog's
 * lowercase form, Notes naming the documentation page. From then on
 * the classifier's ExistingKeywords spelling reference carries the
 * official spelling of every core term, so it stops minting variants,
 * and the curation guard treats the row as the canonical side of any
 * pair. A row that exists (any casing, or as an alias) is left alone.
 * Honors dryRun like every other command.
 */
async function runSeed(cfg, graph, siteId) {
  const sp = cfg.sharePoint;
  const prog = cfg._prog || createProgress({ enabled: false });
  const dry = !!cfg.curation.dryRun;
  const listId = sp.lists.keywords;
  const v = cfg._vocab;
  if (!v.terms.length && !v.tools.length) {
    throw new Error(`no official vocabulary at ${v.file} — run pipeline/doc_vocab.mjs first`);
  }
  const stopFetch = prog.heartbeat("fetching the Keywords list");
  const rows = (
    await graph.listItems(siteId, listId, { select: ["Title", "Kind", "CanonicalRefLookupId"] }).finally(stopFetch)
  ).map((it) => ({ ID: num(it.id), Title: String(it.fields?.Title || ""), Kind: String(it.fields?.Kind || "") }));
  const have = new Set(rows.map((r) => lower(r.Title).trim()));
  const wanted = [
    ...v.terms.map((t) => ({ title: lower(t.term).trim(), kind: "topic", url: t.url, what: "term" })),
    ...v.tools.map((t) => ({ title: lower(t.name).trim(), kind: "tool", url: t.url, what: "tool" })),
    ...v.widgets.map((t) => ({ title: lower(t.name).trim(), kind: "tool", url: t.url || "", what: "widget" })),
  ].filter((w) => w.title);
  const plan = [];
  const phase = prog.phase("seeding");
  const tick = prog.counter(wanted.length, "official names");
  let created = 0;
  let present = 0;
  const seen = new Set();
  for (const w of wanted) {
    if (seen.has(w.title)) continue;
    seen.add(w.title);
    if (have.has(w.title)) { present++; tick(w.title, "present"); continue; }
    const fields = { Title: w.title, Kind: w.kind, Notes: `Esri documentation ${w.what}${w.url ? `: ${w.url}` : ""}` };
    plan.push({ action: "createRow", fields });
    tick(w.title, `+ [${w.kind}]`);
    if (!dry) await graph.createItem(siteId, listId, fields);
    created++;
  }
  phase.done(`${created} ${dry ? "would be " : ""}created, ${present} already present`);
  const line = `mode=seed-vocabulary official=${seen.size} created=${created} present=${present}`;
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "").slice(0, 15);
  const logFile = path.join(logDir, `curate-${stamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ line, dry_run: dry, plan }, null, 1));
  process.stdout.write(JSON.stringify({ line, dry_run: dry, logFile }) + "\n");
  process.stdout.write(line + "\n");
  if (dry) process.stdout.write(`dry run: ${plan.length} planned row(s) recorded in ${logFile} — re-run with --live to create them\n`);
  return { created, present };
}

main().catch((e) => {
  process.stderr.write("curate: " + (e.stack || e.message) + "\n");
  process.exit(1);
});
