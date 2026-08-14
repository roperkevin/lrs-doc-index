"""Definition lint for the sweep flow (new in r7 / flow v2.9).

Nothing tested the flow JSON before this suite: every FX-class defect
on the live tenant (mis-picked ScriptParameters bindings FX-1/FX-2,
stale raw-REST list GUIDs FX-6, a wrong list binding FX-7) was found
by hand-reading a live export. This lint asserts the classes of
invariants those defects broke, against the AUTHORED definition —
pure stdlib, no fixtures, runs in the fixture-free CI job.

Checks:

  1. the definition parses and every runAfter target names an action
     in the same scope (dangling references break flow save)
  2. the concurrency table holds EXACTLY — serialized loops stay
     serialized (dedup check-then-create races), parallelized loops
     stay at their reviewed widths, every Foreach carries an explicit
     concurrency setting, and the trigger stays single-run
  3. every SharePoint `table` binding and every guid'...' inside a
     raw-REST HttpRequest URI resolves against the per-list GUID map,
     and list-bound actions hit the list they are supposed to hit
     (the FX-6 / FX-7 class)
  4. every `ScriptParameters/<name>` key of every RunScriptProd call
     is a real parameter of the mapped script's main() signature in
     scripts/ (the FX-1 / FX-2 class), resolved via the scriptId map
  5. flow v2.9 shape: the bulk pre-fetch exists (Get_index_rows with
     $top + paginationPolicy, Select_index_map, Lookup_indexed), and
     the retired per-item Check_indexed / Extract_media_* actions are
     GONE; the retired MediaExtract scriptId appears nowhere

Target: flow/v2_9/definition.json (or pass a path as argv[1] — note
older definitions fail the v2.9-shape checks by design).

Exit code: non-zero on any failed assertion.
"""
import json
import re
import sys

TARGET = sys.argv[1] if len(sys.argv) > 1 else '../../flow/v2_9/definition.json'
SCRIPTS = '../../scripts'

# ---- the tenant's list GUID map (docs/SP_Adaptation_Notes.md) -----------
LISTS = {
    'source_library': 'c8784e70-c536-4064-91e9-14b8b6535a03',
    'doc_index': 'b98fb2a1-1c91-48f9-9b9b-323656557171',
    'keywords': 'a7bd004b-84e0-408f-b32d-3f1d791e2af6',
    'doc_ids': '6263eeac-471a-489e-96c7-1448f45378d4',
    'doc_keywords': '4eabc799-c856-49ea-bf25-65942b363ec6',
    'doc_links': 'c49367dc-c267-4f5b-8935-4fad47fb0d34',
}
GUIDS = set(LISTS.values())

# list-bound actions -> the list they MUST hit (FX-6 / FX-7 class)
ACTION_TABLE = {
    'Get_files': 'source_library',
    'Get_index_rows': 'doc_index',
    'Get_keywords': 'keywords',
    'Get_kw_meta': 'keywords',
    'Check_kw': 'keywords',
    'Create_kw': 'keywords',
    'Check_dockw': 'doc_keywords',
    'Get_my_kws': 'doc_keywords',
    'Get_kw_sharers': 'doc_keywords',
    'Check_idrow': 'doc_ids',
    'Find_sharers': 'doc_ids',
    'Check_link': 'doc_links',
    'Get_id_links': 'doc_links',
    'Get_cand_docs': 'doc_index',
    'Set_text_url': 'doc_index',
    'Create_doc': 'doc_index',
    'Update_doc': 'doc_index',
    'Create_doc_skipped': 'doc_index',
    'Update_doc_skipped': 'doc_index',
    'Create_doc_error': 'doc_index',
    'Update_doc_error': 'doc_index',
}

# raw-REST creates -> the list GUID their URI must embed
REST_TABLE = {
    'Create_idrow': 'doc_ids',
    'Create_link': 'doc_links',
    'Create_dockw': 'doc_keywords',
}

# scriptId (itemlink tail) -> script source in scripts/
SCRIPT_IDS = {
    '01JWUXOZIEEGZVFDTYSRHIEYGHUY2ZADVP': 'ZipTextExtract.ts',
    '01JWUXOZN6FVK4YIIAVBALXVNVPNFOK75S': 'WorkbookDump.ts',
    '01JWUXOZOV25BH4K5KOBFIEGOQR6GHSCOP': 'RegexExtract.ts',
    '01JWUXOZOYCUREQER2OVD3MOWC62Y3DGNV': 'RelatedRank.ts',
    '01JWUXOZIGYJWFJ7JYBJH2ELLCZEJWJQSN': 'SidecarPatch.ts',
}
RETIRED_SCRIPT_IDS = {
    '01JWUXOZOFC7PKHHZ4JBF3FRRA7SOX77PF': 'MediaExtract.ts (retired r7)',
}

# loop -> exact required concurrency (None key asserted separately)
CONCURRENCY = {
    'For_each_file': 1,
    'For_each_id': 1,
    'For_each_sharer': 1,
    'For_each_kw': 1,
    'For_each_neighbor': 1,
    'For_each_img_pptx': 8,
    'For_each_img_docx': 8,
    'For_each_patched': 6,
}

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


raw = open(TARGET, encoding='utf-8').read()
doc = json.loads(raw)
defn = doc['properties']['definition']
check(True, f'{TARGET} parses as JSON')

# ---- collect every action with its scope path ---------------------------
flat = {}


def walk(actions, path):
    names = set(actions)
    for name, a in actions.items():
        flat[name] = a
        for target in a.get('runAfter', {}) or {}:
            if target not in names:
                failures.append(f'dangling runAfter {path}/{name} -> {target}')
                print(f'FAIL dangling runAfter {path}/{name} -> {target}')
        if isinstance(a.get('actions'), dict):
            walk(a['actions'], f'{path}/{name}')
        if isinstance(a.get('else', {}).get('actions'), dict):
            walk(a['else']['actions'], f'{path}/{name}/else')
        for cn, c in (a.get('cases') or {}).items():
            walk(c.get('actions', {}), f'{path}/{name}/{cn}')
        if isinstance(a.get('default', {}).get('actions'), dict):
            walk(a['default']['actions'], f'{path}/{name}/default')


walk(defn['actions'], '')
check(not any(f.startswith('dangling') for f in failures),
      'every runAfter target exists in its scope')
dupes = len(flat)  # dict collapses dupes; count check below is best-effort

# ---- 2: concurrency table ------------------------------------------------
loops = {n: a for n, a in flat.items() if a.get('type') == 'Foreach'}
for name, want in CONCURRENCY.items():
    a = loops.get(name)
    got = (a or {}).get('runtimeConfiguration', {}).get('concurrency', {}).get('repetitions')
    check(a is not None and got == want, f'{name}: concurrency == {want} (got {got})')
extra = set(loops) - set(CONCURRENCY)
check(not extra, f'no unreviewed Foreach loops (extra: {sorted(extra) or "none"})')
for name, a in loops.items():
    got = a.get('runtimeConfiguration', {}).get('concurrency', {}).get('repetitions')
    check(isinstance(got, int), f'{name}: explicit concurrency setting present')
trig = defn['triggers']['Recurrence']
check(trig.get('runtimeConfiguration', {}).get('concurrency', {}).get('runs') == 1,
      'trigger: single-run concurrency')

# ---- 3: GUID discipline --------------------------------------------------
for name, listkey in ACTION_TABLE.items():
    a = flat.get(name)
    if a is None:
        check(False, f'{name}: action present (bound to {listkey})')
        continue
    table = a.get('inputs', {}).get('parameters', {}).get('table')
    check(table == LISTS[listkey], f'{name}: table == {listkey} (got {table})')
for name, listkey in REST_TABLE.items():
    a = flat.get(name)
    uri = (a or {}).get('inputs', {}).get('parameters', {}).get('parameters/uri', '')
    m = re.search(r"guid'([0-9a-f-]{36})'", uri)
    check(m is not None and m.group(1) == LISTS[listkey],
          f"{name}: raw-REST URI targets {listkey} "
          f"(got {m.group(1) if m else 'no guid'})")
