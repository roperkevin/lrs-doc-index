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
    check("six prompt files load", names == ["case_normalize", "docindex_classify", "keyword_curation",
                                            "testplan_deck", "testplan_draft", "testplan_figures"], names)
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
        cls.render({"FileName": "a", "ExistingKeywords": "", "DocText": "", "Extra": "x"})
        check("render refuses unknown inputs", False)
    except prompts.PromptInputError as e:
        check("render refuses unknown inputs", "unknown" in str(e), e)
    sysm, usr = cls.render({"FileName": "x$'y.pptx", "ExistingKeywords": "{DocText}", "DocText": "BODY {FileName} $& end"})
    check("render is single-pass and never expands $-patterns",
          "x$'y.pptx" in usr and "{DocText}" in usr and "BODY {FileName} $& end" in usr and usr.count("BODY") == 1, usr[:300])
    check("render puts the document text in the user turn and the rules in the system turn",
          "<<<DOCUMENT TEXT BEGIN>>>" in usr and "FIELD RULES" in sysm and "{" not in sysm.replace('{\n', ''), "")

    # ---- 2. request shape -----------------------------------------
    print("== request shape")
    req = llm.build_request(cls, {"FileName": "f", "ExistingKeywords": "k", "DocText": "d"})
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
    res = t_classify({"FileName": "Alpha.pptx", "ExistingKeywords": "routes", "DocText": "text"}, {"max_retries": 0})
    check("classify: non-streaming, schema-pinned, data parsed, api key header",
          res.data["docKind"] == "Test Plan" and res.data["tools"] == ["Merge Routes"] and not state.last_body.get("stream")
          and state.last_body["output_config"]["format"]["type"] == "json_schema"
          and state.last_headers.get("x-api-key") == "mock-key" and res.prompt_version == "3.0.0"
          and res.stop_reason == "end_turn" and res.usage.get("output_tokens"), str(res.to_dict())[:300])
    check("classify: the user turn carries the file name and the fenced document text",
          "File name: Alpha.pptx" in mock.user_text(state.last_body) and "<<<DOCUMENT TEXT BEGIN>>>\ntext\n<<<DOCUMENT TEXT END>>>" in mock.user_text(state.last_body),
          mock.user_text(state.last_body)[:200])
    state.text = json.dumps({"proposals": [{"alias": "centerlines", "canonical": "centerline", "why": "plural"}]})
    res = t_curate({"Vocabulary": "centerline [topic]\ncenterlines [topic]", "DoNotPropose": ""}, {"max_retries": 0})
    check("curate: proposals parsed", res.data["proposals"][0]["alias"] == "centerlines", res.data)

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
        t_classify({"FileName": "f", "ExistingKeywords": "", "DocText": ""}, {"max_retries": 0})
        check("a non-JSON schema-pinned reply raises ContractError", False)
    except llm.ContractError as e:
        check("a non-JSON schema-pinned reply raises ContractError", e.exit_code == 4, e)
    state.text = json.dumps({"title": "T", "docKind": "Other", "surface": "Pro", "summary": "s", "pe": "", "dev": "",
                             "targetRelease": "", "tools": [], "keywords": []})
    state.fail_first = 1
    calls_before = state.calls
    res = t_classify({"FileName": "f", "ExistingKeywords": "", "DocText": ""}, {"max_retries": 2})
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
    check("cli prompts lists the six files with versions", r.returncode == 0 and r.stdout.count("\n") == 6 and "testplan_draft" in r.stdout, r.stdout)

    srv.shutdown()
    print(f"\n{passed} passed, {failed} failed")
    if failed:
        print("FAILED: " + ", ".join(failures))
        sys.exit(1)
    print("RESULT: PASS")


if __name__ == "__main__":
    main()
