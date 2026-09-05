# Coordinates Method in Add Point and Add Line Widgets Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 49 · Test Plan · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24791](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24791) |
| **Source** | [24791-CoordinatesMethodinAddPointandLine_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/24791-CoordinatesMethodinAddPointandLine_TestPlanV1.pptx>) · rev V1 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2025-06-11 21:25 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | coordinates method · add point · add line · event widgets · route · measure · location error · time slices |
| **Tools** | Add Point · Add Line · Search by Route |

## Summary

Test plan for the Coordinates method functionality in the Add Point and Add Line Event widgets. Covers positive and negative test cases including configuration, UI behavior, coordinate input validation, and event placement scenarios on various route types such as normal, gapped, branched, vertical, and line networks. Includes tests for time slices and location error handling.

## Related documents

<!-- related:begin -->
- [Add Line Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/24791-add-line-event-widget.md>) — shared issue Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24791 · similar text 0.12 · 2 title words · 3 filename words · same surface <!-- rel:138 s=1004.299 -->
- [Add Point Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/24791-add-point-event-widget.md>) — shared issue Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24791 · similar text 0.12 · 2 title words · 2 filename words · same surface <!-- rel:139 s=1003.799 -->
- [Location Offset Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/24790-location-offset-method-in-add-point-and-add-line-widgets.md>) — similar text 0.19 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:48 s=7.446 -->
- [Add Line Event Tool Coordinate Offset Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/3911-add-line-event-tool-coordinate-offset-method.md>) — similar text 0.65 · 3 title words · 1 filename word · same kind/folder <!-- rel:636 s=5.537 -->
- [Coordinate method in Add Point and Line widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/coordinate-method-in-add-point-and-line-widgets.md>) — similar text 0.13 · 5 title words · 2 filename words · same surface <!-- rel:176 s=5.414 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Location errors](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/location-errors.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com) · [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — Add Coordinates in the Methods <!-- src: S4 · slide 1 · Positive Tests: Configuration · 1 -->

- **Group:** Configuration
- **Case:** Add Coordinates in the Methods (Add Line will have it for both the From and To Methods)

### TC-P02 — Coordinates can be configured as the default Method in Add Point and the From/To <!-- src: S4 · slide 1 · Positive Tests: Configuration · 2 -->

- **Group:** Configuration
- **Case:** Coordinates can be configured as the default Method in Add Point and the From/To Methods in Add Line

### TC-P03 — Add default Spatial Reference configuration parameter to LRS network layers <!-- src: S4 · slide 1 · Positive Tests: Configuration · 3 -->

- **Group:** Configuration

### TC-P04 — Add Search Radius configuration parameter to LRS network layers <!-- src: S4 · slide 1 · Positive Tests: Configuration · 4 -->

- **Group:** Configuration

### TC-P05 — Search Radius will always be in the same units as the parent LRS network <!-- src: S4 · slide 1 · Positive Tests: Configuration · 5 -->

- **Group:** Configuration

### TC-P06 — Coordinates method can be chosen (when enabled) <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 1 -->

- **Group:** Add Point / Add Line UI

### TC-P07 — Coordinates method is not displayed (when disabled) <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 2 -->

- **Group:** Add Point / Add Line UI

### TC-P08 — Coordinates method is chosen as the default method (when configured) <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 3 -->

- **Group:** Add Point / Add Line UI

### TC-P09 — RouteID/RouteName parameter continues to work as expected (1) <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 4 -->

- **Group:** Add Point / Add Line UI

### TC-P10 — RouteID/RouteName picker continues to work as expected (1) <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 5 -->

- **Group:** Add Point / Add Line UI

### TC-P11 — RouteID/RouteName picker continues to work as expected (2) <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 6 -->

- **Group:** Add Point / Add Line UI

### TC-P12 — RouteID/RouteName parameter continues to work as expected (2) <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 7 -->

- **Group:** Add Point / Add Line UI

### TC-P13 — X Coordinate and Y Coordinate parameters are required <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 8 -->

- **Group:** Add Point / Add Line UI

### TC-P14 — Z Coordinate parameter is optional <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 9 -->

- **Group:** Add Point / Add Line UI

### TC-P15 — Small markers appear on map for actual coordinate location <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 10 -->

- **Group:** Add Point / Add Line UI

### TC-P16 — Larger markers appear on map for location on route nearest to coordinate input <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 11 -->

- **Group:** Add Point / Add Line UI

### TC-P17 — Actual distance between coordinate and route is displayed <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 12 -->

- **Group:** Add Point / Add Line UI

### TC-P18 — If coordinate input returns to measures on the same route <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 13 -->

- **Group:** Add Point / Add Line UI
- **Case:** If coordinate input returns to measures on the same route (Coordinate input is at self-intersecting measure of route, Coordinate input is equidistant from 2 measures on the same route, etc.), show measure selection pop-up that allows users to pick which measure they would like to use

### TC-P19 — Reset button resets tool UI to initial state <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 14 -->

- **Group:** Add Point / Add Line UI

### TC-P20 — For Add Line, test the above for both the From and To Methods <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 15 -->

- **Group:** Add Point / Add Line UI

### TC-P21 — Ensure data actions from other widgets continue to populate Add Point and Add <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 16 -->

- **Group:** Add Point / Add Line UI
- **Case:** Ensure data actions from other widgets continue to populate Add Point and Add Line widgets as expected

### TC-P22 — Confirm GCS coordinate distance from route is returned in Meters and not Degrees <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line UI · 17 -->

- **Group:** Add Point / Add Line UI

### TC-N01 — Input invalid X coordinate with valid Y and Z coordinates <!-- src: S4 · slide 2 · Negative Tests: Error · 1 -->

- **Group:** Error

### TC-N02 — Input invalid Y coordinate with valid X and Z coordinates <!-- src: S4 · slide 2 · Negative Tests: Error · 2 -->

- **Group:** Error

### TC-N03 — Input invalid Z coordinate with valid X and Y coordinates <!-- src: S4 · slide 2 · Negative Tests: Error · 3 -->

- **Group:** Error

### TC-N04 — Input X coordinate that exceeds the spatial reference (Examples: °, -°, etc.) <!-- src: S4 · slide 2 · Negative Tests: Error · 4 -->

- **Group:** Error

### TC-N05 — Input Y coordinate that exceeds the spatial reference (Examples: °, -°, etc.) <!-- src: S4 · slide 2 · Negative Tests: Error · 5 -->

- **Group:** Error

### TC-N06 — Input Z coordinate that exceeds the spatial reference (Examples: °, -°, etc.) <!-- src: S4 · slide 2 · Negative Tests: Error · 6 -->

- **Group:** Error

### TC-N07 — Input X and Z coordinate, Y coordinate is missing <!-- src: S4 · slide 2 · Negative Tests: Error · 7 -->

- **Group:** Error

### TC-N08 — Input Y and Z coordinate, X coordinate is missing <!-- src: S4 · slide 2 · Negative Tests: Error · 8 -->

- **Group:** Error

### TC-N09 — Input invalid RouteID/RouteName <!-- src: S4 · slide 2 · Negative Tests: Error · 9 -->

- **Group:** Error

### TC-N10 — Input invalid date range <!-- src: S4 · slide 2 · Negative Tests: Error · 10 -->

- **Group:** Error

### TC-U01 — Coordinate location falling on route (case 1) <!-- src: S2 · slide 3 · case 1 -->

- **Case:** Coordinate location falling on route (XYZ coordinates is provided by typing the value) for X marked location) 1a.

| RouteID | Event Layer | EventId | From Date | To Date | Measure | Ref Method | Ref location | Ref offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CO_R1 | Event1 | CO_E1 | 1/1/2000 |  | 0 | X/Y | X,Y | 0 |
| CO_R1 | Event1 | CO_E2 | 1/1/2000 |  | 5 | X/Y | X,Y | 0 |
| CO_R1 | Event1 | CO_E3 | 1/1/2000 |  | 10 | X/Y | X,Y | 0 |

1b.  Adding multiple point events in a normal route

| RouteId | Event Layer | EventId | FromDate | To Date | Measure |
| --- | --- | --- | --- | --- | --- |
| CO_R1 | Event1 | CO_E4 | 1/1/2000 |  | 8 |
| CO_R1 | Event2 | CO_E1 | 1/1/2000 |  | 8 |
| CO_R1 | Event3 | CO_E1 | 1/1/2000 |  | 8 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |

[figure: 0 · 10 · CO_R1 · x · CO_E1 · CO_E2 · CO_E3 · CO_E4 CO_E1 CO_E1]

![Figure 1 — 1. Coordinate location falling on route (XYZ coordinates is provided by typing the value) for X marked location) 1a.](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-01-slide-03-1-coordinate-location-falling-on-route.svg)

### TC-U02 — Coordinate location not falling on the route(XYZ location is provided (case 2) <!-- src: S2 · slide 4 · case 2 -->

- **Case:** Coordinate location not falling on the route(XYZ location is provided for location and event is placed on nearest

| RouteID | Event Layer | EventId | From Date | To Date | Measure |
| --- | --- | --- | --- | --- | --- |
| CO_R2 | Event1 | CO_E5 | 1/1/2000 |  | 0 |
| CO_R2 | Event1 | CO_E6 | 1/1/2000 |  | 5 |
| CO_R2 | Event1 | CO_E7 | 1/1/2000 |  | 10 |

2b.Adding multiple point events in a gapped route

| RouteID | Event Layer | EventId | From Date | To Date | Measure |
| --- | --- | --- | --- | --- | --- |
| CO_R1 | Event1 | CO_E6 | 1/1/2000 |  | 5.1 |
| CO_R1 | Event2 | CO_E2 | 1/1/2000 |  | 5.1 |
| CO_R1 | Event3 | CO_E2 | 1/1/2000 |  | 5.1 |

| Measure |
| --- |
| 5 |
| 5.1 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y | 0.01 |
| X/Y | X,Y | 0.01 |
| X/Y | X,Y | 0.02 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y | 0.01 |
| X/Y | X,Y | 0.01 |
| X/Y | X,Y | 0.01 |

[figure: 0 · 10 · CO_R2 · x · CO_E5 · CO_E6 · CO_E7 · CO_E8 CO_E2 CO_E2 · 5 · 5.1]

![Figure 2 — 2. Coordinate location not falling on the route(XYZ location is provided for location and event is placed on nearest](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-02-slide-04-2-coordinate-location-not-falling.svg)

### TC-U03 — Coordinate location falling on the route where there is more than one measure (case 3) <!-- src: S2 · slide 5 · case 3 -->

- **Case:** Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked

| RouteID | Event Layer | EventId | From Date | To Date | Measure |
| --- | --- | --- | --- | --- | --- |
| CO_R3 | Event1 | CO_E9 | 1/1/2000 |  | 14 |
| CO_R3 | Event1 | CO_E10 | 1/1/2000 |  | 47.5 |

3b.Adding multiple point events in a branched route

| RouteID | Event Layer | EventId | From Date | To Date | Measure |
| --- | --- | --- | --- | --- | --- |
| CO_R4 | Event1 | CO_E11 | 1/1/2000 |  | 10.59 |
| CO_R4 | Event2 | CO_E3 | 1/1/2000 |  | 10.59 |
| CO_R4 | Event3 | CO_E3 | 1/1/2000 |  | 10.59 |
| CO_R4 | Event1 | CO_E12 | 1/1/2000 |  | 25.3 |
| CO_R4 | Event2 | CO_E4 | 1/1/2000 |  | 25.3 |
| CO_R4 | Event3 | CO_E4 | 1/1/2000 |  | 25.3 |

| Measure |
| --- |
| 14 |
| 71 |

| Measure |
| --- |
| 10.59 |
| 40 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |

[figure: CO_R3 · CO_E9 · CO_R4 · x · CO_E10 · 25.3 · 10.59 · 40 · CO_E11 CO_E3 CO_E3 · CO_E12 CO_E4 CO_E4]

![Figure 3 — 3. Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-03-slide-05-3-coordinate-location-falling.png)
![Figure 4 — 3. Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-04-slide-05-3-coordinate-location-falling.png)

![Figure 5 — 3. Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-05-slide-05-3-coordinate-location-falling.svg)

### TC-U04 — Coordinate location falling out of the route and the nearest location (case 4) <!-- src: S2 · slide 6 · case 4 -->

- **Case:** Coordinate location falling out of the route and the nearest location on the route has more than one measure. (XYZ

| RouteId | Event Layer | EventId | From Date | To Date | Measure |
| --- | --- | --- | --- | --- | --- |
| CO_R5 | Event1 | CO_E13 | 1/1/2000 |  | 40 |
| CO_R5 | Event1 | CO_E14 | 1/1/2000 |  | 15 |

4b.Adding multiple point events in a lollipop route

| RouteId | Event Layer | EventId | FromDate | To Date | Measure |
| --- | --- | --- | --- | --- | --- |
| CO_R6 | Event1 | CO_E15 | 1/1/2000 |  | 70 |
| CO_R6 | Event2 | CO_E4 | 1/1/2000 |  | 70 |
| CO_R6 | Event3 | CO_E4 | 1/1/2000 |  | 70 |

| Measure |
| --- |
| 0 |
| 40 |

| Measure |
| --- |
| 30 |
| 70 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y | 0.02 |
| X/Y | X,Y | 0.02 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y | 0.02 |
| X/Y | X,Y | 0.02 |
| X/Y | X,Y | 0.02 |

[figure: CO_E13 · CO_E14 · CO_R6 · x · CO_R5 · CO_E15 CO_E4 CO_E4]

![Figure 6 — 4. Coordinate location falling out of the route and the nearest location on the route has more than one measure. (XYZ](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-06-slide-06-4-coordinate-location-falling-out.png)
![Figure 7 — 4. Coordinate location falling out of the route and the nearest location on the route has more than one measure. (XYZ](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-07-slide-06-4-coordinate-location-falling-out.png)

![Figure 8 — 4. Coordinate location falling out of the route and the nearest location on the route has more than one measure. (XYZ](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-08-slide-06-4-coordinate-location-falling-out.svg)

### TC-U05 — Vertical Route 5a.Adding a point event in a vertical route having same xy <!-- src: S2 · slide 7 · case 5 -->

- **Case:** Vertical Route 5a.Adding a point event in a vertical route having same xy and diff z.

| RouteId | Event Layer | EventId | FromDate | To Date | Measure |
| --- | --- | --- | --- | --- | --- |
| CO_R7 | Event1 | CO_E16 | 1/1/2000 |  | 1 |
| CO_R7 | Event1 | CO_E17 | 1/1/2000 |  | 2 |
| CO_R7 | Event1 | CO_E18 | 1/1/2000 |  | 8 |

5b. Adding multiple point events in a vertical route having same xy and diff z.

| RouteId | Event Layer | EventId | FromDate | To Date | Measure |
| --- | --- | --- | --- | --- | --- |
| CO_R8 | Event1 | CO_E19 | 1/1/2000 |  | 2 |
| CO_R8 | Event2 | CO_E5 | 1/1/2000 |  | 2 |
| CO_R8 | Event3 | CO_E5 | 1/1/2000 |  | 2 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y,Z | 0 |
| X/Y | X,Y,Z | 0.01 |
| X/Y | X,Y,Z | 0 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y,Z | 0 |
| X/Y | X,Y,Z | 0 |
| X/Y | X,Y,Z | 0 |

[figure: CO_E19 CO_E5 CO_E5 · CO_R8 · CO_E17 · x · CO_R7 · CO_E16 · CO_E18 · 2]

![Figure 9 — 5. Vertical Route 5a.Adding a point event in a vertical route having same xy and diff z.](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-09-slide-07-5-vertical-route-5a-adding-a-point-event.png)
![Figure 10 — 5. Vertical Route 5a.Adding a point event in a vertical route having same xy and diff z.](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-10-slide-07-5-vertical-route-5a-adding-a-point-event.png)

![Figure 11 — 5. Vertical Route 5a.Adding a point event in a vertical route having same xy and diff z.](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-11-slide-07-5-vertical-route-5a-adding-a-point-event.svg)

### TC-U06 — Line Network 6a.Adding a point event in a line network . <!-- src: S2 · slide 8 · case 6 -->

| LineID | RouteID | Event Layer | EventId | From Date | To Date | Measure |
| --- | --- | --- | --- | --- | --- | --- |
| L2 | R2L2 | EventL1 | CO_E10 | 1/1/2000 |  | 200 |
| L2 | R4L2 | EventL1 | CO_E2 | 1/1/2000 |  | 110 |
| L2 | R5L2 | EventL1 | CO_E3 | 1/1/2000 |  | 10 |

6b. Adding multiple  point events in a line network

| LineID | RouteID | Event Layer | EventId | From Date | To Date | Measure |
| --- | --- | --- | --- | --- | --- | --- |
| L2 | R1L2 | EventL1 | CO_E4 | 1/1/2000 |  | 2 |
| L2 | R1L2 | EventL2 | CO_E1 | 1/1/2000 |  | 2 |
| L2 | R1L2 | EventL3 | CO_E1 | 1/1/2000 |  | 2 |
| L2 | R3L2 | EventL1 | CO_E5 | 1/1/2000 |  | 2 |
| L2 | R3L2 | EventL2 | CO_E2 | 1/1/2000 |  | 2 |
| L2 | R3L2 | EventL3 | CO_E2 | 1/1/2000 |  | 2 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0.01 |
| X/Y | X,Y | 0 |

| Ref Method | Ref location | Ref offset |
| --- | --- | --- |
| X/Y | X,Y | 0.01 |
| X/Y | X,Y | 0.01 |
| X/Y | X,Y | 0.01 |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |
| X/Y | X,Y | 0 |

[figure: 0 · 200 · 10 · 100 · 1 0 · x · CO_E1 · CO_E2 · CO_E3 · CO_E4 CO_E1 CO_E1 · CO_E5 CO_E2 CO_E2]

![Figure 12 — 6. Line Network 6a.Adding a point event in a line network .](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-12-slide-08-6-line-network-6a-adding-a-point-event.png)

![Figure 13 — 6. Line Network 6a.Adding a point event in a line network .](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-13-slide-08-6-line-network-6a-adding-a-point-event.svg)

### TC-U07 — Adding point event with time slices Event dates are from null to null For event <!-- src: S2 · slide 9 · case 7a -->

- **Case:** Adding point event with time slices Event dates are from null to null For event CO_E20 - coordinates fall exactly

| RouteID | Event Layer | EventId | From Date | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| CO_R9 | Event1 | CO_E20 | Null | 1/1/2000 | 9 | Route not found |
| CO_R9 | Event1 | CO_E20 | 1/1/2000 | 1/1/2010 | 9 | No Error |
| CO_R9 | Event1 | CO_E20 | 1/1/2010 | 1/1/2020 | 9 | No Error |
| CO_R9 | Event1 | CO_E20 | 1/1/2020 | Null | 9 | Route not found |
| CO_R9 | Event1 | CO_E21 | Null | 1/1/2010 | 14 | Route not found |
| CO_R9 | Event1 | CO_E21 | 1/1/2010 | 1/1/2020 | 14 | No Error |
| CO_R9 | Event1 | CO_E21 | 1/1/2020 | Null | 14 | Route not found |

| RouteID | From Date | To Date | F M | To M |
| --- | --- | --- | --- | --- |
| CO_R9 | 1/1/2000 | 1/1/2010 | 0 | 10 |
| CO_R9 | 1/1/2010 | 1/1/2020 | 0 | 15 |

[figure: CO_R9 · 0 · 10 · 15 · x · CO_E20 · CO_E21]

![Figure 14 — 7a. Adding point event with time slices Event dates are from null to null For event CO_E20 - coordinates fall exactly](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-14-slide-09-7a-adding-point-event-with-time-slices.svg)

### TC-U08 — Adding point event with time slices Event dates are from null to null. Location <!-- src: S2 · slide 10 · case 7a -->

- **Case:** Adding point event with time slices Event dates are from null to null. Location Errors (Route not found) record

| RouteID | Event Layer | EventId | From Date | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| CO_R10 | Event1 | CO_E22 | Null | 1/1/2000 | 5 | Route not found |
| CO_R10 | Event1 | CO_E22 | 1/1/2000 | 1/1/2010 | 5 | No Error |
| CO_R10 | Event1 | CO_E22 | 1/1/2010 | 1/1/2020 | 5 | No Error |
| CO_R10 | Event1 | CO_E22 | 1/1/2020 | Null | 5 | Route not found |
| CO_R10 | Event2 | CO_E6 | Null | 1/1/2000 | 5 | Route not found |
| CO_R10 | Event2 | CO_E6 | 1/1/2000 | 1/1/2010 | 5 | No Error |
| CO_R10 | Event2 | CO_E6 | 1/1/2010 | 1/1/2020 | 5 | No Error |
| CO_R10 | Event2 | CO_E6 | 1/1/2020 | Null | 5 | Route not found |
| CO_R10 | Event3 | CO_E6 | Null | 1/1/2000 | 5 | Route not found |
| CO_R10 | Event3 | CO_E6 | 1/1/2000 | 1/1/2010 | 5 | No Error |
| CO_R10 | Event3 | CO_E6 | 1/1/2010 | 1/1/2020 | 5 | No Error |
| CO_R10 | Event3 | CO_E6 | 1/1/2020 | Null | 5 | Route not found |
| CO_R10 | Event1 | CO_E23 | Null | 1/1/2000 | 14 | Route not found |
| CO_R10 | Event1 | CO_E21 | 1/1/2000 | 1/1/2020 | 14 | No Error |
| CO_R10 | Event1 | CO_E21 | 1/1/2020 | Null | 14 | Route not found |

| RouteID | From Date | To Date | F M | To M |
| --- | --- | --- | --- | --- |
| CO_R10 | 1/1/2000 | 1/1/2010 | 0 | 10 |
| CO_R10 | 1/1/2010 | 1/1/2020 | 0 | 15 |

[figure: CO_R10 · 0 · 10 · 15 · x · CO_E22 CO_E6 CO_E6 · CO_E23 CO_E7 CO_E7]

![Figure 15 — 7a. Adding point event with time slices Event dates are from null to null. Location Errors (Route not found) record](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-15-slide-10-7a-adding-point-event-with-time-slices.svg)

### TC-U09 — Coordinate location falling on route (case 1) <!-- src: S2 · slide 11 · case 1 -->

- **Case:** Coordinate location falling on route (XYZ coordinates is provided by typing the value) for X marked location) 1a.

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | FromRef Method | FromRefLoc | FromRefOffset | ToRefMethod | ToRef Loc | ToRef offset | Sign |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LEA | LEA1 | R1 | 2 | 6 | 1/1/2000 |  | X/Y | -300,-300 | 0 | X/Y | -400,-400 | 0 | 111 |

1b.  Adding multiple line events on a simple route with multi field ID

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | sign |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MLA | MLA1 | RM1 | 2 | 6 | 1/1/2000 |  | 222 |
| MLB | MLB1 | RM1 | 2 | 6 | 1/1/2000 |  | 223 |

[figure: LEA1 · x · RM1 · MLA1 MLB1]

![Figure 16 — 1. Coordinate location falling on route (XYZ coordinates is provided by typing the value) for X marked location) 1a.](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-16-slide-11-1-coordinate-location-falling-on-route.png)

![Figure 17 — 1. Coordinate location falling on route (XYZ coordinates is provided by typing the value) for X marked location) 1a.](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-17-slide-11-1-coordinate-location-falling-on-route.svg)

### TC-U10 — Coordinate location not falling on the route(XYZ location is provided (case 2) <!-- src: S2 · slide 12 · case 2 -->

- **Case:** Coordinate location not falling on the route(XYZ location is provided for location and event is placed on nearest

2b.Adding multiple line events in a gapped route with single field route ID

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | sign |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SLA | SLA1 | RS2 | 2 | 7 | 1/1/2000 |  | 331 |
| SLB | SLB1 | RS2 | 2 | 7 | 1/1/2000 |  | 332 |

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | FromRef Method | FromRefLoc | FromRefOffset | ToRefMethod | ToRef Loc | ToRef offset | sign |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LEA | LEA2 | R7b | 4 | 6 | 1/1/2000 |  | X/Y | -300,-300 | 0 | X/Y | -400,-400 | 0 | 112 |
| LEA | LEA2 | R7b | 8 | 8.7 | 1/1/2000 |  | X/Y | -400,-400 | 0 | X/Y | -500,-500 | 0 | 112 |

To continuous_auto, RID, 6
From continuous_auto, RID, 8

[figure: RS2 · R7b · x · LEA2 · SLA1 SLB1 · LEA3]

![Figure 18 — 2. Coordinate location not falling on the route(XYZ location is provided for location and event is placed on nearest](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-18-slide-12-2-coordinate-location-not-falling.png)
![Figure 19 — 2. Coordinate location not falling on the route(XYZ location is provided for location and event is placed on nearest](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-19-slide-12-2-coordinate-location-not-falling.png)

![Figure 20 — 2. Coordinate location not falling on the route(XYZ location is provided for location and event is placed on nearest](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-20-slide-12-2-coordinate-location-not-falling.svg)

### TC-U11 — Coordinate location falling on the route where there is more than one measure (case 3) <!-- src: S2 · slide 13 · case 3 -->

- **Case:** Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked

3b.Adding multiple line events in a branched route with multi field route ID

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | FromRef Method | FromRefLoc | FromRefOffset | ToRefMethod | ToRef Loc | ToRef offset | sign |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LEA | LEA4 | R16 | 2 | 14 | 1/1/2000 |  | X/Y | -300,-300 | 0 | X/Y | -300,-300 | 0 | 113 |

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | sign |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MLA | MLA2 | RM5 | 2 | 5 | 1/1/2000 |  | 224 |
| MLB | MLB2 | RM5 | 2 | 5 | 1/1/2000 |  | 225 |

[figure: R16 · LEA4 · 2, 14 · x · RM5 · 2, 4 · MLA2 MLB2]

![Figure 21 — 3. Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-21-slide-13-3-coordinate-location-falling.png)
![Figure 22 — 3. Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-22-slide-13-3-coordinate-location-falling.png)

![Figure 23 — 3. Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-23-slide-13-3-coordinate-location-falling.svg)

### TC-U12 — Coordinate location falling out of the route and the nearest location (case 4) <!-- src: S2 · slide 14 · case 4 -->

- **Case:** Coordinate location falling out of the route and the nearest location on the route has more than one measure. (XYZ

4b.Adding multiple line events in a lollipop route

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | sign |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MLA | MLA3 | RM3 | 1 | 5 | 1/1/2000 |  | 226 |

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | FromRef Method | FromRefLoc | FromRefOffset | ToRefMethod | ToRef Loc | ToRef offset | sign |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LEA | LEA5 | R12 | 1 | 14 | 1/1/2000 |  | X/Y | -300,-300 | 0 | X/Y | -400,-400 | 0 | 115 |
| LEB | LEB1 | R12 | 1 | 14 | 1/1/2000 |  | X/Y | -400,-400 | 0 | X/Y | -500,-500 | 0 | 116 |

[figure: RM3 · 2, 14 · x · LEA5 LEB1 · MLA3]

![Figure 24 — 4. Coordinate location falling out of the route and the nearest location on the route has more than one measure. (XYZ](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-24-slide-14-4-coordinate-location-falling-out.svg)

### TC-U13 — Vertical Route 5a.Adding a line event in a vertical route with auto generated <!-- src: S2 · slide 15 · case 5 -->

- **Case:** Vertical Route 5a.Adding a line event in a vertical route with auto generated route ID; same xy and diff z.

5b. Adding multiple line events in a vertical route with single field route ID; diff xy and diff z.

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | FromRef Method | FromRefLoc | FromRefOffset | ToRefMethod | ToRef Loc | ToRef offset | sign |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LEA | LEA5 | V23 | 2 | 4 | 1/1/2000 |  | X/Y | 100,100,200 | 0 | X/Y | 100,100,400 | 0 | 114 |

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | sign |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MLA | MLA4 | V23 | 2 | 10 | 1/1/2000 |  | 227 |
| MLB | MLB3 | V23 | 2 | 10 | 1/1/2000 |  | 228 |

Info always saved as the event’s coor system

[figure: x · LEA6 · MLA4 MLB3]

![Figure 25 — 5. Vertical Route 5a.Adding a line event in a vertical route with auto generated route ID; same xy and diff z.](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-25-slide-15-5-vertical-route-5a-adding-a-line-event.svg)

### TC-U14 — Line Network 6a.Adding a spanning line event in a line network . <!-- src: S2 · slide 16 · case 6 -->

6b. Adding multiple line events in a line network

| Event Layer | EventId | FromRouteID | FromMeasure | ToRouteID | ToMeasure | From Date | To Date | FromRef Method | FromRefLoc | FromRefOffset | ToRefMethod | ToRef Loc | ToRef offset | sign |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| span | span1 | L10R1 | 2 | L10R2 | 0.5 | 1/1/2000 |  | X/Y | -300,-300 | 0 | X/Y | -200,-200 | 0 | 441 |

| Event Layer | EventId | FromRouteID | FromMeasure | ToRouteID | ToMeasure | From Date | To Date | FromRef Method | FromRefLoc | FromRefOffset | ToRefMethod | ToRef Loc | ToRef offset | sign |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| span | span2 | L13R1 | 2 | L13R3 | 0 | 1/1/2000 |  | X/Y | -300,-300 | 0 | X/Y | -200,-200 | 0 | 442 |

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | sign |
| --- | --- | --- | --- | --- | --- | --- | --- |
| stayput | Stayput1 | L13R1 | 2 | 6 | 1/1/2000 |  | 551 |
| stayput | stayput2 | L13R2 | 0 | 2 | 1/1/2000 |  | 552 |

Create another line- line event that is non-spanning, with referent to check F/T refloc for the separated parts

[figure: 0 · 6 · 2 · 50 · x · L10R1 · L10R2 · L10R3 · L13R1 · L13R2 · L13R3 · span1 · span2 Non-spanning1]

![Figure 26 — 6. Line Network 6a.Adding a spanning line event in a line network .](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-26-slide-16-6-line-network-6a-adding-a-spanning-line.svg)

### TC-U15 — Adding line event with time slices Event dates are from null to null coordinates <!-- src: S2 · slide 17 · case 7a -->

- **Case:** Adding line event with time slices Event dates are from null to null coordinates fall exactly on the route.

| RouteID | From Date | To Date | F M | To M |
| --- | --- | --- | --- | --- |
| Time1 | 1/1/2000 | 1/1/2010 | 0 | 10 |
| TIme1 | 1/1/2010 | 1/1/2020 | 0 | 15 |

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | sign | LocError |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SLA | SLA2 | Time1 | 2 | 5 | 1/1/2000 | 1/1/2010 | 334 | No Error |
| SLA | SLA3 | Time1 | 2 | 5 | 1/1/2010 | 1/1/2020 | 334 | No Error |
| SLA | SLA3 | Time1 | 2 | 5 | 1/1/2020 | null | 334 | Rt not found |
| SLA | SLA4 | Time1 | 11 | 13 | 1/1/2010 | 1/1/2020 | 337 | No Error |
| SLA | SLA4 | Time1 | 11 | 13 | 1/1/2020 | null | 337 | Rt not found |

[figure: Time1 · 0 · 10 · 15 · x · SLA2 SLA3 · SLA4]

![Figure 27 — 7a. Adding line event with time slices Event dates are from null to null coordinates fall exactly on the route.](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-27-slide-17-7a-adding-line-event-with-time-slices.svg)

### TC-U16 — Adding line event with time slices Event dates are from null to null. Location <!-- src: S2 · slide 18 · case 7a -->

- **Case:** Adding line event with time slices Event dates are from null to null. Location Errors record should not show up for

| RouteID | From Date | To Date | F M | To M |
| --- | --- | --- | --- | --- |
| Time2 | 1/1/2000 | 1/1/2010 | 0 | 10 |
| Time2 | 1/1/2010 | 1/1/2020 | 0 | 15 |

| Event Layer | EventId | FromRouteID | FromMeasure | ToMeasure | From Date | To Date | sign | LocError |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SLA | SLA5 | Time2 | 2 | 5 | 1/1/2000 | 1/1/2010 | 306 | No Error |
| SLB | SLB2 | Time2 | 2 | 5 | 1/1/2000 | 1/1/2010 | 307 | No Error |
| SLA | SLA6 | Time2 | 2 | 5 | 1/1/2010 | 1/1/2020 | 308 | No Error |
| SLB | SLB3 | Time2 | 2 | 5 | 1/1/2010 | 1/1/2020 | 309 | No Error |
| SLA | SLA7 | Time2 | 11 | 13 | 1/1/2010 | 1/1/2020 | 314 | No Error |
| SLB | SLB4 | Time2 | 11 | 13 | 1/1/2010 | 1/1/2020 | 315 | No Error |

[figure: Time2 · 0 · 10 · 15 · x · SLA5 SLA6 · SLA7 · SLB2 SLB3 · SLB4]

![Figure 28 — 7a. Adding line event with time slices Event dates are from null to null. Location Errors record should not show up for](../media/24791-coordinates-method-in-add-point-and-add-line-widgets/fig-28-slide-18-7a-adding-line-event-with-time-slices.svg)

## Other content

### Slide 1 — Devtopia Issue <!-- slide 1 -->

Coordinates Method in Add Point and Add Line Widgets

**Notes**
- Add Coordinates method functionality to the Add Point and Add Line Event widgets
- Widgets will use same coordinate logic as in the Search by Route widget’s Coordinates method
- Test with nonline (auto-generated, single-field, and multi-field RouteID configurations) and line networks
- Test with different coordinate systems (Web Map, LRS, WGS_1984, etc.)
- Test conflict prevention continues to work as expected
- Sanity test Merge coincident events and Retire overlapping events data validation options
- i18n and 508
- Referent population will not be part of this user story
- Use Pro Coordinates method test cases for testing
- Sanity test Search by Route widget’s Coordinate search functionality
