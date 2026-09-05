# Event Behavior for Route Retirement

| Field | Value |
| --- | --- |
| **Doc** | 425 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [compareRetireAPR_5633.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5633_Retire/compareRetireAPR_5633.docx>) |
| **People** | author Claire Wang · PE — · dev — |
| **Edited** | 2024-02-23 18:13 by Ignacia Galvan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route retirement · event behavior · stay put · move · retire · gapped route · line network · event splitting · event retirement |
| **Tools** | Apply Event Behaviors |

## Summary

This document explains how events are affected by route retirement in a linear referencing system. It details the impact of different event behaviors—Stay Put, Move, and Retire—on events upstream, intersecting, and downstream of retired routes, including scenarios with gapped routes and line networks with spanning events. The document includes examples, tables, and descriptions of event behavior enforcement after route retirement edits.

## Related documents

<!-- related:begin -->
- [Event Behavior for Route Retirement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-retirement-2024-02.md>) — similar text 0.81 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:420 s=8.364 -->
- [Event Behavior for Route Retirement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-retirement-2024-02-3.md>) — similar text 0.82 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:426 s=7.99 -->
- [Event Behavior for Route Retirement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-retirement-apr-2024-01.md>) — similar text 0.75 · 4 title words · 2 filename words · same kind/surface <!-- rel:441 s=7.763 -->
- [Event Behavior for Route Retirement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-retirement-apr-2024-01-2.md>) — similar text 0.70 · 4 title words · 2 filename words · same kind/surface <!-- rel:443 s=7.319 -->
- [Event Behavior for Route Retirement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-route-retirement-rh-2024-02.md>) — similar text 0.76 · 4 title words · 1 filename word · same kind/surface/folder <!-- rel:419 s=7.313 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Event behavior for route retirement](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-behavior-for-route-retirement.html)

_No page matched:_ [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Event behavior for route retirement
When routes are retired, events are impacted depending on the configured event behavior for each event layer.
Note:
Events are not updated until the Apply Event Behaviors tool is run after route edits. If you are using conflict prevention on branch versioned data, you are prompted to run Apply Event Behaviors before posting to the default version.
Note:
When Recalibrate route downstream is chosen for an LRS route edit, the configured calibrate event behavior is applied to downstream sections. You can review configured event behaviors by viewing LRS event properties.
The route retirement and corresponding event behaviors are described below.

### Route retirement scenario
A route can be retired at the beginning, in the middle, or at the end of the route. If the retirement takes place in the middle of the route, the resultingresultant route is a gapped route. For line network, you can fully or partially retire multiple adjoining routes that belong to the same line.

#### Upstream and downstream sections
Route editing impacts upstream and downstream sections differently.
The following image shows the upstream and downstream sections for the route retirement scenario: (Please use updated svg and use the title as hover text)

The following table details how the retirement editing activity impacts upstream and downstream events according to the configured event behavior:

| Behavior | Events upstream | Events intersecting | Events downstream |
| --- | --- | --- | --- |
| Stay Put | No action. | Retire event; line events crossing the edit region are split and the original event is retired. | If route calibration is changed, the calibrate event behavior is applied; otherwise, no action is taken. |
| Move | Shape regenerated, if needed, to new location of route measures. | Shape regenerated to new location of route measures. | If route calibration is changed, the calibrate event behavior is applied; otherwise, no action is taken. |
| Retire | No action. | Retire event; line events crossing the edit region are not split. | If route calibration is changed, the calibrate event behavior is applied; otherwise, no action is taken. |

Note:
The network can contain events that span routes in a line network. The behaviors are still applied in the same manner.
Because the LRS is time aware, edit activities such as retiring a route will time slice routes and events.

#### Route retirement results
In this example, the route Route1 is active from 1/1/2000. The retirement is set to occur inat the middlebeginning of the route on 1/1/2005. The Recalibrate route downstream option is not chosen. The graphics and tables below demonstrate the route information before and after the retirement.

#### Before route retirement
The following image shows the route before the retirement: (Please use updated svg and use the title as hover text. Please make sure to include the white space for some graphics – this way we can illustrate the left part of the route is retired)

The following table provides details about the route before the retirement:

| Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- |
| Route1 | 1/1/2000 | <Null> | 0 | 55 |

#### After route retirement
The following image shows the route after the retirement. A gapped a route is created.:

The following table provides details about the route after the retirement:

| Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- |
| Route1 | 1/1/2000 | 1/1/2005 | 0 | 55 |
| Route1 | 1/1/2005 | <Null> | 0 25 | 55 |

#### Events before route retirement
There are three events on Route1 and all of them have a start date (From Date) of 1/1/2000. The following image shows the route and events before the retirement:

The following table provides details about the events before the retirement:

| Event | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 0 | 20 |
| Event2 | Route1 | 1/1/2000 | <Null> | 20 | 30 |
| Event3 | Route1 | 1/1/2000 | <Null> | 30 | 45 |

The following sections detail how event behavior rules are enforced after running the Apply Event Behaviors tool under this route retirement scenario.

#### Stay Put event behavior
Although the geographic location of the event is maintained, the measures can change. The event can also split if it crosses the retire region. Portions of and portions within the reassignretirement region are retired.
The following table shows the edit activities involved in the route edit and their corresponding event behaviors:

| Edit Activity | Event Behavior |
| --- | --- |
| Retire | Stay Put |

The route retirement described above has the following effects:

- Event1 is retired on the date of the retirement because it is completely in the edit section.
- Event2 is retired on the date of the retirement because part of it is in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date (From Date). TheThe length of the new Event2 is shorter as its start (From) and end (To) measure values changeare changed to 0 and 15, respectively,25 to 30 to accommodate the new measures of Route1.
- Event2 is retired on the date of the retirement because it is completely in the edit section.
- Event3 is retired on the date of retirement because part of it is in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date. The start and end measure values change to 35 and 45, respectively, to accommodate the new measures of Route1.
- Event3 is not affected as it is not in the retirement region.
The following image shows the route and events after the retirement:

Note:
The retired event is not drawn in the graphic above.
The following table provides details about the events after the retirement when Stay Put is the configured event behavior:

| Event |  | Route Name |  | From Date |  | To Date |  | From Measure |  | To Measure | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 |  | Route1 |  | 1/1/2000 |  | 1/1/2005 |  | 0 |  | 20 | No Error |
| Event1 |  | Route1 |  | 1/1/2005 |  | <Null> |  | 0 | 15 | No Error |  |
| Event 2 |  | Route1 |  | 1/1/2000 |  | 1/1/2005 |  | 20 |  | 3 0 | No Error |
| Event3 Event 2 |  | Route1 |  | 1/1/ 2000 2005 |  | <Null> 1/1/2005 |  | 30 25 |  | 45 30 | No Error |
| Event3 |  | Route1 |  | 1/1/ 2005 2000 |  | <Null> |  | 35 30 |  | 45 | No Error |

#### Move event behavior
Although the measures of the event are maintained, the geographic location can change.
The route retirement described above has the following effects:
Event1 is retired on the date of the retirement because part of it is in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date. The following table shows the edit activities involved in the route edit and their corresponding event behaviors:

| Edit Activity | Event Behavior |
| --- | --- |
| Retire | Move |

The route retirement described above has the following effects:

- Event1 is retired on the date of the retirement because part of it is in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date. Because the measures do not change for the Move behavior, there isthe new Event1 gets a location error for the ending measure because that measure (20)while trying to locate Route1 but Route1 no longer exists on Route1. There is a record for the new Event1 in the event table, but it is not drawn as it does not have a length due to the location error.
- Event2 is retired on the date of the retirement because it is completely in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date. Because the measures do not change for the Move behavior, there is a location error because both starting measure (20) and ending measure (30) no longer exist on Route1.
- Event1 is retired on the date of the retirement because part of it is in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date. Because the measures do not change for the Move behavior, there is a location error for the starting measureFrom Measure because that measure (3020) no longer exists on Route1. The shape of the new Event2 can still be drawn as part of it can still be located on the new Route1.
- Event3 is not affected as it is not in the retirement region.
The following image shows the route and events after the retirement:

The following table provides details about the events after the retirement when Move is the configured event behavior:

| Event | Route Name | From Date | To Date | From Measure | To Measure | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | 1/1/2005 | 0 | 20 | No Error |
| Event1 | Route1 | 1/1/2005 | <Null> | 0 | 20 | Partial match for the ending measure Route Not Found |
| Event 2 | Route1 | 1/1/2000 | 1/1/2005 | 20 | 3 0 | No Error |
| Event 2 | Route1 | 1/1/2005 | <Null> | 20 | 3 0 | Route Location Not Found Partial match for the from measure |
| Event3 | Route1 | 1/1/2000 | <Null> 1/1/2005 | 30 | 45 | No Error |
| Event3 | Route1 | 1/1/2005 | <Null> | 30 | 45 | Partial match for the starting measure |

#### Retire event behavior
Events intersecting the retire region are retired.
The following table shows the edit activities involved in the route edit and their corresponding event behaviors:

| Edit Activity | Event Behavior |
| --- | --- |
| Retire | Retire |

The route retirement described above has the following effects:

- Event1 retires on the date of the retirement because it intersects the retired region.
- Event1 retires on the date of the retirement because it is completely inside the retired region.
- Event2 retires on the date of the retirement because it is completely inside the retired region.
- Event3 retires on the date of the retirement because it intersects the retired region.
- Event3 is not affected as it is not in the retirement region.
The following image shows the route and events after the retirement:

The following table provides details about the events after the retirement when Retire is the configured event behavior:

| Event | Route Name | From Date | To Date | From Measure | To Measure | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | 1/1/2005 | 0 | 20 | No Error |
| Event2 | Route1 | 1/1/2000 | 1/1/2005 | 20 | 30 | No Error |
| Event3 | Route1 | 1/1/2000 | <Null> 1/1/2005 | 30 | 45 | No Error |

### Detailed behavior on routes in a line network with events that span routes
In this example, there are four routes on the same line and the routes are active from 1/1/2000. The retirement is set to occur on 1/1/2005 where the entire Route3 isRoute1 and half of Route2 are retired. Recalibrate route downstream is not chosen. The graphics and tables below demonstrate the route information before and after the retirement.

#### Before route retirement
The following image shows the routes before the retirement:

The following table provides details about the routes before the retirement.:

| Route Name | Line Name | Line Order | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Route1 | LineA | 100 | 1/1/2000 | <Null> | 0 | 10 |
| Route2 | LineA | 200 | 1/1/2000 | <Null> | 12 | 22 |
| Route3 | LineA | 300 | 1/1/2000 | <Null> | 25 | 35 |
| Route4 | LineA | 4 00 | 1/1/2000 | <Null> | 38 | 48 |

#### After route retirement
The following image shows the routes after the retirement:

The following table provides details about the routes after the retirement.:

| Route Name |  | Line Name |  | Line Order |  | From Date |  | To Date | From Measure |  |  | To Measure |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Route1 |  | LineA |  | 100 |  | 1/1/200 0 |  | 1/1/2005 <Null> | 0 |  |  | 20 |  |
| Route2 |  | LineA |  | 200 |  | 1/1/2000 |  | 1/1/2005 <Null> | 12 |  |  | 22 |  |
| Route2 |  | LineA |  | 100 |  | 1/1/2005 | <Null> | 17 | 22 |  |  |  |  |
| Route3 |  | LineA |  | 300 |  | 1/1/2000 |  | 1/1/2005 | 25 |  |  | 35 |  |
| Route3 |  | LineA |  | 200 |  | 1/1/2005 | <Null> | 25 | 35 |  |  |  |  |
| Route4 |  | LineA |  | 400 |  | 1/1/2000 |  | 1/1/2005 | 38 |  |  | 48 |  |
| Route4 |  | LineA |  | 300 |  | 1/1/2005 |  | <Null> | 38 |  |  | 48 |  |

#### Events before retirement
There are two spanning events on routes on LineA. The following image shows the routes and events before the retirement:
The four routes and associated events before retirement

The following table provides details about the events before the retirement:

| Event ID | From Date | To Date | From Route Name | To Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| Event1 | 1/1/2000 | <Null> | Route1 | Route3 | 0 | 30 |
| Event2 | 1/1/2000 | <Null> | Route3 | Route4 | 30 | 48 |

The following sections describe how event behavior rules are enforced when a route on a line in a line network is retired.

#### Stay Put event behavior
Although the geographic location of the event is maintained, the measures can change. The event can also split if it crosses the retire region and portions within the retirement region are retired.
The route retirement described above has the following effects:
Event1 is retired on the date of the retirement because part of it isThe following table shows the edit activities involved in the route edit section. A newand their corresponding event behaviors:

| Edit Activity | Event Behavior |
| --- | --- |
| Retire | Stay Put |

The route retirement described above has the following effects:

- Event1 is retired on the date of the retirement because part of it is in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date. is created on the post-retirement route with the retirement date as the starting date. TheThe length of the new Event1 is shorter as its start and end measure values are changed to measure 0 on Route1 and 2217 on Route2, respectively, because  to 30 on Route3 is no longer present in the lineto accommodate the new measures of Route2.
- Event2 is retired on the date of the retirement because part of it is in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date. The start and end measure values are changed to measure 38 on Route4 and 48 on Route4, respectively, because Event2 is not affected as it is not in the retirement region.
- Route3 is no longer present in the line.
The following image shows the routes and events after the retirement:

Note:
The retired event is not drawn in the graphic above.
The following table provides details about the events after the retirement when Stay Put is the configured event behavior.:

| Event ID |  | From Date |  | To Date | From Route Name |  | To Route Name |  | From Measure |  | To Measure |  | Location Error |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 |  | 1/1/2000 |  | 1/1/2005 | Route1 |  | Route3 |  | 0 |  | 30 |  | No Error |  |  |
| Event1 |  | 1/1/2005 |  | < Null null > | Route1 Route 2 |  | Route2 Route 3 |  | 0 1 7 |  | 22 30 |  | No Error |  |  |
| Event2 |  | 1/1/2000 |  | 1/1/2005 <null> | Route3 |  | Route4 |  | 30 |  | 48 |  | No Error |  |  |
| Event2 | 1/1/2005 | <Null> | Route4 | Route4 | 38 | 48 | No Error |  |  |  |  |  |  |  |  |

#### Move event behavior
Although the measures of the event are maintained, the geographic location can change.
The following table shows the edit activities involved in the route edit and their corresponding event behaviors:

| Edit Activity | Event Behavior |
| --- | --- |
| Retire | Move |

The route retirement described above has the following effects:

- Event1 is retired on the date of the retirement because part of it is in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date. Because the measures do not change for the Move behavior, there isthe new Event1 gets a location error while trying to locate Route1 for the endingits start measure because Route3but Route1 no longer exists. There is a record for the new Event1 in the lineevent table, but it is not drawn as it does not have a length due to the location error.
- Event2 is retired on the date of the retirement because part of it is in the edit section. A new event is created on the post-retirement route with the retirement date as the starting date. Because the measures do not change for the Move behavior, there is a location error for the starting measure because Route3 no longer exists in the line.
- Event2 is not affected as it is not in the retirement region.
The following image shows the routeroutes and events after the retirement:

The following table provides details about the events after the retirement:

| Event ID | From Date |  | To Date |  | From Route Name |  | To Route Name |  |  | From Measure |  | To Measure |  | Location Error |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | 1/1/2000 |  | 1/1/2005 |  | Route1 |  | Route3 |  |  | 0 |  | 30 |  | No Error |  |
| Event1 |  | 1/1/2005 |  | <null> | Route1 | Route3 | 0 | 30 | Route Not Found |  |  |  |  |  |  |
| Event2 |  | 1/1/2000 |  | <null> | Route3 | Route4 | 30 | 48 | No Error |  |  |  |  |  |  |

#### Retire event behavior
Events intersecting the retire region are retired.
 when Move is the configuredThe following table shows the edit activities involved in the route edit and their corresponding event behavior.behaviors:

| Edit Activity | Event Behavior |
| --- | --- |
| Retire | Retire |

The route retirement described above has the following effects:

- Event1 retires on the date of the retirement because it intersects the retired region.
- Event2 is not affected as it is not in the retirement region.
The following image shows the routes and events after the retirement:

The following table provides details about the events after the retirement:

| Event ID |  | From Date |  | To Date | From Route Name |  | To Route Name |  | From Measure |  | To Measure |  | Location Error |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 |  | 1/1/2000 |  | 1/1/2005 | Route1 |  | Route3 |  | 0 |  | 30 |  | No Error |  |  |
| Event1 | 1/1/2005 | <Null> | Route1 | Route3 | 0 | 30 | Partial Match for the To Measure |  |  |  |  |  |  |  |  |
| Event2 |  | 1/1/2000 |  | 1/1/2005 <null> | Route3 |  | Route4 |  | 30 |  | 48 |  | No Error |  |  |
| Event2 | 1/1/2005 | <Null> | Route3 | Route4 | 30 | 48 | Partial Match for the From Measure |  |  |  |  |  |  |  |  |

#### Retire event behavior
Events intersecting the retire region are retired.

- Event1 retires on the date of the retirement because it intersects the retired region.
- Event2 retires on the date of the retirement because it is completely inside the retired region.
- Event3 retires on the date of the retirement because it intersects the retired region.
The following image shows the routes and events after the retirement:

The following table provides details about the events after the retirement when Retire is the configured event behavior.

| Event ID |  | From Date | To Date |  | From Route Name |  | To Route Name |  |  | From Measure |  | To Measure |  | Location Error |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 |  | 1/1/2000 | 1/1/2005 |  | Route1 |  | Route3 |  |  | 0 |  | 30 |  | No Error |  |
| Event2 | 1/1/2000 |  | 1/1/2005 |  | Route3 | Route4 | 30 | 48 | No Error |  |  |  |  |  |  |

![Figure 1 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-01-retire-event-behavior.png)
![Figure 2 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-02-retire-event-behavior.png)
![Figure 3 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-03-retire-event-behavior.png)
![Figure 4 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-04-retire-event-behavior.png)
![Figure 5 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-05-retire-event-behavior.png)
![Figure 6 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-06-retire-event-behavior.png)
![Figure 7 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-07-retire-event-behavior.png)
![Figure 8 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-08-retire-event-behavior.png)
![Figure 9 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-09-retire-event-behavior.png)
![Figure 10 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-10-retire-event-behavior.png)
![Figure 11 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-11-retire-event-behavior.png)
![Figure 12 — Retire event behavior](../media/eb-for-route-retirement-2024-02-2/fig-12-retire-event-behavior.png)
