#!/usr/bin/env node
/**
 * probe.mjs v1.2 — write probes for the Doc Index list.
 *
 * Default: Graph field probe — creates a junk row ("probe-delete-me"),
 * patches each sweep-written field individually, prints ok/FAIL per
 * field, deletes the row.
 *
 * --spo: SPO token MATRIX — redeems the already-cached refresh tokens
 * (no new sign-in prompts) for every candidate SharePoint token shape
 * (v1 resource form, v2 named scopes, both public clients), and for
 * each one prints the decoded claims (locally — nothing leaves the
 * machine), a plain GET /_api/web check, and a hyperlink write via
 * ValidateUpdateListItem, including the WWW-Authenticate header on
 * 401 (where SharePoint reports the real reason). Ends with a
 * WINNERS line naming every shape that fully worked.
 *
 * Usage: node --experimental-strip-types local/probe.mjs --config local/config.json [--spo]
 */

import fs from "node:fs";
import path from "node:path";
import { GraphClient } from "./graph.mjs";
import {
  DelegatedAuth,
  redeemRefreshToken,
  GRAPH_PUBLIC_CLIENT,
  AZURE_CLI_PUBLIC_CLIENT,
} from "./auth.mjs";

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
  const origin = new URL(cfg.spo.siteUrl).origin;
  console.log("probe v1.2 --spo token matrix");
  console.log("     site:", cfg.spo.siteUrl);
  console.log("     tenant:", cfg.spo.tenantId || "organizations");

  // make sure a refresh token exists for the Azure CLI client — a
  // device sign-in happens only when the cache is empty or dead
  const spoAuth = new DelegatedAuth({
    clientId: cfg.spo.clientId || AZURE_CLI_PUBLIC_CLIENT,
    resource: origin,
    cachePath: cfg.spo.tokenCache,
    tenantId: cfg.spo.tenantId,
  });
  await spoAuth.token();
  const spoCache = JSON.parse(fs.readFileSync(cfg.spo.tokenCache, "utf8"));
  let graphCache = null;
  try {
    graphCache = JSON.parse(fs.readFileSync(cfg.graph.tokenCache, "utf8"));
  } catch { /* no graph cache yet */ }

  const azcli = cfg.spo.clientId || AZURE_CLI_PUBLIC_CLIENT;
  const strategies = [
    { label: "azcli    v1 resource=" + origin, clientId: azcli, rt: spoCache.refresh_token, resource: origin },
    { label: "azcli    v1 resource=" + origin + "/", clientId: azcli, rt: spoCache.refresh_token, resource: origin + "/" },
    { label: "azcli    v2 scope=AllSites.Write", clientId: azcli, rt: spoCache.refresh_token, scopes: [`${origin}/AllSites.Write`, "offline_access"] },
    { label: "azcli    v2 scope=AllSites.FullControl", clientId: azcli, rt: spoCache.refresh_token, scopes: [`${origin}/AllSites.FullControl`, "offline_access"] },
    { label: "azcli    v2 scope=.default", clientId: azcli, rt: spoCache.refresh_token, scopes: [`${origin}/.default`, "offline_access"] },
  ];
  if (graphCache?.refresh_token) {
    strategies.push(
      { label: "graphcli v1 resource=" + origin, clientId: GRAPH_PUBLIC_CLIENT, rt: graphCache.refresh_token, resource: origin },
      { label: "graphcli v2 scope=AllSites.Write", clientId: GRAPH_PUBLIC_CLIENT, rt: graphCache.refresh_token, scopes: [`${origin}/AllSites.Write`, "offline_access"] },
    );
  }

  const created = await graph.createItem(siteId, listId, { Title: "probe-delete-me" });
  const id = Number(created.id);
  const winners = [];
  for (const s of strategies) {
    console.log("\n---", s.label);
    const r = await redeemRefreshToken({
      clientId: s.clientId,
      refreshToken: s.rt,
      tenantId: cfg.spo.tenantId,
      resource: s.resource,
      scopes: s.scopes,
    });
    if (!r.ok) {
      console.log(
        "FAIL redeem:",
        `${r.json.error || r.status} ${String(r.json.error_description || "").split("\n")[0].slice(0, 220)}`
      );
      continue;
    }
    const token = r.json.access_token;
    console.log("     claims:", JSON.stringify(jwtClaims(token)));
    const get = await fetch(`${cfg.spo.siteUrl}/_api/web?$select=Title`, {
      headers: { accept: "application/json;odata=nometadata", authorization: "Bearer " + token },
    });
    console.log(
      get.ok
        ? "ok   GET /_api/web"
        : `FAIL GET /_api/web: ${get.status} | www-authenticate: ${String(get.headers.get("www-authenticate") || "(none)").slice(0, 300)}`
    );
    const res = await fetch(
      `${cfg.spo.siteUrl}/_api/web/lists(guid'${listId}')/items(${id})/ValidateUpdateListItem`,
      {
        method: "POST",
        headers: {
          accept: "application/json;odata=nometadata",
          "content-type": "application/json;odata=nometadata",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          formValues: [{ FieldName: "SourceLink", FieldValue: "https://example.com/probe, probe" }],
          bNewDocumentUpdate: false,
        }),
      }
    );
    if (!res.ok) {
      console.log(`FAIL write: ${res.status} ${(await res.text()).replace(/\s+/g, " ").slice(0, 200)}`);
      console.log("     www-authenticate:", String(res.headers.get("www-authenticate") || "(none)").slice(0, 400));
      continue;
    }
    const json = await res.json();
    const failed = (json.value || []).filter((f) => f.ErrorMessage);
    if (failed.length) {
      console.log(
        "FAIL write (field):",
        failed.map((f) => `${f.FieldName}: ${f.ErrorMessage}`).join("; ").slice(0, 300)
      );
      continue;
    }
    console.log("ok   hyperlink write succeeded");
    winners.push(s.label);
  }
  try {
    await graph.deleteItem(siteId, listId, id);
    console.log("\nok   probe row deleted");
  } catch (e) {
    console.log("\nWARN could not delete probe row", id, "-", e.message.slice(0, 200));
  }
  console.log(
    winners.length
      ? "WINNERS: " + winners.join(" | ")
      : "NO STRATEGY SUCCEEDED — paste this whole output back"
  );
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
