/**
 * SlideFigures v2.1 — pptx slide diagrams → standalone SVG figures
 * --------------------------------------------------------------------
 * DF-1 (2026-09-03); DF-2 widens coverage; DF-3 (2026-09-03) adds layout
 * normalisation, legends, rotation and the raster tracing tier; DF-4
 * (2026-09-03) splits the redraw lane's combined figure and anchors every
 * figure to its slide table; DF-5 (2026-09-03) fixes label collisions and
 * arrowhead layering; DF-6 (2026-09-03) snaps arrowheads to line tips;
 * DF-7 (2026-09-03) redraws spanning events as route chains; DF-8
 * (2026-09-03) puts the route on top as a dash and hashes labelled anchors;
 * DF-9 (2026-09-03) cases the dash in white and two-tones the palette;
 * DF-10 (2026-09-03) calms the style to soft bands and lifts the cap;
 * DF-11 (2026-09-03) redraws UI screenshots as standardized wireframes;
 * DF-12 (2026-09-03) lifts wireframe fidelity — real OCR'd text and
 * anti-aliasing artifact suppression.
 * Companion to ZipTextExtract, same input (the
 * file's bytes as base64), plus an OPTIONAL third parameter (DF-12): a
 * JSON array of per-picture OCR transcriptions,
 * [{ entry, words: [{ x, y, w, h, t, c? }] }], keyed by media basename
 * in the picture's own pixel space. Returns one SVG per DIAGRAM (a
 * slide can carry several):
 *
 *   { figures: [{ slide, name, svg, alt, anchor }], count, skipped,
 *     ocrWanted }
 *
 * v2.1 (DF-12):
 *   - WIREFRAME TEXT IS REAL WHERE OCR PROVIDES IT. The wireframe tier
 *     never OCRs — it stays zero-dependency — but the local sweep has an
 *     opt-in Tesseract lane (sweep.tesseractPath), and a caller that has
 *     transcriptions can now pass them in: a text row whose extent is
 *     covered by OCR words renders as real `<text>` (heading, body and
 *     on-fill weights matching the bar classes) instead of a placeholder
 *     bar; rows OCR missed keep their bars, and the alt text states how
 *     many rows are transcription vs placeholder. To keep the loop
 *     single-shot and the OCR spend targeted, the result names the media
 *     entries whose pictures produced wireframes WITHOUT transcriptions
 *     (`ocrWanted`, comma-separated basenames): the sweep OCRs exactly
 *     those and re-renders once.
 *   - ANTI-ALIASING IS NOT LAYOUT. A screenshot's anti-aliased edge
 *     scans as SEVERAL parallel 1px bars whose shades differ too much
 *     for the colour merge; each became its own separator, so one soft
 *     seam rendered as a full-height line CLUSTER through the middle of
 *     the figure and one table border doubled itself. Parallel thin bars
 *     within UI_PAR_GAP now collapse into one stroke before assembly,
 *     and a separator that runs THROUGH content — across a closed box's
 *     interior, or through 2+ text rows — is a scan artifact, not a row
 *     or column rule, and is dropped.
 *
 * v2.0 (DF-11):
 *   - UI SCREENSHOTS BECOME WIREFRAMES. Half the corpus's pasted pictures
 *     are not route diagrams at all — they are screenshots of the app's
 *     own panels (a search form, a results list, an attribute table). The
 *     trace tier rightly refused them ("busier than a diagram is a
 *     screenshot"), so they stayed captions — and a sparse one could in
 *     principle slip under the 48-stroke cap and reach the ruler
 *     classifier with strokes that are window chrome, not a route. A
 *     pasted picture that reads as an interface — a flat, light ground,
 *     assembled closed rectangles, rows of glyph-sized ink — is now
 *     REDRAWN as a standardized wireframe: panels and group boxes,
 *     input fields, buttons and header bands palette-tinted by the same
 *     hue-family rule as everything else, table rows as separators, and
 *     text as placeholder bars (two weights: heading ink, body muted).
 *     Layout is normalised the way the rulers and graphs are: edges that
 *     jitter within tolerance snap to one shared coordinate, one corner
 *     radius family, one standardized figure width. Text inside a
 *     screenshot is pixels, not characters — no OCR is attempted, the
 *     bars keep each row's true position and extent, and the alt text
 *     says so. The wireframe gate is STRUCTURAL (>=1 assembled closed
 *     rectangle, >=2 boxes/blocks, >=3 text rows), which a route diagram
 *     cannot pass — open lines and ticks assemble no rectangles — so the
 *     wireframe tier screens raster slides BEFORE the ruler trace: a
 *     screenshot never reaches the ruler classifier at all, and anything
 *     diagram-shaped falls straight through to it. Photos and maps fail
 *     the flat-ground test and stay silent, as before.
 *
 * v1.9 (DF-10):
 *   - CALM, NOT STRIPED. DF-9's white-cased dash over saturated bars
 *     read as a candy stripe. The style is now ONE dark mark on ONE
 *     quiet colour field: extents widen into soft mid-tone highlight
 *     BANDS (8px, colours softened a step and re-validated), the ink
 *     dash rides directly on them with a longer 10/6 rhythm, and the
 *     casing underlay and the white marker outlines are gone — a slim
 *     dark line on a soft band needs no separation tricks. The DF-9
 *     two-tone structure stays (bands soft, thin marks and text deep);
 *     only the field step changed.
 *   - THE CAP FIT ONE DECK AGO. FIG_MAX_COUNT=40 predates DF-4 splitting
 *     every redraw diagram into an input+output pair; a 44-slide deck
 *     overran it and its TAIL — including its picture-backed slides —
 *     was silently ":cap"-skipped, which read as "PNGs stopped
 *     converting". Now 96: both real decks render every diagram slide
 *     with zero skips.
 *
 * v1.8 (DF-9):
 *   - THE DASH RIDES A WHITE CASING (retired in v1.9). Every route dash
 *     drew over a white casing line, and arrowheads carried a white
 *     outline; event bars and legend swatches took a BRIGHT field
 *     variant per hue via compound .event.s-hue / .swatch.s-hue rules —
 *     the two-tone structure survives in v1.9 with softer field steps.
 *
 * v1.7 (DF-8):
 *   - THE ROUTE RIDES ON TOP, AS A DASH. A solid route drawn first
 *     disappeared entirely under any event bar covering it — on a fully
 *     covered ruler the route existed only as its arrowhead. The route is
 *     now a dashed line (8 on / 5 off, butt caps, 3px) drawn AFTER the
 *     extents in every lane, so both always read: the extent as the
 *     colour field, the route as the dash running through it. Event
 *     extents widen to 6.5px so their colour still shows around the dash;
 *     ticks draw between the two (over the bar, under the route).
 *   - SMALLER ARROWHEADS. The 5.2-unit head (~19px at the old route
 *     weight) outweighed the slimmer dashed route; heads drop to 4.4
 *     marker units (~13px) and ARROW_EXT to 14, still sized so the whole
 *     head rides its own overshoot stub. Every marker-end now sits on a
 *     short solid carrier — a marker on the dashed path itself could land
 *     on a dash gap and float detached from its line.
 *   - HASH MARKS FOR LABELLED ANCHORS. A line whose band carries measure
 *     labels but NO ticks (the decks draw these; so does the spanning
 *     chain, whose tables state only the anchors) left its numbers
 *     floating in space. Such labels now get a major tick at each
 *     labelled position: in the vector lane synthesized for tickless
 *     routes only (half-ticked lines keep the author's marks), in the
 *     spanning lane at each stated anchor — except the split's, which
 *     keeps its dot-and-hairline marker rather than doubling up.
 *
 * v1.6 (DF-7):
 *   - SPANNING EVENTS REDRAW AS ROUTE CHAINS. A "line network" slide
 *     states an event running ACROSS routes (From RID R1L3 measure 10 →
 *     To RouteID R3L3 measure 25, via R2L3, split at 52.5 in R2L3's own
 *     measure domain). Collapsing that onto one route's ruler drew a
 *     10→25 tick grid that exists on no route and clamped the split away
 *     as degenerate. Such slides now draw the route CHAIN (order from the
 *     slide's route-list table): one segment per route, each ending in
 *     its own arrowhead (the diagram's vocabulary for a route end), route
 *     ids under their segments, the stated measures above their anchors
 *     (no invented tick grids — the tables state only the anchors), the
 *     split on the route the result table names for it, and a legend
 *     qualifying each output range with its routes ("E1 R1L3 10 → R2L3
 *     52.5") — a cross-route range is meaningless without them.
 *
 * v1.5 (DF-6):
 *   - ARROWHEADS SNAP TO LINE TIPS. The v1.4 head still let the line show
 *     underneath it: the stealth notch was a see-through cutout over the
 *     line's final pixels, and the head (~19px at route weight) reached
 *     back further than the 15px overshoot, dipping its tail under the
 *     extent bar. The head is now a SOLID triangle (nothing shows through),
 *     ARROW_EXT is sized to the head so it sits wholly on its own overshoot
 *     stub, and the ruler lane emits arrowheads AFTER the extents (on a
 *     short carrier retracing the route's own final pixels), so nothing
 *     ever draws over one. arrowOk still keeps heads off ends where the
 *     band continues, so the trace tier stays arrow-free mid-band.
 *
 * v1.4 (DF-5):
 *   - LABELS NEVER SHARE A SIDE. On a redrawn route that is collinear with
 *     its own centroid (straight/branch/gap/vertical — the "outward" and
 *     "inward" normals both degenerate to the same tie), measures and event
 *     ids used to land on the SAME side and print over each other. The tie
 *     now breaks the way the vector lane always has: measures above the
 *     line (right of a vertical one), event ids below (left) — opposite
 *     sides by construction, so an extent midpoint on a major tick no
 *     longer stamps "E1" over its own measure.
 *   - ARROWHEADS CLEAR OF THE RULER. The route's arrowhead is a marker on
 *     the route element, which draws before the extents layered over it —
 *     a 5px event bar reaching the route's end buried it, and the final
 *     tick crossed it. Normalised and redrawn routes now overshoot the
 *     final tick by ARROW_EXT and carry the arrowhead on the overshoot
 *     (the number-line convention), where nothing drawn later reaches; the
 *     head itself sharpens to a stealth profile. A raw route no ruler
 *     claimed keeps the v1.3 in-place marker.
 *   - DEGENERATE SPLITS. A split measure equal to a route end (real decks
 *     carry these) produced a zero-length second extent: an orphaned event
 *     label at the route end and an "E1 20–20" legend entry. Zero-length
 *     extents are dropped; a single-extent output keeps the legend off
 *     (legends exist to tell 2+ colours apart).
 *   - ROUTE ID ON ITS LINE. The redraw's route id sat at mid-height, which
 *     is on the line only when the topology centres it (a branch route runs
 *     at 0.28 of the height — the id floated in dead space). It now sits
 *     level with the route's entry point.
 *   - TITLE BOXES ARE NOT NODES. The decks frame their case text in an
 *     outlined box above the drawing; a visible shape holding long prose
 *     (or a long numbered case line) rendered as a giant node duplicating
 *     the section heading into the figure. Such boxes are dropped — their
 *     text already reaches the sidecar body and the case heading through
 *     the extractor.
 *   - NO MID-BAND ARROWS. A route line only carries its direction arrow
 *     where its band actually ends; when another route/event line continues
 *     past its endpoint (segments laid end to end, a traced extent running
 *     beyond the surviving route run), the arrowhead is suppressed instead
 *     of pointing mid-band.
 *
 * v1.1 (DF-2):
 *   - MULTI-FIGURE SLIDES. Primitives are spatially clustered (union-find
 *     over expanded bounding boxes; loose labels join the nearest cluster)
 *     and each qualifying cluster renders as its own figure. A slide's only
 *     figure keeps the v1.0 name `slideN.svg` (so --reformat overwrites in
 *     place); siblings are `slideN_fig1.svg`, `slideN_fig2.svg`, … in
 *     top-to-bottom, left-to-right order. Stacked bands closer than the
 *     cluster gap stay ONE figure — two rulers an inch apart are one
 *     diagram's input/output rows, not two diagrams.
 *   - ALL GRAPHIC CONTENT, one visual language. Beyond connectors: lines
 *     drawn as shapes (prstGeom line/*Connector*), preset-geometry shapes
 *     with a visible fill or outline rendered as standardized NODES
 *     (box/ellipse/diamond families, palette-tinted fill, palette stroke,
 *     centred wrapped label), freeform custGeom paths re-emitted as SVG
 *     paths (moveTo/lnTo/cubicBezTo/quadBezTo/close), dash patterns
 *     normalised to two canonical dashes, and head/tail arrowheads carried
 *     onto connector edges. A cluster of 2+ nodes joined by a connector —
 *     or 2+ freeform paths — is a diagram even without a ruler.
 *
 * v1.3 (DF-4):
 *   - ONE SVG PER DIAGRAM in the redraw lane too. The redraw used to stack
 *     the case's input state and its "Output" state into a single figure —
 *     the one place a figure still combined two diagrams. Each state is now
 *     its own figure (slideN_fig1 = before the split, slideN_fig2 = after),
 *     named and titled like any other multi-figure slide. The legend, which
 *     names the two split extents, belongs to the output figure.
 *   - TABLE ANCHORS. Every figure carries `anchor`: the first row of the
 *     slide table it sits with, as cell texts ([] when the slide gives it no
 *     table). The sweep uses it to place the figure directly before that
 *     table in the extracted markdown — the slide's own layout, where a
 *     diagram sits with the table stating its numbers, instead of every
 *     figure stacking under the heading. Drawn/traced figures anchor by
 *     GEOMETRY (the table sharing the cluster's vertical band, else the
 *     nearest one below; each table anchors at most one figure); redrawn
 *     figures anchor by MEANING (the input figure to the table its measures
 *     were read from, the output figure to the result table — the other
 *     measure-bearing table of 3+ columns).
 *
 * v1.2 (DF-3):
 *   - CONNECTOR ROUTING. In the graph lane an edge whose endpoint lands on
 *     (or hand-draggedly near) a node re-anchors to that node's boundary at
 *     the exact point where the ray toward the other end exits the shape
 *     (rect/ellipse/diamond each have a closed form). Edges whose source
 *     was a bent connector route orthogonally between facing node sides.
 *   - GRID SNAP. Node rows and columns whose centres jitter within
 *     tolerance snap to one shared centre, and near-equal node sizes
 *     equalise to the group median — the same "hand-placement is not
 *     layout" rule the rulers already apply.
 *   - LEGENDS. A figure whose extents use 2+ palette colours grows a
 *     swatch legend; the redraw lane, which knows the numbers, states each
 *     extent's measure range.
 *   - ROTATION. xfrm rot is honoured: line endpoints rotate exactly;
 *     near-quarter-turn nodes normalise to an axis-aligned swap (labels
 *     stay horizontal); other node angles emit a real rotate() on the
 *     shape outline only. Freeform points rotate exactly.
 *   - RASTER TRACING. A slide with no vector drawing AND no redraw data
 *     but a pasted PNG gets a last-resort tracing tier: the PNG is decoded
 *     in-script (the zip layer's inflate does the zlib work), colour-aware
 *     stroke runs are vectorised into lines, and those lines run through
 *     the SAME classify/normalise pipeline — so a traced figure is
 *     indistinguishable in style from a drawn one. It renders only when
 *     the trace passes the strict ruler gate (a route plus 3+ ticks);
 *     anything busier (screenshots, photos) stays silent, and the alt text
 *     says the figure is traced and approximate.
 *
 * Why this exists: these test plans are route/measure diagrams, and the
 * extracted markdown used to reduce them to loose one-token lines (v2.2
 * collapsed those to a "[figure: 10-22 ...]" caption, which at least
 * stopped the debris but threw the geometry away). A route diagram IS the
 * content of these slides, so it is rendered rather than described.
 *
 * Two sources, one visual language:
 *
 *   VECTOR SLIDES  the drawing is real DrawingML — connectors, ticks and
 *                  text at true coordinates. Rendered from those
 *                  coordinates: nothing is redrawn or inferred.
 *   RASTER SLIDES  the drawing is a pasted picture. Rather than embed
 *                  pixels we cannot restyle, the route is REDRAWN from
 *                  what the slide itself states: its topology from the
 *                  title ("2. Loop - Split measure : 20") and its
 *                  measures/split from its own tables. This is a
 *                  schematic of the case, faithful to the slide's data,
 *                  not a tracing of the author's picture — `alt` says so.
 *
 * Style is one framework for the whole corpus (so 500 documents stop
 * looking like 500 decks):
 *   - source colours map to palette slots by HUE FAMILY — deterministic,
 *     so one source colour lands on one slot in every document, and two
 *     different source colours stay two different palette colours
 *   - structural roles come from GEOMETRY, never colour: within a band of
 *     collinear lines the longest is the route and shorter lines over it
 *     are event extents (these decks colour the route navy and leave an
 *     event default black — a colour-led rule gets it backwards)
 *   - rulers are re-laid out on a canonical grid: uniform ticks centred on
 *     the line, major/minor ticks, measures centred above their own tick
 *     on a shared baseline, extents clamped and snapped to share one exact
 *     boundary, butt caps (round caps overshoot by half the stroke width,
 *     reading 10->16 as 9.9->16.1), a split marker at the boundary, route
 *     ids as left row labels, redundant leaders dropped, one decimal
 *     convention per ruler, and dead vertical bands compressed
 *
 * Colour/component normalisation applies only where the drawing is
 * entirely ours — which, since raster slides are redrawn, is everywhere a
 * figure is produced.
 *
 * Consumed by the local sweep, which writes each `svg` to the media folder
 * as `{prefix}{name}`, drops that slide's "[figure: ...]" caption from the
 * extracted markdown, and inserts each image link directly before its
 * `anchor` table in the slide's section (directly after the slide heading
 * when the figure has no anchor). On a cloud-flow rollback the sweep simply
 * does not call this, and v2.2's caption stands.
 */
interface SlideFigure { slide: number; name: string; svg: string; alt: string; anchor: string[]; }
// ocrWanted (DF-12): comma-separated media basenames of pictures that
// produced wireframes with placeholder text bars — the entries a caller
// with an OCR tool should transcribe and pass back in for a re-render.
interface FiguresResult { figures: SlideFigure[]; count: number; skipped: string; ocrWanted: string; }

const FIG_MAX_COUNT = 96;      // DF-10: 40 predates DF-4 splitting every
                               // redraw diagram into an input+output PAIR —
                               // a 44-slide deck at ~2 figures per case
                               // slide overran it and the deck's TAIL
                               // (including its picture-backed slides) was
                               // silently ":cap"-skipped. 96 covers the
                               // corpus's largest decks with headroom while
                               // still bounding a pathological input.
const FIG_MAX_ONE = 220 * 1024;
const EMU_PX = 96 / 914400;
const TICK_MINOR = 9;
const TICK_MAJOR = 15;
const TICK_GAP = 8;
const LABEL_MIN_GAP = 26;
const BAND_GAP = 46;
const FIG_PAD = 20;
const FIG_W = 760;
const CLUST_GX = 90;   // px of clear air that separates side-by-side diagrams
const CLUST_GY = 150;  // px of clear air that separates stacked diagrams
const TEXT_REACH = 60; // a loose label joins a cluster within this distance
const NODE_RX = 7;     // one corner radius for every box node in the corpus
const ANCHOR_PAD = 16; // an edge endpoint this close to a node belongs to it
const TRACE_MAX_PX = 5600000;  // decode budget for pasted pictures — hi-dpi
                               // screenshots run 2880x1800 (DF-11); the old
                               // 2.6MP budget refused them before the
                               // wireframe tier could even look
const TRACE_MAX_BARS = 48;     // busier than this is a screenshot, not a diagram
// ---- wireframe tier (DF-11) ----
const UI_STD_W = 720;          // one standardized wireframe width for the corpus
const UI_INK = 45;             // a pixel this far from the ground is interface ink
                               // (softer than the trace tier's 60 — screenshot
                               // chrome is drawn in light greys)
const UI_SNAP = 7;             // px of jitter that snaps to one shared edge
const UI_RECT_TOL = 8;         // border ends this close assemble into a rectangle
const UI_MAX_ELEMS = 260;      // busier than this is a photo mosaic, not a UI
const UI_GLYPH_HMAX = 32;      // ink taller than this is chrome, not a glyph
const UI_TEXT_GAP = 1.2;       // glyph gaps up to this x row-height chain a row
const UI_PAR_GAP = 3;          // parallel thin bars this close are ONE
                               // anti-aliased stroke, not a stripe cluster
                               // (DF-12 — an AA edge scans as several 1px
                               // bars whose shades defeat the colour merge)
const UI_OCR_CONF = 40;        // OCR words below this confidence stay
                               // placeholder bars (DF-12)
const ARROW_EXT = 14;          // route overshoot past the final tick — sized
                               // to the arrowhead (4.4 x 3px stroke, refX
                               // 6/8 → its back sits ~10px behind the line
                               // end) so the whole head rides its own stub,
                               // never over a tick or an extent bar
const SPLIT_ARM = 10.5;        // split hairline half-length: past the major
                               // ticks but clear of the measure text band
                               // (whose centre sits 15.5px off the line)
const DOT_R = 3.2;             // split-dot radius, every lane
const MEAS_OFF = TICK_MAJOR / 2 + TICK_GAP;    // measure baseline off the line
const ID_OFF = MEAS_OFF + 5;   // entity-id baseline off the line (ids are a
                               // heavier 12.5px face than the 11px measures,
                               // so they sit a step further out)
const LEGEND_GAP = 24;         // legend baseline below the figure's content

function main(workbook: ExcelScript.Workbook, zipBase64: string, ocrJson?: string): FiguresResult {
  const bytes = b64ToBytes(zipBase64);
  const entries = readCentralDirectory(bytes);
  const slideParts = entries.filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.name));
  const ordered = orderSlides(bytes, entries, slideParts);
  const ocr = uiOcrParse(ocrJson);
  const figures: SlideFigure[] = [];
  const skipped: string[] = [];
  const wanted: string[] = [];
  for (let i = 0; i < ordered.length; i++) {
    const no = i + 1;
    if (figures.length >= FIG_MAX_COUNT) { skipped.push("slide" + no + ":cap"); continue; }
    let xml = "";
    try {
      xml = utf8ToString(extractEntry(bytes, ordered[i]));
    } catch (e) {
      skipped.push("slide" + no + ":unreadable");
      continue;
    }
    const figs = buildFigures(xml, no,
      () => slidePics(bytes, entries, ordered[i].name, xml), ocr, wanted);
    for (const fig of figs) {
      if (figures.length >= FIG_MAX_COUNT) {
        skipped.push(fig.name.replace(/\.svg$/, "") + ":cap");
        continue;
      }
      if (fig.svg.length > FIG_MAX_ONE) {
        skipped.push(fig.name.replace(/\.svg$/, "") + ":oversize");
        continue;
      }
      figures.push(fig);
    }
  }
  return { figures: figures, count: figures.length, skipped: skipped.join(","),
    ocrWanted: wanted.join(",") };
}

// ---------------------------------------------------------------- geometry
interface FGroup { s: number; e: number; gx: number; gy: number; gw: number; gh: number; cx: number; cy: number; cw: number; ch: number; }
interface FLine { x1: number; y1: number; x2: number; y2: number; cls: string; extra: string; }
interface FText { x: number; y: number; t: string; cls: string; anchor: string; }
interface FRaw { x1: number; y1: number; x2: number; y2: number; w: number; h: number; col: string; dash: string; arrow: boolean; bent: boolean; }
interface FRuler { x0: number; x1: number; y: number; }
interface FNode { x: number; y: number; w: number; h: number; shape: string; sRole: string; tRole: string; label: string; rot: number; }
interface FPath { d: string; x0: number; y0: number; x1: number; y1: number; role: string; dash: string; closed: boolean; fillRole: string; }
interface Parsed { lines: FRaw[]; nodes: FNode[]; paths: FPath[]; texts: FText[]; }
interface Cluster { lines: FRaw[]; nodes: FNode[]; paths: FPath[]; texts: FText[]; x0: number; y0: number; x1: number; y1: number; }
interface FTable { x: number; y: number; w: number; h: number; rows: string[][]; }

function fnum(v: number): string {
  const r = Math.round(v * 10) / 10;
  return r === Math.floor(r) ? String(Math.floor(r)) : String(r);
}
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Nesting-aware group spans: a non-greedy <p:grpSp>...</p:grpSp> regex closes
// on the FIRST closing tag, so with nested groups the inner one steals the
// outer's span — shapes outside any group look enclosed, and shapes inside a
// nested one lose the outer transform (which is how a ruler ends up 1.4in
// from its own numbers). Walk the tags with a depth stack instead.
function figGroups(xml: string): FGroup[] {
  const out: FGroup[] = [];
  const stack: number[] = [];
  const re = /<p:grpSp>|<\/p:grpSp>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    if (m[0] === "<p:grpSp>") { stack.push(m.index); continue; }
    if (stack.length === 0) continue;
    const s = stack.pop() as number;
    const b = xml.slice(s, m.index + m[0].length);
    const o = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const e = b.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    const c = b.match(/<a:chOff x="(-?\d+)" y="(-?\d+)"\/>/);
    const ce = b.match(/<a:chExt cx="(\d+)" cy="(\d+)"\/>/);
    if (o && e && c && ce) {
      out.push({ s: s, e: m.index + m[0].length,
        gx: parseInt(o[1], 10), gy: parseInt(o[2], 10),
        gw: parseInt(e[1], 10), gh: parseInt(e[2], 10),
        cx: parseInt(c[1], 10), cy: parseInt(c[2], 10),
        cw: parseInt(ce[1], 10), ch: parseInt(ce[2], 10) });
    }
  }
  return out;
}

function figXform(gs: FGroup[], at: number, X: number, Y: number, W: number, H: number): number[] {
  const encl: FGroup[] = [];
  for (const g of gs) if (g.s < at && at < g.e) encl.push(g);
  encl.sort((a, b) => (a.e - a.s) - (b.e - b.s));
  let x = X, y = Y, w = W, h = H;
  for (const g of encl) {
    const sx = g.cw ? g.gw / g.cw : 1;
    const sy = g.ch ? g.gh / g.ch : 1;
    x = g.gx + (x - g.cx) * sx;
    y = g.gy + (y - g.cy) * sy;
    w = w * sx; h = h * sy;
  }
  return [x, y, w, h];
}

// source colour -> palette slot, by hue family (deterministic across the corpus)
function figRole(hex: string, dflt: string): string {
  if (!hex) return dflt;
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return l < 0.35 ? "ink" : "muted";
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  if (s < 0.18) return l < 0.35 ? "ink" : "muted";
  if (l > 0.93 || l < 0.06) return "ink";
  let h = mx === r ? (((g - b) / d) % 6 + 6) % 6 : (mx === g ? (b - r) / d + 2 : (r - g) / d + 4);
  h = h * 60;
  if (h >= 25 && h < 70) return "warm";
  if (h >= 70 && h < 165) return "green";
  if (h >= 165 && h < 260) return "cool";
  if (h >= 260 && h < 320) return "violet";
  return "red";
}

function figStyle(): string {
  return "<style>" +
    ".plate{fill:#FFFFFF;stroke:#D7DFDF;stroke-width:1}" +
    ".ln{fill:none;stroke-linecap:round;stroke-linejoin:round}" +
    // the route is a DASH over the extents, not a bar under them (DF-8):
    // drawn last in every lane. A long, calm rhythm (DF-10) — the extent
    // beneath is a soft band, so the slim ink dash reads against it with no
    // underlay tricks: one dark mark, one quiet colour field.
    ".route{stroke:#16302F;stroke-width:3;stroke-dasharray:10 6;stroke-linecap:butt}" +
    ".ctx{stroke:#B9C6C6;stroke-width:2.4}" +
    ".event{stroke-width:8}.flat{stroke-linecap:butt}" +
    ".tick{stroke:#6E8285;stroke-width:1.15}" +
    ".maj{stroke:#4E6265;stroke-width:1.4}" +
    ".leader{stroke:#6E8285;stroke-width:1}" +
    ".split{stroke:#16302F;stroke-width:1.4;stroke-dasharray:3 2.5;opacity:.55}" +
    ".splitdot{fill:#FFFFFF;stroke:#16302F;stroke-width:1.6}" +
    ".edge{stroke:#4E6265;stroke-width:1.8}" +
    ".free{stroke-width:2.2}" +
    ".freefill{stroke-width:2.2;stroke-linejoin:round}" +
    ".dashed{stroke-dasharray:7 4.5}.dotted{stroke-dasharray:1.6 3.6}" +
    ".node{fill:#FFFFFF;stroke:#16302F;stroke-width:1.6}" +
    ".t-plain{fill:#FFFFFF}.t-ink{fill:#E9EDED}.t-muted{fill:#EFF2F2}" +
    ".t-cool{fill:#E5F0F5}.t-warm{fill:#F9F0E2}.t-green{fill:#E6F2EC}" +
    ".t-violet{fill:#EFEAF7}.t-red{fill:#F8E9E5}" +
    ".nlabel{font-size:12px;fill:#16302F;font-weight:500}" +
    ".swatch{stroke-width:5}" +
    ".legend{font-size:10.5px;fill:#4E6265}" +
    ".s-ink{stroke:#16302F}.f-ink{fill:#16302F}" +
    ".s-muted{stroke:#6E8285}.f-muted{fill:#6E8285}" +
    ".s-cool{stroke:#1B6E8C}.f-cool{fill:#1B6E8C}" +
    ".s-warm{stroke:#C2701A}.f-warm{fill:#9C5A12}" +
    ".s-green{stroke:#2E7D5B}.f-green{fill:#2E7D5B}" +
    ".s-violet{stroke:#7A5AA6}.f-violet{fill:#7A5AA6}" +
    ".s-red{stroke:#B2442F}.f-red{fill:#B2442F}" +
    // two-tone palette (DF-9, softened in DF-10): event BANDS and legend
    // swatches take a soft mid-tone variant of each hue — the band is a
    // quiet highlight the ink dash rides over, not a saturated bar fighting
    // it — while node outlines, graph edges, freeforms and text keep the
    // deep variant (a thin line or a glyph wants dark). Validated:
    // adjacent-pair CVD in band with every extent directly labelled,
    // normal-vision dE >= 16, chroma and lightness in range.
    ".event.s-cool,.swatch.s-cool{stroke:#4FA7D5}" +
    ".event.s-warm,.swatch.s-warm{stroke:#E39A45}" +
    ".event.s-green,.swatch.s-green{stroke:#4EB183}" +
    ".event.s-violet,.swatch.s-violet{stroke:#A58BD3}" +
    ".event.s-red,.swatch.s-red{stroke:#DC8168}" +
    // wireframe vocabulary (DF-11) — every colour is an existing palette
    // token: panel/field strokes are muted, separators the plate border
    // grey, greek text bars the context grey with the slate step for
    // headings. Buttons/bands/tiles reuse the t-hue tints + s-hue strokes,
    // so a screenshot's saturated fill lands as the same quiet colour
    // field the rest of the corpus uses.
    ".wf-panel{fill:#FFFFFF;stroke:#6E8285;stroke-width:1.4}" +
    ".wf-box{fill:none;stroke:#6E8285;stroke-width:1.1}" +
    ".wf-field{fill:#FFFFFF;stroke:#6E8285;stroke-width:1.1}" +
    ".wf-btn{stroke-width:1.2}" +
    ".wf-sep{stroke:#D7DFDF;stroke-width:1}" +
    ".wf-gk{fill:#B9C6C6}.wf-gkh{fill:#4E6265}.wf-gkp{fill:#FFFFFF}" +
    // DF-12: transcribed rows render as real text in the same three
    // roles the bars used — body slate, heading ink, on-fill. The bars'
    // on-fill WHITE does not carry over: the source's saturated fill
    // lands on a soft palette tint, and white-on-tint is unreadable, so
    // on-fill text takes the ink (readable on every t-hue field). Size
    // rides per-element — it tracks each row's own scanned height.
    ".wf-tx{fill:#4E6265}.wf-txh{fill:#16302F;font-weight:600}.wf-txp{fill:#16302F;font-weight:500}" +
    "text{font-family:'Segoe UI',system-ui,Roboto,'Helvetica Neue',Arial,sans-serif}" +
    ".measure{font-size:11px;fill:#6E8285;font-variant-numeric:tabular-nums}" +
    ".id{font-size:12.5px;font-weight:600}.note{font-size:12px;fill:#16302F}" +
    "</style>" +
    // SOLID heads: a notched (stealth) head is a see-through cutout over the
    // line's final pixels — the line shows inside the arrow. refX 6 keeps the
    // line end behind the tip where the triangle is already wider than the
    // line, so the cap can't poke out sideways near the point. 4.4 marker
    // units at route weight is a ~13px head (DF-8 — the 5.2 head outweighed
    // the slimmer dashed route).
    '<defs><marker id="ar" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4.4" ' +
    'markerHeight="4.4" orient="auto-start-reverse">' +
    '<path d="M0 0.7 L8 4 L0 7.3 z" fill="#16302F"/></marker>' +
    '<marker id="ae" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4.4" ' +
    'markerHeight="4.4" orient="auto-start-reverse">' +
    '<path d="M0 0.7 L8 4 L0 7.3 z" fill="#4E6265"/></marker></defs>';
}

function svgWrap(no: number, w: number, h: number, title: string, desc: string, body: string): string {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + fnum(w) + " " + fnum(h) +
    '" width="' + fnum(w) + '" height="' + fnum(h) + '" role="img" aria-label="' + esc(title) + '">' +
    "<title>" + esc(title) + "</title><desc>" + esc(desc) + "</desc>" + figStyle() +
    '<rect class="plate" x="1" y="1" width="' + fnum(w - 2) + '" height="' + fnum(h - 2) + '" rx="6"/>' +
    body + "</svg>";
}

// ------------------------------------------------- vector slides: as drawn
// Roles come from geometry: within a band of collinear lines the longest is
// the route, shorter lines over it are event extents, perpendicular stubs are
// ruler ticks, diagonals are callout leaders. Near-duplicate lines (decks
// paste shapes on top of each other) collapse to one.
function classifyLines(raw: FRaw[]): { r: FRaw; role: string }[] {
  const out: { r: FRaw; role: string }[] = [];
  const band = 8.0;
  for (let pass = 0; pass < 2; pass++) {
    const horiz = pass === 0;
    const grp = raw.filter((r) => (Math.abs(r.h) <= Math.abs(r.w)) === horiz);
    const bands: { [k: string]: FRaw[] } = {};
    for (const r of grp) {
      const key = String(Math.round((horiz ? (r.y1 + r.y2) / 2 : (r.x1 + r.x2) / 2) / band));
      if (!bands[key]) bands[key] = [];
      bands[key].push(r);
    }
    for (const key in bands) {
      const items = bands[key];
      const len = (r: FRaw) => (horiz ? Math.abs(r.w) : Math.abs(r.h));
      let longest = 0;
      for (const r of items) if (len(r) > longest) longest = len(r);
      items.sort((a, b) => len(b) - len(a));
      const seen: FRaw[] = [];
      const keep: FRaw[] = [];
      for (const r of items) {
        let dup = false;
        for (const s of seen) {
          if (Math.abs(r.x1 - s.x1) < 3 && Math.abs(r.y1 - s.y1) < 3 &&
              Math.abs(r.x2 - s.x2) < 3 && Math.abs(r.y2 - s.y2) < 3) { dup = true; break; }
        }
        if (dup) continue;
        seen.push(r);
        const ln = len(r);
        let role: string;
        if (Math.min(Math.abs(r.w), Math.abs(r.h)) > 3) role = "leader";
        else if (longest < 26) role = "tick";
        else if (ln >= longest * 0.9) role = "route";
        else if (ln >= longest * 0.08) role = "event";
        else role = "tick";
        out.push({ r: r, role: role });
        keep.push(r);
      }
      // Route vs event by COLOUR COVERAGE, not by which line is longest.
      // One deck draws a full-width navy route with black/amber events over
      // it; another lays four default-coloured route segments end to end with
      // one cyan event on top. In both, the colour whose lines cover the most
      // ground is the route and every other colour is an extent.
      const cover: { [c: string]: number } = {};
      let bars = 0;
      for (const r of keep) {
        const role = out[out.length - keep.length + keep.indexOf(r)];
        if (!role || (role.role !== "route" && role.role !== "event")) continue;
        bars++;
        const k = r.col || "-";
        cover[k] = (cover[k] || 0) + len(r);
      }
      if (bars > 1) {
        let bestC = "", bestV = -1;
        for (const c in cover) if (cover[c] > bestV) { bestV = cover[c]; bestC = c; }
        for (const o of out) {
          if (o.role !== "route" && o.role !== "event") continue;
          if (keep.indexOf(o.r) < 0) continue;
          o.role = (o.r.col || "-") === bestC ? "route" : "event";
        }
      }
    }
  }
  return out;
}

// dash patterns normalise to two canonical dashes: anything dotted reads as
// "dotted", every other prstDash as "dashed" — one rhythm across the corpus
function figDash(b: string): string {
  const m = b.match(/<a:prstDash val="([^"]+)"/);
  if (!m) return "";
  const v = m[1].toLowerCase();
  if (v === "solid") return "";
  return v.indexOf("dot") >= 0 && v.indexOf("dash") < 0 ? "dotted" : "dashed";
}

// theme accents are not resolved through the theme part (too deep for a
// pasted script); they map to palette slots by INDEX, which is just as
// deterministic across the corpus as the hue-family rule is for srgb
const SCHEME_SLOT: { [k: string]: string } = {
  accent1: "cool", accent2: "warm", accent3: "green",
  accent4: "violet", accent5: "red", accent6: "muted",
};

// xfrm rot is 1/60000ths of a degree, applied about the shape centre
function figRot(attrs: string): number {
  const m = attrs.match(/rot="(-?\d+)"/);
  if (!m) return 0;
  return (((parseInt(m[1], 10) / 60000) % 360) + 360) % 360;
}

function rotPt(x: number, y: number, cx: number, cy: number, rad: number): number[] {
  const c = Math.cos(rad), s = Math.sin(rad);
  const dx = x - cx, dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

function pushLine(lines: FRaw[], gs: FGroup[], at: number, b: string): void {
  const o = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
  const e = b.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
  if (!o || !e) return;
  const t = figXform(gs, at, parseInt(o[1], 10), parseInt(o[2], 10),
                     parseInt(e[1], 10), parseInt(e[2], 10));
  const xf = b.match(/<a:xfrm([^>]*)>/);
  const fl = xf ? xf[1] : "";
  const X = t[0] * EMU_PX, Y = t[1] * EMU_PX, W = t[2] * EMU_PX, H = t[3] * EMU_PX;
  const lnB = (b.match(/<a:ln\b[\s\S]*?<\/a:ln>/) || [""])[0];
  const c = lnB.match(/<a:srgbClr val="([0-9A-Fa-f]{6})"/);
  const arrow = /<a:(?:tailEnd|headEnd) type="(?:triangle|arrow|stealth)"/.test(lnB);
  const prst = (b.match(/<a:prstGeom prst="([^"]+)"/) || ["", ""])[1];
  let x1 = fl.indexOf('flipH="1"') >= 0 ? X + W : X;
  let y1 = fl.indexOf('flipV="1"') >= 0 ? Y + H : Y;
  let x2 = fl.indexOf('flipH="1"') >= 0 ? X : X + W;
  let y2 = fl.indexOf('flipV="1"') >= 0 ? Y : Y + H;
  const rot = figRot(fl);
  if (rot !== 0) {
    // flips picked the corners; rotation turns them about the centre, exactly
    const rad = rot * Math.PI / 180;
    const p1 = rotPt(x1, y1, X + W / 2, Y + H / 2, rad);
    const p2 = rotPt(x2, y2, X + W / 2, Y + H / 2, rad);
    x1 = p1[0]; y1 = p1[1]; x2 = p2[0]; y2 = p2[1];
  }
  lines.push({ x1: x1, y1: y1, x2: x2, y2: y2,
    w: rot !== 0 ? x2 - x1 : W, h: rot !== 0 ? y2 - y1 : H,
    col: c ? c[1] : "", dash: figDash(lnB), arrow: arrow,
    bent: /bentConnector/.test(prst) });
}

// freeform custGeom → SVG path, path-space scaled into the shape's extent.
// moveTo/lnTo/cubicBezTo/quadBezTo/close cover what these decks draw; arcTo
// is not emitted (its endpoint is implicit, so a wrong guess draws a wrong
// curve — omission is the honest failure).
function figFreeform(pp: string, X: number, Y: number, W: number, H: number, rot: number): FPath | null {
  const cg = pp.match(/<a:custGeom>[\s\S]*?<\/a:custGeom>/);
  if (!cg) return null;
  const out: string[] = [];
  let closed = false;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const rad = rot * Math.PI / 180;
  const pre = /<a:path w="(\d+)" h="(\d+)"[^>]*>([\s\S]*?)<\/a:path>/g;
  let pm: RegExpExecArray | null;
  while ((pm = pre.exec(cg[0])) !== null) {
    const sx = W / (parseInt(pm[1], 10) || 1), sy = H / (parseInt(pm[2], 10) || 1);
    const tok = /<a:(moveTo|lnTo|cubicBezTo|quadBezTo|close)\b|<a:pt x="(-?\d+)" y="(-?\d+)"/g;
    let cmd = "";
    let pts: number[][] = [];
    const flush = (): void => {
      const P = (i: number): string => {
        let px = X + pts[i][0] * sx, py = Y + pts[i][1] * sy;
        if (rot !== 0) {
          const rp = rotPt(px, py, X + W / 2, Y + H / 2, rad);
          px = rp[0]; py = rp[1];
        }
        x0 = Math.min(x0, px); x1 = Math.max(x1, px);
        y0 = Math.min(y0, py); y1 = Math.max(y1, py);
        return fnum(px) + " " + fnum(py);
      };
      if (cmd === "moveTo" && pts.length >= 1) out.push("M " + P(0));
      else if (cmd === "lnTo" && pts.length >= 1) out.push("L " + P(0));
      else if (cmd === "cubicBezTo" && pts.length >= 3) out.push("C " + P(0) + " " + P(1) + " " + P(2));
      else if (cmd === "quadBezTo" && pts.length >= 2) out.push("Q " + P(0) + " " + P(1));
      cmd = ""; pts = [];
    };
    let t2: RegExpExecArray | null;
    while ((t2 = tok.exec(pm[3])) !== null) {
      if (t2[1]) {
        flush();
        if (t2[1] === "close") closed = true;
        else cmd = t2[1];
      } else if (cmd) {
        pts.push([parseInt(t2[2], 10), parseInt(t2[3], 10)]);
      }
    }
    flush();
    if (closed && out.length) out.push("Z");
  }
  if (out.length < 2 || x0 > x1) return null;
  const lnB = (pp.match(/<a:ln\b[\s\S]*?<\/a:ln>/) || [""])[0];
  const col = (lnB.match(/<a:srgbClr val="([0-9A-Fa-f]{6})"/) || ["", ""])[1];
  const fillPart = lnB ? pp.slice(0, pp.indexOf(lnB)) : pp;
  const fCol = (fillPart.match(/<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/) || ["", ""])[1];
  const filled = closed && fillPart.indexOf("<a:solidFill>") >= 0;
  return { d: out.join(" "), x0: x0, y0: y0, x1: x1, y1: y1,
    role: figRole(col, "ink"), dash: figDash(lnB),
    closed: closed, fillRole: filled ? figRole(fCol, "muted") : "" };
}

// one pass over the slide: every graphic primitive, classified at parse time
// into lines / nodes / freeform paths / loose labels
function parseSlide(xml: string): Parsed {
  const gs = figGroups(xml);
  const lines: FRaw[] = [];
  const nodes: FNode[] = [];
  const paths: FPath[] = [];
  const texts: FText[] = [];
  let m: RegExpExecArray | null;
  const cre = /<p:cxnSp>([\s\S]*?)<\/p:cxnSp>/g;
  while ((m = cre.exec(xml)) !== null) pushLine(lines, gs, m.index, m[1]);
  const sre = /<p:sp>([\s\S]*?)<\/p:sp>/g;
  while ((m = sre.exec(xml)) !== null) {
    const b = m[1];
    if (b.indexOf("<p:ph") >= 0) continue;
    const o = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const e = b.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    if (!o || !e) continue;
    const pp = (b.match(/<p:spPr>[\s\S]*?<\/p:spPr>/) || [""])[0];
    const prst = (pp.match(/<a:prstGeom prst="([^"]+)"/) || ["", ""])[1];
    // decks draw "lines" as shapes as often as connectors
    if (/^(line|straightConnector\d*|bentConnector\d*|curvedConnector\d*)$/.test(prst)) {
      pushLine(lines, gs, m.index, b);
      continue;
    }
    const g = figXform(gs, m.index, parseInt(o[1], 10), parseInt(o[2], 10),
                       parseInt(e[1], 10), parseInt(e[2], 10));
    let X = g[0] * EMU_PX, Y = g[1] * EMU_PX, W = g[2] * EMU_PX, H = g[3] * EMU_PX;
    const xfA = (pp.match(/<a:xfrm([^>]*)>/) || ["", ""])[1];
    let rot = figRot(xfA);
    if (pp.indexOf("<a:custGeom>") >= 0) {
      const fp = figFreeform(pp, X, Y, W, H, rot);
      if (fp) { paths.push(fp); continue; }
    }
    // rotation normalises where it can: a near-quarter turn is an
    // axis-aligned swap about the centre (the label stays horizontal), a
    // near-half or near-zero turn changes nothing a symmetric node shows;
    // only a genuinely oblique angle survives to a real rotate() — and even
    // then the label stays horizontal, because rotated text is unreadable
    if ((rot > 70 && rot < 110) || (rot > 250 && rot < 290)) {
      const cx0 = X + W / 2, cy0 = Y + H / 2;
      const t0 = W; W = H; H = t0;
      X = cx0 - W / 2; Y = cy0 - H / 2;
      rot = 0;
    } else if (rot < 20 || rot > 340 || (rot > 160 && rot < 200)) {
      rot = 0;
    }
    const parts: string[] = [];
    const tre = /<a:t>([^<]*)<\/a:t>/g;
    let tm: RegExpExecArray | null;
    while ((tm = tre.exec(b)) !== null) { const v = tm[1].trim(); if (v) parts.push(v); }
    const t = parts.join(" ").replace(/\s+/g, " ").trim();
    // node vs loose label: a NODE is a shape the deck made visible — an
    // explicit fill or outline in spPr, or a themed <p:style> fill/line
    // reference. Plain textboxes have neither, which is what keeps prose
    // slides silent.
    const lnB = (pp.match(/<a:ln\b[\s\S]*?<\/a:ln>/) || [""])[0];
    const fillPart = lnB ? pp.slice(0, pp.indexOf(lnB)) : pp;
    const fillCol = (fillPart.match(/<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/) || ["", ""])[1];
    const fillSolid = fillPart.indexOf("<a:solidFill>") >= 0;
    const lnSolid = lnB.indexOf("<a:solidFill>") >= 0;
    const lnCol = (lnB.match(/<a:srgbClr val="([0-9A-Fa-f]{6})"/) || ["", ""])[1];
    const st = (b.match(/<p:style>[\s\S]*?<\/p:style>/) || [""])[0];
    const stFill = (st.match(/<a:fillRef idx="[1-9]\d*">\s*<a:schemeClr val="(\w+)"/) || ["", ""])[1];
    const stLn = (st.match(/<a:lnRef idx="[1-9]\d*">\s*<a:schemeClr val="(\w+)"/) || ["", ""])[1];
    if (fillSolid || lnSolid || stFill || stLn) {
      // a visible box holding a case line or long prose is the slide's
      // TITLE/caption, not a diagram node — the decks frame their case text
      // in an outlined box above the drawing. Its text already reaches the
      // sidecar body (and the case heading) through the extractor, so the
      // figure drops the box rather than duplicating a paragraph into the
      // drawing (DF-5).
      if (t.length > 56 || (t.length > 30 && /^\d{1,3}[.)]\s/.test(t))) continue;
      let tRole = "plain";
      if (fillSolid) tRole = fillCol ? figRole(fillCol, "plain") : "plain";
      else if (SCHEME_SLOT[stFill]) tRole = SCHEME_SLOT[stFill];
      let sRole = "ink";
      if (lnSolid && lnCol) sRole = figRole(lnCol, "ink");
      else if (!lnSolid && tRole !== "plain") sRole = tRole;
      const fam = /ellipse|flowChartConnector|donut|chord|pie|^arc$/.test(prst) ? "ellipse"
        : (/diamond|flowChartDecision/.test(prst) ? "diamond" : "box");
      nodes.push({ x: X, y: Y, w: W, h: H, shape: fam, sRole: sRole, tRole: tRole,
        label: t.length > 56 ? t.slice(0, 53) + "…" : t, rot: rot });
      continue;
    }
    if (!t || t.length > 24 || t.split(" ").length > 3) continue;
    const c = b.match(/<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/);
    const numeric = /^\d+(\.\d+)?$/.test(t);
    texts.push({ x: X + W / 2, y: Y + H / 2, t: t,
      cls: (numeric ? "measure" : "id") + " f-" +
           figRole(c ? c[1] : "", numeric ? "muted" : "ink"), anchor: "middle" });
  }
  return { lines: lines, nodes: nodes, paths: paths, texts: texts };
}

