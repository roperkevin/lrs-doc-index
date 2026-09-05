/**
 * caseaudit.mjs — case-shape audit of test-plan sidecar bodies
 * (Sidecar_Format_Plan phase 0).
 *
 * Pure functions, no I/O. `auditBody` looks at ONE sidecar body (the
 * text below the metadata seam — the same slice `--recase` parses) and
 * reports which latent test-case SHAPES it exhibits, independent of
 * whether the current parser (caseindex.mjs) can read them. The sweep's
 * `--case-audit` mode runs it over every eligible plan and writes
 * `_Case Audit.md` next to `_Case Catalog.md`, so the plans the case
 * index leaves uncovered are listed with the reason, not just counted
 * (`plans_caseless`).
 *
 * Signals (names are stable — the audit page, the run summary and the
 * gate all key on them):
 *   caseTable        `| # | Test | Expected result |`-style header rows
 *                    (an id column + a description column) — one case
 *                    per row, incl. WorkbookDump sheets
 *   posNegTable      single-column tables headed `Positive Tests: <group>`
 *                    / `Negative Cases` — one case per cell paragraph
 *   posNegLabel      a `Positive:` / `Negative Tests:` label paragraph
 *                    followed by a list
 *   titledCaseSlide  `## Slide N — Test case 3: …` / `## Slide N — 2. …`
 *   numberedCases    `1.` / `1a.` case lines outside tables
 *   verifyBullets    `- Verify …` / `- Ensure …` / `- Test …` checks
 *   collapsedCells   table cells over 250 chars (bullets flattened into
 *                    one run-on cell by the extractor)
 *   expectedLines    `Expected result:` lines in the draft-contract form
 * Every signal is a count; a plan with none of them and no parsed
 * cases is genuinely caseless (placeholder decks, unit-test stubs).
 */

export const CASEAUDIT_VERSION = "1.0";

export const SIGNAL_NAMES = [
  "caseTable", "posNegTable", "posNegLabel", "titledCaseSlide",
  "numberedCases", "verifyBullets", "collapsedCells", "expectedLines",
];

const RE = {
  caseTableHdr: /^\|\s*(?:#|id|no\.?|tc|test\s*case)\s*\|[^\n]*\|\s*$/i,
  caseTableDesc: /\|\s*(?:test|description|scenario|case|expected|result|response)\b/i,
  posNegTable: /^\|\s*(?:positive|negative)\s+(?:tests?|cases?)\b[^|\n]*\|\s*$/i,
  posNegLabel: /^(?:positive|negative)\b[^|\n]{0,60}:?\s*$/i,
  titledCaseSlide: /^##\s+Slide\s+\d+\s+—\s+(?:.*?\b(?:test\s*case|case|scenario|tc)\s*#?\d+|\d+[a-z]?[.)]\s)/i,
  numbered: /^\s*(?:- )?\d{1,3}[a-z]?[.)]\s+\S/,
  verify: /^\s*- (?:verify|ensure|test|check|confirm|validate)\b/i,
  expected: /^\**expected(?: result)?\**\s*[:\-—]/i,
  sep: /^\|[\s:|-]+\|$/,
  tableRow: /^\|.*\|\s*$/,
};

/** Signal counts for one sidecar body. */
export function auditBody(bodyText) {
  const lines = String(bodyText || "").replace(/\r\n?/g, "\n").split("\n");
  const s = Object.fromEntries(SIGNAL_NAMES.map((k) => [k, 0]));
  let fenced = false;
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (/^```/.test(ln)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const next = lines[i + 1] || "";
    if (RE.tableRow.test(ln) && RE.sep.test(next)) {
      if (RE.caseTableHdr.test(ln) && RE.caseTableDesc.test(ln)) s.caseTable++;
      else if (RE.posNegTable.test(ln)) s.posNegTable++;
    }
    if (RE.tableRow.test(ln)) {
      for (const cell of ln.split(/(?<!\\)\|/)) if (cell.trim().length > 250) s.collapsedCells++;
      continue;
    }
    // a label may sit one blank line above its list (tidyBody keeps
    // the deck's paragraph gap)
    const after = next.trim() === "" ? (lines[i + 2] || "") : next;
    if (RE.posNegLabel.test(ln) && /^\s*(?:- |\d+[.)] )/.test(after)) s.posNegLabel++;
    if (RE.titledCaseSlide.test(ln)) s.titledCaseSlide++;
    if (RE.numbered.test(ln)) s.numberedCases++;
    if (RE.verify.test(ln)) s.verifyBullets++;
    if (RE.expected.test(ln)) s.expectedLines++;
  }
  return s;
}

/** True when any signal fired. */
export function hasSignal(signals) {
  return SIGNAL_NAMES.some((k) => (signals?.[k] || 0) > 0);
}

/** One-line human summary of the signals that fired, strongest first. */
export function describeSignals(signals) {
  const order = ["caseTable", "titledCaseSlide", "posNegTable", "posNegLabel",
                 "numberedCases", "verifyBullets", "collapsedCells", "expectedLines"];
  const label = {
    caseTable: "case table", titledCaseSlide: "titled case slide",
    posNegTable: "Positive/Negative table", posNegLabel: "Positive/Negative label + list",
    numberedCases: "numbered case line", verifyBullets: "Verify… bullet",
    collapsedCells: "collapsed cell", expectedLines: "Expected result line",
  };
  const parts = [];
  for (const k of order) {
    const n = signals?.[k] || 0;
    if (n) parts.push(`${n} ${label[k]}${n === 1 ? "" : "s"}`);
  }
  return parts.join(" · ") || "no signal";
}

/**
 * Aggregate over the audited plans:
 * entries = [{ id, title, target, shape, cases, signals }]
 */
export function summarizeAudit(entries) {
  const sum = {
    plans: entries.length,
    covered: 0, uncovered: 0, uncovered_with_signal: 0, uncovered_no_signal: 0,
    cases: 0,
    shapes: {},
    signals: Object.fromEntries(SIGNAL_NAMES.map((k) => [k, 0])),
  };
  for (const e of entries) {
    sum.cases += e.cases || 0;
    sum.shapes[e.shape || "none"] = (sum.shapes[e.shape || "none"] || 0) + 1;
    for (const k of SIGNAL_NAMES) if ((e.signals?.[k] || 0) > 0) sum.signals[k]++;
    if ((e.cases || 0) > 0) sum.covered++;
    else {
      sum.uncovered++;
      if (hasSignal(e.signals)) sum.uncovered_with_signal++;
      else sum.uncovered_no_signal++;
    }
  }
  return sum;
}

/** The `_Case Audit.md` page. */
export function renderAuditPage(entries, stampIso) {
  const sum = summarizeAudit(entries);
  const stamp = String(stampIso || new Date().toISOString()).slice(0, 16).replace("T", " ");
  const uncovered = entries.filter((e) => !(e.cases > 0))
    .sort((a, b) => Number(hasSignal(b.signals)) - Number(hasSignal(a.signals)) ||
                    String(a.title).localeCompare(String(b.title)));
  const covered = entries.filter((e) => e.cases > 0)
    .sort((a, b) => (b.cases || 0) - (a.cases || 0));
  const row = (e) =>
    `| [${clip(e.title, 70)}](<${e.target}>) | ${e.shape || "none"} | ${e.cases || 0} | ${describeSignals(e.signals)} |`;
  const sigRows = SIGNAL_NAMES.map((k) => `| ${k} | ${sum.signals[k]} |`);
  return [
    "# Test cases — audit",
    "",
    "_Which test plans the case index covers, and what the uncovered ones",
    "contain. Signals are latent case shapes the current parser does not",
    "read yet (Sidecar_Format_Plan §4.4); a plan with no signal and no",
    "cases is genuinely caseless. See \"_Case Catalog.md\" for the cases._",
    "",
    `- **Plans audited:** ${sum.plans}`,
    `- **Covered (≥ 1 case):** ${sum.covered} · ${sum.cases} case(s)`,
    `- **Uncovered:** ${sum.uncovered} — ${sum.uncovered_with_signal} with a latent shape, ${sum.uncovered_no_signal} with none`,
    "",
    "## Signals across all plans",
    "",
    "| Signal | Plans |",
    "|---|---|",
    ...sigRows,
    "",
    `## Uncovered plans (${uncovered.length})`,
    "",
    ...(uncovered.length
      ? ["| Plan | Shape | Cases | Signals |", "|---|---|---|---|", ...uncovered.map(row)]
      : ["_None._"]),
    "",
    `## Covered plans (${covered.length})`,
    "",
    ...(covered.length
      ? ["| Plan | Shape | Cases | Signals |", "|---|---|---|---|", ...covered.map(row)]
      : ["_None._"]),
    "",
    `_Written by \`sweep.mjs --case-audit\` · caseaudit v${CASEAUDIT_VERSION} · ${stamp}Z._`,
    "",
  ].join("\n");
}

function clip(s, n) {
  const t = String(s || "").replace(/\s+/g, " ").replace(/\|/g, "/").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}
