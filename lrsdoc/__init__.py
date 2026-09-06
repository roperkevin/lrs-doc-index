"""lrsdoc — the LRS Doc Index model layer.

Every model call the pipeline makes goes through this package: a
prompt file under ``prompts/`` (front matter + ``## System`` +
``## User``) is loaded by :mod:`lrsdoc.prompts`, rendered with the
call's inputs, and sent through the official Anthropic SDK by
:mod:`lrsdoc.llm`. The three tasks under :mod:`lrsdoc.tasks` are what
the Node pipeline (``pipeline/llm.mjs``) and the command line
(``python -m lrsdoc``) invoke.

Credentials are the SDK's own: ``ANTHROPIC_API_KEY``,
``ANTHROPIC_AUTH_TOKEN`` or an ``ant auth login`` profile;
``ANTHROPIC_BASE_URL`` points a run at a different endpoint (the test
gates use it for their mock server).

With ``LRSDOC_TENANT=foundry`` set (from ``llm.tenant`` in config) the
call goes to the tenant's own Claude deployment on Microsoft Foundry
first — the SDK's ``AnthropicFoundry`` client on its
``ANTHROPIC_FOUNDRY_*`` credentials — and falls back to the Claude API
above when that backend cannot serve it (:mod:`lrsdoc.llm`).
"""

__version__ = "1.1.0"
