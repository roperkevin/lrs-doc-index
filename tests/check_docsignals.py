#!/usr/bin/env python3
"""check_docsignals.py — the deterministic evidence beside the classifier
(pipeline/lib/docsignals.mjs, sweep v1.66) and the rules that reconcile
the model's reply with it:

  1. folderKind: the library folder's kind by segment (case, spacing and
     depth insensitive), the config map replacing the default, folderOf
  2. detectSurfaces: scored evidence per surface — REST from operation
     names and paths, Experience Builder from the widgets a document
     names, Pro from GP tools + geoprocessing, the file-name cues; a
     document that only says "widget" once is not ABOUT Experience
     Builder (below STRONG)
  3. signalsBlock: the prompt's Signals input — folder rule, products,
     named tools, the surface evidence — "(none)" when nothing is known
  4. reconcile: the folder kind wins (or only over Other with the option
     off); the model's surface stays primary and strong signals are
     appended; Other + strong signal = the signal; tools = model then the
     text's; products = regex ∪ model, canonical names, fixed order; the
     notes count every change
Pure stdlib + Node 22+.
"""
import json
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(REPO, "pipeline", "lib", "docsignals.mjs")
VOCAB = os.path.join(REPO, "pipeline", "lib", "vocabulary.mjs")
DATA = os.path.join(REPO, "pipeline", "data", "lrs_vocabulary.json")

PASSED = 0
FAILED = []


def check(name, cond, detail=""):
    global PASSED
    if cond:
        PASSED += 1
        print(f"  ok   {name}")
    else:
        FAILED.append(name)
        print(f"  FAIL {name}  <- {str(detail)[:700]}")


def run(js):
    r = subprocess.run(["node", "--input-type=module", "-e",
                        f"import * as D from {json.dumps(LIB)}; import {{ loadVocabulary, toolsNamedIn }} from {json.dumps(VOCAB)};\n"
                        f"const vocab = loadVocabulary({json.dumps(DATA)});\n" + js],
                       capture_output=True, text=True, cwd=REPO)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-1500:])
    return json.loads(r.stdout.strip().splitlines()[-1])


def main():
    print("== folderKind")
    g = run("""console.log(JSON.stringify([
      D.folderKind("General/Doc Reviews/2026"), D.folderKind("General/doc_review"), D.folderKind("Documentation reviews"),
      D.folderKind("General/Test Plans"), D.folderKind(""),
      D.folderKind("General/Doc Reviews/Test Plans", {"Doc Reviews": "Doc Review", "Test Plans": "Test Plan"}),
      D.folderKind("Doc Reviews", {"Doc Reviews": "Nope"}),
      D.folderOf("General/Doc Reviews/x.docx"), D.folderOf("x.docx"), D.folderOf("General\\\\Sub\\\\y.pptx")]))""")
    check("the Doc Reviews folder in any spelling, at any depth, maps to Doc Review; other folders map to nothing",
          g[:5] == ["Doc Review", "Doc Review", "Doc Review", "", ""], g)
    check("the deepest mapped segment wins; a config kind off the list is ignored; folderOf drops the file",
          g[5:] == ["Test Plan", "", "General/Doc Reviews", "", "General/Sub"], g)

    print("== detectSurfaces")
    g = run("""
      const t1 = "POST https://host/server/rest/services/RH/LRServer/networks/1/applyEdits with f=json. The response JSON carries the edited routes.";
      const t2 = "The Straight Line Diagram widget and the LRS Identify widget in Experience Builder show the route.";
      const t3 = "Run the Generate Routes geoprocessing tool in ArcGIS Pro 3.8 from the Location Referencing tab.";
      const t4 = "A widget was mentioned once.";
      const t5 = "Portal for ArcGIS federation with the hosting server; publish the feature service to ArcGIS Server.";
      const out = [t1, t2, t3, t4, t5].map((t, i) =>
        D.detectSurfaces(t, i === 2 ? "Pro_Generate_Routes.pptx" : "x.docx", vocab, toolsNamedIn(t, vocab)).map((s) => [s.surface, s.score]));
      out.push(D.detectSurfaces("nothing here", "ExB_Search_by_Route.pptx", vocab, []).map((s) => [s.surface, s.score, s.evidence]));
      console.log(JSON.stringify(out));""")
    rest, exb, pro, weak, ent, named = g
    check("REST: an operation name, the LRServer path, f=json and the response JSON make REST the strong surface",
          rest and rest[0][0] == "REST" and rest[0][1] >= 4, g)
    check("Experience Builder: two named widgets plus the product name",
          exb and exb[0][0] == "Experience Builder" and exb[0][1] >= 4, g)
    check("Pro: a GP tool, geoprocessing, ArcGIS Pro, the tab and the file name",
          pro and pro[0][0] == "Pro" and pro[0][1] >= 4, g)
    check("one 'widget' is evidence but not a strong surface",
          weak == [["Experience Builder", 2]], g)
    check("Enterprise and Server both score; Enterprise leads on the portal text",
          ent and ent[0][0] == "Enterprise" and any(s == "Server" for s, _ in ent), g)
    check("a file name cue is a strong signal on its own, with its evidence named",
          named == [["Experience Builder", 3, ["file name says ExB"]]], g)

    print("== signalsBlock")
    g = run("""console.log(JSON.stringify([
      D.signalsBlock({}),
      D.signalsBlock({ folder: "General/Doc Reviews", folderKind: "Doc Review", products: ["Roads & Highways"],
        namedTools: ["Append Routes", "SLD"], surfaces: [{surface: "REST", score: 5, evidence: ["applyEdits", "f=json"]}, {surface: "Pro", score: 1, evidence: ["ribbon"]}] })]))""")
    check("(none) when nothing is known", g[0] == "(none)", g)
    check("the block: the folder rule, products, named tools, the surfaces at PRESENT or better (a score-1 cue is left out)",
          g[1] == ("Library folder \"General/Doc Reviews\" is the team's Doc Review folder — documents there are Doc Reviews unless the content is unmistakably another kind.\n"
                   "Products named in the text: Roads & Highways\n"
                   "Known tools named in the text: Append Routes; SLD\n"
                   "Surface evidence in the text (strongest first): REST (applyEdits, f=json)"), g[1])

    print("== reconcile")
    g = run("""
      const sig = { folderKind: "Doc Review", products: ["Roads & Highways"], namedTools: ["Append Routes", "applyEdits"],
        surfaces: [{surface: "REST", score: 5, evidence: []}, {surface: "Pro", score: 2, evidence: []}] };
      const ai = { docKind: "Other", surface: "Other", surfaces: [], tools: [], products: ["ADM"] };
      const ai2 = { docKind: "Test Plan", surface: "Pro", surfaces: ["Pro", "Experience Builder", "Bogus"], tools: ["Append Routes", "Merge Events"], products: ["Pipeline Referencing", "Roads and Highways"] };
      console.log(JSON.stringify([
        D.reconcile(ai, sig),
        D.reconcile(ai2, sig),
        D.reconcile(ai2, sig, { folderKindWins: false }),
        D.reconcile({ docKind: "Nope", surface: "ArcGIS Pro", tools: null }, {}),
        D.reconcile({ docKind: "User Story", surface: "Other" }, { folderKind: "Doc Review" }, { folderKindWins: false }),
      ]));""")
    a, b, c, d, e = g
    check("Other everywhere + a Doc Reviews folder + strong REST evidence: Doc Review / REST, the text's tools, regex ∪ model products in canonical order",
          a["docKind"] == "Doc Review" and a["surface"] == "REST" and a["surfaces"] == ["REST"]
          and a["tools"] == ["Append Routes", "applyEdits"]
          and a["products"] == ["Roads & Highways", "Address Data Management"]
          and a["notes"] == {"kindFromFolder": 1, "surfaceFromSignals": 1, "toolsFromText": 2, "productsFromModel": 1}, a)
    check("a model that answered keeps its primary surface and order, drops the bogus one, gains the strong REST as a secondary; the folder still wins the kind",
          b["docKind"] == "Doc Review" and b["surface"] == "Pro" and b["surfaces"] == ["Pro", "Experience Builder", "REST"]
          and b["tools"] == ["Append Routes", "Merge Events", "applyEdits"]
          and b["products"] == ["Roads & Highways", "Pipeline Referencing"]
          and b["notes"]["kindFromFolder"] == 1 and b["notes"]["toolsFromText"] == 1 and b["notes"]["productsFromModel"] == 1, b)
    check("folderKindWins: false keeps the model's Test Plan", c["docKind"] == "Test Plan" and c["notes"]["kindFromFolder"] == 0, c)
    check("off-list kind → Other; 'ArcGIS Pro' → Pro; a null tools list is tolerated",
          d["docKind"] == "Other" and d["surface"] == "Pro" and d["surfaces"] == ["Pro"] and d["tools"] == [] and d["products"] == [], d)
    check("with the option off, the folder replaces nothing but Other", e["docKind"] == "User Story" and e["surface"] == "Other" and e["surfaces"] == [], e)
    g = run("""console.log(JSON.stringify([D.canonicalProduct("roads & highways"), D.canonicalProduct("UN"), D.canonicalProduct("x"),
      D.canonicalSurface("experience builder"), D.canonicalSurface("ExB"), D.canonicalSurface("REST API"), D.canonicalSurface("Web")]))""")
    check("canonical names: products by key or acronym, surfaces by key or alias, unknown = ''",
          g == ["Roads & Highways", "Utility Network", "", "Experience Builder", "Experience Builder", "REST", ""], g)

    print(f"\n{PASSED} passed, {len(FAILED)} failed")
    if FAILED:
        print("FAILED: " + ", ".join(FAILED))
        sys.exit(1)
    print("RESULT: PASS")


if __name__ == "__main__":
    main()
