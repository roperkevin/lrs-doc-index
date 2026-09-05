# Overlay Events (Location Referencing)

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#6379](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6379) |
| **Source** | [6379_6676_OverlayEventsGP.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6379_6676_OverlayEventsGP.docx>) |
| **Edited** | 2025-08-26 18:01 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Overlay Events (Location Referencing)"
source_file: "6379_6676_OverlayEventsGP.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6379_6676_OverlayEventsGP.docx"
doc_id: 131
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Praveen Kumar"
last_edited: "2025-08-26T18:01:13Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dynamic segmentation", "line event", "point event", "address data management", "utility network", "event layers", "route", "feature class", "address range"]
tools: ["Overlay Events"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#6379"]
related: [{"doc":160,"file":"overlay-event-performance-improvements-using-async-tool-and-parallel-processing__doc160.md","s":1002.604},{"doc":75,"file":"overlay-events-location-referencing__doc75.md","s":8.451},{"doc":66,"file":"overlay-events-location-referencing__doc66.md","s":7.278},{"doc":251,"file":"overlay-events-location-referencing__doc251.md","s":6.885},{"doc":422,"file":"overlay-events-location-referencing__doc422.md","s":5.634}]
```
-->

## Summary

Describes the Overlay Events tool that overlays one or more line and point event layers onto a target network, producing a dynamically segmented output feature class or table. Covers usage details, parameters, Python examples, environment settings, and licensing requirements. Supports configurations with Address Data Management and Utility Network, temporal segmentation, parallel processing, and feature service inputs.

## Related documents

<!-- related:begin -->
- [Overlay Event Performance Improvements using Async tool and parallel processing – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/overlay-event-performance-improvements-using-async-tool-and-parallel-processing__doc160.md>) — shared issue ArcGISPro/ps-location-referencing#6379 · similar text 0.08 · 1 title word · 2 filename words · same surface <!-- rel:160 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc75.md>) — similar text 0.90 · 2 title words · 2 filename words · same kind/surface <!-- rel:75 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc66.md>) — similar text 0.97 · 2 title words · 2 filename words · same kind/surface <!-- rel:66 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc251.md>) — similar text 0.83 · 2 title words · 2 filename words · same kind/surface <!-- rel:251 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc422.md>) — similar text 0.51 · 2 title words · 2 filename words · same kind/surface <!-- rel:422 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overlay Events (Location Referencing)

### Summary
Overlays one or more line and point event layers onto a target network and outputs a feature class or table that represents the dynamic segmentation of the inputs.

### Illustration

### Usage

- The following table is the output for the tool illustration above:

##### Output (Overlay Events)

| Type | From Measure | To Measure | Line Event 1 | Line Event 2 | Point Event |
| --- | --- | --- | --- | --- | --- |
| Line | 0 | 2 | A | 1 | <Null> |
| Point | 2 | 2 | A | 1 | PE1 |
| Line | 2 | 3 | A | 1 | <Null> |
| Line | 3 | 4 | B | 1 | <Null> |
| Line | 4 | 5 | B | 2 | <Null> |

- The Event Layers parameter values can be either line events only or can include both point and line events.
- The Event Layers parameter can only include event feature classes registered with an LRS Network.
- Note:
- The centerline feature class can be input to the Event Layers parameter to dynamically segment events when it is part of an Address Data Management configuration or an ArcGIS Utility Network configuration. When the centerline feature class is part of an Address Data Management configuration, the centerline direction is honored in the output.
- In an Address Data Management configuration, use the Configure Address Feature Classes tool to configure the centerline feature class for use with an LRS.
- In a Utility Network configuration, use the Configure Utility Network Feature Class tool to configure the centerline feature class for use with an LRS.
- If the input layer has address range fields from an Address Data Management configuration and is configured as an Address Range feature class in an LRS, the values in the address range fields will be updated for each segment in the output proportionally when the Address Block Split Type parameter value is Proportional. When the parameter value is Nearest Address Point, address ranges will be updated for each segment in the output based on the nearest upstream and downstream address points.
- Learn more about analysis capabilities in a combined LRS and Address Data Management dataset
- If the input event layers use different linear referencing methods (LRM), they will be translated using the LRM of the target network.
- This tool supports selection sets and definition queries on the Input Route Features and Event Layers parameter values.
- Note:
- To include all event records associated with the input routes, turn off the Use the selected records or the Use the filtered records toggle button for each input event layer.
- This tool supports input event layers that are configured to contain events that span multiple routes. The output will still dynamically segment at the route level of the target network using the Network Fields parameter value.
- This tool supports temporal segmentation (time slicing). This will occur by default and can be overridden by creating a time-based definition query or applying a selection set to the inputs.
- This tool supports the inclusion of one or more fields from the network feature class in the output using the Network Fields parameter.
- The output can be saved as either a table or a feature class.
- If the output is saved as a table or feature class, the output will have the following indexes and fields:

| Index | Field |
| --- | --- |
| route_id | Route_ID |
| rid_dates_measures | Route_ID From_Date To_Date From_Measure To_Measure |

- If more than one LRS Network exists in a Utility Network configuration, the measures for the input event layers will match the measures shown in the second column of the following table:

| If the LRS with the Utility Network configuration contains | The measures in the Pipeline Line feature class belong to |
| --- | --- |
| Line network, non-line network | Line network |
| Line network | Line network |
| More than one line network | Line network that has the derived network |
| More than one line network with no derived network | Line network that has the lowest number in the coded-value domain, dLRSNetworks |
| More than one line network with derived networks | Line network that has the lowest number in the coded-value domain, dLRSNetworks |
| One non-line network | Non-line network |
| More than one non-line network | Network that has the lowest number in the coded-value domain, dLRSNetworks |

- This tool supports physically gapped routes and events as input routes and input events, respectively.
- Only one event per layer can be on a route segment. For example, for a layer named Speed Limit, only one event record in that layer can be on that segment. A segment can have multiple events, each in its own event layer. Use the ArcGIS Data Reviewer Invalid Event Measures check to identify and resolve issues with event data.
- This tool supports parallel processing. If you are running the tool against a large number of routes, it is recommended that you use parallel processing. You can control the number of cores the tool uses with the https://pro.arcgis.com/en/pro-app/latest/tool-reference/environment-settings/parallel-processing-factor.htm Parallel Processing Factor environment.
- If you experience poor performance or tool failures when running this tool with data from a feature service, https://prodev.arcgis.com/en/pro-app/latest/help/analysis/geoprocessing/share-analysis/advanced-settings.htm#GUID-17815A98-2756-486F-AC2D-22672E0FCA28 increase the heap size at the service level.

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Input Route Features | The target network onto which the event layers will be dynamically segmented. | Feature Layer |
| Event Layers | The event layers that will be dynamically segmented together onto a target network. The centerline layer can be used as an input to dynamically segment events. | Feature Layer |
| Output Dataset | The table or feature class containing the output event records that will be created. | Table |
| Include Geometry (Optional) | Specifies whether the Output Dataset parameter value will include event geometry. Unchecked—The Output Dataset parameter value will not include event geometry. Event records will be stored as a table. This is the default. Checked—The Output Dataset parameter value will include event geometry. Event records will be stored as a feature class. | Boolean |
| Network Fields (Optional) | The fields from the network layer that will be included in the output. | Field |
| Address Block Split Type (Optional) | Specifies how address ranges will be updated for each segment of the output. This parameter is only available when a configured Address Range layer is used as an input event layer. Nearest Address Point—Address ranges will be updated for each segment in the output based on the nearest upstream and downstream address values. Proportional—Address ranges will be updated for each segment in the output proportionally from the split location. This is the default. | String |

#### Python
arcpy.locref.OverlayEvents(in_route_features, event_layers, output_dataset, {include_geometry}, {network_fields}, {address_block_split_type})

| Name | Explanation | Data Type |
| --- | --- | --- |
| in_route_features | The target network onto which the event layers will be dynamically segmented. | Feature Layer |
| event_layers [event_layers,...] | The event layers that will be dynamically segmented together onto a target network. The centerline layer can be used as an input to dynamically segment events. | Feature Layer |
| output_dataset | The table or feature class containing the output event records that will be created. | Table |
| include_geometry (Optional) | Specifies whether the output_dataset parameter value will include event geometry. EXCLUDE_GEOMETRY—The output_dataset parameter value will not include event geometry. Event records will be stored as a table. This is the default. INCLUDE_GEOMETRY—The output_dataset parameter value will include event geometry. Event records will be stored as a feature class. | Boolean |
| network_fields [network_fields,...] (Optional) | The fields from the network layer that will be included in the output. | Field |
| address_block_split_type (Optional) | Specifies how address ranges will be updated for each segment of the output. NEAREST_ADDRESS_POINT—Address ranges will be updated for each segment in the output based on the nearest upstream and downstream address values. PROPORTIONAL—Address ranges will be updated for each segment in the output proportionally from the split location. This is the default. This parameter is only available when a configured Address Range layer is used as an input event layer. | String |

#### Code sample
OverlayEvents example 1 (Python window)
The following Python window script demonstrates how to use the OverlayEvents function in the Python window.
\# Name: OverlayEvents_ex1.py
\# Description: Overlays linear event feature layers against a target network and output a feature class or table that represents the dynamic segmentation of those inputs.
\# Requirements: ArcGIS Location Referencing

\# tool variables
in_route_features = r"C:\Data\NY_Data.gdb\LRS\LRSN_MilePoint"
event_layers = [r"C:\Data\NY_Data.gdb\LRS\LRSE_Access_Control", r"C:\Data\NY_Data.gdb\LRS\LRSE_Functional_Class"]
output_dataset = r"C:\Data\NY_Data.gdb\Output"
Geometry = "EXCLUDE_GEOMETRY"
network_fields = ""
address_block_split_type = ""

\# Set current workspace
arcpy.env.workspace = r"C:\Data\NY_Data.gdb"

\# Execute the tool
arcpy.locref.OverlayEvents(in_route_features, event_layers, output_dataset, Geometry, network_fields, address_block_split_type)
OverlayEvents example 2 (stand-alone script)
The following Python script demonstrates how to use the OverlayEvents function in a stand-alone Python script.
\# Name: OverlayEvents_ex2.py
\# Description: Overlay linear event feature layers against a target network then output a feature class or table that represents the dynamic segmentation of those inputs.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\# Local variables:
Network = r"C:\Data\NY_Data.gdb\LRS\LRSN_MilePoint"
Events = [r"C:\Data\NY_Data.gdb\LRS\LRSE_Access_Control", r"C:\Data\NY_Data.gdb\LRSE_Functional_Class"]
Output_Dataset = r"C:\Data\NY_Data.gdb\Output"
Geometry = "EXCLUDE_GEOMETRY"
Network_Fields = ""
Address_Block_Split_Type = ""

\# Process: Overlay Events
arcpy.locref.OverlayEvents(Network, Events, Output_Dataset, Geometry, Network_Fields, Address_Block_Split_Type)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')
OverlayEvents example 3 (stand-alone script)
The following stand-alone script demonstrates how to use the OverlayEvents function with data from a feature service.
\# Name: OverlayEvents_Pro_Ex3.py
\# Description: Overlay events using a feature service. It is recommended to work in a version and post to the default version.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

#Input LRS network and events are in feature service. Portal sign in is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\# Map the input LRS network and events from the feature service. Here, 1 corresponds to the input LRS network, while 2 and 3 corresponds to the input events.
in_network  = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/1"
event1 = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/2"
event2 = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/3"
in_events = [event1, event2]

\# Set tool variables
Output_Dataset = r"C:\Data\LocationReferencing.gdb\output"
Geometry = "EXCLUDE_GEOMETRY"
Network_Fields = ""
Address_Block_Split_Type = ""

\# Process: Overlay Events.
arcpy.locref.OverlayEvents(in_network, in_events, Output_Dataset, Geometry, Network_Fields, Address_Block_Split_Type)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')

### Environments
Current Workspace, https://pro.arcgis.com/en/pro-app/latest/tool-reference/environment-settings/parallel-processing-factor.htm Parallel Processing Factor

Special cases
https://pro.arcgis.com/en/pro-app/latest/tool-reference/environment-settings/parallel-processing-factor.htm Parallel Processing Factor
The default value for this environment, if left blank, is 0%. Any absolute value for the environment is always clamped between 0 and the number of logical cores in that machine.

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)

![image1.png](../media/doc866_image1.png)
