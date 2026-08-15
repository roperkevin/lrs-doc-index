#!/usr/bin/env node
/**
 * doc_crawl.mjs v1.1 — enumerate every documentation page under the
 * Esri help sections we link into sidecars, so tool/topic → page
 * matching can work from the REAL page inventory.
 *
 * v1.1 (first live run found 0 pages, silently): now diagnosable and
 * far more resilient —
 *   - sitemap DISCOVERY: robots.txt "Sitemap:" directives + candidate
 *     sitemap.xml at every ancestor path of the section, not just the
 *     origin root; each attempt prints its HTTP status.
 *   - BFS SEEDS: the section root often 404s (no directory index), so
 *     the crawl also seeds from every known page under the section in
 *     esri_doc_links.json (products + tools URLs) — the owner-verified
 *     pages guarantee at least one living entry point.
 *   - UA: browser-like by default (CDNs 403 obvious bots); --ua
 *     overrides. Rate limit unchanged (~6 req/s).
 *   - Loud: seed/sitemap fetches print status; a 200 page yielding
 *     zero same-section links prints a JS-rendered-site warning.
 *
 * Output: URLs to stdout; inventory JSON to --out (default
 * work/esri_doc_pages.json).
 *
 * Usage:
 *   node --experimental-strip-types local/doc_crawl.mjs
 *   ... [--section <url-prefix>]... [--out <file>] [--cap N] [--ua <string>] [--verbose]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs(argv) {
  const args = {
    sections: [],
    out: path.join("work", "esri_doc_pages.json"),
    cap: 800,
    verbose: false,
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) lrs-doc-index-crawler",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--section") args.sections.push(argv[++i]);
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--cap") args.cap = Number(argv[++i]) || args.cap;
    else if (a === "--ua") args.ua = argv[++i];
    else if (a === "--verbose") args.verbose = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

function loadLinkMap() {
  const linksFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "esri_doc_links.json");
  try {
    return JSON.parse(fs.readFileSync(linksFile, "utf8")) || {};
  } catch {
    return {};
  }
}

function defaultSections(map) {
  const out = [];
  for (const t of map.probeTemplates || []) {
    const url = typeof t === "string" ? t : t?.url;
    if (typeof url === "string" && url.includes("{slug}")) {
      out.push(url.slice(0, url.indexOf("{slug}")));
    }
  }
  return out;
}

/** Every known page URL in the links map (seeds for the BFS). */
function knownUrls(map) {
  const out = [];
  for (const k in map.products || {}) {
    for (const l of map.products[k] || []) {
      if (l && typeof l.url === "string") out.push(l.url);
    }
  }
  for (const k in map.tools || {}) {
    if (typeof map.tools[k] === "string") out.push(map.tools[k]);
  }
  return out;
}

let UA = "";
async function get(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
      signal: AbortSignal.timeout(20000),
    });
    const text = res.ok ? await res.text() : "";
    return { status: res.status, ok: res.ok, text };
  } catch (e) {
    return { status: 0, ok: false, text: "", err: e.cause?.code || e.name || e.message };
  }
}

const say = (s) => process.stderr.write(s + "\n");
const statusOf = (r) => (r.status === 0 ? `error(${r.err})` : String(r.status));
const locRe = /<loc>\s*([^<]+?)\s*<\/loc>/g;

/** Candidate sitemap URLs: robots.txt directives + ancestor paths. */
async function sitemapCandidates(section) {
  const u = new URL(section);
  const candidates = [];
  const robots = await get(u.origin + "/robots.txt");
  say(`   robots.txt -> ${statusOf(robots)}`);
  if (robots.ok) {
    for (const m of robots.text.matchAll(/^\s*sitemap:\s*(\S+)/gim)) candidates.push(m[1]);
  }
  const segs = u.pathname.split("/").filter(Boolean);
  for (let i = 0; i <= Math.min(segs.length, 4); i++) {
    const base = u.origin + (i ? "/" + segs.slice(0, i).join("/") : "");
    candidates.push(base + "/sitemap.xml");
  }
  candidates.push(u.origin + "/sitemap_index.xml");
  return [...new Set(candidates)];
}

const smFetched = new Map(); // sitemap url -> [locs]
async function sitemapLocs(smUrl) {
  if (smFetched.has(smUrl)) return smFetched.get(smUrl);
  const r = await get(smUrl);
  say(`   sitemap? ${smUrl} -> ${statusOf(r)}`);
  let locs = [];
  if (r.ok) {
    const found = [...r.text.matchAll(locRe)].map((m) => m[1]);
    if (/<sitemapindex/i.test(r.text)) {
      for (const child of found.slice(0, 50)) {
        locs.push(...(await sitemapLocs(child)));
        await sleep(150);
      }
    } else {
      locs = found;
    }
  }
  smFetched.set(smUrl, locs);
  return locs;
}

const hrefRe = /href\s*=\s*["']([^"'#]+)["']/gi;

/** The page's own <title>, minus the site suffix ("Add calibration
 *  points | ArcGIS Pro documentation" -> "Add calibration points").
 *  Real titles make far better sidecar link text than "documentation". */
function pageTitle(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html || "");
  if (!m) return "";
  return m[1]
    .replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .split("|")[0]
    .replace(/\s+/g, " ")
    .trim();
}

async function crawlSection(section, seeds, cap, verbose, titles) {
  const urls = new Set();
  const visited = new Set();
  const queue = [...new Set([section, ...seeds])];
  let fetched = 0;
  while (queue.length && visited.size < cap) {
    const u = queue.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    const r = await get(u);
    fetched++;
    await sleep(160);
    if (fetched <= 6 || verbose) say(`   seed/page ${u} -> ${statusOf(r)}`);
    if (!r.ok) continue;
    if (u.endsWith(".html")) {
      urls.add(u);
      const t = pageTitle(r.text);
      if (t) titles.set(u, t);
    }
    let kept = 0;
    for (const m of r.text.matchAll(hrefRe)) {
      let link;
      try {
        link = new URL(m[1], u);
      } catch {
        continue;
      }
      link.hash = "";
      link.search = "";
      const s = link.toString();
      if (!s.startsWith(section) || visited.has(s)) continue;
      if (s.endsWith(".html") || s.endsWith("/")) {
        queue.push(s);
        kept++;
      }
    }
    if (kept === 0 && r.ok && (fetched <= 6 || verbose)) {
      say(`     (200 but no same-section links in the HTML — JS-rendered page?)`);
    }
  }
  return urls;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  UA = args.ua;
  const map = loadLinkMap();
  const sections = args.sections.length ? args.sections : defaultSections(map);
  if (!sections.length) {
    throw new Error("no sections: pass --section <url-prefix> or add probeTemplates to esri_doc_links.json");
  }
  const known = knownUrls(map);
  const inventory = {};
  const titles = new Map();
  for (const raw of sections) {
    const sec = raw.endsWith("/") ? raw : raw + "/";
    say(`== ${sec}`);
    let urls = new Set();
    for (const cand of await sitemapCandidates(sec)) {
      const locs = await sitemapLocs(cand);
      for (const loc of locs) if (loc.startsWith(sec)) urls.add(loc);
      if (urls.size) break; // first sitemap that covers the section wins
    }
    if (urls.size) {
      say(`   sitemap: ${urls.size} page(s)`);
    } else {
      const seeds = known.filter((k) => k.startsWith(sec));
      say(`   sitemap empty — crawling from root + ${seeds.length} known seed page(s)`);
      urls = await crawlSection(sec, seeds, args.cap, args.verbose, titles);
      say(`   crawl: ${urls.size} page(s)`);
    }
    // {url, title} entries — the title is the page's own <title>
    // (crawl mode); sitemap-only sections carry url alone
    inventory[sec] = [...urls].sort().map((u) =>
      titles.has(u) ? { url: u, title: titles.get(u) } : { url: u }
    );
    for (const e of inventory[sec]) {
      process.stdout.write(e.title ? `${e.url}  ${e.title}\n` : e.url + "\n");
    }
  }
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, JSON.stringify(inventory, null, 1));
  const total = Object.values(inventory).reduce((n, a) => n + a.length, 0);
  say(`\n${total} page URL(s) across ${sections.length} section(s) -> ${args.out}`);
}

main().catch((e) => {
  process.stderr.write("doc_crawl: " + (e.stack || e.message) + "\n");
  process.exit(1);
});
