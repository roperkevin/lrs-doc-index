# Copilot prompts — provision the LRS Doc Index SharePoint schema

Two formats, same schema (mirrored verbatim from
`schemas/SPList_*.csv` — if a CSV changes, update this file in the
same commit):

- **Chunked version (below)** — for Copilot in SharePoint / M365
  Copilot chat, which cap the prompt box. Four messages, each under
  ~1,800 characters; paste them one at a time, in order, in ONE chat
  session. Copilot acknowledges parts 1–3 and generates after part 4.
- **One-shot version (further down)** — for surfaces without a
  character limit (GitHub Copilot chat, Copilot in VS Code).

Scope: the SIX sweep lists only. `schemas/SPList_QAFeedback.csv`
(Q&A agent v2.0's feedback list) is component-scoped and deliberately
NOT in this prompt — no lookups, so it needs no scripted
provisioning; create it per `agent/QA_Agent_Setup.md` §9 when
deploying that component.

---

## Chunked version — paste each part as its own message

### Part 1 of 4

```text
Multi-part task, part 1 of 4 (the schema arrives in parts 2-4 because
of message length limits). Just acknowledge each part; generate only
after part 4.

Deliverable: ONE idempotent PnP.PowerShell script that provisions a
SharePoint schema on https://esriis.sharepoint.com/sites/lrsworkspace
EXACTLY as specified. This is transcription, not design: no renames,
no added or skipped columns, no reordered choice values, no
improvements. Columns marked "reserved" are intentionally unused —
create them anyway.

Rules:
1. Create each column using its Internal Name as the creation-time
   name (display and internal names are identical here except the
   native Title columns).
2. Choice columns: dropdown, NO fill-in choices, values exactly as
   listed, order preserved.
3. Multi-line text columns: plain text, NOT enhanced rich text
   (RichText FALSE).
4. Number columns: 0 decimal places.
5. Date and Time columns: include time (not date-only).
6. Lookup columns: single value, show the target list's Title.
7. Index every column marked INDEXED, plus Title on the Keywords
   list, before any data exists.
8. Required only where marked Req; everything else optional.
9. No uniqueness enforcement on any column.
10. End the script by printing every list's GUID (Get-PnPList) and a
    per-list Get-PnPField dump of internal names and types.

Creation order: document library "LRS Doc Index" first, then lists
Doc Index, Keywords, Doc IDs, Issue Refs, Doc Keywords, Doc Links
(lookups target existing lists; the Keywords self-lookup is added
after the Keywords list exists).

Library "LRS Doc Index": standard document library, no custom
columns, root folders: media, Test Plans, User Stories, Design
Spikes, Data Templates, Schedules, Doc Reviews, Other.

Reply "ready" and wait for part 2.
```

### Part 2 of 4

```text
Part 2 of 4 — list "Doc Index". Format: Name | Type | notes.

Title | native single line | Req
DocKey | single line | Req, INDEXED (identity/dedup key)
FileName | single line | Req
SourceLink | hyperlink
Library | single line | reserved, unused - create anyway
FileType | choice: pptx; docx; xlsx; pdf; msg; txt; html; image; other
DocKind | choice: Test Plan; User Story; Design Spike; Data Template; Schedule; Doc Review; Other
IndexStatus | choice: Pending; Indexed; Skipped; Error | Req, default Pending
SourceETag | single line | reserved, unused - create anyway
SourceModified | date and time
TextPreview | multi-line plain text
TextFileUrl | hyperlink
Summary | multi-line plain text
DocRevision | single line
TargetRelease | single line
PE | single line
Dev | single line
SourceAuthor | single line
SourceEditor | single line
SourceEdited | date and time
Surface | choice: Pro; Experience Builder; Server; Enterprise; Other
ExtractionLane | choice: xmlstrip; workbookdump; plaintext; htmltotext; ocr; none
PromptVersion | single line
IndexedOn | date and time
LastError | multi-line plain text

Indexed columns: DocKey.

Reply "ready" and wait for part 3.
```

### Part 3 of 4

```text
Part 3 of 4 — three lists.

List "Keywords":
Title | native single line | Req (the keyword or alias, lowercase)
Kind | choice: topic; tool; product | Req
CanonicalRef | lookup -> Keywords (this same list), show Title
Notes | multi-line plain text
CurationStatus | choice: Proposed; Rejected
ProposedCanonical | single line
Indexed columns: Title.

List "Doc IDs":
Title | native single line | Req
Document | lookup -> Doc Index, show Title | Req, INDEXED
Repo | single line | Req
IssueNumber | number, 0 decimals | Req, INDEXED
Source | choice: url; filename; hashtag; titlematch; manual | Req
IdKey | single line | Req, INDEXED (dedup key {DocItemId}|{repo}#{number})
Indexed columns: Document, IssueNumber, IdKey.

List "Issue Refs":
Title | native single line | Req
Repo | single line | Req
IssueNumber | number, 0 decimals | Req
IssueKey | single line | Req, INDEXED (upsert key {repo}#{number})
IssueTitle | single line | Req
PE | single line
Dev | single line
IterationLabel | single line
StatusSummary | single line
DoneFlag | yes/no
SourceDocument | lookup -> Doc Index, show Title
Indexed columns: IssueKey.

Reply "ready" and wait for part 4.
```

### Part 4 of 4

```text
Part 4 of 4 — last two lists, then generate.

List "Doc Keywords":
Title | native single line | Req
Document | lookup -> Doc Index, show Title | Req, INDEXED
Keyword | lookup -> Keywords, show Title | Req, INDEXED
KWKey | single line | Req, INDEXED (dedup key {DocItemId}|{KeywordItemId})
Indexed columns: Document, Keyword, KWKey.

List "Doc Links":
Title | native single line | Req
DocA | lookup -> Doc Index, show Title | Req
DocB | lookup -> Doc Index, show Title | Req
LinkType | choice: id; gantt; titlematch; review | Req
SharedValues | multi-line plain text
Strength | number, 0 decimals
LinkKey | single line | Req, INDEXED (dedup key {minItemId}|{maxItemId}|{linktype})
Indexed columns: LinkKey.

That is the complete schema: 1 library + 6 lists. Now produce the
single complete PnP.PowerShell script per the part-1 rules —
runnable, no placeholder ellipses, with the GUID printout and
per-list field verification at the end.
```

---

## One-shot version — for surfaces without a character limit

Paste everything between the next rule and the "Notes for the human"
section as a single message.

---

You are generating a SharePoint provisioning script. Produce a single
idempotent **PnP.PowerShell** script (`Connect-PnPOnline` +
`Add-PnPList` / `Add-PnPField` / `Add-PnPFieldFromXml` where needed)
that creates the schema below on
`https://esriis.sharepoint.com/sites/lrsworkspace` — exactly as
specified. This is a transcription task, not a design task:

**Hard rules — no deviation:**

1. Reproduce every list, column, internal name, type, choice value,
   default, required flag, and index EXACTLY as written below. Do not
   rename, reorder choice values, add columns, "improve" anything, or
   skip columns marked RESERVED (create them; they're intentionally
   unused).
2. Create each column with its **internal name** as the creation-time
   name (internal name is fixed at creation), then set the display
   name afterward. Internal and display names are identical here
   except the native Title columns.
3. Creation order (lookups target existing lists): the **LRS Doc
   Index** document library first, then lists **Doc Index, Keywords,
   Doc IDs, Issue Refs, Doc Keywords, Doc Links**. Add the Keywords
   list's self-lookup (`CanonicalRef` → Keywords) after the Keywords
   list exists.
4. Choice columns: dropdown, **no fill-in choices**, values exactly as
   listed (order preserved). SharePoint choice columns read/write as
   label strings — no numeric mapping anywhere.
5. Multiple-lines-of-text columns are **plain text, NOT enhanced rich
   text** (`RichText="FALSE"`).
6. Number columns: **0 decimal places**.
7. Date and Time columns: **date & time** format (include time), not
   date-only.
8. Lookup columns: single-value, show the target list's **Title**.
9. **Indexes before any data**: index every column marked INDEXED,
   plus **Title on the Keywords list**.
10. Required = the Required column below; everything else optional.
11. Do not enable uniqueness enforcement on any column — dedup is done
    by the flow via the indexed key columns (IdKey, KWKey, LinkKey,
    IssueKey, DocKey).
12. End the script by printing each list's GUID
    (`Get-PnPList | Select Title, Id`) — the flow Config needs them.
13. If any step can't be expressed in PnP.PowerShell, fall back to
    `Add-PnPFieldFromXml` with explicit CAML — never approximate with
    a different column type.

## Document library: LRS Doc Index

Standard document library. Create these folders at its root:
`media`, `Test Plans`, `User Stories`, `Design Spikes`,
`Data Templates`, `Schedules`, `Doc Reviews`, `Other`.
No custom columns.

## List 1: Doc Index

| Display Name | Internal Name | Type | Details | Required |
|---|---|---|---|---|
| Title | Title | Single line (native) | Document title from prompt; flow truncates to 255 | Yes |
| DocKey | DocKey | Single line of text | Server-relative file path lowercased; INDEXED — the identity/dedup key | Yes |
| FileName | FileName | Single line of text | File name with extension | Yes |
| SourceLink | SourceLink | Hyperlink | Absolute link to the file | No |
| Library | Library | Single line of text | RESERVED — unused, create anyway | No |
| FileType | FileType | Choice | pptx; docx; xlsx; pdf; msg; txt; html; image; other | No |
| DocKind | DocKind | Choice | Test Plan; User Story; Design Spike; Data Template; Schedule; Doc Review; Other | No |
| IndexStatus | IndexStatus | Choice | Pending; Indexed; Skipped; Error — **default: Pending** | Yes |
| SourceETag | SourceETag | Single line of text | RESERVED — unused, create anyway | No |
| SourceModified | SourceModified | Date and Time | Include time | No |
| TextPreview | TextPreview | Multiple lines of text | PLAIN text (not enhanced) | No |
| TextFileUrl | TextFileUrl | Hyperlink | Link to full-text .md sidecar | No |
| Summary | Summary | Multiple lines of text | Plain text | No |
| DocRevision | DocRevision | Single line of text | e.g. V4 | No |
| TargetRelease | TargetRelease | Single line of text | e.g. 3.8 / 12.2 | No |
| PE | PE | Single line of text | | No |
| Dev | Dev | Single line of text | | No |
| SourceAuthor | SourceAuthor | Single line of text | Document author | No |
| SourceEditor | SourceEditor | Single line of text | Last editor | No |
| SourceEdited | SourceEdited | Date and Time | Include time | No |
| Surface | Surface | Choice | Pro; Experience Builder; Server; Enterprise; Other | No |
| ExtractionLane | ExtractionLane | Choice | xmlstrip; workbookdump; plaintext; htmltotext; ocr; none | No |
| PromptVersion | PromptVersion | Single line of text | | No |
| IndexedOn | IndexedOn | Date and Time | Include time | No |
| LastError | LastError | Multiple lines of text | PLAIN text (not enhanced) | No |

Indexed columns: **DocKey**.

## List 2: Keywords

| Display Name | Internal Name | Type | Details | Required |
|---|---|---|---|---|
| Title | Title | Single line (native) | The keyword or alias, lowercase | Yes |
| Kind | Kind | Choice | topic; tool; product | Yes |
| CanonicalRef | CanonicalRef | Lookup | Target: **Keywords (this same list)**, show Title | No |
| Notes | Notes | Multiple lines of text | Plain text | No |
| CurationStatus | CurationStatus | Choice | Proposed; Rejected | No |
| ProposedCanonical | ProposedCanonical | Single line of text | | No |

Indexed columns: **Title**.

## List 3: Doc IDs

| Display Name | Internal Name | Type | Details | Required |
|---|---|---|---|---|
| Title | Title | Single line (native) | Flow composes repo#number | Yes |
| Document | Document | Lookup | Target: **Doc Index**, show Title; INDEXED | Yes |
| Repo | Repo | Single line of text | e.g. ArcGISPro/ps-location-referencing | Yes |
| IssueNumber | IssueNumber | Number | 0 decimal places; INDEXED | Yes |
| Source | Source | Choice | url; filename; hashtag; titlematch; manual | Yes |
| IdKey | IdKey | Single line of text | {DocItemId}\|{repo}#{number} — INDEXED | Yes |

Indexed columns: **Document, IssueNumber, IdKey**.

## List 4: Issue Refs

| Display Name | Internal Name | Type | Details | Required |
|---|---|---|---|---|
| Title | Title | Single line (native) | Flow composes repo#number | Yes |
| Repo | Repo | Single line of text | | Yes |
| IssueNumber | IssueNumber | Number | 0 decimals | Yes |
| IssueKey | IssueKey | Single line of text | {repo}#{number} — INDEXED | Yes |
| IssueTitle | IssueTitle | Single line of text | | Yes |
| PE | PE | Single line of text | | No |
| Dev | Dev | Single line of text | | No |
| IterationLabel | IterationLabel | Single line of text | e.g. Iteration 2 | No |
| StatusSummary | StatusSummary | Single line of text | | No |
| DoneFlag | DoneFlag | Yes/No | | No |
| SourceDocument | SourceDocument | Lookup | Target: **Doc Index**, show Title | No |

Indexed columns: **IssueKey**.

## List 5: Doc Keywords

| Display Name | Internal Name | Type | Details | Required |
|---|---|---|---|---|
| Title | Title | Single line (native) | Flow composes file\|keyword | Yes |
| Document | Document | Lookup | Target: **Doc Index**, show Title; INDEXED | Yes |
| Keyword | Keyword | Lookup | Target: **Keywords**, show Title; INDEXED | Yes |
| KWKey | KWKey | Single line of text | {DocItemId}\|{KeywordItemId} — INDEXED | Yes |

Indexed columns: **Document, Keyword, KWKey**.

## List 6: Doc Links

| Display Name | Internal Name | Type | Details | Required |
|---|---|---|---|---|
| Title | Title | Single line (native) | Short edge label | Yes |
| DocA | DocA | Lookup | Target: **Doc Index**, show Title | Yes |
| DocB | DocB | Lookup | Target: **Doc Index**, show Title | Yes |
| LinkType | LinkType | Choice | id; gantt; titlematch; review | Yes |
| SharedValues | SharedValues | Multiple lines of text | Plain text | No |
| Strength | Strength | Number | 0 decimals | No |
| LinkKey | LinkKey | Single line of text | {minItemId}\|{maxItemId}\|{linktype} — INDEXED | Yes |

Indexed columns: **LinkKey**.

## Output format

Return one complete, runnable PnP.PowerShell script with a short
comment header, no placeholder ellipses, and a final verification
section that lists every created column's internal name and type per
list (via `Get-PnPField`) so the result can be diffed against this
spec.

---

## Notes for the human (not part of either prompt)

- **If instead you're using Microsoft Lists' "Create a list with
  Copilot" box** (also character-limited): the per-list parts 2–4
  above fit the box one list at a time, but that Copilot cannot
  create lookup columns, indexes, or defaults, and its column names
  become the internal names only if typed without spaces. Expect to
  add the lookups (via CLASSIC list settings — see next note), the
  indexes, and the IndexStatus default by hand afterward. The
  chunked-chat → PnP script route avoids all of that.
- One thing no script fixes: on this tenant, **lookup columns created
  through the modern UI are broken** (silent write drops, spinning
  pickers) — the fresh-tenant install order in the README says to
  create lookups via CLASSIC list settings. PnP/CSOM provisioning
  (which the script uses) bypasses the modern UI and has been the safe
  path, but after running the script, verify each lookup writes
  correctly by creating one test item per child list before pointing
  the flow at it.
- After provisioning, record the six list GUIDs the script prints —
  the flow Config compose needs them (see
  `docs/SP_Adaptation_Notes.md` for the current tenant's GUIDs).
- The choice values, internal names, and index list here are mirrored
  from `schemas/SPList_*.csv` (the source of truth). If a CSV changes,
  update this prompt in the same commit.
