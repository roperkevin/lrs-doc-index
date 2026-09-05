# Configure Utility Network Feature Class (Location Referencing)

| Field | Value |
| --- | --- |
| **Doc** | 84 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Configure Utility Network Feature Class.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7079_ConfigureUNFC_GP/Configure%20Utility%20Network%20Feature%20Class.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2026-01-08 21:59 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | utility network · pipeline line · pipeline device · pipeline junction · route id · measure fields · linear referencing system · dynamic segmentation |
| **Tools** | Configure Utility Network Feature Class · Update Measures From LRS · Overlay Events |

## Summary

Configures ArcGIS Utility Network Pipeline Line, Pipeline Device, and Pipeline Junction feature classes for use with a linear referencing system. Supports updating route ID and measure fields and integration with dynamic segmentation tools. Applicable to data from file or branch versioned enterprise geodatabases but not supported in feature services.

## Related documents

<!-- related:begin -->
- [Manage Pipeline Referencing and a Utility Network Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-apr-and-a-un-together.md>) — similar text 0.20 · 2 title words · 2 filename words · same kind/surface <!-- rel:74 s=4.991 -->
- [ConfigureUtilityNetworkFeatureClass Python Example](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/configureutilitynetworkfeatureclass-python-example.md>) — similar text 0.48 · same kind/surface/folder <!-- rel:85 s=4.834 -->
- [View Utility Network Feature Class Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/7300-view-un-feature-class-properties.md>) — similar text 0.28 · 4 title words · same kind/surface <!-- rel:67 s=4.722 -->
- [ConfigureUtilityNetworkFeatureClass example 2 (stand-alone script)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/configureutilitynetworkfeatureclass-example-2-stand-alone.md>) — similar text 0.57 · same kind/surface/folder <!-- rel:88 s=4.65 -->
- [Configure Address Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6267-configure-address-feature-classes-lr.md>) — similar text 0.38 · 2 title words · 2 filename words · same kind/surface <!-- rel:249 s=4.442 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)

