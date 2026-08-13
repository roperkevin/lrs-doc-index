"""Gate for the r6 batch: ZipTextExtract v2.1 (CF-1 code fencing),
RegexExtract v1.4 (PD-1 product detection), SidecarPatch v1.6
(comment metadata frame).

Three-patch batch, paired with the flow v2.8 / PromptVersion v2.0
sidecar format (yaml block hidden inside `<!-- metadata` ... `-->`,
Product info row + `products:` yaml line, fenced code blocks in
bodies). Stages every canonical script from scripts/ and overlays —

  ../patches/ZipTextExtract_v2_1.ts
  ../patches/RegexExtract_v1_4.ts
  ../patches/SidecarPatch_v1_6.ts

— then:

  1. re-runs the FULL standing suites over the stage
     (check_format.py + check_related.py + check_regex.py via the
     HARNESS_SCRIPTS override; the suites already carry the r6
     contracts — gate and suites land together, as in r2..r5);
  2. asserts EQUIVALENCE against the genuinely-old artifacts (the r5
     improvement — the legs stay meaningful after promotion):
       - ZTE v2.0 vs v2.1: full output byte-identical on EVERY
         pre-r6 fixture (the fencing pass may not touch prose,
         tables, headings, notes, links) plus prose_deck (the
         instruction-shaped prose control), and throw-parity on the
         encrypted / truncated / NLEN fixtures;
       - RegexExtract v1.3 vs v1.4: ids / docRevision / idCount /
         slug identical on the full check_regex case set (products
         is additive);
       - SidecarPatch v1.5 vs v1.6: full result identical on
         fenced / dashed / details payloads (set, merge, mixed).
  3. proves each new-behavior fixture DISCRIMINATES: v2.0 leaves
     code_deck fence-free where v2.1 fences it; v1.3 returns no
     products; v1.5 no-ops (not-frontmatter, byte-identical) on a
     comment-frame sidecar that v1.6 patches with the head preserved;
  4. type-checks the three staged scripts at ES2017.

Signatures are UNCHANGED on all three (the new RegexExtract fields
are additive), so the pastes need no flow rewiring. Paste fencing is
the r5 shape: SidecarPatch v1.6 is a strict superset of v1.5 and
pastes safely any time BEFORE the flow v2.8 designer edits;
ZipTextExtract v2.1 and RegexExtract v1.4 paste with the v2.8 window
(their changes are format changes the PromptVersion v2.0 backfill
converges). Flow v2.8 live against SidecarPatch v1.5 silently no-ops
every comment-frame sidecar in the patcher.

Prereqs: make_fixtures.py has run in this directory. Exit nonzero on
any failure — any FAIL = do not paste.
"""
import json
import os
import shutil
import subprocess
import sys

# Future-proofing (the r2..r5 precedent): once a NEWER batch promotes
# over scripts/, this gate's premises break by design — skip.
_zte_head = open('../../scripts/ZipTextExtract.ts', encoding='utf-8').read(200)
if 'ZipTextExtract v2.1' not in _zte_head and 'ZipTextExtract v2.0' not in _zte_head:
    print('scripts/ has moved past the r6 generation — this HISTORICAL '
          'gate is superseded; skipping.')
    sys.exit(0)

PATCHES = {
    'ZipTextExtract.ts': '../patches/ZipTextExtract_v2_1.ts',
    'RegexExtract.ts': '../patches/RegexExtract_v1_4.ts',
    'SidecarPatch.ts': '../patches/SidecarPatch_v1_6.ts',
}
STAGE = 'stage_r6'
OLD_ZTE = '../patches/ZipTextExtract_v2_0.ts'
OLD_REX = '../patches/RegexExtract_v1_3.ts'
OLD_SCP = '../patches/SidecarPatch_v1_5.ts'

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- stage: every canonical script, patches overlaid ---------------------
os.makedirs(STAGE, exist_ok=True)
for name in os.listdir('../../scripts'):
    if name.endswith('.ts'):
        shutil.copyfile(os.path.join('../../scripts', name),
                        os.path.join(STAGE, name))
for canon, src in PATCHES.items():
    shutil.copyfile(src, os.path.join(STAGE, canon))

# ---- regression: the full standing suites over the staged batch ----------
env = dict(os.environ, HARNESS_SCRIPTS=STAGE)
for suite in ('check_format.py', 'check_related.py', 'check_regex.py'):
    r = subprocess.run([sys.executable, suite], env=env,
                       capture_output=True, text=True, encoding='utf-8')
    check(r.returncode == 0, f'regression: {suite} fully green over the staged batch'
          + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-3000:]))

# ==== ZipTextExtract equivalence: v2.0 vs staged v2.1 =====================
print('== ZTE equivalence: old vs staged on every pre-r6 fixture ==')
subprocess.run([sys.executable, 'wrap.py', OLD_ZTE, 'zte_r6_old.ts'], check=True)
subprocess.run([sys.executable, 'wrap.py', os.path.join(STAGE, 'ZipTextExtract.ts'),
                'zte_r6_new.ts'], check=True)


def run_zte(runner, fixture, prefix):
    return subprocess.run(['node', '--experimental-strip-types', runner,
                           fixture, prefix],
                          capture_output=True, text=True, encoding='utf-8')


ZTE_FIXTURES = ['real_deck.pptx', 'real_doc.docx', 'edge_deck.pptx',
                'noprops_deck.pptx', 'reordered_deck.pptx', 'merged_deck.pptx',
                'bigimg_deck.pptx', 'relswap_deck.pptx', 'edgecase2_deck.pptx',
                'hashheading_deck.pptx', 'manytables.docx', 'prose_deck.pptx']
for f in ZTE_FIXTURES:
    a = run_zte('zte_r6_old.ts', f + '.b64', 'media/docX_')
    b = run_zte('zte_r6_new.ts', f + '.b64', 'media/docX_')
    # compare the result object only — the wrap.py runner adds a timing
    # field to stdout that never reproduces
    check(a.returncode == 0 and b.returncode == 0 and
          json.loads(a.stdout)['out'] == json.loads(b.stdout)['out'],
          f'ZTE IDENTICAL full output on: {f}')
for f in ('encrypted_deck.pptx', 'truncstored.docx', 'storednlen.docx'):
    a = run_zte('zte_r6_old.ts', f + '.b64', '')
    b = run_zte('zte_r6_new.ts', f + '.b64', '')
    check(a.returncode != 0 and b.returncode != 0,
          f'ZTE throw-parity on: {f}')

# ==== RegexExtract equivalence: v1.3 vs staged v1.4 =======================
print('== RegexExtract equivalence: shared fields on the case set ==')
REX_APPENDIX = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const cases: { file: string, content: string, title: string }[] =
  JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(cases.map((c) =>
  main(null as unknown, c.file, c.content, 'ArcGISPro/ps-location-referencing', c.title))));
'''
for tag, src in (('old', OLD_REX), ('new', os.path.join(STAGE, 'RegexExtract.ts'))):
    body = open(src, encoding='utf-8').read().replace(
        'workbook: ExcelScript.Workbook', 'workbook: unknown')
    open(f'rex_r6_{tag}.ts', 'w', encoding='utf-8').write(body + REX_APPENDIX)

REX_CASES = [
    {'file': 'Plain.docx', 'title': '',
     'content': 'see https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/1234'},
    {'file': '26161_ExB_Widget_Spec.docx', 'title': '', 'content': ''},
    {'file': '1234_Route_Editing.pptx', 'title': 'Route Editing — Locks', 'content': ''},
    {'file': 'Gantt.pptx', 'title': '',
     'content': '#456 and devtopia.esri.com/A/b/issues/26161 #26161'},
    {'file': 'TestPlanV1.docx', 'title': '', 'content': ''},
    {'file': 'Notes_Nov21.docx', 'title': '', 'content': ''},
    {'file': 'RH_Roundabouts_TestPlan.pptx', 'title': '', 'content': ''},
    {'file': 'Compound.pptx', 'title': '', 'content': 'Test with UNAPR, RH, ADMRH, and PoM data'},
]
json.dump(REX_CASES, open('rex_r6_cases.json', 'w', encoding='utf-8'))


def run_rex(runner):
    out = subprocess.run(['node', '--experimental-strip-types', runner,
                          'rex_r6_cases.json'],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f'{runner} failed:\n{out.stderr[:2000]}')
    return json.loads(out.stdout)


rex_old = run_rex('rex_r6_old.ts')
rex_new = run_rex('rex_r6_new.ts')
shared_ok = all(
    [o['ids'], o['docRevision'], o['idCount'], o['slug']] ==
    [n['ids'], n['docRevision'], n['idCount'], n['slug']]
    for o, n in zip(rex_old, rex_new))
check(shared_ok, 'RegexExtract: ids/docRevision/idCount/slug IDENTICAL on all cases')
check(all('products' not in o for o in rex_old),
      'fixture discriminates: v1.3 returns no products field')
by_new = {c['file']: r for c, r in zip(REX_CASES, rex_new)}
check(by_new['RH_Roundabouts_TestPlan.pptx']['products'] == ['Roads & Highways'] and
      by_new['Compound.pptx']['products'] ==
      ['Roads & Highways', 'Pipeline Referencing', 'Utility Network'] and
      by_new['Plain.docx']['products'] == [],
      'v1.4 detects products (filename acronym, compound tokens, none on plain)')

# ==== SidecarPatch equivalence: v1.5 vs staged v1.6 =======================
print('== SidecarPatch equivalence: old vs staged on pre-r6 frames ==')
SCP_APPENDIX = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, JSON.stringify(p.files), p.selfId,
  JSON.stringify(p.ranked), JSON.stringify(p.docsMeta), JSON.stringify(p.selfMeta), p.topN)));
'''
for tag, src in (('old', OLD_SCP), ('new', os.path.join(STAGE, 'SidecarPatch.ts'))):
    body = open(src, encoding='utf-8').read().replace(
        'workbook: ExcelScript.Workbook', 'workbook: unknown')
    open(f'scp_r6_{tag}.ts', 'w', encoding='utf-8').write(body + SCP_APPENDIX)


