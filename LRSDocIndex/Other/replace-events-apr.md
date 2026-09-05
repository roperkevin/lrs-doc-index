# Replace Events

| Field | Value |
| --- | --- |
| **Doc** | 122 · Other · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [APR_replaceEvents.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6643_replaceEvents/APR_replaceEvents.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-09-16 04:01 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event replacement · pipe replacement · retire events · line events · point events · referent offset · route and measure · coordinates · location offset · conflict prevention · event editing |
| **Tools** | Replace Events pane · Configure Replace Events dialog box · Enable Referent Fields tool |

## Summary

This document explains the process of replacing events during pipe replacement using an event replacement configuration in ArcGIS Pro. It details the methods for locating measures, steps to perform event replacement, how referent offset fields are populated, and conditions for event editing with conflict prevention enabled.

## Related documents

<!-- related:begin -->
- [Replace Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/replace-events-rh.md>) — similar text 0.70 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:123 s=9.32 -->
- [Add Point Events by Location Offset](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-point-events-by-location-offset-apr.md>) — similar text 0.36 · 1 title word · 2 filename words · same kind/surface <!-- rel:235 s=4.337 -->
- [Add multiple line events by route and measure](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6134-add-multiple-line-events-by-route-and-measure.md>) — similar text 0.42 · 1 title word · 2 filename words · same kind/surface <!-- rel:120 s=4.131 -->
- [Add Point Events by Location Offset](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-point-events-by-location-offset-rh.md>) — similar text 0.37 · 1 title word · 1 filename word · same kind/surface <!-- rel:234 s=4.098 -->
- [Create and modify LRS events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-and-modify-lrs-events-apr.md>) — similar text 0.23 · 1 title word · 2 filename words · same kind/surface <!-- rel:262 s=3.704 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior for route retirement](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-behavior-for-route-retirement.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Replace Events pane](https://www.google.com/search?q=%22Replace%20Events%20pane%22+site%3Adoc.esri.com) · [Configure Replace Events dialog box](https://www.google.com/search?q=%22Configure%20Replace%20Events%20dialog%20box%22+site%3Adoc.esri.com) · [Enable Referent Fields tool](https://www.google.com/search?q=%22Enable%20Referent%20Fields%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Replace events
During pipe replacement, events that were part of the replaced pipe can be updated using an event replacement configuration that groups event layers so that multiple events can be retired or replaced by new events in a single editing operation.
You must create an event replacement configuration using the Configure Replace Events dialog box before using the Replace Events pane.

### Event replacement scenario
In the following example, the events in the three sections of the Configure Replace Events dialog box are exclusive. When events are replaced using a saved configuration, the following occurs:

- Events in the Event Layers list are left as is.
- Events in the Retire Events list are retired using the date provided in the Replace Events pane. Retirement is valid for both point and line events.
- Events in the Retire and Replace Events list are retired and re-created using the dates provided in the Replace Events pane. Only line events can be retired and replaced. If the replacement does not cover the entire line event, it will be segmented with time slices.
Tip:
This example configuration is used in the event replacement steps below.

All the line events that are configured in the Retire and Replace Events list of the Configure Replace Events dialog box appear in Manage Attributes section when the configuration is chosen using the Replace Events pane.

### Event replacement methods
The following table provides details on the methods used to replace events in the procedure below:

##### Methods for locating the measures

| Method | Description | Additional feature classes needed in the service | Additional information |
| --- | --- | --- | --- |
| Route and measure | The measure is located based on the measure values from the selected route. | None | Add line events by route and measure |
| Coordinates | The measure is located by x,y- and z-coordinates. | None | Add line events by coordinates |
| Location Offset | The measure is located as an offset distance from a location. | LRS intersection or point event layers registered to the specified network, or non-LRS point feature layers | Add line events by location offset |

### Event replacement
To replace events using an event replacement configuration, complete the following steps:

1.  Open a map in ArcGIS Pro and zoom to the location where you want to replace events.

1. On the Location Referencing tab, in the Events group, click Replace .

- The Replace Events pane appears.
- Route and Measure is the default method in the From Method and To Method drop-down menus.

1. Choose the methods to locate the events to replace from the From Method and To Method drop-down lists.

- Note:
- You can use a combination of any of the event replacement methods to locate the from measure and to measure. For example, you can use Route and measure to choose the from measure value, and use Coordinates to define the to measure value along the route on the map.

1.  Click Next.

- The specified methods appear in the From and To sections. For example, From: Route and Measure and To: Coordinates appear if the specified start method is Route and Measure and the specified end method is Coordinates.
- If the Coordinates method is specified, choose a spatial reference and provide the measure values as coordinates using any of the provided tools.
- If the Location Offset method is specified, choose an eligible point feature layer and provide the measure values as an offset from a location using any of the provided tools.

1. Click the Network drop-down arrow and choose an LRS Network.

- Note:
- The LRS Network must be published as a feature service layer.

1. Provide the name of the line where the events are located in the Line Name text box.

- Click Choose line from map  and click a line on the map.

1. In the From: Route and Measure section, do one of the following to specify the route where the replacement's start measure is located:

  - Provide the route's name in the Route Name text box.
  - Click Choose route from map  and click the route on the map.

1. In the From: Route and Measure section, provide the measure by doing any of the following:

  - Provide the start measure in the Measure text box.
  - Click Choose measure from map  and click the start measure location on the map.
  - Check the Use route start measure check box to use the route's start measure as the From measure value for the event replacement.
- A green dot appears at the selected location on the map.

1. Optionally, in the From: Route and Measure section, choose a unit of measurement using the drop-down arrow.

1. In the To: Route and Measure section, do one of the following to specify the route where the replacement's end measure is located:

- Note:
- If there is only one route, the text box in this section is inactive.
  - Provide the route's name in the Route Name text box.
  - Click Choose route from map  and click the end measure location on the map.

1. In the To: Route and Measure section, do one of the following to specify the end measure for the event replacement along the route:

  - Provide the end measure in the Measure text box.
  - Click Choose measure from map  and click the end measure location on the map.
  - Check the Use route end measure check box to use the route's end measure as the To measure value for the event replacement.
- A red dot appears at the selected location on the map.
- Note:
- The events located between the specified start and end measure values are updated as follows:
  - The events in the Retire Events list are retired.
  - The events in the Retire and Replace Events list are retired and replaced by new events.
- If the replacement does not cover the entire event, it will be segmented with time slices.

1. Optionally, in the To: Route and Measure section, choose a unit of measurement using the drop-down arrow.

1. Specify the date to define the start date of the events that are replaced by doing one of the following:

  - Provide the date in the Start Date text box.
  - Choose the start date using the Calendar .
  - Check the Route start date check box to use the route start date.
- Note:
- The start date is used as follows:
  - Retirement Date—For events in the Retire Events list
  - Retirement Date—For events in the Retire and Replace Events list
  - Start Date—For the replacement events in the Retire and Replace Events list

1. Optionally, specify the date to define the end date of the events that are replaced by doing one of the following:

  - Provide the date in the End Date text box.
  - Choose the end date using the Calendar .
  - Check the Route end date check box to use the route end date.
- Note:
- The end date is used as the end date for the replacement events in the Retire and Replace list.

1.  Click Next.

- The Manage Attributes section appears.
- Note:
- If no events are configured for retirement or for retirement and replacement, a message appears.

1. Click the Replace Events drop-down arrow and choose an event replacement configuration.

- The editable attributes for each of the configured event layers are listed. Events configured for retirement are not listed because they are not replaced.
- Tip:
- If you don't want to retire an event, update the configuration to leave it as is. To leave an event as is, it must not appear in either the Retire Events list or Retire and Replace Events list before event replacement is run.

1. Provide the replacement values in the attribute fields.

1. Click Run to complete the event replacement for the specified route or route segment.

  - The events in the Retire Events list are retired.
  - The events in the Retire and Replace Events list are retired, re-created, and displayed on the map.

### Referent offset when using event replacement
The Pipeline Referencing events data model supports the configuration of referent event fields and their enablement using the Enable Referent Fields tool. Once referent fields are configured and enabled in a layer, referent locations are populated and persisted in that layer when events are replaced.
When line events are replaced using the Route and Measure method, the parent LRS Network is used as the FromRefMethod and ToRefMethod values, the route is used as the FromRefLocation and ToRefLocation values, and the FromRefOffset and ToRefOffset fields are populated with the route measures.
When line events are replaced using the Coordinates method, X/Y is used as the FromRefMethod and ToRefMethod values, geographic coordinates are used as the FromRefLocation and ToRefLocation values, and the FromRefOffset and ToRefOffset fields are populated with 0.
When line events are replaced using the Location Offset method in a referent-enabled layer, the point feature layer's name is used as the RefMethod value. The RefLocation value is Intersection ID if the point feature layer used is an LRS intersection; otherwise, the value is Object ID. The FromRefOffset and ToRefOffset fields are populated with the input offset measure values.
The following table provides details on how event referent fields are populated based on the replacement method:

| Method | From Referent Method | From Referent Location | From Referent Offset | To Referent Method | To Referent Location | To Referent Offset |
| --- | --- | --- | --- | --- | --- | --- |
| Route and Measure | Parent LRS Network | Route ID | Measure value | Parent LRS Network | Route ID | Measure value |
| Coordinates | X/Y | Geographic coordinates | 0 | X/Y | Geographic coordinates | 0 |
| Location Offset | Point feature layer's name | Intersection ID or Object ID | Input offset measure values | Point feature layer's name | Intersection ID or Object ID | Input offset measure values |

The examples below demonstrate replacing events that have referent values enabled.

#### Before replacing events using route and measure
In the following example, there are multiple routes across a line. A point event and a spanning line event already have referents populated using the Route and Measure method. The Anomaly point event is retired, and the Consequence Segment line event is retired and replaced using updated information.
The following diagram shows the routes and events before event replacement:

The following table provides details about the routes before event replacement:

| Route ID | Line Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| L1 R1 | L1 | 1/1/2000 | <Null> | 0 | 4 |
| L1 R2 | L1 | 1/1/2000 | <Null> | 8 | 12 |
| L1 R3 | L1 | 1/1/2000 | <Null> | 1 4 | 18 |

The following table provides details about the event referent fields of the Anomaly point event before event replacement:

| RefMethod | RefLocation | RefOffset |
| --- | --- | --- |
| Pipe Series Network | L1 R 2 | 1 0 |

The following table shows the other event fields of the Anomaly point event before event replacement:

| Event ID | Route ID | From Date | To Date | Measure | Anomaly Type |
| --- | --- | --- | --- | --- | --- |
| Anomaly 1 | L1 R 2 | 1/1/2000 | <Null> | 10 | Dent |

The following table provides details about the event referent fields of the Consequence Segment line event before event replacement:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | ToRefOffset |
| --- | --- | --- | --- | --- | --- |
| Pipe Series Network | L1 R1 | 0 | Pipe Series Network | L1 R 3 | 18 |

The following table shows the other event fields of the Consequence Segment line event before event replacement:

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CS1 | L1 R1 | L1 R3 | 1/1/2000 | <Null> | 0 | 18 | Conceptual |

#### After replacing events using route and measure
The following diagram shows the routes and events after event replacement:
The Anomaly point event is retired as of 1/1/2005, and the Consequence Segment line event is retired and replaced as of 1/1/2005.
The following table provides details about the event referent fields of the Anomaly point event after event replacement:

| RefMethod | RefLocation | RefOffset |
| --- | --- | --- |
| Pipe Series Network | L1 R 2 | 10 |

The following tables provide details about the other event fields of the Anomaly point event after event replacement:

| Event ID | Route ID | From Date | To Date | Measure | Anomaly Type |
| --- | --- | --- | --- | --- | --- |
| Anomaly 1 | L1 R 2 | 1/1/2000 | 1/1/2005 | 10 | Dent |

The following table provides details about the event referent fields of the Consequence Segment line event after event replacement:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | ToRefOffset |
| --- | --- | --- | --- | --- | --- |
| Pipe Series Network | L1 R1 | 0 | Pipe Series Network | L1 R 3 | 18 |

The following tables provide details about the other event fields of the Consequence Segment line event after event replacement:

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CS1 | L1 R1 | L1 R3 | 1/1/2000 | 1/1/2005 | 0 | 18 | Conceptual |
| CS1 | L1 R1 | L1 R3 | 1/1/2005 | <Null> | 0 | 18 | Active |

#### Before replacing events using coordinates
In the following example, there are multiple routes across a line. A point event and a spanning line event already have referents populated using the Coordinates method. The Anomaly point event is retired, and the Consequence Segment line event is retired and replaced using updated information.
The following diagram shows the routes and events before event replacement:

The following table provides details about the routes before event replacement:

| Route ID | Line Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| L1 R1 | L1 | 1/1/2000 | <Null> | 0 | 4 |
| L1 R2 | L1 | 1/1/2000 | <Null> | 8 | 12 |
| L1 R3 | L1 | 1/1/2000 | <Null> | 1 4 | 18 |

The following table provides details about the event referent fields of the Anomaly point event before event replacement:

| RefMethod | RefLocation | RefOffset |
| --- | --- | --- |
| Pipe Series N etwork | -95., 31., 0 | 0 |

The following table shows the other event fields of the Anomaly point event before event replacement:

| Event ID | Route ID | From Date | To Date | Measure | Anomaly Type |
| --- | --- | --- | --- | --- | --- |
| Anomaly1 | L1R2 | 1/1/2000 | <Null> | 10 | Dent |

The following table provides details about the event referent fields of the Consequence Segment line event before event replacement:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | ToRefOffset |
| --- | --- | --- | --- | --- | --- |
| X/Y | -95., 31., 0 | 0 | X/Y | -95., 31., 0 | 0 |

The following table shows the other event fields of the Consequence Segment line event before event replacement:

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CS1 | L1R1 | L1R3 | 1/1/2000 | <Null> | 0 | 18 | Conceptual |

#### After replacing events using coordinates
The following diagram shows the routes and events after event replacement:

The Anomaly point event is retired as of 1/1/2005, and the Consequence Segment line event is retired and replaced as of 1/1/2005.
The following table provides details about the event referent fields of the Anomaly point event after event replacement:

| RefMethod | RefLocation | RefOffset |
| --- | --- | --- |
| X/Y | -95., 31., 0 | 0 |

The following tables provide details about the other event fields of the Anomaly point event after event replacement:

| Event ID | Route ID | From Date | To Date | Measure | Anomaly Type |
| --- | --- | --- | --- | --- | --- |
| Anomaly1 | L1R2 | 1/1/2000 | 1/1/2005 | 10 | Dent |

The following table provides details about the event referent fields of the Consequence Segment line event after event replacement:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | ToRefOffset |
| --- | --- | --- | --- | --- | --- |
| X/Y | -95., 31., 0 | 0 | X/Y | -95., 31., 0 | 0 |

The following tables provide details about the other event fields of the Consequence Segment line event after event replacement:

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CS1 | L1R1 | L1R3 | 1/1/2000 | 1/1/2005 | 0 | 18 | Conceptual |
| CS1 | L1R1 | L1R3 | 1/1/2005 | <Null> | 0 | 18 | Active |

#### Before replacing events using location offset
In the following example, there are multiple routes across a line. A point event and a spanning line event already have referents populated using the Location Offset method. The Anomaly point event is retired, and the Consequence Segment line event is retired and replaced using updated information.
The following diagram shows the routes, events, and intersections before event replacement:

The following table provides details about the routes with events before event replacement:

| Route ID | Line Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| L1R1 | L1 | 1/1/2000 | <Null> | 0 | 4 |
| L1R2 | L1 | 1/1/2000 | <Null> | 8 | 12 |
| L1R3 | L1 | 1/1/2000 | <Null> | 14 | 18 |

The following table provides details about the event referent fields of the Anomaly point event before event replacement:

| RefMethod | RefLocation | RefOffset |
| --- | --- | --- |
| Pipe Series Network Intersections | Intersection1 | - 1 .5 |

The following table shows the other event fields of the Anomaly point event before event replacement:

| Event ID | Route ID | From Date | To Date | Measure | Anomaly Type |
| --- | --- | --- | --- | --- | --- |
| Anomaly1 | L1R 1 | 1/1/2000 | <Null> | 2 | Dent |

The following table provides details about the event referent fields of the Consequence Segment line event before event replacement:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | ToRefOffset |
| --- | --- | --- | --- | --- | --- |
| Pipe Series Network Intersections | Intersection 1 | - 3 .5 | Pipe Series Network Intersections | Intersection2 | 3 .5 |

The following table shows the other event fields of the Consequence Segment line event before event replacement:

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CS1 | L1R1 | L1R3 | 1/1/2000 | <Null> | 0 | 18 | Conceptual |

#### After replacing events using location offset
The following diagram shows the routes, events, and intersections after event replacement:

The Anomaly point event is retired as of 1/1/2005, and the Consequence Segment line event is retired and replaced as of 1/1/2005.
The following table provides details about the event referent fields of the Anomaly point event after event replacement:

| RefMethod | RefLocation | RefOffset |
| --- | --- | --- |
| Pipe Series Network Intersections | Intersection1 | -1 .5 |

The following tables provide details about the other event fields of the Anomaly point event after event replacement:

| Event ID | Route ID | From Date | To Date | Measure | Anomaly Type |
| --- | --- | --- | --- | --- | --- |
| Anomaly1 | L1R 1 | 1/1/2000 | 1/1/2005 | 2 | Dent |

The following table provides details about the event referent fields of the Consequence Segment line event after event replacement:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | ToRefOffset |
| --- | --- | --- | --- | --- | --- |
| Pipe Series Network Intersections | Intersection 1 | - 3 .5 | Pipe Series Network Intersections | Intersection 2 | 3 .5 |

The following tables provide details about the other event fields of the Consequence Segment line event after event replacement:

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CS1 | L1R1 | L1R3 | 1/1/2000 | 1/1/2005 | 0 | 18 | Conceptual |
| CS1 | L1R1 | L1R3 | 1/1/2005 | <Null> | 0 | 18 | Active |

### Event editing with conflict prevention enabled
You can edit events after acquiring locks for event layers in the Replace Events pane under the following conditions:

- No one has a lock on the event layers in the Replace Events pane in any version of the feature service for the route on which the events are located.
- You have an existing event lock on event layers in the Replace Events pane in the same version of the feature service in which you are working.
You can't edit the events in the Replace Events pane under the following conditions:

- Some or all of the event layers in the Replace Events pane are locked by another person for the route on which the event is located.
- Some or all of the event layers in the Replace Events pane are locked by you but in a different version.
- The event is located on a route that is locked by another person.
- The event is located on a route that is locked by you but in a different version.

![Figure 1 — Event editing with conflict prevention enabled](../media/replace-events-apr/fig-01-event-editing-with-conflict-prevention.png)
![Figure 2 — Event editing with conflict prevention enabled](../media/replace-events-apr/fig-02-event-editing-with-conflict-prevention.png)
![Figure 3 — Event editing with conflict prevention enabled](../media/replace-events-apr/fig-03-event-editing-with-conflict-prevention.png)
![Figure 4 — Event editing with conflict prevention enabled](../media/replace-events-apr/fig-04-event-editing-with-conflict-prevention.png)
![Figure 5 — Event editing with conflict prevention enabled](../media/replace-events-apr/fig-05-event-editing-with-conflict-prevention.png)
![Figure 6 — Event editing with conflict prevention enabled](../media/replace-events-apr/fig-06-event-editing-with-conflict-prevention.png)
![Figure 7 — Event editing with conflict prevention enabled](../media/replace-events-apr/fig-07-event-editing-with-conflict-prevention.png)
![Figure 8 — Event editing with conflict prevention enabled](../media/replace-events-apr/fig-08-event-editing-with-conflict-prevention.png)
