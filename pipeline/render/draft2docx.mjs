#!/usr/bin/env node
/**
 * draft2docx v1.0 — TestPlanGen draft markdown → an editable Word file
 * --------------------------------------------------------------------
 * Standalone (Node ≥ 18, zero dependencies — the svg2pptx precedent:
 * OOXML is a zip of XML parts, and Node's zlib does the rest). Takes a
 * reviewed test-plan draft from Shared Documents/Test Plan Drafts (or
 * a dry run's workDir copy) and builds a .docx the PE can finalize in
 * Word — closing the "docx handoff" follow-on queued in
 * `testplangen/TestPlanGen_Setup.md` WITHOUT the premium Word
 * connector or a OneDrive convert-file step it deferred over
 * (component record: `testplangen/CHANGES.md` v2.19, plan phase 4).
 *
 *   node local/draft2docx.mjs <draft.md> [more.md ...] [-o out.docx]
 *
 * Each input converts to a sibling .docx (same name); `-o` names the
 * output for a SINGLE input. The conversion is shape-preserving for
 * the draft dialect the prompt emits (and only that dialect — this is
 * not a general markdown converter):
 *
 *   #/##/###             -> Heading 1/2/3 (real Word heading styles,
 *                           so the navigation pane shows the plan's
 *                           structure and TC cases)
 *   - [ ] / - [x] items  -> checkbox glyphs (U+2610/U+2611) in List
 *                           Paragraph style — the draft's task-list
 *                           numbering is part of the item text, so it
 *                           survives verbatim
 *   - / * bullets        -> bulleted List Paragraph
 *   > [!WARNING] etc.    -> a bold alert label + the quote lines as
 *                           Quote style (the banner and the CAUTION
 *                           alert stay visually distinct)
 *   GFM tables           -> real Word tables (header row bold, plain
 *                           borders) — Coverage Map, Source Case
 *                           Sweep, the Overview row, Issue Trace
 *   **bold**             -> bold runs (Expected Result / Trace labels)
 *   <!-- comments -->    -> dropped (the machine banner and verify
 *                           stamps have no place in the document of
 *                           record)
 *   wrapped prose lines  -> joined into one paragraph
 *
 * The output is a fresh, unstyled-template document — the PE applies
 * the team template on top (or pastes into it); what this saves is
 * the retyping, not the branding.
 */

import fs from "node:fs";
import path from "node:path";
import { deflateRawSync } from "node:zlib";

// ----------------------------------------------------------- markdown

const cells = (row) =>
  row.trim().replace(/^\|+|\|+$/g, "").split("|").map((c) => c.trim());

