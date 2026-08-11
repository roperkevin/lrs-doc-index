/**
 * MediaExtract v1.2 — pull raster images out of a pptx/docx, bounded
 * ------------------------------------------------------------
 * !!! GATED PATCH — DO NOT PASTE UNTIL review/harness check_batch.py
 * PASSES (it byte-diffs v1.1 vs v1.2 on the media fixtures and
 * exercises the new throw paths) !!!
 *
 * v1.2 = v1.1 + the REVIEW_v2_5 batch (SC-8, SC-11, SC-14). Output on
 * every valid archive is byte-identical to v1.1 — the changes are
 * throw paths and error text only:
 *
 *   SC-11 error messages now say "MediaExtract:" (v1.0/v1.1 said
 *         "ZipTextExtract:", sending Error-row triage to the wrong
 *         script).
 *   SC-14 encrypted zip entries (GP bit 0) throw instead of returning
 *         ciphertext as image bytes.
 *   SC-8  truncated stored blocks throw instead of zero-padding
 *         silently (matches ZipTextExtract v1.9).
 *
 * v1.1 = v1.0 with typed-array plumbing only (performance, F7 in
 * the v1.9 review): same shared zip/inflate changes as ZipTextExtract
 * v1.6, plus chunked base64 encoding in bytesToB64.
 * ------------------------------------------------------------
 * Companion to ZipTextExtract. Takes the same base64 file content,
 * returns raster media entries (png/jpg/jpeg/gif/bmp) as base64 so
 * the flow can save them next to the markdown sidecar:
 *
 *   { images: [{ name, b64 }], skipped: "names...", count }
 *
 * Bounded hard so the Run-script response stays under the payload
 * cap: max 12 images, 350 KB each, ~3 MB total. Oversized or
 * overflow entries land in `skipped` (still listed, never silently
 * lost). Vector/emf media is ignored — raster only.
 */
interface ExtractedImg { name: string; b64: string; }
interface MediaResult { images: ExtractedImg[]; skipped: string; count: number; }

const MAX_IMAGES = 12;
const MAX_ONE = 350 * 1024;
const MAX_TOTAL = 3 * 1024 * 1024;

function main(workbook: ExcelScript.Workbook, zipBase64: string): MediaResult {
  const bytes = b64ToBytes(zipBase64);
  const entries = readCentralDirectory(bytes);
  const media = entries.filter((e) =>
    /^(ppt|word)\/media\/[^/]+\.(png|jpe?g|gif|bmp)$/i.test(e.name));
  const images: ExtractedImg[] = [];
  const skipped: string[] = [];
  let total = 0;
  for (const e of media) {
    const base = e.name.replace(/^.*\//, "");
    if (images.length >= MAX_IMAGES || e.uncompSize > MAX_ONE || total + e.uncompSize > MAX_TOTAL) {
      skipped.push(base);
      continue;
    }
    const data = extractEntry(bytes, e);
    images.push({ name: base, b64: bytesToB64(data) });
    total += data.length;
  }
  return { images: images, skipped: skipped.join("\n"), count: images.length };
}

// v1.1: chunked assembly (join at the end) instead of one growing string.
function bytesToB64(b: Uint8Array): string {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const parts: string[] = [];
  let chunk = "";
  for (let i = 0; i < b.length; i += 3) {
    const n = (b[i] << 16) | ((b[i + 1] || 0) << 8) | (b[i + 2] || 0);
    chunk += alpha[(n >> 18) & 63] + alpha[(n >> 12) & 63] +
             (i + 1 < b.length ? alpha[(n >> 6) & 63] : "=") +
             (i + 2 < b.length ? alpha[n & 63] : "=");
    if (chunk.length >= 8192) { parts.push(chunk); chunk = ""; }
  }
  parts.push(chunk);
  return parts.join("");
}

// ------------------------------------------------------------ base64
// v1.1: Uint8Array + charCode table. Skips '=', CR/LF and any
// non-alphabet char exactly as v1.0's dictionary miss did.
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
  flags: number; // v1.2 (SC-14): general-purpose bit flags
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
  if (eocd < 0) throw new Error("MediaExtract: EOCD not found (not a zip?)");
  const count = u16(b, eocd + 10);
  let p = u32(b, eocd + 16); // central directory offset
  const entries: ZipEntry[] = [];
  for (let i = 0; i < count; i++) {
    if (u32(b, p) !== 0x02014b50) throw new Error("MediaExtract: bad central header at " + p);
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
  // v1.2 (SC-14): never return ciphertext as image bytes
  if ((e.flags & 0x1) !== 0) throw new Error("MediaExtract: encrypted entry " + e.name);
  const p = e.localOffset;
  if (u32(b, p) !== 0x04034b50) throw new Error("MediaExtract: bad local header for " + e.name);
  const nameLen = u16(b, p + 26);
  const extraLen = u16(b, p + 28); // local extra can differ from central
  const dataStart = p + 30 + nameLen + extraLen;
  const data = b.subarray(dataStart, dataStart + e.compSize); // v1.1: view, no copy
  if (e.method === 0) return data;                    // stored
  if (e.method === 8) return inflateRaw(data, e.uncompSize); // deflate
  throw new Error("MediaExtract: unsupported compression method " + e.method + " for " + e.name);
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

// v1.1: output preallocated from outHint (central-directory uncompSize),
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
      // v1.2 (SC-8): throw on truncation instead of zero-padding
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
