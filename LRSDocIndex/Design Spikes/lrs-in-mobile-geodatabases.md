# Spike: LRS in Mobile Geodatabases

| Field | Value |
| --- | --- |
| **Doc** | 390 · Design Spike · Enterprise |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike LRSinMobileGDB.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20LRSinMobileGDB.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2024-03-27 18:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | mobile geodatabase · utility network · lrs controller dataset · append routes · append events · generate calibration points · generate routes · generate events |
| **Tools** | — |

## Summary

This spike investigates the compatibility of Linear Referencing System (LRS) functionality within mobile geodatabases, focusing on creating, importing, exporting, and maintaining LRS data. It aims to identify any operational limitations, particularly related to the LRS controller dataset, and report on whether LRS works effectively with mobile geodatabases.

## Related documents

<!-- related:begin -->
- [Pipeline Referencing Across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/apr-across-the-arcgis-platform.md>) — similar text 0.06 · same surface <!-- rel:784 s=1.793 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/3147-lr-gp-error-messages.md>) — similar text 0.10 <!-- rel:39 s=1.63 -->
- [Esri Roads and Highways Tutorial](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-rh-tutorial.md>) — similar text 0.04 · same folder <!-- rel:875 s=1.601 -->
- [Migrate Attribute Sets to Map CIM/Service – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5102-migrate-attribute-sets-to-map-cim-service.md>) — similar text 0.05 <!-- rel:562 s=1.461 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-apr-an-introduction-rh-apr-un.md>) — similar text 0.06 · same folder <!-- rel:885 s=1.41 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [calibration point layer](https://www.google.com/search?q=%22calibration%20point%20layer%22+site%3Adoc.esri.com) · [generate calibration points](https://www.google.com/search?q=%22generate%20calibration%20points%22+site%3Adoc.esri.com) · [generate routes](https://www.google.com/search?q=%22generate%20routes%22+site%3Adoc.esri.com) · [generate events](https://www.google.com/search?q=%22generate%20events%22+site%3Adoc.esri.com) · [append events gp](https://www.google.com/search?q=%22append%20events%20gp%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: LRS in Mobile Geodatabases

Spike

## Slide 2 — LRS in mobile geodatabases

- The Utility Network is increasingly pushing partners and users to utilize the mobile geodatabase for the configuration and loading of UN data before moving it to an enterprise geodatabase as it provides better performance, especially for larger datasets (https://pro.arcgis.com/en/pro-app/latest/help/data/geodatabases/manage-mobile-gdb/mobile-geodatabases.htm)
- UDC (a large utility partner) is doing multiple APR-UN implementations and has found the LRS doesn’t work with mobile geodatabases, forcing them to break their work between mobile and file gdbs
- Investigate being able to do the following with an LRS within a mobile geodatabase:
  - Create an LRS, Networks, and Events (from scratch and from existing)
  - Import an LRS (via copy/paste and import XML workspace)
  - Export an LRS to a file/enterprise gdb (via copy/paste and export XML workspace)
  - Maintain/Load an LRS (i.e., load data using Append Routes and Append Events, run Generate Calibration Points, Generate Routes, and Generate Events)
- Document any of the operations that do not work and determine if the lack of support for the LRS controller dataset is the issue
- Deliverable for the spike is to report whether the LRS works with the mobile geodatabase.  If it doesn’t highlight the issue(s) causing the LRS not to work.

## Slide 3 — Assignment

Story Points:
Dev:
