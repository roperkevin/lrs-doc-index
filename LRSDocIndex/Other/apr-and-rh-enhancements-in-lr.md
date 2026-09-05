# Pipeline Referencing and Roads and Highways Enhancements in Location Referencing

| Field | Value |
| --- | --- |
| **Doc** | 58 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [What'sNew_3.7.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/Whats_New/What%27sNew_3.7.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2026-03-27 18:40 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | pipeline referencing · utility network · merge centerlines · lrs intersection · location referencing toolbox · dynamic segmentation · event generation · route log |
| **Tools** | Merge Centerlines · Configure Utility Network Feature Classes · Generate Events · Generate Linear Referenced Route Log · Overlay Events |

## Summary

This document describes enhancements in the integration of ArcGIS Pipeline Referencing with the Utility Network, improvements to the Merge Centerlines tool, and updates to Location Referencing options. It also details new and enhanced tools in the Location Referencing toolbox, including configuration of utility network feature classes and improvements to event generation and overlay events tools.

## Related documents

<!-- related:begin -->
- [What's new in ArcGIS Roads and Highways 12.1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-12-1.md>) — similar text 0.29 · 2 title words · 1 filename word · same kind/folder <!-- rel:56 s=5.351 -->
- [What's New in ArcGIS Roads and Highways and ArcGIS Pipeline Referencing: May 2026](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-and-arcgis-apr-may-2026.md>) — similar text 0.34 · 3 title words · same kind/surface <!-- rel:33 s=5.297 -->
- [APR/RH Integration and Location Referencing Toolbox Updates](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/apr-rh-integration-and-lr-toolbox-updates.md>) — similar text 0.35 · 1 filename word · same kind/surface <!-- rel:121 s=4.354 -->
- [Roads and Highways and Pipeline Referencing Enhancements in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/rh-and-apr-enhancements-in-pro.md>) — similar text 0.17 · 4 title words · 1 filename word · same kind/surface <!-- rel:304 s=4.273 -->
- [What’s New in ArcGIS Roads and Highways and ArcGIS Pipeline Referencing: November 2025](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-and-arcgis-apr-november-2025.md>) — similar text 0.20 · 3 title words · same kind/surface <!-- rel:112 s=3.844 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Create a template for an LRS route log data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-route-log-data-product.html)

_No page matched:_ [Configure Utility Network Feature Classes](https://www.google.com/search?q=%22Configure%20Utility%20Network%20Feature%20Classes%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com) · [Generate Linear Referenced Route Log](https://www.google.com/search?q=%22Generate%20Linear%20Referenced%20Route%20Log%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Pipeline Referencing

- The integration between ArcGIS Pipeline Referencing and ArcGIS Utility Network was enhanced in the following ways:
  - You can verify which fields from the Pipeline Device and Pipeline Junction feature classes are configured with a utility network in the utility network feature class properties.
  - In the LRS Hierarchy pane, the Utility Network node contains the Pipeline Line, Pipeline Device, and Pipeline Junction feature classes.
- The Merge Centerlines tool reduces segmentation by merging centerlines that belong to a common route.
- When designing an LRS route log data template, an LRS intersection feature class can be used as a referent layer.
- Location Referencing options:
  - You can set the default method for adding point and line events, as well as for event replacement.
  - You can check the Do not run Generate Intersections tool check box to prevent intersections from being created or updated when running the Process Edits tool.

Roads and Highways

- The Merge Centerlines tool reduces segmentation by merging centerlines that belong to a common route.
- When designing an LRS route log data template, an LRS intersection feature class can be used as a referent layer.
- Location Referencing options:
  - You can set the default method for adding point and line events, as well as for event replacement.
  - You can check the Do not run Generate Intersections tool check box to prevent intersections from being created or updated when running the Process Edits tool.

Location Referencing toolbox

##### New tools

- Configure Utility Network Feature Classes—Configures the ArcGIS Utility Network Pipeline Line, Pipeline Device, and Pipeline Junction feature classes for use with an LRS.

##### Enhanced tools

- Generate Events—The Bypass events with null route ID and measure fields parameter was added to support the modeling of both linear‑referenced and non‑linear‑referenced pipe characteristics within a single event feature class.
- Generate Linear Referenced Route Log—An LRS intersection feature class can be used as an input to the Referent Field parameter.
- Overlay Events:
  - The Pipeline Device and Pipeline Junction feature classes can be used as inputs to the Event Layers parameter for dynamic segmentation.
  - The Parallel Processing Factor environment was added.
  - Performance was improved when running the tool with a combined LRS and Address Data Management dataset.
