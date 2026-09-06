"""A faithful-enough stand-in for the Messages API, shared by the gates.

The official SDK is strict about response shapes (a stream is
accumulated from a full ``message_start`` message; a non-streaming
reply is parsed as a Message), so every gate that mocks
``/v1/messages`` builds its reply with these helpers instead of a
hand-written minimal event list.

``message_json(text, ...)`` → the dict of a complete non-streaming
reply; ``sse_bytes(text, ...)`` → the bytes of a complete SSE stream
(``thinking=`` adds a summarized-thinking block first; ``stop_reason``
sets the message_delta's stop reason). ``prompt_text(body)`` joins a
request's system blocks and user content, so a mock can look for a
prompt's landmark words wherever they sit.
"""

from __future__ import annotations

import json

MODEL = "claude-opus-5"


def message_json(text: str, stop_reason: str = "end_turn", model: str = MODEL) -> dict:
    return {
        "id": "msg_mock", "type": "message", "role": "assistant", "model": model,
        "content": [{"type": "text", "text": text}],
        "stop_reason": stop_reason, "stop_sequence": None,
        "usage": {"input_tokens": 1, "output_tokens": max(1, len(text) // 4)},
    }


def sse_events(text: str, stop_reason: str = "end_turn", thinking: list[str] | None = None,
               model: str = MODEL) -> list[dict]:
    events = [{
        "type": "message_start",
        "message": {"id": "msg_mock", "type": "message", "role": "assistant", "model": model,
                    "content": [], "stop_reason": None, "stop_sequence": None,
                    "usage": {"input_tokens": 1, "output_tokens": 0}},
    }]
    index = 0
    if thinking:
        events.append({"type": "content_block_start", "index": index,
                       "content_block": {"type": "thinking", "thinking": "", "signature": ""}})
        for chunk in thinking:
            events.append({"type": "content_block_delta", "index": index,
                           "delta": {"type": "thinking_delta", "thinking": chunk}})
        events.append({"type": "content_block_delta", "index": index,
                       "delta": {"type": "signature_delta", "signature": "sig"}})
        events.append({"type": "content_block_stop", "index": index})
        index += 1
    half = len(text) // 2
    events.append({"type": "content_block_start", "index": index, "content_block": {"type": "text", "text": ""}})
    for chunk in (text[:half], text[half:]):
        events.append({"type": "content_block_delta", "index": index, "delta": {"type": "text_delta", "text": chunk}})
    events.append({"type": "content_block_stop", "index": index})
    events.append({"type": "message_delta", "delta": {"stop_reason": stop_reason, "stop_sequence": None},
                   "usage": {"output_tokens": max(1, len(text) // 4)}})
    events.append({"type": "message_stop"})
    return events


def sse_bytes(text: str, stop_reason: str = "end_turn", thinking: list[str] | None = None,
              model: str = MODEL, keep: int | None = None) -> bytes:
    """The bytes of the stream; ``keep`` stops after that many events,
    for a mock that cuts a reply off mid-flight."""
    events = sse_events(text, stop_reason, thinking, model)
    return "".join(f"event: {e['type']}\ndata: {json.dumps(e)}\n\n"
                   for e in (events if keep is None else events[:keep])).encode()


def prompt_text(body: dict) -> str:
    """Everything the model would read: system blocks, then the user turn."""
    parts = []
    system = body.get("system")
    if isinstance(system, str):
        parts.append(system)
    elif isinstance(system, list):
        parts.extend(str(b.get("text", "")) for b in system if isinstance(b, dict))
    for m in body.get("messages") or []:
        c = m.get("content")
        if isinstance(c, str):
            parts.append(c)
        elif isinstance(c, list):
            parts.extend(str(b.get("text", "")) for b in c if isinstance(b, dict))
    return "\n".join(parts)


def user_text(body: dict) -> str:
    """The first user message's text."""
    for m in body.get("messages") or []:
        c = m.get("content")
        if isinstance(c, str):
            return c
        if isinstance(c, list):
            return "\n".join(str(b.get("text", "")) for b in c if isinstance(b, dict))
    return ""
