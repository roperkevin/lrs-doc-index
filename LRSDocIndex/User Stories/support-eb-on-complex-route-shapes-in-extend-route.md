# Support Event Behaviors on Complex Route Shapes in Extend Route

| Field | Value |
| --- | --- |
| **Doc** | 839 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [ComplexRouteShapesEventBehaviorExtend.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorExtend.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-01-06 16:58 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event behavior · complex route shape · extend route · loop · lollipop · alpha route · branch route · barbell route |
| **Tools** | — |

## Summary

This document describes a user story for applying event behaviors to complex route shapes extended in Roads and Highways, including loops, lollipops, alpha, and branched routes. It outlines the expected behaviors for Stay Put, Move, and Retire event behaviors during route extension and specifies testing scenarios for various complex shapes in both line and non-line networks. It also includes notes on documentation updates and automation testing.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-reassign-route.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:837 s=10.647 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-realign-route.md>) — similar text 0.61 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:836 s=10.59 -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-retire-route.md>) — similar text 0.70 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 s=10.224 -->
- [Support Event Behaviors on Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-calibrate-route.md>) — similar text 0.68 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:840 s=10.155 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-cartographic.md>) — similar text 0.54 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:838 s=9.849 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html)
<!-- docs:end -->

---

## Story
### Support Event Behaviors on Complex Route Shapes in Extend Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are extended in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the extended route have their measures and shapes kept up to date.

![Figure 1 — User Story](../media/support-eb-on-complex-route-shapes-in-extend-route/fig-01-slide-02-user-story.svg)
[connections: (ellipse 19) — (ellipse 18)]

## Acceptance Criteria
### Extend Route Event Behaviors <!-- slide 3 -->
- When extending a complex route (at the beginning or end), continue to write to the edit log as we do today
- Since the route can only be extended at the beginning/end and the segment where existing measures exist can only have its measures changed, follow the same pattern like when a simple route geometry is extended.
  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
- Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
- Consider the recalibrate downstream is now exposed and calibrate event behavior will apply to the downstream events
- Should work for all the test cases from the Extend Complex Route shapes user story
- Works in both non line and line networks (no Postmile as they don’t have events)

## Testing
<!-- slide 4 -->
Positive (for both existing and newly created complex shapes)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network
  - All examples from Extend Route Complex Shapes test plan
Negative

  - LocErrors for partial matches
Automation

  - Python – Add a set of tests for complex route shapes in the same manner as the non-complex and gapped route shape tests in place today

## Documentation
<!-- slide 5 -->
- Add a note to extend route event behavior topic to mention complex shapes being supported

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
Test Plan PE:
