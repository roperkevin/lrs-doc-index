/**
 * llm.mjs v2.1 — the pipeline's model client.
 *
 * Every Anthropic call goes through the Python layer (`lrsdoc/`,
 * `python -m lrsdoc <task>`): this module only spawns it, feeds it
 * the inputs as JSON, relays streamed deltas and returns the result.
 * The prompt files, the request shape, retries, timeouts and
 * credentials live there (see `lrsdoc/llm.py`). Nothing in Node
 * renders a prompt any more.
 *
 * Config (`config.llm`):
 *   apiKey     the API key, ideally {"$env": "ANTHROPIC_API_KEY"}; when
 *              absent the child process uses whatever the SDK finds
 *              (ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN in the
 *              environment, or an `ant auth login` profile)
 *   tenant     the company's own model, tried before the Claude API
 *              (which stays behind it as the fallback):
 *                provider  "foundry" — Claude on Microsoft Foundry
 *                resource  the Foundry resource name, e.g.
 *                          "my-company-ai" for
 *                          https://my-company-ai.services.ai.azure.com/anthropic/
 *                baseUrl   the endpoint instead of resource
 *                apiKey    its key, ideally {"$env": "..."}
 *                model     the deployment's model id, when it is not
 *                          named after the public model
 *                fallback  false to make the tenant model the only
 *                          backend (default: fall back on auth,
 *                          connection, capacity and 5xx failures)
 *   baseUrl    override the API endpoint (the gates' mock server)
 *   model      override the prompt file's default model
 *   effort     override the prompt file's effort
 *   maxRetries SDK retries (default 4)
 *   timeoutMs  SDK request timeout (default 600 s)
 *   python     the interpreter to run (default `python3`, `python` on
 *              Windows; LRSDOC_PYTHON in the environment overrides)
 *   progress   true when the calling job is narrating its run: the
 *              child gets LRSDOC_PROGRESS=1 and writes its own
 *              `progress:` lines (request shape, first-chunk latency,
 *              stop reason + tokens) to the inherited stderr, so the
 *              model call is not the one silent stretch in a narrated
 *              run (see pipeline/lib/progress.mjs). Each job sets it
 *              from its own --progress / config.progress resolution.
 */

import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..");

function resolveSecret(v, what) {
  if (v && typeof v === "object" && v.$env) {
    const s = process.env[String(v.$env)];
    if (!s) throw new Error(`${what}: environment variable ${v.$env} is not set`);
    return s;
  }
  if (typeof v === "string" && v !== "") return v;
  throw new Error(`${what}: missing (set it in config, ideally as {"$env": "..."})`);
}

// ---- the tenant model ---------------------------------------------------

const TENANT_PROVIDERS = new Set(["foundry"]);

/**
 * `llm.tenant` -> the environment the Python layer reads: LRSDOC_TENANT
 * names the provider, the credentials go in the SDK's own
 * ANTHROPIC_FOUNDRY_* variables. Config wins over anything exported on
 * the machine; with no `llm.tenant` block the child inherits whatever
 * the environment already sets, so a machine-wide tenant model needs no
 * config at all.
 */
export function tenantEnv(env, tenant) {
  const provider = String(tenant.provider || "foundry").toLowerCase();
  if (!TENANT_PROVIDERS.has(provider)) {
    throw new Error(
      `llm.tenant.provider: unknown provider "${tenant.provider}" ` +
      `(known: ${[...TENANT_PROVIDERS].join(", ")})`
    );
  }
  if (!tenant.resource && !tenant.baseUrl) {
    throw new Error(
      'llm.tenant: set resource (the Foundry resource name, e.g. "my-company-ai") ' +
      "or baseUrl (the endpoint) so the SDK knows where the tenant model lives"
    );
  }
  env.LRSDOC_TENANT = provider;
  env.ANTHROPIC_FOUNDRY_API_KEY = resolveSecret(tenant.apiKey, "llm.tenant.apiKey");
  // the block is the whole answer: a stale endpoint, deployment name or
  // fallback switch exported on the machine must not outrank it
  delete env.ANTHROPIC_FOUNDRY_RESOURCE;
  delete env.ANTHROPIC_FOUNDRY_BASE_URL;
  delete env.LRSDOC_TENANT_MODEL;
  delete env.LRSDOC_TENANT_FALLBACK;
  if (tenant.resource) env.ANTHROPIC_FOUNDRY_RESOURCE = String(tenant.resource);
  if (tenant.baseUrl) env.ANTHROPIC_FOUNDRY_BASE_URL = String(tenant.baseUrl);
  if (tenant.model) env.LRSDOC_TENANT_MODEL = String(tenant.model);
  if (tenant.fallback === false) env.LRSDOC_TENANT_FALLBACK = "0";
}

// ---- the bridge to lrsdoc -----------------------------------------------

function bridgeEnv(cfg) {
  const env = { ...process.env };
  env.PYTHONPATH = env.PYTHONPATH ? `${REPO_ROOT}${path.delimiter}${env.PYTHONPATH}` : REPO_ROOT;
  env.PYTHONIOENCODING = "utf-8";
  if (cfg.baseUrl) env.ANTHROPIC_BASE_URL = cfg.baseUrl;
  if (cfg.progress) env.LRSDOC_PROGRESS = "1";
  else delete env.LRSDOC_PROGRESS;
  if (cfg.apiKey !== undefined) {
    // a configured key wins over anything exported in the environment
    env.ANTHROPIC_API_KEY = resolveSecret(cfg.apiKey, "llm.apiKey");
    delete env.ANTHROPIC_AUTH_TOKEN;
  }
  if (cfg.tenant) tenantEnv(env, cfg.tenant);
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
 * object (schema-pinned). Throws on transport failure, refusal,
 * truncation or unparseable output — the Error lane, as in the flow.
 */
export async function classifyDoc(cfg, { fileName, docText, existingKeywords, knownTools = "" }) {
  const res = await runTask(cfg, "classify", {
    inputs: { FileName: fileName, ExistingKeywords: existingKeywords, KnownTools: knownTools || "(none)", DocText: docText },
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

/**
 * The second reader (prompts/keyword_review.md): the pending proposals
 * → `{verdicts: [{id, verdict: approve|withdraw|hold, why}]}`.
 * `reviewCfg` overrides model / effort / maxTokens for this call only
 * (curation.review in config); everything else comes from llm.*.
 */
export async function reviewProposals(cfg, { proposals, officialVocabulary }, reviewCfg = {}) {
  const merged = { ...cfg };
  if (reviewCfg.model) merged.model = reviewCfg.model;
  if (reviewCfg.effort) merged.effort = reviewCfg.effort;
  const res = await runTask(cfg, "review", {
    inputs: { Proposals: proposals, OfficialVocabulary: officialVocabulary || "(none)" },
    options: bridgeOptions(merged, reviewCfg.maxTokens !== undefined ? { maxTokens: reviewCfg.maxTokens } : {}),
  });
  return res.data;
}
