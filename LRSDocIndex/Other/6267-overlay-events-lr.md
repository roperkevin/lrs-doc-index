# Overlay Events (Location Referencing)

| Field | Value |
| --- | --- |
| **Doc** | 251 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6267](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6267) |
| **Source** | [6267-GP_OverlayEventsUpdate.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6267_OverlayEvents/6267-GP_OverlayEventsUpdate.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-01-21 22:13 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · line event · point event · address range · utility network · linear referencing method · temporal segmentation |
| **Tools** | Overlay Events |

## Summary

Describes the Overlay Events tool that overlays one or more line and point event layers onto a target network and outputs a feature class or table representing the dynamic segmentation of the inputs. It supports various configurations including address range updates, multiple linear referencing methods, temporal segmentation, and utility network integration. The document includes usage details, parameters, Python code examples, and licensing requirements.

## Related documents

<!-- related:begin -->
- [Configure Address Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6267-configure-address-feature-classes-lr.md>) — shared issue ArcGISPro/ps-location-referencing#6267 · similar text 0.32 · same kind/surface/folder <!-- rel:249 s=1002.787 -->
- [Manage Address and Roadway Characteristic Data Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6267-manage-address-and-roadway-characteristic-data-together.md>) — shared issue ArcGISPro/ps-location-referencing#6267 · similar text 0.22 · same kind/surface/folder <!-- rel:250 s=1002.732 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-lr.md>) — similar text 0.90 · 2 title words · 2 filename words · same kind/surface <!-- rel:75 s=7.954 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6379-overlay-events-lr.md>) — similar text 0.83 · 2 title words · 2 filename words · same kind/surface <!-- rel:131 s=6.885 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5647-overlay-events-lr.md>) — similar text 0.60 · 2 title words · 2 filename words · same kind/surface <!-- rel:422 s=6.474 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)

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

- All Event Layers values can either be line events only or can include both point and line events.
- The Event Layers parameter can only include event feature classes registered with an ArcGIS Location Referencing network.
- Note:
- The centerline layer can be input to the Event Layers parameter to dynamically segment events when the centerline layer is part of an Address Data Management solution or a Utility Network configuration. The centerline direction is honored in the outputs when the centerline layer is part of an Address Data Management solution configuration.
- If the input layer has address range fields from an Address Data Management configuration and is configured as an address feature class in an LRS, the values in the address range fields will be updated for each segment in the output proportionally when the Proportional option is chosen. When the Nearest Address Point option is chosen, address ranges will update for each segment in the output based on the nearest upstream and downstream address points.
- For more information seeLearn more about [insert link to overlay events example in Pro ADM-RH doc]
- If the input events use different linear referencing methods (LRM), they will be translated using the LRM of the target network.
- This tool supports selection sets on the Input Route Features and Event Layers parameter values.
- This tool supports definition filters on the Input Route Features and Event Layers parameter values.
- This tool supports input Event Layers values that are configured to contain events that span multiple routes. The output will still dynamically segment at the route level of the target network using the Network Fields parameter value.
- This tool supports temporal segmentation (time slicing). This will occur by default and can be overridden by creating a time-based definition query or applying a selection set to the inputs.
- This tool supports the inclusion of one or more fields from the network feature class in the output using the Network Fields parameter.
- The output can be saved as either a table or a feature class.
- If the output is saved as a table or feature class, the output will have the following indexes and fields:

| Index | Field |
| --- | --- |
| Route_ID | Route_ID |
| Rid_Dates_Me | Route_ID<br>From_Date<br>To_Date<br>From_Measure<br>To_Measure |

- This tool supports the Gas Utility Network configuration pipeline feature layer as an input event layer if this feature class has beenis configured for use with an LRS using the Configure Utility Network Feature Class tool.
- If more than one LRS Network exists in the Gas Utility Network configuration, the measures for the input event layers will match the measures shown in the second column of the following table:

| If the LRS with the Utility Network Configuration contains | The measures in the PipelineLine feature class belong to |
| --- | --- |
| Line network, nonline network | Line network |
| Line network | Line network |
| More than one line network | Line network that has the derived network |
| More than one line network with no derived network | Line network that has the lowest number in the coded-value domain, dLRSNetworks |
| More than one line network with derived networks | Line network that has the lowest number in the coded-value domain, dLRSNetworks |
| One nonline network | Nonline network |
| More than one nonline network | Network that has the lowest number in the coded-value domain, dLRSNetworks |

- This tool supports physically gapped routes and events as input routes and input events, respectively.
- Only one event per layer can be on a route segment. For example, for the layer named Speed Limit, only one event record in that layer can be on that segment. A segment can have multiple events, each in its own event layer. Use the ArcGIS Data Reviewer Invalid Event Measures check to identify and resolve issues with event data.

### Parameters

### Dialog:

| Label | Explanation | Data Type |
| --- | --- | --- |
| Address Block Split Type<br>(Optional) | Specifies how address ranges will be updated for each segment of the output . only when a configured address range layer is included in the input event layers .<br>Nearest Address Point –Address ranges will be updated for each segment in the output based on the nearest upstream and downstream address values .<br>Proportional – Address ranges will be updated for each segment in the output proportionally from the split location . This is the default.<br>This parameter is only available when a configured A ddress R ange layer is used as an input event lay er. | String |

Python:
arcpy.locref.OverlayEvents(in_route_features, event_layers, output_dataset, address_block_split_type, {include_geometry}, {network_fields}, {address_block_split_type})

| Name | Explanation | Data Type |
| --- | --- | --- |
| address_block_split_type<br>(Optional) | Specifies how address ranges will be updated for each segment of the output only when a configured address range layer is included in the input event layers.<br>NEAREST_ADDRESS_POINT - Address ranges will be updated for each segment in the output based on the nearest upstream and downstream address values.<br>PROPORTIONAL - Address ranges will be updated for each segment in the output proportionally from the split location. | String |

Code samples:
OverlayEvents example 1 (Python window)
The following Python window script demonstrates how to use the OverlayEvents function in the Python window.
\# Name: OverlayEvents_ex1.py
\# Description: Overlays linear event feature layers against a target network and output a feature class or table that represents the dynamic segmentation of those inputs.
\# Requirements: ArcGIS Location Referencing

\# tool variables
in_route_features = r"C:\Data\NY_Data.gdb\LRS\LRSN_MilePoint"
event_layers = [r"C:\Data\NY_Data.gdb\LRS\LRSE_Access_Control", r"C:\Data\NY_Data.gdb\LRS\LRSE_Functional_Class"]
output_dataset = r"C:\Data\NY_Data.gdb\Output"
Geometry = "EXCLUDE_GEOMETRY"
network_fields = ""
address_block_split_type =  ""

\# Set current workspace
arcpy.env.workspace = r"C:\Data\NY_Data.gdb"

\# Execute the tool
arcpy.locref.OverlayEvents(in_route_features, event_layers, output_dataset, Geometry, network_fields, address_block_split_type)
OverlayEvents example 2 (stand-alone script)
The following Python script demonstrates how to use the OverlayEvents function in a stand-alone Python script.
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
Address_Block_Split_Type =  ""

\# Process: Overlay Events
arcpy.locref.OverlayEvents(Network, Events, Output_Dataset, Geometry, Network_Fields, Address_Block_Split_Type)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')

\# Name: OverlayEvents_Pro_Ex3.py
\# Description: Overlay events using a feature service. It is recommended to work in a version and post to the default version.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

#Input LRS network and events are in feature service. Portal signi is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\# Map the input LRS network and events from the feature service. Here, 1 corresponds to the input LRS network, while  and 2 and 3 corresponds to the input events.
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
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
