# External Event Registration in ArcGIS Pipeline Referencing

| Field | Value |
| --- | --- |
| **Doc** | 243 · Other · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [APR_external_system_registration.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6268_ExternalEventConfiguration/APR_external_system_registration.docx>) |
| **People** | author Claire Wang · PE — · dev — |
| **Edited** | 2025-01-25 01:44 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | external event · event registration · pipeline referencing · relational database · connection file · web services |
| **Tools** | Configure External Event With LRS · Configure External Event Behaviors With LRS |

## Summary

Describes two types of external event registration supported by ArcGIS Pipeline Referencing: events stored in the LRS geodatabase and events stored in external databases. Explains configuration options with and without connection files, data requirements, and update capabilities via web services.

## Related documents

<!-- related:begin -->
- [External Event Registration in ArcGIS Roads and Highways](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/external-event-registration-in-arcgis-rh.md>) — similar text 0.92 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:244 s=11.308 -->
- [External system integration with ArcGIS Pipeline Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/external-system-integration-with-arcgis-apr.md>) — similar text 0.38 · 2 title words · 3 filename words · same surface <!-- rel:242 s=4.803 -->
- [External system integration with ArcGIS Roads and Highways](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/external-system-integration-with-arcgis-rh.md>) — similar text 0.34 · 1 title word · 2 filename words · same kind/surface <!-- rel:246 s=4.088 -->
- [Events Data Model](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/events-data-model-apr.md>) — similar text 0.37 · 1 filename word · same kind <!-- rel:245 s=3.398 -->
- [Events Data Model](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/events-data-model-rh.md>) — similar text 0.36 · same kind/surface <!-- rel:247 s=3.193 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/external-event-registration.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [Configure External Event With LRS](https://www.google.com/search?q=%22Configure%20External%20Event%20With%20LRS%22+site%3Adoc.esri.com) · [Configure External Event Behaviors With LRS](https://www.google.com/search?q=%22Configure%20External%20Event%20Behaviors%20With%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## External event registration
ArcGIS Pipeline Referencing supports two event registration types: registration of events in the LRS geodatabase and registration of events stored in an external database. Events stored in the LRS geodatabase are stored as feature classes, while eExternal events can be configured with or without a connection file. With a connection file, the external events are linked to tables or feature classes in an external relational database management system (RDBMS) and stored as feature classes in the LRS geodatabase. Without a connection file, the external events are created directly in the LRS geodatabase.
Events stored in the LRS geodatabase are stored as feature classes, while external events are stored as tables or feature classes in an external relational database management system (RDBMS).

### External events with a connection file
The Configure External Event With LRS tool allows you to connect to and register event data even ifwhen that it is stored and maintained outside the LRS geodatabase. This is important because some event data is traditionally considered to be nonspatial tabular data.
The LRS allows you to set up a read-only connection to external event data sources and use them to visualize tabular data in a spatial way and to spatially integrate your business data with other enterprise data.
Tip:
You can right-click an external event data source in the LRS Hierarchy pane and add it to a map or scene in ArcGIS Pro.
https://prodev.arcgis.com/en/pro-app/3.5/help/projects/add-maps-to-a-project.htm \hLearn more about adding a web map or scene to the project
Learn more about database connections in ArcGIS Pro and setting up a database connection.
The following are data requirements and recommendations for registering an external event with the LRS:

- Must have an Event ID and Route ID
  - The From Route ID and To Route ID fields are required for events that span routes.
  - The Event ID field in external business tables or feature classes must be a text field.
  - Globally unique identifiers (GUID) are read as text.
- Can have a DateTime field
  - If no DateTime field is used, full temporal viewing of event data is not supported.
  - A single effective date can be used, but both from and to dates are recommended.
  - The SQL Server Datetime2 data type is not supported; use the DateTime data type.
- Point events require only one measure field; linear events require two measure fields.
ArcGIS Pipeline Referencing supports pushing updates to the external system via web services.
Learn more about updating external events (add link to Relocate Event).

(alt: External Event configuration with a connection file.)

### External events without a connection file
The Configure External Event Behaviors With LRS (add link) tool allows you to create external events without linking to a source table or feature. This works for scenarios such as when there is limited access to the event data, or when the event data is not stored as tables in an RDBMS database or as feature layersclasses in from a geodatabase.
This type of external event is not a feature class, but ArcGIS Pipeline Referencing still supports updating and maintaining external events via web services.
Tip:
You can right-click an external event data source in the LRS Hierarchy pane to view its properties. However, this type of external event cannot be added to a map or scene in ArcGIS Pro.
You do not need route or event information to configure external events that do not have a connection file. To update external events, provide required route and event information in the web service.
Learn more about updating external events (add link to Relocate Event).

- (alt: External Event configuration with noout a connection file.)

![Figure 1 — External events without a connection file](../media/external-event-registration-in-arcgis-apr/fig-01-external-events-without-a-connection.png)
![Figure 2 — External events without a connection file](../media/external-event-registration-in-arcgis-apr/fig-02-external-events-without-a-connection.png)
