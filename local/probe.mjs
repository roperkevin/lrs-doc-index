#!/usr/bin/env node
/**
 * probe.mjs v1.0 — field-level write probe for the Doc Index list.
 * Diagnostic for Graph 400 invalidRequest on item writes: creates a
 * junk row ("probe-delete-me"), patches each sweep-written field
 * individually, prints ok/FAIL per field, then deletes the row.
 *
 * Usage: node --experimental-strip-types local/probe.mjs --config local/config.json
 */

import fs from "node:fs";
import { GraphClient } from "./graph.mjs";

const args = process.argv.slice(2);
const cfgPath = args[args.indexOf("--config") + 1];
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
cfg.graph = cfg.graph || {};
if (!cfg.graph.tokenCache && cfg.paths?.workDir) {
  cfg.graph.tokenCache = cfg.paths.workDir + "/auth/graph.json";
}

const now = new Date().toISOString();
const FIELDS = [
  ["Title", "probe-delete-me"],
  ["FileName", "probe.docx"],
  ["DocKey", "probe|delete-me"],
  ["IndexStatus", "Skipped"],
  ["FileType", "docx"],
  ["DocKind", "Other"],
  ["Surface", "Other"],
  ["ExtractionLane", "none"],
  ["SourceModified", now],
  ["SourceEdited", now],
  ["SourceEdited(null)", null, "SourceEdited"],
  ["IndexedOn", now],
  ["PromptVersion", "probe"],
  ["TextPreview", "probe preview"],
  ["Summary", "probe summary"],
  ["DocRevision", "V0"],
  ["TargetRelease", "0.0"],
  ["PE", "Probe Person"],
  ["Dev", ""],
  ["Products", "Probe Product"],
  ["SourceAuthor", "Probe Author"],
  ["SourceEditor", "Probe Editor"],
  ["LastError", ""],
  ["SourceLink{Url,Description}", { Url: "https://example.com/probe", Description: "probe" }, "SourceLink"],
  ["SourceLink{Url}", { Url: "https://example.com/probe" }, "SourceLink"],
  ["SourceLink(string)", "https://example.com/probe", "SourceLink"],
  ["TextFileUrl{Url,Description}", { Url: "https://example.com/probe.md", Description: "probe.md" }, "TextFileUrl"],
  ["TextFileUrl(string)", "https://example.com/probe.md", "TextFileUrl"],
];

const graph = new GraphClient(cfg.graph);
const sp = cfg.sharePoint;
const siteId = await graph.siteId(sp.hostname, sp.sitePath);
const listId = sp.lists.docIndex;

let itemId;
try {
  const created = await graph.createItem(siteId, listId, { Title: "probe-delete-me" });
  itemId = created.id;
  console.log("ok   create minimal {Title} -> item", itemId);
} catch (e) {
  console.log("FAIL create minimal {Title}:", e.message.slice(0, 300));
  process.exit(1);
}

for (const [label, value, key] of FIELDS) {
  const field = key || label;
  try {
    await graph.updateItemFields(siteId, listId, itemId, { [field]: value });
    console.log("ok  ", label);
  } catch (e) {
    console.log("FAIL", label, "->", e.message.replace(/\s+/g, " ").slice(0, 220));
  }
}

try {
  await graph.deleteItem(siteId, listId, itemId);
  console.log("ok   probe row deleted");
} catch (e) {
  console.log("WARN could not delete probe row", itemId, "- remove it by hand:", e.message.slice(0, 200));
}
