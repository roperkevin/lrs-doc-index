# Support Complex Route Shapes in Remove Overlapping Centerlines GP tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [RemoveOverlappingCenterlinesComplexRouteShapes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RemoveOverlappingCenterlinesComplexRouteShapes.pptx>) |
| **Edited** | 2020-07-17 00:20 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Remove Overlapping Centerlines GP tool"
source_file: "RemoveOverlappingCenterlinesComplexRouteShapes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RemoveOverlappingCenterlinesComplexRouteShapes.pptx"
doc_id: 776
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-17T00:20:09Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "complex shape", "multipart centerline", "route", "remove overlapping centerlines", "geoprocessing"]
tools: ["Remove Overlapping Centerlines"]
products: []
issues: []
related: [{"doc":747,"file":"remove-overlapping-centerlines-3d-support__doc747.md","s":5.961},{"doc":854,"file":"support-complex-route-shapes-in-realign-route__doc854.md","s":5.938},{"doc":873,"file":"support-complex-route-shapes-in-extend-route__doc873.md","s":5.821},{"doc":872,"file":"support-complex-route-shapes-in-retire-route__doc872.md","s":5.705},{"doc":855,"file":"support-complex-route-shapes-in-reassign-route__doc855.md","s":5.705}]
```
-->

## Summary

This user story describes the need for the Remove Overlapping Centerlines geoprocessing tool to correctly handle centerlines with complex shapes, including multipart centerlines and those associated with complex route shapes. It specifies the expected behavior for removing duplicates and updating centerline sequences in these scenarios. Testing scenarios include various complex route shapes such as loop, lollipop, alpha, branch, barbell, and complex shapes with gaps. Automation involves adding Python tests for these cases.

## Related documents

<!-- related:begin -->
- [Remove Overlapping Centerlines 3D support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/remove-overlapping-centerlines-3d-support__doc747.md>) — similar text 0.30 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:747 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route__doc854.md>) — similar text 0.32 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:854 -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-extend-route__doc873.md>) — similar text 0.28 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:873 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route__doc872.md>) — similar text 0.29 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route__doc855.md>) — similar text 0.29 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/complex-shapes.html) · [Split multipart centerlines into singlepart features](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-multipart-centerlines-into-singlepart-features.html)

_No page matched:_ [Remove Overlapping Centerlines](https://www.google.com/search?q=%22Remove%20Overlapping%20Centerlines%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Remove Overlapping Centerlines GP tool

User Story

## Slide 2 — User Story

As an LRS data loader/editor, I need to be able to run remove overlapping centerlines on centerline features that are complex/part of a complex route, so that their overlapping sections are correctly removed and a single centerline is present at each location in accordance with the LRS information model.

## Slide 3 — Remove Overlapping Centerlines GP on Complex Shapes

In the Remove Overlapping Centerlines GP tool, duplicate centerlines need to be removed correctly in the following scenarios:

  - One or more of the overlapping centerlines have a complex shape (multipart centerline)
  - One or more of the overlapping centerlines is associated with a route with a complex shape
In the case of overlapping centerlines having a complex shape (and are multipart), the tool should do the following:

  - Determine which centerlines are overlapping that have complex shapes
  - Convert those multipart centerlines to singlepart
  - Remove the resulting overlaps and update centerline sequence as the tool does today
In the case of overlapping singlepart centerlines that are part of a complex route shape, the tool should do what it does today and ensure that the centerline sequence records are correct for the complex shape

## Slide 4 — Testing

Test the following route and multipart centerline scenarios:

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
Network type shouldn’t matter

## Slide 5 — Automation

Python – Add a set of tests for complex centerline shapes and centerlines that are part of complex routes to the existing tests we have for the tool today

## Slide 6 — Documentation

No documentation updates needed for the tool

## Slide 7 — Assignment

Story Points:
Dev:
PE:
