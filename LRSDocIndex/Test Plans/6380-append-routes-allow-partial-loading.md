# Append Routes: Allow Partial Loading Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 137 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#6380](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6380) |
| **Source** | [6380-AppendRouteswithnoIssues_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/6380-AppendRouteswithnoIssues_TestPlanV1.pptx>) · rev V1 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2025-08-19 17:53 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | append routes · partial loading · route validation · centerline · load types · test plan · routeid · line networks |
| **Tools** | Append Routes |

## Summary

Test plan for the Append Routes tool enhancement adding an optional parameter to allow partial loading of routes. Covers positive test cases for various load types including Add, Retire by RouteID, and Replace by RouteID across nonline and line networks, with validation of route and centerline conditions. Includes negative test cases for error handling when all routes are invalid.

## Related documents

<!-- related:begin -->
- [Append Routes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6380-append-routes-lr.md>) — shared issue ArcGISPro/ps-location-referencing#6380 · similar text 0.13 · 2 title words · 1 filename word · same surface <!-- rel:128 s=1003.647 -->
- [Append Routes: Load Routes by Route Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4855-append-routes-load-routes-by-route-name.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:567 s=4.572 -->
- [Append Routes Partial Loading Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-partial-loading-support.md>) — similar text 0.15 · 4 title words · 1 filename word · same surface <!-- rel:165 s=4.161 -->
- [Append Events: Load Events by RouteName Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5117-append-events-load-events-by-routename.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:549 s=3.305 -->
- [Identify Routes with Vertex Spacing Issues – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/identify-routes-with-vertex-spacing-issues.md>) — similar text 0.07 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:571 s=3.26 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — New parameter appears at bottom of tool <!-- src: S4 · slide 1 · Positive Tests: GP UI · 1 -->

- **Group:** GP UI

### TC-P02 — New parameter is optional <!-- src: S4 · slide 1 · Positive Tests: GP UI · 2 -->

- **Group:** GP UI

### TC-P03 — New parameters is disabled by default <!-- src: S4 · slide 1 · Positive Tests: GP UI · 3 -->

- **Group:** GP UI

### TC-P04 — Ensure output location for txt file and feature class with invalid routes <!-- src: S4 · slide 1 · Positive Tests: GP UI · 4 -->

- **Group:** GP UI
- **Case:** Ensure output location for txt file and feature class with invalid routes is noted in output message

### TC-P05 — 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001 (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 1 -->

- **Group:** Add Load Type: Nonline Networks
- **Case:** 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 )

### TC-P06 — 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001 (2) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 2 -->

- **Group:** Add Load Type: Nonline Networks
- **Case:** 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 )

### TC-P07 — 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005 (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 3 -->

- **Group:** Add Load Type: Nonline Networks
- **Case:** 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005, 1/1/2010-1/1/2010, 1/1/2015-1/1/2015 )

### TC-P08 — 1 route is valid, but 3 routes have To Date ‹ From Date ( 1/1/2015-1/1/2010 (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 4 -->

- **Group:** Add Load Type: Nonline Networks
- **Case:** 1 route is valid, but 3 routes have To Date < From Date ( 1/1/2015-1/1/2010, 1/1/2010-1/1/2005, 1/1/2005-1/1/2000 )

### TC-P09 — 1 route is valid, but 3 routes have Null From/To Dates ( Null-Null ) (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 5 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P10 — 1 route is valid, but 3 routes have malformed RouteIDs (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 6 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P11 — CA + SHA + SB + 05 = CASHASB 06 (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 7 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P12 — OR + JAC + NB + 05 = OL JACNB05 (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 8 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P13 — WA + KIN + EB + 15 = WA MIN EB 14 (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 9 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P14 — 1 route is valid and Consider existing centerlines option is enabled. 5 routes (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 10 -->

- **Group:** Add Load Type: Nonline Networks
- **Case:** 1 route is valid and Consider existing centerlines option is enabled. 5 routes have issues with underlying centerlines

### TC-P15 — Centerline is longer than route (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 11 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P16 — Route is longer than centerline (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 12 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P17 — No centerline exists at append route location (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 13 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P18 — Overlapping centerline at append route location (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 14 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P19 — Centerlines match route in X/Y, but not Z (1) <!-- src: S4 · slide 1 · Positive Tests: Add Load Type: Nonline Networks · 15 -->

