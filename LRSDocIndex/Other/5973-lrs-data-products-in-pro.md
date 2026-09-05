# LRS Data Products in ArcGIS Pro

| Field | Value |
| --- | --- |
| **Doc** | 335 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5973](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5973) |
| **Source** | [5973_LRS_Data_Products.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5973_LRS_Data_Products.docx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2024-08-23 18:44 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | length data product · mileage report · routes · network · template · csv output |
| **Tools** | LRS Data Template · Generate LRS Data Product |

## Summary

Describes the LRS Data Products tools in ArcGIS Pro that convert LRS data into a length data product for mileage reporting. Explains the workflow involving creating a reusable JSON template and generating a CSV length data product from routes in a network. The CSV output can be used with reporting tools in ArcGIS Pro to create detailed mileage reports.

## Related documents

<!-- related:begin -->
- [Pro 3.4 and 11.4 User Acceptance Issues and Documentation Updates](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/504-pro-3-4-and-11-4-user-acceptance-issues-and-documentation.md>) — shared issue ArcGISPro/ps-location-referencing#5973 · gantt link (2 shared) · similar text 0.02 · 1 title word · same surface/folder <!-- rel:194 s=1121.526 -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-products-rh.md>) — similar text 0.69 · 1 title word · same kind/surface <!-- rel:239 s=4.651 -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-products-apr.md>) — similar text 0.68 · 1 title word · same kind/surface <!-- rel:202 s=4.466 -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6979-lrs-data-products.md>) — similar text 0.63 · 1 title word · same kind/surface <!-- rel:125 s=3.803 -->
- [Generate LRS Data Product (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6272-generate-lrs-data-product-lr.md>) — similar text 0.15 · same kind/surface <!-- rel:226 s=2.643 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## LRS dData Pproducts in ArcGIS Pro
LRS Data Products is a suite of tools built on ArcGIS that converts LRS data into a length data product that can be used to create a mileage report.
You need to rRun the following tools need to be run in order to produce a length data product. The general workflow for producing a length data product is as follows:

1. LRS Data Template: Design and create a reusable template that can be used to provide a name and, data source, add filters, and define the summary and length fields.
The template is saved as a JSON file that is shareable.

1. Generate LRS Data Product: Use the template on a set of routes in a Network to produce the length data product in the form of a CSV file.
This CSV file can then be added to a reporting solution of your choice such as the https://pro.arcgis.com/en/pro-app/latest/help/reports/reports-in-arcgis-pro.htmreporting tools in ArcGIS Pro (add this link here: https://pro.arcgis.com/en/pro-app/latest/help/reports/reports-in-arcgis-pro.htmhttps://pro.arcgis.com/en/pro-app/latest/help/reports/reports-in-arcgis-pro.htm) and others to add the totals, summaries, details, header, footer, notes, logos, and more to create a mileage report.