for guid in re.findall(r"guid'([0-9a-f-]{36})'", raw):
    check(guid in GUIDS, f'embedded guid {guid} is in the allowlist')


def params_of(a):
    inputs = a.get('inputs')
    if not isinstance(inputs, dict):
        return {}
    p = inputs.get('parameters')
    return p if isinstance(p, dict) else {}


for table in {params_of(a).get('table') for a in flat.values()} - {None}:
    check(table in GUIDS, f'table binding {table} is in the allowlist')

# ---- 4: ScriptParameters vs main() signatures (FX-1/FX-2 class) ----------
sig_cache = {}


def script_params(ts_name):
    if ts_name not in sig_cache:
        src = open(f'{SCRIPTS}/{ts_name}', encoding='utf-8').read()
        m = re.search(r'function main\s*\(([^)]*)\)', src)
        params = [p.split(':')[0].strip().rstrip('?')
                  for p in m.group(1).split(',')]
        sig_cache[ts_name] = [p for p in params[1:] if p]  # drop workbook
    return sig_cache[ts_name]


for name, a in flat.items():
    inputs = a.get('inputs')
    if not isinstance(inputs, dict):
        continue
    if inputs.get('host', {}).get('operationId') != 'RunScriptProd':
        continue
    sid = inputs.get('parameters', {}).get('scriptId', '')
    tail = sid.rsplit('%2F', 1)[-1]
    check(tail not in RETIRED_SCRIPT_IDS,
          f'{name}: does not call a retired script ({RETIRED_SCRIPT_IDS.get(tail, "")})')
    if tail not in SCRIPT_IDS:
        check(False, f'{name}: scriptId {tail} is in the scriptId map')
        continue
    ts = SCRIPT_IDS[tail]
    allowed = script_params(ts)
    bound = [k.split('/', 1)[1] for k in inputs.get('parameters', {})
             if k.startswith('ScriptParameters/')]
    bad = [b for b in bound if b not in allowed]
    check(not bad, f'{name}: every ScriptParameters key exists in {ts} '
                   f'main() ({bad or "all match"})')

# ---- 5: v2.9 shape -------------------------------------------------------
check('Check_indexed' not in flat, 'per-item Check_indexed is gone (bulk pre-fetch)')
check('Extract_media_pptx' not in flat and 'Extract_media_docx' not in flat,
      'Extract_media_* actions are gone (merged extraction)')
check('Lookup_indexed' in flat and flat['Lookup_indexed'].get('type') == 'Query',
      'Lookup_indexed in-memory Query present')
check('Select_index_map' in flat and flat['Select_index_map'].get('type') == 'Select',
      'Select_index_map present')
gir = flat.get('Get_index_rows', {})
check(gir.get('inputs', {}).get('parameters', {}).get('$top') == 20000 and
      gir.get('runtimeConfiguration', {}).get('paginationPolicy', {})
         .get('minimumItemCount') == 20000,
      'Get_index_rows: $top 20000 + paginationPolicy 20000')
check("body('Check_indexed')" not in raw, "no stray body('Check_indexed') references")
zx = flat.get('Zip_extract_pptx', {}).get('inputs', {}).get('parameters', {})
zd = flat.get('Zip_extract_docx', {}).get('inputs', {}).get('parameters', {})
check(zx.get('ScriptParameters/wantMedia') is True and
      zd.get('ScriptParameters/wantMedia') is True,
      'both Zip_extract lanes bind wantMedia: true')
for lane in ('pptx', 'docx'):
    fe = flat.get(f'For_each_img_{lane}', {}).get('foreach', '')
    check(f"outputs('Zip_extract_{lane}')?['body/result/images']" in fe,
          f'For_each_img_{lane} iterates the merged images output')

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed')
    sys.exit(1)
print('RESULT: PASS')
