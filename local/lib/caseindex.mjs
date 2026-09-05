/**
 * caseindex.mjs v1.1 — individual test cases out of a test plan's
 * sidecar body (Case_Index_Plan.md phases 0–1; v1.1 addendum). Pure
 * module, no I/O, no AI: it parses the RENDERED body below the
 * metadata seam — the per-case sections `caseHeadings`
 * (presentation.mjs, TC-1..TC-3) already emits for deck-derived
 * plans, and the draft-style `### TC-P<n>` / `### TC-N<n>` contract
 * draftlint.mjs checks — and returns rows for the Test Cases list
 * (schemas/SPList_TestCases.csv). A body with no recognizable case
 * structure yields ZERO cases, never guesses (the caseHeadings
 * determinism decision, applied here).
 *
 * v1.1 (CaseIndexVersion bump — reflow with `sweep.mjs --recase`):
 *  - the explicit `owner/repo#n` issue form requires 3–5 digits,
 *    matching the corpus assumption RegexExtract's hashtag rule
 *    already encodes (the first live backfill minted a phantom `#0`
 *    from an Arcade stationing expression);
 *  - fenced code is excluded from issue-ref and metadata scans, not
 *    just from the skim text (expressions and scripts are where the
 *    false forms live);
 *  - per-case metadata columns: Shape, FigureCount, TableCount,
 *    StepCount, RouteRefs, ExpectedResult, TraceText (see
 *    sectionMeta below). Parent-plan metadata (surface, products,
 *    release) stays ONE LOOKUP AWAY on the Doc Index row by design —
 *    denormalizing it here would go stale.
 *
 * The deck-shape parser is COUPLED to caseHeadings' emission by
 * design (Case_Index_Plan.md D1): check_caseindex.py extracts from a
 * body caseHeadings itself just produced, so drift breaks the gate,
 * not the corpus.
 */

const cap = (s, n) => String(s || "").slice(0, n);

/**
 * GitHub-style heading anchor slug (HTML comments don't render, so
 * they never reach the slug). Duplicate slugs take -1, -2, … suffixes
 * the way GitHub's renderer disambiguates them.
 */
function slugger() {
  const seen = new Map();
  return (heading) => {
    let s = String(heading)
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .replace(/\s+/g, "-");
    const n = seen.get(s) || 0;
    seen.set(s, n + 1);
    if (n > 0) s = `${s}-${n}`;
    return s;
  };
}

/**
 * Issue references in ONE case's own text slice — the Doc IDs
 * patterns (RegexExtract), minus the filename source (that one is
 * document-level by nature): devtopia urls carry their own repo and
 * are authoritative; an explicit `owner/repo#n` names its repo too
 * (3–5 digit issue numbers only since v1.1 — the same corpus
 * assumption RegexExtract's hashtag rule encodes, so an Arcade
 * `…/…#0` expression fragment never mints a phantom); a bare `#n`
 * hashtag is repo-less and weak — it takes defaultRepo and is
 * DROPPED when a repo-carrying form already claims the number (the
 * RegexExtract v1.1 phantom-copy rule). Callers pass UNFENCED text
 * (fenced code excluded). Returns sorted, deduped `repo#number`
 * strings.
 */
