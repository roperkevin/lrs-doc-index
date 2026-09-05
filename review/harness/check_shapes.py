"""Assertions for ShapeExtract's drawing contract (current scripts/).

ShapeExtract v1.0 extracts a pptx slide's DRAWN shapes and their text —
faithfully, at their true positions — as one SVG per qualifying slide,
plus the glued connections as `A → B` text and every shape's text in
reading order. This suite pins that contract on a hand-written deck
(raw OOXML, no python-pptx, so it runs in the fixture-free CI job):

  1. qualification: a prose slide (placeholders + one plain text box)
     and a two-box slide yield nothing; the flow slide yields ONE
     drawing, numbered in PRESENTATION order (sldIdLst puts the
     flow part second)
  2. geometry + style: rect at its EMU position in px, dashed outline
     with its width, rounded rect rx from the adj value, ellipse,
     theme colour through lumMod/lumOff (accent1 2E75B6 → 78ADDD),
     style fillRef/lnRef/fontRef fallbacks, a 45° rotated diamond
     inside a group with a child-space transform, a freeform custGeom
     path with its outline colour, a picture placeholder that
     references the sibling media basename
  3. text: wrapped inside its shape, bold, centred, white on a dark
     fill; a label with no fill/outline renders as text only; the
     connector's own label sits on the line
  4. connectors: arrowhead markers on the glued end, the connections
     string in order, `—label→` for a labelled connector
  5. words: labels in reading order, deduped; alt text with counts
  6. bounds: viewBox cropped to the drawing plus padding; data-* attrs

Exit code: non-zero on any failed assertion.
"""
import json
import os
import subprocess
import sys
import tempfile
import zipfile

SCRIPTS = os.environ.get("HARNESS_SCRIPTS", "../../scripts")
REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OPS = os.path.join(REPO, "pad", "runner", "ops.mjs").replace(os.sep, "/")

failures = []


def check(cond, label, detail=""):
    print(("ok   " if cond else "FAIL ") + label + ("" if cond else f"  <- {detail}"))
    if not cond:
        failures.append(label)


NS = ('xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
      'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"')
IN = 914400


def sp(id_, name, x, y, w, h, prst="rect", fill=None, ln=None, text="", style=False, rot=None, adj=None, geom=None):
    fillx = ""
    if fill == "none":
        fillx = "<a:noFill/>"
    elif fill and fill.startswith("scheme:"):
        fillx = (f'<a:solidFill><a:schemeClr val="{fill[7:]}"><a:lumMod val="60000"/>'
                 f'<a:lumOff val="40000"/></a:schemeClr></a:solidFill>')
    elif fill:
        fillx = f'<a:solidFill><a:srgbClr val="{fill}"/></a:solidFill>'
    lnx = ""
    if ln == "none":
        lnx = "<a:ln><a:noFill/></a:ln>"
    elif ln:
        lnx = (f'<a:ln w="19050"><a:solidFill><a:srgbClr val="{ln}"/></a:solidFill>'
               f'<a:prstDash val="dash"/></a:ln>')
    rotx = f' rot="{rot}"' if rot is not None else ""
    adjx = f'<a:avLst><a:gd name="adj" fmla="val {adj}"/></a:avLst>' if adj is not None else "<a:avLst/>"
    geomx = geom if geom else f'<a:prstGeom prst="{prst}">{adjx}</a:prstGeom>'
    stylex = ('<p:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef>'
              '<a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef>'
              '<a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef>'
              '<a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></p:style>') if style else ""
    tx = (f'<p:txBody><a:bodyPr anchor="ctr"/><a:lstStyle/><a:p><a:pPr algn="ctr"/>'
          f'<a:r><a:rPr lang="en-US" sz="1400" b="1"/><a:t>{text}</a:t></a:r></a:p></p:txBody>') if text else ""
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="{id_}" name="{name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>'
            f'<p:spPr><a:xfrm{rotx}><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>'
            f'{geomx}{fillx}{lnx}</p:spPr>{stylex}{tx}</p:sp>')


def cxn(id_, x, y, w, h, st, end, tail=True, head=False, text=""):
    ends = ('<a:tailEnd type="triangle"/>' if tail else "") + ('<a:headEnd type="triangle"/>' if head else "")
    tx = (f'<p:txBody><a:bodyPr/><a:p><a:r><a:rPr sz="1000"/><a:t>{text}</a:t></a:r></a:p></p:txBody>') if text else ""
    return (f'<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="{id_}" name="Connector {id_}"/><p:cNvCxnSpPr>'
            f'<a:stCxn id="{st}" idx="3"/><a:endCxn id="{end}" idx="1"/></p:cNvCxnSpPr><p:nvPr/></p:nvCxnSpPr>'
            f'<p:spPr><a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>'
            f'<a:prstGeom prst="straightConnector1"><a:avLst/></a:prstGeom>'
            f'<a:ln w="12700"><a:solidFill><a:srgbClr val="C00000"/></a:solidFill>{ends}</a:ln></p:spPr>{tx}</p:cxnSp>')


def title(text):
    return ('<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title 1"/><p:cNvSpPr/><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>'
            '<p:spPr/><p:txBody><a:bodyPr/><a:p><a:r><a:t>' + text + '</a:t></a:r></a:p></p:txBody></p:sp>')


def slide(body):
    return (f'<p:sld {NS}><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
            '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
            f'{body}</p:spTree></p:cSld></p:sld>')


FREEFORM = ('<a:custGeom><a:avLst/><a:pathLst><a:path w="100" h="50"><a:moveTo><a:pt x="0" y="50"/></a:moveTo>'
            '<a:lnTo><a:pt x="50" y="0"/></a:lnTo><a:lnTo><a:pt x="100" y="50"/></a:lnTo></a:path></a:pathLst></a:custGeom>')

# the flow slide (part slide1.xml, DISPLAYED second): three glued boxes,
# a theme-filled rounded box, an ellipse, a plain label, a rotated diamond
# inside a group with a child transform, a freeform, a picture
FLOW = slide(
    title("Split workflow")
    + sp(3, "Route R1", IN, IN, int(1.5 * IN), int(0.6 * IN), fill="1F4E79", ln="000000", text="Route R1")
    + sp(4, "Split", 3 * IN, IN, int(1.2 * IN), int(0.6 * IN), prst="roundRect", fill="scheme:accent1",
         text="Split at 20", style=True, adj=20000)
    + sp(5, "Out", 5 * IN, IN, int(1.5 * IN), int(0.6 * IN), prst="ellipse", style=True, text="Route R1A &amp; R1B")
    + cxn(6, int(2.5 * IN), int(1.3 * IN), int(0.5 * IN), 0, 3, 4)
    + cxn(7, int(4.2 * IN), int(1.3 * IN), int(0.8 * IN), 0, 4, 5, text="yields")
    + sp(8, "TextBox 8", IN, 2 * IN, 2 * IN, int(0.4 * IN), text="measure 20")
    + '<p:grpSp><p:nvGrpSpPr><p:cNvPr id="9" name="Group 9"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
    f'<p:grpSpPr><a:xfrm><a:off x="{3 * IN}" y="{2 * IN}"/><a:ext cx="{IN}" cy="{IN}"/>'
    f'<a:chOff x="0" y="0"/><a:chExt cx="{2 * IN}" cy="{2 * IN}"/></a:xfrm></p:grpSpPr>'
    + sp(10, "Diamond 10", 0, 0, 2 * IN, 2 * IN, prst="diamond", fill="FFC000", ln="none", text="?", rot=2700000)
    + "</p:grpSp>"
    + sp(11, "Freeform 11", 5 * IN, 2 * IN, IN, int(0.5 * IN), ln="008000", geom=FREEFORM)
    + '<p:pic><p:nvPicPr><p:cNvPr id="12" name="Picture 12"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr>'
      '<p:blipFill><a:blip r:embed="rId2"/></p:blipFill>'
    f'<p:spPr><a:xfrm><a:off x="{IN}" y="{3 * IN}"/><a:ext cx="{2 * IN}" cy="{IN}"/></a:xfrm>'
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>'
)
PROSE = slide(title("Notes")
              + '<p:sp><p:nvSpPr><p:cNvPr id="3" name="Content 2"/><p:cNvSpPr/><p:nvPr><p:ph idx="1"/></p:nvPr></p:nvSpPr>'
                '<p:spPr/><p:txBody><a:bodyPr/><a:p><a:r><a:t>Verify the lock is acquired</a:t></a:r></a:p></p:txBody></p:sp>'
              + sp(4, "TextBox 4", IN, IN, IN, IN, text="just a note"))
TWO_BOXES = slide(sp(3, "A", IN, IN, IN, IN, fill="FF0000", text="A") + sp(4, "B", 3 * IN, IN, IN, IN, fill="00FF00", text="B"))

PRES = (f'<p:presentation {NS}><p:sldIdLst><p:sldId id="256" r:id="rId3"/><p:sldId id="257" r:id="rId1"/>'
        '<p:sldId id="258" r:id="rId2"/></p:sldIdLst><p:sldSz cx="12192000" cy="6858000"/></p:presentation>')
PRES_RELS = ('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
             '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>'
             '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide2.xml"/>'
             '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide3.xml"/>'
             '</Relationships>')
THEME = ('<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:themeElements><a:clrScheme name="x">'
         '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>'
         '<a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2>'
         '<a:accent1><a:srgbClr val="2E75B6"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2>'
         '<a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4>'
         '<a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6>'
         '<a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink>'
         '</a:clrScheme></a:themeElements></a:theme>')
SLIDE1_RELS = ('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
               '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" '
               'Target="../media/image1.png"/></Relationships>')


def build(path):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("ppt/presentation.xml", PRES)
        z.writestr("ppt/_rels/presentation.xml.rels", PRES_RELS)
        z.writestr("ppt/theme/theme1.xml", THEME)
        z.writestr("ppt/slides/slide1.xml", FLOW)
        z.writestr("ppt/slides/_rels/slide1.xml.rels", SLIDE1_RELS)
        z.writestr("ppt/slides/slide2.xml", PROSE)
        z.writestr("ppt/slides/slide3.xml", TWO_BOXES)
        z.writestr("ppt/media/image1.png", b"\x89PNG\r\n\x1a\n")


NODE = """
import { loadScripts, runOp } from "file://%(ops)s";
import fs from "node:fs";
const mains = await loadScripts(process.env.SHAPES_SCRIPTS, ["shapes"], process.env.SHAPES_TMP);
const r = runOp(mains, { op: "shapes", zipFile: process.env.SHAPES_DECK });
process.stdout.write(JSON.stringify(r));
"""


