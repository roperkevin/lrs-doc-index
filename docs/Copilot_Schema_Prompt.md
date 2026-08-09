# Copilot Schema Prompt — LRS Doc Index lists & library

Paste everything below the rule into Copilot when you want it to build (or
script the build of) the Doc Index schema on a fresh site. It is compiled
from `schemas/SPList_*.csv` and `docs/SP_Adaptation_Notes.md` — those stay
the source of truth; regenerate this prompt if they change.

---

You are configuring SharePoint on the site
`https://esriis.sharepoint.com/sites/lrsworkspace` for the LRS Doc Index
system. Create exactly one document library and six lists, with the exact
columns specified below. Do not create any extra columns, content types,
or views, and do not skip or rename anything.

## Global rules (these override your defaults — apply to every list)

1. **Internal names first.** Create every column using its INTERNAL NAME
   exactly as written (no spaces). The first-created name becomes the
   internal name permanently. Display names may be prettified afterwards,
   never before.
2. **Creation order matters** because lookup columns must target lists
   that already exist. Build in this order:
   library `Doc Index Texts` → list `Doc Index` → list `Keywords` →
   list `Doc IDs` → list `Issue Refs` → list `Doc Keywords` →
   list `Doc Links`. Create each list as a Blank list.
3. **Lookup columns must be created through CLASSIC list settings**
   (List settings → Create column), never the modern column panel.
   Modern-created lookups on this tenant silently drop writes and hang
   the picker. Every lookup shows the target list's **Title** column.
   If you cannot create a column via classic settings, stop and say so
   rather than creating it the modern way.
4. **Choice columns:** enter the values exactly as listed, in the listed
   order; drop-down display; **no fill-in choices**; no default value
   unless one is specified below.
5. **Multiple lines of text columns:** PLAIN text only — never enhanced
   rich text.
6. **Number columns:** 0 decimal places.
7. **Date and Time columns:** include time (date & time format).
8. **Indexes before data.** After all columns exist on a list and before
   any rows are written: List settings → Indexed columns → add every
   column marked INDEXED below. Also index **Title on the Keywords
   list**. (Indexing an empty list is instant; a full one is a bad
   afternoon.)
9. **Title** is the native single-line Title column on every list —
   configure it required; do not create a second Title.

## Document library: `Doc Index Texts`

- Blank document library, default settings, no custom columns.
- Create one folder at the library root named `media` (the flow saves
  extracted images there; everything else about the library stays stock).

## List 1: `Doc Index`

The master row per document. One row per file in the source library.

| Internal name | Type | Required | Indexed | Configuration |
|---|---|---|---|---|
| Title | Single line (native) | Yes | — | Document title from the AI prompt; the flow truncates to 255 chars |
| DocKey | Single line of text | Yes | **INDEXED** | Server-relative file path, lowercased — the identity/dedup key |
| FileName | Single line of text | Yes | — | File name with extension |
| SourceLink | Hyperlink | No | — | Absolute https link to the source file |
| Library | Single line of text | No | — | Source library display name |
| FileType | Choice | No | — | Values: `pptx; docx; xlsx; pdf; msg; txt; html; image; other` |
| DocKind | Choice | No | — | Values: `Test Plan; User Story; Design Spike; Data Template; Schedule; Doc Review; Other` |
| IndexStatus | Choice | Yes | — | Values: `Pending; Indexed; Skipped; Error` — **default: Pending** |
| SourceETag | Single line of text | No | — | SharePoint ETag at index time (change detection) |
| SourceModified | Date and Time | No | — | Include time |
| TextPreview | Multiple lines of text | No | — | PLAIN text; first ~5000 chars of extracted text |
| TextFileUrl | Hyperlink | No | — | Link to the full-text .md sidecar in Doc Index Texts |
| Summary | Multiple lines of text | No | — | PLAIN text; from the AI prompt |
| DocRevision | Single line of text | No | — | e.g. `V4` |
| TargetRelease | Single line of text | No | — | e.g. `3.8 / 12.2` |
| PE | Single line of text | No | — | |
| Dev | Single line of text | No | — | |
| Surface | Choice | No | — | Values: `Pro; Experience Builder; Server; Enterprise; Other` |
| ExtractionLane | Choice | No | — | Values: `xmlstrip; workbookdump; plaintext; htmltotext; ocr; none` |
| PromptVersion | Single line of text | No | — | Prompt rev that produced the semantic fields |
| IndexedOn | Date and Time | No | — | Include time |

## List 2: `Keywords`

The canonical keyword vocabulary (rows are keywords or aliases).

| Internal name | Type | Required | Indexed | Configuration |
|---|---|---|---|---|
| Title | Single line (native) | Yes | **INDEXED** | The keyword or alias, lowercase |
| Kind | Choice | Yes | — | Values: `topic; tool; product` |
| CanonicalRef | Lookup | No | — | Target: **Keywords (this same list)**, show Title; empty = row IS canonical, set = row is an alias of the target |
| Notes | Multiple lines of text | No | — | PLAIN text; curation notes |

## List 3: `Doc IDs`

One row per issue-ID mention found in a document.

| Internal name | Type | Required | Indexed | Configuration |
|---|---|---|---|---|
| Title | Single line (native) | Yes | — | Flow composes `repo#number` |
| Document | Lookup | Yes | **INDEXED** | Target: **Doc Index**, show Title |
| Repo | Single line of text | Yes | — | e.g. `ArcGISPro/ps-location-referencing` |
| IssueNumber | Number | Yes | **INDEXED** | 0 decimal places |
| Source | Choice | Yes | — | Values: `url; filename; hashtag; titlematch; manual` |
| IdKey | Single line of text | Yes | **INDEXED** | `{DocItemId}\|{repo}#{number}` — query-then-write dedup key |

## List 4: `Issue Refs`

Issue metadata from schedule/Gantt docs (fed by flow #2; empty until then).

| Internal name | Type | Required | Indexed | Configuration |
|---|---|---|---|---|
| Title | Single line (native) | Yes | — | Flow composes `repo#number` |
| Repo | Single line of text | Yes | — | |
| IssueNumber | Number | Yes | — | 0 decimal places |
| IssueKey | Single line of text | Yes | **INDEXED** | `{repo}#{number}` — upsert key (rollover rows dedupe here) |
| IssueTitle | Single line of text | Yes | — | Issue name as written in the Gantt row — title-match target |
| PE | Single line of text | No | — | |
| Dev | Single line of text | No | — | |
| IterationLabel | Single line of text | No | — | Sheet name, e.g. `Iteration 2` |
| StatusSummary | Single line of text | No | — | e.g. `TP=Completed; Dev=Completed; Test=In Progress` |
| DoneFlag | Yes/No | No | — | Gantt `Done?` column |
| SourceDocument | Lookup | No | — | Target: **Doc Index**, show Title — the schedule doc the rows came from |

## List 5: `Doc Keywords`

Junction: document ↔ canonical keyword.

| Internal name | Type | Required | Indexed | Configuration |
|---|---|---|---|---|
| Title | Single line (native) | Yes | — | Flow composes `file\|keyword` |
| Document | Lookup | Yes | **INDEXED** | Target: **Doc Index**, show Title |
| Keyword | Lookup | Yes | **INDEXED** | Target: **Keywords**, show Title — always the CANONICAL row, never an alias |
| KWKey | Single line of text | Yes | **INDEXED** | `{DocItemId}\|{KeywordItemId}` — dedup key |

## List 6: `Doc Links`

Sparse doc-to-doc edges. Precise edge types only — keyword relatedness is
computed at read time and is deliberately NOT a valid LinkType.

| Internal name | Type | Required | Indexed | Configuration |
|---|---|---|---|---|
| Title | Single line (native) | Yes | — | Short edge label for display |
| DocA | Lookup | Yes | — | Target: **Doc Index**, show Title; the LOWER item ID of the pair |
| DocB | Lookup | Yes | — | Target: **Doc Index**, show Title; the HIGHER item ID of the pair |
| LinkType | Choice | Yes | — | Values: `id; gantt; titlematch; review` — do NOT add a `keyword` value |
| SharedValues | Multiple lines of text | No | — | PLAIN text; semicolon-joined values, e.g. `ArcGISPro/ps-location-referencing#4855` |
| Strength | Number | No | — | 0 decimals; count of shared values |
| LinkKey | Single line of text | Yes | **INDEXED** | `{minItemId}\|{maxItemId}\|{linktype}` — sorted-pair dedup key |

## Verification (do this last, and report the results)

1. For each of the six lists, enumerate the fields via REST
   (`.../_api/web/lists/getbytitle('<List>')/fields`) and confirm every
   internal name above exists exactly as written — no `_x0020_` artifacts,
   no OData-renamed columns.
2. Confirm each INDEXED column (plus Title on Keywords) appears under
   List settings → Indexed columns.
3. Confirm each lookup column resolves to the correct target list and
   shows Title, and that creating a test item through the picker writes
   and reads back correctly (delete the test item afterwards).
4. Report the six list GUIDs — the flow's Config compose needs them.
