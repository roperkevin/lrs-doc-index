"""Render a full sample sidecar — the eyeball artifact for the v2.2 format.

Mirrors the flow's Sidecar_header template (flow/v2_2/definition.json)
in Python — same fields, same YAML escaping rules as the WDL
expressions — over the real_deck.pptx v1.7 extraction, and writes
sample_sidecar.md. Asserts:

  - the frontmatter parses with yaml.safe_load (title planted with
    '"' and ':' to exercise the escaping)
  - exactly one H1 line in the whole file
  - the '---' header/body seam is present

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
    'prompt_version': 'v1.2',
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
---

# {meta['title']}

**{meta['doc_kind']}** · **Surface:** {meta['surface']} · **Extracted:** {meta['extracted']} · **Lane:** {meta['extraction_lane']}{'  '}
[Source: {meta['source_file']}](<{meta['source_url']}>)

## Summary

{meta['summary'] or '_No summary available._'}

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

print()
print('RESULT:', 'PASS — see sample_sidecar.md' if ok else 'FAIL')
sys.exit(0 if ok else 1)
