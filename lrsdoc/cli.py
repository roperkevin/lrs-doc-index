"""``python -m lrsdoc <task>`` — the process boundary the Node pipeline
calls across, and a hand tool.

    python -m lrsdoc classify  --input in.json [--output out.json]
    python -m lrsdoc curate    --input in.json
    python -m lrsdoc generate  --input in.json [--stream]
    python -m lrsdoc prompts               # list the prompt files

The input file (or ``-`` for stdin) is JSON::

    {"prompt": "testplan_draft",            # generate only
     "inputs": {"StoryMeta": "...", ...},
     "options": {"max_tokens": 32000, "effort": "high",
                 "show_thinking": true, "max_retries": 4,
                 "timeout_s": 600, "model": "claude-opus-5"}}

Output is JSON lines on stdout: with ``--stream`` one
``{"delta": {"kind": "text"|"thinking", "text": "..."}}`` line per
chunk as it arrives, then always one ``{"result": {...}}`` line (see
``lrsdoc.llm.Result.to_dict``). On failure one ``{"error": {"type",
"message", "partial"?}}`` line and a non-zero exit: 2 truncated
(max_tokens), 3 refused, 4 output contract, 5 bad input, 1 anything
else (transport, auth, a backend with no credentials). ``--output`` writes the result object to a file
instead of the final stdout line.
"""

from __future__ import annotations

import argparse
import json
import sys

import anthropic

from . import __version__, llm, prompts
from .tasks import run


def _emit(obj: dict) -> None:
    sys.stdout.write(json.dumps(obj, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def _read_payload(spec: str) -> dict:
    raw = sys.stdin.read() if spec == "-" else open(spec, encoding="utf-8").read()
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"input is not JSON: {e}") from e
    if not isinstance(payload, dict):
        raise ValueError("input must be a JSON object")
    return payload


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="lrsdoc", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("task", choices=["classify", "curate", "review", "generate", "prompts"])
    ap.add_argument("--input", "-i", default="-", help="JSON file with inputs/options, or - for stdin")
    ap.add_argument("--output", "-o", default=None, help="write the result object here instead of stdout")
    ap.add_argument("--stream", action="store_true", help="emit a delta line per streamed chunk")
    ap.add_argument("--version", action="version", version=f"lrsdoc {__version__}")
    a = ap.parse_args(argv)

    if a.task == "prompts":
        for p in prompts.list_prompts():
            print(f"{p.name:<20} {p.version:<8} {p.model:<16} {p.output:<13} max_tokens={p.max_tokens} inputs={','.join(p.inputs)}")
        return 0

    try:
        payload = _read_payload(a.input)
        on_delta = (lambda kind, text: _emit({"delta": {"kind": kind, "text": text}})) if a.stream else None
        if a.stream:
            payload.setdefault("options", {})
            payload["options"].setdefault("stream", True)
        res = run(a.task, payload, on_delta=on_delta)
    except (ValueError, prompts.PromptError, prompts.PromptInputError) as e:
        _emit({"error": {"type": type(e).__name__, "message": str(e)}})
        return 5
    except llm.LLMError as e:
        err = {"type": type(e).__name__, "message": str(e)}
        if isinstance(e, llm.Truncated):
            err["partial"] = e.partial
        _emit({"error": err})
        return e.exit_code
    except anthropic.APIStatusError as e:
        _emit({"error": {"type": type(e).__name__, "message": f"API {e.status_code}: {e.message}"}})
        return 1
    except anthropic.APIConnectionError as e:
        _emit({"error": {"type": type(e).__name__, "message": f"connection: {e}"}})
        return 1
    except anthropic.AnthropicError as e:
        # a client that would not construct: missing credentials for the
        # backend in play (LRSDOC_TENANT / ANTHROPIC_FOUNDRY_*), an SDK
        # too old for the tenant client
        _emit({"error": {"type": type(e).__name__, "message": str(e)}})
        return 1

    out = res.to_dict()
    if a.output:
        with open(a.output, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False)
        _emit({"result": {"written": a.output, "stop_reason": res.stop_reason, "prompt": res.prompt,
                          "prompt_version": res.prompt_version, "model": res.model, "usage": res.usage}})
    else:
        _emit({"result": out})
    return 0
