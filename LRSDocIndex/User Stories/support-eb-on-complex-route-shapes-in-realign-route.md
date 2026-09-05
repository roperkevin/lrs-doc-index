# Support Event Behaviors on Complex Route Shapes in Realign Route

| Field | Value |
| --- | --- |
| **Doc** | 836 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [ComplexRouteShapesEventBehaviorRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorRealign.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-01-16 18:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex shape · realign route · event behavior · roads and highways · loop · lollipop · alpha route · branch route · barbell |
| **Tools** | — |

## Summary

Describes the need for Roads and Highways editors to apply event behaviors on complex route shapes such as loops, lollipops, alpha, and branched routes during realignment or abandonment. Specifies how event behaviors like Stay Put, Move, and Retire should be applied to maintain event measures and shapes. Includes testing scenarios for various complex shapes and networks, and documentation updates.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-reassign-route.md>) — similar text 0.80 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:837 s=11.785 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-cartographic.md>) — similar text 0.73 · 6 title words · 6 filename words · same kind/surface/folder <!-- rel:838 s=10.919 -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-retire-route.md>) — similar text 0.67 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 s=10.771 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-extend-route.md>) — similar text 0.61 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:839 s=10.59 -->
- [Support Event Behaviors on Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-calibrate-route.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:840 s=10.338 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Story
### Support Event Behaviors on Complex Route Shapes in Realign Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are realigned/abandoned in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the realigned/abandoned route have their measures and shapes kept up to date.

![Figure 1 — User Story](../media/support-eb-on-complex-route-shapes-in-realign-route/fig-01-slide-02-user-story.svg)
[connections: (ellipse 19) — (ellipse 18)]

## Acceptance Criteria
### Realign Route Event Behaviors <!-- slide 3 -->
- When realigning/abandoning a complex route, continue to write to the edit log as we do today
- Realignments can result in the following:
  - Non complex shapes become complex
  - Complex shapes remain complex
  - Complex shapes become a different type of complex shape
  - Complex shapes become non complex
- For each of these scenarios, we should continue to apply Realign Route Event Behaviors the same way, even if the realignment could result in the route type changing
  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
- Abandoned portions of route should be handled the same way they are today for non complex route shapes
- Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
- Consider the recalibrate downstream and calibrate event behavior will apply to the downstream events if checked
- Should work for complex shape type test cases from the Realign Complex Route shapes user story
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
  - Line Network
  - Test begin-end, begin-middle, middle-middle, and middle-end
Negative

  - LocErrors for partial matches
Automation

  - Python – Add a set of tests for complex route shapes in the same manner as the non-complex and gapped route shape tests in place today

## Documentation
<!-- slide 5 -->
- Add a note to realign route event behavior topic to mention complex shapes being supported

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
Test Plan PE:
