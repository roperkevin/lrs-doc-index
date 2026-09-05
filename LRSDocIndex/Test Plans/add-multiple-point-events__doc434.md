# Add Multiple Point Events

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Source** | [AddMulitiplePoint_Events_ExB.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AddMulitiplePoint_Events_ExB.pptx>) |
| **Edited** | 2024-01-22 20:40 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Add Multiple Point Events"
source_file: "AddMulitiplePoint_Events_ExB.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AddMulitiplePoint_Events_ExB.pptx"
doc_id: 434
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Praveen Kumar"
last_edited: "2024-01-22T20:40:47Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["point event", "event editing", "attribute set", "route picker", "measure picker", "error handling", "timeslice"]
tools: ["Add Multiple Point Events"]
products: []
issues: []
related: [{"doc":672,"file":"add-multiple-point-events__doc672.md","s":8.354},{"doc":463,"file":"experience-builder-add-single-point-event-widget__doc463.md","s":5.696},{"doc":496,"file":"add-point-events-in-experience-builder__doc496.md","s":5.498},{"doc":495,"file":"add-point-events-in-experience-builder__doc495.md","s":5.341},{"doc":638,"file":"add-point-event-tool-add-multipoint-events-tool-coordinate-offset-method-test__doc638.md","s":5.066}]
```
-->

## Summary

Test plan for adding multiple point events in the Experience Builder widget. Covers configuration, layer and attribute set selection, route and measure validation, attribute editing, error handling, and various route types including simple, gap, loop, branch, infinity, vertical gap, and timeslice events.

## Related documents

<!-- related:begin -->
- [Add Multiple Point Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/add-multiple-point-events__doc672.md>) — similar text 0.82 · 4 title words · 4 filename words · same kind/folder <!-- rel:672 -->
- [Experience Builder: Add Single Point Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-add-single-point-event-widget__doc463.md>) — similar text 0.45 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:463 -->
- [Add Point Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-events-in-experience-builder__doc496.md>) — similar text 0.37 · 3 title words · 3 filename words · same surface <!-- rel:496 -->
- [Add Point Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-events-in-experience-builder__doc495.md>) — similar text 0.38 · 3 title words · 3 filename words · same surface <!-- rel:495 -->
- [Add Point Event tool/ Add Multipoint Events tool Coordinate offset method – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-point-event-tool-add-multipoint-events-tool-coordinate-offset-method-test__doc638.md>) — similar text 0.25 · 3 title words · 3 filename words · same kind/folder <!-- rel:638 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add multiple point events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/add-multiple-point-events.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Set a time filter](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-a-time-filter.html)
<!-- docs:end -->

---

## Slide 1 — Add Multiple Point Events

Configuration
Content page:

- Verify the map dropdown lists all the maps from all the pages.
- Verify any map can be selected from the list.
- Click Load layers and verify all the Network and Point event layers from the selected map are imported.
- Verify the reordering of the imported layers.
- Verify the layer is removable using ‘x’ of the respective layer.
- Changing map and importing again should clear present list of layers and import the Network layers from the new map.
- Verify the Attribute Set dropdown lists all the attribute sets available in the service.
- Verify any Attribute Set can be selected from the list to set as default attribute set.
- Verify only ‘Single Point’ and ‘Multiple Points’ are available for Type dropdown.
- Verify that “Multiple Points” can be set as default for Type.
- Verify any method can be selected to set the default method for adding events.

![image1.png](../media/doc518_image1.png)

## Slide 2 — Add Multiple Point Events

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc518_slide2.svg)

Layer Configuration:

- Verify that the layer configuration is displayed when a layer is selected.
- Verify that the individual layer configuration does not affect the attribute set
Negative:

- Click on Import all button without selecting a map and verify an error message is displayed.
- Choose a map which does not have any layers and verify an error message is displayed.
- Choose a map which does not have any LRS Network layers and verify an error message is displayed.
- Choose a map which does not have any Point Event layers and verify an error message is displayed.
- Verify the error message if the map has layers from more than one service.
- User clicks Next without filling measure – verify error message
- Verify error message when the routeid / route name / measures are invalid
- Verify error message when from date is less than or equal to the to date

![image2.png](../media/doc518_image2.png)

## Slide 3 — Add Multiple Point Events

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 4 fields, 1 button, 3 icons, 19 text rows. 17 of 19 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc518_slide3_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 panels, 3 fields, 1 button, 3 icons, 18 text rows. 16 of 18 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc518_slide3_fig2.svg)

- Test with both Line, Non-line (single + multi field) Network.
- Type should be as per the settings from the configuration.
- Verify that the default method option is as per the settings from the configuration.
- Verify that the Attribute set is as per the settings from the configuration.
- Verify all other attribute sets are displayed in the dropdown when user clicks on the edit button (pencil) allow user to choose any desired one from the list.
- Verify that the Network is automatically set to the registered network of the selected attribute set.
- RouteID and Measure should be empty until the user types or select using the picker tools.
- Verify the route and measure values are correct when pickers interact with the route on map.
- Verify when a route is selected using picker, the measure value from that location is populated and vice versa.
- Verify that the measure units are set to the network units.
- Provide some measures in stationing format.
- Verify the ‘Route Name” is displayed instead of route id for the  network with route name configuration.
- Verify the route flashes 3 times, once it is chosen on the map using the route picker.
- Verify the green dot at that location, when a measure on a route is selected on the map using the measure picker.

![image3.png](../media/doc518_image3.png) ![image4.png](../media/doc518_image4.png)

## Slide 4

Add Multiple Point Events

- Verify the intellisense experience for RouteID/Name
- Verify that the route selector UI is shown when the user clicks a location with the route picker that has more than one route at that location.
- Verify that the measures can be typed in.
- Provide a measure with 7 decimal places where only 3 decimal places are allowed and verify that the measure is truncated properly.
- Verify the snapping with route and measure picker.
- Verify that the Start Date text box is populated with the current date by default & empty End Date
- Verify the Start date is set  with the route start date, When use route start date is checked
- Verify the End date is set  with the route end date, When use route End date is checked
- Test with different Attribute sets (default and custom).
- Make sure coded value domains, range domains, subtypes, non-nullable fields, and default values for any fields where applicable are honored.
- Verify, routes listed in the selector should be filtered based on the timeline settings of the map.
- Verify, user should not be able to change the network until the measure translation is supported.
- Verify the routeid \ routename\ measure exists in the provided date and are validated.
- Verify after providing all the information and clicking on Next button takes to 2nd pane.
- Verify the cross will clear the value in the routename/ routid.

## Slide 5

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 icons, 33 text rows. 21 of 33 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc518_slide5.svg)

- Make sure the attribute fields as per the configuration settings of the attribute set.
- Verify user can enter\edit values for the editable fields.
- Verify, coded value domains, range domains, subtypes, non-nullable fields, attribute rules, contingent values and default values for any fields work as expected.
- Verify that if the checkbox for any layer is not checked, then the event is not added in it.
- If the user clicks Save, make sure a confirmation message appears and edit goes through!.
- Verify once the operation is complete, the 2nd pane transitions back to the initial pane.
- If the user clicks Back, go back to the previous step make sure entered values are preserved.
- If any fields are not populated correctly, make sure appropriate error for the field(s) is displayed, that need to be updated.
- Verify when hovered on the field, description is displayed.
- Copy the attributes from existing feature and verify the values.
- Ensure that the attributes are not copied for unchecked layer.
- Verify the Toggle all layers on \ off with ctrl and click on any layer checkbox.

Add Multiple Point Events

![image5.png](../media/doc518_image5.png)

## Negative Tests <!-- slide 6 -->

### 508 Testing .

Other Tests

- Add a test scenario where an attribute rule is violated and make sure an appropriate error message is returned.
- Test on projected and unprojected data.
- Test on different themes.
- Test adding a point event on a variety of route types (Normal, Gapped, Complex and Vertical
- i18n testing.

- User clicks Next without filling measure – verify error message
- Verify error message when the routeid / route name / measures are invalid
- Verify error message when from date is less than or equal to the to date

## Slide 7

Simple Route Point Events

![Diagram drawn from the slide's own shapes: 6 nodes (Simple Route Point Events), 1 connector.](../media/doc518_slide7.svg)

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR1 | E1 | 1/1/2000 |  | 8 | No Error |
| Layer2 | PR1 | E2 | 1/1/2000 |  | 8 | No Error |
| Layer3 | PR1 | E3 | 1/1/2000 |  | 8 | No Error |

## Slide 8

Gap Route Point Events

![Diagram drawn from the slide's own shapes: 12 nodes (Gap Route Point Events), 2 connectors.](../media/doc518_slide8.svg)

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR11 | E11 | 1/1/2000 |  | 4 | No Error |
| Layer2 | PR11 | E12 | 1/1/2000 |  | 4 | No Error |
| Layer3 | PR11 | E13 | 1/1/2000 |  | 4 | No Error |
| Layer1 | PR11 | E14 | 1/1/2000 |  | 4.1 | No Error |
| Layer2 | PR11 | E15 | 1/1/2000 |  | 4.1 | No Error |
| Layer3 | PR11 | E16 | 1/1/2000 |  | 4.1 | No Error |
| Layer1 | PR11 | E17 | 1/1/2000 |  | 6 | No Error |
| Layer2 | PR11 | E18 | 1/1/2000 |  | 6 | No Error |
| Layer3 | PR11 | E19 | 1/1/2000 |  | 6 | No Error |

## Slide 9

Loop Route Point Events

![Diagram drawn from the slide's own shapes: 9 nodes (Loop Route Point Events), 4 connectors.](../media/doc518_slide9.svg)

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR21 | E21 | 1/1/2000 |  | 4 | No Error |
| Layer2 | PR21 | E22 | 1/1/2000 |  | 4 | No Error |
| Layer3 | PR21 | E23 | 1/1/2000 |  | 4 | No Error |
| Layer1 | PR21 | E24 | 1/1/2000 |  | 2.5 | No Error |
| Layer2 | PR21 | E25 | 1/1/2000 |  | 2.5 | No Error |
| Layer3 | PR21 | E26 | 1/1/2000 |  | 2.5 | No Error |

## Slide 10

![Diagram drawn from the slide's own shapes: 8 nodes (Branch Point Events), 3 connectors.](../media/doc518_slide10.svg)

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR31 | E31 | 1/1/2000 |  | 6 | No Error |
| Layer2 | PR31 | E32 | 1/1/2000 |  | 6 | No Error |
| Layer3 | PR31 | E33 | 1/1/2000 |  | 6 | No Error |

## Slide 11

![Diagram drawn from the slide's own shapes: 10 nodes (Infinity Point Events), 8 connectors.](../media/doc518_slide11.svg)

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR41 | E41 | 1/1/2000 |  | 6 | No Error |
| Layer2 | PR41 | E42 | 1/1/2000 |  | 6 | No Error |
| Layer3 | PR41 | E43 | 1/1/2000 |  | 6 | No Error |

## Slide 12

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR51 | E51 | 1/1/2000 |  | 2 | No Error |
| Layer2 | PR51 | E52 | 1/1/2000 |  | 2 | No Error |
| Layer3 | PR51 | E53 | 1/1/2000 |  | 2 | No Error |
| Layer1 | PR51 | E54 | 1/1/2000 |  | 9 | No Error |
| Layer2 | PR51 | E55 | 1/1/2000 |  | 9 | No Error |
| Layer3 | PR51 | E56 | 1/1/2000 |  | 9 | No Error |

Vertical Gap Route Point Events

[figure: PR51 · E51 · E52 · E53 · E54 · E55 · E56]

![image6.png](../media/doc518_image6.png)

## Slide 13

![Measured route diagram drawn from the slide's own shapes, measures 1 to 2.](../media/doc518_slide13.svg)

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | R24L2 | E91 | 1/1/2000 |  | 15 | No Error |
| Layer2 | R24L2 | E92 | 1/1/2000 |  | 15 | No Error |
| Layer3 | R24L2 | E93 | 1/1/2000 |  | 15 | No Error |
| Layer1 | R25L2 | E94 | 1/1/2000 |  | 2 | No Error |
| Layer2 | R25L2 | E95 | 1/1/2000 |  | 2 | No Error |
| Layer3 | R25L2 | E96 | 1/1/2000 |  | 2 | No Error |

Line Network Point Events

## Slide 14

Point Events – Timeslice

![Diagram drawn from the slide's own shapes: 11 nodes (Point Events – Timeslice), 3 connectors.](../media/doc518_slide14.svg)

| Event Layer | RouteId | EventId | FromDate | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| Layer1 | PR101 | E101 | 1/1/2000 | 1/1/2010 | 16 | No Error |
| Layer2 | PR101 | E102 | 1/1/2000 | 1/1/2010 | 16 | No Error |
| Layer3 | PR101 | E103 | 1/1/2000 | 1/1/2010 | 16 | No Error |
| Layer1 | PR101 | E101 | 1/1/2010 | 1/1/2015 | 16 | No Error |
| Layer2 | PR101 | E102 | 1/1/2010 | 1/1/2015 | 16 | No Error |
| Layer3 | PR101 | E103 | 1/1/2010 | 1/1/2015 | 16 | No Error |

Event dates from 1/1/2000 to 1/1/2015
