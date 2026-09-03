"""Gate for ZipTextExtract v2.2 (DL-1 diagram-label collapse).

Single-script change, outside the r2..r6 review-round series (it came
from a corpus observation, not a review round) but built to the same
template, including the r5 genuinely-old-artifact convention: the
equivalence leg's old side is `../patches/ZipTextExtract_v2_1.ts`, so
the leg and the discriminator stay meaningful after promotion instead
of degrading to a self-compare.

DL-1: test-plan slides draw route diagrams as shapes — dashed/hatched
connector lines annotated by dozens of tiny floating text boxes (tick
numbers, route/event ids). Those labels used to flatten into long runs
of one-token lines. v2.2 splices a CLUSTER of label-shaped
non-placeholder shapes out of the slide body and renders one
`[figure: 10–22 · R1 · E1 · Output]` line instead, reusing the docx
`[figure: ...]` convention that has existed since v1.2.

The gate:

  1. re-runs the FULL standing suites over the stage (check_format.py —
     which carries the DL-1 contract as §12 — plus check_related.py and
     check_regex.py via the HARNESS_SCRIPTS override);
  2. asserts EQUIVALENCE against v2.1: full output byte-identical on
     EVERY pre-v2.2 fixture (the collapse may not touch prose, tables,
     headings, notes, code fences, links or docx at all), with
     throw-parity on the malformed archives;
  3. proves `diagram_deck.pptx` DISCRIMINATES: v2.1 emits the labels as
     loose one-token lines and no figure line; v2.2 emits exactly one
     collapsed figure line and no loose label;
  4. type-checks the staged script at ES2017.

The signature is UNCHANGED, so nothing downstream rewires. There is no
tenant paste to fence: since the 2026-08-14 migration the deployed
local sweep runs `scripts/` directly (`pad/runner/ops.mjs`). On a
cloud-flow rollback, `../patches/ZipTextExtract_v2_2.ts` replaces the
pending v2.1 paste and carries CF-1 forward. Rollout over the existing
corpus is `sweep.mjs --reformat` (re-extract + rewrite bodies below the
seam, no AI spend) — see `local/CHANGES.md` v1.22.

Prereqs: make_fixtures.py has run in this directory. Exit nonzero on
any failure.
"""
import json
import os
import shutil
import subprocess
import sys

# Future-proofing (the r2..r6 precedent): once a NEWER change promotes
# over scripts/, this gate's premises break by design — skip.
_zte_head = open('../../scripts/ZipTextExtract.ts', encoding='utf-8').read(200)
if 'ZipTextExtract v2.2' not in _zte_head:
    print('scripts/ has moved past the v2.2 generation — this HISTORICAL '
          'gate is superseded; skipping.')
    sys.exit(0)

PATCH = '../patches/ZipTextExtract_v2_2.ts'
OLD_ZTE = '../patches/ZipTextExtract_v2_1.ts'
STAGE = 'stage_v2_2'

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- stage: every canonical script, the patch overlaid -------------------
os.makedirs(STAGE, exist_ok=True)
for name in os.listdir('../../scripts'):
    if name.endswith('.ts'):
        shutil.copyfile(os.path.join('../../scripts', name),
                        os.path.join(STAGE, name))
shutil.copyfile(PATCH, os.path.join(STAGE, 'ZipTextExtract.ts'))

# ---- regression: the full standing suites over the staged script ---------
env = dict(os.environ, HARNESS_SCRIPTS=STAGE)
for suite in ('check_format.py', 'check_related.py', 'check_regex.py'):
    r = subprocess.run([sys.executable, suite], env=env,
                       capture_output=True, text=True, encoding='utf-8')
    check(r.returncode == 0, f'regression: {suite} fully green over the staged script'
          + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-3000:]))

# ==== equivalence: v2.1 vs staged v2.2 ====================================
print('== ZTE equivalence: old vs staged on every pre-v2.2 fixture ==')
subprocess.run([sys.executable, 'wrap.py', OLD_ZTE, 'zte_v22_old.ts'], check=True)
subprocess.run([sys.executable, 'wrap.py', os.path.join(STAGE, 'ZipTextExtract.ts'),
                'zte_v22_new.ts'], check=True)


def run_zte(runner, fixture, prefix):
    return subprocess.run(['node', '--experimental-strip-types', runner,
                           fixture, prefix],
                          capture_output=True, text=True, encoding='utf-8')


# every fixture that predates diagram_deck: the collapse fires only on a
# cluster of label-shaped floating shapes, which none of these contain
ZTE_FIXTURES = ['real_deck.pptx', 'real_doc.docx', 'edge_deck.pptx',
                'noprops_deck.pptx', 'reordered_deck.pptx', 'merged_deck.pptx',
                'bigimg_deck.pptx', 'relswap_deck.pptx', 'edgecase2_deck.pptx',
                'hashheading_deck.pptx', 'manytables.docx', 'code_deck.pptx',
                'prose_deck.pptx']
for f in ZTE_FIXTURES:
    a = run_zte('zte_v22_old.ts', f + '.b64', 'media/docX_')
    b = run_zte('zte_v22_new.ts', f + '.b64', 'media/docX_')
    # compare the result object only — the wrap.py runner adds a timing
    # field to stdout that never reproduces
    check(a.returncode == 0 and b.returncode == 0 and
          json.loads(a.stdout)['out'] == json.loads(b.stdout)['out'],
          f'ZTE IDENTICAL full output on: {f}')
for f in ('encrypted_deck.pptx', 'truncstored.docx', 'storednlen.docx'):
    a = run_zte('zte_v22_old.ts', f + '.b64', '')
    b = run_zte('zte_v22_new.ts', f + '.b64', '')
    check(a.returncode != 0 and b.returncode != 0,
          f'ZTE throw-parity on: {f}')

# ==== new behavior + fixture discrimination ===============================
print('== new behavior (the full contract lives in check_format.py §12) ==')
a = run_zte('zte_v22_old.ts', 'diagram_deck.pptx.b64', '')
b = run_zte('zte_v22_new.ts', 'diagram_deck.pptx.b64', '')
old_lines = [ln.rstrip() for ln in json.loads(a.stdout)['out']['text'].split('\n')]
new_lines = [ln.rstrip() for ln in json.loads(b.stdout)['out']['text'].split('\n')]
old_loose = [ln for ln in old_lines if ln in ('11', '12', 'R1', 'E1', 'Output')]
new_loose = [ln for ln in new_lines if ln in ('11', '12', 'R1', 'E1', 'Output')]
check(not any(ln.startswith('[figure:') for ln in old_lines) and len(old_loose) >= 5,
      f'fixture discriminates: v2.1 emits the labels loose, no figure line '
      f'({len(old_loose)} loose label lines)')
check([ln for ln in new_lines if ln.startswith('[figure:')] ==
      ['[figure: 10–15 · R1 · E1 · Output]'] and not new_loose,
      'v2.2 emits one collapsed figure line and no loose label')
# the collapse is per slide and leaves sub-threshold slides alone
new_text = json.loads(b.stdout)['out']['text']
s2 = new_text[new_text.index('## Slide 2'):]
check('[figure:' not in s2 and 'A1' in s2 and 'B2' in s2 and 'C3' in s2,
      'v2.2 leaves a sub-threshold slide (3 labels) untouched')

# ---- type-check the staged script at ES2017 ------------------------------
print('== tsc over the staged script ==')
body = open(os.path.join(STAGE, 'ZipTextExtract.ts'), encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
open('ziptextextract_v2_2_tsc.ts', 'w', encoding='utf-8').write(body)
r = subprocess.run(['npx', '--yes', '--package', 'typescript', 'tsc', '--noEmit',
                    '--target', 'es2017', 'ziptextextract_v2_2_tsc.ts'],
                   capture_output=True, text=True, encoding='utf-8')
check(r.returncode == 0, 'ZipTextExtract.ts (staged) type-checks at ES2017'
      + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-2000:]))

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed — DO NOT PROMOTE')
    sys.exit(1)
print('RESULT: PASS — ZipTextExtract v2.2 is promotion-ready (unchanged '
      'signature; no tenant paste — the deployed local sweep runs scripts/ '
      'directly; roll the corpus forward with sweep.mjs --reformat)')
