# Flow v2.9 — online doc references (curated Esri help links in every sidecar)

v2.9 is v2.8 plus one feature: each indexed document's sidecar now
surfaces the best-matching entries from a new curated **Online Docs**
SharePoint list (keyword → Esri public documentation URL), as both a
machine-readable `online_docs:` yaml line and a visible
`## Online references` section. `flow/v2_9/definition.json` was
generated from the v2.8 definition and the diff is exactly the edits
below: two new top-level fetch actions, seven new per-doc actions in
front of `Sidecar_header`, the `Sidecar_header` template (one yaml
line + one body section), one `Run_summary` field, and three Config
keys (two new + the PromptVersion bump). Everything else is
byte-identical to v2.8.

`flow/DocIndexSweep_v2_9.zip` is authored the same way the v2.8 zip
was: the v2.8 package skeleton (manifests and maps byte-identical;
they carry no version strings) with the v2.9 definition as the
payload — payload byte-identical to `flow/v2_9/definition.json`,
satisfying the RL-4 zip-matches-folder rule by construction. ONE
placeholder this time, unlike v2.8's zero: the Online Docs list does
not exist yet, so `Config.OnlineDocsList` ships as
`REPLACE-WITH-ONLINEDOCS-LIST-GUID` — fill it with the real list GUID
at deploy (designer edit Y1, or edit the definition before import).
The recommended deployment remains designer edits on the live flow
(`review/patches/designer-edits.md` §v2_9, Y1–Y7), not a re-import.

**Prereq**: create the **Online Docs** list first (columns per the
feature spec: `Title`, `Url` (Hyperlink), `UrlKey`, `Summary`,
`MatchKeywords` ('; '-joined lowercase keyword titles incl. aliases),
`SurfaceScope` (Choice: Any; Pro; Experience Builder; Server;
Enterprise; Other — default Any), `CachedTextUrl`, `LastFetched`,
`FetchStatus`, `LastError`). List first, flow edits second — the new
top-level GetItems runs on every sweep, so a missing list fails the
whole run before any document is touched.

## What changed and why

### 1. Top-level fetch: `Get_onlinedocs` → `Select_od_rows` (Y1–Y2)

The sweep already snapshots the Keywords vocabulary once per run
(`Get_keywords`, the kwmeta lesson: prefetch beats per-doc queries).
The Online Docs list gets the same treatment: `Get_onlinedocs`
(GetItems, `$top` 500, list GUID from `Config.OnlineDocsList`) runs
once in the `Get_keywords` → `Get_files` chain, and `Select_od_rows`
projects each row down to the six fields the per-doc matcher needs —
`od` (item ID), `u` (the Hyperlink's Url value), `t` (Title with
quotes/backslashes stripped, the `Select_kw_yaml` sanitization),
`sum` (Summary cleaned for one-line rendering: quotes stripped,
`|` → `/`, CR/LF → space), `scope` (SurfaceScope Value, default
`Any`) and `kws` (`toLower(MatchKeywords)`). Every field is
coalesce-guarded like the existing Selects, so a half-filled curation
row degrades instead of failing the run.

### 2. Per-doc matching: `Doc_match_terms` → `Filter_od` (Y3)

Inside `If_has_text`, after `Product_row`: `Doc_match_terms` unions
the doc's AI-extracted keywords and tools plus the regex-detected
product lines (`Run_regex` `body/result/products` — the same source
`Product_row` and the `Products` column read; the prompt output has
no products field), each coalesce-guarded exactly like the existing
consumers, into one lowercased term array. The lowercasing rides a
serialize-lower-reparse round trip (`json(toLower(string(...)))` per
array — WDL has no per-element map, and JSON escape sequences are
case-safe under toLower). `Filter_od` then keeps the Online Docs rows
whose `'; '`-split `kws` intersect the term set AND whose scope fits
the doc (`scope == 'Any'` or `scope == outputs('Surface_safe')` —
the same safe-surface value the header already renders).

### 3. Rank and cap: `OD_scored` → `OD_top` (Y4)

`OD_scored` re-selects the filtered rows adding `n` = the
intersection size (the intersection expression repeats — WDL has no
let-binding), and `OD_top` takes the top
`Config.OnlineDocsTop` (5) after `reverse(sort(..., 'n'))` —
most shared keywords first. Sub-ordering among equal `n` follows
`sort`'s stable order (list/item order), which is acceptable for a
curated list of at most a few hundred rows.

### 4. Rendering: `Select_od_yaml` / `Select_od_bullets` / `OD_section` (Y5–Y6)

Mirrors the related-documents machinery:

- **`Select_od_yaml`**: each OD_top entry →
  `{"od":N,"u":"...","t":"..."}` (the `Select_kw_yaml` construction —
  `t` was already quote-stripped at `Select_od_rows`).
- **`Select_od_bullets`**: each entry →
  `- [{t}](<{u}>) — {sum} <!-- od:{od} -->` (the SidecarPatch bullet
  shape: angle-bracketed URL, em-dash annotation, trailing HTML
  comment tag).
- **`OD_section`** (Compose): the `## Online references` header, the
  `<!-- onlinedocs:begin -->` / `<!-- onlinedocs:end -->` markers,
  and the newline-joined bullets — `_None matched._` when OD_top is
  empty, the `_None yet._` pattern.

`Sidecar_header` gains exactly two template edits: the yaml line
`online_docs: [@{join(body('Select_od_yaml'), ', ')}]` immediately
after `related: []`, and `@{outputs('OD_section')}` between the
Related documents region and the `---` seam (blank-line separated
like its neighbors). This runs for ALL DocKinds — the sidecar format
stays uniform. TestPlanGen's consumption of the `online_docs:` line
is a separate change (see `testplangen/`), and its `related: [`
slice is unaffected (`online_docs: [` sits AFTER `related: [`, and
the slice matches `related: [` exactly, v2.7-verified
position-independent).

### 5. `Run_summary`: `onlineDocsRows=` (Y7)

One new field, between `smoke=` and `related_flags=`:
`onlineDocsRows=@{length(body('Select_od_rows'))}` — the size of the
fetched curation vocabulary. Per-doc match counts were considered and
rejected: `Run_summary` is per-run, the match is per-doc, and the
existing summary reads only run-level lengths and the two counter
variables — a per-doc matched-docs counter would add an
IncrementVariable inside `If_has_text` for telemetry alone. The
vocabulary size is the operationally useful tripwire (0 = empty or
mis-pointed list; the per-doc evidence lives in each sidecar).

### 6. `Config.PromptVersion` v2.0 → v2.1 (Y1)

The format change is version-gated as always: every existing row
reindexes at MaxDocsPerRun (150) per run, rewriting the corpus with
the `online_docs:` line and the `## Online references` section. The
DocIndex **AI prompt itself is unchanged** — the v2.1 bump is
format-only, no re-paste. Match-refresh semantics follow from the
gate: a doc's online references refresh whenever it reindexes (source
edit, Error retry, or this backfill), and edits to the Online Docs
list — new rows, keyword changes, scope changes — converge across the
corpus the same way: immediately for docs indexed after the edit,
and corpus-wide via any future PromptVersion bump (or by touching the
docs). No per-doc junction rows are written for online docs; the
sidecar is the only artifact, so convergence is purely reindex-driven.

## What did NOT change

- **Related section shape** — `EMPTY_STATE`, bullet shape, markers,
  seam: byte-identical. SidecarPatch (v1.6, untouched) rewrites ONLY
  the `related:` yaml line and the `<!-- related:begin/end -->`
  region, so it byte-preserves the new line and section — asserted by
  the extended `check_related.py`.
- **TestPlanGen's `related: [` slice** — `online_docs: [` does not
  match it.
- **AI Builder prompt** — text unchanged; v2.1 is format-only.
- **Scripts** — ZipTextExtract v2.1, RegexExtract v1.4, RelatedRank
  v2.1, SidecarPatch v1.6, MediaExtract, WorkbookDump: all untouched;
  no paste window.
- **Row upserts** — Create_doc/Update_doc columns unchanged; online
  doc matches live in the sidecar only.
- **Nesting** — all seven per-doc actions are direct children of
  `If_has_text` (level 4); the deepest actions stay at the cap
  untouched (the v2.8 flatten rule: no new containers around the
  neighbor/patch loops).

## Deployment

In order — see `review/patches/designer-edits.md` §v2_9 (prereq +
Y1–Y7 + smoke) — or import `flow/DocIndexSweep_v2_9.zip` (this
definition IS the payload; fill `Config.OnlineDocsList` with the real
list GUID after import, map connections, then turn the old flow OFF).
Gates: `check_related.py` and `check_format.py` PASSED 2026-08-14
(the harness now asserts the v2.9 sidecar contract). Afterwards: seed
the Online Docs list, smoke per §v2_9, let the nightly backfill run,
and update STATUS.md.

Rollback: revert Y7→Y2 in reverse and the two Y6 template edits, and
set `Config.PromptVersion` back to `v2.0` — the backfill re-converges
the corpus to the v2.8 shape. The Online Docs list may stay; nothing
else reads it. Sidecars already carrying the `online_docs:` line stay
valid through rollback: SidecarPatch treats the line and section as
opaque bytes either way.
