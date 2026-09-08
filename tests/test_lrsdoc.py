"""Gate for the lrsdoc Python layer — fixture-free, no network.

Legs:
  1. prompt files: every prompts/*.md loads, its `inputs` match the
     {slots} in the text, the two JSON schemas are valid objects, and
     render() is strict (missing/unknown inputs refuse), single-pass
     (a placeholder-shaped value stays literal) and never expands
     regex replacement patterns ($' and friends).
  2. request shape: system block with cache_control, the rendered
     user turn, output_config.effort / .format per the prompt,
     thinking only with show_thinking, max_tokens overrides.
  3. calls against a mock Messages API (the SDK, redirected with
     ANTHROPIC_BASE_URL): a schema-pinned classify (non-streaming),
     a streamed generate with thinking deltas, sentinel-JSON parsing,
     Truncated / Refused / ContractError outcomes, the dump dir.
  4. the CLI: JSON lines out, delta lines with --stream, exit codes,
     --output, the prompts listing.
  5. the tenant model (LRSDOC_TENANT=foundry, a second mock server):
     it serves the call and is named in the result; LRSDOC_TENANT_MODEL
     renames the deployment; the Claude API takes over when the tenant
     backend will not authenticate, is missing or 5xxs, with the switch
     narrated; a 400 and a refusal are answers, not fallbacks; a
     streamed reply that dies mid-flight is never re-sent; the
     LRSDOC_TENANT_FALLBACK=0 and unknown-provider guards; and the
     config -> environment mapping pipeline/llm.mjs does.
Run: python3 test_lrsdoc.py (from tests/ or anywhere).
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, REPO)
sys.path.insert(0, HERE)

import anthropic  # noqa: E402
import mock_anthropic as mock  # noqa: E402

passed = failed = 0
failures = []


def check(name, cond, detail=""):
    global passed, failed
    if cond:
        passed += 1
        print(f"  ok   {name}")
    else:
        failed += 1
        failures.append(name)
        print(f"  FAIL {name}  <- {str(detail)[:600]}")


class State:
    def __init__(self):
        self.text = "hello"
        self.stop_reason = "end_turn"
        self.thinking = ["Reading; ", "done."]
        self.status = 200
        self.fail_first = 0        # answer this many requests with 529 first
        self.cut_stream = False    # close the socket half way through an SSE reply
        self.calls = 0
        self.last_body = {}
        self.last_headers = {}


def make_handler(state: State):
    class H(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def do_POST(self):
            n = int(self.headers.get("content-length") or 0)
            body = json.loads(self.rfile.read(n) if n else b"{}")
            state.calls += 1
            state.last_body = body
            state.last_headers = {k.lower(): v for k, v in self.headers.items()}
            if state.fail_first > 0:
                state.fail_first -= 1
                payload = json.dumps({"type": "error", "error": {"type": "overloaded_error", "message": "busy"}}).encode()
                self.send_response(529)
                self.send_header("content-type", "application/json")
                self.send_header("content-length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
                return
            if body.get("stream"):
                payload = mock.sse_bytes(state.text, state.stop_reason,
                                         state.thinking if (body.get("thinking") or {}).get("display") == "summarized" else None)
                ctype = "text/event-stream"
                if state.cut_stream:
                    # promise the whole reply, send the opening events
                    # (two text deltas reach the caller), then drop the
                    # connection under the client
                    part = mock.sse_bytes(state.text, state.stop_reason, None, keep=4)
                    self.send_response(200)
                    self.send_header("content-type", ctype)
                    self.send_header("content-length", str(len(payload)))
                    self.end_headers()
                    self.wfile.write(part)
                    self.wfile.flush()
                    self.close_connection = True
                    self.connection.close()
                    return
            else:
                payload = json.dumps(mock.message_json(state.text, state.stop_reason)).encode()
                ctype = "application/json"
            self.send_response(state.status)
            self.send_header("content-type", ctype)
            self.send_header("content-length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
    return H


def main():
    state = State()
    srv = HTTPServer(("127.0.0.1", 0), make_handler(state))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_port}"
    os.environ["ANTHROPIC_BASE_URL"] = base
    os.environ["ANTHROPIC_API_KEY"] = "mock-key"
    os.environ.pop("ANTHROPIC_AUTH_TOKEN", None)

    from lrsdoc import llm, prompts

    # ---- 1. prompt files ------------------------------------------
    print("== prompt files")
    all_prompts = prompts.list_prompts()
    names = sorted(p.name for p in all_prompts)
    check("seven prompt files load", names == ["case_normalize", "docindex_classify", "keyword_curation",
                                              "keyword_review", "testplan_deck", "testplan_draft", "testplan_figures"], names)
    for p in all_prompts:
        check(f"{p.name}: inputs == slots, semver, model, output kind",
              p.placeholders() == set(p.inputs) and len(p.version.split(".")) == 3 and p.model
              and p.output in prompts.OUTPUT_KINDS and p.system and p.user, (p.inputs, p.placeholders()))
    cls = prompts.load("docindex_classify")
    check("classify schema: nine required fields, closed",
          cls.schema and sorted(cls.schema["required"]) == sorted(["title", "docKind", "surface", "summary", "pe", "dev", "targetRelease", "tools", "keywords"])
          and cls.schema.get("additionalProperties") is False, cls.schema)
    cur = prompts.load("keyword_curation")
    check("curation schema: proposals of alias/canonical/why",
          cur.schema and cur.schema["required"] == ["proposals"]
          and cur.schema["properties"]["proposals"]["items"]["required"] == ["alias", "canonical", "why"], cur.schema)
    draft = prompts.load("testplan_draft")
    check("draft prompt: sentinels + six inputs + markdown",
          draft.sentinels == ["[[[DRAFT BEGIN]]]", "[[[DRAFT END]]]"] and len(draft.inputs) == 6 and draft.output == "markdown", draft.sentinels)
    try:
        cls.render({"FileName": "a"})
        check("render refuses missing inputs", False)
    except prompts.PromptInputError as e:
        check("render refuses missing inputs", "missing" in str(e), e)
    try:
        cls.render({"FileName": "a", "ExistingKeywords": "", "KnownTools": "", "DocText": "", "Extra": "x"})
        check("render refuses unknown inputs", False)
    except prompts.PromptInputError as e:
        check("render refuses unknown inputs", "unknown" in str(e), e)
    sysm, usr = cls.render({"FileName": "x$'y.pptx", "ExistingKeywords": "{DocText}", "KnownTools": "", "DocText": "BODY {FileName} $& end"})
    check("render is single-pass and never expands $-patterns",
          "x$'y.pptx" in usr and "{DocText}" in usr and "BODY {FileName} $& end" in usr and usr.count("BODY") == 1, usr[:300])
    check("render puts the document text in the user turn and the rules in the system turn",
          "<<<DOCUMENT TEXT BEGIN>>>" in usr and "FIELD RULES" in sysm and "{" not in sysm.replace('{\n', ''), "")

    # ---- 2. request shape -----------------------------------------
    print("== request shape")
    req = llm.build_request(cls, {"FileName": "f", "ExistingKeywords": "k", "KnownTools": "", "DocText": "d"})
    check("system block carries cache_control, user turn is the rendered frame",
          req["system"][0]["cache_control"] == {"type": "ephemeral"} and req["messages"][0]["content"].startswith("File name: f"), req["system"][0].keys())
    check("classify: output_config has the schema format and the prompt's effort; no thinking key",
          req["output_config"]["format"] == {"type": "json_schema", "schema": cls.schema}
          and req["output_config"]["effort"] == "medium" and "thinking" not in req and req["max_tokens"] == 4096, req.get("output_config"))
    req2 = llm.build_request(draft, {k: "" for k in draft.inputs}, max_tokens=12345, effort="xhigh", show_thinking=True, model="claude-sonnet-5")
    check("generate: overrides win (max_tokens, effort, model) and show_thinking asks for a summarized display",
          req2["max_tokens"] == 12345 and req2["output_config"] == {"effort": "xhigh"} and req2["model"] == "claude-sonnet-5"
          and req2["thinking"] == {"type": "adaptive", "display": "summarized"}, req2.get("output_config"))

    # ---- 3. calls against the mock --------------------------------
    print("== calls")
    from lrsdoc.tasks import classify as t_classify, generate as t_generate, curate as t_curate
    state.text = json.dumps({"title": "T", "docKind": "Test Plan", "surface": "Pro", "summary": "s", "pe": "", "dev": "",
                             "targetRelease": "", "tools": ["Merge Routes"], "keywords": ["routes"]})
    res = t_classify({"FileName": "Alpha.pptx", "ExistingKeywords": "routes", "KnownTools": "Append Routes", "DocText": "text"}, {"max_retries": 0})
    check("classify: non-streaming, schema-pinned, data parsed, api key header",
          res.data["docKind"] == "Test Plan" and res.data["tools"] == ["Merge Routes"] and not state.last_body.get("stream")
          and state.last_body["output_config"]["format"]["type"] == "json_schema"
          and state.last_headers.get("x-api-key") == "mock-key" and res.prompt_version == "3.1.0"
          and res.stop_reason == "end_turn" and res.usage.get("output_tokens"), str(res.to_dict())[:300])
    check("classify: the user turn carries the file name, the known tools and the fenced document text",
          "File name: Alpha.pptx" in mock.user_text(state.last_body) and "<<<DOCUMENT TEXT BEGIN>>>\ntext\n<<<DOCUMENT TEXT END>>>" in mock.user_text(state.last_body)
          and "Known tools (the official names — copy exactly):\nAppend Routes" in mock.user_text(state.last_body),
          mock.user_text(state.last_body)[:400])
    state.text = json.dumps({"proposals": [{"alias": "centerlines", "canonical": "centerline", "why": "plural"}]})
    res = t_curate({"Vocabulary": "centerline [topic]\ncenterlines [topic]", "DoNotPropose": ""}, {"max_retries": 0})
    check("curate: proposals parsed", res.data["proposals"][0]["alias"] == "centerlines", res.data)
    from lrsdoc.tasks import review as t_review
    state.text = json.dumps({"verdicts": [{"id": 12, "verdict": "approve", "why": "A1"},
                                          {"id": "13", "verdict": "Withdraw", "why": "x"},
                                          {"id": 14, "verdict": "maybe", "why": "y"},
                                          {"id": "nope", "verdict": "approve", "why": "z"}]})
    res = t_review({"Proposals": "12 | a [topic] -> b [topic] | A1", "OfficialVocabulary": ""}, {"max_retries": 0})
    check("review: verdicts parsed, ids coerced, unknown verdicts held, bad ids dropped, empty vocabulary rendered as (none)",
          res.data["verdicts"] == [{"id": 12, "verdict": "approve", "why": "A1"},
                                   {"id": 13, "verdict": "withdraw", "why": "x"},
                                   {"id": 14, "verdict": "hold", "why": "y"}]
          and "Official vocabulary (the documentation's tool names and terms):\n(none)" in mock.user_text(state.last_body)
          and res.prompt_version == "1.0.0", str(res.data) + mock.user_text(state.last_body)[-200:])

    deltas = []
    state.text = "[[[DRAFT BEGIN]]]\n# Test Plan — X\n[[[DRAFT END]]]"
    res = t_generate("testplan_draft", {k: f"<{k}>" for k in draft.inputs},
                     {"max_tokens": 777, "show_thinking": True, "max_retries": 0},
                     on_delta=lambda kind, text: deltas.append((kind, text)))
    check("generate: streams, thinking deltas then text deltas, whole text returned",
          state.last_body.get("stream") is True and state.last_body["max_tokens"] == 777
          and [k for k, _ in deltas] == ["thinking", "thinking", "text", "text"]
          and "".join(t for k, t in deltas if k == "text") == state.text and res.text == state.text
          and state.last_body["thinking"] == {"type": "adaptive", "display": "summarized"}, deltas)
    check("generate: every input reached the user turn in the prompt's frame",
          all(f"<{k}>" in mock.user_text(state.last_body) for k in draft.inputs)
          and "<<<STORY TEXT BEGIN>>>\n<StoryText>\n<<<STORY TEXT END>>>" in mock.user_text(state.last_body), "")
    state.text = '[[[FIGURES BEGIN]]]\n{"plan": "P", "figures": [], "skipped": []}\n[[[FIGURES END]]]'
    res = t_generate("testplan_figures", {"PlanTitle": "P", "Draft": "d", "FiguresCap": "6"}, {"max_retries": 0})
    check("sentinel_json: parsed when the sentinels are present, text kept whole",
          res.data == {"plan": "P", "figures": [], "skipped": []} and res.text == state.text, res.to_dict())
    state.text = "no sentinels here"
    res = t_generate("testplan_figures", {"PlanTitle": "P", "Draft": "d", "FiguresCap": "6"}, {"max_retries": 0})
    check("sentinel_json: a sentinel-less reply is returned raw with data None (the consumer decides)",
          res.data is None and res.text == "no sentinels here", res.to_dict())
    state.text = "partial dr"
    state.stop_reason = "max_tokens"
    try:
        t_generate("testplan_draft", {k: "" for k in draft.inputs}, {"max_retries": 0})
        check("max_tokens raises Truncated with the partial text", False)
    except llm.Truncated as e:
        check("max_tokens raises Truncated with the partial text", e.partial == "partial dr" and e.exit_code == 2, e)
    state.stop_reason = "refusal"
    try:
        t_generate("testplan_draft", {k: "" for k in draft.inputs}, {"max_retries": 0})
        check("refusal raises Refused", False)
    except llm.Refused as e:
        check("refusal raises Refused", e.exit_code == 3, e)
    state.stop_reason = "end_turn"
    state.text = "not json"
    try:
        t_classify({"FileName": "f", "ExistingKeywords": "", "KnownTools": "", "DocText": ""}, {"max_retries": 0})
        check("a non-JSON schema-pinned reply raises ContractError", False)
    except llm.ContractError as e:
        check("a non-JSON schema-pinned reply raises ContractError", e.exit_code == 4, e)
    state.text = json.dumps({"title": "T", "docKind": "Other", "surface": "Pro", "summary": "s", "pe": "", "dev": "",
                             "targetRelease": "", "tools": [], "keywords": []})
    state.fail_first = 1
    calls_before = state.calls
    res = t_classify({"FileName": "f", "ExistingKeywords": "", "KnownTools": "", "DocText": ""}, {"max_retries": 2})
    check("a 529 is retried by the SDK", res.data["docKind"] == "Other" and state.calls - calls_before == 2, state.calls - calls_before)
    with tempfile.TemporaryDirectory() as dd:
        t_classify({"FileName": "dumped.pptx", "ExistingKeywords": "", "DocText": "body"}, {"max_retries": 0, "dump_dir": dd})
        files = os.listdir(dd)
        dump = json.load(open(os.path.join(dd, files[0]))) if files else {}
        check("dump_dir records inputs + the rendered request",
              len(files) == 1 and files[0].endswith("-docindex_classify.json") and dump["inputs"]["FileName"] == "dumped.pptx"
              and dump["request"]["messages"][0]["content"].startswith("File name: dumped.pptx"), files)

    # ---- 4. the CLI -------------------------------------------------
    print("== cli")
    env = {**os.environ, "PYTHONPATH": REPO}
    state.text = '{"title": "T", "docKind": "Other", "surface": "Pro", "summary": "s", "pe": "", "dev": "", "targetRelease": "", "tools": [], "keywords": []}'
    r = subprocess.run([sys.executable, "-m", "lrsdoc", "classify", "--input", "-"],
                       input=json.dumps({"inputs": {"FileName": "f", "ExistingKeywords": "", "DocText": "d"}, "options": {"max_retries": 0}}),
                       capture_output=True, text=True, env=env, cwd=REPO)
    lines = [json.loads(l) for l in r.stdout.splitlines() if l.strip()]
    check("cli classify: one result line, exit 0", r.returncode == 0 and len(lines) == 1 and lines[0]["result"]["data"]["docKind"] == "Other", r.stdout + r.stderr)
    state.text = "[[[DRAFT BEGIN]]]\nbody\n[[[DRAFT END]]]"
    r = subprocess.run([sys.executable, "-m", "lrsdoc", "generate", "--stream"],
                       input=json.dumps({"prompt": "testplan_draft", "inputs": {k: "" for k in draft.inputs}, "options": {"max_retries": 0, "show_thinking": True}}),
                       capture_output=True, text=True, env=env, cwd=REPO)
    lines = [json.loads(l) for l in r.stdout.splitlines() if l.strip()]
    check("cli generate --stream: delta lines then the result line",
          r.returncode == 0 and [l["delta"]["kind"] for l in lines[:-1]] == ["thinking", "thinking", "text", "text"]
          and lines[-1]["result"]["text"] == state.text and lines[-1]["result"]["stop_reason"] == "end_turn", r.stdout[:400] + r.stderr[-200:])
    state.stop_reason = "max_tokens"
    r = subprocess.run([sys.executable, "-m", "lrsdoc", "generate"],
                       input=json.dumps({"prompt": "testplan_draft", "inputs": {k: "" for k in draft.inputs}, "options": {"max_retries": 0}}),
                       capture_output=True, text=True, env=env, cwd=REPO)
    lines = [json.loads(l) for l in r.stdout.splitlines() if l.strip()]
    check("cli: truncation is an error line with the partial text and exit 2",
          r.returncode == 2 and lines[-1]["error"]["type"] == "Truncated" and lines[-1]["error"]["partial"] == state.text, r.stdout)
    state.stop_reason = "end_turn"
    r = subprocess.run([sys.executable, "-m", "lrsdoc", "generate"],
                       input=json.dumps({"prompt": "no_such_prompt", "inputs": {}}), capture_output=True, text=True, env=env, cwd=REPO)
    check("cli: an unknown prompt is exit 5 with the known names", r.returncode == 5 and "known" in r.stdout, r.stdout)
    with tempfile.TemporaryDirectory() as dd:
        outp = os.path.join(dd, "out.json")
        r = subprocess.run([sys.executable, "-m", "lrsdoc", "generate", "--output", outp],
                           input=json.dumps({"prompt": "testplan_draft", "inputs": {k: "" for k in draft.inputs}, "options": {"max_retries": 0}}),
                           capture_output=True, text=True, env=env, cwd=REPO)
        check("cli --output writes the result object to the file",
              r.returncode == 0 and json.load(open(outp))["text"] == state.text and json.loads(r.stdout)["result"]["written"] == outp, r.stdout)
    r = subprocess.run([sys.executable, "-m", "lrsdoc", "prompts"], capture_output=True, text=True, env=env, cwd=REPO)
    check("cli prompts lists the seven files with versions", r.returncode == 0 and r.stdout.count("\n") == 7 and "keyword_review" in r.stdout, r.stdout)

    # ---- 5. the tenant model ---------------------------------------
    # A second mock server stands in for the company's own deployment;
    # the Foundry client is the SDK's, so `api-key` on the wire (the
    # Claude API client sends only `x-api-key`) proves which backend
    # answered.
    print("== tenant model")
    tenant = State()
    tsrv = HTTPServer(("127.0.0.1", 0), make_handler(tenant))
    threading.Thread(target=tsrv.serve_forever, daemon=True).start()
    tenant_base = f"http://127.0.0.1:{tsrv.server_port}"
    classified = json.dumps({"title": "T", "docKind": "Other", "surface": "Pro", "summary": "s", "pe": "",
                             "dev": "", "targetRelease": "", "tools": [], "keywords": []})
    state.text = tenant.text = classified
    tenant_env = {"LRSDOC_TENANT": "foundry", "ANTHROPIC_FOUNDRY_BASE_URL": tenant_base,
                  "ANTHROPIC_FOUNDRY_API_KEY": "mock-foundry-key"}
    os.environ.update(tenant_env)
    inputs = {"FileName": "f", "ExistingKeywords": "", "DocText": "d"}

    calls = (tenant.calls, state.calls)
    res = t_classify(inputs, {"max_retries": 0})
    check("the tenant model serves the call, and the result names it",
          tenant.calls == calls[0] + 1 and state.calls == calls[1] and res.backend == "foundry"
          and res.data["docKind"] == "Other" and tenant.last_headers.get("api-key") == "mock-foundry-key",
          (tenant.calls - calls[0], state.calls - calls[1], res.backend))
    check("the prompt's own model is what the tenant is asked for",
          tenant.last_body["model"] == prompts.load("docindex_classify").model, tenant.last_body.get("model"))

    os.environ["LRSDOC_TENANT_MODEL"] = "corp-opus-deployment"
    t_classify(inputs, {"max_retries": 0})
    check("LRSDOC_TENANT_MODEL renames the model on the tenant backend only",
          tenant.last_body["model"] == "corp-opus-deployment", tenant.last_body.get("model"))
    del os.environ["LRSDOC_TENANT_MODEL"]

    for status, why in ((401, "will not authenticate"), (404, "has no such deployment"), (503, "is down")):
        tenant.status = status
        calls = (tenant.calls, state.calls)
        res = t_classify(inputs, {"max_retries": 0})
        check(f"a tenant that {why} ({status}) falls back to the Claude API",
              res.backend == "anthropic" and res.data["docKind"] == "Other"
              and tenant.calls == calls[0] + 1 and state.calls == calls[1] + 1
              and state.last_headers.get("x-api-key") == "mock-key", (res.backend, status))
    tenant.status = 200

    tenant.status = 400
    calls = state.calls
    try:
        t_classify(inputs, {"max_retries": 0})
        check("a 400 from the tenant is an answer about the request, not a fallback", False)
    except anthropic.APIStatusError as e:
        check("a 400 from the tenant is an answer about the request, not a fallback",
              e.status_code == 400 and state.calls == calls, (e.status_code, state.calls - calls))
    tenant.status = 200

    tenant.stop_reason = "refusal"
    calls = state.calls
    try:
        t_classify(inputs, {"max_retries": 0})
        check("a refusal from the tenant is not re-asked of the Claude API", False)
    except llm.Refused:
        check("a refusal from the tenant is not re-asked of the Claude API", state.calls == calls, state.calls - calls)
    tenant.stop_reason = "end_turn"

    # a streamed reply that dies after the first chunk: the caller has
    # already seen text, so re-sending it anywhere would repeat it
    tenant.cut_stream = True
    calls = state.calls
    deltas = []
    try:
        # an explicit short timeout: a runner that does not surface the
        # closed socket must fail this leg, not sit on the prompt's
        # 600 s default
        t_generate("testplan_draft", {k: "" for k in draft.inputs},
                   {"max_retries": 0, "timeout_s": 10},
                   on_delta=lambda kind, text: deltas.append(text))
        check("a stream that dies mid-flight is not re-sent to the fallback", False)
    except Exception:
        check("a stream that dies mid-flight is not re-sent to the fallback",
              state.calls == calls and deltas, (state.calls - calls, deltas))
    tenant.cut_stream = False

    os.environ["LRSDOC_TENANT_FALLBACK"] = "0"
    tenant.status = 503
    calls = state.calls
    try:
        t_classify(inputs, {"max_retries": 0})
        check("LRSDOC_TENANT_FALLBACK=0 makes the tenant model the only backend", False)
    except anthropic.APIStatusError as e:
        check("LRSDOC_TENANT_FALLBACK=0 makes the tenant model the only backend",
              e.status_code == 503 and state.calls == calls, (e.status_code, state.calls - calls))
    del os.environ["LRSDOC_TENANT_FALLBACK"]
    tenant.status = 200

    os.environ["LRSDOC_TENANT"] = "bedrock"
    try:
        llm.backends()
        check("an unknown provider names itself and the known ones", False)
    except llm.LLMError as e:
        check("an unknown provider names itself and the known ones",
              "bedrock" in str(e) and "foundry" in str(e), e)
    os.environ["LRSDOC_TENANT"] = "foundry"

    # the CLI, with the run narrated: the switch is one progress line
    tenant.status = 401
    env_t = {**os.environ, "PYTHONPATH": REPO, "LRSDOC_PROGRESS": "1"}
    r = subprocess.run([sys.executable, "-m", "lrsdoc", "classify", "--input", "-"],
                       input=json.dumps({"inputs": inputs, "options": {"max_retries": 0}}),
                       capture_output=True, text=True, env=env_t, cwd=REPO)
    out = [json.loads(l) for l in r.stdout.splitlines() if l.strip()]
    check("cli: the fallback is one progress line and a result served by the Claude API",
          r.returncode == 0 and out[-1]["result"]["backend"] == "anthropic"
          and "the tenant model (foundry) could not serve this call" in r.stderr
          and "falling back to the Claude API" in r.stderr
          and "-> the tenant model (foundry)" in r.stderr, r.stderr[-400:])
    tenant.status = 200

    for k in tenant_env:
        del os.environ[k]
    check("with no tenant configured the Claude API is the only backend",
          [b.provider for b in llm.backends()] == ["anthropic"], llm.backends())
    tsrv.shutdown()

    # the Node side: config.llm.tenant -> the environment the layer reads
    def tenant_env_of(block, env=None):
        r = subprocess.run(
            ["node", "--input-type=module", "-e",
             "import {tenantEnv} from './pipeline/llm.mjs';\n"
             f"const e = {json.dumps(env or {})};\n"
             f"try {{ tenantEnv(e, {json.dumps(block)}); }} catch (err) {{ e.__error = err.message; }}\n"
             "console.log(JSON.stringify(e));"],
            capture_output=True, text=True, cwd=REPO)
        return json.loads(r.stdout or "{}")

    e = tenant_env_of({"provider": "foundry", "resource": "my-company-ai",
                       "apiKey": "corp-key", "model": "corp-opus-deployment"})
    check("llm.tenant -> LRSDOC_TENANT + the SDK's own ANTHROPIC_FOUNDRY_* credentials",
          e == {"LRSDOC_TENANT": "foundry", "ANTHROPIC_FOUNDRY_RESOURCE": "my-company-ai",
                "ANTHROPIC_FOUNDRY_API_KEY": "corp-key", "LRSDOC_TENANT_MODEL": "corp-opus-deployment"}, e)
    e = tenant_env_of({"baseUrl": "https://corp.example/anthropic", "apiKey": "k", "fallback": False})
    check("llm.tenant: baseUrl stands in for resource, provider defaults to foundry, fallback:false carries",
          e.get("ANTHROPIC_FOUNDRY_BASE_URL") == "https://corp.example/anthropic"
          and e.get("LRSDOC_TENANT") == "foundry" and e.get("LRSDOC_TENANT_FALLBACK") == "0", e)
    e = tenant_env_of({"provider": "bedrock", "resource": "r", "apiKey": "k"})
    check("llm.tenant: an unknown provider fails with the known ones named",
          "bedrock" in e.get("__error", "") and "foundry" in e.get("__error", ""), e)
    e = tenant_env_of({"apiKey": "k"})
    check("llm.tenant: neither resource nor baseUrl fails with the fix named",
          "resource" in e.get("__error", "") and "baseUrl" in e.get("__error", ""), e)
    e = tenant_env_of({"resource": "r"})
    check("llm.tenant: a missing key fails naming llm.tenant.apiKey",
          "llm.tenant.apiKey" in e.get("__error", ""), e)
    e = tenant_env_of({"resource": "my-company-ai", "apiKey": "k"},
                      env={"ANTHROPIC_FOUNDRY_BASE_URL": "https://stale.example",
                           "LRSDOC_TENANT_MODEL": "stale-deployment",
                           "LRSDOC_TENANT_FALLBACK": "0"})
    check("llm.tenant: the block outranks a stale endpoint/model/fallback in the environment",
          "ANTHROPIC_FOUNDRY_BASE_URL" not in e and "LRSDOC_TENANT_MODEL" not in e
          and "LRSDOC_TENANT_FALLBACK" not in e and e.get("ANTHROPIC_FOUNDRY_RESOURCE") == "my-company-ai", e)

    srv.shutdown()
    print(f"\n{passed} passed, {failed} failed")
    if failed:
        print("FAILED: " + ", ".join(failures))
        sys.exit(1)
    print("RESULT: PASS")


if __name__ == "__main__":
    main()
