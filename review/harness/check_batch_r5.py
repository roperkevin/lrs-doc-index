"""Gate for the r5 batch: SidecarPatch v1.5 (details-frame support).

Single-patch batch, paired with the flow v2.7 / PromptVersion v1.9
sidecar format (H1 + info table head, yaml block collapsed inside
<details><summary>Metadata</summary>). Stages every canonical script
from scripts/ and overlays —

  ../patches/SidecarPatch_v1_5.ts

— then:

  1. re-runs the FULL standing suites over the stage
     (check_format.py + check_related.py + check_regex.py via the
     HARNESS_SCRIPTS override; check_related.py already carries the
     v1.5 contract — gate and suite land together, as in r2/r3/r4);
  2. asserts V1.4 EQUIVALENCE: on every fenced- and dashed-frame
     payload (set, merge, empty set, malformed markers, marker-less
     legacy, non-frontmatter, BOM/CRLF, block-sequence related:) the
     staged v1.5's full result — content / changed / note per file —
     must equal v1.4's byte-for-byte. The old side is the genuinely
     old ../patches/SidecarPatch_v1_4.ts artifact, so this leg stays
     meaningful after promotion (no r4-style self-compare);
  3. proves the details-frame fixture DISCRIMINATES: v1.4 returns
     not-frontmatter/unchanged on a details-frame sidecar where v1.5
     patches it (head preserved byte-for-byte);
  4. type-checks the staged script at ES2017.

The signature is UNCHANGED (7 params, same names), so the paste needs
no flow rewiring. PASTE ORDER MATTERS THE OTHER WAY AROUND: v1.5 is a
strict superset of v1.4, safe to paste BEFORE the flow v2.7 designer
edits go live (even days early) — but flow v2.7 live with v1.4 still
pasted means every new-format sidecar silently no-ops in the patcher.

Prereqs: make_fixtures.py has run in this directory (the standing
suites need the planted fixtures; the SidecarPatch cases themselves
are inline payloads). Exit nonzero on any failure — any FAIL = do
not paste.
"""
import json
import os
import shutil
import subprocess
import sys

# Future-proofing (the r2/r3/r4 precedent): once a NEWER batch promotes
# over scripts/, this gate's premises break by design — skip.
_scp_head = open('../../scripts/SidecarPatch.ts', encoding='utf-8').read(200)
if 'SidecarPatch v1.5' not in _scp_head and 'SidecarPatch v1.4' not in _scp_head:
    print('scripts/ has moved past the r5 generation — this HISTORICAL '
          'gate is superseded; skipping.')
    sys.exit(0)

PATCHES = {
    'SidecarPatch.ts': '../patches/SidecarPatch_v1_5.ts',
}
STAGE = 'stage_r5'
OLD_PATCH = '../patches/SidecarPatch_v1_4.ts'

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- stage: every canonical script, patch overlaid -----------------------
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

# ---- wrap old/new runners (same 7-param signature both sides) ------------
SCP_APPENDIX = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, JSON.stringify(p.files), p.selfId,
  JSON.stringify(p.ranked), JSON.stringify(p.docsMeta), JSON.stringify(p.selfMeta), p.topN)));
'''
for tag, src in (('old', OLD_PATCH), ('new', os.path.join(STAGE, 'SidecarPatch.ts'))):
    body = open(src, encoding='utf-8').read().replace(
        'workbook: ExcelScript.Workbook', 'workbook: unknown')
    open(f'scp_{tag}.ts', 'w', encoding='utf-8').write(body + SCP_APPENDIX)


def run_payload(runner, payload):
    path = runner.replace('.ts', '_payload.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(payload, f)
    out = subprocess.run(['node', '--experimental-strip-types', runner, path],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f'{runner} failed:\n{out.stderr[:2000]}')
    return json.loads(out.stdout)


# ---- fixtures (mirrors check_related.py's sidecar builder) ---------------
BEGIN = '<!-- related:begin -->'
END = '<!-- related:end -->'
DETAILS_OPEN = '<details><summary>Metadata</summary>\n\n```yaml\n'
DETAILS_CLOSE = '\n```\n\n</details>\n'


def sidecar(related_line='related: []', region='_None yet._', markers=True,
            frame='fence'):
    rel_section = (f'## Related documents\n\n{BEGIN}\n{region}\n{END}\n\n'
                   if markers else '')
    fm = f'''title: "Conflict \\"Prevention\\": Acquire Locks for New Routes"
doc_id: 42
keywords: ["locks", "routes"]
tools: []
{related_line}'''
    tail = f'''## Summary

Explores lock acquisition.

{rel_section}---

## Slide 3 — Locking new routes
- decoy body text below must never change
related: [decoy]

---

### Notes
stray seams and related-lookalikes everywhere
'''
    if frame == 'details':
        return f'''# Conflict "Prevention": Acquire Locks for New Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Issue** | [ArcGISPro/x#101](https://devtopia.esri.com/ArcGISPro/x/issues/101) |
| **Extracted** | 2026-08-13 · lane `xmlstrip` |

{DETAILS_OPEN}{fm}{DETAILS_CLOSE}
{tail}'''
    fm_open, fm_close = ('```yaml', '```') if frame == 'fence' else ('---', '---')
    return f'''{fm_open}
{fm}
{fm_close}

# Conflict "Prevention": Acquire Locks for New Routes

