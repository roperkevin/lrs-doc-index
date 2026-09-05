/**
 * caseindex.mjs v2.0 — individual test cases out of a test plan's
 * sidecar body. Pure module, no I/O, no AI.
 *
 * v2.0 (CaseIndexVersion bump — reflow with `sweep.mjs --recase`;
 * Sidecar_Format_Plan phase 3): ONE case grammar. The body profile
 * `testplan/v1` (casegrammar.mjs) renders every detected case —
 * whatever the source shape — as
 *     ### TC-P01 — <title> <!-- src: S3 · slide 4 · table · A-7 -->
 * and TestPlanGen drafts already use the same `### TC-[PN]n` heading,
 * so the parser is a single `tcCases` reader: lane letter → the
 * Classification (P/N/U), heading remainder → Scenario, the src
 * comment → SlideNo, Shape (the detector: S1..S6, or "draft" when
 * there is none), SourceRef and Confidence, a `- **Group:**` line →
 * Group. The pre-3 deck form (`## Case N <!-- slide N -->`) still
 * parses (Shape "deck") until `--reformat --live` rewrites the corpus.
 * Section = the heading through the next heading of ANY level.
 *
 * Earlier notes (v1.1–v1.4) kept below for the field derivations.
 *
 * v1.4 (CaseIndexVersion bump — reflow with `sweep.mjs --recase`):
 *  - `FigureLink` (Hyperlink column): the case's PRIMARY figure as a
 *    clickable link — the first FigureLinks URL, description = the
 *    file name plus "(+N more)" when siblings exist; empty string
 *    (clears the column) when the case has no linked figure. A
 *    SharePoint hyperlink column holds ONE url, so the full
 *    inventory stays in FigureLinks; an Image/Thumbnail column was
 *    considered and rejected (single image, brittle API write
 *    format, and the thumbnail service renders SVG unreliably —
 *    every figure here is SVG). The sweep writes it through the
 *    standing SPO ValidateUpdateListItem route (Graph rejects
 *    hyperlink columns), and diffCaseRows compares hyperlink values
 *    by Url.
 *
 * v1.3 (CaseIndexVersion bump — reflow with `sweep.mjs --recase`):
 *  - `FigureLinks` (multi-line column): the case's own figure/image
 *    links, resolved against `mediaUrlBase` (the sidecar library's
 *    media folder URL) — newline-joined absolute URLs, so a list
 *    view or the Q&A agent can open a case's diagrams directly.
 *    Collapsed `[figure: …]` label lines (cloud-format sidecars)
 *    carry no file target, so they count in FigureCount but mint no
 *    link.
 *  - tag ordering goes RAREST-FIRST: prepareVocab entries carry an
 *    optional `df` (document frequency — the sweep passes each
 *    canonical's DocKeywords junction count), and caseTags orders
 *    matches by ascending df, then name. The first live reflow put
 *    19 rows at the Keywords 255 cap with ALPHABETICAL truncation —
 *    dropping distinctive late-alphabet tags while ubiquitous terms
 *    ("route", 439/463 cases) survived; rarest-first makes the cap
 *    cut the generic tail instead (the RelatedRank local-IDF spirit,
 *    at write time). A term's rank can shift as the corpus grows —
 *    the replace-set absorbs that as an occasional one-row update.
 *
 * v1.2 (CaseIndexVersion bump — reflow with `sweep.mjs --recase`):
 *  - per-case TAGS from the curated Keywords vocabulary
 *    (prepareVocab/caseTags below): canonical tool names land in a
 *    `Tools` column, topic + product keywords in a `Keywords`
 *    column — matched word-boundary against the case's own title,
 *    scenario, and unfenced body PLUS the plan title (the plan
 *    title is what names "the tool being tested" when the slide
 *    itself doesn't; it refreshes with every replace-set, so it
 *    never goes stale). Alias rows fold to their canonical, matches
 *    sort alphabetically for stable diffs, and no vocabulary means
 *    empty columns — never a guess. Deliberately NOT stored as
 *    DocKeywords-style junction rows: flat '; '-joined columns are
 *    the Products-column precedent, filter fine in list views, and
 *    don't triple the list's row volume.
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
      .replace(/\s/g, "-"); // each space → one hyphen (GitHub keeps them all)
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

/**
 * prepareVocab — compile the Keywords vocabulary into word-boundary
 * matchers, once per run (v1.2). `entries` are
 * `{ title, kind, canonical }`: title is the text to match (alias
 * rows pass their own title), canonical the name to report (their
 * canonical's title), kind the canonical's Kind (tool/topic/product).
 * Multi-word titles match across any whitespace; regex specials in
 * titles are escaped; matching is case-insensitive.
 */
