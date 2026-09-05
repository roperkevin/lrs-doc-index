# Append Calibration Points to LRS tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Append Calibration Points to LRS tool.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Calibration%20Points%20to%20LRS%20tool.pptx>) |
| **Edited** | 2026-05-04 21:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Calibration Points to LRS tool"
source_file: "Append Calibration Points to LRS tool.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Append%20Calibration%20Points%20to%20LRS%20tool.pptx"
doc_id: 40
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2026-05-04T21:47:12Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["calibration points", "append", "batch processing", "error handling", "route recalibration", "field mapping"]
tools: ["Append Calibration Points"]
products: []
issues: []
related: [{"doc":22,"file":"append-calibration-points-to-lrs-tool-7203-test-plan__doc22.md","s":6.723},{"doc":662,"file":"generate-calibration-points-tool-feature-service-support-user-story__doc662.md","s":4.447},{"doc":143,"file":"support-optional-date-field-mapping-in-append-events-tool__doc143.md","s":4.414},{"doc":702,"file":"attribute-field-method-in-generate-calibration-points__doc702.md","s":3.932},{"doc":165,"file":"append-routes-partial-loading-support__doc165.md","s":3.927}]
```
-->

## Summary

User story for a new Append Calibration Points geoprocessing tool that enables bulk appending of calibration points into an existing LRS. The tool supports field mapping, batch loading to prevent failure, suspends calibration listener during load, and recalibrates affected routes after completion. It includes error handling for invalid data and aims to improve performance and validation feedback over current workflows.

## Related documents

<!-- related:begin -->
- [Append Calibration Points To LRS Tool 7203 Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-calibration-points-to-lrs-tool-7203-test-plan__doc22.md>) — similar text 0.31 · 4 title words · 4 filename words · same surface <!-- rel:22 -->
- [Generate Calibration Points Tool Feature Service Support User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-calibration-points-tool-feature-service-support-user-story__doc662.md>) — similar text 0.15 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:662 -->
- [Support Optional Date Field Mapping in Append Events Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-optional-date-field-mapping-in-append-events-tool__doc143.md>) — similar text 0.20 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:143 -->
- [Attribute Field Method in Generate Calibration Points](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/attribute-field-method-in-generate-calibration-points__doc702.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:702 -->
- [Append Routes Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-partial-loading-support__doc165.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:165 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Calibration Points](https://www.google.com/search?q=%22Append%20Calibration%20Points%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Append Calibration Points to LRS tool

User Story

## Slide 2 — User Story

As an LRS Data Loader, I need the ability to append existing calibration points in bulk, so that I can successfully load points, have quality checks applied, and calibration updated on impacted routes in an efficient manner.

Persona
LRS Data Loader is responsible for initial and subsequent loading of data.  This includes existing calibration points from previous systems, which pipeline users almost always want to migrate when adopting the software (and acquiring new pipeline operators and needing to load new data).
Data Loaders need to load external or legacy calibration point datasets into an existing LRS
Current workflows:
Route recalibration is trigger on every inserted CP
Append tool fails/time outs on large datasets
Append tool provides limited validation feedback (especially for non monotonic errors)
No scalable, batch-safe tool exists for appending calibration points

## Slide 3 — Append Calibration Points tool

Introduce a new Append Calibration Points geoprocessing tool that:

  - Appends calibration points into an existing LRS
  - Supports explicit field mapping
  - Suspends calibration listener during load
  - Loads records in batches to prevent failure
  - Recalibrates affected routes after completion
Geoprocessing parameters include:

  - Source Calibration Points (feature layer)
  - Target LRS Calibration Points (feature layer)
  - LRS Network
  - Field Mapping (excluding the NetworkID)
Acceptance Criteria

  - Valid calibration points are appended successfully
  - Calibration listener is suspended and resumed correctly
  - Large datasets load without timeout or failure
  - Routes are recalibrated using appended calibration points
  - Invalid records are skipped with actionable errors
  - Tool completes with partial success when needed
  - When complete, messages includes success and error counts and feature layer of CPs that failed to load is created

## Slide 4 — Error Handling

Provide error messaging for the following scenarios:

  - Null or invalid RouteID
  - Invalid measure value
  - From/To Dates outside route temporal range
  - Calibration Point not located on route (with routeID of the point)
  - Non-monotonic route scenarios introduced
Calibration points that can’t be loaded should be included in an output feature class for users to adjust/fix (follow the same pattern as in Append Routes)

## Slide 5 — Testing

Append valid calibration points
Mixed valid and invalid datasets
Large dataset performance testing
Missing RouteID
Invalid measures
Temporal misalignment
Off-route points
Model Builder
Python

## Slide 6 — Automation

Add GP tool automation coverage for:

  - Successful append workflows
  - Error handling scenarios
  - Batch processing behavior
Ensure no regression to existing calibration workflows

## Slide 7 — Documentation

Create new GP topic for tool
Add guidance for bulk calibration data migration in usage notes
Update existing topics around data loading to highlight this tool in place of the current appending calibration points workflow

## Slide 8 — Assignment

Story Points:
Dev:  days
PE:  days
