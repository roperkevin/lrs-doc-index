# Flow v2.3 — related documents in sidecars (ranked, reciprocal)

v2.3 is v2.2 plus the related-documents release. Every sidecar gains a
"shopping-page" style related list — a `## Related documents` body section
with linked titles and the reason for each relation, plus a machine-readable
`related:` frontmatter line — computed from shared issue-id edges and shared
canonical keywords, and kept fresh by reciprocally patching neighbor sidecars
whenever a new doc is indexed. It ships with two new script pastes:

| Piece | Version | Where |
|---|---|---|
| Flow definition | v2.3 | this folder (`DocIndexSweep_v2_3.zip` is exported from the tenant after the designer edits below are applied) |
| RelatedRank | **v1.0 (new)** | `scripts/RelatedRank.ts` |
| SidecarPatch | **v1.2 (new — shipped as v1.0, bumped by the addenda below)** | `scripts/SidecarPatch.ts` |
| AI Builder prompt | v1.2 (unchanged) | `review/patches/DocIndex_Prompt_v1_2.md` |

Supersedes v2.2 as the import target. The `PromptVersion` bump to `v1.3` is
**format-only** — the prompt text is unchanged and needs no re-paste; the bump
exists to drive the version-gated backfill (below).

## Addendum (2026-08-09) — preview-safe metadata block, PromptVersion v1.4

The v2.2 smoke checklist expected "the frontmatter renders in SharePoint's
markdown preview" — it doesn't. SharePoint's renderer has no YAML-frontmatter
support: a paragraph followed by a `---` line is a *setext heading*, so the
whole metadata block renders as one giant H2 mess above the title. Fixed by
reframing the block, not by dropping it:

- **`Sidecar_header`**: the metadata block's delimiters change from
  `---` / `---` to a fenced code block — ` ```yaml ` / ` ``` `. Every
  markdown renderer (SharePoint preview included) shows it as a tidy code
  block; the inner YAML is unchanged, so `yaml.safe_load` over the fence
  contents round-trips exactly as before, and grep/Python consumers strip
  one known fence line instead of one known dash line. The `---`
  header/body seam after the related section is untouched (a thematic
  break preceded by a blank line renders fine — only the frontmatter
  position was broken).
- **`Config.PromptVersion`**: `v1.3` → `v1.4`, format-only again — the
  prompt text is unchanged, do NOT re-paste. The bump reuses the reindex
  gate to rewrite every sidecar into the fenced frame, ~150/day until the
  corpus converges.
- **SidecarPatch v1.1** (re-paste over v1.0 in Scripts.xlsx): the patcher
  now recognizes both frames — fenced (v1.4+) and legacy `---`
  frontmatter — and preserves whichever frame a file arrived in. That
  keeps reciprocal merges landing on not-yet-rewritten neighbors during
  the backfill window; frame *conversion* stays the backfill's job, so
  the patcher remains surgical (the two patch regions only).
- No other action, script, list, or prompt change. Designer edit if not
  re-importing: replace `Sidecar_header`'s first line `---` with
  ` ```yaml `, its closing `---` (the one directly before the blank line
  and `# ` H1) with ` ``` `, and bump the `Config` literal.

Smoke check for this revision: open any rewritten sidecar in the library
preview — the metadata shows as a code block, the H1 is the first heading,
and no giant bold heading of run-together metadata appears.

## Addendum 2 (2026-08-10) — hidden machine metadata + visible table, v1.5

The v1.4 code fence rendered *correctly* but not *nicely* — a gray
scrolling block of raw YAML at the top of every doc. v1.5 splits the two
jobs the block was doing:

- **Machine metadata moves inside an HTML comment** — `Sidecar_header`
  opens with `<!--` and closes the block with `-->` in place of the
  ```` ```yaml ```` fence. SharePoint's preview hides HTML comments
  (the `<!-- related:begin/end -->` and `<!-- rel:N -->` markers have
  relied on that since v2.3), so the preview now starts cleanly at the
  H1. The inner YAML is byte-unchanged — same lines, same escaping,
  same `related:` merge state — so grep/Python consumers strip the two
  comment delimiter lines instead of the two fence lines.
- **Humans get a real metadata table** — between the source link and
  `## Summary` the template now renders a `| Field | Value |` GFM
  table: Doc ID, Revision, Target release, PE, Dev, Keywords, Tools
  (doc kind / surface / extracted / lane were already in the bold
  strip). Display-only duplication of the hidden block, written by the
  same template in the same run — it can't drift, and SidecarPatch
  never touches it (the pretty related view stays the
  `## Related documents` section).
- **`Config.PromptVersion`**: `v1.4` → `v1.5`, format-only again — do
  NOT re-paste the prompt. Rows still at v1.3 *or* v1.4 both mismatch
  and reindex, so the in-flight v1.4 backfill simply re-targets v1.5.
- **SidecarPatch v1.2** (re-paste over v1.1): `splitFrame` gains the
  comment frame — three frames now parse (`<!--` v1.5, ```` ```yaml ````
  v1.4, legacy `---`) and each file keeps the frame it arrived in.
  The body markers start `<!-- ` (with a space), so they can never be
  mistaken for the frame open; the frame close requires a bare `-->`
  line, so `-->` inside a metadata *value* can't truncate the parse.
  (A value containing `-->` could still end the comment early in a
  *renderer* — cosmetic only, and no real title/keyword carries it;
  accepted edge.)
- Designer edits if not re-importing: in `Sidecar_header` replace the
  opening ```` ```yaml ```` line with `<!--`, the closing ```` ``` ````
  line with `-->`, insert the table block after the `[Source: ...]`
  line (→ defn for the exact string), and bump the `Config` literal.

Smoke check: library preview shows title → bold strip → source link →
metadata table → summary, with no gray YAML block and no giant heading;
`grep -A17 '^<!--$' any-sidecar.md` still yields the machine YAML.

## What changed

### Sidecar template — `related:` frontmatter + `## Related documents` section

`Sidecar_header` gains two insertions (the only template changes):

- after the `tools:` line: `related: []`
- between the summary and the `---` seam:

      ## Related documents

      <!-- related:begin -->
      _None yet._
      <!-- related:end -->

The header still owns the file's only H1 (the new heading is H2), and the
`## Summary` → seam invariant is unchanged — the seam now follows the related
section. Both regions start in their empty state; they are populated only by
SidecarPatch (below), never by WDL string assembly.

Populated, the frontmatter line is one line of JSON (valid YAML flow style,
so `yaml.safe_load` round-trips) carrying doc id, sidecar filename, and score
— it doubles as the merge state for later reciprocal updates:

    related: [{"doc":17,"file":"lock-acquisition-test-plan__doc17.md","s":1003}]

and the body section renders one bullet per related doc, strongest first,
each ending in an invisible `<!-- rel:N -->` tag:

    - [Lock Acquisition Test Plan](<https://…/lock-acquisition-test-plan__doc17.md>) — shared issue ArcGISPro/ps-location-referencing#4855 · 3 shared keywords: conflict prevention, locks, routes <!-- rel:17 -->

### Ranking — RelatedRank v1.0 (new script)

After a doc's `Doc Keywords` junction rows and `Doc Links` id edges are
written, the flow issues three indexed, all-numeric queries — the doc's own
keyword links, every doc sharing those keyword ids (the documented
"two indexed queries" of the compute-on-read design), and the doc's
`LinkType='id'` edges — and hands the raw rows to RelatedRank. Scoring:

    s = 1000 × |shared issue ids| + |shared keywords|

so any id link outranks any keyword count, and a doc related both ways
collapses into a single entry with a combined "why". Sort by score, then by
item id (newer doc wins ties); cap at `Config.RelatedTopN` (5); self
excluded. Keyword ids are canonical by v2.2 construction (`Kw_id` resolves
`CanonicalRef`), so aliases never reach the ranking.

### Reciprocal freshness — SidecarPatch v1.0 (new script)

A sidecar written today can't know about related docs indexed next month —
unless its neighbors tell it. When a doc is indexed, the flow reads back the
sidecars of its top related docs and one batched SidecarPatch call patches
**all** touched files: the doc's own sidecar gets its list fully recomputed
("set" mode, patched from the in-memory header+body, no read-back), and each
neighbor gets a merge-upsert of exactly one entry — the new doc — re-sorted
and re-capped ("merge" mode). Relatedness evidence is symmetric, so the new
doc's ranked entry for a neighbor is precisely the score/reason that neighbor
needs — no per-neighbor recompute, and Run-script usage grows by exactly
**+2 calls per indexed doc** (rank + patch).

Safety posture of the patcher: only the frontmatter `related:` line (located
inside the parsed frontmatter block) and the first
`<!-- related:begin -->`/`<!-- related:end -->` region are ever rewritten.
Marker-lookalike text in extracted body content is untouched; malformed
markers → the file is returned unchanged with a note; a pre-v2.3 sidecar
with no markers gets the whole section synthesized before the seam (this is
what lets reciprocal patches land on neighbors the backfill hasn't rewritten
yet). Patching is idempotent, and unchanged files are never rewritten (the
flow checks the script's `changed` flag before `CreateFile`).

A neighbor whose sidecar is missing or moved is silently dropped from
patching (its ranking entry still appears in the new doc's own list; the
link self-heals when that doc next reindexes). A hard failure anywhere in
the related block lands inside `Try_index` — the doc goes to Error (the
`Err_detail` compose names the failing action in the run history; the
rebuilt Doc Index list has no `LastError` column, so nothing is written to
the row), and the plain sidecar (empty related state) already exists from
`Save_sidecar`.

### New flow actions

All inside `If_has_text`, chained after `For_each_kw`; expressions in
designer form under "Designer edits" below.

    Get_my_kws → Get_id_links → If_related_signals
      ├─ Select_kw_filter → Get_kw_sharers → Run_related_rank → If_has_related
      │    ├─ Select_id_filter → Get_related_docs → Reset_NeighborFiles
      │    ├─ For_each_neighbor (concurrency 1)
      │    │    Neighbor_url → Neighbor_path → If_neighbor_has_url
      │    │      Get_neighbor_md → Append_neighbor
      │    │        → Neighbor_skipped (run-after Failed/Skipped/TimedOut; drop silently)
      │    ├─ Self_meta → Self_file → Files_for_patch → Run_sidecar_patch
      │    └─ For_each_patched → If_patch_changed → Save_patched
      └─ (no signals: the template's empty state stands)

Plus top-level `Init_NeighborFiles` and Config additions. Every new
`$filter` is numeric (`DocumentId`, `KeywordId`, `DocAId`/`DocBId`, `ID`)
or the literal `'id'` — the F1 apostrophe-escaping bug class is
structurally impossible here. Cost: ~17 actions + ≤5 file reads + ≤6 file
writes + 2 Run-script calls per indexed doc; at `MaxDocsPerRun` 150 that is
~2,500 actions/run — comfortable.

### Version-gated backfill

`Config.PromptVersion` bumps `v1.2` → `v1.3`, reusing the v2.2 reindex gate:
existing rows reprocess ~150/day, each rewrite lands the new template,
computes its related list, and reciprocally patches neighbors (the
marker-missing fallback covers neighbors not yet rewritten). The related
graph self-assembles during the backfill exactly like the id-edge graph did
in v2.0.

## Install order (paste scripts first)

1. Paste **RelatedRank v1.0** and **SidecarPatch v1.2** as NEW scripts in
   Scripts.xlsx (Automate tab), exact names. Harmless to the running v2.2
   flow (nothing references them until the v2.3 import).
2. Import `DocIndexSweep_v2_3.zip` (as Update), or apply designer edits
   R1–R8 to the live flow.
3. Prompt: no change — do NOT re-paste; the v1.3, v1.4 and v1.5 bumps are
   format-only.

## REQUIRED after every import — not optional

- **Re-pick the script on `Run_related_rank` to `RelatedRank` AND on
  `Run_sidecar_patch` to `SidecarPatch`** — the package cannot carry those
  bindings (same class as the MediaExtract re-pick, which is still required
  too); the definition ships them pointed at RegexExtract as a parseable
  stand-in. Skipping breaks every related-list write.
- Re-pick `Extract_media_pptx` / `Extract_media_docx` to `MediaExtract`
  (carried from v2.1/v2.2).
- Re-verify the prompt action's model/prompt binding.
- `Get_files` pagination threshold 20000. (The rebuilt Doc Index list has
  no `LastError` column — the flow no longer writes it; error detail lives
  in the run history via `Err_detail`.)
- **Designer-verify `Neighbor_url`** (F2-class check): confirm the
  `TextFileUrl` hyperlink column surfaces as a plain URL string on your
  tenant; if it surfaces as an object, change the expression to
  `item()?['TextFileUrl']?['Url']`.

Then one smoke run (`Config.SmokeFile`) over a doc known to share keywords
with an already-indexed doc, checking: its sidecar carries a populated
`related:` line and `## Related documents` bullets; the named neighbor's
sidecar gained a reciprocal entry; a doc with no shared signals renders
`_None yet._`; `Run_summary` is sensible.

## Designer edits (applying v2.3 to the live flow without re-import)

In `If_has_text` after `For_each_kw` unless noted; expressions in designer
form. Copy exact action inputs from `flow/v2_3/definition.json` where
marked (→ defn).

- **R1 — `Config`** (top level): `PromptVersion` literal `v1.2` → `v1.3`;
  add `"RelatedTopN": 5`.
- **R2 — top level**: new Initialize variable `Init_NeighborFiles`
  (`NeighborFiles`, Array, `[]`) after `Init_ErrorCount`; repoint
  `Get_keywords`'s run-after to it.
- **R3 — `Sidecar_header`**: two insertions — `related: []` line after the
  `tools:` line, and the `## Related documents` block with begin/end
  markers before the closing `---` seam (→ defn for the exact string).
- **R4 — `Get_my_kws`** (Get items, Doc Keywords, top 50):
  `DocumentId eq @{outputs('Doc_item_id')}` — then **`Get_id_links`**
  (Get items, Doc Links, top 200):
  `(DocAId eq @{outputs('Doc_item_id')} or DocBId eq @{outputs('Doc_item_id')}) and LinkType eq 'id'`
- **R5 — `If_related_signals`** (Condition:
  `or(not(empty(body('Get_my_kws')?['value'])), not(empty(body('Get_id_links')?['value'])))`,
  Else empty). Yes branch: `Select_kw_filter` (Select, map:
  `concat('KeywordId eq ', coalesce(item()?['Keyword']?['Id'], 0))`) →
  `Get_kw_sharers` (Get items, Doc Keywords, top 500, filter:
  `if(empty(body('Select_kw_filter')), 'KeywordId eq 0', join(body('Select_kw_filter'), ' or '))`)
  → `Run_related_rank` (Run script `RelatedRank`; params selfId /
  myKwsJson / sharersJson / idLinksJson / topN → defn).
- **R6 — `If_has_related`** (Condition:
  `greater(coalesce(outputs('Run_related_rank')?['body/result/count'], 0), 0)`,
  Else empty). Yes branch: `Select_id_filter` (map `concat('ID eq ', item())`)
  → `Get_related_docs` (Get items, Doc Index, top 10, filter
  `join(body('Select_id_filter'), ' or ')`) → `Reset_NeighborFiles`
  (Set variable, `[]`) → **`For_each_neighbor`** (over
  `body('Get_related_docs')?['value']`, concurrency 1) containing:
  `Neighbor_url` / `Neighbor_path` composes, `If_neighbor_has_url`
  (`startsWith(outputs('Neighbor_path'), '/')`) whose Yes branch chains
  `Get_neighbor_md` (Get file content using path, infer type No) →
  `Append_neighbor` (append `{doc, name, content}`; content =
  `base64ToString(body('Get_neighbor_md')?['$content'])`) →
  `Neighbor_skipped` (Compose noting the skip, run-after
  Failed/Skipped/TimedOut). No Try/Catch scopes here — the branch already
  sits at the designer's maximum nesting depth of 8, so wrapping these in
  scopes would push them to level 9 and make the flow fail to save; the
  run-after chain gives the same swallow-and-continue behavior (→ defn).
- **R7 — `Self_meta` / `Self_file` / `Files_for_patch`** composes
  (→ defn) → **`Run_sidecar_patch`** (Run script `SidecarPatch`; params
  filesJson / selfId / rankedJson / docsMetaJson / selfMetaJson / topN
  → defn).
- **R8 — `For_each_patched`** (over
  `outputs('Run_sidecar_patch')?['body/result/files']`, concurrency 1):
  `If_patch_changed` (`equals(item()?['changed'], true)`) →
  `Save_patched` (Create file into `Config.TextsFolder`, name/body from
  `item()`).

Smoke test after R1–R8: same as the post-import smoke run above.

## Why this doesn't violate "keyword edges are never stored"

The `Doc Links` rule stands: no keyword edge rows are minted (the pair
explosion the SharePoint design rejected). The sidecar lists are a bounded
per-doc display cache — O(docs × 5), recomputed from the same two indexed
queries the on-read design prescribes — and they never round-trip back into
any list. See `docs/SP_Adaptation_Notes.md`.

## Verification record

`review/harness/check_related.py` (new; see `review/harness/README.md`):
all RelatedRank ranking assertions (id-over-keyword precedence, both-signal
merge, self-exclusion, tie-break, cap, malformed-input safety, why-format)
and all SidecarPatch assertions (set/merge/update/evict, idempotence,
byte-integrity outside the two patch zones against planted decoy
`related:`/seam text in the body, marker-missing fallback placement,
malformed-marker no-op) PASS; both wrapped runners type-check at ES2017.
`render_sample.py` renders the v2.3 template (empty state) and a
SidecarPatch-populated `sample_sidecar_related.md`; frontmatter round-trips
via `yaml.safe_load` in both states; one H1; marker pair well-placed.
`check_format.py` remains green (the new heading is H2; all v2.2 body
invariants unchanged).

Addendum run (2026-08-09): `check_related.py` PASS with the new frame
assertions — set mode preserves the fence, a legacy `---` neighbor still
merges with its frame preserved, the pre-v2.3 fallback keeps its `---`
frame — and `scp_v11.ts` type-checks at ES2017. `render_sample.py` PASS
rendering the fenced template in both empty and populated states;
`check_format.py` unaffected (body contract unchanged).

Addendum 2 run (2026-08-10): `check_related.py` PASS with the
three-frame assertions — set mode preserves the hidden-comment frame,
v1.4 fenced and legacy `---` neighbors each merge with their frame
preserved — and `scp_v12.ts` type-checks at ES2017. `render_sample.py`
PASS: comment frame invisible-metadata assertions, the visible
`| Field | Value |` table rows, and yaml round-trips in both empty and
populated states; `check_format.py` unaffected.