// a rotated node's real extent: rotate the corners, take the envelope
function nodeBounds(n: FNode): number[] {
  if (n.rot === 0) return [n.x, n.y, n.x + n.w, n.y + n.h];
  const rad = n.rot * Math.PI / 180;
  const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const corners = [[n.x, n.y], [n.x + n.w, n.y], [n.x, n.y + n.h], [n.x + n.w, n.y + n.h]];
  for (const c of corners) {
    const p = rotPt(c[0], c[1], cx, cy, rad);
    x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]);
    y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
  }
  return [x0, y0, x1, y1];
}

// ---------------------------------------------- node layout normalisation
// The rulers already treat hand-placement as noise; nodes get the same
// treatment. Near-equal sizes equalise to the group median (±20% buckets,
// resized about the centre), then rows and columns whose centres jitter
// within tolerance snap to one shared centre. Sizes first: equalising is
// centre-preserving, so it cannot undo a snap.
function snapNodes(nodes: FNode[]): void {
  if (nodes.length < 2) return;
  const med = (arr: number[]): number => {
    const s = arr.slice().sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  const eq = (get: (n: FNode) => number, set: (n: FNode, v: number) => void): void => {
    const idx: number[] = nodes.map((n, i) => i);
    idx.sort((a, b) => get(nodes[a]) - get(nodes[b]));
    let s = 0;
    while (s < idx.length) {
      let e = s;
      while (e + 1 < idx.length && get(nodes[idx[e + 1]]) <= get(nodes[idx[s]]) * 1.2) e++;
      if (e > s) {
        const v = get(nodes[idx[Math.floor((s + e) / 2)]]);
        for (let k = s; k <= e; k++) set(nodes[idx[k]], v);
      }
      s = e + 1;
    }
  };
  eq((n) => n.w, (n, v) => { n.x += (n.w - v) / 2; n.w = v; });
  eq((n) => n.h, (n, v) => { n.y += (n.h - v) / 2; n.h = v; });
  const snapAxis = (getC: (n: FNode) => number, move: (n: FNode, d: number) => void,
                    tol: number): void => {
    const idx: number[] = nodes.map((n, i) => i);
    idx.sort((a, b) => getC(nodes[a]) - getC(nodes[b]));
    let s = 0;
    while (s < idx.length) {
      let e = s;
      while (e + 1 < idx.length && getC(nodes[idx[e + 1]]) - getC(nodes[idx[e]]) <= tol) e++;
      if (e > s) {
        let m = 0;
        for (let k = s; k <= e; k++) m += getC(nodes[idx[k]]);
        m /= (e - s + 1);
        for (let k = s; k <= e; k++) move(nodes[idx[k]], m - getC(nodes[idx[k]]));
      }
      s = e + 1;
    }
  };
  snapAxis((n) => n.y + n.h / 2, (n, d) => { n.y += d; },
           Math.max(14, med(nodes.map((n) => n.h)) * 0.45));
  snapAxis((n) => n.x + n.w / 2, (n, d) => { n.x += d; },
           Math.max(14, med(nodes.map((n) => n.w)) * 0.45));
}

// ---------------------------------------------------- connector routing
// which node (if any) an edge endpoint belongs to: inside, or within
// ANCHOR_PAD of, the node's box — hand-dragged connectors rarely land
// exactly on the shape they mean
function nearNode(nodes: FNode[], x: number, y: number, skip: number): number {
  let best = -1, bd = 1e9;
  for (let i = 0; i < nodes.length; i++) {
    if (i === skip) continue;
    const n = nodes[i];
    if (x < n.x - ANCHOR_PAD || x > n.x + n.w + ANCHOR_PAD) continue;
    if (y < n.y - ANCHOR_PAD || y > n.y + n.h + ANCHOR_PAD) continue;
    const d = Math.abs(x - (n.x + n.w / 2)) + Math.abs(y - (n.y + n.h / 2));
    if (d < bd) { bd = d; best = i; }
  }
  return best;
}

// the point where the ray from the node's centre toward (tx,ty) exits the
// shape — closed forms for all three families
function anchorPoint(n: FNode, tx: number, ty: number): number[] {
  const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
  let dx = tx - cx, dy = ty - cy;
  const L = Math.sqrt(dx * dx + dy * dy);
  if (L < 1e-6) return [cx, cy];
  dx /= L; dy /= L;
  const hw = n.w / 2 || 1e-6, hh = n.h / 2 || 1e-6;
  let t: number;
  if (n.shape === "ellipse") t = 1 / Math.sqrt((dx * dx) / (hw * hw) + (dy * dy) / (hh * hh));
  else if (n.shape === "diamond") t = 1 / (Math.abs(dx) / hw + Math.abs(dy) / hh);
  else t = 1 / Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh);
  return [cx + dx * t, cy + dy * t];
}

// -------------------------------------------------- diagram clustering
// One slide often carries SEVERAL diagrams (an input row and a result row,
// or two cases side by side). Graphic primitives cluster by union-find over
// their bounding boxes: boxes merge when the clear air between them is under
// CLUST_GX horizontally AND CLUST_GY vertically — stacked bands of one
// diagram stay together, genuinely separate drawings split. Loose labels
// then join the nearest cluster within TEXT_REACH (labels never bridge two
// clusters into one); a label near nothing is debris and is dropped.
function clusterParsed(p: Parsed): Cluster[] {
  const boxes: number[][] = [];
  const kinds: string[] = [];
  const refs: number[] = [];
  for (let i = 0; i < p.lines.length; i++) {
    const l = p.lines[i];
    boxes.push([Math.min(l.x1, l.x2), Math.min(l.y1, l.y2),
                Math.max(l.x1, l.x2), Math.max(l.y1, l.y2)]);
    kinds.push("l"); refs.push(i);
  }
  for (let i = 0; i < p.nodes.length; i++) {
    boxes.push(nodeBounds(p.nodes[i]));
    kinds.push("n"); refs.push(i);
  }
  for (let i = 0; i < p.paths.length; i++) {
    const q = p.paths[i];
    boxes.push([q.x0, q.y0, q.x1, q.y1]);
    kinds.push("p"); refs.push(i);
  }
  if (boxes.length === 0) return [];
  const parent: number[] = [];
  for (let i = 0; i < boxes.length; i++) parent.push(i);
  const find = (i: number): number => {
    while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; }
    return i;
  };
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const gx = Math.max(a[0], b[0]) - Math.min(a[2], b[2]);
      const gy = Math.max(a[1], b[1]) - Math.min(a[3], b[3]);
      if (gx < CLUST_GX && gy < CLUST_GY) parent[find(i)] = find(j);
    }
  }
  const byRoot: { [r: string]: Cluster } = {};
  const order: string[] = [];
  for (let i = 0; i < boxes.length; i++) {
    const r = String(find(i));
    if (!byRoot[r]) {
      byRoot[r] = { lines: [], nodes: [], paths: [], texts: [],
                    x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
      order.push(r);
    }
    const c = byRoot[r];
    if (kinds[i] === "l") c.lines.push(p.lines[refs[i]]);
    else if (kinds[i] === "n") c.nodes.push(p.nodes[refs[i]]);
    else c.paths.push(p.paths[refs[i]]);
    c.x0 = Math.min(c.x0, boxes[i][0]); c.y0 = Math.min(c.y0, boxes[i][1]);
    c.x1 = Math.max(c.x1, boxes[i][2]); c.y1 = Math.max(c.y1, boxes[i][3]);
  }
  const clusters: Cluster[] = [];
  for (const r of order) clusters.push(byRoot[r]);
  for (const t of p.texts) {
    let best: Cluster | null = null;
    let bd = TEXT_REACH;
    for (const c of clusters) {
      const dx = Math.max(c.x0 - t.x, t.x - c.x1, 0);
      const dy = Math.max(c.y0 - t.y, t.y - c.y1, 0);
      const d = Math.max(dx, dy);
      if (d < bd) { best = c; bd = d; }
    }
    if (best) best.texts.push(t);
  }
  clusters.sort((a, b) => (a.y0 - b.y0) || (a.x0 - b.x0));
  return clusters;
}

// which lane draws a cluster: "ruler" is the measured-route language (the
// v1.0 pipeline), "graph" is the node/edge/freeform language, "" is silence
function clusterMode(c: Cluster): string {
  const cls = classifyLines(c.lines);
  let routes = 0, ticks = 0, events = 0;
  for (const x of cls) {
    if (x.role === "route") routes++;
    else if (x.role === "tick") ticks++;
    else if (x.role === "event") events++;
  }
  // a route plus either a measure ruler or an event extent; decks in this
  // corpus do one or the other, rarely both
  if (routes > 0 && (ticks >= 3 || events > 0)) return "ruler";
  if (c.nodes.length >= 2 && c.lines.length + c.paths.length >= 1) return "graph";
  if (c.paths.length >= 2) return "graph";
  return "";
}

function figName(no: number, idx: number, total: number): string {
  return total > 1 ? "slide" + no + "_fig" + idx + ".svg" : "slide" + no + ".svg";
}

// ------------------------------------------------------- table anchoring
// cell text as the extracted markdown renders it: tags flattened to the run
// texts, whitespace collapsed, entities decoded (the strip pipeline decodes
// them too, and the anchor must match the row the reader sees)
function cellText(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (mm: string, h: string) => {
      const cp = parseInt(h, 16);
      return isFinite(cp) && cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
    })
    .replace(/&#(\d+);/g, (mm: string, d: string) => {
      const cp = parseInt(d, 10);
      return isFinite(cp) && cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
    })
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ").trim();
}

// graphicFrame tables, with their placement. The anchor pass needs to know
// where each table sits; the redraw lane reads its numbers from the rows.
// Cells mirror the markdown rendering (merged-away hMerge cells dropped,
// gridSpan padded), so a first row here IS the table's first markdown row.
function slideTables(xml: string): FTable[] {
  const gs = figGroups(xml);
  const out: FTable[] = [];
  const fre = /<p:graphicFrame>([\s\S]*?)<\/p:graphicFrame>/g;
  let m: RegExpExecArray | null;
  while ((m = fre.exec(xml)) !== null) {
    const b = m[1];
    const tb = b.match(/<a:tbl>[\s\S]*?<\/a:tbl>/);
    if (!tb) continue;
    const rows: string[][] = [];
    const rre = /<a:tr\b[\s\S]*?<\/a:tr>/g;
    let rm: RegExpExecArray | null;
    while ((rm = rre.exec(tb[0])) !== null) {
      const cells = rm[0].split(/<a:tc\b/);
      const row: string[] = [];
      for (let j = 1; j < cells.length; j++) {
        const raw = cells[j];
        const opener = (raw.match(/^[^>]*/) || [""])[0];
        if (/\bhMerge="(1|true)"/.test(opener)) continue;
        let span = 1;
        const gsp = opener.match(/gridSpan="(\d+)"/);
        if (gsp) span = parseInt(gsp[1], 10);
        const bits: string[] = [];
        const tre = /<a:t>([^<]*)<\/a:t>/g;
        let tm: RegExpExecArray | null;
        while ((tm = tre.exec(raw)) !== null) bits.push(tm[1]);
        row.push(cellText(bits.join(" ")));
        for (let s = 1; s < span; s++) row.push("");
      }
      if (row.length > 0) rows.push(row);
    }
    if (rows.length === 0) continue;
    const o = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const e = b.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    let x = NaN, y = NaN, w = NaN, h = NaN;
    if (o && e) {
      const t = figXform(gs, m.index, parseInt(o[1], 10), parseInt(o[2], 10),
                         parseInt(e[1], 10), parseInt(e[2], 10));
      x = t[0] * EMU_PX; y = t[1] * EMU_PX; w = t[2] * EMU_PX; h = t[3] * EMU_PX;
    }
    out.push({ x: x, y: y, w: w, h: h, rows: rows });
  }
  return out;
}

// which table a drawn/traced figure sits with, by geometry: the table
// sharing the cluster's vertical band (largest overlap wins), else the
// nearest table that starts below the cluster's middle — the two ways these
// decks pair a diagram with the table stating its numbers. A table anchors
// at most one figure, and a table wholly above the cluster never anchors it
// (that table belongs to whatever sits above).
function assignAnchors(figs: SlideFigure[], spans: number[][], tables: FTable[]): void {
  const used: boolean[] = [];
  for (let i = 0; i < figs.length && i < spans.length; i++) {
    const y0 = spans[i][0], y1 = spans[i][1];
    let ovIdx = -1, ovBest = 0, gapIdx = -1, gapBest = 1e9;
    for (let t = 0; t < tables.length; t++) {
      if (used[t]) continue;
      const tb = tables[t];
      if (!isFinite(tb.y) || !isFinite(tb.h) || tb.rows[0].length === 0) continue;
      const ov = Math.min(y1, tb.y + tb.h) - Math.max(y0, tb.y);
      if (ov > 0) {
        if (ov > ovBest) { ovBest = ov; ovIdx = t; }
      } else if (tb.y >= (y0 + y1) / 2) {
        const gap = tb.y - y1;
        if (gap < gapBest) { gapBest = gap; gapIdx = t; }
      }
    }
    const best = ovIdx >= 0 ? ovIdx : gapIdx;
    if (best >= 0) {
      used[best] = true;
      figs[i].anchor = tables[best].rows[0].slice();
    }
  }
}

function wrapLabel(s: string): string[] {
  if (s.length <= 18) return [s];
  let best = -1;
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) !== " ") continue;
    if (best < 0 || Math.abs(i - s.length / 2) < Math.abs(best - s.length / 2)) best = i;
  }
  if (best < 0) return [s];
  return [s.slice(0, best), s.slice(best + 1)];
}

// a node renders in one of three standardized families — box (one corner
// radius for the whole corpus), ellipse, diamond — with a palette-tinted
// fill, a palette stroke, and its label centred and wrapped to two lines
function emitNode(n: FNode): string {
  const cls = "node t-" + n.tRole + " s-" + n.sRole;
  const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
  // oblique angles rotate the OUTLINE only — the label stays horizontal,
  // because rotated text is unreadable (quarter turns were normalised away
  // at parse time and never reach here)
  const tf = n.rot !== 0
    ? ' transform="rotate(' + fnum(n.rot) + " " + fnum(cx) + " " + fnum(cy) + ')"' : "";
  let shape: string;
  if (n.shape === "ellipse") {
    shape = '<ellipse class="' + cls + '" cx="' + fnum(cx) + '" cy="' + fnum(cy) +
      '" rx="' + fnum(n.w / 2) + '" ry="' + fnum(n.h / 2) + '"' + tf + "/>";
  } else if (n.shape === "diamond") {
    shape = '<polygon class="' + cls + '" points="' +
      fnum(cx) + "," + fnum(n.y) + " " + fnum(n.x + n.w) + "," + fnum(cy) + " " +
      fnum(cx) + "," + fnum(n.y + n.h) + " " + fnum(n.x) + "," + fnum(cy) + '"' + tf + "/>";
  } else {
    shape = '<rect class="' + cls + '" x="' + fnum(n.x) + '" y="' + fnum(n.y) +
      '" width="' + fnum(n.w) + '" height="' + fnum(n.h) + '" rx="' + String(NODE_RX) + '"' +
      tf + "/>";
  }
  if (!n.label) return shape;
  const rows = wrapLabel(n.label);
  let txt = "";
  for (let i = 0; i < rows.length; i++) {
    const y = cy + (i - (rows.length - 1) / 2) * 15;
    txt += '<text class="nlabel" x="' + fnum(cx) + '" y="' + fnum(y) +
      '" text-anchor="middle" dominant-baseline="central">' + esc(rows[i]) + "</text>";
  }
  return shape + txt;
}

// ------------------------------------------------------- legend synthesis
// colour carries meaning in this corpus ("both events after split will be
// highlighted in different colours"), so a figure whose extents use two or
// more palette colours states what each one is: a butt-capped swatch in the
// extent's own class plus a label. The swatch class is `swatch`, NOT
// `event`, so nothing that measures event extents ever counts a legend.
function emitLegend(entries: { role: string; t: string }[], lx: number, ly: number): {
  svg: string; endX: number;
} {
  const p: string[] = [];
  let x = lx;
  for (const en of entries) {
    p.push('<line class="ln swatch flat s-' + en.role + '" x1="' + fnum(x) + '" y1="' + fnum(ly) +
      '" x2="' + fnum(x + 22) + '" y2="' + fnum(ly) + '"/>');
    p.push('<text class="legend" x="' + fnum(x + 28) + '" y="' + fnum(ly) +
      '" dominant-baseline="central">' + esc(en.t) + "</text>");
    x += 28 + en.t.length * 6.2 + 18;
  }
  return { svg: p.join(""), endX: x - 18 };
}

function emitPath(q: FPath): string {
  const dash = q.dash ? " " + q.dash : "";
  if (q.fillRole) {
    return '<path class="freefill t-' + q.fillRole + ' s-' + q.role + dash + '" d="' + q.d + '"/>';
  }
  return '<path class="ln free s-' + q.role + dash + '" d="' + q.d + '"/>';
}

// ruler lane: the v1.0 measured-route pipeline over one cluster, with any
// nodes/freeforms in the same cluster drawn behind-the-scenes intact. Band
// compression is skipped when they are present — compressBands cannot see
// them, and moving the ruler out from under a node it shares space with
// would misplace exactly the thing being kept.
function renderRuler(c: Cluster, no: number, idx: number, total: number,
                     traced?: boolean): SlideFigure {
  const cls = classifyLines(c.lines);
  const lines: FLine[] = [];
  for (const k of cls) {
    const r = k.r;
    let klass = k.role, extra = "";
    if (k.role === "event") { klass = "event flat"; extra = " s-" + figRole(r.col, "cool"); }
    lines.push({ x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y2, cls: klass, extra: extra });
  }
  const plain = c.nodes.length === 0 && c.paths.length === 0;
  const norm = normaliseRulers(lines, c.texts, plain);
  let body = emitVector(norm.lines, norm.texts, norm.splits, norm.rulers);
  const bb = bbox(norm.lines, norm.texts);
  for (const q of c.paths) {
    body = emitPath(q) + body;
    bb[0] = Math.min(bb[0], q.x0); bb[1] = Math.min(bb[1], q.y0);
    bb[2] = Math.max(bb[2], q.x1); bb[3] = Math.max(bb[3], q.y1);
  }
  for (const n of c.nodes) {
    body += emitNode(n);
    const nb = nodeBounds(n);
    bb[0] = Math.min(bb[0], nb[0]); bb[1] = Math.min(bb[1], nb[1]);
    bb[2] = Math.max(bb[2], nb[2]); bb[3] = Math.max(bb[3], nb[3]);
  }
  // legend: extents in two or more colours get named. The label is the id
  // the slide put on a bar of that colour when one exists; the default is a
  // letter, so two unlabelled colours still read as two different things.
  const evs = norm.lines.filter((l) => l.cls.indexOf("event") === 0)
    .slice().sort((a, b) => Math.min(a.x1, a.x2) - Math.min(b.x1, b.x2));
  const roles: string[] = [];
  for (const l of evs) {
    const rm2 = l.extra.match(/s-(\w+)/);
    const role = rm2 ? rm2[1] : "cool";
    if (roles.indexOf(role) < 0) roles.push(role);
  }
  if (roles.length >= 2) {
    const entries: { role: string; t: string }[] = [];
    for (let ri = 0; ri < roles.length; ri++) {
      let label = "";
      for (const l of evs) {
        if ((l.extra.match(/s-(\w+)/) || ["", "cool"])[1] !== roles[ri]) continue;
        const bx0 = Math.min(l.x1, l.x2) - 8, bx1 = Math.max(l.x1, l.x2) + 8;
        for (const t of norm.texts) {
          if (t.cls.indexOf("id") !== 0) continue;
          if (t.x >= bx0 && t.x <= bx1 && Math.abs(t.y - l.y1) < 40) { label = t.t; break; }
        }
        if (label) break;
      }
      entries.push({ role: roles[ri],
        t: label || "extent " + String.fromCharCode(65 + ri) });
    }
    const ly = bb[3] + LEGEND_GAP;
    const leg = emitLegend(entries, bb[0], ly);
    body += leg.svg;
    bb[3] = ly + 8;
    bb[2] = Math.max(bb[2], leg.endX);
  }
  const w = bb[2] - bb[0] + FIG_PAD * 2, h = bb[3] - bb[1] + FIG_PAD * 2;
  const shift = 'transform="translate(' + fnum(FIG_PAD - bb[0]) + "," + fnum(FIG_PAD - bb[1]) + ')"';
  const ms = norm.texts.filter((t) => t.cls.indexOf("measure") === 0).map((t) => t.t);
  const title = "Slide " + no + " route diagram" +
    (total > 1 ? " (" + idx + " of " + total + ")" : "");
  const desc = (traced
    ? "Route diagram vector-traced from the slide's pasted picture; positions are " +
      "approximate to the source image and colours are mapped to the corpus palette"
    : "Measured route diagram drawn from the slide's own shapes" +
      (ms.length ? ", measures " + ms[0] + " to " + ms[ms.length - 1] : "")) + ".";
  return { slide: no, name: figName(no, idx, total),
    svg: svgWrap(no, w, h, title, desc, "<g " + shift + ">" + body + "</g>"), alt: desc,
    anchor: [] };
}

// graph lane: nodes, connector edges (slate by default, palette-mapped when
// the source coloured them, arrowheads carried over, dashes normalised) and
// freeform paths, in z-order edges → freeforms → nodes → labels
function renderGraph(c: Cluster, no: number, idx: number, total: number): SlideFigure {
  const p: string[] = [];
  let x0 = c.x0, y0 = c.y0, x1 = c.x1, y1 = c.y1;
  snapNodes(c.nodes);
  for (const n of c.nodes) {
    const nb = nodeBounds(n);
    x0 = Math.min(x0, nb[0]); y0 = Math.min(y0, nb[1]);
    x1 = Math.max(x1, nb[2]); y1 = Math.max(y1, nb[3]);
  }
  for (const l of c.lines) {
    const extra = l.col ? " s-" + figRole(l.col, "ink") : "";
    const dash = l.dash ? " " + l.dash : "";
    const mk = l.arrow ? ' marker-end="url(#ae)"' : "";
    const ai = nearNode(c.nodes, l.x1, l.y1, -1);
    const bi = nearNode(c.nodes, l.x2, l.y2, ai);
    if (l.bent && ai >= 0 && bi >= 0) {
      // orthogonal route between facing node sides, elbows at the midline
      const A = c.nodes[ai], B = c.nodes[bi];
      const acx = A.x + A.w / 2, acy = A.y + A.h / 2;
      const bcx = B.x + B.w / 2, bcy = B.y + B.h / 2;
      let d: string;
      if (Math.abs(bcx - acx) >= Math.abs(bcy - acy)) {
        const s = bcx >= acx ? 1 : -1;
        const p1 = [acx + s * A.w / 2, acy], p2 = [bcx - s * B.w / 2, bcy];
        const mx = (p1[0] + p2[0]) / 2;
        d = "M " + fnum(p1[0]) + " " + fnum(p1[1]) + " L " + fnum(mx) + " " + fnum(p1[1]) +
          " L " + fnum(mx) + " " + fnum(p2[1]) + " L " + fnum(p2[0]) + " " + fnum(p2[1]);
      } else {
        const s = bcy >= acy ? 1 : -1;
        const p1 = [acx, acy + s * A.h / 2], p2 = [bcx, bcy - s * B.h / 2];
        const my = (p1[1] + p2[1]) / 2;
        d = "M " + fnum(p1[0]) + " " + fnum(p1[1]) + " L " + fnum(p1[0]) + " " + fnum(my) +
          " L " + fnum(p2[0]) + " " + fnum(my) + " L " + fnum(p2[0]) + " " + fnum(p2[1]);
      }
      p.push('<path class="ln edge' + extra + dash + '" d="' + d + '"' + mk + "/>");
      continue;
    }
    let p1 = [l.x1, l.y1], p2 = [l.x2, l.y2];
    if (l.bent) {
      // a bent connector with a free end still routes orthogonally
      const d = "M " + fnum(p1[0]) + " " + fnum(p1[1]) + " L " + fnum(p2[0]) + " " + fnum(p1[1]) +
        " L " + fnum(p2[0]) + " " + fnum(p2[1]);
      p.push('<path class="ln edge' + extra + dash + '" d="' + d + '"' + mk + "/>");
      continue;
    }
    if (ai >= 0) {
      p1 = anchorPoint(c.nodes[ai],
        bi >= 0 ? c.nodes[bi].x + c.nodes[bi].w / 2 : l.x2,
        bi >= 0 ? c.nodes[bi].y + c.nodes[bi].h / 2 : l.y2);
    }
    if (bi >= 0) {
      p2 = anchorPoint(c.nodes[bi],
        ai >= 0 ? c.nodes[ai].x + c.nodes[ai].w / 2 : p1[0],
        ai >= 0 ? c.nodes[ai].y + c.nodes[ai].h / 2 : p1[1]);
    }
    p.push('<line class="ln edge' + extra + dash + '" x1="' + fnum(p1[0]) + '" y1="' + fnum(p1[1]) +
      '" x2="' + fnum(p2[0]) + '" y2="' + fnum(p2[1]) + '"' + mk + "/>");
  }
  for (const q of c.paths) p.push(emitPath(q));
  for (const n of c.nodes) p.push(emitNode(n));
  for (const t of c.texts) {
    p.push('<text class="' + t.cls + '" x="' + fnum(t.x) + '" y="' + fnum(t.y) +
      '" text-anchor="' + t.anchor + '" dominant-baseline="central">' + esc(t.t) + "</text>");
    const wdt = t.t.length * 4 + 6;
    x0 = Math.min(x0, t.x - wdt); x1 = Math.max(x1, t.x + wdt);
    y0 = Math.min(y0, t.y - 9); y1 = Math.max(y1, t.y + 9);
  }
  const w = x1 - x0 + FIG_PAD * 2, h = y1 - y0 + FIG_PAD * 2;
  const shift = 'transform="translate(' + fnum(FIG_PAD - x0) + "," + fnum(FIG_PAD - y0) + ')"';
  const labels: string[] = [];
  for (const n of c.nodes) if (n.label) labels.push(n.label);
  const bits: string[] = [];
  if (c.nodes.length) {
    bits.push(c.nodes.length + " node" + (c.nodes.length === 1 ? "" : "s") +
      (labels.length ? " (" + labels.slice(0, 4).join(", ") + ")" : ""));
  }
  if (c.lines.length) bits.push(c.lines.length + " connector" + (c.lines.length === 1 ? "" : "s"));
  if (c.paths.length) bits.push(c.paths.length + " freeform path" + (c.paths.length === 1 ? "" : "s"));
  const title = "Slide " + no + " diagram" +
    (total > 1 ? " (" + idx + " of " + total + ")" : "");
  const desc = "Diagram drawn from the slide's own shapes: " + bits.join(", ") + ".";
  return { slide: no, name: figName(no, idx, total),
    svg: svgWrap(no, w, h, title, desc, "<g " + shift + ">" + p.join("") + "</g>"), alt: desc,
    anchor: [] };
}

function bbox(lines: FLine[], texts: FText[]): number[] {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const l of lines) {
    x0 = Math.min(x0, l.x1, l.x2); x1 = Math.max(x1, l.x1, l.x2);
    y0 = Math.min(y0, l.y1, l.y2); y1 = Math.max(y1, l.y1, l.y2);
  }
  for (const t of texts) {
    const wdt = t.t.length * 4 + 6;
    x0 = Math.min(x0, t.x - wdt); x1 = Math.max(x1, t.x + wdt);
    y0 = Math.min(y0, t.y - 9); y1 = Math.max(y1, t.y + 9);
  }
  if (x0 > x1) { x0 = 0; y0 = 0; x1 = 10; y1 = 10; }
  return [x0, y0, x1, y1];
}

function emitVector(lines: FLine[], texts: FText[], splits: number[][], rulers: FRuler[]): string {
  const p: string[] = [];
  // z-order matters: a route drawn BEFORE the extents laid over it vanished
  // under any bar that covered it (DF-8). Extents go to the BACK, ticks and
  // leaders over them, and the dashed route rides on top of everything —
  // its gaps let the extent colour read through, so neither buries the other.
  const order = (l: FLine): number =>
    l.cls === "route" ? 2 : (l.cls.indexOf("event") === 0 ? 0 : 1);
  // a route carries its direction arrow only where its band actually ENDS:
  // when another route/event line continues past this line's endpoint (route
  // segments laid end to end, or a traced extent covering the route beyond
  // the run that survived), an arrowhead there points mid-band (DF-5)
  const arrowOk = (l: FLine): boolean => {
    const dx = l.x2 - l.x1, dy = l.y2 - l.y1;
    const L = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / L, uy = dy / L;
    for (const o of lines) {
      if (o === l) continue;
      if (o.cls !== "route" && o.cls.indexOf("event") !== 0) continue;
      const ends = [[o.x1, o.y1], [o.x2, o.y2]];
      for (const e of ends) {
        const along = (e[0] - l.x2) * ux + (e[1] - l.y2) * uy;
        const across = Math.abs((e[1] - l.y2) * ux - (e[0] - l.x2) * uy);
        if (along > 4 && across <= 6) return false;
      }
    }
    return true;
  };
  const sorted = lines.slice().sort((a, b) => order(a) - order(b));
  for (const l of sorted) {
    p.push('<line class="ln ' + l.cls + l.extra + '" x1="' + fnum(l.x1) + '" y1="' + fnum(l.y1) +
      '" x2="' + fnum(l.x2) + '" y2="' + fnum(l.y2) + '"/>');
  }
  // arrowheads AFTER the extents, so nothing ever draws over one: each head
  // rides a short carrier retracing its route's own final pixels (invisible
  // under the solid head), and arrowOk keeps heads off ends where the band
  // continues past the line
  for (const l of lines) {
    if (l.cls !== "route" || !arrowOk(l)) continue;
    const dx = l.x2 - l.x1, dy = l.y2 - l.y1;
    const L = Math.sqrt(dx * dx + dy * dy) || 1;
    const f = Math.min(8, L) / L;
    p.push('<line class="ln route" x1="' + fnum(l.x2 - dx * f) + '" y1="' + fnum(l.y2 - dy * f) +
      '" x2="' + fnum(l.x2) + '" y2="' + fnum(l.y2) + '" marker-end="url(#ar)"/>');
  }
  for (const s of splits) {
    p.push('<line class="split" x1="' + fnum(s[0]) + '" y1="' + fnum(s[1] - SPLIT_ARM) +
      '" x2="' + fnum(s[0]) + '" y2="' + fnum(s[1] + SPLIT_ARM) + '"/>');
    p.push('<circle class="splitdot" cx="' + fnum(s[0]) + '" cy="' + fnum(s[1]) + '" r="' + fnum(DOT_R) + '"/>');
  }
  for (const t of texts) {
    p.push('<text class="' + t.cls + '" x="' + fnum(t.x) + '" y="' + fnum(t.y) +
      '" text-anchor="' + t.anchor + '" dominant-baseline="central">' + esc(t.t) + "</text>");
  }
  return p.join("");
}

// ------------------------------------------- component normalisation
// The decks place every part by hand, so a measure label lands wherever it
// was dragged (typically ~0.1in off its own tick) and adjoining extents
// overlap or gap by a few px at the very measure the test case is about.
// A ruler is therefore recognised as ONE component and re-laid out.
function normaliseRulers(lines: FLine[], texts: FText[], compress: boolean): {
  lines: FLine[]; texts: FText[]; splits: number[][]; rulers: FRuler[];
} {
  const band = 9.0;
  const outL: FLine[] = [], outT: FText[] = [], splits: number[][] = [], rulers: FRuler[] = [];
  const usedL: boolean[] = [], usedT: boolean[] = [];
  const relocated: number[][] = [];

  for (let ri = 0; ri < lines.length; ri++) {
    const r = lines[ri];
    if (usedL[ri] || r.cls !== "route" || Math.abs(r.y1 - r.y2) >= 2) continue;
    const rx0 = Math.min(r.x1, r.x2), rx1 = Math.max(r.x1, r.x2), ry = (r.y1 + r.y2) / 2;
    const ticks: number[] = [], tickIdx: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (usedL[i] || l.cls !== "tick" || Math.abs(l.x1 - l.x2) > 2) continue;
      if (l.x1 < rx0 - 6 || l.x1 > rx1 + 6) continue;
      if (Math.abs((l.y1 + l.y2) / 2 - ry) > band * 2.5) continue;
      ticks.push(l.x1); tickIdx.push(i);
    }
    if (ticks.length < 3) continue;
    ticks.sort((a, b) => a - b);
    // one measure per tick position, snapped to the tick it belongs to
    const at: { [x: string]: string } = {};
    const order: number[] = [];
    for (let j = 0; j < texts.length; j++) {
      const t = texts[j];
      if (usedT[j] || t.cls.indexOf("measure") !== 0) continue;
      if (t.y <= ry - band * 9 || t.y >= ry + band * 2) continue;
      let near = ticks[0];
      for (const x of ticks) if (Math.abs(x - t.x) < Math.abs(near - t.x)) near = x;
      if (Math.abs(near - t.x) > 22) continue;
      usedT[j] = true;
      const k = String(Math.round(near));
      if (!at[k]) { at[k] = t.t; order.push(near); }
    }
    if (order.length < 3) continue;
    for (const i of tickIdx) usedL[i] = true;
    usedL[ri] = true;
    order.sort((a, b) => a - b);
    // one decimal convention per ruler
    let dec = 0;
    for (const x of order) {
      const d = at[String(Math.round(x))];
      const dot = d.indexOf(".");
      if (dot >= 0) dec = Math.max(dec, d.length - dot - 1);
    }
    // label thinning: never overlap, always draw every tick
    let thin = 1;
    if (order.length > 1) {
      let step = 1e9;
      for (let k = 0; k + 1 < order.length; k++) step = Math.min(step, order[k + 1] - order[k]);
      while (step * thin < LABEL_MIN_GAP) thin++;
    }
    // the drawn line overshoots the final tick so the arrowhead sits clear of
    // it and of any extent reaching the ruler's end (the number-line
    // convention); ticks, measures and extents still live on [rx0, rx1]
    outL.push({ x1: rx0, y1: ry, x2: rx1 + ARROW_EXT, y2: ry, cls: "route", extra: "" });
    const baseY = ry - MEAS_OFF;
    for (let k = 0; k < ticks.length; k++) {
      const major = k % 5 === 0 || k === ticks.length - 1;
      const L = (major ? TICK_MAJOR : TICK_MINOR) / 2;
      outL.push({ x1: ticks[k], y1: ry - L, x2: ticks[k], y2: ry + L,
        cls: major ? "tick maj" : "tick", extra: "" });
    }
    for (let k = 0; k < order.length; k++) {
      if (thin > 1 && k % thin !== 0 && k !== order.length - 1) continue;
      let v = at[String(Math.round(order[k]))];
      if (dec > 0) {
        const f = parseFloat(v);
        if (!isNaN(f)) v = f.toFixed(dec);
      }
      outT.push({ x: order[k], y: baseY, t: v, cls: "measure f-muted", anchor: "middle" });
    }
    rulers.push({ x0: rx0, x1: rx1, y: ry });
  }

  // event extents: clamp to the ruler, snap adjoining bars to share ONE exact
  // boundary, and mark that boundary — it is the split the case is about
  const SNAP = 12.0;
  const groups: { ruler: FRuler; segs: number[][] }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (usedL[i] || l.cls.indexOf("event") !== 0 || Math.abs(l.y1 - l.y2) >= 3) continue;
    usedL[i] = true;
    const ly = (l.y1 + l.y2) / 2;
    let best: FRuler | null = null;
    for (const r of rulers) if (!best || Math.abs(r.y - ly) < Math.abs(best.y - ly)) best = r;
    const rr: FRuler = (best && Math.abs(best.y - ly) <= band * 3) ? best
      : { x0: Math.min(l.x1, l.x2), x1: Math.max(l.x1, l.x2), y: ly };
    let grp: { ruler: FRuler; segs: number[][] } | null = null;
    for (const g of groups) if (g.ruler === rr) grp = g;
    if (!grp) { grp = { ruler: rr, segs: [] }; groups.push(grp); }
    grp.segs.push([Math.max(Math.min(l.x1, l.x2), rr.x0), Math.min(Math.max(l.x1, l.x2), rr.x1),
      0, 0]);
    grp.segs[grp.segs.length - 1][2] = i;
  }
  for (const g of groups) {
    g.segs.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k + 1 < g.segs.length; k++) {
      if (Math.abs(g.segs[k + 1][0] - g.segs[k][1]) <= SNAP) {
        const mid = (g.segs[k][1] + g.segs[k + 1][0]) / 2;
        g.segs[k][1] = mid; g.segs[k + 1][0] = mid;
        splits.push([mid, g.ruler.y]);
      }
    }
    for (const s of g.segs) {
      const src = lines[s[2]];
      outL.push({ x1: s[0], y1: g.ruler.y, x2: s[1], y2: g.ruler.y,
        cls: "event flat", extra: src.extra });
    }
  }

  const bars = outL.filter((l) => l.cls.indexOf("event") === 0);
  for (let j = 0; j < texts.length; j++) {
    if (usedT[j]) continue;
    const t = texts[j];
    // event id centred beneath its own bar; route id as a left row label
    if (/^[Ee]\w{0,6}$/.test(t.t) && bars.length) {
      let b = bars[0];
      const score = (bb: FLine) => Math.abs((bb.x1 + bb.x2) / 2 - t.x) + Math.abs(bb.y1 - t.y) * 1.5;
      for (const bb of bars) if (score(bb) < score(b)) b = bb;
      if (Math.abs(b.y1 - t.y) < band * 6) {
        relocated.push([t.x, t.y]);
        outT.push({ x: (b.x1 + b.x2) / 2, y: b.y1 + ID_OFF,
          t: t.t, cls: t.cls, anchor: "middle" });
        continue;
      }
    }
    if (/^[Rr]\w{0,8}$/.test(t.t) && rulers.length) {
      let r = rulers[0];
      for (const rr of rulers) if (Math.abs(rr.y - t.y) < Math.abs(r.y - t.y)) r = rr;
      if (Math.abs(r.y - t.y) < band * 9) {
        outT.push({ x: r.x0 - 12, y: r.y, t: t.t, cls: t.cls, anchor: "end" });
        continue;
      }
    }
    outT.push(t);
  }
  // a leader pointing at a label we just moved is now noise
  for (let i = 0; i < lines.length; i++) {
    if (usedL[i]) continue;
    const l = lines[i];
    if (l.cls === "leader") {
      let drop = false;
      for (const rp of relocated) {
        const d1 = Math.abs(l.x1 - rp[0]) + Math.abs(l.y1 - rp[1]);
        const d2 = Math.abs(l.x2 - rp[0]) + Math.abs(l.y2 - rp[1]);
        if (Math.min(d1, d2) < 60) { drop = true; break; }
      }
      if (drop) continue;
    }
    outL.push(l);
  }
  // DF-8: a route whose band carries measure labels but NO ticks gets a hash
  // mark at each labelled position. A label states an anchor on the line;
  // decks that skip the tick stubs leave the number floating in space, and a
  // labelled anchor without a mark is the one gap in the framework's "every
  // measure sits on its own tick" rule. Only routes that never became rulers
  // qualify (a ruler has ticks by definition), and only when the band has no
  // ticks at all — half-ticked lines keep the author's marks.
  const synth: FLine[] = [];
  for (let pass = 0; pass < 2; pass++) {
    const horiz = pass === 0;
    // collinear route lines merge into ONE band first — decks lay a route as
    // segments end to end, and a label near the band belongs to the whole
    // route, not to whichever segment its position happens to touch
    const rbs: number[][] = [];
    for (const l of outL) {
      if (l.cls !== "route") continue;
      if ((horiz ? Math.abs(l.y1 - l.y2) : Math.abs(l.x1 - l.x2)) >= 2) continue;
      const c0 = horiz ? (l.y1 + l.y2) / 2 : (l.x1 + l.x2) / 2;
      const a0 = horiz ? Math.min(l.x1, l.x2) : Math.min(l.y1, l.y2);
      const a1 = horiz ? Math.max(l.x1, l.x2) : Math.max(l.y1, l.y2);
      let g: number[] | null = null;
      for (const b of rbs) if (Math.abs(b[0] - c0) < band) g = b;
      if (!g) rbs.push([c0, a0, a1]);
      else { g[1] = Math.min(g[1], a0); g[2] = Math.max(g[2], a1); }
    }
    for (const g of rbs) {
      let skip = false;
      for (const r of rulers) {
        if (horiz && Math.abs(r.y - g[0]) < 2 && r.x0 < g[2] && g[1] < r.x1) skip = true;
      }
      for (const o of outL) {
        if (skip || o.cls.indexOf("tick") !== 0) continue;
        const ta = horiz ? (o.x1 + o.x2) / 2 : (o.y1 + o.y2) / 2;
        const tc = horiz ? (o.y1 + o.y2) / 2 : (o.x1 + o.x2) / 2;
        if (ta >= g[1] - 6 && ta <= g[2] + 6 && Math.abs(tc - g[0]) <= band * 2.5) skip = true;
      }
      if (skip) continue;
      const anchors: number[] = [];
      for (const t of outT) {
        if (t.cls.indexOf("measure") !== 0) continue;
        const ta = horiz ? t.x : t.y, tc = horiz ? t.y : t.x;
        // ±26 along the line: decks drag an end label past the route's own
        // end (observed +19px); the tick clamps back onto the line
        if (ta < g[1] - 26 || ta > g[2] + 26 || Math.abs(tc - g[0]) < 4 || Math.abs(tc - g[0]) > 34) continue;
        const at2 = Math.max(g[1], Math.min(g[2], ta));
        // a dragged end label re-centres over the tick it just gained
        if (Math.abs(ta - at2) > 0.5) { if (horiz) t.x = at2; else t.y = at2; }
        let dup = false;
        for (const x of anchors) if (Math.abs(x - at2) < 3) dup = true;
        if (!dup) anchors.push(at2);
      }
      if (anchors.length < 2) continue;
      for (const at2 of anchors) {
        const arm = TICK_MAJOR / 2;
        synth.push(horiz
          ? { x1: at2, y1: g[0] - arm, x2: at2, y2: g[0] + arm, cls: "tick maj", extra: "" }
          : { x1: g[0] - arm, y1: at2, x2: g[0] + arm, y2: at2, cls: "tick maj", extra: "" });
      }
    }
  }
  for (const l of synth) outL.push(l);
  if (!compress) return { lines: outL, texts: outT, splits: splits, rulers: rulers };
  return compressBands(outL, outT, splits, rulers);
}

// dead vertical space between bands collapses to one standard gap: bands move
// as units, so nothing inside one changes
function compressBands(lines: FLine[], texts: FText[], splits: number[][], rulers: FRuler[]): {
  lines: FLine[]; texts: FText[]; splits: number[][]; rulers: FRuler[];
} {
  const spans: number[][] = [];
  for (const l of lines) spans.push([Math.min(l.y1, l.y2), Math.max(l.y1, l.y2)]);
  for (const t of texts) spans.push([t.y - 10, t.y + 6]);
  if (!spans.length) return { lines: lines, texts: texts, splits: splits, rulers: rulers };
  spans.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [[spans[0][0], spans[0][1]]];
  for (const s of spans) {
    if (s[0] <= merged[merged.length - 1][1] + BAND_GAP) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], s[1]);
    } else merged.push([s[0], s[1]]);
  }
  if (merged.length < 2) return { lines: lines, texts: texts, splits: splits, rulers: rulers };
  const cuts: number[][] = [];
  let shift = 0, prevEnd = merged[0][1];
  for (let i = 1; i < merged.length; i++) {
    shift += (merged[i][0] - prevEnd) - BAND_GAP;
    cuts.push([merged[i][0], shift]);
    prevEnd = merged[i][1];
  }
  const dy = (y: number): number => {
    let s = 0;
    for (const c of cuts) if (y >= c[0]) s = c[1];
    return -s;
  };
  return {
    lines: lines.map((l) => ({ x1: l.x1, y1: l.y1 + dy(l.y1), x2: l.x2, y2: l.y2 + dy(l.y2),
      cls: l.cls, extra: l.extra })),
    texts: texts.map((t) => ({ x: t.x, y: t.y + dy(t.y), t: t.t, cls: t.cls, anchor: t.anchor })),
    splits: splits.map((s) => [s[0], s[1] + dy(s[1])]),
    rulers: rulers.map((r) => ({ x0: r.x0, x1: r.x1, y: r.y + dy(r.y) })),
  };
}

