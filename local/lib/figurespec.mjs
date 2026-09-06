/**
 * figurespec.mjs v1.3 — generated figures for TestPlanGen drafts
 * (`prompts/TestPlanFigures_Prompt.md` v0.4, testplangen.mjs `--figures`).
 *
 * v1.3 (figure variety — testplangen/CHANGES.md v2.43): five more
 * figure KINDS beside route-measure / topology / sequence, each with
 * its own closed vocabulary, grounding check, and SlideFigures-palette
 * renderer — "timeline" (dates on an ordinal time axis with spans and
 * points, for time-aware cases), "state" (a lifecycle: named states
 * and the transitions between them, a denied transition dashed red),
 * "matrix" (a combinations grid: input dimensions × outcomes, one
 * figure for a whole parameterized family), "wireframe" (a low-
 * fidelity sketch of ONE named pane/dialog with the controls, values
 * and messages the Steps name, step numbers as callouts) and
 * "workflow" (a flowchart of the Steps: start/step/decision/end
 * nodes ranked top-down, branches labelled). Every id, date, state,
 * control label and value is grounded in the case or the Setup
 * tables exactly as before; labels stay length-capped. Two classes
 * join FIG_STYLE for the new shapes (`.frame`, `.cell`) — the
 * converter resolves classes from the SVG's own style block, so
 * svg2pptx / deck2pptx need no change. Route-measure rendering is
 * byte-identical to v1.2.
 *
 * v1.2 (change made visible — testplangen/CHANGES.md v2.41): every
 * panel of a route-measure figure shares ONE measure scale, so an
 * extended route grows on the page instead of being rescaled to
 * fit; and each panel after the first is diffed against the panel
 * before it — an event whose extent changed keeps a dotted muted
 * ghost of its prior extent under its bar (a moved point keeps a
 * hollow ghost dot), an event that left the route keeps a ghost row,
 * a route whose extent shrank shows its prior extent dotted behind
 * the line, and a "prior extent" key joins the legend. Tones stay
 * the model's (they carry meaning); the diff adds structure only.
 * No spec vocabulary change.
 *
 * v1.1 (route-measure legibility — testplangen/CHANGES.md v2.40):
 * a route may carry `"ticks": <interval>` — unlabelled intermediate
 * ticks between the labelled calibration points (labelled too when
 * they fit); every line event's ends and every point event carry
 * their measure as a small label; and every text in a route-measure
 * panel goes through a collision-aware placer (estimated text
 * boxes, ordered candidate positions, a bounded vertical nudge)
 * so labels never sit on each other, on the route, or on a bar.
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
 * finding. Grounding posture per kind (v1.3): ids (routes, events,
 * spans, points) are whole-word matches, case-sensitive; dates are
 * verbatim substrings; states, matrix row/column ids, wireframe
 * titles, control labels, values and table columns are whole-word
 * PHRASE matches, case-insensitive (the plan writes "Active" and
 * "active" for the same state); workflow node labels and sequence
 * step labels are length-capped only, like every other label.
 * Grounding: every id must appear as a whole word in the
 * case's own section or the Setup tables; every measure must appear
 * as a number there AND sit inside its route's range; dates on
 * panels must appear verbatim; tones and kinds are enums. Labels are
 * length-capped, not grounded (the prompt confines them to plan
 * words plus a short connector list — a reviewer reads them beside
 * the case).
 */

export const FIGURES_BEGIN = "[[[FIGURES BEGIN]]]";
export const FIGURES_END = "[[[FIGURES END]]]";

export const KINDS = ["route-measure", "topology", "sequence", "timeline", "state", "matrix", "wireframe", "workflow"];
export const RULES = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"]; // v1.3: R6 lifecycle, R7 combinations, R8 UI, R9 procedure
const CONTROL_KINDS = ["field", "dropdown", "button", "checkbox", "radio", "table", "list", "message", "map", "text"];
const FRAME_KINDS = ["pane", "dialog", "window"];
const STATE_SHAPES = ["ellipse", "box"];
const FLOW_KINDS = ["start", "step", "decision", "end"];
const CHECKED = ["checked", "unchecked"];
const CELL_TONE = { ok: "green", denied: "red", "n/a": "muted" }; // default cell tone by value
const EVENT_TONES = ["cool", "warm", "green", "red", "violet", "muted"];
const ROUTE_TONES = ["ink", "muted"];
const NODE_TONES = [...EVENT_TONES, "plain"];
const NODE_SHAPES = ["box", "ellipse", "diamond"];
const MARK_KINDS = ["split", "gap", "retire", "realign", "reassign", "extend", "calibration", "cut", "lock"];
const RANGED_MARKS = new Set(["gap", "retire", "realign", "reassign", "extend"]);
const OUTCOMES = ["ok", "denied", ""];
const LIMITS = {
  caption: 200, label: 24, stepLabel: 40, notes: 3, legend: 6, panels: 3, routes: 3,
  calibration: 8, ticks: 60, events: 8, marks: 6, nodesMin: 2, nodesMax: 8, edges: 10,
  actorsMin: 2, actorsMax: 5, stepsMin: 2, stepsMax: 12,
  // v1.3
  axisMin: 2, axisMax: 8, spans: 8, points: 8,
  statesMin: 2, statesMax: 6, transitionsMin: 1, transitionsMax: 10,
  rowsMin: 2, rowsMax: 8, colsMin: 2, colsMax: 6, cells: 48, cellValue: 12,
  controlsMin: 2, controlsMax: 12, controlLabel: 40, messageLabel: 80, columns: 5,
  flowMin: 3, flowMax: 10, flowLabel: 32, flowEdgesMin: 2, flowEdgesMax: 14, flowEdgeLabel: 16,
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
// v1.3: a whole-word phrase, case-insensitive — states, UI labels, matrix axes
const phraseIn = (corpus, s) => new RegExp(`(?<![A-Za-z0-9_])${esc(String(s).trim())}(?![A-Za-z0-9_])`, "i").test(corpus);
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
  if (!RULES.includes(String(spec.rule ?? ""))) say("rule is not R1..R9");
  if (!KINDS.includes(spec.kind)) say(`kind "${spec.kind}" is not one of ${KINDS.join(" | ")}`);
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
        if (r.ticks !== undefined) {
          // v1.1: a rendering choice, not test data — never grounded,
          // but bounded so a figure stays a schematic, not a ruler
          if (!isNum(r.ticks) || r.ticks <= 0) say(`${where} route ${r.id} ticks must be a positive number`);
          else if (okF && okT && (r.to - r.from) / r.ticks > LIMITS.ticks) {
            say(`${where} route ${r.id} ticks ${r.ticks} would draw ${Math.floor((r.to - r.from) / r.ticks)} ticks — at most ${LIMITS.ticks}`);
          }
        }
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
  } else if (spec.kind === "timeline") {
    // v1.3: dates on an ordinal axis — every date verbatim in the plan,
    // every span/point end one of the axis dates
    const axis = Array.isArray(spec.axis) ? spec.axis : [];
    if (axis.length < LIMITS.axisMin || axis.length > LIMITS.axisMax) say("axis: 2 to 8 dates required");
    const seen = new Set();
    axis.forEach((d, i) => {
      if (!isStr(d, 40) || !d.trim()) { say(`axis entry ${i + 1} must be a date string`); return; }
      if (seen.has(d)) say(`axis date "${d}" repeats`);
      seen.add(d);
      if (!text.includes(d)) say(`axis date "${d}" is not written in the case or the Setup tables`);
    });
    const idx = (d) => axis.indexOf(d);
    const spans = Array.isArray(spec.spans) ? spec.spans : [];
    const points = Array.isArray(spec.points) ? spec.points : [];
    if (spans.length > LIMITS.spans) say("spans: at most 8");
    if (points.length > LIMITS.points) say("points: at most 8");
    if (!spans.length && !points.length) say("timeline needs at least one span or point");
    for (const sp of spans) {
      if (!sp || typeof sp !== "object") { say("span is not an object"); continue; }
      groundId(sp.id, "span");
      if (idx(sp.from) < 0) say(`span ${sp.id} from "${sp.from}" is not an axis date`);
      if (sp.to !== undefined) {
        if (idx(sp.to) < 0) say(`span ${sp.id} to "${sp.to}" is not an axis date`);
        else if (idx(sp.from) >= 0 && !(idx(sp.from) < idx(sp.to))) say(`span ${sp.id}: from must precede to on the axis`);
      }
      label(sp.label, `span ${sp.id}`);
      if (sp.tone !== undefined && !EVENT_TONES.includes(sp.tone)) say(`span ${sp.id} tone "${sp.tone}" is not a tone`);
    }
    for (const pt of points) {
      if (!pt || typeof pt !== "object") { say("point is not an object"); continue; }
      groundId(pt.id, "point");
      if (idx(pt.at) < 0) say(`point ${pt.id} at "${pt.at}" is not an axis date`);
      label(pt.label, `point ${pt.id}`);
      if (pt.tone !== undefined && !EVENT_TONES.includes(pt.tone)) say(`point ${pt.id} tone "${pt.tone}" is not a tone`);
    }
  } else if (spec.kind === "state") {
    // v1.3: a lifecycle — state ids are plan words (case-insensitive)
    const states = Array.isArray(spec.states) ? spec.states : [];
    if (states.length < LIMITS.statesMin || states.length > LIMITS.statesMax) say("states: 2 to 6 required");
    const ids = new Set();
    for (const st of states) {
      if (!st || typeof st !== "object" || !isStr(st.id, 40) || !st.id.trim()) { say("state id missing"); continue; }
      if (ids.has(st.id)) say(`state id "${st.id}" repeats`);
      ids.add(st.id);
      if (!phraseIn(text, st.id)) say(`state "${st.id}" is not in the case or the Setup tables`);
      label(st.label, `state ${st.id}`);
      if (st.shape !== undefined && !STATE_SHAPES.includes(st.shape)) say(`state ${st.id} shape must be ellipse | box`);
      if (st.tone !== undefined && !NODE_TONES.includes(st.tone)) say(`state ${st.id} tone "${st.tone}" is not a tone`);
    }
    const trans = Array.isArray(spec.transitions) ? spec.transitions : [];
    if (trans.length < LIMITS.transitionsMin || trans.length > LIMITS.transitionsMax) say("transitions: 1 to 10 required");
    for (const t of trans) {
      if (!t || typeof t !== "object") { say("transition is not an object"); continue; }
      if (!ids.has(t.from)) say(`transition from "${t.from}" is not a state id`);
      if (!ids.has(t.to)) say(`transition to "${t.to}" is not a state id`);
      label(t.label, `transition ${t.from}→${t.to}`, LIMITS.stepLabel);
      if (t.outcome !== undefined && !OUTCOMES.includes(t.outcome)) say(`transition ${t.from}→${t.to} outcome must be ok | denied | ""`);
      if (t.step !== undefined && !(Number.isInteger(t.step) && t.step > 0)) say("transition step number must be a positive integer");
    }
    if (spec.initial !== undefined && !ids.has(spec.initial)) say(`initial "${spec.initial}" is not a state id`);
  } else if (spec.kind === "matrix") {
    // v1.3: a combinations grid — axis ids are plan phrases, cell
    // values a short closed set or a short label
    const rows = Array.isArray(spec.rows) ? spec.rows : [];
    const cols = Array.isArray(spec.cols) ? spec.cols : [];
    if (rows.length < LIMITS.rowsMin || rows.length > LIMITS.rowsMax) say("rows: 2 to 8 required");
    if (cols.length < LIMITS.colsMin || cols.length > LIMITS.colsMax) say("cols: 2 to 6 required");
    const axisIds = (list, what) => {
      const ids = new Set();
      for (const a of list) {
        if (!a || typeof a !== "object" || !isStr(a.id, 40) || !a.id.trim()) { say(`${what} id missing`); continue; }
        if (ids.has(a.id)) say(`${what} id "${a.id}" repeats`);
        ids.add(a.id);
        if (!phraseIn(text, a.id)) say(`${what} "${a.id}" is not in the case or the Setup tables`);
        label(a.label, `${what} ${a.id}`);
      }
      return ids;
    };
    const rowIds = axisIds(rows, "row");
    const colIds = axisIds(cols, "col");
    label(spec.rowsTitle, "rowsTitle");
    label(spec.colsTitle, "colsTitle");
    const cells = Array.isArray(spec.cells) ? spec.cells : [];
    if (cells.length < 1 || cells.length > LIMITS.cells) say("cells: 1 to 48 required");
    const filled = new Set();
    for (const c of cells) {
      if (!c || typeof c !== "object") { say("cell is not an object"); continue; }
      if (!rowIds.has(c.row)) say(`cell row "${c.row}" is not a row id`);
      if (!colIds.has(c.col)) say(`cell col "${c.col}" is not a col id`);
      const key = `${c.row}\u0000${c.col}`;
      if (filled.has(key)) say(`cell ${c.row} × ${c.col} repeats`);
      filled.add(key);
      if (!isStr(c.value, LIMITS.cellValue) || !c.value.trim()) say(`cell ${c.row} × ${c.col} value missing or over ${LIMITS.cellValue} chars`);
      if (c.tone !== undefined && !NODE_TONES.includes(c.tone)) say(`cell ${c.row} × ${c.col} tone "${c.tone}" is not a tone`);
    }
  } else if (spec.kind === "wireframe") {
    // v1.3: ONE named pane/dialog; every control label, value and
    // table column is a phrase the case or the Setup tables write
    const fr = spec.frame;
    if (!fr || typeof fr !== "object") say("frame missing");
    else {
      if (!isStr(fr.title, 40) || !fr.title.trim()) say("frame title missing or over 40 chars");
      else if (!phraseIn(text, fr.title)) say(`frame title "${fr.title}" is not in the case or the Setup tables`);
      if (fr.kind !== undefined && !FRAME_KINDS.includes(fr.kind)) say(`frame kind "${fr.kind}" must be pane | dialog | window`);
    }
    const controls = Array.isArray(spec.controls) ? spec.controls : [];
    if (controls.length < LIMITS.controlsMin || controls.length > LIMITS.controlsMax) say("controls: 2 to 12 required");
    controls.forEach((c, i) => {
      const where = `control ${i + 1}`;
      if (!c || typeof c !== "object") { say(`${where} is not an object`); return; }
      if (!CONTROL_KINDS.includes(c.kind)) say(`${where} kind "${c.kind}" is not in the vocabulary`);
      const max = c.kind === "message" ? LIMITS.messageLabel : LIMITS.controlLabel;
      if (!isStr(c.label, max) || !c.label.trim()) say(`${where} label missing or over ${max} chars`);
      else if (!phraseIn(text, c.label)) say(`${where} label "${c.label}" is not in the case or the Setup tables`);
      if (c.value !== undefined) {
        if (c.kind === "checkbox" || c.kind === "radio") {
          if (!CHECKED.includes(c.value)) say(`${where} ${c.kind} value must be checked | unchecked`);
        } else if (!isStr(c.value, 40) || !c.value.trim()) say(`${where} value must be a string of at most 40 chars`);
        else if (!phraseIn(text, c.value)) say(`${where} value "${c.value}" is not in the case or the Setup tables`);
      }
      if (c.columns !== undefined) {
        if (c.kind !== "table") say(`${where} ${c.kind} takes no "columns"`);
        else if (!Array.isArray(c.columns) || c.columns.length > LIMITS.columns || !c.columns.every((h) => isStr(h, 16) && h.trim())) say(`${where} columns: at most 5 short strings`);
        else for (const h of c.columns) if (!phraseIn(text, h)) say(`${where} column "${h}" is not in the case or the Setup tables`);
      }
      if (c.tone !== undefined && !NODE_TONES.includes(c.tone)) say(`${where} tone "${c.tone}" is not a tone`);
      if (c.step !== undefined && !(Number.isInteger(c.step) && c.step > 0)) say(`${where} step number must be a positive integer`);
    });
  } else if (spec.kind === "workflow") {
    // v1.3: a flowchart of the Steps — node ids are the spec's own
    // handles (not test data), labels length-capped like sequence steps
    const nodes = Array.isArray(spec.nodes) ? spec.nodes : [];
    if (nodes.length < LIMITS.flowMin || nodes.length > LIMITS.flowMax) say("nodes: 3 to 10 required");
    const ids = new Set();
    for (const n of nodes) {
      if (!n || typeof n !== "object" || !isStr(n.id, 20) || !n.id.trim()) { say("node id missing"); continue; }
      if (ids.has(n.id)) say(`node id "${n.id}" repeats`);
      ids.add(n.id);
      if (!FLOW_KINDS.includes(n.kind)) say(`node ${n.id} kind "${n.kind}" is not start | step | decision | end`);
      if (!isStr(n.label, LIMITS.flowLabel) || !n.label.trim()) say(`node ${n.id} label missing or over ${LIMITS.flowLabel} chars`);
      if (n.tone !== undefined && !NODE_TONES.includes(n.tone)) say(`node ${n.id} tone "${n.tone}" is not a tone`);
      if (n.step !== undefined && !(Number.isInteger(n.step) && n.step > 0)) say(`node ${n.id} step number must be a positive integer`);
    }
    const edges = Array.isArray(spec.edges) ? spec.edges : [];
    if (edges.length < LIMITS.flowEdgesMin || edges.length > LIMITS.flowEdgesMax) say("edges: 2 to 14 required");
    for (const e of edges) {
      if (!e || typeof e !== "object") { say("edge is not an object"); continue; }
      if (!ids.has(e.from)) say(`edge from "${e.from}" is not a node id`);
      if (!ids.has(e.to)) say(`edge to "${e.to}" is not a node id`);
      label(e.label, `edge ${e.from}→${e.to}`, LIMITS.flowEdgeLabel);
      if (e.style !== undefined && !["solid", "dashed"].includes(e.style)) say(`edge ${e.from}→${e.to} style must be solid | dashed`);
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
  ".frame{fill:#FFFFFF;stroke:#16302F;stroke-width:1.6}" +  // v1.3: a container that owns no label
  ".cell{fill:#FFFFFF;stroke:#B9C6C6;stroke-width:1}" +      // v1.3: an empty matrix cell
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
const PRIOR_KEY = "prior extent (earlier panel)"; // v1.2: the renderer's own legend key

function text(cls, x, y, s, anchor = "middle") {
  return `<text class="${cls}" x="${fmt(x)}" y="${fmt(y)}" text-anchor="${anchor}" dominant-baseline="central">${X(s)}</text>`;
}

// ---- label placement (v1.1) ------------------------------------------
// Estimated text boxes in the figure's own units — no font metrics
// at render time, so widths are per-class averages of Segoe UI at the
// palette's sizes, padded a little; a placer keeps every box (and
// the geometry labels must not cross) and tries a label's candidate
// positions in order, then nudges the first candidate vertically a
// bounded number of times. A required label lands on its first
// candidate when nothing is free (an overlap beats a missing id); an
// optional one (a measure) is dropped instead.
const CHAR_W = { measure: 6.3, id: 7.4, note: 6.8, legend: 6, nlabel: 6.9 };
const TEXT_H = { measure: 11, id: 13, note: 12.5, legend: 11, nlabel: 12.5 };
const baseCls = (cls) => String(cls).split(" ")[0];
function textBox(cls, x, y, str, anchor) {
  const w = String(str).length * (CHAR_W[baseCls(cls)] || 6.6) + 3;
  const h = (TEXT_H[baseCls(cls)] || 12.5) + 1;
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return { x0, x1: x0 + w, y0: y - h / 2, y1: y + h / 2 };
}
class Placer {
  constructor() { this.boxes = []; this.maxY = -Infinity; this.minY = Infinity; }
  reserve(b) { this.boxes.push(b); this.maxY = Math.max(this.maxY, b.y1); this.minY = Math.min(this.minY, b.y0); }
  wall(b) { this.boxes.push(b); } // v1.3: an obstacle that never counts toward the drawing's extent
  free(b) { return !this.boxes.some((o) => b.x0 < o.x1 && o.x0 < b.x1 && b.y0 < o.y1 && o.y0 < b.y1); }
  /** Emits the text at the first free candidate; returns the box or null. */
  place(out, cls, str, candidates, { required = true, nudges = 3 } = {}) {
    const tried = [];
    for (const c of candidates) {
      const b = textBox(cls, c.x, c.y, str, c.anchor);
      tried.push({ c, b });
      if (this.free(b)) return this.emit(out, cls, c, str, b);
    }
    // bounded vertical nudge off the first candidate: down, up, down…
    const { c, b } = tried[0];
    const step = b.y1 - b.y0 + 1;
    for (let k = 1; k <= nudges; k++) {
      for (const dir of [1, -1]) {
        const cc = { ...c, y: c.y + dir * k * step };
        const bb = textBox(cls, cc.x, cc.y, str, cc.anchor);
        if (this.free(bb)) return this.emit(out, cls, cc, str, bb);
      }
    }
    return required ? this.emit(out, cls, c, str, b) : null;
  }
  emit(out, cls, c, str, b) { out.push(text(cls, c.x, c.y, str, c.anchor)); this.reserve(b); return b; }
}
const near = (a, b) => Math.abs(a - b) < 1e-6;
const tickValues = (r) => {
  // the intermediate tick measures of a route: multiples of the
  // interval inside from..to, minus the calibration points
  if (!isNum(r.ticks) || r.ticks <= 0) return [];
  const cal = r.calibration && r.calibration.length ? r.calibration : [r.from, r.to];
  const vals = [];
  const n0 = Math.ceil(r.from / r.ticks - 1e-9), n1 = Math.floor(r.to / r.ticks + 1e-9);
  for (let n = n0; n <= n1 && vals.length <= LIMITS.ticks; n++) {
    const v = Math.round(n * r.ticks * 1e6) / 1e6;
    if (!cal.some((c) => near(c, v))) vals.push(v);
  }
  return vals;
};

const sameExtent = (a, b) =>
  a.at !== undefined || b.at !== undefined ? near(a.at ?? NaN, b.at ?? NaN) : near(a.from, b.from) && near(a.to, b.to);

/**
 * v1.2: the prior-state ghosts a panel draws for one of its routes,
 * diffed against the panel before it — {route: prior extent or null,
 * under: Map<eventId, prior event on this route>, gone: prior events
 * of this route that the panel no longer shows here}.
 */
function panelDiff(prev, p, r) {
  const none = { route: null, under: new Map(), gone: [] };
  if (!prev) return none;
  const pr = (prev.routes || []).find((x) => x.id === r.id);
  const route = pr && !(near(pr.from, r.from) && near(pr.to, r.to)) ? pr : null;
  const now = new Map((p.events || []).map((e) => [e.id, e]));
  const under = new Map();
  const gone = [];
  for (const pe of prev.events || []) {
    if (pe.route !== r.id) continue;
    const e = now.get(pe.id);
    if (!e || e.route !== r.id) gone.push(pe);
    else if (!sameExtent(pe, e)) under.set(e.id, pe);
  }
  return { route, under, gone };
}

function renderRouteMeasure(spec, out, meta = {}) {
  let y = 0;
  const x0 = 70;
  const x1 = W - PAD * 2 - 60;
  const ROW = 26; // line-event pitch: a bar plus its end measures
  // v1.2: ONE scale for the whole figure — a before/after pair reads
  // as change only when both panels measure the same way
  const all = spec.panels.flatMap((p) => p.routes);
  const lo = Math.min(...all.map((r) => r.from));
  const hi = Math.max(...all.map((r) => r.to));
  const sx = (m) => x0 + ((m - lo) / (hi - lo || 1)) * (x1 - x0);
  spec.panels.forEach((p, pi) => {
    const prev = pi > 0 ? spec.panels[pi - 1] : null;
    const placer = new Placer();
    if (p.label) {
      const b = textBox("nlabel", 0, y + 8, p.label, "start");
      out.push(text("nlabel", 0, y + 8, p.label, "start"));
      placer.reserve(b);
      y += 22;
    }
    const routes = p.routes;
    for (const r of routes) {
      const ry = y + 36;
      const diff = panelDiff(prev, p, r);
      const events = (p.events || []).filter((e) => e.route === r.id);
      const marks = (p.marks || []).filter((m) => m.route === r.id);
      const lineEvents = events.filter((e) => e.at === undefined);
      const pointEvents = events.filter((e) => e.at !== undefined);
      const goneLines = diff.gone.filter((e) => e.at === undefined);
      const gonePoints = diff.gone.filter((e) => e.at !== undefined);
      placer.place(out, "id f-ink", r.id, [{ x: x0 - 12, y: ry, anchor: "end" }]);
      // v1.2: the prior extent of a route that changed, dotted behind
      // the line — visible where the route no longer reaches
      if (diff.route) {
        meta.ghost = true;
        out.push(`<line class="ln ctx dotted" x1="${fmt(sx(diff.route.from))}" y1="${fmt(ry)}" x2="${fmt(sx(diff.route.to))}" y2="${fmt(ry)}"/>`);
        placer.reserve({ x0: sx(diff.route.from) - 2, x1: sx(diff.route.to) + 2, y0: ry - 4, y1: ry + 4 });
      }
      const cls = r.tone === "muted" ? "ln ctx" : "ln route";
      out.push(`<line class="${cls}" x1="${fmt(sx(r.from))}" y1="${fmt(ry)}" x2="${fmt(sx(r.to))}" y2="${fmt(ry)}"${r.arrow ? ' marker-end="url(#ar)"' : ""}/>`);
      placer.reserve({ x0: sx(r.from) - 2, x1: sx(r.to) + (r.arrow ? 10 : 2), y0: ry - 4, y1: ry + 4 });
      // geometry first, so labels route around it: bars (ghost rows
      // for events that left this route follow the live ones), points,
      // marks
      const bars = [
        ...lineEvents.map((e) => ({ e, ghost: false })),
        ...goneLines.map((e) => ({ e, ghost: true })),
      ].map((b, i) => ({ ...b, ey: ry + 8 + (i + 1) * ROW }));
      for (const { e, ey } of bars) placer.reserve({ x0: sx(e.from) - 1, x1: sx(e.to) + 1, y0: ey - 5, y1: ey + 5 });
      for (const { e, ey } of bars) {
        const pe = diff.under.get(e.id);
        if (pe && pe.at === undefined) placer.reserve({ x0: sx(pe.from) - 1, x1: sx(pe.to) + 1, y0: ey - 5, y1: ey + 5 });
      }
      for (const e of pointEvents) placer.reserve({ x0: sx(e.at) - 6, x1: sx(e.at) + 6, y0: ry - 6, y1: ry + 6 });
      for (const e of gonePoints) placer.reserve({ x0: sx(e.at) - 6, x1: sx(e.at) + 6, y0: ry - 6, y1: ry + 6 });
      // calibration: labelled major ticks (above the route first)
      const cal = r.calibration && r.calibration.length ? r.calibration : [r.from, r.to];
      const labelled = new Set();
      const above = (x) => [{ x, y: ry - 15.5, anchor: "middle" }, { x, y: ry + 15.5, anchor: "middle" }, { x, y: ry - 28, anchor: "middle" }];
      for (const c of cal) {
        out.push(`<line class="ln tick maj" x1="${fmt(sx(c))}" y1="${fmt(ry - 7.5)}" x2="${fmt(sx(c))}" y2="${fmt(ry + 7.5)}"/>`);
        if (placer.place(out, "measure", c, above(sx(c)), { required: false, nudges: 1 })) labelled.add(c);
      }
      // v1.1: intermediate ticks — unlabelled, labelled when they fit
      const ticks = tickValues(r);
      if (ticks.length) {
        const gapPx = sx(r.ticks) - sx(0);
        const widest = Math.max(...ticks.map((v) => textBox("measure", 0, 0, v, "middle").x1 - textBox("measure", 0, 0, v, "middle").x0));
        const fits = gapPx >= widest + 6;
        for (const v of ticks) {
          out.push(`<line class="ln tick" x1="${fmt(sx(v))}" y1="${fmt(ry - 4.5)}" x2="${fmt(sx(v))}" y2="${fmt(ry + 4.5)}"/>`);
          if (fits && placer.place(out, "measure", v, [above(sx(v))[0]], { required: false, nudges: 0 })) labelled.add(v);
        }
      }
      // ranged marks ride the route line; point marks cut it
      for (const m of marks) {
        if (RANGED_MARKS.has(m.kind) && m.to !== undefined) {
          const tone = MARK_TONE[m.kind] || "ink";
          const dash = m.kind === "gap" ? " dotted" : "";
          out.push(`<line class="ln event flat s-${tone}${dash}" x1="${fmt(sx(m.at))}" y1="${fmt(ry)}" x2="${fmt(sx(m.to))}" y2="${fmt(ry)}"/>`);
          const mx = (sx(m.at) + sx(m.to)) / 2;
          if (m.label) placer.place(out, `id f-${tone}`, m.label, [{ x: mx, y: ry - 30, anchor: "middle" }, { x: mx, y: ry - 43, anchor: "middle" }]);
        } else {
          const mx = m.at === undefined ? sx(r.from) : sx(m.at);
          const cutTo = bars.length ? bars[bars.length - 1].ey + 6 : ry + 10.5;
          out.push(`<line class="split" x1="${fmt(mx)}" y1="${fmt(ry - 10.5)}" x2="${fmt(mx)}" y2="${fmt(cutTo)}"/>`);
          out.push(`<circle class="splitdot" cx="${fmt(mx)}" cy="${fmt(ry)}" r="3.2"/>`);
          if (m.label) placer.place(out, "note", m.label, [{ x: mx, y: ry - 30, anchor: "middle" }, { x: mx, y: ry - 43, anchor: "middle" }, { x: mx + 8, y: ry - 30, anchor: "start" }]);
        }
      }
      // point events: the id below, the measure above unless the axis
      // already labels that value
      for (const e of gonePoints) {
        // v1.2: a point event that left this route — a hollow muted dot
        meta.ghost = true;
        const px = sx(e.at);
        out.push(`<circle class="node t-plain s-muted dashed" cx="${fmt(px)}" cy="${fmt(ry)}" r="5"/>`);
        placer.place(out, "id f-muted", e.id, [{ x: px, y: ry + 16, anchor: "middle" }, { x: px + 9, y: ry + 14, anchor: "start" }]);
      }
      for (const e of pointEvents) {
        const tone = e.tone || "cool";
        const px = sx(e.at);
        const pe = diff.under.get(e.id);
        if (pe && pe.at !== undefined) {
          // v1.2: the point's prior position — a hollow muted dot
          meta.ghost = true;
          out.push(`<circle class="node t-plain s-muted dashed" cx="${fmt(sx(pe.at))}" cy="${fmt(ry)}" r="4"/>`);
        }
        out.push(`<circle class="node t-${tone} s-${tone}" cx="${fmt(px)}" cy="${fmt(ry)}" r="5"/>`);
        placer.place(out, `id f-${tone}`, e.id, [
          { x: px, y: ry + 16, anchor: "middle" }, { x: px + 9, y: ry - 14, anchor: "start" }, { x: px + 9, y: ry + 14, anchor: "start" },
        ]);
        if (![...labelled].some((v) => near(v, e.at))) {
          placer.place(out, "measure", e.at, [{ x: px, y: ry - 15.5, anchor: "middle" }, { x: px, y: ry + 28, anchor: "middle" }], { required: false, nudges: 1 });
        }
      }
      // line events: the bar, its id at the right end, its measures at
      // both ends (v1.1) — below the bar, else beside it
      for (const { e, ey, ghost } of bars) {
        const tone = ghost ? "muted" : e.tone || "cool";
        const fx = sx(e.from), tx = sx(e.to);
        const pe = diff.under.get(e.id);
        if (pe && pe.at === undefined) {
          // v1.2: the event's prior extent, dotted under the new bar —
          // visible where the event no longer reaches
          meta.ghost = true;
          out.push(`<line class="ln event flat s-muted dotted" x1="${fmt(sx(pe.from))}" y1="${fmt(ey)}" x2="${fmt(sx(pe.to))}" y2="${fmt(ey)}"/>`);
        }
        if (ghost) meta.ghost = true;
        out.push(`<line class="ln event flat s-${tone}${ghost ? " dotted" : ""}" x1="${fmt(fx)}" y1="${fmt(ey)}" x2="${fmt(tx)}" y2="${fmt(ey)}"/>`);
        placer.place(out, `id f-${tone}`, e.id, [
          { x: tx + 6, y: ey, anchor: "start" }, { x: fx - 10, y: ey, anchor: "end" }, { x: (fx + tx) / 2, y: ey - 11, anchor: "middle" },
        ]);
        const wFrom = textBox("measure", 0, 0, e.from, "middle"), wTo = textBox("measure", 0, 0, e.to, "middle");
        if (tx - fx < (wFrom.x1 - wFrom.x0 + wTo.x1 - wTo.x0) / 2 + 4) {
          // a bar too short for two end labels takes ONE "from–to" label
          placer.place(out, "measure", `${e.from}–${e.to}`, [
            { x: (fx + tx) / 2, y: ey + 11, anchor: "middle" }, { x: fx - 5, y: ey, anchor: "end" },
          ], { required: false, nudges: 1 });
          continue;
        }
        placer.place(out, "measure", e.from, [
          { x: fx, y: ey + 11, anchor: "middle" }, { x: fx, y: ey + 11, anchor: "start" }, { x: fx - 5, y: ey, anchor: "end" },
        ], { required: false, nudges: 1 });
        placer.place(out, "measure", e.to, [
          { x: tx, y: ey + 11, anchor: "middle" }, { x: tx, y: ey + 11, anchor: "end" }, { x: tx + 5, y: ey, anchor: "start" },
        ], { required: false, nudges: 1 });
      }
      const rowsBottom = ry + 8 + bars.length * ROW + 24;
      y = Math.max(rowsBottom, placer.maxY + 14);
    }
    y += 10;
  });
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

// ---- v1.3: the five variety kinds -----------------------------------
// Every renderer below draws with the classes above only (line / rect /
// ellipse / circle / polygon / path / text), keeps nlabel texts inside
// exactly one `node` shape (svg2pptx attaches them as the shape's own
// text) and uses `frame` for a container that must NOT swallow labels.

const cut = (str, n) => { const t = String(str ?? ""); return t.length > n ? t.slice(0, Math.max(1, n - 1)) + "…" : t; };
const DRAW_W = W - PAD * 2;
// a placer that also refuses boxes crossing the drawing's left/right edge
function boundedPlacer() {
  const pl = new Placer();
  pl.wall({ x0: DRAW_W, x1: 1e9, y0: -1e9, y1: 1e9 });
  pl.wall({ x0: -1e9, x1: 0, y0: -1e9, y1: 1e9 });
  return pl;
}
const toneCls = (t) => `note${t === "denied" ? " f-red" : t === "ok" ? " f-green" : ""}`;
// a node label on one line when it fits, else wrapped at a word break
// into two nlabel rows (svg2pptx reads the rows as the shape's text)
function nodeLabel(out, x, y, str, maxChars) {
  const t = String(str ?? "");
  if (t.length <= maxChars) { out.push(text("nlabel", x, y, t)); return; }
  let brk = t.lastIndexOf(" ", maxChars);
  if (brk < Math.floor(maxChars / 3)) brk = maxChars;
  out.push(text("nlabel", x, y - 7, t.slice(0, brk).trim()));
  out.push(text("nlabel", x, y + 7, cut(t.slice(brk).trim(), maxChars)));
}

/** kind "timeline": an ordinal date axis; spans as bars below, points on it. */
function renderTimeline(spec, out) {
  const axis = spec.axis;
  const x0 = 50, x1 = DRAW_W - 50;
  const step = axis.length > 1 ? (x1 - x0) / (axis.length - 1) : 0;
  const sx = (d) => x0 + axis.indexOf(d) * step;
  const placer = boundedPlacer();
  const ay = 34;
  out.push(`<line class="ln edge" x1="${fmt(x0 - 18)}" y1="${fmt(ay)}" x2="${fmt(x1 + 22)}" y2="${fmt(ay)}" marker-end="url(#ae)"/>`);
  placer.reserve({ x0: x0 - 18, x1: x1 + 32, y0: ay - 4, y1: ay + 4 });
  for (const d of axis) {
    const x = sx(d);
    out.push(`<line class="ln tick maj" x1="${fmt(x)}" y1="${fmt(ay - 7.5)}" x2="${fmt(x)}" y2="${fmt(ay + 7.5)}"/>`);
    placer.place(out, "measure", d, [{ x, y: ay + 15.5, anchor: "middle" }, { x, y: ay + 28, anchor: "middle" }]);
  }
  for (const p of spec.points || []) {
    const tone = p.tone || "green";
    const px = sx(p.at);
    out.push(`<circle class="node t-${tone} s-${tone}" cx="${fmt(px)}" cy="${fmt(ay)}" r="5"/>`);
    placer.reserve({ x0: px - 6, x1: px + 6, y0: ay - 6, y1: ay + 6 });
    placer.place(out, `id f-${tone}`, p.label || p.id, [
      { x: px, y: ay - 17, anchor: "middle" }, { x: px + 9, y: ay - 15, anchor: "start" }, { x: px - 9, y: ay - 15, anchor: "end" },
    ]);
  }
  const ROW = 26;
  const spans = spec.spans || [];
  const y = ay + 46;
  spans.forEach((sp, i) => {
    const ey = y + i * ROW;
    const tone = sp.tone || "cool";
    const fx = sx(sp.from);
    const open = sp.to === undefined;
    const tx = open ? x1 : sx(sp.to);
    out.push(`<line class="ln event flat s-${tone}" x1="${fmt(fx)}" y1="${fmt(ey)}" x2="${fmt(tx)}" y2="${fmt(ey)}"/>`);
    if (open) out.push(`<line class="ln event flat s-${tone} dotted" x1="${fmt(tx)}" y1="${fmt(ey)}" x2="${fmt(tx + 16)}" y2="${fmt(ey)}"/>`);
    placer.reserve({ x0: fx - 1, x1: (open ? tx + 16 : tx) + 1, y0: ey - 5, y1: ey + 5 });
    placer.place(out, `id f-${tone}`, sp.label || sp.id, [
      { x: (open ? tx + 16 : tx) + 6, y: ey, anchor: "start" }, { x: fx - 8, y: ey, anchor: "end" }, { x: (fx + tx) / 2, y: ey - 11, anchor: "middle" },
    ]);
  });
  return Math.max(y + spans.length * ROW, placer.maxY + 10) + 6;
}

/** kind "state": states in one or two rows; forward arcs above, backward arcs below, self-loops on top. */
function renderState(spec, out) {
  const states = spec.states;
  const w = 112, h = 44;
  const perRow = states.length > 4 ? Math.ceil(states.length / 2) : states.length;
  const gapX = perRow > 1 ? Math.min(120, (DRAW_W - 60 - perRow * w) / (perRow - 1)) : 0;
  const rowW = perRow * w + (perRow - 1) * gapX;
  const left = (DRAW_W - rowW) / 2 + w / 2;
  const top = 64, gapY = 100;
  const pos = new Map();
  states.forEach((st, i) => {
    const r = Math.floor(i / perRow), c = i % perRow;
    pos.set(st.id, { x: left + c * (w + gapX), y: top + r * (h + gapY), r, c });
  });
  const placer = boundedPlacer();
  for (const { x, y } of pos.values()) placer.reserve({ x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 });
  let below = 0;
  for (const t of spec.transitions) {
    const a = pos.get(t.from), b = pos.get(t.to);
    const cls = `ln edge${t.outcome === "denied" ? " s-red dashed" : t.outcome === "ok" ? " s-green" : ""}`;
    const label = (t.step ? `${t.step}. ` : "") + (t.label || "") + (t.outcome ? ` — ${t.outcome}` : "");
    const lcls = toneCls(t.outcome);
    let cands;
    if (a === b) {
      const y0 = a.y - h / 2;
      out.push(`<path class="${cls}" d="M ${fmt(a.x - 14)} ${fmt(y0)} C ${fmt(a.x - 34)} ${fmt(y0 - 44)} ${fmt(a.x + 34)} ${fmt(y0 - 44)} ${fmt(a.x + 14)} ${fmt(y0)}" marker-end="url(#ae)"/>`);
      cands = [{ x: a.x, y: y0 - 44, anchor: "middle" }, { x: a.x + 30, y: y0 - 30, anchor: "start" }];
    } else if (a.r === b.r && Math.abs(a.c - b.c) === 1 && b.c > a.c) {
      out.push(`<line class="${cls}" x1="${fmt(a.x + w / 2)}" y1="${fmt(a.y)}" x2="${fmt(b.x - w / 2 - 6)}" y2="${fmt(b.y)}" marker-end="url(#ae)"/>`);
      const mx = (a.x + b.x) / 2;
      cands = [{ x: mx, y: a.y - 12, anchor: "middle" }, { x: mx, y: a.y + 12, anchor: "middle" }];
    } else if (a.r === b.r) {
      const fwd = b.c > a.c;
      const hop = Math.abs(a.c - b.c);
      const sag = (h / 2 + 18 + 16 * (hop - 1)) * (fwd ? -1 : 1);
      const ay = a.y + (fwd ? -h / 2 : h / 2), by = b.y + (fwd ? -h / 2 : h / 2) + (fwd ? -6 : 6);
      const mx = (a.x + b.x) / 2, my = a.y + (fwd ? -h / 2 : h / 2) + 2 * sag;
      out.push(`<path class="${cls}" d="M ${fmt(a.x)} ${fmt(ay)} Q ${fmt(mx)} ${fmt(my)} ${fmt(b.x)} ${fmt(by)}" marker-end="url(#ae)"/>`);
      const apex = a.y + (fwd ? -h / 2 : h / 2) + sag;
      if (!fwd) below = Math.max(below, Math.abs(sag) + 16);
      cands = [{ x: mx, y: apex + (fwd ? -10 : 10), anchor: "middle" }, { x: mx, y: apex + (fwd ? -22 : 22), anchor: "middle" }];
    } else {
      // rows differ: a straight run trimmed to the rims (the topology precedent)
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      const horiz = Math.abs(dx) > Math.abs(dy);
      const ax = a.x + (dx / len) * (horiz ? w / 2 : h / 2), ay = a.y + (dy / len) * (horiz ? w / 2 : h / 2);
      const bx = b.x - (dx / len) * (horiz ? w / 2 + 6 : h / 2 + 6), by = b.y - (dy / len) * (horiz ? w / 2 + 6 : h / 2 + 6);
      out.push(`<line class="${cls}" x1="${fmt(ax)}" y1="${fmt(ay)}" x2="${fmt(bx)}" y2="${fmt(by)}" marker-end="url(#ae)"/>`);
      cands = [{ x: (ax + bx) / 2 + 8, y: (ay + by) / 2, anchor: "start" }, { x: (ax + bx) / 2 - 8, y: (ay + by) / 2, anchor: "end" }];
    }
    if (label.trim()) placer.place(out, lcls, cut(label, 44), cands);
  }
  if (spec.initial && pos.has(spec.initial)) {
    const s0 = pos.get(spec.initial);
    const x = s0.x - w / 2;
    out.push(`<circle class="f-ink" cx="${fmt(x - 30)}" cy="${fmt(s0.y)}" r="4"/>`);
    out.push(`<line class="ln edge" x1="${fmt(x - 26)}" y1="${fmt(s0.y)}" x2="${fmt(x - 7)}" y2="${fmt(s0.y)}" marker-end="url(#ae)"/>`);
  }
  for (const st of states) {
    const { x, y } = pos.get(st.id);
    out.push(nodeShape({ shape: st.shape === "box" ? "box" : "ellipse", tone: st.tone || "plain" }, x, y, w, h));
    out.push(text("nlabel", x, y, cut(st.label || st.id, 15)));
  }
  const rows = Math.ceil(states.length / perRow);
  const bottom = top + (rows - 1) * (h + gapY) + h / 2 + Math.max(20, below);
  return Math.max(bottom, placer.maxY + 12);
}

/** kind "matrix": a combinations grid — header cells ink, body cells toned by value. */
function renderMatrix(spec, out) {
  const rows = spec.rows, cols = spec.cols;
  const rl = (r) => r.label || r.id, cl = (c) => c.label || c.id;
  const headW = Math.min(200, Math.max(96, Math.max(...rows.map((r) => rl(r).length)) * CHAR_W.nlabel + 20));
  const colW = Math.min(150, Math.floor((DRAW_W - headW) / cols.length));
  const rowH = 32;
  const gridW = headW + colW * cols.length;
  const left = Math.floor((DRAW_W - gridW) / 2);
  let top = 0;
  if (spec.colsTitle) { out.push(text("legend", left + headW + (colW * cols.length) / 2, 8, spec.colsTitle)); top = 20; }
  const rect = (cls, x, y, w, h) => `<rect class="${cls}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}"/>`;
  out.push(rect("cell", left, top, headW, rowH));
  if (spec.rowsTitle) out.push(text("legend", left + 8, top + rowH / 2, cut(spec.rowsTitle, 24), "start"));
  cols.forEach((c, j) => {
    const x = left + headW + j * colW;
    out.push(rect("node t-ink", x, top, colW, rowH));
    out.push(text("nlabel", x + colW / 2, top + rowH / 2, cut(cl(c), Math.floor((colW - 10) / CHAR_W.nlabel))));
  });
  const byKey = new Map((spec.cells || []).map((k) => [`${k.row} ${k.col}`, k]));
  rows.forEach((r, i) => {
    const y = top + rowH * (i + 1);
    out.push(rect("node t-ink", left, y, headW, rowH));
    out.push(text("nlabel", left + headW / 2, y + rowH / 2, cut(rl(r), Math.floor((headW - 10) / CHAR_W.nlabel))));
    cols.forEach((c, j) => {
      const k = byKey.get(`${r.id} ${c.id}`);
      const x = left + headW + j * colW;
      if (!k) { out.push(rect("cell", x, y, colW, rowH)); return; }
      const tone = k.tone || CELL_TONE[String(k.value).toLowerCase()] || "plain";
      out.push(rect(`node t-${tone}`, x, y, colW, rowH));
      out.push(text("nlabel", x + colW / 2, y + rowH / 2, cut(k.value, Math.floor((colW - 10) / CHAR_W.nlabel))));
    });
  });
  return top + rowH * (rows.length + 1) + 8;
}

/** kind "wireframe": ONE pane/dialog, its controls stacked, step callouts at the left. */
function renderWireframe(spec, out) {
  const fw = 440, left = Math.floor((DRAW_W - fw) / 2), inner = 16;
  const cx0 = left + inner, cw = fw - inner * 2;
  const titleH = 28;
  const body = [];
  let y = titleH + 14;
  const fit = (str, wpx, cls = "nlabel") => cut(str, Math.max(3, Math.floor((wpx - 10) / CHAR_W[cls])));
  const rect = (cls, x, yy, w, h, rx = 3) => `<rect class="${cls}" x="${fmt(x)}" y="${fmt(yy)}" width="${fmt(w)}" height="${fmt(h)}" rx="${rx}"/>`;
  const callout = (step, cx, cy) => {
    if (!step) return;
    body.push(`<circle class="node t-warm s-warm" cx="${fmt(cx)}" cy="${fmt(cy)}" r="9"/>`);
    body.push(text("nlabel", cx, cy, String(step)));
  };
  const controls = spec.controls;
  for (let i = 0; i < controls.length; i++) {
    const c = controls[i];
    const tone = c.tone || "plain";
    switch (c.kind) {
      case "field":
      case "dropdown": {
        body.push(text("note", cx0, y + 6, fit(c.label, cw, "note"), "start"));
        const by = y + 16;
        body.push(rect(`node t-${tone}`, cx0, by, cw, 24));
        if (c.value) body.push(text("nlabel", cx0 + 8, by + 12, fit(c.value, cw - 30), "start"));
        if (c.kind === "dropdown") body.push(`<path class="ln edge" d="M ${fmt(cx0 + cw - 19)} ${fmt(by + 9)} L ${fmt(cx0 + cw - 14)} ${fmt(by + 15)} L ${fmt(cx0 + cw - 9)} ${fmt(by + 9)}"/>`);
        callout(c.step, left - 16, by + 12);
        y = by + 24 + 12;
        break;
      }
      case "button": {
        // consecutive buttons share one row, right-aligned like a dialog's OK / Cancel
        const run = [c];
        while (controls[i + 1] && controls[i + 1].kind === "button") run.push(controls[++i]);
        let x = cx0 + cw;
        for (const b of [...run].reverse()) {
          const bw = Math.min(cw, Math.max(72, b.label.length * CHAR_W.nlabel + 24));
          x -= bw;
          body.push(rect(`node t-${b.tone || "plain"}`, x, y, bw, 28, 4));
          body.push(text("nlabel", x + bw / 2, y + 14, fit(b.label, bw)));
          callout(b.step, x - 12, y + 14);
          x -= 12;
        }
        y += 28 + 12;
        break;
      }
      case "checkbox":
      case "radio": {
        const cy = y + 9;
        const on = c.value === "checked";
        if (c.kind === "checkbox") {
          body.push(rect(`node t-${tone}`, cx0, y + 2, 14, 14, 2));
          if (on) body.push(`<path class="ln edge s-green" d="M ${fmt(cx0 + 3)} ${fmt(cy)} L ${fmt(cx0 + 6.5)} ${fmt(cy + 3.5)} L ${fmt(cx0 + 11.5)} ${fmt(cy - 3.5)}"/>`);
        } else {
          body.push(`<circle class="node t-${tone}" cx="${fmt(cx0 + 7)}" cy="${fmt(cy)}" r="7"/>`);
          if (on) body.push(`<circle class="f-ink" cx="${fmt(cx0 + 7)}" cy="${fmt(cy)}" r="3.5"/>`);
        }
        body.push(text("note", cx0 + 22, cy, fit(c.label, cw - 22, "note"), "start"));
        callout(c.step, left - 16, cy);
        y += 18 + 10;
        break;
      }
      case "table": {
        body.push(text("note", cx0, y + 6, fit(c.label, cw, "note"), "start"));
        const ty = y + 16, th = 64;
        body.push(rect("frame", cx0, ty, cw, th));
        body.push(rect("node t-ink", cx0, ty, cw, 18, 0));
        const cols = c.columns && c.columns.length ? c.columns : [];
        const n = Math.max(cols.length, 3), colw = cw / n;
        cols.forEach((hd, j) => body.push(text("nlabel", cx0 + colw * j + colw / 2, ty + 9, fit(hd, colw))));
        for (let j = 1; j < n; j++) body.push(`<line class="ln tick" x1="${fmt(cx0 + colw * j)}" y1="${fmt(ty + 18)}" x2="${fmt(cx0 + colw * j)}" y2="${fmt(ty + th)}"/>`);
        body.push(`<line class="ln tick" x1="${fmt(cx0)}" y1="${fmt(ty + 41)}" x2="${fmt(cx0 + cw)}" y2="${fmt(ty + 41)}"/>`);
        if (c.value) body.push(text("note", cx0 + 8, ty + 29.5, fit(c.value, cw, "note"), "start"));
        callout(c.step, left - 16, ty + th / 2);
        y = ty + th + 12;
        break;
      }
      case "list": {
        body.push(text("note", cx0, y + 6, fit(c.label, cw, "note"), "start"));
        const ly = y + 16, lh = 54;
        body.push(rect("frame", cx0, ly, cw, lh));
        if (c.value) {
          body.push(rect(`node t-${tone === "plain" ? "cool" : tone}`, cx0 + 1, ly + 1, cw - 2, 16, 0));
          body.push(text("nlabel", cx0 + 8, ly + 9, fit(c.value, cw - 16), "start"));
        }
        for (const dy of [18, 36]) body.push(`<line class="ln tick" x1="${fmt(cx0)}" y1="${fmt(ly + dy)}" x2="${fmt(cx0 + cw)}" y2="${fmt(ly + dy)}"/>`);
        callout(c.step, left - 16, ly + lh / 2);
        y = ly + lh + 12;
        break;
      }
      case "message": {
        const mh = 26;
        body.push(rect(`node t-${c.tone || "red"}`, cx0, y, cw, mh));
        body.push(text("nlabel", cx0 + 8, y + mh / 2, fit(c.label, cw - 16), "start"));
        callout(c.step, left - 16, y + mh / 2);
        y += mh + 10;
        break;
      }
      case "map": {
        const mh = 96;
        body.push(rect("node t-muted dashed", cx0, y, cw, mh));
        body.push(`<line class="ln ctx" x1="${fmt(cx0 + 20)}" y1="${fmt(y + mh - 16)}" x2="${fmt(cx0 + cw - 20)}" y2="${fmt(y + 16)}"/>`);
        body.push(`<line class="ln ctx" x1="${fmt(cx0 + 20)}" y1="${fmt(y + 30)}" x2="${fmt(cx0 + cw - 40)}" y2="${fmt(y + mh - 30)}"/>`);
        body.push(text("legend", cx0 + cw / 2, y + mh / 2, fit(c.label, cw, "legend")));
        callout(c.step, left - 16, y + mh / 2);
        y += mh + 12;
        break;
      }
      default: { // "text"
        body.push(text("note", cx0, y + 8, fit(c.label + (c.value ? `: ${c.value}` : ""), cw, "note"), "start"));
        callout(c.step, left - 16, y + 8);
        y += 22;
      }
    }
  }
  const fh = y + 4;
  const fr = spec.frame || {};
  out.push(rect("frame", left, 0, fw, fh, 6));
  out.push(rect("node t-ink", left, 0, fw, titleH, 6));
  out.push(text("nlabel", left + fw / 2, titleH / 2, cut(fr.title || "", 48)));
  if (fr.kind === "dialog" || fr.kind === "window") out.push(text("note", left + fw - 14, titleH / 2, "×"));
  out.push(...body);
  return fh + 4;
}

/** kind "workflow": a top-down flowchart — nodes ranked by longest forward path, back edges routed on the right. */
function renderWorkflow(spec, out) {
  const nodes = spec.nodes;
  const order = new Map(nodes.map((n, i) => [n.id, i]));
  const isFwd = (e) => order.get(e.from) < order.get(e.to);
  const rank = new Map();
  for (const n of nodes) {
    const preds = spec.edges.filter((e) => e.to === n.id && isFwd(e)).map((e) => rank.get(e.from) ?? 0);
    rank.set(n.id, preds.length ? Math.max(...preds) + 1 : 0);
  }
  const tiers = [];
  for (const n of nodes) (tiers[rank.get(n.id)] ||= []).push(n);
  const size = (n) => n.kind === "decision" ? [164, 60] : n.kind === "step" ? [164, 44] : [116, 34];
  const PITCH = 84, GAPX = 40;
  const widest = Math.max(...tiers.map((t) => t.reduce((a, n) => a + size(n)[0], 0) + (t.length - 1) * GAPX));
  const pos = new Map();
  tiers.forEach((tier, r) => {
    const tw = tier.reduce((a, n) => a + size(n)[0], 0) + (tier.length - 1) * GAPX;
    let x = (DRAW_W - tw) / 2;
    for (const n of tier) {
      const [w, h] = size(n);
      pos.set(n.id, { x: x + w / 2, y: 30 + r * PITCH, w, h });
      x += w + GAPX;
    }
  });
  const placer = boundedPlacer();
  for (const p of pos.values()) placer.reserve({ x0: p.x - p.w / 2, x1: p.x + p.w / 2, y0: p.y - p.h / 2, y1: p.y + p.h / 2 });
  const railX = (DRAW_W + widest) / 2 + 28; // the back-edge rail, right of the widest tier
  let rails = 0;
  for (const e of spec.edges) {
    const a = pos.get(e.from), b = pos.get(e.to);
    const dash = e.style === "dashed" ? " dashed" : "";
    const lower = String(e.label || "").toLowerCase();
    // only an OUTCOME word tints a branch — "yes"/"no" are neutral (a
    // "yes" branch may well lead to the denial)
    const tone = lower === "denied" ? " s-red" : lower === "ok" ? " s-green" : "";
    let cands;
    if (isFwd(e)) {
      const dx = b.x - a.x, dy = b.y - a.y;
      if (Math.abs(dy) < 1) {
        const dir = dx > 0 ? 1 : -1;
        out.push(`<line class="ln edge${tone}${dash}" x1="${fmt(a.x + dir * a.w / 2)}" y1="${fmt(a.y)}" x2="${fmt(b.x - dir * (b.w / 2 + 6))}" y2="${fmt(b.y)}" marker-end="url(#ae)"/>`);
        cands = [{ x: (a.x + b.x) / 2, y: a.y - 12, anchor: "middle" }];
      } else if (Math.abs(dx) < 1) {
        out.push(`<line class="ln edge${tone}${dash}" x1="${fmt(a.x)}" y1="${fmt(a.y + a.h / 2)}" x2="${fmt(b.x)}" y2="${fmt(b.y - b.h / 2 - 6)}" marker-end="url(#ae)"/>`);
        cands = [{ x: a.x + 8, y: (a.y + a.h / 2 + b.y - b.h / 2) / 2, anchor: "start" }];
      } else {
        // an elbow: down out of a, across, down into b
        const my = a.y + a.h / 2 + Math.max(14, (b.y - b.h / 2 - a.y - a.h / 2) / 2);
        out.push(`<path class="ln edge${tone}${dash}" d="M ${fmt(a.x)} ${fmt(a.y + a.h / 2)} L ${fmt(a.x)} ${fmt(my)} L ${fmt(b.x)} ${fmt(my)} L ${fmt(b.x)} ${fmt(b.y - b.h / 2 - 6)}" marker-end="url(#ae)"/>`);
        cands = [{ x: (a.x + b.x) / 2, y: my - 10, anchor: "middle" }, { x: a.x + (dx > 0 ? 8 : -8), y: (a.y + a.h / 2 + my) / 2, anchor: dx > 0 ? "start" : "end" }];
      }
    } else if (a === b) {
      out.push(`<path class="ln edge${tone}${dash}" d="M ${fmt(a.x + a.w / 2)} ${fmt(a.y - 8)} L ${fmt(a.x + a.w / 2 + 26)} ${fmt(a.y - 8)} L ${fmt(a.x + a.w / 2 + 26)} ${fmt(a.y + 8)} L ${fmt(a.x + a.w / 2 + 6)} ${fmt(a.y + 8)}" marker-end="url(#ae)"/>`);
      cands = [{ x: a.x + a.w / 2 + 32, y: a.y, anchor: "start" }];
    } else {
      // a back edge: out of a's right rim, along the rail, into b's right rim
      const rx = railX + rails * 14;
      rails++;
      out.push(`<path class="ln edge${tone}${dash}" d="M ${fmt(a.x + a.w / 2)} ${fmt(a.y)} L ${fmt(rx)} ${fmt(a.y)} L ${fmt(rx)} ${fmt(b.y)} L ${fmt(b.x + b.w / 2 + 6)} ${fmt(b.y)}" marker-end="url(#ae)"/>`);
      cands = [{ x: rx + 4, y: (a.y + b.y) / 2, anchor: "start" }, { x: rx - 4, y: (a.y + b.y) / 2, anchor: "end" }];
    }
    if (e.label) placer.place(out, toneCls(lower), e.label, cands);
  }
  for (const n of nodes) {
    const p = pos.get(n.id);
    const tone = n.tone || (n.kind === "start" ? "ink" : n.kind === "end" ? "green" : "plain");
    const shape = n.kind === "decision" ? "diamond" : n.kind === "step" ? "box" : "ellipse";
    out.push(nodeShape({ shape, tone }, p.x, p.y, p.w, p.h));
    const maxChars = n.kind === "decision" ? 15 : Math.floor((p.w - 12) / CHAR_W.nlabel);
    const label = (n.step ? `${n.step}. ` : "") + n.label;
    if (n.kind === "step" || n.kind === "decision") nodeLabel(out, p.x, p.y, label, maxChars);
    else out.push(text("nlabel", p.x, p.y, cut(label, maxChars)));
  }
  const bottom = 30 + (tiers.length - 1) * PITCH + 30;
  return Math.max(bottom, placer.maxY + 12);
}

/** The SVG for a verified spec. */
export function renderFigureSvg(spec) {
  const body = [];
  const meta = {};
  let y;
  if (spec.kind === "route-measure") y = renderRouteMeasure(spec, body, meta);
  else if (spec.kind === "topology") y = renderTopology(spec, body);
  else if (spec.kind === "timeline") y = renderTimeline(spec, body);
  else if (spec.kind === "state") y = renderState(spec, body);
  else if (spec.kind === "matrix") y = renderMatrix(spec, body);
  else if (spec.kind === "wireframe") y = renderWireframe(spec, body);
  else if (spec.kind === "workflow") y = renderWorkflow(spec, body);
  else y = renderSequence(spec, body);
  // legend + notes ride below the drawing; v1.2: a figure that drew
  // prior-state ghosts adds its own key after the spec's items
  const legend = [...(spec.legend || []), ...(meta.ghost ? [PRIOR_KEY] : [])];
  if (legend.length) {
    const tones = [];
    for (const p of spec.panels || []) for (const e of p.events || []) tones.push([e.id, e.tone || "cool"]);
    // v1.3: a timeline's spans/points and a state figure's states name legend tones too
    for (const sp of spec.spans || []) tones.push([sp.id, sp.tone || "cool"]);
    for (const pt of spec.points || []) tones.push([pt.id, pt.tone || "green"]);
    for (const st of spec.states || []) tones.push([st.id, st.tone || "plain"]);
    let lx = 0;
    y += 6;
    for (const item of legend) {
      // the LAST panel's tone for an id — the after-state is what the legend names
      const tone = (tones.filter(([id]) => String(item).startsWith(id + " ")).pop() || [, "ink"])[1];
      const swatch = item === PRIOR_KEY ? "ln swatch flat s-muted dotted" : `ln swatch flat s-${tone}`;
      body.push(`<line class="${swatch}" x1="${fmt(lx)}" y1="${fmt(y)}" x2="${fmt(lx + 22)}" y2="${fmt(y)}"/>`);
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
