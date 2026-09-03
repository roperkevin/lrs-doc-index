/**
 * graph.mjs v1.0 — minimal Microsoft Graph client for the local Doc
 * Index sweep. List rows only: document content and sidecars move
 * through the OneDrive-synced library (plain file I/O), so Graph is
 * needed solely for the six SharePoint lists.
 *
 * Auth — two modes (config.graph.auth, default "device"):
 *   "device" — delegated sign-in as the user via the OAuth device
 *     code flow (local/auth.mjs) using Microsoft's pre-registered
 *     Graph public client. NO app registration needed; the user's
 *     own SharePoint permissions apply (the cloud flow's connection
 *     identity model). Scope: Sites.ReadWrite.All + offline_access.
 *   "app" — Entra app registration, client-credentials grant
 *     (application permission Sites.Selected/Sites.ReadWrite.All).
 *     Selected automatically when clientSecret is configured.
 *
 * Config (config.graph):
 *   auth         "device" (default) | "app"
 *   tenantId     Entra tenant GUID/domain (optional in device mode;
 *                defaults to "organizations")
 *   clientId     device: public client override (default: Graph CLI
 *                app); app: the registration's client id
 *   clientSecret app mode only; {"$env":"DOCINDEX_GRAPH_SECRET"}
 *   tokenCache   device mode: refresh-token cache file path
 *   baseUrl      default "https://graph.microsoft.com/v1.0"
 *                (harness points this at a local mock)
 *   tokenUrl/deviceUrl  default derived from tenantId (mock override)
 *   maxRetries   default 4 (429 honors Retry-After; 5xx/network backoff)
 *
 * Unlike the cloud flow — whose Create_idrow/Create_link/Create_dockw
 * actions embed list GUIDs in hand-typed URIs (SP_Adaptation_Notes,
 * FX-6) — every call here builds its URL from config, so a list
 * re-creation is a one-line config change.
 */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Every fetch below carries a timeout: one hung socket must never
// stall a scheduled run past its next fire (the retry loops treat a
// timeout like any other network error). Override via config
// timeoutMs on the respective section.
const GRAPH_TIMEOUT_MS = 120000;
const timeout = (cfg) =>
  AbortSignal.timeout(cfg.timeoutMs === undefined ? GRAPH_TIMEOUT_MS : Number(cfg.timeoutMs));

function resolveSecret(v, what) {
  if (v && typeof v === "object" && v.$env) {
    const s = process.env[String(v.$env)];
    if (!s) throw new Error(`${what}: environment variable ${v.$env} is not set`);
    return s;
  }
  if (typeof v === "string" && v !== "") return v;
  throw new Error(`${what}: missing (set it in config, ideally as {"$env": "..."})`);
}

import { DelegatedAuth, GRAPH_PUBLIC_CLIENT } from "./auth.mjs";

export class GraphClient {
  constructor(cfg) {
    this.cfg = cfg;
    this.baseUrl = cfg.baseUrl || "https://graph.microsoft.com/v1.0";
    this.tokenUrl =
      cfg.tokenUrl ||
      `https://login.microsoftonline.com/${cfg.tenantId || "organizations"}/oauth2/v2.0/token`;
    this.maxRetries = cfg.maxRetries === undefined ? 4 : Number(cfg.maxRetries);
    this.mode = cfg.auth || (cfg.clientSecret !== undefined ? "app" : "device");
    if (this.mode === "device" || this.mode === "interactive") {
      this.delegated = new DelegatedAuth({
        mode: this.mode,
        clientId: cfg.clientId || GRAPH_PUBLIC_CLIENT,
        scopes: ["https://graph.microsoft.com/Sites.ReadWrite.All", "offline_access"],
        cachePath: cfg.tokenCache,
        tenantId: cfg.tenantId,
        deviceUrl: cfg.deviceUrl,
        authorizeUrl: cfg.authorizeUrl,
        redirectHost: cfg.redirectHost,
        tokenUrl: cfg.tokenUrl,
      });
    }
    this._token = null;
    this._tokenExpires = 0;
  }

  async token() {
    if (this.delegated) return this.delegated.token();
    if (this._token && Date.now() < this._tokenExpires - 60000) return this._token;
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.cfg.clientId,
      client_secret: resolveSecret(this.cfg.clientSecret, "graph.clientSecret"),
      scope: "https://graph.microsoft.com/.default",
    });
    const res = await fetch(this.tokenUrl, { method: "POST", body, signal: timeout(this.cfg) });
    if (!res.ok) {
      throw new Error(`Graph token request failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    }
    const json = await res.json();
    this._token = json.access_token;
    this._tokenExpires = Date.now() + Number(json.expires_in || 3600) * 1000;
    return this._token;
  }

  async request(method, url, body) {
    const full = url.startsWith("http") ? url : this.baseUrl + url;
    let lastErr;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0 && !this._retryAfter) {
        await sleep(Math.min(2000 * 2 ** (attempt - 1), 30000));
      }
      this._retryAfter = false;
      let res;
      try {
        res = await fetch(full, {
          method,
          headers: {
            authorization: "Bearer " + (await this.token()),
            "content-type": "application/json",
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: timeout(this.cfg),
        });
      } catch (e) {
        lastErr = new Error(`Graph ${method} ${url}: ${e.message}`);
        continue;
      }
      if (res.status === 429 || res.status === 503) {
        const wait = Number(res.headers.get("retry-after") || 5);
        lastErr = new Error(`Graph ${method} ${url}: throttled (${res.status})`);
        await sleep(wait * 1000);
        this._retryAfter = true;
        continue;
      }
      if (res.status >= 500) {
        lastErr = new Error(`Graph ${method} ${url}: ${res.status}`);
        continue;
      }
      if (res.status === 401) {
        // token may have expired mid-run — refresh and retry
        this._token = null;
        if (this.delegated) this.delegated.invalidate();
        lastErr = new Error(`Graph ${method} ${url}: 401`);
        continue;
      }
      if (!res.ok) {
        throw new Error(`Graph ${method} ${url}: ${res.status} ${(await res.text()).slice(0, 500)}`);
      }
      return res.status === 204 ? null : res.json();
    }
    throw lastErr;
  }

  /** Resolve the site id once per run: hostname like "esriis.sharepoint.com",
   *  sitePath like "/sites/lrsworkspace". */
  async siteId(hostname, sitePath) {
    const json = await this.request("GET", `/sites/${hostname}:${sitePath}`);
    return json.id;
  }

  /** All items of a list, expanded fields, following @odata.nextLink.
   *  opts: { filter, select (array of field names), top } */
  async listItems(siteId, listId, opts = {}) {
    const params = new URLSearchParams();
    params.set(
      "expand",
      opts.select ? `fields($select=${opts.select.join(",")})` : "fields"
    );
    if (opts.filter) params.set("$filter", opts.filter);
    if (opts.top) params.set("$top", String(opts.top));
    let url = `/sites/${siteId}/lists/${listId}/items?${params}`;
    const items = [];
    while (url) {
      const page = await this.request("GET", url);
      for (const it of page.value || []) items.push(it);
      url = page["@odata.nextLink"] || null;
    }
    return items;
  }

  async createItem(siteId, listId, fields) {
    return this.request("POST", `/sites/${siteId}/lists/${listId}/items`, { fields });
  }

  async updateItemFields(siteId, listId, itemId, fields) {
    return this.request(
      "PATCH",
      `/sites/${siteId}/lists/${listId}/items/${itemId}/fields`,
      fields
    );
  }

  async deleteItem(siteId, listId, itemId) {
    return this.request("DELETE", `/sites/${siteId}/lists/${listId}/items/${itemId}`);
  }

  /** Download a library file's bytes via its list item's driveItem
   *  (Graph answers with a 302 to a pre-authorized URL; fetch follows
   *  it). The sweep's OneDrive-sync-lag fallback (v1.33). */
  async getItemContentBuffer(siteId, listId, itemId) {
    const url = `${this.baseUrl}/sites/${siteId}/lists/${listId}/items/${itemId}/driveItem/content`;
    let res;
    for (let attempt = 0; attempt < 2; attempt++) {
      res = await fetch(url, {
        headers: { authorization: "Bearer " + (await this.token()) },
        redirect: "follow",
        signal: timeout(this.cfg),
      });
      if (res.status !== 401) break;
      this._token = null;
      if (this.delegated) this.delegated.invalidate();
    }
    if (!res.ok) {
      throw new Error(
        `Graph GET driveItem content (item ${itemId}): ${res.status} ${(await res.text()).slice(0, 300)}`
      );
    }
    return Buffer.from(await res.arrayBuffer());
  }

  // ---- drive APIs (remote-files mode, sweep v1.39) ----------------
  // The sidecar library is its own SharePoint drive; these let the
  // sweep run with NO OneDrive sync: mirror-down reads, write-through
  // uploads, deletes. Paths are drive-root-relative, "/"-separated.

  async listDrives(siteId) {
    return (await this.request("GET", `/sites/${siteId}/drives`)).value || [];
  }

  /** Every live item in the drive (initial delta sweep, flat, with
   *  eTags + parent paths). The trailing deltaLink is not kept — each
   *  run does one full pass; the mirror manifest dedupes downloads. */
  async driveDeltaAll(driveId) {
    let url = `/drives/${driveId}/root/delta`;
    const items = [];
    while (url) {
      const page = await this.request("GET", url);
      for (const it of page.value || []) items.push(it);
      url = page["@odata.nextLink"] || null;
    }
    return items;
  }

  _drivePath(driveId, relPath, suffix) {
    const enc = String(relPath).split("/").map(encodeURIComponent).join("/");
    return `${this.baseUrl}/drives/${driveId}/root:/${enc}:${suffix}`;
  }

  async getDriveFileByPath(driveId, relPath) {
    const url = this._drivePath(driveId, relPath, "/content");
    let res;
    for (let attempt = 0; attempt < 2; attempt++) {
      res = await fetch(url, {
        headers: { authorization: "Bearer " + (await this.token()) },
        redirect: "follow",
        signal: timeout(this.cfg),
      });
      if (res.status !== 401) break;
      this._token = null;
      if (this.delegated) this.delegated.invalidate();
    }
    if (!res.ok) {
      throw new Error(`Graph GET drive file ${relPath}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    }
    return Buffer.from(await res.arrayBuffer());
  }

  /** Simple upload (≤ 4 MB — sidecars, figures and capped media all
   *  fit; larger files need an upload session and are refused). */
  async putDriveFile(driveId, relPath, data) {
    if (data.length > 4 * 1024 * 1024) {
      throw new Error(`drive upload ${relPath}: ${data.length} bytes exceeds the 4 MB simple-upload cap`);
    }
    const url = this._drivePath(driveId, relPath, "/content");
    let res;
    for (let attempt = 0; attempt < 2; attempt++) {
      res = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + (await this.token()),
          "content-type": "application/octet-stream",
        },
        body: data,
        signal: timeout(this.cfg),
      });
      if (res.status !== 401) break;
      this._token = null;
      if (this.delegated) this.delegated.invalidate();
    }
    if (!res.ok) {
      throw new Error(`Graph PUT drive file ${relPath}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    }
    return res.json();
  }

  /** Delete by path; a 404 (already gone) is not an error. */
  async deleteDriveFileByPath(driveId, relPath) {
    try {
      await this.request("DELETE", `/drives/${driveId}/root:/${String(relPath).split("/").map(encodeURIComponent).join("/")}:`);
    } catch (e) {
      if (!/: 404 /.test(String(e.message)) && !String(e.message).endsWith(": 404")) throw e;
    }
  }

  /** Create/overwrite a file in the site's DEFAULT drive (the
   *  "Documents"/Shared Documents library) by drive-root path, e.g.
   *  "/Keyword_Curation_Digest.md". Used for files that live outside
   *  any synced folder (the curation digest, deliberately outside
   *  the LRS Doc Index library so the Q&A agent never ingests it). */
  async putFile(siteId, drivePath, content) {
    const url = `${this.baseUrl}/sites/${siteId}/drive/root:${drivePath}:/content`;
    let res;
    for (let attempt = 0; attempt < 2; attempt++) {
      res = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + (await this.token()),
          "content-type": "text/markdown",
        },
        body: content,
        signal: timeout(this.cfg),
      });
      if (res.status !== 401) break;
      this._token = null;
      if (this.delegated) this.delegated.invalidate();
    }
    if (!res.ok) {
      throw new Error(`Graph PUT ${drivePath}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    }
    return res.json();
  }
}

/**
 * SpoClient — SharePoint REST, used ONLY for what Graph cannot do:
 * writing hyperlink columns (SourceLink, TextFileUrl). Graph rejects
 * every write shape for hyperlink fields with 400 invalidRequest (a
 * long-standing platform limitation; the cloud flow never hit it
 * because the SharePoint connector talks to this same REST API).
 * ValidateUpdateListItem takes hyperlinks as "url, description".
 *
 * Config (config.spo):
 *   siteUrl     the real site URL (used as the v1 `resource`)
 *   baseUrl     REST base override for the harness mock
 *               (default: siteUrl)
 *   auth        "device" (default) | "app"; device uses the Graph CLI
 *               public client — the probe matrix (2026-08-14) showed
 *               its tokens carry real SharePoint permissions in scp
 *               (Sites.ReadWrite.All/AllSites), which SP REST accepts,
 *               while the Azure CLI client only gets user_impersonation
 *               and is rejected with 401 invalid_request
 *   seedCachePath  the Graph token cache — same client, so its
 *               refresh token converts to an SPO token silently
 *               (no third sign-in prompt)
 *   clientId/clientSecret/tenantId/tokenUrl/deviceUrl/tokenCache
 *               as in config.graph
 */
export class SpoClient {
  constructor(cfg) {
    this.cfg = cfg;
    this.baseUrl = cfg.baseUrl || cfg.siteUrl;
    this.mode = cfg.auth || (cfg.clientSecret !== undefined ? "app" : "device");
    const origin = new URL(cfg.siteUrl).origin;
    if (this.mode === "device" || this.mode === "interactive") {
      // v1 resource form: the v2 named scopes are blocked for these
      // first-party clients (AADSTS65002 preauthorization)
      this.delegated = new DelegatedAuth({
        mode: this.mode,
        clientId: cfg.clientId || GRAPH_PUBLIC_CLIENT,
        resource: origin,
        cachePath: cfg.tokenCache,
        seedCachePath: cfg.seedCachePath,
        tenantId: cfg.tenantId,
        deviceUrl: cfg.deviceUrl,
        authorizeUrl: cfg.authorizeUrl,
        redirectHost: cfg.redirectHost,
        tokenUrl: cfg.tokenUrl,
      });
    } else {
      this.origin = origin;
      this.tokenUrl =
        cfg.tokenUrl ||
        `https://login.microsoftonline.com/${cfg.tenantId}/oauth2/v2.0/token`;
      this._token = null;
      this._tokenExpires = 0;
    }
  }

  async token() {
    if (this.delegated) return this.delegated.token();
    if (this._token && Date.now() < this._tokenExpires - 60000) return this._token;
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.cfg.clientId,
      client_secret: resolveSecret(this.cfg.clientSecret, "spo.clientSecret"),
      scope: `${this.origin}/.default`,
    });
    const res = await fetch(this.tokenUrl, { method: "POST", body, signal: timeout(this.cfg) });
    if (!res.ok) {
      throw new Error(`SPO token request failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    }
    const json = await res.json();
    this._token = json.access_token;
    this._tokenExpires = Date.now() + Number(json.expires_in || 3600) * 1000;
    return this._token;
  }

  /** Set fields via ValidateUpdateListItem. Hyperlink values may be
   *  {Url, Description} objects or strings. Throws on per-field
   *  errors (the endpoint returns 200 even when a field fails). */
  async validateUpdate(listGuid, itemId, fields) {
    const formValues = Object.entries(fields).map(([FieldName, v]) => ({
      FieldName,
      FieldValue:
        v && typeof v === "object"
          ? v.Description
            ? `${v.Url}, ${v.Description}`
            : String(v.Url)
          : String(v ?? ""),
    }));
    const url =
      `${this.baseUrl}/_api/web/lists(guid'${listGuid}')/items(${itemId})` +
      `/ValidateUpdateListItem`;
    let res;
    for (let attempt = 0; attempt < 2; attempt++) {
      res = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json;odata=nometadata",
          "content-type": "application/json;odata=nometadata",
          authorization: "Bearer " + (await this.token()),
        },
        body: JSON.stringify({ formValues, bNewDocumentUpdate: false }),
        signal: timeout(this.cfg),
      });
      if (res.status !== 401) break;
      if (this.delegated) this.delegated.invalidate();
      this._token = null;
    }
    if (!res.ok) {
      throw new Error(`SPO ValidateUpdateListItem ${res.status}: ${(await res.text()).slice(0, 400)}`);
    }
    const json = await res.json();
    const failed = (json.value || []).filter((f) => f.ErrorMessage);
    if (failed.length) {
      throw new Error(
        "SPO field write failed: " +
        failed.map((f) => `${f.FieldName}: ${f.ErrorMessage}`).join("; ").slice(0, 400)
      );
    }
  }
}
