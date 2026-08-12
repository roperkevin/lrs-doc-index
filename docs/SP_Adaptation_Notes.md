# LRS Doc Index — SharePoint Edition (replaces the Dataverse spec)

Six lists + one document library, all on esriis.sharepoint.com/sites/lrsworkspace.
Same data model as the Dataverse spec; this note covers only what changed
and why, plus build mechanics.

## Current tenant GUIDs

The **LRS Doc Index** library (with its `media` folder) holds the sidecars;
the six lists resolve to these GUIDs (the flow references every list by GUID,
except Issue Refs, whose feeder — flow #2 — is not yet built):

| List | GUID |
|---|---|
| Doc Index | `b98fb2a1-1c91-48f9-9b9b-323656557171` |
| Keywords | `a7bd004b-84e0-408f-b32d-3f1d791e2af6` |
| Doc IDs | `6263eeac-471a-489e-96c7-1448f45378d4` |
| Issue Refs | `4d0e6561-80e3-49f4-aa20-e5889cc88414` |
| Doc Keywords | `4eabc799-c856-49ea-bf25-65942b363ec6` |
| Doc Links | `c49367dc-c267-4f5b-8935-4fad47fb0d34` |

GUIDs updated 2026-08-12 for the re-provisioned lrsworkspace schema
(the Copilot provisioning prompt in `schemas/`). The v2.6 import
package, the curation definition/guide and the testplangen
definitions/guide/zips all carry these; only the pre-v2.6 sweep
definitions and zips (`flow/v2_3`–`v2_5`) keep the pre-provisioning
GUIDs, as the record of what was authored against the old lists.

## What changed, and two changes that are upgrades

**1. Keyword edges are never stored — computed on read.**
The Dataverse spec materialized keyword-based DocLink rows. That was a
latent pair-explosion: 100 documents sharing the keyword "testing" is
4,950 edge rows for one keyword. SharePoint's view thresholds forced the
better design: DocLinks holds only precise, sparse edge types (id, gantt,
titlematch, review). "Related by keyword" is answered at view time with
two indexed queries — get a doc's DocKeywords, then get other DocKeywords
sharing those Keyword lookups. Cheaper, fresher, no explosion. This is
the right call even where row counts don't force it.

*v2.3 clarification:* the "Related documents" lists rendered into
sidecars do **not** violate this rule. They are a bounded per-doc
display cache — O(docs × RelatedTopN), computed at index time from
exactly the two indexed queries above (plus the sparse stored id
edges) — not an O(k·n²) edge table, and they never round-trip back
into Doc Links or any other list. Staleness is handled by reciprocal
patching (a newly indexed doc updates its neighbors' sidecar
sections), not by materializing edges.

*v2.6 addendum:* still true after the related-ranking overhaul, with
two refinements. (1) The ranking now reads **all** stored Doc Links
edge types (id / review / gantt / titlematch, weighted per type from
`Config.RelatedWeights`) — the sparse-edges rule is unchanged; the
sweep still mints only `id`, and gantt/titlematch minting stays with
Flow #2. (2) Ranking is a **shortlist-then-rerank** pattern: the two
indexed queries (widened by one Keywords-list metadata query that
also folds alias junction rows onto their canonicals) produce a
shortlist of `RelatedShortlist` (12) candidates; the flow fetches
just those candidates' Doc Index rows and a second script call
re-ranks them with metadata affinity and a symmetric (pair-min)
recency bonus before capping at RelatedTopN. Metadata never grows
the candidate set — no shared edge or keyword, no entry — so the
display cache stays O(docs × RelatedTopN) and keyword edges stay
computed-on-read.

**2. Full extracted text lives as .md sidecar files, not list columns.**
Create a document library **LRS Doc Index**. The flow writes one
`{title-slug}__doc{ID}.md` per document (fenced ` ```yaml ` metadata
block + header composed by the flow — fenced rather than `---`
frontmatter because SharePoint's markdown preview has no frontmatter
support and renders a leading `---` block as one giant setext
heading — body from ZipTextExtract/WorkbookDump markdown)
and stores only a ~5,000-char TextPreview plus TextFileUrl on the list
row. Since v2.5 the `{ID}` (and the sidecar's `doc_id:` line) is the
document's **Doc Index row id** — the number in the list's ID column,
the id the edges, `related:` entries, and TestPlanGen key on; v2.2–v2.4
minted it from the source library file's item id, a different number,
and pre-migration sidecars keep that old id until the v1.7 backfill
renames them (the media `doc{N}_` prefixes deliberately stay
file-id-keyed). Since v2.4 the sidecar lands in a per-DocKind subfolder of the
library (`Test Plans/`, `User Stories/`, … per `Config.KindFolders`;
`media/` stays shared at the root, so sidecars link images as
`../media/...`), and a reindex whose path moved recycles the old copy
— TextFileUrl on the row is always the current location. Multiline list columns are the wrong home for 60k+ character dumps
— and the sidecar library is literally the "machine-readable documents"
artifact from the original project goal: a greppable, Python-able
markdown corpus that survives independent of any list.

*Agent v1.0 addendum:* the sidecar library is now also the knowledge
source for the **LRS Doc Index Q&A** Copilot Studio agent
(`agent/QA_Agent_Setup.md`) — a second consumer of the format. The
agent's instructions describe the metadata fields, so a sidecar format
change now means the usual PromptVersion-bumped backfill *plus* a
matching `QA_Agent_Instructions` bump; neither is an ad-hoc edit.

*Curation v1.0 addendum:* the Keywords list gains two flow-owned
columns, `CurationStatus` (Choice: Proposed/Rejected) and
`ProposedCanonical` (single line) — see `schemas/SPList_Keywords.csv`.
Neither is a lookup (modern UI fine) and neither is indexed (the
curation flow filters them in memory from one `$top 5000` fetch,
never via OData `$filter`). The column-ownership invariant that keeps
three writers off each other's fields: the sweep writes `Title`/`Kind`
and *reads* `CanonicalRef`; humans write `CanonicalRef`,
`CurationStatus = Rejected`, and `Notes`; the curation flow writes
only its two columns, via field-scoped REST MERGE. Disjoint writers —
no locking, no coordination.

**3. Alternate keys become indexed text columns + query-then-write.**
Dataverse enforced uniqueness at the database; SharePoint doesn't, so
dedup returns to the Email Links pattern verbatim: single-line key
column (DocKey, IdKey, KWKey, LinkKey, IssueKey), **indexed**, flow
queries by key before writing, all loops serialized (every Foreach
sets concurrency 1; the v2.5 Recurrence trigger itself carries no
concurrency block — the daily cadence makes overlapping runs
unlikely, and pinning trigger concurrency to 1 in the designer is an
optional hardening, see `review/patches/designer-edits.md` §r2).
LinkKey uses
sorted *item IDs* (`{minId}|{maxId}|{type}`) — shorter than paths, same
sorted-pair collapse.

**4. Lookups where navigation pays.**
Document references on DocIds / DocKeywords / DocLinks / IssueRefs are
true SharePoint lookup columns — that's the click-through UI the
model-driven app would have provided. Power Automate wiring: set a
lookup by passing the target item's numeric ID (`Document Id` field in
Create item); filter by lookup with the hidden numeric column —
`Document/Id` needs no expand in Get items filter syntax when written
as `DocumentId eq 42`.

**5. Choices are strings now.** No integer choice values to record into
Config — SharePoint choice columns read and write as their labels in
Power Automate. One small mercy.

## Build mechanics (you know most of this — the checklist anyway)

1. Create the **LRS Doc Index** library first, then the six lists as
   Blank lists, in this order: Doc Index, Keywords, then Doc IDs,
   Issue Refs, Doc Keywords, Doc Links (lookups target existing lists).
2. **Create every column with its internal name** (no spaces, exactly as
   the CSV's Internal Name), then rename display names after if you want
   pretty. First-created name = internal name, forever.
3. Choice columns: enter values exactly as listed; no fill-in choices.
   TextPreview / SharedValues / Notes / Summary: plain text, NOT
   enhanced rich text.
4. **Indexes before data**: List settings → Indexed columns → add every
   column marked INDEXED in the CSVs (plus Title on Keywords). Indexing
   an empty list is instant; indexing a full one is a bad afternoon.
5. Verify internal names via your usual signed-in REST check
   (`.../_api/web/lists/getbytitle('Doc Index')/fields?$filter=...`) and
   record the six list GUIDs — the flow Config compose will want them.

## Known tradeoffs accepted

- No database-enforced uniqueness → serialized loops + indexed key
  queries (proven pattern, known residual race ≈ zero at this volume;
  overlapping *runs* are fenced only by the daily cadence — trigger
  concurrency is not set in the v2.5 definition).
- Title caps at 255 chars → flow truncates.
- 600 docs ≈ Doc Index 600 rows, Doc IDs ~1,500, Doc Keywords ~4,000,
  Doc Links (sparse types only) a few hundred — all comfortably inside
  SharePoint's happy zone with the indexes in place.
