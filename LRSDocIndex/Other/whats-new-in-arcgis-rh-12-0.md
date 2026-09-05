# What's new in ArcGIS Roads and Highways 12.0

| Field | Value |
| --- | --- |
| **Doc** | 117 · Other · Experience Builder |
| **Product** | Roads & Highways |
| **Release** | 12.0 |
| **Issues** | — |
| **Source** | [What'sNew_12.0.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6801_What%27sNew/What%27sNew_12.0.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2025-09-25 19:05 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · linear referencing service · overlay events · append routes · append events · generate intersections · route dominance · event editing |
| **Tools** | Dynamic Segmentation · Add Line Event · Add Point Event · LRS Event Editor · Overlay Events · Append Routes · Append Events · Generate Intersections |

## Summary

This document details enhancements in the 12.0 release of ArcGIS Roads and Highways, focusing on improvements to ArcGIS Experience Builder widgets such as Dynamic Segmentation and event addition features. It also covers new and updated operations in the Linear Referencing Service REST API, including Overlay Events, Append Routes, Append Events, and Generate Intersections with new parameters for conflict prevention and partial loading.

## Related documents

<!-- related:begin -->
- [What's new in ArcGIS Roads and Highways 12.1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-12-1.md>) — similar text 0.38 · 3 title words · 1 filename word · same kind/surface <!-- rel:56 s=5.409 -->
- [What’s New in ArcGIS Roads and Highways and ArcGIS Pipeline Referencing: November 2025](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-and-arcgis-apr-november-2025.md>) — similar text 0.28 · 3 title words · same kind <!-- rel:112 s=4.645 -->
- [What's new in ArcGIS Roads and Highways 11.5](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-11-5.md>) — similar text 0.40 · 3 title words · 1 filename word · same kind <!-- rel:195 s=4.343 -->
- [Roads and Highways and Pipeline Referencing Enhancements in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/rh-and-apr-enhancements-in-exb.md>) — similar text 0.21 · 2 title words · 1 filename word · same kind/surface <!-- rel:305 s=3.76 -->
- [Roads and Highways and Pipeline Referencing 11.x Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/rh-and-apr-11-x-exb-widgets.md>) — similar text 0.26 · 2 title words · 1 filename word · same kind/surface <!-- rel:397 s=3.524 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [LRS Event Editor](https://www.google.com/search?q=%22LRS%20Event%20Editor%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## What's new in ArcGIS Roads and Highways
The 12.0 release of ArcGIS Roads and Highways includes enhancements to the software and the documentation.

###### Note:
For a complete list of enhancements and issues addressed, visit the product download page.

### ArcGIS Experience Builder

### The following enhancements have been made:

- All Location Referencing widgets support express mode.
- Dynamic Segmentation widget:
  - You can run dynamic segmentation by typing a route ID or route name in the widget panel.
  - You can click the Map Interact button to turn on synchronization between the map and the straight line diagram. When enabled, navigating within the map will update the SLD, and vice versa.
  - You can configure a view-only SLD by turning off the Allow editing setting. Turn on this setting to allow users to edit data in the dynamic segmentation table and SLD.
  - The graphical user interface of the SLD view has been improved.
- The Add Line Event and Add Point Event widgets include an option to add events to the dominant route. When this option is enabled, route dominance rules are used to add events to the dominant route where route concurrencies exist.
- The LRS Editor template has been renamed the LRS Event Editor.

### Linear Referencing Service
Visit the REST API developers site to review enhancements at this release.

## Linear Referencing Service
The Overlay Events operation has been added. This operation segments event layers for selected routes where any measures change across the attribute set based on different measures or measure ranges. The result of this operation is a zipped file geodatabase that contains either a table or a feature class.

### The following enhancements have been made:

- The Append Routes operation supports a new parameter, allowPartialLoading, which specifies whether routes with no issues will be appended instead of rolling back the entire transaction.
- The Append Events operation supports a new parameter, bypassConflictPrevention, which specifies whether to bypass route and event locks when appending source event records.
- The Generate Intersections operation supports a new parameter, bypassConflictPrevention, which specifies whether to bypass route locks on intersecting routes when generating intersections.
