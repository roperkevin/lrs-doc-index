"""Gate for the local test-plan generation job (local/testplangen.mjs).

Proves the local job reproduces TestPlanGenCore's G1-G13 semantics
with the cloud replaced by mocks (stdlib http.server standing in for
Graph, Dataverse Predict, and the Anthropic API), plus the phase-1
verifier the cloud flow could not have
(testplangen/Local_TestPlanGen_Plan.md):

  leg 1 guard        non-story / non-indexed / missing rows refuse
                     with the flow's Terminate_not_story message;
                     nothing is called, nothing is written
  leg 2 lanes        a related: line exercising every routing branch
                     lands the right bodies in the right prompt
                     inputs (same-surface exemplars, overflow /
                     cross-surface / Design Spike references,
                     digest-only kinds, a broken neighbor degrading
                     silently); the G6 release-matched exemplar
                     fallback; '(none)' placeholders; the live draft
                     write (timestamped name, WARNING banner,
                     provider stamp) and the dry-run plan (no upload,
                     local draft copy); the anthropic transport
                     (verbatim prompt substitution, no leftover
                     placeholders, maxTokens honored)
  leg 3 caps         remaining-budget takes: exChars / refChars can
                     never regress to the pre-v2.13 full-cap-per-
                     iteration form
  leg 4 fail-closed  a markerless and a misordered-marker reply exit
                     nonzero with the flow's message and write
                     NOTHING
  leg 5 verifier     lib/draftlint.mjs agrees verdict-for-verdict and
                     label-for-label with the Python authority
                     (review/harness/check_draft_coverage.py) on
                     shared fixtures; strict refuses a bad draft;
                     annotate writes it with the [!IMPORTANT]
                     findings block; off stamps verify=off

Pure stdlib + Node 22+, generated fixtures, CI-friendly.
Usage: python3 check_testplangen.py
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
JOB = os.path.join(REPO, "local", "testplangen.mjs")
DRAFTLINT = os.path.join(REPO, "local", "lib", "draftlint.mjs")
PY_LINT = os.path.join(REPO, "review", "harness", "check_draft_coverage.py")
GEN_MODEL = "feedf00d-0000-4000-8000-000000000001"
SITE_URL = "https://mock.example/sites/lrsworkspace"

PASS = []
FAIL = []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    mark = "ok  " if cond else "FAIL"
    print(f"  {mark} {name}" + ("" if cond else f"  <- {detail}"))


# ---- draft fixtures (v1.7 contract) ---------------------------------

GOOD_DRAFT = """# Test Plan — Route Merge

## Overview

| Surface | Target release | PE |
| --- | --- | --- |
| Pro | 3.8 | Claire Wang |

Verifies measure-preserving merge of two routes in ArcGIS Pro.

## Setup / Prerequisites
- [ ] 1. LRS network with two mergeable routes. [VERIFY: minimum network configuration]

## Positive Tests

### TC-P1 — Merge preserves measures
**Steps:**
- [ ] 1. Run Merge Routes on route A and route B.
- [ ] 2. Inspect the measures on the merged route.

**Expected Result:** The merged route keeps the source measures unchanged.

**Trace:** "the merge must preserve measures" — story requirement.

### TC-P2 — Merge produces one route
**Steps:**
- [ ] 1. Run Merge Routes on route A and route B.

**Expected Result:** Exactly one route remains after the merge.

**Trace:** "merge two routes" — story workflow section.

## Negative Tests

> [!CAUTION]
> A pass below is the described denial or error — never the edit
> succeeding.

### TC-N1 — Merge denied on locked route
**Steps:**
- [ ] 1. As user B, attempt Merge Routes on a route locked by user A.

**Expected Result:** The merge is denied with a lock conflict.

**Trace:** exemplar pattern — multi-user denial case (Plan A).

## Open Questions
- [ ] [VERIFY: minimum network configuration for setup]
- [ ] [VERIFY: Plan A tests behavior across a service restart — the story is silent]

## Source Case Sweep

| Source plan | Source case | Applies? | Covered by / why not |
| --- | --- | --- | --- |
| Plan A (exemplar) | Second user denied editing a locked route | Yes | TC-N1 |
| Plan A (exemplar) | Lock survives a service restart | Verify | Open Questions — story silent |
| Plan B (exemplar) | Lock released on discard | No | Out of the story's scope |

## Coverage Map

| # | Requirement (source) | Covered by |
| --- | --- | --- |
| 1 | "merge two routes" (workflow section) | TC-P2 |
| 2 | "the merge must preserve measures" (requirement) | TC-P1 |
| 3 | denial on locked routes (conflict statement) | TC-N1 |
"""

# GOOD_DRAFT with two seeded violations: TC-N1 loses its Trace line,
# and Coverage Map row 3 loses its Covered by cell — expected
# findings: the Trace check, the row-3 citation check, and TC-N1
# uncited.
BAD_DRAFT = GOOD_DRAFT.replace(
    "**Trace:** exemplar pattern — multi-user denial case (Plan A).\n", ""
).replace(
    "| 3 | denial on locked routes (conflict statement) | TC-N1 |",
    "| 3 | denial on locked routes (conflict statement) | |",
)

wrap = lambda body: "Here is your draft.\n[[[DRAFT BEGIN]]]\n" + body + "\n[[[DRAFT END]]]\nDone."


# ---- mock Graph + Dataverse Predict + Anthropic ---------------------

class MockState:
    def __init__(self):
        self.rows = []            # docIndex items ({id, fields})
        self.gen_text = ""        # the model reply, both providers
        self.gen_calls = 0
        self.gen_last_inputs = {}     # Predict requestv2
        self.ant_calls = 0
        self.ant_last_body = {}       # /v1/messages request body
        self.drafts = {}          # drive path -> content


def make_handler(state):
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
                return self._json({"access_token": "tok", "expires_in": 3600})
            if p == "/v1/messages":
                body = json.loads(self._read())
                state.ant_calls += 1
                state.ant_last_body = body
                return self._json({
                    "stop_reason": "end_turn",
                    "content": [{"type": "text", "text": state.gen_text}],
                })
            m = re.match(
                r"^/api/data/v9\.2/msdyn_aimodels\(([0-9a-f-]+)\)"
                r"/Microsoft\.Dynamics\.CRM\.Predict$", p)
            if m:
                body = json.loads(self._read())
                state.gen_calls += 1
                rv = dict(body.get("requestv2", {}))
                rv.pop("@odata.type", None)
                state.gen_last_inputs = rv
                return self._json({"responsev2": {"predictionOutput": {"text": state.gen_text}}})
            return self._json({"error": "unhandled POST " + p}, 500)

        def do_PUT(self):
            p = unquote(urlparse(self.path).path)
            m = re.match(r"^/v1\.0/sites/[^/]+/drive/root:(/.+):/content$", p)
            if m:
                state.drafts[m.group(1)] = self._read().decode()
                return self._json({"id": "up"})
            return self._json({"error": "unhandled PUT " + p}, 500)

        def do_GET(self):
            p = unquote(urlparse(self.path).path)
            m = re.match(r"^/v1\.0/sites/([^/]+):(/.+)$", p)
            if m:
                return self._json({"id": "site-1"})
            m = re.match(r"^/v1\.0/sites/[^/]+/lists/([^/]+)/items$", p)
            if m:
                return self._json({"value": state.rows})
            return self._json({"error": "unhandled GET " + p}, 500)

    return Handler


# ---- fixtures -------------------------------------------------------

def sidecar(sidecar_dir, folder, name, body, related=None):
    """A minimal v2.8-shaped sidecar: hidden metadata comment frame
    with the machine-written related: line, then the body."""
    rel = json.dumps(related or [], separators=(",", ":"))
    text = (f"# {name}\n\n<!-- metadata\n```yaml\ndoc_id: 0\n"
            f"related: {rel}\n```\n-->\n\n{body}\n")
    fpath = os.path.join(sidecar_dir, folder, name)
    os.makedirs(os.path.dirname(fpath), exist_ok=True)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(text)
    return f"{SITE_URL}/LRS Doc Index/{folder}/{name}"


def doc_row(iid, title, kind, status, surface, url, release="", pe="", summary=""):
    fields = {"Title": title, "FileName": title, "DocKind": kind,
              "IndexStatus": status, "Surface": surface,
              "TargetRelease": release, "PE": pe, "Summary": summary,
              "SourceModified": f"2026-08-{iid:02d}T10:00:00Z"}
    if url:
        fields["TextFileUrl"] = {"Url": url, "Description": url.rsplit("/", 1)[-1]}
    return {"id": str(iid), "fields": fields}


def run_job(cfg_path, extra):
    return subprocess.run(
        ["node", "--experimental-strip-types", JOB, "--config", cfg_path] + extra,
        capture_output=True, text=True, cwd=REPO,
    )


def run_draftlint(md_path):
    script = (
        "import { lintDraft } from %r;\n"
        "import fs from 'node:fs';\n"
        "const r = lintDraft(fs.readFileSync(%r, 'utf8'));\n"
        "console.log(JSON.stringify(r));\n"
    ) % ("file://" + DRAFTLINT, md_path)
    res = subprocess.run(["node", "--input-type=module", "-e", script],
                         capture_output=True, text=True, cwd=REPO)
    if res.returncode != 0:
        raise RuntimeError("draftlint runner failed: " + res.stderr)
    return json.loads(res.stdout.strip().splitlines()[-1])


def run_py_lint(md_path):
    res = subprocess.run([sys.executable, PY_LINT, md_path],
                         capture_output=True, text=True, cwd=REPO)
    labels = [l[5:].strip() for l in res.stdout.splitlines() if l.startswith("FAIL ")]
    return res.returncode, labels


def summary_of(stdout):
    for line in stdout.splitlines():
        if line.startswith("story="):
            return dict(kv.split("=", 1) for kv in line.split())
    return {}


# ---- main -----------------------------------------------------------

def main():
    tmp = tempfile.mkdtemp(prefix="testplangen-gate-")
    sidecar_dir = os.path.join(tmp, "sidecar")
    work_dir = os.path.join(tmp, "work")
    os.makedirs(work_dir, exist_ok=True)

    state = MockState()
    server = ThreadingHTTPServer(("127.0.0.1", 0), make_handler(state))
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}"

    # ---- corpus: sidecars + Doc Index rows ----
    plan_body = ("### Case 1 — locked-route denial\nA second user is denied "
                 "editing a route the first user holds a lock on. " + "x" * 340)
    url_a = sidecar(sidecar_dir, "Test Plans", "plan-a__doc21.md", plan_body)
    url_b = sidecar(sidecar_dir, "Test Plans", "plan-b__doc22.md", plan_body)
    url_c = sidecar(sidecar_dir, "Test Plans", "plan-c__doc23.md", plan_body)
    url_d = sidecar(sidecar_dir, "Test Plans", "plan-d__doc24.md", plan_body)
    url_e = sidecar(sidecar_dir, "Design Spikes", "spike-e__doc25.md",
                    "Spike describing merge field semantics.")
    url_adj = sidecar(sidecar_dir, "User Stories", "adjacent__doc26.md",
                      "Adjacent story body.")
    story_body = ("As an editor, I need to merge two routes. The merge must "
                  "preserve measures on point and line events.")
    related = [
        {"doc": 21, "file": "plan-a__doc21.md", "s": 1000},
        {"doc": 22, "file": "plan-b__doc22.md", "s": 900},
        {"doc": 23, "file": "plan-c__doc23.md", "s": 800},
        {"doc": 24, "file": "plan-d__doc24.md", "s": 700},
        {"doc": 25, "file": "spike-e__doc25.md", "s": 600},
        {"doc": 26, "file": "adjacent__doc26.md", "s": 500},
        {"doc": 999, "file": "gone__doc999.md", "s": 400},
    ]
    url_story = sidecar(sidecar_dir, "User Stories", "route-merge__doc12.md",
                        story_body, related)
    url_lonely = sidecar(sidecar_dir, "User Stories", "lonely__doc13.md",
                         "As an editor, I need to realign a route.", [])

    state.rows = [
        doc_row(12, "Route Merge", "User Story", "Indexed", "Pro", url_story,
                release="3.8", pe="Claire Wang", summary="Merge two routes."),
        doc_row(13, "Lonely Story", "User Story", "Indexed", "Pro", url_lonely,
                release="3.8"),
        doc_row(14, "Some Plan", "Test Plan", "Indexed", "Pro", url_a),
        doc_row(15, "Skipped Story", "User Story", "Skipped", "Pro", ""),
        # 21/22 same-surface exemplars; 21 release-matched but OLDER —
        # the G6 fallback must still prefer it (winner-takes-all)
        doc_row(21, "Plan A", "Test Plan", "Indexed", "Pro", url_a, release="3.8",
                summary='He said "quoted"\nsummary line two ' + "s" * 500),
        doc_row(22, "Plan B", "Test Plan", "Indexed", "Pro", url_b),
        doc_row(23, "Plan C", "Test Plan", "Indexed", "Pro", url_c),
        doc_row(24, "Plan D", "Test Plan", "Indexed", "Server", url_d),
        doc_row(25, "Spike E", "Design Spike", "Indexed", "Pro", url_e),
        doc_row(26, "Adjacent Story", "User Story", "Indexed", "Pro", url_adj),
    ]

    def write_cfg(name, testplangen=None, llm=None):
        cfg = {
            "sharePoint": {
                "hostname": "mock.example",
                "sitePath": "/sites/lrsworkspace",
                "lists": {"docIndex": "list-docindex"},
            },
            "paths": {"sidecarLibrary": sidecar_dir, "workDir": work_dir},
            "graph": {
                "tenantId": "mock", "clientId": "mock", "clientSecret": "mock-secret",
                "baseUrl": base + "/v1.0", "tokenUrl": base + "/token",
                "maxRetries": 0,
            },
            "llm": llm if llm is not None else {
                "provider": "aibuilder", "environmentUrl": base,
                "testPlanModelId": GEN_MODEL, "maxRetries": 0,
            },
            "sweep": {"siteUrl": SITE_URL},
            "testplangen": {"neighborCap": 8, **(testplangen or {})},
        }
        cfg_path = os.path.join(tmp, name)
        with open(cfg_path, "w") as f:
            json.dump(cfg, f)
        return cfg_path

    cfg_main = write_cfg("config.json")

    # ---- leg 1: guard ----------------------------------------------
    print("== leg 1: guard")
    state.gen_text = wrap(GOOD_DRAFT)
    for story_id, why in (("14", "Test Plan row"), ("15", "Skipped story"),
                          ("404", "missing row")):
        r = run_job(cfg_main, ["--story", story_id, "--live"])
        check(f"guard refuses {why}", r.returncode != 0, r.stdout + r.stderr)
        check(f"guard message names the rule ({why})",
              "Indexed User Story rows only" in r.stderr
              if story_id != "404" else "no Doc Index row with ID 404" in r.stderr,
              r.stderr)
    check("guard: nothing written", state.drafts == {}, str(state.drafts))
    check("guard: no model call", state.gen_calls == 0, str(state.gen_calls))

    # ---- leg 2: lanes + live write ---------------------------------
    print("== leg 2: lanes and the live draft")
    state.drafts.clear()
    r = run_job(cfg_main, ["--story", "12", "--live"])
    check("live run succeeds", r.returncode == 0, r.stdout + r.stderr)
    inp = state.gen_last_inputs
    check("one model call", state.gen_calls == 1, str(state.gen_calls))
    check("StoryMeta copies row values verbatim",
          "title: Route Merge" in inp.get("StoryMeta", "")
          and "surface: Pro" in inp.get("StoryMeta", "")
          and "target_release: 3.8" in inp.get("StoryMeta", "")
          and "pe: Claire Wang" in inp.get("StoryMeta", "")
          and "doc_id: 12" in inp.get("StoryMeta", ""), inp.get("StoryMeta", ""))
    check("StoryText carries the story sidecar",
          story_body in inp.get("StoryText", ""), inp.get("StoryText", "")[:200])
    digest = inp.get("RelatedDigest", "")
    check("digest: one line per fetched neighbor (6)",
          digest.count("\n") == 6 and digest.count("- [") == 6, digest)
    check("digest: broken neighbor degrades silently", "999" not in digest, digest)
    check("digest: kinds tagged",
          '- [Test Plan] "Plan A"' in digest
          and '- [Design Spike] "Spike E"' in digest
          and '- [User Story] "Adjacent Story"' in digest, digest)
    check("digest: summary de-quoted, single line, capped",
          'He said quoted summary line two' in digest
          and '"quoted"' not in digest
          and len([l for l in digest.splitlines() if "Plan A" in l][0]) < 500,
          digest)
    ex = inp.get("ExemplarText", "")
    check("exemplar lane: the two same-surface plans, in score order",
          ex.index("--- EXEMPLAR: plan-a__doc21.md ---")
          < ex.index("--- EXEMPLAR: plan-b__doc22.md ---")
          if "plan-a__doc21.md" in ex and "plan-b__doc22.md" in ex else False, ex[:300])
    check("exemplar lane: overflow plan NOT an exemplar", "plan-c" not in ex, ex[:300])
    ref = inp.get("ReferenceText", "")
    check("reference lane: overflow + cross-surface + spike, with surface headers",
          "--- REFERENCE: Plan C — surface Pro ---" in ref
          and "--- REFERENCE: Plan D — surface Server ---" in ref
          and "--- REFERENCE: Spike E — surface Pro ---" in ref, ref[:400])
    summ = summary_of(r.stdout)
    check("Gen_summary counters",
          summ.get("neighbors") == "7" and summ.get("exemplars") == "2"
          and summ.get("references") == "3" and summ.get("verify") == "ok", str(summ))
    paths = [p for p in state.drafts
             if re.match(r"^/Test Plan Drafts/TestPlanDraft__doc12__\d{8}-\d{6}\.md$", p)]
    check("draft written with the timestamped name", len(paths) == 1, str(list(state.drafts)))
    draft = state.drafts[paths[0]] if paths else ""
    check("banner: comment stamp with prompt version + provider",
          draft.startswith("<!-- machine-generated test-plan draft — TestPlanGen prompt v1.7")
          and "provider aibuilder" in draft.splitlines()[0], draft[:200])
    check("banner: WARNING alert + review contract",
          "> [!WARNING]" in draft and "resolve all [VERIFY] items" in draft
          and f"Source sidecar: <{url_story}>" in draft, draft[:600])
    check("draft body present, clean draft unannotated",
          GOOD_DRAFT.strip() in draft and "[!IMPORTANT]" not in draft
          and "<!-- verify:" not in draft, draft[:600])

    # ---- leg 2b: exemplar fallback + (none) + dry run --------------
    print("== leg 2b: exemplar fallback, (none), dry run")
    state.drafts.clear()
    r = run_job(cfg_main, ["--story", "13", "--dry-run"])
    check("fallback run succeeds", r.returncode == 0, r.stdout + r.stderr)
    inp = state.gen_last_inputs
    check("fallback: release-matched plan wins outright (older, alone)",
          "plan-a__doc21.md" in inp.get("ExemplarText", "")
          and "plan-b" not in inp.get("ExemplarText", "")
          and "plan-c" not in inp.get("ExemplarText", ""),
          inp.get("ExemplarText", "")[:300])
    check("empty lanes travel as (none)",
          inp.get("RelatedDigest") == "(none)" and inp.get("ReferenceText") == "(none)",
          str({k: v[:40] for k, v in inp.items()}))
    summ = summary_of(r.stdout)
    check("fallback counters", summ.get("exemplars") == "1"
          and summ.get("references") == "0" and summ.get("neighbors") == "0", str(summ))
    check("dry run uploads nothing", state.drafts == {}, str(list(state.drafts)))
    local_drafts = [f for f in os.listdir(work_dir)
                    if f.startswith("testplangen-draft-") and f.endswith(".md")]
    check("dry run leaves a local draft copy", len(local_drafts) >= 1, str(local_drafts))
    logs = [f for f in os.listdir(work_dir)
            if f.startswith("testplangen-") and f.endswith(".json")]
    check("run log written", len(logs) >= 1, str(os.listdir(work_dir)))
    with open(os.path.join(work_dir, sorted(logs)[-1])) as f:
        log = json.load(f)
    check("dry-run log records the putFile plan",
          log.get("dry_run") is True
          and any(a.get("action") == "putFile" for a in log.get("plan") or []), str(log))

    # ---- leg 2c: anthropic transport --------------------------------
    print("== leg 2c: anthropic transport")
    cfg_ant = write_cfg("config-ant.json",
                        llm={"provider": "anthropic", "apiKey": "mock-key",
                             "baseUrl": base, "maxRetries": 0})
    state.drafts.clear()
    r = run_job(cfg_ant, ["--story", "12", "--live"])
    check("anthropic run succeeds", r.returncode == 0, r.stdout + r.stderr)
    check("one /v1/messages call", state.ant_calls == 1, str(state.ant_calls))
    prompt = (state.ant_last_body.get("messages") or [{}])[0].get("content", "")
    check("prompt: the repo prompt text, inputs substituted",
          "GROUNDING RULES" in prompt
          and "<<<STORY TEXT BEGIN>>>" in prompt
          and story_body in prompt
          and "--- EXEMPLAR: plan-a__doc21.md ---" in prompt, prompt[:200])
    check("prompt: no leftover placeholders",
          not re.search(r"\{(StoryMeta|StoryText|RelatedDigest|ExemplarText|ReferenceText)\}",
                        prompt), prompt[-300:])
    check("maxTokens honored (default 16384)",
          state.ant_last_body.get("max_tokens") == 16384, str(state.ant_last_body.get("max_tokens")))
    check("anthropic draft written, provider stamped",
          len(state.drafts) == 1
          and "provider anthropic" in list(state.drafts.values())[0].splitlines()[0],
          str(list(state.drafts)))

    # ---- leg 3: caps ------------------------------------------------
    print("== leg 3: remaining-budget caps")
    cfg_caps = write_cfg("config-caps.json",
                         testplangen={"neighborCap": 8, "exemplarCap": 300,
                                      "referenceCap": 200})
    r = run_job(cfg_caps, ["--story", "12", "--dry-run"])
    check("caps run succeeds", r.returncode == 0, r.stdout + r.stderr)
    summ = summary_of(r.stdout)
    # the header rides free (flow semantics), so allow it — the real
    # regression this pins is the pre-v2.13 ~2x-cap accumulation
    check("exChars bounded by the remaining-budget take",
          int(summ.get("exChars", "9999")) <= 300 + 80, str(summ))
    check("refChars bounded by the remaining-budget take",
          int(summ.get("refChars", "9999")) <= 200 + 80, str(summ))
    check("a lane at budget stops appending",
          summ.get("exemplars") == "1" and summ.get("references") == "1", str(summ))

    # ---- leg 4: fail-closed marker slice ---------------------------
    print("== leg 4: fail-closed")
    state.drafts.clear()
    n_local = len([f for f in os.listdir(work_dir) if f.endswith(".md")])
    for label, reply in (("markerless", "no markers anywhere in this reply"),
                         ("misordered", "[[[DRAFT END]]] body [[[DRAFT BEGIN]]]")):
        state.gen_text = reply
        r = run_job(cfg_main, ["--story", "12", "--live"])
        check(f"{label} reply exits nonzero", r.returncode != 0, r.stdout)
        check(f"{label} reply names the marker contract",
              "missing the DRAFT BEGIN/END markers" in r.stderr, r.stderr)
    check("fail-closed: nothing uploaded", state.drafts == {}, str(list(state.drafts)))
    check("fail-closed: no local draft either",
          len([f for f in os.listdir(work_dir) if f.endswith(".md")]) == n_local,
          str(os.listdir(work_dir)))

    # ---- leg 5: verifier -------------------------------------------
    print("== leg 5: verifier")
    good_md = os.path.join(tmp, "good.md")
    bad_md = os.path.join(tmp, "bad.md")
    with open(good_md, "w") as f:
        f.write(GOOD_DRAFT)
    with open(bad_md, "w") as f:
        f.write(BAD_DRAFT)
    # agreement with the Python authority, verdicts and labels
    py_rc_good, py_labels_good = run_py_lint(good_md)
    py_rc_bad, py_labels_bad = run_py_lint(bad_md)
    js_good = run_draftlint(good_md)
    js_bad = run_draftlint(bad_md)
    check("agreement: good draft passes both",
          py_rc_good == 0 and js_good["failures"] == [],
          f"py={py_labels_good} js={js_good['failures']}")
    check("agreement: bad draft fails both",
          py_rc_bad != 0 and len(js_bad["failures"]) > 0,
          f"py rc={py_rc_bad} js={js_bad['failures']}")
    check("agreement: identical failure labels",
          sorted(js_bad["failures"]) == sorted(py_labels_bad),
          f"py={sorted(py_labels_bad)} js={sorted(js_bad['failures'])}")
    check("agreement: the seeded findings surface",
          "TC-N1 carries a **Trace:** line" in js_bad["failures"]
          and any("row 3" in x for x in js_bad["failures"]), str(js_bad["failures"]))

    # strict: refuse to write
    state.gen_text = wrap(BAD_DRAFT)
    state.drafts.clear()
    r = run_job(cfg_main, ["--story", "12", "--live", "--verify", "strict"])
    check("strict refuses a bad draft", r.returncode != 0, r.stdout)
    check("strict lists the findings on stderr",
          "draft verifier (strict)" in r.stderr
          and "TC-N1 carries a **Trace:** line" in r.stderr, r.stderr)
    check("strict writes nothing", state.drafts == {}, str(list(state.drafts)))

    # annotate: write with the findings block
    r = run_job(cfg_main, ["--story", "12", "--live", "--verify", "annotate"])
    check("annotate writes the bad draft", r.returncode == 0, r.stdout + r.stderr)
    draft = list(state.drafts.values())[0] if len(state.drafts) == 1 else ""
    check("annotate: IMPORTANT findings block after the banner",
          "> [!IMPORTANT]" in draft
          and "> - TC-N1 carries a **Trace:** line" in draft
          and re.search(r"<!-- verify: \d+ finding", draft) is not None, draft[:900])
    check("annotate: block sits between banner and body",
          draft.index("[!WARNING]") < draft.index("[!IMPORTANT]")
          < draft.index("# Test Plan"), "")
    summ = summary_of(r.stdout)
    check("annotate: verify counter in Gen_summary",
          re.match(r"^\d+-findings$", summ.get("verify", "")), str(summ))

    # off: parity with the cloud flow
    state.drafts.clear()
    r = run_job(cfg_main, ["--story", "12", "--live", "--verify", "off"])
    check("off writes without annotation", r.returncode == 0
          and len(state.drafts) == 1
          and all("[!IMPORTANT]" not in d for d in state.drafts.values()), r.stderr)
    check("off stamps verify=off", summary_of(r.stdout).get("verify") == "off",
          r.stdout)
    check("bad verify mode rejected",
          run_job(cfg_main, ["--story", "12", "--verify", "bogus"]).returncode != 0, "")

    server.shutdown()
    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FAILED: " + ", ".join(FAIL))
        sys.exit(1)
    print("RESULT: PASS")


if __name__ == "__main__":
    main()
