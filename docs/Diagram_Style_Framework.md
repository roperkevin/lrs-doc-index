# Diagram style framework (SlideFigures v1.0)

How every slide diagram in the corpus is drawn. One visual language, so 500
documents stop looking like 500 decks.

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

| Role | Hex | Used for |
|---|---|---|
| ink | `#16302F` | Route line, entity labels |
| muted | `#6E8285` | Ruler ticks, measures, leaders |
| cool | `#1B6E8C` | Event extent A |
| warm | `#C2701A` | Event extent B |
| green | `#2E7D5B` | Event extent C |
| violet | `#7A5AA6` | Event extent D |
| red | `#B2442F` | Event extent E |
| plate | `#FFFFFF` | Figure ground, both themes |

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
| route | 3.6px stroke | The network line |
| event | 5.0px stroke, **butt caps** | Extents |
| tick / major | 1.15 / 1.4px | Scale marks |
| leader | 1.0px | Callouts |

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
- **Split marker** — a dot and hairline where two extents meet.
- **Entity labels** — route id as a row label at the left of its line; event id
  centred beneath its own bar. Centring the route id *over* the ruler puts it
  on the middle measure, where it reads as labelling that number.
- **Leaders** — dropped where the label they point at has been placed directly.
- **Decimals** — one convention per ruler (`4.5` and `5.0`, not `4.5` and `5`).
- **Vertical rhythm** — dead space between bands collapses to one standard gap.
  Runs on every figure: bands move as units, so nothing inside one changes.
- **Dense rulers** — labels thin to every 2nd or 3rd tick rather than
  overlapping; every tick is still drawn.
- **Direction** — an arrowhead on open routes carries route direction.
- **Accessibility** — `<title>` and `<desc>` in every figure, plus descriptive
  alt text on the markdown image link (which is also what makes the diagram
  searchable, since the Q&A agent grounds on markdown text).

## Known limits

- Curved and custom-geometry source shapes, shape rotation and text wrapping
  are not read from vector slides; the redraw path covers the shapes this
  corpus actually uses (straight, vertical, loop, lollipop, branch, alpha,
  infinity, gap).
- The redraw is a schematic: it is accurate to the slide's stated measures,
  split and topology, but its layout is ours, not a reproduction of the
  author's drawing.
- Where a source label overlaps its own route line on a vector slide, it still
  does. The framework normalises appearance, not layout; moving labels would
  be redrawing the diagram rather than rendering it.
