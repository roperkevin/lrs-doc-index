# DocIndex v2.5 — Full Codebase Review (2026-08-11)

Reviewed: the v2.5 flow definition (2,568 lines, diffed against v2.4), all six Office
Scripts, the Python review harness (every entry point **executed** against the current
scripts), all three TestPlanGen flow definitions, the Copilot Studio agent file sets,
both AI Builder prompt versions, the curation and QA artifacts, the six list schemas,
README, and every CHANGES chain. All five import packages were unzipped and their
payloads compared against the committed `definition.json` files (all match — the three
TestPlanGen zips byte-identically, the two flow zips semantically). Every finding below
was verified against the actual file content before being written down; agent-surfaced
suspicions that didn't survive verification were dropped.

**Overall verdict:** the system remains sound, and the prior review's fixes held: all
six auditable v1.9 findings (F1 single-escape, F2 oversize gate, F3 brace-slice,
F4/F9/F10 `$top`s, F12 `json('[]')`) are present and correct in v2.5 with no
regressions, the v2.5 row-id re-key is implemented consistently across all
twenty-plus reference sites, the schema↔flow cross-check found zero column
mismatches, and the harness runs green today. What follows is two findings that need
action **with the v2.5 rollout** (FL-1, FL-2), one unapplied performance patch
(SC-1), a set of silent wrong-output bugs in extraction (SC-2..SC-4), four harness
gaps that weaken the very gate the scripts depend on (HA-1..HA-4), a dead deliverable
link in the TestPlanGen agent (DX-1), and a long tail of low-severity hardening.

IDs: `FL` = main flow, `SC` = scripts, `HA` = harness, `DX` = docs/schemas/prompts/
secondary flows. The v1.9 review's F-numbers are referenced where relevant.

## Ranked findings

| # | Finding | Severity | Surface |
|---|---------|----------|---------|
| FL-1 | Skipped rows never receive the bumped PromptVersion → after the v1.7 bump every Skipped doc burns a MaxDocsPerRun slot **every run, forever** | **High** | Designer edit (1 field) |
| SC-1 | MediaExtract still runs the pre-F7 v1.0 plumbing — the gated v1.1 typed-array patch was never promoted; timeout risk on image-heavy decks | **High** | Harness gate + script paste |
| FL-2 | Upsert-before-sidecar reorder (v2.5 R4) opens a crash window that leaves a doc permanently Indexed with a stale or dead TextFileUrl | Medium | Designer edit (2 fields) |
| FL-3 | Error capture is half-built: `Err_detail` is computed in the catch and referenced nowhere — F6 neither finished nor removed | Medium | Designer edit or schema column |
| SC-2 | Slide order and "Slide N" labels use part-file numbers, not presentation order — reordered/pruned decks index in the wrong order with wrong numbers | Medium | Script change (gated) |
| SC-3 | pptx merged table cells double-count (`hMerge` continuation cells rendered **and** `gridSpan` padded) → column-shifted pipe tables | Medium | Script change (gated) |
| SC-4 | Sidecars embed image links for every referenced raster; MediaExtract's 12 / 350 KB / 3 MB caps mean some are never saved → permanent dead links | Medium | Script or flow change |
| DX-1 | TestPlanGen `DraftUrl` contains unencoded spaces → the agent's primary deliverable is a dead link in Teams chat | Medium | Designer edit (both flows) |
| DX-2 | DocIndex prompt's keyword rule ("singular, 1–2 words") contradicts its own examples ("centerlines", "straight line diagram") — the prompt actively generates the alias-split problem curation exists to clean up | Medium | Prompt bump (v1.3) |
| HA-1 | The harness's "malformed JSON params" test never reaches the code path it claims to test — deleting RelatedRank's parse guard still passes | Medium | Harness fix |
| HA-2 | Harness README's equivalence-gate recipe wraps current v1.8 as "v1.5" → verbatim use yields a spurious "FAIL — DO NOT PASTE" | Medium | Doc fix |
| HA-3 | `run_diff.py` media ground-truth is vacuous when both versions return zero images — a shared regression prints PASS | Medium | Harness fix (1 line) |
| HA-4 | Every `open()`/subprocess in the harness uses platform-default encoding; em-dash/`·`/’ are load-bearing → mojibake or spurious FAILs on Windows | Medium | Harness fix |
| DX-3 | QA setup guide: paste v1.1 instructions, record `v1.0` — corrupts the version audit trail | Medium | Doc fix (1 line) |
| DX-4 | TestPlanGen agent files edited in v1.5 without a version bump — CHANGES says v1.5, all five yml headers say v1.0, README says v1.0 | Medium | Version stamp + doc fix |
| FL-4..6, SC-5..14, HA-5..9, DX-5..16 | Low-severity tail (detailed below) | Low | Mixed |

---

## FL-1 — Skipped rows never receive the bumped PromptVersion (permanent budget leak)

