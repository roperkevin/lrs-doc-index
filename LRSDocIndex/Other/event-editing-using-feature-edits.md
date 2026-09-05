# Event Editing Using Feature Edits

| Field | Value |
| --- | --- |
| **Doc** | 319 · Other · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [EventEditingUsingFeatureEdits_V2.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5983_Advanced_Table_Editing_Options/EventEditingUsingFeatureEdits_V2.docx>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2024-09-04 00:39 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event editing · feature edits · location error · line event · spanning event · referent offset · route · measure |
| **Tools** | Edit Vertices tool |

## Summary

Describes how to edit event features in a feature service event layer using the Edit Vertices tool, including scenarios for editing line and spanning events and handling location errors. Explains the behavior of referent offset fields when editing events in referent-enabled layers.

## Related documents

<!-- related:begin -->
- [Event Editing Using the Attribute Table](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/event-editing-using-the-attribute-table.md>) — similar text 0.66 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:318 s=6.861 -->
- [Add multiple line events by route and measure](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6134-add-multiple-line-events-by-route-and-measure.md>) — similar text 0.38 · same kind/surface <!-- rel:120 s=2.865 -->
- [Replace Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/replace-events-rh.md>) — similar text 0.35 · same kind/surface <!-- rel:123 s=2.794 -->
- [Event Behavior for Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-cartographic-realignment-2024-04-4.md>) — similar text 0.30 · 1 title word · same kind/surface <!-- rel:387 s=2.752 -->
- [Event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/eb-for-cartographic-realignment-apr-2024-03.md>) — similar text 0.29 · 1 title word · same kind/surface <!-- rel:407 s=2.73 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html) · [Location errors](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/location-errors.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Edit Vertices tool](https://www.google.com/search?q=%22Edit%20Vertices%20tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Event editing using feature edits
You can edit an event feature in a feature service event layer using the Edit Vertices tool .
Using this method, you can edit an existing event shape. The event’s route ID, route name, and measures are updated accordingly. The event’s dates do not change.
Note:
When an event is moved from one route to another route, the event is time sliced based on the route's from and to dates.
https://prodev.arcgis.com/en/pro-app/3.4/help/editing/introduction-to-modifying-features.htm https://prodev.arcgis.com/en/pro-app/3.4/help/editing/introduction-to-modifying-features.htm \hLearn more about editing features using standard ArcGIS Pro feature editing tools in ArcGIS Pro
Note:
If a message regarding acquiring locks or reconciling appears, conflict prevention is enabled.

### Note:

### After editing an event’s vertices, you can retire the existing event and create a new event with a From Date as of the specified retire date including the edited vertices. You also have the option to merge any coincident linear events. For more information, see the event editing options in the Location Referencing Pro Project options.

### Location errors
The Location Error value in the attribute field provides information about the status of the event. When an event is edited correctly, the No Error value occurs for the location error attribute field of the event. If the status is anything other than No Error, inspect the modified event and its attributes for issues and resolve them.
Note:
You can also review a complete list of location errors.
Any of the following statuses indicate a problem that must be resolved.

| Location error | Description |
| --- | --- |
| Different From Route And To Route Line IDs | The starting route and the ending route have different line IDs. This is applicable to events associated with line networks. |
| Invalid Location Route ID | The route location's route ID is invalid (NULL, empty, or invalid value). |
| Invalid Location Measure | At least one of the route location's measure values is invalid. |
| Invalid Route ID | The route location's route ID is invalid (NULL, empty, or invalid value). |
| Reversed Line Order | The starting route does not have a lower line order than the ending route. This is applicable to line networks. |
| Route Not Found | The route does not exist (this could be due to the route not existing in the network or the route and event having different time ranges that do not overlap). |

### Scenarios for editing line events using feature edits
The scenarios below detail the results of editing event features using the Edit Vertices tool .

#### Edit a line event
The following diagram shows the route and its associated event. Route1 has measures from 0 to 20, and Event1 has measures from 0 to 10.
The following table details the route attributes:

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | <Null> |

The following table details the event before editing:

| Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- |
| Route1 | 1/1/2005 | <Null> | 0 | 10 | No Error | 800 |

To edit the event so that it runs from 0 to 20, where the intersection with Route2 is located, drag the last vertex of the event to the intersection using the Edit Vertices tool . The first vertex is used as the From Measure, and the last vertex is used as the To Measure.
The following diagram shows the event after editing:
The following table details the event after editing:

| Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- |
| Route1 | 1/1/2005 | <Null> | 0 | 20 | No Error | 800 |

#### Edit a line event resulting in a location error
The following diagram shows the route and its associated event. Route1 has measures from 0 to 20, and Event1 has measures from 0 to 15.
The following table details the route attributes:

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | <Null> |

The following table details the event before editing. Event1 on Route1 has measures from 0 to 15.

| Event ID | Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 0 | 15 | No Error | 800 |

During the edit, Event1 is dragged beyond the intersection and beyond the end of Route1. In this case, the event's shape remains intact and a location error occurs.
The following table details Event1. Since the event's to measure cannot be located, a location error occurs.

| Event ID | Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 0 | <Null> | Invalid Location Route ID | 800 |

The following diagram shows the route after relocating the end vertex of the line event (Event1) on Route1:

### Scenarios for editing spanning events using feature edits
The scenarios below detail the results of editing a spanning line event using the Edit Vertices tool .

#### Edit a spanning event
The following diagram shows the routes and their associated event. Route1 and Route2 are on LineA.
The following table details the route attributes:

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | <Null> |
| Route2 | 1/1/2000 | <Null> |

The following table details the event before editing:

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | Route2 | 1/1/2000 | <Null> | 5 | 20 | No Error | 800 |

In this case, the event is edited so that the start vertex of the event is snapped to measure 0 on Route1, and the end vertex of the event is snapped to end measure 25 of Route2.
The following table details the event after editing:

| Event | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | Route2 | 1/1/2000 | <Null> | 0 | 25 | No Error | 800 |

The following diagram shows the route and its associated event after the edit:

#### Edit a spanning event resulting in a location error
The following diagram shows the routes and their associated event. Route1 and Route2 are on LineA, and RouteX1 is on LineB. Event1 spans from measure 5 on Route1 to measure 20 on Route2.
The following table details the route attributes. RouteX1 is located on LineB.

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | <Null> |
| Route2 | 1/1/2000 | <Null> |
| RouteX1 | 1/1/2000 | <Null> |

The following table details the event before editing:

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | Route2 | 1/1/2000 | <Null> | 5 | 20 | No Error | 800 |

In the following diagram, the event is edited so that the last vertex of the event is snapped to measure 35 of RouteX1, which is on a different line (LineB).
The following table details Event1 after editing. Since the event's to measure cannot be located on the same line, the event is drawn only up to the end of Route2 on LineA and a location error describing the issue is provided.

| Event | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | RouteX1 | 1/1/2000 | <Null> | 5 | 35 | Different From-Route and To-Route Line IDs | 800 |

The following diagram shows Event1 after the error. The event is generated without the LineB segment.

### Referent offset when using feature edits
The Pipeline Referencing events data model supports the configuration of referent event fields and their enablement using the Enable Referent Fields tool. Once referent fields are configured and enabled in a layer, referent locations are populated and persisted in that layer when events are added or edited.
When a line event is edited using feature edits in a referent-enabled layer, the parent LRS Network is used as the FromRefMethod and ToRefMethod values by default, and the route is used as the FromRefLocation and ToRefLocation values. The from and to measures of the line event are used as the FromRefOffset and ToRefOffset values.
If either measure of a line event is updated, the corresponding offset value updates to reflect the new measure.
The example below demonstrates the impact of editing events that have user-configured referent values enabled in the event layer.

#### Before editing with referents
The following diagram shows the route and its associated events:
The following table provides details about the event referent fields before the edit:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | To Ref Offset |
| --- | --- | --- | --- | --- | --- |
| PointEventLayer1 | Point1 | 5 | PointEventLayer1 | Point1 | 15 |

The following table provides details about the default event fields before the edit:

| Event ID | Route ID | From Date | To Date | From Measure |
| --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 10 |

#### After editing with referents
The following diagram shows the route and its associated events:
When applying feature edits to an event record that has user-configured referent fields, the FromRefMethod and ToRefMethod values revert to the parent LRS Network, and the FromRefLocation and ToRefLocation values revert to the route.
The following table provides details about the event referent fields after event editing:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | To Ref Offset |
| --- | --- | --- | --- | --- | --- |
| PipeSeriesNetwork | Route1 | 5 | PipeSeriesNetwork | Route1 | 15 |

The following table provides details about the default event fields after the edit:

| Event ID | Route ID | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 5 | 15 |

![Figure 1 — After editing with referents](../media/event-editing-using-feature-edits/fig-01-after-editing-with-referents.png)
