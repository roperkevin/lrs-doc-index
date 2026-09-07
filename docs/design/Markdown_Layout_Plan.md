# Markdown Layout Plan

A rethink of how this project *writes markdown* — across the sidecar
corpus, the TestPlanGen drafts, the browse/catalog pages, and the wiki.
Companion to `Sidecar_Format_Plan.md` (which settled the sidecar
header, the filenames and the case grammar) and to
`Local_TestPlanGen_Plan.md` (which settled the draft contract). Those
two plans are in force and mostly stay; this one is about the layer
neither of them owns.

Repo paths are in `roperkevin/lrs-doc-index`.

---

## 1. Summary

**There is no markdown layout strategy. There are five emitters, each
of which invented one.** `sweep.mjs` writes sidecars,
`casegrammar.mjs` and `storyprofile.mjs` write their bodies,
`indexpages.mjs` writes the browse and catalog pages,
`testplangen.mjs` writes drafts, and `wiki.mjs` re-writes all of it as
a site. Each layout is defensible on its own. Together they disagree
about the four things that matter — how a document's metadata is
carried, how a test case is written down, how machine data is hidden
in the text, and which markdown dialect the output has to survive —
and every disagreement costs a parser, a special case, or a rendering
defect.

**The dialect assumption is wrong in one place, and it is the newest
one.** Every emitter targets GitHub-flavored markdown: GFM alerts
(`> [!WARNING]`), task lists (`- [ ] 1. …`), pipe tables. GitHub
renders them, SharePoint's preview tolerates them, and
`render/draft2docx.mjs` explicitly understands both (`:24-29`,
`:101-122`). MkDocs Material — the wiki, shipped last — renders
neither: `mkdocsYml` (`wiki.mjs:462-468`) enables `tables`,
`attr_list`, `admonition`, `fenced_code` and `toc`, so a GFM alert
becomes a blockquote with a literal `[!WARNING]` in it and a task list
becomes literal `[ ]` text. The wiki also passes sidecar body text
through unescaped (`wiki.mjs:335`), so any `<…>` or `{…}` run the
extractors carried out of a real document is eaten by python-markdown,
and it drops the `## Esri documentation` block entirely — that block
sits between `related:end` and the `---` seam, and `bodySeamEnd`
(`doclinks.mjs:256-264`) starts the body *after* the seam.

**The same test case is written two ways by two emitters that were
designed to agree.** `casegrammar.mjs:634` mints `TC-P01`;
`prompts/testplan_draft.md:114` mints `TC-P1`. The sidecar writes
`- **Expected Result:** …` as a bullet (`casegrammar.mjs:277`); the
draft writes `**Expected Result:** …` as a bare bold line
(`testplan_draft.md:119`). `caseindex.mjs:373` absorbs both, which is
why nobody noticed — the cost is paid downstream, in catalogs whose
rows do not sort together and in a finalize-and-re-index round trip
that changes a plan's case ids.

**Recommendation in one paragraph.** Extract one **layout kernel**
(`pipeline/lib/mdlayout.mjs`) that owns the four primitives every
emitter needs — the metadata table, the machine-comment grammar, the
callout, and the case block — plus one normalizer and one lint, and
render every markdown file in this repo through it. Give the kernel
an explicit **dialect contract**: the source of truth stays GFM
(GitHub, SharePoint, docx renderer, the Q&A agent all read it), and
the wiki lane *translates* rather than mirrors. Give drafts the same
document skeleton as sidecars so the catalog can read them. Unify the
case block end to end. Slim the header by dropping empty rows instead
of printing ten of them. Roll it out in six phases, the first of which
is a pure refactor gated on byte-identical output.

---

## 2. What was reviewed

Five emitters, in the order a byte travels:

| Emitter | Writes | Layout owned at |
|---|---|---|
| `pipeline/sweep.mjs` | the sidecar header + assembly | `sidecarHead` :691, `sidecarTail` :695, `renderBody` :311 |
| `pipeline/lib/sidecarmeta.mjs` | the metadata table + its readers | `META_ROWS` :39, `renderMetaTable` :70 |
| `pipeline/lib/casegrammar.mjs` / `storyprofile.mjs` | the per-kind body profiles | `:655-665` / `:33-35` |
| `pipeline/lib/indexpages.mjs` | `_Index.md`, `_Case Catalog.md`, `_Figure Catalog.md` | `TABLE_HEAD` :39 |
| `pipeline/testplangen.mjs` + `prompts/testplan_draft.md` | the draft file | banner :2159, assembly :2193, contract `testplan_draft.md:68-228` |
| `pipeline/wiki.mjs` | the MkDocs site | `docPage` :298, `mkdocsYml` :442 |

Four consumers, each of which renders or parses that output:

| Consumer | What it does with the markdown |
|---|---|
| GitHub / devtopia | renders the wiki repo's README, and any sidecar opened in a browser |
| SharePoint preview + search, and the Q&A agent (`docs/qa-agent-instructions.md`) | retrieves the file *as text* — every metadata row has to be in the body text, which is why format 3.0 killed the yaml (`Sidecar_Format_Plan.md` §4.2) |
| MkDocs Material (`wiki.mjs`, `mkdocs build --strict`) | the only true markdown *renderer* in the chain |
| `render/draft2docx.mjs`, `draft2pptx.mjs`, `deckspec.mjs` | parse the draft's markdown into OOXML |

Plus the parsers: `sidecarmeta.readMeta`, `caseindex.extractCases`
(`:373`), `doclinks.bodySeamEnd` (`:256`), `draftlint.lintDraft`
(`:91-100`), `wiki.planCases` / `bodyFigures` (`:240`, `:256`).

---

## 3. Findings

### 3.1 Five emitters, five layouts

| | Sidecar | Draft | Wiki doc page | Catalog page |
|---|---|---|---|---|
| Title | `# <AI title>` | `# Test Plan — <feature>` (model) | `# <AI title>` | `# <folder> — index` |
| Metadata | 10-row `\| Field \| Value \|` table, every row present | none — an HTML comment (`:2159`) and a `> [!WARNING]` prose banner (`:2162`) | the same 10 rows, values linked (`wiki.mjs:311-322`) | a 4-column doc table (`indexpages.mjs:39`) |
| Body seam | `---` after the related region | none | `---` before the body (`wiki.mjs:336`) | none |
| Machine data | `<!-- related:begin -->`, `<!-- docs:begin -->`, `<!-- rel:N s=… -->`, `<!-- src: … -->`, `<!-- slide N -->` | `<!-- machine-generated … -->`, `<!-- verify: … -->` | all comments stripped (`:98`) | none |
| Sections | profile-dependent: `## Overview` / `## Test Cases` / `## Other content`, or the six `story/v1` names, or raw slides | 8 fixed + 2 conditional model sections, then 5 machine addenda | `## Summary`, `## Related documents`, then the body verbatim | one `##` per folder / per plan |
| Provenance of a section | the `<!-- src: … -->` on each case | an italic sentence, `_Deterministic addendum — …_`, repeated per addendum | dropped | n/a |

### 3.2 The four disagreements

1. **Metadata.** Three shapes for the same facts: the sidecar's
   `| Field | Value |` table, the draft's `| Surface | Target release |
   PE |` one-row table inside `## Overview`
   (`testplan_draft.md:74-77`), and the catalogs' wide doc tables. The
   row set is spelled out three times — `META_ROWS`
   (`sidecarmeta.mjs:39`), the `rows` array in `docPage`
   (`wiki.mjs:311`), `TABLE_HEAD` (`indexpages.mjs:39`) — so adding a
   field is a three-file change with no gate that they agree.
2. **The case block.** Two emitters of one grammar, differing in id
   padding (`TC-P01` vs `TC-P1`) and in whether the field lines are
   bullets. `caseindex.mjs:373` tolerates both, so the divergence is
   invisible until a catalog sorts `TC-P1, TC-P10, TC-P2` next to
   `TC-P01, TC-P02, TC-P10`.
3. **Machine data.** Five comment grammars (§3.1 row 4), each with its
   own reader: `parseRelMarker` (`sidecarmeta.mjs:237`), the
   `docs:begin/end` slice (`doclinks.mjs:359`), the `src:` capture in
   `caseindex.mjs:373`, the `slide N` regexes in `presentation.mjs`
   and `storyprofile.mjs`, and nothing at all for the draft's two.
   None of them is key/value, so `shape` and `confidence` — which the
   case grammar computes — could not be carried in the file and live
   only on the SharePoint list.
4. **Dialect.** Nobody wrote down which markdown the output has to be.
   The result is §3.3.

### 3.3 What actually breaks

Each of these is readable in the code as it stands; none needs a
corpus survey to confirm. **D1–D4 are fixed** — see phase 2 in §6
(`pipeline/lib/mdlayout.mjs` v1.0, `pipeline/wiki.mjs` v1.1); they are
described here in the present tense because they are what the strategy
is a reaction to, and because the fix is a translation in one lane, not
a change to what the sidecars say.

| # | Defect | Where | Effect |
|---|---|---|---|
| D1 | GFM alerts do not render in MkDocs | `sweep.mjs:699` (missing-summary warning), `testplan_draft.md:152` (the Negative Tests CAUTION), `testplangen.mjs:2137,2162`; extensions at `wiki.mjs:462-468` | every alert in the wiki is a blockquote reading "[!WARNING]" |
| D2 | Task lists do not render in MkDocs | `pymdownx.tasklist` absent, same lines | a finalized draft re-indexed into the corpus shows literal `[ ]` on its wiki page |
| D3 | Body text is not escaped in the wiki lane | `wiki.mjs:335` — `stripComments` only; `mdEscape` is applied to titles (`:100`) but never to bodies | extracted `<value>` placeholders and `{…}` runs are swallowed as HTML / `attr_list` |
| D4 | The wiki drops `## Esri documentation` | block inserted before the seam (`doclinks.mjs:371-376`); body starts after it (`:256-264`); `docPage` renders Summary + Related + body only | the curated per-document doc links exist in the sidecar and nowhere on the site |
| D5 | Two spellings of a case id | `casegrammar.mjs:634` vs `testplan_draft.md:114` | catalogs and links do not sort or match across the two lanes |
| D6 | Two spellings of a case field line | `casegrammar.mjs:273-277` vs `testplan_draft.md:112-125` | every consumer needs both regexes |
| D7 | A draft carries no machine-readable metadata | `testplangen.mjs:2159-2169` | `readMeta` cannot read a draft; the wiki cannot publish drafts; the finalize round trip loses the run's provenance |
| D8 | `## Coverage Map` is contracted as "ALWAYS the final section" | `testplan_draft.md:209`; five addenda are appended after it (`testplangen.mjs:2193`) | the contract is true of the model's output and false of the file; nothing marks where model text ends |
| D9 | H3 is two different things | `### TC-P01 …` and `### Slide 3 — …` (`casegrammar.mjs:640-655`), `### <slide title>` (`storyprofile.mjs`) | the wiki TOC interleaves cases with slide provenance; anchors are title-derived, so an edited title breaks every inbound link |
| D10 | Ten metadata rows on every document | `sidecarmeta.mjs:39` + "every row always present" (`Sidecar_Format_Plan.md` §4.1) | on a sparse document the header is longer than the content, and the `—` rows are noise in the Q&A agent's retrieval window |
| D11 | Normalization is per-emitter | `casegrammar.mjs:666` collapses blank runs, `wiki.mjs:335` strips trailing spaces, nobody else does either | byte-idempotency is re-proved per emitter instead of being a property of the writer |

### 3.4 What is working, and stays

Not everything needs rethinking, and churn here is expensive — the
corpus is ~755 files with cross-links, and every layout change costs a
backfill run.

- **The metadata table as the one representation** (format 3.0,
  decision 1 of `Sidecar_Format_Plan.md`). It solved the duplication
  and the quoting mess, it is retrievable as text, and the readers are
  small. Keep the idea; §4.2 only changes which rows are printed.
- **The filename and stem convention** (`Sidecar_Format_Plan.md` §4.6,
  `lib/slug.mjs`, `_Manifest.json`). Settled, shipped, working.
- **The `### TC-<lane><n> — <title>` grammar itself.** The right
  shape; §4.3 only makes the two emitters spell it identically.
