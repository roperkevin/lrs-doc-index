/**
 * msg.mjs v1.0 (sweep v1.37) — Outlook .msg → text, zero dependencies.
 * The last KNOWN_EXT still parked in the Skip lane gets its lane.
 *
 * A .msg file is a CFB (Compound File Binary / OLE2) container whose
 * streams carry MAPI properties. This module implements the minimal
 * honest subset: a CFB reader (v3 and v4 sector sizes, FAT + DIFAT +
 * miniFAT chains, the directory's red-black tree walked from the
 * root so ONLY top-level message streams are read — recipient and
 * attachment sub-storages have their own identically-named streams
 * that must not bleed into the message body), and the MAPI string
 * properties a sidecar needs:
 *
 *   0037 subject         0C1A sender name      0E04 display-to
 *   0E03 display-cc      1000 body             007D transport headers
 *
 * each accepted as PT_UNICODE (001F, UTF-16LE) or PT_STRING8 (001E).
 * The sent date comes from the fixed-size property stream
 * (__properties_version1.0: client-submit 0x0039 or delivery 0x0E06,
 * FILETIME) with the transport headers' "Date:" line as fallback.
 *
 * Exports:
 *   parseMsg(buf)  → {subject, from, to, cc, date, body, headers}
 *   msgToMarkdown(m, fileName) → the sidecar body text
 */

// ---- CFB reader -----------------------------------------------------

const ENDOFCHAIN = 0xfffffffe;
const FREESECT = 0xffffffff;
const MAX_SECTS = 1 << 20; // chain-walk guard against corrupt FATs

function readCfb(buf) {
  if (buf.length < 512 || buf.readUInt32LE(0) !== 0xe011cfd0 || buf.readUInt32LE(4) !== 0xe11ab1a1) {
    throw new Error("not a CFB/OLE2 file (bad signature)");
  }
  const sectorShift = buf.readUInt16LE(30);
  const sectorSize = 1 << sectorShift; // 512 (v3) or 4096 (v4)
  const miniSize = 1 << buf.readUInt16LE(32); // 64
  const numFat = buf.readUInt32LE(44);
  const firstDir = buf.readUInt32LE(48);
  const miniCutoff = buf.readUInt32LE(56);
  const firstMiniFat = buf.readUInt32LE(60);
  const numMiniFat = buf.readUInt32LE(64);
  const firstDifat = buf.readUInt32LE(68);
  const numDifat = buf.readUInt32LE(72);

  const sectorAt = (n) => 512 + n * sectorSize;
  const sectorBuf = (n) => buf.subarray(sectorAt(n), sectorAt(n) + sectorSize);

  // FAT sector list: 109 entries in the header DIFAT, then DIFAT sectors
  const fatSectors = [];
  for (let i = 0; i < 109 && fatSectors.length < numFat; i++) {
    const s = buf.readUInt32LE(76 + i * 4);
    if (s !== FREESECT) fatSectors.push(s);
  }
  let difat = firstDifat;
  for (let d = 0; d < numDifat && difat !== ENDOFCHAIN && difat !== FREESECT; d++) {
    const sb = sectorBuf(difat);
    const per = sectorSize / 4 - 1;
    for (let i = 0; i < per && fatSectors.length < numFat; i++) {
      const s = sb.readUInt32LE(i * 4);
      if (s !== FREESECT) fatSectors.push(s);
    }
    difat = sb.readUInt32LE(sectorSize - 4);
  }

  const entriesPerFat = sectorSize / 4;
  const fat = (sect) => {
    const fs = fatSectors[Math.floor(sect / entriesPerFat)];
    if (fs === undefined) return ENDOFCHAIN;
    return sectorBuf(fs).readUInt32LE((sect % entriesPerFat) * 4);
  };

  /** Concatenate a FAT chain, clipped to size. */
  const readChain = (start, size) => {
    const out = Buffer.alloc(size);
    let sect = start;
    let off = 0;
    for (let guard = 0; sect !== ENDOFCHAIN && sect !== FREESECT && off < size; guard++) {
      if (guard > MAX_SECTS) throw new Error("CFB: FAT chain loop");
      const chunk = sectorBuf(sect);
      chunk.copy(out, off, 0, Math.min(sectorSize, size - off));
      off += sectorSize;
      sect = fat(sect);
    }
    return out;
  };

  // directory entries (v3 headers don't state the directory size —
  // walk its chain first to learn it)
  let dirSectors = 0;
  for (let sect = firstDir, guard = 0; sect !== ENDOFCHAIN && sect !== FREESECT; guard++) {
    if (guard > MAX_SECTS) throw new Error("CFB: directory chain loop");
    dirSectors++;
    sect = fat(sect);
  }
  const dirBuf = readChain(firstDir, dirSectors * sectorSize);
  const entries = [];
  for (let off = 0; off + 128 <= dirBuf.length; off += 128) {
    const nameLen = dirBuf.readUInt16LE(off + 64);
    const type = dirBuf[off + 66];
    if (type === 0 || nameLen < 2) {
      entries.push(null);
      continue;
    }
    entries.push({
      name: dirBuf.toString("utf16le", off, off + Math.min(nameLen - 2, 62)),
      type, // 1 storage, 2 stream, 5 root
      left: dirBuf.readInt32LE(off + 68),
      right: dirBuf.readInt32LE(off + 72),
      child: dirBuf.readInt32LE(off + 76),
      start: dirBuf.readUInt32LE(off + 116),
      size: dirBuf.readUInt32LE(off + 120), // low 32 bits — .msg streams are small
    });
  }
  const root = entries[0];
  if (!root || root.type !== 5) throw new Error("CFB: no root entry");

  // mini FAT + mini stream (the root entry's own chain)
  const miniFat = numMiniFat > 0 ? readChain(firstMiniFat, numMiniFat * sectorSize) : Buffer.alloc(0);
  const miniStream = root.size > 0 ? readChain(root.start, root.size) : Buffer.alloc(0);
  const readMiniChain = (start, size) => {
    const out = Buffer.alloc(size);
    let sect = start;
    let off = 0;
    for (let guard = 0; sect !== ENDOFCHAIN && sect !== FREESECT && off < size; guard++) {
      if (guard > MAX_SECTS) throw new Error("CFB: miniFAT chain loop");
      miniStream.copy(out, off, sect * miniSize, Math.min((sect + 1) * miniSize, sect * miniSize + (size - off)));
      off += miniSize;
      sect = sect * 4 + 4 <= miniFat.length ? miniFat.readUInt32LE(sect * 4) : ENDOFCHAIN;
    }
    return out;
  };

  const readStream = (e) =>
    e.size === 0
      ? Buffer.alloc(0)
      : e.size < miniCutoff
        ? readMiniChain(e.start, e.size)
        : readChain(e.start, e.size);

  // walk each storage's sibling tree so streams keep their PARENT —
  // an attachment's __substg1.0_1000001F must not become the body
  const topLevel = new Map(); // name -> entry (direct children of root)
  const walk = (id, into) => {
    if (id < 0 || id >= entries.length) return;
    const e = entries[id];
    if (!e) return;
    walk(e.left, into);
    if (!into.has(e.name)) into.set(e.name, e);
    walk(e.right, into);
  };
  walk(root.child, topLevel);
  return { topLevel, readStream };
}

// ---- MAPI properties ------------------------------------------------

const decode = (name, data) =>
  name.endsWith("001F")
    ? data.toString("utf16le").replace(/\0+$/, "")
    : data.toString("latin1").replace(/\0+$/, "");

function stringProp(cfb, propId) {
  for (const t of ["001F", "001E"]) {
    const name = `__substg1.0_${propId}${t}`;
    const e = cfb.topLevel.get(name);
    if (e && e.type === 2) return decode(name, cfb.readStream(e));
  }
  return "";
}

const FILETIME_EPOCH_MS = 11644473600000;

/** Sent/delivery time from the fixed-size property stream (top-level
 *  message: 32-byte header, then 16-byte records). */
function dateProp(cfb) {
  const e = cfb.topLevel.get("__properties_version1.0");
  if (!e || e.type !== 2) return "";
  const b = cfb.readStream(e);
  const wanted = { 0x0039: 1, 0x0e06: 2 }; // client-submit preferred
  let best = null;
  let bestRank = 99;
  for (let off = 32; off + 16 <= b.length; off += 16) {
    const type = b.readUInt16LE(off);
    const id = b.readUInt16LE(off + 2);
    if (type !== 0x0040 || !(id in wanted)) continue;
    const lo = b.readUInt32LE(off + 8);
    const hi = b.readUInt32LE(off + 12);
    const ms = (hi * 4294967296 + lo) / 10000 - FILETIME_EPOCH_MS;
    if (ms > 0 && wanted[id] < bestRank) {
      best = new Date(Math.round(ms));
      bestRank = wanted[id];
    }
  }
  return best && !isNaN(best.getTime()) ? best.toISOString() : "";
}

export function parseMsg(buf) {
  const cfb = readCfb(buf);
  const headers = stringProp(cfb, "007D");
  let date = dateProp(cfb);
  if (!date && headers) {
    const m = /^Date:\s*(.+)$/im.exec(headers);
    if (m) {
      const d = new Date(m[1].trim());
      if (!isNaN(d.getTime())) date = d.toISOString();
    }
  }
  return {
    subject: stringProp(cfb, "0037"),
    from: stringProp(cfb, "0C1A"),
    to: stringProp(cfb, "0E04"),
    cc: stringProp(cfb, "0E03"),
    body: stringProp(cfb, "1000"),
    headers,
    date,
  };
}

/** The sidecar body: subject as H1, a From/To/Cc/Sent strip, then the
 *  message text with CRLFs normalized. */
export function msgToMarkdown(m, fileName) {
  const lines = [`# ${m.subject || String(fileName).replace(/\.[^.]*$/, "")}`, ""];
  if (m.from) lines.push(`**From:** ${m.from}  `);
  if (m.to) lines.push(`**To:** ${m.to}  `);
  if (m.cc) lines.push(`**Cc:** ${m.cc}  `);
  if (m.date) lines.push(`**Sent:** ${m.date.slice(0, 16).replace("T", " ")}  `);
  lines.push("");
  const body = String(m.body || "").replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (body) lines.push(body);
  return lines.join("\n").trim() + "\n";
}
