# Curation v1.0 — propose-then-approve keyword alias curation

First release of the curation component: a weekly Power Automate flow,
**KeywordCuration**, that makes one AI Builder call over the full
canonical vocabulary and proposes alias→canonical merges for a human
to approve. The flow never writes `CanonicalRef` — proposals land in
two new flow-owned Keywords columns; a human approves by setting the
lookup; the flow cleans up approved rows on its next run. This closes
the "keyword alias curation" queued-work item (the F10 "curation
erosion" residue).

| Piece | Version | Where |
|---|---|---|
| Curation prompt | **v1.0** | `curation/KeywordCuration_Prompt_v1_0.md` |
| Build + deploy guide | v1.0 | `curation/Curation_Setup.md` |
| Keywords schema delta | +2 columns | `schemas/SPList_Keywords.csv` |
| KeywordCuration flow | built from the guide (no definition.json — new flows have no package skeleton; provenance export queued) | — |
| Sweep flow / scripts / prompt / sidecars / agent | unchanged (v2.4 / v1.2 / v1.0) | — |

## What shipped

- **Two Keywords columns** — `CurationStatus` (Choice:
  Proposed/Rejected; empty = uncurated; "approved" is implicit when
  CanonicalRef gets set) and `ProposedCanonical` (flow-written
  `<canonical> — <rationale>`). Flow-owned; disjoint from the sweep's
  and humans' columns — the ownership invariant is in the guide §1 and
  `docs/SP_Adaptation_Notes.md`.
- **The prompt** — Vocabulary + DoNotPropose in, strict
  `{"proposals":[{alias, canonical, why}]}` out (an object, so the
  sweep's F3 brace-slice parse applies verbatim). Conservative
  merge rules (true variants only, never semantic neighbors, never
  cross-kind, when-in-doubt-omit, empty most weeks), verbatim-copy
  requirement, and the DocIndex v1.2 untrusted-data posture over the
  keyword lists themselves.
- **The flow** — Saturday 08:00 Mountain: approved-row cleanup
  (field-scoped HttpRequest MERGE), vocabulary/blocked line
  composition, one prompt call, F3-pattern parse degrading to zero
  proposals, an in-memory hallucination guard (proposals must match
  real rows, alias uncurated, canonical not itself an alias),
  proposal writes, a pending-carryover digest overwritten at a fixed
  name in **Shared Documents** (deliberately outside the LRS Doc
  Index library so the Q&A agent never ingests it), a trimmed Catch
  scope, and an F11-style run summary.
- **Review loop** — the Curation queue list view; approve = set
  CanonicalRef; reject = set Rejected (row-level memory); inversion
  documented as the rare manual path.
- **Deferred by decision** — re-pointing existing DocKeywords rows
  stays with the queued librarian backfill pass; the exact mechanics
  are specified in the guide's Queued follow-ons, and the split-history
  consequence is documented in Known limits and the README.

## Install order

`curation/Curation_Setup.md` §§1–5 in order: columns (internal names
first) → prompt → flow → view → smoke suite. Schema before flow, view
before the first scheduled run.

## Runbook deltas

- **CurationStatus**: empty = uncurated, `Proposed` = awaiting review,
  `Rejected` = never re-proposed; approval = setting CanonicalRef, and
  the flow clears the curation columns next run.
- **CurationPromptVersion**: bumps like AgentInstructionsVersion — new
  `KeywordCuration_Prompt_vX_Y.md`, re-paste into AI Builder, re-run
  the smoke suite, record here. NEVER bump `Config.PromptVersion` for
  this — nothing in curation reindexes the corpus.

## Verification record

Corpus-neutral by construction: no scripts, no sweep flow change, no
sidecar format change, no agent-instructions change — the local
harness (`check_format.py` / `check_related.py` / `render_sample.py`)
is unaffected; see agent v1.0's record in `agent/CHANGES.md` for the
current PASS baseline (2026-08-10).

Live-tenant smoke run (fill in at deployment; suite =
`curation/Curation_Setup.md` §5):

| Date | Tenant | Steps passed (of 7) | CurationPromptVersion |
|---|---|---|---|
| — | — | — | v1.0 |
