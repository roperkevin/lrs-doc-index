# Allow LRS Events and Intersections in Update Measures from LRS tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [AllowLRSEvents&IntersectionsinUpdateMeasuresfromLRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AllowLRSEvents%26IntersectionsinUpdateMeasuresfromLRS.pptx>) |
| **Edited** | 2024-03-22 23:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Allow LRS Events and Intersections in Update Measures from LRS tool"
source_file: "AllowLRSEvents&IntersectionsinUpdateMeasuresfromLRS.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AllowLRSEvents%26IntersectionsinUpdateMeasuresfromLRS.pptx"
doc_id: 393
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2024-03-22T23:57:25Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lrs event", "lrs intersection", "update measures", "route", "measure", "event editing"]
tools: ["Update Measures from LRS"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":163,"file":"allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md","s":4.275},{"doc":746,"file":"support-vertical-route-segments-3d-interpolation-in-update-measures-from-lrs-gp__doc746.md","s":4.138},{"doc":168,"file":"allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md","s":3.793},{"doc":779,"file":"support-complex-route-shapes-in-update-measures-from-lrs-gp-tool__doc779.md","s":3.751},{"doc":273,"file":"support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md","s":3.73}]
```
-->

## Summary

This user story describes the need for the Update Measures from LRS tool in ArcGIS Pro to support LRS Events and LRS Intersection feature classes as inputs for updating measures. It outlines requirements to restrict certain field mappings when these inputs are used and specifies testing and automation plans to ensure correct functionality across different LRS data types and environments.

## Related documents

<!-- related:begin -->
- [Allow LRS Intersections to be updated without locking intersecting routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-lrs-intersections-to-be-updated-without-locking-intersecting-routes__doc163.md>) — similar text 0.25 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:163 -->
- [Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-vertical-route-segments-3d-interpolation-in-update-measures-from-lrs-gp__doc746.md>) — similar text 0.23 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:746 -->
- [Allow Append Events to Run When Locks Are Present on Impacted Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-append-events-to-run-when-locks-are-present-on-impacted-routes__doc168.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:168 -->
- [Support Complex Route Shapes in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-update-measures-from-lrs-gp-tool__doc779.md>) — similar text 0.20 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:779 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md>) — similar text 0.17 · 2 title words · same kind/surface/folder <!-- rel:273 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS event properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-event-properties.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Allow LRS Events and Intersections in Update Measures from LRS tool

User Story
ArcGIS Pro

## Slide 2 — User Story

As an LRS data editor, I need to be able to get additional route and measure information from the LRS onto events and intersections, so that I can maintain measures from multiple LRMs on a single feature.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  In pipeline organizations, we’re seeing them support more LRMs than just a line and derived network (example is an odometer network) and need to use the Update Measures from LRS tool to update these additional LRS routes/measures onto events and intersections.

## Slide 3 — Requirements

In the Update Measures from LRS tool, allow LRS Events and LRS Intersection feature classes/layers to be inputs to be updated
If an LRS Event or Intersection is the input to the Update Measures from LRS tool, do not allow users to map the fields configured for routeID, measure(s), derived routeID, or derived measure(s) as the routeID, From Measure, or To Measure fields in the Update Measures from LRS tool
Continue to enforce the same requirements/validations around fields that are mapped as the routeID and measure(s) fields in the Update Measures from LRS tool

## Slide 4 — Testing

Test with APR and APR-UN data
Test with a mix of LRSes (Line Network and Non-Line Network combination & Line, Derived, and Non-Line Network combination)
Test with events that do and do not span
Verify existing automation continues to produce correct results for existing test cases
Test in Pro, python inline, python stand alone, and model builder

## Slide 5 — Automation

Add to the existing python automation for this tool

## Slide 6 — Documentation

Update the existing documentation GP topic and mention that LRS Events and Intersections are supported as inputs to be updated, but that the existing fields configured with the LRS can’t be the inputs in those scenarios

## Slide 7 — Story Points

Story Points:
Dev:
PE:
