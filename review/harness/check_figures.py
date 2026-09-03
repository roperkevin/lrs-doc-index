"""Gate for SlideFigures v1.0 (DF-1) — slide diagrams rendered as SVG.

Asserts the contract the sidecars depend on, over `figure_deck.pptx`:

  1. both production paths fire — the VECTOR path on a slide drawn with real
     connectors, the REDRAW path on a slide that has no drawing but states its
     topology and measures in a table (both table shapes in this corpus:
     two-column key/value and header-row);
  2. a slide with neither produces no figure at all (silence, not an empty SVG);
  3. component standardisation: uniform tick lengths, measures on one shared
     baseline, extents with butt caps snapped to share an exact boundary, and
     a split marker at that boundary;
  4. the style framework: palette classes only, no source colour leaking into
     a stroke/fill attribute on a normalised (vector) figure;
  5. accessibility: <title> and <desc> on every figure;
  6. no raster is embedded — the whole point of redrawing is that figures stay
     small and restyleable;
  7. well-formedness: every figure parses as XML, and its viewBox contains the
     drawn content.

Pure stdlib plus the fixture build. Exit nonzero on any failure.
"""
import json
import os
import re
import subprocess
import sys
import xml.etree.ElementTree as ET

SCRIPTS = os.environ.get('HARNESS_SCRIPTS', '../../scripts')
failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- wrap the current SlideFigures for Node ------------------------------
src = open(f'{SCRIPTS}/SlideFigures.ts', encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
src += '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const argv = (globalThis as {process?: {argv: string[]}}).process!.argv;
console.log(JSON.stringify(main(null as unknown, fs.readFileSync(argv[2], 'utf8'))));
'''
open('sfig_cur.ts', 'w', encoding='utf-8').write(src)

out = subprocess.run(['node', '--experimental-strip-types', 'sfig_cur.ts',
                      'figure_deck.pptx.b64'],
                     capture_output=True, text=True, encoding='utf-8')
if out.returncode != 0:
    print('FAIL SlideFigures threw:\n' + out.stderr[:2000])
    sys.exit(1)
res = json.loads(out.stdout)
by_slide = {}
for f in res['figures']:
    by_slide.setdefault(f['slide'], []).append(f)
figs = {n: fl[0] for n, fl in by_slide.items()}
allfigs = [(f['name'], f) for f in res['figures']]

# ---- 1 / 2: which slides produce figures --------------------------------
check(1 in figs, 'vector slide (real connectors) produces a figure')
check(2 in figs, 'key/value-table slide produces a redrawn figure')
check(3 in figs, 'header-row-table slide produces a redrawn figure')
check(4 not in figs, 'prose-only slide produces NO figure')
check(res['count'] == len(res['figures']), 'count matches the figure list')

# ---- v1.1 (DF-2): one figure per DIAGRAM, not per slide ------------------
f5 = by_slide.get(5, [])
check(len(f5) == 2, f'two separated rulers -> TWO figures ({len(f5)})')
check([f['name'] for f in f5] == ['slide5_fig1.svg', 'slide5_fig2.svg'],
      f'sibling figures are named slideN_figK ({[f["name"] for f in f5]})')
check(figs[1]['name'] == 'slide1.svg',
      'a slide\'s only figure keeps the v1.0 slideN.svg name')
if len(f5) == 2:
    check('0 to 4' in f5[0]['alt'] and '5 to 9' in f5[1]['alt'],
          'sibling figures come out in top-to-bottom order')
    check('(1 of 2)' in f5[0]['svg'] and '(2 of 2)' in f5[1]['svg'],
          'sibling figure titles say which of how many')
    for f in f5:
        vsvg = f['svg']
        check('class="ln event flat' in vsvg and 'class="split"' in vsvg,
              f'{f["name"]}: each sibling ruler is fully normalised')

# ---- v1.1 (DF-2): the graph lane (nodes + edges, no ruler) ---------------
g6 = figs.get(6, {})
g = g6.get('svg', '')
check(bool(g), 'node/connector slide produces a graph figure')
check('<rect class="node' in g, 'graph: box shape renders as a standardized node')
check('<ellipse class="node' in g, 'graph: oval shape renders as an ellipse node')
check('t-cool' in g and 't-warm' in g,
      'graph: source fills map to palette tints by hue family')
check('class="ln edge' in g, 'graph: connector renders as an edge')
check('Create route' in g and 'Calibrate' in g,
      'graph: node labels carried into the figure')
check('node' in g6.get('alt', '').lower() and 'connector' in g6.get('alt', '').lower(),
      'graph: alt text describes nodes and connectors')

# ---- v1.2 (DF-3): connector routing, grid snap, rotation -----------------
g7 = figs.get(7, {}).get('svg', '')
check(bool(g7), 'routing slide produces a graph figure')
rects7 = re.findall(r'<rect class="node[^"]*" x="(-?[\d.]+)" y="(-?[\d.]+)" '
                    r'width="([\d.]+)" height="([\d.]+)"', g7)
row7 = [r for r in rects7 if float(r[3]) < float(r[2])]       # the three row boxes
tall7 = [r for r in rects7 if float(r[3]) > 2 * float(r[2])]  # the rotated one
check(len(row7) == 3 and len(tall7) == 1,
      f'slide 7: three row boxes and one rotated box ({len(row7)}/{len(tall7)})')
if len(row7) == 3:
    check(len({r[1] for r in row7}) == 1, 'grid snap: jittered boxes share ONE row baseline')
    check(len({r[2] for r in row7}) == 1, 'grid snap: near-equal boxes share ONE width')
    check(len({r[3] for r in row7}) == 1, 'grid snap: near-equal boxes share ONE height')
    xs7 = sorted(row7, key=lambda r: float(r[0]))
    e7 = re.findall(r'<line class="ln edge[^"]*" x1="(-?[\d.]+)" y1="(-?[\d.]+)" '
                    r'x2="(-?[\d.]+)" y2="(-?[\d.]+)"', g7)
    b1r = float(xs7[0][0]) + float(xs7[0][2])
    b2l = float(xs7[1][0])
    cy7 = float(xs7[0][1]) + float(xs7[0][3]) / 2
    hit = [l for l in e7 if abs(float(l[0]) - b1r) < 0.6 and abs(float(l[2]) - b2l) < 0.6
           and abs(float(l[1]) - cy7) < 0.6 and abs(float(l[3]) - cy7) < 0.6]
    check(len(hit) == 1,
          'routing: a dragged connector re-anchors to both node boundaries at row centre')
check('<path class="ln edge' in g7, 'routing: elbow connector routes orthogonally as a path')
if len(tall7) == 1:
    check(abs(float(tall7[0][3]) / float(tall7[0][2]) - 2.4) < 0.05,
          'rotation: quarter-turned box normalises to an axis-aligned w/h swap')
check('Publish' in g7, 'rotation: the rotated node keeps its horizontal label')

# ---- v1.2 (DF-3): legend synthesis ---------------------------------------
v1 = figs.get(1, {}).get('svg', '')
check('class="ln swatch flat s-cool' in v1 and 'class="ln swatch flat s-warm' in v1,
      'legend: two event colours get two swatches')
check(re.search(r'class="legend"[^>]*>E9<', v1) is not None,
      'legend: a swatch is labelled with the id the slide put on its bar')
r2out = (by_slide.get(2, []) + [{}, {}])[1].get('svg', '')
check('E7 0–20' in r2out and 'E7 20–40' in r2out,
      "legend: redraw lane states each extent's measure range (output figure)")

# ---- v1.2 (DF-3): raster tracing tier ------------------------------------
t8 = figs.get(8, {})
t8svg = t8.get('svg', '')
check(bool(t8svg), 'picture-only slide produces a traced figure')
check('traced' in t8.get('alt', ''), 'trace: alt says the figure is traced and approximate')
check('class="ln route"' in t8svg, 'trace: the route line was vectorised')
tticks = re.findall(r'<line class="ln tick', t8svg)
check(len(tticks) >= 4, f'trace: tick stubs vectorised ({len(tticks)})')
check('s-warm' in t8svg, 'trace: the amber extent maps to the warm palette slot')

# ---- 7: well-formed, and the viewBox holds the content -------------------
for n, f in allfigs:
    try:
        root = ET.fromstring(f['svg'])
        ok = root.tag.endswith('svg')
    except ET.ParseError as e:
        ok = False
    check(ok, f'slide {n}: figure parses as XML')
    vb = re.search(r'viewBox="([\d.\- ]+)"', f['svg'])
    check(bool(vb), f'slide {n}: has a viewBox')
    if vb:
        x0, y0, w, h = [float(v) for v in vb.group(1).split()]
        # coordinates inside the shift group live in slide space; apply the
        # translate so containment is checked in viewBox space (the ±60 slack
        # covers text extents, which anchor inside the box but render wider)
        xpat, ypat = r' (?:c?x|x[12])="(-?[\d.]+)"', r' (?:c?y|y[12])="(-?[\d.]+)"'
        tr = re.search(r'<g transform="translate\((-?[\d.]+),(-?[\d.]+)\)"', f['svg'])
        gpos = f['svg'].find('<g transform="translate(')
        pre = f['svg'] if gpos < 0 else f['svg'][:gpos]
        post = '' if gpos < 0 else f['svg'][gpos:]
        dx = float(tr.group(1)) if tr else 0.0
        dy = float(tr.group(2)) if tr else 0.0
        xs = [float(v) for v in re.findall(xpat, pre)] + \
             [float(v) + dx for v in re.findall(xpat, post)]
        ys = [float(v) for v in re.findall(ypat, pre)] + \
             [float(v) + dy for v in re.findall(ypat, post)]
        inside = (not xs or (min(xs) >= x0 - 60 and max(xs) <= x0 + w + 60)) and \
                 (not ys or (min(ys) >= y0 - 60 and max(ys) <= y0 + h + 60))
        check(inside and w > 0 and h > 0,
              f'slide {n}: drawn content sits inside the viewBox ({w:.0f}x{h:.0f})')

# ---- 5: accessibility ----------------------------------------------------
for n, f in allfigs:
    check('<title>' in f['svg'] and '<desc>' in f['svg'],
          f'slide {n}: carries <title> and <desc>')
    check(bool(f['alt']) and len(f['alt']) > 20, f'slide {n}: alt text is descriptive')

# ---- 6: nothing rasterised ----------------------------------------------
for n, f in allfigs:
    check('data:image' not in f['svg'] and '<image' not in f['svg'],
          f'slide {n}: no raster embedded')
    check(len(f['svg']) < 60 * 1024, f'slide {n}: figure under 60 KB ({len(f["svg"])}B)')

# ---- 3: component standardisation on the vector figure -------------------
v = figs.get(1, {}).get('svg', '')
ticks = re.findall(r'<line class="ln tick[^"]*" x1="([\d.]+)" y1="([\d.]+)" '
                   r'x2="([\d.]+)" y2="([\d.]+)"', v)
check(len(ticks) >= 5, f'vector figure: ruler ticks present ({len(ticks)})')
if ticks:
    lens = sorted({round(abs(float(t[3]) - float(t[1])), 1) for t in ticks})
    check(len(lens) <= 2, f'vector figure: tick lengths uniform (minor/major only) {lens}')
    mids = {round((float(t[1]) + float(t[3])) / 2, 1) for t in ticks}
    check(len(mids) == 1, f'vector figure: every tick centred on the line {sorted(mids)}')
measures = re.findall(r'<text class="measure[^"]*" x="([\d.]+)" y="([\d.]+)"', v)
check(len(measures) >= 3, f'vector figure: measure labels present ({len(measures)})')
if measures:
    check(len({m[1] for m in measures}) == 1,
          'vector figure: measures share one baseline')
    if ticks:
        txs = sorted(round(float(t[0]), 1) for t in ticks)
        check(all(min(abs(float(m[0]) - x) for x in txs) < 0.6 for m in measures),
              'vector figure: every measure centred on a tick')
check('class="ln event flat' in v, 'vector figure: extents use butt caps (flat)')
check('class="split"' in v and 'class="splitdot"' in v,
      'vector figure: split marker drawn where two extents meet')
ev = re.findall(r'<line class="ln event flat[^"]*" x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)"', v)
if len(ev) >= 2:
    pts = sorted((float(a), float(b)) for a, b in ev)
    check(abs(pts[0][1] - pts[1][0]) < 0.05,
          f'vector figure: adjoining extents share ONE exact boundary {pts}')

# ---- 4: palette only, no source colour leaking through -------------------
for n, f in allfigs:
    # the palette lives in the stylesheet and the arrow marker in <defs>;
    # a literal colour anywhere ELSE means a source colour got copied through
    body = f['svg'][f['svg'].index('</style>'):]
    body = re.sub(r'<defs>[\s\S]*?</defs>', '', body)
    leaked_body = re.findall(r'(?:stroke|fill)="#[0-9A-Fa-f]{6}"', body)
    check(not leaked_body,
          f'slide {n}: no source colour on an element ({leaked_body[:3]})')
    check('s-cool' in f['svg'] or 's-warm' in f['svg'] or 'class="ln route"' in f['svg']
          or 'class="node' in f['svg'],
          f'slide {n}: uses palette role classes')

# ---- redraw path: driven by the slide's own numbers ----------------------
r2 = figs.get(2, {})
check('loop' in r2.get('alt', '').lower(), 'redraw: topology read from the slide title')
check('0' in r2.get('alt', '') and '40' in r2.get('alt', ''),
      'redraw: measures read from a key/value table')
check('20' in r2.get('alt', ''), 'redraw: split measure read from the title')
r3 = figs.get(3, {})
check('2' in r3.get('alt', '') and '12' in r3.get('alt', ''),
      'redraw: measures read from a header-row table')
check('schematic' in r2.get('alt', '').lower(),
      'redraw: alt text says the figure is a schematic, not a tracing')

# ---- v1.3 (DF-4): one figure per diagram in the redraw lane too ----------
f2 = by_slide.get(2, [])
check(len(f2) == 2, f'redraw slide -> TWO figures, input and output ({len(f2)})')
check([f['name'] for f in f2] == ['slide2_fig1.svg', 'slide2_fig2.svg'],
      f'redraw figures use the sibling naming ({[f["name"] for f in f2]})')
if len(f2) == 2:
    fin, fout = f2[0], f2[1]
    check('before the split' in fin['alt'] and 'after the split' in fout['alt'],
          'redraw: alts say which state each figure shows')
    fin_body = fin['svg'][fin['svg'].index('</style>'):]
    fout_body = fout['svg'][fout['svg'].index('</style>'):]
    check('s-warm' not in fin_body and 'swatch' not in fin_body
          and 'splitdot' not in fin_body,
          'redraw input figure: one extent, no split marker, no legend')
    check('splitdot' in fout_body and 's-cool' in fout_body and 's-warm' in fout_body,
          'redraw output figure: split marker and both extent colours')
    check('(1 of 2)' in fin['svg'] and '(2 of 2)' in fout['svg'],
          'redraw figure titles say which of how many')

# ---- v1.3 (DF-4): table anchors ------------------------------------------
check(figs.get(1, {}).get('anchor') == [],
      'anchor: a slide with no table anchors nothing')
if len(f2) == 2:
    check(f2[0].get('anchor') == ['Event ID', 'E7'],
          f'anchor: redraw input figure -> the key/value table it read '
          f'({f2[0].get("anchor")})')
    check(f2[1].get('anchor') == ['Event ID', 'E7', 'E7', 'E7'],
          f'anchor: redraw output figure -> the result table ({f2[1].get("anchor")})')
f3 = by_slide.get(3, [])
check(len(f3) == 2 and
      f3[0].get('anchor') == ['Route ID', 'Event ID', 'From Measure', 'To Measure'],
      'anchor: header-row input table anchors the input figure')
check(len(f3) == 2 and f3[1].get('anchor') == [],
      'anchor: no second table -> the output figure stays unanchored')
if len(f5) == 2:
    check(f5[0].get('anchor') == ['Route ID', 'R5A'],
          f'anchor: first ruler -> the table under IT ({f5[0].get("anchor")})')
    check(f5[1].get('anchor') == ['Route ID', 'R5B'],
          f'anchor: second ruler -> its own table, not the first '
          f'({f5[1].get("anchor")})')

# ---- v1.4 (DF-5): label collisions, arrowheads, degenerate splits ---------
f9 = by_slide.get(9, [])
check(len(f9) == 2, f'degenerate-split slide -> two figures ({len(f9)})')
if len(f9) == 2:
    b9out = f9[1]['svg'][f9[1]['svg'].index('</style>'):]
    check('swatch' not in b9out and 's-warm' not in b9out and 'splitdot' not in b9out,
          'degenerate split: no zero-length extent, no split marker, no legend')
    check(b9out.count('>E8<') == 1,
          f'degenerate split: exactly one event label ({b9out.count(">E8<")})')
    check('after the split' in f9[1]['alt'] and 'unchanged' in f9[1]['alt'],
          'degenerate split: alt says the event is unchanged')
    rt9 = re.search(r'<path class="ln route" d="M [\d.]+ ([\d.]+)', f9[0]['svg'])
    rid9 = re.search(r'<text class="id f-ink" x="[\d.]+" y="([\d.]+)"', f9[0]['svg'])
    check(rt9 is not None and rid9 is not None and
          abs(float(rt9.group(1)) - float(rid9.group(1))) < 0.5,
          'branch: route id sits level with the route line, not at mid-height')
r3out = (by_slide.get(3, []) + [{}, {}])[1].get('svg', '')
rt3 = re.search(r'<path class="ln route" d="M [\d.]+ ([\d.]+)', r3out)
m3y = [float(y) for y in re.findall(r'<text class="measure" x="[\d.]+" y="([\d.]+)"', r3out)]
e3y = [float(y) for y in re.findall(r'<text class="id f-(?:cool|warm)" x="[\d.]+" y="([\d.]+)"',
                                    r3out)]
check(rt3 is not None and bool(m3y) and bool(e3y) and
      max(m3y) < float(rt3.group(1)) < min(e3y),
      'redraw: measures above the route, event ids below — never the same side')
vr = re.search(r'<line class="ln route[^"]*" x1="[\d.]+" y1="[\d.]+" x2="([\d.]+)"', v1)
vtx = [float(x) for x in re.findall(r'<line class="ln tick[^"]*" x1="([\d.]+)"', v1)]
check(vr is not None and bool(vtx) and float(vr.group(1)) >= max(vtx) + 10,
      'vector ruler: route overshoots the final tick, arrowhead clear of it')
check(v1.rfind('marker-end') > v1.rfind('class="ln event'),
      'vector ruler: arrowhead draws after the extents, never underneath')
mk = re.search(r'<marker id="ar"[^>]*><path d="([^"]+)"', v1)
check(mk is not None and mk.group(1).count('L') == 2,
      'arrowhead is a solid triangle — no notch for the line to show through')
rt3x = re.search(r'<path class="ln route" d="M ([\d.]+) [\d.]+[^"]* L ([\d.]+) [\d.]+"', r3out)
t3x = [float(x) for x in re.findall(r'<line class="ln tick[^"]*" x1="([\d.]+)"', r3out)]
check(rt3x is not None and bool(t3x) and float(rt3x.group(2)) >= max(t3x) + 10,
      'redraw ruler: route overshoots the final tick, arrowhead clear of it')
g10 = figs.get(10, {}).get('svg', '')
check(bool(g10) and 'class="ln route"' in g10,
      'title-box slide: the ruler beneath the box still renders')
check('Merge Option' not in g10 and 'class="node' not in g10,
      'title-box slide: the outlined case-text box is not drawn as a node')
check('marker-end' in g10, 'title-box slide: the ruler keeps its direction arrow')
check('marker-end' not in t8svg,
      'trace: no mid-band arrow where the extent runs past the route run')

# ---- v1.6 (DF-7): spanning events redraw as route chains ------------------
f11 = by_slide.get(11, [])
check(len(f11) == 2, f'spanning-event slide -> two figures ({len(f11)})')
if len(f11) == 2:
    sin, sout = f11[0]['svg'], f11[1]['svg']
    check('>R1L6<' in sin and '>R2L6<' in sin and '>R3L6<' in sin,
          'spanning: every route in the chain is drawn and labelled')
    check(sin.count('marker-end') == 3,
          f'spanning: each route ends in its own arrowhead '
          f'({sin.count("marker-end")})')
    check('>10<' in sin and '>25<' in sin and '10.0' not in sin
          and sin.count('<text class="measure"') == 2,
          'spanning: only the stated measure anchors — no invented tick grid')
    bin_, bout = sin[sin.index('</style>'):], sout[sout.index('</style>'):]
    check('splitdot' not in bin_ and 's-warm' not in bin_,
          'spanning input figure: no split marker, one extent colour')
    check('splitdot' in bout and '>52.5<' in bout
          and 's-cool' in bout and 's-warm' in bout,
          'spanning output: split at 52.5 with both extent colours')
    dot11 = re.search(r'<circle class="splitdot" cx="([\d.]+)"', sout)
    rid2 = re.search(r'<text class="id f-ink" x="([\d.]+)"[^>]*>R2L6<', sout)
    check(dot11 is not None and rid2 is not None and
          abs(float(dot11.group(1)) - float(rid2.group(1))) < 1.0,
          'spanning: the split sits on the route the result table names (R2L6)')
    check('E6 R1L6 10 → R2L6 52.5' in sout and 'E6 R2L6 52.5 → R3L6 25' in sout,
          'spanning legend: each range qualified with its routes')
    check('spanning routes R1L6 → R2L6 → R3L6' in f11[0]['alt']
          and 'after the split at measure 52.5 on R2L6' in f11[1]['alt'],
          'spanning alts state the chain and the split route')
    check(f11[0].get('anchor') == ['Event ID', 'E6']
          and f11[1].get('anchor') == ['Event ID', 'E6', 'E6', 'E6'],
          f'spanning anchors: input -> key/value table, output -> result table '
          f'({f11[0].get("anchor")} / {f11[1].get("anchor")})')

# ---- v1.7 (DF-8): route on top as a dash, smaller heads, hashed anchors ---
mroute = re.search(r'\.route\{([^}]*)\}', v1)
check(mroute is not None and 'stroke-dasharray' in mroute.group(1),
      'route restyled as a dash (stroke-dasharray in .route)')
check('markerWidth="4.4"' in v1 and 'markerWidth="5.2"' not in v1,
      'arrowheads smaller (4.4 marker units, was 5.2)')
b_v = v1[v1.index('</style>'):]
check(b_v.find('class="ln route') > b_v.rfind('class="ln event'),
      'vector lane: the route draws AFTER the extents — on top, never buried')
b_r3 = r3out[r3out.index('</style>'):]
check(b_r3.find('class="ln route"') > b_r3.rfind('class="ln event'),
      'redraw lane: route on top of the extents')
check(re.search(r'<path class="ln route" d="[^"]*" marker-end', r3out) is None
      and re.search(r'<line class="ln route" [^>]*marker-end="url\(#ar\)"', r3out)
      is not None,
      'redraw lane: arrowhead rides a solid carrier, never the dashed path')
if len(f11) == 2:
    b_s = f11[0]['svg'][f11[0]['svg'].index('</style>'):]
    check(b_s.find('class="ln route"') > b_s.rfind('class="ln event'),
          'spanning lane: route on top of the extent')
    n_hash = b_s.count('class="ln tick maj"')
    check(n_hash == 2, f'spanning: a hash mark at each stated anchor ({n_hash})')
    b_so = f11[1]['svg'][f11[1]['svg'].index('</style>'):]
    dot_x = re.search(r'<circle class="splitdot" cx="([\d.]+)"', b_so)
    t_so = re.findall(r'<line class="ln tick maj" x1="([\d.]+)"', b_so)
    check(len(t_so) == 2 and dot_x is not None and
          all(abs(float(tx) - float(dot_x.group(1))) > 2 for tx in t_so),
          'spanning output: the split anchor keeps its marker, no doubled tick')
f12 = figs.get(12, {})
s12 = f12.get('svg', '')
check(bool(s12), 'labels-without-ticks slide produces a figure')
t12 = re.findall(r'<line class="ln tick maj" x1="([\d.]+)"', s12)
m12 = re.findall(r'<text class="measure[^"]*" x="([\d.]+)"', s12)
check(len(t12) == 2,
      f'hash marks synthesized at the labelled anchors ({len(t12)})')
check(len(m12) == 2 and bool(t12) and
      all(min(abs(float(mx) - float(tx)) for tx in t12) < 1 for mx in m12),
      'each hash sits under its own label (dragged end label re-centred on it)')
rt12 = re.search(r'<line class="ln route[^"]*" x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)"',
                 s12)
check(rt12 is not None and bool(t12) and
      max(float(t) for t in t12) <= max(float(rt12.group(1)),
                                        float(rt12.group(2))) + 0.1,
      'a clamped hash mark stays ON the route')

# ---- v1.8 (DF-9): white casing under the dash, two-tone palette -----------
check('.routecase{stroke:#FFFFFF' in v1,
      'route casing class: white, defined in the stylesheet')
for lane, svg_l in (('vector', b_v), ('redraw', b_r3),
                    ('spanning', f11[0]['svg'] if len(f11) == 2 else '')):
    n_case = svg_l.count('class="ln routecase"')
    n_route = len(re.findall(r'class="ln route[" ]', svg_l))
    check(n_case > 0 and n_case == n_route,
          f'{lane} lane: every route element rides its own casing '
          f'({n_case}/{n_route})')
check(b_v.find('class="ln routecase"') > b_v.rfind('class="ln event'),
      'casing draws with the route — above the extents, not under them')
check(re.search(r'\.event\.s-cool,\.swatch\.s-cool\{stroke:#3A97C4\}', v1) is not None
      and '.s-cool{stroke:#1B6E8C}' in v1,
      'two-tone: bars take the bright variant, thin marks keep the deep one')
check('.f-warm{fill:#9C5A12}' in v1,
      'warm text ink deepened to clear 4.5:1 on the plate')
mk9 = re.search(r'<marker id="ar"[^>]*>(<path[^>]*>)', v1)
check(mk9 is not None and 'stroke="#FFFFFF"' in mk9.group(1)
      and 'overflow="visible"' in v1[:v1.index('<marker id="ae"')],
      'arrowheads outlined in white (and unclipped) for the same separation')

# ---- style invariants: one geometry across every lane ---------------------
rads = set()
for n, f in allfigs:
    rads |= set(re.findall(r'<circle class="splitdot"[^/]*r="([\d.]+)"', f['svg']))
check(len(rads) == 1, f'split dots share ONE radius across lanes {sorted(rads)}')


def _idoff(svg, idtxt, line_re):
    t = re.search(r'<text class="id[^"]*" x="[\d.]+" y="([\d.]+)"[^>]*>' + idtxt + '<', svg)
    r = re.search(line_re, svg)
    if not t or not r:
        return None
    return round(abs(float(t.group(1)) - float(r.group(1))), 1)


off_v = _idoff(v1, 'E9', r'<line class="ln event flat[^"]*" x1="[\d.]+" y1="([\d.]+)"')
off_r = _idoff(r3out, 'E3', r'<path class="ln route" d="M [\d.]+ ([\d.]+)')
off_s = _idoff(f11[0]['svg'] if len(f11) == 2 else '', 'R1L6',
               r'<line class="ln route" x1="[\d.]+" y1="([\d.]+)"')
check(off_v is not None and off_v == off_r == off_s,
      f'entity ids sit at ONE shared offset off the line in every lane '
      f'({off_v}/{off_r}/{off_s})')

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed')
    sys.exit(1)
print(f'RESULT: PASS — {res["count"]} figures')
