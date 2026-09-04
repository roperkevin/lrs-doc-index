#!/usr/bin/env node
/**
 * draft2pptx v1.0 — TestPlanGen draft markdown → a designed review deck
 * ---------------------------------------------------------------------
 * Standalone (Node ≥ 18, zero dependencies — the svg2pptx precedent:
 * OOXML is a zip of XML parts, and Node's zlib does the rest). Takes a
 * test-plan draft from Shared Documents/Test Plan Drafts (or a dry
 * run's workDir copy) and builds a .pptx REVIEW DECK — the deck a PE
 * walks a test-plan review with, styled on the Diagram Style Framework
 * palette so it sits next to svg2pptx figure slides without a seam.
 *
 *   node local/draft2pptx.mjs <draft.md> [more.md ...] [-o out.pptx]
 *
 * Each input converts to a sibling .pptx (same name); `-o` names the
 * output for a SINGLE input. The deck is derived from the draft dialect
 * the prompt emits (and only that dialect — this is not a general
 * markdown converter):
 *
 *   title slide     <- H1 + the WARNING banner (generated when / story
 *                      doc) + the Overview table facts, on palette ink
 *   at a glance     <- counted from the draft: positive / negative
 *                      cases, open [VERIFY] flags, coverage rows — big
 *                      stat tiles + the Overview prose + the verifier's
 *                      IMPORTANT findings when the banner carries them
 *   checklists      <- Setup / Prerequisites and Open Questions as
 *                      drawn checkbox rows ([x] renders checked)
 *   dividers        <- Positive / Negative Tests section slides on ink,
 *                      with the section's CAUTION alert carried along
 *   one case/slide  <- each ### TC-… case: steps as a checklist on the
 *                      left; Expected Result and Trace as cards on the
 *                      right ([VERIFY: …] flags surfaced in amber);
 *                      long cases continue onto "(cont.)" slides
 *   tables          <- Coverage Map / Issue Trace as native, editable
 *                      PowerPoint tables (long ones paginate)
 *   bullet slides   <- Automation Notes, Documentation Impacts, and any
 *                      H2 this converter doesn't know — nothing in the
 *                      draft is dropped
 *   closing slide   <- the review ask + provenance, back on ink
 *
 * Machine banner comments are dropped from the slides but mined for
 * provenance (prompt/generator/provider), which lands in the deck's
 * footer of record on the closing slide. The output uses only native
 * shapes, text, and tables — every element is editable in PowerPoint.
 */

import fs from "node:fs";
import path from "node:path";
import { deflateRawSync } from "node:zlib";

// -------------------------------------------------------------- CLI

function collectInputs(argv) {
  const files = [];
  let out = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "-o") out = argv[++i];
    else files.push(argv[i]);
  }
  return { files, out };
}

// ----------------------------------------------------------- markdown
// The block parser is draft2docx's, verbatim in shape: same dialect,
// same joins, same comment handling.

const cells = (row) =>
  row.trim().replace(/^\|+|\|+$/g, "").split("|").map((c) => c.trim());

function parseBlocks(md) {
  const text = String(md).replace(/<!--[\s\S]*?-->/g, "");
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let para = [];
  const flushPara = () => {
    if (para.length) blocks.push({ kind: "p", text: para.join(" ") });
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === "") { flushPara(); continue; }
    let m = /^(#{1,6}) (.*)$/.exec(t);
    if (m) {
      flushPara();
      blocks.push({ kind: "h", level: Math.min(m[1].length, 3), text: m[2].trim() });
      continue;
    }
    if (t.startsWith("|")) {
      flushPara();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const r = lines[i].trim();
        if (!/^\|[\s\-|:]+\|$/.test(r)) rows.push(cells(r));
        i++;
      }
      i--;
      if (rows.length) blocks.push({ kind: "table", rows });
      continue;
    }
    if (t.startsWith(">")) {
      flushPara();
      const quote = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      i--;
      let label = "";
      if (quote.length && /^\[!(\w+)\]$/.test(quote[0])) {
        label = /^\[!(\w+)\]$/.exec(quote[0])[1];
        quote.shift();
      }
      blocks.push({ kind: "alert", label, text: quote.join(" ").trim() });
      continue;
    }
    m = /^- \[( |x)\] (.*)$/.exec(t);
    if (m) {
      flushPara();
      let item = m[2];
      while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1]) &&
             !/^\s*- /.test(lines[i + 1]) && !lines[i + 1].trim().startsWith("|")) {
        item += " " + lines[++i].trim();
      }
      blocks.push({ kind: "task", checked: m[1] === "x", text: item });
      continue;
    }
    m = /^[-*] (.*)$/.exec(t);
    if (m) {
      flushPara();
      let item = m[1];
      while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1]) &&
             !/^\s*[-*] /.test(lines[i + 1]) && !lines[i + 1].trim().startsWith("|")) {
        item += " " + lines[++i].trim();
      }
      blocks.push({ kind: "bullet", text: item });
      continue;
    }
    para.push(t);
  }
  flushPara();
  return blocks;
}

// ------------------------------------------------------- draft model
// Lift the flat block list into the deck's shape: title, banner facts,
// overview, sections, and — under the two test sections — TC cases.

const TEST_SECTIONS = ["Positive Tests", "Negative Tests"];

function parseDraft(md) {
  // provenance rides in the machine banner comment, mined before the
  // parser strips comments
  const prov = /<!--\s*machine-generated test-plan draft\s*—\s*([^>]*?)\s*-->/.exec(md);
  const blocks = parseBlocks(md);
  const model = {
    title: "Test Plan", provenance: prov ? prov[1] : "",
    generated: "", story: "", verify: "", overviewRows: null, intro: [],
    sections: [],
  };
  let sec = null;
  let cur = null; // current TC case
  const pre = []; // blocks before the first H2 (banner alerts, prose)
  for (const b of blocks) {
    if (b.kind === "h" && b.level === 1) { model.title = b.text; continue; }
    if (b.kind === "h" && b.level === 2) {
      sec = { name: b.text, blocks: [], cases: [] };
      cur = null;
      model.sections.push(sec);
      continue;
    }
    if (!sec) { pre.push(b); continue; }
    if (b.kind === "h" && b.level === 3) {
      cur = { title: b.text, steps: [], expected: "", trace: "", extra: [] };
      sec.cases.push(cur);
      continue;
    }
    if (cur) {
      if (b.kind === "p" && /^\*\*Steps:?\*\*$/.test(b.text)) continue;
      let m = /^\*\*Expected Result:?\*\*\s*(.*)$/.exec(b.kind === "p" ? b.text : "");
      if (m) { cur.expected = m[1]; continue; }
      m = /^\*\*Trace:?\*\*\s*(.*)$/.exec(b.kind === "p" ? b.text : "");
      if (m) { cur.trace = m[1]; continue; }
      if (b.kind === "task") { cur.steps.push(b); continue; }
      cur.extra.push(b);
      continue;
    }
    sec.blocks.push(b);
  }
  for (const b of pre) {
    if (b.kind === "alert" && b.label === "WARNING") {
      const g = /Generated\s+(\S+?)\s+from\s+(.*?)(?:\.\s|\.$|$)/.exec(b.text);
      if (g) { model.generated = g[1]; model.story = g[2].replace(/ Source sidecar:.*$/, ""); }
    } else if (b.kind === "alert" && b.label === "IMPORTANT") {
      model.verify = b.text;
    } else if (b.kind === "p") model.intro.push(b.text);
  }
  const ov = model.sections.find((s) => s.name === "Overview");
  if (ov) {
    const t = ov.blocks.find((b) => b.kind === "table");
    if (t) model.overviewRows = t.rows;
    model.intro.push(...ov.blocks.filter((b) => b.kind === "p").map((b) => b.text));
  }
  return model;
}

// only real flags count — the banner's "resolve all [VERIFY] items"
// instruction and the verifier's prose mention the tag without a colon
const countVerify = (md) => (String(md).match(/\[VERIFY:/g) || []).length;

// ------------------------------------------------------------ palette
// docs/Diagram_Style_Framework.md — the SlideFigures palette, so this
// deck and the figure deck read as one design.

const INK = "16302F";       // dominant: dark slides + all body text
const INK_SOFT = "23423F";  // raised panels on ink
const MUTED = "6E8285";     // secondary text
const PAPER = "FFFFFF";
const TINT = "EFF2F2";      // light panel fill
const BORDER = "D7DFDF";
const ICE = "CFDCDC";       // secondary text on ink
const GREEN = "2E7D5B";     // positive
const GREEN_TINT = "E4EFE9";
const RED = "B2442F";       // negative
const RED_TINT = "F4E7E3";
const AMBER = "C2701A";     // [VERIFY] / draft caution
const AMBER_TINT = "F7EDDF";
const TEAL = "1B6E8C";      // coverage / trace / links
const TEAL_TINT = "E4EEF2";
const FONT = "Segoe UI";

// --------------------------------------------------------- geometry
const IN = 914400;
const SLIDE_W = 12192000;   // 13.33in × 7.5in (16:9)
const SLIDE_H = 6858000;
const MARGIN = 457200;      // 0.5 in
const CONTENT_W = SLIDE_W - 2 * MARGIN;
const PT = 12700;           // EMU per point

// wrap estimate: Segoe UI averages ~0.5 em advance; 0.53 leaves slack
// (bold display sizes wrap earlier — callers pass a wider factor)
function linesOf(text, szPt, wEmu, factor) {
  const perLine = Math.max(8, Math.floor(wEmu / PT / (szPt * (factor || 0.53))));
  const words = String(text).split(/\s+/);
  let n = 1, len = 0;
  for (const w of words) {
    if (len + w.length + (len ? 1 : 0) > perLine) { n++; len = w.length; }
    else len += w.length + (len ? 1 : 0);
  }
  return n;
}
const lineH = (szPt) => Math.round(szPt * 1.32 * PT);

// ------------------------------------------------------ DrawingML emit
const xesc = (s) => String(s)
  .replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, "&amp;")
  .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const solidFill = (hex) => `<a:solidFill><a:srgbClr val="${hex}"/></a:solidFill>`;

const xfrm = (x, y, w, h) =>
  `<a:xfrm><a:off x="${Math.round(x)}" y="${Math.round(y)}"/>` +
  `<a:ext cx="${Math.max(1, Math.round(w))}" cy="${Math.max(1, Math.round(h))}"/></a:xfrm>`;

let SHAPE_ID = 2;
function sp(name, spPr, txBody) {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${SHAPE_ID++}" name="${xesc(name)}"/>` +
    "<p:cNvSpPr/><p:nvPr/></p:nvSpPr>" +
    `<p:spPr>${spPr}</p:spPr>${txBody || ""}</p:sp>`;
}

// r: {t, color, sz, b, i, font}
function runXml(r) {
  return `<a:r><a:rPr lang="en-US" sz="${Math.round(r.sz * 100)}" b="${r.b ? 1 : 0}"` +
    `${r.i ? ' i="1"' : ""} spc="${r.spc || 0}" dirty="0">` +
    solidFill(r.color || INK) +
    `<a:latin typeface="${r.font || FONT}"/></a:rPr>` +
    `<a:t>${xesc(r.t)}</a:t></a:r>`;
}

// p: {runs, algn, after (pt), line (pt)}
function paraXml(p) {
  const spcAft = p.after ? `<a:spcAft><a:spcPts val="${Math.round(p.after * 100)}"/></a:spcAft>` : "";
  const ln = p.line ? `<a:lnSpc><a:spcPts val="${Math.round(p.line * 100)}"/></a:lnSpc>` : "";
  return `<a:p><a:pPr algn="${p.algn || "l"}">${ln}${spcAft}</a:pPr>` +
    p.runs.map(runXml).join("") + "</a:p>";
}