export function prepareVocab(entries) {
  const compiled = [];
  for (const e of entries || []) {
    const title = String(e?.title || "").trim();
    if (!title) continue;
    const pattern = title
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\s+/g, "\\s+");
    compiled.push({
      re: new RegExp(`\\b${pattern}\\b`, "i"),
      kind: String(e.kind || "topic").toLowerCase(),
      canonical: String(e.canonical || title),
      df: Number(e.df) || 0,
    });
  }
  return { entries: compiled };
}

/**
 * caseTags — the vocabulary terms present in one case's scan text.
 * Returns { tools, keywords }: deduped canonical names — Kind "tool"
 * in tools, everything else (topic, product) in keywords — ordered
 * RAREST-FIRST (ascending df, then name; v1.3), so a capped join
 * truncates the ubiquitous tail, never the distinctive terms.
 */
export function caseTags(scanText, vocab) {
  const tools = new Map(); // canonical -> df
  const keywords = new Map();
  const text = String(scanText || "");
  for (const e of vocab?.entries || []) {
    if (!e.re.test(text)) continue;
    const bucket = e.kind === "tool" ? tools : keywords;
    if (!bucket.has(e.canonical) || e.df < bucket.get(e.canonical)) {
      bucket.set(e.canonical, e.df);
    }
  }
  const order = (m) =>
    [...m].sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1)).map(([n]) => n);
  return { tools: order(tools), keywords: order(keywords) };
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
  const figureFiles = [];
  let expectedResult = "", traceText = "";
  const takeRoutes = (t) => {
    for (const r of t.match(/\bR\d+(?:L\d+)?\b/g) || []) {
      if (!routes.includes(r)) routes.push(r);
    }
  };
  for (const raw of prose) {
    const s = raw.trim();
    if (s.startsWith("![") || s.startsWith("[figure:")) {
      figureCount++;
      // rendered figures link their file; collapsed "[figure: …]"
      // label lines (cloud-format sidecars) carry no target
      const fm = /^!\[[^\]]*\]\(<?([^)>\s]+)>?\)/.exec(s);
      if (fm && !figureFiles.includes(fm[1])) figureFiles.push(fm[1]);
      continue;
    }
    if (/^\|[\s:|-]+\|$/.test(s)) { tableCount++; continue; } // header separator row
    if (s.startsWith("|")) { takeRoutes(s); continue; } // route ids live in fixture tables too
    const clean = s.replace(/<!--[\s\S]*?-->/g, "").trim();
    if (/^(?:- )?\d{1,3}[.)]\s+\S/.test(clean)) stepCount++;
    let m;
    // the draft contract's `**Expected Result:** …` line, or the
    // grammar's `- **Expected Result:** …` bullet (v2.0)
    if (!expectedResult && (m = /^(?:- )?\**Expected Result:?\**\s*[:\-—]?\s*(.+)$/i.exec(clean))) {
      expectedResult = cap(m[1].replace(/\*+$/, "").trim(), 255);
    }
    if (!traceText && (m = /^(?:- )?\**Trace:?\**\s*[:\-—]?\s*(.+)$/i.exec(clean))) {
      traceText = cap(m[1].replace(/\*+$/, "").trim(), 255);
    }
    takeRoutes(clean);
  }
  return {
    figureCount, tableCount, stepCount,
    routeRefs: cap(routes.join("; "), 255),
    expectedResult, traceText,
    figureFiles,
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
      _prose: meta._prose,
      _figs: meta.figureFiles,
    });
  }
  return cases;
}

/** Detector → confidence (Sidecar_Format_Plan §4.4). */
export const CONFIDENCE = { S0: "high", S1: "high", S2: "high", S3: "high", S4: "high", S5: "medium", S6: "medium", draft: "high", deck: "high" };

/** The one case grammar: `### TC-<lane><n> — <title> <!-- src: … -->`
 *  (casegrammar profile output AND the draftlint draft contract). */
