#!/usr/bin/env node
/**
 * svg2pptx v1.2 — SlideFigures SVG figures → editable PowerPoint shapes
 * --------------------------------------------------------------------
 * Standalone (Node ≥ 18, zero dependencies — the sweep machine already
 * has Node). Takes the figure SVGs the local sweep writes into the
 * media folder and builds ONE .pptx in which every figure is a native,
 * fully editable group of PowerPoint shapes — lines, arrowheads, ticks,
 * extents, split markers, nodes with their labels INSIDE the shape,
 * freeform paths, text boxes — so a figure can be pulled into a test
 * plan review deck and reworked there, not pasted as a dead picture.
 *
 *   node local/svg2pptx.mjs <file.svg | dir> [more...] [-o out.pptx]
 *                           [--doc-title "..."]
 *
 * A directory argument takes every *.svg in it (natural sort, no
 * recursion). Default output: figures.pptx. Each SVG becomes one slide;
 * the figure sits centred as a single group (move/resize as one thing,
 * double-click in to edit a shape), scaled down only when it would not
 * fit the 16:9 slide, and the SVG's <title>/<desc> ride along as the
 * group's name and alt text.
 *
 * v1.2: figures land on a CLEAN slide — the SVG's plate (the white
 * card + border that frames a figure inside a markdown sidecar) is
 * dropped, since the slide itself is the background now — and every
 * slide carries a title band: the figure's own <title> ("Slide 5 —
 * route diagram (1 of 2)") as the slide title, with the SOURCE
 * DOCUMENT's title above it. The document title comes from the corpus'
 * own naming: a media figure `doc{N}_slideK.svg` belongs to the
 * sidecar `{title-slug}__doc{N}.md` in a sibling kind folder, so the
 * converter looks that sidecar up (next to the SVG, one level up, and
 * in the parent's kind subfolders) and takes its H1 — falling back to
 * the sidecar's title slug, then to `doc {N}`; `--doc-title "..."`
 * overrides the lookup for every input (use it when converting SVGs
 * that never went through the sweep's naming).
 *
 * The converter understands the CLOSED vocabulary SlideFigures emits —
 * line/rect/ellipse/circle/polygon/path/text plus the two arrow markers
 * and one translate group — and resolves colours/widths/dashes/fonts
 * from the figure's own embedded <style> block, so a Diagram Style
 * Framework palette change flows through with no edit here. Mapping:
 *
 *   <line>, marker-end        → line shape, triangle tailEnd (heads ride
 *                               the same overshoot stubs as the SVG)
 *   <rect>/<ellipse>/<polygon class="node"> → roundRect/ellipse/diamond,
 *                               palette tint + stroke; the nlabel texts
 *                               that sit inside become the shape's OWN
 *                               text body (edit the label in place)
 *   <circle class="splitdot"> → small ellipse, white fill, ink stroke
 *   <path>                    → freeform (custGeom); Q curves re-emitted
 *                               as cubics; freefill keeps its tint
 *   <text>                    → snug borderless text box, anchor-centred
 *                               so PowerPoint centres where SVG did
 *   dash patterns             → prstDash (dash / sysDash / sysDot)
 *   opacity                   → stroke alpha (the split hairline)
 *   rotate(a cx cy)           → native shape rotation
 *
 * Anything outside that vocabulary is reported per file and skipped,
 * never guessed at. Gate: local/harness/check_svg2pptx.py.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { deflateRawSync } from "node:zlib";
import { basename, dirname, join, resolve } from "node:path";

const EMU_PX = 9525;                 // 96 dpi
const SLIDE_W = 12192000;            // 13.33 in (16:9)
const SLIDE_H = 6858000;             // 7.5 in
const MARGIN = 457200;               // 0.5 in of slide edge kept clear
const PT_PX = 75;                    // css px → DrawingML font sz (1/100 pt)
const CHAR_W = 0.62;                 // text-box width estimate, em per char

// ------------------------------------------------------------ CLI
function collectInputs(argv) {
  const files = [];
  let out = "figures.pptx";
  let docTitle = "";
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-o" || a === "--out") { out = argv[++i]; continue; }
    if (a === "--doc-title") { docTitle = argv[++i] || ""; continue; }
    if (a === "-h" || a === "--help") {
      console.log("usage: node local/svg2pptx.mjs <file.svg|dir> [more...] [-o out.pptx] [--doc-title \"...\"]");
      process.exit(0);
    }
    let st;
    try { st = statSync(a); } catch { console.error(`skip (not found): ${a}`); continue; }
    if (st.isDirectory()) {
      const inDir = readdirSync(a).filter((f) => /\.svg$/i.test(f)).sort(natCmp);
      for (const f of inDir) files.push(join(a, f));
    } else {
      files.push(a);
    }
  }
  return { files, out, docTitle };
}

// ------------------------------------------------- document title lookup
// A media figure doc{N}_slideK.svg belongs to the sidecar
// {title-slug}__doc{N}.md — media/ and the kind subfolders are siblings
// under the library root, so the sidecar sits next to the SVG, one level
// up, or in one of the parent's kind subfolders. Its H1 is the document
// title the sweep minted (fallbacks: a `title:` metadata line, the
// sidecar's own slug humanised, then plain `doc {N}`).
function docTitleFor(file, cache) {
  const m = basename(file).match(/^doc(\d+)_/);
  if (!m) return "";
  const id = m[1];
  if (cache[id] !== undefined) return cache[id];
  const dir = dirname(resolve(file));
  const parent = dirname(dir);
  const hits = [];
  const scan = (d) => {
    try {
      for (const f of readdirSync(d)) if (f.endsWith(`__doc${id}.md`)) hits.push(join(d, f));
    } catch { /* unreadable dir: keep looking elsewhere */ }
  };
  scan(dir);
  scan(parent);
  try {
    for (const f of readdirSync(parent)) {
      const p = join(parent, f);
      if (p === dir) continue;
      try { if (statSync(p).isDirectory()) scan(p); } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
  let title = `doc ${id}`;
  if (hits.length) {
    const slug = basename(hits[0]).replace(new RegExp(`__doc${id}\\.md$`), "");
    title = slug.replace(/[-_]+/g, " ").trim() || title;
    try {
      const md = readFileSync(hits[0], "utf8");
      const h1 = md.match(/^# (.+)$/m);
      const yt = md.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (h1) title = h1[1].trim();
      else if (yt) title = yt[1].trim();
    } catch { /* unreadable sidecar: the slug already serves */ }
  }
  cache[id] = title;
  return title;
}

// slide10 sorts after slide9, not after slide1
function natCmp(a, b) {
  const ax = a.split(/(\d+)/), bx = b.split(/(\d+)/);
  for (let i = 0; i < Math.max(ax.length, bx.length); i++) {
    const av = ax[i] ?? "", bv = bx[i] ?? "";
    if (av === bv) continue;
    const an = parseInt(av, 10), bn = parseInt(bv, 10);
    if (!isNaN(an) && !isNaN(bn)) return an - bn;
    return av < bv ? -1 : 1;
  }
  return 0;
}

// ------------------------------------------------------ SVG parsing
// The stylesheet is flat `.cls{prop:val;...}` rules plus one `text{...}`
// element rule — parse it into a class → props map so palette values are
// read from the figure itself, never hardcoded here. v1.1: compound
// selectors (.event.s-cool) and comma groups, which the v1.8 two-tone
// stylesheet uses to give bars a brighter hue than thin marks, are kept
// as class SETS applied after the single-class rules — the same "more
// specific wins" order the browser gives them.
function parseStyle(svg) {
  const m = svg.match(/<style>([\s\S]*?)<\/style>/);
  const rules = { "@compound": [] };
  if (!m) return rules;
  const rre = /([^{}]+)\{([^}]*)\}/g;
  let r;
  while ((r = rre.exec(m[1])) !== null) {
    const props = {};
    for (const decl of r[2].split(";")) {
      const c = decl.indexOf(":");
      if (c < 0) continue;
      props[decl.slice(0, c).trim()] = decl.slice(c + 1).trim();
    }
    for (const one of r[1].split(",")) {
      const sel = one.trim();
      if (!sel) continue;
      const classes = sel.split(".").filter((c) => c);
      if (sel[0] === "." && classes.length > 1) {
        rules["@compound"].push({ classes, props });
        continue;
      }
      const key = classes[0] || sel;
      const dst = rules[key] || (rules[key] = {});
      for (const k in props) dst[k] = props[k];
    }
  }
  return rules;
}

function resolveStyle(rules, cls, isText) {
  const p = {};
  const apply = (src) => { if (src) for (const k in src) p[k] = src[k]; };
  const have = (cls || "").split(/\s+/).filter((c) => c);
  if (isText) apply(rules["text"]);
  for (const c of have) apply(rules[c]);
  for (const cr of rules["@compound"] || []) {
    if (cr.classes.every((c) => have.indexOf(c) >= 0)) apply(cr.props);
  }
  return p;
}

function attrsOf(s) {
  const o = {};
  s.replace(/([\w:-]+)="([^"]*)"/g, (mm, k, v) => { o[k] = v; return ""; });
  return o;
}

const num = (v) => parseFloat(v || "0");

// d attribute → absolute command list (SlideFigures emits only M L C Q Z)
function parsePathD(d, ox, oy) {
  const cmds = [];
  const tre = /([MLCQZz])|(-?\d+(?:\.\d+)?)/g;
  let t, cur = null;
  const nums = [];
  const flush = () => {
    if (!cur) return;
    const need = { M: 2, L: 2, C: 6, Q: 4, Z: 0 }[cur];
    for (let i = 0; i + need <= nums.length && need > 0; i += need) {
      const pts = [];
      for (let j = 0; j < need; j += 2) pts.push([nums[i + j] + ox, nums[i + j + 1] + oy]);
      cmds.push({ c: cur === "M" && i > 0 ? "L" : cur, pts });
    }
    if (need === 0) cmds.push({ c: "Z", pts: [] });
    nums.length = 0;
  };
  while ((t = tre.exec(d)) !== null) {
    if (t[1]) { flush(); cur = t[1].toUpperCase(); if (cur === "Z") { cmds.push({ c: "Z", pts: [] }); cur = null; } }
    else if (cur) nums.push(parseFloat(t[2]));
  }
  flush();
  return cmds;
}

function parseFigure(file) {
  const svg = readFileSync(file, "utf8");
  const vb = svg.match(/viewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/);
  if (!vb) throw new Error(`${file}: no viewBox`);
  const w = num(vb[3]), h = num(vb[4]);
  const title = (svg.match(/<title>([\s\S]*?)<\/title>/) || ["", ""])[1];
  const desc = (svg.match(/<desc>([\s\S]*?)<\/desc>/) || ["", ""])[1];
  const rules = parseStyle(svg);
  // body only: everything the markers/styles define is resolved, not drawn
  const body = svg.replace(/<style>[\s\S]*?<\/style>/, "")
                  .replace(/<defs>[\s\S]*?<\/defs>/, "")
                  .replace(/<title>[\s\S]*?<\/title>/, "")
                  .replace(/<desc>[\s\S]*?<\/desc>/, "");
  const items = [];
  const unknown = [];
  let ox = 0, oy = 0;
  const gstack = [];
  const tok = /<(line|rect|ellipse|circle|polygon|path)\b([^>]*?)\/>|<text\b([^>]*?)>([^<]*)<\/text>|<g\b([^>]*?)>|<\/g>|<(\w[-\w]*)\b/g;
  let m;
  while ((m = tok.exec(body)) !== null) {
    if (m[5] !== undefined) {                       // <g ...>
      const tr = m[5].match(/translate\((-?[\d.]+),(-?[\d.]+)\)/);
      gstack.push([ox, oy]);
      if (tr) { ox += num(tr[1]); oy += num(tr[2]); }
      continue;
    }
    if (m[0] === "</g>") {
      const p = gstack.pop();
      if (p) { ox = p[0]; oy = p[1]; }
      continue;
    }
    if (m[6] !== undefined) {                       // some other element
      if (!/^(svg|g|line|rect|ellipse|circle|polygon|path|text)$/.test(m[6])) unknown.push(m[6]);
      continue;
    }
    if (m[3] !== undefined) {                       // <text>
      const a = attrsOf(m[3]);
      items.push({ k: "text", x: num(a.x) + ox, y: num(a.y) + oy, t: m[4],
                   anchor: a["text-anchor"] || "start", cls: a["class"] || "" });
      continue;
    }
    const kind = m[1];
    const a = attrsOf(m[2]);
    const cls = a["class"] || "";
    const rotM = (a.transform || "").match(/rotate\((-?[\d.]+)/);
    const rot = rotM ? num(rotM[1]) : 0;
    if (kind === "line") {
      items.push({ k: "line", x1: num(a.x1) + ox, y1: num(a.y1) + oy,
                   x2: num(a.x2) + ox, y2: num(a.y2) + oy, cls,
                   arrow: /marker-end/.test(m[2]) });
    } else if (kind === "rect") {
      // the plate is the card that frames a figure inside a markdown
      // sidecar; on a slide the slide IS the background, so it is dropped
      if (/(^| )plate( |$)/.test(cls)) continue;
      items.push({ k: "rect", x: num(a.x) + ox, y: num(a.y) + oy,
                   w: num(a.width), h: num(a.height), rx: num(a.rx), rot, cls });
    } else if (kind === "ellipse") {
      items.push({ k: "ellipse", cx: num(a.cx) + ox, cy: num(a.cy) + oy,
                   rx: num(a.rx), ry: num(a.ry), rot, cls });
    } else if (kind === "circle") {
      items.push({ k: "ellipse", cx: num(a.cx) + ox, cy: num(a.cy) + oy,
                   rx: num(a.r), ry: num(a.r), rot, cls });
    } else if (kind === "polygon") {
      const pts = [];
      (a.points || "").replace(/(-?[\d.]+),(-?[\d.]+)/g, (mm, x, y) => {
        pts.push([num(x) + ox, num(y) + oy]); return "";
      });
      if (pts.length >= 3) items.push({ k: "poly", pts, rot, cls });
    } else if (kind === "path") {
      const cmds = parsePathD(a.d || "", ox, oy);
      if (cmds.length >= 2) items.push({ k: "path", cmds, cls, arrow: /marker-end/.test(m[2]) });
    }
  }
  attachNodeLabels(items);
  return { name: basename(file), w, h, title, desc, rules, items, unknown: [...new Set(unknown)] };
}

// nlabel texts sitting inside a node become the node's own text body —
// in PowerPoint the label must live IN the shape to be editable in place
function attachNodeLabels(items) {
  const bounds = (it) => {
    if (it.k === "rect") return [it.x, it.y, it.x + it.w, it.y + it.h];
    if (it.k === "ellipse") return [it.cx - it.rx, it.cy - it.ry, it.cx + it.rx, it.cy + it.ry];
    if (it.k === "poly") {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const p of it.pts) {
        x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]);
        y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
      }
      return [x0, y0, x1, y1];
    }
    return null;
  };
  for (const it of items) {
    if (!/(^| )node( |$)/.test(it.cls || "")) continue;
    const b = bounds(it);
    if (!b) continue;
    const rows = [];
    for (const t of items) {
      if (t.k !== "text" || !/nlabel/.test(t.cls) || t.used) continue;
      if (t.x >= b[0] && t.x <= b[2] && t.y >= b[1] && t.y <= b[3]) { rows.push(t); t.used = true; }
    }
    rows.sort((p, q) => p.y - q.y);
    it.labelRows = rows.map((r) => r.t);
  }
}

