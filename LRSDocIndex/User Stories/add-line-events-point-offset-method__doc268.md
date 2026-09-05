# Add Line Events Point Offset Method

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [AddLineEventPointOffsetMethod.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddLineEventPointOffsetMethod.pptx>) |
| **Edited** | 2024-12-17 01:27 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Add Line Events Point Offset Method"
source_file: "AddLineEventPointOffsetMethod.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddLineEventPointOffsetMethod.pptx"
doc_id: 268
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2024-12-17T01:27:32Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["line event", "point event", "location offset", "offset distance", "lrs editor", "add line events tool"]
tools: ["Add Line Events", "Multiple Line Events"]
products: []
issues: []
related: [{"doc":272,"file":"add-point-event-point-offset-method__doc272.md","s":9.068},{"doc":269,"file":"add-line-event-length-method__doc269.md","s":7.424},{"doc":679,"file":"add-event-intersection-offset-method__doc679.md","s":6.949},{"doc":177,"file":"experience-builder-referent-method-in-add-point-and-line-widgets__doc177.md","s":6.662},{"doc":648,"file":"add-line-event-tools-coordinate-offset-method__doc648.md","s":6.624}]
```
-->

## Summary

This user story describes the need for LRS Editors to add line events in ArcGIS Pro using offsets from point features such as mile markers or weld points. It details enhancements to the Add Line and Multiple Line Events tools to support selecting point layers and entering offset distances, including UI behavior and validation rules. Testing, automation, and documentation updates are also outlined to support this functionality across various network and event types.

## Related documents

<!-- related:begin -->
- [Add Point Event Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-point-offset-method__doc272.md>) — similar text 0.82 · 4 title words · 5 filename words · same kind/surface/folder <!-- rel:272 -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method__doc269.md>) — similar text 0.52 · 3 title words · 4 filename words · same kind/surface/folder <!-- rel:269 -->
- [Add Event Intersection Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-event-intersection-offset-method__doc679.md>) — similar text 0.46 · 3 title words · 4 filename words · same kind/surface/folder <!-- rel:679 -->
- [Experience Builder Referent method in Add Point and Line widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-referent-method-in-add-point-and-line-widgets__doc177.md>) — similar text 0.28 · 4 title words · 5 filename words · same kind/folder <!-- rel:177 -->
- [Add Line Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tools-coordinate-offset-method__doc648.md>) — similar text 0.34 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:648 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html)

_No page matched:_ [Add Line Events](https://www.google.com/search?q=%22Add%20Line%20Events%22+site%3Adoc.esri.com) · [Multiple Line Events](https://www.google.com/search?q=%22Multiple%20Line%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Add Line Events Point Offset Method

User Story

## Slide 2 — User Story

As an LRS Editor, I need the capability to add line events in ArcGIS Pro based on offsets from point features, so that I can locate new events from the field that come in via this collection method.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For some users, their event data comes in via offsets from other point locations (like mile markers or weld points).  Users want to be able to locate events by entering this information.

## Slide 3 — Add Line Events tools

In the Add Line and Multiple Line Events tools, expand the existing Location Offset method to include LRS Point Events and other point.  The method should continue to be available for both the from and to method.
Continue to only show this option if there are point events/intersections/other point layers in the map (that are not Calibration Points)
After transitioning to the next pane, show the same UI as in the Intersection user story, except add a parameter called Point Layer between Route and Location.  Note that the From and To Methods should be separate because they can be different (i.e., From is Coordinates and To is Location Offset)
For the Point Layer, show all the LRS Intersections, LRS Point Events, and other Point Feature Layers in the service with the LRS that is in the map
Organize the point layer drop down to three sections (Intersections, Point Events, other Point Features).  Make the titles of the sections italicized or different in some other way from the layers in the map to select, but unselectable.  See the attribute set configuration drop down code for examples.
If the user selects Location Offset for both the From and To method, show the same starting layer.  If they change the From method layer, also change the To method layer.
For Location, allow the user to either type the feature name (use the OID except for LRS Intersections where we use the Intersection Name) or use the picker to select it from the map
If picked on the map, the feature must be on the route that was populated in the UI, otherwise don’t select it
Once the feature is selected, blink 3 times on the map but don’t keep it highlighted/selected on the map in any other way
If the same method is selected for both the From and To, when a From location is selected, populate the same location for the To method.
If for some reason there is more than one point feature at the clicked location, provide a select experience so the user chooses one of the features to use
If the user types the feature name, provide an intellisense experience.  If the feature isn’t on the route, show an error.

## Slide 4 — Add Line Events tools

For Offset, allow the user to type the distance (with or without direction) or use the picker to select it from the map
Show the offset location(s) with the same markers for the tools today
If no direction is selected, assume the measure is a positive offset from the feature location
If a negative offset value is populated, treat that as a negative offset from the feature location
If the user changes the unit of measure and there is already a measure populated, update the location of the marker on the map
The user can type the offset value first even if the feature location hasn’t been selected (but can’t use the picker on the map).  Once the feature location is selected, show the marker on the map for the offset value location.
If the event(s) layers that have event records being added to them have referent fields configured with the LRS, we should populate the referents with the Method: Feature Class Name Offset, Location: OID of feature, and Offset: Offset value populated in the tool (note that the referent unit could be different and need to be converted from what was in the Add Event tool) (This should match what we did when adding these types of events using Event Editor)
If there feature class is not an LRS Event, it needs to be added to the dReferentMethod domain.  If it’s not present, then we should default back to route/measure for the referents.
If a route goes exactly in two cardinal directions (exactly N-S for example) and a user tries to use one of the other cardinal directions (E-W), then ignore the cardinal direction and default to the offset value to determine where to locate the event
If a user selects a cardinal direction, don’t allow them to type a negative offset value
Continue to maintain existing validations for the Intersection feature class

## Slide 5 — Testing

Test with both add event tools (mix and match test cases between the tools)
Test with a mix of LRS point events and regular point feature layers as the offset layer
Test with a mix of spanning and non spanning event types
Validate Intersections continue to work as well
Test on a variety of network types (mix and match between Line, NonLine with multifield RouteID, NonLine with singlefield RouteID, NonLine with autogenerated RouteID)
Make sure to test with both Projected and Unprojected data
Feature Service testing only (no need to worry about direct connect or fgdb)
Test offsetting from point features on the following route types

  - Normal
  - Gapped (with different calibration on the ends)
  - Lollipops
Test with and without the direction
Test with and without referents configured for an event
Test scenario where the point offset is not on the route
Test scenario where the point offset is on a different route than the one selected
508/i18n testing

## Slide 6 — Automation

Add a few UI automation cases for LRS Point Events and other point layers
Existing UI automation for Intersections might need to be updated due to the new parameter

## Slide 7 — Documentation

Update the existing topic
Make sure to mention that intersections, point events, and other point features are now supported
PE and Kyle to determine best way to restructure the documentation

## Slide 8 — Assignment

Story Points:
Dev:
PE:
