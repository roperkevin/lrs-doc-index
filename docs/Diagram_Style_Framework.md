# Diagram style framework (SlideFigures v2.4)

How every slide diagram in the corpus is drawn. One visual language, so 500
documents stop looking like 500 decks.

## One figure per diagram, not per slide (v1.1)

A slide often carries several diagrams — an input row and a result row, or
two cases side by side. Graphic primitives (connectors, shape-lines, nodes,
freeform paths) cluster by union-find over their bounding boxes: boxes merge
while the clear air between them is under **90 px horizontally and 150 px
vertically**, so the stacked bands of one diagram stay together and genuinely
separate drawings split. Loose labels then join the nearest cluster within
60 px (labels never bridge two clusters into one); a label near nothing is
debris and is dropped. Each qualifying cluster renders as its own figure:

- a slide's **only** figure keeps the v1.0 name `slideN.svg`, so
  `--reformat` overwrites in place;
- siblings are `slideN_fig1.svg`, `slideN_fig2.svg`, … in top-to-bottom,
  left-to-right order, and their titles say which of how many
  (*"Slide 4 route diagram (2 of 3)"*).

Since v1.3 this holds in the **redraw lane** too: the case's input state
and its output state are two diagrams, so they are the sibling pair
`slideN_fig1.svg` (before the split) and `slideN_fig2.svg` (after, with
the legend) rather than one stacked figure.

## Table anchors (v1.3)

Every figure carries `anchor`: the first row of the slide table it sits
with, as cell texts (`[]` when the slide gives it no table). The sweep
inserts each anchored figure directly **before** that table in the
extracted markdown — the slide's own layout, where a diagram sits with
the table stating its numbers — and falls back to directly after the
slide heading for unanchored figures, in renderer order either way.
Drawn and traced figures anchor by **geometry**: the table sharing the
cluster's vertical band (largest overlap wins), else the nearest table
starting below the cluster's middle; a table wholly above never anchors,
and each table anchors at most one figure. Redrawn figures anchor by
**meaning**: the input figure to the table its measures were read from,
the output figure to the result table (the other measure-bearing table
of 3+ columns, searched from the slide's end).

## Beyond rulers: the graph lane (v1.1)

Rulers stay the primary language, but decks also draw **node diagrams** —
boxes and ovals joined by connectors — and freeform scribbles. These render
in the same framework:

| Element | Rendering |
|---|---|
| Preset shape with a visible fill/outline | A **node**: box (one 7 px corner radius for the whole corpus), ellipse or diamond family; palette-**tinted** fill and palette stroke from the source colour by the same hue-family rule; label centred, wrapped to two lines |
| Line drawn as a shape (`prstGeom` line/connector) | Same as a connector — decks use both interchangeably |
| Connector between nodes | A slate **edge** (1.8 px), palette-mapped when the source coloured it; head/tail arrowheads carried over |
| Freeform `custGeom` path | Re-emitted as an SVG path (`moveTo/lnTo/cubicBezTo/quadBezTo/close`); closed+filled paths get a palette tint |
| Dash patterns | Normalised to two canonical dashes (dashed / dotted) — one rhythm across the corpus |

A shape counts as a node only when the deck made it **visible** (explicit
fill or outline, or a themed style reference) — plain textboxes have
neither, which is what keeps prose slides silent. A cluster qualifies as a
graph figure with 2+ nodes joined by at least one connector or path, or 2+
freeform paths; theme accent fills map to palette slots by accent index
(accent1→cool … accent6→muted), as deterministic as the hue rule.

**Title boxes are not nodes (v1.4).** The decks frame their case text in
an outlined box above the drawing; visible or not, a shape holding long
prose (>56 chars) or a long numbered case line ("9. Merge Option
disabled, coincident events that …") is the slide's title, not a diagram
node, and is dropped from the figure. Its text already reaches the
sidecar body — and, via the sweep's case headings, the section heading —
through the extractor, so drawing it would duplicate the heading into
the picture.

## Layout normalisation in the graph lane (v1.2)

Hand-placement is not layout — the rule the rulers have always applied now
covers nodes and their connectors:

- **Grid snap.** Near-equal node sizes (±20% buckets) equalise to the group
  median, resized about the centre; then rows and columns whose centres
  jitter within tolerance (0.45 × the median node extent) snap to one
  shared centre. Sizes first — equalising is centre-preserving, so it
  cannot undo a snap.
- **Connector routing.** An edge endpoint on (or dragged near — within
  16 px of) a node re-anchors to the node's boundary at the exact point
  where the ray toward the other end exits the shape; rect, ellipse and
  diamond each have a closed form. An edge whose source was a *bent*
  connector routes orthogonally between the facing node sides with elbows
  at the midline.

## Legends (v1.2)

Colour carries meaning in these decks, so a figure whose extents use two or
more palette colours states what each one is: a butt-capped swatch in the
extent's own colour plus a label — the id the slide put on that bar when
one exists, a letter otherwise. The redraw lane, which knows the numbers,
states each extent's measure range (`E7 0–20` / `E7 20–40`). Swatches use
their own `swatch` class, never `event`, so nothing that measures event
extents ever counts a legend.

## Rotation (v1.2)

`xfrm rot` is honoured. Line endpoints and freeform points rotate exactly
about the shape centre. Nodes normalise where they can: a near-quarter turn
becomes an axis-aligned w/h swap and a near-half turn is dropped (symmetric
shapes show no difference) — in both cases the label stays horizontal.
Only a genuinely oblique angle survives to a real `rotate()`, applied to
the shape outline alone, because rotated text is unreadable.

## Raster tracing tier (v1.2)

A slide whose only content is a pasted **PNG** — no vector drawing, no
tables for the redraw — gets a last-resort tracing tier. The picture is
decoded in-script (its zlib stream is two header bytes plus the same
RFC 1951 deflate the zip layer already inflates) and its axis-aligned
strokes are vectorised: colour-aware run extraction separates a route from
the extent drawn over it, stroke-shaped runs stack into bars, same-colour
bars whose gap is covered by an overlay merge back into one stroke. The
result is the same `FRaw` lines the vector path produces, run through the
identical classify/normalise pipeline — a traced figure is
indistinguishable in style from a drawn one. It renders only when the
trace passes a gate *stricter* than the vector one (a route **and** 3+
ticks); anything busier — photos, more than 48 strokes — stays silent,
and the alt text says the figure is traced and approximate. Since v2.0
screenshots no longer fall to this tier at all: the wireframe tier (see
above) screens every pasted picture, so the order of preference is real
vectors, then the slide's own stated data, then the wireframe for
interface screenshots, then tracing for what remains. Since v2.4 the
wireframe tier is ADDITIVE, not a fallback: a screenshot pasted next to
a drawn diagram (or beside the tables that drive a redraw) renders as
its own sibling figure — numbered into one sequence with the diagram's
figures — where it used to be silently skipped. Only the trace tier
stays a last resort for picture-only slides, since tracing a picture on
a slide that already drew its diagram would duplicate the diagram.

## UI screenshots: the wireframe tier (v2.0, fidelity v2.1)

Half the corpus's pasted pictures are not route diagrams — they are
screenshots of the app's own interface: a search form, a results list, an
attribute table. The trace tier rightly refused them ("busier than a
diagram is a screenshot"), so they stayed captions. They are now **redrawn
as standardized wireframes**, one visual language for every screenshot in
the corpus:

| Interface element | Rendering |
|---|---|
| Bordered region holding other elements | **Panel** — white fill, muted 1.4px stroke, the corpus corner radius (7px) |
| Wide, short bordered box holding at most one text row (rounded corners assemble since v2.4 — a 5px radius used to shatter a field into stray lines) | **Input field** — white fill, muted 1.1px stroke, 4px corners |
| Other assembled rectangle | **Group box** — no fill, muted stroke |
| Flat colour region, button-proportioned | **Button** — palette *tint* fill + deep stroke, mapped from the source colour by the same hue-family rule as everything else |
| Flat colour region spanning its container | **Header band** — same tinted treatment |
| Full-width border inside a box | **Row separator** (table rows render this way); full-height ones are column rules |
| Isolated square-ish, ink-dense box | **Icon chip** (v2.3) — a quiet outlined placeholder at the control's true box: calendar buttons, dropdown arrows, toolbar glyphs; a density floor keeps a rounded corner's sparse arc from minting phantoms |
| Row of glyph-sized ink | **Text** — real transcribed text when the sweep's OCR lane covers the row (v2.1; heading rows in the ink weight, body rows slate, on-fill rows ink over the tint); otherwise a **placeholder bar** — a pill at the row's true position and extent, heading/body/on-fill weights |

**How it reads the pixels.** The picture must first read as an interface
at all: a flat, light ground (photos and maps fail here and stay silent),
at least one *assembled* closed rectangle — a top/bottom border pair with
matching extents plus side verticals covering the span, bottoms tried
farthest-first so a table's row separators are never mistaken for box
bottoms, and each side vertical bounds at most one box — plus three or
more text rows. Flat colour regions are found on a coarse cell grid, so a
glyph or an icon printed over a button's fill cannot fragment it. The
structural gate is what lets this tier screen raster slides **before**
the ruler trace: open route lines and tick stubs assemble no rectangles,
so diagram-shaped pictures fall straight through to the trace tier, and a
screenshot never reaches the ruler classifier at all.

**OCR is the sweep's, never the script's (v2.1).** Text inside a
screenshot is pixels, and SlideFigures itself stays zero-dependency — it
never guesses at characters. But the local sweep has an opt-in Tesseract
lane (`sweep.tesseractPath`, the v1.36 OCR opt-in), and since v2.1 the
two cooperate: the figures result names the media entries whose pictures
produced wireframes without transcriptions (`ocrWanted`), the sweep OCRs
exactly those pictures (word boxes via Tesseract TSV, sparse-text mode)
and re-renders once. A text row covered by words renders as **real
text** in the row's own weight; a row OCR missed — or a word under the
confidence floor — keeps its placeholder bar, the row's scanned geometry
stays the layout authority either way, and the alt text states how many
rows are transcription vs placeholder. Without the OCR lane the render
is byte-identical to v2.0: placeholder bars, alt saying so.

**Anti-aliasing is not layout (v2.1).** A screenshot's anti-aliased edge
scans as several parallel 1px bars whose shades differ too much for the
colour merge to unite — left alone, each assembled into its own
separator, so one soft seam rendered as a full-height line cluster
through the middle of the figure and one table border doubled itself.
Parallel thin bars within 3px now collapse into one stroke before
assembly, and a separator that runs *through* content — across a closed
box's interior, or through two or more text rows — is a scan artifact,
not a row or column rule, and is dropped.

**Normalisation.** The same "hand-placement is not layout" rule as
everywhere else: element edges that jitter within 7px snap to one shared
coordinate (a stack of fields comes out flush), text baselines within 4px
align, and every wireframe renders at one standardized width (720px)
regardless of the source capture's resolution — a 4K screenshot and a
laptop screenshot of the same panel come out the same figure.

## Spanning events: route chains (v1.6)

A "line network" slide states an event that runs **across routes**: the
input table carries `From RID` / `From Measure` / `To RouteID` /
`To Measure` (R1L3 10 → R3L3 25, via R2L3), the route-list table gives
the network order, and the split measure lives in the *middle* route's
own domain (52.5 on R2L3 — outside 10–25 entirely). Collapsing that onto
one route's ruler drew a 10→25 tick grid that exists on no route and
clamped the split away as degenerate.

Such slides redraw as a **route chain**: one segment per route, laid end
to end, **each ending in its own arrowhead** — the diagram's vocabulary
for a route's end — with route ids under their segments and event ids
above their extents. The segment interiors carry **no invented tick
grids**: the tables state only the anchors, so only the anchors are
labelled (start measure, split measure, end measure, above their own
points). The split sits on the route the result table names for it (the
event column whose To/From Measure *is* the split), at that segment's
centre — the split route's own domain is unstated, so no position within
it is either. The output legend qualifies each range with its routes
(`E1 R1L3 10 → R2L3 52.5` / `E1 R2L3 52.5 → R3L3 25`), because a
cross-route range is meaningless without them. Segment widths are equal:
a schematic of the network's order, not a claim about route lengths.

## Route above extents (v1.7)

The route used to draw first, as a solid bar the event extents were laid
over — so a fully covered route simply vanished: on half the corpus's
rulers the "route" existed only as its arrowhead. The z-order is now
**extents at the back, ticks over them, the route on top** in every lane,
and the route is drawn as a **dash** (10 on / 6 off since v1.9, butt caps, 3px)
rather than a solid: its gaps let the extent colour read through, so the
route and the extent both stay legible over the same pixels — the extent
as the colour field, the route as the dash running through it. Event
extents widen into 8px bands (v1.9) so their colour reads around the dash.

Arrowheads shrink with the slimmer route (4.4 marker units, ~13px at
route weight — the old ~19px head outweighed the line) and every
marker-end rides a short **solid carrier** retracing the line's final
pixels: a marker on the dashed path itself could land on a dash gap and
float detached from its line.

**v1.9 calms the whole arrangement to one dark mark on one quiet
field.** v1.8's answer — a white casing under every dash, white
outlines on the arrowheads, saturated bars — separated the layers but
read as a candy stripe. The extents are now soft mid-tone **highlight
bands** (8px), the ink dash rides directly on them with a longer 10/6
rhythm, and the casing and marker outlines are gone: a slim dark line
on a soft band needs no separation tricks. The effect is a route drawn
through a highlighter stroke — the band carries the event's colour and
span, the dash carries the route.

## Two-tone palette (v1.8, softened in v1.9)

One hex per hue had to serve colour **fields** (the extent bands)
and **thin marks and text** alike, and satisfied neither: dark enough
for a legible 1.8px edge is far too heavy a field under an ink dash.
Each hue has two steps with one meaning:

- **Bands and legend swatches** take the soft *field* variant, via
  compound `.event.s-hue` / `.swatch.s-hue` rules — class names and the
  hue-family mapping are unchanged, so nothing downstream re-learns
  anything. The set was validated as a categorical palette (adjacent-pair
  CVD separation, normal-vision ΔE ≥ 16, chroma floor and lightness band
  in range); every band is directly labelled, which relieves the soft
  steps' sub-3:1 surface contrast.
- **Node outlines, graph edges, freeform paths and entity text** keep
  the deep variant (warm text deepens to `#9C5A12` to clear 4.5:1 on
  the plate). Structural ink and muted are untouched — the route reads
  as structure, the extents as content.

## Figure cap (v1.9)

`FIG_MAX_COUNT` rises 40 → 96. The 40 predates one-SVG-per-diagram
(DF-4), which turned every redraw case slide into an input+output pair
of figures: a 44-slide deck overran the cap and its tail — including
its picture-backed slides — was silently `:cap`-skipped, which
presented as "PNG slides stopped converting". Both real decks now
render every diagram slide with zero skips.

## Labelled anchors get hash marks (v1.7)

A line whose band carries measure labels but **no ticks** left its
numbers floating in space — the decks draw these (end measures above a
bare line), and the spanning chain's anchors-only rule produced them by
design. A labelled position now gets a major tick:

- **Vector lane** — synthesized only for route bands with *no* ticks at
  all (half-ticked lines keep the author's marks), from the measure
  labels within the band; a label dragged past the route's own end (the
  decks do this) clamps its tick back onto the line and re-centres over
  it. Bands are the unit, not segments: a route laid end to end as four
  segments is one band, and an end label belongs to the whole route.
- **Spanning lane** — each stated anchor (start, split, end) carries a
  tick under its measure, except the split's, which keeps its
  dot-and-hairline marker rather than doubling up. The interiors still
  carry no invented grids: only the anchors are stated, so only the
  anchors are marked.

## Why figures exist

These test plans are route/measure diagrams: a route line, a measure ruler,
event extents, a split or merge point. The extracted markdown used to reduce
them to loose one-token lines (`10`, `11`, `R1`, `E1`); ZipTextExtract v2.2
collapsed those to a `[figure: 10–22 · R1 · E1]` caption, which stopped the
debris but threw the geometry away. The diagram *is* the content of these
slides, so it is rendered rather than described.

## Two sources, one language

| Source | What happens |
|---|---|
| **Vector slides** | The drawing is real DrawingML — connectors and text at true coordinates. Rendered from those coordinates; nothing redrawn or inferred. |
| **Raster slides** | The drawing is a pasted picture. The route is **redrawn** from what the slide states: topology from its title (`2. Loop – Split measure : 20`), measures and split from its own tables. A schematic of the case, faithful to the slide's data, **not** a tracing of the author's picture — the `alt` text says so. |

Redrawing rather than embedding is what makes the corpus consistent: an
embedded PNG cannot be restyled, so its ticks, colours and arrowheads would
stay whatever the author chose. It also keeps figures small (4–12 KB).

## Palette

Each hue carries two steps since v1.8: a bright **field** step for the
extent bars and legend swatches, and a **deep** step for thin marks
(node outlines, graph edges, freeforms) and text.

| Role | Field (bands/swatches) | Deep (marks/text) | Used for |
|---|---|---|---|
| ink | — | `#16302F` | Route dash, entity labels |
| muted | — | `#6E8285` | Ruler ticks, measures, leaders |
| cool | `#4FA7D5` | `#1B6E8C` | Event extent A |
| warm | `#E39A45` | `#C2701A` stroke / `#9C5A12` text | Event extent B |
| green | `#4EB183` | `#2E7D5B` | Event extent C |
| violet | `#A58BD3` | `#7A5AA6` | Event extent D |
| red | `#DC8168` | `#B2442F` | Event extent E |
| plate | `#FFFFFF` | — | Figure ground, both themes |

**Mapping rule.** Source colours are classified by **hue family**, never by
order of appearance, so the same source colour lands on the same slot in every
document and two different source colours stay two different palette colours.
Neutrals collapse onto ink/muted by lightness. `FFC000→warm`, `002060→cool`,
`7F7F7F→muted`. Colour is not decoration in this corpus — the decks use it to
mean something ("both events after split will be highlighted in different
colours") — so appearance is normalised without flattening the distinction.

**Structural roles come from geometry, never colour.** Within a band of
collinear lines, the colour whose lines cover the greatest span is the route
and every other colour is an event extent; short perpendicular stubs are ruler
ticks and diagonals are callout leaders. This matters: one deck draws a
full-width navy route with black and amber events over it, while another lays
four default-coloured route segments end to end under one cyan event. A
colour-led rule gets one of them backwards.

## Type and weight

| Token | Value | Applies to |
|---|---|---|
| measure | 11px, muted, tabular numerals | Ruler numbers |
| id | 12.5px, 600 | Route and event ids |
| route | 3px stroke, 10/6 dash, butt caps | The network line — a dash over the extent bands (v1.7/v1.9) |
| event | 8px stroke, **butt caps** | Extents — soft highlight bands under the dash |
| tick / major | 1.15 / 1.4px | Scale marks |
| leader | 1.0px | Callouts |
| wf-panel / wf-field / wf-box | 1.4 / 1.1 / 1.1px muted stroke | Wireframe panels, input fields, group boxes |
| wf-btn | tint fill + deep stroke, 1.2px | Wireframe buttons, bands, tiles |
| wf-sep | 1px plate-border grey | Wireframe table rows and column rules |
| wf-gk / wf-gkh / wf-gkp | context grey / slate / plate pills | Placeholder text bars: body, heading, on-fill |

Geometry is tokenised the same way (v1.6), so every lane — ruler, redraw,
spanning, trace — places the same element the same distance from the line:

| Token | Value | Applies to |
|---|---|---|
| MEAS_OFF | 15.5px | Measure baseline off the line |
| ID_OFF | 20.5px | Entity-id baseline off the line (the heavier face sits a step further out) |
| SPLIT_ARM | 10.5px | Split hairline half-length |
| DOT_R | 3.2px | Split-dot radius |
| ARROW_EXT | 14px | Route overshoot carrying the arrowhead (sized to the 4.4-unit head) |
| LEGEND_GAP | 24px | Legend baseline below the content |

The gate asserts the cross-lane invariants (one split-dot radius, one
id offset) so the lanes cannot drift apart again.

Font is a system stack only: an SVG loaded through `<img>` cannot fetch a
webfont.

## Component standardisation

Style tokens fix colour and type; they do not fix placement, and the decks
place every part by hand.

- **Ticks** — one length each for minor and major (every 5th), centred on the
  route line.
- **Measures** — centred above their own tick, all on one shared baseline. In
  the source a label typically sits ~0.1in off the tick it belongs to.
- **Extents** — clamped to the ruler span, and adjoining extents snapped to
  share **one exact boundary**. Hand-drawn bars overlap or gap by a few pixels
  at the very measure the test case is about.
- **Butt caps** — round caps overshoot by half the stroke width, so a 10→16
  bar reads as 9.9→16.1. Wrong in a document that is precise about measures.
  Round caps stay on the route itself.
- **Split marker** — a dot and hairline where two extents meet. The hairline's
  arms reach past the major ticks but stop clear of the measure text band
  (v1.4), so a measure that lands on the split stays readable.
- **Entity labels** — route id as a row label at the left of its line; event id
  centred beneath its own bar. Centring the route id *over* the ruler puts it
  on the middle measure, where it reads as labelling that number.
- **Labels never share a side (v1.4)** — on a redrawn route collinear with its
  own centroid (straight, branch, gap, vertical), "inward" and "outward"
  degenerate to the same tie, and measures and event ids used to print over
  each other. The tie now breaks like the vector lane: measures above the line
  (right of a vertical one), event ids below (left). The redraw's route id
  sits level with the route's **entry point**, not at the figure's mid-height
  (a branch route runs at 0.28 of the height), and an event id anchors on its
  extent's longest straight run rather than its arc-length midpoint, which can
  land on a corner where any perpendicular offset sits on the adjoining edge.
- **Degenerate splits (v1.4)** — a stated split measure equal to a route end
  makes one side zero-length: that extent is dropped rather than drawn as an
  invisible bar with an orphaned label, and a single-extent output keeps the
  legend off (legends exist to tell 2+ colours apart).
- **Leaders** — dropped where the label they point at has been placed directly.
- **Decimals** — one convention per ruler (`4.5` and `5.0`, not `4.5` and `5`).
- **Vertical rhythm** — dead space between bands collapses to one standard gap.
  Runs on every figure: bands move as units, so nothing inside one changes.
- **Dense rulers** — labels thin to every 2nd or 3rd tick rather than
  overlapping; every tick is still drawn.
- **Direction** — an arrowhead on open routes carries route direction. Since
  v1.4 a normalised or redrawn route overshoots its final tick and carries
  the arrowhead on the overshoot — the number-line convention — where no
  tick or extent drawn later can cross or bury it; a route line whose band
  visibly continues past its end (route segments laid end to end; a traced
  extent running beyond the surviving route run) suppresses its arrow rather
  than pointing mid-band. v1.5 snaps the head to the line tip: it is a
  **solid** triangle (a notched head is a see-through cutout over the line's
  final pixels), the overshoot is sized to the head so its back never
  dips under an extent bar, and refX keeps the line end inside the head
  where the triangle is wider than the line. v1.7 shrinks the head to 4.4
  marker units (~13px at route weight — the old ~19px head outweighed the
  slimmer dashed route), sizes the overshoot to it (14px), and puts
  **every** marker-end on a short solid carrier retracing the line's final
  pixels — the route is dashed now, and a marker on the path itself could
  land on a dash gap and float detached — so nothing ever draws over an
  arrowhead, and no head ever floats free of its line.
- **Accessibility** — `<title>` and `<desc>` in every figure, plus descriptive
  alt text on the markdown image link (which is also what makes the diagram
  searchable, since the Q&A agent grounds on markdown text).

## Known limits

- `arcTo` segments in freeform paths are not emitted (their endpoint is
  implicit, so a wrong guess would draw a wrong curve — omission is the
  honest failure). The redraw path covers the shapes this corpus actually
  uses (straight, vertical, loop, lollipop, branch, alpha, infinity, gap).
- The raster tiers decode every raster the corpus pastes (v2.2): full
  PNG — all bit depths, palettes, transparency composited onto the white
  ground, Adam7 interlace — plus baseline JPEG, GIF and BMP, each
  verified against Pillow's decode. Progressive JPEG (SOF2) is refused
  by design (its spectral-selection scans would triple the decoder for a
  format PowerPoint never writes) and stays a caption. The tiers trace
  axis-aligned structure only, and cannot OCR —
  anything printed inside a picture is pixels, so a traced ruler may carry
  ticks but no numbers, and a wireframe's text rows are placeholder bars
  unless the sweep's opt-in OCR lane supplies transcriptions (v2.1). The
  slide's own extracted text still carries the searchable words.
- The wireframe tier wants a flat, LIGHT ground: dark-theme screenshots
  stay silent (the corpus's decks capture the app's light theme), as do
  borderless flat designs with nothing the rectangle assembly can close.
- Band compression is skipped in a ruler figure that also contains nodes or
  freeform paths — compressBands cannot see them, and moving the ruler out
  from under a node it shares space with would misplace exactly the thing
  being kept.
- The redraw is a schematic: it is accurate to the slide's stated measures,
  split and topology, but its layout is ours, not a reproduction of the
  author's drawing.
- Where a source label overlaps its own route line on a vector slide, it still
  does. The framework normalises appearance, not layout; moving labels would
  be redrawing the diagram rather than rendering it.
