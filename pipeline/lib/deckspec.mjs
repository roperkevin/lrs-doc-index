/**
 * deckspec.mjs v1.1 — the model-laid-out review deck for TestPlanGen
 * drafts (`prompts/TestPlanDeck_Prompt.md` v0.1, testplangen.mjs
 * `--deck`, local/deck2pptx.mjs). Pure module, no I/O, no AI: the
 * deterministic halves around the one model call the pass makes.
 *
 *   parseDeckReply(raw)              the fail-closed sentinel slice +
 *                                    JSON parse (the figures-pass G9
 *                                    posture: missing / misordered
 *                                    sentinels or invalid JSON throw;
 *                                    nothing renders from a partial
 *                                    reply)
 *   deckCorpus(draft)                the grounding corpus: the draft's
 *                                    normalized text, its parsed cases
 *                                    and sections (draft2pptx's own
 *                                    dialect parser), the deterministic
 *                                    counts, the figures it cites
 *   verifyDeckSpec(spec, corpus)     the vocabulary + grounding check
 *                                    PER SLIDE — `from` references are
 *                                    resolved into draft content here;
 *                                    a slide with ANY finding is dropped,
 *                                    never repaired; the survivors come
 *                                    back resolved (every text literal)
 *   layoutDeck(slides, corpus, ds)   the layout engine: each resolved
 *                                    slide → positioned elements in EMU
 *                                    on the chosen design's grid and
 *                                    type ramp (lib/designsystem.mjs —
 *                                    v1.1: fluent / carbon / uswds, the
 *                                    layout addresses type and colour by
 *                                    DECK ROLE and never knows which);
 *                                    long lists paginate onto "(n of m)"
 *                                    continuation slides; nothing is
 *                                    ever placed past the footer
 *
 * The division of labour: the MODEL makes the layout decisions — which
 * pattern each slide uses, what goes in which region, how cases are
 * grouped, what deserves a section or a statement slide, what the
 * speaker notes say; the DESIGN SYSTEM decides every size, gap,
 * colour and coordinate; the DRAFT supplies every word of body
 * content. Titles, labels and notes are the model's (length-capped);
 * items, cards, cells, statements, ledes and values must be found
 * VERBATIM in the draft (after whitespace / quote / dash / emphasis
 * normalization) or pulled from it through a `from` reference — the
 * never-invent rule, extended to slides.
 */

import { parseDraft, countVerify, TEST_SECTIONS } from "../render/draft2pptx.mjs";
import {
  PATTERNS, PATTERN_NAMES, TONES, LIMITS, SLIDE_W, SLIDE_H, EMU_PER_PT, DESIGNS, DEFAULT_DESIGN, designOf,
} from "./designsystem.mjs";

export const DECK_BEGIN = "[[[DECK BEGIN]]]";
export const DECK_END = "[[[DECK END]]]";
export const MAX_SLIDES = 60;

/** The deterministic counters a stats tile may name instead of a literal value. */
export const COUNTS = [
  "cases", "positive-cases", "negative-cases", "verify-flags", "coverage-rows",
  "open-questions", "setup-items", "figures", "issues",
];

// -------------------------------------------------------------- parse

/** The reply's JSON object, fail closed. */
export function parseDeckReply(raw) {
  const s = String(raw ?? "");
  const b = s.indexOf(DECK_BEGIN);
  const e = s.lastIndexOf(DECK_END);
  if (b < 0 || e <= b) throw new Error("deck reply is missing the DECK BEGIN/END sentinels (or they are misordered)");
  let obj;
  try {
    obj = JSON.parse(s.slice(b + DECK_BEGIN.length, e).trim());
  } catch (err) {
    throw new Error(`deck reply is not valid JSON between the sentinels: ${err.message}`);
  }
  if (!obj || typeof obj !== "object" || !Array.isArray(obj.slides)) {
    throw new Error('deck reply JSON has no "slides" array');
  }
  if (obj.slides.length > MAX_SLIDES) {
    throw new Error(`deck reply proposes ${obj.slides.length} slides (the cap is ${MAX_SLIDES})`);
  }
  return { plan: String(obj.plan ?? ""), slides: obj.slides };
}

// ------------------------------------------------------------- corpus

/** Normalization both sides of a grounding test go through. */
export function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[‘’‚]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/…/g, "...")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * {title, text, norm, model, cases: Map, sections: Map, counts,
 * figures, isDraft} from a draft body (the whole file — banner and
 * addenda included; comments stripped).
 */
export function deckCorpus(draft) {
  const raw = String(draft ?? "").replace(/\r\n?/g, "\n");
  const model = parseDraft(raw);
  const text = raw.replace(/<!--[\s\S]*?-->/g, "");
  const cases = new Map();
  const sections = new Map();
  for (const sec of model.sections) {
    sections.set(sec.name, sec);
    for (const tc of sec.cases) {
      const m = /^(TC-\S+)\s*[—-]\s*(.*)$/.exec(tc.title);
      const id = m ? m[1] : tc.title;
      // first wins: the test sections come before the addenda, whose
      // "### TC-… " headings (Generated Figures) are not cases
      if (!cases.has(id)) cases.set(id, { id, name: m ? m[2] : tc.title, title: tc.title, section: sec.name, ...tc });
    }
  }
  const pos = sections.get("Positive Tests");
  const neg = sections.get("Negative Tests");
  const tableRows = (name) => {
    const t = sections.get(name)?.blocks.find((b) => b.kind === "table");
    return t ? Math.max(0, t.rows.length - 1) : 0;
  };
  const items = (name) =>
    (sections.get(name)?.blocks || []).filter((b) => b.kind === "task" || b.kind === "bullet").length;
  const figures = [];
  const seen = new Set();
  const addFig = (href, alt, kind, caseId) => {
    const id = fileOf(href);
    if (!id || seen.has(id)) return;
    seen.add(id);
    figures.push({ id, href, alt, kind, case: caseId || "" });
  };
  for (const tc of cases.values()) for (const f of tc.figures) addFig(f.href, f.alt, "story", tc.id);
  const gen = sections.get("Generated Figures");
  if (gen) {
    // the addendum's "### TC-… " headings parse as cases; their image
    // paragraphs sit in each pseudo-case's extra blocks
    const scan = (blocks, cur) => {
      for (const b of blocks) {
        if (b.kind !== "p") continue;
        for (const im of b.text.matchAll(/!\[([^\]]*)\]\(<?([^()<>\s]+)>?\)/g)) addFig(im[2], im[1], "generated", cur);
      }
    };
    scan(gen.blocks, "");
    for (const tc of gen.cases) scan(tc.extra, (/^(TC-\S+)/.exec(tc.title) || [, ""])[1]);
  }
  const counts = {
    cases: cases.size,
    "positive-cases": pos ? pos.cases.length : 0,
    "negative-cases": neg ? neg.cases.length : 0,
    "verify-flags": countVerify(raw),
    "coverage-rows": tableRows("Coverage Map"),
    "open-questions": items("Open Questions"),
    "setup-items": items("Setup / Prerequisites"),
    figures: figures.length,
    issues: tableRows("Issue Trace"),
  };
  return {
    title: model.title, text, norm: norm(text), model, cases, sections, counts, figures,
    isDraft: !!(model.generated || /machine-generated/i.test(raw)),
  };
}