/** Parse the draft dialect into a flat block list. */
function parseBlocks(md) {
  // drop HTML comments first (single- or multi-line, non-greedy)
  const text = String(md).replace(/<!--[\s\S]*?-->/g, "");
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let para = [];
  const flushPara = () => {
    if (para.length) blocks.push({ kind: "p", text: para.join(" ") });
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (t === "") {
      flushPara();
      continue;
    }
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
        if (!/^\|[\s\-|:]+\|$/.test(r)) rows.push(cells(r)); // skip separators
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
      // wrapped quote lines join into one paragraph per sentence flow
      blocks.push({ kind: "alert", label, text: quote.join(" ").trim() });
      continue;
    }
    m = /^- \[( |x)\] (.*)$/.exec(t);
    if (m) {
      flushPara();
      // a wrapped task item continues on indented lines
      let item = m[2];
      while (
        i + 1 < lines.length &&
        /^\s{2,}\S/.test(lines[i + 1]) &&
        !/^\s*- /.test(lines[i + 1]) &&
        !lines[i + 1].trim().startsWith("|")
      ) {
        item += " " + lines[++i].trim();
      }
      blocks.push({ kind: "task", checked: m[1] === "x", text: item });
      continue;
    }
    m = /^[-*] (.*)$/.exec(t);
    if (m) {
      flushPara();
      let item = m[1];
      while (
        i + 1 < lines.length &&
        /^\s{2,}\S/.test(lines[i + 1]) &&
        !/^\s*[-*] /.test(lines[i + 1]) &&
        !lines[i + 1].trim().startsWith("|")
      ) {
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

// ---------------------------------------------------------------- xml

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** **bold** spans -> runs; an unbalanced ** stays literal text. */
function inlineRuns(text, forceBold = false) {
  const parts = String(text).split("**");
  const runs = [];
  const push = (s, bold) => {
    if (s !== "") {
      runs.push(
        `<w:r><w:rPr>${bold || forceBold ? "<w:b/>" : ""}</w:rPr>` +
        `<w:t xml:space="preserve">${esc(s)}</w:t></w:r>`
      );
    }
  };
  const balanced = parts.length % 2 === 1;
  for (let k = 0; k < parts.length; k++) {
    if (!balanced && k === parts.length - 1) push("**" + parts[k], false);
    else push(parts[k], k % 2 === 1);
  }
  return runs.join("");
}

const para = (runsXml, styleId) =>
  `<w:p><w:pPr>${styleId ? `<w:pStyle w:val="${styleId}"/>` : ""}</w:pPr>${runsXml}</w:p>`;

function tableXml(rows) {
  const nCols = Math.max(...rows.map((r) => r.length));
  const border = (n) => `<w:${n} w:val="single" w:sz="4" w:space="0" w:color="808080"/>`;
  const tr = (row, header) => {
    const tcs = [];
    for (let c = 0; c < nCols; c++) {
      tcs.push(
        `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>` +
        para(inlineRuns(row[c] ?? "", header)) +
        "</w:tc>"
      );
    }
    return `<w:tr>${tcs.join("")}</w:tr>`;
  };
  return (
    "<w:tbl><w:tblPr><w:tblW w:w=\"0\" w:type=\"auto\"/><w:tblBorders>" +
    ["top", "left", "bottom", "right", "insideH", "insideV"].map(border).join("") +
    "</w:tblBorders></w:tblPr><w:tblGrid>" +
    Array.from({ length: nCols }, () => "<w:gridCol/>").join("") +
    "</w:tblGrid>" +
    rows.map((r, idx) => tr(r, idx === 0)).join("") +
    "</w:tbl>" +
    // Word requires a paragraph between a table and whatever follows
    "<w:p/>"
  );
}

function blocksToBody(blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.kind === "h") out.push(para(inlineRuns(b.text), `Heading${b.level}`));
    else if (b.kind === "p") out.push(para(inlineRuns(b.text)));
    else if (b.kind === "task") {
      out.push(para(inlineRuns((b.checked ? "☑ " : "☐ ") + b.text), "ListParagraph"));
    } else if (b.kind === "bullet") {
      out.push(para(inlineRuns("• " + b.text), "ListParagraph"));
    } else if (b.kind === "alert") {
      if (b.label) out.push(para(inlineRuns(b.label, true), "AlertLabel"));
      if (b.text) out.push(para(inlineRuns(b.text), "Quote"));
    } else if (b.kind === "table") out.push(tableXml(b.rows));
  }
  return out.join("");
}

const W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

function documentXml(bodyXml) {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<w:document xmlns:w="${W_NS}"><w:body>${bodyXml}` +
    `<w:sectPr><w:pgSz w:w="12240" w:h="15840"/>` +
    `<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" ` +
    `w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>` +
    `</w:body></w:document>`
  );
}

