# Generate LRS Data Product (Location Referencing)

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#6356](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6356) |
| **Source** | [6356_GenerateLRSDataProductGP_FeatureCount.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6356_GenerateLRSDataProductGP_FeatureCount.docx>) |
| **Edited** | 2025-03-01 00:46 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Generate LRS Data Product (Location Referencing)"
source_file: "6356_GenerateLRSDataProductGP_FeatureCount.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6356_GenerateLRSDataProductGP_FeatureCount.docx"
doc_id: 205
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-03-01T00:46:08.2873818Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["length data product", "route log", "feature count", "lrs network", "data product", "location referencing", "arcpy"]
tools: ["GenerateLrsDataProduct"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#6356"]
related: [{"doc":226,"file":"generate-lrs-data-product-location-referencing__doc226.md","s":10.021},{"doc":158,"file":"generate-length-summary-location-referencing__doc158.md","s":5.559},{"doc":147,"file":"generate-lrs-feature-count-location-referencing__doc147.md","s":5.03},{"doc":150,"file":"generate-route-log-location-referencing__doc150.md","s":4.567},{"doc":282,"file":"generate-length-summary-geoprocessing-tool__doc282.md","s":3.727}]
```
-->

## Summary

Describes the GenerateLrsDataProduct tool that transforms LRS data to create length, route log, or feature count data products for selected routes in an LRS Network. It explains usage, parameters, and provides Python code examples for running the tool standalone or with feature services. Licensing requirements for ArcGIS Location Referencing are also included.

## Related documents

<!-- related:begin -->
- [Generate LRS Data Product (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-lrs-data-product-location-referencing__doc226.md>) — similar text 0.97 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:226 -->
- [Generate Length Summary (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-length-summary-location-referencing__doc158.md>) — similar text 0.74 · 1 title word · 1 filename word · same kind/surface <!-- rel:158 -->
- [Generate LRS Feature Count (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-lrs-feature-count-location-referencing__doc147.md>) — similar text 0.40 · 1 title word · 2 filename words · same kind/surface <!-- rel:147 -->
- [Generate Route Log (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-route-log-location-referencing__doc150.md>) — similar text 0.56 · 1 title word · 1 filename word · same kind/surface <!-- rel:150 -->
- [Generate Length Summary Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-length-summary-geoprocessing-tool__doc282.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface <!-- rel:282 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html) · [Create a template for an LRS route log data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-route-log-data-product.html) · [Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)

_No page matched:_ [GenerateLrsDataProduct](https://www.google.com/search?q=%22GenerateLrsDataProduct%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Generate LRS Data Product (Location Referencing)

### Summary
Transforms LRS data to create a length,  or route log, or feature count data product for selected routes in an LRS Network.

### Usage

- The template must be a .json file.
- Use a network feature class for the Input Route Features parameter.
- This tool does not modify the inputs and will create a .csv file or a geodatabase table as the output.
- This tool supports selection and definition query.
- The Effective Date parameter is used to define the temporal view of the network. Only routes active on this date will be used for calculating the output.
- When creating a length data product:
  - Use an LRS data template that specifies the summary and length fields. You can use a location referencing template for pipelines or roads and highways.
  - The summary and length fields must exist in the same geodatabase as the LRS Network layer.
  - This tool supports unit conversion when converting from the network's measure units to another unit.
  - The Boundary Features and Summary Field parameters are only valid when no summary field is provided in the .json file.
  - If the network has routes with calibration issues or with a length of zero, check the Exclude Null Summary Rows parameter to exclude those routes from the output. Otherwise, those routes will be included in the output with a length of zero.\
- When creating a route log data product:
  - Use an LRS data template that specifies the log, location, and referent fields. You can use a location referencing template for pipelines or roads and highways.
  - The log layer and fields must exist in the same geodatabase as the LRS Network layer.
  - The location layer and fields must be a polygon layer and exist in the same geodatabase as the LRS Network layer.
  - The referent layer and fields must be an LRS point event feature class and exist in the same geodatabase as the LRS Network layer.
- When creating a feature count data product:
- Use an LRS data template that specifies the count, summary, and route identifier fields. You can use a location referencing template for pipelines or roads and highways.
- The count, summary, and route identifier fields must exist in the same geodatabase as the LRS Network layer.
- The Boundary Features and Summary Field parameters are only valid when no summary field is provided in the .json file.

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Template | The input LRS data template that specifies the summary and length fields (length data product) ; or route identifier, log, location, and referent fields (route log data product) ; or count, summary , and route identifier fields (feature count data product). . | File |
| Input Route Features | The LRS Network that will be used to calculate the length , or route log , or feature count . | Feature Layer |
| Effective Date | The date that will be used to define the temporal view of the network. | Date |
| Length Units (Optional) | Specifies the measurement units that will be used for the length field in the output. This parameter is only available when creating a length data product. Inches (US Survey)—The units will be inches. Feet (US Survey)—The units will be feet. Yards (US Survey)—The units will be yards. Miles (US Survey)—The units will be miles. Nautical miles (US Survey)—The units will be nautical miles. Statute Miles—The units will be statute miles. Feet (International)—The units will be international feet. Millimeters—The units will be millimeters. Centimeters—The units will be centimeters. Meters—The units will be meters. Kilometers—The units will be kilometers. Decimeters—The units will be decimeters. | String |
| Boundary Features (Optional) | The boundary layer that will be used to summarize the data. This parameter is only available when creating a length or feature count data product. | Feature Layer |
| Summary Field (Optional) | The field from the boundary layer that provides the names for the summary rows. This parameter is only available when creating a length or feature count data product. | Field |
| Exclude null summary rows (Optional) | Specifies whether null summary rows will be excluded from the output. Checked— Uncalibrated routes or routes with zero length will be excluded from the output. This is the default. The rows with a zero length or feature count will be excluded from the output . This is the default. Unchecked— Uncalibrated routes or routes with zero length will not be excluded from the output; they will be included in the output with a mileage of 0. The rows with a zero length or feature count will be included in the output. This parameter is only available when creating a length or feature count data product. | Boolean |
| Output Format (Optional) | Specifies the format of the output file. CSV—The output file will be a .csv file. This is the default. Table—The output file will be a geodatabase table. | String |
| Output File (Optional) | The output .csv file where the calculated length , or route log , or feature count will be written. | File |
| Output Table (Optional) | The geodatabase table that will be created with the calculated length , or route log , or feature count. . | Table |

#### Python
arcpy.locref.GenerateLrsDataProduct(in_template, in_route_features, effective_date, {units}, {boundary_features}, {summary_field}, {exclude_null_summary_rows}, {output_format}, {out_file}, {out_table})

| Name | Explanation | Data Type |
| --- | --- | --- |
| in_template | The input LRS data template that specifies the summary and length fields (length data product) ; or route identifier, log, location, and referent fields (route log data product) ; or count, s ummary and route identifier fields (feature count data product). . | File |
| in_route_features | The LRS Network that will be used to calculate the length , or route log , or feature count. . | Feature Layer |
| effective_date | The date that will be used to define the temporal view of the network. | Date |
| units (Optional) | Specifies the measurement units that will be used for the length field in the output. This parameter is only available when creating a length data product. INCHES—The units will be inches. FEET—The units will be feet. YARDS—The units will be yards. MILES—The units will be miles. NAUTICAL_MILES—The units will be nautical miles. INTMILES—The units will be statute miles. INTFEET—The units will be international feet. MILLIMETERS—The units will be millimeters. CENTIMETERS—The units will be centimeters. METERS—The units will be meters. KILOMETERS—The units will be kilometers. DECIMETERS—The units will be decimeters. | String |
| boundary_features (Optional) | The boundary layer that will be used to summarize the data. This parameter is only available when creating the a length or feature count data product s . | Feature Layer |
| summary_field (Optional) | The field from the boundary layer that provides the names for the summary rows. This parameter is only available when creating a length data product. | Field |
| exclude_null_summary_rows (Optional) | Specifies whether null summary rows will be excluded from the output. EXCLUDE— Uncalibrated routes or routes with zero length will be excluded from the output. This is the default. The rows with a zero length or feature count will be excluded from the output. This is the default. DO_NOT_EXCLUDE— Uncalibrated routes or routes with zero length will not be excluded from the output; they will be included in the output with a mileage of 0. The rows with a zero length or feature count will be included in the output. This parameter is only available when creating a length data product. | Boolean |
| output_format (Optional) | Specifies the format of the output file. CSV—The output file will be a .csv file. This is the default. TABLE—The output file will be a geodatabase table. | String |
| out_file (Optional) | The output .csv file where the calculated length or route log will be written. | File |
| out_table (Optional) | The geodatabase table that will be created with the calculated length , or route log or feature count data products . | Table |

#### Code sample
GenerateLrsDataProduct example 1 (stand-alone script)
The following stand-alone script demonstrates how to use the GenerateLrsDataProduct function in a stand-alone script.
\# Name: GenerateLrsDataProduct_ex1.py
\# Description: Transforms LRS data to create a data product for the selected routes in an LRS Network in a stand-alone script.
\# Requirements: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out any necessary licenses
arcpy.CheckOutExtension("LocationReferencing")

\# Local tool variables
in_template= r"C:\Data\Template.json"
in_route_features= r"C:\Data\SampleData.gdb\LRS\Network"
effective_date= "12/31/2024"
units= "METERS"
boundary_features = None
summary_field = None
exclude_null_summary_rows= "EXCLUDE"
output_format= "CSV"
out_file= r"C:\Data\LP1.csv"
out_table= None

\# Run the tool
arcpy.locref.GenerateLrsDataProduct(in_template, in_route_features, effective_date, units, boundary_features, summary_field, exclude_null_summary_rows, output_format, out_file, out_table)

\# Check in licenses
arcpy.CheckInExtension("LocationReferencing")
GenerateLrsDataProduct example 2 (Python window)
The following script demonstrates how to use the GenerateLrsDataProduct function in the Python window.
\# Name: GenerateLrsDataProduct_ex2.py
\# Description: Transforms LRS data to create a data product for the selected routes in an LRS Network in the inline Python window in ArcGIS Pro.
\# Requirements: ArcGIS Location Referencing

\# Local tool variables
in_template= r"C:\Data\Template.json"
in_route_features= r"C:\Data\SampleData.gdb\LRS\Network"
effective_date= "12/31/2024"
units= "METERS"
boundary_features = None
summary_field = None
exclude_null_summary_rows= "DO_NOT_EXCLUDE"
output_format= "CSV"
out_file= r"C:\Data\LP2.csv"
out_table= None

\# Run the tool
arcpy.locref.GenerateLrsDataProduct(in_template, in_route_features, effective_date, units, boundary_features, summary_field, exclude_null_summary_rows, output_format, out_file, out_table)
GenerateLrsDataProduct example 3 (stand-alone script)
The following stand-alone script demonstrates how to use the GenerateLrsDataProduct function with data from a feature service.
\# Name: GenerateLrsDataProduct_Ex3.py
\# Description: Transforms LRS data to create a data product for the selected routes using a feature service.
\# Requires: ArcGIS Location Referencing

\# Import arcpy module.
import arcpy

\# Check out the license
arcpy.CheckOutExtension("LocationReferencing")

\# Input event and target LRS network are in feature service.  Signing in portal is required to access the feature service.
arcpy.SignInToPortal('https://yourdomain.com/portal', 'username', 'password')

\# Map the LRS network from the feature service. Here, 1 corresponds to the target LRS Network's layer ID.
in_route_features = r"https://yourdomain.com/server/rest/services/FeatureServiceName/FeatureServer/1"

\# Set tool variables
in_template= r"C:\Data\Template.json"
effective_date= "12/31/2024"
units= "FEET"
boundary_features = None
summary_field = None
exclude_null_summary_rows= "EXCLUDE"
output_format= "CSV"
out_file= r"C:\Data\LP3.csv"
out_table= None

\# Run the tool
arcpy.locref.GenerateLrsDataProduct (in_template, in_route_features, effective_date, units, boundary_features, summary_field, exclude_null_summary_rows, output_format, out_file, out_table)

\# Check in license
arcpy.CheckInExtension("LocationReferencing")

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
