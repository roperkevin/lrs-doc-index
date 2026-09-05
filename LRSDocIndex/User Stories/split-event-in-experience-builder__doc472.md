# Split Event in Experience Builder

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB_SplitEvents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB_SplitEvents.pptx>) |
| **Edited** | 2023-10-31 18:33 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Split Event in Experience Builder"
source_file: "ExB_SplitEvents.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB_SplitEvents.pptx"
doc_id: 472
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Praveen Kumar"
last_edited: "2023-10-31T18:33:04Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["split event", "event editing", "line event", "route name", "measure", "experience builder", "lrs editor"]
tools: ["Split Event"]
products: []
issues: []
related: [{"doc":497,"file":"add-point-event-experience-builder-widget__doc497.md","s":5.091},{"doc":484,"file":"add-line-events-user-story-for-experience-builder__doc484.md","s":4.808},{"doc":466,"file":"merge-events-in-experience-builder__doc466.md","s":4.806},{"doc":677,"file":"split-events-in-arcgis-pro__doc677.md","s":4.558},{"doc":496,"file":"add-point-events-in-experience-builder__doc496.md","s":4.527}]
```
-->

## Summary

Describes a user story for enabling LRS Editors to split events within the Experience Builder app. Covers configuration options for event layers, user interface behavior for selecting split locations, validation rules, and expected user interactions during the split event workflow.

## Related documents

<!-- related:begin -->
- [Add Point Event Experience Builder Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-experience-builder-widget__doc497.md>) — similar text 0.51 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:497 -->
- [Add Line Events User Story for Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-user-story-for-experience-builder__doc484.md>) — similar text 0.56 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:484 -->
- [Merge Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-events-in-experience-builder__doc466.md>) — similar text 0.52 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:466 -->
- [Split Events in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-events-in-arcgis-pro__doc677.md>) — similar text 0.49 · 1 title word · 2 filename words · same kind/folder <!-- rel:677 -->
- [Add Point Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-events-in-experience-builder__doc496.md>) — similar text 0.52 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:496 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Split Event in ExB

User Story

## Slide 2 — User Story

As an LRS Editor, I want to be able to split events, so that I can complete my event editing workflows.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. One workflow users will utilize is to split events at specific locations.  We supported this workflow in Event Editor and now want to support it within ExB.

## Slide 3 — Configuration

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 field, 27 buttons, 11 colour blocks, 2 row separators, 22 icons, 61 text rows. 44 of 61 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc476_slide3.svg)
## Slide 4 — Configuration

- If there is no LRS enabled service in the webmap, don’t show any event layers and provide a message that no LRS enabled service is present.
- Should be able to import all the line event and network layers from the map using the Load Layers button.
- Should be able to add any missing layer using the  ‘New editable Layer’ option.
- Should be able to reorder the imported layers.
- Should be able to remove any layer using x button next to the respective layer.
- Allow only importing from a single map (if another map is chosen then clear the present layers before importing layers from different map).
- Provide an error message if there are no Line event layers in the list after importing.
- Provide an error message if the network is not imported for the events (registered network for the events).
- Provide a message if the map has layers from more than one service.

## Slide 5 — Configuration

- Should be able to set the default layer for Split event.
- If there are more than one web map, list all those in the ‘Select a map’ dropdown.
- If user clicks on ‘Load Layers’ button after removing one or more imported layers load only the missing layers.
- List only Line event layers in the ‘Event’ dropdown under default settings.

## Slide 6 — Configuration

- Display the layer configuration after a layer is selected.
- Should be able to change the label in the layer configuration.
- Should be able to configure the attribute fields for each event layer to display/edit when splitting the event.
- For configure fields show only business fields to display and edit, LRS fields and System fields should not be shown in the configuration.
- If needed user should be able to select \ unselect the fields to show.
- If needed user should be able to enable \ disable the fields to edit.
- Should be able to reorder the fields in the section of configure fields.
- By default, enable ‘Use field alias’ for the fields
- Should be able to add filed description using settings button for the field.

## Slide 7 — Split Event

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 4 fields, 4 buttons, 30 text rows. 29 of 30 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc476_slide7.svg)

Split Event

- Add a widget called Split Event.
- Once clicked, the Split Events tool should open in the Experience builder app.
- The event layer drop down should include all the LRS line events within the map.
- Once an event layer is selected, populate the units for the measure label as per the network m units.
- If the event selected is part of an LRS Network with Route Name configured and Route Name is configured for the event, show Route Name in place of RouteID.
- Allow the user to type the RouteID/Name or use the route picker to select the location
- Allow the user to type the measure or use the picker to select the location
- Once the user clicks a location, verify there is an event from the event layer at that location and populate the routeID/route name, the measure, and the OID of the event at that location
- Flash the route three times once selected and provide a marker on the map at the split location
- If there is more than one route (or more than one route time slice) at a location clicked on the map, show a picker with the RouteID/Name and Dates for the user to select
- If the user selects a location on the map with more than one measure (self intersection point, etc.), provide a picker for the user to choose which measure they want to split at

![image8.png](../media/doc476_image8.png)

## Slide 8 — Split Event

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc476_slide8.svg)

Populate the Split Date with today’s date and populate the attributes for the event selected.
If user route start date is checked, populate the split date with route start date.
If more than one event exists at the split location, provide an error message to the user about more than one event being present at that location.
If the selected measure is at the start/endpoint of an event, give the user a message about the selected location being the start/end of an event and not being able to split.
If the user changes the date, utilize the date for the newly created events that result from the split.
If the date is changed to date outside the route date range, provide an error and alert the user that the dates are outside the route time range.
In the attributes section, allow the user to change any of the non LRS attributes (Access Control and Derived From are examples in the graphics).
When the user clicks Split, execute the split and flash on the map sequentially the two different features that now exist.
Once the split is complete, show a confirmation notification and clear out the UI other than the event layer being selected.

![image9.png](../media/doc476_image9.png)

## Slide 9 — Testing

Test on spanning and non spanning events
Test on both projected and unprojected data
Test split scenarios at the beginning or end of a route
Also test a scenario where the split location is at the end of the gap (both for cases where an event spans the gap and where it doesn’t)
Test on the following geometries

  - Normal
  - Gapped
  - Complex
  - Vertical

## Slide 10 — Automation

## Slide 11 — Automation

## Slide 12 — Assignment

Story Points:
Dev:
PE:

## Slide 13 — Assignment

Story Points: 13
Dev:
PE:
