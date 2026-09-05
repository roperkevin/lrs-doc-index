# User Story Add Line Event (Multiple)

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB_AddLineEvents_Multiple.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB_AddLineEvents_Multiple.pptx>) |
| **Edited** | 2023-10-24 14:16 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "User Story Add Line Event (Multiple)"
source_file: "ExB_AddLineEvents_Multiple.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB_AddLineEvents_Multiple.pptx"
doc_id: 480
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Praveen Kumar"
last_edited: "2023-10-24T14:16:26Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["line event", "event editing", "experience builder", "route picker", "attribute set", "validation", "user interface"]
tools: ["Add Line Event"]
products: []
issues: []
related: [{"doc":484,"file":"add-line-events-user-story-for-experience-builder__doc484.md","s":7.423},{"doc":495,"file":"add-point-events-in-experience-builder__doc495.md","s":6.532},{"doc":496,"file":"add-point-events-in-experience-builder__doc496.md","s":6.104},{"doc":497,"file":"add-point-event-experience-builder-widget__doc497.md","s":5.869},{"doc":455,"file":"experience-builder-add-single-line-event-widget__doc455.md","s":5.292}]
```
-->

## Summary

This document describes a user story for adding multiple line events in a web application configured through Experience Builder. It details configuration settings, user interface behavior, validation rules, testing scenarios, automation guidance, and documentation requirements for the Add Line Event widget. The focus is on enabling LRS Editors to efficiently complete event editing workflows with proper attribute handling and error management.

## Related documents

<!-- related:begin -->
- [Add Line Events User Story for Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-user-story-for-experience-builder__doc484.md>) — similar text 0.75 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:484 -->
- [Add Point Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-events-in-experience-builder__doc495.md>) — similar text 0.69 · 1 title word · 3 filename words · same kind/surface/folder <!-- rel:495 -->
- [Add Point Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-events-in-experience-builder__doc496.md>) — similar text 0.72 · 1 title word · 2 filename words · same kind/surface/folder <!-- rel:496 -->
- [Add Point Event Experience Builder Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-experience-builder-widget__doc497.md>) — similar text 0.66 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:497 -->
- [Experience Builder: Add Single Line Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-add-single-line-event-widget__doc455.md>) — similar text 0.45 · 3 title words · 2 filename words · same kind/surface <!-- rel:455 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — User Story Add Line Event (Multiple)

As an LRS Editor, I need to Add Line Events in web application configured through experience builder, so that I can complete LRS event editing workflow.

Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.)  These users need to be able to Add Line Events using a web application.

## Slide 2 — Configuration

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 field, 35 buttons, 16 colour blocks, 1 row separator, 24 icons, 60 text rows. 46 of 60 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc469_slide2.svg)

Will be part of this use story

## Slide 3 — Add Line Event (Multiple)

Configuration

- Should be able to set the default Attribute set for Multiple Line event to the existing Add line event widget configuration.

## Slide 4 — Add Line Event (Multiple)

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 5 fields, 1 button, 1 row separator, 4 icons, 23 text rows. 23 of 23 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc469_slide4.svg)

- When  opened Type should be as per the settings from the configuration.
- Default Attribute set selected should be as per the settings from the configuration.
- All other attribute sets should be displayed in the dropdown and user should be able to change when needed.
- Network to which the event layers are registered should be displayed automatically.
- Option for From and To Method should be as per the configuration and allow user to change to any other available method using the edit button (when we start supporting other methods).
- If the LRS Network is configured with RouteName, then show RouteName instead of RouteID.
- For Route ID and Measure fields user should be able to select using the picker or type the values.
- When a route is selected using picker, populate the measure value from that location and vice versa.

![image7.png](../media/doc469_image7.png)

## Slide 5 — Add Line Event

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 5 fields, 1 button, 1 row separator, 4 icons, 23 text rows. 23 of 23 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc469_slide5_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 3 icons, 18 text rows. 16 of 18 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc469_slide5_fig2.svg)

- If the user clicks at a location with the route picker that has more than one route at that location, provide the route selector UI (also applicable when no time filter applied to the map and there are multiple time slices of a single route).
- If a user types in a RouteID/Name and there are multiple time slices of that route, prompt the user to select which time slice they want to utilize (we can use the picker experience from the point above).
- Routes listed in the selector should be filtered based on the time settings of the map.
- Measure units should be defaulted to the Network units and the no of decimal places to display should be as per the m tolerance of the network.
- Once a route is selected on the map using the route picker, flash the route 3 times.
- When from measure on a route is selected on the map using the measure picker, provide a green dot and display the measure on the map.
- When to measure on a route is selected on the map using the measure picker, provide a red dot and display the measure on the map.

![image8.png](../media/doc469_image8.png) ![image7.png](../media/doc469_image7.png)

## Slide 6 — Add Line Event (Multiple)

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 5 fields, 1 button, 1 row separator, 4 icons, 23 text rows. 23 of 23 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc469_slide6.svg)

- User should not be able to change the network until the measure translation is supported (disable the pencil).
- Default for the start date should be current date (today) and to date as null.
- Display check boxes for Use route start date and Use route end date.
- When use route start date is checked, populate the from date with the route start date
- When use route end date is checked, populate the to date with the route end date
- Always enable snapping while using the route \ measure pickers
- When user clicks on reset, clear user entered values and bring form to initial loading state.
- Merge adjacent events when the ‘Merge coincident events option’ is checked.
- Retire any overlapping events if ‘Retire overlapping events’ option is checked
- After providing all the information and clicking on Next button should take to 2nd pane.

![image7.png](../media/doc469_image7.png)

## Slide 7 — Add Line Event (Multiple)

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 button, 1 colour block, 8 row separators, 3 icons, 28 text rows. 27 of 28 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc469_slide7_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 4 buttons, 8 row separators, 3 icons, 26 text rows. 25 of 26 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc469_slide7_fig2.svg)

Multiple Line event

- For the selected attribute set show the attribute fields as per the configuration.
- User should be able to enter \ edit values for the editable fields.
- Make sure to honor coded value domains, range domains, subtypes, non nullable fields, attribute rules, contingent values and default values for any fields wherever applicable.
- If any layer is not in the webmap, does not show the field information.
- If the user clicks Add, execute creating the events and provide a confirmation message.
- Once the operation is complete, transition back to the initial pane.
- If the user clicks Back, go back to the previous step and preserve the entered values.
- If any fields are not populated correctly, do not Run and show an error for the field(s) that need to be updated.

![image9.png](../media/doc469_image9.png) ![image10.png](../media/doc469_image10.png)

## Slide 8 — Add Line Event (Multiple)

- Provide error messages when the routeid / route name / measures are invalid.
- Provide error messages when from date is greater than or equal to the to date.
- Validate the routeid \ routename\ measure exists in the provided date.
- Next button should be enabled only when the route / measure / dates are valid.

## Slide 9 — Testing

- Test on events registered to a variety of network types (Line, NonLine with multifield RouteID, NonLine with singlefield RouteID)
- Test adding a Line event on a variety of route types
  - Normal, Gapped (include different gap calibration methods)
  - Complex, and Vertical (can we test vertical routes?)
- Test in different browsers (Chrome, Edge, (Firefox and Safari can be done through automation))
- Add a test scenario where an attribute rule is violated and make sure an appropriate error message is returned
- Test deploying in tab and mobile layouts (UI testing and execute one or two test cases).
- Web testing in chrome and safari in mobile.
- Test on projected and unprojected data.
- 508/i18n testing
- Test on different themes

## Slide 10 — Automation

Follow UI  automation from other experience builder widgets

## Slide 11 — Documentation

- Create a documentation topic for this widget that follows the same format used in https://doc.arcgis.com/en/experience-builder/11.1/configure-widgets/widgets-overview.htm
- We’re not sure where this widget will live within that topic at this time (need to confirm with the Experience Builder team), but the topic can at least follow the same format as others
- Make sure to include graphic examples in the doc, use Arcgis Pro documentation as a guide.

## Slide 12 — Assignment

Story Points:
Dev:
PE:
