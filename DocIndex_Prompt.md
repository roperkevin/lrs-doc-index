# Doc Index Prompt — v1.0

AI Builder custom prompt. Create THREE text inputs with exactly these
names and insert them where marked: **FileName**, **DocText**,
**ExistingKeywords**.

Flow wiring notes (outside the prompt):
- DocText = the extraction lane's output, truncated to ~100,000 chars
  (same guard as the Sweep's BodyHtml).
- ExistingKeywords = distinct canonical Titles from the Keywords list,
  comma-joined, lowercase. On first runs this is empty — the PREFERRED
  KEYWORDS floor below carries it until the list populates.
- Parse the response defensively via a Compose (your Parse_prompt_output
  pattern) — assume JSON-as-text, never rely on structured output mode.
- Write PromptVersion = "v1.0" on the Doc Index row so re-runs can
  target stale rows when this prompt revs.
- docKind and surface are written to SharePoint CHOICE columns with no
  fill-in: if the model ever emits an off-list value despite the rules,
  coalesce to "Other" flow-side before the write.

---------------- PROMPT TEXT BEGINS ----------------

You are indexing an internal Esri Linear Referencing (LRS) team
document for a searchable catalog. Read the document text and return
ONLY a JSON object — no markdown fences, no commentary, no reasoning.

INPUTS
File name: {FileName}
Established keywords (prefer these before inventing):
{ExistingKeywords}
Document text:
{DocText}

OUTPUT — exactly this shape, every field always present:
{
  "title": "",
  "docKind": "",
  "surface": "",
  "summary": "",
  "pe": "",
  "dev": "",
  "targetRelease": "",
  "tools": [],
  "keywords": []
}

FIELD RULES

title
- The document's own title from its first slide or heading — NOT the
  file name. Max 255 characters. If no clear title exists, derive a
  short descriptive one from the content.

docKind — MUST be exactly one of:
  Test Plan | User Story | Design Spike | Data Template | Schedule | Doc Review | Other
- Test Plan: test cases, Positive/Negative sections, expected results,
  "Test Plan" in the title.
- User Story: "As a ..., I need ..." persona statements, I Need /
  Personas / Workflow sections.
- Design Spike: titled "Spike" or evaluating design options.
- Schedule: iteration/release planning rows — issue names with
  estimates, assignments, and status columns.
- Data Template: the document itself IS a reusable data/config
  template. A user story ABOUT creating templates is a User Story.
- Doc Review: documentation review/feedback documents.
- Anything else: Other. Never invent a new value.

surface — MUST be exactly one of:
  Pro | Experience Builder | Server | Enterprise | Other
- Experience Builder: ExB widgets (Straight Line Diagram, LRS Identify,
  Dynamic Segmentation).
- Server: ArcGIS Server toolboxes, REST endpoints/operations.
- Pro: geoprocessing tools, ribbon tools, Pro UI workflows.
- Enterprise: portal/enterprise deployment concerns.
- Pick the DOMINANT surface when several appear; Other only when none
  is identifiable.

summary
- 2–3 plain sentences: what the document covers and what it's for.
  No marketing tone, no "This document...", just the substance.

pe / dev
- Names from "PE:" and "Dev:" labels when present (first name listed if
  several). Empty string when absent. Never guess from context.

targetRelease
- The release the work TARGETS, only when explicitly stated (e.g.
  "3.8", "12.5", "3.8 / 12.2"). A data source's origin version
  ("data from 2.4") is NOT a target release. Empty when ambiguous.

tools
- 0–6 official tool/widget names actually named in the document, in
  official casing: e.g. "Merge Centerlines", "Retire Routes",
  "Update Measures From LRS", "Append Routes", "LRS Identify",
  "Straight Line Diagram". Full names only — never abbreviations,
  never tools merely implied.

keywords
- 3–8 entries. Lowercase, singular, 1–2 words, spaces not hyphens,
  no dates, no version numbers.
- The established keywords are a SPELLING reference, not a menu: when
  this document's own subject matter matches an established term, use
  the established spelling; NEVER assign an established term this
  document is not substantially about. Every keyword must be grounded
  in THIS document's content, and the document's primary subject must
  always appear as a keyword even if no established term covers it —
  invent it (domain-meaningful terms only). Example: a test plan for a
  line events widget must yield "line event" even if only "point event"
  is established, and must not receive "point event" merely because it
  exists in the list.
- Keywords must DISCRIMINATE within an all-LRS corpus. NEVER emit
  terms true of most documents — they carry zero linking signal:
  lrs, linear referencing, location referencing, testing, test plan,
  esri, arcgis, 508, i18n, accessibility, dark mode, light mode,
  documentation, notes.
- Good keywords name the specific subject: "events", "centerlines",
  "calibration points", "measures", "referents", "routes",
  "straight line diagram", "feature extraction", "geoprocessing",
  "rest api", "event editing", "vertex spacing".

ESRI TERMINOLOGY
- Official product casing: ArcGIS Pro, ArcGIS Server, Experience
  Builder, Roads and Highways, Pipeline Referencing.
- Domain terms: LRS Network, LRM, route, measure, referent,
  calibration point, centerline, event; measure behaviors: Stay Put,
  Move, Retire, Snap, Cover.
- "Location Referencing" and "Linear Referencing" refer to the same
  Pro capability (renamed at Pro 3.8) — treat as one subject.

JSON RULES
- Valid JSON only. Escape any internal double quotes and backslashes.
- Every field present; empty string or empty array when unknown.
- No trailing commas, no comments, no text before or after the object.

EXAMPLE (abbreviated input: a deck titled "Merge Centerlines" with
Notes, PE: Claire Wang, positive/negative GP test sections, route and
centerline data tables)
{
  "title": "Merge Centerlines",
  "docKind": "Test Plan",
  "surface": "Pro",
  "summary": "Test plan for the centerline merge operation added to LRS applyEdits and the Merge Centerlines tool on the Location Referencing ribbon. Covers positive and negative geoprocessing cases across route and centerline configurations.",
  "pe": "Claire Wang",
  "dev": "",
  "targetRelease": "",
  "tools": ["Merge Centerlines"],
  "keywords": ["centerlines", "merge", "routes", "geoprocessing", "editing"]
}

----------------- PROMPT TEXT ENDS -----------------
