# Support Vertical Route Segments in Translate Events GP Tool

| Field | Value |
| --- | --- |
| **Doc** | 767 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [TranslateEventsVerticalRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/TranslateEventsVerticalRoutes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-08-06 23:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical segment · vertical gap · translate events · route · measure |
| **Tools** | Translate Events |

## Summary

This document describes a user story for supporting translation of events located on routes with vertical segments or gaps using the Translate Events geoprocessing tool. It specifies requirements for correct route and measure handling during event translation on complex route shapes, including vertical segments and gaps, for both line and non-line networks. Testing scenarios, automation with Python tests, and documentation updates are outlined to ensure proper functionality.

## Related documents

<!-- related:begin -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp.md>) — similar text 0.71 · 6 title words · 3 filename words · same kind/surface/folder <!-- rel:765 s=8.661 -->
- [Support Complex Route Shapes in Translate Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-translate-events-gp.md>) — similar text 0.43 · 5 title words · 2 filename words · same kind/surface/folder <!-- rel:798 s=6.625 -->
- [Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-vertical-route-segments-3d-interpolation-in-update.md>) — similar text 0.54 · 5 title words · 1 filename word · same kind/surface/folder <!-- rel:746 s=6.241 -->
- [Support Vertical Segments in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-segments-in-append-routes.md>) — similar text 0.40 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:768 s=5.884 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.32 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:758 s=5.146 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Translate Events](https://www.google.com/search?q=%22Translate%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Vertical Route Segments in Translate Events GP tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need to be able to translate events that are located on a route with vertical segments/gaps, so that their measures translate correctly like events on non vertical routes.

## Acceptance Criteria
### Translate Events on Complex Shapes <!-- slide 3 -->
- In the translate events GP tool, events that are located on routes with vertical segments/gaps need to be supported.
- When an event from an route with a vertical segment/gap is translated, make sure the tool does the following:
  - The correct From RouteID, To RouteID (if line network), From Measure, To Measure, and From Date, To Date should be applied to the output record
  - The correct shape should be built, which begins/ends at the correct locations on the route with a shape that encompasses the entire length of the route between those two points

## Testing
<!-- slide 4 -->
- Test the following scenarios:
  - Route with vertical segment
  - Route with vertical gap
  - Line Network
  - Non Line Network
  - Test events that go across an entire vertical segment, across an entire vertical gap, are completely on a vertical segment, start in a vertical segment and end beyond it, start before a vertical segment and ends on the vertical segment
- Test plan will need to include both inputs and outputs, including measures, for all cases

## Automation
<!-- slide 5 -->
Python – Add a set of tests for routes with vertical segments/gaps in the same manner as the non vertical tests in place today

## Documentation
<!-- slide 6 -->
Add a usage note to the Translate Events topic mentioning support for vertical segments/gaps

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
