#!/usr/bin/env node
/**
 * probe.mjs v1.1 — write probes for the Doc Index list.
 *
 * Default: Graph field probe — creates a junk row ("probe-delete-me"),
 * patches each sweep-written field individually, prints ok/FAIL per
 * field, deletes the row.
 *
 * --spo: SPO auth/write probe — mints the SharePoint token the sweep
 * would use, prints its decoded claims (aud/appid/scp/upn — locally,
 * nothing leaves the machine), then attempts one hyperlink write via
 * ValidateUpdateListItem on a junk row and cleans up.
 *
 * Usage: node --experimental-strip-types local/probe.mjs --config local/config.json [--spo]
 */

import fs from "node:fs";
import path from "node:path";
import { GraphClient, SpoClient } from "./graph.mjs";

const args = process.argv.slice(2);
const cfgPath = args[args.indexOf("--config") + 1];
const spoMode = args.includes("--spo");
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
cfg.graph = cfg.graph || {};
const authDir = path.join(cfg.paths?.workDir || ".", "auth");
if (!cfg.graph.tokenCache) cfg.graph.tokenCache = path.join(authDir, "graph.json");
// mirror sweep.mjs's spo defaulting
cfg.spo = {
  tenantId: cfg.graph.tenantId,
  siteUrl: "https://esriis.sharepoint.com/sites/lrsworkspace",
  tokenCache: path.join(authDir, "spo.json"),
  ...(cfg.spo || {}),
};

function jwtClaims(token) {
  try {
    const payload = token.split(".")[1].replaceAll("-", "+").replaceAll("_", "/");
    const c = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    return { aud: c.aud, appid: c.appid || c.azp, scp: c.scp, upn: c.upn || c.preferred_username, ver: c.ver, exp: new Date(c.exp * 1000).toISOString() };
  } catch {
    return { note: "token is not a decodable JWT (opaque)" };
  }
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

if (spoMode) {
  const spo = new SpoClient(cfg.spo);
  let token;
  try {
    token = await spo.token();
    console.log("ok   SPO token minted");
    console.log("     claims:", JSON.stringify(jwtClaims(token)));
  } catch (e) {
    console.log("FAIL SPO token:", e.message.slice(0, 400));
    process.exit(1);
  }
  let id;
  try {
    const created = await graph.createItem(siteId, listId, { Title: "probe-delete-me" });
    id = Number(created.id);
    await spo.validateUpdate(listId, id, {
      SourceLink: { Url: "https://example.com/probe", Description: "probe" },
    });
    console.log("ok   SPO hyperlink write via ValidateUpdateListItem");
  } catch (e) {
    console.log("FAIL SPO hyperlink write:", e.message.replace(/\s+/g, " ").slice(0, 400));
  } finally {
    if (id) {
      try {
        await graph.deleteItem(siteId, listId, id);
        console.log("ok   probe row deleted");
      } catch (e) {
        console.log("WARN could not delete probe row", id, "-", e.message.slice(0, 200));
      }
    }
  }
  process.exit(0);
}

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
