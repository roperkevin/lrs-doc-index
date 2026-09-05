# Add Point Event tool/ Add Multipoint Events tool Coordinate offset method – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 638 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#3905](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3905) |
| **Source** | [CoordinateoffsetMethod -Add point_Multi point events tool.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/CoordinateoffsetMethod%20-Add%20point_Multi%20point%20events%20tool.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev — |
| **Edited** | 2022-08-22 22:47 by Lakshmi Ananthanarayanan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | coordinate offset · point event · multipoint event · route · measure · spatial reference · error message |
| **Tools** | Add Point Event · Multipoint Events |

## Summary

Test plan for the Add Point Event and Multipoint Events tools using the coordinate offset method. Covers testing on feature services, nonline and line networks, projected and unprojected data, and events with and without referents. Includes UI verification, spatial reference handling, error message validation, and multiple scenarios of event placement on routes including branched, lollipop, vertical, and line networks.

## Related documents

<!-- related:begin -->
- [Add Point Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-point-event-tools-coordinate-offset-method.md>) — similar text 0.31 · 6 title words · 4 filename words · same surface <!-- rel:658 s=6.918 -->
- [Add Line Event Tool Coordinate Offset Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/3911-add-line-event-tool-coordinate-offset-method.md>) — similar text 0.42 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:636 s=6.607 -->
- [Add Line Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tools-coordinate-offset-method.md>) — similar text 0.32 · 5 title words · 3 filename words · same surface <!-- rel:648 s=5.857 -->
- [Add Multiple Point Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/add-multiple-point-events-2022-04.md>) — similar text 0.22 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:672 s=5.796 -->
- [Add Multiple Point Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-multiple-point-events-2024-01.md>) — similar text 0.25 · 3 title words · 3 filename words · same kind/folder <!-- rel:434 s=5.066 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Multipoint Events](https://www.google.com/search?q=%22Multipoint%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Add Point Event tool/ Add Multipoint Events tool Coordinate offset method – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3905

### Slide 2 <!-- slide 2 -->

Data:

- Test in Feature Service only.
- Test for tools -  Add point event and Multipoint event
- Test on Nonline Network & Line Network
- Test in both projected and unprojected data
- Point events should have with and without referents configured.
Verification
General UI verification

- Verify in the panes the labels of the field are of same font size and aligned left
- Verify all the editable fields are of white background and of same size and are aligned properly
- Verify the icons provided in a pane are of same size and aligned properly
- i18n and 508 testing. Verify testing in Arabic and german especially (X,Y coordinates value in referent table)

First pane

- In Add point event and Multipoint event a drop down option should be shown with “Using coordinates” method
- Default should be “Route and Measure” method

![Figure 1 — 2](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-01-slide-02-2.png)

## Test Cases

### TC-U01 — For Line Network Display the Corresponding Network. <!-- src: S1 · slide 3 · case 9a -->

Second Pane
Event Layer

- Verify the default event layer is the first point event layer of the map
Network

- Verify that the network selected is automatically set to the registered network for the selected event layer
- Verify that the label “Using Coordinates” is shown
RouteID /Route Name

- Verify the ‘Route Name” is displayed instead of route id for the events configured with route name
- Verify that the RouteID should be empty until the user fills
- Verify that the RouteID can be typed or picked.

GC Factor

- Verify by using a  nonzero GC factor and check whether the coordinates are adjusted accordingly
- Verify the tool runs successfully without providing a GC factor
- Verify that the route selector UI is
        shown when the user types in a
        routeID/Name  which  has more than one time slice

![Figure 2 — 3](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-02-slide-03-3.png)
![Figure 3 — 3](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-03-slide-03-3.png)

### TC-U02 — Provided XYZ coordinates cannot be located on the map <!-- src: S3 · slide 6 · table · 1 -->

- **ID:** 1
- **Expected Result:** Error

### TC-U03 — Typed invalid values for XYZ <!-- src: S3 · slide 6 · table · 2 -->

- **ID:** 2
- **Expected Result:** Error

### TC-U04 — Provide zero for the GC factor <!-- src: S3 · slide 6 · table · 3 -->

- **ID:** 3
- **Expected Result:** Error
- **Error Message:** Value of GC factor is invalid

### TC-U05 — Provide invalid value for GC factor <!-- src: S3 · slide 6 · table · 4 -->

- **ID:** 4
- **Expected Result:** Error
- **Error Message:** Value of GC factor is invalid

### TC-U06 — Typed in RouteID/ Route Name does not exist in the network <!-- src: S3 · slide 6 · table · 5 -->

- **ID:** 5
- **Expected Result:** Error

### TC-U07 — In the map, event layer and the network layer are in different versions <!-- src: S3 · slide 6 · table · 6 -->

- **ID:** 6
- **Expected Result:** Error
- **Error Message:** The event layer and network layer are in different versions

### TC-U08 — RouteID is null <!-- src: S3 · slide 6 · table · 7 -->

- **ID:** 7
- **Expected Result:** Error

### TC-U09 — User provides only end date. <!-- src: S3 · slide 6 · table · 8 -->

- **ID:** 8
- **Expected Result:** Error
- **Error Message:** Enter a start date.

### TC-U10 — User do not provide any dates. <!-- src: S3 · slide 6 · table · 9 -->

- **ID:** 9
- **Expected Result:** Error
- **Error Message:** Enter a start date

### TC-U11 — User clicks on without providing any values. <!-- src: S3 · slide 6 · table · 10 -->

- **ID:** 10
- **Expected Result:** Error
- **Error Message:** Enter the Route Name.

### TC-U12 — Route is not available for the provide date <!-- src: S3 · slide 6 · table · 11 -->

- **ID:** 11
- **Expected Result:** Error
- **Error Message:** Route not available in the provided date range.

### TC-U13 — Coordinate location falling on route <!-- src: S2 · slide 7 · case 1 -->

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

![Figure 5 — 1. Coordinate location falling on route (XYZ coordinates is provided by typing the value) for X marked location) 1a.](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-05-slide-07-1-coordinate-location-falling-on-route.svg)

### TC-U14 — Coordinate location not falling on the route(XYZ location is provided <!-- src: S2 · slide 8 · case 2 -->

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

![Figure 6 — 2. Coordinate location not falling on the route(XYZ location is provided for location and event is placed on nearest](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-06-slide-08-2-coordinate-location-not-falling.svg)

### TC-U15 — Coordinate location falling on the route where there is more than one measure <!-- src: S2 · slide 9 · case 3 -->

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

![Figure 7 — 3. Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-07-slide-09-3-coordinate-location-falling.png)
![Figure 8 — 3. Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-08-slide-09-3-coordinate-location-falling.png)

![Figure 9 — 3. Coordinate location falling on the route where there is more than one measure (XYZ location is provided for X marked](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-09-slide-09-3-coordinate-location-falling.svg)

### TC-U16 — Coordinate location falling out of the route and the nearest location <!-- src: S2 · slide 10 · case 4 -->

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

![Figure 10 — 4. Coordinate location falling out of the route and the nearest location on the route has more than one measure. (XYZ](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-10-slide-10-4-coordinate-location-falling-out.png)
![Figure 11 — 4. Coordinate location falling out of the route and the nearest location on the route has more than one measure. (XYZ](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-11-slide-10-4-coordinate-location-falling-out.png)

![Figure 12 — 4. Coordinate location falling out of the route and the nearest location on the route has more than one measure. (XYZ](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-12-slide-10-4-coordinate-location-falling-out.svg)

### TC-U17 — Vertical Route 5a.Adding a point event in a vertical route having same xy <!-- src: S2 · slide 11 · case 5 -->

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

![Figure 13 — 5. Vertical Route 5a.Adding a point event in a vertical route having same xy and diff z.](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-13-slide-11-5-vertical-route-5a-adding-a-point-event.png)
![Figure 14 — 5. Vertical Route 5a.Adding a point event in a vertical route having same xy and diff z.](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-14-slide-11-5-vertical-route-5a-adding-a-point-event.png)

![Figure 15 — 5. Vertical Route 5a.Adding a point event in a vertical route having same xy and diff z.](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-15-slide-11-5-vertical-route-5a-adding-a-point-event.svg)

### TC-U18 — Line Network 6a.Adding a point event in a line network . <!-- src: S2 · slide 12 · case 6 -->

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

![Figure 16 — 6. Line Network 6a.Adding a point event in a line network .](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-16-slide-12-6-line-network-6a-adding-a-point-event.png)

![Figure 17 — 6. Line Network 6a.Adding a point event in a line network .](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-17-slide-12-6-line-network-6a-adding-a-point-event.svg)

### TC-U19 — Adding point event with time slices Event dates are from null to null For event <!-- src: S2 · slide 13 · case 7a -->

- **Case:** Adding point event with time slices Event dates are from null to null For event CO_E20 - coordinates fall exactly

| RouteID | Event Layer | EventId | From Date | To Date | Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| CO_R9 | Event1 | CO_E20 | Null | 1/1/2000 | 9 | Route not found |
| CO_R9 | Event1 | CO_E20 | 1/1/2000 | 1/1/2010 | 9 | No Error |
| CO_R9 | Event1 | CO_E20 | 1/1/2010 | 1/1/2020 | 9 | No Error |
| CO_R9 | Event1 | CO_E20 | 1/1/2020 | Null | 9 | Route not found |
| CO_R9 | Event1 | CO_E21 | Null | 1/1/2000 | 14 | Route not found |
| CO_R9 | Event1 | CO_E21 | 1/1/2000 | 1/1/2020 | 14 | No Error |
| CO_R9 | Event1 | CO_E21 | 1/1/2020 | Null | 14 | Route not found |

| RouteID | From Date | To Date | F M | To M |
| --- | --- | --- | --- | --- |
| CO_R9 | 1/1/2000 | 1/1/2010 | 0 | 10 |
| CO_R9 | 1/1/2010 | 1/1/2020 | 0 | 15 |

[figure: CO_R9 · 0 · 10 · 15 · x · CO_E20 · CO_E21]

![Figure 18 — 7a. Adding point event with time slices Event dates are from null to null For event CO_E20 - coordinates fall exactly](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-18-slide-13-7a-adding-point-event-with-time-slices.svg)

### TC-U20 — Adding point event with time slices Event dates are from null to null. Location <!-- src: S2 · slide 14 · case 7a -->

- **Case:** Adding point event with time slices Event dates are from null to null. Location Errors record should not show up

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

![Figure 19 — 7a. Adding point event with time slices Event dates are from null to null. Location Errors record should not show up](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-19-slide-14-7a-adding-point-event-with-time-slices.svg)

## Other content

### Slide 4 <!-- slide 4 -->

Second Pane
Spatial Reference

- Verify there are 3 spatial options for Spatial reference dropdown : LRS Spatial reference, Web map Spatial reference, GCS_WGS_1984.
- Verify the spatial references are honored by providing a different spatial reference to the map than the LRS one.
- If a location is already selected on the map, verify the coordinate value changes by changing the spatial reference
XYZ coordinates

- X, Y and Z should be shown for coordinates
- Verify Z value is optional& default is 0
- Verify the coordinates can be typed and picked from the map
- Verify the pickers work with snapping
- Verify the measure is displayed once the coordinates are located in the map with the network units and no of decimals matching the M tolerance of the network

![Figure 2 — 3](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-02-slide-03-3.png)
![Figure 3 — 3](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-03-slide-03-3.png)

### Slide 5 <!-- slide 5 -->

On the map

- Verify the chosen route remain selected
- The location of the coordinates is marked in small yellow square
- The route measure closest to the coordinates is shown with red mark

In the pane

- Verify that the route measure closest to the original coordinates is selected and the distance between the location and the chosen measure is shown as route measure distance in the pane

Dates

- Verify the start date defaults to todays date
- Verify the end date by default is empty
- Verify by checking the route start date and route end date the date fields are filled
- Verify the referent method configured event has X/Y as ref method , ref location and reference offset updated

(optional)

![Figure 4 — 5](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-04-slide-05-5.png)
![Figure 2 — 3](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-02-slide-03-3.png)
![Figure 3 — 3](../media/3905-add-point-event-tool-add-multipoint-events-tool-coordinate/fig-03-slide-03-3.png)

### Slide 6 <!-- slide 6 -->

Error message verification

Other verifications

- If the second pane is filled and users moves to the first pane the markers on the map and the details filled in the pane should remain
- If the user selects a different method, information in the second pane and markers in the map are cleared.
- For multipoint events tool if the 3rd pane where the event attributes are filled and if the users moves back to previous panes the information in the pane and map should remain intact.
- Few cases of conflict prevention will be tested through Pro as well as from REST.
