/**
 * figureindex.mjs v1.1 — figures (pasted pictures and drawn diagrams)
 * out of a document, two halves. Pure module, no I/O, no AI.
 *
 * v1.1 (FigureIndexVersion bump — reflow with `sweep.mjs --refigure`;
 * tuned on the first live export, 1,302 rows / 139 documents):
 *  - Kind `icon`: a picture no larger than ICON_MAX px on its longest
 *    side (90 of the export's 687 pictures were 16–32 px button icons
 *    from docx documentation pages) — still a file, still named and
 *    numbered, but set aside from the figures proper so views and the
 *    catalog can skip it. Decided from the file header (sizeOf), so a
 *    picture not on disk stays `image`.
 *  - untitled slides name by their first text line: 155 pictures sat
 *    under bare `## Slide N` headings and came out as
 *    `fig-01-slide-02.png`; the slide's first prose line (list
 *    markers and numbering stripped) now supplies the slug.
 *
 * 1. NAMING (`prettifyMedia`). ZipTextExtract links a slide's pictures
 *    under their OOXML part names (`image1.png`, `image7.jpeg`), which
 *    say nothing about the picture and collide across every document.
 *    The sweep now mints one standardized name per picture from the
 *    extracted text alone — so the index path (bytes in hand) and the
 *    `--reformat` path (files already on disk) agree without looking
 *    at the archive:
 *
 *        fig-<NN>[-slide-<KK>][-<slug>].<ext>
 *
 *    NN = the picture's ordinal in document order (distinct source
 *    files; a logo linked from every slide is ONE figure), KK = the
 *    slide it first appears on (pptx only), slug = the slide title (or
 *    the nearest docx heading) in kebab-case, capped at a word
 *    boundary; ext lower-cased with jpeg → jpg. Every link's alt text
 *    becomes `Figure N — <title>` and a slide's links go one per line
 *    (they used to share a line, and only the first was ever read by
 *    the case parser). The same source file linked twice keeps one
 *    name. Deterministic: the same text always mints the same names,
 *    so a second reformat is a no-op.
 *
 * 2. THE INDEX (`extractFigures`). Rows for the Figures list out of a
 *    sidecar BODY (the text below the metadata seam — the Case_Index_
 *    Plan D1 posture: one seam, no re-extraction, backfill from disk
 *    with `--refigure`). One row per distinct image link (Kind
 *    `image`) and one per collapsed `[figure: …]` label line (Kind
 *    `diagram` — a drawn diagram whose labels ZipTextExtract folded;
 *    it has no file). Each row knows the section heading it sits
 *    under (with its anchor for deep links), the slide, the test case
 *    (`TC-P01`) when it lives inside a case section, the surrounding
 *    prose as skim text, pixel size when the file is on disk, and
 *    Tools/Keywords tags from the curated vocabulary (caseindex's
 *    matchers, rarest-first).
 *
 *    Replace-set identity, like cases: `FigureKey = {docRowId}|{ordinal}`;
 *    every (re)index of a document replaces its full figure-row set
 *    (`diffFigureRows`), so nothing downstream may hold a Figures row id.
 */

import { MEDIA_PLACEHOLDER, kebab } from "./slug.mjs";
import { caseTags, diffCaseRows, slugger } from "./caseindex.mjs";

export const FIGURE_INDEX_VERSION = "1.1";
export const FIGURE_KINDS = ["image", "diagram", "icon"];
/** A picture this small on its longest side is an icon, not a figure. */
export const ICON_MAX = 48;
export const FORMATS = ["png", "jpg", "gif", "bmp", "svg", "other", "none"];

const SLUG_CAP = 40;
// a slug never ends on one of these (the stem rule's stopword list)
const STOPWORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "from", "in", "into",
  "of", "on", "or", "the", "to", "via", "vs", "with"]);
const cap = (s, n) => String(s || "").slice(0, n);
const pad2 = (n) => String(n).padStart(2, "0");

/** Kebab-case slug of a heading, capped at a word boundary, never
 *  ending on a stopword. */
function titleSlug(title) {
  let s = kebab(String(title || "").replace(/<!--[\s\S]*?-->/g, ""));
  if (s.length > SLUG_CAP) {
    const cut = s.lastIndexOf("-", SLUG_CAP);
    s = s.slice(0, cut > 0 ? cut : SLUG_CAP);
  }
  const words = s.split("-").filter(Boolean);
  while (words.length > 1 && STOPWORDS.has(words[words.length - 1])) words.pop();
  return words.join("-");
}

/** Lower-cased, normalized extension of a media file name. */
export function formatOf(name) {
  const m = /\.([a-z0-9]+)$/i.exec(String(name || ""));
  if (!m) return "other";
  const ext = m[1].toLowerCase();
  if (ext === "jpeg" || ext === "jpg") return "jpg";
  if (["png", "gif", "bmp", "svg"].includes(ext)) return ext;
  return "other";
}

