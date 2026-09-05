# Add Line Event Length Method

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [AddLineEventLengthMethod.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddLineEventLengthMethod.pptx>) |
| **Edited** | 2024-12-17 01:27 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Add Line Event Length Method"
source_file: "AddLineEventLengthMethod.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AddLineEventLengthMethod.pptx"
doc_id: 269
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2024-12-17T01:27:01Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["line event", "length method", "to method", "lrs editor", "event tools", "referent"]
tools: ["Add Line Events", "Multiple Line Events"]
products: []
issues: []
related: [{"doc":268,"file":"add-line-events-point-offset-method__doc268.md","s":7.424},{"doc":272,"file":"add-point-event-point-offset-method__doc272.md","s":6.575},{"doc":648,"file":"add-line-event-tools-coordinate-offset-method__doc648.md","s":6.086},{"doc":679,"file":"add-event-intersection-offset-method__doc679.md","s":5.902},{"doc":270,"file":"add-line-event-go-to-next-measure-on-save-option__doc270.md","s":5.902}]
```
-->

## Summary

User story describing the need for an LRS Editor to add a length-based To Method for line events in the Add Line and Multiple Line Events tools. It details the UI requirements, behavior across gaps, referent population, and testing considerations including feature service and route types.

## Related documents

<!-- related:begin -->
- [Add Line Events Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-point-offset-method__doc268.md>) — similar text 0.52 · 3 title words · 4 filename words · same kind/surface/folder <!-- rel:268 -->
- [Add Point Event Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-point-offset-method__doc272.md>) — similar text 0.51 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:272 -->
- [Add Line Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tools-coordinate-offset-method__doc648.md>) — similar text 0.28 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:648 -->
- [Add Event Intersection Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-event-intersection-offset-method__doc679.md>) — similar text 0.37 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:679 -->
- [Add Line Event Go To Next Measure on Save option](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-go-to-next-measure-on-save-option__doc270.md>) — similar text 0.32 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:270 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html)

_No page matched:_ [Add Line Events](https://www.google.com/search?q=%22Add%20Line%20Events%22+site%3Adoc.esri.com) · [Multiple Line Events](https://www.google.com/search?q=%22Multiple%20Line%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Add Line Event Length Method

User Story

## Slide 2 — User Story

As an LRS Editor, I need the capability based on the length from a starting point, so that I can locate new events from the field that come in via this collection method.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For some users, their data comes in as a measure/location and then gives a length for the event.  These users want a method called length where they can put a From Measure via some method and have the To Measure be based on a length from the first method.

## Slide 3 — Add Line Events tools

In the Add Line and Multiple Line Events tools, create a method for the To Method called length.  The method should only be available for the To Method.
After transitioning to the next pane, show the To Method as Length in the UI
Provide a text box for the length and a drop down next to it with units of measure.  Use the same units of measures that are used for other methods like offset
Allow only positive values for the length
If the user changes the unit of measure and there is already a measure populated, update the location of the marker on the map
Determine where the length location is on the map and make a marker for the To Location like we do today
Allow the user to populate the length before populating the From Method, but don’t show anything on the map until they populate the From Method
If the user clicks the Go To Next Measure Upon Save option, change the From Method to Route and Measure and use the Route/Measure that corresponds to the location found for the length method
If the event(s) layers that have event records being added to them have referent fields configured with the LRS, we should populate the referents with the Method: Length, Location: Null, and Offset: Offset value populated in the tool (note that the referent unit could be different and need to be converted from what was in the Add Event tool) (This should match what we did when adding these types of events using Event Editor)
If the length goes across a gap, we should calculate the proper location incorporating any difference in measure between the ends of the gap.  Continue to honor the rules whether the corresponding event created is a single event or multiple events as it spans the gap.

## Slide 4 — Testing

Test with both add event tools (mix and match test cases between the tools)
Mix and match spanning and non spanning event types in line and non line networks
Make sure to test with both Projected and Unprojected data
Feature Service testing only (no need to worry about direct connect or fgdb)
Test offsetting from point features on the following route types

  - Normal
  - Gapped (with different calibration on the ends)
  - Lollipops
508/i18n testing

## Slide 5 — Automation

Add a few UI automation cases for this new method

## Slide 6 — Documentation

Add information to the existing topics discussing this as a To Method that can be used.  Mention that the method is only available for the To Method and how it can be used.

## Slide 7 — Assignment

Story Points:
Dev:
PE:
