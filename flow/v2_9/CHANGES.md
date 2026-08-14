# Flow v2.9 — performance + instrumentation release

v2.9 is v2.8 with no format changes at all: the sidecars, the Doc
Index rows, and every edge row are byte-identical by construction.
What changes is how fast a run gets there, and that the run finally
measures itself. Five changes (P1–P5), paired with **ZipTextExtract
v2.2** (the r7 batch, gate `check_batch_r7.py`).

`flow/DocIndexSweep_v2_9.zip` is cut from the v2.8 package skeleton
(manifests and maps byte-identical, PV-1 scrub carried over) with
this definition as payload — payload byte-identical to
`flow/v2_9/definition.json` (RL-4). **The deployment path for this
release is the import** (`designer-edits.md` §v2_9): the P1 rewiring
touches ten expression sites and the designer-edit route exists only
as the patch-in-place fallback.

## P1 — bulk pre-fetch replaces the per-item Check_indexed (the N+1)

v2.8 issued one Doc Index `GetItems` per library item per run —
serially, before the budget check — so a 600-doc library paid ~600
HTTP round trips every night just to decide what to do, scaling
linearly with library size forever.

v2.9 fetches the Doc Index ONCE (`Get_index_rows`: `$select` of the
six needed columns, `$top` 20000 + paginationPolicy, plain unsorted
enumeration — safe past the 5000-item list-view threshold), slims it
to an in-memory array (`Select_index_map`: `k/id/m/s/p/u` =
lowercased DocKey / row ID / SourceModified / IndexStatus /
PromptVersion / TextFileUrl), and the per-item check becomes
`Lookup_indexed`, a Filter-array over that map — pure in-memory,
zero HTTP, sub-millisecond. `Needs_index` and the nine other
`Check_indexed` consumers (Update_doc / Doc_item_id /
Old_sidecar_url / the skipped and error upsert branches) read the
map row's fields instead. The per-entity dedup reads inside the
processing path (`Check_idrow` / `Check_kw` / `Check_dockw` /
`Check_link`) are NOT touched — they run only for processed docs and
guard creates.

Snapshot invariant: the map is read-only and taken once per run.
That is safe because each file appears exactly once per run and
rows created mid-run are only ever re-read *for the same file inside
the same iteration*, via the `DocRowId` variable — no cross-file
consumer reads the map for a row the run itself created. (A doc
whose row is created in run N is found in run N+1's fresh map.)

Designer fallback, documented not expected: if the connector rejects
`$select` on the IndexStatus choice column, delete the `$select`
parameter — payload grows, behavior identical.

## P2 — merged extraction: the second upload is gone

v2.8's pptx/docx lanes uploaded the SAME base64 payload twice for
every image-bearing document: once to ZipTextExtract, then again to
MediaExtract, which re-parsed the same ZIP central directory and
re-inflated to return the images (the F8 guard only spared
zero-media docs). ZipTextExtract v2.2 (MG-1) absorbs the media path:
`Zip_extract_pptx`/`_docx` bind `wantMedia: true` and the one call
returns `images` / `skippedMedia` / `imageCount` alongside the eight
existing fields. The `Extract_media_*` actions are DELETED;
`For_each_img_*` iterates `body/result/images` of the Zip_extract
call. Per image-bearing doc that saves one full base64 upload
(up to ~4.7 MB of request body) plus one Run-script invocation and
its Excel-session overhead.

The SC-4 guarantee (no dead image links) is now structural: the
selection walk that mints the links IS the save loop — the two can
no longer diverge, and the SB-8 KEEP-IN-SYNC banner over the
duplicated ZIP reader retires with MediaExtract itself
(`scripts/MediaExtract.ts` keeps a RETIRED banner for history; its
pending v1.3 tenant paste is mooted).

Response budget: media caps are unchanged (12 / 350 KB / 3 MB), so
the added b64 payload is ≤ ~4.1 MB and the whole worst-case result
measures 4.13 MB against the ~5 MB Run-script response cap —
`check_media.py`'s budget leg builds the worst case and asserts
< 4.7 MB. No runtime image-shrink fallback was added: shrinking
after links are minted would recreate the SC-4 dead-link mode.

## P3 — concurrency on the write-only loops

| Loop | v2.8 | v2.9 | Why this and no further |
|---|---|---|---|
| `For_each_img_pptx` / `_docx` | 1 | **8** | CreateFile to distinct names, no shared state |
| `For_each_patched` | 1 | **6** | ≤ 6 distinct paths, no shared state |
| `For_each_neighbor` | 1 | 1 | appends to `NeighborFiles` — variables under concurrency stay out of scope for this release |
| `For_each_file`, `For_each_id`, `For_each_sharer`, `For_each_kw` | 1 | 1 | per-file variable state / check-then-create dedup races (SharePoint has no unique constraints — `docs/SP_Adaptation_Notes.md`) |

`check_flow.py` asserts this table EXACTLY — a future designer edit
that flips a dedup loop concurrent fails CI.

## P4 — the run measures itself

There was previously no timing anywhere — nothing to say which of
the ~40 calls per doc dominates. v2.9 brackets the four per-doc
phases with `utcNow()` composes and accumulates integer milliseconds
(safe: `For_each_file` stays serial):

- `ms_extract` — `Switch_ext` (download + script call)
- `ms_classify` — `Run_prompt` … `Run_regex`
- `ms_writes` — row upsert, sidecar save, id/link + keyword loops
- `ms_related` — the whole two-phase related pipeline

`Run_summary` now reads
`library_items_seen= index_rows_seen= after_smoke_filter= processed=
errors= ms_extract= ms_classify= ms_writes= ms_related= ms_total=
smoke= related_flags=`. Divide the `ms_*` fields by `processed=` for
per-doc phase averages. Catch-path docs contribute partial phase
time (the increments live inside `Try_index`) — acceptable, and
`errors=` says how many docs to discount.

## P5 — retry discipline

No action in v2.8 carried an explicit `retryPolicy` (platform
default: 4 exponential retries, up to ~an hour of stall on a wedged
Excel session). v2.9 sets:

- **fixed / 2 × PT30S** on all seven RunScriptProd calls
  (`Zip_extract_*`, `Dump_workbook`, `Run_regex`,
  `Run_related_shortlist`, `Run_related_rank`, `Run_sidecar_patch`)
  — pure functions, retry-safe, bounded stall;
- **none** on the three raw-REST creates (`Create_idrow`,
  `Create_link`, `Create_dockw`) — a succeeded-but-timed-out POST
  retried would create a duplicate the dedup check (which already
  ran) can never catch. Failing instead drops the doc to Error and
  next run's check dedups correctly: self-healing beats silent dup
  rows. Marginally more transient Error rows, accepted.
- Reads keep connector defaults (retry-safe, want the resilience).

## What did NOT change

- **Every output byte**: sidecar format, yaml frame, related section,
  row columns — the r7 gate proves ZipTextExtract v2.2 is
  byte-identical to v2.1 on every fixture with `wantMedia` absent,
  and identical to MediaExtract v1.3 on the media side.
- **Ranking**: RelatedRank untouched; the queued `products` affinity
  fold-in stays queued.
- **Media caps**: unchanged, so the image selection set — and
  therefore every minted link — is unchanged.
- **Dedup invariants**: every check-then-create loop stays serial.
- **Nesting depth**: all new actions are siblings in existing scopes;
  the level-8 template cap the v2.8 flatten amendment documented is
  untouched (deepest actions remain `Get_neighbor_md`/`Save_patched`,
  exactly at the cap).
- **Trigger, Config knobs, PromptVersion** — v2.0 as authored in
  v2.8; **no backfill is triggered by this release** (nothing about
  the output changed, so nothing needs reindexing).

## Expected effect

- Gate phase: N Doc Index queries per run → 1 paged fetch
  (~600 fewer HTTP calls today, and the sweep stops scaling with
  library size).
- Image-bearing pptx/docx: one upload + one script call fewer each
  (~10–30 s and megabytes of request traffic per doc).
- Image/patched-sidecar saves: up to 8× / 6× fewer serial waits.
- And for the first time, `Run_summary` says where the time went —
  measure before tuning further.

## Deployment

Import-first (per the release decision): see
`review/patches/designer-edits.md` §v2_9 — prerequisites (tenant at
the §v2_7-fixes + v2.8 state, **ZipTextExtract v2.2 pasted FIRST** —
additive-safe under any flow version), then import
`flow/DocIndexSweep_v2_9.zip`, map connections, turn the old flow
off, smoke, clear SmokeFile. Ops item in the same window: **index
the `Modified` column on the source library** (FL-4 — `Get_files`
sorts on it; past ~5000 items an unindexed sort is rejected
outright, and adding the index is only cheap while the library is
small). Gate: `check_batch_r7.py` PASSED 2026-08-14; definition
lint: `check_flow.py` (now in CI).

Rollback: re-enable the v2.8 flow (or re-import
`DocIndexSweep_v2_8.zip`). ZipTextExtract v2.2 STAYS pasted through
any rollback — under v2.8 it behaves byte-identically to v2.1
(v2.8's `Extract_media_*` actions still work: MediaExtract remains
pasted on the tenant even though it is retired in-repo). No
PromptVersion change in either direction.