// -------------------------------------- raster slides: redrawn as vectors
// The drawing is a pasted picture, so rather than embed pixels we cannot
// restyle, the route is redrawn from what the slide itself states: topology
// from its title, measures and split from its own tables. A schematic of the
// case that is faithful to the slide's data — not a tracing of the picture.
function arc(cx: number, cy: number, r: number, a0: number, a1: number, n: number): number[][] {
  const pts: number[][] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

interface Topo { pts: number[][]; extras: number[][][]; aspect: number; closed: boolean; }

function topology(kind: string): Topo {
  const k = (kind || "").toLowerCase();
  const PI = Math.PI;
  if (k.indexOf("vertical") >= 0)
    return { pts: [[0.5, 1], [0.5, 0]], extras: [], aspect: 0.42, closed: false };
  if (k.indexOf("lollipop") >= 0)
    return { pts: ([[0.03, 0.5], [0.34, 0.5]] as number[][]).concat(arc(0.63, 0.5, 0.29, PI, -PI, 46)),
             extras: [], aspect: 2.2, closed: false };
  if (k.indexOf("loop") >= 0)
    return { pts: [[0.08, 0.12], [0.92, 0.12], [0.92, 0.88], [0.08, 0.88], [0.08, 0.12]],
             extras: [], aspect: 1.05, closed: true };
  if (k.indexOf("branch") >= 0)
    return { pts: [[0.03, 0.28], [0.52, 0.28], [0.97, 0.28]],
             extras: [[[0.52, 0.28], [0.97, 0.86]]], aspect: 1.9, closed: false };
  if (k.indexOf("alpha") >= 0)
    return { pts: arc(0.35, 0.52, 0.3, PI * 0.75, PI * 2.75, 48).concat([[0.72, 0.2], [0.97, 0.08]]),
             extras: [], aspect: 1.5, closed: true };
  if (k.indexOf("infinity") >= 0)
    return { pts: arc(0.27, 0.5, 0.24, PI * 0.25, PI * 2.25, 44)
                    .concat(arc(0.73, 0.5, 0.24, PI * 1.25, PI * -0.75, 44)),
             extras: [], aspect: 2.4, closed: true };
  if (k.indexOf("gap") >= 0)
    return { pts: [[0.03, 0.5], [0.42, 0.5], [0.58, 0.5], [0.97, 0.5]],
             extras: [], aspect: 4.5, closed: false };
  return { pts: [[0.03, 0.5], [0.97, 0.5]], extras: [], aspect: 5.0, closed: false };
}

// measure -> point + tangent along the polyline's arc length
function atMeasure(pts: number[][], cum: number[], total: number, m0: number, m1: number, m: number): number[] {
  const f = m1 === m0 ? 0 : (m - m0) / (m1 - m0);
  const d = Math.max(0, Math.min(1, f)) * total;
  let i = 0;
  while (i < cum.length - 2 && cum[i + 1] < d) i++;
  const seg = (cum[i + 1] - cum[i]) || 1;
  const t = (d - cum[i]) / seg;
  const a = pts[i], b = pts[i + 1];
  const L = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) || 1;
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, (b[0] - a[0]) / L, (b[1] - a[1]) / L];
}

function niceStep(span: number): number {
  const opts = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  for (const s of opts) if (span / s <= 8) return s;
  return Math.max(1, Math.round(span / 8));
}

// ------------------------------------- spanning-event redraw (DF-7)
// the route chain the event spans, from the slide's route-list table (a
// header-row table whose first column is "Route ID" over the route rows,
// in network order). Absent a usable list, the chain is just the two
// stated endpoints.
function routeChain(tables: FTable[], fromRid: string, toRid: string): string[] {
  for (const t of tables) {
    const rows = t.rows;
    if (rows.length < 3 || (rows[0][0] || "").toLowerCase() !== "route id") continue;
    const ids: string[] = [];
    for (let r = 1; r < rows.length; r++) {
      const v = rows[r][0] || "";
      if (/^[A-Za-z0-9]{1,10}$/.test(v)) ids.push(v);
    }
    const a = ids.indexOf(fromRid), b = ids.indexOf(toRid);
    if (a >= 0 && b >= 0 && a !== b) {
      return a < b ? ids.slice(a, b + 1) : ids.slice(b, a + 1).reverse();
    }
  }
  return [fromRid, toRid];
}

// which route the split measure lives on: the result table states it — the
// event column whose To Measure (or From Measure) IS the split names the
// route beside it. "" when no result table answers.
function splitRoute(tables: FTable[], gi: number, split: number): string {
  if (gi < 0) return "";
  const rows = tables[gi].rows;
  const row = (label: string): string[] | null => {
    for (const r of rows) if ((r[0] || "").toLowerCase() === label) return r;
    return null;
  };
  const fm = row("from measure"), tm = row("to measure");
  const fr = row("from rid"), tr = row("to routeid") || row("to rid");
  for (let c = 1; c < rows[0].length; c++) {
    if (tm && tr && parseFloat(tm[c]) === split &&
        /^[A-Za-z0-9]{1,10}$/.test(tr[c] || "")) return tr[c];
    if (fm && fr && parseFloat(fm[c]) === split &&
        /^[A-Za-z0-9]{1,10}$/.test(fr[c] || "")) return fr[c];
  }
  return "";
}

interface SpanParams {
  m0: number; m1: number; split: number; eventId: string;
  fromRid: string; toRid: string; inputGi: number; outputGi: number;
}

// The chain draws as the slide draws it: one segment per route laid end to
// end, EACH ENDING IN ITS OWN ARROWHEAD (a route's end is where its arrow
// is — that is the diagram's vocabulary), route ids below their segments,
// the stated measures above their anchors (the segment interiors carry no
// invented tick grids: the slide's tables state only the anchors), event
// ids above their extents, and the output figure's legend qualifying each
// range with its routes — "E1 R1L3 10 → R2L3 52.5" — because a cross-route
// range is meaningless without them. Segment widths are equal: a schematic
// of the network's order, not a claim about route lengths.
function buildSpanRedraw(no: number, tables: FTable[], p: SpanParams): SlideFigure[] {
  const chain = routeChain(tables, p.fromRid, p.toRid);
  let sRid = splitRoute(tables, p.outputGi, p.split);
  let k = chain.indexOf(sRid);
  if (k < 0) { k = Math.floor(chain.length / 2); sRid = chain[k]; }
  const innerW = FIG_W - FIG_PAD * 2 - 24 - ARROW_EXT;
  const ox = FIG_PAD + 12;
  const ry = FIG_PAD + 40;            // measures sit above this line
  const segW = innerW / chain.length;
  const x1 = ox + innerW;
  const sx = ox + (k + 0.5) * segW;   // the split, mid-segment: the split
                                      // route's own measure domain is not
                                      // stated, so no position within it is
  const chainTxt = chain.join(" → ");
  const rows: { ext: number[][]; sp: number; gi: number; alt: string }[] = [
    { ext: [[ox, x1, 0]], sp: NaN, gi: p.inputGi,
      alt: "Schematic redrawn from the slide's data: event " + p.eventId +
        " spanning routes " + chainTxt + ", from " + p.fromRid + " measure " +
        fnum(p.m0) + " to " + p.toRid + " measure " + fnum(p.m1) +
        ", before the split at measure " + fnum(p.split) + " on " + sRid + "." },
    { ext: [[ox, sx, 0], [sx, x1, 1]], sp: sx, gi: p.outputGi,
      alt: "Schematic redrawn from the slide's data: event " + p.eventId +
        " spanning routes " + chainTxt + " after the split at measure " +
        fnum(p.split) + " on " + sRid + ": " + p.eventId + " as " + p.fromRid +
        " " + fnum(p.m0) + " → " + sRid + " " + fnum(p.split) + " and " + sRid +
        " " + fnum(p.split) + " → " + p.toRid + " " + fnum(p.m1) + "." },
  ];
  const roles = ["cool", "warm"];
  const figsOut: SlideFigure[] = [];
  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];
    const body: string[] = [];
    // extents at the BACK (DF-8 — the route now draws over them)
    for (const e of row.ext) {
      body.push('<line class="ln event flat s-' + roles[e[2]] + '" x1="' + fnum(e[0]) +
        '" y1="' + fnum(ry) + '" x2="' + fnum(e[1]) + '" y2="' + fnum(ry) + '"/>');
      body.push('<text class="id f-' + roles[e[2]] + '" x="' + fnum((e[0] + e[1]) / 2) +
        '" y="' + fnum(ry - ID_OFF) + '" text-anchor="middle" dominant-baseline="central">' +
        esc(p.eventId) + "</text>");
    }
    // the stated measures (start / split / end), each ABOVE its own anchor —
    // and a hash mark AT each anchor (DF-8): a labelled anchor without a
    // mark left the number floating in space. The split's anchor keeps its
    // dot-and-hairline marker instead of doubling up with a tick.
    const meas: number[][] = [[ox, p.m0], [x1, p.m1]];
    if (!isNaN(row.sp)) meas.push([sx, p.split]);
    for (const mv of meas) {
      if (!isNaN(row.sp) && Math.abs(mv[0] - row.sp) < 2) continue;
      body.push('<line class="ln tick maj" x1="' + fnum(mv[0]) + '" y1="' + fnum(ry - TICK_MAJOR / 2) +
        '" x2="' + fnum(mv[0]) + '" y2="' + fnum(ry + TICK_MAJOR / 2) + '"/>');
    }
    // route segments over the extents (each route is its own dashed line;
    // the last overshoots for its arrowhead like every ruler)
    for (let i = 0; i < chain.length; i++) {
      const a = ox + i * segW, b = ox + (i + 1) * segW;
      const bx = i === chain.length - 1 ? b + ARROW_EXT : b;
      body.push('<line class="ln route" x1="' + fnum(a) + '" y1="' + fnum(ry) +
        '" x2="' + fnum(bx) + '" y2="' + fnum(ry) + '"/>');
    }
    // arrowheads LAST — every route ends in its own arrow, on top of the
    // extent running through the joint (the slide's own vocabulary)
    for (let i = 0; i < chain.length; i++) {
      const tip = ox + (i + 1) * segW + (i === chain.length - 1 ? ARROW_EXT : 0);
      body.push('<line class="ln route" x1="' + fnum(tip - 8) + '" y1="' + fnum(ry) +
        '" x2="' + fnum(tip) + '" y2="' + fnum(ry) + '" marker-end="url(#ar)"/>');
    }
    if (!isNaN(row.sp)) {
      body.push('<line class="split" x1="' + fnum(row.sp) + '" y1="' + fnum(ry - SPLIT_ARM) +
        '" x2="' + fnum(row.sp) + '" y2="' + fnum(ry + SPLIT_ARM) + '"/>');
      body.push('<circle class="splitdot" cx="' + fnum(row.sp) + '" cy="' + fnum(ry) + '" r="' + fnum(DOT_R) + '"/>');
    }
    for (const mv of meas) {
      body.push('<text class="measure" x="' + fnum(mv[0]) +
        '" y="' + fnum(ry - MEAS_OFF) +
        '" text-anchor="middle" dominant-baseline="central">' + fnum(mv[1]) + "</text>");
    }
    // route ids below their segments
    for (let i = 0; i < chain.length; i++) {
      body.push('<text class="id f-ink" x="' + fnum(ox + (i + 0.5) * segW) +
        '" y="' + fnum(ry + ID_OFF) +
        '" text-anchor="middle" dominant-baseline="central">' + esc(chain[i]) + "</text>");
    }
    let hgt = ry + 36 + FIG_PAD;
    if (ri === 1) {
      const leg = emitLegend([
        { role: roles[0], t: p.eventId + " " + p.fromRid + " " + fnum(p.m0) + " → " +
          sRid + " " + fnum(p.split) },
        { role: roles[1], t: p.eventId + " " + sRid + " " + fnum(p.split) + " → " +
          p.toRid + " " + fnum(p.m1) },
      ], FIG_PAD, ry + ID_OFF + LEGEND_GAP);
      body.push(leg.svg);
      hgt = ry + ID_OFF + LEGEND_GAP + 8 + FIG_PAD;
    }
    const title = "Slide " + no + " route diagram (" + (ri + 1) + " of " + rows.length + ")";
    figsOut.push({ slide: no, name: figName(no, ri + 1, rows.length),
      svg: svgWrap(no, FIG_W, hgt, title, row.alt, body.join("")),
      alt: row.alt,
      anchor: row.gi >= 0 ? tables[row.gi].rows[0].slice() : [] });
  }
  return figsOut;
}

function buildRedraw(xml: string, no: number, tables: FTable[]): SlideFigure[] {
  const cells: string[] = [];
  const tre = /<a:t>([^<]*)<\/a:t>/g;
  let m: RegExpExecArray | null;
  while ((m = tre.exec(xml)) !== null) cells.push(m[1].replace(/\s+/g, " ").trim());
  const txt = cells.join(" ");
  let kind = "";
  const names = ["Lollipop", "Loop", "Branch", "Alpha", "Infinity", "Gapped", "Gap",
                 "Vertical", "Reverse", "Normal"];
  for (const n of names) if (new RegExp(n, "i").test(txt)) { kind = n; break; }
  // Two table shapes in this corpus: two-column key/value ("Measure | 10")
  // and header-row ("RouteID | From Measure | To Measure" over data rows).
  // Reading the next cell works for the first and returns the NEXT HEADER for
  // the second, so read the parsed grid down the column. Also returns WHICH
  // table answered — the input figure anchors to the table its measures were
  // read from.
  const lookup = (label: string): { v: string; gi: number } => {
    for (let gi = 0; gi < tables.length; gi++) {
      const rows = tables[gi].rows;
      for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < rows[r].length; c++) {
          if (rows[r][c].toLowerCase() !== label) continue;
          // which shape is this table? a 2-cell row is key/value ("Measure |
          // 10") and the value sits beside; a wider row is a header row and
          // the value sits below. Reading below in a key/value table returns
          // the NEXT KEY, which is how "Measure" once resolved to "To Measure".
          const headerRow = rows[r].length > 2;
          if (headerRow && r + 1 < rows.length && c < rows[r + 1].length && rows[r + 1][c]) {
            return { v: rows[r + 1][c], gi: gi };
          }
          if (!headerRow && c + 1 < rows[r].length && rows[r][c + 1]) {
            return { v: rows[r][c + 1], gi: gi };
          }
        }
      }
    }
    return { v: "", gi: -1 };
  };
  const after = (label: string): string => lookup(label).v;
  let mHit = lookup("measure");
  if (!mHit.v) mHit = lookup("from measure");
  const m0s = mHit.v;
  const m1s = after("to measure");
  if (!m0s || !m1s) return [];
  const m0 = parseFloat(m0s), m1 = parseFloat(m1s);
  if (isNaN(m0) || isNaN(m1) || m1 <= m0) return [];
  const sp = txt.match(/[Ss]plit measure\s*:?\s*([\d.]+)/);
  const split = sp ? parseFloat(sp[1]) : (m0 + m1) / 2;
  const routeId = after("route id") || after("from rid") || "R1";
  const eventId = after("event id") || "E1";
  if (!/^[A-Za-z0-9]{1,10}$/.test(routeId) || !/^[A-Za-z0-9_]{1,10}$/.test(eventId)) return [];
  const dec = (m0 % 1 || m1 % 1 || split % 1) ? 1 : 0;
  // the output figure anchors to the RESULT table: the other measure-bearing
  // table of 3+ columns (event id over one column per event after the split),
  // searched from the slide's end where these decks put it. The route-list
  // table never qualifies — it carries dates, not measures.
  const inputGi = mHit.gi;
  let outputGi = -1;
  for (let gi = tables.length - 1; gi >= 0; gi--) {
    if (gi === inputGi) continue;
    const rows = tables[gi].rows;
    if (rows.length === 0 || rows[0].length < 3) continue;
    let hasMeasure = false;
    for (const r of rows) {
      const k = (r[0] || "").toLowerCase();
      if (k === "measure" || k === "from measure") { hasMeasure = true; break; }
    }
    if (hasMeasure) { outputGi = gi; break; }
  }

  // SPANNING EVENTS (DF-7). A "line network" slide states an event that
  // RUNS ACROSS ROUTES — "From RID R1L3, From Measure 10, To RouteID R3L3,
  // To Measure 25", with the split measure in the MIDDLE route's own
  // domain (52.5 on R2L3). Collapsing that onto one route's ruler drew a
  // 10→25 grid that exists on no route and clamped the split away
  // entirely. Such slides render as a route CHAIN instead.
  const fromRid = after("from rid");
  const toRid = after("to routeid") || after("to rid");
  if (fromRid && toRid && fromRid !== toRid &&
      /^[A-Za-z0-9]{1,10}$/.test(fromRid) && /^[A-Za-z0-9]{1,10}$/.test(toRid)) {
    return buildSpanRedraw(no, tables, {
      m0: m0, m1: m1, split: split, eventId: eventId,
      fromRid: fromRid, toRid: toRid, inputGi: inputGi, outputGi: outputGi,
    });
  }

  const topo = topology(kind);
  const innerW = FIG_W - FIG_PAD * 2 - 46;
  const innerH = Math.min(360, Math.max(115, innerW / topo.aspect));
  const shape = kind ? kind.toLowerCase() : "straight";
  // one figure per state — the input diagram and the output diagram are two
  // diagrams on the slide, so they are two figures (DF-4), not stacked bands.
  // A split ON a route end (real decks state these) makes one side of the
  // split zero-length: that extent is dropped rather than drawn as an
  // invisible bar with an orphaned label (DF-5).
  const sp2 = Math.max(m0, Math.min(m1, split));
  const outExt: number[][] = [];
  if (sp2 - m0 > 1e-9) outExt.push([m0, sp2, 0]);
  if (m1 - sp2 > 1e-9) outExt.push([sp2, m1, outExt.length]);
  const outAlt = "Schematic redrawn from the slide's data: " + shape + " route " + routeId +
    " after the split at measure " + fnum(split) + ": event " + eventId +
    (outExt.length === 2
      ? " as " + fnum(m0) + "–" + fnum(sp2) + " and " + fnum(sp2) + "–" + fnum(m1) + "."
      : " unchanged as " + fnum(m0) + "–" + fnum(m1) +
        " (the split coincides with a route end).");
  const rows: { ext: number[][]; sp: number; gi: number; alt: string }[] = [
    { ext: [[m0, m1, 0]], sp: NaN, gi: inputGi,
      alt: "Schematic redrawn from the slide's data: " + shape + " route " + routeId +
        ", event " + eventId + " from measure " + fnum(m0) + " to " + fnum(m1) +
        ", before the split at measure " + fnum(split) + "." },
    { ext: outExt, sp: split, gi: outputGi, alt: outAlt },
  ];
  const roles = ["cool", "warm"];
  const figsOut: SlideFigure[] = [];
  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];
    const body: string[] = [];
    const oy = FIG_PAD + 22; // headroom for outward ticks and their measures
    const ox = FIG_PAD + 46;
    const pts = topo.pts.map((p) => [ox + p[0] * innerW, oy + p[1] * innerH]);
    const cum = [0];
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i], b = pts[i + 1];
      cum.push(cum[i] + Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])));
    }
    const total = cum[cum.length - 1] || 1;
    let cx = 0, cy = 0;
    for (const p of pts) { cx += p[0]; cy += p[1]; }
    cx /= pts.length; cy /= pts.length;
    for (const ex of topo.extras) {
      const d = ex.map((p, i) => (i ? "L " : "M ") + fnum(ox + p[0] * innerW) + " " +
        fnum(oy + p[1] * innerH)).join(" ");
      body.push('<path class="ln route ctx" d="' + d + '"/>');
    }
    let d = pts.map((p, i) => (i ? "L " : "M ") + fnum(p[0]) + " " + fnum(p[1])).join(" ");
    let headSvg = "";
    if (!topo.closed && pts.length >= 2) {
      // overshoot past the final tick so the arrowhead sits clear of it and
      // of an extent reaching the route's end (the number-line convention).
      // The head rides an 8px carrier retracing the overshoot's final pixels
      // (DF-8): the route itself is dashed, and a marker on the path could
      // land on a dash gap and float detached from its line — the carrier is
      // shorter than the dash's on-run, so it is always solid under the head.
      const pa = pts[pts.length - 2], pb = pts[pts.length - 1];
      const seg = Math.sqrt((pb[0] - pa[0]) * (pb[0] - pa[0]) +
                            (pb[1] - pa[1]) * (pb[1] - pa[1])) || 1;
      const ux = (pb[0] - pa[0]) / seg, uy = (pb[1] - pa[1]) / seg;
      const tx = pb[0] + ux * ARROW_EXT, ty = pb[1] + uy * ARROW_EXT;
      d += " L " + fnum(tx) + " " + fnum(ty);
      headSvg = '<line class="ln route" x1="' + fnum(tx - ux * 8) + '" y1="' +
        fnum(ty - uy * 8) + '" x2="' + fnum(tx) + '" y2="' + fnum(ty) +
        '" marker-end="url(#ar)"/>';
    }
    for (const e of row.ext) {
      const a = atMeasure(pts, cum, total, m0, m1, e[0]);
      const b = atMeasure(pts, cum, total, m0, m1, e[1]);
      const fa = Math.max(0, Math.min(1, (e[0] - m0) / (m1 - m0))) * total;
      const fb = Math.max(0, Math.min(1, (e[1] - m0) / (m1 - m0))) * total;
      const mid: string[] = ["M " + fnum(a[0]) + " " + fnum(a[1])];
      for (let i = 1; i + 1 < pts.length; i++) if (fa < cum[i] && cum[i] < fb)
        mid.push("L " + fnum(pts[i][0]) + " " + fnum(pts[i][1]));
      mid.push("L " + fnum(b[0]) + " " + fnum(b[1]));
      body.push('<path class="ln event flat s-' + roles[e[2]] + '" d="' + mid.join(" ") + '"/>');
      // anchor the id on the extent's longest straight run rather than its
      // arc-length midpoint: a midpoint can land on a corner vertex, where a
      // perpendicular offset from one edge prints ON the adjoining edge (DF-5)
      let rl = -1, rm = (fa + fb) / 2;
      for (let i = 0; i + 1 < pts.length; i++) {
        const s0 = Math.max(cum[i], fa), s1 = Math.min(cum[i + 1], fb);
        if (s1 - s0 > rl) { rl = s1 - s0; rm = (s0 + s1) / 2; }
      }
      const c = atMeasure(pts, cum, total, m0, m1, m0 + (m1 - m0) * (rm / total));
      let nx = -c[3], ny = c[2];
      // inside a closed shape; on a collinear route (centroid ON the line,
      // so "inside" degenerates) take the side the measures do not — below
      // the line / left of a vertical one, mirroring the vector lane, so an
      // event id can never print over a measure (DF-5)
      const dotE = (c[0] - cx) * nx + (c[1] - cy) * ny;
      if (Math.abs(dotE) < 1e-6 ? (ny < 0 || (ny === 0 && nx > 0)) : dotE > 0) {
        nx = -nx; ny = -ny;
      }
      body.push('<text class="id f-' + roles[e[2]] + '" x="' + fnum(c[0] + nx * ID_OFF) + '" y="' +
        fnum(c[1] + ny * ID_OFF) + '" text-anchor="middle" dominant-baseline="central">' +
        esc(eventId) + "</text>");
    }
    const major = niceStep(m1 - m0);
    const minor = major >= 5 ? major / 5 : major;
    let mm = Math.ceil(m0 / minor) * minor;
    while (mm <= m1 + 1e-9) {
      const q = atMeasure(pts, cum, total, m0, m1, mm);
      let nx = -q[3], ny = q[2];
      // outward on a closed shape; on a collinear route measures take the
      // top of the line (right of a vertical one) — the shared baseline the
      // vector lane uses, and the opposite side from the event ids (DF-5)
      const dotT = (q[0] - cx) * nx + (q[1] - cy) * ny;
      if (Math.abs(dotT) < 1e-6 ? (ny > 0 || (ny === 0 && nx < 0)) : dotT < 0) {
        nx = -nx; ny = -ny;
      }
      const isMaj = Math.abs(mm / major - Math.round(mm / major)) < 1e-6;
      const L = (isMaj ? TICK_MAJOR : TICK_MINOR) / 2;
      body.push('<line class="ln tick' + (isMaj ? " maj" : "") + '" x1="' + fnum(q[0] - nx * L) +
        '" y1="' + fnum(q[1] - ny * L) + '" x2="' + fnum(q[0] + nx * L) + '" y2="' +
        fnum(q[1] + ny * L) + '"/>');
      if (isMaj && !(topo.closed && Math.abs(mm - m1) < 1e-9)) {
        body.push('<text class="measure" x="' + fnum(q[0] + nx * MEAS_OFF) +
          '" y="' + fnum(q[1] + ny * MEAS_OFF) +
          '" text-anchor="middle" dominant-baseline="central">' +
          (dec ? mm.toFixed(dec) : String(Math.round(mm))) + "</text>");
      }
      mm += minor;
    }
    // the dashed route draws OVER the extents and ticks (DF-8) — it used to
    // draw first and vanish under any bar covering it; now its dash gaps let
    // the extent colour read through instead
    body.push('<path class="ln route" d="' + d + '"/>');
    if (headSvg) body.push(headSvg);
    if (!isNaN(row.sp) && row.sp > m0 && row.sp < m1) {
      const q = atMeasure(pts, cum, total, m0, m1, row.sp);
      const nx = -q[3], ny = q[2];
      body.push('<line class="split" x1="' + fnum(q[0] - nx * SPLIT_ARM) +
        '" y1="' + fnum(q[1] - ny * SPLIT_ARM) + '" x2="' + fnum(q[0] + nx * SPLIT_ARM) +
        '" y2="' + fnum(q[1] + ny * SPLIT_ARM) + '"/>');
      body.push('<circle class="splitdot" cx="' + fnum(q[0]) + '" cy="' + fnum(q[1]) + '" r="' + fnum(DOT_R) + '"/>');
    }
    // the row label sits level with the route's entry point, not at
    // mid-height — a branch route runs at 0.28 of the height, and a label
    // pinned to the middle floats in dead space under it (DF-5)
    body.push('<text class="id f-ink" x="' + fnum(pts[0][0] - 16) + '" y="' + fnum(pts[0][1]) +
      '" text-anchor="end" dominant-baseline="central">' + esc(routeId) + "</text>");
    let hgt = oy + innerH + 22 + FIG_PAD;
    if (ri === 1 && row.ext.length >= 2) {
      // the redraw lane KNOWS the numbers, so the output figure's legend
      // states each extent's measure range rather than a letter; a
      // single-extent output (degenerate split) keeps the legend off —
      // legends exist to tell 2+ colours apart
      const entries: { role: string; t: string }[] = [];
      for (const e of row.ext) {
        entries.push({ role: roles[e[2]], t: eventId + " " + fnum(e[0]) + "–" + fnum(e[1]) });
      }
      const leg = emitLegend(entries, FIG_PAD, oy + innerH + 10 + LEGEND_GAP);
      body.push(leg.svg);
      hgt = oy + innerH + 42 + FIG_PAD;
    }
    const title = "Slide " + no + " route diagram (" + (ri + 1) + " of " + rows.length + ")";
    figsOut.push({ slide: no, name: figName(no, ri + 1, rows.length),
      svg: svgWrap(no, FIG_W, hgt, title, row.alt, body.join("")),
      alt: row.alt,
      anchor: row.gi >= 0 ? tables[row.gi].rows[0].slice() : [] });
  }
  return figsOut;
}

// ---------------------------------------- raster tracing tier (last resort)
// A slide whose only content is a pasted picture — no vector drawing, no
// tables to redraw from — used to stay a caption. The picture is decoded
// in-script (PNG only: its zlib stream is two header bytes plus the same
// RFC 1951 deflate the zip layer already inflates) and its axis-aligned
// strokes are vectorised into the SAME FRaw lines the vector path produces,
// so a traced figure runs through the identical classify/normalise pipeline
// and comes out in the corpus style. Colour-aware run extraction is what
// separates a route from the extent drawn over it; measures printed INSIDE
// the picture are pixels, not text, so a traced ruler may carry no numbers —
// the alt text says the figure is traced and approximate.

function u32be(b: Uint8Array, p: number): number {
  return ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0;
}

interface PngImg { w: number; h: number; rgb: Uint8Array; }

// 8-bit gray/RGB/palette/RGBA, non-interlaced; alpha composites over white.
// Anything else (16-bit, interlaced, JPEG…) returns null — silence, not a
// wrong picture.
function pngDecode(b: Uint8Array): PngImg | null {
  if (b.length < 8 || b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) return null;
  let p = 8;
  let w = 0, h = 0, depth = 0, ctype = -1, interlace = 0;
  let plte: Uint8Array | null = null;
  const idat: Uint8Array[] = [];
  let idatLen = 0;
  while (p + 8 <= b.length) {
    const len = u32be(b, p);
    const type = String.fromCharCode(b[p + 4], b[p + 5], b[p + 6], b[p + 7]);
    const ds = p + 8;
    if (ds + len > b.length) return null;
    if (type === "IHDR") {
      w = u32be(b, ds); h = u32be(b, ds + 4);
      depth = b[ds + 8]; ctype = b[ds + 9]; interlace = b[ds + 12];
    } else if (type === "PLTE") plte = b.subarray(ds, ds + len);
    else if (type === "IDAT") { idat.push(b.subarray(ds, ds + len)); idatLen += len; }
    else if (type === "IEND") break;
    p = ds + len + 4;
  }
  if (!w || !h || depth !== 8 || interlace !== 0) return null;
  const ch = ctype === 0 ? 1 : ctype === 2 ? 3 : ctype === 3 ? 1 : ctype === 6 ? 4 : 0;
  if (!ch || w * h > TRACE_MAX_PX) return null;
  const z = new Uint8Array(idatLen);
  let zo = 0;
  for (const d of idat) { z.set(d, zo); zo += d.length; }
  if (z.length < 3 || (z[0] & 0x0f) !== 8 || (z[1] & 0x20) !== 0) return null;
  let raw: Uint8Array;
  try { raw = inflateRaw(z.subarray(2), h * (1 + w * ch)); } catch (e) { return null; }
  if (raw.length < h * (1 + w * ch)) return null;
  const stride = w * ch;
  const rgb = new Uint8Array(w * h * 3);
  const prev = new Uint8Array(stride);
  const cur = new Uint8Array(stride);
  let rp = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[rp++];
    for (let i = 0; i < stride; i++) cur[i] = raw[rp + i];
    rp += stride;
    if (f === 1) { for (let i = ch; i < stride; i++) cur[i] = (cur[i] + cur[i - ch]) & 0xff; }
    else if (f === 2) { for (let i = 0; i < stride; i++) cur[i] = (cur[i] + prev[i]) & 0xff; }
    else if (f === 3) {
      for (let i = 0; i < stride; i++) {
        const a = i >= ch ? cur[i - ch] : 0;
        cur[i] = (cur[i] + ((a + prev[i]) >> 1)) & 0xff;
      }
    } else if (f === 4) {
      for (let i = 0; i < stride; i++) {
        const a = i >= ch ? cur[i - ch] : 0, up = prev[i], c = i >= ch ? prev[i - ch] : 0;
        const pa = Math.abs(up - c), pb = Math.abs(a - c), pc = Math.abs(a + up - 2 * c);
        cur[i] = (cur[i] + (pa <= pb && pa <= pc ? a : (pb <= pc ? up : c))) & 0xff;
      }
    } else if (f !== 0) return null;
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, bl = 0;
      if (ctype === 0) { r = cur[x]; g = r; bl = r; }
      else if (ctype === 2) { r = cur[x * 3]; g = cur[x * 3 + 1]; bl = cur[x * 3 + 2]; }
      else if (ctype === 3) {
        const ix = cur[x] * 3;
        if (plte && ix + 2 < plte.length) { r = plte[ix]; g = plte[ix + 1]; bl = plte[ix + 2]; }
      } else {
        const a = cur[x * 4 + 3];
        r = ((cur[x * 4] * a + 255 * (255 - a) + 127) / 255) | 0;
        g = ((cur[x * 4 + 1] * a + 255 * (255 - a) + 127) / 255) | 0;
        bl = ((cur[x * 4 + 2] * a + 255 * (255 - a) + 127) / 255) | 0;
      }
      const o = (y * w + x) * 3;
      rgb[o] = r; rgb[o + 1] = g; rgb[o + 2] = bl;
    }
    prev.set(cur);
  }
  return { w: w, h: h, rgb: rgb };
}

// a "bar" is a stack of same-colour ink runs: a-axis is along the stroke,
// b-axis across it (rows for horizontal bars, columns for vertical)
interface TBar { a0: number; a1: number; b0: number; b1: number; sr: number; sg: number; sb: number; n: number; }

function barDist(t: TBar, r: number, g: number, bl: number): number {
  const mr = t.sr / t.n, mg = t.sg / t.n, mb = t.sb / t.n;
  return Math.max(Math.abs(mr - r), Math.abs(mg - g), Math.abs(mb - bl));
}

function traceScan(img: PngImg, horiz: boolean, bg: number[]): TBar[] {
  const NB = horiz ? img.h : img.w;
  const NA = horiz ? img.w : img.h;
  const minLen = horiz ? 24 : 8;
  const open: TBar[] = [];
  const commit = (a0: number, a1: number, sr: number, sg: number, sb: number,
                  n: number, b: number): void => {
    if (a1 - a0 + 1 < minLen) return;
    const r = sr / n, g = sg / n, bl = sb / n;
    for (const t of open) {
      if (t.b1 < b - 1) continue;
      const ov = Math.min(a1, t.a1) - Math.max(a0, t.a0) + 1;
      if (ov < (Math.min(a1 - a0, t.a1 - t.a0) + 1) * 0.6) continue;
      if (barDist(t, r, g, bl) > 64) continue;
      t.a0 = Math.min(t.a0, a0); t.a1 = Math.max(t.a1, a1); t.b1 = b;
      t.sr += sr; t.sg += sg; t.sb += sb; t.n += n;
      return;
    }
    open.push({ a0: a0, a1: a1, b0: b, b1: b, sr: sr, sg: sg, sb: sb, n: n });
  };
  for (let b = 0; b < NB; b++) {
    let a0 = -1, sr = 0, sg = 0, sb = 0, n = 0;
    for (let a = 0; a <= NA; a++) {
      let ink = false, r = 0, g = 0, bl = 0;
      if (a < NA) {
        const o = horiz ? (b * img.w + a) * 3 : (a * img.w + b) * 3;
        r = img.rgb[o]; g = img.rgb[o + 1]; bl = img.rgb[o + 2];
        ink = Math.max(Math.abs(r - bg[0]), Math.abs(g - bg[1]), Math.abs(bl - bg[2])) > 60;
        if (ink && n > 0) {
          // colour change splits the run: the extent drawn over the route
          // stays a different stroke from the route it covers
          const d = Math.max(Math.abs(sr / n - r), Math.abs(sg / n - g), Math.abs(sb / n - bl));
          if (d > 64) { commit(a0, a - 1, sr, sg, sb, n, b); a0 = a; sr = 0; sg = 0; sb = 0; n = 0; }
        }
      }
      if (ink) {
        if (n === 0) a0 = a;
        sr += r; sg += g; sb += bl; n++;
      } else if (n > 0) {
        commit(a0, a - 1, sr, sg, sb, n, b);
        n = 0; sr = 0; sg = 0; sb = 0;
      }
    }
  }
  // validity: long, thin, and genuinely stroke-shaped
  const done: TBar[] = [];
  for (const t of open) {
    const len = t.a1 - t.a0 + 1, thick = t.b1 - t.b0 + 1;
    if (len >= minLen && thick <= 18 && len >= 3 * thick) done.push(t);
  }
  return done;
}

// same-colour bars in one band whose gap is small — or is covered by OTHER
// bars in the band (the extent hiding the route beneath it) — are one stroke
function traceMerge(bars: TBar[]): TBar[] {
  const bc = (t: TBar): number => (t.b0 + t.b1) / 2;
  bars.sort((a, b) => bc(a) - bc(b));
  const groups: TBar[][] = [];
  for (const t of bars) {
    const g = groups.length ? groups[groups.length - 1] : null;
    if (g && bc(t) - bc(g[g.length - 1]) <= 6) g.push(t);
    else groups.push([t]);
  }
  const out: TBar[] = [];
  for (const g of groups) {
    g.sort((a, b) => a.a0 - b.a0);
    for (let i = 0; i < g.length; i++) {
      const cur = g[i];
      for (let j = i + 1; j < g.length; j++) {
        const nx = g[j];
        if (barDist(cur, nx.sr / nx.n, nx.sg / nx.n, nx.sb / nx.n) > 64) continue;
        const gap = nx.a0 - cur.a1;
        if (gap > 8) {
          let cov = 0;
          for (const o of g) {
            if (o === cur || o === nx) continue;
            cov += Math.max(0, Math.min(o.a1, nx.a0) - Math.max(o.a0, cur.a1));
          }
          if (cov < gap * 0.8) continue;
        }
        cur.a1 = Math.max(cur.a1, nx.a1);
        cur.b0 = Math.min(cur.b0, nx.b0); cur.b1 = Math.max(cur.b1, nx.b1);
        cur.sr += nx.sr; cur.sg += nx.sg; cur.sb += nx.sb; cur.n += nx.n;
        g.splice(j, 1); j--;
      }
      out.push(cur);
    }
  }
  return out;
}

function traceImage(img: PngImg, X: number, Y: number, W: number, H: number): FRaw[] {
  // background: the border ring's average colour
  let br = 0, bgc = 0, bb2 = 0, bn = 0;
  const sample = (x: number, y: number): void => {
    const o = (y * img.w + x) * 3;
    br += img.rgb[o]; bgc += img.rgb[o + 1]; bb2 += img.rgb[o + 2]; bn++;
  };
  for (let x = 0; x < img.w; x += 4) { sample(x, 0); sample(x, img.h - 1); }
  for (let y = 0; y < img.h; y += 4) { sample(0, y); sample(img.w - 1, y); }
  const bg = [br / bn, bgc / bn, bb2 / bn];
  const hbars = traceMerge(traceScan(img, true, bg));
  const vbars = traceMerge(traceScan(img, false, bg));
  if (hbars.length === 0 || hbars.length + vbars.length > TRACE_MAX_BARS) return [];
  const sx = W / img.w, sy = H / img.h;
  const hex = (t: TBar): string =>
    ("00000" + ((((t.sr / t.n) | 0) << 16) | (((t.sg / t.n) | 0) << 8) | ((t.sb / t.n) | 0))
      .toString(16)).slice(-6);
  const out: FRaw[] = [];
  for (const t of hbars) {
    const yc = Y + ((t.b0 + t.b1 + 1) / 2) * sy;
    out.push({ x1: X + t.a0 * sx, y1: yc, x2: X + (t.a1 + 1) * sx, y2: yc,
      w: (t.a1 - t.a0 + 1) * sx, h: 0, col: hex(t), dash: "", arrow: false, bent: false });
  }
  for (const t of vbars) {
    const xc = X + ((t.b0 + t.b1 + 1) / 2) * sx;
    out.push({ x1: xc, y1: Y + t.a0 * sy, x2: xc, y2: Y + (t.a1 + 1) * sy,
      w: 0, h: (t.a1 - t.a0 + 1) * sy, col: hex(t), dash: "", arrow: false, bent: false });
  }
  return out;
}

interface FPic { x: number; y: number; w: number; h: number; data: Uint8Array; entry: string; }

function slidePics(bytes: Uint8Array, entries: ZipEntry[], slideName: string, xml: string): FPic[] {
  const relsName = slideName.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels";
  const relsE = entries.filter((e) => e.name === relsName)[0];
  if (!relsE) return [];
  let rels = "";
  try { rels = utf8ToString(extractEntry(bytes, relsE)); } catch (e) { return []; }
  const idTo: { [id: string]: string } = {};
  const tagRe = /<Relationship\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(rels)) !== null) {
    const idm = m[0].match(/\bId="([^"]+)"/);
    const tgm = m[0].match(/\bTarget="([^"]+)"/);
    if (idm && tgm) idTo[idm[1]] = tgm[1];
  }
  const gs = figGroups(xml);
  const out: FPic[] = [];
  const pre = /<p:pic>([\s\S]*?)<\/p:pic>/g;
  while ((m = pre.exec(xml)) !== null) {
    const b = m[1];
    const em = b.match(/<a:blip r:embed="([^"]+)"/);
    const o = b.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const e = b.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    if (!em || !o || !e) continue;
    let tg = idTo[em[1]] || "";
    if (!tg) continue;
    if (tg.indexOf("../") === 0) tg = "ppt/" + tg.slice(3);
    else if (tg.indexOf("/") === 0) tg = tg.slice(1);
    const pe = entries.filter((x) => x.name === tg)[0];
    if (!pe) continue;
    let data: Uint8Array;
    try { data = extractEntry(bytes, pe); } catch (err) { continue; }
    if (data.length < 8 || data[0] !== 0x89 || data[1] !== 0x50) continue; // PNG only
    const t = figXform(gs, m.index, parseInt(o[1], 10), parseInt(o[2], 10),
                       parseInt(e[1], 10), parseInt(e[2], 10));
    out.push({ x: t[0] * EMU_PX, y: t[1] * EMU_PX,
               w: t[2] * EMU_PX, h: t[3] * EMU_PX, data: data,
               entry: tg.replace(/^.*\//, "") });
  }
  out.sort((a, b) => b.w * b.h - a.w * a.h);
  return out.slice(0, 2);
}

function traceFigures(xml: string, no: number, pics: FPic[], tables: FTable[]): SlideFigure[] {
  const parsed = parseSlide(xml);
  const qual: Cluster[] = [];
  for (const pic of pics) {
    const img = pngDecode(pic.data);
    if (!img) continue;
    const lines = traceImage(img, pic.x, pic.y, pic.w, pic.h);
    if (!lines.length) continue;
    const clusters = clusterParsed({ lines: lines, nodes: [], paths: [], texts: parsed.texts });
    for (const c of clusters) {
      // stricter than the vector gate: a traced figure must be a route AND
      // a real ruler (3+ ticks) — anything looser is a screenshot fragment
      const cls = classifyLines(c.lines);
      let routes = 0, ticks = 0;
      for (const x of cls) {
        if (x.role === "route") routes++;
        else if (x.role === "tick") ticks++;
      }
      if (routes >= 1 && ticks >= 3) qual.push(c);
    }
  }
  const out: SlideFigure[] = [];
  const spans: number[][] = [];
  for (let i = 0; i < qual.length; i++) {
    out.push(renderRuler(qual[i], no, i + 1, qual.length, true));
    spans.push([qual[i].y0, qual[i].y1]);
  }
  assignAnchors(out, spans, tables);
  return out;
}

// ---------------------------------------- wireframe tier (DF-11)
// A pasted picture that is a SCREENSHOT OF THE APP — a search panel, a
// results list, an attribute table — is not a route diagram, and the trace
// tier rightly refused it. It is still the content of its slide, so it is
// redrawn as a standardized WIREFRAME: closed border rectangles assemble
// into panels, group boxes and input fields; flat colour regions become
// buttons, header bands and tiles, palette-tinted by the same hue-family
// rule as everything else; interior full-width borders become table-row
// separators; and rows of glyph-sized ink become placeholder text bars
// (heading and body weights). Text inside a screenshot is pixels — no OCR
// is attempted; each bar keeps its row's true position and extent, and the
// alt text says the labels are placeholders. Layout is normalised the way
// the rulers and graphs are: edges that jitter within UI_SNAP snap to one
// shared coordinate, and every wireframe renders at one standardized width.
//
// The gate is STRUCTURAL, which is what lets this tier screen raster
// slides ahead of the ruler trace: an interface has a flat light ground,
// at least one ASSEMBLED closed rectangle, and 3+ text rows — a route
// diagram has none of those (open lines and tick stubs assemble no
// rectangles), so diagram-shaped pictures fall straight through to the
// trace tier, while a sparse screenshot can no longer slip under the
// 48-stroke cap and come out a bogus ruler. Photos and maps fail the
// flat-ground test and stay silent.

interface UBlock { x0: number; y0: number; x1: number; y1: number; col: string; kind: string; role: string; }
interface UTextRow { x0: number; y0: number; x1: number; y1: number; h: number; kind: string; }
interface URect { x0: number; y0: number; x1: number; y1: number; kind: string; }
interface USep { x0: number; y0: number; x1: number; y1: number; }
interface UiParts {
  rects: URect[]; blocks: UBlock[]; texts: UTextRow[];
  hseps: USep[]; vseps: USep[]; rules: USep[];
}
// an OCR'd word in the picture's own pixel space (DF-12)
interface UWord { x: number; y: number; w: number; h: number; t: string; }

// DF-12: transcriptions arrive as JSON — [{ entry, words: [{x,y,w,h,t,c?}] }],
// entry a media basename, coordinates in the picture's pixels, c the OCR
// engine's confidence. Defensive parse: this crosses a process boundary
// (the sweep's Tesseract lane), so anything malformed degrades to "no
// transcription" — never a throw, the same stance RelatedRank takes on
// its JSON inputs.
function uiOcrParse(ocrJson?: string): { [entry: string]: UWord[] } {
  const out: { [entry: string]: UWord[] } = {};
  if (!ocrJson) return out;
  let data: unknown;
  try { data = JSON.parse(ocrJson); } catch (e) { return out; }
  if (!Array.isArray(data)) return out;
  for (const raw of data as { entry?: unknown; words?: unknown }[]) {
    if (!raw || typeof raw.entry !== "string" || !Array.isArray(raw.words)) continue;
    const ws: UWord[] = [];
    for (const w of raw.words as { x?: unknown; y?: unknown; w?: unknown; h?: unknown; t?: unknown; c?: unknown }[]) {
      if (!w || typeof w.t !== "string") continue;
      const t = w.t.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
      if (!t) continue;
      const x = Number(w.x), y = Number(w.y), wd = Number(w.w), ht = Number(w.h);
      if (!isFinite(x) || !isFinite(y) || !(wd > 0) || !(ht > 0)) continue;
      const c = w.c === undefined ? 100 : Number(w.c);
      if (!(c >= UI_OCR_CONF)) continue;
      ws.push({ x: x, y: y, w: wd, h: ht, t: t });
    }
    if (ws.length) out[raw.entry.replace(/^.*\//, "")] = ws;
  }
  return out;
}

// the OCR words whose boxes sit on this text row, left to right. A word
// belongs to the row when their vertical extents genuinely overlap and it
// is not wholly outside the row's span — the row's own geometry stays the
// layout authority (position and extent come from the scanned ink, the
// words only replace the greek).
function uiRowText(t: UTextRow, words: UWord[]): string {
  const hits: UWord[] = [];
  for (const w of words) {
    const ov = Math.min(t.y1, w.y + w.h) - Math.max(t.y0, w.y);
    if (ov < 0.55 * Math.min(t.y1 - t.y0 + 1, w.h)) continue;
    if (w.x + w.w < t.x0 - 8 || w.x > t.x1 + 8) continue;
    hits.push(w);
  }
  hits.sort((a, b) => a.x - b.x);
  const parts: string[] = [];
  for (const w of hits) parts.push(w.t);
  let s = parts.join(" ").trim();
  if (s.length > 90) s = s.slice(0, 89) + "…";
  return s;
}

function uiRingBg(img: PngImg): number[] {
  let br = 0, bgc = 0, bb2 = 0, bn = 0;
  const sample = (x: number, y: number): void => {
    const o = (y * img.w + x) * 3;
    br += img.rgb[o]; bgc += img.rgb[o + 1]; bb2 += img.rgb[o + 2]; bn++;
  };
  for (let x = 0; x < img.w; x += 4) { sample(x, 0); sample(x, img.h - 1); }
  for (let y = 0; y < img.h; y += 4) { sample(0, y); sample(img.w - 1, y); }
  return [br / bn, bgc / bn, bb2 / bn];
}

// an interface sits on a flat, light ground; a photo or a map does not.
// Sampled on a grid — the answer is a ratio, not a census.
function uiIsFlat(img: PngImg, bg: number[]): boolean {
  if ((bg[0] + bg[1] + bg[2]) / 3 < 150) return false;
  let flat = 0, n = 0;
  for (let y = 0; y < img.h; y += 3) {
    for (let x = 0; x < img.w; x += 3) {
      const o = (y * img.w + x) * 3;
      const d = Math.max(Math.abs(img.rgb[o] - bg[0]),
        Math.abs(img.rgb[o + 1] - bg[1]), Math.abs(img.rgb[o + 2] - bg[2]));
      if (d <= 42) flat++;
      n++;
    }
  }
  return n > 0 && flat / n >= 0.45;
}

// thin border strokes — the trace tier's scan re-tuned for interface
// chrome: a softer ink threshold (borders are light greys), a lower
// minimum length (a field is narrower than a route), and only genuinely
// thin marks (<=5px) — filled regions belong to the block pass.
function uiScanThin(img: PngImg, horiz: boolean, bg: number[]): TBar[] {
  const NB = horiz ? img.h : img.w;
  const NA = horiz ? img.w : img.h;
  const minLen = 12;
  const open: TBar[] = [];
  const commit = (a0: number, a1: number, sr: number, sg: number, sb: number,
                  n: number, b: number): void => {
    if (a1 - a0 + 1 < minLen) return;
    const r = sr / n, g = sg / n, bl = sb / n;
    for (const t of open) {
      if (t.b1 < b - 1) continue;
      const ov = Math.min(a1, t.a1) - Math.max(a0, t.a0) + 1;
      if (ov < (Math.min(a1 - a0, t.a1 - t.a0) + 1) * 0.6) continue;
      if (barDist(t, r, g, bl) > 64) continue;
      t.a0 = Math.min(t.a0, a0); t.a1 = Math.max(t.a1, a1); t.b1 = b;
      t.sr += sr; t.sg += sg; t.sb += sb; t.n += n;
      return;
    }
    open.push({ a0: a0, a1: a1, b0: b, b1: b, sr: sr, sg: sg, sb: sb, n: n });
  };
  for (let b = 0; b < NB; b++) {
    let a0 = -1, sr = 0, sg = 0, sb = 0, n = 0;
    for (let a = 0; a <= NA; a++) {
      let ink = false, r = 0, g = 0, bl = 0;
      if (a < NA) {
        const o = horiz ? (b * img.w + a) * 3 : (a * img.w + b) * 3;
        r = img.rgb[o]; g = img.rgb[o + 1]; bl = img.rgb[o + 2];
        ink = Math.max(Math.abs(r - bg[0]), Math.abs(g - bg[1]), Math.abs(bl - bg[2])) > UI_INK;
        if (ink && n > 0) {
          const d = Math.max(Math.abs(sr / n - r), Math.abs(sg / n - g), Math.abs(sb / n - bl));
          if (d > 64) { commit(a0, a - 1, sr, sg, sb, n, b); a0 = a; sr = 0; sg = 0; sb = 0; n = 0; }
        }
      }
      if (ink) {
        if (n === 0) a0 = a;
        sr += r; sg += g; sb += bl; n++;
      } else if (n > 0) {
        commit(a0, a - 1, sr, sg, sb, n, b);
        n = 0; sr = 0; sg = 0; sb = 0;
      }
    }
  }
  const done: TBar[] = [];
  for (const t of open) {
    const len = t.a1 - t.a0 + 1, thick = t.b1 - t.b0 + 1;
    if (len >= minLen && thick <= 5 && len >= 4 * thick) done.push(t);
  }
  return done;
}

// flat colour regions — buttons, header bands, selected tabs, tiles — found
// on a coarse cell grid so a glyph or an icon printed over the fill cannot
// fragment it: a cell is solid when nearly all its pixels agree on one
// colour that is not the ground, and adjacent agreeing cells merge.
function uiBlocks(img: PngImg, bg: number[]): UBlock[] {
  const CELL = 6;
  const gw = Math.floor(img.w / CELL), gh = Math.floor(img.h / CELL);
  if (gw < 2 || gh < 2) return [];
  const mean: number[][] = [];
  const solid: boolean[] = [];
  for (let cy = 0; cy < gh; cy++) {
    for (let cx = 0; cx < gw; cx++) {
      let sr = 0, sg = 0, sb = 0;
      for (let y = cy * CELL; y < cy * CELL + CELL; y++) {
        for (let x = cx * CELL; x < cx * CELL + CELL; x++) {
          const o = (y * img.w + x) * 3;
          sr += img.rgb[o]; sg += img.rgb[o + 1]; sb += img.rgb[o + 2];
        }
      }
      const n = CELL * CELL;
      const mr = sr / n, mg = sg / n, mb = sb / n;
      let agree = 0;
      for (let y = cy * CELL; y < cy * CELL + CELL; y++) {
        for (let x = cx * CELL; x < cx * CELL + CELL; x++) {
          const o = (y * img.w + x) * 3;
          const d = Math.max(Math.abs(img.rgb[o] - mr),
            Math.abs(img.rgb[o + 1] - mg), Math.abs(img.rgb[o + 2] - mb));
          if (d <= 40) agree++;
        }
      }
      const db = Math.max(Math.abs(mr - bg[0]), Math.abs(mg - bg[1]), Math.abs(mb - bg[2]));
      mean.push([mr, mg, mb]);
      solid.push(agree >= n * 0.82 && db > UI_INK);
    }
  }
  const parent: number[] = [];
  for (let i = 0; i < gw * gh; i++) parent.push(i);
  const find = (i: number): number => {
    while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; }
    return i;
  };
  const near = (a: number, b: number): boolean =>
    Math.max(Math.abs(mean[a][0] - mean[b][0]), Math.abs(mean[a][1] - mean[b][1]),
      Math.abs(mean[a][2] - mean[b][2])) <= 48;
  for (let cy = 0; cy < gh; cy++) {
    for (let cx = 0; cx < gw; cx++) {
      const i = cy * gw + cx;
      if (!solid[i]) continue;
      if (cx + 1 < gw && solid[i + 1] && near(i, i + 1)) parent[find(i)] = find(i + 1);
      if (cy + 1 < gh && solid[i + gw] && near(i, i + gw)) parent[find(i)] = find(i + gw);
    }
  }
  const comp: { [r: string]: { x0: number; y0: number; x1: number; y1: number;
    n: number; sr: number; sg: number; sb: number } } = {};
  for (let cy = 0; cy < gh; cy++) {
    for (let cx = 0; cx < gw; cx++) {
      const i = cy * gw + cx;
      if (!solid[i]) continue;
      const r = String(find(i));
      if (!comp[r]) comp[r] = { x0: cx, y0: cy, x1: cx, y1: cy, n: 0, sr: 0, sg: 0, sb: 0 };
      const c = comp[r];
      c.x0 = Math.min(c.x0, cx); c.x1 = Math.max(c.x1, cx);
      c.y0 = Math.min(c.y0, cy); c.y1 = Math.max(c.y1, cy);
      c.n++; c.sr += mean[i][0]; c.sg += mean[i][1]; c.sb += mean[i][2];
    }
  }
  const out: UBlock[] = [];
  for (const r in comp) {
    const c = comp[r];
    const bw = (c.x1 - c.x0 + 1), bh = (c.y1 - c.y0 + 1);
    if (c.n < bw * bh * 0.55) continue;
    if (bw * CELL < 18 || bh * CELL < 10) continue;
    const hx = (v: number): string => ("0" + (Math.round(v) & 0xff).toString(16)).slice(-2);
    out.push({ x0: c.x0 * CELL, y0: c.y0 * CELL,
      x1: (c.x1 + 1) * CELL, y1: (c.y1 + 1) * CELL,
      col: hx(c.sr / c.n) + hx(c.sg / c.n) + hx(c.sb / c.n), kind: "btn", role: "" });
  }
  return out;
}

// glyph-sized ink: short runs stack into glyph boxes (an active-set sweep,
// so cost stays linear in the ink), then glyphs sharing a baseline chain
// into text rows. Border verticals masquerading as strokes are rejected by
// aspect; border horizontals never enter (their runs are long).
function uiTextRows(img: PngImg, bg: number[]): UTextRow[] {
  interface Gly { x0: number; x1: number; y0: number; y1: number; last: number; }
  const open: Gly[] = [];
  const done: Gly[] = [];
  for (let y = 0; y < img.h; y++) {
    for (let i = open.length - 1; i >= 0; i--) {
      if (open[i].last < y - 2) { done.push(open[i]); open.splice(i, 1); }
    }
    let a0 = -1;
    for (let x = 0; x <= img.w; x++) {
      let ink = false;
      if (x < img.w) {
        const o = (y * img.w + x) * 3;
        ink = Math.max(Math.abs(img.rgb[o] - bg[0]), Math.abs(img.rgb[o + 1] - bg[1]),
          Math.abs(img.rgb[o + 2] - bg[2])) > UI_INK;
      }
      if (ink) { if (a0 < 0) a0 = x; continue; }
      if (a0 < 0) continue;
      const a1 = x - 1;
      if (a1 - a0 + 1 <= 14) {
        let hit: Gly | null = null;
        for (const g of open) {
          if (a0 <= g.x1 + 2 && a1 >= g.x0 - 2) { hit = g; break; }
        }
        if (hit) {
          hit.x0 = Math.min(hit.x0, a0); hit.x1 = Math.max(hit.x1, a1);
          hit.y1 = y; hit.last = y;
        } else {
          open.push({ x0: a0, x1: a1, y0: y, y1: y, last: y });
        }
      }
      a0 = -1;
    }
  }
  for (const g of open) done.push(g);
  const glyphs: Gly[] = [];
  for (const g of done) {
    const w = g.x1 - g.x0 + 1, h = g.y1 - g.y0 + 1;
    if (w > 40 || h < 4 || h > UI_GLYPH_HMAX) continue;
    if (w <= 3 && h > 6 * w) continue;   // a border sliver, not a stroke
    glyphs.push(g);
  }
  glyphs.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const rows: UTextRow[] = [];
  let band: Gly[] = [];
  const flushBand = (): void => {
    if (!band.length) return;
    const hs = band.map((g) => g.y1 - g.y0 + 1).sort((a, b) => a - b);
    const bh = hs[Math.floor(hs.length / 2)];
    band.sort((a, b) => a.x0 - b.x0);
    let cur: UTextRow | null = null;
    let count = 0;
    const emit = (): void => {
      if (cur && (count >= 2 || cur.x1 - cur.x0 >= 12) && cur.x1 - cur.x0 >= 10) rows.push(cur);
      cur = null; count = 0;
    };
    for (const g of band) {
      if (cur && g.x0 - cur.x1 <= Math.max(6, UI_TEXT_GAP * bh)) {
        cur.x1 = Math.max(cur.x1, g.x1);
        cur.y0 = Math.min(cur.y0, g.y0); cur.y1 = Math.max(cur.y1, g.y1);
        cur.h = cur.y1 - cur.y0 + 1;
        count++;
      } else {
        emit();
        cur = { x0: g.x0, y0: g.y0, x1: g.x1, y1: g.y1, h: g.y1 - g.y0 + 1, kind: "gk" };
        count = 1;
      }
    }
    emit();
    band = [];
  };
  for (const g of glyphs) {
    if (band.length) {
      const last = band[band.length - 1];
      if ((g.y0 + g.y1) / 2 - (last.y0 + last.y1) / 2 > 5) flushBand();
    }
    band.push(g);
  }
  flushBand();
  return rows;
}

// anti-aliasing splits one drawn edge into several parallel 1px bars in
// nearby columns whose shades differ too much for the colour merge to
// unite (a soft seam ramps white→grey→white; adjacent steps pass, the
// extremes don't). Left alone, each bar assembled into its OWN separator:
// one edge rendered as a full-height line cluster through the middle of
// the figure, one table border as a double line (DF-12). Bars in the same
// orientation whose cross-axis gap is within UI_PAR_GAP and whose spans
// genuinely overlap are ONE stroke; colour is deliberately ignored — the
// shades differing is exactly the failure being repaired.
function uiCollapseParallel(bars: TBar[]): TBar[] {
  const bc = (t: TBar): number => (t.b0 + t.b1) / 2;
  bars.sort((a, b) => bc(a) - bc(b));
  const out: TBar[] = [];
  for (const t of bars) {
    let hit: TBar | null = null;
    for (let i = out.length - 1; i >= 0; i--) {
      const o = out[i];
      if (t.b0 - o.b1 > UI_PAR_GAP) break;
      const ov = Math.min(t.a1, o.a1) - Math.max(t.a0, o.a0) + 1;
      if (ov >= 0.7 * (Math.min(t.a1 - t.a0, o.a1 - o.a0) + 1)) { hit = o; break; }
    }
    if (hit) {
      hit.a0 = Math.min(hit.a0, t.a0); hit.a1 = Math.max(hit.a1, t.a1);
      hit.b0 = Math.min(hit.b0, t.b0); hit.b1 = Math.max(hit.b1, t.b1);
      hit.sr += t.sr; hit.sg += t.sg; hit.sb += t.sb; hit.n += t.n;
    } else out.push(t);
  }
  return out;
}

// a separator that runs THROUGH content is a scan artifact, not layout
// (DF-12): a real row separator sits BETWEEN text rows and a real column
// rule passes BETWEEN cells, while a gradient seam or a shadow edge that
// survived the thin-bar scan crosses the glyphs and closed boxes
// themselves. Drop any leftover separator that (a) cuts straight through
// a closed rectangle or colour block — entering one side and leaving the
// other — or (b) passes through the interior of 2+ text rows (2+, so a
// rule grazed by one over-chained row survives).
function uiDropArtifactSeps(asm: { rects: URect[]; hseps: USep[]; vseps: USep[]; rules: USep[] },
                            blocks: UBlock[], texts: UTextRow[]): void {
  const boxes: { x0: number; y0: number; x1: number; y1: number }[] = [];
  for (const r of asm.rects) boxes.push(r);
  for (const b of blocks) boxes.push(b);
  const vBad = (s: USep): boolean => {
    for (const r of boxes) {
      if (s.x0 > r.x0 + 4 && s.x0 < r.x1 - 4 &&
          s.y0 < r.y0 - 4 && s.y1 > r.y1 + 4) return true;
    }
    let rows = 0;
    for (const t of texts) {
      if (s.x0 > t.x0 + 2 && s.x0 < t.x1 - 2 &&
          Math.min(s.y1, t.y1) - Math.max(s.y0, t.y0) >= (t.y1 - t.y0) * 0.5) rows++;
    }
    return rows >= 2;
  };
  const hBad = (s: USep): boolean => {
    for (const r of boxes) {
      if (s.y0 > r.y0 + 4 && s.y0 < r.y1 - 4 &&
          s.x0 < r.x0 - 4 && s.x1 > r.x1 + 4) return true;
    }
    let rows = 0;
    for (const t of texts) {
      if (s.y0 > t.y0 + 2 && s.y0 < t.y1 - 2 &&
          Math.min(s.x1, t.x1) - Math.max(s.x0, t.x0) >= (t.x1 - t.x0) * 0.5) rows++;
    }
    return rows >= 2;
  };
  asm.vseps = asm.vseps.filter((s) => !vBad(s));
  asm.hseps = asm.hseps.filter((s) => !hBad(s));
  asm.rules = asm.rules.filter((s) => !hBad(s));
}

// closed rectangles assemble from the thin bars: a top/bottom pair with
// matching extents plus side verticals covering the span. Bottoms are tried
// FARTHEST first — a table's row separators match its top border's extents
// too, and the nearest-match rule would pair the top with the first row
// line and shred the table into stripes; the true bottom is the farthest
// span whose sides still cover it (two stacked cards fail that coverage
// and fall back to their own bottoms).
function uiAssemble(hb: TBar[], vb: TBar[]): {
  rects: URect[]; hseps: USep[]; vseps: USep[]; rules: USep[];
} {
  interface HB { x0: number; x1: number; y: number; used: boolean; }
  interface VB { y0: number; y1: number; x: number; side: boolean; used: boolean; }
  const hs: HB[] = [];
  for (const t of hb) hs.push({ x0: t.a0, x1: t.a1, y: (t.b0 + t.b1) / 2, used: false });
  const vs: VB[] = [];
  for (const t of vb) vs.push({ y0: t.a0, y1: t.a1, x: (t.b0 + t.b1) / 2, side: false, used: false });
  hs.sort((a, b) => a.y - b.y);
  // a side is single-use: tops process in y order, so the outer box claims
  // its verticals first and a pair of interior row separators can no longer
  // borrow them to assemble a phantom rectangle between themselves — the
  // separators stay separators
  const sideAt = (x: number, y0: number, y1: number): VB | null => {
    for (const v of vs) {
      if (v.side) continue;
      if (Math.abs(v.x - x) > UI_RECT_TOL) continue;
      const ov = Math.min(v.y1, y1) - Math.max(v.y0, y0);
      if (ov >= (y1 - y0) * 0.7) return v;
    }
    return null;
  };
  const rects: URect[] = [];
  for (let i = 0; i < hs.length; i++) {
    if (hs[i].used) continue;
    for (let j = hs.length - 1; j > i; j--) {
      if (hs[j].used) continue;
      if (hs[j].y - hs[i].y < 10) continue;
      if (Math.abs(hs[j].x0 - hs[i].x0) > UI_RECT_TOL) continue;
      if (Math.abs(hs[j].x1 - hs[i].x1) > UI_RECT_TOL) continue;
      const L = sideAt(Math.min(hs[i].x0, hs[j].x0), hs[i].y, hs[j].y);
      const R = sideAt(Math.max(hs[i].x1, hs[j].x1), hs[i].y, hs[j].y);
      if (!L || !R || L === R) continue;
      rects.push({ x0: Math.min(hs[i].x0, hs[j].x0), y0: hs[i].y,
        x1: Math.max(hs[i].x1, hs[j].x1), y1: hs[j].y, kind: "box" });
      hs[i].used = true; hs[j].used = true;
      L.side = true; R.side = true;
      break;
    }
  }
  const hseps: USep[] = [], vseps: USep[] = [], rules: USep[] = [];
  for (const h of hs) {
    if (h.used) continue;
    let host: URect | null = null;
    for (const r of rects) {
      if (h.y <= r.y0 + 4 || h.y >= r.y1 - 4) continue;
      if (h.x0 < r.x0 - 4 || h.x1 > r.x1 + 4) continue;
      if (h.x1 - h.x0 < (r.x1 - r.x0) * 0.6) continue;
      if (!host || (r.x1 - r.x0) * (r.y1 - r.y0) <
          (host.x1 - host.x0) * (host.y1 - host.y0)) host = r;
    }
    if (host) { hseps.push({ x0: h.x0, y0: h.y, x1: h.x1, y1: h.y }); h.used = true; }
    else if (h.x1 - h.x0 >= 90) rules.push({ x0: h.x0, y0: h.y, x1: h.x1, y1: h.y });
  }
  for (const v of vs) {
    if (v.side || v.used) continue;
    for (const r of rects) {
      if (v.x <= r.x0 + 4 || v.x >= r.x1 - 4) continue;
      if (v.y0 < r.y0 - 4 || v.y1 > r.y1 + 4) continue;
      if (v.y1 - v.y0 < (r.y1 - r.y0) * 0.6) continue;
      vseps.push({ x0: v.x, y0: v.y0, x1: v.x, y1: v.y1 });
      v.used = true;
      break;
    }
  }
  return { rects: rects, hseps: hseps, vseps: vseps, rules: rules };
}

// one shared coordinate for edges that jitter within tolerance — the same
// "hand-placement is not layout" rule the rulers and the node grid apply,
// here covering what a screenshot's own rendering jitter and the bar
// scans' rounding leave behind
function uiSnapAxis(items: { v: number; set: (x: number) => void }[], tol: number): void {
  items.sort((a, b) => a.v - b.v);
  let s = 0;
  while (s < items.length) {
    let e = s;
    while (e + 1 < items.length && items[e + 1].v - items[e].v <= tol) e++;
    if (e > s) {
      let m = 0;
      for (let k = s; k <= e; k++) m += items[k].v;
      m /= (e - s + 1);
      for (let k = s; k <= e; k++) items[k].set(m);
    }
    s = e + 1;
  }
}

// the wireframe gate + classification: null means "not an interface"
function uiScan(img: PngImg): UiParts | null {
  const bg = uiRingBg(img);
  if (!uiIsFlat(img, bg)) return null;
  const hb = uiCollapseParallel(traceMerge(uiScanThin(img, true, bg)));
  const vb = uiCollapseParallel(traceMerge(uiScanThin(img, false, bg)));
  const asm = uiAssemble(hb, vb);
  const blocks = uiBlocks(img, bg);
  const texts = uiTextRows(img, bg);
  uiDropArtifactSeps(asm, blocks, texts);
  const total = asm.rects.length + blocks.length + texts.length +
    asm.hseps.length + asm.vseps.length + asm.rules.length;
  if (asm.rects.length < 1) return null;
  if (asm.rects.length + blocks.length < 2) return null;
  if (texts.length < 3) return null;
  if (total > UI_MAX_ELEMS) return null;
  // classification: panels hold things, fields are wide/short and hold at
  // most one text row, everything else stays a group box; blocks split by
  // proportion into buttons, header bands and tiles, tinted by hue family
  const ths = texts.map((t) => t.h).sort((a, b) => a - b);
  const medH = ths.length ? ths[Math.floor(ths.length / 2)] : 10;
  const inside = (x: number, y: number, r: URect): boolean =>
    x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1;
  for (const r of asm.rects) {
    let kids = 0, kidTexts = 0;
    for (const o of asm.rects) {
      if (o === r) continue;
      if ((o.x1 - o.x0) * (o.y1 - o.y0) >= (r.x1 - r.x0) * (r.y1 - r.y0)) continue;
      if (inside((o.x0 + o.x1) / 2, (o.y0 + o.y1) / 2, r)) kids++;
    }
    for (const b of blocks) if (inside((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, r)) kids++;
    for (const t of texts) if (inside((t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2, r)) kidTexts++;
    const w = r.x1 - r.x0, h = r.y1 - r.y0;
    if (h <= Math.max(40, 2.8 * medH) && w >= 2.2 * h && kids === 0 && kidTexts <= 1) {
      r.kind = "field";
    } else if (kids + kidTexts >= 2) {
      r.kind = "panel";
    }
  }
  for (const b of blocks) {
    let parentW = img.w;
    for (const r of asm.rects) {
      if (inside((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, r)) {
        parentW = Math.min(parentW, r.x1 - r.x0);
      }
    }
    const w = b.x1 - b.x0, h = b.y1 - b.y0;
    b.role = figRole(b.col, "muted");
    if (h <= Math.max(44, 3.2 * medH)) b.kind = w >= parentW * 0.55 ? "band" : "btn";
    else b.kind = "tile";
  }
  for (const t of texts) {
    let onfill = false;
    for (const b of blocks) {
      if ((t.x0 + t.x1) / 2 > b.x0 && (t.x0 + t.x1) / 2 < b.x1 &&
          (t.y0 + t.y1) / 2 > b.y0 && (t.y0 + t.y1) / 2 < b.y1) { onfill = true; break; }
    }
    t.kind = onfill ? "gkp" : (t.h >= 1.35 * medH ? "gkh" : "gk");
  }
  return { rects: asm.rects, blocks: blocks, texts: texts,
    hseps: asm.hseps, vseps: asm.vseps, rules: asm.rules };
}

function uiRender(no: number, idx: number, total: number, p: UiParts,
                  imgW: number, words: UWord[] | null): SlideFigure {
  // edge snap in image space, then one standardized width
  const lefts: { v: number; set: (x: number) => void }[] = [];
  const rights: { v: number; set: (x: number) => void }[] = [];
  const tops: { v: number; set: (x: number) => void }[] = [];
  const bots: { v: number; set: (x: number) => void }[] = [];
  const boxy: { x0: number; y0: number; x1: number; y1: number }[] = [];
  for (const r of p.rects) boxy.push(r);
  for (const b of p.blocks) boxy.push(b);
  for (const r of boxy) {
    lefts.push({ v: r.x0, set: (x: number) => { r.x0 = x; } });
    rights.push({ v: r.x1, set: (x: number) => { r.x1 = x; } });
    tops.push({ v: r.y0, set: (x: number) => { r.y0 = x; } });
    bots.push({ v: r.y1, set: (x: number) => { r.y1 = x; } });
  }
  for (const t of p.texts) lefts.push({ v: t.x0, set: (x: number) => { t.x0 = x; } });
  uiSnapAxis(lefts, UI_SNAP); uiSnapAxis(rights, UI_SNAP);
  uiSnapAxis(tops, UI_SNAP); uiSnapAxis(bots, UI_SNAP);
  const mids: { v: number; set: (x: number) => void }[] = [];
  for (const t of p.texts) {
    mids.push({ v: (t.y0 + t.y1) / 2,
      set: (x: number) => { const h = t.y1 - t.y0; t.y0 = x - h / 2; t.y1 = x + h / 2; } });
  }
  uiSnapAxis(mids, 4);
  const s = Math.min(UI_STD_W / imgW, 1.6);
  const el: string[] = [];
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const grow = (a: number, b: number, c: number, d: number): void => {
    x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d);
  };
  const rect = (cls: string, rx0: number, ry0: number, rx1: number, ry1: number,
                rr: number): void => {
    el.push('<rect class="' + cls + '" x="' + fnum(rx0 * s) + '" y="' + fnum(ry0 * s) +
      '" width="' + fnum((rx1 - rx0) * s) + '" height="' + fnum((ry1 - ry0) * s) +
      '" rx="' + fnum(rr) + '"/>');
    grow(rx0 * s, ry0 * s, rx1 * s, ry1 * s);
  };
  // z-order: panels at the back (largest first), colour blocks, then group
  // boxes/fields, separators, and the text bars over everything
  const panels = p.rects.filter((r) => r.kind === "panel")
    .sort((a, b) => (b.x1 - b.x0) * (b.y1 - b.y0) - (a.x1 - a.x0) * (a.y1 - a.y0));
  for (const r of panels) rect("wf-panel", r.x0, r.y0, r.x1, r.y1, NODE_RX);
  for (const b of p.blocks) {
    if (b.kind === "btn") continue;
    rect("wf-btn t-" + b.role + " s-" + b.role, b.x0, b.y0, b.x1, b.y1, 4);
  }
  for (const r of p.rects) {
    if (r.kind === "panel") continue;
    rect(r.kind === "field" ? "wf-field" : "wf-box", r.x0, r.y0, r.x1, r.y1, 4);
  }
  const seps = p.hseps.concat(p.vseps).concat(p.rules);
  for (const q of seps) {
    el.push('<line class="ln wf-sep" x1="' + fnum(q.x0 * s) + '" y1="' + fnum(q.y0 * s) +
      '" x2="' + fnum(q.x1 * s) + '" y2="' + fnum(q.y1 * s) + '"/>');
    grow(q.x0 * s, q.y0 * s, q.x1 * s, q.y1 * s);
  }
  for (const b of p.blocks) {
    if (b.kind !== "btn") continue;
    rect("wf-btn t-" + b.role + " s-" + b.role, b.x0, b.y0, b.x1, b.y1, 4);
  }
  // text rows: real text where OCR covers the row (DF-12), placeholder
  // bars everywhere else. The row's scanned geometry stays the layout
  // authority — the transcription only replaces the greek, in the same
  // three weights the bars used (heading / body / on-fill).
  let txn = 0;
  for (const t of p.texts) {
    const yc = ((t.y0 + t.y1) / 2) * s;
    const label = words ? uiRowText(t, words) : "";
    if (label) {
      const fs = Math.min(15, Math.max(8, t.h * s * 0.9));
      const cls = t.kind === "gkh" ? "wf-txh" : (t.kind === "gkp" ? "wf-txp" : "wf-tx");
      el.push('<text class="' + cls + '" x="' + fnum(t.x0 * s) + '" y="' + fnum(yc + fs * 0.36) +
        '" font-size="' + fnum(fs) + '">' + esc(label) + "</text>");
      grow(t.x0 * s, yc - fs * 0.55, t.x0 * s + label.length * fs * 0.56, yc + fs * 0.55);
      txn++;
      continue;
    }
    const bh = Math.min(12, Math.max(4.5, t.h * s * 0.6));
    const bw = Math.max(8, (t.x1 - t.x0) * s);
    el.push('<rect class="wf-' + t.kind + '" x="' + fnum(t.x0 * s) + '" y="' + fnum(yc - bh / 2) +
      '" width="' + fnum(bw) + '" height="' + fnum(bh) + '" rx="' + fnum(bh / 2) + '"/>');
    grow(t.x0 * s, yc - bh / 2, t.x0 * s + bw, yc + bh / 2);
  }
  const w = x1 - x0 + FIG_PAD * 2, h = y1 - y0 + FIG_PAD * 2;
  const shift = 'transform="translate(' + fnum(FIG_PAD - x0) + "," + fnum(FIG_PAD - y0) + ')"';
  const nf = p.rects.filter((r) => r.kind === "field").length;
  const nb = p.blocks.filter((b) => b.kind === "btn").length;
  const bits: string[] = [];
  if (panels.length) bits.push(panels.length + " panel" + (panels.length === 1 ? "" : "s"));
  if (nf) bits.push(nf + " field" + (nf === 1 ? "" : "s"));
  if (nb) bits.push(nb + " button" + (nb === 1 ? "" : "s"));
  if (p.blocks.length - nb) bits.push((p.blocks.length - nb) + " colour block" +
    (p.blocks.length - nb === 1 ? "" : "s"));
  if (p.hseps.length) bits.push(p.hseps.length + " row separator" +
    (p.hseps.length === 1 ? "" : "s"));
  bits.push(p.texts.length + " text row" + (p.texts.length === 1 ? "" : "s"));
  const title = "Slide " + no + " interface wireframe" +
    (total > 1 ? " (" + idx + " of " + total + ")" : "");
  const txt = txn === 0
    ? "Text inside a screenshot is pixels, so text rows render as placeholder bars"
    : txn + " of " + p.texts.length + " text rows carry text transcribed from the " +
      "screenshot (OCR, approximate)" +
      (txn === p.texts.length ? "" : "; the rest render as placeholder bars");
  const desc = "Interface screenshot redrawn as a standardized wireframe: " +
    bits.join(", ") + ". " + txt + "; positions are approximate to the source " +
    "image and colours are mapped to the corpus palette.";
  return { slide: no, name: figName(no, idx, total),
    svg: svgWrap(no, w, h, title, desc, "<g " + shift + ">" + el.join("") + "</g>"),
    alt: desc, anchor: [] };
}

function uiFigures(no: number, pics: FPic[], tables: FTable[],
                   ocr: { [entry: string]: UWord[] }, wanted: string[]): SlideFigure[] {
  const qual: { pic: FPic; parts: UiParts; w: number }[] = [];
  for (const pic of pics) {
    const img = pngDecode(pic.data);
    if (!img) continue;
    const parts = uiScan(img);
    if (parts) qual.push({ pic: pic, parts: parts, w: img.w });
  }
  const out: SlideFigure[] = [];
  const spans: number[][] = [];
  for (let i = 0; i < qual.length; i++) {
    const words = ocr[qual[i].pic.entry] || null;
    // a wireframe rendered without a transcription is the OCR worth
    // spending (DF-12): name its media entry so the caller can OCR
    // exactly these pictures and re-render once
    if (!words && wanted.indexOf(qual[i].pic.entry) < 0) wanted.push(qual[i].pic.entry);
    out.push(uiRender(no, i + 1, qual.length, qual[i].parts, qual[i].w, words));
    spans.push([qual[i].pic.y, qual[i].pic.y + qual[i].pic.h]);
  }
  assignAnchors(out, spans, tables);
  return out;
}

// vector clusters first (each qualifying cluster is its own figure); a slide
// with no vector diagram falls through to the table-driven redraw, and a
// slide with neither — but a pasted PNG — to the raster tiers: the wireframe
// tier screens the picture first (its structural gate only passes genuine
// interface screenshots, which the ruler trace should never see — window
// chrome is not a route), then the ruler trace takes what remains. Every
// lane anchors its figures to the slide's
// tables (geometry for drawn/traced/wireframe figures, meaning for redrawn
// ones — see assignAnchors/buildRedraw).
function buildFigures(xml: string, no: number, pics: () => FPic[],
                      ocr: { [entry: string]: UWord[] }, wanted: string[]): SlideFigure[] {
  const tables = slideTables(xml);
  const clusters = clusterParsed(parseSlide(xml));
  const qual: { c: Cluster; mode: string }[] = [];
  for (const c of clusters) {
    const mode = clusterMode(c);
    if (mode) qual.push({ c: c, mode: mode });
  }
  const out: SlideFigure[] = [];
  const spans: number[][] = [];
  for (let i = 0; i < qual.length; i++) {
    out.push(qual[i].mode === "ruler"
      ? renderRuler(qual[i].c, no, i + 1, qual.length)
      : renderGraph(qual[i].c, no, i + 1, qual.length));
    spans.push([qual[i].c.y0, qual[i].c.y1]);
  }
  if (out.length) {
    assignAnchors(out, spans, tables);
    return out;
  }
  const r = buildRedraw(xml, no, tables);
  if (r.length) return r;
  const pl = pics();
  const ui = uiFigures(no, pl, tables, ocr, wanted);
  if (ui.length) return ui;
  return traceFigures(xml, no, pl, tables);
}

// ------------------------------------------------ slide ordering
function slideNum(name: string): number {
  const m = name.match(/[sS]lide(\d+)\.xml$/);
  return m ? parseInt(m[1], 10) : 0;
}

// v1.9 (SC-2): true presentation order from ppt/presentation.xml's
// sldIdLst, resolved through ppt/_rels/presentation.xml.rels.
// PowerPoint does not renumber slide parts on reorder/delete, so part
// filenames are creation order, not display order. Fallback: the old
// numeric part sort when either part is missing or resolves to zero
// slides; parts absent from the list are appended (never dropped).
function orderSlides(bytes: Uint8Array, entries: ZipEntry[], slides: ZipEntry[]): ZipEntry[] {
  const fallback = slides.slice().sort((a, b) => slideNum(a.name) - slideNum(b.name));
  const presEntry = entries.filter((e) => e.name === "ppt/presentation.xml")[0];
  const presRels = entries.filter((e) => e.name === "ppt/_rels/presentation.xml.rels")[0];
  if (!presEntry || !presRels) return fallback;
  let presXml = "";
  let relsXml = "";
  try {
    presXml = utf8ToString(extractEntry(bytes, presEntry));
    relsXml = utf8ToString(extractEntry(bytes, presRels));
  } catch (e) {
    return fallback;
  }
  const idToSlide: { [id: string]: string } = {};
  const tagRe = /<Relationship\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(relsXml)) !== null) {
    const idm = m[0].match(/\bId="([^"]+)"/);
    const tgm = m[0].match(/\bTarget="[^"]*?(slides\/slide\d+\.xml)"/);
    if (idm && tgm) idToSlide[idm[1]] = "ppt/" + tgm[1];
  }
  const lst = presXml.match(/<p:sldIdLst>[\s\S]*?<\/p:sldIdLst>/);
  if (!lst) return fallback;
  const byName: { [n: string]: ZipEntry } = {};
  for (const s of slides) byName[s.name] = s;
  const ordered: ZipEntry[] = [];
  const used: { [n: string]: boolean } = {};
  const rid = /r:id="([^"]+)"/g;
  while ((m = rid.exec(lst[0])) !== null) {
    const n = idToSlide[m[1]];
    if (n && byName[n] && !used[n]) {
      used[n] = true;
      ordered.push(byName[n]);
    }
  }
  if (ordered.length === 0) return fallback;
  for (const s of fallback) {
    if (!used[s.name]) ordered.push(s);
  }
  return ordered;
}


// ============ KEEP IN SYNC with ZipTextExtract.ts / MediaExtract.ts =======
// Everything from here down — b64ToBytes, the zip central-directory reader,
// extractEntry, the RFC 1951 inflate and the utf-8 decoder — is duplicated
// byte-for-byte across the three scripts (Office Scripts cannot share
// modules). Every fix landed in one MUST be landed in the others in the same
// batch; the harness equivalence gates are the only enforcement.
// =========================================================================
// ------------------------------------------------------------ base64
// ============ KEEP IN SYNC with MediaExtract.ts (SB-8) ==============
// Everything from here through the utf-8 decoder — b64ToBytes, the
// zip central-directory reader, extractEntry, and the RFC 1951
// inflate — is duplicated byte-for-byte in MediaExtract.ts (Office
// Scripts cannot share modules). Every fix landed here MUST be landed
// there in the same batch, and vice versa; the harness equivalence
// gates are the only enforcement.
// =====================================================================
// v1.6: Uint8Array + charCode table. Skips '=', CR/LF and any
// non-alphabet char exactly as v1.5's dictionary miss did.
function b64ToBytes(b64: string): Uint8Array {
  const T = new Int32Array(128).fill(-1);
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (let i = 0; i < alpha.length; i++) T[alpha.charCodeAt(i)] = i;
  const out = new Uint8Array(Math.floor((b64.length * 3) / 4) + 3);
  let n = 0;
  let buf = 0, bits = 0;
  for (let i = 0; i < b64.length; i++) {
    const code = b64.charCodeAt(i);
    if (code >= 128) continue;
    const v = T[code];
    if (v < 0) continue;
    buf = (buf << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[n++] = (buf >> bits) & 0xff;
    }
  }
  return n === out.length ? out : out.subarray(0, n);
}

// ------------------------------------------------------------ zip reader
interface ZipEntry {
  name: string;
  method: number;
  flags: number; // v1.9 (SC-14): general-purpose bit flags
  compSize: number;
  uncompSize: number;
  localOffset: number;
}

function u16(b: Uint8Array, p: number): number { return b[p] | (b[p + 1] << 8); }
function u32(b: Uint8Array, p: number): number {
  return (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24)) >>> 0;
}

function readCentralDirectory(b: Uint8Array): ZipEntry[] {
  // find EOCD (0x06054b50) scanning back from end (max comment 64k)
  let eocd = -1;
  const stop = Math.max(0, b.length - 65558);
  for (let p = b.length - 22; p >= stop; p--) {
    if (b[p] === 0x50 && b[p + 1] === 0x4b && b[p + 2] === 0x05 && b[p + 3] === 0x06) {
      eocd = p; break;
    }
  }
  if (eocd < 0) throw new Error("ZipTextExtract: EOCD not found (not a zip?)");
  const count = u16(b, eocd + 10);
  let p = u32(b, eocd + 16); // central directory offset
  const entries: ZipEntry[] = [];
  for (let i = 0; i < count; i++) {
    if (u32(b, p) !== 0x02014b50) throw new Error("ZipTextExtract: bad central header at " + p);
    const flags = u16(b, p + 8);
    const method = u16(b, p + 10);
    const compSize = u32(b, p + 20);
    const uncompSize = u32(b, p + 24);
    const nameLen = u16(b, p + 28);
    const extraLen = u16(b, p + 30);
    const commentLen = u16(b, p + 32);
    const localOffset = u32(b, p + 42);
    let name = "";
    for (let k = 0; k < nameLen; k++) name += String.fromCharCode(b[p + 46 + k]);
    entries.push({ name: name, method: method, flags: flags, compSize: compSize, uncompSize: uncompSize, localOffset: localOffset });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function extractEntry(b: Uint8Array, e: ZipEntry): Uint8Array {
  // v1.9 (SC-14): an encrypted stored entry would otherwise return
  // ciphertext as "text" silently — the one silent-wrong-output path
  // in the zip layer.
  if ((e.flags & 0x1) !== 0) throw new Error("ZipTextExtract: encrypted entry " + e.name);
  const p = e.localOffset;
  if (u32(b, p) !== 0x04034b50) throw new Error("ZipTextExtract: bad local header for " + e.name);
  const nameLen = u16(b, p + 26);
  const extraLen = u16(b, p + 28); // local extra can differ from central
  const dataStart = p + 30 + nameLen + extraLen;
  const data = b.subarray(dataStart, dataStart + e.compSize); // v1.6: view, no copy
  if (e.method === 0) return data;                    // stored
  if (e.method === 8) return inflateRaw(data, e.uncompSize); // deflate
  throw new Error("ZipTextExtract: unsupported compression method " + e.method + " for " + e.name);
}

// ------------------------------------------------------------ inflate (RFC 1951)
const LEN_BASE = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
const LEN_EXTRA = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
const DIST_BASE = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
const DIST_EXTRA = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
const CLC_ORDER = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

interface Huff { counts: number[]; symbols: number[]; }

function buildHuff(lengths: number[]): Huff {
  const counts = new Array<number>(16).fill(0);
  for (const l of lengths) counts[l]++;
  counts[0] = 0;
  const offs = new Array<number>(16).fill(0);
  for (let i = 1; i < 16; i++) offs[i] = offs[i - 1] + counts[i - 1];
  const symbols = new Array<number>(lengths.length).fill(0);
  for (let s = 0; s < lengths.length; s++) {
    if (lengths[s] !== 0) symbols[offs[lengths[s]]++] = s;
  }
  return { counts: counts, symbols: symbols };
}

// v1.6: output preallocated from outHint (central-directory uncompSize),
// doubling growth as a safety net; write pointer instead of push. The
// back-reference copy stays a byte-wise loop — overlapping copies
// (distance < length) are RLE by definition and forbid block copies.
function inflateRaw(src: Uint8Array, outHint: number): Uint8Array {
  let out = new Uint8Array(outHint > 0 ? outHint : 1024);
  let outLen = 0;
  let pos = 0;      // byte position
  let bitBuf = 0, bitCnt = 0;

  function ensure(extra: number): void {
    if (outLen + extra <= out.length) return;
    let cap = out.length * 2;
    while (cap < outLen + extra) cap *= 2;
    const grown = new Uint8Array(cap);
    grown.set(out);
    out = grown;
  }

  function bits(n: number): number {
    while (bitCnt < n) {
      if (pos >= src.length) throw new Error("inflate: out of input");
      bitBuf |= src[pos++] << bitCnt;
      bitCnt += 8;
    }
    const v = bitBuf & ((1 << n) - 1);
    bitBuf >>>= n;
    bitCnt -= n;
    return v;
  }

  function decodeSym(h: Huff): number {
    let code = 0, first = 0, index = 0;
    for (let len = 1; len < 16; len++) {
      code |= bits(1);
      const count = h.counts[len];
      if (code - first < count) return h.symbols[index + (code - first)];
      index += count;
      first = (first + count) << 1;
      code <<= 1;
    }
    throw new Error("inflate: bad code");
  }

  let fixedLit: Huff | null = null;
  let fixedDist: Huff | null = null;

  while (true) {
    const final = bits(1);
    const type = bits(2);
    if (type === 0) {
      // stored block: align to byte
      bitBuf = 0; bitCnt = 0;
      const len = src[pos] | (src[pos + 1] << 8);
      const nlen = src[pos + 2] | (src[pos + 3] << 8);
      pos += 4; // skip LEN + NLEN
      // v2.0 (SB-5): NLEN is LEN's ones-complement by spec — a corrupted
      // length field previously emitted garbled text as a "successful"
      // extraction. (A truncated header is caught by the bounds check
      // below, since pos has already advanced past both fields.)
      if (nlen !== (~len & 0xffff)) throw new Error("inflate: stored block NLEN mismatch");
      // v1.9 (SC-8): a truncated stored block previously zero-padded
      // silently (OOB Uint8Array reads yield undefined -> 0), emitting
      // garbled text as a "successful" extraction. Huffman blocks
      // already throw via bits(); stored blocks now match.
      if (pos + len > src.length) throw new Error("inflate: stored block out of input");
      ensure(len);
      for (let i = 0; i < len; i++) out[outLen++] = src[pos++];
    } else {
      let lit: Huff, dist: Huff;
      if (type === 1) {
        if (!fixedLit) {
          const ll = new Array<number>(288);
          for (let i = 0; i < 144; i++) ll[i] = 8;
          for (let i = 144; i < 256; i++) ll[i] = 9;
          for (let i = 256; i < 280; i++) ll[i] = 7;
          for (let i = 280; i < 288; i++) ll[i] = 8;
          fixedLit = buildHuff(ll);
          fixedDist = buildHuff(new Array<number>(30).fill(5));
        }
        lit = fixedLit; dist = fixedDist as Huff;
      } else if (type === 2) {
        const hlit = bits(5) + 257;
        const hdist = bits(5) + 1;
        const hclen = bits(4) + 4;
        const clcLens = new Array<number>(19).fill(0);
        for (let i = 0; i < hclen; i++) clcLens[CLC_ORDER[i]] = bits(3);
        const clc = buildHuff(clcLens);
        const lens: number[] = [];
        while (lens.length < hlit + hdist) {
          const sym = decodeSym(clc);
          if (sym < 16) lens.push(sym);
          else if (sym === 16) {
            const prev = lens[lens.length - 1];
            let rep = 3 + bits(2);
            while (rep--) lens.push(prev);
          } else if (sym === 17) {
            let rep = 3 + bits(3);
            while (rep--) lens.push(0);
          } else {
            let rep = 11 + bits(7);
            while (rep--) lens.push(0);
          }
        }
        lit = buildHuff(lens.slice(0, hlit));
        dist = buildHuff(lens.slice(hlit));
      } else {
        throw new Error("inflate: bad block type");
      }
      while (true) {
        const sym = decodeSym(lit);
        if (sym < 256) { ensure(1); out[outLen++] = sym; }
        else if (sym === 256) break;
        else {
          const li = sym - 257;
          const length = LEN_BASE[li] + bits(LEN_EXTRA[li]);
          const dsym = decodeSym(dist);
          const distance = DIST_BASE[dsym] + bits(DIST_EXTRA[dsym]);
          const start = outLen - distance;
          if (start < 0) throw new Error("inflate: bad distance");
          ensure(length);
          for (let i = 0; i < length; i++) out[outLen++] = out[start + i];
        }
      }
    }
    if (final) break;
  }
  return outLen === out.length ? out : out.subarray(0, outLen);
}

// ------------------------------------------------------------ utf-8 decode
// v1.6: identical decode logic; code units buffered and flushed through
// String.fromCharCode in 4096-unit chunks instead of per-char concat.
function utf8ToString(b: Uint8Array): string {
  const parts: string[] = [];
  let codes: number[] = [];
  let i = 0;
  while (i < b.length) {
    const c = b[i];
    if (c < 0x80) { codes.push(c); i += 1; }
    else if (c < 0xe0) { codes.push(((c & 0x1f) << 6) | (b[i + 1] & 0x3f)); i += 2; }
    else if (c < 0xf0) {
      codes.push(((c & 0x0f) << 12) | ((b[i + 1] & 0x3f) << 6) | (b[i + 2] & 0x3f));
      i += 3;
    } else {
      const cp = ((c & 0x07) << 18) | ((b[i + 1] & 0x3f) << 12) | ((b[i + 2] & 0x3f) << 6) | (b[i + 3] & 0x3f);
      const u = cp - 0x10000;
      codes.push(0xd800 + (u >> 10), 0xdc00 + (u & 0x3ff));
      i += 4;
    }
    if (codes.length >= 4096) {
      parts.push(String.fromCharCode(...codes));
      codes = [];
    }
  }
  if (codes.length > 0) parts.push(String.fromCharCode(...codes));
  return parts.join("");
}
