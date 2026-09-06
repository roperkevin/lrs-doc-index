/**
 * ShapeExtract v1.0 — a pptx slide's DRAWN shapes and their text, faithfully
 * ------------------------------------------------------------------------
 * Companion to ZipTextExtract / MediaExtract, same input (the file's bytes
 * as base64). Where ZipTextExtract folds a diagram's short labels into one
 * `[figure: …]` line and MediaExtract saves pasted pictures, this script
 * extracts the DRAWING LAYER itself — the rectangles, ovals, arrows,
 * connectors, freeforms and text boxes people draw on a slide — and
 * returns, per slide that carries a drawing:
 *
 *   { drawings: [{ slide, name, svg, alt, shapes, connectors,
 *                  connections, labels }], count, skipped }
 *
 *   svg          a standalone SVG of the slide's drawing layer at the
 *                shapes' TRUE positions, sizes, fills, outlines, dash
 *                patterns, arrowheads, rotations and text (wrapped inside
 *                its shape the way PowerPoint lays it out), cropped to the
 *                drawing's extent. No restyling, no redraw, no guessing:
 *                what the slide draws is what the figure shows. Pictures
 *                on the slide render as a placeholder box that ALSO
 *                references the sibling picture file by basename (the
 *                sweep rewrites the basename when it renames the picture),
 *                so an annotated screenshot keeps its annotations in place.
 *   connections  the connectors whose ends PowerPoint glued to shapes
 *                (a:stCxn / a:endCxn), as `A → B` text — the diagram's
 *                meaning as words, which is what a searcher types.
 *   labels       every shape's text in reading order (top-down,
 *                left-right), ` · `-joined — the drawing's own words.
 *   name         `slide<N>-drawing.svg` (the sweep standardizes it).
 *
 * A slide QUALIFIES as a drawing when it carries at least three drawn
 * primitives (a shape with a visible fill or outline, a connector, a
 * freeform). Placeholders (title, body, slide number) are prose and never
 * draw; a plain text box with neither fill nor outline is a label and
 * renders only on a slide that qualifies. Tables, charts and SmartArt
 * frames are not drawn (tables reach the sidecar as tables). Slides are
 * numbered in presentation order (ppt/presentation.xml sldIdLst), like
 * ZipTextExtract's headings, so a drawing lands under its own slide.
 *
 * Colours resolve through the deck's own theme (ppt/theme/theme1.xml
 * clrScheme; Office defaults when absent) with lumMod / lumOff / tint /
 * shade applied; style references (p:style lnRef / fillRef / fontRef)
 * fill in what spPr leaves implicit. Preset geometries render as their
 * SVG primitive (rect, rounded rect, ellipse, diamond, triangles, block
 * arrows, chevrons, hexagons, parallelograms, terminators…); anything
 * else renders as its bounding rectangle carrying `data-prst`. Freeforms
 * (custGeom moveTo/lnTo/cubicBezTo/quadBezTo/close) render as paths.
 * Groups apply their child-space transform. Bent connectors draw as the
 * elbow PowerPoint draws; curved ones as a quadratic curve.
 *
 * Bounded like MediaExtract: at most MAX_DRAWINGS per deck, MAX_SHAPES
 * per slide (busier slides are skipped and listed), MAX_SVG chars per
 * figure. Zero dependencies; ES2017; the zip reader below is the shared
 * one (KEEP IN SYNC banner).
 */
interface Drawing {
  slide: number;
  name: string;
  svg: string;
  alt: string;
  shapes: number;
  connectors: number;
  connections: string;
  labels: string;
}
interface ShapesResult { drawings: Drawing[]; count: number; skipped: string; }

const MAX_DRAWINGS = 96;
const MAX_SHAPES = 400;
const MAX_SVG = 250 * 1024;
const MIN_DRAWN = 3;
const EMU_PX = 96 / 914400;
const PAD = 16;
const LABEL_MAX = 48;
const FONT = "Calibri, Carlito, Arial, sans-serif";

