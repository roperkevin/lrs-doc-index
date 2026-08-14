/**
 * auth.mjs v1.0 — delegated (sign-in-as-you) auth for the local sweep.
 * No Azure app registration required.
 *
 * Implements the OAuth 2.0 device authorization grant against Entra
 * ID using Microsoft's own pre-registered PUBLIC client applications
 * (present in every tenant; the same identities the Azure CLI and
 * Microsoft Graph PowerShell sign in with):
 *
 *   Graph:     14d82eec-204b-4c2f-b7e8-296a70dab67e
 *              (Microsoft Graph Command Line Tools)
 *   Dataverse: 51f81489-12ee-4a9e-aaae-a2591f45987d
 *              (Microsoft's public sample client for Dataverse)
 *
 * First use prints a code + https://microsoft.com/devicelogin and
 * waits for the browser sign-in; the refresh token is then cached
 * (0600) and every later run refreshes silently. Nightly runs keep
 * the refresh token alive; if the machine sits unused long enough
 * for it to expire, the next run prompts again — run it once from a
 * console. All actions are performed AS THE SIGNED-IN USER with that
 * user's existing SharePoint/Dataverse permissions — the same
 * identity model as the cloud flow's connections.
 *
 * If the tenant's consent policy blocks a scope for these clients,
 * override clientId in config with any public client the tenant
 * allows (e.g. the Azure CLI: 04b07795-8ddb-461a-bbee-02f9e1bf7b46).
 */

import fs from "node:fs";
import path from "node:path";

export const GRAPH_PUBLIC_CLIENT = "14d82eec-204b-4c2f-b7e8-296a70dab67e";
export const DATAVERSE_PUBLIC_CLIENT = "51f81489-12ee-4a9e-aaae-a2591f45987d";
// Azure CLI — broadly pre-consented against SharePoint Online itself
export const AZURE_CLI_PUBLIC_CLIENT = "04b07795-8ddb-461a-bbee-02f9e1bf7b46";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class DelegatedAuth {
  /**
   * opts: clientId, cachePath, tenantId ("organizations" default),
   *       deviceUrl/tokenUrl (mock overrides), optional seedCachePath
   *       (bootstrap: when this cache has no usable token, redeem the
   *       refresh token from that sibling cache instead of prompting —
   *       Entra refresh tokens are client-bound, not resource-bound,
   *       so a SAME-CLIENT cache for another resource converts
   *       silently; how SPO piggybacks on the Graph sign-in), and
   *       ONE of:
   *   scopes   (array) — Entra v2 endpoint
   *   resource (string) — Entra v1 endpoint with a `resource` param.
   *     Needed for SharePoint REST (probe matrix, 2026-08-14): the
   *     v2 named-scope form is blocked for these first-party clients
   *     (AADSTS65002 preauthorization), and tokens whose scp lacks
   *     real SharePoint permissions get 401 invalid_request from SP
   *     REST — the Azure CLI client only ever got user_impersonation.
   *     The Graph CLI client + v1 resource form yields scp with
   *     Sites.ReadWrite.All/AllSites, which SharePoint accepts.
   */
  constructor(opts) {
    this.clientId = opts.clientId;
    this.scopes = opts.scopes;
    this.resource = opts.resource;
    this.cachePath = opts.cachePath;
    this.seedCachePath = opts.seedCachePath;
    const authority = `https://login.microsoftonline.com/${opts.tenantId || "organizations"}`;
    const v = this.resource ? "" : "v2.0/";
    this.deviceUrl = opts.deviceUrl || `${authority}/oauth2/${v}devicecode`;
    this.tokenUrl = opts.tokenUrl || `${authority}/oauth2/${v}token`;
    this._mem = null;
  }

  _readCache() {
    try {
      return JSON.parse(fs.readFileSync(this.cachePath, "utf8"));
    } catch {
      return null;
    }
  }

  _writeCache(tok) {
    fs.mkdirSync(path.dirname(this.cachePath), { recursive: true });
    fs.writeFileSync(this.cachePath, JSON.stringify(tok, null, 1), { mode: 0o600 });
  }

  async _post(url, params) {
    const res = await fetch(url, { method: "POST", body: new URLSearchParams(params) });
    let json = {};
    try {
      json = await res.json();
    } catch { /* non-JSON error body */ }
    return { ok: res.ok, status: res.status, json };
  }

  _store(json) {
    const tok = {
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      expires_at: Date.now() + Number(json.expires_in || 3600) * 1000,
      resource: this.resource ?? null,
      client_id: this.clientId,
    };
    this._mem = tok;
    this._writeCache(tok);
    return tok.access_token;
  }

  async _refresh(refreshToken) {
    const params = {
      grant_type: "refresh_token",
      client_id: this.clientId,
      refresh_token: refreshToken,
    };
    if (this.resource) params.resource = this.resource;
    else params.scope = this.scopes.join(" ");
    const { ok, json } = await this._post(this.tokenUrl, params);
    return ok ? this._store(json) : null;
  }

  async _deviceFlow() {
    // A scheduled (non-interactive) run must not sit waiting 15 min
    // for a sign-in nobody will perform — fail loud and fast so the
    // log and the status page say exactly what to do. The env knob
    // exists for the harness and for consoles with redirected output.
    if (!process.stderr.isTTY && process.env.DOCINDEX_ALLOW_DEVICE_PROMPT !== "1") {
      throw new Error(
        "AUTH EXPIRED — a device-code sign-in is required but this run is " +
        "non-interactive (scheduled). Run once from a console and complete " +
        "the sign-in: node --experimental-strip-types local/sweep.mjs " +
        "--config local/config.json --live"
      );
    }
    const { ok, status, json } = await this._post(
      this.deviceUrl,
      this.resource
        ? { client_id: this.clientId, resource: this.resource }
        : { client_id: this.clientId, scope: this.scopes.join(" ") }
    );
    if (!ok) {
      throw new Error(`device-code request failed (${status}): ${JSON.stringify(json).slice(0, 300)}`);
    }
    process.stderr.write(
      "\n=== SIGN IN REQUIRED ===\n" +
      (json.message ||
        `Open ${json.verification_uri} and enter the code ${json.user_code}`) +
      "\n(waiting for sign-in...)\n\n"
    );
    let interval = Math.max(Number(json.interval || 5), 1);
    const deadline = Date.now() + Number(json.expires_in || 900) * 1000;
    while (Date.now() < deadline) {
      await sleep(interval * 1000);
      // v1 takes the device code in `code`; v2 in `device_code`
      const poll = await this._post(this.tokenUrl, {
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        client_id: this.clientId,
        ...(this.resource
          ? { code: json.device_code }
          : { device_code: json.device_code }),
      });
      if (poll.ok) return this._store(poll.json);
      const err = poll.json.error;
      if (err === "authorization_pending") continue;
      if (err === "slow_down") {
        interval += 5;
        continue;
      }
      throw new Error(
        `device sign-in failed: ${err || poll.status} ${String(poll.json.error_description || "").slice(0, 300)}`
      );
    }
    throw new Error("device sign-in timed out — run the sweep from a console and complete the browser sign-in");
  }

  async token() {
    const cached = this._mem || this._readCache();
    // a cached token minted for a different client or a different
    // resource/endpoint form is stale even if unexpired (a same-client
    // refresh token still converts; a foreign-client one cannot)
    const sameClient = !cached?.client_id || cached.client_id === this.clientId;
    const sameAudience = (cached?.resource ?? null) === (this.resource ?? null);
    if (cached?.access_token && sameClient && sameAudience && Date.now() < cached.expires_at - 60000) {
      this._mem = cached;
      return cached.access_token;
    }
    if (sameClient && cached?.refresh_token) {
      const refreshed = await this._refresh(cached.refresh_token);
      if (refreshed) return refreshed;
    }
    if (this.seedCachePath) {
      let seed = null;
      try {
        seed = JSON.parse(fs.readFileSync(this.seedCachePath, "utf8"));
      } catch { /* no seed cache yet */ }
      if (seed?.refresh_token && (!seed.client_id || seed.client_id === this.clientId)) {
        const refreshed = await this._refresh(seed.refresh_token);
        if (refreshed) return refreshed;
      }
    }
    if (cached?.refresh_token) {
      process.stderr.write("auth: cached refresh token no longer valid — signing in again\n");
    }
    return this._deviceFlow();
  }

  invalidate() {
    if (this._mem) this._mem.expires_at = 0;
  }
}

/**
 * Redeem an existing refresh token for a different resource (v1) or
 * scope set (v2) WITHOUT touching any cache. Entra refresh tokens are
 * client-bound, not resource-bound, so one sign-in can mint tokens
 * for any resource that client is consented for — this is how the
 * probe's token matrix tests every SPO token shape with zero extra
 * sign-in prompts. Returns { ok, status, json } (json holds either
 * the token response or the AADSTS error).
 */
export async function redeemRefreshToken({ clientId, refreshToken, tenantId, resource, scopes, tokenUrl }) {
  const authority = `https://login.microsoftonline.com/${tenantId || "organizations"}`;
  const url = tokenUrl || `${authority}/oauth2/${resource ? "" : "v2.0/"}token`;
  const params = {
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  };
  if (resource) params.resource = resource;
  else params.scope = scopes.join(" ");
  const res = await fetch(url, { method: "POST", body: new URLSearchParams(params) });
  let json = {};
  try {
    json = await res.json();
  } catch { /* non-JSON error body */ }
  return { ok: res.ok, status: res.status, json, tokenUrl: url };
}
