#!/usr/bin/env python3
"""check_vocabulary.py — the official-vocabulary data path (lib/vocabulary.mjs,
doc_vocab.mjs): the docfx page parsers on synthetic pages shaped like the
Esri help (a toolbox overview with a tool table and a toolset table, a
toolset overview, an essential-vocabulary page), the --from-dir run that
writes the JSON, the hand-kept widgets carried over, and normalizeTools:
official casing restored, variants folded, unknown names reported.
Pure stdlib + Node 22+, no network.
"""
import json
import os
import subprocess
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(REPO, "pipeline", "doc_vocab.mjs")
LIB = os.path.join(REPO, "pipeline", "lib", "vocabulary.mjs")
BASE = "https://doc.example/en/arcgis-pro/latest/tool-reference/location-referencing/"
VBASE = "https://doc.example/en/arcgis-pro/latest/help/production/roads-highways/"

PASSED = 0
FAILED = []


def check(name, cond, detail=""):
    global PASSED
    if cond:
        PASSED += 1
        print(f"  ok   {name}")
    else:
        FAILED.append(name)
        print(f"  FAIL {name}  <- {str(detail)[:600]}")


def page(title, body):
    return (f"<!DOCTYPE html><html><head><title>{title} | X</title></head><body><header>chrome</header>"
            f"<main><article id=\"main\"><h1 id=\"x\">{title}</h1>{body}</article></main></body></html>")


TOOLBOX = page("An overview of the Location Referencing toolbox",
    "<table><tr><th><p>Tool</p></th><th><p>Description</p></th></tr>"
    "<tr><td><p><a href=\"append-routes.html\"><strong>Append Routes</strong></a></p></td>"
    "<td><p>Appends routes &amp; more into an LRS Network.</p></td></tr>"
    "<tr><td><p><a href=\"update-measures-from-lrs.html\"><strong>Update Measures From LRS</strong></a></p></td>"
    "<td><p>Populates <code>DerivedRouteID</code> fields.</p></td></tr>"
    "<caption><p>Tools in the toolbox</p></caption></table>"
    "<table><tr><th><p>Toolset</p></th><th><p>Description</p></th></tr>"
    "<tr><td><p><a href=\"an-overview-of-the-configuration-toolset.html\">Configuration</a></p></td>"
    "<td><p>Tools for creating an LRS.</p></td></tr></table>"
    "<h2 id=\"related-topics\">Related topics</h2><ul><li><p><a href=\"history.html\">History</a></p></li></ul>")
TOOLSET = page("An overview of the Configuration toolset",
    "<table><tr><th><p>Tool</p></th><th><p>Description</p></th></tr>"
    "<tr><td><p><a href=\"create-lrs.html\"><strong>Create LRS</strong></a></p></td><td><p>Creates an LRS.</p></td></tr>"
    "<tr><td><p><a href=\"append-routes.html\"><strong>Append Routes</strong></a></p></td><td><p>dup</p></td></tr></table>")
VOCAB = page("Essential Roads and Highways vocabulary",
    "<p><img src=\"k.svg\" alt=\"\"> Available with Location Referencing license.</p>"
    "<h2 id=\"B6F\">Calibration point</h2><p>A point feature that defines the measure for a location.</p>"
    "<h2 id=\"827\">Event</h2><p>Data located by route and measure.</p><p>An example is a crash.</p>"
    "<h2 id=\"849\">Event behavior</h2><p>How events respond.</p><ul><li><p>Stay Put</p></li></ul>")


def main():
    tmp = tempfile.mkdtemp(prefix="vocab-gate-")
    pages = os.path.join(tmp, "pages")
    os.makedirs(pages)
    for name, html in [("an-overview-of-the-location-referencing-toolbox.html", TOOLBOX),
                       ("an-overview-of-the-configuration-toolset.html", TOOLSET),
                       ("essential-roads-and-highways-vocabulary.html", VOCAB)]:
        with open(os.path.join(pages, name), "w", encoding="utf-8") as f:
            f.write(html)
    out = os.path.join(tmp, "lrs_vocabulary.json")
    # a previous file with a hand-kept widget: it must survive the rewrite
    with open(out, "w") as f:
        json.dump({"widgets": [{"name": "Straight Line Diagram", "url": VBASE + "sld.html"}]}, f)
    print("== doc_vocab --from-dir")
    r = subprocess.run(["node", "--experimental-strip-types", SCRIPT, "--from-dir", pages, "--out", out,
                        "--toolbox", BASE + "an-overview-of-the-location-referencing-toolbox.html",
                        "--vocab", VBASE + "essential-roads-and-highways-vocabulary.html",
                        "--vocab", VBASE + "essential-missing-vocabulary.html"],
                       capture_output=True, text=True, cwd=REPO)
    check("run exit 0", r.returncode == 0, r.stderr[-600:])
    check("stdout line reports the counts", "tools=3 terms=3 widgets=1" in r.stdout, r.stdout)
    check("a page missing from the directory is named with the curl to save it",
          "essential-missing-vocabulary.html" in r.stderr and "curl.exe" in r.stderr, r.stderr[-400:])
    d = json.load(open(out, encoding="utf-8"))
    tools = {t["name"]: t for t in d["tools"]}
    check("the toolbox page's tools, then the toolset's, deduplicated and sorted",
          [t["name"] for t in d["tools"]] == ["Append Routes", "Create LRS", "Update Measures From LRS"], d["tools"])
    check("tool url resolved against the page, description as text, entities decoded, toolset named",
          tools["Append Routes"]["url"] == BASE + "append-routes.html"
          and tools["Append Routes"]["description"] == "Appends routes & more into an LRS Network."
          and tools["Update Measures From LRS"]["description"] == "Populates DerivedRouteID fields."
          and tools["Create LRS"]["toolset"] == "Configuration" and tools["Append Routes"]["toolset"] == "",
          json.dumps(d["tools"])[:500])
    terms = {t["term"]: t for t in d["terms"]}
    check("vocabulary terms with the first paragraph as definition and the anchor in the url",
          sorted(terms) == ["Calibration point", "Event", "Event behavior"]
          and terms["Event"]["definition"] == "Data located by route and measure."
          and terms["Calibration point"]["url"] == VBASE + "essential-roads-and-highways-vocabulary.html#B6F"
          and "Related topics" not in terms, json.dumps(d["terms"])[:500])
    check("the hand-kept widgets are carried over; sources and generated recorded",
          d["widgets"] == [{"name": "Straight Line Diagram", "url": VBASE + "sld.html"}]
          and len(d["sources"]) == 3 and d["generated"], json.dumps(d)[:300])
    r2 = subprocess.run(["node", "--experimental-strip-types", SCRIPT, "--from-dir", pages, "--out", out, "--dry-run",
                         "--toolbox", BASE + "nope.html", "--vocab", VBASE + "nope.html"],
                        capture_output=True, text=True, cwd=REPO)
    check("dry run writes nothing", r2.returncode == 0 and "nothing written" in r2.stdout, r2.stdout)
    r3 = subprocess.run(["node", "--experimental-strip-types", SCRIPT, "--from-dir", pages, "--out", out,
                         "--toolbox", BASE + "nope.html", "--vocab", VBASE + "nope.html"],
                        capture_output=True, text=True, cwd=REPO)
    check("a run that parsed nothing refuses to overwrite the file",
          r3.returncode != 0 and "not overwriting" in r3.stderr and json.load(open(out))["tools"], r3.stderr[-300:])

    print("== loadVocabulary + normalizeTools")
    js = f"""
import {{ loadVocabulary, normalizeTools }} from {json.dumps(LIB)};
const v = loadVocabulary({json.dumps(out)});
const r = normalizeTools(["append route", "the Update Measures from LRS tool", "Append Routes", "Merge Centerlines",
  "straight line diagram", "update-measures-from-lrs", ""], v);
console.log(JSON.stringify({{ known: v.knownTools, terms: [...v.termSet], r }}));
console.log(JSON.stringify(normalizeTools(["Whatever Tool"], loadVocabulary("/no/such/file.json"))));
"""
    r4 = subprocess.run(["node", "--experimental-strip-types", "--input-type=module", "-e", js],
                        capture_output=True, text=True, cwd=REPO)
    check("node run exit 0", r4.returncode == 0, r4.stderr[-400:])
    lines = r4.stdout.strip().splitlines()
    got = json.loads(lines[0]) if lines else {}
    check("knownTools block: tools then widgets, one per line; termSet lowercase",
          got.get("known") == "Append Routes\nCreate LRS\nUpdate Measures From LRS\nStraight Line Diagram"
          and got.get("terms") == ["calibration point", "event", "event behavior"], got)
    check("normalizeTools: casing restored, 'the … tool' and plural folded, duplicates collapsed, unknown reported",
          got.get("r", {}).get("tools") == ["Append Routes", "Update Measures From LRS", "Merge Centerlines", "Straight Line Diagram"]
          and got.get("r", {}).get("unknown") == ["Merge Centerlines"], got.get("r"))
    check("an empty vocabulary passes names through and reports none unknown",
          json.loads(lines[1]) == {"tools": ["Whatever Tool"], "unknown": []} if len(lines) > 1 else False, lines[1:])

    print(f"\n{PASSED} passed, {len(FAILED)} failed")
    if FAILED:
        print("FAILED: " + ", ".join(FAILED))
        print("RESULT: FAIL")
        sys.exit(1)
    print("RESULT: PASS")


if __name__ == "__main__":
    main()