**Severity: High.** This is the finding that matters most for the v2.5 rollout,
because v2.5 itself re-arms it by bumping `Config.PromptVersion` to `v1.7`.

**Evidence.** `Needs_index` (`flow/v2_5/definition.json:444`) reprocesses any row on
four OR'd legs — the fourth is a PromptVersion mismatch, applied regardless of
IndexStatus:

```
not(equals(coalesce(first(body('Check_indexed')?['value'])?['PromptVersion'], ''),
           outputs('Config')?['PromptVersion']))
```

`Create_doc_skipped` (line 2370) writes `item/PromptVersion` — but
`Update_doc_skipped` (lines 2384–2406) writes only
`Title / DocKey / FileName / IndexStatus / SourceModified / IndexedOn`. Verified by
enumerating both actions' parameter keys: the update path has no PromptVersion field.

**Failure scenario.** Every existing Skipped row — all pdf/html/msg/image files
(README line 328) plus every F2-gated oversize doc — carries `v1.6` or older. On every
run after the bump: PromptVersion leg fires → `If_process` true → `Increment_count`
**consumes one of the 150 slots** → Switch default → Skipped branch →
`Update_doc_skipped` runs and still doesn't write the version → identical loop
tomorrow, permanently. This violates the stated invariant "Skipped rows wait for a
source-file change" (README line 229) and never converges — even a source modification
doesn't clear it, since the update path never stamps the version. With N stale-Skipped
rows the advertised ~150-docs/day backfill is really 150−N/day; a pdf-heavy library
with N ≥ 150 starves indexable work entirely, silently. The v2.5 newest-first ordering
makes it worse: recently touched Skipped files jump the queue and take slots **first**.
Latent since v2.2's version gate; re-armed by every bump since (v1.4, v1.5, v1.6, and
now v1.7).

**Minimal fix (designer edit, 1 field).** `Update_doc_skipped` → add field
`PromptVersion` = `@{outputs('Config')?['PromptVersion']}`. Each bump then reconsiders
each skipped doc exactly once — matching `Create_doc_skipped` semantics. (Optionally
add `ExtractionLane`/`FileType`/`SourceLink` for parity with the create path, but
PromptVersion alone stops the loop.)

**Test.** After the bump, run twice over a pdf: run 1 updates the Skipped row (now
`v1.7`), run 2 must not enter `If_process` for it, and `Run_summary`'s processed count
should drop by the number of Skipped rows between the two runs.

---

## SC-1 — MediaExtract is still the pre-F7 v1.0 plumbing

**Severity: High.** The prior review's F7 patch shipped in two halves; only one was
pasted. ZipTextExtract v1.8 carries the full typed-array plumbing — `scripts/
MediaExtract.ts` does not.

**Evidence.** Current script: `b64ToBytes` returns `number[]` built with per-byte
`push` over the whole ~5 MB base64 payload (line 56); `inflateRaw(src, outHint)`
accepts `outHint` and **never uses it**, pushing every inflated byte into a growing
`number[]` (lines 155–156); `bytesToB64` builds output by single-string concatenation
(line 43); `extractEntry` copies with `slice` (line 121). Every one of these is the
exact pattern F7 replaced in ZipTextExtract. The patch
(`review/patches/MediaExtract_v1_1.ts`) is present in the repo, gated behind the
harness, and the harness's MediaExtract leg passes today (`run_diff.py`: both fixtures
IDENTICAL, ground-truth OK — subject to HA-3 below).

**Failure scenario.** F7's economics, shifted to the second script call: a deck with
up to 12 images / ~3 MB of deflated image data is decoded and inflated byte-by-byte
into boxed arrays, then re-encoded via string concatenation, against the same 120 s
Run-script ceiling. An image-heavy pptx can TimeOut in `Extract_media_pptx` even
though `Zip_extract_pptx` on the same file succeeds — producing an Error row and a
daily retry burn (the F8 media-skip condition doesn't help: these decks genuinely
have media). The v1.9 review measured the patch at 1183 ms → 290 ms on the big-deck
fixture in bare V8, with a larger absolute gap expected in the slower sandbox.

**Fix.** Run the harness gate over the reference set (after fixing HA-3 so the
ground-truth leg actually proves something), then promote `MediaExtract_v1_1.ts` to
the Automate tab and `scripts/MediaExtract.ts`. While pasting, also fix the three
cosmetic defects the patch does **not** address: the error prefixes that misattribute
failures to ZipTextExtract (`MediaExtract.ts:100,105,123,130` — a corrupt file fails
in MediaExtract but the Error row says "ZipTextExtract: …", sending triage to the
wrong script), the dead `utf8ToString` (lines 259–277, never called), and the missing
version stamp in the header (README asserts "v1.0" twice; the file says nothing —
install step 3 asks builders to verify "exact names (… MediaExtract v1.0 …)" against
a header that carries no version).

---

## FL-2 — Upsert reorder opens a crash-consistency window

**Severity: Medium.** A genuine regression introduced by v2.5's R4 (row upsert moved
before the sidecar write).

**Evidence.** `Create_doc`/`Update_doc` (lines 1366–1454) now write
`IndexStatus = Indexed`, current `SourceModified`, and `PromptVersion = v1.7` **before**
`Save_sidecar`, `Recycle_old_sidecar`, and `Set_text_url` run. Verified:
both upsert payloads carry `item/PromptVersion`; `Set_text_url` writes only
`DocKey / FileName / IndexStatus / TextFileUrl / Title`.

**Failure scenario.** `Catch_index` fires only on `Try_index` Failed/TimedOut. If the
*run itself* dies between the upsert and `Set_text_url` — flow cancellation, platform
outage, connection suspension, run-duration kill — no catch executes. The row is left
`Indexed` with all four `Needs_index` legs false: **the doc is never reprocessed**,
yet its sidecar is stale-named or absent — and if the abort landed after
`Recycle_old_sidecar` (which runs before the row is repointed), `TextFileUrl` is a
hard dead link into the recycle bin. In v2.4 the upsert was last, so any abort left
the row un-bumped and it self-healed next run. This is distinct from the documented
"seconds of empty TextFileUrl" accepted window, which only considers caught failures.

**Minimal fix (designer edit, 2 fields).** Remove `PromptVersion` from `Create_doc`
and `Update_doc`; add `PromptVersion` = `@{outputs('Config')?['PromptVersion']}` to
`Set_text_url`. An aborted run then leaves PromptVersion stale ('' on create, old
value on update) → the row regates next run. Secondary hardening: move
`Old_sidecar_url`/`If_sidecar_moved` (the recycle pair) to run **after**
`Set_text_url`, so the row never points at an already-recycled file.

**Test.** Smoke a doc, cancel the run mid-`Try_index` after the upsert; verify the
next run reprocesses it (PromptVersion leg) and heals the sidecar + URL.

---

## FL-3 — Error capture computed, then thrown away

**Severity: Medium (observability).** F6 is half-applied: `Filter_failed` (line 2424)
and `Err_detail` (lines 2432–2439) exist exactly per the designer-edits patch — but
`outputs('Err_detail')` is referenced **nowhere** (verified: zero occurrences), neither
error write carries a `LastError` field, and `schemas/SPList_DocIndex.csv` has no
LastError column. Context: v2.3 deliberately dropped the LastError writes when the
rebuilt list lost the column (`flow/v2_3/CHANGES.md`) — but the composes stayed
behind, so the flow now *implies* error capture that isn't happening, and the original
F6 pain (an Error row older than the 28-day run history is undiagnosable) is back.

**Fix.** Either finish F6 — re-add the plain-text `LastError` column (additive, no
classic-UI dance), write `@{outputs('Err_detail')}` in `Create_doc_error`/
`Update_doc_error`, clear it on the success path — or delete the two dead actions.
Finishing it is recommended; the hard part (failure extraction) is already built.

---

## SC-2 — Slide order and labels come from part filenames

**Severity: Medium (silent wrong output).**

**Evidence.** `ZipTextExtract.ts:87–92` sorts `ppt/slides/slideN.xml` entries by the
numeric N in the part name; line 146 emits `## Slide N` headings from the same number.

**Failure scenario.** PowerPoint does not renumber slide parts on reorder or delete;
true order lives in `ppt/presentation.xml` (`p:sldIdLst`) resolved through
`ppt/_rels/presentation.xml.rels`. A deck whose slides were reordered is indexed in
creation order, not display order — the AI summary, the sidecar body, and every human
reader see the wrong narrative sequence; a deck with deleted slides shows "## Slide 9"
in a 5-slide deck. Silent both ways.

**Fix (next gated script paste).** Read `presentation.xml` + its rels, resolve
`sldIdLst` r:ids to part names, and order/number by list position; fall back to the
current numeric sort when either part is missing/unparseable. Note the harness's
notes-interleaving fixtures assert against the current behavior, so regenerate
expectations alongside.

## SC-3 — pptx merged cells double-counted

**Severity: Medium (silent wrong output).**

**Evidence.** `renderTables` (`ZipTextExtract.ts:295–311`) pads `span-1` empty cells
for `gridSpan` in both namespaces. Correct for WordprocessingML (`w:tbl`), where
covered cells are absent from the markup — but DrawingML (`a:tbl`, pptx) **keeps** the
merged-away cells as `<a:tc hMerge="1"/>`, so the code pads *and* renders the
continuation cell. Verified: no `hMerge` handling anywhere in the file.