/**
 * The standardized name for one picture.
 *   ordinal: 1-based figure number in document order
 *   slideNo: the slide it first appears on (null for docx)
 *   title:   the slide title / nearest heading ("" = none)
 *   source:  the source file name (its extension is kept, normalized)
 */
export function figureName({ ordinal, slideNo, title, source }) {
  const parts = [`fig-${pad2(ordinal)}`];
  if (slideNo !== null && slideNo !== undefined) parts.push(`slide-${pad2(slideNo)}`);
  const slug = titleSlug(title);
  if (slug) parts.push(slug);
  const fmt = formatOf(source);
  const ext = fmt === "other" ? (String(source).split(".").pop() || "bin").toLowerCase() : fmt;
  return `${parts.join("-")}.${ext}`;
}

/** The title an untitled slide takes from its first text line: prose
 *  only (no tables, labels, links, comments), list and numbering
 *  markers stripped, bold unwrapped. "" when the line is not prose. */
function firstLineTitle(line) {
  const s = String(line).replace(/<!--[\s\S]*?-->/g, "").trim();
  if (!s || /^[|!\[`#]/.test(s)) return "";
  return s
    .replace(/^(?:[-*+]\s+|\d{1,3}[.)]\s+)+/, "")
    .replace(/\*\*/g, "")
    .trim();
}

/** A markdown alt text: no brackets, no newlines. */
const altText = (s) => String(s || "").replace(/[\[\]\r\n]+/g, " ").replace(/\s+/g, " ").trim();

/**
 * prettifyMedia(docText) → { text, renames, figures }
 *
 * `docText` is ZipTextExtract's output with links minted against
 * MEDIA_PLACEHOLDER (`![image1.png](../media/__MEDIA__/image1.png)`).
 * `text` carries the same links under their standardized names, alt
 * texts `Figure N — <title>`, one link per line; `renames` is the
 * ordered [{from, to}] list (source basename → new basename, distinct
 * files only) the writer applies to the extracted bytes or the files
 * already on disk; `figures` is [{ ordinal, from, to, slideNo, title }].
 * Text without placeholder links comes back unchanged.
 */
export function prettifyMedia(docText) {
  const src = String(docText ?? "");
  if (!src.includes(MEDIA_PLACEHOLDER)) return { text: src, renames: [], figures: [] };
  const lines = src.split("\n");
  const out = [];
  const byFrom = new Map(); // source basename -> figure record
  const figures = [];
  let slideNo = null;
  let title = "";
  let wantTitle = false; // an untitled slide: the first text line names it (v1.1)
  let fenced = false;
  const esc = MEDIA_PLACEHOLDER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const linkRe = new RegExp(`!\\[([^\\]]*)\\]\\(<?${esc}([^)>\\s]+)>?\\)`, "g");
  for (const line of lines) {
    // fenced code is content, never a link source (the extractor's own
    // fence barrier keeps links outside fences; a pasted script that
    // quotes a link stays verbatim)
    if (line.trim().startsWith("```")) { fenced = !fenced; out.push(line); continue; }
    if (fenced) { out.push(line); continue; }
    const hm = /^(#{1,6}) (.+)$/.exec(line);
    if (hm) {
      const text = hm[2].replace(/<!--[\s\S]*?-->/g, "").trim();
      const sm = /^Slide (\d+)(?:\s+[—–-]\s+(.*))?$/.exec(text);
      if (sm) {
        slideNo = parseInt(sm[1], 10);
        title = (sm[2] || "").trim();
        wantTitle = title === "";
      } else if (!/^Notes$/i.test(text)) {
        // a docx heading (or an author-titled section): the nearest
        // heading names the figure; slides are pptx-only
        if (hm[1].length <= 2) slideNo = null;
        title = text;
        wantTitle = false;
      }
      out.push(line);
      continue;
    }
    if (!line.includes(MEDIA_PLACEHOLDER)) {
      if (wantTitle) {
        const t = firstLineTitle(line);
        if (t) { title = t; wantTitle = false; }
      }
      out.push(line);
      continue;
    }
    // a line carrying links: each link goes on its own line under its
    // standardized name; any text around the links is kept before them
    const rest = line.replace(linkRe, "").trim();
    if (rest) out.push(rest);
    let m;
    linkRe.lastIndex = 0;
    while ((m = linkRe.exec(line)) !== null) {
      const from = m[2];
      let fig = byFrom.get(from);
      if (!fig) {
        const ordinal = figures.length + 1;
        fig = { ordinal, from, to: figureName({ ordinal, slideNo, title, source: from }), slideNo, title };
        byFrom.set(from, fig);
        figures.push(fig);
      }
      const alt = altText(`Figure ${fig.ordinal}${fig.title ? " — " + fig.title : ""}`);
      out.push(`![${alt}](${MEDIA_PLACEHOLDER}${fig.to})`);
    }
  }
  return {
    text: out.join("\n"),
    // identity entries (text already on the rule) are no renames
    renames: figures.filter((f) => f.from !== f.to).map((f) => ({ from: f.from, to: f.to })),
    figures,
  };
}

/** True when a media basename already follows the standardized rule. */
export function isPrettyName(name) {
  return /^fig-\d{2,}(?:-slide-\d{2,})?(?:-[a-z0-9-]+)?\.[a-z0-9]+$/.test(String(name || ""));
}

// ---- the index ----------------------------------------------------------

/**
 * imageSize(buf) → { width, height } | null — pixel size from the
 * header of a PNG / GIF / BMP / baseline-or-progressive JPEG. Reads
 * only the first bytes; anything else (SVG, truncated files) is null.
 */
export function imageSize(buf) {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf || []);
  const be32 = (i) => ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];
  const be16 = (i) => (b[i] << 8) + b[i + 1];
  const le16 = (i) => b[i] + (b[i + 1] << 8);
  const le32 = (i) => (b[i] + (b[i + 1] << 8) + (b[i + 2] << 16) + (b[i + 3] << 24)) | 0;
  if (b.length >= 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { width: be32(16), height: be32(20) };
  }
  if (b.length >= 10 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) {
    return { width: le16(6), height: le16(8) };
  }
  if (b.length >= 26 && b[0] === 0x42 && b[1] === 0x4d) {
    return { width: Math.abs(le32(18)), height: Math.abs(le32(22)) };
  }
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker === 0xff) { i++; continue; }
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) { i += 2; continue; }
      const isSof = (marker >= 0xc0 && marker <= 0xcf) && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSof) return { height: be16(i + 5), width: be16(i + 7) };
      if (marker === 0xd9 || marker === 0xda) break;
      i += 2 + be16(i + 2);
    }
  }
  return null;
}

/** Skim text of one section: prose only, structure stripped. */
function skim(lines, capChars) {
  const out = [];
  let fenced = false;
  for (const raw of lines) {
    const s = raw.trim();
    if (s.startsWith("```")) { fenced = !fenced; continue; }
    if (fenced || s.startsWith("|") || s.startsWith("![") || s.startsWith("[figure:")) continue;
    const ln = s.replace(/<!--[\s\S]*?-->/g, "").replace(/^#{1,6}\s+/, "").trim();
    if (ln) out.push(ln);
  }
  return cap(out.join("\n"), capChars);
}

/**
 * extractFigures(bodyText, { mediaUrlBase, contextCap, vocab, docTitle,
 *   sizeOf }) → { figures }
 *
 * `figures` in document order, each { ordinal, kind, fileName, filePath,
 * format, slideNo, section, anchor, caseNo, caption, alt, context, url,
 * width, height, bytes, tools, keywords, title }. `filePath` is the
 * link target below `media/` (`<stem>/fig-01-….png`; a legacy flat
 * `doc12_image1.png` stays as is); `url` resolves it onto
 * `mediaUrlBase` when given. `sizeOf(filePath)` — optional — returns
 * { width, height, bytes } for a file the caller can read, or null.
 */
export function extractFigures(bodyText, opts = {}) {
  const contextCap = opts.contextCap || 2000;
  const lines = String(bodyText || "").replace(/\r\n?/g, "\n").split("\n");
  const slug = slugger();
  // sections: heading line index -> { heading, anchor, slideNo, caseNo, start, end }
  const sections = [];
  let cur = { heading: "", anchor: "", slideNo: null, caseNo: "", start: 0, end: lines.length, level: 0 };
  for (let i = 0; i < lines.length; i++) {
    const hm = /^(#{1,6}) (.+)$/.exec(lines[i]);
    if (!hm) continue;
    cur.end = i;
    sections.push(cur);
    const text = hm[2].replace(/<!--[\s\S]*?-->/g, "").trim();
    const comment = (/<!--([\s\S]*?)-->/.exec(hm[2]) || [])[1] || "";
    const sm = /\bslide (\d+)\b/i.exec(comment) || /^Slide (\d+)\b/.exec(text);
    const level = hm[1].length;
    // a case section (`### TC-P01 — …`) claims the figures below it up
    // to the next heading of ANY level (the grammar's section rule);
    // any other heading ends the case
    const tc = /^TC-[PNU]\d+\b/.exec(text);
    cur = {
      heading: text,
      anchor: slug(hm[2]),
      slideNo: sm ? parseInt(sm[1], 10) : level <= 2 ? null : cur.slideNo,
      caseNo: tc ? tc[0] : "",
      start: i + 1, end: lines.length, level,
    };
  }
  sections.push(cur);

  const figures = [];
  const seen = new Set();
  const linkRe = /!\[([^\]]*)\]\(<?([^)>\s]+)>?\)/g;
  for (const sec of sections) {
    const secLines = lines.slice(sec.start, sec.end);
    let context = null; // computed lazily, once per section
    let fenced = false;
    for (const raw of secLines) {
      const s = raw.trim();
      if (s.startsWith("```")) { fenced = !fenced; continue; }
      if (fenced) continue;
      const push = (fig) => {
        if (context === null) context = skim(secLines, contextCap);
        figures.push({
          ...fig,
          ordinal: figures.length + 1,
          slideNo: sec.slideNo,
          section: cap(sec.heading, 255),
          anchor: cap(sec.anchor, 255),
          caseNo: sec.caseNo,
          context,
        });
      };
      if (s.startsWith("[figure:") && s.endsWith("]")) {
        push({ kind: "diagram", fileName: "", filePath: "", format: "none",
               caption: cap(s.slice("[figure:".length, -1).trim(), 255), alt: "" });
        continue;
      }
      let m;
      linkRe.lastIndex = 0;
      while ((m = linkRe.exec(raw)) !== null) {
        const target = m[2];
        if (seen.has(target)) continue;
        seen.add(target);
        const at = target.indexOf("media/");
        const filePath = at >= 0 ? target.slice(at + "media/".length) : target.split("/").pop();
        const fileName = filePath.split("/").pop();
        // a meaningful alt text is a caption; the file name and the
        // generated `Figure N — …` form are not
        const alt = m[1].trim();
        const generated = alt === fileName || /^Figure \d+\b/.test(alt) || alt === "fig" || alt === "figure";
        push({ kind: "image", fileName, filePath, format: formatOf(fileName),
               caption: "", alt: cap(generated ? "" : alt, 255) });
      }
    }
  }
  return {
    figures: figures.map((f) => {
      const size = f.kind === "image" && typeof opts.sizeOf === "function" ? opts.sizeOf(f.filePath) : null;
      // v1.1: a tiny picture is an icon (a docx page's button glyphs),
      // decided from the header on disk — unknown size stays an image
      if (size && Number.isFinite(size.width) && Number.isFinite(size.height) &&
          Math.max(size.width, size.height) <= ICON_MAX) {
        f = { ...f, kind: "icon" };
      }
      const tags = caseTags([opts.docTitle || "", f.section, f.caption, f.context].join("\n"), opts.vocab);
      // the title names the figure by its caption (diagrams) or the
      // section it sits in, minus the generated `Slide N — ` prefix
      const label = f.kind === "diagram" ? f.caption
        : f.section.replace(/^Slide \d+(?:\s+[—–-]\s+|$)/, "").trim();
      return {
        ...f,
        url: f.kind !== "diagram" ? (opts.mediaUrlBase ? `${opts.mediaUrlBase}/${f.filePath}` : f.filePath) : "",
        width: size && Number.isFinite(size.width) ? size.width : null,
        height: size && Number.isFinite(size.height) ? size.height : null,
        bytes: size && Number.isFinite(size.bytes) ? size.bytes : null,
        tools: tags.tools,
        keywords: tags.keywords,
        title: cap(`${f.kind === "icon" ? "Icon" : "Figure"} ${f.ordinal}${label ? " — " + label : ""}`, 255),
      };
    }),
  };
}

