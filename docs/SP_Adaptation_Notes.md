# LRS Doc Index — SharePoint Edition (replaces the Dataverse spec)

Six lists + one document library, all on esriis.sharepoint.com/sites/lrsworkspace.
Same data model as the Dataverse spec; this note covers only what changed
and why, plus build mechanics.

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

**2. Full extracted text lives as .md sidecar files, not list columns.**
Create a document library **Doc Index Texts**. The flow writes one
`{title-slug}__doc{ID}.md` per document (YAML frontmatter + header
composed by the flow, body from ZipTextExtract/WorkbookDump markdown)
and stores only a ~5,000-char TextPreview plus TextFileUrl on the list
row. Multiline list columns are the wrong home for 60k+ character dumps
— and the sidecar library is literally the "machine-readable documents"
artifact from the original project goal: a greppable, Python-able
markdown corpus that survives independent of any list.

**3. Alternate keys become indexed text columns + query-then-write.**
Dataverse enforced uniqueness at the database; SharePoint doesn't, so
dedup returns to the Email Links pattern verbatim: single-line key
column (DocKey, IdKey, KWKey, LinkKey, IssueKey), **indexed**, flow
queries by key before writing, trigger concurrency 1. LinkKey uses
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

1. Create the **Doc Index Texts** library first, then the six lists as
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

- No database-enforced uniqueness → concurrency-1 + indexed key queries
  (proven pattern, known residual race ≈ zero at this volume).
- Title caps at 255 chars → flow truncates.
- 600 docs ≈ Doc Index 600 rows, Doc IDs ~1,500, Doc Keywords ~4,000,
  Doc Links (sparse types only) a few hundred — all comfortably inside
  SharePoint's happy zone with the indexes in place.