// ---------------------------------------------------------------- main
function main(workbook: ExcelScript.Workbook, zipBase64: string): ShapesResult {
  const bytes = b64ToBytes(zipBase64);
  const entries = readCentralDirectory(bytes);
  const slideParts = entries.filter((e) => /^ppt\/slides\/[^/]+\.xml$/.test(e.name));
  if (slideParts.length === 0) return { drawings: [], count: 0, skipped: "" };
  const slides = orderSlides(bytes, entries, slideParts);
  const theme = readTheme(bytes, entries);
  // a slide's pictures resolve through its own rels to media basenames,
  // exactly as ZipTextExtract links them — the placeholder box in the
  // drawing references the sibling picture file by that basename
  const relsOf = (slideName: string): { [id: string]: string } => {
    const relName = slideName.replace(/^ppt\/slides\//, "ppt/slides/_rels/") + ".rels";
    const ent = entries.filter((e) => e.name === relName)[0];
    const out: { [id: string]: string } = {};
    if (!ent) return out;
    let rels = "";
    try { rels = utf8ToString(extractEntry(bytes, ent)); } catch (e) { return out; }
    const tagRe = /<Relationship\b[^>]*>/g;
    let rm: RegExpExecArray | null;
    while ((rm = tagRe.exec(rels)) !== null) {
      const idm = rm[0].match(/\bId="([^"]+)"/);
      const tgm = rm[0].match(/\bTarget="[^"]*media\/([^"]+)"/);
      if (idm && tgm) out[idm[1]] = tgm[1];
    }
    return out;
  };
  const drawings: Drawing[] = [];
  const skipped: string[] = [];
  for (let i = 0; i < slides.length; i++) {
    const no = i + 1;
    let xml = "";
    try {
      xml = utf8ToString(extractEntry(bytes, slides[i]));
    } catch (e) {
      skipped.push("slide" + no + ":unreadable");
      continue;
    }
    const parsed = parseDrawing(xml, theme, relsOf(slides[i].name));
    if (parsed.elems.length > MAX_SHAPES) { skipped.push("slide" + no + ":busy"); continue; }
    if (parsed.drawn < MIN_DRAWN) continue;
    if (drawings.length >= MAX_DRAWINGS) { skipped.push("slide" + no + ":cap"); continue; }
    const d = renderDrawing(parsed, no);
    if (d.svg.length > MAX_SVG) { skipped.push("slide" + no + ":large"); continue; }
    drawings.push(d);
  }
  return { drawings: drawings, count: drawings.length, skipped: skipped.join("\n") };
}

// ---------------------------------------------------------------- model
interface TextLine { t: string; }
interface Para { lines: string[]; algn: string; }
interface Elem {
  kind: string;       // "shape" | "conn" | "path" | "pic" | "label"
  id: string;
  x: number; y: number; w: number; h: number;   // px, unrotated box
  rot: number;        // degrees
  flipH: boolean; flipV: boolean;
  prst: string;
  adj: number;        // first adjust value / 100000, or -1
  fill: string;       // "" = none
  stroke: string;     // "" = none
  strokeW: number;    // px
  dash: string;       // svg dasharray or ""
  headArrow: boolean; // arrow at the START point
  tailArrow: boolean; // arrow at the END point
  paras: Para[];
  fontPx: number;
  bold: boolean;
  textColor: string;
  anchor: string;     // t | ctr | b
  insets: number[];   // l t r b px
  pathD: string;      // freeform path (px, absolute)
  closed: boolean;
  stId: string; endId: string;   // connector glue
  picName: string;
  text: string;       // flattened text
}
interface Parsed { elems: Elem[]; drawn: number; }
interface Group { s: number; e: number; gx: number; gy: number; gw: number; gh: number; cx: number; cy: number; cw: number; ch: number; }
interface Theme { [k: string]: string; }

const OFFICE_THEME: Theme = {
  dk1: "000000", lt1: "FFFFFF", dk2: "44546A", lt2: "E7E6E6",
  accent1: "4472C4", accent2: "ED7D31", accent3: "A5A5A5", accent4: "FFC000",
  accent5: "5B9BD5", accent6: "70AD47", hlink: "0563C1", folHlink: "954F72",
  tx1: "000000", bg1: "FFFFFF", tx2: "44546A", bg2: "E7E6E6",
};

function readTheme(bytes: Uint8Array, entries: ZipEntry[]): Theme {
  const t: Theme = {};
  for (const k in OFFICE_THEME) t[k] = OFFICE_THEME[k];
  const ent = entries.filter((e) => /^ppt\/theme\/theme\d*\.xml$/.test(e.name))[0];
  if (!ent) return t;
  let xml = "";
  try { xml = utf8ToString(extractEntry(bytes, ent)); } catch (e) { return t; }
  const cs = (xml.match(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/) || [""])[0];
  const re = /<a:(dk1|lt1|dk2|lt2|accent[1-6]|hlink|folHlink)>([\s\S]*?)<\/a:\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cs)) !== null) {
    const hex = (m[2].match(/lastClr="([0-9A-Fa-f]{6})"/) || m[2].match(/<a:srgbClr val="([0-9A-Fa-f]{6})"/) || ["", ""])[1];
    if (hex) t[m[1]] = hex.toUpperCase();
  }
  t.tx1 = t.dk1; t.bg1 = t.lt1; t.tx2 = t.dk2; t.bg2 = t.lt2;
  return t;
}

// ---------------------------------------------------------------- colours
function hexToRgb(hex: string): number[] {
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}
function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number): string => {
    const n = Math.max(0, Math.min(255, Math.round(v)));
    return (n < 16 ? "0" : "") + n.toString(16).toUpperCase();
  };
  return c(r) + c(g) + c(b);
}
function rgbToHsl(r: number, g: number, b: number): number[] {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = 0;
  if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}
function hslToRgb(h: number, s: number, l: number): number[] {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

/** The colour a DrawingML colour element resolves to: srgbClr / schemeClr
 *  / sysClr / prstClr with lumMod, lumOff, tint and shade applied. "" when
 *  the fragment carries no colour. */
function colorOf(frag: string, theme: Theme): string {
  const el = frag.match(/<a:(srgbClr|schemeClr|sysClr|prstClr)\b([^>]*)(?:\/>|>([\s\S]*?)<\/a:\1>)/);
  if (!el) return "";
  let hex = "";
  const attrs = el[2] || "";
  if (el[1] === "srgbClr") hex = (attrs.match(/val="([0-9A-Fa-f]{6})"/) || ["", ""])[1];
  else if (el[1] === "schemeClr") {
    const v = (attrs.match(/val="(\w+)"/) || ["", ""])[1];
    hex = theme[v] || "";
  } else if (el[1] === "sysClr") {
    hex = (attrs.match(/lastClr="([0-9A-Fa-f]{6})"/) || ["", ""])[1] ||
      ((attrs.match(/val="window"/)) ? "FFFFFF" : "000000");
  } else {
    const v = (attrs.match(/val="(\w+)"/) || ["", ""])[1];
    hex = v === "white" ? "FFFFFF" : v === "black" ? "000000" : v === "red" ? "FF0000" :
      v === "blue" ? "0000FF" : v === "green" ? "008000" : v === "yellow" ? "FFFF00" :
      v === "gray" || v === "grey" ? "808080" : "";
  }
  if (!hex) return "";
  hex = hex.toUpperCase();
  const mods = el[3] || "";
  if (!mods) return hex;
  let rgb = hexToRgb(hex);
  const lumMod = mods.match(/<a:lumMod val="(\d+)"/);
  const lumOff = mods.match(/<a:lumOff val="(-?\d+)"/);
  if (lumMod || lumOff) {
    const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    let l = hsl[2];
    if (lumMod) l = l * (parseInt(lumMod[1], 10) / 100000);
    if (lumOff) l = l + parseInt(lumOff[1], 10) / 100000;
    rgb = hslToRgb(hsl[0], hsl[1], Math.max(0, Math.min(1, l)));
  }
  const tint = mods.match(/<a:tint val="(\d+)"/);
  if (tint) {
    const f = parseInt(tint[1], 10) / 100000;
    rgb = [rgb[0] * f + 255 * (1 - f), rgb[1] * f + 255 * (1 - f), rgb[2] * f + 255 * (1 - f)];
  }
  const shade = mods.match(/<a:shade val="(\d+)"/);
  if (shade) {
    const f = parseInt(shade[1], 10) / 100000;
    rgb = [rgb[0] * f, rgb[1] * f, rgb[2] * f];
  }
  const alpha = mods.match(/<a:alpha val="(\d+)"/);
  if (alpha && parseInt(alpha[1], 10) < 15000) return ""; // effectively invisible
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

// ---------------------------------------------------------------- groups
function findGroups(xml: string): Group[] {
  const out: Group[] = [];
  const stack: number[] = [];
  const re = /<p:grpSp>|<p:grpSp\s[^>]*>|<\/p:grpSp>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    if (m[0].indexOf("</") !== 0) { stack.push(m.index); continue; }
    if (stack.length === 0) continue;
    const s = stack.pop() as number;
    const b = xml.slice(s, m.index + m[0].length);
    const gp = (b.match(/<p:grpSpPr>[\s\S]*?<\/p:grpSpPr>/) || [""])[0];
    const o = gp.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const e = gp.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    const c = gp.match(/<a:chOff x="(-?\d+)" y="(-?\d+)"\/>/);
    const ce = gp.match(/<a:chExt cx="(\d+)" cy="(\d+)"\/>/);
    if (o && e && c && ce) {
      out.push({ s: s, e: m.index + m[0].length,
        gx: parseInt(o[1], 10), gy: parseInt(o[2], 10), gw: parseInt(e[1], 10), gh: parseInt(e[2], 10),
        cx: parseInt(c[1], 10), cy: parseInt(c[2], 10), cw: parseInt(ce[1], 10), ch: parseInt(ce[2], 10) });
    }
  }
  return out;
}

function groupXform(gs: Group[], at: number, X: number, Y: number, W: number, H: number): number[] {
  const encl: Group[] = [];
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

// ---------------------------------------------------------------- parse
function dashOf(lnB: string, w: number): string {
  const v = (lnB.match(/<a:prstDash val="(\w+)"/) || ["", ""])[1];
  const u = Math.max(1, w);
  if (!v || v === "solid") return "";
  if (v === "dot" || v === "sysDot") return (u * 1) + " " + (u * 2);
  if (v === "dash" || v === "sysDash") return (u * 4) + " " + (u * 3);
  if (v === "lgDash") return (u * 8) + " " + (u * 3);
  if (v === "dashDot" || v === "sysDashDot") return (u * 4) + " " + (u * 3) + " " + u + " " + (u * 3);
  if (v === "lgDashDot") return (u * 8) + " " + (u * 3) + " " + u + " " + (u * 3);
  if (v === "lgDashDotDot" || v === "sysDashDotDot") return (u * 8) + " " + (u * 3) + " " + u + " " + (u * 3) + " " + u + " " + (u * 3);
  return (u * 4) + " " + (u * 3);
}

function textOf(b: string, theme: Theme, fillDefault: string): { paras: Para[]; fontPx: number; bold: boolean; color: string; anchor: string; insets: number[]; flat: string } {
  const tb = (b.match(/<p:txBody>[\s\S]*?<\/p:txBody>/) || [""])[0];
  const empty = { paras: [] as Para[], fontPx: 24, bold: false, color: "", anchor: "t", insets: [9.6, 4.8, 9.6, 4.8], flat: "" };
  if (!tb) return empty;
  const bp = (tb.match(/<a:bodyPr\b[^>]*\/?>/) || [""])[0];
  const anchor = (bp.match(/anchor="(\w+)"/) || ["", "t"])[1];
  const ins = (k: string, d: number): number => {
    const m = bp.match(new RegExp(k + 'Ins="(-?\\d+)"'));
    return m ? parseInt(m[1], 10) * EMU_PX : d;
  };
  const insets = [ins("l", 9.6), ins("t", 4.8), ins("r", 9.6), ins("b", 4.8)];
  const fontScale = (tb.match(/<a:normAutofit\b[^>]*fontScale="(\d+)"/) || ["", "100000"])[1];
  const scale = parseInt(fontScale, 10) / 100000;
  const paras: Para[] = [];
  let sz = 0, bold = false, color = "";
  const pre = /<a:p>([\s\S]*?)<\/a:p>|<a:p\/>/g;
  let pm: RegExpExecArray | null;
  const flat: string[] = [];
  while ((pm = pre.exec(tb)) !== null) {
    const p = pm[1] || "";
    const algn = (p.match(/<a:pPr\b[^>]*algn="(\w+)"/) || ["", ""])[1];
    const lines: string[] = [];
    let cur = "";
    const rre = /<a:r>([\s\S]*?)<\/a:r>|<a:br\b[^>]*\/?>(?:[\s\S]*?<\/a:br>)?|<a:fld\b[^>]*>([\s\S]*?)<\/a:fld>/g;
    let rm: RegExpExecArray | null;
    while ((rm = rre.exec(p)) !== null) {
      if (rm[0].indexOf("<a:br") === 0) { lines.push(cur); cur = ""; continue; }
      const run = rm[1] !== undefined ? rm[1] : (rm[2] || "");
      const rp = (run.match(/<a:rPr\b[^>]*\/?>(?:[\s\S]*?<\/a:rPr>)?/) || [""])[0];
      const s = rp.match(/\bsz="(\d+)"/);
      if (s && !sz) sz = parseInt(s[1], 10);
      if (/\bb="1"/.test(rp)) bold = true;
      if (!color) color = colorOf((rp.match(/<a:solidFill>[\s\S]*?<\/a:solidFill>/) || [""])[0], theme);
      const t = (run.match(/<a:t>([^<]*)<\/a:t>/) || run.match(/<a:t\/>/) || ["", ""])[1] || "";
      cur += decodeXmlEntities(t);
    }
    lines.push(cur);
    const clean = lines.map((l) => l.replace(/\s+/g, " ").trim());
    if (clean.join("") === "" && paras.length === 0 && pm.index + pm[0].length >= tb.length - 20) continue;
    paras.push({ lines: clean, algn: algn });
    const ft = clean.filter((l) => l).join(" ");
    if (ft) flat.push(ft);
  }
  while (paras.length && paras[paras.length - 1].lines.join("") === "") paras.pop();
  const endSz = (tb.match(/<a:endParaRPr\b[^>]*sz="(\d+)"/) || ["", ""])[1];
  if (!sz && endSz) sz = parseInt(endSz, 10);
  if (!sz) sz = 1800;
  return {
    paras: paras, fontPx: (sz / 100) * (96 / 72) * scale, bold: bold,
    color: color || fillDefault, anchor: anchor, insets: insets,
    flat: flat.join(" ").replace(/\s+/g, " ").trim(),
  };
}

function parseDrawing(xml: string, theme: Theme, idToMedia: { [id: string]: string }): Parsed {
  const tree = (xml.match(/<p:spTree>[\s\S]*<\/p:spTree>/) || [xml])[0];
  const gs = findGroups(tree);
  const elems: Elem[] = [];
  let drawn = 0;
  const re = /<p:(sp|cxnSp|pic)\b[\s\S]*?<\/p:\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tree)) !== null) {
    const b = m[0];
    const kind = m[1];
    if (b.indexOf("<p:ph") >= 0) continue; // placeholders are prose
    const nv = (b.match(/<p:cNvPr\b[^>]*>/) || [""])[0];
    const id = (nv.match(/\bid="(\d+)"/) || ["", ""])[1];
    const spPr = (b.match(/<p:spPr\b[^>]*>[\s\S]*?<\/p:spPr>|<p:spPr\/>/) || [""])[0];
    const xf = (spPr.match(/<a:xfrm\b[^>]*>[\s\S]*?<\/a:xfrm>/) || [""])[0];
    const o = xf.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const e = xf.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    if (!o || !e) continue;
    const t = groupXform(gs, m.index, parseInt(o[1], 10), parseInt(o[2], 10), parseInt(e[1], 10), parseInt(e[2], 10));
    const xa = (xf.match(/<a:xfrm\b([^>]*)>/) || ["", ""])[1];
    const rotRaw = xa.match(/rot="(-?\d+)"/);
    const rot = rotRaw ? (((parseInt(rotRaw[1], 10) / 60000) % 360) + 360) % 360 : 0;
    const el: Elem = {
      kind: "shape", id: id, x: t[0] * EMU_PX, y: t[1] * EMU_PX, w: t[2] * EMU_PX, h: t[3] * EMU_PX,
      rot: rot, flipH: xa.indexOf('flipH="1"') >= 0, flipV: xa.indexOf('flipV="1"') >= 0,
      prst: (spPr.match(/<a:prstGeom prst="([^"]+)"/) || ["", "rect"])[1], adj: -1,
      fill: "", stroke: "", strokeW: 0, dash: "", headArrow: false, tailArrow: false,
      paras: [], fontPx: 24, bold: false, textColor: "", anchor: "t", insets: [9.6, 4.8, 9.6, 4.8],
      pathD: "", closed: false, stId: "", endId: "", picName: "", text: "",
    };
    const adj = spPr.match(/<a:gd name="adj1?" fmla="val (-?\d+)"/);
    if (adj) el.adj = parseInt(adj[1], 10) / 100000;
    // fill: spPr's own, else the style's fillRef
    const lnB = (spPr.match(/<a:ln\b[^>]*\/>|<a:ln\b[^>]*>[\s\S]*?<\/a:ln>/) || [""])[0];
    const fillPart = lnB ? spPr.slice(0, spPr.indexOf(lnB)) : spPr;
    const st = (b.match(/<p:style>[\s\S]*?<\/p:style>/) || [""])[0];
    const geomEnd = Math.max(fillPart.indexOf("</a:prstGeom>"), fillPart.indexOf("</a:custGeom>"), fillPart.indexOf("<a:prstGeom"));
    const fillFrag = geomEnd >= 0 ? fillPart.slice(geomEnd) : fillPart.replace(/<a:xfrm\b[\s\S]*?<\/a:xfrm>/, "");
    if (kind === "pic") {
      el.kind = "pic";
      const rid = (b.match(/r:embed="([^"]+)"/) || ["", ""])[1];
      el.picName = idToMedia[rid] || "";
    } else if (/<a:noFill\/>/.test(fillFrag.replace(/<a:ln\b[\s\S]*$/, ""))) {
      el.fill = "";
    } else if (/<a:solidFill>/.test(fillFrag)) {
      el.fill = colorOf((fillFrag.match(/<a:solidFill>[\s\S]*?<\/a:solidFill>/) || [""])[0], theme);
    } else if (/<a:gradFill\b/.test(fillFrag)) {
      el.fill = colorOf((fillFrag.match(/<a:gs\b[^>]*>[\s\S]*?<\/a:gs>/) || [""])[0], theme);
    } else if (/<a:pattFill\b/.test(fillFrag)) {
      el.fill = colorOf((fillFrag.match(/<a:fgClr>[\s\S]*?<\/a:fgClr>/) || [""])[0], theme);
    } else {
      const fr = st.match(/<a:fillRef idx="(\d+)">([\s\S]*?)<\/a:fillRef>/);
      if (fr && parseInt(fr[1], 10) > 0) el.fill = colorOf(fr[2], theme);
    }
    // outline: spPr's a:ln, else the style's lnRef
    let lnW = 0;
    if (lnB) {
      const w = lnB.match(/<a:ln\b[^>]*\bw="(\d+)"/);
      lnW = w ? parseInt(w[1], 10) * EMU_PX : 9525 * EMU_PX;
      if (/<a:noFill\/>/.test(lnB)) el.stroke = "";
      else if (/<a:solidFill>/.test(lnB)) el.stroke = colorOf((lnB.match(/<a:solidFill>[\s\S]*?<\/a:solidFill>/) || [""])[0], theme);
      else {
        const lr = st.match(/<a:lnRef idx="(\d+)">([\s\S]*?)<\/a:lnRef>/);
        if (lr && parseInt(lr[1], 10) > 0) el.stroke = colorOf(lr[2], theme);
        else if (kind === "cxnSp") el.stroke = theme.tx1;
      }
      el.dash = dashOf(lnB, lnW);
      el.headArrow = /<a:headEnd\b[^>]*type="(?!none)/.test(lnB);
      el.tailArrow = /<a:tailEnd\b[^>]*type="(?!none)/.test(lnB);
    } else {
      const lr = st.match(/<a:lnRef idx="(\d+)">([\s\S]*?)<\/a:lnRef>/);
      if (lr && parseInt(lr[1], 10) > 0) { el.stroke = colorOf(lr[2], theme); lnW = 9525 * EMU_PX; }
      else if (kind === "cxnSp") { el.stroke = theme.tx1; lnW = 9525 * EMU_PX; }
    }
    el.strokeW = el.stroke ? Math.max(0.75, lnW) : 0;
    if (kind === "cxnSp" || /^(line|straightConnector\d*|bentConnector\d*|curvedConnector\d*)$/.test(el.prst)) {
      el.kind = "conn";
      if (!el.stroke) { el.stroke = theme.tx1; el.strokeW = Math.max(0.75, lnW); }
      const cx = (b.match(/<p:cNvCxnSpPr>[\s\S]*?<\/p:cNvCxnSpPr>/) || [""])[0];
      el.stId = (cx.match(/<a:stCxn id="(\d+)"/) || ["", ""])[1];
      el.endId = (cx.match(/<a:endCxn id="(\d+)"/) || ["", ""])[1];
    }
    // text (a connector may carry a label too)
    const fontRef = (st.match(/<a:fontRef\b[^>]*>([\s\S]*?)<\/a:fontRef>/) || ["", ""])[1];
    const tx = textOf(b, theme, fontRef ? colorOf(fontRef, theme) : (el.fill && el.kind === "shape" ? "" : theme.tx1));
    el.paras = tx.paras; el.fontPx = tx.fontPx; el.bold = tx.bold; el.anchor = tx.anchor;
    el.insets = tx.insets; el.text = tx.flat;
    el.textColor = tx.color || (el.fill ? contrastOn(el.fill) : theme.tx1);
    // freeform
    if (el.kind === "shape" && spPr.indexOf("<a:custGeom>") >= 0) {
      const p = freeformPath(spPr, el);
      if (p) { el.kind = "path"; el.pathD = p.d; el.closed = p.closed; }
    }
    if (el.kind === "pic") { elems.push(el); continue; }
    const visible = el.kind === "conn" || el.kind === "path" || el.fill !== "" || el.stroke !== "";
    if (!visible) {
      if (!el.text) continue; // an invisible, empty shape draws nothing
      el.kind = "label";
    }
    if (visible) drawn++;
    elems.push(el);
  }
  return { elems: elems, drawn: drawn };
}

