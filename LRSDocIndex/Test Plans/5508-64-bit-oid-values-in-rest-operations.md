# 64-bit OID Values in REST Operations Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 470 · Test Plan · Server |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5508](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5508) |
| **Source** | [5508-64BitOIDValuesinREST_TestPlanV2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5508-64BitOIDValuesinREST_TestPlanV2.pptx>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev Devtopia Issue |
| **Edited** | 2023-11-01 21:28 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | 64 bit oid · rest operations · positive tests · event · route · geometry · centerline sequence table |
| **Tools** | centerlineSequenceTable · checkEvents · exportNetwork · geometryToMeasure · geometryToReferent · geometryToStation · measureToGeometry · queryAttributeSet · queryEditLog · queryLookupTable · queryRouteAssociations · referentToGeometry · relocateEvent · stationToGeometry · translate |

## Summary

Test plan for supporting 64-bit OID values in REST operations for LRS datasets with more than 2.1 billion records. Covers positive test cases for multiple REST endpoints including exportNetwork, geometryToMeasure, geometryToReferent, geometryToStation, checkEvents, measureToGeometry, centerlineSequenceTable, queryAttributeSet, queryEditLog, queryLookupTable, queryRouteAssociations, referentToGeometry, relocateEvent, stationToGeometry, and translate. Ensures schema elements impacted by REST operations support 64-bit OID values.

## Related documents

<!-- related:begin -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1.md>) — similar text 0.14 · same kind <!-- rel:115 s=6.042 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5013-64-bit-oid-support-for-route-editing-tools.md>) — similar text 0.36 · 2 title words · 1 filename word · same kind/folder <!-- rel:483 s=4.506 -->
- [64 bit OID GP Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5509-64-bit-oid-gp.md>) — similar text 0.18 · 2 title words · 1 filename word · same kind/folder <!-- rel:467 s=4.391 -->
- [64-bit OID in LRS REST operations](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/64-bit-oid-in-lrs-rest-operations.md>) — similar text 0.21 · 4 title words · 1 filename word · same surface <!-- rel:503 s=3.937 -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5510-64-bit-oid-other-pro-lr-tools.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/folder <!-- rel:482 s=3.829 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-centerline-sequence-table-properties.html)

