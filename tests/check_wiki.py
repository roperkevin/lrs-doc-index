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
  5f. the v2.1 dress by content type: the summary as an abstract
     block (the no-summary alert stays a warning), the related list
     as a foldable `related` block, the Esri links as a `docs` block,
     Expected Result as a success block, page status (`new` within
     NEW_DAYS, `draft`), the kind cards, the icon titles, the palette
     and instant-nav knobs in mkdocs.yml, the custom types in
     extra.css — and, built, the blocks, the badge and the button
  5e. the v1.8 lists: the case grammar's bold-label field bullets
     become a definition list (with the task list travelling into the
     Steps definition), a plain bullet list is left alone, and
     About's provenance list is composed as one
  5d. the v1.7 data tables: the tables the render COMPOSES carry the
     sortable wrapper and the sort script, count and ordinal columns
     are right-aligned, and the metadata card is left alone
  5c. the v1.6 admonitions: an alert's trailing text becomes the
     block's title, Material's types beyond GFM's five map, a `-`
     fold suffix makes the block collapsible, the composed pages
     (draft, drafts catalog, About, front) carry their notices as
     admonitions, and extra.css defines the custom `draft` type
  5c. the v2.0 organisation: every page in the nav (tabs, a section
     per kind and catalog with its index page first, reader order,
     no not_in_nav), the All-documents and Browse pages, the front
     page's order, breadcrumbs and the Open button on a document page,
     filterable tables and the case catalog's page-wide filter, the
     Kind column, a keyword's co-tags and a person's roles, search
     boost / exclude front matter, natural catalog order, the issue
     host read off the corpus (magiclink), tilde, glightbox captions,
     the offline knob, the reserved-folder refusal — and, when mkdocs
     is present, the built tab bar, the Open button, the devtopia
     issue link, strikethrough and the search index's contents
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
| **Surfaces** | Pro · REST |
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
- **Case:** The merge is refused while another user holds the lock
![Figure 2 — Lock dialog](../media/4855-merge-plan/fig-02-slide-04-lock.png)
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

Trailing text with a `code` span, a kept `<literal>` one and ~~a struck run~~ at ~5 minutes.
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

> [!WARNING]
> No AI summary was generated for this document.

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

    def raw(rel):
        p = os.path.join(docs, rel)
        return open(p, encoding="utf-8").read() if os.path.isfile(p) else ""

    def page(rel):
        """A page minus its search front matter (v2.0) — the markdown
        the contract below pins starts under it."""
        return re.sub(r"\A---\n(?:[^\n]*\n)*?---\n\n?", "", raw(rel))

    # ---- 1. render ------------------------------------------------
    print("== render")
    r = run_job(cfg_path, [])
    check("render exit 0", r.returncode == 0, r.stderr[-600:])
    summ = json.loads(r.stdout.splitlines()[0]) if r.stdout.strip() else {}
    check("summary JSON: 3 docs, aliases merged from the list backup, one media file, one missing",
          summ.get("docs") == 3 and summ.get("keyword_aliases_merged") == 2 and summ.get("media_files") == 1
          and summ.get("media_missing") == 1
          and summ.get("list_backup", "").startswith("list-backup-"), r.stdout[:300])
    check("Wiki_summary line", "Wiki_summary: docs=3 pages=" in r.stdout and "pushed=0" in r.stdout, r.stdout[-200:])
    expected = ["index.md", "about.md", "recent.md", "test-plans/index.md", "test-plans/4855-merge-plan.md",
                "user-stories/index.md", "user-stories/4855-conflict-story.md",
                "design-spikes/index.md", "design-spikes/old-spike-doc9.md",
                "keywords/index.md", "keywords/route.md", "keywords/gantt-chart.md", "keywords/merge-events.md", "keywords/locks.md",
                "tools/index.md", "tools/merge-events.md", "products/index.md", "products/roads-and-highways.md",
                "surfaces/index.md", "surfaces/pro.md", "surfaces/rest.md",
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
    # v2.0: every kind and every catalog is a SECTION whose first entry
    # is its index page (navigation.indexes), with its pages under it
    check("mkdocs.yml: site name, material theme, search, the nav with every kind and catalog as a section",
          'site_name: "LRS Doc Index (gate)"' in ycfg and "name: material" in ycfg and "- search" in ycfg
          and '      - "Test Plans":\n          - test-plans/index.md\n          - "Merge Events Test Plan": test-plans/4855-merge-plan.md' in ycfg
          and '      - "Design Spikes":\n          - design-spikes/index.md\n          - "Old Spike": design-spikes/old-spike-doc9.md' in ycfg
          and '      - Keywords:\n          - keywords/index.md\n          - "gantt chart": keywords/gantt-chart.md' in ycfg
          and '          - "ArcGISPro/ps-location-referencing#4855": issues/arcgispro-ps-location-referencing-4855.md' in ycfg
          and "  - Test cases:\n      - cases/index.md" in ycfg and "Recent: recent.md" in ycfg, ycfg)
    # v2.3: Figures is out of the nav (still a page, still a Browse card)
    check("the nav is tabs: Home, Documents (landing on All documents), Browse (landing on the cards), Test cases — no Figures entry",
          "  - Home: index.md\n  - Documents:\n      - documents/index.md\n" in ycfg
          and "  - Browse:\n      - browse/index.md\n" in ycfg
          and "  - Test cases:\n      - cases/index.md\n" in ycfg
          and "figures/index.md" not in ycfg and "Test cases & figures" not in ycfg, ycfg)
    check("kinds follow reader order in the nav (Test Plans before User Stories before Design Spikes), not the alphabet",
          0 < ycfg.find('"Test Plans":') < ycfg.find('"User Stories":') < ycfg.find('"Design Spikes":'), ycfg)
    check("every page is in the nav — nothing is left to not_in_nav",
          "not_in_nav" not in ycfg
          and all(p.endswith(".png") or f": {p}" in ycfg or f"- {p}" in ycfg
                  for p in ["test-plans/4855-merge-plan.md", "keywords/locks.md", "people/someone-else.md",
                            "products/pipeline-referencing.md", "releases/3-8.md", "tools/merge-events.md",
                            "documents/index.md", "browse/index.md", "about.md"]), ycfg)
    check("theme features: tabs, section indexes and pruning replace navigation.sections",
          "navigation.tabs," in ycfg and "navigation.tabs.sticky" in ycfg and "navigation.indexes" in ycfg
          and "navigation.prune" in ycfg and "navigation.sections" not in ycfg, ycfg)
    # from the MkDocs catalog review (v2.0): magiclink on the corpus's
    # own issue host, tilde without subscript, glightbox captions;
    # offline off unless asked
    check("mkdocs.yml: magiclink shorthand points at the issue host read off the corpus, tilde has no subscript, glightbox captions",
          'provider: "devtopia"' in ycfg and 'host: "https://devtopia.esri.com"' in ycfg
          and "repo_url_shorthand: true" in ycfg and "repo_url_shortener: true" in ycfg
          and "- pymdownx.tilde:\n      subscript: false" in ycfg
          and "- glightbox:\n      auto_caption: true" in ycfg
          and "- offline" not in ycfg, ycfg)
    wf = open(os.path.join(out, ".github", "workflows", "pages.yml"), encoding="utf-8").read()
    check("Pages workflow builds strict from the configured branch and deploys",
          "branches: [wiki-main]" in wf and "mkdocs build --strict" in wf and "actions/deploy-pages" in wf
          and "mkdocs-glightbox" in wf and "mkdocs-panzoom-plugin" in wf and "markdown-captions" in wf, wf[:400])
    check("README says the tree is generated", "Do not edit here" in open(os.path.join(out, "README.md"), encoding="utf-8").read())
    check("README: the Pages source for the artifact deploy",
          "Source: GitHub Actions" in open(os.path.join(out, "README.md"), encoding="utf-8").read())
    # the GHES shape: self-hosted runner, no setup-python, gh-pages branch deploy
    cfg2 = json.loads(json.dumps(cfg))
    cfg2["wiki"].update({"runsOn": "self-hosted", "setupPython": False, "deploy": "branch",
                         "offline": True, "outDir": os.path.join(work, "wiki-ghes")})
    cfg2_path = os.path.join(tmp, "config-ghes.json")
    with open(cfg2_path, "w") as f:
        json.dump(cfg2, f)
    r2 = run_job(cfg2_path, [])
    check("render exit 0 (GHES shape)", r2.returncode == 0, r2.stderr[-600:])
    ycfg2 = open(os.path.join(work, "wiki-ghes", "mkdocs.yml"), encoding="utf-8").read()
    check("wiki.offline enables Material's offline plugin (v2.0)", "\n  - offline\n" in ycfg2, ycfg2)
    cfg_res = json.loads(json.dumps(cfg))
    cfg_res["sweep"] = {"kindFolders": {"Playbook": "Keywords"}}
    cfg_res["wiki"]["outDir"] = os.path.join(work, "wiki-reserved")
    with open(os.path.join(tmp, "config-reserved.json"), "w") as f:
        json.dump(cfg_res, f)
    r_res = run_job(os.path.join(tmp, "config-reserved.json"), [])
    check("a kind folder that would land on a folder the wiki reserves is refused by name",
          r_res.returncode != 0 and 'sweep.kindFolders: "Playbook" -> "Keywords"' in r_res.stderr
          and "docs/keywords/" in r_res.stderr, r_res.stderr[-400:])
    wf2 = open(os.path.join(work, "wiki-ghes", ".github", "workflows", "pages.yml"), encoding="utf-8").read()
    check("deploy=branch: gh-deploy to gh-pages with contents: write, no artifact upload, no deploy job",
          "mkdocs gh-deploy --force --no-history --remote-branch gh-pages" in wf2
          and "contents: write" in wf2 and "GIT_COMMITTER_NAME" in wf2
          and "mkdocs build --strict" in wf2 and "runs-on: self-hosted" in wf2
          and "upload-pages-artifact" not in wf2 and "deploy-pages" not in wf2
          and "setup-python" not in wf2 and "github-pages" not in wf2, wf2)
    check("deploy=branch README names the gh-pages Pages source",
          "Deploy from a branch" in open(os.path.join(work, "wiki-ghes", "README.md"), encoding="utf-8").read())
    check("default workflow keeps setup-python and pages: write",
          "actions/setup-python@v5" in wf and "pages: write" in wf and "gh-deploy" not in wf)
    cfg2["wiki"]["deploy"] = "gh-pages"
    with open(cfg2_path, "w") as f:
        json.dump(cfg2, f)
    r3 = run_job(cfg2_path, [])
    check("an unknown wiki.deploy is refused by name",
          r3.returncode != 0 and "wiki.deploy must be one of artifact, branch" in r3.stderr, r3.stderr[-300:])

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
    check("metadata table links into the catalogs (kind, surface, product, release, issue, people, keywords, tools)",
          "[Test Plan](./index.md)" in plan and "[Roads & Highways](../products/roads-and-highways.md)" in plan
          and "| **Doc** | 17 · [Test Plan](./index.md) · [Pro](../surfaces/pro.md) |" in plan
          and "| **Surfaces** | [Pro](../surfaces/pro.md) · [REST](../surfaces/rest.md) |" in plan
          and "4855-merge-plan.md" in page("surfaces/rest.md") and "4855-conflict-story.md" not in page("surfaces/rest.md")
          and "4855-conflict-story.md" in page("surfaces/pro.md")
          and "[3.8](../releases/3-8.md)" in plan
          and "[ArcGISPro/ps-location-referencing#4855](../issues/arcgispro-ps-location-referencing-4855.md) ([open](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4855))" in plan
          and "PE [Claire Wang](../people/claire-wang.md)" in plan
          and "[gantt chart](../keywords/gantt-chart.md)" in plan and "[Merge Events](../tools/merge-events.md)" in plan,
          plan[:1200])
    check("Source keeps the original SharePoint link and the revision",
          "[Merge Plan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Merge%20Plan.pptx>) · rev V2" in plan, plan[:900])
    check("related list links the sibling page and degrades the missing target to text, in a foldable related block",
          '???+ related "Related documents (2)"\n\n    - [Conflict Prevention Story](../user-stories/4855-conflict-story.md) — shared issue' in plan
          and "    - Gone Doc — 1 shared keyword: route" in plan and "## Related documents" not in plan, plan)
    check("the body follows a rule, media link unchanged (resolves through docs/media)",
          "\n---\n\n## Test Cases" in plan and "![Figure 1 — Merge before](../media/4855-merge-plan/fig-01-slide-03-merge.png)" in plan, plan[-600:])
    # a link whose file is not in the library never reaches the page:
    # `mkdocs build --strict` fails on an unresolved link, so the render
    # leaves a marker with the alt text where the figure was
    check("a media link with no file behind it is rendered as a marker, not a link",
          "fig-02-slide-04-lock.png" not in plan and "*(missing figure: Figure 2 — Lock dialog)*" in plan, plan[-900:])
    report = os.path.join(work, "wiki-missing-media.txt")
    check("the missing media are listed by page in <workDir>/wiki-missing-media.txt",
          os.path.isfile(report)
          and "test-plans/4855-merge-plan.md\t../media/4855-merge-plan/fig-02-slide-04-lock.png" in open(report, encoding="utf-8").read()
          and "media link(s) have no file in the library" in r.stderr, r.stderr[-400:])
    check("a pipe in a body heading survives (escaped only inside table cells)", "## Notes | pipes" in plan, plan[-300:])
    # v2.1: every TC case's content sits in a `//// html | div.lrs-case`
    # Blocks wrapper under its heading (one card), deck sections do
    # not; the Expected result is a three-slash block nested in it; a
    # def list after an image line starts its own block
    check("each TC case's content is wrapped for the card in a four-slash Blocks html block, up to the next heading",
          plan.count("//// html | div.lrs-case") == 3 and plan.count("\n////\n") == 3
          and "### TC-P01 — Merge preserves measures { #tc-p01 }\n\n//// html | div.lrs-case\n\n/// html | div.lrs-group\n\nNormal Routes\n///" in plan
          and "////\n\n## Notes | pipes" in plan and "lrs-case\" markdown" not in plan
          and "*(missing figure: Figure 2 — Lock dialog)*\n\n/// html | div.lrs-steps\n\n- [ ] 1." in plan, plan[-1800:])
    dblocks = page("drafts/4855-conflict-story-draft-20260906-2300.md")
    check("the Expected result nests in the card as a three-slash admonition block, body unindented",
          dblocks.count("//// html | div.lrs-case") == 1
          and "\n\n/// admonition | Expected result\n    type: success\n\nA lock is held.\n///\n" in dblocks
          and dblocks.find("//// html | div.lrs-case") < dblocks.find("/// admonition | Expected result") < dblocks.find("\n////\n")
          and "////\n\n## Issue Trace" in dblocks and "!!! success" not in dblocks, dblocks)
    check("mkdocs.yml enables the Blocks extensions the card uses",
          "\n  - pymdownx.blocks.html\n  - pymdownx.blocks.admonition\n" in ycfg, ycfg)
    check("a case's own attr_list anchor survives the body escape",
          "### TC-P01 — Merge preserves measures { #tc-p01 }" in plan
          and "\\{ #tc-p01 }" not in plan, plan[-900:])

    # ---- 2b. the MkDocs dialect translation (v1.1) ----------------
    print("== dialect")
    check("the whole summary reaches the page, as an abstract block",
          '!!! abstract "Summary"\n\n    Covers merging line events' in plan
          and "    A second paragraph the classifier wrote" in plan and "## Summary" not in plan, plan[:1600])
    # v2.1: the docs region is a `docs` block titled by its own heading
    check("the docs region becomes an Esri documentation block on the page",
          '!!! docs "Esri documentation"' in plan and "    [Merge Events](https://pro.arcgis.test/merge-events)" in plan
          and "## Esri documentation" not in plan, plan[:2400])
    order = [plan.find(h) for h in ('!!! abstract "Summary"', '???+ related "Related documents (2)"', '!!! docs "Esri documentation"', "\n---\n")]
    check("summary, related and docs blocks sit in that order above the body seam",
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
    check("a draft becomes a page with its own head, under a breadcrumb line",
          dpage.startswith('<div class="lrs-crumbs" markdown>\n\n[Home](../index.md) › [Test-plan drafts](./index.md)\n\n</div>\n\n# Test Plan — Conflict Prevention')
          and "| **Doc** | draft · Test Plan · Pro |" in dpage
          and "| **Status** | Draft — 2 verifier finding(s) |" in dpage
          and "| **Generated** | pipeline/testplangen.mjs v1.24" in dpage, dpage[:600])
    check("the draft's Source row links the story's own page",
          "[Conflict Prevention Story](../user-stories/4855-conflict-story.md)" in dpage, dpage[:800])
    check("the draft body is translated for MkDocs like any other body",
          "&lt;R100>" in dpage and "[!WARNING]" not in dpage and "lrs:addendum" not in dpage, dpage)
    check("the Drafts catalog lists the draft, newest first, and says unreviewed",
          "# :material-file-document-edit: Test-plan drafts" in dindex and "**unreviewed**" in dindex
          and "| 2026-09-06 23:00 |" in dindex
          and "[Test Plan — Conflict Prevention](" in dindex, dindex)
    check("drafts join no catalog and no other page",
          "Conflict Prevention" not in page("test-plans/index.md")
          and "drafts/" not in page("cases/index.md")
          and "drafts/" not in page("recent.md")
          and "drafts/" not in page("keywords/index.md"), page("test-plans/index.md")[:400])
    check("the nav and the front page carry the Drafts section (a tab, each draft under it with its timestamp)",
          '  - Drafts:\n      - drafts/index.md\n      - "Test Plan — Conflict Prevention (2026-09-06 23:00)": drafts/4855-conflict-story-draft-20260906-2300.md' in ycfg
          and "Test-plan drafts](./drafts/index.md) (1)" in page("index.md"), ycfg + page("index.md")[-400:])
    check("a draft is damped in search and carries the draft status; a document boosted, a catalog value neutral",
          raw("drafts/4855-conflict-story-draft-20260906-2300.md").startswith("---\nsearch:\n  boost: 0.5\nstatus: draft\n---\n")
          and raw("test-plans/4855-merge-plan.md").startswith("---\nsearch:\n  boost: 2\n---\n")
          and raw("keywords/route.md").startswith("---\nsearch:\n  boost: 1\n---\n"), raw("drafts/index.md")[:80])
    check("the aggregate pages are excluded from search",
          all(re.match(r"\A---\n(?:title: [^\n]*\n)?search:\n  exclude: true\n---\n", raw(p))
              for p in ["index.md", "documents/index.md", "browse/index.md", "recent.md", "cases/index.md",
                        "figures/index.md", "test-plans/index.md", "keywords/index.md", "drafts/index.md"])
          and "search:" not in raw("about.md").split("\n# ")[0], raw("recent.md")[:80])

    check("mkdocs.yml enables the extensions the dialect needs",
          "pymdownx.tasklist" in ycfg and "custom_checkbox: true" in ycfg
          and "sane_lists" in ycfg and 'toc_depth: "2-3"' in ycfg
          and "- admonition" in ycfg and "pymdownx.details" in ycfg
          and "pymdownx.superfences" in ycfg, ycfg)
    # ---- 2d. the composed pages' own admonitions (v1.6) -----------
    about = page("about.md")
    front = page("index.md")
    css = open(os.path.join(docs, "stylesheets", "extra.css"), encoding="utf-8").read()
    # v2.1: one box — the generator's own banner, retyped as the draft
    # block, keeps its words; the composed notice is only for a draft
    # without one
    check("the unreviewed notice is a draft admonition on both the draft page and its catalog — one box, the file's own banner",
          '!!! draft "Unreviewed draft"\n\n    **DRAFT — machine-generated, unreviewed.**' in dpage
          and dpage.count("!!! draft") == 1 and "!!! warning" not in dpage
          and "This page is a render of the drafts folder" not in dpage
          and '!!! draft "Unreviewed"' in dindex, dpage[:1400])
    check("About states the render-not-a-source rule in an admonition and folds its provenance list",
          '!!! info "A render, not a source"' in about
          and '???+ note "Where each page' in about
          and "    Doc ids\n    :   Doc Index list row ids" in about, about)
    check("the front page opens Browse with a search tip",
          '!!! tip "Finding a document"' in front and "## Browse" in front, front[-1400:])
    check("extra.css defines the custom draft admonition (colour and icon)",
          "--md-admonition-icon--draft" in css
          and ".md-typeset .admonition.draft" in css, css[:200])

    # ---- 2e. data tables (v1.7) -----------------------------------
    tjs = open(os.path.join(docs, "javascripts", "tables.js"), encoding="utf-8").read()
    check("the render writes its own sort script and mkdocs.yml loads it",
          "extra_javascript:" in ycfg and "- javascripts/tables.js" in ycfg
          and ".doc-table table, .sortable table" in tjs
          and "aria-sort" in tjs and "document$" in tjs, ycfg)
    # v2.0: the large tables are also `filterable` (a type-to-filter
    # box); the front page's kind table and the per-plan case tables
    # are not — the case catalog has one `filter-all` box for the page
    check("the composed catalog tables are wrapped for sorting, the large ones for filtering too",
          '<div class="sortable filterable" markdown>' in page("keywords/index.md")
          and '<div class="sortable" markdown>' in page("cases/index.md")
          and '<div class="filter-all" markdown>' in page("cases/index.md")
          and '<div class="sortable filterable" markdown>' in dindex
          and '<div class="doc-table filterable" markdown>' in page("test-plans/index.md")
          and '<div class="doc-table filterable" markdown>' in page("recent.md")
          and '<div class="doc-table filterable" markdown>' in page("documents/index.md")
          and '<div class="doc-table" markdown>' in front and "filterable" not in front,
          page("keywords/index.md")[:400])
    check("tables.js carries the filter, the page-wide filter and external links in a new tab",
          "lrs-filter" in tjs and '".filterable"' in tjs and '".filter-all"' in tjs
          and "FILTER_MIN_ROWS" in tjs and 'a.target = "_blank"' in tjs and 'a.rel = "noopener"' in tjs, tjs[:300])
    check("extra.css styles the filter box, the breadcrumbs and the Open button",
          ".lrs-filter input" in css and ".lrs-crumbs" in css and ".lrs-open" in css
          and "tr[hidden]" in css, css[-600:])
    check("count and ordinal columns are right-aligned",
          "| Keyword | Documents |\n|---|---:|" in page("keywords/index.md")
          and "| # | Case |\n|---:|---|" in page("cases/index.md"),
          page("cases/index.md")[:500])
    # ---- 2f. lists (v1.8) ------------------------------------------
    check("mkdocs.yml enables def_list",
          "- def_list" in ycfg and "clickable_checkbox" not in ycfg, ycfg)
    # v2.3 (mdlayout v1.5): Group and Steps lose their labels — the
    # content alone in a class-named html block; Case (and Trace) stay
    # a definition list, label and value
    check("a case's Case field becomes a definition; Group and Steps stand alone in class-named blocks, no label",
          "Case\n:   The merge is refused while another user holds the lock" in plan
          and "/// html | div.lrs-group\n\nNormal Routes\n///" in plan
          and "/// html | div.lrs-group\n\nConflicts\n///" in plan
          and "Group\n:" not in plan and "Steps\n:" not in plan
          and "- **Group:**" not in plan and "- **Case:**" not in plan, plan[-1600:])
    check("the task list travels into the Steps block, still escaped",
          "/// html | div.lrs-steps\n\n- [ ] 1. Set &lt;RouteID> on the network\n- [ ] 2. Read the value in \\{measure}\n///" in plan, plan[-1600:])
    check("a plain bullet list is not a definition list",
          "- [Conflict Prevention Story](../user-stories/4855-conflict-story.md) — shared issue" in plan, plan[:2000])
    # v2.1 (mdlayout v1.3): Expected Result is the pass criterion, a
    # success block; the other fields stay a definition list
    check("the draft's own field bullets are translated too — Expected Result as a success block",
          "/// admonition | Expected result\n    type: success\n\nA lock is held.\n///" in dpage
          and "/// html | div.lrs-steps\n\n- [ ] 1. Create route &lt;R100>.\n///" in dpage
          and "Expected Result\n:" not in dpage and "- **Expected Result:**" not in dpage, dpage)
    check("About's provenance list is a definition list, and says why nothing ticks",
          "    Doc ids\n    :   Doc Index list row ids" in about
          and "    The checkboxes\n    :   Rendered, never clickable." in about
          and "- **Doc**" not in about, about)
    check("the metadata card is never sortable (its header row is hidden)",
          '<div class="sortable" markdown>' not in plan.split("\n---\n")[0]
          and '<div class="doc-meta" markdown>' in plan, plan[:400])
    # v1.5: the three figure-presentation plugins. panzoom takes
    # include_selectors, NOT `images: true` — mkdocs-panzoom-plugin 0.5.2
    # reads that key off the global config, so it never fires.
    check("mkdocs.yml wires captions, lightbox and pan/zoom for figures",
          "- markdown_captions" in ycfg and "- glightbox" in ycfg
          and "- panzoom:" in ycfg and 'include_selectors: ["img"]' in ycfg
          and "images: true" not in ycfg, ycfg)
    check("mkdocs.yml carries Material's mermaid custom fence",
          "pymdownx.superfences" in ycfg and "name: mermaid" in ycfg
          and "format: !!python/name:pymdownx.superfences.fence_code_format" in ycfg, ycfg)
    check("pymdownx.superfences is configured once — never a duplicate yaml key",
          ycfg.count("- pymdownx.superfences") == 1, ycfg)
    check("the story links back to the plan", "[Merge Events Test Plan](../test-plans/4855-merge-plan.md)" in story, story)

    # ---- 3. keyword map -------------------------------------------
    print("== keywords")
    route = page("keywords/route.md")
    # v2.0: one table with a Kind column (sortable and filterable across
    # the whole set), not one table per kind
    check("alias docs land on the canonical page, in one table with a Kind column",
          "## Test Plan" not in route
          and "| Document | Kind | Product | Release | Edited |\n|---|---|---|---|---|" in route
          and "| [Old Spike](../design-spikes/old-spike-doc9.md) | [Design Spike](../design-spikes/index.md) |" in route
          and "| [Merge Events Test Plan](../test-plans/4855-merge-plan.md) | [Test Plan](../test-plans/index.md) |" in route
          and "3 documents · a topic keyword · [all keywords](./index.md)" in route, route)
    check("a keyword page says what it is most often tagged with, and opens with a breadcrumb line",
          "Often tagged with: [gantt chart](./gantt-chart.md) (1) · [locks](./locks.md) (1) · [merge events](./merge-events.md) (1)" in route
          and route.startswith('<div class="lrs-crumbs" markdown>\n\n[Home](../index.md) › [Keywords](./index.md)\n\n</div>\n\n# route'), route[:400])
    claire = page("people/claire-wang.md")
    check("a person's page says in which roles they appear",
          "2 documents · author of 1 · PE of 1 · [all people](./index.md)" in claire, claire[:400])
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
    # v1.5: raw HTML, not markdown — markdown_captions would turn a
    # markdown image into a <figure>, emptying the anchor around it and
    # moving `width=160` onto the figure. Raw HTML keeps link + width +
    # alt and takes neither a caption nor a panzoom box.
    check("figure catalog: the image, thumbnail-sized, linking its section; the missing one absent",
          "1 figures." in figs and "fig-02-slide-04-lock" not in figs
          and '<a href="../test-plans/4855-merge-plan.md#tc-p01">'
              '<img src="../media/4855-merge-plan/fig-01-slide-03-merge.png" width="160" '
              'alt="Figure 1 — Merge before"></a>' in figs, figs)
    have_mkdocs = subprocess.run([sys.executable, "-m", "mkdocs", "--version"], capture_output=True).returncode == 0
    if have_mkdocs:
        # --build runs `python -m mkdocs`, through the interpreter the
        # config names — here this test's own, so the leg cannot pass
        # by finding a stray mkdocs.exe on PATH
        r = run_job(cfg_path, ["--build"], {"LRSDOC_PYTHON": sys.executable})
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
        # v2.0, the built site: the tab bar, the sidebar listing the
        # plan under its kind, the Open button, magiclink's issue link
        # in the related list, GFM strikethrough, and a search index
        # without the aggregate pages
        tabs = html.split('class="md-tabs"')[1].split("</nav>")[0] if 'class="md-tabs"' in html else ""
        chrome = html.split('class="md-content"')[0]
        check("the built page has the tab bar (Documents, Browse, Test cases) and lists itself in its kind's sidebar section",
              "Documents" in tabs and "Browse" in tabs and "Test cases" in tabs and "figures" not in tabs
              and "md-nav__link--active" in chrome and "Merge Events Test Plan" in chrome
              and "Conflict Prevention Story" not in chrome,  # pruned: the other kinds' pages are not rendered
              (tabs[:400], chrome[-1200:]))
        check("the built page: Open button, shorthand issue link to devtopia, strikethrough, single tilde untouched",
              'class="md-button md-button--primary lrs-open"' in html
              and 'class="magiclink magiclink-devtopia magiclink-issue" href="https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4855"' in html
              and "<del>a struck run</del>" in html and "at ~5 minutes" in html, html[-2500:])
        # v2.1, built: the summary/related/docs blocks, the success block
        # and the draft badge in the nav, the custom palette attribute
        dhtml_path = os.path.join(out, "site", "drafts", "4855-conflict-story-draft-20260906-2300", "index.html")
        dhtml = open(dhtml_path, encoding="utf-8").read() if os.path.isfile(dhtml_path) else ""
        check("the built page carries the abstract, related (open) and docs blocks and the custom palette",
              '<div class="admonition abstract">' in html and '<p class="admonition-title">Summary</p>' in html
              and '<details class="related" open="open">' in html and "Related documents (2)" in html
              and '<div class="admonition docs">' in html and 'data-md-color-primary="custom"' in html, html[-3000:])
        check("the built draft page: a success block per Expected result inside the case card, the draft badge with its tooltip in the nav",
              '<div class="admonition success">' in dhtml and '<p class="admonition-title">Expected result</p>' in dhtml
              and dhtml.count('<div class="lrs-case">') == 1 and html.count('<div class="lrs-case">') == 3
              and dhtml.find('<div class="lrs-case">') < dhtml.find('<div class="admonition success">')
              and 'class="md-status md-status--draft" title="Machine-generated, unreviewed"' in dhtml, dhtml[-2500:])
        idx_path = os.path.join(out, "site", "search", "search_index.json")
        idx = open(idx_path, encoding="utf-8").read() if os.path.isfile(idx_path) else ""
        locs = set(re.findall(r'"location":\s*"([^"#]*)', idx))
        check("the search index carries the document and catalog pages, not the aggregate pages",
              "test-plans/4855-merge-plan/" in locs and "keywords/route/" in locs
              and not any(l in locs for l in ["", "documents/", "recent/", "cases/", "figures/", "test-plans/", "keywords/", "browse/"]),
              str(sorted(locs))[:600])
        cfg_nomk = json.loads(json.dumps(cfg))
        cfg_nomk["wiki"]["python"] = "no-such-interpreter-xyz"
        cfg_nomk["wiki"]["outDir"] = os.path.join(work, "wiki-nomk")
        with open(os.path.join(tmp, "config-nomk.json"), "w") as f:
            json.dump(cfg_nomk, f)
        r = run_job(os.path.join(tmp, "config-nomk.json"), ["--build"])
        check("--build through an interpreter without mkdocs fails naming the pip install",
              r.returncode != 0 and "-m pip install mkdocs-material" in r.stderr and "wiki.python" in r.stderr,
              r.stderr[-400:])
    else:
        print("  (mkdocs not installed for this interpreter — the strict-build legs are skipped here; CI runs them)")

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
          "| **Doc** | 9 · [Design Spike](./index.md) · [Pro](../surfaces/pro.md) |" in spike
          and "author [Someone Else](../people/someone-else.md)" in spike
          and "[route](../keywords/route.md)" in spike and "Spike body." in spike, spike)
    recent = page("recent.md")
    # the row's FIRST link is the document (v2.0 added a Kind link after it)
    order = [m for m in re.findall(r"^\| \[([^\]]+)\]\(", recent, re.M)]
    check("recent: newest edit first, with a Kind column", order == ["Conflict Prevention Story", "Merge Events Test Plan", "Old Spike"]
          and "| [Merge Events Test Plan](./test-plans/4855-merge-plan.md) | [Test Plan](./test-plans/index.md) |" in recent, str(order))
    front = page("index.md")
    check("front page: counts per kind and the browse links",
          "3 documents" in front and ":material-test-tube:{ .lg .middle } [Test Plans](./test-plans/index.md) (1)" in front
          and "[Keywords](./keywords/index.md) (4)" in front and "[Issues](./issues/index.md) (1)" in front, front)
    # ---- 5c. the v2.0 organisation ------------------------------------
    print("== organisation")
    check("front page: tip, Documents (reader order, All-documents link), Recently edited inline, then Browse",
          0 < front.find('!!! tip "Finding a document"') < front.find("## Documents")
          < front.find("[every document in one table](./documents/index.md)")
          < front.find("[Test Plans](./test-plans/index.md) (1)") < front.find("[Design Spikes](./design-spikes/index.md) (1)")
          < front.find("## Recently edited") < front.find("[the Recent page](./recent.md)")
          < front.find("| [Conflict Prevention Story](./user-stories/4855-conflict-story.md) | [User Story](./user-stories/index.md) |")
          < front.find("## Browse"), front)
    alldocs = page("documents/index.md")
    check("All documents: every document in one filterable table with a Kind column, kinds in reader order",
          alldocs.startswith("# :material-file-document-multiple-outline: All documents") and "3 documents of every kind" in alldocs
          and "By kind: [Test Plans](../test-plans/index.md) (1) · [User Stories](../user-stories/index.md) (1) · [Design Spikes](../design-spikes/index.md) (1)." in alldocs
          and "| Document | Kind | Product | Release | Edited |" in alldocs
          and len(re.findall(r"^\| \[", alldocs, re.M)) == 3, alldocs)
    browse = page("browse/index.md")
    check("Browse: the seven catalogs as cards with counts (Surfaces: Pro and REST)",
          browse.startswith("# :material-compass-outline: Browse") and '<div class="grid cards" markdown>' in browse
          and "[Keywords](../keywords/index.md) (4)" in browse and "[People](../people/index.md) (3)" in browse
          and "[Surfaces](../surfaces/index.md) (2)" in browse
          and browse.split('<div class="grid cards" markdown>')[1].count(":material-") == 7, browse)
    check("a document page: breadcrumbs above the title, an Open button for the original under the card",
          plan.startswith('<div class="lrs-crumbs" markdown>\n\n[Home](../index.md) › [Test Plans](./index.md)\n\n</div>\n\n# Merge Events Test Plan')
          and "</div>\n\n[:material-open-in-new: Open Merge Plan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Merge%20Plan.pptx>){ .md-button .md-button--primary .lrs-open }\n\n!!! abstract" in plan,
          plan[:900])
    check("a document without a source URL gets no Open button",
          ".md-button" not in spike and "Open " not in spike.split("\n---\n")[0], spike[:600])
    check("kind index and catalog index say how to filter and sort, and point at All documents",
          "Type in the box to filter the table; click a column header to sort it. Or [see every kind in one table](../documents/index.md)." in page("test-plans/index.md")
          and "4 keywords. Type in the box to filter the table" in kwi, page("test-plans/index.md")[:400])
    check("About explains the organisation",
          '???+ note "How the site is organised"' in about and "    Documents\n    :   One tab" in about
          and "    Search, filter, sort\n" in about, about)
    # ---- 5d. the v2.1 dress by content type ---------------------------
    print("== content types")
    check("the sweep's no-summary alert stays a warning block, never a summary box",
          "!!! warning\n\n    No AI summary was generated for this document." in spike
          and "!!! abstract" not in spike, spike)
    check("the document tables carry no Summary column (title, kind, product, release, edited)",
          "Summary" not in recent and "| Document | Product | Release | Edited |\n|---|---|---|---|" in page("test-plans/index.md")
          and "| [Old Spike](./design-spikes/old-spike-doc9.md) | [Design Spike](./design-spikes/index.md) | — | — | 2026-07-01 |" in recent
          and "[!WARNING]" not in recent, recent)
    check("the front page's kinds are cards with an icon, the count and the newest edit, in reader order",
          '<div class="grid cards lrs-kinds" markdown>' in front
          and "-   :material-test-tube:{ .lg .middle } [Test Plans](./test-plans/index.md) (1)\n\n    ---\n\n    1 document, newest edit 2026-08-01." in front
          and ":material-book-open-variant:{ .lg .middle } [User Stories](./user-stories/index.md) (1)" in front
          and ":material-lightbulb-on-outline:{ .lg .middle } [Design Spikes](./design-spikes/index.md) (1)" in front
          and "| Kind | Documents |" not in front, front)
    check("the index pages' titles wear their icon, with the title pinned in front matter",
          page("test-plans/index.md").startswith("# :material-test-tube: Test Plans")
          and raw("test-plans/index.md").startswith('---\ntitle: "Test Plans"\nsearch:\n  exclude: true\n---\n')
          and kwi.startswith("# :material-tag-multiple: Keywords")
          and page("cases/index.md").startswith("# :material-clipboard-check: Test cases")
          and recent.startswith("# :material-history: Recent")
          and about.startswith("# :material-information: About this wiki")
          and raw("about.md").startswith('---\ntitle: "About this wiki"\n---\n'), raw("test-plans/index.md")[:200])
    check("a catalog value's facts sit in a strip under the title; the figure catalog is a card grid per document",
          '# route\n\n<div class="lrs-facts" markdown>\n\n3 documents · a topic keyword' in route
          and "Often tagged with:" in route.split("</div>")[1]
          and '<div class="grid cards lrs-figures" markdown>' in figs, route[:600])
    check("no fixture document is new (all edits are older than NEW_DAYS), the draft page says draft",
          not any("status: new" in raw(p) for p in ["test-plans/4855-merge-plan.md", "user-stories/4855-conflict-story.md", "design-spikes/old-spike-doc9.md"])
          and "status: draft" in raw("drafts/4855-conflict-story-draft-20260906-2300.md").split("\n---\n")[0]
          and "status:" not in raw("keywords/route.md"), raw("test-plans/4855-merge-plan.md")[:80])
    check("mkdocs.yml: the site's own palette, the status badges with tooltips, instant navigation, tooltips, footnotes",
          "      primary: custom\n      accent: custom" in ycfg and ycfg.count("primary: custom") == 2
          and "    status:\n      draft: material/pencil" in ycfg
          and 'extra:\n  status:\n    new: "Edited in the last 14 days"\n    draft: "Machine-generated, unreviewed"' in ycfg
          and "navigation.instant, navigation.instant.progress," in ycfg and "content.tooltips" in ycfg
          and "\n  - footnotes\n" in ycfg, ycfg)
    check("wiki.offline leaves instant navigation off (a file:// page cannot be fetched)",
          "navigation.instant" not in ycfg2 and "navigation.tabs" in ycfg2, ycfg2[:600])
    check("extra.css: the palette variables for both schemes, the related and docs types, figures, stripes",
          "--md-primary-fg-color: #1f4e79" in css and '[data-md-color-scheme="slate"]' in css and "--md-typeset-a-color" in css
          and "--md-admonition-icon--related" in css and ".md-typeset .admonition.related" in css
          and "--md-admonition-icon--docs" in css and ".md-typeset .admonition.docs" in css
          and ".md-typeset figcaption" in css and "tbody tr:nth-child(even)" in css
          and ".md-typeset .lrs-facts" in css and ".md-typeset .lrs-figures" in css
          and ".md-typeset .lrs-case dl {\n  display: grid;" in css and ".md-typeset .lrs-case .admonition.success" in css
          and ".md-typeset .lrs-case .lrs-group {" in css and ".md-typeset .lrs-case .lrs-steps {" in css, css[:300])
    # the Blocks composer's own rule: more slashes outside than inside
    blk = subprocess.run(["node", "--input-type=module", "-e",
        'import { block } from "./pipeline/lib/mdlayout.mjs";'
        'process.stdout.write(block("html", block("admonition", "Body.", { title: "T", options: { type: "success" } }), { title: "div.c", depth: 4 }));'],
        capture_output=True, text=True, cwd=REPO).stdout
    check("block() composes the Blocks form, nesting by slash count",
          blk == "//// html | div.c\n\n/// admonition | T\n    type: success\n\nBody.\n///\n////", repr(blk))
    # the model's own rules, through the module: natural order for the
    # catalogs, the issue host, a person's roles, a keyword's neighbours
    unit = subprocess.run(
        ["node", "--input-type=module", "-e", """
import { buildModel, issueHostOf, personRoles, coKeywords, pageStatus, NEW_DAYS } from "./pipeline/wiki.mjs";
const doc = (title, release, kw, extra = {}) => ({
  stem: title, content: "", kind: "Test Plan",
  meta: { title, keywords: kw, tools: [], products: [], target_release: release, author: "", pe: "", dev: "", ...extra },
});
const docs = [doc("B", "3.10", ["b", "a"]), doc("a", "3.8", ["a", "c"], { author: "P", pe: "P" }), doc("C", "3.9", ["a", "b"], { dev: "P" })];
const m = buildModel(docs, { canonical: new Map(), kinds: new Map() });
const out = {
  releases: [...m.releases.keys()], keywords: [...m.keywords.keys()],
  host: issueHostOf(new Map([["x", "not a url"], ["y", "https://devtopia.esri.com/Org/repo/issues/9"]])),
  none: issueHostOf(new Map()),
  roles: personRoles("P", docs), co: coKeywords("a", docs),
  status: [pageStatus("2026-08-01 10:00", Date.parse("2026-08-10T00:00:00Z")),
    pageStatus("2026-08-01 10:00", Date.parse("2026-08-01T10:00:00Z") + (NEW_DAYS + 1) * 86400000),
    pageStatus("2026-07-31T18:22:04Z", Date.parse("2026-08-14T00:00:00Z")),
    pageStatus("", Date.now()), pageStatus("not a date", Date.now())],
};
console.log(JSON.stringify(out));
"""], capture_output=True, text=True, cwd=REPO)
    u = json.loads(unit.stdout.strip() or "{}") if unit.returncode == 0 else {}
    check("catalog keys sort naturally and case-insensitively; issue host, roles, co-keywords and the new-badge rule",
          u.get("releases") == ["3.8", "3.9", "3.10"] and u.get("keywords") == ["a", "b", "c"]
          and u.get("host") == "https://devtopia.esri.com" and u.get("none") == ""
          and u.get("roles") == "author of 1 · PE of 1 · developer of 1"
          and u.get("co") == [{"value": "b", "n": 2}, {"value": "c", "n": 1}]
          and u.get("status") == ["new", "", "new", "", ""],
          unit.stderr[-400:] or unit.stdout[-400:])
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