function textbox(name, x, y, w, h, paras, opt) {
  const o = opt || {};
  const spPr = xfrm(x, y, w, h) +
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln>';
  const body = `<p:txBody><a:bodyPr wrap="${o.wrap || "square"}" lIns="0" tIns="0" rIns="0" bIns="0"` +
    ` anchor="${o.anchor || "t"}"/><a:lstStyle/>` + paras.map(paraXml).join("") + "</p:txBody>";
  return sp(name, spPr, body);
}

function card(name, x, y, w, h, fill, line, adjPct) {
  const adj = adjPct == null ? 6 : adjPct;
  const geom = `<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val ${Math.round(adj * 1000)}"/></a:avLst></a:prstGeom>`;
  const ln = line ? `<a:ln w="9525">${solidFill(line)}</a:ln>` : "<a:ln><a:noFill/></a:ln>";
  return sp(name, xfrm(x, y, w, h) + geom + solidFill(fill) + ln);
}

// pill: fully-rounded chip with centred label; returns xml (width fixed)
function pill(text, x, y, w, h, fill, color, sz, bold) {
  const geom = '<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 50000"/></a:avLst></a:prstGeom>';
  const body = '<p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/><a:lstStyle/>' +
    paraXml({ algn: "ctr", runs: [{ t: text, color, sz, b: bold !== false, spc: 60 }] }) + "</p:txBody>";
  return sp("chip " + text, xfrm(x, y, w, h) + geom + solidFill(fill) + "<a:ln><a:noFill/></a:ln>", body);
}
// chip width: bold + letter-spaced, and the viewer's font may run wide
const pillW = (text, sz) => Math.round(text.length * (sz * 0.72 + 0.62) * PT + 0.3 * IN);

// drawn checkbox: rounded square, filled green + tick when checked
function checkbox(x, y, size, checked) {
  const geom = '<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 22000"/></a:avLst></a:prstGeom>';
  if (!checked) {
    return sp("checkbox", xfrm(x, y, size, size) + geom + solidFill(PAPER) +
      `<a:ln w="15875">${solidFill(MUTED)}</a:ln>`);
  }
  const body = '<p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/><a:lstStyle/>' +
    paraXml({ algn: "ctr", runs: [{ t: "✓", color: PAPER, sz: size / PT * 0.62, b: true }] }) + "</p:txBody>";
  return sp("checkbox", xfrm(x, y, size, size) + geom + solidFill(GREEN) + "<a:ln><a:noFill/></a:ln>", body);
}

// inline runs: **bold** spans (unbalanced ** stays literal, the
// draft2docx rule) and [VERIFY…] flags lifted into amber bold
function inlineRuns(text, base) {
  const out = [];
  const parts = String(text).split("**");
  const balanced = parts.length % 2 === 1;
  const emit = (s, bold) => {
    let rest = s;
    while (rest !== "") {
      const m = /\[VERIFY[^\]]*\]?/.exec(rest);
      if (!m) break;
      if (m.index > 0) out.push({ ...base, t: rest.slice(0, m.index), b: bold || base.b });
      out.push({ ...base, t: m[0], color: AMBER, b: true });
      rest = rest.slice(m.index + m[0].length);
    }
    if (rest !== "") out.push({ ...base, t: rest, b: bold || base.b });
  };
  for (let k = 0; k < parts.length; k++) {
    if (!balanced && k === parts.length - 1) emit("**" + parts[k], false);
    else if (parts[k] !== "") emit(parts[k], k % 2 === 1);
  }
  return out.length ? out : [{ ...base, t: "" }];
}

// footer of every light slide: plan title left, page number right
function footer(planTitle, pageNo) {
  return textbox("footer title", MARGIN, SLIDE_H - 0.42 * IN, CONTENT_W - IN, 0.25 * IN,
    [{ runs: [{ t: planTitle, color: MUTED, sz: 10 }] }]) +
    textbox("footer page", SLIDE_W - MARGIN - IN, SLIDE_H - 0.42 * IN, IN, 0.25 * IN,
      [{ algn: "r", runs: [{ t: String(pageNo), color: MUTED, sz: 10 }] }]);
}

const bg = (hex) =>
  `<p:bg><p:bgPr><a:solidFill><a:srgbClr val="${hex}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>`;

