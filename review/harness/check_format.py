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

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed')
    sys.exit(1)
print('RESULT: PASS')