- **Group:** Add Load Type: Nonline Networks

### TC-P20 — 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 1 -->

- **Group:** Add Load Type: NonLine Networks (Continued)
- **Case:** 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames ( Route001, Route001, Route001 )

### TC-P21 — 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames (2) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 2 -->

- **Group:** Add Load Type: NonLine Networks (Continued)
- **Case:** 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames ( Route001, Route001, Route001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 )

### TC-P22 — 1 route is valid and loaded by RouteName. 3 routes have same RouteName but (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 3 -->

- **Group:** Add Load Type: NonLine Networks (Continued)
- **Case:** 1 route is valid and loaded by RouteName. 3 routes have same RouteName but different RouteID in non-overlapping time slices

### TC-P23 — 1/1/2000-1/1/2005, RouteID: 001 , RouteName: Route001 (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 4 -->

- **Group:** Add Load Type: NonLine Networks (Continued)

### TC-P24 — 1/1/2005-1/1/2010, RouteID: 002 , RouteName: Route001 (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 5 -->

- **Group:** Add Load Type: NonLine Networks (Continued)

### TC-P25 — 1/1/2010-1/1/2020, RouteID: 003 , RouteName: Route001 (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 6 -->

- **Group:** Add Load Type: NonLine Networks (Continued)

### TC-P26 — 1 route is valid and loaded by RouteName. 3 routes have same RouteID (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 7 -->

- **Group:** Add Load Type: NonLine Networks (Continued)
- **Case:** 1 route is valid and loaded by RouteName. 3 routes have same RouteID with different RouteNames across non-overlapping time slices

### TC-P27 — 1/1/2000-1/1/2005, RouteID: 001, RouteName: Route001 (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 8 -->

- **Group:** Add Load Type: NonLine Networks (Continued)

### TC-P28 — 1/1/2005-1/1/2010, RouteID: 001, RouteName: Route002 (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 9 -->

- **Group:** Add Load Type: NonLine Networks (Continued)

### TC-P29 — 1/1/2010-1/1/2020, RouteID: 001, RouteName: Route003 (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 10 -->

- **Group:** Add Load Type: NonLine Networks (Continued)

### TC-P30 — 1 route is valid and loaded by RouteName. 3 routes have Null RouteNames (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 11 -->

- **Group:** Add Load Type: NonLine Networks (Continued)

### TC-P31 — 1 route is valid, but 3 routes have Null RouteIDs (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 12 -->

- **Group:** Add Load Type: NonLine Networks (Continued)

### TC-P32 — 1 route is valid, but 3 routes have 0 length (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: NonLine Networks (Continued) · 13 -->

- **Group:** Add Load Type: NonLine Networks (Continued)

### TC-P33 — 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001 (3) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 1 -->

- **Group:** Add Load Type: Line Networks
- **Case:** 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 )

### TC-P34 — 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001 (4) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 2 -->

- **Group:** Add Load Type: Line Networks
- **Case:** 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 )

### TC-P35 — 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005 (2) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 3 -->

- **Group:** Add Load Type: Line Networks
- **Case:** 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005, 1/1/2010-1/1/2010, 1/1/2015-1/1/2015 )

### TC-P36 — 1 route is valid, but 3 routes have To Date ‹ From Date ( 1/1/2015-1/1/2010 (2) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 4 -->

- **Group:** Add Load Type: Line Networks
- **Case:** 1 route is valid, but 3 routes have To Date < From Date ( 1/1/2015-1/1/2010, 1/1/2010-1/1/2005, 1/1/2005-1/1/2000 )

### TC-P37 — 1 route is valid, but 3 routes have Null From/To Dates ( Null-Null ) (2) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 5 -->

- **Group:** Add Load Type: Line Networks

### TC-P38 — 1 route is valid, but 3 routes have malformed RouteIDs (PoM) (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 6 -->

- **Group:** Add Load Type: Line Networks

### TC-P39 — SIS + 05 + S + C + L + L = SIS055C RR (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 7 -->

- **Group:** Add Load Type: Line Networks

### TC-P40 — ALA + 80 + S + C + R + R = SHA 80SCRR (1) <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 8 -->

- **Group:** Add Load Type: Line Networks

### TC-P41 — HUM + 101 + . + . + L = HUM 299 ..L <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 9 -->

- **Group:** Add Load Type: Line Networks

### TC-P42 — 1 route is valid, but 3 lines have invalid line order <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 10 -->

- **Group:** Add Load Type: Line Networks

### TC-P43 — Null, Null, Null <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 11 -->

- **Group:** Add Load Type: Line Networks

### TC-P44 — 100, 300, 200 <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 12 -->

- **Group:** Add Load Type: Line Networks

### TC-P45 — 10, 20, 30 <!-- src: S4 · slide 2 · Positive Tests: Add Load Type: Line Networks · 13 -->

- **Group:** Add Load Type: Line Networks

### TC-P46 — 1 route is valid and Consider existing centerlines option is enabled. 6 routes <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 1 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1 route is valid and Consider existing centerlines option is enabled. 6 routes have issues with underlying centerlines

### TC-P47 — Centerline is longer than route (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 2 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P48 — Route is longer than centerline (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 3 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P49 — No centerline exists at append route location (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 4 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P50 — Overlapping centerline at append route location (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 5 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P51 — Centerlines match route in X/Y, but not Z (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 6 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P52 — APRGCS – Existing centerline has differing vertex amount than append route <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 7 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P53 — 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames (3) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 8 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames ( Route001, Route001, Route001 )

### TC-P54 — 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames (4) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 9 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1 route is valid and loaded by RouteName. 3 routes have duplicate RouteNames ( Route001, Route001, Route001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 )

### TC-P55 — 1 route is valid and loaded by RouteName. 3 routes have same RouteName but (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 10 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1 route is valid and loaded by RouteName. 3 routes have same RouteName but different RouteID in non-overlapping time slices

### TC-P56 — 1/1/2000-1/1/2005, RouteID: 001 , RouteName: Route001 (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 11 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P57 — 1/1/2005-1/1/2010, RouteID: 002 , RouteName: Route001 (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 12 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P58 — 1/1/2010-1/1/2020, RouteID: 003 , RouteName: Route001 (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 13 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P59 — 1 route is valid and loaded by RouteName. 3 routes have same RouteID (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 14 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1 route is valid and loaded by RouteName. 3 routes have same RouteID with different RouteNames across non-overlapping time slices

### TC-P60 — 1/1/2000-1/1/2005, RouteID: 001, RouteName: Route001 (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 15 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P61 — 1/1/2005-1/1/2010, RouteID: 001, RouteName: Route002 (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 16 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P62 — 1/1/2010-1/1/2020, RouteID: 001, RouteName: Route003 (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 17 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P63 — 1 route is valid, 3 routes have 0 length <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 18 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P64 — 1 route is valid and loaded by RouteName. 3 routes have Null RouteNames (2) <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 19 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P65 — 1 route is valid and loaded. 3 routes have Null RouteIDs <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 20 -->

- **Group:** Add Load Type: Line Networks (Continued)

### TC-P66 — 1 route is valid and loaded. 3 routes have same LineID but different LineName <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 21 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1 route is valid and loaded. 3 routes have same LineID but different LineName across non-overlapping time slices

### TC-P67 — 1/1/2000-1/1/2005, LineID: 001, LineName: Line1 , RouteID: 001, RouteName <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 22 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1/1/2000-1/1/2005, LineID: 001, LineName: Line1 , RouteID: 001, RouteName: Route1

### TC-P68 — 1/1/2005-1/1/2010, LineID: 001, LineName: Line2 , RouteID: 001, RouteName <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 23 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1/1/2005-1/1/2010, LineID: 001, LineName: Line2 , RouteID: 001, RouteName: Route1

### TC-P69 — 1/1/2010-1/1/2020, LineID: 001, LineName: Line3 , RouteID: 001, RouteName <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 24 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1/1/2010-1/1/2020, LineID: 001, LineName: Line3 , RouteID: 001, RouteName: Route1

### TC-P70 — 1 route is valid and loaded. 3 routes have same LineName but different LineID <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 25 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1 route is valid and loaded. 3 routes have same LineName but different LineID across non-overlapping time slices

### TC-P71 — 1/1/2000-1/1/2005, LineID: 001 , LineName: Line1, RouteID: 001, RouteName <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 26 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1/1/2000-1/1/2005, LineID: 001 , LineName: Line1, RouteID: 001, RouteName: Route1

### TC-P72 — 1/1/2005-1/1/2010, LineID: 002 , LineName: Line1, RouteID: 001, RouteName <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 27 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1/1/2005-1/1/2010, LineID: 002 , LineName: Line1, RouteID: 001, RouteName: Route1

### TC-P73 — 1/1/2010-1/1/2020, LineID: 003 , LineName: Line1, RouteID: 001, RouteName <!-- src: S4 · slide 3 · Positive Tests: Add Load Type: Line Networks (Continued) · 28 -->

- **Group:** Add Load Type: Line Networks (Continued)
- **Case:** 1/1/2010-1/1/2020, LineID: 003 , LineName: Line1, RouteID: 001, RouteName: Route1

### TC-P74 — 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001 (5) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 1 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks
- **Case:** 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 )

### TC-P75 — 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001 (6) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 2 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks
- **Case:** 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 )

### TC-P76 — 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005 (3) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 3 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks
- **Case:** 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005, 1/1/2010-1/1/2010, 1/1/2015-1/1/2015 )

### TC-P77 — 1 route is valid, but 3 routes have To Date ‹ From Date ( 1/1/2015-1/1/2010 (3) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 4 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks
- **Case:** 1 route is valid, but 3 routes have To Date < From Date ( 1/1/2015-1/1/2010, 1/1/2010-1/1/2005, 1/1/2005-1/1/2000 )

### TC-P78 — 1 route is valid, but 3 routes have Null From/To Dates ( Null-Null ) (3) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 5 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P79 — 1 route is valid, but 3 routes have malformed RouteIDs (2) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 6 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P80 — CA + SHA + SB + 05 = CASHASB 06 (2) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 7 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P81 — OR + JAC + NB + 05 = OL JACNB05 (2) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 8 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P82 — WA + KIN + EB + 15 = WA MIN EB 14 (2) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 9 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P83 — 1 route is valid and Consider existing centerlines option is enabled. 5 routes (2) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 10 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks
- **Case:** 1 route is valid and Consider existing centerlines option is enabled. 5 routes have issues with underlying centerlines

### TC-P84 — Centerline is longer than route (3) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 11 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P85 — Route is longer than centerline (3) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 12 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P86 — No centerline exists at append route location (3) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 13 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P87 — Overlapping centerline at append route location (3) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 14 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P88 — Centerlines match route in X/Y, but not Z (3) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 15 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P89 — 1 route is valid, but 3 routes have Null RouteIDs (2) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 16 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P90 — 1 route is valid, but 3 routes have 0 length (2) <!-- src: S4 · slide 4 · Positive Tests: Retire/Replace by RouteID Load Type: Nonline Networks · 17 -->

- **Group:** Retire / Replace by RouteID Load Type: Nonline Networks

### TC-P91 — 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001 (7) <!-- src: S4 · slide 4 · Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks · 1 -->

- **Group:** Add Retire / Replace by RouteID Load Type: Line Networks
- **Case:** 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 )

### TC-P92 — 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001 (8) <!-- src: S4 · slide 4 · Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks · 2 -->

- **Group:** Add Retire / Replace by RouteID Load Type: Line Networks
- **Case:** 1 route is valid, but 3 routes have duplicate RouteIDs ( Route0001, Route0001, Route0001 ) with overlapping time slices ( 1/1/2000-1/1/2005, 1/1/2002-1/1/2006, 1/1/1999-1/1/2010 )

### TC-P93 — 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005 (4) <!-- src: S4 · slide 4 · Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks · 3 -->

- **Group:** Add Retire / Replace by RouteID Load Type: Line Networks
- **Case:** 1 route is valid, but 3 routes have From Date = To Date ( 1/1/2005-1/1/2005, 1/1/2010-1/1/2010, 1/1/2015-1/1/2015 )

