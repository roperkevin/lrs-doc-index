/**
 * doclinks.mjs v1.0 — the Esri-documentation link machinery, moved
 * verbatim out of sweep.mjs v1.30 (module split, no behavior change;
 * covered by check_local_sweep.py incl. the doc_crawl/probe legs).
 * Only the default esri_doc_links.json path changed shape: it now
 * resolves from this file's PARENT directory (local/), where the
 * file has always lived.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lower } from "./util.mjs";

/**
 * Product-documentation links (local/esri_doc_links.json, or
 * sweep.docLinksFile): official Esri doc pages per canonical product
 * name, rendered as a marked block in each sidecar. Missing or
 * unparseable file = empty map = blocks are removed on next write.
 */
export function loadDocLinks(sw) {
  const file =
    sw.docLinksFile ||
    path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "esri_doc_links.json");
  let map = {};
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    if (raw && typeof raw === "object") map = raw;
  } catch { /* absent/unparseable = empty map */ }
  if (map.products || map.tools || map.searchTemplate || map.probeTemplates) {
    return {
      products: map.products || {},
      tools: map.tools || {},
      searchTemplate: typeof map.searchTemplate === "string" ? map.searchTemplate : "",
      probeTemplates: Array.isArray(map.probeTemplates) ? map.probeTemplates : [],
    };
  }
  // legacy flat shape: product keys at top level
  const products = {};
  for (const k in map) {
    if (Array.isArray(map[k])) products[k] = map[k];
  }
  return { products, tools: {}, searchTemplate: "", probeTemplates: [] };
}

const toolSlug = (t) =>
  lower(t).replaceAll("&", "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * DocPageIndex — the crawled page inventory (doc_crawl.mjs →
 * workDir/esri_doc_pages.json) as a token-match index. A tool/topic
 * name matches a page when its distinctive tokens cover the name
 * (plural-insensitive, prefix-tolerant: "realign" ~ "realignment"),
 * ranked by coverage + Jaccard, with a decisive boost for pages in
 * the section matching the doc's detected product (the same slug
 * exists in BOTH the R&H and Pipeline trees — a Pipeline doc should
 * link the Pipeline copy).
 */
export class DocPageIndex {
  constructor(file, sectionProducts) {
    this.entries = [];
    let inv = {};
    try {
      inv = JSON.parse(fs.readFileSync(file, "utf8")) || {};
    } catch { /* no inventory — matcher just never matches */ }
    for (const sec in inv) {
      const product = sectionProducts.get(sec) ?? null;
      for (const raw of inv[sec] || []) {
        // entries are {url, title} (v1.19 crawler) or a bare url
        const url = typeof raw === "string" ? raw : raw?.url;
        if (!url) continue;
        const title = typeof raw === "object" && raw.title ? String(raw.title) : "";
        const slug = String(url).split("/").pop().replace(/\.html?$/, "");
        const tokens = DocPageIndex.tokensOf(slug);
        if (tokens.length) this.entries.push({ url, title, slug, product, tokens });
      }
    }
  }

  static normTok(t) {
    return t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t;
  }

  static tokensOf(name) {
    const out = [];
    for (const p of lower(name).split(/[^a-z0-9]+/)) {
      if (p.length < 3 && !/\d/.test(p)) continue;
      const n = DocPageIndex.normTok(p);
      if (n && !out.includes(n)) out.push(n);
    }
    return out;
  }

  static tokMatch(a, b) {
    if (a === b) return true;
    const s = a.length <= b.length ? a : b;
    const l = a.length <= b.length ? b : a;
    return s.length >= 4 && l.startsWith(s);
  }

  /**
   * Best page for the name as {url, title}, or null. minCov =
   * required fraction of the NAME's tokens the page must cover
   * (1.0 for both tools and topics — partial matches proved
   * actively misleading; tools still fall through to probe/search).
   *
   * AMBIGUITY GUARD: when several DIFFERENT pages tie for best, the
   * name is too generic to link — "route" matches extend-a-route,
   * rename-a-route, retire-routes… equally, and picking one is
   * arbitrary noise, so nothing is linked. A tie between the SAME
   * slug in different product trees is not ambiguous: it's the same
   * page in two products, resolved by the doc's product order.
   */
  match(name, products, minCov) {
    const nt = DocPageIndex.tokensOf(name);
    if (!nt.length || !this.entries.length) return null;
    const prods = products || [];
    const prodSet = new Set(prods);
    let bestScore = -1;
    let tied = [];
    for (const e of this.entries) {
      let matched = 0;
      for (const t of nt) {
        if (e.tokens.some((s) => DocPageIndex.tokMatch(t, s))) matched++;
      }
      if (matched === 0) continue;
      const cov = matched / nt.length;
      if (cov < minCov) continue;
      const jac = matched / (nt.length + e.tokens.length - matched);
      let score = cov + jac * 0.5;
      if (e.product && prodSet.size) score += prodSet.has(e.product) ? 0.5 : -0.25;
      score -= e.tokens.length * 0.001;
      if (score > bestScore + 1e-9) {
        bestScore = score;
        tied = [e];
      } else if (Math.abs(score - bestScore) <= 1e-9) {
        tied.push(e);
      }
    }
    if (!tied.length) return null;
    if (new Set(tied.map((e) => e.slug)).size > 1) return null; // ambiguous
    // same page across product trees — the doc's first product wins
    tied.sort((a, b) => {
      const ai = prods.indexOf(a.product);
      const bi = prods.indexOf(b.product);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || (a.url < b.url ? -1 : 1);
    });
    return { url: tied[0].url, title: tied[0].title };
  }
}

/**
 * ToolLinkResolver — turns a detected tool name into the best link:
 *   1. the curated tools map (case-insensitive), else
 *   2. a PROBED direct link: candidate URLs built from the JSON's
 *      probeTemplates ({slug} = kebab-cased tool name; templates may
 *      carry a "product" to try product-matched folders first) are
 *      fetched, and the first HTTP 200 wins. Results — hits AND
 *      definitive all-404 misses — are cached in
 *      workDir/doc-links-cache.json so each tool costs at most one
 *      probe round ever (misses re-probe after 30 days, since docs
 *      pages get added). Network errors are never cached.
 *   3. null → the caller renders the searchTemplate fallback.
 */
export class ToolLinkResolver {
  constructor(linkMap, workDir, enabled, pageIndex) {
    this.map = linkMap;
    this.enabled = enabled && (linkMap.probeTemplates || []).length > 0;
    this.pageIndex = pageIndex;
    this.cachePath = path.join(workDir || ".", "doc-links-cache.json");
    this.curated = new Map(
      Object.keys(linkMap.tools || {}).map((k) => [lower(k).trim(), linkMap.tools[k]])
    );
    try {
      this.cache = JSON.parse(fs.readFileSync(this.cachePath, "utf8"));
    } catch {
      this.cache = {};
    }
  }

  /** Topic keywords: inventory match only, and only when the page
   *  covers EVERY name token — no probing, no search fallback (a
   *  weak topic link is noise; absence is fine). */
  topicLink(name, products) {
    const curated = this.curated.get(lower(name).trim());
    if (curated) return { url: curated, title: "" };
    return this.pageIndex ? this.pageIndex.match(name, products, 1.0) : null;
  }

  _save() {
    try {
      fs.mkdirSync(path.dirname(this.cachePath), { recursive: true });
      fs.writeFileSync(this.cachePath, JSON.stringify(this.cache, null, 1));
    } catch { /* best effort */ }
  }

  _templatesFor(products) {
    const tpls = (this.map.probeTemplates || []).map((t) =>
      typeof t === "string" ? { url: t } : t
    ).filter((t) => t && typeof t.url === "string" && t.url.includes("{slug}"));
    const set = new Set(products || []);
    const matched = tpls.filter((t) => t.product && set.has(t.product));
    const generic = tpls.filter((t) => !t.product);
    const rest = tpls.filter((t) => t.product && !set.has(t.product));
    return [...matched, ...generic, ...rest];
  }

  async resolve(tool, products) {
    const key = lower(tool).trim();
    const curated = this.curated.get(key);
    if (curated) return { url: curated, title: "" };
    // the crawled inventory beats slug-guessing: best token match
    // against pages that actually exist. FULL coverage required —
    // at 0.6 "Add Point Events" matched "Add calibration points"
    // (2 of 3 tokens), which is worse than no link at all.
    const matched = this.pageIndex ? this.pageIndex.match(tool, products, 1.0) : null;
    if (matched) return matched;
    if (!this.enabled) return null;
    const slug = toolSlug(tool);
    if (!slug) return null;
    const hit = this.cache[slug];
    if (hit) {
      if (hit.url) return { url: hit.url, title: "" };
      const age = Date.now() - Date.parse(hit.checked || 0);
      if (age < 30 * 86400000) return null; // fresh negative
    }
    let all404 = true;
    for (const t of this._templatesFor(products)) {
      const url = t.url.replace("{slug}", slug);
      let res;
      try {
        res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10000) });
      } catch {
        all404 = false; // network trouble — don't cache a miss
        continue;
      }
      if (res.ok) {
        this.cache[slug] = { url, checked: new Date().toISOString() };
        this._save();
        return { url, title: "" };
      }
      if (res.status !== 404) all404 = false;
    }
    if (all404) {
      this.cache[slug] = { url: null, checked: new Date().toISOString() };
      this._save();
    }
    return null;
  }
}

export const DOCS_BEGIN = "<!-- docs:begin -->";
export const DOCS_END = "<!-- docs:end -->";

/** Offset where a sidecar's BODY begins: just past the `---` seam
 *  that follows the related region (and the docs block). -1 when the
 *  file doesn't have the expected shape — those are left alone. */
export function bodySeamEnd(content) {
  const s = String(content);
  const anchor = s.indexOf("<!-- related:end -->");
  const i = anchor >= 0 ? s.indexOf("\n---\n", anchor) : s.lastIndexOf("\n---\n");
  if (i < 0) return -1;
  let end = i + "\n---\n".length;
  while (s[end] === "\n") end++;
  return end;
}

/** The marked block ("" when nothing has links). Products render
 *  their curated link lists; tools render a DIRECT link when the
 *  tools map knows them (case-insensitive) and a templated search
 *  link otherwise — complete coverage with zero authoring, upgrade
 *  any tool to a direct link by adding one JSON line. */
const DOC_ACRONYMS = new Set([
  "lrs", "oid", "gp", "un", "api", "rest", "sql", "xml", "json", "csv",
  "url", "3d", "2d", "apr", "rh", "cp", "id", "ui",
]);

/** Readable link text from a slug when the crawler had no <title>:
 *  "create-and-modify-an-lrs-network" -> "Create and modify an LRS network" */
function titleFromSlug(slug) {
  const words = String(slug).split(/[-_]+/).filter(Boolean);
  if (!words.length) return "";
  return words
    .map((w, i) => (DOC_ACRONYMS.has(w) ? w.toUpperCase() : i === 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** A list field from the sidecar's own metadata yaml (`tools: [...]`,
 *  `keywords: [...]`). At rerank time these carry the ORIGINAL casing
 *  the LLM produced ("Create LRS Network from existing dataset"),
 *  where the keyword junctions only hold lowercased canonical titles. */
export function yamlList(content, key) {
  const m = new RegExp(`^${key}:\\s*(\\[.*\\])\\s*$`, "m").exec(String(content));
  if (!m) return [];
  try {
    const v = JSON.parse(m[1]);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : [];
  } catch {
    return [];
  }
}

const linkText = (entry) =>
  entry.title || titleFromSlug(String(entry.url).split("/").pop().replace(/\.html?$/, "")) || "documentation";

export function docsBlock(toolNames, m, toolLinks, topicLinks) {
  // v1.22: just the pages. The product-level "overview / essential
  // vocabulary" links are gone — identical on every doc of that
  // product, so they were pure repetition (the `products` map stays
  // in the JSON as crawl seeds). Names are gone too: the page titles
  // say what they are, and one link per page keeps the block short.
  const lines = [];
  const byUrl = new Map();
  const unmatched = [];
  const seen = new Set();
  const addNamed = (name, entry) => {
    if (!entry?.url) return;
    const rec = byUrl.get(entry.url);
    if (!rec) byUrl.set(entry.url, entry);
    else if (!rec.title && entry.title) byUrl.set(entry.url, entry);
  };
  for (const t of toolNames || []) {
    const key = lower(t).trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const direct = toolLinks?.get(t);
    if (direct) addNamed(t, direct);
    else if (m.searchTemplate) unmatched.push(t);
  }
  // topic keywords: rendered only on a strong inventory match — no
  // search fallback (a weak topic link is noise)
  for (const [name, entry] of topicLinks || []) {
    const key = lower(name).trim();
    if (!entry?.url || !key || seen.has(key)) continue;
    seen.add(key);
    addNamed(name, entry);
  }
  if (byUrl.size) {
    lines.push(
      [...byUrl.values()].map((e) => `[${linkText(e)}](${e.url})`).join(" · ")
    );
  }
  // everything with no page match collapses into ONE line of search
  // links instead of a line each
  if (unmatched.length) {
    const links = unmatched
      .slice(0, 12)
      .map((t) => `[${t}](${m.searchTemplate.replace("{q}", encodeURIComponent(String(t)))})`);
    const more = unmatched.length > 12 ? ` +${unmatched.length - 12}` : "";
    if (lines.length) lines.push("");
    lines.push(`_No page matched:_ ${links.join(" · ")}${more}`);
  }
  if (!lines.length) return "";
  return `${DOCS_BEGIN}\n## Esri documentation\n\n${lines.join("\n")}\n${DOCS_END}`;
}

/** Insert/replace/remove the marked docs block in sidecar content.
 *  Fresh insertion goes right after the related region (or before
 *  the header seam as a fallback); unrecognizable shapes are left
 *  alone rather than guessed at. */
export function upsertDocsBlock(content, block) {
  const s = String(content);
  const at = s.indexOf(DOCS_BEGIN);
  if (at >= 0) {
    const end = s.indexOf(DOCS_END, at);
    if (end < 0) return s; // malformed — don't touch
    const old = s.slice(at, end + DOCS_END.length);
    if (block === "") {
      return s.replace("\n\n" + old, "").replace(old, "");
    }
    return s.replace(old, block);
  }
  if (block === "") return s;
  const relEnd = s.indexOf("<!-- related:end -->");
  if (relEnd >= 0) {
    const cut2 = relEnd + "<!-- related:end -->".length;
    return s.slice(0, cut2) + "\n\n" + block + s.slice(cut2);
  }
  const seam = s.lastIndexOf("\n---\n");
  if (seam >= 0) return s.slice(0, seam) + "\n\n" + block + s.slice(seam);
  return s;
}
