"""Assertions for the related-documents scripts (current scripts/ versions).

Wraps scripts/RelatedRank.ts and scripts/SidecarPatch.ts into
standalone Node runners (same pattern as rex_cur.ts) and asserts the
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
   10. RelatedRank v1.2 defensive cases: an idLinks row where neither
       endpoint is self credits nobody; title-less keywords score but
       never leak raw ids into why/sharedKeywords
   11. SidecarPatch v1.3 hardening: BOM/CRLF input is normalized and
       patched (unsafe files keep original bytes); bullets escape
       ] --> > metacharacters; meta-less fallback entries render
       unlinked (folded from check_batch.py on the 2026-08-11
       promotion)
   12. RelatedRank v2.0 (r3 overhaul; the legacy cases 1-10 above run
       UNCHANGED through the new signature — kind-less keywords read
       as topic x1.0 and empty new params are the legacy behavior):
       every Doc Links edge type scores by its config weight (id
       keeps unique-shared-value counting; others count Strength,
       else SharedValues, else 1; unknown types are ignored); the
       soft cap (999) is exercised exactly and an id link outranks
       it (HA-9); keyword kinds weigh topic/tool/product; alias
       keyword ids fold onto their canonical (DX-2); metadata
       affinity and pair-min recency re-rank in final mode only,
       stay symmetric, and a non-empty candsMeta restricts the
       final universe to the fetched shortlist; configJson
       deep-merges over defaults and shrugs off garbage; `flags`
       reports inputs at their configured ceilings
   13. RelatedRank v2.1 (r4 upgrade; same signature as v2.0, and
       v2.0-shaped input scores unchanged): non-id edge scores join
       the softCap bucket, so no Strength pile outranks an id link
       at default weights (softCap stays the config escape hatch);
       PE/Dev affinity matches on ;-/,-//-separated name-set overlap
       instead of string equality (exact-equal still matches, empty
       never does); final mode adds title-token affinity — shared
       distinctive title tokens (3+ chars, letter-bearing, stopworded,
       deduped, alphabetical) score title.weight each up to title.cap,
       need BOTH titles present (selfMeta "title" + candidate Title),
       stay symmetric, and surface as an 'N title words:' why part;
       title.stop appends corpus stopwords from config
   14. SidecarPatch v1.5 (flow v2.7 / PromptVersion v1.9): a THIRD
       metadata frame — H1 title + info table head, then the fenced
       yaml inside <details><summary>Metadata</summary> — patches in
       set and merge modes with the head carried byte-for-byte;
       mixed-frame batches keep each file's own frame; a details
       opener after a section heading, an unclosed <details>, or an
       H1 with no block at all are no-ops with original bytes; the
       two legacy frames patch exactly as in v1.4 (r5 equivalence)

Both wrapped runners must type-check at ES2017.

Prereqs: none beyond Node 22+ and pyyaml (fixtures not needed).
Exit code: non-zero on any failed assertion.
"""
import json
import os
import subprocess
import sys

import yaml

# check_batch.py points this at a staged patch set to gate a script
# batch with the full suite before pasting; default is the shipped set.
SCRIPTS = os.environ.get('HARNESS_SCRIPTS', '../../scripts')

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
           "p.mode !== undefined ? p.mode : 'final', "
           "p.myKwsRaw !== undefined ? p.myKwsRaw : JSON.stringify(p.myKws), "
           "p.sharersRaw !== undefined ? p.sharersRaw : JSON.stringify(p.sharers), "
           "p.idLinksRaw !== undefined ? p.idLinksRaw : JSON.stringify(p.idLinks), "
           "p.kwMetaRaw !== undefined ? p.kwMetaRaw : JSON.stringify(p.kwMeta !== undefined ? p.kwMeta : []), "
           "p.candsMetaRaw !== undefined ? p.candsMetaRaw : JSON.stringify(p.candsMeta !== undefined ? p.candsMeta : []), "
           "JSON.stringify(p.selfMeta !== undefined ? p.selfMeta : {}), "
           "p.configRaw !== undefined ? p.configRaw : JSON.stringify(p.config !== undefined ? p.config : {}), "
           "p.topN")
SCP_ARGS = ("null as unknown, JSON.stringify(p.files), p.selfId, "
            "JSON.stringify(p.ranked), JSON.stringify(p.docsMeta), "
            "JSON.stringify(p.selfMeta), p.topN")

for src, runner, args in ((f'{SCRIPTS}/RelatedRank.ts', 'rr_cur.ts', RR_ARGS),
                          (f'{SCRIPTS}/SidecarPatch.ts', 'scp_cur.ts', SCP_ARGS)):
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
print('== RelatedRank ==')

KW = [(1, 'locks'), (2, 'routes'), (3, 'conflict prevention'), (4, 'route editing'),
      (5, 'events'), (6, 'calibration'), (7, 'gaps'), (8, 'measures')]
my_kws = [kwrow(42, kid, t) for kid, t in KW]

# doc 10 shares all 8 keywords; doc 11 shares one issue id only
sharers = ([kwrow(10, kid, t) for kid, t in KW]
           + [kwrow(42, 1, 'locks')])          # self rows must be ignored
links = [idlink(11, 42, 'ArcGISPro/ps-location-referencing#4855')]

r = run('rr_cur.ts', {'selfId': '42', 'myKws': my_kws, 'sharers': sharers,
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
r = run('rr_cur.ts', {'selfId': '42', 'myKws': my_kws,
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
r = run('rr_cur.ts', {'selfId': '42', 'myKws': my_kws, 'sharers': sharers,
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
r = run('rr_cur.ts', {'selfId': '42', 'myKws': rarity_kws,
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

r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [], 'topN': 5})
check(r['count'] == 0 and r['related'] == [], 'empty inputs -> count 0')

# malformed params must not throw — the *Raw fields skip the appendix's
# JSON.stringify, so genuinely invalid JSON reaches parseRows' try/catch
# (a stringified junk string would arrive as VALID JSON and never hit it)
r = run('rr_cur.ts', {'selfId': '42', 'myKwsRaw': 'not json',
                      'sharersRaw': '[{"Document":', 'idLinksRaw': 'null',
                      'topN': 5})
check(r['count'] == 0 and r['related'] == [],
      'malformed JSON params -> empty result, no throw (parse guard exercised)')
# valid-JSON-but-wrong-type params degrade the same way
r = run('rr_cur.ts', {'selfId': '42', 'myKws': 'not json', 'sharers': 42,
                      'idLinks': None, 'topN': 5})
check(r['count'] == 0 and r['related'] == [],
      'wrong-type params -> empty result, no throw')

# ==== RelatedRank v2.0 (r3) ==============================================
print('== RelatedRank v2.0 ==')


def link(a, b, ltype, shared='', strength=None):
    row = {'DocA': {'Id': a}, 'DocB': {'Id': b}, 'SharedValues': shared,
           'LinkType': ltype}
    if strength is not None:
        row['Strength'] = strength
    return row


def kwmeta(kid, kind=None, canonical=None, title=''):
    row = {'ID': kid, 'Title': title}
    if kind is not None:
        row['Kind'] = {'Value': kind}
    if canonical is not None:
        row['CanonicalRef'] = {'Id': canonical}
    return row


def candrow(doc, **fields):
    row = {'ID': doc}
    for k in ('DocKind', 'Surface'):
        if k in fields:
            row[k] = {'Value': fields[k]}
    for k in ('TargetRelease', 'PE', 'Dev', 'SourceModified', 'Title'):
        if k in fields:
            row[k] = fields[k]
    return row


# -- per-edge-type weights (default id 1000 / review 100 / gantt 60 /
#    titlematch 40; unknown ignored; id still beats the lot combined) -----
edge_links = [link(42, 64, 'id', 'x#1'),
              link(42, 60, 'gantt', strength=3),
              link(42, 62, 'review'),
              link(42, 61, 'titlematch'),
              link(42, 63, 'wormhole', 'a;b'),
              link(42, 65, 'gantt', strength=3), link(42, 65, 'review'),
              link(42, 65, 'titlematch')]
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': edge_links, 'topN': 10})
by_doc = {e['doc']: e for e in r['related']}
check(r['docIds'] == [64, 65, 60, 62, 61],
      f"per-type weights rank id > combined(320) > gantt > review > titlematch (got {r['docIds']})")
check(by_doc[64]['s'] == 1000 and by_doc[65]['s'] == 320 and
      by_doc[60]['s'] == 180 and by_doc[62]['s'] == 100 and by_doc[61]['s'] == 40,
      'per-type scores: 1000 / 320 / 180 (Strength 3) / 100 / 40')
check(63 not in by_doc, 'unknown LinkType weighs 0 — row ignored, never crashes')
check(by_doc[60]['why'] == 'gantt link (3 shared)' and
      by_doc[61]['why'] == 'titlematch link' and
      by_doc[65]['why'] == 'gantt link (3 shared) · review link · titlematch link',
      'non-id edges explain themselves in why')

# -- Strength vs SharedValues fallback chain -------------------------------
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [link(42, 70, 'gantt', 'a;b', strength=4),
                                  link(42, 71, 'gantt', 'a;b'),
                                  link(42, 72, 'gantt')], 'topN': 5})
by_doc = {e['doc']: e for e in r['related']}
check(by_doc[70]['s'] == 240 and by_doc[71]['s'] == 120 and by_doc[72]['s'] == 60,
      'edge count: Strength (4) beats SharedValues (2) beats implicit 1')

# -- GetItems choice shape: LinkType as {Value} object ---------------------
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [{'DocA': {'Id': 42}, 'DocB': {'Id': 80},
                                   'SharedValues': 'x#9',
                                   'LinkType': {'Value': 'id'}}], 'topN': 5})
check(r['count'] == 1 and r['related'][0]['s'] == 1000,
      'LinkType arriving as a {Value} choice object still scores')

# -- HA-9: the soft cap is reachable, exact, and id-dominated --------------
big_kws = [kwrow(42, i, 'kw%04d' % i) for i in range(1, 1201)]
big_sharers = [kwrow(50, i, 'kw%04d' % i) for i in range(1, 1201)]
r = run('rr_cur.ts', {'selfId': '42', 'myKws': big_kws, 'sharers': big_sharers,
                      'idLinks': [idlink(51, 42, 'x#1')], 'topN': 5})
by_doc = {e['doc']: e for e in r['related']}
check(by_doc[50]['s'] == 999, '1200 rare keywords cap at exactly 999 (HA-9)')
check(r['docIds'] == [51, 50],
      'one id link (1000) still outranks a capped keyword pile (999)')
check(', +1196 more' in by_doc[50]['why'], 'capped entry keeps the compact why')

# -- truncation flags: inputs at their configured ceilings -----------------
tight = {'tops': {'myKws': 2, 'sharers': 3, 'links': 1}}
r = run('rr_cur.ts', {'selfId': '42',
                      'myKws': [kwrow(42, 1, 'locks'), kwrow(42, 2, 'routes')],
                      'sharers': [kwrow(10, 1, 'locks'), kwrow(10, 2, 'routes'),
                                  kwrow(11, 1, 'locks')],
                      'idLinks': [idlink(11, 42, 'x#1')],
                      'config': tight, 'topN': 5})
check(r['flags'] == 'myKws-at-top,sharers-at-top,links-at-top',
      f"every input at its ceiling is flagged (got '{r['flags']}')")
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [kwrow(42, 1, 'locks')],
                      'sharers': [kwrow(10, 1, 'locks')],
                      'idLinks': [], 'topN': 5})
check(r['flags'] == '', 'inputs below every ceiling -> flags empty')

# -- keyword kind multipliers (topic 1.0 / tool 0.6 / product 0.4) ---------
kind_payload = {'selfId': '42',
                'myKws': [kwrow(42, 1, 'arcgis pro'), kwrow(42, 2, 'calibration')],
                'sharers': [kwrow(70, 1, 'arcgis pro'), kwrow(71, 2, 'calibration')],
                'idLinks': [],
                'kwMeta': [kwmeta(1, kind='product'), kwmeta(2, kind='topic')],
                'topN': 5}
r = run('rr_cur.ts', kind_payload)
by_doc = {e['doc']: e for e in r['related']}
check(r['docIds'] == [71, 70] and by_doc[71]['s'] == 1 and by_doc[70]['s'] == 0.4,
      'same rarity: a topic keyword outranks a product keyword (1.0 vs 0.4)')
r = run('rr_cur.ts', dict(kind_payload, config={'kwKind': {'product': 0.9}}))
check({e['doc']: e['s'] for e in r['related']}[70] == 0.9,
      'kind multipliers read from config (product overridden to 0.9)')

# -- DX-2: alias keyword ids fold onto their canonical ---------------------
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [kwrow(42, 1, 'locks')],
                      'sharers': [kwrow(10, 900, '')],
                      'idLinks': [],
                      'kwMeta': [kwmeta(1, kind='topic'),
                                 kwmeta(900, canonical=1)], 'topN': 5})
check(r['count'] == 1 and r['related'][0]['s'] == 1 and
      r['related'][0]['sharedKeywords'] == ['locks'],
      'alias-only sharer folds onto the canonical (df=1, canonical title)')
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [kwrow(42, 1, 'locks')],
                      'sharers': [kwrow(10, 900, ''), kwrow(11, 1, 'locks')],
                      'idLinks': [],
                      'kwMeta': [kwmeta(1, kind='topic'),
                                 kwmeta(900, canonical=1)], 'topN': 5})
check([e['s'] for e in r['related']] == [0.631, 0.631],
      'alias and direct sharers share one df (both docs at 1/log2(3))')

# -- metadata affinity re-ranks the final phase ----------------------------
meta_payload = {'selfId': '42', 'mode': 'final',
                'myKws': [kwrow(42, 1, 'locks')],
                'sharers': [kwrow(80, 1, 'locks'), kwrow(81, 1, 'locks'),
                            kwrow(82, 1, 'locks')],
                'idLinks': [],
                'candsMeta': [candrow(80, TargetRelease='3.8', Surface='pro'),
                              candrow(81, DocKind='Test Plan')],
                'selfMeta': {'kind': 'User Story', 'surface': 'Pro',
                             'release': '3.8', 'pe': '', 'dev': '',
                             'modified': ''},
                'topN': 5}
r = run('rr_cur.ts', meta_payload)
by_doc = {e['doc']: e for e in r['related']}
check(r['docIds'] == [80, 81],
      'final mode: shortlist metadata re-ranks; non-shortlist doc 82 drops')
check(by_doc[80]['s'] == 2.0 and by_doc[81]['s'] == 0.5,
      'df=3 base 0.5; release match +1.0, case-insensitive surface +0.5 (2.0)')
check(by_doc[80]['why'].endswith('also: same surface, release 3.8'),
      'meta tail names the matches')
check('also:' not in by_doc[81]['why'],
      'kind mismatch (Test Plan vs User Story) earns no meta tail')
check(by_doc[81]['s'] == 0.5,
      'empty-vs-empty pe/dev never matches (no phantom +0.75s on doc 81)')
r = run('rr_cur.ts', dict(meta_payload, mode='shortlist'))
check(r['docIds'] == [82, 81, 80] and
      all(e['s'] == 0.5 for e in r['related']),
      'shortlist mode: no metadata, full universe, pure keyword ties')

# -- recency: pair-min ages, day granularity, pinned today -----------------
rec_exp = round(1 + 2 ** (-365 / 180), 3)
rec_payload = {'selfId': '42', 'mode': 'final',
               'myKws': [kwrow(42, 1, 'locks')],
               'sharers': [kwrow(80, 1, 'locks')],
               'idLinks': [],
               'candsMeta': [candrow(80, SourceModified='2025-08-12T00:00:00Z')],
               'selfMeta': {'kind': '', 'surface': '', 'release': '', 'pe': '',
                            'dev': '', 'modified': '2026-08-10T00:00:00Z'},
               'config': {'today': '2026-08-12'}, 'topN': 5}
r = run('rr_cur.ts', rec_payload)
check(r['related'][0]['s'] == rec_exp,
      f'recency: 365-day-old pair-min decays to +{round(rec_exp - 1, 3)} (3 decimals)')
swapped = dict(rec_payload,
               candsMeta=[candrow(80, SourceModified='2026-08-10T00:00:00Z')],
               selfMeta=dict(rec_payload['selfMeta'],
                             modified='2025-08-12T00:00:00Z'))
r2 = run('rr_cur.ts', swapped)
check(r2['related'][0]['s'] == rec_exp,
      'recency is pair-min: swapping which doc is stale changes nothing')
r3 = run('rr_cur.ts', dict(rec_payload, selfMeta=dict(rec_payload['selfMeta'],
                                                      modified='')))
check(r3['related'][0]['s'] == 1, 'missing self date -> no recency bonus')

# -- symmetry: s(A->B) == s(B->A) with meta + recency enabled --------------
def sym_side(me, other):
    return {'selfId': str(me), 'mode': 'final',
            'myKws': [kwrow(me, 1, 'locks')],
            'sharers': [kwrow(other, 1, 'locks')],
            'idLinks': [link(min(me, other), max(me, other), 'gantt', strength=2)],
            'candsMeta': [candrow(other, DocKind='Test Plan', TargetRelease='3.8',
                                  SourceModified='2026-06-01T00:00:00Z' if other == 17
                                  else '2026-08-01T00:00:00Z')],
            'selfMeta': {'kind': 'Test Plan', 'surface': '', 'release': '3.8',
                         'pe': '', 'dev': '',
                         'modified': '2026-06-01T00:00:00Z' if me == 17
                         else '2026-08-01T00:00:00Z'},
            'config': {'today': '2026-08-12'}, 'topN': 5}


ra = run('rr_cur.ts', sym_side(42, 17))
rb = run('rr_cur.ts', sym_side(17, 42))
check(ra['related'][0]['s'] == rb['related'][0]['s'] and ra['count'] == 1,
      f"symmetry: s(42->17) == s(17->42) == {ra['related'][0]['s']}")

# -- config hardening: garbage/partial/unknown-mode degrade gracefully -----
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [idlink(11, 42, 'x#1')],
                      'configRaw': '{{{not json', 'topN': 5})
check(r['count'] == 1 and r['related'][0]['s'] == 1000,
      'garbage configJson -> defaults, no throw')
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [idlink(11, 42, 'x#1')],
                      'config': {'edge': {'id': 5}}, 'topN': 5})
check(r['related'][0]['s'] == 5,
      'partial config deep-merges (edge.id alone overridden)')
r = run('rr_cur.ts', {'selfId': '42', 'mode': 'banana',
                      'myKws': [kwrow(42, 1, 'locks')],
                      'sharers': [kwrow(10, 1, 'locks'), kwrow(11, 1, 'locks')],
                      'idLinks': [], 'candsMeta': [candrow(10)], 'topN': 5})
check(r['docIds'] == [10],
      'unknown mode reads as final (candsMeta restriction applies)')

# ==== RelatedRank v2.1 (r4) ==============================================
print('== RelatedRank v2.1 ==')

# -- total id dominance: non-id edges join the softCap bucket --------------
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [link(42, 60, 'gantt', strength=20),
                                  idlink(61, 42, 'x#1')], 'topN': 5})
by_doc = {e['doc']: e for e in r['related']}
check(r['docIds'] == [61, 60] and by_doc[60]['s'] == 999,
      'gantt Strength 20 (raw 1200) caps at 999 — the id link stays first')
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [kwrow(42, 1, 'locks')],
                      'sharers': [kwrow(60, 1, 'locks')],
                      'idLinks': [link(42, 60, 'review', strength=10)],
                      'topN': 5})
check(r['related'][0]['s'] == 999,
      'edges and keywords share ONE bucket (review 1000 + kw 1 -> 999)')
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [link(42, 60, 'gantt', strength=20),
                                  idlink(61, 42, 'x#1')],
                      'config': {'softCap': 5000}, 'topN': 5})
check(r['docIds'] == [60, 61] and r['related'][0]['s'] == 1200,
      'raising softCap in config re-opens the bucket (the escape hatch)')
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [link(42, 60, 'gantt', strength=3)], 'topN': 5})
check(r['related'][0]['s'] == 180,
      'below the cap non-id edge scores are unchanged from v2.0 (60 x 3)')

# -- PE/Dev name-set overlap (multi-name person fields) --------------------
pe_base = {'selfId': '42', 'mode': 'final',
           'myKws': [kwrow(42, 1, 'locks')],
           'sharers': [kwrow(80, 1, 'locks')],
           'idLinks': [],
           'selfMeta': {'kind': '', 'surface': '', 'release': '',
                        'pe': 'jane doe', 'dev': '', 'modified': ''},
           'topN': 5}
r = run('rr_cur.ts', dict(pe_base,
                          candsMeta=[candrow(80, PE='Jane Doe; John Roe')]))
check(r['related'][0]['s'] == 1.75 and
      r['related'][0]['why'].endswith('also: same pe'),
      'multi-name PE overlaps a single name (set match, case-insensitive)')
r = run('rr_cur.ts', dict(pe_base,
                          candsMeta=[candrow(80, PE='Jane Doe')]))
check(r['related'][0]['s'] == 1.75,
      'exact-equal PE still matches (equality is a subset of overlap)')
r = run('rr_cur.ts', dict(pe_base,
                          candsMeta=[candrow(80, PE='John Roe')]))
check(r['related'][0]['s'] == 1, 'disjoint name sets earn no pe bonus')
r = run('rr_cur.ts', dict(pe_base,
                          selfMeta=dict(pe_base['selfMeta'], pe='',
                                        dev='b. jones'),
                          candsMeta=[candrow(80, Dev='A. Smith / B. Jones')]))
check(r['related'][0]['s'] == 1.75 and
      r['related'][0]['why'].endswith('also: same dev'),
      'Dev splits on / too; empty PE never matches')

# -- title-token affinity (final mode) -------------------------------------
ttl_base = {'selfId': '42', 'mode': 'final',
            'myKws': [kwrow(42, 1, 'locks')],
            'sharers': [kwrow(80, 1, 'locks')],
            'idLinks': [],
            'candsMeta': [candrow(80, Title='Calibration Editing Test Plan V3')],
            'selfMeta': {'kind': '', 'surface': '', 'release': '', 'pe': '',
                         'dev': '', 'modified': '',
                         'title': 'LRS Calibration Editing Workflows'},
            'topN': 5}
r = run('rr_cur.ts', ttl_base)
check(r['related'][0]['s'] == 1.8,
      'two shared distinctive title tokens add 2 x 0.4 (stopwords out)')
check('2 title words: calibration, editing' in r['related'][0]['why'],
      'why names the shared title tokens, alphabetical')
r = run('rr_cur.ts', dict(ttl_base,
                          candsMeta=[candrow(80, Title='LRS Test Plan Draft')],
                          selfMeta=dict(ttl_base['selfMeta'],
                                        title='Lrs Test Plan Overview')))
check(r['related'][0]['s'] == 1 and 'title word' not in r['related'][0]['why'],
      'corpus-generic tokens (lrs/test/plan/...) never count')
r = run('rr_cur.ts', dict(ttl_base,
                          selfMeta=dict(ttl_base['selfMeta'], title='')))
check(r['related'][0]['s'] == 1,
      'absent self title (v2.0-shaped selfMeta) -> no title term at all')
many = 'Alpha Bravo Charlie Delta Echo Foxtrot Golf Hotel'
r = run('rr_cur.ts', dict(ttl_base, candsMeta=[candrow(80, Title=many)],
                          selfMeta=dict(ttl_base['selfMeta'], title=many)))
check(r['related'][0]['s'] == 3.4 and
      '6 title words: alpha, bravo, charlie, +3 more' in r['related'][0]['why'],
      'shared tokens count at most title.cap (6); why shows 3 + more')
r = run('rr_cur.ts', dict(ttl_base, config={'title': {'weight': 1.0, 'cap': 1}}))
check(r['related'][0]['s'] == 2 and
      '1 title word: calibration' in r['related'][0]['why'],
      'title.weight and title.cap read from config')
r = run('rr_cur.ts', dict(ttl_base, config={'title': {'stop': ['calibration']}}))
check(r['related'][0]['s'] == 1.4,
      'title.stop appends corpus stopwords from config')
r = run('rr_cur.ts', dict(ttl_base, mode='shortlist', candsMeta=[]))
check(r['related'][0]['s'] == 1,
      'shortlist mode: title affinity is a final-phase re-ranker only')


def ttl_side(me, other, my_title, other_title):
    return {'selfId': str(me), 'mode': 'final',
            'myKws': [kwrow(me, 1, 'locks')],
            'sharers': [kwrow(other, 1, 'locks')],
            'idLinks': [],
            'candsMeta': [candrow(other, Title=other_title,
                                  PE='Jane Doe; John Roe' if other == 17
                                  else 'jane doe')],
            'selfMeta': {'kind': '', 'surface': '', 'release': '',
                         'pe': 'jane doe' if me == 42 else 'Jane Doe; John Roe',
                         'dev': '', 'modified': '', 'title': my_title},
            'topN': 5}


ra = run('rr_cur.ts', ttl_side(42, 17, 'LRS Calibration Editing Workflows',
                               'Calibration Editing Test Plan V3'))
rb = run('rr_cur.ts', ttl_side(17, 42, 'Calibration Editing Test Plan V3',
                               'LRS Calibration Editing Workflows'))
check(ra['related'][0]['s'] == rb['related'][0]['s'] == 2.55,
      'symmetry holds with title + person-set terms (both sides 2.55)')

# ==== SidecarPatch ========================================================
print('== SidecarPatch ==')

BEGIN = '<!-- related:begin -->'
END = '<!-- related:end -->'


DETAILS_OPEN = '<details><summary>Metadata</summary>\n\n```yaml\n'
DETAILS_CLOSE = '\n```\n\n</details>\n'
COMMENT_OPEN = '<!-- metadata\n```yaml\n'
COMMENT_CLOSE = '\n```\n-->\n'


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
    if frame in ('details', 'comment'):
        # the headed shapes: flow v2.7 / PromptVersion v1.9 wraps the
        # yaml in <details>; flow v2.8 / PromptVersion v2.0 hides it in
        # an HTML comment. Same H1 + info table head either way.
        opener, closer = ((DETAILS_OPEN, DETAILS_CLOSE) if frame == 'details'
                          else (COMMENT_OPEN, COMMENT_CLOSE))
        return f'''# Conflict "Prevention": Acquire Locks for New Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Issue** | [ArcGISPro/x#101](https://devtopia.esri.com/ArcGISPro/x/issues/101) |
| **Extracted** | 2026-08-13 · lane `xmlstrip` |

{opener}{fm}{closer}
{tail}'''
    fm_open, fm_close = ('```yaml', '```') if frame == 'fence' else ('---', '---')
    return f'''{fm_open}
{fm}
{fm_close}

# Conflict "Prevention": Acquire Locks for New Routes

{tail}'''


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
    return run('scp_cur.ts', {'files': files, 'selfId': '42', 'ranked': ranked,
                              'docsMeta': meta, 'selfMeta': SELF_META,
                              'topN': top})['files']


def fm_of(text):
    """Inner YAML of the metadata block, whichever frame the file carries."""
    if text.startswith('# '):
        opener, closer = ((COMMENT_OPEN, COMMENT_CLOSE) if COMMENT_OPEN in text
                          else (DETAILS_OPEN, DETAILS_CLOSE))
        start = text.index(opener) + len(opener)
        return text[start:text.index(closer, start)]
    if text.startswith('```yaml\n'):
        return text[len('```yaml\n'):text.index('\n```\n')]
    return text[4:text.index('\n---\n', 3)]


def strip_patchable(text):
    """Remove the fm related-line and the first marker region."""
    b, e = text.find(BEGIN), text.find(END)
    if b >= 0 and e > b:
        text = text[:b] + text[e + len(END):]
    if text.startswith('```yaml\n') or text.startswith('# '):
        close = '\n```\n'
    else:
        close = '\n---\n'
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

# -- v1.2: idLinks row with neither endpoint = self -----------------------
r = run('rr_cur.ts', {'selfId': '42', 'myKws': [], 'sharers': [],
                      'idLinks': [idlink(7, 8, 'a#1')], 'topN': 5})
check(r['count'] == 0, 'idLinks row with neither endpoint = self credits nobody')

# -- v1.2: title-less keywords score but never surface raw ids ------------
r = run('rr_cur.ts', {'selfId': '42',
                      'myKws': [kwrow(42, 1, 'locks'),
                                {'Document': {'Id': 42}, 'Keyword': {'Id': 5}}],
                      'sharers': [kwrow(10, 1, 'locks'),
                                  {'Document': {'Id': 10}, 'Keyword': {'Id': 5}}],
                      'idLinks': [], 'topN': 5})
check(r['count'] == 1 and r['related'][0]['s'] == 2,
      'title-less keyword still counts toward the score (s == 2)')
check(r['related'][0]['why'] == '1 shared keyword: locks' and
      r['related'][0]['sharedKeywords'] == ['locks'],
      'title-less keyword leaves why/sharedKeywords (no raw ids)')

# -- v1.3: BOM/CRLF sidecar is normalized and patched ---------------------
crlf = '﻿' + sidecar().replace('\n', '\r\n')
[out] = patch([{'doc': 42, 'name': 's.md', 'content': crlf}])
check(out['changed'] and '\r' not in out['content'] and '﻿' not in out['content'],
      'BOM+CRLF sidecar is normalized (patchable again)')
check('<!-- rel:17 -->' in out['content'], 'normalized sidecar received the patch')
[again] = patch([{'doc': 42, 'name': 's.md', 'content': out['content']}])
check(not again['changed'] and again['content'] == out['content'],
      'idempotent after normalization')

# -- v1.3: unsafe-to-patch input keeps its ORIGINAL bytes -----------------
junk = 'no frontmatter here\r\nat all'
[out] = patch([{'doc': 42, 'name': 'x.md', 'content': junk}])
check(not out['changed'] and out['content'] == junk and out['note'] == 'not-frontmatter',
      'unsafe file returns original bytes untouched (CRLF included)')

# -- v1.3: bullet metacharacter escaping ----------------------------------
bad_meta = [{'ID': 17, 'Title': 'Bad] --> [Title',
             'TextFileUrl': 'https://x/s/Test Plans/we>ird__doc17.md'}]
[out] = patch([{'doc': 42, 'name': 's.md', 'content': sidecar()}], meta=bad_meta)
check('[Bad - Title](<https://x/s/Test Plans/we%3Eird__doc17.md>)' in out['content'],
      'bullet escapes ] --> and > in title/url')

# -- v1.3: meta-less fallback entry renders unlinked ----------------------
fb_neighbor = sidecar(related_line='related: [{"doc":99,"file":"other__doc99.md","s":1}]')
[out] = patch([{'doc': 17, 'name': 'n.md', 'content': fb_neighbor}])
fb_line = [ln for ln in out['content'].split('\n') if 'rel:99' in ln]
check(bool(fb_line) and '](' not in fb_line[0] and 'other__doc99.md' in fb_line[0],
      'meta-less entry renders as plain text, not a bare-filename link')

# -- v1.4 (SB-2, folded from check_batch_r2.py): every root related: form
# is REPLACED, never duplicated ------------------------------------------
for tag, rel in (('block-sequence', 'related:\n  - doc: 9\n    file: x.md\n    s: 1'),
                 ('null-value', 'related: null'),
                 ('extra-space inline', 'related:  [{"doc": 9, "file": "x.md", "s": 1}]')):
    [out] = patch([{'doc': 17, 'name': 'n.md', 'content': sidecar(related_line=rel)}])
    fm2 = out['content'].split('```')[1]
    n_rel = sum(1 for ln in fm2.split('\n') if ln.startswith('related:'))
    check(n_rel == 1, f'v1.4: one related: key after patching a {tag} form (got {n_rel})')
    check('  - doc: 9' not in fm2, f'v1.4: {tag} continuation lines consumed')

# -- v1.4 (SB-3): duplicate doc ids in ranked dedupe, highest score wins --
dup_ranked = [{'doc': 17, 's': 900.0, 'why': 'w1'}, {'doc': 17, 's': 5.0, 'why': 'w2'}]
[out] = patch([{'doc': 42, 'name': 's.md', 'content': sidecar()}], ranked=dup_ranked)
check(out['content'].count('rel:17') == 1 and '"s":900' in out['content'],
      f"v1.4: duplicate ranked doc renders once at its best score (x{out['content'].count('rel:17')})")

# -- v1.5: details-frame sidecar (flow v2.7 / PromptVersion v1.9) ---------
det = sidecar(frame='details')
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': det}])
check(out['changed'] and out['note'] == 'set' and
      out['content'].startswith('# Conflict "Prevention"'),
      'v1.5: details frame patches in set mode; H1 stays at byte 0')
check(out['content'].count('<details>') == 1 and
      out['content'].count('</details>') == 1 and
      DETAILS_OPEN in out['content'],
      'v1.5: details frame preserved on rewrite (no conversion)')
check(out['content'][:out['content'].index('<details>')] ==
      det[:det.index('<details>')],
      'v1.5: head (H1 + info table) is byte-identical after patching')
det_fm = yaml.safe_load(fm_of(out['content']))
check([e['doc'] for e in det_fm['related']] == [17, 23, 9],
      'v1.5: details-frame related line yaml-parses to the ranked entries')
check(out['content'].count('related: [decoy]') == 1 and
      strip_patchable(out['content']) == strip_patchable(det),
      'v1.5: details-frame body decoys byte-untouched (integrity)')
[again] = patch([{'doc': 42, 'name': 'self.md', 'content': out['content']}])
check(not again['changed'] and again['content'] == out['content'],
      'v1.5: idempotent on the details frame')

det_neighbor = sidecar(
    frame='details',
    related_line='related: [{"doc":99,"file":"other__doc99.md","s":1}]',
    region='- [Other](<https://x/o.md>) — 1 shared keyword: locks <!-- rel:99 -->')
[out] = patch([{'doc': 17, 'name': 'n.md', 'content': det_neighbor}])
det_nfm = yaml.safe_load(fm_of(out['content']))
check(out['changed'] and out['note'] == 'merged' and
      [e['doc'] for e in det_nfm['related']] == [42, 99] and
      out['content'].startswith('# Conflict "Prevention"'),
      'v1.5: merge into a details-frame neighbor; frame + head preserved')

# mixed-frame trio in one batch: each file keeps its own frame
trio = patch([
    {'doc': 42, 'name': 'self.md', 'content': sidecar(frame='details')},
    {'doc': 17, 'name': 'a.md', 'content': sidecar(
        related_line='related: []', frame='fence')},
    {'doc': 23, 'name': 'b.md', 'content': sidecar(
        related_line='related: []', frame='dash')},
])
check(trio[0]['content'].startswith('# ') and '<details>' in trio[0]['content'] and
      trio[1]['content'].startswith('```yaml\n') and
      '<details>' not in trio[1]['content'] and
      trio[2]['content'].startswith('---\n') and
      '```' not in trio[2]['content'],
      'v1.5: mixed-frame batch — every file keeps the frame it arrived in')
check(all(f['changed'] for f in trio) and trio[0]['note'] == 'set' and
      trio[1]['note'] == 'merged' and trio[2]['note'] == 'merged',
      'v1.5: mixed-frame batch patches all three files')

# details frame that never closes -> no-op, original bytes
det_broken = det.replace('</details>', '')
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': det_broken}])
check(not out['changed'] and out['content'] == det_broken and
      out['note'] == 'not-frontmatter',
      'v1.5: details frame missing </details> -> byte-identical no-op')

# H1-first file with no details block at all -> no-op
plain_h1 = '# Just a title\n\nplain prose, no metadata block\n'
[out] = patch([{'doc': 42, 'name': 'x.md', 'content': plain_h1}])
check(not out['changed'] and out['content'] == plain_h1 and
      out['note'] == 'not-frontmatter',
      'v1.5: H1 + plain text (no details block) -> no-op')

# H1-first file whose ONLY details opener sits in body text after a
# section heading -> anchored out, no-op
det_decoy = ('# Decoy Doc\n\n## Summary\n\nprose\n\n' +
             DETAILS_OPEN + 'related: []' + DETAILS_CLOSE + '\nmore prose\n')
[out] = patch([{'doc': 42, 'name': 'x.md', 'content': det_decoy}])
check(not out['changed'] and out['content'] == det_decoy and
      out['note'] == 'not-frontmatter',
      'v1.5: details opener after a section heading is body text, not a frame')

# fence-frame file with a details-opener decoy in the body stays fence-framed
fence_decoy = sidecar() + '\n' + DETAILS_OPEN + 'decoy: yaml' + DETAILS_CLOSE
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': fence_decoy}])
check(out['changed'] and out['content'].startswith('```yaml\n') and
      (DETAILS_OPEN + 'decoy: yaml' + DETAILS_CLOSE) in out['content'],
      'v1.5: fence frame wins at position 0; body details decoy untouched')

# BOM/CRLF normalization applies to the details frame too
det_crlf = '﻿' + sidecar(frame='details').replace('\n', '\r\n')
[out] = patch([{'doc': 42, 'name': 's.md', 'content': det_crlf}])
check(out['changed'] and '\r' not in out['content'] and
      '<!-- rel:17 -->' in out['content'],
      'v1.5: BOM+CRLF details-frame sidecar is normalized and patched')

# -- v1.6: comment-frame sidecar (flow v2.8 / PromptVersion v2.0) ---------
com = sidecar(frame='comment')
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': com}])
check(out['changed'] and out['note'] == 'set' and
      out['content'].startswith('# Conflict "Prevention"'),
      'v1.6: comment frame patches in set mode; H1 stays at byte 0')
check(out['content'].count(COMMENT_OPEN) == 1 and
      out['content'].count(COMMENT_CLOSE) == 1 and
      '<details>' not in out['content'],
      'v1.6: comment frame preserved on rewrite (no conversion)')
check(out['content'][:out['content'].index(COMMENT_OPEN)] ==
      com[:com.index(COMMENT_OPEN)],
      'v1.6: head (H1 + info table) is byte-identical after patching')
com_fm = yaml.safe_load(fm_of(out['content']))
check([e['doc'] for e in com_fm['related']] == [17, 23, 9],
      'v1.6: comment-frame related line yaml-parses to the ranked entries')
check(out['content'].count('related: [decoy]') == 1 and
      strip_patchable(out['content']) == strip_patchable(com),
      'v1.6: comment-frame body decoys byte-untouched (integrity)')
[again] = patch([{'doc': 42, 'name': 'self.md', 'content': out['content']}])
check(not again['changed'] and again['content'] == out['content'],
      'v1.6: idempotent on the comment frame')

com_neighbor = sidecar(
    frame='comment',
    related_line='related: [{"doc":99,"file":"other__doc99.md","s":1}]',
    region='- [Other](<https://x/o.md>) — 1 shared keyword: locks <!-- rel:99 -->')
[out] = patch([{'doc': 17, 'name': 'n.md', 'content': com_neighbor}])
com_nfm = yaml.safe_load(fm_of(out['content']))
check(out['changed'] and out['note'] == 'merged' and
      [e['doc'] for e in com_nfm['related']] == [42, 99] and
      out['content'].startswith('# Conflict "Prevention"'),
      'v1.6: merge into a comment-frame neighbor; frame + head preserved')

# mixed-frame quartet in one batch: each file keeps its own frame
quartet = patch([
    {'doc': 42, 'name': 'self.md', 'content': sidecar(frame='comment')},
    {'doc': 17, 'name': 'a.md', 'content': sidecar(frame='details')},
    {'doc': 23, 'name': 'b.md', 'content': sidecar(
        related_line='related: []', frame='fence')},
    {'doc': 9, 'name': 'c.md', 'content': sidecar(
        related_line='related: []', frame='dash')},
])
check(COMMENT_OPEN in quartet[0]['content'] and
      '<details>' not in quartet[0]['content'] and
      '<details>' in quartet[1]['content'] and
      COMMENT_OPEN not in quartet[1]['content'] and
      quartet[2]['content'].startswith('```yaml\n') and
      quartet[3]['content'].startswith('---\n'),
      'v1.6: mixed-frame batch — every file keeps the frame it arrived in')
check(all(f['changed'] for f in quartet) and quartet[0]['note'] == 'set' and
      all(f['note'] == 'merged' for f in quartet[1:]),
      'v1.6: mixed-frame batch patches all four files')

# comment frame that never closes -> no-op, original bytes
com_broken = com.replace('\n```\n-->\n', '\n```\n')
[out] = patch([{'doc': 42, 'name': 'self.md', 'content': com_broken}])
check(not out['changed'] and out['content'] == com_broken and
      out['note'] == 'not-frontmatter',
      'v1.6: comment frame missing --> -> byte-identical no-op')

# H1-first file whose ONLY comment opener sits in body text after a
# section heading -> anchored out, no-op
com_decoy = ('# Decoy Doc\n\n## Summary\n\nprose\n\n' +
             COMMENT_OPEN + 'related: []' + COMMENT_CLOSE + '\nmore prose\n')
[out] = patch([{'doc': 42, 'name': 'x.md', 'content': com_decoy}])
check(not out['changed'] and out['content'] == com_decoy and
      out['note'] == 'not-frontmatter',
      'v1.6: comment opener after a section heading is body text, not a frame')

# the related markers are single-line comments — never mistaken for the
# frame opener (every fenced sidecar contains them)
check(patch([{'doc': 42, 'name': 'self.md', 'content': sidecar()}])[0]['content']
      .startswith('```yaml\n'),
      'v1.6: <!-- related:begin --> markers never read as a comment frame')

# BOM/CRLF normalization applies to the comment frame too
com_crlf = '﻿' + sidecar(frame='comment').replace('\n', '\r\n')
[out] = patch([{'doc': 42, 'name': 's.md', 'content': com_crlf}])
check(out['changed'] and '\r' not in out['content'] and
      '<!-- rel:17 -->' in out['content'],
      'v1.6: BOM+CRLF comment-frame sidecar is normalized and patched')

# ---- type-check both wrapped runners (separately — each Office Script
# is its own global scope, so joint compilation would false-collide) ------
for runner in ('rr_cur.ts', 'scp_cur.ts'):
    tsc = subprocess.run(['npx', '--yes', '--package', 'typescript', 'tsc', '--noEmit', '--target', 'es2017',
                          '--lib', 'es2017,dom', runner],
                         capture_output=True, text=True, encoding='utf-8')
    check(tsc.returncode == 0, f'{runner} type-checks at ES2017'
          + ('' if tsc.returncode == 0 else '\n' + tsc.stdout[-1500:]))

print()
if failures:
    print(f'RESULT: FAIL ({len(failures)} failed)')
    sys.exit(1)
print('RESULT: PASS')
