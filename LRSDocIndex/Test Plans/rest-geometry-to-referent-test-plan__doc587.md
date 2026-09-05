# REST Geometry to Referent Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Server |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#4211](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4211) |
| **Source** | [4211-RESTGeometrytoReferent_TestPlan_V2.xlsx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4211-RESTGeometrytoReferent_TestPlan_V2.xlsx>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `workbookdump` |

<!-- metadata
```yaml
title: "REST Geometry to Referent Test Plan"
source_file: "4211-RESTGeometrytoReferent_TestPlan_V2.xlsx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4211-RESTGeometrytoReferent_TestPlan_V2.xlsx"
doc_id: 587
doc_kind: "Test Plan"
surface: "Server"
doc_revision: "V2"
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: workbookdump
prompt_version: "v2.0.2"
keywords: ["referent", "offset", "route", "coordinate input", "spatial reference", "temporal view date", "search tolerance"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#4211"]
related: [{"doc":563,"file":"test-plan-for-rest-referent-to-geometry__doc563.md","s":4.359},{"doc":608,"file":"rest-geometry-to-referent-user-story__doc608.md","s":3.548},{"doc":614,"file":"rest-referent-to-geometry__doc614.md","s":3.412},{"doc":588,"file":"test-plan-for-rest-referent-to-geometry-in-linear-referencing__doc588.md","s":3.369},{"doc":456,"file":"exb-search-by-referent-test-plan__doc456.md","s":3.006}]
```
-->

## Summary

Test plan for the REST endpoint converting geometry to referent and offset values. It includes parameter definitions, positive test cases covering various route and coordinate inputs, and negative test cases for invalid inputs and error conditions.

## Related documents

<!-- related:begin -->
- [Test Plan for REST Referent To Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/test-plan-for-rest-referent-to-geometry__doc563.md>) — similar text 0.23 · 3 title words · same kind/surface/folder <!-- rel:563 -->
- [REST: Geometry to Referent User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-geometry-to-referent-user-story__doc608.md>) — similar text 0.21 · 3 title words · 1 filename word · same surface <!-- rel:608 -->
- [REST: Referent to Geometry](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/rest-referent-to-geometry__doc614.md>) — similar text 0.16 · 3 title words · 1 filename word · same surface <!-- rel:614 -->
- [Test Plan for REST Referent To Geometry in Linear Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/test-plan-for-rest-referent-to-geometry-in-linear-referencing__doc588.md>) — similar text 0.19 · 3 title words · same kind/folder <!-- rel:588 -->
- [ExB Search By Referent – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/exb-search-by-referent-test-plan__doc456.md>) — similar text 0.12 · 1 title word · 1 filename word · same kind/folder <!-- rel:456 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html)
<!-- docs:end -->

---

## Sheet: Parameters
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

## Sheet: Positive
| Test Case | Description | Graphic | Input | Response |
| --- | --- | --- | --- | --- |
| 1 | Normal route, coordinate input. Positive offset | 111 |  | "offsetUnit"  :  "esriMiles", "distanceUnit"  :  "esriMiles", "spatialReference"  :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"   :  "1", "offset"  :  5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"… |
| 2 | Normal route, coordinate input. Negative offset | 95 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 3 | Normal route, coordinate input. 0 offset | 95 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "objectId"  :  "1", "offset"  :  0, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1>, "y"  :  <y1>,… |
| 4 | Normal route, coordinates and route and measure input.  Ignore route and measure, negative offset | 96 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"  :  "1", "offset"  :  -4, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :… |
| 5 | Normal route, coordinate and route input.  Restrict results to input route, positve offset | 97 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :   "status"  :  "esriLocatingOK", "results"  :  "routeId"  :  "R1",  "objectId"  :  "1", "offset"  :  5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :… |
| 6 | Normal route, coordinate input. Results found on 2 routes, positve and negative offsets | 95 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId" :   "R1", "objectId"  :  "1", "offset"  :  5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 7 | Normal route, one input location with multiple offsets found | 95 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status" :  "esriLocatingOK", "results"  :   "routeId" :   "R1", "objectId"  :  "1" "offset" :  5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x… |
| 8 | Normal route, route and measure input.  Closest selection method, positve offset | 98 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "objectId"  :  "2", "offset"  :  2, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1>, "y"  :  <y1>,… |
| 9 | Normal route, route and measure input.  Nearest Upstream selection method, positive offset | 99 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId" :   "R1", "objectId"  :  "1", "offset"  :  3, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 10 | Normal route, route and measure input.  Measure input falls in gap (euclidean distance) of route.  No offset found | 100 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" :  "esriLocatingCannotFindLocation" |
| 11 | Normal concurrent routes, coordinate input.  Offset layer is a nonLRS point feature class  Numerous offsets found | 101 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" : "esriLocatingOK", "results"  :   "routeId" :   "R6", "objectId"  :  "9", "offset"  :  -4, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <… |
| 12 | Normal concurrent routes, coordinate input.  Offset layer is a LRS point event feature class on R6.  2 offsets found | 101 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" : "esriLocatingOK", "results"  :   "routeId" :   "R6", "objectId"  :  "9", "offset"  :  -4, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <… |
| 13 | Normal concurrent routes, route and coordinate input.  Offset layer is a nonLRS point feature class  2 offsets found | 102 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" : "esriLocatingOK" "results"  :   "routeId" :   "R6", "objectId"  :  "9", "offset"  :  -4 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1… |
| 14 | Line network routes, coordinate input. 2 offsets found | 101 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "L1R1", "objectId"  :  "1", "offset"  :  5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :… |
| 15 | Normal route, coordinate input.  Temporal view date is before time slice of route. (Request is 1/1/2009) | 103 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations" :  "status" :  "esriLocatingCannotFindLocation" |
| 16 | Loop route, coordinate input.  Two offsets found | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 17 | Lollipop route, route and measure input.  1 offset found | 105 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -4 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 18 | Lollipop route, coordinate input.  Two offsets found | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -4 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 19 | Branch route, route and meassure input.  1 offset found | 106 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"  :  "1", "offset"  :  -4.5, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x" … |
| 20 | Branch route, coordinate input. Two offsets found | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -4.5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  … |
| 21 | Alpha route, route and measure input.  One offset found |  | "referentSelectionType" : " " "layerId" :  1", "routeId" :   "R1", "measure"  :  2 | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 22 | Alpha route, coordinate input.  Two offsets found. | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 23 | Vertical route, route and measure input.  Negative offset found | 107 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 24 | Vertical route, coordinate input.  One offset found | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 25 | Loop route, coordinate input with point feature found at intersecting measure of route.  2 offsets found | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 26 | Lollipop route, route and measure input with point feature found at intersecting measure of route.  2 offsets found. | 125 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -3 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 27 | Branch route, coordinate input with input point feature found at intersecting measure of route.  2 offsets found | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  -4.5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  … |
| 28 | Alpha route, route and measure input with input point feature found at intersecting measure of route.  2 offsets found | 125 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  2 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  … |
| 29 | Normal route, coordinate input, different input spatial reference | 108 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "objectId"  :  "1", "offset"  :  5.X, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1>, "y"  :  <y1… |
| 30 | Normal route, coordinate input, different output offset units | 109 |  | "offsetUnit" :  "esriMeters", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "objectId"  :  "1", "offset"  :  8046.72, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  <x1>, "y"  :… |
| 31 | Normal route, coordinate input.  Tolerance is exceeded, no offsets found | 110 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingCannotFindLocation" |
| 32 | Normal route, coordinate input.  No temporal view date specified for route with more than one time slice.  Multiple offsets found | 113 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId"  :  "R1", "objectId"  :  "1", "offset"  :  -5 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  : … |
| 33 | Normal route, coordinate input. Referent offset units are different than parent network (input point is meters, parent network is miles).  1 offset found | 104 |  | "offsetUnit" :  "esriMeters", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingOK", "results"  :   "routeId" :   "R1", "objectId"  :  "1", "offset"  :  8046.72, "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { … |
| 34 | Normal intersecting routes, coordinate input.  1 offset found | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  2 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  … |
| 35 | Normal intersecting route, coordinate input exactly at location of intersection.  2 offsets found | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  0 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  … |
| 36 | Normal intersecting routes, route and measure input exactly at location of intersection.  1 offset found | 125 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "results"  :   "status"  :  "esriLocatingOK", "routeId" :   "R1", "objectId"  :  "1", "offset"  :  0 "distance" : 0, "geometryType" : "esriGeometryPoint", "geometry"  :  { "x"  :  … |
| 37 | Normal route, coordinate input.  nearestUpstream specified, but no point upstream from input location | 104 |  | "offsetUnit" :  "esriMiles", "distanceUnit" :  "esriMiles", "spatialReference" :  { "wkid" :  102100 }, "locations"  :  "status"  :  "esriLocatingCannotFindLocation" |

## Sheet: Negative
| Parameter | Test Case | Input |
| --- | --- | --- |
| locations | 1 | Input layer ID is not a point layer |
| 2 |  | Input layer ID does not exist |
| 3 |  | Input layer ID is invalid, e.g. $, ?, !, etc. |
| 4 |  | Invalid coordinates entered |
| 5 |  | Invalid RouteID entered |
| 6 |  | Invalid measure entered |
| 7 |  | Measure not found on route |
| 8 |  | locations parameter input is empty |
| 9 |  | Input point layer is not found on any routes |
| referentSelectionType | 10 | Invalid input for referentSelectionType |
| 11 |  | nearestUpstream input, but no point upstream |
| outOffsetUnit | 12 | Invalid offset unit entered |
| tolerance | 13 | Invalid tolerance entered |
| temporalViewDate | 14 | Invalid view date entered |
| 15 |  | Input view date is non numeric |
| InSR | 16 | Invalid input spatial reference |
| outSR | 17 | Invalid output spatial reference |
| 18 |  | Input geodatabase version does not exist |
