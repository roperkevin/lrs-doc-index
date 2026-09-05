"""Gate for the test-case parser (local/lib/caseindex.mjs, phases 0-1
of local/Case_Index_Plan.md).

Proves extractCases/diffCaseRows against BOTH case shapes — and pins
the D1 coupling: the deck fixture's body is produced by the
presentation layer ITSELF (caseHeadings(tidyBody(raw)) imported from
lib/presentation.mjs) in the same run, so a drift in the emission
breaks this gate, not the corpus.

  1. deck legs: numbered + classification case, rule-b
     classification-only case, checklist slide / divider section /
     bare slide / author-titled section are NOT cases, scenario H3,
     slide provenance, tables+figures stripped from CaseText,
     per-case issue refs (url + hashtag w/ defaultRepo, url-claimed
     suppression), GitHub-style anchors
  2. draft legs: TC-P/TC-N contract, lane classification, scenario
     from the heading remainder, explicit repo#n refs, Coverage Map
     cells never parse as cases
  3. shape legs: no structure -> zero cases + "none"; both shapes ->
     larger set wins + mixed flag
  4. replace-set legs: unchanged plan -> zero ops; field change ->
     update by row id; SweptOn alone -> no op; new/stale/archived ->
     create/delete
  5. caps: caseTextCap honored, Title capped at 255

Pure stdlib + Node 22+, CI-friendly (harness.yml fixture-free job).
Usage: python3 check_caseindex.py
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
LIB = os.path.join(REPO, "local", "lib").replace(os.sep, "/")

PASS = []
FAIL = []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    mark = "ok  " if cond else "FAIL"
    print(f"  {mark} {name}" + ("" if cond else f"  <- {detail}"))


RAW_DECK = """## Slide 4
Positive - Non spanning line event
2. Loop – Split measure : 20
| Route | From | To |
| --- | --- | --- |
| R1L1 | 0 | 100 |
![fig](../media/doc12_slide4_fig1.svg)
![fig2](../media/doc12_slide4_fig2.svg)
[figure: 10–22 · R1 · E1 · Output]
See devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4855 and #612

## Slide 5
Negative - Line network
Normal route - Split measure :16

## Slide 6
1. Verify the first thing
2. Verify the second thing
3. Verify the third thing

## Slide 7
Conflict Prevention test cases

## Slide 8
Prose about the schedule with no case markers.
"""

DRAFT = """# Test Plan — Splitting Events (DRAFT)

## Setup

- Fixture route R1L1 0–100

## Test Cases

### TC-P1 — Split a non-spanning line event
1. Open the tool
2. Enter split measure 20
Expected Result: two events
Trace: story §2 (devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/999)

### TC-P2 — Split at the route end
Steps referencing ArcGISPro/ps-location-referencing#4855 explicitly.
```arcade
var sneaky = other/repo#4444; // merge events in a fence never tags
```

### TC-N1: Reject a split outside the route measure range
Steps.

## Coverage Map

| Requirement (source) | Covered by |
| --- | --- |
| Split (story §2) | TC-P1 |
"""

PROSE = "Just a prose document.\n\n## Background\n\nWords about nothing.\n"

# every other detector on one deck: S3 case table, S4 label list, S5
# labelled steps, S6 numbered cases, S2 titled case slide, a stoplist
# label that stays prose, a checklist that is not a case
SHAPES = """## Slide 1 — Scope
Notes:
- Test on RH and APR data
- Test in FGDB and FS

## Slide 2 — Coordinate Configuration Tests
| # | Test | Expected result |
| --- | --- | --- |
| A-1 | Toggle is present in the widget configuration | Toggle shown, OFF by default |
| A-2 | Click the toggle | Precision options appear |

## Slide 3
**Positive Tests: Normal Routes**
- Correct line order of 100, 200, 300, 400 on a normal line
- Time sliced routes, first slice 100, 200 and second 300, 400

**Negative Tests: Gapped Routes**
- Incorrect line order of 400, 200, 100 with a gap between routes 200 and 100

## Slide 4
UI Tests – First Pane:
- Verify the Open Type is set from the configuration
- Verify the Attribute Set is as configured

## Slide 5 — Positive cases
1. Normal route, coordinate input, positive offset
| Route | From |
| --- | --- |
| R2 | 0 |
2. Gapped route, coordinate input, negative offset

## Slide 6 — Test case 3: Transfer to existing line – keep original measures
| Rname | Line |
| --- | --- |
| 1A | Red |

## Slide 7
17. Verify the effective date defaults to today
18. Verify route information is shown on hover

## Slide 8 — Tooltip tests
| # | Test | Expected result |
| --- | --- | --- |
| <Null> | Hover a route with value > 10 -- expanded | tooltip shows <Null> |
"""

# v2.1 tuning (the first full-library export): data tables are not
# case tables, a Field column prefixes a data-shaped test, a Type
# column classifies the row, duplicate titles take a suffix, and the
# "Environments" / "Data to Test with" labels are stoplisted
TUNING = """## Slide 3 — Detect Objects
| Field | Test | Output |
| --- | --- | --- |
| Confidence threshold | (0.90,1000) | Tool runs; 12 detections |
| Input frames | Browse and select the frames point FC | Layer accepted |

## Slide 4 — Resolutions
| Resolution | Aspect Ratio |
| --- | --- |
| 1920x1080 | 16:9 |
| 1280x720 | 16:9 |

## Slide 5 — Route data
| Feature | RID | M |
| --- | --- | --- |
| Line | R21 | 0 |
| Line | R22 | 10.5 |

## Slide 6 — Route lookup
| Type | Test | Expected |
| --- | --- | --- |
| Positive | Enter a valid route id | Route is found |
| Negative | Enter an unknown route id | Error is shown |

## Slide 7 — Overlay on Simple Route
- Positive
- 1. Overlay on simple route R1 from 0 to 10
- Expected: Overlay draws once

## Slide 8 — Overlay on Simple Route
- Positive
- 2. Overlay on simple route R1 from 0 to 10
- Expected: Overlay draws twice

## Slide 9 — Environments
**Data to Test with:**
- Pro 3.5 with LRS data
- Enterprise 11.4

**Environments:**
- Windows 11
- Windows Server 2022
"""

NODE_SCRIPT = """
import { tidyBody } from "file://%(lib)s/presentation.mjs";
import { renderTestPlanBody, lintTestPlanBody } from "file://%(lib)s/casegrammar.mjs";
import { extractCases, toRowFields, diffCaseRows, caseIssueRefs,
  prepareVocab, caseTags } from "file://%(lib)s/caseindex.mjs";
import fs from "node:fs";

const fx = JSON.parse(fs.readFileSync(process.env.CASEINDEX_FIXTURE, "utf8"));
const MB = "https://mock.example/sites/l/LRS Doc Index/media";
const opts = { defaultRepo: "A/b", mediaUrlBase: MB };
const rendered = renderTestPlanBody(tidyBody(fx.rawDeck));
const deckBody = rendered.body;
const deck = extractCases(deckBody, opts);
const draft = extractCases(fx.draft, opts);
const prose = extractCases(fx.prose, opts);
const legacyMixed = extractCases(
  "## Case 2: Positive - Loop <!-- slide 4 -->\\nOld body.\\n\\n### TC-P1 — A draft-style case\\nSteps.\\n", opts);
const shapes = renderTestPlanBody(tidyBody(fx.shapes));
const mixed = extractCases(shapes.body, opts);
const tuning = renderTestPlanBody(tidyBody(fx.tuning));
const tuned = extractCases(tuning.body, opts);
const capped = extractCases(deckBody, { ...opts, caseTextCap: 10 });
const longTitle = extractCases(
  "### TC-P1 — " + "x".repeat(400) + "\\nSteps.\\n", opts);

const now = "2026-09-05T00:00:00Z";
const fresh = deck.cases.map((c) => toRowFields(12, c, now));
const asRows = (fields, fromId) =>
  fields.map((f, k) => ({ id: String(fromId + k), fields: { ...f } }));
const same = diffCaseRows(asRows(fresh, 101), fresh);
const changedRows = asRows(fresh, 101);
changedRows[0].fields.Scenario = "Different";
const changed = diffCaseRows(changedRows, fresh);
const sweptRows = asRows(fresh, 101);
sweptRows[1].fields.SweptOn = "2020-01-01T00:00:00Z";
const sweptOnly = diffCaseRows(sweptRows, fresh);
const grown = diffCaseRows(asRows(fresh.slice(1), 101), fresh);
const stale = diffCaseRows(
  asRows(fresh, 101).concat([{ id: "999", fields: { CaseKey: "12|9" } }]),
  fresh);
const archived = diffCaseRows(asRows(fresh, 101), []);
// hyperlink norm (v1.4): FigureLink compares by Url — a differing
// Description alone never dirties; a differing Url does
const hlSameRows = asRows(fresh, 301);
hlSameRows[0].fields.FigureLink = { Url: fresh[0].FigureLink.Url, Description: "other desc" };
const hlSame = diffCaseRows(hlSameRows, fresh);
const hlDiffRows = asRows(fresh, 301);
hlDiffRows[0].fields.FigureLink = { Url: "https://elsewhere/x.svg", Description: "x" };
const hlDiff = diffCaseRows(hlDiffRows, fresh);

