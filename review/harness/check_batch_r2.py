"""Gate for the r2 script batch (REVIEW_v2_5_r2.md SB-1..SB-9).

HISTORICAL since 2026-08-11: the batch PASSED this gate and the patches
were promoted over scripts/ — the new-behavior assertions were folded
into check_regex.py, check_format.py (§10) and check_related.py (the
v1.4 cases), which run against scripts/ directly; those are the
standing suites. Post-promotion this gate re-verifies the promotion:
the old-vs-new equivalence halves self-compare (old = scripts/ = the
promoted batch) and the "fixture discriminates" assertions — which
need the genuinely-old scripts — are skipped via the PROMOTED guard.
The tenant PASTE may still be pending independently; see STATUS.md.

Stages the six patch files —

  ../patches/RegexExtract_v1_3.ts     (SB-1)
  ../patches/SidecarPatch_v1_4.ts     (SB-2, SB-3)
  ../patches/WorkbookDump_v1_2.ts     (SB-4)
  ../patches/ZipTextExtract_v2_0.ts   (SB-5..SB-8)
  ../patches/MediaExtract_v1_3.ts     (SB-5, SB-8)
  ../patches/RelatedRank_v1_3.ts      (SB-9)

— under canonical names, re-runs the FULL standing suites over them
(check_format.py + check_related.py + check_regex.py via the
HARNESS_SCRIPTS override: the entire current-generation contract must
stay green, since none of the batch's changes touch existing-fixture
behavior), byte-diffs old (scripts/) vs new (staged) on the existing
fixtures — IDENTICAL everywhere is the design constraint — then
asserts every NEW behavior on the r2 fixtures make_fixtures.py plants
(hashheading_deck, storednlen, lyingcd_deck, manytables) plus inline
payloads. Several assertions also run the OLD version to prove each
fixture actually catches its bug (the gate fails if a fixture stops
discriminating).

Prereqs: make_fixtures.py has run in this directory. Exit nonzero on
any failure — any FAIL = do not paste.

On promotion (paste all six into the Automate tab + copy patches over
scripts/), fold the new-behavior assertions below into check_regex.py
/ check_format.py / check_related.py and mark this gate historical.
"""
import json
import os
import shutil
import subprocess
import sys

PATCHES = {
    'RegexExtract.ts': '../patches/RegexExtract_v1_3.ts',
    'SidecarPatch.ts': '../patches/SidecarPatch_v1_4.ts',
    'WorkbookDump.ts': '../patches/WorkbookDump_v1_2.ts',
    'ZipTextExtract.ts': '../patches/ZipTextExtract_v2_0.ts',
    'MediaExtract.ts': '../patches/MediaExtract_v1_3.ts',
    'RelatedRank.ts': '../patches/RelatedRank_v1_3.ts',
}
STAGE = 'stage_r2'
OLD = '../../scripts'
# post-promotion, scripts/ IS the r2 batch: discriminator assertions
# (which prove each fixture catches its bug on the OLD scripts) skip
PROMOTED = 'RegexExtract v1.3' in open(f'{OLD}/RegexExtract.ts',
                                       encoding='utf-8').read(200)
if PROMOTED:
    print('scripts/ carries the promoted r2 batch — equivalence halves '
          'self-compare; discriminator assertions skipped (see docstring).')

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- stage the batch under canonical names -------------------------------
os.makedirs(STAGE, exist_ok=True)
for canon, src in PATCHES.items():
    shutil.copyfile(src, os.path.join(STAGE, canon))

# ---- regression: the full standing suites over the staged batch ----------
env = dict(os.environ, HARNESS_SCRIPTS=STAGE)
for suite in ('check_format.py', 'check_related.py', 'check_regex.py'):
    r = subprocess.run([sys.executable, suite], env=env,
                       capture_output=True, text=True, encoding='utf-8')
    check(r.returncode == 0, f'regression: {suite} fully green over the staged batch'
          + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-3000:]))

# ---- wrap old/new runner pairs -------------------------------------------
for tag, root in (('old', OLD), ('new', STAGE)):
    subprocess.run([sys.executable, 'wrap.py', f'{root}/ZipTextExtract.ts', f'zte_{tag}.ts'], check=True)
    subprocess.run([sys.executable, 'wrap.py', f'{root}/MediaExtract.ts', f'me_{tag}.ts'], check=True)
    subprocess.run([sys.executable, 'wrap_workbook.py', f'{root}/WorkbookDump.ts', f'wbd_{tag}.ts'], check=True)

REX_APPENDIX = '''
// ---- harness appendix (full IdResult) ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const cases: { file: string, content: string, title: string }[] =
  JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(cases.map((c) =>
  main(null as unknown, c.file, c.content, 'ArcGISPro/ps-location-referencing', c.title))));
'''
SCP_APPENDIX = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, JSON.stringify(p.files), p.selfId,
  JSON.stringify(p.ranked), JSON.stringify(p.docsMeta), JSON.stringify(p.selfMeta), p.topN)));
'''
RR_APPENDIX = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, p.selfId, JSON.stringify(p.myKws),
  JSON.stringify(p.sharers), JSON.stringify(p.idLinks), p.topN)));
'''
for tag, root in (('old', OLD), ('new', STAGE)):
    for base, appendix in (('RegexExtract', REX_APPENDIX), ('SidecarPatch', SCP_APPENDIX),
                           ('RelatedRank', RR_APPENDIX)):
        body = open(f'{root}/{base}.ts', encoding='utf-8').read().replace(
            'workbook: ExcelScript.Workbook', 'workbook: unknown')
        short = {'RegexExtract': 'rex', 'SidecarPatch': 'scp', 'RelatedRank': 'rr'}[base]
        open(f'{short}_{tag}.ts', 'w', encoding='utf-8').write(body + appendix)


def run_node(script, *args):
    out = subprocess.run(['node', '--experimental-strip-types', script, *args],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f"{script} failed on {args}:\n{out.stderr[:2000]}")
    return json.loads(out.stdout)


def run_node_expect_fail(script, *args):
    return subprocess.run(['node', '--experimental-strip-types', script, *args],
                          capture_output=True, text=True, encoding='utf-8')


