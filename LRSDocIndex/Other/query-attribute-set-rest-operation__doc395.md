# Query Attribute Set REST Operation

|   |   |
| --- | --- |
| **Kind** | Other · Server |
| **Release** | 10.6 |
| **Product** | Utility Network |
| **Source** | [webgis_669_QueryAttributeSetsREST.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/webgis_669_QueryAttributeSetsREST.docx>) |
| **Edited** | 2024-03-25 18:44 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Query Attribute Set REST Operation"
source_file: "webgis_669_QueryAttributeSetsREST.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/webgis_669_QueryAttributeSetsREST.docx"
doc_id: 395
doc_kind: "Other"
surface: "Server"
doc_revision: ""
target_release: "10.6"
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2024-03-25T18:44:11.1503945Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["query attribute set", "rest operation", "event layers", "route", "measure", "attribute set", "feature set", "utility network", "pipeline layer", "address block range"]
tools: []
products: ["Utility Network"]
issues: []
related: [{"doc":470,"file":"64-bit-oid-values-in-rest-operations-test-plan__doc470.md","s":2.34},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":2.249},{"doc":294,"file":"update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md","s":2.075},{"doc":565,"file":"manage-pipeline-referencing-and-a-utility-network-together__doc565.md","s":2.044},{"doc":111,"file":"append-routes__doc111.md","s":1.85}]
```
-->

## Summary

Describes the Query Attribute Set REST operation introduced in version 10.6, which segments event layers for selected routes based on measure changes across attribute sets. The operation returns a feature set including route IDs, measures, and geometry for queried linear event layers or configured utility network pipeline layers.

## Related documents

<!-- related:begin -->
- [64-bit OID Values in REST Operations Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-values-in-rest-operations-test-plan__doc470.md>) — similar text 0.06 · 1 title word · 1 filename word · same surface <!-- rel:470 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.10 · same kind/folder <!-- rel:39 -->
- [Update Address Range via Address Points in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md>) — similar text 0.12 · 2 title words <!-- rel:294 -->
- [Manage Pipeline Referencing and a Utility Network Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-pipeline-referencing-and-a-utility-network-together__doc565.md>) — similar text 0.08 · same kind/folder <!-- rel:565 -->
- [Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-routes__doc111.md>) — similar text 0.16 · same kind/surface <!-- rel:111 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [query attribute set](https://www.google.com/search?q=%22query%20attribute%20set%22+site%3Adoc.esri.com) · [configure utility network feature class](https://www.google.com/search?q=%22configure%20utility%20network%20feature%20class%22+site%3Adoc.esri.com) · [configure address feature classes](https://www.google.com/search?q=%22configure%20address%20feature%20classes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Query Attribute Set

- URL:https://<network-layer-url>/queryAttributeSet
- Version Introduced:10.6

### Description
License:
The ArcGIS Location Referencing license is required to use this resource.
This operation segments event layers for selected routes where any measures change across the attribute set based on different measures or measure ranges. The result of this operation is a feature set that contains the values for the fields included in an attribute set and some additional fields that contain the route ID and measures from the network on which the query is performed. The geometry of each feature is also returned in the feature set.

### Request parameters

| Parameter | Details |
| --- | --- |
| f | Optional parameter to specify the response format. The default response format is html . Values: html \| json |
| locations | Required Description: A list of routes and measure values used to segment event layers. The list can be either all single measures or all measure ranges; it can't mix single measures and measure ranges. Each route can have one or more different measures. If only a routeId is provided, the entire route is returned. Syntax: [ { // syntax of a single measure " routeId " : "<routeId1>", "measure" : <measure1> }, { " routeId " : "<routeId1>", "measure" : <measure2> } ... ] or [ { // syntax of a measure range " routeId " : "<routeId1>", " fromMeasure " : <measure1>, " toMeasure " : <measure2> }, { " routeId " : "<routeId1>", " fromMeasure " : <measure3>, " toMeasure " : <measure4> } ... ] or [ { // syntax to return the entire route " routeId " : "<routeId1>" }, { " routeId " : "<routeId2>" } ... ] |
| attributeSet | Description: An attribute set that contains the linear event layers to query and fields to include in the result. The linear event layer can also be a Utility Network pipeline layer that has been configured as an LRS centerline using the Configure Utility Network Feature Class geoprocessing tool , or an address block range layer that has been configured as an LRS centerline using the Configure Address Feature Classes geoprocessing tool. When the centerline layer is an Address feature, t h e centerline direction is honored in the output. The object ID field for each layer specified will always be included in the results. If a field name already exists across all layers, it is renamed. Syntax: [ { " layerId " : "<layerId1>", "fields" : [ "<field1>", "<field2>", "<field3>", ... ] }, { " layerId " : "<layerId2>", "fields" : [ "<field1>", "<field2>", ... ] }, ... ] |
