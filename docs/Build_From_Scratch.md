# Building everything from scratch — the consolidated walkthrough

One document that sequences the entire system onto a fresh tenant,
in dependency order, with every step pointing at the authoritative
source doc. Nothing here replaces those docs — when this walkthrough
and a component's own guide disagree, the component guide wins
(and fix this file in the same commit).

Written against the repo state of 2026-08-12 (flow v2.5 deployed /
v2.6 authored, r2 script batch promoted, components: Q&A agent v1.1,
curation v1.1, TestPlanGen v1.7). Check `STATUS.md` first — it is the
single source of truth for what is current.

## What you are building

A document-indexing pipeline on SharePoint + Power Platform:

- **The sweep** (`DocIndexSweep`, daily 17:00 Mountain): enumerates the
  LocationReferencing Documents library, extracts text from
  pptx/docx/xlsx/txt in-script, classifies and keywords each document
  with one AI Builder call, mints issue-ID rows and doc-to-doc edges,
  and writes a markdown **sidecar** per document — filed into
  per-DocKind subfolders of the **LRS Doc Index** library, stamped with
  the source document's authorship trail, cross-linked to its top-5
  related documents (with reciprocal patching of neighbors).
- **Six SharePoint lists** (Doc Index, Keywords, Doc IDs, Issue Refs,
  Doc Keywords, Doc Links) — the catalog, vocabulary, and edge graph.
- **Six Office Scripts** in a dummy workbook — the extraction and
  ranking engine the flow calls through Excel Online.
- **Three AI Builder prompts** — indexing (per-doc), keyword curation
  (weekly), test-plan generation (on-demand).
- **KeywordCuration** (optional flow, weekly): proposes alias→canonical
  keyword merges for human approval. Never merges on its own.
- **TestPlanGen** (optional flow, on-demand): drafts a test plan from
  an indexed User Story, its related docs, and exemplar plans; a human
  reviews and finalizes. Optionally fronted by a thin Copilot Studio
  agent (**LRS Test Plan Generator**).
- **LRS Doc Index Q&A** (optional Copilot Studio agent): answers
  questions over the sidecar corpus, published to Teams.

Dependency shape: Phases 1–5 are the core and strictly ordered.
Phases 6–9 are each optional and independent of one another; all of
them assume the core is live.

Architecture rationale and SharePoint-specific design decisions:
`docs/SP_Adaptation_Notes.md`. Runbook and version-discipline rules:
`README.md` §Runbook.

## Prerequisites

- A SharePoint site (the origin system uses
  `esriis.sharepoint.com/sites/lrsworkspace`) and a source document
  library to index (LocationReferencing Documents).
- Power Automate maker access; connections for SharePoint, Excel
  Online (Business), and Dataverse (the AI Builder actions ride it).
- AI Builder capacity: one custom-prompt call per indexed document
  daily, plus one weekly (curation) and a handful on-demand
  (TestPlanGen), if you build those.
- OneDrive for the maker account (the scripts workbook lives there;
  Run-script bindings are OneDrive item links).
- For the optional agents: Copilot Studio authoring access; for the
  generator agent additionally a Dataverse solution (child flows only
  exist inside solutions) and VS Code with the Copilot Studio
  extension (portal-paste fallback exists).

---

## Phase 1 — SharePoint schema: one library, six lists

Authoritative: `docs/SP_Adaptation_Notes.md` §Build mechanics +
`schemas/SPList_*.csv`. Shortcut: `schemas/Copilot_Schema_Prompt.md`
is a paste-ready prompt (chunked and one-shot variants) that has
Copilot generate an idempotent PnP.PowerShell provisioning script for
the whole schema — use it, or build by hand as below. Either way,
verify with the checks at the end of this phase.

1. Create the **LRS Doc Index** document library first (standard
   library, no custom columns). In its root create the folders —
   manual, once: `media`, `Test Plans`, `User Stories`,
   `Design Spikes`, `Data Templates`, `Schedules`, `Doc Reviews`,
   `Other` (the seven kind folders must match `Config.KindFolders`).
2. Create the six lists as **Blank lists, in this order** (lookups
   target existing lists): Doc Index, Keywords, Doc IDs, Issue Refs,
   Doc Keywords, Doc Links.
3. Columns per the CSVs in `schemas/`, with these iron rules:
   - **Create every column with its Internal Name as the
     creation-time name** (first-created name = internal name,
     forever; rename display names afterwards if wanted).
   - **Lookup columns via CLASSIC list settings** — modern-created
     lookups are broken (silent write drops, spinning pickers).
     The Keywords self-lookup (`CanonicalRef`) is added after the
     Keywords list exists.
   - Choice columns: dropdown, values exactly as listed, order
     preserved, NO fill-in choices.
   - Multi-line text (TextPreview, Summary, SharedValues, Notes,
     LastError): plain text, NOT enhanced rich text.
   - Number columns 0 decimals; date-time columns include time.
   - Columns marked RESERVED (Library, SourceETag): create anyway.
4. **Indexes before data**: List settings → Indexed columns → every
   column the CSVs mark INDEXED (the key columns DocKey, IdKey,
   KWKey, LinkKey, IssueKey, plus the lookup columns marked indexed),
   plus **Title on Keywords**. Indexing an empty list is instant;
   indexing a full one is a bad afternoon.
5. Record the six list GUIDs and verify internal names via a
   signed-in REST check
   (`.../_api/web/lists/getbytitle('Doc Index')/fields?$filter=...`).
   The flow references every list by GUID — you will substitute your
   GUIDs anywhere the repo's appear (`docs/SP_Adaptation_Notes.md`
   has the origin tenant's table).