const fileOf = (href) => {
  let name = String(href || "").split("/").pop() || "";
  try { name = decodeURIComponent(name); } catch { /* keep */ }
  return name;
};

// ------------------------------------------------------------- verify

const isStr = (v) => typeof v === "string";
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

/** True when `t` appears verbatim (normalized) in the draft. */
export function grounded(corpus, t) {
  const n = norm(t);
  if (!n) return false;
  if (corpus.norm.includes(n)) return true;
  const bare = n.replace(/[.:;,!]+$/, "");
  return !!bare && corpus.norm.includes(bare);
}

/**
 * Findings for one spec against a corpus; returns {slides, dropped,
 * findings}. `slides` are the survivors, RESOLVED: every region holds
 * literal content (from-references pulled from the draft), every
 * slide carries its pattern's ground and a page-worthy title.
 */
export function verifyDeckSpec(spec, corpus) {
  const out = { slides: [], dropped: [], findings: [] };
  if (!spec || !Array.isArray(spec.slides)) return { ...out, findings: ["spec has no slides array"] };
  spec.slides.forEach((sl, i) => {
    const f = [];
    const say = (m) => f.push(m);
    const resolved = verifySlide(sl, i, corpus, say);
    if (f.length) out.dropped.push({ index: i, pattern: isObj(sl) ? String(sl.pattern ?? "") : "", findings: f });
    else out.slides.push(resolved);
  });
  if (!out.slides.length) out.findings.push("no slide survived the check");
  return out;
}

function verifySlide(sl, i, corpus, say) {
  const at = `slide ${i + 1}`;
  if (!isObj(sl)) { say(`${at}: not an object`); return null; }
  const pattern = sl.pattern;
  if (!PATTERN_NAMES.includes(pattern)) { say(`${at}: unknown pattern "${pattern}"`); return null; }
  const def = PATTERNS[pattern];
  const known = new Set(["pattern", "title", "eyebrow", "tone", "notes", "source", "regions"]);
  for (const k of Object.keys(sl)) if (!known.has(k)) say(`${at}: unknown key "${k}"`);
  const r = { pattern, ground: def.ground, regions: {}, tone: "neutral", title: "", eyebrow: "", notes: "", source: "" };
  // free, capped fields
  r.title = capStr(sl.title, LIMITS.title, `${at}: title`, say, false);
  r.eyebrow = capStr(sl.eyebrow, LIMITS.eyebrow, `${at}: eyebrow`, say, false);
  r.notes = capStr(sl.notes, LIMITS.notes, `${at}: notes`, say, false);
  r.source = capStr(sl.source, LIMITS.label, `${at}: source`, say, false);
  if (sl.tone !== undefined) {
    if (TONES.includes(sl.tone)) r.tone = sl.tone;
    else say(`${at}: tone "${sl.tone}" is not one of ${TONES.join("/")}`);
  }
  const regions = isObj(sl.regions) ? sl.regions : {};
  if (!isObj(sl.regions)) say(`${at}: regions is not an object`);
  for (const k of Object.keys(regions)) if (!def.regions[k]) say(`${at}: pattern ${pattern} has no region "${k}"`);
  for (const [name, rd] of Object.entries(def.regions)) {
    const v = regions[name];
    if (v === undefined || v === null) {
      if (rd.required) say(`${at}: region "${name}" is required for ${pattern}`);
      continue;
    }
    r.regions[name] = verifyRegion(v, rd, `${at}: ${name}`, corpus, say, pattern);
  }
  if (!r.title && ["title", "section", "closing"].includes(pattern) && r.regions.headline) {
    r.title = r.regions.headline;
  }
  if (!r.title && pattern !== "title" && pattern !== "section" && pattern !== "closing" && pattern !== "statement") {
    say(`${at}: a ${pattern} slide needs a title`);
  }
  return r;
}

function capStr(v, max, what, say, required) {
  if (v === undefined || v === null || v === "") {
    if (required) say(`${what} is missing`);
    return "";
  }
  if (!isStr(v)) { say(`${what} is not a string`); return ""; }
  if (v.length > max) say(`${what} is ${v.length} chars (cap ${max})`);
  return v.trim();
}

// a grounded text: a string, or {text} / {from} — returns the literal
function textOf(v, what, corpus, say, max) {
  let t;
  if (isStr(v)) t = v;
  else if (isObj(v) && isStr(v.text)) t = v.text;
  else if (isObj(v) && isObj(v.from)) {
    const pulled = pullText(v.from, corpus, what, say);
    return pulled;
  } else { say(`${what}: not a text`); return ""; }
  if (t.length > max) say(`${what} is ${t.length} chars (cap ${max})`);
  if (!grounded(corpus, t)) say(`${what}: "${cut(t)}" is not in the draft`);
  return t.trim();
}

const cut = (s, n = 60) => (String(s).length > n ? String(s).slice(0, n - 1) + "…" : String(s));

function pullText(from, corpus, what, say) {
  if (isStr(from.case)) {
    const tc = corpus.cases.get(from.case);
    if (!tc) { say(`${what}: case ${from.case} is not in the draft`); return ""; }
    const field = from.field || "expected";
    if (field === "expected") return tc.expected;
    if (field === "trace") return tc.trace;
    if (field === "title") return tc.title;
    if (field === "name") return tc.name;
    say(`${what}: case field "${field}" is not expected/trace/title/name`);
    return "";
  }
  if (isStr(from.section)) {
    const sec = corpus.sections.get(from.section);
    if (!sec) { say(`${what}: section "${from.section}" is not in the draft`); return ""; }
    const field = from.field || "prose";
    if (field === "prose") return sec.blocks.filter((b) => b.kind === "p" && !/^_.*_$/.test(b.text)).map((b) => b.text).join(" ");
    if (field === "note") { const n = sec.blocks.find((b) => b.kind === "p" && /^_.*_$/.test(b.text)); return n ? n.text.replace(/^_|_$/g, "") : ""; }
    if (field === "alert") { const a = sec.blocks.find((b) => b.kind === "alert"); return a ? a.text : ""; }
    say(`${what}: section field "${field}" is not prose/note/alert`);
    return "";
  }
  if (from.overview === "prose") return corpus.model.intro.join(" ");
  if (from.overview === "verify") return corpus.model.verify;
  say(`${what}: from must name a case or a section`);
  return "";
}

// items: an array of strings / {text, checked} / one {from} pulling a list
function itemsOf(v, what, corpus, say, rd, paginates) {
  let list;
  if (isObj(v) && isObj(v.from)) list = pullItems(v.from, corpus, what, say);
  else if (Array.isArray(v)) {
    list = v.map((it, k) => {
      const w = `${what}[${k + 1}]`;
      if (isObj(it) && isObj(it.from)) {
        const pulled = pullItems(it.from, corpus, w, say);
        return pulled;
      }
      const text = textOf(isObj(it) ? { text: it.text } : it, w, corpus, say, LIMITS.item);
      const out = { text };
      if (isObj(it) && it.checked !== undefined) out.checked = !!it.checked;
      if (isObj(it) && it.tone !== undefined) {
        if (TONES.includes(it.tone)) out.tone = it.tone; else say(`${w}: tone "${it.tone}"`);
      }
      return out;
    }).flat();
  } else { say(`${what}: not a list`); return []; }
  if (rd.min && list.length < rd.min) say(`${what}: ${list.length} item(s), the minimum is ${rd.min}`);
  // a list PULLED from the draft is the draft's length — it paginates;
  // a literal list the model wrote past the cap is a finding, except
  // on the patterns whose region paginates by design
  const pulled = isObj(v) && isObj(v.from);
  if (rd.max && list.length > rd.max && !paginates && !pulled) say(`${what}: ${list.length} items (cap ${rd.max})`);
  return list;
}

function pullItems(from, corpus, what, say) {
  if (isStr(from.case)) {
    const tc = corpus.cases.get(from.case);
    if (!tc) { say(`${what}: case ${from.case} is not in the draft`); return []; }
    const field = from.field || "steps";
    if (field === "steps") return tc.steps.map((s) => ({ text: s.text, checked: !!s.checked }));
    if (field === "expected") return [{ text: tc.expected }];
    if (field === "trace") return [{ text: tc.trace }];
    say(`${what}: case field "${field}" is not steps/expected/trace`);
    return [];
  }
  if (isStr(from.section)) {
    const sec = corpus.sections.get(from.section);
    if (!sec) { say(`${what}: section "${from.section}" is not in the draft`); return []; }
    const field = from.field || "items";
    if (field === "items") {
      return sec.blocks.filter((b) => b.kind === "task" || b.kind === "bullet")
        .map((b) => (b.kind === "task" ? { text: b.text, checked: !!b.checked } : { text: b.text }));
    }
    if (field === "cases") return sec.cases.map((tc) => ({ text: tc.title }));
    say(`${what}: section field "${field}" is not items/cases`);
    return [];
  }
  say(`${what}: from must name a case or a section`);
  return [];
}

function cardOf(v, what, corpus, say) {
  if (!isObj(v)) { say(`${what}: not a card`); return null; }
  const card = {
    label: capStr(v.label, LIMITS.label, `${what}: label`, say, false),
    body: textOf(v.body ?? v.text ?? (v.from ? { from: v.from } : undefined), `${what}: body`, corpus, say, LIMITS.cardBody),
    tone: "neutral",
  };
  if (v.tone !== undefined) { if (TONES.includes(v.tone)) card.tone = v.tone; else say(`${what}: tone "${v.tone}"`); }
  if (Array.isArray(v.items)) card.items = itemsOf(v.items, `${what}: items`, corpus, say, { max: 5 }, false);
  return card;
}

function rowsOf(v, what, corpus, say, rd) {
  let rows;
  if (isObj(v) && isObj(v.from)) {
    const from = v.from;
    const sec = isStr(from.section) ? corpus.sections.get(from.section) : null;
    if (!sec) { say(`${what}: section "${from.section}" is not in the draft`); return []; }
    const tables = sec.blocks.filter((b) => b.kind === "table");
    const idx = Number(from.index ?? 0);
    if (!tables[idx]) { say(`${what}: section "${from.section}" has no table ${idx + 1}`); return []; }
    rows = tables[idx].rows;
    if (Array.isArray(from.columns)) {
      const cols = from.columns.map(Number);
      rows = rows.map((r) => cols.map((c) => r[c] ?? ""));
    }
  } else if (Array.isArray(v) && v.every(Array.isArray)) {
    rows = v.map((r, ri) => r.map((c, ci) => textOf(c, `${what}[${ri + 1}][${ci + 1}]`, corpus, say, LIMITS.cell)));
  } else if (isObj(v) && Array.isArray(v.rows)) {
    return rowsOf(v.rows, what, corpus, say, rd);
  } else { say(`${what}: not a table`); return []; }
  if (!rows.length || rows.length < 2) say(`${what}: a table needs a header row and at least one body row`);
  const nCols = Math.max(0, ...rows.map((r) => r.length));
  if (nCols > rd.maxCols) say(`${what}: ${nCols} columns (cap ${rd.maxCols})`);
  return rows.map((r) => r.map((c) => String(c ?? "")));
}

function verifyRegion(v, rd, what, corpus, say, pattern) {
  switch (rd.holds) {
    case "text":
      if (rd.max && rd.max > 1) {
        const arr = Array.isArray(v) ? v : [v];
        if (arr.length > rd.max) say(`${what}: ${arr.length} entries (cap ${rd.max})`);
        return arr.map((t, k) => textOf(t, `${what}[${k + 1}]`, corpus, say, LIMITS.note));
      }
      // free vs grounded single texts
      // the model's own words, capped: the headline (a slide title),
      // a divider's number / strap, a statement's attribution
      if (["headline", "number", "strap", "attribution"].includes(what.split(": ").pop())) {
        return capStr(isObj(v) ? v.text : v, what.endsWith("headline") ? LIMITS.title : LIMITS.label * 2, what, say, false);
      }
      return textOf(v, what, corpus, say, LIMITS.lede);
    case "label+value": {
      if (!Array.isArray(v)) { say(`${what}: not a list`); return []; }
      if (v.length > rd.max) say(`${what}: ${v.length} facts (cap ${rd.max})`);
      return v.map((f, k) => ({
        label: capStr(isObj(f) ? f.label : "", LIMITS.label, `${what}[${k + 1}]: label`, say, true),
        value: textOf(isObj(f) ? f.value : f, `${what}[${k + 1}]: value`, corpus, say, LIMITS.label * 2),
      }));
    }
    case "value+label(+tone)": {
      if (!Array.isArray(v)) { say(`${what}: not a list`); return []; }
      if (v.length < rd.min || v.length > rd.max) say(`${what}: ${v.length} tiles (${rd.min}–${rd.max})`);
      return v.map((t, k) => {
        const w = `${what}[${k + 1}]`;
        if (!isObj(t)) { say(`${w}: not a tile`); return null; }
        const tile = { label: capStr(t.label, LIMITS.label, `${w}: label`, say, true), tone: "neutral", value: "" };
        if (isStr(t.count)) {
          if (COUNTS.includes(t.count)) tile.value = String(corpus.counts[t.count]);
          else say(`${w}: count "${t.count}" is not one of ${COUNTS.join("/")}`);
        } else {
          tile.value = textOf(String(t.value ?? ""), `${w}: value`, corpus, say, LIMITS.statValue);
        }
        if (t.tone !== undefined) { if (TONES.includes(t.tone)) tile.tone = t.tone; else say(`${w}: tone "${t.tone}"`); }
        return tile;
      }).filter(Boolean);
    }
    case "item":
    case "item(+checked)": {
      const paginates = pattern === "checklist" || (pattern === "two-column" && what.endsWith("left"));
      if (pattern === "closing") {
        // the review asks are the model's (capped), not draft quotes
        if (!Array.isArray(v)) { say(`${what}: not a list`); return []; }
        if (v.length > rd.max) say(`${what}: ${v.length} asks (cap ${rd.max})`);
        return v.map((a, k) => ({ text: capStr(isObj(a) ? a.text : a, LIMITS.ask, `${what}[${k + 1}]`, say, true) }));
      }
      if (isObj(v) && !v.from && Array.isArray(v.items)) {
        const items = itemsOf(v.items, what, corpus, say, rd, paginates);
        items.label = capStr(v.label, LIMITS.label, `${what}: label`, say, false);
        return items;
      }
      return itemsOf(v, what, corpus, say, rd, paginates);
    }
    case "card": {
      if (isObj(v) && rd.max === 1) return cardOf(v, what, corpus, say);
      const arr = Array.isArray(v) ? v : [v];
      if (rd.min && arr.length < rd.min) say(`${what}: ${arr.length} card(s), the minimum is ${rd.min}`);
      if (rd.max && arr.length > rd.max) say(`${what}: ${arr.length} cards (cap ${rd.max})`);
      return arr.map((c, k) => cardOf(c, `${what}[${k + 1}]`, corpus, say)).filter(Boolean);
    }
    case "callout": {
      const c = cardOf(v, what, corpus, say);
      if (c && c.body.length > LIMITS.callout) say(`${what}: body is ${c.body.length} chars (cap ${LIMITS.callout})`);
      return c;
    }
    case "panel": {
      if (!isObj(v)) { say(`${what}: not a panel`); return null; }
      const items = itemsOf(v.items, `${what}: items`, corpus, say, { min: 1, max: 5 }, false);
      const panel = { label: capStr(v.label, LIMITS.label, `${what}: label`, say, true), items, tone: "neutral" };
      if (v.tone !== undefined) { if (TONES.includes(v.tone)) panel.tone = v.tone; else say(`${what}: tone "${v.tone}"`); }
      return panel;
    }
    case "rows":
      return rowsOf(v, what, corpus, say, rd);
    case "figure": {
      const ref = isStr(v) ? v : isObj(v) ? v.figure ?? v.id : "";
      if (isObj(v) && isObj(v.spec)) return { spec: v.spec, case: String(v.spec.case ?? "") };
      const id = fileOf(ref);
      const fig = corpus.figures.find((f) => f.id === id || f.href === ref);
      if (!fig) { say(`${what}: figure "${cut(String(ref))}" is not one the draft cites`); return null; }
      return { id: fig.id, href: fig.href, alt: fig.alt, kind: fig.kind, case: fig.case };
    }
    default:
      say(`${what}: unhandled region type ${rd.holds}`);
      return null;
  }
}

// ------------------------------------------------------------- layout
// Text measurement: the draft2pptx estimate (Segoe UI ≈ 0.5 em
// advance, 0.53 leaves slack; display weights wrap earlier).
export function linesOf(text, szPt, wEmu, factor) {
  const perLine = Math.max(8, Math.floor(wEmu / EMU_PER_PT / (szPt * (factor || 0.53))));
  const words = String(text).split(/\s+/);
  let n = 1, len = 0;
  for (const w of words) {
    if (len + w.length + (len ? 1 : 0) > perLine) { n++; len = w.length; }
    else len += w.length + (len ? 1 : 0);
  }
  return n;
}
const lineEmu = (role) => Math.round(D.TYPE[role].line * EMU_PER_PT);
const textH = (text, role, w, factor) => linesOf(text, D.TYPE[role].sz, w, factor) * lineEmu(role);

const IN = 914400;
const ell = (s, n) => (String(s).length > n ? String(s).slice(0, Math.max(0, n - 1)).replace(/\s+\S*$/, "") + "…" : String(s));

/**
 * Resolved slides → [{pattern, ground, title, eyebrow, notes, elements,
 * page}] with every element positioned in EMU. `elements` kinds:
 * text {role, color, runs|text, x,y,w,h, algn, anchor, spc, italic}
 * card {x,y,w,h, fill, line, radius} · pill {text, x,y,w,h, fill, color, role}
 * checkbox {x,y,size,checked} · dot {x,y,size,color} · table {rows, x,y,maxW, accentCol}
 * figure {ref|spec, x,y,w,h} · chevron {text, x,y,w,h, first, fill, color}
 * circle {text, x,y,size, fill, color} · bar {x,y,w,h, fill}
 * Returns {slides, warnings}.
 */
export function layoutDeck(slides, corpus, design) {
  useDesign(design && design.TYPE ? design : designOf(design));
  const out = { slides: [], warnings: [], design: D.id };
  const warn = (m) => out.warnings.push(m);
  let page = 1;
  for (const sl of slides) {
    const pages = layoutSlide(sl, corpus, warn);
    for (const p of pages) { p.page = page++; out.slides.push(p); }
  }
  return out;
}

function layoutSlide(sl, corpus, warn) {
  switch (sl.pattern) {
    case "title": return [layoutTitle(sl, corpus)];
    case "section": return [layoutSection(sl)];
    case "stats": return [layoutStats(sl, warn)];
    case "bullets": return layoutList(sl, sl.regions.items || [], "bullets", warn);
    case "checklist": return layoutList(sl, sl.regions.items || [], "checklist", warn);
    case "two-column": return layoutTwoColumn(sl, warn);
    case "cards": return [layoutCards(sl, warn)];
    case "comparison": return [layoutComparison(sl, warn)];
    case "table": return layoutTable(sl, warn);
    case "flow": return [layoutFlow(sl, warn)];
    case "figure": return [layoutFigure(sl)];
    case "statement": return [layoutStatement(sl, warn)];
    case "closing": return [layoutClosing(sl, corpus)];
    default: return [];
  }
}

// the design in use while a layout runs (layoutDeck sets it; the
// layout is synchronous, so one module-level binding is enough)
let D, C, toneFg, toneBg;
function useDesign(ds) {
  D = ds;
  C = ds.C;
  toneFg = Object.fromEntries(TONES.map((t) => [t, ds.TONE_COLOR[t].fg]));
  toneBg = Object.fromEntries(TONES.map((t) => [t, ds.TONE_COLOR[t].bg]));
}
useDesign(DESIGNS[DEFAULT_DESIGN]);

const el = (kind, props) => ({ kind, ...props });
const text = (role, t, x, y, w, h, extra) =>
  el("text", { role, text: t, x, y, w, h, color: C.ink, sz: D.TYPE[role].sz, line: D.TYPE[role].line, bold: D.TYPE[role].bold, ...(extra || {}) });

// header band on a paper slide: eyebrow (caption1Strong, letter-spaced) + title
function header(sl, cont) {
  const els = [];
  const eyebrow = sl.eyebrow || sl.source || "";
  if (eyebrow) {
    els.push(text("label", eyebrow.toUpperCase(), D.GRID.x(0), D.BANDS.top, D.GRID.span(12), lineEmu("label"),
      { color: toneFg[sl.tone] || C.muted, spc: 250 }));
  }
  const t = (sl.title || "") + (cont || "");
  const role = t.length > 56 ? "title2" : "title";
  els.push(text(role, t, D.GRID.x(0), D.BANDS.top + lineEmu("caption"), D.GRID.span(12), D.BANDS.titleLine, { color: C.ink }));
  return els;
}

function footerEls(planTitle) {
  return [
    text("caption", planTitle, D.GRID.x(0), D.BANDS.footerTop, D.GRID.span(9), D.BANDS.footerH, { color: C.muted }),
    el("pageno", { x: D.GRID.x(9), y: D.BANDS.footerTop, w: D.GRID.span(3), h: D.BANDS.footerH, role: "caption", color: C.muted }),
  ];
}

const basePage = (sl, cont) => ({
  pattern: sl.pattern, ground: sl.ground, title: sl.title, eyebrow: sl.eyebrow, notes: sl.notes,
  cont: cont || "", elements: [],
});

// a labelled card: label caption1Strong in tone, body body1; returns
// {els, h} measured for width w at (x, y)
function cardEls(card, x, y, w, name, opts) {
  const o = opts || {};
  const pad = D.SPACE.l;
  const innerW = w - 2 * pad;
  const fg = toneFg[card.tone] || C.muted;
  const bg = o.onInk ? C.inkSoft : toneBg[card.tone] || C.tint;
  const bodyRole = o.bodyRole || "body";
  let h = pad;
  const els = [];
  if (card.label) {
    els.push(text("label", card.label.toUpperCase(), x + pad, y + h, innerW, lineEmu("label"),
      { color: o.onInk ? C.ice : fg, spc: 250 }));
    h += lineEmu("label") + D.SPACE.s;
  }
  if (card.body) {
    const bh = textH(card.body, bodyRole, innerW);
    els.push(text(bodyRole, card.body, x + pad, y + h, innerW, bh, { color: o.onInk ? C.ice : C.ink, italic: !!o.italic }));
    h += bh;
  }
  if (card.items && card.items.length) {
    for (const it of card.items) {
      const ih = textH(it.text, "body", innerW - D.SPACE.l);
      els.push(el("dot", { x: x + pad + D.SPACE.xxs, y: y + h + D.SPACE.s, size: D.SPACE.s, color: fg }));
      els.push(text("body", it.text, x + pad + D.SPACE.l, y + h, innerW - D.SPACE.l, ih, { color: C.ink }));
      h += ih + D.SPACE.xs;
    }
  }
  h += pad;
  els.unshift(el("card", { x, y, w, h, fill: bg, line: o.onInk ? null : null, radius: "large", name: name || "card" }));
  return { els, h };
}

// ---- title
function layoutTitle(sl, corpus) {
  const p = basePage(sl);
  const R = sl.regions;
  let y = D.BANDS.top + D.SPACE.xxxl;
  p.elements.push(text("label", (R.eyebrow || sl.eyebrow || "TEST PLAN REVIEW").toUpperCase(),
    D.GRID.x(0), y, D.GRID.span(12), lineEmu("label"), { color: C.ice, spc: 300 }));
  y += lineEmu("label") + D.SPACE.l;
  const head = R.headline || sl.title;
  const role = linesOf(head, D.TYPE.hero.sz, D.GRID.span(11), 0.62) <= 2 ? "hero" : "title";
  const hh = textH(head, role, D.GRID.span(11), 0.62);
  p.elements.push(text(role, head, D.GRID.x(0), y, D.GRID.span(11), hh, { color: C.onInk }));
  y += hh + D.SPACE.l;
  if (corpus.isDraft) {
    const t = "DRAFT — MACHINE-GENERATED, UNREVIEWED";
    p.elements.push(el("pill", { text: t, x: D.GRID.x(0), y, h: D.SPACE.xxl + D.SPACE.s, fill: C.amber, color: C.onInk, role: "label" }));
    y += D.SPACE.xxl + D.SPACE.s + D.SPACE.m;
  }
  const sub = R.subtitle || [corpus.model.generated && "Generated " + corpus.model.generated.replace("T", " ").replace("Z", " UTC"),
    corpus.model.story].filter(Boolean).join("  ·  from ");
  if (sub) {
    const sh = textH(sub, "body2", D.GRID.span(10));
    p.elements.push(text("body2", sub, D.GRID.x(0), y, D.GRID.span(10), sh, { color: C.ice }));
  }
  const facts = R.facts || [];
  if (facts.length) {
    const fy = SLIDE_H - D.GRID.margin - lineEmu("label") - lineEmu("subtitle") - D.SPACE.xs;
    const span = Math.max(2, Math.floor(12 / facts.length));
    facts.forEach((f, i) => {
      const fx = D.GRID.x(i * span), fw = D.GRID.span(span) - D.SPACE.l;
      p.elements.push(text("label", f.label.toUpperCase(), fx, fy, fw, lineEmu("label"), { color: C.muted, spc: 200 }));
      p.elements.push(text("subtitle", ell(f.value, 40), fx, fy + lineEmu("label") + D.SPACE.xs, fw, lineEmu("subtitle"), { color: C.onInk }));
    });
  }
  return p;
}

// ---- section
function layoutSection(sl) {
  const p = basePage(sl);
  const R = sl.regions;
  const fg = toneFg[sl.tone] && sl.tone !== "neutral" ? toneFg[sl.tone] : C.ice;
  let y = D.BANDS.bodyTop;
  if (R.number) {
    p.elements.push(text("display", R.number, D.GRID.x(0), y, D.GRID.span(12), lineEmu("display"), { color: fg }));
    y += lineEmu("display") + D.SPACE.s;
  }
  const head = R.headline || sl.title;
  const hh = textH(head, "hero", D.GRID.span(12), 0.62);
  p.elements.push(text("hero", head, D.GRID.x(0), y, D.GRID.span(12), hh, { color: C.onInk }));
  y += hh + D.SPACE.s;
  if (R.strap) p.elements.push(text("body2", R.strap, D.GRID.x(0), y, D.GRID.span(8), lineEmu("body2") * 2, { color: C.ice }));
  if (R.callout) {
    const w = D.GRID.span(7), x = D.GRID.x(5);
    const m = cardEls(R.callout, x, 0, w, "callout", { onInk: true });
    const cy = SLIDE_H - D.GRID.margin - m.h;
    for (const e of m.els) e.y += cy;
    p.elements.push(...m.els);
  }
  return p;
}

// ---- stats
function layoutStats(sl, warn) {
  const p = basePage(sl);
  const R = sl.regions;
  p.elements.push(...header(sl));
  const tiles = R.tiles || [];
  const n = tiles.length;
  const span = Math.floor(12 / n);
  const tileH = lineEmu("hero") + lineEmu("label") + 3 * D.SPACE.l;
  let y = D.BANDS.bodyTop;
  tiles.forEach((t, i) => {
    const x = D.GRID.x(i * span), w = D.GRID.span(span);
    const fg = t.tone === "neutral" ? C.ink : toneFg[t.tone];
    p.elements.push(el("card", { x, y, w, h: tileH, fill: C.paper, line: C.border, radius: "xLarge", name: "tile" }));
    p.elements.push(text("hero", t.value, x + D.SPACE.l, y + D.SPACE.l, w - 2 * D.SPACE.l, lineEmu("hero"), { color: fg }));
    p.elements.push(text("label", t.label, x + D.SPACE.l, y + D.SPACE.l + lineEmu("hero") + D.SPACE.s, w - 2 * D.SPACE.l,
      lineEmu("label"), { color: C.muted }));
  });
  y += tileH + D.SPACE.xxl;
  const hasCallout = !!R.callout;
  if (R.lede) {
    const w = D.GRID.span(hasCallout ? 7 : 12);
    const avail = D.BANDS.bodyBottom - y;
    let lede = R.lede;
    let h = textH(lede, "body2", w);
    if (h > avail) { lede = ell(lede, Math.floor(lede.length * avail / h)); h = avail; warn(`slide "${sl.title}": lede truncated to fit`); }
    p.elements.push(text("label", "SCOPE", D.GRID.x(0), y, w, lineEmu("label"), { color: C.muted, spc: 250 }));
    p.elements.push(text("body2", lede, D.GRID.x(0), y + lineEmu("label") + D.SPACE.xs, w, h, { color: C.ink }));
  }
  if (hasCallout) {
    const m = cardEls(R.callout, D.GRID.x(7), y, D.GRID.span(5), "callout");
    if (y + m.h > D.BANDS.bodyBottom) warn(`slide "${sl.title}": callout runs past the body band`);
    p.elements.push(...m.els);
  }
  return p;
}

// ---- bullets / checklist (paginate)
function layoutList(sl, items, mode, warn) {
  const pages = [];
  const R = sl.regions;
  const role = items.length > 6 ? "body" : "body2";
  const label = items.label || "";
  const listW = D.GRID.span(12) - D.SPACE.xxl - D.SPACE.m;
  const rows = items.map((it) => ({ it, h: Math.max(D.SPACE.xxl, textH(it.text, role, listW)) }));
  // first page carries the lede
  let ledeH = 0;
  if (R.lede) ledeH = textH(R.lede, "body2", D.GRID.span(12)) + D.SPACE.l;
  const chunks = [];
  let cur = [], curH = ledeH + (label ? lineEmu("label") + D.SPACE.s : 0);
  const avail = D.BANDS.bodyBottom - D.BANDS.bodyTop;
  for (const r of rows) {
    if (curH + r.h + D.SPACE.m > avail && cur.length) { chunks.push(cur); cur = []; curH = 0; }
    cur.push(r); curH += r.h + D.SPACE.m;
  }
  if (cur.length || !chunks.length) chunks.push(cur);
  if (chunks.length > 1) warn(`slide "${sl.title}": ${items.length} items paginate over ${chunks.length} slides`);
  chunks.forEach((chunk, ci) => {
    const cont = chunks.length > 1 ? `  (${ci + 1} of ${chunks.length})` : "";
    const p = basePage(sl, cont);
    p.elements.push(...header(sl, cont));
    let y = D.BANDS.bodyTop;
    if (ci === 0 && R.lede) {
      p.elements.push(text("body2", R.lede, D.GRID.x(0), y, D.GRID.span(12), ledeH - D.SPACE.l, { color: C.muted }));
      y += ledeH;
    }
    if (ci === 0 && label) {
      p.elements.push(text("label", label.toUpperCase(), D.GRID.x(0), y, D.GRID.span(12), lineEmu("label"), { color: C.muted, spc: 250 }));
      y += lineEmu("label") + D.SPACE.s;
    }
    chunk.forEach((r, k) => {
      const checked = r.it.checked;
      if (mode === "checklist" || checked !== undefined) {
        p.elements.push(el("checkbox", { x: D.GRID.x(0), y: y + D.SPACE.xxs, size: D.SPACE.xxl, checked: !!checked }));
      } else {
        p.elements.push(el("dot", { x: D.GRID.x(0) + D.SPACE.s, y: y + D.SPACE.m, size: D.SPACE.s + D.SPACE.xxs, color: toneFg[r.it.tone || sl.tone] || C.teal }));
      }
      p.elements.push(text(role, r.it.text, D.GRID.x(0) + D.SPACE.xxl + D.SPACE.m, y, listW, r.h, { color: C.ink, tone: r.it.tone }));
      y += r.h + D.SPACE.m;
    });
    pages.push(p);
  });
  return pages;
}

// ---- two-column (the case pattern): left items paginate, right cards on page 1
function layoutTwoColumn(sl, warn) {
  const R = sl.regions;
  const leftSpan = PATTERNS["two-column"].regions.left.span;
  const items = R.left || [];
  const role = items.length > 6 ? "body" : "body2";
  const leftW = D.GRID.span(leftSpan), rightX = D.GRID.x(leftSpan), rightW = D.GRID.span(12 - leftSpan);
  const listW = leftW - D.SPACE.xxl - D.SPACE.m;
  const rows = items.map((it) => ({ it, h: Math.max(D.SPACE.xxl, textH(it.text, role, listW)) }));
  const labelH = lineEmu("label") + D.SPACE.s;
  const avail = D.BANDS.bodyBottom - D.BANDS.bodyTop - labelH;
  const chunks = [];
  let cur = [], curH = 0;
  for (const r of rows) {
    if (curH + r.h + D.SPACE.m > avail && cur.length) { chunks.push(cur); cur = []; curH = 0; }
    cur.push(r); curH += r.h + D.SPACE.m;
  }
  if (cur.length || !chunks.length) chunks.push(cur);
  if (chunks.length > 1) warn(`slide "${sl.title}": ${items.length} steps paginate over ${chunks.length} slides`);
  const pages = [];
  chunks.forEach((chunk, ci) => {
    const cont = chunks.length > 1 ? `  (${ci + 1} of ${chunks.length})` : "";
    const p = basePage(sl, cont);
    p.elements.push(...header(sl, cont));
    let y = D.BANDS.bodyTop;
    p.elements.push(text("label", (items.label || "Steps").toUpperCase(), D.GRID.x(0), y, leftW, lineEmu("label"), { color: C.muted, spc: 250 }));
    y += labelH;
    chunk.forEach((r) => {
      if (r.it.checked !== undefined) p.elements.push(el("checkbox", { x: D.GRID.x(0), y: y + D.SPACE.xxs, size: D.SPACE.xxl, checked: !!r.it.checked }));
      else p.elements.push(el("dot", { x: D.GRID.x(0) + D.SPACE.s, y: y + D.SPACE.m, size: D.SPACE.s + D.SPACE.xxs, color: toneFg[sl.tone] || C.teal }));
      p.elements.push(text(role, r.it.text, D.GRID.x(0) + D.SPACE.xxl + D.SPACE.m, y, listW, r.h, { color: C.ink }));
      y += r.h + D.SPACE.m;
    });
    if (ci === 0) {
      let ry = D.BANDS.bodyTop;
      for (const card of R.right || []) {
        const m = cardEls(card, rightX, ry, rightW, card.label || "card");
        if (ry + m.h > D.BANDS.bodyBottom) {
          // shrink the body to caption size before giving up
          const m2 = cardEls(card, rightX, ry, rightW, card.label || "card", { bodyRole: "caption" });
          if (ry + m2.h > D.BANDS.bodyBottom) { warn(`slide "${sl.title}": card "${card.label}" does not fit and was dropped`); break; }
          p.elements.push(...m2.els); ry += m2.h + D.SPACE.l; continue;
        }
        p.elements.push(...m.els);
        ry += m.h + D.SPACE.l;
      }
    }
    pages.push(p);
  });
  return pages;
}

// ---- cards: n across
function layoutCards(sl, warn) {
  const p = basePage(sl);
  const R = sl.regions;
  p.elements.push(...header(sl));
  let y = D.BANDS.bodyTop;
  if (R.lede) {
    const h = textH(R.lede, "body2", D.GRID.span(12));
    p.elements.push(text("body2", R.lede, D.GRID.x(0), y, D.GRID.span(12), h, { color: C.muted }));
    y += h + D.SPACE.l;
  }
  const cards = R.cards || [];
  const span = Math.floor(12 / cards.length);
  const measured = cards.map((c, i) => cardEls(c, D.GRID.x(i * span), y, D.GRID.span(span), c.label || "card"));
  let h = Math.max(...measured.map((m) => m.h));
  if (y + h > D.BANDS.bodyBottom) {
    warn(`slide "${sl.title}": cards overflow the body band at body size — caption size used`);
    const m2 = cards.map((c, i) => cardEls(c, D.GRID.x(i * span), y, D.GRID.span(span), c.label || "card", { bodyRole: "caption" }));
    h = Math.min(D.BANDS.bodyBottom - y, Math.max(...m2.map((m) => m.h)));
    for (const m of m2) { m.els[0].h = h; p.elements.push(...m.els); }
    return p;
  }
  for (const m of measured) { m.els[0].h = h; p.elements.push(...m.els); }
  return p;
}

// ---- comparison: two labelled panels
function layoutComparison(sl, warn) {
  const p = basePage(sl);
  const R = sl.regions;
  p.elements.push(...header(sl));
  const y = D.BANDS.bodyTop;
  const panels = [[R.left, D.GRID.x(0)], [R.right, D.GRID.x(6)]];
  const w = D.GRID.span(6);
  const measured = panels.map(([pn, x]) => {
    const card = { label: "", body: "", tone: pn.tone, items: pn.items };
    const m = cardEls(card, x, y + lineEmu("subtitle2") + D.SPACE.s, w, pn.label);
    return { pn, x, m };
  });
  const h = Math.min(D.BANDS.bodyBottom - y - lineEmu("subtitle2") - D.SPACE.s, Math.max(...measured.map((q) => q.m.h)));
  for (const q of measured) {
    if (q.m.h > h) warn(`slide "${sl.title}": panel "${q.pn.label}" clipped to the body band`);
    p.elements.push(el("pill", { text: q.pn.label.toUpperCase(), x: q.x, y, h: lineEmu("subtitle2"), fill: toneBg[q.pn.tone] || C.tint, color: toneFg[q.pn.tone] || C.ink, role: "label" }));
    q.m.els[0].h = h;
    p.elements.push(...q.m.els);
  }
  return p;
}

// ---- table: paginate rows
function layoutTable(sl, warn) {
  const R = sl.regions;
  const rows = R.table || [];
  const header0 = rows[0] || [];
  const body = rows.slice(1);
  const per = PATTERNS.table.regions.table.maxRows;
  const nPages = Math.max(1, Math.ceil(body.length / per));
  if (nPages > 1) warn(`slide "${sl.title}": ${body.length} rows paginate over ${nPages} slides`);
  const pages = [];
  for (let i = 0; i < nPages; i++) {
    const cont = nPages > 1 ? `  (${i + 1} of ${nPages})` : "";
    const p = basePage(sl, cont);
    p.elements.push(...header(sl, cont));
    let y = D.BANDS.bodyTop;
    p.elements.push(el("table", { rows: [header0, ...body.slice(i * per, (i + 1) * per)], x: D.GRID.x(0), y, maxW: D.GRID.span(12), accentCol: sl.tone === "neutral" ? -1 : 0, maxH: D.BANDS.bodyBottom - y }));
    if (i === 0 && R.note) {
      // y/h are placeholders: the renderer measures the native table and
      // sets the note directly under it (the layout cannot know row heights)
      p.elements.push(el("tablenote", { text: R.note, x: D.GRID.x(0), y, w: D.GRID.span(12), h: lineEmu("caption"), role: "caption", color: C.muted, italic: true }));
    }
    pages.push(p);
  }
  return pages;
}

// ---- flow: chevrons across, outcome card beside
function layoutFlow(sl, warn) {
  const p = basePage(sl);
  const R = sl.regions;
  p.elements.push(...header(sl));
  const steps = R.steps || [];
  const hasOut = !!R.outcome;
  const span = hasOut ? 8 : 12;
  const totalW = D.GRID.span(span);
  const gap = D.SPACE.s;
  const w = (totalW - gap * (steps.length - 1)) / steps.length;
  const y = D.BANDS.bodyTop + D.SPACE.xxl;
  const role = steps.length > 4 ? "caption" : "body";
  let h = 0;
  for (const s of steps) h = Math.max(h, textH(s.text, role, w - D.SPACE.xxl * 1.6) + 2 * D.SPACE.l);
  h = Math.max(h, D.SPACE.xxxl * 2);
  if (y + h > D.BANDS.bodyBottom) warn(`slide "${sl.title}": flow steps run past the body band`);
  steps.forEach((s, i) => {
    const x = D.GRID.x(0) + i * (w + gap);
    p.elements.push(el("circle", { text: String(i + 1), x, y: y - D.SPACE.xxl - D.SPACE.s, size: D.SPACE.xxl, fill: toneFg[sl.tone === "neutral" ? "brand" : sl.tone], color: C.onInk }));
    p.elements.push(el("chevron", { text: s.text, x, y, w, h, first: i === 0, fill: toneBg[sl.tone === "neutral" ? "brand" : sl.tone], color: C.ink, role }));
  });
  if (hasOut) {
    const m = cardEls(R.outcome, D.GRID.x(8), y - D.SPACE.xxl - D.SPACE.s, D.GRID.span(4), R.outcome.label || "outcome");
    p.elements.push(...m.els);
  }
  return p;
}

// ---- figure: group in span 8 (12 without aside) + aside notes
function layoutFigure(sl) {
  const p = basePage(sl);
  const R = sl.regions;
  p.elements.push(...header(sl));
  const aside = (R.aside || []).filter(Boolean);
  const span = aside.length ? PATTERNS.figure.regions.figure.span : 12;
  p.elements.push(el("figure", { ref: R.figure, x: D.GRID.x(0), y: D.BANDS.bodyTop, w: D.GRID.span(span), h: D.BANDS.bodyBottom - D.BANDS.bodyTop }));
  if (aside.length) {
    let y = D.BANDS.bodyTop;
    const x = D.GRID.x(span), w = D.GRID.span(12 - span);
    p.elements.push(text("label", "READING NOTES", x, y, w, lineEmu("label"), { color: C.muted, spc: 250 }));
    y += lineEmu("label") + D.SPACE.s;
    aside.forEach((n, i) => {
      const h = textH(n, "body", w - D.SPACE.l);
      p.elements.push(el("circle", { text: String(i + 1), x, y: y + D.SPACE.xxs, size: D.SPACE.xl, fill: C.inkSoft, color: C.onInk }));
      p.elements.push(text("body", n, x + D.SPACE.xl + D.SPACE.s, y, w - D.SPACE.xl - D.SPACE.s, h, { color: C.ink }));
      y += h + D.SPACE.m;
    });
  }
  return p;
}

// ---- statement: one big quote with an accent bar
function layoutStatement(sl, warn) {
  const p = basePage(sl);
  const R = sl.regions;
  if (sl.title) p.elements.push(...header(sl));
  const x = D.GRID.x(1), w = D.GRID.span(10);
  const stmt = R.statement || "";
  let role = "title2";
  let h = textH(stmt, role, w, 0.58);
  const avail = D.BANDS.bodyBottom - D.BANDS.bodyTop - lineEmu("caption") - D.SPACE.l;
  if (h > avail) { role = "subtitle"; h = textH(stmt, role, w, 0.58); }
  if (h > avail) { warn(`slide "${sl.title || "statement"}": statement clipped`); h = avail; }
  const y = D.BANDS.bodyTop + Math.max(0, (avail - h) / 2);
  p.elements.push(el("bar", { x: x - D.SPACE.xl, y, w: D.SPACE.xs, h, fill: toneFg[sl.tone === "neutral" ? "brand" : sl.tone] }));
  p.elements.push(text(role, stmt, x, y, w, h, { color: C.ink }));
  if (R.attribution) {
    p.elements.push(text("caption", "— " + R.attribution, x, y + h + D.SPACE.m, w, lineEmu("caption"), { color: C.muted }));
  }
  return p;
}

// ---- closing (inverted)
function layoutClosing(sl, corpus) {
  const p = basePage(sl);
  const R = sl.regions;
  let y = D.BANDS.bodyTop;
  const head = R.headline || sl.title;
  const hh = textH(head, "title", D.GRID.span(12), 0.62);
  p.elements.push(text("title", head, D.GRID.x(0), y, D.GRID.span(12), hh, { color: C.onInk }));
  y += hh + D.SPACE.xxl;
  for (const [i, a] of (R.asks || []).entries()) {
    const h = Math.max(D.SPACE.xxl + D.SPACE.s, textH(a.text, "body2", D.GRID.span(11)));
    p.elements.push(el("circle", { text: String(i + 1), x: D.GRID.x(0), y, size: D.SPACE.xxl + D.SPACE.s, fill: C.inkSoft, color: C.onInk }));
    p.elements.push(text("body2", a.text, D.GRID.x(0) + D.SPACE.xxxl + D.SPACE.m, y + D.SPACE.xxs, D.GRID.span(11), h, { color: C.ice }));
    y += h + D.SPACE.l;
  }
  p.provenance = corpus.model.provenance || "";
  return p;
}

/** Every element within the canvas — the gate's invariant. */
export function withinCanvas(page) {
  return page.elements.every((e) => {
    const w = e.w ?? e.size ?? 0, h = e.h ?? e.size ?? 0;
    return e.x >= 0 && e.y >= 0 && e.x + w <= SLIDE_W + 1 && e.y + h <= SLIDE_H + 1;
  });
}

export const _internal = { TEST_SECTIONS, IN };
