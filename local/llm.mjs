/**
 * llm.mjs v1.0 — direct LLM API client for the Doc Index classify/
 * keyword step (replaces the AI Builder "Create text with GPT" action
 * in the local sweep).
 *
 * The prompt is NOT duplicated here: the deployed prompt text is read
 * verbatim from prompts/DocIndex_Prompt.md (between the PROMPT TEXT
 * BEGINS/ENDS markers) and the three inputs are substituted exactly as
 * AI Builder does ({FileName}, {ExistingKeywords}, {DocText}). One
 * prompt file, two consumers — a prompt paste on the tenant and a git
 * pull locally stay in lockstep.
 *
 * Provider: Anthropic Messages API over raw HTTP (Node 22 global
 * fetch; the repo is deliberately dependency-free). The request uses
 * output_config.format with a JSON schema, so the reply is guaranteed
 * valid JSON in the shape the flow expects — no fence-stripping or
 * retry-on-parse. Swapping providers means reimplementing requestJson()
 * below against the other API; classifyDoc()'s contract is provider-
 * agnostic.
 *
 * Config (config.llm):
 *   apiKey     {"$env":"ANTHROPIC_API_KEY"} or literal (not recommended)
 *   model      default "claude-opus-5"
 *   maxTokens  default 4096
 *   baseUrl    default "https://api.anthropic.com" (harness points this
 *              at a local mock)
 *   maxRetries default 4 (429/5xx/network, exponential backoff)
 */

import fs from "node:fs";
import path from "node:path";
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

async function requestJson(cfg, prompt) {
  const baseUrl = cfg.baseUrl || "https://api.anthropic.com";
  const apiKey = resolveSecret(cfg.apiKey, "llm.apiKey");
  const maxRetries = cfg.maxRetries === undefined ? 4 : Number(cfg.maxRetries);
  const body = JSON.stringify({
    model: cfg.model || "claude-opus-5",
    max_tokens: cfg.maxTokens === undefined ? 4096 : Number(cfg.maxTokens),
    output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
    messages: [{ role: "user", content: prompt }],
  });

  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) await sleep(Math.min(2000 * 2 ** (attempt - 1), 30000));
    let res;
    try {
      res = await fetch(baseUrl + "/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body,
      });
    } catch (e) {
      lastErr = new Error(`LLM request failed: ${e.message}`);
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

/**
 * Run the Doc Index prompt for one document.
 * Returns the parsed nine-field object. Throws on refusal, truncation,
 * transport failure, or (defensively) unparseable output.
 */
export async function classifyDoc(cfg, { fileName, docText, existingKeywords }) {
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
