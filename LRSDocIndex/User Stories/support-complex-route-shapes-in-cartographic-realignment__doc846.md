# Support Complex Route Shapes in Cartographic Realignment

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesCartoRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/ComplexRouteShapesCartoRealign.pptx>) |
| **Edited** | 2019-12-12 00:13 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Cartographic Realignment"
source_file: "ComplexRouteShapesCartoRealign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Developers/ComplexRouteShapesCartoRealign.pptx"
doc_id: 846
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-12-12T00:13:11Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["cartographic realignment", "complex route shape", "calibration points", "roads and highways", "loop route", "lollipop route", "alpha route", "branched route"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":868,"file":"support-complex-route-shapes-in-cartographic-realignment__doc868.md","s":9.283},{"doc":838,"file":"support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md","s":8.34},{"doc":836,"file":"support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md","s":7.088},{"doc":873,"file":"support-complex-route-shapes-in-extend-route__doc873.md","s":6.901},{"doc":854,"file":"support-complex-route-shapes-in-realign-route__doc854.md","s":6.89}]
```
-->

## Summary

Describes the need for Roads and Highways users to cartographically realign existing or create new complex route shapes such as loops, lollipops, alpha, and branched routes. Covers the process for building shapes, calibration point management, and testing scenarios for both REST and Pro UI environments.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-complex-route-shapes-in-cartographic-realignment__doc868.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface <!-- rel:868 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md>) — similar text 0.44 · 6 title words · 5 filename words · same kind/surface <!-- rel:838 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md>) — similar text 0.34 · 4 title words · 4 filename words · same kind/surface <!-- rel:836 -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-complex-route-shapes-in-extend-route__doc873.md>) — similar text 0.50 · 4 title words · 3 filename words · same kind/surface <!-- rel:873 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route__doc854.md>) — similar text 0.56 · 4 title words · 4 filename words · same kind/surface <!-- rel:854 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Cartographic Realignment

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc58_slide2.svg)

As a Roads and Highways user, I need to be able to cartographically realign existing/cartographically realign to create new complex route shapes in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so these routes calibrate and can have events located on them for reporting and other use cases.

## Slide 3 — Cartographic Realignment

Test only for Services
When a user makes a cartographic realignment, follow the process below to build the shape and apply calibration

  - Build the shape
  - Proportionally snap any calibration points
  - Run the logic in Generate Calibration Points to place new calibration points where needed
  - Compare the CPs generated in the previous step with those the user already had in place on the route, delete any duplicates favoring the users existing CPs
  - Re-interpolate any CPs remaining that were generated by the Generate Calibration Point logic
  - Remove any CPs at intersections (loop closing location in an alpha route, etc.) where they shouldn’t be present
Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
Consider Z values on the centerline to determine if there is a self intersection/closing
Works in both non line and line networks
Needs to be supported in both REST and Pro UI

## Slide 4 — Testing

Positive (need to test for complex shapes for all of these scenarios)

  - Simple to Loop, Lollipop, Alpha, Barbell
  - Simple to Branch
  - Gapped to Loop, Lollipop, Alpha, Barbell
  - Gapped to Branch
  - Branch to Loop, Lollipop, Alpha, Barbell
  - Branch to Gapped
  - Branch to Simple
  - Loop, Lollipop, Alpha, Barbell to Simple
  - Loop, Lollipop, Alpha, Barbell to Gapped
  - Loop, Lollipop, Alpha, Barbell to Branch
  - Single centerline (single part)
  - Single centerline (multi part)
  - Multiple centerlines
  - Non Line Network (focus on this)
  - Line Network/Caltrans
  - With/without Z values (only for considering self intersection)
  - REST and UI
Automation

  - REST (add a few cases to the existing automation)
  - UI (A new set of Carto Realign tests in TestComplete; only automate one of each type of complex shape)

## Slide 5 — Documentation

Document support for being able to carto realign existing/create new complex route shapes in the Cartographic Realignment editing topic.

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
