# Support Vertical Route Segments in Overlay Events GP tool

| Field | Value |
| --- | --- |
| **Doc** | 765 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [OverlayEventsVerticalRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OverlayEventsVerticalRoutes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-08-06 23:23 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical segment · vertical gap · overlay events · route · dynamic segmentation |
| **Tools** | Overlay Events |

## Summary

This user story describes the need to support overlaying events located on routes with vertical segments or gaps in the Overlay Events geoprocessing tool. It specifies requirements for correct route and measure attributes in output and the impact on the Query Attribute Set REST endpoint. Testing scenarios and automation updates are outlined to validate this functionality.

## Related documents

<!-- related:begin -->
- [Support Vertical Route Segments in Translate Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-translate-events-gp.md>) — similar text 0.71 · 6 title words · 3 filename words · same kind/surface/folder <!-- rel:767 s=8.661 -->
- [Support Complex Route Shapes in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-overlay-events-gp.md>) — similar text 0.54 · 5 title words · 2 filename words · same kind/surface/folder <!-- rel:799 s=6.483 -->
- [Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-vertical-route-segments-3d-interpolation-in-update.md>) — similar text 0.54 · 5 title words · 1 filename word · same kind/surface/folder <!-- rel:746 s=6.106 -->
- [Support Vertical Segments in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-segments-in-append-routes.md>) — similar text 0.40 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:768 s=5.878 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.30 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:758 s=4.953 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Vertical Route Segments in Overlay Events GP tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need to be able to overlay events that are located on routes with vertical segments, so that they dynamically segment correctly like events on non vertical routes.

## Acceptance Criteria
### Vertical Segments/Gaps in Overlay Events <!-- slide 3 -->
- In the overlay events GP tool, events that are located on vertical segments/gaps need to be supported.
- Vertical routes themselves need to be supported as well since the network feature class is an input in the tool.
- When an event from a route with vertical segment/gap is overlaid, make sure the tool does the following:
  - The correct From RouteID, From Measure, To Measure, and From Date, To Date should be applied to the output record
  - The correct shape should be built (if the output format is a feature class), which begins/ends at the correct locations on the route
- This will also impact the Query Attribute Set REST endpoint since the code is shared

## Testing
<!-- slide 4 -->
- Test the following scenarios:
  - Route with vertical segment
  - Route with vertical gap
  - Line Network
  - Non Line Network
  - Test events that go across an entire vertical segment, across an entire vertical gap, are completely on a vertical segment, start in a vertical segment and end beyond it, start before a vertical segment and ends on the vertical segment
- Will also need to verify the behavior in the Query Attribute Set REST endpoint
- Test plan will need to include both inputs and outputs, including measures, for all cases

## Automation
<!-- slide 5 -->
Add vertical segment/gaps cases to the existing python automation for Overlay Events

## Documentation
<!-- slide 6 -->
Add a usage note to the Overlay Events topic mentioning support for vertical segments/gaps

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
