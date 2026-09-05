# Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool

| Field | Value |
| --- | --- |
| **Doc** | 746 · User Story · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [UpdateMeasuresfromLRSVerticalRoutes_3D.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/UpdateMeasuresfromLRSVerticalRoutes_3D.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-12-01 20:23 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical segment · 3d interpolation · update measures · route · event · derived network · un apr dataset |
| **Tools** | Update Measures from LRS |

## Summary

This document describes the need to support routes and measures from events located on vertical route segments in the Update Measures from LRS geoprocessing tool. It outlines user requirements, testing scenarios including vertical segments and gaps, automation testing plans, and documentation updates.

## Related documents

<!-- related:begin -->
- [Support Vertical Route Segments in Translate Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-translate-events-gp.md>) — similar text 0.54 · 5 title words · 1 filename word · same kind/surface/folder <!-- rel:767 s=6.666 -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp.md>) — similar text 0.54 · 5 title words · 1 filename word · same kind/surface/folder <!-- rel:765 s=6.537 -->
- [Support Vertical Segments in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-segments-in-append-routes.md>) — similar text 0.34 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:768 s=5.001 -->
- [Support Complex Route Shapes in Update Measures from LRS GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-update-measures-from-lrs-gp.md>) — similar text 0.17 · 4 title words · 1 filename word · same kind/surface/folder <!-- rel:779 s=4.794 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.31 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:758 s=4.708 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need to be able to get routes and measures from events that are located on routes with vertical segments, so that they can be shared for analysis and other processes correctly like events on non vertical routes.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs), but are typically called as-builts.  The LRS Editor is responsible for making the route edits based on the as-builts.  In addition to making the route edits, they would also Apply Event Behaviors and be responsible for updating derived events.  In the case where there is a UN, they would also run the Update Measures from LRS tool to ensure they get measures onto UN features like Devices and Junctions.

## Acceptance Criteria
### Vertical Segments/Gaps in Update Measures from LRS <!-- slide 3 -->
- In the Update Measures from LRS GP tool, events that are located on vertical segments/gaps need to be supported.
- If the beginning/end of the event record is on a vertical segment of a route, get the correct Route ID and measure from the vertical segment.
- Make sure the measure is interpolated in 3D (assuming Z values are present).  We should do this whether the Route/Measure being determined is for an event record on a vertical or non vertical route segment.

## Testing
<!-- slide 4 -->
- Test the following scenarios:
  - Get measures from Line, Non Line, and Derived Networks
  - Include events spanning routes
  - Test events that go across an entire vertical segment, across an entire vertical gap, are completely on a vertical segment, start in a vertical segment and end beyond it, start before a vertical segment and ends on the vertical segment, start/end on the beginning/end of the vertical segment
- Test plan will need to include both inputs and outputs, including measures, for all cases
- Can test using the existing datasets for vertical segment/3D testing, but make sure to test at least one case with a UN-APR dataset

## Automation
<!-- slide 5 -->
Add python automation tests for vertical segments for Update Measures from LRS tool

## Documentation
<!-- slide 6 -->
Add a usage note to the Update Measures from LRS topic mentioning support for vertical segments/gaps

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
