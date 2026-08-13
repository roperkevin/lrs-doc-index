"""Assertions for RegexExtract's id/docRevision contract (current scripts/).

Until this suite existed, the harness exercised RegexExtract only
through its `.slug` field (check_format.py §7) — the script's actual
purpose (issue-id minting, source precedence, EXB routing, revision
extraction) had zero assertions, which is how the r2 SB-1 phantom-
revision bug survived two review rounds. This pins the whole
`IdResult` contract:

  1. url source: devtopia issue URLs carry their own {org}/{repo}
     namespace, match case-insensitively, and match inside raw
     _rels XML text
  2. filename source: ^(\\d{2,5})[-_] — 2-digit minimum (a single
     leading digit is ordering noise), 8-digit date prefixes can
     never match; 5-digit numbers route to the ExB repo, 2-4-digit
     to defaultRepo
  3. hashtag source: #(\\d{3,5}) with defaultRepo; DROPPED when the
     number is already url- or filename-claimed
  4. url claims suppress the (repo-blind) filename source too
  5. dedupe by repo|number; add() bounds: 0 and >999999 rejected;
     idCount === ids.length
  6. docRevision: [Vv]\\d{1,2} opening a token at the very end of the
     base filename — TestPlanV1/Report_V4/spec_v2 match; trailing
     _1, 2_35, and 3+-digit runs don't

Cases are inline (no binary fixtures), so this suite runs anywhere
Python + Node 22 exist — it is part of the fixture-free CI job.

Exit code: non-zero on any failed assertion.
"""
import json
import os
import subprocess
import sys

SCRIPTS = os.environ.get('HARNESS_SCRIPTS', '../../scripts')
DEFAULT_REPO = 'ArcGISPro/ps-location-referencing'
EXB_REPO = 'Beijing-R-D-Center/ExperienceBuilder-Web-Extensions'

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- regenerate the wrapped runner (full IdResult, not just .slug) ------
rex_src = open(f'{SCRIPTS}/RegexExtract.ts', encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
rex_src += '''
// ---- harness appendix (check_regex.py: full IdResult) ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const cases: { file: string, content: string, title: string }[] =
  JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(cases.map((c) =>
  main(null as unknown, c.file, c.content, 'ArcGISPro/ps-location-referencing', c.title))));
'''
open('rex_cur.ts', 'w', encoding='utf-8').write(rex_src)

CASES = [
    # -- 1: url source ----------------------------------------------------
    {'file': 'Plain.docx', 'title': '',
     'content': 'see https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/1234 for details'},
    {'file': 'Rels.pptx', 'title': '',
     'content': '<Relationship Id="rId9" Target="https://DEVTOPIA.ESRI.COM/Other-Org/some-repo/issues/777"/>'},
    # -- 2: filename source ------------------------------------------------
    {'file': '26161_ExB_Widget_Spec.docx', 'title': '', 'content': ''},
    {'file': '1234_Route_Editing.pptx', 'title': '', 'content': ''},
    {'file': '5_Data_Template.xlsx', 'title': '', 'content': ''},
    {'file': '20260806_Meeting_Notes.docx', 'title': '', 'content': ''},
    # -- 3/4: suppression --------------------------------------------------
    {'file': 'Gantt.pptx', 'title': '',
     'content': '#456 and #26161 plus https://devtopia.esri.com/A/b/issues/26161'},
    {'file': '1234_Foo.docx', 'title': '',
     'content': 'https://devtopia.esri.com/Other-Org/some-repo/issues/1234'},
    {'file': 'Small.docx', 'title': '', 'content': 'ref #12 only'},
    # -- 5: dedupe + bounds ------------------------------------------------
    {'file': 'Twice.docx', 'title': '',
     'content': 'https://devtopia.esri.com/A/b/issues/99 https://devtopia.esri.com/A/b/issues/99'},
    {'file': 'Bounds.docx', 'title': '',
     'content': 'https://devtopia.esri.com/A/b/issues/0 https://devtopia.esri.com/A/b/issues/1000000'},
    # -- 6: docRevision ----------------------------------------------------
    {'file': 'TestPlanV1.docx', 'title': '', 'content': ''},
    {'file': 'Report_V4.pptx', 'title': '', 'content': ''},
    {'file': 'spec_v2.docx', 'title': '', 'content': ''},
    {'file': 'Notes_1.docx', 'title': '', 'content': ''},
    {'file': '2_35.xlsx', 'title': '', 'content': ''},
    {'file': 'Plan_v123.docx', 'title': '', 'content': ''},
    # -- SB-1 (v1.3): letter-run tails are not revisions ------------------
    {'file': 'Notes_Nov21.docx', 'title': '', 'content': ''},
    {'file': '20260806_Rev12.pptx', 'title': '', 'content': ''},
    {'file': 'Notes_dev3.docx', 'title': '', 'content': ''},
    {'file': 'REV12.docx', 'title': '', 'content': ''},
    {'file': 'MyPlanv2.docx', 'title': '', 'content': ''},
    {'file': 'V4.docx', 'title': '', 'content': ''},
    # -- 7 (v1.4, PD-1): product-line detection ---------------------------
    {'file': 'RH_Roundabouts_TestPlan.pptx', 'title': '', 'content': ''},
    {'file': 'Compound.pptx', 'title': '',
     'content': 'Test with UNAPR, RH, ADMRH, and PoM data'},
    {'file': 'FullNames.docx', 'title': '',
     'content': 'ArcGIS Pipeline Referencing behavior on the Utility Network'},
    {'file': 'AndName.docx', 'title': 'Roads and Highways editing', 'content': ''},
    {'file': 'DateTrap.pptx', 'title': '', 'content': 'milestone due 12-APR-2026'},
    {'file': 'AprToken.pptx', 'title': '', 'content': 'APR event layers only'},
    {'file': 'CamelTrap.pptx', 'title': '', 'content': 'RHLabels and UNAPRx are words'},
    {'file': 'LowerTrap.docx', 'title': '', 'content': 'un rh apr as lowercase prose'},
]

json.dump(CASES, open('rex_cases.json', 'w', encoding='utf-8'))
out = subprocess.run(['node', '--experimental-strip-types', 'rex_cur.ts', 'rex_cases.json'],
                     capture_output=True, text=True, encoding='utf-8')
if out.returncode != 0:
    raise RuntimeError(f"rex_cur.ts failed:\n{out.stderr[:2000]}")
res = json.loads(out.stdout)
byfile = {c['file']: r for c, r in zip(CASES, res)}

for r in res:
    check(r['idCount'] == len(r['ids']), f"idCount === ids.length ({r['idCount']})")

# -- 1: url source ---------------------------------------------------------
r = byfile['Plain.docx']
check(r['ids'] == [{'repo': DEFAULT_REPO, 'number': 1234, 'source': 'url'}],
      'url: devtopia URL mints id with its own repo namespace')
r = byfile['Rels.pptx']
check(r['ids'] == [{'repo': 'Other-Org/some-repo', 'number': 777, 'source': 'url'}],
      'url: matches inside _rels XML, case-insensitive host')

# -- 2: filename source ----------------------------------------------------
r = byfile['26161_ExB_Widget_Spec.docx']
check(r['ids'] == [{'repo': EXB_REPO, 'number': 26161, 'source': 'filename'}],
      'filename: 5-digit prefix routes to the ExB repo')
r = byfile['1234_Route_Editing.pptx']
check(r['ids'] == [{'repo': DEFAULT_REPO, 'number': 1234, 'source': 'filename'}],
      'filename: 2-4 digit prefix takes defaultRepo')
check(byfile['5_Data_Template.xlsx']['ids'] == [],
      'filename: single leading digit is ordering noise, no id')
check(byfile['20260806_Meeting_Notes.docx']['ids'] == [],
      'filename: 8-digit date prefix can never match')

# -- 3/4: suppression ------------------------------------------------------
r = byfile['Gantt.pptx']
check([i for i in r['ids'] if i['source'] == 'url'] ==
      [{'repo': 'A/b', 'number': 26161, 'source': 'url'}] and
      [i for i in r['ids'] if i['source'] == 'hashtag'] ==
      [{'repo': DEFAULT_REPO, 'number': 456, 'source': 'hashtag'}],
      'hashtag: kept when unclaimed (#456), dropped when url-claimed (#26161)')
r = byfile['1234_Foo.docx']
check(r['ids'] == [{'repo': 'Other-Org/some-repo', 'number': 1234, 'source': 'url'}],
      'filename: suppressed when the number is url-claimed (urls are authoritative)')
check(byfile['Small.docx']['ids'] == [], 'hashtag: 2-digit #12 below the 3-digit floor')

# -- 5: dedupe + bounds ----------------------------------------------------
check(len(byfile['Twice.docx']['ids']) == 1, 'dedupe: same repo|number claimed once')
check(byfile['Bounds.docx']['ids'] == [], 'bounds: 0 and >999999 both rejected')

# -- 6: docRevision --------------------------------------------------------
# SB-1 (v1.3) negatives: Nov21/Rev12/dev3 letter-run tails, all-caps
# acronym tails, and lowercase v glued to a letter mint no revision
for f, want in (('TestPlanV1.docx', 'V1'), ('Report_V4.pptx', 'V4'),
                ('spec_v2.docx', 'V2'), ('Notes_1.docx', ''),
                ('2_35.xlsx', ''), ('Plan_v123.docx', ''),
                ('Notes_Nov21.docx', ''), ('20260806_Rev12.pptx', ''),
                ('Notes_dev3.docx', ''), ('REV12.docx', ''),
                ('MyPlanv2.docx', ''), ('V4.docx', 'V4')):
    check(byfile[f]['docRevision'] == want,
          f"docRevision: {f} -> {want!r} (got {byfile[f]['docRevision']!r})")

# -- 7: products (v1.4, PD-1) ---------------------------------------------
RH, APR, UN = 'Roads & Highways', 'Pipeline Referencing', 'Utility Network'
for f, want in (('RH_Roundabouts_TestPlan.pptx', [RH]),
                ('Compound.pptx', [RH, APR, UN]),
                ('FullNames.docx', [APR, UN]),
                ('AndName.docx', [RH]),
                ('DateTrap.pptx', []),
                ('AprToken.pptx', [APR]),
                ('CamelTrap.pptx', []),
                ('LowerTrap.docx', []),
                ('Plain.docx', [])):
    check(byfile[f]['products'] == want,
          f"products: {f} -> {want} (got {byfile[f]['products']})")
for r in res:
    check(r['productCount'] == len(r['products']),
          f"productCount === products.length ({r['productCount']})")

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed')
    sys.exit(1)
print('RESULT: PASS')
