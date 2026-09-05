# Events Data Model

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [RH_Events Data Model.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/5701_ExternalSystemsIntegration/RH_Events%20Data%20Model.docx>) |
| **Edited** | 2025-01-24 19:49 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Events Data Model"
source_file: "RH_Events Data Model.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/5701_ExternalSystemsIntegration/RH_Events%20Data%20Model.docx"
doc_id: 247
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-01-24T19:49:09.9900772Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event", "event feature class", "route", "measure", "referent", "stationing", "external event"]
tools: ["Enable Referent Fields", "Enable Stationing Fields", "Create LRS Event", "Configure External Event With LRS", "Configure External Event Behaviors With LRS", "Apply Event Behaviors"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":245,"file":"events-data-model__doc245.md","s":9.245},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":3.68},{"doc":262,"file":"create-and-modify-lrs-events__doc262.md","s":3.333},{"doc":261,"file":"create-and-modify-lrs-events__doc261.md","s":3.333},{"doc":244,"file":"external-event-registration-in-arcgis-roads-and-highways__doc244.md","s":3.193}]
```
-->

## Summary

Describes the data model for events in ArcGIS Roads and Highways, including event feature classes registered in the LRS geodatabase. Details minimum event fields, event referent fields, stationing event fields, and distinctions between internal and external events with their management and registration processes.

## Related documents

<!-- related:begin -->
- [Events Data Model](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/events-data-model__doc245.md>) — similar text 0.95 · 2 title words · 2 filename words · same kind/folder <!-- rel:245 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.22 · same kind/surface <!-- rel:39 -->
- [Create and modify LRS events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-and-modify-lrs-events__doc262.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface <!-- rel:262 -->
- [Create and modify LRS Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-and-modify-lrs-events__doc261.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface <!-- rel:261 -->
- [External Event Registration in ArcGIS Roads and Highways](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/external-event-registration-in-arcgis-roads-and-highways__doc244.md>) — similar text 0.36 · same kind/surface <!-- rel:244 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify LRS events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-and-modify-lrs-events.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html) · [External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/external-event-registration.html)

_No page matched:_ [Enable Referent Fields](https://www.google.com/search?q=%22Enable%20Referent%20Fields%22+site%3Adoc.esri.com) · [Enable Stationing Fields](https://www.google.com/search?q=%22Enable%20Stationing%20Fields%22+site%3Adoc.esri.com) · [Configure External Event With LRS](https://www.google.com/search?q=%22Configure%20External%20Event%20With%20LRS%22+site%3Adoc.esri.com) · [Configure External Event Behaviors With LRS](https://www.google.com/search?q=%22Configure%20External%20Event%20Behaviors%20With%20LRS%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Events data model
Events are managed in ArcGIS Roads and Highways in feature classes called event feature classes, which are registered in the same geodatabase as the linear referencing system (LRS).
Roads and Highways manages the shape of the feature based on the route, measure, and to and from dates. The required source event data differs depending on the event type being registered. The required fields for each event type are listed in the following sections.
Note:
Event feature classes can be modeled in advance or created when registering the event in the LRS. If modeled in advance, ensure that the spatial reference and x,y-, z-, and m-tolerance and resolution of the event feature class match that of the network in which it's registered.
https://prodev.arcgis.com/en/pro-app/3.5/help/production/roads-highways/tolerance-and-resolution-settings-for-the-lrs.htm \hLearn more about tolerance and resolution settings for the LRS

### Minimum event fields
The minimum event fields are as follows:

| Field | Data type | Length | Is nullable | Description |
| --- | --- | --- | --- | --- |
| Event ID | String | Between 32 and 255 | No | The unique ID for each event record. |
| Route ID | String | Same length as the Route ID field in the Centerline Sequence table | No | The unique ID for each route in the network. |
| Route Name (if configured) | String | 255 | No | The unique name for the route. |
| From Date | Date | 8 | Yes | The date that the event becomes active on the route. |
| To Date | Date | 8 | Yes | The date that the event is retired on the route. |
| Measure (point events only) | Any Numeric |  | No | The measure on the route where the event is located. |
| From Measure (line events only) | Any Numeric |  | No | The measure on the route where the beginning of the event is located. |
| To Measure (line events only) | Any Numeric |  | No | The measure on the route where the end of the event is located. |
| Location Error | String | 100 | Yes | The location error for the event. |

### Event referent fields
When registering events, you can store the event location based on its offset from another location. The offsets can be based on x- and y-coordinates, a station, the length from the beginning of an event, other LRS events, intersections, or another point feature class.
You can use the Enable Referent Fields tool to enable storing referent locations with an event. The following fields are required:

| Field | Data type | Length | Is nullable | Description |
| --- | --- | --- | --- | --- |
| Referent Method (point events only) | Short Integer | 5 | Yes | The method for referencing the offset feature. This can be x,y coordinates, stationing, length, LRS Network, event, intersection, or other point feature classes. |
| Referent Location (point events only) | String | Between 50 and 255 | Yes | The location of the offsetting feature. This can be an x,y coordinate, feature or event ID, or intersection ID. |
| Referent Offset (point events only) | String | Between 50 and 255 | Yes | The offset measure. It is saved in the unit of measure configured when registering an event and configuring the offset fields. |
| From Referent Method (line events only) | Short Integer | 5 | Yes | The method for referencing the offset feature. This can be x,y coordinates, stationing, length, LRS Network, event, intersection, or other point feature classes. |
| From Referent Location (line events only) | String | Between 50 and 255 | Yes | The location of the offsetting feature. This can be an x,y coordinate, feature or event ID, or intersection ID. |
| From Referent Offset (line events only) | String | Between 50 and 255 | Yes | The offset measure. It is saved in the unit of measure configured when configuring offset fields. |
| To Referent Method (line events only) | Short Integer | 5 | Yes | The method for referencing the offset feature. This can be x,y coordinates, stationing, length, LRS Network, event, intersection, or other point feature classes. |
| To Referent Location (line events only) | String | Between 50 and 255 | Yes | The location of the offsetting feature. This can be an x,y coordinate, feature or event ID, or intersection ID. |
| To Referent Offset (line events only) | String | Between 50 and 255 | Yes | The offset measure. It is saved in the unit of measure configured when configuring offset fields. |

### Stationing event fields
Roads and Highways supports the registration of point events with stationing measures in the LRS geodatabase using the Enable Stationing Fields tool. Registering a stationing event allows you to locate stations with ahead and back station values at any measure along a route in your LRS Network with at least one stationing event on it.
Using a stationing event provides an additional method for locating events that are being added to the LRS.
When registering an event that uses stationing, all of the fields from a Route and Measure point event are required in the source event data. The following fields are required for an event that uses stationing:

| Field | Data type | Length | Is nullable | Description |
| --- | --- | --- | --- | --- |
| Station | String | Any | Yes | The stationing value for the station. |
| Back Station | String | Any | Yes | The back stationing value for the station. This value is populated when an equation point is present at the station location. |
| Station Value Direction | String | Any | Yes | The field used to designate if stationing values increase in the opposite direction of the increase in measure on routes. |

### Event types
Roads and Highways has two types of events: those stored in the same geodatabase as the LRS and those in external databases. Events in the geodatabase are stored as feature classes, while external events are stored as tables in an RDBMS database or geodatabase (other than the geodatabase in which the LRS resides).
Events can be registered as line or point events in the LRS geodatabase for an existing LRS Network using the Create LRS Event tool.
Learn more about creating and modifying LRS events
External events from an external data source can be registered as line or point events for an existing LRS Network using the Configure External Event With LRS tool.
Note:
If an event feature class is modeled in advance, its spatial reference, x,y, z-, and m-tolerance and resolution must match its associated network.
It is also recommended that you index project items to improve event table performance when registering events.
Learn more about tolerance and resolution in ArcGIS Roads and Highways.

#### Events in the geodatabase
In addition to the location of the data source, internal and external events also differ with respect to how they are managed after registration.
Events in the LRS geodatabase are stored as feature classes and the shape of the event features are managed based on the route, measure, and to and from dates. This provides increased performance in ArcGIS for mapping and spatial query of the event data.
When registering an event in the LRS geodatabase, you can model the feature class in advance in the geodatabase with the LRS and have the new feature class created in the geodatabase with the LRS. You can also copy the schema from another table or feature class to the new feature class created in the LRS geodatabase.
Learn more about creating and modifying LRS events
After event registration, the event is automatically managed. When edits are made to a route, the changes are made directly to the event feature class using the event measure behavior configuration. When the event layer is refreshed in the map, which is automatically triggered by an edit activity, you can see the updates immediately.
After performing and saving edits using the tools on the Location Referencing toolbar, run the Apply Event Behaviors tool to update the event locations.
External events

External events can be configured with or without a connection file.
You can use the Configure External Event with LRS (add link) tool to establish a read-only connection to the external system. Connections to external event tables are not modeled in the geodatabase. When an event table or feature class outside the LRS geodatabase is registered as an external event table, it is assumed to be a read-only connectionsince the connection is read-only, and the changes are not written directly to the external event table because the connection is read-only. There may be business rules associated with updating measures on events in an external system, so events in external systems are not directly modified.
You can also use the Configure External Event Behaviors With LRS (add link) tool to create external events without linking to a source table or feature. This creates an external event without any route or event information.
ArcGIS Roads and Highways supports pushing updates to both types of external events and maintains. aA log of all the edits performed that have an impact on event measures is maintained. You can use web services, for instance, (Relocate Events (add link to Relocate Events), to send these updates to the external table or feature class to apply measures. Depending on the type of external events, The required parameters and data in web services vary based on the type of external event.are different.
https://prodev.arcgis.com/en/pro-app/3.5/help/production/roads-highways/external-event-registration.htm \hLearn more about registering an external event
