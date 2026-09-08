import os, sys
from playwright.sync_api import sync_playwright
BASE = os.environ.get("MOCK_BASE", "http://127.0.0.1:8765/")
OUT = "shots"; os.makedirs(OUT, exist_ok=True)
shots = [
  ("current-table",   "test-plans/",                 None, "default"),
  ("variant-a",       "test-plans/variant-a/",       None, "default"),
  ("variant-a-dark",  "test-plans/variant-a/",       None, "slate"),
  ("variant-b",       "test-plans/variant-b/",       "open3", "default"),
  ("variant-b-folded", "test-plans/variant-b/",      "foldrest", "default"),
  ("doc-current",     "test-plans/4855-merge-plan/", None, "default"),
  ("doc-folded",      "test-plans/4855-merge-plan-v/", None, "default"),
  ("doc-folded-open", "test-plans/4855-merge-plan-v/", "openmeta", "default"),
  ("cases-s1",        "test-plans/4855-merge-plan-s1/", None, "default"),
  ("cases-s2",        "test-plans/4855-merge-plan-s2/", None, "default"),
  ("checklist",       "test-plans/4855-merge-plan-c/", None, "default"),
  ("checklist-dark",  "test-plans/4855-merge-plan-c/", None, "slate"),
]
with sync_playwright() as p:
    kw = {}
    if os.path.exists("/opt/pw-browsers/chromium/chrome"): kw["executable_path"] = "/opt/pw-browsers/chromium/chrome"
    try:
        b = p.chromium.launch(**kw)
    except Exception as e:
        print("launch failed", e); b = p.chromium.launch(executable_path=sys.argv[1])
    pg = b.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=1.5)
    for name, path, act, scheme in shots:
        pg.goto(BASE + path, wait_until="networkidle")
        # the sticky header would cover the top of an element screenshot
        pg.add_style_tag(content=".md-header, .md-tabs { position: static !important; }")
        if scheme != "default":
            pg.evaluate(f"document.body.setAttribute('data-md-color-scheme','{scheme}')")
        if act == "open3":
            pg.evaluate("[...document.querySelectorAll('details.lrs-plan')].slice(2,3).forEach(d=>d.open=true)")
        if act == "foldrest":
            pg.evaluate("[...document.querySelectorAll('details.lrs-surface')].slice(1).forEach(d=>d.open=false)")
        if act == "openmeta":
            pg.evaluate("document.querySelector('details.lrs-doc-meta').open=true")
        pg.wait_for_timeout(300)
        # crop to the article column: the nav and TOC are the same on every variant
        art = pg.query_selector(".md-content")
        art.screenshot(path=f"{OUT}/{name}.png")
        print("shot", name)
    b.close()
