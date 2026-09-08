"""Gate for the local Doc Index sweep (pipeline/sweep.mjs).

Proves the local orchestrator reproduces the flow v2.8 pipeline
end-to-end with the cloud replaced by mocks:

  1. dry-run leg: full compute, zero writes — plan recorded, DocKey
     calibration reported, mock stores untouched
  2. live leg against a mock Graph + mock LLM (stdlib http.server):
     pptx/txt indexed, pdf skipped, corrupt pptx -> Error lane,
     unreadable-on-disk pptx -> Error lane naming the file;
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
import gzip
import json
import os
import re
import shutil
import struct
import subprocess
import urllib.parse
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mock_anthropic as mock  # noqa: E402
import tempfile
import threading
import zipfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
SWEEP = os.path.join(REPO, "pipeline", "sweep.mjs")
# the Doc Index row stamp = v<version> of the classify prompt's front
# matter (sweep.mjs classifyPromptStamp) — seeded rows "at the current
# stamp" and every stamp assertion read it from the file
with open(os.path.join(REPO, "prompts", "docindex_classify.md"), encoding="utf-8") as _f:
    STAMP = "v" + re.search(r"^version:\s*([0-9][^\s]*)\s*$", _f.read(), re.M).group(1)
CURATE = os.path.join(REPO, "pipeline", "curate.mjs")
UNMERGE = os.path.join(REPO, "pipeline", "unmerge.mjs")
DOC_CRAWL = os.path.join(REPO, "pipeline", "doc_crawl.mjs")

PASS = []
FAIL = []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    mark = "ok  " if cond else "FAIL"
    print(f"  {mark} {name}" + ("" if cond else f"  <- {detail}"))


# ---- fixtures -------------------------------------------------------

def _png(w, h):
    """A valid w x h grayscale PNG (zlib-deflated rows); the media
    fixture is 64x64 so the figure index sizes it as an image, not an
    icon (figureindex v1.1 ICON_MAX)."""
    import struct
    import zlib
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    raw = b"".join(b"\x00" + bytes([(x * 4) % 256 for x in range(w)]) for _ in range(h))
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 0, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b""))


PNG = _png(64, 64)
ICON = _png(16, 16)

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


def make_pptx(fpath, text, with_media=False, with_case=False):
    with zipfile.ZipFile(fpath, "w", zipfile.ZIP_DEFLATED) as z:
        embed = '<p:pic><a:blip r:embed="rId2"/></p:pic>' if with_media else ""
        z.writestr(
            "ppt/slides/slide1.xml",
            "<p:sld><p:cSld><p:spTree><p:sp><p:txBody>"
            f"<a:p><a:r><a:t>{text}</a:t></a:r></a:p>"
            f"</p:txBody></p:sp>{embed}</p:spTree></p:cSld></p:sld>",
        )
        if with_case:
            # one case slide in the corpus's own shape (classification
            # line + ONE numbered case line) — the case-index legs read
            # the Test Cases row the sweep mints from it. Planted into
            # an existing fixture so no count-based assertion moves.
            z.writestr(
                "ppt/slides/slide2.xml",
                "<p:sld><p:cSld><p:spTree><p:sp><p:txBody>"
                "<a:p><a:r><a:t>Positive - Line network</a:t></a:r></a:p>"
                "<a:p><a:r><a:t>3. Loop route – Split measure : 40 "
                "using Merge Events</a:t></a:r></a:p>"
                "</p:txBody></p:sp></p:spTree></p:cSld></p:sld>",
            )
            # a checklist slide (2+ numbered verifications, not a case) and
            # a LONG negative case line (the heading must take a short
            # scenario title; the full text rides as the Case line) — the
            # case-grammar legs (Sidecar_Format_Plan phase 3) read these
            z.writestr(
                "ppt/slides/slide3.xml",
                "<p:sld><p:cSld><p:spTree><p:sp><p:txBody>"
                "<a:p><a:r><a:t>17. Verify the effective date defaults to today</a:t></a:r></a:p>"
                "<a:p><a:r><a:t>18. Verify route information is shown on hover</a:t></a:r></a:p>"
                "</p:txBody></p:sp></p:spTree></p:cSld></p:sld>",
            )
            z.writestr(
                "ppt/slides/slide4.xml",
                "<p:sld><p:cSld><p:spTree><p:sp><p:txBody>"
                "<a:p><a:r><a:t>Negative - Merge option disabled</a:t></a:r></a:p>"
                "<a:p><a:r><a:t>9. Merge Option disabled, coincident events that have "
                "exact attributes from measures 0-4 and exist in both versions</a:t></a:r></a:p>"
                "<a:p><a:r><a:t>current date: 3/29/2022</a:t></a:r></a:p>"
                "</p:txBody></p:sp></p:spTree></p:cSld></p:sld>",
            )
        if with_case:
            # a DRAWING slide (v1.61 / ShapeExtract): four filled boxes with
            # one-word labels and one connector glued R1 -> Split. The
            # extractor collapses the labels into "[figure: R1 · R2 · Split
            # · Merge]"; ShapeExtract renders the boxes + arrow as an SVG
            # and reports the glued connection
            def box(i, x, text, fill):
                return ('<p:sp><p:nvSpPr><p:cNvPr id="%d" name="%s"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>'
                        '<p:spPr><a:xfrm><a:off x="%d" y="2743200"/><a:ext cx="914400" cy="548640"/></a:xfrm>'
                        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="%s"/></a:solidFill></p:spPr>'
                        '<p:txBody><a:bodyPr anchor="ctr"/><a:p><a:pPr algn="ctr"/><a:r><a:t>%s</a:t></a:r></a:p></p:txBody></p:sp>'
                        % (i, text, x, fill, text))
            z.writestr(
                "ppt/slides/slide5.xml",
                "<p:sld><p:cSld><p:spTree>"
                + box(3, 914400, "R1", "1F4E79") + box(4, 914400 * 3, "R2", "1F4E79")
                + box(5, 914400 * 5, "Split", "ED7D31") + box(6, 914400 * 7, "Merge", "ED7D31")
                + '<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="7" name="Arrow"/><p:cNvCxnSpPr>'
                  '<a:stCxn id="3" idx="3"/><a:endCxn id="5" idx="1"/></p:cNvCxnSpPr><p:nvPr/></p:nvCxnSpPr>'
                  '<p:spPr><a:xfrm><a:off x="1828800" y="3017520"/><a:ext cx="2743200" cy="0"/></a:xfrm>'
                  '<a:prstGeom prst="straightConnector1"><a:avLst/></a:prstGeom>'
                  '<a:ln w="12700"><a:solidFill><a:srgbClr val="C00000"/></a:solidFill><a:tailEnd type="triangle"/></a:ln></p:spPr></p:cxnSp>'
                + "</p:spTree></p:cSld></p:sld>",
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


def make_messy_pptx(fpath, text):
    """Six slides: three carrying every mess tidyBody must clean
    (slide-number placeholder lines, padded/nested bullets, a notes part
    holding nothing but the slide number), plus a test-case slide and a
    numbered checklist slide exercising caseHeadings (v1.25 TC-1 /
    v1.29 TC-3): the case slide's heading must carry its case number +
    classification with the scenario as an H3 and the specifics kept in
    the body, the checklist slide's must stay "## Slide 5"."""
    def para(t, lvl=None, bullet=False):
        ppr = ""
        if lvl is not None:
            ppr = f'<a:pPr lvl="{lvl}"><a:buChar char="-"/></a:pPr>'
        elif bullet:
            ppr = '<a:pPr><a:buChar char="-"/></a:pPr>'
        return f"<a:p>{ppr}<a:r><a:t>{t}</a:t></a:r></a:p>"

    def slide(paras):
        return ("<p:sld><p:cSld><p:spTree><p:sp><p:txBody>"
                + "".join(paras) + "</p:txBody></p:sp></p:spTree></p:cSld></p:sld>")

    with zipfile.ZipFile(fpath, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("ppt/slides/slide1.xml", slide([
            para(text), para("1"),
        ]))
        z.writestr("ppt/slides/slide2.xml", slide([
            para("Scope of testing"),
            para("These GP tools support 64-bit values", bullet=True),
            para("          use existing 64bit FC", lvl=1),
            para("Create LRS from existing dataset", lvl=1),
            para("Append Events", lvl=1),
            para("2"),
        ]))
        z.writestr("ppt/slides/slide3.xml", slide([para("Verification"), para("3")]))
        # a case slide the way the test-plan decks draw them: one
        # classification line, ONE numbered case line, a current-date line
        z.writestr("ppt/slides/slide4.xml", slide([
            para("Positive - Non spanning line event"),
            para("2. Loop – Split measure : 20"),
            para("current date: 3/29/2022"),
        ]))
        # a checklist slide: 2+ numbered lines mean verifications, not a case
        z.writestr("ppt/slides/slide5.xml", slide([
            para("17. Verify the effective date defaults to today"),
            para("18. Verify route information is shown on hover"),
        ]))
        # a LONG case line (v1.27 TC-2): the heading must take a short title
        # cut at the phrase break, and the full text must survive as a bold
        # subheader line — never truncate mid-sentence into the heading
        z.writestr("ppt/slides/slide6.xml", slide([
            para("Negative - Merge option disabled"),
            para("9. Merge Option disabled, coincident events that have "
                 "exact attributes from measures 0-4 and exist in both versions"),
            para("current date: 3/29/2022"),
        ]))
        # notes for slide 3 hold only the slide number
        z.writestr("ppt/slides/_rels/slide3.xml.rels",
                   '<Relationships><Relationship Id="rId1" '
                   'Type="http://schemas.openxmlformats.org/officeDocument/2006/'
                   'relationships/notesSlide" Target="../notesSlides/notesSlide1.xml"/>'
                   "</Relationships>")
        z.writestr("ppt/notesSlides/notesSlide1.xml",
                   "<p:notes><p:cSld><p:spTree><p:sp><p:txBody>"
                   "<a:p><a:r><a:t>3</a:t></a:r></a:p>"
                   "</p:txBody></p:sp></p:spTree></p:cSld></p:notes>")
        z.writestr("docProps/core.xml", CORE_XML)


def make_story_pptx(fpath, text):
    """A story deck in the team template (Sidecar_Format_Plan phase 5):
    title placeholders name the slides — User Story, a feature slide,
    Testing, Automation, Documentation, Assignment — so the sweep maps
    them onto the story/v1 sections."""
    def slide(title, paras):
        ttl = ("<p:sp><p:nvSpPr><p:cNvPr id=\"2\" name=\"Title\"/><p:cNvSpPr/>"
               "<p:nvPr><p:ph type=\"title\"/></p:nvPr></p:nvSpPr><p:txBody>"
               f"<a:p><a:r><a:t>{title}</a:t></a:r></a:p></p:txBody></p:sp>")
        body = "".join(f"<a:p><a:r><a:t>{t}</a:t></a:r></a:p>" for t in paras)
        return ("<p:sld><p:cSld><p:spTree>" + ttl + "<p:sp><p:txBody>" + body +
                "</p:txBody></p:sp></p:spTree></p:cSld></p:sld>")
    with zipfile.ZipFile(fpath, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("ppt/slides/slide1.xml", slide(text, ["User Story"]))
        z.writestr("ppt/slides/slide2.xml", slide("User Story", [
            "As a LRS editor, I want to split events at a measure so that records stay accurate."]))
        z.writestr("ppt/slides/slide3.xml", slide("Split behaviour", [
            "Splitting at a measure creates two events with the same attributes."]))
        z.writestr("ppt/slides/slide4.xml", slide("Testing", ["Test on normal and gapped routes."]))
        z.writestr("ppt/slides/slide5.xml", slide("Automation", ["Add to the split-events automation."]))
        z.writestr("ppt/slides/slide6.xml", slide("Documentation", ["Update the split events topic."]))
        z.writestr("ppt/slides/slide7.xml", slide("Assignment", ["Story Points: 3", "Dev: Ada"]))
        z.writestr("docProps/core.xml", CORE_XML)


# ---- mock Graph + LLM server ---------------------------------------

class MockState:
    def __init__(self):
        self.gen_text = ""           # --normalize-cases: the streamed reply
        self.gen_prompts = []
        self.next_id = 100
        # list GUID -> {item_id(str) -> fields dict}
        self.lists = {}
        self.llm_by_file = {}
        self.llm_calls = 0
        self.llm_files = []
        self.llm_last_headers = {}
        self.llm_last_request = {}
        self.devicecode_hits = 0
        self.authorize_hits = 0
        self.code_grants = 0
        self.last_pkce = None
        self.device_grants = 0
        self.refresh_grants = 0
        self.digest = None
        self.cur_last_request = None
        self.cur_response = {"proposals": []}
        self.cur_calls = 0
        self.probe_paths = []
        self.graph_last_auth = None
        self.spo_last_auth = None
        self.alerts = []
        self.content_downloads = []
        self.content_bytes = {}      # item id -> bytes served by the content fallback
        self.reject_fields = set()   # list columns the mock tenant "does not have"
        self.spo_calls = 0           # ValidateUpdateListItem calls (hyperlink-column writes)
        self.spo_throttle = 0        # answer this many SPO calls with 429 + Retry-After first
        # remote-files mode: the sidecar drive, rel path -> {content, etag}
        self.remote_files = {}
        self.drive_put_fail = 0       # answer this many sidecar-drive PUTs with 503 first
        self.drive_downloads = []
        self.next_etag = 1

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

        def do_GET_authorize(self, q):
            """Entra's authorize endpoint: bounce back to the loopback
            redirect with a code, exactly as a real sign-in would."""
            state.authorize_hits += 1
            state.last_pkce = {
                "challenge": (q.get("code_challenge") or [""])[0],
                "method": (q.get("code_challenge_method") or [""])[0],
                "redirect": (q.get("redirect_uri") or [""])[0],
            }
            target = (q.get("redirect_uri") or [""])[0]
            st = (q.get("state") or [""])[0]
            self.send_response(302)
            self.send_header("Location", f"{target}?code=mock-auth-code&state={st}")
            self.end_headers()

        def do_POST(self):
            p = urlparse(self.path).path
            if p == "/alert":
                # incoming-webhook stand-in: record the alert payload
                state.alerts.append(json.loads(self._read() or b"{}"))
                return self._json({"ok": True})
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
                if "authorization_code" in body:
                    state.code_grants += 1
                    if "code_verifier=" not in body:
                        return self._json({"error": "invalid_grant",
                                           "error_description": "PKCE verifier missing"}, 400)
                    return self._json({"access_token": "device-token",
                                       "refresh_token": "mock-rt", "expires_in": 30})
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
                state.llm_last_headers = {
                    "authorization": self.headers.get("authorization"),
                    "x-api-key": self.headers.get("x-api-key"),
                    "anthropic-beta": self.headers.get("anthropic-beta"),
                }
                prompt = mock.prompt_text(body)   # system blocks + the user turn
                user = mock.user_text(body)
                if body.get("stream"):
                    # the generate task streams (the --normalize-cases
                    # lane): serve the leg's gen_text as a real SSE stream
                    state.llm_calls += 1
                    state.gen_prompts.append(prompt)
                    payload = mock.sse_bytes(state.gen_text)
                    self.send_response(200)
                    self.send_header("content-type", "text/event-stream")
                    self.send_header("content-length", str(len(payload)))
                    self.end_headers()
                    self.wfile.write(payload)
                    return
                # the curation prompt is schema-pinned on {proposals}
                # (prompts/schemas/keyword_curation.json) — route by it
                schema = ((body.get("output_config") or {}).get("format") or {}).get("schema") or {}
                if "proposals" in (schema.get("properties") or {}):
                    state.cur_calls += 1
                    state.cur_last_request = body
                    return self._json(mock.message_json(json.dumps(state.cur_response)))
                # the classify prompt: File name: <name> in the user turn
                state.llm_calls += 1
                state.llm_last_request = body
                fm = re.search(r"^File name: (.*)$", user, re.M)
                fname_in = fm.group(1).strip() if fm else ""
                state.llm_files.append(fname_in)
                out = self._classify(lambda fname: fname == fname_in)
                # sentinel: the model refusing the document — a real
                # stop_reason: refusal reply, no text
                if out.get("__filtered__"):
                    return self._json(mock.message_json("", stop_reason="refusal"))
                return self._json(mock.message_json(json.dumps(out)))
            # SPO ValidateUpdateListItem — hyperlink-column writes
            m = re.match(r"^/sites/lrsworkspace/_api/web/lists\(guid'([^']+)'\)/items\((-?\d+)\)/ValidateUpdateListItem$", p)
            if m:
                guid, iid = m.group(1), m.group(2)
                state.spo_last_auth = self.headers.get("authorization")
                state.spo_calls += 1
                body = json.loads(self._read())
                if state.spo_throttle > 0:
                    # SharePoint's throttle shape: 429 + Retry-After
                    state.spo_throttle -= 1
                    payload = b'{"error":"429 TOO MANY REQUESTS"}'
                    self.send_response(429)
                    self.send_header("Retry-After", "1")
                    self.send_header("content-type", "application/json")
                    self.send_header("content-length", str(len(payload)))
                    self.end_headers()
                    self.wfile.write(payload)
                    return
                row = state.lists.setdefault(guid, {}).setdefault(iid, {})
                out = []
                for fv in body.get("formValues", []):
                    name, val = fv.get("FieldName"), str(fv.get("FieldValue", ""))
                    if name in state.reject_fields:
                        # the tenant list lacks the hyperlink column: the REST
                        # route answers 200 with a per-field error
                        out.append({"FieldName": name, "ErrorMessage": f"The field '{name}' does not exist"})
                        continue
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
                bad = [k for k in fields if k in state.reject_fields]
                if bad:
                    # the tenant list lacks the column — Graph's exact shape
                    return self._json({"error": {"code": "invalidRequest",
                                                 "message": f"Field '{bad[0]}' is not recognized"}}, 400)
                if any(k in fields for k in ("SourceLink", "TextFileUrl", "FigureLink", "ImageLink")):
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
            p = unquote(urlparse(self.path).path)
            # Graph drive upload — the curation digest lands in the
            # site's default drive (Shared Documents), never a list
            if re.match(r"^/v1\.0/sites/[^/]+/drive/root:/.+:/content$", p):
                state.digest = self._read().decode()
                return self._json({"id": "digest"})
            # sidecar drive write-through (remote-files mode)
            m = re.match(r"^/v1\.0/drives/drive-sidecar/root:/(.+):/content$", p)
            if m:
                if state.drive_put_fail > 0:
                    state.drive_put_fail -= 1
                    self._read()
                    return self._json({"error": {"code": "serviceNotAvailable"}}, 503)
                etag = f"et{state.next_etag}"
                state.next_etag += 1
                state.remote_files[m.group(1)] = {"content": self._read(), "etag": etag}
                return self._json({"id": "up-" + m.group(1), "eTag": etag}, 201)
            return self._json({"error": "unhandled PUT " + p}, 500)

        def do_DELETE(self):
            dm = re.match(r"^/v1\.0/drives/drive-sidecar/root:/(.+):$",
                          unquote(urlparse(self.path).path))
            if dm:
                state.remote_files.pop(dm.group(1), None)
                self.send_response(204)
                self.send_header("content-length", "0")
                self.end_headers()
                return
            m = re.match(r"^/v1\.0/sites/[^/]+/lists/([^/]+)/items/(-?\d+)$",
                         urlparse(self.path).path)
            if m and m.group(2) in state.lists.get(m.group(1), {}):
                del state.lists[m.group(1)][m.group(2)]
                self.send_response(204)
                self.send_header("content-length", "0")
                self.end_headers()
                return
            return self._json({"error": "unhandled DELETE " + self.path}, 500)

        def do_PATCH(self):
            m = re.match(r"^/v1\.0/sites/[^/]+/lists/([^/]+)/items/(-?\d+)/fields$", urlparse(self.path).path)
            if m:
                guid, iid = m.group(1), m.group(2)
                state.graph_last_auth = self.headers.get("authorization")
                patch = json.loads(self._read())
                bad = [k for k in patch if k in state.reject_fields]
                if bad:
                    return self._json({"error": {"code": "invalidRequest",
                                                 "message": f"Field '{bad[0]}' is not recognized"}}, 400)
                state.lists.setdefault(guid, {}).setdefault(iid, {}).update(patch)
                return self._json({"id": iid})
            return self._json({"error": "unhandled PATCH " + self.path}, 500)

        def _bytes(self, body, ctype="application/octet-stream"):
            self.send_response(200)
            self.send_header("content-type", ctype)
            self.send_header("content-length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            p = unquote(urlparse(self.path).path)
            if p == "/authorize":
                return self.do_GET_authorize(parse_qs(urlparse(self.path).query))
            # ---- sidecar drive (remote-files mode) ----
            if re.match(r"^/v1\.0/sites/[^/]+/drives$", p):
                return self._json({"value": [
                    {"id": "drive-sidecar", "name": "LRS Doc Index"},
                    {"id": "drive-default", "name": "Documents"}]})
            if p == "/v1.0/drives/drive-sidecar/root/delta":
                items = []
                for i, (rel, rec) in enumerate(sorted(state.remote_files.items())):
                    d, _, n = rel.rpartition("/")
                    items.append({
                        "id": f"rf{i}", "name": n, "eTag": rec["etag"],
                        "size": len(rec["content"]), "file": {},
                        "parentReference": {
                            "path": "/drives/drive-sidecar/root:" + ("/" + d if d else "")},
                    })
                return self._json({"value": items})
            m = re.match(r"^/v1\.0/drives/drive-sidecar/root:/(.+):/content$", p)
            if m:
                rec = state.remote_files.get(m.group(1))
                if rec is None:
                    return self._json({"error": "not found"}, 404)
                state.drive_downloads.append(m.group(1))
                return self._bytes(rec["content"])
            # library file bytes via the list item's driveItem — the
            # sweep's OneDrive-sync-lag fallback (real Graph 302s to a
            # download URL; serving bytes directly is equivalent since
            # fetch follows redirects)
            m = re.match(r"^/v1\.0/sites/[^/]+/lists/([^/]+)/items/(\d+)/driveItem/content$", p)
            if m:
                state.content_downloads.append(m.group(2))
                # a leg may register the real bytes for an item (the
                # reformat-fallback leg serves the moved-aside deck)
                if m.group(2) in state.content_bytes:
                    body = state.content_bytes[m.group(2)]
                else:
                    body = (f"Downloaded content for item {m.group(2)} fetched "
                            "via the Graph fallback, about calibration.").encode()
                self.send_response(200)
                self.send_header("content-type", "application/octet-stream")
                self.send_header("content-length", str(len(body)))
                self.end_headers()
                return self.wfile.write(body)
            # doc-link probing: realign-route exists, everything else 404s
            if p.startswith("/docs/"):
                state.probe_paths.append(p)
                if p == "/docs/realign-route.html":
                    return self._json({"page": "ok"})
                return self._json({"error": "not found"}, 404)
            # doc_crawl fixtures: /docsec/ is sitemap-covered,
            # /docsec2/ is only discoverable by crawling
            if p == "/sitemap.xml":
                base_ = "http://" + self.headers.get("host", "")
                body = ("<urlset><loc>%s/docsec/a.html</loc>"
                        "<loc>%s/docsec/b.html</loc>"
                        "<loc>%s/other/z.html</loc></urlset>") % (base_, base_, base_)
                enc = body.encode()
                self.send_response(200)
                self.send_header("content-type", "text/xml")
                self.send_header("content-length", str(len(enc)))
                self.end_headers()
                return self.wfile.write(enc)
            crawl_pages = {
                "/docsec2/": '<a href="x.html">x</a> <a href="/docsec2/y.html">y</a>'
                             ' <a href="https://elsewhere.example/n.html">out</a>',
                "/docsec2/x.html": '<title>Page X | ArcGIS Pro documentation</title>'
                                   '<a href="y.html#f">y</a> <a href="../escape.html">esc</a>',
                "/docsec2/y.html": "<title>Page Y</title><p>leaf</p>",
            }
            if p in crawl_pages:
                enc = crawl_pages[p].encode()
                self.send_response(200)
                self.send_header("content-type", "text/html")
                self.send_header("content-length", str(len(enc)))
                self.end_headers()
                return self.wfile.write(enc)
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
    "issueRefs": "list-issuerefs",
    "testCases": "list-testcases",
    "figures": "list-figures",
}

GANTT = os.path.join(REPO, "pipeline", "gantt.mjs")

FREE, END, FATSECT = 0xFFFFFFFF, 0xFFFFFFFE, 0xFFFFFFFD


def make_msg(path, subject, sender, to, body_text, sent_unix_ms):
    """Minimal valid CFB .msg (v3, 512B sectors): small streams in the
    mini stream, the UTF-16 body (>4096 bytes) in regular sectors, and
    an attachment sub-storage whose identically-named body stream the
    parser must NOT leak into the message body."""
    import struct

    def u16(s):
        return s.encode("utf-16-le")

    filetime = int((sent_unix_ms + 11644473600000) * 10000)
    props = b"\x00" * 32 + struct.pack("<HHIq", 0x0040, 0x0039, 0, filetime)
    small = [
        ("__properties_version1.0", props),
        ("__substg1.0_0037001F", u16(subject)),
        ("__substg1.0_0C1A001F", u16(sender)),
        ("__substg1.0_0E04001F", u16(to)),
    ]
    att_sub = ("__substg1.0_1000001F", u16("ATTACH BODY MUST NOT LEAK"))
    body = u16(body_text)
    assert len(body) >= 4096, "body must exercise the regular-sector path"

    mini_chunks, mini_starts = [], []
    for _, data in small + [att_sub]:
        assert len(data) <= 64
        mini_starts.append(len(mini_chunks))
        mini_chunks.append(data + b"\x00" * (64 - len(data)))
    mini_stream = b"".join(mini_chunks)

    body_sectors = (len(body) + 511) // 512
    BODY0 = 5  # sectors: 0 FAT, 1-2 directory, 3 miniFAT, 4 mini stream
    fat = [FREE] * 128
    fat[0] = FATSECT
    fat[1], fat[2], fat[3], fat[4] = 2, END, END, END
    for i in range(body_sectors):
        fat[BODY0 + i] = BODY0 + i + 1 if i < body_sectors - 1 else END
    minifat = [END] * len(mini_chunks) + [FREE] * (128 - len(mini_chunks))

    def dirent(name, typ, left, right, child, start, size):
        nb = u16(name)
        return (nb + b"\x00" * (64 - len(nb))
                + struct.pack("<HBBiii", len(nb) + 2, typ, 1, left, right, child)
                + b"\x00" * 36  # clsid + state bits + times (80-115)
                + struct.pack("<III", start, size, 0))  # 116-127

    ents = [
        dirent("Root Entry", 5, -1, -1, 1, 4, len(mini_stream)),
        dirent(small[0][0], 2, -1, 2, -1, mini_starts[0], len(small[0][1])),
        dirent(small[1][0], 2, -1, 3, -1, mini_starts[1], len(small[1][1])),
        dirent(small[2][0], 2, -1, 4, -1, mini_starts[2], len(small[2][1])),
        dirent(small[3][0], 2, -1, 5, -1, mini_starts[3], len(small[3][1])),
        dirent("__substg1.0_1000001F", 2, -1, 6, -1, BODY0, len(body)),
        dirent("__attach_version1.0_#00000000", 1, -1, -1, 7, 0, 0),
        dirent(att_sub[0], 2, -1, -1, -1, mini_starts[4], len(att_sub[1])),
    ]
    dirbuf = b"".join(ents).ljust(1024, b"\x00")

    header = (b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1" + b"\x00" * 16
              + struct.pack("<HHHHHHIIIIIIIII",
                            0x3E, 0x3, 0xFFFE, 9, 6, 0, 0,
                            0, 1, 1, 0, 4096, 3, 1, END)
              + struct.pack("<I", 0)
              + struct.pack("<I", 0) + struct.pack("<I", FREE) * 108)
    assert len(header) == 512

    out = bytearray(header)
    out += b"".join(struct.pack("<I", v) for v in fat)
    out += dirbuf
    out += b"".join(struct.pack("<I", v) for v in minifat)
    out += mini_stream.ljust(512, b"\x00")
    out += body.ljust(body_sectors * 512, b"\x00")
    with open(path, "wb") as f:
        f.write(out)


def make_gantt_xlsx(fpath):
    """Two iteration sheets the way the team's schedules are shaped:
    a header row (issue/title/PE/Dev/status/done), one row per story.
    Sheet 2 re-states issue 123 with a changed status — the upsert's
    last-write-wins path — and is deliberately awkward: a 12-row
    banner block above the header (past the original 10-row scan) and
    the "User Story # / User Story" column vocabulary, so the header
    tolerance added after the first real-corpus run (0 rows parsed)
    stays gated."""
    def cell(ref, text):
        return f'<c r="{ref}" t="str"><v>{text}</v></c>' if text else ""

    def sheet(rows):
        body = "".join(
            f'<row r="{i + 1}">' + "".join(
                cell(chr(65 + c) + str(i + 1), v) for c, v in enumerate(row) if v
            ) + "</row>"
            for i, row in enumerate(rows)
        )
        return f"<worksheet><sheetData>{body}</sheetData></worksheet>"

    head = ["Issue #", "Title", "PE", "Dev", "TP Status", "Done?"]
    with zipfile.ZipFile(fpath, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(
            "xl/workbook.xml",
            '<workbook><sheets>'
            '<sheet name="Iteration 2" sheetId="1" r:id="rId1"/>'
            '<sheet name="Iteration 3" sheetId="2" r:id="rId2"/>'
            "</sheets></workbook>")
        z.writestr(
            "xl/_rels/workbook.xml.rels",
            '<Relationships>'
            '<Relationship Id="rId1" Type="t" Target="worksheets/sheet1.xml"/>'
            '<Relationship Id="rId2" Type="t" Target="worksheets/sheet2.xml"/>'
            "</Relationships>")
        z.writestr("xl/worksheets/sheet1.xml", sheet([
            head,
            ["#123", "Lock acquisition rework", "Claire Wang", "Dev One", "Completed", "Yes"],
            ["456", "Beta Story", "", "", "In Progress", ""],
            ["", "A milestone row with no issue", "", "", "", ""],
        ]))
        z.writestr("xl/worksheets/sheet2.xml", sheet(
            [["Iteration 3 planning board", "", "", "", "", ""]]
            + [["", "", "", "", "", ""]] * 11
            + [["User Story #", "User Story", "PE", "Dev", "TP Status", "Done?"],
               ["123", "Lock acquisition rework", "Claire Wang", "Dev One", "Testing", "Yes"]]))


# Every child here is a node job driven by the mock Graph/LLM server, so
# it should finish in seconds. Two things used to let one hang the whole
# gate with no output and no way to tell what it was waiting on:
#
#   - no timeout, so a child stuck on a network read (an egress proxy
#     that stalls a request instead of refusing it) blocked forever;
#   - capture_output=True redirects stdout/stderr but NOT stdin, so a
#     child that reached an interactive prompt — the device-code sign-in
#     the DOCINDEX_ALLOW_DEVICE_PROMPT legs deliberately allow — sat on
#     the gate's own stdin waiting for a human who is not there.
#
# run_node() closes both holes: stdin is /dev/null, so a prompt reads
# EOF and the job fails fast, and a job that overruns GATE_TIMEOUT
# (default 300s, raise it with the env var on a slow machine) comes back
# as an ordinary non-zero result whose stderr names the timeout, so the
# leg that ran it FAILS with its own name instead of hanging.
GATE_TIMEOUT = int(os.environ.get("GATE_TIMEOUT", "300"))


def run_node(args, **kw):
    kw.setdefault("capture_output", True)
    kw.setdefault("text", True)
    kw.setdefault("cwd", REPO)
    kw["stdin"] = subprocess.DEVNULL
    try:
        return subprocess.run(args, timeout=GATE_TIMEOUT, **kw)
    except subprocess.TimeoutExpired as e:
        out = e.stdout or ""
        err = e.stderr or ""
        if isinstance(out, bytes):
            out = out.decode("utf-8", "replace")
        if isinstance(err, bytes):
            err = err.decode("utf-8", "replace")
        return subprocess.CompletedProcess(
            args, 124, out,
            f"{err}\nGATE TIMEOUT: {' '.join(str(a) for a in args)} exceeded "
            f"{GATE_TIMEOUT}s (raise GATE_TIMEOUT= to allow longer)")


def run_curate(cfg_path, extra):
    return run_node(
        ["node", "--experimental-strip-types", CURATE, "--config", cfg_path] + extra,
        env=dict(os.environ, DOCINDEX_ALLOW_DEVICE_PROMPT="1"),
    )


def run_unmerge(cfg_path, extra):
    return run_node(
        ["node", "--experimental-strip-types", UNMERGE, "--config", cfg_path] + extra,
        env=dict(os.environ, DOCINDEX_ALLOW_DEVICE_PROMPT="1"),
    )


def run_sweep(cfg_path, extra, env=None, env_extra=None):
    # captured output means no TTY: allow the mock device prompt except
    # where a leg deliberately tests the non-interactive fail-fast
    e = dict(env if env is not None else os.environ)
    e.setdefault("DOCINDEX_ALLOW_DEVICE_PROMPT", "1")
    if env_extra:
        e.update(env_extra)
    return run_node(
        ["node", "--experimental-strip-types", SWEEP, "--config", cfg_path] + extra,
        env=e,
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
              "Alpha test plan covering lock acquisition #123 for Roads and Highways",
              with_media=True, with_case=True)
    make_messy_pptx(os.path.join(src_dir, "Beta Story.pptx"),
                    "Beta user story about locks and issue #123")
    with open(os.path.join(src_dir, "notes.txt"), "w") as f:
        # the body carries a horizontal rule after the vocabulary spec.pdf
        # shares: the body index must read the WHOLE body (the seam is
        # the one after the related region, not the last `---` in the file)
        f.write("Plain text notes about calibration points.\n\n---\n\nAppendix: unrelated closing remark.")
    with open(os.path.join(src_dir, "spec.pdf"), "wb") as f:
        f.write(b"%PDF-1.4 text-bearing (stub pdftotext returns text for this one)")
    with open(os.path.join(src_dir, "scan.pdf"), "wb") as f:
        f.write(b"%PDF-1.4 image-only (stub pdftotext returns nothing)")
    with open(os.path.join(src_dir, "corrupt.pptx"), "wb") as f:
        f.write(b"this is not a zip archive")
    # a source that exists on disk but cannot be read (sweep v1.64): on
    # the real library this is a OneDrive Files On-Demand placeholder
    # that fails to hydrate — existsSync/statSync succeed, every read
    # fails with a path-less `UNKNOWN: unknown error, read`. A directory
    # wearing the file's name reproduces that shape on any OS (EISDIR).
    os.makedirs(os.path.join(src_dir, "locked.pptx"))
    with open(os.path.join(src_dir, "guide.html"), "w") as f:
        f.write("<html><head><title>x</title><script>var sneaky=1;</script>"
                "<style>p{color:red}</style></head><body>"
                "<h1>Onboarding &amp; Setup</h1>"
                "<p>Guide about onboarding new hires.</p></body></html>")
    # a doc whose text the model refuses (v1.28): extraction succeeds,
    # the classify call ends with stop_reason: refusal — deterministically,
    # so it must stamp Skipped (no nightly rechurn, no re-burned AI
    # call), not Error
    with open(os.path.join(src_dir, "filtered.txt"), "w") as f:
        f.write("Model instructions the moderation endpoint refuses to read.")

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
        src_item(20, "filtered.txt", "2026-08-03T10:00:00Z"),
        src_item(21, "locked.pptx", "2026-08-02T10:00:00Z"),
    ]

    state = MockState()
    # seeded canonical keyword — sweeps must reuse it, not re-mint
    state.seed(LISTS["keywords"], {"Title": "locks", "Kind": "topic"})
    # run-start vocabulary for the case-tag legs (caseindex v1.2):
    # the tool alpha's case slide names, and a topic in its case text
    state.seed(LISTS["keywords"], {"Title": "merge events", "Kind": "tool"})
    state.seed(LISTS["keywords"], {"Title": "split measure", "Kind": "topic"})
    # spec.pdf pre-stamped Skipped at the CURRENT PromptVersion with no
    # extraction attempt — exactly the tenant state the backfill leaves
    # PDFs in; only the PDF-rescue gate can reprocess it (SourceModified
    # matches the library, so no modified/promptVersion trigger)
    state.seed(LISTS["docIndex"], {
        "Title": "spec.pdf", "FileName": "spec.pdf",
        "DocKey": "shared documents/general/spec.pdf", "IndexStatus": "Skipped",
        "SourceModified": "2026-08-10T10:00:00Z", "PromptVersion": STAMP,
        "ExtractionLane": "none",
    })
    # ghost: an Indexed row whose source doc no longer exists in the
    # library, with a stale sidecar on disk — reconciliation must
    # archive the row and prune the sidecar
    ghost_sc = os.path.join(sidecar_dir, "Test Plans", "Ghost Doc.md")
    os.makedirs(os.path.dirname(ghost_sc), exist_ok=True)
    with open(ghost_sc, "w") as f:
        f.write("# Ghost Doc\nstale sidecar\n")
    ghost_media = os.path.join(sidecar_dir, "media", "Ghost Doc")
    os.makedirs(ghost_media, exist_ok=True)
    with open(os.path.join(ghost_media, "fig-01.png"), "wb") as f:
        f.write(b"\x89PNG stale")
    ghost_row_id = state.seed(LISTS["docIndex"], {
        "Title": "Ghost Doc", "FileName": "Ghost Doc.pptx",
        "DocKey": "shared documents/ghost doc.pptx", "IndexStatus": "Indexed",
        "SourceModified": "2026-08-01T10:00:00Z", "PromptVersion": STAMP,
        "TextFileUrl": {"Url": "https://mock.example/sites/lrsworkspace/LRS Doc Index/Test Plans/Ghost Doc.md",
                        "Description": "Ghost Doc.md"},
    })
    # a case row the ghost doc left behind — the archive pass must
    # prune it with the sidecar (case rows are derived state)
    state.seed(LISTS["testCases"], {
        "Title": "Ghost case", "DocumentLookupId": int(ghost_row_id),
        "CaseKey": f"{ghost_row_id}|1", "Classification": "Positive",
    })
    # ... and a figure row (figure rows are derived state too)
    state.seed(LISTS["figures"], {
        "Title": "Ghost figure", "DocumentLookupId": int(ghost_row_id),
        "FigureKey": f"{ghost_row_id}|1", "Kind": "image",
    })
    state.llm_by_file = {
        "Alpha Plan.pptx": {
            "title": "Alpha Plan", "docKind": "Test Plan", "surface": "Pro",
            "summary": "Covers lock acquisition.", "pe": "Claire Wang", "dev": "",
            "targetRelease": "3.8",
            "tools": ["Reassign Routes", "Add Point Events", "Realign Route", "extend route tool"],
            # "offset" and "referent" both resolve to the SAME page
            # (the live bug) — the block must merge, not duplicate.
            # "calibration point" matches two pages equally — the
            # ambiguity guard must drop it rather than pick one.
            "keywords": ["locks", "acquisition", "offset", "referent",
                         "calibration point"]},
        "Beta Story.pptx": {
            "title": "Beta Story", "docKind": "User Story", "surface": "Pro",
            "summary": "A story about locks.", "pe": "", "dev": "",
            "targetRelease": "", "tools": [], "keywords": ["locks"]},
        "filtered.txt": {"__filtered__": True},
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

    # doc-links file: repo copy with probing pointed at the mock —
    # the gate must never touch real doc.esri.com
    with open(os.path.join(REPO, "pipeline", "data", "esri_doc_links.json")) as f:
        dl = json.load(f)
    dl["probeTemplates"] = [{"url": base + "/docs/{slug}.html"}]
    doclinks_path = os.path.join(tmp, "doclinks.json")
    with open(doclinks_path, "w") as f:
        json.dump(dl, f)
    # crawled-page inventory fixture (workDir default path): matcher
    # fodder — "Extend Route" and topic "locks" match; realign is
    # deliberately absent so the probe path stays exercised
    with open(os.path.join(work_dir, "esri_doc_pages.json"), "w") as f:
        json.dump({base + "/docsec/": [
            {"url": base + "/docsec/extend-a-route.html",
             "title": "Extend a route"},
            {"url": base + "/docsec/release-locks.html",
             "title": "Release locks"},
            {"url": base + "/docsec/lrs-locks-table.html",
             "title": "LRS Locks table"},
            {"url": base + "/docsec/storing-referent-and-offset-information-for-event-location.html",
             "title": "Storing referent and offset information for event location"},
            # two equally-good pages for a bare "calibration point" —
            # the ambiguity guard must refuse to pick one
            {"url": base + "/docsec/add-calibration-points.html",
             "title": "Add calibration points"},
            {"url": base + "/docsec/delete-calibration-points.html",
             "title": "Delete calibration points"},
        ]}, f)

    # the official vocabulary fixture (lib/vocabulary.mjs): "Realign
    # Route" is deliberately NOT in it, so the Alpha Plan classify reply
    # exercises both the normalization and the unknown-tools report;
    # the model's "extend route tool" must come back as "Extend Route"
    vocab_path = os.path.join(tmp, "lrs_vocabulary.json")
    with open(vocab_path, "w") as f:
        json.dump({"generated": "2026-09-07T00:00:00Z", "sources": [],
                   "tools": [{"name": "Extend Route", "toolset": "", "url": base + "/docsec/extend-a-route.html", "description": "x"},
                             {"name": "Reassign Routes", "toolset": "", "url": base + "/docsec/reassign-routes.html", "description": "x"},
                             {"name": "Append Routes", "toolset": "", "url": base + "/docsec/append-routes.html", "description": "x"}],
                   "widgets": [{"name": "Add Point Events", "url": ""}],
                   "terms": [{"term": "Calibration point", "definition": "d", "url": base + "/vocab.html#a"},
                             # a term no fixture text contains: seeding it must not re-tag cases
                             {"term": "Project stationing", "definition": "d", "url": base + "/vocab.html#b"}]}, f)
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
        "llm": {"apiKey": "mock-key", "baseUrl": base, "maxRetries": 0},
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
            "docLinksFile": doclinks_path,
            "vocabularyFile": vocab_path,
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
    check("dry run processed 11 (incl. the PDF-rescued spec.pdf)",
          out.get("processed") == 12, str(out))
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

    # ---- progress leg (pipeline/lib/progress.mjs) -----------------
    print("== progress leg")
    # default posture: captured output is not a TTY, so a run narrates
    # nothing and every stdout contract stays byte-for-byte
    quiet = run_sweep(cfg_path, ["--dry-run"])
    check("no narration by default when output is redirected",
          quiet.returncode == 0
          and "progress:" not in quiet.stderr and "progress:" not in quiet.stdout,
          quiet.stderr[-400:])
    loud = run_sweep(cfg_path, ["--dry-run", "--progress"])
    check("--progress narrates the run on stderr", loud.returncode == 0
          and "progress: sweep nightly index — DRY RUN" in loud.stderr,
          loud.stderr[:400])
    check("phases announce themselves and report what they found",
          "progress: list snapshots — start" in loud.stderr
          and "progress: list snapshots — docIndex — " in loud.stderr
          and "progress: source library — " in loud.stderr
          and "progress: ghost reconciliation — start" in loud.stderr,
          loud.stderr[:1500])
    check("each selected document is counted, named and explained",
          re.search(r"progress: \[1/\d+\] [^\n]+ — (new|source edited|retry after Error|"
                    r"PDF rescue|scope rescue|restored|PromptVersion )", loud.stderr) is not None,
          loud.stderr[:2000])
    check("the steps inside a document are narrated",
          "— extract\n" in loud.stderr and "— llm\n" in loud.stderr
          and "— upsert-row\n" in loud.stderr and "— sidecar\n" in loud.stderr
          and "— related\n" in loud.stderr and "— keywords\n" in loud.stderr,
          loud.stderr[-2500:])
    check("the model call reports its size, its lane and its latency",
          "chars in (a long wait here is the model, not a hang)" in loud.stderr
          and re.search(r"classified in \d+s — ", loud.stderr) is not None,
          loud.stderr[-2500:])
    check("the Python model layer narrates too (LRSDOC_PROGRESS)",
          "progress: lrsdoc docindex_classify v" in loud.stderr
          and re.search(r"progress: lrsdoc docindex_classify — \w+ in \d", loud.stderr) is not None,
          loud.stderr[-2500:])
    check("the run closes with its elapsed time and its summary line",
          re.search(r"progress: sweep finished in \d+s — library_items_seen=", loud.stderr) is not None,
          loud.stderr[-600:])
    # the stdout contract is untouched: same summary, no progress lines.
    # The two runs name their own run log, and that stamp is only
    # minute-resolution (sweep.mjs: toISOString ... slice(0, 15)), so
    # two runs either side of a minute boundary legitimately print
    # different filenames — redact the name before comparing, or this
    # leg fails a few seconds in every sixty.
    def _no_log_name(lines):
        return [re.sub(r"sweep-\d{4}-\d{2}-\d{2}T\d{4}\.json", "sweep-<stamp>.json", ln)
                for ln in lines]

    q_out = json.loads(quiet.stdout.splitlines()[0])
    l_out = json.loads(loud.stdout.splitlines()[0])
    check("narration never reaches stdout",
          "progress:" not in loud.stdout
          and q_out.get("processed") == l_out.get("processed")
          and _no_log_name(quiet.stdout.splitlines()[1:])
              == _no_log_name(loud.stdout.splitlines()[1:]),
          loud.stdout[:400])
    # config.progress carries the same three states, and the flags win
    prog_cfg = os.path.join(tmp, "progress-config.json")
    with open(prog_cfg, "w") as f:
        json.dump(dict(cfg, progress=True), f)
    from_cfg = run_sweep(prog_cfg, ["--dry-run"])
    check("config progress:true narrates without the flag",
          from_cfg.returncode == 0 and "progress: sweep nightly index" in from_cfg.stderr,
          from_cfg.stderr[:300])
    off = run_sweep(prog_cfg, ["--dry-run", "--no-progress"])
    check("--no-progress beats config progress:true",
          off.returncode == 0 and "progress:" not in off.stderr, off.stderr[-300:])
    # curation narrates its chunks and its guard
    cur_loud = run_curate(cfg_path, ["--dry-run", "--progress"])
    check("curate narrates the chunk calls and the guard",
          cur_loud.returncode == 0
          and "progress: curate — DRY RUN" in cur_loud.stderr
          and "progress: model calls — start" in cur_loud.stderr
          and re.search(r"progress:\s+chunk 1 — \d+ proposal\(s\) in \d+s", cur_loud.stderr)
          and "progress: guard + writes — " in cur_loud.stderr
          and "progress:" not in cur_loud.stdout,
          cur_loud.stderr[:1200])
    # a standalone mode narrates its own loop
    rerank_loud = run_sweep(cfg_path, ["--dry-run", "--rerank", "--progress"])
    check("a standalone mode narrates its loop and its result",
          rerank_loud.returncode == 0
          and "progress: sweep --rerank — DRY RUN" in rerank_loud.stderr
          and "progress: rerank — start" in rerank_loud.stderr
          and re.search(r"progress: rerank — \d+ of \d+ document\(s\) reranked", rerank_loud.stderr),
          rerank_loud.stderr[:800])


    # the content-filter assertion below counts this document's AI
    # calls from here: every dry run before this point (leg 1 and the
    # narration leg) legitimately classified it once
    filtered_calls_before_live = state.llm_files.count("filtered.txt")

    # ---- leg 2: live run against mocks ----------------------------
    print("== live leg")
    proc = run_sweep(cfg_path, ["--live"])
    check("live exit 0", proc.returncode == 0, proc.stderr[-600:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("live processed 12", out.get("processed") == 12, str(out))
    check("one tool name the vocabulary does not know is counted and written for review",
          out.get("tools_unknown") == 1
          and "Realign Route\tAlpha Plan.pptx" in open(os.path.join(work_dir, "unknown-tools.txt"), encoding="utf-8").read(),
          str(out) + (open(os.path.join(work_dir, "unknown-tools.txt")).read() if os.path.exists(os.path.join(work_dir, "unknown-tools.txt")) else "<no file>"))
    check("live errors 3 (corrupt.pptx, missing.txt, locked.pptx)", out.get("errors") == 3, str(out))
    check("live counted 2 out-of-scope docs", out.get("out_of_scope") == 2, str(out))

    rows = state.lists[LISTS["docIndex"]]
    by_name = {}
    for iid, fields in rows.items():
        by_name[fields.get("FileName")] = (iid, fields)
    check("doc index rows for all 12 docs + the ghost", len(by_name) == 13, str(sorted(by_name)))

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
    check("ghost media folder pruned with the sidecar", not os.path.exists(ghost_media), str(os.path.exists(ghost_media)))

    _, outside = by_name.get("outside.txt", (None, {}))
    check("out-of-scope doc -> stamped Skip",
          outside.get("IndexStatus") == "Skipped"
          and outside.get("PromptVersion") == STAMP
          and "out of sync scope" in str(outside.get("LastError", "")), str(outside)[:250])
    _, outpdf = by_name.get("outside.pdf", (None, {}))
    check("out-of-scope pdf -> stamped Skip too",
          outpdf.get("IndexStatus") == "Skipped"
          and "out of sync scope" in str(outpdf.get("LastError", "")), str(outpdf)[:250])

    # content-filter lane (v1.28): the model refused the doc text, which is
    # deterministic — the row must stamp Skipped at the CURRENT
    # PromptVersion (not Error), so it neither rechurns nor re-burns an AI
    # call nightly; the idempotency leg below proves both
    _, filt = by_name.get("filtered.txt", (None, {}))
    check("model-refused doc -> stamped Skipped, not Error",
          filt.get("IndexStatus") == "Skipped"
          and str(filt.get("LastError", "")).startswith("content filter:")
          and "stop_reason: refusal" in str(filt.get("LastError", "")), str(filt)[:300])
    check("content-filtered stamp pins the current PromptVersion",
          filt.get("PromptVersion") == STAMP, str(filt)[:200])

    _, missing = by_name.get("missing.txt", (None, {}))
    check("in-scope missing file -> retryable Error",
          missing.get("IndexStatus") == "Error"
          and "not found locally" in str(missing.get("LastError", "")), str(missing)[:250])

    _, alpha = by_name.get("Alpha Plan.pptx", (None, {}))
    check("alpha indexed", alpha.get("IndexStatus") == "Indexed", str(alpha)[:200])
    check("alpha kind clamped fieldset", alpha.get("DocKind") == "Test Plan"
          and alpha.get("Surface") == "Pro" and alpha.get("PE") == "Claire Wang")
    check("alpha PromptVersion stamped", alpha.get("PromptVersion") == STAMP)
    check("alpha TextFileUrl set",
          isinstance(alpha.get("TextFileUrl"), dict)
          and alpha["TextFileUrl"].get("Url", "").endswith("/Test Plans/123-alpha-plan.md"),
          str(alpha.get("TextFileUrl")))
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
          and scan.get("PromptVersion") == STAMP, str(scan)[:250])

    _, bad = by_name.get("corrupt.pptx", (None, {}))
    check("corrupt doc -> Error row", bad.get("IndexStatus") == "Error", str(bad)[:200])
    check("error names the failing step",
          str(bad.get("LastError", "")).startswith("ziptext-pptx:"), str(bad.get("LastError"))[:120])
    _, locked = by_name.get("locked.pptx", (None, {}))
    locked_err = str(locked.get("LastError", ""))
    check("unreadable-on-disk source -> retryable Error naming the file and the OneDrive cause (v1.64)",
          locked.get("IndexStatus") == "Error"
          and locked_err.startswith("source-read: source file exists but cannot be read (")
          and "OneDrive" in locked_err and "graphDownloadFallback" in locked_err
          and locked_err.rstrip().endswith("locked.pptx"), locked_err[:400])
    check("unreadable source counted and noted on stderr",
          out.get("unreadable_local") == 1 and "locked.pptx: local copy unreadable (" in proc.stderr,
          str(out.get("unreadable_local")) + " " + proc.stderr[-400:])

    # sidecars on disk
    md_files = {f: os.path.join(r, f)
                for r, _, fs_ in os.walk(sidecar_dir) for f in fs_
                if f.endswith(".md") and not f.startswith("_")}
    check("five sidecars written (incl. rescued pdf + html)", len(md_files) == 5, str(sorted(md_files)))

    # browse index pages (v1.35): root catalog + per-kind indexes,
    # rebuilt by every live run from the run's own rows
    root_idx_path = os.path.join(sidecar_dir, "_Index.md")
    root_idx = open(root_idx_path).read() if os.path.exists(root_idx_path) else ""
    check("root browse index lists the corpus by kind",
          "# LRS Doc Index — catalog" in root_idx
          and "## Test Plans (1)" in root_idx
          and "123-alpha-plan.md" in root_idx, root_idx[:400])
    man_path = os.path.join(sidecar_dir, "_Manifest.json")
    man = json.load(open(man_path)) if os.path.exists(man_path) else {}
    check("live run writes _Manifest.json (row id -> sidecar path)",
          man.get("format") == "3.0"
          and any(d.get("path") == "Test Plans/123-alpha-plan.md" and d.get("issue") == 123
                  for d in man.get("docs", {}).values()),
          str(man)[:300])
    kind_idx_path = os.path.join(sidecar_dir, "Test Plans", "_Index.md")
    kind_idx = open(kind_idx_path).read() if os.path.exists(kind_idx_path) else ""
    check("per-kind browse index links its sidecars",
          "# Test Plans — index" in kind_idx and "123-alpha-plan.md" in kind_idx
          and "(<Test Plans/" not in kind_idx, kind_idx[:400])

    # body-text similarity: spec.pdf and notes.txt share body words but
    # NO keyword/edge — only the BodySim candidate source can join them
    spec_sc_path = next((p for n, p in md_files.items() if "spec" in n.lower()), None)
    spec_sc = open(spec_sc_path).read() if spec_sc_path else ""
    notes_id = int(by_name["notes.txt"][0])
    check("body-sim relates spec.pdf to notes.txt (no shared keyword)",
          f"<!-- rel:{notes_id} " in spec_sc and "similar text " in spec_sc,
          spec_sc[-500:])

    # status page (live runs only, sidecar-library root)
    status_path = os.path.join(sidecar_dir, "_Sweep Status.md")
    status = open(status_path).read() if os.path.exists(status_path) else ""
    check("status page written on live run",
          "12 processed, 3 errors" in status and "corrupt.pptx" in status,
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
    check("sidecar header shape (format 3.1: H1 + metadata table, no yaml block)",
          sc.startswith("# Alpha Plan")
          and "<!-- metadata" not in sc and "```yaml" not in sc
          and "| Field | Value |" in sc
          and re.search(r"(?m)^\| \*\*Doc\*\* \| \d+ · Test Plan · Pro \|$", sc) is not None
          and "| **Status** | Indexed |" in sc
          and f"· format 3.1 · prompt {STAMP} |" in sc, sc[:400])
    check("sidecar issue row links the issue", "#123](https://devtopia.esri.com/" in sc
          and "| **Issues** | [" in sc, sc[:400])
    # format 3.1: a FIXED row order, and only the rows with something
    # to say. Alpha is a rich fixture, so every row but Generated is
    # present; spec.pdf below is the sparse one.
    CANON_ROWS = ["Doc", "Status", "Product", "Release", "Issues", "Source",
                  "People", "Edited", "Extracted", "Generated", "Keywords", "Tools"]
    rows_alpha = re.findall(r"(?m)^\| \*\*([A-Za-z]+)\*\* \|", sc)
    check("sidecar table rows keep the canonical order",
          rows_alpha == [k for k in CANON_ROWS if k in rows_alpha]
          and rows_alpha[:2] == ["Doc", "Status"], str(rows_alpha))
    check("no metadata row is printed as an em dash",
          re.search(r"(?m)^\| \*\*[A-Za-z]+\*\* \| — \|$", sc) is None, sc[:600])
    check("Generated rides a machine-authored file only, never a sidecar",
          "| **Generated** |" not in sc, sc[:600])
    rows_spec = re.findall(r"(?m)^\| \*\*([A-Za-z]+)\*\* \|", spec_sc)
    check("a sparse document gets a short table, not ten em dashes",
          rows_spec == [k for k in CANON_ROWS if k in rows_spec]
          and "Doc" in rows_spec and "Status" in rows_spec
          and "Source" in rows_spec and "Extracted" in rows_spec
          and "Release" not in rows_spec and "Tools" not in rows_spec,
          str(rows_spec) + spec_sc[:400])
    check("sidecar body appended", "Alpha test plan covering lock acquisition" in sc)
    check("product detected on the row",
          alpha.get("Products") == "Roads & Highways", str(alpha.get("Products")))
    check("sidecar carries the documentation block",
          "## Esri documentation" in sc
          and "<!-- docs:begin -->" in sc and "<!-- docs:end -->" in sc,
          sc[-600:])
    check("generic product-level links are gone",
          "arcgis-roads-and-highways/overview" not in sc
          and "Essential vocabulary" not in sc, sc[-600:])
    check("curated tool gets a direct doc link",
          "reassign-routes.html" in sc, sc[-700:])
    check("unmatched tools collapse into ONE search line",
          sc.count("_No page matched:_") == 1
          and "Add%20Point%20Events" in sc, sc[-900:])
    check("probed tool got a direct link (page exists)",
          "/docs/realign-route.html" in sc, sc[-800:])
    check("probe results cached",
          os.path.exists(os.path.join(work_dir, "doc-links-cache.json")))
    check("inventory-matched tool got a direct link (no probe needed)",
          "extend-a-route.html" in sc, sc[-900:])
    check("strong topic match got a doc link",
          "release-locks.html" in sc, sc[-900:])
    docs_sec = sc.split("<!-- docs:begin -->")[-1].split("<!-- docs:end -->")[0]
    check("two keywords hitting one page link it once",
          docs_sec.count("storing-referent-and-offset") == 1, docs_sec)
    check("links render inline with real page titles, no name column",
          "| Mentioned |" not in docs_sec
          and "[Extend a route](" in docs_sec
          and "[Storing referent and offset information for event location](" in docs_sec,
          docs_sec)
    check("ambiguous name linked to nothing (two equal pages)",
          "calibration-points.html" not in docs_sec, docs_sec)
    check("no duplicate page links anywhere in the block",
          len(re.findall(r"\]\((http[^)]+)\)", docs_sec)) ==
          len(set(re.findall(r"\]\((http[^)]+)\)", docs_sec))), docs_sec)
    alpha_id = int(by_name["Alpha Plan.pptx"][0])
    beta_id = int(by_name["Beta Story.pptx"][0])
    rel_region = sc.split("<!-- related:begin -->")[-1].split("<!-- related:end -->")[0]
    check("related evidence is compact (no token enumerations)",
          "title words:" not in rel_region and "filename words:" not in rel_region
          and "also: same" not in rel_region
          and re.search(r"similar text \d\.\d\d", rel_region) is not None,
          rel_region)
    check("compact evidence keeps the signal names",
          re.search(r"same [a-z]+(/[a-z]+)*", rel_region) is not None,
          rel_region)
    check("alpha related region patched (names beta)",
          f"<!-- rel:{beta_id} " in sc.split("<!-- related:begin -->")[-1]
          or f"<!-- rel:{beta_id} " in sc, sc[-500:])
    beta_content = open(beta_sc).read() if beta_sc else ""
    check("beta sidecar reciprocally patched (names alpha)",
          f"<!-- rel:{alpha_id} " in beta_content and "_None yet._" not in beta_content,
          beta_content[-500:])

    # body presentation (tidyBody)
    beta_body = beta_content[beta_content.rindex("\n---\n") + 5:]
    check("slide-number placeholder lines dropped",
          not re.search(r"(?m)^[123]$", beta_body), beta_body)
    check("bullet padding collapsed and depth normalized",
          "- use existing 64bit FC" in beta_body
          and "-          use" not in beta_body, beta_body)
    check("consecutive bullets are a tight list (no blank between)",
          not re.search(r"(?m)^\s*- .*\n\n\s*- ", beta_body), beta_body)
    check("empty notes section dropped",
          "### Notes" not in beta_body, beta_body)
    check("body still carries the slide content",
          "Scope of testing" in beta_body and "## Slide 2" in beta_body, beta_body)

    # case grammar (casegrammar testplan/v1, Sidecar_Format_Plan phase 3)
    # — on the Test Plan fixture; the story fixture keeps its tidied
    # slide sections (kinds-only by design)
    alpha_content = open(alpha_sc).read()
    alpha_body = alpha_content[alpha_content.rindex("\n---\n") + 5:]
    check("case heading is a TC id + scenario, anchored by its own id",
          "### TC-P01 — Loop Route { #tc-p01 }" in alpha_body, alpha_body)
    check("the provenance rides an lrs:case mark under the heading",
          '<!-- lrs:case det=S1 conf=high src="slide 2 · case 3" -->' in alpha_body, alpha_body)
    check("classification remainder becomes the Group line",
          "- **Group:** Line Network" in alpha_body, alpha_body)
    check("full case line survives in the body (measures never lost)",
          "- **Case:** Loop route – Split measure: 40 using Merge Events" in alpha_body, alpha_body)
    check("profile sections present and ordered",
          "## Test Cases" in alpha_body and "## Other content" in alpha_body
          and alpha_body.index("## Test Cases") < alpha_body.index("## Other content"), alpha_body)
    check("promoted case line removed from the body",
          not re.search(r"(?m)^3\. Loop route", alpha_body), alpha_body)
    check("promoted classification line removed from the body",
          not re.search(r"(?m)^Positive - Line network$", alpha_body), alpha_body)
    check("no heading carries a split measure or route id",
          not re.search(r"(?mi)^#{2,4} .*(split(ting)? measure|\bR\d+L\d+\b)", alpha_body), alpha_body)
    check("checklist slide lands under Other content, not as a case",
          "\n#### Slide 3 <!-- slide 3 -->" in alpha_body.split("## Other content")[-1]
          and "17. Verify the effective date defaults to today" in alpha_body, alpha_body)
    check("long case line yields a short scenario title in the Negative lane",
          "### TC-N01 — Merge Option Disabled { #tc-n01 }\n"
          '<!-- lrs:case det=S1 conf=high src="slide 4 · case 9" -->' in alpha_body, alpha_body)
    check("unit headings are H4, so H3 in a plan body means a test case",
          not re.search(r"(?m)^### (?!TC-[PNU])", alpha_body), alpha_body)
    check("redundant Group suppressed (classification already says it)",
          "- **Group:** Merge Option Disabled" not in alpha_body, alpha_body)
    check("full case text survives as the Case line",
          "- **Case:** Merge Option disabled, coincident events that have exact "
          "attributes from measures 0-4 and exist in both versions" in alpha_body, alpha_body)
    check("nothing truncates mid-sentence into a heading",
          not re.search(r"(?m)^### .*\band <!-- src", alpha_body), alpha_body)
    check("story fixture keeps tidied slide sections (no case grammar off the kinds list)",
          "## Slide 4" in beta_body and "### TC-" not in beta_body, beta_body)

    # media
    # phase 1b: media/<stem>/<asset> — the stem is the sidecar's own
    media_dir = os.path.join(sidecar_dir, "media")
    stem_dir = os.path.join(media_dir, "123-alpha-plan")
    media = os.listdir(stem_dir) if os.path.isdir(stem_dir) else []
    # v1.59: the archive's image1.png lands under its standardized name
    # (fig-<ordinal>-slide-<slide>[-<title slug>]; alpha's slide 1 has
    # no title, so v1.60 slugs its first text line) and the body links
    # it one per line with a Figure alt
    check("media extracted into the sidecar's media/<stem>/ folder under the standardized name",
          sorted(media) == ["fig-01-slide-01-alpha-test-plan-covering-lock.png", "fig-02-slide-05.svg"]
          and not any(m.startswith("doc10_") for m in media), str(media))
    # v1.61: the drawing slide's shapes + text, rendered and linked
    svg_path = os.path.join(stem_dir, "fig-02-slide-05.svg")
    svg = open(svg_path).read() if os.path.exists(svg_path) else ""
    check("drawing rendered as a faithful SVG next to the picture",
          svg.startswith("<svg ") and 'data-shapes="4" data-connectors="1"' in svg
          and 'fill="#1F4E79"' in svg and ">Split</text>" in svg and 'marker-end="url(#ah-C00000)"' in svg, svg[:400])
    check("body links the drawing under its slide with the labels line and the glued connection",
          "[figure: R1 · R2 · Split · Merge]" in alpha_content
          and "![Figure 2](../media/123-alpha-plan/fig-02-slide-05.svg)" in alpha_content
          and "[connections: R1 → Split]" in alpha_content, alpha_content[-700:])
    check("run summary counts drawings", int(out.get("drawings", 0)) == 1, str(out))
    check("body links the picture under its standardized name",
          "![Figure 1 — Alpha test plan covering lock acquisition #123 for Roads and Highways](../media/123-alpha-plan/fig-01-slide-01-alpha-test-plan-covering-lock.png)" in alpha_content
          and "image1.png" not in alpha_content, alpha_content[-400:])

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

    # the classify wire shape (the live leg above ran through lrsdoc):
    # schema-pinned output, the three inputs rendered into the user turn
    fmt = ((state.llm_last_request.get("output_config") or {}).get("format") or {})
    check("classify request is schema-pinned (output_config.format json_schema)",
          fmt.get("type") == "json_schema"
          and set((fmt.get("schema") or {}).get("required") or []) >= {"title", "docKind", "keywords"},
          str(state.llm_last_request.get("output_config"))[:300])
    user_last = mock.user_text(state.llm_last_request)
    check("classify user turn carries the file name, the established keywords, the known tools and the fenced text",
          re.search(r"^File name: \S", user_last, re.M) is not None
          and "Established keywords" in user_last
          and "Known tools (the official names — copy exactly):\nExtend Route\nReassign Routes\nAppend Routes\nAdd Point Events" in user_last
          and "<<<DOCUMENT TEXT BEGIN>>>" in user_last, user_last[:600])

    # ---- case-index leg (Case_Index_Plan phase 2) ------------------
    # alpha (Test Plan) carries one case slide; beta (User Story)
    # carries case SECTIONS but is off the kinds list; the ghost's
    # seeded case row must not survive its archive
    print("== case-index leg")
    tcs = list(state.lists.get(LISTS["testCases"], {}).values())
    alpha_cases = [r for r in tcs if r.get("DocumentLookupId") == alpha_id]
    alpha_cases.sort(key=lambda r: str(r.get("CaseKey")))
    check("alpha (Test Plan) got its two case rows (the checklist slide is not one)",
          len(alpha_cases) == 2 and alpha_cases[1].get("CaseNo") == "TC-N01",
          str(tcs)[:400])
    ac = alpha_cases[0] if alpha_cases else {}
    check("case row carries the case-grammar contract",
          ac.get("CaseKey") == f"{alpha_id}|1" and ac.get("CaseNo") == "TC-P01"
          and ac.get("Classification") == "Positive" and ac.get("SlideNo") == 2
          and ac.get("Scenario") == "Loop Route"
          and ac.get("SourceRef") == "S1 · slide 2 · case 3"
          and ac.get("Confidence") == "high", str(ac))
    check("case row carries the v1.1 metadata columns",
          ac.get("Shape") == "S1" and ac.get("FigureCount") == 0
          and ac.get("TableCount") == 0 and ac.get("StepCount") == 0
          and ac.get("RouteRefs") == "" and ac.get("ExpectedResult") == ""
          and ac.get("TraceText") == "" and ac.get("FigureLinks") == ""
          and ac.get("FigureLink") == "", str(ac))
    check("case row tagged from the run-start vocabulary (v1.2)",
          ac.get("Tools") == "merge events"
          and ac.get("Keywords") == "split measure", str(ac))
    check("case row title is the visible heading",
          ac.get("Title") == "TC-P01 — Loop Route",
          str(ac.get("Title")))
    check("case anchor deep-links the sidecar heading by case id",
          ac.get("Anchor") == "tc-p01",
          str(ac.get("Anchor")))
    check("SourceRef still reads detector-first",
          str(ac.get("SourceRef")) == "S1 · slide 2 · case 3", str(ac.get("SourceRef")))
    check("case text keeps the specifics",
          "Split measure: 40" in str(ac.get("CaseText")), str(ac.get("CaseText")))
    check("beta (User Story) minted no case rows despite its case sections",
          not [r for r in tcs if r.get("DocumentLookupId") == beta_id],
          str(tcs)[:400])
    check("ghost's case row pruned by the archive pass",
          not [r for r in tcs
               if str(r.get("CaseKey", "")).startswith(f"{ghost_row_id}|")],
          str(tcs)[:400])
    check("run summary counts case writes",
          int(out.get("cases_upserted", 0)) >= 1
          and int(out.get("cases_removed", 0)) >= 1
          and int(out.get("case_errors", 0)) == 0, str(out))
    # the case catalog (phase 3): live runs rebuild the browse page
    catalog_path = os.path.join(sidecar_dir, "_Case Catalog.md")
    cat = open(catalog_path).read() if os.path.exists(catalog_path) else ""
    check("case catalog written at the library root",
          cat.startswith("# Test cases — catalog"), cat[:200])
    check("catalog groups by plan with classification counts",
          re.search(r"(?m)^## Alpha Plan \(2: 1 positive / 1 negative\)$", cat)
          is not None, cat)
    check("catalog case row deep-links the sidecar anchor",
          "#tc-p01>" in cat
          and "| Positive |" in cat and "Loop Route" in cat, cat)
    check("catalog rows carry the group and the detector",
          "| Line Network |" in cat and "| S1 |" in cat, cat)
    check("caseless docs stay off the catalog",
          "Ghost" not in cat
          and "2 case(s) across 1 plan(s)" in cat, cat)

    # ---- figure-index leg (Figure_Index_Plan) ----------------------
    # alpha carries one pasted picture on slide 1; the ghost's seeded
    # figure row must not survive its archive; every kind gets rows
    # (kinds [] = all) — beta simply has no figures
    print("== figure-index leg")
    figs = list(state.lists.get(LISTS["figures"], {}).values())
    alpha_figs = sorted([r for r in figs if r.get("DocumentLookupId") == alpha_id], key=lambda r: int(r.get("FigureNo") or 0))
    check("alpha got its two figure rows (the picture and the drawing)", len(alpha_figs) == 2, str(figs)[:400])
    af = alpha_figs[0] if alpha_figs else {}
    ad = alpha_figs[1] if len(alpha_figs) > 1 else {}
    check("drawing row: the label line and the SVG link folded into one Kind drawing row",
          ad.get("Kind") == "drawing" and ad.get("FileName") == "fig-02-slide-05.svg" and ad.get("Format") == "svg"
          and ad.get("SlideNo") == 5 and ad.get("Caption") == "R1 · R2 · Split · Merge"
          and ad.get("Title") == "Drawing 2" and "[connections: R1 → Split]" in str(ad.get("Context"))
          and int(ad.get("Width") or 0) > 100 and int(ad.get("Bytes") or 0) > 500
          and isinstance(ad.get("ImageLink"), dict) and ad["ImageLink"].get("Description") == "fig-02-slide-05.svg", str(ad))
    check("figure row carries the naming + placement contract",
          af.get("FigureKey") == f"{alpha_id}|1" and af.get("FigureNo") == 1
          and af.get("Kind") == "image" and af.get("FileName") == "fig-01-slide-01-alpha-test-plan-covering-lock.png"
          and af.get("Format") == "png" and af.get("SlideNo") == 1
          and af.get("Section") == "Slide 1" and af.get("Anchor") == "slide-1"
          and af.get("CaseNo") == "" and af.get("Title") == "Figure 1", str(af))
    check("figure row sized from the file on disk",
          af.get("Width") == 64 and af.get("Height") == 64 and int(af.get("Bytes") or 0) == len(PNG), str(af))
    check("figure row links the picture in the media folder (text URL + hyperlink via SPO)",
          af.get("ImageUrl") == "https://mock.example/sites/lrsworkspace/LRS Doc Index/media/123-alpha-plan/fig-01-slide-01-alpha-test-plan-covering-lock.png"
          and isinstance(af.get("ImageLink"), dict)
          and af["ImageLink"].get("Url") == af.get("ImageUrl")
          and af["ImageLink"].get("Description") == "fig-01-slide-01-alpha-test-plan-covering-lock.png", str(af))
    check("figure context is the section's prose",
          "lock acquisition #123" in str(af.get("Context")) and "![" not in str(af.get("Context")), str(af))
    check("ghost's figure row pruned by the archive pass",
          not [r for r in figs if str(r.get("FigureKey", "")).startswith(f"{ghost_row_id}|")], str(figs)[:400])
    check("run summary counts figure writes",
          int(out.get("figures_upserted", 0)) >= 1 and int(out.get("figures_removed", 0)) >= 1
          and int(out.get("figure_errors", 0)) == 0, str(out))
    fcat_path = os.path.join(sidecar_dir, "_Figure Catalog.md")
    fcat = open(fcat_path).read() if os.path.exists(fcat_path) else ""
    check("figure catalog written at the library root",
          fcat.startswith("# Figures — catalog"), fcat[:200])
    check("catalog groups by document with kind counts and links the picture + section",
          re.search(r"(?m)^## Alpha Plan \(2: 1 image / 1 drawing\)$", fcat) is not None
          and "[fig-01-slide-01-alpha-test-plan-covering-lock.png](<media/123-alpha-plan/fig-01-slide-01-alpha-test-plan-covering-lock.png>)" in fcat
          and "[Slide 1](<Test Plans/123-alpha-plan.md#slide-1>)" in fcat
          and "| 64×64 |" in fcat
          and "2 figure(s) (1 image(s)) across 1 document(s)" in fcat, fcat)
    check("catalog lists the drawing as a linked file with its labels",
          re.search(r"(?m)^## Alpha Plan \(2: 1 image / 1 drawing\)$", fcat) is not None
          and "[fig-02-slide-05.svg](<media/123-alpha-plan/fig-02-slide-05.svg>)" in fcat
          and "| R1 · R2 · Split · Merge |" in fcat, fcat)
    status_fig = open(os.path.join(sidecar_dir, "_Sweep Status.md")).read()
    check("status page reports figure writes", "**Figures:**" in status_fig, status_fig[:800])

    # ---- leg 3: idempotency — second live run reindexes nothing ----
    print("== idempotency leg")
    llm_before = state.llm_calls
    for i in range(40):  # prune fodder: names sort older than real stamps
        with open(os.path.join(work_dir, f"sweep-0000-{i:03d}.json"), "w") as f:
            f.write("{}")
    proc = run_sweep(cfg_path, ["--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("second run reprocesses only the three Error docs (not the stamped out-of-scope Skip)",
          out.get("processed") == 3 and out.get("out_of_scope") == 0
          and out.get("archived") == 0, str(out))
    check("no extra LLM calls for stamped docs", state.llm_calls == llm_before,
          f"{state.llm_calls} vs {llm_before}")
    # ghost sanity floor: when more than the per-run cap AND at least half
    # of the live rows match no library file, the keys disagree with the
    # listing (a docKeyStrip mismatch) — the pass must halt, archive
    # nothing and delete no sidecar, and say why
    print("== ghost-floor leg")
    floor_ids = []
    for i in range(30):
        sc = os.path.join(sidecar_dir, "Other", f"Floor Doc {i}.md")
        os.makedirs(os.path.dirname(sc), exist_ok=True)
        with open(sc, "w") as f:
            f.write(f"# Floor Doc {i}\nstale\n")
        floor_ids.append(state.seed(LISTS["docIndex"], {
            "Title": f"Floor Doc {i}", "FileName": f"Floor Doc {i}.pptx",
            "DocKey": f"shared documents/floor doc {i}.pptx", "IndexStatus": "Indexed",
            "SourceModified": "2026-08-01T10:00:00Z", "PromptVersion": STAMP,
            "TextFileUrl": {"Url": f"https://mock.example/sites/lrsworkspace/LRS Doc Index/Other/Floor Doc {i}.md",
                            "Description": f"Floor Doc {i}.md"},
        }))
    proc = run_sweep(cfg_path, ["--dry-run"])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    floor_rows = [state.lists[LISTS["docIndex"]][str(i)] for i in floor_ids]
    check("ghost floor: a majority of ghosts halts the pass — nothing archived (planned or real), reason on stderr",
          proc.returncode == 0 and out.get("archived") == 0 and out.get("ghost_halted") == 30
          and all(r.get("IndexStatus") == "Indexed" for r in floor_rows)
          and os.path.exists(os.path.join(sidecar_dir, "Other", "Floor Doc 0.md"))
          and "ghost reconciliation halted" in proc.stderr and "docKeyStrip" in proc.stderr,
          str(out)[:300] + proc.stderr[-300:])
    for i in floor_ids:
        state.lists[LISTS["docIndex"]].pop(str(i), None)
        os.remove(os.path.join(sidecar_dir, "Other", f"Floor Doc {int(i) - int(floor_ids[0])}.md"))
    check("content-filtered doc never re-burns an AI call (the live leg's is its last)",
          state.llm_files.count("filtered.txt") == filtered_calls_before_live + 1,
          f"{state.llm_files.count('filtered.txt')} vs {filtered_calls_before_live} + 1")
    check("case rows idempotent (unchanged corpus writes none)",
          int(out.get("cases_upserted", 0)) == 0
          and int(out.get("cases_removed", 0)) == 0
          and len([r for r in state.lists.get(LISTS["testCases"], {}).values()
                   if r.get("DocumentLookupId") == alpha_id]) == 2, str(out))
    check("figure rows idempotent (unchanged corpus writes none)",
          int(out.get("figures_upserted", 0)) == 0
          and int(out.get("figures_removed", 0)) == 0
          and len([r for r in state.lists.get(LISTS["figures"], {}).values()
                   if r.get("DocumentLookupId") == alpha_id]) == 2, str(out))
    # streaks: run 1 stamped 1 night; this full run makes it 2
    status2 = open(os.path.join(sidecar_dir, "_Sweep Status.md")).read()
    check("error streaks advance on full runs",
          "Nights stuck" in status2
          and "| corrupt.pptx | 2 |" in status2
          and "| missing.txt | 2 |" in status2
          and "| locked.pptx | 2 |" in status2, status2[:600])
    # (same-minute gate runs share one log stamp, so only the newest
    # run of this minute survives as a row — assert shape, not count)
    check("status page carries the recent-runs trend table (v1.34)",
          "## Recent runs (" in status2
          and re.search(r"\| 2026-\d\d-\d\d \d\d:\d\d \| \d+ \| \d+ \|", status2) is not None,
          status2[-500:])

    run_logs = [f for f in os.listdir(work_dir) if f.startswith("sweep-") and f.endswith(".json")]
    check("run logs pruned to 30", len(run_logs) == 30, str(len(run_logs)))
    check("pruning kept the newest logs",
          os.path.basename(out["logFile"]) in run_logs
          and sum(1 for f in run_logs if f.startswith("sweep-0000-")) < 40,
          str(sorted(run_logs)[:5]))

    # list backup (v1.32): every run exports the run-start snapshots
    # as a restorable gzip; the summary names the file
    backups = [f for f in os.listdir(work_dir) if f.startswith("list-backup-")]
    check("list backup exported to workDir",
          len(backups) >= 1 and out.get("list_backup", "") in backups,
          str(backups) + " " + str(out.get("list_backup")))
    with gzip.open(os.path.join(work_dir, sorted(backups)[-1])) as f:
        bk = json.load(f)
    check("list backup holds all seven lists with raw rows",
          set(bk.get("lists", {})) == {"docIndex", "keywords", "docIds",
                                       "docKeywords", "docLinks", "testCases", "figures"}
          and len(bk["lists"]["docIndex"]) >= 3
          and "fields" in bk["lists"]["docIndex"][0],
          str({k: len(v) for k, v in bk.get("lists", {}).items()}))
    # heartbeat (v1.32): a successful live full run stamps last-success
    with open(os.path.join(work_dir, "last-success.json")) as f:
        hb = json.load(f)
    check("heartbeat stamped by the live full run",
          "at" in hb and hb.get("processed", -1) >= 0, str(hb))

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
    # the rendered user turn: the vocabulary block, then the blocked list
    cur_user = mock.user_text(state.cur_last_request or {})
    cut_at = cur_user.find("Titles that must NEVER appear")
    req = {"Vocabulary": cur_user[:cut_at] if cut_at >= 0 else cur_user,
           "DoNotPropose": cur_user[cut_at:] if cut_at >= 0 else ""}
    check("vocabulary lines 'title [kind]': canonical rows, a pending row left out entirely",
          "centerlines [topic]" in req.get("Vocabulary", "")
          and "rejected thing [topic]" in req.get("Vocabulary", "")
          and "sld [tool]" not in req.get("Vocabulary", "")
          and "stale approved" not in req.get("Vocabulary", ""),
          req.get("Vocabulary", "")[:300])
    check("blocked list carries the rejected title only (pending is out of the vocabulary)",
          "rejected thing" in req.get("DoNotPropose", "")
          and "sld" not in req.get("DoNotPropose", ""), req.get("DoNotPropose", "")[:200])
    check("summary counts the pending rows", "pending=1" in out.get("line", ""), str(out))
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
          and "CurationPromptVersion: v2.1.0" in digest, digest[:400])
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
    # week 3: autoApprove — guard-passing merges apply immediately, and
    # a pending proposal left over from manual mode is applied too
    cfg["curation"] = {"autoApprove": True}
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    CUR["gantts"] = state.seed(LISTS["keywords"], {"Title": "gantt charts", "Kind": "topic"})
    CUR["gantt"] = state.seed(LISTS["keywords"], {"Title": "gantt chart", "Kind": "topic"})
    CUR["wp"] = state.seed(LISTS["keywords"], {"Title": "wp", "Kind": "topic",
                                               "CurationStatus": "Proposed",
                                               "ProposedCanonical": "work package — abbreviation"})
    CUR["workpackage"] = state.seed(LISTS["keywords"], {"Title": "work package", "Kind": "topic"})
    state.cur_response = {"proposals": [
        {"alias": "gantt charts", "canonical": "gantt chart", "why": "plural"},
    ]}
    proc = run_curate(cfg_path, ["--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("autoApprove merges proposal + pending directly",
          proc.returncode == 0 and "merged=2" in out.get("line", "")
          and kwrows[CUR["gantts"]].get("CanonicalRefLookupId") == int(CUR["gantt"])
          and not kwrows[CUR["gantts"]].get("CurationStatus")
          and kwrows[CUR["wp"]].get("CanonicalRefLookupId") == int(CUR["workpackage"])
          and not kwrows[CUR["wp"]].get("CurationStatus"),
          str(out) + " " + str(kwrows[CUR["gantts"]]) + str(kwrows[CUR["wp"]]))
    check("autoApprove digest is an audit log with undo instructions",
          "MERGED 'gantt charts' → 'gantt chart'" in (state.digest or "")
          and "MERGED (pending) 'wp' → 'work package'" in (state.digest or "")
          and "AUTOMATICALLY" in (state.digest or ""), (state.digest or "")[:400])
    # a reply that merges B→C and then A→B in one pass: after B becomes
    # an alias it may not serve as A's canonical in the same run (a chain
    # A→B→C); the second proposal is dropped, not applied
    CUR["ca"] = state.seed(LISTS["keywords"], {"Title": "chain alpha", "Kind": "topic"})
    CUR["cb"] = state.seed(LISTS["keywords"], {"Title": "chain beta", "Kind": "topic"})
    CUR["cc"] = state.seed(LISTS["keywords"], {"Title": "chain gamma", "Kind": "topic"})
    state.cur_response = {"proposals": [
        {"alias": "chain beta", "canonical": "chain gamma", "why": "same"},
        {"alias": "chain alpha", "canonical": "chain beta", "why": "same"},
    ]}
    proc = run_curate(cfg_path, ["--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("autoApprove never chains onto a row merged earlier in the same run",
          proc.returncode == 0 and "merged=1" in out.get("line", "") and "dropped=1" in out.get("line", "")
          and kwrows[CUR["cb"]].get("CanonicalRefLookupId") == int(CUR["cc"])
          and not kwrows[CUR["ca"]].get("CanonicalRefLookupId"),
          str(out) + " " + str(kwrows[CUR["ca"]]) + str(kwrows[CUR["cb"]]))
    # --drain: passes repeat until one writes nothing. The mock returns
    # the SAME proposals every pass — pass 1 merges wbs, pass 2 finds
    # the alias already merged (guard drops it), writes 0, stops.
    CUR["wbs"] = state.seed(LISTS["keywords"], {"Title": "wbs", "Kind": "topic"})
    CUR["wbsfull"] = state.seed(LISTS["keywords"], {"Title": "work breakdown structure", "Kind": "topic"})
    state.cur_response = {"proposals": [
        {"alias": "wbs", "canonical": "work breakdown structure", "why": "abbreviation"},
    ]}
    proc = run_curate(cfg_path, ["--live", "--drain"])
    check("drain stops when a pass writes nothing",
          proc.returncode == 0
          and "drain pass 2" in proc.stdout and "drain pass 3" not in proc.stdout
          and kwrows[CUR["wbs"]].get("CanonicalRefLookupId") == int(CUR["wbsfull"]),
          proc.stdout[-400:])
    # vocabulary chunking: small chunk size -> one model call per
    # alphabetical chunk (a reply-size guard for big vocabularies)
    cfg["curation"]["vocabChunk"] = 3
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    state.cur_response = {"proposals": []}
    state.cur_calls = 0
    proc = run_curate(cfg_path, ["--live"])
    check("vocabulary sent in chunks (one model call each)",
          proc.returncode == 0 and state.cur_calls >= 3,
          f"calls={state.cur_calls} " + proc.stderr[-200:])
    del cfg["curation"]["vocabChunk"]
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)

    # ---- leg 3d1: the deterministic guard --------------------------
    # 2026-09-07: told a title may never be an ALIAS, the model proposed
    # the reverse pair with it as CANONICAL (39 of 39 in one run). The
    # guard now drops a merge in the wrong direction, a kind mismatch
    # and a canonical that is itself pending review.
    print("== guard leg")
    cfg["curation"] = {}
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    CUR["em"] = state.seed(LISTS["keywords"], {"Title": "error message", "Kind": "topic"})
    CUR["ems"] = state.seed(LISTS["keywords"], {"Title": "error messages", "Kind": "topic",
                                                "CurationStatus": "Rejected"})
    CUR["rid"] = state.seed(LISTS["keywords"], {"Title": "route id", "Kind": "topic"})
    CUR["routeid"] = state.seed(LISTS["keywords"], {"Title": "routeid", "Kind": "topic"})
    CUR["ae"] = state.seed(LISTS["keywords"], {"Title": "add event", "Kind": "topic"})
    CUR["aes"] = state.seed(LISTS["keywords"], {"Title": "add events", "Kind": "tool"})
    CUR["pend"] = state.seed(LISTS["keywords"], {"Title": "pending alias", "Kind": "topic",
                                                 "CurationStatus": "Proposed",
                                                 "ProposedCanonical": "centerline — A1 test"})
    CUR["pend2"] = state.seed(LISTS["keywords"], {"Title": "pending aliases", "Kind": "topic"})
    CUR["sldx"] = state.seed(LISTS["keywords"], {"Title": "sld", "Kind": "tool"})
    CUR["sldfull"] = state.seed(LISTS["keywords"], {"Title": "straight line diagram", "Kind": "tool"})
    state.cur_response = {"proposals": [
        {"alias": "error message", "canonical": "error messages", "why": "A1 reverse to dodge the list"},
        {"alias": "route id", "canonical": "routeid", "why": "A3 joined side as canonical"},
        {"alias": "add events", "canonical": "add event", "why": "A1 but kinds differ"},
        {"alias": "pending aliases", "canonical": "pending alias", "why": "A1 canonical is pending"},
        {"alias": "straight line diagram", "canonical": "sld", "why": "B backwards"},
        {"alias": "sld", "canonical": "straight line diagram", "why": "B s-l-d"},
    ]}
    proc = run_curate(cfg_path, ["--live", "--progress"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("guard drops the wrong-way, mismatched-kind and pending-canonical pairs, keeps the right-way one",
          proc.returncode == 0 and "written=1 dropped=5" in out.get("line", "")
          and kwrows[CUR["sldx"]].get("CurationStatus") == "Proposed"
          and not kwrows[CUR["em"]].get("CurationStatus")
          and not kwrows[CUR["rid"]].get("CurationStatus")
          and not kwrows[CUR["aes"]].get("CurationStatus")
          and not kwrows[CUR["pend2"]].get("CurationStatus")
          and not kwrows[CUR["sldfull"]].get("CurationStatus"),
          str(out) + proc.stderr[-600:])
    check("the guard names each reason",
          "the canonical is the plural side" in proc.stderr
          and "the canonical is the joined form" in proc.stderr
          and "kinds differ ([tool] vs [topic])" in proc.stderr
          and "itself pending review" in proc.stderr
          and "the canonical is the abbreviation" in proc.stderr, proc.stderr[-900:])
    check("the pending row is neither in the vocabulary nor in the blocked list",
          "pending alias [topic]" not in mock.user_text(state.cur_last_request or {}).split("Titles that must NEVER")[0]
          and "pending alias" not in mock.user_text(state.cur_last_request or {}).split("Titles that must NEVER")[1]
          and "error messages" in mock.user_text(state.cur_last_request or {}).split("Titles that must NEVER")[1],
          mock.user_text(state.cur_last_request or {})[-400:])

    # ---- leg 3d1b: --approve / --withdraw, the review by list -------
    print("== review-by-list leg")
    CUR["pl"] = state.seed(LISTS["keywords"], {"Title": "polygon layer", "Kind": "topic"})
    CUR["pls"] = state.seed(LISTS["keywords"], {"Title": "polygon layers", "Kind": "topic",
                                                "CurationStatus": "Proposed",
                                                "ProposedCanonical": "polygon layer — A1 plural of polygon layer"})
    CUR["flip"] = state.seed(LISTS["keywords"], {"Title": "flip measure", "Kind": "topic",
                                                 "CurationStatus": "Proposed",
                                                 "ProposedCanonical": "flip measures — A1 singular vs plural"})
    CUR["flips"] = state.seed(LISTS["keywords"], {"Title": "flip measures", "Kind": "topic"})
    CUR["cx"] = state.seed(LISTS["keywords"], {"Title": "chain x", "Kind": "topic",
                                               "CurationStatus": "Proposed",
                                               "ProposedCanonical": "chain y — A2 typo"})
    CUR["cy"] = state.seed(LISTS["keywords"], {"Title": "chain y", "Kind": "topic",
                                               "CurationStatus": "Proposed",
                                               "ProposedCanonical": "chain z — A2 typo"})
    CUR["cz"] = state.seed(LISTS["keywords"], {"Title": "chain z", "Kind": "topic"})
    ids_path = os.path.join(tmp, "approve-ids.txt")
    with open(ids_path, "w") as f:
        f.write(f"# reviewed 2026-09-07\n{CUR['pls']}\n{CUR['flip']}  # wrong way\n{CUR['cx']}\n{CUR['cy']}\n999999\n{CUR['pl']}\n")
    proc = run_curate(cfg_path, ["--approve", ids_path])
    out = json.loads(proc.stdout.splitlines()[0])
    check("approve dry run plans without writing",
          proc.returncode == 0 and out.get("dry_run") is True
          and "mode=approve given=6 applied=2 skipped=4" in out.get("line", "")
          and kwrows[CUR["pls"]].get("CurationStatus") == "Proposed"
          and not kwrows[CUR["pls"]].get("CanonicalRefLookupId"), str(out) + proc.stdout[-500:])
    proc = run_curate(cfg_path, ["--approve", ids_path, "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("approve applies the reviewed merges and clears the flow-owned columns",
          proc.returncode == 0 and "applied=2 skipped=4" in out.get("line", "")
          and kwrows[CUR["pls"]].get("CanonicalRefLookupId") == int(CUR["pl"])
          and not kwrows[CUR["pls"]].get("CurationStatus") and not kwrows[CUR["pls"]].get("ProposedCanonical")
          and kwrows[CUR["cy"]].get("CanonicalRefLookupId") == int(CUR["cz"]),
          str(out) + str(kwrows[CUR["pls"]]) + str(kwrows[CUR["cy"]]))
    check("approve refuses a wrong-way proposal, a chain, an unknown id and a row with nothing pending",
          not kwrows[CUR["flip"]].get("CanonicalRefLookupId") and kwrows[CUR["flip"]].get("CurationStatus") == "Proposed"
          and not kwrows[CUR["cx"]].get("CanonicalRefLookupId") and kwrows[CUR["cx"]].get("CurationStatus") == "Proposed"
          and "the canonical is the plural side" in proc.stdout
          and "is itself in the review list as an alias" in proc.stdout
          and "999999: no such row" in proc.stdout
          and "not pending" in proc.stdout
          and "--repoint" in proc.stdout, proc.stdout[-900:])
    wd_path = os.path.join(tmp, "withdraw-ids.txt")
    with open(wd_path, "w") as f:
        f.write(f"{CUR['flip']}\n{CUR['pl']}\n{CUR['pls']}\n")
    proc = run_curate(cfg_path, ["--withdraw", wd_path, "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("withdraw clears a pending proposal and skips rows with nothing pending or already merged",
          proc.returncode == 0 and "mode=withdraw given=3 applied=1 skipped=2" in out.get("line", "")
          and not kwrows[CUR["flip"]].get("CurationStatus") and not kwrows[CUR["flip"]].get("ProposedCanonical")
          and "already merged" in proc.stdout, str(out) + proc.stdout[-400:])
    proc = run_curate(cfg_path, ["--approve", ids_path, "--withdraw", wd_path])
    check("approve and withdraw are separate commands", proc.returncode != 0 and "separate commands" in proc.stderr, proc.stderr[-200:])

    # ---- leg 3d1c: unmerge.mjs — the bulk undo, and its undo --------
    print("== unmerge leg")
    CUR["um"] = state.seed(LISTS["keywords"], {"Title": "unmerge me", "Kind": "topic",
                                               "CanonicalRefLookupId": int(CUR["pl"])})
    CUR["umr"] = state.seed(LISTS["keywords"], {"Title": "unmerge rejected", "Kind": "topic",
                                                "CurationStatus": "Rejected"})
    proc = run_unmerge(cfg_path, ["--all"])
    check("unmerge without a selection refuses; dry --all plans and writes nothing",
          run_unmerge(cfg_path, []).returncode != 0
          and proc.returncode == 0 and '"dry_run":true' in proc.stdout.splitlines()[0]
          and kwrows[CUR["um"]].get("CanonicalRefLookupId") == int(CUR["pl"]), proc.stdout[-300:])
    proc = run_unmerge(cfg_path, ["--all", "--reject", "--live"])
    check("unmerge --all --reject --live clears every CanonicalRef and marks the rows Rejected",
          proc.returncode == 0 and not kwrows[CUR["um"]].get("CanonicalRefLookupId")
          and kwrows[CUR["um"]].get("CurationStatus") == "Rejected"
          and not kwrows[CUR["pls"]].get("CanonicalRefLookupId"), proc.stdout[-300:] + str(kwrows[CUR["um"]]))
    proc = run_unmerge(cfg_path, ["--unreject", "--all"])
    check("unreject dry run selects the Rejected rows and writes nothing",
          proc.returncode == 0 and "mode=unreject" in proc.stdout and "cleared=" in proc.stdout
          and kwrows[CUR["um"]].get("CurationStatus") == "Rejected", proc.stdout[-300:])
    proc = run_unmerge(cfg_path, ["--unreject", "--all", "--live"])
    check("unreject --live clears Rejected so the rows are candidates again",
          proc.returncode == 0 and not kwrows[CUR["um"]].get("CurationStatus")
          and not kwrows[CUR["umr"]].get("CurationStatus")
          and not kwrows[CUR["ems"]].get("CurationStatus")
          and "rows unblocked" in proc.stdout, proc.stdout[-300:] + str(kwrows[CUR["umr"]]))
    check("unreject refuses --reject and --chains",
          run_unmerge(cfg_path, ["--unreject", "--all", "--reject"]).returncode != 0
          and run_unmerge(cfg_path, ["--unreject", "--chains"]).returncode != 0)
    # restore the merges the repoint leg below relies on
    kwrows[CUR["gantts"]]["CanonicalRefLookupId"] = int(CUR["gantt"])
    kwrows[CUR["gantts"]]["CurationStatus"] = None
    kwrows[CUR["wp"]]["CanonicalRefLookupId"] = int(CUR["workpackage"])
    kwrows[CUR["cb"]]["CanonicalRefLookupId"] = int(CUR["cc"])
    kwrows[CUR["wbs"]]["CanonicalRefLookupId"] = int(CUR["wbsfull"])
    kwrows[CUR["pls"]]["CanonicalRefLookupId"] = int(CUR["pl"])
    kwrows[CUR["cy"]]["CanonicalRefLookupId"] = int(CUR["cz"])

    # ---- leg 3d1d: the official vocabulary in curation ---------------
    # an official term (lib/vocabulary.mjs) is the canonical side: the
    # guard drops a pair that folds it into an unofficial title, and
    # --seed-vocabulary plants the missing terms and tools as rows
    print("== vocabulary leg")
    CUR["cpt"] = state.seed(LISTS["keywords"], {"Title": "calibration pt", "Kind": "topic"})
    state.cur_response = {"proposals": [
        {"alias": "calibration point", "canonical": "calibration pt", "why": "A2 official term as alias"},
        {"alias": "calibration pt", "canonical": "calibration point", "why": "A2 the right way"},
    ]}
    proc = run_curate(cfg_path, ["--live", "--progress"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("guard: the official Esri term is never the alias of an unofficial title",
          proc.returncode == 0 and "written=1 dropped=1" in out.get("line", "")
          and "the alias is the official Esri term" in proc.stderr
          and kwrows[CUR["cpt"]].get("CurationStatus") == "Proposed", str(out) + proc.stderr[-400:])
    # an official canonical wins over the plural rule: 'Reassign Routes'
    # is the tool's name, so its singular folds INTO the plural
    CUR["rr1"] = state.seed(LISTS["keywords"], {"Title": "reassign route", "Kind": "tool"})
    state.cur_response = {"proposals": [
        {"alias": "reassign route", "canonical": "reassign routes", "why": "A1 the official name is the plural"},
    ]}
    proc = run_curate(cfg_path, ["--live", "--progress"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("guard: an official canonical is the right side even when it is the plural",
          proc.returncode == 0 and "written=1 dropped=0" in out.get("line", "")
          and kwrows[CUR["rr1"]].get("CurationStatus") == "Proposed", str(out) + proc.stderr[-400:])
    kw_before = len(kwrows)
    proc = run_curate(cfg_path, ["--seed-vocabulary"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("seed-vocabulary dry run plans the missing rows and writes nothing",
          proc.returncode == 0 and out.get("dry_run") is True
          and "mode=seed-vocabulary official=6 created=2 present=4" in out.get("line", "")
          and len(kwrows) == kw_before, str(out))
    proc = run_curate(cfg_path, ["--seed-vocabulary", "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    seeded = {r.get("Title"): r for r in kwrows.values() if str(r.get("Notes", "")).startswith("Esri documentation")}
    check("seed-vocabulary --live creates the missing term and tool with the documentation page in Notes (the sweep's own rows count as present)",
          proc.returncode == 0 and "created=2 present=4" in out.get("line", "")
          and set(seeded) == {"project stationing", "append routes"}
          and seeded["append routes"].get("Kind") == "tool"
          and seeded["append routes"].get("Notes") == "Esri documentation tool: " + base + "/docsec/append-routes.html"
          and seeded["project stationing"].get("Kind") == "topic"
          and seeded["project stationing"].get("Notes") == "Esri documentation term: " + base + "/vocab.html#b",
          str(out) + str(seeded))
    proc = run_curate(cfg_path, ["--seed-vocabulary", "--live"])
    check("a second seed run creates nothing", "created=0 present=6" in proc.stdout, proc.stdout[-200:])

    # ---- leg 3d2: --repoint (the librarian junction backfill) ------
    # 'gantt charts' -> 'gantt chart' merged above; seed the historical
    # state the setup doc describes: doc 300 carries BOTH alias and
    # canonical junctions (alias row must be deleted), doc 301 only the
    # alias (row must be re-pointed, KWKey + Title recomposed).
    print("== repoint leg")
    dup = state.seed(LISTS["docKeywords"], {
        "Title": "OldDoc.pptx | gantt charts", "KWKey": f"300|{CUR['gantts']}",
        "DocumentLookupId": 300, "KeywordLookupId": int(CUR["gantts"])})
    state.seed(LISTS["docKeywords"], {
        "Title": "OldDoc.pptx | gantt chart", "KWKey": f"300|{CUR['gantt']}",
        "DocumentLookupId": 300, "KeywordLookupId": int(CUR["gantt"])})
    moved = state.seed(LISTS["docKeywords"], {
        "Title": "OtherDoc.pptx | gantt charts", "KWKey": f"301|{CUR['gantts']}",
        "DocumentLookupId": 301, "KeywordLookupId": int(CUR["gantts"])})
    dk = state.lists[LISTS["docKeywords"]]
    dk_count = len(dk)
    proc = run_curate(cfg_path, ["--dry-run", "--repoint"])
    check("repoint dry run plans without writing",
          proc.returncode == 0 and "repointed=1 deleted=1" in proc.stdout
          and len(dk) == dk_count and dup in dk, proc.stdout[-300:])
    proc = run_curate(cfg_path, ["--live", "--repoint"])
    check("repoint deletes the duplicate alias junction",
          proc.returncode == 0 and dup not in dk, proc.stdout[-300:])
    check("repoint re-points the lone alias junction",
          dk[moved].get("KeywordLookupId") == int(CUR["gantt"])
          and dk[moved].get("KWKey") == f"301|{CUR['gantt']}"
          and dk[moved].get("Title") == "OtherDoc.pptx | gantt chart",
          str(dk[moved]))
    check("repoint suggests the rerank pass",
          "--rerank" in proc.stdout or "rerank" in proc.stdout, proc.stdout[-300:])
    proc = run_curate(cfg_path, ["--live", "--repoint"])
    check("second repoint pass is a no-op",
          proc.returncode == 0 and "repointed=0 deleted=0" in proc.stdout,
          proc.stdout[-300:])

    # ---- leg 3e: full-corpus re-rank (no AI, no extraction) --------
    print("== rerank leg")
    llm_before_rr = state.llm_calls
    cur_before_rr = state.cur_calls
    proc = run_sweep(cfg_path, ["--live", "--rerank"])
    check("rerank exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    # 6 = the Indexed docs at this point (alpha, beta, notes, html,
    # outside.txt, outside.pdf); spec.pdf sits re-Skipped since the
    # no-tool leg, so rerank rightly leaves it (and its sidecar) alone
    check("rerank covered every indexed doc with a sidecar",
          out.get("mode") == "rerank" and out.get("reranked") == 6
          and out.get("no_sidecar") == 0 and out.get("errors") == 0, str(out))
    check("rerank made zero AI calls",
          state.llm_calls == llm_before_rr and state.cur_calls == cur_before_rr,
          f"llm={state.llm_calls} vs {llm_before_rr}")
    sc_rr = open(alpha_sc).read()
    check("rerank preserved keyword/id relateds (alpha still names beta)",
          f"<!-- rel:{beta_id} " in sc_rr, sc_rr[-400:])
    check("rerank upsert kept exactly one docs block",
          sc_rr.count("<!-- docs:begin -->") == 1
          and "[Extend a route](" in sc_rr,
          f"count={sc_rr.count('<!-- docs:begin -->')}")
    check("rerank rebuilt tool links from the junctions",
          "reassign-routes.html" in sc_rr and "_No page matched:_" in sc_rr,
          sc_rr[-700:])
    check("probe cache prevented re-probing across runs",
          state.probe_paths.count("/docs/realign-route.html") == 1
          and state.probe_paths.count("/docs/add-point-events.html") == 1,
          str(state.probe_paths))

    # ---- leg 3e2: --reformat rewrites bodies, nothing else ---------
    print("== reformat leg")
    cur_sc = open(beta_sc).read()
    head_before = cur_sc[:cur_sc.rindex("\n---\n") + 5]
    with open(beta_sc, "w") as f:  # simulate an old, untidied body
        f.write(head_before + "\nOLD BODY MARKER\n\n- a\n\n- b\n7\n")
    llm_before_rf = state.llm_calls
    spo_before_rf = state.spo_calls
    proc = run_sweep(cfg_path, ["--live", "--reformat"])
    check("reformat exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    after = open(beta_sc).read()
    check("reformat rewrote stale bodies",
          out.get("mode") == "reformat" and out.get("rewritten") >= 1
          and out.get("errors") == 0 and "OLD BODY MARKER" not in after, str(out))
    check("reformat preserved everything above the seam",
          after.startswith(head_before), after[:200])
    check("reformat body is freshly extracted and tidied",
          "## Slide 2" in after and "- Append Events" in after
          and "### Notes" not in after, after[-400:])
    alpha_after = open(alpha_sc).read()
    check("reformat re-derives the case grammar on the plan",
          "### TC-P01 — Loop Route { #tc-p01 }" in alpha_after
          and '<!-- lrs:case det=S1 conf=high src="slide 2 · case 3" -->' in alpha_after
          and "- **Group:** Line Network" in alpha_after, alpha_after[-600:])
    check("reformat leaves the story on tidied slide sections",
          "## Slide 4" in after and "### TC-" not in after, after[-400:])
    check("reformat spent no AI calls", state.llm_calls == llm_before_rf,
          f"{state.llm_calls} vs {llm_before_rf}")
    check("reformat re-synced case rows without churn",
          int(out.get("cases_upserted", 0)) == 0
          and int(out.get("cases_removed", 0)) == 0
          and int(out.get("case_errors", 0)) == 0, str(out))
    check("reformat is byte-idempotent on a format-3.0 head",
          (run_sweep(cfg_path, ["--live", "--reformat"]).returncode == 0
           and open(beta_sc).read() == after), open(beta_sc).read()[:300])
    # the one figure update is the vocabulary catch-up: "acquisition"
    # was minted by alpha's own index run, so it reaches alpha's figure
    # tags on the next reflow (the caseindex v1.2 accepted degradation)
    fig_rows_rf = [r for r in state.lists.get(LISTS["figures"], {}).values() if r.get("DocumentLookupId") == alpha_id]
    check("a keywords-only update patches only the changed fields: no hyperlink write, no SPO call (v1.62)",
          state.spo_calls == spo_before_rf and fig_rows_rf and all(isinstance(r.get("ImageLink"), dict) or r.get("Kind") == "diagram" for r in fig_rows_rf),
          f"spo calls {state.spo_calls} vs {spo_before_rf}; " + str(fig_rows_rf)[:300])
    check("reformat re-synced figure rows: no churn beyond the run-start vocabulary catch-up",
          int(out.get("figures_upserted", 0)) == 1
          and int(out.get("figures_removed", 0)) == 0
          and int(out.get("figure_errors", 0)) == 0
          and int(out.get("media_renamed", 0)) == 0
          and len(fig_rows_rf) == 2
          and [r.get("Keywords") for r in fig_rows_rf if r.get("Kind") == "image"] == ["acquisition"], str(out) + str(fig_rows_rf)[:300])
    check("reformat regenerates the drawing but rewrites nothing byte-identical",
          int(out.get("drawings", 0)) == 1 and int(out.get("drawings_written", 0)) == 0, str(out))
    # v1.59: a corpus still on the archive names (image1.png) converges
    # under --reformat — the file on disk moves to its standardized name
    # (no re-extraction), the body link follows, the figure row updates
    print("== media-rename leg")
    pretty_png = os.path.join(stem_dir, "fig-01-slide-01-alpha-test-plan-covering-lock.png")
    os.rename(pretty_png, os.path.join(stem_dir, "image1.png"))
    with open(alpha_sc, "w") as f:
        f.write(alpha_after.replace("![Figure 1 — Alpha test plan covering lock acquisition #123 for Roads and Highways](../media/123-alpha-plan/fig-01-slide-01-alpha-test-plan-covering-lock.png)",
                                    "![image1.png](../media/123-alpha-plan/image1.png)"))
    proc = run_sweep(cfg_path, ["--live", "--reformat"])
    check("media-rename reformat exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    alpha_renamed = open(alpha_sc).read()
    check("reformat moved the archive-named file to its standardized name",
          os.path.exists(pretty_png) and not os.path.exists(os.path.join(stem_dir, "image1.png"))
          and int(out.get("media_renamed", 0)) == 1, str(out) + str(os.listdir(stem_dir)))
    check("reformat relinked the body to the standardized name",
          "![Figure 1 — Alpha test plan covering lock acquisition #123 for Roads and Highways](../media/123-alpha-plan/fig-01-slide-01-alpha-test-plan-covering-lock.png)" in alpha_renamed
          and "image1.png" not in alpha_renamed, alpha_renamed[-400:])
    check("reformat spent no AI calls on the rename", state.llm_calls == llm_before_rf,
          f"{state.llm_calls} vs {llm_before_rf}")
    # the row already carried the standardized name (only the sidecar
    # and the disk were reverted), so converging them writes no row
    check("figure row stays on the standardized name with no churn",
          sorted(r.get("FileName") for r in state.lists.get(LISTS["figures"], {}).values()
                 if r.get("DocumentLookupId") == alpha_id) == ["fig-01-slide-01-alpha-test-plan-covering-lock.png", "fig-02-slide-05.svg"]
          and int(out.get("figures_upserted", 0)) == 0
          and int(out.get("media_moved", 0)) == 0, str(out))
    proc2 = run_sweep(cfg_path, ["--live", "--reformat"])
    out2 = json.loads(proc2.stdout.splitlines()[0])
    check("second reformat is a no-op on the renamed media (files, body, rows)",
          proc2.returncode == 0 and int(out2.get("media_renamed", 0)) == 0
          and int(out2.get("figures_upserted", 0)) == 0
          and open(alpha_sc).read() == alpha_renamed, str(out2))
    # v1.60: a file under an EARLIER standardized name (the v1.59 rule
    # left untitled slides slug-less) converges by its fig-NN-slide-KK
    # prefix — no re-extraction, the body relinks
    os.rename(pretty_png, os.path.join(stem_dir, "fig-01-slide-01.png"))
    with open(alpha_sc, "w") as f:
        f.write(alpha_renamed.replace("![Figure 1 — Alpha test plan covering lock acquisition #123 for Roads and Highways](../media/123-alpha-plan/fig-01-slide-01-alpha-test-plan-covering-lock.png)", "![Figure 1](../media/123-alpha-plan/fig-01-slide-01.png)"))
    proc = run_sweep(cfg_path, ["--live", "--reformat"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("reformat converges an earlier standardized name by its fig-NN-slide-KK prefix",
          proc.returncode == 0 and os.path.exists(pretty_png)
          and not os.path.exists(os.path.join(stem_dir, "fig-01-slide-01.png"))
          and int(out.get("media_renamed", 0)) == 1
          and open(alpha_sc).read() == alpha_renamed, str(out) + str(os.listdir(stem_dir)))
    alpha_after = alpha_renamed

    # ---- format-3.0 migration leg (Sidecar_Format_Plan phase 1) -----
    # a sidecar still in the v2.8 yaml frame (comment-hidden ```yaml
    # with the scored related: line, bare rel markers) must come out
    # of --reformat as a 3.0 file: table head, no yaml, scores moved
    # onto the markers, keywords/tools and the first extraction date
    # carried across
    print("== format-3.0 migration leg")
    tbl_start = after.index("| Field | Value |")
    tbl_end = after.index("\n## Summary")
    legacy_yaml = ("<!-- metadata\n```yaml\n"
                   'title: "Beta Story"\nsource_file: "Beta Story.pptx"\n'
                   "doc_id: 0\ndoc_kind: \"User Story\"\nsurface: \"Pro\"\n"
                   'doc_revision: "V9"\ntarget_release: ""\npe: ""\ndev: ""\n'
                   'author: "Old Author"\nlast_edited_by: "Old Author"\n'
                   'last_edited: "2026-08-01T00:00:00Z"\nextracted: 2026-01-02\n'
                   "extraction_lane: xmlstrip\nprompt_version: \"v1.9\"\n"
                   'keywords: ["Legacy Keyword", "locks"]\ntools: ["Old Tool"]\n'
                   'products: []\nissues: []\n'
                   'related: [{"doc":' + str(alpha_id) + ',"file":"x.md","s":42.5}]\n'
                   "```\n-->\n")
    legacy = after[:tbl_start] + legacy_yaml + after[tbl_end:]
    legacy = re.sub(r"<!-- rel:(\d+) s=[-\d.]+ -->", r"<!-- rel:\1 -->", legacy)
    with open(beta_sc, "w") as f:
        f.write(legacy)
    proc = run_sweep(cfg_path, ["--live", "--reformat"])
    check("migration reformat exit 0", proc.returncode == 0, proc.stderr[-400:])
    mig = open(beta_sc).read()
    check("legacy yaml frame becomes the 3.0 table",
          "<!-- metadata" not in mig and "```yaml" not in mig
          and "| Field | Value |" in mig and "| **Doc** |" in mig, mig[:500])
    check("migration carries keywords, tools, revision and the first extraction date",
          "| **Keywords** | Legacy Keyword · locks |" in mig
          and "| **Tools** | Old Tool |" in mig
          and "· rev V9 |" in mig
          and "| **Extracted** | 2026-01-02 · lane" in mig, mig[:700])
    check("migration moves the related scores onto the markers",
          f"<!-- rel:{alpha_id} s=42.5 -->" in mig, mig)
    check("migration keeps the summary, related region and body",
          "## Summary" in mig and "<!-- related:begin -->" in mig
          and "## Slide 2" in mig, mig[-300:])
    check("migrated file is byte-idempotent on the next reformat",
          (run_sweep(cfg_path, ["--live", "--reformat"]).returncode == 0
           and open(beta_sc).read() == mig), "")

    # ---- recase leg (Case_Index_Plan phase 2 — the backfill) -------
    # simulate a corpus indexed before the feature existed: wipe the
    # Test Cases list and plant an orphan row whose document is gone;
    # --recase must rebuild alpha's row from the sidecar ON DISK (no
    # extraction, no AI) and delete the orphan
    print("== recase leg")
    state.lists[LISTS["testCases"]] = {}
    state.seed(LISTS["testCases"], {
        "Title": "orphan", "DocumentLookupId": 99999, "CaseKey": "99999|1"})
    os.remove(os.path.join(sidecar_dir, "_Case Catalog.md"))
    llm_before_rc = state.llm_calls
    proc = run_sweep(cfg_path, ["--recase"])
    check("recase dry run exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("recase dry run plans but writes nothing",
          out.get("mode") == "recase" and out.get("dry_run") is True
          and int(out.get("cases_upserted", 0)) >= 1
          and int(out.get("cases_removed", 0)) >= 1
          and len(state.lists[LISTS["testCases"]]) == 1
          and not os.path.exists(os.path.join(sidecar_dir, "_Case Catalog.md")),
          str(out))
    proc = run_sweep(cfg_path, ["--recase", "--live"])
    check("recase live exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    tcs = list(state.lists.get(LISTS["testCases"], {}).values())
    check("recase rebuilt the plan's case rows from the sidecar on disk",
          len([r for r in tcs if r.get("DocumentLookupId") == alpha_id
               and r.get("CaseKey") == f"{alpha_id}|1"
               and r.get("Classification") == "Positive"]) == 1, str(tcs)[:400])
    check("recase deleted the orphan row",
          not [r for r in tcs if r.get("CaseKey") == "99999|1"], str(tcs)[:400])
    check("recase spent no AI calls", state.llm_calls == llm_before_rc,
          f"{state.llm_calls} vs {llm_before_rc}")
    check("recase counters report the walk",
          int(out.get("eligible", 0)) >= 1 and int(out.get("synced", 0)) >= 1
          and int(out.get("case_errors", 0)) == 0
          and int(out.get("no_seam", 0)) == 0, str(out))
    cat_rc = os.path.join(sidecar_dir, "_Case Catalog.md")
    check("recase live rebuilt the case catalog",
          os.path.exists(cat_rc) and "Alpha Plan" in open(cat_rc).read(),
          str(os.path.exists(cat_rc)))

    # ---- missing-column leg (v1.56, fail-soft) ----------------------
    # the tenant list predates the v2.0 columns: Graph rejects
    # SourceRef/Confidence; rows must still be written without them,
    # counted, with one note naming the tenant step — and the next
    # --recase after the columns exist fills them in
    print("== missing-column leg")
    state.lists[LISTS["testCases"]] = {}
    state.reject_fields = {"SourceRef", "Confidence"}
    proc = run_sweep(cfg_path, ["--recase", "--live"])
    check("missing columns: recase exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    mrows = [r for r in state.lists[LISTS["testCases"]].values() if r.get("DocumentLookupId") == alpha_id]
    check("missing columns: rows written without the unknown columns, no case errors",
          len(mrows) == 2 and all("SourceRef" not in r and "Confidence" not in r for r in mrows)
          and int(out.get("case_errors", 0)) == 0
          and int(out.get("case_fields_dropped", 0)) >= 2, str(out) + str(mrows)[:300])
    check("missing columns: one note per column naming the tenant step",
          proc.stderr.count("has no 'SourceRef' column") == 1
          and proc.stderr.count("has no 'Confidence' column") == 1
          and "SPList_TestCases.csv" in proc.stderr, proc.stderr[-600:])
    # a missing HYPERLINK column fails on the REST route AFTER the Graph
    # create: the row must be kept and patched, never created twice
    state.lists[LISTS["testCases"]] = {}
    state.reject_fields = {"FigureLink"}
    proc = run_sweep(cfg_path, ["--recase", "--live"])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    mrows = [r for r in state.lists[LISTS["testCases"]].values() if r.get("DocumentLookupId") == alpha_id]
    check("missing hyperlink column: rows written once without it, no case errors, no duplicates",
          proc.returncode == 0 and len(mrows) == 2 and all("FigureLink" not in r for r in mrows)
          and int(out.get("case_errors", 0)) == 0 and int(out.get("case_fields_dropped", 0)) >= 1
          and proc.stderr.count("has no 'FigureLink' column") == 1, str(out) + str(mrows)[:300] + proc.stderr[-300:])
    state.reject_fields = set()
    proc = run_sweep(cfg_path, ["--recase", "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    mrows = [r for r in state.lists[LISTS["testCases"]].values() if r.get("DocumentLookupId") == alpha_id]
    check("columns added: the next recase fills them in",
          all(r.get("SourceRef") and r.get("Confidence") == "high" for r in mrows)
          and int(out.get("case_fields_dropped", 0)) == 0, str(out) + str(mrows)[:300])
    tcs = list(state.lists.get(LISTS["testCases"], {}).values())

    # ---- refigure leg (Figure_Index_Plan — the backfill) -----------
    # wipe the Figures list and plant an orphan row whose document is
    # gone; --refigure must rebuild alpha's row from the sidecar ON DISK
    # (no extraction, no AI), delete the orphan, and rebuild the catalog
    print("== refigure leg")
    state.lists[LISTS["figures"]] = {}
    state.seed(LISTS["figures"], {
        "Title": "Orphan figure", "DocumentLookupId": 999999,
        "FigureKey": "999999|1", "Kind": "image",
    })
    llm_before_rg = state.llm_calls
    os.remove(fcat_path)
    proc = run_sweep(cfg_path, ["--refigure"])
    check("refigure dry run exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("refigure dry run plans but writes nothing",
          out.get("mode") == "refigure" and out.get("dry_run") is True
          and int(out.get("eligible", 0)) >= 2 and int(out.get("synced", 0)) >= 2
          and len(state.lists[LISTS["figures"]]) == 1
          and not os.path.exists(fcat_path), str(out))
    proc = run_sweep(cfg_path, ["--refigure", "--live"])
    check("refigure live exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    figs = list(state.lists.get(LISTS["figures"], {}).values())
    check("refigure rebuilt the figure row from the sidecar on disk",
          len([r for r in figs if r.get("DocumentLookupId") == alpha_id
               and r.get("FileName") == "fig-01-slide-01-alpha-test-plan-covering-lock.png" and r.get("Width") == 64]) == 1, str(figs)[:400])
    check("refigure deleted the orphan row",
          not [r for r in figs if r.get("FigureKey") == "999999|1"], str(figs)[:400])
    check("refigure spent no AI calls", state.llm_calls == llm_before_rg,
          f"{state.llm_calls} vs {llm_before_rg}")
    check("refigure counters report the walk",
          int(out.get("figures_upserted", 0)) == 2 and int(out.get("figures_removed", 0)) == 1
          and int(out.get("figure_errors", 0)) == 0, str(out))
    check("refigure live rebuilt the figure catalog",
          os.path.exists(fcat_path)
          and "[fig-01-slide-01-alpha-test-plan-covering-lock.png](<media/123-alpha-plan/fig-01-slide-01-alpha-test-plan-covering-lock.png>)" in open(fcat_path).read(),
          open(fcat_path).read()[:300] if os.path.exists(fcat_path) else "(missing)")
    # v1.1: a tiny picture on disk is Kind icon — swap the file for a
    # 16x16 and refigure; then restore
    with open(pretty_png, "wb") as f:
        f.write(ICON)
    proc = run_sweep(cfg_path, ["--refigure", "--live"])
    irow = [r for r in state.lists[LISTS["figures"]].values() if r.get("DocumentLookupId") == alpha_id and r.get("FigureNo") == 1]
    check("a 16x16 picture indexes as Kind icon with an Icon title",
          proc.returncode == 0 and len(irow) == 1 and irow[0].get("Kind") == "icon"
          and irow[0].get("Width") == 16 and irow[0].get("Title") == "Icon 1", str(irow)[:300])
    fcat_icon = open(fcat_path).read() if os.path.exists(fcat_path) else ""
    check("catalog sets icons aside (counted, not listed)",
          "(2: 0 images / 1 drawing / 1 icon)" in fcat_icon and "fig-01-slide-01-alpha" not in fcat_icon
          and "fig-02-slide-05.svg" in fcat_icon, fcat_icon[:400])
    with open(pretty_png, "wb") as f:
        f.write(PNG)
    proc = run_sweep(cfg_path, ["--refigure", "--live"])
    check("restoring the picture flips the row back to Kind image",
          proc.returncode == 0 and sorted(r.get("Kind") for r in state.lists[LISTS["figures"]].values()
                                          if r.get("DocumentLookupId") == alpha_id) == ["drawing", "image"], "")
    # v1.62: SharePoint throttling on the hyperlink route — the first two
    # SPO calls answer 429 + Retry-After; the run must honor it, finish
    # with every hyperlink written and no figure errors, and say so once
    print("== spo-throttle leg")
    state.lists[LISTS["figures"]] = {}
    state.spo_throttle = 2
    spo_before_th = state.spo_calls
    # the gate's graph section runs with maxRetries 0 (fail fast) and the
    # spo section inherits it; the throttle leg needs the real default
    cfg_spo = json.loads(json.dumps(cfg))
    cfg_spo["spo"]["maxRetries"] = 4
    cfg_spo_path = os.path.join(tmp, "config-spo-retries.json")
    with open(cfg_spo_path, "w") as f:
        json.dump(cfg_spo, f)
    proc = run_sweep(cfg_spo_path, ["--refigure", "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    trows = [r for r in state.lists[LISTS["figures"]].values() if r.get("DocumentLookupId") == alpha_id]
    check("throttled SPO writes are retried after Retry-After and succeed",
          proc.returncode == 0 and int(out.get("figure_errors", 0)) == 0 and len(trows) == 2
          and all(isinstance(r.get("ImageLink"), dict) for r in trows)
          and state.spo_calls - spo_before_th == len(trows) + 2
          and int(out.get("spo_throttled", 0)) == 2, str(out) + f" spo calls +{state.spo_calls - spo_before_th}")
    check("throttling is noted once on stderr, naming the knob",
          proc.stderr.count("SharePoint throttled the hyperlink-column route") == 1 and "spo.paceMs" in proc.stderr,
          proc.stderr[-400:])
    state.spo_throttle = 0
    # a file name near SharePoint's 255-character single-line cap: the
    # DocKeywords junction Title (`<file> | <keyword>`) must be capped
    print("== long-name leg")
    long_name = "L" * 240 + ".txt"
    ln_dir = os.path.join(cfg["paths"]["sourceLibrary"], "General") \
        if os.path.isdir(os.path.join(cfg["paths"]["sourceLibrary"], "General")) else src_dir
    with open(os.path.join(ln_dir, long_name), "w") as f:
        f.write("Long-named notes about calibration points and locks.\n")
    src_files.append(src_item(22, long_name, "2026-08-02T11:00:00Z"))
    state.llm_by_file[long_name] = {
        "title": "Long name notes", "docKind": "Other", "surface": "Pro", "summary": "x", "pe": "", "dev": "",
        "targetRelease": "", "tools": [], "keywords": ["calibration points", "locks"]}
    proc = run_sweep(cfg_path, ["--live", "--only", long_name])
    ln_id = next((k for k, v in state.lists[LISTS["docIndex"]].items() if v.get("FileName") == long_name), None)
    ln_rows = [state.lists[LISTS["docIndex"]][ln_id]] if ln_id else []
    ln_kw = [r for r in state.lists[LISTS["docKeywords"]].values()
             if ln_id and str(r.get("DocumentLookupId")) == str(ln_id)]
    # the long doc's relatedness was computed with notes.txt's body read
    # from DISK: the body index must see the words BEFORE notes' `---`
    # rule (the seam is the one after the related region), so the two
    # relate by body similarity
    notes_id_ln = next((k for k, v in state.lists[LISTS["docIndex"]].items() if v.get("FileName") == "notes.txt"), None)
    ln_url = str(ln_rows[0].get("TextFileUrl", {}).get("Url", "")) if ln_rows else ""
    ln_local = os.path.join(sidecar_dir, *[urllib.parse.unquote(x) for x in ln_url.split("/LRS Doc Index/")[-1].split("/")]) if ln_url else ""
    ln_sc = open(ln_local).read() if ln_local and os.path.exists(ln_local) else ""
    check("body index reads a neighbour's whole body from disk (a `---` rule inside the body is body)",
          f"<!-- rel:{notes_id_ln} " in ln_sc and "similar text" in ln_sc.split(f"<!-- rel:{notes_id_ln} ")[0].rsplit("\n", 1)[-1],
          ln_sc[-700:])
    check("long file name: junction titles are capped at 255 and the doc indexes",
          proc.returncode == 0 and ln_rows and ln_rows[0].get("IndexStatus") == "Indexed"
          and len(ln_kw) == 2 and all(len(str(r.get("Title", ""))) <= 255 for r in ln_kw),
          f"{len(ln_kw)} junctions, titles {[len(str(r.get('Title',''))) for r in ln_kw]} row={str(ln_rows)[:400]} rc={proc.returncode} err={proc.stderr[-600:]}")
    # a hyperlink write that FAILS after the Graph create (here: one 429
    # with the gate's maxRetries 0) must not leave the run with two Doc
    # Index rows for one DocKey — the created row is adopted and stamped
    # Error, and the next run repairs it in place
    print("== hyperlink-write-failure leg")
    lf_dir = os.path.join(cfg["paths"]["sourceLibrary"], "General") \
        if os.path.isdir(os.path.join(cfg["paths"]["sourceLibrary"], "General")) else src_dir
    with open(os.path.join(lf_dir, "linkfail.txt"), "w") as f:
        f.write("Route calibration notes for the link-failure leg.\n")
    src_files.append(src_item(21, "linkfail.txt", "2026-08-02T10:00:00Z"))
    state.spo_throttle = 1
    proc = run_sweep(cfg_path, ["--live", "--only", "linkfail.txt"])
    lf_rows = [r for r in state.lists[LISTS["docIndex"]].values() if r.get("FileName") == "linkfail.txt"]
    check("failed hyperlink write leaves exactly ONE Doc Index row, stamped Error",
          proc.returncode == 0 and len(lf_rows) == 1 and lf_rows[0].get("IndexStatus") == "Error"
          and "hyperlink write after create" in str(lf_rows[0].get("LastError", "")),
          f"rows={len(lf_rows)} {str(lf_rows)[:300]}")
    state.spo_throttle = 0
    proc = run_sweep(cfg_path, ["--live", "--only", "linkfail.txt"])
    lf_rows = [r for r in state.lists[LISTS["docIndex"]].values() if r.get("FileName") == "linkfail.txt"]
    check("the next run repairs that row in place (Indexed, SourceLink written, still one row)",
          proc.returncode == 0 and len(lf_rows) == 1 and lf_rows[0].get("IndexStatus") == "Indexed"
          and isinstance(lf_rows[0].get("SourceLink"), dict), f"rows={len(lf_rows)} {str(lf_rows)[:300]}")
    # a document reclassified into a kind folder where ANOTHER document
    # already owns its frozen stem must mint a fresh stem, never overwrite
    # the neighbour's sidecar
    print("== stem-collision leg")
    lf_url = str(lf_rows[0].get("TextFileUrl", {}).get("Url", ""))
    lf_stem = lf_url.rsplit("/", 1)[-1][:-3]
    decoy_sc = os.path.join(sidecar_dir, "Test Plans", f"{lf_stem}.md")
    with open(decoy_sc, "w") as f:
        f.write("# Decoy plan\nowned by another document\n")
    decoy_row = state.seed(LISTS["docIndex"], {
        "Title": "Decoy plan", "FileName": "decoy.pptx", "DocKind": "Test Plan",
        "DocKey": "shared documents/general/decoy.pptx", "IndexStatus": "Indexed",
        "SourceModified": "2026-08-01T10:00:00Z", "PromptVersion": STAMP,
        "TextFileUrl": {"Url": f"https://mock.example/sites/lrsworkspace/LRS Doc Index/Test Plans/{lf_stem}.md",
                        "Description": f"{lf_stem}.md"},
    })
    state.llm_by_file["linkfail.txt"] = {
        "title": "Linkfail notes", "docKind": "Test Plan", "surface": "Pro",
        "summary": "Reclassified into the plans folder.", "pe": "", "dev": "",
        "targetRelease": "", "tools": [], "keywords": ["calibration"]}
    src_files[-1]["fields"]["Modified"] = "2026-08-30T10:00:00Z"
    src_files[-1]["lastModifiedDateTime"] = "2026-08-30T10:00:00Z"
    proc = run_sweep(cfg_path, ["--live", "--only", "linkfail.txt"])
    lf_rows = [r for r in state.lists[LISTS["docIndex"]].values() if r.get("FileName") == "linkfail.txt"]
    new_url = str(lf_rows[0].get("TextFileUrl", {}).get("Url", "")) if lf_rows else ""
    check("reclassified doc whose frozen stem is taken in the new folder gets a fresh stem; the neighbour's file is untouched",
          proc.returncode == 0 and "/Test%20Plans/" in new_url.replace("/Test Plans/", "/Test%20Plans/")
          and not new_url.endswith(f"/{lf_stem}.md")
          and open(decoy_sc).read().startswith("# Decoy plan"), new_url + " " + proc.stderr[-300:])
    state.lists[LISTS["docIndex"]].pop(str(decoy_row), None)
    os.remove(decoy_sc)
    # the shared column-dropper covers the Figures list too
    state.lists[LISTS["figures"]] = {}
    state.reject_fields = {"Bytes"}
    proc = run_sweep(cfg_path, ["--refigure", "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    frows = [r for r in state.lists[LISTS["figures"]].values() if r.get("DocumentLookupId") == alpha_id]
    check("figures missing column: row written without it, one note naming the schema",
          proc.returncode == 0 and len(frows) == 2 and all("Bytes" not in r for r in frows)
          and int(out.get("figure_errors", 0)) == 0 and int(out.get("figure_fields_dropped", 0)) == 2
          and proc.stderr.count("Figures list has no 'Bytes' column") == 1
          and "SPList_Figures.csv" in proc.stderr and "--refigure --live" in proc.stderr,
          str(out) + proc.stderr[-400:])
    state.reject_fields = set()
    proc = run_sweep(cfg_path, ["--refigure", "--live"])
    frows = [r for r in state.lists[LISTS["figures"]].values() if r.get("DocumentLookupId") == alpha_id]
    check("figures column added: the next refigure fills it in",
          proc.returncode == 0
          and [int(r.get("Bytes") or 0) for r in frows if r.get("FigureNo") == 1] == [len(PNG)], str(frows)[:300])
    proc = run_sweep(cfg_path, ["--refigure", "--recase"])
    check("refigure refuses to combine with --recase",
          proc.returncode != 0 and "standalone" in proc.stderr, proc.stderr[-300:])

    # ---- case-index missing-GUID leg (fail-soft) -------------------
    print("== case-index missing-GUID leg")
    cfg_nocases = json.loads(json.dumps(cfg))
    del cfg_nocases["sharePoint"]["lists"]["testCases"]
    del cfg_nocases["sharePoint"]["lists"]["figures"]
    cfg_nocases_path = os.path.join(tmp, "config-nocases.json")
    with open(cfg_nocases_path, "w") as f:
        json.dump(cfg_nocases, f)
    proc = run_sweep(cfg_nocases_path, ["--only", "Alpha Plan.pptx"])
    check("missing GUID: sweep still runs, with the loud note",
          proc.returncode == 0 and "sharePoint.lists.testCases" in proc.stderr,
          proc.stderr[-400:])
    check("missing figures GUID: loud note, documents still index",
          "sharePoint.lists.figures" in proc.stderr and "--refigure" in proc.stderr, proc.stderr[-600:])
    proc = run_sweep(cfg_nocases_path, ["--refigure"])
    check("missing figures GUID: --refigure refuses, naming the fix",
          proc.returncode != 0 and "SPList_Figures.csv" in proc.stderr, proc.stderr[-300:])
    proc = run_sweep(cfg_nocases_path, ["--recase"])
    check("missing GUID: --recase refuses, naming the fix",
          proc.returncode != 0 and "Test Cases" in proc.stderr,
          proc.stderr[-400:])

    # ---- case-audit leg (Sidecar_Format_Plan phase 0) ---------------
    # --case-audit reads the sidecars on disk, runs the case parser plus
    # the latent-shape signals, and writes `_Case Audit.md` only on a
    # live run; no list writes, no AI, and no Test Cases GUID needed
    print("== case-audit leg")
    audit_pg = os.path.join(sidecar_dir, "_Case Audit.md")
    if os.path.exists(audit_pg):
        os.remove(audit_pg)
    llm_before_au = state.llm_calls
    proc = run_sweep(cfg_path, ["--case-audit"])
    check("case-audit dry run exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("case-audit dry run reports the walk and writes no page",
          out.get("mode") == "case-audit" and out.get("dry_run") is True
          and int(out.get("plans", 0)) >= 1 and int(out.get("covered", 0)) >= 1
          and int(out.get("no_seam", 0)) == 0
          and not os.path.exists(audit_pg), str(out))
    proc = run_sweep(cfg_path, ["--case-audit", "--live"])
    check("case-audit live exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("case-audit live wrote the audit page listing the covered plan",
          os.path.exists(audit_pg) and "Alpha Plan" in open(audit_pg).read()
          and "## Covered plans (" in open(audit_pg).read(), str(out))
    check("case-audit spent no AI calls and touched no list",
          state.llm_calls == llm_before_au
          and len(state.lists.get(LISTS["testCases"], {})) == len(tcs),
          f"{state.llm_calls} vs {llm_before_au}")
    check("case-audit log carries per-plan signals",
          any(k in json.load(open(out["logFile"])).get("plans", [{}])[0].get("signals", {})
              for k in ("caseTable", "posNegTable", "verifyBullets")), out.get("logFile", ""))
    proc = run_sweep(cfg_nocases_path, ["--case-audit"])
    check("case-audit runs without the Test Cases GUID",
          proc.returncode == 0 and json.loads(proc.stdout.splitlines()[0]).get("mode") == "case-audit",
          proc.stderr[-300:])
    proc = run_sweep(cfg_path, ["--case-audit", "--recase"])
    check("case-audit refuses to combine with --recase",
          proc.returncode != 0 and "standalone" in proc.stderr, proc.stderr[-300:])

    # ---- layout-audit leg (Markdown_Layout_Plan phase 6) -------------
    print("== layout-audit leg")
    layout_pg = os.path.join(sidecar_dir, "_Layout Audit.md")
    if os.path.exists(layout_pg):
        os.remove(layout_pg)
    llm_before_la = state.llm_calls
    proc = run_sweep(cfg_path, ["--layout-audit"])
    check("layout-audit dry run exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("layout-audit dry run walks the corpus and writes no page",
          out.get("mode") == "layout-audit" and out.get("dry_run") is True
          and int(out.get("sidecars", 0)) >= 2
          and not os.path.exists(layout_pg), str(out))
    check("a corpus the sweep just wrote carries no legacy shape",
          out.get("converged") == out.get("sidecars")
          and out.get("formats", {}).get("3.1") == out.get("sidecars")
          and sorted(out.get("retirable", [])) == sorted(out.get("shape_files", {}).keys()),
          str(out))
    # plant one legacy shape and prove the audit names it and its reader
    keep_alpha = open(alpha_sc).read()
    with open(alpha_sc, "w") as f:
        f.write(keep_alpha.replace("### TC-P01 — Loop Route { #tc-p01 }",
                                   "### TC-P01 — Loop Route", 1))
    proc = run_sweep(cfg_path, ["--layout-audit", "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("layout-audit live names the shape, its file and the reader it keeps alive",
          os.path.exists(layout_pg)
          and out.get("shape_files", {}).get("unanchoredCases") == 1
          and "unanchoredCases" not in out.get("retirable", [])
          and "caseindex.slugger" in open(layout_pg).read()
          and "Alpha Plan" in open(layout_pg).read().split("## Sidecars still carrying one")[-1],
          str(out))
    check("layout-audit says on stdout what can be retired now",
          "retirable now:" in proc.stdout and "yamlFrame" in proc.stdout, proc.stdout[-300:])
    check("layout-audit spent no AI calls and touched no list",
          state.llm_calls == llm_before_la
          and len(state.lists.get(LISTS["testCases"], {})) == len(tcs),
          f"{state.llm_calls} vs {llm_before_la}")
    with open(alpha_sc, "w") as f:
        f.write(keep_alpha)
    proc = run_sweep(cfg_path, ["--layout-audit", "--reformat"])
    check("layout-audit refuses to combine with another mode",
          proc.returncode != 0 and "standalone" in proc.stderr, proc.stderr[-300:])

    # ---- rename leg (Sidecar_Format_Plan phase 1b) -------------------
    # a corpus still on the pre-1b naming: alpha's sidecar sits at
    # {slug}__doc{id}.md with a flat media/doc10_*.png image, beta's
    # Related bullet links that old file. --rename-plan lists the move
    # and touches nothing; --rename --live renames the file, moves the
    # media into media/<stem>/, rewrites alpha's own links AND beta's
    # inbound link, patches TextFileUrl, and writes the manifest.
    print("== rename leg")
    alpha_dir = os.path.dirname(alpha_sc)
    old_name = f"alpha-plan-old__doc{alpha_id}.md"
    old_path = os.path.join(alpha_dir, old_name)
    cur = open(alpha_sc).read()
    legacy_media = os.path.join(sidecar_dir, "media", "doc10_image1.png")
    os.makedirs(os.path.dirname(legacy_media), exist_ok=True)
    shutil.copyfile(os.path.join(stem_dir, "fig-01-slide-01-alpha-test-plan-covering-lock.png"), legacy_media)
    with open(old_path, "w") as f:
        f.write(cur.replace("../media/123-alpha-plan/fig-01-slide-01-alpha-test-plan-covering-lock.png", "../media/doc10_image1.png"))
    os.remove(alpha_sc)
    shutil.rmtree(stem_dir)
    old_url = state.lists[LISTS["docIndex"]][str(alpha_id)]["TextFileUrl"]["Url"]
    new_url_expected = old_url
    old_url = old_url.rsplit("/", 1)[0] + "/" + old_name
    state.lists[LISTS["docIndex"]][str(alpha_id)]["TextFileUrl"] = {"Url": old_url, "Description": old_name}
    beta_txt = open(beta_sc).read().replace("123-alpha-plan.md", old_name)
    # a neighbour whose file name merely ENDS with alpha's old name must
    # keep its link when alpha is renamed (whole-name matching)
    decoy_name = f"z{old_name}"
    beta_txt += f"\n[decoy](<https://mock.example/sites/lrsworkspace/LRS Doc Index/Test Plans/{decoy_name}>)\n"
    with open(beta_sc, "w") as f:
        f.write(beta_txt)
    proc = run_sweep(cfg_path, ["--rename-plan"])
    check("rename-plan exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("rename-plan lists alpha's move and writes nothing",
          out.get("mode") == "rename" and out.get("dry_run") is True
          and int(out.get("renamed", 0)) == 1
          and f"Test Plans/{old_name} -> 123-alpha-plan.md" in proc.stdout
          and os.path.exists(old_path) and not os.path.exists(alpha_sc), proc.stdout[:600])
    proc = run_sweep(cfg_path, ["--rename", "--live"])
    check("rename live exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    renamed = open(alpha_sc).read() if os.path.exists(alpha_sc) else ""
    check("rename moved the sidecar to <issue>-<slug>.md and removed the old file",
          os.path.exists(alpha_sc) and not os.path.exists(old_path)
          and int(out.get("renamed", 0)) == 1 and int(out.get("errors", 0)) == 0, str(out))
    check("rename moved the flat media into media/<stem>/ and relinked the body",
          os.path.exists(os.path.join(stem_dir, "image1.png"))
          and not os.path.exists(legacy_media)
          and "](../media/123-alpha-plan/image1.png)" in renamed
          and "doc10_image1.png" not in renamed, renamed[-500:])
    check("rename rewrote beta's inbound link",
          "123-alpha-plan.md" in open(beta_sc).read()
          and f"/{old_name}" not in open(beta_sc).read(), open(beta_sc).read()[-500:])
    check("rename left the neighbour whose name only ends with the old name alone",
          f"/{decoy_name}" in open(beta_sc).read(), open(beta_sc).read()[-300:])
    check("rename patched TextFileUrl",
          state.lists[LISTS["docIndex"]][str(alpha_id)]["TextFileUrl"]["Url"] == new_url_expected,
          str(state.lists[LISTS["docIndex"]][str(alpha_id)]["TextFileUrl"]))
    manifest_path = os.path.join(sidecar_dir, "_Manifest.json")
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}
    check("rename wrote the manifest (id -> path, stem, issue)",
          manifest.get("docs", {}).get(str(alpha_id), {}).get("path") == "Test Plans/123-alpha-plan.md"
          and manifest["docs"][str(alpha_id)].get("stem") == "123-alpha-plan"
          and manifest["docs"][str(alpha_id)].get("issue") == 123, str(manifest)[:400])
    check("rename told the operator to recase",
          "--recase --live" in proc.stdout, proc.stdout[-300:])
    proc = run_sweep(cfg_path, ["--rename", "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("rename is a no-op the second time",
          int(out.get("renamed", 0)) == 0 and int(out.get("errors", 0)) == 0, str(out))

    # ---- related recency date leg ---------------------------------------
    # RelatedRank's recency bonus is measured against the run's DATE (or
    # sweep.relatedToday), not the wall clock at call time: a --rerank
    # pinned to a far date scores differently, and two reranks pinned to
    # one date are byte-identical
    print("== related recency date leg")
    def rerank_with(today):
        c = json.loads(json.dumps(cfg))
        c["sweep"]["relatedToday"] = today
        c["sweep"]["relatedWeights"] = json.loads(c["sweep"].get("relatedWeights", "{}") or "{}") \
            if isinstance(c["sweep"].get("relatedWeights"), str) else c["sweep"].get("relatedWeights", {})
        c["sweep"]["relatedWeights"] = json.dumps({**c["sweep"]["relatedWeights"], "recency": {"weight": 50, "halfLifeDays": 180}})
        cp = os.path.join(tmp, f"config-today-{today}.json")
        with open(cp, "w") as f:
            json.dump(c, f)
        p = run_sweep(cp, ["--rerank", "--live"])
        txt = open(alpha_sc).read()
        return p, re.findall(r"<!-- rel:\d+ s=([-\d.]+) -->", txt)
    p1, s1 = rerank_with("2026-08-20")
    p2, s2 = rerank_with("2030-01-01")
    p3, s3 = rerank_with("2026-08-20")
    check("related recency follows the pinned run date and is reproducible for one date",
          p1.returncode == 0 and p2.returncode == 0 and p3.returncode == 0
          and len(s1) > 0 and s1 != s2 and s1 == s3, f"{s1} {s2} {s3} {p2.stderr[-200:]}")

    # ---- normalize-cases leg (Sidecar_Format_Plan phase 4) ----------
    # a Test Plan the detectors leave caseless but the audit flags (an
    # old collapsed-cell table): dry lists it and spends nothing; live
    # refuses without the owner switch; enabled, one model call rewrites
    # the body ONLY when the reply passes lint + grounding, mints LLM
    # rows, and is not called again; an inventing reply is refused and
    # the file stays; --reformat keeps an LLM body.
    print("== normalize-cases leg")
    gamma_body = ("## Slide 1 — Gamma cases\n\n| Positive Tests: Normal Routes |\n| --- |\n"
                  "| Correct line order of 100, 200, 300 on a normal line Correct line order of 300, 400, 500 on a gapped line |\n")
    gamma_dir = os.path.join(sidecar_dir, "Test Plans")
    gamma_path = os.path.join(gamma_dir, "gamma-plan.md")
    gamma_head = ("# Gamma Plan\n\n| Field | Value |\n| --- | --- |\n| **Doc** | 0 · Test Plan · Pro |\n"
                  "| **Product** | — |\n| **Release** | — |\n| **Issues** | — |\n| **Source** | [g.pptx](<https://x/g.pptx>) |\n"
                  "| **People** | author — · PE — · dev — |\n| **Edited** | — |\n"
                  "| **Extracted** | 2026-09-05 · lane xmlstrip · format 3.0 · prompt v2.0 |\n| **Keywords** | — |\n| **Tools** | — |\n\n"
                  "## Summary\n\nGamma.\n\n## Related documents\n\n<!-- related:begin -->\n_None yet._\n<!-- related:end -->\n\n---\n\n")
    with open(gamma_path, "w") as f:
        f.write(gamma_head + gamma_body)
    gamma_id = int(state.seed(LISTS["docIndex"], {
        "Title": "Gamma Plan", "FileName": "Gamma Plan.pptx", "DocKey": "shared documents/general/gamma plan.pptx",
        "IndexStatus": "Indexed", "DocKind": "Test Plan", "Surface": "Pro", "PromptVersion": STAMP,
        "SourceModified": "2026-08-01T00:00:00Z",
        "TextFileUrl": {"Url": cfg["sweep"]["siteUrl"] + "/LRS Doc Index/Test Plans/gamma-plan.md",
                        "Description": "gamma-plan.md"}}))
    llm_before_nz = state.llm_calls
    proc = run_sweep(cfg_path, ["--normalize-cases"])
    check("normalize dry run exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("normalize dry run lists the caseless-with-signal plan and spends nothing",
          out.get("mode") == "normalize-cases" and out.get("dry_run") is True
          and int(out.get("candidates", 0)) == 1 and int(out.get("normalized", 0)) == 0
          and state.llm_calls == llm_before_nz
          and open(gamma_path).read() == gamma_head + gamma_body, str(out))
    saved_llm = cfg["llm"]
    cfg["llm"] = {"apiKey": "mock-key", "baseUrl": base, "maxRetries": 0}
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--normalize-cases", "--live"])
    check("normalize live refuses without the owner switch",
          proc.returncode != 0 and "normalizeCases.enabled" in proc.stderr, proc.stderr[-300:])
    cfg["sweep"]["normalizeCases"] = {"enabled": True, "maxPerRun": 5}
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    state.gen_text = ("Here you go:\n```markdown\n## Test Cases\n\n"
                      "### TC-P01 — Correct line order of 100, 200, 300 on a normal line <!-- src: LLM · slide 1 · Positive Tests: Normal Routes · 1 -->\n"
                      "- **Group:** Normal Routes\n\n"
                      "### TC-P02 — Correct line order of 300, 400, 500 on a gapped line <!-- src: LLM · slide 1 · Positive Tests: Normal Routes · 2 -->\n"
                      "- **Group:** Normal Routes\n```\n")
    proc = run_sweep(cfg_path, ["--normalize-cases", "--live"])
    check("normalize live exit 0", proc.returncode == 0, proc.stderr[-400:])
    out = json.loads(proc.stdout.splitlines()[0])
    gamma_now = open(gamma_path).read()
    check("normalize live: one model call, the plan normalized",
          state.llm_calls == llm_before_nz + 1 and int(out.get("normalized", 0)) == 1
          and int(out.get("refused", 0)) == 0, str(out))
    check("normalize live: head preserved, body is the verified grammar with LLM provenance",
          gamma_now.startswith(gamma_head)
          and "### TC-P01 — Correct line order of 100, 200, 300 on a normal line { #tc-p01 }" in gamma_now
          and "```" not in gamma_now, gamma_now[-500:])
    check("normalize live: the accepted reply is canonicalized into the case block",
          '<!-- lrs:case det=LLM conf=llm src="slide 1' in gamma_now
          and "<!-- src: LLM" not in gamma_now, gamma_now[-500:])
    check("normalize prompt carried the plan title and body",
          state.gen_prompts and "Gamma Plan" in state.gen_prompts[-1]
          and "Correct line order of 100, 200, 300" in state.gen_prompts[-1], str(state.gen_prompts[-1:])[:300])
    grows = [r for r in state.lists.get(LISTS["testCases"], {}).values() if r.get("DocumentLookupId") == gamma_id]
    check("normalize live: case rows minted with the LLM shape and llm confidence",
          len(grows) == 2 and all(r.get("Shape") == "LLM" and r.get("Confidence") == "llm" for r in grows)
          and grows[0].get("Group") == "Normal Routes", str(grows)[:400])
    proc = run_sweep(cfg_path, ["--normalize-cases", "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("normalize is not called again on a normalized plan",
          int(out.get("candidates", 0)) == 0 and state.llm_calls == llm_before_nz + 1, str(out))
    # an oversized body is skipped and counted, never sent
    with open(gamma_path, "w") as f:
        f.write(gamma_head + gamma_body)
    cfg["sweep"]["normalizeCases"]["maxInputChars"] = 10
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--normalize-cases", "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("normalize skips a body over maxInputChars without a model call",
          int(out.get("skipped_large", 0)) == 1 and int(out.get("candidates", 0)) == 0
          and state.llm_calls == llm_before_nz + 1, str(out))
    del cfg["sweep"]["normalizeCases"]["maxInputChars"]
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    # an inventing reply is refused whole
    state.gen_text = ("## Test Cases\n\n### TC-P01 — Elephants roam the savanna at dusk <!-- src: LLM · slide 1 -->\n"
                      "| Route | R9 |\n| --- | --- |\n| R9 | 5 |\n")
    proc = run_sweep(cfg_path, ["--normalize-cases", "--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("normalize refuses an inventing reply and leaves the file untouched",
          int(out.get("refused", 0)) == 1 and int(out.get("normalized", 0)) == 0
          and open(gamma_path).read() == gamma_head + gamma_body
          and "NORMALIZE REFUSED" in proc.stderr, str(out) + proc.stderr[-300:])
    cfg["llm"] = saved_llm
    del cfg["sweep"]["normalizeCases"]
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    # --reformat keeps an LLM-normalized body (alpha stands in: mark
    # its body, reformat, restore)
    alpha_keep = open(alpha_sc).read()
    with open(alpha_sc, "w") as f:
        f.write(alpha_keep.replace('<!-- lrs:case det=S1 conf=high src="slide 2 · case 3" -->',
                                   '<!-- lrs:case det=LLM conf=llm src="slide 2 · case 3" -->', 1))
    proc = run_sweep(cfg_path, ["--live", "--reformat"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("--reformat keeps an LLM-normalized body",
          int(out.get("llm_kept", 0)) == 1
          and 'det=LLM' in open(alpha_sc).read(), str(out))
    with open(alpha_sc, "w") as f:
        f.write(alpha_keep)
    run_sweep(cfg_path, ["--live", "--reformat"])
    del state.lists[LISTS["docIndex"]][str(gamma_id)]
    os.remove(gamma_path)
    for k in [k for k, r in state.lists.get(LISTS["testCases"], {}).items() if r.get("DocumentLookupId") == gamma_id]:
        del state.lists[LISTS["testCases"]][k]

    # ---- story-profile leg (Sidecar_Format_Plan phase 5) ------------
    # a User Story deck in the team template maps onto the story/v1
    # sections; the messy story fixture (no canonical titles) stays on
    # its tidied slide sections (checked above)
    print("== story-profile leg")
    story_dir = os.path.join(cfg["paths"]["sourceLibrary"], "General") \
        if os.path.isdir(os.path.join(cfg["paths"]["sourceLibrary"], "General")) else src_dir
    make_story_pptx(os.path.join(story_dir, "Delta Story.pptx"), "Split Events Story")
    state.llm_by_file["Delta Story.pptx"] = {
        "title": "Split Events Story", "docKind": "User Story", "surface": "Pro",
        "summary": "A story about splitting events.", "pe": "", "dev": "",
        "targetRelease": "", "tools": [], "keywords": ["split events"]}
    src_files.append(src_item(31, "Delta Story.pptx", "2026-08-23T10:00:00Z"))
    proc = run_sweep(cfg_path, ["--live", "--only", "Delta Story.pptx"])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.stdout.strip() else {}
    check("story deck indexed and profiled",
          proc.returncode == 0 and out.get("processed") == 1
          and int(out.get("stories_profiled", 0)) == 1, str(out) + proc.stderr[-300:])
    delta_row = next((f_ for f_ in state.lists[LISTS["docIndex"]].values()
                      if f_.get("FileName") == "Delta Story.pptx"), {})
    delta_url = str(delta_row.get("TextFileUrl", {}).get("Url", ""))
    delta_local = os.path.join(sidecar_dir, *[urllib.parse.unquote(x) for x in delta_url.split("/LRS Doc Index/")[-1].split("/")]) if delta_url else ""
    ds = open(delta_local).read() if delta_local and os.path.exists(delta_local) else ""
    body_ds = ds[ds.rindex("\n---\n") + 5:] if "\n---\n" in ds else ""
    check("story/v1 sections in canonical order",
          [m for m in re.findall(r"(?m)^## (.+)$", body_ds)]
          == ["Story", "Acceptance Criteria", "Testing", "Automation", "Documentation", "Assignment"],
          body_ds[:600])
    check("title slide and User Story slide land under Story with provenance",
          "### Split Events Story <!-- slide 1 -->" in body_ds
          and "### User Story <!-- slide 2 -->" in body_ds
          and "As a LRS editor" in body_ds.split("## Acceptance Criteria")[0], body_ds[:600])
    ac_part = body_ds.split("## Acceptance Criteria")[1].split("## Testing")[0] \
        if "## Acceptance Criteria" in body_ds else ""
    check("the feature slide becomes an Acceptance Criteria subsection",
          "### Split behaviour <!-- slide 3 -->" in ac_part, body_ds)
    check("canonical slides carry only their slide comment",
          "<!-- slide 4 -->\nTest on normal and gapped routes." in body_ds
          and "### Testing" not in body_ds, body_ds)
    check("story deck is not a case source",
          not [r for r in state.lists.get(LISTS["testCases"], {}).values()
               if r.get("DocumentLookupId") == int(delta_row.get("id", 0) or 0)]
          and "### TC-" not in body_ds, body_ds)

    # ---- leg 3f: doc_crawl — page inventory for link matching ------
    print("== doc crawl leg")
    pages_out = os.path.join(tmp, "pages.json")
    proc = run_node(
        ["node", "--experimental-strip-types", DOC_CRAWL,
         "--section", base + "/docsec/", "--section", base + "/docsec2/",
         "--out", pages_out],
    )
    check("doc crawl exit 0", proc.returncode == 0, proc.stderr[-300:])
    inv = json.load(open(pages_out))
    urls_of = lambda sec: sorted(
        e["url"] if isinstance(e, dict) else e for e in inv.get(sec, []))
    check("sitemap-backed section enumerated (out-of-section excluded)",
          urls_of(base + "/docsec/") ==
          [base + "/docsec/a.html", base + "/docsec/b.html"], str(inv))
    check("crawl fallback enumerated and stayed in section",
          set(urls_of(base + "/docsec2/")) ==
          {base + "/docsec2/x.html", base + "/docsec2/y.html"}, str(inv))
    titled = [e for e in inv.get(base + "/docsec2/", [])
              if isinstance(e, dict) and e.get("title")]
    check("crawled pages carry their real <title>",
          any(e["title"] == "Page X" for e in titled), str(titled))
    check("crawl printed the urls to stdout",
          base + "/docsec/a.html" in proc.stdout
          and base + "/docsec2/y.html" in proc.stdout, proc.stdout[-300:])
    spec_rr = open(spec_sc_path).read()
    check("rerank left the non-Indexed doc's sidecar untouched (spec still names notes)",
          f"<!-- rel:{notes_id} " in spec_rr and "similar text " in spec_rr,
          spec_rr[-400:])

    # ---- leg 3g: Graph download fallback for unsynced sources ------
    # missing.txt is in scope but absent on disk (OneDrive lag) and has
    # sat in the Error lane since leg 2. With the opt-in fallback the
    # sweep fetches its bytes through Graph and indexes it this run.
    print("== graph download fallback leg")
    cfg["sweep"]["graphDownloadFallback"] = True
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "missing.txt"])
    out = json.loads(proc.stdout.splitlines()[0])
    row = [f_ for f_ in state.lists[LISTS["docIndex"]].values()
           if f_.get("FileName") == "missing.txt"][0]
    check("unsynced doc indexed via Graph download",
          proc.returncode == 0 and out.get("graph_downloads") == 1
          and row.get("IndexStatus") == "Indexed",
          str(out) + " " + str(row)[:200])
    check("fallback downloaded the right item",
          state.content_downloads == ["16"], str(state.content_downloads))
    # the same fallback covers a source that is ON disk but unreadable
    # (v1.64, the OneDrive placeholder shape): locked.pptx has sat in the
    # Error lane since leg 2; with its real bytes served through Graph
    # it indexes this run instead of erroring another night
    locked_real = os.path.join(tmp, "locked-real.pptx")
    make_pptx(locked_real, "Locked deck whose local copy never hydrated, fetched through Graph")
    state.content_bytes["21"] = open(locked_real, "rb").read()
    proc = run_sweep(cfg_path, ["--live", "--only", "locked.pptx"])
    out = json.loads(proc.stdout.splitlines()[0])
    row = [f_ for f_ in state.lists[LISTS["docIndex"]].values()
           if f_.get("FileName") == "locked.pptx"][0]
    check("unreadable local copy indexed via Graph download",
          proc.returncode == 0 and out.get("graph_downloads") == 1
          and out.get("unreadable_local") == 1 and out.get("errors") == 0
          and row.get("IndexStatus") == "Indexed" and row.get("LastError", "") == ""
          and state.content_downloads == ["16", "21"],
          str(out) + " " + str(row)[:200] + " " + str(state.content_downloads))
    # --reformat takes the same fallback: the alpha source is moved away,
    # the reformat still re-extracts it through Graph (no REFORMAT ERROR)
    alpha_candidates = [os.path.join(cfg["paths"]["sourceLibrary"], "General", "Alpha Plan.pptx"),
                        os.path.join(cfg["paths"]["sourceLibrary"], "Alpha Plan.pptx"),
                        os.path.join(src_dir, "Alpha Plan.pptx")]
    alpha_src = next(p for p in alpha_candidates if os.path.exists(p))
    alpha_src_aside = alpha_src + ".aside"
    os.rename(alpha_src, alpha_src_aside)
    state.content_bytes["10"] = open(alpha_src_aside, "rb").read()
    dl_before_rf = len(state.content_downloads)
    proc = run_sweep(cfg_path, ["--live", "--reformat", "--only", "Alpha Plan.pptx"])
    out = json.loads(proc.stdout.splitlines()[0])
    os.rename(alpha_src_aside, alpha_src)
    del state.content_bytes["10"]
    check("reformat re-extracts an unsynced source through the Graph fallback",
          proc.returncode == 0 and int(out.get("graph_downloads", 0)) == 1
          and int(out.get("errors", 0)) == 0 and int(out.get("eligible", 0)) == 1
          and len(state.content_downloads) == dl_before_rf + 1
          and "REFORMAT ERROR" not in proc.stderr, str(out) + proc.stderr[-300:])
    cfg["sweep"]["graphDownloadFallback"] = False
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)

    # ---- synced-subfolder leg (v1.55): the sync roots at the library's
    # General child, so paths.sourceLibrary IS General — with
    # sharePoint.syncedSubfolder the local path resolves without any
    # Graph download; a doc outside General still misses locally
    print("== synced-subfolder leg")
    saved_src = cfg["paths"]["sourceLibrary"]
    general_dir = os.path.join(saved_src, "General")
    if os.path.isdir(general_dir):
        cfg["paths"]["sourceLibrary"] = general_dir
        cfg["sharePoint"]["syncedSubfolder"] = "General"
        with open(cfg_path, "w") as f:
            json.dump(cfg, f)
        dl_before_ss = len(state.content_downloads)
        proc = run_sweep(cfg_path, ["--live", "--reformat", "--only", "Alpha Plan.pptx"])
        out = json.loads(proc.stdout.splitlines()[0])
        check("syncedSubfolder: the source resolves locally, no download, no error",
              proc.returncode == 0 and int(out.get("eligible", 0)) == 1
              and int(out.get("errors", 0)) == 0
              and int(out.get("graph_downloads", 0)) == 0
              and len(state.content_downloads) == dl_before_ss, str(out) + proc.stderr[-300:])
        cfg["paths"]["sourceLibrary"] = saved_src
        del cfg["sharePoint"]["syncedSubfolder"]
        with open(cfg_path, "w") as f:
            json.dump(cfg, f)
    else:
        check("syncedSubfolder leg precondition: a General child exists", False, general_dir)

    # ---- leg 3h: OCR lane for image-only PDFs (v1.36, opt-in) ------
    # scan.pdf sat Skipped at lane "plaintext" (pdftotext found no
    # text). With tesseract configured the OCR rescue re-enters it,
    # pdftoppm renders pages, tesseract reads them, and the doc
    # indexes at lane "ocr" — which also blocks any re-rescue loop.
    print("== ocr lane leg")
    ppm_stub = os.path.join(tmp, "pdftoppm")
    with open(ppm_stub, "w") as f:
        f.write('#!/bin/sh\nif [ "$1" = "-v" ]; then exit 0; fi\n'
                'touch "$7-1.png"\n')  # -png -r 200 -l N <pdf> <root>: root is $7
    tess_stub = os.path.join(tmp, "tesseract")
    with open(tess_stub, "w") as f:
        f.write('#!/bin/sh\nif [ "$1" = "--version" ]; then exit 0; fi\n'
                'echo "Scanned OCR text about calibration measures."\n')
    for s in (ppm_stub, tess_stub):
        os.chmod(s, 0o755)
    cfg["sweep"]["tesseractPath"] = tess_stub
    cfg["sweep"]["pdftoppmPath"] = ppm_stub
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "scan.pdf"])
    out = json.loads(proc.stdout.splitlines()[0])
    row = [f_ for f_ in state.lists[LISTS["docIndex"]].values()
           if f_.get("FileName") == "scan.pdf"][0]
    check("image-only pdf rescued and indexed through OCR",
          proc.returncode == 0 and out.get("processed") == 1
          and row.get("IndexStatus") == "Indexed"
          and row.get("ExtractionLane") == "ocr"
          and "Scanned OCR text" in str(row.get("TextPreview", "")),
          str(out) + " " + str(row)[:250])
    # second run: lane "ocr" marks the attempt — no rescue loop
    proc = run_sweep(cfg_path, ["--live", "--only", "scan.pdf"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("OCR-stamped doc does not rechurn", out.get("processed") == 0, str(out))
    del cfg["sweep"]["tesseractPath"]
    del cfg["sweep"]["pdftoppmPath"]
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)

    # ---- leg 3i: .msg lane (v1.37) ---------------------------------
    # An Outlook message pre-stamped Skipped at lane "none" (the state
    # every .msg row is in today) rescues once the lane exists: CFB
    # parsed, subject/From/To/Sent + body as the sidecar text, the
    # message's own sender/sent-time as the authorship trail, and the
    # attachment sub-storage's identically-named body stream ignored.
    print("== msg lane leg")
    make_msg(os.path.join(widened_dir, "message.msg"),
             "Weekly LRS sync notes", "Kevin Roper", "LRS Team",
             ("Notes from the weekly LRS sync about calibration points "
              "and event behavior on merged routes.\r\n\r\n") * 30,
             1787239800000)  # 2026-08-20T15:30:00Z
    src_files.append(src_item(21, "message.msg", "2026-08-21T09:00:00Z",
                              seg="Shared Documents"))
    state.seed(LISTS["docIndex"], {
        "Title": "message.msg", "FileName": "message.msg",
        "DocKey": "shared documents/message.msg", "IndexStatus": "Skipped",
        "SourceModified": "2026-08-21T09:00:00Z", "PromptVersion": STAMP,
        "ExtractionLane": "none"})
    state.llm_by_file["message.msg"] = {
        "title": "Weekly Sync Notes", "docKind": "Other", "surface": "Other",
        "summary": "Sync notes email.", "pe": "", "dev": "",
        "targetRelease": "", "tools": [], "keywords": []}
    proc = run_sweep(cfg_path, ["--live", "--only", "message.msg"])
    out = json.loads(proc.stdout.splitlines()[0])
    row = [f_ for f_ in state.lists[LISTS["docIndex"]].values()
           if f_.get("FileName") == "message.msg"][0]
    check("stamped .msg rescued and indexed through the msg lane",
          proc.returncode == 0 and out.get("processed") == 1
          and row.get("IndexStatus") == "Indexed"
          and row.get("ExtractionLane") == "msg", str(out) + " " + str(row)[:250])
    check("message's own sender/sent-time become the authorship trail",
          row.get("SourceAuthor") == "Kevin Roper"
          and str(row.get("SourceEdited", "")).startswith("2026-08-20T15:30"),
          str(row)[:250])
    preview = str(row.get("TextPreview", ""))
    check("msg text carries subject, strip and body — attachment ignored",
          preview.startswith("# Weekly LRS sync notes")
          and "**From:** Kevin Roper" in preview
          and "**Sent:** 2026-08-20 15:30" in preview
          and "calibration points" in preview
          and "MUST NOT LEAK" not in preview, preview[:300])
    proc = run_sweep(cfg_path, ["--live", "--only", "message.msg"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("indexed .msg does not rechurn", out.get("processed") == 0, str(out))

    # ---- leg 3k: remote-files mode (v1.39 — no OneDrive anywhere) ---
    # Empty local dirs stand in for a hosted runner: the sidecar drive
    # mirrors down (a pre-existing remote sidecar appears locally),
    # the source doc downloads through the v1.33 fallback, and every
    # sidecar/status/index write uploads through the drive API.
    print("== remote-files leg")
    remote_src = os.path.join(tmp, "remote-src")
    remote_mirror = os.path.join(tmp, "remote-mirror")
    remote_work = os.path.join(tmp, "remote-work")
    for d in (remote_src, remote_mirror, remote_work):
        os.makedirs(d, exist_ok=True)
    state.remote_files["User Stories/pre-existing__doc999.md"] = {
        "content": ("# Pre-existing story\n\n<!-- related:begin -->\n_None yet._\n"
                    "<!-- related:end -->\n\n---\n\nRemote body about calibration "
                    "points on merged routes.\n").encode(),
        "etag": "seed-e1"}
    rcfg = json.loads(json.dumps(cfg))
    rcfg["paths"] = {"sourceLibrary": remote_src, "sidecarLibrary": remote_mirror,
                     "workDir": remote_work}
    rcfg["sweep"]["remoteFiles"] = True
    rcfg["sweep"]["promptVersion"] = "v2.0-remote-leg"
    rcfg_path = os.path.join(tmp, "remote-config.json")
    with open(rcfg_path, "w") as f:
        json.dump(rcfg, f)
    dl_before = len(state.content_downloads)
    proc = run_sweep(rcfg_path, ["--live", "--only", "notes.txt"])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    check("remote run exit 0", proc.returncode == 0, proc.stderr[-600:])
    check("remote mirror pulled the pre-existing sidecar",
          os.path.exists(os.path.join(remote_mirror, "User Stories",
                                      "pre-existing__doc999.md")),
          str(os.listdir(remote_mirror)))
    check("source doc downloaded through the Graph fallback",
          out.get("graph_downloads") == 1
          and len(state.content_downloads) == dl_before + 1, str(out))
    notes_id2 = [i for i, f_ in state.lists[LISTS["docIndex"]].items()
                 if f_.get("FileName") == "notes.txt"][0]
    row = state.lists[LISTS["docIndex"]][notes_id2]
    check("remote run reindexed the doc",
          row.get("IndexStatus") == "Indexed"
          and row.get("PromptVersion") == "v2.0-remote-leg", str(row)[:200])
    up_keys = set(state.remote_files)
    notes_file = str(row.get("TextFileUrl", {}).get("Url", "")).rsplit("/", 1)[-1]
    check("sidecar write-through uploaded to the drive",
          bool(notes_file) and any(k.endswith("/" + notes_file) for k in up_keys), str(up_keys))
    check("status + index pages uploaded too",
          "_Sweep Status.md" in up_keys and "_Index.md" in up_keys, str(up_keys))
    # second run: manifest carries the uploads' eTags, so the mirror
    # re-downloads nothing and the stamped doc doesn't reprocess
    dl2_before = len(state.drive_downloads)
    proc = run_sweep(rcfg_path, ["--live", "--only", "notes.txt"])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    check("second remote run: no re-downloads, no reprocess",
          proc.returncode == 0 and out.get("processed") == 0
          and len(state.drive_downloads) == dl2_before,
          str(out) + f" downloads={len(state.drive_downloads) - dl2_before}")
    # an EMPTY drive listing (a failed/throttled delta) must not prune the
    # workspace: every local .md stays and the run says the prune was skipped
    saved_remote = dict(state.remote_files)
    state.remote_files = {}
    proc = run_sweep(rcfg_path, ["--live", "--only", "notes.txt"])
    check("empty remote listing: mirror keeps every local sidecar and reports the skipped prune",
          proc.returncode == 0
          and os.path.exists(os.path.join(remote_mirror, "User Stories", "pre-existing__doc999.md"))
          and any(k.endswith("/" + notes_file) for k in
                  (os.path.join(dp, fn) for dp, _, fns in os.walk(remote_mirror) for fn in fns))
          and "prune skipped" in proc.stderr, proc.stderr[-400:] + str(os.listdir(remote_mirror)))
    state.remote_files = saved_remote
    # a failed upload must not drop the rest of the queue: the flush after
    # the error re-sends everything, so the sidecar still reaches the drive
    # in the same run (the row is Error for the night and heals next run)
    rcfg["sweep"]["promptVersion"] = "v2.0-remote-leg2"
    with open(rcfg_path, "w") as f:
        json.dump(rcfg, f)
    state.drive_put_fail = 1
    proc = run_sweep(rcfg_path, ["--live", "--only", "notes.txt"])
    rec = next((v for k, v in state.remote_files.items() if k.endswith("/" + notes_file)), None)
    check("a failed drive upload re-queues the tail: the rewritten sidecar reaches the drive on the retry flush",
          proc.returncode == 0 and rec is not None and b"v2.0-remote-leg2" in rec["content"],
          proc.stderr[-400:] + (rec["content"][:200].decode() if rec else " no upload"))
    state.drive_put_fail = 0

    # ---- leg 4: apiKey auth ----------------------------------------
    print("== anthropic apiKey leg")
    cfg["llm"] = {"apiKey": "mock-key", "baseUrl": base, "maxRetries": 0}
    cfg["sweep"]["promptVersion"] = "v2.0-apikey-leg"  # force one reindex
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "notes.txt"])
    check("apiKey run exit 0", proc.returncode == 0, proc.stderr[-600:])
    check("apiKey auth used x-api-key header",
          state.llm_last_headers.get("x-api-key") == "mock-key"
          and not state.llm_last_headers.get("authorization"),
          str(state.llm_last_headers))

    # ---- leg 5: a bearer token from the environment ----------------
    # (ANTHROPIC_AUTH_TOKEN — what `ant auth login` provides on a machine;
    # the SDK resolves it, nothing in the pipeline shells out any more)
    print("== anthropic bearer-token leg")
    cfg["llm"] = {"baseUrl": base, "maxRetries": 0}
    cfg["sweep"]["promptVersion"] = "v2.0-oauth-leg"
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    env = dict(os.environ, ANTHROPIC_AUTH_TOKEN="stub-oauth-token")
    env.pop("ANTHROPIC_API_KEY", None)
    proc = run_node(
        ["node", "--experimental-strip-types", SWEEP, "--config", cfg_path,
         "--live", "--only", "notes.txt"],
        env=env,
    )
    check("bearer-token run exit 0", proc.returncode == 0, proc.stderr[-600:])
    check("bearer token sent as Authorization, no api key",
          state.llm_last_headers.get("authorization") == "Bearer stub-oauth-token"
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
    cfg["llm"] = {"apiKey": "mock-key", "baseUrl": base, "maxRetries": 0}
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
    # graph prompts once; SPO must NOT prompt — same client as Graph, so
    # it seeds from graph.json via a refresh grant (the model call needs
    # no Entra token at all)
    check("device flow ran for graph only (SPO seeded, no 2nd prompt)",
          state.devicecode_hits == 1 and state.device_grants == 1
          and state.refresh_grants >= 1,
          f"devicecode={state.devicecode_hits} grants={state.device_grants} refresh={state.refresh_grants}")
    check("graph write used a delegated token",
          str(state.graph_last_auth) in ("Bearer device-token", "Bearer refreshed-token"),
          str(state.graph_last_auth))
    check("spo write used a seeded (refreshed) token",
          str(state.spo_last_auth) == "Bearer refreshed-token",
          str(state.spo_last_auth))
    check("refresh tokens cached for both resources (no dataverse cache)",
          os.path.exists(os.path.join(auth_dir, "graph.json"))
          and not os.path.exists(os.path.join(auth_dir, "dataverse.json"))
          and os.path.exists(os.path.join(auth_dir, "spo.json")))
    # second run: cached refresh token, silent refresh, no new sign-in
    cfg["sweep"]["promptVersion"] = "v2.0-device-leg-2"
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "notes.txt"])
    check("device rerun exit 0", proc.returncode == 0, proc.stderr[-600:])
    check("rerun refreshed silently (no new device prompt)",
          state.devicecode_hits == 1 and state.refresh_grants >= 2,
          f"devicecode={state.devicecode_hits} refresh={state.refresh_grants}")

    # ---- leg 6b: interactive auth (auth-code + PKCE over loopback) ----
    # Device-code completes in a browser with no relationship to this
    # machine, so it carries no device identity and a device-compliance
    # CA policy rejects it (AADSTS53003) whatever the client. Interactive
    # mode runs the auth-code grant against a loopback redirect instead,
    # so the browser presents the machine's PRT. Everything after the
    # first sign-in — caching, silent refresh, SPO seeding — is identical.
    print("== interactive auth leg")
    shutil.rmtree(auth_dir, ignore_errors=True)
    for sect in (cfg["graph"], cfg["spo"]):
        sect["auth"] = "interactive"
        sect["authorizeUrl"] = base + "/authorize"
    cfg["sweep"]["promptVersion"] = "v2.0-interactive-leg"
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    az_before, code_before = state.authorize_hits, state.code_grants
    proc = run_sweep(cfg_path, ["--live", "--only", "notes.txt"],
                     env_extra={"DOCINDEX_AUTH_BROWSER": "fetch"})
    check("interactive run exit 0", proc.returncode == 0, proc.stderr[-800:])
    check("interactive sign-in ran for graph only (SPO still seeded)",
          state.authorize_hits - az_before == 1 and state.code_grants - code_before == 1,
          f"authorize={state.authorize_hits - az_before} codes={state.code_grants - code_before}")
    check("PKCE challenge sent with S256",
          (state.last_pkce or {}).get("method") == "S256"
          and len((state.last_pkce or {}).get("challenge", "")) >= 40,
          str(state.last_pkce))
    check("redirect is a loopback URI",
          str((state.last_pkce or {}).get("redirect", "")).startswith("http://localhost:"),
          str((state.last_pkce or {}).get("redirect")))
    check("interactive writes the same caches",
          os.path.exists(os.path.join(auth_dir, "graph.json"))
          and os.path.exists(os.path.join(auth_dir, "spo.json")))
    # a second run must be silent — the value of the whole design
    az_mid = state.authorize_hits
    cfg["sweep"]["promptVersion"] = "v2.0-interactive-leg-2"
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    proc = run_sweep(cfg_path, ["--live", "--only", "notes.txt"],
                     env_extra={"DOCINDEX_AUTH_BROWSER": "fetch"})
    check("interactive rerun exit 0", proc.returncode == 0, proc.stderr[-800:])
    check("interactive rerun refreshed silently (no new sign-in)",
          state.authorize_hits == az_mid, f"authorize={state.authorize_hits} vs {az_mid}")

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

    # ---- leg 8: config validation — friendly failure, not a TypeError ----
    # a config missing whole sections (fresh machine, typo'd key) must
    # name every missing key in one message, before any network call
    print("== config validation leg")
    bad_cfg = os.path.join(tmp, "bad-config.json")
    with open(bad_cfg, "w") as f:
        json.dump({"paths": {"workDir": work_dir}}, f)
    proc = run_sweep(bad_cfg, ["--dry-run"])
    check("bad config fails fast", proc.returncode != 0)
    check("bad config names the missing keys",
          "missing required key(s)" in proc.stderr
          and "sharePoint.hostname" in proc.stderr
          and "paths.sourceLibrary" in proc.stderr, proc.stderr[-400:])
    check("bad config error is not a bare TypeError",
          "TypeError" not in proc.stderr, proc.stderr[-400:])
    proc = run_curate(bad_cfg, ["--dry-run"])
    check("curate rejects a bad config the same way",
          proc.returncode != 0 and "missing required key(s)" in proc.stderr,
          proc.stderr[-400:])

    # ---- leg 9: alerting + dead-man heartbeat (v1.32) --------------
    print("== alerting leg")
    # fatal run -> webhook alert (graph unreachable, alerts configured)
    alert_cfg = dict(cfg)
    alert_cfg["graph"] = {"tenantId": "mock", "clientId": "mock",
                          "clientSecret": "mock-secret",
                          "baseUrl": "http://127.0.0.1:9/v1.0",
                          "tokenUrl": "http://127.0.0.1:9/token",
                          "maxRetries": 0}
    alert_cfg["alerts"] = {"webhookUrl": base + "/alert"}
    alert_cfg_path = os.path.join(tmp, "alert-config.json")
    with open(alert_cfg_path, "w") as f:
        json.dump(alert_cfg, f)
    proc = run_sweep(alert_cfg_path, ["--live"])
    check("fatal run posts a webhook alert",
          proc.returncode != 0 and len(state.alerts) == 1
          and "Doc Index sweep FAILED" in state.alerts[0].get("text", ""),
          f"alerts={state.alerts}")
    # fresh heartbeat -> ok, no alert, exit 0 (no Graph call either:
    # the config's graph endpoints are unreachable on purpose)
    proc = run_sweep(alert_cfg_path, ["--check-heartbeat"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("fresh heartbeat passes the dead-man check",
          proc.returncode == 0 and out.get("ok") is True
          and len(state.alerts) == 1, str(out))
    # stale heartbeat -> alert + nonzero exit
    with open(os.path.join(work_dir, "last-success.json"), "w") as f:
        json.dump({"at": "2020-01-01T00:00:00Z", "processed": 0, "errors": 0}, f)
    proc = run_sweep(alert_cfg_path, ["--check-heartbeat"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("stale heartbeat fails the dead-man check and alerts",
          proc.returncode == 1 and out.get("ok") is False
          and len(state.alerts) == 2
          and "NO successful run" in state.alerts[1].get("text", ""),
          str(out) + f" alerts={len(state.alerts)}")

    # ---- leg 10: gantt.mjs — Flow #2 (Gantt → Issue Refs + edges) ---
    # An indexed Schedule workbook: issue rows upsert Issue Refs
    # (IssueKey dedup, last sheet wins), the schedule links to every
    # doc carrying its issues (gantt edges), and an issue TITLE that
    # names exactly one indexed doc joins that doc to the cluster
    # (titlematch edge) — issue 456's "Beta Story" title names the
    # Beta doc, which never cites 456.
    print("== gantt leg")
    make_gantt_xlsx(os.path.join(widened_dir, "schedule.xlsx"))
    sched_seed = state.seed(LISTS["docIndex"], {
        "Title": "Iteration Schedule", "FileName": "schedule.xlsx",
        "DocKey": "shared documents/schedule.xlsx", "DocKind": "Schedule",
        "IndexStatus": "Indexed", "PromptVersion": STAMP,
        "SourceModified": "2026-08-20T10:00:00Z"})
    gantt_cfg = {
        "sharePoint": dict(cfg["sharePoint"], libraryRootSegment="Shared Documents"),
        "paths": {"sourceLibrary": widened_dir, "sidecarLibrary": sidecar_dir,
                  "workDir": work_dir},
        "graph": {"tenantId": "mock", "clientId": "mock", "clientSecret": "mock-secret",
                  "baseUrl": base + "/v1.0", "tokenUrl": base + "/token",
                  "maxRetries": 0},
    }
    gantt_cfg_path = os.path.join(tmp, "gantt-config.json")
    with open(gantt_cfg_path, "w") as f:
        json.dump(gantt_cfg, f)

    def run_gantt(extra):
        return run_node(
            ["node", "--experimental-strip-types", GANTT, "--config", gantt_cfg_path] + extra,
            env=dict(os.environ))

    # a sync rooted at a library child (sharePoint.syncedSubfolder): the
    # schedule under "General/" must resolve to <sourceLibrary>/<file>
    sub_dir = os.path.join(widened_dir, "General")
    os.makedirs(sub_dir, exist_ok=True)
    make_gantt_xlsx(os.path.join(sub_dir, "schedule2.xlsx"))
    sched2_seed = state.seed(LISTS["docIndex"], {
        "Title": "Sub Schedule", "FileName": "schedule2.xlsx",
        "DocKey": "shared documents/general/schedule2.xlsx", "DocKind": "Schedule",
        "IndexStatus": "Indexed", "PromptVersion": STAMP,
        "SourceModified": "2026-08-20T10:00:00Z"})
    sub_cfg = json.loads(json.dumps(gantt_cfg))
    sub_cfg["sharePoint"]["syncedSubfolder"] = "General"
    sub_cfg["paths"]["sourceLibrary"] = sub_dir
    sub_cfg_path = os.path.join(tmp, "gantt-sub-config.json")
    with open(sub_cfg_path, "w") as f:
        json.dump(sub_cfg, f)
    proc = run_node(
        ["node", "--experimental-strip-types", GANTT, "--config", sub_cfg_path, "--dry-run", "--only", "schedule2.xlsx"],
        env=dict(os.environ))
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    check("gantt honours sharePoint.syncedSubfolder when locating a schedule",
          proc.returncode == 0 and out.get("issues_created") == 2, str(out) + proc.stderr[-300:])
    state.lists[LISTS["docIndex"]].pop(str(sched2_seed), None)

    links_before = len(state.lists.get(LISTS["docLinks"], {}))
    proc = run_gantt(["--dry-run"])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    check("gantt dry run plans issues + edges without writing",
          proc.returncode == 0 and out.get("issues_created") == 2
          and out.get("gantt_edges") == 2 and out.get("titlematch_edges") == 1
          and not state.lists.get(LISTS["issueRefs"])
          and len(state.lists.get(LISTS["docLinks"], {})) == links_before,
          str(out) + " " + proc.stderr[-300:])
    proc = run_gantt(["--live"])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    refs = list(state.lists.get(LISTS["issueRefs"], {}).values())
    ref123 = next((r for r in refs if r.get("IssueKey", "").endswith("#123")), {})
    ref456 = next((r for r in refs if r.get("IssueKey", "").endswith("#456")), {})
    check("gantt live run minted both Issue Refs rows",
          proc.returncode == 0 and len(refs) == 2
          and ref123.get("IssueTitle") == "Lock acquisition rework"
          and ref123.get("IterationLabel") == "Iteration 3"
          and ref123.get("StatusSummary") == "TP Status=Testing"
          and ref123.get("DoneFlag") is True
          and ref123.get("PE") == "Claire Wang"
          and ref123.get("SourceDocumentLookupId") == int(sched_seed)
          and ref456.get("IssueTitle") == "Beta Story",
          str(refs)[:500])
    links = list(state.lists.get(LISTS["docLinks"], {}).values())
    gantt_links = [l for l in links if l.get("LinkType") == "gantt"]
    tm_links = [l for l in links if l.get("LinkType") == "titlematch"]
    alpha_id, beta_id2 = int(by_name["Alpha Plan.pptx"][0]), int(by_name["Beta Story.pptx"][0])
    check("gantt edges: schedule ↔ both carriers of #123",
          len(gantt_links) == 2
          and {frozenset((l.get("DocALookupId"), l.get("DocBLookupId")))
               for l in gantt_links}
          == {frozenset((int(sched_seed), alpha_id)), frozenset((int(sched_seed), beta_id2))}
          and all("#123" in l.get("SharedValues", "") for l in gantt_links),
          str(gantt_links)[:400])
    check("titlematch edge: Beta joins issue 456's cluster via its title",
          len(tm_links) == 1
          and frozenset((tm_links[0].get("DocALookupId"), tm_links[0].get("DocBLookupId")))
          == frozenset((int(sched_seed), beta_id2))
          and "#456" in tm_links[0].get("SharedValues", ""),
          str(tm_links)[:400])
    proc = run_gantt(["--live"])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    check("second gantt run is a no-op (IssueKey + LinkKey dedup)",
          proc.returncode == 0 and out.get("issues_created") == 0
          and out.get("issues_updated") == 0 and out.get("gantt_edges") == 0
          and out.get("titlematch_edges") == 0
          and len(state.lists.get(LISTS["issueRefs"], {})) == 2, str(out))
    proc = run_gantt(["--inspect"])
    check("gantt --inspect dumps sheet structure and detection results",
          proc.returncode == 0
          and 'sheet "Iteration 2"' in proc.stdout
          and 'sheet "Iteration 3"' in proc.stdout
          and "header detected at row 0" in proc.stdout
          and "header detected at row 12" in proc.stdout
          and "roles{" in proc.stdout
          and not state.lists.get(LISTS["issueRefs"], {}).get("-1"),
          proc.stdout[-600:] + proc.stderr[-200:])

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
