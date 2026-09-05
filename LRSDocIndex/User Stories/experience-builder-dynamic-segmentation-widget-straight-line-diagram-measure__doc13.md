# Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB - SLD Measure Range Filtering.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Measure%20Range%20Filtering.pptx>) |
| **Edited** | 2026-07-01 18:39 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering"
source_file: "ExB - SLD Measure Range Filtering.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Measure%20Range%20Filtering.pptx"
doc_id: 13
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2026-07-01T18:39:16Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["measure range filtering", "straight line diagram", "dynamic segmentation", "event editor", "gis analyst", "rest call", "queryattributeset"]
tools: ["Dynamic Segmentation"]
products: []
issues: []
related: [{"doc":12,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md","s":6.268},{"doc":27,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md","s":6.094},{"doc":25,"file":"dynamic-segmentation-sld-expression-display-support__doc25.md","s":5.002},{"doc":362,"file":"experience-builder-dynamic-segmentation-widget__doc362.md","s":4.552},{"doc":348,"file":"experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md","s":4.541}]
```
-->

## Summary

Describes a user story for event editors and GIS analysts to filter the Straight Line Diagram by a specific measure range in the Dynamic Segmentation widget. Covers workflow, acceptance criteria, testing, automation, and documentation updates related to measure range filtering. Focuses on improving focused analysis of route subsections without affecting map markers or existing interactions.

## Related documents

<!-- related:begin -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md>) — similar text 0.20 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:12 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md>) — similar text 0.19 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:27 -->
- [Dynamic Segmentation SLD - Expression Display Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-sld-expression-display-support__doc25.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:25 -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget__doc362.md>) — similar text 0.18 · 5 title words · same kind/surface/folder <!-- rel:362 -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md>) — similar text 0.16 · 5 title words · same kind/surface/folder <!-- rel:348 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Slide 1 — Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering

## Slide 2 — User Story, Personas, Workflow

As an event editor, I need the ability to filter the Straight Line Diagram by a specific measure range, so that I can focus on a subsection of a route and analyze event relationships without unnecessary visual noise.
Personas

  - Event Editor – Event Editors maintain and validate LRS event data such as pavement, safety, or pipeline characteristics. They rely heavily on SLD visualization to detect issues like overlaps or gaps. For long routes, analyzing the entire dataset at once introduces cognitive overload. These users need a focused view of a specific section to efficiently validate and edit data.
  - GIS Analyst – GIS Analysts configure LRS services, attribute sets, and Experience Builder applications. They prioritize performance, scalability, and consistency with underlying REST services. They require filtering capabilities that reduce payload size and align directly with server-side query behavior.
Workflow

  - Launch Dynamic Segmentation widget
  - Select a route
  - Open Straight Line Diagram view
  - Locate Measure Range input section
  - Enter:From MeasureTo Measure
  - System validates inputs
  - System executes QueryAttributeSet REST call with measure range filter
  - SLD displays only filtered section
  - Map markers remain unchanged
  - User continues focused analysis

## Slide 3 — Acceptance Criteria

UI / Input
Add a labeled section: “Measure Range”
Provide two text boxes: From Measure & To Measure
Both inputs are required for filtering
If one or both values are missing:

  - Treat as no filter
  - Return full route (current behavior)
Filtering Behavior
Filtering is applied at the QueryAttributeSet REST call
Returned dataset must only include: Events within the specified measure range
Applies to:

  - All attribute sets
  - Point, line, and spanning events
Scale
SLD must continue to:

  - Honor configured initial scale
  - Must NOT auto-fit or rescale based on filtered range (unless already part of scale logic)

## Slide 4 — Acceptance Criteria

Validation & Input Handling
If From > To system must:

  - Swap values in the REST request only
  - NOT modify values in the UI
Returned range is between provided values regardless of order
Map & Interaction Behavior
Map behavior remains unchanged:

  - Route geometry fully displayed
  - Event markers continue to exist
SLD reflects filtered subset only
No regression to:

  - Hover behavior
  - Click behavior
Highlighting/Backward Compatibility
If Measure Range is empty behavior remains identical to today
No regression to:

  - SLD rendering
  - DynSeg workflows
  - Attribute results

## Slide 5 — Testing

Functional Testing
Validate:

  - Both fields populated → filtered measures
  - One/both empty → full route
Validation Scenarios
From < To → standard filtering
From > To → reversed in REST, correct output
Non-numeric / invalid values handled (error or ignore based on system standards)
Boundary Testing
Start of route
End of route
Very small ranges (e.g., near-zero length)
Large ranges
Just larger than initial scale
Just smaller than initial scale
Data Coverage
Point events
Line events
Spanning events
REST Validation
Confirm:

  - queryAttributeSet includes measure filters
  - Payload reduced vs full route
  - Returned dataset matches expected range
Regression Testing
Map markers unaffected
SLD interactions unchanged
Scale behavior unchanged

## Slide 6 — Automation

Automate:
Valid range input scenarios
Empty input fallback behavior
From > To reversal behavior
Validate:
Correct REST payload construction
Dataset size reduction
Extend existing DynSeg automation:
Ensure compatibility with SLD rendering
Regression coverage for interactions

## Slide 7 — Documentation

Update Dynamic Segmentation widget documentation:

  - Add Measure Range filtering section
Document:

  - Requirement for both values
  - Behavior for empty inputs
  - From > To handling (server-side only)
  - REST-level filtering vs UI filtering
Include examples:

  - Full route vs filtered range
Explicitly clarify:

  - Map markers are NOT filtered

## Slide 8 — Estimation

Estimation:
Dev Effort:
PE Effort:
