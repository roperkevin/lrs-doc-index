"""Gate for the r4 batch: RelatedRank v2.1 (related-ranking upgrade).

Single-patch batch. Stages every canonical script from scripts/ and
overlays —

  ../patches/RelatedRank_v2_1.ts

— then:

  1. re-runs the FULL standing suites over the stage
     (check_format.py + check_related.py + check_regex.py via the
     HARNESS_SCRIPTS override; check_related.py already carries the
     v2.1 contract — gate and suite land together, as in r2/r3);
  2. asserts V2.0 EQUIVALENCE: on v2.0-shaped payloads (no "title"
     key in selfMetaJson, single-name PE/Dev fields, per-doc non-id
     edge totals below softCap) v2.1's full result — related /
     docIds / count / flags — must equal v2.0's byte-for-byte,
     across BOTH the r3 gate's legacy payload set and an r3-shaped
     set (per-type edges, kind multipliers, alias fold, metadata
     affinity, pinned recency, ceiling flags) — the upgrade may not
     move a single v2.0 score on input the tenant can produce today;
  3. proves the new-behavior fixtures DISCRIMINATE: v2.0 lets a
     Strength pile outrank an id link (non-id edges escaped the
     soft cap), is blind to multi-name PE/Dev overlap, and ignores
     selfMeta "title" entirely;
  4. type-checks the staged script at ES2017.

The signature is UNCHANGED from v2.0 (11 params, same names), so the
paste needs no new flow rewiring — in the pending v2.6 window v2.1
simply replaces the v2.0 paste; on a tenant already running v2.0 +
flow v2.6 it pastes alone safely, with title affinity dormant until
the Self_rank_meta "title" designer edit lands. See
review/patches/designer-edits.md §v2_6 (r4 amendment). It remains
FENCED AGAINST the v2.5 flow exactly as v2.0 was: never paste it
before the v2.6 window.

Post-promotion this gate re-verifies the promotion: the equivalence
halves self-compare (old = scripts/ = the promoted patch) and the
discriminator assertions — which need the genuinely-old v2.0 — are
skipped via the PROMOTED guard.

Prereqs: make_fixtures.py has run in this directory (the standing
suites need the planted fixtures; the RelatedRank cases themselves
are inline payloads). Exit nonzero on any failure — any FAIL = do
not paste.
"""
import json
import os
import shutil
import subprocess
import sys

# Future-proofing (the r2/r3 precedent): once a NEWER batch promotes
# over scripts/, this gate's premises break by design — skip.
_rr_head = open('../../scripts/RelatedRank.ts', encoding='utf-8').read(200)
if 'RelatedRank v2.1' not in _rr_head and 'RelatedRank v2.0' not in _rr_head:
    print('scripts/ has moved past the r4 generation — this HISTORICAL '
          'gate is superseded; skipping.')
    sys.exit(0)

PATCHES = {
    'RelatedRank.ts': '../patches/RelatedRank_v2_1.ts',
}
STAGE = 'stage_r4'
OLD = '../../scripts'
# post-promotion, scripts/RelatedRank.ts IS v2.1: the equivalence
# halves self-compare, and v2.0-only discriminator assertions skip
PROMOTED = 'RelatedRank v2.1' in _rr_head
if PROMOTED:
    print('scripts/ carries the promoted r4 batch — equivalence halves '
          'self-compare; discriminator assertions skipped (see docstring).')

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- stage: every canonical script, patch overlaid -----------------------
os.makedirs(STAGE, exist_ok=True)
for name in os.listdir(OLD):
    if name.endswith('.ts'):
        shutil.copyfile(os.path.join(OLD, name), os.path.join(STAGE, name))
for canon, src in PATCHES.items():
    shutil.copyfile(src, os.path.join(STAGE, canon))

# ---- regression: the full standing suites over the staged batch ----------
env = dict(os.environ, HARNESS_SCRIPTS=STAGE)
for suite in ('check_format.py', 'check_related.py', 'check_regex.py'):
    r = subprocess.run([sys.executable, suite], env=env,
                       capture_output=True, text=True, encoding='utf-8')
    check(r.returncode == 0, f'regression: {suite} fully green over the staged batch'
          + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-3000:]))

# ---- wrap old/new runners (same 11-param signature both sides) -----------
RR_APPENDIX = '''
// ---- harness appendix (v2.0/v2.1 signature) ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, p.selfId,
  p.mode !== undefined ? p.mode : 'final', JSON.stringify(p.myKws),
  JSON.stringify(p.sharers), JSON.stringify(p.idLinks),
  JSON.stringify(p.kwMeta !== undefined ? p.kwMeta : []),
  JSON.stringify(p.candsMeta !== undefined ? p.candsMeta : []),
  JSON.stringify(p.selfMeta !== undefined ? p.selfMeta : {}),
  JSON.stringify(p.config !== undefined ? p.config : {}), p.topN)));
'''
for tag, root in (('old', OLD), ('new', STAGE)):
    body = open(f'{root}/RelatedRank.ts', encoding='utf-8').read().replace(
        'workbook: ExcelScript.Workbook', 'workbook: unknown')
    open(f'rr_{tag}.ts', 'w', encoding='utf-8').write(body + RR_APPENDIX)


def run_payload(runner, payload):
    path = runner.replace('.ts', '_payload.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(payload, f)
    out = subprocess.run(['node', '--experimental-strip-types', runner, path],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f'{runner} failed:\n{out.stderr[:2000]}')
    return json.loads(out.stdout)


def kwrow(doc, kwid, kwtitle=''):
    kw = {'Id': kwid}
    if kwtitle:
        kw['Value'] = kwtitle
    return {'Document': {'Id': doc}, 'Keyword': kw}


def idlink(a, b, shared):
    return {'DocA': {'Id': a}, 'DocB': {'Id': b}, 'SharedValues': shared,
            'LinkType': 'id'}


def link(a, b, ltype, shared='', strength=None):
    row = {'DocA': {'Id': a}, 'DocB': {'Id': b}, 'SharedValues': shared,
           'LinkType': ltype}
    if strength is not None:
        row['Strength'] = strength
    return row


def kwmeta(kid, kind=None, canonical=None, title=''):
    row = {'ID': kid, 'Title': title}
    if kind is not None:
        row['Kind'] = {'Value': kind}
    if canonical is not None:
        row['CanonicalRef'] = {'Id': canonical}
    return row


def candrow(doc, **fields):
    row = {'ID': doc}
    for k in ('DocKind', 'Surface'):
        if k in fields:
            row[k] = {'Value': fields[k]}
    for k in ('TargetRelease', 'PE', 'Dev', 'SourceModified', 'Title'):
        if k in fields:
            row[k] = fields[k]
    return row


# ==== equivalence: v2.0 vs v2.1 on v2.0-shaped payloads ===================
print('== equivalence: old vs staged on v2.0-shaped payloads ==')

KW8 = [(1, 'locks'), (2, 'routes'), (3, 'conflict prevention'),
       (4, 'route editing'), (5, 'events'), (6, 'calibration'),
       (7, 'gaps'), (8, 'measures')]
EQUIV_PAYLOADS = {
    # -- the r3 gate's legacy set, carried forward verbatim ---------------
    'mixed id+keyword (r2 gate payload)': {
        'selfId': '42',
        'myKws': [kwrow(42, k, t) for k, t in ((1, 'locks'), (2, 'routes'),
                                               (3, 'calibration'))],
        'sharers': [kwrow(d, k) for d, k in ((7, 1), (7, 2), (8, 2), (9, 3), (9, 1))],
        'idLinks': [idlink(42, 9, 'ArcGISPro/x#101')],
        'topN': 5},
    'id link outranks 8 keywords': {
        'selfId': '42',
        'myKws': [kwrow(42, k, t) for k, t in KW8],
        'sharers': [kwrow(10, k, t) for k, t in KW8] + [kwrow(42, 1, 'locks')],
        'idLinks': [idlink(11, 42, 'ArcGISPro/ps-location-referencing#4855')],
        'topN': 5},
    'rarity weighting + ties': {
        'selfId': '42',
        'myKws': [kwrow(42, 1, 'testing'), kwrow(42, 2, 'routes'),
                  kwrow(42, 3, 'conflict prevention')],
        'sharers': ([kwrow(30, 3, 'conflict prevention'),
                     kwrow(31, 1, 'testing'), kwrow(31, 2, 'routes'),
                     kwrow(32, 2, 'routes')]
                    + [kwrow(d, 1, 'testing') for d in range(100, 115)]),
        'idLinks': [], 'topN': 5},
    'tie-break and cap': {
        'selfId': '42',
        'myKws': [kwrow(42, k, t) for k, t in KW8],
        'sharers': [kwrow(d, 1, 'locks') for d in (20, 21, 22, 23, 24, 25, 26)],
        'idLinks': [], 'topN': 5},
    'both signals merge': {
        'selfId': '42',
        'myKws': [kwrow(42, k, t) for k, t in KW8],
        'sharers': [kwrow(10, 1, 'locks'), kwrow(10, 2, 'routes')],
        'idLinks': [idlink(10, 42, 'a#1;b#2')], 'topN': 5},
    'title-less keyword (SC-12b)': {
        'selfId': '42',
        'myKws': [kwrow(42, 1, 'locks'), kwrow(42, 5)],
        'sharers': [kwrow(10, 1, 'locks'), kwrow(10, 5)],
        'idLinks': [], 'topN': 5},
    'foreign idLinks row (SC-12a)': {
        'selfId': '42', 'myKws': [], 'sharers': [],
        'idLinks': [idlink(7, 8, 'a#1')], 'topN': 5},
    'empty inputs': {
        'selfId': '42', 'myKws': [], 'sharers': [], 'idLinks': [], 'topN': 5},
    # -- r3-shaped payloads: the v2.0 feature set, below every new edge ---
    'per-type edge weights (r3)': {
        'selfId': '42', 'myKws': [], 'sharers': [],
        'idLinks': [link(42, 64, 'id', 'x#1'),
                    link(42, 60, 'gantt', strength=3),
                    link(42, 62, 'review'),
                    link(42, 61, 'titlematch'),
                    link(42, 63, 'wormhole', 'a;b'),
                    link(42, 65, 'gantt', strength=3), link(42, 65, 'review'),
                    link(42, 65, 'titlematch')],
        'topN': 10},
    'strength fallback chain (r3)': {
        'selfId': '42', 'myKws': [], 'sharers': [],
        'idLinks': [link(42, 70, 'gantt', 'a;b', strength=4),
                    link(42, 71, 'gantt', 'a;b'),
                    link(42, 72, 'gantt')], 'topN': 5},
    'kind multipliers (r3)': {
        'selfId': '42',
        'myKws': [kwrow(42, 1, 'arcgis pro'), kwrow(42, 2, 'calibration')],
        'sharers': [kwrow(70, 1, 'arcgis pro'), kwrow(71, 2, 'calibration')],
        'idLinks': [],
        'kwMeta': [kwmeta(1, kind='product'), kwmeta(2, kind='topic')],
        'topN': 5},
    'alias fold DX-2 (r3)': {
        'selfId': '42', 'myKws': [kwrow(42, 1, 'locks')],
        'sharers': [kwrow(10, 900, ''), kwrow(11, 1, 'locks')],
        'idLinks': [],
        'kwMeta': [kwmeta(1, kind='topic'), kwmeta(900, canonical=1)],
        'topN': 5},
    'metadata affinity, single-name PE (r3)': {
        'selfId': '42', 'mode': 'final',
        'myKws': [kwrow(42, 1, 'locks')],
        'sharers': [kwrow(80, 1, 'locks'), kwrow(81, 1, 'locks'),
                    kwrow(82, 1, 'locks')],
        'idLinks': [],
        'candsMeta': [candrow(80, TargetRelease='3.8', Surface='pro',
                              PE='Jane Doe'),
                      candrow(81, DocKind='Test Plan', PE='John Roe')],
        'selfMeta': {'kind': 'User Story', 'surface': 'Pro',
                     'release': '3.8', 'pe': 'Jane Doe', 'dev': '',
                     'modified': ''},
        'topN': 5},
    'pinned recency (r3)': {
        'selfId': '42', 'mode': 'final',
        'myKws': [kwrow(42, 1, 'locks')],
        'sharers': [kwrow(80, 1, 'locks')],
        'idLinks': [],
        'candsMeta': [candrow(80, SourceModified='2025-08-12T00:00:00Z')],
        'selfMeta': {'kind': '', 'surface': '', 'release': '', 'pe': '',
                     'dev': '', 'modified': '2026-08-10T00:00:00Z'},
        'config': {'today': '2026-08-12'}, 'topN': 5},
    'ceiling flags (r3)': {
        'selfId': '42',
        'myKws': [kwrow(42, 1, 'locks'), kwrow(42, 2, 'routes')],
        'sharers': [kwrow(10, 1, 'locks'), kwrow(10, 2, 'routes'),
                    kwrow(11, 1, 'locks')],
        'idLinks': [idlink(11, 42, 'x#1')],
        'config': {'tops': {'myKws': 2, 'sharers': 3, 'links': 1}},
        'topN': 5},
    'HA-9 keyword pile at the cap (r3)': {
        'selfId': '42',
        'myKws': [kwrow(42, i, 'kw%04d' % i) for i in range(1, 1201)],
        'sharers': [kwrow(50, i, 'kw%04d' % i) for i in range(1, 1201)],
        'idLinks': [idlink(51, 42, 'x#1')], 'topN': 5},
}
for label, payload in EQUIV_PAYLOADS.items():
    a = run_payload('rr_old.ts', payload)
    b = run_payload('rr_new.ts', payload)
    check(a == b, f'IDENTICAL related/docIds/count/flags on: {label}')

# ==== new behavior + fixture discrimination ===============================
print('== new behavior (full contract lives in check_related.py) ==')

DOMINANCE = {'selfId': '42', 'myKws': [], 'sharers': [],
             'idLinks': [link(42, 60, 'gantt', strength=20),
                         idlink(61, 42, 'x#1')], 'topN': 5}
b = run_payload('rr_new.ts', DOMINANCE)
check(b['docIds'] == [61, 60] and b['related'][0]['s'] == 1000 and
      b['related'][1]['s'] == 999,
      'v2.1 caps a Strength-20 gantt pile at 999 — the id link stays first')
if not PROMOTED:
    a = run_payload('rr_old.ts', DOMINANCE)
    check(a['docIds'] == [60, 61] and a['related'][0]['s'] == 1200,
          'fixture discriminates: v2.0 non-id edges escaped the soft cap — '
          'a 1200-point gantt pile outranked a true id link')

PE_MULTI = {'selfId': '42', 'mode': 'final',
            'myKws': [kwrow(42, 1, 'locks')],
            'sharers': [kwrow(80, 1, 'locks')],
            'idLinks': [],
            'candsMeta': [candrow(80, PE='Jane Doe; John Roe')],
            'selfMeta': {'kind': '', 'surface': '', 'release': '',
                         'pe': 'jane doe', 'dev': '', 'modified': ''},
            'topN': 5}
b = run_payload('rr_new.ts', PE_MULTI)
check(b['related'][0]['s'] == 1.75 and 'same pe' in b['related'][0]['why'],
      'v2.1 matches a multi-name PE field on name-set overlap (+0.75)')
if not PROMOTED:
    a = run_payload('rr_old.ts', PE_MULTI)
    check(a['related'][0]['s'] == 1,
          'fixture discriminates: v2.0 needed exact string equality — '
          '"Jane Doe; John Roe" never matched "jane doe"')

TITLE = {'selfId': '42', 'mode': 'final',
         'myKws': [kwrow(42, 1, 'locks')],
         'sharers': [kwrow(80, 1, 'locks')],
         'idLinks': [],
         'candsMeta': [candrow(80, Title='Calibration Editing Test Plan V3')],
         'selfMeta': {'kind': '', 'surface': '', 'release': '', 'pe': '',
                      'dev': '', 'modified': '',
                      'title': 'LRS Calibration Editing Workflows'},
         'topN': 5}
b = run_payload('rr_new.ts', TITLE)
check(b['related'][0]['s'] == 1.8 and
      '2 title words: calibration, editing' in b['related'][0]['why'],
      'v2.1 scores shared distinctive title tokens (2 x 0.4, stopwords out)')
if not PROMOTED:
    a = run_payload('rr_old.ts', TITLE)
    check(a['related'][0]['s'] == 1,
          'fixture discriminates: v2.0 ignored selfMeta "title" entirely')

# ==== type-check the staged script at ES2017 ==============================
print('== tsc over the staged script ==')
body = open(os.path.join(STAGE, 'RelatedRank.ts'), encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
open('relatedrank_tsc.ts', 'w', encoding='utf-8').write(body)
r = subprocess.run(['npx', '--yes', '--package', 'typescript', 'tsc', '--noEmit',
                    '--target', 'es2017', 'relatedrank_tsc.ts'],
                   capture_output=True, text=True, encoding='utf-8')
check(r.returncode == 0, 'RelatedRank.ts (staged) type-checks at ES2017'
      + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-2000:]))

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed — DO NOT PASTE')
    sys.exit(1)
print('RESULT: PASS — r4 batch is paste-ready (same signature as v2.0: in the '
      'pending v2.6 window paste v2.1 instead of v2.0; on a tenant already at '
      'v2.0 + flow v2.6 it pastes alone — see designer-edits.md §v2_6 r4 amendment)')
