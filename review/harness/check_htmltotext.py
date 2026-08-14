"""Assertions for HtmlToText's HTML -> markdown-ish text contract
(current scripts/ version).

HtmlToText v1.0 converts fetched Esri public help pages
(pro.arcgis.com / enterprise.arcgis.com / developers.arcgis.com /
doc.arcgis.com) to cacheable text — the flow fetches with the HTTP
action, the script only converts. This pins the whole conversion
contract:

  1. chrome/dead-block removal: <nav>/<header>/<footer>/<aside> menu
     soup and <script>/<style>/<noscript>/comment content never reach
     the output
  2. structure: h1..h6 -> #..###### headings, <li> -> "- " bullets,
     table cells " | "-joined within their row
  3. title: <title> text wins, entity-decoded and collapsed; a
     title-less page falls back to the first main-content <h1>
  4. entities: named (&amp; &lt; &nbsp; &#39; ...) and numeric
     (&#NNN; / &#xHH;) forms decode; &amp;lt; stays the literal
     "&lt;" (no double decode)
  5. cap: maxChars smaller than the content -> truncated true and
     chars == maxChars exactly; maxChars <= 0 takes the 60000 default
  6. note is single-valued: "" normally, "thin-extract" under 500
     final chars (the JS-shell tripwire the flow routes to an error
     status), "empty-input" for empty/whitespace html
  7. plain-text passthrough + idempotence: tag-free input survives
     essentially intact; a second pass over first-pass output is
     byte-identical except the one inherent entity-decoder limit
     (literal "&lt;" from &amp;lt; re-decodes), which is pinned
     exactly

Cases are inline (no binary fixtures), so this suite runs anywhere
Python + Node 22 exist — it is part of the fixture-free CI job.
Running the wrapped script under `node --experimental-strip-types`
is itself the parse/strip proof (same stance as check_regex.py — no
separate tsc leg).

Exit code: non-zero on any failed assertion.
"""
import json
import os
import subprocess
import sys

SCRIPTS = os.environ.get('HARNESS_SCRIPTS', '../../scripts')

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


# ---- regenerate the wrapped runner --------------------------------------
htt_src = open(f'{SCRIPTS}/HtmlToText.ts', encoding='utf-8').read().replace(
    'workbook: ExcelScript.Workbook', 'workbook: unknown')
htt_src += '''
// ---- harness appendix (check_htmltotext.py) ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const cases: { html: string, maxChars: number }[] =
  JSON.parse(fs.readFileSync(which, 'utf8'));
console.log(JSON.stringify(cases.map((c) =>
  main(null as unknown, c.html, c.maxChars))));
'''
open('htt_cur.ts', 'w', encoding='utf-8').write(htt_src)


def run(cases, tag):
    path = f'htt_cases_{tag}.json'
    json.dump(cases, open(path, 'w', encoding='utf-8'))
    out = subprocess.run(['node', '--experimental-strip-types', 'htt_cur.ts', path],
                         capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f"htt_cur.ts failed:\n{out.stderr[:2000]}")
    return [r['result'] for r in json.loads(out.stdout)]


# ---- case 1: realistic static Esri help page -----------------------------
ESRI_PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Route editing &amp; calibration&#8212;ArcGIS Pro | Documentation</title>
  <style>.banner { color: #007ac2; } .calcite-nav { display: flex; }</style>
  <script>window.dataLayer = window.dataLayer || []; gtag('config', 'UA-000');</script>
</head>
<body>
  <!-- telemetry beacon markup -->
  <header><div class="esri-header">EsriBrandBanner Sign In</div></header>
  <nav class="side-nav">
    <ul>
      <li><a href="/en/pro-app/">MenuHome</a></li>
      <li><a href="/en/pro-app/help/">MenuHelp</a></li>
      <li><a href="/en/pro-app/tool-reference/">MenuTools</a></li>
    </ul>
  </nav>
  <main>
    <h1>Route editing and calibration</h1>
    <p>Routes in an LRS Network carry measure values that support the
       location of events along the network. When a route&#39;s geometry
       changes, its measures &amp; calibration points must be reviewed so
       downstream event behavior stays deterministic across the network
       and its derived layers.</p>
    <h2>Prerequisites</h2>
    <ul>
      <li>Create the LRS</li>
      <li>Add a network</li>
    </ul>
    <p>The&nbsp;editing workflow applies to both ArcGIS Pipeline Referencing
       and Roads and Highways, and behaves identically against file and
       enterprise geodatabases when the LRS dataset is registered with the
       linear referencing system and the network has calibration rules
       configured for gap and overlap conditions in the active map.</p>
    <h2>Route fields</h2>
    <table>
      <thead><tr><th>Field</th><th>Type</th></tr></thead>
      <tbody><tr><td>RouteId</td><td>Text</td></tr></tbody>
    </table>
    <p>Literal markup renders as &amp;lt; in source.</p>
  </main>
  <footer>
    <div>CopyrightFooter &#169; 2026 Esri. TrustCenterLink PrivacyLink</div>
  </footer>
</body>
</html>'''

# ---- case 3: JS-shell page (the thin-extract tripwire) -------------------
JS_SHELL = '''<html><head><title>ArcGIS Developers</title>
<script src="/bundle.js"></script>
<script>window.__APP_STATE__ = {"route": "/docs"};</script>
</head><body><div id="root"></div><noscript>Please enable JavaScript.</noscript></body></html>'''

# ---- case 6: plain-text passthrough --------------------------------------
# tag-free, entity-free, already whitespace-normal — and long enough
# (>500 chars) that the thin-extract tripwire stays quiet
PLAIN = ('Routes in an LRS Network carry measure values that support the '
         'location of events along the network. When a route geometry '
         'changes, its measures and calibration points must be reviewed so '
         'downstream event behavior stays deterministic.\n\n'
         'The editing workflow applies to both ArcGIS Pipeline Referencing '
         'and Roads and Highways, and behaves identically against file and '
         'enterprise geodatabases when the LRS dataset is registered with '
         'the linear referencing system and the network has calibration '
         'rules configured for gap and overlap conditions in the map. '
         'Note that 3 < 5 always holds.')

# ---- case 7: title-less page -> first main-content <h1> ------------------
NO_TITLE = ('<html><body><header><h1>BannerBrand</h1></header>'
            '<main><h1>Configure the LRS</h1><p>Body text.</p></main></body></html>')

CASES = [
    {'html': ESRI_PAGE, 'maxChars': 60000},   # 0: full conversion
    {'html': ESRI_PAGE, 'maxChars': 120},     # 1: cap smaller than content
    {'html': JS_SHELL, 'maxChars': 60000},    # 2: thin-extract
    {'html': '', 'maxChars': 60000},          # 3: empty input
    {'html': '  \n\t ', 'maxChars': 60000},   # 4: whitespace-only input
    {'html': PLAIN, 'maxChars': 0},           # 5: passthrough + default cap
    {'html': NO_TITLE, 'maxChars': 60000},    # 6: h1 title fallback
]
res = run(CASES, 'p1')

for i, r in enumerate(res):
    check(r['chars'] == len(r['text']), f'chars === text.length (case {i})')

# ---- 1: chrome/dead-block removal ----------------------------------------
r = res[0]
lines = r['text'].split('\n')
for junk in ('MenuHome', 'MenuHelp', 'MenuTools', 'EsriBrandBanner',
             'CopyrightFooter', 'TrustCenterLink', 'gtag', 'dataLayer',
             '.banner', 'calcite-nav', 'telemetry beacon'):
    check(junk not in r['text'], f'chrome/script/style absent: {junk!r}')

# ---- 2: structure ---------------------------------------------------------
check('# Route editing and calibration' in lines,
      'h1 -> "# " heading on its own line')
check('## Prerequisites' in lines and '## Route fields' in lines,
      'h2 -> "## " headings on their own lines')
check('- Create the LRS' in lines and '- Add a network' in lines,
      'li -> "- " bullets on their own lines')
check('Field | Type' in lines and 'RouteId | Text' in lines,
      'table cells " | "-joined within their row')
check('<' not in r['text'].replace('&lt;', '').replace('< 5', '') or
      all(not l.startswith('<') for l in lines),
      'no raw tags survive in the body text')
check('\n\n\n' not in r['text'] and r['text'] == r['text'].strip(),
      '3+ newline runs collapsed to 2; output trimmed')

# ---- 3: title -------------------------------------------------------------
check(r['title'] == 'Route editing & calibration—ArcGIS Pro | Documentation',
      'title: <title> text, entity-decoded (&amp; + numeric em dash), collapsed')
check(res[6]['title'] == 'Configure the LRS',
      'title: title-less page falls back to the MAIN <h1>, not the header banner')

# ---- 4: entities -----------------------------------------------------------
check("route's geometry" in r['text'], 'entities: &#39; -> apostrophe')
check('measures & calibration' in r['text'], 'entities: &amp; -> &')
check('The editing workflow' in r['text'], 'entities: &nbsp; -> plain space')
check('renders as &lt; in source' in r['text'],
      'entities: &amp;lt; decodes ONCE to the literal "&lt;"')
check('&amp;' not in r['text'] and '&#39;' not in r['text'],
      'entities: no undecoded common entities remain')

# ---- 5: cap ----------------------------------------------------------------
check(r['truncated'] is False and r['note'] == '' and r['chars'] > 500,
      'full page: not truncated, note ""')
r = res[1]
check(r['truncated'] is True and r['chars'] == 120 and len(r['text']) == 120,
      'cap: maxChars=120 -> truncated true, chars == 120 exactly')
check(r['text'] == res[0]['text'][:120],
      'cap: truncated text is a prefix of the uncapped conversion')
check(res[5]['truncated'] is False,
      'cap: maxChars=0 takes the 60000 default (573-char input uncut)')

# ---- 6: note ----------------------------------------------------------------
r = res[2]
check(r['note'] == 'thin-extract' and r['chars'] < 500,
      'thin-extract: JS-shell page trips the <500-char tripwire')
check('__APP_STATE__' not in r['text'] and 'bundle.js' not in r['text'],
      'thin-extract: script/noscript payload still stripped, not counted')
for i, label in ((3, 'empty string'), (4, 'whitespace-only')):
    check(res[i]['note'] == 'empty-input' and res[i]['text'] == '' and
          res[i]['chars'] == 0 and res[i]['truncated'] is False,
          f'empty-input: {label} html -> note "empty-input", text ""')

# ---- 7: passthrough + idempotence -------------------------------------------
check(res[5]['text'] == PLAIN,
      'passthrough: tag-free normalized text survives byte-identical')
check(res[5]['note'] == '', 'passthrough: >500 chars, no thin-extract note')

# second pass over first-pass outputs must be a fixed point — except
# the one inherent limit of any single-pass entity decoder: a literal
# "&lt;" produced by decoding "&amp;lt;" re-decodes to "<" on the next
# pass. The contract's idempotence promise is scoped to plain text
# (tags/entities absent), so the esri-page leg pins the drift to
# EXACTLY that re-decode and nothing else.
PASS2_SRC = [res[0]['text'], res[2]['text'], res[5]['text']]
res2 = run([{'html': t, 'maxChars': 60000} for t in PASS2_SRC], 'p2')
check(res2[0]['text'] == PASS2_SRC[0].replace('&lt;', '<'),
      'idempotence: esri page re-pass drifts ONLY by the documented &lt; re-decode')
for src, r2, label in zip(PASS2_SRC[1:], res2[1:], ('js shell', 'plain text')):
    check(r2['text'] == src, f'idempotence: second pass over {label} output is byte-identical')

print()
if failures:
    print(f'RESULT: FAIL — {len(failures)} assertion(s) failed')
    sys.exit(1)
print('RESULT: PASS')