def run_payload(runner, payload):
    path = runner.replace('.ts', '_payload.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(payload, f)
    out = subprocess.run(['node', '--experimental-strip-types', runner, path],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f'{runner} failed:\n{out.stderr[:2000]}')
    return json.loads(out.stdout)


BEGIN = '<!-- related:begin -->'
END = '<!-- related:end -->'
DETAILS_OPEN = '<details><summary>Metadata</summary>\n\n```yaml\n'
DETAILS_CLOSE = '\n```\n\n</details>\n'
COMMENT_OPEN = '<!-- metadata\n```yaml\n'
COMMENT_CLOSE = '\n```\n-->\n'


def sidecar(related_line='related: []', region='_None yet._', frame='fence'):
    fm = f'''title: "Conflict \\"Prevention\\": Acquire Locks for New Routes"
doc_id: 42
keywords: ["locks", "routes"]
tools: []
{related_line}'''
    tail = f'''## Summary

Explores lock acquisition.

## Related documents

{BEGIN}
{region}
{END}

---

## Slide 3 — Locking new routes
related: [decoy]
'''
    if frame in ('details', 'comment'):
        opener, closer = ((DETAILS_OPEN, DETAILS_CLOSE) if frame == 'details'
                          else (COMMENT_OPEN, COMMENT_CLOSE))
        return f'''# Conflict "Prevention": Acquire Locks for New Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |

{opener}{fm}{closer}
{tail}'''
    fm_open, fm_close = ('```yaml', '```') if frame == 'fence' else ('---', '---')
    return f'''{fm_open}
{fm}
{fm_close}

# Conflict "Prevention": Acquire Locks for New Routes

{tail}'''


RANKED = [{'doc': 17, 's': 1003, 'why': 'shared issue a#1'},
          {'doc': 23, 's': 2, 'why': '2 shared keywords: locks, routes'}]
META = [{'ID': 17, 'Title': 'Lock Acquisition Test Plan',
         'TextFileUrl': 'https://x/s/Test Plans/lock-acquisition-test-plan__doc17.md'},
        {'ID': 23, 'Title': 'Route Editing Spike',
         'TextFileUrl': 'https://x/s/Design Spikes/route-editing-spike__doc23.md'}]
SELF_META = {'doc': 42, 'title': 'Conflict "Prevention": Acquire Locks for New Routes',
             'url': 'https://x/s/User Stories/conflict-prevention__doc42.md',
             'file': 'conflict-prevention__doc42.md'}


def payload(files, ranked=RANKED):
    return {'files': files, 'selfId': '42', 'ranked': ranked,
            'docsMeta': META, 'selfMeta': SELF_META, 'topN': 5}


neighbor_line = 'related: [{"doc":99,"file":"other__doc99.md","s":1}]'
neighbor_region = '- [Other](<https://x/o.md>) — 1 shared keyword: locks <!-- rel:99 -->'
EQUIV_PAYLOADS = {
    'set mode, fenced frame': payload(
        [{'doc': 42, 'name': 'self.md', 'content': sidecar()}]),
    'set mode, dashed frame': payload(
        [{'doc': 42, 'name': 'self.md', 'content': sidecar(frame='dash')}]),
    'set mode, details frame': payload(
        [{'doc': 42, 'name': 'self.md', 'content': sidecar(frame='details')}]),
    'merge, details neighbor': payload(
        [{'doc': 17, 'name': 'n.md',
          'content': sidecar(related_line=neighbor_line, region=neighbor_region,
                             frame='details')}]),
    'empty set mode': payload(
        [{'doc': 42, 'name': 'self.md', 'content': sidecar()}], ranked=[]),
    'not-frontmatter': payload(
        [{'doc': 42, 'name': 'x.md', 'content': 'no frontmatter here\r\nat all'}]),
    'mixed pre-r6 batch with folders': payload(
        [{'doc': 42, 'name': 'self.md', 'folder': '/LRS Doc Index/User Stories',
          'content': sidecar(frame='details')},
         {'doc': 17, 'name': 'n.md', 'folder': '/LRS Doc Index/Test Plans',
          'content': sidecar(related_line=neighbor_line, region=neighbor_region,
                             frame='dash')}]),
}
for label, p in EQUIV_PAYLOADS.items():
    a = run_payload('scp_r6_old.ts', p)
    b = run_payload('scp_r6_new.ts', p)
    check(a == b, f'SCP IDENTICAL content/changed/note on: {label}')

# ==== new behavior + fixture discrimination ===============================
print('== new behavior (full contracts live in the standing suites) ==')

# CF-1: v2.0 leaves code_deck fence-free; v2.1 fences the script
a = run_zte('zte_r6_old.ts', 'code_deck.pptx.b64', '')
b = run_zte('zte_r6_new.ts', 'code_deck.pptx.b64', '')
old_text = json.loads(a.stdout)['out']['text']
new_text = json.loads(b.stdout)['out']['text']
check('```' not in old_text and '```arcade' in new_text and
      'var station = $feature.MEASURE' in new_text,
      'fixture discriminates: v2.0 emits no fence on code_deck; v2.1 fences it')

# comment frame: v1.5 no-ops, v1.6 patches with the head preserved
com = sidecar(frame='comment')
COM_PAYLOAD = payload([{'doc': 42, 'name': 'self.md', 'content': com}])
b = run_payload('scp_r6_new.ts', COM_PAYLOAD)['files'][0]
check(b['changed'] and b['note'] == 'set' and
      '<!-- rel:17 -->' in b['content'] and
      b['content'][:b['content'].index(COMMENT_OPEN)] ==
      com[:com.index(COMMENT_OPEN)],
      'v1.6 patches the comment frame; H1 + info table head byte-preserved')
a = run_payload('scp_r6_old.ts', COM_PAYLOAD)['files'][0]
check(not a['changed'] and a['note'] == 'not-frontmatter' and
      a['content'] == com,
      'fixture discriminates: v1.5 no-ops on the comment frame '
      '(not-frontmatter, byte-identical)')

# ---- type-check the staged scripts at ES2017 =============================
print('== tsc over the staged scripts ==')
for canon in PATCHES:
    body = open(os.path.join(STAGE, canon), encoding='utf-8').read().replace(
        'workbook: ExcelScript.Workbook', 'workbook: unknown')
    tsc_name = canon.replace('.ts', '_r6_tsc.ts').lower()
    open(tsc_name, 'w', encoding='utf-8').write(body)
    r = subprocess.run(['npx', '--yes', '--package', 'typescript', 'tsc', '--noEmit',
                        '--target', 'es2017', tsc_name],
                       capture_output=True, text=True, encoding='utf-8')
    check(r.returncode == 0, f'{canon} (staged) type-checks at ES2017'
          + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-2000:]))

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed — DO NOT PASTE')
    sys.exit(1)
print('RESULT: PASS — r6 batch is paste-ready (unchanged signatures; '
      'SidecarPatch v1.6 pastes safely BEFORE the flow v2.8 designer edits, '
      'ZipTextExtract v2.1 + RegexExtract v1.4 paste with the v2.8 window — '
      'see designer-edits.md §v2_8)')
