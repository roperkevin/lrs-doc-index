"""classify — the Doc Index step: one document → the nine catalog fields.

Prompt ``docindex_classify`` (JSON schema pinned). Inputs: FileName,
ExistingKeywords, KnownTools (the official tool/widget names, one per
line — "(none)" when the caller has no vocabulary), DocText. The
result's ``data`` is the validated object; the sweep whitelists
docKind/surface, normalizes tools to the vocabulary and caps the title.
"""

from __future__ import annotations

from .. import llm, prompts
from ._common import call_options


def classify(inputs: dict, options: dict | None = None, on_delta=None) -> llm.Result:
    prompt = prompts.load("docindex_classify")
    values = {
        "FileName": str(inputs.get("FileName", "")),
        "ExistingKeywords": str(inputs.get("ExistingKeywords", "")),
        "KnownTools": str(inputs.get("KnownTools", "") or "(none)"),
        "DocText": str(inputs.get("DocText", "")),
    }
    res = llm.call(prompt, values, stream=False, on_delta=on_delta, **call_options(options))
    data = res.data if isinstance(res.data, dict) else {}
    # shape guard (the schema guarantees this; belt and braces for a
    # different endpoint): strings are strings, the two lists are lists
    for k in ("title", "docKind", "surface", "summary", "pe", "dev", "targetRelease"):
        data[k] = "" if data.get(k) is None else str(data.get(k))
    for k in ("tools", "keywords"):
        v = data.get(k)
        data[k] = [str(x) for x in v] if isinstance(v, list) else []
    res.data = data
    return res
