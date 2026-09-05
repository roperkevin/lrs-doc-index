#!/usr/bin/env python3
"""Gate for local/lib/storyprofile.mjs — the story/v1 body profile
(Sidecar_Format_Plan phase 5):

  1. a template deck maps onto Story / Acceptance Criteria / Testing /
     Automation / Documentation / Assignment in canonical order, the
     title slide and untitled requirement slides placed by position,
     provenance comments kept
  2. a deck without canonical titles is left unchanged (shape none)
  3. an already-profiled body passes through
  4. storyTextFirst puts Story + Acceptance Criteria ahead of the rest
     and leaves non-profile text unchanged

Prereqs: Node 22+. Run from anywhere.
"""
import json
import os
import subprocess
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
failures = []


def check(name, cond, detail=""):
    print(("  ok   " if cond else "  FAIL ") + name + ("" if cond else f"  <- {detail}"))
    if not cond:
        failures.append(name)


def run(js):
    r = subprocess.run(
        ["node", "--input-type=module", "-e",
         "import * as S from './local/lib/storyprofile.mjs';\n" + js],
        capture_output=True, text=True, cwd=REPO,
    )
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-800:])
    return json.loads(r.stdout)


DECK = """## Slide 1 — Attribute Field method
User Story

## Slide 2 — User Story
As a LRS configurer, I want attribute-field measures.

## Slide 3 — Attribute Field method
Add a new value to the Calibration Method parameter.
- From Measure, To Measure

## Slide 4 — Story Points
3

## Slide 5 — Testing
Test on all route shapes.

## Slide 6 — Automation
Add to the existing automation.

## Slide 7 — Documentation
Update the existing documentation.

## Slide 8 — Appendix
Extra slide after testing.
"""

PLAIN = "## Slide 1\nBeta user story about locks\n\n## Slide 2 — Scope\n- a\n"


def main():
    print("== story/v1 mapping")
    r = run("const r = S.renderStoryBody(" + json.dumps(DECK) + "); console.log(JSON.stringify(r))")
    body = r["body"]
    secs = [l[3:] for l in body.split("\n") if l.startswith("## ")]
    check("shape story", r["shape"] == "story", r["shape"])
    check("sections in canonical order",
          secs == ["Story", "Acceptance Criteria", "Testing", "Automation", "Documentation", "Assignment", "Other content"], str(secs))
    check("title slide + User Story slide under Story with provenance",
          "### Attribute Field method <!-- slide 1 -->" in body.split("## Acceptance Criteria")[0]
          and "### User Story <!-- slide 2 -->" in body.split("## Acceptance Criteria")[0], body[:400])
    check("untitled requirement slide before Testing lands in Acceptance Criteria",
          "### Attribute Field method <!-- slide 3 -->" in body.split("## Acceptance Criteria")[1].split("## Testing")[0], body)
    check("Story Points maps to Assignment with its slide comment",
          "## Assignment\n### Story Points <!-- slide 4 -->\n3" in body, body)
    check("a canonical slide carries only its slide comment",
          "## Testing\n<!-- slide 5 -->\nTest on all route shapes." in body, body)
    check("a slide after Testing that maps nowhere goes to Other content",
          "### Appendix <!-- slide 8 -->" in body.split("## Other content")[-1], body)

    print("== non-template decks")
    r2 = run("console.log(JSON.stringify(S.renderStoryBody(" + json.dumps(PLAIN) + ")))")
    check("no canonical titles: body unchanged, shape none", r2["shape"] == "none" and r2["body"] == PLAIN, str(r2))
    r3 = run("console.log(JSON.stringify(S.renderStoryBody(" + json.dumps(body) + ")))")
    check("already-profiled body passes through", r3["shape"] == "story" and r3["body"] == body, "")

    print("== TestPlanGen story text ordering")
    md = "# T\n\n| Field | Value |\n| --- | --- |\n\n## Summary\n\ns\n\n---\n\n" + body
    r4 = run("console.log(JSON.stringify(S.storyTextFirst(" + json.dumps(md) + ")))")
    check("header kept, Story then Acceptance Criteria first",
          r4.startswith("# T\n") and r4.index("## Story") < r4.index("## Acceptance Criteria") < r4.index("## Testing")
          and sorted(r4.split("\n")) == sorted(md.split("\n")), r4[:300])
    r5 = run("console.log(JSON.stringify(S.storyTextFirst(" + json.dumps(PLAIN) + ")))")
    check("non-profile text unchanged", r5 == PLAIN, r5)

    print()
    if failures:
        print(f"FAILED: {', '.join(failures)}")
        sys.exit(1)
    print("PASSED")


if __name__ == "__main__":
    main()