// ------------------------------------------------------ DrawingML emit
const xesc = (s) => s.replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, "&amp;")
                     .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function hexOf(v, dflt) {
  const m = (v || "").match(/#([0-9A-Fa-f]{6})/);
  return m ? m[1].toUpperCase() : dflt;
}

function solidFill(hex, alphaPct) {
  if (alphaPct == null || alphaPct >= 1) {
    return `<a:solidFill><a:srgbClr val="${hex}"/></a:solidFill>`;
  }
  return `<a:solidFill><a:srgbClr val="${hex}">` +
    `<a:alpha val="${Math.round(alphaPct * 100000)}"/></a:srgbClr></a:solidFill>`;
}

// stroke-dasharray → the closest canonical prstDash; the corpus only
// draws three rhythms (dashed 7 4.5, split 3 2.5, dotted 1.6 3.6)
function prstDash(dasharray) {
  const first = num((dasharray.match(/-?[\d.]+/) || ["9"])[0]);
  if (first <= 2) return "sysDot";
  if (first <= 4) return "sysDash";
  return "dash";
}

function lnXml(st, E, arrow) {
  const wPx = num(st["stroke-width"] || "1");
  const hex = hexOf(st.stroke, "16302F");
  const cap = (st["stroke-linecap"] || "").indexOf("butt") >= 0 ? "flat" : "rnd";
  const alpha = st.opacity != null ? num(st.opacity) : null;
  const dash = st["stroke-dasharray"] ? `<a:prstDash val="${prstDash(st["stroke-dasharray"])}"/>` : "";
  const tail = arrow ? '<a:tailEnd type="triangle" w="med" len="med"/>' : "";
  return `<a:ln w="${Math.max(1, E(wPx))}" cap="${cap}">` +
    solidFill(hex, alpha) + dash + '<a:round/><a:headEnd type="none"/>' +
    (tail || '<a:tailEnd type="none"/>') + "</a:ln>";
}

function xfrmXml(x, y, w, h, opt) {
  const o = opt || {};
  const rot = o.rot ? ` rot="${Math.round(o.rot * 60000)}"` : "";
  const fh = o.flipH ? ' flipH="1"' : "";
  const fv = o.flipV ? ' flipV="1"' : "";
  return `<a:xfrm${rot}${fh}${fv}><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm>`;
}

function spXml(id, name, spPr, txBody, descr) {
  const d = descr ? ` descr="${xesc(descr)}"` : "";
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${xesc(name)}"${d}/>` +
    "<p:cNvSpPr/><p:nvPr/></p:nvSpPr>" +
    `<p:spPr>${spPr}</p:spPr>${txBody || ""}</p:sp>`;
}

function runXml(text, szPx, hex, bold, family) {
  return `<a:r><a:rPr lang="en-US" sz="${Math.max(100, Math.round(szPx * PT_PX))}"` +
    ` b="${bold ? 1 : 0}" dirty="0">${solidFill(hex)}` +
    `<a:latin typeface="${xesc(family)}"/></a:rPr><a:t>${text}</a:t></a:r>`;
}

function fontFamily(st) {
  const fam = (st["font-family"] || "").match(/'([^']+)'|^([^,]+)/);
  return (fam && (fam[1] || fam[2].trim())) || "Segoe UI";
}

// build one figure's shapes in group child space (px * EMU * scale)
function emitFigure(fig, s, idStart) {
  const E = (v) => Math.round(v * EMU_PX * s);
  const shapes = [];
  let id = idStart;
  const skipped = [];
  for (const it of fig.items) {
    const st = resolveStyle(fig.rules, it.cls, it.k === "text");
    if (it.k === "line") {
      const x0 = Math.min(it.x1, it.x2), y0 = Math.min(it.y1, it.y2);
      const spPr = xfrmXml(E(x0), E(y0), E(Math.abs(it.x2 - it.x1)), E(Math.abs(it.y2 - it.y1)),
                           { flipH: it.x2 < it.x1, flipV: it.y2 < it.y1 }) +
        '<a:prstGeom prst="line"><a:avLst/></a:prstGeom>' + lnXml(st, E, it.arrow);
      shapes.push(spXml(id++, lineName(it.cls), spPr));
    } else if (it.k === "rect" || it.k === "ellipse" || it.k === "poly") {
      shapes.push(emitNodeShape(it, st, E, id++, fig));
    } else if (it.k === "path") {
      const sh = emitPathShape(it, st, E, id, fig);
      if (sh) { shapes.push(sh); id++; } else skipped.push("path");
    } else if (it.k === "text") {
      if (it.used) continue;                       // lives inside its node now
      shapes.push(emitTextBox(it, st, E, id++));
    }
  }
  return { xml: shapes.join(""), nextId: id, skipped };
}

function lineName(cls) {
  const first = (cls || "line").split(/\s+/).filter((c) => c !== "ln" && c !== "flat")[0];
  return first || "line";
}

function emitNodeShape(it, st, E, id, fig) {
  let x, y, w, h, geom;
  const isNode = /(^| )node( |$)/.test(it.cls);
  if (it.k === "rect") {
    x = it.x; y = it.y; w = it.w; h = it.h;
    if (it.rx > 0) {
      const adj = Math.min(50000, Math.round(it.rx / (Math.min(w, h) / 2) * 50000));
      geom = `<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val ${adj}"/></a:avLst></a:prstGeom>`;
    } else {
      geom = '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>';
    }
  } else if (it.k === "ellipse") {
    x = it.cx - it.rx; y = it.cy - it.ry; w = it.rx * 2; h = it.ry * 2;
    geom = '<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>';
  } else {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of it.pts) {
      x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]);
      y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
    }
    x = x0; y = y0; w = x1 - x0; h = y1 - y0;
    // SlideFigures draws diamonds as 4-point polygons at the box midpoints;
    // anything else closes as a freeform polygon
    geom = it.pts.length === 4 && isNode
      ? '<a:prstGeom prst="diamond"><a:avLst/></a:prstGeom>'
      : polyGeom(it.pts, x, y, w, h);
  }
  const fillHex = st.fill && st.fill !== "none" ? hexOf(st.fill, "FFFFFF") : null;
  const fill = fillHex ? solidFill(fillHex) : "<a:noFill/>";
  const spPr = xfrmXml(E(x), E(y), Math.max(1, E(w)), Math.max(1, E(h)), { rot: it.rot }) +
    geom + fill + lnXml(st, E, false);
  let tx = "";
  if (it.labelRows && it.labelRows.length) {
    const lst = resolveStyle(fig.rules, "nlabel", true);
    const fam = fontFamily(lst);
    const szPx = num(lst["font-size"] || "12px");
    const hex = hexOf(lst.fill, "16302F");
    const paras = it.labelRows.map((r) =>
      `<a:p><a:pPr algn="ctr"/>${runXml(r, szPx, hex, num(lst["font-weight"] || "400") >= 600, fam)}</a:p>`).join("");
    // SlideFigures pre-wraps labels into rows (one paragraph each), so the
    // shape must not re-wrap them: a label wider than its node overflows
    // centred, exactly as the SVG draws it
    tx = '<p:txBody><a:bodyPr wrap="none" lIns="18288" tIns="9144" rIns="18288" bIns="9144" anchor="ctr"/><a:lstStyle/>' +
      paras + "</p:txBody>";
  }
  return spXml(id, isNode ? "node" : lineName(it.cls), spPr, tx);
}

function polyGeom(pts, x, y, w, h) {
  const U = 1000;
  const px = (p) => Math.round((p[0] - x) * U), py = (p) => Math.round((p[1] - y) * U);
  let d = `<a:moveTo><a:pt x="${px(pts[0])}" y="${py(pts[0])}"/></a:moveTo>`;
  for (let i = 1; i < pts.length; i++) d += `<a:lnTo><a:pt x="${px(pts[i])}" y="${py(pts[i])}"/></a:lnTo>`;
  d += "<a:close/>";
  return customGeom(Math.max(1, Math.round(w * U)), Math.max(1, Math.round(h * U)), d);
}

function customGeom(w, h, pathBody, fillMode) {
  const f = fillMode ? ` fill="${fillMode}"` : "";
  return "<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/>" +
    `<a:rect l="0" t="0" r="${w}" b="${h}"/>` +
    `<a:pathLst><a:path w="${w}" h="${h}"${f}>${pathBody}</a:path></a:pathLst></a:custGeom>`;
}

