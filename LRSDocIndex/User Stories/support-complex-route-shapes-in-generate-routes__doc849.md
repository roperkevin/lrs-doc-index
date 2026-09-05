# Support Complex Route Shapes in Generate Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesGenerateRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesGenerateRoutes.pptx>) |
| **Edited** | 2019-12-04 00:27 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Generate Routes"
source_file: "ComplexRouteShapesGenerateRoutes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesGenerateRoutes.pptx"
doc_id: 849
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-12-04T00:27:54Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex route shape", "generate routes", "calibration points", "euler algorithm", "loops", "lollipops", "alpha routes", "branched routes", "line network", "non line network"]
tools: ["Generate Routes"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":848,"file":"support-complex-route-shapes-in-generate-events__doc848.md","s":10.147},{"doc":872,"file":"support-complex-route-shapes-in-retire-route__doc872.md","s":8.754},{"doc":855,"file":"support-complex-route-shapes-in-reassign-route__doc855.md","s":8.585},{"doc":854,"file":"support-complex-route-shapes-in-realign-route__doc854.md","s":8.543},{"doc":873,"file":"support-complex-route-shapes-in-extend-route__doc873.md","s":8.404}]
```
-->

## Summary

This user story describes the need for Roads and Highways users to generate and regenerate complex route shapes such as loops, lollipops, alpha, and branched routes. The Generate Routes geoprocessing tool uses the Euler algorithm to ensure correct shape and calibration based on existing calibration points, supporting both line and non-line networks and considering Z values for self intersections. Testing includes positive and negative cases with automation via Python and feature services input.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Generate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-events__doc848.md>) — similar text 0.86 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:848 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route__doc872.md>) — similar text 0.65 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route__doc855.md>) — similar text 0.66 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route__doc854.md>) — similar text 0.64 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:854 -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-extend-route__doc873.md>) — similar text 0.57 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:873 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Generate Routes

User Story

## Slide 2 — User Story

As a Roads and Highways user, I need to be able to generate/regenerate complex route shapes in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so these routes calibrate and can have events located on them for reporting and other use cases.

## Slide 3 — Generate Routes

Works with inputs as fgdb, direct connect (traditional or branch), and services
In the Generate Routes GP tool, utilize the Euler algorithm as needed to ensure a complex route gets the correct shape and correct calibration applied based on the existing calibration points associated with the route
Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
Consider Z values on the centerline to determine if there is a self intersection/closing
Works in both non line and line networks
Add to the output text file if the following scenarios occur when running the tool:

  - The complex route the event will be located on doesn’t have the required calibration points in the required locations
  - The complex route doesn’t calibrate for some other reason

## Slide 4 — Testing

Positive (Generating Events on a)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network (events spanning routes)
  - Caltrans
  - With/without Z values (only for considering self intersection)

Negative

  - Calibration points not in correct locations to calibrate complex shape
Automation

  - Python (Add to the existing Generate Routes automated tests)
  - Feature Services as input

## Slide 5 — Documentation

Add a usage note to the existing GP tool topic about support for generating routes that are complex route shapes

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
