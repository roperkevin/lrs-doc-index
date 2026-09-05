# Create multiple line events: Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [Add_Multi_Lines_Events_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Add_Multi_Lines_Events_TestPlan.pptx>) |
| **Edited** | 2022-04-07 20:23 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Create multiple line events: Test Plan"
source_file: "Add_Multi_Lines_Events_TestPlan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Add_Multi_Lines_Events_TestPlan.pptx"
doc_id: 669
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2022-04-07T20:23:28Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["line event", "route", "measure", "branched versioning", "attribute set", "error handling", "route picker", "measure picker"]
tools: []
products: ["Utility Network"]
issues: []
related: [{"doc":672,"file":"add-multiple-point-events__doc672.md","s":5.353},{"doc":434,"file":"add-multiple-point-events__doc434.md","s":4.676},{"doc":457,"file":"experience-builder-add-multiple-line-events-widget-test-plan__doc457.md","s":4.562},{"doc":668,"file":"test-plan-for-conflict-prevention-for-add-multiple-line-events-tool-in-arcgis__doc668.md","s":3.584},{"doc":491,"file":"splitting-events-in-arcgis-pro-test-plan__doc491.md","s":3.539}]
```
-->

## Summary

Test plan for adding multiple line events across different network types including user created and auto-populated RouteID networks with branched versioning. It covers validation of route and measure pickers, attribute management, error handling, and UI behaviors for line and non-line networks. Includes test cases for date fields, measure precision, route selection, and error messages.

## Related documents

<!-- related:begin -->
- [Add Multiple Point Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/add-multiple-point-events__doc672.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:672 -->
- [Add Multiple Point Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-multiple-point-events__doc434.md>) — similar text 0.24 · 2 title words · 2 filename words · same kind/folder <!-- rel:434 -->
- [Experience Builder: Add Multiple Line Events Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-add-multiple-line-events-widget-test-plan__doc457.md>) — similar text 0.26 · 3 title words · 2 filename words · same kind/folder <!-- rel:457 -->
- [Test Plan for Conflict Prevention for Add Multiple Line Events Tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-for-conflict-prevention-for-add-multiple-line-events-tool-in-arcgis__doc668.md>) — similar text 0.07 · 3 title words · same kind/surface/folder <!-- rel:668 -->
- [Splitting Events in ArcGIS Pro - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/splitting-events-in-arcgis-pro-test-plan__doc491.md>) — similar text 0.22 · 1 title word · same kind/surface/folder <!-- rel:491 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)
<!-- docs:end -->

---

## Slide 1

Create multiple line events: Test Plan

| Networks Types |
| --- |
| Network with user created RouteID Network with auto-populated RouteID Network with Auto-populated RouteID supporting lines (UN) |

| Attribute set combinations |
| --- |
|  |

| Database Types |
| --- |
| Branched versioning FS |

| Event Types |
| --- |
| Line Event Line Event spanning |

| Contains Events from | Network in 2 nd pane | Result |
| --- | --- | --- |
| Non-Line Network (N1) | Same Network (N1) | Add Events |
| Line Network (N2) | Same Network (N2) | Add Events |
| Non-Line Network (N1) | Different Non-Line Network (N3) | No Events to add - error message |
|  |  |  |
| Line Network (N2) | Different Line Network (N4) | No Events to add - error message |
| Multiple Networks Non-Line (N1,N3) | Network (N1) | Add Events for layers registered with N1 only |
| Multiple Networks Line and Non-Line (N1,N2) | Network (N1) | Add Events for layers registered with N1 only |
| Non-Line Network (N1) – Only one Event layer in the attribute set | Same Network (N1) | Add Events |

| Network |
| --- |
| Verify that the Network dropdown contains only the networks available in the map Verify that the no Network is selected initially |

![image1.png](../media/doc253_image1.png)

## Slide 2

| From Route |
| --- |
| Verify the route flashes 3 times, Once it is chosen on the map using the route picker and is not kept selected Verify the ‘Route Name” is displayed instead of Route ID for the Networks configured with route name RouteID / Route Name and Measure should be empty until the user types or select using the picker tools Verify that the route selector UI is shown when the user clicks a location with the route picker that has more than one route at that location Verify that the route selector UI is shown when the user types in a Route ID/Name which has more than one time-slices Verify the route and measure are displayed on hover when the user selects either the Route or Measure pickers to interact with the map For Line Networks, the Route Name drop-down shows the routes in line order for the selected line |

| From Measure |
| --- |
| Verify that the measure picker is shown when the user picks a location where we have multiple measures Verify that the measures can be typed Provide a measure with 10 decimal places where only 7 decimal places are allowed and verify that the measure is truncated properly Verify the snapping with route and measure picker Verify that the measure units are set to the network’s units Provide measures in stationing format. Note that the user may be thinking that the measure units are in feet. Before selecting the route name or measure, change the units to meters (the Network units are Miles) and pick the route and measure values and ensure that the measures units are not changed WRT the test above change the units to miles, do not change the measure value and validate the value on the units of miles Verify the green dot at the location, when a measure on a route is selected on the map using the measure picker. The green dot’s location depends upon the measure value. |

| Line Name |
| --- |
| Only valid for line Networks |

![image1.png](../media/doc253_image1.png)

## Slide 3

| To Route |
| --- |
| For a non-line Network, the To Route ID is same as the From Route ID and it cannot be changed Verify the route flashes 3 times, Once it is chosen on the map using the route picker Verify the ‘Route Name” is displayed instead of Route ID for the Network configured with route name. Valid only for line Network. Route ID / Route Name and Measure should be empty until the user types or select using the picker tools Verify that the route selector UI is shown when the user clicks a location with the route picker that has more than one route at that location Verify that the route selector UI is shown when the user types in a RouteId /Name which has more than one time-slices For Line Networks, the Route ID drop-down shows the routes in line order for the selected line |

| To Measure |
| --- |
| Verify that the measure picker is shown when the user picks a location where we have multiple measures. Verify that the measures can be typed Provide a measure with 9 decimal places where only 7 decimal places are allowed and verify that the measure is truncated properly Verify the snapping with route and measure picker Verify that the measure units are set to the network units Provide some measures in stationing format Before selecting the route name or measure, change the units to meters (the Network units are Miles) and pick the route and measure values and ensure that the measures units are not changed WRT the test above change the units to miles, do not change the measure value and validate the value on the units of miles Verify the red dot at the location, when a measure on a route is selected on the map using the measure picker or typing the value |

![image1.png](../media/doc253_image1.png)

## Slide 4

| Start Date |
| --- |
| Verify that the Start Date text box is populated with the current date |

| End Date |
| --- |
| By default, End Date should be empty. |

| Managing attributes |
| --- |
| Verify that the following fields are supported: Double Text Date GUID Short Coded value domains Range domains Attribute rules Contingent values Subtypes No nullable fields Fields with default values defined Fields with default values defined when configuring attribute sets In case of any errors in the attribute fields, verify that the error message is correct/make sense when hovering over the red graphic |

![image1.png](../media/doc253_image1.png) ![image2.png](../media/doc253_image2.png)

## Slide 5

| Errors |
| --- |
|  |

|  | Test | Error Message |
| --- | --- | --- |
| 1 | Do not fill anything in the second pane and click Next | Please select a network |
| 2 | Fill the Network and click Next | Please enter the Route ID |
| 3 | Line Name missing when a Line Network is selected | Please enter the Line Name |
| 4 | Typed From Route does not exist in the Network | Invalid Route ID/name |
| 5 | Typed To Route does not exist in the Network | Invalid Route ID/name |
| 6 | From Route is missing | enter the Route ID |
| 7 | To Route is missing | enter the Route ID |
| 8 | Type text in the from measure field | Invalid Measure |
| 9 | Type text in the To measure field | Invalid Measure |
| 10 | Type 0.2.2. in the To measure field | Invalid measure |

|  | Test | Error Message |
| --- | --- | --- |
| 11 | Type 0.2.2. in the To measure field | Invalid measure |
| 12 | Start Date < End Date | Start date cannot be after the end date |
| 13 | Start Date = End Date | Start date and end date cannot be same |
| 14 | From M = To M in non-spanning event | From measure cannot be equal to the to measure |
| 15 | From M > To M in non-spanning event | From measure cannot be more than the to measure |
| 16 | From RID and to RID do not belong the same line | The route does not belong to <Line Name> |
| 17 | The From Route does not exist within the range of Start and End Dates | Route ID does not exist in the selected Network |
| 18 | The To Route does not exist within the range of Start and End Dates | Route ID does not exist in the selected Network |
| 19 | Click at a location where no route exists using the Route ID picker tool | No error message. Nothing happens |
| 20 | Measure for uncalibrated route | Invalid Measure |

![image1.png](../media/doc253_image1.png)

## Slide 6

| Errors |
| --- |
|  |

|  | Test | Error Message |
| --- | --- | --- |
| 21 | Start Date not in date format | Invalid date |
| 22 | End Date not in date format | Invalid date |
| 23 | Nothing is selected in the third pane and run is clicked | No attribute added |
| 24 | No Start Date provided | Provide a start date |

| Misc. |
| --- |
| Two Networks exist, the 2 nd pane is filled up and then the network is changed. Clear the form. The 2 nd pane is filled up and then the Line Name is changed. Update the From and To Routes and validate the measures and dates. The 2 nd pane is filled up and then the From RID is changed. Do not clear the form, just validate the inputs based on the new from RID. The 2 nd is filled up and then the To RID is changed. Do not clear the form, just validate the inputs based on the new To RID. The whole 2 nd and 3 rd panes are filled up and then Network is changed. Clear the form. The whole 2 nd and 3 rd panes are filled up and you are on the 3 rd pane. Now click back to 1 st pane and then come back to the 3 rd , nothing should change. Create an attribute set and then add multiple line events using that attribute set. |

![image1.png](../media/doc253_image1.png)

## Slide 7

![Diagram drawn from the slide's own shapes: 2 nodes, 5 connectors.](../media/doc253_slide7_fig1.svg)

|  | Route ID | From Date | To Date | From Measure | To Measure | Code |
| --- | --- | --- | --- | --- | --- | --- |
|  | R1 | 1/1/2000 | Null | 12 | 15 | A |
|  | R1 | 1/1/2000 | Null | 12 | 15 | 12 |
|  | R1 | 1/1/2000 | Null | 12 | 15 | 8R |
|  | R1 | 1/1/2000 | Null | 12 | 15 | 1-345-2 |

![Measured route diagram drawn from the slide's own shapes, measures 1 to 5.](../media/doc253_slide7_fig2.svg)

|  | From R ID | From Measure | To RID | To Measure | From Date | To Date | Code |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | R1 | 1 | R3 | 15 | 1/1/2000 | Null | A |
|  | R1 | 1 | R3 | 15 | 1/1/2000 | Null | 12 |
|  | R1 | 1 | R3 | 15 | 1/1/2000 | Null | 8R |
|  | R1 | 1 | R3 | 15 | 1/1/2000 | Null | 1-345 |

Add a 3D case: Will do that for testing