process.stdout.write(JSON.stringify({
  deckBody, deck, draft, prose,
  renderedShape: rendered.shape, lint: lintTestPlanBody(deckBody),
  legacyMixed: { shape: legacyMixed.shape, mixed: legacyMixed.mixed, count: legacyMixed.cases.length },
  shapesBody: shapes.body,
  tuningBody: tuning.body,
  tuned: { shape: tuned.shape, lint: lintTestPlanBody(tuning.body),
           cases: tuned.cases.map((c) => ({ caseNo: c.caseNo, det: c.det, classification: c.classification,
             scenario: c.scenario, title: c.title, sourceRef: c.sourceRef, expectedResult: c.expectedResult,
             text: c.text })) },
  mixed: { shape: mixed.shape, mixed: mixed.mixed, count: mixed.cases.length,
           cases: mixed.cases.map((c) => ({ caseNo: c.caseNo, det: c.det, classification: c.classification,
             scenario: c.scenario, group: c.group, sourceRef: c.sourceRef, confidence: c.confidence,
             expectedResult: c.expectedResult, stepCount: c.stepCount, slideNo: c.slideNo })) },
  cappedTextLens: capped.cases.map((c) => c.text.length),
  longTitleLen: toRowFields(1, longTitle.cases[0], now).Title.length,
  fresh, same, changed, sweptOnly, grown, stale, archived, hlSame, hlDiff,
  refsBare: caseIssueRefs("see #612 and #12", "A/b"),
  refsNoRepo: caseIssueRefs("see #612", ""),
  refsDigits: caseIssueRefs("expr 40+5 a/b#0 and a/b#12, real a/b#4855", ""),
  rawFig: extractCases(deckBody, { defaultRepo: "A/b" }).cases[0].figureLinks,
  dfOrder: caseTags("route and split measure and self intersection", prepareVocab([
    { title: "route", kind: "topic", canonical: "route", df: 439 },
    { title: "split measure", kind: "topic", canonical: "split measure", df: 12 },
    { title: "self intersection", kind: "topic", canonical: "self intersection", df: 3 },
  ])).keywords,
  tags: (() => {
    const vocab = prepareVocab([
      { title: "merge events", kind: "tool", canonical: "merge events" },
      { title: "merge event tool", kind: "tool", canonical: "merge events" },
      { title: "lock", kind: "topic", canonical: "locks" },
      { title: "locks", kind: "topic", canonical: "locks" },
      { title: "split measure", kind: "topic", canonical: "split measure" },
    ]);
    return {
      deck: extractCases(deckBody, { ...opts, vocab,
        planTitle: "Merge Events Test Plan" }).cases,
      draft: extractCases(fx.draft, { ...opts, vocab }).cases,
      direct: caseTags("The Merge   Event Tool holds locks; blocked text", vocab),
    };
  })(),
}));
"""


def main():
    tmp = os.path.join(HERE, "_caseindex_fixture.json")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump({"rawDeck": RAW_DECK, "draft": DRAFT, "prose": PROSE, "shapes": SHAPES,
                   "tuning": TUNING}, f)
    try:
        proc = subprocess.run(
            ["node", "--input-type=module", "-e", NODE_SCRIPT % {"lib": LIB}],
            capture_output=True, text=True, timeout=120,
            env={**os.environ, "CASEINDEX_FIXTURE": tmp})
        if proc.returncode != 0:
            print(proc.stdout)
            print(proc.stderr)
            print("FAILED: node run errored")
            sys.exit(1)
        r = json.loads(proc.stdout)
    finally:
        os.unlink(tmp)

    print("-- deck shape (via the presentation layer's own emission) --")
    deck = r["deck"]
    cases = deck["cases"]
    check("deck: shape is the S1 detector (profile rendered)",
          deck["shape"] == "S1" and r["renderedShape"] == "S1", deck["shape"])
    check("deck: profile lint clean", r["lint"] == [], json.dumps(r["lint"]))
    check("deck: exactly the two case slides", len(cases) == 2,
          json.dumps([c["title"] for c in cases]))
    c1 = cases[0] if cases else {}
    check("deck: numbered case title from the case + classification lines",
          c1.get("title") == "TC-P01 — Loop", c1.get("title", ""))
    check("deck: caseNo is the TC id; the deck's own number rides the src",
          c1.get("caseNo") == "TC-P01" and "case 2" in c1.get("sourceRef", ""),
          c1.get("caseNo", "") + " / " + c1.get("sourceRef", ""))
    check("deck: group from the classification line",
          c1.get("group") == "Non Spanning Line Event", c1.get("group", ""))
    check("deck: slide provenance", c1.get("slideNo") == 4, str(c1.get("slideNo")))
    check("deck: classification Positive", c1.get("classification") == "Positive")
    check("deck: scenario is the heading remainder", c1.get("scenario") == "Loop",
          c1.get("scenario", ""))
    check("deck: case specifics survive in CaseText",
          "Split measure: 20" in c1.get("text", ""), c1.get("text", ""))
    check("deck: table rows stripped from CaseText",
          "R1L1" not in c1.get("text", ""), c1.get("text", ""))
    check("deck: figure links stripped from CaseText",
          "fig1.svg" not in c1.get("text", ""), c1.get("text", ""))
    check("deck: url ref claims its number, hashtag takes defaultRepo",
          c1.get("issueRefs") == ["A/b#612", "ArcGISPro/ps-location-referencing#4855"],
          json.dumps(c1.get("issueRefs")))
    check("deck: anchor is the GitHub slug of the visible heading",
          c1.get("anchor") == "tc-p01--loop", c1.get("anchor", ""))
    c2 = cases[1] if len(cases) > 1 else {}
    check("deck: rule-b classification-only heading is a case",
          c2.get("title") == "TC-N01 — Normal Route", c2.get("title", ""))
    check("deck: rule-b classification", c2.get("classification") == "Negative")
    check("deck: rule-b group is the classification remainder",
          c2.get("group") == "Line Network", c2.get("group", ""))
    check("deck: rule-b scenario", c2.get("scenario") == "Normal Route",
          c2.get("scenario", ""))
    check("deck: ordinals are 1-based document order",
          [c["ordinal"] for c in cases] == [1, 2])
    body = r["deckBody"]
    check("deck: checklist slide lands under Other content (not a case)",
          "### Slide 6 <!-- slide 6 -->" in body.split("## Other content")[-1], body)
    check("deck: divider section rendered but not a case",
          "Conflict Prevention test cases" in body.split("## Other content")[-1], body)
    check("deck: profile sections in order",
          body.index("## Test Cases") < body.index("## Other content")
          and "## Overview" not in body, body)

    print("-- draft shape (the draftlint TC contract) --")
    draft = r["draft"]
    dcases = draft["cases"]
    check("draft: shape", draft["shape"] == "draft", draft["shape"])
    check("draft: three TC cases", len(dcases) == 3,
          json.dumps([c["caseNo"] for c in dcases]))
    check("draft: caseNo is the TC id",
          [c["caseNo"] for c in dcases] == ["TC-P1", "TC-P2", "TC-N1"],
          json.dumps([c["caseNo"] for c in dcases]))
    check("draft: lane letters classify",
          [c["classification"] for c in dcases] == ["Positive", "Positive", "Negative"])
    check("draft: scenario from the heading remainder",
          dcases[0]["scenario"] == "Split a non-spanning line event",
          dcases[0]["scenario"])
    check("draft: colon-form heading remainder also cleans",
          dcases[2]["scenario"] == "Reject a split outside the route measure range",
          dcases[2]["scenario"])
    check("draft: no slide number", dcases[0]["slideNo"] is None)
    check("draft: url ref in the case's own section",
          dcases[0]["issueRefs"] == ["ArcGISPro/ps-location-referencing#999"],
          json.dumps(dcases[0]["issueRefs"]))
    check("draft: explicit repo#n ref",
          dcases[1]["issueRefs"] == ["ArcGISPro/ps-location-referencing#4855"],
          json.dumps(dcases[1]["issueRefs"]))
    check("draft: section ends at the next H2 (Coverage Map excluded)",
          "Requirement" not in dcases[2]["text"], dcases[2]["text"])

    print("-- shape decisions --")
    check("no structure: zero cases, shape none",
          r["prose"]["shape"] == "none" and r["prose"]["cases"] == [],
          json.dumps(r["prose"]))
    check("legacy deck section + TC section: the TC grammar wins",
          r["legacyMixed"]["shape"] == "draft" and r["legacyMixed"]["count"] == 1
          and r["legacyMixed"]["mixed"] is False, json.dumps(r["legacyMixed"]))
    check("deck fixture alone is not mixed", deck["mixed"] is False)

    print("-- the other detectors (S2–S6) --")
    mx = r["mixed"]
    mc = {c["caseNo"]: c for c in mx["cases"]}
    check("several detectors on one plan: shape mixed, flagged",
          mx["shape"] == "mixed" and mx["mixed"] is True, json.dumps(mx)[:300])
    dets = [c["det"] for c in mx["cases"]]
    check("S3 table rows are cases with id, expected result and the row in src",
          mc.get("TC-U01", {}).get("det") == "S3"
          and mc["TC-U01"]["expectedResult"] == "Toggle shown, OFF by default"
          and mc["TC-U01"]["sourceRef"] == "S3 · slide 2 · table · A-1"
          and mc["TC-U01"]["slideNo"] == 2, json.dumps(mc.get("TC-U01")))
    check("S4 Positive/Negative label items are one case each with the group",
          mc.get("TC-P01", {}).get("det") == "S4" and mc["TC-P01"]["group"] == "Normal Routes"
          and mc["TC-P01"]["scenario"].startswith("Correct line order of 100")
          and mc.get("TC-N01", {}).get("det") == "S4" and mc["TC-N01"]["group"] == "Gapped Routes",
          json.dumps([mc.get("TC-P01"), mc.get("TC-N01")]))
    check("S5 other label: one case per label, bullets as numbered steps, medium confidence",
          mc.get("TC-U03", {}).get("det") == "S5" and mc["TC-U03"]["scenario"] == "UI Tests – First Pane"
          and mc["TC-U03"]["stepCount"] == 2 and mc["TC-U03"]["confidence"] == "medium",
          json.dumps(mc.get("TC-U03")))
    check("S6 numbered cases under a Positive title: one case per line, table rides with its case",
          [c["caseNo"] for c in mx["cases"] if c["det"] == "S6"] == ["TC-P03", "TC-P04"]
          and "| R2 | 0 |" in r["shapesBody"].split("### TC-P03")[1].split("### TC-P04")[0],
          json.dumps([c for c in mx["cases"] if c["det"] == "S6"]))
    check("S2 titled case slide is one case with the slide's tables (lane inherited from the Positive divider)",
          any(c["det"] == "S2" and c["caseNo"] == "TC-P05"
              and c["scenario"].startswith("Transfer to existing line") for c in mx["cases"])
          and "| 1A | Red |" in r["shapesBody"], json.dumps([c for c in mx["cases"] if c["det"] == "S2"]))
    nul = [c for c in mx["cases"] if c["scenario"].startswith("Hover a route")]
    check("angle brackets and double dashes never break a heading or its src comment",
          len(nul) == 1 and nul[0]["det"] == "S3" and nul[0]["sourceRef"].endswith("table · Null")
          and "‹Null›" not in nul[0]["scenario"] and "›" in nul[0]["scenario"]
          and r["lint"] == [], json.dumps(nul) + json.dumps(r["lint"]))
    check("stoplist label (Notes) stays prose in Overview; checklist slide is not a case",
          "## Overview" in r["shapesBody"] and "- Test on RH and APR data" in r["shapesBody"].split("## Test Cases")[0]
          and "17. Verify the effective date" in r["shapesBody"].split("## Other content")[-1]
          and not any("effective date" in c["scenario"] for c in mx["cases"]), r["shapesBody"][:600])
    check("ids are per-lane sequences in document order",
          [c["caseNo"] for c in mx["cases"]] == ["TC-U01", "TC-U02", "TC-P01", "TC-P02", "TC-N01",
                                                  "TC-U03", "TC-P03", "TC-P04", "TC-P05", "TC-P06"],
          json.dumps([c["caseNo"] for c in mx["cases"]]))

    print("-- v2.1 tuning (data tables, Field prefix, Type column, duplicate titles, stoplist) --")
    tn = r["tuned"]
    tc = {c["caseNo"]: c for c in tn["cases"]}
    tb = r["tuningBody"]
    prose = tb.split("## Test Cases")[0] + tb.split("## Other content")[-1]
    scen = [c["scenario"] for c in tn["cases"]]
    check("tuning: profile lint clean", tn["lint"] == [], json.dumps(tn["lint"]))
    check("data tables (Resolution/Aspect Ratio, Feature/RID/M) are not cases and stay prose",
          not any(x in " ".join(scen) for x in ("16:9", "R21", "R22", "1920x1080"))
          and "| 1920x1080 | 16:9 |" in prose and "| Line | R21 | 0 |" in prose,
          json.dumps(scen))
    check("a Field column prefixes a data-shaped test; Output is an expected column",
          tc.get("TC-U01", {}).get("det") == "S3"
          and tc["TC-U01"]["scenario"] == "Confidence threshold: (0.90,1000)"
          and tc["TC-U01"]["expectedResult"] == "Tool runs; 12 detections"
          and "**Field:**" not in tc["TC-U01"]["text"], json.dumps(tc.get("TC-U01")))
    check("a wordy test in the same table keeps its own title and the Field rides as a line",
          tc.get("TC-U02", {}).get("scenario") == "Browse and select the frames point FC"
          and "**Field:** Input frames" in tc["TC-U02"]["text"], json.dumps(tc.get("TC-U02")))
    check("a Type column classifies each row; the column is not repeated in the body",
          tc.get("TC-P01", {}).get("scenario") == "Enter a valid route id"
          and tc["TC-P01"]["classification"] == "Positive"
          and tc.get("TC-N01", {}).get("scenario") == "Enter an unknown route id"
          and tc["TC-N01"]["classification"] == "Negative"
          and "**Type:**" not in tc["TC-P01"]["text"],
          json.dumps([tc.get("TC-P01"), tc.get("TC-N01")]))
    dup = [c for c in tn["cases"] if c["det"] == "S1"]
    check("duplicate titles within a plan take the case number as a suffix",
          [c["scenario"] for c in dup] == ["Overlay on Simple Route From 0 To 10 (case 1)",
                                           "Overlay on Simple Route From 0 To 10 (case 2)"]
          and [c["caseNo"] for c in dup] == ["TC-P02", "TC-P03"], json.dumps(dup))
    check("Environments / Data to Test with labels are stoplisted (prose, not S5 cases)",
          not any("Environments" in x or "Data to Test" in x for x in scen)
          and "- Pro 3.5 with LRS data" in tb.split("## Other content")[-1],
          json.dumps(scen))
    check("tuning: exactly six cases", len(tn["cases"]) == 6, json.dumps([c["caseNo"] for c in tn["cases"]]))

    print("-- issue refs --")
    check("hashtag needs 3+ digits", r["refsBare"] == ["A/b#612"],
          json.dumps(r["refsBare"]))
    check("hashtag without a defaultRepo yields nothing", r["refsNoRepo"] == [],
          json.dumps(r["refsNoRepo"]))
    check("explicit repo#n needs 3-5 digits (the live #0 phantom)",
          r["refsDigits"] == ["a/b#4855"], json.dumps(r["refsDigits"]))
    check("fenced code never mints refs (TC-P2's arcade trap)",
          dcases[1]["issueRefs"] == ["ArcGISPro/ps-location-referencing#4855"],
          json.dumps(dcases[1]["issueRefs"]))

    print("-- per-case metadata (v1.1) --")
    check("deck case: shape/figure/table counts and routes from the fixture table",
          c1.get("shape") == "S1" and c1.get("figureCount") == 3
          and c1.get("tableCount") == 1 and c1.get("stepCount") == 0
          and c1.get("routeRefs") == "R1L1", json.dumps(c1))
    check("deck case: no draft contract lines",
          c1.get("expectedResult") == "" and c1.get("traceText") == "",
          json.dumps(c1))
    d1 = dcases[0]
    check("draft case: steps counted, shape stamped",
          d1.get("shape") == "draft" and d1.get("stepCount") == 2
          and d1.get("figureCount") == 0 and d1.get("tableCount") == 0,
          json.dumps(d1))
    check("draft case: Expected Result line captured",
          d1.get("expectedResult") == "two events", json.dumps(d1))
    check("draft case: Trace line captured (per-case grounding provenance)",
          str(d1.get("traceText")).startswith("story §2"), json.dumps(d1))
    print("-- vocabulary tags (v1.2) --")
    tg = r["tags"]
    check("plan title names the tested tool on every case",
          [c["tools"] for c in tg["deck"]] == [["merge events"], ["merge events"]],
          json.dumps([c["tools"] for c in tg["deck"]]))
    check("case-text keywords matched word-boundary",
          tg["deck"][0]["keywords"] == ["split measure"]
          and tg["deck"][1]["keywords"] == ["split measure"],
          json.dumps([c["keywords"] for c in tg["deck"]]))
    check("alias folds to canonical across flexible whitespace, "
          "'blocked' never matches 'lock'",
          tg["direct"] == {"tools": ["merge events"], "keywords": ["locks"]},
          json.dumps(tg["direct"]))
    check("fenced vocab terms never tag (TC-P2's arcade trap)",
          tg["draft"][1]["tools"] == [], json.dumps(tg["draft"][1]))
    check("draft steps tag from their own text",
          tg["draft"][0]["keywords"] == ["split measure"],
          json.dumps(tg["draft"][0]["keywords"]))
    check("no vocabulary = empty tag columns, never a guess",
          r["fresh"][0].get("Tools") == "" and r["fresh"][0].get("Keywords") == "",
          json.dumps(r["fresh"][0]))

    print("-- figure links + rarest-first ordering (v1.3) --")
    MB = "https://mock.example/sites/l/LRS Doc Index/media"
    check("rendered figures resolve onto the media folder URL; the "
          "collapsed [figure:] label mints no link",
          c1.get("figureLinks") == [f"{MB}/doc12_slide4_fig1.svg",
                                    f"{MB}/doc12_slide4_fig2.svg"],
          json.dumps(c1.get("figureLinks")))
    check("figure-less case has no links",
          cases[1].get("figureLinks") == [], json.dumps(cases[1].get("figureLinks")))
    check("no mediaUrlBase keeps the raw sidecar-relative target",
          r["rawFig"] == ["../media/doc12_slide4_fig1.svg",
                          "../media/doc12_slide4_fig2.svg"], json.dumps(r["rawFig"]))
    check("row shaping joins FigureLinks newline-separated",
          r["fresh"][0].get("FigureLinks")
          == f"{MB}/doc12_slide4_fig1.svg\n{MB}/doc12_slide4_fig2.svg",
          json.dumps(r["fresh"][0].get("FigureLinks")))
    check("FigureLink is the primary figure as a hyperlink value (v1.4)",
          r["fresh"][0].get("FigureLink")
          == {"Url": f"{MB}/doc12_slide4_fig1.svg",
              "Description": "doc12_slide4_fig1.svg (+1 more)"},
          json.dumps(r["fresh"][0].get("FigureLink")))
    check("figure-less row clears the hyperlink",
          r["fresh"][1].get("FigureLink") == "",
          json.dumps(r["fresh"][1].get("FigureLink")))
    check("hyperlink diff compares by Url: description drift never dirties",
          r["hlSame"] == {"create": [], "update": [], "delete": []},
          json.dumps(r["hlSame"]))
    check("hyperlink diff compares by Url: a moved link updates",
          len(r["hlDiff"]["update"]) == 1 and not r["hlDiff"]["create"]
          and not r["hlDiff"]["delete"], json.dumps(r["hlDiff"]))
    check("keywords order rarest-first (ascending df, then name)",
          r["dfOrder"] == ["self intersection", "split measure", "route"],
          json.dumps(r["dfOrder"]))

    row0 = r["fresh"][0]
    check("row shaping carries the v1.1 + v2.0 columns",
          row0.get("Shape") == "S1" and row0.get("Confidence") == "high"
          and row0.get("Group") == "Non Spanning Line Event"
          and row0.get("SourceRef") == "S1 · slide 4 · case 2"
          and row0.get("TableCount") == 1
          and row0.get("RouteRefs") == "R1L1"
          and "ExpectedResult" in row0 and "TraceText" in row0
          and "StepCount" in row0 and "FigureCount" in row0,
          json.dumps(row0))

    print("-- replace-set planner --")
    fresh = r["fresh"]
    check("rows: CaseKey is docRowId|ordinal",
          [f["CaseKey"] for f in fresh] == ["12|1", "12|2"],
          json.dumps([f["CaseKey"] for f in fresh]))
    check("rows: lookup id field shaped for Graph",
          all(f["DocumentLookupId"] == 12 for f in fresh))
    check("unchanged plan: zero ops",
          r["same"] == {"create": [], "update": [], "delete": []},
          json.dumps(r["same"]))
    check("field change: one update by row id",
          len(r["changed"]["update"]) == 1 and r["changed"]["update"][0]["id"] == "101"
          and not r["changed"]["create"] and not r["changed"]["delete"],
          json.dumps(r["changed"]))
    check("SweptOn alone never triggers an update",
          r["sweptOnly"] == {"create": [], "update": [], "delete": []},
          json.dumps(r["sweptOnly"]))
    check("new case: one create",
          len(r["grown"]["create"]) == 1
          and r["grown"]["create"][0]["CaseKey"] == "12|1"
          and not r["grown"]["update"] and not r["grown"]["delete"],
          json.dumps(r["grown"]))
    check("stale row: deleted by id",
          r["stale"]["delete"] == ["999"] and not r["stale"]["create"]
          and not r["stale"]["update"], json.dumps(r["stale"]))
    check("archived doc: full deletion",
          sorted(r["archived"]["delete"]) == ["101", "102"]
          and not r["archived"]["create"] and not r["archived"]["update"],
          json.dumps(r["archived"]))

    print("-- caps --")
    check("caseTextCap honored", all(n <= 10 for n in r["cappedTextLens"]),
          json.dumps(r["cappedTextLens"]))
    check("Title capped at 255", r["longTitleLen"] == 255, str(r["longTitleLen"]))

    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FAILED: " + ", ".join(FAIL))
        sys.exit(1)
    print("PASSED")


if __name__ == "__main__":
    main()