def main():
    tmp = tempfile.mkdtemp(prefix="shapes-gate-")
    deck = os.path.join(tmp, "deck.pptx")
    build(deck)
    proc = subprocess.run(
        ["node", "--experimental-strip-types", "--input-type=module", "-e", NODE % {"ops": OPS}],
        capture_output=True, text=True, timeout=120,
        env={**os.environ, "SHAPES_SCRIPTS": os.path.abspath(SCRIPTS), "SHAPES_TMP": tmp, "SHAPES_DECK": deck})
    if proc.returncode != 0:
        print(proc.stdout[-2000:])
        print(proc.stderr[-2000:])
        print("RESULT: FAIL — node run errored")
        sys.exit(1)
    r = json.loads(proc.stdout)

    print("-- qualification + order --")
    check(r["count"] == 1 and len(r["drawings"]) == 1, "one drawing: the prose slide and the two-box slide yield nothing", json.dumps(r)[:300])
    check(r["skipped"] == "", "nothing skipped", r["skipped"])
    d = r["drawings"][0] if r["drawings"] else {}
    check(d.get("slide") == 2 and d.get("name") == "slide2-drawing.svg",
          "numbered in presentation order (the flow part is displayed second)", json.dumps(d)[:200])
    svg = d.get("svg", "")

    print("-- geometry + style --")
    check('<rect x="96" y="96" width="144" height="57.6"' in svg, "rect at its EMU position in px (1in = 96px)", svg[:400])
    check('fill="#1F4E79" stroke="#000000" stroke-width="2" stroke-dasharray="8 6"' in svg,
          "srgb fill, outline width from a:ln w, dash pattern from prstDash", svg[:600])
    check('rx="11.5"' in svg and 'data-prst="roundRect"' in svg, "rounded rect rx from the adj value", svg)
    check('fill="#78ADDD"' in svg, "theme accent1 through lumMod 60% / lumOff 40% (2E75B6 -> 78ADDD)", svg)
    check('stroke="#173B5B"' in svg, "style lnRef with shade 50% when spPr has no a:ln", svg)
    check('<ellipse cx="552" cy="124.8" rx="72" ry="28.8" fill="#2E75B6"' in svg, "ellipse from the style fillRef (accent1)", svg)
    check('<g transform="rotate(45 336 240)"><path d="M 336 192 L 384 240 L 336 288 L 288 240 Z" fill="#FFC000" data-prst="diamond"/>' in svg,
          "grouped diamond: child-space transform (2in child box -> the group's 1in) and 45 deg rotation about its centre", svg)
    check('<path d="M 480 240 L 528 192 L 576 240" fill="none" stroke="#008000"' in svg,
          "freeform custGeom path scaled into its box, outlined, open", svg)
    check('href="image1.png"' in svg and 'stroke-dasharray="4 3"' in svg and ">picture<" in svg,
          "picture placeholder references the sibling media basename", svg)

    print("-- text --")
    check('font-weight="bold" fill="#FFFFFF">Route R1</text>' in svg and 'text-anchor="middle"' in svg,
          "bold centred text, white on the dark fill", svg)
    check(">Split at</text>" in svg and ">20</text>" in svg, "text wraps inside its shape", svg)
    check('<text x="192" y="215.9" text-anchor="middle" font-family="' in svg and 'fill="#000000">measure 20</text>' in svg
          and svg.count("<rect") == 4,
          "a plain text box renders as text only (no box drawn), in the deck's own colour", svg)
    check(">yields</text>" in svg, "the connector's own label sits on the line", svg)
    check(">Route R1A &amp;</text>" in svg and d.get("labels", "").find("Route R1A & R1B") >= 0,
          "entities decoded for the words, re-escaped in the SVG", svg)

    print("-- connectors --")
    check('marker-end="url(#ah-C00000)"' in svg and '<marker id="ah-C00000"' in svg, "arrowhead marker on the glued end", svg)
    check(svg.count('marker-start=') == 0, "no head arrow when the source has none", svg)
    check(d.get("connections") == "Route R1 → Split at 20 · Split at 20 —yields→ Route R1A & R1B",
          "connections: glued ends resolved to shape text, labelled connector shown as —label→", d.get("connections"))
    check(d.get("shapes") == 6 and d.get("connectors") == 2, "shape / connector counts (picture not a shape)", json.dumps(d)[:200])

    print("-- words + bounds --")
    check(d.get("labels") == "Route R1 · Split at 20 · Route R1A & R1B · measure 20 · ?",
          "labels in reading order (top-down, left-right)", d.get("labels"))
    check(d.get("alt") == "Slide 2 drawing — 6 shapes, 2 connectors", "alt text carries the counts", d.get("alt"))
    check('viewBox="80 80 560 320"' in svg and 'width="560" height="320"' in svg,
          "viewBox cropped to the drawing plus 16px padding", svg[:300])
    check('data-slide="2" data-shapes="6" data-connectors="2"' in svg and "<title>" in svg, "data attributes + title", svg[:300])
    check("<svg xmlns=" in svg and svg.endswith("</svg>"), "well-formed envelope", svg[-50:])

    print()
    if failures:
        print(f"RESULT: FAIL — {len(failures)} assertion(s): " + "; ".join(failures))
        sys.exit(1)
    print(f"RESULT: PASS ({len(failures) == 0})")


if __name__ == "__main__":
    main()
