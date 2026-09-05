# Generate LRS Feature Count (Location Referencing)

| Field | Value |
| --- | --- |
| **Doc** | 147 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6749](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6749) |
| **Source** | [6749_GenerateLRSFeatureCountGP.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6749_GenerateFeatureCountGP/6749_GenerateLRSFeatureCountGP.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-08-13 00:14 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | feature count · routes · lrs network · summary layer · feature count layer |
| **Tools** | Generate LRS Feature Count |

## Summary

Describes a tool to create an LRS feature count data product for routes in an LRS Network without an LRS data template. It supports inputs from file geodatabases, enterprise geodatabases, or feature services and outputs results as CSV files or geodatabase tables. The tool uses parameters such as effective date, summary fields, and feature count layers to generate counts of features along routes.

## Related documents

<!-- related:begin -->
- [Generate LRS Data Product (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6356-generate-lrs-data-product-lr.md>) — similar text 0.40 · 1 title word · 2 filename words · same kind/surface <!-- rel:205 s=5.03 -->
- [Generate Length Summary (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6748-generate-length-summary-lr.md>) — similar text 0.39 · 1 title word · 1 filename word · same kind/surface <!-- rel:158 s=4.684 -->
- [Generate Route Log (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6354-generate-route-log-lr.md>) — similar text 0.33 · 1 title word · 1 filename word · same kind/surface <!-- rel:150 s=4.381 -->
- [Feature Count Support Generate Data GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/feature-count-support-generate-data-gp.md>) — similar text 0.14 · 3 title words · 2 filename words · same surface <!-- rel:253 s=4.3 -->
- [Create a template for an LRS feature count data product](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-a-template-for-an-lrs-feature-count-data-product-apr.md>) — similar text 0.14 · 2 title words · 1 filename word · same kind/surface <!-- rel:198 s=4.291 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Generate LRS Feature Count](https://www.google.com/search?q=%22Generate%20LRS%20Feature%20Count%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Generate LRS Feature Count (Location Referencing)

### Summary
Creates an LRS feature count data product for routes in an LRS Network without an LRS data template.

### Usage

- This tool supports data from a file geodatabase, an enterprise geodatabase (branch versioned connection), or a feature service (published from branch versioned data).
- This tool does not modify the inputs and will create a .csv file or a geodatabase table as the output.
- The Effective Date parameter is used to define the temporal view of the network. Only the routes active on this date will be used to calculate the output.
- The summary layer must be a polygon feature class or an LRS line event feature class that is registered to the specified LRS Network.
- A value of Unclassified will be included in the output summary field for routes that do not overlap with the summary layers.
- You can add multiple summary fields.
- The feature count layer must be an LRS point event feature class, an LRS line event feature class, or an LRS intersection feature class that is registered to the specified LRS Network.
- A value of Unclassified will be included in the output feature count fields for routes that do not overlap with the feature count layers.
- The summary and feature count layers must be stored in the same geodatabase or feature service and have the same coordinate system as the specified LRS Network.
- You can add multiple feature count layers from the same feature class by creating selection layers and specifying each selection layer as a feature count layer. For example, if you have an LRS point event feature class, you can create two selection layers—Class A and Class B—and specify each selection layer as a feature count layer.

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Input Route Features | The route features that will be used to gener ate the feature count data product . | Feature Layer |
| Effective Date | The date that will be used to define the temporal view of the network .<br>The default value is today’s date. | Date |
| Summary Fields<br>(Optional) | The field(s) used to show the names for the summary rows in the output:<br>Layer—The feature layer that will be used as the summary layer.<br>Field—The field that will be used to summarize the feature count .<br>Output Field Name—The summary field's display name in the output. | Value Table |
| Feature Count Layers<br>(Optional) | The layer(s) used to locate the number of features along a route:<br>Layer—The feature layer that will be used as the feature count layer.<br>Output Field Name—The feature count layer’s display name in the output. | Value Table |
| Exclude null summary rows<br>(Optional) | Specifies whether null summary rows will be excluded from the output.<br>Checked—Rows that h ave only zero feature count s will be excluded from the output. This is the default.<br>Unchecked—Rows that h ave only zero feature count s will not be excluded from the output. | Boolean |
| Output Format<br>(Optional) | Specifies the format of the output.<br>CSV—The output file will be a .csv file. This is the default.<br>Table—The output file will be a geodatabase table. | String |
| Output File (Optional) | The output .csv file that contains the feature count data product . | File |
| Output Table (Optional) | The output geodatabase table that contains the feature count data product . | Table |

#### Python
arcpy.locref.GenerateLRSFeatureCount(in_route_features, effective_date, {summary_fields}, {feature_count_layers}, {exclude_null_summary_rows}, {output_format}, {out_file}, {out_table})

| Name | Explanation | Data Type |
| --- | --- | --- |
| in_route_features | Same as above | Feature Layer |
| effective_date | Same as above | Date |
| summary _fields<br>(Optional) | Same as above | Value Table |
| feature_count_layers<br>(Optional) | Same as above | Value Table |
| exclude_null_summary_rows (Optional) | Specifies whether null summary rows will be excluded from the output.<br>EXCLUDE— Rows with only a zero feature count will be excluded from the output. This is the default.<br>DO_NOT_EXCLUDE—Rows with only a zero feature count will not be excluded from the output. | Boolean |
| output_format<br>(Optional) | Specifies the format of the output file.<br>CSV—The output file will be a .csv file. This is the default.<br>TABLE—The output file will be a geodatabase table. | String |
| out_file<br>(Optional) | Same as above | File |
| out_table<br>(Optional) | Same as above | Table |

#### Code sample
GenerateLrsFeatureCount example 1 (Python window)

See https://esriis.sharepoint.com/:u:/r/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6749_GenerateFeatureCountGP/GenerateLRSFeatureCount_ex1.py?csf=1&web=1&e=TrdAlc GenerateLRSFeatureCount_ex1

GenerateLrsFeatureCount example 2 (stand-alone script)
See https://esriis.sharepoint.com/:u:/r/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6749_GenerateFeatureCountGP/GenerateLRSFeatureCount_ex2.py?csf=1&web=1&e=67hXCl GenerateLRSFeatureCount_ex2

GenerateLrsFeatureCount example 3 (stand-alone script)
See https://esriis.sharepoint.com/:u:/r/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6749_GenerateFeatureCountGP/GenerateLRSFeatureCount_ex3.py?csf=1&web=1&e=mwqxNM GenerateLRSFeatureCount_ex3

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
