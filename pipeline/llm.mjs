/**
 * llm.mjs v2.0 — the pipeline's model client.
 *
 * Every Anthropic call goes through the Python layer (`lrsdoc/`,
 * `python -m lrsdoc <task>`): this module only spawns it, feeds it
 * the inputs as JSON, relays streamed deltas and returns the result.
 * The prompt files, the request shape, retries, timeouts and
 * credentials live there (see `lrsdoc/llm.py`). Nothing in Node
 * renders a prompt any more.
 *
 * Config (`config.llm`):
 *   provider   "anthropic" (default) | "aibuilder" (the tenant AI
 *              Builder lane — kept for one more commit, see below)
 *   apiKey     the API key, ideally {"$env": "ANTHROPIC_API_KEY"}; when
 *              absent the child process uses whatever the SDK finds
 *              (ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN in the
 *              environment, or an `ant auth login` profile)
 *   baseUrl    override the API endpoint (the gates' mock server)
 *   model      override the prompt file's default model
 *   effort     override the prompt file's effort
 *   maxRetries SDK retries (default 4)
 *   timeoutMs  SDK request timeout (default 600 s)
 *   python     the interpreter to run (default `python3`, `python` on
 *              Windows; LRSDOC_PYTHON in the environment overrides)
 *
 * Provider "aibuilder": the tenant's AI Builder custom prompt through
 * the Dataverse Web API Predict action (`aiBuilderPredict`,
 * `dataverseToken`, `braceSlice`). Retired with the next commit.
 */

import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..");

export function providerOf(cfg) {
  return cfg.provider || (cfg.environmentUrl ? "aibuilder" : "anthropic");
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

// ---- the bridge to lrsdoc -----------------------------------------------

function bridgeEnv(cfg) {
  const env = { ...process.env };
  env.PYTHONPATH = env.PYTHONPATH ? `${REPO_ROOT}${path.delimiter}${env.PYTHONPATH}` : REPO_ROOT;
  env.PYTHONIOENCODING = "utf-8";
  if (cfg.baseUrl) env.ANTHROPIC_BASE_URL = cfg.baseUrl;
  if (cfg.apiKey !== undefined) {
    // a configured key wins over anything exported in the environment
    env.ANTHROPIC_API_KEY = resolveSecret(cfg.apiKey, "llm.apiKey");
    delete env.ANTHROPIC_AUTH_TOKEN;
  }
  return env;
}

function bridgeOptions(cfg, opts = {}) {
  const o = { max_retries: cfg.maxRetries === undefined ? 4 : Number(cfg.maxRetries) };
  if (cfg.model) o.model = cfg.model;
  if (cfg.effort) o.effort = cfg.effort;
  if (cfg.timeoutMs !== undefined) o.timeout_s = Number(cfg.timeoutMs) / 1000;
  if (opts.maxTokens !== undefined) o.max_tokens = Number(opts.maxTokens);
  else if (cfg.maxTokens !== undefined) o.max_tokens = Number(cfg.maxTokens);
  if (opts.showThinking) o.show_thinking = true;
  return o;
}

/**
 * Run one lrsdoc task. `payload` is the CLI's input object
 * ({prompt?, inputs, options}); `onDelta(kind, text)` receives the
 * streamed chunks ("thinking" | "text") when given. Resolves with the
 * result object (text, data, stop_reason, model, prompt,
 * prompt_version, usage); rejects with an Error carrying `type`
 * (Truncated | Refused | ContractError | ...), `partial` (the text
 * that arrived before a truncation) and `exitCode`.
 */
export function runTask(cfg, task, payload, { onDelta } = {}) {
  const python = cfg.python || process.env.LRSDOC_PYTHON || (process.platform === "win32" ? "python" : "python3");
  const args = ["-m", "lrsdoc", task, "--input", "-"];
  if (onDelta) args.push("--stream");
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(python, args, { cwd: REPO_ROOT, env: bridgeEnv(cfg), stdio: ["pipe", "pipe", "inherit"] });
    } catch (e) {
      return reject(e);
    }
    let buf = "";
    let result = null;
    let errorObj = null;
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      buf += chunk;
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 1);
        if (!line.trim()) continue;
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }
        if (msg.delta) { if (onDelta) onDelta(msg.delta.kind, msg.delta.text); }
        else if (msg.result) result = msg.result;
        else if (msg.error) errorObj = msg.error;
      }
    });
    child.on("error", (e) => {
      reject(new Error(
        `lrsdoc: could not start "${python}" (${e.message}) — install Python 3.10+ with the anthropic ` +
        "package (pip install anthropic), or point llm.python / LRSDOC_PYTHON at the interpreter"
      ));
    });
    child.on("close", (code) => {
      if (result && code === 0) return resolve(result);
      const e = new Error(
        !errorObj ? `lrsdoc ${task} exited with code ${code} and no result`
        : errorObj.type === "Truncated" ? `LLM output truncated (stop_reason: max_tokens) — ${errorObj.message}`
        : errorObj.type === "Refused" ? `LLM refused the request (stop_reason: refusal) — ${errorObj.message}`
        : `LLM ${errorObj.type}: ${errorObj.message}`);
      if (errorObj) { e.type = errorObj.type; e.partial = errorObj.partial; }
      e.exitCode = code;
      reject(e);
    });
    child.stdin.on("error", () => { /* the close handler reports */ });
    child.stdin.end(JSON.stringify(payload));
  });
}

/**
 * Text generation from a prompt file: `generate(cfg, "testplan_draft",
 * inputs, {maxTokens, onDelta, showThinking})` → the reply text. The
 * caller keeps its own sentinel slice / verifier. Throws on
 * truncation (message names stop_reason: max_tokens) and refusal.
 */
export async function generate(cfg, promptName, inputs, opts = {}) {
  const res = await runTask(cfg, "generate",
    { prompt: promptName, inputs, options: bridgeOptions(cfg, opts) },
    { onDelta: opts.onDelta });
  return res.text;
}

/**
 * The Doc Index classify step for one document → the nine-field
 * object (schema-pinned on the anthropic lane; brace-sliced on the
 * aibuilder lane). Throws on transport failure, refusal, truncation or
 * unparseable output — the Error lane, as in the flow.
 */
export async function classifyDoc(cfg, { fileName, docText, existingKeywords }) {
  if (providerOf(cfg) === "aibuilder") {
    const response = await aiBuilderPredict(cfg, {
      FileName: fileName, DocText: docText, ExistingKeywords: existingKeywords,
    });
    const text = response?.responsev2?.predictionOutput?.text ?? "{}";
    try {
      return JSON.parse(braceSlice(text));
    } catch {
      throw new Error("AI Builder returned unparseable output: " + String(text).slice(0, 300));
    }
  }
  const res = await runTask(cfg, "classify", {
    inputs: { FileName: fileName, ExistingKeywords: existingKeywords, DocText: docText },
    options: bridgeOptions(cfg),
  });
  return res.data;
}

/**
 * One keyword-curation chunk → `{proposals: [{alias, canonical, why}]}`
 * (the schema-pinned reply; curate.mjs applies its own guard).
 */
export async function curateChunk(cfg, { vocabulary, doNotPropose }) {
  const res = await runTask(cfg, "curate", {
    inputs: { Vocabulary: vocabulary, DoNotPropose: doNotPropose },
    options: bridgeOptions(cfg),
  });
  return res.data;
}

// ---- provider: aibuilder (the cloud flow's model) — retired next commit ----

import { DelegatedAuth, DATAVERSE_PUBLIC_CLIENT } from "./auth.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LLM_TIMEOUT_MS = 300000;
const TOKEN_TIMEOUT_MS = 60000;
const llmTimeout = (cfg) =>
  AbortSignal.timeout(cfg.timeoutMs === undefined ? LLM_TIMEOUT_MS : Number(cfg.timeoutMs));

async function retryNotice(lastErr, attempt, maxRetries) {
  const delay = Math.min(2000 * 2 ** (attempt - 1), 30000);
  process.stderr.write(
    `llm: retry ${attempt}/${maxRetries} in ${delay / 1000}s — ` +
    `${String(lastErr?.message || lastErr || "network error").slice(0, 160)}\n`
  );
  await sleep(delay);
}

let _dvToken = null;
let _dvExpires = 0;
let _dvDelegated = null;

export async function dataverseToken(cfg) {
  const dv = cfg.dataverse || {};
  const mode = dv.auth || (dv.clientSecret !== undefined ? "app" : "device");
  if (mode === "device" || mode === "interactive") {
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

export function braceSlice(text) {
  const raw = text ?? "{}";
  const a = raw.indexOf("{");
  const b = raw.lastIndexOf("}");
  return a > -1 && b > a ? raw.slice(a, b + 1) : "{}";
}

const AI_BUILDER_SOURCE =
  '{"consumptionSource":"PowerAutomate","partnerSource":"AIBuilder",' +
  '"consumptionSourceVersion":"Flow",' +
  '"partnerSourceVersion":"d925d67e-4f70-41f5-90df-fe1069af1108"}';

export async function aiBuilderPredict(cfg, requestv2, modelId) {
  const maxRetries = cfg.maxRetries === undefined ? 4 : Number(cfg.maxRetries);
  const url =
    `${cfg.environmentUrl}/api/data/v9.2/msdyn_aimodels(${modelId || cfg.modelId})` +
    `/Microsoft.Dynamics.CRM.Predict`;
  const body = JSON.stringify({
    version: "2.0",
    requestv2: { "@odata.type": "#Microsoft.Dynamics.CRM.expando", ...requestv2 },
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
