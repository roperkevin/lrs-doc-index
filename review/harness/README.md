# Local script harness — equivalence gate + formatting checks

Two independent checks live here:

1. **Equivalence gate** (`run_diff.py`) — the historical v1.5-vs-v1.6 /
   v1.0-vs-v1.1 byte-diff, recorded below. Note: since the v2.2
   formatting release, `scripts/ZipTextExtract.ts` is v1.7 — the v1.5
   source this gate compares against lives in git history
   (`git show <pre-v2.2>:scripts/ZipTextExtract.ts`).
2. **Formatting checks** (`check_format.py` + `render_sample.py`) — the
   gate for the v1.7/v1.1/v1.2 formatting generation, which is an
   *intentional* format change and therefore can't be validated by
   equivalence. See "Formatting checks" below.

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
python3 wrap.py ../../scripts/ZipTextExtract.ts zte_v15.ts
python3 wrap.py ../patches/ZipTextExtract_v1_6.ts zte_v16.ts
python3 wrap.py ../../scripts/MediaExtract.ts me_v10.ts
python3 wrap.py ../patches/MediaExtract_v1_1.ts me_v11.ts
python3 run_diff.py          # runs all four over all fixtures, prints the table
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

## Formatting checks — ZipTextExtract v1.7 / WorkbookDump v1.1 / RegexExtract v1.2

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

`render_sample.py` then renders `sample_sidecar.md` — a full sidecar with the
v2.2 frontmatter/header mirrored from the flow template — and asserts the
frontmatter parses with `yaml.safe_load`, the file has exactly one H1, and the
header/body seam is present. This is the eyeball artifact for the target format.

Usage (from this directory; wrapped runners are regenerated on each run):

```
python3 make_fixtures.py     # now also plants structure (planted_format.json)
                             # and the workbook stand-in (sheets.json)
python3 check_format.py
python3 render_sample.py && cat sample_sidecar.md
```

### Last run (2026-08-09, Node 22.22.2)

All 150+ assertions PASS: 18/18 slide titles promoted and deduplicated,
18+1 notes blocks interleaved, all heading/list mappings exact, all tables
well-formed, WorkbookDump caps exact, recall 1.0000 on all three fixtures,
all five slug cases exact. `zte_v17.ts`, `wbd_v11.ts` and `rex_v12.ts` also
type-check at ES2017 (`tsc --noEmit --target es2017`).
