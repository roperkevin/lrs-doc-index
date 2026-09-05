# Linear Referencing Attribution in Linear Feature Extraction

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Linear Referencing attribution to Linear Feature Extraction.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Linear%20Referencing%20attribution%20to%20Linear%20Feature%20Extraction.pptx>) |
| **Edited** | 2026-07-24 15:30 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Linear Referencing Attribution in Linear Feature Extraction"
source_file: "Linear Referencing attribution to Linear Feature Extraction.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Linear%20Referencing%20attribution%20to%20Linear%20Feature%20Extraction.pptx"
doc_id: 7
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-07-24T15:30:37Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["linear referencing attribution", "feature extraction", "route", "measure", "search tolerance", "calibration", "route selection", "gis analyst", "event editor"]
tools: ["Append Events", "Update Measures from LRS"]
products: []
issues: []
related: [{"doc":14,"file":"linear-referencing-attribution-in-feature-extraction__doc14.md","s":11.511},{"doc":42,"file":"linear-referencing-ribbon-unified-experience__doc42.md","s":3.471},{"doc":273,"file":"support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md","s":2.871},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":2.695},{"doc":266,"file":"support-events-spanning-routes-in-update-measures-from-lrs__doc266.md","s":2.691}]
```
-->

## Summary

Describes the integration of linear referencing route and measure attribution within the Feature Extraction experience in ArcGIS Pro. Covers user personas, workflow, acceptance criteria including tool integration, input requirements, route selection logic, tolerance and calibration handling, measure calculation, testing scenarios, automation, and documentation needs.

## Related documents

<!-- related:begin -->
- [Linear Referencing attribution in Feature Extraction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-attribution-in-feature-extraction__doc14.md>) — similar text 0.91 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:14 -->
- [Linear Referencing Ribbon – Unified Experience](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-ribbon-unified-experience__doc42.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:42 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md>) — similar text 0.14 · same kind/surface/folder <!-- rel:273 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.19 · same kind/folder <!-- rel:13 -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs__doc266.md>) — similar text 0.14 · same kind/surface/folder <!-- rel:266 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Linear Referencing attribution in Linear Feature Extraction

Add Linear Referencing route and measure attribution directly within the Feature Extraction experience in ArcGIS Pro

## Slide 2 — Linear Referencing attribution in Feature Extraction

User Story
As a GIS Analyst using Feature Extraction in ArcGIS Pro, I need the ability to assign LRS route and measure values to extracted features, so that extracted data can immediately be used in linear referencing workflows without additional preprocessing.
Personas
GIS Analyst (Feature Extraction User) – This user extracts and classifies features from imagery (roads, pipelines, assets). They require a streamlined workflow to convert extracted geometry into LRS-aware data without leaving the feature extraction experience.
LRS Analyst / Event Editor – This user validates and manages event data along routes. They rely on accurate route and measure attribution to perform QA/QC, reporting, and dynamic segmentation workflows.
Workflow
User runs Feature Extraction from video, identifies, reviews, and classifies features
User clicks “Add Linear Referencing” button in Feature Extraction ribbon
Tool opens a Pro UI
User selects:

  - LRS Network
  - Extracted Feature Class
  - Search Tolerance
Tool executes backend processing
The tool:

  - Identifies nearest route
  - Calculates measures
  - Writes fields to feature class (always new fields)
Tool returns summary messages
Optional: Tool loads records in LRS Event

## Slide 3 — Acceptance Criteria & Requirements

Tool Integration
Tool is exposed as a button in the Feature Extraction ribbon
Clicking the button opens a native ArcGIS Pro UI
Tool behaves as a standard GP-style execution (non-blocking UI)
Append Events tool should open with input event parameter populated if Load to LRS Event option is selected
Inputs
LRS Network (required)
Extracted Feature Class (required)
Search Tolerance (required)
Load to LRS Event (optional)
Overwrite Behavior
If RouteID / measure fields already exist values are overwritten
Output Fields
Route ID (matching LRS field type and length from LRS Network)
From Date (MM/DD/YYYY from the video that is linked in the input)
To Date (always null)
Lines:

  - From Measure (Double)
  - To Measure (Double)
  - FromMeasure = measure at first vertex
  - ToMeasure = measure at last vertex
  - Both measures must be calculated on the same route

## Slide 4 — Acceptance Criteria & Requirements

Route Selection Logic
Identify all routes within tolerance to match the acquisition date in the video that is populated in the From Date field
If one → use it
If multiple:

  - Choose closest route
  - If same distance → choose primary route (if rules are configured), if no rules are configured, choose first returned route
Tolerance Handling
If no routes within tolerance:

  - RouteID and measures = null
  - Provide user message
Calibration Handling
If route has no calibration:

  - RouteID and measures = null
  - Provide user message
Measure Calculation
Uses logic from Update Measures from LRS GP tool
Ensures consistency with existing workflows

## Slide 5 — Testing

Validate schema:

  - RouteID type/length matches network
Validate:

  - Line features (first/last vertex logic)
Test scenarios:

  - Single route in tolerance
  - Multiple routes (distance then primary tie-breaker)
  - Outside tolerance
  - Verify Append Events opens when option is selected
Calibration tests:

  - With calibration
  - Without calibration
Regression:

  - Test within the full Extraction workflow

## Slide 6 — Automation

Automate in similar fashion to other tools in the extraction workflow

## Slide 7 — Documentation

Document:

  - Tool purpose and workflow
  - Ribbon integration behavior
  - Search tolerance logic
  - Deterministic route selection rules
Explicitly document:

  - New field creation
  - Null scenarios (no route / no calibration)
Add example of place in feature extraction workflow

## Slide 8 — Estimation

Estimation –
Dev Effort –  days
PE Effort –  days
