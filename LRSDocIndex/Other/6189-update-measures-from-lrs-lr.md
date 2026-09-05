# Update Measures From LRS (Location Referencing)

| Field | Value |
| --- | --- |
| **Doc** | 204 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6189](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6189) |
| **Source** | [6189_6358_6462_UpdateMeasuresFromLRS.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6189_6358_6462_UpdateMeasuresFromLRS.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-03-05 20:41 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | measures · route id · route name · utility network · lrs network · feature update · search tolerance |
| **Tools** | Update Measures From LRS |

## Summary

Describes a tool that populates or updates measures, route IDs, and route names on Utility Network features or LRS events and intersections by finding appropriate routes from the LRS Network. It supports data from file geodatabases, enterprise geodatabases, or feature services and provides output including updated features and a CSV report of changes and validation results.

## Related documents

<!-- related:begin -->
- [Generate Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-events-lr.md>) — similar text 0.45 · same kind/surface <!-- rel:69 s=3.436 -->
- [Configure Utility Network Feature Class (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-un-feature-class-lr.md>) — similar text 0.30 · same kind/surface <!-- rel:84 s=2.923 -->
- [Generate Intersections (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6758-generate-intersections-lr.md>) — similar text 0.44 · same kind/surface <!-- rel:130 s=2.822 -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs.md>) — similar text 0.13 · 1 title word · 1 filename word · same surface <!-- rel:266 s=2.76 -->
- [Generate LRS Data Product (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6272-generate-lrs-data-product-lr.md>) — similar text 0.33 · same kind/surface/folder <!-- rel:226 s=2.759 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Update Measures From LRS](https://www.google.com/search?q=%22Update%20Measures%20From%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Update Measures From LRS (Location Referencing)

### Summary
Populates or updates the measures, and route ID, and route name on Utility Network (UN) features, such as pipes, devices, and junctions, or on features in LRS events and intersections.
This tool finds appropriate routes from the LRS Network, gets the measures from those routes, and populates or updates the measure,  and route ID, and route name (if configured) attributes of the input features.

### Usage

- This tool supports data from a file geodatabase, an enterprise geodatabase (branch versioned connection), or a feature service (published from branch versioned data).
- The field properties of the Input Features and LRS Network parameter values must match.
- The spatial reference; x,y resolution; and x,y tolerance of the Input Features and LRS Network parameter values must match.
- The Route Name Field parameter is an optional parameter that is only available when the LRS Network is configured with a route name.
- The To Route ID Field or To Route Name parameters support the creation of spanning event features.
- This tool provides a  .csv  file that states that the tool was executed. The csv file contains the following:
  - Information on any input features that failed validation
  - The measure, and route ID, and route name (if configured) attributes of each updated feature before and after the update
- tThe geometry of the input features must be coincident with the routes in the LRS Network.  If  the geometry of the input feature is not coincident with the route network , then the input feature can be updated with the measures from nearest route by providing a value in the search tolerance parameter.  The search tolerance unit is based on the xy unit of measure of the LRS Network.
- The following diagrams and tables show how point and line input features that are coincident with Route1 in the LRS Network will be updated:

| Input Layer | Feature Type | Route ID | From Measure | To Measure | Comments |
| --- | --- | --- | --- | --- | --- |
| Input layer | Line | Route1 | 11 | 18 | The line feature's geometry has a geometric match with Route1. |

| Input Layer | Feature Type | Route ID | Measure | Comments |
| --- | --- | --- | --- | --- |
| Input layer | Point | Route1 | 21 | The point feature is coincident with Route1. |

| Input Layer | Feature Type | Route ID | From Measure | To Measure | Comments |
| --- | --- | --- | --- | --- | --- |
| Input layer | Line |  |  |  | The line feature's geometry is not coincident with Route1. No information is returned. |

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| LRS Network | The feature layer that contains the routes, route IDs, route names ( if configured), and measures. | Feature Layer |
| LRS Date | The date that will be used to define the temporal view of the network. | Date |
| Input Features | The point or line features that will be updated based on feature geometry relative to the routes in the LRS Network. | Feature Layer |
| Route ID Field | The field in the Input Features parameter value that contains the route ID attribute. The field ’s data type and length should must match the datatype and length those of the fie ld in the LRS route N n etwork | Field |
| To Route ID Field (Optional) | The field in the Input Features parameter value that contains the to route ID attribute.<br>This parameter is only available when the Input Features parameter value is a line feature layer. The field datatype and length should match the datatype and length of the field in the LRS route network | Field |
| Measure Field | The field in the Input Features parameter value that contains the measure value for point features or the start measure value for line features. The field datatype and length should be match the datatype and length of the field in the LRS route network | Field |
| To Measure Field<br>(Optional) | The field in the Input Features parameter value that contains the end measure value for line features. The field datatype and length should match the datatype and length of the field in the LRS route network | Field |
| To Route ID Field (Optional) | The field in the Input Features parameter value that contains the to route ID attribute.<br>This parameter is only available when the Input Features parameter value is a line feature layer. The field datatype and length should match the datatype and length of the field in the LRS route network | Field |
| Route Name Field (Optional) | The field in the Input Features parameter value that contains the route name attribute.<br>This parameter is only available when the LRS Network is configured with a route name. | Field |
| To R oute Name (Optional) | The field in the Input Features parameter value that contains the to route name attribute.<br>This parameter is only available when the LRS Network is configured with a route name and the Input Features parameter value is a line feature layer . | Field |
| Search Tolerance (Optional) | If the I nput Features parameter value is a point feature layer, the search tolerance value defines how far around each point a search will be done to find a target route.<br>I f the Input Features parameter value is a line feature layer, the search tolerance value determines the target route to which an input line feature will be associated. The start and end of an input line feature must be within the search tolerance and the length of the target route.<br>The search tolerance unit is based on the unit of measure (m-unit) of the LRS Network.<br>This parameter is used to update for updating the measures, route ID, and route name (if configured) route and measure value attributes of for the input feature , if the input feature it is not coincident with the route<br>The routes which that are within the provided search tolerance of the input feature will be identified . and T t he nearest route and measure value will be used for updating to update the input feature.<br>If the input feature is a line feature layer , then both the start point , and the end point of the feature should must be within the search tolerance of the same route for measure update .<br>If there is more than one route and measure found within the provided search tolerance of the input feature, then whichever is closest i s used for updating the routeid and measure . In case If two or more routes are at equidistant from the input feature , then any one of th ose e routes will be used to for updat e i ng the measure. input feature.<br>The search tolerance unit is based on the xy unit of measure of the LRS Network. | Double |

#### Derived Output

| Label | Explanation | Data Type |
| --- | --- | --- |
| Output Details File | The output csv file that lists the updated input features. This csv file includes the measure , and route ID , and route name attributes of each updated feature before and after the update. | Text csv File |
| Out Features | The updated feature layer.<br>Note:<br>Validation results for this tool are written to the ArcGIS Server directory. This file is automatically cleaned up in 10 minutes by default, which may not be enough time to process all of the validations and write them to your workstation that is running ArcGIS Pro . For larger data loads, it is recommended that you adjust the maximum file age to at least one hour. | Feature Layer |

#### Python
arcpy.locref.UpdateMeasuresFromLRS(lrs_network, lrs_date, in_features, route_id_field, from_measure_field, {to_measure_field}), {route_name_field}, {search_tolerance})

| Name | Explanation | Data Type |
| --- | --- | --- |
| lrs_network | The feature layer that contains the routes, route IDs, and measures. | Feature Layer |
| lrs_date | The date that will be used to define the temporal view of the network. | Date |
| in_features | The point or line features that will be updated based on feature geometry relative to the routes in the LRS Network. | Feature Layer |
| route_id_field | The field in the in_features parameter value that contains the route ID attribute. | Field |
| route_name_field (Optional) | The field in the in_ features parameter value that contains the route name attribute.<br>This parameter is only available when the LRS Network is configured with a route name. | Field |
| from_measure_field | The field in the in_features parameter value that contains the measure value for point features or the start measure value for line features. | Field |
| to_measure_field<br>(Optional) | The field in the in_features parameter value that value contains the end measure value for line features. | Field |
| search_tolerance | Th is is used for calculating the nearest route and measure to the input feature. The search tolerance unit is based on the xy unit of measure of the LRS Network. | Linear unit Double |

#### Derived Output

| Name | Explanation | Data Type |
| --- | --- | --- |
| out_details_file | The output text .csv file that lists the updated input features. This text csv file includes the measure , and route ID , and route name (if configured) attributes of each updated feature before and after the update. | Text csv File |
| out_features | The updated feature layer.<br>Note:<br>Validation results for this tool are written to the ArcGIS Server directory. This file is automatically cleaned up in 10 minutes by default, which may not be enough time to process all of the validations and write them to your workstation that is running ArcGIS Pro . For larger data loads, it is recommended that you adjust the maximum file age to at least one hour. | Feature Layer |

#### Code sample
UpdateMeasuresFromLRS example1 (Python window)
This code sample demonstrates how to use the UpdateMeasuresFromLRS function in the Python window.
\# Name: UpdateMeasuresFromLRS_Sample1.py
\# Description: This will populate the Route ID and measures in the input layer based on overlapping routes from the network layer.
\# The output is the input layer with the updated Route ID and measure values, and a .csv file with information on the updated features and errors.
\# Requires: ArcGIS Location Referencing

\## Variables are supported from feature service only. Signing into Portal is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\# Map the lrs network from the feature service. Here, 8 corresponds to the lrs route network.
lrs_network_url =  r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/8"
lrs_network = arcpy.management.MakeFeatureLayer(lrs_network_url, "networkLayer")

\# Map the input feature layer from the same feature service. Here, 18 corresponds to the input feature layer.
in_features_url = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/18"
in_features = arcpy.management.MakeFeatureLayer(in_features_url, "inputFeaturesLayer")
lrs_date="10/8/2019"
route_id_field = "ROUTEID"
from_measure_field = "FROMMEASURE"
to_measure_field = "TOMEASURE"
route_name_field = None
search_tolerance=None
\# Execute the tool
arcpy.locref.UpdateMeasuresFromLRS(lrs_network, lrs_date, in_features, route_id_field, from_measure_field, to_measure_field, route_name_field, search_tolerance)
UpdateMeasuresFromLRS example2 (stand-alone script)
This code sample demonstrates how to use the UpdateMeasuresFromLRS function in a stand-alone Python script.
\# Name: UpdateMeasuresFromLRS_Sample2.py
\# Description: Populate the route ID and measures in the input layer based on overlapping routes from the network layer.
\# The output is the input layer with the updated route ID and measure values, and a .csv file with information on the updated features and errors.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out license
arcpy.CheckOutExtension("LocationReferencing")

\## Variables are supported from feature service only. Portal signin is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\# Initialize variables
\# Map the lrs network from the feature service. Here, 8 corresponds to the LRS route network.
lrs_network_url =  r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/8"
lrs_network = arcpy.management.MakeFeatureLayer(lrs_network_url, "networkLayer")

\# Map the input feature layer from the same feature service. Here, 18 corresponds to the input feature layer.
in_features_url = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/18"
in_features = arcpy.management.MakeFeatureLayer(in_features_url, "inputFeaturesLayer")
lrs_date="10/8/2019"
route_id_field = "ROUTEID"
from_measure_field = "FROMMEASURE"
to_measure_field = "TOMEASURE"
route_name_field = None
search_tolerance=None

\# Execute the tool
arcpy.locref.UpdateMeasuresFromLRS(lrs_network, lrs_date, in_features, route_id_field, from_measure_field, to_measure_field, route_name_field, search_tolerance)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)

![Figure 1 — Licensing information](../media/6189-update-measures-from-lrs-lr/fig-01-licensing-information.png)
