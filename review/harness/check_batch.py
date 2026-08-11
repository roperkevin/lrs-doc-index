"""Gate for the v1.9 script batch (REVIEW_v2_5 SC-2..SC-14, FL-5).

HISTORICAL since 2026-08-11: the batch PASSED this gate, was pasted
into the Automate tab, and the patches were promoted over scripts/ —
so the staged copies below are now identical to the shipped scripts
and this gate re-verifies the promotion. The new-behavior assertions
were folded into check_format.py (§9) and check_related.py (§10/§11),
which run against scripts/ directly; those are the standing suites.
Keep this file for the record and for gating any FUTURE batch (point
PATCHES at the new patch files).

Stages the four patch files —

  ../patches/ZipTextExtract_v1_9.ts   (SC-2..SC-10, SC-14, FL-5)
  ../patches/MediaExtract_v1_2.ts     (SC-8, SC-11, SC-14)
  ../patches/RelatedRank_v1_2.ts      (SC-12)
  ../patches/SidecarPatch_v1_3.ts     (SC-13)

— under canonical names, re-runs the FULL existing suites over them
(check_format.py + check_related.py via the HARNESS_SCRIPTS override:
the entire v1.8-generation contract must stay green, since none of the
batch's changes touch the existing fixtures' behavior), byte-diffs
MediaExtract v1.1 vs v1.2 on the valid fixtures (their outputs must be
identical — v1.2 only adds throw paths and fixes error text), then
asserts every NEW behavior on the batch fixtures make_fixtures.py
plants.

Prereqs: make_fixtures.py has run in this directory (it now also
builds the batch fixtures). Exit nonzero on any failure — any FAIL =
do not paste.

On promotion (paste into the Automate tab + copy patches over
scripts/), fold the new-behavior assertions below into check_format.py
/ check_related.py and mark this gate historical in README.md.
"""
import base64
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile

PATCHES = {
    'ZipTextExtract.ts': '../patches/ZipTextExtract_v1_9.ts',
    'MediaExtract.ts': '../patches/MediaExtract_v1_2.ts',
    'RelatedRank.ts': '../patches/RelatedRank_v1_2.ts',
    'SidecarPatch.ts': '../patches/SidecarPatch_v1_3.ts',
}
UNCHANGED = ['RegexExtract.ts', 'WorkbookDump.ts']
STAGE = 'stage_v19'

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- stage the batch under canonical names -------------------------------
os.makedirs(STAGE, exist_ok=True)
for canon, src in PATCHES.items():
    shutil.copyfile(src, os.path.join(STAGE, canon))
for name in UNCHANGED:
    shutil.copyfile(os.path.join('../../scripts', name), os.path.join(STAGE, name))

# ---- regression: the full existing suites over the staged batch ----------
env = dict(os.environ, HARNESS_SCRIPTS=STAGE)
for suite in ('check_format.py', 'check_related.py'):
    r = subprocess.run([sys.executable, suite], env=env,
                       capture_output=True, text=True, encoding='utf-8')
    check(r.returncode == 0, f'regression: {suite} fully green over the staged batch'
          + ('' if r.returncode == 0 else '\n' + (r.stdout + r.stderr)[-3000:]))

# ---- wrap the runners this gate drives directly --------------------------
subprocess.run([sys.executable, 'wrap.py', f'{STAGE}/ZipTextExtract.ts', 'zte_v19.ts'], check=True)
subprocess.run([sys.executable, 'wrap.py', f'{STAGE}/MediaExtract.ts', 'me_v12.ts'], check=True)
subprocess.run([sys.executable, 'wrap.py', '../patches/MediaExtract_v1_1.ts', 'me_v11.ts'], check=True)


def run_node(script, *args):
    out = subprocess.run(['node', '--experimental-strip-types', script, *args],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f"{script} failed on {args}:\n{out.stderr[:2000]}")
    return json.loads(out.stdout)


def run_node_expect_fail(script, *args):
    return subprocess.run(['node', '--experimental-strip-types', script, *args],
                          capture_output=True, text=True, encoding='utf-8')


# ==== SC-2: presentation-order slides =====================================
print('== SC-2 slide order (reordered_deck) ==')
text = run_node('zte_v19.ts', 'reordered_deck.pptx.b64', '')['out']['text']
lines = text.split('\n')
heads = [ln for ln in lines if ln.startswith('## Slide ')]
check(len(heads) == 4 and heads[0] == '## Slide 1 — OrderTitle3',
      f'reversed sldIdLst: first section is "## Slide 1 — OrderTitle3" (got {heads[:1]})')
nums = [int(re.match(r'## Slide (\d+)', h).group(1)) for h in heads]
check(nums == [1, 2, 3, 4], f'display numbers are positions 1..4 (got {nums})')
order = [text.find(f'OrderTitle{i}') for i in (3, 2, 1, 0)]
check(all(a >= 0 for a in order) and order == sorted(order),
      'sections appear in presentation order (titles 3,2,1,0)')

# ==== SC-3: hMerge continuation cells =====================================
print('== SC-3 merged cells (merged_deck) ==')
text = run_node('zte_v19.ts', 'merged_deck.pptx.b64', '')['out']['text']
rows = [ln for ln in text.split('\n') if ln.startswith('| ')]


def cells(row):
    return re.split(r'(?<!\\)\|', row)[1:-1]


check(len(rows) >= 4 and all(len(cells(r)) == 3 for r in rows),
      f'all pipe rows keep width 3 ({[len(cells(r)) for r in rows]})')
head_row = [r for r in rows if 'mergedhead' in r]
check(bool(head_row) and 'm02' in head_row[0] and 'm01' not in head_row[0],
      'merged row: origin + pad + m02; the hMerge cell (m01) is gone')

# ==== SC-4: cap-aware image links =========================================
print('== SC-4 link/save coherence (bigimg_deck) ==')
with zipfile.ZipFile('bigimg_deck.pptx') as z:
    media = {n.split('/')[-1]: z.getinfo(n).file_size
             for n in z.namelist() if '/media/' in n}
small = [n for n, sz in media.items() if sz <= 350 * 1024][0]
big = [n for n, sz in media.items() if sz > 350 * 1024][0]
out = run_node('zte_v19.ts', 'bigimg_deck.pptx.b64', 'media/docX_')['out']
check(f'](media/docX_{small})' in out['text'], f'small image ({small}) is linked')
check(big not in out['text'], f'over-cap image ({big}) is NOT linked')
check(out['media'] == small, f"media output lists only the saved image (got {out['media']!r})")
mb = run_node('me_v12.ts', 'bigimg_deck.pptx.b64')['out']
check(mb['count'] == 1 and mb['images'][0]['name'] == small,
      'MediaExtract v1.2 saves exactly the small image')
check(big in mb['skipped'], 'over-cap image lands in skipped')
linked = set(re.findall(r'\]\(media/docX_([^)]+)\)', out['text']))
saved = {img['name'] for img in mb['images']}
check(linked <= saved, 'every linked image is actually saved (the SC-4 invariant)')

# ==== equivalence: MediaExtract v1.1 vs v1.2 on valid archives ============
print('== MediaExtract v1.1 vs v1.2 equivalence ==')
for fx in ('real_deck.pptx.b64', 'real_doc.docx.b64', 'bigimg_deck.pptx.b64'):
    a = run_node('me_v11.ts', fx)['out']
    b = run_node('me_v12.ts', fx)['out']
    check(a == b, f'{fx}: v1.1 and v1.2 outputs identical')

# ==== SC-6: attribute-order-independent rels ==============================
print('== SC-6 rels attr order (relswap_deck) ==')
out = run_node('zte_v19.ts', 'relswap_deck.pptx.b64', 'media/docX_')['out']
check('](media/docX_image1.png)' in out['text'] and out['media'] == 'image1.png',
      'Target-before-Id rels still resolve the image link')

# ==== SC-7: digit strip never corrupts links ==============================
print('== SC-7 link-safe digit strip ==')
out = run_node('zte_v19.ts', 'relswap_deck.pptx.b64', 'media/doc12345678901_')['out']
check('](media/doc12345678901_image1.png)' in out['text'],
      'a 10+ digit media prefix survives inside the generated link')

# ==== SC-5 / SC-10 / SC-7 / FL-5: edgecase2_deck ==========================
print('== SC-5/SC-10/SC-7/FL-5 (edgecase2_deck) ==')
out = run_node('zte_v19.ts', 'edgecase2_deck.pptx.b64', '')['out']
text = out['text']
check('😀' in text, 'astral entity &#x1F600; decodes to the emoji')
check('\\# Roadmap pasted markdown' in text, 'pasted-markdown H1 line is escaped to \\#')
check(not any(re.match(r'^# ', ln) for ln in text.split('\n')), 'no H1 line in body output')
check('12345678901234' not in text and 'digits glue run' in text.replace('  ', ' '),
      'long digit run stripped from plain content (behavior preserved)')
check(out['lastEdited'] == '', 'malformed dcterms:modified degrades to "" (FL-5)')

# ==== SC-14 / SC-8 / SC-11: throw paths ===================================
print('== SC-14/SC-8/SC-11 throw paths ==')
r = run_node_expect_fail('zte_v19.ts', 'encrypted_deck.pptx.b64', '')
check(r.returncode != 0 and 'encrypted' in r.stderr, 'ZTE throws on encrypted entries')
r = run_node_expect_fail('me_v12.ts', 'encrypted_img_deck.pptx.b64')
check(r.returncode != 0 and 'encrypted' in r.stderr and 'MediaExtract:' in r.stderr
      and 'ZipTextExtract' not in r.stderr,
      'MediaExtract throws on encrypted entries under its OWN name (SC-11)')
r = run_node_expect_fail('zte_v19.ts', 'truncstored.docx.b64', '')
check(r.returncode != 0 and 'stored block out of input' in r.stderr,
      'truncated stored block throws instead of zero-padding (SC-8)')

# ==== RelatedRank v1.2 (SC-12) ============================================
print('== RelatedRank v1.2 defensive cases ==')
RR_APPENDIX = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, p.selfId, JSON.stringify(p.myKws), JSON.stringify(p.sharers), JSON.stringify(p.idLinks), p.topN)));
'''
body = open(f'{STAGE}/RelatedRank.ts', encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
open('rr_v12.ts', 'w', encoding='utf-8').write(body + RR_APPENDIX)


def run_rr(payload):
    with open('rr_v12_payload.json', 'w', encoding='utf-8') as f:
        json.dump(payload, f)
    return run_node('rr_v12.ts', 'rr_v12_payload.json')


r = run_rr({'selfId': '42', 'myKws': [],
            'sharers': [],
            'idLinks': [{'DocA': {'Id': 7}, 'DocB': {'Id': 8},
                         'SharedValues': 'a#1', 'LinkType': 'id'}],
            'topN': 5})
check(r['count'] == 0, 'idLinks row with NEITHER endpoint = self credits nobody (SC-12a)')

r = run_rr({'selfId': '42',
            'myKws': [{'Document': {'Id': 42}, 'Keyword': {'Id': 1, 'Value': 'locks'}},
                      {'Document': {'Id': 42}, 'Keyword': {'Id': 5}}],
            'sharers': [{'Document': {'Id': 10}, 'Keyword': {'Id': 1, 'Value': 'locks'}},
                        {'Document': {'Id': 10}, 'Keyword': {'Id': 5}}],
            'idLinks': [], 'topN': 5})
e = r['related'][0]
check(r['count'] == 1 and e['s'] == 2,
      f"title-less keyword still scores (s == 2, got {e['s']})")
check(e['why'] == '1 shared keyword: locks' and e['sharedKeywords'] == ['locks'],
      'title-less keyword leaves why/sharedKeywords (no raw ids, SC-12b)')

# ==== SidecarPatch v1.3 (SC-13) ===========================================
print('== SidecarPatch v1.3 hardening cases ==')
SCP_APPENDIX = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(null as unknown, JSON.stringify(p.files), p.selfId, JSON.stringify(p.ranked), JSON.stringify(p.docsMeta), JSON.stringify(p.selfMeta), p.topN)));
'''
body = open(f'{STAGE}/SidecarPatch.ts', encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
open('scp_v13.ts', 'w', encoding='utf-8').write(body + SCP_APPENDIX)

BEGIN = '<!-- related:begin -->'
END = '<!-- related:end -->'


def sidecar(related_line='related: []', region='_None yet._'):
    return f'''```yaml
title: "Conflict Prevention"
doc_id: 42
keywords: ["locks"]
tools: []
{related_line}
```

# Conflict Prevention

## Summary

Explores lock acquisition.

## Related documents

{BEGIN}
{region}
{END}

---

body text
'''


def run_scp(files, ranked, meta, self_meta=None, top=5):
    payload = {'files': files, 'selfId': '42', 'ranked': ranked,
               'docsMeta': meta,
               'selfMeta': self_meta or {'doc': 42, 'title': 'Conflict Prevention',
                                         'url': 'https://x/s/User Stories/conflict__doc42.md',
                                         'file': 'conflict__doc42.md'},
               'topN': top}
    with open('scp_v13_payload.json', 'w', encoding='utf-8') as f:
        json.dump(payload, f)
    return run_node('scp_v13.ts', 'scp_v13_payload.json')['files']


META = [{'ID': 17, 'Title': 'Lock Plan', 'TextFileUrl': 'https://x/s/Test Plans/lock__doc17.md'}]
RANKED = [{'doc': 17, 's': 5, 'why': '1 shared keyword: locks'}]

# (a) BOM + CRLF sidecar gets normalized and patched
crlf = '﻿' + sidecar().replace('\n', '\r\n')
[out] = run_scp([{'doc': 42, 'name': 's.md', 'content': crlf}], RANKED, META)
check(out['changed'] and '\r' not in out['content'] and '﻿' not in out['content'],
      'BOM+CRLF sidecar is normalized (patchable again, SC-13a)')
check('<!-- rel:17 -->' in out['content'] and 'related: [{"doc":17' in out['content'],
      'normalized sidecar received the patch')
[again] = run_scp([{'doc': 42, 'name': 's.md', 'content': out['content']}], RANKED, META)
check(not again['changed'], 'idempotent after normalization')

# (a2) unsafe-to-patch input keeps its ORIGINAL bytes, even with CRLF
junk = 'no frontmatter here\r\nat all'
[out] = run_scp([{'doc': 42, 'name': 'x.md', 'content': junk}], RANKED, META)
check(not out['changed'] and out['content'] == junk and out['note'] == 'not-frontmatter',
      'unsafe file returns original bytes untouched')

# (b) metacharacters in title/url are cleaned in the rendered bullet
bad_meta = [{'ID': 17, 'Title': 'Bad] --> [Title',
             'TextFileUrl': 'https://x/s/Test Plans/we>ird__doc17.md'}]
[out] = run_scp([{'doc': 42, 'name': 's.md', 'content': sidecar()}], RANKED, bad_meta)
check('[Bad - Title](<https://x/s/Test Plans/we%3Eird__doc17.md>)' in out['content'],
      'bullet escapes ] --> and > (SC-13b)')
check(out['content'].count('-->') == out['content'].count('<!--'),
      'comment open/close balance preserved')

# (c) fallback entry (no meta, no bullet) renders unlinked
neighbor = sidecar(related_line='related: [{"doc":99,"file":"other__doc99.md","s":1}]')
[out] = run_scp([{'doc': 17, 'name': 'n.md', 'content': neighbor}], RANKED, META)
nline = [ln for ln in out['content'].split('\n') if 'rel:99' in ln]
check(bool(nline) and '](' not in nline[0] and 'other__doc99.md' in nline[0],
      'meta-less entry renders as plain text, not a bare-filename link (SC-13c)')

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed — DO NOT PASTE')
    sys.exit(1)
print('RESULT: PASS — batch is paste-ready (fixture gate; smoke per CHANGES on paste)')
