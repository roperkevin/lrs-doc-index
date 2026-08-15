"""Gate for the local Doc Index sweep (local/sweep.mjs).

Proves the local orchestrator reproduces the flow v2.8 pipeline
end-to-end with the cloud replaced by mocks:

  1. dry-run leg: full compute, zero writes — plan recorded, DocKey
     calibration reported, mock stores untouched
  2. live leg against a mock Graph + mock LLM (stdlib http.server):
     pptx/txt indexed, pdf skipped, corrupt pptx -> Error lane;
     Doc Index rows carry the v2.8 field set (Products, TextPreview,
     PromptVersion stamped by the URL patch); sidecars written with
     the v2.8 header (info table, <!-- metadata --> comment frame,
     related region); media extracted with doc{srcId}_ prefix;
     Doc IDs / Doc Links (sorted-pair id edge) / Keywords (canonical
     alias folding, no duplicate for seeded keyword) / Doc Keywords
     junctions minted with the flow's dedup keys; relatedness runs
     shortlist->final->sidecarpatch and patches the NEIGHBOR sidecar
     reciprocally; summary counts match
  3. error isolation: the corrupt doc consumes the cap and lands an
     Error row without failing the run

Pure stdlib + Node 22+, generated fixtures, CI-friendly.
Usage: python3 check_local_sweep.py
"""
import base64
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import zipfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
SWEEP = os.path.join(REPO, "local", "sweep.mjs")
CURATE = os.path.join(REPO, "local", "curate.mjs")
CURATION_MODEL = "cabcabca-0000-4000-8000-000000000001"

PASS = []
FAIL = []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    mark = "ok  " if cond else "FAIL"
    print(f"  {mark} {name}" + ("" if cond else f"  <- {detail}"))


# ---- fixtures -------------------------------------------------------

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


def make_pptx(fpath, text, with_media=False):
    with zipfile.ZipFile(fpath, "w", zipfile.ZIP_DEFLATED) as z:
        embed = '<p:pic><a:blip r:embed="rId2"/></p:pic>' if with_media else ""
        z.writestr(
            "ppt/slides/slide1.xml",
            "<p:sld><p:cSld><p:spTree><p:sp><p:txBody>"
            f"<a:p><a:r><a:t>{text}</a:t></a:r></a:p>"
            f"</p:txBody></p:sp>{embed}</p:spTree></p:cSld></p:sld>",
        )
        if with_media:
            # media only counts when a slide references it via its rels
            z.writestr(
                "ppt/slides/_rels/slide1.xml.rels",
                '<Relationships><Relationship Id="rId2" '
                'Type="http://schemas.openxmlformats.org/officeDocument/2006/'
                'relationships/image" Target="../media/image1.png"/></Relationships>',
            )
            z.writestr("ppt/media/image1.png", PNG)
        z.writestr("docProps/core.xml", CORE_XML)


# ---- mock Graph + LLM server ---------------------------------------

class MockState:
    def __init__(self):
        self.next_id = 100
        # list GUID -> {item_id(str) -> fields dict}
        self.lists = {}
        self.llm_by_file = {}
        self.llm_calls = 0
        self.llm_last_headers = {}
        self.llm_last_request = {}
        self.devicecode_hits = 0
        self.device_grants = 0
        self.refresh_grants = 0
        self.digest = None
        self.cur_last_request = None
        self.cur_response = {"proposals": []}
        self.graph_last_auth = None
        self.spo_last_auth = None

    def seed(self, guid, fields):
        self.lists.setdefault(guid, {})
        iid = str(self.next_id)
        self.next_id += 1
        self.lists[guid][iid] = fields
        return iid


