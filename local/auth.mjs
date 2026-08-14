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
   * opts: clientId, scopes (array), cachePath,
   *       tenantId ("organizations" default),
   *       deviceUrl/tokenUrl (mock overrides)
   */
  constructor(opts) {
    this.clientId = opts.clientId;
    this.scopes = opts.scopes;
    this.cachePath = opts.cachePath;
    const authority = `https://login.microsoftonline.com/${opts.tenantId || "organizations"}`;
    this.deviceUrl = opts.deviceUrl || `${authority}/oauth2/v2.0/devicecode`;
    this.tokenUrl = opts.tokenUrl || `${authority}/oauth2/v2.0/token`;
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
    };
    this._mem = tok;
    this._writeCache(tok);
    return tok.access_token;
  }

  async _refresh(refreshToken) {
    const { ok, json } = await this._post(this.tokenUrl, {
      grant_type: "refresh_token",
      client_id: this.clientId,
      refresh_token: refreshToken,
      scope: this.scopes.join(" "),
    });
    return ok ? this._store(json) : null;
  }

  async _deviceFlow() {
    const { ok, status, json } = await this._post(this.deviceUrl, {
      client_id: this.clientId,
      scope: this.scopes.join(" "),
    });
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
      const poll = await this._post(this.tokenUrl, {
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        client_id: this.clientId,
        device_code: json.device_code,
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
    if (cached?.access_token && Date.now() < cached.expires_at - 60000) {
      this._mem = cached;
      return cached.access_token;
    }
    if (cached?.refresh_token) {
      const refreshed = await this._refresh(cached.refresh_token);
      if (refreshed) return refreshed;
      process.stderr.write("auth: cached refresh token no longer valid — signing in again\n");
    }
    return this._deviceFlow();
  }

  invalidate() {
    if (this._mem) this._mem.expires_at = 0;
  }
}
