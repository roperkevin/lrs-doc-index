# Support Complex Route Shapes in Retire Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesRetireRoute.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesRetireRoute.pptx>) |
| **Edited** | 2019-11-18 21:58 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Retire Route"
source_file: "ComplexRouteShapesRetireRoute.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesRetireRoute.pptx"
doc_id: 872
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-11-18T21:58:05Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex shape", "retire route", "calibration points", "route shape", "euler algorithm", "roads and highways", "line network", "non line network"]
tools: ["Retire Route", "Generate Calibration Points", "Generate Routes"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":854,"file":"support-complex-route-shapes-in-realign-route__doc854.md","s":9.987},{"doc":855,"file":"support-complex-route-shapes-in-reassign-route__doc855.md","s":9.775},{"doc":873,"file":"support-complex-route-shapes-in-extend-route__doc873.md","s":9.591},{"doc":868,"file":"support-complex-route-shapes-in-cartographic-realignment__doc868.md","s":9.571},{"doc":853,"file":"support-complex-route-shapes-in-calibrate-route__doc853.md","s":9.216}]
```
-->

## Summary

This document describes the user story for supporting complex route shapes such as loops, lollipops, alpha, branched, and barbell routes in the Retire Route functionality within Roads and Highways. It outlines the use of the Euler algorithm to build route shapes, place calibration points, and calibrate routes when editing or extending complex routes. Testing includes positive and negative cases for various complex shapes in both REST and Pro UI environments.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route__doc854.md>) — similar text 0.86 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:854 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route__doc855.md>) — similar text 0.87 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-extend-route__doc873.md>) — similar text 0.79 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:873 -->
- [Support Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-cartographic-realignment__doc868.md>) — similar text 0.72 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:868 -->
- [Support Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-calibrate-route__doc853.md>) — similar text 0.60 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:853 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html) · [Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Retire Route

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc43_slide2.svg)

As a Roads and Highways user, I need to be able to retire existing/retire to create new complex route shapes in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so these routes calibrate and can have events located on them for reporting and other use cases.

## Slide 3 — Retire Route

Utilize the Euler algorithm used in Generate Calibration Points/Generate Routes to do the following in Retire Route when a complex route is edited OR the extend will create a complex shape:

  - Build the route shape
  - Place new calibration points at the required locations
  - Calibrate the route
Verify calibration points are placed correctly when extending; add all the necessary calibration points to work with the Euler algorithm if any are missing/not present
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

Negative
Automation

  - REST (add a few cases to the existing automation)
  - UI (A new set of Extend Route tests in TestComplete; only automate one of each type of complex shape)

## Slide 5 — Documentation

Document support for being able to retire existing/create new complex route shapes in the Retire Route editing topic.

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