function emitPathShape(it, st, E, id, fig) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const c of it.cmds) for (const p of c.pts) {
    x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]);
    y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
  }
  if (x0 > x1) return null;
  const w = Math.max(x1 - x0, 0.1), h = Math.max(y1 - y0, 0.1);
  const U = 1000;
  const P = (p) => `<a:pt x="${Math.round((p[0] - x0) * U)}" y="${Math.round((p[1] - y0) * U)}"/>`;
  let body = "", closed = false, last = null;
  for (const c of it.cmds) {
    if (c.c === "M") { body += `<a:moveTo>${P(c.pts[0])}</a:moveTo>`; last = c.pts[0]; }
    else if (c.c === "L") { body += `<a:lnTo>${P(c.pts[0])}</a:lnTo>`; last = c.pts[0]; }
    else if (c.c === "C") { body += `<a:cubicBezTo>${P(c.pts[0])}${P(c.pts[1])}${P(c.pts[2])}</a:cubicBezTo>`; last = c.pts[2]; }
    else if (c.c === "Q" && last) {
      // DrawingML has no quadratic — lift to the equivalent cubic
      const q = c.pts[0], e = c.pts[1];
      const c1 = [last[0] + (2 / 3) * (q[0] - last[0]), last[1] + (2 / 3) * (q[1] - last[1])];
      const c2 = [e[0] + (2 / 3) * (q[0] - e[0]), e[1] + (2 / 3) * (q[1] - e[1])];
      body += `<a:cubicBezTo>${P(c1)}${P(c2)}${P(e)}</a:cubicBezTo>`; last = e;
    } else if (c.c === "Z") { body += "<a:close/>"; closed = true; }
  }
  if (!body) return null;
  const filled = /freefill/.test(it.cls) && st.fill && st.fill !== "none";
  const geom = customGeom(Math.max(1, Math.round(w * U)), Math.max(1, Math.round(h * U)),
                          body, filled ? undefined : "none");
  const fill = filled ? solidFill(hexOf(st.fill, "FFFFFF")) : "<a:noFill/>";
  const spPr = xfrmXml(E(x0), E(y0), Math.max(1, E(w)), Math.max(1, E(h))) + geom + fill + lnXml(st, E, it.arrow);
  return spXml(id, lineName(it.cls), spPr);
}

function emitTextBox(it, st, E, id) {
  const szPx = num(st["font-size"] || "12px");
  const hex = hexOf(st.fill, "16302F");
  const bold = num(st["font-weight"] || "400") >= 600;
  const fam = fontFamily(st);
  // dominant-baseline central + anchor make (x,y) the alignment point; the
  // box is a snug estimate centred there — anchor ctr keeps the text put
  // even when the estimate is off
  const wPx = Math.max(8, it.t.length * szPx * CHAR_W + 6);
  const hPx = szPx * 1.6;
  const x = it.anchor === "middle" ? it.x - wPx / 2 : (it.anchor === "end" ? it.x - wPx : it.x);
  const algn = it.anchor === "middle" ? "ctr" : (it.anchor === "end" ? "r" : "l");
  const spPr = xfrmXml(E(x), E(it.y - hPx / 2), Math.max(1, E(wPx)), Math.max(1, E(hPx))) +
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln>';
  const tx = `<p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/><a:lstStyle/>` +
    `<a:p><a:pPr algn="${algn}"/>${runXml(it.t, szPx, hex, bold, fam)}</a:p></p:txBody>`;
  return spXml(id, `text ${it.t.slice(0, 24)}`, spPr, tx);
}

// ------------------------------------------------------ slide + package
const HEADER_BOT = 1120140;   // 1.18 in — title band above the figure area
const TITLE_INK = "16302F";   // slide title: palette ink
const TITLE_MUTED = "6E8285"; // document title: palette muted

// a full-width, left-aligned band line (the doc-title eyebrow and the
// slide title); plain text boxes, not placeholders — the master is blank
function bandBox(id, name, y, h, text, szPx, hex, bold) {
  const spPr = xfrmXml(MARGIN, y, SLIDE_W - 2 * MARGIN, h) +
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln>';
  const tx = '<p:txBody><a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/><a:lstStyle/>' +
    `<a:p><a:pPr algn="l"/>${runXml(xesc(text), szPx, hex, bold, "Segoe UI")}</a:p></p:txBody>`;
  return spXml(id, name, spPr, tx);
}

function slideXml(fig) {
  const wEmu = fig.w * EMU_PX, hEmu = fig.h * EMU_PX;
  const areaY = HEADER_BOT, areaH = SLIDE_H - HEADER_BOT - MARGIN;
  const s = Math.min(1, (SLIDE_W - 2 * MARGIN) / wEmu, areaH / hEmu);
  const gw = Math.round(wEmu * s), gh = Math.round(hEmu * s);
  const gx = Math.round((SLIDE_W - gw) / 2), gy = Math.round(areaY + (areaH - gh) / 2);
  const { xml, skipped } = emitFigure(fig, s, 5);
  const header =
    (fig.docTitle ? bandBox(2, "document title", 289560, 219456, fig.docTitle, 14, TITLE_MUTED, false) : "") +
    bandBox(3, "slide title", 553720, 402336, fig.title || fig.name, 24, TITLE_INK, true);
  const alt = [fig.title, fig.desc].filter(Boolean).join(" — ");
  const grp = `<p:grpSp><p:nvGrpSpPr><p:cNvPr id="4" name="${xesc(fig.title || fig.name)}"` +
    (alt ? ` descr="${xesc(alt)}"` : "") + "/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>" +
    `<p:grpSpPr><a:xfrm><a:off x="${gx}" y="${gy}"/><a:ext cx="${gw}" cy="${gh}"/>` +
    `<a:chOff x="0" y="0"/><a:chExt cx="${gw}" cy="${gh}"/></a:xfrm></p:grpSpPr>${xml}</p:grpSp>`;
  const sld = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"' +
    ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"' +
    ' xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">' +
    '<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>' +
    "<p:grpSpPr/>" + header + grp + "</p:spTree></p:cSld>" +
    "<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>";
  return { sld, skipped };
}

const XML_HDR = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const NS_A = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"';
const NS_R = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const NS_P = 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';

function themeXml() {
  const fills = '<a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
    '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
    '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>';
  const lns = '<a:lnStyleLst>' +
    '<a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>'.repeat(3) +
    "</a:lnStyleLst>";
  const effs = '<a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle>' +
    "<a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>";
  const bgs = '<a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
    '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
    '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst>';
  return XML_HDR + `<a:theme ${NS_A} name="Figures">` +
    "<a:themeElements><a:clrScheme name=\"Figures\">" +
    '<a:dk1><a:srgbClr val="16302F"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>' +
    '<a:dk2><a:srgbClr val="4E6265"/></a:dk2><a:lt2><a:srgbClr val="EFF2F2"/></a:lt2>' +
    '<a:accent1><a:srgbClr val="1B6E8C"/></a:accent1><a:accent2><a:srgbClr val="C2701A"/></a:accent2>' +
    '<a:accent3><a:srgbClr val="2E7D5B"/></a:accent3><a:accent4><a:srgbClr val="7A5AA6"/></a:accent4>' +
    '<a:accent5><a:srgbClr val="B2442F"/></a:accent5><a:accent6><a:srgbClr val="6E8285"/></a:accent6>' +
    '<a:hlink><a:srgbClr val="1B6E8C"/></a:hlink><a:folHlink><a:srgbClr val="7A5AA6"/></a:folHlink></a:clrScheme>' +
    '<a:fontScheme name="Figures"><a:majorFont><a:latin typeface="Segoe UI"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>' +
    '<a:minorFont><a:latin typeface="Segoe UI"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>' +
    `<a:fmtScheme name="Figures">${fills}${lns}${effs}${bgs}</a:fmtScheme>` +
    "</a:themeElements></a:theme>";
}

function masterXml() {
  return XML_HDR + `<p:sldMaster ${NS_A} ${NS_R} ${NS_P}>` +
    '<p:cSld><p:bg><p:bgPr><a:solidFill><a:schemeClr val="bg1"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>' +
    '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>' +
    '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3"' +
    ' accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>' +
    '<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>' +
    "<p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>";
}

function layoutXml() {
  return XML_HDR + `<p:sldLayout ${NS_A} ${NS_R} ${NS_P} type="blank" preserve="1">` +
    '<p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>' +
    "<p:grpSpPr/></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>";
}

function relsXml(rels) {
  return XML_HDR + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    rels.map((r) => `<Relationship Id="${r.id}" Type="${r.type}" Target="${r.target}"/>`).join("") +
    "</Relationships>";
}

const RT = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

