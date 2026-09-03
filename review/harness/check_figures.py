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
        xs = [float(v) for v in re.findall(r'[xc][12]?="(-?[\d.]+)"', f['svg'])]
        ys = [float(v) for v in re.findall(r'[yc][12]?="(-?[\d.]+)"', f['svg'])]
        inside = (not xs or (min(xs) >= x0 - 60 and max(xs) <= x0 + w + 60))
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

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed')
    sys.exit(1)
print(f'RESULT: PASS — {res["count"]} figures')
