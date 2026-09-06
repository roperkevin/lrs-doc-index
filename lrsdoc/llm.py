"""The one place a model is called.

``call(prompt, values, ...)`` renders a :class:`lrsdoc.prompts.Prompt`,
sends it through the official Anthropic SDK and returns a
:class:`Result`. Everything the old Node client hand-rolled — retries
with backoff, the SSE parser, OAuth token minting — is the SDK's job
here: credentials come from ``ANTHROPIC_API_KEY``, ``ANTHROPIC_AUTH_TOKEN``
or an ``ant auth login`` profile, and ``ANTHROPIC_BASE_URL`` redirects a
run (the gates point it at a mock server).

Request shape, per prompt:
- ``system`` is the prompt's System section as one text block marked
  ``cache_control: ephemeral`` (the stable prefix); the rendered User
  section is the single user message.
- ``output_config.effort`` from the prompt (or the caller);
  ``output_config.format`` is the prompt's JSON schema for
  ``output: json_schema`` prompts.
- thinking is the model's default (adaptive on Claude Opus 5); with
  ``show_thinking`` the request asks for ``display: "summarized"`` so
  the reasoning summary streams to the caller's ``on_delta``.
- ``json_schema`` prompts are sent non-streaming (small replies);
  everything else streams, so a long generation never sits behind a
  silent connection.

Outcomes: ``stop_reason: max_tokens`` raises :class:`Truncated` (with
the partial text), ``refusal`` raises :class:`Refused`; a
``json_schema`` reply that is not JSON raises :class:`ContractError`.
Sentinel-JSON replies are parsed when the sentinels are present and
returned raw otherwise — the Node consumers keep their own fail-closed
slice and their own findings.

With ``LRSDOC_PROGRESS`` set (``pipeline/llm.mjs`` sets it whenever the
calling job is narrating its run), each call writes ``progress:`` lines
to STDERR in the pipeline's shared voice — the request shape going out,
the latency to the first streamed chunk, and the stop reason, elapsed
time and token usage coming back. stdout keeps the JSON-lines protocol.
"""

from __future__ import annotations

import datetime as _dt
import json
import os
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

import anthropic

from .prompts import Prompt

DEFAULT_MAX_RETRIES = 4
DEFAULT_TIMEOUT_S = 600.0

OnDelta = Callable[[str, str], None]


def _progress_on() -> bool:
    """``LRSDOC_PROGRESS`` — set by the Node bridge (pipeline/llm.mjs)
    when the calling job is narrating its run, so the model call is not
    the one silent stretch in an otherwise-narrated pipeline."""
    return os.environ.get("LRSDOC_PROGRESS", "") not in ("", "0", "false", "no")


def _note(message: str) -> None:
    """One ``progress:`` line on stderr, in the pipeline's shared voice
    (pipeline/lib/progress.mjs). stdout carries the JSON-lines protocol
    and is never touched. Best effort: a closed pipe never fails a call."""
    if not _progress_on():
        return
    try:
        sys.stderr.write(f"progress: {message}\n")
        sys.stderr.flush()
    except Exception:  # pragma: no cover - a closed stderr
        pass


class LLMError(Exception):
    exit_code = 1


class Truncated(LLMError):
    """The reply hit max_tokens; ``partial`` holds what arrived."""

    exit_code = 2

    def __init__(self, message: str, partial: str = ""):
        super().__init__(message)
        self.partial = partial


class Refused(LLMError):
    exit_code = 3


class ContractError(LLMError):
    """The reply does not satisfy the prompt's output contract."""

    exit_code = 4


@dataclass
class Result:
    text: str
    stop_reason: str
    model: str
    prompt: str
    prompt_version: str
    data: object = None
    usage: dict = field(default_factory=dict)
    request_id: str | None = None

    def to_dict(self) -> dict:
        return {
            "text": self.text, "data": self.data, "stop_reason": self.stop_reason,
            "model": self.model, "prompt": self.prompt, "prompt_version": self.prompt_version,
            "usage": self.usage, "request_id": self.request_id,
        }


def make_client(max_retries: int = DEFAULT_MAX_RETRIES, timeout_s: float | None = None) -> anthropic.Anthropic:
    return anthropic.Anthropic(
        max_retries=int(max_retries),
        timeout=float(timeout_s if timeout_s is not None else DEFAULT_TIMEOUT_S),
    )


def build_request(prompt: Prompt, values: dict, *, model: str | None = None,
                  max_tokens: int | None = None, effort: str | None = None,
                  show_thinking: bool = False) -> dict:
    system, user = prompt.render(values)
    req: dict = {
        "model": model or prompt.model,
        "max_tokens": int(max_tokens or prompt.max_tokens),
        "system": [{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}],
        "messages": [{"role": "user", "content": user}],
    }
    output_config: dict = {}
    eff = effort or prompt.effort
    if eff:
        output_config["effort"] = eff
    if prompt.output == "json_schema":
        output_config["format"] = {"type": "json_schema", "schema": prompt.schema}
    if output_config:
        req["output_config"] = output_config
    if show_thinking:
        req["thinking"] = {"type": "adaptive", "display": "summarized"}
    return req


def _dump(dump_dir: str | None, prompt: Prompt, values: dict, req: dict) -> None:
    """Write the rendered request beside its inputs (a debugging aid;
    ``LRSDOC_DUMP_DIR`` or the ``dump_dir`` argument turns it on)."""
    if not dump_dir:
        return
    d = Path(dump_dir)
    d.mkdir(parents=True, exist_ok=True)
    stamp = _dt.datetime.now(_dt.timezone.utc).strftime("%Y%m%dT%H%M%S%f")
    (d / f"{stamp}-{prompt.name}.json").write_text(
        json.dumps({"prompt": prompt.name, "version": prompt.version, "inputs": values, "request": req},
                   ensure_ascii=False, indent=1),
        encoding="utf-8",
    )


def _slice_sentinels(text: str, sentinels: list[str]) -> str | None:
    if len(sentinels) != 2:
        return None
    a = text.find(sentinels[0])
    b = text.rfind(sentinels[1])
    if a < 0 or b < 0 or b <= a:
        return None
    return text[a + len(sentinels[0]):b].strip()


def _usage(msg) -> dict:
    u = getattr(msg, "usage", None)
    if u is None:
        return {}
    out = {}
    for k in ("input_tokens", "output_tokens", "cache_creation_input_tokens", "cache_read_input_tokens"):
        v = getattr(u, k, None)
        if v is not None:
            out[k] = v
    return out


def call(prompt: Prompt, values: dict, *, model: str | None = None, max_tokens: int | None = None,
         effort: str | None = None, stream: bool | None = None, show_thinking: bool = False,
         on_delta: OnDelta | None = None, max_retries: int = DEFAULT_MAX_RETRIES,
         timeout_s: float | None = None, dump_dir: str | None = None) -> Result:
    req = build_request(prompt, values, model=model, max_tokens=max_tokens, effort=effort,
                        show_thinking=show_thinking)
    _dump(dump_dir or os.environ.get("LRSDOC_DUMP_DIR"), prompt, values, req)
    effective_timeout = timeout_s if timeout_s is not None else prompt.timeout_s
    client = make_client(max_retries=max_retries, timeout_s=effective_timeout)
    use_stream = (prompt.output != "json_schema") if stream is None else bool(stream)

    system_chars = sum(len(b.get("text", "")) for b in req["system"])
    user_chars = len(req["messages"][0]["content"])
    _note(
        f"lrsdoc {prompt.name} v{prompt.version} -> {req['model']} — "
        f"{system_chars} + {user_chars} chars in, max_tokens {req['max_tokens']}, "
        f"{'streaming' if use_stream else 'one reply'}, "
        f"up to {max_retries} SDK retr{'y' if max_retries == 1 else 'ies'}, "
        f"timeout {int(effective_timeout if effective_timeout is not None else DEFAULT_TIMEOUT_S)}s"
    )
    t0 = time.monotonic()

    if use_stream:
        first = None
        with client.messages.stream(**req) as s:
            for event in s:
                if event.type == "content_block_delta":
                    if first is None:
                        first = time.monotonic() - t0
                        # the one measurement that separates "the request
                        # is stuck (auth, a retry loop, a dead socket)"
                        # from "the model is thinking"
                        _note(f"lrsdoc {prompt.name} — first chunk after {first:.1f}s")
                    if on_delta is not None:
                        d = event.delta
                        if d.type == "text_delta":
                            on_delta("text", d.text)
                        elif d.type == "thinking_delta":
                            on_delta("thinking", d.thinking)
            msg = s.get_final_message()
    else:
        msg = client.messages.create(**req)

    usage = _usage(msg)
    _note(
        f"lrsdoc {prompt.name} — {msg.stop_reason or 'end'} in {time.monotonic() - t0:.1f}s, "
        f"{usage.get('input_tokens', '?')} in / {usage.get('output_tokens', '?')} out token(s)"
        + (f", {usage['cache_read_input_tokens']} cached" if usage.get("cache_read_input_tokens") else "")
    )

    text = "".join(b.text for b in (msg.content or []) if getattr(b, "type", None) == "text")
    stop = str(msg.stop_reason or "")
    if stop == "refusal":
        details = getattr(msg, "stop_details", None)
        why = f" ({details.category}: {details.explanation})" if details and getattr(details, "category", None) else ""
        raise Refused(f"{prompt.name}: the model refused the request (stop_reason: refusal){why}")
    if stop == "max_tokens":
        raise Truncated(
            f"{prompt.name}: output truncated (stop_reason: max_tokens at {req['max_tokens']}) — raise the caller's max_tokens",
            partial=text,
        )

    data = None
    if prompt.output == "json_schema":
        try:
            data = json.loads(text)
        except json.JSONDecodeError as e:
            raise ContractError(f"{prompt.name}: schema-pinned reply is not JSON ({e}): {text[:300]!r}") from e
    elif prompt.output == "sentinel_json":
        inner = _slice_sentinels(text, prompt.sentinels)
        if inner is not None:
            try:
                data = json.loads(inner)
            except json.JSONDecodeError:
                data = None
    return Result(text=text, data=data, stop_reason=stop, model=str(getattr(msg, "model", "") or req["model"]),
                  prompt=prompt.name, prompt_version=prompt.version, usage=usage,
                  request_id=getattr(msg, "_request_id", None))