function tcCases(lines, opts) {
  const cases = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^### (TC-([PNU])(\d+))\b\s*(?:[—:\-–]\s*)?(.*?)\s*(?:<!-- src: ([^>]*?) -->)?\s*$/.exec(lines[i]);
    if (!m) continue;
    let end = lines.length;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^#{2,6} /.test(lines[j])) { end = j; break; }
    }
    const section = lines.slice(i + 1, end);
    const src = (m[5] || "").trim();
    const parts = src ? src.split(/\s*·\s*/) : [];
    const det = parts.length && /^S[0-6]$/.test(parts[0]) ? parts[0] : "draft";
    const slide = /\bslide (\d+)\b/.exec(src);
    let group = "";
    for (const ln of section) {
      const gm = /^- \*\*Group:\*\*\s*(.+)$/.exec(ln.trim());
      if (gm) { group = gm[1].trim(); break; }
    }
    const meta = sectionMeta(section);
    cases.push({
      caseNo: m[1],
      slideNo: slide ? parseInt(slide[1], 10) : null,
      classification: m[2] === "P" ? "Positive" : m[2] === "N" ? "Negative" : "Unspecified",
      scenario: m[4].replace(/^[\s\-–—:]+/, "").trim(),
      title: lines[i].replace(/^### /, "").replace(/<!--[\s\S]*?-->/g, "").trim(),
      group: cap(group, 255),
      sourceRef: cap(src, 255),
      det,
      text: skimText(section, opts.caseTextCap),
      issueRefs: caseIssueRefs(meta._prose.join("\n"), opts.defaultRepo),
      figureCount: meta.figureCount,
      tableCount: meta.tableCount,
      stepCount: meta.stepCount,
      routeRefs: meta.routeRefs,
      expectedResult: meta.expectedResult,
      traceText: meta.traceText,
      _headAt: i,
      _prose: meta._prose,
      _figs: meta.figureFiles,
    });
  }
  return cases;
}

/**
 * extractCases(bodyText, { defaultRepo, caseTextCap, vocab,
 *   planTitle, mediaUrlBase }) →
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
  const tc = tcCases(lines, o);
  const deck = tc.length ? [] : deckCases(lines, o);
  const picked = tc.length ? tc : deck;
  const dets = [...new Set(picked.map((c) => c.det || "deck"))];
  const shape = picked.length === 0 ? "none" : dets.length === 1 ? dets[0] : "mixed";
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
    mixed: dets.length > 1,
    cases: picked.map((c, k) => {
      const { _headAt, _prose, _figs, ...kase } = c;
      // tags (v1.2): the case's own title + scenario + unfenced body,
      // plus the plan title — the tested tool's usual home
      const tags = caseTags(
        [opts.planTitle || "", c.title, c.scenario, ..._prose].join("\n"),
        opts.vocab
      );
      // figure links (v1.3): sidecar-relative targets resolved onto
      // the media folder's URL; without a base the raw target stands
      // phase 1b: media lives in media/<stem>/<asset> — keep the path
      // below `media/` (a bare basename would drop the folder)
      const figureLinks = _figs.map((t) => {
        if (!opts.mediaUrlBase) return t;
        const str = String(t);
        const at = str.indexOf("media/");
        const rel = at >= 0 ? str.slice(at + "media/".length) : str.split("/").pop();
        return `${opts.mediaUrlBase}/${rel}`;
      });
      const det = c.det || "deck";
      return {
        ordinal: k + 1, ...kase, shape: det, det,
        group: c.group || "", sourceRef: c.sourceRef || "",
        confidence: CONFIDENCE[det] || "medium",
        tools: tags.tools, keywords: tags.keywords, figureLinks,
        anchor: anchorAt.get(_headAt) || "",
      };
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
    Confidence: kase.confidence || "",
    Group: cap(kase.group || "", 255),
    SourceRef: cap(kase.sourceRef || "", 255),
    FigureCount: kase.figureCount,
    TableCount: kase.tableCount,
    StepCount: kase.stepCount,
    RouteRefs: kase.routeRefs,
    ExpectedResult: kase.expectedResult,
    TraceText: kase.traceText,
    Tools: cap(kase.tools.join("; "), 255),
    Keywords: cap(kase.keywords.join("; "), 255),
    FigureLinks: cap(kase.figureLinks.join("\n"), 4000),
    FigureLink: kase.figureLinks.length
      ? {
          Url: kase.figureLinks[0],
          Description:
            String(kase.figureLinks[0]).split("/").pop() +
            (kase.figureLinks.length > 1 ? ` (+${kase.figureLinks.length - 1} more)` : ""),
        }
      : "",
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
  // hyperlink values (FigureLink) compare by Url — Graph reads them
  // back as {Url, Description} objects; the description is derived
  // from the same links, so Url equality is field equality
  const norm = (v) =>
    v === undefined || v === null ? ""
    : typeof v === "object" ? String(v.Url ?? "")
    : String(v);
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