_No page matched:_ [Configure Utility Network Feature Class](https://www.google.com/search?q=%22Configure%20Utility%20Network%20Feature%20Class%22+site%3Adoc.esri.com) · [Update Measures From LRS](https://www.google.com/search?q=%22Update%20Measures%20From%20LRS%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Configure Utility Network Feature Class (Location Referencing)

### Summary
Configures the a ArcGIS Utility Network Ppipeline Line, Pipeline Device, and Pipeline Junction feature classes for use with a linear referencing system (LRS).
After configuration, the Route ID Field parameter and the measure columns can be updated as needed.

### Usage

- The Utility Network FeaturePipeline Line Layer feature class must be configured as the pipeline feature class in the Utility Network and serves as the centerline feature class in the LRS.
Learn more about the LRS data model in ArcGIS Pipeline Referencing

- The Route ID Field parameter type and length must match that of the centerline sequence table in the LRS.
- After running this tool, the following are supported:
- You can update the route ID and measure fields on the utility network feature classes as needed using the https://docdev.esri.com/en/arcgis-pro/latest/tool-reference/location-referencing/update-measures-from-lrs.html?tabs=dialog Update Measures From LRS tool.
- You can include the utility network feature classes in the https://docdev.esri.com/en/arcgis-pro/latest/tool-reference/location-referencing/overlay-events.html?tabs=dialog Overlay Events tool for dynamic segmentation.
- This tool supports data from a file geodatabase or an enterprise geodatabase requires a (branch versioned enterprise geodatabase connection).
Learn more about versioning in ArcGIS Pro

- This tool does not support data from a is not supported in feature services.

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Utility Network Feature Line Layer | The input Utility Network Pipeline Line feature class that is also will serve as the LRS centerline feature class . | Feature Layer |
| Line Route ID Field | The field in the Pipeline Line feature class that will be mapped as the route ID field in the LRS Network Route ID .<br>The data type and length of the field must match those of the corresponding field in the LRS centerline sequence table . | Field |
| Line From Measure Field | The From start measure field of the centerline Pipeline Line feature class. | Field |
| Line To Measure Field | The To end measure field of the centerline Pipeline Line feature class. | Field |
| Utility Network Devices Layer | The input Utility Network Pipeline Device feature class. | Feature Layer |
| Devices Route ID Field | The field in the Pipeline Device feature class that contains the route ID attribute.<br>The data type and length of the field must match those of the corresponding field in the LRS centerline sequence table . | Fie ld |
| Devices Measure Field | The field in the Pipeline Device feature class that contains the measure value for device s. | Field |
| Utility Network Junctions Layer | The input Util ity Network Pipeline Junction feature class. | Feature Layer |
| Junct i ons Route ID Field | The field in the Pipeline Junction feature class that contains the route ID attribute.<br>The data type and length of the field must match those of the corresponding field in the LRS centerline sequence table . | Field |
| Junctions Measure Field | The field in the Pipeline Junction feature class that contains the measure value for junctions . | Field |

#### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| Output Feature Class | The updated Utility Network Pipeline Line feature class layer . | Feature Layer |
| Output Devices Feature Class | The updated Utility Network Pipeline Device feature class. | Feature Layer |
| Output Junctions Feature Class | arcdocfx The updated Utility Network Pipeline Junction feature class. u pdatesssssssss | Feature Layer |

#### Python
arcpy.locref.ConfigureUtilityNetworkFeatureClass(in_feature_class, route_id_field, from_measure_field, to_measure_field, in_device_features, device_route_id_field, device_measure_field, in_junction_features, junction_route_id_field, junction_measure_field)

| Name | Explanation |  | Data Type |
| --- | --- | --- | --- |
| in_feature_class | The input Utility Network feature that is also the LRS centerline feature. |  | Feature Layer |
| route_id_field | The field in the feature class that will be mapped as the LRS Network Route ID. |  | Field |
| from_measure_field | The From measure field of the centerline feature class. |  | Field |
| to_measure_field | The To measure field of the centerline feature class. |  | Field |
| in_device_features | Follow changes above |  |  |
| device_route_id_field | Follow changes above |  |  |
| device_measure_field | Follow changes above |  |  |
| in_junction_features | Follow changes above |  |  |
| junction_route_id_field | Follow changes above |  |  |
| junction_measure_field | Follow changes above |  |  |

#### Derived Output

| Name | Explanation | Data Type |
| --- | --- | --- |
| out_feature_class | The updated Utility Network feature layer. Follow changes above | Feature Layer |
| out_device_features | F ollow changes above |  |
| o ut_junction_featu res | Follow changes above |  |

#### Code sample
ConfigureUtilityNetworkFeatureClass example 1 (Python window)
Demonstrates how to use the ConfigureUtilityNetworkFeatureClass geoprocessing tool in a Python window.
\# Name: ConfigureUtilityNetworkFeatureClass_ex1.py
\# Description: Configure a Utility Network pipeline feature class for use with a linear referencing system (LRS) in the Python window.
\# Requires: ArcGIS Location Referencing

\# Set current workspace
arcpy.env.workspace = "C:/Data/UN_LRconnection.sde"

\# Tool variables
utility_Network_Feature = r"C:/Data/UN_LRconnection.sde/LRS/UNOWNER.UNData/UNOWNER.pipeline"
RouteID = "RouteID"
FromMeasure = "FromMeasure"
ToMeasure = "ToMeasure"

\# Execute the tool
arcpy.locref.ConfigureUtilityNetworkFeatureClass(utility_Network_Feature, RouteID, FromMeasure, ToMeasure)
ConfigureUtilityNetworkFeatureClass example 2 (stand-alone script)
Demonstrates how to use the ConfigureUtilityNetworkFeatureClass tool as a stand-alone Python script.
\# Name: ConfigureUtilityNetworkFeatureClass_ex2.py
\# Description: Configure a Utility Network pipeline feature class for use with a linear referencing system (LRS) in a stand-alone script.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out the license
arcpy.CheckOutExtension("LocationReferencing")

\# Set current workspace
arcpy.env.workspace = "C:/Data/UN_LRconnection.sde"

#Tool variables
utility_Network_Feature = r"C:/Data/UN_LRconnection.sde/LRS/UNOWNER.UNData/UNOWNER.pipeline"
RouteID = "RouteID"
FromMeasure = "FromMeasure"
ToMeasure = "ToMeasure"

\# Execute the tool
arcpy.locref.ConfigureUtilityNetworkFeatureClass(utility_Network_Feature, RouteID, FromMeasure, ToMeasure)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')

### Environments
This tool does not use any geoprocessing environments.

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
