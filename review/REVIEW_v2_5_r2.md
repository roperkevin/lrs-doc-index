# DocIndex v2.5 — Review Round 2 (2026-08-11)

Reviewed: all six Office Scripts line-by-line (with Node repros for suspected bugs),
the v2.5 flow definition (action census, Config reference counts, connector
inventory), every harness entry point (executed — baseline green before any change),
all ten flow definitions and all ten import packages (payloads md5-compared against
their sibling folders, manifests inspected inside the zips), the six list schemas,
README, every CHANGES chain, and both prior review documents. Everything already
closed by the v1.9 review (F1–F12) and the v2.5 review (FL-1..6, SC-1..14, HA-1..9,
DX-1..16) was re-checked only for regressions, not re-reported; none regressed.

**Overall verdict:** the system is in the best shape it has been — the v1.9 script
batch, prompt v1.3, and the R8–R13 addenda all held up under re-verification. What
this round found is the next stratum down: a set of silent wrong-output script bugs
the harness never covered (led by a phantom-revision regex that misreads
`Notes_Nov21` as revision V21), the fact that RegexExtract — the script that mints
issue IDs — has essentially no test coverage at all, documentation that drifted
during the fast 08-10/08-11 fix cycle, a repo layout where the production prompt
lives in a review folder while the root copy is two versions stale, and a personal
work email embedded invisibly in nine binary import packages.

IDs this round: `SB` = script bugs, `HG` = harness gaps, `DD` = documentation
drift, `RL` = repo layout / versioning artifacts, `PV` = privacy / portability.

## Ranked findings

| # | Finding | Severity | Surface |
|---|---------|----------|---------|
| SB-1 | `docRevision` regex matches inside words: `Notes_Nov21` → phantom revision **V21**, `…_Rev12` → **V12** | **High** | Script change (gated) |
| HG-1 | RegexExtract is ~90% untested — the harness asserts only `.slug`; ids, precedence, EXB routing, and docRevision (SB-1's home) have zero assertions | **High** | Harness suite (new) |
| PV-1 | `kev14953@esri.com` embedded in `manifest.json` inside 9 tracked zips — invisible to source-tree grep | Medium | Zip re-cut (user decision: done, no history rewrite) |
| SB-2 | SidecarPatch `patchFrontmatter` only recognizes `related: [` exactly — any other YAML form gets a **duplicate `related:` key appended** | Medium | Script change (gated) |
| SB-8 | MediaExtract and ZipTextExtract count budget bytes differently (actual inflated vs central-directory claim) — the divergence mode is exactly the SC-4 dead-link class; the 227 duplicated zip-reader lines carry no keep-in-sync banner | Medium | Script change (gated) |
| RL-1 | The production prompt is `review/patches/DocIndex_Prompt_v1_3.md`; the root `DocIndex_Prompt.md` is v1.1, two versions stale — the single most confusing thing in the repo | Medium | Layout (`prompts/`) |
| SB-4 | WorkbookDump renders a formatted-but-empty sheet as malformed `\|  \|` rows instead of `(empty)` | Medium | Script change (gated) |
| SB-5 | Stored-block inflate path reads `LEN` before any bounds check and never verifies `NLEN` — the SC-8 guard is one line short | Medium | Script change (gated) |
| DD-1..8 | README/setup-guide drift from the 08-11 fix cycle: wrong PromptVersion, LastError undocumented, shipped features listed as deferred, four guides titled v1.0 with newer content, one in-file self-contradiction, a concurrency claim the definition doesn't back | Medium | Doc fixes |
| HG-3..6 | Harness labels frozen at superseded versions (`zte_v18.ts` runs v1.9…), PyYAML undeclared, `run_diff.py` crashes asymmetrically, no post-promotion run record | Medium | Harness fixes |
| RL-3 | `flow/definition.json` is the **oldest** definition in the tree (v1.9) sitting unqualified at the top of `flow/` — reads as current, is six versions stale | Medium | Layout (`flow/v1_9/`) |
| SB-3, SB-6, SB-7, SB-9 | Low tail: ranked-list duplicate bullets, `##` heading forgery, silent 200-table truncation + `Math.max.apply` ceiling, comparator perf | Low | Script change (gated) |
| RL-2, RL-4..7 | Low tail: dead patch file, v2_3 zip payload drift (record-only), no STATUS view, CHANGES record gaps, no root .gitignore / CI | Low | Repo hygiene |
| PV-2, PV-3 | Tenant/creator GUIDs in all definitions (accepted); dead `Config.SourceSiteUrl` (designer edit) | Low / Info | Recorded / designer edit |

---

## SB — Script bugs

### SB-1 — Phantom docRevision from letter-run tails (High)

`scripts/RegexExtract.ts:134`:

```ts
const rv = baseName.match(/[Vv](\d{1,2})$/);
```

Nothing anchors the `[Vv]` to a token boundary, so any base filename ending in a
letter-run + digits whose last letter is v/V mints a revision. Verified in Node:
`"Notes_Nov21"` → `docRevision: "V21"`, `"20260806_Rev12"` → `"V12"`,
`"Notes_dev3"` → `"V3"`. Nov/Rev/dev tails are exactly the kind of names this corpus
has. `docRevision` flows into the Doc Index row and the sidecar metadata block, so
the wrong value is user-visible and agent-visible.

**Fix (gated batch, RegexExtract v1.3):** require the `[Vv]` to open a token —
start-of-string, after a non-letter, or an uppercase `V` at a camelCase boundary
(`TestPlanV1` must keep working). Contract pinned by the new suite: `TestPlanV1`→V1,
`Report_V4`→V4, `spec_v2`→V2 still match; `Notes_Nov21`, `20260806_Rev12`,
`Notes_dev3` → `""`.

### SB-2 — SidecarPatch appends a duplicate `related:` key (Medium)

`scripts/SidecarPatch.ts:266` recognizes an existing entry only when the line starts
exactly `related: [`. A sidecar whose metadata block carries any other root form —
`related:` with extra spaces before the bracket, a bare `related:` key, block-sequence
style, `related: null` — falls through to the insert branch at `:268-270` and gains a
**second** `related:` key. YAML consumers take the last key or error; either way the
block is corrupted from then on. All flow-written sidecars use the inline form today,
so the trigger is any hand-edited or externally-authored sidecar — precisely the files
SidecarPatch merge-mode touches.

**Fix (v1.4):** match `/^related:\s*/` as the replace trigger regardless of the
value's form; when the value is a block sequence, also remove its continuation lines.

### SB-3 — Ranked entries not deduped by doc id (Low)

`scripts/SidecarPatch.ts:363-374` and `:421-431` copy `ranked` into `entries` without
deduping by `doc`. The bullet renderer dedupes *lines*, but two entries for the same
doc with different titles render twice. Defensive dedupe (first occurrence wins,
preserving rank order) closes it. RelatedRank never emits duplicates today, so this
is input hardening, not a live corruption.

### SB-4 — WorkbookDump emits malformed GFM for formatted-but-empty sheets (Medium)

`getUsedRange()` counts formatted-but-empty cells, so a sheet with (say) a styled
range but no values reaches `scripts/WorkbookDump.ts:78-98` with rows that trim to
length 0. `width` becomes 0 and the loop emits `|  |` rows and a `|  |` separator —
malformed GFM in the sidecar body — instead of the `(empty)` marker that `:53`
produces for a truly absent used range.

**Fix (v1.2):** after trimming, treat `width === 0` as `(empty)`.

### SB-5 — Stored-block LEN unbounded, NLEN unverified (Medium)

`scripts/ZipTextExtract.ts:731` (and the twin in MediaExtract) reads the stored-block
length before any bounds check; at end-of-buffer the byte reads yield `undefined`
arithmetic → `len` 0 → the SC-8 truncation guard at `:737` never fires, and NLEN
(the ones-complement check the format requires) is never verified. A truncated or
corrupt archive can slip past the exact guard SC-8 added. **Fix (v2.0 / v1.3):**
bounds-check the 4 header bytes and verify `NLEN === (~LEN & 0xffff)`, throwing the
same clean error shape SC-8 established.

### SB-6 — Heading escape covers `#` but not `##` (Low)

SC-10 (`scripts/ZipTextExtract.ts:564`) escapes a leading `"# "` so pasted content
can't forge an H1 — but `## ` through `###### ` pass through and collide with the
generated `## Slide N` / `## Notes` structure. **Fix (v2.0):** escape `/^#{1,6} /`.

### SB-7 — Silent 200-table truncation; `Math.max.apply` ceiling (Low)

`scripts/ZipTextExtract.ts:427` stops rendering tables after 200 with no marker —
tables 201+ silently flatten to prose. `:458`'s `Math.max.apply(null, …)` throws
`RangeError` at argument-limit row counts (~65k). **Fix (v2.0):** emit an explicit
`*(tables truncated at 200)*` note once, and compute the max with a loop.

### SB-8 — The two zip readers budget different byte counts (Medium)

`scripts/MediaExtract.ts:57` accumulates `total += data.length` (actual inflated
bytes); `scripts/ZipTextExtract.ts:376` accumulates `total += e.uncompSize` (the
central directory's *claim*). Identical for honest archives — divergent for a lying
central directory, and the divergence mode is exactly SC-4's dead-link class:
ZipTextExtract emits an image link MediaExtract then refuses to save (or vice versa).
Compounding it, the ~227-line zip-reader block and the `MAX_IMAGES / MAX_ONE /
MAX_TOTAL` triple are duplicated across the two files (forced — Office Scripts
cannot share modules) with nothing but convention keeping them in sync; the SC-8/SC-14
fixes had to be landed twice and nothing in either file says so.

**Fix (v2.0 + v1.3):** align both sides on actual inflated bytes in archive order,
and put an explicit `KEEP IN SYNC` banner over the shared block and the constant
triple in both files.

### SB-9 — kwWeight recomputed inside the sort comparator (Low)

`scripts/RelatedRank.ts:190-198` calls `kwWeight` (which allocates
`Object.keys(...)`) from within the comparator — O(n log n) recomputation.
Precompute per doc before sorting; output is byte-identical. Perf-only.

---

## HG — Harness gaps

### HG-1 — RegexExtract has no real coverage (High)

`review/harness/check_format.py:69-80` wraps RegexExtract with an appendix that
returns **only `.slug`**. `ids[]`, the url/filename/hashtag precedence, number
suppression, the EXB 5-digit routing, bounds rejection, and `docRevision` — the
script's actual purpose — have zero assertions. That is why SB-1 survived two review
rounds. **Fix:** new standing suite `check_regex.py` (cases inline, no fixtures, so
it is CI-runnable) pinning the full `IdResult` contract.

### HG-2 — HA-8 / HA-9 carry-over (recorded)

Still open from the v2.5 review by its own admission: substring-based recall
counting, the `min(kwScore, 999)` boundary untested, SidecarPatch's malformed-JSON
guard unreachable from the harness. The new gate adds the SidecarPatch malformed-form
cases (SB-2 coverage subsumes part of HA-9); the rest remains recorded.

### HG-3 — Version-numbered runner names froze at superseded versions (Medium)

`check_format.py:65` writes `zte_v18.ts` from ZipTextExtract **v1.9**;
`check_related.py:97-98` write `rr_v11.ts` / `scp_v12.ts` from RelatedRank **v1.2**
and SidecarPatch **v1.3**; `render_sample.py` and the harness README headings carry
the same stale numbers. Every assertion label lies about what it tested. **Fix:**
version-neutral generated names (`*_cur.ts`, following the existing `me_cur.ts`
precedent) so the labels can never go stale again; README reworded to "current
`scripts/` versions".

### HG-4 — PyYAML is an undeclared prerequisite (Low)

`check_related.py:61` and `render_sample.py:33` import `yaml`; the README's
prerequisite list doesn't mention it and there is no `requirements.txt`. **Fix:**
`review/harness/requirements.txt` + README pointer.

### HG-5 — `run_diff.py` fails asymmetrically (Low)

The ZTE half degrades gracefully when its historical wraps are absent (HA-2 fix,
`run_diff.py:40-42`); the MediaExtract half at `:63-64` crashes with `RuntimeError:
me_v10.ts failed … Cannot find module`. Reproduced on the baseline run this round.
**Fix:** same skip guard for the media half.

### HG-6 — No post-promotion run record (Low)

The harness README's "Last run" tables stop at 2026-08-10 even though the v1.9 batch
was promoted 2026-08-11 with a "runs green" claim in REVIEW_v2_5. For a repo where
the harness *is* the gate, the run record is the audit trail. **Fix:** append dated
records for this round's baseline and gate runs, and state the convention.

### HG-7 — No CI (Low)

`check_related.py` (and the new `check_regex.py`) need only Python + PyYAML + Node —
no binary fixtures. **Fix:** `.github/workflows/harness.yml` running the
fixture-free suites on push, with a second job that builds fixtures and runs
`check_format.py`.

---

## DD — Documentation drift

All verified against file content this round:

- **DD-1** — `README.md:74` says "PromptVersion bump (now `v1.7`)"; Config is
  **v1.8** (`flow/v2_5/definition.json` Config) and the runbook at `README.md:293`
  says so. One un-updated sentence.
- **DD-2** — `LastError` (R13) is absent from the README runbook entirely: an
  operator reading the runbook doesn't learn Error rows now carry the failing action
  name and that the field clears on success.
- **DD-3** — `README.md:346-349` lists the TestPlanGen Copilot front end as
  deferred work; `README.md:183-193` and `testplangen/TestPlanGen_Setup.md` §"SHIPPED
  in v1.1" say it shipped.
- **DD-4** — README bundle table lists the TestPlanGen packages/definitions as
  v1.0 (the *filename* version); the component is at **v1.7** per
  `testplangen/CHANGES.md`.
- **DD-5** — `README.md:30` says the root prompt is "superseded by v1.2"; current
  is v1.3.
- **DD-6** — Four setup guides carry "(v1.0)" titles over newer content:
  `agent/QA_Agent_Setup.md` (pastes v1.1 instructions), `curation/Curation_Setup.md`
  (carries the v1.1 C11 fix), `testplangen/TestPlanGen_Setup.md` (v1.6/v1.7
  content), `testplangen/agent/Agent_Setup.md` (v1.6/v1.7 sections). Fix: drop the
  version from titles; state current component version in the opening line.
- **DD-7** — `testplangen/TestPlanGen_Setup.md:17-22` still says checking in
  `definition.json` "is a queued follow-on" while `:483-487` in the same file says
  that item is "CLOSED in v1.2, inverted".
- **DD-8** — `docs/SP_Adaptation_Notes.md` says dedup relies on "trigger
  concurrency 1"; the v2.5 `Recurrence` trigger carries **no**
  `runtimeConfiguration.concurrency` block (all 8 Foreach loops do). The doc now
  describes reality; making the original claim true is an optional designer edit
  (Phase-6 note).

---

## RL — Repo layout / versioning artifacts

- **RL-1** — The production AI prompt is `review/patches/DocIndex_Prompt_v1_3.md`
  while the root `DocIndex_Prompt.md` is v1.1. Fixed this round: new `prompts/`
  folder holds the *currently deployed* prompt for each component
  (`DocIndex_Prompt.md` = v1.3 content, `KeywordCuration_Prompt.md`,
  `TestPlanGen_Prompt.md`); the stale root copy is removed; `review/patches/` is
  reserved for promotion history and not-yet-promoted work.
- **RL-2** — `review/patches/ZipTextExtract_v1_6.ts` is dead weight (superseded,
  referenced only by a commented-out command). Deleted. `MediaExtract_v1_1.ts`
  stays — it is load-bearing for `check_batch.py`'s historical byte-diff. A new
  `review/patches/README.md` states each file's status so this is legible.
- **RL-3** — `flow/definition.json` is byte-identical to the v1.9 zip payload:
  the *oldest* definition in the tree, sitting unqualified at the top of `flow/`
  where it reads as current (PromptVersion v1.1, pre-rename TextsFolder). Moved to
  `flow/v1_9/definition.json` with a provenance CHANGES note, matching every sibling.
- **RL-4** — `DocIndexSweep_v2_3.zip`'s payload differs from
  `flow/v2_3/definition.json` by exactly one field: `PromptVersion` v1.4 (zip) vs
  v1.5 (folder). Someone bumped the checked-in JSON after cutting the package.
  **Recorded, not repaired** — the zip is the provenance artifact.
- **RL-5** — No single current-state view: versions live in a README table, five
  CHANGES chains, and file headers, which is how DD-1/DD-4 happened. Fixed: new
  root `STATUS.md` — one table of every deployed version with links — plus a README
  pointer.
- **RL-6** — CHANGES record gaps: `agent/CHANGES.md`'s v1.1 re-paste record still
  reads `pending`/`—` although v2.5's install steps require the paste;
  `curation/CHANGES.md` v1.1 has no deployment record at all;
  `testplangen/CHANGES.md:183` ("stays v1.0") contradicts `:118-122` ("now all say
  v1.1" — the yml headers do read v1.1). Fixed: the contradiction corrected; the two
  unverifiable paste records converted to explicit open-action lines surfaced in
  STATUS.md (user confirms dates in Phase 6). The three components' differing
  record-table *shapes* are noted, not normalized (churn > value).
- **RL-7** — No root `.gitignore` (only the well-maintained harness one) and no
  LICENSE. `.gitignore` added; LICENSE left as an owner decision (legal posture).

---

## PV — Privacy / portability

- **PV-1** — `kev14953@esri.com` appears as the connection `displayName` in
  `manifest.json` inside all seven `flow/DocIndexSweep_v*.zip` plus
  `testplangen/TestPlanGen_v1_0.zip` and `TestPlanGenCore_v1_0.zip` — nine tracked
  binary archives, invisible to grep over the source tree.
  **Disposition (owner delegated the call):** all nine zips re-cut with the email
  replaced by a generic connection label; `definition.json` payload bytes verified
  md5-identical before/after (v2_3's known one-field drift preserved as-is). No
  history rewrite: the old blobs remain in git history — acceptable while the repo
  is private; if it ever goes public, rewrite history then. Byte-provenance of the
  *manifests* is broken by design and recorded here and in each flow CHANGES.
- **PV-2** — Azure AD `tenantId` + creator/lastModifiedBy object IDs sit in every
  `definition.json` metadata block, and tenant hostname / site paths / list GUIDs /
  Graph drive IDs appear throughout (34 occurrences in v2.5 alone; partly forced by
  the connectors). **Accepted:** these are non-secret identifiers behind Entra auth;
  scrubbing them would break export fidelity. Recorded so the exposure is a known,
  chosen one.
- **PV-3** — `Config.SourceSiteUrl` in v2.5 is referenced **zero** times —
  `Get_files` hardcodes the same URL literally. Every other Config key has 1–6
  references. Designer edit (Phase 6, user picks): wire the key into `Get_files`,
  or delete it.

---

## Disposition summary

| Family | Fixed in repo this round | Gated batch (paste required) | Recorded / user action |
|---|---|---|---|
| SB | — | SB-1..9 (six scripts) | — |
| HG | HG-1, HG-3..7 | (gate itself) | HG-2 |
| DD | DD-1..8 | — | DD-8 designer option |
| RL | RL-1..3, RL-5..7 | — | RL-4, LICENSE |
| PV | PV-1 (zip re-cut) | — | PV-2 accepted; PV-3 designer edit |

## Round checklist (promotion + paste)

1. ~~Baseline: `make_fixtures` + `check_format` + `check_related` + `check_batch` green (2026-08-11, pre-change).~~ Done.
2. Repo-side fixes: DD, HG, RL, PV-1 (commits on this branch).
3. Author the r2 batch in `review/patches/`; gate with `check_batch_r2.py` —
   IDENTICAL on every existing fixture, PASS on every new-behavior assertion.
4. Promote the batch to `scripts/`; fold the gate's new assertions into the
   standing suites; mark `check_batch_r2.py` HISTORICAL; update STATUS.md and the
   harness run record.
5. **User: paste the six scripts** into the Automate-tab workbook (order per the
   gate output). Until pasted, the live flow still runs the previous versions —
   STATUS.md tracks this.
6. **User: designer edits** per `review/patches/designer-edits.md` §r2 (PV-3
   choice; optional DD-8 trigger concurrency).
7. **User: confirm** the agent-v1.1 / curation-v1.1 paste dates to close the RL-6
   open-action lines.
8. Post-paste: one sweep run; spot-check a `Nov`-named doc has empty
   `docRevision`; `LastError` empty on Indexed rows; append the deployment record.
