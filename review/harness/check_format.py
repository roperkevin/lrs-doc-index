"""Formatting assertions for the current scripts/ generation.

Runners are (re)generated as version-neutral *_cur.ts files from
whatever HARNESS_SCRIPTS points at (default ../../scripts), so these
labels never go stale when a batch is promoted. Unlike run_diff.py
(the historical byte-equivalence gate, which stays as-is), this
validates the *intentional* format contract:

  1. pptx slide headings: "## Slide N — Title", strictly increasing,
     planted titles promoted and NOT duplicated as the first body line
  2. notes interleaved as "### Notes" under their slide; zero "## Notes"
     H2 blocks remain; per-fixture notes counts match
  3. planted outline levels render as nested "- " list items
  4. docx headings shifted one level (Heading N -> N+1 hashes); no H1
     anywhere in any body output
  5. every GFM table block well-formed (separator row, consistent
     column count); WorkbookDump COLCAP/CELLCAP/pipe-escape behavior
  6. token recall vs planted_tokens.json >= 0.97 per fixture
  7. slugify unit cases via RegexExtract (ids/docRevision live in
     check_regex.py)
  8. core properties: planted author /
     lastEditedBy / lastEdited come back from docProps/core.xml with
     entities decoded; a fixture without core.xml degrades to empty
     strings, not an error
  9. the v1.9 batch behaviors (folded from check_batch.py on the
     2026-08-11 promotion): presentation-order slides, hMerge cells
     skipped, cap-aware image links (link set ⊆ MediaExtract's saved
     set), attr-order-proof rels, link-safe digit strip, astral
     entities, content-H1 escaping, date-validated core properties,
     and the encrypted / truncated-stored-block throw paths
 10. the r2 batch behaviors (SB-4..SB-8), 11. the r6 code-fencing
     contract (CF-1), and 12. the v2.2 diagram-label collapse (DL-1:
     a clustered set of floating label shapes renders as one
     "[figure: ...]" line — tick runs compressed, dedupe, prose and
     tables untouched, sub-threshold slides inline)

Prereqs: make_fixtures.py has run in this directory. The wrapped Node
runners are (re)generated here on every run.

Exit code: non-zero on any failed assertion.
"""
import json
import os
import re
import subprocess
import sys

RECALL_BAR = 0.97
# check_batch.py points this at a staged patch set to gate a script
# batch with the full suite before pasting; default is the shipped set.
SCRIPTS = os.environ.get('HARNESS_SCRIPTS', '../../scripts')

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


def run_node(script, *args):
    out = subprocess.run(['node', '--experimental-strip-types', script, *args],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f"{script} failed:\n{out.stderr[:2000]}")
    return json.loads(out.stdout)


def toks(s):
    return [t for t in re.split(r'\s+', s.lower()) if t]


# ---- regenerate wrapped runners -----------------------------------------
subprocess.run([sys.executable, 'wrap.py', f'{SCRIPTS}/ZipTextExtract.ts', 'zte_cur.ts'], check=True)
subprocess.run([sys.executable, 'wrap_workbook.py', f'{SCRIPTS}/WorkbookDump.ts', 'wbd_cur.ts'], check=True)

rex_src = open(f'{SCRIPTS}/RegexExtract.ts', encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
rex_src += '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const cases: { file: string, title: string }[] = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(cases.map((c) =>
  main(null as unknown, c.file, '', 'ArcGISPro/ps-location-referencing', c.title).slug)));
'''
open('rex_cur.ts', 'w', encoding='utf-8').write(rex_src)

planted = json.load(open('planted_tokens.json', encoding='utf-8'))
fmt = json.load(open('planted_format.json', encoding='utf-8'))

# ---- 1-4, 6: ZipTextExtract over the OOXML fixtures ----------------
SLIDE_RE = re.compile(r'^## Slide (\d+)( — (.+))?$')

for fixture in ('real_deck.pptx', 'real_doc.docx', 'edge_deck.pptx'):
    out = run_node('zte_cur.ts', fixture + '.b64', 'media/docX_')['out']
    text = out['text']
    lines = text.split('\n')
    f = fmt[fixture]
    tag = fixture.split('.')[0]

    # ---- 8: core properties (v1.8) --------------------------------------
    if 'core' in f:
        for field, want in f['core'].items():
            check(out.get(field) == want,
                  f"{tag}: core {field} == {want!r} (got {out.get(field)!r})")

    check(not any(re.match(r'^# ', ln) for ln in lines), f'{tag}: no H1 in body output')

    if fixture.endswith('.pptx'):
        heads = [(i, SLIDE_RE.match(ln)) for i, ln in enumerate(lines) if SLIDE_RE.match(ln)]
        nums = [int(m.group(1)) for _, m in heads]
        check(nums == sorted(nums) and len(nums) == len(set(nums)),
              f'{tag}: slide numbers strictly increasing ({nums[:5]}...)')
        promoted = [m.group(3) for _, m in heads if m.group(3)]
        check(len(promoted) == len(f['titles']),
              f"{tag}: {len(f['titles'])} planted titles all promoted into headings")
        for want in f['titles']:
            check(want in promoted, f'{tag}: heading has title "{want[:40]}..."')
        # dedup: the promoted title must not also open the slide body
        dup = False
        for i, m in heads:
            if m.group(3):
                nxt = next((ln for ln in lines[i + 1:] if ln.strip()), '')
                if nxt.strip() == m.group(3):
                    dup = True
        check(not dup, f'{tag}: no title duplicated as first body line')

        note_blocks = [i for i, ln in enumerate(lines) if ln == '### Notes']
        check(len(note_blocks) == f['notes_count'],
              f"{tag}: {f['notes_count']} interleaved ### Notes blocks (got {len(note_blocks)})")
        check(not any(ln.startswith('## Notes') for ln in lines),
              f'{tag}: zero ## Notes H2 blocks remain')
        # every ### Notes belongs to the slide heading immediately before
        # it: a slide heading precedes it, with no other notes block in
        # between (i.e. at most one notes block per slide segment —
        # notes clumped after the last slide would fail this)
        owned = True
        for i in note_blocks:
            prev_heads = [j for j, _ in heads if j < i]
            if not prev_heads or any(prev_heads[-1] < k < i
                                     for k in note_blocks if k != i):
                owned = False
        check(owned, f'{tag}: every ### Notes sits under its own slide heading')

        for want in f['lvl1']:
            check(any(ln.rstrip() == '  - ' + want for ln in lines),
                  f'{tag}: lvl1 "- " item "{want[:30]}..."')
        for want in f['lvl2']:
            check(any(ln.rstrip() == '    - ' + want for ln in lines),
                  f'{tag}: lvl2 nested item "{want[:30]}..."')
    else:
        check(any(ln.rstrip() == '## ' + f['title'] for ln in lines),
              f'{tag}: Title style renders as "## " heading')
        for lvl, wants in f['headings'].items():
            hashes = '#' * (int(lvl) + 1)
            for want in wants:
                check(any(ln.rstrip() == f'{hashes} {want}' for ln in lines),
                      f'{tag}: Heading{lvl} -> "{hashes} " ("{want[:30]}...")')
        for ilvl, wants in f['lists'].items():
            prefix = '  ' * int(ilvl) + '- '
            for want in wants:
                check(any(ln.rstrip() == prefix + want for ln in lines),
                      f'{tag}: numPr ilvl={ilvl} -> "{prefix}" item')

    check(not any(re.match(r'^[ \t]*-[ \t]*$', ln) for ln in lines),
          f'{tag}: no orphan empty "- " lines')

    # GFM table well-formedness (split on unescaped pipes only)
    def cells(row):
        return re.split(r'(?<!\\)\|', row)[1:-1]

    tables = 0
    i = 0
    while i < len(lines):
        if lines[i].startswith('| '):
            block = []
            while i < len(lines) and lines[i].startswith('| '):
                block.append(lines[i])
                i += 1
            tables += 1
            width = len(cells(block[0]))
            sep_ok = len(block) > 1 and all(c.strip() == '---' for c in cells(block[1]))
            width_ok = all(len(cells(r)) == width for r in block)
            check(sep_ok and width_ok,
                  f'{tag}: table {tables} well-formed ({width} cols, {len(block)} rows)')
        else:
            i += 1
    if fixture != 'edge_deck.pptx':
        check(tables > 0, f'{tag}: at least one GFM table found ({tables})')

    want = [w.lower() for w in planted[fixture]]
    got = set(toks(text))
    hit = sum(1 for w in want if w in got or any(w in g for g in got))
    recall = hit / len(want) if want else 1.0
    check(recall >= RECALL_BAR, f'{tag}: token recall {recall:.4f} >= {RECALL_BAR}')

# ---- 8b: no core.xml -> empty strings, no error -------------------------
noprops = run_node('zte_cur.ts', 'noprops_deck.pptx.b64', 'media/docX_')['out']
check(noprops['author'] == '' and noprops['lastEditedBy'] == '' and noprops['lastEdited'] == '',
      'noprops_deck: missing docProps/core.xml degrades to empty strings')

# ---- 5: WorkbookDump over sheets.json ------------------------------
wb = run_node('wbd_cur.ts', 'sheets.json')['out']
wlines = wb.split('\n')
check('## Sheet: Schedule' in wlines and '## Sheet: Notes' in wlines and '## Sheet: Blank' in wlines,
      'workbook: all sheet headings present')
check(wlines[wlines.index('## Sheet: Blank') + 1] == '(empty)', 'workbook: empty sheet marker')

sched = [ln for ln in wlines if ln.startswith('| ')][:3]


def wcells(row):
    return re.split(r'(?<!\\)\|', row)[1:-1]


check(all(len(wcells(r)) == 25 for r in sched),
      'workbook: 30-col sheet capped to 24 + overflow column')
check(any('…(+6 more)' in r for r in sched), 'workbook: overflow marker "…(+6 more)"')
check(all(c.strip() == '---' for c in wcells(sched[1])), 'workbook: separator after header row')
check('pipes \\| in \\| cells' in wb, 'workbook: pipes escaped inside cells')
check(('x' * 300 + '…') in wb and ('x' * 301) not in wb, 'workbook: CELLCAP truncation with …')

# ---- 7: slugify unit cases ----------------------------------------------
cases = [
    {'file': 'Whatever.pptx', 'title': 'Conflict Prevention — Acquire Locks for New Routes'},
    {'file': 'Whatever.pptx', 'title': "Don't / Can't & Won't #5"},
    {'file': 'Whatever.pptx', 'title': 'word ' * 40},
    {'file': 'My Fallback File.docx', 'title': '中文标题'},
    {'file': '中文.docx', 'title': ''},
]
json.dump(cases, open('slug_cases.json', 'w', encoding='utf-8'))
slugs = run_node('rex_cur.ts', 'slug_cases.json')
check(slugs[0] == 'conflict-prevention-acquire-locks-for-new-routes', f'slug: em-dash title -> {slugs[0]}')
check(slugs[1] == 'dont-cant-wont-5', f'slug: apostrophes/symbols -> {slugs[1]}')
check(len(slugs[2]) <= 80 and not slugs[2].endswith('-') and slugs[2].startswith('word-word'),
      f'slug: long title capped at word boundary ({len(slugs[2])} chars)')
check(slugs[3] == 'my-fallback-file', f'slug: non-Latin title falls back to filename -> {slugs[3]}')
check(slugs[4] == 'doc', f'slug: nothing slugifiable -> literal "doc" ({slugs[4]})')

# ---- 9: v1.9 batch behaviors (ZipTextExtract v1.9 / MediaExtract v1.2) --
import base64
import zipfile

subprocess.run([sys.executable, 'wrap.py', f'{SCRIPTS}/MediaExtract.ts', 'me_cur.ts'], check=True)


def run_node_fail(script, *args):
    return subprocess.run(['node', '--experimental-strip-types', script, *args],
                          capture_output=True, text=True, encoding='utf-8')


# SC-2: presentation-order slides
text = run_node('zte_cur.ts', 'reordered_deck.pptx.b64', '')['out']['text']
heads = [ln for ln in text.split('\n') if ln.startswith('## Slide ')]
check(len(heads) == 4 and heads[0] == '## Slide 1 — OrderTitle3',
      'reversed sldIdLst: first section is "## Slide 1 — OrderTitle3"')
order = [text.find(f'OrderTitle{i}') for i in (3, 2, 1, 0)]
check(all(a >= 0 for a in order) and order == sorted(order),
      'sections appear in presentation order')

# SC-3: hMerge continuation cells skipped
text = run_node('zte_cur.ts', 'merged_deck.pptx.b64', '')['out']['text']
mrows = [ln for ln in text.split('\n') if ln.startswith('| ')]
check(len(mrows) >= 4 and all(len(cells(r)) == 3 for r in mrows),
      'hMerge table keeps width 3 on every row')

# SC-4: link set ⊆ saved set
with zipfile.ZipFile('bigimg_deck.pptx') as z:
    sizes = {n.split('/')[-1]: z.getinfo(n).file_size for n in z.namelist() if '/media/' in n}
small = [n for n, sz in sizes.items() if sz <= 350 * 1024][0]
big = [n for n, sz in sizes.items() if sz > 350 * 1024][0]
zout = run_node('zte_cur.ts', 'bigimg_deck.pptx.b64', 'media/docX_')['out']
mout = run_node('me_cur.ts', 'bigimg_deck.pptx.b64')['out']
check(f'](media/docX_{small})' in zout['text'] and big not in zout['text'] and zout['media'] == small,
      'only the under-cap image is linked / listed')
check(mout['count'] == 1 and mout['images'][0]['name'] == small and big in mout['skipped'],
      'MediaExtract saves the same set; over-cap lands in skipped')

# SC-6 / SC-7: rels attr order + link-safe digit strip
zr = run_node('zte_cur.ts', 'relswap_deck.pptx.b64', 'media/docX_')['out']
check('](media/docX_image1.png)' in zr['text'], 'Target-before-Id rels still resolve')
zr = run_node('zte_cur.ts', 'relswap_deck.pptx.b64', 'media/doc12345678901_')['out']
check('](media/doc12345678901_image1.png)' in zr['text'],
      '10+ digit prefix survives inside the generated link')

# SC-5 / SC-10 / SC-7 / FL-5: edgecase deck
ze = run_node('zte_cur.ts', 'edgecase2_deck.pptx.b64', '')['out']
check('😀' in ze['text'], 'astral entity decodes to the emoji')
check('\\# Roadmap pasted markdown' in ze['text'] and
      not any(re.match(r'^# ', ln) for ln in ze['text'].split('\n')),
      'content H1 escaped; no H1 in body output')
check('12345678901234' not in ze['text'], 'long digit run stripped from plain content')
check(ze['lastEdited'] == '', 'malformed dcterms:modified degrades to ""')

# SC-14 / SC-8 / SC-11: throw paths
r = run_node_fail('zte_cur.ts', 'encrypted_deck.pptx.b64', '')
check(r.returncode != 0 and 'encrypted' in r.stderr, 'ZTE throws on encrypted entries')
r = run_node_fail('me_cur.ts', 'encrypted_img_deck.pptx.b64')
check(r.returncode != 0 and 'MediaExtract:' in r.stderr and 'ZipTextExtract' not in r.stderr,
      'MediaExtract throws on encrypted entries under its own name')
r = run_node_fail('zte_cur.ts', 'truncstored.docx.b64', '')
check(r.returncode != 0 and 'stored block out of input' in r.stderr,
      'truncated stored block throws instead of zero-padding')

# ---- 10: the r2 batch behaviors (folded from check_batch_r2.py on the
# 2026-08-11 promotion; SB-4..SB-8 — SB-1..SB-3 live in check_regex.py
# and the SidecarPatch cases in check_related.py) ---------------------------

# SB-6: content ##..###### escaped; generated headings survive
text = run_node('zte_cur.ts', 'hashheading_deck.pptx.b64', '')['out']['text']
hlines = text.split('\n')
check('\\## Fake section pasted' in text and '\\### Fake notes pasted' in text
      and '\\#### deep heading pasted' in text and '\\# Roadmap pasted markdown' in text,
      'content #/##/###/#### lines all escaped')
check('\\## Fake heading inside notes' in text, 'notes content escaped too')
check([ln for ln in hlines if ln.startswith('## ')] == ['## Slide 1 — HashTitle']
      and sum(1 for ln in hlines if ln == '### Notes') == 1,
      'generated slide + notes headings survive the escape')

# SB-7: explicit truncation marker past the 200-table guard
text = run_node('zte_cur.ts', 'manytables.docx.b64', '')['out']['text']
check('(tables truncated at 200' in text and '| tbl0cell |' in text
      and 'after the tables' in text,
      '201+ tables: marker emitted, in-guard tables + trailing content intact')

# SB-5: stored-block NLEN verified in both zip readers
r = run_node_fail('zte_cur.ts', 'storednlen.docx.b64', '')
check(r.returncode != 0 and 'NLEN mismatch' in r.stderr, 'ZTE throws on a wrong NLEN')
r = run_node_fail('me_cur.ts', 'storednlen_img.pptx.b64')
check(r.returncode != 0 and 'NLEN mismatch' in r.stderr,
      'MediaExtract throws on a wrong NLEN (media entry)')

# SB-8: central-directory size claims verified against inflated bytes
r = run_node_fail('me_cur.ts', 'lyingcd_deck.pptx.b64')
check(r.returncode != 0 and 'size mismatch' in r.stderr,
      'MediaExtract throws on a lying central directory')

# SB-4: formatted-but-empty sheet renders (empty), not malformed rows
json.dump({'Styled Empty': [['', ''], ['', '']], 'Real': [['a', 'b'], ['1', '2']]},
          open('sheets_empty.json', 'w', encoding='utf-8'))
wb2 = run_node('wbd_cur.ts', 'sheets_empty.json')['out']
wlines2 = wb2.split('\n')
check(wlines2[wlines2.index('## Sheet: Styled Empty') + 1] == '(empty)'
      and '| a | b |' in wb2 and '|  |' not in wb2,
      'formatted-but-empty sheet renders "(empty)"')

# ---- 11: the r6 batch behaviors (ZipTextExtract v2.1 — CF-1 code
# fencing; folded from check_batch_r6.py on promotion) ---------------------
ct = run_node('zte_cur.ts', 'code_deck.pptx.b64', '')['out']['text']
clines = ct.split('\n')
fence_at = [i for i, ln in enumerate(clines) if ln.startswith('```')]
check(len(fence_at) == 2 and clines[fence_at[0]] == '```arcade',
      f'code_deck: exactly one fence pair, tagged arcade ({len(fence_at)} markers)')
if len(fence_at) == 2:
    inside = clines[fence_at[0] + 1:fence_at[1]]
    check('var station = $feature.MEASURE' in inside and
          'if (station < 0) {' in inside and '}' in inside and
          'return Stationlb' in inside,
          'code_deck: the whole script run lands inside the fence')
    check('' in inside, 'code_deck: internal blank line preserved inside the fence')
    check('# stationing format note' in inside and
          '\\# stationing format note' not in ct,
          'code_deck: sandwiched # line joins the fence with its escape reverted')
    before = '\n'.join(clines[:fence_at[0]])
    check('Input expression for the stationing calculation below:' in before,
          'code_deck: leading prose line stays outside the fence')
check(len(fence_at) == 2 and
      'Test with UNAPR data and Pipeline Referencing centerlines today' in
      '\n'.join(clines[fence_at[1] + 1:]),
      'code_deck: trailing prose line stays outside, after the closing fence')
check(any(ln.rstrip() == '  - `$feature.Depth + $feature.Width / 10`' for ln in clines),
      'code_deck: code-shaped bullet renders as inline code')
check(any(ln.rstrip() == '  - positive case expected result route measure' for ln in clines),
      'code_deck: prose bullet is not wrapped')
check('| a = b; c = d; | plain cell |' in ct and '| var x = 1; | referent |' in ct,
      'code_deck: table rows never absorbed into a fence')

pt = run_node('zte_cur.ts', 'prose_deck.pptx.b64', '')['out']['text']
check('```' not in pt and
      'Select the route; click Save; verify the label renders;' in pt and
      'return to the map view and verify the resulting label' in pt,
      'prose_deck: instruction-shaped prose gains no fence at all')

# ---- 12: the v2.2 behavior (ZipTextExtract v2.2 — DL-1 diagram-label
# collapse) ----------------------------------------------------------------
dt = run_node('zte_cur.ts', 'diagram_deck.pptx.b64', '')['out']['text']
dlines = [ln.rstrip() for ln in dt.split('\n')]
figs = [ln for ln in dlines if ln.startswith('[figure:')]
check(figs == ['[figure: 10–15 · R1 · E1 · Output]'],
      f'diagram_deck: exactly one figure line, runs compressed + deduped ({figs})')
check(not any(ln in ('11', 'R1', 'E1', 'Output') for ln in dlines),
      'diagram_deck: no label renders as a standalone body line')
slide2_at = dt.index('## Slide 2')
check(dt.index(figs[0]) < slide2_at if figs else False,
      'diagram_deck: the figure line belongs to slide 1')
check('Verify the split renders across the diagram below today' in dt,
      'diagram_deck: prose textbox stays in the body')
check('Modify this test case to use measure five instead' in dt,
      'diagram_deck: long floating callout stays inline (not a label)')
check('| Route ID | R1 |' in dt and '| Measure | 10 |' in dt,
      'diagram_deck: graphicFrame table untouched by the collapse')
s2 = dt[slide2_at:]
check('[figure:' not in s2 and all(l in s2.split('\n') for l in ('A1', 'B2', 'C3')),
      'diagram_deck: 3 floating labels stay inline (below the cluster threshold)')

# ---- 13: the v2.5 behaviors (ZipTextExtract v2.5 — Sidecar_Format_Plan
# phase 2: CP-1 cell paragraphs, TP-1 top-label headings, IB-1 inherited
# bullets, DL-2 docx labels + ordered lists) --------------------------------
vt = run_node('zte_cur.ts', 'cells_deck.pptx.b64', '')['out']['text']
vlines = [ln.rstrip() for ln in vt.split('\n')]
check('## Slide 1 — Coordinate Configuration Tests' in vlines,
      'cells_deck: title-less slide takes its topmost short label as the heading (TP-1)')
check('Coordinate Configuration Tests' not in vt.replace('## Slide 1 — Coordinate Configuration Tests', ''),
      'cells_deck: the promoted label is spliced out of the body (no duplicate)')
check('Footnote below the tables' in vt, 'cells_deck: a lower textbox is not promoted')
check('**Positive Tests: Normal Routes**' in vlines,
      'cells_deck: single-column label box renders as a bold label (CP-1)')
check('- Correct line order of 100, 200, 300, 400 on a normal line' in vlines and
      '- Correct line order of 300, 400, 500, 600 on a normal line' in vlines and
      '- Time sliced routes, first slice 100, 200 and second 300, 400' in vlines,
      'cells_deck: every cell paragraph is its own bullet (no run-on cell)')
check('| A-1 | Toggle is present | Toggle shown<br>Default OFF |' in vlines,
      'cells_deck: multi-column cell paragraphs join on <br>')
check('| # | Test | Expected result |' in vlines, 'cells_deck: multi-column table keeps its header row')
s2v = vt[vt.index('## Slide 2'):]
check('- Shows only for an UN-APR dataset' in s2v and '- Allow turning these layers ON and OFF' in s2v,
      'cells_deck: body-placeholder paragraphs render with the master\'s inherited bullet (IB-1)')
check('Plain note with the bullet turned off' in s2v and '- Plain note with the bullet turned off' not in s2v,
      'cells_deck: an explicit buNone paragraph stays plain')

lt = run_node('zte_cur.ts', 'labels.docx.b64', '')['out']['text']
llines = [ln.rstrip() for ln in lt.split('\n')]
check('### UI Tests – First Pane' in llines, 'labels.docx: bold label paragraph becomes a ### heading (DL-2)')
check('### Negative Tests:' in llines, 'labels.docx: a ":" label followed by a list becomes a ### heading')
check('1. Open the widget' in llines and '1. Pick a route' in llines,
      'labels.docx: List Number items render as ordered "1. " items')
check('### Steps to reproduce:' in llines, 'labels.docx: a ":" label before an ordered list becomes a heading too')
check('- Verify the Open Type is set from the configuration' in llines,
      'labels.docx: List Bullet items still render as "- " items')
check(any(ln.startswith('This whole sentence is bold but far too long') for ln in llines) and
      not any(ln.startswith('### This whole sentence') for ln in llines),
      'labels.docx: a long bold sentence is not a heading')
check('A plain paragraph that ends with a colon but has no list after it:' in llines and
      '### A plain paragraph' not in lt,
      'labels.docx: a ":" paragraph with no list after it is not a heading')

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed')
    sys.exit(1)
print('RESULT: PASS')
