# Adding Point Events to Dominant Routes

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [AddPtDomi_RH.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5810_Add-Point-Dominant-Route/AddPtDomi_RH.docx>) |
| **Edited** | 2024-09-10 00:02 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Adding Point Events to Dominant Routes"
source_file: "AddPtDomi_RH.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5810_Add-Point-Dominant-Route/AddPtDomi_RH.docx"
doc_id: 310
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2024-09-10T00:02:40.4498811Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["point event", "dominant route", "concurrent routes", "route dominance", "route concurrency", "event attributes", "measure"]
tools: ["Add Point Event", "Add Multiple Point Events"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":309,"file":"adding-point-events-to-dominant-routes__doc309.md","s":8.362},{"doc":301,"file":"adding-linear-events-to-dominant-routes__doc301.md","s":5.475},{"doc":326,"file":"add-linear-events-to-dominant-routes__doc326.md","s":5.435},{"doc":234,"file":"add-point-events-by-location-offset__doc234.md","s":4.013},{"doc":235,"file":"add-point-events-by-location-offset__doc235.md","s":4.001}]
```
-->

## Summary

This document explains how to add point events to dominant routes in networks with concurrent routes using ArcGIS Pro. It covers route dominance rules, the process of adding point events with time slices, and managing event attributes. The document includes examples and detailed steps for using the Add Point Event tool and handling route concurrency scenarios.

## Related documents

<!-- related:begin -->
- [Adding Point Events to Dominant Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/adding-point-events-to-dominant-routes__doc309.md>) — similar text 0.76 · 5 title words · 2 filename words · same kind/surface/folder <!-- rel:309 -->
- [Adding Linear Events to Dominant Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/adding-linear-events-to-dominant-routes__doc301.md>) — similar text 0.45 · 4 title words · 1 filename word · same kind/surface <!-- rel:301 -->
- [Add Linear Events to Dominant Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-linear-events-to-dominant-routes__doc326.md>) — similar text 0.46 · 3 title words · 1 filename word · same kind/surface <!-- rel:326 -->
- [Add Point Events by Location Offset](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-point-events-by-location-offset__doc234.md>) — similar text 0.33 · 2 title words · 1 filename word · same kind/surface <!-- rel:234 -->
- [Add Point Events by Location Offset](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-point-events-by-location-offset__doc235.md>) — similar text 0.33 · 2 title words · 1 filename word · same kind/surface <!-- rel:235 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add multiple point events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/add-multiple-point-events.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Adding point events to dominant routes
You can add point events to dominant routes in case route concurrences exist.

### Concurrent routes
Concurrent routes are routes that share the same centerlines; that is, they travel the same pavement but are modeled with different measures. This relationship may exist to model two routes with different directions of calibration, to model different directions of travel on the highway, or to model locations on highways where multiple routes converge into a common roadway for a subset of their paths.
You can configure a set of rules to determine the dominant route in a network where there are concurrent routes. As events are usually associated with a dominant route, the dominant rules are needed for event editors to identify the dominant route, and add and edit events on the correct route location when multiple routes overlap.
You can add point events to dominant routes in Add Point Event and Add Multiple Point Events tools. For example, in the following graphic and tables, there are two routes with route IDs: 100 and 200. The concurrent routes have opposite directions and different ranges in time. (use title as hover text)

| Route ID | From Date | To Date |
| --- | --- | --- |
| 100 | 1/1/2000 | Null |
| 200 | 1/1/20 1 0 | Null |

The route dominance rule is set as Greater Alphanumeric on Route ID. Using this condition, route 200 is the dominant route, and route 100 is the subordinate route. (Hover text: Route Dominance Properties)

For example, you want to add point events at 2 locations on route 100. At Location 1, since no other route exists at that point, the event will be added to route 100. At Location 2, route 100 is the only route that exists until 1/1/2010, so the event is added to route 100 from 1/1/2000 to 1/1/2010/ Starting 1/1/2010. route 200 has a greater order of dominance, so the event will be added to route 200. Since the measures of the two routes are different at the event location, the event has different measures in different time slices.

| Point Event | Route ID | Measure | From Date | To Date |  |
| --- | --- | --- | --- | --- | --- |
| 1 | 100 | 10 | 1/1/2000 | <Null> |  |
| 2 | 100 | 45 | 1/1/2000 | 1/1/2010 |  |
| 2 | 200 | 25 | 1/1/2010 | <Null> |  |

(use title as hover text)

Note:
Route dominance rules should be configured to access this functionality.
When adding multiple point events, the events in the Attribute Set should belong to the same network for which the Route ID is selected.
By default, events are added to the dominant route, but you can also choose to add events on subordinate routes.

### Add point events to dominant routes
Complete the following steps to add point events to dominant routes. In the example below, a bridge point event (point event B in the table above) is added.

- Open the map in ArcGIS Pro and zoom in to the location where you want to add the point event.
- On the Location Referencing tab, in the Events group, click Add > Point Event .
The Add Point Event pane appears. The Method drop-down list is populated with the Route and Measure value by default.
Note:
Click the Method drop-down arrow to choose another method.
3. Click Next.
The Route and Measure fields appear in the Add Point Event pane.

- Click the Event Layer drop-down arrow and choose the point event layer where you want to add the event.
The selected Network value is based on the selected event layer.

- Specify a route by doing either of the following:
  - Provide a route ID in the Route ID text box.
  - Click Choose route from map , and click on the route where you want to add the point event.
The measure is initially populated using the route location where you clicked.
Tip:
After clicking Choose route from map  or Choose measure from map , hover over the route to see the route and measure at the location of the pointer.
You can choose a scale for the display of route and measures.
Note:
If a message regarding acquiring locks or reconciling appears, conflict prevention is enabled.

- Specify a new location by doing one of the following:
  - Provide the value in the Measure text box.
  - Click Choose measure from map  and click the measure value along the route on the map.
Once the measure is provided, a green dot appears on the map at that measure location.
Note:
If you've chosen another method, a green dot appears on the map at the measure location that the input of the chosen method is translated to.

- The start date default value is today's date, but you can change the date by doing one of the following:
  - Provide the start date in the Start Date text box.
  - Click Calendar  and choose the start date.
  - Check the Route start date check box.
- Optionally, specify the end date for the point event by doing one of the following:
  - Provide the end date in the End Date text box.
  - Click Calendar  and choose the end date.
  - Check the Route end date check box.
If no end date is provided, the event remains valid from the event start date into the future.

- Check the Add event to dominant route check box. (Hover text: Add Point Event pane)
- Click Next.
The route concurrency pane appears. (Hover text: Route concurrency pane)
Note:
If the Don't allow override of event placement of dominant routes is checked in Location Referencing options (link to latest https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/set-location-referencing-options.htm ), and the Add event to dominant route check box is checked, the route concurrency pane does not show and events will be automatically added to the dominant route.
For more details about the Don't allow override of event placement of dominant routes option, click the link above.

(Add number annotation to screenshots above. Connect with Claire Wang or Rahul Rakshit if you need help)
The time dropdown shows the time slice for the particular concurrency shown below. (1) If there is only one time slice for the concurrency scenario, the dropdown is disabled. (2) To configure event adding in another time slice, choose another time slice in the dropdown.
As an example, routes 100 and 200 have a From Date value of 1/1/2000, and route 300 has a From Date value of 1/1/2010. Therefore, if you choose 1/1/2000 as the start date of the event, there will be two time ranges:
1/1/2000–1/1/2010, when only route 100 exists.
1/1/2010–Null, when both routes existed.
(3)The Route ID label shows the selected route from the previous pane.
(4)The Measure column shows the measure value in the network's default measure unit on the selected route from the previous pane.
(5)The Selected Route columns show the Route ID and Measure for each dominant route where the events will be added.
(6) A black route ID without a drop-down arrow signifies that there was a single route in that location. (7) A blue route ID with a drop-down arrow signifies that there are concurrent routes in that location, and the blue route is chosen by the software based on the route dominance rules. You can choose any other route using the drop-down arrow, and the chosen subordinate route is shown in black.
Note:
If you've chosen another method, the Measure values indicate the measure of the location from the input of the chosen method.
(8) The Reset button resets the Selected Route to the dominant route based on the route dominance rules across all time slices.
For the 1/1/2000 – 1/1/2010 time slice, the event can only be added on route 100.  For the 1/1/2010 – null time slice, you would choose route 200.  The Measure value along the selected route is the measure for that route at the same location in the specific time range.

- Click Next.
The attributes for the chosen point event layer appear under Manage Attributes. (Hover text: Mange attributes table)

Note:
Coded value, range domains, and subtypes are supported when configured for any field in the Attribute-Value table.

- Provide attribute information for the new event in the table.
Tip:
You can click Copy Attribute Values  and click an existing point event belonging to the same event layer on the map to copy event attributes from that point.

- Click Run.
A confirmation message appears once the new point event is added and appears on the map.
The following table provides details about the Bridge Point event:

| Event | Route ID | From Date | To Date | Measure | Location Error | Record State | NBI | Owner | Date Attribute Effective | BackStation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event 2 | 1 00 | 1/1/2000 | 1/1/2010 | 45 | No Error | Active | <Null> | County | 1/1/2000 | <Null> |
| Event 2 | 2 00 | 1/1/2010 | <Null> | 25 | No Error | Active | <Null> | County | 1/1/2000 | <Null> |

The following diagram shows the route and the associated event after the edit: (use title as hover text)

![image1.png](../media/doc646_image1.png) ![image2.png](../media/doc646_image2.png) ![image3.png](../media/doc646_image3.png) ![image4.png](../media/doc646_image4.png) ![image5.png](../media/doc646_image5.png) ![image7.png](../media/doc646_image7.png) ![image8.png](../media/doc646_image8.png) ![image9.png](../media/doc646_image9.png) ![image10.png](../media/doc646_image10.png) ![image11.png](../media/doc646_image11.png) ![image12.png](../media/doc646_image12.png) ![image13.png](../media/doc646_image13.png)
