# Support Complex Route Shapes in Create Route

| Field | Value |
| --- | --- |
| **Doc** | 874 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [ComplexRouteShapesCreateRoute.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesCreateRoute.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2019-11-15 17:39 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex route shape · calibration points · route calibration · centerline · loops · lollipops · alpha route · branched route · barbell route |
| **Tools** | Create Route · Generate Calibration Points · Append Routes |

## Summary

This user story describes the need for Roads and Highways users to create complex route shapes such as loops, lollipops, alpha, branched, and barbell routes. It covers the use of the Euler algorithm in the Create Route function to build, calibrate, and place calibration points on complex route shapes without splitting centerlines. The story includes testing scenarios, automation plans, and documentation requirements for supporting these complex route shapes in both REST and Pro UI environments.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-extend-route.md>) — similar text 0.76 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:873 s=8.989 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route.md>) — similar text 0.69 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 s=8.534 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route.md>) — similar text 0.71 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:854 s=8.435 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route.md>) — similar text 0.69 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 s=8.242 -->
- [Support Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-calibrate-route.md>) — similar text 0.54 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:853 s=8.084 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html)

_No page matched:_ [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Complex Route Shapes in Create Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways user, I need to be able to create complex route shapes in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so these routes calibrate and can have events located on them for reporting and other use cases.

![Figure 1 — User Story](../media/support-complex-route-shapes-in-create-route/fig-01-slide-02-user-story.svg)
[connections: (ellipse 19) — (ellipse 18)]

## Acceptance Criteria
### Create Route <!-- slide 3 -->
- Utilize the Euler algorithm used in Generate Calibration Points/Append Routes to do the following in Create Route when the centerline(s) make a complex shape:
  - Build the route shape
  - Place calibration points at the required locations
  - Calibrate the route
- One or more centerlines can be used to create the complex shape
- Create route should not split any centerlines used to create these complex shapes (Ok if they need to become multi part)
- Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
- Consider Z values on the centerline to determine if there is a self intersection/closing
- Works in both non line and line networks
- Needs to be supported in both REST and Pro UI

## Testing
<!-- slide 4 -->
Positive

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
Automation

  - REST (add a few cases to the existing automation)
  - UI (A new set of Create Route tests in TestComplete)

## Documentation
<!-- slide 5 -->
- Document support for being able to create these complex route shapes in the Create Route editing topic.
- Create a new topic called Complex Route shapes that discusses support for loading, calibrating, editing, and adding events to complex route shapes.
  - Mention the requirements for placing calibration points in specific locations (mention the Generate Calibration Points tool will automatically do this)
  - Discuss the various types of route shapes that are now supported (Loops, lollipops, alpha, branch, barbell, and any other type of self intersecting route)

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
PE:
