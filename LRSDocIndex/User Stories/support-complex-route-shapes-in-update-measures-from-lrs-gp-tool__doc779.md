# Support Complex Route Shapes in Update Measures from LRS GP tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [UpdateMeasuresfromLRSComplexRouteShapes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/UpdateMeasuresfromLRSComplexRouteShapes.pptx>) |
| **Edited** | 2020-07-17 00:19 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Update Measures from LRS GP tool"
source_file: "UpdateMeasuresfromLRSComplexRouteShapes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/UpdateMeasuresfromLRSComplexRouteShapes.pptx"
doc_id: 779
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-17T00:19:54Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex route", "update measures", "utility network", "geoprocessing tool", "route id", "measure"]
tools: ["Update Measures from LRS"]
products: ["Utility Network"]
issues: []
related: [{"doc":780,"file":"support-complex-route-shapes-in-derive-event-measures-gp-tool__doc780.md","s":6.537},{"doc":798,"file":"support-complex-route-shapes-in-translate-events-gp-tool__doc798.md","s":6.118},{"doc":799,"file":"support-complex-route-shapes-in-overlay-events-gp-tool__doc799.md","s":6.011},{"doc":837,"file":"support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md","s":5.838},{"doc":836,"file":"support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md","s":5.655}]
```
-->

## Summary

This user story describes the need for the Update Measures from LRS geoprocessing tool to support features located on complex route shapes, ensuring correct route IDs and measures are assigned. It includes testing scenarios for various complex route shapes and mentions automation of tests using Python. No documentation updates are required.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Derive Event Measures GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-derive-event-measures-gp-tool__doc780.md>) — similar text 0.42 · 6 title words · 2 filename words · same kind/surface/folder <!-- rel:780 -->
- [Support Complex Route Shapes in Translate Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-translate-events-gp-tool__doc798.md>) — similar text 0.40 · 5 title words · 2 filename words · same kind/surface/folder <!-- rel:798 -->
- [Support Complex Route Shapes in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-overlay-events-gp-tool__doc799.md>) — similar text 0.42 · 5 title words · 2 filename words · same kind/surface/folder <!-- rel:799 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md>) — similar text 0.38 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:837 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md>) — similar text 0.36 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:836 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex scenarios for route calibration](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/complex-scenarios-for-route-calibration.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Update Measures from LRS GP tool

User Story

## Slide 2 — User Story

As an LRS editor, I need to be get measures onto Utility Network features that are located on a complex route, so that the correct route and measure is added to those features.

## Slide 3 — Update Measures from LRS on Complex Shapes

![Measured route diagram drawn from the slide's own shapes.](../media/doc132_slide3.svg)

In the Update Measures from LRS GP tool, features that are located on complex routes need to be supported.
When an feature that is located on a complex route is input into the tool, make sure the tool places the correct From RouteID, To RouteID (if line network), From Measure, and To Measure (if line feature) on the output record
If the RouteID(s) and Measure(s) can’t be found, report the same way we do today
Centerlines/Pipelines           Route

## Slide 4 — Testing

Test the following scenarios:

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network
  - Line Network
  - Derived Network
  - Features that go from begin-end, begin-middle, middle-middle, and middle-end
  - Features that begin/end at the self-intersection point
Test with UN pipeline, device, and junction feature classes

## Slide 5 — Automation

Python – Add a set of tests for complex route shapes to the existing test cases that are automated for the tool today

## Slide 6 — Documentation

No documentation updates for the existing documentation for the tool

## Slide 7 — Assignment

Story Points:
Dev:
PE:
