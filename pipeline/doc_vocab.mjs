#!/usr/bin/env node
/**
 * doc_vocab.mjs v1.0 — write pipeline/data/lrs_vocabulary.json from
 * the Esri documentation: every tool of the Location Referencing
 * toolbox (the toolbox overview page, then each toolset's overview it
 * links) and every term of the essential-vocabulary help pages.
 *
 * The sweep and curate read the committed JSON and never fetch, so
 * this runs by hand on a machine that can reach doc.esri.com — once,
 * and again when a release adds tools (the file records when and from
 * where it was generated). The hand-kept `widgets` list in the
 * existing file (Experience Builder widgets, ribbon tools — in no
 * toolbox) is carried over untouched.
 *
 * Usage:
 *   node --experimental-strip-types pipeline/doc_vocab.mjs                  fetch the default pages
 *   ... --toolbox <url> [--toolbox <url>]   toolbox overview page(s) (default: Location Referencing)
 *   ... --vocab <url> [--vocab <url>]       vocabulary page(s) (default: Roads and Highways, Pipeline Referencing)
 *   ... --from-dir <dir>                    read <slug>.html files saved there instead of fetching
 *                                           (curl -o work\an-overview-of-the-location-referencing-toolbox.html …)
 *   ... --out <file>                        default pipeline/data/lrs_vocabulary.json
 *   ... --dry-run                           print the counts, write nothing
 */

import fs from "node:fs";
import path from "node:path";
import { parseToolboxPage, parseVocabularyPage, VOCABULARY_FILE } from "./lib/vocabulary.mjs";

const DEFAULT_TOOLBOXES = [
  "https://doc.esri.com/en/arcgis-pro/latest/tool-reference/location-referencing/an-overview-of-the-location-referencing-toolbox.html",
];
const DEFAULT_VOCABS = [
  "https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/essential-roads-and-highways-vocabulary.html",
  "https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/essential-pipeline-referencing-vocabulary.html",
];
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) lrs-doc-index-vocab";

function parseArgs(argv) {
  const a = { toolboxes: [], vocabs: [], fromDir: "", out: VOCABULARY_FILE, dry: false };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === "--toolbox") a.toolboxes.push(argv[++i]);
    else if (x === "--vocab") a.vocabs.push(argv[++i]);
    else if (x === "--from-dir") a.fromDir = argv[++i];
    else if (x === "--out") a.out = argv[++i];
    else if (x === "--dry-run") a.dry = true;
    else throw new Error(`unknown argument: ${x}`);
  }
  if (!a.toolboxes.length) a.toolboxes = DEFAULT_TOOLBOXES;
  if (!a.vocabs.length) a.vocabs = DEFAULT_VOCABS;
  return a;
}

const slugOf = (url) => String(url).replace(/[?#].*$/, "").replace(/^.*\//, "").replace(/\.html?$/i, "");
const say = (s) => process.stderr.write(s + "\n");

/** The page's HTML, or null with a note: from the directory, or fetched. */
async function pageHtml(url, fromDir) {
  if (fromDir) {
    const file = path.join(fromDir, slugOf(url) + ".html");
    if (!fs.existsSync(file)) {
      say(`   not in ${fromDir}: ${path.basename(file)} — save it with  curl.exe -L -A "Mozilla/5.0" -o ${file} "${url}"`);
      return null;
    }
    return fs.readFileSync(file, "utf8");
  }
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(20000) });
    if (!res.ok) { say(`   HTTP ${res.status}: ${url}`); return null; }
    return await res.text();
  } catch (e) {
    say(`   fetch failed: ${url} — ${e.message}`);
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const tools = [];
  const seen = new Set();
  const sources = [];
  const queue = [...args.toolboxes];
  const visited = new Set();
  say(`doc_vocab — ${args.fromDir ? `reading ${args.fromDir}` : "fetching doc.esri.com"}`);
  while (queue.length) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    say(`toolbox page: ${url}`);
    const html = await pageHtml(url, args.fromDir);
    if (!html) continue;
    const page = parseToolboxPage(html, url);
    sources.push({ url, title: page.title, tools: page.tools.length });
    for (const t of page.tools) {
      const key = t.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      tools.push({ name: t.name, toolset: t.toolset, url: t.url, description: t.description });
    }
    say(`   ${page.title}: ${page.tools.length} tool(s), ${page.toolsets.length} toolset(s)`);
    for (const ts of page.toolsets) queue.push(ts.url);
  }
  const terms = [];
  const seenTerms = new Map();
  for (const url of args.vocabs) {
    say(`vocabulary page: ${url}`);
    const html = await pageHtml(url, args.fromDir);
    if (!html) continue;
    const page = parseVocabularyPage(html, url);
    sources.push({ url, title: page.title, terms: page.terms.length });
    // the Roads and Highways and Pipeline Referencing pages define most
    // terms twice, nearly verbatim: one entry per term, every page that
    // defines it in `sources`, the first page's definition and url
    for (const t of page.terms) {
      const key = t.term.toLowerCase();
      const prev = seenTerms.get(key);
      if (prev) { prev.sources.push(page.title); continue; }
      const entry = { term: t.term, definition: t.definition, url: t.url, sources: [page.title] };
      seenTerms.set(key, entry);
      terms.push(entry);
    }
    say(`   ${page.title}: ${page.terms.length} term(s)`);
  }
  tools.sort((a, b) => a.name.localeCompare(b.name));
  terms.sort((a, b) => a.term.localeCompare(b.term));
  let widgets = [];
  try {
    const prev = JSON.parse(fs.readFileSync(args.out, "utf8"));
    if (Array.isArray(prev.widgets)) widgets = prev.widgets;
  } catch { /* first run */ }
  const out = {
    $comment: "Generated by pipeline/doc_vocab.mjs from the Esri documentation — do not edit tools/terms by hand; " +
      "re-run the script after a release. `widgets` is hand-kept: Experience Builder widgets and ribbon tools " +
      "(in no toolbox) the classifier may name; add {name, url} entries there.",
    generated: new Date().toISOString(),
    sources,
    tools,
    widgets,
    terms,
  };
  const line = `tools=${tools.length} terms=${terms.length} widgets=${widgets.length} pages=${sources.length} of ${visited.size + args.vocabs.length}`;
  if (args.dry) {
    process.stdout.write(`dry run: ${line} — nothing written\n`);
    return;
  }
  if (!tools.length && !terms.length) throw new Error(`nothing parsed from any page — ${line}; not overwriting ${args.out}`);
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, JSON.stringify(out, null, 1) + "\n");
  process.stdout.write(`${line} → ${args.out}\n`);
}

main().catch((e) => {
  process.stderr.write(`doc_vocab: ${e.message}\n`);
  process.exitCode = 1;
});
