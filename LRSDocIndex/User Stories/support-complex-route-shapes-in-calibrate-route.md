# Support Complex Route Shapes in Calibrate Route

| Field | Value |
| --- | --- |
| **Doc** | 853 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [ComplexRouteShapesCalibrateRoute.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesCalibrateRoute.pptx>) |
| **People** | author P_Kumar@esri.com · PE — · dev — |
| **Edited** | 2019-11-20 22:49 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex shape · calibrate route · euler algorithm · route calibration · self intersection · z values · line network · non line network |
| **Tools** | Calibrate Route · Generate Calibration Points · Generate Routes |

## Summary

Describes the need for Roads and Highways users to calibrate complex route shapes such as loops, lollipops, alpha, branched, and barbell routes. Specifies use of the Euler algorithm for calibration, support for Z values to detect self intersections, and requirements for both REST and Pro UI support. Includes positive and negative testing scenarios and automation plans.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route.md>) — similar text 0.60 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 s=9.263 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route.md>) — similar text 0.60 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 s=9.216 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route.md>) — similar text 0.59 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:854 s=9.168 -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-extend-route.md>) — similar text 0.54 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:873 s=8.961 -->
- [Support Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-cartographic-realignment-rh-2019-11.md>) — similar text 0.50 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:868 s=8.718 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html)

_No page matched:_ [Calibrate Route](https://www.google.com/search?q=%22Calibrate%20Route%22+site%3Adoc.esri.com) · [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Complex Route Shapes in Calibrate Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways user, I need to be able to calibrate complex route shapes in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so these routes calibrate and can have events located on them for reporting and other use cases.

![Figure 1 — User Story](../media/support-complex-route-shapes-in-calibrate-route/fig-01-slide-02-user-story.svg)
[connections: (ellipse 19) — (ellipse 18)]

## Acceptance Criteria
### Calibrate Route <!-- slide 3 -->
- Utilize the Euler algorithm used in Generate Calibration Points/Generate Routes to Calibrate a complex route.
- Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
- Consider Z values on the centerline/route to determine if there is a self intersection/closing
- Support in both non line and line networks
- Needs to be supported in both REST and Pro UI
- Error out when the calibration activity is about to create non-monotonic route.
- Do not allow to delete any of the minimum required no of calibration points for complex shapes (Points which we create while generate calibration points)

<!-- slide 4 -->
[figure: 10 0 · 6.66 3.33 · 0 10 6.66 · 3.33 · 0 6.66 · 10 3.33 · 1 · 2 · 1.66 8.33 · 3.33 6.66 · 0 10 · 1–3 · 3 · 7 · 8 · 1 9 · 4 · 6 · 5 10 · 0 · 5]

![Figure 2](../media/support-complex-route-shapes-in-calibrate-route/fig-02-slide-04.svg)

## Testing
<!-- slide 5 -->
Positive

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

  - Calibrate to create non-monotonic route
Automation

  - REST (add a few cases to the existing automation)
  - UI (A new set of Calibrate Route tests in TestComplete; only automate one of each type of complex shape)

## Documentation
<!-- slide 6 -->
- Document support for being able to Calibrate complex route shapes in the Calibrate Route topic.

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
Test Plan PE:
