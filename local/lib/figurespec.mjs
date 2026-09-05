/**
 * figurespec.mjs v1.0 — generated figures for TestPlanGen drafts
 * (`prompts/TestPlanFigures_Prompt.md` v0.1, testplangen.mjs `--figures`).
 * Pure module, no I/O, no AI: the three deterministic halves around
 * the one model call the pass makes.
 *
 *   parseFiguresReply(raw)          the fail-closed sentinel slice +
 *                                   JSON parse (the G9 posture: no
 *                                   sentinels, misordered sentinels,
 *                                   or invalid JSON → throws; nothing
 *                                   is rendered from a partial reply)
 *   draftCorpus(draft)              the per-case grounding corpora:
 *                                   each TC case's section text plus
 *                                   the plan's Setup / Prerequisites
 *                                   section (where the fixture tables
 *                                   live) and the plan title
 *   verifyFigureSpec(spec, corpus)  the grounding + vocabulary check —
 *                                   a list of findings; a spec with
 *                                   ANY finding is dropped, never
 *                                   repaired (the never-invent rule
 *                                   extended to pictures)
 *   renderFigureSvg(spec)           the SVG, in the SlideFigures
 *                                   vocabulary/palette svg2pptx and
 *                                   draft2pptx already consume (one
 *                                   <style> block, one translate
 *                                   group, line/rect/ellipse/circle/
 *                                   polygon/path/text, the two arrow
 *                                   markers) — a palette change edits
 *                                   FIG_STYLE, never the prompt
 *
 * The vocabulary is CLOSED and mirrors the prompt's FIGURE
 * SPECIFICATION VOCABULARY key for key; anything outside it is a
 * finding. Grounding: every id must appear as a whole word in the
 * case's own section or the Setup tables; every measure must appear
 * as a number there AND sit inside its route's range; dates on
 * panels must appear verbatim; tones and kinds are enums. Labels are
 * length-capped, not grounded (the prompt confines them to plan
 * words plus a short connector list — a reviewer reads them beside
 * the case).
 */

export const FIGURES_BEGIN = "[[[FIGURES BEGIN]]]";
export const FIGURES_END = "[[[FIGURES END]]]";

export const KINDS = ["route-measure", "topology", "sequence"];
const EVENT_TONES = ["cool", "warm", "green", "red", "violet", "muted"];
const ROUTE_TONES = ["ink", "muted"];
const NODE_TONES = [...EVENT_TONES, "plain"];
const NODE_SHAPES = ["box", "ellipse", "diamond"];
const MARK_KINDS = ["split", "gap", "retire", "realign", "reassign", "extend", "calibration", "cut", "lock"];
const RANGED_MARKS = new Set(["gap", "retire", "realign", "reassign", "extend"]);
const OUTCOMES = ["ok", "denied", ""];
const LIMITS = {
  caption: 200, label: 24, stepLabel: 40, notes: 3, legend: 6, panels: 3, routes: 3,
  calibration: 8, events: 8, marks: 6, nodesMin: 2, nodesMax: 8, edges: 10,
  actorsMin: 2, actorsMax: 5, stepsMin: 2, stepsMax: 12,
};

/** The reply's JSON object, fail closed. */
export function parseFiguresReply(raw) {
  const s = String(raw ?? "");
  const b = s.indexOf(FIGURES_BEGIN);
  const e = s.lastIndexOf(FIGURES_END);
  if (b < 0 || e <= b) throw new Error("figures reply is missing the FIGURES BEGIN/END sentinels (or they are misordered)");
  let obj;
  try {
    obj = JSON.parse(s.slice(b + FIGURES_BEGIN.length, e).trim());
  } catch (err) {
    throw new Error(`figures reply is not valid JSON between the sentinels: ${err.message}`);
  }
  if (!obj || typeof obj !== "object" || !Array.isArray(obj.figures)) {
    throw new Error('figures reply JSON has no "figures" array');
  }
  return {
    plan: String(obj.plan ?? ""),
    figures: obj.figures,
    skipped: Array.isArray(obj.skipped) ? obj.skipped : [],
  };
}

/** {title, setup, cases: Map<caseId, sectionText>} from a draft body. */
export function draftCorpus(draft) {
  const text = String(draft ?? "").replace(/\r\n?/g, "\n");
  const title = (text.match(/^# (.+)$/m) || [, ""])[1].trim();
  const setupAt = text.indexOf("## Setup / Prerequisites");
  let setup = "";
  if (setupAt >= 0) {
    const rest = text.slice(setupAt + "## Setup / Prerequisites".length);
    const next = rest.indexOf("\n## ");
    setup = next < 0 ? rest : rest.slice(0, next);
  }
  const cases = new Map();
  const re = /^### (TC-[PN]\d+)\b[^\n]*\n/gm;
  const heads = [];
  let m;
  while ((m = re.exec(text))) heads.push({ id: m[1], at: m.index, bodyAt: m.index + m[0].length });
  const bounds = [...text.matchAll(/^###? /gm)].map((x) => x.index);
  for (const h of heads) {
    const end = bounds.find((p) => p >= h.bodyAt);
    cases.set(h.id, text.slice(h.at, end === undefined ? text.length : end));
  }
  return { title, setup, cases };
}

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordIn = (corpus, id) => new RegExp(`(?<![A-Za-z0-9_])${esc(id)}(?![A-Za-z0-9_])`).test(corpus);
const numIn = (corpus, n) => new RegExp(`(?<![0-9.])${esc(String(n))}(?![0-9.])`).test(corpus);
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isStr = (v, max = 1e9) => typeof v === "string" && v.length <= max;

/**
 * Findings for one spec against {title, setup, cases}. Empty = the
 * spec may be rendered. Every finding names the case and the field.
 */
export function verifyFigureSpec(spec, corpus) {
  const f = [];
  const id = spec && typeof spec.case === "string" ? spec.case : "(no case)";
  const say = (msg) => f.push(`${id}: ${msg}`);
  if (!spec || typeof spec !== "object") return ["figure spec is not an object"];
  const section = corpus.cases.get(id);
  if (!section) return [`${id}: not a TC case in the plan`];
  const text = `${corpus.title}\n${corpus.setup}\n${section}`;
  if (!/^R[1-5]$/.test(String(spec.rule ?? ""))) say("rule is not R1..R5");
  if (!KINDS.includes(spec.kind)) say(`kind "${spec.kind}" is not route-measure | topology | sequence`);
  if (!isStr(spec.title, 160) || !spec.title.startsWith(id)) say("title must start with the case id");
  if (!isStr(spec.caption, LIMITS.caption) || !spec.caption.trim()) say(`caption missing or over ${LIMITS.caption} chars`);
  if (spec.notes !== undefined && (!Array.isArray(spec.notes) || spec.notes.length > LIMITS.notes || !spec.notes.every((n) => isStr(n, 120)))) say("notes: at most 3 short strings");
  if (spec.legend !== undefined && (!Array.isArray(spec.legend) || spec.legend.length > LIMITS.legend || !spec.legend.every((n) => isStr(n, 60)))) say("legend: at most 6 short strings");
  const label = (v, where, max = LIMITS.label) => {
    if (v === undefined) return;
    if (!isStr(v, max)) say(`${where} label must be a string of at most ${max} chars`);
  };
  const groundId = (v, where) => {
    if (!isStr(v, 40) || !v.trim()) { say(`${where} id missing`); return; }
    if (!wordIn(text, v)) say(`${where} id "${v}" is not in the case or the Setup tables`);
  };
  const groundNum = (v, where) => {
    if (!isNum(v)) { say(`${where} must be a number`); return false; }
    if (!numIn(text, v)) { say(`${where} ${v} is not a value in the case or the Setup tables`); return false; }
    return true;
  };
  if (spec.kind === "route-measure") {
    const panels = spec.panels;
    if (!Array.isArray(panels) || panels.length < 1 || panels.length > LIMITS.panels) { say("panels: 1 to 3 required"); return f; }
    panels.forEach((p, pi) => {
      const where = `panel ${pi + 1}`;
      if (!p || typeof p !== "object") { say(`${where} is not an object`); return; }
      if (!isStr(p.label ?? "", 40)) say(`${where} label must be a string`);
      else if (p.label && !["Before", "After"].includes(p.label) && !text.includes(p.label)) {
        say(`${where} label "${p.label}" must be Before, After, or a date written in the plan`);
      }
      const routes = Array.isArray(p.routes) ? p.routes : [];
      if (routes.length < 1 || routes.length > LIMITS.routes) say(`${where}: 1 to 3 routes required`);
      const range = new Map();
      for (const r of routes) {
        if (!r || typeof r !== "object") { say(`${where} route is not an object`); continue; }
        groundId(r.id, `${where} route`);
        const okF = groundNum(r.from, `${where} route ${r.id} from`);
        const okT = groundNum(r.to, `${where} route ${r.id} to`);
        if (okF && okT && !(r.from < r.to)) say(`${where} route ${r.id}: from must be < to`);
        if (okF && okT) range.set(r.id, [r.from, r.to]);
        if (r.tone !== undefined && !ROUTE_TONES.includes(r.tone)) say(`${where} route ${r.id} tone must be ink | muted`);
        if (r.arrow !== undefined && typeof r.arrow !== "boolean") say(`${where} route ${r.id} arrow must be boolean`);
        if (r.calibration !== undefined) {
          if (!Array.isArray(r.calibration) || r.calibration.length > LIMITS.calibration) say(`${where} route ${r.id}: calibration is at most 8 numbers`);
          else for (const c of r.calibration) {
            if (groundNum(c, `${where} route ${r.id} calibration`) && okF && okT && (c < r.from || c > r.to)) say(`${where} route ${r.id} calibration ${c} is outside ${r.from}–${r.to}`);
          }
        }
      }
      const inRange = (rid, v, what) => {
        const rg = range.get(rid);
        if (rg && (v < rg[0] || v > rg[1])) say(`${where} ${what} ${v} is outside route ${rid}'s ${rg[0]}–${rg[1]}`);
      };
      const events = Array.isArray(p.events) ? p.events : [];
      if (events.length > LIMITS.events) say(`${where}: at most 8 events`);
      for (const e of events) {
        if (!e || typeof e !== "object") { say(`${where} event is not an object`); continue; }
        groundId(e.id, `${where} event`);
        if (!range.has(e.route)) say(`${where} event ${e.id}: route "${e.route}" is not one of the panel's routes`);
        if (e.at !== undefined) {
          if (groundNum(e.at, `${where} event ${e.id} at`)) inRange(e.route, e.at, `event ${e.id} at`);
        } else {
          const okF = groundNum(e.from, `${where} event ${e.id} from`);
          const okT = groundNum(e.to, `${where} event ${e.id} to`);
          if (okF && okT) {
            if (!(e.from < e.to)) say(`${where} event ${e.id}: from must be < to`);
            inRange(e.route, e.from, `event ${e.id} from`);
            inRange(e.route, e.to, `event ${e.id} to`);
          }
        }
        if (!EVENT_TONES.includes(e.tone ?? "cool")) say(`${where} event ${e.id} tone "${e.tone}" is not a tone`);
      }
      const marks = Array.isArray(p.marks) ? p.marks : [];
      if (marks.length > LIMITS.marks) say(`${where}: at most 6 marks`);
      for (const mk of marks) {
        if (!mk || typeof mk !== "object") { say(`${where} mark is not an object`); continue; }
        if (!MARK_KINDS.includes(mk.kind)) say(`${where} mark kind "${mk.kind}" is not in the vocabulary`);
        if (!range.has(mk.route)) say(`${where} mark ${mk.kind}: route "${mk.route}" is not one of the panel's routes`);
        if (mk.at === undefined && mk.kind !== "lock") say(`${where} mark ${mk.kind} needs "at"`);
        if (mk.at !== undefined && groundNum(mk.at, `${where} mark ${mk.kind} at`)) inRange(mk.route, mk.at, `mark ${mk.kind} at`);
        if (mk.to !== undefined) {
          if (!RANGED_MARKS.has(mk.kind)) say(`${where} mark ${mk.kind} takes no "to"`);
          else if (groundNum(mk.to, `${where} mark ${mk.kind} to`)) {
            inRange(mk.route, mk.to, `mark ${mk.kind} to`);
            if (isNum(mk.at) && !(mk.at < mk.to)) say(`${where} mark ${mk.kind}: at must be < to`);
          }
        }
        label(mk.label, `${where} mark ${mk.kind}`);
      }
    });
  } else if (spec.kind === "topology") {
    const nodes = Array.isArray(spec.nodes) ? spec.nodes : [];
    if (nodes.length < LIMITS.nodesMin || nodes.length > LIMITS.nodesMax) say("nodes: 2 to 8 required");
    const ids = new Set();
    for (const n of nodes) {
      if (!n || typeof n !== "object") { say("node is not an object"); continue; }
      groundId(n.id, "node");
      if (ids.has(n.id)) say(`node id "${n.id}" repeats`);
      ids.add(n.id);
      label(n.label, `node ${n.id}`, 40);
      if (n.shape !== undefined && !NODE_SHAPES.includes(n.shape)) say(`node ${n.id} shape "${n.shape}" is not box | ellipse | diamond`);
      if (n.tone !== undefined && !NODE_TONES.includes(n.tone)) say(`node ${n.id} tone "${n.tone}" is not a tone`);
    }
    const edges = Array.isArray(spec.edges) ? spec.edges : [];
    if (edges.length < 1 || edges.length > LIMITS.edges) say("edges: 1 to 10 required");
    for (const e of edges) {
      if (!e || typeof e !== "object") { say("edge is not an object"); continue; }
      if (!ids.has(e.from)) say(`edge from "${e.from}" is not a node id`);
      if (!ids.has(e.to)) say(`edge to "${e.to}" is not a node id`);
      label(e.label, `edge ${e.from}→${e.to}`, 40);
      if (e.style !== undefined && !["solid", "dashed"].includes(e.style)) say(`edge ${e.from}→${e.to} style must be solid | dashed`);
    }
  } else if (spec.kind === "sequence") {
    const actors = Array.isArray(spec.actors) ? spec.actors : [];
    if (actors.length < LIMITS.actorsMin || actors.length > LIMITS.actorsMax) say("actors: 2 to 5 required");
    const ids = new Set();
    for (const a of actors) {
      if (!a || typeof a !== "object" || !isStr(a.id, 20) || !a.id) { say("actor id missing"); continue; }
      if (ids.has(a.id)) say(`actor id "${a.id}" repeats`);
      ids.add(a.id);
      if (!isStr(a.label, 30) || !a.label.trim()) say(`actor ${a.id} label missing`);
      else if (!new RegExp(`(?<![A-Za-z0-9_])${esc(a.label)}(?![A-Za-z0-9_])`, "i").test(text)) {
        say(`actor label "${a.label}" is not in the case or the Setup tables`);
      }
    }
    const steps = Array.isArray(spec.steps) ? spec.steps : [];
    if (steps.length < LIMITS.stepsMin || steps.length > LIMITS.stepsMax) say("steps: 2 to 12 required");
    for (const st of steps) {
      if (!st || typeof st !== "object") { say("step is not an object"); continue; }
      if (!ids.has(st.from)) say(`step from "${st.from}" is not an actor id`);
      if (!ids.has(st.to)) say(`step to "${st.to}" is not an actor id`);
      if (!isStr(st.label, LIMITS.stepLabel) || !st.label.trim()) say("step label missing or over 40 chars");
      if (st.outcome !== undefined && !OUTCOMES.includes(st.outcome)) say(`step outcome "${st.outcome}" must be ok | denied | ""`);
      if (st.step !== undefined && !(Number.isInteger(st.step) && st.step > 0)) say("step number must be a positive integer");
    }
  }
  return f;
}

// ---- rendering -----------------------------------------------------

// the SlideFigures figStyle() emission — the Diagram Style Framework
// palette svg2pptx resolves classes against; keep byte-identical to
// the sweep's figures so a converter never sees a class it lacks
export const FIG_STYLE =
  "<style>" +
  ".plate{fill:#FFFFFF;stroke:#D7DFDF;stroke-width:1}" +
  ".ln{fill:none;stroke-linecap:round;stroke-linejoin:round}" +
  ".route{stroke:#16302F;stroke-width:3;stroke-dasharray:10 6;stroke-linecap:butt}" +
  ".ctx{stroke:#B9C6C6;stroke-width:2.4}" +
  ".event{stroke-width:8}.flat{stroke-linecap:butt}" +
  ".tick{stroke:#6E8285;stroke-width:1.15}" +
  ".maj{stroke:#4E6265;stroke-width:1.4}" +
  ".leader{stroke:#6E8285;stroke-width:1}" +
  ".split{stroke:#16302F;stroke-width:1.4;stroke-dasharray:3 2.5;opacity:.55}" +
  ".splitdot{fill:#FFFFFF;stroke:#16302F;stroke-width:1.6}" +
  ".edge{stroke:#4E6265;stroke-width:1.8}" +
  ".free{stroke-width:2.2}" +
  ".freefill{stroke-width:2.2;stroke-linejoin:round}" +
  ".dashed{stroke-dasharray:7 4.5}.dotted{stroke-dasharray:1.6 3.6}" +
  ".node{fill:#FFFFFF;stroke:#16302F;stroke-width:1.6}" +
  ".t-plain{fill:#FFFFFF}.t-ink{fill:#E9EDED}.t-muted{fill:#EFF2F2}" +
  ".t-cool{fill:#E5F0F5}.t-warm{fill:#F9F0E2}.t-green{fill:#E6F2EC}" +
  ".t-violet{fill:#EFEAF7}.t-red{fill:#F8E9E5}" +
  ".nlabel{font-size:12px;fill:#16302F;font-weight:500}" +
  ".swatch{stroke-width:5}" +
  ".legend{font-size:10.5px;fill:#4E6265}" +
  ".s-ink{stroke:#16302F}.f-ink{fill:#16302F}" +
  ".s-muted{stroke:#6E8285}.f-muted{fill:#6E8285}" +
  ".s-cool{stroke:#1B6E8C}.f-cool{fill:#1B6E8C}" +
  ".s-warm{stroke:#C2701A}.f-warm{fill:#9C5A12}" +
  ".s-green{stroke:#2E7D5B}.f-green{fill:#2E7D5B}" +
  ".s-violet{stroke:#7A5AA6}.f-violet{fill:#7A5AA6}" +
  ".s-red{stroke:#B2442F}.f-red{fill:#B2442F}" +
  ".event.s-cool,.swatch.s-cool{stroke:#4FA7D5}" +
  ".event.s-warm,.swatch.s-warm{stroke:#E39A45}" +
  ".event.s-green,.swatch.s-green{stroke:#4EB183}" +
  ".event.s-violet,.swatch.s-violet{stroke:#A58BD3}" +
  ".event.s-red,.swatch.s-red{stroke:#DC8168}" +
  "text{font-family:'Segoe UI',system-ui,Roboto,'Helvetica Neue',Arial,sans-serif}" +
  ".measure{font-size:11px;fill:#6E8285;font-variant-numeric:tabular-nums}" +
  ".id{font-size:12.5px;font-weight:600}.note{font-size:12px;fill:#16302F}" +
  "</style>";
const FIG_DEFS =
  '<defs><marker id="ar" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4.4" markerHeight="4.4" orient="auto-start-reverse">' +
  '<path d="M0 0.7 L8 4 L0 7.3 z" fill="#16302F"/></marker>' +
  '<marker id="ae" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4.4" markerHeight="4.4" orient="auto-start-reverse">' +
  '<path d="M0 0.7 L8 4 L0 7.3 z" fill="#4E6265"/></marker></defs>';

const X = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (n) => (Math.round(n * 100) / 100).toString();
const W = 760;
const PAD = 20;
const MARK_TONE = { gap: "muted", retire: "red", realign: "warm", reassign: "violet", extend: "green" };

function text(cls, x, y, s, anchor = "middle") {
  return `<text class="${cls}" x="${fmt(x)}" y="${fmt(y)}" text-anchor="${anchor}" dominant-baseline="central">${X(s)}</text>`;
}

function renderRouteMeasure(spec, out) {
  let y = 0;
  const x0 = 70;
  const x1 = W - PAD * 2 - 60;
  for (const p of spec.panels) {
    if (p.label) { out.push(text("nlabel", 0, y + 8, p.label, "start")); y += 22; }
    const routes = p.routes;
    const lo = Math.min(...routes.map((r) => r.from));
    const hi = Math.max(...routes.map((r) => r.to));
    const sx = (m) => x0 + ((m - lo) / (hi - lo || 1)) * (x1 - x0);
    for (const r of routes) {
      const ry = y + 24;
      const events = (p.events || []).filter((e) => e.route === r.id);
      const marks = (p.marks || []).filter((m) => m.route === r.id);
      out.push(text("id f-ink", x0 - 12, ry, r.id, "end"));
      const cls = r.tone === "muted" ? "ln ctx" : "ln route";
      out.push(`<line class="${cls}" x1="${fmt(sx(r.from))}" y1="${fmt(ry)}" x2="${fmt(sx(r.to))}" y2="${fmt(ry)}"${r.arrow ? ' marker-end="url(#ar)"' : ""}/>`);
      const cal = r.calibration && r.calibration.length ? r.calibration : [r.from, r.to];
      for (const c of cal) {
        out.push(`<line class="ln tick maj" x1="${fmt(sx(c))}" y1="${fmt(ry - 7.5)}" x2="${fmt(sx(c))}" y2="${fmt(ry + 7.5)}"/>`);
        out.push(text("measure", sx(c), ry - 15.5, c));
      }
      // ranged marks ride the route line; point marks cut it
      for (const m of marks) {
        if (RANGED_MARKS.has(m.kind) && m.to !== undefined) {
          const tone = MARK_TONE[m.kind] || "ink";
          const dash = m.kind === "gap" ? " dotted" : "";
          out.push(`<line class="ln event flat s-${tone}${dash}" x1="${fmt(sx(m.at))}" y1="${fmt(ry)}" x2="${fmt(sx(m.to))}" y2="${fmt(ry)}"/>`);
          if (m.label) out.push(text(`id f-${tone}`, (sx(m.at) + sx(m.to)) / 2, ry - 30, m.label));
        } else {
          const mx = m.at === undefined ? sx(r.from) : sx(m.at);
          out.push(`<line class="split" x1="${fmt(mx)}" y1="${fmt(ry - 10.5)}" x2="${fmt(mx)}" y2="${fmt(ry + 10.5 + 16 * events.filter((e) => e.at === undefined).length)}"/>`);
          out.push(`<circle class="splitdot" cx="${fmt(mx)}" cy="${fmt(ry)}" r="3.2"/>`);
          if (m.label) out.push(text("note", mx, ry - 30, m.label));
        }
      }
      let row = 0;
      for (const e of events) {
        const tone = e.tone || "cool";
        if (e.at !== undefined) {
          out.push(`<circle class="node t-${tone} s-${tone}" cx="${fmt(sx(e.at))}" cy="${fmt(ry)}" r="5"/>`);
          out.push(text(`id f-${tone}`, sx(e.at), ry + 16, e.id));
          continue;
        }
        row++;
        const ey = ry + 8 + row * 14;
        out.push(`<line class="ln event flat s-${tone}" x1="${fmt(sx(e.from))}" y1="${fmt(ey)}" x2="${fmt(sx(e.to))}" y2="${fmt(ey)}"/>`);
        out.push(text(`id f-${tone}`, sx(e.to) + 6, ey, e.id, "start"));
      }
      y = ry + 8 + row * 14 + 26;
    }
    y += 10;
  }
  return y;
}

function nodeShape(n, cx, cy, w, h) {
  const tone = n.tone || "plain";
  const strokeTone = tone === "plain" || tone === "ink" ? "ink" : tone;
  const cls = `node t-${tone} s-${strokeTone}`;
  if (n.shape === "ellipse") return `<ellipse class="${cls}" cx="${fmt(cx)}" cy="${fmt(cy)}" rx="${fmt(w / 2)}" ry="${fmt(h / 2)}"/>`;
  if (n.shape === "diamond") {
    return `<polygon class="${cls}" points="${fmt(cx)},${fmt(cy - h / 2)} ${fmt(cx + w / 2)},${fmt(cy)} ${fmt(cx)},${fmt(cy + h / 2)} ${fmt(cx - w / 2)},${fmt(cy)}"/>`;
  }
  return `<rect class="${cls}" x="${fmt(cx - w / 2)}" y="${fmt(cy - h / 2)}" width="${fmt(w)}" height="${fmt(h)}" rx="7"/>`;
}

function renderTopology(spec, out) {
  const nodes = spec.nodes;
  const perRow = nodes.length > 4 ? Math.ceil(nodes.length / 2) : nodes.length;
  const w = 118, h = 48, gapX = 116, gapY = 74;
  const rowW = perRow * w + (perRow - 1) * gapX;
  const left = (W - PAD * 2 - rowW) / 2 + w / 2;
  const pos = new Map();
  nodes.forEach((n, i) => {
    const r = Math.floor(i / perRow), c = i % perRow;
    pos.set(n.id, { x: left + c * (w + gapX), y: 30 + h / 2 + r * (h + gapY) });
  });
  for (const e of spec.edges) {
    const a = pos.get(e.from), b = pos.get(e.to);
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    // trim to the shapes' rims so heads sit on the border
    const ax = a.x + (dx / len) * (Math.abs(dx) > Math.abs(dy) ? w / 2 : h / 2);
    const ay = a.y + (dy / len) * (Math.abs(dx) > Math.abs(dy) ? w / 2 : h / 2);
    const bx = b.x - (dx / len) * (Math.abs(dx) > Math.abs(dy) ? w / 2 + 6 : h / 2 + 6);
    const by = b.y - (dy / len) * (Math.abs(dx) > Math.abs(dy) ? w / 2 + 6 : h / 2 + 6);
    out.push(`<line class="ln edge${e.style === "dashed" ? " dashed" : ""}" x1="${fmt(ax)}" y1="${fmt(ay)}" x2="${fmt(bx)}" y2="${fmt(by)}"${e.arrow === false ? "" : ' marker-end="url(#ae)"'}/>`);
    if (e.label) {
      const vertical = Math.abs(dy) > Math.abs(dx);
      out.push(vertical
        ? text("legend", (ax + bx) / 2 + 8, (ay + by) / 2, e.label, "start")
        : text("legend", (ax + bx) / 2, (ay + by) / 2 - 10, e.label));
    }
  }
  for (const n of nodes) {
    const { x, y } = pos.get(n.id);
    out.push(nodeShape(n, x, y, w, h));
    out.push(text("nlabel", x, y, n.label || n.id));
  }
  const rows = Math.ceil(nodes.length / perRow);
  return 30 + rows * h + (rows - 1) * gapY + 20;
}

function renderSequence(spec, out) {
  const actors = spec.actors;
  const w = 110, h = 36;
  const span = W - PAD * 2 - w;
  const xs = new Map(actors.map((a, i) => [a.id, w / 2 + (actors.length > 1 ? (i * span) / (actors.length - 1) : span / 2)]));
  const top = h / 2 + 6;
  const bottom = top + h / 2 + 30 + spec.steps.length * 34;
  for (const a of actors) {
    const x = xs.get(a.id);
    out.push(`<line class="ln leader dashed" x1="${fmt(x)}" y1="${fmt(top + h / 2)}" x2="${fmt(x)}" y2="${fmt(bottom)}"/>`);
    out.push(nodeShape({ shape: "box", tone: "ink" }, x, top, w, h));
    out.push(text("nlabel", x, top, a.label));
  }
  spec.steps.forEach((st, i) => {
    const y = top + h / 2 + 30 + i * 34;
    const a = xs.get(st.from), b = xs.get(st.to);
    const tone = st.outcome === "denied" ? " s-red dashed" : st.outcome === "ok" ? " s-green" : "";
    const dir = b >= a ? 1 : -1;
    const x1 = a + dir * 4, x2 = b - dir * 8;
    if (a === b) {
      out.push(`<path class="ln edge${tone}" d="M ${fmt(a)} ${fmt(y - 8)} L ${fmt(a + 30)} ${fmt(y - 8)} L ${fmt(a + 30)} ${fmt(y + 8)} L ${fmt(a + 6)} ${fmt(y + 8)}" marker-end="url(#ae)"/>`);
    } else {
      out.push(`<line class="ln edge${tone}" x1="${fmt(x1)}" y1="${fmt(y)}" x2="${fmt(x2)}" y2="${fmt(y)}" marker-end="url(#ae)"/>`);
    }
    const label = (st.step ? `${st.step}. ` : "") + st.label + (st.outcome ? ` — ${st.outcome}` : "");
    // a self-message's label sits to the right of its loop, not on it
    out.push(a === b
      ? text(st.outcome === "denied" ? "note f-red" : "note", a + 38, y, label, "start")
      : text(st.outcome === "denied" ? "note f-red" : "note", (a + b) / 2, y - 10, label));
  });
  return bottom + 12;
}

/** The SVG for a verified spec. */
export function renderFigureSvg(spec) {
  const body = [];
  let y;
  if (spec.kind === "route-measure") y = renderRouteMeasure(spec, body);
  else if (spec.kind === "topology") y = renderTopology(spec, body);
  else y = renderSequence(spec, body);
  // legend + notes ride below the drawing
  if (spec.legend && spec.legend.length) {
    const tones = [];
    for (const p of spec.panels || []) for (const e of p.events || []) tones.push([e.id, e.tone || "cool"]);
    let lx = 0;
    y += 6;
    for (const item of spec.legend) {
      // the LAST panel's tone for an id — the after-state is what the legend names
      const tone = (tones.filter(([id]) => String(item).startsWith(id + " ")).pop() || [, "ink"])[1];
      body.push(`<line class="ln swatch flat s-${tone}" x1="${fmt(lx)}" y1="${fmt(y)}" x2="${fmt(lx + 22)}" y2="${fmt(y)}"/>`);
      body.push(text("legend", lx + 28, y, item, "start"));
      lx += 28 + Math.min(220, 6.2 * String(item).length + 24);
      if (lx > W - PAD * 2 - 200) { lx = 0; y += 18; }
    }
    y += 18;
  }
  for (const n of spec.notes || []) {
    body.push(text("legend", 0, y, n, "start"));
    y += 16;
  }
  const H = Math.max(120, Math.ceil(y + PAD * 2));
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${X(spec.caption)}">` +
    `<title>${X(spec.title)}</title><desc>${X(spec.caption)}</desc>` +
    FIG_STYLE + FIG_DEFS +
    `<rect class="plate" x="1" y="1" width="${W - 2}" height="${H - 2}" rx="6"/>` +
    `<g transform="translate(${PAD},${PAD})">` + body.join("") + "</g></svg>\n"
  );
}

/** The sibling file name a rendered figure takes beside its draft. */
export function figureFileName(draftStem, spec) {
  return `${draftStem}--fig-${String(spec.case).toLowerCase()}.svg`;
}
