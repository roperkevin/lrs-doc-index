/**
 * xlsx_grid.mjs v1.0 — xlsx bytes -> per-sheet text grids for the
 * WorkbookDump.ts workbook mock (same shape as
 * review/harness/wrap_workbook.py: name + rectangular getTexts grid,
 * trimmed to the used range).
 *
 * Parity notes vs Excel's Range.getTexts():
 *  - formula cells yield their CACHED value (the last value Excel
 *    saved), same as what the Excel connector sees for a closed file;
 *  - date-formatted numbers render as m/d/yyyy (+ " h:mm" when the
 *    serial has a time part); Excel would apply the cell's exact
 *    number format, so exotic formats may differ in rendering while
 *    carrying the same content;
 *  - other numbers render like Excel "General" (via JS number
 *    stringification), booleans as TRUE/FALSE, errors as their code.
 *
 * Pure stdlib (node:zlib inflateRawSync); no dependencies.
 */

import zlib from "node:zlib";

// ---- minimal zip reader (central directory + local headers) ---------

function readZip(buf) {
  // find End Of Central Directory (scan back over the trailing comment)
  let eocd = -1;
  const min = Math.max(0, buf.length - 65557);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("xlsx: no zip end-of-central-directory");
  const count = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  const entries = {};
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) throw new Error("xlsx: bad central directory");
    const method = buf.readUInt16LE(off + 10);
    const compSize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const localOff = buf.readUInt32LE(off + 42);
    const name = buf.toString("utf8", off + 46, off + 46 + nameLen);
    entries[name] = { method, compSize, localOff };
    off += 46 + nameLen + extraLen + commentLen;
  }
  return {
    read(name) {
      const e = entries[name];
      if (!e) return null;
      // local header: sizes/lengths may be zeroed there, trust the
      // central directory (same stance as the scripts' zip reader)
      const lo = e.localOff;
      if (buf.readUInt32LE(lo) !== 0x04034b50) throw new Error("xlsx: bad local header");
      const nameLen = buf.readUInt16LE(lo + 26);
      const extraLen = buf.readUInt16LE(lo + 28);
      const start = lo + 30 + nameLen + extraLen;
      const raw = buf.subarray(start, start + e.compSize);
      if (e.method === 0) return raw.toString("utf8");
      if (e.method === 8) return zlib.inflateRawSync(raw).toString("utf8");
      throw new Error("xlsx: unsupported compression method " + e.method);
    },
    names: () => Object.keys(entries),
  };
}

// ---- tiny xml helpers (regex-scoped, like the scripts themselves) ---

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function attr(tag, name) {
  const m = tag.match(new RegExp('(?:^|\\s)' + name + '="([^"]*)"'));
  return m ? decodeEntities(m[1]) : "";
}

// concatenated <t> runs inside one <si>/<is> block
function textRuns(xml) {
  let out = "";
  const re = /<t(?:\s[^>]*)?>([\s\S]*?)<\/t>|<t(?:\s[^>]*)?\/>/g;
  let m;
  while ((m = re.exec(xml)) !== null) out += m[1] === undefined ? "" : decodeEntities(m[1]);
  return out;
}

// ---- number formatting ----------------------------------------------

const BUILTIN_DATE_FMT = new Set([
  14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  45, 46, 47, 50, 51, 52, 53, 54, 55, 56, 57, 58,
]);

function isDateFormatCode(code) {
  // strip quoted literals, [] sections and escapes, then look for
  // date/time tokens
  const bare = code.replace(/"[^"]*"/g, "").replace(/\[[^\]]*\]/g, "").replace(/\\./g, "");
  return /[ymdhs]/i.test(bare) && !/#|0/.test(bare.replace(/AM\/PM/gi, ""));
}

function serialToText(serial) {
  // Excel epoch 1899-12-30 absorbs the 1900 leap-year bug for
  // serials >= 61 (the corpus' dates)
  const ms = Math.round((serial - 25569) * 86400000);
  const d = new Date(ms);
  if (isNaN(d.getTime())) return String(serial);
  const date =
    d.getUTCMonth() + 1 + "/" + d.getUTCDate() + "/" + d.getUTCFullYear();
  const frac = serial % 1;
  if (frac > 1e-9 && 1 - frac > 1e-9) {
    const hh = d.getUTCHours();
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    return serial < 1 ? hh + ":" + mm : date + " " + hh + ":" + mm;
  }
  return date;
}

function numberToText(v) {
  const n = Number(v);
  if (!isFinite(n)) return String(v);
  return String(n);
}

// ---- sheet parsing --------------------------------------------------

function colIndex(ref) {
  let c = 0;
  for (let i = 0; i < ref.length; i++) {
    const ch = ref.charCodeAt(i);
    if (ch < 65 || ch > 90) break;
    c = c * 26 + (ch - 64);
  }
  return c - 1;
}

function parseSheet(xml, shared, dateStyle) {
  const cells = []; // {row, col, text}
  let maxRow = -1;
  let maxCol = -1;
  const rowRe = /<row(?:\s[^>]*)?>([\s\S]*?)<\/row>|<row(?:\s[^>]*)?\/>/g;
  let rowM;
  let rowSeq = -1;
  while ((rowM = rowRe.exec(xml)) !== null) {
    const rowTag = rowM[0].slice(0, rowM[0].indexOf(">") + 1);
    const rAttr = attr(rowTag, "r");
    const row = rAttr ? parseInt(rAttr, 10) - 1 : rowSeq + 1;
    rowSeq = row;
    const body = rowM[1] || "";
    const cellRe = /<c(?:\s[^>]*)?>([\s\S]*?)<\/c>|<c(?:\s[^>]*)?\/>/g;
    let cellM;
    let colSeq = -1;
    while ((cellM = cellRe.exec(body)) !== null) {
      const cTag = cellM[0].slice(0, cellM[0].indexOf(">") + 1);
      const ref = attr(cTag, "r");
      const col = ref ? colIndex(ref) : colSeq + 1;
      colSeq = col;
      const t = attr(cTag, "t") || "n";
      const s = attr(cTag, "s");
      const inner = cellM[1] || "";
      let text = "";
      if (t === "inlineStr") {
        text = textRuns(inner);
      } else {
        const vM = inner.match(/<v(?:\s[^>]*)?>([\s\S]*?)<\/v>/);
        const v = vM ? decodeEntities(vM[1]) : "";
        if (v === "") text = "";
        else if (t === "s") text = shared[parseInt(v, 10)] ?? "";
        else if (t === "str") text = v;
        else if (t === "b") text = v === "1" ? "TRUE" : "FALSE";
        else if (t === "e") text = v;
        else text = dateStyle[s] ? serialToText(Number(v)) : numberToText(v);
      }
      if (text !== "") {
        cells.push({ row, col, text });
        if (row > maxRow) maxRow = row;
        if (col > maxCol) maxCol = col;
      }
    }
  }
  if (maxRow < 0) return [];
  // rectangular grid, then trim empty leading rows/cols the way
  // Excel's used range does
  const grid = Array.from({ length: maxRow + 1 }, () => new Array(maxCol + 1).fill(""));
  for (const c of cells) grid[c.row][c.col] = c.text;
  let firstRow = 0;
  while (firstRow < grid.length && grid[firstRow].every((x) => x === "")) firstRow++;
  let firstCol = 0;
  while (firstCol <= maxCol && grid.every((r) => r[firstCol] === "")) firstCol++;
  return grid.slice(firstRow).map((r) => r.slice(firstCol));
}

// ---- entry point ----------------------------------------------------

export function xlsxToGrids(buf) {
  const zip = readZip(buf);
  const wbXml = zip.read("xl/workbook.xml");
  if (!wbXml) throw new Error("xlsx: no xl/workbook.xml (not an xlsx?)");

  // shared strings
  const shared = [];
  const ssXml = zip.read("xl/sharedStrings.xml");
  if (ssXml) {
    const siRe = /<si(?:\s[^>]*)?>([\s\S]*?)<\/si>/g;
    let m;
    while ((m = siRe.exec(ssXml)) !== null) shared.push(textRuns(m[1]));
  }

  // styles: which cellXf indexes carry a date number format
  const dateStyle = {};
  const stXml = zip.read("xl/styles.xml");
  if (stXml) {
    const custom = {};
    const fmtRe = /<numFmt(?:\s[^>]*)?\/>|<numFmt(?:\s[^>]*)?>[\s\S]*?<\/numFmt>/g;
    let m;
    while ((m = fmtRe.exec(stXml)) !== null) {
      const id = parseInt(attr(m[0], "numFmtId"), 10);
      custom[id] = isDateFormatCode(attr(m[0], "formatCode"));
    }
    const xfsBlock = stXml.match(/<cellXfs(?:\s[^>]*)?>([\s\S]*?)<\/cellXfs>/);
    if (xfsBlock) {
      const xfRe = /<xf(?:\s[^>]*)?\/>|<xf(?:\s[^>]*)?>[\s\S]*?<\/xf>/g;
      let i = 0;
      let xm;
      while ((xm = xfRe.exec(xfsBlock[1])) !== null) {
        const id = parseInt(attr(xm[0], "numFmtId") || "0", 10);
        dateStyle[String(i)] = BUILTIN_DATE_FMT.has(id) || custom[id] === true;
        i++;
      }
    }
  }

  // sheet order + rel targets
  const rels = {};
  const relXml = zip.read("xl/_rels/workbook.xml.rels");
  if (relXml) {
    const rRe = /<Relationship(?:\s[^>]*)?\/>/g;
    let m;
    while ((m = rRe.exec(relXml)) !== null) {
      let target = attr(m[0], "Target");
      if (target.startsWith("/")) target = target.slice(1);
      else target = "xl/" + target.replace(/^\.\//, "");
      rels[attr(m[0], "Id")] = target;
    }
  }

  const sheets = [];
  const shRe = /<sheet(?:\s[^>]*)?\/>/g;
  let m;
  let idx = 0;
  while ((m = shRe.exec(wbXml)) !== null) {
    idx++;
    const name = attr(m[0], "name") || "Sheet" + idx;
    const rid = attr(m[0], "r:id") || attr(m[0], "d3p1:id");
    const target = (rid && rels[rid]) || "xl/worksheets/sheet" + idx + ".xml";
    const xml = zip.read(target);
    sheets.push({ name, grid: xml ? parseSheet(xml, shared, dateStyle) : [] });
  }
  if (sheets.length === 0) throw new Error("xlsx: workbook has no sheets");
  return sheets;
}