def make_handler(state, lib_guid, src_files):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def _json(self, obj, code=200):
            body = json.dumps(obj).encode()
            self.send_response(code)
            self.send_header("content-type", "application/json")
            self.send_header("content-length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def _read(self):
            n = int(self.headers.get("content-length") or 0)
            return self.rfile.read(n) if n else b""

        def _classify(self, match):
            for fname, resp in state.llm_by_file.items():
                if match(fname):
                    return resp
            return {"title": "", "docKind": "Other", "surface": "Other",
                    "summary": "", "pe": "", "dev": "", "targetRelease": "",
                    "tools": [], "keywords": []}

        def do_POST(self):
            p = urlparse(self.path).path
            if p == "/devicecode":
                self._read()
                state.devicecode_hits += 1
                return self._json({
                    "device_code": "mock-dc", "user_code": "MOCK-CODE",
                    "verification_uri": "https://mock.example/devicelogin",
                    "interval": 1, "expires_in": 60,
                    "message": "mock sign-in",
                })
            if p == "/token":
                body = self._read().decode()
                if "device_code" in body:
                    state.device_grants += 1
                    # short-lived on purpose: forces the refresh path
                    return self._json({"access_token": "device-token",
                                       "refresh_token": "mock-rt", "expires_in": 30})
                if "refresh_token" in body:
                    state.refresh_grants += 1
                    return self._json({"access_token": "refreshed-token",
                                       "refresh_token": "mock-rt-2", "expires_in": 3600})
                return self._json({"access_token": "mock", "expires_in": 3600})
            if p == "/v1/messages":
                body = json.loads(self._read())
                state.llm_calls += 1
                state.llm_last_headers = {
                    "authorization": self.headers.get("authorization"),
                    "x-api-key": self.headers.get("x-api-key"),
                    "anthropic-beta": self.headers.get("anthropic-beta"),
                }
                prompt = body["messages"][0]["content"]
                out = self._classify(lambda fname: fname in prompt)
                return self._json({
                    "stop_reason": "end_turn",
                    "content": [{"type": "text", "text": json.dumps(out)}],
                })
            # Dataverse Predict — the AI Builder custom prompt endpoint
            mp = re.match(r"^/api/data/v9\.2/msdyn_aimodels\(([0-9a-f-]+)\)/Microsoft\.Dynamics\.CRM\.Predict$", p)
            if mp:
                body = json.loads(self._read())
                # the curation prompt is its OWN model — route by GUID
                if mp.group(1) == CURATION_MODEL:
                    state.cur_last_request = body
                    text = ("Sure! Here is the JSON:\n```json\n"
                            + json.dumps(state.cur_response) + "\n```")
                    return self._json({"responsev2": {"predictionOutput": {"text": text}}})
                state.llm_calls += 1
                state.llm_last_headers = {
                    "authorization": self.headers.get("authorization"),
                    "x-api-key": self.headers.get("x-api-key"),
                    "anthropic-beta": self.headers.get("anthropic-beta"),
                }
                state.llm_last_request = body
                fname_in = body.get("requestv2", {}).get("FileName", "")
                out = self._classify(lambda fname: fname == fname_in)
                # wrap in prose + fences: the sweep must brace-slice,
                # exactly like the flow's Prompt_json_slice
                text = "Sure! Here is the JSON:\n```json\n" + json.dumps(out) + "\n```"
                return self._json({"responsev2": {"predictionOutput": {"text": text}}})
            # SPO ValidateUpdateListItem — hyperlink-column writes
            m = re.match(r"^/sites/lrsworkspace/_api/web/lists\(guid'([^']+)'\)/items\((-?\d+)\)/ValidateUpdateListItem$", p)
            if m:
                guid, iid = m.group(1), m.group(2)
                state.spo_last_auth = self.headers.get("authorization")
                body = json.loads(self._read())
                row = state.lists.setdefault(guid, {}).setdefault(iid, {})
                out = []
                for fv in body.get("formValues", []):
                    name, val = fv.get("FieldName"), str(fv.get("FieldValue", ""))
                    if val.startswith("http"):
                        url, _, desc = val.partition(", ")
                        row[name] = {"Url": url, "Description": desc}
                    else:
                        row[name] = val
                    out.append({"FieldName": name, "ErrorMessage": None})
                return self._json({"value": out})
            m = re.match(r"^/v1\.0/sites/([^/]+)/lists/([^/]+)/items$", p)
            if m:
                guid = m.group(2)
                state.graph_last_auth = self.headers.get("authorization")
                fields = json.loads(self._read()).get("fields", {})
                if any(k in fields for k in ("SourceLink", "TextFileUrl")):
                    # real Graph rejects hyperlink columns — keep the mock honest
                    return self._json({"error": {"code": "invalidRequest",
                                                 "message": "hyperlink column via Graph"}}, 400)
                state.lists.setdefault(guid, {})
                iid = str(state.next_id)
                state.next_id += 1
                state.lists[guid][iid] = fields
                return self._json({"id": iid, "fields": fields}, 201)
            return self._json({"error": "unhandled POST " + p}, 500)

        def do_PUT(self):
            p = urlparse(self.path).path
            # Graph drive upload — the curation digest lands in the
            # site's default drive (Shared Documents), never a list
            if re.match(r"^/v1\.0/sites/[^/]+/drive/root:/.+:/content$", p):
                state.digest = self._read().decode()
                return self._json({"id": "digest"})
            return self._json({"error": "unhandled PUT " + p}, 500)

        def do_PATCH(self):
            m = re.match(r"^/v1\.0/sites/[^/]+/lists/([^/]+)/items/(-?\d+)/fields$", urlparse(self.path).path)
            if m:
                guid, iid = m.group(1), m.group(2)
                state.graph_last_auth = self.headers.get("authorization")
                patch = json.loads(self._read())
                state.lists.setdefault(guid, {}).setdefault(iid, {}).update(patch)
                return self._json({"id": iid})
            return self._json({"error": "unhandled PATCH " + self.path}, 500)

        def do_GET(self):
            p = urlparse(self.path).path
            m = re.match(r"^/v1\.0/sites/([^/]+):(/.+)$", p)
            if m:
                return self._json({"id": "site-" + m.group(2).strip("/").split("/")[-1]})
            m = re.match(r"^/v1\.0/sites/([^/]+)/lists/([^/]+)/items$", p)
            if m:
                guid = m.group(2)
                if guid == lib_guid:
                    return self._json({"value": src_files})
                rows = [
                    {"id": iid, "fields": dict(fields)}
                    for iid, fields in state.lists.get(guid, {}).items()
                ]
                return self._json({"value": rows})
            return self._json({"error": "unhandled GET " + p}, 500)

    return Handler


# ---- main -----------------------------------------------------------

LISTS = {
    "docIndex": "list-docindex",
    "keywords": "list-keywords",
    "docIds": "list-docids",
    "docKeywords": "list-dockw",
    "docLinks": "list-doclinks",
    "sourceLibrary": "list-library",
}


def run_curate(cfg_path, extra):
    return subprocess.run(
        ["node", "--experimental-strip-types", CURATE, "--config", cfg_path] + extra,
        capture_output=True, text=True, cwd=REPO,
        env=dict(os.environ, DOCINDEX_ALLOW_DEVICE_PROMPT="1"),
    )


def run_sweep(cfg_path, extra, env=None):
    # captured output means no TTY: allow the mock device prompt except
    # where a leg deliberately tests the non-interactive fail-fast
    e = dict(env if env is not None else os.environ)
    e.setdefault("DOCINDEX_ALLOW_DEVICE_PROMPT", "1")
    return subprocess.run(
        ["node", "--experimental-strip-types", SWEEP, "--config", cfg_path] + extra,
        capture_output=True, text=True, cwd=REPO, env=e,
    )


def main():
    tmp = tempfile.mkdtemp(prefix="local-sweep-gate-")
    src_dir = os.path.join(tmp, "source")
    sidecar_dir = os.path.join(tmp, "sidecar")
    work_dir = os.path.join(tmp, "work")
    for d in (src_dir, os.path.join(sidecar_dir, "media"), work_dir):
        os.makedirs(d, exist_ok=True)

    # fixture corpus
    make_pptx(os.path.join(src_dir, "Alpha Plan.pptx"),
              "Alpha test plan covering lock acquisition #123", with_media=True)
    make_pptx(os.path.join(src_dir, "Beta Story.pptx"),
              "Beta user story about locks and issue #123")
    with open(os.path.join(src_dir, "notes.txt"), "w") as f:
        f.write("Plain text notes about calibration points.")
    with open(os.path.join(src_dir, "spec.pdf"), "wb") as f:
        f.write(b"%PDF-1.4 text-bearing (stub pdftotext returns text for this one)")
    with open(os.path.join(src_dir, "scan.pdf"), "wb") as f:
        f.write(b"%PDF-1.4 image-only (stub pdftotext returns nothing)")
    with open(os.path.join(src_dir, "corrupt.pptx"), "wb") as f:
        f.write(b"this is not a zip archive")
    with open(os.path.join(src_dir, "guide.html"), "w") as f:
        f.write("<html><head><title>x</title><script>var sneaky=1;</script>"
                "<style>p{color:red}</style></head><body>"
                "<h1>Onboarding &amp; Setup</h1>"
                "<p>Guide about onboarding new hires.</p></body></html>")

    # stub pdftotext: text for spec.pdf, nothing for anything else
    # (argv: -layout -enc UTF-8 <file> - ; also handles -v detection)
    # spec.pdf's body deliberately shares vocabulary with notes.txt
    # (calibration...) while sharing NO keyword — only the body-sim
    # candidate source can relate them
    pdftotext_stub = os.path.join(tmp, "pdftotext")
    with open(pdftotext_stub, "w") as f:
        f.write('#!/bin/sh\ncase "$4" in\n'
                '  *spec.pdf) echo "Spec text describing calibration points and calibration procedures." ;;\n'
                '  *outside.pdf) echo "Outside pdf, reachable after the sync widened." ;;\n'
                '  *) : ;;\nesac\n')
    os.chmod(pdftotext_stub, 0o755)

    def src_item(iid, name, modified, seg="Shared Documents/General"):
        return {
            "id": str(iid),
            "webUrl": f"https://mock.example/src/{name}",
            "lastModifiedDateTime": modified,
            "fields": {
                "FileLeafRef": name,
                "FileRef": f"/sites/LocationReferencing/{seg}/{name}",
                "Modified": modified,
                "FSObjType": "0",
            },
        }

    # Beta newer than Alpha -> Beta indexes first; Alpha then finds the
    # sharer, mints the edge, and reciprocally patches Beta's sidecar.
    # outside.txt + outside.pdf live outside the synced root segment
    # (out-of-scope lane: stamped Skip; the pdf also proves no nightly
    # rescue loop); missing.txt is in scope but absent on disk (sync
    # lag: a retryable Error). The scope-rescue leg later moves both
    # outside.* fixtures into scope and proves they re-index alone.
    src_files = [
        src_item(11, "Beta Story.pptx", "2026-08-13T10:00:00Z"),
        src_item(10, "Alpha Plan.pptx", "2026-08-12T10:00:00Z"),
        src_item(12, "notes.txt", "2026-08-11T10:00:00Z"),
        src_item(13, "spec.pdf", "2026-08-10T10:00:00Z"),
        src_item(14, "corrupt.pptx", "2026-08-09T10:00:00Z"),
        src_item(15, "outside.txt", "2026-08-08T10:00:00Z", seg="Shared Documents"),
        src_item(16, "missing.txt", "2026-08-07T10:00:00Z"),
        src_item(17, "scan.pdf", "2026-08-06T10:00:00Z"),
        src_item(18, "outside.pdf", "2026-08-05T10:00:00Z", seg="Shared Documents"),
        src_item(19, "guide.html", "2026-08-04T10:00:00Z"),
    ]

    state = MockState()
    # seeded canonical keyword — sweeps must reuse it, not re-mint
    state.seed(LISTS["keywords"], {"Title": "locks", "Kind": "topic"})
    # spec.pdf pre-stamped Skipped at the CURRENT PromptVersion with no
    # extraction attempt — exactly the tenant state the backfill leaves
    # PDFs in; only the PDF-rescue gate can reprocess it (SourceModified
    # matches the library, so no modified/promptVersion trigger)
    state.seed(LISTS["docIndex"], {
        "Title": "spec.pdf", "FileName": "spec.pdf",
        "DocKey": "shared documents/general/spec.pdf", "IndexStatus": "Skipped",
        "SourceModified": "2026-08-10T10:00:00Z", "PromptVersion": "v2.0",
        "ExtractionLane": "none",
    })
    # ghost: an Indexed row whose source doc no longer exists in the
    # library, with a stale sidecar on disk — reconciliation must
    # archive the row and prune the sidecar
    ghost_sc = os.path.join(sidecar_dir, "Test Plans", "Ghost Doc.md")
    os.makedirs(os.path.dirname(ghost_sc), exist_ok=True)
    with open(ghost_sc, "w") as f:
        f.write("# Ghost Doc\nstale sidecar\n")
    state.seed(LISTS["docIndex"], {
        "Title": "Ghost Doc", "FileName": "Ghost Doc.pptx",
        "DocKey": "shared documents/ghost doc.pptx", "IndexStatus": "Indexed",
        "SourceModified": "2026-08-01T10:00:00Z", "PromptVersion": "v2.0",
        "TextFileUrl": {"Url": "https://mock.example/sites/lrsworkspace/LRS Doc Index/Test Plans/Ghost Doc.md",
                        "Description": "Ghost Doc.md"},
    })
    state.llm_by_file = {
        "Alpha Plan.pptx": {
            "title": "Alpha Plan", "docKind": "Test Plan", "surface": "Pro",
            "summary": "Covers lock acquisition.", "pe": "Claire Wang", "dev": "",
            "targetRelease": "3.8", "tools": [], "keywords": ["locks", "acquisition"]},
        "Beta Story.pptx": {
            "title": "Beta Story", "docKind": "User Story", "surface": "Pro",
            "summary": "A story about locks.", "pe": "", "dev": "",
            "targetRelease": "", "tools": [], "keywords": ["locks"]},
        "notes.txt": {
            "title": "", "docKind": "Other", "surface": "Other",
            "summary": "Calibration notes.", "pe": "", "dev": "",
            "targetRelease": "", "tools": [], "keywords": ["calibration points"]},
        "spec.pdf": {
            "title": "Spec", "docKind": "Other", "surface": "Other",
            "summary": "PDF spec about extraction.", "pe": "", "dev": "",
            "targetRelease": "", "tools": [], "keywords": ["pdf extraction"]},
        "outside.txt": {
            "title": "Outside Notes", "docKind": "Other", "surface": "Other",
            "summary": "Rescued after the sync widened.", "pe": "", "dev": "",
            "targetRelease": "", "tools": [], "keywords": []},
        "outside.pdf": {
            "title": "Outside PDF", "docKind": "Other", "surface": "Other",
            "summary": "Rescued pdf after the sync widened.", "pe": "", "dev": "",
            "targetRelease": "", "tools": [], "keywords": []},
        "guide.html": {
            "title": "Onboarding Guide", "docKind": "Other", "surface": "Other",
            "summary": "Onboarding guide.", "pe": "", "dev": "",
            "targetRelease": "", "tools": [], "keywords": ["onboarding"]},
    }

    server = ThreadingHTTPServer(
        ("127.0.0.1", 0), make_handler(state, LISTS["sourceLibrary"], src_files))
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}"

    cfg = {
        "sharePoint": {
            "hostname": "mock.example",
            "sitePath": "/sites/lrsworkspace",
            "sourceSitePath": "/sites/LocationReferencing",
            "docKeyStrip": "/sites/LocationReferencing/",
            "libraryRootSegment": "Shared Documents/General",
            "lists": LISTS,
        },
        "paths": {"sourceLibrary": src_dir, "sidecarLibrary": sidecar_dir, "workDir": work_dir},
        "graph": {
            "tenantId": "mock", "clientId": "mock", "clientSecret": "mock-secret",
            "baseUrl": base + "/v1.0", "tokenUrl": base + "/token",
            "maxRetries": 0,
        },
        "llm": {
            "provider": "aibuilder", "environmentUrl": base,
            "modelId": "ef04e39d-3775-4655-a8be-60192095c1d6",
            "curationModelId": CURATION_MODEL, "maxRetries": 0,
        },
        "spo": {
            "auth": "app", "tenantId": "mock", "clientId": "mock",
            "clientSecret": "mock-secret", "tokenUrl": base + "/token",
            "siteUrl": "https://mock.example/sites/lrsworkspace",
            "baseUrl": base + "/sites/lrsworkspace",
        },
        "sweep": {
            "siteUrl": "https://mock.example/sites/lrsworkspace",
            "dryRun": True,
            "pdftotextPath": pdftotext_stub,
        },
    }
    cfg_path = os.path.join(tmp, "config.json")
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)

    # ---- leg 1: dry run -------------------------------------------
    print("== dry-run leg")
    md_before = {os.path.join(r, f) for r, _, fs_ in os.walk(sidecar_dir)
                 for f in fs_ if f.endswith(".md")}
    proc = run_sweep(cfg_path, [])
    check("dry run exit 0", proc.returncode == 0, proc.stderr[-600:])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    check("dry run processed 10 (incl. the PDF-rescued spec.pdf)",
          out.get("processed") == 10, str(out))
    check("dry run flagged as dry", out.get("dry_run") is True)
    check("dry run planned the ghost archive without executing",
          out.get("archived") == 1
          and state.lists[LISTS["docIndex"]][
              [i for i, f_ in state.lists[LISTS["docIndex"]].items()
               if f_.get("FileName") == "Ghost Doc.pptx"][0]].get("IndexStatus") == "Indexed"
          and os.path.exists(ghost_sc), str(out))
    md_after = {os.path.join(r, f) for r, _, fs_ in os.walk(sidecar_dir)
                for f in fs_ if f.endswith(".md")}
    check("dry run wrote/deleted no sidecars", md_after == md_before)
    check("dry run created no rows (only the two seeded rows exist)",
          len(state.lists.get(LISTS["docIndex"], {})) == 2)
    with open(out["logFile"]) as f:
        log = json.load(f)
    check("dry run recorded a write plan", len(log.get("plan") or []) > 10,
          str(len(log.get("plan") or [])))

    # ---- leg 2: live run against mocks ----------------------------
    print("== live leg")
    proc = run_sweep(cfg_path, ["--live"])
    check("live exit 0", proc.returncode == 0, proc.stderr[-600:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("live processed 10", out.get("processed") == 10, str(out))
    check("live errors 2 (corrupt.pptx, missing.txt)", out.get("errors") == 2, str(out))
    check("live counted 2 out-of-scope docs", out.get("out_of_scope") == 2, str(out))

    rows = state.lists[LISTS["docIndex"]]
    by_name = {}
    for iid, fields in rows.items():
        by_name[fields.get("FileName")] = (iid, fields)
    check("doc index rows for all 10 docs + the ghost", len(by_name) == 11, str(sorted(by_name)))

    _, html = by_name.get("guide.html", (None, {}))
    check("html indexed via the htmltotext lane",
          html.get("IndexStatus") == "Indexed"
          and html.get("ExtractionLane") == "htmltotext"
          and html.get("FileType") == "html", str(html)[:250])
    check("html text stripped and entities decoded",
          "Onboarding & Setup" in str(html.get("TextPreview", ""))
          and "sneaky" not in str(html.get("TextPreview", ""))
          and "<h1>" not in str(html.get("TextPreview", "")),
          str(html.get("TextPreview"))[:200])

    _, ghost = by_name.get("Ghost Doc.pptx", (None, {}))
    check("ghost row archived with dated note",
          ghost.get("IndexStatus") == "Archived"
          and "archived" in str(ghost.get("LastError", ""))
          and out.get("archived") == 1, str(ghost)[:250])
    check("ghost sidecar pruned", not os.path.exists(ghost_sc))

    _, outside = by_name.get("outside.txt", (None, {}))
    check("out-of-scope doc -> stamped Skip",
          outside.get("IndexStatus") == "Skipped"
          and outside.get("PromptVersion") == "v2.0"
          and "out of sync scope" in str(outside.get("LastError", "")), str(outside)[:250])
    _, outpdf = by_name.get("outside.pdf", (None, {}))
    check("out-of-scope pdf -> stamped Skip too",
          outpdf.get("IndexStatus") == "Skipped"
          and "out of sync scope" in str(outpdf.get("LastError", "")), str(outpdf)[:250])

    _, missing = by_name.get("missing.txt", (None, {}))
    check("in-scope missing file -> retryable Error",
          missing.get("IndexStatus") == "Error"
          and "not found locally" in str(missing.get("LastError", "")), str(missing)[:250])

    _, alpha = by_name.get("Alpha Plan.pptx", (None, {}))
    check("alpha indexed", alpha.get("IndexStatus") == "Indexed", str(alpha)[:200])
    check("alpha kind clamped fieldset", alpha.get("DocKind") == "Test Plan"
          and alpha.get("Surface") == "Pro" and alpha.get("PE") == "Claire Wang")
    check("alpha PromptVersion stamped", alpha.get("PromptVersion") == "v2.0")
    check("alpha TextFileUrl set",
          isinstance(alpha.get("TextFileUrl"), dict)
          and "__doc" in alpha["TextFileUrl"].get("Url", ""), str(alpha.get("TextFileUrl")))
    check("alpha preview + author", "lock acquisition" in alpha.get("TextPreview", "")
          and alpha.get("SourceAuthor") == "Fixture Author")

    _, pdf = by_name.get("spec.pdf", (None, {}))
    check("pre-stamped Skipped pdf rescued and indexed",
          pdf.get("IndexStatus") == "Indexed"
          and pdf.get("ExtractionLane") == "plaintext"
          and pdf.get("Summary") == "PDF spec about extraction.", str(pdf)[:250])
    _, scan = by_name.get("scan.pdf", (None, {}))
    check("no-text pdf skipped with attempt stamp (lane plaintext)",
          scan.get("IndexStatus") == "Skipped"
          and scan.get("ExtractionLane") == "plaintext"
          and scan.get("PromptVersion") == "v2.0", str(scan)[:250])

    _, bad = by_name.get("corrupt.pptx", (None, {}))
    check("corrupt doc -> Error row", bad.get("IndexStatus") == "Error", str(bad)[:200])
    check("error names the failing step",
          str(bad.get("LastError", "")).startswith("ziptext-pptx:"), str(bad.get("LastError"))[:120])

    # sidecars on disk
    md_files = {f: os.path.join(r, f)
                for r, _, fs_ in os.walk(sidecar_dir) for f in fs_
                if f.endswith(".md") and not f.startswith("_Sweep")}
    check("five sidecars written (incl. rescued pdf + html)", len(md_files) == 5, str(sorted(md_files)))

    # body-text similarity: spec.pdf and notes.txt share body words but
    # NO keyword/edge — only the BodySim candidate source can join them
    spec_sc_path = next((p for n, p in md_files.items() if "spec" in n.lower()), None)
    spec_sc = open(spec_sc_path).read() if spec_sc_path else ""
    notes_id = int(by_name["notes.txt"][0])
    check("body-sim relates spec.pdf to notes.txt (no shared keyword)",
          f"doc{notes_id}" in spec_sc and "similar text (" in spec_sc,
          spec_sc[-500:])

    # status page (live runs only, sidecar-library root)
    status_path = os.path.join(sidecar_dir, "_Sweep Status.md")
    status = open(status_path).read() if os.path.exists(status_path) else ""
    check("status page written on live run",
          "10 processed, 2 errors" in status and "corrupt.pptx" in status,
          status[:300])
    check("status page names the error lane",
          "ziptext-pptx:" in status, status[:300])
    check("status page reports out-of-scope docs",
          "Out of sync scope:** 2" in status, status[:400])
    check("status page reports the archive",
          "Archived this run:** 1" in status, status[:400])
    alpha_sc = next((p for n, p in md_files.items() if "alpha" in n), None)
    beta_sc = next((p for n, p in md_files.items() if "beta" in n), None)
    check("alpha sidecar in kind folder", alpha_sc is not None and os.sep + "Test Plans" + os.sep in alpha_sc,
          str(alpha_sc))
    sc = open(alpha_sc).read() if alpha_sc else ""
    check("sidecar header shape", sc.startswith("# Alpha Plan")
          and "<!-- metadata" in sc and 'prompt_version: "v2.0"' in sc
          and "| **Kind** | Test Plan · Pro |" in sc, sc[:300])
    check("sidecar issue row + yaml", "#123" in sc and 'issues: ["' in sc)
    check("sidecar body appended", "Alpha test plan covering lock acquisition" in sc)
    alpha_id = int(by_name["Alpha Plan.pptx"][0])
    beta_id = int(by_name["Beta Story.pptx"][0])
    check("alpha related region patched (names beta)",
          f"doc{beta_id}" in sc.split("<!-- related:begin -->")[-1]
          or f"doc{beta_id}" in sc, sc[-500:])
    beta_content = open(beta_sc).read() if beta_sc else ""
    check("beta sidecar reciprocally patched (names alpha)",
          f"doc{alpha_id}" in beta_content and "_None yet._" not in beta_content,
          beta_content[-500:])

    # media
    media = os.listdir(os.path.join(sidecar_dir, "media"))
    check("media extracted with src-id prefix",
          any(m.startswith("doc10_") for m in media), str(media))

    # doc ids / links / keywords / junctions
    docids = list(state.lists.get(LISTS["docIds"], {}).values())
    check("two doc id rows for #123", len([r for r in docids if r.get("IssueNumber") == 123]) == 2,
          str(docids))
    links = list(state.lists.get(LISTS["docLinks"], {}).values())
    check("one sorted-pair id edge", len(links) == 1
          and links[0].get("LinkKey") == f"{min(alpha_id, beta_id)}|{max(alpha_id, beta_id)}|id",
          str(links))
    kws = list(state.lists.get(LISTS["keywords"], {}).values())
    lock_rows = [r for r in kws if r.get("Title") == "locks"]
    check("seeded keyword reused, not re-minted", len(lock_rows) == 1, str(kws))
    check("new keywords minted", any(r.get("Title") == "acquisition" for r in kws)
          and any(r.get("Title") == "calibration points" for r in kws), str(kws))
    junctions = list(state.lists.get(LISTS["dockw"] if "dockw" in LISTS else "docKeywords", {}).values()) \
        if False else list(state.lists.get(LISTS["docKeywords"], {}).values())
    check("junction rows keyed {doc}|{kw}", len(junctions) >= 4
          and all("|" in str(r.get("KWKey")) for r in junctions), str(junctions)[:300])

    # AI Builder wire shape (the live leg above ran provider aibuilder;
    # the fenced/prose-wrapped Predict output parsing is proven by the
    # field checks — the clamps received real values)
    check("aibuilder bearer token sent",
          str(state.llm_last_headers.get("authorization", "")).startswith("Bearer ")
          and not state.llm_last_headers.get("x-api-key"), str(state.llm_last_headers))
    check("aibuilder requestv2 inputs shaped like the flow",
          state.llm_last_request.get("version") == "2.0"
          and set(state.llm_last_request.get("requestv2", {})) >=
          {"FileName", "DocText", "ExistingKeywords"},
          str(state.llm_last_request)[:300])
    check("aibuilder source telemetry present (Predict rejects without it)",
          "consumptionSource" in str(state.llm_last_request.get("source", "")),
          str(state.llm_last_request.get("source"))[:200])

    # ---- leg 3: idempotency — second live run reindexes nothing ----
    print("== idempotency leg")
    llm_before = state.llm_calls
    for i in range(40):  # prune fodder: names sort older than real stamps
        with open(os.path.join(work_dir, f"sweep-0000-{i:03d}.json"), "w") as f:
            f.write("{}")
    proc = run_sweep(cfg_path, ["--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("second run reprocesses only the two Error docs (not the stamped out-of-scope Skip)",
          out.get("processed") == 2 and out.get("out_of_scope") == 0
          and out.get("archived") == 0, str(out))
    check("no extra LLM calls for stamped docs", state.llm_calls == llm_before,
          f"{state.llm_calls} vs {llm_before}")
    # streaks: run 1 stamped 1 night; this full run makes it 2
    status2 = open(os.path.join(sidecar_dir, "_Sweep Status.md")).read()
    check("error streaks advance on full runs",
          "Nights stuck" in status2
          and "| corrupt.pptx | 2 |" in status2
          and "| missing.txt | 2 |" in status2, status2[:600])

    run_logs = [f for f in os.listdir(work_dir) if f.startswith("sweep-") and f.endswith(".json")]
    check("run logs pruned to 30", len(run_logs) == 30, str(len(run_logs)))
    check("pruning kept the newest logs",
          os.path.basename(out["logFile"]) in run_logs
          and sum(1 for f in run_logs if f.startswith("sweep-0000-")) < 40,
          str(sorted(run_logs)[:5]))

    # ---- leg 3b: no pdftotext on the machine — flow-era behavior ----
    # a modified pdf skips gracefully (no Error, no hang) and the log
    # says why; nothing else regresses
    print("== pdf no-tool leg")
    src_files[3]["fields"]["Modified"] = "2026-08-15T10:00:00Z"  # spec.pdf
    cfg["sweep"]["pdftotextPath"] = os.path.join(tmp, "no-such-pdftotext")
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "spec.pdf"])
    check("no-tool run exit 0", proc.returncode == 0, proc.stderr[-400:])
    check("no-tool run says why PDFs skip", "pdftotext not found" in proc.stderr,
          proc.stderr[-400:])
    _, pdf2 = [(i, f_) for i, f_ in state.lists[LISTS["docIndex"]].items()
               if f_.get("FileName") == "spec.pdf"][0]
    check("modified pdf without tool -> Skip lane (not Error)",
          pdf2.get("IndexStatus") == "Skipped"
          and pdf2.get("ExtractionLane") == "none", str(pdf2)[:250])
    cfg["sweep"]["pdftotextPath"] = pdftotext_stub  # restore for later legs
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)

    # ---- leg 3c: sync widened — stamped docs rescue automatically ----
    # the real widening: server paths (and DocKeys) don't change; the
    # LOCAL sync root grows from .../General to the whole library.
    # Simulated with a widened dir (General/ inside it) + config edits
    # exactly as the setup guide prescribes. Each stamped doc must
    # re-index by itself — no promptVersion bump, no touch.
    print("== scope rescue leg")
    widened_dir = os.path.join(tmp, "source-wide")
    shutil.copytree(src_dir, os.path.join(widened_dir, "General"))
    with open(os.path.join(widened_dir, "outside.txt"), "w") as f:
        f.write("Notes that lived outside the synced scope.")
    with open(os.path.join(widened_dir, "outside.pdf"), "wb") as f:
        f.write(b"%PDF-1.4 reachable after the sync widened")
    cfg["paths"]["sourceLibrary"] = widened_dir
    cfg["sharePoint"]["libraryRootSegment"] = "Shared Documents"
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "outside.txt"])
    out = json.loads(proc.stdout.splitlines()[0])
    row = [f_ for f_ in state.lists[LISTS["docIndex"]].values()
           if f_.get("FileName") == "outside.txt"][0]
    check("widened sync: stamped doc re-indexed via scope rescue",
          out.get("processed") == 1 and row.get("IndexStatus") == "Indexed"
          and row.get("Summary") == "Rescued after the sync widened.",
          str(out) + " " + str(row)[:200])
    proc = run_sweep(cfg_path, ["--live", "--only", "outside.pdf"])
    out = json.loads(proc.stdout.splitlines()[0])
    row = [f_ for f_ in state.lists[LISTS["docIndex"]].values()
           if f_.get("FileName") == "outside.pdf"][0]
    check("widened sync: stamped pdf re-indexed too",
          out.get("processed") == 1 and row.get("IndexStatus") == "Indexed",
          str(out) + " " + str(row)[:200])

    # ---- leg 3d: keyword curation job (curate.mjs) -----------------
    # two simulated weeks: propose -> librarian approves -> cleanup +
    # DX-11 empty digest. Proposals include a blocked alias and a
    # hallucinated one, both of which the guard must drop.
    print("== curation leg")
    CUR = {
        "centerlines": state.seed(LISTS["keywords"], {"Title": "centerlines", "Kind": "topic"}),
        "centerline": state.seed(LISTS["keywords"], {"Title": "centerline", "Kind": "topic"}),
        "rejected": state.seed(LISTS["keywords"], {"Title": "rejected thing", "Kind": "topic",
                                                   "CurationStatus": "Rejected"}),
        "sld": state.seed(LISTS["keywords"], {"Title": "sld", "Kind": "tool",
                                              "CurationStatus": "Proposed",
                                              "ProposedCanonical": "straight line diagram — abbreviation"}),
        "stale": state.seed(LISTS["keywords"], {"Title": "stale approved", "Kind": "topic",
                                                "CanonicalRefLookupId": 1,
                                                "CurationStatus": "Proposed",
                                                "ProposedCanonical": "locks — old"}),
    }
    state.cur_response = {"proposals": [
        {"alias": "centerlines", "canonical": "centerline", "why": "plural of centerline"},
        {"alias": "rejected thing", "canonical": "centerline", "why": "blocked alias"},
        {"alias": "ghost word", "canonical": "centerline", "why": "hallucinated"},
    ]}
    kwrows = state.lists[LISTS["keywords"]]
    proc = run_curate(cfg_path, ["--dry-run"])
    check("curation dry run exit 0", proc.returncode == 0, proc.stderr[-400:])
    check("curation dry run wrote nothing",
          state.digest is None
          and kwrows[CUR["centerlines"]].get("CurationStatus") is None
          and kwrows[CUR["stale"]].get("CurationStatus") == "Proposed")
    proc = run_curate(cfg_path, ["--live"])
    check("curation run exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("curation summary counts",
          "written=1 dropped=2 cleared=1" in out.get("line", ""), str(out))
    check("approved-row cleanup cleared the flow-owned columns",
          not kwrows[CUR["stale"]].get("CurationStatus")
          and not kwrows[CUR["stale"]].get("ProposedCanonical"),
          str(kwrows[CUR["stale"]]))
    req = (state.cur_last_request or {}).get("requestv2", {})
    check("vocabulary lines 'title [kind]', canonical rows only",
          "centerlines [topic]" in req.get("Vocabulary", "")
          and "sld [tool]" in req.get("Vocabulary", "")
          and "stale approved" not in req.get("Vocabulary", ""),
          req.get("Vocabulary", "")[:300])
    check("blocked list carries rejected + pending titles",
          "rejected thing" in req.get("DoNotPropose", "")
          and "sld" in req.get("DoNotPropose", ""), req.get("DoNotPropose", "")[:200])
    check("valid proposal written to the alias row",
          kwrows[CUR["centerlines"]].get("CurationStatus") == "Proposed"
          and str(kwrows[CUR["centerlines"]].get("ProposedCanonical", "")).startswith("centerline — "),
          str(kwrows[CUR["centerlines"]]))
    check("guard dropped the blocked + hallucinated aliases",
          not kwrows[CUR["rejected"]].get("ProposedCanonical"),
          str(kwrows[CUR["rejected"]]))
    digest = state.digest or ""
    check("digest lists the proposal and the pending carryover",
          "- 'centerlines' → 'centerline' — plural of centerline" in digest
          and "(pending) 'sld'" in digest
          and "CurationPromptVersion: v1.0" in digest, digest[:400])
    # week 2: librarian approves both; model proposes nothing
    kwrows[CUR["centerlines"]]["CanonicalRefLookupId"] = int(CUR["centerline"])
    kwrows[CUR["sld"]]["CanonicalRefLookupId"] = 1
    state.cur_response = {"proposals": []}
    proc = run_curate(cfg_path, ["--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("second week clears both approved rows",
          proc.returncode == 0 and "written=0" in out.get("line", "")
          and "cleared=2" in out.get("line", "")
          and not kwrows[CUR["centerlines"]].get("CurationStatus"), str(out))
    check("emptied queue overwrites the digest (DX-11)",
          "queue is EMPTY" in (state.digest or ""), (state.digest or "")[:300])

    # ---- leg 4: anthropic provider, apiKey auth --------------------
    print("== anthropic apiKey leg")
    cfg["llm"] = {"provider": "anthropic", "apiKey": "mock-key",
                  "baseUrl": base, "maxRetries": 0}
    cfg["sweep"]["promptVersion"] = "v2.0-apikey-leg"  # force one reindex
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "notes.txt"])
    check("apiKey run exit 0", proc.returncode == 0, proc.stderr[-600:])
    check("apiKey auth used x-api-key header",
          state.llm_last_headers.get("x-api-key") == "mock-key"
          and not state.llm_last_headers.get("authorization"),
          str(state.llm_last_headers))

    # ---- leg 5: anthropic provider, OAuth (stub `ant` mints token) --
    print("== anthropic oauth leg")
    bin_dir = os.path.join(tmp, "bin")
    os.makedirs(bin_dir, exist_ok=True)
    stub = os.path.join(bin_dir, "ant")
    with open(stub, "w") as f:
        f.write("#!/bin/sh\necho stub-oauth-token\n")
    os.chmod(stub, 0o755)
    cfg["llm"] = {"provider": "anthropic", "auth": "oauth",
                  "baseUrl": base, "maxRetries": 0}
    cfg["sweep"]["promptVersion"] = "v2.0-oauth-leg"
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    env = dict(os.environ, PATH=bin_dir + os.pathsep + os.environ.get("PATH", ""))
    env.pop("ANTHROPIC_AUTH_TOKEN", None)
    proc = subprocess.run(
        ["node", "--experimental-strip-types", SWEEP, "--config", cfg_path,
         "--live", "--only", "notes.txt"],
        capture_output=True, text=True, cwd=REPO, env=env,
    )
    check("oauth run exit 0", proc.returncode == 0, proc.stderr[-600:])
    check("oauth bearer + beta header sent",
          state.llm_last_headers.get("authorization") == "Bearer stub-oauth-token"
          and state.llm_last_headers.get("anthropic-beta") == "oauth-2025-04-20"
          and not state.llm_last_headers.get("x-api-key"),
          str(state.llm_last_headers))

    # ---- leg 6: delegated device-code auth (no app registration) ----
    print("== device auth leg")
    auth_dir = os.path.join(tmp, "auth")
    cfg["graph"] = {
        "auth": "device", "baseUrl": base + "/v1.0",
        "tokenUrl": base + "/token", "deviceUrl": base + "/devicecode",
        "tokenCache": os.path.join(auth_dir, "graph.json"), "maxRetries": 0,
    }
    cfg["llm"] = {
        "provider": "aibuilder", "environmentUrl": base,
        "modelId": "ef04e39d-3775-4655-a8be-60192095c1d6", "maxRetries": 0,
        "dataverse": {
            "auth": "device", "tokenUrl": base + "/token",
            "deviceUrl": base + "/devicecode",
            "tokenCache": os.path.join(auth_dir, "dataverse.json"),
        },
    }
    cfg["spo"] = {
        "auth": "device", "tokenUrl": base + "/token",
        "deviceUrl": base + "/devicecode",
        "tokenCache": os.path.join(auth_dir, "spo.json"),
        "siteUrl": "https://mock.example/sites/lrsworkspace",
        "baseUrl": base + "/sites/lrsworkspace",
    }
    cfg["sweep"]["promptVersion"] = "v2.0-device-leg"
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "notes.txt"])
    check("device run exit 0", proc.returncode == 0, proc.stderr[-600:])
    # graph + dataverse each prompt once; SPO must NOT prompt — same
    # client as Graph, so it seeds from graph.json via a refresh grant
    check("device flow ran for graph+dataverse only (SPO seeded, no 3rd prompt)",
          state.devicecode_hits == 2 and state.device_grants == 2
          and state.refresh_grants >= 1,
          f"devicecode={state.devicecode_hits} grants={state.device_grants} refresh={state.refresh_grants}")
    check("graph write used a delegated token",
          str(state.graph_last_auth) in ("Bearer device-token", "Bearer refreshed-token"),
          str(state.graph_last_auth))
    check("spo write used a seeded (refreshed) token",
          str(state.spo_last_auth) == "Bearer refreshed-token",
          str(state.spo_last_auth))
    check("refresh tokens cached for all resources",
          os.path.exists(os.path.join(auth_dir, "graph.json"))
          and os.path.exists(os.path.join(auth_dir, "dataverse.json"))
          and os.path.exists(os.path.join(auth_dir, "spo.json")))
    # second run: cached refresh token, silent refresh, no new sign-in
    cfg["sweep"]["promptVersion"] = "v2.0-device-leg-2"
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "notes.txt"])
    check("device rerun exit 0", proc.returncode == 0, proc.stderr[-600:])
    check("rerun refreshed silently (no new device prompt)",
          state.devicecode_hits == 2 and state.refresh_grants >= 2,
          f"devicecode={state.devicecode_hits} refresh={state.refresh_grants}")

    # ---- leg 7: dead auth in a scheduled (non-interactive) run ----
    # caches gone + no TTY + prompt not allowed: fail fast and loud
    # instead of waiting 15 min for a sign-in nobody will do, and the
    # fatal path must still surface on the SharePoint status page
    print("== auth fail-fast leg")
    shutil.rmtree(auth_dir)
    hits_before = state.devicecode_hits
    proc = run_sweep(cfg_path, ["--live", "--only", "notes.txt"],
                     env=dict(os.environ, DOCINDEX_ALLOW_DEVICE_PROMPT="0"))
    check("dead-auth scheduled run fails fast", proc.returncode != 0)
    check("dead-auth run says AUTH EXPIRED", "AUTH EXPIRED" in proc.stderr,
          proc.stderr[-400:])
    check("no device prompt was started", state.devicecode_hits == hits_before,
          f"devicecode={state.devicecode_hits} vs {hits_before}")
    status_path = os.path.join(sidecar_dir, "_Sweep Status.md")
    status = open(status_path).read() if os.path.exists(status_path) else ""
    check("fatal run surfaced on the status page",
          "RUN FAILED" in status and "AUTH EXPIRED" in status, status[:300])

    server.shutdown()
    report()


def report():
    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FAILED:", ", ".join(FAIL))
        sys.exit(1)
    print("GATE PASSED")


if __name__ == "__main__":
    main()