function slide(shapesXml, bgHex) {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<p:sld ${NS_A} ${NS_R} ${NS_P}><p:cSld>` + (bgHex ? bg(bgHex) : "") +
    '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>' +
    "<p:grpSpPr/>" + shapesXml + "</p:spTree></p:cSld>" +
    "<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>";
}

// ------------------------------------------------- native table emit
const TBL_ROW_H = 300000;
function tableFrame(x, y, rows, maxW, accentCol) {
  const nCols = Math.max(...rows.map((r) => r.length));
  const widths = [];
  for (let c = 0; c < nCols; c++) {
    let ch = 4;
    for (const r of rows) ch = Math.max(ch, (r[c] || "").length);
    widths.push(Math.min(46, ch) * 86000 + 300000);
  }
  const total = widths.reduce((a, b) => a + b, 0);
  if (total > maxW) {
    const f = maxW / total;
    for (let i = 0; i < nCols; i++) widths[i] = Math.round(widths[i] * f);
  }
  const w = widths.reduce((a, b) => a + b, 0);
  // rows grow with wrapped cells — estimate each row's real height so
  // whatever sits under the table is placed clear of it
  const rowH = rows.map((r) => {
    let lines = 1;
    for (let c = 0; c < nCols; c++) {
      lines = Math.max(lines, linesOf(r[c] || "", 12.5, widths[c] - 0.22 * IN));
    }
    return Math.max(TBL_ROW_H, lines * lineH(12.5) + 0.14 * IN);
  });
  const totalH = rowH.reduce((a, b) => a + b, 0);
  const border = (side) => `<a:${side} w="9525">${solidFill(BORDER)}</a:${side}>`;
  const trs = rows.map((r, ri) => {
    const tcs = [];
    for (let c = 0; c < nCols; c++) {
      const accent = ri > 0 && c === accentCol;
      const runs = inlineRuns(r[c] || "",
        { color: ri === 0 ? PAPER : accent ? TEAL : INK, sz: 12.5, b: ri === 0 || accent });
      tcs.push("<a:tc><a:txBody><a:bodyPr/><a:lstStyle/>" +
        paraXml({ runs }) + "</a:txBody>" +
        '<a:tcPr marL="91440" marR="91440" marT="36576" marB="36576" anchor="ctr">' +
        border("lnL") + border("lnR") + border("lnT") + border("lnB") +
        (ri === 0 ? solidFill(INK) : solidFill(ri % 2 ? PAPER : TINT)) +
        "</a:tcPr></a:tc>");
    }
    return `<a:tr h="${rowH[ri]}">${tcs.join("")}</a:tr>`;
  }).join("");
  const xml = "<p:graphicFrame><p:nvGraphicFramePr>" +
    `<p:cNvPr id="${SHAPE_ID++}" name="table"/>` +
    '<p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/>' +
    "</p:nvGraphicFramePr>" +
    `<p:xfrm><a:off x="${Math.round(x)}" y="${Math.round(y)}"/><a:ext cx="${w}" cy="${totalH}"/></p:xfrm>` +
    '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">' +
    '<a:tbl><a:tblPr firstRow="1" bandRow="0"/><a:tblGrid>' +
    widths.map((cw) => `<a:gridCol w="${cw}"/>`).join("") +
    `</a:tblGrid>${trs}</a:tbl></a:graphicData></a:graphic></p:graphicFrame>`;
  return { xml, w, h: totalH };
}

// ------------------------------------------------------------- slides

function overviewFacts(model) {
  // Overview table -> [label, value] pairs (single data row under headers)
  const rows = model.overviewRows;
  if (!rows || rows.length < 2) return [];
  const facts = [];
  for (let c = 0; c < rows[0].length; c++) {
    if (rows[1][c]) facts.push([rows[0][c], rows[1][c]]);
  }
  return facts;
}

function titleSlide(model) {
  let x = "";
  const facts = overviewFacts(model);
  // eyebrow
  x += textbox("eyebrow", MARGIN, 1.02 * IN, CONTENT_W, 0.32 * IN,
    [{ runs: [{ t: "TEST PLAN REVIEW", color: ICE, sz: 13, b: true, spc: 300 }] }]);
  // headline: strip the "Test Plan — " prefix the dialect mandates
  const head = model.title.replace(/^Test Plan\s*[—-]\s*/, "");
  const headSz = head.length > 34 ? 40 : 48;
  x += textbox("title", MARGIN, 1.5 * IN, CONTENT_W, 1.9 * IN,
    [{ runs: [{ t: head, color: PAPER, sz: headSz, b: true }] }]);
  const headLines = linesOf(head, headSz, CONTENT_W, 0.68);
  let y = 1.5 * IN + headLines * lineH(headSz) + 0.35 * IN;
  // draft pill, then the generated stamp on its own line
  const dp = "DRAFT — MACHINE-GENERATED, UNREVIEWED";
  x += pill(dp, MARGIN, y, pillW(dp, 11.5), 0.42 * IN, AMBER, PAPER, 11.5);
  if (model.generated || model.story) {
    const stamp = ["Generated " + model.generated.replace("T", " ").replace("Z", " UTC"),
                   model.story].filter(Boolean).join("  ·  from ");
    x += textbox("stamp", MARGIN, y + 0.62 * IN, CONTENT_W, 0.6 * IN,
      [{ line: 18, runs: [{ t: stamp, color: ICE, sz: 12.5 }] }]);
  }
  // overview facts as labeled columns along the bottom
  if (facts.length) {
    const fy = SLIDE_H - 1.62 * IN;
    const colW = Math.min(3.2 * IN, CONTENT_W / facts.length);
    facts.forEach(([label, val], i) => {
      const fx = MARGIN + i * colW;
      x += textbox("fact label " + label, fx, fy, colW - 0.3 * IN, 0.28 * IN,
        [{ runs: [{ t: label.toUpperCase(), color: MUTED, sz: 11, b: true, spc: 200 }] }]);
      x += textbox("fact " + label, fx, fy + 0.32 * IN, colW - 0.3 * IN, 0.45 * IN,
        [{ runs: [{ t: val, color: PAPER, sz: 20, b: true }] }]);
    });
  }
  return slide(x, INK);
}

function statTile(x, y, w, h, big, label, color) {
  let s = card("tile", x, y, w, h, PAPER, BORDER, 8);
  s += textbox("tile n", x + 0.28 * IN, y + 0.3 * IN, w - 0.56 * IN, h * 0.55,
    [{ runs: [{ t: String(big), color, sz: 52, b: true }] }]);
  s += textbox("tile label", x + 0.28 * IN, y + h - 0.62 * IN, w - 0.56 * IN, 0.5 * IN,
    [{ runs: [{ t: label, color: MUTED, sz: 12.5, b: true }] }]);
  return s;
}

function glanceSlide(model, stats, pageNo) {
  let x = "";
  x += textbox("h", MARGIN, 0.55 * IN, CONTENT_W, 0.62 * IN,
    [{ runs: [{ t: "At a glance", color: INK, sz: 32, b: true }] }]);
  const tiles = [
    [stats.pos, "Positive cases", GREEN],
    [stats.neg, "Negative cases", RED],
    [stats.verify, "Open [VERIFY] flags", AMBER],
    [stats.coverage, "Requirements traced", TEAL],
  ];
  const gap = 0.28 * IN;
  const tw = (CONTENT_W - 3 * gap) / 4;
  tiles.forEach(([n, label, color], i) => {
    x += statTile(MARGIN + i * (tw + gap), 1.45 * IN, tw, 1.85 * IN, n, label, color);
  });
  let y = 3.65 * IN;
  // the plan's own statement of scope
  if (model.intro.length) {
    const txt = model.intro.join(" ");
    x += textbox("scope label", MARGIN, y, CONTENT_W, 0.3 * IN,
      [{ runs: [{ t: "SCOPE", color: MUTED, sz: 11.5, b: true, spc: 250 }] }]);
    x += textbox("scope", MARGIN, y + 0.34 * IN, CONTENT_W * 0.62, 1.4 * IN,
      [{ line: 21, runs: inlineRuns(txt, { color: INK, sz: 14.5 }) }]);
  }
  // verifier findings card on the right when the banner carries them
  if (model.verify) {
    const vw = CONTENT_W * 0.33;
    const vx = SLIDE_W - MARGIN - vw;
    // "N finding(s) — review these first: - a - b" -> a lead + bullets
    const vTxt = model.verify.replace(/^Draft verifier:\s*/, "");
    const [lead, ...items] = vTxt.split(/\s+-\s+/);
    const paras = [{ line: 17, after: items.length ? 4 : 0,
      runs: inlineRuns(lead, { color: INK, sz: 12.5, b: true }) }];
    for (const it of items) {
      paras.push({ line: 17, after: 3,
        runs: inlineRuns("•  " + it, { color: INK, sz: 12.5 }) });
    }
    let vLines = 0;
    for (const p of paras) {
      vLines += linesOf(p.runs.map((r) => r.t).join(""), 12.5, vw - 0.5 * IN);
    }
    const vh = Math.max(1.15 * IN, vLines * lineH(12.5) + (paras.length - 1) * 0.06 * IN + 0.78 * IN);
    x += card("verify card", vx, y, vw, vh, AMBER_TINT, null, 8);
    x += textbox("verify label", vx + 0.25 * IN, y + 0.18 * IN, vw - 0.5 * IN, 0.28 * IN,
      [{ runs: [{ t: "DRAFT VERIFIER", color: AMBER, sz: 11, b: true, spc: 250 }] }]);
    x += textbox("verify body", vx + 0.25 * IN, y + 0.5 * IN, vw - 0.5 * IN, vh - 0.6 * IN, paras);
  }
  return slide(x + footer(model.title, pageNo), PAPER);
}

// checklist slide: Setup / Prerequisites, Open Questions
function checklistSlide(model, sec, pageNo) {
  let x = "";
  x += textbox("h", MARGIN, 0.55 * IN, CONTENT_W, 0.62 * IN,
    [{ runs: [{ t: sec.name, color: INK, sz: 32, b: true }] }]);
  const items = sec.blocks.filter((b) => b.kind === "task" || b.kind === "bullet");
  const prose = sec.blocks.filter((b) => b.kind === "p").map((b) => b.text).join(" ");
  let y = 1.5 * IN;
  if (prose) {
    x += textbox("prose", MARGIN, y, CONTENT_W, 0.8 * IN,
      [{ line: 20, runs: inlineRuns(prose, { color: MUTED, sz: 13.5 }) }]);
    y += linesOf(prose, 13.5, CONTENT_W) * lineH(13.5) + 0.25 * IN;
  }
  const rowW = CONTENT_W;
  const sz = items.length > 9 ? 12.5 : 14.5;
  for (const it of items) {
    const tl = linesOf(it.text, sz, rowW - 0.62 * IN);
    const rh = Math.max(0.34 * IN, tl * lineH(sz));
    x += checkbox(MARGIN, y + 0.02 * IN, 0.26 * IN, it.checked);
    x += textbox("item", MARGIN + 0.46 * IN, y, rowW - 0.62 * IN, rh,
      [{ line: sz * 1.32, runs: inlineRuns(it.text, { color: INK, sz }) }]);
    y += rh + 0.17 * IN;
  }
  return slide(x + footer(model.title, pageNo), PAPER);
}

// section divider on ink: Positive / Negative Tests
function dividerSlide(model, sec, pageNo) {
  const neg = /negative/i.test(sec.name);
  const color = neg ? RED : GREEN;
  let x = "";
  const n = sec.cases.length;
  x += textbox("count", MARGIN, 2.1 * IN, CONTENT_W, 1.1 * IN,
    [{ runs: [{ t: String(n).padStart(2, "0"), color, sz: 80, b: true }] }]);
  x += textbox("h", MARGIN, 3.35 * IN, CONTENT_W, 0.9 * IN,
    [{ runs: [{ t: sec.name, color: PAPER, sz: 44, b: true }] }]);
  x += textbox("strap", MARGIN, 4.25 * IN, CONTENT_W * 0.6, 0.4 * IN,
    [{ runs: [{ t: n === 1 ? "1 test case" : `${n} test cases`, color: ICE, sz: 15 }] }]);
  // the section's CAUTION alert rides on its divider
  const alert = sec.blocks.find((b) => b.kind === "alert");
  if (alert) {
    const aw = CONTENT_W * 0.55;
    const ax = SLIDE_W - MARGIN - aw;
    const ah = Math.max(1 * IN, linesOf(alert.text, 13, aw - 0.5 * IN) * lineH(13) + 0.72 * IN);
    const ay = SLIDE_H - MARGIN - ah;
    x += card("alert", ax, ay, aw, ah, INK_SOFT, null, 8);
    x += textbox("alert label", ax + 0.25 * IN, ay + 0.16 * IN, aw - 0.5 * IN, 0.28 * IN,
      [{ runs: [{ t: alert.label || "NOTE", color: neg ? "E8A090" : ICE, sz: 11, b: true, spc: 250 }] }]);
    x += textbox("alert body", ax + 0.25 * IN, ay + 0.47 * IN, aw - 0.5 * IN, ah - 0.6 * IN,
      [{ line: 17.5, runs: inlineRuns(alert.text, { color: ICE, sz: 13 }) }]);
  }
  return slide(x, INK);
}

// one TC case → one slide (steps overflow onto "(cont.)" slides)
const CASE_TOP = 1.9 * IN;
const CASE_BOTTOM = SLIDE_H - 0.62 * IN;

function caseSlides(model, sec, tc, pageRef) {
  const neg = /negative/i.test(sec.name);
  const color = neg ? RED : GREEN;
  const tint = neg ? RED_TINT : GREEN_TINT;
  const m = /^(TC-\S+)\s*[—-]\s*(.*)$/.exec(tc.title);
  const id = m ? m[1] : "";
  const name = m ? m[2] : tc.title;

  const leftW = CONTENT_W * 0.56;
  const rightW = CONTENT_W - leftW - 0.4 * IN;
  const rightX = MARGIN + leftW + 0.4 * IN;

  // measure steps into per-slide groups
  const stepSz = 13.5;
  const groups = [];
  let g = [], gh = 0;
  for (const st of tc.steps.length ? tc.steps : [{ checked: false, text: "(no steps in draft)" }]) {
    const tl = linesOf(st.text, stepSz, leftW - 0.6 * IN);
    const rh = Math.max(0.32 * IN, tl * lineH(stepSz)) + 0.16 * IN;
    if (gh + rh > CASE_BOTTOM - CASE_TOP - 0.45 * IN && g.length) { groups.push(g); g = []; gh = 0; }
    g.push(st); gh += rh;
  }
  if (g.length) groups.push(g);

  const out = [];
  groups.forEach((steps, gi) => {
    let x = "";
    // header: kind pill + id chip + title
    const kindLabel = neg ? "NEGATIVE" : "POSITIVE";
    const kw = pillW(kindLabel, 10.5);
    let hx = MARGIN;
    if (id) {
      const iw = pillW(id, 13);
      x += pill(id, hx, 0.55 * IN, iw, 0.42 * IN, color, PAPER, 13);
      hx += iw + 0.18 * IN;
    }
    x += pill(kindLabel, hx, 0.585 * IN, kw, 0.35 * IN, tint, color, 10.5);
    const cont = groups.length > 1 ? `  (${gi + 1} of ${groups.length})` : "";
    const titleSz = name.length > 60 ? 21 : 25;
    x += textbox("case title", MARGIN, 1.12 * IN, CONTENT_W, 0.72 * IN,
      [{ runs: [{ t: name + cont, color: INK, sz: titleSz, b: true }] }]);

    // left: steps
    let y = CASE_TOP;
    x += textbox("steps label", MARGIN, y, leftW, 0.28 * IN,
      [{ runs: [{ t: "STEPS", color: MUTED, sz: 11.5, b: true, spc: 250 }] }]);
    y += 0.4 * IN;
    for (const st of steps) {
      const tl = linesOf(st.text, stepSz, leftW - 0.6 * IN);
      const rh = Math.max(0.32 * IN, tl * lineH(stepSz));
      x += checkbox(MARGIN, y + 0.01 * IN, 0.24 * IN, st.checked);
      x += textbox("step", MARGIN + 0.42 * IN, y, leftW - 0.6 * IN, rh,
        [{ line: stepSz * 1.32, runs: inlineRuns(st.text, { color: INK, sz: stepSz }) }]);
      y += rh + 0.16 * IN;
    }
    // any non-step content the case carried (tables render as prose rows)
    for (const b of tc.extra) {
      if (gi !== groups.length - 1) break;
      if (b.kind === "p" || b.kind === "bullet") {
        const tl = linesOf(b.text, 12.5, leftW);
        x += textbox("extra", MARGIN, y, leftW, tl * lineH(12.5),
          [{ line: 16.5, runs: inlineRuns(b.text, { color: MUTED, sz: 12.5 }) }]);
        y += tl * lineH(12.5) + 0.14 * IN;
      }
    }

    // right: expected result + trace cards (first slide of the group)
    if (gi === 0) {
      let ry = CASE_TOP;
      if (tc.expected) {
        const eh = Math.max(1.05 * IN,
          linesOf(tc.expected, 13.5, rightW - 0.56 * IN) * lineH(13.5) + 0.78 * IN);
        x += card("expected", rightX, ry, rightW, eh, tint, null, 7);
        x += textbox("expected label", rightX + 0.28 * IN, ry + 0.2 * IN, rightW - 0.56 * IN, 0.28 * IN,
          [{ runs: [{ t: "EXPECTED RESULT", color, sz: 11, b: true, spc: 250 }] }]);
        x += textbox("expected body", rightX + 0.28 * IN, ry + 0.53 * IN, rightW - 0.56 * IN, eh - 0.68 * IN,
          [{ line: 18, runs: inlineRuns(tc.expected, { color: INK, sz: 13.5 }) }]);
        ry += eh + 0.3 * IN;
      }
      if (tc.trace) {
        const th = Math.max(0.95 * IN,
          linesOf(tc.trace, 12.5, rightW - 0.56 * IN) * lineH(12.5) + 0.75 * IN);
        x += card("trace", rightX, ry, rightW, th, TINT, null, 7);
        x += textbox("trace label", rightX + 0.28 * IN, ry + 0.18 * IN, rightW - 0.56 * IN, 0.28 * IN,
          [{ runs: [{ t: "TRACE", color: TEAL, sz: 11, b: true, spc: 250 }] }]);
        x += textbox("trace body", rightX + 0.28 * IN, ry + 0.5 * IN, rightW - 0.56 * IN, th - 0.62 * IN,
          [{ line: 16.5, runs: inlineRuns(tc.trace, { color: INK, sz: 12.5 }).map((r) => ({ ...r, i: true })) }]);
      }
    }
    out.push(slide(x + footer(model.title, pageRef.n++), PAPER));
  });
  return out;
}

// table slide: Coverage Map / Issue Trace (long tables paginate)
function tableSlides(model, sec, pageRef) {
  const out = [];
  const tables = sec.blocks.filter((b) => b.kind === "table");
  const prose = sec.blocks.filter((b) => b.kind === "p" && !/^_.*_$/.test(b.text))
    .map((b) => b.text).join(" ");
  const note = sec.blocks.find((b) => b.kind === "p" && /^_.*_$/.test(b.text));
  const accentCol = sec.name === "Coverage Map"
    ? 2 : sec.name === "Issue Trace" ? 0 : -1;
  for (const t of tables) {
    const header = t.rows[0];
    const body = t.rows.slice(1);
    const perSlide = 11;
    for (let p = 0; p < Math.max(1, Math.ceil(body.length / perSlide)); p++) {
      const rows = [header, ...body.slice(p * perSlide, (p + 1) * perSlide)];
      let x = "";
      const cont = body.length > perSlide ? `  (${p + 1} of ${Math.ceil(body.length / perSlide)})` : "";
      x += textbox("h", MARGIN, 0.55 * IN, CONTENT_W, 0.62 * IN,
        [{ runs: [{ t: sec.name + cont, color: INK, sz: 32, b: true }] }]);
      let y = 1.5 * IN;
      if (p === 0 && prose) {
        x += textbox("prose", MARGIN, y, CONTENT_W, 0.6 * IN,
          [{ line: 19, runs: inlineRuns(prose, { color: MUTED, sz: 13 }) }]);
        y += linesOf(prose, 13, CONTENT_W) * lineH(13) + 0.2 * IN;
      }
      const tf = tableFrame(MARGIN, y, rows, CONTENT_W, accentCol);
      x += tf.xml;
      if (p === 0 && note) {
        const nTxt = note.text.replace(/^_|_$/g, "");
        x += textbox("note", MARGIN, y + tf.h + 0.2 * IN, CONTENT_W, 0.55 * IN,
          [{ line: 15.5, runs: inlineRuns(nTxt, { color: MUTED, sz: 11.5 }).map((r) => ({ ...r, i: true })) }]);
      }
      out.push(slide(x + footer(model.title, pageRef.n++), PAPER));
    }
  }
  return out;
}

// bullet slide: Automation Notes, Documentation Impacts, unknown H2s
function bulletsSlide(model, sec, pageNo) {
  let x = "";
  x += textbox("h", MARGIN, 0.55 * IN, CONTENT_W, 0.62 * IN,
    [{ runs: [{ t: sec.name, color: INK, sz: 32, b: true }] }]);
  let y = 1.5 * IN;
  for (const b of sec.blocks) {
    if (b.kind === "table") {
      const tf = tableFrame(MARGIN, y, b.rows, CONTENT_W, -1);
      x += tf.xml;
      y += tf.h + 0.25 * IN;
    } else if (b.kind === "alert") {
      const ah = Math.max(0.85 * IN, linesOf(b.text, 13, CONTENT_W - 0.56 * IN) * lineH(13) + 0.7 * IN);
      x += card("alert", MARGIN, y, CONTENT_W, ah, AMBER_TINT, null, 7);
      x += textbox("alert label", MARGIN + 0.28 * IN, y + 0.16 * IN, CONTENT_W - 0.56 * IN, 0.28 * IN,
        [{ runs: [{ t: b.label || "NOTE", color: AMBER, sz: 11, b: true, spc: 250 }] }]);
      x += textbox("alert body", MARGIN + 0.28 * IN, y + 0.46 * IN, CONTENT_W - 0.56 * IN, ah - 0.6 * IN,
        [{ line: 17.5, runs: inlineRuns(b.text, { color: INK, sz: 13 }) }]);
      y += ah + 0.25 * IN;
    } else if (b.kind === "task" || b.kind === "bullet") {
      const sz = 14;
      const tl = linesOf(b.text, sz, CONTENT_W - 0.6 * IN);
      const rh = Math.max(0.32 * IN, tl * lineH(sz));
      if (b.kind === "task") x += checkbox(MARGIN, y + 0.01 * IN, 0.24 * IN, b.checked);
      else x += sp("dot", xfrm(MARGIN + 0.05 * IN, y + 0.09 * IN, 0.09 * IN, 0.09 * IN) +
        '<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>' + solidFill(TEAL) + "<a:ln><a:noFill/></a:ln>");
      x += textbox("item", MARGIN + 0.42 * IN, y, CONTENT_W - 0.6 * IN, rh,
        [{ line: sz * 1.32, runs: inlineRuns(b.text, { color: INK, sz }) }]);
      y += rh + 0.16 * IN;
    } else if (b.kind === "p") {
      const tl = linesOf(b.text, 14, CONTENT_W);
      x += textbox("p", MARGIN, y, CONTENT_W, tl * lineH(14),
        [{ line: 19, runs: inlineRuns(b.text, { color: INK, sz: 14 }) }]);
      y += tl * lineH(14) + 0.2 * IN;
    }
  }
  return slide(x + footer(model.title, pageNo), PAPER);
}

function closingSlide(model, stats) {
  let x = "";
  x += textbox("h", MARGIN, 1.55 * IN, CONTENT_W, 0.9 * IN,
    [{ runs: [{ t: "Before this draft becomes the plan", color: PAPER, sz: 34, b: true }] }]);
  const asks = [
    `Review all ${stats.pos + stats.neg} cases against the source story`,
    stats.verify
      ? `Resolve the ${stats.verify} open [VERIFY] flag${stats.verify === 1 ? "" : "s"}`
      : "No open [VERIFY] flags — confirm none were missed",
    "Confirm the Coverage Map traces every requirement",
    "Finalize in Word (draft2docx) and file the plan of record",
  ];
  let y = 2.75 * IN;
  asks.forEach((t, i) => {
    x += sp("num", xfrm(MARGIN, y, 0.34 * IN, 0.34 * IN) +
      '<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>' + solidFill(INK_SOFT) + "<a:ln><a:noFill/></a:ln>",
      '<p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/><a:lstStyle/>' +
      paraXml({ algn: "ctr", runs: [{ t: String(i + 1), color: PAPER, sz: 13, b: true }] }) + "</p:txBody>");
    x += textbox("ask", MARGIN + 0.55 * IN, y + 0.015 * IN, CONTENT_W - 0.55 * IN, 0.4 * IN,
      [{ runs: inlineRuns(t, { color: ICE, sz: 16 }) }]);
    y += 0.58 * IN;
  });
  if (model.provenance) {
    x += textbox("prov", MARGIN, SLIDE_H - 0.75 * IN, CONTENT_W, 0.3 * IN,
      [{ runs: [{ t: model.provenance + "  ·  deck: local/draft2pptx.mjs v1.0", color: MUTED, sz: 10.5 }] }]);
  }
  return slide(x, INK);
}

// ------------------------------------------------------------ package
const XML_HDR = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const NS_A = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"';
const NS_R = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const NS_P = 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
const RT = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

function themeXml() {
  const fills = "<a:fillStyleLst>" +
    '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'.repeat(3) + "</a:fillStyleLst>";
  const lns = "<a:lnStyleLst>" +
    '<a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>'.repeat(3) +
    "</a:lnStyleLst>";
  const effs = "<a:effectStyleLst>" +
    "<a:effectStyle><a:effectLst/></a:effectStyle>".repeat(3) + "</a:effectStyleLst>";
  const bgs = "<a:bgFillStyleLst>" +
    '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'.repeat(3) + "</a:bgFillStyleLst>";
  return XML_HDR + `<a:theme ${NS_A} name="TestPlan">` +
    '<a:themeElements><a:clrScheme name="TestPlan">' +
    `<a:dk1><a:srgbClr val="${INK}"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>` +
    `<a:dk2><a:srgbClr val="4E6265"/></a:dk2><a:lt2><a:srgbClr val="${TINT}"/></a:lt2>` +
    `<a:accent1><a:srgbClr val="${TEAL}"/></a:accent1><a:accent2><a:srgbClr val="${AMBER}"/></a:accent2>` +
    `<a:accent3><a:srgbClr val="${GREEN}"/></a:accent3><a:accent4><a:srgbClr val="7A5AA6"/></a:accent4>` +
    `<a:accent5><a:srgbClr val="${RED}"/></a:accent5><a:accent6><a:srgbClr val="${MUTED}"/></a:accent6>` +
    `<a:hlink><a:srgbClr val="${TEAL}"/></a:hlink><a:folHlink><a:srgbClr val="7A5AA6"/></a:folHlink></a:clrScheme>` +
    `<a:fontScheme name="TestPlan"><a:majorFont><a:latin typeface="${FONT}"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>` +
    `<a:minorFont><a:latin typeface="${FONT}"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>` +
    `<a:fmtScheme name="TestPlan">${fills}${lns}${effs}${bgs}</a:fmtScheme>` +
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

function buildPptx(slides, deckTitle) {
  const parts = [];
  const put = (name, xml) => parts.push({ name, data: Buffer.from(xml, "utf8") });
  const n = slides.length;
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
    ` xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xesc(deckTitle)}</dc:title>` +
    `<dc:creator>draft2pptx</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>` +
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`);
  const sldIds = slides.map((s, i) => `<p:sldId id="${256 + i}" r:id="rId${2 + i}"/>`).join("");
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
    put(`ppt/slides/slide${i + 1}.xml`, slides[i]);
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

