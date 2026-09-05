# What's new in ArcGIS Roads and Highways 12.1

| Field | Value |
| --- | --- |
| **Doc** | 56 · Other · Experience Builder |
| **Product** | Roads & Highways · Utility Network |
| **Release** | 12.1 |
| **Issues** | — |
| **Source** | [What'sNew_12.1.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/Whats_New/What%27sNew_12.1.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2026-04-03 17:57 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | branch version editing · date filter · dynamic segmentation · linear referencing service · overlay events · pipeline device · pipeline junction · utility network layers · event generation · apply edits · experience builder |
| **Tools** | Branch Version Editing · Date Filter · Add Line Event · Add Point Event · Dynamic Segmentation · LRS Viewer · LRS Event Editor |

## Summary

This document details the new features and enhancements in the 12.1 release of ArcGIS Roads and Highways for Windows and Linux. It covers new widgets and improvements in ArcGIS Experience Builder, including branch version editing, date filtering, and dynamic segmentation integration with oriented imagery. It also describes enhancements to the Linear Referencing Service REST API, such as improved operations for applying edits, generating events, overlay events, and query attribute sets with utility network layers.

## Related documents

<!-- related:begin -->
- [What's new in ArcGIS Roads and Highways 12.0](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-12-0.md>) — similar text 0.38 · 3 title words · 1 filename word · same kind/surface <!-- rel:117 s=5.409 -->
- [Pipeline Referencing and Roads and Highways Enhancements in Location Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/apr-and-rh-enhancements-in-lr.md>) — similar text 0.29 · 2 title words · 1 filename word · same kind/folder <!-- rel:58 s=5.316 -->
- [What's New in ArcGIS Roads and Highways and ArcGIS Pipeline Referencing: May 2026](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-and-arcgis-apr-may-2026.md>) — similar text 0.02 · 3 title words · same kind <!-- rel:33 s=4.088 -->
- [What's new in ArcGIS Roads and Highways 11.5](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-11-5.md>) — similar text 0.36 · 3 title words · 1 filename word · same kind <!-- rel:195 s=4.033 -->
- [Roads and Highways and Pipeline Referencing Enhancements in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/rh-and-apr-enhancements-in-exb.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/surface <!-- rel:305 s=3.898 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)

_No page matched:_ [Branch Version Editing](https://www.google.com/search?q=%22Branch%20Version%20Editing%22+site%3Adoc.esri.com) · [Date Filter](https://www.google.com/search?q=%22Date%20Filter%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [LRS Viewer](https://www.google.com/search?q=%22LRS%20Viewer%22+site%3Adoc.esri.com) · [LRS Event Editor](https://www.google.com/search?q=%22LRS%20Event%20Editor%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## What's new in ArcGIS Roads and Highways
The 12.1 release of ArcGIS Roads and Highways is available for both Windows and Linux, featuring enhancements to the software and documentation.

###### Note:
For a complete list of enhancements and issues addressed, visit the visit the Patches and Updates page.

### ArcGIS Experience Builder

### The following new widgets have been added:

- The Branch Version Editing widget allows end users to manage branch versions and edit branch versioned LRS data with options to save, discard, undo, and redo changes, as well as the ability to reconcile and post data after editing.
- The Date Filter widget allows end users to filter features by choosing a specific date or date range with a calendar tool.

The following enhancements have been made:

- The Add Line Event and Add Point Event widgets support the Coordinate and Location Offset methods for adding events.
- Dynamic Segmentation widget:
  - You can integrate the Dynamic Segmentation widget with the Oriented Imagery Viewer widget to get a comprehensive understanding of the routes and events at a particular location.
  - Intersections are displayed in the straight line diagram.
- The LRS Viewer and LRS Event Editor templates have been revamped to provide a streamlined user interface and improved viewing and editing capabilities.

### Linear Referencing Service
Visit the REST API developers site to review enhancements at this release.

## Linear Referencing Service

### The following enhancements have been made:

- The Apply Edits operation’s edits parameter supports merging two or more centerline features into one while maintaining the underlying network(s) to centerline relationship.
- The Generate Events operation supports a new parameter, bypassEventsWithNullLrsFields, which specifies whether to ignore event records that have null route ID and measure fields.
- Overlay Events:
  - The parallelFactor parameter has been added, which specifies the number or percentage of processes that will be used for the analysis.
  - The Pipeline Device and Pipeline Junction utility network layers can be used as inputs to the attributeSet parameter.
  - Performance has been improved when running the operation with a combined LRS and Address Data Management dataset.
- Query Attribute Set:
  - The Pipeline Device and Pipeline Junction utility network layers can be used as inputs to the attributeSet parameter.
  - Performance has been improved when running the operation with a combined LRS and Address Data Management dataset.
- When running the Utility Network Layer operation, the response includes the Pipeline Device and Pipeline Junction utility network layers.
