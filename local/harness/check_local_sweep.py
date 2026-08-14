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

        def do_POST(self):
            p = urlparse(self.path).path
            if p == "/token":
                self._read()
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
                out = None
                for fname, resp in state.llm_by_file.items():
                    if fname in prompt:
                        out = resp
                        break
                if out is None:
                    out = {"title": "", "docKind": "Other", "surface": "Other",
                           "summary": "", "pe": "", "dev": "", "targetRelease": "",
                           "tools": [], "keywords": []}
                return self._json({
                    "stop_reason": "end_turn",
                    "content": [{"type": "text", "text": json.dumps(out)}],
                })
            m = re.match(r"^/v1\.0/sites/([^/]+)/lists/([^/]+)/items$", p)
            if m:
                guid = m.group(2)
                fields = json.loads(self._read()).get("fields", {})
                state.lists.setdefault(guid, {})
                iid = str(state.next_id)
                state.next_id += 1
                state.lists[guid][iid] = fields
                return self._json({"id": iid, "fields": fields}, 201)
            return self._json({"error": "unhandled POST " + p}, 500)

        def do_PATCH(self):
            m = re.match(r"^/v1\.0/sites/[^/]+/lists/([^/]+)/items/(-?\d+)/fields$", urlparse(self.path).path)
            if m:
                guid, iid = m.group(1), m.group(2)
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


def run_sweep(cfg_path, extra):
    return subprocess.run(
        ["node", "--experimental-strip-types", SWEEP, "--config", cfg_path] + extra,
        capture_output=True, text=True, cwd=REPO,
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
        f.write(b"%PDF-1.4 not extractable")
    with open(os.path.join(src_dir, "corrupt.pptx"), "wb") as f:
        f.write(b"this is not a zip archive")

    def src_item(iid, name, modified):
        return {
            "id": str(iid),
            "webUrl": f"https://mock.example/src/{name}",
            "lastModifiedDateTime": modified,
            "fields": {
                "FileLeafRef": name,
                "FileRef": f"/sites/LocationReferencing/Shared Documents/{name}",
                "Modified": modified,
                "FSObjType": "0",
            },
        }

    # Beta newer than Alpha -> Beta indexes first; Alpha then finds the
    # sharer, mints the edge, and reciprocally patches Beta's sidecar.
    src_files = [
        src_item(11, "Beta Story.pptx", "2026-08-13T10:00:00Z"),
        src_item(10, "Alpha Plan.pptx", "2026-08-12T10:00:00Z"),
        src_item(12, "notes.txt", "2026-08-11T10:00:00Z"),
        src_item(13, "spec.pdf", "2026-08-10T10:00:00Z"),
        src_item(14, "corrupt.pptx", "2026-08-09T10:00:00Z"),
    ]

    state = MockState()
    # seeded canonical keyword — sweeps must reuse it, not re-mint
    state.seed(LISTS["keywords"], {"Title": "locks", "Kind": "topic"})
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
            "libraryRootSegment": "Shared Documents",
            "lists": LISTS,
        },
        "paths": {"sourceLibrary": src_dir, "sidecarLibrary": sidecar_dir, "workDir": work_dir},
        "graph": {
            "tenantId": "mock", "clientId": "mock", "clientSecret": "mock-secret",
            "baseUrl": base + "/v1.0", "tokenUrl": base + "/token",
            "maxRetries": 0,
        },
        "llm": {"apiKey": "mock-key", "baseUrl": base, "maxRetries": 0},
        "sweep": {
            "siteUrl": "https://mock.example/sites/lrsworkspace",
            "dryRun": True,
        },
    }
    cfg_path = os.path.join(tmp, "config.json")
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)

    # ---- leg 1: dry run -------------------------------------------
    print("== dry-run leg")
    proc = run_sweep(cfg_path, [])
    check("dry run exit 0", proc.returncode == 0, proc.stderr[-600:])
    out = json.loads(proc.stdout.splitlines()[0]) if proc.returncode == 0 else {}
    check("dry run processed 5", out.get("processed") == 5, str(out))
    check("dry run flagged as dry", out.get("dry_run") is True)
    check("dry run wrote no sidecars",
          not any(f.endswith(".md") for _, _, fs_ in os.walk(sidecar_dir) for f in fs_))
    check("dry run created no rows", len(state.lists.get(LISTS["docIndex"], {})) == 0)
    with open(out["logFile"]) as f:
        log = json.load(f)
    check("dry run recorded a write plan", len(log.get("plan") or []) > 10,
          str(len(log.get("plan") or [])))

    # ---- leg 2: live run against mocks ----------------------------
    print("== live leg")
    proc = run_sweep(cfg_path, ["--live"])
    check("live exit 0", proc.returncode == 0, proc.stderr[-600:])
    out = json.loads(proc.stdout.splitlines()[0])
    check("live processed 5", out.get("processed") == 5, str(out))
    check("live errors 1 (corrupt.pptx)", out.get("errors") == 1, str(out))

    rows = state.lists[LISTS["docIndex"]]
    by_name = {}
    for iid, fields in rows.items():
        by_name[fields.get("FileName")] = (iid, fields)
    check("doc index rows for all 5 docs", len(by_name) == 5, str(sorted(by_name)))

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
    check("pdf skipped with stamp", pdf.get("IndexStatus") == "Skipped"
          and pdf.get("PromptVersion") == "v2.0", str(pdf)[:200])

    _, bad = by_name.get("corrupt.pptx", (None, {}))
    check("corrupt doc -> Error row", bad.get("IndexStatus") == "Error", str(bad)[:200])
    check("error names the failing step",
          str(bad.get("LastError", "")).startswith("ziptext-pptx:"), str(bad.get("LastError"))[:120])

    # sidecars on disk
    md_files = {f: os.path.join(r, f)
                for r, _, fs_ in os.walk(sidecar_dir) for f in fs_ if f.endswith(".md")}
    check("three sidecars written", len(md_files) == 3, str(sorted(md_files)))
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

    # ---- leg 3: idempotency — second live run reindexes nothing ----
    print("== idempotency leg")
    llm_before = state.llm_calls
    proc = run_sweep(cfg_path, ["--live"])
    out = json.loads(proc.stdout.splitlines()[0])
    check("second run reprocesses only the Error doc", out.get("processed") == 1, str(out))
    check("no extra LLM calls for stamped docs", state.llm_calls == llm_before,
          f"{state.llm_calls} vs {llm_before}")
    check("apiKey auth used x-api-key header",
          state.llm_last_headers.get("x-api-key") == "mock-key"
          and not state.llm_last_headers.get("authorization"),
          str(state.llm_last_headers))

    # ---- leg 4: OAuth auth (no API key; stub `ant` mints the token) --
    print("== oauth leg")
    bin_dir = os.path.join(tmp, "bin")
    os.makedirs(bin_dir, exist_ok=True)
    stub = os.path.join(bin_dir, "ant")
    with open(stub, "w") as f:
        f.write("#!/bin/sh\necho stub-oauth-token\n")
    os.chmod(stub, 0o755)
    cfg["llm"] = {"auth": "oauth", "baseUrl": base, "maxRetries": 0}
    # bump PromptVersion so one doc reindexes and exercises an LLM call
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
