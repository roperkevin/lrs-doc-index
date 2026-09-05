/**
 * casegrammar.mjs — the `testplan/v1` body profile and the six
 * deterministic case detectors (Sidecar_Format_Plan §4.3/§4.4, phase 3).
 *
 * Input: a test plan's TIDIED body (tidyBody output — `## Slide N`
 * / `## Slide N — title` sections for decks, `##`/`###` headings for
 * docx, `## Sheet: X` for workbooks). Output: the same content
 * re-organised into ONE case grammar shared with TestPlanGen drafts:
 *
 *   ## Overview                      (units before the first case unit)
 *   ### Slide 1 — Scope <!-- slide 1 -->
 *   …
 *   ## Test Cases
 *   ### TC-P01 — <title> <!-- src: S4 · slide 1 · Positive Tests: Normal Routes · 1 -->
 *   - **Group:** Normal Routes
 *   - **Case:** <full case line when the title was shortened>
 *   - **Expected Result:** …          (when the source had one)
 *   <the case's own tables, figures, text>
 *   …
 *   ## Other content                 (units after the first case unit that hold no case)
 *
 * Every case heading carries a provenance comment naming the detector
 * and the source (slide / table row / label / paragraph), so every
 * catalog row is auditable. Ids are per-lane sequences (P/N/U), the
 * draft contract's form. A body with no detectable case is returned
 * UNCHANGED (shape "none") — nothing is guessed; the audit lists it.
 *
 * Detectors, in precedence order per unit (a unit is one heading and
 * its lines): S0 pass-through (a body already in the grammar), S2
 * titled case slide, S3 case table, S4 Positive/Negative label + list,
 * S5 other label + list (one case per label, bullets as steps; stoplist
 * labels stay prose), S1 single-numbered case slide (caseHeadings'
 * rules a/b), S6 numbered case lines under a Positive/Negative context.
 * Confidence: S0/S1/S2/S3 high, S4 high, S5/S6 medium.
 *
 * Decisions recorded 2026-09-05: per-bullet cases under Positive /
 * Negative labels, one case per label elsewhere; per-plan TC ids.
 */

export const PROFILE = "testplan/v1";
export const DETECTORS = ["S0", "S1", "S2", "S3", "S4", "S5", "S6"];
export const CONFIDENCE = { S0: "high", S1: "high", S2: "high", S3: "high", S4: "high", S5: "medium", S6: "medium", draft: "high", deck: "high" };

const TITLE_MAX = 80;
const STOPLIST = /^(notes?|test notes|general notes|environments?|test environments?( & data)?|data|test data|scope|in scope|out of scope|objectives?|background|summary|assumptions?|pre-?requisites?|setup|references?|resources|automation( notes)?|documentation( impacts)?|assignment|schedule|open questions?|coverage map|tools?|story points?|dev|pe)$/i;
const POSNEG = /^(positive|negative)\b/i;

// ---- small helpers ----------------------------------------------------

const isHeading = (s) => /^#{2,6} /.test(s);
const isBullet = (s) => /^\s*- /.test(s);
const isTableRow = (s) => /^\|.*\|\s*$/.test(s.trim());
const isSep = (s) => /^\|[\s:|-]+\|\s*$/.test(s.trim());
const isFigure = (s) => /^\s*(!\[|\[figure:)/.test(s);
const stripComments = (s) => String(s).replace(/<!--[\s\S]*?-->/g, "").trim();
/** Heading-safe text: angle brackets would render as HTML (and break
 *  the src comment's parse), "--" would end an HTML comment early. */
const headSafe = (s) => String(s).replace(/</g, "‹").replace(/>/g, "›").replace(/-{2,}/g, "-");
const srcSafe = (s) => String(s).replace(/[<>]/g, "").replace(/-{2,}/g, "-").replace(/\s+/g, " ").trim();

function clean(s) {
  return stripComments(s)
    .replace(/^\*\*(.*)\*\*$/, "$1")
    .replace(/[|#]/g, " ")
    .replace(/\s*[-–—,]?\s*current date\s*:.*$/i, "")
    .replace(/\s*:\s*/g, ": ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[\s\-–—,:;]+$/, "");
}

/** Short title: cut at the last phrase break inside the budget, else a word boundary. */
export function shortTitle(t) {
  const s = clean(t);
  if (s.length <= TITLE_MAX) return s;
  const head = s.slice(0, TITLE_MAX + 1);
  let cut = -1;
  const re = /[,;:]\s|\s[-–—]\s|\s\(/g;
  for (let m; (m = re.exec(head)) !== null; ) cut = m.index;
  if (cut < 16) cut = head.lastIndexOf(" ");
  if (cut < 16) cut = TITLE_MAX;
  let out = head.slice(0, cut).replace(/[\s\-–—,:;(]+$/, "");
  // never end a title on a connector word
  for (;;) {
    const m = /\s(and|or|the|a|an|of|to|in|for|with|are|is|be|on|at|by|that|when|if)$/i.exec(out);
    if (!m) break;
    out = out.slice(0, m.index).replace(/[\s\-–—,:;(]+$/, "");
  }
  return out;
}

const SMALL = /^(a|an|and|as|at|but|by|for|in|nor|of|on|or|per|the|via|with)$/;
function titleCase(t) {
  return clean(t)
    .replace(/\s([-–—])(?=\S)/g, " $1 ")
    .replace(/(\S)([–—]) /g, "$1 $2 ")
    .replace(/\s*\/\s*/g, " / ")
    .split(" ")
    .map((w, k) => (!/^[a-z]/.test(w) ? w : k > 0 && SMALL.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/** The case line's scenario: text minus split-measure tails, route ids, a generic "Route –" lead. */
function scenarioOf(t) {
  return clean(
    String(t)
      .replace(/[\s\-–—,:]*\bsplit(?:ting)?\s+measures?\b[\s\S]*$/i, "")
      .replace(/\(?\bR\d+(?:L\d+)?\b\)?/g, " ")
      .replace(/^\s*Routes?\s*[-–—]\s*(?=\S)/i, "")
  );
}

function laneOf(text) {
  const t = String(text || "");
  if (/\bnegative\b/i.test(t)) return "N";
  if (/\bpositive\b/i.test(t)) return "P";
  return "U";
}

/** "Positive Tests: Normal Routes" → { lane: "P", group: "Normal Routes" };
 *  "Negative - Line network" → { lane: "N", group: "Line Network" } */
function labelParts(label) {
  const s = clean(label);
  const lane = laneOf(s);
  let group = s.replace(/^(positive|negative)\s*(tests?|cases?|test cases)?\s*[:\-–—]?\s*/i, "").trim();
  if (/^\(.*\)$/.test(group)) group = group.slice(1, -1);
  return { lane, group: group ? titleCase(group) : "" };
}

// ---- units --------------------------------------------------------------

/** Split the body into heading-led units; each carries its slide number. */
function splitUnits(lines) {
  const units = [];
  let cur = null;
  let slideNo = 0;
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const hm = /^(#{2,6}) (.*)$/.exec(ln);
    if (hm) {
      const text = stripComments(hm[2]);
      const sm = /^Slide (\d+)(?:\s+—\s+(.*))?$/.exec(text);
      if (sm) slideNo = parseInt(sm[1], 10);
      const sheet = /^Sheet: (.*)$/.exec(text);
      cur = {
        level: hm[1].length, headingLine: ln, text,
        isSlide: !!sm, slideNo,
        title: sm ? (sm[2] || "") : text,
        isNotes: /^Notes\b/i.test(text), isSheet: !!sheet,
        sheet: sheet ? sheet[1] : "",
        start: i, lines: [],
      };
      units.push(cur);
      continue;
    }
    if (!cur) {
      cur = { level: 0, headingLine: "", text: "", isSlide: false, slideNo: 0, title: "", isNotes: false, isSheet: false, sheet: "", start: i, lines: [] };
      units.push(cur);
    }
    cur.lines.push(ln);
  }
  return units;
}

/** Tables inside a unit: [{ at, end, header[], rows[][] }] (line indexes into unit.lines). */
function tablesOf(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!isTableRow(lines[i]) || !(i + 1 < lines.length && isSep(lines[i + 1]))) continue;
    const cells = (s) => s.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim());
    const header = cells(lines[i]);
    let j = i + 2;
    const rows = [];
    while (j < lines.length && isTableRow(lines[j]) && !isSep(lines[j])) { rows.push(cells(lines[j])); j++; }
    out.push({ at: i, end: j, header, rows });
    i = j - 1;
  }
  return out;
}

// ---- detectors ----------------------------------------------------------

const ID_COL = /^(#|no\.?|id|tc|test\s*case(?:\s*(?:#|id|no\.?))?|case(?:\s*(?:#|id|no\.?))?)$/i;
const DESC_COL = /^(test|tests|test\s*description|description|scenario|case description|test scenario|steps?|action|test steps?|what to test|verify)$/i;
const EXP_COL = /^(expected(?:\s*results?)?|result|results|response|outcome|expected outcome|expected behaviou?r)$/i;

/** S3 — case tables: an id column and/or a description + expected column. */
function detectS3(unit, ctxLane) {
  const cases = [];
  const consumed = new Set();
  for (const t of tablesOf(unit.lines)) {
    const h = t.header.map((c) => stripComments(c).replace(/\*\*/g, "").replace(/\s+/g, " ").trim().toLowerCase());
    const idCol = h.findIndex((c) => ID_COL.test(c));
    let descCol = h.findIndex((c, k) => k !== idCol && DESC_COL.test(c));
    const expCol = h.findIndex((c, k) => k !== idCol && k !== descCol && EXP_COL.test(c));
    if (idCol < 0 && !(descCol >= 0 && expCol >= 0)) continue;
    if (descCol < 0) descCol = h.findIndex((c, k) => k !== idCol && k !== expCol && c !== "");
    if (descCol < 0) continue;
    // a label line right above the table sets the lane/group
    let lane = ctxLane, group = "";
    for (let k = t.at - 1; k >= 0 && k >= t.at - 3; k--) {
      const s = stripComments(unit.lines[k]);
      if (s === "") continue;
      if (POSNEG.test(clean(s))) { const lp = labelParts(s); lane = lp.lane; group = lp.group; }
      break;
    }
    for (let r = 0; r < t.rows.length; r++) {
      const row = t.rows[r];
      const desc = (row[descCol] || "").replace(/<br>/g, "; ").trim();
      if (!desc) continue;
      const id = idCol >= 0 ? (row[idCol] || "").trim() : "";
      const rowLane = lane !== "U" ? lane : laneOf(desc + " " + id);
      const body = [];
      if (id) body.push(`- **ID:** ${id}`);
      if (group) body.push(`- **Group:** ${group}`);
      const title = shortTitle(desc);
      if (title.toLowerCase() !== clean(desc).toLowerCase()) body.push(`- **Case:** ${clean(desc)}`);
      if (expCol >= 0 && (row[expCol] || "").trim()) {
        body.push(`- **Expected Result:** ${(row[expCol] || "").replace(/<br>/g, "; ").trim()}`);
      }
      for (let c = 0; c < t.header.length; c++) {
        if (c === idCol || c === descCol || c === expCol) continue;
        const v = (row[c] || "").replace(/<br>/g, "; ").trim();
        const hdr = stripComments(t.header[c]).replace(/\*\*/g, "").trim();
        if (v && hdr) body.push(`- **${hdr}:** ${v}`);
      }
      cases.push({
        det: "S3", lane: rowLane, title, group,
        src: [`slide ${unit.slideNo}`, "table", id || `row ${r + 1}`].filter((x) => x !== "slide 0"),
        body, order: unit.start + t.at + r / 1000,
      });
    }
    for (let k = t.at; k < t.end; k++) consumed.add(k);
  }
  return { cases, consumed };
}

/** The list right after line k (blank lines allowed between items): [start, end) or null. */
function listAfter(lines, k) {
  let j = k + 1;
  while (j < lines.length && lines[j].trim() === "") j++;
  if (j >= lines.length || !isBullet(lines[j])) return null;
  const start = j;
  let end = j;
  while (j < lines.length) {
    if (isBullet(lines[j])) { end = j + 1; j++; continue; }
    if (lines[j].trim() === "" && j + 1 < lines.length && isBullet(lines[j + 1])) { j++; continue; }
    break;
  }
  return [start, end];
}

/** Top-level items of a list slice, each with its nested lines. */
function listItems(lines, start, end) {
  const items = [];
  for (let j = start; j < end; j++) {
    const m = /^(\s*)- (.*)$/.exec(lines[j]);
    if (!m) continue;
    if (m[1].length === 0 || items.length === 0) items.push({ at: j, text: m[2], nested: [] });
    else items[items.length - 1].nested.push(lines[j]);
  }
  return items;
}

/** S4 / S5 — a label (bold line, ### heading, "Label:" line, or a
 *  Positive/Negative line, or the unit's own title) followed by a list. */
function detectLabels(unit, ctxLane) {
  const cases = [];
  const consumed = new Set();
  const L = unit.lines;
  const tryLabel = (labelText, k, det) => {
    const rng = listAfter(L, k);
    if (!rng) return false;
    const label = clean(labelText);
    if (!label) return false;
    const items = listItems(L, rng[0], rng[1]);
    if (!items.length) return false;
    if (POSNEG.test(label)) {
      const lp = labelParts(label);
      items.forEach((it, n) => {
        const title = shortTitle(it.text);
        const body = [];
        if (lp.group) body.push(`- **Group:** ${lp.group}`);
        if (title.toLowerCase() !== clean(it.text).toLowerCase()) body.push(`- **Case:** ${clean(it.text)}`);
        cases.push({
          det: "S4", lane: lp.lane, title, group: lp.group,
          src: [`slide ${unit.slideNo}`, label, String(n + 1)].filter((x) => x !== "slide 0"),
          body: body.concat(it.nested.map((s) => s.replace(/^\s{2}/, ""))), order: unit.start + it.at,
        });
      });
    } else {
      if (STOPLIST.test(label.replace(/:$/, "").trim()) || items.length < 2) return false;
      const steps = [];
      items.forEach((it, n) => {
        steps.push(`${n + 1}. ${clean(it.text)}`);
        for (const s of it.nested) steps.push("   " + s.trim());
      });
      cases.push({
        det: "S5", lane: ctxLane, title: shortTitle(label.replace(/:$/, "")), group: "",
        src: [`slide ${unit.slideNo}`, `label ${label.replace(/:$/, "")}`].filter((x) => x !== "slide 0"),
        body: ["**Steps:**", ...steps], order: unit.start + k,
      });
    }
    if (k >= 0) consumed.add(k);
    for (let j = rng[0]; j < rng[1]; j++) consumed.add(j);
    return true;
  };
  for (let k = 0; k < L.length; k++) {
    if (consumed.has(k)) continue;
    const raw = L[k];
    const s = stripComments(raw);
    if (s === "" || isBullet(raw) || isTableRow(raw) || isFigure(raw) || /^```/.test(s)) continue;
    const bold = /^\*\*(.+)\*\*$/.exec(s);
    const label = bold ? bold[1] : s;
    if (label.length > 80) continue;
    if (bold || /:$/.test(label) || POSNEG.test(label) || (unit.level >= 3 && k === -1)) {
      tryLabel(label, k, bold ? "bold" : "line");
    }
  }
  // the unit heading itself as the label (docx "### Negative Tests:" or a
  // slide titled "Positive Tests" whose body is the list)
  if (!cases.length && unit.headingLine && (POSNEG.test(unit.title) || (unit.level >= 3 && !unit.isNotes))) {
    const first = L.findIndex((x) => x.trim() !== "");
    if (first >= 0 && isBullet(L[first])) tryLabel(unit.title, -1, "heading");
  }
  return { cases, consumed };
}

const CASE_TITLE = /^(?:(?:test\s*)?case|scenario|tc)\s*#?\s*(\d+[a-z]?)\s*[:.)\-–—]?\s*(.*)$/i;
const NUM_TITLE = /^(\d{1,3}[a-z]?)[.)]\s+(.+)$/;

/** S2 — the slide title names the case. */
function detectS2(unit, ctxLane) {
  if (!unit.isSlide || !unit.title) return null;
  const t = clean(unit.title);
  const m = CASE_TITLE.exec(t) || NUM_TITLE.exec(t);
  if (!m) return null;
  const num = m[1];
  let rest = clean(m[2] || "");
  const firstText = unit.lines.map(stripComments).find((s) => s && !isTableRow(s) && !isFigure(s) && !isBullet(s));
  if (!rest && firstText) rest = clean(firstText);
  const lane = laneOf(t) !== "U" ? laneOf(t) : laneOf(unit.lines.slice(0, 3).join(" ")) !== "U" ? laneOf(unit.lines.slice(0, 3).join(" ")) : ctxLane;
  const title = shortTitle(scenarioOf(rest) || rest || `Case ${num}`);
  const body = [];
  if (rest && title.toLowerCase() !== rest.toLowerCase()) body.push(`- **Case:** ${rest}`);
  return {
    det: "S2", lane, title, group: "",
    src: [`slide ${unit.slideNo}`, `case ${num}`],
    body: body.concat(unit.lines), order: unit.start,
  };
}

/** Candidate content lines of a unit (no tables, figures, fences, bullets-as-lists kept). */
function cands(lines) {
  const out = [];
  let fenced = false;
  for (let j = 0; j < lines.length; j++) {
    const s = lines[j].trim();
    if (s.startsWith("```")) { fenced = !fenced; continue; }
    if (fenced || s === "" || s.charAt(0) === "|" || isFigure(s)) continue;
    out.push({ at: j, s: stripComments(s) });
  }
  return out;
}

/** S1 — caseHeadings' rules a/b: one numbered case line (or a
 *  classification line + one digit-bearing case line) on a slide. */
function detectS1(unit, ctxLane) {
  if (!unit.isSlide) return null;
  const cs = cands(unit.lines);
  const numbered = [];
  for (const c of cs) {
    const m = /^(?:- )?(\d{1,3})[.)]\s+(.*)$/.exec(c.s);
    if (m && /[A-Za-z]/.test(m[2])) numbered.push({ at: c.at, num: m[1], text: m[2] });
  }
  const classCand = cs.find((c) => POSNEG.test(c.s.replace(/^- /, "")) && c.s.length <= 100) || null;
  let caseFull = "", num = "", caseAt = -1;
  if (numbered.length === 1) {
    caseFull = clean(numbered[0].text); num = numbered[0].num; caseAt = numbered[0].at;
  } else if (numbered.length === 0 && classCand) {
    for (const c of cs) {
      const s = c.s.replace(/^- /, "");
      if (POSNEG.test(s) || /^(current date\b|modify\b)/i.test(s)) continue;
      if (s.length > 100 || !/\d/.test(s)) continue;
      caseFull = clean(s); caseAt = c.at;
      break;
    }
  }
  if (!caseFull) return null;
  const lp = classCand ? labelParts(classCand.s.replace(/^- /, "")) : { lane: ctxLane, group: "" };
  const scen = scenarioOf(caseFull);
  let title = shortTitle(scen || caseFull);
  if (!title) title = caseFull;
  // TC-3 (v1.29): no route id or split measure in a heading — the full
  // line rides as the Case line
  const body = [];
  if (lp.group && lp.group.toLowerCase() !== titleCase(title).toLowerCase()) body.push(`- **Group:** ${lp.group}`);
  if (title.toLowerCase() !== caseFull.toLowerCase()) body.push(`- **Case:** ${caseFull}`);
  const tail = /(current date\s*:\s*\S.*)$/i.exec(unit.lines[caseAt] || "");
  if (tail) body.push(tail[1].charAt(0).toUpperCase() + tail[1].slice(1));
  const rest = unit.lines.filter((_, j) => j !== caseAt && !(classCand && j === classCand.at));
  return {
    det: "S1", lane: lp.lane, title: titleCase(title), group: lp.group,
    src: [`slide ${unit.slideNo}`, num ? `case ${num}` : "case"],
    body: body.concat(rest), order: unit.start,
  };
}

/** S6 — several numbered case lines on a slide under a Positive /
 *  Negative context; content between them rides with each case. */
function detectS6(unit, ctxLane) {
  const cs = cands(unit.lines);
  const numbered = [];
  for (const c of cs) {
    const m = /^(?:- )?(\d{1,3}[a-z]?)[.)]\s+(.*)$/.exec(c.s);
    if (m && /[A-Za-z]/.test(m[2]) && !/^(verify|ensure|check|confirm|validate|test)\b/i.test(m[2])) {
      numbered.push({ at: c.at, num: m[1], text: m[2] });
    }
  }
  if (numbered.length < 2) return null;
  const ctxLine = cs.find((c) => POSNEG.test(c.s.replace(/^- /, "")) && c.s.length <= 100);
  const lane = laneOf(unit.title) !== "U" ? laneOf(unit.title) : ctxLine ? laneOf(ctxLine.s) : ctxLane;
  if (lane === "U") return null; // a checklist, not cases
  const group = ctxLine ? labelParts(ctxLine.s.replace(/^- /, "")).group : (POSNEG.test(unit.title) ? labelParts(unit.title).group : "");
  const cases = [];
  const consumed = new Set();
  if (ctxLine) consumed.add(ctxLine.at);
  for (let n = 0; n < numbered.length; n++) {
    const it = numbered[n];
    const end = n + 1 < numbered.length ? numbered[n + 1].at : unit.lines.length;
    const full = clean(it.text);
    const title = shortTitle(scenarioOf(full) || full);
    const body = [];
    if (group) body.push(`- **Group:** ${group}`);
    if (title.toLowerCase() !== full.toLowerCase()) body.push(`- **Case:** ${full}`);
    for (let j = it.at + 1; j < end; j++) { body.push(unit.lines[j]); consumed.add(j); }
    consumed.add(it.at);
    cases.push({
      det: "S6", lane, title: titleCase(title), group,
      src: [`slide ${unit.slideNo}`, `case ${it.num}`].filter((x) => x !== "slide 0"),
      body, order: unit.start + it.at,
    });
  }
  return { cases, consumed };
}

// ---- the renderer -------------------------------------------------------

function trimBlank(lines) {
  const out = lines.slice();
  while (out.length && out[0].trim() === "") out.shift();
  while (out.length && out[out.length - 1].trim() === "") out.pop();
  return out;
}

/**
 * renderTestPlanBody(tidiedBody) → { body, cases, shape, profile }
 *  - shape: "S0" (already in the grammar), "none" (no case found; body
 *    returned unchanged), or "mixed"/the single detector name
 *  - cases: [{ id, lane, det, title, group, src }] in document order
 */
export function renderTestPlanBody(tidied, opts = {}) {
  const text = String(tidied || "").replace(/\r\n?/g, "\n");
  if (/^### TC-[PNU]\d+\b/m.test(text)) {
    const cases = [];
    for (const m of text.matchAll(/^### (TC-([PNU])\d+)\b[^\n]*$/gm)) cases.push({ id: m[1], lane: m[2] });
    return { body: text, cases, shape: "S0", profile: PROFILE };
  }
  const lines = text.split("\n");
  const units = splitUnits(lines);
  const found = []; // { unitIdx, cases[], residual[] }
  let ctxLane = "U";
  let sheetLane = "U";
  for (let u = 0; u < units.length; u++) {
    const unit = units[u];
    if (unit.isSheet) sheetLane = laneOf(unit.sheet);
    if (unit.isNotes) { found.push({ unitIdx: u, cases: [], residual: unit.lines }); continue; }
    const laneHere = laneOf(unit.title) !== "U" ? laneOf(unit.title) : unit.isSheet ? sheetLane : ctxLane;
    let cases = [];
    let consumed = new Set();
    const s2 = detectS2(unit, laneHere);
    if (s2) {
      cases = [s2]; consumed = new Set(unit.lines.map((_, j) => j));
    } else {
      const s3 = detectS3(unit, laneHere);
      cases = cases.concat(s3.cases); s3.consumed.forEach((j) => consumed.add(j));
      const lab = detectLabels({ ...unit, lines: unit.lines.map((l, j) => (consumed.has(j) ? "" : l)) }, laneHere);
      cases = cases.concat(lab.cases); lab.consumed.forEach((j) => consumed.add(j));
      if (!cases.length) {
        const s1 = detectS1(unit, laneHere);
        if (s1) { cases = [s1]; consumed = new Set(unit.lines.map((_, j) => j)); }
        else {
          const s6 = detectS6(unit, laneHere);
          if (s6) { cases = s6.cases; s6.consumed.forEach((j) => consumed.add(j)); }
        }
      }
    }
    if (cases.length && laneOf(unit.title) !== "U") ctxLane = laneOf(unit.title);
    const residual = unit.lines.filter((_, j) => !consumed.has(j));
    found.push({ unitIdx: u, cases: cases.sort((a, b) => a.order - b.order), residual });
  }
  const all = found.flatMap((f) => f.cases);
  if (!all.length) return { body: text, cases: [], shape: "none", profile: PROFILE };

  // ids per lane, document order
  const counters = { P: 0, N: 0, U: 0 };
  for (const c of all) {
    counters[c.lane] = (counters[c.lane] || 0) + 1;
    c.id = `TC-${c.lane}${String(counters[c.lane]).padStart(2, "0")}`;
  }
  const firstCaseUnit = found.findIndex((f) => f.cases.length > 0);
  const overview = [], other = [], tcs = [];
  const unitHeading = (unit) => {
    if (!unit.headingLine) return null;
    const label = unit.isSlide ? `Slide ${unit.slideNo}${unit.title ? " — " + unit.title : ""}` : unit.text;
    const prov = unit.isSlide ? ` <!-- slide ${unit.slideNo} -->` : "";
    return `### ${label}${prov}`;
  };
  for (const f of found) {
    const unit = units[f.unitIdx];
    const res = trimBlank(f.residual);
    if (res.length || (!f.cases.length && unit.headingLine)) {
      const target = f.unitIdx < firstCaseUnit ? overview : other;
      const h = unitHeading(unit);
      if (h) target.push("", h, "");
      if (res.length) target.push(...res);
    }
    for (const c of f.cases) {
      const src = [c.det, ...c.src.map(srcSafe)].join(" · ");
      tcs.push("", `### ${c.id} — ${headSafe(c.title)} <!-- src: ${src} -->`, "");
      const body = trimBlank(c.body);
      if (body.length) tcs.push(...body);
    }
  }
  const out = [];
  if (trimBlank(overview).length) out.push("## Overview", ...overview, "");
  out.push("## Test Cases", ...tcs, "");
  if (trimBlank(other).length) out.push("## Other content", ...other, "");
  const dets = [...new Set(all.map((c) => c.det))];
  return {
    body: out.join("\n").replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "") + "\n",
    cases: all.map((c) => ({ id: c.id, lane: c.lane, det: c.det, title: c.title, group: c.group, src: c.src })),
    shape: dets.length === 1 ? dets[0] : "mixed",
    profile: PROFILE,
  };
}

/** Lint for the profile: every TC heading carries a src comment,
 *  ids are sequential per lane, `## Test Cases` exists when any TC does. */
export function lintTestPlanBody(body) {
  const failures = [];
  const text = String(body || "");
  const heads = [...text.matchAll(/^### (TC-([PNU])(\d+))\b([^\n]*)$/gm)];
  if (heads.length && !/^## Test Cases$/m.test(text)) failures.push("missing ## Test Cases");
  // a body in the draft contract (TestPlanGen output) carries no src
  // comments at all — that is its shape, not a lint failure; only a
  // rendered body with SOME src comments must have them on every case
  const anySrc = heads.some((h) => /<!-- src: .*? -->\s*$/.test(h[4]));
  const seen = { P: 0, N: 0, U: 0 };
  for (const h of heads) {
    if (anySrc && !/<!-- src: .*? -->\s*$/.test(h[4])) failures.push(`${h[1]}: no src comment`);
    const n = parseInt(h[3], 10);
    if (n !== seen[h[2]] + 1) failures.push(`${h[1]}: expected ${h[2]}${seen[h[2]] + 1}`);
    seen[h[2]] = n;
  }
  return failures;
}
