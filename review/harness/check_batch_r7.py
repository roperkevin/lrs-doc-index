"""Gate for the r7 batch: ZipTextExtract v2.2 (MG-1 merged media).

Single-patch batch, paired with the flow v2.9 performance release
(`flow/v2_9/CHANGES.md`): ZipTextExtract absorbs the retired
MediaExtract — the optional fourth parameter `wantMedia` makes the
SC-4 selection walk also inflate and return the selected rasters
(`images` / `skippedMedia` / `imageCount`), so the flow's second
RunScript call and its duplicate base64 upload disappear.

Stages every canonical script from scripts/ and overlays

  ../patches/ZipTextExtract_v2_2.ts

then:

  1. re-runs the FULL standing suites over the stage (check_format.py
     + check_related.py + check_regex.py + check_media.py via the
     HARNESS_SCRIPTS override — check_media.py carries the r7 media
     contracts including the response-budget leg; gate and suite land
     together, as in r2..r6);
  2. asserts EQUIVALENCE against the genuinely-old artifact
     (../patches/ZipTextExtract_v2_1.ts): with wantMedia absent, all
     eight v2.1 fields byte-identical on EVERY fixture, the new fields
     inert (images [] / imageCount 0), and throw-parity on the
     encrypted / truncated / NLEN fixtures;
  3. asserts the merged media path REPRODUCES MediaExtract v1.3
     (scripts/MediaExtract.ts, kept for history): per-image name/b64
     byte-identical, skippedMedia == skipped, imageCount == count on
     every image-bearing fixture, and throw-parity on the lying-CD /
     media-NLEN / encrypted-media fixtures;
  4. proves the wantMedia flag DISCRIMINATES: v2.1 returns no images
     field at all, staged v2.2 returns the populated array;
  5. type-checks the staged script at ES2017.

The signature change is ADDITIVE (optional param, gained fields), so
the paste is safe-early under any flow version: v2.7/v2.8 never pass
wantMedia and see byte-identical output. Paste ORDER for the v2.9
window: this script FIRST, then import flow v2.9 (which deletes the
Extract_media_* actions) — see designer-edits.md §v2_9. MediaExtract
needs no paste ever again; its pending v1.3 paste is mooted.

Prereqs: make_fixtures.py has run in this directory. Exit nonzero on
any failure — any FAIL = do not paste.
"""
import base64
import json
import os
import shutil
import subprocess
import sys
import zipfile

# Future-proofing (the r2..r6 precedent): once a NEWER batch promotes
# over scripts/, this gate's premises break by design — skip.
_zte_head = open('../../scripts/ZipTextExtract.ts', encoding='utf-8').read(200)
if 'ZipTextExtract v2.2' not in _zte_head:
    print('scripts/ has moved past the r7 generation — this HISTORICAL '
          'gate is superseded; skipping.')
    sys.exit(0)

PATCHES = {
    'ZipTextExtract.ts': '../patches/ZipTextExtract_v2_2.ts',
}
STAGE = 'stage_r7'
OLD_ZTE = '../patches/ZipTextExtract_v2_1.ts'
MEDIA_EXTRACT = '../../scripts/MediaExtract.ts'  # v1.3, retired with r7

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- stage: every canonical script, patch overlaid ----------------------
os.makedirs(STAGE, exist_ok=True)
for name in os.listdir('../../scripts'):
    if name.endswith('.ts'):
        shutil.copyfile(os.path.join('../../scripts', name),
                        os.path.join(STAGE, name))
for canon, src in PATCHES.items():
    shutil.copyfile(src, os.path.join(STAGE, canon))

# ---- regression: the full standing suites over the staged batch ----------
env = dict(os.environ, HARNESS_SCRIPTS=STAGE)
for suite in ('check_format.py', 'check_related.py', 'check_regex.py',
              'check_media.py'):
    r = subprocess.run([sys.executable, suite], env=env,
                       capture_output=True, text=True, encoding='utf-8')
    check(r.returncode == 0, f'regression: {suite} fully green over the staged batch'
          + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-3000:]))

# ==== equivalence: v2.1 vs staged v2.2, wantMedia absent ==================
print('== ZTE equivalence: old vs staged on every fixture, no wantMedia ==')
subprocess.run([sys.executable, 'wrap.py', OLD_ZTE, 'zte_r7_old.ts'], check=True)
subprocess.run([sys.executable, 'wrap.py', os.path.join(STAGE, 'ZipTextExtract.ts'),
                'zte_r7_new.ts'], check=True)


def run_node(runner, *args):
    return subprocess.run(['node', '--experimental-strip-types', runner, *args],
                          capture_output=True, text=True, encoding='utf-8')


V21_FIELDS = ('text', 'rels', 'parts', 'kind', 'media', 'author',
              'lastEditedBy', 'lastEdited')
ZTE_FIXTURES = ['real_deck.pptx', 'real_doc.docx', 'edge_deck.pptx',
                'noprops_deck.pptx', 'reordered_deck.pptx', 'merged_deck.pptx',
                'bigimg_deck.pptx', 'relswap_deck.pptx', 'edgecase2_deck.pptx',
                'hashheading_deck.pptx', 'manytables.docx', 'code_deck.pptx',
                'prose_deck.pptx', 'lyingcd_deck.pptx']
for f in ZTE_FIXTURES:
    a = run_node('zte_r7_old.ts', f + '.b64', 'media/docX_')
    b = run_node('zte_r7_new.ts', f + '.b64', 'media/docX_')
    ok = a.returncode == 0 and b.returncode == 0
    if ok:
        ao, bo = json.loads(a.stdout)['out'], json.loads(b.stdout)['out']
        ok = (all(ao[k] == bo[k] for k in V21_FIELDS) and
              bo['images'] == [] and bo['imageCount'] == 0)
    check(ok, f'ZTE IDENTICAL v2.1 fields + inert media fields on: {f}')
for f in ('encrypted_deck.pptx', 'truncstored.docx', 'storednlen.docx'):
    a = run_node('zte_r7_old.ts', f + '.b64', '')
    b = run_node('zte_r7_new.ts', f + '.b64', '')
    check(a.returncode != 0 and b.returncode != 0, f'ZTE throw-parity on: {f}')

# ==== media reproduction: staged v2.2 wantMedia vs MediaExtract v1.3 ======
print('== merged media path vs the retired MediaExtract ==')
_me_head = open(MEDIA_EXTRACT, encoding='utf-8').read(400)
check('MediaExtract v1.3' in _me_head,
      'comparison side is MediaExtract v1.3 (the in-repo artifact)')
subprocess.run([sys.executable, 'wrap.py', MEDIA_EXTRACT, 'me_r7.ts'], check=True)

MEDIA_SRC = open(os.path.join(STAGE, 'ZipTextExtract.ts'), encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
MEDIA_SRC += '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const argv = (globalThis as {process?: {argv: string[]}}).process!.argv;
const b64 = fs.readFileSync(argv[2], 'utf8');
console.log(JSON.stringify({out: main(null as unknown, b64, argv[3] || '', true)}));
'''
open('zte_r7_media.ts', 'w', encoding='utf-8').write(MEDIA_SRC)

for f in ('bigimg_deck.pptx', 'relswap_deck.pptx', 'real_deck.pptx'):
    a = run_node('me_r7.ts', f + '.b64')
    b = run_node('zte_r7_media.ts', f + '.b64', 'media/docX_')
    ok = a.returncode == 0 and b.returncode == 0
    if ok:
        me, zt = json.loads(a.stdout)['out'], json.loads(b.stdout)['out']
        ok = (zt['images'] == me['images'] and
              zt['skippedMedia'] == me['skipped'] and
              zt['imageCount'] == me['count'])
    check(ok, f'media IDENTICAL to MediaExtract v1.3 on: {f}')
for f, msg in (('lyingcd_deck.pptx', 'size mismatch'),
               ('storednlen_img.pptx', 'NLEN mismatch'),
               ('encrypted_img_deck.pptx', 'encrypted')):
    a = run_node('me_r7.ts', f + '.b64')
    b = run_node('zte_r7_media.ts', f + '.b64', '')
    check(a.returncode != 0 and b.returncode != 0 and
          msg in a.stderr and msg in b.stderr,
          f'media throw-parity ({msg}) on: {f}')

# ==== the flag discriminates ==============================================
a = run_node('zte_r7_old.ts', 'bigimg_deck.pptx.b64', 'media/docX_')
b = run_node('zte_r7_media.ts', 'bigimg_deck.pptx.b64', 'media/docX_')
old_out = json.loads(a.stdout)['out']
new_out = json.loads(b.stdout)['out']
check('images' not in old_out and len(new_out['images']) == 1,
      'fixture discriminates: v2.1 has no images field; v2.2 wantMedia returns them')

# ---- type-check the staged script at ES2017 ==============================
print('== tsc over the staged script ==')
for canon in PATCHES:
    body = open(os.path.join(STAGE, canon), encoding='utf-8').read().replace(
        'workbook: ExcelScript.Workbook', 'workbook: unknown')
    tsc_name = canon.replace('.ts', '_r7_tsc.ts').lower()
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
print('RESULT: PASS — r7 batch is paste-ready (additive signature: '
      'ZipTextExtract v2.2 pastes safely ANY time; the flow v2.9 import '
      'then activates the merged media path — see designer-edits.md §v2_9)')
