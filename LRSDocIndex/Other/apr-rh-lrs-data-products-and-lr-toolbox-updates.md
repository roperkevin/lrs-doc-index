# APR/RH LRS Data Products and Location Referencing Toolbox Updates

| Field | Value |
| --- | --- |
| **Doc** | 197 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [What'sNew_3.5.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6394_What%27sNew/What%27sNew_3.5.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2025-03-16 01:14 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | lrs data product · route log · feature count · external event · address data management · location referencing toolbox · route concurrency · measure update · route name · search tolerance |
| **Tools** | Add Point Event · Add Line Event · Configure External Event Behaviors With LRS · Append Events · Configure Address Feature Classes · Generate LRS Data Product · Overlay Events · Update Measures From LRS |

## Summary

This document describes updates to LRS data products including the renaming of the LRS Data Template wizard to Data Product Designer and new capabilities for creating route log and feature count data products. It also details new and enhanced tools in the Location Referencing toolbox such as configuring external event behaviors without connection files, appending events to dominant routes, and support for updating measures and route attributes.

## Related documents

<!-- related:begin -->
- [APR/RH Integration and Location Referencing Toolbox Updates](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/apr-rh-integration-and-lr-toolbox-updates.md>) — similar text 0.35 · 3 title words · 1 filename word · same kind/surface <!-- rel:121 s=5.522 -->
- [What’s New in ArcGIS Roads and Highways and ArcGIS Pipeline Referencing: November 2025](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-and-arcgis-apr-november-2025.md>) — similar text 0.22 · same kind/surface <!-- rel:112 s=3.223 -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6979-lrs-data-products.md>) — similar text 0.28 · 1 title word · same kind/surface <!-- rel:125 s=3.187 -->
- [Roads and Highways and Pipeline Referencing Enhancements in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/rh-and-apr-enhancements-in-pro.md>) — similar text 0.23 · 1 filename word · same kind/surface <!-- rel:304 s=3.107 -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-products-rh.md>) — similar text 0.26 · 1 title word · same kind/surface <!-- rel:239 s=2.855 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html) · [Create a template for an LRS route log data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-route-log-data-product.html) · [Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html) · [External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/external-event-registration.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Configure External Event Behaviors With LRS](https://www.google.com/search?q=%22Configure%20External%20Event%20Behaviors%20With%20LRS%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Configure Address Feature Classes](https://www.google.com/search?q=%22Configure%20Address%20Feature%20Classes%22+site%3Adoc.esri.com) · [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Update Measures From LRS](https://www.google.com/search?q=%22Update%20Measures%20From%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

APR/RH

- LRS data products:
- The LRS Data Template wizard has been renamed to the Data Product Designer.
- You can create LRS route log data products that provide measure locations for characteristics along the route, or LRS feature count data products that provide the number of line events, point events, and intersections per route.
- The Summarize unclassified values checkbox is available when creating a template for an LRS length data product. This checkbox controls whether routes that do not intersect the summary layers are included in the output.
- The Calculate row and column totals checkbox is available when creating a template for an LRS length data product. Check this checkbox to calculate the total length value for the rows and columns in the data product.
- The Add Point Event  and Add Line Event   tools support adding event features based on an offset from an LRS point event or a non-LRS point feature.
- When adding line events, the Go to next measure upon run option allows you to start your next edit with the end measure of the previous edit. This option can be configured in the Location Referencing options in ArcGIS Pro.
- You can configure external events without a connection file. Similar to external events configured with a connection file, ArcGIS Pipeline Referencing supports pushing the updates from route edits out to this type of external event through the Relocate Event operation.
- Statute (International) Miles is a supported unit of measure.
- You can run the Create LRS in Address Data Management solution script tool to create an LRS in an Address Data Management geodatabase that contains an existing Road Centerline feature class.

Location Referencing toolbox

##### New tools

- Configure External Event Behaviors With LRS—Configures an external event in an LRS without connecting to an external event system.

##### Enhanced tools

- Append Events—The Append events to dominant routes parameter supports appending source event records to the dominant routes, if route concurrency exists.
- Configure Address Feature Classes—The Address Range Road Name Field and Site Address Road Name Field parameters were added.
- Generate LRS Data Product:
- Supports the creation of route log and feature count data products.
- Supports the geodatabase table output format.
- Overlay Events—The Address Block Split Type parameter specifies how address ranges will be updated for each segment of the output.
- Update Measures From LRS:
- Supports updating LRS events and intersections.
- The Route Name Field parameter supports updating the route name field.
- The To Route ID Field and To Route Name Field parameters support features that span routes.
- The Search Tolerance parameter is used to update the route and measure attributes of the input features if they are not coincident with a route.
