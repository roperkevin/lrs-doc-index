# Support Complex Route Shapes in Remove Overlapping Centerlines GP tool

| Field | Value |
| --- | --- |
| **Doc** | 776 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [RemoveOverlappingCenterlinesComplexRouteShapes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RemoveOverlappingCenterlinesComplexRouteShapes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-07-17 00:20 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerline · complex shape · multipart centerline · route · remove overlapping centerlines · geoprocessing |
| **Tools** | Remove Overlapping Centerlines |

## Summary

This user story describes the need for the Remove Overlapping Centerlines geoprocessing tool to correctly handle centerlines with complex shapes, including multipart centerlines and those associated with complex route shapes. It specifies the expected behavior for removing duplicates and updating centerline sequences in these scenarios. Testing scenarios include various complex route shapes such as loop, lollipop, alpha, branch, barbell, and complex shapes with gaps. Automation involves adding Python tests for these cases.

## Related documents

<!-- related:begin -->
- [Remove Overlapping Centerlines 3D support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/remove-overlapping-centerlines-3d-support.md>) — similar text 0.30 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:747 s=5.961 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route.md>) — similar text 0.32 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:854 s=5.938 -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-extend-route.md>) — similar text 0.28 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:873 s=5.821 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route.md>) — similar text 0.29 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 s=5.705 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route.md>) — similar text 0.29 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 s=5.705 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/complex-shapes.html) · [Split multipart centerlines into singlepart features](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-multipart-centerlines-into-singlepart-features.html)

_No page matched:_ [Remove Overlapping Centerlines](https://www.google.com/search?q=%22Remove%20Overlapping%20Centerlines%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Complex Route Shapes in Remove Overlapping Centerlines GP tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS data loader/editor, I need to be able to run remove overlapping centerlines on centerline features that are complex/part of a complex route, so that their overlapping sections are correctly removed and a single centerline is present at each location in accordance with the LRS information model.

## Acceptance Criteria
### Remove Overlapping Centerlines GP on Complex Shapes <!-- slide 3 -->
- In the Remove Overlapping Centerlines GP tool, duplicate centerlines need to be removed correctly in the following scenarios:
  - One or more of the overlapping centerlines have a complex shape (multipart centerline)
  - One or more of the overlapping centerlines is associated with a route with a complex shape
- In the case of overlapping centerlines having a complex shape (and are multipart), the tool should do the following:
  - Determine which centerlines are overlapping that have complex shapes
  - Convert those multipart centerlines to singlepart
  - Remove the resulting overlaps and update centerline sequence as the tool does today
- In the case of overlapping singlepart centerlines that are part of a complex route shape, the tool should do what it does today and ensure that the centerline sequence records are correct for the complex shape

## Testing
<!-- slide 4 -->
- Test the following route and multipart centerline scenarios:
  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
- Network type shouldn’t matter

## Automation
<!-- slide 5 -->
Python – Add a set of tests for complex centerline shapes and centerlines that are part of complex routes to the existing tests we have for the tool today

## Documentation
<!-- slide 6 -->
No documentation updates needed for the tool

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
