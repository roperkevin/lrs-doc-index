import os, sys
from playwright.sync_api import sync_playwright
BASE = "http://127.0.0.1:8765/"
OUT = "shots"; os.makedirs(OUT, exist_ok=True)
shots = [
  ("current-table",   "test-plans/",                 None, "default"),
  ("variant-a",       "test-plans/variant-a/",       None, "default"),
  ("variant-a-dark",  "test-plans/variant-a/",       None, "slate"),
  ("variant-b",       "test-plans/variant-b/",       "open3", "default"),
  ("doc-current",     "test-plans/4855-merge-plan/", None, "default"),
  ("doc-folded",      "test-plans/4855-merge-plan-v/", None, "default"),
  ("doc-folded-open", "test-plans/4855-merge-plan-v/", "openmeta", "default"),
]
with sync_playwright() as p:
    kw = {}
    if len(sys.argv) > 1: kw["executable_path"] = sys.argv[1]  # a Playwright chromium build, when the default is not found
    try:
        b = p.chromium.launch(**kw)
    except Exception as e:
        raise SystemExit(f"could not launch Chromium ({e}); pass the browser path as the first argument")
    pg = b.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=1.5)
    for name, path, act, scheme in shots:
        pg.goto(BASE + path, wait_until="networkidle")
        if scheme != "default":
            pg.evaluate(f"document.body.setAttribute('data-md-color-scheme','{scheme}')")
        if act == "open3":
            pg.evaluate("[...document.querySelectorAll('details.lrs-plan')].slice(2,3).forEach(d=>d.open=true)")
        if act == "openmeta":
            pg.evaluate("document.querySelector('details.lrs-doc-meta').open=true")
        pg.wait_for_timeout(300)
        # crop to the article column: the nav and TOC are the same on every variant
        art = pg.query_selector(".md-content")
        art.screenshot(path=f"{OUT}/{name}.png")
        print("shot", name)
    b.close()
