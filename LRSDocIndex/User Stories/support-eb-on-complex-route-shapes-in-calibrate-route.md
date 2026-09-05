# Support Event Behaviors on Complex Route Shapes in Calibrate Route

| Field | Value |
| --- | --- |
| **Doc** | 840 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [ComplexRouteShapesEventBehaviorCalibrate.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorCalibrate.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-01-07 21:53 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex shape · event behavior · calibrate route · route calibration · loop route · branched route · event measures |
| **Tools** | — |

## Summary

This document describes a user story for applying event behaviors on complex calibrated route shapes such as loops, lollipops, alpha, and branched routes in Roads and Highways. It details how event measures and shapes should be updated during calibration, including behavior rules for Stay Put, Move, and Retire. Testing scenarios cover various complex shapes and network types, with automation planned via Python tests.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-retire-route.md>) — similar text 0.72 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 s=10.422 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-realign-route.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:836 s=10.338 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-reassign-route.md>) — similar text 0.64 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:837 s=10.191 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-extend-route.md>) — similar text 0.68 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:839 s=10.155 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-cartographic.md>) — similar text 0.55 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:838 s=9.553 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [calibrate route](https://www.google.com/search?q=%22calibrate%20route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Event Behaviors on Complex Route Shapes in Calibrate Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are calibrated in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the calibrated route have their measures and shapes kept up to date.

![Figure 1 — User Story](../media/support-eb-on-complex-route-shapes-in-calibrate-route/fig-01-slide-02-user-story.svg)
[connections: (ellipse 19) — (ellipse 18)]

## Acceptance Criteria
### Calibrate Route Event Behaviors <!-- slide 3 -->
- When calibrating a complex route, continue to write to the edit log as we do today
- Remember that recalibration downstream will result in a calibrate record in the edit log
- For calibration, the shape of the route doesn’t change, but the measures do. When a calibration edit takes place (either by adding/editing/deleting a CP or through recalibration downstream from another edit type), continue to apply event behaviors in the same way we do today.
  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
- Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
- Should work for all the test cases from the Calibrate Complex Route shapes user story
- Works in both non line and line networks (no Postmile as they don’t have events)

## Testing
<!-- slide 4 -->
Positive (for existing complex shapes)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network
  - All examples from Calibrate Route Complex Shapes test plan
Negative

  - LocErrors for partial matches
Automation

  - Python – Add a set of tests for complex route shapes in the same manner as the non-complex and gapped route shape tests in place today

## Documentation
<!-- slide 5 -->
- Add a note to calibrate route event behavior topic to mention complex shapes being supported

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
Test Plan PE:
