/**
 * draftlint.mjs v1.1 — in-process draft verification for
 * local/testplangen.mjs, two layers:
 *
 * `lintDraft` — the CONTRACT layer: a port of the TestPlanGen draft
 * coverage lint (review/harness/check_draft_coverage.py, v1.7
 * contract). The Python lint stays the harness AUTHORITY; this port
 * exists so the generation job can verify a draft BEFORE writing it
 * without a Python dependency at run time. check_testplangen.py's
 * agreement leg runs both over shared fixtures and fails on any
 * verdict or failure-label divergence — keep the two in lockstep: a
 * contract change edits the Python first, then mirrors here (labels
 * verbatim).
 *
 * Asserts (v1.7 contract; see the Python docstring for prose):
 *   1 section presence + order (+ non-empty conditionals)
 *   2 every TC case carries a **Trace:** line
 *   3 Negative Tests opens with the fixed CAUTION alert
 *   4 Open Questions has at least one task-list item
 *   5 Coverage Map table integrity (rows, citations, completeness)
 *   6 TC numbering sequential per lane
 *   7 granularity, structural half (one Expected Result, >=1 step)
 *   8 Source Case Sweep, structural half (when present)
 *
 * lintDraft(text, {baseline}) never throws on draft content; it
 * returns { failures, counters, warn } — failures is the list of
 * failed assertion labels (empty = PASS), counters mirrors the
 * Python COUNTS line, warn is the under-floor warning (never a
 * failure, exactly as the Python never gates on it).
 *
 * `groundDraft` (v1.1, phase 2 of Local_TestPlanGen_Plan.md) — the
 * GROUNDING layer, possible only locally because the job holds the
 * story it just sent: heuristic spot-checks of the draft against
 * STORY TEXT + StoryMeta. Deliberately NOT part of the Python
 * contract and excluded from the agreement leg; findings carry a
 * "grounding: " prefix so a reviewer can tell the layers apart.
 * Three checks, each conservative by design (they WILL flag some
 * legitimate paraphrases — which is why the job's default verify
 * policy annotates rather than refuses):
 *   a) every Coverage Map requirement cell must trace to the story —
 *      a quoted span found verbatim passes outright; otherwise at
 *      least half the cell's content-word stems must appear in the
 *      story (probable-invention flag otherwise);
 *   b) tool-shaped names (multi-word Title Case phrases) in Steps /
 *      Expected Result lines must appear in the story — the prompt's
 *      tools rule, made checkable. Section/terminology phrases are
 *      allowlisted; Trace lines and the Source Case Sweep are NOT
 *      scanned (they legitimately cite source-plan titles). Note:
 *      the plan sketched a cites-a-reference exception, dropped here
 *      deliberately — the prompt's tools rule admits no tool names
 *      from reference documents at all;
 *   c) enumeration echo: a comma/and list of 3+ short items in a
 *      workflow-shaped story sentence must have every item mentioned
 *      somewhere in the draft (a cheap ENUMERATION COVERAGE screen).
 */

const CORE_SECTIONS = [
  "## Overview",
  "## Setup / Prerequisites",
  "## Positive Tests",
  "## Negative Tests",
  "## Open Questions",
];

// segment up to the next "\n## " (the Python re.split(r'\n## ', s, 1)[0])
function untilNextH2(segment) {
  const i = segment.indexOf("\n## ");
  return i < 0 ? segment : segment.slice(0, i);
}

// the Python case regex: ^### (TC-[PN]\d+)[^\n]*\n(.*?)(?=^###? |\Z)
// — a case body runs to the next line starting "## " or "### ".
function extractCases(text) {
  const heads = [];
  const headRe = /^### (TC-[PN]\d+)[^\n]*\n/gm;
  let m;
  while ((m = headRe.exec(text))) {
    heads.push({ id: m[1], bodyStart: m.index + m[0].length });
  }
  const bounds = [];
  const boundRe = /^###? /gm;
  while ((m = boundRe.exec(text))) bounds.push(m.index);
  return heads.map((h) => {
    const next = bounds.find((p) => p >= h.bodyStart);
    return [h.id, text.slice(h.bodyStart, next === undefined ? text.length : next)];
  });
}

// GFM data rows of the table inside `segment`: lines starting with
// '|' carrying at least minPipes pipes, minus the header pair and any
// separator rows (the Python rows[2:] + separator filter).
function tableDataRows(segment, minPipes) {
  const rows = segment
    .split("\n")
    .filter((l) => l.trim().startsWith("|") && (l.match(/\|/g) || []).length >= minPipes);
  return rows.slice(2).filter((r) => !/^\|[\s\-|:]+\|$/.test(r.trim()));
}

const cells = (row) =>
  row.trim().replace(/^\|+|\|+$/g, "").split("|").map((c) => c.trim());

export function lintDraft(text, { baseline = false } = {}) {
  const failures = [];
  const check = (cond, label) => {
    if (!cond) failures.push(label);
  };

  // 1 — section order
  const core = baseline ? CORE_SECTIONS : [...CORE_SECTIONS, "## Coverage Map"];
  let pos = -1;
  let ordered = true;
  for (const h of core) {
    let p = text.indexOf(h + "\n");
    if (p < 0) p = text.indexOf(h); // tolerate EOF / trailing spaces
    check(p >= 0, `section present: ${h}`);
    if (p >= 0 && p < pos) ordered = false;
    if (p >= 0) pos = p;
  }
  check(ordered, "core sections in order");
  for (const condH of ["## Automation Notes", "## Documentation Impacts"]) {
    const at = text.indexOf(condH);
    if (at >= 0) {
      const body = untilNextH2(text.slice(at + condH.length));
      check(/^\s*[-*] /m.test(body), `conditional section non-empty: ${condH}`);
    }
  }

  // 2 — every case has a Trace line; 7 — granularity (structural)
  const tcCases = extractCases(text);
  check(tcCases.length > 0, "at least one TC case found");
  let nSteps = 0;
  for (const [cid, body] of tcCases) {
    check(body.includes("**Trace:**"), `${cid} carries a **Trace:** line`);
    nSteps += (body.match(/^\s*- \[[ x]\]/gm) || []).length;
    if (!baseline) {
      check(
        body.split("**Expected Result:**").length - 1 === 1,
        `${cid} has exactly one **Expected Result:** line`
      );
      check(/^\s*- \[[ x]\]/m.test(body), `${cid} has at least one Steps checkbox`);
    }
  }
  const draftIds = new Set(tcCases.map(([cid]) => cid));

  // 3 — CAUTION alert heads Negative Tests
  const negAt = text.indexOf("## Negative Tests");
  check(
    negAt >= 0 &&
      text.slice(negAt + "## Negative Tests".length).replace(/^\s+/, "").startsWith("> [!CAUTION]"),
    "Negative Tests opens with the CAUTION alert"
  );

  // 4 — Open Questions non-empty
  const oqAt = text.indexOf("## Open Questions");
  const oq = oqAt >= 0 ? untilNextH2(text.slice(oqAt + "## Open Questions".length)) : "";
  check(/^\s*- \[[ x]\]/m.test(oq), "Open Questions has at least one task-list item");

  // 5 — Coverage Map table
  let mapRows = [];
  if (!baseline) {
    const cmAt = text.indexOf("## Coverage Map");
    const cm = cmAt >= 0 ? untilNextH2(text.slice(cmAt + "## Coverage Map".length)) : "";
    mapRows = tableDataRows(cm, 3);
    check(mapRows.length >= 1, "Coverage Map has at least one data row");
    const citedIds = new Set();
    mapRows.forEach((row, idx) => {
      const i = idx + 1;
      const cs = cells(row);
      const covered = cs.length ? cs[cs.length - 1] : "";
      const idsInCell = new Set(covered.match(/TC-[PN]\d+/g) || []);
      for (const cid of idsInCell) citedIds.add(cid);
      check(
        idsInCell.size > 0 || covered.includes("Open Questions"),
        `Coverage Map row ${i}: Covered by cites a case or Open Questions`
      );
      for (const cid of idsInCell) {
        check(draftIds.has(cid), `Coverage Map row ${i}: cited ${cid} exists in draft`);
      }
    });
    for (const cid of [...draftIds].sort()) {
      if (!citedIds.has(cid)) check(false, `${cid} appears in no Coverage Map row`);
    }
  }

  // 8 — Source Case Sweep (structural, v1.7; presence is
  // lane-dependent so absence alone never fails)
  let sweepRows = [];
  if (!baseline && text.includes("## Source Case Sweep")) {
    const oqPos = text.indexOf("## Open Questions");
    const swPos = text.indexOf("## Source Case Sweep");
    const cmPos = text.indexOf("## Coverage Map");
    check(
      oqPos >= 0 && oqPos < swPos && (cmPos < 0 || swPos < cmPos),
      "Source Case Sweep sits between Open Questions and Coverage Map"
    );
    const sw = untilNextH2(text.slice(swPos + "## Source Case Sweep".length));
    sweepRows = tableDataRows(sw, 4);
    check(sweepRows.length >= 1, "Source Case Sweep has at least one data row");
    sweepRows.forEach((row, idx) => {
      const i = idx + 1;
      const cs = cells(row);
      const verdict = (cs.length >= 4 ? cs[2] : "").replace(/^\*+|\*+$/g, "");
      const outcome = cs.length >= 4 ? cs[3] : "";
      const v = verdict.toLowerCase();
      check(["yes", "no", "verify"].includes(v), `Sweep row ${i}: Applies? is Yes / No / Verify`);
      if (v === "yes") {
        const idsInCell = new Set(outcome.match(/TC-[PN]\d+/g) || []);
        check(idsInCell.size > 0, `Sweep row ${i}: Yes row cites a TC id`);
        for (const cid of idsInCell) {
          check(draftIds.has(cid), `Sweep row ${i}: cited ${cid} exists in draft`);
        }
      } else if (v === "verify") {
        check(outcome.includes("Open Questions"), `Sweep row ${i}: Verify row cites Open Questions`);
      } else if (v === "no") {
        check(outcome !== "", `Sweep row ${i}: No row states a reason`);
      }
    });
  }

  // 6 — sequential numbering per lane
  for (const lane of ["P", "N"]) {
    const nums = [];
    const re = new RegExp(`^### TC-${lane}(\\d+)`, "gm");
    let m;
    while ((m = re.exec(text))) nums.push(Number(m[1]));
    // an empty lane passes, as in the Python ([] == range(1, 1))
    check(
      nums.join(",") === Array.from({ length: nums.length }, (_, k) => k + 1).join(","),
      `TC-${lane}* numbered sequentially from 1`
    );
  }

  // counters (never gate) — the Python COUNTS line, field for field
  const nPos = (text.match(/^### TC-P\d+/gm) || []).length;
  const nNeg = (text.match(/^### TC-N\d+/gm) || []).length;
  const counters = {
    positive: nPos,
    negative: nNeg,
    verify: (text.match(/\[VERIFY[:\]]/g) || []).length,
    mapRows: mapRows.length,
    stepsPerCase: tcCases.length ? nSteps / tcCases.length : 0,
    sweepRows: sweepRows.length,
    chars: text.length,
  };
  return { failures, counters, warn: nPos < 4 || nNeg < 3 };
}

// ---- grounding layer (v1.1) -----------------------------------------

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with",
  "from", "its", "is", "are", "was", "were", "be", "been", "must",
  "shall", "should", "that", "this", "these", "those", "when", "where",
  "each", "per", "via", "as", "by", "at", "it", "not", "no", "any",
  "all", "one", "two", "section", "slide", "statement", "requirement",
  "criterion", "workflow", "story",
]);

function normText(s) {
  return String(s)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// crude, shared stemmer — only strong enough for overlap counting
function stem(w) {
  for (const suf of ["ing", "ion", "ed", "es", "s"]) {
    if (w.length > suf.length + 2 && w.endsWith(suf)) return w.slice(0, -suf.length);
  }
  return w;
}

function contentStems(s) {
  const out = new Set();
  for (const w of normText(s).split(" ")) {
    if (w.length >= 3 && !STOPWORDS.has(w)) out.add(stem(w));
  }
  return out;
}

// a stem matches when present, or when it prefixes / is prefixed by a
// story stem (>= 4 chars both ways — "route"/"routes", "lock"/"locked")
function stemMatches(t, storyStems) {
  if (storyStems.has(t)) return true;
  if (t.length < 4) return false;
  for (const s of storyStems) {
    if (s.length >= 4 && (s.startsWith(t) || t.startsWith(s))) return true;
  }
  return false;
}

// phrases the tools check must never flag: draft-shape terms + the
// prompt's ESRI terminology (official product casing)
const TOOL_ALLOW = new Set([
  "arcgis pro", "arcgis server", "experience builder",
  "roads and highways", "pipeline referencing", "utility network",
  "location referencing", "linear referencing", "lrs network",
  "stay put", "dynamic seg", "dynamic segmentation", "attribute table",
  "test plan", "user story", "design spike", "coverage map",
  "open questions", "source case sweep", "expected result",
  "negative tests", "positive tests", "automation notes",
  "documentation impacts", "target release", "related digest",
  "reference functionality", "story text",
].map(normText));

// leading function/verb words trimmed off a matched Title Case phrase
// ("Run Merge Routes" -> "Merge Routes")
const LEAD_TRIM = new Set([
  "The", "A", "An", "As", "Run", "Use", "Using", "Open", "In", "On",
  "At", "For", "With", "From", "To", "And", "Or", "Inspect", "Attempt",
  "Select", "Click", "Do", "Verify", "Confirm", "Then", "Repeat",
]);

/**
 * Heuristic grounding spot-checks of a draft against its own story
 * (storyCorpus = the capped STORY TEXT + the composed StoryMeta).
 * Returns "grounding: ..."-prefixed finding strings; never throws on
 * content, never edits anything.
 */
export function groundDraft(draftText, storyCorpus) {
  const findings = [];
  const draft = String(draftText);
  const normDraft = " " + normText(draft) + " ";
  const normStory = " " + normText(storyCorpus) + " ";
  const storyStems = contentStems(storyCorpus);

  // a) Coverage Map requirements must trace to the story
  const cmAt = draft.indexOf("## Coverage Map");
  if (cmAt >= 0) {
    const cm = untilNextH2(draft.slice(cmAt + "## Coverage Map".length));
    tableDataRows(cm, 3).forEach((row, idx) => {
      const cs = cells(row);
      const reqCell = (cs.length >= 3 ? cs[1] : cs.join(" ")).replace(/\([^)]*\)/g, " ");
      const quoted = [...reqCell.matchAll(/"([^"]{4,})"/g)].map((m) => m[1]);
      if (quoted.some((q) => normStory.includes(normText(q)))) return;
      const stems = [...contentStems(reqCell)];
      if (stems.length === 0) return; // nothing checkable
      const hit = stems.filter((t) => stemMatches(t, storyStems)).length;
      if (hit / stems.length < 0.5) {
        findings.push(
          `grounding: Coverage Map row ${idx + 1} requirement not traceable to the story (probable invention)`
        );
      }
    });
  }

  // b) tool-shaped names in Steps / Expected Result lines must appear
  // in the story (the tools rule). Trace lines and the Source Case
  // Sweep legitimately cite source-plan titles, so only tester-facing
  // lines are scanned.
  const scanLines = draft
    .split("\n")
    .filter((l) => /^\s*- \[[ x]\]/.test(l) || l.trimStart().startsWith("**Expected Result:**"));
  const flaggedTools = new Set();
  for (const line of scanLines) {
    for (const m of line.matchAll(/\b[A-Z][a-z]+(?: [A-Z][a-z]+)+\b/g)) {
      const parts = m[0].split(" ");
      while (parts.length > 2 && LEAD_TRIM.has(parts[0])) parts.shift();
      if (parts.length >= 2 && LEAD_TRIM.has(parts[0])) parts.shift();
      if (parts.length < 2) continue;
      const phrase = parts.join(" ");
      const key = normText(phrase);
      if (TOOL_ALLOW.has(key) || flaggedTools.has(key)) continue;
      if (normStory.includes(" " + key + " ")) continue;
      flaggedTools.add(key);
      if (flaggedTools.size <= 10) {
        findings.push(
          `grounding: tool-like name "${phrase}" appears in no story statement (the tools rule)`
        );
      }
    }
  }

  // c) enumeration echo: 3+-item lists in workflow-shaped story
  // sentences must each be mentioned somewhere in the draft
  const CUES = /via|workflow|pathway|edit|method|event|type|tool|using|route/;
  const storyBody = String(storyCorpus)
    .replace(/<!--\s*metadata[\s\S]*?-->/g, " ")
    .replace(/```yaml[\s\S]*?```/g, " ");
  const seenItems = new Set();
  for (const rawLine of storyBody.split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("|") || line.includes("](")) continue;
    if (/^[a-z_]+:\s/.test(line)) continue; // yaml-ish metadata lines
    if (!CUES.test(line.toLowerCase())) continue;
    for (const sentence of line.split(/(?<=[.!?])\s+/)) {
      const scope = sentence.includes(":") ? sentence.slice(sentence.indexOf(":") + 1) : sentence;
      let items = scope
        .split(/\s*,\s*(?:and\s+|&\s+)?|\s+and\s+|\s+&\s+/)
        .map((it) => it.trim().replace(/[.!?]+$/, ""))
        .filter((it) => it !== "");
      if (items.length >= 3 && items[0].split(" ").length > 4) {
        // the first item usually carries the sentence's leading
        // clause — keep only what follows the last cue-ish word
        const tail = items[0].match(/.*\b(?:via|using|through|include(?:s)?|are|of|for)\s+(.+)$/i);
        if (tail && tail[1].split(" ").length <= 4) items[0] = tail[1];
        else items = items.slice(1);
      }
      if (items.length < 3 || items.length > 8) continue;
      const valid = items.every(
        (it) =>
          /^[A-Za-z]/.test(it) && !/[.!?]/.test(it) &&
          it.split(" ").length <= 4 &&
          it.split(" ").some((w) => w.length >= 3)
      );
      if (!valid) continue;
      for (const it of items) {
        const key = normText(it);
        if (seenItems.has(key)) continue;
        seenItems.add(key);
        if (!normDraft.includes(" " + key + " ")) {
          findings.push(
            `grounding: enumerated item "${it}" appears nowhere in the draft (possible ENUMERATION COVERAGE miss)`
          );
        }
      }
    }
  }

  return findings;
}
