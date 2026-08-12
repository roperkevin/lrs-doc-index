"""sidecar_parser — parse an LRS Doc Index sidecar .md into a structured model.

Consumes the sidecar format produced by the indexing flow (header) and
ZipTextExtract (body). The format contract lives in:

  - flow/v2_5/definition.json          Sidecar_header WDL template (production)
  - review/harness/render_sample.py    Python mirror of the header
  - scripts/ZipTextExtract.ts:87-116   body contract (pptx + docx lanes)
  - review/harness/check_format.py     machine-enforced assertions

This module deliberately MIRRORS (rather than imports) the harness's
contract logic — pptxgen/ must not depend on review/harness internals.
The two load-bearing regexes are copied verbatim with provenance notes;
drift between the mirror and the flow is caught by check_pptx.py, which
runs this parser over render_sample.py output in CI.

Design rules:
  - PyYAML + stdlib only. No pptx import here, so future follow-ons
    (docx handoff, in-tenant port) can reuse the parser standalone.
  - Only two hard failures, both raised as SidecarError from
    parse_sidecar(): the file does not open with the ```yaml fence, or
    the fence never closes. EVERYTHING else degrades: shape-mismatched
    related bullets keep their raw text, malformed tables pad ragged
    rows, unknown constructs fall through to plain paragraphs. A
    sidecar that render_sample.py would bless must never crash here,
    and neither should a hand-edited one.
  - docx-sourced bodies (## headings instead of "## Slide N — title")
    parse into the same Section model with body_kind="headings".
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

import yaml

# Copied verbatim from review/harness/check_format.py (slide-section
# heading assertion) — the em dash and single space padding are part of
# the contract. Title is optional: an untitled slide renders as
# "## Slide 3" with no separator.
SLIDE_RE = re.compile(r'^## Slide (\d+)(?: — (.*))?$')

# Related bullet as emitted by scripts/SidecarPatch.ts (set mode):
#   - [Title](<url>) — why <!-- rel:ID -->
RELATED_RE = re.compile(r'^- \[(?P<title>.*)\]\(<(?P<url>.*)>\)'
                        r'(?: — (?P<why>.*?))?\s*'
                        r'(?:<!-- rel:(?P<doc>\d+) -->)?\s*$')

# Header strip source link: [Source: name.pptx](<https://...>)
SOURCE_RE = re.compile(r'^\[Source: (?P<file>.*)\]\(<(?P<url>.*)>\)\s*$')

IMAGE_RE = re.compile(r'^!\[(?P<alt>.*)\]\((?P<path>[^)]*)\)\s*$')
BULLET_RE = re.compile(r'^(?P<indent>\s*)- (?P<text>.*)$')
HEADING_RE = re.compile(r'^(?P<hashes>#{2,6}) (?P<text>.*)$')

RELATED_BEGIN = '<!-- related:begin -->'
RELATED_END = '<!-- related:end -->'


class SidecarError(Exception):
    """The input is not a sidecar (no parsable ```yaml metadata fence)."""


# ---------------------------------------------------------------- model

@dataclass
class Related:
    title: str
    url: str = ''
    why: str = ''
    doc: int | None = None


@dataclass
class Para:
    text: str


@dataclass
class Bullet:
    level: int
    text: str


@dataclass
class Table:
    rows: list[list[str]]


@dataclass
class Image:
    alt: str
    path: str


@dataclass
class SubHeading:
    level: int  # 3..6, as written (### -> 3)
    text: str


Block = Para | Bullet | Table | Image | SubHeading


@dataclass
class Section:
    title: str
    number: int | None = None          # slide number for pptx-lane sections
    blocks: list[Block] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)


@dataclass
class Sidecar:
    meta: dict
    title: str
    header_line: str = ''
    source_file: str = ''
    source_url: str = ''
    summary: str = ''
    related: list[Related] = field(default_factory=list)
    sections: list[Section] = field(default_factory=list)
    body_kind: str = 'empty'           # 'slides' | 'headings' | 'empty'


# --------------------------------------------------------------- helpers

def _unescape_hashes(text: str) -> str:
    # ZipTextExtract escapes content lines that would forge structure
    # ("# " -> "\#"); the deck should show the original characters.
    return re.sub(r'^\\(#{1,6})', r'\1', text)


def _split_table_row(line: str) -> list[str]:
    # Unescaped-pipe cell split, copied verbatim from
    # review/harness/check_format.py (GFM table assertion), then \| is
    # unescaped per cell.
    cells = re.split(r'(?<!\\)\|', line)[1:-1]
    return [c.strip().replace('\\|', '|') for c in cells]


def _is_separator_row(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r':?-{3,}:?', c) for c in cells)


# ---------------------------------------------------------------- parser

def parse_sidecar(text: str) -> Sidecar:
    """Parse a full sidecar document. Raises SidecarError only when the
    ```yaml metadata fence is missing or unterminated."""
    if not text.startswith('```yaml\n'):
        raise SidecarError('input does not open with the ```yaml metadata fence')
    fence_end = text.find('\n```\n')
    if fence_end < 0:
        raise SidecarError('```yaml metadata fence is never closed')

    try:
        meta = yaml.safe_load(text[len('```yaml\n'):fence_end]) or {}
    except yaml.YAMLError:
        meta = {}
    if not isinstance(meta, dict):
        meta = {}

    rest = text[fence_end + len('\n```\n'):]
    lines = rest.split('\n')

    sc = Sidecar(meta=meta, title=str(meta.get('title') or ''))

    # ---- header strip: H1, bold metadata line, source link ----------
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        if line.startswith('# '):
            sc.title = line[2:].strip() or sc.title
        elif line.startswith('**') and not sc.header_line:
            sc.header_line = line.strip()
        elif (m := SOURCE_RE.match(line)):
            sc.source_file = m.group('file')
            sc.source_url = m.group('url')
        elif line.startswith('## Summary'):
            break
        i += 1

    # ---- summary: between "## Summary" and "## Related documents" ---
    if i < n:
        i += 1  # past "## Summary"
        summary_lines: list[str] = []
        while i < n and not lines[i].startswith('## Related documents'):
            summary_lines.append(lines[i])
            i += 1
        summary = '\n'.join(summary_lines).strip()
        if summary != '_No summary available._':
            sc.summary = summary

    # ---- related: between the begin/end markers ----------------------
    while i < n and lines[i].strip() != RELATED_BEGIN:
        i += 1
    if i < n:
        i += 1
        while i < n and lines[i].strip() != RELATED_END:
            entry = lines[i].strip()
            if entry and entry != '_None yet._':
                if (m := RELATED_RE.match(entry)):
                    sc.related.append(Related(
                        title=m.group('title'),
                        url=m.group('url'),
                        why=(m.group('why') or '').strip(),
                        doc=int(m.group('doc')) if m.group('doc') else None,
                    ))
                elif entry.startswith('- '):
                    # shape mismatch: keep the raw bullet, never crash
                    sc.related.append(Related(title='', why=entry[2:].strip()))
            i += 1

    # ---- seam: body starts after the first "---" line ---------------
    while i < n and lines[i].strip() != '---':
        i += 1
    if i >= n:
        return sc
    i += 1

    _parse_body(sc, lines[i:])
    return sc


def _parse_body(sc: Sidecar, lines: list[str]) -> None:
    section: Section | None = None
    in_notes = False
    table_rows: list[list[str]] | None = None
    fallthrough_blocks: list[Block] = []  # content before any heading

    def current_blocks() -> list[Block]:
        return section.blocks if section is not None else fallthrough_blocks

    def flush_table() -> None:
        nonlocal table_rows
        if table_rows:
            width = max(len(r) for r in table_rows)
            rows = [r + [''] * (width - len(r)) for r in table_rows]
            current_blocks().append(Table(rows=rows))
        table_rows = None

    def open_section(title: str, number: int | None = None) -> None:
        nonlocal section, in_notes
        flush_table()
        section = Section(title=title, number=number)
        sc.sections.append(section)
        in_notes = False

    notes_buf: list[str] = []

    def flush_notes_para() -> None:
        if notes_buf:
            (section.notes if section is not None else []).append(
                ' '.join(notes_buf))
            notes_buf.clear()

    for raw in lines:
        line = raw.rstrip('\r')
        stripped = line.strip()

        m_slide = SLIDE_RE.match(line)
        m_head = HEADING_RE.match(line) if not m_slide else None

        if m_slide:
            flush_notes_para()
            num = int(m_slide.group(1))
            title = (m_slide.group(2) or '').strip() or f'Slide {num}'
            open_section(_unescape_hashes(title), number=num)
            sc.body_kind = 'slides'
            continue

        if m_head:
            level = len(m_head.group('hashes'))
            text = _unescape_hashes(m_head.group('text').strip())
            if level == 3 and text == 'Notes':
                # speaker notes for the current slide; orphan notes
                # (malformed decks append them at the end) get a
                # synthetic section so they are never dropped
                flush_notes_para()
                flush_table()
                if section is None:
                    open_section('Additional notes')
                    if sc.body_kind == 'empty':
                        sc.body_kind = 'slides'
                in_notes = True
                continue
            if level == 2:
                flush_notes_para()
                open_section(text)
                if sc.body_kind != 'slides':
                    sc.body_kind = 'headings'
                continue
            # deeper docx heading inside a section
            flush_notes_para()
            flush_table()
            in_notes = False
            current_blocks().append(SubHeading(level=level, text=text))
            continue

        if in_notes:
            if stripped:
                notes_buf.append(stripped)
            else:
                flush_notes_para()
            continue

        if stripped.startswith('|') and stripped.endswith('|') and len(stripped) > 1:
            cells = _split_table_row(stripped)
            if _is_separator_row(cells):
                continue
            if table_rows is None:
                table_rows = []
            table_rows.append(cells)
            continue
        flush_table()

        if (m := IMAGE_RE.match(stripped)):
            current_blocks().append(Image(alt=m.group('alt'),
                                          path=m.group('path')))
            continue

        if (m := BULLET_RE.match(line)):
            level = len(m.group('indent')) // 2
            current_blocks().append(Bullet(level=level,
                                           text=_unescape_hashes(m.group('text').strip())))
            continue

        if stripped:
            current_blocks().append(Para(text=_unescape_hashes(stripped)))

    flush_notes_para()
    flush_table()

    if fallthrough_blocks:
        # docx bodies can carry content before the first heading
        overview = Section(title='Overview', blocks=fallthrough_blocks)
        sc.sections.insert(0, overview)
        if sc.body_kind == 'empty':
            sc.body_kind = 'headings'
