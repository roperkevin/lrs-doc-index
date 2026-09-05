# Create and modify LRS events

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Source** | [APR_Create and modify LRS Events.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6188_6190_AppendEvents_RouteDom/APR_Create%20and%20modify%20LRS%20Events.docx>) |
| **Edited** | 2024-12-24 04:45 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Create and modify LRS events"
source_file: "APR_Create and modify LRS Events.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6188_6190_AppendEvents_RouteDom/APR_Create%20and%20modify%20LRS%20Events.docx"
doc_id: 262
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2024-12-24T04:45:04.6126416Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event feature class", "line event", "point event", "append events", "dominant route", "measure field", "route name", "spanning routes"]
tools: ["Create LRS Event", "Enable Derived Measure Fields", "Enable Referent Fields", "Create LRS Event From Existing Dataset", "Modify LRS Event", "Append Events"]
products: ["Pipeline Referencing"]
issues: []
related: [{"doc":261,"file":"create-and-modify-lrs-events__doc261.md","s":8.697},{"doc":122,"file":"replace-events__doc122.md","s":3.704},{"doc":120,"file":"add-multiple-line-events-by-route-and-measure__doc120.md","s":3.643},{"doc":263,"file":"append-events-location-referencing__doc263.md","s":3.625},{"doc":235,"file":"add-point-events-by-location-offset__doc235.md","s":3.568}]
```
-->

## Summary

Describes how to create, modify, and load linear referencing system (LRS) events in ArcGIS Pro. Covers using tools to create point or line events, modify event feature classes, and append event records with options for handling overlaps and dominant routes. Includes details on parameters and field mappings for event feature classes within an LRS network.

## Related documents

<!-- related:begin -->
- [Create and modify LRS Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-and-modify-lrs-events__doc261.md>) — similar text 0.70 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:261 -->
- [Replace Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/replace-events__doc122.md>) — similar text 0.23 · 1 title word · 2 filename words · same kind/surface <!-- rel:122 -->
- [Add multiple line events by route and measure](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-multiple-line-events-by-route-and-measure__doc120.md>) — similar text 0.22 · 1 title word · 2 filename words · same kind/surface <!-- rel:120 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-location-referencing__doc263.md>) — similar text 0.25 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:263 -->
- [Add Point Events by Location Offset](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-point-events-by-location-offset__doc235.md>) — similar text 0.21 · 1 title word · 2 filename words · same kind/surface <!-- rel:235 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify LRS events](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-lrs-events.html)

_No page matched:_ [Enable Derived Measure Fields](https://www.google.com/search?q=%22Enable%20Derived%20Measure%20Fields%22+site%3Adoc.esri.com) · [Enable Referent Fields](https://www.google.com/search?q=%22Enable%20Referent%20Fields%22+site%3Adoc.esri.com) · [Create LRS Event From Existing Dataset](https://www.google.com/search?q=%22Create%20LRS%20Event%20From%20Existing%20Dataset%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Create and modify LRS events
ArcGIS Location Referencing allows you to create line or point events in a new event feature class for an existing LRS Network; modify an existing event feature class in an existing LRS Network; or load event records from a table, layer, or feature class into an existing event feature class.
Events in the same geodatabase as the LRS are managed as feature classes. The shape of the event features is managed based on the route, measure, and start and end dates.

### Create an LRS Event
You can use the Create LRS Event  tool to create line or point events for an existing LRS Network. If the event feature class is not modeled in advance, you can create it as an output of this tool while the event is registered in the LRS geodatabase.
Learn more about the event feature class and its fields and properties
To add derived measure fields to the event feature class, run the Enable Derived Measure Fields geoprocessing tool.
To add referent fields to the event feature class, run the Enable Referent Fields tool. This tool enables the referent fields by allowing you to register existing fields as referent fields.
When the Create LRS Event  tool is run with these options, a feature class is created in the geodatabase and is registered with the LRS.

- In ArcGIS Pro, open the Create LRS Event  tool.
- Click the Browse button next to Parent LRS Network and browse to the LRS network feature class in the geodatabase where the event will be registered.
- The Event ID Field, Route ID Field, From Date Field, To Date Field, Location Error Field, and Measure Field parameters are populated from the specified Parent LRS Network value.
- Note:
- If an LRS Network feature class doesn't exist in your LRS, you must create one.
- Provide the name of the event to be registered in the Event Name parameter.
- If the event feature class doesn't exist in the LRS Network, it is created.
- Click the Geometry Type drop-down arrow and choose Point or Line.
- Use the default name or provide a name for the event ID event feature class field in the Event ID Field parameter.
- Use the default name or provide a name for the route ID event feature class field in the Route ID Field parameter.
- Use the default name or provide a name for the starting date event feature class field in the From Date Field parameter.
- Use the default name or provide a name for the ending date event feature class field in the To Date Field parameter.
- Use the default name or provide a name for the location error event feature class field in the Location Error Field parameter.
- Use the default name or provide a name for the measure event feature class field in the Measure Field parameter.
- The Measure Field parameter options depend on the specified Geometry Type value:
  - If you're creating a point event, provide the name of the measure field in the event feature class.
  - If you're creating a line event, provide the name of the starting measure field in the event feature class and specify an ending measure field in the To Measure Field parameter.
- Optionally, check the Store Route Name parameter to store the route name with the event records.
- Optionally, check the Event Spans Routes parameter to enable spanning routes for this event.
- Note:
- This parameter is active only if Geometry Type is Line.
- Click Run to run the tool.
The event feature class is mapped to the selected fields.

### Create an LRS Event from an existing dataset
You can use the Create LRS Event From Existing Dataset  tool to create line or point events for an LRS Network using an existing feature class.
To add referent fields to the event feature class, run the Enable Referent Fields tool. This tool enables the referent fields by allowing you to register existing fields as referent fields.
Learn more about the event feature class and its fields and properties

- In ArcGIS Pro, open the Create LRS Event From Existing Dataset  tool.
- Click the Browse button next to Parent LRS Network and browse to the LRS network feature class in the geodatabase where the event will be registered.
- Note:
- If an LRS Network feature class doesn't exist in your LRS, you must create one.
- Provide the name of the event to be registered in the Event Name parameter.
- If the event feature class doesn't exist in the LRS Network, it is created.
- Click the Event Feature Class drop-down arrow and choose the event feature class.
- The remaining parameters are populated based on the chosen event feature class.
- Note:
- The event feature class must reside in the same feature dataset that contains the LRS.
- Use the default name or choose the event ID feature class field from the Event ID Field drop-down menu.
- Use the default name or choose the route ID feature class field name from the Route ID Field drop-down menu.
- Use the default name or choose the starting date feature class field name from the From Date Field drop-down menu.
- Use the default name or choose the ending date feature class field name from the To Date Field drop-down menu.
- Use the default name or choose the location feature class field name from the Loc Error Field drop-down menu.
- Use the default name or choose the measure feature class field name from the Measure Field drop-down menu.
- If you're creating a line event; choose the starting measure field in the event feature class by clicking the Measure Field drop-down arrow. The To Measure Field parameter is active for line events.
- For line events only, use the default ending measure feature class field or choose it from the To Measure Field drop-down menu.
- Optionally, check the Event Spans Routes parameter to enable spanning routes for this event.
- Note:
- This parameter is active only if Geometry Type is Line.
- Optionally, check the Store Route Name parameter to store the route name with the event records.
- Click Run to run the tool.
The event feature class is mapped to the selected fields.

### Modify an LRS Event
You can modify existing LRS events using the Modify LRS Event tool by remapping one or more LRS event fields in an LRS event feature class. You can use this tool to add or remove properties from a line or point event.
Note:
Any new fields that will be used for field mapping should be created in the underlying LRS Event feature class before using this tool and must have the properties outlined in the events data model.

- In ArcGIS Pro, open the Modify LRS Event tool.
- Click the LRS Event Feature Class drop-down arrow and choose the LRS event feature class you want to modify.
- The feature class must represent an LRS event.
- The remaining parameters are populated based on the selected event feature class.
- Tip:
- You can also choose the event feature class by clicking Browse .
- Choose the replacement field or fields you created in the LRS event feature class.
- Click Run to run the tool.
The event feature class is remapped to the selected fields.

### Load event data
You can load event records from a table, layer, or feature class into an existing event feature class using the Append Events tool.

- In ArcGIS Pro, open the Append Events tool.
- Click the Input Event drop-down arrow and choose the table, layer, or feature class that contains the events you want to load.
- Tip:
- You can also click Browse  next to Input Event to choose the input table, layer, or feature class.
- Click the Target Event drop-down arrow and choose the existing event layer or feature class that contains the source event records you want to load.
- Click the Load Type drop-down arrow in the Field Map section and choose a method for loading the events.
  - Add—Appends input event records to the Target Event value. No changes are made to target event records.
  - Retire overlaps—Appends input event records to the Target Event value and retires any records in the Target Event value with measure or temporality overlaps as the appended events. If the appended event eclipses the Target Event value, it is deleted. This option should only be used for linear events.
  - Retire by event ID—Appends input event records to the Target Event value and retires any records in the Target Event value with the same event ID and temporality overlaps as the appended events. If the appended event eclipses the Target Event value with the same event ID, it is deleted.
  - Replace by event ID—Appends input event records to the Target Event value and deletes any records in the Target Event value with the same event ID as the appended events.
- The Field Map parameter value controls how the attribute information in the fields of the Input Event parameter value is transferred to the target event. Because the input event data is appended to an existing event that has a predefined schema (field definitions), fields cannot be added or deleted from the target dataset. While it is possible to set merge rules for each output field, the tool ignores those rules.
- The Load Type parameter value specifies how appended events with measure or temporality overlap with identical Event IDs. Target event records are loaded into the event feature class.
- Check the Append events to dominant routes box to append events to the dominant route where concurrencies exist.
- The following example illustrates a scenario where point events and spanning line events are appended to the dominant routes. In the following graphics and tables, there are multiple routes across two lines. The concurrent routes have opposite directions and different ranges in time.
In this example, L2R1 is the dominant route. The following shows routes before appending events to the dominant route:

| Route Name | Line Name | From Date | To Date |
| --- | --- | --- | --- |
| L1R1 | L1 | 1/1/2000 | <Null> |
| L1R2 | L1 | 1/1/20 0 1 0 | <Null> |
| L1R 3 | L1 | 1/1/20 0 0 | <Null> |
| L1R4 | L1 | 1/1/20 0 0 | <Null> |
| L2R1 | L2 | 1/1/2010 | <Null> |

In this scenario, two point events are appended at two locations on L1. The InspectionNote1 event will be appended to L1R1 at location 1 because no other route exists at that location.

At Location 2, L1R3 is the only route that exists until 1/1/2010, so the InspectionNote2 event is appended to L1R3 from 1/1/2000 to 1/1/2010. Starting from 1/1/2010, L2R1 has a greater order of dominance, so the InspectionNote2 event will be appended to L2R1. Because the measures of the two routes are different at the event location, each event has a different measure in each time slice.

Similarly, a spanning line event, DOTclass1, is appended to cover the entire L1 from 1/1/2000 to 1/1/2010. Starting from 1/1/2010, the DOTclass1 line event is split to be appended to the dominant route, L2R1, at the concurrent route sections. The appended line events honor their corresponding route direction and measures.

After appending events to the dominant route:

| Event ID | Route Name | Measure | From Date | To Date | Note Type |
| --- | --- | --- | --- | --- | --- |
| InspectionNote1 | L1R1 | 5 | 1/1/2000 | <Null> | G as Facility |
| InspectionNote 2 | L1R3 | 25 | 1/1/2000 | 1/1/2010 | Gas Facility |
| InspectionNote2 | L2R1 | 112 | 1/1/2010 | <Null> | Gas Facility |

| Event ID | From Route Name | From Measure | To Route Name | To Measure | From Date | To Date | Class Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOTclass1 | L1R1 | 0 | L1R4 | 40 | 1/1/2000 | 1/1/2010 | Class 4 |
| DOTclass1 | L1R1 | 0 | L1R2 | 15 | 1/1/2010 | <Null> | Class 4 |
| DOTclass1 | L 2R1 | 106 | L2R1 | 118 | 1/1/2010 | <Null> | Class 4 |
| DOTclass1 | L1R4 | 30 | L1R4 | 40 | 1/1/2010 | <Null> | Class 4 |

- Click Run to run the tool.
The event features are loaded.

![image1.png](../media/doc713_image1.png)
