"""review — the second reader of keyword merge proposals: the pending
queue → one verdict per proposal.

Prompt ``keyword_review`` (JSON schema pinned). Inputs: Proposals (one
``<id> | <alias> [kind] -> <canonical> [kind] | <reason>`` per line),
OfficialVocabulary (the documentation's tool names and terms, one per
line). The result's ``data`` is ``{"verdicts": [{id, verdict, why}]}``
with verdict one of approve / withdraw / hold; ``curate.mjs --review``
re-runs its deterministic guard before acting on an approval.
"""

from __future__ import annotations

from .. import llm, prompts
from ._common import call_options

VERDICTS = ("approve", "withdraw", "hold")


def review(inputs: dict, options: dict | None = None, on_delta=None) -> llm.Result:
    prompt = prompts.load("keyword_review")
    values = {
        "Proposals": str(inputs.get("Proposals", "")),
        "OfficialVocabulary": str(inputs.get("OfficialVocabulary", "") or "(none)"),
    }
    res = llm.call(prompt, values, stream=False, on_delta=on_delta, **call_options(options))
    data = res.data if isinstance(res.data, dict) else {}
    raw = data.get("verdicts")
    out = []
    for v in raw if isinstance(raw, list) else []:
        if not isinstance(v, dict):
            continue
        try:
            vid = int(v.get("id"))
        except (TypeError, ValueError):
            continue
        verdict = str(v.get("verdict", "")).strip().lower()
        if verdict not in VERDICTS:
            verdict = "hold"
        out.append({"id": vid, "verdict": verdict, "why": str(v.get("why", ""))})
    data["verdicts"] = out
    res.data = data
    return res
