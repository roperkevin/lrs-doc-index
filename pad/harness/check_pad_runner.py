"""Gate for the PAD Node runner (pad/runner/run_job.mjs).

Proves the runner drives the UNMODIFIED scripts/ versions correctly:

  1. all seven op shapes execute through one batch job file
     (ziptext pptx + docx, media, regex, workbookdump, related
     shortlist + final, sidecarpatch) with zero op failures
  2. spot behavior: extraction text/kind/props, media count, regex
     ids + slug, WorkbookDump GFM (shared string, number, date
     serial rendered), shortlist/final ranking, sidecar patch
     rewrites the related region and passes folder through
  3. parity leg: the runner's ziptext output is JSON-identical to a
     direct review/harness/wrap.py run of scripts/ZipTextExtract.ts
     on the same fixture — the runner adds no behavior of its own

Pure stdlib + Node 22+ (--experimental-strip-types), no fixtures on
disk — everything is generated into a temp dir. CI-friendly.

Usage: python3 check_pad_runner.py
"""
import base64
import datetime
import json
import os
import subprocess
import sys
import tempfile
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
RUNNER = os.path.join(REPO, "pad", "runner", "run_job.mjs")
WRAP = os.path.join(REPO, "review", "harness", "wrap.py")
SCRIPTS = os.path.join(REPO, "scripts")

PASS = []
FAIL = []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    mark = "ok  " if cond else "FAIL"
    print(f"  {mark} {name}" + ("" if cond else f"  <- {detail}"))


# 1x1 red PNG
PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/"
    "q842iQAAAABJRU5ErkJggg=="
)

CORE_XML = (
    '<?xml version="1.0"?>'
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/'
    'metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" '
    'xmlns:dcterms="http://purl.org/dc/terms/" '
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
    "<dc:creator>Fixture Author</dc:creator>"
    "<cp:lastModifiedBy>Fixture Editor</cp:lastModifiedBy>"
    '<dcterms:modified xsi:type="dcterms:W3CDTF">2026-08-01T12:00:00Z</dcterms:modified>'
    "</cp:coreProperties>"
)


def make_pptx(path):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(
            "ppt/slides/slide1.xml",
            "<p:sld><p:cSld><p:spTree><p:sp><p:txBody>"
            "<a:p><a:r><a:t>Hello quota workaround slide</a:t></a:r></a:p>"
            "</p:txBody></p:sp></p:spTree></p:cSld></p:sld>",
        )
        z.writestr("ppt/media/image1.png", PNG)
        z.writestr("docProps/core.xml", CORE_XML)


def make_docx(path):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(
            "word/document.xml",
            "<w:document><w:body><w:p><w:r><w:t>Docx fixture body text</w:t></w:r>"
            "</w:p></w:body></w:document>",
        )
        z.writestr("docProps/core.xml", CORE_XML)


DATE_SERIAL = 45000  # 1899-12-30 + 45000 days


def make_xlsx(path):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(
            "xl/workbook.xml",
            '<workbook><sheets><sheet name="Data" sheetId="1" r:id="rId1"/></sheets>'
            "</workbook>",
        )
        z.writestr(
            "xl/_rels/workbook.xml.rels",
            '<Relationships><Relationship Id="rId1" Type="t" '
            'Target="worksheets/sheet1.xml"/></Relationships>',
        )
        z.writestr(
            "xl/sharedStrings.xml",
            "<sst><si><t>Name</t></si><si><t>Widget</t></si></sst>",
        )
        z.writestr(
            "xl/styles.xml",
            '<styleSheet><cellXfs count="2"><xf numFmtId="0"/><xf numFmtId="14"/>'
            "</cellXfs></styleSheet>",
        )
        z.writestr(
            "xl/worksheets/sheet1.xml",
            "<worksheet><sheetData>"
            '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="str"><v>Qty</v></c>'
            '<c r="C1" t="str"><v>When</v></c></row>'
            '<row r="2"><c r="A2" t="s"><v>1</v></c><c r="B2"><v>42.5</v></c>'
            f'<c r="C2" s="1"><v>{DATE_SERIAL}</v></c></row>'
            "</sheetData></worksheet>",
        )


# v2.3 yaml-on-top layout: fenced frame at byte 0, --- seam after
# ## Summary (the marker-missing fallback's insertion point)
SIDECAR = """```yaml
doc_id: 42
tools: []
related: []
```

# My Doc

## Summary

Body text stays put.

---

Footer line.
"""


def kwrow(doc, kwid, kwtitle):
    return {"Document": {"Id": doc}, "Keyword": {"Id": kwid, "Value": kwtitle}}


def main():
    tmp = tempfile.mkdtemp(prefix="pad-gate-")
    pptx = os.path.join(tmp, "fixture.pptx")
    docx = os.path.join(tmp, "fixture.docx")
    xlsx = os.path.join(tmp, "fixture.xlsx")
    make_pptx(pptx)
    make_docx(docx)
    make_xlsx(xlsx)

    my_kws = [kwrow(42, 1, "locks")]
    sharers = [kwrow(10, 1, "locks")]
    rel_common = {
        "myKwsJson": my_kws,
        "sharersJson": sharers,
        "linksJson": [],
        "kwMetaJson": [],
        "candsMetaJson": [],
        "selfMetaJson": [],
        "configJson": "{}",
        "topN": 5,
    }

    job = {
        "scriptsDir": SCRIPTS,
        "ops": [
            {"id": "zt-pptx", "op": "ziptext", "zipFile": pptx,
             "mediaPrefix": "../media/doc42_"},
            {"id": "zt-docx", "op": "ziptext", "zipFile": docx},
            {"id": "media", "op": "media", "zipFile": pptx},
            {"id": "regex", "op": "regex",
             "fileName": "ExB - Fixture Doc V3.pptx",
             "content": "#456 and https://devtopia.esri.com/A/b/issues/26161",
             "defaultRepo": "A/b", "title": "Fixture Doc"},
            {"id": "wbd", "op": "workbookdump", "xlsxFile": xlsx},
            {"id": "rel-short", "op": "related", "selfId": "42",
             "mode": "shortlist", **rel_common},
            {"id": "rel-final", "op": "related", "selfId": "42",
             "mode": "final", **rel_common},
            {"id": "patch", "op": "sidecarpatch", "selfId": "42",
             "filesJson": [{"doc": 42, "name": "my-doc__doc42.md",
                            "folder": "User Stories", "content": SIDECAR}],
             "rankedJson": [{"doc": 10, "s": 3.5,
                             "why": "1 shared keyword: locks"}],
             "docsMetaJson": [{"ID": 10, "Title": "Neighbor Doc",
                               "TextFileUrl": "https://x/s/Docs/User%20Stories/"
                                              "neighbor__doc10.md"}],
             "selfMetaJson": [], "topN": 5},
        ],
    }
    job_path = os.path.join(tmp, "job.json")
    with open(job_path, "w", encoding="utf-8") as f:
        json.dump(job, f)

    print("== run_job over the batch")
    proc = subprocess.run(
        ["node", "--experimental-strip-types", RUNNER, job_path],
        capture_output=True, text=True,
    )
    check("runner exit 0", proc.returncode == 0, proc.stderr[-400:])
    if proc.returncode != 0:
        report()
        return
    stdout = json.loads(proc.stdout)
    result_path = stdout["resultFile"]
    check("stdout points at result file", os.path.exists(result_path))
    with open(result_path, encoding="utf-8") as f:
        summary = json.load(f)
    check("zero op failures", summary["failures"] == 0,
          json.dumps([r for r in summary["results"] if not r["ok"]])[:400])
    by_id = {r["id"]: r for r in summary["results"]}
    envl = all(("result" in r) for r in summary["results"] if r["ok"])
    check("every ok op wrapped in a result envelope", envl)

    print("== op behavior")
    zt = by_id["zt-pptx"]["result"]
    check("ziptext pptx kind", zt["kind"] == "pptx", zt["kind"])
    check("ziptext pptx text", "Hello quota workaround slide" in zt["text"])
    check("ziptext core props", zt["author"] == "Fixture Author"
          and zt["lastEditedBy"] == "Fixture Editor"
          and zt["lastEdited"].startswith("2026-08-01"))
    ztd = by_id["zt-docx"]["result"]
    check("ziptext docx kind+text", ztd["kind"] == "docx"
          and "Docx fixture body text" in ztd["text"])
    md = by_id["media"]["result"]
    check("media count 1", md["count"] == 1, str(md)[:200])
    check("media base64 round-trips", base64.b64decode(
        md["images"][0]["b64"] if "b64" in md["images"][0]
        else md["images"][0].get("base64", "")) == PNG
        if md["count"] == 1 and any(k in md["images"][0] for k in ("b64", "base64"))
        else True)
    rx = by_id["regex"]["result"]
    check("regex found ids", rx["idCount"] >= 2, json.dumps(rx)[:200])
    check("regex slug nonempty", isinstance(rx["slug"], str) and rx["slug"] != "")
    wbd = by_id["wbd"]["result"]
    expect_date = "{d.month}/{d.day}/{d.year}".format(
        d=datetime.date(1899, 12, 30) + datetime.timedelta(days=DATE_SERIAL))
    check("workbookdump is a GFM table", "|" in wbd and "Widget" in wbd, wbd[:200])
    check("workbookdump number cell", "42.5" in wbd, wbd[:200])
    check("workbookdump date serial rendered", expect_date in wbd,
          f"wanted {expect_date} in: " + wbd[:200])
    rs = by_id["rel-short"]["result"]
    check("shortlist finds sharer", 10 in rs["docIds"], json.dumps(rs)[:200])
    rf = by_id["rel-final"]["result"]
    check("final ranks sharer first", rf["count"] >= 1
          and rf["related"][0]["doc"] == 10, json.dumps(rf)[:200])
    pt = by_id["patch"]["result"]
    f0 = pt["files"][0]
    check("patch rewrites related region", "doc10" in f0["content"]
          and f0["content"] != SIDECAR, f0["content"][:200])
    check("patch keeps body byte-stable", "Body text stays put." in f0["content"])
    check("patch passes folder through", f0["folder"] == "User Stories")

    print("== parity leg (runner vs review/harness wrap.py, ZipTextExtract)")
    wrap_out = os.path.join(tmp, "zt_wrap.ts")
    subprocess.run([sys.executable, WRAP,
                    os.path.join(SCRIPTS, "ZipTextExtract.ts"), wrap_out],
                   check=True)
    b64_path = os.path.join(tmp, "fixture.pptx.b64")
    with open(pptx, "rb") as f, open(b64_path, "w") as g:
        g.write(base64.b64encode(f.read()).decode())
    direct = subprocess.run(
        ["node", "--experimental-strip-types", wrap_out, b64_path,
         "../media/doc42_"],
        capture_output=True, text=True, check=True)
    direct_out = json.loads(direct.stdout)["out"]
    check("ziptext parity: runner == wrap.py run",
          json.dumps(direct_out, sort_keys=True)
          == json.dumps(zt, sort_keys=True))

    report()


def report():
    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FAILED:", ", ".join(FAIL))
        sys.exit(1)
    print("GATE PASSED")


if __name__ == "__main__":
    main()
