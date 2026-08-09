# Doc Index System — Release v1.9

Everything the document-indexing pipeline needs, in one bundle.
Current as of 2026-08-08. The system: a daily Power Automate flow
sweeps the LocationReferencing Documents library, extracts text
in-script, classifies and keywords each doc via AI Builder, mints
issue-ID rows and doc-to-doc edges, and writes markdown sidecars
with images.

## Bundle contents

| Path | What | Version |
|---|---|---|
| DocIndexSweep_v1_9.zip | Flow package (import as Update) | v1.9 |
| scripts/RegexExtract.ts | ID + revision extraction | v1.1 |
| scripts/ZipTextExtract.ts | pptx/docx → markdown text + rels | v1.5 |
| scripts/MediaExtract.ts | Bounded raster image extraction | v1.0 |
| scripts/WorkbookDump.ts | xlsx → sheet TSV dump | v1.0 |
| DocIndex_Prompt.md | AI Builder prompt (grounded keywords) | v1.1 |
| schemas/SPList_*.csv | The six list definitions (lrsworkspace) | — |
| docs/SP_Adaptation_Notes.md | Architecture + SharePoint quirks | — |

Retired, not included: TagStrip (superseded by ZipTextExtract; the
script may remain in Excel harmlessly). Issue Refs list is present
but empty by design — its feeder is flow #2, not yet built.

## Flow v1.9 highlights (cumulative)

Backfill mode (SmokeFile knob shipped empty, MaxDocsPerRun 150);
markdown sidecars named {SourceName}__doc{ID}.md with header block;
media pipeline (inline image links + saved files, safe-degrading);
OData apostrophe escaping on both free-text filters (the
what'snew fix); retry-aware gate (Error rows self-heal); hardened
trim/toLower smoke filter; all GUIDs and script references real —
zero placeholders, imports break nothing.

## Fresh-tenant install order

1. Six lists on lrsworkspace per schemas/ — create LOOKUP columns
   via CLASSIC list settings (modern-created lookups are broken:
   silent write drops, spinning pickers).
2. Media folder: /Document Index Texts/media (manual, once).
3. Scripts into the dummy Scripts.xlsx Automate tab, exact names.
4. AI Builder prompt from DocIndex_Prompt.md (item/requestv2 keys:
   FileName, DocText, ExistingKeywords).
5. Import the flow zip, bind SharePoint + Excel Online + Dataverse
   connections.
6. Designer touch-ups the package cannot carry: re-pick the script
   on Extract_media_pptx/docx to MediaExtract (ships pointed at
   ZipTextExtract as a parseable stand-in), and verify the prompt
   action's model/prompt binding matches your tenant's prompt id.

On the EXISTING tenant: only steps 3 (paste v1.5 + v1.1 if not yet
done, create MediaExtract) and 6 apply after importing.

## Runbook

- **Smoke mode**: set Config→SmokeFile to an exact filename for
  single-file runs; empty = full sweep. trim/case-proof, but the
  characters must match the library's Name column.
- **Retry semantics**: Error rows always reprocess next run;
  Skipped rows wait for a source-file change; Indexed rows
  reprocess only when the file's Modified advances.
- **Budget**: MaxDocsPerRun (150) counts only docs actually
  processed; the daily 17:00 Mountain trigger walks the corpus
  ~150/day until done.
- **Edges** mint when the LATER doc of an ID-sharing pair
  processes; the graph self-assembles during backfill.
- **Media caps**: 12 images/doc, 350 KB each, 3 MB total, raster
  only; overflow lands in the script's skipped list.
- **PromptVersion**: bump the Config value whenever the prompt
  text changes; rows carry it, so promptversion filters find
  docs needing a re-run.

## Known limits / queued work

Run-script payload caps files at roughly 3.5 MB (oversized docs
Error visibly; an OCR fallback lane is designed if ever needed).
html/pdf/msg extensions land as Skipped rows awaiting future
lanes. Flow #2 (Gantt → Issue Refs + title-matching), keyword
alias curation, and the librarian backfill pass (junction lookups
from KWKey, retro-illustration of early docs) are the queued
follow-ons.
