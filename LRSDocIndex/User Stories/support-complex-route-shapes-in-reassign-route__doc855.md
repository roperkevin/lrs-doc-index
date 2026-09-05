# Support Complex Route Shapes in Reassign Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesReassignRoute.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesReassignRoute.pptx>) |
| **Edited** | 2019-11-19 22:49 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Reassign Route"
source_file: "ComplexRouteShapesReassignRoute.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesReassignRoute.pptx"
doc_id: 855
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-11-19T22:49:25Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex shape", "reassign route", "calibration points", "euler algorithm", "route calibration", "loop", "lollipop", "alpha route", "branch route"]
tools: ["Reassign Route", "Generate Calibration Points", "Generate Routes"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":872,"file":"support-complex-route-shapes-in-retire-route__doc872.md","s":9.775},{"doc":854,"file":"support-complex-route-shapes-in-realign-route__doc854.md","s":9.754},{"doc":873,"file":"support-complex-route-shapes-in-extend-route__doc873.md","s":9.513},{"doc":853,"file":"support-complex-route-shapes-in-calibrate-route__doc853.md","s":9.263},{"doc":868,"file":"support-complex-route-shapes-in-cartographic-realignment__doc868.md","s":9.157}]
```
-->

## Summary

This user story describes the need for Roads and Highways users to reassign existing or create new complex route shapes such as loops, lollipops, alpha, and branched routes. The functionality involves building route shapes, placing calibration points using the Euler algorithm, and calibrating routes to support event location and reporting. Testing covers various complex shapes in both REST and Pro UI environments, including automation plans.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route__doc872.md>) — similar text 0.87 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route__doc854.md>) — similar text 0.86 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:854 -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-extend-route__doc873.md>) — similar text 0.72 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:873 -->
- [Support Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-calibrate-route__doc853.md>) — similar text 0.60 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:853 -->
- [Support Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-cartographic-realignment__doc868.md>) — similar text 0.73 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:868 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html) · [Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Reassign Route

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc50_slide2.svg)

As a Roads and Highways user, I need to be able to reassign existing/reassign to create new complex route shapes in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so these routes calibrate and can have events located on them for reporting and other use cases.

## Slide 3 — Reassign Route

Only for Services
Utilize the Euler algorithm used in Generate Calibration Points/Generate Routes to do the following in Reassign Route when a complex route is edited OR the reassign will create a complex shape:

  - Build the route shape
  - Place new calibration points at the required locations
  - Calibrate the route
Verify calibration points are placed correctly when reassigning; add all the necessary calibration points to work with the Euler algorithm if any are missing/not present
Only split centerline(s) as needed (always split multipart centerlines into multiple single part centerlines)
Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
Consider Z values on the route to determine if there is a self intersection/closing
Works in both non line and line networks
Needs to be supported in both REST and Pro UI

## Slide 4 — Testing

Positive (for both existing and newly created complex shapes)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network/Caltrans
  - With/without Z values (only for considering self intersection)
  - REST and UI
  - Calibration points not in correct locations to calibrate complex shape
Automation

  - REST (add a few cases to the existing automation)
  - UI (A new set of Reassign Route tests in TestComplete; only automate one of each type of complex shape)

## Slide 5 — Documentation

Document support for being able to reassign existing/create new complex route shapes in the Reassign Route editing topic.

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
