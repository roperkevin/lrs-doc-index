# Doc Index System — Release v2.3

Everything the document-indexing pipeline needs, in one bundle.
Current as of 2026-08-09. The system: a daily Power Automate flow
sweeps the LocationReferencing Documents library, extracts text
in-script, classifies and keywords each doc via AI Builder, mints
issue-ID rows and doc-to-doc edges, writes markdown sidecars with
images, and cross-links each sidecar to its related documents.

## Bundle contents

| Path | What | Version |
|---|---|---|
| flow/v2_3/definition.json | Flow definition | v2.3 |
| flow/DocIndexSweep_v2_3.zip | Import package (v2.2 package skeleton + the v2.3 definition; designer touch-ups still needed post-import) | v2.3 |
| scripts/RegexExtract.ts | ID + revision extraction + title slug | v1.2 |
| scripts/ZipTextExtract.ts | pptx/docx → markdown text + rels | v1.7 |
| scripts/MediaExtract.ts | Bounded raster image extraction | v1.0 |
| scripts/WorkbookDump.ts | xlsx → GFM table dump | v1.1 |
| scripts/RelatedRank.ts | Related-doc scoring/ranking | v1.0 |
| scripts/SidecarPatch.ts | Surgical related-section patching | v1.1 |
| review/patches/DocIndex_Prompt_v1_2.md | AI Builder prompt (current) | v1.2 |
| DocIndex_Prompt.md | AI Builder prompt (superseded by v1.2) | v1.1 |
| schemas/SPList_*.csv | The six list definitions (lrsworkspace) | — |
| docs/SP_Adaptation_Notes.md | Architecture + SharePoint quirks | — |

Older flow versions (`flow/definition.json` v1.9, `flow/v2_0/`,
`flow/v2_1/`, `flow/v2_2/` and their zips) remain for provenance;
see each `CHANGES.md`.

Retired, not included: TagStrip (superseded by ZipTextExtract; the
script may remain in Excel harmlessly). Issue Refs list is present
but empty by design — its feeder is flow #2, not yet built.

## Flow v2.3 highlights (cumulative)

Related documents in every sidecar (v2.3): a `## Related documents`
section plus a machine-readable `related:` metadata line — top 5,
shared-issue-id edges outrank keyword overlap, each entry linked to
the neighbor's sidecar with the reason for the relation; when a new
doc is indexed, its neighbors' existing sidecars are reciprocally
patched (marker-delimited, idempotent) so old docs learn about new
arrivals; the PromptVersion bump (now `v1.4`) is format-only (no
prompt re-paste) and drives the converging backfill — see
`flow/v2_3/CHANGES.md`. Preview-safe metadata (v2.3 addendum): the
sidecar's YAML metadata block is framed as a fenced ` ```yaml ` code
block instead of `---` frontmatter — SharePoint's markdown preview
has no frontmatter support and rendered the old block as one giant
heading; SidecarPatch v1.1 parses both frames and preserves each
file's frame while the `v1.4` backfill converts the corpus. Plus the
v2.2 base: rich markdown sidecars named `{title-slug}__doc{ID}.md`
(slug from the AI title via RegexExtract v1.2; fallback: slugified
source name) with a fenced YAML metadata block, clean H1, metadata
strip and AI summary; pptx bodies with slide-title headings, interleaved
`### Notes` and nested lists; docx heading/list structure; xlsx as
GFM tables; version-gated reindex (PromptVersion mismatch triggers
a converging backfill — see `flow/v2_2/CHANGES.md`). Plus the
v1.9–v2.1 base: backfill mode (SmokeFile knob shipped empty,
MaxDocsPerRun 150); media pipeline (inline image links + saved
files, safe-degrading); OData apostrophe escaping on both
free-text filters (the what'snew fix); retry-aware gate (Error
rows self-heal); hardened trim/toLower smoke filter; the nine
review designer edits (v2.0) and createArray hardening (v2.1);
all GUIDs and script references real — zero placeholders, imports
break nothing.

