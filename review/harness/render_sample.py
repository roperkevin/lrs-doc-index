"""Render a full sample sidecar — the eyeball artifact for the current format.

Mirrors the flow's Sidecar_header template (flow/v2_7/definition.json)
in Python — same fields, same YAML escaping rules as the WDL
expressions, including the v2.4 authorship lines (author /
last_edited_by / last_edited), the subfolder-routed URLs, the v2.5
row-id `doc_id`, and the v2.7 GFM layout (H1 first, key-value info
table with a conditional devtopia Issue row, the yaml block collapsed
inside <details><summary>Metadata</summary>, `issues:` yaml line) —
over the real_deck.pptx extraction (current ZipTextExtract), and writes
sample_sidecar.md. Asserts:

  - the file opens with the H1 title, then the info table, then
    exactly one <details><summary>Metadata</summary> block wrapping
    the fenced ```yaml metadata — blank lines around the fence (GitHub
    won't render the fence inside <details> without them) — and NOT
    `---` frontmatter
  - the info table carries the devtopia Issue row (built from the
    Run_regex ids; omitted when there are none — both branches
    asserted) and the Source link row
  - the inner YAML parses with yaml.safe_load (title planted with '"'
    and ':' to exercise the escaping); `related` reads as [];
    `issues` round-trips as ["repo#n", ...]
  - exactly one H1 line in the whole file
  - exactly one <!-- related:begin -->/<!-- related:end --> marker
    pair, in order, between ## Related documents and the seam
  - the '---' header/body seam is present

Then runs SidecarPatch (current scripts/ version) in set mode over the rendered sample with
three synthetic ranked entries and writes sample_sidecar_related.md —
the eyeball artifact for a POPULATED related list — re-asserting the
metadata still parses (`related` = 3 entry dicts), the details frame
and head survived, and the file still has exactly one H1.

Prereqs: make_fixtures.py and check_format.py have run (zte_cur.ts).
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


out = subprocess.run(['node', '--experimental-strip-types', 'zte_cur.ts',
                      'real_deck.pptx.b64', '../media/doc42_'],
                     capture_output=True, text=True, encoding='utf-8', check=True)
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
    'author': 'Claire Wang & Team',
    'last_edited_by': 'Miguel O’Brien',
    'last_edited': '2026-07-31T18:22:04Z',
    'extracted': '2026-08-10',
    'extraction_lane': 'xmlstrip',
    'prompt_version': 'v1.9',
    'keywords': ['conflict prevention', 'locks', 'routes', 'route editing'],
    'tools': [],
    'ids': [{'repo': 'ArcGISPro/ps-location-referencing', 'number': 4855}],
    'summary': ('Explores how conflict prevention should acquire locks when routes '
                'are created rather than edited, covering lock timing in Create, '
                'Extend, Realign, and Reassign Route and the behavior when another '
                'user already holds the lock.'),
}

# mirrors the info table's Edited cell (formatDateTime yyyy-MM-dd HH:mm)
last_edited_disp = meta['last_edited'][:10] + ' ' + meta['last_edited'][11:16]

DET_OPEN = '<details><summary>Metadata</summary>\n\n```yaml\n'
DET_CLOSE = '\n```\n\n</details>\n'


def render_header(m):
    """Python mirror of the v2.7 Sidecar_header WDL template."""
    # mirrors Select_issue_links / Issue_row (row omitted when no ids)
    issue_links = ' · '.join(
        f"[{i['repo']}#{i['number']}](https://devtopia.esri.com/"
        f"{i['repo']}/issues/{i['number']})" for i in m['ids'])
    issue_row = f'| **Issue** | {issue_links} |\n' if m['ids'] else ''
    # mirrors Select_issue_yaml
    issues_yaml = ', '.join(f'"{i["repo"]}#{i["number"]}"' for i in m['ids'])
    release_disp = m['target_release'].replace('|', '/') if m['target_release'] else '—'
    edited_disp = last_edited_disp if m['last_edited'] else 'unknown'
    editor_disp = m['last_edited_by'].replace('|', '/') if m['last_edited_by'] else 'unknown'
    summary_disp = (m['summary'] or
                    '> [!WARNING]\n> No AI summary was generated for this document.')
    return f"""# {m['title']}

|   |   |
| --- | --- |
| **Kind** | {m['doc_kind']} · {m['surface']} |
| **Release** | {release_disp} |
{issue_row}| **Source** | [{m['source_file']}](<{m['source_url']}>) |
| **Edited** | {edited_disp} by {editor_disp} |
| **Extracted** | {m['extracted']} · lane `{m['extraction_lane']}` |

{DET_OPEN}title: {wdl_yaml_quote(m['title'])}
source_file: {wdl_yaml_quote(m['source_file'])}
source_url: "{m['source_url']}"
doc_id: {m['doc_id']}
doc_kind: "{m['doc_kind']}"
surface: "{m['surface']}"
doc_revision: "{m['doc_revision']}"
target_release: "{m['target_release']}"
pe: "{m['pe']}"
dev: "{m['dev']}"
author: "{m['author'].replace('"', '')}"
last_edited_by: "{m['last_edited_by'].replace('"', '')}"
last_edited: "{m['last_edited']}"
extracted: {m['extracted']}
extraction_lane: {m['extraction_lane']}
prompt_version: "{m['prompt_version']}"
keywords: [{', '.join(kw_quote(k) for k in m['keywords'])}]
tools: [{', '.join(kw_quote(t) for t in m['tools'])}]
issues: [{issues_yaml}]
related: []{DET_CLOSE}
## Summary

{summary_disp}

## Related documents

<!-- related:begin -->
_None yet._
<!-- related:end -->

---

"""


header = render_header(meta)

sidecar = header + body
open('sample_sidecar.md', 'w', encoding='utf-8').write(sidecar)

ok = True
h1_line = f"# {meta['title']}\n"
if (sidecar.startswith(h1_line + '\n|   |   |\n| --- | --- |\n') and
        not sidecar.startswith('---')):
    print('ok   file opens with the H1 title, then the info table')
else:
    print('FAIL file does not open with H1 + info table')
    ok = False

if (sidecar.count('<details>') == 1 and sidecar.count('</details>') == 1 and
        DET_OPEN in sidecar and DET_CLOSE in sidecar):
    print('ok   one <details>Metadata block wraps the fenced yaml '
          '(blank lines around the fence)')
else:
    print('FAIL details wrapper missing, duplicated, or malformed')
    ok = False

issue_cell = ('| **Issue** | [ArcGISPro/ps-location-referencing#4855]'
              '(https://devtopia.esri.com/ArcGISPro/ps-location-referencing/'
              'issues/4855) |')
if issue_cell in sidecar.split('<details>')[0]:
    print('ok   info table links the devtopia issue')
else:
    print('FAIL devtopia issue row missing from the info table')
    ok = False

no_issue = render_header(dict(meta, ids=[]))
if ('| **Issue**' not in no_issue and
        '| **Release** | 3.8 |\n| **Source** |' in no_issue and
        'issues: []' in no_issue):
    print('ok   issue row vanishes cleanly when no ids (yaml issues: [])')
else:
    print('FAIL id-less header renders a broken table or issue row')
    ok = False

src_cell = f"| **Source** | [{meta['source_file']}](<{meta['source_url']}>) |"
if src_cell in sidecar.split('<details>')[0]:
    print('ok   info table carries the source link row')
else:
    print('FAIL source link row missing from the info table')
    ok = False

fm = sidecar[sidecar.index(DET_OPEN) + len(DET_OPEN):sidecar.index(DET_CLOSE)]
parsed = yaml.safe_load(fm)
if parsed['title'] != meta['title'] or parsed['keywords'] != meta['keywords']:
    print('FAIL metadata round-trip')
    ok = False
else:
    print('ok   metadata parses and round-trips (quoted/colon title)')

if (parsed['author'] == meta['author'] and
        parsed['last_edited_by'] == meta['last_edited_by'] and
        parsed['last_edited'] == meta['last_edited']):
    print('ok   authorship fields round-trip (author / last_edited_by / last_edited)')
else:
    print('FAIL authorship fields wrong:', parsed.get('author'),
          parsed.get('last_edited_by'), parsed.get('last_edited'))
    ok = False

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

if parsed.get('issues') == ['ArcGISPro/ps-location-referencing#4855']:
    print('ok   issues frontmatter field round-trips as ["repo#n"]')
else:
    print(f"FAIL issues field wrong: {parsed.get('issues')!r}")
    ok = False

no_summary = render_header(dict(meta, summary=''))
if ('> [!WARNING]\n> No AI summary was generated for this document.'
        in no_summary):
    print('ok   empty summary renders the WARNING alert branch')
else:
    print('FAIL empty-summary WARNING alert missing')
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

# ---- populate via SidecarPatch (set mode, synthetic entries) -------
scp = open('../../scripts/SidecarPatch.ts', encoding='utf-8').read().replace(
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
open('scp_render.ts', 'w', encoding='utf-8').write(scp)

texts = 'https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index'
payload = {
    'files': [{'doc': meta['doc_id'], 'name': 'sample_sidecar.md',
               'folder': '/LRS Doc Index/User Stories', 'content': sidecar}],
    'selfId': str(meta['doc_id']),
    'ranked': [
        {'doc': 17, 's': 1003, 'why': 'shared issue ArcGISPro/ps-location-referencing#4855 · '
                                      '3 shared keywords: conflict prevention, locks, routes'},
        {'doc': 23, 's': 2, 'why': '2 shared keywords: locks, route editing'},
        {'doc': 9, 's': 1, 'why': '1 shared keyword: routes'},
    ],
    'docsMeta': [
        {'ID': 17, 'Title': 'Lock Acquisition Test Plan',
         'TextFileUrl': f'{texts}/Test Plans/lock-acquisition-test-plan__doc17.md'},
        {'ID': 23, 'Title': 'Route Editing Design Spike',
         'TextFileUrl': f'{texts}/Design Spikes/route-editing-design-spike__doc23.md'},
        {'ID': 9, 'Title': 'Route Creation Overview',
         'TextFileUrl': f'{texts}/Other/route-creation-overview__doc9.md'},
    ],
    'selfMeta': {'doc': meta['doc_id'], 'title': meta['title'],
                 'url': f"{texts}/User Stories/conflict-prevention-acquire-locks-for-new-routes__doc42.md",
                 'file': 'conflict-prevention-acquire-locks-for-new-routes__doc42.md'},
    'topN': 5,
}
json.dump(payload, open('scp_render_payload.json', 'w', encoding='utf-8'))
out = subprocess.run(['node', '--experimental-strip-types', 'scp_render.ts',
                      'scp_render_payload.json'],
                     capture_output=True, text=True, encoding='utf-8', check=True)
patched = json.loads(out.stdout)['files'][0]
open('sample_sidecar_related.md', 'w', encoding='utf-8').write(patched['content'])

pc = patched['content']
rel_fm = yaml.safe_load(pc[pc.index(DET_OPEN) + len(DET_OPEN):pc.index(DET_CLOSE)])
if (patched['changed'] and pc.startswith(h1_line) and
        isinstance(rel_fm.get('related'), list) and
        len(rel_fm['related']) == 3 and
        all(set(e) == {'doc', 'file', 's'} for e in rel_fm['related'])):
    print('ok   patched metadata parses in the details frame; related = 3 entry dicts')
else:
    print('FAIL patched related metadata wrong:', rel_fm.get('related'))
    ok = False

if pc[:pc.index('<details>')] == sidecar[:sidecar.index('<details>')]:
    print('ok   patched file keeps the H1 + info table head byte-identical')
else:
    print('FAIL patching disturbed the head above <details>')
    ok = False

if patched['folder'] == '/LRS Doc Index/User Stories':
    print('ok   patched file keeps its kind subfolder (v1.2 folder pass-through)')
else:
    print(f"FAIL patched folder wrong: {patched.get('folder')!r}")
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
