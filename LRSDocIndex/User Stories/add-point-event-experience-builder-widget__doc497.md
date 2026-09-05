# Add Point Event Experience Builder Widget

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB_AddPointEvents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB_AddPointEvents.pptx>) |
| **Edited** | 2023-09-09 18:05 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Add Point Event Experience Builder Widget"
source_file: "ExB_AddPointEvents.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB_AddPointEvents.pptx"
doc_id: 497
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: "LRS Editor"
dev: ""
author: "Praveen Kumar"
last_edited_by: "Praveen Kumar"
last_edited: "2023-09-09T18:05:58Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["point event", "event editing", "experience builder", "route picker", "attribute set", "configuration"]
tools: ["Add Point Event"]
products: []
issues: []
related: [{"doc":495,"file":"add-point-events-in-experience-builder__doc495.md","s":7.91},{"doc":496,"file":"add-point-events-in-experience-builder__doc496.md","s":7.517},{"doc":484,"file":"add-line-events-user-story-for-experience-builder__doc484.md","s":6.215},{"doc":480,"file":"user-story-add-line-event-multiple__doc480.md","s":5.869},{"doc":463,"file":"experience-builder-add-single-point-event-widget__doc463.md","s":5.719}]
```
-->

## Summary

This document describes the user story, configuration, interface, and testing considerations for the Add Point Event widget in Experience Builder. It covers the capabilities needed by LRS Editors to add point events through a web application, configuration options for event layers and attributes, UI behavior, error handling, and testing scenarios. It also includes notes on automation and documentation requirements for the widget.

## Related documents

<!-- related:begin -->
- [Add Point Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-events-in-experience-builder__doc495.md>) — similar text 0.72 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:495 -->
- [Add Point Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-events-in-experience-builder__doc496.md>) — similar text 0.72 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:496 -->
- [Add Line Events User Story for Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-user-story-for-experience-builder__doc484.md>) — similar text 0.70 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:484 -->
- [User Story Add Line Event (Multiple)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/user-story-add-line-event-multiple__doc480.md>) — similar text 0.66 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:480 -->
- [Experience Builder: Add Single Point Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-add-single-point-event-widget__doc463.md>) — similar text 0.36 · 6 title words · 2 filename words · same surface <!-- rel:463 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Add Point Event

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 4 icons, 14 text rows. 13 of 14 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide1.svg)

ExB

![image6.png](../media/doc450_image6.png) ![image7.png](../media/doc450_image7.png) ![image8.png](../media/doc450_image8.png) ![image9.png](../media/doc450_image9.png)

## Slide 2 — User Story

As an LRS Editor, I need the capability to add point events in web application configured through experience builder, so that I can complete LRS event editing workflow.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the event edits based on these documents. As support to javascript3 is ending,  We need to build an application that allows the users to create point events through a web application.

## Slide 3 — Configuration

## Slide 4 — Configuration

## Slide 5 — Add Point Event

Configuration

- If there is no LRS enabled service in the webmap, don’t show any event layers and provide a message that no LRS enabled service is present.
- Should be able to import all the layers from the map using the import all button.
- Should be able to reorder the imported layers.
- Should be able to set the default layer for single point event.
- Should be able to set the default attribute set for multiple point events.
- Should be able to set the default method for adding events.
- Should be able to set the default layer for the Add point event UI
- Provide an error message if there are no point event layers in the list after importing.
- Provide an error message if the networks are not imported.

## Slide 6 — Add Point Event

Configuration

- Should be able to select any layer, display the layer configuration after its selected.
- Should be able to change the label in the layer configuration.
- Should be able to configure the attribute fields for each event layer to display when adding the event.
- For configure default option should be to use the web map settings.
- For configure fields when customize option is selected, only business fields should be selected to show and edit, LRS fields and System fields should not be selected and listed in the configuration.
- If needed user should be able to select \ unselect the fields to show.
- If needed user should be able to select \ unselect the fields to edit.
- Should be able to reorder the fields in the edit section of configure fields.
- No configuration option for attribute sets (fields to display will be read from attribute set)

## Slide 7 — Add Point Event

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide7_fig1.svg)
![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide7_fig2.svg)

Can be invoked through

  - Button in the home page
  - Button in the search results pane
  - Under Actions in the table

When the widget is opened show the Type, Event Layer, Network, Method, RouteID, Measure and Dates

![image12.png](../media/doc450_image12.png) ![image13.png](../media/doc450_image13.png) ![image14.png](../media/doc450_image14.png)

## Slide 8 — Add Point Event

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 4 fields, 1 button, 1 row separator, 2 icons, 17 text rows. 16 of 17 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide8.svg)

- Default option for the Type should be ‘Single Point’
- Event layer selected should be as per the settings from the configuration.
- All other point event layers should be displayed in the dropdown and user should be able to select anyone.
- Network to which the event layer is registered should be displayed automatically.
- Option for Method should be as per the configuration.
- If the LRS Network is configured with RouteName, then show RouteName instead of RouteID.
- For Route ID and Measure fields user should be able to select using the picker or type the values.
- When a route is selected using picker, populate the measure value from that location and vice versa.
- Measure units should be defaulted to the Network units.

![image15.png](../media/doc450_image15.png)

## Slide 9 — Add Point Event

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 4 fields, 1 button, 1 row separator, 2 icons, 17 text rows. 16 of 17 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide9.svg)

- If the user clicks a location with the route picker that has more than one route at that location, provide the route selector UI (also applicable when no time filter applied to the map and there are multiple time slices of a single route).
- If a user types in a RouteID/Name and there are multiple time slices of that route, prompt the user to select which time slice they want to utilize (we can use the picker experience from the point above).
- Include an intellisense experience for RouteID/Name (after the 3rd character is typed).
- Once a route is selected on the map using the route picker, flash the route 3 times.
- When a measure on a route is selected on the map using the measure picker, provide a green dot and display the measure on the map.
- Default for the start date should be current date (today) and to date as null.
- Display check boxes for Use route start date and Use route end date.
- User should not be able to change the network until the measure translation is not supported.

![image15.png](../media/doc450_image15.png)

## Slide 10 — Add Point Event

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 3 fields, 1 button, 1 row separator, 3 icons, 17 text rows. 15 of 17 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide10.svg)

- When use route start date is checked, populate the from date with the route start date
- When use route end date is checked, populate the to date with the route end date
- When the Type is Multiple Points do not show event layer and display the ‘Attribute Set’ below the Network.
- Show the option set in the configuration and user should be able to choose any available attribute set using the edit button.
- Provide error messages when the routeid / route name / measures are invalid.
- After providing all the information and clicking on Next button should take to 2nd pane.

## Slide 11 — Add Point Event

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 button, 1 icon, 20 text rows. 16 of 20 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide11_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 colour block, 14 text rows. 13 of 14 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide11_fig2.svg)

Single point event

- For single point event show the attribute fields as per the configuration settings of the event layer selected.
- User should be able to enter \ edit values for the editable fields.
- Make sure to honor coded value domains, range domains, subtypes, non nullable fields, and default values for any fields where applicable.
- Should be able to copy the attributes from existing feature.

## Slide 12 — Add Point Event

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 colour block, 8 row separators, 3 icons, 26 text rows. 23 of 26 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide12_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 buttons, 8 row separators, 2 icons, 29 text rows. 28 of 29 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc450_slide12_fig2.svg)

Multiple point event (Attribute set)

- For Multiple point events show the attribute fields as per the configuration of the selected attribute set.
- User should be able to enter \ edit values for the fields.
- Make sure to honor coded value domains, range domains, subtypes, non nullable fields, and default values for any fields where applicable.
- If the checkbox for any layer \ field is not checked, then do not add \ update those fields \ layer.
- Should be able to copy the attributes from existing feature.

## Slide 13 — Add Point Event

- If the user clicks Save, execute creating the event and provide a confirmation message.
- Once the operation is complete, transition back to the initial pane.
- If the user clicks Back, go back to the previous step and preserve the entered values.
- If any fields are not populated correctly, do not Run and show an error for the field(s) that need to be updated.
- Provide error messages when the routeid / route name / measures are invalid.

## Slide 14 — Testing

- Test on events registered to a variety of network types (Line, NonLine with multifield RouteID, NonLine with singlefield RouteID)
- Test adding a point event on a variety of route types
  - Normal, Gapped (include different gap calibration methods)
  - Complex, and Vertical (can we test vertical routes?)
- Include various testing scenarios that would invoke a Loc Error
- Add a test scenario where an attribute rule is violated and make sure an appropriate error message is returned
- Test on projected and unprojected data.
- 508/i18n testing

## Slide 15 — Automation

Follow UI  automation from other experience builder widgets

## Slide 16 — Documentation

- Create a documentation topic for this widget that follows the same format used in https://doc.arcgis.com/en/experience-builder/11.1/configure-widgets/widgets-overview.htm
- We’re not sure where this widget will live within that topic at this time (need to confirm with the Experience Builder team), but the topic can at least follow the same format as others
- Make sure to include graphic examples in the doc, use event editor documentation as a guide.