{tail}'''


RANKED = [{'doc': 17, 's': 1003, 'why': 'shared issue a#1 · 3 shared keywords: locks, m, routes'},
          {'doc': 23, 's': 2, 'why': '2 shared keywords: locks, routes'},
          {'doc': 9, 's': 1, 'why': '1 shared keyword: locks'}]
META = [{'ID': 17, 'Title': 'Lock Acquisition Test Plan',
         'TextFileUrl': 'https://x/sites/s/Document Index Texts/lock-acquisition-test-plan__doc17.md'},
        {'ID': 23, 'Title': 'Route Editing Spike',
         'TextFileUrl': 'https://x/sites/s/Document Index Texts/route-editing-spike__doc23.md'},
        {'ID': 9, 'Title': 'Locks Overview',
         'TextFileUrl': 'https://x/sites/s/Document Index Texts/locks-overview__doc9.md'}]
SELF_META = {'doc': 42, 'title': 'Conflict "Prevention": Acquire Locks for New Routes',
             'url': 'https://x/sites/s/Document Index Texts/conflict-prevention__doc42.md',
             'file': 'conflict-prevention__doc42.md'}


def payload(files, ranked=RANKED):
    return {'files': files, 'selfId': '42', 'ranked': ranked,
            'docsMeta': META, 'selfMeta': SELF_META, 'topN': 5}


# ==== equivalence: v1.4 vs staged v1.5 on legacy-frame payloads ===========
print('== equivalence: old vs staged on fenced/dashed payloads ==')

neighbor_line = 'related: [{"doc":99,"file":"other__doc99.md","s":1}]'
neighbor_region = '- [Other](<https://x/o.md>) — 1 shared keyword: locks <!-- rel:99 -->'
legacy_dash = sidecar(frame='dash')
markerless = '\n'.join(
    ln for ln in legacy_dash.replace(
        f'## Related documents\n\n{BEGIN}\n_None yet._\n{END}\n\n', '').split('\n')
    if not ln.startswith('related: ['))

EQUIV_PAYLOADS = {
    'set mode, fenced frame': payload(
        [{'doc': 42, 'name': 'self.md', 'content': sidecar()}]),
    'set mode, dashed frame': payload(
        [{'doc': 42, 'name': 'self.md', 'content': legacy_dash}]),
    'empty set mode': payload(
        [{'doc': 42, 'name': 'self.md', 'content': sidecar()}], ranked=[]),
    'merge, fenced neighbor': payload(
        [{'doc': 17, 'name': 'n.md',
          'content': sidecar(related_line=neighbor_line, region=neighbor_region)}]),
    'merge, dashed neighbor': payload(
        [{'doc': 17, 'name': 'n.md',
          'content': sidecar(related_line=neighbor_line, region=neighbor_region,
                             frame='dash')}]),
    'marker-less legacy sidecar (fallback synthesis)': payload(
        [{'doc': 42, 'name': 'self.md', 'content': markerless}]),
    'malformed markers': payload(
        [{'doc': 42, 'name': 'self.md', 'content': sidecar().replace(END, '')}]),
    'not-frontmatter': payload(
        [{'doc': 42, 'name': 'x.md', 'content': 'no frontmatter here\r\nat all'}]),
    'BOM+CRLF fenced sidecar': payload(
        [{'doc': 42, 'name': 's.md',
          'content': '﻿' + sidecar().replace('\n', '\r\n')}]),
    'block-sequence related form': payload(
        [{'doc': 17, 'name': 'n.md', 'content': sidecar(
            related_line='related:\n  - doc: 9\n    file: x.md\n    s: 1')}]),
    'mixed legacy batch with folders': payload(
        [{'doc': 42, 'name': 'self.md', 'folder': '/LRS Doc Index/User Stories',
          'content': sidecar()},
         {'doc': 17, 'name': 'n.md', 'folder': '/LRS Doc Index/Test Plans',
          'content': sidecar(related_line=neighbor_line, region=neighbor_region,
                             frame='dash')}]),
}
for label, p in EQUIV_PAYLOADS.items():
    a = run_payload('scp_old.ts', p)
    b = run_payload('scp_new.ts', p)
    check(a == b, f'IDENTICAL content/changed/note on: {label}')

# ==== new behavior + fixture discrimination ===============================
print('== new behavior (full contract lives in check_related.py) ==')

det = sidecar(frame='details')
DET_PAYLOAD = payload([{'doc': 42, 'name': 'self.md', 'content': det}])
b = run_payload('scp_new.ts', DET_PAYLOAD)['files'][0]
check(b['changed'] and b['note'] == 'set' and
      b['content'].startswith('# Conflict "Prevention"') and
      '<!-- rel:17 -->' in b['content'] and
      b['content'][:b['content'].index('<details>')] ==
      det[:det.index('<details>')],
      'v1.5 patches the details frame; H1 + info table head byte-preserved')
a = run_payload('scp_old.ts', DET_PAYLOAD)['files'][0]
check(not a['changed'] and a['note'] == 'not-frontmatter' and
      a['content'] == det,
      'fixture discriminates: v1.4 no-ops on the details frame '
      '(not-frontmatter, byte-identical)')

# ---- type-check the staged script at ES2017 ==============================
print('== tsc over the staged script ==')
body = open(os.path.join(STAGE, 'SidecarPatch.ts'), encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
open('sidecarpatch_tsc.ts', 'w', encoding='utf-8').write(body)
r = subprocess.run(['npx', '--yes', '--package', 'typescript', 'tsc', '--noEmit',
                    '--target', 'es2017', 'sidecarpatch_tsc.ts'],
                   capture_output=True, text=True, encoding='utf-8')
check(r.returncode == 0, 'SidecarPatch.ts (staged) type-checks at ES2017'
      + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-2000:]))

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed — DO NOT PASTE')
    sys.exit(1)
print('RESULT: PASS — r5 batch is paste-ready (same 7-param signature; v1.5 is '
      'a strict superset of v1.4 — paste it BEFORE the flow v2.7 designer '
      'edits go live, see designer-edits.md §v2_7)')