**Failure scenario.** A 3-column pptx table with a `gridSpan="2"` header cell renders
`[c1, "", "", c3]` — width inflates to 4, every other row gains a phantom trailing
column, and the same field sits in different columns across rows. Schedule tables with
merged header cells (common in this corpus) come out column-shifted in the sidecar and
in whatever the AI summarizes from it.

**Fix.** In the pptx cell loop, skip cells whose opener contains `hMerge="1"` (or
`hMerge="true"`); keep gridSpan padding as-is. Gated paste + harness fixture with a
merged pptx table.

## SC-4 — Sidecar image links MediaExtract will never satisfy

**Severity: Medium.** The v1.9 review's verify-list item 5, now confirmed as a real
defect rather than an oddity: `ZipTextExtract.ts:124–131` emits `![f](prefix+f)` for
**every** referenced raster, unconditionally; `MediaExtract.ts:18–20` independently
enforces `MAX_IMAGES = 12`, `MAX_ONE = 350 KB`, `MAX_TOTAL = 3 MB` and drops the rest
into `skipped`. A deck with a 500 KB full-slide screenshot (routine for modern
screenshots) gets a sidecar link to an image that is never saved — a permanent dead
link in the published corpus, which the Q&A agent also ingests.

**Fix options.** (a) Mirror the caps in ZipTextExtract — it already has each entry's
`uncompSize` from the central directory, so it can apply the same 12/350 KB/3 MB
arithmetic to decide which links to emit (keeps the two scripts' contract implicit but
byte-consistent); or (b) flow-side, strip links whose basename appears in
MediaExtract's `skipped` output before `Save_sidecar`. (a) is cleaner; either way add
a harness fixture with an over-cap image asserting no dangling link.

---

## DX-1 — TestPlanGen DraftUrl is a dead link in chat

**Severity: Medium.** `Draft_url` (`testplangen/flow/core_v1_0/definition.json:688`,
same in `v1_0/definition.json`) concatenates
`SiteUrl + '/Shared Documents/Test Plan Drafts' + '/' + Draft_name` — two literal
spaces. The agent relays it verbatim (`topics/GenerateTestPlan.mcs.yml:99`:
`Draft ready: {Topic.DraftUrl}`); Teams auto-linking terminates at the first space, so
the user gets a clickable `…/lrsworkspace/Shared` (404) plus trailing text. The flow
authors knew about this class — the draft banner wraps the sidecar URL in `<…>`
(line 648) — but the output contract's URL is bare. **Fix:** `replace(..., ' ', '%20')`
in `Draft_url` (both flows), or take the link from `Save_draft`'s response metadata.
Update agent smoke row 1 to require clicking the link *from Teams*, which would have
caught this.

## DX-2 — The indexing prompt manufactures the alias problem

**Severity: Medium.** Both prompt versions (`DocIndex_Prompt.md:99,117–119,147`;
identical in `DocIndex_Prompt_v1_2.md`) state the keyword rule "lowercase,
**singular**, **1–2 words**" — and then give a "Good keywords" list dominated by
plurals plus a 3-word term (`events, centerlines, calibration points, …,
straight line diagram`), with the worked example emitting `["centerlines", …]`.
Models follow examples over rules; the Keywords list gets seeded with plural forms,
and the weekly curation flow then proposes exactly these merges — its own canonical
example is `"centerlines" → "centerline"` (`KeywordCuration_Prompt_v1_0.md:88`).
Meanwhile split keyword identity degrades RelatedRank overlap corpus-wide until the
(not yet built) librarian backfill re-points historical junction rows. **Fix:** in a
`DocIndex_Prompt_v1_3` bump, either make the exemplars obey the rule or relax the rule
to match reality ("singular preferred; established plural/multi-word terms allowed"),
and carve out tool-derived topics like "straight line diagram". Prompt-text change →
this one genuinely bumps `Config.PromptVersion` per the runbook.

---

## HA-1..HA-4 — The gate the scripts depend on has soft spots

The harness is in unusually good shape — every entry point runs green against the
current v1.8/v1.1/v1.2 scripts, the RelatedRank reimplementation was verified
number-for-number (IDF `1/log2(1+df)`, df counting, tie-breaks, topN), the fixtures
are genuine OOXML with spec-valid hand-built PNGs, and exit codes are sound. Four
gaps, all verified empirically:

**HA-1 (Medium) — the safety-contract test tests nothing.**
`check_related.py:174–180` ships `"myKws": "not json"` through the wrapper appendix —
which `JSON.stringify`s it into *valid* JSON (`'"not json"'`), so RelatedRank's
`parseRows` try/catch is never reached; only the valid-JSON-wrong-type branch runs.
Verified: deleting the try/catch from a copy of the script still passes the assertion.
A patch that breaks the production defense against garbled `string(body(...))` input
sails through. The dead `raw_params` parameter at line 88 is the never-wired intended
mechanism. **Fix:** pass a pre-stringified raw field through the appendix
(`p.myKwsRaw !== undefined ? p.myKwsRaw : JSON.stringify(p.myKws)`) and feed genuinely
malformed text; delete the dead parameter.

**HA-2 (Medium) — the README recipe now produces a false "DO NOT PASTE".**
`harness/README.md:34` still says `python3 wrap.py ../../scripts/ZipTextExtract.ts
zte_v15.ts` — but that file is v1.8, whose format changes (title headings, interleaved
notes, core-props fields) are intentional. Following the doc verbatim today prints
`DIFF!` on all three ZTE fixtures and `RESULT: FAIL — DO NOT PASTE` (reproduced). A
reviewer either wrongly blocks a paste or stops trusting the harness. **Fix:** fetch
the historical v1.5 from git history in the recipe (`git show <pre-v2.2-sha>:scripts/
ZipTextExtract.ts`), or mark the ZTE rows historical-record-only; the MediaExtract half
of the recipe is still live and correct.

**HA-3 (Medium) — media ground-truth is vacuous at zero images.**
`run_diff.py:63–69`: the `images[]` verification loop never runs when both versions
return empty, `gt` stays True, and nothing asserts `count > 0` even though both
`MEDIA_FILES` fixtures deliberately plant images. A shared regression (filter regexp,
inflate bug) in *both* the script and the patch prints `IDENTICAL … ground-truth=OK →
PASS`. Since SC-1's promotion decision rides on this gate, fix it first:
`ok &= a['out']['count'] > 0` for media fixtures.

**HA-4 (Medium) — platform-default encoding throughout.**
All six Python files open text and decode subprocess output without `encoding=` —
and non-ASCII is load-bearing: the scripts emit `—` in slide headings and `·` in
`why` strings, fixtures plant `Miguel O’Brien`, and the harness regexes/compares all
three. On Windows (cp1252 default) `wrap.py` writes a mojibake runner and the format
assertions wall-of-FAIL; on a non-UTF-8 POSIX locale, `text=True` decoding can raise
outright. For a SharePoint/Office team, Windows is a realistic runner. **Fix:**
`encoding='utf-8'` on every text-mode `open()` and `subprocess.run(..., text=True)`.

---

## DX-3 / DX-4 — Version-trail integrity

**DX-3 (Medium).** `agent/QA_Agent_Setup.md:78–83` instructs: paste the block from
`QA_Agent_Instructions_v1_1.md`, then "Record `AgentInstructionsVersion: v1.0`". The
instructions artifact itself says record v1.1. A fresh deployment following §3
literally records the wrong version, and the drift check ("re-paste from the current
artifact") then compares against a false baseline. Fix line 82 → `v1.1` (or "the
version of the file you pasted").

**DX-4 (Medium).** `testplangen/CHANGES.md:29–31` records the v1.5 release as touching
"Agent instructions + topic text … v1.5" — but all five
`agent/TestPlanGenAgent/*.mcs.yml` headers still read `# TestPlanGenAgentVersion:
v1.0`, and README line 43 agrees with the files. The v1.5 edit (the doc_id caveat in
instructions and `askStoryId` text) was a post-deployment text change with no bump in
the artifacts — the exact "instructions drift" failure the smoke triage warns about:
a tenant deployed at v1.0 passes the version check while running stale text. Fix:
stamp the five headers (v1.1 or v1.5 — pick one convention), align CHANGES + README,
add the re-paste record row.

---

## Low-severity tail

### Flow (v2.5)

- **FL-4 — R8's `$orderby` re-arms the scale cliff F4 removed.** `Get_files`
  (line 351) now sorts `Modified desc`; F4's ">5000 items page safely" rationale held
  only for *unsorted* enumeration. Once the library crosses ~5,000 items, a sort on an
  unindexed column makes SharePoint reject the query outright — a hard, visible
  `Get_files` failure (better than silent truncation, but a cliff). The CHANGES
  addendum documents it; act on it **now** while it's free: add a column index on
  Modified in the source library (painful to add after 5k), keep watching
  `Run_summary`'s items-seen tripwire.
- **FL-5 — malformed `dcterms:modified` is the last deterministic poison-doc path.**
  `ZipTextExtract.ts:233` returns the raw element text unvalidated; the header strip
  (line 1249) runs it through `formatDateTime`, which throws on non-date input →
  Error row → daily retry loop (F2/F3 economics). Hand-edited or exotic-producer OOXML
  only. Fix in the next script paste (keep `lastEdited` only if it date-parses) or
  flow-side emit the raw string in the strip as the YAML line already safely does.
- **FL-6 — residual duplicate-DocKey window in the re-armed catch.** The
  `empty(variables('DocRowId'))` conjunct (line 2448) only flips after
  `Set_DocRowId`, two practically-failure-proof actions after `Create_doc`; a failure
  in that gap could mint a DocKey twin via `Create_doc_error`. Airtight variant:
  include `coalesce(outputs('Doc_item_id'), '')` in the emptiness check. Informational.

### Scripts

- **SC-5 — astral-plane entities decode to garbage.** `String.fromCharCode(parseInt(h,
  16))` (`ZipTextExtract.ts:207,386`) truncates to 16 bits: `&#x1F600;` → U+F600
  private-use junk. Use `String.fromCodePoint` (available in the runtime).
- **SC-6 — rels regex assumes `Id` precedes `Target`** (`ZipTextExtract.ts:119`).
  Attribute order isn't significant; third-party OOXML writers that emit `Target`
  first silently map zero images. Extract the two attributes independently per
  `<Relationship>` tag, as the notes-resolution loop already does.
- **SC-7 — the `\d{10,}` strip runs on final assembled text** (`ZipTextExtract.ts:402`):
  a 10-digit phone/serial number in a table vanishes, and a `mediaPrefix` or filename
  containing a 10+ digit run would corrupt the script's own emitted links. Run the
  strip before appending generated markdown, or exempt `](...)` spans.
- **SC-8 — stored-block inflate reads out of bounds silently** (`ZipTextExtract.ts:
  566–569`; same in MediaExtract): no bounds check → truncated input yields
  zero-padded "successful" extraction, violating the never-silently-wrong posture
  (Huffman blocks throw; stored blocks don't). Add `if (pos + len > src.length) throw`.
- **SC-9 — heading detection is English-only** (`w:val="Heading([1-6])"`, line 360):
  non-English Word style IDs (e.g. `berschrift1`) flatten all structure. Acceptable
  for this corpus; document it.
- **SC-10 — literal `#` at line start in document text becomes a sidecar H1**, breaking
  the "H1 unique to the flow header" contract (pasted markdown in decks is common).
  Escape leading `#` on content lines after the tag strip.
- **SC-11 — MediaExtract cosmetics** (fold into the SC-1 paste): "ZipTextExtract:"
  error prefixes, dead `utf8ToString`, missing version header (also DX-listed since
  README asserts v1.0 twice).
- **SC-12 — RelatedRank defensive gaps.** (a) Line 141: a sharers/idLinks row where
  *neither* endpoint is `self` silently credits doc A with 1000+ points — one guard
  line (`if (a !== self && b !== self) continue;`) closes it. (b) Line 181: a broken
  keyword lookup renders raw list-item ids into the human-readable `why`
  ("3 shared keywords: 41, testing, 87") that gets written into sidecars — drop
  title-less keywords from the display list, keep them in the score.
- **SC-13 — SidecarPatch out-of-band-edit fragility.** (a) A sidecar re-saved with
  CRLF or a BOM never matches `"```yaml\n"` at position 0 → every future patch is a
  silent no-op and the related section goes permanently stale (no Error row).
  Normalize (strip BOM, tolerate `\r\n`) on entry. (b) Unescaped `]`, `>`, or `-->`
  in a SharePoint Title/keyword can malform the rendered bullet; strip those five
  metacharacters from title/why before rendering. (c) The marker-fallback bullet
  (line 195) uses a bare filename as the URL — wrong whenever the neighbor lives in a
  different kind subfolder (v2.4+); pass the folder into the fallback path.
- **SC-14 — zip-layer edge posture** (both zip readers): encrypted entries (GP bit 0)
  aren't rejected — a stored-method encrypted entry would return ciphertext as "text"
  silently; one bit-check in `extractEntry` closes the only silent path. zip64 and
  UTF-8-flag filename decoding are correctly out of scope at a 5 MB cap (they fail
  loudly or don't matter for ASCII part names).

### Harness

- **HA-5** — `render_sample.py:67` renders `prompt_version: "v1.6"` and its docstring
  cites `flow/v2_4`; Config is `v1.7`. The "eyeball artifact for the current format"
  displays a stale version. Bump both.
- **HA-6** — `check_related.py:393`: the placement assertion's right bound adds
  `+ len(body)`, making the second comparison always true — the check reduces to
  "Summary precedes Related documents". Delete `+ len(body)`.
- **HA-7** — `check_format.py:118–120`: the notes-ownership check only asserts *some*
  slide heading appears earlier in the file — all notes clumped at the end would pass.
  Assert each notes block falls between its slide's heading and the next.
- **HA-8** — recall counts substring hits (`'route' in 'routes'`,
  `check_format.py:170`, `run_diff.py:49`); mitigated by unique planted tokens, noted
  for accuracy.
- **HA-9** — asserted-but-unexercised contracts: RelatedRank's `min(kwScore, 999)` cap
  (the invariant that id-links structurally outrank keywords) is never tested at the
  boundary; SidecarPatch is never fed malformed top-level JSON the way RelatedRank
  nominally is; `run_diff.py`'s "byte-diff" is actually parsed-JSON equality (harmless,
  README overstates).

### Docs / schemas / prompts / secondary flows

- **DX-5** — README line 96 mislabels the v2.3 related-documents bump as `v1.4` (it
  was `v1.3`; `v1.4` was the preview-metadata addendum), contradicting its own runbook
  and the CHANGES chain, and omits the `v1.5` rarity addendum from the highlights
  paragraph.
- **DX-6** — `DocIndex_Prompt.md` header still says "v1.0" (README says v1.1 — the
  v1.2 patch even acknowledges the lag) and its wiring note still instructs
  "Write PromptVersion = \"v1.0\"" — inherited by reference into v1.2 ("wiring notes:
  unchanged"). Hand-setting that today (Config is v1.7) would trigger a full-corpus
  reindex storm. Fix the header; change the note to "PromptVersion is stamped from
  Config; never hand-set it."
- **DX-7** — TestPlanGen exemplar "release preference" treats empty-equals-empty as a
  match (`core_v1_0/definition.json:407`): a story with no TargetRelease
  "release-matches" every same-surface plan that also lacks one — typically the
  oldest, least-curated plans — and those win outright over newer exemplars. Gate on
  `not(empty(...))` so an empty story release falls through to newest-two.
- **DX-8** — draft filenames are minute-granular (`yyyyMMdd-HHmm`, three sites): two
  runs on the same story within a minute silently overwrite, violating "a re-run must
  never clobber a draft". Add seconds.
- **DX-9** — two "degrades, never errors" claims are overstated: TestPlanGen's
  `related:` bracket check doesn't guarantee `json()` parses (internally invalid line
  → Catch, not degrade), and curation's `Parse_proposals` throws on `{oops}` between
  outermost braces → Terminate Failed, not a zero-proposal run. Soften the docs or
  wrap the parses.
- **DX-10** — `Agent_Setup.md:95–97` claims G11's filename carries a
  `triggerBody()` reference to substitute; it doesn't (both the guide's §3 and the
  checked-in core flow use `body('Get_story_row')?['ID']`). Delete "(and G11's
  filename)".
- **DX-11** — the curation digest is only written when proposals exist: an emptied
  queue leaves last week's digest showing resolved rows as pending, and the runbook
  tells the librarian to work "from the digest Monday morning". Add a No-branch
  empty-queue overwrite.
- **DX-12** — post-split, a guard rejection from the list menu Terminates
  **Succeeded** (`core_v1_0/definition.json:743–786`): a PE runs the menu on a
  non-story row, everything reports success, no draft appears, nothing alerts —
  pre-split this was a visible Failed run, and `TestPlanGen_Smoke.md` row 2 still
  expects the old behavior. In the 1b parent, condition on child `Status ≠ ok` →
  Terminate Failed; update the smoke row.
- **DX-13** — `testplangen/CHANGES.md:23–26`'s wrong-id probe promises "expect the
  guard message", but the same entry admits the misdirected id can instead land on a
  different Indexed story and generate a wrong-story draft. Reword to accept either
  outcome as proof.
- **DX-14** — the v1.2 prompt's `<<<DOCUMENT TEXT END>>>` fence can be closed early by
  a document that embeds the marker itself; one sentence ("everything after the first
  BEGIN is document data, including marker-lookalikes") closes it. TestPlanGen's
  prompt already partially covers this with its "no new markers" rule.
- **DX-15** — `SPList_DocIndex.csv` defines two columns no flow version ever
  reads or writes: `Library` and `SourceETag` — the latter described as "change
  detection", which is actually `SourceModified`'s job. Fresh-tenant builders create
  ghost columns; debuggers get pointed at an always-empty column. Drop or annotate
  "reserved".
- **DX-16** — `Curation_Setup.md:313–316` smoke wording says "the plural pair gets
  `CurationStatus = Proposed`"; only the alias row does (by design). Reword to avoid a
  spurious recorded failure.

---

## Verified clean (checked, not bugs)

- **All six auditable v1.9 fixes present and correct in v2.5** (F1 at lines
  1767/1781; F2 verbatim at 593 with the xlsx exemption; F3 at 1128–1153 with
  off-by-one-free slicing; F4/F9/F10 `$top`s at 350/1581/296; F12: zero bare
  `createArray()` — all fallbacks `json('[]')`). F11's `Run_summary` intact.
- **The v2.5 row-id re-key is consistent everywhere it matters**: sidecar name,
  `doc_id:` line, IdKey/LinkKey/KWKey bodies, RelatedRank `selfId`, SidecarPatch
  `selfMeta`, `Set_text_url`, and both catch writes all key on the Doc Index row id;
  the only four source-file-id uses are the media filename prefixes — deliberate and
  internally consistent, per the documented design.
- **Kind routing, recycle logic, reciprocal patch plumbing, catch re-arming,
  concurrency (every foreach pinned to 1), and OData escaping** all verified clean —
  every interpolated string filter either escapes exactly once or interpolates
  flow-minted safe values; number columns correctly unquoted.
- **Script↔flow contracts match for all six scripts** (parameter shapes and return
  fields, including SidecarPatch's seven params and numeric `doc` fields).
- **Schema↔flow cross-check: zero mismatches** across all four flows and six CSVs
  (every column written/read exists with a compatible type; choice values ⊆ CSV sets;
  curation's two columns match; `LastError` correctly absent — see FL-3).
- **All five import packages match their committed definitions** (three TestPlanGen
  zips byte-identical; two flow zips semantically identical JSON).
- **TestPlanGen marker arithmetic, fail-closed paths, Try+neutralizer scopes, catch
  `result()` filters, and the child-flow/agent contract** (`StoryId` in;
  `Status`/`DraftUrl`/`GenSummary` out; `ok`/`guard`/`nodraft`/`error` handled in the
  topic) verified end-to-end.
- **Harness fidelity**: RelatedRank reimplementation recomputed by hand and matches
  (IDF weights to 3 decimals, tie-breaks, self-exclusion, topN); wrap stubs match
  every `main()` signature; fixtures are genuine OOXML with spec-valid PNGs;
  `.gitignore` complete; all gates green against current scripts this session.
- **Version chains otherwise accurate**: PromptVersion v1.2→v1.7 consistent across
  README runbook, three CHANGES files, and Config; script headers match README except
  MediaExtract (SC-11/DX); QA instructions v1.0→v1.1 diff matches its claim; action
  counts in TestPlanGen CHANGES match the definitions exactly.

## Repo-side fixes applied (this branch)

The findings fixable in repository files alone were applied alongside this
review; all harness gates re-run green afterward, and the HA-1 fix was
teeth-tested (guard removed from a script copy → the new assertion fails, as
it must). Applied: **HA-1** (raw-param injection wired through the wrapper
appendix; dead `raw_params` removed; wrong-type case kept as a second
assertion), **HA-2** (README recipe marks the ZTE gate historical with the
`git show fd9d1c2:` fetch; `run_diff.py` now skips the ZTE pair gracefully
when not wrapped), **HA-3** (zero-image media runs now fail as VACUOUS),
**HA-4** (`encoding='utf-8'` on every text `open()`/subprocess across all six
files), **HA-5** (sample renders `v1.7`, docstring cites v2_5), **HA-6**
(vacuous `+ len(body)` bound removed), **HA-7** (notes-ownership now asserts
one notes block per slide segment), **DX-3** (record v1.1), **DX-4** (five
yml headers, CHANGES table, and README row aligned at
TestPlanGenAgentVersion v1.1, with a post-release correction note), **DX-5**
(README bump chain corrected), **DX-6** (prompt header v1.1; wiring note now
says never hand-set PromptVersion), **DX-9** (both degrade claims scoped to
what the expressions actually guarantee), **DX-10** (single-G1 substitution),
**DX-13** (wrong-id probe accepts either outcome), **DX-15** (`Library`/
`SourceETag` marked RESERVED), **DX-16** (alias-row-only wording), and the
SC-11/DX-7 header stamp (`MediaExtract v1.0`). **DX-2 + DX-14** are authored
as `patches/DocIndex_Prompt_v1_3.md` (PROPOSED — takes effect only when
pasted, with Config → PromptVersion `v1.8`).

Still requiring tenant-side action (designer edits / Automate-tab pastes /
list settings): FL-1..FL-6, SC-1..SC-10, SC-12..SC-14, DX-1, DX-7, DX-8,
DX-11, DX-12, HA-8/HA-9 (optional), and the v1.3 prompt paste itself.

## Recommended order of work

1. **With the v2.5 rollout (designer edits, minutes):** FL-1 (`PromptVersion` on
   `Update_doc_skipped`) and FL-2 (move the `PromptVersion` stamp to `Set_text_url`).
   FL-1 especially — the v1.7 bump activates the leak on day one.
2. **This week:** HA-3 (one line — it gates the next step), then run the harness gate
   and promote MediaExtract v1.1 (SC-1), folding in the SC-11 cosmetics. DX-1
   (DraftUrl encoding) — two-flow designer edit plus one smoke-row wording.
3. **Next gated script paste (one batch, one harness run):** SC-2 (slide order),
   SC-3 (hMerge), SC-4 (link/save cap coherence), SC-5..SC-10, SC-12..SC-14, FL-5
   (date validation in `extractCoreProps`).
4. **Next prompt bump (v1.3):** DX-2 (keyword exemplars) + DX-14 (fence sentence) —
   one re-paste, one `Config.PromptVersion` bump, rides the existing backfill.
5. **Paper cuts batch (docs/schemas/harness, no runtime risk):** FL-3 (finish or
   delete), FL-4 (index Modified now), HA-1/HA-2/HA-4..HA-7, DX-3..DX-13, DX-15,
   DX-16.
