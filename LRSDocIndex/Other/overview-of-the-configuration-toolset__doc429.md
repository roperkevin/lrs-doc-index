# Overview of the Configuration Toolset

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#5645](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5645) |
| **Source** | [5645-AddressingConfigGPTool_VariousUpdates_V1.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5645_Configure_Addressing_Feature_Classes/5645-AddressingConfigGPTool_VariousUpdates_V1.docx>) |
| **Edited** | 2024-02-16 23:51 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Overview of the Configuration Toolset"
source_file: "5645-AddressingConfigGPTool_VariousUpdates_V1.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5645_Configure_Addressing_Feature_Classes/5645-AddressingConfigGPTool_VariousUpdates_V1.docx"
doc_id: 429
doc_kind: "Other"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: ""
last_edited: "2024-02-16T23:51:41.3495108Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["configuration toolset", "addressing feature classes", "utility network feature class", "lrs entity", "route concurrencies", "external event", "lookup table", "route dominance rules"]
tools: ["Configure Addressing Feature Classes", "Configure Utility Network Feature Class", "Remove LRS Entity", "Calculate Route Concurrencies", "Configure External Event With LRS", "Configure Lookup Table", "Configure Route Dominance Rules", "Create LRS"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#5645"]
related: [{"doc":427,"file":"configure-addressing-feature-classes-location-referencing__doc427.md","s":1004.716},{"doc":366,"file":"pro-3-3-and-11-3-iteration-issue-tracking__doc366.md","s":1000.6},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":3.586},{"doc":424,"file":"configure-addressing-feature-classes-gp-tool-test-plan__doc424.md","s":3.481},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":3.298}]
```
-->

## Summary

This document provides an overview of the Configuration toolset within the Location Referencing toolbox, detailing tools for creating and modifying LRS, LRS Networks, and LRS events, as well as configuring utility networks for LRS use. It includes descriptions of key tools such as Configure Addressing Feature Classes, Configure Utility Network Feature Class, and Remove LRS Entity, along with licensing requirements and version history for selected tools.

## Related documents

<!-- related:begin -->
- [Configure Addressing Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-addressing-feature-classes-location-referencing__doc427.md>) — shared issue ArcGISPro/ps-location-referencing#5645 · similar text 0.35 · 3 filename words · same kind/surface/folder <!-- rel:427 -->
- [Pro 3.3 and 11.3 Iteration Issue Tracking](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/pro-3-3-and-11-3-iteration-issue-tracking__doc366.md>) — shared issue ArcGISPro/ps-location-referencing#5645 · similar text 0.02 · same surface <!-- rel:366 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.15 · same kind/surface <!-- rel:39 -->
- [Configure Addressing Feature Classes GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/configure-addressing-feature-classes-gp-tool-test-plan__doc424.md>) — similar text 0.24 · 3 filename words · same surface <!-- rel:424 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.22 · same surface <!-- rel:115 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/external-event-registration.html)

_No page matched:_ [Configure Addressing Feature Classes](https://www.google.com/search?q=%22Configure%20Addressing%20Feature%20Classes%22+site%3Adoc.esri.com) · [Configure Utility Network Feature Class](https://www.google.com/search?q=%22Configure%20Utility%20Network%20Feature%20Class%22+site%3Adoc.esri.com) · [Remove LRS Entity](https://www.google.com/search?q=%22Remove%20LRS%20Entity%22+site%3Adoc.esri.com) · [Calculate Route Concurrencies](https://www.google.com/search?q=%22Calculate%20Route%20Concurrencies%22+site%3Adoc.esri.com) · [Configure External Event With LRS](https://www.google.com/search?q=%22Configure%20External%20Event%20With%20LRS%22+site%3Adoc.esri.com) · [Configure Lookup Table](https://www.google.com/search?q=%22Configure%20Lookup%20Table%22+site%3Adoc.esri.com) · [Configure Route Dominance Rules](https://www.google.com/search?q=%22Configure%20Route%20Dominance%20Rules%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

https://prodev.arcgis.com/en/pro-app/latest/tool-reference/location-referencing/an-overview-of-the-configuration-toolset.htmAn overview of the Configuration toolset doc:
The Configuration toolset contains tools that allow you to create and modify an LRS, LRS Networks, and LRS events, as well as configure a utility network for use with an LRS.

| Tool | Description |
| --- | --- |
| Configure Addressing Feature Classes | Configures Address Data Man a gement Solution Address Range and Site Address feature classes for use with a linear referencing system (LRS). |
| Configure Utility Network Feature Class | Configures a Utility Network pipeline feature class for use with a linear referencing system (LRS). |
| Remove LRS Entity | Removes a linear referencing system (LRS) entity from an input geodatabase workspace. |

Location Referencing toolbox licensing doc:

| Toolset/Tool | Basic | Standard | Advanced |
| --- | --- | --- | --- |
| … |  |  |  |
| Configuration toolset |  |  |  |
| Configure Addressing Feature Classes | Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways) | Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways) | Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways) |
| Configure Utility Network Feature Class | Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways) | Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways) | Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways) |
| Remove LRS Entity | Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways) | Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways) | Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways) |
| … |  |  |  |

Location Referencing toolbox history doc:
…
Calculate Route Concurrencies

| Version | Description |
| --- | --- |
| 2.9 | New at this version |

Configure Addressing Feature Classes

| Version | Des cription |
| --- | --- |
| 3.3 | New at this version |

Configure External Event With LRS

| Version | Description |
| --- | --- |
| 2.9 | 2 new parameters added: reverse_rule carto_realign_ rule Parameter extend_rule had new option added: COVER Parameter realign_rule has 2 new options: COVER SNAP |
| 2.8 | New at this version |

Configure Lookup Table

| Version | Description |
| --- | --- |
| 2.4 | New at this version |

…
Branch versioning support doc:

| Geoprocessing Tool | REST connection (branch versioned) | Clinet/server connection (branch versioned) |
| --- | --- | --- |
| … |  |  |
| Configure Route Dominance Rules |  |  |
| Configure Addressing Feature Classes |  |  |
| Configure Utility Network Feature Class |  |  |
| Create LRS |  |  |
| … |  |  |

![image1.png](../media/doc526_image1.png)
