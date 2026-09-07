#!/usr/bin/env python3
"""Gate for the wiki generator (pipeline/wiki.mjs).

Builds a small sidecar library the way the sweep leaves it — two
format-3.0 sidecars that relate to each other (one test plan with
cases and a figure, one user story), one pre-3.0 yaml-framed sidecar
(the reader fallback), a `_Index.md` browse page that must NOT become
a wiki page, a media folder, and a list backup whose Keywords rows
carry two alias → canonical merges — then renders the site and proves:

  1. the tree: one page per document under its kind folder, the kind
     catalogs, keyword / tool / product / release / people / issue
     catalogs, cases, figures, recent, about, index; mkdocs.yml with
     the nav; the Pages workflow on the configured branch
  2. links: every relative `.md` link on every page resolves to a file
     under docs/; the related list links the sibling page and degrades
     a missing target to plain text; media is copied and its links
     resolve; the metadata table's values link into the catalogs
  3. the keyword canonical map: an alias never gets a page, its docs
     land on the canonical term's page, the kind from the list shows
  4. anchors: the case catalog and the figure catalog link section ids
     that `mkdocs build --strict` actually emits (when mkdocs is on
     PATH; otherwise the ids are checked against the slug rule alone)
  5. HTML comments (rel markers, src provenance) never reach a page;
     the yaml frame of a legacy sidecar never reaches a page
  5b. the v1.1 dialect translation (lib/mdlayout.mjs): the whole
     summary and the docs region reach the page, GFM alerts become
     admonitions, `<placeholder>` and a trailing `{brace}` run are
     escaped, code spans / `<br>` / autolinks are not, and mkdocs.yml
     carries the extensions the dialect needs
  5c. the v1.5 admonitions: an alert's trailing text becomes the
     block's title, Material's types beyond GFM's five map, a `-`
     fold suffix makes the block collapsible, the composed pages
     (draft, drafts catalog, About, front) carry their notices as
     admonitions, and extra.css defines the custom `draft` type
  6. --push: a first push lands the tree on a bare repository; a
     second run over an unchanged library pushes nothing new; no
     wiki.repoUrl refuses with the fix; a missing library refuses
  7. the summary line and JSON contract

Pure stdlib + Node 22+ (+ mkdocs-material when present), CI-friendly.
Usage: python3 check_wiki.py
"""
import gzip
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
JOB = os.path.join(REPO, "pipeline", "wiki.mjs")

PASS = []
FAIL = []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(f"  {'ok  ' if cond else 'FAIL'} {name}" + ("" if cond else f"  <- {str(detail)[:600]}"))


PLAN = """# Merge Events Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 17 · Test Plan · Pro |
| **Product** | Roads & Highways |
| **Release** | 3.8 |
| **Issues** | [ArcGISPro/ps-location-referencing#4855](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4855) |
| **Source** | [Merge Plan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Merge%20Plan.pptx>) · rev V2 |
| **People** | author Mac Christmas · PE Claire Wang · dev — |
| **Edited** | 2026-08-01 10:00 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v3.0.0 |
| **Keywords** | merge events · gantt charts · route |
| **Tools** | Merge Events |

## Summary

Covers merging line events across routes, with the lock conflict case.

A second paragraph the classifier wrote, which the v1.0 summary reader
cut off at the first line break.

## Related documents

<!-- related:begin -->
- [Conflict Prevention Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4855-conflict-story.md>) — shared issue ArcGISPro/ps-location-referencing#4855 · 1 shared keyword: route <!-- rel:42 s=1003 -->
- [Gone Doc](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/gone.md>) — 1 shared keyword: route <!-- rel:999 s=1 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge Events](https://pro.arcgis.test/merge-events)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — Merge preserves measures { #tc-p01 }
<!-- lrs:case det=S1 conf=high src="slide 3" -->
- **Group:** Normal Routes
![Figure 1 — Merge before](../media/4855-merge-plan/fig-01-slide-03-merge.png)

### TC-P01 — Merge preserves measures <!-- src: S1 · slide 5 -->
- **Group:** Normal Routes (a duplicate heading — MkDocs suffixes its id)

### TC-N01 — Lock conflict refuses { #tc-n01 }
<!-- lrs:case det=S1 conf=high src="slide 4" -->
- **Group:** Conflicts
- **Steps:**
  - [ ] 1. Set <RouteID> on the network
  - [ ] 2. Read the value in {measure}

## Notes | pipes

> [!CAUTION]
> A pass here is the described denial.
> Never the edit succeeding.

> [!IMPORTANT] Reviewer, start here
> The merge path changed in 11.4.

> [!EXAMPLE]-
> A worked example the reader can unfold.

Trailing text with a `code` span and a kept `<literal>` one.
"""

STORY = """# Conflict Prevention Story

| Field | Value |
| --- | --- |
| **Doc** | 42 · User Story · Pro |
| **Status** | Indexed |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issues** | [ArcGISPro/ps-location-referencing#4855](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4855) |
| **Source** | [Story.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/Story.docx>) |
| **People** | author Claire Wang |
| **Edited** | 2026-08-05 09:00 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.1 · prompt v3.0.0 |
| **Keywords** | routes · locks |

## Summary

The story.

## Related documents

<!-- related:begin -->
- [Merge Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4855-merge-plan.md>) — shared issue <!-- rel:17 s=1003 -->
<!-- related:end -->

---

Body of the story.
"""

DRAFT = """# Test Plan — Conflict Prevention

| Field | Value |
| --- | --- |
| **Doc** | draft · Test Plan · Pro |
| **Status** | Draft — 2 verifier finding(s) |
| **Source** | [Conflict Prevention Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4855-conflict-story.md>) · story 42 |
| **Generated** | pipeline/testplangen.mjs v1.24 · prompt v1.14.0 · 2026-09-06T23:00:00.000Z |

> [!WARNING]
> **DRAFT — machine-generated, unreviewed.** Review every case and resolve all [VERIFY] items before use.

## Overview

Verifies lock acquisition on new routes.

## Positive Tests

### TC-P01 — Lock acquired on Create Route { #tc-p01 }
- **Steps:**
  - [ ] 1. Create route <R100>.
- **Expected Result:** A lock is held.

## Issue Trace
<!-- lrs:addendum name=issue-trace -->

| Issue | Source |
| --- | --- |
| ArcGISPro/ps-location-referencing#4855 | story |
"""

LEGACY = """# Old Spike

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |

<!-- metadata
```yaml
title: "Old Spike"
doc_id: 9
doc_kind: "Design Spike"
surface: "Pro"
target_release: ""
pe: ""
dev: ""
author: "Someone Else"
last_edited_by: "Someone Else"
last_edited: "2026-07-01T08:00:00Z"
keywords: ["route"]
tools: []
products: []
issues: []
related: []
```
-->

## Summary

A spike still in the old frame.

---

Spike body.
"""


def run_job(cfg_path, extra, env_extra=None):
    env = dict(os.environ)
    if env_extra:
        env.update(env_extra)
    return subprocess.run(
        ["node", "--experimental-strip-types", JOB, "--config", cfg_path] + extra,
        capture_output=True, text=True, cwd=REPO, env=env,
    )


def md_links(text):
    """Relative markdown link targets (.md, with optional #anchor) in a page."""
    out = []
    for m in re.finditer(r"\]\(<?([^)>\s]+?\.md(?:#[^)>\s]*)?)>?\)", text):
        t = m.group(1)
        if not t.startswith("http"):
            out.append(t)
    return out


def main():
    tmp = tempfile.mkdtemp(prefix="wiki-gate-")
    lib = os.path.join(tmp, "lib")
    work = os.path.join(tmp, "work")
    for d in ("Test Plans", "User Stories", "Design Spikes", os.path.join("media", "4855-merge-plan")):
        os.makedirs(os.path.join(lib, d), exist_ok=True)
    os.makedirs(work, exist_ok=True)
    with open(os.path.join(lib, "Test Plans", "4855-merge-plan.md"), "w", encoding="utf-8") as f:
        f.write(PLAN)
    with open(os.path.join(lib, "User Stories", "4855-conflict-story.md"), "w", encoding="utf-8") as f:
        f.write(STORY)
    with open(os.path.join(lib, "Design Spikes", "old-spike__doc9.md"), "w", encoding="utf-8") as f:
        f.write(LEGACY)
    with open(os.path.join(lib, "_Index.md"), "w", encoding="utf-8") as f:
        f.write("# Browse\n\n| Document |\n|---|\n")
    with open(os.path.join(lib, "_Sweep Status.md"), "w", encoding="utf-8") as f:
        f.write("# Status\n")
    # a tiny valid PNG (1x1)
    png = (b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"
           b"\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")
    with open(os.path.join(lib, "media", "4855-merge-plan", "fig-01-slide-03-merge.png"), "wb") as f:
        f.write(png)
    # a phase-5 draft: the document skeleton, so readMeta reads it
    drafts_dir = os.path.join(tmp, "Test Plan Drafts")
    os.makedirs(drafts_dir, exist_ok=True)
    with open(os.path.join(drafts_dir, "4855-conflict-story--draft-20260906-2300.md"),
              "w", encoding="utf-8") as f:
        f.write(DRAFT)
    lists = {"keywords": [
        {"id": "1", "fields": {"Title": "route", "Kind": "topic"}},
        {"id": "2", "fields": {"Title": "routes", "Kind": "topic", "CanonicalRefLookupId": 1}},
        {"id": "3", "fields": {"Title": "gantt charts", "Kind": "tool", "CanonicalRefLookupId": "4"}},
        {"id": "4", "fields": {"Title": "gantt chart", "Kind": "tool"}},
        {"id": "5", "fields": {"Title": "merge events", "Kind": "tool"}},
    ]}
    with open(os.path.join(work, "list-backup-20260906T000000.json.gz"), "wb") as f:
        f.write(gzip.compress(json.dumps({"exported": "x", "lists": lists}).encode()))
    cfg = {"paths": {"sidecarLibrary": lib, "workDir": work},
           "wiki": {"siteName": "LRS Doc Index (gate)", "branch": "wiki-main",
                    "draftsDir": drafts_dir}}
    cfg_path = os.path.join(tmp, "config.json")
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    out = os.path.join(work, "wiki")
    docs = os.path.join(out, "docs")

    def page(rel):
        p = os.path.join(docs, rel)
        return open(p, encoding="utf-8").read() if os.path.isfile(p) else ""

    # ---- 1. render ------------------------------------------------
    print("== render")
    r = run_job(cfg_path, [])
    check("render exit 0", r.returncode == 0, r.stderr[-600:])
    summ = json.loads(r.stdout.splitlines()[0]) if r.stdout.strip() else {}
    check("summary JSON: 3 docs, aliases merged from the list backup, one media file",
          summ.get("docs") == 3 and summ.get("keyword_aliases_merged") == 2 and summ.get("media_files") == 1
          and summ.get("list_backup", "").startswith("list-backup-"), r.stdout[:300])
    check("Wiki_summary line", "Wiki_summary: docs=3 pages=" in r.stdout and "pushed=0" in r.stdout, r.stdout[-200:])
    expected = ["index.md", "about.md", "recent.md", "test-plans/index.md", "test-plans/4855-merge-plan.md",
                "user-stories/index.md", "user-stories/4855-conflict-story.md",
                "design-spikes/index.md", "design-spikes/old-spike-doc9.md",
                "keywords/index.md", "keywords/route.md", "keywords/gantt-chart.md", "keywords/merge-events.md", "keywords/locks.md",
                "tools/index.md", "tools/merge-events.md", "products/index.md", "products/roads-and-highways.md",
                "releases/index.md", "releases/3-8.md", "people/index.md", "people/mac-christmas.md", "people/someone-else.md",
                "issues/index.md", "issues/arcgispro-ps-location-referencing-4855.md",
                "cases/index.md", "figures/index.md", "media/4855-merge-plan/fig-01-slide-03-merge.png"]
    missing = [p for p in expected if not os.path.isfile(os.path.join(docs, p))]
    check("the tree: every expected page and the copied media", not missing, str(missing))
    check("browse pages and status page are not documents",
          not any(f.startswith("_") or "index-1" in f for f in os.listdir(docs))
          and "Browse" not in page("test-plans/index.md"), str(os.listdir(docs)))
    check("no page for the alias terms (routes, gantt charts)",
          not os.path.exists(os.path.join(docs, "keywords", "routes.md"))
          and not os.path.exists(os.path.join(docs, "keywords", "gantt-charts.md")))
    ycfg = open(os.path.join(out, "mkdocs.yml"), encoding="utf-8").read()
    check("mkdocs.yml: site name, material theme, search, the nav with every kind and catalog",
          'site_name: "LRS Doc Index (gate)"' in ycfg and "name: material" in ycfg and "- search" in ycfg
          and '"Test Plans": test-plans/index.md' in ycfg and '"Design Spikes": design-spikes/index.md' in ycfg
          and "Keywords: keywords/index.md" in ycfg and "Test cases: cases/index.md" in ycfg
          and "Recent: recent.md" in ycfg, ycfg)
    wf = open(os.path.join(out, ".github", "workflows", "pages.yml"), encoding="utf-8").read()
    check("Pages workflow builds strict from the configured branch and deploys",
          "branches: [wiki-main]" in wf and "mkdocs build --strict" in wf and "actions/deploy-pages" in wf, wf[:300])
    check("README says the tree is generated", "Do not edit here" in open(os.path.join(out, "README.md"), encoding="utf-8").read())

    # ---- 2. links -------------------------------------------------
    print("== links")
    broken = []
    for root, _dirs, files in os.walk(docs):
        for fn in files:
            if not fn.endswith(".md"):
                continue
            p = os.path.join(root, fn)
            text = open(p, encoding="utf-8").read()
            for t in md_links(text):
                target = os.path.normpath(os.path.join(root, t.split("#")[0].replace("%20", " ")))
                if not os.path.isfile(target):
                    broken.append((os.path.relpath(p, docs), t))
    check("every relative .md link on every page resolves", not broken, str(broken[:6]))
    plan = page("test-plans/4855-merge-plan.md")
    check("metadata table links into the catalogs (kind, product, release, issue, people, keywords, tools)",
          "[Test Plan](./index.md)" in plan and "[Roads & Highways](../products/roads-and-highways.md)" in plan
          and "[3.8](../releases/3-8.md)" in plan
          and "[ArcGISPro/ps-location-referencing#4855](../issues/arcgispro-ps-location-referencing-4855.md) ([open](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4855))" in plan
          and "PE [Claire Wang](../people/claire-wang.md)" in plan
          and "[gantt chart](../keywords/gantt-chart.md)" in plan and "[Merge Events](../tools/merge-events.md)" in plan,
          plan[:1200])
    check("Source keeps the original SharePoint link and the revision",
          "[Merge Plan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Merge%20Plan.pptx>) · rev V2" in plan, plan[:900])
    check("related list links the sibling page and degrades the missing target to text",
          "- [Conflict Prevention Story](../user-stories/4855-conflict-story.md) — shared issue" in plan
          and "- Gone Doc — 1 shared keyword: route" in plan, plan)
    check("the body follows a rule, media link unchanged (resolves through docs/media)",
          "\n---\n\n## Test Cases" in plan and "![Figure 1 — Merge before](../media/4855-merge-plan/fig-01-slide-03-merge.png)" in plan, plan[-600:])
    check("a pipe in a body heading survives (escaped only inside table cells)", "## Notes | pipes" in plan, plan[-300:])
    check("a case's own attr_list anchor survives the body escape",
          "### TC-P01 — Merge preserves measures { #tc-p01 }" in plan
          and "\\{ #tc-p01 }" not in plan, plan[-900:])

    # ---- 2b. the MkDocs dialect translation (v1.1) ----------------
    print("== dialect")
    check("the whole summary reaches the page, not just its first line",
          "A second paragraph the classifier wrote" in plan, plan[:1600])
    check("the docs region becomes an Esri documentation section on the page",
          "## Esri documentation" in plan and "[Merge Events](https://pro.arcgis.test/merge-events)" in plan,
          plan[:2000])
    order = [plan.find(h) for h in ("## Related documents", "## Esri documentation", "\n---\n")]
    check("the docs section sits above the body seam, below Related documents",
          all(i >= 0 for i in order) and order == sorted(order), str(order))
    check("GFM alerts become admonition blocks MkDocs renders",
          "!!! danger" in plan and "    A pass here is the described denial." in plan
          and "[!CAUTION]" not in plan, plan[-800:])
    check("an alert's trailing text becomes the admonition's title",
          '!!! info "Reviewer, start here"' in plan
          and "    The merge path changed in 11.4." in plan
          and "[!IMPORTANT]" not in plan, plan[-1400:])
    check("a Material type beyond GFM's five maps, and a fold suffix collapses the block",
          "??? example" in plan and "    A worked example the reader can unfold." in plan
          and "[!EXAMPLE]" not in plan, plan[-1400:])
    check("a <placeholder> in body text is escaped, not swallowed as HTML",
          "&lt;RouteID>" in plan and "<RouteID>" not in plan, plan[-800:])
    check("a trailing brace run is escaped away from attr_list",
          "\\{measure}" in plan, plan[-800:])
    check("code spans keep their angle brackets",
          "`<literal>`" in plan, plan[-400:])
    check("<br> and autolinks survive the escape",
          "](<https://esriis.sharepoint.com" in plan, plan[:1200])
    story = page("user-stories/4855-conflict-story.md")
    check("a metadata row the document has nothing to say in is omitted",
          "| **Release** |" in plan and "| **Tools** |" in plan
          and "| **Release** |" not in story and "| **Tools** |" not in story
          and " | — |" not in story, story[:900])
    check("the Status row is always present — its value on a pre-3.1 file",
          "| **Status** | Indexed |" in story and "| **Status** | — |" in plan, plan[:900])
    # ---- 2c. the Drafts section (v1.3, phase 5) --------------------
    print("== drafts")
    dpage = page("drafts/4855-conflict-story-draft-20260906-2300.md")
    dindex = page("drafts/index.md")
    check("a draft becomes a page with its own head",
          dpage.startswith("# Test Plan — Conflict Prevention")
          and "| **Doc** | draft · Test Plan · Pro |" in dpage
          and "| **Status** | Draft — 2 verifier finding(s) |" in dpage
          and "| **Generated** | pipeline/testplangen.mjs v1.24" in dpage, dpage[:600])
    check("the draft's Source row links the story's own page",
          "[Conflict Prevention Story](../user-stories/4855-conflict-story.md)" in dpage, dpage[:800])
    check("the draft body is translated for MkDocs like any other body",
          "!!! warning" in dpage and "&lt;R100>" in dpage
          and "[!WARNING]" not in dpage and "lrs:addendum" not in dpage, dpage)
    check("the Drafts catalog lists the draft, newest first, and says unreviewed",
          "# Test-plan drafts" in dindex and "**unreviewed**" in dindex
          and "| 2026-09-06 23:00 |" in dindex
          and "[Test Plan — Conflict Prevention](" in dindex, dindex)
    check("drafts join no catalog and no other page",
          "Conflict Prevention" not in page("test-plans/index.md")
          and "drafts/" not in page("cases/index.md")
          and "drafts/" not in page("recent.md")
          and "drafts/" not in page("keywords/index.md"), page("test-plans/index.md")[:400])
    check("the nav and the front page carry the Drafts section",
          "- Drafts: drafts/index.md" in ycfg
          and "Test-plan drafts](./drafts/index.md) (1)" in page("index.md"), ycfg + page("index.md")[-400:])

    check("mkdocs.yml enables the extensions the dialect needs",
          "pymdownx.tasklist" in ycfg and "custom_checkbox: true" in ycfg
          and "sane_lists" in ycfg and 'toc_depth: "2-3"' in ycfg
          and "- admonition" in ycfg and "pymdownx.details" in ycfg
          and "pymdownx.superfences" in ycfg, ycfg)
    # ---- 2d. the composed pages' own admonitions (v1.5) -----------
    about = page("about.md")
    front = page("index.md")
    css = open(os.path.join(docs, "stylesheets", "extra.css"), encoding="utf-8").read()
    check("the unreviewed notice is a draft admonition on both the draft page and its catalog",
          '!!! draft "Unreviewed draft"' in dpage and "**unreviewed**" in dpage
          and '!!! draft "Unreviewed"' in dindex, dpage[:1400])
    check("About states the render-not-a-source rule in an admonition and folds its provenance list",
          '!!! info "A render, not a source"' in about
          and '???+ note "Where each page' in about
          and "    - **Doc** ids are Doc Index list row ids" in about, about)
    check("the front page opens Browse with a search tip",
          '!!! tip "Finding a document"' in front and "## Browse" in front, front[-1400:])
    check("extra.css defines the custom draft admonition (colour and icon)",
          "--md-admonition-icon--draft" in css
          and ".md-typeset .admonition.draft" in css, css[:200])
    check("the story links back to the plan", "[Merge Events Test Plan](../test-plans/4855-merge-plan.md)" in story, story)

    # ---- 3. keyword map -------------------------------------------
    print("== keywords")
    route = page("keywords/route.md")
    check("alias docs land on the canonical page, grouped by kind",
          "## Test Plan" in route and "## User Story" in route and "## Design Spike" in route
          and "3 documents" in route, route)
    kwi = page("keywords/index.md")
    check("keyword index shows the list's kinds and counts",
          "| [route](./route.md) (topic) | 3 |" in kwi and "| [gantt chart](./gantt-chart.md) (tool) | 1 |" in kwi, kwi)
    check("a keyword with no list row still gets a page", "| [locks](./locks.md) | 1 |" in kwi, kwi)

    # ---- 4. anchors -----------------------------------------------
    print("== anchors")
    cases = page("cases/index.md")
    check("case catalog: an anchored case links its own id, an unanchored one the slug",
          "3 cases." in cases
          and "| 1 | [TC-P01 — Merge preserves measures](../test-plans/4855-merge-plan.md#tc-p01) |" in cases
          and "| 2 | [TC-P01 — Merge preserves measures](../test-plans/4855-merge-plan.md#tc-p01-merge-preserves-measures) |" in cases
          and "#tc-n01) |" in cases, cases)
    figs = page("figures/index.md")
    check("figure catalog: the image, thumbnail-sized, linking its section",
          "1 figures." in figs
          and "[![Figure 1 — Merge before](../media/4855-merge-plan/fig-01-slide-03-merge.png){ width=160 }](../test-plans/4855-merge-plan.md#tc-p01)" in figs, figs)
    if shutil.which("mkdocs"):
        r = run_job(cfg_path, ["--build"])
        check("mkdocs build --strict passes on the rendered tree", r.returncode == 0 and '"built":true' in r.stdout, r.stderr[-800:])
        html = open(os.path.join(out, "site", "test-plans", "4855-merge-plan", "index.html"), encoding="utf-8").read() \
            if os.path.isfile(os.path.join(out, "site", "test-plans", "4855-merge-plan", "index.html")) else ""
        # the point of the leg is AGREEMENT: every fragment the case and
        # figure catalogs link into this plan must be an id MkDocs
        # actually emitted — an explicit `{ #tc-p01 }` and a derived
        # slug alike. Asserting the agreement rather than a list of
        # slugs keeps the leg honest when the anchoring rule changes.
        linked = sorted(set(re.findall(r"4855-merge-plan\.md#([\w-]+)", cases + figs)))
        built = set(re.findall(r'id="([\w-]+)"', html))
        check("the built page carries exactly the ids the catalogs link",
              len(linked) >= 3 and all(f in built for f in linked)
              and "tc-p01" in linked and "tc-n01" in linked,
              f"linked={linked} missing={[f for f in linked if f not in built]}")
        check("the built page shows the figure", 'src="../../media/4855-merge-plan/fig-01-slide-03-merge.png"' in html, html[-2000:])
    else:
        print("  (mkdocs not on PATH — the strict-build legs are skipped here; CI runs them)")

    # ---- 5. comments and legacy frames ----------------------------
    print("== hygiene")
    leaked = []
    for root, _dirs, files in os.walk(docs):
        for fn in files:
            if fn.endswith(".md"):
                t = open(os.path.join(root, fn), encoding="utf-8").read()
                if "<!--" in t or "```yaml" in t or "doc_kind:" in t:
                    leaked.append(fn)
    check("no HTML comment, yaml frame or yaml key reaches any page", not leaked, str(leaked))
    spike = page("design-spikes/old-spike-doc9.md")
    check("legacy sidecar: title, id, kind, author and keyword read from the yaml frame",
          "| **Doc** | 9 · [Design Spike](./index.md) · Pro |" in spike
          and "author [Someone Else](../people/someone-else.md)" in spike
          and "[route](../keywords/route.md)" in spike and "Spike body." in spike, spike)
    recent = page("recent.md")
    order = [m for m in re.findall(r"\| \[([^\]]+)\]\(", recent)]
    check("recent: newest edit first", order == ["Conflict Prevention Story", "Merge Events Test Plan", "Old Spike"], str(order))
    front = page("index.md")
    check("front page: counts per kind and the browse links",
          "3 documents" in front and "| [Test Plans](./test-plans/index.md) | 1 |" in front
          and "[Keywords](./keywords/index.md) (4)" in front and "[Issues](./issues/index.md) (1)" in front, front)
    issue = page("issues/arcgispro-ps-location-referencing-4855.md")
    check("issue page names the devtopia URL and both documents",
          "Issue: <https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4855>" in issue
          and "2 documents" in issue, issue)

    # ---- 6. push --------------------------------------------------
    print("== push")
    r = run_job(cfg_path, ["--push"])
    check("--push without wiki.repoUrl refuses and names the key",
          r.returncode != 0 and "wiki.repoUrl is not set" in r.stderr, r.stderr[-300:])
    bare = os.path.join(tmp, "remote.git")
    subprocess.run(["git", "init", "-q", "--bare", bare], check=True)
    cfg["wiki"]["repoUrl"] = bare
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    r = run_job(cfg_path, ["--push"])
    tree = subprocess.run(["git", "--git-dir", bare, "ls-tree", "-r", "--name-only", "wiki-main"],
                          capture_output=True, text=True).stdout.split()
    check("first push lands the tree on the configured branch (docs, mkdocs.yml, the workflow; no site/)",
          r.returncode == 0 and "docs/test-plans/4855-merge-plan.md" in tree and "mkdocs.yml" in tree
          and ".github/workflows/pages.yml" in tree and "docs/media/4855-merge-plan/fig-01-slide-03-merge.png" in tree
          and not any(t.startswith("site/") for t in tree), (r.stderr[-300:], tree[:5]))
    log1 = subprocess.run(["git", "--git-dir", bare, "log", "--oneline", "wiki-main"], capture_output=True, text=True).stdout
    r = run_job(cfg_path, ["--push"])
    log2 = subprocess.run(["git", "--git-dir", bare, "log", "--oneline", "wiki-main"], capture_output=True, text=True).stdout
    check("an unchanged library pushes nothing new (idempotent render)",
          r.returncode == 0 and '"committed":false' in r.stdout and log1 == log2 and log1.count("\n") == 1,
          (r.stdout[-200:], log2))
    with open(os.path.join(lib, "User Stories", "4855-conflict-story.md"), "a", encoding="utf-8") as f:
        f.write("\nA new paragraph.\n")
    r = run_job(cfg_path, ["--push"])
    log3 = subprocess.run(["git", "--git-dir", bare, "log", "--oneline", "wiki-main"], capture_output=True, text=True).stdout
    check("a changed sidecar makes one new commit", r.returncode == 0 and log3.count("\n") == 2 and "committed\":true" in r.stdout, log3)
    cfg["paths"]["sidecarLibrary"] = os.path.join(tmp, "nope")
    with open(cfg_path, "w") as f:
        json.dump(cfg, f)
    r = run_job(cfg_path, [])
    check("a missing sidecar library refuses", r.returncode != 0 and "sidecar library not found" in r.stderr, r.stderr[-200:])

    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FAILED: " + ", ".join(FAIL))
        sys.exit(1)
    print("RESULT: PASS")


if __name__ == "__main__":
    main()
