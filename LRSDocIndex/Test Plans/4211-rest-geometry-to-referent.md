# REST Geometry to Referent Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 587 · Test Plan · Server |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4211](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4211) |
| **Source** | [4211-RESTGeometrytoReferent_TestPlan_V2.xlsx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4211-RESTGeometrytoReferent_TestPlan_V2.xlsx>) · rev V2 |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane workbookdump · format 3.0 · prompt v2.0.2 |
| **Keywords** | referent · offset · route · coordinate input · spatial reference · temporal view date · search tolerance |
| **Tools** | — |

## Summary

Test plan for the REST endpoint converting geometry to referent and offset values. It includes parameter definitions, positive test cases covering various route and coordinate inputs, and negative test cases for invalid inputs and error conditions.

## Related documents

<!-- related:begin -->
- [Test Plan for REST Referent To Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/for-rest-referent-to-geometry.md>) — similar text 0.23 · 3 title words · same kind/surface/folder <!-- rel:563 s=4.359 -->
- [REST: Geometry to Referent User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-referent.md>) — similar text 0.21 · 3 title words · 1 filename word · same surface <!-- rel:608 s=3.548 -->
- [REST: Referent to Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-referent-to-geometry.md>) — similar text 0.16 · 3 title words · 1 filename word · same surface <!-- rel:614 s=3.412 -->
- [Test Plan for REST Referent To Geometry in Linear Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/for-rest-referent-to-geometry-in-lr.md>) — similar text 0.19 · 3 title words · same kind/folder <!-- rel:588 s=3.369 -->
- [ExB Search By Referent – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/16462-exb-search-by-referent.md>) — similar text 0.12 · 1 title word · 1 filename word · same kind/folder <!-- rel:456 s=3.006 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html)
<!-- docs:end -->

---

## Overview

### Sheet: Parameters

| Parameter | Values |  |
| --- | --- | --- |
| f | html or json |  |
| locations | A required parameter that lists point locations and referent layers to convert to referent and offset values. Point locations can be defined as coordinates or route+measure. |  |
| outOffsetUnit (Optional) | The unit of offset values. |  |
| referentSelectionType | Closest (Select the Closest referent in the layer irrespective of whether it’s upstream or downstream of the location) or Nearest upstream (Select the Closest referent upstream on the route from the location provided). Closest is default |  |
| tolerance (Optional) | Search tolerance. |  |
| temporalViewDate (Optional) | Temporal view date used when locating route features |  |
| inSR (Optional) | The spatial reference of the input geometry. |  |
| outSR (Optional) | The geodatabase version to use for each feature class. |  |
| gdbVersion (Optional) | The geodatabase version to use for each feature class. |  |
|  |  |  |
| General Notes: |  |  |
| Test with APR and RH data |  |  |
| Test with unprojected and projected data.  Test a few of the test cases on a larger scale route in an unprojected environment |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  | Ask Nathan if this endpoint will be included in any other Exp Builder widgets | Add more test cases if needed for Experience Builder use later on |

## Test Cases

### TC-P01 — Normal route, coordinate input. Positive offset <!-- src: S3 · table · 1 -->

- **ID:** 1
- **Expected Result:** "offsetUnit"  :  "esriMiles", "distanceUnit"  :  "esriMiles", "spatialReference"  :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"   :  "1", "offset"  :  5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"…
- **Graphic:** 111

### TC-P02 — Normal route, coordinate input. Negative offset <!-- src: S3 · table · 2 -->

- **ID:** 2
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 95

### TC-P03 — Normal route, coordinate input. 0 offset <!-- src: S3 · table · 3 -->

- **ID:** 3
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "objectId"  :  "1", "offset"  :  0, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1>, "y"  :  <y1>,…
- **Graphic:** 95

### TC-P04 — Normal route, coordinates and route and measure input. Ignore route and measure <!-- src: S3 · table · 4 -->

- **ID:** 4
- **Case:** Normal route, coordinates and route and measure input. Ignore route and measure, negative offset
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"  :  "1", "offset"  :  -4, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :…
- **Graphic:** 96

### TC-P05 — Normal route, coordinate and route input. Restrict results to input route <!-- src: S3 · table · 5 -->

- **ID:** 5
- **Case:** Normal route, coordinate and route input. Restrict results to input route, positve offset
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :   "status"  :  "esriLocatingOK", "results"  :  "routeId"  :  "R1",  "objectId"  :  "1", "offset"  :  5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :…
- **Graphic:** 97

### TC-P06 — Normal route, coordinate input. Results found on 2 routes <!-- src: S3 · table · 6 -->

- **ID:** 6
- **Case:** Normal route, coordinate input. Results found on 2 routes, positve and negative offsets
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId" :   "R1", "objectId"  :  "1", "offset"  :  5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 95

### TC-P07 — Normal route, one input location with multiple offsets found <!-- src: S3 · table · 7 -->

- **ID:** 7
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status" :  "esriLocatingOK", "results"  :   "routeId" :   "R1", "objectId"  :  "1" "offset" :  5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x…
- **Graphic:** 95

