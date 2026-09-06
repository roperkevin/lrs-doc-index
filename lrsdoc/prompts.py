"""Prompt files: parse, validate and render.

A prompt file is ``prompts/<name>.md``::

    ---
    name: testplan_draft
    version: 1.13.0
    model: claude-opus-5
    effort: high
    max_tokens: 64000
    output: markdown            # json_schema | sentinel_json | markdown
    schema: schemas/x.json      # json_schema only, relative to prompts/
    sentinels: ["[[[DRAFT BEGIN]]]", "[[[DRAFT END]]]"]
    inputs: ["StoryMeta", "StoryText", ...]
    ---

    ## System
    <the instruction block — the stable, cacheable prefix>

    ## User
    <the input frame; {Placeholder} slots named in `inputs`>

``pipeline/llm.mjs`` (``loadPrompt``) reads exactly the same format.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"
OUTPUT_KINDS = ("json_schema", "sentinel_json", "markdown")


class PromptError(ValueError):
    """A prompt file that does not follow the format."""


class PromptInputError(ValueError):
    """A render call whose inputs do not match the prompt's `inputs`."""


@dataclass
class Prompt:
    name: str
    version: str
    model: str
    max_tokens: int
    output: str
    system: str
    user: str
    path: Path
    effort: str | None = None
    schema: dict | None = None
    sentinels: list[str] = field(default_factory=list)
    inputs: list[str] = field(default_factory=list)
    timeout_s: int | None = None

    # ---- rendering -------------------------------------------------
    def render(self, values: dict) -> tuple[str, str]:
        """Substitute every ``{Input}`` slot in one pass.

        Whole-token substitution with a function replacer: a value that
        itself contains ``{StoryText}`` or ``$'`` stays literal — no
        second substitution, no regex-replacement expansion.
        """
        missing = [k for k in self.inputs if k not in values]
        unknown = [k for k in values if k not in self.inputs]
        if missing or unknown:
            raise PromptInputError(
                f"{self.name}: inputs do not match the prompt — "
                f"missing {missing or 'none'}, unknown {unknown or 'none'} "
                f"(expected exactly {self.inputs})"
            )
        if not self.inputs:
            return self.system, self.user
        pattern = re.compile(r"\{(" + "|".join(re.escape(k) for k in self.inputs) + r")\}")

        def sub(m: re.Match) -> str:
            v = values[m.group(1)]
            return "" if v is None else str(v)

        return pattern.sub(sub, self.system), pattern.sub(sub, self.user)

    def placeholders(self) -> set[str]:
        """Every ``{Word}`` slot present in the text (for validation)."""
        return set(re.findall(r"\{([A-Za-z][A-Za-z0-9]*)\}", self.system + "\n" + self.user))


def _parse_front_matter(block: str, path: Path) -> dict:
    meta: dict = {}
    for line in block.split("\n"):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$", line)
        if not m:
            raise PromptError(f"{path}: front matter line is not `key: value`: {line!r}")
        key, raw = m.group(1), m.group(2).strip()
        if raw.startswith("["):
            try:
                meta[key] = json.loads(raw)
            except json.JSONDecodeError as e:
                raise PromptError(f"{path}: {key}: list must be a JSON array ({e})") from e
        elif re.fullmatch(r"-?\d+", raw):
            meta[key] = int(raw)
        else:
            meta[key] = raw
    return meta


def load_file(path: Path | str) -> Prompt:
    path = Path(path)
    raw = path.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")
    if not raw.startswith("---\n"):
        raise PromptError(f"{path}: no front matter (file must start with a `---` line)")
    close = raw.find("\n---\n", 4)
    if close < 0:
        raise PromptError(f"{path}: unterminated front matter")
    meta = _parse_front_matter(raw[4:close], path)
    body = raw[close + 5:]
    sys_at, usr_at = body.find("## System"), body.find("## User")
    if sys_at < 0 or usr_at < 0 or usr_at < sys_at:
        raise PromptError(f"{path}: needs a `## System` section followed by a `## User` section")
    system = body[sys_at + len("## System"):usr_at].strip()
    user = body[usr_at + len("## User"):].strip()

    for key in ("name", "version", "model", "max_tokens", "output"):
        if key not in meta:
            raise PromptError(f"{path}: front matter is missing `{key}`")
    if meta["output"] not in OUTPUT_KINDS:
        raise PromptError(f"{path}: output must be one of {OUTPUT_KINDS}, not {meta['output']!r}")
    if not isinstance(meta["max_tokens"], int) or meta["max_tokens"] <= 0:
        raise PromptError(f"{path}: max_tokens must be a positive integer")
    inputs = meta.get("inputs", [])
    if not isinstance(inputs, list) or any(not isinstance(i, str) for i in inputs):
        raise PromptError(f"{path}: inputs must be a JSON array of names")
    sentinels = meta.get("sentinels", [])
    if sentinels and (not isinstance(sentinels, list) or len(sentinels) != 2):
        raise PromptError(f"{path}: sentinels must be a two-element JSON array [begin, end]")
    schema = None
    if meta["output"] == "json_schema":
        if "schema" not in meta:
            raise PromptError(f"{path}: output json_schema needs `schema: <file relative to prompts/>`")
        schema_path = path.parent / str(meta["schema"])
        try:
            schema = json.loads(schema_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            raise PromptError(f"{path}: schema {schema_path}: {e}") from e

    p = Prompt(
        name=str(meta["name"]), version=str(meta["version"]), model=str(meta["model"]),
        max_tokens=int(meta["max_tokens"]), output=str(meta["output"]),
        system=system, user=user, path=path,
        effort=(str(meta["effort"]) if meta.get("effort") else None),
        schema=schema, sentinels=list(sentinels), inputs=list(inputs),
        timeout_s=(int(meta["timeout_s"]) if meta.get("timeout_s") else None),
    )
    slots = p.placeholders()
    declared = set(p.inputs)
    if slots != declared:
        raise PromptError(
            f"{path}: `inputs` {sorted(declared)} does not match the {{slots}} in the text {sorted(slots)}"
        )
    return p


def load(name: str, prompts_dir: Path | str | None = None) -> Prompt:
    """Load ``prompts/<name>.md`` (or a path when ``name`` ends in .md)."""
    if str(name).endswith(".md"):
        return load_file(name)
    base = Path(prompts_dir) if prompts_dir else PROMPTS_DIR
    path = base / f"{name}.md"
    if not path.exists():
        known = sorted(p.stem for p in base.glob("*.md") if p.stem != "README")
        raise PromptError(f"no prompt named {name!r} under {base} (known: {known})")
    return load_file(path)


def list_prompts(prompts_dir: Path | str | None = None) -> list[Prompt]:
    base = Path(prompts_dir) if prompts_dir else PROMPTS_DIR
    return [load_file(p) for p in sorted(base.glob("*.md")) if p.stem not in ("README", "CHANGELOG")]
