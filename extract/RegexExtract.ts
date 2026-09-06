/**
 * RegexExtract v1.4 — deterministic ID + doc revision extraction,
 * sidecar filename slug, and product-line detection
 * ------------------------------------------------------------------
 * r6 batch (flow v2.8 sidecar format) — gated by check_batch_r6.py.
 * TENANT PASTE PENDING — paste with the flow v2.8 window.
 * v1.4 delta (PD-1): `products` / `productCount` — the LRS product
 * lines a document belongs to, detected deterministically from the
 * file name, AI title and extracted text:
 *
 *   Roads & Highways      full name (roads &/and highways), RH, ADMRH
 *   Pipeline Referencing  full name, APR, UNAPR
 *   Utility Network       full name, UN, UNAPR
 *
 * Full names match case-insensitively anywhere; acronyms match
 * case-sensitively as standalone tokens only (\bRH\b — ADMRH/UNAPR
 * are matched as their own compound tokens, so the substring never
 * false-fires, and camelCase-embedded acronyms like "RHLabels" are
 * deliberately NOT matched). APR additionally skips date-shaped
 * context ("12-APR-2026") — a digit-and-separator neighbor kills the
 * hit. Canonical order is fixed (RH, APR, UN) so the output is
 * stable for row writes and yaml lines. The return shape only GAINS
 * fields, so existing flow bindings are untouched (the v1.2 slug
 * precedent).
 * ------------------------------------------------------------------
 * v1.3 provenance: r2 batch (REVIEW_v2_5_r2.md SB-1) — gated by
 * check_batch_r2.py. Gate PASSED (check_batch_r2.py, 2026-08-11).
 * ------------------------------------------------------------------
 * Implements the three validated ID sources, in precedence order:
 *
 *   url      devtopia.esri.com/{org}/{repo}/issues/{n}   (authoritative
 *            — carries its own repo namespace; also matches inside raw
 *            _rels XML, so hyperlink-only references are caught)
 *   filename ^(\d{2,5})[-_]   leading digit-run + separator
 *            (2-digit minimum: a single leading digit — e.g.
 *            "5_Data_Template..." — is treated as ordering noise;
 *            8-digit date prefixes like 20260806_ can never match)
 *   hashtag  #(\d{3,5})       Gantt-style labeled refs
 *
 * filename + hashtag numbers get `defaultRepo` as their namespace.
 * A hashtag is a weak, repo-less signal: it is DROPPED whenever the
 * same number was already claimed by a url or filename source (this
 * prevents e.g. ExB issue #26161 from also registering a phantom
 * copy under the default repo).
 *
 * docRevision: [Vv]\d{1,2} at the very end of the base filename,
 * where the V opens a token (v1.3, SB-1): start-of-name, after a
 * non-letter, or an uppercase V at a camelCase boundary. Matches
 * TestPlanV1, _V4, _v2; ignores trailing "_1", "2_35", and — new in
 * v1.3 — letter-run tails like Nov21 / Rev12 / dev3, which previously
 * minted phantom revisions (V21/V12/V3). All-caps tails (REV12) are
 * rejected too: an uppercase V after an uppercase letter reads as the
 * inside of an acronym, not a revision marker.
 *
 * slug (v1.2): kebab-case filename stem for the markdown sidecar,
 * from the AI-derived title when provided, else from the file's base
 * name, else the literal "doc" (e.g. a fully non-Latin title that
 * slugifies to empty). Lowercase [a-z0-9-], ~80 char cap cut at a
 * word boundary.
 *
 * Power Automate wiring:
 *   Excel Online (Business) "Run script"
 *     Workbook    = any dummy .xlsx (host only)
 *     fileName    = the document's file name (with extension)
 *     content     = joined TagStrip outputs + raw _rels/*.rels text
 *                   (xlsx lane: the WorkbookDump output; rels n/a)
 *     defaultRepo = e.g. "ArcGISPro/ps-location-referencing"
 *     title       = (v1.2, optional) AI-derived document title; the
 *                   v2.1-and-earlier flows omit it and still run —
 *                   the slug then comes from the file's base name.
 *   Returns a typed object — ids[], docRevision and slug surface as
 *   structured dynamic content in the designer, no Parse JSON needed.
 *   Older flows simply ignore the extra slug field.
 */
interface IdRef {
  repo: string;
  number: number;
  source: string; // "url" | "filename" | "hashtag"
}

interface IdResult {
  ids: IdRef[];
  docRevision: string; // normalized "V<n>", or "" when absent
  idCount: number;
  slug: string; // kebab-case sidecar filename stem, never empty
  products: string[]; // v1.4 (PD-1): canonical product-line names
  productCount: number;
}

// v1.4 (PD-1): standalone-token acronym scan. \b on both sides keeps
// ADMRH/UNAPR/RHLabels from substring-matching a bare acronym; the
// dateGuard drops hits whose immediate neighbor is a digit plus
// separator, so "12-APR-2026" never reads as Pipeline Referencing.
function acronymHit(scan: string, acro: string, dateGuard: boolean): boolean {
  const re = new RegExp("\\b" + acro + "\\b", "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(scan)) !== null) {
    if (dateGuard) {
      const before = scan.slice(Math.max(0, m.index - 2), m.index);
      const after = scan.slice(m.index + acro.length, m.index + acro.length + 2);
      if (/\d[-\/. ]$/.test(before) || /^[-\/. ]\d/.test(after)) continue;
    }
    return true;
  }
  return false;
}

