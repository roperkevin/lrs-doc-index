# Doc Index System — Release v2.7 (deployed) / v2.8 (authored)

> Deployed-version questions? `STATUS.md` is the single
> source-of-truth table (scripts, prompts, components, open actions).

Everything the document-indexing pipeline needs, in one bundle.
Current as of 2026-08-13. The system: a daily Power Automate flow
sweeps the LocationReferencing Documents library, extracts text
in-script, classifies and keywords each doc via AI Builder, mints
issue-ID rows and doc-to-doc edges, writes markdown sidecars with
images — filed into per-kind subfolders, stamped with the source
document's author/editor/last-edited trail and product lines — and
cross-links each sidecar to its related documents.

## Flow v2.8 (authored) at a glance

Authored from the 2026-08-13 live export (`flow/v2_8/CHANGES.md`):
the sidecar's yaml metadata block moves inside an HTML comment
(`<!-- metadata` ... `-->`) so **no renderer displays it** — readers
see only the H1 + info table header; machine consumers keep the same
yaml lines. Extracted bodies become **code-aware**: pasted Arcade/JS
scripts render as fenced code blocks (```arcade) and code-shaped
bullets as inline code (ZipTextExtract v2.1). Documents are
**categorized by product line** — Roads & Highways, Pipeline
Referencing, Utility Network — detected deterministically from
filename/title/text acronyms (RH, APR, UN, UNAPR, ADMRH) and full
names (RegexExtract v1.4), surfaced as an info-table Product row, a
`products:` yaml line, and a new Doc Index `Products` column. The
same round records the §v2_7-fixes: four designer mis-picks and the
stuck SmokeFile found in the live export (STATUS open action 1 —
until FX-5 clears it, the v1.9 backfill is stalled and the corpus
keeps the old yaml-on-top layout).

## Bundle contents

| Path | What | Version |
|---|---|---|
| flow/v2_5/definition.json | Flow definition (previous deployed baseline) | v2.5 |
| flow/v2_6/definition.json | Flow definition (authored; window applied on tenant per the 2026-08-13 export) | v2.6 |
| flow/v2_7/definition.json | Flow definition (authored; window applied on tenant per the 2026-08-13 export — with the mis-picks listed in designer-edits §v2_7-fixes) | v2.7 |
| flow/v2_7_fix/definition.json | Repair-only flow definition (the 2026-08-13 live export + §v2_7-fixes, still PromptVersion v1.9 — deploy the fixes WITHOUT the v2.8 format change; superseded by v2.8, which contains the same fixes) | v2.7-fix |
| flow/v2_8/definition.json | Flow definition (authored FROM the 2026-08-13 live export — real tenant bindings + §v2_7-fixes + hidden metadata comment frame, Product row/column, PromptVersion v2.0) | v2.8 |
| flow/DocIndexSweep_v2_5.zip | Import package (v2.4 package skeleton + the v2.5 definition, real script bindings as of 2026-08-10; post-import verification still needed) | v2.5 |
| flow/DocIndexSweep_v2_6.zip | Import package (v2.5 package skeleton + the v2.6 definition, payload byte-identical to the folder; post-import verification still needed — re-pick every Run-script action) | v2.6 |
| flow/DocIndexSweep_v2_7.zip | Import package (v2.6 package skeleton + the v2.7 definition, payload byte-identical to the folder) | v2.7 |
| flow/DocIndexSweep_v2_7_fix.zip | Repair import package (live-export skeleton, PV-1 scrubbed, + the v2.7-fix definition — payload byte-identical to the folder) | v2.7-fix |
| flow/DocIndexSweep_v2_8.zip | Import package (the 2026-08-13 live export's OWN skeleton, PV-1 scrubbed, + the v2.8 definition — payload byte-identical to the folder) | v2.8 |
| scripts/RegexExtract.ts | ID + revision extraction + title slug + product-line detection (RH / Pipeline Referencing / Utility Network) | v1.4 (paste pending) |
| scripts/ZipTextExtract.ts | pptx/docx → markdown text + rels + core properties + content-aware code fencing + diagram-label collapse | v2.4 (deployed — the local sweep runs it directly) |
| scripts/MediaExtract.ts | Bounded raster image extraction | v1.3 (paste pending) |
| scripts/SlideFigures.ts | pptx slide diagrams → standalone SVG figures (vector slides rendered from true coordinates; raster slides redrawn from the slide's stated topology + measures; UI screenshots — PNG in every variant, baseline JPEG, GIF, BMP — as standardized wireframes, with real OCR'd text when the sweep's Tesseract lane feeds transcriptions in) | v2.4 (deployed — the local sweep runs it directly) |
| scripts/WorkbookDump.ts | xlsx → GFM table dump | v1.2 (paste pending) |
| scripts/RelatedRank.ts | Related-doc scoring/ranking (all edge types, keyword kinds, metadata affinity + title-token affinity, PE/Dev name-set matching, recency, total id dominance, config-driven weights) | v2.1 (**pasted** — evidenced by the 2026-08-13 export) |
| scripts/SidecarPatch.ts | Surgical related-section patching (four metadata frames) | v1.6 (paste pending — safe any time before the v2.8 window) |
| review/patches/DocIndex_Prompt_v1_2.md | AI Builder prompt (superseded by v1.3) | v1.2 |
| review/patches/DocIndex_Prompt_v1_3.md | AI Builder prompt (current — pasted 2026-08-11 with PromptVersion → v1.8) | v1.3 |
| review/patches/ZipTextExtract_v1_9.ts | Script batch patch (gated, pasted + promoted 2026-08-11) | v1.9 |
| review/patches/MediaExtract_v1_2.ts | Script batch patch (gated, pasted + promoted 2026-08-11) | v1.2 |
| review/patches/RelatedRank_v1_2.ts | Script batch patch (gated, pasted + promoted 2026-08-11) | v1.2 |
| review/patches/SidecarPatch_v1_3.ts | Script batch patch (gated, pasted + promoted 2026-08-11) | v1.3 |
| review/patches/RelatedRank_v2_0.ts | r3 patch (gated; superseded in-repo by v2.1 before its paste) | v2.0 |
| review/patches/RelatedRank_v2_1.ts | r4 patch (gated + promoted 2026-08-12; pasted with the v2.6 window per the export evidence) | v2.1 |
| review/patches/ZipTextExtract_v2_1.ts | r6 patch (gated + promoted 2026-08-13; superseded in-repo by v2_2 before its paste — the v2.2 gate's old-side artifact) | v2.1 |
| review/patches/ZipTextExtract_v2_2.ts | Diagram-label collapse (gated + promoted 2026-09-03; no paste — the local sweep runs `scripts/` directly; replaces the pending v2.1 paste on rollback) | v2.2 |
| review/patches/RegexExtract_v1_4.ts | r6 patch (gated + promoted 2026-08-13; paste with the v2.8 window) | v1.4 |
| review/patches/SidecarPatch_v1_6.ts | r6 patch (gated + promoted 2026-08-13; safe to paste any time before the v2.8 window) | v1.6 |
| prompts/DocIndex_Prompt.md | AI Builder prompt (deployed copy) | v1.3 |
| prompts/KeywordCuration_Prompt.md | Keyword curation prompt (deployed copy) | v1.0 |
| prompts/TestPlanGen_Prompt.md | Test-plan generation prompt (deployed copy; tenant paste pending — v1.7 sweeps every related-plan case for applicability) | v1.7 |
| schemas/SPList_*.csv | The six list definitions (lrsworkspace) | — |
| docs/SP_Adaptation_Notes.md | Architecture + SharePoint quirks | — |
| docs/Diagram_Style_Framework.md | The one visual language for slide diagrams: palette, hue-family colour mapping, geometry-led roles, component standardisation | v1.0 |
| agent/QA_Agent_Instructions_v1_1.md | Q&A agent instructions (Copilot Studio; deployed) | v1.1 |
| agent/QA_Agent_Instructions_v1_3.md | Q&A agent instructions (authored — describes the v2.8 layout + products; supersedes the unpasted v1.2; paste with the v2.8 window) | v1.3 |
| agent/QA_Agent_Setup.md | Q&A agent deployment guide | current (component v1.1) |
| agent/QA_Smoke_Questions.md | Q&A agent verification suite | v1.0 |
| curation/Curation_Setup.md | Curation flow build + deploy guide | current (component v1.1) |
| curation/flow/v1_1/definition.json | KeywordCuration flow definition (authored from the guide, not a tenant export; AI Builder prompt binding is a placeholder — re-pick on import) | v1.1 |
| curation/CHANGES.md | Curation release notes | v1.1 |
| testplangen/TestPlanGen_Setup.md | Generation flow build + deploy guide | current (component v2.7) |
| testplangen/TestPlanGen_Smoke.md | Generation verification suite | v1.6 |
| testplangen/TestPlanGen_v1_0.zip | Generation flow import package (authored re-cut; post-import checks I1–I4 needed) | v2.0 (filename frozen at v1_0) |
| testplangen/flow/v1_0/definition.json | Generation flow definition (package payload) | v2.0 (dirname frozen at v1_0) |
| testplangen/TestPlanGenCore_v1_0.zip | Agent-ready child-flow import package | v2.0 (filename frozen at v1_0) |
| testplangen/flow/core_v1_0/definition.json | Child-flow definition (package payload) | v2.0 (dirname frozen at v1_0) |
| testplangen/TestPlanGenAgentFlow_v1_0.zip | Agent-flow package — shape reference only; superseded, build in Copilot Studio per Agent_Setup §1c | v1.0 |
| testplangen/flow/agent_v1_0/definition.json | Agent-flow definition (contract reference) | v1.0 |
| testplangen/flow/lookup_v1_0/definition.json | StoryLookupFlow definition (issue-#/title → doc id; contract reference, build in Copilot Studio per Agent_Setup §1d) | v1.0 |
| testplangen/StoryLookupFlow_v1_0.zip | StoryLookupFlow import package (authored re-cut; agent-flow import caveat, Agent_Setup §1d) | v1.0 |
| testplangen/agent/TestPlanGenAgent/ | Importable Copilot Studio agent (front-end) | v1.8 |
| testplangen/agent/Agent_Setup.md | Agent import + flow-wiring guide | v1.0 |
| testplangen/Local_TestPlanGen_Plan.md | Local generation job — design record + phased build order (phase 1 shipped as v2.16) | — |
| testplangen/CHANGES.md | Test-plan generation release notes | v2.16 |
| pad/PAD_Setup.md | PAD compute-offload build + deploy guide (Run-script quota workaround) | v2.1 |
| pad/flow/DocIndexCompute.robin.txt | PAD desktop flow (paste-ready Robin; quick-run + batch modes) | v2.2 |
| pad/runner/run_job.mjs | Node runner — executes `scripts/` verbatim, all nine Run-script contracts; batch job files + single-op CLI | v2.0 |
| pad/runner/xlsx_grid.mjs | xlsx → text grids for WorkbookDump's workbook mock | v1.0 |
| pad/harness/check_pad_runner.py | PAD runner gate (generated fixtures + wrap.py parity leg + single-op leg; CI) | v1.1 |
| pad/samples/job.sample.json | Fixture-free smoke job | — |
| pad/CHANGES.md | PAD offload release notes | v2.2 |
| pad/runner/ops.mjs | Shared script-loader/op-dispatch (used by the PAD runner and the local sweep) | v2.4 |
| local/Local_Setup.md | Local sweep build + deploy guide — the whole sweep off Power Automate (SharePoint stays) | v1.0 |
| local/sweep.mjs | Local sweep orchestrator — flow v2.8 reimplemented over Graph + direct LLM API + synced libraries | v1.0 |
| local/auth.mjs | Delegated device-code sign-in (Microsoft pre-registered public clients — no Azure app registration) | v1.0 |
| local/graph.mjs | Microsoft Graph list client + SPO REST fallback for hyperlink columns (device sign-in default, client-credentials optional; list GUIDs from config) | v1.2 |
| local/probe.mjs | Per-field Graph write probe (diagnostic) | v1.0 |
| local/llm.mjs | AI-step client — default: the cloud flow's own AI Builder prompt via the Dataverse Web API (same model/prompt/credits); alternative: direct Anthropic API; since v1.4 also `generateText` (raw-markdown generation for testplangen.mjs) | v1.4 |
| local/harness/check_local_sweep.py | Local sweep gate (mock Graph + mock Dataverse Predict + mock Anthropic + mock device-code auth; dry/live/idempotency/provider/auth legs; CI) | v1.3 |
| local/config.sample.json | Machine config template (copy to git-ignored local/config.json) | — |
| local/CHANGES.md | Local sweep release notes | v1.0 |
| local/svg2pptx.mjs | Figure SVGs → editable PowerPoint shapes (pull sweep figures into review decks: one native, grouped, restyleable figure per slide, titled with its case heading + source document, the case's tables as native editable tables, sidecar metadata line; zero dependencies) | v1.3 |
| local/harness/check_svg2pptx.py | svg2pptx gate (full SlideFigures vocabulary fixture; package/shape/style/label/title-band/case-table contract + sidecar lookup legs + python-pptx open leg; CI) | v1.3 |
| local/lib/*.mjs | The sweep's shared modules: util, doclinks, presentation, bodyindex, statuspage, indexpages, alerts, config (v1.31 split) + msg (CFB/.msg parser, v1.37), embedindex (embedding relatedness, v1.38), remotefs (no-OneDrive mode, v1.39), draftlint (in-process TestPlanGen draft-contract lint, testplangen v2.16) | — |
| local/testplangen.mjs | **TestPlanGenCore as a local on-demand job**: story guard, related-line lanes, one model call (tenant AI Builder prompt via Dataverse Predict, or `prompts/TestPlanGen_Prompt.md` verbatim via Anthropic), fail-closed marker slice, contract-lint verifier, timestamped draft to Shared Documents/Test Plan Drafts (Local_Setup §11; `testplangen/CHANGES.md` v2.16) | v1.0 |
| local/harness/check_testplangen.py | Generation-job gate (mock Graph + mock Predict + mock Anthropic; guard/lanes/caps/fail-closed/verifier legs incl. draftlint↔Python agreement; CI) | v1.0 |
| local/Hosted_Runner.md | Remote-files mode + hosted GitHub Actions sweep — setup, prerequisites, and the credentials policy decision | v1.39 |
| local/gantt.mjs | **Flow #2 as a local job**: Gantt schedules → Issue Refs rows + gantt/titlematch edges (IssueKey/LinkKey dedup, ambiguity-guarded title matching; dry-run default) | v1.0 (first live run pending — STATUS action 13c) |
| local/run_heartbeat.cmd | Dead-man scheduled task: `sweep.mjs --check-heartbeat` alerts when no successful sweep is recorded within `alerts.maxSilentHours` | — |
| review/harness/check_typecheck.py | Standing ES2017 tsc gate over scripts/ (its own CI job) | v1.0 |
| STATUS_history.md | The per-day STATUS narratives, moved out of STATUS.md's head (2026-09-03) | — |

Older flow versions (`flow/v1_9/` — the pre-v2.0 baseline, moved from
`flow/definition.json` in review round r2 — `flow/v2_0/`,
`flow/v2_1/`, `flow/v2_2/`, `flow/v2_3/`, `flow/v2_4/` and their
zips) remain for provenance; see each `CHANGES.md`. All import zips
were re-cut 2026-08-11 with the connection display name (a personal
email) scrubbed from their manifests — payloads byte-identical, see
the r2 PV-1 addenda.

Retired, not included: TagStrip (superseded by ZipTextExtract; the
script may remain in Excel harmlessly). Issue Refs list is present
and empty until its feeder — flow #2, now built as the local job
`local/gantt.mjs` — gets its first live run (verify the list GUID on
tenant first; STATUS action 13c).

## Flow v2.5 highlights (cumulative)

Sidecar identity = row id (v2.5): the sidecar filename's `__docNN`
and its `doc_id:` metadata line are now minted from the document's
Doc Index **row id** — the number in the list's ID column, the same
id the edges, `related:` entries, and TestPlanGen already used —
instead of the source library file's item id, a different number
that only looked interchangeable (the fix for feeding a sidecar's
`doc_id` to the TestPlanGen agent and landing on the wrong row).
The row upsert now runs before the sidecar write, a `Set_text_url`
update patches `TextFileUrl` back after the save, and the error
catch is duplicate-proofed. The v2.5 PromptVersion bump (to `v1.7`;
Config has since moved to `v1.8` with the 2026-08-11 prompt v1.3
paste — see the Runbook) is format-only and drives the converging backfill
that renames the corpus to row-id names — until a sidecar migrates,
its `doc_id` may still be the old file id, so the list's ID column
stays authoritative; see `flow/v2_5/CHANGES.md`. Plus the v2.4 base:
kind-routed sidecars + source authorship: every sidecar now
lands in a per-DocKind subfolder of the library (`Test Plans/`,
`User Stories/`, `Design Spikes/`, `Data Templates/`, `Schedules/`,
`Doc Reviews/`, `Other/` — the `Config.KindFolders` map is the source
of truth), the row's `TextFileUrl` follows, a reindex that changes a
sidecar's path recycles the old copy, and reciprocal related-list
patches write each neighbor back to its own folder (SidecarPatch v1.2
passes the folder through); inline image links are minted as
`../media/...` since sidecars sit one level below the shared media
folder. Each document's authorship trail — author, last editor,
last-edited time — is read from the file's own OOXML core properties
(ZipTextExtract v1.8; survives re-uploads that reset SharePoint's
Created/Modified By) with library metadata as fallback, and stored as
`author:`/`last_edited_by:`/`last_edited:` metadata lines, a header
"Last edited" strip segment, and three new Doc Index columns
(`SourceAuthor`/`SourceEditor`/`SourceEdited`). The PromptVersion bump
(now `v1.6`) is format-only (no prompt re-paste) and drives the
converging backfill that migrates the corpus into the subfolders — see
`flow/v2_4/CHANGES.md`. Plus the v2.3 base:
related documents in every sidecar: a `## Related documents`
section plus a machine-readable `related:` metadata line — top 5,
shared-issue-id edges outrank keyword overlap, each entry linked to
the neighbor's sidecar with the reason for the relation; when a new
doc is indexed, its neighbors' existing sidecars are reciprocally
patched (marker-delimited, idempotent) so old docs learn about new
arrivals; the PromptVersion bump (`v1.3`, with addendum bumps
`v1.4`/`v1.5`) is format-only (no prompt re-paste) and drives the
converging backfill — see `flow/v2_3/CHANGES.md`. Preview-safe metadata (v2.3 addendum): the
sidecar's YAML metadata block is framed as a fenced ` ```yaml ` code
block instead of `---` frontmatter — SharePoint's markdown preview
has no frontmatter support and rendered the old block as one giant
heading; SidecarPatch v1.1 parses both frames and preserves each
file's frame while the `v1.4` backfill converts the corpus. Plus the
v2.2 base: rich markdown sidecars named `{title-slug}__doc{ID}.md`
(slug from the AI title via RegexExtract v1.2; fallback: slugified
source name) with a fenced YAML metadata block, clean H1, metadata
strip and AI summary; pptx bodies with slide-title headings, interleaved
`### Notes` and nested lists; docx heading/list structure; xlsx as
GFM tables; version-gated reindex (PromptVersion mismatch triggers
a converging backfill — see `flow/v2_2/CHANGES.md`). Plus the
v1.9–v2.1 base: backfill mode (SmokeFile knob shipped empty,
MaxDocsPerRun 150); media pipeline (inline image links + saved
files, safe-degrading); OData apostrophe escaping on both
free-text filters (the what'snew fix); retry-aware gate (Error
rows self-heal); hardened trim/toLower smoke filter; the nine
review designer edits (v2.0) and createArray hardening (v2.1);
all GUIDs and script references real — zero placeholders, imports
break nothing.

## Q&A agent (v1.0)

The corpus answers questions now: a Copilot Studio agent, **LRS Doc
Index Q&A**, grounded on the sidecar library and published to Teams
(`agent/QA_Agent_Setup.md`). It grounds on the sidecars, not the raw
source library — clean markdown with AI summaries and metadata beats
binary decks for retrieval, and every sidecar carries `source_url`,
so answers cite the original file through it. Read-only over the
corpus: no flow, script, schema, or prompt changes, and instruction
bumps (`agent/QA_Agent_Instructions_v1_1.md`) never touch
`Config.PromptVersion`. Deployment is portal work in the
designer-edits mold — numbered steps, a check after each, then the
smoke suite (`agent/QA_Smoke_Questions.md`), recorded in
`agent/CHANGES.md`.

## Keyword curation (v1.0)

The vocabulary curates itself — with a human veto: a second, tiny
flow, **KeywordCuration** (built from `curation/Curation_Setup.md` —
no import package; new flows have no skeleton), runs Saturdays 08:00
Mountain, makes ONE AI Builder call over the full canonical
vocabulary (`prompts/KeywordCuration_Prompt.md`), and writes
merge proposals onto the Keywords rows via two new flow-owned columns
(`CurationStatus`, `ProposedCanonical` — see the updated
`schemas/SPList_Keywords.csv`). It never writes `CanonicalRef`: a
human approves from the **Curation queue** view by setting the lookup,
rejects by setting `Rejected` (never re-proposed), and the flow clears
approved rows' state on its next run. A digest lands in **Shared
Documents** — deliberately outside the LRS Doc Index library so the
Q&A agent never ingests it. Proposals are validated against real rows
(hallucinations dropped and counted), and the whole run degrades to
zero proposals on a malformed model reply.

## Test-plan generation (v1.0)

The catalog drafts test plans now — with a human gate: a third,
on-demand flow, **TestPlanGen** (import
`testplangen/TestPlanGen_v1_0.zip` with post-import checks I1–I4, or
build from `testplangen/TestPlanGen_Setup.md` §3 — the package is an
authored re-cut, so import validation plus the smoke suite is its
real gate), runs from the Doc Index list's Automate menu on a
selected **User Story** row. It reads the story's sidecar, follows
the sidecar's machine-readable `related:` line to gather context
(adjacent stories as a summary digest; related Test Plans as full
style/coverage exemplars, with an exact
`DocKind eq 'Test Plan' and Surface eq ...` query as fallback), and
makes ONE AI Builder call
(`prompts/TestPlanGen_Prompt.md`) that returns a complete
markdown draft — every test case carrying a mandatory Trace line back
to a story statement or exemplar pattern, every gap surfaced as a
`[VERIFY]` item instead of an invention. Since prompt v1.2 the draft
must also cover every workflow, pathway, and event type the story
enumerates (the enumeration-coverage rule) and carries conditional
`Automation Notes` / `Documentation Impacts` sections when the story
has such plans — the doc 1 coverage review
(`review/REVIEW_TestPlanGen_doc1_coverage.md`) is why. Since v2.0 the
flow also routes related Test Plans by surface: same-surface plans
stay style/coverage exemplars, while cross-surface plans feed a fifth
prompt input — REFERENCE FUNCTIONALITY — that the model may ground
expected behavior on (input methods, field semantics), with cited
Traces, a surface-parity `[VERIFY]`, and no tool-name carryover. The draft lands timestamped
in **Shared Documents/Test Plan Drafts/** — deliberately outside the
LRS Doc Index library so the Q&A agent never ingests unreviewed
drafts. A PE reviews, finalizes into the team's normal format, and
uploads to the source library, where the nightly sweep indexes the
finished plan and RelatedRank links it back to its story — the loop
closes through the existing pipeline, with zero sweep, script,
schema, or `Config.PromptVersion` changes. A malformed model reply
fails closed: no markers, no file. Since v1.1 the flow also has a
conversational front door: **LRS Test Plan Generator**, a thin
Copilot Studio agent shipped as an importable file set
(`testplangen/agent/TestPlanGenAgent/`, wired per
`testplangen/agent/Agent_Setup.md` — which also splits the flow into
a child flow so the list menu and the agent share one body). The
agent takes a story reference in chat — its item id, its devtopia
issue number, or words from its title (issue and title references
resolve to an id through `StoryLookupFlow`'s deterministic list
queries: the Doc IDs list for issues, a title contains-match over
indexed User Story rows) — runs the flow, and relays the draft
location; it has no knowledge sources and never drafts content
itself — corpus questions stay with LRS Doc Index Q&A (optional and
independent: nothing in test-plan generation requires the Q&A agent
to be deployed). Since v2.16 generation also runs on the LOCAL stack:
`local/testplangen.mjs` (Local_Setup.md §11) reimplements the core
flow's semantics over Graph + the same AI Builder prompt (or the repo
prompt verbatim via the Anthropic lane), machine-checks every draft
against the prompt's coverage contract before writing it
(`local/lib/draftlint.mjs`), and lands drafts in the same folder
under the same human-review contract — the phased design is
`testplangen/Local_TestPlanGen_Plan.md`.

## Fresh-tenant install order

1. Six lists on lrsworkspace per schemas/ — create LOOKUP columns
   via CLASSIC list settings (modern-created lookups are broken:
   silent write drops, spinning pickers).
2. Folders in the LRS Doc Index library (manual, once):
   /LRS Doc Index/media plus the seven kind subfolders — Test Plans,
   User Stories, Design Spikes, Data Templates, Schedules,
   Doc Reviews, Other.
3. Scripts into the dummy Scripts.xlsx Automate tab, exact names
   (RegexExtract v1.2, ZipTextExtract v1.9, WorkbookDump v1.1,
   MediaExtract v1.2, RelatedRank v1.2, SidecarPatch v1.3).
4. AI Builder prompt from review/patches/DocIndex_Prompt_v1_3.md
   (item/requestv2 keys: FileName, DocText, ExistingKeywords).
5. Import the v2.5 flow package, bind SharePoint + Excel
   Online + Dataverse connections.
6. Designer touch-ups after import: the Run-script actions ship
   with the origin tenant's real script bindings (captured from the
   live flow's 2026-08-10 export — the old MediaExtract/RelatedRank/
   SidecarPatch stand-ins are gone), but script IDs are OneDrive
   item links, so on a fresh tenant re-pick each of the six
   Run-script actions to your pasted scripts; then verify the
   prompt action's model/prompt binding matches your tenant's
   prompt id.

On the EXISTING tenant (already at v2.4): only step 6's checks
apply after importing v2.5 — no new scripts, columns, or folders —
though on the home tenant the script bindings already resolve, so
step 6 reduces to the prompt-binding check; full order, designer
edits R1–R7 and the smoke test in `flow/v2_5/CHANGES.md`. Coming
from v2.3 or earlier, do the v2.4 steps first
(`flow/v2_4/CHANGES.md`).

## Runbook

- **Smoke mode**: set Config→SmokeFile to an exact filename for
  single-file runs; empty = full sweep. trim/case-proof, but the
  characters must match the library's Name column.
- **Retry semantics**: Error rows always reprocess next run;
  Skipped rows wait for a source-file change; Indexed rows
  reprocess when the file's Modified advances OR the row's
  PromptVersion trails Config's (the v2.2 backfill gate).
- **Error diagnosis**: Error rows carry `LastError` (since R13,
  2026-08-11) — the failing action's name and message from the
  catch scope. The field clears on the next successful index, so a
  non-empty `LastError` on an Indexed row means the clear predates
  R13; a fresh reprocess resolves it.
- **Budget**: MaxDocsPerRun (150) counts only docs actually
  processed; the daily 17:00 Mountain trigger walks the corpus
  ~150/day until done. Since the v2.5 addendum the walk is
  newest-first (`Get_files` orders by the library's Modified desc),
  so fresh uploads and just-edited docs index on the next run and
  backfills migrate the recently touched part of the corpus first
  — if the library ever passes ~5,000 items, index the Modified
  column (see `flow/v2_5/CHANGES.md`).
- **Edges** mint when the LATER doc of an ID-sharing pair
  processes; the graph self-assembles during backfill.
- **Related documents** (v2.3, overhauled v2.6): each sidecar shows
  its top 5 related docs. Since v2.6 (RelatedRank v2.1) the score
  is `s = id-edges + min(soft, 999)`: every stored Doc Links edge
  type counts, weighted per type (id 1000/shared issue —
  structurally dominant: since v2.1 every OTHER signal, non-id
  edges included, shares the 999 soft cap, so no accumulation
  outranks an id link — then review 100, gantt 60, titlematch
  40, ready for Flow #2's edges the day they exist), and the soft
  part adds rarity-weighted keyword overlap (a local IDF computed
  from rows the flow already fetches, keywords further weighted by
  Kind: topic 1.0 / tool 0.6 / product 0.4, alias junction rows
  folded onto their canonical), metadata affinity (same
  DocKind/Surface, PE/Dev matched on name-SET overlap so
  multi-name fields count, same TargetRelease strongest), shared
  distinctive title tokens (0.4 each, up to 6, corpus-generic
  words stopworded) and a symmetric recency bonus (half-life decay
  on the OLDER doc's SourceModified — pair-min, so scores stay
  reciprocal-safe).
  Ranking is two-phase: a shortlist of 12 by edges+keywords, then
  a metadata re-rank of the fetched shortlist — a doc with no
  shared edge or keyword never appears just for matching metadata.
  Every weight lives in `Config.RelatedWeights` (JSON string;
  absent keys fall back to identical in-script defaults), so
  tuning is a designer edit, not a script paste. Indexing a doc
  still reciprocally patches its neighbors' sidecars, so lists
  stay fresh in both directions and entries self-heal on reindex.
  Keyword relatedness is still never stored as edges — the lists
  are a bounded per-doc render (see docs/SP_Adaptation_Notes.md).
  Rarity sampling ceilings moved into Config (`MyKwsTop` 100,
  `SharersTop` 2000, `LinksTop` 200) and truncation is now
  *detected*, not just documented: any input arriving at its
  ceiling shows up as `related_flags=` in the run summary — raise
  the ceiling when it fires.
- **Kind routing** (v2.4): sidecars file into the subfolder named by
  `Config.KindFolders[DocKind]`; when a reindex changes the path
  (kind reclassified, title slug changed, or the v1.6 backfill
  migrating a root-level file), the new copy is written first and
  the old one is recycled — check the site recycle bin before
  suspecting data loss. Reciprocal patches always write a neighbor
  back to whatever folder it currently lives in.
- **Authorship** (v2.4): `author` / `last_edited_by` / `last_edited`
  come from the document's own core properties for pptx/docx and
  fall back to the library's Created By / Modified By / Modified
  (always the fallback for xlsx/txt). `SourceEdited` on the row is
  that document-property time — it can differ from `SourceModified`
  (upload time), which alone drives the reindex gate.
- **Sidecar identity** (v2.5): a sidecar's filename `__docNN` and
  its `doc_id:` line are the document's Doc Index ROW id — the same
  number as the list's ID column, the `related:` entries' `doc`
  values, and TestPlanGen's story-id input. Sidecars not yet
  re-extracted by the `v1.7` backfill still carry the pre-v2.5 id
  (the source library file's item id, a different number); until the
  corpus converges the list's ID column is authoritative. Media
  `doc{N}_` filename prefixes stay keyed to the source file id by
  design.
- **Media caps**: 12 images/doc, 350 KB each, 3 MB total, raster
  only; overflow lands in the script's skipped list.
- **PromptVersion**: bump the Config value whenever the prompt
  text OR the sidecar format changes; rows carry it, and since
  v2.2 a mismatch actively triggers reindexing (~150/day until
  the corpus converges), rewriting sidecars in the new format.
  The v2.3 bump to `v1.3` (related documents), the addendum
  bump to `v1.4` (fenced metadata block for SharePoint preview),
  the addendum bump to `v1.5` (rarity-weighted related scoring),
  the v2.4 bump to `v1.6` (kind subfolders + authorship fields)
  and the v2.5 bump to `v1.7` (sidecar names and `doc_id` re-keyed
  to the Doc Index row id) are all format-only: the prompt text is
  unchanged and must not be re-pasted. The v1.8 bump (2026-08-11) is
  the exception: it pairs the DocIndex_Prompt v1.3 paste (keyword rule
  reconciled with its exemplars; fence hardening) with the v1.9 script
  batch's sidecar-body changes — prompt re-paste required and done;
  one backfill converges both.
- **AgentInstructionsVersion**: the Q&A agent's instructions bump
  like the prompt — new `agent/QA_Agent_Instructions_vX_Y.md`,
  re-paste into Copilot Studio, re-run the smoke suite, record in
  `agent/CHANGES.md`. Independent of PromptVersion — but a sidecar
  format change that adds/renames metadata fields needs a matching
  instructions bump (the agent describes those fields).
- **CurationStatus** (Keywords list): empty = uncurated, `Proposed` =
  awaiting review, `Rejected` = never re-proposed. Approving = setting
  `CanonicalRef`; the curation flow clears the curation columns on its
  next run. The flow writes only its two columns; the sweep never
  reads them.
- **CurationPromptVersion**: bumps like AgentInstructionsVersion — new
  `review/patches/KeywordCuration_Prompt_vX_Y.md`, re-paste into AI
  Builder, promote to `prompts/KeywordCuration_Prompt.md`,
  re-run the curation smoke suite, record in `curation/CHANGES.md`.
  Never bump `Config.PromptVersion` for curation — nothing here
  reindexes the corpus.
- **TestPlanGenPromptVersion**: bumps the same way — new
  `review/patches/TestPlanGen_Prompt_vX_Y.md`, re-paste into AI
  Builder, promote to `prompts/TestPlanGen_Prompt.md`,
  re-run the generation smoke suite, record in
  `testplangen/CHANGES.md`. Never bump `Config.PromptVersion` for
  generation — nothing here changes the sidecar format or reindexes
  the corpus. Drafts are point-in-time snapshots in
  `Shared Documents/Test Plan Drafts/` (timestamped, never
  overwritten by re-runs, deleted by hand after finalize); the Q&A
  agent never sees them, and a finalized plan enters the catalog only
  by normal upload to the source library.
- **TestPlanGenAgentVersion**: the generator agent's file set
  (`testplangen/agent/TestPlanGenAgent/`) bumps like
  AgentInstructionsVersion — edit, re-import (or re-paste), re-run
  the agent smoke suite, record in `testplangen/CHANGES.md`.
  Independent of both TestPlanGenPromptVersion and
  `Config.PromptVersion`. The flow contract (input `StoryId`,
  outputs `Status`/`DraftUrl`/`GenSummary`) binds the agent's topic
  to the flows — change one side, change both.

## Known limits / queued work

Run-script payload caps files at roughly 3.5 MB on the CLOUD flow
(the local sweep raised its guard to 50 MB). Since the 2026-09-03 r7
batch most of the old queue is built: html and pdf index (v1.10),
image-only PDFs OCR when `sweep.tesseractPath` is set (v1.36), Flow
#2 ships as `local/gantt.mjs` (first live run pending — STATUS
action 13c), and the librarian DocKeywords re-point is
`curate.mjs --repoint` (run it after approved merges, then
`sweep --rerank`). The phase-4 round (same day) added the msg lane
(Outlook messages index via a zero-dep CFB parser; old Skipped rows
rescue automatically), opt-in embedding-assisted relatedness
(`sweep.embedRelated`), and remote-files mode + a disabled-by-default
hosted GitHub Actions sweep (`local/Hosted_Runner.md`). Still
queued: the librarian pass's retro-illustration piece
(`curation/Curation_Setup.md`). Test-plan generation's own deferred work — docx
conversion of drafts and the IssueRefs-driven coverage matrix — is
specified in `testplangen/TestPlanGen_Setup.md`'s Queued follow-ons
(the Copilot Studio front end shipped in v1.1; see
`testplangen/agent/Agent_Setup.md`).
