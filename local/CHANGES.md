# Local sweep — release notes

## v1.25 (2026-09-03)

**Test-case slide headings (TC-1).** The test-plan decks put one test
case per slide but almost never title the slide, so their sidecar
sections rendered as bare `## Slide 12` and a reader (or the Q&A
agent's citation) had to open each section to learn which case it
holds. A new presentation pass, `caseHeadings()`, rewrites a bare
slide heading from the case text the slide itself states:

    ## Slide 5   →   ## Case 2 — Loop – Split measure: 20 <!-- slide 5 -->

Rules, applied only to headings that are EXACTLY `## Slide N` (a slide
the author titled keeps that title; `### Notes` is never scanned):

- **One numbered line** (`2. Loop – Split measure : 20`, bullet or
  plain) is the case → `## Case 2 — …`. Two or more numbered lines
  mean the slide is a *checklist* of verifications, not a case — the
  heading stays untouched.
- **No numbered line but a Positive/Negative classification line**
  (the corpus marker of a case slide): the first short digit-bearing
  content line is the case text (`Normal route - Split measure :16`).
  Lines opening `current date` or `modify` (the decks'
  modify-this-case notes) never qualify.
- Otherwise a line shaped `<name> test cases` titles the section
  (`Conflict Prevention test cases`, `Negative test cases`).

Table rows, image/figure links and fenced code are never candidates.
The promoted line leaves the body (its text now IS the heading); a
`current date: …` tail stripped from the heading is re-emitted as its
own body line, so nothing is lost. The original slide number rides
along as an HTML comment — hidden by every renderer, like the
metadata frame — so provenance survives. Heading text is cleaned the
way slide titles already are (`|`/`#` stripped, colons normalized,
90-char cap at a word boundary).

**Deterministic by decision, not AI.** An LLM-generated header was
considered (and would help the headless checklist slides), but was
rejected on the same grounds figures are "always re-rendered, never
AI": headings must ride the no-AI-spend `--reformat` path, re-index
runs must not churn sidecar diffs nondeterministically, and per-slide
Predict calls would multiply AI spend ~25× per deck while coupling the
sidecar body to the prompt-version/backfill machinery. The slide's own
case line is the header the user asked for; a slide with no case text
keeps its honest `## Slide N`.

Like tidyBody (v1.20), this is sidecar-body-only presentation: the
LLM input, TextPreview and the similarity index keep the raw text,
ZipTextExtract stays untouched (tenant-pasted, byte-equivalence
gated), and a cloud-flow rollback simply keeps `## Slide N`.

Rollout: `sweep.mjs --reformat` (no AI spend, no PromptVersion bump) —
the same one pass open action 11 already owes the corpus for figures
covers this too.

Gate: `check_local_sweep.py` **146/146** (was 142) — the messy-deck
fixture gains a case slide and a numbered checklist slide; the live
leg asserts the exact rewritten heading (provenance comment included),
the promoted line's removal, and the checklist heading staying bare;
the reformat leg proves the headings re-derive. PAD 27/27; standing
suites green.

## v1.24 (2026-09-03)

**Interactive sign-in (`auth: "interactive"`)** — a Conditional Access
policy started rejecting the device-code sign-in with `AADSTS53003`
("your sign-in was successful but does not meet the criteria to access
this resource", `Device state: Unregistered`), which took the whole
nightly pipeline down: the refresh token expired, re-auth was refused,
and every run since failed closed with `AUTH EXPIRED`.

The block is the **flow**, not the client. A device-code sign-in
completes in a browser with no relationship to the machine running the
sweep, so it can present no device identity — a policy requiring a
compliant or joined device refuses it however the client is configured.
Proven on the affected machine: two different pre-registered public
clients (`14d82eec…` Graph CLI, `04b07795…` Azure CLI) failed
identically, while `dsregcmd /status` showed the box hybrid-joined,
`DeviceAuthStatus: SUCCESS`, with a healthy PRT.

`auth: "interactive"` runs the **authorization-code grant with PKCE over
a loopback redirect** instead. The sign-in happens in the user's own
browser on this machine, so it carries the PRT and device state and the
policy is satisfied. Entra ignores the **port** of a loopback redirect
but not the **host**: these clients register `http://localhost`, and the
`http://127.0.0.1` form is refused with `AADSTS50011` — so nothing needs
registering, but the host must be spelled `localhost`, and both loopback
stacks are bound on the chosen port because `localhost` may resolve to
either (`graph.redirectHost` overrides if a registration differs). Only the
FIRST sign-in differs: caching, silent refresh and the SPO seed-from-
Graph path are untouched, so scheduled runs behave exactly as before.
Applies to `graph` and flows to Dataverse/SPO (each keeps its own public
client, as in device mode — SPO must stay on the Graph CLI client whose
tokens carry real SharePoint permissions).

Three bugs the gate caught while building it, all of which would have
bitten a real sign-in:

- **A callback race.** The waiter promise was armed *after* opening the
  browser, so a fast redirect landed while no resolver existed and the
  flow waited for a callback that had already happened.
- **An uncleared 5-minute timer.** The `Promise.race` timeout was never
  cancelled, so after a *successful* sign-in the process sat for the
  full five minutes before exiting — once per resource.
- **A lingering keep-alive socket.** `server.close()` waits for the
  browser's open connection; the listener is now unref'd and its
  connections dropped.

`dsregcmd /status` is the prerequisite check: if the machine is genuinely
unregistered, interactive fails the same way and the app registration
(`auth: "app"`, already supported) is the only route.

Gate: `check_local_sweep.py` **135/135** (was 128) — a new interactive
leg drives the full grant against a mock authorize endpoint and asserts
the S256 PKCE challenge, a loopback redirect URI, that graph+dataverse
each sign in once while SPO still seeds silently, that the same caches
are written, and that a second run refreshes with no new sign-in. PAD
27/27.

## v1.23 (2026-09-03)

**Slide diagrams are drawn, not described.** v1.22 stopped the label
debris by collapsing it to a `[figure: 10–22 · R1 · E1]` caption; that
kept the body clean but threw the geometry away. These plans *are*
route/measure diagrams, so the sweep now renders one **SVG figure per
diagram slide**, written to the media folder and linked directly after
the slide heading.

New script **`scripts/SlideFigures.ts` v1.0** (DF-1), a new `figures`
op in the PAD runner, and `placeFigure()` in the sweep. Two sources,
one visual language:

- **Vector slides** — the drawing is real DrawingML, so it is rendered
  from its true coordinates. Nothing redrawn or inferred.
- **Raster slides** — the drawing is a pasted picture, which cannot be
  restyled and would keep whatever ticks and colours its author chose.
  Instead the route is **redrawn** from what the slide itself states:
  topology from its title (`2. Loop – Split measure : 20`), measures
  and split from its own tables. A schematic faithful to the slide's
  data, not a tracing — the alt text says so.

The style framework (`docs/Diagram_Style_Framework.md`) is one palette,
type scale and set of component rules for the whole corpus: source
colours map to slots by hue family (deterministic, so one source colour
lands on one slot in every document); structural roles come from
geometry, never colour; ticks are uniform and centred on the line;
measures sit centred above their own tick on a shared baseline; extents
get butt caps and are snapped to share one exact boundary, with a split
marker there; route ids become left row labels and event ids centre
under their bars; leaders that point at a relocated label are dropped;
one decimal convention per ruler; direction arrows on open routes; dead
vertical bands compressed; `<title>`/`<desc>` on every figure.

Two decisions worth recording. **Colour cannot decide structure**: one
deck draws a full-width navy route with black and amber events over it,
another lays four default-coloured route segments end to end under one
cyan event — so within a band the colour covering the greatest span is
the route and every other colour is an extent. And **butt caps are a
correctness fix, not polish**: round caps overshoot by half the stroke
width, so a 10→16 extent reads as 9.9→16.1.

ZipTextExtract is **untouched** — it still emits the v2.2 caption, and
the sweep replaces it with the figure. A cloud-flow rollback therefore
degrades to exactly v2.2 behaviour with no code change.

Rollout: `sweep.mjs --reformat` (no AI spend, no PromptVersion bump).

Gates: new `review/harness/check_figures.py` **PASSED** — both
production paths fire, a prose-only slide yields no figure, ticks are
uniform and centred, measures share one baseline and sit on their
ticks, adjoining extents share an exact boundary, no source colour
reaches an element, nothing is rasterised, every figure parses and
carries `<title>`/`<desc>`. Standing suites green; **PAD 27/27**;
**local sweep 128/128**; ES2017 clean. Verified end-to-end on two real
decks: **20 figures** from SplittingEventsinPro_Testplan (25 slides)
and **39** from 3921MergeEventsToolProTestPlan_V5 (44 slides), 3–12 KB
each with no embedded rasters.

## v1.22 (2026-09-03)

**Drawn diagrams stop shredding the body** — the corpus's test-plan
decks draw route diagrams as *shapes*: dashed/hatched connector lines
annotated by dozens of tiny floating text boxes holding tick numbers
and route/event ids. Every one of those flattened into its own
one-token line, so a slide's real content (its tables, its case
description) sat buried under forty lines reading `10`, `11`, `12`,
`R1`, `E1`, `Output`. On the deck that prompted the change
(`SplittingEventsinPro_Testplan.pptx`): 20 of its 25 slides carried a
drawn diagram, and collapsing them took the body from 1098 lines to
857 — 241 lines of label debris gone, short standalone lines down from
301 to 40 — with all 515 table / heading / image-link lines
byte-identical.

Now a **cluster** of label-shaped floating shapes on one slide
collapses into a single line:

```
[figure: 10–22 · R1 · E1 · Output]
```

reusing the `[figure: ...]` convention the docx drawing path has had
since v1.2. Ascending integer runs compress to `a–b`, repeats dedupe
in first-appearance order, and the list caps at 24 items. A slide with
fewer than four label shapes keeps them inline — one or two short
floating callouts are content, not a diagram.

`sweep.mjs` itself is **unchanged**; this is **ZipTextExtract v2.2**
(DL-1). Unlike v1.20's `tidyBody`, it could not live here: by the time
text reaches `tidyBody` a line reading `R1` from a diagram label is
indistinguishable from a real content line — only the slide XML still
knows which shapes are placeholders, which float, and how many cluster
together. So this one is a genuine extractor change, and it therefore
also reaches the LLM input, `TextPreview` and the body-similarity
index, not just the sidecar body. That is the intended direction: the
label debris was noise in all three, and route/event ids survive the
collapse (deduped) so relatedness keeps its signal.

Rollout: `sweep.mjs --reformat` re-extracts and rewrites bodies below
the seam with **no AI spend** (STATUS open action 10). **No
PromptVersion bump** — the metadata format is untouched, so this must
not trigger a full reindex.

Gates: new `review/harness/check_batch_v2_2.py` **PASSED** — v2.1 vs
v2.2 byte-identical on all thirteen pre-existing fixtures (no prose,
table, heading, note, code fence, link or docx path moves) with
throw-parity on the malformed archives, and a `diagram_deck` fixture
that discriminates both ways. Standing suites green (`check_format`
carries the contract as §12); **PAD 27/27**; **local sweep gate
PASSED 128/128**.

## v1.21 (2026-08-15)

**Both link sections cut down** — five related entries plus a
product-documentation table were dominating sidecars.

- **Compact relatedness evidence** (`compactWhy`): token
  enumerations collapse to counts, keyword names cap at two, and the
  `also:` tail loses its repetition —
  `similar text (0.46) · 5 title words: bit, editing, oid, +2 more ·
  3 filename words: bit, editing, tools · also: same kind, same
  surface` becomes `similar text 0.46 · 5 title words · 3 filename
  words · same kind/surface`. Applied to the ranked entries in the
  sweep before SidecarPatch renders them, so RelatedRank's contract
  and `check_related` are untouched; the yaml keeps full scores.
- **Documentation block is just the pages**: the "Mentioned" column
  is gone (page titles already say what they are) and the
  product-level overview/vocabulary links are gone (identical on
  every doc of that product — pure repetition). What remains is one
  inline `·`-separated row of the specific pages this doc's tools
  and topics resolve to, plus the single `_No page matched:_` line.
  The `products` map stays in `esri_doc_links.json` as crawl seeds.

`--reformat` doesn't rebuild these (they live above the seam) —
`--rerank` refreshes both. **Gate PASSED 2026-08-15 (128/128).**

## v1.20 (2026-08-15)

**Sidecar bodies are legible** — the extracted document text was
sprawling: a stray slide-number line under every slide heading,
blank lines between every bullet (markdown renders those as loose,
double-spaced lists), bullet text padded from the source
(`-           use existing 64bit FC`), and `### Notes` sections
holding nothing but the slide number. New `tidyBody()` fixes all
four plus collapses blank-line runs.

Deliberately **not** in `ZipTextExtract`: that script is
tenant-pasted and under byte-equivalence gates, so this lives in the
local sweep as presentation. It applies to the **sidecar body
only** — the LLM input, the `TextPreview` field and the similarity
index all keep the raw text, so classification, previews and
relatedness are provably unchanged.

**`sweep.mjs --reformat`** applies it corpus-wide with **no AI
spend**: for each Indexed doc it re-extracts the source (free,
local) and replaces only the text below the `---` seam, preserving
the header, metadata yaml, related region and docs block
byte-for-byte. The Switch_ext lane dispatch is factored into a
shared `extractDocText()` used by both indexing and reformatting,
so the lanes cannot drift.

Gate: a messy three-slide fixture reproducing every defect from the
live corpus (slide-number lines, padded/nested bullets, loose list,
notes-with-just-a-number) proves the tidy; the reformat leg
overwrites a sidecar with a stale body and proves it is rebuilt,
tidied, header preserved, and zero AI calls spent.
**Gate PASSED 2026-08-15 (125/125).**

## v1.19 (2026-08-15)

**Documentation block, readable** — the live output was 20 flat
bullets, every link labelled "documentation", several of them
arbitrary. Five changes:

- **Real page titles as link text.** `doc_crawl` v1.2 captures each
  page's `<title>` (minus the site suffix) into the inventory as
  `{url, title}` entries; the sidecar renders
  `[Storing referent and offset information for event location](…)`
  instead of `[documentation](…)`. Bare-URL inventories still work,
  falling back to a slug-derived title with acronym casing
  (`create-and-modify-an-lrs-network` → "Create and modify an LRS
  network").
- **A table, not a bullet wall.** Product links stay as short lines;
  matched tools/topics render as a two-column
  `| Mentioned | Documentation |` table.
- **One collapsed search line.** Unmatched tools no longer get a
  line each — they join a single `_No doc page matched — search:_`
  line (capped at 12 + `+N`), sorted last so real links lead.
- **Ambiguity guard.** When several DIFFERENT pages tie for best
  match, nothing is linked: "route" matched extend-a-route /
  rename-a-route / retire-routes equally, and picking one was noise.
  A tie between the same slug in two product trees is resolved by
  the doc's product order, not dropped.
- **Full-coverage matching for tools too** (was 0.6): "Add Point
  Events" was matching "Add calibration points" on 2 of 3 tokens.
  Tools still fall through to probe → search.
- Rerank now reads the sidecar's own `tools:`/`keywords:` yaml for
  labels, so names keep their original casing ("Create LRS Network
  from existing dataset", not the lowercased junction title).

Section heading renamed `## Product documentation` →
`## Esri documentation` (it covers tools and topics now).
**Gate PASSED 2026-08-15 (115/115).**

## v1.18.1 (2026-08-15)

Dedupe fix, found live: several keywords legitimately resolve to the
same page ("offset" / "location offset" / "referent" all describe
`storing-referent-and-offset-information-for-event-location`), and
the block rendered a line per keyword — the same link three times.
Now **one line per page**: labels merge (most specific first, capped
at 3 with a `+N` tail), a tool/topic whose page is already covered
by a product link is dropped entirely, and search-fallback lines
sort last so known links lead. Gate: the live case reproduced as a
fixture — two keywords, one page, merged labels — plus a
no-duplicate-URLs-anywhere assertion over the whole block.
**Gate PASSED 2026-08-15 (112/112).**

## v1.18 (2026-08-15)

**Inventory matching** — tool/topic links now resolve against the
141 REAL pages `doc_crawl` found, not a guessed slug. New
`DocPageIndex` (reads `workDir/esri_doc_pages.json`, override
`sweep.docPagesFile`) tokenizes every page slug and scores a
tool/topic name against it: plural-insensitive, prefix-tolerant
(`realign` ~ `realignment`), ranked by token coverage + Jaccard,
with a decisive boost for the section matching the doc's product —
the same slug exists in BOTH the R&H and Pipeline trees, and a
Pipeline doc must link the Pipeline copy.

Resolution order per tool: curated map → **inventory match** (≥60%
of the name's tokens covered) → cached probe → probe → search
fallback. **Topic keywords now get links too** — inventory-only,
and only on a total match (every name token covered), with no
search fallback, since a weak topic link is noise.

Gate: fixture inventory — a tool resolved by inventory match with
no probe fired; a topic keyword linked; the probe path still
exercised for a tool absent from the inventory.
**Gate PASSED 2026-08-15 (110/110).**

## v1.17.1 (2026-08-15)

doc_crawl v1.1 — the first live run found 0 pages with no clue why.
Now diagnosable and resilient: sitemap discovery via robots.txt
`Sitemap:` directives + candidate sitemap.xml at every ancestor path
of the section (not just the origin root), each attempt printing its
HTTP status; the BFS seeds from every known page under the section
in esri_doc_links.json (the section root often 404s — no directory
index — which silently emptied the v1.0 crawl); a browser-like
default User-Agent (CDNs 403 obvious bots; `--ua` overrides); and a
JS-rendered-site warning when a 200 page yields zero same-section
links. Gate re-PASSED unchanged (108/108).

## v1.17 (2026-08-15)

**`local/doc_crawl.mjs`** — enumerate the REAL page inventory of the
Esri help sections (probing guessed one slug per tool; matching
should work from what actually exists). Per section — defaults to
the folders behind `probeTemplates`, override with repeated
`--section`: the site's sitemap(s) first (`sitemap.xml` /
`sitemap_index.xml`, child sitemaps followed), and a polite BFS
crawl (same-section `.html` links, ~6 req/s, page cap, honest UA)
only when the sitemap yields nothing for the section. URLs print to
stdout and the inventory saves to `work/esri_doc_pages.json` for the
upcoming topic→page matching step. Gate: mock sitemap section and
mock crawl-only section both enumerated, out-of-section links
excluded. **Gate PASSED 2026-08-15 (108/108).**

## v1.16 (2026-08-15)

**Probed tool links** — the owner's first real search-link
("realign" → a Google page) showed the fallback should try harder.
New `ToolLinkResolver`: for a detected tool with no curated entry,
candidate URLs are built from the JSON's new `probeTemplates`
(`{slug}` = kebab-cased tool name; product-matched folders tried
first — the doc.esri.com scheme the owner's URLs demonstrated) and
FETCHED from the sweep machine; the first HTTP 200 becomes a direct
link. Hits and definitive all-404 misses cache in
`workDir/doc-links-cache.json` — each tool costs at most one probe
round ever (misses re-probe after 30 days; network errors are never
cached). Resolution order per tool: curated map → cache → probe →
searchTemplate fallback. No API keys, no scraping — just testing
the documented URL scheme. `sweep.probeDocLinks: false` disables.

Gate: mock probe endpoint — existing page → direct link in the
sidecar; missing page → search fallback; cache file written; across
dry + live + rerank runs each slug probed exactly once. The gate's
doc-links file points probing at the mock, never the real site.
**Gate PASSED 2026-08-15 (104/104).**

## v1.15 (2026-08-15)

**Tool-level documentation links** (owner request: a user story
about the Add Point Events tool should link that tool's docs).
Layered design in the same sidecar block and the same editable
`local/esri_doc_links.json`:

- **Curated direct links**: new `tools` map (tool name →
  URL, case-insensitive) renders `- **Reassign Routes** —
  [documentation](…)`. Seeded with the owner-verified doc.esri.com
  URL scheme; upgrade any tool by adding one JSON line.
- **Templated search fallback**: tools NOT in the map render
  `[search Esri docs]` via `searchTemplate` (`{q}` = the encoded
  tool name; default a doc.esri.com-scoped web search) — complete
  coverage with zero authoring, never a 404.
- Detection: the LLM's `tools` output at index time; the doc's
  `Kind: tool` keywords (alias-folded) at `--rerank` time — the two
  converge because tools are minted as tool-kind keywords.
- `products` map re-seeded with the owner-supplied doc.esri.com
  pages (essential vocabulary, LRS data model/products, event
  behavior; pipeline vocabulary + web-layer sharing). Legacy flat
  JSON shape still parses.

Gate: curated tool → direct link; unmapped tool → encoded search
link; rerank rebuilds both from junctions alone; still exactly one
block after re-passes. **Gate PASSED 2026-08-15 (101/101).**

## v1.14 (2026-08-15)

**Product-documentation links in sidecars.** Docs whose `Products`
field names Roads & Highways / Pipeline Referencing / Utility
Network (RegexExtract's canonical detection) get a
`## Product documentation` section — official Esri doc links per
product — inserted after the related region inside
`<!-- docs:begin/end -->` markers. The links live in the **editable**
`local/esri_doc_links.json` (override: `sweep.docLinksFile`), keyed
by the exact canonical product names: editing the file + the
self-updating git pull is the whole deploy; removing an entry (or
the file) removes the block from sidecars on their next write.
Written on fresh indexes AND upserted corpus-wide by `--rerank`
(idempotent — replace-in-place). ⚠ The seed URLs were authored
offline (Esri domains unreachable from the build sandbox) — verify
them in a browser and correct the JSON as needed.

Gate: product detected end-to-end from fixture text ("Roads and
Highways" → row `Products` → sidecar block with the overview URL);
rerank leg proves exactly one block after re-passes.
**Gate PASSED 2026-08-15 (98/98).**

## v1.13 (2026-08-15)

**`sweep.mjs --rerank`** — rebuild every Indexed doc's Related
Documents section in one pass from persisted state: row metadata,
junction/edge lists, and the on-disk sidecar bodies. **No extraction,
no AI calls, no row writes** — pure local compute + sidecar file
patches (reciprocal neighbor merges included), so a full-corpus pass
costs nothing but minutes. The related pipeline (flow §5 +
body-sim) is extracted into `rankRelated()`, shared verbatim by
indexDoc and the rerank driver. Uncapped by default (`--max` caps it
explicitly; `--only` narrows it; `--dry-run` plans it). Intended
use: right after a keyword-curation drain, to propagate merges
corpus-wide immediately instead of over months of lazy reindexes —
and it back-fills body-sim/filename/folder relateds (v1.9) into
every sidecar written before those signals existed.

Gate: rerank leg — full pass over the corpus fixture proves per-doc
coverage, zero AI calls, keyword/id and body-sim relateds intact,
and non-Indexed docs' sidecars untouched.
**Gate PASSED 2026-08-15 (95/95).**

## v1.12.1 (2026-08-15)

Timeout fix, found on the first live drain: AI Builder's gateway
408s once the vocabulary+reply combination gets big enough (the
1880-line vocabulary with the v1.1 50-proposal cap crossed it). Two
changes: 408 joins 429/5xx as a retryable status in
`aiBuilderPredict` (transient under load), and the vocabulary is now
sent in **alphabetical chunks** (`curation.vocabChunk`, default 700
lines) — one Predict call per chunk, per-chunk proposal cap,
proposals concatenated, hallucination guard still validating against
the FULL row set. Alphabetical ordering keeps the main variant
classes (plural/typo/hyphen/concatenation) adjacent within one
chunk; abbreviation-vs-expansion pairs far apart alphabetically are
the accepted miss (documented). Deviation from the flow's
one-giant-call shape — which is exactly what was timing out. Gate:
chunk leg proves one call per chunk. **PASSED 2026-08-15 (90/90).**

## v1.12 (2026-08-15)

**Backlog draining** for curation. The owner asked for a 500-proposal
cap; a single reply that size would blow the model's output budget
and truncate to zero parsed proposals, so the same end is reached in
batches: curation prompt **v1.1** raises the per-reply cap 20 → 50
(re-paste required — the instruction lives in the tenant prompt
text, not config), and new `curate.mjs --drain` repeats full passes
(each re-fetching the shrunken vocabulary) until a pass writes
nothing, hard-capped at 20 passes. Termination is structural: every
written proposal removes its alias from future eligibility (merged
in autoApprove mode, CurationStatus-blocked in manual). Gate: static
mock proposals — pass 1 merges, pass 2 finds the alias merged and
stops. **Gate PASSED 2026-08-15 (89/89).**

## v1.11.1 (2026-08-15)

`curation.autoApprove` (default **false** — the flow's
propose-then-approve contract stays the default). When true:
guard-passing merges apply immediately (the job sets CanonicalRef —
the one thing the cloud flow deliberately never did, now an explicit
owner opt-in), pending proposals left over from manual-mode weeks
are applied too (canonical resolved from the ProposedCanonical
prefix; unresolvable ones stay pending), the digest becomes an
audit log with undo instructions (clear CanonicalRef + set
CurationStatus Rejected, which blocks re-proposal via the existing
DoNotPropose mechanism), and the summary line gains `merged=`.
Gate: week-3 auto-approve leg — fresh proposal and manual-era
pending row both merged, digest audit format.
**Gate PASSED 2026-08-15 (88/88).**

## v1.11 (2026-08-15)

**Keyword curation goes local** (`local/curate.mjs`) — the LAST Power
Automate piece of the pipeline. Mirrors the KeywordCuration cloud
flow v1.1 action-for-action from `curation/flow/v1_1/definition.json`:
approved-row cleanup, vocabulary/blocked composition, one call to the
tenant's own "LRS Keyword Curation" AI Builder prompt
(`llm.curationModelId` — discover it with `curate.mjs --models`),
brace-slice parse, the verbatim hallucination guard, proposal writes,
the pending-carryover digest overwritten at a fixed name in Shared
Documents (via new `GraphClient.putFile` drive upload — that library
isn't synced, and the digest deliberately lives outside the Q&A
agent's reach), DX-11 empty-queue overwrite, and the Cur_summary
line. Never writes CanonicalRef — the propose-then-approve contract
is unchanged. Reuses the sweep's config, sign-ins and auth
(`aiBuilderPredict` generalized in llm.mjs); `--dry-run` plans
without writing; scheduling via `local/run_curate.cmd` +
`local/curation_task.xml` (Saturday 08:00, catch-up + battery
settings). One documented deviation: malformed model JSON degrades
to zero proposals with a log note instead of failing the run.
Deploy + handover: guide §9 (turn the KeywordCuration cloud flow OFF
after the smoke — never both live).

Gate: full two-week cycle against the mock — propose (incl. a
blocked and a hallucinated alias, both dropped), digest contents,
librarian approval, cleanup, DX-11 empty digest; dry-run leg writes
nothing. **Gate PASSED 2026-08-15 (86/86).**

## v1.10 (2026-08-15)

Quick-wins batch:

- **Oversize cap 3.5 MB → 50 MB** (`sweep.oversizeBytes`). The old
  cap was a Power Automate/Office Scripts payload limit; locally it's
  only a memory/time guard. Big decks — often the richest docs — now
  index instead of skipping; previously-stamped oversize Skips
  reprocess as the backfill/modification triggers reach them. LLM
  input stays bounded by `textCap` regardless of file size.
- **HTML lane** — the `htmltotext` ExtractionLane the schema always
  reserved but no flow version implemented: `.html`/`.htm` files are
  read locally, tags/scripts/styles stripped and entities decoded
  (zero-dependency), and run the full pipeline.
- **Error-streak counter** — the status page's Error-lane table gains
  a "Nights stuck" column (consecutive full runs in the lane,
  persisted in `work/error-streaks.json`); the action line calls out
  docs stuck 3+ nights. Smoke (`--only`) runs display but don't
  advance streaks, since they don't retry the lane.

Gate: guide.html fixture (script/style/entity content) proven
Indexed with lane `htmltotext`, tags stripped and `&amp;` decoded in
TextPreview; streak proven advancing to 2 on the idempotency leg's
full rerun. **Gate PASSED 2026-08-15 (74/74).**

## v1.9 (2026-08-15)

**Relatedness upgrade** (improvement plan follow-on): three new
signals, all local and free — no AI spend, no dependencies, no
tenant changes. Rollout is gradual and cheap: each doc's related
list refreshes on its next reindex (+ reciprocal neighbor patches).

- **Body-text similarity** — new `BodyIndex` in sweep.mjs: a
  BM25-weighted cosine over the sidecar corpus (bodies below the
  header seam), built once per run from disk and upserted with each
  doc's fresh text as the run proceeds. Docs above
  `sweep.relatedBodySimMin` (default 0.15) join the candidate
  universe even with NO shared keyword/edge — the fix for docs about
  the same subject whose LLM keywords never matched — and every
  candidate carries `BodySim` into the final ranking.
- **Filename-family affinity** — camelCase-split filename tokens
  (`ComplexRouteShapesEventBehaviorRealign` → complex route shapes
  event behavior realign) score shared distinctive tokens, clustering
  the corpus's doc series.
- **Folder affinity** — same-folder candidates get a small bonus.

Implemented as **RelatedRank v2.2** with the r4 dormant-field
pattern: `BodySim`/`Folder` on candidate rows and `filename`/`folder`
in selfMeta activate the terms; flow-shaped input (the tenant-pasted
v2.1's wiring) produces byte-identical output — `check_related`
standing suite PASSED unchanged, no tenant paste needed, rollback
unaffected. Weights live in `RelatedWeights` config (`body.weight` 3,
`fname` 0.5×cap 6, `folder` 0.5), all inside the softCap bucket, so
id-link dominance still holds. Similarity is cosine (symmetric) —
the reciprocal-merge score contract survives.

Gate: spec.pdf's body shares calibration vocabulary with notes.txt
while sharing zero keywords — the live leg proves they relate through
the body-sim source alone, with "similar text (…)" in the why prose.
**Gate PASSED 2026-08-15 (71/71)**; PAD 27/27; `check_related` PASS.

## v1.8.1 (2026-08-15)

Rescue-gating fixes, found when the tenant's PDF rescue hit docs
living outside the synced `General` folder:

- **Out-of-scope PDFs looped through the PDF rescue nightly** (their
  Skip stamp keeps `ExtractionLane` ≠ "plaintext"), re-stamping the
  same rows every run and eating slots in the 150-doc cap. Both
  rescues now gate on `inScope` — an unreachable doc is stamped
  once, period.
- **Scope rescue**: the `"out of sync scope"` stamp now doubles as a
  rescue marker. After the OneDrive sync is widened (guide §6), every
  stamped doc re-indexes automatically on the first run where its
  file is reachable — no promptVersion bump, no corpus-wide AI
  respend, no touching files.

Gate: the widening is now simulated faithfully (server paths and
DocKeys unchanged; only the local root and `libraryRootSegment`
grow, exactly as the guide prescribes — fixtures restructured under
`Shared Documents/General` to match the real tenant): out-of-scope
txt AND pdf are stamped once, NOT reprocessed on the idempotency
leg, then both re-index by themselves after the widening.
**Gate PASSED 2026-08-15 (70/70).**

## v1.8 (2026-08-15)

**Ghost reconciliation** (improvement plan #9). After each full run
the sweep compares every Doc Index row's DocKey against the actual
library listing; rows whose source doc was deleted are set
`IndexStatus: Archived` with a dated LastError note, their sidecar
is pruned (dry-run-aware), they leave the relatedness candidate pool
(no more "related" links to dead docs), and their error-lane entry
clears. A doc restored from the recycle bin re-enters `Needs_index`
via the new Archived trigger and re-indexes automatically.

Safety rails, in order: reconciliation is skipped on `--only` smoke
runs and whenever the library listing comes back empty (a throttled
listing must never archive the world); archives are capped at
`sweep.maxArchivesPerRun` (default 20) per run with a log note when
more remain. **One-time tenant step**: add `Archived` to the Doc
Index `IndexStatus` choice values — until then the sweep halts
archiving with a log note naming the fix and runs normally
otherwise (`schemas/SPList_DocIndex.csv` updated).

Gate: seeded ghost row (Indexed, no matching file, stale sidecar on
disk) — dry leg proves the archive is planned but not executed;
live leg proves Archived + dated note + sidecar pruned + status-page
callout; idempotency leg proves archived rows are not re-archived.
**Gate PASSED 2026-08-15 (67/67).**

## v1.7 (2026-08-14)

**PDFs are indexed** (improvement plan #8; owner opted for the
pdftotext route to keep the repo zero-npm-dependency). New `pdf`
extraction branch shells out to Poppler's `pdftotext -layout -enc
UTF-8` (`sweep.pdftotextPath` or PATH); text-bearing PDFs run the
full pipeline (`ExtractionLane: plaintext` — an existing whitelist
value, no schema risk), scanned/no-text PDFs land in the Skip lane
with that lane recorded as the "attempted" stamp so they never
rechurn. **PDF rescue**: rows stamped `Skipped` at the current
PromptVersion by the flow or the pre-v1.7 sweep re-enter
`Needs_index` exactly once when the tool is present — the corpus's
PDF backlog indexes without a promptVersion bump (no full-corpus AI
respend). No tool installed = flow-era behavior (Skip lane) with a
log note. Also fixes `normalizeRows` dropping `LastError`/
`ExtractionLane` from snapshots (the v1.5 status page's error lane
was seeded empty because of it).

Gate: stub `pdftotext` (text for spec.pdf, empty for scan.pdf);
spec.pdf pre-seeded as `Skipped v2.0/lane none` — exactly the
post-backfill tenant state — and proven rescued→Indexed with a
sidecar; scan.pdf proven Skipped-with-stamp and NOT reprocessed on
the idempotency leg; no-tool leg proves graceful flow-era skip +
log note. **Gate PASSED 2026-08-14 (63/63).**

## v1.6 (2026-08-14)

**Out-of-scope lane** (improvement plan #7, the cheap floor). The
dry-run calibration showed ~102 tenant rows whose source files sit
outside the synced `libraryRootSegment`; when the v2.0 backfill
reached them they would each have become a *nightly* Error-lane
churn ("source file not found locally"). Now:

- A doc **structurally outside** the synced root gets a single
  STAMPED `Skipped` row (`LastError: "out of sync scope: ..."`), so
  it never rechurns; it re-enters `Needs_index` when modified or on
  a promptVersion bump after the sync scope grows. New
  `out_of_scope` summary counter + status-page callout with the
  remedy.
- A doc **in scope but missing on disk** stays a retryable Error,
  reworded to say what it almost always is (OneDrive sync lag) —
  clears itself when the file lands.

The full fix (actually indexing those docs) is syncing more of the
source library — a machine/disk decision, not a code change; the
lane makes the gap visible and quantified instead of noisy. Gate:
two new fixtures (`outside.docx` structurally out of scope,
`missing.txt` in scope but absent) + lane assertions on the live,
idempotency (the stamped Skip is NOT reprocessed) and status-page
checks. **Gate PASSED 2026-08-14 (59/59).**

## v1.5 (2026-08-14)

Unattended-operation hardening, the first post-handover batch:

- **Self-updating runs** — `run_sweep.cmd` does `git pull --ff-only`
  before each sweep (merged fixes deploy themselves; a conflicted
  state can't wedge the machine, it just runs what's checked out).
- **Missed-schedule catch-up** — new repo-tracked
  `local/sweep_task.xml` (register with `schtasks /create /xml`):
  StartWhenAvailable (machine off at 17:00 → run fires on wake
  instead of skipping the night) + laptop battery settings, which
  plain `schtasks /create` cannot express.
- **Fail-fast on dead auth** — a non-interactive run that would need
  a device-code sign-in now throws `AUTH EXPIRED` immediately (with
  the exact recovery command) instead of waiting 15 minutes for a
  prompt nobody will answer. `DOCINDEX_ALLOW_DEVICE_PROMPT=1`
  overrides (harness; redirected consoles).
- **Status page in SharePoint** — after every live run (and on fatal
  aborts) the sweep writes `_Sweep Status.md` to the sidecar library
  root: last run, result, prompt version, the Error-lane table with
  per-doc LastError, and an "action needed" line. Pipeline health is
  now visible where the team already reads the index.
- **Log hygiene** — per-run `sweep-*.json` logs pruned to the newest
  30; `sweep-task.log` rotates at ~5 MB (one previous generation).

Gate: +8 checks — status page contents on the live leg, prune-to-30
with fodder logs, and a dead-auth leg (fails fast, AUTH EXPIRED on
stderr, no device prompt started, fatal surfaced on the status
page). **Gate PASSED 2026-08-14 (55/55).**

## v1.4.3 (2026-08-14)

**SPO 401 resolved** — the v1.4.2 token matrix (run in-tenant) showed
why every SharePoint write failed: the Azure CLI client's SharePoint
grant carries only `scp=user_impersonation`, which SP REST rejects
(401 invalid_request) even for a plain GET, and the v2 named scopes
(`AllSites.Write`) are blocked outright for first-party clients
(AADSTS65002 preauthorization). The **Graph CLI public client + v1
resource form** was the sole winner: its token's scp carries real
SharePoint permissions (Sites.ReadWrite.All / AllSites family) and
both `GET /_api/web` and the `ValidateUpdateListItem` hyperlink write
succeeded. `SpoClient` device mode now defaults to the Graph CLI
client — and since that's the same client as the Graph sign-in, the
SPO token is **seeded from `auth/graph.json`'s refresh token** (Entra
refresh tokens are client-bound, not resource-bound): the third
sign-in prompt is gone entirely. `DelegatedAuth` gains
`seedCachePath` + a `client_id` cache marker (a cache written by a
different client is never refreshed against, it's re-seeded instead —
this self-heals the stale Azure CLI `spo.json` on the deployed
machine). Gate: device leg now asserts exactly two prompts
(graph+dataverse), SPO seeded via refresh grant, and the seeded token
on the SPO write. **Gate PASSED 2026-08-14 (47/47).**

## v1.4.2 (2026-08-14)

Diagnostic release for the live-walkthrough SPO 401: even a fresh v1
`resource=` device grant comes back with the generic SPO app-GUID
audience and only `user_impersonation` in `scp`, and SharePoint still
rejects it. `probe.mjs --spo` is now a **token matrix**: it redeems
the already-cached refresh tokens (Entra refresh tokens are
client-bound, not resource-bound — zero new sign-in prompts) for
every candidate token shape (v1 resource with/without trailing slash,
v2 named scopes `AllSites.Write` / `AllSites.FullControl` /
`.default`, Azure CLI and Graph CLI public clients) and for each one
prints the decoded claims, a plain `GET /_api/web` check (separates
"token rejected" from "this endpoint rejected"), and the hyperlink
write — including the `WWW-Authenticate` header on 401, where
SharePoint states the actual reason. Ends with a WINNERS line; the
winning shape gets wired into `SpoClient` next. New
`redeemRefreshToken()` export in auth.mjs (cache-untouched, additive).

## v1.4 (2026-08-14)

Live-run fix: **Graph cannot write hyperlink columns** — the probe
(`local/probe.mjs`, added during the live walkthrough) showed every
write shape for `SourceLink`/`TextFileUrl` rejected with 400
invalidRequest while all other fields pass. New `SpoClient`
(graph.mjs) routes exactly those two fields through SharePoint REST
`ValidateUpdateListItem` (hyperlinks as "url, description"; per-field
ErrorMessage checked — the endpoint 200s even on failure), which is
the same API the cloud flow's connector uses. The write layer splits
fields automatically; SPO auth follows the same device/app modes
(device default: the Azure CLI public client, pre-consented against
SharePoint — a third first-run sign-in, cached as `auth/spo.json`).
Also v1.3.1 (Predict `source` telemetry — AI Builder rejects without
it) folded in. Gate: the mock Graph now rejects hyperlink fields
like the real service and the SPO endpoint is mocked, so the live
leg proves the split path; device leg asserts all three resources
sign in and refresh. **Gate PASSED 2026-08-14 (46/46).**

## v1.3 (2026-08-14)

**No Azure app registration required.** New `local/auth.mjs`
implements the OAuth device-code grant against Entra using
Microsoft's own pre-registered public clients (the Graph CLI app for
Graph, Microsoft's public Dataverse sample client for AI Builder) —
`graph.auth: "device"` is now the default. First run prints two
device-code sign-ins (Graph, Dataverse); refresh tokens are cached
per resource under `paths.workDir/auth/` (0600) and later runs —
scheduled ones included — refresh silently. Everything runs as the
signed-in user with their existing SharePoint/Dataverse permissions,
which is the cloud flow's own connection identity model (rows show
your name as Created/Modified By, as today). Consent-restricted
tenants can point `clientId` at any allowed public client (e.g. the
Azure CLI). The client-credentials app-registration path from v1.0
remains as `"auth": "app"` for a future service-account setup.

Gate: new device-auth leg — mock devicecode/token endpoints, both
resources sign in, writes carry the delegated token, refresh-token
caches written, second run refreshes silently with no new prompt.
**Gate PASSED 2026-08-14 (45/45).**

## v1.2 (2026-08-14)

The AI step goes back to **the cloud flow's own model**: provider
`aibuilder` (now the default) invokes the same AI Builder custom
prompt the flow's Run_prompt action calls — directly via the
Dataverse Web API Predict action
(`msdyn_aimodels({modelId})/Microsoft.Dynamics.CRM.Predict`), with
the flow's three `requestv2` inputs, its response read
(`responsev2.predictionOutput.text`), and its lax parsing
(coalesce → brace-slice → parse). Same model, same tenant-hosted
prompt text, same AI Builder credit metering — zero behavior drift
in the AI step, and prompt promotion stays the AI Builder paste.
Auth reuses the Graph Entra app (client credentials against
`{environmentUrl}/.default`; register it as an application user in
the Power Platform environment — guide §3). No Power Automate
license involved.

The v1.1 `anthropic` provider (Claude-account OAuth / apiKey,
executing `prompts/DocIndex_Prompt.md` with schema-pinned output)
remains as an explicit opt-in for a future move off Power Platform;
switching providers changes the classifying model — treat it as a
PromptVersion-bumped backfill event.

Gate: main legs run against a mock Dataverse Predict endpoint whose
output is wrapped in prose + code fences (proving the brace-slice),
with wire-shape assertions (bearer token, `version: "2.0"`,
`requestv2` keys); the anthropic apiKey/oauth legs stay as targeted
single-doc runs. **Gate PASSED 2026-08-14 (39/39).**

## v1.1 (2026-08-14)

LLM auth without an API key. `llm.mjs` gains `llm.auth: "oauth"`
(now the default): a one-time `ant auth login` on the machine stores
a Claude-account OAuth profile, and the sweep mints short-lived
bearer tokens via `ant auth print-credentials --access-token`
(re-minted every 5 minutes and on 401), sent as
`Authorization: Bearer` + the required `anthropic-beta:
oauth-2025-04-20` header. `ANTHROPIC_AUTH_TOKEN` short-circuits the
CLI when set; `"auth": "apiKey"` (or a configured `apiKey`) keeps
the metered-key path as an explicit opt-in. Guide §3 documents the
two CLI traps (an exported ANTHROPIC_API_KEY silently outranks the
profile; refresh tokens hard-expire — re-login). Gate: new
apiKey-header assertion + an OAuth leg with a stub `ant` proving the
bearer/beta headers on the wire. **Gate PASSED 2026-08-14 (36/36).**

## v1.0 (2026-08-14)

New component: the Doc Index sweep as a **local Node orchestrator** —
Power Automate leaves the pipeline entirely (orchestration, compute,
AI Builder, premium licensing, import packages, designer mis-picks).
SharePoint stays as the storage/consumption layer; the Q&A agent,
TestPlanGen, curation flow, and human readers are untouched.

- `sweep.mjs` — the orchestrator, mirroring flow v2.8 action-for-
  action from the extracted orchestration spec: Needs_index gating
  (incl. the PromptVersion backfill lever), the four extraction lanes
  (+ oversize/pdf/msg/html → Skip lane), LLM classify with the flow's
  whitelist clamps, RegexExtract ids/products, the ~22-field Doc
  Index upsert with PromptVersion stamped only by the URL patch
  (self-healing partial failures), byte-faithful v2.8 sidecar headers
  (info table, `<!-- metadata -->` comment frame, related region,
  `---` seam), media with `doc{srcId}_` prefixes, IdKey/LinkKey/KWKey
  dedup with sorted-pair id edges and canonical alias folding,
  shortlist→final→sidecarpatch relatedness with reciprocal neighbor
  patching, Skip/Error lanes with `{step}: {detail}` LastError and
  retry-next-run recovery, and the flow's Run_summary line. Dry-run
  (shadow) mode executes all compute, records every write as a plan,
  and reports DocKey calibration against rows the cloud flow wrote.
- `graph.mjs` — minimal Graph client (client-credentials, paged list
  reads, item create/patch, throttle-aware). List GUIDs come from
  config — the FX-6 hand-typed-URI failure class is gone.
- `llm.mjs` — direct Anthropic Messages API call (raw fetch, zero
  npm dependencies) executing `prompts/DocIndex_Prompt.md` verbatim
  between its markers; nine-field output pinned by a JSON schema.
  Prompt promotion becomes a git pull, not a tenant paste.
- `pad/runner/ops.mjs` — the PAD runner's script loading + op
  dispatch extracted into a shared module so the sweep drives the
  UNMODIFIED `scripts/` through the same gated path (`run_job.mjs`
  refactored to import it; PAD gate re-PASSED 27/27, behavior
  identical).
- `harness/check_local_sweep.py` — gate (stdlib + Node 22+, mock
  Graph + mock LLM via http.server, generated fixtures, CI
  `fixture-free` job): dry-run leg (zero writes, plan recorded),
  live leg (rows/fields/sidecars/media/edges/keywords/junctions/
  reciprocal patch/Skip/Error lanes, 33 checks), idempotency leg
  (second run reprocesses only the Error doc, no LLM spend on
  stamped docs). **Gate PASSED 2026-08-14 (33/33).**
- `Local_Setup.md` — Entra app registration, LLM key, config,
  Task Scheduler (headless — no attended-session constraint),
  shadow-mode checklist incl. DocKey calibration, cloud-flow
  handover/rollback, deviations list, security notes.
- `config.sample.json` — machine config template (git-ignores as
  `local/config.json`; secrets via `{"$env": ...}`).

Deployment state: **authored, nothing switched over**. The cloud flow
keeps running until the §5 shadow checklist passes and DocIndexSweep
is turned off in the portal — never both live at once.
