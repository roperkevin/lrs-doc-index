/**
 * casenormalize.mjs — the opt-in LLM lane for caseless test plans
 * (Sidecar_Format_Plan §4.4 "LLM lane", phase 4). Pure: the sweep
 * owns the model call, the file write and the row sync; this module
 * builds the prompt and VERIFIES the reply so a plan is only ever
 * rewritten with a body that (a) is in the `testplan/v1` grammar and
 * (b) is grounded in the input — every case title, every table row
 * and every image link must come from the body the model was given.
 * A reply that fails any check is refused whole; the plan keeps its
 * deterministic body and the run says why.
 */

import { lintTestPlanBody } from "./casegrammar.mjs";

export const NORMALIZE_PROMPT_VERSION = "v1.0";
export const LLM_DET = "LLM";

const INPUTS_RE = /\{(PlanTitle|Body)\}/g;

/** Single-pass substitution (a placeholder-shaped string inside the
 *  body stays literal — it can never trigger a second substitution). */
export function buildNormalizePrompt(template, { planTitle, body }) {
  const inputs = { PlanTitle: String(planTitle || ""), Body: String(body || "") };
  return String(template).replace(INPUTS_RE, (m, key) => inputs[key]);
}

/** The model's reply as a body: an outer ```markdown fence unwrapped,
 *  surrounding prose before the first "## " dropped. */
export function unwrapReply(text) {
  let t = String(text || "").replace(/\r\n?/g, "\n").trim();
  const fence = /(?:^|\n)```[a-z]*\n([\s\S]*?)\n```/.exec(t);
  if (fence) t = fence[1].trim();
  const at = t.search(/^## /m);
  if (at > 0) t = t.slice(at);
  return t.replace(/\s+$/, "") + "\n";
}

const norm = (s) => String(s || "").toLowerCase().replace(/<!--[\s\S]*?-->/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const words = (s) => norm(s).split(" ").filter((w) => w.length > 2);

/**
 * verifyNormalized(inputBody, outputBody) → { ok, failures[] , cases }
 */
export function verifyNormalized(inputBody, outputBody) {
  const failures = [];
  const inp = String(inputBody || "");
  const out = String(outputBody || "");
  const normIn = " " + norm(inp) + " ";
  const inWords = new Set(words(inp));
  const inLines = new Set(inp.split("\n").map((l) => norm(l)).filter(Boolean));

  if (!/^## Test Cases$/m.test(out)) failures.push("no ## Test Cases section");
  const heads = [...out.matchAll(/^### (TC-[PNU]\d+)\b[^\n]*$/gm)];
  if (!heads.length) failures.push("no TC case in the reply");
  for (const f of lintTestPlanBody(out)) failures.push(`lint: ${f}`);
  for (const h of heads) {
    const line = h[0];
    const src = /<!-- src: ([^>]*?) -->\s*$/.exec(line);
    if (!src) { failures.push(`${h[1]}: no src comment`); continue; }
    if (!/^LLM(\s*·|$)/.test(src[1].trim())) failures.push(`${h[1]}: src must start with LLM`);
    const title = line.replace(/^### TC-[PNU]\d+\s*[—:\-–]?\s*/, "").replace(/<!--[\s\S]*?-->/g, "").trim();
    const nt = norm(title);
    if (!nt) { failures.push(`${h[1]}: empty title`); continue; }
    if (normIn.includes(" " + nt + " ")) continue;
    const ws = words(title);
    const hit = ws.filter((w) => inWords.has(w)).length;
    if (!ws.length || hit / ws.length < 0.6) failures.push(`${h[1]}: title not found in the input ("${title.slice(0, 60)}")`);
  }
  // every table row and image link must exist verbatim in the input
  let rows = 0, links = 0;
  for (const raw of out.split("\n")) {
    const l = raw.trim();
    if (/^\|.*\|$/.test(l) && !/^\|[\s:|-]+\|$/.test(l)) {
      rows++;
      if (!inLines.has(norm(l))) { failures.push(`invented table row: ${l.slice(0, 60)}`); }
    }
    for (const m of l.matchAll(/!\[[^\]]*\]\(<?([^)>\s]+)>?\)/g)) {
      links++;
      if (!inp.includes(m[1])) failures.push(`invented image link: ${m[1]}`);
    }
  }
  if (out.length > inp.length * 2 + 4000) failures.push("reply is more than twice the input");
  return { ok: failures.length === 0, failures: failures.slice(0, 20), cases: heads.length, rows, links };
}
