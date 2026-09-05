# LRS Data Products

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Source** | [APR_mainpage.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6271_RouteLog_Data_Product_Template/APR_mainpage.docx>) |
| **Edited** | 2025-03-07 19:05 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "LRS Data Products"
source_file: "APR_mainpage.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6271_RouteLog_Data_Product_Template/APR_mainpage.docx"
doc_id: 202
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-03-07T19:05:31.0809267Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lrs data product", "length data product", "route log data product", "template", "reporting", "routes", "characteristics"]
tools: ["LRS Data Template wizard", "Generate LRS Data Product"]
products: ["Pipeline Referencing"]
issues: []
related: [{"doc":239,"file":"lrs-data-products__doc239.md","s":7.361},{"doc":125,"file":"lrs-data-products__doc125.md","s":5.457},{"doc":335,"file":"lrs-data-products-in-arcgis-pro__doc335.md","s":4.466},{"doc":203,"file":"create-a-template-for-an-lrs-route-log-data-product__doc203.md","s":4.085},{"doc":205,"file":"generate-lrs-data-product-location-referencing__doc205.md","s":2.885}]
```
-->

## Summary

Describes tools in ArcGIS for converting LRS data into data products used for reporting. Covers the workflow of creating reusable templates with the LRS Data Template wizard for length and route log data products, and generating data products using the Generate LRS Data Product tool.

## Related documents

<!-- related:begin -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-products__doc239.md>) — similar text 0.95 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:239 -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-products__doc125.md>) — similar text 0.78 · 1 title word · same kind/surface <!-- rel:125 -->
- [LRS Data Products in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-products-in-arcgis-pro__doc335.md>) — similar text 0.68 · 1 title word · same kind/surface <!-- rel:335 -->
- [Create a template for an LRS route log data product](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/create-a-template-for-an-lrs-route-log-data-product__doc203.md>) — similar text 0.15 · same kind/surface/folder <!-- rel:203 -->
- [Generate LRS Data Product (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-lrs-data-product-location-referencing__doc205.md>) — similar text 0.17 · same kind/surface <!-- rel:205 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html) · [Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html) · [Create a template for an LRS route log data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-route-log-data-product.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html)

_No page matched:_ [LRS Data Template wizard](https://www.google.com/search?q=%22LRS%20Data%20Template%20wizard%22+site%3Adoc.esri.com) · [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

https://prodev.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/lrs-data-products.htmhttps://prodev.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/lrs-data-products.htm

## LRS data products
LRS Data Products is a group of tools built on ArcGIS that converts LRS data into data products that can be used to create reports.
The general workflow to produce a data product is as follows:

- Use the LRS Data Template wizard to design and create a reusable template.
To create an LRS length data product which calculates length of routes based on their characteristics, use Length ( as the product type in the LRS Data Template wizard. You can provide a name and data source, add filters, and define the summary and length fields.
To create an LRS route log data product which provides measure locations for characteristics along the route, use Route Log as the product type in the LRS Data Template wizard. You can provide a name and data source, add filters, and define the route identifier, log, location, and referent fields.
Templates are saved as shareable JSON files.

- Run the Generate LRS Data Product tool to use a template on a set of routes in a network to produce the data product.
The output file can be added to a reporting solution of your choice such as the reporting tools in ArcGIS Pro and others to add the totals, summaries, details, header, footer, notes, logos, and more to create a report.

## LRS data products
LRS Data Products is a group of tools built on ArcGIS that converts LRS data into data products that can be used to create reports.
An LRS length data product calculates length of routes based on their characteristics.
Learn more about creating a template for an LRS length data product
An LRS route log data product provides measure locations for characteristics along the route.
Learn more about creating a template for an LRS route log data product
The general workflow to produce a data product is as follows:

- Use the LRS Data Template wizard to design and create a reusable template.

To create an LRS length data product which calculates length of routes based on their characteristics, use Length  as the product type in the LRS Data Template wizard. You can provide a name and data source, add filters, and define the summary and length fields.
To create an LRS route log data product which provides measure locations for characteristics along the route, use Route Log as the product type in the LRS Data Template wizard. You can provide a name and data source, add filters, and define the route identifier, log, location, and referent fields.
Templates are saved as shareable JSON files.

- Run the Generate LRS Data Product tool to use a template on a set of routes in a network to produce the data product.
The output file can be added to a reporting solution of your choice such as the reporting tools in ArcGIS Pro and others to add the totals, summaries, details, header, footer, notes, logos, and more to create a report.
