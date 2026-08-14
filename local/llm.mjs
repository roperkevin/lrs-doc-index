/**
 * llm.mjs v1.2 — LLM client for the Doc Index classify/keyword step.
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

async function requestJson(cfg, prompt) {
  const baseUrl = cfg.baseUrl || "https://api.anthropic.com";
  const maxRetries = cfg.maxRetries === undefined ? 4 : Number(cfg.maxRetries);
  const body = JSON.stringify({
    model: cfg.model || "claude-opus-5",
    max_tokens: cfg.maxTokens === undefined ? 4096 : Number(cfg.maxTokens),
    output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
    messages: [{ role: "user", content: prompt }],
  });

  let lastErr;
  let refresh = false;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) await sleep(Math.min(2000 * 2 ** (attempt - 1), 30000));
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

// ---- provider: aibuilder (the cloud flow's model) -------------------

import { DelegatedAuth, DATAVERSE_PUBLIC_CLIENT } from "./auth.mjs";

let _dvToken = null;
let _dvExpires = 0;
let _dvDelegated = null;

async function dataverseToken(cfg) {
  const dv = cfg.dataverse || {};
  const mode = dv.auth || (dv.clientSecret !== undefined ? "app" : "device");
  if (mode === "device") {
    // delegated sign-in as the user — no app registration; the user's
    // own Dataverse/AI Builder permissions apply (they own the prompt)
    if (!_dvDelegated) {
      _dvDelegated = new DelegatedAuth({
        clientId: dv.clientId || DATAVERSE_PUBLIC_CLIENT,
        scopes: [`${cfg.environmentUrl}/user_impersonation`, "offline_access"],
        cachePath: dv.tokenCache,
        tenantId: dv.tenantId,
        deviceUrl: dv.deviceUrl,
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
  const res = await fetch(tokenUrl, { method: "POST", body });
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
function braceSlice(text) {
  const raw = text ?? "{}";
  const a = raw.indexOf("{");
  const b = raw.lastIndexOf("}");
  return a > -1 && b > a ? raw.slice(a, b + 1) : "{}";
}

async function requestAiBuilder(cfg, inputs) {
  const maxRetries = cfg.maxRetries === undefined ? 4 : Number(cfg.maxRetries);
  const url =
    `${cfg.environmentUrl}/api/data/v9.2/msdyn_aimodels(${cfg.modelId})` +
    `/Microsoft.Dynamics.CRM.Predict`;
  const body = JSON.stringify({
    version: "2.0",
    requestv2: {
      "@odata.type": "#Microsoft.Dynamics.CRM.expando",
      FileName: inputs.fileName,
      DocText: inputs.docText,
      ExistingKeywords: inputs.existingKeywords,
    },
  });
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) await sleep(Math.min(2000 * 2 ** (attempt - 1), 30000));
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
    if (res.status === 429 || res.status >= 500) {
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
    const response = await requestAiBuilder(cfg, { fileName, docText, existingKeywords });
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
