# Append Routes: Allow Partial Loading Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#6380](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6380) |
| **Source** | [6380-AppendRouteswithnoIssues_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/6380-AppendRouteswithnoIssues_TestPlanV1.pptx>) |
| **Edited** | 2025-08-19 17:53 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Routes: Allow Partial Loading Test Plan"
source_file: "6380-AppendRouteswithnoIssues_TestPlanV1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/6380-AppendRouteswithnoIssues_TestPlanV1.pptx"
doc_id: 137
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2025-08-19T17:53:30Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["append routes", "partial loading", "route validation", "centerline", "load types", "test plan", "routeid", "line networks"]
tools: ["Append Routes"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#6380"]
related: [{"doc":128,"file":"append-routes-location-referencing__doc128.md","s":1003.647},{"doc":567,"file":"append-routes-load-routes-by-route-name-test-plan__doc567.md","s":4.572},{"doc":165,"file":"append-routes-partial-loading-support__doc165.md","s":4.161},{"doc":549,"file":"append-events-load-events-by-routename-test-plan__doc549.md","s":3.305},{"doc":571,"file":"identify-routes-with-vertex-spacing-issues-test-plan__doc571.md","s":3.26}]
```
-->

## Summary

Test plan for the Append Routes tool enhancement adding an optional parameter to allow partial loading of routes. Covers positive test cases for various load types including Add, Retire by RouteID, and Replace by RouteID across nonline and line networks, with validation of route and centerline conditions. Includes negative test cases for error handling when all routes are invalid.

## Related documents

<!-- related:begin -->
- [Append Routes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/append-routes-location-referencing__doc128.md>) — shared issue ArcGISPro/ps-location-referencing#6380 · similar text 0.13 · 2 title words · 1 filename word · same surface <!-- rel:128 -->
- [Append Routes: Load Routes by Route Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-routes-load-routes-by-route-name-test-plan__doc567.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:567 -->
- [Append Routes Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-partial-loading-support__doc165.md>) — similar text 0.15 · 4 title words · 1 filename word · same surface <!-- rel:165 -->
- [Append Events: Load Events by RouteName Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-load-events-by-routename-test-plan__doc549.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:549 -->
- [Identify Routes with Vertex Spacing Issues – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/identify-routes-with-vertex-spacing-issues-test-plan__doc571.md>) — similar text 0.07 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:571 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Append Routes: Allow Partial Loading

| Positive Tests: GP UI |
| --- |
| New parameter appears at bottom of tool New parameter is optional New parameters is disabled by default Ensure output location for txt file and feature class with invalid routes is noted in output message |

| Notes |
| --- |
| Add a new optional parameter to Append Routes called “Allow partial loading of routes” that appends all valid routes and does not load invalid routes Invalid routes will not create/update centerlines or the CenterlineSequenceTable Parameter works with all Load Types (Add, Retire by RouteID, Replace by RouteID) When parameter is checked, output will include a feature class with invalid routes that were not loaded and a text file noting why the invalid routes did not load When option is disabled, tool will work as it does today Test with RH, APR, UNAPR, PoM, and ADMRH data Test with and without the Consider existing centerlines parameter enabled Test in Pro UI, Python inline/standalone, and Model Builder Test with FGDB, EGDB, and FS data 508 and i18n |

Devtopia Issue

| Positive Tests: Add Load Type: Nonline Networks |
| --- |
| 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 ) 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005, 1/1/2010-1/1/2010, 1/1/2015-1/1/2015 ) 1 route is valid, but 3 routes have To Date < From Date ( 1/1/2015-1/1/2010, 1/1/2010-1/1/2005, 1/1/2005-1/1/2000 ) 1 route is valid, but 3 routes have Null From/To Dates ( Null-Null ) 1 route is valid, but 3 routes have malformed RouteIDs : CA + SHA + SB + 05 = CASHASB 06 OR + JAC + NB + 05 = OL JACNB05 WA + KIN + EB + 15 = WA MIN EB 14 1 route is valid and Consider existing centerlines option is enabled. 5 routes have issues with underlying centerlines: Centerline is longer than route Route is longer than centerline No centerline exists at append route location Overlapping centerline at append route location Centerlines match route in X/Y, but not Z |

## Slide 2

| Positive Tests: Add Load Type: NonLine Networks (Continued) |
| --- |
| 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames ( Route001, Route001, Route001 ) 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames ( Route001, Route001, Route001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 ) 1 route is valid and loaded by RouteName. 3 routes have same RouteName but different RouteID in non-overlapping time slices: 1/1/2000-1/1/2005, RouteID: 001 , RouteName: Route001 1/1/2005-1/1/2010, RouteID: 002 , RouteName: Route001 1/1/2010-1/1/2020, RouteID: 003 , RouteName: Route001 1 route is valid and loaded by RouteName. 3 routes have same RouteID with different RouteNames across non-overlapping time slices: 1/1/2000-1/1/2005, RouteID: 001, RouteName: Route001 1/1/2005-1/1/2010, RouteID: 001, RouteName: Route002 1/1/2010-1/1/2020, RouteID: 001, RouteName: Route003 1 route is valid and loaded by RouteName. 3 routes have Null RouteNames 1 route is valid, but 3 routes have Null RouteIDs 1 route is valid, but 3 routes have 0 length |

| Positive Tests: Add Load Type: Line Networks |
| --- |
| 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 ) 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005, 1/1/2010-1/1/2010, 1/1/2015-1/1/2015 ) 1 route is valid, but 3 routes have To Date < From Date ( 1/1/2015-1/1/2010, 1/1/2010-1/1/2005, 1/1/2005-1/1/2000 ) 1 route is valid, but 3 routes have Null From/To Dates ( Null-Null ) 1 route is valid, but 3 routes have malformed RouteIDs (PoM): SIS + 05 + S + C + L + L = SIS055C RR ALA + 80 + S + C + R + R = SHA 80SCRR HUM + 101 + . + . + L = HUM 299 ..L 1 route is valid, but 3 lines have invalid line order: Null, Null, Null 100, 300, 200 10, 20, 30 |

## Slide 3

| Positive Tests: Add Load Type: Line Networks (Continued) |
| --- |
| 1 route is valid and Consider existing centerlines option is enabled. 6 routes have issues with underlying centerlines: Centerline is longer than route Route is longer than centerline No centerline exists at append route location Overlapping centerline at append route location Centerlines match route in X/Y, but not Z APRGCS – Existing centerline has differing vertex amount than append route 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames ( Route001, Route001, Route001 ) 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames ( Route001, Route001, Route001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 ) 1 route is valid and loaded by RouteName. 3 routes have same RouteName but different RouteID in non-overlapping time slices: 1/1/2000-1/1/2005, RouteID: 001 , RouteName: Route001 1/1/2005-1/1/2010, RouteID: 002 , RouteName: Route001 1/1/2010-1/1/2020, RouteID: 003 , RouteName: Route001 1 route is valid and loaded by RouteName. 3 routes have same RouteID with different RouteNames across non-overlapping time slices: 1/1/2000-1/1/2005, RouteID: 001, RouteName: Route001 1/1/2005-1/1/2010, RouteID: 001, RouteName: Route002 1/1/2010-1/1/2020, RouteID: 001, RouteName: Route003 1 route is valid, 3 routes have 0 length 1 route is valid and loaded by RouteName. 3 routes have Null RouteNames 1 route is valid and loaded. 3 routes have Null RouteIDs 1 route is valid and loaded. 3 routes have same LineID but different LineName across non-overlapping time slices: 1/1/2000-1/1/2005, LineID: 001, LineName: Line1 , RouteID: 001, RouteName: Route1 1/1/2005-1/1/2010, LineID: 001, LineName: Line2 , RouteID: 001, RouteName: Route1 1/1/2010-1/1/2020, LineID: 001, LineName: Line3 , RouteID: 001, RouteName: Route1 1 route is valid and loaded. 3 routes have same LineName but different LineID across non-overlapping time slices: 1/1/2000-1/1/2005, LineID: 001 , LineName: Line1, RouteID: 001, RouteName: Route1 1/1/2005-1/1/2010, LineID: 002 , LineName: Line1, RouteID: 001, RouteName: Route1 1/1/2010-1/1/2020, LineID: 003 , LineName: Line1, RouteID: 001, RouteName: Route1 |

## Slide 4

| Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks |
| --- |
| 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 ) 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005, 1/1/2010-1/1/2010, 1/1/2015-1/1/2015 ) 1 route is valid, but 3 routes have To Date < From Date ( 1/1/2015-1/1/2010, 1/1/2010-1/1/2005, 1/1/2005-1/1/2000 ) 1 route is valid, but 3 routes have Null From/To Dates ( Null-Null ) 1 route is valid, but 3 routes have malformed RouteIDs : CA + SHA + SB + 05 = CASHASB 06 OR + JAC + NB + 05 = OL JACNB05 WA + KIN + EB + 15 = WA MIN EB 14 1 route is valid and Consider existing centerlines option is enabled. 5 routes have issues with underlying centerlines: Centerline is longer than route Route is longer than centerline No centerline exists at append route location Overlapping centerline at append route location Centerlines match route in X/Y, but not Z 1 route is valid, but 3 routes have Null RouteIDs 1 route is valid, but 3 routes have 0 length |

| Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks |
| --- |
| 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 ) 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005, 1/1/2010-1/1/2010, 1/1/2015-1/1/2015 ) 1 route is valid, but 3 routes have To Date < From Date ( 1/1/2015-1/1/2010, 1/1/2010-1/1/2005, 1/1/2005-1/1/2000 ) 1 route is valid, but 3 routes have Null From/To Dates ( Null-Null ) 1 route is valid, but 3 routes have malformed RouteIDs (PoM): SIS + 05 + S + C + L + L = SIS055C RR ALA + 80 + S + C + R + R = SHA 80SCRR HUM + 101 + . + . +L = HUM 299 ..L |

## Slide 5

| Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks (Continued) |
| --- |
| 1 route is valid, but 3 lines have invalid line order: Null, Null, Null 100, 300, 200 10, 20, 30 1 route is valid and Consider existing centerlines option is enabled. 6 routes have issues with underlying centerlines: Centerline is longer than route Route is longer than centerline No centerline exists at append route location Overlapping centerline at append route location Centerlines match route in X/Y, but not Z APRGCS – Existing centerline has differing vertex amount than append route 1 route is valid, 3 routes have 0 length 1 route is valid and loaded. 3 routes have Null RouteIDs 1 route is valid and loaded. 3 routes have same LineID but different LineName across non-overlapping time slices: 1/1/2000-1/1/2005, LineID: 001, LineName: Line1 , RouteID: 001, RouteName: Route1 1/1/2005-1/1/2010, LineID: 001, LineName: Line2 , RouteID: 001, RouteName: Route1 1/1/2010-1/1/2020, LineID: 001, LineName: Line3 , RouteID: 001, RouteName: Route1 1 route is valid and loaded. 3 routes have same LineName but different LineID across non-overlapping time slices: 1/1/2000-1/1/2005, LineID: 001 , LineName: Line1, RouteID: 001, RouteName: Route1 1/1/2005-1/1/2010, LineID: 002 , LineName: Line1, RouteID: 001, RouteName: Route1 1/1/2010-1/1/2020, LineID: 003 , LineName: Line1, RouteID: 001, RouteName: Route1 |

| Negative Tests: Error |
| --- |
| All routes to load are invalid |
