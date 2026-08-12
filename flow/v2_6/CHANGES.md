# Flow v2.6 — related-ranking overhaul (RelatedRank v2.0 → v2.1 wiring)

**r4 amendment (2026-08-12)**: before this definition was ever
applied, RelatedRank moved on to **v2.1** (`scripts/RelatedRank.ts`,
gated by `check_batch_r4.py` — same 11-param signature as v2.0), and
the authored v2.6 definition was amended in place to carry the two
r4 additions: `Self_rank_meta` gains a `"title"` line
(`@{outputs('Doc_title')}` — the same value the Doc Index row's
Title gets, feeding v2.1's title-token affinity) and the
`Config.RelatedWeights` literal gains
`"title":{"weight":0.4,"cap":6}`. `DocIndexSweep_v2_6.zip` was
re-cut the same way (payload byte-identical to this folder; every
other zip entry byte-identical to the original cut). The deployment
window below is unchanged in shape — it now pastes v2.1 instead of
v2.0; a tenant that already applied the window with v2.0 pastes
v2.1 alone and adds the two deltas (see
`review/patches/designer-edits.md` §v2_6, r4 amendment). Everything
else in this document reads as written, with "v2.0" as the wiring
generation v2.6 was designed against.

v2.6 is v2.5 plus one feature: the related-documents branch feeds and
drives RelatedRank v2.0 (`review/patches/RelatedRank_v2_0.ts`, gated
by `check_batch_r3.py`). Everything outside `If_related_signals`, the
two `Get_my_kws`/`Get_id_links` queries, `Config`, the init chain and
`Run_summary` is byte-identical to v2.5 —
`flow/v2_6/definition.json` was generated from the v2.5 definition
and the diff is exactly the edits below.

`flow/DocIndexSweep_v2_6.zip` is authored the same way the v2.5 zip
was: the v2.5 package skeleton (manifests and maps byte-identical,
connection display names already scrubbed) with the v2.6 definition
as the payload — payload byte-identical to
`flow/v2_6/definition.json`, satisfying the RL-4 zip-matches-folder
rule by construction. The usual import caveat carries over verbatim
from the v2.5 row: post-import verification needed, in particular
re-picking the Office Script on every Run-script action
(`Extract_media_*`, `Run_regex`, `Dump_workbook`,
`Run_related_shortlist`, `Run_related_rank`, `Run_sidecar_patch`) —
the recommended deployment remains designer edits on the live flow,
not a re-import.

**The script paste and these flow edits are ONE maintenance window.**
RelatedRank v2.0 changed its signature (11 parameters, new names);
the v2.5 flow's `Run_related_rank` binding errors against it, and
this definition errors against v1.3. Paste the script, then apply
the designer edits (`review/patches/designer-edits.md` §v2_6), then
smoke — never let a daily run land between the two.

## What changed and why

### 1. All Doc Links edge types reach the scorer

`Get_id_links` (name kept — it's referenced everywhere and renaming
actions in the designer breaks `outputs()` expressions) drops the
`and LinkType eq 'id'` clause from its `$filter`. RelatedRank v2.0
weights each type from config (id 1000, review 100, gantt 60,
titlematch 40; unknown types are ignored), so the day Flow #2 starts
minting gantt/titlematch edges they rank with zero further changes.
Until then the query returns the same id rows it always did.

### 2. Two-phase rerank: shortlist → fetch metadata → final

Candidate metadata (DocKind, Surface, TargetRelease, PE, Dev,
SourceModified) lives on Doc Index rows, which v2.5 only fetched
AFTER ranking. v2.6 splits ranking in two:

- **`Run_related_shortlist`** (new): RelatedRank in mode
  `"shortlist"` — edges + keywords only, top `RelatedShortlist` (12)
  candidates.
- **`Get_cand_docs`** (replaces `Get_related_docs`): fetches the
  shortlist's Doc Index rows — same query shape, `$top` now
  `RelatedShortlist` instead of the old silent 10.
- **`Run_related_rank`** (moved inside `If_has_related`, after
  `Get_cand_docs`): mode `"final"` — re-scores the shortlist with
  metadata affinity + pair-min recency, caps at `RelatedTopN` (5).
- **`Filter_final_docs`** (new): `Get_cand_docs` rows whose ID made
  the final cut; `For_each_neighbor` and SidecarPatch's
  `docsMetaJson` now read this, so the neighbor loop stays ≤ topN
  reads exactly as before.

Net cost per related-eligible doc: +1 Run script, +1 GetItems
(`Get_kw_meta`; `Get_cand_docs` replaces `Get_related_docs`).

### 3. Keyword metadata + the DX-2 alias fold

New **`Select_kwmeta_canon`** / **`Select_kwmeta_alias`** /
**`Get_kw_meta`**: one Keywords-list query
(`ID eq {k} or ... or CanonicalRefId eq {k} or ...`) returning my
canonicals' `Kind` (topic/tool/product weighting) plus any alias
rows still pointing at them. New **`Select_kw_filter_meta`** feeds
those alias ids into `Get_kw_sharers`' filter (via `union()`, which
dedupes the repeated canonical clauses), and the script folds
alias-id sharer rows onto their canonical — pre-curation junction
rows (REVIEW_v2_5 DX-2) count toward overlap again, until the
librarian backfill re-points them for real.

