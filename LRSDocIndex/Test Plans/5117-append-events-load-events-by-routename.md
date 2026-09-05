# Append Events: Load Events by RouteName Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 549 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5117](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5117) |
| **Source** | [5117-AppendEventsLoadbyRouteName_TestPlan_V2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5117-AppendEventsLoadbyRouteName_TestPlan_V2.pptx>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2023-06-14 21:36 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | append events · route name · route id · point event · line event · spanning line event · conflict prevention · load events · error handling |
| **Tools** | Append Events |

## Summary

Test plan for loading events by RouteName in the Append Events tool. Covers positive and negative test cases for point, line, and spanning line events with various combinations of RouteName and RouteID populated or missing. Validates conflict prevention, route identifier generation, and error handling.

## Related documents

<!-- related:begin -->
- [Append Routes/Events: Load Routes/Events by Route Name](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/4855-append-routes-events-load-routes-events-by-route-name.md>) — similar text 0.18 · 3 title words · 5 filename words · same surface <!-- rel:579 s=6.217 -->
- [Consider Route Dominance in Append Events (add method) – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/1488-consider-route-dominance-in-append-events-add-method.md>) — similar text 0.21 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:279 s=4.674 -->
- [Allow Append Events to Run When Locks Are Present - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/6640-allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.14 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:156 s=4.464 -->
- [Append Events Date Optional Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-date-optional.md>) — similar text 0.18 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:126 s=4.311 -->
- [Append Routes: Load Routes by Route Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4855-append-routes-load-routes-by-route-name.md>) — similar text 0.18 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:567 s=3.862 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — RouteName not stored, default to load by RouteID (1) <!-- src: S4 · slide 1 · Positive Tests: Point Events · 1 -->

- **Group:** Point Events

### TC-P02 — RouteID populated, Null populated RouteName <!-- src: S4 · slide 1 · Positive Tests: Point Events · 2 -->

- **Group:** Point Events
- **Case:** RouteID populated, Null populated RouteName, default to load by RouteID. Ensure that the loaded events have correct RouteName generated once loaded

### TC-P03 — RouteName populated, Null populated RouteID <!-- src: S4 · slide 1 · Positive Tests: Point Events · 3 -->

- **Group:** Point Events
- **Case:** RouteName populated, Null populated RouteID, load by RouteName. Ensure that the loaded event have correct RouteID generated once loaded

### TC-P04 — Some events with RouteName populated and Null populated RouteID with other (1) <!-- src: S4 · slide 1 · Positive Tests: Point Events · 4 -->

- **Group:** Point Events
- **Case:** Some events with RouteName populated and Null populated RouteID with other events with RouteID populated and Null populated RouteName. Load events by populated route identifier field and generate the Null route identifier field once loaded

### TC-P05 — RouteID and RouteName populated, default to load by RouteID (1) <!-- src: S4 · slide 1 · Positive Tests: Point Events · 5 -->

- **Group:** Point Events

### TC-P06 — Load events with conflicting RouteName and RouteID values. Load events (1) <!-- src: S4 · slide 1 · Positive Tests: Point Events · 6 -->

- **Group:** Point Events
- **Case:** Load events with conflicting RouteName and RouteID values. Load events by RouteID and regenerate RouteName values once loaded

### TC-N01 — RouteName and RouteID are populated <!-- src: S4 · slide 2 · Negative Tests: Error · 1 -->

- **Group:** Error
- **Case:** RouteName and RouteID are populated, but do not point to valid routes. Events will not be loaded and the OIDs of these events will be noted in the output .txt file

### TC-N02 — RouteName fields(s) populated but RouteID field(s) missing from input events (1) <!-- src: S4 · slide 2 · Negative Tests: Error · 2 -->

- **Group:** Error
- **Case:** RouteName fields(s) populated but RouteID field(s) missing from input events to load. Fail tool with message stating that the RouteID field(s) are missing

### TC-P07 — RouteName fields not stored, default to load by RouteID fields <!-- src: S4 · slide 2 · Positive Tests: Spanning Line Events · 1 -->

- **Group:** Spanning Line Events

### TC-P08 — FromRouteID and ToRouteID populated (1) <!-- src: S4 · slide 2 · Positive Tests: Spanning Line Events · 2 -->

- **Group:** Spanning Line Events
- **Case:** FromRouteID and ToRouteID populated, Null populated FromRouteName and ToRouteName , default to load by RouteID fields. Ensure that the loaded events have correct FromRouteName and ToRouteName generated once loaded

### TC-P09 — FromRouteName and ToRouteName populated (1) <!-- src: S4 · slide 2 · Positive Tests: Spanning Line Events · 3 -->

- **Group:** Spanning Line Events
- **Case:** FromRouteName and ToRouteName populated, Null populated FromRouteID and ToRouteId , load by RouteName fields. Ensure that the loaded event have correct FromRouteID and ToRouteID generated once loaded

### TC-P10 — Some events with FromRouteName and ToRouteName populated and Null populated (1) <!-- src: S4 · slide 2 · Positive Tests: Spanning Line Events · 4 -->

- **Group:** Spanning Line Events
- **Case:** Some events with FromRouteName and ToRouteName populated and Null populated FromRouteID and ToRouteID with other events with FromRouteID and ToRouteID populated and Null populated FromRouteName and ToRouteName . Load events by populated route identifier field and generate the Null route identifier fields once loaded

### TC-P11 — RouteID and RouteName fields populated, default to load by RouteID fields (1) <!-- src: S4 · slide 2 · Positive Tests: Spanning Line Events · 5 -->

- **Group:** Spanning Line Events

### TC-P12 — Load events with conflicting RouteName and RouteID values. Load events (2) <!-- src: S4 · slide 2 · Positive Tests: Spanning Line Events · 6 -->

- **Group:** Spanning Line Events
- **Case:** Load events with conflicting RouteName and RouteID values. Load events by RouteID fields and regenerate RouteName values once loaded

### TC-P13 — Load events with populated FromRouteID and ToRouteName bu t Null FromRouteName <!-- src: S4 · slide 2 · Positive Tests: Spanning Line Events · 7 -->

- **Group:** Spanning Line Events
- **Case:** Load events with populated FromRouteID and ToRouteName bu t Null FromRouteName and ToRouteID and vice versa

### TC-P14 — RouteName not stored, default to load by RouteID (2) <!-- src: S4 · slide 2 · Positive Tests: Line Events · 1 -->

- **Group:** Line Events

### TC-P15 — RouteID populated with Null populated RouteName <!-- src: S4 · slide 2 · Positive Tests: Line Events · 2 -->

- **Group:** Line Events
- **Case:** RouteID populated with Null populated RouteName, default to load by RouteID. Ensure that the loaded events have correct RouteName generated once loaded

### TC-P16 — RouteName populated with Null populated RouteID <!-- src: S4 · slide 2 · Positive Tests: Line Events · 3 -->

- **Group:** Line Events
- **Case:** RouteName populated with Null populated RouteID, load by RouteName. Ensure that the loaded event have correct RouteID generated once loaded

### TC-P17 — Some events with RouteName populated and Null populated RouteID with other (2) <!-- src: S4 · slide 2 · Positive Tests: Line Events · 4 -->

- **Group:** Line Events
- **Case:** Some events with RouteName populated and Null populated RouteID with other events with RouteID populated and Null populated RouteName. Load events by populated route identifier field and generate the Null route identifier field once loaded

### TC-P18 — RouteID and RouteName populated, default to load by RouteID (2) <!-- src: S4 · slide 2 · Positive Tests: Line Events · 5 -->

- **Group:** Line Events

### TC-P19 — Load events with conflicting RouteName and RouteID values. Load events (3) <!-- src: S4 · slide 2 · Positive Tests: Line Events · 6 -->

- **Group:** Line Events
- **Case:** Load events with conflicting RouteName and RouteID values. Load events by RouteID and regenerate RouteName values once loaded

### TC-P20 — RouteName populated only, but events are not in same time slice as route <!-- src: S4 · slide 2 · Positive Tests: Line Events · 7 -->

- **Group:** Line Events

### TC-P21 — RouteName populated only, events appended after route is retired (1) <!-- src: S4 · slide 2 · Positive Tests: Line Events · 8 -->

- **Group:** Line Events

### TC-P22 — RouteName populated only (1) <!-- src: S4 · slide 2 · Positive Tests: Line Events · 9 -->

- **Group:** Line Events
- **Case:** RouteName populated only, events appended after route is reassigned to another route

### TC-P23 — RouteName populated only, source events span a gap (1) <!-- src: S4 · slide 2 · Positive Tests: Line Events · 10 -->

- **Group:** Line Events

### TC-U01 — RouteName not stored, default to load by RouteID (case 1) <!-- src: S2 · slide 3 · case 1 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | N/A | R1 | 0-10 |

Pt Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 |

| From Date | To Date | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | 001 | 2 |
| 1/1/2000 | Null | R1 | 002 | 5 |
| 1/1/2000 | Null | R1 | 003 | 8 |

[figure: 0 · 10 · 5 · R1 · Route Info: · 8 · 2 · Post-Append:]

![Figure 2 — 1. RouteName not stored, default to load by RouteID](../media/5117-append-events-load-events-by-routename/fig-02-slide-03-1-routename-not-stored-default-to-load.svg)

### TC-U02 — RouteID populated, Null populated RouteName, default to load by RouteID (case 2) <!-- src: S2 · slide 4 · case 2 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Pt Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Null | R1 | 001 | 2 |
| 1/1/2000 | Null | Null | R1 | 002 | 5 |
| 1/1/2000 | Null | Null | R1 | 003 | 8 |

Post-Append (RouteName Generated):

| From Date | To Date | Route<br>Name | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 |

[figure: 0 · 10 · 5 · R1 · Route Info: · 8 · 2]

![Figure 3 — 2. RouteID populated, Null populated RouteName, default to load by RouteID](../media/5117-append-events-load-events-by-routename/fig-03-slide-04-2-routeid-populated-null-populated.svg)

### TC-U03 — RouteName populated, Null populated RouteID, load by RouteName (case 3) <!-- src: S2 · slide 5 · case 3 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Pt Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | Null | 001 | 2 |
| 1/1/2000 | Null | Route1 | Null | 002 | 5 |
| 1/1/2000 | Null | Route1 | Null | 003 | 8 |

Post-Append (RouteID Generated):

| From Date | To Date | Route<br>Name | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 |

[figure: 0 · 10 · 5 · R1 · Route Info: · 8 · 2]

![Figure 4 — 3. RouteName populated, Null populated RouteID, load by RouteName](../media/5117-append-events-load-events-by-routename/fig-04-slide-05-3-routename-populated-null-populated.svg)

### TC-U04 — Some Events with RouteName Populated and Null Populated RouteID with Other (case 4) <!-- src: S1 · slide 6 · case 4 -->

- **Case:** Some events with RouteName populated and Null populated RouteID with other events with RouteID populated and Null populated RouteName

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Pt Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | Null | 001 | 2 |
| 1/1/2000 | Null | Null | R1 | 002 | 5 |
| 1/1/2000 | Null | Route1 | Null | 003 | 8 |

Post-Append (Route Identifier Generated):

| From Date | To Date | Route<br>Name | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 |

[figure: 0 · 10 · 5 · R1 · Route Info: · 8 · 2]

![Figure 5 — 6](../media/5117-append-events-load-events-by-routename/fig-05-slide-06-6.svg)

### TC-U05 — RouteID and RouteName populated, default to load by RouteID (case 5) <!-- src: S2 · slide 7 · case 5 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Pt Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 |

Post-Append (RouteName Generated):

| From Date | To Date | Route<br>Name | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 |

[figure: 0 · 10 · 5 · R1 · Route Info: · 8 · 2]

![Figure 6 — 5. RouteID and RouteName populated, default to load by RouteID](../media/5117-append-events-load-events-by-routename/fig-06-slide-07-5-routeid-and-routename-populated.svg)

### TC-U06 — Load events with conflicting RouteName and RouteID values <!-- src: S2 · slide 8 · case 6 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | RouteX | R1 | 001 | 2 |
| 1/1/2000 | Null | RouteX | R1 | 002 | 5 |
| 1/1/2000 | Null | RouteX | R1 | 003 | 8 |

Post-Append (RouteName Generated):

| From Date | To Date | Route<br>Name | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 |

[figure: 0 · 10 · 5 · R1 · Route Info: · 8 · 2]

![Figure 7 — 6. Load events with conflicting RouteName and RouteID values](../media/5117-append-events-load-events-by-routename/fig-07-slide-08-6-load-events-with-conflicting-routename.svg)

### TC-U07 — RouteName not stored, default to load by RouteID (case 7) <!-- src: S2 · slide 9 · case 7 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 | 10 |

| From Date | To Date | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | R1 | 003 | 8 | 10 |

[figure: 0 · 10 · R1 · Route Info: · Post-Append: · 2 · 4–6 · 8]

![Figure 8 — 7. RouteName not stored, default to load by RouteID](../media/5117-append-events-load-events-by-routename/fig-08-slide-09-7-routename-not-stored-default-to-load.svg)

### TC-U08 — RouteID populated, Null populated RouteName, default to load by RouteID (case 8) <!-- src: S2 · slide 10 · case 8 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Null | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | Null | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Null | R1 | 003 | 8 | 10 |

Post-Append (RouteName Generated):

| From Date | To Date | Route<br>Name | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 | 10 |

[figure: 0 · 10 · R1 · Route Info: · 2 · 4–6 · 8]

![Figure 9 — 8. RouteID populated, Null populated RouteName, default to load by RouteID](../media/5117-append-events-load-events-by-routename/fig-09-slide-10-8-routeid-populated-null-populated.svg)

### TC-U09 — RouteName populated, Null populated RouteID, load by RouteName (case 9) <!-- src: S2 · slide 11 · case 9 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | Null | 001 | 2 | 4 |
| 1/1/2000 | Null | Route1 | Null | 002 | 5 | 6 |
| 1/1/2000 | Null | Route1 | Null | 003 | 8 | 10 |

Post-Append (RouteID Generated):

| From Date | To Date | Route<br>Name | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 | 10 |

[figure: 0 · 10 · R1 · Route Info: · 2 · 4–6 · 8]

![Figure 10 — 9. RouteName populated, Null populated RouteID, load by RouteName](../media/5117-append-events-load-events-by-routename/fig-10-slide-11-9-routename-populated-null-populated.svg)

### TC-U10 — Some Events with RouteName Populated and Null Populated RouteID with Other (case 10) <!-- src: S1 · slide 12 · case 10 -->

- **Case:** Some events with RouteName populated and Null populated RouteID with other events with RouteID populated and Null populated RouteName

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | Null | 001 | 2 | 4 |
| 1/1/2000 | Null | Null | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Route1 | Null | 003 | 8 | 10 |

Post-Append (Route Identifier Generated):

| From Date | To Date | Route<br>Name | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 | 10 |

[figure: 0 · 10 · R1 · Route Info: · 2 · 4–6 · 8]

![Figure 11 — 12](../media/5117-append-events-load-events-by-routename/fig-11-slide-12-12.svg)

### TC-U11 — RouteID and RouteName populated, default to load by RouteID (case 11) <!-- src: S2 · slide 13 · case 11 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 | 10 |

| From Date | To Date | Route<br>Name | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 | 10 |

[figure: 0 · 10 · R1 · Route Info: · Post-Append: · 2 · 4–6 · 8]

![Figure 12 — 11. RouteID and RouteName populated, default to load by RouteID](../media/5117-append-events-load-events-by-routename/fig-12-slide-13-11-routeid-and-routename-populated.svg)

### TC-U12 — Load events with conflicting RouteName and RouteID value, default to RouteID <!-- src: S2 · slide 14 · case 12 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | RouteX | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | RouteX | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | RouteX | R1 | 003 | 8 | 10 |

Post-Append (RouteName Generated):

| From Date | To Date | Route<br>Name | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 | 10 |

[figure: 0 · 10 · R1 · Route Info: · 2 · 4–6 · 8]

![Figure 13 — 12. Load events with conflicting RouteName and RouteID value, default to RouteID](../media/5117-append-events-load-events-by-routename/fig-13-slide-14-12-load-events-with-conflicting.svg)

### TC-U13 — RouteName Populated Only, Events To Append Are Not in Same Time Slice as Route <!-- src: S1 · slide 15 · case 13 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route 1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/1995 | Null | Route 1 | Null | 001 | 2 | 4 |
| 1/1/1995 | Null | Route 1 | Null | 002 | 5 | 6 |
| 1/1/1995 | Null | Route 1 | Null | 003 | 8 | 10 |

Post-Append (Generate RouteID):

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure | LocError |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/1995 | 1/1/2000 | Route 1 | R1 | 001 | 2 | 4 | Route not found |
| 1/1/1995 | 1/1/2000 | Route 1 | R1 | 002 | 5 | 6 | Route not found |
| 1/1/1995 | 1/1/2000 | Route 1 | R1 | 003 | 8 | 10 | Route not found |
| 1/1/2000 | Null | Route 1 | R1 | 001 | 2 | 4 | No error |
| 1/1/2000 | Null | Route 1 | R1 | 002 | 5 | 6 | No error |
| 1/1/2000 | Null | Route 1 | R1 | 003 | 8 | 10 | No error |

[figure: 0 · 10 · R1 · Route Info: · 2 · 4–6 · 8]

![Figure 14 — 15](../media/5117-append-events-load-events-by-routename/fig-14-slide-15-15.svg)

### TC-U14 — RouteName populated only, events appended after route is retired (case 14) <!-- src: S2 · slide 16 · case 14 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | 1/1/2005 | Route1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2006 | Null | Null | R1 | 001 | 2 | 4 |
| 1/1/2006 | Null | Null | R1 | 002 | 5 | 6 |
| 1/1/2006 | Null | Null | R1 | 003 | 8 | 10 |

| From Date | To Date | Route<br>Name | RouteID | EventID | From<br>Measure | To<br>Measure | LocError |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2006 | Null | Route1 | R1 | 001 | 2 | 4 | Route Not Found |
| 1/1/2006 | Null | Route1 | R1 | 002 | 5 | 6 | Route Not Found |
| 1/1/2006 | Null | Route1 | R1 | 003 | 8 | 10 | Route Not Found |

[figure: 0 · 10 · R1 · Route Info: · Post-Append: · 2 · 4–6 · 8]

![Figure 15 — 14. RouteName populated only, events appended after route is retired](../media/5117-append-events-load-events-by-routename/fig-15-slide-16-14-routename-populated-only-events.svg)

### TC-U15 — RouteName Populated Only (case 15) <!-- src: S1 · slide 17 · case 15 -->

- **Case:** RouteName populated only, events appended after route is reassigned to another route

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | 1/1/2005 | Route1 | R1 | 0-10 |
| 1/1/2006 | Null | Route1_New | R1_New |  |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2006 | Null | Null | R1 | 001 | 2 | 4 |
| 1/1/2006 | Null | Null | R1 | 002 | 5 | 6 |
| 1/1/2006 | Null | Null | R1 | 003 | 8 | 10 |

| From Date | To Date | Route<br>Name | RouteID | EventID | From<br>Measure | To<br>Measure | LocError |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2006 | Null | Route1 | R1 | 001 | 2 | 4 | Route Not Found |
| 1/1/2006 | Null | Route1 | R1 | 002 | 5 | 6 | Route Not Found |
| 1/1/2006 | Null | Route1 | R1 | 003 | 8 | 10 | Route Not Found |

[figure: 0 · 10 · R1_New · Route Info: · Post-Append: · 2 · 4–6 · 8]

![Figure 16 — 17](../media/5117-append-events-load-events-by-routename/fig-16-slide-17-17.svg)

### TC-U16 — RouteName populated only, source events span a gap (case 16) <!-- src: S2 · slide 18 · case 16 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Ln Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Null | R1 | 001 | 2 | 4 |
| 1/1/2000 | Null | Null | R1 | 002 | 5 | 6 |
| 1/1/2000 | Null | Null | R1 | 003 | 8 | 10 |
| 1/1/2000 | Null | Null | R1 | 004 | 2 | 8 |

| From Date | To Date | Route Name | RouteID | EventID | From<br>Measure | To<br>Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 001 | 2 | 4 | No Error |
| 1/1/2000 | Null | Route1 | R1 | 002 | 5 | 6 | Partial Match for To Measure |
| 1/1/2000 | Null | Route1 | R1 | 003 | 8 | 10 | No Error |
| 1/1/2000 | Null | Route1 | R1 | 004 | 2 | 4 | No Error |
| 1/1/2000 | Null | Route1 | R1 | 004 | 6 | 8 | No Error |

[figure: 0 · 10 · R1 · Route Info: · Post-Append: · 2 · 4–6 · 8 · 6 · 4]

![Figure 17 — 16. RouteName populated only, source events span a gap](../media/5117-append-events-load-events-by-routename/fig-17-slide-18-16-routename-populated-only-source.svg)

### TC-U17 — RouteName not stored, default to load by RouteID (case 17) <!-- src: S2 · slide 19 · case 17 -->

| From Date | To Date | RouteName | RouteID | LineName | LineID | Measures |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | N/A | L1 | 0-10 |
| 1/1/2000 | Null | Route2 | R2 | N/A | L1 | 15-20 |
| 1/1/2000 | Null | Route3 | R3 | N/A | L1 | 25-30 |

Ln Event to Append:

| From<br>Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | Route2 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | R1 | Route3 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | R2 | Route3 | R3 | 003 | 17 | 25 |

| From Date | To Date | From<br>RouteID | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | R1 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | R2 | R3 | 003 | 17 | 25 |

[figure: 0 · 10 · R1 · Route Info: · Post-Append: · 15 · 20 · 25 · 30 · R2 · R3]

![Figure 18 — 17. RouteName not stored, default to load by RouteID](../media/5117-append-events-load-events-by-routename/fig-18-slide-19-17-routename-not-stored-default-to-load.svg)

### TC-U18 — FromRouteID and ToRouteID Populated (case 18) <!-- src: S1 · slide 20 · case 18 -->

- **Case:** FromRouteID and ToRouteID populated, Null populated FromRouteName and ToRouteName, default to load by RouteID fields

| From Date | To Date | RouteName | RouteID | LineName | LineID | Measures |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | N/A | R1 | N/A | L1 | 0-10 |
| 1/1/2000 | Null | N/A | R2 | N/A | L1 | 15-20 |
| 1/1/2000 | Null | N/A | R3 | N/A | L1 | 25-30 |

Ln Event to Append:

| From<br>Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Null | R1 | Null | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Null | R1 | Null | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Null | R2 | Null | R3 | 003 | 17 | 25 |

Post-Append (Generated RouteName):

| From Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | Route2 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | R1 | Route3 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | R2 | Route3 | R3 | 003 | 17 | 25 |

[figure: 0 · 10 · R1 · Route Info: · 15 · 20 · 25 · 30 · R2 · R3]

![Figure 19 — 20](../media/5117-append-events-load-events-by-routename/fig-19-slide-20-20.svg)

### TC-U19 — FromRouteName and ToRouteName Populated (case 19) <!-- src: S1 · slide 21 · case 19 -->

- **Case:** FromRouteName and ToRouteName populated, Null populated FromRouteID and ToRouteId, load by RouteName fields

| From Date | To Date | RouteName | RouteID | LineName | LineID | Measures |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | N/A | R1 | N/A | L1 | 0-10 |
| 1/1/2000 | Null | N/A | R2 | N/A | L1 | 15-20 |
| 1/1/2000 | Null | N/A | R3 | N/A | L1 | 25-30 |

Ln Event to Append:

| From<br>Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | Null | Route2 | Null | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | Null | Route3 | Null | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | Null | Route3 | Null | 003 | 17 | 25 |

Post-Append (Generated RouteID):

| From Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | Route2 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | R1 | Route3 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | R2 | Route3 | R3 | 003 | 17 | 25 |

[figure: 0 · 10 · R1 · Route Info: · 15 · 20 · 25 · 30 · R2 · R3]

![Figure 20 — 21](../media/5117-append-events-load-events-by-routename/fig-20-slide-21-21.svg)

### TC-U20 — Some Events with FromRouteName and ToRouteName Populated and Null Populated (case 20) <!-- src: S1 · slide 22 · case 20 -->

- **Case:** Some events with FromRouteName and ToRouteName populated and Null populated FromRouteID and ToRouteID with other events with FromRouteID and ToRouteID populated and Null populated FromRouteName and ToRouteName

| From Date | To Date | RouteName | RouteID | LineName | LineID | Measures |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | N/A | R1 | N/A | L1 | 0-10 |
| 1/1/2000 | Null | N/A | R2 | N/A | L1 | 15-20 |
| 1/1/2000 | Null | N/A | R3 | N/A | L1 | 25-30 |

Ln Event to Append:

| From<br>Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | Null | Route2 | Null | 001 | 2 | 16 |
| 1/1/2000 | Null | Null | R2 | Null | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | Null | Route3 | Null | 003 | 17 | 25 |

Post-Append (Generated Corresponding Route Identifier Fields):

| From Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | Route2 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | R1 | Route3 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | R2 | Route3 | R3 | 003 | 17 | 25 |

[figure: 0 · 10 · R1 · Route Info: · 15 · 20 · 25 · 30 · R2 · R3]

![Figure 21 — 22](../media/5117-append-events-load-events-by-routename/fig-21-slide-22-22.svg)

### TC-U21 — RouteID and RouteName Fields Populated, Default To Load by RouteID Fields (case 21) <!-- src: S1 · slide 23 · case 21 -->

| From Date | To Date | RouteName | RouteID | LineName | LineID | Measures |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | N/A | R1 | N/A | L1 | 0-10 |
| 1/1/2000 | Null | N/A | R2 | N/A | L1 | 15-20 |
| 1/1/2000 | Null | N/A | R3 | N/A | L1 | 25-30 |

Ln Event to Append:

| From<br>Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | Route2 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | R1 | Route3 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | R2 | Route3 | R3 | 003 | 17 | 25 |

| From Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | Route2 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | R1 | Route3 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | R2 | Route3 | R3 | 003 | 17 | 25 |

[figure: 0 · 10 · R1 · Route Info: · Post-Append: · 15 · 20 · 25 · 30 · R2 · R3]

![Figure 22 — 23](../media/5117-append-events-load-events-by-routename/fig-22-slide-23-23.svg)

### TC-U22 — Load Events with Conflicting RouteName and RouteID Values. Load Events (case 22) <!-- src: S1 · slide 24 · case 22 -->

- **Case:** Load events with conflicting RouteName and RouteID values. Load events by RouteID fields and regenerate RouteName values once loaded

| From Date | To Date | RouteName | RouteID | LineName | LineID | Measures |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | N/A | R1 | N/A | L1 | 0-10 |
| 1/1/2000 | Null | N/A | R2 | N/A | L1 | 15-20 |
| 1/1/2000 | Null | N/A | R3 | N/A | L1 | 25-30 |

Ln Event to Append:

| From<br>Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route2 | R1 | Route1 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Route3 | R1 | Route1 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | R2 | Route1 | R3 | 003 | 17 | 25 |

Post-Append (Generated RouteName):

| From Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | Route2 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | R1 | Route3 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | R2 | Route3 | R3 | 003 | 17 | 25 |

[figure: 0 · 10 · R1 · Route Info: · 15 · 20 · 25 · 30 · R2 · R3]

![Figure 23 — 24](../media/5117-append-events-load-events-by-routename/fig-23-slide-24-24.svg)

### TC-U23 — Load Events with Populated FromRouteID and ToRouteName but Null FromRouteName <!-- src: S1 · slide 25 · case 23 -->

- **Case:** Load events with populated FromRouteID and ToRouteName but Null FromRouteName and ToRouteID and vice versa

| From Date | To Date | RouteName | RouteID | LineName | LineID | Measures |
| --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | N/A | R1 | N/A | L1 | 0-10 |
| 1/1/2000 | Null | N/A | R2 | N/A | L1 | 15-20 |
| 1/1/2000 | Null | N/A | R3 | N/A | L1 | 25-30 |

Ln Event to Append:

| From<br>Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Null | R1 | Route2 | Null | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | Null | Null | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Null | R2 | Route3 | Null | 003 | 17 | 25 |

Post-Append (Generated Corresponding Field):

| From Date | To Date | From<br>Route<br>Name | From<br>RouteID | To<br>Route<br>Name | To<br>Route<br>ID | EventID | From<br>Measure | To<br>Measure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | Route2 | R2 | 001 | 2 | 16 |
| 1/1/2000 | Null | Route1 | R1 | Route3 | R3 | 002 | 5 | 30 |
| 1/1/2000 | Null | Route2 | R2 | Route3 | R3 | 003 | 17 | 25 |

[figure: 0 · 10 · R1 · Route Info: · 15 · 20 · 25 · 30 · R2 · R3]

![Figure 24 — 25](../media/5117-append-events-load-events-by-routename/fig-24-slide-25-25.svg)

### TC-U24 — RouteName and RouteID Are Populated, but Do Not Point To Valid Routes <!-- src: S1 · slide 26 · case 1 -->

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Pt Event to Append:

| From Date | To Date | RouteName | RouteID | EventID | Measures |
| --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | RouteX | RX | 001 | 2 |
| 1/1/2000 | Null | RouteX | RX | 002 | 5 |
| 1/1/2000 | Null | RouteX | RX | 003 | 8 |

Unable to append events, see output .txt file

[figure: 0 · 10 · 5 · R1 · Route Info: · 8 · 2 · Post-Append:]

![Figure 25 — 26](../media/5117-append-events-load-events-by-routename/fig-25-slide-26-26.svg)

### TC-U25 — RouteName Fields(s) Populated but RouteID Field(s) Missing From Input Events (case 2) <!-- src: S1 · slide 27 · case 2 -->

- **Case:** RouteName fields(s) populated but RouteID field(s) missing from input events to load. Fail tool with message stating that the RouteID field(s) are missing

| From Date | To Date | RouteName | RouteID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | R1 | 0-10 |

Pt Event to Append:

| From Date | To Date | RouteName | EventID | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | Route1 | 001 | 2 |
| 1/1/2000 | Null | Route1 | 002 | 5 |
| 1/1/2000 | Null | Route1 | 003 | 8 |

Unable to append events, RouteID field not found

[figure: 0 · 10 · 5 · R1 · Route Info: · 8 · 2 · Post-Append:]

![Figure 26 — 27](../media/5117-append-events-load-events-by-routename/fig-26-slide-27-27.svg)

## Other content

### Slide 1 — Devtopia Issue <!-- slide 1 -->

Append Events: Load Events by RouteName

**Notes**
- Test with RH and APR data, but focus more on APR
- RouteName must be stored in the target event. If no RouteName is stored, events will be loaded by RouteID
- Test with FGDB, EDGB, and FS
- Only test with ADD Load Type
- Test with point, line, and spanning line events
- Test Conflict Prevention continues to work as expected
- Ensure existing RouteID validation perform when events are loaded by RouteName
- Test a couple cases in Python and ModelBuilder
- Sanity test other load types to make sure they still execute as expected
- Verify LocErrors are correct

![Figure 1 — Devtopia Issue](../media/5117-append-events-load-events-by-routename/fig-01-slide-01-devtopia-issue.png)