Issue Refs stays empty by design — its feeder (flow #2) is not yet
built. Create it anyway; Doc Links' `LinkType` and RelatedRank are
already wired for its edge types.

## Phase 2 — Office Scripts: the extraction engine

The flow runs scripts against a **dummy workbook** (e.g.
`Scripts.xlsx` in the maker's OneDrive) — the workbook content is
irrelevant except for WorkbookDump, which runs against the target
xlsx. In the workbook's **Automate tab → Code Editor**, create six
scripts with these **exact names**, pasting from the repo:

| Script name | Paste from | Version |
|---|---|---|
| RegexExtract | `scripts/RegexExtract.ts` | v1.3 |
| WorkbookDump | `scripts/WorkbookDump.ts` | v1.2 |
| RelatedRank | **`review/patches/RelatedRank_v1_3.ts`** — see warning | v1.3 |
| SidecarPatch | `scripts/SidecarPatch.ts` | v1.4 |
| MediaExtract | `scripts/MediaExtract.ts` | v1.3 |
| ZipTextExtract | `scripts/ZipTextExtract.ts` | v2.0 |

> **The one trap in this build.** `scripts/RelatedRank.ts` is
> **v2.0**, whose signature only works with the **v2.6** flow. If you
> are importing the v2.5 flow (this walkthrough's default — see Phase
> 4), paste the r2 artifact `review/patches/RelatedRank_v1_3.ts`
> instead; v2.0 gets pasted later, inside the Phase 6 maintenance
> window, together with the v2.6 designer edits. Pasting v2.0 under a
> v2.5 flow breaks the `Run_related_rank` binding.
> (Going straight to v2.6? Then paste all six from `scripts/` — but
> read the Phase 6 caveat first.)

Notes: ZipTextExtract contains literal `` escape sequences (the
generated-heading sentinel) — plain ASCII in the source; paste as-is,
do not "clean up". Script IDs are OneDrive item links, so the flow's
Run-script actions must be re-picked to *your* pasted scripts after
import (Phase 4).

## Phase 3 — The indexing AI Builder prompt

Create an AI Builder **custom prompt** with three input parameters,
exact names: **FileName**, **DocText**, **ExistingKeywords**. Paste
the delimited block from `review/patches/DocIndex_Prompt_v1_3.md`
(same text as the deployed copy `prompts/DocIndex_Prompt.md`).
Current prompt version: **v1.3**, which pairs with
`Config.PromptVersion` **v1.8** (set in Phase 4).

Check: test in the AI Builder pane with a small DocText — the reply
must be a bare JSON object (title, docKind, surface, summary, pe,
dev, targetRelease, tools, keywords).

## Phase 4 — Import and wire the sweep flow

Import `flow/DocIndexSweep_v2_5.zip` (My flows → Import → Import
package (Legacy)); map the SharePoint, Excel Online (Business), and
Dataverse connections to yours during import. Then the designer
touch-ups (README §Fresh-tenant install order, step 6):

1. **Re-pick all six Run-script actions** to your pasted scripts
   (the package's script IDs are the origin tenant's OneDrive links).
   That includes both `Extract_media_*` actions — under the v2.1+
   hardening, forgetting one no longer errors, it *silently skips
   image extraction* (`review/patches/designer-edits.md` §F12).
2. **Verify the prompt binding**: open `Run_prompt` and confirm it
   points at your Phase 3 prompt.
3. **Config compose**: substitute your site URL and your six list
   GUIDs; confirm `"PromptVersion": "v1.8"`, `"SmokeFile": ""`
   (empty = full sweep), `MaxDocsPerRun` 150, and the `KindFolders`
   map matching your Phase 1 folders.
4. **Pagination**: `Get_files` Top Count and Pagination threshold
   should be 20000 (designer-edits §F4 — pagination settings are
   easy to lose in a re-cut; check them).
5. **r2 designer edits** (`review/patches/designer-edits.md` §r2):
   delete the dead `Config.SourceSiteUrl` key (or keep as
   documentation), and optionally pin trigger Concurrency to 1.
6. Confirm the trigger: daily Recurrence, 17:00, US Mountain.

## Phase 5 — Smoke, then let it run

Runbook: `README.md` §Runbook; per-version smoke details:
`flow/v2_5/CHANGES.md`.

1. **Smoke mode**: set `Config.SmokeFile` to one exact filename (a
   pptx with images and an issue id in it is the best probe) and run
   manually. Verify: a Doc Index row (Indexed, PromptVersion v1.8),
   a sidecar in the right kind subfolder named
   `{title-slug}__doc{rowId}.md` with fenced yaml metadata +
   authorship lines, media files under `media/`, Doc IDs rows for any
   issue ids, keywords in Keywords/Doc Keywords, and a sane
   `Run_summary`.
2. Smoke a second, related doc (shared issue id) → a Doc Links `id`
   edge mints, both sidecars carry Related sections, the first doc's
   sidecar got reciprocally patched.
3. Clear `SmokeFile` → full sweep. The corpus indexes newest-first at
   ~150 docs/day (`MaxDocsPerRun`) until done; edges and related
   lists self-assemble as the backfill converges.
4. Watch: Error rows carry `LastError` (failing action + message) and
   self-heal by reprocessing next run; Skipped rows (html/pdf/msg,
   oversized >~3.5 MB files) wait for a source change, by design.

**The core is now live.** Everything below is optional and
independent — build in any order, or never.

## Phase 6 — Upgrade to v2.6 (related-ranking overhaul)

The authored head: RelatedRank v2.0 (all edge types, rarity-weighted
keywords, metadata affinity, recency, config-driven weights,
shortlist-then-rerank). As of 2026-08-12 it is **authored but not yet
designer-applied on the origin tenant** (STATUS open action 6) — on a
fresh tenant you may reasonably wait until the origin verifies it.

When you do it, **script paste + flow edits are ONE maintenance
window** — the branch is broken mid-sequence by design, so do the
whole list with the flow off or well clear of the 17:00 trigger:

- Paste `scripts/RelatedRank.ts` (v2.0) over RelatedRank, then apply
  edits V2–V10 from `review/patches/designer-edits.md` §v2_6 (new
  Config keys incl. `RelatedWeights`, the widened keyword-metadata
  queries, the two-phase shortlist/final Run-script calls, the
  `related_flags` tripwire). Smoke once after V10, per that section.
- Alternative: import `flow/DocIndexSweep_v2_6.zip` instead of
  editing — then redo the Phase 4 touch-ups (re-pick every
  Run-script action, prompt binding, GUIDs).

No PromptVersion bump, no backfill: scores and `why` prose change,
the sidecar format does not.

## Phase 7 — Keyword curation (optional)

Authoritative: `curation/Curation_Setup.md`. Weekly (Saturday 08:00
Mountain) flow proposing alias→canonical keyword merges; humans
approve by setting `CanonicalRef`, reject via `CurationStatus`.

1. Add the two flow-owned Keywords columns (`CurationStatus` choice
   Proposed/Rejected, `ProposedCanonical` single line) — modern UI
   fine, no index needed.
2. Create the `LRS Keyword Curation` prompt (inputs **Vocabulary**,
   **DoNotPropose**; paste `prompts/KeywordCuration_Prompt.md`).
3. Build the flow from §3 of the guide (~30 actions; the authored
   `curation/flow/v1_1/definition.json` is a structural reference /
   import starting point, but its prompt binding is a placeholder —
   re-pick, and designer-verify against the guide).
4. Create the **Curation queue** view on Keywords.
5. Run the §5 smoke suite (seeded `zz-test` rows) before trusting
   the schedule; record in `curation/CHANGES.md`.

The digest lands in **Shared Documents** — deliberately outside the
LRS Doc Index library so the Q&A agent never ingests it.

## Phase 8 — The Q&A agent (optional)

Authoritative: `agent/QA_Agent_Setup.md`. All portal work, no
package: create the **LRS Doc Index Q&A** Copilot Studio agent;
knowledge = the LRS Doc Index **library only** (never the site, never
the raw source library); **general knowledge OFF**; paste
`agent/QA_Agent_Instructions_v1_1.md` verbatim; publish to Teams; run
`agent/QA_Smoke_Questions.md` and record in `agent/CHANGES.md`.
Expect semantic-index warm-up latency (minutes to hours) on new
sidecars — freshness is sweep schedule + index latency.

## Phase 9 — Test-plan generation (optional)

Authoritative: `testplangen/TestPlanGen_Setup.md`; requires the sweep
at v2.4+ (kind routing + `related:` lines). On-demand flow from the
Doc Index list's Automate menu on an Indexed **User Story** row.

1. Create the folder **Shared Documents/Test Plan Drafts** (outside
   the Q&A agent's knowledge and outside the sweep's source library —
   unreviewed drafts must never enter either).
2. Create the `LRS Test Plan Generation` prompt (inputs **StoryMeta**,
   **StoryText**, **RelatedDigest**, **ExemplarText**; paste
   `prompts/TestPlanGen_Prompt.md`). Its reply is markdown between
   `<<<DRAFT BEGIN>>>`/`<<<DRAFT END>>>` markers, not JSON.
3. Flow: import `testplangen/TestPlanGen_v1_0.zip` with post-import
   checks I1–I4 (re-pick the prompt — its packaged recordId is a
   placeholder; re-pick the trigger's site/list; map connections;
   fix the Automate menu label), or build by hand from §3 Path B.
4. Smoke per `testplangen/TestPlanGen_Smoke.md`; record in
   `testplangen/CHANGES.md`. The human review pass in §4 is a
   REQUIRED control — drafts carry mandatory Trace lines and
   `[VERIFY]` items instead of inventions, but nothing ships without
   review; finalized plans re-enter the catalog by normal upload to
   the source library.
5. Optional conversational front door: `testplangen/agent/
   Agent_Setup.md` — split the flow into a child (`TestPlanGenCore`,
   importable as `testplangen/TestPlanGenCore_v1_0.zip`) with two
   thin parents inside a Dataverse solution, then import/paste the
   **LRS Test Plan Generator** agent file set
   (`testplangen/agent/TestPlanGenAgent/`). The agent is thin by
   design: no knowledge sources, general knowledge off; corpus
   questions stay with the Q&A agent.

## Phase 10 — Operating it

- **`STATUS.md` is the deployed-state ledger** — update it with every
  paste/promotion. File headers say what is *authored*; STATUS says
  what is *deployed*.
- **Version discipline** (README §Runbook): `Config.PromptVersion`
  bumps whenever the indexing prompt text OR the sidecar format
  changes, and drives the converging reindex backfill (~150
  docs/day). The other version tracks —
  AgentInstructionsVersion, CurationPromptVersion,
  TestPlanGenPromptVersion, TestPlanGenAgentVersion — bump
  independently and NEVER touch `Config.PromptVersion`. A sidecar
  format change that adds/renames metadata fields needs a matching
  Q&A instructions bump (the agent describes those fields).
- **Script/prompt changes** go through the review harness
  (`review/harness/` — offline Node gates like `check_batch_r3.py`'s
  predecessors ran) and land as gated `review/patches/` artifacts
  before promotion to `scripts/`/`prompts/` and a tenant paste.
- **Tripwires**: `Run_summary`'s `library_items_seen` vs the
  `Get_files` ceiling; `related_flags=` firing (v2.6) means raise a
  sampling ceiling in Config; curation `dropped` trending high means
  tighten the curation prompt.
- **Queued, not built**: flow #2 (Gantt → Issue Refs + gantt/
  titlematch edges), the librarian backfill (DocKeywords re-point
  after approved merges), Q&A list-query actions, TestPlanGen docx
  handoff and coverage matrix.
