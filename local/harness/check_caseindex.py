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

NODE_SCRIPT = """
import { tidyBody, caseHeadings } from "file://%(lib)s/presentation.mjs";
import { extractCases, toRowFields, diffCaseRows, caseIssueRefs,
  prepareVocab, caseTags } from "file://%(lib)s/caseindex.mjs";
import fs from "node:fs";

const fx = JSON.parse(fs.readFileSync(process.env.CASEINDEX_FIXTURE, "utf8"));
const MB = "https://mock.example/sites/l/LRS Doc Index/media";
const opts = { defaultRepo: "A/b", mediaUrlBase: MB };
const deckBody = caseHeadings(tidyBody(fx.rawDeck));
const deck = extractCases(deckBody, opts);
const draft = extractCases(fx.draft, opts);
const prose = extractCases(fx.prose, opts);
const mixed = extractCases(
  deckBody + "\\n### TC-P1 — A stray draft-style case\\nSteps.\\n", opts);
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

process.stdout.write(JSON.stringify({
  deckBody, deck, draft, prose,
  mixed: { shape: mixed.shape, mixed: mixed.mixed, count: mixed.cases.length },
  cappedTextLens: capped.cases.map((c) => c.text.length),
  longTitleLen: toRowFields(1, longTitle.cases[0], now).Title.length,
  fresh, same, changed, sweptOnly, grown, stale, archived,
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
        json.dump({"rawDeck": RAW_DECK, "draft": DRAFT, "prose": PROSE}, f)
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
    check("deck: shape", deck["shape"] == "deck", deck["shape"])
    check("deck: exactly the two case slides", len(cases) == 2,
          json.dumps([c["title"] for c in cases]))
    c1 = cases[0] if cases else {}
    check("deck: numbered case title from the case + classification lines",
          c1.get("title") == "Case 2: Positive - Non Spanning Line Event",
          c1.get("title", ""))
    check("deck: caseNo is the plan's own number", c1.get("caseNo") == "2",
          c1.get("caseNo", ""))
    check("deck: slide provenance", c1.get("slideNo") == 4, str(c1.get("slideNo")))
    check("deck: classification Positive", c1.get("classification") == "Positive")
    check("deck: scenario from the H3", c1.get("scenario") == "Loop",
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
          c1.get("anchor") == "case-2-positive---non-spanning-line-event",
          c1.get("anchor", ""))
    c2 = cases[1] if len(cases) > 1 else {}
    check("deck: rule-b classification-only heading is a case",
          c2.get("title") == "Negative - Line Network", c2.get("title", ""))
    check("deck: rule-b classification", c2.get("classification") == "Negative")
    check("deck: rule-b has no case number", c2.get("caseNo") == "")
    check("deck: rule-b scenario", c2.get("scenario") == "Normal Route",
          c2.get("scenario", ""))
    check("deck: ordinals are 1-based document order",
          [c["ordinal"] for c in cases] == [1, 2])
    body = r["deckBody"]
    check("deck: checklist slide stayed a bare heading (not a case)",
          "## Slide 6" in body, body)
    check("deck: divider section rendered but not a case",
          "test cases <!-- slide 7 -->" in body, body)

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
    check("mixed: larger set wins (deck)", r["mixed"]["shape"] == "deck"
          and r["mixed"]["count"] == 2, json.dumps(r["mixed"]))
    check("mixed: flagged for the run summary", r["mixed"]["mixed"] is True)
    check("deck fixture alone is not mixed", deck["mixed"] is False)

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
          c1.get("shape") == "deck" and c1.get("figureCount") == 2
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
    check("rendered figure resolves onto the media folder URL; the "
          "collapsed [figure:] label mints no link",
          c1.get("figureLinks") == [f"{MB}/doc12_slide4_fig1.svg"],
          json.dumps(c1.get("figureLinks")))
    check("figure-less case has no links",
          cases[1].get("figureLinks") == [], json.dumps(cases[1].get("figureLinks")))
    check("no mediaUrlBase keeps the raw sidecar-relative target",
          r["rawFig"] == ["../media/doc12_slide4_fig1.svg"], json.dumps(r["rawFig"]))
    check("row shaping joins FigureLinks newline-separated",
          r["fresh"][0].get("FigureLinks") == f"{MB}/doc12_slide4_fig1.svg",
          json.dumps(r["fresh"][0].get("FigureLinks")))
    check("keywords order rarest-first (ascending df, then name)",
          r["dfOrder"] == ["self intersection", "split measure", "route"],
          json.dumps(r["dfOrder"]))

    row0 = r["fresh"][0]
    check("row shaping carries the v1.1 columns",
          row0.get("Shape") == "deck" and row0.get("TableCount") == 1
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
