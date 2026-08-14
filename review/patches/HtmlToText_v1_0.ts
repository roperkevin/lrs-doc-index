/**
 * HtmlToText v1.0 — fetched HTML (Esri public help pages) → clean
 *                   markdown-ish text
 * ------------------------------------------------------------------
 * New script — gated by check_htmltotext.py (fixture-free CI job).
 *
 * The doc-link flow fetches public help pages (pro.arcgis.com,
 * enterprise.arcgis.com, developers.arcgis.com, doc.arcgis.com) with
 * the HTTP action; this script only converts the fetched HTML to
 * cacheable text. Office Scripts have no DOM, so the conversion is a
 * deterministic regex pipeline:
 *
 *   1. strip comments and <script>/<style>/<noscript> blocks
 *   2. strip <nav>/<header>/<footer>/<aside> blocks — Esri help pages
 *      are nav/footer heavy, and that chrome would eat the char
 *      budget downstream
 *   3. <title> text (entity-decoded, whitespace-collapsed) → title;
 *      falls back to the first main-content <h1>, else ""
 *   4. structure → markdown: <h1>..<h6> → #..###### on their own
 *      lines, <li> → "- " bullets, p/br/div/tr/section/article
 *      boundaries → newlines, table cells " | "-joined within a row
 *   5. strip remaining tags; decode common named entities and the
 *      numeric &#NNN;/&#xHH; forms; collapse 3+ newlines to 2 and
 *      horizontal whitespace runs to one space; trim
 *   6. cap text at maxChars (<= 0 takes the 60000 default) and set
 *      truncated/chars accordingly (chars is the FINAL length)
 *
 * note: "" normally; "thin-extract" when the final text lands under
 * 500 chars — the tripwire for JS-rendered pages that serve an empty
 * shell (the calling flow routes thin-extract to an error status
 * instead of caching menu soup; thin-extract wins over truncated
 * when both would apply); "empty-input" when html itself is empty or
 * whitespace.
 *
 * Idempotent-ish on plain text: input with no tags or entities comes
 * back essentially unchanged, so re-converting already-converted
 * text is harmless.
 *
 * Power Automate wiring:
 *   Excel Online (Business) "Run script"
 *     Workbook = any dummy .xlsx (host only)
 *     html     = Body of the HTTP action's response
 *     maxChars = text cap (pass 0 to take the 60000 default)
 *   Returns a typed object — result.title/.text/.chars/.truncated/
 *   .note surface as structured dynamic content in the designer, no
 *   Parse JSON needed.
 *
 * ES2017-safe: no lookbehind regexes; main is pure — no DOM, fetch,
 * or Date.now dependencies, so identical input gives identical
 * output.
 */
interface HtmlTextPayload {
  title: string; // <title> text, else first content <h1>, else ""
  text: string; // markdown-ish plain text, capped at maxChars
  chars: number; // text.length AFTER the cap
  truncated: boolean; // true when the cap cut content
  note: string; // "" | "thin-extract" | "empty-input"
}

interface HtmlTextResult {
  result: HtmlTextPayload;
}

// cap fallback when maxChars is missing/zero/negative, and the
// thin-extract tripwire (final text under this = JS-shell suspicion)
const DEFAULT_MAX_CHARS = 60000;
const THIN_THRESHOLD = 500;

// ---- block removal ---------------------------------------------------
// Remove <tag ...>...</tag> blocks wholesale, case-insensitive,
// dotall via [\s\S]. Non-greedy to the FIRST closing tag — Esri help
// chrome is flat enough that nested same-name blocks (which would
// leave a fragment) don't occur in practice, and a leftover fragment
// degrades to stripped tags + text, never to a crash.
function stripBlocks(s: string, tag: string): string {
  const re = new RegExp(
    "<" + tag + "(?:\\s[^>]*)?>[\\s\\S]*?</" + tag + "\\s*>",
    "gi"
  );
  return s.replace(re, "\n");
}

// ---- entity decoding ---------------------------------------------------
// Numeric forms first (fromCodePoint so astral references decode
// instead of truncating — the ZipTextExtract SC-5 precedent), then
// the common named set. &amp; is decoded strictly LAST so escaped
// markup like "&amp;lt;" comes out as the literal "&lt;", never
// double-decoded through to "<".
function decodeEntities(s: string): string {
  let t = s;
  t = t.replace(/&#(\d+);/g, function (m: string, d: string): string {
    const n = parseInt(d, 10);
    return n <= 0x10ffff ? String.fromCodePoint(n) : m;
  });
  t = t.replace(/&#[xX]([0-9a-fA-F]+);/g, function (m: string, h: string): string {
    const n = parseInt(h, 16);
    return n <= 0x10ffff ? String.fromCodePoint(n) : m;
  });
  t = t.replace(/&nbsp;/gi, " ");
  t = t.replace(/&lt;/gi, "<");
  t = t.replace(/&gt;/gi, ">");
  t = t.replace(/&quot;/gi, '"');
  t = t.replace(/&apos;/gi, "'");
  t = t.replace(/&amp;/gi, "&");
  return t;
}

// ---- inline text cleanup (titles, heading fallback) --------------------
// Strip any tags still inside the fragment, decode entities, collapse
// ALL whitespace (a title is a single line by definition), trim.
function cleanInline(s: string): string {
  return decodeEntities(s.replace(/<\/?[A-Za-z][^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function main(
  workbook: ExcelScript.Workbook,
  html: string,
  maxChars: number
): HtmlTextResult {
  const cap = maxChars > 0 ? Math.floor(maxChars) : DEFAULT_MAX_CHARS;

  // --- empty/whitespace input: report, don't fabricate ------------
  if (!html || !html.replace(/\s+/g, "")) {
    return {
      result: { title: "", text: "", chars: 0, truncated: false, note: "empty-input" },
    };
  }

  // --- 1) newline normalize, then kill comments + dead blocks -----
  let work = html.replace(/\r\n?/g, "\n");
  work = work.replace(/<!--[\s\S]*?-->/g, "\n");
  for (const tag of ["script", "style", "noscript"]) {
    work = stripBlocks(work, tag);
  }

  // --- 2) title from the <head>, BEFORE the chrome strip ----------
  // (the <title> element is head-only; the fallback <h1> is matched
  // after the chrome strip so a banner h1 inside <header> never wins)
  const tm = work.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title\s*>/i);
  let title = tm ? cleanInline(tm[1]) : "";
  work = stripBlocks(work, "title"); // don't leak title text into the body

  // --- 3) page chrome: nav/header/footer/aside -------------------
  for (const tag of ["nav", "header", "footer", "aside"]) {
    work = stripBlocks(work, tag);
  }
  if (!title) {
    const hm = work.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1\s*>/i);
    if (hm) title = cleanInline(hm[1]);
  }

  // --- 4) structure → markdown ------------------------------------
  // headings on their own lines: <hN> → blank line + N hashes
  work = work.replace(/<h([1-6])(?:\s[^>]*)?>/gi, function (m: string, d: string): string {
    return "\n\n" + "######".slice(0, parseInt(d, 10)) + " ";
  });
  work = work.replace(/<\/h[1-6]\s*>/gi, "\n\n");
  // adjacent table cells within a row join with " | " (the trailing
  // </td|th> of the LAST cell falls through to the tag strip below)
  work = work.replace(/<\/t[dh]\s*>\s*<t[dh](?:\s[^>]*)?>/gi, " | ");
  // bullets, hard breaks, block boundaries
  work = work.replace(/<li(?:\s[^>]*)?>/gi, "\n- ");
  work = work.replace(/<br\s*\/?\s*>/gi, "\n");
  work = work.replace(
    /<\/?(?:p|div|tr|section|article|table|thead|tbody|tfoot|ul|ol|li|blockquote|pre|main|figure|figcaption|dl|dt|dd)(?:\s[^>]*)?\/?\s*>/gi,
    "\n"
  );

  // --- 5) strip leftover tags, decode entities --------------------
  // tags must open with a letter or "!", so plain-text "a < b" input
  // survives untouched (the idempotence contract)
  work = work.replace(/<\/?[A-Za-z][^>]*>/g, " ");
  work = work.replace(/<![^>]*>/g, " ");
  work = decodeEntities(work);

  // --- 6) whitespace: horizontal runs → 1, line edges, 3+ NL → 2 --
  work = work.replace(/[ \t]{2,}/g, " ");
  work = work.replace(/[ \t]+\n/g, "\n");
  work = work.replace(/\n[ \t]+/g, "\n");
  work = work.replace(/\n{3,}/g, "\n\n");
  work = work.replace(/^\s+|\s+$/g, "");

  // --- 7) cap + note ----------------------------------------------
  let truncated = false;
  if (work.length > cap) {
    work = work.slice(0, cap); // no re-trim: chars must equal the cap
    truncated = true;
  }
  // single-valued note; thin-extract outranks truncated — a capped
  // page that STILL lands thin is a shell, not a success
  const note = work.length < THIN_THRESHOLD ? "thin-extract" : "";

  return {
    result: {
      title: title,
      text: work,
      chars: work.length,
      truncated: truncated,
      note: note,
    },
  };
}
