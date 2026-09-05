#!/usr/bin/env python3
"""Gate for the figure parser + naming rule (local/lib/figureindex.mjs,
local/Figure_Index_Plan.md).

  1. naming legs (prettifyMedia): fig-NN-slide-KK-<slug>.<ext> from the
     extracted text alone — ordinal in document order, slide of first
     appearance, slide-title slug capped at a word boundary, jpeg -> jpg,
     a file linked from two slides keeps ONE name, alt texts become
     "Figure N — <title>", a slide's links go one per line, docx headings
     name figures without a slide token, text without links is untouched,
     deterministic on a second pass
  2. index legs (extractFigures) — against a body the case grammar
     ITSELF rendered (the Case_Index_Plan D1 coupling, at module level):
     image rows with section/anchor/slide/case attribution, diagram rows
     from collapsed [figure: ...] lines, generated alts never become
     captions, context is the section's prose, fenced code never mints a
     figure, legacy flat media paths resolve, mediaUrlBase resolution,
     sizeOf plumbing, vocabulary tags
  3. header sizing (imageSize): PNG, GIF, BMP, baseline JPEG, garbage
  4. row shaping (toFigureRowFields) + the replace-set planner keyed on
     FigureKey: unchanged -> zero ops, field change -> update, SweptOn
     alone -> no op, stale -> delete, hyperlink compared by Url

Pure stdlib + Node 22+, CI-friendly (harness.yml fixture-free job).
Usage: python3 check_figureindex.py
"""
import base64
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


PH = "../media/__MEDIA__/"

# a deck as ZipTextExtract emits it: two pictures on one line of the
# title slide, a collapsed diagram label, the same picture re-used on a
# case slide plus a new one, a long title, an untitled slide, notes
RAW_DECK = f"""## Slide 1 — Overview
Intro text about Merge Events.
![image1.png]({PH}image1.png) ![image2.jpeg]({PH}image2.jpeg)
[figure: 10–22 · R1 · E1 · Output]

## Slide 2 — Positive - Non spanning line event with a title long enough to be cut
Positive - Non spanning line event
2. Loop – Split measure : 20
![image1.png]({PH}image1.png)
![image3.PNG]({PH}image3.PNG)
### Notes
Speaker notes.

## Slide 3
Negative - Line network
4. Normal route – Split measure : 16
![image4.gif]({PH}image4.gif)
```arcade
var s = "![sneaky.png](../media/__MEDIA__/sneaky.png)";
```
"""

# a docx body: headings name the figures, no slide token
RAW_DOCX = f"""# Design Spike

## Background

Words.
![image1.png]({PH}image1.png)

### Detail: the widget's panel

![image2.png]({PH}image2.png)
"""

PLAIN = "## Slide 1\nNo pictures here.\n"

# a legacy sidecar body (pre-1b flat media, collapsed label, alt = file)
LEGACY = """## Slide 4 — Old deck <!-- slide 4 -->
![doc12_image1.png](../media/doc12_image1.png)
[figure: A · B]
"""

PNG_1x1 = ("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/"
           "q842iQAAAABJRU5ErkJggg==")
GIF_3x2 = base64.b64encode(b"GIF89a" + (3).to_bytes(2, "little") + (2).to_bytes(2, "little") + b"\x00" * 10).decode()
BMP_5x7 = base64.b64encode(b"BM" + b"\x00" * 16 + (5).to_bytes(4, "little") + (7).to_bytes(4, "little") + b"\x00" * 10).decode()
# a minimal baseline JPEG header: SOI, APP0 (len 16), SOF0 (len 17) 9x11
JPG_9x11 = base64.b64encode(
    b"\xff\xd8" + b"\xff\xe0" + (16).to_bytes(2, "big") + b"JFIF\x00" + b"\x00" * 9 +
    b"\xff\xc0" + (17).to_bytes(2, "big") + b"\x08" + (11).to_bytes(2, "big") + (9).to_bytes(2, "big") + b"\x03" + b"\x00" * 9
).decode()

