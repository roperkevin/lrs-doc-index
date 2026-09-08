"""The tasks: one function per kind of model call the pipeline makes.

Every task takes the call's inputs (a dict keyed by the prompt's input
names) and an ``options`` dict (``model``, ``max_tokens``, ``effort``,
``show_thinking``, ``stream``, ``max_retries``, ``timeout_s``,
``dump_dir``), returns a :class:`lrsdoc.llm.Result`, and raises the
:mod:`lrsdoc.llm` errors on truncation, refusal or a broken contract.
"""

from __future__ import annotations

from .classify import classify
from .curate import curate
from .generate import generate
from .review import review

TASKS = {"classify": classify, "curate": curate, "review": review, "generate": generate}


def run(task: str, payload: dict, on_delta=None):
    if task not in TASKS:
        raise ValueError(f"unknown task {task!r} (one of {sorted(TASKS)})")
    inputs = payload.get("inputs") or {}
    options = dict(payload.get("options") or {})
    if task == "generate":
        return generate(payload.get("prompt") or "", inputs, options, on_delta=on_delta)
    return TASKS[task](inputs, options, on_delta=on_delta)
