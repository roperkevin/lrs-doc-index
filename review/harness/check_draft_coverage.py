"""Offline coverage lint for a TestPlanGen draft (prompt v1.6 contract).

Runs over a downloaded draft .md (from Shared Documents/Test Plan
Drafts/) — no tenant access, no fixtures. Complements smoke rows 1
and 9: the tenant run proves the flow produced a draft; this proves
the draft honors the coverage contract, and prints the counters used
for before/after comparison when a prompt bump lands
(`testplangen/Coverage_Runbook.md` step 5).

Asserts (v1.6 contract):

  1. the six core sections present, in order: Overview,
     Setup / Prerequisites, Positive Tests, Negative Tests,
     Open Questions, Coverage Map (conditionals — Automation Notes,
     Documentation Impacts — allowed between Negative Tests and
     Open Questions, never empty if present)
  2. every `### TC-*` case carries a `**Trace:**` line
  3. Negative Tests opens with the fixed `> [!CAUTION]` alert
  4. Open Questions has at least one `- [ ]` item
  5. Coverage Map: a well-formed GFM table with >= 1 data row; no
     empty Covered by cell; every TC id a cell cites exists in the
     draft; every TC id in the draft appears in some cell
  6. TC numbering sequential per lane (TC-P1..Pn, TC-N1..Nn)
  7. granularity, the structural half (v1.6): every TC case has
     exactly ONE `**Expected Result:**` line and at least one
     `- [ ]` Steps checkbox (the semantic half — a single outcome
     per Expected Result, one action per step — stays a human
     smoke/review check)

Prints (never gates): TC-P / TC-N / [VERIFY] / Coverage Map row /
steps-per-case counts, and a WARN when the draft sits under the
prompt's floor (4 positive / 3 negative — almost certainly
under-covered).

`--baseline` scores a pre-v1.5/pre-v1.6 draft for the before side
of a comparison: section 1's Coverage Map requirement and checks 5
and 7 are skipped, counters still print.

Usage: python3 check_draft_coverage.py <draft.md> [--baseline]
Exit code: non-zero on any failed assertion.
"""
import re
import sys

failures = []


def check(cond, label):
    print(('ok   ' if cond else 'FAIL ') + label)
    if not cond:
        failures.append(label)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    baseline = '--baseline' in sys.argv[1:]
    if len(args) != 1:
        print(__doc__)
        sys.exit(2)
    text = open(args[0], encoding='utf-8').read()

    # 1 — section order
    core = ['## Overview', '## Setup / Prerequisites', '## Positive Tests',
            '## Negative Tests', '## Open Questions']
    if not baseline:
        core.append('## Coverage Map')
    pos = -1
    ordered = True
    for h in core:
        p = text.find(h + '\n')
        if p < 0:
            p = text.find(h)  # tolerate EOF / trailing spaces
        check(p >= 0, f'section present: {h}')
        if p >= 0 and p < pos:
            ordered = False
        if p >= 0:
            pos = p
    check(ordered, 'core sections in order')
    for cond_h in ('## Automation Notes', '## Documentation Impacts'):
        if cond_h in text:
            body = re.split(r'\n## ', text.split(cond_h, 1)[1], 1)[0]
            check(bool(re.search(r'^\s*[-*] ', body, re.M)),
                  f'conditional section non-empty: {cond_h}')

    # 2 — every case has a Trace line; 7 — granularity (structural)
    cases = re.findall(r'^### (TC-[PN]\d+)[^\n]*\n(.*?)(?=^###? |\Z)',
                       text, re.M | re.S)
    check(len(cases) > 0, 'at least one TC case found')
    n_steps = 0
    for cid, body in cases:
        check('**Trace:**' in body, f'{cid} carries a **Trace:** line')
        n_steps += len(re.findall(r'^\s*- \[[ x]\]', body, re.M))
        if not baseline:
            check(body.count('**Expected Result:**') == 1,
                  f'{cid} has exactly one **Expected Result:** line')
            check(bool(re.search(r'^\s*- \[[ x]\]', body, re.M)),
                  f'{cid} has at least one Steps checkbox')

    # 3 — CAUTION alert heads Negative Tests
    neg = text.split('## Negative Tests', 1)
    check(len(neg) == 2 and neg[1].lstrip().startswith('> [!CAUTION]'),
          'Negative Tests opens with the CAUTION alert')

    # 4 — Open Questions non-empty
    oq = re.split(r'\n## ', text.split('## Open Questions', 1)[1], 1)[0] \
        if '## Open Questions' in text else ''
    check(bool(re.search(r'^\s*- \[[ x]\]', oq, re.M)),
          'Open Questions has at least one task-list item')

    # 5 — Coverage Map table
    map_rows = []
    if not baseline:
        cm = re.split(r'\n## ', text.split('## Coverage Map', 1)[1], 1)[0] \
            if '## Coverage Map' in text else ''
        rows = [l for l in cm.splitlines()
                if l.strip().startswith('|') and l.count('|') >= 3]
        # drop header + separator
        map_rows = [r for r in rows[2:] if not re.match(r'^\|[\s\-|:]+\|$',
                                                        r.strip())]
        check(len(map_rows) >= 1, 'Coverage Map has at least one data row')
        draft_ids = {cid for cid, _ in cases}
        cited_ids = set()
        for i, row in enumerate(map_rows, 1):
            cells = [c.strip() for c in row.strip().strip('|').split('|')]
            covered = cells[-1] if cells else ''
            ids_in_cell = set(re.findall(r'TC-[PN]\d+', covered))
            cited_ids |= ids_in_cell
            check(bool(ids_in_cell) or 'Open Questions' in covered,
                  f'Coverage Map row {i}: Covered by cites a case or '
                  f'Open Questions')
            for cid in ids_in_cell:
                check(cid in draft_ids,
                      f'Coverage Map row {i}: cited {cid} exists in draft')
        for cid in sorted(draft_ids - cited_ids):
            check(False, f'{cid} appears in no Coverage Map row')

    # 6 — sequential numbering per lane
    for lane in 'PN':
        nums = [int(n) for n in re.findall(rf'^### TC-{lane}(\d+)', text,
                                           re.M)]
        check(nums == list(range(1, len(nums) + 1)),
              f'TC-{lane}* numbered sequentially from 1')

    # counters (never gate)
    n_pos = len(re.findall(r'^### TC-P\d+', text, re.M))
    n_neg = len(re.findall(r'^### TC-N\d+', text, re.M))
    n_verify = len(re.findall(r'\[VERIFY[:\]]', text))
    steps_per_case = n_steps / len(cases) if cases else 0.0
    print(f'COUNTS: positive={n_pos} negative={n_neg} verify={n_verify} '
          f'mapRows={len(map_rows)} stepsPerCase={steps_per_case:.1f} '
          f'chars={len(text)}')
    if n_pos < 4 or n_neg < 3:
        print('WARN: under the prompt floor (4 positive / 3 negative) — '
              'almost certainly under-covered')

    if failures:
        print(f'RESULT: FAIL — {len(failures)} assertion(s) failed')
        sys.exit(1)
    print('RESULT: PASS')


main()
