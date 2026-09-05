# Support Complex Route Shapes in Cartographic Realignment

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesCartoRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesCartoRealign.pptx>) |
| **Edited** | 2019-11-19 22:50 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Cartographic Realignment"
source_file: "ComplexRouteShapesCartoRealign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesCartoRealign.pptx"
doc_id: 868
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-11-19T22:50:04Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex shape", "cartographic realignment", "calibration points", "route shape", "loop", "lollipop", "alpha route", "branch route"]
tools: ["Generate Calibration Points", "Generate Routes", "Cartographic Realignment"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":854,"file":"support-complex-route-shapes-in-realign-route__doc854.md","s":10.073},{"doc":872,"file":"support-complex-route-shapes-in-retire-route__doc872.md","s":9.571},{"doc":838,"file":"support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md","s":9.443},{"doc":846,"file":"support-complex-route-shapes-in-cartographic-realignment__doc846.md","s":9.174},{"doc":855,"file":"support-complex-route-shapes-in-reassign-route__doc855.md","s":9.157}]
```
-->

## Summary

Describes the need for Roads and Highways users to cartographically realign existing or create new complex route shapes such as loops, lollipops, alpha, and branched routes. Covers the use of the Euler algorithm to build route shapes, place calibration points, and calibrate routes during cartographic realignment, supporting both REST and Pro UI. Includes testing scenarios for various complex shapes and documentation requirements.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route__doc854.md>) — similar text 0.78 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:854 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route__doc872.md>) — similar text 0.72 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md>) — similar text 0.45 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:838 -->
- [Support Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-complex-route-shapes-in-cartographic-realignment__doc846.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface <!-- rel:846 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route__doc855.md>) — similar text 0.73 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Cartographic Realignment

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc49_slide2.svg)

As a Roads and Highways user, I need to be able to cartographically realign existing/cartographically realign to create new complex route shapes in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so these routes calibrate and can have events located on them for reporting and other use cases.

## Slide 3 — Cartographic Realignment

Only for Services
Utilize the Euler algorithm used in Generate Calibration Points/Generate Routes to do the following when Cartographically Realigning a complex route OR the Cartographic Realignment will create a complex shape:

  - Build the route shape
  - If needed, place new calibration points at the required locations
  - Calibrate the route
Consider that the carto realignment could be on an existing complex shape, create a complex shape, or change a complex shape to not be complex any longer (ex. Loop being broken apart)
Verify calibration points are placed correctly to calibrate the route after the carto realignment is complete; add the necessary calibration points to work with the Euler algorithm if any are missing/not present
Only split centerline(s) as needed (always split multipart centerlines into multiple single part centerlines)
Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
Consider Z values on the centerline to determine if there is a self intersection/closing
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
  - Single centerline (single part)
  - Single centerline (multi part)
  - Multiple centerlines
  - Non Line Network (focus on this)
  - Line Network/Caltrans
  - With/without Z values (only for considering self intersection)
  - REST and UI
  - Calibration points not in correct locations to calibrate complex shape
  - Breaking apart a complex shape into a non complex shape
Automation

  - REST (add a few cases to the existing automation)
  - UI (A new set of Carto Realign tests in TestComplete; only automate one of each type of complex shape)

## Slide 5 — Documentation

Document support for being able to carto realign existing/create new complex route shapes in the Cartographic Realignment editing topic.

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
