#!/usr/bin/env node
/**
 * curate.mjs v1.0 — the KeywordCuration cloud flow (v1.1) as a local
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
 *   3. One AI Builder call — the tenant's own "LRS Keyword Curation"
 *      custom prompt via Dataverse Predict (llm.curationModelId),
 *      inputs Vocabulary / DoNotPropose, F3 brace-slice parse
 *      degrading to zero proposals, capped at curation.maxProposals.
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
 * llm.environmentUrl + llm.curationModelId (find it with --models),
 * optional curation.{digestName,digestDrivePath,maxProposals,
 * promptVersion,dryRun}.
 *
 * Usage:
 *   node --experimental-strip-types local/curate.mjs --config local/config.json [--live|--dry-run]
 *   node --experimental-strip-types local/curate.mjs --config local/config.json --models
 *     (lists the environment's AI Builder models with their GUIDs —
 *      copy the "LRS Keyword Curation" one into llm.curationModelId)
 */

import fs from "node:fs";
import path from "node:path";
import { GraphClient } from "./graph.mjs";
import { aiBuilderPredict, braceSlice, dataverseToken } from "./llm.mjs";

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
    else if (a === "--models") args.flags.models = true;
    else if (a === "--drain") args.flags.drain = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.config) {
    throw new Error("usage: curate.mjs --config <config.json> [--live|--dry-run|--models|--drain]");
  }
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  cfg.llm = cfg.llm || {};
  cfg.graph = cfg.graph || {};
  const authDir = path.join(cfg.paths?.workDir || ".", "auth");
  cfg.graph.tokenCache = cfg.graph.tokenCache || path.join(authDir, "graph.json");
  // aibuilder auth inherits Graph settings, exactly as sweep.mjs does
  const inherit = { ...cfg.graph };
  const inheritMode = inherit.auth || (inherit.clientSecret !== undefined ? "app" : "device");
  if (inheritMode === "device") delete inherit.clientId;
  delete inherit.baseUrl;
  cfg.llm.dataverse = {
    ...inherit,
    tokenCache: path.join(authDir, "dataverse.json"),
    ...(cfg.llm.dataverse || {}),
  };
  cfg.curation = {
    digestName: "Keyword_Curation_Digest.md",
    digestDrivePath: "", // site default drive root = Shared Documents
    maxProposals: 20,
    promptVersion: "v1.0",
    // false = the flow's propose-then-approve contract (a human sets
    // CanonicalRef). true = guard-passing merges apply immediately,
    // pending proposals from manual mode included; the digest becomes
    // an audit log with undo instructions.
    autoApprove: false,
    dryRun: true,
    ...(cfg.curation || {}),
  };
  if (args.flags.live) cfg.curation.dryRun = false;
  if (args.flags.dry) cfg.curation.dryRun = true;
  cfg._models = !!args.flags.models;
  cfg._drain = !!args.flags.drain;
  return cfg;
}