NODE_SCRIPT = """
import { tidyBody } from "file://%(lib)s/presentation.mjs";
import { renderTestPlanBody } from "file://%(lib)s/casegrammar.mjs";
import { relinkMedia } from "file://%(lib)s/slug.mjs";
import { prepareVocab } from "file://%(lib)s/caseindex.mjs";
import { prettifyMedia, extractFigures, toFigureRowFields, diffFigureRows,
  imageSize, figureName, isPrettyName, formatOf } from "file://%(lib)s/figureindex.mjs";
import fs from "node:fs";

const fx = JSON.parse(fs.readFileSync(process.env.FIGUREINDEX_FIXTURE, "utf8"));
const MB = "https://mock.example/sites/l/LRS Doc Index/media";
const pDeck = prettifyMedia(fx.rawDeck);
const pAgain = prettifyMedia(pDeck.text);
const pDocx = prettifyMedia(fx.rawDocx);
const pPlain = prettifyMedia(fx.plain);
// the sidecar body the sweep would write: relinked + rendered through
// the case grammar (the D1 coupling)
const rendered = renderTestPlanBody(tidyBody(relinkMedia(pDeck.text, "123-alpha")));
const body = rendered.body;
const sizes = {};
const seen = [];
const vocab = prepareVocab([
  { title: "merge events", kind: "tool", canonical: "merge events", df: 3 },
  { title: "split measure", kind: "topic", canonical: "split measure", df: 12 },
]);
const idx = extractFigures(body, { mediaUrlBase: MB, docTitle: "Alpha", vocab,
  sizeOf: (rel) => { seen.push(rel); return rel.endsWith(".png") ? { width: 640, height: 480, bytes: 1234 } : null; } });
const legacy = extractFigures(fx.legacy, { mediaUrlBase: MB });
const noBase = extractFigures(fx.legacy, {});
const capped = extractFigures(body, { contextCap: 12 });

const now = "2026-09-05T00:00:00Z";
const fresh = idx.figures.map((f) => toFigureRowFields(12, f, now));
const asRows = (fields, fromId) => fields.map((f, k) => ({ id: String(fromId + k), fields: { ...f } }));
const same = diffFigureRows(asRows(fresh, 101), fresh);
const changedRows = asRows(fresh, 101);
changedRows[0].fields.Section = "Different";
const changed = diffFigureRows(changedRows, fresh);
const sweptRows = asRows(fresh, 101);
sweptRows[1].fields.SweptOn = "2020-01-01T00:00:00Z";
const sweptOnly = diffFigureRows(sweptRows, fresh);
const stale = diffFigureRows(asRows(fresh, 101).concat([{ id: "999", fields: { FigureKey: "12|9" } }]), fresh);
const hlRows = asRows(fresh, 201);
hlRows[0].fields.ImageLink = { Url: fresh[0].ImageLink.Url, Description: "other" };
const hlSame = diffFigureRows(hlRows, fresh);
const hlDiffRows = asRows(fresh, 201);
hlDiffRows[0].fields.ImageLink = { Url: "https://elsewhere/x.png", Description: "x" };
const hlDiff = diffFigureRows(hlDiffRows, fresh);
const b64 = (s) => Buffer.from(s, "base64");

process.stdout.write(JSON.stringify({
  pDeck, pAgainText: pAgain.text, pAgainRenames: pAgain.renames, pDocx, pPlain,
  body, renderedShape: rendered.shape,
  figures: idx.figures, sizesSeen: seen,
  legacy: legacy.figures, noBase: noBase.figures, cappedCtx: capped.figures.map((f) => f.context),
  fresh, same, changed, sweptOnly, stale, hlSame, hlDiff,
  names: {
    plain: figureName({ ordinal: 3, slideNo: 12, title: "Coordinate Configuration Tests", source: "image9.JPEG" }),
    noSlide: figureName({ ordinal: 1, slideNo: null, title: "", source: "a.png" }),
    tiff: figureName({ ordinal: 1, slideNo: 1, title: "x", source: "scan.tiff" }),
    long: figureName({ ordinal: 1, slideNo: 1, title: "positive non spanning line event with a title long enough to be cut", source: "a.png" }),
  },
  pretty: [isPrettyName("fig-01-slide-02-loop.png"), isPrettyName("fig-01.png"), isPrettyName("image1.png")],
  formats: [formatOf("a.JPEG"), formatOf("b.svg"), formatOf("c.tiff"), formatOf("noext")],
  sizes: {
    png: imageSize(b64(fx.png)), gif: imageSize(b64(fx.gif)), bmp: imageSize(b64(fx.bmp)),
    jpg: imageSize(b64(fx.jpg)), junk: imageSize(Buffer.from("not an image at all, really")),
    empty: imageSize(Buffer.alloc(0)),
  },
}));
"""


def main():
    tmp = os.path.join(HERE, "_figureindex_fixture.json")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump({"rawDeck": RAW_DECK, "rawDocx": RAW_DOCX, "plain": PLAIN, "legacy": LEGACY,
                   "png": PNG_1x1, "gif": GIF_3x2, "bmp": BMP_5x7, "jpg": JPG_9x11}, f)
    try:
        proc = subprocess.run(
            ["node", "--input-type=module", "-e", NODE_SCRIPT % {"lib": LIB}],
            capture_output=True, text=True, timeout=120,
            env={**os.environ, "FIGUREINDEX_FIXTURE": tmp})
        if proc.returncode != 0:
            print(proc.stdout)
            print(proc.stderr)
            print("FAILED: node run errored")
            sys.exit(1)
        r = json.loads(proc.stdout)
    finally:
        os.unlink(tmp)

    print("-- naming (prettifyMedia) --")
    p = r["pDeck"]
    renames = {x["from"]: x["to"] for x in p["renames"]}
    check("distinct source files each get one standardized name, in document order",
          [x["from"] for x in p["renames"]] == ["image1.png", "image2.jpeg", "image3.PNG", "image4.gif"],
          json.dumps(p["renames"]))
    check("name = fig-NN-slide-KK-<slug>.<ext>, jpeg normalized to jpg",
          renames.get("image1.png") == "fig-01-slide-01-overview.png"
          and renames.get("image2.jpeg") == "fig-02-slide-01-overview.jpg", json.dumps(renames))
    check("slug capped at a word boundary, never ending on a stopword; extension case folded",
          renames.get("image3.PNG") == "fig-03-slide-02-positive-non-spanning-line-event.png",
          renames.get("image3.PNG", ""))
    check("an untitled slide names by ordinal + slide only",
          renames.get("image4.gif") == "fig-04-slide-03.gif", renames.get("image4.gif", ""))
    check("a picture linked from two slides keeps its first name (one figure)",
          p["text"].count(f"({PH}fig-01-slide-01-overview.png)") == 2
          and "image1.png" not in p["text"], p["text"])
    check("a slide's links go one per line with Figure alts",
          f"![Figure 1 — Overview]({PH}fig-01-slide-01-overview.png)\n"
          f"![Figure 2 — Overview]({PH}fig-02-slide-01-overview.jpg)\n" in p["text"], p["text"])
    check("prose around the links is kept; the diagram label line is untouched",
          "Intro text about Merge Events." in p["text"] and "[figure: 10–22 · R1 · E1 · Output]" in p["text"],
          p["text"])
    check("fenced code is not a link source (no phantom figure)",
          "sneaky" not in json.dumps(p["renames"]) and "sneaky.png" in p["text"], p["text"])
    check("figures carry ordinal / slide / title",
          p["figures"][2]["slideNo"] == 2 and p["figures"][2]["ordinal"] == 3
          and p["figures"][2]["title"].startswith("Positive - Non spanning"), json.dumps(p["figures"]))
    check("second pass is a fixed point (no placeholder links left, text unchanged)",
          r["pAgainText"] == p["text"] and r["pAgainRenames"] == [], r["pAgainText"][:200])
    d = r["pDocx"]
    check("docx: the nearest heading names the figure, no slide token",
          [x["to"] for x in d["renames"]] == ["fig-01-background.png", "fig-02-detail-the-widgets-panel.png"],
          json.dumps(d["renames"]))
    check("text without placeholder links comes back unchanged",
          r["pPlain"]["text"] == PLAIN and r["pPlain"]["renames"] == [], r["pPlain"]["text"])
    n = r["names"]
    check("figureName: title slug, jpeg->jpg, two-digit padding",
          n["plain"] == "fig-03-slide-12-coordinate-configuration-tests.jpg", n["plain"])
    check("figureName: no slide, no title", n["noSlide"] == "fig-01.png", n["noSlide"])
    check("figureName: unknown extension kept lower-cased", n["tiff"] == "fig-01-slide-01-x.tiff", n["tiff"])
    check("figureName: long slug cut at a word boundary under the cap, trailing stopword dropped",
          n["long"] == "fig-01-slide-01-positive-non-spanning-line-event.png", n["long"])
    check("isPrettyName recognizes the rule", r["pretty"] == [True, True, False], json.dumps(r["pretty"]))
    check("formatOf normalizes", r["formats"] == ["jpg", "svg", "other", "other"], json.dumps(r["formats"]))

    print("-- index (extractFigures, on the case grammar's own body) --")
    check("body rendered through the testplan/v1 grammar", r["renderedShape"] == "S1", r["renderedShape"])
    figs = r["figures"]
    kinds = [(f["ordinal"], f["kind"], f["fileName"]) for f in figs]
    check("five figures: four images + one diagram, in document order, one per distinct file",
          kinds == [(1, "image", "fig-01-slide-01-overview.png"), (2, "image", "fig-02-slide-01-overview.jpg"),
                    (3, "diagram", ""), (4, "image", "fig-03-slide-02-positive-non-spanning-line-event.png"),
                    (5, "image", "fig-04-slide-03.gif")], json.dumps(kinds))
    f1 = figs[0]
    check("image row: section, anchor, slide, format, url resolved onto the media folder",
          f1["section"] == "Slide 1 — Overview" and f1["anchor"] == "slide-1--overview" and f1["slideNo"] == 1
          and f1["format"] == "png" and f1["filePath"] == "123-alpha/fig-01-slide-01-overview.png"
          and f1["url"] == "https://mock.example/sites/l/LRS Doc Index/media/123-alpha/fig-01-slide-01-overview.png",
          json.dumps(f1))
    check("image row: generated alt is not a caption; title names the section without the Slide prefix",
          f1["alt"] == "" and f1["caption"] == "" and f1["title"] == "Figure 1 — Overview", json.dumps(f1))
    check("context is the section's prose (tables/links/labels stripped)",
          f1["context"] == "Intro text about Merge Events." and "![" not in f1["context"], f1["context"])
    check("diagram row: caption from the collapsed label, no file, no url, format none",
          figs[2]["caption"] == "10–22 · R1 · E1 · Output" and figs[2]["url"] == "" and figs[2]["format"] == "none"
          and figs[2]["title"] == "Figure 3 — 10–22 · R1 · E1 · Output", json.dumps(figs[2]))
    f4 = figs[3]
    check("a figure inside a case section carries the TC id + the case's anchor + slide from the src comment",
          f4["caseNo"] == "TC-P01" and f4["anchor"].startswith("tc-p01") and f4["slideNo"] == 2
          and f4["section"].startswith("TC-P01 — "), json.dumps(f4))
    check("the re-used picture is one figure (its second link mints nothing)",
          len([f for f in figs if f["fileName"] == "fig-01-slide-01-overview.png"]) == 1, json.dumps(kinds))
    f5 = figs[4]
    check("negative-lane figure attributed to TC-N01",
          f5["caseNo"] == "TC-N01" and f5["format"] == "gif", json.dumps(f5))
    check("fenced code never mints a figure", "sneaky" not in json.dumps(figs), json.dumps(figs)[:300])
    check("sizeOf is asked per image file path and its answer lands on the row",
          sorted(r["sizesSeen"]) == sorted([f["filePath"] for f in figs if f["kind"] == "image"])
          and f1["width"] == 640 and f1["height"] == 480 and f1["bytes"] == 1234
          and f5["width"] is None and f5["bytes"] is None, json.dumps(r["sizesSeen"]))
    check("vocabulary tags from title + section + context (tool -> tools, topic -> keywords)",
          f1["tools"] == ["merge events"] and f4["keywords"] == ["split measure"], json.dumps([f1["tools"], f4["keywords"]]))
    lg = r["legacy"]
    check("legacy flat media path resolves below media/ and the file-name alt is no caption",
          lg[0]["filePath"] == "doc12_image1.png" and lg[0]["alt"] == ""
          and lg[0]["url"].endswith("/media/doc12_image1.png") and lg[0]["slideNo"] == 4, json.dumps(lg))
    check("legacy diagram label indexed", lg[1]["kind"] == "diagram" and lg[1]["caption"] == "A · B", json.dumps(lg))
    check("without mediaUrlBase the raw target stands", r["noBase"][0]["url"] == "doc12_image1.png", json.dumps(r["noBase"]))
    check("contextCap honored", all(len(c) <= 12 for c in r["cappedCtx"]), json.dumps(r["cappedCtx"]))

    print("-- sizing (imageSize) --")
    sz = r["sizes"]
    check("PNG from IHDR", sz["png"] == {"width": 1, "height": 1}, json.dumps(sz["png"]))
    check("GIF from the logical screen", sz["gif"] == {"width": 3, "height": 2}, json.dumps(sz["gif"]))
    check("BMP from the info header", sz["bmp"] == {"width": 5, "height": 7}, json.dumps(sz["bmp"]))
    check("baseline JPEG from SOF0", sz["jpg"] == {"width": 9, "height": 11}, json.dumps(sz["jpg"]))
    check("junk and empty buffers size to nothing", sz["junk"] is None and sz["empty"] is None, json.dumps(sz))

    print("-- rows + replace-set (FigureKey) --")
    fr = r["fresh"][0]
    check("row fields match SPList_Figures.csv",
          fr["FigureKey"] == "12|1" and fr["DocumentLookupId"] == 12 and fr["FigureNo"] == 1
          and fr["Kind"] == "image" and fr["FileName"] == "fig-01-slide-01-overview.png" and fr["Format"] == "png"
          and fr["SlideNo"] == 1 and fr["Section"] == "Slide 1 — Overview" and fr["CaseNo"] == ""
          and fr["Anchor"] == "slide-1--overview" and fr["Caption"] == "" and fr["Width"] == 640
          and fr["Tools"] == "merge events" and fr["ImageUrl"].endswith("fig-01-slide-01-overview.png")
          and fr["ImageLink"] == {"Url": fr["ImageUrl"], "Description": "fig-01-slide-01-overview.png"}
          and fr["SweptOn"] == "2026-09-05T00:00:00Z", json.dumps(fr))
    dr = r["fresh"][2]
    check("diagram row: hyperlink cleared, no size, caption carried",
          dr["ImageLink"] == "" and dr["ImageUrl"] == "" and dr["Width"] is None
          and dr["Caption"] == "10–22 · R1 · E1 · Output" and dr["FileName"] == "", json.dumps(dr))
    z = lambda pl: (len(pl["create"]), len(pl["update"]), len(pl["delete"]))
    check("unchanged document -> zero ops", z(r["same"]) == (0, 0, 0), json.dumps(r["same"]))
    check("a field change -> one update by row id",
          z(r["changed"]) == (0, 1, 0) and r["changed"]["update"][0]["id"] == "101", json.dumps(r["changed"]))
    check("SweptOn alone never dirties", z(r["sweptOnly"]) == (0, 0, 0), json.dumps(r["sweptOnly"]))
    check("stale row -> delete", z(r["stale"]) == (0, 0, 1) and r["stale"]["delete"] == ["999"], json.dumps(r["stale"]))
    check("hyperlink compared by Url (description drift never churns)",
          z(r["hlSame"]) == (0, 0, 0) and z(r["hlDiff"]) == (0, 1, 0), json.dumps([r["hlSame"], r["hlDiff"]]))

    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FAILED: " + "; ".join(FAIL))
        sys.exit(1)
    print("PASSED")


if __name__ == "__main__":
    main()