### TC-P94 — 1 route is valid, but 3 routes have To Date ‹ From Date ( 1/1/2015-1/1/2010 (4) <!-- src: S4 · slide 4 · Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks · 4 -->

- **Group:** Add Retire / Replace by RouteID Load Type: Line Networks
- **Case:** 1 route is valid, but 3 routes have To Date < From Date ( 1/1/2015-1/1/2010, 1/1/2010-1/1/2005, 1/1/2005-1/1/2000 )

### TC-P95 — 1 route is valid, but 3 routes have Null From/To Dates ( Null-Null ) (4) <!-- src: S4 · slide 4 · Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks · 5 -->

- **Group:** Add Retire / Replace by RouteID Load Type: Line Networks

### TC-P96 — 1 route is valid, but 3 routes have malformed RouteIDs (PoM) (2) <!-- src: S4 · slide 4 · Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks · 6 -->

- **Group:** Add Retire / Replace by RouteID Load Type: Line Networks

### TC-P97 — SIS + 05 + S + C + L + L = SIS055C RR (2) <!-- src: S4 · slide 4 · Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks · 7 -->

- **Group:** Add Retire / Replace by RouteID Load Type: Line Networks

### TC-P98 — ALA + 80 + S + C + R + R = SHA 80SCRR (2) <!-- src: S4 · slide 4 · Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks · 8 -->

- **Group:** Add Retire / Replace by RouteID Load Type: Line Networks

### TC-P99 — HUM + 101 + . + . +L = HUM 299 ..L <!-- src: S4 · slide 4 · Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks · 9 -->

- **Group:** Add Retire / Replace by RouteID Load Type: Line Networks

## Other content

### Slide 1 — Devtopia Issue <!-- slide 1 -->

Append Routes: Allow Partial Loading

**Notes**
- Add a new optional parameter to Append Routes called “Allow partial loading of routes” that appends all valid routes and does not load invalid routes
- Invalid routes will not create/update centerlines or the CenterlineSequenceTable
- Parameter works with all Load Types (Add, Retire by RouteID, Replace by RouteID)
- When parameter is checked, output will include a feature class with invalid routes that were not loaded and a text file noting why the invalid routes did not load
- When option is disabled, tool will work as it does today
- Test with RH, APR, UNAPR, PoM, and ADMRH data
- Test with and without the Consider existing centerlines parameter enabled
- Test in Pro UI, Python inline/standalone, and Model Builder
- Test with FGDB, EGDB, and FS data
- 508 and i18n

### Slide 5 <!-- slide 5 -->

**Positive Tests: Add Retire/Replace by RouteID Load Type: Line Networks (Continued)**
- 1 route is valid, but 3 lines have invalid line order:
- Null, Null, Null
- 100, 300, 200
- 10, 20, 30
- 1 route is valid and Consider existing centerlines option is enabled. 6 routes have issues with underlying centerlines:
- Centerline is longer than route
- Route is longer than centerline
- No centerline exists at append route location
- Overlapping centerline at append route location
- Centerlines match route in X/Y, but not Z
- APRGCS – Existing centerline has differing vertex amount than append route
- 1 route is valid, 3 routes have 0 length
- 1 route is valid and loaded. 3 routes have Null RouteIDs
- 1 route is valid and loaded. 3 routes have same LineID but different LineName across non-overlapping time slices:
- 1/1/2000-1/1/2005, LineID: 001, LineName: Line1 , RouteID: 001, RouteName: Route1
- 1/1/2005-1/1/2010, LineID: 001, LineName: Line2 , RouteID: 001, RouteName: Route1
- 1/1/2010-1/1/2020, LineID: 001, LineName: Line3 , RouteID: 001, RouteName: Route1
- 1 route is valid and loaded. 3 routes have same LineName but different LineID across non-overlapping time slices:
- 1/1/2000-1/1/2005, LineID: 001 , LineName: Line1, RouteID: 001, RouteName: Route1
- 1/1/2005-1/1/2010, LineID: 002 , LineName: Line1, RouteID: 001, RouteName: Route1
- 1/1/2010-1/1/2020, LineID: 003 , LineName: Line1, RouteID: 001, RouteName: Route1

| Negative Tests: Error |
| --- |
| All routes to load are invalid |
