"""Assertions for the v2.3 related-documents scripts.

Wraps scripts/RelatedRank.ts and scripts/SidecarPatch.ts into
standalone Node runners (same pattern as rex_v12.ts) and asserts the
v2.3 contract:

  RelatedRank:
    1. an id link (score 1000+) outranks any keyword overlap
    2. a doc sharing both signals is a SINGLE entry, combined score/why
    3. self is excluded
    4. score tie -> higher item id (newer doc) first
    5. cap at topN
    6. empty inputs -> count 0; malformed JSON params -> [] not throw
    7. why keyword names cap at 4 + "+k more"
    8. keywords weigh by rarity — w = 1/log2(1+df) from the sharers
       rows — so one rare keyword outranks two common ones; scores
       round to 3 decimals; keyword totals stay < 1000 (v1.1)
    9. why/sharedKeywords list rarest first, ties alphabetical (v1.1)

  SidecarPatch:
    1. set mode renders N tagged bullets and rewrites ONLY the
       metadata `related:` line + the marker region — a decoy
       `related: [decoy]` line and a stray `---` seam planted in the
       BODY are byte-untouched
    2. idempotence: patch(patch(x)) == patch(x), changed goes false
    3. merge inserts a new entry and re-sorts; merge of an existing
       doc id replaces it; merge past the cap evicts the weakest
    4. marker-missing fallback: a pre-v2.3 sidecar gains the section
       before the seam after ## Summary, and the `related:` line
       after `tools:`
    5. begin-without-end -> no-op, changed false, note, byte-identical
    6. empty set mode renders `_None yet._` / `related: []`
    7. populated metadata still parses with yaml.safe_load
    8. both metadata frames parse — the fenced ```yaml block (the
       PromptVersion v1.4 SharePoint-preview-safe form) and the
       legacy `---` frontmatter — and each file keeps the frame it
       arrived in (v1.1)
    9. the `folder` property on each file object passes through to
       the output verbatim (set and merge alike), and a folder-less
       file comes back with folder "" (v1.2 — lets the flow save
       patched files back into their own kind subfolders)

Both wrapped runners must type-check at ES2017.

Prereqs: none beyond Node 22+ and pyyaml (fixtures not needed).
Exit code: non-zero on any failed assertion.
"""
import json
import subprocess
import sys

import yaml

SCRIPTS = '../../scripts'

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- wrap both scripts ---------------------------------------------------
APPENDIX = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const p = JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(main(%s)));
'''

# *Raw fields (when present) bypass the appendix's JSON.stringify so a
# payload can ship genuinely invalid JSON into the script's parse guards.
RR_ARGS = ("null as unknown, p.selfId, "
           "p.myKwsRaw !== undefined ? p.myKwsRaw : JSON.stringify(p.myKws), "
           "p.sharersRaw !== undefined ? p.sharersRaw : JSON.stringify(p.sharers), "
           "p.idLinksRaw !== undefined ? p.idLinksRaw : JSON.stringify(p.idLinks), "
           "p.topN")
SCP_ARGS = ("null as unknown, JSON.stringify(p.files), p.selfId, "
            "JSON.stringify(p.ranked), JSON.stringify(p.docsMeta), "
            "JSON.stringify(p.selfMeta), p.topN")

for src, runner, args in ((f'{SCRIPTS}/RelatedRank.ts', 'rr_v11.ts', RR_ARGS),
                          (f'{SCRIPTS}/SidecarPatch.ts', 'scp_v12.ts', SCP_ARGS)):
    body = open(src, encoding='utf-8').read().replace(
        'workbook: ExcelScript.Workbook', 'workbook: unknown')
    open(runner, 'w', encoding='utf-8').write(body + APPENDIX % args)


def run(runner, payload):
    path = runner.replace('.ts', '_payload.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(payload, f)
    out = subprocess.run(['node', '--experimental-strip-types', runner, path],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f'{runner} failed:\n{out.stderr[:2000]}')
    return json.loads(out.stdout)


def kwrow(doc, kwid, kwtitle):
    return {'Document': {'Id': doc}, 'Keyword': {'Id': kwid, 'Value': kwtitle}}


def idlink(a, b, shared):
    return {'DocA': {'Id': a}, 'DocB': {'Id': b}, 'SharedValues': shared,
            'LinkType': 'id'}


# ==== RelatedRank =========================================================
print('== RelatedRank v1.1 ==')

KW = [(1, 'locks'), (2, 'routes'), (3, 'conflict prevention'), (4, 'route editing'),
      (5, 'events'), (6, 'calibration'), (7, 'gaps'), (8, 'measures')]
my_kws = [kwrow(42, kid, t) for kid, t in KW]

# doc 10 shares all 8 keywords; doc 11 shares one issue id only
sharers = ([kwrow(10, kid, t) for kid, t in KW]
           + [kwrow(42, 1, 'locks')])          # self rows must be ignored
links = [idlink(11, 42, 'ArcGISPro/ps-location-referencing#4855')]

r = run('rr_v11.ts', {'selfId': '42', 'myKws': my_kws, 'sharers': sharers,
                      'idLinks': links, 'topN': 5})
check(r['count'] == 2 and r['docIds'][0] == 11 and r['docIds'][1] == 10,
      'id link (1 issue) outranks 8 shared keywords')
check(r['related'][0]['s'] == 1000 and r['related'][1]['s'] == 8,
      'scores: 1000 for the id link, 8 for the keywords')
check(all(e['doc'] != 42 for e in r['related']), 'self excluded')
check('+4 more' in r['related'][1]['why'] and
      r['related'][1]['why'].startswith('8 shared keywords: '),
      'why caps keyword names at 4 + "+k more"')

# doc 10 with BOTH signals -> one merged entry
r = run('rr_v11.ts', {'selfId': '42', 'myKws': my_kws,
                      'sharers': [kwrow(10, 1, 'locks'), kwrow(10, 2, 'routes')],
                      'idLinks': [idlink(10, 42, 'a#1;b#2')], 'topN': 5})
check(r['count'] == 1 and r['related'][0]['s'] == 2002,
      'doc with both signals is a single entry, combined score 2*1000+2')
check('shared issue a#1, b#2' in r['related'][0]['why'] and
      '2 shared keywords: locks, routes' in r['related'][0]['why'] and
      ' · ' in r['related'][0]['why'],
      'combined why names both signals')

# tie -> higher item id first; cap at topN
sharers = [kwrow(d, 1, 'locks') for d in (20, 21, 22, 23, 24, 25, 26)]
r = run('rr_v11.ts', {'selfId': '42', 'myKws': my_kws, 'sharers': sharers,
                      'idLinks': [], 'topN': 5})
check(r['docIds'] == [26, 25, 24, 23, 22], 'tie-break newer id first, cap at 5')

# rarity weighting: df('conflict prevention')=1 -> w=1.0,
# df('routes')=2 -> w~0.631, df('testing')=16 -> w~0.245
rarity_kws = [kwrow(42, 1, 'testing'), kwrow(42, 2, 'routes'),
              kwrow(42, 3, 'conflict prevention')]
rarity_sharers = ([kwrow(30, 3, 'conflict prevention')]
                  + [kwrow(31, 1, 'testing'), kwrow(31, 2, 'routes')]
                  + [kwrow(32, 2, 'routes')]
                  + [kwrow(d, 1, 'testing') for d in range(100, 115)])
r = run('rr_v11.ts', {'selfId': '42', 'myKws': rarity_kws,
                      'sharers': rarity_sharers, 'idLinks': [], 'topN': 5})
check(r['docIds'] == [30, 31, 32, 114, 113],
      'one rare keyword outranks two common ones (rarity ranking + ties)')
by_doc = {e['doc']: e for e in r['related']}
check(by_doc[30]['s'] == 1 and by_doc[31]['s'] == 0.876,
      'weights: df=1 -> 1.0; testing+routes -> 0.876 (3-decimal rounding)')
check(by_doc[31]['why'] == '2 shared keywords: routes, testing' and
      by_doc[31]['sharedKeywords'] == ['routes', 'testing'],
      'why lists rarest keyword first, not alphabetical')
check(all(e['s'] < 1000 for e in r['related']),
      'keyword-only scores stay below the id-link floor (1000)')

r = run('rr_v11.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [], 'topN': 5})
check(r['count'] == 0 and r['related'] == [], 'empty inputs -> count 0')

# malformed params must not throw — the *Raw fields skip the appendix's
# JSON.stringify, so genuinely invalid JSON reaches parseRows' try/catch
# (a stringified junk string would arrive as VALID JSON and never hit it)
r = run('rr_v11.ts', {'selfId': '42', 'myKwsRaw': 'not json',
                      'sharersRaw': '[{"Document":', 'idLinksRaw': 'null',
                      'topN': 5})
check(r['count'] == 0 and r['related'] == [],
      'malformed JSON params -> empty result, no throw (parse guard exercised)')
# valid-JSON-but-wrong-type params degrade the same way
r = run('rr_v11.ts', {'selfId': '42', 'myKws': 'not json', 'sharers': 42,
                      'idLinks': None, 'topN': 5})
check(r['count'] == 0 and r['related'] == [],
      'wrong-type params -> empty result, no throw')

# ==== SidecarPatch ========================================================
print('== SidecarPatch v1.1 ==')

BEGIN = '<!-- related:begin -->'
END = '<!-- related:end -->'


def sidecar(related_line='related: []', region='_None yet._', markers=True,
            frame='fence'):
    rel_section = (f'## Related documents\n\n{BEGIN}\n{region}\n{END}\n\n'
                   if markers else '')
    fm_open, fm_close = ('```yaml', '```') if frame == 'fence' else ('---', '---')
    return f'''{fm_open}
title: "Conflict \\"Prevention\\": Acquire Locks for New Routes"
doc_id: 42
keywords: ["locks", "routes"]
tools: []
{related_line}
{fm_close}

# Conflict "Prevention": Acquire Locks for New Routes

## Summary

Explores lock acquisition.

{rel_section}---

## Slide 3 — Locking new routes
- decoy body text below must never change
related: [decoy]

---

### Notes
stray seams and related-lookalikes everywhere
'''


RANKED = [{'doc': 17, 's': 1003, 'why': 'shared issue a#1 · 3 shared keywords: locks, m, routes',
           'sharedIds': ['a#1'], 'sharedKeywords': ['locks', 'm', 'routes']},
          {'doc': 23, 's': 2, 'why': '2 shared keywords: locks, routes',
           'sharedIds': [], 'sharedKeywords': ['locks', 'routes']},
          {'doc': 9, 's': 1, 'why': '1 shared keyword: locks',
           'sharedIds': [], 'sharedKeywords': ['locks']}]
META = [{'ID': 17, 'Title': 'Lock Acquisition Test Plan',
         'TextFileUrl': 'https://x/sites/s/Document Index Texts/lock-acquisition-test-plan__doc17.md'},
        {'ID': 23, 'Title': 'Route Editing Spike',
         'TextFileUrl': 'https://x/sites/s/Document Index Texts/route-editing-spike__doc23.md'},
        {'ID': 9, 'Title': 'Locks Overview',
         'TextFileUrl': 'https://x/sites/s/Document Index Texts/locks-overview__doc9.md'}]
SELF_META = {'doc': 42, 'title': 'Conflict "Prevention": Acquire Locks for New Routes',
             'url': 'https://x/sites/s/Document Index Texts/conflict-prevention__doc42.md',
             'file': 'conflict-prevention__doc42.md'}


def patch(files, ranked=RANKED, meta=META, top=5):
    return run('scp_v12.ts', {'files': files, 'selfId': '42', 'ranked': ranked,
                              'docsMeta': meta, 'selfMeta': SELF_META,
                              'topN': top})['files']


def fm_of(text):
    """Inner YAML of the metadata block, whichever frame the file carries."""
    if text.startswith('```yaml\n'):
        return text[len('```yaml\n'):text.index('\n```\n')]
    return text[4:text.index('\n---\n', 3)]


def strip_patchable(text):
    """Remove the fm related-line and the first marker region."""
    b, e = text.find(BEGIN), text.find(END)
    if b >= 0 and e > b:
        text = text[:b] + text[e + len(END):]
    close = '\n```\n' if text.startswith('```yaml\n') else '\n---\n'
    fm_close = text.find(close, 3)
    head, tail = text[:fm_close], text[fm_close:]
    head = '\n'.join(ln for ln in head.split('\n') if not ln.startswith('related: ['))
    return head + tail


# -- set mode --------------------------------------------------------------
original = sidecar()
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': original}])
content = out['content']
fm = fm_of(content)
parsed = yaml.safe_load(fm)
check(out['changed'] and out['note'] == 'set', 'set mode reports changed')
check(content.startswith('```yaml\n') and not content.startswith('---'),
      'set mode preserves the fenced frame (no --- frontmatter emitted)')
check(parsed['related'] == [{'doc': 17, 'file': 'lock-acquisition-test-plan__doc17.md', 's': 1003},
                            {'doc': 23, 'file': 'route-editing-spike__doc23.md', 's': 2},
                            {'doc': 9, 'file': 'locks-overview__doc9.md', 's': 1}],
      'metadata related-line yaml-parses to the 3 ranked entries in order')
region = content[content.find(BEGIN):content.find(END)]
check(region.count('\n- [') == 3 and '<!-- rel:17 -->' in region
      and '<!-- rel:23 -->' in region and '<!-- rel:9 -->' in region,
      'set mode renders 3 tagged bullets inside the marker region')
check('[Lock Acquisition Test Plan](<https://x/sites/s/Document Index Texts/'
      'lock-acquisition-test-plan__doc17.md>) — shared issue a#1' in region,
      'bullet carries linked title and why')
check(content.count('related: [decoy]') == 1 and
      strip_patchable(content) == strip_patchable(original),
      'body decoy line and stray seams byte-untouched (integrity outside patch zones)')

# -- idempotence -----------------------------------------------------------
[again] = patch([{'doc': 42, 'name': 'self.md', 'content': content}])
check(not again['changed'] and again['content'] == content,
      'idempotent: patch(patch(x)) == patch(x), changed false')

# -- empty set mode --------------------------------------------------------
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': content}], ranked=[])
check('_None yet._' in out['content'] and 'related: []' in fm_of(out['content']),
      'empty set mode renders _None yet._ / related: []')

# -- merge: insert, re-sort ------------------------------------------------
neighbor = sidecar(
    related_line='related: [{"doc":99,"file":"other__doc99.md","s":1}]',
    region='- [Other](<https://x/o.md>) — 1 shared keyword: locks <!-- rel:99 -->')
[out] = patch([{'doc': 17, 'name': 'n.md', 'content': neighbor}])
nfm = yaml.safe_load(fm_of(out['content']))
check(out['changed'] and out['note'] == 'merged' and
      [e['doc'] for e in nfm['related']] == [42, 99],
      'merge inserts doc 42 (s=1003) above the existing s=1 entry')
check('<!-- rel:42 -->' in out['content'] and '<!-- rel:99 -->' in out['content'],
      'merge keeps the existing bullet and adds the new tagged bullet')
nregion = out['content'][out['content'].find(BEGIN):out['content'].find(END)]
check(nregion.find('rel:42') < nregion.find('rel:99'),
      'merged bullets re-ordered by score')

# -- merge: update existing entry -----------------------------------------
stale = out['content'].replace('"s":1003', '"s":7')
[out2] = patch([{'doc': 17, 'name': 'n.md', 'content': stale}])
nfm2 = yaml.safe_load(fm_of(out2['content']))
check([e for e in nfm2['related'] if e['doc'] == 42][0]['s'] == 1003 and
      len([e for e in nfm2['related'] if e['doc'] == 42]) == 1,
      'merge of an existing doc id replaces it (reindex-safe)')

# -- fractional scores (RelatedRank v1.1 rarity weighting) -----------------
FRAC_RANKED = [{'doc': 17, 's': 0.876, 'why': '2 shared keywords: routes, testing',
                'sharedIds': [], 'sharedKeywords': ['routes', 'testing']}]
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': sidecar()}],
              ranked=FRAC_RANKED)
frac_fm = yaml.safe_load(fm_of(out['content']))
check(frac_fm['related'] == [{'doc': 17, 's': 0.876,
                              'file': 'lock-acquisition-test-plan__doc17.md'}],
      'set mode round-trips a fractional score through the metadata line')
[again] = patch([{'doc': 42, 'name': 'self.md', 'content': out['content']}],
                ranked=FRAC_RANKED)
check(not again['changed'] and again['content'] == out['content'],
      'idempotent with fractional scores (byte-stable float rendering)')
frac_neighbor = sidecar(
    related_line='related: [{"doc":42,"file":"conflict-prevention__doc42.md","s":2},'
                 '{"doc":99,"file":"other__doc99.md","s":1}]',
    region='- [Self](<https://x/s.md>) <!-- rel:42 -->\n'
           '- [Other](<https://x/o.md>) <!-- rel:99 -->')
[out] = patch([{'doc': 17, 'name': 'n.md', 'content': frac_neighbor}],
              ranked=FRAC_RANKED)
frac_nfm = yaml.safe_load(fm_of(out['content']))
check([(e['doc'], e['s']) for e in frac_nfm['related']] == [(99, 1), (42, 0.876)],
      'merge replaces a stale integer score with the fractional one, re-sorts')

# -- merge: eviction past the cap -----------------------------------------
five = ','.join(f'{{"doc":{d},"file":"d{d}__doc{d}.md","s":{s}}}'
                for d, s in ((60, 50), (61, 40), (62, 30), (63, 20), (64, 10)))
full = sidecar(related_line=f'related: [{five}]',
               region='\n'.join(f'- [D{d}](<https://x/d{d}.md>) <!-- rel:{d} -->'
                                for d in (60, 61, 62, 63, 64)))
[out] = patch([{'doc': 17, 'name': 'n.md', 'content': full}])
ffm = yaml.safe_load(fm_of(out['content']))
check([e['doc'] for e in ffm['related']] == [42, 60, 61, 62, 63] and
      'rel:64' not in out['content'],
      'merge past the cap evicts the weakest (doc 64)')

# -- merge with no pair evidence ------------------------------------------
[out] = patch([{'doc': 77, 'name': 'n.md', 'content': neighbor}])
check(not out['changed'] and out['note'] == 'no-pair-evidence',
      'merge without symmetric evidence is a no-op')

# -- merge into a legacy --- neighbor: patched, frame preserved ------------
dash_neighbor = sidecar(
    related_line='related: [{"doc":99,"file":"other__doc99.md","s":1}]',
    region='- [Other](<https://x/o.md>) — 1 shared keyword: locks <!-- rel:99 -->',
    frame='dash')
[out] = patch([{'doc': 17, 'name': 'n.md', 'content': dash_neighbor}])
check(out['changed'] and out['note'] == 'merged' and
      out['content'].startswith('---\n') and '```' not in out['content'],
      'legacy --- neighbor still merges; dash frame preserved')
dfm = yaml.safe_load(fm_of(out['content']))
check([e['doc'] for e in dfm['related']] == [42, 99],
      'legacy-frame merge inserts doc 42 above the existing entry')

# -- marker-missing fallback (pre-v2.3 sidecar, legacy --- frame) ---------
legacy = sidecar(markers=True, frame='dash').replace(
    f'## Related documents\n\n{BEGIN}\n_None yet._\n{END}\n\n', '')
legacy = '\n'.join(ln for ln in legacy.split('\n') if not ln.startswith('related: ['))
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': legacy}])
lfm = fm_of(out['content'])
check(out['changed'] and BEGIN in out['content'] and END in out['content'] and
      '## Related documents' in out['content'],
      'pre-v2.3 sidecar gains the section (marker-missing fallback)')
check(out['content'].startswith('---\n') and '```' not in out['content'],
      'pre-v2.3 sidecar keeps its --- frame (conversion is the backfill\'s job)')
check(lfm.split('\n').index('related: ' + json.dumps(
          [{'doc': 17, 'file': 'lock-acquisition-test-plan__doc17.md', 's': 1003},
           {'doc': 23, 'file': 'route-editing-spike__doc23.md', 's': 2},
           {'doc': 9, 'file': 'locks-overview__doc9.md', 's': 1}],
          separators=(',', ':'))) ==
      [i for i, ln in enumerate(lfm.split('\n')) if ln.startswith('tools:')][0] + 1,
      'fallback inserts the related-line right after tools:')
body = out['content'][out['content'].find('\n---\n', 3) + 5:]
check(body.find('## Summary') < body.find('## Related documents') < body.find('\n---\n', body.find('## Summary')),
      'fallback section lands between ## Summary and the seam')
check(body.find(END) < body.find('\n---\n', body.find('## Summary')),
      'fallback section sits before the header/body seam')

# -- malformed markers -> no-op -------------------------------------------
broken = sidecar().replace(END, '')
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': broken}])
check(not out['changed'] and out['note'] == 'malformed-markers' and
      out['content'] == broken,
      'begin-without-end -> no-op, byte-identical, noted')

# -- not a frontmatter file -> no-op --------------------------------------
[out] = patch([{'doc': 42, 'name': 'x.md', 'content': 'no frontmatter here'}])
check(not out['changed'] and out['note'] == 'not-frontmatter',
      'non-frontmatter content -> no-op, noted')

# -- v1.2: folder pass-through (kind-subfolder routing) --------------------
fa, fb = patch([
    {'doc': 42, 'name': 'self.md', 'folder': '/LRS Doc Index/User Stories',
     'content': sidecar()},
    {'doc': 17, 'name': 'n.md', 'folder': '/LRS Doc Index/Test Plans',
     'content': neighbor},
])
check(fa['folder'] == '/LRS Doc Index/User Stories' and
      fb['folder'] == '/LRS Doc Index/Test Plans' and
      fa['note'] == 'set' and fb['note'] == 'merged',
      'folder passes through verbatim in set and merge modes')
[fc] = patch([{'doc': 42, 'name': 'self.md', 'content': sidecar()}])
check(fc['folder'] == '', 'folder-less file object comes back with folder ""')

# ---- type-check both wrapped runners (separately — each Office Script
# is its own global scope, so joint compilation would false-collide) ------
for runner in ('rr_v11.ts', 'scp_v12.ts'):
    tsc = subprocess.run(['npx', '--yes', 'tsc', '--noEmit', '--target', 'es2017',
                          '--lib', 'es2017,dom', runner],
                         capture_output=True, text=True, encoding='utf-8')
    check(tsc.returncode == 0, f'{runner} type-checks at ES2017'
          + ('' if tsc.returncode == 0 else '\n' + tsc.stdout[-1500:]))

print()
if failures:
    print(f'RESULT: FAIL ({len(failures)} failed)')
    sys.exit(1)
print('RESULT: PASS')