/** Black or white, whichever reads on the fill. */
function contrastOn(hex: string): string {
  const c = hexToRgb(hex);
  const lum = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
  return lum > 0.6 ? "000000" : "FFFFFF";
}

function freeformPath(spPr: string, el: Elem): { d: string; closed: boolean } | null {
  const cg = spPr.match(/<a:custGeom>[\s\S]*?<\/a:custGeom>/);
  if (!cg) return null;
  const out: string[] = [];
  let closed = false;
  const pre = /<a:path\b([^>]*)>([\s\S]*?)<\/a:path>/g;
  let pm: RegExpExecArray | null;
  while ((pm = pre.exec(cg[0])) !== null) {
    const pw = parseInt((pm[1].match(/\bw="(\d+)"/) || ["", "0"])[1], 10);
    const ph = parseInt((pm[1].match(/\bh="(\d+)"/) || ["", "0"])[1], 10);
    const sx = el.w / (pw || 1), sy = el.h / (ph || 1);
    const tok = /<a:(moveTo|lnTo|cubicBezTo|quadBezTo|close)\b|<a:pt x="(-?\d+)" y="(-?\d+)"/g;
    let cmd = "";
    let pts: number[][] = [];
    const P = (i: number): string => fnum(el.x + pts[i][0] * sx) + " " + fnum(el.y + pts[i][1] * sy);
    const flush = (): void => {
      if (cmd === "moveTo" && pts.length >= 1) out.push("M " + P(0));
      else if (cmd === "lnTo" && pts.length >= 1) out.push("L " + P(0));
      else if (cmd === "cubicBezTo" && pts.length >= 3) out.push("C " + P(0) + " " + P(1) + " " + P(2));
      else if (cmd === "quadBezTo" && pts.length >= 2) out.push("Q " + P(0) + " " + P(1));
      cmd = ""; pts = [];
    };
    let t2: RegExpExecArray | null;
    while ((t2 = tok.exec(pm[2])) !== null) {
      if (t2[1]) {
        flush();
        if (t2[1] === "close") { closed = true; out.push("Z"); } else cmd = t2[1];
      } else if (cmd) {
        pts.push([parseInt(t2[2], 10), parseInt(t2[3], 10)]);
      }
    }
    flush();
  }
  if (out.length < 2) return null;
  return { d: out.join(" "), closed: closed };
}

// ---------------------------------------------------------------- render
function fnum(v: number): string {
  const r = Math.round(v * 10) / 10;
  return String(r);
}
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Points of a preset geometry in the shape's own box (0..w, 0..h), or
 *  null for the primitives that render as rect / ellipse. */
function presetPoints(prst: string, w: number, h: number, adj: number): number[][] | null {
  const a = adj >= 0 ? adj : 0.5;
  const ss = Math.min(w, h);
  switch (prst) {
    case "diamond": case "flowChartDecision":
      return [[w / 2, 0], [w, h / 2], [w / 2, h], [0, h / 2]];
    case "triangle": case "flowChartExtract":
      return [[w * (adj >= 0 ? adj : 0.5), 0], [w, h], [0, h]];
    case "flowChartMerge":
      return [[0, 0], [w, 0], [w / 2, h]];
    case "rtTriangle":
      return [[0, 0], [w, h], [0, h]];
    case "rightArrow": case "notchedRightArrow": {
      const hl = Math.min(w, ss * (adj >= 0 ? 0.5 : 0.5)), sh = h * (adj >= 0 ? a / 2 : 0.25);
      return [[0, sh], [w - hl, sh], [w - hl, 0], [w, h / 2], [w - hl, h], [w - hl, h - sh], [0, h - sh]];
    }
    case "leftArrow": {
      const hl = Math.min(w, ss * 0.5), sh = h * (adj >= 0 ? a / 2 : 0.25);
      return [[w, sh], [hl, sh], [hl, 0], [0, h / 2], [hl, h], [hl, h - sh], [w, h - sh]];
    }
    case "leftRightArrow": {
      const hl = Math.min(w / 2, ss * 0.5), sh = h * (adj >= 0 ? a / 2 : 0.25);
      return [[0, h / 2], [hl, 0], [hl, sh], [w - hl, sh], [w - hl, 0], [w, h / 2], [w - hl, h], [w - hl, h - sh], [hl, h - sh], [hl, h]];
    }
    case "downArrow": {
      const hl = Math.min(h, ss * 0.5), sw = w * (adj >= 0 ? a / 2 : 0.25);
      return [[sw, 0], [w - sw, 0], [w - sw, h - hl], [w, h - hl], [w / 2, h], [0, h - hl], [sw, h - hl]];
    }
    case "upArrow": {
      const hl = Math.min(h, ss * 0.5), sw = w * (adj >= 0 ? a / 2 : 0.25);
      return [[sw, h], [w - sw, h], [w - sw, hl], [w, hl], [w / 2, 0], [0, hl], [sw, hl]];
    }
    case "upDownArrow": {
      const hl = Math.min(h / 2, ss * 0.5), sw = w * (adj >= 0 ? a / 2 : 0.25);
      return [[w / 2, 0], [w, hl], [w - sw, hl], [w - sw, h - hl], [w, h - hl], [w / 2, h], [0, h - hl], [sw, h - hl], [sw, hl], [0, hl]];
    }
    case "hexagon": case "flowChartPreparation":
      return [[w * 0.25, 0], [w * 0.75, 0], [w, h / 2], [w * 0.75, h], [w * 0.25, h], [0, h / 2]];
    case "pentagon": {
      return [[w / 2, 0], [w, h * 0.38], [w * 0.81, h], [w * 0.19, h], [0, h * 0.38]];
    }
    case "homePlate": {
      const n = Math.min(w, ss * 0.5);
      return [[0, 0], [w - n, 0], [w, h / 2], [w - n, h], [0, h]];
    }
    case "chevron": {
      const n = Math.min(w / 2, ss * 0.5);
      return [[0, 0], [w - n, 0], [w, h / 2], [w - n, h], [0, h], [n, h / 2]];
    }
    case "parallelogram": case "flowChartInputOutput": case "flowChartData": {
      const n = Math.min(w / 2, ss * 0.25);
      return [[n, 0], [w, 0], [w - n, h], [0, h]];
    }
    case "trapezoid": case "flowChartManualOperation": {
      const n = Math.min(w / 2, ss * 0.25);
      return [[n, 0], [w - n, 0], [w, h], [0, h]];
    }
    case "flowChartManualInput":
      return [[0, h * 0.2], [w, 0], [w, h], [0, h]];
    case "flowChartOffpageConnector":
      return [[0, 0], [w, 0], [w, h * 0.8], [w / 2, h], [0, h * 0.8]];
    case "octagon": {
      const n = Math.min(w, h) * 0.29;
      return [[n, 0], [w - n, 0], [w, n], [w, h - n], [w - n, h], [n, h], [0, h - n], [0, n]];
    }
    case "plus": case "mathPlus": {
      const n = Math.min(w, h) * 0.25;
      return [[n, 0], [w - n, 0], [w - n, n], [w, n], [w, h - n], [w - n, h - n], [w - n, h], [n, h], [n, h - n], [0, h - n], [0, n], [n, n]];
    }
    case "star4": case "star5": case "star6": case "star8": {
      const n = prst === "star4" ? 4 : prst === "star5" ? 5 : prst === "star6" ? 6 : 8;
      const pts: number[][] = [];
      for (let i = 0; i < n * 2; i++) {
        const r = i % 2 === 0 ? 0.5 : 0.22;
        const ang = -Math.PI / 2 + (i * Math.PI) / n;
        pts.push([w / 2 + Math.cos(ang) * w * r, h / 2 + Math.sin(ang) * h * r]);
      }
      return pts;
    }
    default:
      return null;
  }
}

function elemBox(el: Elem): number[] {
  if (el.kind === "path") {
    const nums = el.pathD.match(/-?\d+(\.\d+)?/g) || [];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = parseFloat(nums[i]), y = parseFloat(nums[i + 1]);
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
    return x0 > x1 ? [el.x, el.y, el.x + el.w, el.y + el.h] : [x0, y0, x1, y1];
  }
  if (el.rot === 0) return [el.x, el.y, el.x + el.w, el.y + el.h];
  const cx = el.x + el.w / 2, cy = el.y + el.h / 2, rad = el.rot * Math.PI / 180;
  const c = Math.abs(Math.cos(rad)), s = Math.abs(Math.sin(rad));
  const hw = (el.w * c + el.h * s) / 2, hh = (el.w * s + el.h * c) / 2;
  return [cx - hw, cy - hh, cx + hw, cy + hh];
}

/** Word-wrap one paragraph line into the available width (average glyph
 *  width 0.52 em — Calibri's, near enough for layout). */
function wrapText(s: string, maxW: number, fontPx: number): string[] {
  const cw = fontPx * 0.52;
  const maxChars = Math.max(1, Math.floor(maxW / cw));
  if (s.length <= maxChars) return [s];
  const words = s.split(" ");
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) { cur = w; continue; }
    if ((cur + " " + w).length <= maxChars) cur += " " + w;
    else { out.push(cur); cur = w; }
  }
  if (cur) out.push(cur);
  // a single word longer than the box hard-breaks
  const fin: string[] = [];
  for (const l of out) {
    if (l.length <= maxChars) { fin.push(l); continue; }
    for (let i = 0; i < l.length; i += maxChars) fin.push(l.slice(i, i + maxChars));
  }
  return fin;
}

function emitText(el: Elem, w: number, h: number): string {
  if (!el.paras.length) return "";
  const fs = el.fontPx;
  const lh = fs * 1.2;
  const availW = Math.max(fs, w - el.insets[0] - el.insets[2]);
  const lines: { t: string; algn: string }[] = [];
  for (const p of el.paras) {
    const algn = p.algn || (el.kind === "shape" || el.kind === "path" ? "ctr" : "l");
    if (p.lines.join("") === "") { lines.push({ t: "", algn: algn }); continue; }
    for (const ln of p.lines) {
      const wrapped = wrapText(ln, availW, fs);
      for (const wl of wrapped) lines.push({ t: wl, algn: algn });
    }
  }
  while (lines.length && lines[lines.length - 1].t === "") lines.pop();
  if (!lines.length) return "";
  const block = lines.length * lh;
  const top = el.insets[1], bottom = h - el.insets[3];
  let y0: number;
  if (el.anchor === "ctr") y0 = (top + bottom) / 2 - block / 2;
  else if (el.anchor === "b") y0 = bottom - block;
  else y0 = top;
  const out: string[] = [];
  const style = "font-family=\"" + FONT + "\" font-size=\"" + fnum(fs) + "\"" +
    (el.bold ? " font-weight=\"bold\"" : "") + " fill=\"#" + el.textColor + "\"";
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (!ln.t) continue;
    const x = ln.algn === "ctr" ? w / 2 : ln.algn === "r" ? w - el.insets[2] : el.insets[0];
    const ta = ln.algn === "ctr" ? "middle" : ln.algn === "r" ? "end" : "start";
    out.push("<text x=\"" + fnum(el.x + x) + "\" y=\"" + fnum(el.y + y0 + i * lh + fs * 0.85) +
      "\" text-anchor=\"" + ta + "\" " + style + ">" + esc(ln.t) + "</text>");
  }
  return out.join("");
}

function emitShape(el: Elem): string {
  const parts: string[] = [];
  const fill = el.fill ? "#" + el.fill : "none";
  const stroke = el.stroke ? " stroke=\"#" + el.stroke + "\" stroke-width=\"" + fnum(el.strokeW) + "\"" +
    (el.dash ? " stroke-dasharray=\"" + el.dash + "\"" : "") : "";
  const common = " fill=\"" + fill + "\"" + stroke;
  const x = el.x, y = el.y, w = el.w, h = el.h;
  if (el.kind === "path") {
    parts.push("<path d=\"" + el.pathD + "\"" + " fill=\"" + (el.closed && el.fill ? "#" + el.fill : "none") + "\"" + stroke + "/>");
  } else if (el.kind === "pic") {
    parts.push("<rect x=\"" + fnum(x) + "\" y=\"" + fnum(y) + "\" width=\"" + fnum(w) + "\" height=\"" + fnum(h) +
      "\" fill=\"#F3F3F3\" stroke=\"#9A9A9A\" stroke-dasharray=\"4 3\"/>");
    if (el.picName) {
      parts.push("<image href=\"" + esc(el.picName) + "\" x=\"" + fnum(x) + "\" y=\"" + fnum(y) + "\" width=\"" + fnum(w) +
        "\" height=\"" + fnum(h) + "\" preserveAspectRatio=\"none\"/>");
    }
    parts.push("<text x=\"" + fnum(x + w / 2) + "\" y=\"" + fnum(y + h / 2 + 4) + "\" text-anchor=\"middle\" font-family=\"" + FONT +
      "\" font-size=\"11\" fill=\"#9A9A9A\">picture</text>");
  } else if (el.kind === "label") {
    // nothing drawn; the text follows
  } else {
    const pts = presetPoints(el.prst, w, h, el.adj);
    const prstAttr = " data-prst=\"" + esc(el.prst) + "\"";
    if (pts) {
      const d = pts.map((p, i) => (i === 0 ? "M " : "L ") + fnum(x + p[0]) + " " + fnum(y + p[1])).join(" ") + " Z";
      parts.push("<path d=\"" + d + "\"" + common + prstAttr + "/>");
    } else if (/ellipse|flowChartConnector|flowChartOr|flowChartSummingJunction|donut|chord|pie|arc$/.test(el.prst)) {
      parts.push("<ellipse cx=\"" + fnum(x + w / 2) + "\" cy=\"" + fnum(y + h / 2) + "\" rx=\"" + fnum(w / 2) + "\" ry=\"" + fnum(h / 2) + "\"" + common + prstAttr + "/>");
    } else {
      let rx = 0;
      if (/^roundRect$|^round2SameRect$|^round1Rect$|^round2DiagRect$|^snipRoundRect$|flowChartAlternateProcess|wedgeRoundRectCallout/.test(el.prst)) {
        rx = Math.min(w, h) * (el.adj >= 0 ? el.adj : 0.16667);
      } else if (/flowChartTerminator/.test(el.prst)) rx = h / 2;
      parts.push("<rect x=\"" + fnum(x) + "\" y=\"" + fnum(y) + "\" width=\"" + fnum(w) + "\" height=\"" + fnum(h) + "\"" +
        (rx ? " rx=\"" + fnum(rx) + "\"" : "") + common + prstAttr + "/>");
    }
  }
  parts.push(emitText(el, w, h));
  const body = parts.join("");
  if (el.rot !== 0 && el.kind !== "path") {
    return "<g transform=\"rotate(" + fnum(el.rot) + " " + fnum(x + w / 2) + " " + fnum(y + h / 2) + ")\">" + body + "</g>";
  }
  return body;
}

function emitConnector(el: Elem, markers: { [k: string]: boolean }): string {
  let x1 = el.flipH ? el.x + el.w : el.x;
  let y1 = el.flipV ? el.y + el.h : el.y;
  let x2 = el.flipH ? el.x : el.x + el.w;
  let y2 = el.flipV ? el.y : el.y + el.h;
  if (el.rot !== 0) {
    const cx = el.x + el.w / 2, cy = el.y + el.h / 2, rad = el.rot * Math.PI / 180;
    const c = Math.cos(rad), s = Math.sin(rad);
    const r = (px: number, py: number): number[] => [cx + (px - cx) * c - (py - cy) * s, cy + (px - cx) * s + (py - cy) * c];
    const p1 = r(x1, y1), p2 = r(x2, y2);
    x1 = p1[0]; y1 = p1[1]; x2 = p2[0]; y2 = p2[1];
  }
  const stroke = "#" + (el.stroke || "000000");
  let attrs = " fill=\"none\" stroke=\"" + stroke + "\" stroke-width=\"" + fnum(el.strokeW || 1) + "\"" +
    (el.dash ? " stroke-dasharray=\"" + el.dash + "\"" : "");
  if (el.headArrow) { attrs += " marker-start=\"url(#ah-" + el.stroke + ")\""; markers[el.stroke] = true; }
  if (el.tailArrow) { attrs += " marker-end=\"url(#ah-" + el.stroke + ")\""; markers[el.stroke] = true; }
  let d: string;
  if (/^bentConnector/.test(el.prst)) {
    // PowerPoint's elbow: out along the longer axis to the midpoint, across, then on
    if (Math.abs(x2 - x1) >= Math.abs(y2 - y1)) {
      const mx = (x1 + x2) / 2;
      d = "M " + fnum(x1) + " " + fnum(y1) + " L " + fnum(mx) + " " + fnum(y1) + " L " + fnum(mx) + " " + fnum(y2) + " L " + fnum(x2) + " " + fnum(y2);
    } else {
      const my = (y1 + y2) / 2;
      d = "M " + fnum(x1) + " " + fnum(y1) + " L " + fnum(x1) + " " + fnum(my) + " L " + fnum(x2) + " " + fnum(my) + " L " + fnum(x2) + " " + fnum(y2);
    }
  } else if (/^curvedConnector/.test(el.prst)) {
    d = "M " + fnum(x1) + " " + fnum(y1) + " Q " + fnum(x2) + " " + fnum(y1) + " " + fnum(x2) + " " + fnum(y2);
  } else {
    d = "M " + fnum(x1) + " " + fnum(y1) + " L " + fnum(x2) + " " + fnum(y2);
  }
  let out = "<path d=\"" + d + "\"" + attrs + "/>";
  if (el.text) {
    out += "<text x=\"" + fnum((x1 + x2) / 2) + "\" y=\"" + fnum((y1 + y2) / 2 - 4) + "\" text-anchor=\"middle\" font-family=\"" + FONT +
      "\" font-size=\"" + fnum(el.fontPx) + "\" fill=\"#" + (el.textColor || "000000") + "\">" + esc(el.text) + "</text>";
  }
  return out;
}

