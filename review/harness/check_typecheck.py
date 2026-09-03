"""Standing ES2017 type-check gate over scripts/ (review r7, C5).

Every promotion note has always claimed "type-checks at ES2017
(`tsc --noEmit --target es2017`)" — but the check ran manually, per
batch. This suite makes it a standing CI gate over the CURRENT
scripts/ tree, using the check_batch_r2 recipe verbatim: each Office
Script is its own global scope, so each file type-checks alone;
WorkbookDump really reads its workbook param and gets the
wrap_workbook.py mock type, everything else treats it as a dummy.

Pure stdlib + npx typescript. Usage: python3 check_typecheck.py
"""
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPTS = os.path.join(os.path.dirname(os.path.dirname(HERE)), "scripts")

WB_MOCK = ('{ getWorksheets: () => { getName: () => string; getUsedRange: () => '
           '{ getRowCount: () => number; getColumnCount: () => number; '
           'getTexts: () => string[][] } | null }[] }')

failures = []
tmp = tempfile.mkdtemp(prefix="tsc-gate-")
names = sorted(f for f in os.listdir(SCRIPTS) if f.endswith(".ts"))
if not names:
    print("no scripts found under", SCRIPTS)
    sys.exit(1)
for name in names:
    swap = WB_MOCK if name == "WorkbookDump.ts" else "unknown"
    body = open(os.path.join(SCRIPTS, name), encoding="utf-8").read().replace(
        "workbook: ExcelScript.Workbook", "workbook: " + swap)
    tsc_file = os.path.join(tmp, name.replace(".ts", "_tsc.ts").lower())
    open(tsc_file, "w", encoding="utf-8").write(body)
    r = subprocess.run(
        ["npx", "--yes", "--package", "typescript", "tsc", "--noEmit",
         "--target", "es2017", tsc_file],
        capture_output=True, text=True, encoding="utf-8")
    ok = r.returncode == 0
    print(("ok   " if ok else "FAIL ") + f"{name} type-checks at ES2017")
    if not ok:
        failures.append(name)
        print((r.stdout + r.stderr)[-2000:])

print()
if failures:
    print(f"RESULT: FAIL — {len(failures)} script(s): {', '.join(failures)}")
    sys.exit(1)
print("RESULT: PASS")
