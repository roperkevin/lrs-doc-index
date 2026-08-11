"""Run both script versions over every fixture and byte-diff the outputs.

Prereqs (see README.md): wrap.py has produced zte_v15.ts / zte_v16.ts /
me_v10.ts / me_v11.ts, and make_fixtures.py has produced the .b64 fixtures.
Add reference-set files to FILES to run this against the real corpus.
Exit code is non-zero on any DIFF or any recall below the bar.
"""
import base64
import json
import os
import re
import subprocess
import sys
import zipfile

FILES = ['real_deck.pptx.b64', 'real_doc.docx.b64', 'edge_deck.pptx.b64']
MEDIA_FILES = ['real_deck.pptx.b64', 'real_doc.docx.b64']
RECALL_BAR = 0.97


def run(script, b64file, prefix=''):
    out = subprocess.run(
        ['node', '--experimental-strip-types', script, b64file, prefix],
        capture_output=True, text=True, encoding='utf-8')
    if out.returncode != 0:
        raise RuntimeError(f"{script} failed on {b64file}:\n{out.stderr[:2000]}")
    return json.loads(out.stdout)


def toks(s):
    return [t for t in re.split(r'\s+', s.lower()) if t]


planted = json.load(open('planted_tokens.json', encoding='utf-8')) if os.path.exists('planted_tokens.json') else {}
ok = True

# The ZTE pair is a historical gate (see README) — current scripts/ is v1.8,
# whose format changes make a "v1.5" wrap diff by design. Run it only when
# both wraps were deliberately generated (from git history).
zte_pair = os.path.exists('zte_v15.ts') and os.path.exists('zte_v16.ts')
if not zte_pair:
    print('zte_v15.ts / zte_v16.ts not present — skipping the historical ZTE gate (see README).')
print(f"{'fixture':<22} {'equal':<10} {'v1.5 ms':>8} {'v1.6 ms':>8} {'recall v1.5':>12} {'recall v1.6':>12}")
for f in FILES if zte_pair else []:
    a = run('zte_v15.ts', f, 'media/docX_')
    b = run('zte_v16.ts', f, 'media/docX_')
    same = a['out'] == b['out']
    ok &= same
    src = f.replace('.b64', '')
    rec = ['—', '—']
    if src in planted:
        want = [w.lower() for w in planted[src]]
        for i, o in enumerate((a, b)):
            got = set(toks(o['out']['text']))
            hit = sum(1 for w in want if w in got or any(w in g for g in got))
            r = hit / len(want)
            rec[i] = f"{r:.4f}"
            if r < RECALL_BAR:
                ok = False
    print(f"{src:<22} {('IDENTICAL' if same else 'DIFF!'):<10} {a['ms']:>8} {b['ms']:>8} {rec[0]:>12} {rec[1]:>12}")

print()
for f in MEDIA_FILES:
    a = run('me_v10.ts', f)
    b = run('me_v11.ts', f)
    same = a['out'] == b['out']
    ok &= same
    src = f.replace('.b64', '')
    z = zipfile.ZipFile(src)
    gt = True
    for img in a['out']['images']:
        cands = [n for n in z.namelist() if n.endswith('/' + img['name'])]
        if not cands or base64.b64encode(z.read(cands[0])).decode() != img['b64']:
            gt = False
    # both fixtures plant images — zero extracted means the ground-truth
    # loop above proved nothing (a shared regression would look like PASS)
    nonzero = a['out']['count'] > 0
    ok &= gt and nonzero
    print(f"media {src:<22} {('IDENTICAL' if same else 'DIFF!'):<10} "
          f"v1.0={a['ms']}ms v1.1={b['ms']}ms images={a['out']['count']} "
          f"ground-truth={'OK' if gt and nonzero else ('VACUOUS (0 images)' if gt else 'MISMATCH')}")

print()
print('RESULT:', 'PASS — safe to paste (after reference-set run)' if ok else 'FAIL — DO NOT PASTE')
sys.exit(0 if ok else 1)
