# Experience Builder: Add Single Point Event Widget

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Source** | [ExB_AddSinlgePointEvent.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_AddSinlgePointEvent.docx>) |
| **Edited** | 2023-11-09 21:28 by Johum Khushk |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder: Add Single Point Event Widget"
source_file: "ExB_AddSinlgePointEvent.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_AddSinlgePointEvent.docx"
doc_id: 463
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Johum Khushk"
last_edited: "2023-11-09T21:28:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["point event", "event layer", "route picker", "measure picker", "attribute editing", "error handling", "experience builder widget"]
tools: ["Add Single Point Event"]
products: []
issues: []
related: [{"doc":455,"file":"experience-builder-add-single-line-event-widget__doc455.md","s":6.683},{"doc":497,"file":"add-point-event-experience-builder-widget__doc497.md","s":5.719},{"doc":434,"file":"add-multiple-point-events__doc434.md","s":5.696},{"doc":496,"file":"add-point-events-in-experience-builder__doc496.md","s":5.261},{"doc":495,"file":"add-point-events-in-experience-builder__doc495.md","s":5.252}]
```
-->

## Summary

Test plan for the Add Single Point Event widget in Experience Builder. Covers configuration validation, UI tests for event layer selection and attribute editing, error handling, and functional tests including accessibility and internationalization. Ensures correct behavior with route and measure inputs, field aliasing, and attribute rules.

## Related documents

<!-- related:begin -->
- [Experience Builder: Add Single Line Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-add-single-line-event-widget__doc455.md>) — similar text 0.46 · 6 title words · 2 filename words · same surface/folder <!-- rel:455 -->
- [Add Point Event Experience Builder Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-experience-builder-widget__doc497.md>) — similar text 0.36 · 6 title words · 2 filename words · same surface <!-- rel:497 -->
- [Add Multiple Point Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-multiple-point-events__doc434.md>) — similar text 0.45 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:434 -->
- [Add Point Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-events-in-experience-builder__doc496.md>) — similar text 0.38 · 4 title words · 2 filename words · same surface <!-- rel:496 -->
- [Add Point Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-events-in-experience-builder__doc495.md>) — similar text 0.38 · 4 title words · 2 filename words · same surface <!-- rel:495 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Single Point Event](https://www.google.com/search?q=%22Add%20Single%20Point%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

### Experience Builder: Add Single Point Event Widget
Configuration

[figure: Do we have these? · yes]

- Verify any map can be selected from the list.
- Verify all the point event layers from the selected map are imported.
- Verify the reordering of the imported point event layers.
- Verify the layer is removable using ‘x’.
- Changing map and importing again should clear present list of layers and import the point layers from the new map.
- When the event layer is selected under Default Settings, make sure ‘Method’ and ‘Type’ auto populates with correct values.
- Test loading, line event layers – should not be able to load.
- Toggle ‘Use field alias’ on and off, make sure correct field names display below.
- Turn fields on/off under ‘Configure Fields’ – verify only business fields are shown and edit, LRS fields and System fields should not be listed in the configuration.
- Verify the reordering of the fields, selecting/ unselecting (display + editing)
- Choose a map which does not have any point event layers and verify an error message is displayed.
- Test with map that has no networks (Networks are required to be configured and for the picker to work)
- If there is no LRS enabled service in the webmap, make sure any event layers are not shown and a message is provided that no LRS enabled service is present.
- Verify, user can import all the layers from the map using the Load Layers button.
- Verify, user can add any missing layer using the ‘New editable Layer’ option? After discussion in scrum, it was removed
- Verify error message if the map has layers from more than one service.
- Verify, user can change the label in the layer configuration
UI Tests – First Pane

- Test with both Line, Non-line (single + multi field) Network
- Type and Event layer should be as per the settings from the configuration.
- Verify that the default option is “Using route and measure”
- Verify that the default for ‘Event Layer’ is the layer configured
and verify that the Network is automatically set to the registered network of the selected event layer

- RouteID and Measure should be empty until the user types or select using the picker tools
- Verify the route and measure values are correct when pickers interact with the route on map
- Verify that the measure units are set to the network units & tolerance
- Provide some measures in stationing format
- Verify the ‘Route Name” is displayed instead of route id for the events configured with route name
- Verify that the route selector UI is shown when the user clicks a location with the route picker that has more than one route at that location
- Verify the intellisense experience for RouteID/Name (after the 3rd character is typed)
- Verify the route flashes 3 times, once it is chosen on the map using the route picker
- Verify the green dot at that location, when a measure on a route is selected on the map using the measure picker
- Verify that the Date text boxes are populated with the current date by default & empty End Date
- Test with and without additional attributes for the event fields
- 508 testing
- i18n testing
- Make sure coded value domains, range domains, subtypes, non-nullable fields, and default values for any fields where applicable are honored
- Verify, routes listed in the selector should be filtered based on the timeline settings of the map.
- Verify, user should not be able to change the network, method until the measure translation is supported
Negative Tests

- User clicks Next without filling routeid – verify error message
- User clicks Next without filling measure – verify error message
- User clicks Next without filling the from date - verify error message
- Verify error message when the routeid / route name / measures are invalid
- Verify error message when from date is less than or equal to the to date
- Verify the routeid \ routename\ measure exists in the provided date and are validated
UI Tests – Second Pane

- Make sure the attribute fields as per the configuration settings of the event layer selected.
- Verify user can enter\edit values for the editable fields.
- Verify, coded value domains, range domains, subtypes, non-nullable fields, attribute rules, contingent values and default values for any fields work as expected
- If the user clicks Save, make sure a confirmation message appears and edit goes through!
- Verify, once the operation is complete, the 2nd pane transitions back to the initial pane
- If the user clicks Back, go back to the previous step make sure entered values are preserved
- If any fields are not populated correctly, make sure appropriate error for the field(s) is displayed, that need to be updated.
- Verify, when hovered on the field, description is displayed.

Other Tests

- Add a test scenario where an attribute rule is violated and make sure an appropriate error message is returned
- Test on projected and unprojected data.
- Test on different themes

Functional Tests (From Previous Test Plan)

[figure: E3]

[figure: E2]

[figure: E1]

[figure: 10]

[figure: 0]

[figure: PR1]

[figure: 8.1]

[figure: 0]

[figure: 4.1]

[figure: 4]

[figure: E11]

[figure: PR11]

[figure: E12]

[figure: E13]

[figure: E14]

[figure: E15]

[figure: 0]

[figure: 4]

[figure: 1.33]

[figure: 2.67]

[figure: E21]

[figure: PR21]

[figure: E22]

[figure: E23]

[figure: 6]

[figure: 4]

[figure: 4]

[figure: 0]

[figure: PR31]

[figure: E33]

[figure: E34]

[figure: E31]

[figure: E32]

[figure: 0]

[figure: 8]

[figure: 4.33]

[figure: 5.67]

[figure: 1.5]

[figure: 7.5]

[figure: PR41]

[figure: E42]

[figure: E41]

[figure: E44]

[figure: E43]

![image1.png](../media/doc483_image1.png) ![image2.jpeg](../media/doc483_image2.jpeg) ![image3.png](../media/doc483_image3.png) ![image4.png](../media/doc483_image4.png) ![image5.png](../media/doc483_image5.png) ![image6.png](../media/doc483_image6.png) ![image7.png](../media/doc483_image7.png) ![image8.png](../media/doc483_image8.png) ![image9.png](../media/doc483_image9.png) ![image13.png](../media/doc483_image13.png) ![image14.png](../media/doc483_image14.png) ![image15.png](../media/doc483_image15.png)
