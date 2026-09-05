#!/usr/bin/env node
/**
 * testplangen.mjs v1.10 — the TestPlanGenCore cloud flow (v2.3) as a
 * local on-demand job: draft a test plan from one indexed User Story
 * row, grounded strictly in that story with the catalog's related
 * documentation as reference. Phases 1–4 of
 * `testplangen/Local_TestPlanGen_Plan.md` (component record:
 * `testplangen/CHANGES.md` v2.16 / v2.17 / v2.18 / v2.19; pinned
 * lanes: v2.22; figures: v2.26; web references: v2.28; case-level
 * gap tracing: v2.29; case-aware generation: v2.30; first-run
 * review: v2.31).
 *
 * v1.10 (first-run review — testplangen/CHANGES.md v2.31):
 *   - `--preview`: a ZERO-SPEND single-story run — the guard, the
 *     lookup, the pins, every lane, and the provider resolution run
 *     exactly as for a generation, then the five prompt inputs are
 *     written to workDir (`testplangen-preview-<stamp>.md`) and the
 *     job stops BEFORE the model call. The summary line carries the
 *     lane counters plus `inputChars= provider= preview=1`. Meant for
 *     the first run on a machine (auth, config, sidecar mapping,
 *     related routing, and the transport are all proven without a
 *     credit spent) and for tuning caps/pins on a story before
 *     drafting. Manual runs only.
 *   - `--help` / `-h` prints the usage and exits 0 (an unknown flag
 *     still refuses with exit 1).
 *   - remote-files mode: with `sweep.remoteFiles: true` (the sweep's
 *     v1.39 no-OneDrive mode, local/Hosted_Runner.md) the sidecar
 *     library mirrors down into `paths.sidecarLibrary` at run start
 *     through the same RemoteLibrary the sweep uses (eTag manifest
 *     shared, so a run after the nightly sweep downloads nothing) —
 *     the design record's "(or Graph under sweep.remoteFiles)" G3
 *     clause, which had never been built: the job used to refuse
 *     with "sidecar not found locally" on any machine without the
 *     OneDrive sync. Lists stay read-only; the mirror writes only
 *     the workspace, which in that mode is by definition a mirror.
 *   - caseAwareTake held its budget only when the plan's HEAD fit
 *     under it: a head larger than budget-minus-footer was cut to
 *     the full budget and the omission footer still appended, so
 *     the lane overran ExemplarCap by up to the footer's length
 *     (the v2.13 invariant the caps leg pins). The head is now cut
 *     to leave the footer's room, the reserve covers the footer's
 *     widest digit form, and a final guard cuts any residue.
 *   - draft names carry SECONDS (`--draft-yyyymmdd-hhmmss.md`): the
 *     v2.30 minute stamp let two runs on one story inside a minute
 *     overwrite each other through the drive PUT — against the G11
 *     "never overwritten" rule (the run log already used seconds
 *     for exactly that reason). The auto-mode scan accepted both
 *     widths already.
 *   - the auto-mode stem→id map now covers User Story rows only, so
 *     a Test Plan sharing a story's sidecar stem can no longer mark
 *     the story as already drafted.
 *   - `--issue` resolves through the run's shared Doc IDs fetch
 *     (issueRowsOf) instead of a second listing of the same list.
 *
 * v1.9 (case-aware generation — the Case_Index_Plan "queued" items,
 * decided and built): with the sweep's Test Cases list configured
 * (`sharePoint.lists.testCases`) and `testplangen.caseIndex` on (the
 * default), the per-case index the sweep already maintains feeds the
 * generation itself, three ways — all deterministic, read-only, zero
 * extra AI spend, no prompt text change (the lanes carry the same
 * block shapes; only WHICH text fills them changes):
 *   - G5c case-traced routing: plans whose indexed cases cite one of
 *     the story's own devtopia issue ids (Doc IDs ∩ IssueRefs) fill
 *     the slots the related routing left open — same-surface plans
 *     as exemplars, others as reference functionality — before the
 *     G6 fallback, which now runs only when nothing at all was found.
 *     A case stating the story's issue id is a link the sweep minted
 *     from the plan's own text, not a similarity guess, so it is not
 *     the machine-chosen fallback the reference lane bans.
 *   - G7 case-aware trimming: an exemplar body that overflows its
 *     remaining ExemplarCap budget is cut WHOLE CASES at a time (the
 *     plan's head kept, the cases most relevant to the story kept in
 *     document order, a closing line stating how many were omitted)
 *     instead of the blind character cut that used to end mid-case.
 *     Relevance: a case citing a story issue id first, then shared
 *     Tools tags, then shared Keywords tags (the case row's curated
 *     tags joined by CaseKey ordinal; the story's from its sidecar
 *     metadata table), ties in document order. A plan with no
 *     recognizable cases takes the blind cut it always did.
 *   - the `## Existing Test Cases` addendum: after verification (the
 *     Issue Trace precedent — machine-minted, never judged by the
 *     verifier), a table of every indexed case across the catalog
 *     that already cites the story's issues, each deep-linking its
 *     sidecar section, so the reviewer can dedupe and cross-check.
 *   Provenance: Gen_summary gains `existingCases= caseRouted=
 *   caseTrim= exCases=kept/total`; the banner comment carries the
 *   case-routed ids; manual runs print a `cases —` progress line.
 *   The list absent (or caseIndex false) = the lanes, the draft, and
 *   the G6 fallback are exactly what they were.
 *
 * v1.8 (case-level gap tracing — Case_Index_Plan phase 3): with the
 * sweep's Test Cases list configured (`sharePoint.lists.testCases`),
 * `--gap-report` reads it (read-only, like every list here) and adds
 * the truth adjacency cannot see: per covered story, whether ANY
 * indexed test case cites its issue ids (`IssueRefs` ∩ the story's
 * Doc IDs keys). The report head gains `caseRows= traced=
 * coveredUntraced=`, a "Case-level tracing" section lists covered
 * stories whose issues NO case cites (naming each covering plan and
 * its case count), and a gap story whose issues some case already
 * cites is flagged as case-level coverage without a doc link. The
 * list absent = the report is exactly what it always was.
 *
 * v1.7 (web references — hyperlinks as pinned references): the
 * `--reference` pin also takes an http(s) URL — official product
 * documentation (e.g. an ArcGIS Pro tool-reference page) pinned into
 * the REFERENCE FUNCTIONALITY lane beside the catalog's own
 * documents. The page is fetched up front under the pin posture's
 * hard-guard rule (a fetch failure, a non-text reply, or a page with
 * no readable text refuses BEFORE the model call — a human asked for
 * this exact page, so silent degrade is wrong), reduced to plain
 * text by a zero-dependency tag strip (scripts/styles/nav dropped,
 * headings and list markers kept, entities decoded), and injected
 * with a `--- REFERENCE: <page title> — surface web documentation
 * <url> ---` header so the prompt's existing reference rules apply
 * unchanged: behavior may ground on it with the Trace citing the
 * page by title, the surface-parity [VERIFY] fires naturally (the
 * header's surface is never the story's), and tool names still never
 * carry over. The prompt text itself is UNCHANGED (still v1.10) —
 * a documentation page is exactly a "document describing the
 * expected behavior of this story's feature area", so no
 * TestPlanGenPromptVersion bump. Web pages are the lane's only
 * public-internet input, so beyond the tag strip the text is
 * defanged: block/draft marker shapes (<<< >>> [[[ ]]]) are replaced
 * with lookalikes a hostile page cannot use to close a prompt block
 * or forge the G9 draft markers. Provenance: the banner comment
 * carries the pinned URLs, `Gen_summary` gains `webRefs=`, and the
 * written draft ends with a deterministic `## Reference
 * Documentation` addendum (the Issue Trace precedent — machine-
 * minted after verification) linking each pinned page so the
 * reviewer can open what grounded the draft. `--exemplar` still
 * takes row ids only — a web page is never a style/coverage
 * exemplar. Manual runs only, like every pin.
 *
 * v1.6 (figures in cases — prompt v1.10's FIGURES rule, the local
 * half): a draft case may close with a `**Figure:**` line carrying a
 * story figure's image link copied VERBATIM from the sidecar. Two
 * job-side pieces:
 *   - the verifier's grounding layer gains check e (draftlint.mjs
 *     v1.3): every markdown image link in the draft must appear in
 *     the story sidecar verbatim — the never-invent rule extended to
 *     figure paths; an invented or exemplar-sourced link is a
 *     "grounding: figure link ..." finding under the normal verify
 *     policy.
 *   - AFTER verification (the banner/Issue Trace precedent — the
 *     verifier judges the model's links exactly as copied), cited
 *     sidecar-relative links (../media/...) are rewritten to
 *     absolute site URLs: drafts land in Shared Documents/Test Plan
 *     Drafts, a different folder tree from the sidecar library, so
 *     the relative form resolves nowhere there. Deterministic,
 *     model-free; Gen_summary gains `figures=` (links rewritten).
 *
 * v1.5 (progress output — with llm.mjs v1.5's retry visibility)
 * adds stderr `progress:` lines to MANUAL single-story runs only —
 * snapshot size, story sidecar size, lane sizes (pins included), a
 * "calling the model" line with input size, a 30s heartbeat while
 * the one model call is in flight, the reply size/elapsed, and the
 * verifier verdict. stdout keeps its JSON + Gen_summary contract
 * byte-for-byte; the auto and gap-report modes stay quiet so their
 * scheduled-task logs don't grow. Motivated by the 2026-09-04 run
 * that sat silent for 10+ minutes: a stale-token auth wait, a slow
 * generation, and a silent 408/429 retry loop were previously
 * indistinguishable.
 *
 * v1.4 (pinned lanes — the v2.20 queued follow-on) adds:
 *   - `--exemplar <docId>` / `--reference <docId>` (repeatable;
 *     comma-separated ids accepted) — the person running a MANUAL
 *     generation pins documents into the prompt's lanes IN ADDITION
 *     to the sidecar's `related:` selection, for the case where the
 *     best exemplar or reference is not RelatedRank-linked to the
 *     story. An explicit human choice is stronger grounding than the
 *     automatic linkage, so it fits the reference lane's no-fallback
 *     rationale (the fallback ban rules out MACHINE-chosen unlinked
 *     documents; these are human-chosen). Semantics:
 *     · a bare number is a Doc Index row id, nothing else (the v2.3
 *       rule — no issue/title resolution on pins);
 *     · guards are HARD (a human asked for these docs, so silent
 *       degrade is wrong): the row must exist, be Indexed with a
 *       sidecar present in the synced library, not be the story
 *       itself, not sit in both lanes; --exemplar takes Test Plans
 *       (any surface — a deliberate human override of the
 *       same-surface routing, style/coverage only under the
 *       prompt's exemplar rules), --reference takes Test Plans and
 *       Design Spikes; any violation refuses BEFORE the model call;
 *     · pinned docs fill their lane first, in the order given; the
 *       automatic `related:` routing fills remaining slots and
 *       skips docs already pinned; pins may exceed the slot counts
 *       (a human choice beats the slot default) — the character
 *       caps remain the hard budget, pins served first;
 *     · provenance: the banner's HTML comment carries the pinned
 *       ids, and Gen_summary gains `pinnedEx=`/`pinnedRef=`;
 *     · manual runs only — refused with `--auto` (the unattended
 *       mode must stay deterministic from catalog state alone).
 *
 * v1.3 (phase 4 — the IssueRefs-driven coverage piece, unlocked by
 * the owner-verified Issue Refs GUID) adds:
 *   - the `## Issue Trace` addendum: every generated draft ends with
 *     a DETERMINISTIC table of the story's devtopia issues — Doc IDs
 *     rows for the story, enriched with the matching Issue Refs rows
 *     (gantt.mjs's schedule feed: issue title, iteration, status) —
 *     minted by this job from list rows, never by the model, and
 *     appended AFTER verification so the verifier never judges
 *     machine-minted content. Omitted when the story has no issue
 *     rows; testplangen.issueTrace: false disables it. (The other
 *     half of the queued "docx handoff" phase-4 item is the
 *     standalone local/draft2docx.mjs converter.)
 *   - `--gap-report`: the whole-catalog counterpart of the auto
 *     mode's lookback scan — every Indexed User Story with no
 *     covering Test Plan (no related-list plan, no Doc Links edge),
 *     each with its issue numbers, written as a FIXED-NAME digest
 *     (`TestPlan_Gap_Report.md`, overwritten per run — the
 *     curation-digest snapshot rule, explicit empty state included)
 *     into the Shared Documents root, outside the Q&A agent's
 *     knowledge source. No AI spend; schedulable weekly beside
 *     curation.
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
 *     Result lines, enumeration echo; draftlint v1.2 adds the
 *     story-first Trace check, prompt v1.9). Runs under the same
 *     verify policy as the contract lint, findings prefixed
 *     "grounding: "; testplangen.grounding: false disables just
 *     this layer.
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
 *          work, the v1.9 rules apply as authored; single-pass
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
 * contract (unchanged by prompts v1.8/v1.9, which add no structural
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
 *   node --experimental-strip-types local/testplangen.mjs --config local/config.json --story <docId> [--exemplar <docId>]... [--reference <docId>]... [--live|--dry-run|--preview] [--verify annotate|strict|off] [--notify]
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
import { RemoteLibrary } from "./lib/remotefs.mjs";
import { aiBuilderPredict, dataverseToken, generateText, loadPromptTemplate } from "./llm.mjs";
import { assertNodeVersion, validateConfig, TESTPLANGEN_REQUIRED } from "./lib/config.mjs";
import { lower, cut, num, hyperlink, stripQuotes, urlToLocal, pruneRunLogs } from "./lib/util.mjs";
import { lintDraft, groundDraft } from "./lib/draftlint.mjs";
import { relEntries, metaList } from "./lib/sidecarmeta.mjs";
import { extractCases, caseSpans } from "./lib/caseindex.mjs";
import { stemOf } from "./lib/slug.mjs";
import { storyTextFirst } from "./lib/storyprofile.mjs";
import { sendAlert } from "./lib/alerts.mjs";

const JOB_VERSION = "v1.10";
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
  "(--story <docId> | --issue <n> | --title \"<words>\" | --auto [--force] | --gap-report) " +
  "[--exemplar <docId>]... [--reference <docId>|<https-url>]... " +
  "[--live|--dry-run|--preview] [--verify annotate|strict|off] [--notify] | --models | --help\n" +
  "--preview resolves the story and builds every lane, writes the five " +
  "prompt inputs to workDir, and stops BEFORE the model call (zero AI " +
  "spend — the first-run check; manual runs only). " +
  "A bare number is always a Doc Index row id (--story); a devtopia " +
  "issue number needs --issue — nothing is ever guessed (the v2.3 rule). " +
  "--exemplar/--reference pin documents into the prompt's lanes ahead of " +
  "the automatic related-document selection (repeatable; Doc Index row " +
  "ids — --reference also takes an http(s) URL to a documentation page; " +
  "manual runs only — not with --auto). " +
  "--auto drafts for freshly indexed, uncovered stories (needs " +
  "testplangen.autoDraft: true; strict verification and notify are forced). " +
  "--gap-report writes the whole-catalog uncovered-stories digest (no AI spend).";

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
    else if (a === "--preview") args.flags.preview = true;
    else if (a === "--help" || a === "-h") args.flags.help = true;
    else if (a === "--models") args.flags.models = true;
    else if (a === "--notify") args.flags.notify = true;
    else if (a === "--auto") args.flags.auto = true;
    else if (a === "--force") args.flags.force = true;
    else if (a === "--gap-report") args.flags.gapReport = true;
    else if (a === "--verify") args.verify = argv[++i];
    else if (a === "--exemplar") (args.exemplar ??= []).push(argv[++i]);
    else if (a === "--reference") (args.reference ??= []).push(argv[++i]);
    else throw new Error(`unknown argument: ${a}\n${USAGE}`);
  }
  if (args.flags.help) {
    process.stdout.write(USAGE + "\n");
    process.exit(0);
  }
  const refs = [args.story, args.issue, args.title].filter((v) => v !== undefined);
  const modeless = args.flags.models || args.flags.auto || args.flags.gapReport;
  if (args.flags.preview && modeless) {
    throw new Error(
      "--preview is a single-story check (the lanes for ONE story, no model " +
      "call) — it cannot be combined with --auto, --gap-report, or --models; " +
      "an unattended selection preview is `--auto --dry-run`\n" + USAGE
    );
  }
  if (
    !args.config ||
    refs.length !== (modeless ? 0 : 1) ||
    (args.flags.auto && args.flags.gapReport)
  ) {
    throw new Error(USAGE);
  }
  // pinned lanes (v1.4) — Doc Index row ids (the v2.3 rule),
  // comma-separated accepted, deduped in order; since v1.7 --reference
  // also takes an http(s) URL (one per flag occurrence — URLs may
  // contain commas, so a URL value is never comma-split); manual runs
  // only. Entries: {id} for a row pin, {web: true, url} for a page.
  const parsePins = (vals, flag, urlsOk) => {
    const out = [];
    for (const v of vals || []) {
      const raw = String(v).trim();
      if (/^https?:\/\//i.test(raw)) {
        if (!urlsOk) {
          throw new Error(
            `${flag} takes Doc Index row ids only (got "${raw}") — a web ` +
            "documentation page grounds expected behavior, so pin it with " +
            `--reference; a style/coverage exemplar is always a catalog ` +
            `Test Plan row\n${USAGE}`
          );
        }
        if (!out.some((e) => e.url === raw)) out.push({ web: true, url: raw });
        continue;
      }
      for (const part of raw.split(",")) {
        const id = num(part.trim());
        if (id === undefined) {
          throw new Error(
            `${flag} takes a Doc Index row id${urlsOk ? " or an http(s) URL" : ""} ` +
            `(got "${part.trim()}") — a bare number is always a doc id, ` +
            `nothing is ever guessed (the v2.3 rule)\n${USAGE}`
          );
        }
        if (!out.some((e) => e.id === id)) out.push({ id });
      }
    }
    return out;
  };
  const pinEx = parsePins(args.exemplar, "--exemplar", false);
  const pinRef = parsePins(args.reference, "--reference", true);
  if ((pinEx.length || pinRef.length) && modeless) {
    throw new Error(
      "--exemplar/--reference pin documents into a MANUAL generation's " +
      "lanes — they cannot be combined with --auto, --gap-report, or " +
      "--models (those modes work from catalog state alone)\n" + USAGE
    );
  }
  const doubled = pinEx
    .filter((e) => e.id !== undefined && pinRef.some((r) => r.id === e.id))
    .map((e) => e.id);
  if (doubled.length) {
    throw new Error(
      `doc ${doubled.join(", ")} pinned to both lanes — pick --exemplar ` +
      "(style/coverage) or --reference (expected behavior), not both"
    );
  }
  assertNodeVersion();
  const cfg = JSON.parse(fs.readFileSync(args.config, "utf8"));
  const required = [...TESTPLANGEN_REQUIRED];
  if (args.issue !== undefined) required.push("sharePoint.lists.docIds");
  if (args.flags.auto || args.flags.gapReport) required.push("sharePoint.lists.docLinks");
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
    promptVersion: "v1.10",
    draftFolder: "/Test Plan Drafts",
    verify: "annotate",
    grounding: true,
    notify: false,
    provider: "", // "" = follow llm.provider; "aibuilder"|"anthropic" overrides for generation only
    // v1.6+ split-case drafts run long — the first live run blew a
    // 16384 default (v1.3 raised it; claude-opus-5 allows up to 128k)
    maxTokens: 32000,
    webRefTimeoutMs: 30000,
    issueTrace: true,
    caseIndex: true, // v1.9: the Test Cases lane (routing, trimming, addendum) — needs sharePoint.lists.testCases
    autoDraft: false,
    autoMaxPerRun: 3,
    autoLookbackDays: 7,
    gapReportName: "TestPlan_Gap_Report.md",
    gapReportDrivePath: "", // site default drive root = Shared Documents
    dryRun: true,
    ...(cfg.testplangen || {}),
  };
  if (args.flags.live) cfg.testplangen.dryRun = false;
  if (args.flags.dry) cfg.testplangen.dryRun = true;
  if (args.flags.preview) cfg.testplangen.dryRun = true; // never writes, by construction
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
  cfg._preview = !!args.flags.preview;
  cfg._auto = !!args.flags.auto;
  cfg._force = !!args.flags.force;
  cfg._pinEx = pinEx;
  cfg._pinRef = pinRef;
  cfg._gapReport = !!args.flags.gapReport;
  if (!cfg._models && !cfg._auto && !cfg._gapReport) {
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

// G4 — the sidecar's machine related list: format 3.0 keeps it in the
// Related region's own markers (`<!-- rel:N s=SCORE -->`, file = the
// bullet's link target); files not yet rewritten still carry the yaml
// `related:` line, which relEntries reads first. A missing region
// degrades to no neighbors.
function parseRelated(storyMd) {
  return relEntries(storyMd);
}

async function run(cfg) {
  const graph = new GraphClient(cfg.graph);
  const siteId = await graph.siteId(cfg.sharePoint.hostname, cfg.sharePoint.sitePath);
  const tp = cfg.testplangen;
  const sw = cfg._sw;
  const dry = !!tp.dryRun;

  // remote-files mode (sweep v1.39, local/Hosted_Runner.md): no
  // OneDrive anywhere — the sidecar library mirrors down into
  // paths.sidecarLibrary (eTag-deduped through the manifest the sweep
  // shares, so a run after the nightly sweep downloads nothing) and
  // every sidecar read below then finds its file exactly where the
  // synced-folder path expects it. Nothing here writes back.
  if (cfg.sweep?.remoteFiles) {
    const remote = new RemoteLibrary(
      graph, siteId,
      cfg.sweep.remoteDriveName || String(sw.textsFolder).replace(/^\//, "").split("/").pop(),
      cfg.paths.sidecarLibrary,
      path.join(cfg.paths?.workDir || ".", "mirror-manifest.json")
    );
    await remote.init();
    const m = await remote.mirrorMarkdown();
    process.stderr.write(`remote mirror: ${m.files} sidecar file(s), ${m.downloaded} downloaded\n`);
  }

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
  const ctx = { cfg, graph, siteId, rows, byId, sw, tp, dry, plan: [], preview: !!cfg._preview };

  if (cfg._auto) return runAuto(ctx);
  if (!cfg._gapReport) {
    // progress lines (v1.5) — manual single-story runs only, stderr
    // only (stdout keeps its JSON + Gen_summary contract; the auto
    // and gap-report modes stay quiet for their task logs)
    ctx.progress = (m) => process.stderr.write(`progress: ${m}\n`);
    ctx.progress(`Doc Index snapshot — ${rows.length} rows`);
  }
  if (cfg._gapReport) return runGapReport(ctx);

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
    // filter in memory (no user value in OData), dedup by document;
    // the once-per-process fetch the Issue Trace reads too (v1.10)
    const { ids: idRows } = await issueRowsOf(ctx);
    const docIds = new Set();
    for (const r of idRows) {
      if (r.IssueNumber !== cfg._issue || r.DocumentId === undefined) continue;
      docIds.add(r.DocumentId);
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

  // pinned lanes (v1.3) — hard guards, checked BEFORE any model call:
  // a human asked for these exact documents, so a silent degrade
  // (the lanes' Try_* posture for automatic picks) is wrong here
  ctx.pins = validatePins(ctx, story, cfg._pinEx, cfg._pinRef);
  // web reference pins (v1.7) fetch now, under the same hard-guard
  // posture — any failure refuses the run with zero model spend
  for (const pin of ctx.pins.ref) {
    if (pin.web) {
      await fetchWebRef(pin, ctx.progress || (() => {}), Number(cfg.testplangen.webRefTimeoutMs));
    }
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
  if (res.preview) {
    // --preview (v1.10): the lanes were built, nothing was called or
    // written — the inputs file is the artifact
    fs.writeFileSync(
      logFile,
      JSON.stringify({ line: res.line, preview: true, inputs: res.localInputs }, null, 1)
    );
    pruneRunLogs(logDir, 10, "testplangen-");
    process.stdout.write(
      JSON.stringify({ line: res.line, preview: true, inputs: res.localInputs, logFile }) + "\n"
    );
    process.stdout.write(res.line + "\n");
    process.stdout.write(
      `preview: no model call made — the five prompt inputs are at ${res.localInputs} ` +
      `(provider ${res.provider} would be called with ~${res.inputChars} chars; ` +
      "re-run with --dry-run to generate a local draft, --live to write it)\n"
    );
    return;
  }
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

// Pinned-lane guards (v1.4). Returns { ex, ref } as normalized rows
// — plus, since v1.7, {web: true, url} entries in ref, validated by
// fetchWebRef — in the order given. Every violation throws — before
// the model call, naming the doc and the rule; nothing degrades
// silently.
function validatePins(ctx, story, exPins, refPins) {
  const { cfg, byId, sw } = ctx;
  const KINDS = {
    "--exemplar": ["Test Plan"],
    "--reference": ["Test Plan", "Design Spike"],
  };
  const take = (pins, flag) =>
    pins.map((pin) => {
      if (pin.web) return pin; // fetched (and hard-guarded) by fetchWebRef
      const id = pin.id;
      const nb = byId.get(id);
      if (!nb) throw new Error(`${flag} ${id}: no Doc Index row with that id`);
      if (id === story.ID) {
        throw new Error(`${flag} ${id}: that is the story itself — its full text is already sent`);
      }
      if (!KINDS[flag].includes(nb.DocKind || "")) {
        throw new Error(
          `${flag} ${id} ("${nb.Title}") is DocKind ${nb.DocKind || "(empty)"} — ` +
          `${flag} takes ${KINDS[flag].join(" or ")} rows only`
        );
      }
      if (nb.IndexStatus !== "Indexed" || !nb.TextFileUrl) {
        throw new Error(
          `${flag} ${id} ("${nb.Title}") is not an Indexed row with a sidecar ` +
          `(IndexStatus=${nb.IndexStatus || "(empty)"}${nb.TextFileUrl ? "" : ", no sidecar url"})`
        );
      }
      const local = urlToLocal(nb.TextFileUrl, sw, cfg);
      if (!local || !fs.existsSync(local)) {
        throw new Error(
          `${flag} ${id} ("${nb.Title}"): sidecar not found locally — ` +
          `${nb.TextFileUrl} -> ${local ?? "(outside the sidecar library mapping)"}; ` +
          "is the OneDrive sync current, and sweep.siteUrl/textsFolder correct?"
        );
      }
      return nb;
    });
  return { ex: take(exPins || [], "--exemplar"), ref: take(refPins || [], "--reference") };
}

// ---- web references (v1.7) ------------------------------------------

// Zero-dependency HTML → readable text: scripts/styles/nav dropped,
// headings become markdown #s, list items bullets, table cells pipe-
// separated; tags stripped THEN entities decoded (so &lt;script&gt;
// can never re-materialize as a tag). Good enough for documentation
// pages — a script-rendered page that yields no text refuses upstream.
const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  mdash: "—", ndash: "–", hellip: "…", copy: "©", reg: "®", trade: "™",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
};
function decodeEntities(s) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+[0-9]*);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = /^#x/i.test(e) ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}
function htmlToText(html) {
  const title = decodeEntities(
    (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim()
  );
  let s = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|template|svg|head|nav|iframe)\b[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<(h[1-6])[^>]*>/gi, (m, h) => `\n\n${"#".repeat(Number(h[1]))} `)
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(td|th)>/gi, " | ")
    .replace(/<(br|hr)\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|main|table|tr|ul|ol|li|dl|dd|blockquote|pre|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  s = decodeEntities(s)
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { title, text: s };
}

// Fetch one pinned web reference into its pin entry ({title, text}).
// The pin posture's hard guard applied to the network: a fetch
// failure, non-2xx status, binary reply, or a page with no readable
// text refuses BEFORE the model call — a human asked for this exact
// page. The fetched page is the lane's only public-internet input, so
// beyond the tag strip its text is DEFANGED: block/draft marker
// shapes (<<< >>> [[[ ]]]) become lookalikes, so a hostile page can
// neither close a prompt block nor forge the G9 draft markers (the
// prompt's untrusted-data rule and the lastIndexOf slice already
// resist both — belt and braces).
const WEBREF_FETCH_CAP = 2_000_000; // chars of raw page fed to the strip
async function fetchWebRef(pin, prog, timeoutMs) {
  let res;
  try {
    res = await fetch(pin.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { accept: "text/html, application/xhtml+xml, text/plain;q=0.9, text/markdown;q=0.9" },
    });
  } catch (e) {
    throw new Error(
      `--reference ${pin.url}: fetch failed — ${e.cause?.message || e.message}`
    );
  }
  if (!res.ok) {
    throw new Error(`--reference ${pin.url}: HTTP ${res.status} ${res.statusText || ""}`.trim());
  }
  const ctype = String(res.headers.get("content-type") || "");
  if (ctype && !/^(text\/|application\/(xhtml\+xml|xml|json))/i.test(ctype)) {
    throw new Error(
      `--reference ${pin.url}: content-type "${ctype}" is not a text page — ` +
      "only readable documentation pages can join the reference lane " +
      "(upload the file to the source library and pin its row instead)"
    );
  }
  const raw = (await res.text()).slice(0, WEBREF_FETCH_CAP);
  const looksHtml = /html/i.test(ctype) || /^\s*(<!doctype|<html|<head|<body)/i.test(raw);
  const { title, text } = looksHtml ? htmlToText(raw) : { title: "", text: raw.trim() };
  const defanged = text
    .replaceAll("<<<", "‹‹‹")
    .replaceAll(">>>", "›››")
    .replaceAll("[[[", "⟦⟦⟦")
    .replaceAll("]]]", "⟧⟧⟧");
  if (defanged.length < 40) {
    throw new Error(
      `--reference ${pin.url}: the page yields no readable text ` +
      `(${defanged.length} chars after the tag strip) — a script-rendered ` +
      "page cannot ground a draft; save it as a document, upload it to the " +
      "source library, and pin its row instead"
    );
  }
  pin.title = title || pin.url.split("/").filter(Boolean).pop() || pin.url;
  pin.text = defanged;
  prog(`web reference — "${pin.title}" ${defanged.length} chars from ${pin.url}`);
  return pin;
}

// Doc IDs (+ Issue Refs, when configured) — fetched once per process
// and shared across an auto run's stories (the run-start-snapshot rule)
async function issueRowsOf(ctx) {
  if (ctx._issueRows) return ctx._issueRows;
  const { cfg, graph, siteId } = ctx;
  const out = { ids: [], refs: [] };
  if (cfg.sharePoint.lists?.docIds) {
    out.ids = (
      await graph.listItems(siteId, cfg.sharePoint.lists.docIds, {
        select: ["Repo", "IssueNumber", "Source", "DocumentLookupId"],
      })
    ).map((it) => {
      const f = it.fields || {};
      return {
        Repo: f.Repo || "",
        IssueNumber: num(f.IssueNumber),
        Source: f.Source || "",
        DocumentId: num(f.DocumentLookupId) ?? num(f.DocumentId),
      };
    });
  }
  if (cfg.sharePoint.lists?.issueRefs) {
    out.refs = (
      await graph.listItems(siteId, cfg.sharePoint.lists.issueRefs, {
        select: ["IssueKey", "IssueTitle", "IterationLabel", "StatusSummary", "DoneFlag"],
      })
    ).map((it) => {
      const f = it.fields || {};
      return {
        IssueKey: f.IssueKey || "",
        IssueTitle: f.IssueTitle || "",
        IterationLabel: f.IterationLabel || "",
        StatusSummary: f.StatusSummary || "",
        DoneFlag: f.DoneFlag === true || f.DoneFlag === "Yes",
      };
    });
  }
  ctx._issueRows = out;
  return out;
}

// list-field text into a GFM table cell: pipes and quotes stripped,
// length capped (the Why_capped treatment)
const cellSafe = (s, cap = 120) => cut(stripQuotes(String(s ?? "").replaceAll("|", "/")), cap);

// Test Cases rows (the sweep's per-case index, Case_Index_Plan) —
// fetched once per process and shared by the gap report and the
// generation's case lane; read-only. null when the list is not
// configured, so every consumer degrades to its pre-case behavior.
async function caseRowsOf(ctx) {
  if (ctx._caseRows !== undefined) return ctx._caseRows;
  const { cfg, graph, siteId } = ctx;
  if (!cfg.sharePoint.lists?.testCases) return (ctx._caseRows = null);
  const split = (v) => String(v || "").split(";").map((x) => x.trim()).filter(Boolean);
  ctx._caseRows = (
    await graph.listItems(siteId, cfg.sharePoint.lists.testCases, {
      select: [
        "Title", "DocumentLookupId", "CaseKey", "CaseNo", "Classification",
        "Scenario", "IssueRefs", "Anchor", "Tools", "Keywords",
      ],
    })
  ).map((it) => {
    const f = it.fields || {};
    const key = String(f.CaseKey || "");
    const issueList = split(f.IssueRefs);
    return {
      planId: num(f.DocumentLookupId) ?? num(f.DocumentId),
      key,
      ordinal: num(key.split("|")[1]),
      caseNo: f.CaseNo || "",
      title: f.Title || "",
      classification: f.Classification || "",
      scenario: f.Scenario || "",
      issueList,
      issues: new Set(issueList),
      anchor: f.Anchor || "",
      tools: split(f.Tools).map(lower),
      keywords: split(f.Keywords).map(lower),
    };
  });
  return ctx._caseRows;
}

// the story's own devtopia issue keys (`repo#number`), from the Doc
// IDs rows the sweep minted for it — [] without that list
async function storyIssueKeys(ctx, story) {
  if (!ctx.cfg.sharePoint.lists?.docIds) return [];
  const { ids } = await issueRowsOf(ctx);
  const keys = [];
  for (const r of ids) {
    if (r.DocumentId !== story.ID || r.IssueNumber === undefined) continue;
    const key = `${r.Repo}#${r.IssueNumber}`;
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
}

/**
 * The story's case-index context (v1.9) — null when the Test Cases
 * list is unconfigured or testplangen.caseIndex is false (every case
 * feature then stays off). `existing`: indexed cases whose IssueRefs
 * cite one of the story's issue keys; `traced`: the Indexed Test Plan
 * rows (with a sidecar) those cases belong to, same-surface first,
 * then by tracing-case count, newest, id; `rowsByPlan`: plan id →
 * ordinal → row, for the exemplar trimmer's tag lookup. A read
 * failure degrades to null with one stderr note — the automatic
 * lanes' Try_* posture; the draft never fails over derived rows.
 */
async function caseContextOf(ctx, story, storyMd) {
  const { cfg, tp, byId } = ctx;
  if (tp.caseIndex === false || !cfg.sharePoint.lists?.testCases) return null;
  try {
    const rows = await caseRowsOf(ctx);
    const keys = await storyIssueKeys(ctx, story);
    const keySet = new Set(keys);
    const existing = rows.filter((c) => c.issueList.some((k) => keySet.has(k)));
    const byPlan = new Map();
    for (const c of existing) {
      const p = byId.get(c.planId);
      if (!p || p.DocKind !== "Test Plan" || p.IndexStatus !== "Indexed" || !p.TextFileUrl) continue;
      byPlan.set(p.ID, (byPlan.get(p.ID) || 0) + 1);
    }
    const same = (p) => ((p.Surface || "") === (story.Surface || "") ? 1 : 0);
    const traced = [...byPlan]
      .map(([id, n]) => ({ plan: byId.get(id), n }))
      .sort(
        (a, b) =>
          same(b.plan) - same(a.plan) ||
          b.n - a.n ||
          String(b.plan.SourceModified).localeCompare(String(a.plan.SourceModified)) ||
          a.plan.ID - b.plan.ID
      );
    const rowsByPlan = new Map();
    for (const c of rows) {
      if (c.planId === undefined || c.ordinal === undefined) continue;
      if (!rowsByPlan.has(c.planId)) rowsByPlan.set(c.planId, new Map());
      rowsByPlan.get(c.planId).set(c.ordinal, c);
    }
    return {
      rows, keys, keySet, existing, traced, rowsByPlan,
      storyTools: metaList(storyMd, "Tools").map(lower),
      storyKeywords: metaList(storyMd, "Keywords").map(lower),
    };
  } catch (e) {
    process.stderr.write(`case index skipped: ${e.message}\n`);
    return null;
  }
}

/**
 * G7, case-aware (v1.9): an exemplar body that overflows its budget
 * is cut WHOLE CASES at a time — the plan's head (metadata, Related,
 * Overview) stays, then the cases most relevant to the story in
 * document order, then the tail (Coverage Map, other content) if it
 * still fits; a closing line states how many cases were omitted.
 * Relevance is deterministic: a case citing one of the story's issue
 * ids (its own parsed refs ∪ its list row's IssueRefs) outranks
 * everything; then shared Tools tags, then shared Keywords tags (the
 * case row's curated tags, caseindex v1.2, joined by CaseKey ordinal —
 * a plan not yet recased simply scores on issue refs alone); ties
 * keep document order, and a case too big for what is left is
 * skipped so smaller relevant ones still fit. A body that fits is
 * returned verbatim; without a case context, or when the body shows
 * no recognizable cases, the blind cut it always took applies.
 * Returns { text, kept, total, trimmed }.
 */
function caseAwareTake(content, budget, planId, cc, defaultRepo) {
  const parsed = extractCases(content, { defaultRepo, caseTextCap: 1 });
  const total = parsed.cases.length;
  if (content.length <= budget) return { text: content, kept: total, total, trimmed: false };
  if (!cc || total === 0) return { text: cut(content, budget), kept: 0, total, trimmed: false };
  const { lines, spans } = caseSpans(content);
  const rowOf = (cc.rowsByPlan.get(planId)) || new Map();
  const overlap = (a, b) => a.filter((x) => b.includes(x)).length;
  const scored = parsed.cases.map((c, i) => {
    const row = rowOf.get(c.ordinal);
    let score = 0;
    for (const k of new Set([...c.issueRefs, ...(row ? row.issueList : [])])) {
      if (cc.keySet.has(k)) score += 100;
    }
    if (row) score += 10 * overlap(row.tools, cc.storyTools) + 3 * overlap(row.keywords, cc.storyKeywords);
    return { i, ordinal: c.ordinal, score, text: lines.slice(spans[i].start, spans[i].end).join("\n") };
  });
  const tail = lines.slice(spans[spans.length - 1].end).join("\n");
  const footer = (n) =>
    `\n_(exemplar trimmed at ExemplarCap: ${total - n} of ${total} cases omitted — ` +
    `the ${n} most relevant to this story kept)_\n`;
  // the footer's two counts change width with n — reserve its widest
  // form, and cut the HEAD to leave that room (v1.10: a head larger
  // than the budget used to take the whole budget and the footer
  // still rode on top, overrunning ExemplarCap)
  const reserve = footer(0).length + String(total).length + 1;
  const head = cut(lines.slice(0, spans[0].start).join("\n"), Math.max(0, budget - reserve));
  let used = head.length;
  const keep = new Set();
  for (const c of [...scored].sort((a, b) => b.score - a.score || a.ordinal - b.ordinal)) {
    if (used + 1 + c.text.length + reserve > budget) continue;
    keep.add(c.i);
    used += 1 + c.text.length;
  }
  const parts = [head];
  for (const c of scored) if (keep.has(c.i)) parts.push(c.text);
  if (keep.size < total) {
    parts.push(footer(keep.size));
    used += 1 + footer(keep.size).length;
  }
  if (tail.trim() && used + 1 + tail.length <= budget) parts.push(tail);
  // the invariant the caps leg pins (exChars ≤ ExemplarCap): the
  // accounting above holds it; this guard makes it unconditional
  const text = cut(parts.join("\n"), budget);
  return { text, kept: keep.size, total, trimmed: true };
}

/** The `## Existing Test Cases` addendum (v1.9) — "" when the case
 *  context is off or no indexed case cites the story's issues.
 *  Machine-minted from Test Cases rows, appended AFTER verification
 *  like the Issue Trace; each row deep-links its sidecar section. */
function existingCasesSection(ctx, cc) {
  if (!cc || cc.existing.length === 0) return { section: "", count: 0 };
  const { byId } = ctx;
  const MAX = 60;
  const rows = [...cc.existing].sort(
    (a, b) => (a.planId ?? 0) - (b.planId ?? 0) || (a.ordinal ?? 0) - (b.ordinal ?? 0)
  );
  const plans = new Set(rows.map((c) => c.planId));
  const lines = rows.slice(0, MAX).map((c) => {
    const p = byId.get(c.planId);
    const plan = `${cellSafe(p?.Title || `doc ${c.planId}`, 80)} (doc ${c.planId})`;
    const link = p?.TextFileUrl
      ? `[open](<${p.TextFileUrl}${c.anchor ? "#" + c.anchor : ""}>)`
      : "—";
    const cited = c.issueList
      .filter((k) => cc.keySet.has(k))
      .map((k) => "`" + cellSafe(k, 60).replaceAll("`", "") + "`")
      .join(" ");
    return (
      `| ${plan} | ${cellSafe(c.title, 100)} | ${cellSafe(c.classification || "—", 20)} ` +
      `| ${cited} | ${link} |`
    );
  });
  return {
    count: rows.length,
    section:
      "\n## Existing Test Cases\n\n" +
      "_Deterministic addendum — minted by local/testplangen.mjs from the " +
      "sweep's Test Cases list, not by the model: indexed test cases across " +
      `the catalog that already cite this story's devtopia issues (${rows.length} ` +
      `case(s) in ${plans.size} plan(s)). Check the draft against them during ` +
      "the review pass — a tailored case that duplicates one should say so in " +
      "its Trace, and a behavior they exercise that the draft lacks is a " +
      "coverage question for the PE._\n\n" +
      "| Plan | Existing case | Class | Cites | Sidecar |\n" +
      "| --- | --- | --- | --- | --- |\n" +
      lines.join("\n") +
      (rows.length > MAX ? `\n| … | ${rows.length - MAX} more — see _Case Catalog.md | | | |` : "") +
      "\n",
  };
}

/** The story's deterministic `## Issue Trace` addendum ("" when the
 *  story carries no issue rows, or the lane is off/unconfigured).
 *  Machine-minted from list rows, never model output — appended AFTER
 *  verification, so the verifier only ever judges the model's draft. */
async function issueTraceOf(ctx, story) {
  const { cfg, tp } = ctx;
  if (tp.issueTrace === false || !cfg.sharePoint.lists?.docIds) return { section: "", count: 0 };
  try {
    const { ids, refs } = await issueRowsOf(ctx);
    const refByKey = new Map(refs.map((r) => [r.IssueKey, r]));
    const seen = new Set();
    const lines = [];
    for (const r of ids) {
      if (r.DocumentId !== story.ID || r.IssueNumber === undefined) continue;
      const key = `${r.Repo}#${r.IssueNumber}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const ref = refByKey.get(key);
      const status = ref
        ? [ref.IterationLabel, ref.StatusSummary, ref.DoneFlag ? "done" : ""]
            .filter(Boolean)
            .map((v) => cellSafe(v, 80))
            .join(" · ") || "—"
        : "—";
      lines.push(
        `| ${cellSafe(key, 60)} | ${ref && ref.IssueTitle ? cellSafe(ref.IssueTitle) : "—"} ` +
        `| ${status} | ${cellSafe(r.Source, 60) || "sidecar"} |`
      );
    }
    if (lines.length === 0) return { section: "", count: 0 };
    return {
      count: lines.length,
      section:
        "\n## Issue Trace\n\n" +
        "_Deterministic addendum — minted by local/testplangen.mjs from the " +
        "Doc IDs and Issue Refs lists, not by the model. Cross-check against " +
        "devtopia during the review pass._\n\n" +
        "| Issue | Title (Issue Refs) | Schedule status | Found via |\n" +
        "| --- | --- | --- | --- |\n" +
        lines.join("\n") + "\n",
    };
  } catch (e) {
    // the addendum is a convenience — its failure never fails a draft
    process.stderr.write(`issue trace skipped: ${e.message}\n`);
    return { section: "", count: 0 };
  }
}

// gap test (b): stories already edge-linked to a Test Plan, one Doc
// Links scan per run (shared by the auto mode and the gap report)
async function linkedToPlanSet(ctx) {
  const { cfg, graph, siteId, byId } = ctx;
  const isPlanId = (id) => byId.get(id)?.DocKind === "Test Plan";
  const linkRows = await graph.listItems(siteId, cfg.sharePoint.lists.docLinks, {
    select: ["DocALookupId", "DocBLookupId"],
  });
  // a Map so the gap report can also name WHICH plans cover a story;
  // the auto mode's `.has` membership test reads the same either way
  const linked = new Map();
  const add = (storyId, planId) => {
    const list = linked.get(storyId) || [];
    if (!list.includes(planId)) list.push(planId);
    linked.set(storyId, list);
  };
  for (const it of linkRows) {
    const f = it.fields || {};
    const a = num(f.DocALookupId) ?? num(f.DocAId);
    const b = num(f.DocBLookupId) ?? num(f.DocBId);
    if (a === undefined || b === undefined) continue;
    if (isPlanId(b)) add(a, b);
    if (isPlanId(a)) add(b, a);
  }
  return linked;
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
      "is the OneDrive sync current, and sweep.siteUrl/textsFolder correct? " +
      "(a machine with no OneDrive sync runs with sweep.remoteFiles: true — " +
      "the sidecar library then mirrors down at run start, Local_Setup.md §11)"
    );
  }
  const storyMd = fs.readFileSync(storyLocal, "utf8");
  const prog = ctx.progress || (() => {});
  prog(`story ${story.ID} "${stripQuotes(story.Title)}" — sidecar ${storyMd.length} chars`);
  // the case-index context (v1.9) — null = every case feature off
  const cc = await caseContextOf(ctx, story, storyMd);

  // G4 — score-ordered related entries, capped (parseRelated above)
  const relEntries = parseRelated(storyMd).slice(0, Number(tp.neighborCap));

  // G5 — lanes over the score-ordered entries (concurrency 1).
  // Pinned docs (v1.3, validated up front) fill their lane FIRST, in
  // the order given — they may exceed the slot counts (a human choice
  // beats the slot default; the character caps stay the hard budget,
  // served in lane order so pins take budget first). The automatic
  // routing below fills any remaining slots and skips pinned docs.
  const pins = ctx.pins || { ex: [], ref: [] };
  let digest = "";
  let exemplarText = "";
  let referenceText = "";
  const exemplarUrls = [];
  const referenceRefs = [];
  let exemplarCount = 0;
  let referenceCount = 0;
  const pinnedIds = new Set();
  for (const nb of pins.ex) {
    exemplarUrls.push(nb.TextFileUrl);
    pinnedIds.add(nb.ID);
  }
  for (const nb of pins.ref) {
    if (nb.web) {
      // a fetched web reference (v1.7) — text already in hand
      referenceRefs.push({ web: true, url: nb.url, title: nb.title, text: nb.text });
      continue;
    }
    referenceRefs.push({
      url: nb.TextFileUrl,
      surface: nb.Surface || "",
      title: stripQuotes(nb.Title),
    });
    pinnedIds.add(nb.ID);
  }
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
    if (pinnedIds.has(nb.ID)) continue; // already in a lane by pin (digest line kept)
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

  // G5c — case-traced routing (v1.9): plans whose INDEXED CASES cite
  // one of the story's own devtopia issue ids fill the slots the
  // related routing left open — same-surface plans as exemplars,
  // others (and same-surface overflow, the G5b rule) as reference
  // functionality. A case stating the story's issue id is a link the
  // sweep minted from the plan's own text (Doc IDs ∩ IssueRefs), not
  // a similarity guess — so this is not the machine-chosen fallback
  // the reference lane bans; the related routing still goes first
  // (flow parity), and the G6 fallback below now runs only when
  // nothing at all was found. Pinned and already-routed plans skip.
  const routedIds = [];
  for (const { plan } of cc ? cc.traced : []) {
    if (pinnedIds.has(plan.ID)) continue;
    const url = plan.TextFileUrl;
    if (exemplarUrls.includes(url) || referenceRefs.some((r) => r.url === url)) continue;
    if (
      (plan.Surface || "") === (story.Surface || "") &&
      exemplarUrls.length < Number(tp.exemplarSlots)
    ) {
      exemplarUrls.push(url);
    } else if (referenceRefs.length < Number(tp.referenceSlots)) {
      referenceRefs.push({ url, surface: plan.Surface || "", title: stripQuotes(plan.Title) });
    } else {
      continue;
    }
    routedIds.push(plan.ID);
  }

  // G6 — exemplar fallback (deterministic, from the snapshot; the
  // reference lane deliberately has NO fallback — grounding only ever
  // comes from documents RelatedRank linked to this story, or — since
  // v1.9 — documents whose indexed cases cite the story's issues)
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

  // G7 — exemplar bodies (remaining-budget take, the v2.13 semantics;
  // since v1.9 an overflowing body is trimmed whole-case-at-a-time
  // when the case index is on — caseAwareTake)
  const planByUrl = new Map(rows.filter((r) => r.TextFileUrl).map((r) => [r.TextFileUrl, r]));
  let exCasesKept = 0;
  let exCasesTotal = 0;
  let caseTrim = 0;
  for (const url of exemplarUrls) {
    const local = urlToLocal(url, sw, cfg);
    if (!local || !fs.existsSync(local)) continue; // Try_exemplar degrades silently
    if (exemplarText.length >= Number(tp.exemplarCap)) continue; // If_ex_budget
    const remaining = Number(tp.exemplarCap) - exemplarText.length; // Ex_remaining
    const content = fs.readFileSync(local, "utf8");
    const take = caseAwareTake(
      content, remaining, planByUrl.get(url)?.ID, cc, cfg.sweep?.defaultRepo || ""
    );
    exemplarText += `--- EXEMPLAR: ${path.basename(local)} ---\n${take.text}\n\n`;
    exemplarCount++;
    exCasesKept += take.kept;
    exCasesTotal += take.total;
    if (take.trimmed) caseTrim++;
  }

  // G7b — reference bodies (header carries title AND surface — the
  // prompt's surface-parity rule keys on it; a web reference's header
  // carries its URL in the surface slot, so the parity [VERIFY] fires
  // naturally: a documentation page's surface is never the story's)
  let webRefCount = 0;
  for (const ref of referenceRefs) {
    if (referenceText.length >= Number(tp.referenceCap)) continue; // If_ref_budget
    const remaining = Number(tp.referenceCap) - referenceText.length; // Ref_remaining
    if (ref.web) {
      referenceText +=
        `--- REFERENCE: ${ref.title} — surface web documentation <${ref.url}> ---\n` +
        `${cut(ref.text, remaining)}\n\n`;
      referenceCount++;
      webRefCount++;
      ref.injected = true; // the addendum lists only pages the model saw
      continue;
    }
    const local = urlToLocal(ref.url, sw, cfg);
    if (!local || !fs.existsSync(local)) continue; // Try_reference degrades silently
    const content = fs.readFileSync(local, "utf8");
    referenceText +=
      `--- REFERENCE: ${ref.title || path.basename(local)} — surface ${ref.surface} ---\n` +
      `${cut(content, remaining)}\n\n`;
    referenceCount++;
  }

  const docRefPins = pins.ref.filter((r) => !r.web);
  const webRefPins = pins.ref.filter((r) => r.web);
  prog(
    `lanes — exemplars ${exemplarCount} (${exemplarText.length} chars), ` +
    `references ${referenceCount} (${referenceText.length} chars, ` +
    `${webRefCount} web), digest ${digest.length} chars` +
    (pins.ex.length || pins.ref.length
      ? ` — pinned ex [${pins.ex.map((r) => r.ID).join(",")}] ` +
        `ref [${docRefPins.map((r) => r.ID).join(",")}]` +
        (webRefPins.length ? ` web [${webRefPins.map((r) => r.url).join(" ")}]` : "")
      : "")
  );
  if (cc) {
    prog(
      `cases — ${cc.rows.length} indexed, ${cc.existing.length} trace this story's issues` +
      (routedIds.length ? `, routed [${routedIds.join(",")}] into the lanes` : "") +
      (caseTrim
        ? `, ${caseTrim} exemplar(s) trimmed case-wise (${exCasesKept}/${exCasesTotal} cases shown)`
        : "")
    );
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
  // phase 5: a story/v1 sidecar puts Story + Acceptance Criteria ahead
  // of Testing/Automation/… so the StoryCap cut keeps the requirements
  const storyTextCapped = cut(storyTextFirst(storyMd), Number(tp.storyCap));
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
  const inChars = Object.values(inputs).reduce((n, v) => n + String(v).length, 0);
  if (ctx.preview) {
    // --preview (v1.10): everything a generation does up to the model
    // call has now run (guard, lookup, pins, mirror, lanes, provider
    // and — for aibuilder — the model id check); write the inputs
    // for inspection and stop. Zero AI spend, nothing uploaded.
    if (provider === "aibuilder" && !cfg.llm.testPlanModelId) {
      throw new Error(
        "llm.testPlanModelId is not set — run with --models to find the " +
        "LRS Test Plan Generation model GUID (provider \"anthropic\" needs no tenant prompt)"
      );
    }
    const logDir = cfg.paths?.workDir || ".";
    fs.mkdirSync(logDir, { recursive: true });
    const localInputs = path.join(
      logDir,
      `testplangen-preview-${new Date().toISOString().replaceAll(":", "").slice(0, 17)}.md`
    );
    const body =
      `# TestPlanGen preview — story ${story.ID} "${stripQuotes(story.Title)}"\n\n` +
      `local/testplangen.mjs ${JOB_VERSION} · ${new Date().toISOString()} · ` +
      `provider ${provider} · ~${inChars} chars of prompt inputs · NO model call was made.\n` +
      "The five prompt inputs below are exactly what a generation would send " +
      "(prompts/TestPlanGen_Prompt.md's {StoryMeta} {StoryText} {RelatedDigest} " +
      "{ExemplarText} {ReferenceText}); adjust caps, pins, or the story's " +
      "related: line, then re-run with --dry-run or --live.\n\n" +
      INPUT_KEYS.map(
        (k) => `=== ${k} (${String(inputs[k]).length} chars) ===\n${inputs[k]}\n`
      ).join("\n");
    fs.writeFileSync(localInputs, body);
    prog(`preview — no model call; inputs written to ${localInputs}`);
    const line =
      `story=${story.ID} neighbors=${relEntries.length} exemplars=${exemplarCount} ` +
      `references=${referenceCount} digestChars=${digest.length} ` +
      `storyChars=${storyTextCapped.length} exChars=${exemplarText.length} ` +
      `refChars=${referenceText.length} pinnedEx=${pins.ex.length} ` +
      `pinnedRef=${docRefPins.length} webRefs=${webRefCount} ` +
      `caseRouted=${routedIds.length} caseTrim=${caseTrim} ` +
      `exCases=${exCasesKept}/${exCasesTotal} inputChars=${inChars} ` +
      `provider=${provider} preview=1`;
    return { line, preview: true, localInputs, provider, inputChars: inChars };
  }
  prog(
    `calling the model — provider ${provider}, ~${inChars} chars in` +
    (provider === "anthropic" ? `, maxTokens ${tp.maxTokens}` : "") +
    " (a long wait here is generation, not a hang; retries print their own llm: lines)"
  );
  const genT0 = Date.now();
  const beat = ctx.progress
    ? setInterval(
        () => prog(`still waiting on the model — ${Math.round((Date.now() - genT0) / 1000)}s elapsed`),
        30000
      )
    : null;
  beat?.unref?.();
  let genRaw;
  try {
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
    try {
      genRaw = await generateText({ ...cfg.llm, maxTokens: Number(tp.maxTokens) }, prompt);
    } catch (e) {
      if (/max_tokens/.test(String(e.message))) {
        throw new Error(
          `${e.message} — for this job the knob is testplangen.maxTokens ` +
          `(currently ${tp.maxTokens}; the model allows up to 128000; the ` +
          "generation streams, so llm.timeoutMs is only the max silent gap " +
          "between chunks and rarely needs raising)"
        );
      }
      throw e;
    }
  } else {
    throw new Error(`unknown llm.provider "${provider}" (aibuilder | anthropic)`);
  }
  } finally {
    if (beat) clearInterval(beat);
  }
  prog(`model replied — ${genRaw.length} chars in ${Math.round((Date.now() - genT0) / 1000)}s`);

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
    prog(`verifier — ${verify}`);
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
  // FIGURES (prompt v1.10) — a cited figure link is copied VERBATIM
  // from the sidecar, so it is sidecar-relative (../media/...) and
  // resolves nowhere from the drafts folder (a different folder tree
  // from the sidecar library). Rewrite cited links to absolute site
  // URLs AFTER verification — the grounding layer judged the model's
  // links exactly as copied; this rewrite is deterministic and
  // model-free, the banner/Issue Trace precedent. draftChars keeps
  // counting the model's own body, so the flow-parity counter holds.
  const mediaBase = encodeURI(`${sw.siteUrl}${sw.textsFolder}/media/`);
  let figureCount = 0;
  const draftOut = draftBody.replace(
    /(!\[[^\]\n]*\]\()\.\.\/media\/([^()\s]+)(\))/g,
    (m, pre, name, post) => {
      figureCount++;
      return pre + mediaBase + encodeURIComponent(name) + post;
    }
  );
  if (figureCount) prog(`figures — ${figureCount} story figure link(s) absolutized`);

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
  const pinStamp =
    pins.ex.length || pins.ref.length
      ? " · pinned" +
        (pins.ex.length ? ` exemplars [${pins.ex.map((r) => r.ID).join(",")}]` : "") +
        (docRefPins.length ? ` references [${docRefPins.map((r) => r.ID).join(",")}]` : "") +
        (webRefPins.length
          ? ` web references [${webRefPins.map((r) => `<${r.url}>`).join(" ")}]`
          : "")
      : "";
  const caseStamp = routedIds.length ? ` · case-routed [${routedIds.join(",")}]` : "";
  const banner =
    `<!-- machine-generated test-plan draft — TestPlanGen prompt ${tp.promptVersion}` +
    ` · local/testplangen.mjs ${JOB_VERSION} · provider ${provider}${pinStamp}${caseStamp} -->\n` +
    "> [!WARNING]\n" +
    `> **DRAFT — machine-generated, unreviewed.** Generated ${new Date().toISOString()} ` +
    `from user story doc ${story.ID} — "${stripQuotes(story.Title)}". ` +
    `Source sidecar: <${storyUrl}>${truncFlag}\n` +
    "> Review every case and resolve all [VERIFY] items before use. Do NOT " +
    "upload this file to the LocationReferencing Documents library or the " +
    "LRS Doc Index library — finalize into the team test-plan format first " +
    "(TestPlanGen_Setup.md §4).\n\n";
  // the deterministic Issue Trace addendum (v1.3) rides AFTER the
  // verified body — the verifier never judges machine-minted content
  const trace = await issueTraceOf(ctx, story);
  // …and so does the web-reference addendum (v1.7): the pinned pages
  // the model actually saw, as clickable links for the §4 reviewer.
  // Machine-minted from the pins, never model output; titles lose
  // bracket characters so the markdown link can never break.
  const seenWebRefs = referenceRefs.filter((r) => r.web && r.injected);
  const webRefSection = seenWebRefs.length
    ? "\n## Reference Documentation\n\n" +
      "_Deterministic addendum — minted by local/testplangen.mjs from the " +
      "run's pinned `--reference` URLs, not by the model: the web " +
      "documentation pages fed into the REFERENCE FUNCTIONALITY lane. " +
      "Reference-grounded Traces cite these pages by title._\n\n" +
      seenWebRefs
        .map((r) => `- [${r.title.replace(/[\[\]]/g, "")}](${r.url})`)
        .join("\n") + "\n"
    : "";
  // …and the Existing Test Cases addendum (v1.9): what the catalog's
  // case index already holds for this story's issues, for the dedupe
  // and cross-check during the §4 review
  const existingCases = existingCasesSection(ctx, cc);
  const draft =
    banner + verifyBlock + draftOut + "\n" + trace.section + existingCases.section + webRefSection;

  // G11 — timestamped save, never overwritten (drafts are work
  // products a PE may be mid-edit on; stale ones are deleted by hand)
  const now = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const stamp =
    `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}` +
    `-${p(now.getUTCHours())}${p(now.getUTCMinutes())}${p(now.getUTCSeconds())}`;
  // phase 1b: drafts share the story sidecar's stem —
  // <stem>--draft-<yyyymmdd-hhmmss>.md (the `--draft-` token is what
  // the auto-mode idempotency scan keys on; seconds since v1.10 — a
  // minute stamp let two runs on one story overwrite each other
  // through the drive PUT, against the never-overwritten rule)
  const draftName = `${stemOf(story.TextFileUrl) || `doc${story.ID}`}--draft-${stamp}.md`;
  const draftPath = `${tp.draftFolder}/${draftName}`;
  plan.push({ action: "putFile", path: draftPath, bytes: draft.length });
  let putRes = null;
  if (!dry) putRes = await graph.putFile(siteId, draftPath, draft);

  // G13 — Gen_summary (+ verify=), run log in the curate.mjs mold
  const line =
    `story=${story.ID} neighbors=${relEntries.length} exemplars=${exemplarCount} ` +
    `references=${referenceCount} digestChars=${digest.length} ` +
    `storyChars=${storyTextCapped.length} draftChars=${draftBody.length} ` +
    `exChars=${exemplarText.length} refChars=${referenceText.length} ` +
    `verify=${verify} issues=${trace.count} figures=${figureCount} ` +
    `pinnedEx=${pins.ex.length} pinnedRef=${docRefPins.length} webRefs=${webRefCount} ` +
    `existingCases=${existingCases.count} caseRouted=${routedIds.length} ` +
    `caseTrim=${caseTrim} exCases=${exCasesKept}/${exCasesTotal}`;

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
 * existing `<stem>--draft-*.md` file in the drafts folder (or a legacy
 * `TestPlanDraft__doc{ID}__*` one) is skipped — a PE deleting the
 * draft (the §4 housekeeping step) is
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
  const linkedToPlan = await linkedToPlanSet(ctx);

  // idempotency: existing auto/manual drafts, one listing per run
  const existing = new Set();
  // stem -> story id, User Story rows only (v1.10): a Test Plan that
  // shares a story's sidecar stem must never mark the story as drafted
  const idByStem = new Map(
    rows
      .filter((r) => r.DocKind === "User Story" && r.TextFileUrl)
      .map((r) => [stemOf(r.TextFileUrl), r.ID])
  );
  for (const child of await graph.listFolder(siteId, tp.draftFolder)) {
    const nm = String(child.name || "");
    const legacy = /^TestPlanDraft__doc(\d+)__/.exec(nm);
    if (legacy) { existing.add(Number(legacy[1])); continue; }
    const m = /^(.+)--draft-\d{8}-\d{4,6}\.md$/.exec(nm);
    if (m) {
      const id = idByStem.get(m[1]) ?? (/^doc(\d+)$/.exec(m[1]) || [])[1];
      if (id) existing.add(Number(id));
    }
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

/**
 * --gap-report (v1.3, phase 4): the whole-catalog counterpart of the
 * auto mode's lookback scan, with no AI spend and no drafting — every
 * Indexed User Story with NO covering Test Plan (no related-list
 * plan, no Doc Links edge), each with its devtopia issue numbers, as
 * a FIXED-NAME digest overwritten per run (the curation-digest
 * snapshot rule: an emptied queue writes an explicit empty state,
 * never last week's file). Lands in the Shared Documents root —
 * outside the LRS Doc Index library, so the Q&A agent never ingests
 * it. Schedulable weekly beside curation; also the "which stories
 * would auto mode eventually reach" planning view.
 */
async function runGapReport(ctx) {
  const { cfg, graph, siteId, rows, sw, tp, dry } = ctx;
  const linkedToPlan = await linkedToPlanSet(ctx);
  const { ids } = await issueRowsOf(ctx);
  const issuesByDoc = new Map();
  for (const r of ids) {
    if (r.DocumentId === undefined || r.IssueNumber === undefined) continue;
    const list = issuesByDoc.get(r.DocumentId) || [];
    const key = `${r.Repo}#${r.IssueNumber}`;
    if (!list.includes(key)) list.push(key);
    issuesByDoc.set(r.DocumentId, list);
  }

  // case-level truth (Case_Index_Plan phase 3) — optional, read-only:
  // with the Test Cases list configured, each story's issue ids are
  // checked against every indexed case's own IssueRefs; absent, the
  // report stays exactly the adjacency verdict it always was.
  const caseRows = await caseRowsOf(ctx); // null without the list
  const tracingOf = (storyId) => {
    if (!caseRows) return null;
    const issues = issuesByDoc.get(storyId) || [];
    if (!issues.length) return [];
    return caseRows.filter((c) => issues.some((k) => c.issues.has(k)));
  };

  const isPlanId = (id) => ctx.byId.get(id)?.DocKind === "Test Plan";
  const stories = rows.filter((r) => r.DocKind === "User Story" && r.IndexStatus === "Indexed");
  const gaps = [];
  const unassessable = [];
  const coveredUntraced = []; // {story, planIds} — covered, issues cited by NO case
  let covered = 0;
  let tracedStories = 0;
  for (const story of stories) {
    const local = story.TextFileUrl ? urlToLocal(story.TextFileUrl, sw, cfg) : null;
    if (!local || !fs.existsSync(local)) {
      unassessable.push(story);
      continue;
    }
    // covering plans: Doc Links edges + the sidecar's related: line —
    // collected (not just tested) so the case-tracing section can name
    // them; an edge-covered story with an unparseable related: line
    // still counts covered, exactly as before
    const planIds = (linkedToPlan.get(story.ID) || []).slice();
    try {
      for (const e of parseRelated(fs.readFileSync(local, "utf8"))) {
        const d = num(e?.doc);
        if (d !== undefined && isPlanId(d) && !planIds.includes(d)) planIds.push(d);
      }
    } catch {
      if (planIds.length === 0) {
        unassessable.push(story);
        continue;
      }
    }
    if (planIds.length > 0) {
      covered++;
      const tr = tracingOf(story.ID);
      if (tr && (issuesByDoc.get(story.ID) || []).length) {
        if (tr.length) tracedStories++;
        else coveredUntraced.push({ story, planIds });
      }
    } else {
      gaps.push(story);
    }
  }

  const storyLine = (s) => {
    const issues = issuesByDoc.get(s.ID) || [];
    return (
      `- doc ${s.ID} — "${stripQuotes(s.Title)}" (surface ${s.Surface || ""}, ` +
      `release ${s.TargetRelease || ""}` +
      (issues.length ? `; issues ${issues.join(" ")}` : "") +
      `)${s.TextFileUrl ? ` — sidecar: <${s.TextFileUrl}>` : ""}`
    );
  };
  const caseStats = caseRows
    ? ` caseRows=${caseRows.length} traced=${tracedStories} ` +
      `coveredUntraced=${coveredUntraced.length}`
    : "";
  const head =
    `# Test plan gap report\n\n` +
    `Run: ${new Date().toISOString()}  ·  local/testplangen.mjs ${JOB_VERSION}  ·  ` +
    `stories=${stories.length} covered=${covered} gaps=${gaps.length} ` +
    `unassessable=${unassessable.length}${caseStats}\n\n`;
  // a gap story whose issues SOME case already cites is a special
  // gap: case-level coverage exists, the doc-level link doesn't
  const gapLine = (s) => {
    const tr = tracingOf(s.ID);
    return (
      storyLine(s) +
      (tr && tr.length
        ? ` — ${tr.length} existing test case(s) already trace its issues ` +
          "(case-level coverage without a doc link; see _Case Catalog.md)"
        : "")
    );
  };
  const body =
    gaps.length === 0
      ? "NO GAPS — every assessable indexed User Story has a covering Test " +
        "Plan (a related-list plan or a Doc Links edge). New stories appear " +
        "here as the sweep indexes them.\n"
      : "Indexed User Stories with NO covering Test Plan (no related-list " +
        "plan, no Doc Links edge) — draft with " +
        "`testplangen.mjs --story <doc>` or let `--auto` reach them:\n\n" +
        gaps.map(gapLine).join("\n") + "\n";
  // case-level tracing (Case_Index_Plan phase 3): adjacency says a
  // plan sits NEXT TO the story; tracing says a case actually cites
  // its issue ids — the gap adjacency cannot see
  let caseSection = "";
  if (caseRows) {
    const noIssue = covered - tracedStories - coveredUntraced.length;
    caseSection =
      "\n## Case-level tracing\n\n" +
      `${caseRows.length} indexed test case(s). Of the ${covered} covered ` +
      `stor${covered === 1 ? "y" : "ies"}, ${tracedStories} have at least ` +
      "one case citing their issue ids" +
      (noIssue > 0 ? ` (${noIssue} carry no issue ids to trace)` : "") +
      (coveredUntraced.length === 0
        ? ".\n"
        : `; **${coveredUntraced.length} are covered by adjacency ONLY** — ` +
          "a plan sits next to them, but no case cites their issues:\n\n" +
          coveredUntraced
            .map(({ story, planIds }) => {
              const plans = planIds
                .map((id) => {
                  const p = ctx.byId.get(id);
                  const n = caseRows.filter((c) => c.planId === id).length;
                  return `"${stripQuotes(p?.Title || String(id))}" (doc ${id}, ${n} case(s))`;
                })
                .join(", ");
              return (
                storyLine(story) +
                `\n  covered by ${plans} — none cite ` +
                (issuesByDoc.get(story.ID) || []).join(" ")
              );
            })
            .join("\n") + "\n");
  }
  const tail =
    unassessable.length === 0
      ? ""
      : "\nUnassessable (no sidecar in the local sync, or an unparseable " +
        "related: line):\n\n" + unassessable.map(storyLine).join("\n") + "\n";
  const report = head + body + caseSection + tail;

  const reportPath = `${tp.gapReportDrivePath}/${tp.gapReportName}`;
  ctx.plan.push({ action: "putFile", path: reportPath, bytes: report.length });
  if (!dry) await graph.putFile(siteId, reportPath, report);

  const line =
    `mode=gap-report stories=${stories.length} covered=${covered} ` +
    `gaps=${gaps.length} unassessable=${unassessable.length}${caseStats}`;
  const logDir = cfg.paths?.workDir || ".";
  fs.mkdirSync(logDir, { recursive: true });
  const logStamp = new Date().toISOString().replaceAll(":", "").slice(0, 17);
  let localReport;
  if (dry) {
    localReport = path.join(logDir, `testplangen-gapreport-${logStamp}.md`);
    fs.writeFileSync(localReport, report);
  }
  const logFile = path.join(logDir, `testplangen-${logStamp}.json`);
  fs.writeFileSync(
    logFile,
    JSON.stringify(
      { line, dry_run: dry, report: reportPath, localReport, plan: dry ? ctx.plan : undefined },
      null,
      1
    )
  );
  pruneRunLogs(logDir, 10, "testplangen-");
  process.stdout.write(JSON.stringify({ line, dry_run: dry, report: reportPath, logFile }) + "\n");
  process.stdout.write(line + "\n");
  if (dry) {
    process.stdout.write(
      `dry run: nothing uploaded — the report is at ${localReport} ` +
      `(would land as ${reportPath})\n`
    );
  }
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