async function listModels(cfg) {
  const url =
    `${cfg.llm.environmentUrl}/api/data/v9.2/msdyn_aimodels` +
    `?$select=msdyn_aimodelid,msdyn_name&$orderby=msdyn_name`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      authorization: "Bearer " + (await dataverseToken(cfg.llm)),
    },
  });
  if (!res.ok) {
    throw new Error(`model list failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const json = await res.json();
  for (const m of json.value || []) {
    console.log(`${m.msdyn_aimodelid}  ${m.msdyn_name}`);
  }
  console.log("\nCopy the \"LRS Keyword Curation\" GUID into config llm.curationModelId");
}

async function main() {
  const cfg = loadConfig(process.argv.slice(2));
  if (cfg._models) return listModels(cfg);
  if (!cfg.llm.curationModelId) {
    throw new Error("llm.curationModelId is not set — run with --models to find the LRS Keyword Curation model GUID");
  }
  const graph = new GraphClient(cfg.graph);
  const siteId = await graph.siteId(cfg.sharePoint.hostname, cfg.sharePoint.sitePath);
  // --drain: repeat full passes (each re-fetches the shrunken
  // vocabulary) until a pass writes nothing. Terminates structurally:
  // every written proposal removes its alias from future eligibility
  // (merged in autoApprove mode; CurationStatus-blocked in manual).
  const maxPasses = cfg._drain && !cfg.curation.dryRun ? 20 : 1;
  for (let pass = 1; pass <= maxPasses; pass++) {
    if (cfg._drain) process.stdout.write(`--- drain pass ${pass}\n`);
    const r = await runCuration(cfg, graph, siteId);
    if (r.written === 0) break;
  }
}

async function runCuration(cfg, graph, siteId) {
  const sp = cfg.sharePoint;
  const cur = cfg.curation;
  const dry = !!cur.dryRun;
  const listId = sp.lists.keywords;
  const plan = [];
  const patch = async (id, fields, what) => {
    plan.push({ action: "patchRow", id, fields, what });
    if (!dry) await graph.updateItemFields(siteId, listId, id, fields);
  };

  const rows = (
    await graph.listItems(siteId, listId, {
      select: ["Title", "Kind", "CanonicalRefLookupId", "CurationStatus", "ProposedCanonical"],
    })
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

  // 1) approved-row cleanup
  let cleared = 0;
  for (const r of rows) {
    if (r.CanonicalRefId && (r.CurationStatus || r.ProposedCanonical)) {
      await patch(r.ID, { CurationStatus: null, ProposedCanonical: null }, "clear-state");
      cleared++;
    }
  }

  // 2) vocabulary + blocked lines (from the run-start snapshot, as
  // the flow reads Get_keywords_all's body throughout)
  const canon = rows.filter((r) => !r.CanonicalRefId);
  const vocabLines = canon.map((r) => `${r.Title} [${r.Kind}]`).join("\n");
  const blockedRows = canon.filter((r) => r.CurationStatus);
  const blockedLines = blockedRows.map((r) => r.Title).join("\n");

  // 3) the tenant's curation prompt, one call
  const response = await aiBuilderPredict(
    cfg.llm,
    { Vocabulary: vocabLines, DoNotPropose: blockedLines },
    cfg.llm.curationModelId
  );
  const text = response?.responsev2?.predictionOutput?.text ?? "{}";
  let parsed = {};
  try {
    parsed = JSON.parse(braceSlice(text));
  } catch {
    process.stderr.write("curate: unparseable model output — zero proposals this week\n");
  }
  const proposals = (Array.isArray(parsed?.proposals) ? parsed.proposals : []).slice(
    0,
    Number(cur.maxProposals) || 20
  );

  // 4) digest lines — pending rows first. In autoApprove mode a
  // pending proposal from manual-mode weeks is APPLIED now (canonical
  // resolved from the ProposedCanonical "<title> — <why>" prefix);
  // unresolvable ones stay listed as pending.
  const byLower = new Map(rows.map((r) => [lower(r.Title), r]));
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
      lines += `- MERGED (pending) '${r.Title}' → '${canonRow.Title}'\n`;
    } else {
      lines += `- (pending) '${r.Title}' → ${r.ProposedCanonical}\n`;
    }
  }

  // 5) hallucination guard + proposal writes (snapshot semantics, as
  // in the flow — Find_alias/Find_canon read the run-start body)
  let written = 0;
  let dropped = 0;
  for (const p of proposals) {
    const aliasLower = lower(String(p?.alias ?? "").trim());
    const canonLower = lower(String(p?.canonical ?? "").trim());
    const aliasRow = byLower.get(aliasLower);
    const canonRow = byLower.get(canonLower);
    const valid =
      aliasRow && canonRow &&
      aliasLower !== canonLower &&
      !aliasRow.CanonicalRefId &&
      !aliasRow.CurationStatus &&
      !canonRow.CanonicalRefId;
    if (!valid) {
      dropped++;
      continue;
    }
    const why = String(p.why ?? "").replaceAll('"', "").replaceAll("\n", " ").slice(0, 160);
    if (cur.autoApprove) {
      await patch(aliasRow.ID, { CanonicalRefLookupId: canonRow.ID }, "auto-approve");
      merged++;
      lines += `- MERGED '${aliasRow.Title}' → '${canonRow.Title}' — ${why}\n`;
    } else {
      await patch(
        aliasRow.ID,
        { CurationStatus: "Proposed", ProposedCanonical: `${canonRow.Title} — ${why}` },
        "write-proposal"
      );
      lines += `- '${aliasRow.Title}' → '${canonRow.Title}' — ${why}\n`;
    }
    written++;
  }

  // 6) digest — overwritten at a fixed name every run (DX-11: an
  // emptied queue writes an explicit empty state)
  const head =
    `# Keyword curation digest\n\n` +
    `Run: ${new Date().toISOString()}  ·  CurationPromptVersion: ${cur.promptVersion}\n\n`;
  const howTo = cur.autoApprove
    ? "Merges are applied AUTOMATICALLY (curation.autoApprove).\n" +
      "Undo a wrong merge: clear the row's CanonicalRef AND set " +
      "CurationStatus = Rejected (blocks re-proposal).\n\n"
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
  if (!dry) await graph.putFile(siteId, digestPath, digest);

  // 7) summary + run log
  const line =
    `canon=${canon.length} blocked=${blockedRows.length} ` +
    `proposed_by_model=${proposals.length} written=${written} ` +
    `dropped=${dropped} cleared=${cleared}` +
    (cur.autoApprove ? ` merged=${merged}` : "");
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
  return { written, merged, dropped, cleared };
}

main().catch((e) => {
  process.stderr.write("curate: " + (e.stack || e.message) + "\n");
  process.exit(1);
});