function buildPptx(figures) {
  const parts = [];
  const put = (name, xml) => parts.push({ name, data: Buffer.from(xml, "utf8") });
  const n = figures.length;
  const slides = figures.map(slideXml);

  const overrides = [
    ["/ppt/presentation.xml", "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"],
    ["/ppt/slideMasters/slideMaster1.xml", "application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"],
    ["/ppt/slideLayouts/slideLayout1.xml", "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"],
    ["/ppt/theme/theme1.xml", "application/vnd.openxmlformats-officedocument.theme+xml"],
    ["/docProps/core.xml", "application/vnd.openxmlformats-package.core-properties+xml"],
  ];
  for (let i = 1; i <= n; i++) {
    overrides.push([`/ppt/slides/slide${i}.xml`,
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml"]);
  }
  put("[Content_Types].xml", XML_HDR +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    overrides.map(([p, t]) => `<Override PartName="${p}" ContentType="${t}"/>`).join("") +
    "</Types>");

  put("_rels/.rels", relsXml([
    { id: "rId1", type: `${RT}/officeDocument`, target: "ppt/presentation.xml" },
    { id: "rId2", type: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties", target: "docProps/core.xml" },
  ]));

  const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  put("docProps/core.xml", XML_HDR +
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"' +
    ' xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Test plan figures</dc:title>' +
    `<dc:creator>svg2pptx</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>` +
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`);

  const sldIds = figures.map((f, i) =>
    `<p:sldId id="${256 + i}" r:id="rId${2 + i}"/>`).join("");
  put("ppt/presentation.xml", XML_HDR +
    `<p:presentation ${NS_A} ${NS_R} ${NS_P}>` +
    '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>' +
    `<p:sldIdLst>${sldIds}</p:sldIdLst>` +
    `<p:sldSz cx="${SLIDE_W}" cy="${SLIDE_H}"/><p:notesSz cx="${SLIDE_H}" cy="${SLIDE_W}"/></p:presentation>`);

  const presRels = [{ id: "rId1", type: `${RT}/slideMaster`, target: "slideMasters/slideMaster1.xml" }];
  for (let i = 0; i < n; i++) {
    presRels.push({ id: `rId${2 + i}`, type: `${RT}/slide`, target: `slides/slide${i + 1}.xml` });
  }
  put("ppt/_rels/presentation.xml.rels", relsXml(presRels));

  put("ppt/slideMasters/slideMaster1.xml", masterXml());
  put("ppt/slideMasters/_rels/slideMaster1.xml.rels", relsXml([
    { id: "rId1", type: `${RT}/slideLayout`, target: "../slideLayouts/slideLayout1.xml" },
    { id: "rId2", type: `${RT}/theme`, target: "../theme/theme1.xml" },
  ]));
  put("ppt/slideLayouts/slideLayout1.xml", layoutXml());
  put("ppt/slideLayouts/_rels/slideLayout1.xml.rels", relsXml([
    { id: "rId1", type: `${RT}/slideMaster`, target: "../slideMasters/slideMaster1.xml" },
  ]));
  put("ppt/theme/theme1.xml", themeXml());

  for (let i = 0; i < n; i++) {
    put(`ppt/slides/slide${i + 1}.xml`, slides[i].sld);
    put(`ppt/slides/_rels/slide${i + 1}.xml.rels`, relsXml([
      { id: "rId1", type: `${RT}/slideLayout`, target: "../slideLayouts/slideLayout1.xml" },
    ]));
  }
  return zip(parts);
}

// ------------------------------------------------------------- zip writer
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  const d = new Date();
  const dosTime = ((d.getHours() << 11) | (d.getMinutes() << 5)) & 0xffff;
  const dosDate = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;
  for (const f of files) {
    const nameBuf = Buffer.from(f.name, "utf8");
    const crc = crc32(f.data);
    const comp = deflateRawSync(f.data, { level: 9 });
    const hdr = Buffer.alloc(30);
    hdr.writeUInt32LE(0x04034b50, 0);
    hdr.writeUInt16LE(20, 4); hdr.writeUInt16LE(0, 6); hdr.writeUInt16LE(8, 8);
    hdr.writeUInt16LE(dosTime, 10); hdr.writeUInt16LE(dosDate, 12);
    hdr.writeUInt32LE(crc, 14);
    hdr.writeUInt32LE(comp.length, 18); hdr.writeUInt32LE(f.data.length, 22);
    hdr.writeUInt16LE(nameBuf.length, 26); hdr.writeUInt16LE(0, 28);
    chunks.push(hdr, nameBuf, comp);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(0, 8);
    cen.writeUInt16LE(8, 10);
    cen.writeUInt16LE(dosTime, 12); cen.writeUInt16LE(dosDate, 14);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(comp.length, 20); cen.writeUInt32LE(f.data.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([cen, nameBuf]));
    offset += hdr.length + nameBuf.length + comp.length;
  }
  const cd = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8); eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cd.length, 12); eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, cd, eocd]);
}

// ------------------------------------------------------------------ main
const { files, out, docTitle } = collectInputs(process.argv.slice(2));
if (files.length === 0) {
  console.error("usage: node local/svg2pptx.mjs <file.svg|dir> [more...] [-o out.pptx] [--doc-title \"...\"]");
  process.exit(2);
}
const figures = [];
const titleCache = {};
for (const f of files) {
  try {
    const fig = parseFigure(f);
    if (fig.unknown.length) console.error(`note: ${f}: skipped unknown element(s): ${fig.unknown.join(", ")}`);
    fig.docTitle = docTitle || docTitleFor(f, titleCache);
    figures.push(fig);
  } catch (e) {
    console.error(`skip: ${e.message}`);
  }
}
if (figures.length === 0) {
  console.error("no convertible figures");
  process.exit(1);
}
writeFileSync(out, buildPptx(figures));
console.log(`${out}: ${figures.length} figure(s), one per slide` +
  (files.length > figures.length ? ` (${files.length - figures.length} skipped)` : ""));
