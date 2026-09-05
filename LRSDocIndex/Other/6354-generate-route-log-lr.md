# Generate Route Log (Location Referencing)

| Field | Value |
| --- | --- |
| **Doc** | 150 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6354](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6354) |
| **Source** | [6354_GenerateRouteLogGP.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6354_GenerateRouteLogGP/6354_GenerateRouteLogGP.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-08-08 21:35 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route log · route · referent · location fields · log fields · offset units · temporal view |
| **Tools** | Generate Route Log |

## Summary

Describes a tool that creates a route log data product for routes in an LRS Network without an LRS data template. It supports inputs from file geodatabases, enterprise geodatabases, or feature services and outputs a CSV file or geodatabase table. The document details parameters, usage, and licensing requirements for the tool.

## Related documents

<!-- related:begin -->
- [Generate LRS Data Product (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6272-generate-lrs-data-product-lr.md>) — similar text 0.56 · 1 title word · 3 filename words · same kind/surface <!-- rel:226 s=5.315 -->
- [Generate Route Log Geoprocessing Parameters](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/generate-route-log-gp-parameters.md>) — similar text 0.26 · 3 title words · 2 filename words · same kind/surface <!-- rel:285 s=5.182 -->
- [Generate a route Log including spanning events and centerline – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6240-generate-a-route-log-including-spanning-events.md>) — similar text 0.11 · 3 title words · 2 filename words · same surface <!-- rel:255 s=4.727 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6209-generate-a-route-log-using-the-glrsdp-gp.md>) — similar text 0.11 · 3 title words · 3 filename words · same surface <!-- rel:260 s=4.697 -->
- [Generate Length Summary (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6748-generate-length-summary-lr.md>) — similar text 0.55 · 1 title word · 1 filename word · same kind/surface <!-- rel:158 s=4.572 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS route log data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-route-log-data-product.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html)

_No page matched:_ [Generate Route Log](https://www.google.com/search?q=%22Generate%20Route%20Log%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Generate Route Log (Location Referencing)

### Summary
Creates a route log data product for routes in an LRS Network without an LRS data template.

### Usage

- This tool supports data from a file geodatabase, an enterprise geodatabase (branch versioned connection), or a feature service (published from branch versioned data).
- This tool does not modify the inputs and will create a .csv file or a geodatabase table as the output.
- The Effective Date parameter is used to define the temporal view of the network. Only the routes active on this date will be used to calculate the output.
- The log layers, location layers, and referent layers must be stored in the same geodatabase or feature service and have the same coordinate system as the specified LRS Network.
- The log layer can be an LRS point event feature class, an LRS line event feature class, or an LRS intersection feature class. A centerline feature class can also be used as a log layer when it is configured with the Address Data Management solution or a utility network.
- The location layer must be a polygon feature class.
- The referent layer must be an LRS point event feature class.
- A value of Unclassified will be included in the output location fields for routes that do not overlap with the location layers.
- You can add multiple log and location fields from the same feature class by creating selection layers and specifying each selection layer as either a log field or a location field. For example, if you have an LRS line event feature class, you can create two selection layers—Class A and Class B—and specify each selection layer as a log field.

### Parameters

#### Dialog

| Label | Explanation | Data Type |
| --- | --- | --- |
| Input Route Features | The route features that will be used to gener ate the route log . | Feature Layer |
| Effective Date | The date that will be used to define the temporal view of the network .<br>The default value is today’s date. | Date |
| Log Fields<br>(Optional) | The field(s) used to show event and intersection information in the output.<br>Layer— The feature layer that will be used as the log layer.<br>Field— The field that will participate in the route log. | Value Table |
| Merge Coincident Events<br>(Optional) | Specifies whether coincident line events will be merg ed in the output .<br>Checked— Coincident line events with the same value in the log field will be returned as a single event.<br>Unchecked— Coincident line events with the same value in the log field will not be returned as a single event. This is the default.<br>Also apply line to python | Boolean |
| Location Fields<br>(Optional) | The field(s) used to show the attribut es of the polygon boundaries crossed by the routes .<br>Layer— The feature layer that will be used as the location layer.<br>Field— The field that contains the attribut es of the polygon boundaries crossed by the routes. | Value Table |
| Referent Locat ion (Optional) | The method to calculate the referent offset .<br>None — The referent offset will not be calculated. This is the default.<br>Nearest— The nearest referent feature, upstream or downstream to the route log entry, will be used to calculate the referent offset.<br>Nea r est Upstream— The nearest referent feature upstream of the route log entry will be used to calculate the referent offset. If no upstream referent feature exists, the referent values will be empty. | String |
| Referent Features<br>(Optional) | The feature layer that will be used to calculate the referent offset. | Feature Layer |
| Referent Field (Optional) | The referent field that contains t he attributes of the referent features in the output. | Field |
| Offset Units (Optional) | Specifies the offset units that will be used to calculate the distance between the referent feature and the r oute log entry.<br>Inches (US Survey)—The units will be inches.<br>Feet (US Survey)—The units will be feet.<br>Yards (US Survey)—The units will be yards.<br>Miles (US Survey)—The units will be miles.<br>Nautical Miles (US Survey)—The units will be nautical miles.<br>Statute Miles—The units will be statute miles.<br>Feet (International)—The units will be international feet. This is the default.<br>Millimeters—The units will be millimeters.<br>Centimeters—The units will be centimeters.<br>Meters—The units will be meters.<br>Kilometers—The units will be kilometers.<br>Decimeters—The units will be decimeters. | String |
| Output Format<br>(Optional) | Specifies the format of the output.<br>CSV—The output file will be a .csv file. This is the default.<br>Table—The output file will be a geodatabase table. | String |
| Output File (Optional) | The output .csv file that contains the route log . | File |
| Output Table (Optional) | The output geodatabase table that contains the route log . | Table |

#### Python
arcpy.locref.GenerateRouteLog(in_route_features, effective_date, {log_fields}, {merge_coincident_events}, {location_fields}, {referent_location, {referent_features}, {referent_field}, {offset_units}, {output_format}, {out_file}, {out_table})

| Name | Explanation | Data Type |
| --- | --- | --- |
| in_route_features | Same as above | Feature Layer |
| effective_date | Same as above | Date |
| log_fields | Same as above | Value Table |
| merge_coincident_events | Specifies whether coincident events will be merged in the output.<br>MERGE —Coincident line events with the same value in the log field will be returned as a single event .<br>D O_ NOT_ MERGE —Coincident line events with the same value in the log field will not be returned as a single event. This is the default. | Boolean |
| location_fields | Same as above | Value Table |
| referent_locat ion | The method to calculate the referent offset.<br>NONE —The referent offset will not be calculated. This is the default.<br>NEAREST—The nearest referent feature upstream of the route log entry will be used to calculate the referent offset. If no upstream referent feature exists, the referent values will be empty.<br>NEAREST_UPSTREAM—The nearest referent feature, upstream or downstream to the route log entry, will be used to calculate the referent offset. | String |
| referent_features | Same as above | Feature Layer |
| referent_field | Same as above | Field |
| offset_units | Specifies the offset units that will be used to calculate the distance between the referent feature and the route log entry.<br>INCHES—The units will be inches.<br>FEET—The units will be feet.<br>YARDS—The units will be yards.<br>MILES—The units will be miles.<br>NAUTICAL_MILES—The units will be nautical miles.<br>INTMILES—The units will be statute miles.<br>INTFEET—The units will be international feet. This is the default.<br>MILLIMETERS—The units will be millimeters.<br>CENTIMETERS—The units will be centimeters.<br>METERS—The units will be meters.<br>KILOMETERS—The units will be kilometers.<br>DECIMETERS—The units will be decimeters. | String |
| output_format | Specifies the format of the output file.<br>CSV—The output file will be a .csv file. This is the default.<br>TABLE—The output file will be a geodatabase table. | String |
| out_file | Same as above | File |
| out_table | Same as above | Table |

#### Code sample
GenerateRouteLog example 1 (Python window)
See GenerateRouteLog_ex1.py

GenerateRouteLog example 2 (stand-alone script)
See GenerateRouteLog_ex2.py

GenerateRouteLog example 3 (stand-alone script)
See GenerateRouteLog_ex3.py

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
