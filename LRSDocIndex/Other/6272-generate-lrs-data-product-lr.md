# Generate LRS Data Product (Location Referencing)

| Field | Value |
| --- | --- |
| **Doc** | 226 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6272](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6272) |
| **Source** | [6272_GenerateLRSDataProductGP_RouteLog.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6272_GenerateLRSDataProductGP_RouteLog.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-02-25 23:53 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | length data product · route log · lrs network · route · template · unit conversion · boundary features |
| **Tools** | Generate Lrs Data Product |

## Summary

Describes the Generate LRS Data Product tool that transforms LRS data to create length or route log data products for selected routes in an LRS Network. It supports input templates, route features, effective dates, unit conversions, and output formats including CSV and geodatabase tables. The document includes usage details, parameters, Python code examples, and licensing requirements.

## Related documents

<!-- related:begin -->
- [Generate LRS Data Product (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6356-generate-lrs-data-product-lr.md>) — similar text 0.97 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:205 s=10.021 -->
- [Generate Route Log (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6354-generate-route-log-lr.md>) — similar text 0.56 · 1 title word · 3 filename words · same kind/surface <!-- rel:150 s=5.315 -->
- [Generate Length Summary (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6748-generate-length-summary-lr.md>) — similar text 0.74 · 1 title word · 1 filename word · same kind/surface <!-- rel:158 s=5.257 -->
- [Generate LRS Feature Count (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6749-generate-lrs-feature-count-lr.md>) — similar text 0.36 · 1 title word · 1 filename word · same kind/surface <!-- rel:147 s=3.85 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6209-generate-a-route-log-using-the-glrsdp-gp.md>) — similar text 0.11 · 1 title word · 3 filename words · same surface <!-- rel:260 s=3.689 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html) · [Create a template for an LRS route log data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-route-log-data-product.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Generate Lrs Data Product](https://www.google.com/search?q=%22Generate%20Lrs%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Generate LRS Data Product (Location Referencing)

### Summary
Transforms LRS data to create a length or route log data product for selected routes in an LRS Network. For example, use this tool to summarize the mileage of a set of routes or lines by a county boundary.

### Usage

- The template must be a .json file.
- Use a network feature class for the Input Route Features parameter value.
- This tool does not modify the inputs and will create a .csv file or a geodatabase table as the output.
- This tool supports selection and definition query.
- The Effective Date parameter is used to define the temporal view of the network. Only routes active on this date will be used for calculating the output.
- When creating a length data product:
  - Use an LRS dData template that specifies the summary and length fields. You can use a location referencing template for pipelines or roads and highways.
  - The summary and length fields must exist in the same geodatabase as the LRS Network layer.
  - This tool supports unit conversion when converting from the network's measure units to another unit.
  - The Boundary Features and Summary Field parameters are only valid when no summary field is provided in the .json file.
  - If the network has routes with calibration issues or with a length of zero, check the Exclude Null Summary Rows parameter to exclude those routes from the output. Otherwise, those routes will be included in the output with a length of zero.
- When creating a route log data product:
  - Use an LRS data template that specifies the route identifier, log, location, and referent fields. You can use a location referencing template for pipelines or roads and highways.
  - If the network has uncalibrated routes, route ID or route name will be included in the output, but all other fields will contain null values.

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Template | The input LRS d D ata template that specifies the summary and length fields ( length data product) or route identi fi er , log, location , and referent fields (route log) . | File |
| Input Route Features | The LRS Network that will be used to calculate the length or route log . | Feature Layer |
| Effective Date | The date that will be used to define the temporal view of the network. | Date |
| Length Units (Optional) | Specifies the measurement units that will be used for the length field in the output.<br>Inches (US Survey)—The units will be inches.<br>Feet (US Survey)—The units will be feet.<br>Yards (US Survey)— The units will be yards.<br>Miles (US Survey)—The units will be miles.<br>Nautical miles (US Survey)—The units will be nautical miles.<br>Statute Miles—The units will be statute miles.<br>Feet (International)—The units will be international feet.<br>Millimeters—The units will be millimeters.<br>Centimeters—The units will be centimeters.<br>Meters—The units will be meters.<br>Kilometers—The units will be kilometers.<br>Decimeters—The units will be decimeters.<br>This parameter is only available when creating a length data product. | String |
| Boundary Features<br>(Optional) | The boundary layer that will be used to summarize the data.<br>This parameter is only available when creating a length data product. | Feature Layer |
| Summary Field<br>(Optional) | The field from the boundary layer that provides the names for the summary rows.<br>This parameter is only available when creating a length data product. | Field |
| Exclude null summary rows<br>(Optional) | Specifies whether null summary rows will be excluded from the output.<br>Checked—Uncalibrated routes or routes with zero length will be excluded from the output. This is the default.<br>Unchecked—Uncalibrated routes or routes with zero length will not be excluded from the output; they will be included in the output with a mileage of 0.<br>This parameter is only available when creating a length data product. | Boolean |
| Output Format<br>(Optional) | Specifies the format of the output file.<br>CSV—The output file will be a .csv file. This is the default.<br>Table – The output file will be a geodatabase table. | String |
| Output File<br>(Optional) | The output .csv file where the calculated length or route log will be written. | File |
| Output Table<br>(Optional) | The table that will be created with the calculated length or route log . | Table |

#### Python
arcpy.locref.GenerateLrsDataProduct(in_template, in_route_features, effective_date, units, {boundary_features}, {summary_field}, {exclude_null_summary_rows}, {output_format}, {out_file}, {out_table})

| Name | Explanation | Data Type |
| --- | --- | --- |
| in_template | The input LRS Data template that specifies the summary and length fields. | File |
| in_route_features | The LRS Network that will be used to calculate the length. | Feature Layer |
| effective_date | The date that will be used to define the temporal view of the network. | Date |
| units | Specifies the measurement units that will be used for the length field in the output.<br>INCHES—The units will be inches.<br>FEET—The units will be feet.<br>YARDS—The units will be yards.<br>MILES—The units will be miles.<br>NAUTICAL_MILES—The units will be nautical miles.<br>INTMILES—The units will be statute miles.<br>INTFEET—The units will be international feet.<br>MILLIMETERS—The units will be millimeters.<br>CENTIMETERS—The units will be centimeters.<br>METERS—The units will be meters.<br>KILOMETERS—The units will be kilometers.<br>DECIMETERS—The units will be decimeters. | String |
| boundary_features<br>(Optional) | The boundary layer that will be used to summarize the data. | Feature Layer |
| summary_field<br>(Optional) | The field from the boundary layer that provides the names for the summary rows. | Field |
| exclude_null_summary_rows<br>(Optional) | Specifies whether null summary rows will be excluded from the output.<br>EXCLUDE—Uncalibrated routes or routes with zero length will be excluded from the output. This is the default.<br>DO_NOT_EXCLUDE—Uncalibrated routes or routes with zero length will not be excluded from the output; they will be included in the output with a mileage of 0. | Boolean |
| output_format<br>(Optional) | Specifies the format of the output file.<br>CSV—The output file will be a .csv file. This is the default.<br>TABLE —The output file will be a geodatabase table. | String |
| out_file<br>(Optional) | The output .csv file where the calculated length will be written. | File |
| out_table<br>(Optional) | The table that will be created with the calculated length. | Table |

#### Code sample
GenerateLrsDataProduct example 1 (stand-alone script)
The following stand-alone script demonstrates how to use the GenerateLrsDataProduct function as a stand-alone script.
\# Name: GenerateLrsDataProduct_ex1.py
\# Description: Transforms LRS data to create a Length product for the selected routes in an LRS Network in a stand-alone script.
\# Requirements: ArcGIS Location Referencing

\# Import arcpy module
import arcpy

\# Check out any necessary licenses
arcpy.CheckOutExtension("LocationReferencing")

\# Local tool variables
in_template=r"C:\Data\Template.json"
in_route_features=r"C:\Data\SampleData.gdb\LRS\Network"
effective_date="06/03/2024"
units="METERS"
boundary_features = None
summary_field = None
exclude_null_summary_rows="EXCLUDE"
output_format="CSV"
out_file= r"C:\Data\LP1.csv"
out_table=None

\# Run the tool
arcpy.locref.GenerateLrsDataProduct(in_template, in_route_features, effective_date, units, boundary_features, summary_field, exclude_null_summary_rows, output_format, out_file, out_table)

\# Check in licenses
arcpy.CheckInExtension('LocationReferencing')
GenerateLrsDataProduct example 2 (Python window)
The following script demonstrates how to use the GenerateLrsDataProduct function in the Python window.
\# Name: GenerateLrsDataProduct_ex2.py
\# Description: Transforms LRS data to create a Length product for the selected routes in an LRS Network in the inline Python window in ArcGIS Pro.
\# Requirements: ArcGIS Location Referencing

\# Local tool variables
in_template=r"C:\Data\Template.json"
in_route_features=r"C:\Data\SampleData.gdb\LRS\Network"
effective_date="06/03/2024"
units="METERS"
boundary_features = None
summary_field = None
exclude_null_summary_rows="DO_NOT_EXCLUDE"
output_format="CSV"
out_file= r"C:\Data\LP2.csv"
out_table=None

\# Run the tool
arcpy.locref.GenerateLrsDataProduct(in_template, in_route_features, effective_date, units, boundary_features, summary_field, exclude_null_summary_rows, output_format, out_file, out_table)
GenerateLrsDataProduct example 3 (stand-alone script)
The following stand-alone script demonstrates how to use the GenerateLrsDataProduct function in a feature service.
\# Name: GenerateLrsDataProduct_Ex3.py
\# Description: Transforms LRS data to create a Length product for the selected routes using a feature service.
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
in_template=r"C:\Data\Template.json"
effective_date="06/03/2024"
units="FEET"
boundary_features = None
summary_field = None
exclude_null_summary_rows="EXCLUDE"
output_format="CSV"
out_file= r"C:\Data\LP3.csv"
out_table=None

\# Run the tool
arcpy.locref.GenerateLrsDataProduct (in_template, in_route_features, effective_date, units, boundary_features, summary_field, exclude_null_summary_rows, output_format, out_file, out_table)

\# Check in license
arcpy.CheckInExtension('LocationReferencing')

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
