# Spike: LRS in Mobile Geodatabases

|   |   |
| --- | --- |
| **Kind** | Design Spike · Enterprise |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [Spike LRSinMobileGDB.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20LRSinMobileGDB.pptx>) |
| **Edited** | 2024-03-27 18:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: LRS in Mobile Geodatabases"
source_file: "Spike LRSinMobileGDB.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20LRSinMobileGDB.pptx"
doc_id: 390
doc_kind: "Design Spike"
surface: "Enterprise"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2024-03-27T18:43:55Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["mobile geodatabase", "utility network", "lrs controller dataset", "append routes", "append events", "generate calibration points", "generate routes", "generate events"]
tools: []
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":784,"file":"pipeline-referencing-across-the-arcgis-platform__doc784.md","s":1.793},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":1.63},{"doc":875,"file":"esri-roads-and-highways-tutorial__doc875.md","s":1.601},{"doc":562,"file":"migrate-attribute-sets-to-map-cim-service-test-plan__doc562.md","s":1.461},{"doc":885,"file":"arcgis-pipeline-referencing-an-introduction__doc885.md","s":1.41}]
```
-->

## Summary

This spike investigates the compatibility of Linear Referencing System (LRS) functionality within mobile geodatabases, focusing on creating, importing, exporting, and maintaining LRS data. It aims to identify any operational limitations, particularly related to the LRS controller dataset, and report on whether LRS works effectively with mobile geodatabases.

## Related documents

<!-- related:begin -->
- [Pipeline Referencing Across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/pipeline-referencing-across-the-arcgis-platform__doc784.md>) — similar text 0.06 · same surface <!-- rel:784 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.10 <!-- rel:39 -->
- [Esri Roads and Highways Tutorial](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-roads-and-highways-tutorial__doc875.md>) — similar text 0.04 · same folder <!-- rel:875 -->
- [Migrate Attribute Sets to Map CIM/Service – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/migrate-attribute-sets-to-map-cim-service-test-plan__doc562.md>) — similar text 0.05 <!-- rel:562 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-an-introduction__doc885.md>) — similar text 0.06 · same folder <!-- rel:885 -->
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

The Utility Network is increasingly pushing partners and users to utilize the mobile geodatabase for the configuration and loading of UN data before moving it to an enterprise geodatabase as it provides better performance, especially for larger datasets (https://pro.arcgis.com/en/pro-app/latest/help/data/geodatabases/manage-mobile-gdb/mobile-geodatabases.htm)
UDC (a large utility partner) is doing multiple APR-UN implementations and has found the LRS doesn’t work with mobile geodatabases, forcing them to break their work between mobile and file gdbs
Investigate being able to do the following with an LRS within a mobile geodatabase:

  - Create an LRS, Networks, and Events (from scratch and from existing)
  - Import an LRS (via copy/paste and import XML workspace)
  - Export an LRS to a file/enterprise gdb (via copy/paste and export XML workspace)
  - Maintain/Load an LRS (i.e., load data using Append Routes and Append Events, run Generate Calibration Points, Generate Routes, and Generate Events)
Document any of the operations that do not work and determine if the lack of support for the LRS controller dataset is the issue
Deliverable for the spike is to report whether the LRS works with the mobile geodatabase.  If it doesn’t highlight the issue(s) causing the LRS not to work.

## Slide 3 — Assignment

Story Points:
Dev:
