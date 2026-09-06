import sys, re
src_path, out_path = sys.argv[1], sys.argv[2]
src = open(src_path, encoding='utf-8').read()
# neutralize the ExcelScript type for Node runs
src = src.replace('workbook: ExcelScript.Workbook', 'workbook: unknown')
test = '''
// ---- harness appendix ----
declare const require: (m: string) => { readFileSync: (p: string, e: string) => string };
const fs = require('fs');
const which = (globalThis as {process?: {argv: string[]}}).process!.argv[2];
const b64 = fs.readFileSync(which, 'utf8');
const label = (globalThis as {process?: {argv: string[]}}).process!.argv[3] || '';
const t0 = Date.now();
const res = main(null as unknown, b64, label);
const t1 = Date.now();
console.log(JSON.stringify({ms: t1 - t0, out: res}));
'''
open(out_path, 'w', encoding='utf-8').write(src + test)