def run_payload(runner, payload):
    path = runner.replace('.ts', '_payload.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(payload, f)
    return run_node(runner, path)


# ==== Equivalence on existing fixtures ====================================
print('== equivalence: old (scripts/) vs new (staged) on existing fixtures ==')

ZTE_FIXTURES = ['real_deck.pptx.b64', 'real_doc.docx.b64', 'edge_deck.pptx.b64',
                'noprops_deck.pptx.b64', 'reordered_deck.pptx.b64', 'merged_deck.pptx.b64',
                'bigimg_deck.pptx.b64', 'relswap_deck.pptx.b64', 'edgecase2_deck.pptx.b64']
for f in ZTE_FIXTURES:
    a = run_node('zte_old.ts', f, 'media/docX_')['out']
    b = run_node('zte_new.ts', f, 'media/docX_')['out']
    check(a == b, f'ZTE identical on {f}')

for f in ('encrypted_deck.pptx.b64', 'truncstored.docx.b64'):
    ra = run_node_expect_fail('zte_old.ts', f, '')
    rb = run_node_expect_fail('zte_new.ts', f, '')
    check(ra.returncode != 0 and rb.returncode != 0, f'ZTE both versions still throw on {f}')

for f in ('real_deck.pptx.b64', 'bigimg_deck.pptx.b64', 'relswap_deck.pptx.b64'):
    a = run_node('me_old.ts', f)['out']
    b = run_node('me_new.ts', f)['out']
    check(a == b, f'MediaExtract identical on {f}')

a = run_node('wbd_old.ts', 'sheets.json')['out']
b = run_node('wbd_new.ts', 'sheets.json')['out']
check(a == b, 'WorkbookDump identical on sheets.json')

REX_EQ_CASES = [
    {'file': 'Plain.docx', 'title': '',
     'content': 'see https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/1234'},
    {'file': '26161_ExB_Widget_Spec.docx', 'title': '', 'content': ''},
    {'file': '1234_Route_Editing.pptx', 'title': '', 'content': '#456 and #26161'},
    {'file': 'TestPlanV1.docx', 'title': '', 'content': ''},
    {'file': 'Report_V4.pptx', 'title': 'Some Title', 'content': ''},
    {'file': 'spec_v2.docx', 'title': '', 'content': ''},
    {'file': 'Notes_1.docx', 'title': '', 'content': ''},
    {'file': '20260806_Meeting_Notes.docx', 'title': '', 'content': ''},
]
json.dump(REX_EQ_CASES, open('rex_eq_cases.json', 'w', encoding='utf-8'))
a = run_node('rex_old.ts', 'rex_eq_cases.json')
b = run_node('rex_new.ts', 'rex_eq_cases.json')
check(a == b, 'RegexExtract identical on the non-SB-1 contract cases')

RR_PAYLOAD = {
    'selfId': '42',
    'myKws': [{'Document': {'Id': 42}, 'Keyword': {'Id': k, 'Value': t}}
              for k, t in ((1, 'locks'), (2, 'routes'), (3, 'calibration'))],
    'sharers': [{'Document': {'Id': d}, 'Keyword': {'Id': k}}
                for d, k in ((7, 1), (7, 2), (8, 2), (9, 3), (9, 1))],
    'idLinks': [{'DocA': {'Id': 42}, 'DocB': {'Id': 9}, 'SharedValues': 'ArcGISPro/x#101',
                 'LinkType': 'id'}],
    'topN': 5,
}
a = run_payload('rr_old.ts', RR_PAYLOAD)
b = run_payload('rr_new.ts', RR_PAYLOAD)
check(a == b, 'RelatedRank identical on a mixed id+keyword payload')

FENCED = ('```yaml\n'
          'doc_id: 41\n'
          'title: Neighbor doc\n'
          'tools: []\n'
          'related: []\n'
          '```\n'
          '# Neighbor doc\n'
          '**meta strip**\n'
          '## Summary\n'
          'summary text\n'
          '\n---\n'
          'body text\n'
          '<!-- related:begin -->\n'
          '_none_\n'
          '<!-- related:end -->\n')
SCP_PAYLOAD = {
    'files': [{'doc': 41, 'name': 'n.md', 'folder': 'User Stories', 'content': FENCED}],
    'selfId': '42',
    'ranked': [{'doc': 41, 's': 1001.5, 'why': 'shared issue x#101'}],
    'docsMeta': [{'ID': 41, 'Title': 'Neighbor doc', 'TextFileUrl': 'https://x/n.md'}],
    'selfMeta': {'doc': 42, 'title': 'Self doc', 'url': 'https://x/s.md', 'file': 's.md'},
    'topN': 5,
}
a = run_payload('scp_old.ts', SCP_PAYLOAD)
b = run_payload('scp_new.ts', SCP_PAYLOAD)
check(a == b, 'SidecarPatch identical on a well-formed merge payload')

# ==== SB-1: docRevision token guard =======================================
print('== SB-1 docRevision (RegexExtract v1.3) ==')
SB1 = [{'file': f, 'title': '', 'content': ''} for f in
       ('Notes_Nov21.docx', '20260806_Rev12.pptx', 'Notes_dev3.docx', 'REV12.docx',
        'MyPlanv2.docx', 'TestPlanV1.docx', 'Report_V4.pptx', 'spec_v2.docx', 'V4.docx')]
json.dump(SB1, open('rex_sb1_cases.json', 'w', encoding='utf-8'))
new = run_node('rex_new.ts', 'rex_sb1_cases.json')
want = ['', '', '', '', '', 'V1', 'V4', 'V2', 'V4']
got = [r['docRevision'] for r in new]
check(got == want, f'v1.3 docRevision table exact (got {got})')
if not PROMOTED:
    old = run_node('rex_old.ts', 'rex_sb1_cases.json')
    check(old[0]['docRevision'] == 'V21' and old[1]['docRevision'] == 'V12',
          'fixture discriminates: v1.2 mints the phantom V21/V12 the fix removes')

# ==== SB-2: duplicate related: key ========================================
print('== SB-2 related: node forms (SidecarPatch v1.4) ==')
BLOCK = FENCED.replace('related: []\n', 'related:\n  - doc: 9\n    file: x.md\n    s: 1\n')
NULLV = FENCED.replace('related: []\n', 'related: null\n')
SPACED = FENCED.replace('related: []\n', 'related:  [{"doc": 9, "file": "x.md", "s": 1}]\n')
for tag, content in (('block-sequence', BLOCK), ('null-value', NULLV), ('extra-space inline', SPACED)):
    p = dict(SCP_PAYLOAD, files=[{'doc': 41, 'name': 'n.md', 'folder': '', 'content': content}])
    out = run_payload('scp_new.ts', p)['files'][0]['content']
    fm = out.split('```')[1]
    n = sum(1 for ln in fm.split('\n') if ln.startswith('related:'))
    check(n == 1, f'v1.4: exactly one related: key after patching a {tag} form (got {n})')
if not PROMOTED:
    p = dict(SCP_PAYLOAD, files=[{'doc': 41, 'name': 'n.md', 'folder': '', 'content': BLOCK}])
    out_old = run_payload('scp_old.ts', p)['files'][0]['content']
    fm_old = out_old.split('```')[1]
    n_old = sum(1 for ln in fm_old.split('\n') if ln.startswith('related:'))
    check(n_old == 2, f'fixture discriminates: v1.3 duplicates the key on block form (got {n_old})')
check('  - doc: 9' not in fm, 'v1.4: the block-sequence continuation lines are consumed')

# ==== SB-3: ranked dedupe =================================================
print('== SB-3 ranked dedupe (SidecarPatch v1.4) ==')
DUP = dict(SCP_PAYLOAD,
           files=[{'doc': 42, 'name': 's.md', 'folder': '', 'content': FENCED.replace('doc_id: 41', 'doc_id: 42')}],
           ranked=[{'doc': 41, 's': 900.0, 'why': 'w1'}, {'doc': 41, 's': 5.0, 'why': 'w2'}])
out = run_payload('scp_new.ts', DUP)['files'][0]['content']
check(out.count('rel:41') == 1 and '"s": 900' not in out,
      f"v1.4: duplicate ranked doc renders once, highest score wins (rel:41 x{out.count('rel:41')})")
if not PROMOTED:
    out_old = run_payload('scp_old.ts', DUP)['files'][0]['content']
    check(out_old.count('rel:41') > 1, 'fixture discriminates: v1.3 renders the duplicate')

# ==== SB-4: formatted-but-empty sheet =====================================
print('== SB-4 empty-width sheet (WorkbookDump v1.2) ==')
json.dump({'Styled Empty': [['', ''], ['', '']], 'Real': [['a', 'b'], ['1', '2']]},
          open('sheets_empty.json', 'w', encoding='utf-8'))
new = run_node('wbd_new.ts', 'sheets_empty.json')['out']
lines = new.split('\n')
check(lines[lines.index('## Sheet: Styled Empty') + 1] == '(empty)',
      'v1.2: formatted-but-empty sheet renders "(empty)"')
check('| a | b |' in new, 'v1.2: the real sheet still renders')
if not PROMOTED:
    old = run_node('wbd_old.ts', 'sheets_empty.json')['out']
    check('|  |' in old, 'fixture discriminates: v1.1 emits malformed "|  |" rows')

# ==== SB-5: stored-block NLEN =============================================
print('== SB-5 NLEN verification (ZTE v2.0 / MediaExtract v1.3) ==')
r = run_node_expect_fail('zte_new.ts', 'storednlen.docx.b64', '')
check(r.returncode != 0 and 'NLEN mismatch' in r.stderr,
      'v2.0 ZTE throws on a wrong NLEN')
r = run_node_expect_fail('me_new.ts', 'storednlen_img.pptx.b64')
check(r.returncode != 0 and 'NLEN mismatch' in r.stderr,
      'v1.3 MediaExtract throws on a wrong NLEN (media entry)')
if not PROMOTED:
    r = run_node_expect_fail('zte_old.ts', 'storednlen.docx.b64', '')
    check(r.returncode == 0, 'fixture discriminates: v1.9 accepts the corrupted block')

# ==== SB-6: content ##..###### escape =====================================
print('== SB-6 heading forgery (ZTE v2.0) ==')
text = run_node('zte_new.ts', 'hashheading_deck.pptx.b64', '')['out']['text']
lines = text.split('\n')
check('\\## Fake section pasted' in text and '\\### Fake notes pasted' in text
      and '\\#### deep heading pasted' in text,
      'content ##/###/#### lines escaped')
check('\\# Roadmap pasted markdown' in text, 'the v1.9 single-# escape still fires')
check('\\## Fake heading inside notes' in text, 'notes content is escaped too')
heads = [ln for ln in lines if ln.startswith('## ')]
check(heads == ['## Slide 1 — HashTitle'],
      f'exactly one generated H2 survives, the slide heading (got {heads})')
check(sum(1 for ln in lines if ln == '### Notes') == 1,
      'the generated ### Notes heading survives')
if not PROMOTED:
    old_text = run_node('zte_old.ts', 'hashheading_deck.pptx.b64', '')['out']['text']
    check('\n## Fake section pasted' in old_text,
          'fixture discriminates: v1.9 lets content ## through unescaped')

# ==== SB-7: table truncation marker + width loop ==========================
print('== SB-7 table guard (ZTE v2.0) ==')
text = run_node('zte_new.ts', 'manytables.docx.b64', '')['out']['text']
check('(tables truncated at 200' in text, 'v2.0 emits the explicit truncation marker')
check('| tbl0cell |' in text, 'tables under the guard still render as GFM')
check('after the tables' in text, 'content after the tables survives')
if not PROMOTED:
    old_text = run_node('zte_old.ts', 'manytables.docx.b64', '')['out']['text']
    check('(tables truncated' not in old_text,
          'fixture discriminates: v1.9 truncates silently')

# ==== SB-8: lying central directory =======================================
print('== SB-8 size-claim verification (MediaExtract v1.3) ==')
r = run_node_expect_fail('me_new.ts', 'lyingcd_deck.pptx.b64')
check(r.returncode != 0 and 'size mismatch' in r.stderr,
      'v1.3 throws on a central directory whose size claim lies')
if not PROMOTED:
    r = run_node_expect_fail('me_old.ts', 'lyingcd_deck.pptx.b64')
    check(r.returncode == 0, 'fixture discriminates: v1.2 silently accepts the lie')

# ==== type-check every staged SCRIPT at ES2017 ============================
# The scripts themselves (what actually gets pasted), one at a time —
# each Office Script is its own global scope. (Not the wrapped runners:
# wrap.py's generic appendix passes 3 args to every main(), which is a
# runtime no-op but a type error for 2-param scripts like MediaExtract.)
print('== tsc over the staged scripts ==')
# WorkbookDump really reads its workbook param, so it gets the same
# mock type wrap_workbook.py uses; the other five treat it as a dummy
WB_MOCK = ('{ getWorksheets: () => { getName: () => string; getUsedRange: () => '
           '{ getRowCount: () => number; getColumnCount: () => number; '
           'getTexts: () => string[][] } | null }[] }')
for canon in PATCHES:
    swap = WB_MOCK if canon == 'WorkbookDump.ts' else 'unknown'
    body = open(os.path.join(STAGE, canon), encoding='utf-8').read().replace(
        'workbook: ExcelScript.Workbook', 'workbook: ' + swap)
    tsc_file = canon.replace('.ts', '_tsc.ts').lower()
    open(tsc_file, 'w', encoding='utf-8').write(body)
    r = subprocess.run(['npx', '--yes', '--package', 'typescript', 'tsc', '--noEmit', '--target', 'es2017', tsc_file],
                       capture_output=True, text=True, encoding='utf-8')
    check(r.returncode == 0, f'{canon} (staged) type-checks at ES2017'
          + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-2000:]))

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed — DO NOT PASTE')
    sys.exit(1)
print('RESULT: PASS — r2 batch is paste-ready (fixture gate; smoke per CHANGES on paste)')
print('Paste order: RegexExtract, WorkbookDump, RelatedRank, SidecarPatch, MediaExtract, ZipTextExtract')
