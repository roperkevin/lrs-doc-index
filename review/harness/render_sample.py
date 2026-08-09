"""Render a full sample sidecar — the eyeball artifact for the v2.3 format.

Mirrors the flow's Sidecar_header template (flow/v2_3/definition.json)
in Python — same fields, same YAML escaping rules as the WDL
expressions — over the real_deck.pptx v1.7 extraction, and writes
sample_sidecar.md. Asserts:

  - the frontmatter parses with yaml.safe_load (title planted with
    '"' and ':' to exercise the escaping); `related` reads as []
  - exactly one H1 line in the whole file
  - exactly one <!-- related:begin -->/<!-- related:end --> marker
    pair, in order, between ## Related documents and the seam
  - the '---' header/body seam is present

Then runs SidecarPatch v1.0 in set mode over the rendered sample with
three synthetic ranked entries and writes sample_sidecar_related.md —
the eyeball artifact for a POPULATED related list — re-asserting the
frontmatter still parses (`related` = 3 entry dicts) and the file
still has exactly one H1.

Prereqs: make_fixtures.py and check_format.py have run (zte_v17.ts).
"""
import json
import re
import subprocess
import sys

import yaml


def wdl_yaml_quote(s):
    # mirrors Yaml_title/Yaml_file: backslash, then quote, then CR/LF
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') \
                  .replace('\r', ' ').replace('\n', ' ') + '"'


def kw_quote(s):
    # mirrors Select_kw_yaml: strip backslashes/quotes, then quote
    return '"' + s.replace('\\', '').replace('"', '') + '"'


out = subprocess.run(['node', '--experimental-strip-types', 'zte_v17.ts',
                      'real_deck.pptx.b64', 'media/doc42_'],
                     capture_output=True, text=True, check=True)
body = json.loads(out.stdout)['out']['text']

meta = {
    'title': 'Conflict "Prevention": Acquire Locks for New Routes',
    'source_file': 'Conflict Prevention Acquire Lock when creating new route.pptx',
    'source_url': 'https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Conflict%20Prevention%20Acquire%20Lock%20when%20creating%20new%20route.pptx',
    'doc_id': 42,
    'doc_kind': 'User Story',
    'surface': 'Pro',
    'doc_revision': '',
    'target_release': '3.8',
    'pe': 'Claire Wang',
    'dev': '',
    'extracted': '2026-08-09',
    'extraction_lane': 'xmlstrip',
    'prompt_version': 'v1.3',
    'keywords': ['conflict prevention', 'locks', 'routes', 'route editing'],
    'tools': [],
    'summary': ('Explores how conflict prevention should acquire locks when routes '
                'are created rather than edited, covering lock timing in Create, '
                'Extend, Realign, and Reassign Route and the behavior when another '
                'user already holds the lock.'),
}

header = f"""---
title: {wdl_yaml_quote(meta['title'])}
source_file: {wdl_yaml_quote(meta['source_file'])}
source_url: "{meta['source_url']}"
doc_id: {meta['doc_id']}
doc_kind: "{meta['doc_kind']}"
surface: "{meta['surface']}"
doc_revision: "{meta['doc_revision']}"
target_release: "{meta['target_release']}"
pe: "{meta['pe']}"
dev: "{meta['dev']}"
extracted: {meta['extracted']}
extraction_lane: {meta['extraction_lane']}
prompt_version: "{meta['prompt_version']}"
keywords: [{', '.join(kw_quote(k) for k in meta['keywords'])}]
tools: [{', '.join(kw_quote(t) for t in meta['tools'])}]
related: []
---

# {meta['title']}

**{meta['doc_kind']}** · **Surface:** {meta['surface']} · **Extracted:** {meta['extracted']} · **Lane:** {meta['extraction_lane']}{'  '}
[Source: {meta['source_file']}](<{meta['source_url']}>)

## Summary

{meta['summary'] or '_No summary available._'}

## Related documents

<!-- related:begin -->
_None yet._
<!-- related:end -->

---

"""

sidecar = header + body
open('sample_sidecar.md', 'w').write(sidecar)

ok = True
fm = sidecar.split('---\n')[1]
parsed = yaml.safe_load(fm)
if parsed['title'] != meta['title'] or parsed['keywords'] != meta['keywords']:
    print('FAIL frontmatter round-trip')
    ok = False
else:
    print('ok   frontmatter parses and round-trips (quoted/colon title)')

h1s = [ln for ln in sidecar.split('\n') if re.match(r'^# ', ln)]
if len(h1s) != 1:
    print(f'FAIL expected exactly one H1, got {len(h1s)}')
    ok = False
else:
    print('ok   exactly one H1 in the whole file')

if '\n---\n' in sidecar[sidecar.index('## Summary'):]:
    print('ok   header/body seam present')
else:
    print('FAIL header/body seam missing')
    ok = False

if parsed.get('related') == []:
    print('ok   related frontmatter field reads as an empty list')
else:
    print(f"FAIL related field expected [], got {parsed.get('related')!r}")
    ok = False

BEGIN, END = '<!-- related:begin -->', '<!-- related:end -->'
head_idx = sidecar.index('## Related documents')
seam_idx = sidecar.index('\n---\n', sidecar.index('## Summary'))
if (sidecar.count(BEGIN) == 1 and sidecar.count(END) == 1 and
        head_idx < sidecar.index(BEGIN) < sidecar.index(END) < seam_idx):
    print('ok   one begin/end marker pair, in order, before the seam')
else:
    print('FAIL related markers missing, duplicated, or misplaced')
    ok = False

# ---- populate via SidecarPatch v1.0 (set mode, synthetic entries) -------
scp = open('../../scripts/SidecarPatch.ts').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
scp += '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, JSON.stringify(p.files), p.selfId,
  JSON.stringify(p.ranked), JSON.stringify(p.docsMeta), JSON.stringify(p.selfMeta), p.topN)));
'''
open('scp_render.ts', 'w').write(scp)

texts = 'https://esriis.sharepoint.com/sites/lrsworkspace/Document Index Texts'
payload = {
    'files': [{'doc': meta['doc_id'], 'name': 'sample_sidecar.md', 'content': sidecar}],
    'selfId': str(meta['doc_id']),
    'ranked': [
        {'doc': 17, 's': 1003, 'why': 'shared issue ArcGISPro/ps-location-referencing#4855 · '
                                      '3 shared keywords: conflict prevention, locks, routes'},
        {'doc': 23, 's': 2, 'why': '2 shared keywords: locks, route editing'},
        {'doc': 9, 's': 1, 'why': '1 shared keyword: routes'},
    ],
    'docsMeta': [
        {'ID': 17, 'Title': 'Lock Acquisition Test Plan',
         'TextFileUrl': f'{texts}/lock-acquisition-test-plan__doc17.md'},
        {'ID': 23, 'Title': 'Route Editing Design Spike',
         'TextFileUrl': f'{texts}/route-editing-design-spike__doc23.md'},
        {'ID': 9, 'Title': 'Route Creation Overview',
         'TextFileUrl': f'{texts}/route-creation-overview__doc9.md'},
    ],
    'selfMeta': {'doc': meta['doc_id'], 'title': meta['title'],
                 'url': f"{texts}/conflict-prevention-acquire-locks-for-new-routes__doc42.md",
                 'file': 'conflict-prevention-acquire-locks-for-new-routes__doc42.md'},
    'topN': 5,
}
json.dump(payload, open('scp_render_payload.json', 'w'))
out = subprocess.run(['node', '--experimental-strip-types', 'scp_render.ts',
                      'scp_render_payload.json'],
                     capture_output=True, text=True, check=True)
patched = json.loads(out.stdout)['files'][0]
open('sample_sidecar_related.md', 'w').write(patched['content'])

rel_fm = yaml.safe_load(patched['content'].split('\n---\n')[0][4:])
if (patched['changed'] and isinstance(rel_fm.get('related'), list) and
        len(rel_fm['related']) == 3 and
        all(set(e) == {'doc', 'file', 's'} for e in rel_fm['related'])):
    print('ok   patched frontmatter parses; related = 3 entry dicts')
else:
    print('FAIL patched related frontmatter wrong:', rel_fm.get('related'))
    ok = False

h1s = [ln for ln in patched['content'].split('\n') if re.match(r'^# ', ln)]
if len(h1s) == 1 and patched['content'].count('<!-- rel:') == 3:
    print('ok   patched sample keeps one H1, renders 3 tagged bullets')
else:
    print(f"FAIL patched sample: {len(h1s)} H1s, "
          f"{patched['content'].count('<!-- rel:')} bullets")
    ok = False

print()
print('RESULT:', 'PASS — see sample_sidecar.md / sample_sidecar_related.md'
      if ok else 'FAIL')
sys.exit(0 if ok else 1)