### 4. Ceilings into Config + truncation detection

`Get_my_kws` / `Get_kw_sharers` / `Get_id_links` `$top` now read
`Config.MyKwsTop` (100, was 50), `Config.SharersTop` (2000, was
500), `Config.LinksTop` (200, unchanged). The same numbers ride
into the script inside `RelatedWeights.tops`, and the script
returns `flags` naming any input that arrived at its ceiling. A new
`RelatedFlags` variable (`Init_RelatedFlags`, appended per doc by
**`Append_related_flags`**) surfaces them in `Run_summary` as
`related_flags=` — the README's "the `$top` ceiling is the knob"
is now a tripwire you can read in run history, not just a note.
Keep the two copies of the numbers in sync when tuning.

### 5. `Config.RelatedWeights` — tuning without a paste

Every weight the scorer uses, as one JSON string literal:
per-edge-type weights, keyword-kind multipliers, metadata affinity
bonuses, recency weight/half-life, the 999 soft cap, the ceilings.
Absent / garbage / partial → the script's identical in-script
defaults (deep-merged per key). Retuning is a designer edit to one
Config literal. The default keeps the v1.3 contract: soft signals
cap at 999, so an id link still structurally outranks any keyword /
metadata / recency pile.

### New Config keys

| Key | Value | Consumed by |
|---|---|---|
| RelatedShortlist | 12 | shortlist topN, `Get_cand_docs` `$top` |
| MyKwsTop | 100 | `Get_my_kws` `$top` |
| SharersTop | 2000 | `Get_kw_sharers` `$top` |
| LinksTop | 200 | `Get_id_links` `$top` |
| RelatedWeights | JSON string | both Run-script calls' `configJson` |

## What did NOT change

- **SidecarPatch stays v1.4** — it renders `why` verbatim and
  treats `s` as an opaque number; `rankedJson`/`selfMetaJson`
  bindings are untouched, `docsMetaJson` just reads
  `Filter_final_docs` instead of `Get_related_docs`.
- **No PromptVersion bump, no backfill, no agent-instruction
  bump.** Scores and `why` prose change, but the sidecar FORMAT
  (fenced frame, `related:` inline-JSON line, tagged-bullet shape)
  does not — README keys the bump to prompt text or format changes.
  Verified downstream: TestPlanGen line-slices `related: [` and
  relies only on score-descending order (both preserved); the Q&A
  agent instructions describe the section generically. Old-scale
  and new-scale scores share the 1000 floor, so reciprocal merges
  against stale neighbor entries stay sane and self-heal on
  reindex.
- **Edge minting** — unchanged; the sweep still mints only
  LinkType `id`. Gantt/titlematch minting remains Flow #2's job.
- Scores may drift day-to-day by the recency term's decay (day
  granularity, pair-min) — a reindexed doc's `s` can differ from
  the value a neighbor's sidecar cached. Accepted: merge mode
  replaces entries per doc id, so lists converge on every touch.

## Deployment (one window, in order)

1. Confirm the r2 six-script paste already happened (STATUS.md open
   action; the r3 gate assumes scripts/ == r2).
2. Paste `scripts/RelatedRank.ts` (v2.0) into the Automate workbook.
3. Apply designer edits per `review/patches/designer-edits.md`
   §v2_6, in order.
4. Smoke run (Config → SmokeFile) on a doc with keywords: expect
   the sidecar's Related section unchanged in shape, and
   `related_flags=` (usually empty) in `Run_summary`.
5. Full run next day; update STATUS.md. (The import zip is already
   authored in-repo — see above; optionally refresh it from the
   live export after application if the applied flow drifts from
   the authored definition, and record any drift RL-4-style.)

Rollback: re-paste `review/patches/RelatedRank_v1_3.ts` and revert
the designer edits (the §v2_6 list is written to be reversible
top-to-bottom).
