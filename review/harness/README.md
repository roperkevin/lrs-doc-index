# Local script harness — equivalence gate + formatting checks

Two independent checks live here:

1. **Equivalence gate** (`run_diff.py`) — the historical v1.5-vs-v1.6 /
   v1.0-vs-v1.1 byte-diff, recorded below. Note: since the v2.2
   formatting release, `scripts/ZipTextExtract.ts` has moved on (v1.8
   as of v2.4) — the v1.5 source this gate compares against lives in
   git history (`git show <pre-v2.2>:scripts/ZipTextExtract.ts`).
2. **Formatting checks** (`check_format.py` + `render_sample.py`) — the
   gate for the v1.7+/v1.1/v1.2 formatting generation, which is an
   *intentional* format change and therefore can't be validated by
   equivalence. See "Formatting checks" below. Since v2.4 this also
   covers ZipTextExtract v1.8's core-properties extraction and the
   kind-subfolder template.

## Equivalence harness — v1.5/v1.0 vs v1.6/v1.1 script patches

Runs both versions of ZipTextExtract (v1.5 shipped, v1.6 patch) and MediaExtract
(v1.0 shipped, v1.1 patch) over OOXML fixtures and byte-diffs every output field,
plus a token-recall check mirroring the validated-bar approach. Requires Node 22+
(`--experimental-strip-types`) and Python 3 with `python-pptx` / `python-docx`.

This complements — does not replace — the reference-set harness: the paste gate for
the F7 patches remains a run over the real LRS reference set (token recall ≥ 0.97
docx / 1.000 pptx). This harness answers the stronger structural question ("are the
two versions byte-identical?") on generated fixtures.

Usage (from this directory):

```
python3 make_fixtures.py     # builds real_deck.pptx / real_doc.docx / edge_deck.pptx
                             # (+ planted_tokens.json ground truth) and .b64 files
# ZTE half — HISTORICAL RECORD ONLY. scripts/ZipTextExtract.ts is v1.8 now
# (intentional format changes since v2.2), so wrapping it as "v1.5" yields
# spurious DIFF! rows. To re-run the historical gate, fetch v1.5 from git:
#   git show fd9d1c2:scripts/ZipTextExtract.ts > zte_v15_src.ts
#   python3 wrap.py zte_v15_src.ts zte_v15.ts
#   python3 wrap.py ../patches/ZipTextExtract_v1_6.ts zte_v16.ts
# MediaExtract half — STILL LIVE: the shipped script is v1.0, the patch v1.1,
# and this gate is the paste precondition for promoting it.
python3 wrap.py ../../scripts/MediaExtract.ts me_v10.ts
python3 wrap.py ../patches/MediaExtract_v1_1.ts me_v11.ts
python3 run_diff.py          # runs the wrapped pairs over all fixtures, prints the table
```

To use it against the real reference set instead of generated fixtures: drop the
reference `.pptx`/`.docx` files in this directory, base64 them
(`base64 -w0 f.pptx > f.pptx.b64`), and add the filenames to `FILES` in
`run_diff.py`. Any `DIFF!` row = do not paste the patch; report.

## Last run (2026-08-09, Node 22.22.2 V8)

| fixture | equal | v1.5 ms | v1.6 ms | recall v1.5 | recall v1.6 |
|---|---|---|---|---|---|
| real_deck.pptx (python-pptx: 18 slides, tables, notes, images, urls) | IDENTICAL | 54 | 37 | 1.0000 | 1.0000 |
| real_doc.docx (python-docx: headings, nested+merged tables, unicode, image) | IDENTICAL | 16 | 14 | 1.0000 | 1.0000 |
| edge_deck.pptx (blank slide, notes-only slide) | IDENTICAL | 10 | 9 | 1.0000 | 1.0000 |
| test.pptx (synthetic: stored entry, entities, gridSpan, 500 KB media) | IDENTICAL | 53 | 24 | — | — |
| test.docx (synthetic: AlternateContent, drawings, field codes, 200 KB filler) | IDENTICAL | 58 | 31 | — | — |
| big.pptx (120 slides, 2.8 MB, 2.4 MB incompressible media) | IDENTICAL | 1231 | 191 | — | — |

MediaExtract: IDENTICAL on all four image-bearing fixtures; every `images[].b64`
verified against an independent zip decoder (Python `zipfile`); big-deck timing
1183 ms → 290 ms.

Both patches also type-check at ES2017 (`tsc --noEmit --target es2017`), contain
no lookbehind, no imports, one `main()` each.

## Formatting checks — ZipTextExtract v1.8 / WorkbookDump v1.1 / RegexExtract v1.2

`check_format.py` runs the *current* `scripts/` versions over the fixtures and
asserts the v2.2 output contract instead of byte-equality:

- pptx: `## Slide N — Title` headings (strictly increasing, planted titles
  promoted, no title duplicated into the body), notes interleaved as
  `### Notes` under their slide (zero `## Notes` H2 blocks), planted
  `lvl=1/2` paragraphs as nested `- ` items, no orphan empty list lines
- docx: `Heading N` → `N+1` hashes (Title → `##`), no H1 anywhere in body
  output, `w:numPr`/`w:ilvl` paragraphs as nested `- ` items
- tables: every GFM block well-formed (separator row, consistent column
  count, unescaped-pipe splitting); WorkbookDump COLCAP=24 cut with
  `…(+N more)`, CELLCAP=300 truncation, pipe escaping, `(empty)` marker
- token recall vs `planted_tokens.json` ≥ 0.97 per fixture (the additions
  are whitespace-separated, so recall is unaffected)
- `slugify` unit cases (em-dash title, apostrophes/symbols, 80-char cap at
  a word boundary, non-Latin → filename fallback, empty → `doc`)
- core properties (v1.8): planted `dc:creator` / `cp:lastModifiedBy` /
  `dcterms:modified` come back as `author` / `lastEditedBy` /
  `lastEdited` from both pptx and docx fixtures with entities decoded
  (ampersand, smart apostrophe), and `noprops_deck.pptx` (edge_deck
  with `docProps/core.xml` stripped) degrades to empty strings

`render_sample.py` then renders `sample_sidecar.md` — a full sidecar with the
current metadata/header mirrored from the flow template (since v2.4:
authorship lines `author:` / `last_edited_by:` / `last_edited:`, the header
strip's "Last edited" segment, `../media/` image prefix, and
kind-subfolder URLs) — and asserts the metadata block is the fenced
` ```yaml ` frame (the PromptVersion v1.4 SharePoint-preview-safe form —
`---` frontmatter renders in SharePoint's preview as one giant setext
heading), its inner YAML parses with `yaml.safe_load` (including
`related: []` and the authorship fields), the file has exactly one H1, the
header/body seam is present, and the related-section marker pair is
well-placed. It then runs SidecarPatch v1.2 in set mode with three synthetic
entries and writes `sample_sidecar_related.md` — the eyeball artifact for a
POPULATED related list — re-asserting the patched metadata still parses, the
file still has one H1, and the patched file keeps its `folder`.

## Related-docs checks — RelatedRank v1.1 / SidecarPatch v1.2 (v2.3–v2.4)

`check_related.py` wraps both v2.3 scripts (same appendix pattern as
`rex_v12.ts`; no fixtures needed) and asserts the v2.3 contract:

- RelatedRank: an id link (score 1000+) outranks any keyword overlap; a
  doc sharing both signals collapses into ONE entry with combined
  score/why; self excluded; score ties break to the higher (newer) item
  id; cap at topN; empty or malformed JSON inputs are safe; the
  why-string caps keyword names at 4 + `+k more`; keywords weigh by
  rarity (`w = 1/log2(1+df)` from the sharers rows, 3-decimal rounding,
  totals under 1000) so one rare keyword outranks two common ones, and
  `why`/`sharedKeywords` list rarest first (v1.1)
- SidecarPatch: set mode rewrites ONLY the metadata `related:` line and
  the begin/end marker region (byte-integrity asserted against planted
  decoy `related:` text and stray `---` seams in the body); idempotence
  (`patch(patch(x)) == patch(x)`, `changed` false); merge inserts/re-sorts,
  replaces an existing doc id (reindex-safe), and evicts the weakest past
  the cap; a pre-v2.3 sidecar without markers gains the section before the
  seam and the `related:` line after `tools:`; begin-without-end is a
  byte-identical no-op with a note; populated metadata still
  `yaml.safe_load`s; both metadata frames parse — fenced ` ```yaml `
  (v1.4) and legacy `---` frontmatter — and each file keeps the frame it
  arrived in (set mode stays fenced, a legacy neighbor merge and the
  pre-v2.3 fallback stay dashed); the `folder` property passes through
  verbatim in set and merge modes, `""` when absent (v1.2)
- both wrapped runners (`rr_v11.ts`, `scp_v12.ts`) type-check at ES2017,
  compiled separately (each Office Script is its own global scope)

Usage (from this directory; wrapped runners are regenerated on each run):

```
python3 make_fixtures.py     # now also plants structure (planted_format.json)
                             # and the workbook stand-in (sheets.json)
python3 check_format.py
python3 check_related.py     # no fixture prereqs — can run standalone
python3 render_sample.py && cat sample_sidecar.md sample_sidecar_related.md
```

### Last run (2026-08-09, Node 22.22.2)

All 150+ assertions PASS: 18/18 slide titles promoted and deduplicated,
18+1 notes blocks interleaved, all heading/list mappings exact, all tables
well-formed, WorkbookDump caps exact, recall 1.0000 on all three fixtures,
all five slug cases exact. `zte_v17.ts`, `wbd_v11.ts` and `rex_v12.ts` also
type-check at ES2017 (`tsc --noEmit --target es2017`).

`check_related.py` (same date/Node): all 35 assertions PASS — RelatedRank
precedence/merge/tie/cap/safety and SidecarPatch set/merge/evict/
idempotence/byte-integrity/fallback/no-op cases, plus the v1.1
frame cases (fenced set mode, legacy `---` neighbor merge, frame
preservation both ways) — and `rr_v10.ts` / `scp_v11.ts` type-check at
ES2017. `render_sample.py` PASS in both the empty and populated states
with the fenced metadata frame (see `sample_sidecar.md` /
`sample_sidecar_related.md`).

### Last run (2026-08-10, Node 22.22.2) — v2.4 generation

`check_format.py` PASS over ZipTextExtract v1.8 — every v2.2-generation
assertion unchanged and green, plus the seven new core-properties
assertions (planted author/lastEditedBy/lastEdited from both real
fixtures with entities decoded; `noprops_deck` degrades to empty
strings). `check_related.py` PASS over SidecarPatch v1.2 — all prior
assertions green, plus folder pass-through in set/merge modes and the
folder-less `""` default. `render_sample.py` PASS with the v2.4
template (authorship lines round-trip `yaml.safe_load`, header strip
carries the "Last edited" segment, patched sample keeps its
`User Stories` folder). `zte_v18.ts` and `scp_v12.ts` type-check at
ES2017.