export function caseIssueRefs(text, defaultRepo) {
  const content = String(text || "");
  const byKey = new Set();
  const claimed = new Set();
  const add = (repo, num) => {
    const key = `${repo}#${num}`;
    if (!byKey.has(key)) byKey.add(key);
  };
  const urlRe = /devtopia\.esri\.com\/([^\/\s"'<>\)\]]+)\/([^\/\s"'<>\)\]]+)\/issues\/(\d+)/gi;
  let m;
  while ((m = urlRe.exec(content)) !== null) {
    add(`${m[1]}/${m[2]}`, parseInt(m[3], 10));
    claimed.add(parseInt(m[3], 10));
  }
  const repoRe = /([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)#(\d{3,5})\b/g;
  while ((m = repoRe.exec(content)) !== null) {
    add(m[1], parseInt(m[2], 10));
    claimed.add(parseInt(m[2], 10));
  }
  const hashRe = /#(\d{3,5})\b/g;
  while ((m = hashRe.exec(content)) !== null) {
    const num = parseInt(m[1], 10);
    if (!claimed.has(num) && defaultRepo) add(defaultRepo, num);
  }
  return [...byKey].sort();
}

/**
 * The case's skim text: its section body with the structure that
 * lives elsewhere stripped — table rows, image/figure links, fenced
 * code, HTML comments, heading markers — blank runs collapsed, capped.
 */
function skimText(sectionLines, capChars) {
  const out = [];
  let fenced = false;
  for (const raw of sectionLines) {
    const s = raw.trim();
    if (s.startsWith("```")) { fenced = !fenced; continue; }
    if (fenced || s.startsWith("|") || s.startsWith("![") || s.startsWith("[figure:")) continue;
    const ln = s.replace(/<!--[\s\S]*?-->/g, "").replace(/^#{1,6}\s+/, "").trim();
    if (ln) out.push(ln);
  }
  return cap(out.join("\n"), capChars);
}

/** Section lines outside fenced code blocks — the scan surface for
 * issue refs and metadata (scripts and expressions are where false
 * forms live; the skim text already excluded fences). */
function unfenced(sectionLines) {
  const out = [];
  let fenced = false;
  for (const raw of sectionLines) {
    if (raw.trim().startsWith("```")) { fenced = !fenced; continue; }
    if (!fenced) out.push(raw);
  }
  return out;
}

/**
 * sectionMeta — deterministic per-case metadata from the section's
 * own lines (v1.1):
 *   figureCount   rendered figures + collapsed figure lines
 *   tableCount    markdown tables (separator rows)
 *   stepCount     numbered lines outside tables (draft-style steps;
 *                 deck cases usually 0 — their one numbered line was
 *                 promoted into the heading)
 *   routeRefs     distinct fixture route ids (R1, R1L3, …) in order
 *                 of appearance — the LRS fixture core
 *   expectedResult the draft contract's "Expected Result:" line
 *   traceText     the draft contract's "Trace:" line — per-case
 *                 story-grounding provenance
 * All from UNFENCED lines; the two contract lines are capped 255
 * (the full text stays in CaseText).
 */
function sectionMeta(sectionLines) {
  const prose = unfenced(sectionLines);
  let figureCount = 0, tableCount = 0, stepCount = 0;
  const routes = [];
  let expectedResult = "", traceText = "";
  const takeRoutes = (t) => {
    for (const r of t.match(/\bR\d+(?:L\d+)?\b/g) || []) {
      if (!routes.includes(r)) routes.push(r);
    }
  };
  for (const raw of prose) {
    const s = raw.trim();
    if (s.startsWith("![") || s.startsWith("[figure:")) { figureCount++; continue; }
    if (/^\|[\s:|-]+\|$/.test(s)) { tableCount++; continue; } // header separator row
    if (s.startsWith("|")) { takeRoutes(s); continue; } // route ids live in fixture tables too
    const clean = s.replace(/<!--[\s\S]*?-->/g, "").trim();
    if (/^(?:- )?\d{1,3}[.)]\s+\S/.test(clean)) stepCount++;
    let m;
    if (!expectedResult && (m = /^\**Expected Result\**\s*[:\-—]\s*(.+)$/i.exec(clean))) {
      expectedResult = cap(m[1].replace(/\*+$/, "").trim(), 255);
    }
    if (!traceText && (m = /^\**Trace\**\s*[:\-—]\s*(.+)$/i.exec(clean))) {
      traceText = cap(m[1].replace(/\*+$/, "").trim(), 255);
    }
    takeRoutes(clean);
  }
  return {
    figureCount, tableCount, stepCount,
    routeRefs: cap(routes.join("; "), 255),
    expectedResult, traceText,
    _prose: prose,
  };
}

/** Deck-shape sections: the three heading forms caseHeadings writes. */
function deckCases(lines, opts) {
  const cases = [];
  const heads = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^## /.test(lines[i])) heads.push(i);
  }
  for (let h = 0; h < heads.length; h++) {
    const i = heads[h];
    const end = h + 1 < heads.length ? heads[h + 1] : lines.length;
    const m = /^## (.+?) <!-- slide (\d+) -->$/.exec(lines[i]);
    if (!m) continue; // author-titled or bare "## Slide N" — not a case
    const title = m[1];
    const slideNo = parseInt(m[2], 10);
    if (/\btest cases$/i.test(title)) continue; // rule-c divider section
    let caseNo = "";
    let classification = "Unspecified";
    const cm = /^Case (\d+)(?::\s*(.*))?$/.exec(title);
    if (cm) {
      caseNo = cm[1];
      const rest = cm[2] || "";
      if (/^Positive\b/i.test(rest)) classification = "Positive";
      else if (/^Negative\b/i.test(rest)) classification = "Negative";
    } else if (/^Positive\b/i.test(title)) {
      classification = "Positive"; // rule-b: the classification IS the H2
    } else if (/^Negative\b/i.test(title)) {
      classification = "Negative";
    } else {
      continue; // some other heading with a slide comment — not a case
    }
    const section = lines.slice(i + 1, end);
    // the scenario H3 sits directly under the H2 (blank lines between)
    let scenario = "";
    for (const ln of section) {
      const s = ln.trim();
      if (s === "") continue;
      const sm = /^### (.+)$/.exec(s);
      if (sm && !/^Notes$/i.test(sm[1])) scenario = sm[1];
      break;
    }
    const meta = sectionMeta(section);
    cases.push({
      caseNo,
      slideNo,
      classification,
      scenario,
      title,
      text: skimText(section, opts.caseTextCap),
      issueRefs: caseIssueRefs(meta._prose.join("\n"), opts.defaultRepo),
      figureCount: meta.figureCount,
      tableCount: meta.tableCount,
      stepCount: meta.stepCount,
      routeRefs: meta.routeRefs,
      expectedResult: meta.expectedResult,
      traceText: meta.traceText,
      _headAt: i,
    });
  }
  return cases;
}

/** Draft-shape sections: the draftlint `^### TC-[PN]<n>` contract. */
function draftCases(lines, opts) {
  const cases = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^### (TC-([PN])\d+)\b\s*(.*)$/.exec(lines[i]);
    if (!m) continue;
    let end = lines.length;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^##(#)? /.test(lines[j])) { end = j; break; }
    }
    const section = lines.slice(i + 1, end);
    const meta = sectionMeta(section);
    cases.push({
      caseNo: m[1],
      slideNo: null,
      classification: m[2] === "P" ? "Positive" : "Negative",
      scenario: m[3].replace(/^[\s\-–—:]+/, "").trim(),
      title: lines[i].replace(/^### /, ""),
      text: skimText(section, opts.caseTextCap),
      issueRefs: caseIssueRefs(meta._prose.join("\n"), opts.defaultRepo),
      figureCount: meta.figureCount,
      tableCount: meta.tableCount,
      stepCount: meta.stepCount,
      routeRefs: meta.routeRefs,
      expectedResult: meta.expectedResult,
      traceText: meta.traceText,
      _headAt: i,
    });
  }
  return cases;
}

/**
 * extractCases(bodyText, { defaultRepo, caseTextCap }) →
 *   { cases, shape: "deck" | "draft" | "none", mixed }
 *
 * `cases` in document order, each { ordinal (1-based), caseNo,
 * slideNo, classification, scenario, title, text, anchor, issueRefs }.
 * Both shapes are parsed; a document matching both keeps the larger
 * set (deck on a tie — the corpus's native shape) and reports
 * `mixed: true` so the run summary can count the drift
 * (`cases_shape_mixed`, Case_Index_Plan.md D3).
 */
export function extractCases(bodyText, opts = {}) {
  const o = {
    defaultRepo: opts.defaultRepo || "",
    caseTextCap: opts.caseTextCap || 4000,
  };
  const lines = String(bodyText || "").replace(/\r\n?/g, "\n").split("\n");
  const deck = deckCases(lines, o);
  const draft = draftCases(lines, o);
  const picked = draft.length > deck.length ? draft : deck;
  const shape = picked.length === 0 ? "none" : picked === draft ? "draft" : "deck";
  // anchors are slugged over EVERY heading in the body (an unrelated
  // section with the same text shifts a case's dedup suffix), in
  // document order — matching how a renderer would number them
  const slug = slugger();
  const anchorAt = new Map();
  for (let i = 0; i < lines.length; i++) {
    const hm = /^(#{1,6}) (.+)$/.exec(lines[i]);
    if (hm) anchorAt.set(i, slug(hm[2]));
  }
  return {
    shape,
    mixed: deck.length > 0 && draft.length > 0,
    cases: picked.map((c, k) => {
      const { _headAt, ...kase } = c;
      return { ordinal: k + 1, ...kase, shape, anchor: anchorAt.get(_headAt) || "" };
    }),
  };
}

/**
 * The Test Cases list row for one extracted case — shared by the
 * sweep's writer (phase 2) and the gate, so the field shaping exists
 * in exactly one place. Field names match SPList_TestCases.csv.
 */
export function toRowFields(docRowId, kase, nowIso) {
  return {
    Title: cap(kase.title, 255),
    DocumentLookupId: docRowId,
    CaseKey: `${docRowId}|${kase.ordinal}`,
    CaseNo: cap(kase.caseNo, 255),
    SlideNo: kase.slideNo ?? null,
    Classification: kase.classification,
    Scenario: cap(kase.scenario, 255),
    CaseText: kase.text,
    IssueRefs: kase.issueRefs.join("; "),
    Anchor: cap(kase.anchor, 255),
    Shape: kase.shape,
    FigureCount: kase.figureCount,
    TableCount: kase.tableCount,
    StepCount: kase.stepCount,
    RouteRefs: kase.routeRefs,
    ExpectedResult: kase.expectedResult,
    TraceText: kase.traceText,
    SweptOn: nowIso,
  };
}

/**
 * diffCaseRows(existing, fresh) → { create, update, delete } — the
 * replace-set planner (Case_Index_Plan.md D4). `existing` are the
 * document's current list rows as Graph returns them ({ id, fields });
 * `fresh` are toRowFields objects for the newly extracted cases.
 * Matched by CaseKey; a matched row updates only when a field other
 * than SweptOn differs (so an unchanged plan writes NOTHING);
 * unmatched existing rows delete. Pure, so the gate table-tests it.
 */
export function diffCaseRows(existing, fresh) {
  const norm = (v) => (v === undefined || v === null ? "" : String(v));
  const byKey = new Map();
  for (const row of existing || []) {
    const key = norm(row?.fields?.CaseKey);
    if (key) byKey.set(key, row);
  }
  const plan = { create: [], update: [], delete: [] };
  for (const f of fresh || []) {
    const have = byKey.get(f.CaseKey);
    if (!have) {
      plan.create.push(f);
      continue;
    }
    byKey.delete(f.CaseKey);
    const changed = Object.keys(f).some(
      (k) => k !== "SweptOn" && norm(f[k]) !== norm(have.fields[k])
    );
    if (changed) plan.update.push({ id: have.id, fields: f });
  }
  for (const row of byKey.values()) plan.delete.push(row.id);
  return plan;
}
