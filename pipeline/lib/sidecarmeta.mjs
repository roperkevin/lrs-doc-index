/**
 * sidecarmeta.mjs — the sidecar's metadata TABLE (Sidecar_Format_Plan
 * phase 1; format 3.1 is Markdown_Layout_Plan phase 4) and the
 * readers every consumer shares.
 *
 * Format 3.0 kept ONE representation of a document's metadata: the
 * visible info table under the H1. There is no yaml block, no code
 * block and no HTML comment frame; the machine `related:` list moved
 * into the Related section's own per-entry markers
 * (`<!-- rel:578 s=1006.257 -->`). Lists use ` · ` as separator, and
 * a `|` inside a value is escaped `\|`.
 *
 * Format 3.1 keeps the row ORDER fixed and stops printing the rows a
 * document has nothing to say in. 3.0's rule — every row always
 * present, `—` when empty — bought shape-uniformity for a reader, and
 * charged for it in every consumer's retrieval window: on a sparse
 * document the header was longer than the content and most of it read
 * `—`. Fixed order gives the uniformity; printing `—` ten times does
 * not add to it. Four rows are ALWAYS present (they are the identity
 * and the provenance): Doc, Status, Source, Extracted. The rest —
 * Product, Release, Issues, People, Edited, Keywords, Tools — appear
 * only when they carry a value, and `readMeta` normalizes an absent
 * row to ""/[] exactly as it normalized `—`. Two rows are new:
 * `Status` (what 3.0 said in prose, or not at all) and `Generated`,
 * which carries a machine-authored file's provenance.
 *
 *   | Field | Value |
 *   | --- | --- |
 *   | **Doc** | 564 · Test Plan · Pro |
 *   | **Status** | Indexed |
 *   | **Product** | Pipeline Referencing |
 *   | **Issues** | [repo#4975](https://…) |
 *   | **Source** | [file.pptx](<url>) · rev V2 |
 *   | **People** | author Mac Christmas |
 *   | **Edited** | 2023-05-22 22:17 by Mac Christmas |
 *   | **Extracted** | 2026-09-04 · lane xmlstrip · format 3.1 · prompt v2.0.2 |
 *   | **Keywords** | append routes · line order · route |
 *
 * The readers (`readMeta`, `metaList`, `relEntries`) understand 3.1,
 * 3.0 AND the pre-3.0 yaml frames (comment / details / fence /
 * frontmatter), so the converging backfill never breaks a consumer:
 * a file in any shape answers the same questions.
 */

import { yamlList } from "./doclinks.mjs";

export const SIDECAR_FORMAT = "3.1";
export const SEP = " · ";
export const EMPTY = "—";

/** Field order — the one shape every sidecar carries. A row that is
 *  not in ALWAYS_ROWS is printed only when it has a value (3.1). */
export const META_ROWS = [
  "Doc", "Status", "Product", "Release", "Issues", "Source", "People",
  "Edited", "Extracted", "Generated", "Keywords", "Tools",
];

/** The identity and the provenance: always printed, `—` when empty.
 *  `Generated` is always printed on a machine-authored file and never
 *  on a sidecar, so it is conditional like the rest. */
export const ALWAYS_ROWS = ["Doc", "Status", "Source", "Extracted"];

/** A table cell: no pipes, no newlines, no bare separator glyph. */
export function cell(s) {
  return String(s ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .replace(/\s+/g, " ")
    .trim();
}

/** A list item: additionally never contains the ` · ` separator. */
export function item(s) {
  return cell(s).replace(/\s*·\s*/g, " - ");
}

const list = (xs) => (xs || []).map(item).filter(Boolean).join(SEP);
const or = (s, fallback = EMPTY) => (cell(s) === "" ? fallback : cell(s));

/**
 * The table, from the header parameters the sweep already assembles
 * (`sidecarHeader`'s `p`). `p.extractedOn` (YYYY-MM-DD) is the date to
 * stamp — the first extraction's date is carried across reformats so a
 * rewrite that changes nothing else is byte-idempotent.
 */
export function renderMetaTable(p) {
  const issues = (p.ids || []).map(
    (id) => `[${cell(id.repo)}#${id.number}](https://devtopia.esri.com/${cell(id.repo)}/issues/${id.number})`
  );
  const rev = cell(p.docRevision);
  const source = `[${cell(p.fileName)}](<${String(p.sourceLink || "").replace(/>/g, "%3E")}>)` +
    (rev ? `${SEP}rev ${rev}` : "");
  // 3.1: a person the document does not name is not printed as `—`
  const people = [
    cell(p.srcAuthor) ? `author ${cell(p.srcAuthor)}` : "",
    cell(p.pe) ? `PE ${cell(p.pe)}` : "",
    cell(p.dev) ? `dev ${cell(p.dev)}` : "",
  ].filter(Boolean).join(SEP);
  const edited = (p.srcEditedText || "") !== ""
    ? `${cell(p.srcEditedText)} by ${or(p.srcEditor, "unknown")}`
    : "";
  const extracted = [
    cell(p.extractedOn), `lane ${or(p.lane, "none")}`, `format ${SIDECAR_FORMAT}`,
    p.promptVersion ? `prompt ${cell(p.promptVersion)}` : "",
  ].filter(Boolean).join(SEP);
  const rows = {
    Doc: `${p.rowId}${SEP}${or(p.docKind, "Other")}${SEP}${or(p.surface, "Other")}`,
    Status: or(p.status, "Indexed"),
    Product: list(p.products),
    Release: cell(p.targetRelease),
    Issues: issues.join(SEP),
    Source: source,
    People: people,
    Edited: edited,
    Extracted: extracted,
    Generated: cell(p.generated),
    Keywords: list(p.keywords),
    Tools: list(p.tools),
  };
  const shown = META_ROWS.filter(
    (k) => ALWAYS_ROWS.includes(k) || (rows[k] !== "" && rows[k] !== EMPTY)
  );
  return [
    "| Field | Value |",
    "| --- | --- |",
    ...shown.map((k) => `| **${k}** | ${rows[k] === "" ? EMPTY : rows[k]} |`),
  ].join("\n") + "\n";
}

// ---- readers ---------------------------------------------------------

/** The header slice: everything before the first `## ` section. */
function headOf(content) {
  const s = String(content || "");
  const i = s.search(/^## /m);
  return i < 0 ? s : s.slice(0, i);
}

/** Raw table rows of the header, label -> cell text (unescaped). */
export function metaTable(content) {
  const out = new Map();
  for (const ln of headOf(content).split("\n")) {
    const m = /^\| \*\*([A-Za-z ]+)\*\* \| (.*) \|$/.exec(ln);
    if (m) out.set(m[1], m[2].replace(/\\\|/g, "|"));
  }
  return out;
}

const splitList = (v) =>
  v === undefined || v === "" || v === EMPTY ? [] : v.split(SEP).map((x) => x.trim()).filter(Boolean);

const linkText = (v) => (/^\[([^\]]*)\]\(/.exec(String(v)) || [])[1] || "";
const linkUrl = (v) => {
  const m = /\]\(<?([^)>]*)>?\)/.exec(String(v));
  return m ? m[1].replace(/%3E/g, ">") : "";
};
const yamlVal = (md, key) => {
  const m = String(md).match(new RegExp(`^${key}:\\s*["']?(.*?)["']?\\s*$`, "m"));
  return m ? m[1].trim() : "";
};

/**
 * Every metadata field a consumer ever asked the yaml for, from the
 * 3.0 table — or from the legacy yaml lines when the file has not been
 * rewritten yet. Absent fields are "" / [] / null, never undefined.
 */
export function readMeta(content) {
  const s = String(content || "");
  const t = metaTable(s);
  const title = (/^# (.+)$/m.exec(s) || [])[1]?.trim() || yamlVal(s, "title");
  if (t.has("Doc")) {
    const [id, kind, surface] = splitList(t.get("Doc"));
    const people = Object.fromEntries(
      splitList(t.get("People")).map((x) => {
        const m = /^(author|PE|dev)\s+(.*)$/.exec(x);
        return m ? [m[1], m[2] === EMPTY ? "" : m[2]] : [x, ""];
      })
    );
    const edited = /^(\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2})?) by (.*)$/.exec(t.get("Edited") || "");
    const ex = Object.fromEntries(
      splitList(t.get("Extracted")).map((x, i) => {
        if (i === 0) return ["date", x];
        const m = /^(lane|format|prompt)\s+(.*)$/.exec(x);
        return m ? [m[1], m[2]] : [x, ""];
      })
    );
    const src = t.get("Source") || "";
    const srcParts = splitList(src);
    const rev = (srcParts.slice(1).map((x) => /^rev (.*)$/.exec(x)).find(Boolean) || [])[1] || "";
    const orEmpty = (k) => (t.get(k) === EMPTY ? "" : (t.get(k) || ""));
    return {
      format: ex.format || SIDECAR_FORMAT,
      title,
      doc_id: Number(id) || null,
      doc_kind: kind || "", surface: surface || "",
      status: orEmpty("Status"), generated: orEmpty("Generated"),
      products: splitList(t.get("Product")),
      target_release: t.get("Release") === EMPTY ? "" : (t.get("Release") || ""),
      issues: splitList(t.get("Issues")).map(linkText).filter(Boolean),
      source_file: linkText(srcParts[0] || ""),
      source_url: linkUrl(srcParts[0] || ""),
      doc_revision: rev,
      author: people.author || "", pe: people.PE || "", dev: people.dev || "",
      last_edited_by: edited ? edited[2] : "",
      last_edited: edited ? edited[1] : "",
      extracted: ex.date || "",
      extraction_lane: ex.lane || "",
      prompt_version: ex.prompt || "",
      keywords: splitList(t.get("Keywords")),
      tools: splitList(t.get("Tools")),
    };
  }
  // legacy yaml frames (format < 3.0)
  const last = yamlVal(s, "last_edited");
  return {
    format: "2",
    title,
    doc_id: Number(yamlVal(s, "doc_id")) || null,
    doc_kind: yamlVal(s, "doc_kind"), surface: yamlVal(s, "surface"),
    status: "", generated: "",
    products: yamlList(s, "products"),
    target_release: yamlVal(s, "target_release"),
    issues: yamlList(s, "issues"),
    source_file: yamlVal(s, "source_file"),
    source_url: yamlVal(s, "source_url"),
    doc_revision: yamlVal(s, "doc_revision"),
    author: yamlVal(s, "author"), pe: yamlVal(s, "pe"), dev: yamlVal(s, "dev"),
    last_edited_by: yamlVal(s, "last_edited_by"),
    last_edited: last.replace("T", " ").slice(0, 16),
    extracted: yamlVal(s, "extracted"),
    extraction_lane: yamlVal(s, "extraction_lane"),
    prompt_version: yamlVal(s, "prompt_version"),
    keywords: yamlList(s, "keywords"),
    tools: yamlList(s, "tools"),
  };
}

/** A list field by its table label ("Keywords", "Tools", "Product",
 *  "Issues") — falling back to the legacy yaml key. */
export function metaList(content, label) {
  const t = metaTable(content);
  if (t.has("Doc")) return splitList(t.get(label));
  const key = { Keywords: "keywords", Tools: "tools", Product: "products", Issues: "issues" }[label] || label;
  return yamlList(content, key);
}

/** True when the file already carries the 3.0 table. */
export function isFormat3(content) {
  return metaTable(content).has("Doc");
}

// ---- related entries -------------------------------------------------

const REL_BEGIN = "<!-- related:begin -->";
const REL_END = "<!-- related:end -->";

/** Related-region text (between the markers), "" when absent. */
export function relatedRegion(content) {
  const s = String(content || "");
  const b = s.indexOf(REL_BEGIN);
  const e = s.indexOf(REL_END);
  return b >= 0 && e > b ? s.slice(b + REL_BEGIN.length, e) : "";
}

/** One bullet's rel marker: `<!-- rel:578 s=1006.257 -->` -> {doc, s}. */
export function parseRelMarker(line) {
  const m = /<!-- rel:(\d+)(?:\s+s=(-?[\d.]+))?\s*-->/.exec(String(line));
  if (!m) return null;
  return { doc: Number(m[1]), s: m[2] !== undefined ? Number(m[2]) : null };
}

/**
 * The machine related list — [{doc, file, s}] — read from the rel
 * markers (format 3.0: file from the bullet's link target, score from
 * `s=`); files not yet rewritten still carry the yaml `related:` line,
 * which wins when present so scores survive the migration window.
 */
export function relEntries(content) {
  const s = String(content || "");
  const y = yamlList(s, "related");
  const fromYaml = /^related:\s*\[/m.test(s) ? yamlRelated(s) : [];
  if (fromYaml.length) return fromYaml;
  const out = [];
  for (const ln of relatedRegion(s).split("\n")) {
    if (!ln.startsWith("- ")) continue;
    const mk = parseRelMarker(ln);
    if (!mk || !(mk.doc > 0)) continue;
    const url = linkUrl(ln);
    const file = url ? decodeURIComponent(url.split("/").pop() || "")
                     : ln.replace(/<!--.*$/, "").replace(/^- /, "").trim();
    out.push({ doc: mk.doc, file, s: mk.s ?? 0 });
  }
  void y;
  return out;
}

function yamlRelated(s) {
  const m = /^related:\s*(\[.*\])\s*$/m.exec(s);
  if (!m) return [];
  try {
    const v = JSON.parse(m[1]);
    return Array.isArray(v)
      ? v.filter((o) => o && Number(o.doc) > 0)
         .map((o) => ({ doc: Number(o.doc), file: String(o.file || ""), s: Number(o.s) || 0 }))
      : [];
  } catch {
    return [];
  }
}

/**
 * Stamp `s=` scores onto the rel markers of a related region that was
 * written before 3.0 (scores lived on the yaml line). Bullets whose
 * doc has no known score keep their marker as is.
 */
export function migrateRelMarkers(region, entries) {
  const score = new Map((entries || []).map((e) => [Number(e.doc), e.s]));
  return String(region || "").split("\n").map((ln) => {
    const mk = parseRelMarker(ln);
    if (!mk || mk.s !== null || !score.has(mk.doc)) return ln;
    return ln.replace(/<!-- rel:(\d+)\s*-->/, (_, d) => `<!-- rel:${d} s=${score.get(Number(d))} -->`);
  }).join("\n");
}
