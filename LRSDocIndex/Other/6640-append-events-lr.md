# Append Events (Location Referencing)

| Field | Value |
| --- | --- |
| **Doc** | 124 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6640](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6640) |
| **Source** | [6640_5009_AppendEventsGP.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6640_5009_AppendEventsGP.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-09-09 18:01 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event · append events · event feature class · route concurrency · conflict prevention · field mapping · event id |
| **Tools** | Append Events |

## Summary

Describes the Append Events tool used to append event records from a table, layer, or feature class to an existing LRS event feature class. Covers usage requirements, parameters, conflict prevention, route concurrency handling, and examples of Python usage for appending events in ArcGIS Pro.

## Related documents

<!-- related:begin -->
- [Allow Append Events to Run When Locks Are Present - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/6640-allow-append-events-to-run-when-locks-are-present.md>) — shared issue ArcGISPro/ps-location-referencing#6640 · similar text 0.16 · 2 title words · 2 filename words · same surface <!-- rel:156 s=1003.244 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-lr-rh-apr-2024-12.md>) — similar text 0.94 · 2 title words · 2 filename words · same kind/surface <!-- rel:263 s=8.582 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-lr-rh-apr-2023-08.md>) — similar text 0.90 · 2 title words · 2 filename words · same kind/surface <!-- rel:525 s=6.833 -->
- [Append Routes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6380-append-routes-lr.md>) — similar text 0.48 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:128 s=5.133 -->
- [Generate Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-events-lr.md>) — similar text 0.46 · 1 title word · 1 filename word · same kind/surface <!-- rel:69 s=4.2 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Append Events (Location Referencing)

### Summary
Appends event records from a table, layer, or feature class to an existing LRS event feature class.
Note:
When the target layer is a feature service layer, the validation results will be written to a file in the ArcGIS Server directory. By default, this file will be automatically cleaned up after 10 minutes, which may not be enough time to process all of the validations and write them to the workstation that is running ArcGIS Pro. For larger data loads, it is recommended that you adjust the maximum file age to at least one hour. You can edit a server directory in ArcGIS Server Manager to adjust this setting.

### Usage

- An LRS dataset is required to run this tool.
  - https://prodev.arcgis.com/en/pro-app/3.6/help/production/location-referencing-pipelines/alrs-data-model.htm  \hLearn more about creating an LRS dataset in ArcGIS Pipeline Referencing
  - https://prodev.arcgis.com/en/pro-app/3.6/help/production/roads-highways/lrs-data-model.htm  \hLearn more about creating an LRS dataset in ArcGIS Roads and Highways
- The Input Event parameter value can be a table, layer, or feature class.
  - https://prodev.arcgis.com/en/pro-app/3.6/help/production/location-referencing-pipelines/events-data-model.htm \hLearn more about fields required by the Pipeline Referencing events data model
  - https://prodev.arcgis.com/en/pro-app/3.6/help/production/roads-highways/events-data-model.htm \hLearn more about fields required by the Roads and Highways events data model
- The Target Event parameter value must be a layer or feature class registered with an LRS.
- Selection sets and definition queries on the Target Event parameter value will be ignored.
- This tool supports point and line features. The feature type in the Input Event and Target Event parameters must match.
- When appending new events using the Add option for the Load Type parameter, if the Target Event value has a RouteName field configured, events can be appended using the RouteName field.
  - If the Input Event records have null RouteID fields but populated RouteName fields, events can be appended using the RouteName field. RouteID fields are then automatically generated for those appended events.
  - If the Input Event records have both RouteID fields and RouteName fields populated, events will be appended using the RouteID field.
- The mapping of the FromDate and ToDate fields is optional for the Add option. The following scenarios are supported:
  - If the FromDate and ToDate fields are not mapped, the appended event will have the same start date as the active time slice of the route, and the end date will have a null value.
  - If the FromDate field is mapped and the ToDate field is not mapped, the appended event will have a null value for its end date.
  - If the FromDate field is not mapped but the ToDate field is mapped, the tool will return an error.
  - For spanning line events, the tool first identifies the most recent time slice across all routes that share the same line ID. Then, the start date of the route's most recent time slice will be assigned as the start date of the appended event, and the end date will have a null value.
  - Note:
If you choose not to map the ToDate field or both the FromDate and ToDate fields, the field(s) must be removed from the fields list in the Field Map parameter.

- If the Generate Event ID GUIDs for loaded events parameter is checked, either do not map the EventID field in the Field Map parameter or ensure that there are null values in the EventID field of the input event. If the EventID field in a source event record is populated and the Generate Event ID GUIDs for loaded events parameter is checked, the value in the source event record EventID field will be loaded into the target event.
- If the Append events to dominant routes parameter is checked, the records from the Input Event parameter value will be appended to the dominant routes where route concurrencies exist. If multiple concurrencies exist along the route, the Input Event records will be split and appended to the dominant route for each concurrent route section. If route concurrency does not exist, the records from the Input Event parameter value will still be appended to the routes specified in the input dataset.
  - The tool will provide a text file of event records that differ from the routes specified in the input dataset and are appended to the dominant routes.
- This tool supports conflict prevention and will attempt to acquire and transfer locks.
- When conflict prevention is enabled, the following are supported:
  - The events that need to be appended will automatically acquire event locks, if available. If the locks cannot be acquired, the tool will return an error and provide a text file of offending locks.
    - https://prodev.arcgis.com/en/pro-app/3.6/help/production/location-referencing-pipelines/conflict-prevention.htm \hLearn more about conflict prevention in Pipeline Referencing
    - https://prodev.arcgis.com/en/pro-app/3.6/help/production/roads-highways/conflict-prevention.htm \hLearn more about conflict prevention in Roads and Highways
  - When the Append events to dominant routes parameter is checked, the event locks are checked against only the target routes, which are the most dominant routes to which the events will be appended. If the locks for the target routes cannot be acquired, the tool will return an error and provide a text file of offending locks.
    - https://prodev.arcgis.com/en/pro-app/3.6/tool-reference/location-referencing/calculate-route-concurrencies.htm \hLearn more about how route concurrencies are calculated
  - If the Append even if there are conflict prevention locks parameter is checked, existing locks will be bypassed, and no new locks will be acquired as a result of running this tool.
- Caution:
  - Bypassing conflict prevention locks may result in data corruption or unexpected behavior. Consider the potential consequences and always create a database backup before running this tool with the Append even if there are conflict prevention locks parameter checked
  - While working in the default version, the locks acquired will be released automatically upon completion of the tool.
  - While working in a named version, the locks acquired will remain in On Post status upon completion of the tool. You must post or delete the version to release the locks.
  - While working in a named version, if the tool process is canceled, the acquired locks will remain in releasable status.
- Route calibration on physically gapped routes affects appended events in the following ways:
  - If the route calibration difference across the gap is not zero, appended events will be split at gaps.
  - If the route calibration difference across the gap is zero, appended events will be multipart events.
- You can use an ASCII-formatted .csv file to append events when you use it with an initialization file (schema.ini) that defines the comma-separated fields in the .csv file. The schema initialization file must include the following:
  - The .csv file name and format to initialize
  - A name and data type for each column
  - A maximum width to use if the data type is Text
- The following initialization example declares the .csv file name and format to use, the field name and data type to use for each column (from left to right), and a maximum width for text fields:
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

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Input Event | The source event records that will be appended. | Table View |
| Target Event | The LRS event layer or feature class to which the source event records will be appended. | Feature Layer |
| Field Map | Controls how the attribute information in the fields of the input event is transferred to the target event.<br>Because the source event records are appended to an existing target event that has a predefined schema (field definitions), fields cannot be added or removed from the target event. While you can set merge rules for each output field, the tool ignores those rules. | Field Mappings |
| Load Type<br>(Optional) | Specifies how appended events will be loaded into the target event.<br>Add—The source event records will be appended to the specified target event.<br>Retire overlaps— The source event records will be appended to the specified target event and any records that have the same measure or temporality overlaps as the appended events will be retired. If the appended event eclipses the specified target event record, the target event record will be deleted. Use this option for line events only.<br>Retire by event ID—The source event records will be appended to the specified target event and any records that have the same event ID and temporality overlaps as the appended events will be retired. If the appended event eclipses a target event record that has the same event ID, the target event record will be deleted.<br>Replace by event ID—The source event records will be appended to the specified target event, and any records that have the same event ID as the appended events will be replaced. | String |
| Generate Event ID GUIDs for loaded events<br>(Optional) | Specifies whether event IDs will be generated for source event records being appended. Generation of event IDs will only be applied to source event records with a null value in the Event ID field.<br>Checked—Event IDs for the source event records being appended will be generated.<br>Unchecked—Event IDs for the source event records being appended will not be generated. This is the default. | Boolean |
| Generate Shapes<br>(Optional) | Note:<br>This parameter is no longer supported. | Boolean |
| Append events to dominant routes<br>(Optional) | Specifies whether the source event records will be appended to the dominant routes if route concurrency exists.<br>Checked—The source event records will be appended to the dominant routes.<br>Unchecked—The source event records will be appended to the routes specified in the input dataset, regardless of route dominance. This is the default.<br>This parameter works with all Load Type options: Add , Retire overlaps , Retire by event ID , and Replace by event ID . | Boolean |
| Append even if there are conflict prevention locks<br>(Optional) | Specifies whether existing locks on the routes to which the events are being appended will be ignored.<br>Checked — The route locks will be ignored.<br>Unchecked — The route locks will not be ignored. This is the default.<br>This parameter is only available when conflict prevention is enabled on the LRS dataset. | Boolean |

#### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| Output Target Event | The event layer or feature class to which the source event records are appended. | Feature Layer |
| Output Results File | A text file that details changes made by the tool. | Text File |

#### Python
arcpy.locref.AppendEvents(in_dataset, in_target_event, field_mapping, {load_type}, {generate_event_ids}, {generate_shapes}, {append_to_dominant_route}, {bypass_conflict_prevention})

| Name | Explanation | Data Type |
| --- | --- | --- |
| in_dataset | The source event records that will be appended. | Table View |
| in_target_event | The LRS event layer or feature class to which the source event records will be appended. | Feature Layer |
| field_mapping | Controls how the attribute information in the fields of the input event is transferred to the target event.<br>Because the source event records are appended to an existing target event that has a predefined schema (field definitions), fields cannot be added or removed from the target event. While you can set merge rules for each output field, the tool ignores those rules.<br>The FieldMappings class can be used to define this parameter. | Field Mappings |
| load_type<br>(Optional) | Specifies how appended events will be loaded into the target event.<br>ADD— The source event records will be appended to the specified target event.<br>RETIRE_OVERLAPS—The source event records will be appended to the specified target event and any records that have the same measure or temporality overlaps as the appended events will be retired. If the appended event eclipses the specified target event record, the target event record will be deleted. Use this option for line events only.<br>RETIRE_BY_EVENT_ID—The source event records will be appended to the specified target event and any records that have the same event ID and temporality overlaps as the appended events will be retired. If the appended event eclipses a target event record that has the same event ID, the target event record will be deleted.<br>REPLACE_BY_EVENT_ID—The source event records will be appended to the specified target event, and any records that have the same event ID as the appended events will be replaced. | String |
| generate_event_ids<br>(Optional) | Specifies whether event IDs will be generated for source event records being appended. Generation of event IDs will only be applied to source event records with a null value in the Event ID field.<br>GENERATE_EVENT_IDS—Event IDs for the source event records being appended will be generated.<br>NO_GENERATE_EVENT_IDS—Event IDs for the source event records being appended will not be generated. This is the default. | Boolean |
| generate_shapes<br>(Optional) | Note:<br>This parameter is no longer supported. | Boolean |
| append_to_dominant_route<br>(Optional) | Specifies whether the in_dataset records will be appended to the dominant routes if route concurrency exists.<br>APPEND_TO_DOMINANT_ROUTE—The source event records will be appended to the dominant routes.<br>NO_APPEND_TO_DOMINANT_ROUTE—The source event records will be appended to the routes specified in the input dataset, regardless of route dominance. This is the default.<br>This parameter works with all load_type options: ADD , RETIRE_OVERLAPS , RETIRE_BY_EVENT_ID , and REPLACE_BY_EVENT_ID . | Boolean |
| bypass _conflict_prevention<br>(Optional) |  | Boolean |

#### Derived Output

| Name | Explanation | Data Type |
| --- | --- | --- |
| out_target_event | The event layer or feature class to which the source event records are appended. | Feature Layer |
| out_details_file | A text file that details changes made by the tool. | Text File |

#### Code sample
AppendEvents example 1 (Python window)
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

append_to_dominant_route = "NO_APPEND_TO_DOMINANT_ROUTE"
bypass_conflict_prevention = "NO_BYPASS_CONFLICT_PREVENTION"

\# Execute the tool
arcpy.locref.AppendEvents(in_dataset, in_target_event, field_mapping, load_type, generate_event_ids, None, append_to_dominant_route, bypass_conflict_prevention)
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

append_to_dominant_route = "APPEND_TO_DOMINANT_ROUTE"
bypass_conflict_prevention = "NO_BYPASS_CONFLICT_PREVENTION"

\# Execute the tool
arcpy.locref.AppendEvents(in_dataset, in_target_event, field_mapping, load_type, generate_event_ids, None, append_to_dominant_route, bypass_conflict_prevention)

\# Check in license
arcpy.CheckInExtension("LocationReferencing")
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
append_to_dominant_route = "NO_APPEND_TO_DOMINANT_ROUTE"
bypass_conflict_prevention = "NO_BYPASS_CONFLICT_PREVENTION"

\# Target event is in a feature service. Sign in to portal is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\# Map the target event from the feature service. In the feature service, 34 corresponds to the target event.
in_target_event = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/34"

\# Execute the tool
arcpy.locref.AppendEvents(in_dataset, in_target_event, field_mapping, load_type, generate_event_ids, None, append_to_dominant_route, ignore_conflict_prevention)

\# Check in license
arcpy.CheckInExtension("LocationReferencing")

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
