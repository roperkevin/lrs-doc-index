"""generate — a markdown or sentinel-JSON generation from any prompt.

Used for the test-plan draft (``testplan_draft``), the figures pass
(``testplan_figures``), the deck pass (``testplan_deck``) and the
case-normalisation lane (``case_normalize``). The reply streams; the
result's ``text`` is the whole reply and ``data`` the parsed JSON when
the prompt is ``sentinel_json`` and the sentinels are present. The
consumers (``pipeline/testplangen.mjs``, ``pipeline/lib/*spec.mjs``,
``pipeline/lib/casenormalize.mjs``) keep their own fail-closed slices
and verifiers over ``text``.
"""

from __future__ import annotations

from .. import llm, prompts
from ._common import call_options


def generate(prompt_name: str, inputs: dict, options: dict | None = None, on_delta=None) -> llm.Result:
    if not prompt_name:
        raise ValueError("generate needs a prompt name (e.g. testplan_draft)")
    prompt = prompts.load(prompt_name)
    values = {k: ("" if inputs.get(k) is None else str(inputs.get(k))) for k in prompt.inputs}
    return llm.call(prompt, values, on_delta=on_delta, **call_options(options))
