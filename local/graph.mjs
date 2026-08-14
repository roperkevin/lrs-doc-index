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
    if (this.mode === "device") {
      this.delegated = new DelegatedAuth({
        clientId: cfg.clientId || GRAPH_PUBLIC_CLIENT,
        scopes: ["https://graph.microsoft.com/Sites.ReadWrite.All", "offline_access"],
        cachePath: cfg.tokenCache,
        tenantId: cfg.tenantId,
        deviceUrl: cfg.deviceUrl,
        tokenUrl: cfg.tokenUrl,
      });
    }
    this._token = null;
    this._tokenExpires = 0;
  }

  async token() {
    if (this.mode === "device") return this.delegated.token();
    if (this._token && Date.now() < this._tokenExpires - 60000) return this._token;
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.cfg.clientId,
      client_secret: resolveSecret(this.cfg.clientSecret, "graph.clientSecret"),
      scope: "https://graph.microsoft.com/.default",
    });
    const res = await fetch(this.tokenUrl, { method: "POST", body });
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
}
