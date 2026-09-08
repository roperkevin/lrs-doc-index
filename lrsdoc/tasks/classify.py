"""classify — the Doc Index step: one document → the eleven catalog fields.

Prompt ``docindex_classify`` (JSON schema pinned). Inputs: FileName,
Folder (the library folder the file sits in, "" at the root), Signals
(the deterministic evidence block the sweep assembles from
pipeline/lib/docsignals.mjs — "(none)" when nothing is known),
ExistingKeywords, KnownTools (the official tool/widget/operation names
grouped by kind — "(none)" when the caller has no vocabulary), DocText.
The result's ``data`` is the validated object; the sweep whitelists
docKind/surface/surfaces/products, normalizes tools to the vocabulary,
reconciles the reply with the signals and caps the title.
"""

from __future__ import annotations

from .. import llm, prompts
from ._common import call_options


def classify(inputs: dict, options: dict | None = None, on_delta=None) -> llm.Result:
    prompt = prompts.load("docindex_classify")
    values = {
        "FileName": str(inputs.get("FileName", "")),
        "Folder": str(inputs.get("Folder", "") or "(library root)"),
        "Signals": str(inputs.get("Signals", "") or "(none)"),
        "ExistingKeywords": str(inputs.get("ExistingKeywords", "")),
        "KnownTools": str(inputs.get("KnownTools", "") or "(none)"),
        "DocText": str(inputs.get("DocText", "")),
    }
    res = llm.call(prompt, values, stream=False, on_delta=on_delta, **call_options(options))
    data = res.data if isinstance(res.data, dict) else {}
    # shape guard (the schema guarantees this; belt and braces for a
    # different endpoint): strings are strings, the four lists are lists
    for k in ("title", "docKind", "surface", "summary", "pe", "dev", "targetRelease"):
        data[k] = "" if data.get(k) is None else str(data.get(k))
    for k in ("surfaces", "products", "tools", "keywords"):
        v = data.get(k)
        data[k] = [str(x) for x in v] if isinstance(v, list) else []
    res.data = data
    return res
