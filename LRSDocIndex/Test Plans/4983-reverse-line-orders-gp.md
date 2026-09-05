# Test Plan: Reverse Line Orders GP Tool

| Field | Value |
| --- | --- |
| **Doc** | 547 · Test Plan · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4983](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4983) |
| **Source** | [ReverseLineOrderstool_TestPlan_JK.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ReverseLineOrderstool_TestPlan_JK.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev — |
| **Edited** | 2023-06-13 20:45 by Johum Khushk |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reverse line order · line order · route · line network · derived network · conflict prevention · time sliced routes |
| **Tools** | Reverse Line Orders |

## Summary

This test plan covers verification and negative test cases for the Reverse Line Orders geoprocessing tool used on line networks. It includes tests for functionality with different route selections, time slices, conflict prevention, and derived network generation to ensure line order reversal behaves correctly without affecting route direction or calibration.

## Related documents

<!-- related:begin -->
- [Reverse Line Orders tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reverse-line-orders-tool.md>) — similar text 0.19 · 4 title words · 3 filename words · same surface <!-- rel:576 s=4.867 -->
- [Enhance Reverse Line Orders tool to create common time slice](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/enhance-reverse-line-orders-tool-to-create-common-time-slice.md>) — similar text 0.22 · 4 title words · 2 filename words · same surface <!-- rel:530 s=4.604 -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing.md>) — similar text 0.10 · 2 title words · 2 filename words · same surface <!-- rel:629 s=3.575 -->
- [Reassign UI Existing Line Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-ui-existing-line.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:535 s=3.481 -->
- [Append Routes: Line Order Check Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/4975-append-routes-line-order-check.md>) — similar text 0.12 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:564 s=3.473 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [Reverse Line Orders](https://www.google.com/search?q=%22Reverse%20Line%20Orders%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Test Plan: Reverse Line Orders GP Tool <!-- slide 1 -->

User Story: https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4983

Data

- Test in FS , DC & fgdb
- Test in APR, APR+UN
- Test for line network only
- Test in either projected or unprojected data
- Test with conflict prevention enabled (FS)

General GP tool verification

- Test with inline python
- Test with standalone python script
- Test with model-builder
- Test in model-builder in conjunction with other tools
- Verify by hitting cancel no changes are applied and the tool does not modify the input

### Slide 2 <!-- slide 2 -->

Verification
5. Verify  irrespective of a single route / multiple routes selected in a line all the routes on the line should have their line order reversed. The line order continuity should make sense.

- Verify the tool requires a selection set for reversing the line order. Do we display an error if no route is selected in the network – yes an error is displayed.
- Verify the input is network feature class only – no table input.
- Verify the tool supports line network only and do not support post mile network.
- Verify locks are acquired for the line when conflict prevention is enabled.
- If the tool completes, verify the log file contains correct information.
- Verify the error messages for the negative test cases.
- After reversing the route, generate derived network and verify the derived network follows the reversed line order.
- Verify the direction of calibration of the route remains unchanged after reversing the line order.
- Run the tool which will reverse the line order. Then run the tool again which should flip the line order to the initial state.

![Figure 1 — 2](../media/4983-reverse-line-orders-gp/fig-01-slide-02-2.png)

## Test Cases

### TC-N01 — Input feature class is not a network <!-- src: S4 · slide 3 · Negative Test Cases · 1 -->

- **Group:** Cases

### TC-N02 — Input network feature class does not have any selection <!-- src: S4 · slide 3 · Negative Test Cases · 2 -->

- **Group:** Cases

### TC-N03 — Input feature class is nonline network <!-- src: S4 · slide 3 · Negative Test Cases · 3 -->

- **Group:** Cases

### TC-N04 — Input feature class is postmile network <!-- src: S4 · slide 3 · Negative Test Cases · 4 -->

- **Group:** Cases

### TC-U01 — In a Line, Select All the Routes and Reverse, Line Order Are Reversed. <!-- src: S1 · slide 4 · case 30 -->

Test Cases

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 500 |
| R2L1 | 1/1/2000 | Null | 200 | 400 |
| R3L1 | 1/1/2000 | Null | 300 | 300 |
| R4L1 | 1/1/2020 | Null | 400 | 200 |
| R5L1 | 1/1/2000 | Null | 500 | 100 |

The route direction and calibration remains intact, and no changes are made on the routes. After reversing the line order, check the derived network by running generate routes for the derived route network.

- Add a usage note the user need to run GR tool to update the shape of D network.

[figure: Input · Output · R1L1 · R2L1 · R3L1 · R4L1 · 500 · 400 · 300 · 200 · R5L1 · 100 · 1 · 5 · 105 · 110 · 115 · 10 · 15 · 60 · 65 · D1 · 0 · 25]

![Figure 2 — Test Cases](../media/4983-reverse-line-orders-gp/fig-02-slide-04-test-cases.svg)

### TC-U02 — In a Line, Select All the Routes and Reverse (case 31) <!-- src: S1 · slide 5 · case 31 -->

- **Case:** In a line, select all the routes and reverse, line order reversed. Line orders are different from 100 but still monotonic

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 1 | 5 |
| R2L1 | 1/1/2000 | Null | 2 | 4 |
| R3L1 | 1/1/2000 | Null | 3 | 3 |
| R4L1 | 1/1/2020 | Null | 4 | 2 |
| R5L1 | 1/1/2000 | Null | 5 | 1 |

The route direction and calibration remains intact, and no changes are made on the routes. After reversing the line order, check the derived network by running generate routes for the derived route network.

[figure: R1L1 · R2L1 · R3L1 · R4L1 · 1–4 · R5L1 · 5 · Input · 4 · 3 · 2 · 1 · Output · 10 · 15 · 100 · 105 · 60 · 65 · 110 · 115 · D1 · 0 · 25]

![Figure 3 — In a line, select all the routes and reverse, line order reversed. Line orders are different from 100 but still monotonic](../media/4983-reverse-line-orders-gp/fig-03-slide-05-in-a-line-select-all-the-routes.svg)

### TC-U03 — In a Line, Select All the Routes and Reverse (case 32) <!-- src: S1 · slide 6 · case 32 -->

- **Case:** In a line, select all the routes and reverse, line order reversed. Line orders are not monotonic, they are jumbled. *Check derived network generation

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 300 | 300 |
| R2L1 | 1/1/2000 | Null | 400 | 200 |
| R3L1 | 1/1/2000 | Null | 200 | 400 |
| R4L1 | 1/1/2020 | Null | 500 | 100 |
| R5L1 | 1/1/2000 | Null | 100 | 500 |

The route direction and calibration remains intact, and no changes are made on the routes. After reversing the line order, check the derived network by running generate routes for the derived route network.
Update the line order in the table,

See what happens to the derive network! And update the graphic

[figure: Input · R1L1 · R2L1 · R3L1 · R4L1 · 300 · 400 · 200 · 500 · R5L1 · 100 · Output · 1 · 5 · 10 · 15 · 105 · 60 · 65 · 110 · 115 · D1 · 0 · 25]

![Figure 4 — In a line, select all the routes and reverse, line order reversed. Line orders are not monotonic, they are jumbled. *Check derived network generation](../media/4983-reverse-line-orders-gp/fig-04-slide-06-in-a-line-select-all-the-routes.svg)

### TC-U04 — In a Line, Select Only the First Route and Run the Tool <!-- src: S1 · slide 7 · case 33 -->

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 500 |
| R2L1 | 1/1/2000 | Null | 200 | 400 |
| R3L1 | 1/1/2000 | Null | 300 | 300 |
| R4L1 | 1/1/2020 | Null | 400 | 200 |
| R5L1 | 1/1/2000 | Null | 500 | 100 |

The route direction and calibration remains intact, and no changes are made on the routes. All the routes in the line where the route is selected will have their line order changed . After reversing the line order, check the derived network by running generate routes for the derived route network.

[figure: Input · R1L1 · R2L1 · R3L1 · R4L1 · 100 · 200 · 300 · 400 · R5L1 · 500 · Output · 1 · 5 · 10 · 15 · 105 · 60 · 65 · 110 · 115 · D1 · 0 · 25]

![Figure 5 — In a line, select only the first route and run the tool](../media/4983-reverse-line-orders-gp/fig-05-slide-07-in-a-line-select-only-the-first-route.svg)

### TC-U05 — In a Line, Select Only Middle Routes & and Reverse. <!-- src: S1 · slide 8 · case 34 -->

- **Case:** In a line, select only middle routes(R3 & R4) and reverse.

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 500 |
| R2L1 | 1/1/2000 | Null | 200 | 400 |
| R3L1 | 1/1/2000 | Null | 300 | 300 |
| R4L1 | 1/1/2020 | Null | 400 | 200 |
| R5L1 | 1/1/2000 | Null | 500 | 100 |

The route direction and calibration remains intact, and no changes are made on the routes. All the routes in the line where the route is selected will have their line order changed . After reversing the line order, check the derived network by running generate routes for the derived route network.

[figure: R1L1 · R2L1 · R3L1 · R4L1 · 100 · 200 · 300 · 400 · R5L1 · 500 · Input · Output · 1 · 5 · 10 · 15 · 105 · 60 · 65 · 110 · 115 · D1 · 0 · 25]

![Figure 6 — In a line, select only middle routes(R3 & R4) and reverse.](../media/4983-reverse-line-orders-gp/fig-06-slide-08-in-a-line-select-only-middle-routes-r3.svg)

### TC-U06 — In a line, select only the last route and reverse <!-- src: S2 · slide 9 · case 35 -->

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 500 |
| R2L1 | 1/1/2000 | Null | 200 | 400 |
| R3L1 | 1/1/2000 | Null | 300 | 300 |
| R4L1 | 1/1/2020 | Null | 400 | 200 |
| R5L1 | 1/1/2000 | Null | 500 | 100 |

The route direction and calibration remains intact, and no changes are made on the routes. All the routes in the line where the route is selected will have their line order changed . After reversing the line order, check the derived network by running generate routes for the derived route network.

[figure: Input · R1L1 · R2L1 · R3L1 · R4L1 · 100 · 200 · 300 · 400 · R5L1 · 500 · Output · 1 · 5 · 10 · 15 · 105 · 60 · 65 · 110 · 115 · D1 · 0 · 25]

![Figure 7 — 35. In a line, select only the last route and reverse](../media/4983-reverse-line-orders-gp/fig-07-slide-09-35-in-a-line-select-only-the-last-route.svg)

### TC-U07 — In a Line, Select the Second Route , Routes Are in Opposite Direction. <!-- src: S1 · slide 10 · case 36 -->

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 200 |
| R2L1 | 1/1/2000 | Null | 200 | 100 |

The route direction and calibration remains intact, and no changes are made on the routes. All the routes in the line where the route is selected will have their line order changed . After reversing the line order, check the derived network by running generate routes for the derived route network.

[figure: R1L1 · R2L1 · 100 · 200 · Input · Output · 1 · 10 · 50 · 60 · 0 · 20 · D1]

![Figure 8 — In a line, select the second route , routes are in opposite direction.](../media/4983-reverse-line-orders-gp/fig-08-slide-10-in-a-line-select-the-second-route-routes.svg)

### TC-U08 — In a Line, Select Only One Middle Route and Reverse. <!-- src: S1 · slide 11 · case 37 -->

- **Case:** In a line, select only one middle route (R3L1)and reverse.

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 500 |
| R2L1 | 1/1/2000 | Null | 200 | 400 |
| R3L1 | 1/1/2000 | Null | 300 | 300 |
| R4L1 | 1/1/2020 | Null | 400 | 200 |
| R5L1 | 1/1/2000 | Null | 500 | 100 |

The route direction and calibration remains intact, and no changes are made on the routes. All the routes in the line where the route is selected will have their line order changed . After reversing the line order, check the derived network by running generate routes for the derived route network. Extra calibration point are added in the route. Verify there are no changes in the calibration of the route by reversing the line order

[figure: R1L1 · R2L1 · R3L1 · R4L1 · 100 · 200 · 300 · 400 · R5L1 · 500 · Input · Output · 0 · 5 · 15 · 10 · 105 · 65 · 60 · 115 · 110 · D1 · 25 · 4 · …]

![Figure 9 — In a line, select only one middle route (R3L1)and reverse.](../media/4983-reverse-line-orders-gp/fig-09-slide-11-in-a-line-select-only-one-middle-route.svg)

### TC-U09 — Closed line – Routes form a loop. (Route is selected) <!-- src: S2 · slide 12 · case 38 -->

- **Case:** Closed line – Routes form a loop. (Route R2L1 is selected)

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 300 |
| R2L1 | 1/1/2000 | Null | 200 | 200 |
| R3L1 | 1/1/2000 | Null | 300 | 100 |

The route direction and calibration remains intact, and no changes are made on the routes. All the routes in the line where the route is selected will have their line order changed . After reversing the line order, check the derived network by running generate routes for the derived route network.

[figure: Input · Output · R1L1 · R2L1 · R3L1 · 100 · 200 · 300 · D1 · 1 · 10 · 20 · 15 · 0 · 5]

![Figure 10 — 38. Closed line – Routes form a loop. (Route R2L1 is selected)](../media/4983-reverse-line-orders-gp/fig-10-slide-12-38-closed-line-routes-form-a-loop-route.svg)

### TC-U10 — Routes in a Line – Branch – Select All the Routes and Reverse Line Order <!-- src: S1 · slide 13 · case 39 -->

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 500 |
| R2L1 | 1/1/2000 | Null | 200 | 400 |
| R3L1 | 1/1/2000 | Null | 300 | 300 |
| R4L1 | 1/1/2000 | Null | 400 | 200 |
| r5L1 | 1/1/2000 | Null | 500 | 100 |

The route direction and calibration remains intact, and no changes are made on the routes. All the routes in the line where the route is selected will have their line order changed . After reversing the line order, check the derived network by running generate routes for the derived route network.

[figure: Input · Output · R5L1 · R1L1 · R2L1 · R3L1 · R4L1 · 500 · 100 · 200 · 300 · 400 · D1 · 25 · 0 · 5 · 10 · 15 · 20]

![Figure 11 — Routes in a line – Branch – select all the routes and reverse line order](../media/4983-reverse-line-orders-gp/fig-11-slide-13-routes-in-a-line-branch-select-all.svg)

### TC-U11 — Gapped routes – Gap between routes in a line (case 40) <!-- src: S2 · slide 14 · case 40 -->

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 300 |
| R2L1 | 1/1/2000 | Null | 200 | 200 |
| R3L1 | 1/1/2000 | Null | 300 | 100 |

[figure: Input · R1L1 · R2L1 · 100 · 200 · R3L1 · 300 · 1 · 5 · 15 · 105 · 115 · 110 · D1 · 25 · 0 · Output]

![Figure 12 — 40. Gapped routes – Gap between routes in a line](../media/4983-reverse-line-orders-gp/fig-12-slide-14-40-gapped-routes-gap-between-routes.svg)

### TC-U12 — Gapped routes – Gap between routes in a line (case 41) <!-- src: S2 · slide 15 · case 41 -->

| Route | From Date | To Date | Line Order<br>Input | Line order Output |
| --- | --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 | 400 |
| R2L1 | 1/1/2000 | Null | 200 | 300 |
| R3L1 | 1/1/2000 | Null | 300 | 200 |
| R4L1 | 1/1/2000 | Null | 400 | 100 |
|  |  |  |  |  |

[figure: Input · Output · R1L1 · R2L1 · 100 · 200 · R4L1 · 400 · 1 · 5 · 15 · 65 · 70 · D1 · 25 · 0 · R3L1 · 300 · 10 · 18 · 20]

![Figure 13 — 41. Gapped routes – Gap between routes in a line](../media/4983-reverse-line-orders-gp/fig-13-slide-15-41-gapped-routes-gap-between-routes.svg)

### TC-U13 — Time Sliced Routes – All Routes in a Line Have Similar Time Slices <!-- src: S1 · slide 16 · case 42 -->

Input ( Select time slice 1/1/2020 – Null of route R3L1)

| Time | Route | Line order |
| --- | --- | --- |
| 1/1/2000 – 1/1/2020 | R1L1 | 100 |
| 1/1/2000 – 1/1/2020 | R2L1 | 200 |
| 1/1/2000 – 1/1/2020 | R3L1 | 300 |
| 1/1/2000 – 1/1/2020 | R4L1 | 400 |
| 1/1/2000 – 1/1/2020 | R5L1 | 500 |

| Time | Route | Line order |
| --- | --- | --- |
| 1/1/2020 – Null | R1L1 | 100 |
| 1/1/2020 – Null | R2L1 | 200 |
| 1/1/2020 – Null | R3L1 | 300 |
| 1/1/2020 – Null | R4L1 | 400 |
| 1/1/2020 – Null | R5L1 | 500 |

Output ( representation  of routes for time slice 1/1/2020 – Null).

| Time | Route | Line order |
| --- | --- | --- |
| 1/1/2000 – 1/1/2020 | R1L1 | 100 |
| 1/1/2000 – 1/1/2020 | R2L1 | 200 |
| 1/1/2000 – 1/1/2020 | R3L1 | 300 |
| 1/1/2000 – 1/1/2020 | R4L1 | 400 |
| 1/1/2000 – 1/1/2020 | R5L1 | 500 |

| Time | Route | Line order |
| --- | --- | --- |
| 1/1/2020 – Null | R1L1 | 500 |
| 1/1/2020 – Null | R2L1 | 400 |
| 1/1/2020 – Null | R3L1 | 300 |
| 1/1/2020 – Null | R4L1 | 200 |
| 1/1/2020 – Null | R5L1 | 100 |

[figure: R1L1 · R2L1 · R3L1 · R4L1 · 100 · 200 · 300 · 400 · R5L1 · 500 · 1 · 5 · 15 · 10 · 105 · 65 · 60 · 115 · 110 · D1 · 25 · 0]

![Figure 14 — Time sliced routes – all routes in a line have similar time slices](../media/4983-reverse-line-orders-gp/fig-14-slide-16-time-sliced-routes-all-routes-in-a-line.svg)

### TC-U14 — Time Sliced Routes – Some Routes in a Line Have Different Time Slices <!-- src: S1 · slide 17 · case 43 -->

- **Case:** Time sliced routes – some routes in a line have different time slices (select only R3L1 (1/1/2010 – Null) as input

Output
All the routes which overlap with the selected route time slice will have their line order reversed.

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 |
| R2L1 | 1/1/2000 | Null | 200 |
| R3L1 | 1/1/2000 | 1/1/2010 | 300 |
| R3L1 | 1/1/2010 | Null | 300 |
| R4L1 | 1/1/2000 | 1/1/2010 | 400 |
| R4L1 | 1/1/2010 | Null | 400 |
| R5L1 | 1/1/2000 | Null | 500 |
| R6L1 | 1/1/2000 | Null | 600 |

| Route | From Date | To Date | Line Order output |
| --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 600 |
| R2L1 | 1/1/2000 | Null | 500 |
| R3L1 | 1/1/2000 | 1/1/2010 | 400 |
| R3L1 | 1/1/2010 | Null | 400 |
| R4L1 | 1/1/2000 | 1/1/2010 | 300 |
| R4L1 | 1/1/2010 | Null | 300 |
| R5L1 | 1/1/2000 | Null | 200 |
| R6L1 | 1/1/2000 | Null | 100 |

Check with a route from 1990 – 1999 and its line order should not have an impact.

[figure: R1L1 · R2L1 · R3L1 · R4L1 · 100 · 200 · 300 · 400 · R5L1 · 500 · 0 · 5 · 15 · 10 · 105 · 65 · 60 · 115 · D1 · 30 · R6L1 · 600 · 120 · Only select this]

![Figure 15 — Time sliced routes – some routes in a line have different time slices (select only R3L1 (1/1/2010 – Null) as input](../media/4983-reverse-line-orders-gp/fig-15-slide-17-time-sliced-routes-some-routes-in-a-line.svg)

### TC-U15 — Time Sliced Routes. All Routes in a Line Have Different Time Slices <!-- src: S1 · slide 18 · case 44 -->

- **Case:** Time sliced routes. All routes in a line have different time slices (select only R1L1 (2000 – null))

Output  All the routes which overlap with the selected route time slice will have their line order reversed.

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 |
| R2L1 | 1/1/2000 | Null | 200 |
| R3L1 | 1/1/2000 | 1/1/2010 | 300 |
| R3L1 | 1/1/2010 | Null | 300 |
| R4L1 | 1/1/2000 | 1/1/2010 | 400 |
| R4L1 | 1/1/2010 | Null | 400 |
| R5L1 | 1/1/2000 | Null | 500 |
| R6L1 | 1/1/2000 | Null | 600 |

| Route | From Date | To Date | Line Order output |
| --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 600 |
| R2L1 | 1/1/2000 | Null | 500 |
| R3L1 | 1/1/2000 | 1/1/2010 | 400 |
| R3L1 | 1/1/2010 | Null | 400 |
| R4L1 | 1/1/2000 | 1/1/2010 | 300 |
| R4L1 | 1/1/2010 | Null | 300 |
| R5L1 | 1/1/2000 | Null | 200 |
| R6L1 | 1/1/2000 | Null | 100 |

[figure: R1L1 · R2L1 · R3L1 · R4L1 · 100 · 200 · 300 · 400 · R5L1 · 500 · 0 · 5 · 15 · 10 · 105 · 65 · 60 · 115 · D1 · 30 · R6L1 · 600 · 120 · Only select this]

![Figure 16 — Time sliced routes. All routes in a line have different time slices (select only R1L1 (2000 – null))](../media/4983-reverse-line-orders-gp/fig-16-slide-18-time-sliced-routes-all-routes-in-a-line.svg)

### TC-U16 — Time Sliced Routes – All Routes in a Line Have Different Time Slices (case 45) <!-- src: S1 · slide 19 · case 45 -->

- **Case:** Time sliced routes – all routes in a line have different time slices, select only R2L1 (2000 – 2005)

Output  Any route the routes which overlap with the selected route time slice will have their line order reversed.

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 |
| R2L1 | 1/1/2000 | 1/1/2005 | 200 |
| R3L1 | 1/1/2005 | 1/1/2015 | 200 |
| R3L1 | 1/1/2015 | Null | 200 |
| R4L1 | 1/1/2005 | 1/1/2015 | 300 |
| R4L1 | 1/1/2015 | Null | 300 |
| R5L1 | 1/1/2016 | Null | 400 |
| R6L1 | 1/1/2018 | Null | 500 |

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 500 |
| R2L1 | 1/1/2000 | 1/1/2005 | 400 |
| R3L1 | 1/1/2005 | 1/1/2015 | 400 |
| R3L1 | 1/1/2015 | Null | 400 |
| R4L1 | 1/1/2005 | 1/1/2015 | 300 |
| R4L1 | 1/1/2015 | Null | 300 |
| R5L1 | 1/1/2016 | Null | 200 |
| R6L1 | 1/1/2018 | Null | 100 |

[figure: R1L1 · R2L1 · R3L1 · R4L1 · 100 · 200 · 300 · R5L1 · 400 · 0 · 5 · 15 · 10 · 105 · 65 · 60 · 115 · D1 · 30 · R6L1 · 500 · 120 · Only select this]

![Figure 17 — Time sliced routes – all routes in a line have different time slices, select only R2L1 (2000 – 2005)](../media/4983-reverse-line-orders-gp/fig-17-slide-19-time-sliced-routes-all-routes-in-a-line.svg)

### TC-U17 — Time Sliced Routes – All Routes in a Line Have Different Time Slices (case 46) <!-- src: S1 · slide 20 · case 46 -->

- **Case:** Time sliced routes – all routes in a line have different time slices - select only R2L1 (1995 - null)

Output  All the routes which overlap with the selected route time slice will have their line order reversed.

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L1 | 1/1/1995 | null | 100 |
| R2L1 | 1/1/1995 | 1/1/2005 | 200 |
| R3L1 | 1/1/2005 | 1/1/2010 | 200 |
| R3L1 | 1/1/2010 | Null | 200 |
| R4L1 | 1/1/2008 | 1/1/2012 | 300 |
| R4L1 | 1/1/2012 | Null | 300 |
| R5L1 | 1/1/2008 | Null | 400 |
| R6L1 | 1/1/2012 | Null | 500 |

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L1 | 1/1/1995 | null | 500 |
| R2L1 | 1/1/1995 | 1/1/2005 | 400 |
| R3L1 | 1/1/2005 | 1/1/2010 | 400 |
| R3L1 | 1/1/2010 | Null | 400 |
| R4L1 | 1/1/2008 | 1/1/2012 | 300 |
| R4L1 | 1/1/2012 | Null | 300 |
| R5L1 | 1/1/2008 | Null | 200 |
| R6L1 | 1/1/2012 | Null | 100 |

[figure: R1L1 · R2L1 · R3L1 · R4L1 · 100 · 200 · 300 · R5L1 · 400 · 0 · 5 · 15 · 10 · 105 · 65 · 60 · 115 · D1 · 30 · R6L1 · 500 · 120 · Only select this]

![Figure 18 — Time sliced routes – all routes in a line have different time slices - select only R2L1 (1995 - null)](../media/4983-reverse-line-orders-gp/fig-18-slide-20-time-sliced-routes-all-routes-in-a-line.svg)

### TC-U18 — Time Sliced Routes <!-- src: S1 · slide 21 · case 47 -->

- **Case:** Time sliced routes – A line having routes of multiple time slices. Select all the routes and reverse . R2L1 is reassigned to R3L1 during 1/1/2015.

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 100 |
| R2L1 | 1/1/2005 | 1/1/2015 | 200 |
| R3L1 | 1/1/2005 | 1/1/2015 | 300 |
| R3L1 | 1/1/2015 | Null | 200 |
| R4L1 | 1/1/2010 | 1/1/2015 | 400 |
| R4L1 | 1/1/2015 | Null | 300 |
| R5L1 | 1/1/2020 | Null | 400 |
| R6L1 | 1/1/2025 | Null | 500 |

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L1 | 1/1/2000 | Null | 500 |
| R2L1 | 1/1/2005 | 1/1/2015 | 400 |
| R3L1 | 1/1/2005 | 1/1/2015 | 300 |
| R3L1 | 1/1/2015 | Null | 400 |
| R4L1 | 1/1/2010 | 1/1/2015 | 200 |
| R4L1 | 1/1/2015 | Null | 300 |
| R5L1 | 1/1/2020 | Null | 200 |
| R6L1 | 1/1/2025 | Null | 100 |

[figure: R1L1 · R2L1 · R3L1 · R4L1 · R5L1 · R6L1 · Output : · D1]

![Figure 19 — Time sliced routes – A line having routes of multiple time slices. Select all the routes and reverse . R2L1 is reassigned to R3L1 during 1/1/2015.](../media/4983-reverse-line-orders-gp/fig-19-slide-21-time-sliced-routes-a-line-having-routes.svg)

### TC-U19 — Time Sliced Routes – A Line Having Routes of Multiple Time Slices <!-- src: S1 · slide 22 · case 48 -->

- **Case:** Time sliced routes – A line having routes of multiple time slices – also verify the out put warning message.

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L2 | 1/1/2000 | 1/1/2004 | 300 |
| R1L2 | 1/1/2004 | null | 300 |
| R2L2 | 1/1/1995 | 1/1/1997 | 100 |
| R2L2 | 1/1/2000 | 1/1/2004 | 100 |
| R2L2 | 1/1/2004 | null | 100 |
| R3L2 | 1/1/1995 | 1/1/1997 | 200 |
| R3L2 | 1/1/2000 | 1/1/2004 | 200 |
| R3L2 | 1/1/2004 | null | 200 |

| Route | From Date | To Date | Line Order Input |
| --- | --- | --- | --- |
| R1L2 | 1/1/2000 | 1/1/2004 | 300 |
| R1L2 | 1/1/2004 | null | 200 |
| R2L2 | 1/1/1995 | 1/1/1997 | 100 |
| R2L2 | 1/1/2000 | 1/1/2004 | 100 |
| R2L2 | 1/1/2004 | null | 100 |
| R3L2 | 1/1/1995 | 1/1/1997 | 200 |
| R3L2 | 1/1/2000 | 1/1/2004 | 00 |
| R3L2 | 1/1/2004 | null | 300 |

Check derive route representation

[figure: R1L2 · R2L2 · R3L2 · Output : · D1 · Only select this · 100 · 200 · 300]

![Figure 20 — Time sliced routes – A line having routes of multiple time slices – also verify the out put warning message.](../media/4983-reverse-line-orders-gp/fig-20-slide-22-time-sliced-routes-a-line-having-routes.svg)

## Other content

### Slide 3 <!-- slide 3 -->

UI test cases

- There is no default value for the network feature class
- Only the line network should show up in the drop down  All network should show up and give an error if the tool is run or loaded in the network drop down.
- Test in light and Dark mode
- The information next to the input parameter should show up proper message
- Do we need to show a warning or just document it? if only few routes on a line is selected:“ If only a route/ few routes are selected in a line network , the line order for the all the routes for the selected time range will be reversed.” – only add it in the doc
- Verify undo / redo functionality (FS – version)

Conflict Prevention test cases

- Verify lock is acquired for the line if the line order is reversed and a message is displayed for acquiring locks.
- If the line is already locked by a different user in another version, provide error message (locked by editing a route locked by editing an event).
- If the line is already locked by the same user in the same editing version, no further locks are acquired and proceed with the tool.
- In the positive test case, select routes belonging to more than one line and run the tool. All the lines belonging to the chosen routes should have their line order reversed and locks acquired.
- Verify entire workflow for conflict prevention (release locks, auto release lock in default, releasable status message in locks table).
- Test with event that span / not span routes and generate events to see any thing changes ?  Shapes should not change for events and nothing breaks on route.
- Test with generate events and DEM GP tool and see if any thing changes , before I do the flip.
- Expected: Report the out put to team after scrum.