- **Region markers as the seam mechanism** (`related:begin/end`,
  `docs:begin/end`, the `---` seam). The idea is right; §4.4 gives it
  one syntax.
- **GFM as the source dialect.** Three of four consumers read GFM
  natively. The wiki is the exception and is also the only lane with a
  render step to translate in.

---

## 4. Target design

### 4.1 One layout kernel

`pipeline/lib/mdlayout.mjs` — pure, dependency-free, the only place a
markdown construct is spelled:

```js
export const DIALECT = "gfm";              // what emitters write
export function metaTable(rows, opts)      // [[label, value]] -> the table
export function mark(kind, attrs)          // <!-- lrs:case lane=P n=1 … -->
export function region(kind, body, attrs)  // begin/end wrapped block
export function callout(kind, lines)       // > [!WARNING] …
export function caseBlock(c)               // the one case shape (§4.3)
export function taskList(items)            // - [ ] 1. …
export function normalize(text)            // trailing ws, blank runs, final \n
export function lintLayout(text, profile)  // the profile lint, all surfaces
```

Every emitter renders through it; `sidecarmeta.mjs` keeps the *field
semantics* (which rows a document has, how they are read back) and
delegates the *rendering* to the kernel. `wiki.mjs` gets a second
export from the same module — `toMkDocs(text)` — which is the only
place the translation in §4.5 lives.

Why a module and not a document: the current situation is that
`Sidecar_Format_Plan.md` §4.1 *is* the spec, and three emitters
re-implement it from prose. A shared function is a spec that cannot
drift.

### 4.2 One document skeleton

Every file that describes a document — sidecar, draft, wiki page —
gets the same skeleton, in this order:

```
# <Title>

<metadata table>          §4.2.1
<status callout>          only when there is something to say
## Summary
## Related documents      region: related
## Esri documentation     region: docs
---                       region: body
<body, per profile>       §4.6
```

**4.2.1 The metadata table.** Same `| Field | Value |` shape, same row
*order*, with three changes:

- **Empty optional rows are omitted.** `Doc`, `Source` and `Edited`
  are always present (they are the identity and the provenance);
  `Product`, `Release`, `Issues`, `People`, `Keywords`, `Tools` print
  only when they have a value. `readMeta` already normalizes an absent
  field to `""`/`[]` (`sidecarmeta.mjs:141-184`), so no reader
  changes. This reverses the "every row always present" half of
  decision 1 — that rule bought shape-uniformity for a *human* reader,
  and it is paid for by every parser's consumer and by the retrieval
  window (D10). Fixed order gives the uniformity; printing `—` ten
  times does not add to it.
- **A `Status` row**, first-class: `Indexed` for a sidecar, `Draft —
  unreviewed` / `Draft — 3 verifier findings` for a draft, `Ghost` for
  a row whose source is gone. This is what the draft banner says in
  prose today (D7).
- **A `Generated` row** on machine-authored files, carrying what the
  draft's HTML comment carries now: `testplangen v2.34 · prompt
  v1.13.0 · 2026-09-06T22:10Z · story 42`.

**4.2.2 Drafts adopt the skeleton.** The banner comment and the prose
warning (`testplangen.mjs:2159-2169`) become: the H1 the model already
writes, the metadata table (Doc = `draft`, Source = the story
sidecar's link, Status, Generated), and *one* callout carrying the "do
not upload this to the library" instruction. Net length is about the
same; the gain is that `readMeta` reads a draft, the wiki can publish
a Drafts section, and the finalize-and-re-index round trip carries the
run's provenance instead of losing it.

### 4.3 One case block

One spelling, both emitters, gated on both sides:

```
### TC-P01 — Correct line order 100, 200, 300, 400 on a normal line { #tc-p01 }
<!-- lrs:case lane=P n=1 shape=S4 conf=med src="slide 1 · Positive Tests: Normal Routes · 1" -->

- **Group:** Normal Routes
- **Steps:**
  - [ ] 1. Append route 200 to route 100
  - [ ] 2. Regenerate the derived network