function detectProducts(raw: string): string[] {
  const RH = "Roads & Highways";
  const APR = "Pipeline Referencing";
  const UN = "Utility Network";
  const found: { [p: string]: boolean } = {};
  // '_' is a \w character, so \bRH\b would miss "RH_Roundabouts_..." —
  // filenames are exactly where the acronyms live. Normalize first.
  const scan = raw.replace(/_/g, " ");
  // full names, case-insensitive, "&" or "and"
  if (/roads\s*(?:&|and)\s*highways/i.test(scan)) found[RH] = true;
  if (/pipeline\s+referencing/i.test(scan)) found[APR] = true;
  if (/utility\s+network/i.test(scan)) found[UN] = true;
  // compound dataset tokens first, then the bare acronyms
  if (acronymHit(scan, "UNAPR", false)) {
    found[UN] = true;
    found[APR] = true;
  }
  if (acronymHit(scan, "ADMRH", false)) found[RH] = true;
  if (acronymHit(scan, "RH", false)) found[RH] = true;
  if (acronymHit(scan, "APR", true)) found[APR] = true;
  if (acronymHit(scan, "UN", false)) found[UN] = true;
  const out: string[] = [];
  for (const p of [RH, APR, UN]) {
    if (found[p]) out.push(p);
  }
  return out;
}

function slugify(s: string): string {
  let t = s.toLowerCase();
  t = t.replace(/['’‘"“”]/g, ""); // don't -> dont
  t = t.replace(/[^a-z0-9]+/g, "-");
  t = t.replace(/^-+|-+$/g, "");
  if (t.length > 80) {
    t = t.slice(0, 80);
    const cut = t.lastIndexOf("-");
    if (cut > 40) t = t.slice(0, cut);
    t = t.replace(/-+$/, "");
  }
  return t;
}

function main(
  workbook: ExcelScript.Workbook,
  fileName: string,
  content: string,
  defaultRepo: string,
  title?: string
): IdResult {
  const ids: IdRef[] = [];
  const byKey: { [key: string]: boolean } = {};   // repo|number
  const byNumber: { [num: number]: boolean } = {}; // any strong claim

  function add(repo: string, num: number, source: string): void {
    if (!(num > 0 && num <= 999999)) {
      return;
    }
    const key = repo + "|" + String(num);
    if (byKey[key]) {
      return;
    }
    byKey[key] = true;
    byNumber[num] = true;
    ids.push({ repo: repo, number: num, source: source });
  }

  // --- base name: strip any path, then the extension --------------
  const baseName = fileName
    .replace(/^.*[\\/]/, "")
    .replace(/\.[^.]+$/, "");

  // --- 1) url source (strongest — carries its own repo) -----------
  const urlRe = /devtopia\.esri\.com\/([^\/\s"'<>\)\]]+)\/([^\/\s"'<>\)\]]+)\/issues\/(\d+)/gi;
  let m: RegExpExecArray | null;
  while ((m = urlRe.exec(content)) !== null) {
    add(m[1] + "/" + m[2], parseInt(m[3], 10), "url");
  }

  // --- 2) filename source ------------------------------------------
  // v1.1: (a) a url-claimed NUMBER suppresses the filename source the
  // same way it suppresses hashtags — filenames are repo-blind, urls
  // are authoritative (kills the cross-repo phantom, e.g. 16343);
  // (b) 5-digit filename ids route to the ExB repo: ps-location-
  // referencing lives in 2-4 digits, ExperienceBuilder-Web-Extensions
  // in 5 (revisit if ps-location-referencing ever crosses 10000).
  const EXB_REPO = "Beijing-R-D-Center/ExperienceBuilder-Web-Extensions";
  const fm = baseName.match(/^(\d{2,5})[-_]/);
  if (fm) {
    const num = parseInt(fm[1], 10);
    if (!byNumber[num]) {
      add(fm[1].length === 5 ? EXB_REPO : defaultRepo, num, "filename");
    }
  }

  // --- 3) hashtag source (weak: skip any number already claimed) --
  const hashRe = /#(\d{3,5})\b/g;
  while ((m = hashRe.exec(content)) !== null) {
    const num = parseInt(m[1], 10);
    if (!byNumber[num]) {
      add(defaultRepo, num, "hashtag");
    }
  }

  // --- doc revision from the base filename ------------------------
  // v1.3 (SB-1): the V must open a token — start, after a non-letter,
  // or uppercase V at a camelCase boundary ([a-z] then V). A bare
  // [Vv]\d$ matched inside words: Notes_Nov21 -> "V21", Rev12 -> "V12".
  // (No lookbehind — ES2017; the [a-z](?=V) leg consumes the boundary
  // letter, leaving the digits as group 1 either way.)
  const rv = baseName.match(/(?:^|[^A-Za-z]|[a-z](?=V))[Vv](\d{1,2})$/);
  const docRevision = rv ? "V" + rv[1] : "";

  // --- sidecar filename slug (v1.2) -------------------------------
  const slug = slugify(title || "") || slugify(baseName) || "doc";

  // --- product-line detection (v1.4, PD-1) ------------------------
  const products = detectProducts(fileName + "\n" + (title || "") + "\n" + content);

  return {
    ids: ids,
    docRevision: docRevision,
    idCount: ids.length,
    slug: slug,
    products: products,
    productCount: products.length,
  };
}
