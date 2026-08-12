# Flow v2.4 — sidecars routed by document kind + source authorship

v2.4 is v2.3 (including its v1.4/v1.5 addenda) plus two releases in one:

1. **Kind subfolders** — every sidecar now lands in a per-DocKind
   subfolder of the LRS Doc Index library (`Test Plans/`,
   `User Stories/`, `Design Spikes/`, `Data Templates/`, `Schedules/`,
   `Doc Reviews/`, `Other/`) instead of the library root, so browsing
   the library reads like a filing cabinet.
2. **Source authorship** — each document's author, last editor and
   last-edited timestamp are extracted from the document itself
   (OOXML core properties) with the source library's Created By /
   Modified By / Modified as fallback, and stored in the sidecar's
   metadata block, the sidecar's visible header strip, and three new
   Doc Index columns.

It ships with two script pastes:

| Piece | Version | Where |
|---|---|---|
| Flow definition | v2.4 | this folder (`DocIndexSweep_v2_4.zip` is the v2.3 package skeleton + this definition; real script bindings as of 2026-08-10, post-import verification below still applies) |
| ZipTextExtract | **v1.8 (paste over v1.7)** | `scripts/ZipTextExtract.ts` |
| SidecarPatch | **v1.2 (paste over v1.1)** | `scripts/SidecarPatch.ts` |
| RelatedRank | v1.1 (unchanged) | `scripts/RelatedRank.ts` |
| AI Builder prompt | v1.2 (unchanged) | `review/patches/DocIndex_Prompt_v1_2.md` |

Supersedes v2.3 as the import target. The `PromptVersion` bump to `v1.6`
is **format-only** — the prompt text is unchanged and must NOT be
re-pasted; the bump drives the version-gated backfill that relocates and
enriches the existing corpus (below).

## What changed

### Routing — one subfolder per DocKind

- **`Config`** gains a `KindFolders` map (choice value → folder name):
  Test Plan → `Test Plans`, User Story → `User Stories`, Design Spike →
  `Design Spikes`, Data Template → `Data Templates`, Schedule →
  `Schedules`, Doc Review → `Doc Reviews`, Other → `Other`. The folder
  names are the single source of truth — rename here if you want
  different labels (then move the existing files to match).
- New composes **`Kind_folder`** (map lookup over `Doc_kind_safe`,
  coalesced to `Other` — `Doc_kind_safe` already coerces off-list model
  output, so the coalesce is a second belt) and **`Sidecar_folder`**
  (`{TextsFolder}/{Kind_folder}`).
