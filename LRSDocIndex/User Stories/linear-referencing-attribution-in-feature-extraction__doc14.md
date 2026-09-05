# Linear Referencing attribution in Feature Extraction

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Linear Referencing attribution to Feature Extraction.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Linear%20Referencing%20attribution%20to%20Feature%20Extraction.pptx>) |
| **Edited** | 2026-07-01 20:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Linear Referencing attribution in Feature Extraction"
source_file: "Linear Referencing attribution to Feature Extraction.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Linear%20Referencing%20attribution%20to%20Feature%20Extraction.pptx"
doc_id: 14
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-07-01T20:03:20Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["linear referencing", "route attribution", "measure calculation", "feature extraction", "search tolerance", "route selection", "calibration", "overwrite behavior"]
tools: ["Feature Extraction"]
products: []
issues: []
related: [{"doc":7,"file":"linear-referencing-attribution-in-linear-feature-extraction__doc7.md","s":11.511},{"doc":42,"file":"linear-referencing-ribbon-unified-experience__doc42.md","s":3.459},{"doc":273,"file":"support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md","s":2.732},{"doc":266,"file":"support-events-spanning-routes-in-update-measures-from-lrs__doc266.md","s":2.458},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":2.343}]
```
-->

## Summary

Describes the integration of linear referencing route and measure attribution within the Feature Extraction experience in ArcGIS Pro. Covers user personas, workflow, tool integration, acceptance criteria including route selection logic, tolerance and calibration handling, measure calculation, and testing scenarios. Also includes documentation and automation considerations.

## Related documents

<!-- related:begin -->
- [Linear Referencing Attribution in Linear Feature Extraction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-attribution-in-linear-feature-extraction__doc7.md>) — similar text 0.91 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:7 -->
- [Linear Referencing Ribbon – Unified Experience](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/linear-referencing-ribbon-unified-experience__doc42.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:42 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md>) — similar text 0.12 · same kind/surface/folder <!-- rel:273 -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs__doc266.md>) — similar text 0.12 · same kind/surface/folder <!-- rel:266 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.19 · same kind/folder <!-- rel:13 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)

_No page matched:_ [Feature Extraction](https://www.google.com/search?q=%22Feature%20Extraction%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Linear Referencing attribution in Feature Extraction

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
Tool executes backend processing (Python/Pro-compatible implementation)
The tool:

  - Identifies nearest route
  - Calculates measures
  - Writes fields to feature class (overwrites existing values)
Tool returns summary messages

## Slide 3 — Acceptance Criteria & Requirements

Tool Integration
Tool is exposed as a button in the Feature Extraction ribbon
Clicking the button opens a native ArcGIS Pro UI
Execution runs via Python or Pro-supported backend implementation
Tool behaves as a standard GP-style execution (non-blocking UI)
Inputs
LRS Network (required)
Extracted Feature Class (required)
Search Tolerance (required)
Overwrite Behavior
If RouteID / measure fields already exist values are overwritten
Output Fields
Points:

  - RouteID (match LRS field type and length)
  - Measure (Double)
Lines:

  - RouteID
  - From Measure (Double)
  - To Measure (Double)
  - FromMeasure = measure at first vertex
  - ToMeasure = measure at last vertex
  - Both measures must be calculated on the same route

## Slide 4 — Acceptance Criteria & Requirements

Route Selection Logic
Identify all routes within tolerance
If one → use it
If multiple:

  - Choose closest route
  - If same distance → choose first returned route
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

  - Point features
  - Line features (first/last vertex logic)
Test scenarios:

  - Single route in tolerance
  - Multiple routes (distance + tie-breaker)
  - Outside tolerance
Calibration tests:

  - With calibration
  - Without calibration
Regression:

  - Upsteam Feature Extraction workflows unaffected

## Slide 6 — Automation

How are we automating?

## Slide 7 — Documentation

Document:

  - Tool purpose and workflow
  - Ribbon integration behavior
  - Search tolerance logic
  - Deterministic route selection rules
Explicitly document:

  - Overwrite behavior
  - Null scenarios (no route / no calibration)
Add example of place in feature extraction workflow

## Slide 8 — Estimation

Estimation –
Dev Effort –  days
PE Effort –  days
