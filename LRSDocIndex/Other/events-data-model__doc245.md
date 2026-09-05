# Events Data Model

|   |   |
| --- | --- |
| **Kind** | Other · Enterprise |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Source** | [APR_Events Data Model.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/5701_ExternalSystemsIntegration/APR_Events%20Data%20Model.docx>) |
| **Edited** | 2025-01-25 00:47 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Events Data Model"
source_file: "APR_Events Data Model.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/5701_ExternalSystemsIntegration/APR_Events%20Data%20Model.docx"
doc_id: 245
doc_kind: "Other"
surface: "Enterprise"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-01-25T00:47:40.3698249Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event feature class", "event registration", "referent fields", "derived network", "stationing event", "external events", "pipeline referencing"]
tools: ["Create LRS Event", "Configure External Event With LRS", "Enable Referent Fields", "Enable Stationing Fields", "Apply Event Behaviors", "Configure External Event Behaviors With LRS"]
products: ["Pipeline Referencing"]
issues: []
related: [{"doc":247,"file":"events-data-model__doc247.md","s":9.245},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":3.403},{"doc":243,"file":"external-event-registration-in-arcgis-pipeline-referencing__doc243.md","s":3.398},{"doc":134,"file":"view-lrs-event-properties__doc134.md","s":2.943},{"doc":242,"file":"external-system-integration-with-arcgis-pipeline-referencing__doc242.md","s":2.82}]
```
-->

## Summary

Describes the data model for managing events in ArcGIS Pipeline Referencing, including required fields for event feature classes, referent fields, derived network event fields, and stationing event fields. Explains the difference between internal events stored in the LRS geodatabase and external events stored outside the LRS geodatabase, including how they are registered, managed, and updated.

## Related documents

<!-- related:begin -->
- [Events Data Model](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/events-data-model__doc247.md>) — similar text 0.95 · 2 title words · 2 filename words · same kind/folder <!-- rel:247 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.24 · same kind <!-- rel:39 -->
- [External Event Registration in ArcGIS Pipeline Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/external-event-registration-in-arcgis-pipeline-referencing__doc243.md>) — similar text 0.37 · 1 filename word · same kind <!-- rel:243 -->
- [View LRS Event Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-lrs-event-properties__doc134.md>) — similar text 0.32 · same kind <!-- rel:134 -->
- [External system integration with ArcGIS Pipeline Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/external-system-integration-with-arcgis-pipeline-referencing__doc242.md>) — similar text 0.27 · 1 filename word · same folder <!-- rel:242 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify LRS events](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-lrs-events.html) · [External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/external-event-registration.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [Configure External Event With LRS](https://www.google.com/search?q=%22Configure%20External%20Event%20With%20LRS%22+site%3Adoc.esri.com) · [Enable Referent Fields](https://www.google.com/search?q=%22Enable%20Referent%20Fields%22+site%3Adoc.esri.com) · [Enable Stationing Fields](https://www.google.com/search?q=%22Enable%20Stationing%20Fields%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Configure External Event Behaviors With LRS](https://www.google.com/search?q=%22Configure%20External%20Event%20Behaviors%20With%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Events data model
Events are managed in ArcGIS Pipeline Referencing in feature classes called event feature classes, which are registered in the same geodatabase as the LRS.
Pipeline Referencing manages the shape of the feature based on the route, measure, and to and from dates. The required source event data differs depending on the event type being registered. The required fields for each event type are listed in the following sections.
Note:
Event feature classes can be modeled in advance or created when registering the event in the LRS. If modeled in advance, ensure that the spatial reference and x,y-, z-, and m-tolerance and resolution of the event feature class match that of the network in which it's registered.
https://prodev.arcgis.com/en/pro-app/3.5/help/production/location-referencing-pipelines/tolerance-and-resolution-settings-for-the-lrs.htm \hLearn more about tolerance and resolution settings for the LRS

### Minimum event fields
The minimum event fields are as follows:

| Field | Data type | Length | Is nullable | Description |
| --- | --- | --- | --- | --- |
| Event ID | String | Between 32 and 255 | No | The unique ID for each event record. |
| Route ID | String or GUID | Same type and length as the Route ID field in the Centerline Sequence table | No | The unique ID for each route in the network. |
| Route Name (if configured) | String | 255 | No | The unique name for the route. |
| To Route ID (required for event feature classes that store events that span routes) | String or GUID | Same type and length as the Route ID field in the Centerline Sequence Table | No | The unique ID for the to route in the network. |
| From Date | Date | 8 | Yes | The date that the event becomes active on the route. |
| To Date | Date | 8 | Yes | The date that the event is retired on the route. |
| Measure (point events only) | Any Numeric |  | No | The measure on the route where the event is located. |
| From Measure (line events only) | Any Numeric |  | No | The measure on the route where the beginning of the event is located. |
| To Measure (line events only) | Any Numeric |  | No | The measure on the route where the end of the event is located. |
| Location Error | String | 100 | Yes | The location error for the event. |

### Event referent fields
When registering events, you can store the event location based on its offset from another location. The offsets can be based on x- and y-coordinates, a station, the distance from the beginning of an event, other LRS events, intersections, or another point feature class.
You can use the Enable Referent Fields tool to enable storing referent locations with an event. The following fields are required:

| Field | Data type | Length | Is nullable | Description |
| --- | --- | --- | --- | --- |
| Referent Method (point events only) | Short Integer | 5 | Yes | The method for referencing the offset feature. This can be x,y coordinates, stationing, length, LRS Network, event, intersection, or other point feature classes. |
| Referent Location (point events only) | String | Between 50 and 255 | Yes | The location of the offsetting feature. This can be an x,y coordinate, feature or event ID, or intersection ID. |
| Referent Offset (point events only) | String | Between 50 and 255 | Yes | The offset measure. This is saved in the unit of measure configured when registering an event and configuring the offset fields. |
| From Referent Method (line events only) | Short Integer | 5 | Yes | The method for referencing the offset feature. This can be x,y coordinates, stationing, length, LRS Network, event, intersection, or other point feature classes. |
| From Referent Location (line events only) | String | Between 50 and 255 | Yes | The location of the offsetting feature. This can be an x,y coordinate, feature or event ID, or intersection ID. |
| From Referent Offset (line events only) | String | Between 50 and 255 | Yes | The offset measure. This is saved in the unit of measure configured when configuring offset fields. |
| To Referent Method (line events only) | Short Integer | 5 | Yes | The method for referencing the offset feature. This can be x,y coordinates, stationing, length, LRS Network, event, intersection, or other point feature classes. |
| To Referent Location (line events only) | String | Between 50 and 255 | Yes | The location of the offsetting feature. This can be an x,y coordinate, feature or event ID, or intersection ID. |
| To Referent Offset (line events only) | String | Between 50 and 255 | Yes | The offset measure. This is saved in the unit of measure configured when configuring offset fields. |

### Derived network event fields
When an event is registered with a line network, you can also store the derived network route and measure information. This allows the route ID and measure from both a line and a derived network to be stored on the same event feature class.
To enable storage of a derived network route and measure fields on an event, add the following fields to the event:

| Field | Data type | Length | Is nullable | Description |
| --- | --- | --- | --- | --- |
| Derived Route ID | Text or GUID | Same type and length as the Route ID field in the centerline sequence table | No | The unique ID of the route in the derived network. |
| Derived Route Name | Text | Same length as the LineName field in Line Network | Yes | The name of the route in the derived network. |
| Derived Measure (point event only) | Double |  | Yes | The measure on the route in the derived network where the event is located. |
| Derived From Measure (line event only) | Double |  | Yes | The measure on the route in the derived network where the event begins. |
| Derived To Measure (line event only) | Double |  | Yes | The measure on the route in the derived network where the event ends. |

Learn more about using derived networks in Pipeline Referencing

### Stationing event fields
Pipeline Referencing supports the registration of point events with stationing measures in the LRS geodatabase using the Enable Stationing Fields tool. Registering a stationing event allows you to locate stations with ahead and back station values at any measure along a route in the LRS Network.
When combined with referents and offsets, you can use a stationing event as an additional method for creating and editing the location of other events in the LRS.
When registering an event that uses stationing, all of the fields from a route and measure point event are required in the source event data. The following fields are required for an event that uses stationing:

| Field | Data type | Length | Is nullable | Description |
| --- | --- | --- | --- | --- |
| Station | String | Any | Yes | The stationing value for the station. |
| Back Station | String | Any | Yes | The back stationing value for the station. This value is populated when an equation point is present at the station location. |
| Station Value Direction | String | Any | Yes | The field used to designate if stationing values increase in the opposite direction of the increase in measure on routes. |

### Event types
Pipeline Referencing has two types of events: those stored in the same geodatabase as the LRS and those stored in external databases. Events in the geodatabase are stored as feature classes, while external events are stored as tables in an RDBMS database or geodatabase (other than the geodatabase in which the LRS resides). can be configured with or without a connection file.
Events can be registered as line or point events in the LRS geodatabase for an existing LRS Network using the Create LRS Event tool.
Learn more about creating and modifying LRS events
External events from an external data source can be registered as line or point events for an existing LRS Network using the Configure External Event With LRS tool. If a connection cannot be made to the external data source, you can also configure external events without a connection file using the <Add new tool name and link> tool.
Note:
If an event feature class is modeled in advance, its spatial reference, x,y, z-, and m-tolerance and resolution must match its associated network.
It is also recommended that you index project items to improve event table performance when registering events.
https://prodev.arcgis.com/en/pro-app/3.5/help/production/location-referencing-pipelines/tolerance-and-resolution-settings-for-the-lrs.htm \hLearn more about tolerance and resolution in ArcGIS Pipeline Referencing

#### Events in the geodatabase
In addition to the location of the data source, internal and external events also differ with respect to how they are managed after registration.
Events in the LRS geodatabase are stored as feature classes and the shape of the event features are managed based on the route, measure, and to and from dates. This provides increased performance in ArcGIS for mapping and spatial query of the event data.
When registering an event in the LRS geodatabase, you can model the feature class in advance in the geodatabase with the LRS and have the new feature class created in the geodatabase with the LRS. You can also copy the schema from another table or feature class to the new feature class created in the LRS geodatabase.
Learn more about creating and modifying LRS events
After event registration, the event is automatically managed. When edits are made to a route, the changes are made directly to the event feature class using the event measure behavior configuration. When the event layer is refreshed in the map, which is automatically triggered by an edit activity, you can see the updates immediately.
After performing and saving edits using the tools on the Location Referencing toolbar, run the Apply Event Behaviors tool to update the event locations.

#### External events
External events can be configured with or without a connection file.
You can use the Configure External Event with LRS (add link) tool to establish a read-only connection to the external system. When an event table or feature class outside the LRS geodatabase is registered as an external event table, since the connection is read-only, the changes are not written directly to the external event table because the connection is read-only. There may be business rules associated with updating measures on events in an external system, so events in external systems are not directly modified.
You can also use the Configure External Event Behaviors With LRS (add link) tool to create external events without linking to a source table or feature. This creates an external event without any route or event information.
ArcGIS Pipeline Referencing supports pushing updates to both types of external events and maintains. aA log of all the edits performed that have an impact on event measures is maintained. You can use web services, for instance, Relocate Events (add link to Relocate Events), to send these updates to the external table or feature class to apply measures. Depending on the type of external events, The required parameters and data in web services vary based on the type of external eventare different.
Connections to external event tables are not modeled in the geodatabase. When an event table or feature class outside the LRS geodatabase is registered as an external event table, it is assumed to be a read-only connection and the changes are not written directly to the external event table. There may be business rules associated with updating measures on events in an external system, so events in external systems are not directly modified.
A log of all the edits performed that have an impact on event measures is maintained. You can use web services to send these updates to the external table or feature class to apply measures.
Learn more about registering an external event
