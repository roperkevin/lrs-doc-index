"""Gate for the r7 batch: HtmlToText v1.0 (NEW script — the online-doc
fetch/cache lane), paired with the flow v2.9 / PromptVersion v2.1
sidecar format (`online_docs:` yaml line + `## Online references`
region) and the OnlineDocFetch flow (`onlinedocs/`).

An unusual batch shape, stated plainly: r7 ADDS one script and
CHANGES none. There is therefore no old-vs-new script equivalence to
prove — the gate's equivalence seat is held by the format side
instead: **SidecarPatch stays at v1.6, untouched, and must
byte-preserve the new v2.9 sidecar region** (the `online_docs:` yaml
line and the `<!-- onlinedocs:begin/end -->` block are outside its
two patch regions by design — flow v2.9 recomputes them at
`Sidecar_header` compose time, so no script may ever rewrite them).

Stages every canonical script from scripts/ and overlays —

  ../patches/HtmlToText_v1_0.ts

— then:

  1. re-runs the FULL standing suites over the stage
     (check_htmltotext.py + check_format.py + check_related.py +
     check_regex.py via the HARNESS_SCRIPTS override; check_related
     and render_sample already carry the v2.9 region contracts —
     gate and suites land together, as in r2..r6);
  2. asserts the promotion identity: the staged patch is
     byte-identical to scripts/HtmlToText.ts (r7 promoted in the
     same change — the patch is the audit copy);
  3. proves the SidecarPatch pass-through directly (belt to
     check_related's suspenders): set mode over a v2.9-format
     sidecar leaves the `online_docs:` yaml line and the onlinedocs
     region byte-identical while patching the related region, and
     patch(patch(x)) == patch(x) still holds on that format;
  4. type-checks the staged script at ES2017.

HtmlToText has no flow consumer until OnlineDocFetch is built
(`onlinedocs/OnlineDocs_Setup.md`), so the paste is standalone-safe
at any time; the v2.9 designer edits and the TestPlanGen v2.14
window sequence independently (designer-edits.md §v2_9 and
§testplangen-v2_14 — the empty-lane degrade makes them commute).

Prereqs: make_fixtures.py has run in this directory. Exit nonzero on
any failure — any FAIL = do not paste.
"""
import json
import os
import shutil
import subprocess
import sys

# Future-proofing (the r2..r6 precedent): once a NEWER batch promotes
# over scripts/, this gate's premises break by design — skip.
_htt_head = open('../../scripts/HtmlToText.ts', encoding='utf-8').read(200)
if 'HtmlToText v1.0' not in _htt_head:
    print('scripts/ has moved past the r7 generation — this HISTORICAL '
          'gate is superseded; skipping.')
    sys.exit(0)

PATCHES = {
    'HtmlToText.ts': '../patches/HtmlToText_v1_0.ts',
}
STAGE = 'stage_r7'

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
for suite in ('check_htmltotext.py', 'check_format.py', 'check_related.py',
              'check_regex.py'):
    r = subprocess.run([sys.executable, suite], env=env,
                       capture_output=True, text=True, encoding='utf-8')
    check(r.returncode == 0, f'regression: {suite} fully green over the staged batch'
          + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-3000:]))

# ---- promotion identity: patch == scripts/ (r7 promoted same-change) -----
patch_body = open(PATCHES['HtmlToText.ts'], encoding='utf-8').read()
canon_body = open('../../scripts/HtmlToText.ts', encoding='utf-8').read()
check(patch_body == canon_body,
      'promotion identity: HtmlToText_v1_0.ts byte-identical to scripts/HtmlToText.ts')

# ==== SidecarPatch v1.6 pass-through on the v2.9 format ===================
print('== SidecarPatch (UNCHANGED v1.6) byte-preserves the v2.9 additions ==')
SCP_APPENDIX = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, JSON.stringify(p.files), p.selfId,
  JSON.stringify(p.ranked), JSON.stringify(p.docsMeta), JSON.stringify(p.selfMeta), p.topN)));
'''
scp_body = open(os.path.join(STAGE, 'SidecarPatch.ts'), encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
open('scp_r7.ts', 'w', encoding='utf-8').write(scp_body + SCP_APPENDIX)


def run_payload(payload):
    with open('scp_r7_payload.json', 'w', encoding='utf-8') as f:
        json.dump(payload, f)
    out = subprocess.run(['node', '--experimental-strip-types', 'scp_r7.ts',
                          'scp_r7_payload.json'],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f'scp_r7.ts failed:\n{out.stderr[:2000]}')
    return json.loads(out.stdout)


OD_YAML = ('online_docs: [{"od":12,"u":"https://pro.arcgis.com/x/conflict-prevention.htm",'
           '"t":"Conflict prevention"}]')
OD_REGION = '''## Online references

<!-- onlinedocs:begin -->
- [Conflict prevention](<https://pro.arcgis.com/x/conflict-prevention.htm>) — Locks explained. <!-- od:12 -->
<!-- onlinedocs:end -->'''
V29_SIDECAR = f'''# Conflict "Prevention": Acquire Locks for New Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |

<!-- metadata
```yaml
title: "Conflict \\"Prevention\\": Acquire Locks for New Routes"
doc_id: 42
prompt_version: "v2.1"
keywords: ["locks", "routes"]
tools: []
related: []
{OD_YAML}
```
-->

## Summary

Explores lock acquisition.

## Related documents

<!-- related:begin -->
_None yet._
<!-- related:end -->

{OD_REGION}

---

## Slide 3 — Locking new routes
'''
PAYLOAD = {'files': [{'doc': 42, 'name': 'self.md', 'content': V29_SIDECAR}],
           'selfId': '42',
           'ranked': [{'doc': 17, 's': 1003, 'why': 'shared issue a#1'}],
           'docsMeta': [{'ID': 17, 'Title': 'Lock Acquisition Test Plan',
                         'TextFileUrl': 'https://x/s/Test Plans/lock-acquisition-test-plan__doc17.md'}],
           'selfMeta': {'doc': 42,
                        'title': 'Conflict "Prevention": Acquire Locks for New Routes',
                        'url': 'https://x/s/User Stories/conflict-prevention__doc42.md',
                        'file': 'conflict-prevention__doc42.md'},
           'topN': 5}

first = run_payload(PAYLOAD)['files'][0]
check(first['changed'] and first['note'] == 'set' and '<!-- rel:17 -->' in first['content'],
      'set mode patches the related region on the v2.9 format')
check(OD_YAML in first['content'],
      'online_docs: yaml line byte-preserved through set mode')
check(OD_REGION in first['content'],
      'onlinedocs region (header + markers + bullet) byte-preserved through set mode')
check(first['content'].index('<!-- related:end -->') <
      first['content'].index('<!-- onlinedocs:begin -->') <
      first['content'].index('\n---\n'),
      'region order preserved: related, then onlinedocs, then the seam')

second_payload = dict(PAYLOAD)
second_payload['files'] = [{'doc': 42, 'name': 'self.md', 'content': first['content']}]
second = run_payload(second_payload)['files'][0]
check(not second['changed'] and second['content'] == first['content'],
      'idempotence on the v2.9 format: patch(patch(x)) == patch(x)')

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
print('RESULT: PASS — r7 batch is paste-ready (HtmlToText v1.0 is a NEW '
      'standalone script, safe to paste any time; SidecarPatch v1.6 is '
      'unchanged and proven to pass the v2.9 sidecar additions through '
      'byte-identically — see designer-edits.md §v2_9 and §testplangen-v2_14)')
