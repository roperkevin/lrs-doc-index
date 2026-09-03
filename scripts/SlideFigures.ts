/**
 * SlideFigures v1.0 — pptx slide diagrams → standalone SVG figures
 * --------------------------------------------------------------------
 * DF-1 (2026-09-03). Companion to ZipTextExtract, same input (the file's
 * bytes as base64). Returns one SVG per slide that has a diagram:
 *
 *   { figures: [{ slide, name, svg, alt }], count, skipped }
 *
 * Why this exists: these test plans are route/measure diagrams, and the
 * extracted markdown used to reduce them to loose one-token lines (v2.2
 * collapsed those to a "[figure: 10-22 ...]" caption, which at least
 * stopped the debris but threw the geometry away). A route diagram IS the
 * content of these slides, so it is rendered rather than described.
 *
 * Two sources, one visual language:
 *
 *   VECTOR SLIDES  the drawing is real DrawingML — connectors, ticks and
 *                  text at true coordinates. Rendered from those
 *                  coordinates: nothing is redrawn or inferred.
 *   RASTER SLIDES  the drawing is a pasted picture. Rather than embed
 *                  pixels we cannot restyle, the route is REDRAWN from
 *                  what the slide itself states: its topology from the
 *                  title ("2. Loop - Split measure : 20") and its
 *                  measures/split from its own tables. This is a
 *                  schematic of the case, faithful to the slide's data,
 *                  not a tracing of the author's picture — `alt` says so.
 *
 * Style is one framework for the whole corpus (so 500 documents stop
 * looking like 500 decks):
 *   - source colours map to palette slots by HUE FAMILY — deterministic,
 *     so one source colour lands on one slot in every document, and two
 *     different source colours stay two different palette colours
 *   - structural roles come from GEOMETRY, never colour: within a band of
 *     collinear lines the longest is the route and shorter lines over it
 *     are event extents (these decks colour the route navy and leave an
 *     event default black — a colour-led rule gets it backwards)
 *   - rulers are re-laid out on a canonical grid: uniform ticks centred on
 *     the line, major/minor ticks, measures centred above their own tick
 *     on a shared baseline, extents clamped and snapped to share one exact
 *     boundary, butt caps (round caps overshoot by half the stroke width,
 *     reading 10->16 as 9.9->16.1), a split marker at the boundary, route
 *     ids as left row labels, redundant leaders dropped, one decimal
 *     convention per ruler, and dead vertical bands compressed
 *
 * Colour/component normalisation applies only where the drawing is
 * entirely ours — which, since raster slides are redrawn, is everywhere a
 * figure is produced.
 *
 * Consumed by the local sweep, which writes each `svg` to the media folder
 * as `{prefix}{name}` and replaces that slide's "[figure: ...]" caption in
 * the extracted markdown with an image link. On a cloud-flow rollback the
 * sweep simply does not call this, and v2.2's caption stands.
 */
interface SlideFigure { slide: number; name: string; svg: string; alt: string; }
interface FiguresResult { figures: SlideFigure[]; count: number; skipped: string; }

const FIG_MAX_COUNT = 40;
const FIG_MAX_ONE = 220 * 1024;
const EMU_PX = 96 / 914400;
const TICK_MINOR = 9;
const TICK_MAJOR = 15;
const TICK_GAP = 8;
const LABEL_MIN_GAP = 26;
const BAND_GAP = 46;
const FIG_PAD = 20;
const FIG_W = 760;

function main(workbook: ExcelScript.Workbook, zipBase64: string): FiguresResult {
  const bytes = b64ToBytes(zipBase64);
  const entries = readCentralDirectory(bytes);
  const slideParts = entries.filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.name));
  const ordered = orderSlides(bytes, entries, slideParts);
  const figures: SlideFigure[] = [];
  const skipped: string[] = [];
  for (let i = 0; i < ordered.length; i++) {
    const no = i + 1;
    if (figures.length >= FIG_MAX_COUNT) { skipped.push("slide" + no + ":cap"); continue; }
    let xml = "";
    try {
      xml = utf8ToString(extractEntry(bytes, ordered[i]));
    } catch (e) {
      skipped.push("slide" + no + ":unreadable");
      continue;
    }
    const fig = buildFigure(xml, no);
    if (!fig) continue;
    if (fig.svg.length > FIG_MAX_ONE) { skipped.push("slide" + no + ":oversize"); continue; }
    figures.push(fig);
  }
  return { figures: figures, count: figures.length, skipped: skipped.join(",") };
}

// ---------------------------------------------------------------- geometry
interface FGroup { s: number; e: number; gx: number; gy: number; gw: number; gh: number; cx: number; cy: number; cw: number; ch: number; }
interface FLine { x1: number; y1: number; x2: number; y2: number; cls: string; extra: string; }
interface FText { x: number; y: number; t: string; cls: string; anchor: string; }
interface FRaw { x1: number; y1: number; x2: number; y2: number; w: number; h: number; col: string; }
interface FRuler { x0: number; x1: number; y: number; }

function fnum(v: number): string {
  const r = Math.round(v * 10) / 10;
  return r === Math.floor(r) ? String(Math.floor(r)) : String(r);
}
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Nesting-aware group spans: a non-greedy <p:grpSp>...</p:grpSp> regex closes
// on the FIRST closing tag, so with nested groups the inner one steals the
// outer's span — shapes outside any group look enclosed, and shapes inside a
// nested one lose the outer transform (which is how a ruler ends up 1.4in
// from its own numbers). Walk the tags with a depth stack instead.
function figGroups(xml: string): FGroup[] {
  const out: FGroup[] = [];
  const stack: number[] = [];
  const re = /<p:grpSp>|<\/p:grpSp>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    if (m[0] === "<p:grpSp>") { stack.push(m.index); continue; }
    if (stack.length === 0) continue;
    const s = stack.pop() as number;
    const b = xml.slice(s, m.index + m[0].length);
    const o = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const e = b.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    const c = b.match(/<a:chOff x="(-?\d+)" y="(-?\d+)"\/>/);
    const ce = b.match(/<a:chExt cx="(\d+)" cy="(\d+)"\/>/);
    if (o && e && c && ce) {
      out.push({ s: s, e: m.index + m[0].length,
        gx: parseInt(o[1], 10), gy: parseInt(o[2], 10),
        gw: parseInt(e[1], 10), gh: parseInt(e[2], 10),
        cx: parseInt(c[1], 10), cy: parseInt(c[2], 10),
        cw: parseInt(ce[1], 10), ch: parseInt(ce[2], 10) });
    }
  }
  return out;
}

function figXform(gs: FGroup[], at: number, X: number, Y: number, W: number, H: number): number[] {
  const encl: FGroup[] = [];
  for (const g of gs) if (g.s < at && at < g.e) encl.push(g);
  encl.sort((a, b) => (a.e - a.s) - (b.e - b.s));
  let x = X, y = Y, w = W, h = H;
  for (const g of encl) {
    const sx = g.cw ? g.gw / g.cw : 1;
    const sy = g.ch ? g.gh / g.ch : 1;
    x = g.gx + (x - g.cx) * sx;
    y = g.gy + (y - g.cy) * sy;
    w = w * sx; h = h * sy;
  }
  return [x, y, w, h];
}

// source colour -> palette slot, by hue family (deterministic across the corpus)
function figRole(hex: string, dflt: string): string {
  if (!hex) return dflt;
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return l < 0.35 ? "ink" : "muted";
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  if (s < 0.18) return l < 0.35 ? "ink" : "muted";
  if (l > 0.93 || l < 0.06) return "ink";
  let h = mx === r ? (((g - b) / d) % 6 + 6) % 6 : (mx === g ? (b - r) / d + 2 : (r - g) / d + 4);
  h = h * 60;
  if (h >= 25 && h < 70) return "warm";
  if (h >= 70 && h < 165) return "green";
  if (h >= 165 && h < 260) return "cool";
  if (h >= 260 && h < 320) return "violet";
  return "red";
}

function figStyle(): string {
  return "<style>" +
    ".plate{fill:#FFFFFF;stroke:#D7DFDF;stroke-width:1}" +
    ".ln{fill:none;stroke-linecap:round;stroke-linejoin:round}" +
    ".route{stroke:#16302F;stroke-width:3.6}" +
    ".ctx{stroke:#B9C6C6;stroke-width:2.4}" +
    ".event{stroke-width:5}.flat{stroke-linecap:butt}" +
    ".tick{stroke:#6E8285;stroke-width:1.15}" +
    ".maj{stroke:#4E6265;stroke-width:1.4}" +
    ".leader{stroke:#6E8285;stroke-width:1}" +
    ".split{stroke:#16302F;stroke-width:1.4;stroke-dasharray:3 2.5;opacity:.55}" +
    ".splitdot{fill:#FFFFFF;stroke:#16302F;stroke-width:1.6}" +
    ".s-ink{stroke:#16302F}.f-ink{fill:#16302F}" +
    ".s-muted{stroke:#6E8285}.f-muted{fill:#6E8285}" +
    ".s-cool{stroke:#1B6E8C}.f-cool{fill:#1B6E8C}" +
    ".s-warm{stroke:#C2701A}.f-warm{fill:#C2701A}" +
    ".s-green{stroke:#2E7D5B}.f-green{fill:#2E7D5B}" +
    ".s-violet{stroke:#7A5AA6}.f-violet{fill:#7A5AA6}" +
    ".s-red{stroke:#B2442F}.f-red{fill:#B2442F}" +
    "text{font-family:'Segoe UI',system-ui,Roboto,'Helvetica Neue',Arial,sans-serif}" +
    ".measure{font-size:11px;fill:#6E8285;font-variant-numeric:tabular-nums}" +
    ".id{font-size:12.5px;font-weight:600}.note{font-size:12px;fill:#16302F}" +
    "</style>" +
    '<defs><marker id="ar" viewBox="0 0 8 8" refX="6.4" refY="4" markerWidth="5.2" ' +
    'markerHeight="5.2" orient="auto-start-reverse">' +
    '<path d="M0.6 0.8 L7.2 4 L0.6 7.2 z" fill="#16302F"/></marker></defs>';
}

function svgWrap(no: number, w: number, h: number, title: string, desc: string, body: string): string {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + fnum(w) + " " + fnum(h) +
    '" width="' + fnum(w) + '" height="' + fnum(h) + '" role="img" aria-label="' + esc(title) + '">' +
    "<title>" + esc(title) + "</title><desc>" + esc(desc) + "</desc>" + figStyle() +
    '<rect class="plate" x="1" y="1" width="' + fnum(w - 2) + '" height="' + fnum(h - 2) + '" rx="6"/>' +
    body + "</svg>";
}

// ------------------------------------------------- vector slides: as drawn
// Roles come from geometry: within a band of collinear lines the longest is
// the route, shorter lines over it are event extents, perpendicular stubs are
// ruler ticks, diagonals are callout leaders. Near-duplicate lines (decks
// paste shapes on top of each other) collapse to one.
function classifyLines(raw: FRaw[]): { r: FRaw; role: string }[] {
  const out: { r: FRaw; role: string }[] = [];
  const band = 8.0;
  for (let pass = 0; pass < 2; pass++) {
    const horiz = pass === 0;
    const grp = raw.filter((r) => (Math.abs(r.h) <= Math.abs(r.w)) === horiz);
    const bands: { [k: string]: FRaw[] } = {};
    for (const r of grp) {
      const key = String(Math.round((horiz ? (r.y1 + r.y2) / 2 : (r.x1 + r.x2) / 2) / band));
      if (!bands[key]) bands[key] = [];
      bands[key].push(r);
    }
    for (const key in bands) {
      const items = bands[key];
      const len = (r: FRaw) => (horiz ? Math.abs(r.w) : Math.abs(r.h));
      let longest = 0;
      for (const r of items) if (len(r) > longest) longest = len(r);
      items.sort((a, b) => len(b) - len(a));
      const seen: FRaw[] = [];
      const keep: FRaw[] = [];
      for (const r of items) {
        let dup = false;
        for (const s of seen) {
          if (Math.abs(r.x1 - s.x1) < 3 && Math.abs(r.y1 - s.y1) < 3 &&
              Math.abs(r.x2 - s.x2) < 3 && Math.abs(r.y2 - s.y2) < 3) { dup = true; break; }
        }
        if (dup) continue;
        seen.push(r);
        const ln = len(r);
        let role: string;
        if (Math.min(Math.abs(r.w), Math.abs(r.h)) > 3) role = "leader";
        else if (longest < 26) role = "tick";
        else if (ln >= longest * 0.9) role = "route";
        else if (ln >= longest * 0.08) role = "event";
        else role = "tick";
        out.push({ r: r, role: role });
        keep.push(r);
      }
      // Route vs event by COLOUR COVERAGE, not by which line is longest.
      // One deck draws a full-width navy route with black/amber events over
      // it; another lays four default-coloured route segments end to end with
      // one cyan event on top. In both, the colour whose lines cover the most
      // ground is the route and every other colour is an extent.
      const cover: { [c: string]: number } = {};
      let bars = 0;
      for (const r of keep) {
        const role = out[out.length - keep.length + keep.indexOf(r)];
        if (!role || (role.role !== "route" && role.role !== "event")) continue;
        bars++;
        const k = r.col || "-";
        cover[k] = (cover[k] || 0) + len(r);
      }
      if (bars > 1) {
        let bestC = "", bestV = -1;
        for (const c in cover) if (cover[c] > bestV) { bestV = cover[c]; bestC = c; }
        for (const o of out) {
          if (o.role !== "route" && o.role !== "event") continue;
          if (keep.indexOf(o.r) < 0) continue;
          o.role = (o.r.col || "-") === bestC ? "route" : "event";
        }
      }
    }
  }
  return out;
}

function buildVector(xml: string, no: number): SlideFigure | null {
  const gs = figGroups(xml);
  const raw: FRaw[] = [];
  const texts: FText[] = [];
  const cre = /<p:cxnSp>([\s\S]*?)<\/p:cxnSp>/g;
  let m: RegExpExecArray | null;
  while ((m = cre.exec(xml)) !== null) {
    const b = m[1];
    const o = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const e = b.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    if (!o || !e) continue;
    const t = figXform(gs, m.index, parseInt(o[1], 10), parseInt(o[2], 10),
                       parseInt(e[1], 10), parseInt(e[2], 10));
    const xf = b.match(/<a:xfrm([^>]*)>/);
    const fl = xf ? xf[1] : "";
    const X = t[0] * EMU_PX, Y = t[1] * EMU_PX, W = t[2] * EMU_PX, H = t[3] * EMU_PX;
    const c = b.match(/<a:ln\b[^>]*>[\s\S]*?<a:srgbClr val="([0-9A-Fa-f]{6})"/);
    raw.push({
      x1: fl.indexOf('flipH="1"') >= 0 ? X + W : X,
      y1: fl.indexOf('flipV="1"') >= 0 ? Y + H : Y,
      x2: fl.indexOf('flipH="1"') >= 0 ? X : X + W,
      y2: fl.indexOf('flipV="1"') >= 0 ? Y : Y + H,
      w: W, h: H, col: c ? c[1] : "" });
  }
  const sre = /<p:sp>([\s\S]*?)<\/p:sp>/g;
  while ((m = sre.exec(xml)) !== null) {
    const b = m[1];
    if (b.indexOf("<p:ph") >= 0) continue;
    const o = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const e = b.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    if (!o || !e) continue;
    const parts: string[] = [];
    const tre = /<a:t>([^<]*)<\/a:t>/g;
    let tm: RegExpExecArray | null;
    while ((tm = tre.exec(b)) !== null) { const v = tm[1].trim(); if (v) parts.push(v); }
    const t = parts.join(" ").replace(/\s+/g, " ").trim();
    if (!t || t.length > 24 || t.split(" ").length > 3) continue;
    const g = figXform(gs, m.index, parseInt(o[1], 10), parseInt(o[2], 10),
                       parseInt(e[1], 10), parseInt(e[2], 10));
    const c = b.match(/<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/);
    const numeric = /^\d+(\.\d+)?$/.test(t);
    texts.push({ x: (g[0] + g[2] / 2) * EMU_PX, y: (g[1] + g[3] / 2) * EMU_PX, t: t,
      cls: (numeric ? "measure" : "id") + " f-" +
           figRole(c ? c[1] : "", numeric ? "muted" : "ink"), anchor: "middle" });
  }
  const cls = classifyLines(raw);
  const routes = cls.filter((c) => c.role === "route").length;
  const ticks = cls.filter((c) => c.role === "tick").length;
  const events = cls.filter((c) => c.role === "event").length;
  // a diagram is a route plus either a measure ruler or an event extent;
  // decks in this corpus do one or the other, rarely both
  if (routes === 0 || (ticks < 3 && events === 0)) return null;

  const lines: FLine[] = [];
  for (const c of cls) {
    const r = c.r;
    let klass = c.role, extra = "";
    if (c.role === "event") { klass = "event flat"; extra = " s-" + figRole(r.col, "cool"); }
    lines.push({ x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y2, cls: klass, extra: extra });
  }
  const norm = normaliseRulers(lines, texts);
  const body = emitVector(norm.lines, norm.texts, norm.splits, norm.rulers);
  const bb = bbox(norm.lines, norm.texts);
  const w = bb[2] - bb[0] + FIG_PAD * 2, h = bb[3] - bb[1] + FIG_PAD * 2;
  const shift = 'transform="translate(' + fnum(FIG_PAD - bb[0]) + "," + fnum(FIG_PAD - bb[1]) + ')"';
  const ms = norm.texts.filter((t) => t.cls.indexOf("measure") === 0).map((t) => t.t);
  const title = "Slide " + no + " route diagram";
  const desc = "Measured route diagram drawn from the slide's own shapes" +
    (ms.length ? ", measures " + ms[0] + " to " + ms[ms.length - 1] : "") + ".";
  return { slide: no, name: "slide" + no + ".svg",
    svg: svgWrap(no, w, h, title, desc, "<g " + shift + ">" + body + "</g>"), alt: desc };
}

function bbox(lines: FLine[], texts: FText[]): number[] {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const l of lines) {
    x0 = Math.min(x0, l.x1, l.x2); x1 = Math.max(x1, l.x1, l.x2);
    y0 = Math.min(y0, l.y1, l.y2); y1 = Math.max(y1, l.y1, l.y2);
  }
  for (const t of texts) {
    const wdt = t.t.length * 4 + 6;
    x0 = Math.min(x0, t.x - wdt); x1 = Math.max(x1, t.x + wdt);
    y0 = Math.min(y0, t.y - 9); y1 = Math.max(y1, t.y + 9);
  }
  if (x0 > x1) { x0 = 0; y0 = 0; x1 = 10; y1 = 10; }
  return [x0, y0, x1, y1];
}

function emitVector(lines: FLine[], texts: FText[], splits: number[][], rulers: FRuler[]): string {
  const p: string[] = [];
  // z-order matters: an extent drawn BEFORE the route it sits on is hidden by
  // it. Routes first, then ticks and leaders, then extents on top.
  const order = (l: FLine): number =>
    l.cls === "route" ? 0 : (l.cls.indexOf("event") === 0 ? 2 : 1);
  const sorted = lines.slice().sort((a, b) => order(a) - order(b));
  for (const l of sorted) {
    const arrow = l.cls === "route" ? ' marker-end="url(#ar)"' : "";
    p.push('<line class="ln ' + l.cls + l.extra + '" x1="' + fnum(l.x1) + '" y1="' + fnum(l.y1) +
      '" x2="' + fnum(l.x2) + '" y2="' + fnum(l.y2) + '"' + arrow + "/>");
  }
  for (const s of splits) {
    p.push('<line class="split" x1="' + fnum(s[0]) + '" y1="' + fnum(s[1] - TICK_MAJOR) +
      '" x2="' + fnum(s[0]) + '" y2="' + fnum(s[1] + TICK_MAJOR) + '"/>');
    p.push('<circle class="splitdot" cx="' + fnum(s[0]) + '" cy="' + fnum(s[1]) + '" r="3.2"/>');
  }
  for (const t of texts) {
    p.push('<text class="' + t.cls + '" x="' + fnum(t.x) + '" y="' + fnum(t.y) +
      '" text-anchor="' + t.anchor + '" dominant-baseline="central">' + esc(t.t) + "</text>");
  }
  return p.join("");
}

// ------------------------------------------- component normalisation
// The decks place every part by hand, so a measure label lands wherever it
// was dragged (typically ~0.1in off its own tick) and adjoining extents
// overlap or gap by a few px at the very measure the test case is about.
// A ruler is therefore recognised as ONE component and re-laid out.
function normaliseRulers(lines: FLine[], texts: FText[]): {
  lines: FLine[]; texts: FText[]; splits: number[][]; rulers: FRuler[];
} {
  const band = 9.0;
  const outL: FLine[] = [], outT: FText[] = [], splits: number[][] = [], rulers: FRuler[] = [];
  const usedL: boolean[] = [], usedT: boolean[] = [];
  const relocated: number[][] = [];

  for (let ri = 0; ri < lines.length; ri++) {
    const r = lines[ri];
    if (usedL[ri] || r.cls !== "route" || Math.abs(r.y1 - r.y2) >= 2) continue;
    const rx0 = Math.min(r.x1, r.x2), rx1 = Math.max(r.x1, r.x2), ry = (r.y1 + r.y2) / 2;
    const ticks: number[] = [], tickIdx: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (usedL[i] || l.cls !== "tick" || Math.abs(l.x1 - l.x2) > 2) continue;
      if (l.x1 < rx0 - 6 || l.x1 > rx1 + 6) continue;
      if (Math.abs((l.y1 + l.y2) / 2 - ry) > band * 2.5) continue;
      ticks.push(l.x1); tickIdx.push(i);
    }
    if (ticks.length < 3) continue;
    ticks.sort((a, b) => a - b);
    // one measure per tick position, snapped to the tick it belongs to
    const at: { [x: string]: string } = {};
    const order: number[] = [];
    for (let j = 0; j < texts.length; j++) {
      const t = texts[j];
      if (usedT[j] || t.cls.indexOf("measure") !== 0) continue;
      if (t.y <= ry - band * 9 || t.y >= ry + band * 2) continue;
      let near = ticks[0];
      for (const x of ticks) if (Math.abs(x - t.x) < Math.abs(near - t.x)) near = x;
      if (Math.abs(near - t.x) > 22) continue;
      usedT[j] = true;
      const k = String(Math.round(near));
      if (!at[k]) { at[k] = t.t; order.push(near); }
    }
    if (order.length < 3) continue;
    for (const i of tickIdx) usedL[i] = true;
    usedL[ri] = true;
    order.sort((a, b) => a - b);
    // one decimal convention per ruler
    let dec = 0;
    for (const x of order) {
      const d = at[String(Math.round(x))];
      const dot = d.indexOf(".");
      if (dot >= 0) dec = Math.max(dec, d.length - dot - 1);
    }
    // label thinning: never overlap, always draw every tick
    let thin = 1;
    if (order.length > 1) {
      let step = 1e9;
      for (let k = 0; k + 1 < order.length; k++) step = Math.min(step, order[k + 1] - order[k]);
      while (step * thin < LABEL_MIN_GAP) thin++;
    }
    outL.push({ x1: rx0, y1: ry, x2: rx1, y2: ry, cls: "route", extra: "" });
    const baseY = ry - TICK_MAJOR / 2 - TICK_GAP;
    for (let k = 0; k < ticks.length; k++) {
      const major = k % 5 === 0 || k === ticks.length - 1;
      const L = (major ? TICK_MAJOR : TICK_MINOR) / 2;
      outL.push({ x1: ticks[k], y1: ry - L, x2: ticks[k], y2: ry + L,
        cls: major ? "tick maj" : "tick", extra: "" });
    }
    for (let k = 0; k < order.length; k++) {
      if (thin > 1 && k % thin !== 0 && k !== order.length - 1) continue;
      let v = at[String(Math.round(order[k]))];
      if (dec > 0) {
        const f = parseFloat(v);
        if (!isNaN(f)) v = f.toFixed(dec);
      }
      outT.push({ x: order[k], y: baseY, t: v, cls: "measure f-muted", anchor: "middle" });
    }
    rulers.push({ x0: rx0, x1: rx1, y: ry });
  }

  // event extents: clamp to the ruler, snap adjoining bars to share ONE exact
  // boundary, and mark that boundary — it is the split the case is about
  const SNAP = 12.0;
  const groups: { ruler: FRuler; segs: number[][] }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (usedL[i] || l.cls.indexOf("event") !== 0 || Math.abs(l.y1 - l.y2) >= 3) continue;
    usedL[i] = true;
    const ly = (l.y1 + l.y2) / 2;
    let best: FRuler | null = null;
    for (const r of rulers) if (!best || Math.abs(r.y - ly) < Math.abs(best.y - ly)) best = r;
    const rr: FRuler = (best && Math.abs(best.y - ly) <= band * 3) ? best
      : { x0: Math.min(l.x1, l.x2), x1: Math.max(l.x1, l.x2), y: ly };
    let grp: { ruler: FRuler; segs: number[][] } | null = null;
    for (const g of groups) if (g.ruler === rr) grp = g;
    if (!grp) { grp = { ruler: rr, segs: [] }; groups.push(grp); }
    grp.segs.push([Math.max(Math.min(l.x1, l.x2), rr.x0), Math.min(Math.max(l.x1, l.x2), rr.x1),
      0, 0]);
    grp.segs[grp.segs.length - 1][2] = i;
  }
  for (const g of groups) {
    g.segs.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k + 1 < g.segs.length; k++) {
      if (Math.abs(g.segs[k + 1][0] - g.segs[k][1]) <= SNAP) {
        const mid = (g.segs[k][1] + g.segs[k + 1][0]) / 2;
        g.segs[k][1] = mid; g.segs[k + 1][0] = mid;
        splits.push([mid, g.ruler.y]);
      }
    }
    for (const s of g.segs) {
      const src = lines[s[2]];
      outL.push({ x1: s[0], y1: g.ruler.y, x2: s[1], y2: g.ruler.y,
        cls: "event flat", extra: src.extra });
    }
  }

  const bars = outL.filter((l) => l.cls.indexOf("event") === 0);
  for (let j = 0; j < texts.length; j++) {
    if (usedT[j]) continue;
    const t = texts[j];
    // event id centred beneath its own bar; route id as a left row label
    if (/^[Ee]\w{0,6}$/.test(t.t) && bars.length) {
      let b = bars[0];
      const score = (bb: FLine) => Math.abs((bb.x1 + bb.x2) / 2 - t.x) + Math.abs(bb.y1 - t.y) * 1.5;
      for (const bb of bars) if (score(bb) < score(b)) b = bb;
      if (Math.abs(b.y1 - t.y) < band * 6) {
        relocated.push([t.x, t.y]);
        outT.push({ x: (b.x1 + b.x2) / 2, y: b.y1 + TICK_MAJOR / 2 + TICK_GAP + 5,
          t: t.t, cls: t.cls, anchor: "middle" });
        continue;
      }
    }
    if (/^[Rr]\w{0,8}$/.test(t.t) && rulers.length) {
      let r = rulers[0];
      for (const rr of rulers) if (Math.abs(rr.y - t.y) < Math.abs(r.y - t.y)) r = rr;
      if (Math.abs(r.y - t.y) < band * 9) {
        outT.push({ x: r.x0 - 12, y: r.y, t: t.t, cls: t.cls, anchor: "end" });
        continue;
      }
    }
    outT.push(t);
  }
  // a leader pointing at a label we just moved is now noise
  for (let i = 0; i < lines.length; i++) {
    if (usedL[i]) continue;
    const l = lines[i];
    if (l.cls === "leader") {
      let drop = false;
      for (const rp of relocated) {
        const d1 = Math.abs(l.x1 - rp[0]) + Math.abs(l.y1 - rp[1]);
        const d2 = Math.abs(l.x2 - rp[0]) + Math.abs(l.y2 - rp[1]);
        if (Math.min(d1, d2) < 60) { drop = true; break; }
      }
      if (drop) continue;
    }
    outL.push(l);
  }
  return compressBands(outL, outT, splits, rulers);
}

// dead vertical space between bands collapses to one standard gap: bands move
// as units, so nothing inside one changes
function compressBands(lines: FLine[], texts: FText[], splits: number[][], rulers: FRuler[]): {
  lines: FLine[]; texts: FText[]; splits: number[][]; rulers: FRuler[];
} {
  const spans: number[][] = [];
  for (const l of lines) spans.push([Math.min(l.y1, l.y2), Math.max(l.y1, l.y2)]);
  for (const t of texts) spans.push([t.y - 10, t.y + 6]);
  if (!spans.length) return { lines: lines, texts: texts, splits: splits, rulers: rulers };
  spans.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [[spans[0][0], spans[0][1]]];
  for (const s of spans) {
    if (s[0] <= merged[merged.length - 1][1] + BAND_GAP) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], s[1]);
    } else merged.push([s[0], s[1]]);
  }
  if (merged.length < 2) return { lines: lines, texts: texts, splits: splits, rulers: rulers };
  const cuts: number[][] = [];
  let shift = 0, prevEnd = merged[0][1];
  for (let i = 1; i < merged.length; i++) {
    shift += (merged[i][0] - prevEnd) - BAND_GAP;
    cuts.push([merged[i][0], shift]);
    prevEnd = merged[i][1];
  }
  const dy = (y: number): number => {
    let s = 0;
    for (const c of cuts) if (y >= c[0]) s = c[1];
    return -s;
  };
  return {
    lines: lines.map((l) => ({ x1: l.x1, y1: l.y1 + dy(l.y1), x2: l.x2, y2: l.y2 + dy(l.y2),
      cls: l.cls, extra: l.extra })),
    texts: texts.map((t) => ({ x: t.x, y: t.y + dy(t.y), t: t.t, cls: t.cls, anchor: t.anchor })),
    splits: splits.map((s) => [s[0], s[1] + dy(s[1])]),
    rulers: rulers.map((r) => ({ x0: r.x0, x1: r.x1, y: r.y + dy(r.y) })),
  };
}

// -------------------------------------- raster slides: redrawn as vectors
// The drawing is a pasted picture, so rather than embed pixels we cannot
// restyle, the route is redrawn from what the slide itself states: topology
// from its title, measures and split from its own tables. A schematic of the
// case that is faithful to the slide's data — not a tracing of the picture.
function arc(cx: number, cy: number, r: number, a0: number, a1: number, n: number): number[][] {
  const pts: number[][] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

interface Topo { pts: number[][]; extras: number[][][]; aspect: number; closed: boolean; }

function topology(kind: string): Topo {
  const k = (kind || "").toLowerCase();
  const PI = Math.PI;
  if (k.indexOf("vertical") >= 0)
    return { pts: [[0.5, 1], [0.5, 0]], extras: [], aspect: 0.42, closed: false };
  if (k.indexOf("lollipop") >= 0)
    return { pts: ([[0.03, 0.5], [0.34, 0.5]] as number[][]).concat(arc(0.63, 0.5, 0.29, PI, -PI, 46)),
             extras: [], aspect: 2.2, closed: false };
  if (k.indexOf("loop") >= 0)
    return { pts: [[0.08, 0.12], [0.92, 0.12], [0.92, 0.88], [0.08, 0.88], [0.08, 0.12]],
             extras: [], aspect: 1.05, closed: true };
  if (k.indexOf("branch") >= 0)
    return { pts: [[0.03, 0.28], [0.52, 0.28], [0.97, 0.28]],
             extras: [[[0.52, 0.28], [0.97, 0.86]]], aspect: 1.9, closed: false };
  if (k.indexOf("alpha") >= 0)
    return { pts: arc(0.35, 0.52, 0.3, PI * 0.75, PI * 2.75, 48).concat([[0.72, 0.2], [0.97, 0.08]]),
             extras: [], aspect: 1.5, closed: true };
  if (k.indexOf("infinity") >= 0)
    return { pts: arc(0.27, 0.5, 0.24, PI * 0.25, PI * 2.25, 44)
                    .concat(arc(0.73, 0.5, 0.24, PI * 1.25, PI * -0.75, 44)),
             extras: [], aspect: 2.4, closed: true };
  if (k.indexOf("gap") >= 0)
    return { pts: [[0.03, 0.5], [0.42, 0.5], [0.58, 0.5], [0.97, 0.5]],
             extras: [], aspect: 4.5, closed: false };
  return { pts: [[0.03, 0.5], [0.97, 0.5]], extras: [], aspect: 5.0, closed: false };
}

// measure -> point + tangent along the polyline's arc length
function atMeasure(pts: number[][], cum: number[], total: number, m0: number, m1: number, m: number): number[] {
  const f = m1 === m0 ? 0 : (m - m0) / (m1 - m0);
  const d = Math.max(0, Math.min(1, f)) * total;
  let i = 0;
  while (i < cum.length - 2 && cum[i + 1] < d) i++;
  const seg = (cum[i + 1] - cum[i]) || 1;
  const t = (d - cum[i]) / seg;
  const a = pts[i], b = pts[i + 1];
  const L = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) || 1;
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, (b[0] - a[0]) / L, (b[1] - a[1]) / L];
}

function niceStep(span: number): number {
  const opts = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  for (const s of opts) if (span / s <= 8) return s;
  return Math.max(1, Math.round(span / 8));
}

function buildRedraw(xml: string, no: number): SlideFigure | null {
  const cells: string[] = [];
  const tre = /<a:t>([^<]*)<\/a:t>/g;
  let m: RegExpExecArray | null;
  while ((m = tre.exec(xml)) !== null) cells.push(m[1].replace(/\s+/g, " ").trim());
  const txt = cells.join(" ");
  let kind = "";
  const names = ["Lollipop", "Loop", "Branch", "Alpha", "Infinity", "Gapped", "Gap",
                 "Vertical", "Reverse", "Normal"];
  for (const n of names) if (new RegExp(n, "i").test(txt)) { kind = n; break; }
  // Two table shapes in this corpus: two-column key/value ("Measure | 10")
  // and header-row ("RouteID | From Measure | To Measure" over data rows).
  // Reading the next cell works for the first and returns the NEXT HEADER for
  // the second, so parse the grid and read down the column.
  const after = (label: string): string => {
    const tre2 = /<a:tbl>([\s\S]*?)<\/a:tbl>/g;
    let tm2: RegExpExecArray | null;
    while ((tm2 = tre2.exec(xml)) !== null) {
      const rows: string[][] = [];
      const rre = /<a:tr\b[\s\S]*?<\/a:tr>/g;
      let rm: RegExpExecArray | null;
      while ((rm = rre.exec(tm2[1])) !== null) {
        const row: string[] = [];
        const cre2 = /<a:tc\b[\s\S]*?<\/a:tc>/g;
        let cm: RegExpExecArray | null;
        while ((cm = cre2.exec(rm[0])) !== null) {
          const bits: string[] = [];
          const t2 = /<a:t>([^<]*)<\/a:t>/g;
          let x2: RegExpExecArray | null;
          while ((x2 = t2.exec(cm[0])) !== null) bits.push(x2[1]);
          row.push(bits.join(" ").replace(/\s+/g, " ").trim());
        }
        if (row.length) rows.push(row);
      }
      for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < rows[r].length; c++) {
          if (rows[r][c].toLowerCase() !== label) continue;
          // which shape is this table? a 2-cell row is key/value ("Measure |
          // 10") and the value sits beside; a wider row is a header row and
          // the value sits below. Reading below in a key/value table returns
          // the NEXT KEY, which is how "Measure" once resolved to "To Measure".
          const headerRow = rows[r].length > 2;
          if (headerRow && r + 1 < rows.length && c < rows[r + 1].length && rows[r + 1][c]) {
            return rows[r + 1][c];
          }
          if (!headerRow && c + 1 < rows[r].length && rows[r][c + 1]) {
            return rows[r][c + 1];
          }
        }
      }
    }
    return "";
  };
  const m0s = after("measure") || after("from measure");
  const m1s = after("to measure");
  if (!m0s || !m1s) return null;
  const m0 = parseFloat(m0s), m1 = parseFloat(m1s);
  if (isNaN(m0) || isNaN(m1) || m1 <= m0) return null;
  const sp = txt.match(/[Ss]plit measure\s*:?\s*([\d.]+)/);
  const split = sp ? parseFloat(sp[1]) : (m0 + m1) / 2;
  const routeId = after("route id") || after("from rid") || "R1";
  const eventId = after("event id") || "E1";
  if (!/^[A-Za-z0-9]{1,10}$/.test(routeId) || !/^[A-Za-z0-9_]{1,10}$/.test(eventId)) return null;
  const dec = (m0 % 1 || m1 % 1 || split % 1) ? 1 : 0;

  const topo = topology(kind);
  const innerW = FIG_W - FIG_PAD * 2 - 46;
  const innerH = Math.min(360, Math.max(115, innerW / topo.aspect));
  const bandH = innerH + FIG_PAD * 2 + 26;
  const body: string[] = [];
  const rows: { cap: string; ext: number[][]; sp: number }[] = [
    { cap: "", ext: [[m0, m1, 0]], sp: NaN },
    { cap: "Output", ext: [[m0, split, 0], [split, m1, 1]], sp: split },
  ];
  const roles = ["cool", "warm"];
  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];
    const oy = FIG_PAD + ri * bandH;
    const ox = FIG_PAD + 46;
    const pts = topo.pts.map((p) => [ox + p[0] * innerW, oy + p[1] * innerH]);
    const cum = [0];
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i], b = pts[i + 1];
      cum.push(cum[i] + Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])));
    }
    const total = cum[cum.length - 1] || 1;
    let cx = 0, cy = 0;
    for (const p of pts) { cx += p[0]; cy += p[1]; }
    cx /= pts.length; cy /= pts.length;
    if (row.cap) body.push('<text class="note" x="' + fnum(FIG_PAD) + '" y="' + fnum(oy - 16) + '">' +
      esc(row.cap) + "</text>");
    for (const ex of topo.extras) {
      const d = ex.map((p, i) => (i ? "L " : "M ") + fnum(ox + p[0] * innerW) + " " +
        fnum(oy + p[1] * innerH)).join(" ");
      body.push('<path class="ln route ctx" d="' + d + '"/>');
    }
    const d = pts.map((p, i) => (i ? "L " : "M ") + fnum(p[0]) + " " + fnum(p[1])).join(" ");
    body.push('<path class="ln route" d="' + d + '"' +
      (topo.closed ? "" : ' marker-end="url(#ar)"') + "/>");
    for (const e of row.ext) {
      const a = atMeasure(pts, cum, total, m0, m1, e[0]);
      const b = atMeasure(pts, cum, total, m0, m1, e[1]);
      const fa = Math.max(0, Math.min(1, (e[0] - m0) / (m1 - m0))) * total;
      const fb = Math.max(0, Math.min(1, (e[1] - m0) / (m1 - m0))) * total;
      const mid: string[] = ["M " + fnum(a[0]) + " " + fnum(a[1])];
      for (let i = 1; i + 1 < pts.length; i++) if (fa < cum[i] && cum[i] < fb)
        mid.push("L " + fnum(pts[i][0]) + " " + fnum(pts[i][1]));
      mid.push("L " + fnum(b[0]) + " " + fnum(b[1]));
      body.push('<path class="ln event flat s-' + roles[e[2]] + '" d="' + mid.join(" ") + '"/>');
      const c = atMeasure(pts, cum, total, m0, m1, (e[0] + e[1]) / 2);
      let nx = -c[3], ny = c[2];
      if ((c[0] - cx) * nx + (c[1] - cy) * ny > 0) { nx = -nx; ny = -ny; }
      body.push('<text class="id f-' + roles[e[2]] + '" x="' + fnum(c[0] + nx * 17) + '" y="' +
        fnum(c[1] + ny * 17) + '" text-anchor="middle" dominant-baseline="central">' +
        esc(eventId) + "</text>");
    }
    const major = niceStep(m1 - m0);
    const minor = major >= 5 ? major / 5 : major;
    let mm = Math.ceil(m0 / minor) * minor;
    while (mm <= m1 + 1e-9) {
      const q = atMeasure(pts, cum, total, m0, m1, mm);
      let nx = -q[3], ny = q[2];
      if ((q[0] - cx) * nx + (q[1] - cy) * ny < 0) { nx = -nx; ny = -ny; }
      const isMaj = Math.abs(mm / major - Math.round(mm / major)) < 1e-6;
      const L = (isMaj ? TICK_MAJOR : TICK_MINOR) / 2;
      body.push('<line class="ln tick' + (isMaj ? " maj" : "") + '" x1="' + fnum(q[0] - nx * L) +
        '" y1="' + fnum(q[1] - ny * L) + '" x2="' + fnum(q[0] + nx * L) + '" y2="' +
        fnum(q[1] + ny * L) + '"/>');
      if (isMaj && !(topo.closed && Math.abs(mm - m1) < 1e-9)) {
        body.push('<text class="measure" x="' + fnum(q[0] + nx * (TICK_MAJOR / 2 + TICK_GAP)) +
          '" y="' + fnum(q[1] + ny * (TICK_MAJOR / 2 + TICK_GAP)) +
          '" text-anchor="middle" dominant-baseline="central">' +
          (dec ? mm.toFixed(dec) : String(Math.round(mm))) + "</text>");
      }
      mm += minor;
    }
    if (!isNaN(row.sp) && row.sp > m0 && row.sp < m1) {
      const q = atMeasure(pts, cum, total, m0, m1, row.sp);
      const nx = -q[3], ny = q[2];
      body.push('<line class="split" x1="' + fnum(q[0] - nx * 14) + '" y1="' + fnum(q[1] - ny * 14) +
        '" x2="' + fnum(q[0] + nx * 14) + '" y2="' + fnum(q[1] + ny * 14) + '"/>');
      body.push('<circle class="splitdot" cx="' + fnum(q[0]) + '" cy="' + fnum(q[1]) + '" r="3.4"/>');
    }
    body.push('<text class="id f-ink" x="' + fnum(FIG_PAD + 36) + '" y="' + fnum(oy + innerH / 2) +
      '" text-anchor="end" dominant-baseline="central">' + esc(routeId) + "</text>");
  }
  const shape = kind ? kind.toLowerCase() : "straight";
  const title = "Slide " + no + " route diagram";
  const desc = "Schematic redrawn from the slide's data: " + shape + " route " + routeId +
    ", event " + eventId + " from measure " + fnum(m0) + " to " + fnum(m1) +
    ", split at measure " + fnum(split) + ".";
  return { slide: no, name: "slide" + no + ".svg",
    svg: svgWrap(no, FIG_W, bandH * rows.length + FIG_PAD, title, desc, body.join("")), alt: desc };
}

function buildFigure(xml: string, no: number): SlideFigure | null {
  const v = buildVector(xml, no);
  if (v) return v;
  return buildRedraw(xml, no);
}

// ------------------------------------------------ slide ordering
function slideNum(name: string): number {
  const m = name.match(/[sS]lide(\d+)\.xml$/);
  return m ? parseInt(m[1], 10) : 0;
}

// v1.9 (SC-2): true presentation order from ppt/presentation.xml's
// sldIdLst, resolved through ppt/_rels/presentation.xml.rels.
// PowerPoint does not renumber slide parts on reorder/delete, so part
// filenames are creation order, not display order. Fallback: the old
// numeric part sort when either part is missing or resolves to zero
// slides; parts absent from the list are appended (never dropped).
function orderSlides(bytes: Uint8Array, entries: ZipEntry[], slides: ZipEntry[]): ZipEntry[] {
  const fallback = slides.slice().sort((a, b) => slideNum(a.name) - slideNum(b.name));
  const presEntry = entries.filter((e) => e.name === "ppt/presentation.xml")[0];
  const presRels = entries.filter((e) => e.name === "ppt/_rels/presentation.xml.rels")[0];
  if (!presEntry || !presRels) return fallback;
  let presXml = "";
  let relsXml = "";
  try {
    presXml = utf8ToString(extractEntry(bytes, presEntry));
    relsXml = utf8ToString(extractEntry(bytes, presRels));
  } catch (e) {
    return fallback;
  }
  const idToSlide: { [id: string]: string } = {};
  const tagRe = /<Relationship\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(relsXml)) !== null) {
    const idm = m[0].match(/\bId="([^"]+)"/);
    const tgm = m[0].match(/\bTarget="[^"]*?(slides\/slide\d+\.xml)"/);
    if (idm && tgm) idToSlide[idm[1]] = "ppt/" + tgm[1];
  }
  const lst = presXml.match(/<p:sldIdLst>[\s\S]*?<\/p:sldIdLst>/);
  if (!lst) return fallback;
  const byName: { [n: string]: ZipEntry } = {};
  for (const s of slides) byName[s.name] = s;
  const ordered: ZipEntry[] = [];
  const used: { [n: string]: boolean } = {};
  const rid = /r:id="([^"]+)"/g;
  while ((m = rid.exec(lst[0])) !== null) {
    const n = idToSlide[m[1]];
    if (n && byName[n] && !used[n]) {
      used[n] = true;
      ordered.push(byName[n]);
    }
  }
  if (ordered.length === 0) return fallback;
  for (const s of fallback) {
    if (!used[s.name]) ordered.push(s);
  }
  return ordered;
}


// ============ KEEP IN SYNC with ZipTextExtract.ts / MediaExtract.ts =======
// Everything from here down — b64ToBytes, the zip central-directory reader,
// extractEntry, the RFC 1951 inflate and the utf-8 decoder — is duplicated
// byte-for-byte across the three scripts (Office Scripts cannot share
// modules). Every fix landed in one MUST be landed in the others in the same
// batch; the harness equivalence gates are the only enforcement.
// =========================================================================
// ------------------------------------------------------------ base64
// ============ KEEP IN SYNC with MediaExtract.ts (SB-8) ==============
// Everything from here through the utf-8 decoder — b64ToBytes, the
// zip central-directory reader, extractEntry, and the RFC 1951
// inflate — is duplicated byte-for-byte in MediaExtract.ts (Office
// Scripts cannot share modules). Every fix landed here MUST be landed
// there in the same batch, and vice versa; the harness equivalence
// gates are the only enforcement.
// =====================================================================
// v1.6: Uint8Array + charCode table. Skips '=', CR/LF and any
// non-alphabet char exactly as v1.5's dictionary miss did.
function b64ToBytes(b64: string): Uint8Array {
  const T = new Int32Array(128).fill(-1);
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (let i = 0; i < alpha.length; i++) T[alpha.charCodeAt(i)] = i;
  const out = new Uint8Array(Math.floor((b64.length * 3) / 4) + 3);
  let n = 0;
  let buf = 0, bits = 0;
  for (let i = 0; i < b64.length; i++) {
    const code = b64.charCodeAt(i);
    if (code >= 128) continue;
    const v = T[code];
    if (v < 0) continue;
    buf = (buf << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[n++] = (buf >> bits) & 0xff;
    }
  }
  return n === out.length ? out : out.subarray(0, n);
}

// ------------------------------------------------------------ zip reader
interface ZipEntry {
  name: string;
  method: number;
  flags: number; // v1.9 (SC-14): general-purpose bit flags
  compSize: number;
  uncompSize: number;
  localOffset: number;
}

function u16(b: Uint8Array, p: number): number { return b[p] | (b[p + 1] << 8); }
function u32(b: Uint8Array, p: number): number {
  return (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24)) >>> 0;
}

function readCentralDirectory(b: Uint8Array): ZipEntry[] {
  // find EOCD (0x06054b50) scanning back from end (max comment 64k)
  let eocd = -1;
  const stop = Math.max(0, b.length - 65558);
  for (let p = b.length - 22; p >= stop; p--) {
    if (b[p] === 0x50 && b[p + 1] === 0x4b && b[p + 2] === 0x05 && b[p + 3] === 0x06) {
      eocd = p; break;
    }
  }
  if (eocd < 0) throw new Error("ZipTextExtract: EOCD not found (not a zip?)");
  const count = u16(b, eocd + 10);
  let p = u32(b, eocd + 16); // central directory offset
  const entries: ZipEntry[] = [];
  for (let i = 0; i < count; i++) {
    if (u32(b, p) !== 0x02014b50) throw new Error("ZipTextExtract: bad central header at " + p);
    const flags = u16(b, p + 8);
    const method = u16(b, p + 10);
    const compSize = u32(b, p + 20);
    const uncompSize = u32(b, p + 24);
    const nameLen = u16(b, p + 28);
    const extraLen = u16(b, p + 30);
    const commentLen = u16(b, p + 32);
    const localOffset = u32(b, p + 42);
    let name = "";
    for (let k = 0; k < nameLen; k++) name += String.fromCharCode(b[p + 46 + k]);
    entries.push({ name: name, method: method, flags: flags, compSize: compSize, uncompSize: uncompSize, localOffset: localOffset });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function extractEntry(b: Uint8Array, e: ZipEntry): Uint8Array {
  // v1.9 (SC-14): an encrypted stored entry would otherwise return
  // ciphertext as "text" silently — the one silent-wrong-output path
  // in the zip layer.
  if ((e.flags & 0x1) !== 0) throw new Error("ZipTextExtract: encrypted entry " + e.name);
  const p = e.localOffset;
  if (u32(b, p) !== 0x04034b50) throw new Error("ZipTextExtract: bad local header for " + e.name);
  const nameLen = u16(b, p + 26);
  const extraLen = u16(b, p + 28); // local extra can differ from central
  const dataStart = p + 30 + nameLen + extraLen;
  const data = b.subarray(dataStart, dataStart + e.compSize); // v1.6: view, no copy
  if (e.method === 0) return data;                    // stored
  if (e.method === 8) return inflateRaw(data, e.uncompSize); // deflate
  throw new Error("ZipTextExtract: unsupported compression method " + e.method + " for " + e.name);
}

// ------------------------------------------------------------ inflate (RFC 1951)
const LEN_BASE = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
const LEN_EXTRA = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
const DIST_BASE = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
const DIST_EXTRA = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
const CLC_ORDER = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

interface Huff { counts: number[]; symbols: number[]; }

function buildHuff(lengths: number[]): Huff {
  const counts = new Array<number>(16).fill(0);
  for (const l of lengths) counts[l]++;
  counts[0] = 0;
  const offs = new Array<number>(16).fill(0);
  for (let i = 1; i < 16; i++) offs[i] = offs[i - 1] + counts[i - 1];
  const symbols = new Array<number>(lengths.length).fill(0);
  for (let s = 0; s < lengths.length; s++) {
    if (lengths[s] !== 0) symbols[offs[lengths[s]]++] = s;
  }
  return { counts: counts, symbols: symbols };
}

// v1.6: output preallocated from outHint (central-directory uncompSize),
// doubling growth as a safety net; write pointer instead of push. The
// back-reference copy stays a byte-wise loop — overlapping copies
// (distance < length) are RLE by definition and forbid block copies.
function inflateRaw(src: Uint8Array, outHint: number): Uint8Array {
  let out = new Uint8Array(outHint > 0 ? outHint : 1024);
  let outLen = 0;
  let pos = 0;      // byte position
  let bitBuf = 0, bitCnt = 0;

  function ensure(extra: number): void {
    if (outLen + extra <= out.length) return;
    let cap = out.length * 2;
    while (cap < outLen + extra) cap *= 2;
    const grown = new Uint8Array(cap);
    grown.set(out);
    out = grown;
  }

  function bits(n: number): number {
    while (bitCnt < n) {
      if (pos >= src.length) throw new Error("inflate: out of input");
      bitBuf |= src[pos++] << bitCnt;
      bitCnt += 8;
    }
    const v = bitBuf & ((1 << n) - 1);
    bitBuf >>>= n;
    bitCnt -= n;
    return v;
  }

  function decodeSym(h: Huff): number {
    let code = 0, first = 0, index = 0;
    for (let len = 1; len < 16; len++) {
      code |= bits(1);
      const count = h.counts[len];
      if (code - first < count) return h.symbols[index + (code - first)];
      index += count;
      first = (first + count) << 1;
      code <<= 1;
    }
    throw new Error("inflate: bad code");
  }

  let fixedLit: Huff | null = null;
  let fixedDist: Huff | null = null;

  while (true) {
    const final = bits(1);
    const type = bits(2);
    if (type === 0) {
      // stored block: align to byte
      bitBuf = 0; bitCnt = 0;
      const len = src[pos] | (src[pos + 1] << 8);
      const nlen = src[pos + 2] | (src[pos + 3] << 8);
      pos += 4; // skip LEN + NLEN
      // v2.0 (SB-5): NLEN is LEN's ones-complement by spec — a corrupted
      // length field previously emitted garbled text as a "successful"
      // extraction. (A truncated header is caught by the bounds check
      // below, since pos has already advanced past both fields.)
      if (nlen !== (~len & 0xffff)) throw new Error("inflate: stored block NLEN mismatch");
      // v1.9 (SC-8): a truncated stored block previously zero-padded
      // silently (OOB Uint8Array reads yield undefined -> 0), emitting
      // garbled text as a "successful" extraction. Huffman blocks
      // already throw via bits(); stored blocks now match.
      if (pos + len > src.length) throw new Error("inflate: stored block out of input");
      ensure(len);
      for (let i = 0; i < len; i++) out[outLen++] = src[pos++];
    } else {
      let lit: Huff, dist: Huff;
      if (type === 1) {
        if (!fixedLit) {
          const ll = new Array<number>(288);
          for (let i = 0; i < 144; i++) ll[i] = 8;
          for (let i = 144; i < 256; i++) ll[i] = 9;
          for (let i = 256; i < 280; i++) ll[i] = 7;
          for (let i = 280; i < 288; i++) ll[i] = 8;
          fixedLit = buildHuff(ll);
          fixedDist = buildHuff(new Array<number>(30).fill(5));
        }
        lit = fixedLit; dist = fixedDist as Huff;
      } else if (type === 2) {
        const hlit = bits(5) + 257;
        const hdist = bits(5) + 1;
        const hclen = bits(4) + 4;
        const clcLens = new Array<number>(19).fill(0);
        for (let i = 0; i < hclen; i++) clcLens[CLC_ORDER[i]] = bits(3);
        const clc = buildHuff(clcLens);
        const lens: number[] = [];
        while (lens.length < hlit + hdist) {
          const sym = decodeSym(clc);
          if (sym < 16) lens.push(sym);
          else if (sym === 16) {
            const prev = lens[lens.length - 1];
            let rep = 3 + bits(2);
            while (rep--) lens.push(prev);
          } else if (sym === 17) {
            let rep = 3 + bits(3);
            while (rep--) lens.push(0);
          } else {
            let rep = 11 + bits(7);
            while (rep--) lens.push(0);
          }
        }
        lit = buildHuff(lens.slice(0, hlit));
        dist = buildHuff(lens.slice(hlit));
      } else {
        throw new Error("inflate: bad block type");
      }
      while (true) {
        const sym = decodeSym(lit);
        if (sym < 256) { ensure(1); out[outLen++] = sym; }
        else if (sym === 256) break;
        else {
          const li = sym - 257;
          const length = LEN_BASE[li] + bits(LEN_EXTRA[li]);
          const dsym = decodeSym(dist);
          const distance = DIST_BASE[dsym] + bits(DIST_EXTRA[dsym]);
          const start = outLen - distance;
          if (start < 0) throw new Error("inflate: bad distance");
          ensure(length);
          for (let i = 0; i < length; i++) out[outLen++] = out[start + i];
        }
      }
    }
    if (final) break;
  }
  return outLen === out.length ? out : out.subarray(0, outLen);
}

// ------------------------------------------------------------ utf-8 decode
// v1.6: identical decode logic; code units buffered and flushed through
// String.fromCharCode in 4096-unit chunks instead of per-char concat.
function utf8ToString(b: Uint8Array): string {
  const parts: string[] = [];
  let codes: number[] = [];
  let i = 0;
  while (i < b.length) {
    const c = b[i];
    if (c < 0x80) { codes.push(c); i += 1; }
    else if (c < 0xe0) { codes.push(((c & 0x1f) << 6) | (b[i + 1] & 0x3f)); i += 2; }
    else if (c < 0xf0) {
      codes.push(((c & 0x0f) << 12) | ((b[i + 1] & 0x3f) << 6) | (b[i + 2] & 0x3f));
      i += 3;
    } else {
      const cp = ((c & 0x07) << 18) | ((b[i + 1] & 0x3f) << 12) | ((b[i + 2] & 0x3f) << 6) | (b[i + 3] & 0x3f);
      const u = cp - 0x10000;
      codes.push(0xd800 + (u >> 10), 0xdc00 + (u & 0x3ff));
      i += 4;
    }
    if (codes.length >= 4096) {
      parts.push(String.fromCharCode(...codes));
      codes = [];
    }
  }
  if (codes.length > 0) parts.push(String.fromCharCode(...codes));
  return parts.join("");
}
