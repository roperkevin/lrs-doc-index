# pptxgen — sidecar markdown → briefing-deck .pptx (v1.0)

Reverses the pipeline's extraction lane for presentation: where
`scripts/ZipTextExtract.ts` turns a source `.pptx`/`.docx` into a
markdown sidecar, this component turns a **user-story sidecar `.md`
back into a designed 16:9 PowerPoint briefing deck** a PE can present —
dark title and closing slides built from the yaml metadata, a summary
slide with keyword chips and a metadata card, one styled content slide
per extracted section (native tables, embedded images, real speaker
notes), and a related-documents closer.

Unlike the other components, pptxgen is **repo-native**: it runs
wherever the repo is checked out (Python 3 + `python-pptx`, both
already in `review/harness/requirements.txt`), not in the tenant. The
versioned-patch workflow in `review/patches/` therefore does **not**
apply here — files live directly in this directory, versions are
recorded in `pptxgen/CHANGES.md`, and the CI gate is
`review/harness/check_pptx.py` (wired into the `full-format` job of
`.github/workflows/harness.yml`).

## Usage

```bash
pip install -r review/harness/requirements.txt   # python-pptx, PyYAML, Pillow

python3 pptxgen/sidecar_to_pptx.py story__doc42.md \
    -o story.pptx --media-dir path/to/media
```

| Flag | Meaning |
|---|---|
| `-o OUT.pptx` | Output path (default: input stem + `.pptx`) |
| `--media-dir DIR` | Directory holding the sidecar's linked images, matched by basename (default: links resolve relative to the input file, i.e. `../media/` next to a kind subfolder). Missing images render a styled placeholder — never an error. |
| `--enhance` | AI-restructure the deck via the Claude API (below) |
| `--model MODEL` | Claude model for `--enhance` (default `claude-opus-5`) |
| `--strict-enhance` | Exit 3 instead of falling back when `--enhance` fails |
| `--outline-json PATH` | Write the outline actually used to PATH — the audit artifact; inspect it to see exactly what the deck was built from |
| `--from-outline` | Render `--outline-json PATH` as the outline *input* (metadata still comes from the sidecar). How the gate renders the checked-in fixture. |

Exit codes: `0` success · `2` input is not a sidecar (no ```` ```yaml ````
fence) · `3` `--strict-enhance` and enhancement failed.

## Input contract

The consumed format is the sidecar contract, authoritative in
`flow/v2_5/definition.json` (`Sidecar_header`) and
`scripts/ZipTextExtract.ts` (header comment, body lanes), asserted by
`review/harness/check_format.py` and rendered by
`review/harness/render_sample.py`. `sidecar_parser.py` mirrors that
contract (the two load-bearing regexes are copied verbatim from
`check_format.py` with provenance comments); drift breaks
`check_pptx.py` in CI, which runs the parser over `render_sample.py`
output. Both body lanes convert: pptx-sourced (`## Slide N — title`,
`### Notes`, nested `- ` outline bullets, GFM tables, `../media/`
image links) and docx-sourced (`##`–`######` headings).

## Architecture

```
sidecar.md ─ sidecar_parser.py ─┬─ deck_outline.outline_from_sidecar()  (default)
                                └─ enhance.enhance_outline()            (--enhance)
                                        │  Claude API + DeckOutline_Prompt.md,
                                        │  structured outputs vs OUTLINE_SCHEMA
                                        ▼
                            DeckOutline (deck_outline.py)
                                        ▼
                        sidecar_to_pptx.DeckRenderer → .pptx
```

The renderer only ever consumes a `DeckOutline`, so the AI stage is
swappable and CI exercises the enhanced rendering path from the
checked-in `review/harness/enhanced_outline_fixture.json` with no
network, key, or `anthropic` install.

Design system ("Midnight Executive"): navy `1E2761` dominant with ice
`CADCFC` accents, dark/light sandwich, Cambria/Calibri (safe-list
fonts), rounded chip-and-card motif. Layout is estimate-based
(python-pptx cannot measure text): long sections paginate onto
"(cont.)" slides, tables cap at header + 8 body rows per part with the
header repeated, single oversize blocks get their own slide, and
`### Notes` land in real speaker notes on the section's first slide.

## AI enhancement (`--enhance`)

The deterministic deck is a faithful re-rendering of the extracted
text. The enhancement stage makes it presentation-grade: it sends the
sidecar to the Claude API with `DeckOutline_Prompt.md` (v1.0) as the
system prompt and a structured-outputs JSON schema
(`deck_outline.OUTLINE_SCHEMA`), getting back rewritten headlines,
condensed bullets, "As a …, I need …" persona callouts, an agenda
slide, a key-takeaways closer, and drafted speaker narration.
Guardrails in the prompt: nothing invented — every bullet traceable to
the source text; metadata, tables, and image references pass through
verbatim (`load_outline()` re-attaches metadata from the parsed
sidecar, so the model *cannot* rewrite it).

Setup: `pip install anthropic` and `export ANTHROPIC_API_KEY=...`
(neither is needed otherwise — the import is lazy). Any failure (no
key, no package, API error, refusal, truncation, schema-invalid
response) falls back to the deterministic outline with a stderr
warning, or exits 3 under `--strict-enhance`. Use `--outline-json` to
capture the outline for review before circulating a deck.

Versioning: `DeckOutline_Prompt.md`'s version and
`deck_outline.OUTLINE_VERSION` bump **together** on any contract
change, recorded in `pptxgen/CHANGES.md` — the same pairing rule as
`Config.PromptVersion` bumps in the flow.

## Verification

```bash
cd review/harness
pip install -r requirements.txt
python3 make_fixtures.py && python3 check_format.py && python3 render_sample.py
python3 check_pptx.py        # the gate — offline, runs in CI

# visual QA (local only; CI asserts structure, not pixels)
python3 ../../pptxgen/sidecar_to_pptx.py sample_sidecar_related.md \
    -o sample_deck_related.pptx --media-dir ../media
soffice --headless --convert-to pdf sample_deck_related.pptx
pdftoppm -jpeg -r 100 sample_deck_related.pdf slide   # then eyeball slide-*.jpg
```

Run record (2026-08-12, Python 3.11, python-pptx 1.0.2):
`check_pptx.py` **PASS** (47 checks — deterministic decks for both
samples, outline round-trip, enhanced fixture render, docx lane,
overflow pagination, degenerate inputs, `--enhance` fallback + strict
semantics). Visual QA: all 27 deterministic + 9 enhanced-fixture
slides inspected clean (no overflow/overlap; placeholder, table
banding, notes verified). Live `--enhance` against the API was **not**
run in this session (no key in the environment) — the failure path is
what CI asserts; run a live smoke with `--outline-json` when a key is
available.

## Queued follow-ons (documented, not built)

- **In-tenant deck handoff**: run this converter behind an on-demand
  flow so a PE gets the `.pptx` beside the sidecar in the library —
  clone TestPlanGen's on-demand `StoryId` trigger shape, with the
  conversion on hosted compute (Azure Function or equivalent; Power
  Automate cannot run Python) — deliberately deferred until the local
  loop beds in; it adds compute hosting and a connector for a
  formatting convenience.
- **AI Builder port of DeckOutline_Prompt.md**: the prompt is written
  input-document-in / one-JSON-object-out so it can be pasted into an
  AI Builder custom prompt for the in-tenant lane (schema enforcement
  moves from structured outputs to `load_outline()`-style validation
  in the flow); pairs with the handoff above.
- **docx sources, styled**: the docx lane converts today (headings →
  sections); a dedicated layout pass (heading-level hierarchy across
  slides) is queued behind real demand.
