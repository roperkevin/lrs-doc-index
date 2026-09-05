# Append Routes (Location Referencing)

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#6380](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6380) |
| **Source** | [6380_AppendRoutes.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6380_AppendRoutes.docx>) |
| **Edited** | 2025-08-29 22:55 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Routes (Location Referencing)"
source_file: "6380_AppendRoutes.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6380_AppendRoutes.docx"
doc_id: 128
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-08-29T22:55:52.6600392Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["routes", "append routes", "centerlines", "lrs network", "field mapping", "validation", "load type"]
tools: ["Append Routes"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#6380"]
related: [{"doc":137,"file":"append-routes-allow-partial-loading-test-plan__doc137.md","s":1003.647},{"doc":124,"file":"append-events-location-referencing__doc124.md","s":5.133},{"doc":111,"file":"append-routes__doc111.md","s":4.396},{"doc":263,"file":"append-events-location-referencing__doc263.md","s":3.962},{"doc":525,"file":"append-events-location-referencing__doc525.md","s":3.733}]
```
-->

## Summary

Describes the Append Routes tool used to append routes from an input polyline layer into an LRS Network. Covers usage details, parameters, error conditions, and examples of Python scripts for running the tool in various scenarios including feature services and line networks.

## Related documents

<!-- related:begin -->
- [Append Routes: Allow Partial Loading Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-routes-allow-partial-loading-test-plan__doc137.md>) — shared issue ArcGISPro/ps-location-referencing#6380 · similar text 0.13 · 2 title words · 1 filename word · same surface <!-- rel:137 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-location-referencing__doc124.md>) — similar text 0.48 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:124 -->
- [Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-routes__doc111.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind/folder <!-- rel:111 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-location-referencing__doc263.md>) — similar text 0.48 · 1 title word · 1 filename word · same kind/surface <!-- rel:263 -->
- [Append Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-events-location-referencing__doc525.md>) — similar text 0.43 · 1 title word · 1 filename word · same kind/surface <!-- rel:525 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Append Routes (Location Referencing)

### Summary
Appends routes from an input polyline layer into an LRS Network.
Note:
When the target layer is a feature service layer, the validation results will be written to a file in the ArcGIS Server directory. By default, this file will be automatically cleaned up after 10 minutes, which may not be enough time to process all of the validations and write them to the workstation that is running ArcGIS Pro. For larger data loads, it is recommended that you adjust the maximum file age to at least one hour. You can edit a server directory in ArcGIS Server Manager to adjust this setting.

### Usage

- An LRS dataset is required to run this tool.
  - https://pro.arcgis.com/en/pro-app/3.5/help/production/location-referencing-pipelines/alrs-data-model.htm  \hLearn more about creating an LRS dataset in ArcGIS Pipeline Referencing
  - https://pro.arcgis.com/en/pro-app/3.5/help/production/roads-highways/lrs-data-model.htm  \hLearn more about creating an LRS dataset in ArcGIS Roads and Highways
- This tool supports appending routes on existing centerlines when the Consider existing centerlines parameter is checked.
  - When not considering existing centerlines, this tool creates centerlines in the target LRS dataset and the routes in the target LRS Network.
  - When considering existing centerlines, this tool associates routes with existing centerlines in the target LRS dataset that have an exact geometry match with the source routes. If the centerline that you append to a route does not have a centerline ID, one is created, and a centerline sequence record is added. If a centerline ID exists where you append a route, the existing centerline sequence record is updated with the appended route's route ID.
- When the Consider existing centerlines parameter is checked, the following conditions will result in an error, and must be resolved before the tool can be run to completion:
  - Appending the route feature requires a centerline split.
  - The x, y, and z geometries of the centerlines and routes do not match.
  - A centerline is a partial match, for example, if part of the centerline is outside the x-, y-, and z-tolerance.
  - An appended route has one or more centerlines that match the geometry, but there are locations where no centerlines exist.
  - Overlapping centerlines are detected.
  - There are no centerlines that match an appended route.
- The output routes will have x-, y-, and z-values from the input polyline vertices, but no m-values will be appended.
- Create any new fields that will be used for field mapping in the underlying LRS Network feature class before appending routes.
- The spatial reference, x,y resolution, and x,y tolerance of the input polyline feature class and the target LRS Network must match.
- A text file is written locally that states that the tool has been run and contains information about routes that failed validation. The tool messages provide the location of the text file, which is in the temporary directory.
- When the Allow partial loading of routes parameter is checked, the following are supported:
  - Valid source routes will still be appended to the target LRS Network, even if certain source routes fail validation.
  - The tool will provide a feature class named Skipped Routes, which contains source routes that fail validation. You can use the information in the text file to fix the problematic source routes.
Note:
The feature class that is created is temporary and is deleted when the application is closed. To make a copy of the feature class, right-click the layer in the Contents pane > Data > Export Features, or use the Export Features tool.

- The output of this tool is a modified LRS Network that has had routes appended and centerline features created.
- When conflict prevention is enabled, the following are supported:
  - If the routes to be appended are new, no locks will be acquired for those routes.
  - For other load types, such as Retire by route ID and Replace by route ID, locks will be automatically acquired if available.
  - If the locks cannot be acquired, the tool will not run and will provide a text file of the offending locks.
  - If working in the default version, the acquired locks will be released automatically when the tool finishes running successfully.
  - If working in a named version, the acquired locks will remain in the releasable status of On Post after the tool completes. Post or delete the version to release the locks.
  - If working in a named version and the tool process is canceled by interruption, the acquired locks will remain in the releasable status of Yes. The lock owner can release the locks.
- Learn more about releasing locks in ArcGIS Pipeline Referencing or releasing locks in ArcGIS Roads and Highways.
- Learn more about conflict prevention in ArcGIS Pipeline Referencing or conflict prevention in ArcGIS Roads and Highways.
- If the input polyline feature class contains curves, the curves will be densified.
- Learn more about curves in ArcGIS Pipeline Referencing or curves in ArcGIS Roads and Highways.
- If the target LRS Network is configured as a line network with support for a multi-field route ID, the following parameters are not required for appending routes:
  - Route Name Field
  - Line Name Field
- When appending new routes using the Add parameter value for the Load Type parameter, if the target LRS Network has a route name configured, routes can be appended using the route name. If the route IDs are null, route IDs will be automatically generated for the appended routes.
- The tool checks that the line order values are greater than zero and in increments of 100 with flow and direction of routes in a line. Incorrect line order values will cause the tool to fail. The output text file reports the incorrect line order values as errors. The tool will run successfully once these errors are fixed.
- The tool checks for a utility network that is configured with the LRS Network to which the routes will be loaded. If a utility network is found, the tool considers existing centerlines when appending routes, and the Consider existing centerlines parameter is hidden in the Geoprocessing pane.
- Learn more about managing Pipeline Referencing and a utility network together
- This tool will fail if the Load Type parameter is set to Replace by route ID or Retire by route ID and the source route does not have the same route name and route ID values as the target route.
- If the Replace by route ID parameter value is specified for the Load Type parameter, any routes that are replaced will have the route and centerline sequence records replaced. Calibration points on the route will be deleted and must be re-created or reloaded.
- If the LRS is configured with the Address Data Management solution, the Consider existing centerlines parameter is checked by default.

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Source Routes | The input from which the routes will be derived. The input can be a polyline feature class, shapefile, feature service, or LRS Network feature class. | Feature Layer |
| LRS Network | The target LRS Network where the routes will be loaded. | Feature Layer |
| Route ID Field | The field in the input polyline feature class that will be mapped to the LRS Network's route ID field. The field type must match the RouteID field type of the target LRS Network and must be either a string or GUID field type. If it is a string field, the field length must be shorter than or equal to the length of the target RouteID field. | Field |
| Route Name Field | The field in the input polyline feature class that will be mapped to the LRS Network's route name field. The field must be a string field, and the field length must be shorter than or equal to the length of the target route name field. | Field |
| From Date Field (Optional) | The date field in the input polyline feature class that will be mapped to the LRS Network's start date field. If the field is not mapped, a null value representing the beginning of time will be provided for all appended routes. | Field |
| To Date Field (Optional) | The date field in the input polyline feature class that will be mapped to the LRS Network's end date field. If the field is not mapped, a null value representing the end of time will be provided for all appended routes. | Field |
| Line ID Field (Optional) | The field in the input polyline feature class that will be mapped to the LRS Network's line ID field. This parameter is only used if the target LRS Network is an LRS line network. The field type and length must match those of the centerline sequence table's route ID field. | Field |
| Line Name Field (Optional) | The string field in the input polyline feature class that will be mapped to the LRS Network's line name field. This parameter is only used if the target LRS Network is an LRS line network. | Field |
| Line Order Field (Optional) | The long integer field in the input polyline feature class that will be mapped to the LRS Network's line order field. This parameter is only used if the target LRS Network is an LRS line network. Learn more about line networks and line order in Pipeline Referencing or line networks and line order in Roads and Highways . | Field |
| Field Map (Optional) | Controls how attribute information in the source route fields will be transferred to the input LRS Network. Fields cannot be added to or removed from the target LRS Network because the data of the source routes is appended to an existing LRS Network that has a predefined schema. While you can set merge rules for each output field, the tool will ignore them. | Field Mappings |
| Load Type (Optional) | Specifies how appended routes with measure or temporality overlaps with identical route IDs will be loaded into the network feature class. Add—The appended routes will be loaded into the target LRS Network. If any route ID in the source routes already exists in the target LRS Network with the same temporality, it will be written to the output log as a duplicate route and must be corrected or filtered out before completing the loading process. This is the default . Retire by route ID—The appended routes will be loaded into the target LRS Network, and any routes in the target LRS Network that have the same route ID and temporality overlap as the appended routes will be retired. If the appended route eclipses a target route with the same route ID, the target route will be deleted. Replace by route ID—The appended routes will be loaded into the target LRS Network, and any routes in the target LRS Network with the same route ID as the appended routes will be deleted. | String |
| Load Field (Optional) | Specifies the field that will be used for loading routes. Route ID— The routes will be loaded using the route ID field. This is the default . Route Name—The routes will be loaded using the route name field. This option is only available for the networks with route name configured in the LRS Network when the Load Type parameter is set to Add . | String |
| Consider existing centerlines (Optional) | Specifies whether routes will be appended using existing centerlines. Checked—Routes will be appended using existing centerlines, and no new centerlines will be created. Unchecked—New centerlines will be created for the appended routes. This is the default. | Boolean |
| Allow partial loading of routes (Optional) | Specifies whether valid routes will be appended , even if certain routes fail validation. Checked— Valid routes will be appended , even if certain routes fail validation. Unchecked— No routes will be appended if certain routes fail validation. This is the default. | Boolean |

#### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| LRS Network | The updated LRS Network feature layer. | Feature Layer |
| Output Results File | The text file that details changes made by the tool. | Text File |
| Skipped R outes | The feature class that contains source routes that fail validation. | Feature Class |

#### Python
arcpy.locref.AppendRoutes(source_routes, in_lrs_network, route_id_field, route_name_field, {from_date_field}, {to_date_field}, {line_id_field}, {line_name_field}, {line_order_field}, {field_map}, {load_type}, {load_field}, {consider_existing_centerlines}, {allow_partial_loading})

| Name | Explanation | Data Type |
| --- | --- | --- |
| source_routes | The input from which the routes will be derived. The input can be a polyline feature class, shapefile, feature service, or LRS Network feature class. | Feature Layer |
| in_lrs_network | The target LRS Network where the routes will be loaded. | Feature Layer |
| route_id_field | The field in the input polyline feature class that will be mapped to the LRS Network's route ID field. The field type must match the RouteID field type of the target LRS Network and must be either a string or GUID field type. If it is a string field, the field length must be shorter than or equal to the length of the target RouteID field. | Field |
| route_name_field | The field in the input polyline feature class that will be mapped to the LRS Network's route name field. The field must be a string field, and the field length must be shorter than or equal to the length of the target route name field. | Field |
| from_date_field (Optional) | The date field in the input polyline feature class that will be mapped to the LRS Network's start date field. If the field is not mapped, a null value representing the beginning of time will be provided for all appended routes. | Field |
| to_date_field (Optional) | The date field in the input polyline feature class that will be mapped to the LRS Network's end date field. If the field is not mapped, a null value representing the end of time will be provided for all appended routes. | Field |
| line_id_field (Optional) | The field in the input polyline feature class that will be mapped to the LRS Network's line ID field. This parameter is only used if the target LRS Network is an LRS line network. The field type and length must match those of the centerline sequence table's route ID field. | Field |
| line_name_field (Optional) | The string field in the input polyline feature class that will be mapped to the LRS Network's line name field. This parameter is only used if the target LRS Network is an LRS line network. | Field |
| line_order_field (Optional) | The long integer field in the input polyline feature class that will be mapped to the LRS Network's line order field. This parameter is only used if the target LRS Network is an LRS line network. Learn more about line networks and line order in Pipeline Referencing or line networks and line order in Roads and Highways . | Field |
| field_map (Optional) | Controls how attribute information in the source route fields will be transferred to the input LRS Network. Fields cannot be added to or removed from the target LRS Network because the data of the source routes is appended to an existing LRS Network that has a predefined schema (field definitions). While you can set merge rules for each output field, the tool will ignore them. The ArcPy FieldMappings class can be used to define this parameter. | Field Mappings |
| load_type (Optional) | Specifies how appended routes with measure or temporality overlaps with identical route IDs will be loaded into the network feature class. ADD—The appended routes will be loaded into the target LRS Network. If any route ID in the source routes already exists in the target LRS Network with the same temporality, it will be written to the output log as a duplicate route and must be corrected or filtered out before completing the loading process. This is the default. RETIRE_BY_ROUTE_ID—The appended routes will be loaded into the target LRS Network, and any routes in the target LRS Network that have the same route ID and temporality overlap as the appended routes will be retired. If the appended route eclipses a target route with the same route ID, the target route will be deleted. REPLACE_BY_ROUTE_ID—The appended routes will be loaded into the target LRS Network, and any routes in the target LRS Network with the same route ID as the appended routes will be deleted. | String |
| load_field (Optional) | Specifies the field that will be used for loading routes. ROUTE_ID— The routes will be loaded using the route ID field. This is the default. ROUTE_NAME— The routes will be loaded using the route name field. This option is only available for the networks with route name configured in the LRS Network when the load_type parameter is set to ADD . | String |
| consider_existing_centerlines (Optional) | Specifies whether routes will be appended using existing centerlines. CONSIDER—Routes will be appended using existing centerlines, and no new centerlines will be created. DO_NOT_CONSIDER—New centerlines will be created for the appended routes. This is the default. | Boolean |
| allow_partial_loading (TBD) (Optional) | Specifies whether valid routes will be appended, even if certain routes fail validation. ALLOW—Valid routes will be appended, even if certain routes fail validation. DO_NOT_ALLOW—No routes will be appended if certain routes fail validation. This is the default. | Boolean |

#### Derived Output

| Name | Explanation | Data Type |
| --- | --- | --- |
| out_lrs_network | The updated LRS Network feature layer. | Feature Layer |
| out_details_file | The text file that details changes made by the tool. | Text File |
| out_ skipped_routes | The feature class that contains source routes that fail validation. | Feature Class |

#### Code sample
AppendRoutes example 1 (Python window)
The following script demonstrates how to use the AppendRoutes function in the Python window to append routes into an existing LRS Network, replacing those routes where an overlap occurs.
\# Name: AppendRoutes_ex1.py
\# Description: Append routes into an existing LRS Network, replacing routes where an overlap occurs.
\# Requires: ArcGIS Location Referencing

\# Set current workspace
arcpy.env.workspace= r"C:\DOT.gdb"

\# Set tool variables
source_routes = r"C:\Data\Input.gdb\RoutestoAppend"
in_lrs_network = r"C:\Data\DOT.gdb\LRS\StateRoutes"
route_id_field = "RouteId"
route_name_field = None
from_date_field = "FromDate"
to_date_field = "ToDate"
line_id_field = None
line_name_field = None
line_order_field = None
field_map = None
load_type = "REPLACE_BY_ROUTE_ID"
load_field = None
consider_existing_centerlines = "DO_NOT_CONSIDER"
allow_partial_loading = "DO_NOT_ALLOW"

\# Run the tool
arcpy.locref.AppendRoutes(source_routes, in_lrs_network, route_id_field, route_name_field, from_date_field, to_date_field, line_id_field, line_name_field, line_order_field, field_map, load_type, load_field, consider_existing_centerlines, allow_partial_loading)
AppendRoutes example 2 (stand-alone script)
The following stand-alone script demonstrates how to use the AppendRoutes function as a stand-alone Python script and existing centerlines are considered.
\# Name: AppendRoutes_ex2.py
\# Description: Appending new routes into an existing LRS network using Route Name in python stand alone script. Existing centerlines are considered.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Set tool variables:
source_routes = r"C:\Data\Input.gdb\RoutestoAppend"
in_lrs_network = r"C:\Data\pipelinereferencing.gdb\LRS\EngineeringNetwork"
route_id_field = "RouteId"
route_name_field = "RouteName"
from_date_field = "FromDate"
to_date_field = "ToDate"
line_id_field = "LineId"
line_name_field = "LineName"
line_order_field = "LineOrder"
field_map = None
load_type = "ADD"
load_field = "RouteName"
consider_existing_centerlines = "CONSIDER"

\# Process: Append Routes
arcpy.locref.AppendRoutes(source_routes, in_lrs_network, route_id_field, route_name_field, from_date_field, to_date_field, line_id_field, line_name_field, line_order_field, field_map, load_type, load_field, consider_existing_centerlines)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')
AppendRoutes example 3 (stand-alone script)
The following stand-alone script demonstrates how to use the AppendRoutes function as a stand-alone Python script for a user-generated route ID network.
\# Name: AppendRoutes_ex3.py
\# Description: Append records into an existing usergenerated routeId network feature class in a stand-alone script.
\# Source fields: RS and RN, Target fields: RouteSystem and RouteNumber
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Local variables:
source_routes = r"C:\Data\DOT.gdb\LRS\RoutestoAppend"
in_lrs_network = r"C:\Data\DOT.gdb\LRS\StateRoutes"
route_id_field = "RouteId"
route_name_field = None
from_date_field = "FromDate"
to_date_field = "ToDate"
line_id_field = None
line_name_field = None
line_order_field = None
load_type = "ADD"
load_field = None
consider_existing_centerlines = "DO_NOT_CONSIDER"

\# Define field mappings object
fieldMappings = arcpy.FieldMappings()

\# Add input fields
fldmap1 = arcpy.FieldMap()
fldmap1.addInputField(source_routes, "RS")

fldmap2 = arcpy.FieldMap()
fldmap2.addInputField(source_routes, "RN")

\# Set output fields
fld1 = fldmap1.outputField
fld1.name = "RouteSystem"
fld1.aliasName = "RouteSystem"
fldmap1.outputField = fld1

fld2 = fldmap2.outputField
fld2.name = "RouteNumber"
fld2.aliasName = "RouteNumber"
fldmap2.outputField = fld2

\# Add output fields to field mappings object
fieldMappings.addFieldMap(fldmap1)
fieldMappings.addFieldMap(fldmap2)

\# Run Append Routes
arcpy.locref.AppendRoutes(source_routes, in_lrs_network, route_id_field, route_name_field, from_date_field, to_date_field, line_id_field, line_name_field, line_order_field, fieldMappings, load_type, load_field, consider_existing_centerlines)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')
AppendRoutes example 4 (stand-alone script)
The following stand-alone script demonstrates how to use the AppendRoutes function as a stand-alone Python script in a feature service.
\# Name: AppendRoutes_Pro_Ex4.py
\# Description: Append routes using a feature service in a stand-alone script. It is recommended to work in a version and post it into the default version.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module.
import arcpy

\# Check out any necessary licenses.
arcpy.CheckOutExtension("LocationReferencing")

\# Set tool variables.
source_routes = r"C:\LocationReferencing\LR.gdb\LRS\routes"
route_id_field = "ROUTEID"
route_name_field = "ROUTENAME"
from_date_field = "FROMDATE"
to_date_field = "TODATE"
line_id_field = "LINEID"
line_name_field = "LINENAME"
line_order_field = "ORDERID"
field_mapping = r'CREATIONUSER "Creation User" true true false 50 Text 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,CREATIONUSER,0,50;DATECREATED "Date Created" true true false 8 Date 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,DATECREATED,-1,-1;DATEMODIFIED "Date Modified" true true false 8 Date 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,DATEMODIFIED,-1,-1;LASTUSER "Last User" true true false 50 Text 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,LASTUSER,0,50;EVENTSOURCE "Event Source" true true false 50 Text 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,EVENTSOURCE,0,50;LEGACYID "Legacy ID" true true false 38 Text 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,LEGACYID,0,38;ENGFROMM "ENGFROMM" true true false 0 Double 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,ENGFROMM,-1,-1;ENGTOM "ENGTOM" true true false 0 Double 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,ENGTOM,-1,-1;OBJECTSTATUS "Object Status" true true false 20 Text 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,OBJECTSTATUS,0,20;CONTINFROMM "Continuous from Measure" true true false 0 Double 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,CONTINFROMM,-1,-1;CONTINTOM "Continuous to Measure" true true false 0 Double 0 0,First,#,C:\LocationReferencing\LR.gdb\LRS\routes,CONTINTOM,-1,-1'
load_type = "REPLACE_BY_ROUTE_ID"
load_field = None
consider_existing_centerlines = "DO_NOT_CONSIDER"

\## Target Route is in feature service. Signing in portal is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\## Map the target route network from the feature service.Here, 18 corresponds to the target route network.
in_lrs_network = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/18"

\# Run Append Routes
arcpy.locref.AppendRoutes(source_routes, in_lrs_network, route_id_field, route_name_field, from_date_field, to_date_field, line_id_field, line_name_field, line_order_field, field_mapping, load_type, load_field, consider_existing_centerlines)

\# Check in licenses
arcpy.CheckInExtension('LocationReferencing')

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
