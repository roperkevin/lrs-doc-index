# Append Events (Location Referencing)

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [AppendEventsRname_doc.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5228_AppendEventsByRouteName/AppendEventsRname_doc.docx>) |
| **Edited** | 2023-08-08 18:33 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Events (Location Referencing)"
source_file: "AppendEventsRname_doc.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5228_AppendEventsByRouteName/AppendEventsRname_doc.docx"
doc_id: 525
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Claire Wang"
last_edited: "2023-08-08T18:33:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event", "append events", "location referencing", "event feature class", "route name", "conflict prevention", "field mapping", "feature service"]
tools: ["Append Events"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":263,"file":"append-events-location-referencing__doc263.md","s":7.031},{"doc":124,"file":"append-events-location-referencing__doc124.md","s":6.833},{"doc":69,"file":"generate-events-location-referencing__doc69.md","s":3.744},{"doc":128,"file":"append-routes-location-referencing__doc128.md","s":3.733},{"doc":126,"file":"append-events-date-optional-test-plan__doc126.md","s":3.243}]
```
-->

## Summary

Describes the Append Events tool for appending event records from tables, layers, or feature classes into existing ArcGIS Location Referencing event feature classes. Covers usage details, parameters, conflict prevention, route calibration effects, and examples of Python scripts for executing the tool in different environments including feature services.

## Related documents

<!-- related:begin -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-location-referencing__doc263.md>) — similar text 0.94 · 2 title words · 2 filename words · same kind/surface <!-- rel:263 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-location-referencing__doc124.md>) — similar text 0.90 · 2 title words · 2 filename words · same kind/surface <!-- rel:124 -->
- [Generate Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-events-location-referencing__doc69.md>) — similar text 0.38 · 1 title word · 1 filename word · same kind/surface <!-- rel:69 -->
- [Append Routes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-routes-location-referencing__doc128.md>) — similar text 0.43 · 1 title word · 1 filename word · same kind/surface <!-- rel:128 -->
- [Append Events Date Optional Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-date-optional-test-plan__doc126.md>) — similar text 0.08 · 2 title words · 2 filename words · same surface <!-- rel:126 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

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
- This tool supports point and polyline features. The feature type in the input and target event parameters should match.
- When appending new events using load type ADD, if the target LRS event layer has a route name configured, then events can be appended using the route name.
  - If the Input Event records have null route IDs but route names, events can be appended using the route name and then route IDs are automatically generated for those appended events.
  - If the Input Event records have both route IDs and route names, events will be appended using the route ID.
- If the Generate Event ID GUIDs for loaded events parameter is checked and you want GUIDs generated, either do not map the EventID field in the field mapping section or ensure that there are Null records in the EventID column in the source event data. If the EventID field in a source event record is populated and the Generate Event ID GUIDs for loaded events parameter is checked, the value in the source event record EventID field will be loaded into the target event.
- This tool supports conflict prevention and will attempt to acquire and transfer locks.
- When conflict prevention is enabled, the following are supported:
  - The events that need to be appended will automatically acquire event locks if available. If the locks cannot be acquired, the tool will return an error and provide the text file of offending locks.
    - https://prodev.arcgis.com/en/pro-app/3.2/help/production/location-referencing-pipelines/conflict-prevention.htm \h Learn more about conflict prevention in Pipeline Referencing
    - https://prodev.arcgis.com/en/pro-app/3.2/help/production/roads-highways/conflict-prevention.htm \h Learn more about conflict prevention in Roads and Highways
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
- The following initialization example declares the .csv file name and format to use, the field name and data type to use for each CSV column (from left to right), and a maximum width for text fields.
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
DialogPython

| Label | Explanation | Data Type |
| --- | --- | --- |
| Input Event | The source event records to append. | Table View |
| Target Event | The Location Referencing event layer or feature class into which the source event records will be appended. | Feature Layer |
| Field Map | Controls how the attribute information in fields of the Input Event parameter value is transferred to the Target Event parameter value. Because the Input Event parameter value is appended into an existing event that has a predefined schema (field definitions), fields cannot be added or removed from the target dataset. While you can set merge rules for each output field, the tool ignores those rules. | Field Mappings |
| Load Type (Optional) | Specifies how appended events will be loaded into the target event feature class. Add—The Input Event records will be appended to the specified target event feature class. Retire overlaps—The Input Event records will be appended to the specified target event feature class and any records that have the same measure or temporality overlaps as the appended events will be retired. If the appended event eclipses the specified target event feature, the target event record will be deleted. Use this option for linear events only. Retire by event ID—The Input Event records will be appended to the specified target event feature class and any records that have the same Event ID and temporality overlaps as the appended events will be retired. If the appended event eclipses a target event record that has the same Event ID, the target event record will be deleted. Replace by event ID—The Input Event records will be appended to the specified target event feature class, and any records that have the same Event ID as the appended events will be replaced. | String |
| Generate Event ID GUIDs for loaded events (Optional) | Specifies whether event IDs will be generated for Input Event records being appended. Generation of event IDs will only be applied to Input Event records with a Null value for the Event ID field. Checked—Event IDs for the Input Event records being appended will be generated. Unchecked—Event IDs for the Input Event records being appended will not be generated. This is the default. | Boolean |
| Generate Shapes (Optional) | Specifies whether the shapes of the records being appended will be regenerated. This parameter is only active when the Input Event value is a feature layer or feature class. Checked—The shapes of the input event features will be regenerated. This is the default. Unchecked—The shapes of the input event features will not be regenerated. | Boolean |

#### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| Output Target Event | The event layer or feature class to which the source event records have been appended. | Feature Layer |
| Output Results File | A text file that details changes made by the tool. | Text File |

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
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

load_type = "Add"

generate_event_ids = "NO_GENERATE_EVENT_IDS"

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

#Map fields b/w target and source
field_mapping = r"AADT \"AADT\" true true false 4 Long 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,AADT,-1,-1;YEAR_ \"YEAR_\" true true false 2 Short 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,YEAR_,-1,-1;Cosite \"Cosite\" true true false 6 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Cosite,0,6;Classd \"Classd\" true true false 3 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Classd,0,3;SECTION_ \"SECTION_\" true true false 8 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,SECTION_,0,8;COMM \"COMM\" true true false 254 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,COMM,0,254;Active \"Active\" true true false 1 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Active,0,1;Sitetype \"Sitetype\" true true false 11 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,Sitetype,0,11;KFCTR \"KFCTR\" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,KFCTR,-1,-1;DFCTR \"DFCTR\" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,DFCTR,-1,-1;TFCTR \"TFCTR\" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,TFCTR,-1,-1;LOCATION \"LOCATION\" true true false 8 Double 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,LOCATION,-1,-1;FromDate \"FromDate\" true true false 8 Date 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,FromDate,-1,-1;ToDate \"ToDate\" true true false 8 Date 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,ToDate,-1,-1;EventID \"EventID\" true true false 50 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,EventID,0,50;RouteName \"RouteName\" true true false 255 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,RouteName,0,255"

load_type = "REPLACE_BY_EVENT_ID"

generate_event_ids = "NO_GENERATE_EVENT_IDS"

generate_shapes = "GENERATE_SHAPES"

\# Execute the tool
arcpy.locref.AppendEvents(in_dataset, in_target_event, field_mapping, load_type, generate_event_ids, generate_shapes)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')

\# Name: AppendEvents_Pro_Ex3.py
\# Description: Append events using a feature service. It is recommended to work in a version and post to the default version.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Set tool variables
sourceevent = r"C:\LocationReferencing\LR.gdb\LRS\LineEvent"
field_mapping = r'FROMDATE "From Date" true true false 8 Date 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,FROMDATE,-1,-1;TODATE "To Date" true true false 8 Date 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,TODATE,-1,-1;EVENTID "Event ID" true true false 50 Text 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,EVENTID,0,50;ROUTEID "Route ID" true true false 255 Text 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,ROUTEID,0,255;RouteName "RouteName" true true false 255 Text 0 0,First,#,C:\Pipeline.gdb\LRS\PTMS_Add,RouteName,0,255;FROMMEASURE "From Measure" true true false 0 Double 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,FROMMEASURE,-1,-1;TOMEASURE "To Measure" true true false 0 Double 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\LineEvent,TOMEASURE,-1,-1'
load_type = "ADD"
generate_event_ids = "NO_GENERATE_EVENT_IDS"
generate_shapes = "GENERATE_SHAPES"

\# Target event is in a feature service. Sign in to portal is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\# Map the target event from the feature service. In the feature service, 34 corresponds to the target event.
targetevent = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/34"

\# Execute the tool
arcpy.locref.AppendEvents(sourceevent, targetevent, field_mapping, load_type, generate_event_ids, generate_shapes)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')
