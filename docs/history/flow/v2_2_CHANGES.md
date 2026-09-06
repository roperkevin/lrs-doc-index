# Flow v2.2 — rich markdown sidecars (filenames, header, body) + version-gated reindex

`DocIndexSweep_v2_2.zip` is v2.1 plus the sidecar formatting release. It ships
together with three script updates (paste required) and the v1.2 prompt paste:

| Piece | Version | Where |
|---|---|---|
| Flow definition | v2.2 | this folder / `DocIndexSweep_v2_2.zip` |
| ZipTextExtract | **v1.7** | `scripts/ZipTextExtract.ts` (supersedes `review/patches/ZipTextExtract_v1_6.ts`) |
| RegexExtract | **v1.2** | `scripts/RegexExtract.ts` |
| WorkbookDump | **v1.1** | `scripts/WorkbookDump.ts` |
| AI Builder prompt | **v1.2** | `review/patches/DocIndex_Prompt_v1_2.md` |

Supersedes v2.1 as the import target. v2.1/v2.0/v1.9 files remain for provenance.

## What changed

### Sidecar filenames — `{title-slug}__doc{ID}.md`

`Sidecar_name` now uses a kebab-case slug of the AI-derived title, computed by
RegexExtract v1.2 (`Run_regex` gains a `title` parameter bound to `Doc_title`):

    conflict-prevention-acquire-locks-for-new-routes__doc42.md

Fallback chain: AI title → slugified source basename → `doc`. If the v1.2
script is not pasted yet, a WDL fallback (lowercased, hyphenated, `#`/`%`
stripped source name) keeps the flow running — strictly better than the old
raw `{Name}`. Slugs are `[a-z0-9-]` only, so `Text_file_url`'s unencoded
concat now always produces a URL-safe link.

**Orphan note:** renaming means the first re-index of each document creates a
new sidecar file; the old `{Name}__docN.md` files in `/Document Index Texts`
become orphans. Accepted cost — optionally clear the library once before the
backfill (the flow recreates everything).

### Sidecar header — YAML frontmatter + clean title + summary

`Sidecar_header` is rewritten: YAML frontmatter (title, source_file,
source_url, doc_id, doc_kind, surface, doc_revision, target_release, pe, dev,
extracted date, extraction_lane, prompt_version, keywords, tools), an H1 from
the AI title (extension-stripped fallback via the new `H1_title` compose), a
one-line metadata strip, a linked source, and the AI summary under
`## Summary`, then a `---` seam before the extracted content. Five new helper
actions (`Select_kw_yaml`, `Select_tools_yaml`, `Yaml_title`, `Yaml_file`,
`H1_title`) provide YAML-safe values; free-text scalars are double-quoted and
escaped, keyword/tool list items are quote-stripped.

The header owns the file's only H1 and `## Summary`; the extractors emit
nothing above H2 (see below), so headings never collide.

### Sidecar body (script pastes)

- **ZipTextExtract v1.7** (base: the harness-verified v1.6 typed-array
  plumbing): pptx slide titles are promoted into headings
  (`## Slide 3 — Locking new routes`) and removed from the body; speaker
  notes are interleaved under their slide as `### Notes`, resolved through
  each slide's `.rels` (never by assuming notesSlideN == slideN; unmatched
  notes parts are appended, never dropped); explicit outline levels /
  bullet props render as nested `- ` lists. docx `Heading1..6`/`Title`
  styles map to markdown headings shifted one level down; `w:numPr`
  paragraphs render as nested `- ` lists by `w:ilvl`.
- **WorkbookDump v1.1**: sheets render as GFM pipe tables (first row =
  header) instead of raw TSV, with 24-column cap (`…(+N more)`), 300-char
  cell cap, and pipe escaping. Same name/signature — no flow rebinding.

### Version-gated reindex (why your test runs showed no updates)

`Needs_index` previously reprocessed a file only when its Doc Index row was
missing, in `Error` state, or the source file had been modified since. On
re-runs over already-indexed unchanged files the whole branch is skipped —
**no Doc Index update, no Doc IDs rows, no sidecar rewrite** — which is why
test runs appeared to "not update" the lists. (Doc IDs rows additionally only
mint when RegexExtract finds issue ids — devtopia URLs, `NN-`/`NN_` filename
prefixes, `#NNN` hashtags — in the doc text/rels.)

v2.2 adds a fourth OR clause: reindex when the row's stored `PromptVersion`
differs from `Config.PromptVersion`. Config bumps to `v1.2` (paste the v1.2
prompt with this release — the version now gates the whole indexing pipeline,
not just the prompt text). Result: a one-time converging backfill that
rewrites every sidecar in the new format, `MaxDocsPerRun` (150) per run —
already-reprocessed rows store the new version and are skipped next run, so
~600 docs complete in ~4 runs.

## Install order (paste scripts first)

1. Paste **RegexExtract v1.2**, **ZipTextExtract v1.7**, **WorkbookDump v1.1**
   over the existing scripts in Scripts.xlsx (Automate tab). All three are
   backward-compatible with the running v2.1 flow (same signatures/return
   shapes; extra `slug` field ignored), so paste-then-import is safe in
   either order — but pasting first means the very first v2.2 run gets slugs.
2. Paste the **v1.2 prompt** (`review/patches/DocIndex_Prompt_v1_2.md`) over
   the AI Builder prompt.
3. Import `DocIndexSweep_v2_2.zip` (as Update), or apply the designer edits
   below to the live flow.

## REQUIRED after every import — not optional (carried from v2.1)

- **Re-pick the script on `Extract_media_pptx` AND `Extract_media_docx` to
  `MediaExtract`** — the package cannot carry that binding; skipping silently
  saves no images.
- Re-verify the prompt action's model/prompt binding matches the tenant's
  prompt id.
- `Get_files` pagination threshold is 20000 (Settings → Pagination).
- `LastError` column exists on Doc Index.

Then one smoke-mode run (`Config.SmokeFile`) per lane — a pptx with notes and
images, a docx with headings/lists, an xlsx, a txt — checking: the sidecar
file name is the title slug, the frontmatter renders in SharePoint's markdown
preview, slide notes sit under their slides, and `Run_summary` is sensible.

## Designer edits (applying v2.2 to the live flow without re-import)

In `For_each_file` unless noted; expressions in designer form.

- **S1 — `Config`** (top level): `PromptVersion` literal `v1.1` → `v1.2`.
- **S2 — `Needs_index`**: append a fourth argument to the `or(...)`:
  `not(equals(coalesce(first(body('Check_indexed')?['value'])?['PromptVersion'], ''), outputs('Config')?['PromptVersion']))`
- **S3 — `Run_regex`**: add script parameter `title` = `outputs('Doc_title')`
  (the designer shows it after RegexExtract v1.2 is pasted).
- **S4 — `Sidecar_name`**: replace inputs with
  `concat(coalesce(outputs('Run_regex')?['body/result/slug'], toLower(replace(replace(replace(items('For_each_file')?['{Name}'], ' ', '-'), '#', ''), '%', ''))), '__doc', items('For_each_file')?['ID'], '.md')`
- **S5 — new actions between `Sidecar_name` and `Sidecar_header`** (chained
  in this order; see `flow/v2_2/definition.json` for exact inputs):
  `Select_kw_yaml` (Select over prompt keywords), `Select_tools_yaml`
  (Select over tools), `Yaml_title` / `Yaml_file` (Compose, YAML-escape),
  `H1_title` (Compose, extension-stripping fallback).
- **S6 — `Sidecar_header`**: replace inputs with the v2.2 template (copy the
  `Sidecar_header.inputs` string from `flow/v2_2/definition.json:1015`) and
  repoint its run-after to `H1_title`.

Smoke test after S1–S6: one already-indexed unchanged doc should reprocess
exactly once (version gate), land a slug-named sidecar with frontmatter, and
skip again on the following run.

## Verification record

`review/harness/check_format.py` + `render_sample.py` (see
`review/harness/README.md`): all formatting assertions PASS on the planted
fixtures — slide-title promotion/dedup, notes interleaving, nested lists,
docx heading shift, GFM table well-formedness, WorkbookDump caps, token
recall 1.0000 (bar ≥ 0.97), slugify unit cases — and the wrapped scripts
type-check at ES2017.

---

**Addendum (2026-08-11, r2 PV-1):** the sibling import zip was re-cut
with the connection `displayName` (a personal work email) scrubbed
from its `manifest.json`. The `definition.json` payload is
byte-identical to the pre-scrub zip; only the manifest changed, so
the zip is no longer the byte-exact export artifact (git history
holds the original). Import behavior is unaffected — connections are
re-mapped at import time.
