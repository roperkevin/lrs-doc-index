/**
 * llm.mjs v1.6 — LLM client for the Doc Index classify/keyword step
 * (and, since v1.4, a raw-text generation call — `generateText` — for
 * local/testplangen.mjs's anthropic lane: same auth/retry plumbing,
 * no JSON schema pin, caller-controlled maxTokens).
 *
 * v1.6: generateText STREAMS (SSE) — a non-streaming Messages call
 * emits nothing, headers included, until the whole generation is
 * done, so Node's own HTTP client kills long drafts at its 5-minute
 * default no matter what llm.timeoutMs says. Streaming keeps bytes
 * flowing from the first second; timeoutMs becomes the generation
 * call's IDLE timeout (max silent gap between chunks). The
 * classify/keyword call stays non-streaming (small replies,
 * JSON-schema pin).
 *
 * v1.5: retry visibility — every backoff retry (both providers)
 * prints one stderr line naming the cause and the delay, so 429s and
 * the AI Builder gateway's 408-on-long-generation no longer look
 * like a silent hang. Behavior otherwise unchanged.
 *
 * Provider "aibuilder" (default) — the SAME model the cloud flow
 * uses: the AI Builder custom prompt (recordId in config.llm.modelId)
 * invoked through the Dataverse Web API Predict action —
 *   POST {environmentUrl}/api/data/v9.2/msdyn_aimodels({id})
 *        /Microsoft.Dynamics.CRM.Predict
 * with the flow's three requestv2 inputs (FileName, DocText,
 * ExistingKeywords) and the flow's response read
 * (responsev2.predictionOutput.text) and lax parsing (coalesce '{}',
 * brace-slice, JSON.parse — flow §4.3(a) steps 3–5). Prompt text
 * stays in AI Builder on the tenant, exactly as today; prompt
 * promotion remains the AI Builder paste + STATUS entry. Auth is the
 * same Entra app used for Graph (client credentials against
 * {environmentUrl}/.default; the app must be added as an application
 * user in the Power Platform environment — Local_Setup.md §3).
 *
 * Provider "anthropic" (alternative) — a direct Anthropic Messages
 * API call executing prompts/DocIndex_Prompt.md verbatim between its
 * BEGIN/END markers, with the nine-field output pinned by a JSON
 * schema. Kept for a future move off Power Platform entirely.
 *
 * Provider selection: config.llm.provider, defaulting to "aibuilder"
 * when config.llm.environmentUrl is set and "anthropic" otherwise.
 *
 * aibuilder config (config.llm):
 *   environmentUrl  e.g. "https://org1234.crm.dynamics.com" (no slash)
 *   modelId         the AI Builder prompt's model GUID (the flow's
 *                   Run_prompt recordId)
 *   dataverse       {tenantId, clientId, clientSecret, tokenUrl?} —
 *                   sweep.mjs defaults this to config.graph, so the
 *                   one Entra app serves both
 *
 * anthropic auth (config.llm.auth):
 *   "oauth" (default) — no API key anywhere. A one-time
 *     `ant auth login` on the machine stores an OAuth profile; this
 *     client mints short-lived bearer tokens from it by shelling out
 *     to `ant auth print-credentials --access-token` (which
 *     auto-refreshes), and sends them as `Authorization: Bearer`
 *     plus the required `anthropic-beta: oauth-2025-04-20` header.
 *     `ANTHROPIC_AUTH_TOKEN`, when set, short-circuits the CLI.
 *     NOTE: an exported ANTHROPIC_API_KEY silently outranks the
 *     profile for the `ant` CLI itself — keep it unset on the
 *     machine (Local_Setup.md §3).
 *   "apiKey" — classic metered key; set config.llm.apiKey
 *     (ideally {"$env":"..."}). Also selected implicitly when
 *     apiKey is configured.
 *
 * Other config (config.llm):
 *   model      default "claude-opus-5"
 *   maxTokens  default 4096
 *   baseUrl    default "https://api.anthropic.com" (harness points this
 *              at a local mock)
 *   maxRetries default 4 (429/5xx/network, exponential backoff)
 *   antCommand default "ant" (override for a nonstandard install path)
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROMPT_FILE = path.resolve(HERE, "..", "prompts", "DocIndex_Prompt.md");
const PROMPT_BEGIN = "---------------- PROMPT TEXT BEGINS ----------------";
const PROMPT_END = "----------------- PROMPT TEXT ENDS -----------------";

// The nine fields of the AI Builder output contract (prompt "OUTPUT" section).
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    docKind: { type: "string" },
    surface: { type: "string" },
    summary: { type: "string" },
    pe: { type: "string" },
    dev: { type: "string" },
    targetRelease: { type: "string" },
    tools: { type: "array", items: { type: "string" } },
    keywords: { type: "array", items: { type: "string" } },
  },
  required: [
    "title", "docKind", "surface", "summary", "pe", "dev",
    "targetRelease", "tools", "keywords",
  ],
  additionalProperties: false,
};

export function loadPromptTemplate(promptFile = PROMPT_FILE) {
  const raw = fs.readFileSync(promptFile, "utf8");
  const begin = raw.indexOf(PROMPT_BEGIN);
  const end = raw.indexOf(PROMPT_END);
  if (begin < 0 || end < 0 || end <= begin) {
    throw new Error(`prompt markers not found in ${promptFile}`);
  }
  return raw.slice(begin + PROMPT_BEGIN.length, end).trim();
}

export function buildPrompt(template, { fileName, docText, existingKeywords }) {
  // AI Builder substitutes named inputs verbatim; mirror that exactly.
  return template
    .replaceAll("{FileName}", fileName)
    .replaceAll("{ExistingKeywords}", existingKeywords)
    .replaceAll("{DocText}", docText);
}

function resolveSecret(v, what) {
  if (v && typeof v === "object" && v.$env) {
    const s = process.env[String(v.$env)];
    if (!s) throw new Error(`${what}: environment variable ${v.$env} is not set`);
    return s;
  }
  if (typeof v === "string" && v !== "") return v;
  throw new Error(`${what}: missing (set it in config, ideally as {"$env": "..."})`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// v1.5: retries are no longer silent — one stderr line per retry
// naming the cause and the backoff, so a struggling call (429s, the
// AI Builder gateway's 408 on long generations) is visible instead
// of looking like a hang. Same backoff arithmetic as before.
async function retryNotice(lastErr, attempt, maxRetries) {
  const delay = Math.min(2000 * 2 ** (attempt - 1), 30000);
  process.stderr.write(
    `llm: retry ${attempt}/${maxRetries} in ${delay / 1000}s — ` +
    `${String(lastErr?.message || lastErr || "network error").slice(0, 160)}\n`
  );
  await sleep(delay);
}

// Generation calls get a long leash (AI Builder's gateway itself 408s
// slow generations); token mints a short one. Both exist so one hung
// socket can never stall a scheduled run — a timeout surfaces as a
// network error and rides the normal retry/backoff path. Override via
// config llm.timeoutMs / llm.dataverse.timeoutMs.
const LLM_TIMEOUT_MS = 300000;
const TOKEN_TIMEOUT_MS = 60000;
const llmTimeout = (cfg) =>
  AbortSignal.timeout(cfg.timeoutMs === undefined ? LLM_TIMEOUT_MS : Number(cfg.timeoutMs));

// ---- auth -----------------------------------------------------------

let _oauthToken = null;
let _oauthFetched = 0;

function oauthToken(cfg, force) {
  // Tokens are short-lived; print-credentials refreshes as needed, so
  // re-mint every 5 minutes (or immediately after a 401).
  if (!force && _oauthToken && Date.now() - _oauthFetched < 5 * 60 * 1000) {
    return _oauthToken;
  }
  if (process.env.ANTHROPIC_AUTH_TOKEN) {
    _oauthToken = process.env.ANTHROPIC_AUTH_TOKEN;
    _oauthFetched = Date.now();
    return _oauthToken;
  }
  const cmd = cfg.antCommand || "ant";
  // shell:true so Windows resolves ant.cmd/ant.exe from PATH
  const res = spawnSync(`${cmd} auth print-credentials --access-token`, {
    shell: true,
    encoding: "utf8",
    timeout: 60000,
  });
  const token = (res.stdout || "").trim();
  if (res.status !== 0 || token === "") {
    throw new Error(
      "llm auth: could not mint an OAuth token via `" + cmd +
      " auth print-credentials --access-token` — run `ant auth login` on this " +
      "machine (and keep ANTHROPIC_API_KEY unset), or configure llm.apiKey. " +
      (res.stderr || "").slice(0, 300)
    );
  }
  _oauthToken = token;
  _oauthFetched = Date.now();
  return token;
}

function authHeaders(cfg, forceRefresh) {
  const useApiKey = cfg.auth === "apiKey" || (cfg.auth === undefined && cfg.apiKey !== undefined);
  if (useApiKey) {
    return { "x-api-key": resolveSecret(cfg.apiKey, "llm.apiKey") };
  }
  return {
    authorization: "Bearer " + oauthToken(cfg, forceRefresh),
    "anthropic-beta": "oauth-2025-04-20",
  };
}

async function postMessages(cfg, payload) {
  const baseUrl = cfg.baseUrl || "https://api.anthropic.com";
  const maxRetries = cfg.maxRetries === undefined ? 4 : Number(cfg.maxRetries);
  const body = JSON.stringify(payload);

  let lastErr;
  let refresh = false;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) await retryNotice(lastErr, attempt, maxRetries);
    let res;
    try {
      res = await fetch(baseUrl + "/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "anthropic-version": "2023-06-01",
          ...authHeaders(cfg, refresh),
        },
        body,
        signal: llmTimeout(cfg),
      });
    } catch (e) {
      lastErr = new Error(`LLM request failed: ${e.message}`);
      continue;
    }
    refresh = false;
    if (res.status === 401) {
      // expired bearer token — mint a fresh one and retry
      lastErr = new Error(`LLM API 401: ${(await res.text()).slice(0, 300)}`);
      refresh = true;
      continue;
    }
    if (res.status === 429 || res.status >= 500) {
      lastErr = new Error(`LLM API ${res.status}: ${(await res.text()).slice(0, 300)}`);
      continue;
    }
    if (!res.ok) {
      throw new Error(`LLM API ${res.status}: ${(await res.text()).slice(0, 500)}`);
    }
    return res.json();
  }
  throw lastErr;
}

function requestJson(cfg, prompt) {
  return postMessages(cfg, {
    model: cfg.model || "claude-opus-5",
    max_tokens: cfg.maxTokens === undefined ? 4096 : Number(cfg.maxTokens),
    output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
    messages: [{ role: "user", content: prompt }],
  });
}

/**
 * Raw text generation (v1.4): one prompt in, the reply's text out —
 * no JSON schema pin, so the caller's own output contract applies
 * (testplangen.mjs slices its DRAFT markers and fails closed).
 * Throws on refusal and on max_tokens truncation: a truncated draft
 * would lose its END marker anyway, so surfacing the real cause here
 * beats a mystery no-markers failure downstream.
 *
 * v1.6: STREAMS. A non-streaming request emits nothing — not even
 * response headers — until the entire generation is done, so every
 * silent-connection timeout between here and the API kills long
 * drafts: Node's own HTTP client (undici) aborts a headerless
 * connection after 5 minutes by default, surfacing as a bare
 * "fetch failed" that no llm.timeoutMs setting can reach. With
 * stream: true, headers and a continuous trickle of text deltas
 * arrive from the first second — nothing in the path ever sees a
 * silent connection — and cfg.timeoutMs becomes an IDLE timeout
 * (the longest allowed gap between chunks) instead of a total-call
 * ceiling: a 20-minute generation with steady deltas never times
 * out, a wedged socket still dies fast. The classify/keyword call
 * (requestJson) stays non-streaming: its replies are small and its
 * JSON-schema pin has no streaming equivalent here.
 */
