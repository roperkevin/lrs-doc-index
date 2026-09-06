"""curate — the weekly keyword-vocabulary pass: one vocabulary chunk →
merge proposals.

Prompt ``keyword_curation`` (JSON schema pinned). Inputs: Vocabulary
(one ``title [kind]`` per line), DoNotPropose (titles that may never be
an alias). The result's ``data`` is ``{"proposals": [{alias, canonical,
why}]}``; ``curate.mjs`` applies its hallucination guard on top.
"""

from __future__ import annotations

from .. import llm, prompts
from ._common import call_options


def curate(inputs: dict, options: dict | None = None, on_delta=None) -> llm.Result:
    prompt = prompts.load("keyword_curation")
    values = {
        "Vocabulary": str(inputs.get("Vocabulary", "")),
        "DoNotPropose": str(inputs.get("DoNotPropose", "")),
    }
    res = llm.call(prompt, values, stream=False, on_delta=on_delta, **call_options(options))
    data = res.data if isinstance(res.data, dict) else {}
    props = data.get("proposals")
    data["proposals"] = [p for p in props if isinstance(p, dict)] if isinstance(props, list) else []
    res.data = data
    return res
