# Support Event Behaviors on Complex Route Shapes in Cartographic Realignment

| Field | Value |
| --- | --- |
| **Doc** | 838 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [ComplexRouteShapesEventBehaviorCartoRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorCartoRealign.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-01-16 22:58 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex shape · cartographic realignment · event behavior · route editing · roads and highways · loop · lollipop · alpha route · branch route |
| **Tools** | — |

## Summary

This user story addresses the need for Roads and Highways editors to apply event behaviors on complex route shapes that undergo cartographic realignment, including loops, lollipops, alpha, and branched routes. It ensures that events on these realigned routes maintain accurate measures and shapes. The story includes scenarios for different complex shape transformations and testing plans for both line and non-line networks.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-realign-route.md>) — similar text 0.73 · 6 title words · 6 filename words · same kind/surface/folder <!-- rel:836 s=10.919 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-reassign-route.md>) — similar text 0.72 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:837 s=10.398 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-extend-route.md>) — similar text 0.54 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:839 s=9.849 -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-retire-route.md>) — similar text 0.58 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 s=9.643 -->
- [Support Event Behaviors on Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-calibrate-route.md>) — similar text 0.55 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:840 s=9.553 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Story
### Support Event Behaviors on Complex Route Shapes in Cartographic Realignment <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are cartographically realigned in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the cartographically realigned route(s) have their measures and shapes kept up to date.

![Figure 1 — User Story](../media/support-eb-on-complex-route-shapes-in-cartographic/fig-01-slide-02-user-story.svg)
[connections: (ellipse 19) — (ellipse 18)]

## Acceptance Criteria
### Cartographic Realignment Route Event Behaviors <!-- slide 3 -->
- When making a cartographic realignment to a complex route, continue to write to the edit log as we do today
- Cartographic Realignments can result in the following for both the source and target routes:
  - Non complex shapes become complex
  - Complex shapes remain complex
  - Complex shapes become a different type of complex shape
  - Complex shapes become non complex
- For each of these scenarios, we should continue to apply Cartographic Realignment event behaviors in the same way we do today.
- Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
- Should work for complex shape type test cases from the Cartographic Realignment Complex Route shapes user story
- Works in both non line and line networks (no Postmile as they don’t have events)

## Testing
<!-- slide 4 -->
Positive (for existing, newly created, and former complex shapes)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network (include abandonment)
  - Test begin-end, begin-middle, middle-middle, and middle-end
Negative

  - LocErrors for partial matches
Automation

  - Python – Add a set of tests for complex route shapes in the same manner as the non-complex and gapped route shape tests in place today

## Documentation
<!-- slide 5 -->
- Add a note to cartographic realignment route event behavior topic to mention complex shapes being supported

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
Test Plan PE:
