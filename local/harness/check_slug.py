#!/usr/bin/env python3
"""Gate for local/lib/slug.mjs — the sidecar stem rules
(Sidecar_Format_Plan §4.6, phase 1b):

  1. kind words dropped when they match the kind ("Test Plan: X",
     "X Test Plan V2", "Spike: X", "X User Story")
  2. glossary abbreviations applied to whole slug tokens only
  3. soft cap at a word boundary, never ending on a stopword
  4. primary issue: filename prefix, then lowest url id, then any
  5. incremental minting: base, then product / rev / month
     qualifiers, then a numeric suffix
  6. batch minting (--rename): a colliding group all take the first
     qualifier level that separates them; re-uploads get suffixes in
     row-id order; deterministic
  7. media link parsing (legacy flat doc{N}_ and media/<stem>/)

Prereqs: Node 22+. Run from anywhere.
"""
import json
import os
import subprocess
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
failures = []


def check(name, cond, detail=""):
    print(("  ok   " if cond else "  FAIL ") + name + ("" if cond else f"  <- {detail}"))
    if not cond:
        failures.append(name)


def run(js):
    r = subprocess.run(
        ["node", "--input-type=module", "-e",
         "import * as S from './local/lib/slug.mjs';\n" + js],
        capture_output=True, text=True, cwd=REPO,
    )
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-800:])
    return json.loads(r.stdout)


def main():
    print("== slug rules")
    cases = [
        ("Append Routes: Line Order Check Test Plan", "Test Plan", "4975-AppendRoutesLineOrderCheck_TestPlan_V2.pptx",
         "append-routes-line-order-check"),
        ("Test Plan: Display Expanded LRS and Business Attributes in the SLD Hover Tooltip", "Test Plan", "x.pptx",
         "display-expanded-lrs-and-business-attributes-in-the-sld"),
        ("Experience Builder: Add Multiple Line Events Widget Test Plan", "Test Plan", "x.docx",
         "exb-add-multiple-line-events-widget"),
        ("Spike: Benchmark Overlay Events in GP vs API", "Design Spike", "s.pptx",
         "benchmark-overlay-events-in-gp-vs-api"),
        ("Flip Centerline Tool – In-memory Flip User Story", "User Story", "z.pptx",
         "flip-centerline-tool-in-memory-flip"),
        ("Event Behavior for Route Retirement", "Other", "EB retire RH 5633.docx",
         "eb-for-route-retirement"),
        ("Dynamic Segmentation Table Experience Builder Test Plan", "Test Plan", "d.pptx",
         "dynseg-table-exb"),
        ("Project Properties Review", "Other", "p.docx", "project-properties-review"),
        ("", "Test Plan", "3910-AddLineEventIntersectionOffsetMethod_TestPlan_V4.pptx",
         "add-line-event-intersection-offset-method"),
        ("", "Other", "Bug_Regression_testing (2) 1.pdf", "bug-regression-testing"),
    ]
    got = run("console.log(JSON.stringify(" + json.dumps(
        [{"title": t, "kind": k, "fileName": f} for t, k, f, _ in cases]) +
        ".map(c => S.slugFor(c))))")
    for (t, k, f, want), g in zip(cases, got):
        check(f"slug {want!r}", g == want, f"{g!r} for {t!r} / {f!r}")

    long_title = ("Bug verification and regression testing for Append Routes, Append Events and "
                  "Generate Intersections after the unique route name check was relaxed")
    g = run(f"console.log(JSON.stringify(S.slugFor({json.dumps({'title': long_title, 'kind': 'Test Plan', 'fileName': 'b.pdf'})})))")
    check("soft cap cuts at a word boundary and never on a stopword",
          len(g) <= 60 and not g.endswith("-and") and not g.endswith("-for") and g.startswith("bug-verification"), g)
    g = run("console.log(JSON.stringify(S.abbreviate('project-pro-arcgis-pro-tools')))")
    check("abbreviations replace whole tokens only", g == "project-pro-pro-tools", g)

    print("== primary issue")
    g = run("console.log(JSON.stringify(["
            "S.primaryIssue([{repo:'a',number:16343,source:'url'},{repo:'b',number:4975,source:'filename'}],'4975-x.pptx'),"
            "S.primaryIssue([{repo:'a',number:26618,source:'hashtag'},{repo:'a',number:120,source:'url'}],'x.pptx'),"
            "S.primaryIssue([],'x.pptx')]))")
    check("filename prefix wins, then lowest url id, then none", g == [4975, 120, 0], str(g))

    print("== minting")
    g = run("console.log(JSON.stringify(["
            "S.mintStem({title:'X',fileName:'x.pptx',kind:'Other',ids:[{repo:'a',number:12,source:'url'}]}, new Set()),"
            "S.mintStem({title:'X',fileName:'x.pptx',kind:'Other',products:['Utility Network']}, new Set(['x'])),"
            "S.mintStem({title:'X',fileName:'x.pptx',kind:'Other',products:['Utility Network'],docRevision:'V3'}, new Set(['x','x-un'])),"
            "S.mintStem({title:'X',fileName:'x.pptx',kind:'Other'}, new Set(['x']))]))")
    check("incremental: issue prefix, product, product+rev, numeric suffix",
          g == ["12-x", "x-un", "x-un-v3", "x-2"], str(g))
    docs = [
        {"rowId": 2, "title": "Event Behavior for Route Retirement", "fileName": "EB retire APR 5633.docx",
         "kind": "Other", "products": ["Pipeline Referencing"], "lastEdited": "2024-02-29"},
        {"rowId": 1, "title": "Event Behavior for Route Retirement", "fileName": "EB retire RH 5633.docx",
         "kind": "Other", "products": ["Roads & Highways"], "lastEdited": "2024-02-29"},
        {"rowId": 3, "title": "Bug Regression", "fileName": "Bug_Regression_testing (2).pdf", "kind": "Test Plan"},
        {"rowId": 4, "title": "Bug Regression", "fileName": "Bug_Regression_testing (2) 1.pdf", "kind": "Test Plan"},
        {"rowId": 5, "title": "Lone", "fileName": "l.pptx", "kind": "Other"},
    ]
    g = run(f"console.log(JSON.stringify([...S.mintStems({json.dumps(docs)})]))")
    got = dict((int(k), v) for k, v in g)
    check("batch: RH/APR twins both qualified by product",
          got[1] == "eb-for-route-retirement-rh" and got[2] == "eb-for-route-retirement-apr", str(got))
    check("batch: indistinguishable re-uploads get numeric suffixes in row-id order",
          got[3] == "bug-regression" and got[4] == "bug-regression-2", str(got))
    check("batch: a lone document keeps its base stem", got[5] == "lone", str(got))
    g2 = run(f"console.log(JSON.stringify([...S.mintStems({json.dumps(list(reversed(docs)))})]))")
    check("batch minting is deterministic regardless of input order", dict((int(k), v) for k, v in g2) == got, str(g2))

    print("== media links")
    g = run("console.log(JSON.stringify(S.mediaLinksOf('![a](../media/doc494_slide3.svg) ![b](<../media/4975-x/image2.png>) ![a](../media/doc494_slide3.svg)')))")
    check("legacy flat and stem-folder links parsed once each",
          g == [{"link": "../media/doc494_slide3.svg", "dir": "", "name": "slide3.svg", "legacyPrefix": "doc494_"},
                {"link": "../media/4975-x/image2.png", "dir": "4975-x", "name": "image2.png"}], str(g))
    g = run("console.log(JSON.stringify([S.relinkMedia('x ../media/__MEDIA__/a.png y', '12-s'), S.stemOf('https://h/LRS%20Doc%20Index/Test%20Plans/12-s.md'), S.isLegacyStem('a__doc4')]))")
    check("relink, stemOf, isLegacyStem", g == ["x ../media/12-s/a.png y", "12-s", True], str(g))

    print()
    if failures:
        print(f"FAILED: {', '.join(failures)}")
        sys.exit(1)
    print("PASSED")


if __name__ == "__main__":
    main()
