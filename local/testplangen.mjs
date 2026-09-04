#!/usr/bin/env node
/**
 * testplangen.mjs v1.2 — the TestPlanGenCore cloud flow (v2.3) as a
 * local on-demand job: draft a test plan from one indexed User Story
 * row, grounded strictly in that story with the catalog's related
 * documentation as reference. Phases 1–3 of
 * `testplangen/Local_TestPlanGen_Plan.md` (component record:
 * `testplangen/CHANGES.md` v2.16 / v2.17 / v2.18).
 *
 * v1.2 (phase 3) adds:
 *   - `--auto` — unattended gap-drafting (the runAuto docblock below
 *     is the contract): freshly indexed User Stories nothing in the
 *     catalog covers get a draft after the nightly sweep, gated on
 *     `testplangen.autoDraft`, capped by `autoMaxPerRun`, idempotent
 *     against existing drafts (`--force` overrides for one run),
 *     verify=strict and notify forced on, dry runs selection-only
 *     (zero model calls). Schedule via local/run_testplangen.cmd.
 *   - `testplangen.provider` — overrides `llm.provider` for the
 *     generation call ONLY, so generation can run the anthropic lane
 *     while the sweep's classify step stays on AI Builder (or the
 *     reverse).
 *
 * v1.1 (phase 2) adds:
 *   - the lookup front door — `--issue <n>` / `--title "<words>"`
 *     resolve to a Doc Index row id via StoryLookupFlow's
 *     deterministic queries, in-process (`testplangen/CHANGES.md`
 *     v2.3): the issue lane filters the Doc IDs list on IssueNumber
 *     (dedup by document, kind-filtered to Indexed User Stories), the
 *     title lane contains-matches indexed User Story titles, both
 *     in-memory from the run-start snapshots (the curation §1 rule —
 *     no user text in OData). Ambiguity goes back to the human: many
 *     matches print a capped candidate list and refuse; zero matches
 *     coach; generation is NOT invoked either way. The v2.3
 *     bare-number rule holds structurally: `--story` takes only a
 *     Doc Index row id and issue numbers need `--issue` — nothing is
 *     ever guessed.
 *   - opt-in webhook notification (`--notify` / testplangen.notify +
 *     alerts.webhookUrl): one line per WRITTEN draft (story, title,
 *     draft URL, Gen_summary). Default off — the person who ran a
 *     manual generation is already watching; phase 3's auto mode
 *     forces it on.
 *   - the verifier's grounding layer (lib/draftlint.mjs
 *     `groundDraft`, heuristics — Coverage Map requirements traced to
 *     the story, the tools rule made checkable on Steps/Expected
 *     Result lines, enumeration echo). Runs under the same verify
 *     policy as the contract lint, findings prefixed "grounding: ";
 *     testplangen.grounding: false disables just this layer.
 *
 * Faithful to `testplangen/TestPlanGen_Setup.md` §3 (G1–G13):
 *   G1–G2  story row + hard guard (DocKind = User Story,
 *          IndexStatus = Indexed, sidecar URL present) — the flow's
 *          Terminate_not_story message verbatim.
 *   G3–G4  story sidecar from the OneDrive-synced library
 *          (urlToLocal, the sweep's mapping); `related:` line-sliced,
 *          never YAML-parsed (first `related: [`, cut at newline,
 *          bracket-checked; internally invalid JSON fails the run —
 *          the flow's accepted Catch residual).
 *   G5     lanes over the score-ordered entries: every fetched
 *          neighbor lands one digest line; Test Plans and Design
 *          Spikes with a sidecar route on — same-surface Test Plans
 *          into the exemplar slots, everything else admitted
 *          (overflow, cross-surface, spikes) into the reference lane.
 *          A missing neighbor row degrades silently (Try_neighbor).
 *   G6     exemplar fallback when the related list yields none: the
 *          same-surface Indexed Test Plans, newest 12, release-match
 *          winner-takes-all (only when the story HAS a release —
 *          DX-7), else the newest ExemplarSlots. Local deviation,
 *          documented: ordered by SourceModified (the snapshot's
 *          field) where the flow orders by list Modified. The
 *          reference lane keeps its deliberate NO-fallback rule.
 *   G7/G7b lane bodies with remaining-budget takes (the v2.13
 *          Ex_remaining/Ref_remaining semantics — exChars/refChars
 *          can never exceed their caps).
 *   G8     ONE model call. Provider "aibuilder" (default): the
 *          tenant's `LRS Test Plan Generation` prompt via Dataverse
 *          Predict (llm.testPlanModelId — find it with --models; the
 *          tenant paste state applies, Coverage_Runbook.md step 2).
 *          Provider "anthropic": prompts/TestPlanGen_Prompt.md
 *          executed VERBATIM between its delimiters — zero tenant
 *          work, the v1.8 rules apply as authored; single-pass
 *          placeholder substitution so document content can never
 *          inject a second substitution.
 *   G9     marker slice ([[[DRAFT BEGIN]]]/[[[DRAFT END]]],
 *          indexOf/lastIndexOf, strict >begin+17) — fails CLOSED:
 *          missing/misordered markers write NOTHING, with the flow's
 *          Terminate_no_draft message.
 *   G10–11 banner (HTML comment + [!WARNING] + truncation flag, plus
 *          a local provenance/provider stamp) and the timestamped
 *          draft in Shared Documents/Test Plan Drafts — via Graph
 *          drive upload (the curation-digest write), never
 *          overwritten, outside the Q&A agent's knowledge source.
 *   G13    Gen_summary counters, extended with `verify=`.
 *
 * Beyond the flow (the plan's phase-1 verifier): before the draft is
 * written, lib/draftlint.mjs checks it against the v1.7 coverage
 * contract (unchanged by prompt v1.8, which adds no structural
 * asserts). testplangen.verify: "annotate" (default) prepends an
 * [!IMPORTANT] findings block so the §4 reviewer starts where the
 * machine already found smells; "strict" refuses to write a draft
 * with findings (for unattended runs); "off" for parity-with-cloud
 * comparison. The verifier never edits draft content — annotate or
 * refuse, whole-draft.
 *
 * Read-only over every list; the ONLY write is the draft file (plus
 * the workDir run log, and a local draft copy on dry runs). Re-running
 * is always safe; re-runs stack timestamped drafts by design (§4
 * housekeeping deletes them after finalize).
 *
 * Config: reuses config.json — sharePoint.{hostname,sitePath,
 * lists.docIndex}, paths.sidecarLibrary, graph.*, llm.* (+ the new
 * llm.testPlanModelId for the aibuilder provider), optional
 * testplangen.{...} knobs mirroring the flow's Config_gen (see
 * config.sample.json / Local_Setup.md §10).
 *
 * Usage:
 *   node --experimental-strip-types local/testplangen.mjs --config local/config.json --story <docId> [--live|--dry-run] [--verify annotate|strict|off] [--notify]
 *   node --experimental-strip-types local/testplangen.mjs --config local/config.json --issue <n> ...
 *   node --experimental-strip-types local/testplangen.mjs --config local/config.json --title "<words>" ...
 *   node --experimental-strip-types local/testplangen.mjs --config local/config.json --auto [--force] [--live|--dry-run]
 *   node --experimental-strip-types local/testplangen.mjs --config local/config.json --models
 *     (lists the environment's AI Builder models — copy the
 *      "LRS Test Plan Generation" GUID into llm.testPlanModelId)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GraphClient } from "./graph.mjs";
import { aiBuilderPredict, dataverseToken, generateText, loadPromptTemplate } from "./llm.mjs";
import { assertNodeVersion, validateConfig, TESTPLANGEN_REQUIRED } from "./lib/config.mjs";
import { lower, cut, num, hyperlink, stripQuotes, urlToLocal, pruneRunLogs } from "./lib/util.mjs";
import { lintDraft, groundDraft } from "./lib/draftlint.mjs";
import { sendAlert } from "./lib/alerts.mjs";

const JOB_VERSION = "v1.2";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const GEN_PROMPT_FILE = path.resolve(HERE, "..", "prompts", "TestPlanGen_Prompt.md");

const DRAFT_BEGIN = "[[[DRAFT BEGIN]]]";
const DRAFT_END = "[[[DRAFT END]]]";
// the five item/requestv2 input keys, exact names (prompt header)
const INPUT_KEYS = ["StoryMeta", "StoryText", "RelatedDigest", "ExemplarText", "ReferenceText"];
const INPUTS_RE = new RegExp(`\\{(${INPUT_KEYS.join("|")})\\}`, "g");

// Terminate_not_story / Terminate_no_draft, verbatim from the flow
const GUARD_MSG =
  "TestPlanGen runs on Indexed User Story rows only. Select a row with " +
  "DocKind = User Story and IndexStatus = Indexed (it needs an extracted " +
  "sidecar to draft from).";
const NO_DRAFT_MSG =
  "Model reply was missing the DRAFT BEGIN/END markers (or they were " +
  "misordered); nothing was written. Re-run once; if it repeats, test the " +
  "prompt in the AI Builder pane — a TestPlanGenPromptVersion concern, see " +
  "testplangen/CHANGES.md.";

const VERIFY_MODES = ["annotate", "strict", "off"];

const USAGE =
  "usage: testplangen.mjs --config <config.json> " +
  "(--story <docId> | --issue <n> | --title \"<words>\" | --auto [--force]) " +
  "[--live|--dry-run] [--verify annotate|strict|off] [--notify] | --models\n" +
  "A bare number is always a Doc Index row id (--story); a devtopia " +
  "issue number needs --issue — nothing is ever guessed (the v2.3 rule). " +
  "--auto drafts for freshly indexed, uncovered stories (needs " +
  "testplangen.autoDraft: true; strict verification and notify are forced).";

function loadConfig(argv) {
  const args = { flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") args.config = argv[++i];
    else if (a === "--story") args.story = argv[++i];
    else if (a === "--issue") args.issue = argv[++i];
    else if (a === "--title") args.title = argv[++i];
    else if (a === "--live") args.flags.live = true;
    else if (a === "--dry-run") args.flags.dry = true;
    else if (a === "--models") args.flags.models = true;
    else if (a === "--notify") args.flags.notify = true;
    else if (a === "--auto") args.flags.auto = true;
    else if (a === "--force") args.flags.force = true;
    else if (a === "--verify") args.verify = argv[++i];
    else throw new Error(`unknown argument: ${a}\n${USAGE}`);
  }
  const refs = [args.story, args.issue, args.title].filter((v) => v !== undefined);
  const wantRefs = args.flags.models || args.flags.auto ? 0 : 1;
  if (!args.config || refs.length !== wantRefs) {
    throw new Error(USAGE);
  }
  assertNodeVersion();
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  const required = [...TESTPLANGEN_REQUIRED];
  if (args.issue !== undefined) required.push("sharePoint.lists.docIds");
  if (args.flags.auto) required.push("sharePoint.lists.docLinks");
  validateConfig(cfg, required, args.config);
  cfg.llm = cfg.llm || {};
  cfg.graph = cfg.graph || {};
  const authDir = path.join(cfg.paths?.workDir || ".", "auth");
  cfg.graph.tokenCache = cfg.graph.tokenCache || path.join(authDir, "graph.json");
  // aibuilder auth inherits Graph settings, exactly as sweep.mjs does —
  // delegated modes (device AND interactive, matching sweep.mjs) drop the
  // Graph clientId so Dataverse keeps its own public client
  const inherit = { ...cfg.graph };
  const inheritMode = inherit.auth || (inherit.clientSecret !== undefined ? "app" : "device");
  if (inheritMode === "device" || inheritMode === "interactive") delete inherit.clientId;
  delete inherit.baseUrl;
  cfg.llm.dataverse = {
    ...inherit,
    tokenCache: path.join(authDir, "dataverse.json"),
    ...(cfg.llm.dataverse || {}),
  };
  // Config_gen, name for name (TestPlanGen_Setup.md §3 G0) + the
  // local-job knobs (draftFolder is drive-root-relative — the site's
  // default drive root IS Shared Documents, the curation-digest rule)
  cfg.testplangen = {
    storyCap: 45000,
    exemplarCap: 20000,
    referenceCap: 12000,
    neighborCap: 5,
    digestSummaryCap: 400,
    exemplarSlots: 2,
    referenceSlots: 3,
    promptVersion: "v1.8",
    draftFolder: "/Test Plan Drafts",
    verify: "annotate",
    grounding: true,
    notify: false,
    provider: "", // "" = follow llm.provider; "aibuilder"|"anthropic" overrides for generation only
    maxTokens: 16384,
    autoDraft: false,
    autoMaxPerRun: 3,
    autoLookbackDays: 7,
    dryRun: true,
    ...(cfg.testplangen || {}),
  };
  if (args.flags.live) cfg.testplangen.dryRun = false;
  if (args.flags.dry) cfg.testplangen.dryRun = true;
  if (args.flags.notify) cfg.testplangen.notify = true;
  if (args.verify !== undefined) cfg.testplangen.verify = args.verify;
  if (!VERIFY_MODES.includes(cfg.testplangen.verify)) {
    throw new Error(
      `testplangen.verify "${cfg.testplangen.verify}" is not one of: ${VERIFY_MODES.join(" | ")}`
    );
  }
  // the sweep's URL-mapping context (urlToLocal reads siteUrl + textsFolder)
  cfg._sw = {
    siteUrl: cfg.sweep?.siteUrl || "https://esriis.sharepoint.com/sites/lrsworkspace",
    textsFolder: cfg.sweep?.textsFolder || "/LRS Doc Index",
  };
  cfg._models = !!args.flags.models;
  cfg._auto = !!args.flags.auto;
  cfg._force = !!args.flags.force;
  if (!cfg._models && !cfg._auto) {
    if (args.story !== undefined) {
      cfg._storyId = num(args.story);
      if (cfg._storyId === undefined) {
        throw new Error(`--story must be a Doc Index row id (got "${args.story}")\n${USAGE}`);
      }
    } else if (args.issue !== undefined) {
      const bare = String(args.issue).trim().replace(/^#/, "");
      if (!/^\d+$/.test(bare)) {
        throw new Error(`--issue must be a devtopia issue number (got "${args.issue}")\n${USAGE}`);
      }
      cfg._issue = Number(bare);
    } else {
      cfg._title = String(args.title).trim();
      if (cfg._title === "") throw new Error(`--title needs at least one word\n${USAGE}`);
    }
  }
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
  console.log('\nCopy the "LRS Test Plan Generation" GUID into config llm.testPlanModelId');
}

// the sweep's docIndex row normalization, reduced to this job's reads
function normalizeRow(it) {
  const f = it.fields || {};
  return {
    ID: num(it.id) ?? num(f.id),
    Title: f.Title || "",
    FileName: f.FileName || "",
    IndexStatus: f.IndexStatus || "",
    // the list item's creation time = when the sweep first minted the
    // row = "first indexed" (the auto mode's lookback anchor)
    Created: it.createdDateTime || f.Created || "",
    SourceModified: f.SourceModified || "",
    TextFileUrl: hyperlink(f.TextFileUrl),
    DocKind: f.DocKind || "",
    Surface: f.Surface || "",
    TargetRelease: f.TargetRelease || "",
    PE: f.PE || "",
    Dev: f.Dev || "",
    Summary: f.Summary || "",
  };
}

// G4 — related-line parse (line-sliced; the label `related: ` is 9
// characters). A missing or bracket-less line degrades to no
// neighbors; a bracketed but internally invalid line throws and
// fails the caller — the flow's accepted Catch residual (only
// out-of-band sidecar edits produce it).
function parseRelated(storyMd) {
  const relStart = storyMd.indexOf("related: [");
  let relLine = "[]";
  if (relStart > -1) {
    const tail = storyMd.slice(relStart + 9);
    const nl = tail.indexOf("\n");
    relLine = (nl > -1 ? tail.slice(0, nl) : tail).trim();
  }
  const relJsonSafe = relLine.startsWith("[") && relLine.endsWith("]") ? relLine : "[]";
  return JSON.parse(relJsonSafe);
}

async function run(cfg) {
  const graph = new GraphClient(cfg.graph);
  const siteId = await graph.siteId(cfg.sharePoint.hostname, cfg.sharePoint.sitePath);
  const tp = cfg.testplangen;
  const sw = cfg._sw;
  const dry = !!tp.dryRun;

  // run-start snapshot (the sweep pattern) — replaces the flow's
  // per-item Get calls; neighbors, the G6 fallback query, and the
  // auto mode's gap scan all read it, so the whole run is one fetch
  const rows = (
    await graph.listItems(siteId, cfg.sharePoint.lists.docIndex, {
      select: [
        "Title", "FileName", "IndexStatus", "SourceModified", "TextFileUrl",
        "DocKind", "Surface", "TargetRelease", "PE", "Dev", "Summary",
      ],
    })
  ).map(normalizeRow);
  const byId = new Map(rows.map((r) => [r.ID, r]));
  const ctx = { cfg, graph, siteId, rows, byId, sw, tp, dry, plan: [] };

  if (cfg._auto) return runAuto(ctx);

  // ---- lookup front door (v1.1) — StoryLookupFlow's deterministic
  // queries, in-process; ambiguity and misses go back to the human,
  // generation is NOT invoked (testplangen/CHANGES.md v2.3)
  const isStoryRow = (r) => r && r.DocKind === "User Story" && r.IndexStatus === "Indexed";
  const resolveOne = (candidates, refText, coaching) => {
    if (candidates.length === 1) {
      process.stdout.write(
        `resolved ${refText} -> doc ${candidates[0].ID} — "${candidates[0].Title}"\n`
      );
      return candidates[0].ID;
    }
    if (candidates.length === 0) throw new Error(`no indexed User Story matches ${refText} — ${coaching}`);
    const listed = candidates.slice(0, 8).map(
      (r) =>
        `- doc ${r.ID} — "${r.Title}" (surface ${r.Surface || ""}, release ${r.TargetRelease || ""})`
    );
    throw new Error(
      `${candidates.length} indexed User Stories match ${refText}:\n` +
      listed.join("\n") +
      (candidates.length > 8 ? `\n…and ${candidates.length - 8} more — narrow the reference` : "") +
      "\nRe-run with --story <docId>."
    );
  };
  if (cfg._issue !== undefined) {
    // issue lane: Doc IDs rows minted by the sweep's RegexExtract —
    // filter in memory (no user value in OData), dedup by document
    const idRows = await graph.listItems(siteId, cfg.sharePoint.lists.docIds, {
      select: ["IssueNumber", "DocumentLookupId"],
    });
    const docIds = new Set();
    for (const it of idRows) {
      const f = it.fields || {};
      if (num(f.IssueNumber) !== cfg._issue) continue;
      const docId = num(f.DocumentLookupId) ?? num(f.DocumentId);
      if (docId !== undefined) docIds.add(docId);
    }
    cfg._storyId = resolveOne(
      [...docIds].map((id) => byId.get(id)).filter(isStoryRow),
      `issue #${cfg._issue}`,
      "the story's sidecar must already carry the devtopia reference " +
      "(Doc IDs rows are minted at sweep time), and the story must be " +
      "an Indexed User Story row"
    );
  } else if (cfg._title !== undefined) {
    // title lane: contains-match over indexed User Story titles,
    // newest first so the candidate list leads with the likely one
    const q = lower(cfg._title);
    cfg._storyId = resolveOne(
      rows
        .filter((r) => isStoryRow(r) && lower(r.Title).includes(q))
        .sort((a, b) => String(b.SourceModified).localeCompare(String(a.SourceModified))),
      `title "${cfg._title}"`,
      "narrow the words, or use the Doc Index row id (--story)"
    );
  }

  // G1–G2 — story row + guard
  const story = byId.get(cfg._storyId);
  if (
    !story ||
    story.DocKind !== "User Story" ||
    story.IndexStatus !== "Indexed" ||
    !story.TextFileUrl
  ) {
    const state = story
      ? `row ${cfg._storyId}: DocKind=${story.DocKind || "(empty)"}, ` +
        `IndexStatus=${story.IndexStatus || "(empty)"}` +
        (story.TextFileUrl ? "" : ", no sidecar url")
      : `no Doc Index row with ID ${cfg._storyId}`;
    throw new Error(`${GUARD_MSG} (${state})`);
  }

  const res = await generateOne(ctx, story);

  // run log + stdout, the curate.mjs mold
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  // second resolution (not curate's minute cut): two on-demand runs
  // in one minute are normal here and must not overwrite each other's
  // log or dry-run draft copy
  const logStamp = new Date().toISOString().replaceAll(":", "").slice(0, 17);
  const logFile = path.join(logDir, `testplangen-${logStamp}.json`);
  fs.writeFileSync(
    logFile,
    JSON.stringify(
      {
        line: res.line, dry_run: dry, draft: res.draftPath,
        localDraft: res.localDraft, plan: dry ? ctx.plan : undefined,
      },
      null,
      1
    )
  );
  pruneRunLogs(logDir, 10, "testplangen-");

  process.stdout.write(
    JSON.stringify({ line: res.line, dry_run: dry, draft: res.draftPath, logFile }) + "\n"
  );
  process.stdout.write(res.line + "\n");
  if (dry) {
    process.stdout.write(
      `dry run: nothing uploaded — the draft is at ${res.localDraft} ` +
      `(would land as ${res.draftPath})\n`
    );
  }
}

// One story, G3–G13 + verifier + notify. The auto mode calls this per
// gap story; the single-story path calls it once. The only writes are
// the draft (live) or its workDir copy (dry).
async function generateOne(ctx, story) {
  const { cfg, graph, siteId, rows, byId, sw, tp, dry, plan } = ctx;

  // G3 — story sidecar from the synced library
  const storyUrl = story.TextFileUrl;
  const storyLocal = urlToLocal(storyUrl, sw, cfg);
  if (!storyLocal || !fs.existsSync(storyLocal)) {
    throw new Error(
      `story sidecar not found locally: ${storyUrl} -> ` +
      `${storyLocal ?? "(outside the sidecar library mapping)"} — ` +
      "is the OneDrive sync current, and sweep.siteUrl/textsFolder correct?"
    );
  }
  const storyMd = fs.readFileSync(storyLocal, "utf8");

  // G4 — score-ordered related entries, capped (parseRelated above)
  const relEntries = parseRelated(storyMd).slice(0, Number(tp.neighborCap));

  // G5 — lanes over the score-ordered entries (concurrency 1)
  let digest = "";
  let exemplarText = "";
  let referenceText = "";
  const exemplarUrls = [];
  const referenceRefs = [];
  let exemplarCount = 0;
  let referenceCount = 0;
  for (const entry of relEntries) {
    const nb = byId.get(num(entry?.doc));
    if (!nb) continue; // Try_neighbor: a recycled/broken neighbor degrades silently
    const summary = cut(
      String(nb.Summary || "").replaceAll('"', "").replaceAll("\n", " "),
      Number(tp.digestSummaryCap)
    );
    digest +=
      `- [${nb.DocKind || "Other"}] "${nb.Title}" — surface ${nb.Surface || ""}, ` +
      `release ${nb.TargetRelease || ""}, PE ${nb.PE || ""}: ${summary}\n`;
    const kind = nb.DocKind || "";
    if ((kind === "Test Plan" || kind === "Design Spike") && nb.TextFileUrl) {
      // G5b — two-lane router (v2.2): same-surface Test Plans win the
      // exemplar slots (score-ordered arrival = the best plans);
      // overflow, cross-surface plans, and Design Spikes on any
      // surface land as REFERENCE FUNCTIONALITY
      if (
        kind === "Test Plan" &&
        (nb.Surface || "") === (story.Surface || "") &&
        exemplarUrls.length < Number(tp.exemplarSlots)
      ) {
        exemplarUrls.push(nb.TextFileUrl);
      } else if (referenceRefs.length < Number(tp.referenceSlots)) {
        referenceRefs.push({
          url: nb.TextFileUrl,
          surface: nb.Surface || "",
          title: stripQuotes(nb.Title),
        });
      }
    }
  }

  // G6 — exemplar fallback (deterministic, from the snapshot; the
  // reference lane deliberately has NO fallback — grounding only ever
  // comes from documents RelatedRank linked to this story)
  if (exemplarUrls.length === 0) {
    const surface = story.Surface || "Other";
    const cand = rows
      .filter(
        (r) =>
          r.DocKind === "Test Plan" &&
          r.IndexStatus === "Indexed" &&
          (r.Surface || "") === surface
      )
      .sort((a, b) => String(b.SourceModified).localeCompare(String(a.SourceModified)))
      .slice(0, 12);
    // release preference only when the story HAS a release (DX-7)
    const matched = story.TargetRelease
      ? cand.filter((r) => (r.TargetRelease || "") === story.TargetRelease)
      : [];
    const chosen = (matched.length > 0 ? matched : cand).slice(0, Number(tp.exemplarSlots));
    for (const r of chosen) exemplarUrls.push(r.TextFileUrl || "");
  }

  // G7 — exemplar bodies (remaining-budget take, the v2.13 semantics)
  for (const url of exemplarUrls) {
    const local = urlToLocal(url, sw, cfg);
    if (!local || !fs.existsSync(local)) continue; // Try_exemplar degrades silently
    if (exemplarText.length >= Number(tp.exemplarCap)) continue; // If_ex_budget
    const remaining = Number(tp.exemplarCap) - exemplarText.length; // Ex_remaining
    const content = fs.readFileSync(local, "utf8");
    exemplarText += `--- EXEMPLAR: ${path.basename(local)} ---\n${cut(content, remaining)}\n\n`;
    exemplarCount++;
  }

  // G7b — reference bodies (header carries title AND surface — the
  // prompt's surface-parity rule keys on it)
  for (const ref of referenceRefs) {
    const local = urlToLocal(ref.url, sw, cfg);
    if (!local || !fs.existsSync(local)) continue; // Try_reference degrades silently
    if (referenceText.length >= Number(tp.referenceCap)) continue; // If_ref_budget
    const remaining = Number(tp.referenceCap) - referenceText.length; // Ref_remaining
    const content = fs.readFileSync(local, "utf8");
    referenceText +=
      `--- REFERENCE: ${ref.title || path.basename(local)} — surface ${ref.surface} ---\n` +
      `${cut(content, remaining)}\n\n`;
    referenceCount++;
  }

  // G8 — the prompt call (values verbatim from the row, the
  // semi-trusted lane: quotes stripped where a value lands mid-line)
  const storyMeta = [
    `title: ${stripQuotes(story.Title)}`,
    `surface: ${story.Surface || "Other"}`,
    `target_release: ${story.TargetRelease || ""}`,
    `pe: ${stripQuotes(story.PE)}`,
    `dev: ${stripQuotes(story.Dev)}`,
    `doc_id: ${story.ID}`,
  ].join("\n");
  const storyTextCapped = cut(storyMd, Number(tp.storyCap));
  const inputs = {
    StoryMeta: storyMeta,
    StoryText: storyTextCapped,
    RelatedDigest: digest === "" ? "(none)" : digest,
    ExemplarText: exemplarText === "" ? "(none)" : exemplarText,
    ReferenceText: referenceText === "" ? "(none)" : referenceText,
  };

  // testplangen.provider overrides llm.provider for the generation
  // call ONLY (v1.2) — so generation can run on the anthropic lane
  // while the sweep's classify step stays on AI Builder, or vice versa
  const provider =
    tp.provider || cfg.llm.provider || (cfg.llm.environmentUrl ? "aibuilder" : "anthropic");
  let genRaw;
  if (provider === "aibuilder") {
    if (!cfg.llm.testPlanModelId) {
      throw new Error(
        "llm.testPlanModelId is not set — run with --models to find the " +
        "LRS Test Plan Generation model GUID (the tenant prompt must carry " +
        "all FIVE input parameters and the current text — Coverage_Runbook.md " +
        "step 2; provider \"anthropic\" needs no tenant prompt at all)"
      );
    }
    const response = await aiBuilderPredict(cfg.llm, inputs, cfg.llm.testPlanModelId);
    genRaw = response?.responsev2?.predictionOutput?.text ?? "";
  } else if (provider === "anthropic") {
    const template = loadPromptTemplate(GEN_PROMPT_FILE);
    // single-pass substitution: a placeholder-shaped string inside
    // document content stays literal — it can never trigger a second
    // substitution
    const prompt = template.replace(INPUTS_RE, (m, key) => inputs[key]);
    genRaw = await generateText({ ...cfg.llm, maxTokens: Number(tp.maxTokens) }, prompt);
  } else {
    throw new Error(`unknown llm.provider "${provider}" (aibuilder | anthropic)`);
  }

  // G9 — marker slice, fail closed (lastIndexOf so an echoed marker
  // inside the body cannot truncate it; strict > begin+17)
  const begin = genRaw.indexOf(DRAFT_BEGIN);
  const end = genRaw.lastIndexOf(DRAFT_END);
  const draftBody =
    begin > -1 && end > begin + DRAFT_BEGIN.length
      ? genRaw.slice(begin + DRAFT_BEGIN.length, end).trim()
      : "";
  if (draftBody === "") throw new Error(NO_DRAFT_MSG);

  // the verifier — contract lint (phase 1) + grounding spot-checks
  // (phase 2, "grounding: "-prefixed heuristics; testplangen.grounding
  // false disables just that layer) — annotate or refuse, whole-draft;
  // never edits draft content
  let findings = [];
  let verify = "off";
  if (tp.verify !== "off") {
    findings = lintDraft(draftBody).failures;
    if (tp.grounding !== false) {
      findings.push(...groundDraft(draftBody, `${storyTextCapped}\n${storyMeta}`));
    }
    verify = findings.length ? `${findings.length}-findings` : "ok";
    if (tp.verify === "strict" && findings.length) {
      for (const f of findings) process.stderr.write(`verifier: ${f}\n`);
      const err = new Error(
        `draft verifier (strict): ${findings.length} finding(s) — ` +
        "nothing was written. Findings are listed above; re-run, or use " +
        "--verify annotate to write the draft with the findings flagged " +
        "for the §4 review."
      );
      err.verifierFindings = findings; // runAuto reads these for its alert
      throw err;
    }
  }
  let verifyBlock = "";
  if (tp.verify === "annotate" && findings.length) {
    const listed = findings.slice(0, 20);
    verifyBlock =
      `<!-- verify: ${findings.length} finding(s) — lib/draftlint.mjs, prompt ${tp.promptVersion} contract + grounding -->\n` +
      "> [!IMPORTANT]\n" +
      `> Draft verifier: ${findings.length} finding(s) — review these first:\n` +
      listed.map((f) => `> - ${f}`).join("\n") +
      (findings.length > listed.length ? `\n> - … ${findings.length - listed.length} more` : "") +
      "\n\n";
  }

  // G10 — banner (the flow's Draft_banner, plus the local
  // provenance/provider stamp in the HTML comment)
  const truncFlag =
    storyMd.length > Number(tp.storyCap) ? " [story text truncated at StoryCap]" : "";
  const banner =
    `<!-- machine-generated test-plan draft — TestPlanGen prompt ${tp.promptVersion}` +
    ` · local/testplangen.mjs ${JOB_VERSION} · provider ${provider} -->\n` +
    "> [!WARNING]\n" +
    `> **DRAFT — machine-generated, unreviewed.** Generated ${new Date().toISOString()} ` +
    `from user story doc ${story.ID} — "${stripQuotes(story.Title)}". ` +
    `Source sidecar: <${storyUrl}>${truncFlag}\n` +
    "> Review every case and resolve all [VERIFY] items before use. Do NOT " +
    "upload this file to the LocationReferencing Documents library or the " +
    "LRS Doc Index library — finalize into the team test-plan format first " +
    "(TestPlanGen_Setup.md §4).\n\n";
  const draft = banner + verifyBlock + draftBody + "\n";

  // G11 — timestamped save, never overwritten (drafts are work
  // products a PE may be mid-edit on; stale ones are deleted by hand)
  const now = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const stamp =
    `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}` +
    `-${p(now.getUTCHours())}${p(now.getUTCMinutes())}${p(now.getUTCSeconds())}`;
  const draftName = `TestPlanDraft__doc${story.ID}__${stamp}.md`;
  const draftPath = `${tp.draftFolder}/${draftName}`;
  plan.push({ action: "putFile", path: draftPath, bytes: draft.length });
  let putRes = null;
  if (!dry) putRes = await graph.putFile(siteId, draftPath, draft);

  // G13 — Gen_summary (+ verify=), run log in the curate.mjs mold
  const line =
    `story=${story.ID} neighbors=${relEntries.length} exemplars=${exemplarCount} ` +
    `references=${referenceCount} digestChars=${digest.length} ` +
    `storyChars=${storyTextCapped.length} draftChars=${draftBody.length} ` +
    `exChars=${exemplarText.length} refChars=${referenceText.length} verify=${verify}`;

  // opt-in notification (v1.1) — one webhook line per WRITTEN draft;
  // best-effort by alerts.mjs design, a down webhook never fails a run
  if (!dry && tp.notify) {
    const webUrl =
      putRes?.webUrl ||
      `${sw.siteUrl}/Shared Documents${tp.draftFolder}/${encodeURIComponent(draftName)}`;
    const delivered = await sendAlert(
      cfg,
      "TestPlanGen: draft ready for review",
      `Story ${story.ID} — "${stripQuotes(story.Title)}"\n${webUrl}\n${line}`
    );
    if (!delivered && !cfg.alerts?.webhookUrl) {
      process.stderr.write(
        "notify requested but alerts.webhookUrl is not configured — no notification sent\n"
      );
    }
  }

  let localDraft;
  if (dry) {
    // the would-be draft, locally inspectable (and lintable with
    // review/harness/check_draft_coverage.py) before any live run
    const logDir = cfg.paths?.workDir || ".";
    fs.mkdirSync(logDir, { recursive: true });
    localDraft = path.join(
      logDir,
      `testplangen-draft-${new Date().toISOString().replaceAll(":", "").slice(0, 17)}.md`
    );
    fs.writeFileSync(localDraft, draft);
  }
  return { line, draftPath, draftName, localDraft, verify, findings };
}

/**
 * --auto (v1.2, phase 3): unattended gap-drafting after the nightly
 * sweep. Gated on testplangen.autoDraft (the owner switch — a
 * scheduled task always passes --auto; the config decides whether it
 * does anything). Candidates: Indexed User Story rows first indexed
 * within autoLookbackDays (the row's created time; SourceModified is
 * the fallback). A story is a GAP when nothing in the catalog covers
 * it: no Test Plan among its sidecar's `related:` entries AND no Doc
 * Links edge to a Test Plan row. Idempotency: a story with ANY
 * existing `TestPlanDraft__doc{ID}__*` file in the drafts folder is
 * skipped — a PE deleting the draft (the §4 housekeeping step) is
 * what re-arms auto-drafting; --force disables the skip for one run.
 * autoMaxPerRun caps model calls per run; refused/failed stories are
 * retried on later runs under the same cap. Unattended posture is
 * forced: verify=strict (a draft with findings is NOT written — the
 * findings go to the run log and the webhook) and notify=on. A DRY
 * auto run is selection-only: it reports what would draft and makes
 * ZERO model calls (deliberately unlike single-story dry runs, which
 * generate a local draft to read — an unattended plan must be free).
 */
async function runAuto(ctx) {
  const { cfg, graph, siteId, rows, byId, sw } = ctx;
  if (!cfg.testplangen.autoDraft) {
    throw new Error(
      "--auto requires testplangen.autoDraft: true in config — the owner " +
      "switch for unattended drafting (Local_Setup.md §11)"
    );
  }
  const tp = { ...cfg.testplangen, verify: "strict", notify: true };
  const lookbackDays = Number(tp.autoLookbackDays) || 7;
  const maxPerRun = Number(tp.autoMaxPerRun) || 3;
  const dry = !!tp.dryRun;
  const actx = { ...ctx, tp, dry };

  const isPlanId = (id) => byId.get(id)?.DocKind === "Test Plan";

  // gap test (b): stories already edge-linked to a Test Plan
  const linkRows = await graph.listItems(siteId, cfg.sharePoint.lists.docLinks, {
    select: ["DocALookupId", "DocBLookupId"],
  });
  const linkedToPlan = new Set();
  for (const it of linkRows) {
    const f = it.fields || {};
    const a = num(f.DocALookupId) ?? num(f.DocAId);
    const b = num(f.DocBLookupId) ?? num(f.DocBId);
    if (a === undefined || b === undefined) continue;
    if (isPlanId(b)) linkedToPlan.add(a);
    if (isPlanId(a)) linkedToPlan.add(b);
  }

  // idempotency: existing auto/manual drafts, one listing per run
  const existing = new Set();
  for (const child of await graph.listFolder(siteId, tp.draftFolder)) {
    const m = /^TestPlanDraft__doc(\d+)__/.exec(String(child.name || ""));
    if (m) existing.add(Number(m[1]));
  }

  const cutoff = Date.now() - lookbackDays * 86400000;
  const firstIndexed = (r) => Date.parse(r.Created || r.SourceModified || "") || 0;
  const candidates = rows
    .filter(
      (r) =>
        r.DocKind === "User Story" && r.IndexStatus === "Indexed" &&
        r.TextFileUrl && firstIndexed(r) >= cutoff
    )
    .sort((a, b) => firstIndexed(b) - firstIndexed(a)); // freshest first

  const sum = {
    candidates: candidates.length, covered: 0, no_sidecar: 0,
    skipped_existing: 0, gaps: 0, selected: 0, drafted: 0, refused: 0,
    errors: 0, deferred: 0,
  };
  const detail = [];
  const gapStories = [];
  for (const story of candidates) {
    if (!cfg._force && existing.has(story.ID)) {
      sum.skipped_existing++;
      detail.push({ story: story.ID, title: story.Title, action: "skipped-existing-draft" });
      continue;
    }
    const local = urlToLocal(story.TextFileUrl, sw, cfg);
    if (!local || !fs.existsSync(local)) {
      sum.no_sidecar++;
      detail.push({ story: story.ID, title: story.Title, action: "no-sidecar" });
      continue;
    }
    let covered = linkedToPlan.has(story.ID);
    if (!covered) {
      try {
        covered = parseRelated(fs.readFileSync(local, "utf8")).some((e) => isPlanId(num(e?.doc)));
      } catch {
        // a hand-mangled related: line — not assessable, never spend on it
        sum.no_sidecar++;
        detail.push({ story: story.ID, title: story.Title, action: "unparseable-related" });
        continue;
      }
    }
    if (covered) {
      sum.covered++;
      detail.push({ story: story.ID, title: story.Title, action: "covered" });
      continue;
    }
    gapStories.push(story);
  }
  sum.gaps = gapStories.length;
  const selected = gapStories.slice(0, maxPerRun);
  sum.selected = selected.length;
  sum.deferred = gapStories.length - selected.length;

  for (const story of selected) {
    const label = `story ${story.ID} "${story.Title}"`;
    if (dry) {
      detail.push({ story: story.ID, title: story.Title, action: "would-draft" });
      process.stdout.write(`auto: ${label} — would draft (dry run, no model call)\n`);
      continue;
    }
    try {
      const res = await generateOne(actx, story);
      sum.drafted++;
      detail.push({
        story: story.ID, title: story.Title, action: "drafted",
        draft: res.draftPath, line: res.line,
      });
      process.stdout.write(`auto: ${label} — drafted ${res.draftName}\n`);
    } catch (e) {
      if (Array.isArray(e.verifierFindings)) {
        sum.refused++;
        detail.push({
          story: story.ID, title: story.Title, action: "refused",
          findings: e.verifierFindings,
        });
        process.stdout.write(
          `auto: ${label} — REFUSED by the verifier (${e.verifierFindings.length} findings)\n`
        );
        await sendAlert(
          cfg,
          "TestPlanGen auto: draft refused by the verifier",
          `${label}\n` +
          e.verifierFindings.slice(0, 10).map((f) => `- ${f}`).join("\n") +
          "\nNo draft was written; the next auto run retries under the nightly budget."
        );
      } else {
        // one failed story never kills the run — count, alert, continue
        sum.errors++;
        detail.push({
          story: story.ID, title: story.Title, action: "error",
          error: String(e.message || e).slice(0, 500),
        });
        process.stderr.write(`auto: ${label} — FAILED: ${e.message}\n`);
        await sendAlert(
          cfg,
          "TestPlanGen auto: generation failed",
          `${label}\n${String(e.message || e).slice(0, 1000)}`
        );
      }
    }
  }

  const line =
    `mode=auto lookbackDays=${lookbackDays} candidates=${sum.candidates} ` +
    `covered=${sum.covered} no_sidecar=${sum.no_sidecar} ` +
    `skipped_existing=${sum.skipped_existing} gaps=${sum.gaps} ` +
    `selected=${sum.selected} drafted=${sum.drafted} refused=${sum.refused} ` +
    `errors=${sum.errors} deferred=${sum.deferred}`;
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  const logStamp = new Date().toISOString().replaceAll(":", "").slice(0, 17);
  const logFile = path.join(logDir, `testplangen-${logStamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ line, dry_run: dry, detail }, null, 1));
  pruneRunLogs(logDir, 10, "testplangen-");
  process.stdout.write(JSON.stringify({ line, dry_run: dry, logFile }) + "\n");
  process.stdout.write(line + "\n");
  if (dry) {
    process.stdout.write(
      `dry run: selection only — ${sum.selected} would draft, no model calls made\n`
    );
  }
  // partial failures surface in the exit code for the task log, after
  // every candidate got its chance
  if (sum.errors > 0) process.exitCode = 1;
}

async function main() {
  const cfg = loadConfig(process.argv.slice(2));
  if (cfg._models) return listModels(cfg);
  return run(cfg);
}

main().catch((e) => {
  process.stderr.write("testplangen: " + (e.stack || e.message) + "\n");
  process.exit(1);
});