### TC-P08 — Normal route, route and measure input. Closest selection method, positve offset <!-- src: S3 · table · 8 -->

- **ID:** 8
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "objectId"  :  "2", "offset"  :  2, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1>, "y"  :  <y1>,…
- **Graphic:** 98

### TC-P09 — Normal route, route and measure input. Nearest Upstream selection method <!-- src: S3 · table · 9 -->

- **ID:** 9
- **Case:** Normal route, route and measure input. Nearest Upstream selection method, positive offset
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId" :   "R1", "objectId"  :  "1", "offset"  :  3, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 99

### TC-P10 — Normal route, route and measure input. Measure input falls in gap <!-- src: S3 · table · 10 -->

- **ID:** 10
- **Case:** Normal route, route and measure input. Measure input falls in gap (euclidean distance) of route. No offset found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" :  "esriLocatingCannotFindLocation"
- **Graphic:** 100

### TC-P11 — Normal concurrent routes (11) <!-- src: S3 · table · 11 -->

- **ID:** 11
- **Case:** Normal concurrent routes, coordinate input. Offset layer is a nonLRS point feature class Numerous offsets found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" : "esriLocatingOK", "results"  :   "routeId" :   "R6", "objectId"  :  "9", "offset"  :  -4, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <…
- **Graphic:** 101

### TC-P12 — Normal concurrent routes (12) <!-- src: S3 · table · 12 -->

- **ID:** 12
- **Case:** Normal concurrent routes, coordinate input. Offset layer is a LRS point event feature class on R6. 2 offsets found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" : "esriLocatingOK", "results"  :   "routeId" :   "R6", "objectId"  :  "9", "offset"  :  -4, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <…
- **Graphic:** 101

### TC-P13 — Normal concurrent routes (13) <!-- src: S3 · table · 13 -->

- **ID:** 13
- **Case:** Normal concurrent routes, route and coordinate input. Offset layer is a nonLRS point feature class 2 offsets found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" : "esriLocatingOK" "results"  :   "routeId" :   "R6", "objectId"  :  "9", "offset"  :  -4 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1…
- **Graphic:** 102

### TC-P14 — Line network routes, coordinate input. 2 offsets found <!-- src: S3 · table · 14 -->

- **ID:** 14
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "L1R1", "objectId"  :  "1", "offset"  :  5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :…
- **Graphic:** 101

### TC-P15 — Normal route, coordinate input. Temporal view date is before time slice <!-- src: S3 · table · 15 -->

- **ID:** 15
- **Case:** Normal route, coordinate input. Temporal view date is before time slice of route. (Request is 1/1/2009)
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" :  "esriLocatingCannotFindLocation"
- **Graphic:** 103

### TC-P16 — Loop route, coordinate input. Two offsets found <!-- src: S3 · table · 16 -->

- **ID:** 16
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 104

### TC-P17 — Lollipop route, route and measure input. 1 offset found <!-- src: S3 · table · 17 -->

- **ID:** 17
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -4 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 105

### TC-P18 — Lollipop route, coordinate input. Two offsets found <!-- src: S3 · table · 18 -->

- **ID:** 18
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -4 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 104

### TC-P19 — Branch route, route and meassure input. 1 offset found <!-- src: S3 · table · 19 -->

- **ID:** 19
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"  :  "1", "offset"  :  -4.5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x" …
- **Graphic:** 106

### TC-P20 — Branch route, coordinate input. Two offsets found <!-- src: S3 · table · 20 -->

- **ID:** 20
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -4.5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  …
- **Graphic:** 104

### TC-P21 — Alpha route, route and measure input. One offset found <!-- src: S3 · table · 21 -->

- **ID:** 21
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Input:** "referentSelectionType" : " " "layerId" :  1", "routeId" :   "R1", "measure"  :  2

### TC-P22 — Alpha route, coordinate input. Two offsets found. <!-- src: S3 · table · 22 -->

- **ID:** 22
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 104

### TC-P23 — Vertical route, route and measure input. Negative offset found <!-- src: S3 · table · 23 -->

- **ID:** 23
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 107

### TC-P24 — Vertical route, coordinate input. One offset found <!-- src: S3 · table · 24 -->

- **ID:** 24
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 104

### TC-P25 — Loop route, coordinate input with point feature found at intersecting measure <!-- src: S3 · table · 25 -->

- **ID:** 25
- **Case:** Loop route, coordinate input with point feature found at intersecting measure of route. 2 offsets found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 104

### TC-P26 — Lollipop route, route and measure input with point feature found at intersecting <!-- src: S3 · table · 26 -->

- **ID:** 26
- **Case:** Lollipop route, route and measure input with point feature found at intersecting measure of route. 2 offsets found.
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -3 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 125

### TC-P27 — Branch route, coordinate input with input point feature found at intersecting <!-- src: S3 · table · 27 -->

