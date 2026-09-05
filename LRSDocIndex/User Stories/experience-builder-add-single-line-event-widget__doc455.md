# Experience Builder: Add Single Line Event Widget

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#16340](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/16340) |
| **Source** | [ExB_AddSingleLineEvent.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_AddSingleLineEvent.docx>) |
| **Edited** | 2023-11-14 16:42 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder: Add Single Line Event Widget"
source_file: "ExB_AddSingleLineEvent.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_AddSingleLineEvent.docx"
doc_id: 455
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: "Claire"
dev: "Dan"
author: "Praveen Kumar"
last_edited_by: "Claire Wang"
last_edited: "2023-11-14T16:42:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["line event", "spanning event", "route", "measure", "attribute configuration", "experience builder widget", "ui testing"]
tools: ["Add Single Line Event"]
products: ["Roads & Highways"]
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#16340"]
related: [{"doc":463,"file":"experience-builder-add-single-point-event-widget__doc463.md","s":6.683},{"doc":484,"file":"add-line-events-user-story-for-experience-builder__doc484.md","s":6.347},{"doc":457,"file":"experience-builder-add-multiple-line-events-widget-test-plan__doc457.md","s":6.264},{"doc":687,"file":"add-line-event-tool-in-arcgis-pro__doc687.md","s":6.095},{"doc":431,"file":"data-action-support-for-add-line-event-widget-test-plan__doc431.md","s":6.087}]
```
-->

## Summary

This document describes the user story and testing plan for the Add Single Line Event widget in Experience Builder. It covers configuration, UI tests, negative tests, functional tests, and automation considerations for line and non-line networks, spanning and non-spanning events, and various route types. The document also includes details on attribute configuration, error handling, and user interface behavior.

## Related documents

<!-- related:begin -->
- [Experience Builder: Add Single Point Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-add-single-point-event-widget__doc463.md>) — similar text 0.46 · 6 title words · 2 filename words · same surface/folder <!-- rel:463 -->
- [Add Line Events User Story for Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-user-story-for-experience-builder__doc484.md>) — similar text 0.47 · 4 title words · 3 filename words · same kind/surface <!-- rel:484 -->
- [Experience Builder: Add Multiple Line Events Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-add-multiple-line-events-widget-test-plan__doc457.md>) — similar text 0.52 · 5 title words · 2 filename words · same surface/folder <!-- rel:457 -->
- [Add Line Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tool-in-arcgis-pro__doc687.md>) — similar text 0.29 · 3 title words · 4 filename words · same kind <!-- rel:687 -->
- [Data Action Support for Add Line Event Widget – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/data-action-support-for-add-line-event-widget-test-plan__doc431.md>) — similar text 0.25 · 4 title words · 2 filename words · same surface/dev/folder <!-- rel:431 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)

_No page matched:_ [Add Single Line Event](https://www.google.com/search?q=%22Add%20Single%20Line%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

### Experience Builder: Add Single Line event Widget
User Story: https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/16340
PE: Claire
Dev: Dan
Data

- Test with both Line and Non-line (single + multi field RouteID) Network
- Test with spanning and non-spanning events
- Test on Normal, Gapped, Complex (more on RH side), and Vertical routes.
- Test in different browsers (Chrome, Edge, (Firefox and Safari can be done through automation))
- Test deploying in tab and mobile layouts (UI testing and execute one or two test cases).
- Web testing in chrome and safari in mobile (use ExB provided screen size)
- 508 testing
- i18n testing
- Test on projected and unprojected data.
- Test on different themes
Automation
Follow UI automation from other experience builder widgets
Documentation

- Create a documentation topic for this widget that follows the same format used in https://doc.arcgis.com/en/experience-builder/11.1/configure-widgets/widgets-overview.htm
- Make sure to include graphic examples in the doc, use Arcgis Pro documentation as a guide.

Configuration

- Verify any map can be selected from the list.
- Verify all the line event layers from the selected map are imported.
- If there is no LRS enabled service in the webmap, don’t show any event layers and provide a message that no LRS enabled service is present
- Should be able to import all the layers from the map using the Load Layers button
- Should be able to reorder the imported layers
- Should be able to remove any layer using x button
- Allow only importing from a single map
- Changing map and importing again should clear present list of layers and import the line event layers from the new map.
- Provide an error message if there are no Line event layers in the list after importing.
- Provide an error message if the network is not imported for the events (registered network for the events).
- Provide an error message if the map has layers from more than one service.
- Display the layer configuration after a layer is selected.
- Should be able to change the label in the layer configuration.
- Should be able to configure the attribute fields for each event layer to display/edit when adding the event.
- For configure fields, show business fields only to display and edit. LRS fields and System fields should not be selected and listed in the configuration.
- be able to select \ unselect the fields to show.
- be able to enable \ disable the fields to edit.
- be able to reorder the fields in the section of configure fields.
- By default, enable ‘Use field alias’ for the fields
- Should be able to add field description using settings button for the field.
- When the event layer is selected under Default Settings, make sure ‘Method’ and ‘Type’ auto populates with correct values.
- Test loading, point event layers should not be able to load.
- Toggle ‘Use field alias’ on and off, make sure correct field names display below.
UI Tests – First Pane

- Open Type (single line) should be as per the settings from the configuration.
- Event layer should be as per the settings from the configuration
- Verify other line events can be selected from the dropdown
- The order of the layers displayed in the dropdown should match with the order set in the configuration.
- Verify that the default option is “Using route and measure"
- the Network is automatically set to the registered network of the selected event layer
- Verify user cannot change the network until the measure translation is supported
- Verify the ‘Route Name” is displayed instead of route id for the events configured with route name
- From and To RouteID and Measure fields should be empty until the user types or select using the picker tools
- Verify if selected event is non-spanning, To Route should be disabled
- Verify snapping is enabled when using the picker
- When a route is selected using picker, populate the measure value from that location and vice versa.
- Verify that the measure units are set to the network units & tolerance
- Provide some measures in stationing format – might not be available until Sharon is done, so we can copy into this widget
- Verify the route selector UI is shown when the user clicks a location with the route picker that has multiple routes at that location
- Verify the route selector UI is shown when user types in a route with multiple time slices
- Routes listed in the selector should be filtered based on the time settings of the map.
- Verify the intellisense experience for RouteID/Name (after the 3rd character is typed) – might not be available until Sharon is done, so we can copy into this widget
- Verify the from and to routes flash 3 times, once they are chosen on the map using the route picker
- Verify the green and red dots are shown at the from and to locations
- Verify that the Date text boxes are populated with the current date by default & empty End Date
- Verify these dates can be changed by using the Route Date or typing
- Test Merge Coincident Events checkbox
- Test Retire Overlapping Events checkbox
- Test Reset button - When user clicks on reset, clear user entered values and bring form to initial loading state
Negative Tests

- Verify Next button is disabled if any of the required field is empty (Route/Measure/From Date)
- Verify error message when the routeid / route name / measures are invalid
- Verify error message when from date is less than or equal to the to date
- Verify the routeid \ routename\ measure exists in the provided date and are validated
UI Tests – Second Pane

- Test with and without additional attributes for the event
- Make sure the attribute fields as per the configuration settings of the event layer selected.
- Verify user can enter\edit values for the editable fields.
- Verify, coded value domains, range domains, subtypes, non-nullable fields, attribute rules, contingent values and default values for any fields work as expected
- Verify the Copy Attributes (Eyedropper) works as expected
- When clicking Add, execute creating the event and provide a confirmation message.
- Once the operation is complete, the 2nd pane transitions back to the initial pane
- If the user clicks Back, go back to the previous step make sure entered values are preserved
- If any fields are not populated correctly, make sure appropriate error for the field(s) is displayed, that need to be updated.
- Verify, when hovered on the field, description is displayed.
Negative Tests

- Violate attribute rules or and other rules I have in attributes
- Enter invalid attribute
Functional Tests (From Previous Test Plan)

- Create a line event on a simple route (1b – add an overlapping event 1/1/2010 with same attributes and merge coincident; 1c – add an overlapping event 1/1/2020 with different attributes and remove overlapping events)
- Create spanning line event on multiple simple routes (2b – add an overlapping event 1/1/2010 with same attributes and merge coincident; 2c – add an overlapping event 1/1/2020 with different attributes and remove overlapping events)
- Create a line event on a gapped route – will create multiple event – if stepping is 0, may not be multipart
- Create spanning line event on multiple gapped routes – will create multiple events
- Create a line event on a loop
- Create a spanning line event on routes forming a loop shape (6b – add an overlapping event 1/1/2010 with same attributes and merge coincident; 6c – add an overlapping event 1/1/2020 with different attributes and remove overlapping events)
- Create a line event on a lollipop with gap
- Create a line event on an infinity route (8b – add an overlapping event 1/1/2000 with same attributes and merge coincident; 8c – add an overlapping event 1/1/2020 with different attributes and remove overlapping events)
- Create a spanning line event on routes forming an alpha shape (9c - add an overlapping event 1/1/2000 with different attributes and remove overlapping events)
- Create a line event on a branched route – will create multipart event (10b – add an overlapping event 1/1/2000 with same attributes and merge coincident)
- Create a line event on a vertical route (8b – add an overlapping event 1/1/2010 at the end with same attributes and merge coincident; 8c – add an overlapping event 1/1/2010 at the beginning with different attributes and remove overlapping events)
- Create spanning line event on multiple vertical routes – if gap exists event will be multipart

![image1.png](../media/doc493_image1.png) ![image2.jpeg](../media/doc493_image2.jpeg) ![image3.png](../media/doc493_image3.png) ![image4.png](../media/doc493_image4.png) ![image5.png](../media/doc493_image5.png) ![image6.png](../media/doc493_image6.png) ![image7.png](../media/doc493_image7.png) ![image8.png](../media/doc493_image8.png) ![image9.png](../media/doc493_image9.png) ![image10.png](../media/doc493_image10.png) ![image11.png](../media/doc493_image11.png) ![image12.png](../media/doc493_image12.png)
