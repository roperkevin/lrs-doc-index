# 64-bit OID Values in REST Operations Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Server |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#5508](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5508) |
| **Source** | [5508-64BitOIDValuesinREST_TestPlanV2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5508-64BitOIDValuesinREST_TestPlanV2.pptx>) |
| **Edited** | 2023-11-01 21:28 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "64-bit OID Values in REST Operations Test Plan"
source_file: "5508-64BitOIDValuesinREST_TestPlanV2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5508-64BitOIDValuesinREST_TestPlanV2.pptx"
doc_id: 470
doc_kind: "Test Plan"
surface: "Server"
doc_revision: "V2"
target_release: ""
pe: ""
dev: "Devtopia Issue"
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-11-01T21:28:52Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["64 bit oid", "rest operations", "positive tests", "event", "route", "geometry", "centerline sequence table"]
tools: ["centerlineSequenceTable", "checkEvents", "exportNetwork", "geometryToMeasure", "geometryToReferent", "geometryToStation", "measureToGeometry", "queryAttributeSet", "queryEditLog", "queryLookupTable", "queryRouteAssociations", "referentToGeometry", "relocateEvent", "stationToGeometry", "translate"]
products: []
issues: ["ArcGISPro/ps-location-referencing#5508"]
related: [{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":6.042},{"doc":483,"file":"64-bit-oid-support-for-route-editing-tools__doc483.md","s":4.506},{"doc":467,"file":"64-bit-oid-gp-tools-test-plan__doc467.md","s":4.391},{"doc":503,"file":"64-bit-oid-in-lrs-rest-operations__doc503.md","s":3.937},{"doc":482,"file":"64-bit-oid-other-pro-lr-tools-test-plan__doc482.md","s":3.829}]
```
-->

## Summary

Test plan for supporting 64-bit OID values in REST operations for LRS datasets with more than 2.1 billion records. Covers positive test cases for multiple REST endpoints including exportNetwork, geometryToMeasure, geometryToReferent, geometryToStation, checkEvents, measureToGeometry, centerlineSequenceTable, queryAttributeSet, queryEditLog, queryLookupTable, queryRouteAssociations, referentToGeometry, relocateEvent, stationToGeometry, and translate. Ensures schema elements impacted by REST operations support 64-bit OID values.

## Related documents

<!-- related:begin -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.14 · same kind <!-- rel:115 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-support-for-route-editing-tools__doc483.md>) — similar text 0.36 · 2 title words · 1 filename word · same kind/folder <!-- rel:483 -->
- [64 bit OID GP Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-gp-tools-test-plan__doc467.md>) — similar text 0.18 · 2 title words · 1 filename word · same kind/folder <!-- rel:467 -->
- [64-bit OID in LRS REST operations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest-operations__doc503.md>) — similar text 0.21 · 4 title words · 1 filename word · same surface <!-- rel:503 -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-other-pro-lr-tools-test-plan__doc482.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/folder <!-- rel:482 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-centerline-sequence-table-properties.html)

_No page matched:_ [centerlineSequenceTable](https://www.google.com/search?q=%22centerlineSequenceTable%22+site%3Adoc.esri.com) · [checkEvents](https://www.google.com/search?q=%22checkEvents%22+site%3Adoc.esri.com) · [exportNetwork](https://www.google.com/search?q=%22exportNetwork%22+site%3Adoc.esri.com) · [geometryToMeasure](https://www.google.com/search?q=%22geometryToMeasure%22+site%3Adoc.esri.com) · [geometryToReferent](https://www.google.com/search?q=%22geometryToReferent%22+site%3Adoc.esri.com) · [geometryToStation](https://www.google.com/search?q=%22geometryToStation%22+site%3Adoc.esri.com) · [queryAttributeSet](https://www.google.com/search?q=%22queryAttributeSet%22+site%3Adoc.esri.com) · [queryEditLog](https://www.google.com/search?q=%22queryEditLog%22+site%3Adoc.esri.com) · [queryLookupTable](https://www.google.com/search?q=%22queryLookupTable%22+site%3Adoc.esri.com) · [queryRouteAssociations](https://www.google.com/search?q=%22queryRouteAssociations%22+site%3Adoc.esri.com) · [relocateEvent](https://www.google.com/search?q=%22relocateEvent%22+site%3Adoc.esri.com) · [stationToGeometry](https://www.google.com/search?q=%22stationToGeometry%22+site%3Adoc.esri.com) +1
<!-- docs:end -->

---

## Slide 1

64-bit OID Values in REST Operations

| Notes |
| --- |
| Need to support actual 64-bit values in OID fields for users who have more than 2.1 billion records in their LRS Test on mix of line and non-line networks, including PoM (where applicable). Test on a mix of point, line, and spanning line events Test with FS only For testing, we will have OID values greater than 2.1 billion. The creation of 2.1 billion records is not necessary as we can edit the geodatabase properties to force values above 2.1 billion Ensure all schema elements in the LRS impacted by REST operations also have 64-bit OID values applyEdits is not necessary to test since it was/will be covered in the other 64-bit OID support user stories Test each REST endpoint 2-3, test breadth not depth. Tools to test: centerlineSequenceTable checkEvents exportNetwork geometryToMeasure geometryToReferent geometryToStation measureToGeometry queryAttributeSet queryEditLog queryLookupTable queryRouteAssociations referentToGeometry relocateEvent stationToGeometry translate Ensure related schema has 64-bit OID values: Centerline Sequence Table Centerlines Calibration Points Network Feature Classes Event Feature Classes Edit Log Locks Table Conflict Prevention |

Devtopia Issue

## Slide 2

| Positive Tests: exportNetwork |
| --- |
| No route edits since last invoked Multiple route edits since last invoked |

| Positive Tests: geometryToMeasure |
| --- |
| Input geometry returns one location found on a route Multiple input geometries return one location found on respective routes Input geometry returns locations found on multiple routes |

| Positive Tests: geometryToReferent |
| --- |
| Input geometry returns a route an offset value from input referent layer Input route and measure returns a route and 2 equidistant offset values from input referent layer Input route and measure returns an offset value from non-LRS input referent layer |

| Positive Tests: geometryToStation |
| --- |
| Input geometry returns a route and station value Input geometry and route returns a route and station value |

| Positive Tests: checkEvents |
| --- |
| Events have gaps Events overlap Events have invalid measures |

| Positive Tests: measureToGeometry |
| --- |
| Input route and single measure returns point geometry Input route and measure range returns line geometry |

| Positive Tests: centerlineSequenceTable |
| --- |
| Execute, ensure Centerline Sequence Table returns as output |

| Positive Tests: queryAttributeSet |
| --- |
| Single measure input along a route Measure range input along a route Whole route input |

## Slide 3

| Positive Tests: queryEditLog |
| --- |
| Input version has no edits Input version has multiple edits |

| Positive Tests: queryLookupTable |
| --- |
| Input has no prefix Input has prefix |

| Positive Tests: queryRouteAssociations |
| --- |
| Input centerline with no route associations Input centerlines with one route association Input centerlines with multiple route associations |

| Positive Tests: referentToGeometry |
| --- |
| Input single referent returns point geometry Input referents return line geometry Multiple inputs of referents return valid geometry |

| Positive Tests: relocateEvent |
| --- |
| No route edits have taken place that would affect the external event Route edits have taken place that affect the external event |

| Positive Tests: stationToGeometry |
| --- |
| Input single station returns a point geometry Input station range returns a line geometry Input station range that spans different routes on a line returns a line geometry |

| Positive Tests: translate |
| --- |
| Input whole route Input route and measure Input route and measure range Input routes and measure range on a line network |