- **ID:** 27
- **Case:** Branch route, coordinate input with input point feature found at intersecting measure of route. 2 offsets found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -4.5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  …
- **Graphic:** 104

### TC-P28 — Alpha route, route and measure input with input point feature found <!-- src: S3 · table · 28 -->

- **ID:** 28
- **Case:** Alpha route, route and measure input with input point feature found at intersecting measure of route. 2 offsets found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  2 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  …
- **Graphic:** 125

### TC-P29 — Normal route, coordinate input, different input spatial reference <!-- src: S3 · table · 29 -->

- **ID:** 29
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "objectId"  :  "1", "offset"  :  5.X, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1>, "y"  :  <y1…
- **Graphic:** 108

### TC-P30 — Normal route, coordinate input, different output offset units <!-- src: S3 · table · 30 -->

- **ID:** 30
- **Expected Result:** "offsetUnit" :  "esriMeters", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "objectId"  :  "1", "offset"  :  8046.72, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1>, "y"  :…
- **Graphic:** 109

### TC-P31 — Normal route, coordinate input. Tolerance is exceeded, no offsets found <!-- src: S3 · table · 31 -->

- **ID:** 31
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingCannotFindLocation"
- **Graphic:** 110

### TC-P32 — Normal route, coordinate input. No temporal view date specified for route <!-- src: S3 · table · 32 -->

- **ID:** 32
- **Case:** Normal route, coordinate input. No temporal view date specified for route with more than one time slice. Multiple offsets found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : …
- **Graphic:** 113

### TC-P33 — Normal route, coordinate input. Referent offset units are different than parent <!-- src: S3 · table · 33 -->

- **ID:** 33
- **Case:** Normal route, coordinate input. Referent offset units are different than parent network (input point is meters, parent network is miles). 1 offset found
- **Expected Result:** "offsetUnit" :  "esriMeters", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId" :   "R1", "objectId"  :  "1", "offset"  :  8046.72, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { …
- **Graphic:** 104

### TC-P34 — Normal intersecting routes, coordinate input. 1 offset found <!-- src: S3 · table · 34 -->

- **ID:** 34
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  2 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  …
- **Graphic:** 104

### TC-P35 — Normal intersecting route <!-- src: S3 · table · 35 -->

- **ID:** 35
- **Case:** Normal intersecting route, coordinate input exactly at location of intersection. 2 offsets found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  0 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  …
- **Graphic:** 104

### TC-P36 — Normal intersecting routes <!-- src: S3 · table · 36 -->

- **ID:** 36
- **Case:** Normal intersecting routes, route and measure input exactly at location of intersection. 1 offset found
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  0 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  …
- **Graphic:** 125

### TC-P37 — Normal route, coordinate input. nearestUpstream specified <!-- src: S3 · table · 37 -->

- **ID:** 37
- **Case:** Normal route, coordinate input. nearestUpstream specified, but no point upstream from input location
- **Expected Result:** "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingCannotFindLocation"
- **Graphic:** 104

### TC-N01 — Input layer ID is not a point layer: locations <!-- src: S3 · table · 1 -->

- **ID:** 1

### TC-N02 — Input layer ID does not exist: 2 <!-- src: S3 · table · row 2 -->

### TC-N03 — Input layer ID is invalid, e.g. $, ?, !, etc.: 3 <!-- src: S3 · table · row 3 -->

### TC-N04 — Invalid coordinates entered: 4 <!-- src: S3 · table · row 4 -->

### TC-N05 — Invalid RouteID entered: 5 <!-- src: S3 · table · row 5 -->

### TC-N06 — Invalid measure entered: 6 <!-- src: S3 · table · row 6 -->

### TC-N07 — Measure not found on route: 7 <!-- src: S3 · table · row 7 -->

### TC-N08 — locations parameter input is empty: 8 <!-- src: S3 · table · row 8 -->

### TC-N09 — Input point layer is not found on any routes: 9 <!-- src: S3 · table · row 9 -->

### TC-N10 — Invalid input for referentSelectionType: referentSelectionType <!-- src: S3 · table · 10 -->

- **ID:** 10

### TC-N11 — nearestUpstream input, but no point upstream: 11 <!-- src: S3 · table · row 11 -->

### TC-N12 — Invalid offset unit entered: outOffsetUnit <!-- src: S3 · table · 12 -->

- **ID:** 12

### TC-N13 — Invalid tolerance entered: tolerance <!-- src: S3 · table · 13 -->

- **ID:** 13

### TC-N14 — Invalid view date entered: temporalViewDate <!-- src: S3 · table · 14 -->

- **ID:** 14

### TC-N15 — Input view date is non numeric: 15 <!-- src: S3 · table · row 15 -->

### TC-N16 — Invalid input spatial reference: InSR <!-- src: S3 · table · 16 -->

- **ID:** 16

### TC-N17 — Invalid output spatial reference: outSR <!-- src: S3 · table · 17 -->

- **ID:** 17

### TC-N18 — Input geodatabase version does not exist: 18 <!-- src: S3 · table · row 18 -->
