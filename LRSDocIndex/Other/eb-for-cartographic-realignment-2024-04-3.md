# Event behavior for cartographic realignment

| Field | Value |
| --- | --- |
| **Doc** | 386 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [cartorealignRH_compare.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5748_EB_topics/cartorealignRH_compare.docx>) |
| **People** | author Claire Wang · PE — · dev — |
| **Edited** | 2024-04-14 01:49 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | cartographic realignment · event behavior · route geometry · event update · honor route measure · honor referent location · calibration |
| **Tools** | Apply Event Behaviors · Generate Intersections |

## Summary

This document explains the effects of cartographic realignment on route geometry and associated event behaviors in linear referencing systems. It details how events are updated based on configured behaviors such as Honor Route Measure and Honor Referent Location when route measures change. Examples illustrate the impact on routes and events before and after realignment, including scenarios with gapped routes and line networks with events spanning multiple routes.

## Related documents

<!-- related:begin -->
- [Event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-cartographic-realignment-apr-2024-03.md>) — similar text 0.68 · 4 title words · 1 filename word · same kind/surface <!-- rel:407 s=8.586 -->
- [Event Behavior for Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-cartographic-realignment-2024-04-4.md>) — similar text 0.81 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:387 s=7.984 -->
- [Event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-cartographic-realignment-2024-04.md>) — similar text 0.73 · 4 title words · 1 filename word · same kind/surface/folder <!-- rel:382 s=7.594 -->
- [Event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-cartographic-realignment-rh-2024-03.md>) — similar text 0.76 · 4 title words · 1 filename word · same kind/surface <!-- rel:406 s=7.216 -->
- [Event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-cartographic-realignment-2024-04-2.md>) — similar text 0.67 · 4 title words · 1 filename word · same kind/surface/folder <!-- rel:383 s=7.214 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Event behavior for cartographic realignment
Cartographic realignment is the method of updating the route geometry based on aerial imagery, as-built drawings, or input from field data collectors. To do this, you can directly modify the centerline that is associated with the route.
Learn more about applying cartographic realignment
Note:
Events are not updated until the Apply Event Behaviors tool is run after route edits. If you are using conflict prevention on branch versioned data, you are prompted to run Apply Event Behaviors before posting to the default version.

### Cartographic realignment scenario
When cartographic realignment occurs, events are impacted depending on the configured event behavior for each event layer. The following are the results of running the Apply Event Behaviors tool on event features:

| Behavior | Description |
| --- | --- |
| Honor Route Measure | Preserves the measure of the event and changes shape according to the route. |
| Honor Referent Location | Changes both measure and geographic location to maintain the referent location of the event using a persistent offset value. |

Note:
When Update route measures in cartographic realignment is enabled in a network in which cartographic realignment is performed, the route's measures can change after cartographic realignment. Subsequently, the configured cartographic realignment event behavior and calibrate event behavior are both applied to events in impacted sections on the route.
You can review the configured event behaviors per edit type by viewing LRS event properties.
For all examples in this topic, Update route measures in cartographic realignment is enabled.

### Route cartographic realignment results
In this example, the route Route1 is a gapped route and it is active from 1/1/2000. The cartographic realignment is set to occur on 1/1/2005 where the part of Route1 before the gap is lengthened by cartographic realignmentan incorrect curve is fixed. Route1's measures adjust to its new geometry as Update route measures in cartographic realignment is enabled for the network. The graphics and tables in the following sections demonstrate the route information before and after the cartographic realignment.

#### Before route cartographic realignment
The following image shows the route before cartographic realignment:. There is an intersection on Route1 where Route1 intersects the County boundary. The intersection is the referent location in the Honor Referent Location event behavior scenario below.
The following image shows the route before cartographic realignment. The network for the route is configured with the Euclidean Distance calibration rule.
The following table provides details about the eventroute and intersection before cartographic realignment:

| Route ID | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- |
| Route1 | 1/1/2000 | <Null> | 0 | 30 |

| Intersection ID | From Date | To Date | Route ID | Measure |
| --- | --- | --- | --- | --- |
| Intersection | 1/1/2000 | <Null> | Route1 | 12 |

#### After route cartographic realignment
The following image shows the route and intersection after cartographic realignment:

The following table provides details about the route and intersection after cartographic realignment:

| Route ID | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- |
| Route1 | 1/1/2000 | <Null> | 0 | 30 25 |

| Intersection ID | From Date | To Date | Route ID | Measure |
| --- | --- | --- | --- | --- |
| Intersection | 1/1/2000 | <Null> | Route1 | 1 3 |

Note:
When the centerlines are edited, all routes in all networks, across all times, are modified accordingly. Hence, Route1 does not get a new time slice, but its shape is changed in the existing time slice.
https://prodev.arcgis.com/en/pro-app/3.3/help/production/roads-highways/methods-for-calibrating-routes-with-physical-gaps.htm \hLearn more about calibration rules
The intersection's shape and measure are also updated after running https://prodev.arcgis.com/en/pro-app/latest/tool-reference/location-referencing/generate-intersections.htmGenerate Intersections. The intersection does not get a new time slice as its associated route does not time slice.

#### Events before route cartographic realignment
There is a point event and a line event on Route1 and both haveit has a starting date (From Date) of 1/1/2000. The following image shows the route and eventsevent before cartographic realignment:

The following tables provide details about the eventsevent before cartographic realignment:
Point event:

| Event | Route ID | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Point1 Event1 | Route1 | 1/1/2000 | <Null> | 10 1 7 |

Line event:

| Event | Route ID | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 5 | 25 |

The following sections detail how event behavior rules are enforced after running the Apply Event Behaviors tool with this route cartographic realignment scenario.
Note:
In all the scenarios below, Point1 is always configured with Honor Route Measure behavior, and Event1 is configured with different event behaviors.
For a line event, its start and end points follow the same cartographic realignment event behavior as a point event.

#### Honor Route Measure behavior
If the Update route measures in cartographic realignment parameter is enabled for the network and the route's measures are updated due to cartographic realignment, the resulting event behavior will be a combined behavior of the cartographic realignment behavior and the calibrate behavior. Events in the cartographic realignment area will move proportionally.
Note:
If the route measures have not changed because the Update route measures in cartographic realignment parameter is disabled for the network, the Honor Route Measure event behavior preserves the measures of the event and updates the event's location.
The following table shows the edit activities involved in the route edit and their corresponding event behaviors:

| Edit activity | Event behavior |
| --- | --- |
| Cartographic realignment | Honor Route Measure (both events) |
| Calibrate | Stay Put |

The route cartographic realignment described above has the following effects:

- Point1 was located on Route1 at the beginning of the gap. Because it is completely within cartographic realignment and the route's measures have changed, both the cartographic realignment Honor Route Measure and the calibrate Stay Put behaviors are applied. Point1 is still at the beginning of the gap and its measure is updated to 15 on Route1.
- Event1 was located on Route1 at measure 17. Because it isEvent1 is a multi-part event. The first part of Event1 starts from measure 5, which is the middle of the first part of Route1, and ends at measure 10 at the beginning of the gap. Because this part of Event1 is completely within cartographic realignment and the route's measures have changed, both the cartographic realignment Honor Route Measure and the calibrate Stay Put behaviors are applied. This part of Event1 is proportionally lengthened. It still starts from the middle of the first part of Route1 and ends at the beginning of the gap. The two corresponding measure values are changed to measure 7.5 and 15Event1's measure is updated proportionally to be at measure 14.2 on Route1, and its location is also updated to stay on Route1.
- The second part of Event1 covers half of the second part of Route1 after the gap, from measure 20 to 25 on Route1. This part of Route1 is not within the cartographic realignment and not calibrated, so no event behavior is applied. As a result, Event1's start measure is updated to 7.5, and its end measure remains 25 on Route1.
The following image shows the route and eventsevent after cartographic realignment:

Note:
Because cartographic realignment does not change a route's time slice, the time slices of the eventsevent on the route are not changed either.
The following tables provide details about the eventsevent after cartographic realignment:
Point event:

| Event | Route ID | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Point1 Event1 | Route1 | 1/1/2000 | <Null> | 15 1 4.2 |

Line event:

| Event | Route ID | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 7.5 | 25 |

#### Honor Referent Location behavior
IfThe Honor Referent Location event behavior preserves the Update route referent offset of the event and updates the event's geographic location and measures.
Events can have https://prodev.arcgis.com/en/pro-app/3.3/help/production/roads-highways/events-data-model.htm  \hevent referent fields to derive its location using referent location information. The following referent locations can be stored:

- Offset distance from any point feature in the geodatabase
- Offset distance from an intersection point feature
- Offset distance from a point event feature
- Offset distance from an x,y coordinate
- Offset distance from a station
The following table shows the edit activities involved in the route edit and their corresponding event behaviors:

| Edit activity | Event behavior |  |  |  |
| --- | --- | --- | --- | --- |
| Cartographic realignment | Honor Referent Location |  |  |  |
| Calibrate |  | Stay Put |  |  |

The following table shows referent fields in Event1:

| Event | Route ID | Ref Location | Ref Offset |
| --- | --- | --- | --- |
| Event1 | Route1 | Intersection | 5 |

The route  in cartographic realignment parameter is enabled for the network and the route measures are updated due to cartographic realignment, the described above has the following effects:

- Event1 was located 5 miles downstream of the intersection on Route1, resulting event behavior will bein a combined behaviormeasure of 17. After the cartographic realignment behavior and the calibrate behavior. Events in the is applied, the intersection's measure is updated to 13 on Route1. When the cartographic realignment area will move proportionallyHonor Referent Location behavior is applied to Event1, it still locates 5 miles downstream of the intersection. The measure of Event1 is updated to 18 on Route1.
The following image shows the route and event after cartographic realignment:
Note:
If route measures have not changed because the Update route measures in Because cartographic realignment parameter is disabled for the network, the Honor Referent Location event behavior preserves the referent offsetdoes not change a route's time slice, the time slices of the event and updates the event's geographic location and measures.
Events can have https://prodev.arcgis.com/en/pro-app/3.3/help/production/roads-highways/events-data-model.htm  \hevent referent fields to derive its location using referent location information. The following referent locations can be stored:

- Offset distance from any point feature in the geodatabase
- Offset distance from an intersection point feature
- Offset distance from a point event feature
- Offset distance from an x,y coordinate
- Offset distance from a station
The following table shows the edit activities involved in the route edit and their corresponding event behaviors:

| Edit activity | Event behavior |  |  |
| --- | --- | --- | --- |
| Cartographic realignment | Honor Route Measure (Point1) |  |  |
| Cartographic realignment | Honor Referent Location (Event1) |  |  |
| Calibrate |  | Stay Put |  |

The following table shows referent fields in Event1:

| Event | Route ID | From Ref Location | From Ref Offset | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | Point1 | -5 | Point1 | 5 |

The route cartographic realignment described above has the following effects:

- Point1 was located on Route1 at the beginning of the gap. Because it is completely within cartographic realignment and the route's measures have changed, both the cartographic realignment Honor Route Measure and the calibrate Stay Put behaviors the route are applied. Point1 is still at the beginning of the gap and its measure is updated to 15 on Route1not changed either.
- Event1 is a multi-part event. The first part of Event1 starts from measure 5, which is the middle of the first part of Route1, and ends at measure 10 at the beginning of the gap. Because this part of Event1 is completely within cartographic realignment and the route's measures have changed, both the cartographic realignment Honor Referent Location and the calibrate Stay Put behaviors are applied. The offset of this part of Event1 is proportionally lengthened, so Event1 becomes 7.5 units to the left of Point1, which locates measure 7.5 on Route1. This part of Event1 still ends at the beginning of the gap, which is measure 15 on Route1.
- The second part of Event1 covers half of the second part of Route1 after the gap, from measure 20 to 25 on Route1. This part of Route1 is not within the cartographic realignment and not calibrated, so no event behavior is applied. As a result, Event1's start measure value is updated to 7.5, and its end measure value remains 25, on Route1.
The following image shows the route and events after cartographic realignment:

The following tables provide details about the eventsevent after cartographic realignment:
Point event:

| Event | Route ID | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Point1 Event1 | Route1 | 1/1/2000 | <Null> | 15 1 8 |

Line event:

| Event | Route ID | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 7.5 | 25 |

### Cartographic realignment on routes in a line network with events that span routes
Routes in a line network can also be cartographically realigned by modifying the associated centerline.
In the following example, there are two routes on LineA and the routes are active from 1/1/2000. The cartographic realignment is set to occur on 1/1/2005 from the middle to the end of Route2. Route2's measures adjust to its new geometry because Update route measures in cartographic realignment is enabled for the network. The graphics and tables in the following sections demonstrate the route information before and after the cartographic realignment.

#### Before route cartographic realignment
The following image shows the routes before cartographic realignment:. There is an intersection on Route2 where Route2 intersects the County boundary. The intersection is the referent location in the Honor Referent Location event behavior scenario below.

Note:
The length of cartographic realignment is 1.1553 times longer than the part of the route being cartographically realigned.
The following table provides details about the routesroute and intersection before cartographic realignment:

| Route Name | Line Name | Line Order | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Route1 | LineA | 100 | 1/1/2000 | <Null> | 0 | 10 |
| Route2 | LineA | 200 | 1/1/2000 | <Null> | 12 | 22 |

| Intersection ID | From Date | To Date | Route ID | Measure |
| --- | --- | --- | --- | --- |
| Intersection | 1/1/2000 | <Null> | Route2 | 15 |

#### After route cartographic realignment
The following image shows the routesroute and intersection after cartographic realignment:

The following table provides details about the routes and intersection after cartographic realignment:

| Route Name | Line Name | Line Order | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Route1 | LineA | 100 | 1/1/2000 | <Null> | 0 | 10 |
| Route2 | LineA | 200 | 1/1/2000 | <Null> | 12 | 22.8 25 |

| Intersection ID | From Date | To Date | Route ID | Measure |
| --- | --- | --- | --- | --- |
| Intersection | 1/1/2000 | <Null> | Route2 | 15 |

Note:
When the centerlines are edited, all routes in all networks, across all times, are modified accordingly. Hence, Route2 does not get a new time slice, but its shape is changed in the existing time slice.

#### Events before route cartographic realignment
There is a point event on Route2 and a line event on LineA and both of them haveit has a start date of 1/1/2000. The following image shows the routes and eventsevent before cartographic realignment:

The following tables provide details about the eventsevent before cartographic realignment:
Point event:

| Event | Route Name | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Point1 Event1 | Route2 | 1/1/2000 | <Null> | 16 20 |

Line event:

| Event | From Date | To Date | From Route Name | To Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Event1 | 1/1/2000 | <Null> | Route1 | Route2 | 0 | 20 |

The following sections detail how event behavior rules are enforced after running the Apply Event Behaviors tool under this route cartographic realignment scenario.
Note:
For a line event, its start and end points follow the same cartographic realignment event behavior as a point event.

#### Honor Route Measure behavior
If the Update route measures in cartographic realignment parameter is enabled for the network and the route measures are updated due to cartographic realignment, the resulting event behavior will be a combined behavior of the cartographic realignment behavior and the calibrate behavior. Events in the cartographic realignment area will move proportionally.
Note:
If the route measures have not changed because the Update route measures in cartographic realignment parameter is disabled for the network, the Honor Route Measure event behavior preserves the measures of the event and updates the event's location.
The following table shows the edit activities involved in the route edit and their corresponding event behaviors:

| Edit activity | Event behavior |
| --- | --- |
| Cartographic realignment | Honor Route Measure |
| Calibrate | Stay Put |

The route cartographic realignment described above has the following effects:

- Point1Event1 was located on Route2 at measure 20. Because it is not within the cartographic realignment area, so its geographic location and measure do not change.
- Event1 is partially with in the cartographic realignment area, so only the part of it that is in the cartographic realignment has changed geographic location and measure. Because the route's measures are also updatedhave changed, both the cartographic realignment Honor Route Measure and the calibrate Stay Put behaviors are applied. The part of Event1 afterEvent1's measure 17 of Route2 is updated proportionally lengthened and reshaped to match the path of Route2. As a result, Event1's startbe at measure value remains 022.4 on Route1Route2, and its end measure valuelocation is also updated to 20.5stay on Route2.
The following image shows the routes and eventsevent after cartographic realignment:

Note:

Note:
Because cartographic realignment does not change a route's time slice, the time slices of the eventsevent on the route are not changed either.
The following tables provide details about the eventsevent after cartographic realignment:
Point event:

| Event | Route Name | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Point1 Event1 | Route1 Route | 1/1/2000 | <Null> | 15 22.4 |

Line event:

| Event | From Date | To Date | From Route Name | To Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Event1 | 1/1/2000 | <Null> | Route1 | Route2 | 0 | 20.5 |

#### Honor Referent Location behavior
If the Update route measures in cartographic realignment parameter is enabled for the network and the route measures are updated due to cartographic realignment, the resulting event behavior will be a combined behavior of the cartographic realignment behavior and the calibrate behavior. Events in the cartographic realignment area will move proportionally.
Note:
If route measures have not changed because the Update route measures in cartographic realignment parameter is disabled for the network, theThe Honor Referent Location event behavior preserves the referent offset of the event and updates the event's geographic location and measures.
Events can have event referent fields to derive its location using referent location information. The following referent locations can be stored:

- Offset distance from any point feature in the geodatabase
- Offset distance from an intersection point feature
- Offset distance from a point event feature
- Offset distance from an x,y coordinate
- Offset distance from a station
The following table shows the edit activities involved in the route edit and their corresponding event behaviors:

| Edit activity | Event behavior |
| --- | --- |
| Cartographic realignment | Honor Referent Location |
| Calibrate | Stay Put |

The following table shows referent fields in Event1:

| Event | Route Name ID | From Ref Location | From Ref Offset | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- |
| Event1 | Route1 Route2 | Point1 Intersection | -14 5 | Point1 | 4 |

The route cartographic realignment described above has the following effects:

- Point1 is not withinEvent1 was located 5 miles downstream of the intersection on Route2, resulting in a measure of 20. After the cartographic realignment area, so its geographic location and measure do not change.
- Event1 is partially with in the cartographic realignment area, so only the part of it that is in the cartographic realignment has changed geographic location and measure. Because the route's measures are also updated, both the cartographic realignment Honor Referent Location and the calibrate Stay Put behaviors are is applied. The offset of the part, it still locates 5 miles downstream of Event1 after measure 17 on Route2 is proportionally lengthened. As a result, Event1's start measure value remains 14 units to the left of Point1,the intersection which is 0 on Route1, and its end measure value is updated to 20.5 on Route2. ItThe location of Event1 is also reshapedupdated to match the path of stay on Route2.
The following image shows the route and eventsevent after cartographic realignment:

The following tables provide details about the eventsevent after cartographic realignment:
Point event:

| Event | Route Name | From Date | To Date | Measure |
| --- | --- | --- | --- | --- |
| Point1 Event1 | Route1 Route 2 | 1/1/2000 | <Null> | 16 20 |

Line event:

| Event | From Date | To Date | From Route Name | To Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Event1 | 1/1/2000 | <Null> | Route1 | Route2 | 0 | 20.5 |

![Figure 1 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-01-honor-referent-location-behavior.png)
![Figure 2 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-02-honor-referent-location-behavior.png)
![Figure 3 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-03-honor-referent-location-behavior.png)
![Figure 4 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-04-honor-referent-location-behavior.png)
![Figure 5 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-05-honor-referent-location-behavior.png)
![Figure 6 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-06-honor-referent-location-behavior.png)
![Figure 7 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-07-honor-referent-location-behavior.png)
![Figure 8 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-08-honor-referent-location-behavior.png)
![Figure 9 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-09-honor-referent-location-behavior.png)
![Figure 10 — Honor Referent Location behavior](../media/eb-for-cartographic-realignment-2024-04-3/fig-10-honor-referent-location-behavior.png)
