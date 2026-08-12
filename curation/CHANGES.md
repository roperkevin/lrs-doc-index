# Curation flow definition authored — `curation/flow/v1_1/definition.json` (2026-08-12)

Closes the "provenance export" queued follow-on from
`Curation_Setup.md`, with one honest caveat: the definition is
**authored from the guide, not exported from the tenant**. Every
action name, expression, and connector shape is transcribed verbatim
from §3 (at v1.1 — the C11 No branch included), in the same
packaged-resource format as the `flow/` and `testplangen/flow/`
definitions (wrapper, `Recurrence` trigger Week/Saturday/08:00
Mountain, SharePoint + Dataverse connection references copied from
the sweep definition; no Excel connector — this flow runs no
scripts). Validated structurally: JSON well-formed, every WDL
expression paren-balanced, every `runAfter` resolves within its
scope, every `outputs()`/`body()`/`items()`/`variables()` reference
targets a real action or variable, and the guide's fenced
expressions appear byte-for-byte.

Two things this definition can NOT carry, by nature:

- **The AI Builder prompt binding**: `Run_curation_prompt.recordId`
  (and `partnerSourceVersion`) are zeroed placeholders — the real ids
  are minted by the tenant when the `LRS Keyword Curation` prompt is
  created. Anyone importing or rebuilding from this definition must
  re-pick the prompt in the designer, exactly like the sweep's
  script re-picks after an import.
- **A package zip**: not cut. The guide's own note stands — a
  brand-new flow has no exported package skeleton, and fabricating a
  manifest for a package that never left a tenant would produce a
  provenance artifact with no provenance. If/when the built flow is
  exported, diff it against this file (RL-4 style: record drift,
  don't hide it) and cut the zip from that export.

No live-flow change, no version bump: the tenant flow already IS
v1.1 (built from the guide; DX-11 applied 2026-08-11). This entry
adds the checked-in artifact only.

# Curation v1.1 — an emptied queue overwrites the digest (DX-11)

Review fix (`review/REVIEW_v2_5.md` DX-11), applied to the live flow
2026-08-11.

Deployment record (added in r2 — this entry originally shipped
without one; the apply date comes from the sentence above, the
verification is still open and tracked in `STATUS.md`):

| Date | Tenant | Applied | Verified |
|---|---|---|---|
| 2026-08-11 | live flow (per above) | `If_any_lines` No branch (C11) | pending — confirm the next all-resolved Saturday run overwrites the digest | `Save_digest` ran only when `ProposalLines` was non-empty,
so a week in which every proposal was approved or rejected left LAST
week's digest in Shared Documents showing already-resolved rows as
pending — and the runbook tells the librarian to work from the digest
Monday morning. C11's `If_any_lines` gains a No branch
(`Digest_body_empty` + `Save_digest_empty`, same fixed name) that
overwrites the file with an explicit empty-queue state. Build steps in
`Curation_Setup.md` C11; no schema, prompt, or
`CurationPromptVersion` change (the digest body is not the prompt).

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

---

**Addendum (2026-08-12, GUID re-provisioning):** the lrsworkspace
lists were re-provisioned with new GUIDs (canonical table:
`docs/SP_Adaptation_Notes.md`). The Keywords GUID (Config literal,
`Update_kw` table binding, both REST URIs) and the DocKeywords GUID
were swapped in `curation/flow/v1_1/definition.json` and
`Curation_Setup.md` — no other change; a flow already built from the
old guide needs its list pickers and the two `Send an HTTP request
to SharePoint` URIs re-pointed at the new GUIDs.