/**
 * The Figures list row for one extracted figure — shared by the sweep's
 * writer and the gate. Field names match schemas/SPList_Figures.csv.
 */
export function toFigureRowFields(docRowId, fig, nowIso) {
  return {
    Title: cap(fig.title, 255),
    DocumentLookupId: docRowId,
    FigureKey: `${docRowId}|${fig.ordinal}`,
    FigureNo: fig.ordinal,
    Kind: fig.kind,
    FileName: cap(fig.fileName, 255),
    Format: fig.format,
    SlideNo: fig.slideNo ?? null,
    Section: cap(fig.section, 255),
    CaseNo: cap(fig.caseNo, 255),
    Anchor: cap(fig.anchor, 255),
    Caption: cap(fig.caption || fig.alt, 255),
    Context: cap(fig.context, 4000),
    Width: fig.width ?? null,
    Height: fig.height ?? null,
    Bytes: fig.bytes ?? null,
    Tools: cap((fig.tools || []).join("; "), 255),
    Keywords: cap((fig.keywords || []).join("; "), 255),
    ImageUrl: cap(fig.url, 255),
    ImageLink: fig.url ? { Url: fig.url, Description: fig.fileName } : "",
    SweptOn: nowIso,
  };
}

/** The replace-set planner, keyed on FigureKey (caseindex's diff). */
export function diffFigureRows(existing, fresh) {
  return diffCaseRows(existing, fresh, "FigureKey");
}