- **Expected Result:** LineOrder reads 100, 200 in increments of 100.
- **Trace:** "line order must be preserved on append" — story slide 4
```

Decisions folded in:

- **Zero-padded ids everywhere** (`TC-P01`), so ids sort as strings in
  every catalog. The draft prompt changes; `caseindex.mjs:373` already
  reads both, so the read side needs nothing.
- **Every field line is a bullet with a bold label.** Steps nest as a
  task list under `- **Steps:**` — this is what `draft2docx.mjs`
  already renders (`:24-25, :112-122`), and it removes the bare-bold
  variant (D6).
- **Provenance moves into the key/value comment** (§4.4), on its own
  line under the heading rather than trailing it, so `shape` and
  `conf` — computed today and dropped on the floor — ride in the file
  and reach the wiki and the Q&A agent, not just the list.
- **Explicit anchors** (`{ #tc-p01 }`, `attr_list` is already enabled)
  so a case's URL survives a title edit, and `_Case Catalog.md`, the
  Test Cases list `Anchor` field and the wiki cases page all name the
  same fragment. GitHub ignores the attribute list; SharePoint's
  preview shows it as text — the one cosmetic cost, and the reason
  this is decision D5 below rather than a foregone conclusion.
- **Unit headings drop to H4** (`#### Slide 3 — …`) so H3 means "a
  test case" and nothing else (D9), and the wiki TOC reads
  section → case.

### 4.4 One machine-comment grammar

```
<!-- lrs:<kind> key=value key="value with spaces" -->
<!-- lrs:<kind>:begin … -->  …  <!-- lrs:<kind>:end -->
```

`kind` ∈ `case`, `addendum`, `verify` today (phases 3 and 5), and
whatever a future mark needs. One writer (`mark`), one reader
(`readMark`/`marks`).

**What did NOT move, and why** (decision D6, revised in phase 6): the
four existing marks — `rel:N s=…`, `related:begin/end`,
`docs:begin/end` and `slide N` — keep their own syntax. The grammar
was worth introducing for the forms that were *unparseable* (a case's
free-text `src:` comment, the draft's prose banner); it is not worth a
rename for forms that are already unambiguous, have one reader each,
and anchor the seam every job resolves a body through. A rename would
also add four more shapes for the readers to tolerate, which is the
opposite of what phase 6 exists to do.

Two things the grammar bought immediately:

- `<!-- lrs:addendum name=issue-trace -->` marks the machine-minted
  draft sections, so "where does model output end" is answerable
  mechanically (D8) — the verifier, the deck pass and any re-index can
  skip them instead of relying on the repeated italic sentence.
- A draft's provenance became readable: `Generated` and `Source` are
  table rows, so `readMeta` reads a draft and the wiki can publish one
  (phase 5). The HTML comment that used to carry it was parseable by
  nothing.

(The plan also sketched `<!-- lrs:body:begin -->` as a replacement for
the `---` seam scan. Not built: `bodySeamEnd` works, drafts do not use
it, and moving the seam is the single riskiest edit in the system for
no behavioural gain.)

### 4.5 The dialect contract

Written down, in `docs/design/` and enforced by the kernel:

> Emitters write **GitHub-flavored markdown**: ATX headings, pipe
> tables, GFM alerts, GFM task lists, fenced code, `attr_list`-style
> explicit anchors, HTML comments for machine data. No raw HTML
> elements (the one exception, `<br>` inside multi-column table cells,
> is `Sidecar_Format_Plan.md` decision 2 and stays). No YAML front
> matter. No setext headings. Consumers that cannot read a construct
> get a translation at render time, in their own lane; the files on
> disk are never dialect-specific.

The wiki lane therefore gains `toMkDocs(text)`, applied to bodies in
`docPage`:

| Construct | Translation |
|---|---|
| `> [!WARNING]` / `[!CAUTION]` / `[!IMPORTANT]` | `!!! warning` / `!!! danger` / `!!! info` admonition blocks (the `admonition` extension is already enabled) — fixes D1. **Extended in wiki v1.5 / mdlayout v1.1** to the whole set Material documents: every type and alias beyond GFM's five (`abstract`, `success`, `question`, `failure`, `bug`, `example`, `quote`, …), text after the marker as the block's title (`> [!IMPORTANT] Reviewer, start here` → `!!! info "Reviewer, start here"`; `""` for none), and a `-` / `+` fold suffix for the collapsible `???` / `???+` forms. GFM's own five keep the mapping above |
| `- [ ] 1. …` | enable `pymdownx.tasklist: {custom_checkbox: true}` in `mkdocsYml` — fixes D2 |
| raw `<…>` / `{…}` in body text | escape outside code spans and fences before rendering — fixes D3 |
| the `docs` region | rendered as its own `## Esri documentation` section on the page — fixes D4 |
| `<!-- lrs:case … -->` | consumed: `shape`/`conf` become a small caption under the case heading, `src` a title attribute |

`mkdocsYml` also gains `sane_lists` (extracted `1.` runs after a
paragraph are lists by accident today) and `toc: {toc_depth: "2-3"}`
now that H4 means "provenance" (§4.3); wiki v1.5 adds
`pymdownx.details` (the collapsible admonition forms) and
`pymdownx.superfences` (a fenced block nested inside one).

The translation runs in ONE direction. A page the render *composes* —
the front page, About, the drafts catalog, a draft's banner — has no
GitHub or SharePoint consumer, so `mdlayout.admonition()` writes
MkDocs syntax there directly: D2 constrains the files on disk, not the
render's own output.

**The wiki renders; it does not mirror.** The current `docPage`
reproduces the sidecar and links its table values — a reasonable v1.0.
The strategy going forward is that the sidecar is the *record* and the
wiki page is a *presentation of* it: translated, escaped, with the
figures as figures and the cases as anchored sections. Everything in
§4.5 is that principle applied.

### 4.6 The profiles

One table, one lint (`lintLayout(text, profile)`), run by whichever
emitter is about to write:

| Profile | Sections | Emitter | Lint |
|---|---|---|---|
| `sidecar/testplan` | `## Overview`, `## Test Cases`, `## Other content` | `casegrammar.mjs` | today's `lintTestPlanBody` (`:675`), moved into the kernel |
| `sidecar/story` | the six `story/v1` names + `## Other content` | `storyprofile.mjs` | new (none today) |
| `sidecar/plain` | `## Content` | `sweep.mjs:311` fallthrough | headings well-formed, no H1 in the body |
| `draft/testplan` | the 8+2 model sections, then the marked addenda | `testplangen.mjs` | `draftlint.lintDraft` (`:91`) + the skeleton asserts |
| `wiki/doc`, `catalog/*` | §4.2 skeleton / the catalog tables | `wiki.mjs`, `indexpages.mjs` | table integrity, no dangling relative link |

The draft profile and the sidecar test-plan profile finally share a
section vocabulary at the case level (§4.3) while keeping their own
spines — a draft's `## Positive Tests` / `## Negative Tests` split is
worth keeping for a PE reading it, and re-indexing a finalized draft
maps both onto `## Test Cases` with the lane already on each case's
mark.

---

## 5. Consumer impact checklist

Kernel + wiki (phases 1–2, no corpus backfill):

- new `pipeline/lib/mdlayout.mjs`; `sidecarmeta.mjs:70` renders through
  `metaTable`; `casegrammar.mjs:655-665`, `storyprofile.mjs`,
  `indexpages.mjs:39`, `testplangen.mjs:2159`, `wiki.mjs:298` all
  render through it
- `wiki.mjs`: `toMkDocs` in `docPage:335`, `mkdocsYml:462-468`
  extensions, the `docs` region restored to the page
- `tests/check_wiki.py`: admonition, task-list, escaping and
  `## Esri documentation` legs; `tests/check_format.py`: kernel
  round-trip legs; a new `tests/check_mdlayout.py` for the kernel

Case block (phase 3, `--recase` backfill):

- `casegrammar.mjs:634` padding stays, field lines already bullets;
  `prompts/testplan_draft.md:114-146` and `prompts/CHANGELOG.md`
- `caseindex.mjs:373` reads the `lrs:case` mark, keeps `<!-- src: -->`
  as a read-side synonym for one window; `Shape`/`Confidence` columns
  on `schemas/SPList_TestCases.csv` fill from the mark
- `draftlint.mjs:91-146` + `tests/check_draft_coverage.py` in lockstep
  (the agreement leg gates them); `check_caseindex.py` fixtures
- `wiki.mjs:240` `planCases` reads the explicit anchor
- `render/draft2docx.mjs`, `draft2pptx.mjs`, `lib/deckspec.mjs` —
  nested task lists under a bullet label

Header + drafts (phases 4–5, `--reformat` backfill, format 3.1):

- `sidecarmeta.mjs:34,39` (`SIDECAR_FORMAT` 3.1, optional rows,
  `Status`, `Generated`); `sweep.mjs:691-716`
- `testplangen.mjs:2159-2193` skeleton + marked addenda;
  `docs/qa-agent-instructions.md` → v1.5 (optional rows, the two new
  rows, drafts); `docs/setup.md` §15
- `wiki.mjs`: a Drafts section when `wiki.drafts` is configured

### 6. Roll-out

| Phase | Scope | Gate | Backfill |
|---|---|---|---|
| 1. The kernel | §4.1 extraction only — every emitter renders through `mdlayout.mjs`, output unchanged | every existing gate green **and** byte-identical output on all fixtures (the point of the phase) | none |
| 2. The wiki lane — **shipped** (`lib/mdlayout.mjs` v1.0, `wiki.mjs` v1.1; admonitions extended to Material's full set in mdlayout v1.1 / wiki v1.5) | §4.5 — D1–D4, extensions, escaping, TOC depth | 7 new `check_wiki.py` legs, all failing on wiki v1.0; `mkdocs build --strict` in CI | none — the wiki is regenerated every run |
| 3. The case block — **shipped** (casegrammar v1.3, caseindex v2.2, prompt v1.14, draftlint v1.6) | §4.3 — padding, bullet fields, `lrs:case` mark, explicit anchors, H4 units, and `canonicalizeCaseBlocks` for bodies already in the grammar | `check_caseindex` 107, `check_testplangen` 238, the draftlint agreement leg at contract v1.8 | `--reformat --live` (it re-renders bodies AND syncs the rows; `--recase` alone does not rewrite a body) |
| 4. The header — **shipped** (sidecarmeta format 3.1, sweep v1.54, wiki v1.2, agent v1.5) | §4.2.1 — optional rows, `Status`, `Generated`, format 3.1 | `check_local_sweep` 348 (incl. the idempotency leg); `readMeta` reads 3.1, 3.0 and the pre-3.0 yaml | `--reformat --live`, the same run as phase 3 |
| 5. Drafts — **shipped** (testplangen v1.24, wiki v1.3) | §4.2.2 + marked addenda + the wiki's Drafts section behind `wiki.draftsDir` | `check_testplangen` 243 (incl. a `readMeta`-on-a-draft probe), `check_wiki` 49, `check_draft2pptx` 43 | none — drafts are timestamped, never rewritten |
| 6. Retire the old grammars — **the scan is shipped** (`lib/layoutaudit.mjs` v1.0, sweep `--layout-audit`); the deletion waits on a converged corpus | drop the read-side synonyms once no sidecar carries the shape | `--layout-audit` reports the shape's file count at 0 | none |

Rollback is the existing pattern: the `format` value in the Extracted
row gates the backfill, and `--reformat` re-emits from raw text, so no
phase depends on re-running the model.

---

## 7. Decisions

Open — each is a recommendation, not a settled choice.

| # | Decision | Recommendation |
|---|---|---|
| D1 | A layout kernel module, or a written spec three emitters follow | **Kernel.** The written spec exists today (`Sidecar_Format_Plan.md` §4.1) and drifted anyway |
| D2 | Source dialect | **GFM, translated per lane** — taken, in phase 2. The alternative — write MkDocs-flavored markdown — breaks GitHub, SharePoint and `draft2docx` to fix one consumer |
| D3 | Empty metadata rows | **Omit optional rows** — taken, in phase 4. The order is kept and the always-present core is Doc, Status, Source, Extracted (Extracted carries the `format` stamp the backfill gates on, so it cannot be dropped; Edited can) |
| D4 | Case id padding | **`TC-P01` everywhere** — taken, in phase 3 |
| D5 | Explicit case anchors (`{ #tc-p01 }`) | **Yes** — taken, in phase 3, behind `sweep.caseIndex.anchors` (default on) so the SharePoint-preview cost can be reversed with one config line and a `--reformat` |
| D6 | One machine-comment grammar | **Partly — and deliberately so.** `mdlayout.mark`/`readMark` ship, and the two genuinely ad-hoc forms moved onto them: a case's free-text `src:` (phase 3) and the draft's prose banner and verify comment (phase 5). The remaining four — `rel:N s=…`, `related:begin/end`, `docs:begin/end`, `slide N` — **keep their own syntax**. Each is already unambiguous, has exactly one reader, and sits on the seam every job depends on (`bodySeamEnd` anchors on `related:end`); renaming them buys a prefix and costs a wide, load-bearing diff plus a *wider* tolerance window — the opposite of what phase 6 is for. Revisit only if a third form of one of them ever appears |
| D7 | Drafts adopt the document skeleton | **Yes** — taken, in phase 5. Four rows (Doc, Status, Source, Generated) replace an HTML comment and a paragraph of prose, so the head is no longer than it was; surface, target release and PE stay in the model's Overview table rather than being duplicated into the head |
| D8 | Unit headings to H4 | **Yes** — taken, in phase 3 |
| D9 | Publish drafts to the wiki | **Behind config** — taken, in phase 5, as `wiki.draftsDir` (the local path of the drafts folder), default empty. A published draft joins no catalog and its page says it is unreviewed |

---

## Appendix A — before / after

A test-plan sidecar with a sparse header, as the corpus writes it
today and as §4 would:

**Before**

```
# Merge Events Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 17 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Merge Plan.pptx](<…>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2026-08-01 10:00 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v3.0.0 |
| **Keywords** | merge events · route |
| **Tools** | — |

## Summary

> [!WARNING]
> No AI summary was generated for this document.

## Related documents
…
<!-- docs:begin -->
## Esri documentation

[Merge Events](https://…)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — Merge preserves measures <!-- src: S1 · slide 3 -->
- **Group:** Normal Routes
```

In the wiki this renders with a blockquote reading "[!WARNING] No AI
summary…", no Esri documentation section at all, and a TOC in which
"TC-P01 — Merge preserves measures" sits at the same level as
"Slide 3 — Notes".

**After**

```
# Merge Events Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 17 · Test Plan · Pro |
| **Status** | Indexed |
| **Source** | [Merge Plan.pptx](<…>) · rev V2 |
| **People** | author Mac Christmas |
| **Edited** | 2026-08-01 10:00 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.1 · prompt v3.0.0 |
| **Keywords** | merge events · route |

## Summary

> [!WARNING]
> No AI summary was generated for this document.

## Related documents
…
<!-- lrs:docs:begin -->
## Esri documentation

[Merge Events](https://…)
<!-- lrs:docs:end -->

<!-- lrs:body:begin -->

---

## Test Cases

### TC-P01 — Merge preserves measures { #tc-p01 }
<!-- lrs:case lane=P n=1 shape=S1 conf=high src="slide 3" -->

- **Group:** Normal Routes

#### Slide 3 — Notes
```

Four fewer chrome rows, the same facts, and in the wiki: a rendered
warning admonition, an Esri documentation section, a TOC of sections
and cases, and `#tc-p01` as a link target that survives a retitle.

---

## Appendix B — method

Read from the repository at `claude/markdown-layout-strategy-33mbek`
(main @ 4071bae): every emitter and parser listed in §2, the two
design plans in force, the draft prompt and its lint, the wiki's
MkDocs configuration, and the harness suites that gate each. Every
finding in §3.3 is readable in that code, and D1–D4 were additionally
reproduced by rendering a fixture sidecar — one carrying a
missing-summary alert, a docs region, a `<RouteID>` placeholder and a
task list — through `renderSite` and reading the page it produced.

No corpus was available in this session, so **nothing here counts
sidecars**. Two questions need a survey before their phase runs, and
neither is answered in this document: how many files carry an empty
optional row (sizes phase 4's win), and how many bodies contain the
`<…>` runs the wiki was eating (sizes what phase 2 recovered). A
read-only pass in the mould of `--case-audit` answers both.
