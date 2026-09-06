# TestPlanGen v2.44 — the progress lines become the pipeline's shared narration (testplangen.mjs v1.23)

The v1.5 progress posture — narrate on stderr, keep stdout's JSON +
`Gen_summary` contract — is now `pipeline/lib/progress.mjs`, the module
every job in the pipeline narrates through (record:
`docs/changelog/pipeline.md`, "progress v1.0"). For this job:

- The lines are **byte-for-byte** what they were, and the default
  posture is unchanged: a manual single-story run narrates (snapshot
  size, lane sizes, the call's input size, a 30 s heartbeat while the
  one generation is in flight, the reply size and elapsed, the
  verifier's verdict); `--auto` and `--gap-report` stay quiet so their
  scheduled-task logs do not grow.
- It is now a **default, not a rule.** `--progress` / `--no-progress`,
  and the config's top-level `progress` key, override it — so an
  `--auto` night can be watched (its selection counts, then a
  per-story ticker) and a manual run can be silenced.
- A narrating run sets `LRSDOC_PROGRESS` for the Python layer, which
  adds the request shape going out, **the latency to the model's first
  streamed chunk** (a stuck request vs a thinking model) and the stop
  reason with token usage coming back.
- Gate: `tests/check_testplangen.py` unchanged at 238 — the v1.5 line
  assertions still pin the output, which is the point.

# TestPlanGen v2.43 — figure variety: timeline, state, matrix, UI wireframe and workflow figures (TestPlanFigures prompt v0.4, figurespec v1.3, testplangen.mjs v1.22)

Owner-requested (2026-09-06): "the current test plan gen flow only
generates route diagrams — add more variety to the types of
visualizations", "include UI wireframes if needed", "in some cases
it might be useful to include workflow diagrams as well". The v0.3
prompt already had three kinds, but its selection rules ranked
route-measure first (R2 > R3 > R1 …), R3 fell back to route-measure
whenever a measure was named, and R4 drew time slices as route
panels — so nearly every generated figure was a route schematic.
Three changes, one per layer:

- **Prompt v0.4 — five more kinds, four more rules, a kind-choice
  table, variety in the budget.** New kinds: `timeline` (dates on an
  ordinal time axis, spans and points — for "when does it hold /
  what does a query at date X see"), `state` (named states and the
  transitions between them, a denied transition included), `matrix`
  (a combinations grid — input dimensions × outcomes, ONE figure for
  a whole parameterized family), `wireframe` (a low-fidelity sketch
  of ONE named pane or dialog with only the controls, values and
  messages the Steps name, step numbers as callouts) and `workflow`
  (a flowchart of the Steps with its decisions and branches). New
  rules R6 LIFECYCLE, R7 COMBINATIONS, R8 UI WORKFLOW, R9 PROCEDURE
  carry them; R3 now picks topology when the RELATIONSHIP is the
  assertion even if measures are mentioned, and R4 picks timeline
  when the TIME is the assertion. A KIND CHOICE table maps "what the
  case asserts" to a kind, and X1 no longer excludes a UI case with
  three or more named controls. X6 becomes BUDGET WITH VARIETY: after
  ranking, every kind at least one candidate earned keeps one figure
  before any kind gets a second — never by changing a candidate's
  kind. Grounding extends to the new material: states, matrix axes,
  frame titles, control labels, values and table columns are whole
  phrases the plan writes (case-insensitive); axis dates verbatim.
  Two worked examples (a wireframe, a family matrix) join the split.
- **`local/lib/figurespec.mjs` v1.3 — verifier and renderer for
  every kind.** `KINDS` grows to eight, `RULES` to R1–R9; each new
  kind has its own closed vocabulary check and grounding (`phraseIn`,
  a case-insensitive whole-phrase match, beside the existing
  case-sensitive id and verbatim date checks), and its own SVG
  renderer in the SlideFigures palette: an arrowed date axis with
  toned bars and an open span dotted off the end; ellipse states with
  straight, arced (forward above, backward below) and self-loop
  transitions, the denied one dashed red, an initial-state dot; a
  grid of `node` cells (ink headers, ok/denied/n-a self-toned,
  unstated cells blank); a 440-px pane with a title bar, fields,
  dropdowns, checkboxes/radios, tables, lists, messages, a hatched
  map placeholder, right-aligned button rows and numbered warm
  callouts; a top-down flowchart ranked by longest forward path with
  elbow branches, a right-hand rail for back edges and two-line step
  labels. Two classes join `FIG_STYLE` (`.frame` — a container that
  owns no label, so svg2pptx never attaches a pane's inner labels to
  the pane; `.cell` — an empty matrix cell). The label placer gains
  `wall()` obstacles at the drawing's edges so a right-hand label
  falls back to its next candidate instead of leaving the plate.
  Route-measure, topology and sequence output is byte-identical to
  v1.2; svg2pptx / deck2pptx parse every new figure with no unknown
  element (classes are resolved from the SVG's own style block) and
  attach each nlabel to exactly one shape.
- **`local/testplangen.mjs` v1.22 — stamps and visibility.**
  `TestPlanFiguresPromptVersion v0.4`; the Generated Figures addendum
  reads `(wireframe, rule R8)` beside each caption instead of `(rule
  R8)`; `Gen_summary` gains `genKinds=<kind>:<n>,…` (vocabulary
  order; `-` when none) so a run shows its mix at a glance; `--help`
  names the kinds.
- Gate: `check_testplangen.py` leg 18 renders and svg2pptx-parses one
  spec of each new kind against a mini draft, checks the drawn
  features (dated ticks, the dashed-red denied transition, the red
  cell and blank cells, the frame/title/callouts/close glyph, the
  diamond and the dashed back edge), drops six ungrounded or
  off-vocabulary specs with their named findings, and reads the
  prompt for the kinds, rules and clauses — **241/241** (was 231).

Rollout: nothing on the tenant (the anthropic lane runs the repo
prompt verbatim; no tenant figures prompt exists). The next
`--figures` run on a plan with UI-driven, temporal, lifecycle or
parameterized cases should come back with a mix — read `genKinds=`
in Gen_summary. Existing route-measure figures re-render identically.

# TestPlanGen v2.42 — the design tokens verified against the published packages (designsystem v1.3, check_design_tokens.py)

Owner question (2026-09-06): could the Carbon MCP server (a hosted,
authenticated service that makes an assistant "an expert in Carbon" —
component docs, code examples, guidelines) help here? The owner is
not approved for it. It would not have changed the pipeline: the
sweep machine has no MCP at run time, and the deck needs tokens as
NUMBERS, which the open packages already publish. What it would have
given is a check that the transcribed values are right — so that
check was built from the same source of truth, no approval needed.

- **`local/harness/check_design_tokens.py`** downloads @carbon/colors,
  @carbon/type, @carbon/layout, @carbon/themes and @fluentui/tokens
  from the npm registry (and @uswds/uswds with `--all`, 34 MB) and
  diffs every value in `designsystem.mjs`'s token blocks against
  them: Carbon's spacing scale, productive type ramp, named colours
  and the White / Gray 100 theme roles; Fluent's type ramp, spacing,
  radii, strokes, `FLUENT_LIGHT` / `FLUENT_DARK`; USWDS's type scale
  and line-height tokens, spacing units, column-gap setting, radii,
  default typeface, and every colour role resolved through the theme
  assignments into the system colour families. Manual, not CI (a
  registry hiccup must never redden main): **180/180** on
  @carbon/colors 11.57.0, @carbon/type 11.66.0, @carbon/layout
  11.58.0, @carbon/themes 11.80.0, @fluentui/tokens 1.0.0-alpha.24,
  @uswds/uswds 3.14.0.
- **Six transcription slips corrected (`designsystem.mjs` v1.3):**
  Carbon border-subtle-01 is Gray 30 on White (was Gray 20) and Gray
  70 on Gray 100 (was Gray 80), g100 text-helper is Gray 40 (was Gray
  50); Fluent subtitle1's line height is 28 px (was 26); USWDS's
  line-height token 2 is 1.2 (was 1.15 — six line heights move, the
  title's to 43.2 px), its largest column gap is `$theme-column-gap-lg`
  = 3 units (the gutter was 4), and its DEFAULT sans is Source Sans
  Pro (`$theme-font-type-sans: source-sans-pro`; Public Sans is the
  shipped alternative — the uswds deck now renders in Source Sans Pro).
  `FLUENT_DARK` added for reference. Every other value — all of
  Carbon's colours and both themes, all of USWDS's colours, Fluent's
  sizes, spacing, radii and strokes — matched.
- Gates: `check_deckspec.py` 99/99 and `check_deck2pptx.py` 56/56
  updated to the corrected values; `check_testplangen.py` 231/231 on the merged tree.

Rollout: nothing on the tenant; a uswds deck changes face and line
rhythm, carbon decks change two border greys. Re-run the verifier
after any token edit:
`python3 local/harness/check_design_tokens.py --all`.

# TestPlanGen v2.41 — change made visible in before/after figures (figurespec v1.2, testplangen.mjs v1.21)

Owner-requested (2026-09-06), the first pick from the diagram
review: R2 (state change) is the strongest selection rule and
produces most figures, yet a Before/After pair rendered each panel
on its own scale and drew the after-state as if nothing had been
there before — an extended route was shrunk to fit and a split's
lost extent simply vanished. Rendering only; no spec vocabulary or
prompt change (still TestPlanFigures v0.3), grounding unchanged.

- **One scale per figure.** Every panel of a route-measure figure
  now measures with the same pixels-per-unit (the min and max over
  ALL panels' routes), so an extension grows on the page and an
  unchanged route sits exactly under its earlier self.
- **Each panel diffed against the one before it.** For every route
  in a later panel: an event whose extent changed on that route
  keeps a dotted muted ghost of its prior extent under its bar
  (visible where it no longer reaches — a split's lost half, a
  move's origin); a moved point event keeps a hollow muted dot at
  its prior measure; an event that is no longer on the route (gone,
  or now on another route) keeps a ghost row after the live ones,
  muted and dotted with its id and end measures; a route whose
  extent changed shows its prior extent dotted behind the line. The
  diff is structural only — tones stay the model's, since the prompt
  gives them meaning (green = correct result, red = rejected or
  retired).
- **A renderer-owned legend key**, "prior extent (earlier panel)"
  with a dotted muted swatch, joins the spec's legend items whenever
  a ghost was drawn — so a reviewer never reads a ghost as a live
  event. The ghosts are reserved geometry for the v1.1 label placer,
  and an id whose right-hand spot a ghost occupies moves left with a
  little more clearance than before.
- Date-slice panels (R4) get the same treatment panel by panel;
  single-panel figures are unchanged apart from the (now trivially
  shared) scale.

Gates: `check_testplangen.py` **231/231** (leg 18 — "100" lands at
the same x in both fixture panels; a split spec rendered in-process
shows E1's prior 16–40 and E3's ghost row dotted, P1's prior dot,
R1's prior 0–100, the legend key and swatch); `check_deck2pptx.py`
**56/56**. The split sample was eyeballed in Chromium.

# TestPlanGen v2.40 — route-measure figures made legible (figurespec v1.1, TestPlanFigures prompt v0.3, testplangen.mjs v1.20)

Owner-requested (2026-09-06): "enhance the svg diagrams — allow
intermediate tics, improve label positioning while preventing
overlap, measure labels at the beginning and ends of events."
Rendering only — the model's job (select, specify) is unchanged
except for one optional key; grounding is unchanged.

- **Intermediate ticks (`"ticks"`, prompt v0.3).** A route in a
  route-measure spec may carry `"ticks": <interval>` — unlabelled
  minor ticks at every multiple of the interval between from and to,
  skipping the calibration points, drawn shorter than the labelled
  major ticks in the SlideFigures `.tick` class. When the interval's
  pixel spacing fits a label, the ticks are labelled too (all or
  none, so a scale never reads 0, 10, 30). A rendering choice, not
  test data: the verifier never grounds it, but rejects a
  non-positive value and an interval that would draw more than 60
  ticks (a figure is a schematic, not a ruler). The prompt tells the
  model to use it only when a case names measures that fall between
  calibration points.
- **Measure labels at event ends.** Every line event's bar now
  carries its from and to measures under its ends; a point event
  carries its measure above the dot unless the axis already labels
  that value. A bar too short for two labels takes one `from–to`
  label instead. The line-event pitch grows from 14 to 26 to make
  room; a figure is correspondingly taller.
- **Collision-free labels.** Every text in a route-measure panel —
  route id, calibration and tick labels, mark labels, event ids, the
  new measures — goes through a placer: estimated text boxes
  (per-class average glyph widths of Segoe UI at the palette's
  sizes), the geometry reserved first (route line, bars, dots), each
  label tried at an ordered list of candidate positions (below the
  bar → beside it; above the route → below → higher), then nudged
  vertically a bounded number of times. A required label (an id)
  lands on its first candidate when nothing is free; an optional one
  (a measure that the geometry already implies) is dropped instead.
  Panel heights follow the lowest placed label. Fixes the v1.0
  overlap of a point event's id with the first line-event bar.
- **Unchanged:** topology and sequence rendering, the `<style>`
  block and classes (svg2pptx / deck2pptx consume the output as
  before), the addendum, the Gen_summary counters. testplangen.mjs
  v1.20 is the two stamps (`FIG_PROMPT_VERSION` v0.3, job version).

Gates: `check_testplangen.py` **229/229** (leg 18 — R1's `ticks: 10`
draws eight labelled intermediate ticks; 105 / 130 / 40 / 5 appear
as event-end measures; an estimated-box overlap scan over every
non-legend text finds none; a `ticks: 0.1` spec is dropped with the
cap finding ahead of its invented measure); `check_deck2pptx.py`
green (an inline figurespec still embeds as a native group).
Rendered output eyeballed in Chromium: the harness fixture and a
deliberately crowded panel (six events incl. two 2-unit bars and two
point events 3 units apart, a split and a gap mark).

# TestPlanGen v2.39 — method names from the sources (prompt v1.13, testplangen.mjs v1.19, draftlint v1.5)

Owner-requested (2026-09-06): a draft run's reasoning showed the
model declining to name the referent methods an exemplar plan lists
— "Route & Measure / Coordinates / Location Offset" — for a story
that says "all input methods" without naming them, because "the rule
is clear that exemplars only guide style and coverage — not feature
content". The owner's call: it should be able to pull method names
from the exemplar. v1.9 always meant that ("the concrete input
methods behind the story's 'all input methods'" REFINE a story
statement), but the exemplar lane's "never their feature-specific
content", the related-cases lane's "never a source of
feature-specific content or tool names", and the CASE SWEEP's "never
copy the source case's feature-specific content" said otherwise, and
the CONCRETE TEST DATA rule's "name each method the sources support"
had nothing to name.

- **Prompt v1.13 — the METHOD NAMES grounding rule.** When the story
  states a behavior over a CLASS of methods without naming its
  members ("all input methods", "each referent method", "any
  location method"), the names the source documents give that
  class's members — in EXEMPLAR TEXT, REFERENCE FUNCTIONALITY, or
  RELATED CASES — are the team's established vocabulary for the
  feature area, not feature-specific content: the draft borrows
  them, names each method in its own case or parameterized variant,
  and declares the borrowed set ONCE in Setup / Prerequisites as a
  `**Methods:**` line (the names, the story statement whose class
  they fill, the source document(s) by title, ONE [VERIFY] on the
  set) ahead of the `**Test data:**` line. Trace stays story-first
  (story statement, then the source by title); the CASE SWEEP's
  VARIATION clause is the judgment — a method is an INPUT of a
  stated behavior, never a behavior of its own. Guards: a method
  name is the name of a WAY to do a story-stated thing, never a tool
  or widget (a widget's name stays a tools-rule violation); a method
  the story excludes is not borrowed; a method's source-only RULES go
  to Open Questions while its NAME joins the variant list; no
  borrowed name without the declaration. Four cross-references
  (the exemplar and related-cases lane descriptions, the CASE SWEEP,
  the tools rule, the CONCRETE TEST DATA rule) now except method
  names explicitly. No input, section, sentinel, or lint-contract
  change; the six-parameter tenant contract is unchanged (the v1.13
  paste supersedes the pending v1.12 one).
- **Verifier (draftlint v1.5, testplangen.mjs v1.19).** Grounding
  check b (tool-shaped names must appear in the story) would have
  flagged every borrowed Title Case method name ("Location Offset")
  as an invented tool. `groundDraft` gains an optional third
  argument — the exemplar + reference + related-cases text the job
  sent — and check b passes a phrase the draft DECLARES on a Setup
  `**Methods:**` line when a source lane carries it; a declared name
  no source carries is its own finding (`grounding: declared method
  "…" appears in no source document`), and an undeclared name is
  flagged exactly as before. Without a source corpus there is no
  exception — the declaration alone never admits a name. The job
  passes the three lanes; `promptVersion` default → v1.13.
- **Not changed:** the Python contract lint (no structural assert
  touches the Methods line), the flows and packages (the tenant
  stamp still reads v1.10 pending the paste), the deck / figures
  passes (a `**Methods:**` line is prose to them).

Gates: `check_testplangen.py` **226/226** (leg 8 gains the
declared-and-sourced pass, the undeclared flag, the declared-
unsourced finding; the banner assertion reads v1.13).

# TestPlanGen v2.38 — the figures budget as a knob (TestPlanFigures prompt v0.2, testplangen.mjs v1.18)

Owner-requested (2026-09-06): doc 910 has 22 cases and the figures
pass's X6 rule fixed the budget at six figures per plan in the prompt
text. The cap is a per-machine choice, not a prompt concern.

- **`testplangen.figuresCap`** (default 6) is substituted into the
  prompt as its THIRD input, **FiguresCap** (`X6 BUDGET: at most
  {FiguresCap} figures per plan`); prompt v0.1 → v0.2, selection
  rules, exclusions, vocabulary and output unchanged. The anthropic
  lane picks it up on the next run; the aibuilder lane's tenant
  prompt (none exists) would need the third parameter created.
- **Enforced in code too:** after the grounding check, a reply past
  the cap keeps its first `figuresCap` grounded specs in case order
  and drops the rest with reason X6 (the model ranked; this only
  guards). A non-integer or out-of-range value (1–60) refuses BEFORE
  the generation spend.
- Raise `figuresMaxTokens` with it — roughly 1.5k tokens of JSON per
  spec; a 12-figure plan wants ~36000.
- Gate: `check_testplangen.py` 223/223 (the default 6 in the prompt
  and the Predict inputs, a cap of 1 keeping one spec and dropping
  the next with X6, 0 refused before spend).

Rollout: nothing on the tenant. `"figuresCap": 12` under
`testplangen` in `local/config.json` (with `"figuresMaxTokens": 36000`).

# TestPlanGen v2.37 — the review deck on three design systems, light or dark (designsystem v1.2, deck2pptx v1.2, deckspec v1.1, draft2pptx v1.3, testplangen.mjs v1.17)

Owner-requested (2026-09-06), following v2.36: "any other design
systems you'd suggest?" → add two; then "wire them into the figure
generation too, and a light / dark switch for each".

- **Three designs (`local/lib/designsystem.mjs` v1.1).** `fluent`
  (the v2.36 default — Microsoft Fluent 2, MIT, Segoe UI), `carbon`
  (IBM Carbon v11, Apache 2.0 — the productive type ramp heading-01 …
  heading-07 / body-01 / body-02 / label-01 / caption-01, the
  spacing-01 … spacing-13 scale, the 2x Grid's 32 px gutter, square
  surfaces, the White theme; IBM Plex Sans) and `uswds` (U.S. Web
  Design System v3, public domain — the size-N / line-height-N tokens,
  8 px spacing units, the desktop column gap, the default theme's
  base / primary / status colours; Public Sans). Every design supplies
  the same shape through `makeDesign`: the deck addresses type by
  DECK ROLE (display, hero, title, title2, subtitle, subtitle2, body2,
  body, bodyStrong, label, caption, caption2) and colour by DECK ROLE
  (textPrimary … dangerTint), and each design's `roles` / `colors`
  tables name the system token behind every number. `deckspec.mjs`
  v1.1 lays out on whichever design it is handed and never knows
  which; `deck2pptx.mjs` v1.1 `--design`, `testplangen.deckDesign`
  (an unknown name refuses BEFORE the generation spend), the
  provenance line names the design. The spec is design-independent:
  one JSON renders on any of them. Two legibility substitutions are
  named inline (a system's yellow "warning" is an icon tint; the text
  role takes its darker warm value). The face caveat is real: Plex
  and Public Sans are not on a typical Windows machine — install or
  embed them, or PowerPoint substitutes.
- **Light and dark themes (`designsystem.mjs` v1.2).** `designOf(name,
  theme)`; `--theme light|dark`, `testplangen.deckTheme`. Light = the
  system's published light values. Dark = the system's own dark
  surfaces where it publishes them (Fluent: the Diagram Style
  Framework's ink surfaces the rule-built deck already uses; Carbon:
  the Gray 100 theme verbatim; USWDS publishes no dark theme — its
  darkest base steps as surfaces, its "-light" ramp steps as
  text-on-dark status colours), with the status TINTS derived by
  blending each status colour 25 % over the dark layer (`mix`) and
  named as derived in `COLOR_SOURCE`. On dark, paper slides sit on
  the dark surface and dividers on the deep brand surface (Carbon:
  Blue 80). draft2pptx v1.3's `tableFrame` and `checkbox` take a
  colours option so the native table and the boxes follow the theme
  (the CLI passes none; its output is unchanged, 37/37).
- **Figures follow the deck (`restyleFigureSvg`).** Story and generated
  figures are drawn in ONE closed palette (figurespec FIG_STYLE, the
  sweep's SlideFigures). Before a figure becomes a shape group,
  deck2pptx v1.2 maps every palette hex — ink, secondary, muted, the
  plate, the node tints, the tone strokes, the lighter event strokes,
  the marker fills — onto the design + theme's roles, and the font
  family onto the design's face; the 24-entry map goes through
  placeholders so a mapped value is never re-mapped. Fluent / light
  is the identity (the figures are already in that palette; the group
  is byte-identical to v2.36). The SVG files on disk, the sidecars and
  the sweep are untouched — this is embed-time only, which is why
  nothing in figurespec, SlideFigures or the figure index changed.
- Gates: `check_deckspec.py` **99/99** (per-design shape, Carbon /
  USWDS tokens verbatim, same 16 pages inside the canvas on every
  design and theme, derived tints named, Carbon dark = Gray 100,
  restyle identity / mapping / no double-map, unknown design and
  theme refused); `check_deck2pptx.py` **56/56** (carbon in Plex with
  a regular-weight 36 pt heading-05 title and square cards, uswds in
  Public Sans at 40.5 pt bold, carbon dark: Gray 100 paper / Blue 80
  dividers / table header / the figure group re-coloured with no
  palette value left, fluent light's group unchanged, `--generate`
  honouring `deckDesign`, both refusals, `--help`);
  `check_testplangen.py` **221/221** (deckDesign / deckTheme refusals
  before spend, carbon + dark rendered, the run log and addendum
  naming the design). Every standing suite green.

Rollout: nothing on the tenant. `testplangen.deckDesign` /
`deckTheme` in config, or per file:
`node local\deck2pptx.mjs <draft>.md --spec <draft>--deck.json --design carbon --theme dark --media "<synced library>\media"`.

# TestPlanGen v2.36 — the review deck laid out by the model on a design system (TestPlanDeck prompt v0.1, testplangen.mjs v1.16, deck2pptx v1.0, deckspec v1.0, designsystem v1.0, draft2pptx v1.2, svg2pptx v1.5)

Owner-requested (2026-09-05): an LLM-based slide-deck generator whose
LAYOUT decisions follow an open-source design system, with the
diagrams and every other slide element as native, editable PowerPoint
objects for the test-plan review meeting. `draft2pptx.mjs` (v2.23)
already builds a deck by FIXED rule — the same walk for every draft,
one slide per case. This round puts a model in charge of the deck's
STRUCTURE while keeping the pixels in a design system and the words
in the draft — the never-invent rule extended to slides.

- **The design system (`local/lib/designsystem.mjs` v1.0).** Microsoft's
  Fluent 2 tokens, published open source under MIT as
  `@fluentui/tokens`: the type ramp (Caption 2 10/14 … Body 1 14/20 …
  Title 1 32/40 … Display 68/92, regular/semibold), the spacing ramp
  (XXS 2 … XXXL 32), corner radii, stroke widths, and the neutral /
  brand / status colour ROLES — carried verbatim, mapped onto the
  16:9 canvas (1280 × 720 CSS px, so px tokens apply directly) with
  ONE presentation scale (1.5 — a projected slide is read from across
  a room; the ratios and rhythm stay Fluent's), on a 12-column grid
  whose margin and gutter are the XXXL / XXL tokens, in three bands
  (header, body, footer). The colour roles are THEMED with the Diagram
  Style Framework palette draft2pptx and the sweep's figures already
  use, so the model-laid-out deck, the rule-built deck and the figure
  slides read as one design. The closed LAYOUT PATTERN catalog lives
  here too — thirteen patterns (title, section, stats, bullets,
  checklist, two-column, cards, comparison, table, flow, figure,
  statement, closing), each with named regions and capacities derived
  from the grid and the ramp — and `describeCatalog()` emits the
  lines the prompt carries, so the gate can assert prompt and module
  agree.
- **The prompt (`prompts/TestPlanDeck_Prompt.md` v0.1,
  `TestPlanDeckPromptVersion`).** Inputs PlanTitle, Draft (the whole
  finished draft, addenda included), Figures (the story and generated
  figures the draft cites, by file name). The model decides which
  pattern each slide takes, what goes in which region, how cases
  group, what earns a divider / statement / flow / comparison slide,
  and the presenter notes — under seven layout rules (one idea per
  slide; the walk; a case is a two-column; earn the extras; titles
  are yours, words are the plan's; notes are for the presenter; speak
  the deck, not the file) — and emits a closed-vocabulary DECK SPEC
  between `[[[DECK BEGIN]]]` / `[[[DECK END]]]`. Body content is
  either copied verbatim or pulled through `from` references
  (`{"case": "TC-P1", "field": "steps"}`, `{"section": …}`,
  `{"overview": "prose"|"verify"}`); counts on stats tiles are NAMED
  counters, never numbers the model computed. Anthropic lane
  verbatim; no tenant paste (the aibuilder lane would need a custom
  prompt with the three inputs and its GUID in `llm.deckModelId`).
- **Grounding + layout (`local/lib/deckspec.mjs` v1.0).** Pure module:
  `parseDeckReply` (fail closed — sentinels, JSON, the 60-slide cap),
  `deckCorpus` (draft2pptx's own dialect parser + the deterministic
  counts + the cited figures; the Generated Figures addendum's
  `### TC-…` headings are recognised as NOT cases), `verifyDeckSpec`
  (per slide: unknown pattern / key / region / tone / count / figure,
  required regions, caps, min/max counts, and the grounding test —
  every item, card body, cell, statement, lede and value must appear
  in the draft after whitespace / quote / dash / emphasis
  normalization; titles, labels, straps, asks and notes are the
  model's, capped — a slide with ANY finding is dropped with its
  findings, never repaired; the survivors come back RESOLVED), and
  `layoutDeck` (every element positioned in EMU on the grid; long
  checklists, case steps and tables paginate onto "(n of m)" slides;
  cards shrink one type step before giving up; nothing is placed past
  the footer — `withinCanvas` is the gate's invariant).
- **The renderer (`local/deck2pptx.mjs` v1.0).** Layout elements →
  native DrawingML through draft2pptx's emitter (exported in v1.2):
  text boxes, cards, chips, checkboxes, dots, numbered circles, accent
  bars, native tables, chevron chains (homePlate + chevron autoshapes
  with the step text INSIDE the shape) — and every figure as the same
  shape group svg2pptx emits: story figures from `--media`, generated
  figures from `--figures` or straight from the generation pass's
  memory (svg2pptx v1.5 `parseFigureSvg`), and inline figurespecs
  grounded + rendered on the fly. Speaker notes become a native notes
  page (draft2pptx v1.2 buildPptx grows a notes master). CLI:
  `--spec <deck.json>` renders a spec (the JSON a run writes beside
  the deck is hand-editable — the layout decisions are a text file);
  `--generate --config <config.json>` makes the one model call and
  writes `<out>.deck.json`; `--media` / `--figures` name the figure
  folders; a figure that resolves nowhere degrades to a muted note.
- **The pass (`testplangen.mjs` v1.16, `--deck` / `testplangen.deck`,
  `deckMaxTokens` 24000).** After the draft, the verifier, the
  figures pass and every addendum: one more model call over the
  FINISHED draft; the spec grounded, laid out and rendered with this
  run's generated figures embedded from memory and the story figures
  from `paths.sidecarLibrary/media`; `<draft stem>--deck.pptx` +
  `--deck.json` uploaded beside the draft (dry: beside the local
  copy) and linked from a deterministic `## Review Deck` addendum
  that also lists the dropped slides with their findings.
  `deck=<slides>/<proposed>` in Gen_summary; the run log carries the
  deck record. Fail soft after the draft is verified (one stderr
  line, the draft lands, `deck=0/0`); the aibuilder lane refuses
  BEFORE the generation spend without `llm.deckModelId`; `--auto` /
  `--gap-report` / `--models` refuse the flag. `--stream` echoes the
  deck call like the others.
- **draft2pptx v1.2 / svg2pptx v1.5.** The emitter, palette, geometry,
  dialect parser and package builder are exported and the CLI is
  guarded (the svg2pptx v1.4 precedent); `figureGroupXml` wraps the
  figure-group emission both decks use; buildPptx takes `{xml, notes}`
  slides (strings unchanged, byte-for-byte). svg2pptx gains
  `parseFigureSvg(text, name)`; `parseFigure` wraps it. Both CLIs'
  output is unchanged — `check_draft2pptx.py` 37/37, `check_svg2pptx.py`
  PASS.
- Gates: `check_deckspec.py` (fixture-free, CI job 1) **62/62** — the
  Fluent tokens verbatim, the scale applied once, grid arithmetic,
  prompt ↔ catalog agreement, fail-closed parse, corpus counts +
  figures, fourteen ways a slide is dropped and the one quoted/dashed
  literal that survives, every pattern inside the canvas, pagination;
  `check_deck2pptx.py` (python-pptx, CI full-format) **42/42** — the
  walk, the type ramp on the slide (36 / 18 / 13.5 pt, Segoe UI),
  grounds, checkboxes / cards / tables / chevrons / tiles / pills as
  native objects, story + generated + inline figures as shape groups,
  the not-embedded degrade, the notes page, amber flags, the CLI
  contract, `--generate` against a mock (prompt verbatim, inputs
  substituted, `deckMaxTokens`, the spec written + re-renderable, a
  sentinel-less reply exits nonzero); `check_testplangen.py` leg 21
  **218/218** — three model calls in order, the Figures input, the
  dropped slides, dry + live file placement, the embedded generated
  figure, the notes page, the addendum, the run log, fail-soft, the
  refusals, the aibuilder routing.

Rollout: nothing on the tenant. `node local\testplangen.mjs --config
local\config.json --story <id> --dry-run --figures --deck` writes the
draft, the figures, the deck and its spec into workDir; open the
.pptx in PowerPoint, edit any element in place, and re-render an
edited spec with `node local\deck2pptx.mjs <draft>.md --spec
<draft>--deck.json --media "<synced library>\media" --figures <workDir>`.
The rule-built `draft2pptx.mjs` deck is unchanged and remains the
zero-model-call fallback.

# TestPlanGen v2.35 — doc 910 draft review: the figures cap, four verifier false positives, the preserved-value lane (prompt v1.12, testplangen.mjs v1.15, draftlint v1.4)

Owner-requested (2026-09-05), reviewing the first `--figures` draft
for user story doc 910 ("Auto-Populate Referents for Merge, Split,
DynSeg, and Table Widgets"): the draft's verifier banner carried 7
findings and the figures pass produced nothing ("0 rendered of 0
proposed — pass skipped: LLM output truncated (stop_reason:
max_tokens)") even after the owner raised the token knob. All
seven findings were the VERIFIER's, not the draft's (three Coverage
Map rows, two tool-like names, two enumeration items); the figures
failure was a knob the error message never named.

- **Figures pass truncation (testplangen.mjs v1.15).** The pass
  bounds its reply with `testplangen.figuresMaxTokens` (8000) and
  ignores `testplangen.maxTokens` (the DRAFT cap) — but the
  truncation error it surfaced was llm.mjs's generic "raise the
  caller's maxTokens knob", so the owner raised the draft cap to its
  maximum and the figures reply was still cut at 8000. Two fixes:
  the pass now rewraps a max_tokens error naming its own knob, its
  current value, and the fact that `--stream`'s thinking summary
  spends the same budget (the draft call already did this for its
  knob); and the default rises to **24000** — a 22-case draft's six
  specs plus the prompt's mandatory per-case `skipped` list is on
  the order of 9k tokens of JSON, so 8000 could never complete a
  full-size plan. The pass still fails soft; the draft still lands.
- **Coverage Map rows covered by a conditional section (lint
  contract amendment v1.12 — Python authority first, draftlint v1.4
  mirrors).** The prompt's Coverage Map rule has said since the
  automation/documentation sections arrived that a Covered by cell
  may name "Automation Notes" / "Documentation Impacts" where those
  sections' bullets carry the requirement; both lints accepted only
  a TC id or "Open Questions", so every draft with an automation or
  documentation row (doc 910: rows 18–20) failed check 5. Both now
  accept a cited conditional section WHEN IT IS PRESENT in the draft
  (new label `Coverage Map row N: cited <section> section exists in
  draft`, the TC-id precedent); the citation label reads `… cites a
  case, Open Questions, Automation Notes, or Documentation Impacts`.
  Agreement leg extended with the pass/fail pair.
- **Grounding check b false positives (draftlint v1.4).** "The
  Experience Builder Split widget and the ArcGIS Pro operation …"
  was flagged as tool-like name "Experience Builder Split": the
  Title Case regex runs across an allowlisted product name into the
  next capitalized story word. A run now passes when it splits into
  a known multi-word term (allowlisted or in the story) abutting
  words that each appear in the story on their own; a run of single
  story words ("Quantum Route Wizard") is still flagged. "(From Date
  1/1/2000, To Date Null)" was flagged as "Date Null": a trailing
  VALUE word (Null, None, True, False, Yes, No, On, Off, …) is now
  trimmed before the length test.
- **Grounding check c false positives (draftlint v1.4).** "Includes
  testing" and "documentation plans" were flagged as dropped
  enumeration items — they come from the sidecar's machine-written
  `## Summary` ("Includes testing, automation, and documentation
  plans."), the AI digest, not from any story statement. The
  enumeration scan now skips the sidecar's machine sections
  (Summary, Related documents, Esri documentation) and resumes at the
  `---` seam / the first story H2. The story text the MODEL receives
  is unchanged.
- **Prompt v1.12 — preserved-value behaviors are Positive cases.**
  The doc 910 draft filed "attribute-only edit leaves referents
  unchanged", "date-only edit …", "re-entering the same measure …"
  (TC-N3–TC-N6) under the Negative lane, whose mandatory CAUTION
  alert says a pass is a denial or error, never the edit succeeding
  — those edits succeed and the pass is an unchanged value. One
  sentence in the Negative Tests rule sends a story statement that a
  value is PRESERVED / NOT updated on a valid, successful edit to the
  Positive lane. No input, section, sentinel, or lint change; the
  six-parameter tenant contract is unchanged (the v1.12 paste
  supersedes the pending v1.11 one).
- **Seen in the doc 910 draft and NOT fixed here (draft-level, for
  the §4 review):** the test-data table lists E12 ("referents NOT
  configured") inside the "referent fields configured" line-event
  table although Setup step 3 puts it on a second layer; TC-P15's
  point-event referent semantics, the add-event pathway in the
  Dynamic Segmentation / Table widgets, and merge with changed
  measures stay [VERIFY] items because the story is silent. Under
  lint v1.4 the draft's banner would carry no finding.

Gates: `check_testplangen.py` **203/203** (leg 5 agreement pair,
the two grounding checks, the figures truncation check),
`check_draft_coverage.py` on the fixtures via the agreement leg.

# TestPlanGen v2.34 — related cases: the retrieval lane (prompt v1.11, testplangen.mjs v1.14)

Owner-requested (2026-09-05), after the doc 910 review: the draft
carried spanning-event and referent-method coverage only as
[VERIFY] items, although the team's own cases for those dimensions
sit in the catalog — in plans the story's `related:` routing never
reached. Generation consumed the Test Cases index only through
plan-level issue-id links; nothing retrieved individual cases by
relevance. Now it does, with no file for a PE to maintain — the
index the nightly sweep already keeps is the source:

- **The lane (testplangen.mjs v1.14 — plan-first).** The unit of
  retrieval is the PLAN, because the team's coverage of a feature
  area lives in plans. A query is built from the story — its Tools
  tags (×2), its Keywords tags and its title's content-word stems,
  each weighted by rarity across the indexed cases (idf) and, for
  keyword/title terms, by how often the story text uses it — and
  every Indexed Test Plan with indexed cases (outside the two lanes,
  not the story) is scored on its title stems plus the union of its
  cases' tags, ×1.25 for the story's own surface, ×(1 + 0.1·ln(1 +
  matching cases)) for depth; duplicate-title uploads collapse to
  the newest. The top `relatedCasesPlans` (5) each send their
  `relatedCasesPerPlan` (3) best-matching cases WITH section text
  (sliced from the plan's sidecar via `caseSpans`, heading dropped;
  the row's CaseText as fallback; a case needs two matched query
  terms to earn a body) plus one "Other cases in this plan:" line
  listing up to `relatedCaseTitles` (20) remaining case titles — the
  plan's variation structure at title cost. Per-case
  (`relatedCaseChars` 700) and per-lane (`relatedCasesCap` 18000)
  budgets. Deterministic, read-only, no extra AI spend. Absent the
  list, or `testplangen.relatedCases: false`, the block reads
  "(none)" and the draft is the v1.10 draft. Gen_summary gains
  `relatedCases= relatedPlans= relCaseChars=`; the manual progress
  line names the plans with their relevance; `--preview` shows the
  block. **Evaluated before release** on the owner's 2026-09-05
  index (748 format-3.0 sidecars, 4,219 indexed cases in 142 plans)
  for story 910: v1.13's case-first scoring (tags ×10/×3 + stems)
  let two plans with generic tool tags fill every slot while the
  referent-centric plans ranked 140th and lower; plan-first ranking
  with depth puts DynSeg Merge Option, Merge Events Widget, Split
  Event Widget, Merge Events Pro and the 64-bit OID event-editing
  plan in the lane — the plans whose sibling case titles carry the
  spanning / non-spanning and referent variations the doc 910 draft
  lacked. Also seen in that evaluation and NOT fixed here: the
  exemplar plan 906 has zero indexed cases (its slides are prose and
  tables with no case headings — the `--normalize-cases` lane's
  job), so the case index carries nothing from the one plan written
  for this feature area.
- **Prompt v1.11 — the SIXTH input `RelatedCases`** (a CONTRACT
  change like v1.3's ReferenceText: the tenant AI Builder prompt
  needs the parameter created before the paste; the anthropic lane
  needs nothing). One new text block, one lane rule (treat each
  related case exactly like an exemplar case — a pattern, never
  feature content or tool names), the Source Case Sweep condition
  widened to the three lanes, the CASE SWEEP covering every related
  case with "(related case)" in its Source plan cell, and the new
  **VARIATION clause**: a source case that exercises a behavior
  THIS STORY STATES over a different input value — a spanning line
  event, another referent method, point where the story says point
  and line, an option on — is a variation of a stated behavior:
  Applies, mint the parameterized case for that value, Trace citing
  the story statement first and the source case second. A source
  case whose BEHAVIOR the story never states stays Verify. The
  story-first posture is unchanged; what changed is the definition
  of "the story says nothing" — it no longer covers inputs the
  story's own statement already ranges over. Section order,
  sentinels, and the lint's structural asserts are untouched.
- Not done here, deliberately: axis mining from sibling case titles
  (judged too noisy for the verifier); the verifier noise items
  from the same review (Coverage Map rows citing Automation Notes,
  the Title Case tools heuristic on step phrases) — separate.

Gate: `check_testplangen.py` **198/198** — leg 20 (Plan F's tagged
cases sent in score order with sidecar section text and headers;
in-lane plans' cases and a below-threshold case excluded; the slots
knob; `relatedCases: false` and no-list "(none)"; the anthropic
prompt carries the block, the VARIATION clause and no leftover
placeholder; the preview shows the sixth input). Tenant step queued:
create the `RelatedCases` parameter on the AI Builder prompt, then
paste v1.11 (`Coverage_Runbook.md` step 2's pattern) — the cloud
flow packages are NOT re-cut here (the local job is the live path).

# TestPlanGen v2.33 — console streaming (testplangen.mjs v1.12, llm.mjs v1.7)

Owner question (2026-09-05): "Is it possible to stream the LLM's
responses or thought process in the console?" — yes on the
anthropic lane, which already streamed (llm.mjs v1.6) but printed
nothing while it did. Built for that lane:

- **`--stream`** (or `testplangen.stream: true`) on a MANUAL run
  echoes the model's output to stderr as it arrives: first the
  model's THINKING SUMMARY, then the REPLY, for the draft call and
  the figures call alike — each under a `--- draft: model thinking
  ---` / `--- draft: model reply ---` rule and closed by
  `--- draft: end of stream (N chars) ---`. The request adds
  `thinking: {type: "adaptive", display: "summarized"}` only when
  echoing (the default display is "omitted": the model thinks and is
  billed the same, but its blocks arrive empty). The raw chain of
  thought is never returned by the API on any model; the summary is
  what exists.
- **llm.mjs v1.7** — `generateText(cfg, prompt, {onDelta,
  showThinking})`: `onDelta(kind, text)` fires per SSE chunk with
  kind "text" | "thinking", and "restart" on a transport retry
  (the partial echo is stale — the console prints a
  `[stream restarted]` rule; accumulated text and the fail-closed
  posture are unchanged). Existing callers pass nothing and behave
  as before.
- The 30-second heartbeat stays silent while a stream is echoing
  (the deltas are the heartbeat). stdout keeps the JSON +
  Gen_summary contract byte-for-byte; the written draft is
  identical — the marker slice still runs on the COMPLETE reply.
  The aibuilder lane cannot stream (Dataverse Predict is one
  request, one response): `--stream` there prints one progress
  note and is otherwise ignored. Auto and gap-report runs stay
  quiet for their task logs.

Gate: `check_testplangen.py` **189/189** — leg 19 (the thinking
key on the request; thinking chunks then reply chunks in arrival
order for both calls, with rules and char counts; no heartbeat;
stdout untouched; the draft byte-identical; no key and no echo
without the flag; the aibuilder note). The mock's SSE emitter now
serves a thinking block when the request asks for it.

# TestPlanGen v2.32 — generated figures (testplangen.mjs v1.11, figurespec v1.0, TestPlanFigures prompt v0.1 wired)

Owner-requested (2026-09-05): "build the --figures pass and
renderer." The v2.31 addendum's prompt is now a working pass:

- **`--figures`** (or `testplangen.figures: true`) — after the draft
  is verified, ONE more model call sends the draft body to
  `prompts/TestPlanFigures_Prompt.md` (inputs PlanTitle + Draft; the
  anthropic lane executes the repo prompt verbatim with
  `figuresMaxTokens` 8000; the aibuilder lane needs
  `llm.figuresModelId`, and refuses BEFORE the generation spend when
  it is missing — no tenant prompt exists yet). The model SELECTS
  the cases worth a schematic (R1–R5, X1–X6, cap 6) and emits a
  closed-vocabulary FIGURE SPEC per case; it never draws.
- **`local/lib/figurespec.mjs` v1.0** (pure, no I/O, no AI):
  `parseFiguresReply` (the G9 fail-closed sentinel slice + JSON),
  `draftCorpus` (each TC case's section + the Setup / Prerequisites
  tables + the title), `verifyFigureSpec` (grounding: every id a
  whole word in the case or Setup, every measure a value there AND
  inside its route's range, from < to, panel dates verbatim, actor
  labels in the case; vocabulary: kinds, tones, shapes, mark kinds,
  outcomes, every cap — a spec with ANY finding is DROPPED, never
  repaired), and `renderFigureSvg` (route-measure panels with
  routes, calibration ticks, line/point events, ranged and point
  marks; topology nodes/edges; sequence actors/lifelines/steps with
  denied steps in red) in the SlideFigures vocabulary and palette —
  the same `<style>` block, classes, markers and single translate
  group svg2pptx and draft2pptx already consume.
- **Placement**: figures are the draft's siblings —
  `<draft stem>--fig-<case>.svg` uploaded as `image/svg+xml` (live;
  `graph.putFile` gained a content-type argument, default unchanged)
  or written beside the local copy (dry) — and linked from a
  deterministic `## Generated Figures` addendum (title, image,
  caption, rule; dropped specs with their findings; the model's
  not-illustrated list). The draft BODY is untouched: the v1.10
  FIGURES rule (story figures only in `**Figure:**` lines), the
  contract lint and draftlint check e are unaffected.
- **Fail soft after the verified draft**: a sentinel-less or
  non-JSON reply, or a transport error, skips the pass with one
  stderr line and the draft still lands (`genFigures=0/0`, the
  addendum states the skip). `Gen_summary` gains
  `genFigures=<rendered>/<proposed>`; the run log lists every spec
  with its file or its findings. Manual runs only (refused with
  `--auto`, `--gap-report`, `--models`); `--preview` never reaches
  it. Knobs: `testplangen.figures` (false), `figuresMaxTokens`
  (8000), `llm.figuresModelId`.
- Not yet: draft2pptx renders story `**Figure:**` lines only — the
  Generated Figures addendum's SVGs convert with `svg2pptx.mjs`
  meanwhile; a `--generated` flag for draft2pptx is the queued
  follow-on.

Gate: `check_testplangen.py` **183/183** — leg 18 (one generation +
one figures call; PlanTitle/Draft inputs; two grounded specs render
with the vocabulary asserted — panels, routes, events, the extend
mark, the denied step; an invented measure and an unknown case are
dropped with their findings in the addendum and the run log; live
upload as siblings with site-URL links; the sentinel-less skip; the
anthropic lane with its own maxTokens; the `--auto` refusal; the
missing-model-id refusal before any spend). `check_local_sweep.py`
green on the putFile signature. Rendered output was eyeballed in
Chromium: before/after route pairs, a lock-conflict sequence, a
topology graph.

# TestPlanGen v2.31 — first-run review of the local job (testplangen.mjs v1.10)

Owner-requested (2026-09-05): "I'd like to try running the test plan
generator — review its logic and make any enhancements you see fit."
A read of `local/testplangen.mjs` v1.9 end to end against the design
record (`Local_TestPlanGen_Plan.md`) and the Setup guide's G1–G13.
The lane routing, the G6 fallback, the fail-closed marker slice, the
verifier, the auto mode, and the case lane all read as specified;
the gate held at 156/156. Four defects and three run-it-for-the-
first-time enhancements, no prompt text change, no flow change:

**Fixed**

- **Exemplar trim overran ExemplarCap when the plan's HEAD was the
  overflow** (`caseAwareTake`). The head (metadata, Related,
  Overview) was cut to the full remaining budget, no case fit, and
  the omission footer was appended anyway — up to ~100 chars past
  the cap, the v2.13 invariant the caps leg pins. The head now
  yields the footer's room (the reserve covers the footer's widest
  digit form) and a final guard keeps the invariant unconditional.
  A probe across every budget from 50 chars to the plan's full
  length shows zero overruns.
- **Same-minute drafts overwrote each other.** v2.30's stem-based
  names carried a MINUTE stamp; Graph's drive PUT replaces, so two
  runs on one story inside a minute (a re-run after a verifier
  finding, the common case) silently replaced the first — against
  G11's never-overwritten rule that the run log already honoured
  with seconds. Names are `<stem>--draft-<yyyymmdd-hhmmss>.md`; the
  auto-mode scan accepted both widths already.
- **Auto-mode idempotency keyed on any row's stem**, so a Test Plan
  sharing a story's sidecar stem could mark the story as already
  drafted. The stem→id map is User Story rows only.
- `--issue` listed the Doc IDs list a second time; it now resolves
  through the run's shared fetch. The file header still said v1.6.

**Added**

- **`--preview`** — the zero-spend first run: guard, lookup, pins,
  the remote mirror, every lane, and the provider resolution
  (including the aibuilder model-id check) run exactly as for a
  generation; the five prompt inputs land in workDir
  (`testplangen-preview-<stamp>.md`, delimited per input, sizes
  stated) and the job stops BEFORE the model call. The summary line
  keeps the lane counters and adds `inputChars= provider=
  preview=1`; `--live` alongside it writes nothing. Use it to prove
  auth, config, the sidecar mapping and the related routing on a
  new machine, and to tune caps/pins on a story before drafting.
  Manual runs only (refused with `--auto`, `--gap-report`,
  `--models` — the unattended selection preview stays
  `--auto --dry-run`).
- **`--help` / `-h`** prints the usage and exits 0.
- **Remote-files mode.** The design record's G3 row promised the
  sidecar "from the synced library (or Graph under
  `sweep.remoteFiles`)"; only the first half was built, so on any
  machine without the OneDrive sync the job refused with "sidecar
  not found locally". With `sweep.remoteFiles: true` the run now
  mirrors the sidecar drive down into `paths.sidecarLibrary` at
  start through the sweep's own `RemoteLibrary` (v1.39 —
  `local/Hosted_Runner.md`), sharing its eTag manifest, so a run
  after the nightly sweep downloads nothing and the lanes come out
  byte-identical to the synced-folder run. Lists stay read-only;
  the refusal message without the flag now names the fix.

Gate: `check_testplangen.py` **168/168** — leg 16 (preview: zero
model calls and nothing uploaded even with `--live`, the summary
line, the inputs file, the `--auto` refusal, `--help`; the trimmer
head-overrun fixture under a cap smaller than the head plus a
case — the pre-fix build fails it by ~40 chars) and leg 17 (an
EMPTY workspace under `remoteFiles` mirrors every sidecar down,
identical lanes, a second run downloads nothing, and the no-flag
refusal names `sweep.remoteFiles`); leg 2 pins the seconds stamp.
Docs: Local_Setup §11 (first-run order now starts with
`--preview`; draft/idempotency names), README, STATUS.

**Addendum — `prompts/TestPlanFigures_Prompt.md` v0.1 (authored,
not wired, not pasted).** Owner question: can an LLM pick the test
cases in a generated plan that are good candidates for a figure, and
generate the figures? Yes, in two halves: the model SELECTS (five
rules — measure geometry, state change, topology, temporality,
interaction — six exclusions, a cap of six, ranked) and emits a
closed-vocabulary FIGURE SPEC per selected case (route-measure
panels with routes/calibration/events/marks; topology nodes/edges;
sequence actors/steps), every value copied from the case or the
Setup tables; a deterministic renderer draws the SVG in the
SlideFigures vocabulary/palette so svg2pptx and draft2pptx consume
it unchanged, and a grounding check (ids exist, measures inside
their route, values verbatim) drops any spec that invents. The
draft body is untouched (the v1.10 FIGURES rule stays
story-figures-only); generated figures would ride a `## Generated
Figures` addendum. Inputs PlanTitle + Draft; sentinel-wrapped JSON
out; `TestPlanFiguresPromptVersion: v0.1`. Queued follow-on: the
`--figures` pass + `lib/figurespec.mjs` renderer + harness leg.

# TestPlanGen v2.30 — case-aware generation (testplangen.mjs v1.9, caseindex v2.1)

Owner-requested (2026-09-05): "leverage the test case indexing to
enhance the test plan generator." The sweep's per-case index (the
Test Cases list, `local/Case_Index_Plan.md`) so far fed only the
gap report; v2.30 feeds the GENERATION itself — the three items the
plan queued as "each its own decision later", decided and built.
All deterministic, read-only over the list, zero extra AI spend,
and NO prompt text change (the lanes carry the same block shapes;
only WHICH text fills them changes — so no TestPlanGenPromptVersion
bump, no stamps, no package re-cuts):

- **G5c — case-traced routing.** Plans whose indexed cases cite one
  of the story's own devtopia issue ids (the story's Doc IDs keys ∩
  the case rows' `IssueRefs`) fill the slots the related routing
  left open — same-surface plans as exemplars, others (and
  same-surface overflow, the G5b rule) as reference functionality,
  ordered same-surface first, then by tracing-case count, newest,
  id. This runs AFTER the related routing (flow parity) and BEFORE
  the G6 fallback, which now fires only when nothing at all was
  found. Rationale recorded: a case that states the story's issue
  id is a link the sweep minted from the plan's own text, not a
  similarity guess — so it is not the machine-chosen fallback the
  reference lane bans (v2.12's no-fallback rule stands for
  everything else). Pinned and already-routed plans are skipped.
  A gap story the v2.29 report flagged as "case-level coverage
  without a doc link" now drafts with exactly those plans in its
  lanes.
- **G7 — case-aware exemplar trimming** (`caseAwareTake`). An
  exemplar body that overflows its remaining ExemplarCap budget is
  cut WHOLE CASES at a time: the plan's head (metadata table,
  Related, Overview) stays, the cases most relevant to the story
  are kept in DOCUMENT order, a closing line states how many were
  omitted, and the tail (Coverage Map, other content) rides only if
  it still fits — instead of the blind character cut that used to
  end mid-case. Relevance: a case citing a story issue id (its own
  parsed refs ∪ its row's IssueRefs) scores 100, each shared Tools
  tag 10, each shared Keywords tag 3 (the case row's curated tags,
  caseindex v1.2, joined by CaseKey ordinal; the story's from its
  sidecar metadata table); ties keep document order; a case too big
  for what is left is skipped so smaller relevant ones still fit. A
  plan not yet recased scores on issue refs alone; a plan with no
  recognizable cases takes the blind cut it always did; a plan
  under the cap is sent whole. `caseindex.mjs` **v2.1** adds the
  pure `caseSpans` export (the section line ranges behind
  extractCases' ordinals) — no CaseIndexVersion bump, row output is
  unchanged.
- **`## Existing Test Cases` addendum.** After verification (the
  Issue Trace precedent — machine-minted, never judged by the
  verifier), every indexed case across the catalog that already
  cites the story's issues, one table row each (plan, case, class,
  the cited keys, an `[open](<sidecar#anchor>)` deep link — the
  row's stored Anchor), capped at 60 rows with a pointer to
  `_Case Catalog.md`. The reviewer's dedupe and cross-check surface:
  a tailored case that duplicates one should say so in its Trace; a
  behavior they exercise that the draft lacks is a coverage
  question. Sits after the Issue Trace, before the Reference
  Documentation addendum; `review/harness/check_draft_coverage.py`
  passes a draft carrying it (trailing sections were already
  tolerated).

Provenance: `Gen_summary` gains `existingCases= caseRouted= caseTrim=
exCases=<kept>/<total>` (cases shown / cases parsed across the
exemplar lane), the banner's HTML comment carries `case-routed
[ids]`, and manual runs print a `progress: cases —` line (rows,
tracing cases, routed ids, trim counts). Knob: `testplangen.caseIndex`
(default true) — false turns all three off; the list GUID absent
turns them off too. Either way the lanes, the G6 fallback, and the
written draft are exactly what they were (the counters read zero).
`--auto` drafts pick the lane up unchanged — it is deterministic
from catalog state. The gap report's Test Cases read moved onto the
shared once-per-process fetch (`caseRowsOf`); its output is
unchanged. Cloud flows untouched.

Gate: `check_testplangen.py` **156/156** — new leg 15 (case-traced
routing ahead of the G6 fallback with the banner stamp and progress
line; already-routed plans not routed twice; the Existing Test Cases
addendum with its anchor deep link and its place after the Issue
Trace; the trim: three of six ~500-char cases kept — the issue-citing
one, the Tools-tagged one, the Keywords-tagged one — in document
order with the head, the omission line, no mid-case cut, and the
lane within budget; a plan under the cap sent whole; the no-list and
`caseIndex: false` degrades, blind cut included). Leg 2b now pins
the pure G6 fallback with the lane off (with it on, story 13's
traced plan routes in — leg 15's first check). `check_caseindex.py`
78/78 unchanged.

# TestPlanGen v2.29 — case-level gap tracing (testplangen.mjs v1.8)

The gap report learns the truth adjacency cannot see
(`local/Case_Index_Plan.md` phase 3). With the sweep's **Test
Cases** list configured (`sharePoint.lists.testCases` — sweep
v1.42's per-case index), `--gap-report` reads it (read-only, like
every list this job touches) and checks each story's issue ids
against every indexed case's own `IssueRefs`:

- the head and the `mode=gap-report` summary line gain
  `caseRows= traced= coveredUntraced=`;
- a new **Case-level tracing** section lists covered stories whose
  issues NO case cites — "covered by adjacency ONLY": a plan sits
  next to them (related-list entry or Doc Links edge), but no case
  actually exercises their issues — naming each covering plan and
  its case count;
- a GAP story whose issues some case already cites is flagged on
  its line as case-level coverage without a doc link (the inverse
  blind spot);
- covered stories with no issue ids to trace are counted, not
  listed.

`linkedToPlanSet` now returns a story→plans Map (the auto mode's
membership test reads it unchanged) so the tracing section can name
the covering plans. Without the list GUID the report is
byte-for-byte the pure-adjacency report it always was — no config
migration needed. No AI spend, no prompt or flow changes, no
TestPlanGenPromptVersion bump.

Gate: `check_testplangen.py` **141/141** — tracing counters, the
covered-untraced listing (story 17's issue cited by no case, its
covering plan's case count named), the traced story counted-never-
listed, the flagged gap story (13's issue cited by a plan-22 case),
and the no-list degrade leg.

# TestPlanGen v2.28 — hyperlinks as references (testplangen.mjs v1.7)

(Merged after v2.27 landed independently on main — this entry
carried the v2.27 label while in review and was renumbered to
v2.28 at merge time, the v2.25→v2.26 precedent.)

Owner-requested (2026-09-04): "can we include hyperlinks as
references like this?" — a link to an ArcGIS Pro tool-reference
page. Yes: the `--reference` pin (v2.22's pinned lanes) now ALSO
takes an **http(s) URL**, so official product documentation joins
the REFERENCE FUNCTIONALITY lane beside the catalog's own Test
Plans and Design Spikes:

```
node --experimental-strip-types local\testplangen.mjs --config local\config.json ^
  --story 12 --reference "https://pro.arcgis.com/en/pro-app/latest/tool-reference/location-referencing/enable-referent-fields.htm" --live
```

**testplangen.mjs v1.7** — one URL per flag occurrence (URLs may
contain commas, so a URL value is never comma-split; ids and URLs
mix freely across repeats; `--exemplar` still refuses URLs — a web
page is never a style/coverage exemplar). The page is fetched up
front under the pin posture's HARD-guard rule: a fetch failure, a
non-2xx status, a binary reply, or a page with no readable text (a
script-rendered SPA) refuses the run BEFORE any model spend — a
human asked for this exact page, so silent degrade is wrong; the
coached fix is to save the page as a document, upload it to the
source library, and pin its row. Fetch timeout is the new
`testplangen.webRefTimeoutMs` knob (30000). The HTML is reduced to
plain text by a zero-dependency tag strip — scripts/styles/nav/
comments dropped, headings become `#`s, list items bullets, table
cells pipe-separated, entities decoded AFTER the strip so
`&lt;script&gt;` can never re-materialize as a tag — and injected
with a `--- REFERENCE: <page title> — surface web documentation
<url> ---` header. Because the fetched page is the lane's only
PUBLIC-internet input, marker shapes in its text (`<<<` `>>>`
`[[[` `]]]`) are defanged into lookalikes, so a hostile page can
neither close a prompt block nor forge the G9 draft markers (the
prompt's untrusted-data rule and the lastIndexOf slice already
resist both — belt and braces).

**Prompt: deliberately UNCHANGED (still v1.10, no
TestPlanGenPromptVersion bump, no stamps, no package re-cuts).**
The reference block's contract already fits: a documentation page
is exactly a "document describing the expected behavior of this
story's feature area", the model may ground behavior on it with the
Trace citing the page BY TITLE (the story-first rule additive as
ever), the surface-parity [VERIFY] fires naturally because the
header's surface slot carries `web documentation <url>` — never the
story's surface — and the tools rule still admits no tool names
from references. Cloud flows are untouched (pins are a local-job
feature; the flow's reference lane stays related-doc-driven).

**Provenance + review handoff** — the banner's HTML comment carries
the pinned URLs (`web references [<url>]`), `Gen_summary` gains
`webRefs=` (pages actually injected into the lane; `pinnedRef=`
keeps counting doc-row pins), and the written draft ends with a
deterministic **`## Reference Documentation`** addendum — minted by
the job AFTER verification (the Issue Trace precedent, so the
verifier never judges machine-minted content) — hyperlinking each
page the model saw, for the §4 reviewer to open. Web-reference
budget stays under `referenceCap`, pins served first in the order
given, exactly like doc pins.

**Harness** — `check_testplangen.py` 126 → **136**: new leg 14 — a
web pin leads the lane with the title + url header; the page
reduces to readable text (tags/scripts/nav gone, headings and
bullets kept); entity-encoded marker shapes are defanged; webRefs=
counts apart from pinnedRef=; a 404, a no-text page, an `--exemplar`
URL, and an `--auto` combination each refuse with zero model calls;
the written draft carries the Reference Documentation addendum and
the banner URL stamp; a pin-less run stamps `webRefs=0`. The mock
server grows a `/webref/` HTML lane (real 404s included). 136/136
PASS; draftlint untouched (no new checks — the addendum is plain
links, invisible to check e's image-link scan).

| Piece | Version | Where |
|---|---|---|
| Local generation job (web references, webRefs=, addendum) | **v1.7** | `local/testplangen.mjs` |
| Machine config template (webRefTimeoutMs) | — | `local/config.sample.json` |
| Generation prompt | v1.10 (unchanged — deliberate, see above) | `prompts/TestPlanGen_Prompt.md` |
| Generation-job gate | **136 checks** | `local/harness/check_testplangen.py` |

| Date | Machine | check_testplangen |
|---|---|---|
| 2026-09-04 | authoring env (mocked) | 136/136 PASS |


# TestPlanGen v2.27 — review deck embeds cited figures (draft2pptx.mjs v1.1, svg2pptx v1.4)

The v2.26 queued follow-on: a draft case's `**Figure:**` line (prompt
v1.10's FIGURES rule) used to pass through the review deck as prose —
the raw markdown image link on the case slide. The deck now renders
the cited diagram itself.

**draft2pptx.mjs v1.1** — new `--media <dir>` flag (point it at the
OneDrive-synced sidecar library's `media` folder):

- Each case's `**Figure:**` image links are lifted out of the case
  body at parse time (alt text + href; never rendered as raw
  markdown). A cited link is absolute (testplangen.mjs v1.6's
  rewrite) or sidecar-relative (a cloud-flow draft); either way the
  FILE is the last path segment, resolved under `--media`.
- A resolved figure becomes a FIGURE SLIDE directly after its case's
  slides: the deck's chrome (TC id pill in the section colour, a
  teal FIGURE tag, the story's own alt text as the slide title, the
  footer of record) around the same native, editable shape group
  svg2pptx puts on a figure slide — one figure vocabulary, one
  emitter, via the new svg2pptx exports. The plate stays dropped,
  the group scales down only when it would not fit, and the SVG's
  title/desc ride along as the group's name and alt text.
- Degrade, never fail: without `--media`, or when the file is
  missing or unparseable, the deck still converts — the case slide
  carries a muted `Figure: <alt> (not embedded)` note and stderr
  names the fix (each reason distinctly). A `--media` path that is
  not a directory is refused up front (the pinned-lanes rule: an
  explicit human choice never degrades silently).

**svg2pptx.mjs v1.4** — `parseFigure` / `emitFigure` / `EMU_PX`
exported; the CLI runs only when executed directly. CLI behavior and
output byte-for-byte unchanged (`local/CHANGES.md`).

**Harness** — `check_draft2pptx.py` 28 → **37**: a figure-draft
fixture (SlideFigures-vocabulary SVG in a media dir) proves the
figure slide lands directly after its case with the id chip, FIGURE
tag, alt-text title, and a native shape group (plate dropped, raw
URL on no slide); the no-`--media` and missing-file degrades keep
the deck converting with the muted note and the coaching stderr
line; the non-directory `--media` refusal. 37/37 PASS;
`check_svg2pptx.py` PASS post-refactor; `check_draft2docx.py` 23/23
and `check_testplangen.py` 126/126 unchanged.

**Docs** — Local_Setup §11 deck note gains `--media`; README/STATUS
rows. testplangen.mjs, draftlint, prompt (v1.10), flows, packages,
schemas: **unchanged**; NEVER bump `Config.PromptVersion`.

| Piece | Version | Where |
|---|---|---|
| Draft → review deck converter (figure slides, --media) | **v1.1** | `local/draft2pptx.mjs` |
| Figure converter (importable parser/emitter) | **v1.4** | `local/svg2pptx.mjs` |
| Deck gate | **37 checks** | `local/harness/check_draft2pptx.py` |

| Date | Machine | check_draft2pptx | check_svg2pptx |
|---|---|---|---|
| 2026-09-04 | authoring env | 37/37 PASS | PASS |
# TestPlanGen v2.26 — figures in cases (prompt v1.10, testplangen.mjs v1.6, draftlint v1.3)

(Merged after v2.25 landed independently on main — this entry
carried the v2.25 label while in review and was renumbered to
v2.26 at merge time, the v2.20–v2.22 precedent.)

Owner-requested (2026-09-04): include diagrams in the output test
plan drafts when they apply to a test case. The raw material already
existed — the sweep's SlideFigures lane renders every story deck's
slide diagrams into standalone SVG figures in the sidecar library's
`media/` folder, linked from the story sidecar as markdown images —
so STORY TEXT already showed the drafter every figure with its alt
text. Three pieces close the gap:

**Prompt v1.10** (`review/patches/TestPlanGen_Prompt_v1_10.md`; no
input, section-order, sentinel, or structural-contract changes): a
new **FIGURES** grounding rule — the never-invent rule extended to
images. When a story figure's diagram depicts the state, topology,
or workflow a case exercises, the case MAY close with an OPTIONAL
`**Figure:**` line carrying that image link copied VERBATIM (alt
text and path, character for character; never retyped, edited, or
composed from prose). A figure is a reading aid ONLY: it never
grounds a case (story-first Trace unchanged), never substitutes for
concrete fixture values, and never becomes a step or an outcome;
exemplar/reference figures never appear — story figures only. The
"if they apply" judgment is the model's per-case call, the CASE
SWEEP verdicts' mold; a story with no figure links keeps producing
figure-less drafts.

**draftlint.mjs v1.3** — grounding check (e), exact rather than
heuristic: every markdown image link in the draft must appear in the
story sidecar verbatim (`](path)` form), so an invented, retyped, or
exemplar-sourced link surfaces as a `grounding: figure link ...`
finding under the normal verify policy. Local-only by design — the
Python contract authority and the agreement leg are untouched (a
Figure line is invisible to every v1.7 assert, gate-proven).

**testplangen.mjs v1.6** — the link rewrite: a verbatim link is
sidecar-relative (`../media/...`), and drafts land in
`Shared Documents/Test Plan Drafts`, a different folder tree where
that path resolves nowhere. AFTER verification (the banner/Issue
Trace precedent — the verifier judges the model's links exactly as
copied) cited links are rewritten to absolute site URLs
(`{siteUrl}{textsFolder}/media/...`, URI-encoded). Deterministic,
model-free; `Gen_summary` gains `figures=` (links rewritten);
`draftChars` still counts the model's own body. NOTE the rewrite is
a LOCAL-JOB step — drafts written by the cloud flows keep the
relative links as copied (correct grounding, broken rendering from
the drafts folder) until a flow-side rewrite exists.

**Stamps + packages** — `TestPlanGenPromptVersion` → v1.10 in
`flow/{v1_0,core_v1_0}/definition.json` (stamp only); both
generation packages re-cut with the stamped definitions
(byte-identical otherwise, verified at cut time); Setup §2/§3 and
`Coverage_Runbook.md` step 2 stamps; `local/config.sample.json`
testplangen.promptVersion. Downstream converters unchanged: a
`**Figure:**` line passes through `draft2docx`/`draft2pptx` as
prose (embedding cited SVGs as native shapes via the svg2pptx
converter is the queued follow-on). NEVER bump
`Config.PromptVersion` — nothing here changes the sidecar format or
reindexes the corpus.

**Harness** — `check_testplangen.py` 119 → **126**: new leg 13 — a
Figure-line draft passes BOTH contract lints; a verbatim story
figure passes grounding and lands absolutized in the written draft;
`figures=` counts the rewrites; an invented link is flagged; a
figure-less draft stamps `figures=0`. The doc 12 story fixture now
carries a placeFigure-shaped image link. 126/126 PASS; standing
suites green (`check_local_sweep.py` 211/211, typecheck 7/7,
`check_draft2docx.py` 23/23, `check_draft2pptx.py` 28/28).

| Piece | Version | Where |
|---|---|---|
| Generation prompt (FIGURES rule, Figure case line) | **v1.10** | `prompts/TestPlanGen_Prompt.md` / `review/patches/TestPlanGen_Prompt_v1_10.md` |
| Draft verifier (grounding check e) | **v1.3** | `local/lib/draftlint.mjs` |
| Local generation job (link rewrite, figures=) | **v1.6** | `local/testplangen.mjs` |
| Flow stamps + re-cut packages | v1.10 stamp | `testplangen/flow/{v1_0,core_v1_0}/definition.json`, `TestPlanGen_v1_0.zip`, `TestPlanGenCore_v1_0.zip` |
| Generation-job gate | **126 checks** | `local/harness/check_testplangen.py` |

| Date | Machine | check_testplangen |
|---|---|---|
| 2026-09-04 | authoring env (mocked) | 126/126 PASS |
# TestPlanGen v2.25 — the generation call streams (llm.mjs v1.6)

The v2.24 progress output exposed the real failure chain on the
first full pinned-lane run (2026-09-04): the generation died at
exactly 300s per attempt, first as our own `llm.timeoutMs` abort,
then — with that raised to 900000 — as a bare
`LLM request failed: fetch failed` still at 300s. The second wall
is Node's own HTTP client (undici): a NON-streaming Messages call
emits nothing — not even response headers — until the entire draft
is generated, and undici aborts a headerless connection after 5
minutes by default, below anything `llm.timeoutMs` can reach. A
five-source-plan draft at maxTokens 32000 legitimately generates
longer than that, so every attempt hit the wall and the retries
re-billed partial generations into the same cliff.

**llm.mjs v1.6** — `generateText` STREAMS (`stream: true`, SSE
parsed and accumulated; new `postMessagesStream` beside the
non-streaming `postMessages`): headers and a continuous trickle of
text deltas arrive from the first second, so no silent-connection
timeout in the path — ours, undici's, or an intermediary's — ever
fires, which is also the vendor-recommended posture for long
generations. Semantics:

- `llm.timeoutMs` becomes an IDLE timeout for the generation call —
  the longest allowed gap between chunks (default unchanged,
  300000) — instead of a total-call ceiling: a 20-minute generation
  with steady deltas never times out, a wedged socket still dies
  fast. Total time is naturally bounded by maxTokens.
- Retry semantics unchanged: 401 re-mints the bearer, 429/5xx and
  transport failures back off (visibly, v2.24) and retry; a
  MID-STREAM cut (idle timeout, reset, SSE `error` event) also
  rides the retry path — partial text is discarded, exactly as the
  marker slice would have failed closed on it; other 4xx throw.
- `stop_reason` handling (refusal, max_tokens truncation) is
  preserved via the stream's `message_delta`; the truncation hint
  in testplangen.mjs now says timeoutMs is a silent-gap knob.
- The classify/keyword call stays non-streaming: small replies,
  JSON-schema pin.

**Harness** — the mock `/v1/messages` serves SSE when the request
carries `stream: true` (text split across two deltas so client-side
accumulation is exercised); new check pins that the generation
request streams. `check_testplangen.py` **119/119 PASS**;
`check_local_sweep.py` 211/211 PASS (classify lane untouched).

| Piece | Version | Where |
|---|---|---|
| LLM client (streamed generation, idle-gap timeout) | **v1.6** | `local/llm.mjs` |
| Generation-job gate | **119 checks** | `local/harness/check_testplangen.py` |
| testplangen.mjs (truncation-hint wording only) | v1.5 | `local/testplangen.mjs` |

| Date | Machine | check_testplangen | check_local_sweep |
|---|---|---|---|
| 2026-09-04 | authoring env (mocked) | 119/119 PASS | 211/211 PASS |

# TestPlanGen v2.24 — progress output (testplangen.mjs v1.5, llm.mjs v1.5)

Motivated by the 2026-09-04 pinned-lane run that sat silent for 10+
minutes: for a `--story` run the job printed NOTHING between
startup and the final summary, so a stale-token auth wait, a
legitimately long generation (five source plans, maxTokens 32000),
and a silent 408/429 retry loop were indistinguishable from a hang.

**testplangen.mjs v1.5** — stderr `progress:` lines on MANUAL
single-story runs only: Doc Index snapshot size; story sidecar
size; lane sizes with the pinned ids; "calling the model" with
provider and input size; a 30s heartbeat while the one model call
is in flight; the reply size and elapsed seconds; the verifier
verdict. stdout keeps its JSON + `Gen_summary` contract
byte-for-byte, and the auto and gap-report modes stay quiet so
their scheduled-task logs don't grow.

**llm.mjs v1.5** — retry visibility, both providers: every backoff
retry prints one stderr line naming the cause and the delay
(`llm: retry 2/4 in 4s — AI Builder 408: ...`). The AI Builder
gateway's 408-on-long-generation and 429 storms were previously
retried in total silence. Backoff arithmetic unchanged; the sweep's
nightly log gains these lines only when retries actually happen.

**Harness** — `check_testplangen.py` 116 → **118**: manual run
prints the progress lines on stderr with stdout untouched; auto
runs stay progress-silent. 118/118 PASS.

**Docs** — Local_Setup §11 note; README/STATUS rows. Flows,
packages, prompt (v1.9), draftlint (v1.2), schemas: **unchanged**.

| Piece | Version | Where |
|---|---|---|
| Local generation job (progress lines, heartbeat) | **v1.5** | `local/testplangen.mjs` |
| LLM client (retry visibility) | **v1.5** | `local/llm.mjs` |
| Generation-job gate | **118 checks** | `local/harness/check_testplangen.py` |

| Date | Machine | check_testplangen |
|---|---|---|
| 2026-09-04 | authoring env (mocked) | 118/118 PASS |
# TestPlanGen v2.23 — review deck: draft → pptx (draft2pptx.mjs v1.0)

Owner-requested (2026-09-04): a way to generate a designed slide
deck from a test-plan draft — the deck a PE walks the §4 review
with, not another export of the markdown. The docx handoff's twin,
on the same stack: **new `local/draft2pptx.mjs` (v1.0)**, ZERO
dependencies and ZERO connectors
(`node local/draft2pptx.mjs <draft.md> [-o out]`) — the svg2pptx
zip writer and package skeleton verbatim, the draft2docx dialect
parser verbatim in shape.

The deck is DERIVED from the draft, not transcribed: a dark title
slide (plan headline, the amber DRAFT — MACHINE-GENERATED pill, the
WARNING banner's generated-when/story stamp, the Overview facts);
an at-a-glance slide (positive/negative case counts, open
`[VERIFY:` flags — colon-flags only, banner prose never inflates
the count — and coverage rows as stat tiles, the Overview prose as
scope, the verifier's IMPORTANT findings as an amber card); Setup
and Open Questions as drawn checkbox rows; a divider per test
section (Negative's CAUTION alert rides its divider); ONE SLIDE PER
TC CASE — steps as a checklist left, Expected Result and Trace as
cards right, `[VERIFY: …]` spans amber, long cases continue onto
"(cont.)" slides; Coverage Map and Issue Trace as native, editable
PowerPoint tables (long ones paginate, wrapped-row heights
estimated so nothing under a table collides); Automation Notes /
Documentation Impacts / unknown H2s as content slides (nothing in
the draft is dropped); a closing review-ask slide carrying the
machine banner's provenance. Styling is the Diagram Style Framework
palette end to end, so these slides sit next to svg2pptx figure
slides without a seam. Machine comments reach no slide; every
element is a native shape, text box, or table — fully editable.

**Harness** — new `local/harness/check_draft2pptx.py` (28 checks,
CI full-format — python-pptx read-back: slide walk, banner
suppression, glance counts incl. the colon-flag rule, case-slide
contract, amber VERIFY runs, native tables with cells intact,
provenance, CLI contract).

**Docs** — Local_Setup §11 handoff note, README/STATUS rows,
harness README. testplangen.mjs, draftlint, flows, packages,
prompt, agent file set, schemas: **unchanged**; NEVER bump
`Config.PromptVersion`.

| Piece | Version | Where |
|---|---|---|
| Draft → review deck converter | **v1.0** (new) | `local/draft2pptx.mjs` |
| Converter gate | **new** (CI full-format) | `local/harness/check_draft2pptx.py` |
| testplangen.mjs, draft2docx.mjs, draftlint.mjs, flows, packages, prompt, agent file set, schemas | unchanged | — |

| Date | Machine | check_draft2pptx |
|---|---|---|
| 2026-09-04 | authoring env | 28/28 PASS |

# TestPlanGen v2.22 — pinned lanes (testplangen.mjs v1.4)

(Merged after v2.19 landed independently on main — the v2.19/v1.3
labels these three entries carried while in review were renumbered
to v2.20–v2.22 / testplangen.mjs v1.4 at merge time.)

The v2.20 queued follow-on, owner-requested (2026-09-04): let the
person running a generation PIN documents into the prompt's lanes
in addition to the sidecar's `related:` selection. The doc 1 run is
the motivating case — the data-rich exemplar that would have
grounded its Split/Merge cases ("Splitting Events in Pro", a Pro
plan) is not RelatedRank-linked to the story, so the lanes never
saw it. The reference lane's no-fallback rule is untouched in
spirit: it exists to bar MACHINE-chosen unlinked documents; an
explicit human choice is stronger grounding than the automatic
linkage.

**`--exemplar <docId>` / `--reference <docId>`**
(`local/testplangen.mjs` v1.4; repeatable, comma-separated ids
accepted; Doc Index row ids ONLY — no issue/title resolution on
pins, the v2.3 bare-number rule):

- **Lane order**: pinned docs fill their lane FIRST, in the order
  given; the automatic `related:` routing fills remaining slots and
  skips docs already pinned (their digest lines are kept). Pins may
  exceed the slot counts — a human choice beats the slot default —
  while the character caps stay the hard budget, pins served first.
  The G6 exemplar fallback is naturally bypassed (it fires only on
  an empty lane).
- **Hard guards, refused BEFORE the model call** (a human asked for
  these exact documents — the lanes' Try_* silent-degrade posture
  is for automatic picks): row exists, Indexed, sidecar present in
  the synced library, not the story itself, not pinned to both
  lanes; `--exemplar` takes Test Plans on ANY surface (a deliberate
  human override of the same-surface routing — style/coverage only,
  and prompt v1.9's story-first rules keep content from leaking
  into cases), `--reference` takes Test Plans and Design Spikes.
- **Provenance**: the banner's HTML comment carries the pinned ids
  (`· pinned exemplars [251] references [459]`); `Gen_summary`
  gains `pinnedEx=` / `pinnedRef=`.
- **Manual runs only**: refused with `--auto` (and `--models`) —
  the unattended mode must stay deterministic from catalog state
  alone.

**Harness** — `check_testplangen.py` 108 → **116** checks (the
count includes v2.21's two leg-8 checks, folded in at merge time):
new leg 12 (pins refused with --auto/--gap-report and on
kind/lane-conflict violations with no model call spent; a
cross-surface exemplar pin leads its lane with auto filling the
rest; an unrelated reference pin lands with its title+surface
header; a pin duplicated in `related:` is deduped; the banner pin
stamp). Docstring gains the missing leg 9–11 entries (v2.18/v2.19
oversights) alongside leg 12. 116/116 PASS on the merged tree.

**Docs** — Local_Setup §11 (pinned-lanes block; the stale
promptVersion default in the knobs line corrected to v1.9);
`STATUS.md` row; v2.19's queued-follow-on note marked implemented.
Cloud flows, packages, prompt, contract lints, schemas:
**unchanged** — this is a local-job feature (the cloud flow's
list-menu front door has no argument surface for pins; a Copilot
Studio pin flow would be its own change). NEVER bump
`Config.PromptVersion`.

| Piece | Version | Where |
|---|---|---|
| Local generation job (pinned lanes) | **v1.4** | `local/testplangen.mjs` |
| Generation-job gate | **116 checks** | `local/harness/check_testplangen.py` |
| Setup guide | §11 updated | `local/Local_Setup.md` |
| Flows, packages, prompt (v1.9), draftlint (v1.2), schemas | unchanged | — |

| Date | Machine | check_testplangen |
|---|---|---|
| 2026-09-04 | authoring env (mocked, post-merge with v2.19) | 116/116 PASS |

# TestPlanGen v2.21 — story-first trace (prompt v1.9, draftlint v1.2)

Motivated by the owner review of the doc 1 draft (2026-09-04,
second pass, following v2.19's first pass): test cases must
STRICTLY follow the input user story. The doc 1 story states the
Add workflow ("Add Point/Line: Honor all input methods") but names
no Add Point / Add Line widgets — yet the exemplar lane's "Auto-
Populate Referents for Add Point and Add Line Widgets Test Plan"
supplied widget-flavored case material the draft leaned on. The
structural leak is the Trace rule's OR, present since v1.0: a case
could trace to a story statement, OR "an exemplar pattern applied
to this story's feature", OR a reference-functionality statement —
so a case could exist on exemplar or reference authority alone,
with no story statement behind it.

**Prompt v1.9** (authored as
`review/patches/TestPlanGen_Prompt_v1_9.md`, promoted to
`prompts/TestPlanGen_Prompt.md` — supersedes v1.8 in-repo BEFORE
its pending paste; everything v1.1–v1.8 carries forward unchanged):

- **STORY-FIRST TRACE** replaces the first grounding rule's OR:
  every case MUST trace to an explicit STORY TEXT / StoryMeta
  statement — exemplar patterns and reference statements REFINE a
  story-stated behavior (the concrete input methods behind the
  story's "all input methods", its validations, its field
  semantics) and are cited in addition, never instead. A workflow,
  pathway, tool, or behavior appearing only in an exemplar or
  reference becomes an Open Questions [VERIFY] entry, never a case.
- **CASE SWEEP tightened**: a Yes verdict requires a story
  statement to anchor the tailored case — reference support alone
  is Verify.
- **Tools rule extended** to workflows/pathways/edit types
  (exercise only what the story enumerates; a story-stated workflow
  with no tool named stays a workflow phrase + Setup [VERIFY],
  never a guessed widget); the reference rule anchors derived
  behavior to a story statement; Trace template and worked example
  updated to model the rule.

**Verifier** — `local/lib/draftlint.mjs` v1.2 (grounding layer
only; the v1.7 structural contract and the Python lint are
untouched):

- new check (d), the story-first rule made checkable locally: every
  case's **Trace:** line must cite the story — a quoted span found
  verbatim passes, else ≥ half its content-word stems must appear
  in the story; an exemplar-only Trace surfaces as
  `grounding: TC-xx Trace cites no story statement`.
- check (b) fix: the tool scan now skips lines carrying `[VERIFY` —
  Open Questions items legitimately cite source-plan titles per the
  CASE SWEEP rule, and those citations were false-positives on the
  doc 1 draft (4 of its 13 findings).

**Harness** — `check_testplangen.py` 95 checks (was 93): leg 8
gains the exemplar-only-Trace flag and the [VERIFY]-title
non-flag; GOOD_DRAFT's TC-N1 Trace updated to the story-first form
(the fixture previously modeled the exact pattern v1.9 outlaws).
95/95 PASS.

**Both flows** — `Config_gen.TestPlanGenPromptVersion` → v1.9
(stamp only); both generation packages re-cut with the stamped
definitions (byte-identical to their folder definitions).

**Local job** — `testplangen.promptVersion` default → v1.9
(`local/testplangen.mjs`, `local/config.sample.json`).

**Docs** — Setup §2/§3 stamps → v1.9; `Coverage_Runbook.md` step 2
pastes v1.9; `prompts/README.md`, `STATUS.md`, and root `README.md`
rows moved to v1.9 / v2.21.

Deploy (simple paste + one designer edit, both live flows —
`Coverage_Runbook.md` step 2): paste v1.9 into
`LRS Test Plan Generation` (replaces the pending v1.8 paste), set
both `Config_gen.TestPlanGenPromptVersion` stamps to v1.9 (or
re-import the re-cut packages), run smoke rows 1, 3, 9, 10 and read
one draft's Trace lines — every case quotes the story, source plans
cited only in addition. NEVER bump `Config.PromptVersion`.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.9** | `review/patches/TestPlanGen_Prompt_v1_9.md` → `prompts/TestPlanGen_Prompt.md` |
| Draft verifier (grounding layer: check d, [VERIFY exclusion) | **v1.2** | `local/lib/draftlint.mjs` |
| Flow stamps + re-cut packages | v1.9 stamp | `testplangen/flow/{v1_0,core_v1_0}/definition.json`, `TestPlanGen_v1_0.zip`, `TestPlanGenCore_v1_0.zip` |
| Local generation job (stamp default) | v1.2 (unchanged code) | `local/testplangen.mjs`, `local/config.sample.json` |
| Generation-job gate | **95 checks** | `local/harness/check_testplangen.py` |
| Contract lints | v1.7 contract, unchanged | `review/harness/check_draft_coverage.py`, `lintDraft` |

| Date | Machine | check_testplangen | Tenant paste |
|---|---|---|---|
| 2026-09-04 | authoring env (mocked) | 95/95 PASS | pending (replaces the pending v1.8 paste) |

# TestPlanGen v2.20 — concrete test data (prompt v1.8)

Motivated by the 2026-09-04 review of the doc 1 draft ("Auto-
Populate Referents for Event Edits") against the team's own plans:
structurally the draft honors every v1.5–v1.7 rule, but its cases
are DATA-abstract — "a measure inside its extent", "a new valid
value", "input method M" — where the team's plans ("Splitting
Events in Pro" is the type specimen) pin every case to named
fixtures: route R1 with dates, event E1 from measure 10 to 22,
split at measure 16, current date 3/29/2022, attribute values
`split`/`event`, and before/after tables showing every resulting
record's field values. A tester cannot execute an abstract step
without inventing the data themselves, and an abstract expected
result cannot be judged against real records. The prompt itself
pushed the model there: the never-invent grounding rule ("no
invented field names, limits, defaults, or error text") reads as
covering data values too, so the model abstracts them away. The
fix is a carve-out with teeth, not a softened never-invent rule.

**Prompt v1.8** (authored as
`review/patches/TestPlanGen_Prompt_v1_8.md`, promoted to
`prompts/TestPlanGen_Prompt.md` — supersedes v1.7 in-repo BEFORE
its pending paste; everything v1.1–v1.7 carries forward unchanged):

- **New CONCRETE TEST DATA grounding rule** (placed directly after
  the never-invent rule it carves out of): test DATA values —
  route/event IDs, measures, dates, business-attribute values — are
  fixtures the drafter MUST invent, defined once as test-data
  tables closing Setup / Prerequisites and referenced by name from
  every case. Steps and Expected Result name concrete values
  ("split event E1 on route R1 at measure 16"), never abstract
  stand-ins; parameterized cases name the concrete value per
  variant. A case that creates or changes records follows its
  Expected Result sentence with a GFM table of the affected
  records' expected field values after the edit — under CASE
  GRANULARITY that table is ONE outcome (the complete record state
  one edit produces), judged pass/fail as a whole. The carve-out
  covers VALUES ONLY: field names, domains, limits, precision,
  defaults, and error text stay under the never-invent rule —
  fixtures use simple values that dodge the unknown, and a fixture
  never resolves a [VERIFY] by fiat.
- **Setup / Prerequisites closes with `**Test data:**` fixture
  tables** (routes; plus events for event-editing stories);
  case-shape prose updated to match; worked example gains the R100
  fixture table and concrete values in TC-P1/TC-N1.
- Output markers, input keys, fences, section order: unchanged.

**Contract/harness** — NO structural asserts added: `lintDraft` /
`check_draft_coverage.py` stay on the v1.7 contract (docstrings
note it); fixture-data concreteness is a §4 reading check, like
sweep completeness — a parser cannot judge whether "measure 16" is
concrete enough for the case around it. `check_testplangen.py`
banner pin moved to v1.8; 93/93 still pass.

**Both flows** — `Config_gen.TestPlanGenPromptVersion` → v1.8 in
`flow/v1_0/` and `flow/core_v1_0/` (stamp only); both generation
packages re-cut with the stamped definitions (byte-identical to
their folder definitions, the provenance convention).

**Local job** — `testplangen.promptVersion` default → v1.8
(`local/testplangen.mjs`, `local/config.sample.json`); the
anthropic lane picks the new rules up with ZERO tenant work.

**Docs** — Setup §2/§3 stamps → v1.8; `Coverage_Runbook.md` step 2
pastes v1.8; `prompts/README.md`, `STATUS.md`, and root `README.md`
rows moved to v1.8 / v2.20.

Deploy (simple paste + one designer edit, both live flows —
`Coverage_Runbook.md` step 2): paste v1.8 into
`LRS Test Plan Generation` (replaces the pending v1.7 paste), set
both `Config_gen.TestPlanGenPromptVersion` stamps to v1.8 (or
re-import the re-cut packages), run smoke rows 1, 3, 9, 10 and read
one draft's cases for named fixtures and after-state tables. NEVER
bump `Config.PromptVersion` — nothing here changes the sidecar
format or reindexes the corpus.

Queued follow-on (owner question, 2026-09-04 — IMPLEMENTED in
v2.22, `--exemplar`/`--reference` on the local job):
let the person running a generation PIN documents into the lanes —
e.g. `--exemplar <docId>` / `--reference <docId>` on the local job —
in addition to the sidecar's `related:` selection, for the case
where the best exemplar (a data-rich plan like "Splitting Events in
Pro") is not RelatedRank-linked to the story. An explicit human
choice is stronger grounding than the automatic linkage, so it fits
the reference lane's no-fallback rationale; needs the same
kind/status guards as the lanes, slots/caps honored, and the
pinned docs recorded in the banner for provenance.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.8** | `review/patches/TestPlanGen_Prompt_v1_8.md` → `prompts/TestPlanGen_Prompt.md` |
| Flow stamps + re-cut packages | v1.8 stamp | `testplangen/flow/{v1_0,core_v1_0}/definition.json`, `TestPlanGen_v1_0.zip`, `TestPlanGenCore_v1_0.zip` |
| Local generation job (stamp default) | v1.2 (unchanged code) | `local/testplangen.mjs`, `local/config.sample.json` |
| Generation-job gate (banner pin) | 93 checks | `local/harness/check_testplangen.py` |
| Draft lints | v1.7 contract, unchanged | `review/harness/check_draft_coverage.py`, `local/lib/draftlint.mjs` |

| Date | Machine | Tenant paste | Smoke rows |
|---|---|---|---|
| 2026-09-04 | authoring env | pending (replaces the pending v1.7 paste) | — |

# TestPlanGen v2.19 — local job phase 4: docx handoff, issue trace, gap report (testplangen.mjs v1.3)

Phase 4 of `testplangen/Local_TestPlanGen_Plan.md` — the two items
every earlier round deferred by design, both closed on the LOCAL
stack (the Setup guide's queued follow-ons carry closure notes; the
cloud flow is untouched):

**docx handoff — new `local/draft2docx.mjs` (v1.0)**: a reviewed
draft converts to an editable Word file with ZERO dependencies and
ZERO connectors (`node local/draft2docx.mjs <draft.md> [-o out]`) —
the svg2pptx precedent applied to WordprocessingML, its zip writer
verbatim. Shape-preserving for the draft dialect: real Heading 1/2/3
styles (the navigation pane shows the plan and its TC cases), GFM
tables as Word tables (header row bold), task lists as checkbox
glyphs with the draft's numbering verbatim, `[!WARNING]`/`[!CAUTION]`
blocks as bold label + Quote body, `**bold**` runs, wrapped prose
joined, and every HTML comment (machine banner, verify stamp)
DROPPED — no machine plumbing reaches the document of record. The
output is deliberately an unstyled fresh document: the PE applies
the team template; what it saves is the transcription. The premium
Word connector / OneDrive convert-file tradeoff the original bullet
deferred over is moot locally.

**Issue Trace — the deterministic half of the "coverage matrix"
follow-on** (`testplangen.mjs` v1.3), unlocked by the owner-verified
Issue Refs GUID (2026-09-04): every generated draft ends with a
`## Issue Trace` table — the story's Doc IDs rows (deduped by
repo#number), enriched with matching Issue Refs rows once gantt.mjs
feeds them (issue title, iteration, schedule status; em-dash cells
until then). Minted by the job from list rows, NEVER by the model;
appended AFTER verification so the verifier only ever judges the
model's draft; omitted entirely for a story with no issue rows;
`testplangen.issueTrace: false` disables; `issues=` joins
Gen_summary. Cell text gets the semi-trusted treatment (pipes and
quotes stripped, length-capped). List fetches are once-per-process
and shared across an auto run's stories.

**Gap report — the other half** (`--gap-report`): the whole-catalog
counterpart of the auto mode's lookback scan, no AI spend, no
drafting — every Indexed User Story with NO covering Test Plan (no
related-list plan, no Doc Links edge), each line carrying title,
surface, release, issue keys, and sidecar link, written as a
FIXED-NAME digest (`TestPlan_Gap_Report.md`, overwritten per run —
the curation-digest snapshot rule, with the DX-11 explicit empty
state and an Unassessable section for stories whose sidecars the
sync lacks) into the Shared Documents ROOT, outside the Q&A agent's
knowledge source. Schedulable weekly beside curation; dry runs leave
the report in workDir. Exclusive with the other modes; requires
docLinks like `--auto`.

**Rider (first live-run feedback, 2026-09-04)**: the maiden anthropic
generation hit `stop_reason: max_tokens` at the 16384 default —
v1.6+ split-case drafts run long. Default `testplangen.maxTokens`
16384 → **32000** (the model allows up to 128000), and the error now
names the actual knob and current value instead of "the caller's
maxTokens knob".

**Harness** — `check_testplangen.py` 93 → **108** checks (leg 10:
trace placement after the verified body, dedup, Issue Refs
enrichment + em-dash degradation, no-issues omission, the knob;
leg 11: whole-catalog counts, zero model calls, gap-line content,
covered exclusion, fixed-name overwrite, mode exclusivity, the
NO-GAPS + unassessable branches) plus new
`local/harness/check_draft2docx.py` (23 checks, CI full-format —
python-docx read-back: heading order, tables incl. Issue Trace,
checkbox glyphs, alert labels, bold runs, comment dropping, prose
joining, CLI contract).

**Docs** — Local_Setup §11 (three new subsections), Setup guide
queued-follow-ons closure notes, `config.sample.json`
(issueTrace/gapReport knobs, maxTokens 32000), README/STATUS rows,
harness README, plan doc phase-4 status. Cloud flows, packages,
prompt, agent file set, schemas: **unchanged**; NEVER bump
`Config.PromptVersion`.

| Piece | Version | Where |
|---|---|---|
| Draft → Word converter | **v1.0** (new) | `local/draft2docx.mjs` |
| Local generation job (issue trace, `--gap-report`, maxTokens 32000) | **v1.3** | `local/testplangen.mjs` |
| Converter gate | **new** (CI full-format) | `local/harness/check_draft2docx.py` |
| Generation-job gate | 108 checks | `local/harness/check_testplangen.py` |
| Setup + sample config + follow-on closures | updated | `local/Local_Setup.md` §11, `local/config.sample.json`, `TestPlanGen_Setup.md` |
| draftlint.mjs, llm.mjs, graph.mjs, flows, packages, prompt, agent file set, schemas | unchanged | — |

| Date | Machine | check_testplangen | check_draft2docx |
|---|---|---|---|
| 2026-09-04 | authoring env (mocked) | 108/108 PASS | 23/23 PASS |

# TestPlanGen v2.18 — local job phase 3: the automatic mode (testplangen.mjs v1.2)

Phase 3 of `testplangen/Local_TestPlanGen_Plan.md` — generation
becomes AUTOMATIC while the review gate stays human: a nightly
`--auto` run drafts for freshly indexed User Stories that nothing
in the catalog covers.

**`--auto`** (`local/testplangen.mjs` v1.2; internals: the G3–G13
body extracted into `generateOne`, byte-equivalent — the 82 phase-2
checks pass unchanged — with `runAuto` looping it):

- **Candidates**: Indexed User Story rows first indexed within
  `autoLookbackDays` (7) — anchored on the row's CREATION time (the
  moment the sweep minted it; Graph's item `createdDateTime`, with
  SourceModified as fallback), freshest first.
- **Gap test**: no Test Plan among the sidecar's `related:` entries
  AND no Doc Links edge to a Test Plan row (the cheap local
  realization of the Setup guide's queued "gap report" — needs
  `sharePoint.lists.docLinks`, already in config for the sweep). An
  unassessable story (missing sidecar, hand-mangled `related:`)
  is counted and skipped — never spent on.
- **Idempotency**: one draft per story — any existing
  `TestPlanDraft__doc{ID}__*` in the drafts folder skips the story
  (a PE deleting the draft after finalize, §4 housekeeping, is what
  re-arms it); `--force` disables the skip for one run. The scan is
  the new `graph.mjs` v1.3 `listFolder` (default-drive children;
  404 = empty, anything else throws — a silently failed scan could
  duplicate work).
- **Budget**: `autoMaxPerRun` (3) caps model calls per run; the
  rest defers to the next night (`deferred=`). A refused or failed
  story retries on later runs under the same cap.
- **Unattended posture, forced**: verify=strict (a draft with
  verifier findings is NOT written — findings go to the run log and
  the webhook via the refusal alert) and notify=on (every landed
  draft posts its line — closing the Setup guide's
  "no notification" known limit for the unattended case). The
  owner switch is `testplangen.autoDraft: false` — the scheduled
  task is INERT until it is set.
- **Dry auto runs are selection-only**: what would draft, ZERO
  model calls — deliberately unlike a single-story dry run (which
  generates a local draft to read); an unattended plan must be
  free. One failed story never kills the run: counted, alerted,
  every candidate gets its chance, exit code nonzero at the end.
- **Scheduling**: new `local/run_testplangen.cmd` (the
  run_curate.cmd shape — self-updating from `deploy`,
  log-rotating), registered daily AFTER the nightly sweep so fresh
  stories carry tonight's `related:` lines.

**`testplangen.provider`** (rider, owner request): overrides
`llm.provider` for the GENERATION call only — e.g. drafts on the
anthropic lane (the repo prompt verbatim, zero tenant paste) while
the sweep's classify step stays on AI Builder credits, or the
reverse. Empty (default) follows `llm.provider` exactly as before.

**Harness** — `check_testplangen.py` 82 → **93** checks: the auto
leg (owner-switch refusal, reference-form exclusion, dry selection
over the lookback window with zero calls, live drafted+refused in
one run with both webhook messages, idempotency skip + refusal
retry, `--force` re-arm, `autoMaxPerRun` deferral) and the
provider-override check (generation on /v1/messages while the
Predict counter stands still). Mock gains per-story Predict routing
(by StoryMeta's doc_id), a drafts-folder children endpoint, Doc
Links rows, and time-RELATIVE row creation stamps so the lookback
never goes stale.

**Docs** — Local_Setup §11 (auto subsection: guard rails, schtasks
line, summary reading), `config.sample.json` (provider + the three
auto knobs), README/STATUS rows, plan doc phase-3 status. Cloud
flows, packages, agent file set, prompt, schemas: **unchanged**;
NEVER bump `Config.PromptVersion`.

| Piece | Version | Where |
|---|---|---|
| Local generation job (`--auto`, `generateOne`/`runAuto` split, provider override) | **v1.2** | `local/testplangen.mjs` |
| Graph client (`listFolder`) | **v1.3** | `local/graph.mjs` |
| Scheduled-task wrapper | new | `local/run_testplangen.cmd` |
| Generation-job gate | 93 checks | `local/harness/check_testplangen.py` |
| Setup + sample config | updated | `local/Local_Setup.md` §11, `local/config.sample.json` |
| draftlint.mjs, llm.mjs, flows, packages, prompt, agent file set, schemas | unchanged | — |

| Date | Machine | check_testplangen | First live auto run |
|---|---|---|---|
| 2026-09-04 | authoring env (mocked) | 93/93 PASS | — (pending sweep auth restore — STATUS action 12 — and the autoDraft owner switch) |

# TestPlanGen v2.17 — local job phase 2: lookup, grounding, notify (testplangen.mjs v1.1)

Phase 2 of `testplangen/Local_TestPlanGen_Plan.md` — the front door
and the verifier layer the plan deferred from v2.16.

**Lookup front door** (`local/testplangen.mjs` v1.1) — the CLI now
takes any of the agent's three reference forms, resolved by
StoryLookupFlow's deterministic queries IN-PROCESS (v2.3's
mechanics, zero Copilot Studio): `--story <docId>` (unchanged),
`--issue <n>` (`#`-prefix tolerated; the Doc IDs list filtered on
IssueNumber in memory — no user value in OData — deduped by
document, kind-filtered to Indexed User Stories; requires
`sharePoint.lists.docIds` in config), `--title "<words>"`
(contains-match over indexed User Story titles, newest first).
Exactly one form per run; the v2.3 bare-number rule holds
structurally — a bare number is only ever a doc id, issue numbers
need the flag, nothing is guessed. Ambiguity goes back to the human
exactly as the agent does it: several matches print a capped
candidate list (`- doc NN — "Title" (surface …, release …)`, first
8, flagged past the cap) and refuse; zero matches coach (issue: the
sweep must have indexed the story and minted its Doc IDs row;
title: narrow the words or use the id). Generation is NOT invoked
on any refusal.

**Grounding spot-checks** (`local/lib/draftlint.mjs` v1.1, new
`groundDraft`) — the verifier's second layer, possible only locally
because the job holds the story it just sent. Three conservative
heuristics, findings prefixed `grounding: `, run under the same
verify policy as the contract lint (`testplangen.grounding: false`
disables just this layer): (a) every Coverage Map requirement cell
must trace to the story — a quoted span found verbatim passes;
otherwise ≥ half its content-word stems must appear in the story
(probable-invention flag); (b) tool-shaped names (multi-word Title
Case) in Steps / Expected Result lines must appear in the story —
the prompt's tools rule made checkable; section/terminology phrases
allowlisted, Trace lines and the Source Case Sweep deliberately NOT
scanned (they cite source-plan titles). NOTE: the plan sketched a
cites-a-reference exception; dropped deliberately — the prompt
admits no tool names from reference documents at all; (c)
enumeration echo — every item of a 3+-item comma/and list in a
workflow-shaped story sentence must be mentioned somewhere in the
draft (a cheap ENUMERATION COVERAGE screen). The heuristics WILL
flag some legitimate paraphrases — which is why `annotate` stays
the default and `strict` remains the unattended-run posture; the
verifier still never edits draft content. `lintDraft` (the contract
port) is byte-untouched — the Python agreement leg still passes
label-for-label, and grounding stays excluded from it by design.

**Notification** (`--notify` / `testplangen.notify: false`) — one
webhook line per WRITTEN draft (story id/title, draft URL,
`Gen_summary`) via the sweep's `alerts.webhookUrl` (`lib/alerts.mjs`
— best-effort by its design, a down webhook never fails a run).
Default off: whoever runs a manual generation is already watching,
and dry runs never notify — nothing was written. Phase 3's auto
mode forces it on and closes the Setup guide's "no notification"
known limit for the unattended case.

**Harness** — `check_testplangen.py` 62 → **82** checks: leg 6
(lookup: dedup resolve, `#` form, ambiguity candidates, miss
coaching, kind filtering, no model call on refusal, title
unique/multi/none, exactly-one-form and non-numeric-issue
rejection), leg 7 (notify: one alert with story/draft/summary;
default and dry runs silent), leg 8 (grounding: an invented
Coverage Map row, a story-less tool name, and a dropped enumeration
item each flagged; an echoed enumeration not; `verify=` counts
grounding findings; the grounding knob isolates the layer). The
good-draft fixtures are now genuinely story-grounded (the clean
draft stays unannotated with grounding ON — the leg-2 regression
pin).

**Docs** — Local_Setup §11 (lookup usage, the two verifier layers,
notify), `config.sample.json` (grounding/notify knobs), README +
STATUS rows, plan doc phase-2 status. Cloud flows, packages, agent
file set, prompt, schemas: **unchanged**; NEVER bump
`Config.PromptVersion`.

| Piece | Version | Where |
|---|---|---|
| Local generation job (lookup + notify + grounding wiring) | **v1.1** | `local/testplangen.mjs` |
| Draft verification (contract port untouched; + `groundDraft`) | **v1.1** | `local/lib/draftlint.mjs` |
| Generation-job gate | 82 checks | `local/harness/check_testplangen.py` |
| Setup + sample config | updated | `local/Local_Setup.md` §11, `local/config.sample.json` |
| llm.mjs, flows, packages, prompt, agent file set, schemas | unchanged | — |

| Date | Machine | check_testplangen | First live draft |
|---|---|---|---|
| 2026-09-04 | authoring env (mocked) | 82/82 PASS | — (pending sweep auth restore — STATUS action 12) |

# TestPlanGen v2.16 — the local generation job, phase 1 (testplangen.mjs v1.0)

Phase 1 of `testplangen/Local_TestPlanGen_Plan.md` (authored on the
plan's branch, 2026-09-04): TestPlanGenCore's G1–G13 semantics as a
local Node job over the sweep's own stack — the sweep/curate/gantt
migration precedent applied to the last still-cloud-only component.
One promotion delivers the entire authored v2.15 state (prompt
v1.7's coverage/granularity/source-sweep rules, the v2.2 two-lane
router + slot config, the v2.3 remaining-budget takes) with ZERO
tenant designer work, and adds the control the cloud flow
architecturally could not have: every draft is machine-checked
against the v1.7 coverage contract BEFORE it is written.

**New `local/testplangen.mjs` (v1.0)** — on-demand CLI
(`--story <docId>`, dry-run default), faithful to
`TestPlanGen_Setup.md` §3 with each G-step cited in the header:
the Terminate_not_story guard verbatim; the `related:` line-slice
(never YAML-parsed; a bracketed-but-invalid line still fails the
run, the accepted Catch residual); the G5b two-lane router over the
score-ordered entries with per-neighbor silent degradation; the G6
release-matched exemplar fallback (winner-takes-all only when the
story HAS a release — DX-7 — and NO reference-lane fallback, the
v2.0 rationale); G7/G7b remaining-budget appends; ONE model call;
the G9 marker slice failing CLOSED with the flow's message; the
Draft_banner (comment + `[!WARNING]`, now also stamping the job
version and provider) and the timestamped never-overwritten draft in
Shared Documents/Test Plan Drafts (via Graph drive upload, the
curation-digest write); `Gen_summary` counters extended with
`verify=`. Read-only over every list; the only write is the draft
(plus workDir run logs, and a locally inspectable draft copy on dry
runs). Bounded deviations, documented in the header and Local_Setup
§11: one run-start Doc Index snapshot replaces per-item Gets; the G6
fallback orders by SourceModified (the snapshot's field) for the
flow's list-Modified; a story sidecar missing from the synced
library is a loud error, not a degrade.

**Prompt transport** — both `llm.mjs` providers: `aibuilder`
(default; the tenant's `LRS Test Plan Generation` prompt via
Dataverse Predict — new `llm.testPlanModelId`, discovered with
`--models`; the TENANT paste state applies, so the five-parameter
contract + v1.7 text remain that lane's prerequisite,
`Coverage_Runbook.md` step 2) and `anthropic`
(`prompts/TestPlanGen_Prompt.md` executed VERBATIM between its
delimiters — zero tenant prompt work, v1.7 applies as authored;
single-pass placeholder substitution so document content can never
inject a second substitution; `testplangen.maxTokens` 16384 — a
token-truncated reply loses `[[[DRAFT END]]]` and fails closed with
the real cause named). `llm.mjs` → **v1.4**: shared `postMessages`
core + new `generateText` export (no JSON-schema pin, throws on
refusal/truncation); `classifyDoc` behavior unchanged
(`check_local_sweep.py` still green). `lib/config.mjs` → v1.1
(TESTPLANGEN_REQUIRED).

**The verifier (phase 1: contract lint)** — new
`local/lib/draftlint.mjs` (v1.0), the in-process port of
`review/harness/check_draft_coverage.py`'s v1.7 asserts with labels
mirrored VERBATIM; the Python stays the authority and the harness's
agreement leg fails on any verdict or label divergence.
`testplangen.verify`: `annotate` (default) writes a failing draft
with a `> [!IMPORTANT]` findings block under the banner (+ a
machine-readable `<!-- verify: N -->` line) so the §4 reviewer
starts where the machine found smells; `strict` refuses to write
(findings on stderr — the unattended-run posture, phase 3); `off` =
cloud-flow parity. The verifier never edits draft content —
annotate or refuse, whole-draft; grounding spot-checks stay phase 2.

**Harness** — new `local/harness/check_testplangen.py` (62 checks,
CI fixture-free job): guard leg (refusals verbatim, nothing called
or written), lanes leg (every routing branch — same-surface
exemplars in score order, overflow/cross-surface/spike references
with surface headers, digest-only kinds, a broken neighbor degrading
silently — plus the G6 fallback, `(none)` placeholders, live
timestamped write, dry-run plan + local copy, and the anthropic
transport with no leftover placeholders), caps leg (the v2.13
remaining-budget semantics pinned), fail-closed leg (markerless and
misordered replies write NOTHING), verifier leg (Python/JS
agreement on shared good/bad fixtures, strict refusal, annotate
block placement, off parity, bad-mode rejection).

**Docs** — `Local_Setup.md` §11 (setup, transport choice, runbook,
knobs, deviations); `config.sample.json` (`llm.testPlanModelId` +
the `testplangen` section); README bundle rows + generation section
note; STATUS component row + harness table;
`Local_TestPlanGen_Plan.md` phase-1 status. Cloud flows, packages,
agent file set, prompt, schemas: **unchanged** — the tenant path
stays valid, `Coverage_Runbook.md` untouched, and drafts from
either path land in the same folder under the same review contract
(the banner's provider stamp tells them apart). NEVER bump
`Config.PromptVersion` — nothing here changes the sidecar format or
reindexes the corpus.

| Piece | Version | Where |
|---|---|---|
| Local generation job | **v1.0** (new) | `local/testplangen.mjs` |
| Draft contract lint (in-process) | **v1.0** (new) | `local/lib/draftlint.mjs` |
| LLM client (`generateText`) | **v1.4** | `local/llm.mjs` |
| Config guards | v1.1 | `local/lib/config.mjs` |
| Generation-job gate | **new** (CI) | `local/harness/check_testplangen.py` |
| Setup + sample config | updated | `local/Local_Setup.md` §11, `local/config.sample.json` |
| Flows, packages, prompt, agent file set, schemas | unchanged | — |

| Date | Machine | check_testplangen | First live draft |
|---|---|---|---|
| 2026-09-04 | authoring env (mocked) | 62/62 PASS | — (pending sweep auth restore — STATUS action 12) |

# TestPlanGen v2.15 — source case sweep (prompt v1.7)

Motivated by the coverage-borrowing request (2026-08-14): go
through each test case in each related test plan, decide whether it
applies to the current user story, and when it does, create a case
tailored to the story. The lanes already deliver the material —
same-surface plans as EXEMPLAR TEXT, cross-surface plans and design
spikes as REFERENCE FUNCTIONALITY — but the rules around them are
soft in exactly the pre-v1.5 way: exemplars say "mirror the kinds
of cases they think to include", references say the model "MAY
ground" on them, so two cases used from a thirty-case plan violates
nothing. The fix is the mechanism this prompt has already proven
twice (RELATED DIGEST v1.5, Coverage Map v1.5): make the per-item
evaluation MANDATORY and make the model render the checklist so
skips are visible. Corpus plans are team-format sidecars (slide
headings and bullets, not our TC template), so the sweep is defined
over "every distinct test case or scenario, however the source
formats it" — a judgment a model can make and a deterministic
parser cannot, which is why this stays prompt-side and the
ONE-AI-Builder-call design holds (a per-plan extraction pre-pass
was considered and rejected: N+1 model calls for material the
single call already holds within the caps).

**Prompt v1.7** (authored as
`review/patches/TestPlanGen_Prompt_v1_7.md`, promoted to
`prompts/TestPlanGen_Prompt.md` — supersedes v1.6 in-repo BEFORE
its pending paste; v1.6's case granularity, v1.5's
requirement-driven coverage + Coverage Map, v1.4's GFM shape,
v1.3's reference lane, v1.2's enumeration coverage + conditional
sections, and v1.1's marker fix all carry forward unchanged):

- **New CASE SWEEP grounding rule** (one judgment per source case):
  every distinct test case or scenario described in EXEMPLAR TEXT
  and REFERENCE FUNCTIONALITY gets an explicit applies /
  doesn't-apply judgment against this story. Applies → a case
  tailored to THIS story's feature and surface (steps rewritten,
  granularity rules in force), Trace citing the source plan by
  title AND the story/reference statement the tailored case
  exercises — never the source case's feature-specific content,
  tool names, or data. Applies-but-unsupported → an Open Questions
  [VERIFY] naming the source plan and case (a possible coverage gap
  in the story, never an invented requirement). Doesn't apply → a
  stated reason. A source case missing from the sweep is a silent
  skip — invalid output.
- **New `## Source Case Sweep` CONDITIONAL section** between Open
  Questions and the Coverage Map, emitted whenever either lane is
  non-empty (omitted only when both are "(none)"): one table row
  per source case —
  `| Source plan | Source case | Applies? | Covered by / why not |`
  — verdict exactly Yes / No / Verify; Yes rows cite the tailored
  TC id(s), Verify rows cite the matching Open Questions entry, No
  rows state why. Empty cells are invalid; the DRAFT SHAPE intro
  now counts three conditional sections.
- Lane descriptions note the sweep; the exemplar-content, tools,
  surface, and story-wins-conflicts guards extend to swept cases in
  full. Worked example gains a three-row sweep (Yes / Verify / No)
  and its matching Open Questions entry.
- Output markers, input keys, and fences unchanged — the G9 slice
  is untouched. Scope: only plans whose BODIES reach the model are
  swept (`ExemplarSlots: 2` / `ReferenceSlots: 3` — the config
  knobs widen it); digest-only neighbors stay covered at document
  granularity by the RELATED DIGEST rule. Sweep-table length is one
  line per source case within the lane caps; truncation still
  fails CLOSED (`draftChars` is the gauge).

**Both flows** — `Config_gen.TestPlanGenPromptVersion` → v1.7 in
`flow/v1_0/` and `flow/core_v1_0/` (stamp only); both generation
packages re-cut with the stamped definitions (byte-identical to
their folder definitions, the provenance convention).

**Harness** — `review/harness/check_draft_coverage.py` extended to
the v1.7 contract (assert 8): when `## Source Case Sweep` is
present it must sit between Open Questions and the Coverage Map
with ≥1 data row, every verdict exactly Yes/No/Verify, Yes rows
citing a TC id that exists in the draft, Verify rows citing Open
Questions, No rows carrying a reason; a `sweepRows=` counter
prints. Sweep COMPLETENESS (no source case missing a row) needs
the source plans, so it stays a smoke/§4 reading check — and the
section's presence is lane-dependent, so absence alone never
fails the lint.

**Docs** — Setup §2 (stamp v1.7 + pane check notes the sweep is
correctly ABSENT when both lanes are empty), §3 G0 stamp, §4 (the
review pass gains the sweep step: completeness with the source
plan open beside the draft, No-row spot-checks, tailoring check on
Yes rows, Verify rows as possible story gaps); Smoke suite v1.6:
rows 3 and 10 gain the sweep checks (completeness is theirs), row
4 pins the both-lanes-empty absence; `Coverage_Runbook.md` step 2
pastes v1.7; `prompts/README.md`, `STATUS.md`, and root `README.md`
rows moved to v1.7 / v2.15.

Deploy (simple paste + one designer edit, both live flows —
`Coverage_Runbook.md` step 2; a tenant still on the pre-v1.3
four-parameter contract creates `ReferenceText` first): paste v1.7
into `LRS Test Plan Generation` (replaces the pending v1.6 paste),
set both `Config_gen.TestPlanGenPromptVersion` stamps to v1.7 (or
re-import the re-cut packages), run smoke rows 1, 3, 9, 10 and
record below. NEVER bump `Config.PromptVersion` — nothing here
changes the sidecar format or reindexes the corpus.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.7** | `review/patches/TestPlanGen_Prompt_v1_7.md` → `prompts/TestPlanGen_Prompt.md` |
| Flow definitions (stamp only) + re-cut packages | v2.15 delta | `testplangen/flow/v1_0/definition.json`, `testplangen/flow/core_v1_0/definition.json`, both zips |
| Draft coverage lint | updated (v1.7 contract) | `review/harness/check_draft_coverage.py` |
| Setup + smoke + runbook docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` (suite v1.6), `Coverage_Runbook.md` |
| Agent file set / schemas | unchanged | — |

| Date | Tenant | Rows passed (of 11) | TestPlanGenPromptVersion |
|---|---|---|---|
| — | — | — | v1.7 (paste pending) |

# TestPlanGen v2.14 — granular test cases (prompt v1.6)

Motivated by the standing granularity complaint (2026-08-14):
generated test cases are too coarse. v1.5's requirement-driven
coverage stops requirements merging ACROSS cases, but nothing stops
several independently falsifiable outcomes bundling INSIDE one case
— one Expected Result asserting "the referent updates AND the others
are preserved AND the change is logged", compound steps ("create a
route and add an event"), and the parameterization escape hatch
hiding variants with different outcomes behind one "repeat for ..."
case. A bundled case cannot be half-checked-off in the rendered task
list, a shared Expected Result makes a partial failure unreportable
(which assertion failed?), and the Coverage Map loses precision when
one TC id stands for three behaviors — the doc 1 review's CG-6 (the
Split case never asserting the outer referents unchanged) is exactly
the assertion a bundled case swallows.

**Prompt v1.6** (authored as
`review/patches/TestPlanGen_Prompt_v1_6.md`, promoted to
`prompts/TestPlanGen_Prompt.md` — supersedes v1.5 in-repo BEFORE its
pending paste; v1.5's requirement-driven coverage + Coverage Map,
v1.4's GFM shape, v1.3's reference lane, v1.2's enumeration
coverage + conditional sections, and v1.1's marker fix all carry
forward unchanged):

- **New CASE GRANULARITY grounding rule** (one behavior per case):
  every case verifies exactly ONE observable behavior — its Expected
  Result is a single outcome judged pass/fail as a whole; a case
  that would assert two independently falsifiable outcomes splits
  into one case per outcome, each with its own Trace, repeating
  shared steps as needed. Each Steps checkbox is ONE tester action
  (never two joined by "and"/"then"; never a verification folded
  into a step — the judgment lives only in Expected Result).
  Parameterization is legal ONLY when the steps AND the expected
  result are identical modulo the substituted term, and the case
  must name every variant it covers (never "etc." / "all types") —
  a variant that changes any step or the outcome becomes its own
  case. One TC id must never stand for several behaviors.
- **CASE COUNT closes the loophole**: length is controlled by terse
  steps and parameterization, never by dropping or merging
  requirements — and now explicitly never by bundling several
  assertions into one case.
- **Case-shape prose tightened where cases are written**: the
  Positive Tests intro states the one-behavior rule, the Expected
  Result definition becomes "the single observable outcome this case
  verifies ... never two independent outcomes (split the case
  instead)", and the numbering note pins each checkbox to a SINGLE
  tester action. Worked example preamble notes the rule (its cases
  were already atomic).
- Output markers, input keys, and fences unchanged — the G9 slice
  and its literals are untouched. Split cases mean longer drafts;
  truncation still fails CLOSED (a lost `[[[DRAFT END]]]` writes
  nothing), and `Gen_summary`'s `draftChars` remains the gauge.

**Both flows** — `Config_gen.TestPlanGenPromptVersion` → v1.6 in
`flow/v1_0/` and `flow/core_v1_0/` (stamp only); both generation
packages re-cut with the stamped definitions (byte-identical to
their folder definitions, the provenance convention).

**Harness** — `review/harness/check_draft_coverage.py` extended to
the v1.6 contract: every TC case must carry exactly one
`**Expected Result:**` line and at least one Steps checkbox (the
structural half of granularity — skipped under `--baseline`); a new
`stepsPerCase=` counter prints for before/after comparison. The
semantic half (single outcome per Expected Result, one action per
step, variant-explicit parameterization) is a smoke/§4 reading
check.

**Docs** — Setup §2 (stamp v1.6 + pane check gains the
single-outcome assertion), §3 G0 config stamp, §4 (the review pass
gains the split check and the parameterization-variant check);
Smoke suite v1.5: rows 1 and 9 amended (row 9 pins the CG-6-shaped
bundle: new-referent population and outer-referent preservation are
SEPARATE cases); `Coverage_Runbook.md` step 2 pastes v1.6;
`prompts/README.md` and `STATUS.md` rows moved to v1.6.

Deploy (simple paste + one designer edit, both live flows —
`Coverage_Runbook.md` step 2; a tenant still on the pre-v1.3
four-parameter contract creates `ReferenceText` first): paste v1.6
into `LRS Test Plan Generation` (replaces the pending v1.5 paste),
set both `Config_gen.TestPlanGenPromptVersion` stamps to v1.6 (or
re-import the re-cut packages), run smoke rows 1 and 9 and record
below. NEVER bump `Config.PromptVersion` — nothing here changes the
sidecar format or reindexes the corpus.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.6** | `review/patches/TestPlanGen_Prompt_v1_6.md` → `prompts/TestPlanGen_Prompt.md` |
| Flow definitions (stamp only) + re-cut packages | v2.14 delta | `testplangen/flow/v1_0/definition.json`, `testplangen/flow/core_v1_0/definition.json`, both zips |
| Draft coverage lint | updated (v1.6 contract) | `review/harness/check_draft_coverage.py` |
| Setup + smoke + runbook docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` (suite v1.5), `Coverage_Runbook.md` |
| Agent file set / schemas | unchanged | — |

| Date | Tenant | Rows passed (of 11) | TestPlanGenPromptVersion |
|---|---|---|---|
| — | — | — | v1.6 (paste pending) |

# TestPlanGen v2.13 — self-reference-safe budget take (flows v2.3)

A live save of the v2.2 flow failed validation (2026-08-13, the
first deploy attempt — the v2.4 IsMatch precedent: a platform rule
the authored definition only meets on the tenant):

> `WorkflowRunActionInputsInvalidProperty: The inputs of workflow
> run action 'Append_exemplar' of type 'AppendToStringVariable' are
> not valid. Self reference is not supported when updating the value
> of variable 'ExemplarText'.`

The finding: **a variable-update action may not reference the
variable it updates** — the v2.12 budget fix put
`length(variables('ExemplarText'))` inside `Append_exemplar`'s own
value (and `ReferenceText` inside `Append_reference`'s). The
CONDITIONS reading those variables are legal; only the appends are
not. The v2.2 packages therefore cannot even be saved after the
post-import re-picks.

The fix, **flows v2.3** (both definitions, mirrored; re-verified
action-identical outside the five known structural deltas): the
remaining-budget arithmetic moves into one Compose per lane —
**`Ex_remaining`** between `Get_exemplar_md` and `If_ex_budget`,
**`Ref_remaining`** between `Get_reference_md` and `If_ref_budget`
(a Compose may read any variable):

```
@sub(int(outputs('Config_gen')?['ExemplarCap']), length(variables('ExemplarText')))
@sub(int(outputs('Config_gen')?['ReferenceCap']), length(variables('ReferenceText')))
```

The appends' `take()` second argument becomes
`outputs('Ex_remaining')` / `outputs('Ref_remaining')`; the budget
gates' expressions are unchanged (their run-afters re-point to the
new composes). Semantics identical to the v2.12 intent — the caps
are now actually enforced — and a full self-reference scan of every
variable-update action in both definitions reports zero remaining.

**Docs** — Setup §3 G7/G7b gain the two composes (with the
self-reference rule stated as a designer caution);
`designer-edits.md` §testplangen-v2_12 U6 rewritten around the
composes (its intro now notes U6 adds one action per lane). Both
packages re-cut byte-identical.

Deploy delta, live tenant: re-import the re-cut
`TestPlanGenCore_v1_0.zip` (and `TestPlanGen_v1_0.zip` where the
list-menu front door is used) — anyone who imported the v2.2
packages must re-import (the flow cannot be saved as imported) or
add the two composes by hand per the amended U6. Everything else in
the v2.12 deploy delta stands. NEVER bump `Config.PromptVersion`.

| Piece | Version | Where |
|---|---|---|
| Standalone flow + package | **v2.3** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Core child flow + package | **v2.3** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Designer edits | §testplangen-v2_12 U6 amended | `review/patches/designer-edits.md` |
| Setup doc | updated (G7/G7b) | `TestPlanGen_Setup.md` |
| Prompt, smoke suite, agent file set, schemas | unchanged | — |

| Date | Tenant | Rows passed (of 11) | Flows |
|---|---|---|---|
| — | — | — | v2.3 (deploy pending) |

# TestPlanGen v2.12 — design-doc references, slot config, budget fix (flows v2.2)

The flow half of the coverage push (v2.11 is the prompt half; the
deployed-state half is `Coverage_Runbook.md`). Even with retrieval
revived and prompt v1.5 pasted, the v2.1 flows under-deliver
supporting documentation three ways: only `DocKind = 'Test Plan'`
neighbors ever contribute full text (the prompt has promised "test
plans **or design docs**" in the reference lane since v1.3 — Design
Spikes could never arrive); a same-surface plan arriving after both
exemplar slots fill fails both routing conditions and silently
degrades to a 400-char digest line (the documented G5b fall-through);
and the slot counts are hard-coded literals. Plus one real bug: the
G7/G7b budget conditions gate correctly on "remaining > 0" but the
appends re-`take()` the FULL cap each iteration, so `ExemplarText`
could reach ~2× ExemplarCap (~40k chars) and `ReferenceText` ~2×
ReferenceCap — oversized context that both wastes the budget the
caps exist to enforce and pressures the model toward consolidation.

**Both flows → v2.2** (`flow/v1_0/definition.json`,
`flow/core_v1_0/definition.json` — seven expression-level edits,
mirrored; no new actions, no renames, no runAfter changes; the
authored pair re-verified action-identical outside the five known
structural deltas):

- **`If_testplan_neighbor`** admits `Design Spike` alongside
  `Test Plan` (the one other DocKind that describes expected
  behavior; Data Template / Schedule / Doc Review / Other / adjacent
  User Story stay digest-only).
- **`If_exemplar_slot`** gains a `DocKind = 'Test Plan'` conjunct (a
  spike must never become a style exemplar) and reads
  `Config_gen.ExemplarSlots` instead of the literal 2.
- **`If_reference_slot`** drops the cross-surface requirement and
  reads `Config_gen.ReferenceSlots`: same-surface plans past the
  exemplar slots now OVERFLOW into the reference lane instead of
  vanishing (score-ordered arrival keeps the best plans in the
  exemplar slots), and Design Spikes on any surface land here.
  Prompt v1.3+ already supports same-surface references — the
  surface-parity [VERIFY] keys on each reference block's own surface
  header, so no spurious VERIFYs.
- **`Config_gen`**: new `ExemplarSlots: 2`, `ReferenceSlots: 3` (the
  third reference slot is the cheapest more-supporting-docs lever —
  bounded by ReferenceCap, which is now actually enforced);
  `StoryCap` 30000 → 45000 (a truncated story tail loses acceptance
  criteria = silently lost cases; post-fix worst-case context ≈
  45k + 20k + 12k + digest ≈ 80k chars ≈ ~20k tokens, comfortably in
  the model window). `Exemplar_rows`' two literal takes read
  `ExemplarSlots` too.
- **Budget fix** — `Append_exemplar` / `Append_reference` `take()`
  the REMAINING budget (`sub(cap, length(variable))`) instead of the
  full cap; the gates already guarantee it is positive.
- **`Gen_summary`** appends ` exChars=` / ` refChars=` so the fix
  and the widened lanes are observable in run history
  (`exChars ≤ ExemplarCap` is the post-check).

**Docs** — Setup §3 G0 (config block + knob prose), G5b (two-lane
router + overflow rule replacing the fall-through parenthetical), G6
`Exemplar_rows`, G7/G7b append expressions, G13 (new fields +
reading), reference-lane no-fallback prose, Known limits (amended
v2.2); Smoke suite v1.4: rows 3 and 10 amended, new row 11 (Design
Spike / same-surface overflow end-to-end, `exChars`/`refChars` cap
check). NeighborCap/RelatedTopN deliberately NOT raised: the sweep's
`RelatedTopN: 5` is the true ceiling on the `related:` list, and
raising either is inert until the FX-5 backfill converges — revisit
when `Gen_summary` shows `neighbors=5` routinely. A reference
fallback query stays rejected (the v2.0 rationale: blind
cross-surface retrieval grounds drafts on unrelated features).

Both packages re-cut with the v2.2 definitions (byte-identical to
their folder definitions, the provenance convention) — this re-cut
also carries the v2.11 stamp, closing the deferral noted there.

Deploy delta, live tenant (requires the v2.0 contract on the tenant
— `Coverage_Runbook.md` step 3; commutes with the v1.5 paste, so it
rides that window or its own): apply
`review/patches/designer-edits.md` §testplangen-v2_12 (U1–U7) in
BOTH live flows — or re-import the re-cut packages (post-import
checks I1–I4) — then run smoke rows 3, 10, 11 and record below.
NEVER bump `Config.PromptVersion` — nothing here changes the sidecar
format or reindexes the corpus.

| Piece | Version | Where |
|---|---|---|
| Standalone flow + package | **v2.2** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Core child flow + package | **v2.2** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Designer edits | §testplangen-v2_12 (U1–U7) | `review/patches/designer-edits.md` |
| Setup + smoke docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` (suite v1.4, 11 rows) |
| Prompt, agent file set, schemas | unchanged | — |

| Date | Tenant | Rows passed (of 11) | Flows |
|---|---|---|---|
| — | — | — | v2.2 (deploy pending) |

# TestPlanGen v2.11 — requirement-driven coverage (prompt v1.5)

Motivated by the standing coverage complaint (2026-08-13): live
drafts generate too few test cases and visibly under-use supporting
documentation. The deployed-state half — dead keyword retrieval
(FX-3), the stalled backfill (FX-5), the never-created ReferenceText
parameter, every prompt paste since v1.0 pending — is sequenced in
the new **`testplangen/Coverage_Runbook.md`** (STATUS open action 9).
This entry is the authored half: even fully pasted, prompt v1.4
keeps the RC-3 consolidation bias
(`review/REVIEW_TestPlanGen_doc1_coverage.md`) — "4–10 positive and
3–8 negative … prefer fewer" pushes toward merging exactly when an
enumeration-heavy story needs expansion — and RELATED DIGEST entries
are only "may inspire", so a model can ignore the whole digest
without violating a rule.

**Prompt v1.5** (authored as
`review/patches/TestPlanGen_Prompt_v1_5.md`, promoted to
`prompts/TestPlanGen_Prompt.md` — supersedes v1.4 in-repo BEFORE its
pending paste; v1.4's GFM shape, v1.3's reference lane, v1.2's
enumeration coverage + conditional sections, and v1.1's marker fix
all carry forward unchanged):

- **CASE COUNT rule replaced**: case count is an OUTPUT of coverage,
  never a target — at least one positive case per distinct
  workflow/acceptance-criterion statement, at least one negative
  case per stated-or-implied validation/denial/conflict/boundary;
  never merge two requirements into one case for length. Floor kept
  (fewer than 4 positive / 3 negative flags under-coverage), ceiling
  dropped; length is controlled by terse steps and explicit
  parameterization.
- **New always-on `## Coverage Map` final section + REQUIREMENT
  COVERAGE rule** (the Trace rule's converse; the prompt-side
  realization of the Setup guide's queued "coverage matrix"
  follow-on): requirements are enumerated FIRST, cases written
  against the list, and the list rendered as a
  `| # | Requirement (source) | Covered by |` table — every row
  cites covering TC ids or an Open Questions entry; an empty
  Covered by cell is invalid output. Hands the §4 reviewer the trace
  matrix the doc 1 review built by hand.
- **ENUMERATION COVERAGE cross-product clause**: two enumeration
  axes (e.g. six edit pathways × point/line events) = every pairing
  exercised or explicitly parameterized (CG-4's generalization).
- **RELATED DIGEST strengthened**: evaluate EVERY entry — plausible
  interaction becomes a cited interaction/regression case, or an
  Open Questions entry naming the document when the one-line summary
  is too thin. Works even while neighbor bodies are absent.
- Output markers, input keys, and fences unchanged — the G9 slice
  and its literals are untouched. Length risk fails CLOSED (a
  truncated reply loses `[[[DRAFT END]]]` → no draft written); watch
  `Gen_summary`'s `draftChars`.

**Both flows** — `Config_gen.TestPlanGenPromptVersion` → v1.5 in
`flow/v1_0/` and `flow/core_v1_0/` (stamp only). The package re-cut
is deliberately deferred to the v2.12 flow changes landing with this
same branch — one re-cut carries both entries; until then the zips
lag the folder definitions by the stamp.

**Harness** — new `review/harness/check_draft_coverage.py`: offline
lint of a downloaded draft against the v1.5 contract (section order,
Trace on every case, CAUTION alert, no empty/dangling Covered by
cells, sequential TC ids) + before/after counters; `--baseline`
scores pre-v1.5 drafts. Registered in `review/harness/README.md`
(standing suite 6).

**Docs** — Setup §2 (six-section pane check incl. the Coverage Map,
v1.5 stamps), §4 (review STARTS from the Coverage Map, plus a scan
for statements the map missed); Smoke suite v1.3: rows 1 and 9 check
the Coverage Map contract (row 9 pins the doc 1 trace matrix — 15
requirements, the 9/15 baseline this guards); `prompts/README.md`
row → v1.5 paste pending.

Deploy (simple paste + one designer edit, both live flows —
`Coverage_Runbook.md` step 4; a tenant still on the four-parameter
contract does the runbook's step 3 first): paste v1.5 into
`LRS Test Plan Generation` (replaces the pending v1.4 paste), set
both `Config_gen.TestPlanGenPromptVersion` stamps to v1.5, run smoke
rows 1, 9, 10 and record below. NEVER bump `Config.PromptVersion` —
nothing here changes the sidecar format or reindexes the corpus.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.5** | `review/patches/TestPlanGen_Prompt_v1_5.md` → `prompts/TestPlanGen_Prompt.md` |
| Flow definitions (stamp only) | v2.11 delta | `testplangen/flow/v1_0/definition.json`, `testplangen/flow/core_v1_0/definition.json` (packages re-cut with v2.12) |
| Coverage runbook | new | `testplangen/Coverage_Runbook.md` |
| Draft coverage lint | new | `review/harness/check_draft_coverage.py` |
| Setup + smoke docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` (suite v1.3) |
| Agent file set / schemas | unchanged | — |

| Date | Tenant | Rows passed (of 10) | TestPlanGenPromptVersion |
|---|---|---|---|
| — | — | — | v1.5 (paste pending) |

# TestPlanGen v2.10 — rebuilt-list GUIDs + config-driven list bindings (flows v2.1 / lookup v1.1)

The tenant's SharePoint lists were rebuilt, changing their GUIDs —
the FX-6 discovery (`review/patches/designer-edits.md`), now
confirmed to reach further than the sweep's three raw-REST creates:

| List | OLD GUID (authored until now) | CURRENT GUID |
|---|---|---|
| Doc Index | `245a4082-53c5-49f0-90e1-1abe62698c4a` | `b98fb2a1-1c91-48f9-9b9b-323656557171` |
| Doc IDs | `87b75cd7-5e84-4a65-adb5-dcd0de08321d` | `6263eeac-471a-489e-96c7-1448f45378d4` |

Two changes in all three flow definitions (standalone `v1_0`, core
`core_v1_0`, lookup `lookup_v1_0`):

1. **Current GUIDs in the config composes** — `Config_gen.DocIndexList`
   and `Config_lookup.DocIndexList`/`DocIdsList` now hold the rebuilt
   lists' GUIDs (`Config_lookup` site/caps and everything else
   unchanged).
2. **Config-driven site/list bindings** — every SharePoint action's
   hardcoded `dataset`/`table` literal becomes an expression through
   its flow's config compose: `@{outputs('Config_gen')?['SiteUrl']}` /
   `?['DocIndexList']` (7 actions in each generation flow:
   Get_story_row, Get_story_sidecar, Get_neighbor_row, Get_exemplars_q,
   Get_exemplar_md, Get_reference_md, Save_draft) and
   `@{outputs('Config_lookup')?['SiteUrl']}` / `?['DocIdsList']` /
   `?['DocIndexList']` (Get_id_rows, Get_doc_row, Get_story_rows).
   The next list rebuild is a one-line config edit. All actions run
   downstream of their config compose, so the outputs are always
   available. The ONE exception: the standalone flow's
   `For_a_selected_item` trigger cannot evaluate `outputs()` (triggers
   fire before any action), so its `table` stays a LITERAL — swapped
   to the new Doc Index GUID; a future rebuild re-picks it in the
   designer.

All three import packages re-cut with the updated payloads
(byte-identical to their folder definitions, the provenance
convention). `TestPlanGenAgentFlow` and its package are untouched —
it binds no lists (its only external reference is the
child-flow re-pick placeholder).

Deploy delta, live tenant: EITHER apply the same custom-value
expressions to the live flows in the designer (Site Address / List
Name per action, the table above — plus the standalone trigger
re-pick) — OR re-import the re-cut packages. Fresh imports on any
tenant now land on the current lists out of the box.

| Piece | Version | Where |
|---|---|---|
| Standalone flow + package | **v2.1** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Core child flow + package | **v2.1** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| StoryLookupFlow + package | **v1.1** | `testplangen/flow/lookup_v1_0/`, `StoryLookupFlow_v1_0.zip` |
| Agent flow + package, agent file set, prompt, schemas | unchanged | — |

# TestPlanGen v2.9 — flow nodes embedded in the topic YAML (agent v1.9)

The GenerateTestPlan topic now ships with its two `InvokeFlowAction`
nodes EMBEDDED, bound to the live tenant's flow GUIDs (captured from
the canvas-generated skeleton, 2026-08-13):

- **StoryLookupFlow** `a9e637bb-5197-f111-8075-6045bd0706c5`
  (node `invokeFlowAction_SZcLsX`, needLookup branch)
- **TestPlanGenAgentFlow** `e31f2b0e-5397-f111-8075-6045bd0706c5`
  (node `invokeFlowAction_pSaLyd`, confirmed-Yes branch)

This retires the paste-then-canvas-add two-step (Agent_Setup §3) **on
the live tenant**: pasting the v1.9 topic YAML brings the nodes with
it. The §3 canvas procedure remains the fallback for any other
environment — flowId must be a real GUID at paste time
(GuidParseError otherwise), so a foreign environment swaps both GUIDs
in the topic + `connectionreferences.mcs.yml` (which now carries the
same live ids instead of REBIND placeholders) or re-picks in the
canvas.

Binding shapes, fixed by the flows' schemas: inputs use the trigger
schema property names (`text`/`text_1` = LookupKind/LookupQuery on
the lookup flow; `number` = StoryId on the generation flow); outputs
use the lowercased respond schema names. The lookup node's
`storyid`/`storytitle` outputs land in `Topic.ResolvedId` /
`Topic.ResolvedTitle` (strings, per the respond schema) — NOT
`Topic.StoryId`, which stays numeric and is set only via
`Value(Topic.ResolvedId)` in the lookupOne branch (the
canvas-generated skeleton had bound storyid straight to
Topic.StoryId; that would have broken the `= 0` / `> 0` gates). The
init* declarations stay: they keep the paste valid if a node is ever
removed, and the node bindings overwrite them at runtime. No flow,
package, prompt, or schema changes.

Deploy delta: re-paste the v1.9 GenerateTestPlan topic via Open code
editor (no canvas node re-add needed on the live tenant), confirm the
two flow nodes render bound in the canvas, re-run smoke rows 1–2c
and 7.

| Piece | Version | Where |
|---|---|---|
| Agent file set (topic flow nodes + connection refs + headers) | **TestPlanGenAgentVersion v1.9** | `testplangen/agent/TestPlanGenAgent/` |
| Everything else (flows, packages, prompt, schemas) | unchanged | — |

| Date | Tenant | Rows passed (of 10) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.9 (paste pending) |

# TestPlanGen v2.8 — GFM draft shape (prompt v1.4 + WARNING banner)

Part of the repo-wide formatting upgrade to GitHub-style markdown
viewers (flow v2.7 / PromptVersion v1.9 for the sidecars — see
`flow/v2_7/CHANGES.md`; this entry is the TestPlanGen half and
deploys independently). Drafts pick up GFM features:

- **Prompt v1.4** (`prompts/TestPlanGen_Prompt.md`, artifact
  `review/patches/TestPlanGen_Prompt_v1_4.md`, supersedes the
  pending v1.3 paste — draft SHAPE only, no input/grounding/sentinel
  changes): the Overview opens with a one-row
  `| Surface | Target release | PE |` StoryMeta table; Setup /
  Prerequisites items and per-case Steps are GFM task lists
  (`- [ ] 1. ...`) so testers check work off in the rendered view;
  Expected Result / Trace become standalone bold lines; Negative
  Tests opens with a fixed `> [!CAUTION]` alert ("A pass below is
  the described denial or error — never the edit succeeding.");
  every Open Questions entry is a `- [ ] [VERIFY: ...]` checkbox.
  Worked example rewritten to match.
- **`Draft_banner` alert** (both flow definitions —
  `flow/v1_0/definition.json` and `flow/core_v1_0/definition.json`
  — and both live flows via designer edit): a `> [!WARNING]` line
  inserted right after the HTML comment, so the existing two-line
  banner renders as a GFM warning alert instead of a plain
  blockquote. Version stamp `Config_gen.TestPlanGenPromptVersion`
  → `v1.4`.

No backfill: drafts are one-shot outputs, old drafts stay as
authored. The draft slicing (`[[[DRAFT BEGIN]]]`/`[[[DRAFT END]]]`)
and the sidecar `related: [` line-slice are untouched — the latter
verified frame-independent against BOTH sidecar shapes in the v2.7
transition window (position-independent `indexOf`; the new `issues: [`
yaml line never matches `related: [`).

Deploy delta (one small window, both live flows): paste prompt v1.4
into the `LRS Test Plan Generation` AI Builder prompt (replaces the
pending v1.3 paste; no parameter changes — if still pre-v1.3, do the
v2.0 ReferenceText contract step first), apply
`review/patches/designer-edits.md` §testplangen-v2_8 (T1 banner line,
T2 version stamp) to both flows, smoke one draft and eyeball it in a
GFM viewer. No schema changes.

| Piece | Version | Where |
|---|---|---|
| Prompt | **v1.4** | `prompts/TestPlanGen_Prompt.md` |
| Flow definitions (banner + stamp) | v2.8 delta | `testplangen/flow/v1_0/definition.json`, `testplangen/flow/core_v1_0/definition.json` |
| Designer edits | §testplangen-v2_8 | `review/patches/designer-edits.md` |
| Agent file set / schemas | unchanged | — |

# TestPlanGen v2.7 — routed conversation starters + About topic (agent v1.8)

Starters are REAL messages under classic orchestration: clicking one
sends its text, which must land on a topic's trigger phrases or the
user gets the fallback redirect — exactly what the two informational
starters ("What do I need before generating?", "Where do drafts
land?") had been doing since v1.1. v1.8 makes every starter route
deliberately:

- **Six starters** (`agent.mcs.yml`): three generation entries — one
  per reference form (generic, devtopia issue, story title), each
  phrased on a GenerateTestPlan trigger — and three question entries
  (accepted inputs / prerequisites / where drafts land).
- **New static topic `AboutTestPlanGen`**
  (`topics/AboutTestPlanGen.mcs.yml`) answers the question starters:
  pre-authored text only (accepted reference forms, the
  Indexed + User Story prerequisite, the sweep-sees-the-issue-first
  caveat, the drafts folder + review loop, the Q&A-agent redirect for
  content questions). It generates nothing — the thin-agent rule
  holds — and its triggers are question-shaped so they never steal
  "draft/generate a test plan…" utterances from GenerateTestPlan.
- Smoke row 8: click all six starters; none may land in the fallback
  redirect.

Deploy delta: overlay/paste the updated `agent.mcs.yml` starters,
create the AboutTestPlanGen topic (paste its YAML via Open code
editor), re-run smoke rows 5 and 8. No flow, package, prompt, or
schema changes.

| Piece | Version | Where |
|---|---|---|
| Conversation starters + About topic (+ file-set headers) | **TestPlanGenAgentVersion v1.8** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup (file table, smoke row 8) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 10) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.8 (paste pending) |

# TestPlanGen v2.6 — IsMatch-free classification (agent v1.7)

The first live RUN of the v1.6 topic (2026-08-13, conversation
35788304) crashed with ContentValidationError on `setDocIdBare`:
input `#32989` satisfied `IsMatch(Topic.RefLower, "\d+")`, took the
bare-doc-id branch, and `Value("#32989")` threw. The finding behind
the crash: **on this runtime, `IsMatch` matches as CONTAINS, not the
documented complete-match** — so "contains any digits" was
classifying every issue reference (and would have taken any
digit-bearing title) as a bare doc id, and the first non-numeric hit
crashed the topic rather than misrouting quietly.

Fix (topic v1.7): the classify group uses NO `IsMatch` at all —
semantics no longer depend on the contains/complete question:

- bare doc id: `=IsNumeric(Topic.RefText)`;
- issue URL: the v1.6 `in` form (unchanged);
- issue tag (`#N` / `issue N` / `devtopia N`): `StartsWith` on the
  marker + `Substitute`-strip of `devtopia`/`issue`/`#` +
  `IsNumeric` on the remainder — the stripped remainder IS the
  lookup query, which also retires that branch's `Match` extraction;
- doc tag (`doc N` / `id N`): same strip pattern with `doc`/`id`.

Anything failing all four tests — including digit-bearing titles
like "3.8 route merge" — falls to the title lane, which is the safe
default. The one remaining regex is the URL branch's
`Match(..., "issues/(?<num>\d+)").num` digit extraction, correct
under contains semantics by design. Agent_Setup's schema-drift
caution now leads with the runtime finding; the paste-time ladder
records fold under it.

No flow, package, prompt, or schema changes — this is again all
topic-side. Tenants mid-deploy: re-paste the classify group (or the
topic body) and re-run the test-pane paths, starting with the exact
crasher: `#32989`-style input must now route to the issue lane.

| Piece | Version | Where |
|---|---|---|
| GenerateTestPlan topic (IsMatch-free classify group; + file-set headers) | **TestPlanGenAgentVersion v1.7** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup (schema-drift caution: runtime contains-semantics finding) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 9) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.7 (paste in progress) |

# TestPlanGen v2.5 — live-validated URL condition + canonical binding keys (agent v1.6)

Second and third findings from the same live v2.3 deployment
(2026-08-13, continuing the v2.4 record):

**F1 — the v2.4 anchored IsMatch also failed canvas validation**
("Expected operator"), while the file's simpler `IsMatch` conditions
and the named-group `Match(...).num` extractions validated. A variant
ladder was offered against the live canvas; the form adopted on the
tenant — now the checked-in `refIsIssueUrl` condition (amended in
place before the pending smoke, the supersede-before-paste
precedent) — is the regex-free `in` substring form
(case-insensitive):

    =And("devtopia.esri.com/" in Topic.RefLower, "/issues/" in Topic.RefLower)

The full ladder (Find function style, operator style, simplified
IsMatch pattern) is recorded in Agent_Setup's schema-drift caution
for the next tenant, along with the trap that mimics total failure:
curly quotes from a clipboard hop fail EVERY variant with "Expected
operator" — retype the quotes before concluding anything.

**F2 — canonical flow-node binding keys confirmed.** The first
tenant bind surfaced `InvalidBindingInvokeAction` from the topic
checker until the bindings used the flows' SCHEMA keys, not display
names: inputs `number` (generation StoryId) and `text` / `text_1`
(lookup LookupKind / LookupQuery, creation-order-dependent — swapped
order crosses the lanes and every issue lookup returns `error`);
outputs are the lowercased respond names. An unbound required input
(`input: {}`) throws the same checker error. Agent_Setup §3 now
records the keys and the diagnosis path (bind in the canvas UI, read
the code editor back).

No flow, package, prompt, or schema changes — both flow contracts
are untouched; this is all topic-side Power Fx and binding-key
reality. Tenants mid-v2.3/v2.4 paste: replace the one condition,
confirm the binding keys, continue at §3's checks.

| Piece | Version | Where |
|---|---|---|
| GenerateTestPlan topic (refIsIssueUrl live-validated form; + file-set headers) | **TestPlanGenAgentVersion v1.6** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup (variant ladder, quote trap, §3 canonical binding keys + InvalidBindingInvokeAction triage) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 9) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.6 (paste in progress) |

# TestPlanGen v2.4 — two-argument IsMatch in the classify group (agent v1.5)

Live-deployment fix, found on the first v1.4 canvas paste
(2026-08-12): the topic's `refIsIssueUrl` condition — the file's ONLY
three-argument `IsMatch` — failed canvas validation on
`MatchOptions.Contains`. Every two-argument `IsMatch` and the
named-group `Match(...).num` extractions validated, so the fault line
is the `MatchOptions` enum on Copilot Studio's Power Fx surface, not
regex support. Fix: drop the third argument and express contains
semantics with anchors on the default complete-match —

    =IsMatch(Topic.RefLower, ".*devtopia\.esri\.com/[^/\s]+/[^/\s]+/issues/\d+.*")

Behavior identical. The rule going forward (topic header + the
Agent_Setup schema-drift caution): every `IsMatch` in the file stays
two-argument. The caution also records the regex-free fallback for
the URL test (`Find`-based) should a tenant reject even the anchored
form — swap it in the canvas and carry it back to the file. All five
file-set headers move to v1.5 together (settings had lagged at v1.3;
its content is unchanged).

No flow, package, prompt, or schema changes — both flow contracts and
every generation artifact are untouched. Deploy delta for a tenant
mid-v2.3-paste: re-paste the one condition (or the topic body) and
continue at Agent_Setup §3.

| Piece | Version | Where |
|---|---|---|
| GenerateTestPlan topic (refIsIssueUrl condition + comments; + file-set headers) | **TestPlanGenAgentVersion v1.5** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup (schema-drift caution: two-argument IsMatch rule + Find fallback) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 9) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.5 (paste in progress) |

# TestPlanGen v2.3 — story lookup: doc id, devtopia issue #, or title (agent v1.4)

Closes the "Title → id resolution" follow-on queued in
`agent/Agent_Setup.md` since v1.1 — and folds devtopia issue numbers
into the same lookup, since the plumbing for those already exists:
the nightly sweep's RegexExtract mints a **Doc IDs** row
(`Document` lookup + `IssueNumber`, both indexed) for every devtopia
reference it finds, so "which story is issue 4855" has been a cheap
indexed query all along. The agent can now be told any of:

- a **Doc Index item id** (`42`, `doc 42`, `id 42`) — used directly,
  exactly as before;
- a **devtopia issue** (`#4855`, `issue 4855`, `devtopia 4855`, or
  the full devtopia URL) — resolved via the Doc IDs list;
- **story-title text** (anything else) — resolved by contains-match
  over indexed User Story titles.

Two deliberate calls. **A bare number is always a doc id, never an
issue number** — the pre-v1.4 dialog took bare ids, and guessing
between the two readings would silently draft from the wrong story;
issue numbers need one of the markers above (the ask-prompt says so).
And **nothing generative touches the reference**: the topic
classifies with deterministic Power Fx (`IsMatch`/`Match` on the
trimmed, lowercased input — orchestration stays Classic), and the
resolution is SharePoint list queries in a flow. Ambiguity goes back
to the human: several matches → a capped candidate list
(`- doc NN — "Title" (surface …, release …)`, first 8, flagged past
the cap) and a which-id question; zero matches → coaching (title:
narrow the words / use the id; issue: the story's sidecar must
already carry the devtopia reference — Doc IDs rows are minted at
sweep time), and generation is NOT invoked.

**New agent flow `StoryLookupFlow`** (Agent_Setup §1d; built in
Copilot Studio per the 1c lesson; authored shape reference checked in
at `testplangen/flow/lookup_v1_0/definition.json`, with an authored
re-cut import package `testplangen/StoryLookupFlow_v1_0.zip` — the
TestPlanGenAgentFlow packaging mechanics, byte-identical payload,
SharePoint-only resource map, carried with the v1.4 caveat that
agent-flow package imports may not surface as recognized cards, so
the §1d hand-build stays the primary path): inputs
`LookupKind` (`issue`|`title` — the flow never parses free text) and
`LookupQuery`; outputs `LookupStatus` (`one`/`many`/`none`, `error`
from the failure respond) + `StoryId` + `StoryTitle` + `Candidates`.
Issue lane: `IssueNumber eq N` on Doc IDs (int-cast input — nothing
user-typed is interpolated into `$filter` as a string), dedup by
document, per-row Try + neutralizer (a row pointing at a recycled doc
degrades silently, the G5 pattern), kind-filtered to
User Story + Indexed. Title lane: `DocKind eq 'User Story' and
IndexStatus eq 'Indexed'` top 100 by Modified, then an in-memory
contains-filter (the curation §1 rule — no `substringof` on a
non-indexed column, no user text in OData). Read-only over both
lists; SharePoint connector only (zero-new-connectors rule holds);
responds on every path.

**Topic v1.4** (`topics/GenerateTestPlan.mcs.yml`): the ask-id
question becomes an ask-reference question (String entity), followed
by the Power Fx classify group, a lookup section (its own
init-declared output variables, canvas-added flow node, and a
status-branched condition with a wiring-fault else — the v1.3
checkStatus pattern applied to the lookup contract), and the
unchanged confirm → generate → report body now gated behind
`Topic.StoryId > 0`. The generation contract
(`StoryId` → `Status`/`DraftUrl`/`GenSummary`) and both generation
flows are untouched — TestPlanGenCore, TestPlanGen (list-menu
parent), TestPlanGenAgentFlow, the AI Builder prompt, and every
sweep artifact are all unchanged.

Deploy delta for a v1.3 tenant: build `StoryLookupFlow` (§1d),
re-paste/push the four changed agent files, re-add BOTH canvas flow
nodes (§3 — re-pasting the topic drops the old generation node), run
smoke rows 1–2c and 7. No prompt, package, or schema changes.

| Piece | Version | Where |
|---|---|---|
| Agent file set (topic restructure + instructions + fallback + connection refs) | **TestPlanGenAgentVersion v1.4** | `testplangen/agent/TestPlanGenAgent/` |
| StoryLookupFlow (new; shape/contract reference) | v1.0 | `testplangen/flow/lookup_v1_0/definition.json` |
| StoryLookupFlow import package (authored re-cut; §1d caveat applies) | v1.0 | `testplangen/StoryLookupFlow_v1_0.zip` |
| Agent_Setup (§1d, §3 two-node bind, smoke rows 2–2c/7, limits, follow-on closure) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else (flows, packages, prompt, schemas) | unchanged | — |

| Date | Tenant | Rows passed (of 9) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.4 (build + paste pending) |

# TestPlanGen v2.2 — status-branched agent replies + live-transcript triage (agent v1.3)

Root-caused from the first live Teams transcript (2026-08-12, the
deployment that followed the v2.1 paste fix). Three symptoms, three
causes:

**S1 — a successful run reported "The flow didn't produce a draft",
with the child's entire JSON response
(`{"status":"ok","drafturl":...,"gensummary":...}`) dumped into the
reply — while the draft sat in the folder.** That JSON-in-GenSummary
payload is exactly the §1c ERROR respond's expression
(`take(string(coalesce(outputs('Run_a_Child_Flow')?['body'], ...)))`)
— `TestPlanGenAgentFlow`'s error respond executed on a run whose
child SUCCEEDED, so the topic received `Status: error` and correctly
took its non-ok branch. Tenant-side fix (the agent flow is built in
Copilot Studio, no repo artifact to patch): the success respond keeps
the default run-after and maps the three outputs from the child's
individual fields; the error respond runs ONLY after the child-flow
action has Failed / Timed out. `Agent_Setup.md` §1c now states this
run-after discipline and its §1 check exercises the agent flow
directly (success run must return `Status: ok` as three separate
fields, never `error` + JSON blob).

**S2 — messages the file set never authored**: "Shall I proceed?"
appended to the confirm, an elaborated guard message, a re-ask for
the story id immediately after a confirmation, and a second, styled
"✅ draft generated" summary contradicting the topic's own (wrong,
per S1) reply. All one cause: generative orchestration / message
rephrasing enabled on the live agent, contradicting
`settings.mcs.yml` (`generativeAIOrchestration: Classic`). Tenant-side
fix: restore classic orchestration + general knowledge OFF. Triage
(f) and smoke row 1's check now catch it (exactly ONE reply reports
the result).

**S3 — the topic lumped every non-ok status into one generic branch**
and interpolated the raw payload into prose, which Teams' auto-linking
mangled (the transcript's `?web=1[`-spliced URL). Topic v1.3
(`topics/GenerateTestPlan.mcs.yml`) branches on the full contract:
`ok` (draft link now a MARKDOWN link — one clickable link without
relying on bare-URL auto-linking), `guard` (relays the child's
message + qualifying-row coaching), `nodraft` (re-run + AI Builder
pane pointer), `error` (relays detail + run-history pointer), and an
else that names the wiring fault when Status is empty/unrecognized —
the S1 failure mode made self-diagnosing in chat. Paste-path
deployments re-paste the topic body and re-add the §3 flow node;
extension-path deployments re-push.

No flow, package, prompt, or schema changes — the
`StoryId` → `Status`/`DraftUrl`/`GenSummary` contract is unchanged.

| Piece | Version | Where |
|---|---|---|
| GenerateTestPlan topic (+ file-set headers) | **TestPlanGenAgentVersion v1.3** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup §§1c/1-check/3/5 (run-after discipline, triage e–f, smoke row 1) | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 6) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.3 (re-paste pending) |

# TestPlanGen v2.1 — declare the flow outputs at paste time (agent v1.2)

Live-deployment fix, found on the first paste-path (no VS Code
extension) deployment, 2026-08-12: pasting
`topics/GenerateTestPlan.mcs.yml` into the topic code editor failed
with "unrecognized identifier" on every `Topic.Status` /
`Topic.DraftUrl` / `Topic.GenSummary` reference. Cause: the v1.4-era
GuidParseError fix shipped the topic with the `InvokeFlowAction` node
commented out (flowId must be a real, environment-specific GUID) —
but that node's output bindings were the ONLY thing declaring those
three variables, so the checked-in YAML read variables that nothing
defines and the paste validator rightly rejected it. `Topic.StoryId`
and `Topic.Confirmed` never hit this because their Question nodes
declare them.

Fix: three `SetVariable` nodes (`initGenStatus` / `initGenDraftUrl` /
`initGenSummary`) in the confirmed-Yes branch, right after the
`ackRunning` message, each setting its variable to `=""`. The paste
now validates standalone; the §3 canvas-added flow node binds its
outputs to the same (now pre-existing) variables and overwrites the
empty strings at runtime, so behavior is unchanged. The initializers
stay in the topic permanently — they are the declaration, not
scaffolding. `Agent_Setup.md` §3 now says to place the flow node
between the initializers and the status condition and to pick the
existing variables in the output mapping instead of minting new ones.

No flow, package, prompt, or schema changes. Tenants that imported
the v1.1 topic via the VS Code extension path are unaffected
(behavior identical); paste-path deployments need the v1.2 topic
text.

| Piece | Version | Where |
|---|---|---|
| GenerateTestPlan topic (+ file-set headers) | **TestPlanGenAgentVersion v1.2** | `testplangen/agent/TestPlanGenAgent/` |
| Agent_Setup §3 wording | updated | `testplangen/agent/Agent_Setup.md` |
| Everything else | unchanged | — |

# TestPlanGen v2.0 — reference-functionality input lane (prompt v1.3)

Motivated by a live PE workflow (2026-08-12, the doc 1 revision that
followed `review/REVIEW_TestPlanGen_doc1_coverage.md`): three Pro
test plans (devtopia 3906/3910/3911, the Add-Event offset methods)
define the expected tool functionality — input methods, per-method
referent-population semantics — for an Experience Builder story, and
the pipeline had no sanctioned way to use them. Exemplars are
style/coverage ONLY ("never their feature-specific content" — the
hallucination guard), and the G6 fallback is same-surface by design,
so cross-surface functional grounding could only happen by hand in
the §4 review pass. v2.0 makes it a first-class, cited, guarded
generation input. This is a CONTRACT change (a fifth AI Builder
prompt input parameter), hence the major version.

**Prompt v1.3** (authored as
`review/patches/TestPlanGen_Prompt_v1_3.md`, promoted to
`prompts/TestPlanGen_Prompt.md` — supersedes v1.2 in-repo BEFORE its
pending paste; v1.2's enumeration-coverage rule + conditional
sections and v1.1's marker fix carry forward unchanged):

- Fifth input key **`ReferenceText`** — REFERENCE FUNCTIONALITY
  documents: test plans/design docs describing the expected behavior
  of this story's feature area, possibly on another surface. Unlike
  exemplars, the model MAY ground expected functional behavior on
  them (input methods, field-population semantics, validations),
  applied within the story's scope.
- Three guards: every reference-grounded statement's **Trace cites
  the reference document by title**; a cross-surface reference forces
  a **surface-parity [VERIFY]** item; **the story wins every
  conflict** (conflicts become [VERIFY] items). The lane supplies
  BEHAVIOR, never tool names — the tools rule is explicitly extended
  to it, so a Pro tool named in a reference never becomes a named
  widget in an EXB draft.
- New `<<<REFERENCE FUNCTIONALITY BEGIN/END>>>` input fence;
  untrusted-data and Trace rules extended to the fourth block. An
  empty lane (`(none)`) drafts exactly as v1.2 did.

**Both flows** (structural additions, mirrored in `flow/v1_0/` and
`flow/core_v1_0/`, both packages re-cut):

- `Config_gen`: `ReferenceCap` 12000, version stamp → v1.3.
- Three new top-level variables: `ReferenceText`, `ReferenceUrls`,
  `ReferenceCount`.
- **G5b — the surface split**: `If_testplan_neighbor` no longer
  slots every related Test Plan as an exemplar. Same-surface plans →
  `ExemplarUrls` (max 2, unchanged semantics); cross-surface plans →
  `ReferenceUrls` (max 2), stored as `{url, surface, title}` objects
  so the fetch can label each reference block with title + surface
  (what the prompt's surface-parity rule keys on). A same-surface
  plan arriving after both exemplar slots are full stays digest-only.
- **G7b — `For_each_reference`**: the G7 fetch pattern over the
  reference objects, capped at `ReferenceCap`.
- Prompt call binds the fifth key; `Story_meta` now runs after
  `For_each_reference`; `Gen_summary` adds `references=`.
- **No reference fallback query, deliberately**: cross-surface
  grounding is taken ONLY from documents RelatedRank actually linked
  to the story — a blind other-surface query would ground drafts on
  unrelated features. Stories without cross-surface related plans
  generate byte-for-byte as v1.9 would (`references=0`).

**Docs** — Setup §2 (five parameters + pane check), §3 G0/G0b/G5b/G7b/
G8/G13, §4 review runbook (reference-grounded cases get the
surface-parity check); Smoke suite v1.2: row 3 narrowed to
same-surface, new row 10 (reference lane end-to-end: `references≥1`,
cited Traces, surface-parity [VERIFY], no tool-name leakage).

Deploy (one window, replaces the still-pending v1.9 window; heavier
than a paste): (1) add the fifth input parameter **ReferenceText** to
the `LRS Test Plan Generation` AI Builder prompt and paste the v1.3
text; (2) apply the §3 flow additions in BOTH live flows — either
re-import the re-cut packages (post-import checks I1–I4) or designer-
build G0/G0b/G5b/G7b/G8/G13 per the guide — plus the earlier v1.8
marker edits if the tenant still runs v1.0 markers; (3) run the smoke
suite (now 10 rows) and record below. NEVER bump
`Config.PromptVersion` — nothing here changes the sidecar format or
reindexes the corpus.

To exercise row 10 with real data: upload the three Pro offset test
plans (3906/3910/3911) to the LocationReferencing Documents library,
let the nightly sweep index them, confirm doc 1's sidecar `related:`
list picks them up (shared keywords/issue ids), then run on doc 1.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.3** | `review/patches/TestPlanGen_Prompt_v1_3.md` → `prompts/TestPlanGen_Prompt.md` |
| Core child flow + package | **v2.0** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v2.0** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Setup + smoke docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` (suite v1.2, 10 rows) |
| Agent file set | unchanged (v1.1) | flow contract (`StoryId` → `Status`/`DraftUrl`/`GenSummary`) untouched |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 10) | TestPlanGenPromptVersion |
|---|---|---|---|
| — | — | — | v1.3 (paste pending) |

# TestPlanGen v1.9 — enumeration coverage + conditional sections (prompt v1.2)

Motivated by a coverage review of a live draft (2026-08-12,
`review/REVIEW_TestPlanGen_doc1_coverage.md`): the doc 1 draft
("Auto-Populate Referents for Event Edits") silently dropped the
attribute-table edit pathway its story names in the same acceptance
criterion as dynamic segmentation (CG-1), didn't exercise both event
types the story enumerates ("point and line" — CG-4), and had no home
for the story's Automation and Documentation slides (CG-2/CG-3). All
three are prompt-design faults, not one-off model faults:

- **RC-1** — the grounding rules require every case to trace to the
  story but never the converse; enumerated items ("Table"; "point and
  line") could silently collapse into a neighboring case.
- **RC-2** — the fixed five-section draft shape gave automation and
  documentation content nowhere to go.
- **RC-3** — "prefer fewer, well-grounded cases" pushed toward
  consolidation exactly when an enumeration-heavy story needs
  expansion.

The fix, **prompt v1.2** (authored as
`review/patches/TestPlanGen_Prompt_v1_2.md`, promoted to
`prompts/TestPlanGen_Prompt.md` — supersedes v1.1 in-repo BEFORE its
pending tenant paste; v1.1's marker fix is carried forward unchanged):

- **ENUMERATION COVERAGE grounding rule** — every workflow, edit
  pathway, input method, or event/geometry type the story enumerates
  must be exercised by at least one case (own case or explicit
  parameterization); grouped items in one statement are separate
  pathways; untestable items become Open Questions entries. The
  case-count guidance now explicitly yields to it.
- **Two CONDITIONAL draft sections** — `## Automation Notes` and
  `## Documentation Impacts`, between Negative Tests and Open
  Questions, emitted only when the story carries such content and
  omitted entirely (no empty heading) otherwise, so drafts for
  stories without those slides are unchanged. Bullets carry the same
  mandatory **Trace:** line as test cases.
- Output markers, input keys, and fences unchanged from v1.1 — the
  G9 slice and its literals are untouched.

**Both flows** — `Config_gen.TestPlanGenPromptVersion` → v1.2 in
`flow/v1_0/` and `flow/core_v1_0/`; both packages re-cut (the §
"authored, not exported" re-cut mechanics: `definition.json` swapped
into the `Microsoft.Flow/flows/<guid>/` entry, manifests and maps
untouched).

**Docs** — Setup §2's pane check and §4's review runbook cover the
conditional sections and the enumeration-coverage review step; Smoke
suite bumped to v1.1: row 1's section check rephrased (five CORE
sections + conditionals iff story content), new row 9 pinned to doc 1
as the enumeration-coverage regression fixture.

Deploy (one window, replaces the still-pending v1.8 window): paste the
v1.2 prompt into `LRS Test Plan Generation` (instead of v1.1), edit
the `Config_gen` version stamp to v1.2 in BOTH live flows — plus the
v1.8 `Draft_begin` / `Draft_end` literal edits if the tenant still
runs v1.0 markers — then run the smoke suite (now 9 rows) and record
below. NEVER bump `Config.PromptVersion` — nothing here changes the
sidecar format or reindexes the corpus.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.2** | `review/patches/TestPlanGen_Prompt_v1_2.md` → `prompts/TestPlanGen_Prompt.md` |
| Core child flow + package | **v1.9** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v1.9** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Setup + smoke docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` (suite v1.1, 9 rows) |
| Everything else | unchanged | — |

| Date | Tenant | Rows passed (of 9) | TestPlanGenPromptVersion |
|---|---|---|---|
| — | — | — | v1.2 (paste pending) |

# TestPlanGen v1.8 — sanitizer-safe output markers (prompt v1.1)

Root-caused from a live failure (2026-08-12): every generation run
terminated `NoDraftMarkers` — all actions green, complete draft in the
reply — because AI Builder sanitizes HTML-tag-like sequences out of
the prompt REPLY. The output sentinels `<<<DRAFT BEGIN>>>` /
`<<<DRAFT END>>>` each contain a tag-shaped inner run
(`<DRAFT BEGIN>` / `<DRAFT END>`) that the sanitizer removed, so
`Gen_text_raw` arrived bracketed by bare `<<>>` stubs, the G9 slice
found no markers, and the flow failed closed — exactly as designed,
on every run. TestPlanGen was the first prompt to use angle-bracket
sentinels in the OUTPUT direction; the JSON prompts use `<<<...>>>`
only as input fences, which travel flow→model and are never
sanitized — which is why five days of DocIndex/curation history never
surfaced this.

The fix — square-bracket output sentinels, same lengths, so the slice
arithmetic (`Draft_body`'s hardcoded 17) is untouched:

| | old | new |
|---|---|---|
| begin (17 chars) | `<<<DRAFT BEGIN>>>` | `[[[DRAFT BEGIN]]]` |
| end (15 chars) | `<<<DRAFT END>>>` | `[[[DRAFT END]]]` |

- **Prompt v1.1** — output markers swapped in the instruction and the
  worked example; header documents the sanitizer rationale. Input
  fences (`<<<STORY TEXT BEGIN>>>` etc.) unchanged. Authored as
  `review/patches/TestPlanGen_Prompt_v1_1.md`, promoted to
  `prompts/TestPlanGen_Prompt.md`.
- **Both flows** — `Draft_begin` / `Draft_end` literals and
  `Config_gen.TestPlanGenPromptVersion` (→ v1.1) updated in
  `flow/v1_0/` and `flow/core_v1_0/`; both packages re-cut.
  `Terminate_no_draft`'s message is unchanged (it names the markers
  generically).
- **Docs** — Setup §2/§G0/§G9 and Smoke rows 5–6 carry the new
  literals; Smoke row 6's parse probe now doubles as the regression
  check for this bug (a probe reply pasted with the OLD markers must
  fail closed).

Deploy (designer edits + paste, one window): re-paste the v1.1 prompt
into `LRS Test Plan Generation`, edit `Draft_begin` / `Draft_end` and
the `Config_gen` version stamp in BOTH live flows (core + standalone),
then run the smoke suite and record below. NEVER bump
`Config.PromptVersion` — nothing here changes the sidecar format or
reindexes the corpus.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.1** | `review/patches/TestPlanGen_Prompt_v1_1.md` → `prompts/TestPlanGen_Prompt.md` |
| Core child flow + package | **v1.8** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v1.8** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Setup + smoke docs | updated | `TestPlanGen_Setup.md`, `TestPlanGen_Smoke.md` |
| Everything else | unchanged | — |

# TestPlanGen v1.7 — empty-release exemplar fix + visible menu-path guard

Two review fixes (`review/REVIEW_v2_5.md` DX-7, DX-12), both applied to
the live flows 2026-08-11.

**DX-7 — a blank story release no longer "matches" release-less plans.**
`Filter_release_match` treated empty-equals-empty as a release match, so
a story with no `TargetRelease` release-matched every same-surface plan
that also lacked one — typically the oldest, least-curated plans — and
those won outright over newer exemplars. The filter now requires the
STORY release to be non-empty; a blank release falls through to
`Exemplar_rows`' newest-two default. Both definitions carry it
(`flow/core_v1_0/`, `flow/v1_0/`), both packages re-cut, Setup §3
updated.

**DX-12 — a guard rejection from the list menu fails visibly again.**
Post-split, the child Responds `Status: guard` and Terminates Succeeded,
so a PE running the Automate entry on a non-story row saw a successful
run and no draft — no failure signal, no alert. The thinned parent (a
hand edit, no package — Agent_Setup §1b) gains `If_child_ok`: child
`Status` ≠ `ok` → Terminate Failed with the child's `GenSummary` as the
message, restoring pre-split behavior for the menu path only. The agent
path is untouched (its topic relays non-ok statuses conversationally).
Agent_Setup §1a/§1b and smoke row 2 updated to match.

| Piece | Version | Where |
|---|---|---|
| Core child flow + package | **v1.7** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v1.7** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` |
| Agent_Setup §1a/§1b + smoke row 2 | updated | `testplangen/agent/Agent_Setup.md`, `TestPlanGen_Smoke.md` |
| Everything else | unchanged | — |

# TestPlanGen v1.6 — encode the DraftUrl so the chat link survives Teams

One-expression fix from the full-codebase review (`review/REVIEW_v2_5.md`
DX-1). `TestPlanGenCore`'s `Draft_url` compose concatenated
`SiteUrl + DraftFolder + '/' + Draft_name` with `DraftFolder`'s literal
spaces (`/Shared Documents/Test Plan Drafts`) left unencoded. The agent
relays `DraftUrl` verbatim (`Draft ready: {Topic.DraftUrl}`), and Teams
auto-linking terminates a URL at the first space — so the agent's primary
deliverable rendered as a clickable `.../lrsworkspace/Shared` (404) plus
trailing text.

`Draft_url` is now wrapped in a space-encode:

    replace(concat(outputs('Config_gen')?['SiteUrl'],
      outputs('Config_gen')?['DraftFolder'], '/',
      outputs('Draft_name')), ' ', '%20')

Whole-string encoding is safe: `SiteUrl` and `Draft_name`
(`TestPlanDraft__doc{N}__{timestamp}.md`) cannot contain spaces — the
folder's are the only ones.

Scope: the CORE child flow only. The monolithic list-menu flow
(`flow/v1_0`) never builds a URL — its PE finds the draft in the folder —
and the thin parent and Copilot topic relay the child's output untouched,
so nothing else changes. The `Status`/`DraftUrl`/`GenSummary` contract is
unchanged (same field, encoded value).

Applied to the live `TestPlanGenCore` flow 2026-08-11 (designer edit, one
expression). `flow/core_v1_0/definition.json` and
`TestPlanGenCore_v1_0.zip` carry the fix; `TestPlanGen_v1_0.zip` is
untouched. `Agent_Setup.md`'s §1b check and smoke row 1 now require
clicking the link from the Teams chat — the check that would have caught
this at deploy time.

Also in v1.6 — second-granular draft names (REVIEW_v2_5.md DX-8):
draft filenames were minute-granular (`yyyyMMdd-HHmm`), so two runs on
the same story inside one minute silently overwrote — a PE
double-clicking the menu entry, or the menu and agent paths racing,
violated the "a re-run must never clobber a draft" rule. The timestamp
is now `yyyyMMdd-HHmmss` in all three sites: `Draft_name` (core),
`Save_draft`'s inline filename (`flow/v1_0`), and Setup §3 G11.
Applied to the live `TestPlanGenCore` flow 2026-08-11 alongside the
URL fix; both packages re-cut.

| Piece | Version | Where |
|---|---|---|
| Core child flow + package | **v1.6** | `testplangen/flow/core_v1_0/`, `TestPlanGenCore_v1_0.zip` |
| Standalone flow + package | **v1.6** | `testplangen/flow/v1_0/`, `TestPlanGen_v1_0.zip` (HHmmss only — it builds no URL) |
| Agent_Setup smoke wording + Setup G11 | updated | `testplangen/agent/Agent_Setup.md`, `testplangen/TestPlanGen_Setup.md` |
| Everything else | unchanged | — |

# TestPlanGen v1.5 — stop equating sidecar doc_id with the item id

Text-only release, companion to flow v2.5 (`flow/v2_5/CHANGES.md`).
The agent front-end's instructions (`agent/TestPlanGenAgent/agent.mcs.yml`)
and the `askStoryId` question (`topics/GenerateTestPlan.mcs.yml`) both
claimed the Doc Index item id "is also the doc_id in the sidecar and
the docNN in the filename". That was never true: the sweep stamped
sidecars with the source library file's item id — a different id
space — so a user who obeyed the prompt and typed a sidecar's `doc_id`
sent `Get_story_row` to an unrelated row (observed: doc_id 1008 →
wrong document; the guard rejects it, or worse, a different Indexed
User Story row grounds the draft).

Both texts now direct users to the Doc Index list's ID column as the
only always-safe source, with the accurate caveat: sidecars extracted
at `prompt_version` v1.7+ (flow v2.5) do carry the matching number;
older sidecars don't until the backfill renames them.

No flow, package, prompt, or schema changes — the generation flows
already used the row id correctly end to end (`Get_story_row`, the
`StoryMeta` `doc_id:` line, the `TestPlanDraft__doc{ID}` name).
Deploy: re-import or hand-edit the agent's Instructions and the
topic's question text in Copilot Studio; re-run smoke row 1
(`TestPlanGen_Smoke.md`) plus one deliberate wrong-id probe (feed a
pre-migration sidecar's `doc_id`; expect EITHER the guard message OR
a draft whose banner names the wrong story — both prove the id was
misdirected, since the stale id can also collide with a different
Indexed User Story row — then success with the list's ID).

| Piece | Version | Where |
|---|---|---|
| Agent instructions + topic text | **TestPlanGenAgentVersion v1.1** | `testplangen/agent/TestPlanGenAgent/` |
| Everything else | unchanged | — |

(Recorded post-release: this edit shipped without bumping the
`TestPlanGenAgentVersion` headers in the file set — they still read
v1.0 while the text had changed. The headers, this table, and the
README row now all say v1.1; tenants deployed from the v1.0 file set
should re-paste per the deploy note above.)

# TestPlanGen v1.4 — import package for the agent flow (TestPlanGenAgentFlow)

`testplangen/TestPlanGenAgentFlow_v1_0.zip` packages the §1c agent
parent, completing the import-driven set: v1.2 the standalone flow,
v1.3 the child, v1.4 the agent front door. Payload:
`testplangen/flow/agent_v1_0/definition.json` — a 3-action flow with
zero connectors (built-ins only; the package carries no connector
resources and its maps are empty): "When an agent calls the flow"
trigger (Number input `StoryId`), Run a Child Flow → TestPlanGenCore,
and two Respond-to-the-agent actions (success path relaying the
child's `Status`/`DraftUrl`/`GenSummary`; failure path responding
`Status: error` with the child's error detail). Only §1b — thinning
the user's already-bound list flow in place — remains a hand edit, by
design.

Two caveats beyond the standing authored-not-exported convention:

- **The child reference always needs a re-pick.** Run a Child Flow
  binds by environment-specific workflow id; the package ships the
  Core package's id, which never matches the id minted when Core was
  imported. Post-import: open the node, re-pick TestPlanGenCore,
  confirm `StoryId` maps.
- **The trigger shape is the least-verified in the set.** "When an
  agent calls the flow" is authored as a `Request`/`kind: Skills`
  trigger (its documented peek-code sources were unreachable at
  authoring time). If import rejects the package, §1c's four-action
  hand build is the fallback; record the rejection here.

| Piece | Version | Where |
|---|---|---|
| Agent-flow import package | **v1.0** | `testplangen/TestPlanGenAgentFlow_v1_0.zip` |
| Agent-flow definition (payload) | v1.0 | `testplangen/flow/agent_v1_0/definition.json` |
| Everything else | unchanged | — |

Import record:

| Date | Tenant | Imported cleanly | Child re-picked | Trigger verified |
|---|---|---|---|---|
| 2026-08-10 | esriis (lrsworkspace) | yes | yes — child node rebuilt, responds re-linked | **no** — flow never surfaced as an addable agent flow/tool in Copilot Studio |

Docs note (post-v1.4, live-deployment result): the authored
trigger/respond shapes did not render as recognized "When an agent
calls the flow" / "Respond to the agent" cards on the live tenant, so
Copilot Studio never listed the imported flow — the documented risk
realized. **The package is superseded as a deployment path**: §1c is
now built from inside Copilot Studio (Tools → New agent flow →
pre-loaded recognized cards → four-action body), which also
auto-registers the flow as a tool. The zip and its payload stay in
the bundle as a shape/contract reference, per the provenance
convention.

Docs note (post-v1.4, live-deployment feedback): the GenerateTestPlan
topic originally shipped an active `InvokeFlowAction` node with a
`flowId: REBIND-AT-IMPORT` placeholder — the topic code editor
validates `flowId` as a GUID and rejects the paste (GuidParseError).
The topic file now ships the flow node commented out with add-via-
canvas instructions, and `Agent_Setup.md` §3 is retitled "Add and
bind the flow node" to match. Found during the first live agent
deployment; agent file set still pre-first-import on any other
tenant, so TestPlanGenAgentVersion stays v1.0. *(True when written;
the v1.5 correction above later bumped the file set to v1.1 — that
note, not this one, states the current version.)*

---

# TestPlanGen v1.3 — import package for the child flow (TestPlanGenCore)

`testplangen/TestPlanGenCore_v1_0.zip` packages the agent-ready child
flow, closing the by-hand gap in `testplangen/agent/Agent_Setup.md`
§1a. Its payload, `testplangen/flow/core_v1_0/definition.json`, is a
**programmatic transform of the v1.0 flow definition** (not a second
authoring): trigger swapped to "Manually trigger a flow" with a
Number input `StoryId` (`triggerBody()?['number']`), the guard and
no-draft Terminates converted to Respond-with-Status (`guard` /
`nodraft`) followed by Terminate Succeeded, the draft filename minted
once in a `Draft_name` Compose with `Draft_url` derived from it, and
a success `Respond_ok` returning `Status`/`DraftUrl`/`GenSummary` —
the contract the agent topic and 1c parent bind to. Catch still
Terminates Failed (a real failure should fail the caller). 63
actions; same two connectors; same authored-not-exported caveats and
I-checks as v1.2 (prompt `recordId` placeholder, list re-pick on
foreign GUIDs), minus the trigger caveat — a button trigger has no
list binding. Post-import: add the flow to a solution and set
embedded run-only connections before wiring 1b/1c (child flows are
solution-only).

| Piece | Version | Where |
|---|---|---|
| Child-flow import package | **v1.0** | `testplangen/TestPlanGenCore_v1_0.zip` |
| Child-flow definition (payload) | v1.0 | `testplangen/flow/core_v1_0/definition.json` |
| Everything else | unchanged | — |

---

# TestPlanGen v1.2 — import package for the flow

The flow now ships as an importable package,
`testplangen/TestPlanGen_v1_0.zip` (My flows → Import → Import
package (Legacy)), alongside the build guide. The package payload,
`testplangen/flow/v1_0/definition.json`, is checked in beside it —
byte-identical to the zip's copy, the `flow/` provenance convention —
implementing `TestPlanGen_Setup.md` §3's G0–G13 exactly (58 actions:
trigger + Config/variables + Try scope with guard, sidecar fetch,
related-line slice, neighbor digest loop, exemplar fallback query,
exemplar fetch loop, prompt call, fail-closed marker slice, banner,
draft write + Catch scope + Gen_summary).

**Authored, not exported.** Like the `flow/` zips, this package is a
re-cut of the sweep's package skeleton (manifest/maps minus the Excel
connector — this flow runs no Office Scripts), but its
`definition.json` was written from the setup guide rather than
exported from a built flow, and two bindings intentionally need
post-import work (guide §3 Path A, checks I1–I4): the AI Builder
`recordId` ships as a placeholder (the prompt is minted per-tenant),
and the "For a selected item" trigger shape should be
designer-verified on first import — if the portal rejects the package,
Path B (build by hand) is the unchanged fallback and the rejection
gets recorded here. Once a tenant has imported and smoked it, an
export from the live flow supersedes the authored file (re-cut
mechanics: swap `definition.json` into the zip's
`Microsoft.Flow/flows/<guid>/` entry; manifest and maps are stable).

Import validation and the §5 smoke suite are the real gate — record
the first import here:

| Date | Tenant | Imported cleanly | I1–I4 done | Smoke rows passed (of 8) |
|---|---|---|---|---|
| — | — | — | — | — |

| Piece | Version | Where |
|---|---|---|
| Flow import package | **v1.0** | `testplangen/TestPlanGen_v1_0.zip` |
| Flow definition (provenance) | v1.0 | `testplangen/flow/v1_0/definition.json` |
| Prompt / setup guide / smoke / agent file set | unchanged (v1.0 / v1.1) | `testplangen/` |
| Everything else in the bundle | unchanged | — |

Scope note: the package carries the **standalone v1.0 flow** (list-
menu trigger, full body). The v1.1 child-flow trio cannot ship in a
legacy flow package — child flows exist only inside Dataverse
solutions — so agent deployments still apply
`testplangen/agent/Agent_Setup.md` §1 after importing, exactly as
after a hand build.

Docs note (post-v1.2, pre-first-deployment): the Q&A agent
(`agent/QA_Agent_Setup.md`) is OPTIONAL and independent of this
component — nothing in TestPlanGen depends on it. All Q&A-agent
references across `testplangen/` were made conditional to match: the
generator agent's redirect messages tolerate its absence, flow-smoke
row 7 is marked skip-until-deployed (the non-ingestion guarantee is
structural — drafts sit outside the sidecar library regardless), and
agent-smoke row 5 is clarified to test this agent's refusal, not the
Q&A agent. The agent file set was amended before any tenant imported
it, so TestPlanGenAgentVersion stays v1.0.

---

# TestPlanGen v1.1 — importable Copilot Studio front-end

The queued "Copilot Studio front-end" follow-on, delivered as an
**importable agent file set**: `testplangen/agent/TestPlanGenAgent/`
defines the **LRS Test Plan Generator** agent (identity +
instructions, settings, connection references, and two adaptive-dialog
topics) for import via the Copilot Studio VS Code extension —
clone-overlay-push — with a documented portal-paste fallback for
schema drift. The agent is a thin front door: it collects a story's
Doc Index item id in chat, confirms, invokes the generation flow, and
relays the draft location with the unreviewed/[VERIFY] reminder. NO
knowledge sources, general knowledge OFF — corpus questions redirect
to LRS Doc Index Q&A; the agent never drafts content in chat.

Because an agent invokes flows only through an agent-flow trigger and
a flow has exactly one trigger, v1.1 also specifies the **child-flow
restructure** (`testplangen/agent/Agent_Setup.md` §1): the v1.0 flow
body becomes `TestPlanGenCore` (manual trigger, input `StoryId`; the
two in-Try Terminates become Respond-with-Status so callers can relay
guard/parse messages), with two thin parents — the existing list-menu
`TestPlanGen` (Automate-menu entry unchanged) and the new
`TestPlanGenAgentFlow` (agent trigger → child → Respond
`Status`/`DraftUrl`/`GenSummary`, error path included). One body, two
front doors, no duplication.

| Piece | Version | Where |
|---|---|---|
| Agent definition file set | **v1.0** | `testplangen/agent/TestPlanGenAgent/` |
| Agent import + wiring guide (incl. child-flow restructure, 6-row smoke suite) | v1.0 | `testplangen/agent/Agent_Setup.md` |
| Generation prompt / flow guide / smoke suite | unchanged (v1.0) | `testplangen/` |
| Sweep flow / scripts / prompt / schemas / sidecars / Q&A agent / curation | unchanged | — |

## v2.30 — draft names follow the story sidecar's stem (2026-09-05; local job v1.9)

Sidecar_Format_Plan phase 1b removed the doc id from sidecar
filenames. Drafts now share the story sidecar's stem:
`<stem>--draft-<yyyymmdd-hhmm>.md` (e.g.
`4975-append-routes-line-order-check--draft-20260905-2300.md`) instead
of `TestPlanDraft__doc{ID}__{stamp}.md`. The `--auto` idempotency
scan keys on the `--draft-` token and maps the stem back to the row
through the run's Doc Index snapshot; legacy `TestPlanDraft__doc{ID}__`
files still count as covered. No prompt change. Gate:
`check_testplangen.py` 141/141 on the new names.

## Runbook deltas (v1.1)

- **TestPlanGenAgentVersion: v1.0** — the agent file set bumps like
  AgentInstructionsVersion: edit the files under
  `testplangen/agent/TestPlanGenAgent/`, re-import (or re-paste),
  re-run the §5 smoke suite, record here. NEVER bump
  `Config.PromptVersion`; a TestPlanGenPromptVersion bump is
  independent too (prompt and agent version separately).
- **The flow contract**: input `StoryId`, outputs
  `Status`/`DraftUrl`/`GenSummary` bind the topic to the flows —
  change one side, change both, re-smoke rows 1 and 3.

Live-tenant smoke run (fill in at deployment; suite =
`testplangen/agent/Agent_Setup.md` §5):

| Date | Tenant | Rows passed (of 6) | TestPlanGenAgentVersion |
|---|---|---|---|
| — | — | — | v1.0 |

---

# TestPlanGen v1.0 — user story → reviewed test-plan draft

First release of the test-plan-generation component: an on-demand
Power Automate flow, **TestPlanGen**, run from the Doc Index list's
Automate menu on a selected User Story row. It gathers the story's
sidecar, the neighbors named by the sidecar's machine-readable
`related:` line (adjacent stories become a context digest; related
Test Plans become style/coverage exemplars, with an exact
`DocKind eq 'Test Plan'` query as fallback), makes ONE AI Builder
call, and writes a timestamped markdown draft to
**Shared Documents/Test Plan Drafts/** — outside the LRS Doc Index
library, so the Q&A agent never ingests unreviewed drafts. A PE
reviews (every case carries a mandatory Trace line; gaps surface as
`[VERIFY]` items), finalizes into the team's normal format, and
uploads to the source library — where the nightly sweep indexes the
finished plan and links it back to its story. This is the system's
first generative surface; it closes its loop entirely through the
existing pipeline.

| Piece | Version | Where |
|---|---|---|
| Generation prompt | **v1.0** | `testplangen/TestPlanGen_Prompt_v1_0.md` |
| Build + deploy guide | v1.0 | `testplangen/TestPlanGen_Setup.md` |
| Smoke suite | v1.0 | `testplangen/TestPlanGen_Smoke.md` |
| TestPlanGen flow | built from the guide (no definition.json — new flows have no package skeleton; provenance export queued) | — |
| Sweep flow / scripts / prompt / schemas / sidecars / agent / curation | unchanged (v2.4 / v1.2 / v1.0 / v1.0) | — |

## What shipped

- **The prompt** — StoryMeta + StoryText + RelatedDigest +
  ExemplarText in; a complete markdown draft out, between
  `<<<DRAFT BEGIN>>>` / `<<<DRAFT END>>>` markers. Marker-sliced
  markdown is a deliberate, documented deviation from the F3 JSON
  brace-slice: JSON-escaping a multi-page document makes escaping
  errors the dominant failure mode, and the marker slice is the same
  `indexOf`/`lastIndexOf` logic with different sentinels — failing
  CLOSED (no markers → Terminate, nothing written) where the JSON
  prompts degrade to empty. Grounding rules: every case traces to a
  story statement or exemplar pattern (mandatory **Trace:** lines),
  tools never invented, surface/release copied verbatim, missing
  info becomes `[VERIFY]` items. DocIndex v1.2 untrusted-data
  posture over all three document-derived inputs, marker-fenced at
  the prompt's end.
- **The flow** — "For a selected item" on Doc Index: guard (Indexed
  User Story with a sidecar), sidecar fetch, line-slice parse of the
  `related:` JSON (degrades to no neighbors, never errors),
  per-neighbor digest lines (capped, quote-stripped — the
  `Why_capped` treatment), exemplar selection preferring related
  Test Plans with an exact-query fallback (the first delivered
  instance of the "exact list query" follow-on queued in
  `agent/QA_Agent_Setup.md`), capped context assembly, one prompt
  call, fail-closed marker slice, provenance banner (with
  story-truncation flag), timestamped draft write, trimmed Catch
  scope, F11-style `Gen_summary`. Read-only over every list; the
  single file write lands outside both the sweep's source library
  and the agent's knowledge source.
- **Review loop** — draft → PE review (Trace verification, `[VERIFY]`
  resolution) → finalize to pptx/docx → upload to the source library
  → nightly sweep indexes it as a Test Plan and RelatedRank links it
  back to the story. No new cataloging surface; misfiled drafts are
  inert (`.md` has no extraction lane).
- **Deferred by decision** — a Copilot Studio conversational front
  end (rides the queued list-query actions; the flow stays the
  single implementation), provenance export, docx conversion of the
  draft, and the IssueRefs-driven coverage matrix once flow #2
  exists. All specified in the guide's Queued follow-ons.

## Install order

`testplangen/TestPlanGen_Setup.md` §§1–3 in order: drafts folder →
prompt → flow, then the §5 smoke suite before first real use. No
schema work, no script pastes, no sweep edits — nothing to
re-import.

## Runbook deltas

- **TestPlanGenPromptVersion**: bumps like CurationPromptVersion —
  new `testplangen/TestPlanGen_Prompt_vX_Y.md`, re-paste into
  AI Builder, re-run the smoke suite, record here. NEVER bump
  `Config.PromptVersion` for this — nothing in test-plan generation
  changes the sidecar format or reindexes the corpus.
- **Drafts folder**: `Shared Documents/Test Plan Drafts/`,
  timestamped files, deleted by hand after finalize/abandon; a
  re-run never overwrites an existing draft.

## Verification record

Corpus-neutral by construction: no scripts, no sweep flow change, no
sidecar format change, no schema change, no agent-instructions
change — the local harness (`check_format.py` / `check_related.py` /
`render_sample.py`) is unaffected; see agent v1.0's record in
`agent/CHANGES.md` for the current PASS baseline (2026-08-10).

Live-tenant smoke run (fill in at deployment; suite =
`testplangen/TestPlanGen_Smoke.md`):

| Date | Tenant | Rows passed (of 8) | TestPlanGenPromptVersion |
|---|---|---|---|
| — | — | — | v1.0 |

---

**Addendum (2026-08-11, r2 PV-1):** `TestPlanGen_v1_0.zip` and
`TestPlanGenCore_v1_0.zip` were re-cut with the connection
`displayName` (a personal work email) scrubbed from their
`manifest.json`; `definition.json` payloads byte-identical, import
behavior unaffected (`TestPlanGenAgentFlow_v1_0.zip` never carried
the email). Originals in git history.
