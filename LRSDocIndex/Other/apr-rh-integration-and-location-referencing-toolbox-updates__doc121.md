# APR/RH Integration and Location Referencing Toolbox Updates

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [What'sNew_3.6.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6801_What%27sNew/What%27sNew_3.6.docx>) |
| **Edited** | 2025-09-18 17:04 by Kyle Chin |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "APR/RH Integration and Location Referencing Toolbox Updates"
source_file: "What'sNew_3.6.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6801_What%27sNew/What%27sNew_3.6.docx"
doc_id: 121
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Kyle Chin"
last_edited_by: "Kyle Chin"
last_edited: "2025-09-18T17:04:25Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["pipeline referencing", "utility network", "roads and highways", "address data management", "location referencing toolbox", "data products", "conflict prevention locks", "feature service"]
tools: ["Process Edits", "Generate Linear Referenced Feature Count", "Generate Linear Referenced Length Summary", "Generate Linear Referenced Route Log", "Append Events", "Append Routes", "Generate Intersections", "Generate LRS Data Product", "Overlay Events"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":112,"file":"whats-new-in-arcgis-roads-and-highways-and-arcgis-pipeline-referencing-november__doc112.md","s":5.572},{"doc":197,"file":"apr-rh-lrs-data-products-and-location-referencing-toolbox-updates__doc197.md","s":5.522},{"doc":58,"file":"pipeline-referencing-and-roads-and-highways-enhancements-in-location-referencing__doc58.md","s":4.356},{"doc":125,"file":"lrs-data-products__doc125.md","s":4.176},{"doc":304,"file":"roads-and-highways-and-pipeline-referencing-enhancements-in-arcgis-pro__doc304.md","s":3.092}]
```
-->

## Summary

Describes integration features between Pipeline Referencing and ArcGIS Utility Network, and between Roads and Highways and the Address Data Management solution. Details new and enhanced tools in the Location Referencing toolbox, including the Data Products toolset and improvements to Append Events, Append Routes, Generate Intersections, Generate LRS Data Product, and Overlay Events tools.

## Related documents

<!-- related:begin -->
- [What’s New in ArcGIS Roads and Highways and ArcGIS Pipeline Referencing: November 2025](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-roads-and-highways-and-arcgis-pipeline-referencing-november__doc112.md>) — similar text 0.36 · same kind/surface <!-- rel:112 -->
- [APR/RH LRS Data Products and Location Referencing Toolbox Updates](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/apr-rh-lrs-data-products-and-location-referencing-toolbox-updates__doc197.md>) — similar text 0.35 · 3 title words · 1 filename word · same kind/surface <!-- rel:197 -->
- [Pipeline Referencing and Roads and Highways Enhancements in Location Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/pipeline-referencing-and-roads-and-highways-enhancements-in-location-referencing__doc58.md>) — similar text 0.35 · 1 filename word · same kind/surface <!-- rel:58 -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-products__doc125.md>) — similar text 0.30 · same kind/surface <!-- rel:125 -->
- [Roads and Highways and Pipeline Referencing Enhancements in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/roads-and-highways-and-pipeline-referencing-enhancements-in-arcgis-pro__doc304.md>) — similar text 0.19 · 1 filename word · same kind/surface <!-- rel:304 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

_No page matched:_ [Process Edits](https://www.google.com/search?q=%22Process%20Edits%22+site%3Adoc.esri.com) · [Generate Linear Referenced Feature Count](https://www.google.com/search?q=%22Generate%20Linear%20Referenced%20Feature%20Count%22+site%3Adoc.esri.com) · [Generate Linear Referenced Length Summary](https://www.google.com/search?q=%22Generate%20Linear%20Referenced%20Length%20Summary%22+site%3Adoc.esri.com) · [Generate Linear Referenced Route Log](https://www.google.com/search?q=%22Generate%20Linear%20Referenced%20Route%20Log%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com) · [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

APR/RH

- [APR section only] Integration between Pipeline Referencing and ArcGIS Utility Network:
  - In the LRS hierarchy, the LRS Schema node is denoted as LRS Schema (with Utility Network).
  - You can verify which fields are configured with a utility network in the centerline properties.
- [RH section only] Integration between Roads and Highways and the Address Data Management solution:
  - In the LRS hierarchy, the Address Schema node contains the address range and site address point feature classes.
  - You can verify which fields are configured with the Address Data Management solution in the centerline or LRS event properties.
  - You can view the properties of the https://prodev.arcgis.com/en/pro-app/latest/help/production/roads-highways/view-site-address-point-properties.htm site address point feature class.
- The Process Edits tool supports generating intersections when locks are present when the Generate intersections even if there are conflict prevention locks option is checked in the Location Referencing options.

Location Referencing toolbox

##### New tools
A new toolset, Data Products, was added. It contains the following tools:

- Generate Linear Referenced Feature Count—Creates a feature count data product for routes in an LRS Network without an LRS data template.
- Generate Linear Referenced Length Summary—Creates a length data product for routes in an LRS Network without an LRS data template.
- Generate Linear Referenced Route Log—Creates a route log data product for routes in an LRS Network without an LRS data template.

##### Enhanced tools

- Append Events:
  - The Append even if there are conflict prevention locks parameter supports appending events when locks are present.
  - The mapping of the FromDate and ToDate fields is optional for the Load Type parameter's Add option.
- Append Routes—The Allow partial loading of routes parameter supports partial loading of routes, even if certain source routes fail validation.
- Generate Intersections—The Generate intersections even if there are conflict prevention locks parameter supports generating intersections when locks are present.
- Generate LRS Data Product—You can specify more than one Effective Date parameter value to obtain the delta or change in length or feature count between each pair of effective dates.
- Overlay Events—Performance has been improved when running the tool with feature service inputs.
