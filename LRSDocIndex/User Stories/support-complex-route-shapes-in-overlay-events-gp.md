# Support Complex Route Shapes in Overlay Events GP tool

| Field | Value |
| --- | --- |
| **Doc** | 799 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [OverlayEventsComplexRouteShapes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OverlayEventsComplexRouteShapes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-05-28 00:05 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex route · overlay events · dynamic segmentation · route shape · line network · non line network |
| **Tools** | Overlay Events |

## Summary

This document describes a user story for supporting overlay events located on complex routes in the Overlay Events geoprocessing tool. It specifies requirements for correct route and measure handling, shape building, and impacts on the Query Attribute Set REST endpoint. Testing scenarios include various complex route shapes and network types, with automation planned via Python tests.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Translate Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-translate-events-gp.md>) — similar text 0.53 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:798 s=8.32 -->
- [Support Complex Route Shapes in Generate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-events.md>) — similar text 0.24 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:848 s=7.029 -->
- [Support Complex Route Shapes in Derive Event Measures GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-derive-event-measures-gp.md>) — similar text 0.35 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:780 s=6.689 -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp.md>) — similar text 0.54 · 5 title words · 2 filename words · same kind/surface/folder <!-- rel:765 s=6.483 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-reassign-route.md>) — similar text 0.34 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:837 s=6.2 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex scenarios for route calibration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-scenarios-for-route-calibration.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Complex Route Shapes in Overlay Events GP tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways editor, I need to be able to overlay events that are located on a complex route, so that they dynamically segment correctly like events on non complex routes.

## Acceptance Criteria
### Route with Route in Overlay Events <!-- slide 3 -->
- In the overlay events GP tool, events that are located on complex routes need to be supported.
- Complex routes themselves need to be supported as well since the network feature class is an input in the tool.
- When an event from an complex route is overlaid, make sure the tool does the following:
  - The correct From RouteID, To RouteID (if line network), From Measure, To Measure, and From Date, To Date should be applied to the output record
  - The correct shape should be built (if the output format is a feature class), which begins/ends at the correct locations on the route
- This will also impact the Query Attribute Set REST endpoint since the code is shared
Input events on complex route				Overlaid events on complex route

[figure: Ev1 · Ev2 · Ev3 · Ev2,3 · Ev1,2 · Ev1,2,3]

![Figure 1 — Route with Route in Overlay Events](../media/support-complex-route-shapes-in-overlay-events-gp/fig-01-slide-03-route-with-route-in-overlay-events.svg)

## Testing
<!-- slide 4 -->
- Test the following scenarios:
  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network (events spanning routes)
  - Test events that go from begin-end, begin-middle, middle-middle, and middle-end
- Will also need to verify the behavior in the Query Attribute Set REST endpoint

## Automation
<!-- slide 5 -->
Python – Add a set of tests for complex route shapes in the same manner as the non-complex, gapped route, and postmile tests in place today

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
PE:
