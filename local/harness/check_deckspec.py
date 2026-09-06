"""Gate for the review-deck modules (local/lib/designsystem.mjs v1.2 +
local/lib/deckspec.mjs v1.1) — fixture-free, no python-pptx: Node runs
the pure modules over an in-memory draft and the checks read the JSON
back.

  1. design system: the Fluent 2 tokens carried verbatim (type ramp,
     spacing, radii, strokes), the presentation scale applied once, the
     12-column grid summing to the content width, bands inside the
     canvas, every tone resolving to a fg/bg pair
  2. prompt <-> catalog agreement: every line describeCatalog() emits
     appears verbatim in prompts/TestPlanDeck_Prompt.md, as do the
     COUNTS names and the character caps (the "Python authority first"
     precedent, inverted: the module is the authority, the prompt
     mirrors it)
  3. parseDeckReply fails closed: missing / misordered sentinels,
     invalid JSON, no slides array, more than 60 slides
  4. deckCorpus: the deterministic counts, story + generated figures,
     the draft flag, the normalization
  5. verifyDeckSpec: grounded literals pass, an invented sentence
     drops ITS slide only, `from` references resolve (steps with
     checkboxes, expected, trace, alert, note, table, cases), count
     tiles, free titles / labels / asks / headlines, caps, unknown
     pattern / key / region / tone / count / figure, required regions
  6. layoutDeck: every element inside the canvas on every pattern,
     header x on grid column 0, region spans on grid columns,
     pagination (checklist, two-column, table), page numbers, grounds
  7. designs (v1.1): fluent / carbon / uswds each expose the same shape
     (twelve type roles, eight spacing roles in order, grid summing to
     the content width, ordered bands, hex colour roles with a named
     source token); Carbon's tokens verbatim (spacing-01 … 13, the
     productive ramp, square corners, IBM Plex Sans), USWDS's (8 px
     units, the size / line-height tokens, Public Sans); the same spec
     lays out inside the canvas with the same page count on every
     design; designOf refuses an unknown name
  8. themes + figures (v1.2): every design has a dark theme with the
     same colour roles (dark surface, light text, the divider on the
     deep brand surface, status tints derived 25 % over the layer and
     named as derived); Carbon dark = the Gray 100 theme verbatim; a
     dark layout stays inside the canvas; restyleFigureSvg is the
     identity on fluent / light and maps every palette hex (ink, teal,
     the tints, the event strokes, the marker fills) and the font on
     any other design + theme, never re-mapping a mapped value;
     unknown theme refused

Usage: python3 check_deckspec.py
"""
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
DS = os.path.join(REPO, "local", "lib", "designsystem.mjs")
SPEC = os.path.join(REPO, "local", "lib", "deckspec.mjs")
PROMPT = os.path.join(REPO, "prompts", "TestPlanDeck_Prompt.md")

PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(f"  {'ok  ' if cond else 'FAIL'} {name}" + ("" if cond else f"  <- {str(detail)[:300]}"))


DRAFT = """<!-- machine-generated test-plan draft — TestPlanGen prompt v1.12 · local/testplangen.mjs v1.16 · provider anthropic -->
> [!WARNING]
> **DRAFT — machine-generated, unreviewed.** Generated 2026-09-05T00:00:00Z from user story doc 12 — "Route Merge". Source sidecar: <https://example/sc.md>
> Review every case and resolve all [VERIFY] items before use.

<!-- verify: 1 finding(s) -->
> [!IMPORTANT]
> Draft verifier: 1 finding(s) — review these first:
> - TC-N1 carries a **Trace:** line

# Test Plan — Route Merge

## Overview

| Surface | Target release | PE |
| --- | --- | --- |
| Pro | 3.8 | Claire Wang |

Verifies measure-preserving merge of two routes in ArcGIS Pro.

## Setup / Prerequisites
- [ ] 1. LRS network with two mergeable routes. [VERIFY: minimum network configuration]
- [x] 2. Two Pro sessions signed in.

## Positive Tests

### TC-P1 — Merge preserves measures
**Steps:**
- [ ] 1. Run Merge Routes on route R1 and route R2.
- [ ] 2. Inspect the measures on the merged route R1.

**Expected Result:** The merged route keeps the source measures unchanged.

**Trace:** "the merge must preserve measures" — story requirement.

**Figure:** ![Routes R1 and R2 before the merge](https://mock.example/sites/x/media/doc12_slide2_fig1.svg)

### TC-P2 — Merge produces one route
**Steps:**
- [ ] 1. Run Merge Routes on route R1 and route R2.

**Expected Result:** One route remains.

**Trace:** "one route remains" — story requirement.

## Negative Tests

> [!CAUTION]
> A pass below is the described denial or error — never the edit succeeding.

### TC-N1 — Merge denied on locked route
**Steps:**
- [ ] 1. As User A, lock route R1.
- [ ] 2. As User B, attempt Merge Routes on route R1.

**Expected Result:** The merge is denied with a lock conflict.

**Trace:** exemplar pattern — multi-user denial case.

## Open Questions
- [ ] [VERIFY: minimum network configuration for setup]

## Coverage Map

| # | Requirement (source) | Covered by |
| --- | --- | --- |
| 1 | "the merge must preserve measures" (requirement) | TC-P1 |
| 2 | denial on locked routes (conflict statement) | TC-N1 |

## Issue Trace

_Deterministic addendum — minted by local/testplangen.mjs from the Doc IDs and Issue Refs lists._

| Issue | Title (Issue Refs) | Schedule status | Found via |
| --- | --- | --- | --- |
| ArcGISPro/ps-location-referencing#4855 | Route merge epic | Iteration 2 · Dev=Completed | sidecar |

## Generated Figures

_Deterministic addendum — figures PROPOSED by the TestPlanFigures prompt v0.1._

### TC-N1 — Merge denied on locked route

![User A locks R1; User B's merge is denied](<draft--fig-tc-n1.svg>)

_User A locks R1; User B's merge is denied_ (rule R5)
"""


# a minimal figure in the Diagram Style Framework palette (leg 8)
FIG_MINI = ("<svg><style>.route{stroke:#16302F}.f-cool{fill:#1B6E8C}.t-cool{fill:#E5F0F5}"
            ".event.s-cool{stroke:#4FA7D5}text{font-family:'Segoe UI',Arial}</style>"
            '<defs><path fill="#16302f"/></defs><rect fill="#FFFFFF"/></svg>')


def node(script):
    res = subprocess.run(["node", "--input-type=module", "-e", script],
                         capture_output=True, text=True, cwd=REPO)
    if res.returncode != 0:
        raise RuntimeError("node failed: " + res.stderr[-2000:])
    return json.loads(res.stdout.strip().splitlines()[-1])


def main():
    # ---- 1. design system --------------------------------------------
    print("== design system")
    d = node(f"""
import * as D from {json.dumps("file://" + DS)};
const o = {{
  fluent: D.FLUENT, scale: D.PRESENTATION_SCALE, type: D.TYPE, space: D.SPACE, radius: D.RADIUS, stroke: D.STROKE,
  grid: {{cols: D.GRID.cols, margin: D.GRID.margin, gutter: D.GRID.gutter, contentW: D.GRID.contentW,
          x: [...Array(12).keys()].map(D.GRID.x), span12: D.GRID.span(12), span6: D.GRID.span(6), span7: D.GRID.span(7), span5: D.GRID.span(5), x7: D.GRID.x(7)}},
  bands: D.BANDS, slide: [D.SLIDE_W, D.SLIDE_H], tones: D.TONES, toneColor: D.TONE_COLOR,
  patterns: D.PATTERN_NAMES, catalog: D.describeCatalog(), limits: D.LIMITS, emuPx: D.EMU_PER_PX,
}};
console.log(JSON.stringify(o));
""")
    ft = d["fluent"]["type"]
    check("Fluent 2 type ramp verbatim (caption1 12/16, body1 14/20, title1 32/40, largeTitle 40/52, display 68/92)",
          ft["caption1"][:2] == [12, 16] and ft["body1"][:2] == [14, 20] and ft["title1"][:2] == [32, 40]
          and ft["largeTitle"][:2] == [40, 52] and ft["display"][:2] == [68, 92]
          and ft["subtitle1"][2] == 600 and ft["body1"][2] == 400, ft)
    sp = d["fluent"]["spacing"]
    check("Fluent 2 spacing ramp verbatim (xxs 2 … xxxl 32)",
          [sp[k] for k in ("xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl")] == [2, 4, 8, 12, 16, 20, 24, 32], sp)
    check("radii + strokes verbatim", d["fluent"]["borderRadius"]["large"] == 6
          and d["fluent"]["borderRadius"]["circular"] == 10000 and d["fluent"]["strokeWidth"]["thick"] == 2, "")
    check("presentation scale 1.5 applied once: title (title1) = 36 pt / 45 pt line, body (body1) = 15.75 pt",
          d["scale"] == 1.5 and d["type"]["title"]["sz"] == 36 and d["type"]["title"]["line"] == 45
          and d["type"]["body"]["sz"] == 15.75 and d["type"]["title"]["bold"] and not d["type"]["body"]["bold"]
          and d["type"]["title"]["token"] == "title1" and d["type"]["label"]["token"] == "caption1Strong", d["type"]["title"])
    check("spacing tokens in EMU (l = 16 px × 1.5 × 9525)", d["space"]["l"] == round(16 * 1.5 * 9525), d["space"]["l"])
    g = d["grid"]
    check("12-column grid: margin = xxxl, gutter = xxl, span(12) = content width, x(0) = margin",
          g["cols"] == 12 and g["margin"] == d["space"]["xxxl"] and g["gutter"] == d["space"]["xxl"]
          and abs(g["span12"] - g["contentW"]) <= 1 and g["x"][0] == g["margin"], g)
    check("spans compose: x(7) = x(0) + span(7) + gutter; span(6)+gutter+span(6) = content",
          abs(g["x7"] - (g["x"][0] + g["span7"] + g["gutter"])) <= 1
          and abs(2 * g["span6"] + g["gutter"] - g["contentW"]) <= 1, g)
    check("canvas is 1280 × 720 px (16:9) and x(11) + col fits inside it",
          d["slide"] == [12192000, 6858000] and g["x"][11] < d["slide"][0] - g["margin"], d["slide"])
    b = d["bands"]
    check("bands: top < bodyTop < bodyBottom < footerTop < slide height",
          b["top"] < b["bodyTop"] < b["bodyBottom"] < b["footerTop"] < d["slide"][1], b)
    check("five tones, each with fg + bg", d["tones"] == ["neutral", "brand", "success", "warning", "danger"]
          and all(set(d["toneColor"][t]) == {"fg", "bg"} for t in d["tones"]), d["toneColor"])
    check("thirteen patterns", len(d["patterns"]) == 13 and "two-column" in d["patterns"] and "flow" in d["patterns"], d["patterns"])

    # ---- 2. prompt <-> catalog ---------------------------------------
    print("== prompt agreement")
    prompt = open(PROMPT, encoding="utf-8").read()
    body = prompt.split("---------------- PROMPT TEXT BEGINS ----------------", 1)[1]
    missing = [ln for ln in d["catalog"].splitlines() if ln not in body]
    check("every catalog line appears verbatim in the prompt", not missing, missing[:2])
    caps = d["limits"]
    check("character caps in the prompt match LIMITS",
          f"title {caps['title']}" in body and f"item {caps['item']}" in body and f"label {caps['label']}" in body
          and f"card body {caps['cardBody']}" in body and f"callout body {caps['callout']}" in body
          and f"notes {caps['notes']}" in body and f"lede / statement {caps['lede']}" in body, caps)
    for p in d["patterns"]:
        if f"\n  {p}:" not in body and f"\n  {p}: " not in body and f"  {p}:" not in body:
            check(f"pattern {p} has a regions line in the prompt", False, "")
            break
    else:
        check("every pattern has a regions line in the prompt", True)
    check("the {PlanTitle} / {Draft} / {Figures} inputs and the DECK sentinels are in the prompt",
          "{PlanTitle}" in body and "{Draft}" in body and "{Figures}" in body
          and "[[[DECK BEGIN]]]" in body and "[[[DECK END]]]" in body, "")

    # ---- 3–6: the spec module ----------------------------------------
    print("== deckspec")
    big = {"plan": "x", "slides": [{"pattern": "bullets", "title": "t", "regions": {"items": ["One route remains."]}}] * 61}
    good_spec = {
        "plan": "Test Plan — Route Merge",
        "slides": [
            {"pattern": "title", "regions": {"headline": "Route Merge", "facts": [{"label": "Surface", "value": "Pro"}, {"label": "PE", "value": "Claire Wang"}]}, "notes": "Open here."},
            {"pattern": "stats", "title": "At a glance", "regions": {
                "tiles": [{"count": "positive-cases", "label": "Positive cases", "tone": "success"},
                          {"count": "negative-cases", "label": "Negative cases", "tone": "danger"},
                          {"count": "verify-flags", "label": "Open flags", "tone": "warning"}],
                "lede": {"from": {"overview": "prose"}},
                "callout": {"label": "Draft verifier", "body": {"from": {"overview": "verify"}}, "tone": "warning"}}},
            {"pattern": "checklist", "title": "Setup", "regions": {"items": {"from": {"section": "Setup / Prerequisites"}}}},
            {"pattern": "section", "tone": "success", "regions": {"number": "01", "headline": "Positive Tests", "strap": "two cases"}},
            {"pattern": "two-column", "title": "Merge preserves measures", "source": "TC-P1", "tone": "success", "regions": {
                "left": {"from": {"case": "TC-P1", "field": "steps"}},
                "right": [{"label": "Expected", "body": {"from": {"case": "TC-P1", "field": "expected"}}, "tone": "success"},
                          {"label": "Trace", "body": {"from": {"case": "TC-P1", "field": "trace"}}, "tone": "brand"}]}},
            {"pattern": "figure", "title": "Before the merge", "source": "TC-P1", "regions": {"figure": "doc12_slide2_fig1.svg", "aside": ["Run Merge Routes on route R1 and route R2."]}},
            {"pattern": "figure", "title": "Denied", "source": "TC-N1", "regions": {"figure": "draft--fig-tc-n1.svg"}},
            {"pattern": "flow", "title": "Lock, then merge", "source": "TC-N1", "regions": {
                "steps": ["As User A, lock route R1.", "As User B, attempt Merge Routes on route R1.", "The merge is denied with a lock conflict."],
                "outcome": {"label": "Expected", "body": {"from": {"case": "TC-N1", "field": "expected"}}, "tone": "danger"}}},
            {"pattern": "section", "tone": "danger", "regions": {"headline": "Negative Tests", "callout": {"label": "Caution", "body": {"from": {"section": "Negative Tests", "field": "alert"}}}}},
            {"pattern": "comparison", "title": "Unlocked vs locked", "regions": {
                "left": {"label": "TC-P1", "tone": "success", "items": ["The merged route keeps the source measures unchanged."]},
                "right": {"label": "TC-N1", "tone": "danger", "items": ["The merge is denied with a lock conflict."]}}},
            {"pattern": "statement", "regions": {"statement": "the merge must preserve measures", "attribution": "story requirement"}},
            {"pattern": "cards", "title": "Both cases", "regions": {"cards": [
                {"label": "P1", "body": "One route remains."}, {"label": "N1", "body": "The merge is denied with a lock conflict.", "tone": "danger"}]}},
            {"pattern": "table", "title": "Coverage Map", "tone": "brand", "regions": {"table": {"from": {"section": "Coverage Map"}}}},
            {"pattern": "table", "title": "Issue Trace", "regions": {"table": {"from": {"section": "Issue Trace", "columns": [0, 1]}}, "note": {"from": {"section": "Issue Trace", "field": "note"}}}},
            {"pattern": "bullets", "title": "Cases", "regions": {"items": {"from": {"section": "Positive Tests", "field": "cases"}}, "lede": "Verifies measure-preserving merge of two routes in ArcGIS Pro."}},
            {"pattern": "closing", "regions": {"headline": "Before this becomes the plan", "asks": ["Review both cases", "Resolve the open flag"]}},
        ],
    }
    bad_spec = {"plan": "x", "slides": [
        {"pattern": "bullets", "title": "invented", "regions": {"items": ["This sentence is nowhere in the draft."]}},   # 1 invented
        {"pattern": "carousel", "title": "x", "regions": {}},                                                         # 2 unknown pattern
        {"pattern": "bullets", "title": "x", "regions": {"items": ["One route remains."]}, "colour": "red"},          # 3 unknown key
        {"pattern": "bullets", "title": "x", "regions": {"items": ["One route remains."], "hero": "x"}},              # 4 unknown region
        {"pattern": "bullets", "title": "x", "tone": "purple", "regions": {"items": ["One route remains."]}},         # 5 bad tone
        {"pattern": "stats", "title": "x", "regions": {"tiles": [{"count": "bugs", "label": "a"}, {"count": "cases", "label": "b"}]}},  # 6 bad count
        {"pattern": "figure", "title": "x", "regions": {"figure": "ghost.svg"}},                                       # 7 uncited figure
        {"pattern": "two-column", "title": "x", "regions": {"left": {"from": {"case": "TC-P7"}}, "right": [{"label": "a", "body": "One route remains."}]}},  # 8 unknown case
        {"pattern": "bullets", "title": "t" * 81, "regions": {"items": ["One route remains."]}},                     # 9 title cap
        {"pattern": "two-column", "title": "x", "regions": {"left": ["One route remains."]}},                       # 10 required region missing
        {"pattern": "stats", "title": "x", "regions": {"tiles": [{"value": "77", "label": "made-up"}, {"count": "cases", "label": "b"}]}},  # 11 literal value not in draft
        {"pattern": "bullets", "title": "quoted ok", "regions": {"items": ["“The merge must preserve measures” - story requirement"]}},  # 12 survives: quotes/dash normalized
        {"pattern": "cards", "title": "x", "regions": {"cards": [{"label": "only one", "body": "One route remains."}]}},  # 13 below min
        {"pattern": "bullets", "title": "x", "regions": {"items": [f"One route remains." for _ in range(8)]}},        # 14 over cap (bullets is a finding)
    ]}
    long_spec = {"plan": "x", "slides": [
        {"pattern": "checklist", "title": "Long", "regions": {"items": ["1. LRS network with two mergeable routes. [VERIFY: minimum network configuration]"] * 20}},
        {"pattern": "two-column", "title": "Long case", "regions": {"left": ["As User B, attempt Merge Routes on route R1."] * 18, "right": [{"label": "E", "body": "One route remains."}]}},
        {"pattern": "table", "title": "Long table", "regions": {"table": [["Issue", "Title (Issue Refs)"]] + [["Route merge epic", "sidecar"]] * 23}},
    ]}
    r = node(f"""
import * as S from {json.dumps("file://" + SPEC)};
import * as D from {json.dumps("file://" + DS)};
const draft = {json.dumps(DRAFT)};
const out = {{}};
const tryParse = (s) => {{ try {{ return {{ok: S.parseDeckReply(s).slides.length}}; }} catch (e) {{ return {{err: e.message}}; }} }};
out.parse = {{
  none: tryParse("hello"),
  misordered: tryParse("[[[DECK END]]] {{}} [[[DECK BEGIN]]]"),
  badJson: tryParse("[[[DECK BEGIN]]] {{slides: [}} [[[DECK END]]]"),
  noSlides: tryParse('[[[DECK BEGIN]]] {{"plan": "x"}} [[[DECK END]]]'),
  tooMany: tryParse("[[[DECK BEGIN]]]" + JSON.stringify({json.dumps(big)}) + "[[[DECK END]]]"),
  wrapped: tryParse("Sure.\\n[[[DECK BEGIN]]]\\n" + JSON.stringify({json.dumps(good_spec)}) + "\\n[[[DECK END]]]\\n"),
}};
const corpus = S.deckCorpus(draft);
out.corpus = {{ title: corpus.title, counts: corpus.counts, figures: corpus.figures, isDraft: corpus.isDraft,
  cases: [...corpus.cases.keys()], sections: [...corpus.sections.keys()], normHasNoStars: !corpus.norm.includes("**"),
  grounded: [S.grounded(corpus, "The merged route keeps the source measures unchanged."), S.grounded(corpus, "“the merge must preserve measures” - story"), S.grounded(corpus, "nope not here")] }};
const good = S.verifyDeckSpec({json.dumps(good_spec)}, corpus);
out.good = {{ n: good.slides.length, dropped: good.dropped, findings: good.findings,
  patterns: good.slides.map((s) => s.pattern),
  steps: good.slides[4].regions.left, right: good.slides[4].regions.right,
  tiles: good.slides[1].regions.tiles, lede: good.slides[1].regions.lede, callout: good.slides[1].regions.callout,
  setup: good.slides[2].regions.items, fig1: good.slides[5].regions.figure, fig2: good.slides[6].regions.figure,
  alert: good.slides[8].regions.callout, cov: good.slides[12].regions.table, iss: good.slides[13].regions.table, note: good.slides[13].regions.note,
  cases: good.slides[14].regions.items, asks: good.slides[15].regions.asks, closingTitle: good.slides[15].title, sectionTitle: good.slides[3].title,
  stmt: good.slides[10].regions.statement, notes: good.slides[0].notes }};
const bad = S.verifyDeckSpec({json.dumps(bad_spec)}, corpus);
out.bad = {{ n: bad.slides.length, dropped: bad.dropped.map((d) => [d.index + 1, d.findings[0]]), kept: bad.slides.map((s) => s.title) }};
const L = S.layoutDeck(good.slides, corpus);
out.layout = {{ pages: L.slides.map((p) => ({{ page: p.page, pattern: p.pattern, ground: p.ground, n: p.elements.length, inside: S.withinCanvas(p),
  kinds: [...new Set(p.elements.map((e) => e.kind))], firstText: p.elements.find((e) => e.kind === "text"),
  xs: [...new Set(p.elements.map((e) => e.x))].sort((a, b) => a - b) }})), warnings: L.warnings }};
const LL = S.layoutDeck(S.verifyDeckSpec({json.dumps(long_spec)}, corpus).slides, corpus);
out.long = {{ pages: LL.slides.map((p) => [p.page, p.pattern, p.cont, S.withinCanvas(p), (p.elements.find((e) => e.kind === "table") || {{rows: []}}).rows.length]), warnings: LL.warnings }};
out.grid = {{ x0: D.GRID.x(0), x7: D.GRID.x(7), x6: D.GRID.x(6), x8: D.GRID.x(8), bodyTop: D.BANDS.bodyTop, top: D.BANDS.top }};
console.log(JSON.stringify(out));
""")
    p = r["parse"]
    check("no sentinels → throws", "err" in p["none"] and "sentinels" in p["none"]["err"], p["none"])
    check("misordered sentinels → throws", "err" in p["misordered"], p["misordered"])
    check("invalid JSON → throws", "err" in p["badJson"] and "valid JSON" in p["badJson"]["err"], p["badJson"])
    check("no slides array → throws", "err" in p["noSlides"], p["noSlides"])
    check("61 slides → throws (cap 60)", "err" in p["tooMany"] and "cap is 60" in p["tooMany"]["err"], p["tooMany"])
    check("chatter around the sentinels is sliced off", p["wrapped"].get("ok") == 16, p["wrapped"])

    c = r["corpus"]
    check("corpus: title, cases, sections", c["title"] == "Test Plan — Route Merge" and c["cases"] == ["TC-P1", "TC-P2", "TC-N1"]
          and "Coverage Map" in c["sections"] and "Generated Figures" in c["sections"], c)
    check("corpus: deterministic counts", c["counts"] == {"cases": 3, "positive-cases": 2, "negative-cases": 1, "verify-flags": 2,
          "coverage-rows": 2, "open-questions": 1, "setup-items": 2, "figures": 2, "issues": 1}, c["counts"])
    check("corpus: story + generated figures by file name, with their case",
          [(f["id"], f["kind"], f["case"]) for f in c["figures"]] == [("doc12_slide2_fig1.svg", "story", "TC-P1"), ("draft--fig-tc-n1.svg", "generated", "TC-N1")], c["figures"])
    check("corpus: draft flag + normalization strips emphasis; grounding tolerates quotes/dashes",
          c["isDraft"] and c["normHasNoStars"] and c["grounded"] == [True, True, False], c["grounded"])

    g = r["good"]
    check("good spec: all 16 slides survive", g["n"] == 16 and not g["dropped"] and not g["findings"], g["dropped"])
    check("from case steps → checklist items with numbering + boxes",
          g["steps"] == [{"text": "1. Run Merge Routes on route R1 and route R2.", "checked": False},
                         {"text": "2. Inspect the measures on the merged route R1.", "checked": False}], g["steps"])
    check("from case expected / trace → card bodies; labels + tones kept",
          g["right"][0]["body"] == "The merged route keeps the source measures unchanged." and g["right"][0]["tone"] == "success"
          and g["right"][1]["body"].startswith('"the merge must preserve measures"') and g["right"][1]["label"] == "Trace", g["right"])
    check("count tiles resolve to the deterministic counters",
          [t["value"] for t in g["tiles"]] == ["2", "1", "2"] and g["tiles"][0]["tone"] == "success", g["tiles"])
    check("overview prose + verify block pulled",
          g["lede"].startswith("Verifies measure-preserving") and "TC-N1 carries a" in g["callout"]["body"], g["callout"])
    check("setup items pulled with checked state", g["setup"][1] == {"text": "2. Two Pro sessions signed in.", "checked": True}, g["setup"])
    check("figures resolve to the cited story / generated files",
          g["fig1"]["kind"] == "story" and g["fig1"]["id"] == "doc12_slide2_fig1.svg" and g["fig2"]["kind"] == "generated", (g["fig1"], g["fig2"]))
    check("section alert pulled as the callout", g["alert"]["body"].startswith("A pass below is the described denial"), g["alert"])
    check("tables pulled: Coverage Map rows, Issue Trace column subset, italic note",
          g["cov"][0] == ["#", "Requirement (source)", "Covered by"] and len(g["cov"]) == 3
          and g["iss"][1] == ["ArcGISPro/ps-location-referencing#4855", "Route merge epic"]
          and g["note"].startswith("Deterministic addendum"), (g["cov"], g["iss"]))
    check("section cases → items; closing asks + headlines free; statement grounded; notes kept",
          [i["text"] for i in g["cases"]] == ["TC-P1 — Merge preserves measures", "TC-P2 — Merge produces one route"]
          and g["asks"][0]["text"] == "Review both cases" and g["closingTitle"] == "Before this becomes the plan"
          and g["sectionTitle"] == "Positive Tests" and g["stmt"] == "the merge must preserve measures" and g["notes"] == "Open here.", g)

    b = r["bad"]
    dropped = dict(b["dropped"])
    check("bad spec: 13 of 14 dropped, the quoted/dashed literal and nothing else kept",
          b["n"] == 1 and b["kept"] == ["quoted ok"] and 12 not in dropped, (b["n"], b["kept"], sorted(dropped)))
    exp = {1: "is not in the draft", 2: "unknown pattern", 3: 'unknown key "colour"', 4: 'no region "hero"', 5: 'tone "purple"',
           6: 'count "bugs"', 7: "not one the draft cites", 8: "case TC-P7 is not in the draft", 9: "(cap 80)",
           10: 'region "right" is required', 11: "is not in the draft", 13: "the minimum is 2", 14: "(cap 7)"}
    for i, needle in exp.items():
        check(f"bad slide {i}: {needle}", needle in dropped.get(i, ""), dropped.get(i))

    L = r["layout"]
    check("layout: 16 pages numbered 1..16", [p["page"] for p in L["pages"]] == list(range(1, 17)), [p["page"] for p in L["pages"]])
    check("layout: every element inside the canvas on every pattern", all(p["inside"] for p in L["pages"]), [p["pattern"] for p in L["pages"] if not p["inside"]])
    check("layout: grounds — title/section/closing inverted, the rest paper",
          all((p["ground"] == "inverted") == (p["pattern"] in ("title", "section", "closing")) for p in L["pages"]), "")
    grid = r["grid"]
    paper = [p for p in L["pages"] if p["ground"] == "paper" and p["pattern"] != "statement"]  # the statement has no title here
    check("layout: header text on paper slides starts at grid column 0, inside the header band",
          all(p["firstText"]["x"] == grid["x0"] and grid["top"] <= p["firstText"]["y"] < grid["bodyTop"] for p in paper), [p["firstText"] for p in paper][:2])
    two = next(p for p in L["pages"] if p["pattern"] == "two-column")
    check("layout: two-column right cards sit on grid column 7", grid["x7"] in two["xs"], two["xs"])
    comp = next(p for p in L["pages"] if p["pattern"] == "comparison")
    check("layout: comparison panels on columns 0 and 6", grid["x0"] in comp["xs"] and grid["x6"] in comp["xs"], comp["xs"])
    flow = next(p for p in L["pages"] if p["pattern"] == "flow")
    check("layout: flow = chevrons + numbered circles, outcome card on column 8",
          "chevron" in flow["kinds"] and "circle" in flow["kinds"] and grid["x8"] in flow["xs"], (flow["kinds"], flow["xs"]))
    kinds = {p["pattern"]: p["kinds"] for p in L["pages"]}
    check("layout: pattern → element kinds (checkbox, table, figure, pill, bar, dot)",
          "checkbox" in kinds["checklist"] and "table" in kinds["table"] and "figure" in kinds["figure"]
          and "pill" in kinds["title"] and "bar" in kinds["statement"] and "dot" in kinds["comparison"], kinds)
    check("layout: no warnings on a spec inside the capacities", not L["warnings"], L["warnings"])

    lg = r["long"]
    pages = lg["pages"]
    check("pagination: 20 checklist items → continuation slides, all inside the canvas",
          sum(1 for p in pages if p[1] == "checklist") >= 2 and all(p[3] for p in pages), pages)
    check("pagination: two-column steps continue with '(n of m)'",
          any(p[1] == "two-column" and "(2 of" in p[2] for p in pages), pages)
    tables = [p for p in pages if p[1] == "table"]
    check("pagination: 23 table rows → 3 slides of ≤ 10 body rows + header",
          len(tables) == 3 and [t[4] for t in tables] == [11, 11, 4], tables)
    check("pagination is reported as a warning", any("paginate" in w for w in lg["warnings"]), lg["warnings"])

    # ---- 7. designs ----------------------------------------------------
    print("== designs")
    r = node(f"""
import * as S from {json.dumps("file://" + SPEC)};
import * as D from {json.dumps("file://" + DS)};
const draft = {json.dumps(DRAFT)};
const corpus = S.deckCorpus(draft);
const good = S.verifyDeckSpec({json.dumps(good_spec)}, corpus);
const out = {{ names: D.DESIGN_NAMES, def: D.DEFAULT_DESIGN, designs: {{}}, describe: D.describeDesigns() }};
for (const k of D.DESIGN_NAMES) {{
  const d = D.DESIGNS[k];
  const L = S.layoutDeck(good.slides, corpus, d);
  out.designs[k] = {{
    name: d.name, license: d.license, font: d.font, type: d.TYPE, space: d.SPACE, radius: d.RADIUS, color: d.COLOR, src: d.COLOR_SOURCE,
    grid: {{ cols: d.GRID.cols, margin: d.GRID.margin, gutter: d.GRID.gutter, contentW: d.GRID.contentW, span12: d.GRID.span(12), mt: d.GRID.marginToken, gt: d.GRID.gutterToken }},
    bands: d.BANDS, tones: Object.keys(d.TONE_COLOR), tokens: {{ spacing: d.tokens.spacing, type: d.tokens.type }},
    pages: L.slides.length, inside: L.slides.every(S.withinCanvas), layoutDesign: L.design,
  }};
}}
try {{ D.designOf("bogus"); out.bogus = "no throw"; }} catch (e) {{ out.bogus = e.message; }}
try {{ D.designOf("carbon", "dusk"); out.badTheme = "no throw"; }} catch (e) {{ out.badTheme = e.message; }}
out.byName = S.layoutDeck(good.slides, corpus, "carbon").design;
// themes + figure restyle
out.dark = {{}};
for (const k of D.DESIGN_NAMES) {{
  const d = D.designOf(k, "dark");
  const L = S.layoutDeck(good.slides, corpus, d);
  out.dark[k] = {{ name: d.name, theme: d.theme, color: d.COLOR, src: d.COLOR_SOURCE, pages: L.slides.length, inside: L.slides.every(S.withinCanvas),
    sameType: JSON.stringify(d.TYPE) === JSON.stringify(D.designOf(k, "light").TYPE) }};
}}
const fig = {json.dumps(FIG_MINI)};
out.restyle = {{
  identity: D.restyleFigureSvg(fig, D.designOf("fluent", "light")) === fig,
  carbonDark: D.restyleFigureSvg(fig, D.designOf("carbon", "dark")),
  carbonLight: D.restyleFigureSvg(fig, "carbon"),
  mapLen: D.designOf("carbon").figureMap.length, fluentMapLen: D.designOf("fluent").figureMap.length,
  mix: D.mix("000000", "FFFFFF", 0.5),
}};
console.log(JSON.stringify(out));
""")
    check("three designs, fluent the default", r["names"] == ["fluent", "carbon", "uswds"] and r["def"] == "fluent", r["names"])
    roles = ["display", "hero", "title", "title2", "subtitle", "subtitle2", "body2", "body", "bodyStrong", "label", "caption", "caption2"]
    spaces = ["xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl"]
    for k, dd in r["designs"].items():
        ty = dd["type"]
        check(f"{k}: twelve type roles, each a named token with line ≥ size, hierarchy display ≥ hero ≥ title ≥ body ≥ caption",
              all(ro in ty and ty[ro]["token"] and ty[ro]["line"] >= ty[ro]["sz"] for ro in roles)
              and ty["display"]["sz"] >= ty["hero"]["sz"] >= ty["title"]["sz"] >= ty["body"]["sz"] >= ty["caption"]["sz"], ty)
        sp = dd["space"]
        check(f"{k}: eight spacing roles, non-decreasing", all(ro in sp for ro in spaces)
              and all(sp[a] <= sp[b] for a, b in zip(spaces, spaces[1:])), sp)
        g = dd["grid"]
        check(f"{k}: 12-column grid from named spacing tokens, spans summing to the content width",
              g["cols"] == 12 and abs(g["span12"] - g["contentW"]) <= 1 and g["mt"] in dd["tokens"]["spacing"] and g["gt"] in dd["tokens"]["spacing"], g)
        b = dd["bands"]
        check(f"{k}: bands ordered inside the canvas", b["top"] < b["bodyTop"] < b["bodyBottom"] < b["footerTop"] < 6858000, b)
        check(f"{k}: nineteen colour roles as hex with a named source token",
              len(dd["color"]) == 19 and all(re.fullmatch(r"[0-9A-F]{6}", v) for v in dd["color"].values())
              and all(dd["src"][ro] for ro in dd["color"]) and dd["tones"] == ["neutral", "brand", "success", "warning", "danger"], dd["color"])
        check(f"{k}: the same spec lays out to the same 16 pages, every element inside the canvas, design recorded",
              dd["pages"] == 16 and dd["inside"] and dd["layoutDesign"] == k, (dd["pages"], dd["inside"], dd["layoutDesign"]))
    cb = r["designs"]["carbon"]
    check("carbon: spacing scale verbatim (spacing-01 2 … spacing-07 32 … spacing-13 160), gutter = spacing-07 (the 2x Grid's 32 px)",
          [cb["tokens"]["spacing"][f"spacing-{i:02d}"] for i in range(1, 14)] == [2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160]
          and cb["grid"]["gt"] == "spacing-07" and cb["grid"]["gutter"] == round(32 * 1.5 * 9525), cb["grid"])
    check("carbon: productive ramp verbatim (body-01 14/20, heading-03 20/28, heading-05 32/40 regular, heading-07 54/64 light) → title 36 pt not bold",
          cb["tokens"]["type"]["body-01"] == [14, 20, 400] and cb["tokens"]["type"]["heading-03"] == [20, 28, 400]
          and cb["tokens"]["type"]["heading-05"] == [32, 40, 400] and cb["tokens"]["type"]["heading-07"] == [54, 64, 300]
          and cb["type"]["title"]["sz"] == 36 and not cb["type"]["title"]["bold"] and cb["type"]["title"]["token"] == "heading-05", cb["type"]["title"])
    check("carbon: square surfaces (radius large = 0), round tags only; IBM Plex Sans; Gray 100 inverse; Blue 60 brand",
          cb["radius"]["large"] == 0 and cb["radius"]["circular"] > 0 and cb["font"] == "IBM Plex Sans"
          and cb["color"]["backgroundInverse"] == "161616" and cb["color"]["brand"] == "0F62FE" and cb["color"]["textPrimary"] == "161616", cb["color"])
    us = r["designs"]["uswds"]
    check("uswds: 8 px units (units-1 8, units-2 16, units-4 32, units-10 80), gutter = units-4 (column-gap-desktop)",
          us["tokens"]["spacing"]["units-1"] == 8 and us["tokens"]["spacing"]["units-2"] == 16 and us["tokens"]["spacing"]["units-4"] == 32
          and us["tokens"]["spacing"]["units-10"] == 80 and us["grid"]["gt"] == "units-4", us["grid"])
    check("uswds: size-13 (36 px) at line-height 2 for the title → 40.5 pt bold; size-3 (14 px) at line-height 4 for body; Public Sans; primary-darker inverse",
          us["type"]["title"]["sz"] == 40.5 and us["type"]["title"]["bold"] and us["type"]["body"]["px"] == 14 and us["type"]["body"]["line"] == 23.63
          and us["font"] == "Public Sans" and us["color"]["backgroundInverse"] == "162E51" and us["color"]["brand"] == "005EA2", us["type"])
    check("designOf refuses an unknown name; layoutDeck accepts a design by name",
          "unknown design" in r["bogus"] and "fluent, carbon, uswds" in r["bogus"] and r["byName"] == "carbon", (r["bogus"], r["byName"]))
    check("describeDesigns names all three with licence and font, and the themes",
          all(x in r["describe"] for x in ("fluent: Fluent 2 (MIT)", "carbon: IBM Carbon (Apache-2.0)", "uswds: U.S. Web Design System", "Public Sans", "themes: light | dark")), r["describe"])

    # ---- 8. themes + figures --------------------------------------------
    print("== themes + figures")
    check("unknown theme refused", "unknown theme" in r["badTheme"] and "light, dark" in r["badTheme"], r["badTheme"])
    for k, dd in r["dark"].items():
        c = dd["color"]
        def lum(h):
            return 0.299 * int(h[0:2], 16) + 0.587 * int(h[2:4], 16) + 0.114 * int(h[4:6], 16)
        check(f"{k} dark: same type ramp, dark surface under light text, divider on the deep brand surface, 16 pages inside the canvas",
              dd["theme"] == "dark" and dd["name"].endswith("(dark)") and dd["sameType"] and lum(c["background"]) < 80 and lum(c["textPrimary"]) > 200
              and lum(c["backgroundInverse"]) < 110 and c["backgroundInverse"] != c["background"] and dd["pages"] == 16 and dd["inside"], (dd["name"], c["background"], c["textPrimary"], c["backgroundInverse"]))
        check(f"{k} dark: status tints derived 25 % over the layer and named as derived",
              all(dd["src"][t].endswith("25 % over layer (derived)") for t in ("brandTint", "successTint", "warningTint", "dangerTint"))
              and all(lum(c[t]) < 120 for t in ("brandTint", "successTint", "warningTint", "dangerTint")), {t: (c[t], dd["src"][t]) for t in ("successTint",)})
    cd = r["dark"]["carbon"]["color"]
    check("carbon dark = the Gray 100 theme (background Gray 100, layer Gray 90, text Gray 10, interactive Blue 50, support-error Red 50)",
          cd["background"] == "161616" and cd["layer"] == "262626" and cd["textPrimary"] == "F4F4F4" and cd["brand"] == "4589FF" and cd["danger"] == "FA4D56", cd)
    rs = r["restyle"]
    check("restyleFigureSvg: identity on fluent / light (empty map); 24-entry map elsewhere; mix() blends",
          rs["identity"] and rs["fluentMapLen"] == 0 and rs["mapLen"] == 24 and rs["mix"] == "808080", (rs["identity"], rs["mapLen"], rs["mix"]))
    check("restyleFigureSvg on carbon dark: ink → Gray 10, teal → Blue 50, node tint + event stroke derived, marker fill (lower-case hex) + plate fill mapped, font → IBM Plex Sans",
          ".route{stroke:#F4F4F4}" in rs["carbonDark"] and ".f-cool{fill:#4589FF}" in rs["carbonDark"] and '<path fill="#F4F4F4"/>' in rs["carbonDark"]
          and '<rect fill="#161616"/>' in rs["carbonDark"] and "font-family:'IBM Plex Sans'" in rs["carbonDark"]
          and "#16302F" not in rs["carbonDark"].upper() and "#E5F0F5" not in rs["carbonDark"] and "#4FA7D5" not in rs["carbonDark"], rs["carbonDark"])
    check("restyleFigureSvg on carbon light: ink → Gray 100, teal → Blue 60, paper stays white, no value re-mapped twice",
          ".route{stroke:#161616}" in rs["carbonLight"] and ".f-cool{fill:#0F62FE}" in rs["carbonLight"] and '<rect fill="#FFFFFF"/>' in rs["carbonLight"]
          and '<path fill="#161616"/>' in rs["carbonLight"], rs["carbonLight"])

    print(f"\n{len(PASS)}/{len(PASS) + len(FAIL)} checks passed")
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