function shortLabel(s: string): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > LABEL_MAX ? t.slice(0, LABEL_MAX - 1) + "…" : t;
}

function renderDrawing(p: Parsed, no: number): Drawing {
  const elems = p.elems;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const el of elems) {
    const b = elemBox(el);
    x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]);
  }
  x0 -= PAD; y0 -= PAD; x1 += PAD; y1 += PAD;
  const W = Math.max(1, x1 - x0), H = Math.max(1, y1 - y0);
  const markers: { [k: string]: boolean } = {};
  const body: string[] = [];
  let shapes = 0, connectors = 0;
  const byId: { [id: string]: Elem } = {};
  for (const el of elems) if (el.id) byId[el.id] = el;
  for (const el of elems) {
    if (el.kind === "conn") { connectors++; body.push(emitConnector(el, markers)); }
    else { if (el.kind !== "pic") shapes++; body.push(emitShape(el)); }
  }
  const defs: string[] = [];
  for (const col in markers) {
    defs.push("<marker id=\"ah-" + col + "\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\">" +
      "<path d=\"M 0 0 L 10 5 L 0 10 Z\" fill=\"#" + col + "\"/></marker>");
  }
  // connections: the connectors PowerPoint glued to shapes
  const conns: string[] = [];
  for (const el of elems) {
    if (el.kind !== "conn" || !el.stId || !el.endId) continue;
    const a = byId[el.stId], b = byId[el.endId];
    if (!a || !b) continue;
    const la = shortLabel(a.text) || "(" + (a.prst || "shape") + " " + a.id + ")";
    const lb = shortLabel(b.text) || "(" + (b.prst || "shape") + " " + b.id + ")";
    const arrow = el.tailArrow && el.headArrow ? " ↔ " : el.headArrow && !el.tailArrow ? " ← " : el.tailArrow ? " → " : " — ";
    conns.push(la + (el.text ? " —" + shortLabel(el.text) + (arrow === " → " ? "→ " : arrow) : arrow) + lb);
  }
  // labels: every shape's text in reading order
  const labelled = elems.filter((e) => e.text && e.kind !== "conn").slice();
  labelled.sort((a, b) => (a.y + a.h / 2) - (b.y + b.h / 2) || a.x - b.x);
  const labels: string[] = [];
  const seenL: { [k: string]: boolean } = {};
  for (const e of labelled) {
    const t = shortLabel(e.text);
    if (!seenL[t]) { seenL[t] = true; labels.push(t); }
  }
  const alt = "Slide " + no + " drawing — " + shapes + " shape" + (shapes === 1 ? "" : "s") +
    (connectors ? ", " + connectors + " connector" + (connectors === 1 ? "" : "s") : "");
  const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"" +
    fnum(x0) + " " + fnum(y0) + " " + fnum(W) + " " + fnum(H) + "\" width=\"" + fnum(W) + "\" height=\"" + fnum(H) +
    "\" data-slide=\"" + no + "\" data-shapes=\"" + shapes + "\" data-connectors=\"" + connectors + "\">" +
    "<title>" + esc(alt) + "</title>" + (defs.length ? "<defs>" + defs.join("") + "</defs>" : "") +
    "<rect x=\"" + fnum(x0) + "\" y=\"" + fnum(y0) + "\" width=\"" + fnum(W) + "\" height=\"" + fnum(H) + "\" fill=\"#FFFFFF\"/>" +
    body.join("") + "</svg>";
  return {
    slide: no, name: "slide" + no + "-drawing.svg", svg: svg, alt: alt,
    shapes: shapes, connectors: connectors,
    connections: conns.join(" · "), labels: labels.join(" · "),
  };
}

// ------------------------------------------------------------ xml text
function codePointStr(cp: number): string {
  if (!isFinite(cp) || cp < 0 || cp > 0x10ffff) return "";
  return cp <= 0xffff ? String.fromCharCode(cp) : String.fromCodePoint(cp);
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, h: string) => codePointStr(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_m, d: string) => codePointStr(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// ------------------------------------------------------------ slide order
// ================= KEEP IN SYNC with ZipTextExtract.ts ==============
// slideNum / orderSlides are ZipTextExtract's (SC-2): the same
// presentation-order numbering, so a drawing lands under the heading
// ZipTextExtract wrote for its slide.
// =====================================================================
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

// v1.9 (SC-4): replicate MediaExtract's selection exactly (same regex,
// same caps, same central-directory order, sizes from uncompSize) so
// the links minted here name only files that will actually exist.
// ================= KEEP IN SYNC with MediaExtract.ts =================
// The three caps below MUST equal MediaExtract's MAX_IMAGES / MAX_ONE
// / MAX_TOTAL, and this selection walk MUST mirror its save loop —
// SC-4 (no dead image links) holds only while both stay identical.
// Budgeting uses the central directory's uncompSize on both sides;
// MediaExtract v1.3 (SB-8) throws on a lying central directory, so
// the claim-based prediction here is exact for every archive that
// extracts successfully.

// ------------------------------------------------------------ base64
// ============ KEEP IN SYNC with ZipTextExtract.ts (SB-8) ============
// Everything from here down — b64ToBytes, the zip central-directory
// reader, extractEntry, the RFC 1951 inflate and the utf-8 decode — is
// duplicated byte-for-byte from ZipTextExtract.ts (Office Scripts cannot
// share modules). Every fix landed there MUST be landed here in the same
// batch; the harness equivalence gates are the only enforcement.
// =====================================================================
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
