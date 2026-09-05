# What's new in ArcGIS Roads and Highways 11.5

|   |   |
| --- | --- |
| **Kind** | Other · Server |
| **Release** | 11.5 |
| **Product** | Roads & Highways |
| **Source** | [What'sNew_11.5.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6394_What%27sNew/What%27sNew_11.5.docx>) |
| **Edited** | 2025-03-19 20:28 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "What's new in ArcGIS Roads and Highways 11.5"
source_file: "What'sNew_11.5.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6394_What%27sNew/What%27sNew_11.5.docx"
doc_id: 195
doc_kind: "Other"
surface: "Server"
doc_revision: ""
target_release: "11.5"
pe: ""
dev: ""
author: "Kyle Chin"
last_edited_by: ""
last_edited: "2025-03-19T20:28:28.6945541Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["linear referencing service", "relocate event", "update measures", "query attribute set", "address layers", "rest api"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":117,"file":"whats-new-in-arcgis-roads-and-highways-12-0__doc117.md","s":4.343},{"doc":56,"file":"whats-new-in-arcgis-roads-and-highways-12-1__doc56.md","s":4.033},{"doc":397,"file":"roads-and-highways-and-pipeline-referencing-11-x-experience-builder-widgets__doc397.md","s":2.612},{"doc":810,"file":"esri-roads-and-highways-and-agileassets-integration-technical-specification__doc810.md","s":2.573},{"doc":197,"file":"apr-rh-lrs-data-products-and-location-referencing-toolbox-updates__doc197.md","s":2.472}]
```
-->

## Summary

This document outlines minor enhancements in the 11.5 release of ArcGIS Roads and Highways, focusing on updates to the Linear Referencing Service REST API. Enhancements include new parameters and output formats for operations such as Relocate Event, Update Measures From LRS, Query Attribute Set, and Address Layers.

## Related documents

<!-- related:begin -->
- [What's new in ArcGIS Roads and Highways 12.0](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-roads-and-highways-12-0__doc117.md>) — similar text 0.40 · 3 title words · 1 filename word · same kind <!-- rel:117 -->
- [What's new in ArcGIS Roads and Highways 12.1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-roads-and-highways-12-1__doc56.md>) — similar text 0.36 · 3 title words · 1 filename word · same kind <!-- rel:56 -->
- [Roads and Highways and Pipeline Referencing 11.x Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/roads-and-highways-and-pipeline-referencing-11-x-experience-builder-widgets__doc397.md>) — similar text 0.26 · 2 title words · 1 filename word · same kind <!-- rel:397 -->
- [Esri Roads and Highways and AgileAssets Integration Technical Specification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-roads-and-highways-and-agileassets-integration-technical-specification__doc810.md>) — similar text 0.10 · 2 title words · same kind/surface <!-- rel:810 -->
- [APR/RH LRS Data Products and Location Referencing Toolbox Updates](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/apr-rh-lrs-data-products-and-location-referencing-toolbox-updates__doc197.md>) — similar text 0.21 · 1 filename word · same kind/folder <!-- rel:197 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [relocate event operation](https://www.google.com/search?q=%22relocate%20event%20operation%22+site%3Adoc.esri.com) · [query attribute set](https://www.google.com/search?q=%22query%20attribute%20set%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## What's new in ArcGIS Roads and Highways
The 11.5 release of ArcGIS Roads and Highways includes minor enhancements to the software and the documentation.

###### Note:
For a complete list of enhancements and issues addressed, visit the product download page.

### Linear Referencing Service
Visit the REST API developers site to review enhancements at this release.

## Linear Referencing Service

The following enhancements have been made:

- The Relocate Event operation has the following enhancements:
  - The eventName parameter value can be an external event configured without a connection file.
  - Two new parameters have been added: eventLocations and eventBehaviors.
  - The outputFormat parameter supports two new formats: JSON and CSV.
- The Update Measures From LRS operation has the following enhancements:
  - Supports updating LRS events and intersections.
  - Four new parameters have been added: routeNameFieldName, toRouteIdFieldName, toRouteNameFieldName, and searchTolerance.
- The Query Attribute Set operation supports a new parameter, addressBlockSplitType, which specifies how address ranges will be updated for each segment of the output.
- The Address Layers operation includes the roadNameFieldName field as part of the JSON response.
