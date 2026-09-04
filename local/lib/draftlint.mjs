/**
 * draftlint.mjs v1.0 — in-process port of the TestPlanGen draft
 * coverage lint (review/harness/check_draft_coverage.py, v1.7
 * contract) for local/testplangen.mjs. The Python lint stays the
 * harness AUTHORITY; this port exists so the generation job can
 * verify a draft BEFORE writing it without a Python dependency at
 * run time. check_testplangen.py's agreement leg runs both over
 * shared fixtures and fails on any verdict or failure-label
 * divergence — keep the two in lockstep: a contract change edits the
 * Python first, then mirrors here (labels verbatim).
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
