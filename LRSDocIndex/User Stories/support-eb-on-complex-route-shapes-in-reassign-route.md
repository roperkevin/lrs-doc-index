# Support Event Behaviors on Complex Route Shapes in Reassign Route

| Field | Value |
| --- | --- |
| **Doc** | 837 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [ComplexRouteShapesEventBehaviorReassign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorReassign.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-01-17 01:02 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex shape · event behavior · reassign route · route shape · roads and highways · loop · lollipop · alpha route · branch route · barbell |
| **Tools** | — |

## Summary

This user story describes the need for Roads and Highways editors to apply event behaviors for complex route shapes such as loops, lollipops, alpha, and branched routes during route reassignment. It outlines how event behaviors like Stay Put, Move, Snap, and Retire should be handled for various complex shape scenarios and specifies testing and documentation requirements.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-realign-route.md>) — similar text 0.80 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:836 s=11.785 -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-retire-route.md>) — similar text 0.69 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 s=10.963 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-extend-route.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:839 s=10.647 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-cartographic.md>) — similar text 0.72 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:838 s=10.398 -->
- [Support Event Behaviors on Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-calibrate-route.md>) — similar text 0.64 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:840 s=10.191 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Story
### Support Event Behaviors on Complex Route Shapes in Reassign Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are reassigned in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the reassigned route(s) have their measures and shapes kept up to date.

![Figure 1 — User Story](../media/support-eb-on-complex-route-shapes-in-reassign-route/fig-01-slide-02-user-story.svg)
[connections: (ellipse 19) — (ellipse 18)]

## Acceptance Criteria
### Reassign Route Event Behaviors <!-- slide 3 -->
- When reassigning a complex route, continue to write to the edit log as we do today
- Reassignments can result in the following for both the source and target routes:
  - Non complex shapes become complex
  - Complex shapes remain complex
  - Complex shapes become a different type of complex shape
  - Complex shapes become non complex
- For each of these scenarios, we should continue to apply Reassign Route Event Behaviors the same way, even if the realignment could result in the route type changing:
  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Snap, move the event features to the concurrent/abandoned route, update the route and measure if needed
  - For Retire, retire the event if it’s impacted by the edit
- Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
- Consider the recalibrate downstream and calibrate event behavior will apply to the downstream events if checked
- Should work for complex shape type test cases from the Reassign Complex Route shapes user story
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
- Add a note to reassign route event behavior topic to mention complex shapes being supported

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
Test Plan PE:
