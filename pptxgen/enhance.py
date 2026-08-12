"""enhance — the optional Claude API stage of sidecar_to_pptx --enhance.

Sends the raw sidecar markdown to the Claude API with the versioned
DeckOutline_Prompt.md as the system prompt and structured outputs
enforcing deck_outline.OUTLINE_SCHEMA, then validates the response with
deck_outline.load_outline() (which re-attaches metadata/related/keywords
from the parsed sidecar verbatim — the model is never allowed to rewrite
metadata, and post-hoc checks catch what a JSON schema cannot express).

Every failure mode raises EnhanceError with a one-line reason; the CLI
maps that to a deterministic-outline fallback (or exit 3 under
--strict-enhance). This module must import cleanly WITHOUT the anthropic
package installed — the import is deferred until enhance_outline() runs,
so CI and no-AI users never need the dependency.

Setup:  pip install anthropic;  export ANTHROPIC_API_KEY=...
Model:  claude-opus-5 by default (--model overrides). Thinking is left
at the model default (adaptive); no sampling parameters are sent.
Streaming is used so large sidecar bodies don't hit HTTP timeouts.
"""
from __future__ import annotations

import json
import os

from deck_outline import (DeckOutline, OUTLINE_SCHEMA, OutlineError,
                          load_outline)
from sidecar_parser import Sidecar

PROMPT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           'DeckOutline_Prompt.md')
MAX_TOKENS = 32000


class EnhanceError(Exception):
    """The enhancement stage could not produce a valid outline."""


def _load_prompt() -> str:
    try:
        return open(PROMPT_PATH, encoding='utf-8').read()
    except OSError as exc:
        raise EnhanceError(f'cannot read DeckOutline_Prompt.md: {exc}') from exc


def enhance_outline(sc: Sidecar, md_text: str,
                    model: str = 'claude-opus-5') -> DeckOutline:
    """sidecar (parsed + raw text) -> AI-restructured DeckOutline.
    Raises EnhanceError on any failure; never returns a partial deck."""
    if not os.environ.get('ANTHROPIC_API_KEY'):
        raise EnhanceError('ANTHROPIC_API_KEY is not set')
    try:
        import anthropic
    except ImportError as exc:
        raise EnhanceError(
            'the anthropic package is not installed '
            '(pip install anthropic)') from exc

    system_prompt = _load_prompt()
    client = anthropic.Anthropic()
    try:
        with client.messages.stream(
            model=model,
            max_tokens=MAX_TOKENS,
            system=system_prompt,
            output_config={'format': {'type': 'json_schema',
                                      'schema': OUTLINE_SCHEMA}},
            messages=[{'role': 'user', 'content': md_text}],
        ) as stream:
            response = stream.get_final_message()
    except anthropic.APIError as exc:
        raise EnhanceError(f'API error: {exc}') from exc
    except Exception as exc:  # network layer, auth plumbing, ...
        raise EnhanceError(f'{type(exc).__name__}: {exc}') from exc

    if response.stop_reason == 'refusal':
        raise EnhanceError('the model declined the request '
                           '(stop_reason=refusal)')
    if response.stop_reason == 'max_tokens':
        raise EnhanceError(f'response truncated at {MAX_TOKENS} tokens '
                           '(stop_reason=max_tokens)')

    text = next((b.text for b in response.content if b.type == 'text'), '')
    if not text:
        raise EnhanceError('response contained no text block')
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise EnhanceError(f'response is not valid JSON: {exc}') from exc

    try:
        return load_outline(data, sc)
    except OutlineError as exc:
        raise EnhanceError(f'outline rejected: {exc}') from exc
