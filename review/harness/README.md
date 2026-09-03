# Local script harness — standing suites + gates

## Suite index (live vs. historical, at a glance)

| Suite | Status | Guards |
|---|---|---|
| `check_format.py` + `render_sample.py` | **live** (CI full-format) | ZipTextExtract/WorkbookDump/RegexExtract format contract |
| `check_related.py` | **live** (CI fixture-free) | RelatedRank + SidecarPatch |
| `check_regex.py` | **live** (CI fixture-free) | RegexExtract IdResult contract |
| `check_figures.py` | **live** (CI full-format) | SlideFigures |
| `check_typecheck.py` | **live** (CI, own job) | every `scripts/*.ts` type-checks at ES2017 |
| `../../pad/harness/check_pad_runner.py` | **live** (CI fixture-free) | PAD runner + ops.mjs loader |
| `../../local/harness/check_local_sweep.py` | **live** (CI fixture-free) | the whole local pipeline: sweep, curate (+`--repoint`), gantt, auth, alerts |
| `../../local/harness/check_svg2pptx.py` | **live** (CI full-format) | svg2pptx |
| `check_batch_v2_2.py` | **live** | ZipTextExtract v2.2 / DL-1 promotion |
| `check_batch.py`, `check_batch_r2..r6.py` | historical — self-skip as superseded | the v1.9/r2–r6 promotion rounds (records below) |
| `run_diff.py` | historical — skips unless wraps regenerated | the v1.5→v1.6 equivalence record |
| `check_batch_r3.py` note | r4+ supersede r3; r4 itself skips since the RelatedRank v2.2 promotion | |

The standing suites always run against the **current `scripts/`
versions** (or whatever `HARNESS_SCRIPTS` points at) and generate
version-neutral `*_cur.ts` runners, so their labels never go stale
when a batch is promoted:

1. **Formatting checks** (`check_format.py` + `render_sample.py`) —
   the intentional-format contract for ZipTextExtract / WorkbookDump
   (+ RegexExtract's slug cases). See "Formatting checks" below.
2. **Related-docs checks** (`check_related.py`) — RelatedRank +
   SidecarPatch; runs standalone (no binary fixtures; needs PyYAML).
3. **Id/revision checks** (`check_regex.py`) — RegexExtract's full
   `IdResult` contract (ids, precedence, EXB routing, docRevision);
   cases inline, no fixtures — CI-friendly.
4. **Equivalence gate** (`run_diff.py`) — the HISTORICAL v1.5-vs-v1.6 /
   v1.0-vs-v1.1 byte-diff, recorded below; both halves now skip
   gracefully unless their wraps are deliberately regenerated from git
   history. `scripts/ZipTextExtract.ts` has long since moved on (v2.0
   as of the r2 promotion).
5. **Batch gates** (`check_batch_v2_2.py` — the current one, ZipTextExtract
   v2.2 / DL-1; `check_batch.py` — v1.9 era, skips as superseded;
   `check_batch_r2.py` — r2 era, skips as superseded;
   `check_batch_r3.py` — r3 era, skips as superseded;
   `check_batch_r4.py` — r4 era, RelatedRank v2.1, re-verifies the
   promotion; `check_batch_r5.py` — r5 era, SidecarPatch v1.5 /
   the flow v2.7 details frame; `check_batch_r6.py` — r6 era, the
   flow v2.8 three-patch round) — the template any future script
   change clones before it may be pasted (or, since the migration,
   before it is promoted over `scripts/`).
6. **Figure checks** (`check_figures.py`) — SlideFigures (v1.4 as of
   DF-5, which adds the label-collision / arrowhead / degenerate-split /
   title-box assertions — see its run records below): both
   production paths (vector render / topology redraw, over both table
   shapes), silence on a slide with no diagram, the component contract
   (uniform centred ticks, measures on a shared baseline and on their
   ticks, butt-capped extents sharing one exact boundary, split marker),
   the v1.1 lanes (two separated rulers on one slide → two figures named
   `slideN_figK.svg` in top-to-bottom order, each fully normalised; a
   node/connector slide → a graph figure with standardized nodes,
   palette tints by hue family, and edges), the v1.2 contract
   (connector re-anchoring to node boundaries, orthogonal elbow
   routing, row/column grid snap with size equalisation, quarter-turn
   rotation normalisation, legend synthesis with measure ranges in the
   redraw lane, and the raster tracing tier over a generated PNG),
   palette-only colour, no rasterisation, and `<title>`/`<desc>`.
   Fixtures: `figure_deck.pptx`, `trace_route.png`.
7. **Draft coverage lint** (`check_draft_coverage.py`) — runs over a
   downloaded TestPlanGen draft .md and asserts the prompt v1.7
   coverage contract (section order incl. `## Coverage Map`, Trace
   on every case, CAUTION alert, no empty/dangling Covered by cells,
   sequential TC ids, the v1.6 granularity structure — exactly one
   Expected Result line and at least one Steps checkbox per case —
   and the v1.7 `## Source Case Sweep` structure when present:
   placement, Yes/No/Verify verdicts, Yes→TC citations,
   Verify→Open Questions, No→reason) and prints
   positive/negative/[VERIFY]/map-row/steps-per-case/sweep-row
   counters for before/after comparison on a prompt bump
   (`testplangen/Coverage_Runbook.md` step 5). `--baseline` scores a
   pre-v1.5/v1.6/v1.7 draft (skips the Coverage Map, granularity
   and sweep checks, keeps counters). Pure stdlib, no fixtures —
   CI-friendly.

Prereqs: Node 22+ (`--experimental-strip-types`) and
`pip install -r requirements.txt` (python-pptx / python-docx for
fixture generation, PyYAML for the sidecar round-trips).

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
# MediaExtract half — ALSO HISTORICAL since 2026-08-11: the v1.1 patch
# passed this gate and was promoted to scripts/MediaExtract.ts, so
# wrapping the shipped script as "v1.0" now self-compares v1.1. To
# re-run the historical gate, fetch v1.0 from git:
#   git show 86f016c:scripts/MediaExtract.ts > me_v10_src.ts
#   python3 wrap.py me_v10_src.ts me_v10.ts
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

## Formatting checks — current ZipTextExtract / WorkbookDump / RegexExtract

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
- §12, diagram-label collapse (v2.2, DL-1): `diagram_deck.pptx` plants
  a drawn route diagram — a connector plus ten tiny floating label
  boxes (tick numbers `10`..`15`, ids `R1`/`E1`/`E1`, `Output`) — beside
  real content (a prose textbox, a long floating callout, a table).
  The suite asserts exactly one `[figure: 10–15 · R1 · E1 · Output]`
  line on that slide (ascending integer run compressed, repeats
  deduped), no label surviving as a standalone body line, prose/callout/
  table untouched, and — on the fixture's second slide — that three
  floating labels stay inline, below the 4-shape cluster threshold

`render_sample.py` then renders `sample_sidecar.md` — a full sidecar with the
current metadata/header mirrored from the flow template (since v2.7 the
GFM info-card layout: H1 first, key-value info table with the
conditional devtopia Issue row, the fenced ` ```yaml ` block collapsed
inside `<details><summary>Metadata</summary>`, the `issues:` yaml
line; since v2.4: authorship lines `author:` / `last_edited_by:` /
`last_edited:`, `../media/` image prefix, and kind-subfolder URLs) —
and asserts the file opens with H1 + info table (never `---`
frontmatter), exactly one details block wraps the yaml with the
load-bearing blank lines, the Issue row links devtopia (and vanishes
cleanly on an id-less doc), the inner YAML parses with
`yaml.safe_load` (including `related: []`, `issues:` and the
authorship fields), the empty-summary branch renders the
`> [!WARNING]` alert, the file has exactly one H1, the header/body
seam is present, and the related-section marker pair is well-placed.
It then runs the current SidecarPatch in set mode with three synthetic
entries and writes `sample_sidecar_related.md` — the eyeball artifact for a
POPULATED related list — re-asserting the patched metadata still parses, the
details frame and its H1 + info-table head survive byte-identically, the
file still has one H1, and the patched file keeps its `folder`.

## Related-docs checks — current RelatedRank / SidecarPatch

`check_related.py` wraps both scripts (same appendix pattern as
`rex_cur.ts`; no fixtures needed) and asserts the v2.3+ contract:

- RelatedRank: an id link (score 1000+) outranks any keyword overlap; a
  doc sharing both signals collapses into ONE entry with combined
  score/why; self excluded; score ties break to the higher (newer) item
  id; cap at topN; empty or malformed JSON inputs are safe; the
  why-string caps keyword names at 4 + `+k more`; keywords weigh by
  rarity (`w = 1/log2(1+df)` from the sharers rows, 3-decimal rounding,
  totals under 1000) so one rare keyword outranks two common ones, and
  `why`/`sharedKeywords` list rarest first (v1.1)
- RelatedRank v2.0 (r3): the legacy cases above run UNCHANGED through
  the new 11-param signature (empty new params + defaults = legacy
  behavior); plus per-edge-type weighting (id / review / gantt /
  titlematch, unknown ignored, Strength → SharedValues → 1 counting),
  the 999 soft cap hit exactly and id-dominated (HA-9), keyword-kind
  multipliers, alias→canonical folding (DX-2), final-mode metadata
  affinity + pair-min recency with a symmetry property case,
  shortlist/final universe semantics, config deep-merge hardening,
  and the truncation `flags` tripwire
- SidecarPatch: set mode rewrites ONLY the metadata `related:` line and
  the begin/end marker region (byte-integrity asserted against planted
  decoy `related:` text and stray `---` seams in the body); idempotence
  (`patch(patch(x)) == patch(x)`, `changed` false); merge inserts/re-sorts,
  replaces an existing doc id (reindex-safe), and evicts the weakest past
  the cap; a pre-v2.3 sidecar without markers gains the section before the
  seam and the `related:` line after `tools:`; begin-without-end is a
  byte-identical no-op with a note; populated metadata still
  `yaml.safe_load`s; all THREE metadata frames parse — the v2.7
  details frame (H1 + info table head, yaml inside
  `<details><summary>Metadata</summary>`, v1.5), fenced ` ```yaml `
  (v1.4) and legacy `---` frontmatter — and each file keeps the frame
  it arrived in (a mixed-frame trio in one batch stays mixed; the
  details head is byte-preserved; an unclosed `<details>`, an H1 with
  no block, or a details opener after a section heading are
  byte-identical no-ops; a body details decoy never outranks a
  position-0 fence); the `folder` property passes through
  verbatim in set and merge modes, `""` when absent (v1.2)
- both wrapped runners (`rr_cur.ts`, `scp_cur.ts`) type-check at ES2017,
  compiled separately (each Office Script is its own global scope)

Usage (from this directory; wrapped runners are regenerated on each run):

```
python3 make_fixtures.py     # now also plants structure (planted_format.json)
                             # and the workbook stand-in (sheets.json)
python3 check_format.py
python3 check_related.py     # no fixture prereqs — can run standalone
python3 check_regex.py       # no fixture prereqs — can run standalone
python3 render_sample.py && cat sample_sidecar.md sample_sidecar_related.md
```

## Batch gate — the v1.9 script batch (`check_batch.py`) — HISTORICAL

**The batch passed this gate, was pasted, and was promoted over
`scripts/` on 2026-08-11** — its new-behavior assertions now live in
the standing suites (`check_format.py` §9, `check_related.py`
§10/§11), which run against `scripts/` directly. Since the r2 batch
promotion, `scripts/` has moved past the v1.9 generation, so this
gate detects that and **skips gracefully** (its premises — staged
v1.9 patches equal to shipped scripts — no longer hold); to re-run it
for the record, check out the v1.9-promotion-era commit. It remains
the structural template every future batch gate clones
(`check_batch_r2.py` is the first). Original description:

The paste gate for the REVIEW_v2_5 script batch
(`../patches/ZipTextExtract_v1_9.ts`, `MediaExtract_v1_2.ts`,
`RelatedRank_v1_2.ts`, `SidecarPatch_v1_3.ts` — SC-2..SC-14 + FL-5).
It stages the four patches under canonical names, re-runs the FULL
`check_format.py` + `check_related.py` suites over them via the
`HARNESS_SCRIPTS` env override (the entire existing contract must stay
green — the batch's behavior changes only fire on new inputs),
byte-diffs MediaExtract v1.1 vs v1.2 on the valid fixtures, then
asserts each new behavior on the batch fixtures `make_fixtures.py`
plants (reordered sldIdLst, hMerge table, over-cap image, Target-first
rels, astral entity + pasted-markdown H1 + digit-run + bad
core-property date, encrypted archives, truncated stored block, and
the RelatedRank/SidecarPatch defensive cases).

```
python3 make_fixtures.py     # builds the batch fixtures too
python3 check_batch.py       # any FAIL = do not paste
```

On promotion (paste all four into the Automate tab + copy the patches
over `scripts/`), fold the new assertions into `check_format.py` /
`check_related.py` and mark this gate historical here.

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

### Last run (2026-08-11, Node 22.22.2) — post-v1.9-promotion baseline + r2 rename

Convention (r2): every promotion appends a dated run record here — the
run record IS the audit trail for a system whose only gate is this
harness.

Baseline before any r2 change, against the promoted v1.9-generation
scripts (ZipTextExtract v1.9 / MediaExtract v1.2 / RelatedRank v1.2 /
SidecarPatch v1.3 / WorkbookDump v1.1 / RegexExtract v1.2):
`check_format.py` PASS, `check_related.py` PASS, `check_batch.py` PASS
(staged patches still equal the shipped scripts). Re-run after the r2
harness changes (version-neutral `*_cur.ts` runners, new
`check_regex.py`, `run_diff.py` media-half skip guard): all suites
PASS — `check_regex.py`'s 34 assertions green on RegexExtract v1.2,
and `run_diff.py` now degrades gracefully on both historical halves.

## Batch gate — the r2 script batch (`check_batch_r2.py`) — HISTORICAL

The gate for the REVIEW_v2_5_r2 batch (SB-1..SB-9: RegexExtract v1.3,
SidecarPatch v1.4, WorkbookDump v1.2, ZipTextExtract v2.0,
MediaExtract v1.3, RelatedRank v1.3). Same lifecycle as its v1.9
template, with two additions: old-vs-new **equivalence diffs on every
existing fixture** (IDENTICAL required — the batch's design constraint
is zero behavior change on well-formed inputs) and **discriminator
assertions** that run each fixture against the OLD scripts to prove it
actually catches its bug. The batch PASSED and was promoted
2026-08-11; the folded standing assertions live in `check_regex.py`
(SB-1), `check_format.py` §10 (SB-4..SB-8), and `check_related.py`
(the v1.4 SB-2/SB-3 cases). Post-promotion the gate re-verified the
promotion — the discriminator half skipped via its PROMOTED guard.
Since the r3 promotion (RelatedRank v2.0, a signature change) the
whole gate skips as superseded, like `check_batch.py` before it; to
re-run it for the record, check out the r2-promotion-era commit.

```
python3 make_fixtures.py     # builds the r2 fixtures too
python3 check_batch_r2.py    # any FAIL = do not paste
```

### Last run (2026-08-11, Node 22.22.2) — r2 gate + promotion

Pre-promotion gate run: **PASS** — regression suites fully green over
the staged batch; ZTE/MediaExtract/WorkbookDump/RegexExtract/
RelatedRank/SidecarPatch old-vs-new IDENTICAL on every existing
fixture (9 ZTE fixtures + throw-parity on 2, 3 media fixtures,
sheets.json, the non-SB-1 id contract, mixed rank payload, well-formed
merge payload); all SB-1..SB-8 new behaviors green with every fixture
proven to discriminate; all six staged scripts type-check at ES2017.
Post-promotion: `check_format.py` (incl. §10), `check_related.py`
(incl. v1.4 cases), `check_regex.py` (incl. SB-1 negatives),
`check_batch_r2.py` (promotion re-verification), and
`render_sample.py` all PASS against the promoted `scripts/`;
`check_batch.py` skips as superseded by design.

## Batch gate — the r3 batch (`check_batch_r3.py`) — HISTORICAL

**Superseded by the r4 promotion (2026-08-12): RelatedRank moved to
v2.1, so this gate's premises no longer hold and it skips
gracefully** (the same lifecycle `check_batch.py` and
`check_batch_r2.py` entered when their generations were passed); to
re-run it for the record, check out the r3-promotion-era commit.
Note the r3 batch itself was never tenant-pasted — v2.1 replaces
v2.0 in the pending v2.6 window. Original description:

The gate for the related-ranking overhaul (RelatedRank v2.0 —
all edge types, keyword kinds + DX-2 alias fold, metadata affinity +
pair-min recency, `Config.RelatedWeights`, truncation `flags`; flow
v2.6 wiring). Single-patch batch; same lifecycle as the r2 template.
Its equivalence leg drives v2.0 through legacy-shaped payloads
(empty new params, default config) and requires the v1.3
related/docIds/count byte-identical with `flags` empty — the
overhaul may not move a single legacy score. Discriminators prove
v1.3 mis-scores a gantt row as id-links (it never read LinkType)
and is blind to candidate metadata. **The paste is fenced to the
v2.6 flow window** — the changed signature breaks the v2.5 binding
(see `../patches/designer-edits.md` §v2_6).

```
python3 make_fixtures.py     # the standing suites need the fixtures
python3 check_batch_r3.py    # any FAIL = do not paste
```

### Last run (2026-08-12, Node 22.22.2) — r3 gate + promotion

Pre-promotion gate run: **PASS** — `check_format.py` /
`check_related.py` (incl. the new v2.0 contract cases) /
`check_regex.py` fully green over the staged batch; v1.3-vs-v2.0
IDENTICAL related/docIds/count with empty `flags` on all eight
legacy payloads (mixed id+keyword, 8-keyword dominance, rarity +
ties, tie-break/cap, both-signals merge, SC-12a/b defensives,
empty); both discriminators fire; staged script type-checks at
ES2017. Post-promotion: `check_related.py`, `check_batch_r3.py`
(promotion re-verification, equivalence halves self-compare),
`check_format.py`, `check_regex.py` and `render_sample.py` all PASS
against the promoted `scripts/`; `check_batch_r2.py` now skips as
superseded (the r3 promotion moved RelatedRank past its generation —
the same graceful-skip lifecycle `check_batch.py` entered at r2),
and `check_batch.py` keeps skipping as before.

## Batch gate — the r4 batch (`check_batch_r4.py`)

The gate for the related-ranking upgrade (RelatedRank v2.1 — total
id dominance: non-id edges join the softCap bucket; PE/Dev name-set
overlap; final-mode title-token affinity behind the new selfMeta
`title` key; `title.{weight,cap,stop}` config). Single-patch batch;
same lifecycle as the r2/r3 templates. The signature is UNCHANGED
from v2.0, so its equivalence leg is broader than r3's: v2.0 vs
v2.1 must be IDENTICAL on the full result (related/docIds/count/
flags) across both the r3 legacy payload set and an r3-shaped set
(per-type edges, kind multipliers, alias fold, metadata affinity
with single-name PE, pinned recency, ceiling flags, the HA-9 pile) —
the upgrade may not move a single score on input the tenant can
produce today. Discriminators prove v2.0 let a Strength-20 gantt
pile (1200) outrank an id link, matched PE/Dev only on exact string
equality, and ignored selfMeta `title`. **The paste stays fenced to
the v2.6 flow window** (v2.1 replaces v2.0 there — same signature,
no new wiring; a tenant already at v2.0 + v2.6 pastes v2.1 alone);
see `../patches/designer-edits.md` §v2_6, r4 amendment.

```
python3 make_fixtures.py     # the standing suites need the fixtures
python3 check_batch_r4.py    # any FAIL = do not paste
```

### Last run (2026-08-12, Node 22.22.2) — r4 gate + promotion

Pre-promotion gate run: **PASS** — `check_format.py` /
`check_related.py` (incl. the 17 new v2.1 contract cases) /
`check_regex.py` fully green over the staged batch; v2.0-vs-v2.1
IDENTICAL related/docIds/count/flags on all sixteen equivalence
payloads (the eight r3 legacy payloads plus eight r3-shaped ones:
per-type edges, strength fallback, kind multipliers, alias fold,
single-name metadata affinity, pinned recency, ceiling flags, HA-9
pile); all three discriminators fire; staged script type-checks at
ES2017. Post-promotion: `check_related.py`, `check_batch_r4.py`
(promotion re-verification, equivalence halves self-compare),
`check_format.py`, `check_regex.py` and `render_sample.py` all PASS
against the promoted `scripts/`; `check_batch_r3.py` now skips as
superseded (the r4 promotion moved RelatedRank past its generation),
joining `check_batch_r2.py` and `check_batch.py`.

## Batch gate — the r5 batch (`check_batch_r5.py`)

The gate for SidecarPatch v1.5, paired with the flow v2.7 /
PromptVersion v1.9 GFM sidecar format (H1 + info table head, yaml
block collapsed inside `<details><summary>Metadata</summary>`; see
`../../flow/v2_7/CHANGES.md`). Single-patch batch; same lifecycle as
the r2–r4 templates, with one improvement: the equivalence leg's old
side is the genuinely-old `../patches/SidecarPatch_v1_4.ts` artifact
(not `scripts/`), so the leg — and the discriminator — stay
meaningful after promotion instead of degrading to a self-compare.
v1.4 vs v1.5 must be IDENTICAL (content/changed/note per file) on
every fenced/dashed payload: set, merge (both frames), empty set,
marker-less legacy synthesis, malformed markers, not-frontmatter,
BOM/CRLF, block-sequence `related:`, and a mixed batch with folders.
The discriminator proves v1.4 no-ops (`not-frontmatter`,
byte-identical) on a details-frame sidecar that v1.5 patches with
the head byte-preserved. **Paste fencing is the REVERSE of r3/r4**:
v1.5 is a strict superset of v1.4 and pastes safely any time BEFORE
the flow v2.7 designer edits (`../patches/designer-edits.md` §v2_7);
the hazard is the other order — flow v2.7 live against v1.4 silently
no-ops every new-format sidecar.

```
python3 make_fixtures.py     # the standing suites need the fixtures
python3 check_batch_r5.py    # any FAIL = do not paste
```

### Last run (2026-08-13, Node 22.22.2) — r5 gate + promotion + v2.7 format suites

Gate run: **PASS** — `check_format.py` / `check_related.py` (incl.
the 14 new v1.5 details-frame cases) / `check_regex.py` fully green
over the staged batch; v1.4-vs-v1.5 IDENTICAL on all eleven
equivalence payloads; the details-frame discriminator fires both
ways; staged script type-checks at ES2017. Promotion: v1.5 promoted
to `scripts/SidecarPatch.ts`. Post-promotion, the standing suites
and the reworked `render_sample.py` (now mirroring the v2.7
Sidecar_header: H1-first assertion, details wrapper, info table with
the devtopia Issue row and its id-less branch, `issues:` yaml
round-trip, empty-summary `> [!WARNING]` branch, post-patch
head/frame preservation) all PASS against the promoted `scripts/`.

## Batch gate — the r6 batch (`check_batch_r6.py`)

The gate for the flow v2.8 format round (`../../flow/v2_8/CHANGES.md`):
ZipTextExtract **v2.1** (CF-1 content-aware code fencing — Arcade/JS
runs fenced, code-shaped bullets inline-coded, `\#` escapes reverted
inside fences), RegexExtract **v1.4** (PD-1 product-line detection —
`products`/`productCount` from RH/APR/UN acronyms, compound tokens
UNAPR/ADMRH, full names; additive return fields), SidecarPatch
**v1.6** (the fourth metadata frame: yaml hidden in `<!-- metadata`
... `-->`). Three-patch batch; same lifecycle as r2–r5, with the r5
genuinely-old-artifact convention on every equivalence leg
(`ZipTextExtract_v2_0.ts`, `RegexExtract_v1_3.ts`,
`SidecarPatch_v1_5.ts` are the old sides, so the legs survive
promotion). ZTE equivalence spans EVERY pre-r6 fixture plus the new
`prose_deck.pptx` (instruction-shaped prose — `;`-ended steps, a
lowercase `return to ...` sentence — that must never fence), with
throw-parity on the malformed archives; new fixtures `code_deck.pptx`
(planted Arcade script with an internal blank line, a `# ...` comment
line, code bullets, code-bearing table cells) discriminate v2.0
vs v2.1, the comment-frame payload discriminates v1.5 vs v1.6, and
the products field discriminates v1.3 vs v1.4. **Paste fencing**:
SidecarPatch v1.6 pastes safely any time BEFORE the flow v2.8
designer edits; ZipTextExtract v2.1 and RegexExtract v1.4 paste with
the window (see `../patches/designer-edits.md` §v2_8).

```
python3 make_fixtures.py     # builds the r6 fixtures too
python3 check_batch_r6.py    # any FAIL = do not paste
```

### Last run (2026-08-13, Node 22.22.2) — r6 gate + promotion + v2.8 format suites

Gate run: **PASS** — `check_format.py` (incl. the new §11 code-fence
contract) / `check_related.py` (incl. the 13 new v1.6 comment-frame
cases) / `check_regex.py` (incl. the 9 product cases +
productCount invariant) fully green over the staged batch; ZTE
v2.0-vs-v2.1 IDENTICAL on all twelve prose fixtures with throw-parity
on the three malformed archives; RegexExtract v1.3-vs-v1.4 IDENTICAL
on ids/docRevision/idCount/slug across the case set; SidecarPatch
v1.5-vs-v1.6 IDENTICAL on all seven pre-r6 payloads; all three
discriminators fire; all three staged scripts type-check at ES2017.
Promotion: v2.1/v1.4/v1.6 promoted to `scripts/`. Post-promotion,
the standing suites and the reworked `render_sample.py` (now
mirroring the v2.8 Sidecar_header: `<!-- metadata` comment frame
with no `<details>` anywhere, Product info row + its empty branch,
`products:` yaml round-trip, post-patch head/frame preservation) all
PASS against the promoted `scripts/`; `check_batch_r5.py` now skips
as superseded (the r6 promotion moved SidecarPatch past its
generation), joining r2/r3 and `check_batch.py`; `check_batch_r4.py`
still PASSES (RelatedRank untouched by r6).

## Batch gate — ZipTextExtract v2.2 (`check_batch_v2_2.py`)

The gate for **DL-1, diagram-label collapse**. Single-script change,
outside the r2..r6 review-round series — it came from a corpus
observation, not a review round — but built to the same template,
including the r5 genuinely-old-artifact convention (the equivalence
leg's old side is `../patches/ZipTextExtract_v2_1.ts`, so the leg and
the discriminator survive promotion).

The corpus's test-plan decks draw route diagrams as *shapes*:
dashed/hatched connector lines annotated by dozens of tiny floating
text boxes holding tick numbers and route/event ids. Every one of
those used to flatten into its own one-token body line — a slide's
worth of real content buried under forty lines reading `10`, `11`,
`R1`, `E1`. v2.2 splices a **cluster** (>= 4 on one slide) of
label-shaped non-placeholder `p:sp`/`p:cxnSp` shapes out of the body
and renders one `[figure: 10–22 · R1 · E1 · Output]` line at the end
of the slide instead — the same `[figure: ...]` convention the docx
drawing path has used since v1.2. Ascending integer runs compress to
`a–b`, repeats dedupe in first-appearance order, and the list caps at
24 items. Sub-threshold slides keep their labels inline: one or two
short floating callouts are content, not a diagram.

Detection is deliberately structural rather than textual — which is
why this lives in the extractor and not in the local sweep's
`tidyBody` (the v1.20 "presentation polish stays local" rule).
By the time text reaches `tidyBody`, a line reading `R1` from a
floating diagram label is indistinguishable from a real content line;
only the slide XML still knows the difference (placeholder vs.
floating shape, and how many such shapes cluster on the slide).

**No paste fencing**: since the 2026-08-14 migration the deployed
local sweep runs `scripts/` directly, so there is nothing to paste.
On a cloud-flow rollback `../patches/ZipTextExtract_v2_2.ts` replaces
the pending v2.1 paste (same signature, CF-1 carried forward). Roll
the existing corpus forward with `sweep.mjs --reformat` — it
re-extracts and rewrites bodies below the seam with no AI spend
(`local/CHANGES.md` v1.22).

```
python3 make_fixtures.py       # builds diagram_deck.pptx too
python3 check_batch_v2_2.py    # any FAIL = do not promote
```

### Last run (2026-09-03, Node 22.22.2) — v2.2 gate + promotion

Gate run: **PASS** — `check_format.py` (incl. the new §12 DL-1
contract) / `check_related.py` / `check_regex.py` fully green over the
staged script; ZTE v2.1-vs-v2.2 IDENTICAL full output on all thirteen
pre-v2.2 fixtures (both real fixtures, the edge/noprops decks, all
five v1.9 batch fixtures, both r2 fixtures, and both r6 code/prose
decks — the collapse touches no prose, table, heading, note, fence,
link or docx path) with throw-parity on the three malformed archives;
the `diagram_deck` discriminator fires both ways (v2.1: six loose
label lines, no figure line; v2.2: one collapsed figure line, no loose
label) and the sub-threshold slide stays inline; staged script
type-checks at ES2017. Promotion: v2.2 promoted to
`scripts/ZipTextExtract.ts`. Post-promotion the standing suites and
`render_sample.py` PASS against the promoted `scripts/`, and both
downstream gates that exercise the extractor are green:
`pad/harness/check_pad_runner.py` 27/27 (incl. the wrap.py parity leg)
and `local/harness/check_local_sweep.py` 128/128.
`check_batch_r6.py` now skips as superseded (the v2.2 promotion moved
ZipTextExtract past its generation), joining r2/r3/r5 and
`check_batch.py`. `check_batch_r4.py` also skips — but for an older
reason, not this change: the RelatedRank v2.2 promotion (2026-08-15)
moved it past the v2.1/v2.0 head its guard accepts. The r6 run record
above, and STATUS's harness table, both still listed r4 as passing;
that stopped being true on 2026-08-15 and is corrected here.

Real-corpus check, the deck that prompted the change
(`SplittingEventsinPro_Testplan.pptx`, 25 slides): 20 carried drawn
diagrams, collapsing into 20 figure lines. Body 1098 → 857 lines (241
of label debris gone; short standalone lines 301 → 40), every
route/event id preserved, and all 515 table / heading / image-link
lines byte-identical between v2.1 and v2.2.

## Figure gate — SlideFigures v1.0 (`check_figures.py`)

The gate for DF-1, slide diagrams as SVG. Its fixture `figure_deck.pptx`
plants one slide of each kind: a vector ruler (route line, evenly spaced
tick stubs, measure labels, two coloured extents meeting at a split), a
key/value-table slide with no drawing at all, a header-row-table slide
(the other table shape in the corpus), and a prose-only slide that must
produce nothing.

```
python3 make_fixtures.py     # builds figure_deck.pptx too
python3 check_figures.py     # any FAIL = do not ship
```

### Last run (2026-09-03, Node 22.22.2) — v1.0 gate

**PASS** — 3 figures from the 4-slide fixture; both production paths
fire and the prose-only slide is silent; tick lengths reduce to
minor/major only with every tick centred on the line; all measures share
one baseline and each sits on a tick; the two extents share one exact
boundary with a split marker on it; no source colour reaches an element
on any figure; nothing rasterised; every figure parses as XML inside its
viewBox and carries `<title>`/`<desc>`. Standing suites, PAD (27/27) and
the local sweep gate (128/128) all green alongside.

Real-deck verification (not fixtures, so not part of the gate):
**20 figures** from SplittingEventsinPro_Testplan.pptx (25 slides — one
vector, the rest redrawn) and **39** from
3921MergeEventsToolProTestPlan_V5.pptx (44 slides, all vector). The
second deck is why the colour-coverage rule and the header-row table
reader exist: it lays four default-coloured route segments end to end
under one cyan event, and its tables carry headers across the top rather
than down the side. Both shapes now round-trip.

### Last run (2026-09-03, Node 22.22.2) — v1.4 gate (DF-5)

**PASS** — 13 figures from the now-10-slide fixture. New DF-5 fixture
slides: 9 (a branch case whose stated split measure EQUALS the route's
To Measure) and 10 (a ruler under the decks' outlined case-text box).
New assertions: the degenerate split drops its zero-length extent
(one event label, no split marker, no legend, alt says "unchanged");
the branch route id sits level with its line; redraw measures sit
above the route and event ids below (the collinear tie-break — never
the same side); normalised and redrawn routes overshoot their final
tick so the arrowhead sits clear; the case-text box is not drawn as a
node while its ruler still renders with its arrow; and the traced
figure carries no mid-band arrow where the extent runs past the
surviving route run. 9 of the 12 new assertions FAIL against the
v1.3 script (fixture discriminates; the other 3 hold invariants).
Standing suites, PAD (27/27) and the local sweep gate (150/150,
incl. the sweep v1.27 TC-2 short-title/subheader cases) all green
alongside; the script type-checks at ES2017.

### Last run (2026-09-03, Node 22.22.2) — v1.5 gate (DF-6)

**PASS** — same 13 figures. Arrowheads snap to line tips: the head is
now a SOLID triangle (a notched head was a see-through cutout over
the line's final pixels), the overshoot is sized to the head so its
back never dips under an extent bar, refX keeps the line's round cap
inside the head, and the ruler lane emits heads after the extents on
a carrier retracing the route's own final pixels. Two new
assertions — head drawn after the extents, and solid-triangle marker
geometry — both FAIL against the v1.4 script. Local sweep gate
150/150 and ES2017 type-check green alongside.

### Last run (2026-09-03, Node 22.22.2) — v1.6 gate (DF-7)

**PASS** — 15 figures. New fixture slide 11: a spanning event across a
line network (From RID R1L6 measure 10 → To RouteID R3L6 measure 25
via R2L6, split 52.5 in R2L6's own domain, with the route-list and
result tables the real decks carry). Assertions: the whole chain is
drawn and labelled, each route ends in its own arrowhead, only the
stated measure anchors appear (no invented tick grid), the split sits
on the route the result table names, the output legend qualifies each
range with its routes, the alts state the chain, and the anchors pair
input→key/value table / output→result table. 7 of the 10 new
assertions FAIL against the v1.5 script, which collapsed the case
onto a single-route 10→25 grid with the split clamped away. Local
sweep gate 153/153 and ES2017 type-check green alongside.

Same round: geometry tokenised across the lanes (MEAS_OFF / ID_OFF /
DOT_R / LEGEND_GAP — the split-dot radius and entity-id offsets had
drifted per lane: 3.2 vs 3.4, and 17 / 20.5 / 21.5). Two standing
style-invariant assertions — one split-dot radius, one id offset
across every lane — both FAIL against the pre-token script
(3.2/3.4 and 20.5/17/21.5).

### Last run (2026-09-03, Node 22.22.2) — v2.0 gate (DF-11)

**PASS** — 17 figures. New fixture slides: 13 (a synthetic UI
screenshot — two bordered panels holding a heading, two labelled input
fields, a filled blue button with white glyph text on the fill, and a
results table drawn as a box with three full-width row separators and a
column rule; "text" is stamped as glyph-sized ink blocks, exactly what
a real screenshot gives the tracer) and 14 (random noise — the photo
control). Assertions: the screenshot renders as a wireframe (panels,
fields, group box, separators), the blue button maps to the cool
palette slot by hue family, text rows greek in two weights with the
count preserved, stacked fields snap to one shared left edge, nothing
ruler-shaped leaks into the figure, the alt claims placeholders rather
than OCR, and the noise slide stays silent in BOTH raster tiers. 12 of
the 15 new assertions FAIL against the v1.9 script (fixture
discriminates; the rest hold invariants). check_svg2pptx PASS with all
17 fixture figures converting and opening in python-pptx; standing
suites, PAD (27/27) and the local sweep gate (158/158) green
alongside; the script type-checks at ES2017. Wireframe output verified
visually in Chromium, including a 1.6MP realistic stress screenshot
(header band, 8 field rows, segmented control, 9-row table) rendering
in ~0.5s.
