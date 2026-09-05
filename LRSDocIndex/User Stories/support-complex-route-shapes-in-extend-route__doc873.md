# Support Complex Route Shapes in Extend Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesExtendRoute.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesExtendRoute.pptx>) |
| **Edited** | 2019-11-15 18:59 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Extend Route"
source_file: "ComplexRouteShapesExtendRoute.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesExtendRoute.pptx"
doc_id: 873
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-11-15T18:59:50Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex shape", "route extension", "calibration points", "centerline", "euler algorithm", "road and highways", "loop", "lollipop", "alpha route", "branch route"]
tools: ["Extend Route", "Generate Calibration Points", "Append Routes"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":872,"file":"support-complex-route-shapes-in-retire-route__doc872.md","s":9.591},{"doc":855,"file":"support-complex-route-shapes-in-reassign-route__doc855.md","s":9.513},{"doc":854,"file":"support-complex-route-shapes-in-realign-route__doc854.md","s":9.414},{"doc":839,"file":"support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md","s":9.33},{"doc":874,"file":"support-complex-route-shapes-in-create-route__doc874.md","s":8.989}]
```
-->

## Summary

Describes the need for Roads and Highways users to extend or create complex route shapes such as loops, lollipops, alpha, and branched routes. Specifies using the Euler algorithm to build route shapes, place calibration points, and calibrate routes without splitting centerlines. Covers support for both line and non-line networks in REST and Pro UI. Includes positive and negative testing scenarios and documentation requirements.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route__doc872.md>) — similar text 0.79 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route__doc855.md>) — similar text 0.72 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route__doc854.md>) — similar text 0.74 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:854 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md>) — similar text 0.47 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:839 -->
- [Support Complex Route Shapes in Create Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-create-route__doc874.md>) — similar text 0.76 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:874 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html) · [Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Extend Route

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc40_slide2.svg)

As a Roads and Highways user, I need to be able to extend existing/create new complex route shapes in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so these routes calibrate and can have events located on them for reporting and other use cases.

## Slide 3 — Extend Route

Utilize the Euler algorithm used in Generate Calibration Points/Append Routes to do the following in Extend Route when a complex route is edited OR the extend will create a complex shape:

  - Build the route shape
  - Place new calibration points at the required locations
  - Calibrate the route
One or more centerlines can be used to extend an existing complex route shape/create a complex route shape
Verify calibration points are placed correctly when extending; fail with an error message alerting the user that the calibration points aren’t in the expected locations (or do we want to place them for the user?)
Extend route should not split any centerlines used to create these complex shapes (Ok if they need to become multi part)
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
  - Line Network
  - With Z values
  - Without Z values
  - REST and UI
Negative

  - Centerline with overlapping (not self intersecting/closing) segments
  - Calibration points not in correct locations to calibrate complex shape
Automation

  - REST (add a few cases to the existing automation)
  - UI (A new set of Extend Route tests in TestComplete)

## Slide 5 — Documentation

Document support for being able to extend existing/create new complex route shapes in the Extend Route editing topic.

## Slide 6 — Assignment

Story Points:
Dev:
PE:
