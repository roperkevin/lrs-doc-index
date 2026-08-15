#!/usr/bin/env node
/**
 * doc_crawl.mjs v1.0 — enumerate every documentation page under the
 * Esri help sections we link into sidecars (Roads & Highways,
 * Pipeline Referencing), so tool/topic → page matching can work from
 * the REAL page inventory instead of guessed slugs.
 *
 * Two passes per section, cheapest first:
 *   1. sitemap: fetch {origin}/sitemap.xml and /sitemap_index.xml,
 *      follow child sitemaps, keep <loc> URLs under the section
 *      prefix. Most doc sites publish complete sitemaps — this is
 *      the reliable route.
 *   2. BFS crawl fallback (only when the sitemap yielded nothing for
 *      a section): fetch pages starting at the section root, extract
 *      href links, follow same-section .html pages. Polite: ~6
 *      requests/second, honest User-Agent, page cap per section.
 *
 * Output: URLs printed per section (sorted), and the full inventory
 * written as JSON (--out, default work/esri_doc_pages.json) for the
 * matching step to consume.
 *
 * Sections default to the folders behind probeTemplates in
 * local/esri_doc_links.json; override/add with repeated --section.
 *
 * Usage:
 *   node --experimental-strip-types local/doc_crawl.mjs
 *   node --experimental-strip-types local/doc_crawl.mjs --section https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/ --out work/pages.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = "lrs-doc-index/doc_crawl (internal documentation link mapper)";

function parseArgs(argv) {
  const args = { sections: [], out: path.join("work", "esri_doc_pages.json"), cap: 800 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--section") args.sections.push(argv[++i]);
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--cap") args.cap = Number(argv[++i]) || args.cap;
    else throw new Error(`unknown argument: ${a} (usage: [--section <url-prefix>]... [--out <file>] [--cap N])`);
  }
  if (!args.sections.length) {
    const linksFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "esri_doc_links.json");
    try {
      const map = JSON.parse(fs.readFileSync(linksFile, "utf8"));
      for (const t of map.probeTemplates || []) {
        const url = typeof t === "string" ? t : t?.url;
        if (typeof url === "string" && url.includes("{slug}")) {
          args.sections.push(url.slice(0, url.indexOf("{slug}")));
        }
      }
    } catch { /* fall through to the error below */ }
  }
  if (!args.sections.length) {
    throw new Error("no sections: pass --section <url-prefix> or add probeTemplates to esri_doc_links.json");
  }
  return args;
}

async function get(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

const locRe = /<loc>\s*([^<]+?)\s*<\/loc>/g;

/** All <loc> URLs from {origin}/sitemap.xml (+ index children). */
async function sitemapUrls(origin, seen = new Set()) {
  const out = [];
  for (const p of ["/sitemap.xml", "/sitemap_index.xml"]) {
    const url = origin + p;
    if (seen.has(url)) continue;
    seen.add(url);
    const xml = await get(url);
    if (!xml) continue;
    const locs = [...xml.matchAll(locRe)].map((m) => m[1]);
    if (/<sitemapindex/i.test(xml)) {
      for (const child of locs.slice(0, 50)) {
        if (seen.has(child)) continue;
        seen.add(child);
        const childXml = await get(child);
        if (childXml) out.push(...[...childXml.matchAll(locRe)].map((m) => m[1]));
        await sleep(150);
      }
    } else {
      out.push(...locs);
    }
  }
  return out;
}

const hrefRe = /href\s*=\s*["']([^"'#]+)["']/gi;

/** BFS within the section prefix, .html pages only. */
async function crawlSection(section, cap) {
  const urls = new Set();
  const visited = new Set();
  const queue = [section];
  while (queue.length && visited.size < cap) {
    const u = queue.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    const html = await get(u);
    await sleep(150);
    if (!html) continue;
    if (u.endsWith(".html")) urls.add(u);
    for (const m of html.matchAll(hrefRe)) {
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
      if (s.endsWith(".html") || s.endsWith("/")) queue.push(s);
    }
  }
  return urls;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inventory = {};
  const smCache = new Map(); // origin -> sitemap urls (fetched once)
  for (const section of args.sections) {
    const sec = section.endsWith("/") ? section : section + "/";
    process.stderr.write(`== ${sec}\n`);
    const origin = new URL(sec).origin;
    if (!smCache.has(origin)) smCache.set(origin, await sitemapUrls(origin));
    const fromSitemap = smCache.get(origin).filter((u) => u.startsWith(sec));
    let urls;
    if (fromSitemap.length) {
      urls = new Set(fromSitemap);
      process.stderr.write(`   sitemap: ${urls.size} page(s)\n`);
    } else {
      process.stderr.write("   sitemap empty for this section — crawling\n");
      urls = await crawlSection(sec, args.cap);
      process.stderr.write(`   crawl: ${urls.size} page(s)\n`);
    }
    inventory[sec] = [...urls].sort();
    for (const u of inventory[sec]) process.stdout.write(u + "\n");
  }
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, JSON.stringify(inventory, null, 1));
  const total = Object.values(inventory).reduce((n, a) => n + a.length, 0);
  process.stderr.write(`\n${total} page URL(s) across ${args.sections.length} section(s) -> ${args.out}\n`);
}

main().catch((e) => {
  process.stderr.write("doc_crawl: " + (e.stack || e.message) + "\n");
  process.exit(1);
});
