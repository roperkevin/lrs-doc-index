# Flow v2.7 — GFM sidecar format (info-card header, collapsed metadata, devtopia issue links)

v2.7 is v2.6 plus one feature: the sidecar header moves to a
GitHub-flavored-markdown layout. The pipeline's reading surface is
now GitHub-style viewers (VS Code preview, GitHub) rather than
SharePoint's markdown preview — see the v2.7 addendum in
`docs/SP_Adaptation_Notes.md` §2 for what that supersedes.
`flow/v2_7/definition.json` was generated from the v2.6 definition
and the diff is exactly the edits below: the `Sidecar_header` inputs
string, three new helper actions in front of it, and the
`Config.PromptVersion` bump. Everything else is byte-identical to
v2.6.

`flow/DocIndexSweep_v2_7.zip` is authored the same way the v2.5/v2.6
zips were: the v2.6 package skeleton (manifests and maps
byte-identical) with the v2.7 definition as the payload — payload
byte-identical to `flow/v2_7/definition.json`, satisfying the RL-4
zip-matches-folder rule by construction. The recommended deployment
remains designer edits on the live flow, not a re-import.

**Sequencing**: this window comes AFTER the pending v2.6 window (the
RelatedRank v2.1 signature migration) — the two are separate rollback
units and must not be mixed. SidecarPatch v1.5
(`scripts/SidecarPatch.ts`, gated by `check_batch_r5.py` — same
7-param signature as v1.4) is a strict superset of v1.4 and must be
pasted BEFORE these designer edits go live; pasting it early (even
days early) is safe, while flow v2.7 running against v1.4 means every
new-format sidecar silently no-ops in the patcher.

## What changed and why

### 1. `Sidecar_header` — the GFM info-card layout

The header template (`Sidecar_header` Compose) is restructured; the
sidecar now opens:

1. **H1 title** (`# @{outputs('H1_title')}`) — the document leads
   with its name, not machine metadata.
2. **Key-value info table** — Kind · Surface, Release (em-dash when
   target_release is empty), a conditional **Issue** row (see edit
   2), the Source link, Edited (timestamp + editor), Extracted
   (date + lane). Free-text values entering table cells sanitize
   `|` → `/`; enum/date/lane values are pipe-safe by construction.
3. **Collapsed metadata** — the same fenced ```yaml block as v2.6,
   wrapped in `<details><summary>Metadata</summary>` so GFM viewers
   render it as a one-line disclosure. The blank line after
   `</summary>` and before `</details>` are LOAD-BEARING: GitHub
   won't render the fence inside `<details>` without them, and
   SidecarPatch v1.5 anchors its frame parse on the exact
   `<details><summary>Metadata</summary>\n\n```yaml\n` /
   `\n```\n\n</details>\n` byte sequences.
4. `## Summary` — unchanged, except the EMPTY case upgrades from
   `_No summary available._` to a `> [!WARNING]` alert.
5. `## Related documents` + markers + seam — byte-identical to v2.6
   (`_None yet._`, `<!-- related:begin/end -->`, `\n---\n`), so
   SidecarPatch's marker logic and TestPlanGen's `related: [` slice
   are untouched.

The yaml lines themselves are byte-identical to v2.6 apart from ONE
new line (`issues:`, edit 2) — the Q&A agent's field reads and
TestPlanGen's line-slicing survive unchanged.

### 2. Devtopia issue links surface in the sidecar

`Run_regex` has always extracted issue ids (`ids[]`: repo + number,
url-sourced rows carrying `devtopia.esri.com/{org}/{repo}/issues/{n}`
as the authoritative form) but they only fed the DocIds SharePoint
list. Three new actions put them in the sidecar:

- **`Select_issue_links`** (Select over
  `coalesce(outputs('Run_regex')?['body/result/ids'], json('[]'))`):
  each id → `[{repo}#{number}](https://devtopia.esri.com/{repo}/issues/{number})`.
- **`Select_issue_yaml`** (Select, same source): each id →
  `"{repo}#{number}"`.
- **`Issue_row`** (Compose): empty ids → `''`; else the whole
  `| **Issue** | link · link |` table row WITH trailing newline, so
  the template embeds `@{outputs('Issue_row')}` flush against the
  Source row and the row vanishes without leaving a blank table line.

The yaml block gains `issues: [@{join(body('Select_issue_yaml'), ', ')}]`
between `tools:` and `related:` — machine-readable issue refs to
match the rendered links.

Wiring: `H1_title` → `Select_issue_links` → `Select_issue_yaml` →
`Issue_row` → `Sidecar_header` (runAfter chain; `Run_regex` is
already upstream of `H1_title`).

### 3. `Config.PromptVersion` v1.8 → v1.9

The format change is version-gated: the sweep's `Check_indexed` gate
sees the stale stamp on every existing row and reindexes, rewriting
the corpus into the new layout at `MaxDocsPerRun` (150) per run.
During the transition the corpus is mixed-frame; SidecarPatch v1.5
patches whichever frame a file carries (details / fenced / dashed)
and preserves it — frame conversion happens only via this backfill.

## What did NOT change

- **Body extraction** — ZipTextExtract v2.0 and WorkbookDump v1.2
  are untouched; their output is already GFM-correct (H2+ headings,
  pipe tables) and the heading-escape contract is delicate.
- **Related section shape** — `EMPTY_STATE`, bullet shape, markers,
  seam: byte-identical, enforced by the r5 gate's equivalence leg.
- **TestPlanGen's `related: [` slice** — verified position-independent
  (`indexOf` + fixed `len('related: ')` offset 9; the wrapper adds no
  earlier `related: [`, and `issues: [` does not match it).
- **Save_sidecar / SidecarPatch bindings** — no signature or wiring
  changes; the recompose at the patch call still concatenates
  `Sidecar_header` + `DocText`.

## Deployment (in order; one window for the flow edits)

1. Complete the pending v2.6 window first (STATUS open action 6).
2. Paste `scripts/SidecarPatch.ts` (v1.5) into the Automate workbook
   — safe any time before the flow edits (gate
   `check_batch_r5.py` PASSED 2026-08-13).
3. Apply designer edits per `review/patches/designer-edits.md`
   §v2_7, in order (the paste-exact header template with its
   blank-line checklist, the three helper actions, the PromptVersion
   literal).
4. Smoke run (Config → SmokeFile): download the smoke sidecar, diff
   its header shape against `review/harness/sample_sidecar.md`
   (regenerate with `python3 render_sample.py`), and eyeball it in a
   GFM viewer — H1 first, info table, collapsed Metadata, working
   devtopia link when the doc has an issue ref.
5. Let the nightly runs backfill the corpus (~150 docs/run); the
   run summaries show the reindex volume.
6. Paste `agent/QA_Agent_Instructions_v1_2.md` into the Q&A agent,
   re-run `agent/QA_Smoke_Questions.md`.
7. TestPlanGen: paste prompt v1.4 + the §testplangen-v2_8 banner
   edit (its own small window; see `testplangen/CHANGES.md` v2.8).
8. Update STATUS.md (flow row, PromptVersion row, SidecarPatch
   paste column, TestPlanGen row).

Rollback: revert the §v2_7 designer edits (the list is reversible
top-to-bottom) and set `Config.PromptVersion` back to `v1.8` — the
backfill then converges the corpus back to the v2.6 shape.
SidecarPatch v1.5 may STAY pasted through any rollback: it is
byte-equivalent to v1.4 on every pre-v2.7 frame.