export async function generateText(cfg, prompt) {
  const { text, stopReason } = await postMessagesStream(cfg, {
    model: cfg.model || "claude-opus-5",
    max_tokens: cfg.maxTokens === undefined ? 4096 : Number(cfg.maxTokens),
    messages: [{ role: "user", content: prompt }],
  });
  if (stopReason === "refusal") {
    throw new Error("LLM refused the generation request (stop_reason: refusal)");
  }
  if (stopReason === "max_tokens") {
    throw new Error("LLM output truncated (stop_reason: max_tokens) — raise the caller's maxTokens knob");
  }
  return text;
}

// The streaming transport under generateText (v1.6): same retry
// semantics as postMessages — 401 re-mints the bearer, 429/5xx and
// transport failures back off and retry, other 4xx throw — with a
// mid-stream cut (idle timeout, connection reset, an SSE error
// event) also riding the retry path: the partial text is discarded,
// exactly as the marker slice would have failed closed on it.
async function postMessagesStream(cfg, payload) {
  const baseUrl = cfg.baseUrl || "https://api.anthropic.com";
  const maxRetries = cfg.maxRetries === undefined ? 4 : Number(cfg.maxRetries);
  const idleMs = cfg.timeoutMs === undefined ? LLM_TIMEOUT_MS : Number(cfg.timeoutMs);
  const body = JSON.stringify({ ...payload, stream: true });
  let lastErr;
  let refresh = false;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) await retryNotice(lastErr, attempt, maxRetries);
    const ac = new AbortController();
    let idleTimer;
    const armIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(
        () => ac.abort(new Error(`no bytes from the API for ${idleMs}ms (idle timeout)`)),
        idleMs
      );
    };
    armIdle();
    try {
      const res = await fetch(baseUrl + "/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "anthropic-version": "2023-06-01",
          accept: "text/event-stream",
          ...authHeaders(cfg, refresh),
        },
        body,
        signal: ac.signal,
      });
      refresh = false;
      if (res.status === 401) {
        lastErr = new Error(`LLM API 401: ${(await res.text()).slice(0, 300)}`);
        refresh = true;
        continue;
      }
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`LLM API ${res.status}: ${(await res.text()).slice(0, 300)}`);
        continue;
      }
      if (!res.ok) {
        // non-retryable request error — rethrown past the catch below
        throw new Error(`LLM API ${res.status}: ${(await res.text()).slice(0, 500)}`);
      }
      const dec = new TextDecoder();
      let buf = "";
      let text = "";
      let stopReason = null;
      let stopped = false;
      for await (const chunk of res.body) {
        armIdle();
        buf += dec.decode(chunk, { stream: true });
        let i;
        while ((i = buf.indexOf("\n\n")) > -1) {
          const dataLine = buf.slice(0, i).split("\n").find((l) => l.startsWith("data:"));
          buf = buf.slice(i + 2);
          if (!dataLine) continue;
          const ev = JSON.parse(dataLine.slice(5).trim());
          if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
            text += ev.delta.text;
          } else if (ev.type === "message_delta" && ev.delta?.stop_reason) {
            stopReason = ev.delta.stop_reason;
          } else if (ev.type === "message_stop") {
            stopped = true;
          } else if (ev.type === "error") {
            throw new Error(
              `LLM stream error: ${ev.error?.type || ""} ` +
              String(ev.error?.message || "").slice(0, 300)
            );
          }
        }
      }
      if (!stopped) {
        throw new Error("LLM stream ended without message_stop (connection cut mid-generation)");
      }
      return { text, stopReason };
    } catch (e) {
      if (/^LLM API 4/.test(String(e.message))) throw e; // 4xx (non-401/429): not retryable
      lastErr =
        e instanceof Error && /^LLM /.test(e.message)
          ? e
          : new Error(`LLM request failed: ${e.message}`);
    } finally {
      clearTimeout(idleTimer);
    }
  }
  throw lastErr;
}

// ---- provider: aibuilder (the cloud flow's model) -------------------

import { DelegatedAuth, DATAVERSE_PUBLIC_CLIENT } from "./auth.mjs";

let _dvToken = null;
let _dvExpires = 0;
let _dvDelegated = null;

export async function dataverseToken(cfg) {
  const dv = cfg.dataverse || {};
  const mode = dv.auth || (dv.clientSecret !== undefined ? "app" : "device");
  if (mode === "device" || mode === "interactive") {
    // delegated sign-in as the user — no app registration; the user's
    // own Dataverse/AI Builder permissions apply (they own the prompt)
    if (!_dvDelegated) {
      _dvDelegated = new DelegatedAuth({
        mode: mode,
        clientId: dv.clientId || DATAVERSE_PUBLIC_CLIENT,
        scopes: [`${cfg.environmentUrl}/user_impersonation`, "offline_access"],
        cachePath: dv.tokenCache,
        tenantId: dv.tenantId,
        deviceUrl: dv.deviceUrl,
        authorizeUrl: dv.authorizeUrl,
        redirectHost: dv.redirectHost,
        tokenUrl: dv.tokenUrl,
      });
    }
    return _dvDelegated.token();
  }
  if (_dvToken && Date.now() < _dvExpires - 60000) return _dvToken;
  const tokenUrl =
    dv.tokenUrl || `https://login.microsoftonline.com/${dv.tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: dv.clientId,
    client_secret: resolveSecret(dv.clientSecret, "llm.dataverse.clientSecret"),
    scope: `${cfg.environmentUrl}/.default`,
  });
  const res = await fetch(tokenUrl, {
    method: "POST", body,
    signal: AbortSignal.timeout(dv.timeoutMs === undefined ? TOKEN_TIMEOUT_MS : Number(dv.timeoutMs)),
  });
  if (!res.ok) {
    throw new Error(`Dataverse token request failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const json = await res.json();
  _dvToken = json.access_token;
  _dvExpires = Date.now() + Number(json.expires_in || 3600) * 1000;
  return _dvToken;
}

// Flow §4.3(a) steps 3–5: coalesce '{}', slice first '{' .. last '}',
// json(). Tolerates code fences and prose around the JSON.
export function braceSlice(text) {
  const raw = text ?? "{}";
  const a = raw.indexOf("{");
  const b = raw.lastIndexOf("}");
  return a > -1 && b > a ? raw.slice(a, b + 1) : "{}";
}

// The Predict action requires a `source` telemetry string ("Source is
// null" InvalidRequest without it). This is the exact literal the
// flow's Run_prompt action sends (partnerSourceVersion = the flow
// GUID); override with cfg.source if it ever needs to change.
const AI_BUILDER_SOURCE =
  '{"consumptionSource":"PowerAutomate","partnerSource":"AIBuilder",' +
  '"consumptionSourceVersion":"Flow",' +
  '"partnerSourceVersion":"d925d67e-4f70-41f5-90df-fe1069af1108"}';

/**
 * Generic AI Builder custom-prompt Predict call: any requestv2 input
 * fields, any model id (defaults to cfg.modelId). Used by the doc
 * classify step and by the curation job (its own prompt + model).
 */
export async function aiBuilderPredict(cfg, requestv2, modelId) {
  const maxRetries = cfg.maxRetries === undefined ? 4 : Number(cfg.maxRetries);
  const url =
    `${cfg.environmentUrl}/api/data/v9.2/msdyn_aimodels(${modelId || cfg.modelId})` +
    `/Microsoft.Dynamics.CRM.Predict`;
  const body = JSON.stringify({
    version: "2.0",
    requestv2: {
      "@odata.type": "#Microsoft.Dynamics.CRM.expando",
      ...requestv2,
    },
    source: cfg.source || AI_BUILDER_SOURCE,
  });
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) await retryNotice(lastErr, attempt, maxRetries);
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0",
          authorization: "Bearer " + (await dataverseToken(cfg)),
        },
        body,
        signal: llmTimeout(cfg),
      });
    } catch (e) {
      lastErr = new Error(`AI Builder request failed: ${e.message}`);
      continue;
    }
    if (res.status === 401) {
      _dvToken = null;
      if (_dvDelegated) _dvDelegated.invalidate();
      lastErr = new Error(`AI Builder 401: ${(await res.text()).slice(0, 300)}`);
      continue;
    }
    if (res.status === 429 || res.status === 408 || res.status >= 500) {
      // 408: the AI Builder gateway timing out a long generation —
      // transient under load, so it gets the same backoff-retry
      lastErr = new Error(`AI Builder ${res.status}: ${(await res.text()).slice(0, 300)}`);
      continue;
    }
    if (!res.ok) {
      throw new Error(`AI Builder ${res.status}: ${(await res.text()).slice(0, 500)}`);
    }
    return res.json();
  }
  throw lastErr;
}

/**
 * Run the Doc Index prompt for one document.
 * Returns the parsed nine-field object. Throws on transport failure,
 * refusal/truncation (anthropic), or unparseable output — all of
 * which land the doc in the Error lane, as in the flow.
 */
export async function classifyDoc(cfg, { fileName, docText, existingKeywords }) {
  const provider = cfg.provider || (cfg.environmentUrl ? "aibuilder" : "anthropic");

  if (provider === "aibuilder") {
    const response = await aiBuilderPredict(cfg, {
      FileName: fileName,
      DocText: docText,
      ExistingKeywords: existingKeywords,
    });
    const text = response?.responsev2?.predictionOutput?.text ?? "{}";
    try {
      return JSON.parse(braceSlice(text));
    } catch {
      throw new Error("AI Builder returned unparseable output: " + String(text).slice(0, 300));
    }
  }

  if (provider !== "anthropic") {
    throw new Error(`unknown llm.provider "${provider}" (aibuilder | anthropic)`);
  }
  const template = loadPromptTemplate(cfg.promptFile);
  const prompt = buildPrompt(template, { fileName, docText, existingKeywords });
  const response = await requestJson(cfg, prompt);

  if (response.stop_reason === "refusal") {
    throw new Error("LLM refused the classification request (stop_reason: refusal)");
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("LLM output truncated (stop_reason: max_tokens) — raise llm.maxTokens");
  }
  const text = (response.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("LLM returned non-JSON output: " + text.slice(0, 300));
  }
  return parsed;
}