function stylesXml() {
  const heading = (n, sz) =>
    `<w:style w:type="paragraph" w:styleId="Heading${n}">` +
    `<w:name w:val="heading ${n}"/><w:basedOn w:val="Normal"/><w:qFormat/>` +
    `<w:pPr><w:keepNext/><w:spacing w:before="240" w:after="80"/>` +
    `<w:outlineLvl w:val="${n - 1}"/></w:pPr>` +
    `<w:rPr><w:b/><w:sz w:val="${sz}"/></w:rPr></w:style>`;
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<w:styles xmlns:w="${W_NS}">` +
    `<w:style w:type="paragraph" w:default="1" w:styleId="Normal">` +
    `<w:name w:val="Normal"/><w:qFormat/>` +
    `<w:pPr><w:spacing w:after="120"/></w:pPr>` +
    `<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:style>` +
    heading(1, 32) + heading(2, 26) + heading(3, 24) +
    `<w:style w:type="paragraph" w:styleId="ListParagraph">` +
    `<w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:qFormat/>` +
    `<w:pPr><w:ind w:left="360"/><w:spacing w:after="40"/></w:pPr></w:style>` +
    `<w:style w:type="paragraph" w:styleId="Quote">` +
    `<w:name w:val="Quote"/><w:basedOn w:val="Normal"/><w:qFormat/>` +
    `<w:pPr><w:ind w:left="360"/></w:pPr><w:rPr><w:i/></w:rPr></w:style>` +
    `<w:style w:type="paragraph" w:styleId="AlertLabel">` +
    `<w:name w:val="Alert Label"/><w:basedOn w:val="Normal"/><w:qFormat/>` +
    `<w:pPr><w:ind w:left="360"/><w:spacing w:after="40"/></w:pPr><w:rPr><w:b/></w:rPr></w:style>` +
    `</w:styles>`
  );
}

function coreXml(title) {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<cp:coreProperties ` +
    `xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ` +
    `xmlns:dc="http://purl.org/dc/elements/1.1/">` +
    `<dc:title>${esc(title)}</dc:title></cp:coreProperties>`
  );
}

const CONTENT_TYPES =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
  `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
  `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
  `<Default Extension="xml" ContentType="application/xml"/>` +
  `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
  `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>` +
  `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>` +
  `</Types>`;

const ROOT_RELS =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
  `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>` +
  `</Relationships>`;

const DOC_RELS =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
  `</Relationships>`;

// ------------------------------------------------------------- zip writer
// (verbatim from svg2pptx v1.3 — the repo's proven OOXML packager)

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

// ----------------------------------------------------------------- api

/** Convert draft markdown to a .docx Buffer. Exported for the gate. */
export function draftToDocx(md) {
  const blocks = parseBlocks(md);
  const h1 = blocks.find((b) => b.kind === "h" && b.level === 1);
  const stats = {
    paragraphs: blocks.filter((b) => b.kind !== "table").length,
    tables: blocks.filter((b) => b.kind === "table").length,
  };
  const buf = zip([
    { name: "[Content_Types].xml", data: Buffer.from(CONTENT_TYPES, "utf8") },
    { name: "_rels/.rels", data: Buffer.from(ROOT_RELS, "utf8") },
    { name: "docProps/core.xml", data: Buffer.from(coreXml(h1 ? h1.text : "Test Plan Draft"), "utf8") },
    { name: "word/document.xml", data: Buffer.from(documentXml(blocksToBody(blocks)), "utf8") },
    { name: "word/_rels/document.xml.rels", data: Buffer.from(DOC_RELS, "utf8") },
    { name: "word/styles.xml", data: Buffer.from(stylesXml(), "utf8") },
  ]);
  return { buf, stats };
}

// ---------------------------------------------------------------- main

function main(argv) {
  const inputs = [];
  let out;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "-o") out = argv[++i];
    else inputs.push(argv[i]);
  }
  if (inputs.length === 0 || (out && inputs.length > 1)) {
    console.error("usage: node local/draft2docx.mjs <draft.md> [more.md ...] [-o out.docx]");
    process.exit(2);
  }
  for (const input of inputs) {
    const md = fs.readFileSync(input, "utf8");
    const { buf, stats } = draftToDocx(md);
    const target = out || input.replace(/\.md$/i, "") + ".docx";
    fs.writeFileSync(target, buf);
    console.log(`wrote ${target} (${stats.paragraphs} paragraphs, ${stats.tables} tables)`);
  }
}

// run only as a CLI, never on import (the gate imports draftToDocx)
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main(process.argv.slice(2));
}