- **`Save_sidecar`** writes into `Sidecar_folder`; **`Text_file_url`**
  (the list row's `TextFileUrl`) carries the subfolder. Media files stay
  in the shared `/LRS Doc Index/media` folder; because sidecars are now
  one level down, the inline image links are minted as
  `../media/doc{ID}_...` (the `mediaPrefix` parameter on both
  `Zip_extract_pptx`/`Zip_extract_docx` — old root-level sidecars keep
  their `media/...` links until the backfill rewrites them; both forms
  resolve correctly from where each file lives).
- **Relocation on reindex** — new `Old_sidecar_url` compose +
  `If_sidecar_moved` condition after `Text_file_url`: when the row's
  existing `TextFileUrl` points inside the site and differs from the
  new path (backfill moving a root sidecar into its subfolder, or a
  doc's kind/title changing on reindex), the old file is recycled via
  a SharePoint `HttpRequest` POST to
  `GetFileByServerRelativePath(...)/recycle()` — recycle, not delete,
  so anything unexpected is recoverable from the recycle bin. A
  failed recycle (file already gone) is swallowed by a run-after
  `Recycle_note` compose — same pattern as `Neighbor_skipped` — and
  never fails the doc.
- **Reciprocal patching follows the files** — `Append_neighbor` now
  records each neighbor sidecar's own folder (derived from its
  `TextFileUrl` path), `Self_file` carries `Sidecar_folder`, and
  SidecarPatch v1.2 passes the `folder` property through untouched, so
  `Save_patched` writes every patched file back to the folder it was
  read from (root for not-yet-migrated neighbors, kind subfolder
  after). Related-documents links are absolute URLs and work across
  folders unchanged.

### Authorship — from the document, not just the library

- **ZipTextExtract v1.8** additionally inflates `docProps/core.xml`
  and returns three new fields: `author` (`dc:creator`),
  `lastEditedBy` (`cp:lastModifiedBy`) and `lastEdited`
  (`dcterms:modified`, W3CDTF). These are the document's own
  authorship trail — they survive the copy/re-upload cycles that reset
  SharePoint's Created By / Modified By columns. Missing part or
  malformed XML → empty strings, never an error.
- New flow variables **`SrcAuthor` / `SrcEditor` / `SrcEdited`**: reset
  per doc from the source library's Created By / Modified By /
  Modified, then overwritten in the pptx/docx lanes with the core
  properties when non-empty. xlsx/txt lanes (no zip to read) keep the
  library fallback.
- **Sidecar metadata block** gains three lines after `dev:`:

      author: "Claire Wang"
      last_edited_by: "Miguel Santos"
      last_edited: "2026-07-31T18:22:04Z"

  and the visible header strip gains
  `· **Last edited:** 2026-07-31 18:22 by Miguel Santos`
  (`unknown` when nothing is known).
- **Doc Index list** gains three columns (see
  `schemas/SPList_DocIndex.csv`): `SourceAuthor`, `SourceEditor`
  (single line) and `SourceEdited` (date+time, written as null when
  unknown). `SourceModified` is untouched and remains the reindex
  gate; `SourceEdited` is the document-property edit time, which can
  legitimately differ (e.g. a file uploaded yesterday but last edited
  in 2023).

### Version-gated backfill

`Config.PromptVersion` bumps `v1.5` → `v1.6`, reusing the v2.2 reindex
gate: existing rows reprocess ~150/day; each rewrite lands in its kind
subfolder, recycles the old root-level sidecar, updates the row's
`TextFileUrl`, and gains the authorship fields. During the convergence
window (~4 days at ~600 docs) a neighbor's related-list bullet can point
at a recycled root-level file until either doc reindexes or patches it —
transient by construction, self-healing, and the row's `TextFileUrl` is
always current.

## Install order (existing tenant)

1. **Create the seven kind subfolders** in the LRS Doc Index library
   (once, manual — same as the `media` folder): `Test Plans`,
   `User Stories`, `Design Spikes`, `Data Templates`, `Schedules`,
   `Doc Reviews`, `Other`. The SharePoint `CreateFile` action
   auto-creates missing folders on current tenants, but pre-creating
   them removes the ambiguity and gives you the empty structure to
   eyeball.
2. **Add the three Doc Index columns** per the updated
   `schemas/SPList_DocIndex.csv`: `SourceAuthor`, `SourceEditor`
   (single line of text), `SourceEdited` (date and time, include
   time). Internal names exactly as written, created before renaming
   display names. No new indexes needed (nothing filters on them).
3. Paste **ZipTextExtract v1.8** over v1.7 and **SidecarPatch v1.2**
   over v1.1 in Scripts.xlsx (Automate tab) — same names, same
   signatures, no re-pick needed for these two.
4. Import `DocIndexSweep_v2_4.zip` (as Update), or apply designer
   edits Q1–Q10 below to the live flow.
5. Prompt: no change — do NOT re-paste; the `v1.6` bump is format-only.

## REQUIRED after every import — not optional

- Script bindings: as of 2026-08-10 the definition and package carry
  the live flow's real bindings for all six Run-script actions —
  `Run_related_rank` → `RelatedRank`, `Run_sidecar_patch` →
  `SidecarPatch`, `Extract_media_pptx`/`Extract_media_docx` →
  `MediaExtract` (captured from the tenant export; the v2.1–v2.3
  stand-in re-picks are retired). On the home tenant no re-pick is
  needed; on a fresh tenant the script IDs are OneDrive item links
  that won't resolve, so re-pick every Run-script action to your
  pasted scripts.
- Re-verify the prompt action's model/prompt binding.
- `Get_files` pagination threshold 20000.
- **Designer-verify `Old_sidecar_url`** (F2-class check, same as
  `Neighbor_url`): confirm the `TextFileUrl` hyperlink column surfaces
  as a plain URL string on your tenant; if it surfaces as an object,
  change the expression to
  `coalesce(first(body('Check_indexed')?['value'])?['TextFileUrl']?['Url'], '')`.

Then one smoke run (`Config.SmokeFile`) over an already-indexed pptx,
checking: the new sidecar lands in the right kind subfolder; the old
root-level copy is in the recycle bin; the row's `TextFileUrl` points
into the subfolder; the metadata block shows `author:` /
`last_edited_by:` / `last_edited:` and the header strip renders the
"Last edited" segment; the row's three new columns are populated; any
inline images render (the `../media/` links); a reciprocally patched
neighbor kept its own folder.

## Designer edits (applying v2.4 to the live flow without re-import)

Expressions in designer form; copy exact action inputs from
`flow/v2_4/definition.json` where marked (→ defn).

- **Q1 — `Config`**: `PromptVersion` literal `v1.5` → `v1.6`; add the
  `KindFolders` object (→ defn).
- **Q2 — top level**: three new Initialize variables `Init_SrcAuthor` /
  `Init_SrcEditor` / `Init_SrcEdited` (String, empty) after
  `Init_NeighborFiles`; repoint `Get_keywords`'s run-after to
  `Init_SrcEdited`.
- **Q3 — `Try_index`**: three Set variable actions after
  `Reset_LaneUsed` — `Reset_SrcAuthor`
  (`coalesce(items('For_each_file')?['Author']?['DisplayName'], '')`),
  `Reset_SrcEditor` (same with `Editor`), `Reset_SrcEdited`
  (`coalesce(items('For_each_file')?['Modified'], '')`); repoint
  `Switch_ext`'s run-after to `Reset_SrcEdited`.
- **Q4 — pptx lane**: `Zip_extract_pptx`'s `mediaPrefix` gains the
  `../` prefix (`concat('../media/doc', items('For_each_file')?['ID'], '_')`);
  three Set variable actions after `Set_Lane_pptx` —
  `Set_SrcAuthor_pptx` / `Set_SrcEditor_pptx` / `Set_SrcEdited_pptx`,
  each `if(empty(<script field>), <library fallback>, <script field>)`
  over `body/result/author` / `lastEditedBy` / `lastEdited` (→ defn);
  repoint `If_has_media_pptx` to `Set_SrcEdited_pptx`.
- **Q5 — docx lane**: mirror of Q4 over `Zip_extract_docx`.
- **Q6 — after `Sidecar_name`**: new composes `Kind_folder`
  (`coalesce(outputs('Config')?['KindFolders']?[outputs('Doc_kind_safe')], 'Other')`)
  and `Sidecar_folder`
  (`concat(outputs('Config')?['TextsFolder'], '/', outputs('Kind_folder'))`);
  repoint `Select_kw_yaml`'s run-after to `Sidecar_folder`.
- **Q7 — `Sidecar_header`**: three YAML lines after the `dev:` line
  and the `**Last edited:**` segment on the header strip (→ defn for
  exact strings); `Save_sidecar`'s folder → `outputs('Sidecar_folder')`;
  `Text_file_url` → `concat(outputs('Config')?['SiteUrl'], outputs('Sidecar_folder'), '/', outputs('Sidecar_name'))`.
- **Q8 — after `Text_file_url`**: `Old_sidecar_url` compose
  (`coalesce(first(body('Check_indexed')?['value'])?['TextFileUrl'], '')`)
  → `If_sidecar_moved` condition (old url starts with
  `concat(Config.SiteUrl, '/')` AND differs from `Text_file_url`); Yes
  branch: `Recycle_old_sidecar` (Send an HTTP request to SharePoint,
  POST, uri → defn) then `Recycle_note` compose with run-after
  Succeeded **and Failed** (the swallow); repoint `If_doc_exists`'s
  run-after to `If_sidecar_moved`.
- **Q9 — `Create_doc` / `Update_doc`**: three new fields —
  `SourceAuthor` = `variables('SrcAuthor')`, `SourceEditor` =
  `variables('SrcEditor')`, `SourceEdited` =
  `if(empty(variables('SrcEdited')), null, variables('SrcEdited'))`.
- **Q10 — patch plumbing**: `Append_neighbor`'s value gains
  `"folder": substring(outputs('Neighbor_path'), 0, lastIndexOf(outputs('Neighbor_path'), '/'))`;
  `Self_file` gains `"folder": outputs('Sidecar_folder')`;
  `Save_patched`'s folder →
  `if(empty(item()?['folder']), outputs('Config')?['TextsFolder'], item()?['folder'])`.

Smoke test after Q1–Q10: same as the post-import smoke run above.

## Cost

+11 actions per indexed doc in the worst case (3 resets + 3 lane sets +
2 folder composes + `Old_sidecar_url` + condition + recycle), zero new
Run-script calls, zero new list queries; at `MaxDocsPerRun` 150 that
stays comfortably inside the v2.3 ~2,500-actions/run envelope. The
recycle call only fires while a doc's sidecar actually moves (once per
doc during the backfill, then rarely).

## Verification record

`review/harness/` (2026-08-10 run):

- `check_format.py` PASS — all v2.2 body-contract assertions unchanged
  over the v1.8 script, plus the new core-properties assertions:
  planted author/lastModifiedBy/modified extracted from both pptx and
  docx fixtures (entities decoded), and a props-less synthetic zip
  degrades to empty strings.
- `check_related.py` PASS — all RelatedRank v1.1 and SidecarPatch
  assertions unchanged and green over SidecarPatch v1.2, plus the
  folder pass-through cases: set/merge outputs carry the input
  `folder` verbatim, and a folder-less file object comes back with
  `folder: ""`.
- `render_sample.py` PASS — the mirrored v2.4 template (authorship
  lines, `v1.6`, subfolder URL) round-trips `yaml.safe_load` in both
  empty and populated states; one H1; markers well-placed.
- `zte_v18.ts` and `scp_v12.ts` type-check at ES2017.

---

**Addendum (2026-08-11, r2 PV-1):** the sibling import zip was re-cut
with the connection `displayName` (a personal work email) scrubbed
from its `manifest.json`. The `definition.json` payload is
byte-identical to the pre-scrub zip; only the manifest changed, so
the zip is no longer the byte-exact export artifact (git history
holds the original). Import behavior is unaffected — connections are
re-mapped at import time.