## Fresh-tenant install order

1. Six lists on lrsworkspace per schemas/ — create LOOKUP columns
   via CLASSIC list settings (modern-created lookups are broken:
   silent write drops, spinning pickers).
2. Media folder: /LRS Doc Index/media (manual, once).
3. Scripts into the dummy Scripts.xlsx Automate tab, exact names
   (RegexExtract v1.2, ZipTextExtract v1.7, WorkbookDump v1.1,
   MediaExtract v1.0, RelatedRank v1.0, SidecarPatch v1.1).
4. AI Builder prompt from review/patches/DocIndex_Prompt_v1_2.md
   (item/requestv2 keys: FileName, DocText, ExistingKeywords).
5. Import the v2.3 flow package, bind SharePoint + Excel
   Online + Dataverse connections.
6. Designer touch-ups the package cannot carry: re-pick the script
   on Extract_media_pptx/docx to MediaExtract, on Run_related_rank
   to RelatedRank, and on Run_sidecar_patch to SidecarPatch (all
   ship pointed at other scripts as parseable stand-ins), and
   verify the prompt action's model/prompt binding matches your
   tenant's prompt id.

On the EXISTING tenant: only step 3 (paste the two new v2.3
scripts) and 6 apply after importing — full order and per-step
smoke tests in `flow/v2_3/CHANGES.md`.

## Runbook

- **Smoke mode**: set Config→SmokeFile to an exact filename for
  single-file runs; empty = full sweep. trim/case-proof, but the
  characters must match the library's Name column.
- **Retry semantics**: Error rows always reprocess next run;
  Skipped rows wait for a source-file change; Indexed rows
  reprocess when the file's Modified advances OR the row's
  PromptVersion trails Config's (the v2.2 backfill gate).
- **Budget**: MaxDocsPerRun (150) counts only docs actually
  processed; the daily 17:00 Mountain trigger walks the corpus
  ~150/day until done.
- **Edges** mint when the LATER doc of an ID-sharing pair
  processes; the graph self-assembles during backfill.
- **Related documents** (v2.3): each sidecar shows its top 5
  related docs — id-linked docs first (score 1000+/shared issue),
  then by rarity-weighted keyword overlap (a local IDF computed
  from rows the flow already fetches: common terms fade, specific
  terms dominate, and one rare shared keyword outranks two
  generic ones); indexing a doc also reciprocally patches its
  neighbors' sidecars, so lists stay fresh in both directions and
  entries self-heal on reindex. Keyword relatedness is still
  never stored as edges — the lists are a bounded per-doc render
  (see docs/SP_Adaptation_Notes.md). Rarity is sampled from the
  sharers query's top-500 rows — the `$top` ceiling is the knob
  if the corpus outgrows it.
- **Media caps**: 12 images/doc, 350 KB each, 3 MB total, raster
  only; overflow lands in the script's skipped list.
- **PromptVersion**: bump the Config value whenever the prompt
  text OR the sidecar format changes; rows carry it, and since
  v2.2 a mismatch actively triggers reindexing (~150/day until
  the corpus converges), rewriting sidecars in the new format.
  The v2.3 bump to `v1.3` (related documents), the addendum
  bump to `v1.4` (fenced metadata block for SharePoint preview)
  and the addendum bump to `v1.5` (rarity-weighted related
  scoring) are all format-only: the prompt text is unchanged
  and must not be re-pasted.

## Known limits / queued work

Run-script payload caps files at roughly 3.5 MB (oversized docs
Error visibly; an OCR fallback lane is designed if ever needed).
html/pdf/msg extensions land as Skipped rows awaiting future
lanes. Flow #2 (Gantt → Issue Refs + title-matching), keyword
alias curation, and the librarian backfill pass (junction lookups
from KWKey, retro-illustration of early docs) are the queued
follow-ons.