// ---------------------------------------------------------------- deck

function buildDeck(md) {
  SHAPE_ID = 2;
  const model = parseDraft(md);
  const pos = model.sections.find((s) => s.name === "Positive Tests");
  const neg = model.sections.find((s) => s.name === "Negative Tests");
  const cov = model.sections.find((s) => s.name === "Coverage Map");
  const stats = {
    pos: pos ? pos.cases.length : 0,
    neg: neg ? neg.cases.length : 0,
    verify: countVerify(md),
    coverage: cov ? Math.max(0, ((cov.blocks.find((b) => b.kind === "table") || { rows: [0] }).rows.length - 1)) : 0,
  };
  const slides = [titleSlide(model)];
  const pageRef = { n: 2 };
  slides.push(glanceSlide(model, stats, pageRef.n++));
  for (const sec of model.sections) {
    if (sec.name === "Overview") continue; // folded into title + glance
    if (TEST_SECTIONS.includes(sec.name)) {
      slides.push(dividerSlide(model, sec, pageRef.n++));
      for (const tc of sec.cases) slides.push(...caseSlides(model, sec, tc, pageRef));
      continue;
    }
    if (sec.cases.length) {
      // an unknown H2 that carries H3 cases still gets case slides
      slides.push(dividerSlide(model, sec, pageRef.n++));
      for (const tc of sec.cases) slides.push(...caseSlides(model, sec, tc, pageRef));
      continue;
    }
    const hasTable = sec.blocks.some((b) => b.kind === "table");
    const hasTasks = sec.blocks.some((b) => b.kind === "task" || b.kind === "bullet");
    if (sec.name === "Setup / Prerequisites" || sec.name === "Open Questions") {
      slides.push(checklistSlide(model, sec, pageRef.n++));
    } else if (hasTable && !hasTasks) {
      slides.push(...tableSlides(model, sec, pageRef));
    } else if (sec.blocks.length) {
      slides.push(bulletsSlide(model, sec, pageRef.n++));
    }
  }
  slides.push(closingSlide(model, stats));
  return { buf: buildPptx(slides, model.title + " — review deck"), slides: slides.length, model };
}

// ---------------------------------------------------------------- main
const { files, out } = collectInputs(process.argv.slice(2));
if (files.length === 0 || (out && files.length > 1)) {
  console.error('usage: node local/draft2pptx.mjs <draft.md> [more.md ...] [-o out.pptx]');
  console.error("       -o names the output for a SINGLE input");
  process.exit(2);
}
let failed = 0;
for (const f of files) {
  try {
    const md = fs.readFileSync(f, "utf8");
    const { buf, slides, model } = buildDeck(md);
    const dest = out || f.replace(/\.md$/i, "") + ".pptx";
    fs.writeFileSync(dest, buf);
    console.log(`${dest}: ${slides} slides — ${model.title}`);
  } catch (e) {
    console.error(`skip ${f}: ${e.message}`);
    failed++;
  }
}
process.exit(failed && failed === files.length ? 1 : 0);
