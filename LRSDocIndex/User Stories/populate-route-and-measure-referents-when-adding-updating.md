# Populate Route and Measure Referents When Adding/Updating LRS Events

| Field | Value |
| --- | --- |
| **Doc** | 631 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AddEventsPopulateRteMeasReferents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddEventsPopulateRteMeasReferents.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2022-09-21 02:54 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | referent · event editing · route · measure · lrs editor · input method |
| **Tools** | apply edits |

## Summary

This document describes a user story for LRS editors to capture how events were originally collected by populating referent fields when adding or updating events. It covers the need to store network, routeID, and measure information as referents for events added or updated via route and measure input methods in Pro tools. Testing includes verifying behavior with point, line, and spanning events with and without referents configured.

## Related documents

<!-- related:begin -->
- [Add Line Events Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-point-offset-method.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:268 s=3.639 -->
- [Add Line Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tools-coordinate-offset-method.md>) — similar text 0.17 · 2 filename words · same kind/surface/folder <!-- rel:648 s=3.53 -->
- [Add Point Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-tools-coordinate-offset-method.md>) — similar text 0.18 · 2 filename words · same kind/surface/folder <!-- rel:658 s=3.427 -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method.md>) — similar text 0.24 · 1 filename word · same kind/surface/folder <!-- rel:269 s=3.41 -->
- [Add Single Point Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-single-point-event-tool-in-pro.md>) — similar text 0.17 · 1 filename word · same kind/surface/folder <!-- rel:688 s=3.319 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [apply edits](https://www.google.com/search?q=%22apply%20edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Populate route and measure referents when adding/ updating LRS events <!-- slide 1 -->

### User Story <!-- slide 2 -->
As an LRS editor, I want the information about how I created an event captured in the referent field, so that I can continue to reference how the event was originally collected as it changes over time.

Persona
LRS Editor: This user is responsible for making edits to the LRS (routes and/or events).  For event edits, the organization may model referents on event layers in order to capture how the event was originally collected in the field (coordinates, intersection offset, etc.).  When adding new events/updating existing events via in Pro to event layers with referents configured, we need to populate the referent.  This includes if the input method is route and measure or there is no input method like in the core tools.

## Acceptance Criteria
### Populate route and measure referent info <!-- slide 3 -->
- When LRS event(s) are added by either typing/updating the route/measure or using the route and measure method and the event layer has referents configured, we should populate/update referent information
- When the input method for the new event(s) in the 4 event editing tools on the LocRef ribbon are route and measure, store the network, routeID, and measure as the referent information for the event
- Do the same when adding a new event using the core tools or updating an existing event via editing tools/attribute table (use whatever route and measure is sent via apply edits to populate the referents)
- Note that the other methods are being addressed in their respective user stories (coordinates, intersection offset, etc.) for the event editing tools on the LocRef ribbon

## Testing
<!-- slide 4 -->
- Test with point, line, and spanning events with referents configured
- Verify that tools work the same as today on events without referents configured
- Verify in the core tools and the event editing tools on the LocRef ribbon

## Automation
<!-- slide 5 -->
Update existing ReadyAPI and UI automation

## Documentation
<!-- slide 6 -->

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
