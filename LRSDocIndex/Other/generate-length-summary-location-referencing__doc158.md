# Generate Length Summary (Location Referencing)

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#6748](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6748) |
| **Source** | [6748_GenerateLengthSummaryGP.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6748_GenerateLengthSummaryGP.docx>) |
| **Edited** | 2025-06-11 18:59 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Generate Length Summary (Location Referencing)"
source_file: "6748_GenerateLengthSummaryGP.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6748_GenerateLengthSummaryGP.docx"
doc_id: 158
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-06-11T18:59:02.3197831Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["length summary", "routes", "lrs network", "length data product", "summary fields", "length fields"]
tools: ["Generate Length Summary"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#6748"]
related: [{"doc":282,"file":"generate-length-summary-geoprocessing-tool__doc282.md","s":5.584},{"doc":205,"file":"generate-lrs-data-product-location-referencing__doc205.md","s":5.559},{"doc":226,"file":"generate-lrs-data-product-location-referencing__doc226.md","s":5.257},{"doc":357,"file":"generate-lrs-data-product-support-summary-and-length__doc357.md","s":5.036},{"doc":147,"file":"generate-lrs-feature-count-location-referencing__doc147.md","s":4.684}]
```
-->

## Summary

Describes a tool to create a length data product for routes in an LRS Network without an LRS data template. Supports inputs from file geodatabases, enterprise geodatabases, or feature services and outputs results as CSV or geodatabase tables. Includes parameters for effective date, length units, summary and length fields, and options for dominant route length calculation.

## Related documents

<!-- related:begin -->
- [Generate Length Summary Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-length-summary-geoprocessing-tool__doc282.md>) — similar text 0.21 · 3 title words · 3 filename words · same kind/surface <!-- rel:282 -->
- [Generate LRS Data Product (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-lrs-data-product-location-referencing__doc205.md>) — similar text 0.74 · 1 title word · 1 filename word · same kind/surface <!-- rel:205 -->
- [Generate LRS Data Product (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-lrs-data-product-location-referencing__doc226.md>) — similar text 0.74 · 1 title word · 1 filename word · same kind/surface <!-- rel:226 -->
- [Generate LRS Data Product Support Summary and Length](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-lrs-data-product-support-summary-and-length__doc357.md>) — similar text 0.14 · 3 title words · 3 filename words · same surface <!-- rel:357 -->
- [Generate LRS Feature Count (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-lrs-feature-count-location-referencing__doc147.md>) — similar text 0.39 · 1 title word · 1 filename word · same kind/surface <!-- rel:147 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)

_No page matched:_ [Generate Length Summary](https://www.google.com/search?q=%22Generate%20Length%20Summary%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Generate Length Summary (Location Referencing)

### Summary
Creates a length data product for routes in an LRS Network without an LRS data template.

### Usage

- This tool supports data from a file geodatabase, an enterprise geodatabase (branch versioned connection), or a feature service (published from branch versioned data).
- This tool does not modify the inputs and will create a .csv file or a geodatabase table as the output.
- The Effective Date parameter is used to define the temporal view of the network. Only routes active on this date will be used to calculate the output.
- The summary layer must be a polygon feature class, an LRS line event feature class, or an LRS Network.
- The length layer must be an LRS Network or an LRS line event feature class that is registered to the specified LRS Network.
- The summary and length layers must be stored in the same geodatabase or feature service and have the same coordinate system as the specified LRS Network.
- If the Calculate length for dominant routes parameter is checked, and the length layer is an LRS line event feature class, the length of the event features associated with the dominant route in each concurrent section will be calculated.
- A value of Unclassified will be included in the output summary field for routes that do not overlap with the summary layers.
- You can add multiple summary fields from the same feature class by creating selection layers and specifying each selection layer as a summary field. For example, if you have a county boundary feature class, you can create two selection layers—North_County and South_County—and specify each selection layer as a summary field.
- The LRS length data product is summarized based on unique values in the summary layer. You can configure multiple summary layers and summary fields. The summary layers are arranged and divided by levels based on their spatial relationships. For example, you can configure a county boundary layer as level one, and a pavement condition layer as level two.
- You can add multiple length fields from the same feature class by creating selection layers and specifying each selection layer as a length field. For example, if you have an LRS line event feature class, you can create two selection layers—Class A and Class B—and specify each selection layer as a length field.

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Input Route Features | The route features that will be used to calculate the length data product. | Feature Layer |
| Effective Date | The date that will be used to define the temporal view of the network. The default value is today’s date. | Date |
| Length Units | Specifies the measure unit that will be used for the length field s in the output. Inches (US Survey)—The units will be inches. Feet (US Survey)— The units will be feet. Yards (US Survey)—The units will be yards. Miles (US Survey)—The units will be miles. Nautical Miles (US Survey)—The units will be nautical miles. Statute Miles—The units will be statute miles. Feet (International)—The units will be international feet. Millimeters—The units will be millimeters. Centimeters—The units will be centimeters. Meters—The units will be meters. Kilometers—The units will be kilometers. Decimeters—The units will be decimeters. The default unit is the network' s measure unit. | String |
| Summary Fields (Optional) | The field(s) used to show the names for the summary rows in the output: Layer—The feature layer that will be used as the summary layer. Field—The field that will be used to summarize the length. Output Field Name—The summary field’s display name in the output. | Value Table |
| Length Fields (Optional) | The field(s) used to show the length of the routes in the output: Layer—The feature layer that will be used as the basis for calculating the length. Output Field Name—The length field’s display name in the output. | Value Table |
| Exclude null summary rows (Optional) | Specifies whether null summary rows will be excluded from the output. Checked—Rows with a zero length will be excluded from the output. This is the default. Unchecked—Rows with a zero length will not be excluded from the output. | Boolean |
| Calculate length for dominant routes (Optional) | Specifies whether only the length of the dominant routes will be included in the output, if route dominance rules are configured for the specified network . Checked— Only the length of the dominant routes will be included in the output . Unchecked— The length of all routes will be included in the output. This is the default. | Boolean |
| Output Format (Optional) | Specifies the format of the output file. CSV—The output file will be a .csv file. This is the default. Table—The output file will be a geodatabase table. | String |
| Output File ( Optional) | The output .csv file that contains the calculated length. | File |
| Output Table (Optional) | The output geodatabase ta ble that contains the calculated length. | Table |

#### Python
arcpy.locref.GenerateLengthSummary(in_route_features, effective_date, units, {summary_fields}, {length_fields}, {exclude_null_summary_rows}, {calculate_length_for_dominant_routes}, {output_format}, {out_file}, {out_table})

| Name | Explanation | Data Type |
| --- | --- | --- |
| in_route_features | Same as above | Feature Layer |
| effective_date | Same as above | Date |
| units | Specifies the measurement units that will be used for the length field in the output. INCHES—The units will be inches. FEET—The units will be feet. YARDS—The units will be yards. MILES—The units will be miles. NAUTICAL_MILES—The units will be nautical miles. INTMILES—The units will be statute miles. INTFEET—The units will be international feet. MILLIMETERS—The units will be millimeters. CENTIMETERS—The units will be centimeters. METERS—The units will be meters. KILOMETERS—The units will be kilometers. DECIMETERS—The units will be decimeters. The default unit is the network's measure unit. | String |
| summary_fields (Optional) | Same as above | Value Table |
| length_fields (Optional) | Same as above | Value Table |
| exclude_null_summary_rows (Optional) | Specifies whether null summary rows will be excluded from the output. EXCLUDE—Rows with a zero length or feature count will be excluded from the output. This is the default. DO_NOT_EXCLUDE—Rows with a zero length or feature count will not be excluded from the output. | Boolean |
| calculate_length_for_dominant_routes (Optional) | Specifies whether only the length of the dominant routes will be included in the output, if route dominance rules are configured for the specified network. DOMINANT_ROUTES—Only the length of the dominant routes will be included in the output. ALL_ROUTES—The length of all routes will be included in the output. This is the default. | Boolean |
| output_format (Optional) | Specifies the format of the output file. CSV—The output file will be a .csv file. This is the default. TABLE—The output file will be a geodatabase table. | String |
| out_file (Optional) | Same as above | File |
| out_table (Optional) | Same as above | Table |

#### Code sample
GenerateLengthSummary example 1 (stand-alone script)
The following stand-alone script demonstrates how to use the GenerateLengthSummary function in a stand-alone script.
\# Name: GenerateLengthSummary_ex1.py
\# Description: Transforms LRS data to create a length data product for the selected routes in an LRS Network in a stand-alone script.
\# Requirements: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out the license
arcpy.CheckOutExtension("LocationReferencing")

\# Set current workspace
arcpy.env.workspace = r"C:\Data\SampleData.gdb"

\# Create a feature layer of counties that have more than 50,000 population, to be used as summary field
arcpy.management.MakeFeatureLayer("counties", "counties_50K", "POPULATION > 50000")

\# Create 3 feature layers, each representing a class type, to be used as length fields
arcpy.management.MakeFeatureLayer("Functional Class", "Class_A", "classtype = 1")
arcpy.management.MakeFeatureLayer("Class", "Class_B", "classtype = 2")
arcpy.management.MakeFeatureLayer("Class", "Class_C", "classtype = 3")

\# Local tool variables
in_route_features = "Network"
effective_date = "12/31/2024"
units = "METERS"
summary_fields = "counties_50K NAME Counties"
length_fields = "Class_A 'Class A'; Class_B 'Class B'; Class_C 'Class C'" exclude_null_summary_rows = "EXCLUDE"
calculate_length_for_dominant_routes = None
output_format = "CSV"
out_file = r"C:\Data\LP1.csv"
out_table = None

\# Run the tool
arcpy.locref.GenerateLengthSummary(in_route_features, effective_date, units, summary_fields, length_fields, exclude_null_summary_rows, calculate_length_for_dominant_routes, output_format, out_file, out_table)

\# Check in the license
arcpy.CheckInExtension("LocationReferencing")

GenerateLengthSummary example 2 (Python window)
The following script demonstrates how to use the GenerateLengthSummary function in the Python window.
\# Name: GenerateLengthSummary_ex2.py
\# Description: Transforms LRS data to create a length data product for the selected routes in an LRS Network in the Python window in ArcGIS Pro.
\# Requirements: ArcGIS Location Referencing

\# Local tool variables
in_route_features = "Network"
effective_date = "12/31/2024"
units = "METERS"
summary_fields = "Counties NAME Counties"
length_fields = "'Functional Class' 'Functional Class'"
exclude_null_summary_rows = "DO_NOT_EXCLUDE"
calculate_length_for_dominant_routes = None
output_format = "CSV"
out_file = r"C:\Data\LP2.csv"
out_table = None

\# Run the tool
arcpy.locref.GenerateLengthSummary(in_route_features, effective_date, units, summary_fields, length_fields, exclude_null_summary_rows, calculate_length_for_dominant_routes, output_format, out_file, out_table)

GenerateLengthSummary example 3 (stand-alone script)
The following stand-alone script demonstrates how to use the GenerateLengthSummary function with data from a feature service.
\# Name: GenerateLengthSummary_ex3.py
\# Description: Transforms LRS data to create a data product for the selected routes using a feature service.
\# Requires: ArcGIS Location Referencing
\# Import arcpy module
import arcpy
\# Check out the license
arcpy.CheckOutExtension("LocationReferencing")
\# Signing in to portal is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')
\# Map the LRS network from the feature service. Here, 1 corresponds to the target LRS Network's layer ID.
in_route_features = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/1"
\# Map the Counties layer from the feature service. Here, 39 corresponds to the Counties layer's layer ID.
counties = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/39"
\# Create a layer of counties that have more than 50,000 population, to be used as summary field
arcpy.management.MakeFeatureLayer(counties, "counties_50K", "POPULATION > 50000")
\# Map the Functional Class layer from the feature service. Here, 22 corresponds to the Class layer's layer ID.
functionalclass = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/22"
\# Create 3 feature layers, each representing a class type, to be used as length fields
arcpy.management.MakeFeatureLayer(class, "Class_A", "classtype = 1")
arcpy.management.MakeFeatureLayer(class, "Class_B", "classtype = 4")
arcpy.management.MakeFeatureLayer(class, "Class_C", "classtype = 7")
\# Set tool variables
effective_date = "12/31/2024"
units = "METERS"
summary_fields = "counties_50K RECORD_STATUS Counties"
length_fields = "Class_A 'Class A'; Class_B 'Class B'; Class_C 'Class C'"
exclude_null_summary_rows = "EXCLUDE"
calculate_length_for_dominant_routes = None
output_format = "CSV"
out_file = r"C:\Data\LP3.csv"
out_table = None
\# Run the tool
arcpy.locref.GenerateLengthSummary(in_route_features, effective_date, units, summary_fields, length_fields, exclude_null_summary_rows, calculate_length_for_dominant_routes, output_format, out_file, out_table)
\# Check in the license
arcpy.CheckInExtension("LocationReferencing")

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
