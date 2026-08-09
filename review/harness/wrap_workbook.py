"""Wrap WorkbookDump.ts for Node with a mock ExcelScript workbook.

Like wrap.py, but the appendix builds a workbook double from a
sheets.json file (see make_fixtures.py fixture 4) — worksheets exposing
getName/getUsedRange/getRowCount/getColumnCount/getTexts — and prints
{out: main(mock, 60000)}.

Usage: python3 wrap_workbook.py ../../scripts/WorkbookDump.ts wbd_v11.ts
       node --experimental-strip-types wbd_v11.ts sheets.json
"""
import sys

src_path, out_path = sys.argv[1], sys.argv[2]
src = open(src_path).read()
mock_type = ('{ getWorksheets: () => { getName: () => string; getUsedRange: () => '
             '{ getRowCount: () => number; getColumnCount: () => number; '
             'getTexts: () => string[][] } | null }[] }')
src = src.replace('workbook: ExcelScript.Workbook', 'workbook: ' + mock_type)
test = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const sheets: { [name: string]: string[][] } = JSON.parse(fs.readFileSync(which, 'utf8'));
function mockSheet(name: string, grid: string[][]) {
  const w = grid.length ? Math.max(...grid.map((r) => r.length)) : 0;
  const rect = grid.map((r) => { const c = r.slice(); while (c.length < w) c.push(''); return c; });
  return {
    getName: () => name,
    getUsedRange: () => grid.length === 0 ? null : {
      getRowCount: () => rect.length,
      getColumnCount: () => w,
      getTexts: () => rect,
    },
  };
}
const mock = { getWorksheets: () => Object.keys(sheets).map((n) => mockSheet(n, sheets[n])) };
console.log(JSON.stringify({ out: main(mock, 60000) }));
'''
open(out_path, 'w').write(src + test)
