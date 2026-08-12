# pptxgen release notes

Repo-native component (nothing pasted into the tenant): files live in
this directory, the `review/patches/` workflow does not apply. Gate:
`review/harness/check_pptx.py` in the `full-format` CI job.

## v1.0 — 2026-08-12 — initial: sidecar md → briefing-deck .pptx

Motivation: the pipeline reads decks into markdown; the ultimate goal
for user stories is the reverse — generate an output `.pptx` from a
user-story sidecar so a PE can present it. Built repo-first (owner
decision) with the in-tenant lane queued as a follow-on.

Contents:

- `sidecar_parser.py` — sidecar contract mirror (fenced yaml header,
  summary, `<!-- related -->` block, seam, both body lanes); tolerant
  everywhere except a missing/unterminated yaml fence.
- `deck_outline.py` — the DeckOutline intermediate model both paths
  converge on; `OUTLINE_SCHEMA` (structured-outputs JSON schema,
  `outline_version` "1") + `load_outline()` validation that re-attaches
  sidecar metadata verbatim (the AI stage cannot rewrite metadata).
- `sidecar_to_pptx.py` — renderer + CLI. "Midnight Executive" design
  (navy/ice sandwich, Cambria/Calibri, chip-and-card motif); dark
  title + related closer, summary slide with keyword chips + metadata
  card, per-section content slides with native tables (header + ≤8
  body rows per part, header repeated), aspect-fit images with styled
  placeholder fallback, real speaker notes; estimate-based pagination
  with "(cont.)" continuations and font stepping; agenda / persona /
  takeaways slide kinds for enhanced outlines. Exit 0/2/3 contract.
- `enhance.py` + `DeckOutline_Prompt.md` (prompt v1.0) — optional
  `--enhance` stage: Claude API (`claude-opus-5` default), structured
  outputs against `OUTLINE_SCHEMA`, streaming, refusal/truncation
  handling; every failure degrades to the deterministic outline
  (warning) or exit 3 under `--strict-enhance`. `anthropic` package is
  imported lazily and is NOT a harness requirement.
- Gate `review/harness/check_pptx.py` + checked-in
  `review/harness/enhanced_outline_fixture.json`; one new line in
  `.github/workflows/harness.yml` (`full-format`).

Pairing rule going forward: `DeckOutline_Prompt.md` version and
`deck_outline.OUTLINE_VERSION` bump together, recorded here.

Gate: `check_pptx.py` PASS 2026-08-12 (47 checks). Visual QA clean
over 27 deterministic + 9 enhanced-fixture slides (2026-08-12). Live
API smoke not yet run (no key in the build environment).
