from __future__ import annotations

from .. import llm

_KEYS = ("model", "max_tokens", "effort", "show_thinking", "stream", "max_retries", "timeout_s", "dump_dir")


def call_options(options: dict | None) -> dict:
    """The subset of a task's options that :func:`lrsdoc.llm.call` takes."""
    o = options or {}
    out: dict = {}
    for k in _KEYS:
        if k in o and o[k] is not None:
            out[k] = o[k]
    if "max_tokens" in out:
        out["max_tokens"] = int(out["max_tokens"])
    if "max_retries" in out:
        out["max_retries"] = int(out["max_retries"])
    else:
        out["max_retries"] = llm.DEFAULT_MAX_RETRIES
    if "timeout_s" in out:
        out["timeout_s"] = float(out["timeout_s"])
    for k in ("show_thinking", "stream"):
        if k in out:
            out[k] = bool(out[k])
    return out
