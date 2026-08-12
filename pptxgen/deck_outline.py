"""deck_outline — the DeckOutline intermediate model between parser and renderer.

Both conversion paths converge here:

    sidecar_parser.Sidecar ── outline_from_sidecar() ──┐  (deterministic, default)
                           ── enhance.enhance_outline()┤  (--enhance: Claude API)
                                                       ▼
                                                  DeckOutline ── renderer

The renderer never consumes the raw parse tree, so the AI stage is
swappable (the prompt can later be ported to AI Builder for the
in-tenant lane) and CI can exercise the enhanced rendering path from a
checked-in fixture outline with no network or API key.

OUTLINE_SCHEMA is the JSON contract for the enhanced path: it is passed
to the Claude API as a structured-outputs schema (which requires
additionalProperties:false + required throughout and supports no
recursion or numeric/length constraints), and load_outline() re-checks
the same shape plus the constraints a schema can't express. Bump
OUTLINE_VERSION on any breaking change and record it in
pptxgen/CHANGES.md alongside a DeckOutline_Prompt.md bump — same
pairing rule as Config.PromptVersion in the flow.

Slide kinds:
    title      dark opener (metadata from the sidecar header)
    summary    light summary + keyword chips + metadata card
    agenda     light numbered section list          (enhanced decks only)
    content    light body slide: headline, optional subhead/kicker,
               blocks (paras/bullets/tables/images/personas), notes
    takeaways  dark 3-5 big statements closer       (enhanced decks only)
    related    dark related-documents closer (omitted when list empty)

stdlib only — no pptx, no network. Dataclasses are plain and JSON-shaped
so outlines round-trip losslessly through to_dict()/load_outline().
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict

from sidecar_parser import (Sidecar, Section, Para, Bullet, Table, Image,
                            SubHeading)

OUTLINE_VERSION = '1'

MAX_TAKEAWAYS = 5
MAX_AGENDA_ITEMS = 12


# ---------------------------------------------------------------- model
# Outline blocks mirror the parser's body blocks plus two
# presentation-only kinds the AI stage can emit: 'persona' callouts and
# 'subhead' (kept as a slide field, not a block).

@dataclass
class OBlock:
    kind: str                                   # para|bullet|table|image|subheading|persona
    text: str = ''                              # para/bullet/subheading/persona
    level: int = 0                              # bullet indent, subheading depth
    rows: list[list[str]] = field(default_factory=list)   # table
    alt: str = ''                               # image
    path: str = ''                              # image


@dataclass
class OSlide:
    kind: str                                   # title|summary|agenda|content|takeaways|related
    title: str = ''
    subhead: str = ''
    kicker: str = ''                            # e.g. "SLIDE 4" for pptx-lane sections
    blocks: list[OBlock] = field(default_factory=list)
    items: list[str] = field(default_factory=list)         # agenda/takeaways entries
    notes: str = ''


@dataclass
class DeckOutline:
    outline_version: str
    meta: dict                                  # sidecar yaml, passed through verbatim
    title: str
    summary: str
    keywords: list[str]
    related: list[dict]                         # {title, url, why, doc}
    slides: list[OSlide]
    source_file: str = ''
    source_url: str = ''

    def to_dict(self) -> dict:
        return asdict(self)


# ------------------------------------------- deterministic mapping

def _block_to_oblock(b) -> OBlock:
    if isinstance(b, Para):
        return OBlock(kind='para', text=b.text)
    if isinstance(b, Bullet):
        return OBlock(kind='bullet', text=b.text, level=b.level)
    if isinstance(b, Table):
        return OBlock(kind='table', rows=b.rows)
    if isinstance(b, Image):
        return OBlock(kind='image', alt=b.alt, path=b.path)
    if isinstance(b, SubHeading):
        return OBlock(kind='subheading', text=b.text, level=b.level)
    raise TypeError(f'unknown block type {type(b).__name__}')


def _content_slide(section: Section) -> OSlide:
    return OSlide(
        kind='content',
        title=section.title,
        kicker=f'SLIDE {section.number}' if section.number is not None else '',
        blocks=[_block_to_oblock(b) for b in section.blocks],
        notes='\n\n'.join(section.notes),
    )


def outline_from_sidecar(sc: Sidecar) -> DeckOutline:
    """Direct 1:1 mapping — the default (no-AI) path. Emits only the
    title/summary/content/related slide kinds."""
    slides = [OSlide(kind='title'), OSlide(kind='summary')]
    slides += [_content_slide(s) for s in sc.sections]
    if sc.related:
        slides.append(OSlide(kind='related'))
    return DeckOutline(
        outline_version=OUTLINE_VERSION,
        meta=dict(sc.meta),
        title=sc.title,
        summary=sc.summary,
        keywords=[str(k) for k in (sc.meta.get('keywords') or [])],
        related=[{'title': r.title, 'url': r.url, 'why': r.why,
                  'doc': r.doc} for r in sc.related],
        slides=slides,
        source_file=sc.source_file,
        source_url=sc.source_url,
    )


# --------------------------------------------------- JSON schema
# Structured-outputs rules: every object carries additionalProperties:
# false and a full required list; no minLength/maxLength/minimum. The
# soft caps (MAX_TAKEAWAYS etc.) are enforced by load_outline instead.
# The model only authors the enhanced slides; meta/related/keywords are
# re-attached verbatim from the parsed sidecar by the caller, so the
# schema covers slides plus the fields the prompt is allowed to rewrite.

_OBLOCK_SCHEMA = {
    'type': 'object',
    'properties': {
        'kind': {'type': 'string',
                 'enum': ['para', 'bullet', 'table', 'image',
                          'subheading', 'persona']},
        'text': {'type': 'string'},
        'level': {'type': 'integer'},
        'rows': {'type': 'array',
                 'items': {'type': 'array', 'items': {'type': 'string'}}},
        'alt': {'type': 'string'},
        'path': {'type': 'string'},
    },
    'required': ['kind', 'text', 'level', 'rows', 'alt', 'path'],
    'additionalProperties': False,
}

_OSLIDE_SCHEMA = {
    'type': 'object',
    'properties': {
        'kind': {'type': 'string',
                 'enum': ['title', 'summary', 'agenda', 'content',
                          'takeaways', 'related']},
        'title': {'type': 'string'},
        'subhead': {'type': 'string'},
        'kicker': {'type': 'string'},
        'blocks': {'type': 'array', 'items': _OBLOCK_SCHEMA},
        'items': {'type': 'array', 'items': {'type': 'string'}},
        'notes': {'type': 'string'},
    },
    'required': ['kind', 'title', 'subhead', 'kicker', 'blocks', 'items',
                 'notes'],
    'additionalProperties': False,
}

OUTLINE_SCHEMA = {
    'type': 'object',
    'properties': {
        'outline_version': {'type': 'string', 'enum': [OUTLINE_VERSION]},
        'title': {'type': 'string'},
        'summary': {'type': 'string'},
        'slides': {'type': 'array', 'items': _OSLIDE_SCHEMA},
    },
    'required': ['outline_version', 'title', 'summary', 'slides'],
    'additionalProperties': False,
}


# ------------------------------------------------------ validation

class OutlineError(ValueError):
    """The outline dict does not satisfy the DeckOutline contract."""


def _require(cond: bool, msg: str) -> None:
    if not cond:
        raise OutlineError(msg)


def _load_oblock(d: dict, where: str) -> OBlock:
    _require(isinstance(d, dict), f'{where}: block is not an object')
    kind = d.get('kind')
    _require(kind in ('para', 'bullet', 'table', 'image', 'subheading',
                      'persona'), f'{where}: bad block kind {kind!r}')
    rows = d.get('rows') or []
    _require(isinstance(rows, list) and
             all(isinstance(r, list) and all(isinstance(c, str) for c in r)
                 for r in rows), f'{where}: table rows must be list[list[str]]')
    if kind == 'table':
        _require(bool(rows) and bool(rows[0]), f'{where}: empty table')
    return OBlock(kind=kind, text=str(d.get('text') or ''),
                  level=max(0, int(d.get('level') or 0)),
                  rows=rows, alt=str(d.get('alt') or ''),
                  path=str(d.get('path') or ''))


def _load_oslide(d: dict, idx: int) -> OSlide:
    where = f'slides[{idx}]'
    _require(isinstance(d, dict), f'{where}: slide is not an object')
    kind = d.get('kind')
    _require(kind in ('title', 'summary', 'agenda', 'content', 'takeaways',
                      'related'), f'{where}: bad slide kind {kind!r}')
    items = d.get('items') or []
    _require(isinstance(items, list) and all(isinstance(x, str) for x in items),
             f'{where}: items must be list[str]')
    if kind == 'takeaways':
        _require(0 < len(items) <= MAX_TAKEAWAYS,
                 f'{where}: takeaways needs 1..{MAX_TAKEAWAYS} items')
    if kind == 'agenda':
        _require(0 < len(items) <= MAX_AGENDA_ITEMS,
                 f'{where}: agenda needs 1..{MAX_AGENDA_ITEMS} items')
    blocks = d.get('blocks') or []
    _require(isinstance(blocks, list), f'{where}: blocks must be a list')
    slide = OSlide(kind=kind, title=str(d.get('title') or ''),
                   subhead=str(d.get('subhead') or ''),
                   kicker=str(d.get('kicker') or ''),
                   blocks=[_load_oblock(b, f'{where}.blocks[{j}]')
                           for j, b in enumerate(blocks)],
                   items=items, notes=str(d.get('notes') or ''))
    if kind == 'content':
        _require(bool(slide.title), f'{where}: content slide needs a title')
    return slide


def load_outline(data: dict, sc: Sidecar | None = None) -> DeckOutline:
    """Validate an outline dict (an AI response or a fixture) and attach
    the pass-through fields from the parsed sidecar. When `sc` is given,
    meta/keywords/related/source come from it verbatim — the enhanced
    path is never allowed to rewrite metadata."""
    _require(isinstance(data, dict), 'outline is not an object')
    _require(data.get('outline_version') == OUTLINE_VERSION,
             f'outline_version must be {OUTLINE_VERSION!r}, '
             f'got {data.get("outline_version")!r}')
    raw_slides = data.get('slides')
    _require(isinstance(raw_slides, list) and raw_slides,
             'outline has no slides')
    slides = [_load_oslide(s, i) for i, s in enumerate(raw_slides)]
    _require(slides[0].kind == 'title', 'first slide must be kind "title"')
    _require(sum(1 for s in slides if s.kind == 'title') == 1,
             'exactly one title slide required')
    _require(any(s.kind == 'content' or s.kind == 'summary' for s in slides),
             'outline needs at least one summary/content slide')

    if sc is not None:
        meta = dict(sc.meta)
        keywords = [str(k) for k in (sc.meta.get('keywords') or [])]
        related = [{'title': r.title, 'url': r.url, 'why': r.why,
                    'doc': r.doc} for r in sc.related]
        source_file, source_url = sc.source_file, sc.source_url
        title = sc.title  # metadata passes through verbatim
        has_related_slide = any(s.kind == 'related' for s in slides)
        if related and not has_related_slide:
            slides.append(OSlide(kind='related'))
        if not related:
            slides = [s for s in slides if s.kind != 'related']
    else:
        meta, keywords, related = {}, [], []
        source_file = source_url = ''
        title = str(data.get('title') or '')

    return DeckOutline(
        outline_version=OUTLINE_VERSION,
        meta=meta, title=title,
        summary=str(data.get('summary') or '') or
                (sc.summary if sc is not None else ''),
        keywords=keywords, related=related, slides=slides,
        source_file=source_file, source_url=source_url,
    )
