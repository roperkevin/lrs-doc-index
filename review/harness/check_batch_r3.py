"""Gate for the r3 batch: RelatedRank v2.0 (related-ranking overhaul).

Single-patch batch. Stages every canonical script from scripts/ and
overlays —

  ../patches/RelatedRank_v2_0.ts

— then:

  1. re-runs the FULL standing suites over the stage
     (check_format.py + check_related.py + check_regex.py via the
     HARNESS_SCRIPTS override; check_related.py already carries the
     v2.0 contract — gate and suite land together, as in r2);
  2. asserts LEGACY EQUIVALENCE: on legacy-shaped payloads (id-only
     links, no kwMeta/candsMeta/selfMeta, empty config) v2.0's
     related/docIds/count must equal v1.3's byte-for-byte, and the
     new `flags` field must be '' — the overhaul may not move a
     single legacy score (unknown keyword kind reads as topic x1.0,
     absent metadata contributes 0, default edge.id is the old 1000);
  3. proves the new-behavior fixtures DISCRIMINATE: v1.3 scores a
     gantt row as if it were an id link (it never read LinkType —
     the old flow filter did) and is blind to candidate metadata;
  4. type-checks the staged script at ES2017.

The changed signature means the tenant paste and the v2.6 flow
designer edits are ONE maintenance window — pasting v2.0 under the
v2.5 flow (or v2.6 edits over the v1.3 script) breaks the related
branch. See review/patches/designer-edits.md §v2_6.

Post-promotion this gate re-verifies the promotion: the equivalence
halves self-compare (old = scripts/ = the promoted patch, driven
through the new signature) and the discriminator assertions — which
need the genuinely-old v1.3 — are skipped via the PROMOTED guard.

r4 note (2026-08-12): RelatedRank has moved past v2.0 (v2.1, the r4
batch — check_batch_r4.py), so this gate is HISTORICAL and now skips
via the guard below, exactly as check_batch_r2.py did when r3
promoted over its generation.

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

# r4 (2026-08-12): once a NEWER batch is promoted over scripts/, this
# gate's premises break by design — the staged v2.0 patch no longer
# equals the shipped script (RelatedRank moved to v2.1), and the
# standing suites carry folded v2.1 assertions the r3 generation
# predates. Skip gracefully (the check_batch.py / check_batch_r2.py
# precedent); to re-run the r3 gate for the record, check out the
# r3-promotion-era commit from git history.
_rr_head = open('../../scripts/RelatedRank.ts', encoding='utf-8').read(200)
if 'RelatedRank v2.0' not in _rr_head and 'RelatedRank v1.3' not in _rr_head:
    print('scripts/ has moved past the r3 generation — this HISTORICAL '
          'gate is superseded (see the r4 note in its docstring); skipping.')
    sys.exit(0)

PATCHES = {
    'RelatedRank.ts': '../patches/RelatedRank_v2_0.ts',
}
STAGE = 'stage_r3'
OLD = '../../scripts'
# post-promotion, scripts/RelatedRank.ts IS v2.0: the old half speaks
# the new signature, and v1.3-only discriminator assertions skip
PROMOTED = 'RelatedRank v2.0' in open(f'{OLD}/RelatedRank.ts',
                                      encoding='utf-8').read(200)
if PROMOTED:
    print('scripts/ carries the promoted r3 batch — equivalence halves '
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

# ---- wrap old/new runners ------------------------------------------------
RR_APPENDIX_V13 = '''
// ---- harness appendix (v1.3 signature) ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, p.selfId, JSON.stringify(p.myKws),
  JSON.stringify(p.sharers), JSON.stringify(p.idLinks), p.topN)));
'''
RR_APPENDIX_V20 = '''
// ---- harness appendix (v2.0 signature, legacy-shaped inputs) ----
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
for tag, root, appendix in (
        ('old', OLD, RR_APPENDIX_V20 if PROMOTED else RR_APPENDIX_V13),
        ('new', STAGE, RR_APPENDIX_V20)):
    body = open(f'{root}/RelatedRank.ts', encoding='utf-8').read().replace(
        'workbook: ExcelScript.Workbook', 'workbook: unknown')
    open(f'rr_{tag}.ts', 'w', encoding='utf-8').write(body + appendix)


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


def legacy_view(result):
    """The v1.3-shaped projection of a RankResult."""
    return {k: result[k] for k in ('related', 'docIds', 'count') if k in result}


# ==== equivalence: v1.3 vs v2.0 on legacy-shaped payloads =================
print('== equivalence: old vs staged on legacy payloads ==')

KW8 = [(1, 'locks'), (2, 'routes'), (3, 'conflict prevention'),
       (4, 'route editing'), (5, 'events'), (6, 'calibration'),
       (7, 'gaps'), (8, 'measures')]
LEGACY_PAYLOADS = {
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
}
for label, payload in LEGACY_PAYLOADS.items():
    a = run_payload('rr_old.ts', payload)
    b = run_payload('rr_new.ts', payload)
    check(legacy_view(a) == legacy_view(b),
          f'IDENTICAL related/docIds/count on: {label}')
    check(b.get('flags') == '', f'flags stays empty on: {label}')

# ==== new behavior + fixture discrimination ===============================
print('== new behavior (full contract lives in check_related.py) ==')

GANTT = {'selfId': '42', 'myKws': [], 'sharers': [],
         'idLinks': [{'DocA': {'Id': 42}, 'DocB': {'Id': 60},
                      'SharedValues': 'g1;g2;g3', 'LinkType': 'gantt'}],
         'topN': 5}
b = run_payload('rr_new.ts', GANTT)
check(b['count'] == 1 and b['related'][0]['s'] == 180,
      'v2.0 scores a gantt edge at 60 x 3 shared values = 180')
if not PROMOTED:
    a = run_payload('rr_old.ts', GANTT)
    check(a['count'] == 1 and a['related'][0]['s'] == 3000,
          'fixture discriminates: v1.3 never read LinkType — a gantt row '
          'reaching it scored its shared values as 1000-point id links')

META = {'selfId': '42', 'mode': 'final',
        'myKws': [kwrow(42, 1, 'locks')],
        'sharers': [kwrow(80, 1, 'locks')],
        'idLinks': [],
        'candsMeta': [{'ID': 80, 'TargetRelease': '3.8'}],
        'selfMeta': {'kind': '', 'surface': '', 'release': '3.8', 'pe': '',
                     'dev': '', 'modified': ''},
        'topN': 5}
b = run_payload('rr_new.ts', META)
check(b['related'][0]['s'] == 2 and 'release 3.8' in b['related'][0]['why'],
      'v2.0 adds the release-affinity bonus (1 + 1.0)')
if not PROMOTED:
    a = run_payload('rr_old.ts', META)
    check(a['related'][0]['s'] == 1,
          'fixture discriminates: v1.3 is blind to candidate metadata')

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
print('RESULT: PASS — r3 batch is paste-ready (paste RelatedRank v2.0 and apply '
      'the v2.6 designer edits in ONE maintenance window; see designer-edits.md §v2_6)')
