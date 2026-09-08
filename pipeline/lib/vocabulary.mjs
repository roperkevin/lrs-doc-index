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
 * and curate read it from disk and never fetch.
 *
 * v1.1 (sweep v1.66 — "identify tools better"): the hand-kept entries
 * carry a `kind` — `widget` (Experience Builder), `ribbon` (the Pro
 * Location Referencing tab), `app` (Event Editor, Roadway
 * Characteristics Editor), `rest` (the Linear Referencing Service
 * operations: geometryToMeasure, applyEdits, …) — and the file gains
 * an `aliases` map (SLD → Straight Line Diagram). Three things come
 * of it: the KnownTools block the classifier reads is GROUPED by
 * kind with the surface each group implies, so a REST operation is
 * never returned as a Pro tool; `normalizeTools` resolves aliases and
 * strips "widget" / "operation" / "pane" the way it strips "tool";
 * and `toolsNamedIn` scans the document text itself for the official
 * names, so a tool the document names is on the row even when the
 * model left it out (the sweep unions the two lists).
 *
 * Two parsers here understand the docfx page shapes the Esri help uses:
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

/** The hand-kept kinds, in the order the KnownTools block lists them,
 *  with the surface each implies (docsignals reads this too). */
export const TOOL_KINDS = [
  { kind: "tool", label: "Geoprocessing tools of the Location Referencing toolbox", surface: "Pro" },
  { kind: "ribbon", label: "ArcGIS Pro ribbon tools (the Location Referencing tab)", surface: "Pro" },
  { kind: "widget", label: "Experience Builder widgets", surface: "Experience Builder" },
  { kind: "app", label: "Web apps", surface: "" },
  { kind: "rest", label: "REST operations of the Linear Referencing Service", surface: "REST" },
];

/**
 * The committed vocabulary as the sweep and curate use it. Missing or
 * unparseable file = empty vocabulary (the pre-vocabulary behaviour:
 * no normalization, no seeding, nothing counted).
 *   tools      [{ name, toolset, url, description }]
 *   widgets    [{ name, kind, url? }] hand-kept (kind defaults to widget)
 *   aliases    { alias: official } hand-kept
 *   terms      [{ term, definition, url }]
 *   official   Map lowercase key → official casing, tools + widgets +
 *              aliases (an alias key maps to its official name)
 *   kindOf     Map official name → kind (tool / ribbon / widget / app / rest)
 *   termSet    Set of lowercase terms (the curation canonical side)
 *   knownTools the KnownTools prompt block: one official name per
 *              line under a heading per kind (tools first), "" when empty
 */
export function loadVocabulary(file = VOCABULARY_FILE) {
  let raw = {};
  try {
    raw = JSON.parse(fs.readFileSync(file, "utf8")) || {};
  } catch { /* absent = empty */ }
  const tools = Array.isArray(raw.tools) ? raw.tools.filter((t) => t && t.name) : [];
  const widgets = Array.isArray(raw.widgets) ? raw.widgets.filter((t) => t && t.name) : [];
  const terms = Array.isArray(raw.terms) ? raw.terms.filter((t) => t && t.term) : [];
  const aliases = raw.aliases && typeof raw.aliases === "object" ? raw.aliases : {};
  const official = new Map();
  const kindOf = new Map();
  for (const t of tools) {
    const key = toolKey(t.name);
    if (key && !official.has(key)) official.set(key, String(t.name));
    if (!kindOf.has(String(t.name))) kindOf.set(String(t.name), "tool");
  }
  for (const t of widgets) {
    const key = toolKey(t.name);
    if (key && !official.has(key)) official.set(key, String(t.name));
    const kind = TOOL_KINDS.some((k) => k.kind === t.kind) ? t.kind : "widget";
    if (!kindOf.has(String(t.name))) kindOf.set(String(t.name), kind);
  }
  for (const [alias, name] of Object.entries(aliases)) {
    const key = toolKey(alias);
    const target = official.get(toolKey(name)) || String(name);
    if (key && !official.has(key)) official.set(key, target);
  }
  const termSet = new Set(terms.map((t) => lower(t.term).trim()).filter(Boolean));
  const knownTools = knownToolsBlock(tools, widgets, kindOf);
  return { file, generated: raw.generated || "", tools, widgets, aliases, terms, official, kindOf, termSet, knownTools };
}

/** The KnownTools block: a heading per kind that has names (with the
 *  surface it implies), the official names under it, one per line.
 *  Tools first, then the hand-kept kinds in TOOL_KINDS order. */
function knownToolsBlock(tools, widgets, kindOf) {
  const groups = new Map(TOOL_KINDS.map((k) => [k.kind, []]));
  for (const t of tools) groups.get("tool").push(String(t.name));
  for (const w of widgets) groups.get(kindOf.get(String(w.name)) || "widget").push(String(w.name));
  const out = [];
  for (const k of TOOL_KINDS) {
    const names = groups.get(k.kind);
    if (!names.length) continue;
    out.push(`${k.label}${k.surface ? ` — surface ${k.surface}` : ""}:`, ...names);
  }
  return out.join("\n");
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
  // "the Append Routes tool", "Straight Line Diagram widget", "the
  // applyEdits operation", "Event Editor app", "geometryToMeasure REST
  // operation" — the noun the writer added is not part of the name
  const stripped = key
    .replace(/\s+(?:gp\s+|geoprocessing\s+|rest\s+)?(?:tools?|widgets?|operations?|panes?|commands?|buttons?|apps?|endpoints?)$/, "")
    .replace(/^(?:the|a|an)\s+/, "");
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

const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The official names a document's text literally carries, in order of
 * first appearance — the deterministic floor under the classifier's
 * tools list (v1.1). Longest names first, and a matched span is blanked
 * before the shorter names look, so "Create LRS Network" never also
 * yields "Create LRS". What counts as naming a tool:
 *   - a GP / ribbon / widget / app name written in its official casing
 *     ("Append Routes"), or in any casing when a tool noun follows
 *     ("append routes tool", "the append routes GP tool", "… widget");
 *   - an alias in its own casing ("SLD", "DynSeg") as a whole token;
 *   - a REST operation as a case-sensitive token — camelCase names
 *     ("applyEdits") anywhere; an all-lowercase one ("translate") only
 *     as a path segment ("/translate") or followed by operation /
 *     request / endpoint / call, so the English verb never counts.
 * An empty vocabulary yields [].
 */
export function toolsNamedIn(text, vocab) {
  const src = String(text ?? "");
  if (!src || !vocab?.official?.size) return [];
  const names = [...new Set(vocab.official.values())];
  const kindOf = vocab.kindOf || new Map();
  const aliasOf = new Map();
  for (const [alias, name] of Object.entries(vocab.aliases || {})) aliasOf.set(String(alias), String(name));
  const found = new Map(); // name -> first index
  let work = src;
  const claim = (re, name) => {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(work)) !== null) {
      const at = m.index + (m[1] ? m[1].length : 0);
      const hit = m[2] ?? m[0];
      if (!found.has(name) || found.get(name) > at) found.set(name, at);
      work = work.slice(0, at) + " ".repeat(hit.length) + work.slice(at + hit.length);
    }
  };
  const byLength = [...names].sort((a, b) => b.length - a.length);
  for (const name of byLength) {
    const kind = kindOf.get(name) || "widget";
    const esc = escapeRe(name).replace(/\\ /g, "\\s+");
    if (kind === "rest") {
      if (/[A-Z]/.test(name)) claim(new RegExp(`(^|[^A-Za-z0-9_])(${esc})(?![A-Za-z0-9_])`, "g"), name);
      else claim(new RegExp(`(\\/)(${esc})(?![A-Za-z0-9_])|(^|[^A-Za-z0-9_/])(${esc})(?=\\s+(?:operation|request|endpoint|call)s?\\b)`, "g"), name);
      continue;
    }
    // official casing, as a whole phrase
    claim(new RegExp(`(^|[^A-Za-z0-9])(${esc})(?![A-Za-z0-9])`, "g"), name);
    // any casing when the tool noun follows
    claim(new RegExp(`(^|[^A-Za-z0-9])(${esc})(?=\\s+(?:gp\\s+|geoprocessing\\s+)?(?:tool|widget|pane|command|app)s?\\b)`, "gi"), name);
  }
  for (const [alias, name] of [...aliasOf.entries()].sort((a, b) => b[0].length - a[0].length)) {
    const esc = escapeRe(alias).replace(/\\ /g, "\\s+");
    claim(new RegExp(`(^|[^A-Za-z0-9])(${esc})(?![A-Za-z0-9])`, "g"), vocab.official.get(toolKey(name)) || name);
  }
  return [...found.entries()].sort((a, b) => a[1] - b[1]).map(([n]) => n);
}
