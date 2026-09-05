# Add Point Event Point Offset Method

| Field | Value |
| --- | --- |
| **Doc** | 272 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AddPointEventPointOffsetMethod.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddPointEventPointOffsetMethod.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2024-12-12 17:00 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | point event · point offset · offset method · route · referent · location · event editing |
| **Tools** | Add Point Event · Multiple Point Event |

## Summary

Describes a user story for LRS Editors to add point events in ArcGIS Pro using offsets from point features. Details the UI and functionality for selecting point layers, locations, and offsets, including validation and behavior for different route types and directions. Includes testing scenarios and documentation requirements.

## Related documents

<!-- related:begin -->
- [Add Line Events Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-point-offset-method.md>) — similar text 0.82 · 4 title words · 5 filename words · same kind/surface/folder <!-- rel:268 s=9.068 -->
- [Add Event Intersection Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-event-intersection-offset-method.md>) — similar text 0.54 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:679 s=7.952 -->
- [Add Point Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-tools-coordinate-offset-method.md>) — similar text 0.40 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:658 s=7.264 -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method.md>) — similar text 0.51 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:269 s=6.575 -->
- [Add Line Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tools-coordinate-offset-method.md>) — similar text 0.37 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:648 s=6.094 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Location errors](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/location-errors.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Multiple Point Event](https://www.google.com/search?q=%22Multiple%20Point%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Add Point Event Point Offset Method <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need the capability to add point events in ArcGIS Pro based on offsets from point features, so that I can locate new events from the field that come in via this collection method.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For some users, their event data comes in via offsets from other point locations (like mile markers or weld points).  Users want to be able to locate events by entering this information.

## Acceptance Criteria
### Add Point Event tools <!-- slide 3 -->
- In the Add Point and Multiple Point Event tools, support a method called Point Offset
- Add this method as a drop-down option to both tools when they’re initially opened
- Only show this option if there are point events/other point layers in the map (that are not LRS Intersections)
- After transitioning to the next pane, show the same UI as in the previous user stories, except instead of showing Route and Measure, show Route, Point Layer, Location, and Offset.
- Show a label with the method “Point Offset” above the RouteID/Name like was done for Route and Measure method
- For Point Layer, include all the point layers in the LRS service, this can include both LRS Events and regular point feature layers

![Figure 1 — Add Point Event tools](../media/add-point-event-point-offset-method/fig-01-slide-03-add-point-event-tools.png)

### Add Point Events tools <!-- slide 4 -->
- For Location, allow the user to either type the feature name (we should use whatever field is configured as the display field for the layer) or use the picker to select it from the map
- If picked on the map, the feature must be on the route that was populated in the UI, otherwise don’t select it
- Once the feature is selected, blink 3 times on the map but don’t keep it highlighted/selected on the map in any other way
- If for some reason there is more than one point feature at the clicked location, provide a select experience (needs to have the name from the display field) so the user chooses one of the features to use
- If the user types the feature name, provide an intellisense experience.  If the feature isn’t on the route, show an error.
- For Offset, allow the user to type the distance (with or without direction) or use the picker to select it from the map
- Show the offset location(s) with the same markers for the tools today
- If no direction is selected, assume the measure is a positive offset from the feature location
- If a negative offset value is populated, treat that as a negative offset from the feature location
- If the user changes the unit of measure and there is already a measure populated, update the location of the marker on the map
- The user can type the offset value first even if the feature location hasn’t been selected (but can’t use the picker on the map).  Once the feature location is selected, show the marker on the map for the offset value location.
- If the event(s) layers that have event records being added to them have referent fields configured with the LRS, we should populate the referents with the Method: Feature Class Name Offset, Location: OID of feature, and Offset: Offset value populated in the tool (note that the referent unit could be different and need to be converted from what was in the Add Event tool) (This should match what we did when adding these types of events using Event Editor)
- If there feature class is not an LRS Event, it needs to be added to the dReferentOffset domain.  If it’s not present, then we should default back to route/measure for the referents.
- If a route goes exactly in two cardinal directions (exactly N-S for example) and a user tries to use one of the other cardinal directions (E-W), then ignore the cardinal direction and default to the offset value to determine where to locate the event
- If a user selects a cardinal direction, don’t allow them to type a negative offset value

## Testing
<!-- slide 5 -->
- Test with both add event tools (mix and match test cases between the tools)
- Test with a mix of LRS point events and regular point feature layers as the offset layer
- Test on a variety of network types (mix and match between Line, NonLine with multifield RouteID, NonLine with singlefield RouteID, NonLine with autogenerated RouteID)
- Make sure to test with both Projected and Unprojected data
- Feature Service testing only (no need to worry about direct connect or fgdb)
- Test offsetting from point features on the following route types
  - Normal
  - Gapped (include different gap calibration methods)
  - Loops
  - Lollipops
  - Alpha
  - Branch
  - Vertical
- Test with and without the direction
- Test with and without referents configured for an event
- Test scenario where the point offset is not on the route
- Test scenario where the point offset is on a different route than the one selected
- 508/i18n testing

## Automation
<!-- slide 6 -->

## Documentation
<!-- slide 7 -->
- Create a new topic called Add Events via Point Offset method
- Make sure to mention how any point layer in the service can be used for offsetting
- Follow the format of the existing Event Editor topics

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
