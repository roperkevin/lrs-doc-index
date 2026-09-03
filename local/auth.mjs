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
 *
 * v1.1 — INTERACTIVE mode (auth: "interactive"). The device-code grant
 * completes in a browser that has no relationship to the machine the
 * sweep runs on, so it can present no device identity. A Conditional
 * Access policy requiring a compliant or joined device therefore
 * rejects it (AADSTS53003) no matter which public client is used —
 * observed on a hybrid-joined, PRT-healthy machine where every other
 * sign-in works. Interactive mode instead runs the authorization-code
 * grant with PKCE against a loopback redirect: the system browser
 * carries the machine's PRT and device state, so the same policy is
 * satisfied. Same public clients, same caches, same silent refreshes
 * afterwards — only the FIRST sign-in differs. (Entra ignores the port
 * of an http://localhost redirect for public clients, so no
 * registration change is needed.)
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
    this.mode = opts.mode === "interactive" ? "interactive" : "device";
    this.openBrowser = opts.openBrowser;   // injectable for the gate
    // "localhost" matches what these public clients register; override only
    // if a tenant's app registration uses the 127.0.0.1 form instead
    this.redirectHost = opts.redirectHost;
    this.clientId = opts.clientId;
    this.scopes = opts.scopes;
    this.resource = opts.resource;
    this.cachePath = opts.cachePath;
    this.seedCachePath = opts.seedCachePath;
    const authority = `https://login.microsoftonline.com/${opts.tenantId || "organizations"}`;
    const v = this.resource ? "" : "v2.0/";
    this.deviceUrl = opts.deviceUrl || `${authority}/oauth2/${v}devicecode`;
    this.authorizeUrl = opts.authorizeUrl || `${authority}/oauth2/${v}authorize`;
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
    // 60s guard: a hung token endpoint must fail the run loudly, not
    // stall it (device-code POLLING has its own expires_in deadline)
    const res = await fetch(url, {
      method: "POST",
      body: new URLSearchParams(params),
      signal: AbortSignal.timeout(60000),
    });
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

  /**
   * Authorization code + PKCE over a loopback redirect. The browser
   * this opens is the signed-in user's own browser on THIS machine, so
   * it presents the device's PRT — which is the whole point: a
   * device-compliance Conditional Access policy passes here and fails
   * the device-code grant.
   */
  async _interactiveFlow() {
    if (!process.stderr.isTTY && process.env.DOCINDEX_ALLOW_DEVICE_PROMPT !== "1") {
      throw new Error(
        "AUTH EXPIRED — an interactive sign-in is required but this run is " +
        "non-interactive (scheduled). Run once from a console and complete " +
        "the sign-in: node --experimental-strip-types local/sweep.mjs " +
        "--config local/config.json --live"
      );
    }
    const http = await import("node:http");
    const crypto = await import("node:crypto");
    const b64url = (b) => b.toString("base64")
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const verifier = b64url(crypto.randomBytes(32));
    const challenge = b64url(crypto.createHash("sha256").update(verifier).digest());
    const state = b64url(crypto.randomBytes(16));

    const got = {};
    // The waiter is armed BEFORE the server can be hit. Creating it after
    // opening the browser is a race: a fast redirect (or the gate's fetch
    // hook, which is instant) lands while there is no resolver, and the
    // flow then waits for a callback that already happened.
    let arrived;
    const callback = new Promise((r) => { arrived = r; });
    const server = http.createServer((req, res) => {
      const u = new URL(req.url, "http://127.0.0.1");
      if (u.pathname !== "/") { res.writeHead(404).end(); return; }
      got.code = u.searchParams.get("code");
      got.state = u.searchParams.get("state");
      got.error = u.searchParams.get("error_description") || u.searchParams.get("error");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end("<html><body style=\"font:16px system-ui;padding:3rem\"><h2>" +
        (got.error ? "Sign-in failed" : "Signed in") + "</h2><p>" +
        (got.error ? String(got.error).slice(0, 400) : "You can close this tab and return to the console.") +
        "</p></body></html>");
      arrived();
    });
    // Entra ignores the PORT of a loopback redirect but not the HOST: these
    // public clients register "http://localhost", and sending
    // "http://127.0.0.1" is rejected as a mismatch (AADSTS50011). So the
    // redirect must say localhost — which on a dual-stack machine may
    // resolve to ::1 OR 127.0.0.1, and a browser that picks the one we are
    // not listening on gets a connection refused. Bind BOTH loopback
    // addresses on the same port and let either satisfy the callback.
    const host = this.redirectHost || "localhost";
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    const port = server.address().port;
    let server6 = null;
    if (host === "localhost") {
      try {
        server6 = http.createServer(server.listeners("request")[0]);
        await new Promise((res, rej) => {
          server6.once("error", rej);
          server6.listen(port, "::1", res);
        });
        server6.unref();
      } catch { server6 = null; /* no IPv6 loopback here — IPv4 is enough */ }
    }
    // never let the callback listener hold the event loop open: the flow
    // awaits an explicit promise, so the server has no reason to keep the
    // process alive after it resolves
    server.unref();
    const redirectUri = `http://${host}:${port}`;
    const q = {
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      response_mode: "query",
      state: state,
      code_challenge: challenge,
      code_challenge_method: "S256",
      prompt: "select_account",
    };
    if (this.resource) q.resource = this.resource;
    else q.scope = this.scopes.join(" ");
    const url = `${this.authorizeUrl}?${new URLSearchParams(q)}`;

    process.stderr.write(
      "\n=== SIGN IN REQUIRED ===\nOpening your browser to sign in.\n" +
      "If it does not open, paste this URL into it:\n" + url + "\n\n"
    );
    try {
      if (this.openBrowser) await this.openBrowser(url);
      else if (process.env.DOCINDEX_AUTH_BROWSER === "fetch") {
        // gate hook: stand in for the browser by following the redirect
        // ourselves, so the loopback leg is exercised without a display.
        // The body MUST be consumed — an undrained response keeps undici's
        // socket (and the event loop) alive, which looks exactly like the
        // sign-in hanging.
        await fetch(url, { redirect: "follow" })
          .then((r) => r.arrayBuffer())
          .catch(() => {});
      } else {
        const { spawn } = await import("node:child_process");
        const cmd = process.platform === "win32"
          ? ["cmd", ["/c", "start", "", url.replace(/&/g, "^&")]]
          : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
        spawn(cmd[0], cmd[1], { detached: true, stdio: "ignore" }).unref();
      }
    } catch { /* the printed URL is the fallback */ }

    const timeoutMs = 5 * 60 * 1000;
    let timer = null;
    try {
      await Promise.race([
        callback,
        new Promise((_, rej) => {
          timer = setTimeout(
            () => rej(new Error("interactive sign-in timed out after 5 minutes")), timeoutMs);
        }),
      ]);
    } finally {
      // an uncleared timer keeps the event loop alive for its full 5
      // minutes: the sign-in succeeds, the work completes, and the process
      // then sits there looking hung
      if (timer) clearTimeout(timer);
      // close() alone only stops NEW connections: the browser's keep-alive
      // socket stays open and holds the event loop, so the sweep completes
      // its work and then never exits. Drop live sockets too.
      for (const s of [server, server6]) {
        if (!s) continue;
        try { s.closeAllConnections(); } catch { /* older node */ }
        s.close();
        s.unref();
      }
    }
    if (got.error) throw new Error(`interactive sign-in failed: ${String(got.error).slice(0, 300)}`);
    if (!got.code) throw new Error("interactive sign-in returned no authorization code");
    if (got.state !== state) throw new Error("interactive sign-in state mismatch — aborting");

    const params = {
      grant_type: "authorization_code",
      client_id: this.clientId,
      code: got.code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    };
    if (this.resource) params.resource = this.resource;
    else params.scope = this.scopes.join(" ");
    const { ok, status, json } = await this._post(this.tokenUrl, params);
    if (!ok) {
      throw new Error(
        `interactive token exchange failed (${status}): ` +
        String(json.error_description || json.error || "").slice(0, 300)
      );
    }
    return this._store(json);
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
    return this.mode === "interactive" ? this._interactiveFlow() : this._deviceFlow();
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
