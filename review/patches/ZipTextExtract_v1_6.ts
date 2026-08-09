/**
 * ZipTextExtract v1.6 — OOXML file (pptx/docx) → plain text + rels, one call
 * --------------------------------------------------------------------
 * !!! GATED PATCH — DO NOT PASTE INTO PRODUCTION UNTIL VERIFIED !!!
 * v1.6 is v1.5 with typed-array plumbing only (performance, F7 in the
 * review). No parsing, regex, or strip-recipe change of any kind — the
 * output is byte-identical by construction. Per the extraction bar,
 * verify before pasting:
 *   1. Run v1.5 and v1.6 over the full reference set (same zipBase64,
 *      same mediaPrefix per file).
 *   2. Diff text/rels/parts/kind/media between versions per file:
 *      any difference at all = STOP, do not paste, report.
 *   3. Equality subsumes the recall bar (>=0.97 docx / 1.000 pptx);
 *      run the token-recall harness anyway as the standing check.
 *   4. Time both versions on the largest reference deck (~3.5 MB) to
 *      confirm the headroom gain against the 120 s Run-script limit.
 *
 * What changed vs v1.5 (all ES2017 / Office-Scripts-safe, no imports):
 *   - b64ToBytes: Uint8Array output + Int32Array charCode table
 *     (was: per-char dictionary lookup building a number[]).
 *   - inflateRaw: output preallocated from the central directory's
 *     uncompSize (the previously-unused outHint), doubling growth
 *     fallback, write pointer (was: number[].push per byte).
 *   - extractEntry: subarray view (was: slice copy).
 *   - utf8ToString: chunked String.fromCharCode (was: per-char concat).
 * Everything below the plumbing is v1.5 verbatim.
 * --------------------------------------------------------------------
 * Takes the document's raw bytes as base64 (Get file content $content),
 * parses the zip structure itself, inflates ONLY the parts that matter,
 * applies the validated OOXML strip recipe (markdown-flavored:
 * ## Slide/Notes headers, tables as fenced TSV blocks), and returns:
 *
 *   { text, rels, parts, kind }
 *
 * pptx: ppt/slides/slideN.xml (numeric order) + ppt/slides/_rels/*.rels
 * docx: word/document.xml + word/_rels/document.xml.rels
 * Format auto-detected from entry names.
 *
 * Power Automate wiring: unchanged from v1.5 (same name, signature and
 * return shape — the flow's Run-script bindings are untouched).
 * Throws on malformed archives so failed parses surface as run errors
 * (Catch scope -> IndexStatus=Error -> retry-aware gate), never as
 * silently empty text.
 */
interface ZipTextResult {
  text: string;
  rels: string;
  parts: number;
  kind: string; // "pptx" | "docx" | "unknown"
  media: string; // newline list of raster media entry basenames
}

function main(workbook: ExcelScript.Workbook, zipBase64: string, mediaPrefix?: string): ZipTextResult {
  const bytes = b64ToBytes(zipBase64);
  const entries = readCentralDirectory(bytes);

  const isPptx = entries.some((e) => e.name.indexOf("ppt/") === 0);
  const isDocx = entries.some((e) => e.name === "word/document.xml");
  const kind = isPptx ? "pptx" : isDocx ? "docx" : "unknown";

  let contentNames: ZipEntry[] = [];
  let relsNames: ZipEntry[] = [];
  if (isPptx) {
    const slides = entries
      .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.name))
      .sort((a, b) => slideNum(a.name) - slideNum(b.name));
    const notes = entries
      .filter((e) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(e.name))
      .sort((a, b) => slideNum(a.name) - slideNum(b.name));
    contentNames = slides.concat(notes);
    relsNames = entries.filter((e) => /^ppt\/slides\/_rels\/[^/]+\.rels$/.test(e.name));
  } else if (isDocx) {
    contentNames = entries.filter((e) => e.name === "word/document.xml");
    relsNames = entries.filter((e) => e.name === "word/_rels/document.xml.rels");
  } else {
    throw new Error("ZipTextExtract: archive is neither pptx nor docx");
  }

  const prefix = mediaPrefix || "";
  const relParts: string[] = [];
  const relText: { [slide: string]: string } = {};
  for (const e of relsNames) {
    const t = utf8ToString(extractEntry(bytes, e));
    relParts.push(t);
    relText[e.name] = t;
  }

  const mediaSet: { [n: string]: boolean } = {};
  function slideImages(slideName: string, xml: string): string {
    // find r:embed ids in the slide, resolve via its rels to ../media targets
    const relName = isPptx
      ? slideName.replace(/^ppt\/slides\//, "ppt/slides/_rels/") + ".rels"
      : "word/_rels/document.xml.rels";
    const rels = relText[relName] || "";
    const idToMedia: { [id: string]: string } = {};
    const rre = /Id="([^"]+)"[^>]*Target="[^"]*media\/([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = rre.exec(rels)) !== null) idToMedia[m[1]] = m[2];
    const links: string[] = [];
    const bre = /r:embed="([^"]+)"/g;
    while ((m = bre.exec(xml)) !== null) {
      const f = idToMedia[m[1]];
      if (f && /\.(png|jpe?g|gif|bmp)$/i.test(f) && !links.some((l) => l.indexOf("(" + prefix + f + ")") >= 0)) {
        links.push("![" + f + "](" + prefix + f + ")");
        mediaSet[f] = true;
      }
    }
    return links.length > 0 ? "\n" + links.join(" ") + "\n" : "";
  }

  const xmlParts: string[] = [];
  for (const e of contentNames) {
    const xml = utf8ToString(extractEntry(bytes, e));
    const imgs = prefix ? slideImages(e.name, xml) : "";
    if (isPptx) {
      const label = e.name.indexOf("notesSlide") >= 0 ? "Notes" : "Slide";
      xmlParts.push("\n## " + label + " " + slideNum(e.name) + "\n" + xml + imgs);
    } else {
      xmlParts.push(xml + imgs);
    }
  }

  const mediaNames: string[] = [];
  for (const k in mediaSet) mediaNames.push(k);
  return {
    text: stripOoxml(xmlParts.join("\n")),
    rels: relParts.join("\n"),
    parts: contentNames.length + relsNames.length,
    kind: kind,
    media: mediaNames.join("\n"),
  };
}

function slideNum(name: string): number {
  const m = name.match(/[sS]lide(\d+)\.xml$/);
  return m ? parseInt(m[1], 10) : 0;
}

// ------------------------------------------------------------ strip recipe
// Validated 98%+ token recall on real LRS docs; v1.3 renders tables as
// tab-separated rows (matching WorkbookDump) before the generic strip.
function renderTables(xml: string, ns: string): string {
  // innermost-first so nested tables flatten correctly
  const inner = new RegExp("<" + ns + ":tbl\\b(?:(?!<" + ns + ":tbl\\b)[\\s\\S])*?</" + ns + ":tbl>");
  let t = xml;
  let guard = 0;
  while (inner.test(t) && guard++ < 200) {
    t = t.replace(inner, (tbl) => {
      const rows = tbl.split(new RegExp("<" + ns + ":tr\\b"));
      const grid: string[][] = [];
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split(new RegExp("<" + ns + ":tc\\b"));
        const line: string[] = [];
        for (let j = 1; j < cells.length; j++) {
          const raw = cells[j];
          const opener = (raw.match(/^[^>]*/) || [""])[0];
          let span = 1;
          const gs = opener.match(/gridSpan="(\d+)"/) ||
                     raw.match(new RegExp("<" + ns + ':gridSpan [^>]*val="(\\d+)"'));
          if (gs) span = parseInt(gs[1], 10);
          const c = raw
            .replace(/^[^>]*>/, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\|/g, "\\|")          // escape pipes for markdown
            .replace(/\s+/g, " ")
            .trim();
          line.push(c);
          for (let s = 1; s < span; s++) line.push("");  // pad merged columns
        }
        if (line.length > 0) grid.push(line);
      }
      if (grid.length === 0) return "\n";
      const width = Math.max.apply(null, grid.map((r) => r.length));
      const md: string[] = [];
      for (let i = 0; i < grid.length; i++) {
        const r = grid[i].slice();
        while (r.length < width) r.push("");
        md.push("| " + r.join(" | ") + " |");
        if (i === 0) {
          const sep: string[] = [];
          for (let k = 0; k < width; k++) sep.push("---");
          md.push("| " + sep.join(" | ") + " |");
        }
      }
      return "\n\n" + md.join("\n") + "\n\n";
    });
  }
  return t;
}

function stripOoxml(xml: string): string {
  let t = xml;
  // kill duplicate renderings: AlternateContent serves Choice AND Fallback
  t = t.replace(/<mc:Fallback>[\s\S]*?<\/mc:Fallback>/g, "");
  // group docx inline-drawing labels into single [figure: ...] lines
  t = t.replace(/<w:drawing\b[\s\S]*?<\/w:drawing>/g, (d) => {
    const labels: string[] = [];
    const tre = /<a:t>([^<]*)<\/a:t>|<w:t\b[^>]*>([^<]*)<\/w:t>/g;
    let m: RegExpExecArray | null;
    while ((m = tre.exec(d)) !== null) {
      const v = (m[1] || m[2] || "").trim();
      if (v) labels.push(v);
    }
    const keep = d.match(/!\[[^\]]*\]\([^)]*\)/g) || [];
    return (labels.length > 0 ? "\n[figure: " + labels.join(" · ") + "]\n" : "") + keep.join(" ");
  });
  t = renderTables(t, "w");
  t = renderTables(t, "a");
  t = t.replace(/<\/w:p>|<\/w:tc>|<\/a:p>|<w:br\b[^>]*>|<w:cr\b[^>]*>|<a:br\b[^>]*>/g, "\n");
  t = t.replace(/<w:tab\/>/g, "\t");
  t = t.replace(/<[^>]+>/g, "");
  t = t.replace(/&#x([0-9a-fA-F]+);/g, (_m, h: string) => String.fromCharCode(parseInt(h, 16)));
  t = t.replace(/&#(\d+);/g, (_m, d: string) => String.fromCharCode(parseInt(d, 10)));
  t = t
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  // v1.2 cleanups:
  // - normalize CR (decoded &#13;) to LF
  t = t.replace(/\r\n?/g, "\n");
  // - unwrap Word field codes: HYPERLINK "url" [\o "tooltip"] -> url
  t = t.replace(/\bHYPERLINK\s+"([^"]+)"/g, "$1");
  t = t.replace(/\\[olt]\s+"[^"]*"/g, "");
  // - strip glued drawing-geometry digit runs (posOffset etc.); no real
  //   content is a 10+ digit run (issue ids <=6, dates/measures shorter)
  t = t.replace(/\d{10,}/g, "");
  t = t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

// ------------------------------------------------------------ base64
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
    const method = u16(b, p + 10);
    const compSize = u32(b, p + 20);
    const uncompSize = u32(b, p + 24);
    const nameLen = u16(b, p + 28);
    const extraLen = u16(b, p + 30);
    const commentLen = u16(b, p + 32);
    const localOffset = u32(b, p + 42);
    let name = "";
    for (let k = 0; k < nameLen; k++) name += String.fromCharCode(b[p + 46 + k]);
    entries.push({ name: name, method: method, compSize: compSize, uncompSize: uncompSize, localOffset: localOffset });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function extractEntry(b: Uint8Array, e: ZipEntry): Uint8Array {
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
      pos += 4; // skip LEN + NLEN
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
