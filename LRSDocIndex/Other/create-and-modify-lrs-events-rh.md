# Create and modify LRS Events

| Field | Value |
| --- | --- |
| **Doc** | 261 · Other · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [RH_Create and modify LRS Events.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6188_6190_AppendEvents_RouteDom/RH_Create%20and%20modify%20LRS%20Events.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2024-12-26 19:37 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event feature class · line event · point event · append events · dominant route · event modification · referent fields |
| **Tools** | Create LRS Event · Enable Referent Fields · Create LRS Event From Existing Dataset · Modify LRS Event · Append Events |

## Summary

Describes how to create, modify, and load linear referencing system (LRS) events in ArcGIS Pro. Covers using tools to create new event feature classes, modify existing events, and append event records with options for handling overlaps and dominant routes.

## Related documents

<!-- related:begin -->
- [Create and modify LRS events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-and-modify-lrs-events-apr.md>) — similar text 0.70 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:262 s=8.697 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-lr-rh-apr-2024-12.md>) — similar text 0.25 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:263 s=3.625 -->
- [Add Point Events by Location Offset](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-point-events-by-location-offset-rh.md>) — similar text 0.23 · 1 title word · 1 filename word · same kind/surface <!-- rel:234 s=3.348 -->
- [Events Data Model](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/events-data-model-rh.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface <!-- rel:247 s=3.333 -->
- [Add Linear Events to Dominant Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-linear-events-to-dominant-routes.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface <!-- rel:326 s=3.283 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify LRS events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-and-modify-lrs-events.html)

_No page matched:_ [Enable Referent Fields](https://www.google.com/search?q=%22Enable%20Referent%20Fields%22+site%3Adoc.esri.com) · [Create LRS Event From Existing Dataset](https://www.google.com/search?q=%22Create%20LRS%20Event%20From%20Existing%20Dataset%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Create and modify LRS Events
ArcGIS Location Referencing allows you to create line or point events in a new event feature class for an existing LRS Network; modify an existing event feature class in an existing LRS Network; or load event records from a table, layer, or feature class into an existing event feature class.
Events in the same geodatabase as the LRS are managed as feature classes. The shape of the event features is managed based on the route, measure, and start and end dates.

### Create an LRS Event
You can use the Create LRS Event  tool to create line or point events for an existing LRS Network. If the event feature class is not modeled in advance, you can create it as an output of this tool while the event is registered in the LRS geodatabase.
Learn more about the event feature class and its fields and properties
To add referent fields to the event feature class, run the Enable Referent Fields tool. This tool enables the referent fields by allowing you to register existing fields as referent fields.
When the Create LRS Event  tool is run with these options, a feature class is created in the geodatabase and is registered with the LRS.

1. In ArcGIS Pro, open the Create LRS Event  tool.

1. Click the Browse button next to Parent LRS Network and browse to the LRS network feature class in the geodatabase where the event will be registered.

- The Event ID Field, Route ID Field, From Date Field, To Date Field, Location Error Field, and Measure Field parameters are populated from the specified Parent LRS Network value.
- Note:
- If an LRS Network feature class doesn't exist in your LRS, create one.

1. Provide the name of the event to be registered in the Event Name parameter.

- If the event feature class doesn't exist in the LRS Network, it is created.

1. Click the Geometry Type drop-down arrow and choose Point or Line.

1. Use the default name or provide a name for the event ID event feature class field in the Event ID Field parameter.

1. Use the default name or provide a name for the route ID event feature class field in the Route ID Field parameter.

1. Use the default name or provide a name for the starting date event feature class field in the From Date Field parameter.

1. Use the default name or provide a name for the ending date event feature class field in the To Date Field parameter.

1. Use the default name or provide a name for the location error event feature class field in the Location Error Field parameter.

1. Use the default name or provide a name for the measure event feature class field in the Measure Field parameter.

- The Measure Field parameter options depend on the specified Geometry Type value:
  - If you're creating a point event, provide the name of the measure field in the event feature class.
  - If you're creating a line event, provide the name of the starting measure field in the event feature class and specify an ending measure field in the To Measure Field parameter.

1.  Optionally, check the Store Route Name parameter to store the route name with the event records.

1. Optionally, check the Event Spans Routes parameter to enable spanning routes for this event.

- Note:
- This parameter is active only if Geometry Type is Line.

1. Click Run to run the tool.
The event feature class is mapped to the selected fields.

### Create an LRS Event from an existing dataset
You can use the Create LRS Event From Existing Dataset  tool to create line or point events for an LRS Network using an existing feature class.
To add referent fields to the event feature class, run the Enable Referent Fields tool. This tool enables the referent fields by allowing you to register existing fields as referent fields.
Learn more about the event feature class and its fields and properties

1. In ArcGIS Pro, open the Create LRS Event From Existing Dataset  tool.

1. Click the Browse button  next to Parent LRS Network and browse to the LRS network feature class in the geodatabase where the event will be registered.

- Note:
- If an LRS Network feature class doesn't exist in your LRS, create the LRS Network.

1. Provide the name of the event to be registered in the Event Name parameter.

- If the event feature class doesn't exist in the LRS Network, it is created.

1. Click the Event Feature Class drop-down arrow and choose the event feature class.

- The remaining parameters are populated based on the chosen event feature class.
- Note:
- The event feature class must reside in the same feature dataset that contains the LRS.

1. Use the default name or choose the event ID feature class field from the Event ID Field drop-down menu.

1. Use the default name or choose the route ID feature class field name from the Route ID Field drop-down menu.

1. Use the default name or choose the starting date feature class field name from the From Date Field drop-down menu.

1. Use the default name or choose the ending date feature class field name from the To Date Field drop-down menu.

1. Use the default name or choose the location feature class field name from the Loc Error Field drop-down menu.

1.  Use the default name or choose the measure feature class field name from the Measure Field drop-down menu.

- If you're creating a line event; choose the starting measure field in the event feature class by clicking the Measure Field drop-down arrow. The To Measure Field parameter is active for line events.

1. For line events only, use the default ending measure feature class field or choose it from the To Measure Field drop-down menu.

1.  Optionally, check the Store Route Name parameter to store the route name with the event records.

1. Optionally, check the Event Spans Routes parameter to enable spanning routes for this event.

- Note:
- This parameter is active only if Geometry Type is Line.

1. Click Run to run the tool.
The event feature class is mapped to the selected fields.

### Modify an LRS Event
You can modify existing LRS events using the Modify LRS Event tool by remapping one or more LRS event fields in an LRS event feature class. You can use this tool to add or remove properties from a line or point event.
Note:
Any new fields that will be used for field mapping should be created in the underlying LRS Event feature class before using this tool and must have the properties outlined in the events data model.

1.  In ArcGIS Pro, open the Modify LRS Event tool.

1. Click the LRS Event Feature Class drop-down arrow and choose the LRS event feature class you want to modify.

- The feature class must represent an LRS event.
- The remaining parameters are populated based on the selected event feature class.
- Tip:
- You can also choose the event feature class by clicking Browse .

1. Choose the replacement field or fields you created in the LRS event feature class.

1. Click Run to run the tool.
The event feature class is remapped to the selected fields.

### Load event data
You can load event records from a table, layer, or feature class into an existing event feature class using the Append Events tool.

1.  In ArcGIS Pro, open the Append Events tool.

1. Click the Input Event drop-down arrow and choose the table, layer, or feature class that contains the events you want to load.

- Tip:
- You can also click Browse  next to Input Event to choose the input table, layer, or feature class.

1. Click the Target Event drop-down arrow and choose the existing event layer or feature class that contains the source event records you want to load.

1. Click the Load Type drop-down arrow in the Field Map section and choose a method for loading the events.

  - Add—Appends input event records to the Target Event value. No changes are made to target event records.
  - Retire overlaps—Appends input event records to the Target Event value and retires any records in the Target Event value with measure or temporality overlaps as the appended events. If the appended event eclipses the Target Event value, it is deleted. This option should only be used for linear events.
  - Retire by event ID—Appends input event records to the Target Event value and retires any records in the Target Event value with the same event ID and temporality overlaps as the appended events. If the appended event eclipses the Target Event value with the same event ID, it is deleted.
  - Replace by event ID—Appends input event records to the Target Event value and deletes any records in the Target Event value with the same event ID as the appended events.
- The Field Map parameter value controls how the attribute information in the fields of the Input Event parameter value is transferred to the target event. Because the input event data is appended to an existing event that has a predefined schema (field definitions), fields cannot be added or deleted from the target dataset. While it is possible to set merge rules for each output field, the tool ignores those rules.
- The Load Type parameter value specifies how appended events with measure or temporality overlap with identical Event IDs. Target event records are loaded into the event feature class.

1. Check the Append events to dominant routes parameter to append events to the dominant route where concurrencies exist.

The following example illustrates a scenario where point and line events are appended to the dominant route. In the following graphics and tables, there are routes named Route1 and Route2. The concurrent routes have opposite directions and different ranges in time.
Route2 is the dominant route. The following shows routes before appending events to the dominant route:

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | <Null> |
| Route2 | 1/1/2010 | <Null> |

For example, t

Two point events will beare appended at two locations on route 100Route1. The Crash1 event will be appended to rRoute 100 at location 1 because no other route exists at that location.
At Location 2, route 100 Route1 is the only route that exists until 1/1/2010, so the Crash2 event is appended to route 100Route1 from 1/1/2000 to 1/1/2010. Starting from 1/1/2010, route 200 Route2 has a greater order of dominance, so the Crash2 event will be appended to route 200Route2. Because the measures of the two routes are different at the event locations, theeach event has a different measures in each different time slices.
Similarly, a a line event, FunctionalClass1, will beis appended to cover the entire Route1 . The event is appended on Route1 from 1/1/2000 to 1/1/2010. Starting from 1/1/2010, the line event is split to be appended to on the dominant route,  Route2, at the concurrent route section. The resultantappended line events honor their corresponding route direction and measures.

The following shows routes aAfter appending events to the dominant route:

| Event ID | Route ID | Measure | From Date | To Date | Severity |
| --- | --- | --- | --- | --- | --- |
| Crash1 | Route 1 | 2 | 1/1/2000 | <Null> | Fatal |
| Crash 2 | R oute1 | 5 | 1/1/2000 | 1/1/20 1 0 | Fatal |
| Crash2 | Route2 | 4 | 1/1/2010 | <Null> | Fatal |

| Event ID | Route ID | From Measure | To Measure | From Date | To Date | Functional Class Type |
| --- | --- | --- | --- | --- | --- | --- |
| FunctionalClass1 | Route1 | 0 | 10 | 1/1/2000 | 1/1/2010 | Arterial |
| FunctionalClass1 | Route 1 | 0 | 3 | 1/1/2010 | <Null> | Arterial |
| FunctionalClass1 | Route2 | 3 .5 | 8 | 1/1/2010 | <Null> | Arterial |
| FunctionalClass1 | Route1 | 6 | 10 | 1/1/20 1 0 | <Null> | Arterial |

1. Click Run to run the tool.
The event features are loaded.

![Figure 1 — Load event data](../media/create-and-modify-lrs-events-rh/fig-01-load-event-data.png)