_No page matched:_ [centerlineSequenceTable](https://www.google.com/search?q=%22centerlineSequenceTable%22+site%3Adoc.esri.com) · [checkEvents](https://www.google.com/search?q=%22checkEvents%22+site%3Adoc.esri.com) · [exportNetwork](https://www.google.com/search?q=%22exportNetwork%22+site%3Adoc.esri.com) · [geometryToMeasure](https://www.google.com/search?q=%22geometryToMeasure%22+site%3Adoc.esri.com) · [geometryToReferent](https://www.google.com/search?q=%22geometryToReferent%22+site%3Adoc.esri.com) · [geometryToStation](https://www.google.com/search?q=%22geometryToStation%22+site%3Adoc.esri.com) · [queryAttributeSet](https://www.google.com/search?q=%22queryAttributeSet%22+site%3Adoc.esri.com) · [queryEditLog](https://www.google.com/search?q=%22queryEditLog%22+site%3Adoc.esri.com) · [queryLookupTable](https://www.google.com/search?q=%22queryLookupTable%22+site%3Adoc.esri.com) · [queryRouteAssociations](https://www.google.com/search?q=%22queryRouteAssociations%22+site%3Adoc.esri.com) · [relocateEvent](https://www.google.com/search?q=%22relocateEvent%22+site%3Adoc.esri.com) · [stationToGeometry](https://www.google.com/search?q=%22stationToGeometry%22+site%3Adoc.esri.com) +1
<!-- docs:end -->

---

## Overview

### Slide 1 — Devtopia Issue <!-- slide 1 -->

64-bit OID Values in REST Operations

**Notes**
- Need to support actual 64-bit values in OID fields for users who have more than 2.1 billion records in their LRS
- Test on mix of line and non-line networks, including PoM (where applicable).
- Test on a mix of point, line, and spanning line events
- Test with FS only
- For testing, we will have OID values greater than 2.1 billion. The creation of 2.1 billion records is not necessary as we can edit the geodatabase properties to force values above 2.1 billion
- Ensure all schema elements in the LRS impacted by REST operations also have 64-bit OID values
- applyEdits is not necessary to test since it was/will be covered in the other 64-bit OID support user stories
- Test each REST endpoint 2-3, test breadth not depth. Tools to test:
- centerlineSequenceTable
- checkEvents
- exportNetwork
- geometryToMeasure
- geometryToReferent
- geometryToStation
- measureToGeometry
- queryAttributeSet
- queryEditLog
- queryLookupTable
- queryRouteAssociations
- referentToGeometry
- relocateEvent
- stationToGeometry
- translate
- Ensure related schema has 64-bit OID values:
- Centerline Sequence Table
- Centerlines
- Calibration Points
- Network Feature Classes
- Event Feature Classes
- Edit Log
- Locks Table
- Conflict Prevention

## Test Cases

### TC-P01 — No route edits since last invoked <!-- src: S4 · slide 2 · Positive Tests: exportNetwork · 1 -->

- **Group:** ExportNetwork

### TC-P02 — Multiple route edits since last invoked <!-- src: S4 · slide 2 · Positive Tests: exportNetwork · 2 -->

- **Group:** ExportNetwork

### TC-P03 — Input geometry returns one location found on a route <!-- src: S4 · slide 2 · Positive Tests: geometryToMeasure · 1 -->

- **Group:** GeometryToMeasure

### TC-P04 — Multiple input geometries return one location found on respective routes <!-- src: S4 · slide 2 · Positive Tests: geometryToMeasure · 2 -->

- **Group:** GeometryToMeasure

### TC-P05 — Input geometry returns locations found on multiple routes <!-- src: S4 · slide 2 · Positive Tests: geometryToMeasure · 3 -->

- **Group:** GeometryToMeasure

### TC-P06 — Input geometry returns a route an offset value from input referent layer <!-- src: S4 · slide 2 · Positive Tests: geometryToReferent · 1 -->

- **Group:** GeometryToReferent

### TC-P07 — Input route and measure returns a route and 2 equidistant offset values from <!-- src: S4 · slide 2 · Positive Tests: geometryToReferent · 2 -->

- **Group:** GeometryToReferent
- **Case:** Input route and measure returns a route and 2 equidistant offset values from input referent layer

### TC-P08 — Input route and measure returns an offset value from non-LRS input referent <!-- src: S4 · slide 2 · Positive Tests: geometryToReferent · 3 -->

- **Group:** GeometryToReferent
- **Case:** Input route and measure returns an offset value from non-LRS input referent layer

### TC-P09 — Input geometry returns a route and station value <!-- src: S4 · slide 2 · Positive Tests: geometryToStation · 1 -->

- **Group:** GeometryToStation

### TC-P10 — Input geometry and route returns a route and station value <!-- src: S4 · slide 2 · Positive Tests: geometryToStation · 2 -->

- **Group:** GeometryToStation

### TC-P11 — Events have gaps <!-- src: S4 · slide 2 · Positive Tests: checkEvents · 1 -->

- **Group:** CheckEvents

### TC-P12 — Events overlap <!-- src: S4 · slide 2 · Positive Tests: checkEvents · 2 -->

- **Group:** CheckEvents

### TC-P13 — Events have invalid measures <!-- src: S4 · slide 2 · Positive Tests: checkEvents · 3 -->

- **Group:** CheckEvents

### TC-P14 — Input route and single measure returns point geometry <!-- src: S4 · slide 2 · Positive Tests: measureToGeometry · 1 -->

- **Group:** MeasureToGeometry

### TC-P15 — Input route and measure range returns line geometry <!-- src: S4 · slide 2 · Positive Tests: measureToGeometry · 2 -->

- **Group:** MeasureToGeometry

### TC-P16 — Single measure input along a route <!-- src: S4 · slide 2 · Positive Tests: queryAttributeSet · 1 -->

- **Group:** QueryAttributeSet

### TC-P17 — Measure range input along a route <!-- src: S4 · slide 2 · Positive Tests: queryAttributeSet · 2 -->

- **Group:** QueryAttributeSet

### TC-P18 — Whole route input <!-- src: S4 · slide 2 · Positive Tests: queryAttributeSet · 3 -->

- **Group:** QueryAttributeSet

### TC-P19 — Input version has no edits <!-- src: S4 · slide 3 · Positive Tests: queryEditLog · 1 -->

- **Group:** QueryEditLog

### TC-P20 — Input version has multiple edits <!-- src: S4 · slide 3 · Positive Tests: queryEditLog · 2 -->

- **Group:** QueryEditLog

### TC-P21 — Input has no prefix <!-- src: S4 · slide 3 · Positive Tests: queryLookupTable · 1 -->

- **Group:** QueryLookupTable

### TC-P22 — Input has prefix <!-- src: S4 · slide 3 · Positive Tests: queryLookupTable · 2 -->

- **Group:** QueryLookupTable

### TC-P23 — Input centerline with no route associations <!-- src: S4 · slide 3 · Positive Tests: queryRouteAssociations · 1 -->

- **Group:** QueryRouteAssociations

### TC-P24 — Input centerlines with one route association <!-- src: S4 · slide 3 · Positive Tests: queryRouteAssociations · 2 -->

- **Group:** QueryRouteAssociations

### TC-P25 — Input centerlines with multiple route associations <!-- src: S4 · slide 3 · Positive Tests: queryRouteAssociations · 3 -->

- **Group:** QueryRouteAssociations

### TC-P26 — Input single referent returns point geometry <!-- src: S4 · slide 3 · Positive Tests: referentToGeometry · 1 -->

- **Group:** ReferentToGeometry

### TC-P27 — Input referents return line geometry <!-- src: S4 · slide 3 · Positive Tests: referentToGeometry · 2 -->

- **Group:** ReferentToGeometry

### TC-P28 — Multiple inputs of referents return valid geometry <!-- src: S4 · slide 3 · Positive Tests: referentToGeometry · 3 -->

- **Group:** ReferentToGeometry

### TC-P29 — No route edits have taken place that would affect the external event <!-- src: S4 · slide 3 · Positive Tests: relocateEvent · 1 -->

- **Group:** RelocateEvent

### TC-P30 — Route edits have taken place that affect the external event <!-- src: S4 · slide 3 · Positive Tests: relocateEvent · 2 -->

- **Group:** RelocateEvent

### TC-P31 — Input single station returns a point geometry <!-- src: S4 · slide 3 · Positive Tests: stationToGeometry · 1 -->

- **Group:** StationToGeometry

### TC-P32 — Input station range returns a line geometry <!-- src: S4 · slide 3 · Positive Tests: stationToGeometry · 2 -->

- **Group:** StationToGeometry

### TC-P33 — Input station range that spans different routes on a line returns a line <!-- src: S4 · slide 3 · Positive Tests: stationToGeometry · 3 -->

- **Group:** StationToGeometry
- **Case:** Input station range that spans different routes on a line returns a line geometry

### TC-P34 — Input whole route <!-- src: S4 · slide 3 · Positive Tests: translate · 1 -->

- **Group:** Translate

### TC-P35 — Input route and measure <!-- src: S4 · slide 3 · Positive Tests: translate · 2 -->

- **Group:** Translate

### TC-P36 — Input route and measure range <!-- src: S4 · slide 3 · Positive Tests: translate · 3 -->

- **Group:** Translate

### TC-P37 — Input routes and measure range on a line network <!-- src: S4 · slide 3 · Positive Tests: translate · 4 -->

- **Group:** Translate

## Other content

### Slide 2 <!-- slide 2 -->

| Positive Tests: centerlineSequenceTable |
| --- |
| Execute, ensure Centerline Sequence Table returns as output |
