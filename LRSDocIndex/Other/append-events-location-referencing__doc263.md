# Append Events (Location Referencing)

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [AppendEventsGP_RouteDom.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6188_6190_AppendEvents_RouteDom/AppendEventsGP_RouteDom.docx>) |
| **Edited** | 2024-12-23 23:06 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Events (Location Referencing)"
source_file: "AppendEventsGP_RouteDom.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6188_6190_AppendEvents_RouteDom/AppendEventsGP_RouteDom.docx"
doc_id: 263
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2024-12-23T23:06:23.0016180Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event", "append events", "event feature class", "route concurrency", "conflict prevention", "field mapping", "location referencing"]
tools: ["Append Events"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":124,"file":"append-events-location-referencing__doc124.md","s":8.582},{"doc":525,"file":"append-events-location-referencing__doc525.md","s":7.031},{"doc":128,"file":"append-routes-location-referencing__doc128.md","s":3.962},{"doc":69,"file":"generate-events-location-referencing__doc69.md","s":3.849},{"doc":126,"file":"append-events-date-optional-test-plan__doc126.md","s":3.679}]
```
-->

## Summary

Describes the Append Events tool for appending event records from tables, layers, or feature classes to existing ArcGIS Location Referencing event feature classes. Covers usage details, parameters, conflict prevention, route concurrency handling, and Python code examples for different scenarios including feature services and dominant route appending.

## Related documents

<!-- related:begin -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-location-referencing__doc124.md>) — similar text 0.94 · 2 title words · 2 filename words · same kind/surface <!-- rel:124 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-location-referencing__doc525.md>) — similar text 0.94 · 2 title words · 2 filename words · same kind/surface <!-- rel:525 -->
- [Append Routes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-routes-location-referencing__doc128.md>) — similar text 0.48 · 1 title word · 1 filename word · same kind/surface <!-- rel:128 -->
- [Generate Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-events-location-referencing__doc69.md>) — similar text 0.42 · 1 title word · 1 filename word · same kind/surface <!-- rel:69 -->
- [Append Events Date Optional Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-date-optional-test-plan__doc126.md>) — similar text 0.08 · 2 title words · 2 filename words · same surface <!-- rel:126 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Append Events (Location Referencing)

### Summary
Appends event records from a table, layer, or feature class to an existing ArcGIS Location Referencing event feature class.
Note:
When the target layer is a feature service layer, the validation results are written to a file in the ArcGIS Server directory. By default, this file will be automatically cleaned up after 10 minutes, which may not be enough time to process all of the validations and write them to the workstation that is running ArcGIS Pro. For larger data loads, it is recommended that you adjust the maximum file age to at least one hour. You can edit a server directory in Manager to adjust this setting.

### Usage

- An LRS dataset is required to run this tool.
- Learn more about creating an LRS dataset in ArcGIS Pipeline Referencing or creating an LRS dataset in ArcGIS Roads and Highways .
- The Input Event value can be a table, layer, or feature class.
- Learn more about fields required by the ArcGIS Pipeline Referencing events data model
- Learn more about fields required by the Roads and Highways events data model
- The Target Event value should be a layer or feature class registered with Location Referencing.
- This tool supports point and polyline features. The feature type in the input and target event parameters must match.
- When appending new events using the Add value for the Load Type  parameter, if the Target Event value has a RouteName field configured, events can be appended using the RouteName field.
  - If the Input Event records have Null RouteID fields but RouteName fields, events can be appended using the RouteName field. RouteID fields are then automatically generated for those appended events.
  - If the Input Event records have both RouteID fields and RouteName fields, events will be appended using the RouteID field.
- If the Generate Event ID GUIDs for loaded events parameter is checked, either do not map the EventID field in the field mapping section or ensure that there are Null records in the EventID column in the source event data. If the EventID field in a source event record is populated and the Generate Event ID GUIDs for loaded events parameter is checked, the value in the source event record EventID field will be loaded into the target event.
- If the Append events to dominant routes parameter is checked, the Input Event records will be appended onto the dominant routes whenre route concurrencies exist. If multiple concurrencies exist at the events location, the Input Event featuresInput Event records will be split and appended onto the dominant route for each concurrent route section. If  there is no route concurrency does not exist, the Input Event records will still be appended onto the routes specified in the input event table Input Event parameter value.
- The tool will provide a text file of event Input Event records that differ from the specified routes in the Input Event parameter value and are appended onto the dominant routes that are different from the specified routes in the Input Event records.
- This tool supports conflict prevention and will attempt to acquire and transfer locks.
- When conflict prevention is enabled, the following are supported:
  - The events that need to be appended will automatically acquire event locks if available. If the locks cannot be acquired, the tool will return an error and provide thea text file of offending locks.
    - https://prodev.arcgis.com/en/pro-app/3.4/help/production/location-referencing-pipelines/conflict-prevention.htm \hLearn more about conflict prevention in Pipeline Referencing
    - https://prodev.arcgis.com/en/pro-app/3.4/help/production/roads-highways/conflict-prevention.htm \hLearn more about conflict prevention in Roads and Highways
  - When the Append events to dominant routes parameter is checked, the event locks are checked against only the target routes, which are the most dominant routes to which the events will be appended. If the locks for the target routes cannot be acquired, the tool will return an error and provide a text file of offending locks.
  - Learn more about how route concurrencies are calculated
  - While working in the default version, the locks acquired will be released automatically upon completion of the tool.
  - While working in a child version, the locks acquired will remain in post status upon completion of the tool. You must post or delete the version to release the locks.
  - While working in a child version, if the tool process is cancelled by interruption, the locks are acquired and will remain in releasable status.
- Route calibration on physically gapped routes affects appended events in the following ways:
  - If the route calibration difference across the gap is not zero, appended events will be split at gaps.
  - If the route calibration difference across the gap is zero, appended events will be multipart events.
- You can use an ASCII-formatted .csv file to append events when you use it with an initialization file (schema.ini) that defines the comma-separated fields in the .csv file. The schema initialization file must include the following:
  - The .csv file name and format to initialize
  - A name and data type for each CSV column
  - A maximum width to use if the data type is Text
- The following initialization example declares the .csv file name and format to use, the field name and data type to use for each CSV column (from left to right), and a maximum width for text fields:
- schema.ini
- [source_events.csv]
Format=CSVDelimited
ColNameHeader=True
Col1=FromDate Date
Col2=ToDate Date
Col3=RouteID Text width 255
Col4=RouteName Text width 255
Col5=FromMeasure Double
Col6=ToMeasure Double
Col7=RdType Long
Col8=EventID Text width 50

- Learn more about adding an ASCII or text file table
- If the Append events to dominant routes parameter is checked and the Input Event features are not located completely on a single concurrent route section, the Input Event features will be split at each concurrent route section. The tool will provide a text file of Input Event records that are split into sections and appended to corresponding dominant routes.
- Input Event records

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Input Event | The source event records to append. | Table View |
| Target Event | The Location Referencing event layer or feature class to which the source event records will be appended. | Feature Layer |
| Field Map | Controls how the attribute information in fields of the Input Event parameter value is transferred to the Target Event parameter value. Because the Input Event parameter value is appended to an existing event that has a predefined schema (field definitions), fields cannot be added or removed from the target dataset. While you can set merge rules for each output field, the tool ignores those rules. | Field Mappings |
| Load Type (Optional) | Specifies how appended events will be loaded into the target event feature class. Add—The Input Event records will be appended to the specified target event feature class. Retire overlaps—The Input Event records will be appended to the specified target event feature class and any records that have the same measure or temporality overlaps as the appended events will be retired. If the appended event eclipses the specified target event feature, the target event record will be deleted. Use this option for linear events only. Retire by event ID—The Input Event records will be appended to the specified target event feature class and any records that have the same event ID and temporality overlaps as the appended events will be retired. If the appended event eclipses a target event record that has the same event ID, the target event record will be deleted. Replace by event ID—The Input Event records will be appended to the specified target event feature class, and any records that have the same event ID as the appended events will be replaced. | String |
| Generate Event ID GUIDs for loaded events (Optional) | Specifies whether event IDs will be generated for Input Event records being appended. Generation of event IDs will only be applied to Input Event records with a Null value for the Event ID field. Checked—Event IDs for the Input Event records being appended will be generated. Unchecked—Event IDs for the Input Event records being appended will not be generated. This is the default. | Boolean |
| Generate Shapes (Optional) | Specifies whether the shapes of the records being appended will be regenerated. This parameter is only active when the Input Event parameter value is a feature layer or feature class. Checked—The shapes of the input event features will be regenerated. This is the default. Unchecked—The shapes of the input event features will not be regenerated. | Boolean |
| Append events to dominant routes (Optional) | Specifies whether the Input Event records will be appended to the dominant routes , if route concurrency exists. Checked— The Input Event records will be appended to the dominant routes. Unchecked— The Input Event records will be appended to the input route s , regardless of route dominanc e . This is the default. Alternative: Unchecked— The Input Event records will be appended to the routes specified in the In put Event parameter value , regardless of route dominance. This is the default. |  |

#### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| Output Target Event | The event layer or feature class to which the source event records have been appended. | Feature Layer |
| Output Results File | A text file that details changes made by the tool. | Text File |

#### Python
arcpy.locref.AppendEvents(in_dataset, in_target_event, field_mapping, {load_type}, {generate_event_ids}, {generate_shapes}), {append_to_dominant_route})

| Name | Explanation | Data Type |
| --- | --- | --- |
| in_dataset | The source event records to append. | Table View |
| in_target_event | The Location Referencing event layer or feature class to which the source event records will be appended. | Feature Layer |
| field_mapping | Controls how the attribute information in fields of the in_dataset parameter value is transferred to the in_target_event parameter value. Because the in_dataset parameter value is appended to an existing event that has a predefined schema (field definitions), fields cannot be added or removed from the target dataset. While you can set merge rules for each output field, the tool ignores those rules. The FieldMappings class can be used to define this parameter. | Field Mappings |
| load_type (Optional) | Specifies how appended events with measure or temporality overlaps with identical event IDs as the in_target_event records will be loaded into the event feature class. ADD—The in_dataset records will be appended to the specified target event feature class. No changes are made to the target event records. RETIRE_OVERLAPS—The in_dataset records will be appended to the specified target event feature class and any records that have the same measure or temporality overlaps as the appended events will be retired. If the appended event eclipses the specified target event feature, the target event record will be deleted. Use this option for linear events only. RETIRE_BY_EVENT_ID—The in_dataset records will be appended to the specified target event feature class and any records that have the same event ID and temporality overlaps as the appended events will be retired. If the appended event eclipses a target event record that has the same event ID, the target event record will be deleted. REPLACE_BY_EVENT_ID—The in_dataset records will be appended to the specified target event feature class, and any records that have the same event ID as the appended events will be replaced. | String |
| generate_event_ids (Optional) | Specifies whether event IDs will be generated for in_dataset records being appended. Generation of event IDs will only be applied to in_dataset records with a Null value for the Event ID field. GENERATE_EVENT_IDS—Event IDs for the in_dataset records being appended will be generated. NO_GENERATE_EVENT_IDS—Event IDs for the in_dataset records being appended will not be generated. This is the default. | Boolean |
| generate_shapes (Optional) | Specifies whether the shapes of the records being appended will be regenerated. This parameter is only enabled when the in_dataset value is a feature layer or feature class. GENERATE_SHAPES—The shapes of the input event features will be regenerated. This is the default. NO_SHAPES— The shapes of the input event features will not be regenerated. | Boolean |
| append_to_dominant_route (Optional) | Specifies whether t he in_dataset records will be appended to the dominant routes, if route concurrency exists . APPEND_TO_DOMINANT_ROUTE — The in_dataset records will be appended to the dominant routes. NO_APPEND_TO_DOMINANT_ROUTE — The in_dataset records will be appended to the input routes regardless of route dominance . This is the default. |  |

#### Derived Output

| Name | Explanation | Data Type |
| --- | --- | --- |
| out_target_event | The event layer or feature class to which the source event records have been appended. | Feature Layer |
| out_details_file | A text file that details changes made by the tool. | Text File |

#### Code sample
AppendEvents example 1 (Python)
Demonstrates how to use the AppendEvents function in the Python window to append event records to an existing event feature class.
\# Name: AppendEvents_ex1_pro.py
\# Description: Append event records into an existing Location Referencing event feature class.
\# Requires: ArcGIS Location Referencing

\# Set current workspace
arcpy.env.workspace= r"C:\Pipeline.gdb"

\# Set tool variables
\# Source Event Table in fgdb
in_dataset = "PTMS_Add"

\# Target Event Feature Class in fgdb
in_target_event = "LRSE_PTMS"

#Map fields between target and source
field_mapping = r'AADT "AADT" true true false 4 Long 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,AADT,-1,-1;YEAR_ "YEAR_" true true false 2 Short 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,YEAR_,-1,-1;Cosite "Cosite" true true false 6 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Cosite,0,6;Classd "Classd" true true false 3 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Classd,0,3;SECTION_ "SECTION_" true true false 8 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,SECTION_,0,8;COMM "COMM" true true false 254 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,COMM,0,254;Active "Active" true true false 1 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Active,0,1;Sitetype "Sitetype" true true false 11 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Sitetype,0,11;KFCTR "KFCTR" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,KFCTR,-1,-1;DFCTR "DFCTR" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,DFCTR,-1,-1;TFCTR "TFCTR" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,TFCTR,-1,-1;LOCATION "LOCATION" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,LOCATION,-1,-1;FromDate "FromDate" true true false 8 Date 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,FromDate,-1,-1;ToDate "ToDate" true true false 8 Date 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,ToDate,-1,-1;EventID "EventID" true true false 50 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,EventID,0,50;RouteName "RouteName" true true false 255 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,RouteName,0,255'

load_type = "ADD"

generate_event_ids = "NO_GENERATE_EVENT_IDS"

generate_shapes = "GENERATE_SHAPES"
append_to_dominant_route = “NO_APPEND_TO_DOMINANT_ROUTE”

\# Execute the tool
arcpy.locref.AppendEvents(in_dataset, in_target_event, field_mapping, load_type, generate_event_ids, generate_shapes, append_to_dominant_route)
AppendEvents example 2 (stand-alone script)
Demonstrates how to use the AppendEvents function in a stand-alone Python script to append event records to an existing event feature class. Events are appended to the dominant routes.
\# Name: AppendEvents_StandAlonePython_Example.py
\# Description: Append event records into an existing event feature class.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Set tool variables
\# Source Event Table in fgdb
in_dataset = r"C:\Pipeline.gdb\LRS\PTMS_Add"

\# Target Event Feature Class in fgdb
in_target_event = r"C:\Pipeline.gdb\LRS\LRSE_PTMS"

#Map fields between target and source
field_mapping = r"AADT \"AADT\" true true false 4 Long 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,AADT,-1,-1;YEAR_ \"YEAR_\" true true false 2 Short 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,YEAR_,-1,-1;Cosite \"Cosite\" true true false 6 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Cosite,0,6;Classd \"Classd\" true true false 3 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Classd,0,3;SECTION_ \"SECTION_\" true true false 8 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,SECTION_,0,8;COMM \"COMM\" true true false 254 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,COMM,0,254;Active \"Active\" true true false 1 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Active,0,1;Sitetype \"Sitetype\" true true false 11 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Sitetype,0,11;KFCTR \"KFCTR\" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,KFCTR,-1,-1;DFCTR \"DFCTR\" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,DFCTR,-1,-1;TFCTR \"TFCTR\" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,TFCTR,-1,-1;LOCATION \"LOCATION\" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,LOCATION,-1,-1;FromDate \"FromDate\" true true false 8 Date 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,FromDate,-1,-1;ToDate \"ToDate\" true true false 8 Date 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,ToDate,-1,-1;EventID \"EventID\" true true false 50 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,EventID,0,50;RouteName \"RouteName\" true true false 255 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,RouteName,0,255"

load_type = "REPLACE_BY_EVENT_ID"

generate_event_ids = "NO_GENERATE_EVENT_IDS"

generate_shapes = "GENERATE_SHAPES"
append_to_dominant_route = “APPEND_TO_DOMINANT_ROUTE”

\# Execute the tool
arcpy.locref.AppendEvents(in_dataset, in_target_event, field_mapping, load_type, generate_event_ids, generate_shapes, append_to_dominant_route)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')
AppendEvents example 3 (stand-alone script)
Demonstrates how to use the AppendEvents function in a stand-alone Python script to append event records to a feature service.
\# Name: AppendEvents_Pro_Ex3.py
\# Description: Append events using a feature service. It is recommended to work in a version and post to the default version.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Set tool variables
in_dataset = r"C:\LocationReferencing\LR.gdb\LRS\LineEvent"
field_mapping = r'FROMDATE "From Date" true true false 8 Date 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,FROMDATE,-1,-1;TODATE "To Date" true true false 8 Date 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,TODATE,-1,-1;EVENTID "Event ID" true true false 50 Text 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,EVENTID,0,50;ROUTEID "Route ID" true true false 255 Text 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,ROUTEID,0,255;RouteName "RouteName" true true false 255 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,RouteName,0,255;FROMMEASURE "From Measure" true true false 0 Double 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,FROMMEASURE,-1,-1;TOMEASURE "To Measure" true true false 0 Double 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,TOMEASURE,-1,-1'
load_type = "ADD"
generate_event_ids = "NO_GENERATE_EVENT_IDS"
generate_shapes = "GENERATE_SHAPES"
append_to_dominant_route = “NO_APPEND_TO_DOMINANT_ROUTE”

\# Target event is in a feature service. Sign in to portal is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\# Map the target event from the feature service. In the feature service, 34 corresponds to the target event.
in_target_event = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/34"

\# Execute the tool
arcpy.locref.AppendEvents(in_dataset, in_target_event, field_mapping, load_type, generate_event_ids, generate_shapes, append_to_dominant_route)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
