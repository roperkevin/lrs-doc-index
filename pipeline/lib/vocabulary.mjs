/**
 * vocabulary.mjs — the official Esri vocabulary as data: every tool
 * of the Location Referencing toolbox (name, toolset, page,
 * description) and every term of the "Essential ... vocabulary" help
 * pages (term, definition, page), read from the documentation itself.
 *
 * Why: the classifier was asked for "official tool names" with six
 * examples to go on, so it invented casing and variants ("Merge
 * Centerline", "merge centerlines tool", "Append Route"), and every
 * variant became its own Keywords row for curation to sort out
 * later. With the real list the tool names are a closed vocabulary:
 * a name the document uses is copied from the list verbatim, the
 * sweep normalizes whatever comes back to the official casing, and
 * the ones it cannot match are counted and written down for review
 * (Experience Builder widgets and ribbon tools are not in any toolbox,
 * so they are hand-kept in the same file under `widgets`).
 *
 * The data file (pipeline/data/lrs_vocabulary.json) is written by
 * pipeline/doc_vocab.mjs from the live pages and committed; the sweep
 * and curate read it from disk and never fetch. Two parsers here
 * understand the docfx page shapes the Esri help uses:
 *
 *   parseToolboxPage(html, pageUrl)    the toolbox / toolset overview:
 *       a table whose rows are <a href="<slug>.html"><strong>Tool
 *       Name</strong></a> + description, and a second table of
 *       toolsets linking their own overview pages
 *   parseVocabularyPage(html, pageUrl) the essential-vocabulary page:
 *       <h2 id="…">Term</h2> followed by its definition paragraph(s)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const VOCABULARY_FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)), "..", "data", "lrs_vocabulary.json"
);

const lower = (s) => String(s ?? "").toLowerCase();

/** Collapse an HTML fragment to its text: tags dropped, entities
 *  decoded, whitespace normalized. Enough for docfx's clean markup. */
export function htmlText(fragment) {
  return String(fragment ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

/** Resolve a page-relative href against the page's URL. */
export function resolveHref(pageUrl, href) {
  try {
    return new URL(href, pageUrl).toString();
  } catch {
    return href;
  }
}

/** The <article> (or <body>) of a docfx page — everything else is chrome. */
function articleOf(html) {
  const m = /<article[^>]*>([\s\S]*?)<\/article>/i.exec(html) || /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  return m ? m[1] : String(html ?? "");
}

/**
 * A toolbox or toolset overview page → { title, tools, toolsets }.
 * tools: [{ name, slug, url, description }] from the tool table
 * (rows whose first cell is a <strong> link); toolsets: [{ name, url }]
 * from rows linking an "an-overview-of-the-…-toolset" page. The
 * toolset name is taken from the page title ("An overview of the
 * Configuration toolset" → "Configuration"; the toolbox page → "").
 */
export function parseToolboxPage(html, pageUrl) {
  const article = articleOf(html);
  const title = htmlText((/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(article) || [])[1] || "");
  const tm = /^An overview of the (.+?) (toolset|toolbox)$/i.exec(title);
  const toolset = tm && lower(tm[2]) === "toolset" ? tm[1] : "";
  const tools = [];
  const toolsets = [];
  const seen = new Set();
  for (const row of article.match(/<tr[\s\S]*?<\/tr>/gi) || []) {
    const cells = (row.match(/<td[\s\S]*?<\/td>/gi) || []);
    if (cells.length < 1) continue;
    const link = /<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(cells[0]);
    if (!link) continue;
    const href = link[1];
    const name = htmlText(link[2]);
    const description = cells[1] ? htmlText(cells[1]) : "";
    if (!name) continue;
    if (/an-overview-of-the-.*toolset\.html?$/i.test(href)) {
      toolsets.push({ name, url: resolveHref(pageUrl, href) });
      continue;
    }
    const strong = /<strong>/i.test(cells[0]);
    if (!strong) continue;
    const key = lower(name);
    if (seen.has(key)) continue;
    seen.add(key);
    tools.push({
      name,
      slug: href.replace(/^.*\//, "").replace(/\.html?$/i, ""),
      url: resolveHref(pageUrl, href),
      description,
      toolset,
    });
  }
  return { title, toolset, tools, toolsets };
}

/**
 * An essential-vocabulary page → { title, terms }; terms:
 * [{ term, definition, url }] — every <h2> after the title, with the
 * paragraphs up to the next heading as the definition (first
 * paragraph only when several; list items are folded in).
 */
export function parseVocabularyPage(html, pageUrl) {
  const article = articleOf(html);
  const title = htmlText((/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(article) || [])[1] || "");
  const terms = [];
  const re = /<h2([^>]*)>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi;
  let m;
  while ((m = re.exec(article))) {
    const term = htmlText(m[2]);
    if (!term || /^related topics$/i.test(term)) continue;
    const body = m[3];
    const paras = (body.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || []).map(htmlText).filter(Boolean);
    const definition = paras[0] || htmlText(body).slice(0, 400);
    const id = (/\bid="([^"]*)"/i.exec(m[1]) || [])[1];
    const anchor = id ? `#${id}` : "";
    terms.push({ term, definition, url: pageUrl ? pageUrl + anchor : "" });
  }
  return { title, terms };
}

/**
 * The committed vocabulary as the sweep and curate use it. Missing or
 * unparseable file = empty vocabulary (the pre-vocabulary behaviour:
 * no normalization, no seeding, nothing counted).
 *   tools      [{ name, toolset, url, description }]
 *   widgets    [{ name, url? }] hand-kept
 *   terms      [{ term, definition, url }]
 *   official   Map lowercase name → official casing, tools + widgets
 *   termSet    Set of lowercase terms (the curation canonical side)
 *   knownTools the KnownTools prompt block (one official name per
 *              line, tools then widgets), "" when empty
 */
export function loadVocabulary(file = VOCABULARY_FILE) {
  let raw = {};
  try {
    raw = JSON.parse(fs.readFileSync(file, "utf8")) || {};
  } catch { /* absent = empty */ }
  const tools = Array.isArray(raw.tools) ? raw.tools.filter((t) => t && t.name) : [];
  const widgets = Array.isArray(raw.widgets) ? raw.widgets.filter((t) => t && t.name) : [];
  const terms = Array.isArray(raw.terms) ? raw.terms.filter((t) => t && t.term) : [];
  const official = new Map();
  for (const t of [...tools, ...widgets]) {
    const key = toolKey(t.name);
    if (key && !official.has(key)) official.set(key, String(t.name));
  }
  const termSet = new Set(terms.map((t) => lower(t.term).trim()).filter(Boolean));
  const knownTools = [...tools, ...widgets].map((t) => String(t.name)).join("\n");
  return { file, generated: raw.generated || "", tools, widgets, terms, official, termSet, knownTools };
}

/** The matching key for a tool name: lowercase, "&"→"and", any run of
 *  non-alphanumerics → one space, so "Update Measures From LRS",
 *  "update-measures-from-lrs" and "Update Measures from LRS" meet. */
export function toolKey(name) {
  return lower(name).replaceAll("&", " and ").replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * The classifier's tools list against the vocabulary: every name
 * that matches an official one (by toolKey, or by key with a trailing
 * "tool"/"tools"/"gp tool" dropped, or with an official plural/
 * singular swap on the last word) becomes the official string; the
 * rest are kept as the model wrote them and reported as unknown.
 * Duplicates collapse. An empty vocabulary passes everything through.
 */
export function normalizeTools(list, vocab) {
  const out = [];
  const unknown = [];
  const seen = new Set();
  const push = (name) => {
    const k = lower(name).trim();
    if (!k || seen.has(k)) return;
    seen.add(k);
    out.push(name);
  };
  for (const raw of list || []) {
    const name = String(raw ?? "").trim();
    if (!name) continue;
    if (!vocab?.official?.size) { push(name); continue; }
    const found = matchOfficial(name, vocab.official);
    if (found) push(found);
    else { push(name); unknown.push(name); }
  }
  return { tools: out, unknown };
}

function matchOfficial(name, official) {
  let key = toolKey(name);
  if (official.has(key)) return official.get(key);
  const stripped = key.replace(/\s+(gp\s+)?tools?$/, "").replace(/^the\s+/, "");
  if (stripped !== key && official.has(stripped)) return official.get(stripped);
  key = stripped;
  // last-word plural/singular swap: "append route" ~ "append routes"
  const words = key.split(" ");
  if (words.length) {
    const last = words[words.length - 1];
    const variants = last.endsWith("s") ? [last.replace(/s$/, ""), last.replace(/es$/, "")] : [last + "s", last + "es"];
    for (const v of variants) {
      const cand = [...words.slice(0, -1), v].join(" ");
      if (official.has(cand)) return official.get(cand);
    }
  }
  return null;
}
