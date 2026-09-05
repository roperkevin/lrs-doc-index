# Support Complex Route Shapes in Realign Route

| Field | Value |
| --- | --- |
| **Doc** | 854 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [ComplexRouteShapesRealignRoute.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesRealignRoute.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2019-11-19 22:48 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex route shape · realign route · calibration points · euler algorithm · centerline · route calibration · loops · lollipops · alpha route · branched route |
| **Tools** | Realign Route · Generate Calibration Points · Generate Routes |

## Summary

This user story describes the need for Roads and Highways users to realign existing or create new complex route shapes such as loops, lollipops, alpha, and branched routes. It covers the use of the Euler algorithm to build route shapes, place calibration points, and calibrate routes for complex shapes in both REST and Pro UI environments. Testing includes various complex shapes and network types with automation plans for REST and UI.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-cartographic-realignment-rh-2019-11.md>) — similar text 0.78 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:868 s=10.073 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route.md>) — similar text 0.86 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 s=9.987 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route.md>) — similar text 0.86 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 s=9.754 -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-extend-route.md>) — similar text 0.74 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:873 s=9.414 -->
- [Support Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-calibrate-route.md>) — similar text 0.59 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:853 s=9.168 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Complex Route Shapes in Realign Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways user, I need to be able to realign existing/realign to create new complex route shapes in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so these routes calibrate and can have events located on them for reporting and other use cases.

![Figure 1 — User Story](../media/support-complex-route-shapes-in-realign-route/fig-01-slide-02-user-story.svg)
[connections: (ellipse 19) — (ellipse 18)]

## Acceptance Criteria
### Realign Route <!-- slide 3 -->
- Only for services
- Utilize the Euler algorithm used in Generate Calibration Points/Generate Routes to do the following in Realign Route when a complex route is edited OR the realign will create a complex shape:
  - Build the route shape
  - Place new calibration points at the required locations
  - Calibrate the route
- One or more centerlines can be used to realign an existing complex route shape/create a complex route shape
- Verify calibration points are placed correctly when realigning; add all the necessary calibration points to work with the Euler algorithm if any are missing/not present
- Only split centerline(s) as needed (always split multipart centerlines into multiple single part centerlines)
- Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
- Consider Z values on the centerline/route to determine if there is a self intersection/closing
- Works in both non line and line networks
- Needs to be supported in both REST and Pro UI

## Testing
<!-- slide 4 -->
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
Automation

  - REST (add a few cases to the existing automation)
  - UI (A new set of Realign Route tests in TestComplete; only automate one of each type of complex shape)

## Documentation
<!-- slide 5 -->
- Document support for being able to realign existing/create new complex route shapes in the Realign Route editing topic.

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
Test Plan PE:
