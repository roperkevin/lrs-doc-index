# What's new in ArcGIS Roads and Highways 11.5

| Field | Value |
| --- | --- |
| **Doc** | 195 · Other · Server |
| **Product** | Roads & Highways |
| **Release** | 11.5 |
| **Issues** | — |
| **Source** | [What'sNew_11.5.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6394_What%27sNew/What%27sNew_11.5.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2025-03-19 20:28 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | linear referencing service · relocate event · update measures · query attribute set · address layers · rest api |
| **Tools** | — |

## Summary

This document outlines minor enhancements in the 11.5 release of ArcGIS Roads and Highways, focusing on updates to the Linear Referencing Service REST API. Enhancements include new parameters and output formats for operations such as Relocate Event, Update Measures From LRS, Query Attribute Set, and Address Layers.

## Related documents

<!-- related:begin -->
- [What's new in ArcGIS Roads and Highways 12.0](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-12-0.md>) — similar text 0.40 · 3 title words · 1 filename word · same kind <!-- rel:117 s=4.343 -->
- [What's new in ArcGIS Roads and Highways 12.1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-12-1.md>) — similar text 0.36 · 3 title words · 1 filename word · same kind <!-- rel:56 s=4.033 -->
- [Roads and Highways and Pipeline Referencing 11.x Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/rh-and-apr-11-x-exb-widgets.md>) — similar text 0.26 · 2 title words · 1 filename word · same kind <!-- rel:397 s=2.612 -->
- [Esri Roads and Highways and AgileAssets Integration Technical Specification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-rh-and-agileassets-integration-technical-specification.md>) — similar text 0.10 · 2 title words · same kind/surface <!-- rel:810 s=2.573 -->
- [APR/RH LRS Data Products and Location Referencing Toolbox Updates](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/apr-rh-lrs-data-products-and-lr-toolbox-updates.md>) — similar text 0.21 · 1 filename word · same kind/folder <!-- rel:197 s=2.472 -->
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

### The following enhancements have been made:

- The Relocate Event operation has the following enhancements:
  - The eventName parameter value can be an external event configured without a connection file.
  - Two new parameters have been added: eventLocations and eventBehaviors.
  - The outputFormat parameter supports two new formats: JSON and CSV.
- The Update Measures From LRS operation has the following enhancements:
  - Supports updating LRS events and intersections.
  - Four new parameters have been added: routeNameFieldName, toRouteIdFieldName, toRouteNameFieldName, and searchTolerance.
- The Query Attribute Set operation supports a new parameter, addressBlockSplitType, which specifies how address ranges will be updated for each segment of the output.
- The Address Layers operation includes the roadNameFieldName field as part of the JSON response.
