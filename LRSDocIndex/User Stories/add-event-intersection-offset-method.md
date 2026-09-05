# Add Event Intersection Offset Method

| Field | Value |
| --- | --- |
| **Doc** | 679 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AddEventIntersectionOffsetMethod.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddEventIntersectionOffsetMethod.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2022-02-15 19:40 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event editing · intersection offset · offset · route · location · lrs editor |
| **Tools** | Add Point · Multiple Point · Line · Multiple Line |

## Summary

This user story describes the need for LRS Editors to add events in ArcGIS Pro using offsets from intersections. It details the user interface changes for adding point and line events with an intersection offset method and outlines testing, automation, and documentation requirements.

## Related documents

<!-- related:begin -->
- [Add Point Event Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-point-offset-method.md>) — similar text 0.54 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:272 s=7.952 -->
- [Add Line Event Tools – Intersection Location Offset Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3910-add-line-event-tools-intersection-location-offset-method.md>) — similar text 0.18 · 5 title words · 5 filename words <!-- rel:618 s=6.959 -->
- [Add Line Events Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-point-offset-method.md>) — similar text 0.46 · 3 title words · 4 filename words · same kind/surface/folder <!-- rel:268 s=6.949 -->
- [Add Point Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-tools-coordinate-offset-method.md>) — similar text 0.40 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:658 s=6.438 -->
- [Add Line Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tools-coordinate-offset-method.md>) — similar text 0.40 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:648 s=6.312 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html) · [Lines](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-a-line.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Location errors](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/location-errors.html)

_No page matched:_ [Multiple Point](https://www.google.com/search?q=%22Multiple%20Point%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Add Event Intersection Offset Method <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need the capability to add events in ArcGIS Pro based on offsets from an intersection, so that I can locate new events from the field that come in via this collection method.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For some users, their event data comes in via offsets from road and other intersection locations.  Users want to be able to locate events by entering this information.

## Acceptance Criteria
### Add Point/Lines Events tools <!-- slide 3 -->
- In the Add Point, Multiple Point, Line, and Multiple Line, support a method called Intersection Offset
- Add this method as an option to all 4 tools when they’re initially opened
- All mockups can be found at https://www.figma.com/file/Y3dXxrZtsLFcObC1PdABxS/Point%2FLine-Event-Editing-UX%2FUI?node-id=97%3A2347

![Figure 1 — Add Point/Lines Events tools](../media/add-event-intersection-offset-method/fig-01-slide-03-add-point-lines-events-tools.png)

### Add Point/Lines Events tools <!-- slide 4 -->
- After transitioning to the next pane, show the same UI as in the previous 4 user stories, except instead of showing Route and Measure, show Route, Location, and Offset.
- For Location, allow the user to either type the Intersection Name or use the picker to select it from the map
- For Offset, allow the user to type the measure (with or without direction) or use the picker to select it from the map
- Show the offset location(s) with the same markers for the tools today
- If no direction is selected, assume the measure is a positive offset from the Intersection location
- If a negative offset value is populated, treat that as a negative offset from the Intersection location
- If the user changes the unit of measure and there is already a measure populated, update the location of the marker on the map
- The user can type the offset value first even if the Intersection location hasn’t been selected (but can’t use the picker on the map).  Once the Intersection location is selected, show the marker on the map for the offset value location.

![Figure 2 — Add Point/Lines Events tools](../media/add-event-intersection-offset-method/fig-02-slide-04-add-point-lines-events-tools.png)
![Figure 3 — Add Point/Lines Events tools](../media/add-event-intersection-offset-method/fig-03-slide-04-add-point-lines-events-tools.png)

## Testing
<!-- slide 5 -->
- Test with a 4 add event tools
- Test on a variety of network types (Line, NonLine with multifield RouteID, NonLine with singlefield RouteID, NonLine with autogenerated RouteID)
- Test on both spanning and non spanning events
- Feature Service testing only (no need to worry about direct connect or fgdb)
- Test offsetting from intersections on the following route types
  - Normal
  - Gapped (include different gap calibration methods)
  - Loops
  - Lollipops
  - Alpha
  - Branch
  - Vertical
- Test with and without the direction
- 508/i18n testing

## Automation
<!-- slide 6 -->
- Create a 1-2 UI test cases for the tool

## Documentation
<!-- slide 7 -->
- Create a new topic called Adding Events via Intersection Offset method
- Follow the format of the existing Event Editor topic

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
